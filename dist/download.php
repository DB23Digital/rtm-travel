<?php
// download.php — gate for the corporate travel policy template.
//
// POST  (JSON)  : { name, email, company, consent }  -> records the lead, mails
//                 anthea@, and returns signed, short-lived download links.
// GET   ?file=&exp=&sig=  : streams the file if the signature is still valid.
//
// The files themselves live in downloads/, which is blocked from direct HTTP
// access by downloads/.htaccess — PHP reads them off disk, so the old public URL
// can no longer be shared around the gate.

declare(strict_types=1);

const FILES = [
    'docx' => [
        'path' => 'downloads/corporate-travel-policy-template.docx',
        'name' => 'RTM-Travel-Corporate-Travel-Policy-Template.docx',
        'type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    'html' => [
        'path' => 'downloads/corporate-travel-policy-template.html',
        'name' => 'RTM-Travel-Corporate-Travel-Policy-Template.html',
        'type' => 'text/html; charset=UTF-8',
    ],
];

const LINK_TTL = 3600;        // signed links last an hour
const RECIPIENT = 'anthea@rtmtravel.co.za';

/**
 * Writable directory above the web root, for the lead CSV and the signing key.
 * Falls back to the script directory only if the parent is not writable, in
 * which case .htaccess denial is the remaining protection.
 */
function private_dir(): string
{
    $candidates = [
        dirname($_SERVER['DOCUMENT_ROOT'] ?? __DIR__) . '/rtm-private',
        dirname(__DIR__) . '/rtm-private',
        __DIR__ . '/rtm-private',
    ];
    foreach ($candidates as $dir) {
        if (is_dir($dir) || @mkdir($dir, 0700, true)) {
            if (is_writable($dir)) {
                return $dir;
            }
        }
    }
    return sys_get_temp_dir();
}

function signing_secret(): string
{
    $env = getenv('RTM_DOWNLOAD_SECRET');
    if (is_string($env) && $env !== '') {
        return $env;
    }
    $file = private_dir() . '/download-secret.key';
    if (is_readable($file)) {
        $secret = trim((string) file_get_contents($file));
        if ($secret !== '') {
            return $secret;
        }
    }
    $secret = bin2hex(random_bytes(32));
    @file_put_contents($file, $secret, LOCK_EX);
    @chmod($file, 0600);
    return $secret;
}

function sign(string $key, int $exp): string
{
    return hash_hmac('sha256', $key . '|' . $exp, signing_secret());
}

function json_out(int $code, array $payload): void
{
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($payload);
    exit;
}

// ── GET: serve a signed file ────────────────────────────────────────────────
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
    $key = (string) ($_GET['file'] ?? '');
    $exp = (int) ($_GET['exp'] ?? 0);
    $sig = (string) ($_GET['sig'] ?? '');

    if (!isset(FILES[$key]) || $exp < time() || !hash_equals(sign($key, $exp), $sig)) {
        http_response_code(403);
        header('Content-Type: text/plain; charset=UTF-8');
        echo "This download link has expired. Request the template again at https://rtmtravel.co.za/corporate-travel-policy-template";
        exit;
    }

    $file = FILES[$key];
    $path = __DIR__ . '/' . $file['path'];
    if (!is_readable($path)) {
        http_response_code(500);
        echo 'File unavailable.';
        exit;
    }

    header('Content-Type: ' . $file['type']);
    header('Content-Disposition: attachment; filename="' . $file['name'] . '"');
    header('Content-Length: ' . filesize($path));
    header('X-Robots-Tag: noindex, nofollow');
    header('Cache-Control: private, no-store');
    readfile($path);
    exit;
}

// ── POST: capture the lead ──────────────────────────────────────────────────
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_out(405, ['status' => 'error', 'message' => 'Method not allowed.']);
}

header('Content-Type: application/json');

$data = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($data)) {
    $data = $_POST;
}

$name    = strip_tags(trim((string) ($data['name'] ?? '')));
$company = strip_tags(trim((string) ($data['company'] ?? '')));
$email   = trim((string) ($data['email'] ?? ''));
$consent = filter_var($data['consent'] ?? false, FILTER_VALIDATE_BOOLEAN);
$honey   = trim((string) ($data['website'] ?? ''));   // hidden field, must stay empty

if ($honey !== '') {
    json_out(200, ['status' => 'success', 'message' => 'Thank you.', 'files' => []]);
}
if ($name === '' || $company === '') {
    json_out(400, ['status' => 'error', 'message' => 'Please give us your name and company.']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_out(400, ['status' => 'error', 'message' => 'Please enter a valid work email address.']);
}
if (!$consent) {
    json_out(400, ['status' => 'error', 'message' => 'Please tick the consent box so we may send you the template.']);
}

$row = [
    gmdate('c'),
    $name,
    $email,
    $company,
    'consented',
    (string) ($_SERVER['REMOTE_ADDR'] ?? ''),
    strip_tags(trim((string) ($data['source'] ?? 'corporate-travel-policy-template'))),
];

$csv = private_dir() . '/template-leads.csv';
$new = !file_exists($csv);
$fh = @fopen($csv, 'a');
if ($fh) {
    if (flock($fh, LOCK_EX)) {
        if ($new) {
            fputcsv($fh, ['timestamp_utc', 'name', 'email', 'company', 'popia_consent', 'ip', 'source']);
        }
        fputcsv($fh, $row);
        flock($fh, LOCK_UN);
    }
    fclose($fh);
    @chmod($csv, 0600);
}

$body  = "New corporate travel policy template download.\n\n";
$body .= "Name: $name\n";
$body .= "Work email: $email\n";
$body .= "Company: $company\n";
$body .= "POPIA consent: yes, given at " . gmdate('Y-m-d H:i') . " UTC\n";
$body .= "Source page: {$row[6]}\n";
@mail(
    RECIPIENT,
    "Template download: $name ($company)",
    $body,
    "From: RTM Travel Website <no-reply@rtmtravel.co.za>\r\nReply-To: $name <$email>"
);

$exp = time() + LINK_TTL;
json_out(200, [
    'status' => 'success',
    'message' => 'Thank you. Your template is ready below, and a copy of this request has gone to our team.',
    'files' => [
        ['label' => 'Download the editable Word version', 'url' => 'download.php?file=docx&exp=' . $exp . '&sig=' . sign('docx', $exp)],
        ['label' => 'Open the printable version', 'url' => 'download.php?file=html&exp=' . $exp . '&sig=' . sign('html', $exp)],
    ],
]);
