<?php
// contact.php - Handles form submissions from RTM Travel Website

// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only process POST requests
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Get JSON POST body if fetch is used, otherwise get regular form POST
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if($data) {
        // Fetch from JS
        $firstName = strip_tags(trim($data["first-name"] ?? ''));
        $lastName = strip_tags(trim($data["last-name"] ?? ''));
        $company = strip_tags(trim($data["company"] ?? ''));
        $email = filter_var(trim($data["email"] ?? ''), FILTER_SANITIZE_EMAIL);
        $contactNumber = strip_tags(trim($data["contact-number"] ?? ''));
        $subjectSelection = strip_tags(trim($data["subject"] ?? ''));
        $message = strip_tags(trim($data["message"] ?? ''));
    } else {
        // Standard form submit (fallback)
        $firstName = strip_tags(trim($_POST["First_name"] ?? $_POST["first-name"] ?? ''));
        $lastName = strip_tags(trim($_POST["Last_name"] ?? $_POST["last-name"] ?? ''));
        $company = strip_tags(trim($_POST["Company"] ?? $_POST["company"] ?? ''));
        $email = filter_var(trim($_POST["Email"] ?? $_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
        $contactNumber = strip_tags(trim($_POST["Contact_number"] ?? $_POST["contact-number"] ?? ''));
        $subjectSelection = strip_tags(trim($_POST["Subject"] ?? $_POST["subject"] ?? ''));
        $message = strip_tags(trim($_POST["Message"] ?? $_POST["message"] ?? ''));
    }

    // Check that data was sent to the mailer
    if (empty($firstName) || empty($lastName) || empty($email)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Please complete all required fields."]);
        exit;
    }

    // Set the recipient email address.
    $recipient = "anthea@rtmtravel.co.za";

    // Set the email subject.
    $subject = !empty($subjectSelection) ? "New Enquiry: $subjectSelection from $firstName $lastName ($company)" : "New Corporate Travel Enquiry from $firstName $lastName ($company)";

    // Build the email content.
    $email_content = "Name: $firstName $lastName\n";
    $email_content .= "Company: $company\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Contact Number: $contactNumber\n";
    $email_content .= "Subject: $subjectSelection\n\n";
    $email_content .= "Message:\n$message\n";

    // Build the email headers.
    $email_headers = "From: $firstName $lastName <$email>";

    // Send the email.
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        // Set a 200 (okay) response code.
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Thank You! Your message has been sent."]);
    } else {
        // Set a 500 (internal server error) response code.
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Oops! Something went wrong and we couldn't send your message."]);
    }

} else {
    // Not a POST request, set a 403 (forbidden) response code.
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "There was a problem with your submission, please try again."]);
}
?>
