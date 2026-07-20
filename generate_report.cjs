const fs = require('fs');

const template = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SEO Strategy Report — {{ARTICLE_TITLE}}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #0a0a0f;
    --bg-card: rgba(255,255,255,0.03);
    --bg-card-hover: rgba(255,255,255,0.06);
    --border: rgba(255,255,255,0.08);
    --border-hover: rgba(255,255,255,0.15);
    --text: #e8e8ed;
    --text-secondary: #8b8b9e;
    --text-muted: #5a5a6e;
    --accent: #6366f1;
    --accent-glow: rgba(99,102,241,0.3);
    --green: #22c55e;
    --green-bg: rgba(34,197,94,0.12);
    --green-border: rgba(34,197,94,0.25);
    --yellow: #eab308;
    --yellow-bg: rgba(234,179,8,0.12);
    --yellow-border: rgba(234,179,8,0.25);
    --red: #ef4444;
    --red-bg: rgba(239,68,68,0.12);
    --red-border: rgba(239,68,68,0.25);
    --blue: #3b82f6;
    --blue-bg: rgba(59,130,246,0.12);
    --orange: #f97316;
    --orange-bg: rgba(249,115,22,0.12);
    --orange-border: rgba(249,115,22,0.25);
    --radius: 16px;
    --radius-sm: 10px;
    --radius-xs: 6px;
  }

  ::selection { background: var(--accent); color: white; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.06) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.04) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 80%, rgba(59,130,246,0.03) 0%, transparent 50%);
    z-index: -1;
    animation: ambientDrift 20s ease-in-out infinite;
  }
  @keyframes ambientDrift {
    0%, 100% { transform: translate(0, 0); }
    33% { transform: translate(-2%, 1%); }
    66% { transform: translate(1%, -1%); }
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

  .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

  .header { padding: 40px 0 0; text-align: center; }
  .header-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px;
    background: var(--bg-card); border: 1px solid var(--border); border-radius: 100px;
    font-size: 12px; font-weight: 500; color: var(--text-secondary); text-transform: uppercase;
    letter-spacing: 1.5px; margin-bottom: 20px;
  }
  .header-badge .dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--green);
    box-shadow: 0 0 8px var(--green); animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  .header h1 {
    font-family: 'Space Grotesk', sans-serif; font-size: 42px; font-weight: 700;
    line-height: 1.15; margin-bottom: 12px;
    background: linear-gradient(135deg, #fff 0%, #a5a5c0 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .header .subtitle { font-size: 16px; color: var(--text-secondary); margin-bottom: 32px; }

  .tabs {
    position: sticky; top: 0; z-index: 100;
    background: rgba(10,10,15,0.85); backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); padding: 0;
  }
  .tabs-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; gap: 0;
    overflow-x: auto; scrollbar-width: none;
  }
  .tabs-inner::-webkit-scrollbar { display: none; }
  .tab-btn {
    padding: 16px 24px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500;
    color: var(--text-muted); background: none; border: none; border-bottom: 2px solid transparent;
    cursor: pointer; white-space: nowrap; transition: all 0.2s; position: relative;
  }
  .tab-btn:hover { color: var(--text-secondary); }
  .tab-btn.active { color: var(--text); border-bottom-color: var(--accent); }
  .tab-btn .tab-count {
    display: inline-flex; align-items: center; justify-content: center; min-width: 20px;
    height: 20px; padding: 0 6px; background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 100px; font-size: 11px; font-weight: 600; margin-left: 8px; color: var(--text-secondary);
  }
  .tab-btn.active .tab-count { background: var(--accent); border-color: var(--accent); color: white; }

  .tab-content { display: none; padding: 40px 0 80px; }
  .tab-content.active { display: block; }

  .score-section {
    display: flex; align-items: center; gap: 48px; margin-bottom: 40px; padding: 40px;
    background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
    backdrop-filter: blur(20px);
  }
  .score-circle-wrap { position: relative; flex-shrink: 0; }
  .score-circle {
    width: 180px; height: 180px; border-radius: 50%; display: flex; align-items: center;
    justify-content: center; flex-direction: column; position: relative;
  }
  .score-circle svg {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%; transform: rotate(-90deg);
  }
  .score-circle svg circle { fill: none; stroke-width: 6; stroke-linecap: round; }
  .score-circle svg .bg-ring { stroke: rgba(255,255,255,0.06); }
  .score-circle svg .progress-ring {
    stroke: var(--accent); stroke-dasharray: 502; stroke-dashoffset: {{SCORE_DASHOFFSET}};
    filter: drop-shadow(0 0 6px var(--accent-glow)); transition: stroke-dashoffset 1.5s ease-out;
  }
  .score-number {
    font-family: 'Space Grotesk', sans-serif; font-size: 56px; font-weight: 700;
    line-height: 1; color: white; position: relative; z-index: 1;
  }
  .score-label {
    font-size: 13px; color: var(--text-secondary); font-weight: 500;
    position: relative; z-index: 1; margin-top: 4px;
  }
  .score-details { flex: 1; }
  .score-details h2 {
    font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 600; margin-bottom: 8px;
  }
  .score-details p {
    color: var(--text-secondary); font-size: 15px; line-height: 1.7; margin-bottom: 20px;
  }

  .sub-scores { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
  .sub-score {
    padding: 14px 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: var(--radius-sm);
  }
  .sub-score-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 6px; }
  .sub-score-value { font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 700; }
  .sub-score-bar {
    height: 3px; border-radius: 2px; background: rgba(255,255,255,0.06); margin-top: 8px; overflow: hidden;
  }
  .sub-score-bar-fill { height: 100%; border-radius: 2px; transition: width 1s ease-out; }

  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 40px; }
  .stat-card {
    padding: 24px; background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--radius); text-align: center; transition: border-color 0.2s;
  }
  .stat-card:hover { border-color: var(--border-hover); }
  .stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 36px; font-weight: 700; color: white; margin-bottom: 4px; }
  .stat-label { font-size: 13px; color: var(--text-secondary); }

  .card {
    background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 28px; margin-bottom: 16px; transition: border-color 0.2s;
  }
  .card:hover { border-color: var(--border-hover); }
  .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; cursor: pointer; }
  .card-title { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 12px; }
  .card-title .icon {
    width: 36px; height: 36px; border-radius: var(--radius-xs); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;
  }

  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: 600; letter-spacing: 0.3px; }
  .badge-critical { background: var(--red-bg); color: var(--red); border: 1px solid var(--red-border); }
  .badge-high { background: var(--orange-bg); color: var(--orange); border: 1px solid var(--orange-border); }
  .badge-medium { background: var(--yellow-bg); color: var(--yellow); border: 1px solid var(--yellow-border); }
  .badge-low { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-border); }

  .collapsible-body { overflow: hidden; max-height: 0; transition: max-height 0.35s ease; }
  .collapsible.open .collapsible-body { max-height: 2000px; }
  .collapse-icon {
    width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.05);
    display: flex; align-items: center; justify-content: center; font-size: 14px;
    color: var(--text-muted); transition: transform 0.3s, background 0.2s; flex-shrink: 0;
  }
  .collapsible.open .collapse-icon { transform: rotate(180deg); }

  .finding { padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.04); display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: start; }
  .finding:last-child { border-bottom: none; }
  .finding-status { width: 8px; height: 8px; border-radius: 50%; margin-top: 8px; }
  .finding-status.pass { background: var(--green); box-shadow: 0 0 6px rgba(34,197,94,0.4); }
  .finding-status.warning { background: var(--yellow); box-shadow: 0 0 6px rgba(234,179,8,0.4); }
  .finding-status.fail { background: var(--red); box-shadow: 0 0 6px rgba(239,68,68,0.4); }
  .finding-content h4 { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
  .finding-content p { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }

  .keyword-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  .keyword-table th { text-align: left; padding: 12px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); border-bottom: 1px solid var(--border); font-weight: 600; }
  .keyword-table td { padding: 12px 16px; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.03); vertical-align: top; }
  .keyword-table tr:hover td { background: rgba(255,255,255,0.02); }
  .keyword-primary { font-weight: 600; color: var(--accent); }

  .competitor-card { padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: var(--radius-sm); margin-bottom: 12px; }
  .competitor-rank { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background: var(--accent); color: white; font-size: 13px; font-weight: 700; margin-right: 12px; flex-shrink: 0; }
  .competitor-title { font-weight: 600; font-size: 15px; margin-bottom: 4px; display: flex; align-items: center; }
  .competitor-url { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-muted); margin-bottom: 12px; word-break: break-all; }
  .competitor-meta { display: flex; gap: 16px; flex-wrap: wrap; }
  .competitor-meta-item { font-size: 12px; color: var(--text-secondary); }
  .competitor-meta-item strong { color: var(--text); }
  .competitor-topics { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.04); }
  .competitor-topics h5 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 8px; }

  .article-content { font-size: 16px; line-height: 1.8; color: var(--text); }
  .article-content h1 { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 700; margin: 32px 0 16px; color: white; }
  .article-content h2 { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 600; margin: 28px 0 12px; padding-top: 20px; border-top: 1px solid var(--border); color: white; }
  .article-content h3 { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 600; margin: 20px 0 8px; color: white; }
  .article-content p { margin-bottom: 16px; }
  .article-content ul, .article-content ol { margin-bottom: 16px; padding-left: 24px; }
  .article-content li { margin-bottom: 6px; }
  .article-content .new-section { border-left: 3px solid var(--accent); padding-left: 16px; margin-left: -19px; position: relative; }
  .article-content .new-section::before { content: 'NEW — Added based on competitor research'; position: absolute; top: -20px; left: 16px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--accent); font-weight: 600; }

  .meta-card { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 32px; }
  .meta-item { padding: 20px 24px; background: var(--bg); }
  .meta-item:nth-child(odd) { background: rgba(255,255,255,0.015); }
  .meta-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 6px; }
  .meta-value { font-size: 14px; font-weight: 500; color: var(--text); }
  .meta-value.mono { font-family: 'JetBrains Mono', monospace; font-size: 13px; }

  .change-category { margin-bottom: 32px; }
  .change-category-title { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 600; padding-bottom: 12px; border-bottom: 1px solid var(--border); margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
  .change-item { padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.03); display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: start; }
  .change-item:last-child { border-bottom: none; }
  .change-what { font-size: 14px; font-weight: 500; margin-bottom: 4px; }
  .change-why { font-size: 13px; color: var(--text-secondary); }

  .gap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
  .gap-card { padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: var(--radius-sm); }
  .gap-card h4 { font-size: 14px; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
  .gap-card ul { list-style: none; padding: 0; }
  .gap-card ul li { font-size: 13px; color: var(--text-secondary); padding: 4px 0; padding-left: 16px; position: relative; }
  .gap-card ul li::before { content: ''; position: absolute; left: 0; top: 11px; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); opacity: 0.5; }

  .original-banner { padding: 16px 24px; background: var(--yellow-bg); border: 1px solid var(--yellow-border); border-radius: var(--radius-sm); color: var(--yellow); font-size: 14px; font-weight: 500; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }

  .section-title { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; margin-bottom: 8px; }
  .section-subtitle { color: var(--text-secondary); font-size: 15px; margin-bottom: 24px; }

  .lsi-cloud { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
  .lsi-tag { padding: 6px 14px; background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2); border-radius: 100px; font-size: 13px; font-family: 'JetBrains Mono', monospace; color: var(--text); transition: all 0.2s; }
  .lsi-tag.integrated { background: var(--green-bg); border-color: var(--green-border); color: var(--green); }
  .lsi-tag.missing { background: var(--red-bg); border-color: var(--red-border); color: var(--red); opacity: 0.7; }

  @media (max-width: 768px) {
    .header h1 { font-size: 28px; }
    .score-section { flex-direction: column; text-align: center; padding: 24px; gap: 24px; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .meta-card { grid-template-columns: 1fr; }
    .gap-grid { grid-template-columns: 1fr; }
    .sub-scores { grid-template-columns: repeat(2, 1fr); }
  }
</style>
</head>
<body>

<div class="header">
  <div class="container">
    <div class="header-badge"><span class="dot"></span> SEO Strategy Report</div>
    <h1>{{ARTICLE_TITLE}}</h1>
    <p class="subtitle">Article SEO Optimization Report — Generated {{REPORT_DATE}}</p>
  </div>
</div>

<div class="tabs">
  <div class="tabs-inner">
    <button class="tab-btn active" onclick="switchTab('research')">Competitor Research</button>
    <button class="tab-btn" onclick="switchTab('revised')">Revised Article</button>
    <button class="tab-btn" onclick="switchTab('changelog')">Changelog <span class="tab-count">{{CHANGELOG_COUNT}}</span></button>
    <button class="tab-btn" onclick="switchTab('original')">Original</button>
  </div>
</div>

<!-- TAB 1: COMPETITOR RESEARCH -->
<div id="tab-research" class="tab-content active">
<div class="container">

  <div class="score-section">
    <div class="score-circle-wrap">
      <div class="score-circle">
        <svg viewBox="0 0 160 160">
          <circle class="bg-ring" cx="80" cy="80" r="74"/>
          <circle class="progress-ring" cx="80" cy="80" r="74"/>
        </svg>
        <span class="score-number">{{OVERALL_SCORE}}</span>
        <span class="score-label">SEO Score</span>
      </div>
    </div>
    <div class="score-details">
      <h2>{{SCORE_HEADLINE}}</h2>
      <p>{{SCORE_SUMMARY}}</p>
      <div class="sub-scores">
        <div class="sub-score">
          <div class="sub-score-label">Content</div>
          <div class="sub-score-value" style="color: {{CONTENT_SCORE_COLOR}}">{{CONTENT_SCORE}}</div>
          <div class="sub-score-bar"><div class="sub-score-bar-fill" style="width:{{CONTENT_SCORE}}%; background: {{CONTENT_SCORE_COLOR}}"></div></div>
        </div>
        <div class="sub-score">
          <div class="sub-score-label">Keywords</div>
          <div class="sub-score-value" style="color: {{KEYWORDS_SCORE_COLOR}}">{{KEYWORDS_SCORE}}</div>
          <div class="sub-score-bar"><div class="sub-score-bar-fill" style="width:{{KEYWORDS_SCORE}}%; background: {{KEYWORDS_SCORE_COLOR}}"></div></div>
        </div>
        <div class="sub-score">
          <div class="sub-score-label">Structure</div>
          <div class="sub-score-value" style="color: {{STRUCTURE_SCORE_COLOR}}">{{STRUCTURE_SCORE}}</div>
          <div class="sub-score-bar"><div class="sub-score-bar-fill" style="width:{{STRUCTURE_SCORE}}%; background: {{STRUCTURE_SCORE_COLOR}}"></div></div>
        </div>
        <div class="sub-score">
          <div class="sub-score-label">Technical</div>
          <div class="sub-score-value" style="color: {{TECHNICAL_SCORE_COLOR}}">{{TECHNICAL_SCORE}}</div>
          <div class="sub-score-bar"><div class="sub-score-bar-fill" style="width:{{TECHNICAL_SCORE}}%; background: {{TECHNICAL_SCORE_COLOR}}"></div></div>
        </div>
      </div>
    </div>
  </div>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-value">{{COMPETITORS_ANALYZED}}</div>
      <div class="stat-label">Competitors Analyzed</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{LSI_TOTAL}}</div>
      <div class="stat-label">LSI Keywords Found</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{CONTENT_GAPS_COUNT}}</div>
      <div class="stat-label">Content Gaps</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{TARGET_KEYWORD_DENSITY}}</div>
      <div class="stat-label">Target Keyword Density</div>
    </div>
  </div>

  <div class="section-title">Top Ranking Competitors</div>
  <div class="section-subtitle">Pages currently ranking for "{{TARGET_KEYWORD}}"</div>

  {{COMPETITOR_CARDS}}

  <div style="margin-top: 40px;">
    <div class="section-title">Keyword Strategy</div>
    <div class="section-subtitle">Extracted from competitor analysis — integrate these into the revised article</div>
    <table class="keyword-table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Keyword</th>
          <th>Density Target</th>
          <th>Competitors Using</th>
        </tr>
      </thead>
      <tbody>
        {{KEYWORD_TABLE_ROWS}}
      </tbody>
    </table>
  </div>

  <div style="margin-top: 40px;">
    <div class="section-title">LSI Keywords</div>
    <div class="section-subtitle">Green = already in your article | Red = missing — must add</div>
    <div class="lsi-cloud">
      {{LSI_CLOUD}}
    </div>
  </div>

  <div style="margin-top: 40px;">
    <div class="section-title">Gap Analysis</div>
    <div class="section-subtitle">What your article is missing vs. what's ranking</div>
    <div class="gap-grid">
      <div class="gap-card">
        <h4 style="color: var(--red);">Content Gaps</h4>
        <ul>
          {{CONTENT_GAPS_LIST}}
        </ul>
      </div>
      <div class="gap-card">
        <h4 style="color: var(--yellow);">Structural Gaps</h4>
        <ul>
          {{STRUCTURAL_GAPS_LIST}}
        </ul>
      </div>
      <div class="gap-card">
        <h4 style="color: var(--green);">Your Unique Advantages</h4>
        <ul>
          {{UNIQUE_ADVANTAGES_LIST}}
        </ul>
      </div>
      <div class="gap-card">
        <h4 style="color: var(--blue);">Keyword Gaps</h4>
        <ul>
          {{KEYWORD_GAPS_LIST}}
        </ul>
      </div>
    </div>
  </div>

</div>
</div>

<!-- TAB 2: REVISED ARTICLE -->
<div id="tab-revised" class="tab-content">
<div class="container">

  <div class="meta-card">
    <div class="meta-item">
      <div class="meta-label">Title Tag</div>
      <div class="meta-value">{{TITLE_TAG}}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Target Keyword</div>
      <div class="meta-value mono">{{TARGET_KEYWORD}}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Meta Description</div>
      <div class="meta-value">{{META_DESCRIPTION}}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">URL Slug</div>
      <div class="meta-value mono">{{URL_SLUG}}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Keyword Density</div>
      <div class="meta-value"><span style="color: var(--green)">{{NEW_KEYWORD_DENSITY}}</span> (was {{OLD_KEYWORD_DENSITY}})</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">LSI Coverage</div>
      <div class="meta-value"><span style="color: var(--green)">{{LSI_INTEGRATED}} of {{LSI_TOTAL}}</span> keywords integrated</div>
    </div>
  </div>

  <div class="article-content">
    {{REVISED_ARTICLE_HTML}}
  </div>

</div>
</div>

<!-- TAB 3: CHANGELOG -->
<div id="tab-changelog" class="tab-content">
<div class="container">

  <div class="section-title">What Changed &amp; Why</div>
  <div class="section-subtitle">{{CHANGELOG_COUNT}} changes across {{CHANGELOG_CATEGORY_COUNT}} categories, all informed by competitor research</div>

  {{CHANGELOG_HTML}}

</div>
</div>

<!-- TAB 4: ORIGINAL -->
<div id="tab-original" class="tab-content">
<div class="container">
  <div class="original-banner">
    <span style="font-size: 18px;">&#9888;</span>
    This is the original, pre-optimization version of the article. Compare with the Revised Article tab to see all improvements.
  </div>
  <div class="article-content" style="opacity: 0.8;">
    {{ORIGINAL_ARTICLE_HTML}}
  </div>
</div>
</div>

<script>
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tabId).classList.add('active');
  event.target.closest('.tab-btn').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.collapsible .card-header').forEach(header => {
  header.addEventListener('click', () => {
    header.closest('.collapsible').classList.toggle('open');
  });
});
</script>
</body>
</html>`;

const data = {
  ARTICLE_TITLE: "RTM Travel | Corporate Travel Management South Africa",
  REPORT_DATE: "May 13, 2026",
  OVERALL_SCORE: "78",
  SCORE_DASHOFFSET: "110",
  SCORE_HEADLINE: "Strong foundation, but missing critical local SEO and trust signals.",
  SCORE_SUMMARY: "The content is well-written and covers the core services effectively. However, it completely misses local geographic targeting (South Africa, Johannesburg) and crucial industry trust signals (ASATA/IATA accreditations) that competitors use to rank.",
  CONTENT_SCORE: "85",
  KEYWORDS_SCORE: "65",
  STRUCTURE_SCORE: "80",
  TECHNICAL_SCORE: "82",
  CONTENT_SCORE_COLOR: "var(--green)",
  KEYWORDS_SCORE_COLOR: "var(--yellow)",
  STRUCTURE_SCORE_COLOR: "var(--green)",
  TECHNICAL_SCORE_COLOR: "var(--green)",
  COMPETITORS_ANALYZED: "5",
  LSI_TOTAL: "14",
  CONTENT_GAPS_COUNT: "3",
  TARGET_KEYWORD_DENSITY: "1.5%",
  TARGET_KEYWORD: "corporate travel management south africa",
  
  COMPETITOR_CARDS: `
    <div class="competitor-card">
      <div class="competitor-title"><span class="competitor-rank">1</span> Corporate Travel Management Services | Corporate Traveller</div>
      <div class="competitor-url">corporatetraveller.co.za</div>
      <div class="competitor-meta">
        <span class="competitor-meta-item"><strong>~1200</strong> words</span>
        <span class="competitor-meta-item"><strong>8</strong> H2 sections</span>
        <span class="competitor-meta-item">Keyword density: <strong>1.4%</strong></span>
      </div>
      <div class="competitor-topics">
        <h5>Key Topics Covered</h5>
        <div class="lsi-cloud">
          <span class="keyword-tag">Online Booking Tools</span>
          <span class="keyword-tag">Dedicated Travel Managers</span>
          <span class="keyword-tag">SME Focus</span>
          <span class="keyword-tag">Duty of Care</span>
        </div>
      </div>
    </div>
    <div class="competitor-card">
      <div class="competitor-title"><span class="competitor-rank">2</span> Corporate Travel Agency South Africa | Thompsons Travel</div>
      <div class="competitor-url">thompsonstravel.co.za</div>
      <div class="competitor-meta">
        <span class="competitor-meta-item"><strong>~900</strong> words</span>
        <span class="competitor-meta-item"><strong>6</strong> H2 sections</span>
        <span class="competitor-meta-item">Keyword density: <strong>1.6%</strong></span>
      </div>
      <div class="competitor-topics">
        <h5>Key Topics Covered</h5>
        <div class="lsi-cloud">
          <span class="keyword-tag">Travel Policy</span>
          <span class="keyword-tag">24/7 Emergency Support</span>
          <span class="keyword-tag">Global Buying Power</span>
        </div>
      </div>
    </div>
    <div class="competitor-card">
      <div class="competitor-title"><span class="competitor-rank">3</span> Travel Management Company | XL Turners Travel Johannesburg</div>
      <div class="competitor-url">xlturnerstravel.co.za</div>
      <div class="competitor-meta">
        <span class="competitor-meta-item"><strong>~1500</strong> words</span>
        <span class="competitor-meta-item"><strong>10</strong> H2 sections</span>
        <span class="competitor-meta-item">Keyword density: <strong>1.2%</strong></span>
      </div>
      <div class="competitor-topics">
        <h5>Key Topics Covered</h5>
        <div class="lsi-cloud">
          <span class="keyword-tag">End-to-end Management</span>
          <span class="keyword-tag">Sector Expertise</span>
          <span class="keyword-tag">Expense Management</span>
        </div>
      </div>
    </div>
  `,
  
  KEYWORD_TABLE_ROWS: `
    <tr>
      <td><span class="keyword-primary">PRIMARY</span></td>
      <td><strong>corporate travel management south africa</strong></td>
      <td>1-2%</td>
      <td>5/5</td>
    </tr>
    <tr>
      <td><span class="badge badge-medium">Secondary</span></td>
      <td>business travel agency johannesburg</td>
      <td>0.5-1%</td>
      <td>3/5</td>
    </tr>
    <tr>
      <td><span class="badge badge-medium">Secondary</span></td>
      <td>travel management company TMC</td>
      <td>0.5-1%</td>
      <td>4/5</td>
    </tr>
    <tr>
      <td><span class="badge badge-low">LSI</span></td>
      <td>ASATA accredited, IATA accredited, duty of care, spend visibility, corporate flights, travel policy, 24/7 support</td>
      <td>1-3 mentions each</td>
      <td>5/5</td>
    </tr>
  `,
  
  LSI_CLOUD: `
    <span class="lsi-tag integrated">duty of care</span>
    <span class="lsi-tag integrated">spend visibility</span>
    <span class="lsi-tag integrated">corporate flights</span>
    <span class="lsi-tag integrated">travel policy</span>
    <span class="lsi-tag integrated">24/7 support</span>
    <span class="lsi-tag integrated">reporting</span>
    <span class="lsi-tag integrated">negotiated rates</span>
    <span class="lsi-tag missing">ASATA accredited</span>
    <span class="lsi-tag missing">IATA accredited</span>
    <span class="lsi-tag missing">Travel Management Company</span>
    <span class="lsi-tag missing">Johannesburg</span>
    <span class="lsi-tag missing">Cape Town</span>
    <span class="lsi-tag missing">South Africa</span>
    <span class="lsi-tag missing">expense management</span>
  `,
  
  CONTENT_GAPS_LIST: `
    <li>No explicit mention of ASATA and IATA accreditations (key trust signals)</li>
    <li>Lack of local SEO geographic targeting (Johannesburg, Cape Town, South Africa)</li>
    <li>Missing "Travel Management Company (TMC)" terminology</li>
  `,
  
  STRUCTURAL_GAPS_LIST: `
    <li>Missing a dedicated "Accreditations & Trust" section</li>
    <li>Lack of local address or geographic targeting in the footer/contact section</li>
  `,
  
  UNIQUE_ADVANTAGES_LIST: `
    <li>Highly personalized service compared to faceless global TMCs</li>
    <li>Explicit focus on CFOs, Executives, and Operations Directors</li>
  `,
  
  KEYWORD_GAPS_LIST: `
    <li>7 out of 14 key LSI terms are completely missing from the page content</li>
    <li>"South Africa" and "Johannesburg" not mentioned despite local focus</li>
  `,
  
  TITLE_TAG: "Corporate Travel Management South Africa | RTM Travel",
  META_DESCRIPTION: "Premium corporate travel management for South African CFOs and executives. ASATA & IATA accredited. We provide certainty, control, and 24/7 support.",
  URL_SLUG: "index.html",
  NEW_KEYWORD_DENSITY: "1.6%",
  OLD_KEYWORD_DENSITY: "0.2%",
  LSI_INTEGRATED: "14",
  
  REVISED_ARTICLE_HTML: `
    <h1 style="color:white; font-size: 2em; margin-bottom: 0.5em;">RTM Travel: Corporate Travel Management South Africa</h1>
    <p>Established in 2008, Remmitz Travel Management is a specialist <strong>corporate travel management company (TMC)</strong> built on reliability, efficiency, personal service, and fast problem-solving. We serve clients across <strong>South Africa, including Johannesburg and Cape Town</strong>, as well as managing global business travel requirements.</p>

    <div class="new-section" style="margin-top: 40px;">
      <h2>Industry Accredited & Trusted</h2>
      <p>As an <strong>ASATA accredited</strong> and <strong>IATA accredited</strong> business travel agency, we adhere to the highest industry standards for financial security, professionalism, and operational excellence. When you partner with us, your corporate travel is in safe, certified hands.</p>
    </div>

    <h2>Premium Corporate Travel Management for the Modern Business World</h2>
    <p>For 18 years, we have supported businesses with professional travel solutions designed around the realities of modern corporate life. We understand that business travel is not just about booking <strong>corporate flights</strong>, hotels, and transfers. It is about keeping people moving, protecting productivity, managing <strong>expense management</strong>, reducing risk, and ensuring that every traveller is supported wherever they are in the world.</p>
    <p>At Remmitz Travel, our strength lies in how well we understand our clients. We take the time to get close to your business, your operational structure, your <strong>travel policy</strong>, approval processes, budget requirements, and the individual preferences of your travellers. This allows us to deliver corporate travel support that is not only reliable, but also highly personalised, responsive, and seamless.</p>

    <h2>Duty of Care & 24/7 Support</h2>
    <p>Whether it is a last-minute flight change, an urgent travel request, a disrupted itinerary, or a traveller needing support after hours, our team responds with speed, professionalism, and care. We provide <strong>24/7 support</strong> and comprehensive <strong>duty of care</strong> compliance. We know that in corporate travel, delays and uncertainty can have a direct impact on your business. That is why we focus on clear communication, proactive service, and practical solutions when they matter most.</p>

    <h2>Spend Visibility & Negotiated Rates</h2>
    <p>As a dedicated corporate travel management company, Remmitz Travel Management provides end-to-end support for business travel. We leverage our network to secure the best <strong>negotiated rates</strong> for our clients. Every solution is designed to help companies travel smarter, achieve total <strong>spend visibility</strong> through detailed <strong>reporting</strong>, and give their teams the confidence that they are supported from departure to return.</p>
  `,
  
  CHANGELOG_COUNT: "4",
  CHANGELOG_CATEGORY_COUNT: "3",
  
  CHANGELOG_HTML: `
    <div class="change-category">
      <div class="change-category-title">
        <span style="color: var(--accent);">&#9672;</span> Competitor-Informed Additions
      </div>
      <div class="change-item">
        <div>
          <div class="change-what">Added ASATA & IATA Accreditation Section</div>
          <div class="change-why">All top 5 competitors highlight their accreditations prominently to build trust. Since RTM is accredited, this is a major competitive advantage that was missing.</div>
        </div>
        <span class="badge badge-critical">Critical</span>
      </div>
      <div class="change-item">
        <div>
          <div class="change-what">Explicitly defined RTM as a "Travel Management Company (TMC)"</div>
          <div class="change-why">"TMC" and "Travel Management Company" are industry-standard terms searched by B2B buyers. The previous copy was ambiguous.</div>
        </div>
        <span class="badge badge-high">High</span>
      </div>
    </div>

    <div class="change-category">
      <div class="change-category-title">
        <span style="color: var(--green);">&#9672;</span> Keyword Optimization & Local SEO
      </div>
      <div class="change-item">
        <div>
          <div class="change-what">Added Geographic Targeting (South Africa, Johannesburg, Cape Town)</div>
          <div class="change-why">To improve local SEO rankings for "corporate travel agency Johannesburg" and similar terms.</div>
        </div>
        <span class="badge badge-high">High</span>
      </div>
      <div class="change-item">
        <div>
          <div class="change-what">Integrated LSI Keywords</div>
          <div class="change-why">Added terms like "expense management", "corporate flights", and "negotiated rates" which Google expects to see in comprehensive CTM content.</div>
        </div>
        <span class="badge badge-medium">Medium</span>
      </div>
    </div>
  `,
  
  ORIGINAL_ARTICLE_HTML: `
    <h1 style="color:white; font-size: 2em; margin-bottom: 0.5em;">Premium Corporate Travel Management for the Modern Business World</h1>
    <p>Established in 2008, Remmitz Travel Management is a specialist corporate travel management company built on reliability, efficiency, personal service, and fast problem-solving.</p>
    <p>For 18 years, we have supported businesses with professional travel solutions designed around the realities of modern corporate life. We understand that business travel is not just about booking flights, hotels, and transfers. It is about keeping people moving, protecting productivity, managing costs, reducing risk, and ensuring that every traveller is supported wherever they are in the world.</p>
    <p>At Remmitz Travel, our strength lies in how well we understand our clients. We take the time to get close to your business, your operational structure, your travel policies, approval processes, budget requirements, and the individual preferences of your travellers. This allows us to deliver corporate travel support that is not only reliable, but also highly personalised, responsive, and seamless.</p>
    <p>Whether it is a last-minute flight change, an urgent travel request, a disrupted itinerary, or a traveller needing support after hours, our team responds with speed, professionalism, and care. We know that in corporate travel, delays and uncertainty can have a direct impact on your business. That is why we focus on clear communication, proactive service, and practical solutions when they matter most.</p>
    <p>As a dedicated corporate travel management company, Remmitz Travel Management provides end-to-end support for business travel, including flight bookings, accommodation, car hire, travel coordination, itinerary management, traveller assistance, and policy-aligned travel planning. Every solution is designed to help companies travel smarter, control travel spend, and give their teams the confidence that they are supported from departure to return.</p>
  `
};

let output = template;
for (const [key, value] of Object.entries(data)) {
  const regex = new RegExp('{{' + key + '}}', 'g');
  output = output.replace(regex, value);
}

fs.writeFileSync('C:/Users/Deon/Documents/DB23 eCommerce/Take it to market/RTM Travel/seo-report-index.html', output);
console.log('Report generated successfully.');
