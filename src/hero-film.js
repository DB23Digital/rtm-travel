// RTM Travel scroll-film hero: aircraft window -> four landmarks -> cabin.
// Piecewise scroll->frame curve with flat dwell bands ("stop-motion sections").
// Frames are decoded off-thread via ImageBitmap in a sliding window around the
// playhead so scrubbing never triggers a synchronous JPEG decode on the main thread.

const FRAME_COUNT = 361; // 0..360, native 24fps extraction of assets/RTM_travel.mp4

// The only place the four landmark frame indices exist. Recomputed against the
// extracted frame set (1:1 with the source timeline, so no rescale needed).
const CHAPTERS = [
    { label: 'Departure', frame: 0, holdVh: 90 },
    { label: 'Eiffel Tower', frame: 116, holdVh: 110, travelInVh: 150 },
    { label: 'London Eye', frame: 150, holdVh: 110, travelInVh: 150 },
    { label: 'Statue of Liberty', frame: 240, holdVh: 110, travelInVh: 150 },
    { label: 'Table Mountain', frame: 295, holdVh: 110, travelInVh: 150 },
    { label: 'Home', frame: 360, travelInVh: 150 },
];

// Build the piecewise segment list: travel, hold, travel, hold, ... travel.
function buildSegments(chapters) {
    const segments = [];
    if (chapters[0].holdVh) {
        segments.push({ type: 'hold', vh: chapters[0].holdVh, frame: chapters[0].frame, label: chapters[0].label, chapterIndex: 0 });
    }
    for (let i = 1; i < chapters.length; i++) {
        const prev = chapters[i - 1];
        const cur = chapters[i];
        segments.push({ type: 'travel', vh: cur.travelInVh, from: prev.frame, to: cur.frame });
        if (cur.holdVh) {
            segments.push({ type: 'hold', vh: cur.holdVh, frame: cur.frame, label: cur.label, chapterIndex: i });
        }
    }
    return segments;
}

const SEGMENTS = buildSegments(CHAPTERS);
const TOTAL_VH = SEGMENTS.reduce((sum, s) => sum + s.vh, 0);
const HOLD_SEGMENTS = SEGMENTS.filter((s) => s.type === 'hold');

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;

// p in [0,1] (overall scroll progress through the driver) -> fractional frame index.
function progressToFrame(p) {
    const scrollVh = clamp(p, 0, 1) * TOTAL_VH;
    let acc = 0;
    for (const seg of SEGMENTS) {
        const segEnd = acc + seg.vh;
        if (scrollVh <= segEnd || seg === SEGMENTS[SEGMENTS.length - 1]) {
            const t = clamp((scrollVh - acc) / seg.vh, 0, 1);
            return seg.type === 'hold' ? seg.frame : lerp(seg.from, seg.to, t);
        }
        acc = segEnd;
    }
    return CHAPTERS[CHAPTERS.length - 1].frame;
}

// Envelope for a single hold's panel: 0 outside, ramps in/out around the hold band.
function holdEnvelope(scrollVh, hold, fadeVh) {
    const start = hold.vhStart;
    const end = hold.vhStart + hold.vh;
    if (scrollVh < start - fadeVh || scrollVh > end + fadeVh) return 0;
    if (scrollVh < start) return (scrollVh - (start - fadeVh)) / fadeVh;
    if (scrollVh > end) return 1 - (scrollVh - end) / fadeVh;
    return 1;
}

// Annotate each hold segment with its absolute vh start (needed for envelopes).
(function annotateHoldStarts() {
    let acc = 0;
    for (const seg of SEGMENTS) {
        if (seg.type === 'hold') seg.vhStart = acc;
        acc += seg.vh;
    }
})();

export function mountHeroFilm(section) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return; // stay on the static CSS fallback

    const canvas = section.querySelector('#hero-canvas');
    const stage = section.querySelector('.hero-stage');
    const nav = document.querySelector('nav');
    const loader = section.querySelector('#hero-loader');
    const loaderBar = section.querySelector('#hero-loader-bar');
    const chapterLabel = section.querySelector('#hero-chapter-label');
    const chapterFill = section.querySelector('#hero-chapter-fill');
    const chapterReadout = section.querySelector('#hero-chapter-readout');
    const arcMarker = section.querySelector('#hero-arc-marker');
    const seamFade = section.querySelector('#hero-seam-fade');
    const panels = Array.from(section.querySelectorAll('.hero-panel'));

    if (!canvas || !canvas.getContext || typeof window.createImageBitmap !== 'function') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isNarrow = window.matchMedia('(max-width: 820px)').matches;
    const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
    const framesRoot = `${baseUrl}assets/hero-film/${isNarrow ? '720' : '1280'}/`;
    const frameUrl = (i) => `${framesRoot}frame_${String(i).padStart(3, '0')}.jpg`;

    // ---- Sliding-window ImageBitmap cache -------------------------------
    const WINDOW_RADIUS = 18;
    // The window itself spans up to 2*WINDOW_RADIUS+1 frames, so the cache cap
    // must sit comfortably above that or eviction can never do anything (it
    // refuses to evict anything inside the current window) and the cache -
    // and the per-tick eviction sort over it - grows unbounded while scrolling.
    const MAX_CACHE = 90;
    const CONCURRENCY = 10;
    const cache = new Map(); // index -> { status: 'queued'|'loading'|'ready', bitmap? }
    const pending = [];
    let inFlight = 0;
    let lastDrawnIndex = -1;
    let needsRepaint = false;

    function pump() {
        while (inFlight < CONCURRENCY && pending.length) {
            const idx = pending.shift();
            const entry = cache.get(idx);
            if (!entry || entry.status === 'ready') continue;
            entry.status = 'loading';
            inFlight++;
            loadOne(idx).finally(() => {
                inFlight--;
                pump();
            });
        }
    }

    async function loadOne(idx) {
        try {
            const res = await fetch(frameUrl(idx));
            if (!res.ok) throw new Error('frame fetch failed');
            const blob = await res.blob();
            const bitmap = await createImageBitmap(blob);
            if (!cache.has(idx)) {
                bitmap.close();
                return;
            }
            cache.set(idx, { status: 'ready', bitmap });
            if (idx === lastDrawnIndex) needsRepaint = true;
            onBootFrameReady(idx);
        } catch {
            cache.delete(idx); // allow a later retry via nearestFrame's normal re-request
        }
    }

    function enqueue(idx, priority) {
        if (idx < 0 || idx >= FRAME_COUNT || cache.has(idx)) return;
        cache.set(idx, { status: 'queued' });
        if (priority) pending.unshift(idx);
        else pending.push(idx);
        pump();
    }

    function ensureWindow(centerIndex) {
        // Nearest-to-playhead first, so a fast scroll fills in the visible
        // frame before it spends bandwidth on the edges of the window.
        for (let d = 0; d <= WINDOW_RADIUS; d++) {
            enqueue(centerIndex + d, false);
            if (d > 0) enqueue(centerIndex - d, false);
        }
        if (cache.size > MAX_CACHE) {
            const byDistance = [...cache.keys()].sort(
                (a, b) => Math.abs(b - centerIndex) - Math.abs(a - centerIndex)
            );
            for (const idx of byDistance) {
                if (cache.size <= MAX_CACHE) break;
                if (Math.abs(idx - centerIndex) <= WINDOW_RADIUS) break;
                const entry = cache.get(idx);
                if (entry?.bitmap) entry.bitmap.close();
                cache.delete(idx);
            }
        }
    }

    function nearestFrame(idx) {
        const exact = cache.get(idx);
        if (exact?.status === 'ready') return { index: idx, bitmap: exact.bitmap };
        for (let d = 1; d <= WINDOW_RADIUS; d++) {
            const lo = cache.get(idx - d);
            if (lo?.status === 'ready') return { index: idx - d, bitmap: lo.bitmap };
            const hi = cache.get(idx + d);
            if (hi?.status === 'ready') return { index: idx + d, bitmap: hi.bitmap };
        }
        return null;
    }

    // ---- Boot: prewarm frame 0 + the four hold frames --------------------
    const bootSet = [0, ...HOLD_SEGMENTS.map((h) => h.frame)];
    let bootReadyCount = 0;
    let bootResolved = false;
    let resolveBoot;
    const bootPromise = new Promise((resolve) => {
        resolveBoot = resolve;
    });

    function onBootFrameReady(idx) {
        if (!bootSet.includes(idx)) return;
        bootReadyCount++;
        if (loaderBar) loaderBar.style.width = `${Math.round((bootReadyCount / bootSet.length) * 100)}%`;
        if (idx === 0 && !bootResolved) {
            bootResolved = true;
            resolveBoot();
        }
    }
    bootSet.forEach((idx, i) => enqueue(idx, i === 0));

    // ---- Canvas sizing (DPR capped at 1.5) --------------------------------
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    function resizeCanvas() {
        const w = stage.clientWidth || window.innerWidth;
        const h = stage.clientHeight || window.innerHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        needsRepaint = true;
    }
    let resizeRaf;
    window.addEventListener('resize', () => {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(resizeCanvas);
    });
    resizeCanvas();

    function drawBitmap(bitmap) {
        const scale = Math.max(canvas.width / bitmap.width, canvas.height / bitmap.height);
        const w = bitmap.width * scale;
        const h = bitmap.height * scale;
        const x = (canvas.width - w) / 2;
        const y = (canvas.height - h) / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bitmap, x, y, w, h);
    }

    // ---- Adaptive header (sample drawn frame's top strip) ----------------
    const headerSample = document.createElement('canvas');
    headerSample.width = 16;
    headerSample.height = 4;
    const headerCtx = headerSample.getContext('2d', { willReadFrequently: true });
    let lastHeaderSampleAt = 0;
    function sampleHeader(now) {
        if (!nav || now - lastHeaderSampleAt < 180 || !canvas.width) return;
        lastHeaderSampleAt = now;
        const navRect = nav.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        const overNav = sectionRect.top <= navRect.bottom && sectionRect.bottom > 0;
        if (!overNav) {
            nav.classList.remove('on-light');
            return;
        }
        const stripH = Math.max(1, Math.round(canvas.height * 0.12));
        headerCtx.drawImage(canvas, 0, 0, canvas.width, stripH, 0, 0, 16, 4);
        const data = headerCtx.getImageData(0, 0, 16, 4).data;
        let sum = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
            sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
            count++;
        }
        nav.classList.toggle('on-light', sum / count > 138);
    }

    // ---- Scroll progress ---------------------------------------------------
    let latestProgress = 0;
    let latestScrollVh = 0;
    let lastScrollY = window.scrollY;
    let scrollingDown = true;
    function readProgress() {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const scrollable = rect.height - vh;
        const p = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
        latestProgress = p;
        latestScrollVh = p * TOTAL_VH;
        const y = window.scrollY;
        if (Math.abs(y - lastScrollY) > 0.5) scrollingDown = y > lastScrollY;
        lastScrollY = y;
    }
    let scrollQueued = false;
    window.addEventListener(
        'scroll',
        () => {
            if (scrollQueued) return;
            scrollQueued = true;
            requestAnimationFrame(() => {
                readProgress();
                scrollQueued = false;
            });
        },
        { passive: true }
    );
    readProgress();

    // ---- Panels --------------------------------------------------------
    function updatePanels() {
        for (const panel of panels) {
            const chapterIdx = Number(panel.dataset.chapterIndex);
            const hold = HOLD_SEGMENTS.find((h) => h.chapterIndex === chapterIdx);
            if (!hold) continue;
            const fadeVh = hold.vh * 0.4;
            const alpha = holdEnvelope(latestScrollVh, hold, fadeVh);
            panel.style.opacity = String(alpha);
            const offset = (1 - alpha) * 22 * (scrollingDown ? 1 : -1);
            panel.style.transform = `translateY(${offset}px)`;
            panel.classList.toggle('is-visible', alpha > 0.02);
        }
    }

    // ---- Chapter readout + flight-arc marker ------------------------------
    const arcPath = section.querySelector('#hero-arc-path');
    const arcLength = arcPath ? arcPath.getTotalLength() : 0;
    function updateChapterReadout() {
        let active = HOLD_SEGMENTS[0];
        for (const hold of HOLD_SEGMENTS) {
            if (latestScrollVh >= hold.vhStart - hold.vh * 0.4) active = hold;
        }
        if (chapterLabel) chapterLabel.textContent = active.label;
        if (chapterFill) chapterFill.style.width = `${Math.round(latestProgress * 100)}%`;
        if (arcMarker && arcPath && arcLength) {
            const pt = arcPath.getPointAtLength(clamp(latestProgress, 0, 1) * arcLength);
            arcMarker.setAttribute('cx', String(pt.x));
            arcMarker.setAttribute('cy', String(pt.y));
        }
        if (chapterReadout) {
            chapterReadout.classList.toggle('is-visible', latestProgress > 0.005 && latestProgress < 0.998);
        }
    }

    // ---- Seam into next section --------------------------------------------
    function updateSeam() {
        if (!seamFade) return;
        const lastTravel = SEGMENTS[SEGMENTS.length - 1];
        const bandStart = TOTAL_VH - lastTravel.vh * 0.92; // last ~8% of final travel
        const t = clamp((latestScrollVh - bandStart) / (TOTAL_VH - bandStart), 0, 1);
        seamFade.style.opacity = String(t);
    }

    // ---- Jank instrumentation (Step 9) -------------------------------------
    window.__heroFilmStats = { deltas: [] };
    let lastFrameTime = performance.now();

    // ---- Main loop -----------------------------------------------------
    let currentFrame = 0;
    let settled = false;
    function tick(now) {
        const delta = now - lastFrameTime;
        lastFrameTime = now;
        window.__heroFilmStats.deltas.push(delta);
        if (window.__heroFilmStats.deltas.length > 600) window.__heroFilmStats.deltas.shift();

        const targetFrame = progressToFrame(latestProgress);
        currentFrame += (targetFrame - currentFrame) * 0.14;
        if (Math.abs(targetFrame - currentFrame) < 0.02) currentFrame = targetFrame;
        const drawIndex = clamp(Math.round(currentFrame), 0, FRAME_COUNT - 1);

        ensureWindow(Math.round(targetFrame));
        const found = nearestFrame(drawIndex);
        if (found && (found.index !== lastDrawnIndex || needsRepaint)) {
            drawBitmap(found.bitmap);
            lastDrawnIndex = found.index;
            needsRepaint = false;
        }

        sampleHeader(now);
        updatePanels();
        updateChapterReadout();
        updateSeam();

        if (!settled && Math.round(currentFrame) === Math.round(targetFrame)) settled = true;

        requestAnimationFrame(tick);
    }

    // ---- Boot sequence ---------------------------------------------------
    bootPromise.then(() => {
        section.classList.add('hero-film-active');
        // The stage only becomes the real 100vh sticky box once the class above
        // applies; re-measure now, not at the pre-activation (huge, stacked) size.
        resizeCanvas();
        const first = cache.get(0);
        if (first?.bitmap) {
            drawBitmap(first.bitmap);
            lastDrawnIndex = 0;
        }
        if (loader) loader.classList.add('is-hidden');
        requestAnimationFrame(tick);

        // Dev verify contract: ?jump=<vh> scrolls straight to a scroll position.
        const params = new URLSearchParams(location.search);
        const jump = params.get('jump');
        if (jump !== null) {
            history.scrollRestoration = 'manual';
            requestAnimationFrame(() => {
                window.scrollTo(0, Number(jump) || 0);
                readProgress();
                requestAnimationFrame(() => {
                    window.__ready = true;
                });
            });
        } else {
            window.__ready = true;
        }
    });

    // Boot timeout: if frame 0 never loads, leave the static fallback in place.
    setTimeout(() => {
        if (!bootResolved) window.__ready = true; // stay static, still "ready" for QA scripts
    }, 8000);
}
