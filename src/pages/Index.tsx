import { useState } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080c14;
    --surface: #0d1220;
    --surface2: #111827;
    --border: #1e2d42;
    --accent: #00d4ff;
    --accent2: #7c3aed;
    --accent3: #10b981;
    --accent4: #f59e0b;
    --accent5: #ef4444;
    --text: #e2e8f0;
    --muted: #64748b;
    --highlight: #1e3a5f;
  }

  body { background: var(--bg); font-family: 'DM Sans', sans-serif; }

  .dashboard {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    padding: 0;
    position: relative;
    overflow-x: hidden;
  }

  .noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  .grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.25;
  }

  .glow-orb {
    position: fixed; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%);
    top: -200px; right: -200px; pointer-events: none; z-index: 0;
  }
  .glow-orb2 {
    position: fixed; width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%);
    bottom: 0; left: -100px; pointer-events: none; z-index: 0;
  }

  .content { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 32px 24px; }

  /* Header */
  .header { margin-bottom: 36px; }
  .header-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: 0.2em; color: var(--accent);
    text-transform: uppercase; margin-bottom: 8px;
    display: flex; align-items: center; gap: 8px;
  }
  .header-eyebrow::before {
    content: ''; display: inline-block; width: 20px; height: 1px; background: var(--accent);
  }
  .header h1 {
    font-family: 'Syne', sans-serif;
    font-size: 36px; font-weight: 800; line-height: 1.1;
    background: linear-gradient(135deg, #fff 40%, var(--accent) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
  }
  .header p { color: var(--muted); font-size: 14px; max-width: 540px; line-height: 1.6; }

  /* Status Bar */
  .status-bar {
    display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 32px;
  }
  .stat-pill {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 100px; padding: 8px 16px;
    font-family: 'DM Mono', monospace; font-size: 12px;
  }
  .stat-pill .dot {
    width: 6px; height: 6px; border-radius: 50%;
  }
  .dot-green { background: var(--accent3); box-shadow: 0 0 6px var(--accent3); }
  .dot-blue { background: var(--accent); box-shadow: 0 0 6px var(--accent); }
  .dot-yellow { background: var(--accent4); box-shadow: 0 0 6px var(--accent4); }
  .dot-purple { background: var(--accent2); box-shadow: 0 0 6px var(--accent2); }

  /* Tabs */
  .tabs { display: flex; gap: 4px; margin-bottom: 28px; border-bottom: 1px solid var(--border); padding-bottom: 0; }
  .tab {
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
    padding: 10px 18px; cursor: pointer; border-radius: 8px 8px 0 0;
    border: 1px solid transparent; border-bottom: none;
    color: var(--muted); background: transparent; transition: all 0.2s;
    white-space: nowrap;
  }
  .tab:hover { color: var(--text); background: var(--surface); }
  .tab.active {
    color: var(--accent); background: var(--surface);
    border-color: var(--border); border-bottom: 1px solid var(--surface);
    margin-bottom: -1px;
  }

  /* Cards */
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 20px;
  }
  .card-title {
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: 0.05em; text-transform: uppercase; color: var(--muted);
    margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
  }
  .card-title-icon { font-size: 14px; }

  /* Workflow Grid */
  .workflow-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
  
  .workflow-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 20px; transition: border-color 0.2s;
    position: relative; overflow: hidden;
  }
  .workflow-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .workflow-card.ai-full::before { background: linear-gradient(90deg, var(--accent3), var(--accent)); }
  .workflow-card.ai-partial::before { background: linear-gradient(90deg, var(--accent4), var(--accent2)); }
  .workflow-card.ai-none::before { background: var(--border); }

  .workflow-card:hover { border-color: var(--accent); }

  .wf-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .wf-title {
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; margin-bottom: 4px;
  }
  .wf-category {
    font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em;
    color: var(--muted); text-transform: uppercase;
  }
  .ai-badge {
    font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500;
    padding: 4px 10px; border-radius: 100px; white-space: nowrap; flex-shrink: 0;
  }
  .badge-full { background: rgba(16,185,129,0.12); color: var(--accent3); border: 1px solid rgba(16,185,129,0.3); }
  .badge-partial { background: rgba(245,158,11,0.12); color: var(--accent4); border: 1px solid rgba(245,158,11,0.3); }
  .badge-manual { background: rgba(100,116,139,0.12); color: var(--muted); border: 1px solid rgba(100,116,139,0.2); }

  .wf-desc { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 14px; }

  .wf-tasks { display: flex; flex-direction: column; gap: 6px; }
  .wf-task {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; padding: 6px 10px; border-radius: 6px;
    background: var(--surface2);
  }
  .task-icon { font-size: 13px; flex-shrink: 0; }
  .task-label { flex: 1; color: var(--text); }
  .task-ai-tag {
    font-family: 'DM Mono', monospace; font-size: 10px;
    color: var(--accent); opacity: 0.7;
  }

  /* Prioritization */
  .priority-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  
  .matrix-grid {
    display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr;
    gap: 8px; height: 280px;
  }
  .matrix-cell {
    border-radius: 10px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between;
  }
  .mc-q1 { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); }
  .mc-q2 { background: rgba(0,212,255,0.06); border: 1px solid rgba(0,212,255,0.15); }
  .mc-q3 { background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.15); }
  .mc-q4 { background: rgba(100,116,139,0.06); border: 1px solid rgba(100,116,139,0.15); }
  .mc-label { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; margin-bottom: 6px; }
  .mc-items { display: flex; flex-direction: column; gap: 4px; }
  .mc-item { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 4px; }
  .mc-item::before { content: '—'; opacity: 0.4; }

  .rice-table { width: 100%; }
  .rice-table th {
    font-family: 'DM Mono', monospace; font-size: 10px; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--muted); padding: 8px 10px; text-align: left;
    border-bottom: 1px solid var(--border);
  }
  .rice-table td {
    font-size: 12px; padding: 10px 10px; border-bottom: 1px solid rgba(30,45,66,0.5);
    vertical-align: middle;
  }
  .score-bar-wrap { display: flex; align-items: center; gap: 8px; }
  .score-bar { height: 4px; border-radius: 2px; background: var(--border); flex: 1; overflow: hidden; }
  .score-fill { height: 100%; border-radius: 2px; }
  .score-num { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--accent); width: 28px; text-align: right; }

  /* Agents Panel */
  .agents-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
  .agent-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 20px; transition: all 0.2s;
    position: relative; overflow: hidden;
  }
  .agent-card:hover { border-color: var(--accent2); transform: translateY(-2px); }
  .agent-icon-wrap {
    width: 44px; height: 44px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin-bottom: 12px;
  }
  .ai-blue { background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.2); }
  .ai-purple { background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.2); }
  .ai-green { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); }
  .ai-amber { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); }
  .agent-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; margin-bottom: 4px; }
  .agent-trigger {
    font-family: 'DM Mono', monospace; font-size: 10px; color: var(--accent);
    background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.15);
    padding: 3px 8px; border-radius: 4px; display: inline-block; margin-bottom: 10px;
  }
  .agent-desc { font-size: 12px; color: var(--muted); line-height: 1.6; margin-bottom: 12px; }
  .agent-inputs { display: flex; flex-wrap: wrap; gap: 6px; }
  .input-chip {
    font-size: 11px; padding: 3px 8px; border-radius: 100px;
    background: var(--surface2); border: 1px solid var(--border); color: var(--muted);
  }

  /* Tracker */
  .tracker-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  .project-row {
    display: grid; grid-template-columns: 180px 1fr 80px 90px 70px;
    align-items: center; gap: 12px; padding: 12px 16px;
    border-bottom: 1px solid var(--border); font-size: 13px;
  }
  .project-row:last-child { border-bottom: none; }
  .project-name { font-weight: 500; }
  .progress-wrap { display: flex; align-items: center; gap: 8px; }
  .progress-bar { flex: 1; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 2px; }
  .progress-pct { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); width: 30px; }
  .status-chip {
    font-size: 10px; font-family: 'DM Mono', monospace;
    padding: 3px 8px; border-radius: 100px; text-align: center;
  }
  .s-on-track { background: rgba(16,185,129,0.1); color: var(--accent3); border: 1px solid rgba(16,185,129,0.2); }
  .s-at-risk { background: rgba(245,158,11,0.1); color: var(--accent4); border: 1px solid rgba(245,158,11,0.2); }
  .s-delayed { background: rgba(239,68,68,0.1); color: var(--accent5); border: 1px solid rgba(239,68,68,0.2); }
  .s-planning { background: rgba(124,58,237,0.1); color: var(--accent2); border: 1px solid rgba(124,58,237,0.2); }
  .owner-tag { font-size: 11px; color: var(--muted); }

  /* Meetings */
  .meeting-list { display: flex; flex-direction: column; gap: 12px; }
  .meeting-item {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 10px; padding: 14px 16px;
  }
  .meeting-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
  .meeting-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; }
  .meeting-time { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); }
  .meeting-outputs { display: flex; flex-wrap: wrap; gap: 6px; }
  .output-tag {
    font-size: 11px; padding: 3px 8px; border-radius: 100px;
    background: rgba(0,212,255,0.08); color: var(--accent);
    border: 1px solid rgba(0,212,255,0.15);
  }

  /* Todo */
  .todo-list { display: flex; flex-direction: column; gap: 8px; }
  .todo-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 8px; background: var(--surface2);
    border: 1px solid var(--border);
  }
  .todo-check {
    width: 16px; height: 16px; border-radius: 4px;
    border: 1px solid var(--border); flex-shrink: 0; cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-size: 10px;
    transition: all 0.15s;
  }
  .todo-check.done { background: var(--accent3); border-color: var(--accent3); color: #000; }
  .todo-text { flex: 1; font-size: 13px; }
  .todo-text.done { text-decoration: line-through; color: var(--muted); }
  .todo-priority {
    font-family: 'DM Mono', monospace; font-size: 10px;
    padding: 2px 6px; border-radius: 4px;
  }
  .p-high { background: rgba(239,68,68,0.1); color: var(--accent5); }
  .p-med { background: rgba(245,158,11,0.1); color: var(--accent4); }
  .p-low { background: rgba(16,185,129,0.1); color: var(--accent3); }
  .todo-ai-note { font-size: 10px; color: var(--accent); font-family: 'DM Mono', monospace; }

  /* Legend */
  .legend { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 20px; }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted); }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; }

  /* Section header */
  .section-header { margin-bottom: 20px; }
  .section-title {
    font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800;
    margin-bottom: 4px;
  }
  .section-sub { font-size: 13px; color: var(--muted); }

  .full-width { grid-column: 1 / -1; }

  /* Daily Schedule */
  .schedule-layout { display: grid; grid-template-columns: 1fr 300px; gap: 16px; }
  .timeline { position: relative; }
  .time-slot {
    display: grid; grid-template-columns: 52px 1fr; gap: 12px;
    min-height: 60px; position: relative;
  }
  .time-slot::before {
    content: ''; position: absolute; left: 52px; top: 0; bottom: 0;
    width: 1px; background: var(--border);
  }
  .time-label {
    font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted);
    padding-top: 4px; text-align: right; padding-right: 0; line-height: 1;
    flex-shrink: 0;
  }
  .slot-content { padding: 0 0 4px 12px; position: relative; }
  .event-block {
    border-radius: 8px; padding: 8px 12px; margin-bottom: 4px;
    border-left: 3px solid; cursor: default; transition: opacity 0.15s;
  }
  .event-block:hover { opacity: 0.85; }
  .ev-meeting { background: rgba(124,58,237,0.12); border-color: var(--accent2); }
  .ev-deep { background: rgba(0,212,255,0.08); border-color: var(--accent); }
  .ev-admin { background: rgba(100,116,139,0.1); border-color: var(--muted); }
  .ev-buffer { background: rgba(16,185,129,0.07); border-color: var(--accent3); }
  .ev-break { background: rgba(245,158,11,0.07); border-color: var(--accent4); }
  .ev-title { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; margin-bottom: 2px; }
  .ev-meta { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 8px; }
  .ev-ai-tag { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--accent); }
  .ev-duration { font-family: 'DM Mono', monospace; font-size: 10px; }

  .now-line {
    position: absolute; left: 52px; right: 0; height: 2px;
    background: var(--accent5); z-index: 2;
    display: flex; align-items: center;
  }
  .now-dot {
    width: 8px; height: 8px; border-radius: 50%; background: var(--accent5);
    margin-left: -4px; flex-shrink: 0; box-shadow: 0 0 8px var(--accent5);
  }
  .now-label {
    font-family: 'DM Mono', monospace; font-size: 9px; color: var(--accent5);
    margin-left: 8px; background: var(--bg); padding: 1px 4px; border-radius: 3px;
  }

  .energy-bar { display: flex; gap: 3px; margin-bottom: 16px; }
  .energy-seg {
    flex: 1; height: 6px; border-radius: 3px; transition: opacity 0.2s;
  }

  .day-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
  .day-stat {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 10px 12px;
  }
  .day-stat-val { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; line-height: 1; }
  .day-stat-label { font-size: 10px; color: var(--muted); margin-top: 3px; }

  /* OKR Tracker */
  .okr-layout { display: flex; flex-direction: column; gap: 20px; }
  .okr-objective {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; overflow: hidden;
  }
  .okr-obj-header {
    padding: 18px 20px; display: flex; align-items: center; gap: 14px;
    border-bottom: 1px solid var(--border); cursor: pointer;
  }
  .okr-obj-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;
  }
  .okr-obj-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; margin-bottom: 3px; }
  .okr-obj-sub { font-size: 12px; color: var(--muted); }
  .okr-obj-progress { margin-left: auto; text-align: right; }
  .okr-obj-pct { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; line-height: 1; }
  .okr-obj-label { font-size: 10px; color: var(--muted); font-family: 'DM Mono', monospace; margin-top: 2px; }
  .okr-track { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; margin: 0 20px 0; }
  .okr-track-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }

  .kr-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 14px; }
  .kr-item { display: grid; grid-template-columns: 1fr 140px 70px; gap: 12px; align-items: center; }
  .kr-name { font-size: 13px; }
  .kr-target { font-size: 11px; color: var(--muted); font-family: 'DM Mono', monospace; }
  .kr-bar-wrap { display: flex; flex-direction: column; gap: 4px; }
  .kr-bar { height: 5px; background: var(--border); border-radius: 3px; overflow: hidden; }
  .kr-fill { height: 100%; border-radius: 3px; }
  .kr-numbers { display: flex; justify-content: space-between; font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); }
  .kr-status-chip {
    font-size: 10px; font-family: 'DM Mono', monospace;
    padding: 3px 8px; border-radius: 100px; text-align: center; white-space: nowrap;
  }

  .okr-quarter-header {
    display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 20px;
  }
  .q-stat-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
    padding: 16px; text-align: center;
  }
  .q-stat-num { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
  .q-stat-lbl { font-size: 11px; color: var(--muted); font-family: 'DM Mono', monospace; }

  .week-spark { display: flex; align-items: flex-end; gap: 3px; height: 40px; }
  .spark-bar { flex: 1; border-radius: 2px 2px 0 0; min-width: 6px; transition: opacity 0.2s; }
  .spark-bar:hover { opacity: 0.7; }

  /* PRD Agent */
  .upload-zone {
    border: 2px dashed var(--border); border-radius: 12px; padding: 32px;
    text-align: center; cursor: pointer; transition: all 0.2s;
  }
  .upload-zone:hover { border-color: var(--accent); background: rgba(0,212,255,0.03); }
  .upload-zone-icon { font-size: 32px; margin-bottom: 10px; }
  .upload-zone-label { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; margin-bottom: 4px; }
  .upload-zone-sub { font-size: 12px; color: var(--muted); }
  .prd-output { display: flex; flex-direction: column; gap: 0; }
  .prd-section {
    border-bottom: 1px solid var(--border); padding: 16px 20px;
  }
  .prd-section:last-child { border-bottom: none; }
  .prd-section-label {
    font-family: 'DM Mono', monospace; font-size: 10px; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--muted); margin-bottom: 8px;
  }
  .prd-section-content { font-size: 13px; line-height: 1.7; color: var(--text); }
  .theme-tag {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; padding: 3px 10px; border-radius: 100px;
    background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.15);
    color: var(--accent); margin: 2px;
  }
  .theme-freq { font-family: 'DM Mono', monospace; font-size: 10px; opacity: 0.7; }
  .user-story {
    padding: 10px 12px; background: var(--surface2); border-radius: 8px;
    border-left: 3px solid var(--accent2); margin-bottom: 6px; font-size: 12px; line-height: 1.6;
  }
  .acceptance-item {
    display: flex; gap: 8px; font-size: 12px; margin-bottom: 5px; align-items: flex-start;
  }
  .acceptance-check { color: var(--accent3); flex-shrink: 0; margin-top: 2px; }
  .export-bar {
    display: flex; gap: 8px; padding: 12px 0; border-top: 1px solid var(--border); margin-top: 8px;
  }
  .export-btn {
    font-family: 'DM Mono', monospace; font-size: 11px; padding: 7px 14px;
    border-radius: 8px; cursor: pointer; border: 1px solid var(--border);
    background: var(--surface2); color: var(--text); transition: all 0.15s;
  }
  .export-btn:hover { border-color: var(--accent); color: var(--accent); }
  .prd-processing {
    display: flex; align-items: center; gap: 10px; padding: 20px;
    font-size: 13px; color: var(--muted);
  }
  .spinner {
    width: 18px; height: 18px; border: 2px solid var(--border);
    border-top-color: var(--accent); border-radius: 50%;
    animation: spin 0.8s linear infinite; flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Privacy */
  .privacy-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .memory-row {
    display: flex; align-items: flex-start; gap: 10px; padding: 10px 0;
    border-bottom: 1px solid rgba(30,45,66,0.4);
  }
  .memory-row:last-child { border-bottom: none; }
  .memory-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
  .memory-text { flex: 1; font-size: 12px; line-height: 1.5; }
  .memory-meta { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); }
  .forget-btn {
    font-family: 'DM Mono', monospace; font-size: 10px; padding: 3px 8px;
    border-radius: 4px; border: 1px solid rgba(239,68,68,0.3); color: var(--accent5);
    background: rgba(239,68,68,0.06); cursor: pointer; flex-shrink: 0; transition: all 0.15s;
  }
  .forget-btn:hover { background: rgba(239,68,68,0.15); }
  .toggle-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 0; border-bottom: 1px solid var(--border);
  }
  .toggle-row:last-child { border-bottom: none; }
  .toggle-label { font-size: 13px; }
  .toggle-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .toggle-switch {
    width: 40px; height: 22px; background: var(--border); border-radius: 100px;
    position: relative; cursor: pointer; transition: background 0.2s; flex-shrink: 0;
  }
  .toggle-switch.on { background: var(--accent3); }
  .toggle-switch::after {
    content: ''; position: absolute; width: 16px; height: 16px; border-radius: 50%;
    background: #fff; top: 3px; left: 3px; transition: left 0.2s;
  }
  .toggle-switch.on::after { left: 21px; }
  .residency-badge {
    display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;
    border-radius: 8px; font-family: 'DM Mono', monospace; font-size: 11px;
  }
  .data-flow-row {
    display: flex; align-items: center; gap: 8px; font-size: 12px; padding: 8px 0;
    border-bottom: 1px solid rgba(30,45,66,0.4);
  }
  .data-flow-row:last-child { border-bottom: none; }
  .flow-source { flex: 1; color: var(--text); }
  .flow-dest { font-family: 'DM Mono', monospace; font-size: 11px; }
  .flow-status { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  /* Metrics */
  .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
  .metric-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 16px;
  }
  .metric-val { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
  .metric-label { font-size: 11px; color: var(--muted); font-family: 'DM Mono', monospace; }
  .metric-delta { font-size: 11px; font-family: 'DM Mono', monospace; margin-top: 4px; }
  .delta-up { color: var(--accent3); }
  .delta-down { color: var(--accent5); }
  .funnel-row {
    display: flex; align-items: center; gap: 12px; padding: 10px 0;
    border-bottom: 1px solid rgba(30,45,66,0.4);
  }
  .funnel-row:last-child { border-bottom: none; }
  .funnel-label { font-size: 13px; width: 110px; flex-shrink: 0; }
  .funnel-bar-wrap { flex: 1; display: flex; align-items: center; gap: 8px; }
  .funnel-bar { height: 8px; border-radius: 4px; }
  .funnel-num { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--muted); width: 50px; text-align: right; }
  .funnel-pct { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--accent); width: 40px; }
  .agent-usage-row {
    display: flex; align-items: center; gap: 10px; padding: 10px 0;
    border-bottom: 1px solid rgba(30,45,66,0.4);
  }
  .agent-usage-row:last-child { border-bottom: none; }
  .agent-usage-name { font-size: 13px; font-weight: 500; flex: 1; }
  .agent-usage-bar-wrap { width: 120px; display: flex; align-items: center; gap: 6px; }
  .agent-usage-bar { height: 4px; background: var(--border); border-radius: 2px; flex: 1; overflow: hidden; }
  .agent-usage-fill { height: 100%; border-radius: 2px; }
  .agent-usage-num { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); }
  .alert-card {
    padding: 12px 16px; border-radius: 10px; display: flex; gap: 10px; align-items: flex-start;
    margin-bottom: 8px;
  }
  .alert-warn { background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.2); }
  .alert-good { background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.2); }
  .time-saved-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 0; border-bottom: 1px solid rgba(30,45,66,0.4);
  }
  .time-saved-row:last-child { border-bottom: none; }
  .time-saved-label { font-size: 12px; color: var(--muted); }
  .time-saved-val { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: var(--accent3); }

  /* Responsive */
  @media (max-width: 720px) {
    .priority-grid, .tracker-layout, .schedule-layout,
    .privacy-grid { grid-template-columns: 1fr; }
    .metrics-grid { grid-template-columns: 1fr 1fr; }
    .project-row { grid-template-columns: 1fr 1fr; }
    .tabs { overflow-x: auto; }
    .okr-quarter-header { grid-template-columns: 1fr 1fr; }
    .kr-item { grid-template-columns: 1fr; }

  /* Stakeholder */
  .sh-filter-bar { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
  .sh-filter-btn {
    font-family: 'DM Mono', monospace; font-size: 11px;
    padding: 6px 12px; border-radius: 100px;
    background: var(--surface); border: 1px solid var(--border);
    color: var(--muted); cursor: pointer; transition: all 0.15s;
  }
  .sh-filter-btn:hover { color: var(--text); border-color: var(--accent); }
  .sh-filter-btn.active { background: rgba(0,212,255,0.1); color: var(--accent); border-color: rgba(0,212,255,0.3); }
  .sh-table-header {
    display: grid; grid-template-columns: 1.4fr 1fr 1.4fr 1.4fr 0.8fr 0.8fr;
    gap: 12px; padding: 12px 16px; font-family: 'DM Mono', monospace;
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--muted); border-bottom: 1px solid var(--border); background: var(--surface2);
  }
  .sh-row {
    display: grid; grid-template-columns: 1.4fr 1fr 1.4fr 1.4fr 0.8fr 0.8fr;
    gap: 12px; padding: 12px 16px; align-items: center;
    border-bottom: 1px solid rgba(30,45,66,0.5); font-size: 13px;
  }
  .sh-row:last-child { border-bottom: none; }
  .sh-row:hover { background: rgba(0,212,255,0.03); }
  .sh-name-wrap { display: flex; align-items: center; gap: 10px; }
  .sh-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 12px; flex-shrink: 0;
  }
  .sh-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; }
  .sh-role { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .sh-email { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--accent); text-decoration: none; word-break: break-all; }
  .sh-email:hover { text-decoration: underline; }
  .sh-project-tags { display: flex; flex-wrap: wrap; gap: 4px; }
  .sh-proj-tag {
    font-size: 10px; font-family: 'DM Mono', monospace;
    padding: 2px 7px; border-radius: 100px;
    background: var(--surface2); border: 1px solid var(--border); color: var(--muted);
  }
  .influence-bar { display: flex; gap: 3px; }
  .inf-dot { width: 8px; height: 8px; border-radius: 50%; }
  .inf-dot.filled { background: var(--accent2); box-shadow: 0 0 4px rgba(124,58,237,0.4); }
  .inf-dot.empty { background: var(--border); }
  .last-contact { font-family: 'DM Mono', monospace; font-size: 11px; }
  .lc-recent { color: var(--accent3); }
  .lc-old { color: var(--accent4); }
  .lc-stale { color: var(--accent5); }

  /* Schedule aside */
  .sched-aside { display: flex; flex-direction: column; gap: 12px; }

`;


const workflows = [
  {
    title: "Feature Prioritization",
    category: "Strategy",
    ai: "full",
    desc: "Rank features using RICE/ICE, align with vision and quarterly OKRs, auto-score backlog items.",
    tasks: [
      { icon: "🤖", label: "Auto-score features via RICE framework", ai: true },
      { icon: "🤖", label: "Map to vision + quarterly goals", ai: true },
      { icon: "✏️", label: "Final call on strategic tradeoffs", ai: false },
    ]
  },
  {
    title: "Meeting Intelligence",
    category: "Communication",
    ai: "full",
    desc: "Transcribe, summarize, extract decisions & action items from all meetings automatically.",
    tasks: [
      { icon: "🤖", label: "Transcribe & summarize meeting notes", ai: true },
      { icon: "🤖", label: "Extract action items & assign owners", ai: true },
      { icon: "🤖", label: "Update project tracker from meeting", ai: true },
    ]
  },
  {
    title: "Stakeholder Updates",
    category: "Communication",
    ai: "partial",
    desc: "Auto-draft weekly status emails and executive summaries from project data.",
    tasks: [
      { icon: "🤖", label: "Pull project data & draft status update", ai: true },
      { icon: "✏️", label: "Review, tailor tone & send", ai: false },
    ]
  },
  {
    title: "Data Synthesis & Insights",
    category: "Analytics",
    ai: "full",
    desc: "Aggregate metrics from multiple tools, surface anomalies, and generate weekly insights report.",
    tasks: [
      { icon: "🤖", label: "Pull data from Jira, Amplitude, Salesforce", ai: true },
      { icon: "🤖", label: "Detect trends, regressions, anomalies", ai: true },
      { icon: "🤖", label: "Generate insights summary", ai: true },
    ]
  },
  {
    title: "Project Status Tracking",
    category: "Execution",
    ai: "full",
    desc: "Monitor sprint progress, flag blockers, predict delivery risk in real-time.",
    tasks: [
      { icon: "🤖", label: "Monitor Jira/Linear for status changes", ai: true },
      { icon: "🤖", label: "Flag at-risk items automatically", ai: true },
      { icon: "✏️", label: "Resolve blockers & replan", ai: false },
    ]
  },
  {
    title: "Assignment Tracking",
    category: "Execution",
    ai: "partial",
    desc: "Track who owns what, surface overdue tasks, send reminders and escalations.",
    tasks: [
      { icon: "🤖", label: "Monitor assignments across tools", ai: true },
      { icon: "🤖", label: "Send nudge reminders to owners", ai: true },
      { icon: "✏️", label: "Handle escalations & conversations", ai: false },
    ]
  },
  {
    title: "User Research Synthesis",
    category: "Discovery",
    ai: "partial",
    desc: "Summarize interviews, cluster themes, surface key pain points from qualitative data.",
    tasks: [
      { icon: "🤖", label: "Cluster themes from interview notes", ai: true },
      { icon: "✏️", label: "Interpret strategic implications", ai: false },
    ]
  },
  {
    title: "Roadmap Planning",
    category: "Strategy",
    ai: "partial",
    desc: "Generate draft roadmap from backlog priorities, goals and capacity data.",
    tasks: [
      { icon: "🤖", label: "Draft roadmap from scored backlog", ai: true },
      { icon: "✏️", label: "Negotiate scope with engineering", ai: false },
      { icon: "✏️", label: "Present and align with leadership", ai: false },
    ]
  },
  {
    title: "Competitive Intelligence",
    category: "Discovery",
    ai: "full",
    desc: "Monitor competitors, scrape release notes and news, summarize weekly landscape changes.",
    tasks: [
      { icon: "🤖", label: "Scrape competitor blogs & release notes", ai: true },
      { icon: "🤖", label: "Weekly competitive landscape digest", ai: true },
    ]
  },
];

const agents = [
  {
    icon: "🧠", color: "ai-blue",
    name: "Prioritization Agent",
    trigger: "Every sprint planning session",
    desc: "Takes your backlog, applies RICE scoring based on business impact, reach, confidence and effort. Cross-references quarterly OKRs and vision docs to surface the top 10 items to work on.",
    inputs: ["Backlog (Jira/Linear)", "OKR doc", "Vision doc", "Capacity data"]
  },
  {
    icon: "🎙️", color: "ai-purple",
    name: "Meeting Scribe Agent",
    trigger: "After every meeting ends",
    desc: "Listens to meeting recordings (Zoom/Meets), produces a structured summary with key decisions, action items (with owner + due date), open questions, and auto-pushes tasks to your project tracker.",
    inputs: ["Meeting recording", "Calendar context", "Project tracker API"]
  },
  {
    icon: "📊", color: "ai-green",
    name: "Weekly Digest Agent",
    trigger: "Every Monday 8am",
    desc: "Aggregates data from Jira, Amplitude, Slack, and CRM. Generates an executive-ready briefing: what shipped, what's at risk, key metrics, and top 3 decisions needed from you this week.",
    inputs: ["Jira", "Amplitude", "Slack", "Salesforce", "Linear"]
  },
  {
    icon: "🔔", color: "ai-amber",
    name: "Risk & Blocker Agent",
    trigger: "Continuous monitoring",
    desc: "Watches for sprint velocity drops, overdue milestones, unassigned critical tickets, and silent stakeholders. Sends smart Slack alerts with suggested actions, not just raw notifications.",
    inputs: ["Jira / Linear", "Slack", "Calendar", "Project roadmap"]
  },
  {
    icon: "📝", color: "ai-blue",
    name: "Stakeholder Update Agent",
    trigger: "Every Friday 3pm",
    desc: "Pulls project status data, compares against last week's targets, writes a polished status email for each stakeholder group (exec, team, external) tailored to their level of detail.",
    inputs: ["Project tracker", "OKR targets", "Stakeholder map", "Last week's update"]
  },
  {
    icon: "🔭", color: "ai-purple",
    name: "Competitive Intel Agent",
    trigger: "Daily / on-demand",
    desc: "Monitors competitor websites, product blogs, App Store reviews, and tech news. Surfaces relevant changes as a clean weekly digest with so-what implications for your roadmap.",
    inputs: ["Competitor URLs", "G2/Capterra", "App Store", "Tech news feeds"]
  },
];

const projects = [
  { name: "Mobile Onboarding V2", progress: 78, status: "on-track", owner: "Ana + Raj", due: "Apr 30" },
  { name: "B2B Dashboard Revamp", progress: 45, status: "at-risk", owner: "Chen + Dev team", due: "May 15" },
  { name: "Payments Integration", progress: 20, status: "delayed", owner: "Priya", due: "May 28" },
  { name: "AI Recommendations", progress: 10, status: "planning", owner: "You + ML team", due: "Q3" },
  { name: "Search Improvement", progress: 91, status: "on-track", owner: "Marcus", due: "Apr 22" },
];

const todos = [
  { text: "Review Q2 prioritization doc before standup", priority: "high", done: false, aiNote: "AI-drafted" },
  { text: "Approve mobile onboarding spec from Ana", priority: "high", done: false, aiNote: null },
  { text: "Synthesize last week's user interviews", priority: "med", done: false, aiNote: "Agent queued" },
  { text: "Send weekly stakeholder update email", priority: "med", done: true, aiNote: "AI-drafted" },
  { text: "Review competitive intel digest from agent", priority: "low", done: false, aiNote: "Ready" },
  { text: "Prep for exec roadmap review (Thurs)", priority: "high", done: false, aiNote: null },
  { text: "Follow up on payments integration blocker", priority: "med", done: false, aiNote: "Agent flagged" },
];

const meetings = [
  {
    title: "Sprint Planning — Mobile Team",
    time: "Mon 10:00am · 60 min",
    outputs: ["Sprint backlog (AI-prioritized)", "Action items extracted", "Tracker updated"]
  },
  {
    title: "Exec Roadmap Review",
    time: "Thu 2:00pm · 45 min",
    outputs: ["Decision log", "Stakeholder update drafted", "3 action items created"]
  },
  {
    title: "User Research Readout",
    time: "Tue 3:00pm · 30 min",
    outputs: ["Theme clusters", "Pain point summary", "PRD inputs generated"]
  },
];

const riceItems = [
  { name: "AI Recommendations", r: 90, i: 9, c: 70, e: 8, score: 101 },
  { name: "Mobile Onboarding V2", r: 85, i: 8, c: 90, e: 5, score: 122 },
  { name: "Search Improvement", r: 60, i: 7, c: 80, e: 3, score: 112 },
  { name: "B2B Dashboard", r: 40, i: 8, c: 60, e: 9, score: 21 },
];

const scheduleEvents = [
  { hour: "8:00", label: "08:00", type: "deep", title: "🧠 Deep Work Block", desc: "Strategy doc / roadmap writing — no meetings", duration: "90 min", ai: "AI-blocked" },
  { hour: "9:30", label: "09:30", type: "admin", title: "📬 Inbox Triage", desc: "Emails, Slack, agent digests", duration: "30 min", ai: "Agent-sorted" },
  { hour: "10:00", label: "10:00", type: "meeting", title: "Sprint Planning — Mobile Team", desc: "Ana, Raj, Marcus · Zoom", duration: "60 min", ai: "Scribe active" },
  { hour: "11:00", label: "11:00", type: "buffer", title: "☕ Buffer + Follow-ups", desc: "Action items from sprint planning", duration: "30 min", ai: null },
  { hour: "11:30", label: "11:30", type: "deep", title: "🔬 User Research Synthesis", desc: "Review interview notes, cluster themes", duration: "60 min", ai: "Agent queued" },
  { hour: "12:30", label: "12:30", type: "break", title: "🍱 Lunch", desc: "Protected — no meetings", duration: "60 min", ai: null },
  { hour: "13:30", label: "13:30", type: "meeting", title: "1:1 with Engineering Lead", desc: "Chen · Payments blocker + capacity", duration: "30 min", ai: "Scribe active" },
  { hour: "14:00", label: "14:00", type: "admin", title: "📊 Metrics Review", desc: "Weekly digest from agent · Amplitude + Jira", duration: "30 min", ai: "Agent-compiled" },
  { hour: "14:30", label: "14:30", type: "deep", title: "📝 PRD Writing — AI Recommendations", desc: "No interruptions", duration: "90 min", ai: null },
  { hour: "16:00", label: "16:00", type: "meeting", title: "Exec Roadmap Review Prep", desc: "Slides review with design lead", duration: "30 min", ai: null },
  { hour: "16:30", label: "16:30", type: "admin", title: "📤 EOD: Stakeholder Update", desc: "Weekly update email — AI-drafted, you review", duration: "30 min", ai: "AI-drafted" },
  { hour: "17:00", label: "17:00", type: "buffer", title: "🌅 Wind Down / Planning Tomorrow", desc: "Review to-dos, set priorities for next day", duration: "30 min", ai: "Agent-suggested" },
];

const okrData = [
  {
    icon: "🚀", color: "#00d4ff",
    objective: "Accelerate User Activation & Time-to-Value",
    owner: "You + Growth team", overall: 62,
    krs: [
      { name: "Improve D7 activation rate from 34% → 50%", current: 41, target: 50, unit: "%", status: "on-track" },
      { name: "Reduce median time-to-first-value from 8 days → 5 days", current: 6.5, target: 5, unit: "days", status: "at-risk", invert: true },
      { name: "Ship redesigned onboarding flow to 100% of new users", current: 0, target: 100, unit: "%", status: "planning" },
    ]
  },
  {
    icon: "🤖", color: "#7c3aed",
    objective: "Launch AI-Powered Personalisation at Scale",
    owner: "You + ML team", overall: 22,
    krs: [
      { name: "Ship AI Recommendations to 10,000 users in beta", current: 0, target: 10000, unit: "users", status: "planning" },
      { name: "Achieve ≥15% lift in feature adoption from recommendations", current: 0, target: 15, unit: "%", status: "planning" },
      { name: "Complete model training & A/B test infrastructure", current: 60, target: 100, unit: "%", status: "on-track" },
    ]
  },
  {
    icon: "💼", color: "#10b981",
    objective: "Win the B2B Segment with Best-in-Class Tooling",
    owner: "You + Sales Eng", overall: 45,
    krs: [
      { name: "Launch B2B Dashboard to 50 enterprise accounts", current: 12, target: 50, unit: "accounts", status: "at-risk" },
      { name: "Reduce enterprise onboarding time from 14 days → 7 days", current: 11, target: 7, unit: "days", status: "on-track", invert: true },
      { name: "NPS score for B2B cohort ≥ 55", current: 48, target: 55, unit: "pts", status: "at-risk" },
    ]
  },
];

const stakeholders = [
  { name: "Sarah Mitchell", initials: "SM", color: "#7c3aed", role: "Chief Product Officer", email: "s.mitchell@company.com", projects: ["All Projects"], influence: 5, lastContact: "2d ago", contactAge: "recent", type: "Internal — Executive" },
  { name: "James Okafor", initials: "JO", color: "#00d4ff", role: "VP Engineering", email: "j.okafor@company.com", projects: ["Mobile Onboarding", "Payments"], influence: 5, lastContact: "3d ago", contactAge: "recent", type: "Internal — Engineering" },
  { name: "Ana Reyes", initials: "AR", color: "#10b981", role: "Senior Designer", email: "a.reyes@company.com", projects: ["Mobile Onboarding V2", "B2B Dashboard"], influence: 3, lastContact: "1d ago", contactAge: "recent", type: "Internal — Design" },
  { name: "Chen Wei", initials: "CW", color: "#f59e0b", role: "Engineering Lead", email: "c.wei@company.com", projects: ["B2B Dashboard", "Payments"], influence: 4, lastContact: "Today", contactAge: "recent", type: "Internal — Engineering" },
  { name: "Priya Nair", initials: "PN", color: "#ef4444", role: "Backend Engineer", email: "p.nair@company.com", projects: ["Payments Integration"], influence: 2, lastContact: "4d ago", contactAge: "recent", type: "Internal — Engineering" },
  { name: "Marcus Liu", initials: "ML", color: "#00d4ff", role: "Frontend Engineer", email: "m.liu@company.com", projects: ["Search Improvement", "Mobile Onboarding V2"], influence: 2, lastContact: "2d ago", contactAge: "recent", type: "Internal — Engineering" },
  { name: "David Park", initials: "DP", color: "#7c3aed", role: "Head of Sales", email: "d.park@company.com", projects: ["B2B Dashboard Revamp"], influence: 4, lastContact: "8d ago", contactAge: "old", type: "Internal — GTM" },
  { name: "Fiona Clarke", initials: "FC", color: "#10b981", role: "Enterprise Account Lead", email: "f.clarke@company.com", projects: ["B2B Dashboard Revamp"], influence: 3, lastContact: "12d ago", contactAge: "old", type: "Internal — GTM" },
  { name: "Tom Nguyen", initials: "TN", color: "#f59e0b", role: "ML Engineer", email: "t.nguyen@company.com", projects: ["AI Recommendations"], influence: 3, lastContact: "5d ago", contactAge: "recent", type: "Internal — ML" },
  { name: "Alicia Warren", initials: "AW", color: "#ef4444", role: "Customer Success Lead", email: "a.warren@company.com", projects: ["Mobile Onboarding V2", "AI Recommendations"], influence: 3, lastContact: "15d ago", contactAge: "stale", type: "Internal — CS" },
  { name: "Raj Patel", initials: "RP", color: "#00d4ff", role: "Product Designer", email: "r.patel@company.com", projects: ["Mobile Onboarding V2"], influence: 2, lastContact: "1d ago", contactAge: "recent", type: "Internal — Design" },
  { name: "Novex Corp (Client)", initials: "NC", color: "#7c3aed", role: "Enterprise Client", email: "product@novexcorp.com", projects: ["B2B Dashboard Revamp"], influence: 4, lastContact: "18d ago", contactAge: "stale", type: "External — Client" },
];


export default function Index() {
  const [activeTab, setActiveTab] = useState("overview");
  const [todos_, setTodos] = useState(todos);
  const [shFilter, setShFilter] = useState("All");
  const [expandedOkr, setExpandedOkr] = useState([0, 1, 2]);

  // PRD Agent state
  const [prdInput, setPrdInput] = useState("");
  const [prdStatus, setPrdStatus] = useState("idle"); // idle | processing | done
  const [prdResult, setPrdResult] = useState(null);

  // Privacy state
  const [memoryLog, setMemoryLog] = useState([
    { id: 1, text: "You own the Mobile Onboarding V2 project", source: "Jira sync", age: "2h ago", type: "project" },
    { id: 2, text: "Your weekly digest runs every Monday 8am", source: "User preference", age: "3d ago", type: "preference" },
    { id: 3, text: "Prioritization last ran on Apr 17 — 12 items scored", source: "Agent run", age: "2d ago", type: "agent" },
    { id: 4, text: "Stakeholder Sarah Mitchell: last contact 2 days ago", source: "Stakeholder sync", age: "1h ago", type: "contact" },
    { id: 5, text: "Meeting transcript from Sprint Planning processed", source: "Meeting Scribe", age: "1d ago", type: "meeting" },
    { id: 6, text: "Q2 OKR progress: 43% overall", source: "OKR sync", age: "4h ago", type: "okr" },
  ]);
  const [privacyToggles, setPrivacyToggles] = useState({
    persistentMemory: true,
    agentLearning: true,
    sessionOnly: false,
    auditLog: true,
  });
  const forgetMemory = (id: number) => setMemoryLog((m: typeof memoryLog) => m.filter(x => x.id !== id));
  const togglePrivacy = (key: keyof typeof privacyToggles) => setPrivacyToggles((t) => ({ ...t, [key]: !t[key] }));

  // Simulated PRD generation
  const runPRDAgent = () => {
    if (!prdInput.trim()) return;
    setPrdStatus("processing");
    setTimeout(() => {
      setPrdStatus("done");
      setPrdResult({
        themes: [
          { label: "Slow onboarding", freq: 18 },
          { label: "Missing search", freq: 14 },
          { label: "No mobile app", freq: 11 },
          { label: "Dashboard confusing", freq: 9 },
          { label: "Integration gaps", freq: 7 },
        ],
        problemStatement: "Enterprise users abandon the product within the first 3 days primarily due to a slow, confusing onboarding experience and lack of mobile access. 18 of 32 focus group participants cited onboarding as their top friction point.",
        userStories: [
          "As a new enterprise user, I want guided onboarding steps so that I reach my first value moment within 24 hours.",
          "As a PM on mobile, I want to view and triage my task list so that I can stay productive between meetings.",
          "As a team admin, I want to configure the dashboard layout so that my team sees relevant metrics immediately.",
        ],
        acceptanceCriteria: [
          "New user completes onboarding checklist in ≤ 10 minutes",
          "Mobile app available on iOS and Android with core task management",
          "Dashboard shows personalised widgets on first login",
          "Time-to-first-value measured ≤ 24h for 80% of new users",
        ],
        successMetrics: [
          "D7 activation rate: 34% → 55%",
          "Median time-to-first-value: 8 days → 2 days",
          "Mobile MAU: 0 → 40% of DAU within 90 days",
          "Onboarding NPS: current unknown → ≥ 45",
        ],
        openQuestions: [
          "Do we build mobile native or PWA first?",
          "Should onboarding be role-based (admin vs end user)?",
          "Who owns the integration SDK — platform or product?",
        ],
      });
    }, 2800);
  };

  const toggleTodo = (i: number) => {
    setTodos((t) => t.map((item, idx) => idx === i ? { ...item, done: !item.done } : item));
  };

  const toggleOkr = (i: number) => setExpandedOkr((prev: number[]) => prev.includes(i) ? prev.filter(x=>x!==i) : [...prev, i]);

  const shProjects = ["All", ...Array.from(new Set(stakeholders.flatMap(s => s.projects)))];
  const filteredSh = shFilter === "All" ? stakeholders : stakeholders.filter(s => s.projects.includes(shFilter));

  const tabs = [
    { id: "overview", label: "⬡ All Workflows" },
    { id: "priority", label: "◈ Prioritization" },
    { id: "agents", label: "⬡ AI Agents" },
    { id: "tracker", label: "◎ Project Tracker" },
    { id: "meetings", label: "✦ Meetings" },
    { id: "todos", label: "◻ To-Do" },
    { id: "schedule", label: "🕐 Daily Schedule" },
    { id: "okr", label: "◎ OKR Tracker" },
    { id: "stakeholders", label: "👥 Stakeholders" },
    { id: "prd", label: "📄 PRD Agent" },
    { id: "privacy", label: "🔐 Privacy Controls" },
    { id: "metrics", label: "📊 Pilot Metrics" },
  ];

  return (
    <>
      <style>{style}</style>
      <div className="dashboard">
        <div className="noise" />
        <div className="grid-bg" />
        <div className="glow-orb" />
        <div className="glow-orb2" />

        <div className="content">
          {/* Header */}
          <div className="header">
            <div className="header-eyebrow">AI-Powered Workflow OS</div>
            <h1>Sr. Product Manager<br />Command Centre</h1>
            <p>All workflows mapped, AI agents deployed, and priorities aligned — in one living system.</p>
          </div>

          {/* Status Bar */}
          <div className="status-bar">
            <div className="stat-pill"><div className="dot dot-green" /> 6 AI Agents Active</div>
            <div className="stat-pill"><div className="dot dot-blue" /> 5 Projects In Flight</div>
            <div className="stat-pill"><div className="dot dot-yellow" /> 1 At Risk</div>
            <div className="stat-pill"><div className="dot dot-purple" /> Q2 · Week 3 of 13</div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            {tabs.map(t => (
              <button key={t.id} className={`tab${activeTab === t.id ? " active" : ""}`} onClick={() => setActiveTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB: Overview */}
          {activeTab === "overview" && (
            <>
              <div className="section-header">
                <div className="section-title">Essential PM Workflows</div>
                <div className="section-sub">Every core task mapped — and colour-coded by AI automation potential</div>
              </div>
              <div className="legend">
                <div className="legend-item"><div className="legend-dot" style={{background:"#10b981"}} /> Fully Automatable</div>
                <div className="legend-item"><div className="legend-dot" style={{background:"#f59e0b"}} /> AI-Assisted (human in loop)</div>
                <div className="legend-item"><div className="legend-dot" style={{background:"#334155"}} /> Human-Led</div>
              </div>
              <div className="workflow-grid">
                {workflows.map((wf, i) => (
                  <div key={i} className={`workflow-card ai-${wf.ai}`}>
                    <div className="wf-header">
                      <div>
                        <div className="wf-title">{wf.title}</div>
                        <div className="wf-category">{wf.category}</div>
                      </div>
                      <div className={`ai-badge ${wf.ai === "full" ? "badge-full" : wf.ai === "partial" ? "badge-partial" : "badge-manual"}`}>
                        {wf.ai === "full" ? "⚡ Full AI" : wf.ai === "partial" ? "◑ AI-Assist" : "◯ Manual"}
                      </div>
                    </div>
                    <div className="wf-desc">{wf.desc}</div>
                    <div className="wf-tasks">
                      {wf.tasks.map((t, j) => (
                        <div key={j} className="wf-task">
                          <span className="task-icon">{t.icon}</span>
                          <span className="task-label">{t.label}</span>
                          {t.ai && <span className="task-ai-tag">agent</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* TAB: Prioritization */}
          {activeTab === "priority" && (
            <>
              <div className="section-header">
                <div className="section-title">Prioritization Framework</div>
                <div className="section-sub">RICE scoring aligned to vision, OKRs and quarterly strategy</div>
              </div>
              <div className="priority-grid">
                {/* Impact/Effort Matrix */}
                <div className="card">
                  <div className="card-title"><span className="card-title-icon">◈</span> Impact vs Effort Matrix</div>
                  <div style={{display:"flex", justifyContent:"space-between", fontSize:"10px", fontFamily:"DM Mono", color:"var(--muted)", marginBottom:"6px", padding:"0 2px"}}>
                    <span>← LOW EFFORT</span><span>HIGH EFFORT →</span>
                  </div>
                  <div className="matrix-grid">
                    <div className="matrix-cell mc-q1">
                      <div className="mc-label" style={{color:"#10b981"}}>🚀 Quick Wins<br/><span style={{fontSize:"10px",fontWeight:400,color:"var(--muted)"}}>High Impact, Low Effort</span></div>
                      <div className="mc-items">
                        <div className="mc-item">Mobile Onboarding</div>
                        <div className="mc-item">Search Improvement</div>
                      </div>
                    </div>
                    <div className="matrix-cell mc-q2">
                      <div className="mc-label" style={{color:"var(--accent)"}}>🎯 Major Projects<br/><span style={{fontSize:"10px",fontWeight:400,color:"var(--muted)"}}>High Impact, High Effort</span></div>
                      <div className="mc-items">
                        <div className="mc-item">AI Recommendations</div>
                        <div className="mc-item">Payments Integration</div>
                      </div>
                    </div>
                    <div className="matrix-cell mc-q3">
                      <div className="mc-label" style={{color:"var(--accent4)"}}>🔧 Fill-ins<br/><span style={{fontSize:"10px",fontWeight:400,color:"var(--muted)"}}>Low Impact, Low Effort</span></div>
                      <div className="mc-items">
                        <div className="mc-item">UI Polish</div>
                        <div className="mc-item">Minor bug fixes</div>
                      </div>
                    </div>
                    <div className="matrix-cell mc-q4">
                      <div className="mc-label" style={{color:"var(--muted)"}}>🚫 Avoid<br/><span style={{fontSize:"10px",fontWeight:400,color:"var(--muted)"}}>Low Impact, High Effort</span></div>
                      <div className="mc-items">
                        <div className="mc-item">Legacy migration</div>
                        <div className="mc-item">Niche edge cases</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RICE Scoring */}
                <div className="card">
                  <div className="card-title"><span className="card-title-icon">◎</span> RICE Score · AI-Calculated</div>
                  <table className="rice-table">
                    <thead>
                      <tr>
                        <th>Feature</th>
                        <th>R</th><th>I</th><th>C%</th><th>E</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riceItems.sort((a,b)=>b.score-a.score).map((item, i) => (
                        <tr key={i}>
                          <td style={{fontWeight:500}}>{item.name}</td>
                          <td style={{color:"var(--muted)", fontFamily:"DM Mono", fontSize:"11px"}}>{item.r}</td>
                          <td style={{color:"var(--muted)", fontFamily:"DM Mono", fontSize:"11px"}}>{item.i}</td>
                          <td style={{color:"var(--muted)", fontFamily:"DM Mono", fontSize:"11px"}}>{item.c}</td>
                          <td style={{color:"var(--muted)", fontFamily:"DM Mono", fontSize:"11px"}}>{item.e}</td>
                          <td>
                            <div className="score-bar-wrap">
                              <div className="score-bar"><div className="score-fill" style={{width:`${(item.score/130)*100}%`, background:`hsl(${item.score+100}, 70%, 60%)`}} /></div>
                              <span className="score-num">{item.score}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{marginTop:14, padding:"10px 12px", background:"rgba(0,212,255,0.05)", border:"1px solid rgba(0,212,255,0.1)", borderRadius:8, fontSize:12, color:"var(--muted)"}}>
                    🤖 <strong style={{color:"var(--accent)"}}>Agent insight:</strong> Mobile Onboarding V2 is your highest RICE score and directly aligns with Q2 activation OKR. Ship it first.
                  </div>
                </div>

                {/* OKR Alignment */}
                <div className="card full-width">
                  <div className="card-title"><span className="card-title-icon">✦</span> Q2 OKR Alignment Map · Vision → Goals → Features</div>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 2px 1fr 2px 1fr", gap:"0 16px", alignItems:"start"}}>
                    <div>
                      <div style={{fontFamily:"Syne", fontWeight:700, fontSize:13, color:"var(--accent)", marginBottom:10}}>🔭 Vision</div>
                      {["Become the #1 B2B productivity platform", "Best-in-class user experience", "Data-driven personalization at scale"].map((v,i)=>(
                        <div key={i} style={{fontSize:12, padding:"8px 10px", background:"rgba(0,212,255,0.05)", border:"1px solid rgba(0,212,255,0.1)", borderRadius:8, marginBottom:6, color:"var(--text)"}}>{v}</div>
                      ))}
                    </div>
                    <div style={{background:"var(--border)", borderRadius:2}} />
                    <div>
                      <div style={{fontFamily:"Syne", fontWeight:700, fontSize:13, color:"var(--accent2)", marginBottom:10}}>◎ Q2 Goals</div>
                      {["Improve activation rate by 25%", "Reduce time-to-value by 40%", "Launch AI feature to 10K users"].map((v,i)=>(
                        <div key={i} style={{fontSize:12, padding:"8px 10px", background:"rgba(124,58,237,0.05)", border:"1px solid rgba(124,58,237,0.1)", borderRadius:8, marginBottom:6, color:"var(--text)"}}>{v}</div>
                      ))}
                    </div>
                    <div style={{background:"var(--border)", borderRadius:2}} />
                    <div>
                      <div style={{fontFamily:"Syne", fontWeight:700, fontSize:13, color:"var(--accent3)", marginBottom:10}}>🚀 Top Features</div>
                      {["Mobile Onboarding V2 ↑ activation", "AI Recommendations ↑ engagement", "Search Improvement ↑ time-to-value"].map((v,i)=>(
                        <div key={i} style={{fontSize:12, padding:"8px 10px", background:"rgba(16,185,129,0.05)", border:"1px solid rgba(16,185,129,0.1)", borderRadius:8, marginBottom:6, color:"var(--text)"}}>{v}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB: Agents */}
          {activeTab === "agents" && (
            <>
              <div className="section-header">
                <div className="section-title">Your AI Agent Stack</div>
                <div className="section-sub">6 agents handling the repetitive, cognitive-load-heavy work so you can focus on decisions</div>
              </div>
              <div className="agents-grid">
                {agents.map((a, i) => (
                  <div key={i} className="agent-card">
                    <div className={`agent-icon-wrap ${a.color}`}>{a.icon}</div>
                    <div className="agent-name">{a.name}</div>
                    <div className="agent-trigger">{a.trigger}</div>
                    <div className="agent-desc">{a.desc}</div>
                    <div style={{fontSize:11, color:"var(--muted)", marginBottom:8, fontFamily:"DM Mono", textTransform:"uppercase", letterSpacing:"0.08em"}}>Inputs</div>
                    <div className="agent-inputs">
                      {a.inputs.map((inp, j) => <span key={j} className="input-chip">{inp}</span>)}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:20, padding:"16px 20px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12}}>
                <div style={{fontFamily:"Syne", fontWeight:700, fontSize:14, marginBottom:8}}>🏗️ Recommended Stack to Build This</div>
                <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:10}}>
                  {[
                    ["Orchestration", "LangGraph / CrewAI"],
                    ["LLM", "Claude API (Sonnet)"],
                    ["Memory", "Mem0 / Pinecone"],
                    ["Integrations", "Zapier / Make.com"],
                    ["Comms", "Slack Bot API"],
                    ["Voice/TTS", "ElevenLabs"],
                  ].map(([label, val], i) => (
                    <div key={i} style={{fontSize:12, padding:"10px 12px", background:"var(--surface2)", borderRadius:8, border:"1px solid var(--border)"}}>
                      <div style={{fontFamily:"DM Mono", fontSize:10, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4}}>{label}</div>
                      <div style={{color:"var(--accent)", fontWeight:500}}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB: Tracker */}
          {activeTab === "tracker" && (
            <>
              <div className="section-header">
                <div className="section-title">Project & Assignment Tracker</div>
                <div className="section-sub">Live project health — AI monitors, flags risks, and updates automatically</div>
              </div>
              <div className="card" style={{marginBottom:16}}>
                <div className="card-title"><span className="card-title-icon">◎</span> Active Projects · Q2</div>
                <div style={{fontSize:11, fontFamily:"DM Mono", color:"var(--muted)", display:"grid", gridTemplateColumns:"180px 1fr 80px 90px 70px", gap:12, padding:"0 16px 10px", borderBottom:"1px solid var(--border)"}}>
                  <span>PROJECT</span><span>PROGRESS</span><span>STATUS</span><span>OWNER</span><span>DUE</span>
                </div>
                {projects.map((p, i) => (
                  <div key={i} className="project-row">
                    <div className="project-name">{p.name}</div>
                    <div className="progress-wrap">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{
                          width:`${p.progress}%`,
                          background: p.status === "on-track" ? "var(--accent3)" : p.status === "at-risk" ? "var(--accent4)" : p.status === "delayed" ? "var(--accent5)" : "var(--accent2)"
                        }} />
                      </div>
                      <span className="progress-pct">{p.progress}%</span>
                    </div>
                    <div className={`status-chip s-${p.status}`}>{p.status.replace("-", " ")}</div>
                    <div className="owner-tag">{p.owner}</div>
                    <div style={{fontSize:11, fontFamily:"DM Mono", color:"var(--muted)"}}>{p.due}</div>
                  </div>
                ))}
              </div>
              <div style={{padding:"12px 16px", background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:10, display:"flex", gap:10, alignItems:"flex-start"}}>
                <span style={{fontSize:20}}>🔔</span>
                <div>
                  <div style={{fontFamily:"Syne", fontWeight:700, fontSize:13, color:"var(--accent5)", marginBottom:4}}>Risk Agent Alert</div>
                  <div style={{fontSize:12, color:"var(--muted)", lineHeight:1.6}}>
                    <strong style={{color:"var(--text)"}}>Payments Integration</strong> is 3 days behind sprint target. Priya has 2 unreviewed PRs and 1 unblocked dependency outstanding. <span style={{color:"var(--accent)"}}>Suggested: Schedule async sync today.</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB: Meetings */}
          {activeTab === "meetings" && (
            <>
              <div className="section-header">
                <div className="section-title">Meeting Intelligence</div>
                <div className="section-sub">Agent listens, extracts decisions, creates tasks, updates tracker — zero manual notes</div>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
                <div>
                  <div className="card-title" style={{marginBottom:16}}><span>✦</span> This Week's Meetings</div>
                  <div className="meeting-list">
                    {meetings.map((m, i) => (
                      <div key={i} className="meeting-item">
                        <div className="meeting-header">
                          <div className="meeting-title">{m.title}</div>
                          <div className="meeting-time">{m.time}</div>
                        </div>
                        <div style={{fontSize:11, fontFamily:"DM Mono", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6}}>Agent Outputs</div>
                        <div className="meeting-outputs">
                          {m.outputs.map((o, j) => <span key={j} className="output-tag">{o}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="card-title" style={{marginBottom:16}}><span>🤖</span> Agent Meeting Flow</div>
                  <div className="card" style={{background:"var(--surface2)"}}>
                    {[
                      ["1", "Record", "Meeting auto-recorded via Zoom/Meet integration"],
                      ["2", "Transcribe", "Whisper/Deepgram converts audio to text in real-time"],
                      ["3", "Summarize", "Claude generates structured summary in 30 seconds"],
                      ["4", "Extract", "Decisions, action items, open questions pulled out"],
                      ["5", "Assign", "Each action item gets owner, due date, priority"],
                      ["6", "Sync", "Jira/Linear auto-updated. Slack summary sent to team"],
                    ].map(([num, title, desc], i) => (
                      <div key={i} style={{display:"flex", gap:12, padding:"10px 0", borderBottom: i < 5 ? "1px solid var(--border)" : "none", alignItems:"flex-start"}}>
                        <div style={{width:22, height:22, borderRadius:"50%", background:"rgba(0,212,255,0.1)", border:"1px solid rgba(0,212,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"DM Mono", fontSize:10, color:"var(--accent)", flexShrink:0}}>{num}</div>
                        <div>
                          <div style={{fontFamily:"Syne", fontWeight:700, fontSize:12, marginBottom:2}}>{title}</div>
                          <div style={{fontSize:11, color:"var(--muted)"}}>{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB: Todos */}
          {activeTab === "todos" && (
            <>
              <div className="section-header">
                <div className="section-title">Daily To-Do · AI-Curated</div>
                <div className="section-sub">Your agent synthesizes inputs from all sources to surface what actually matters today</div>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 300px", gap:16}}>
                <div className="card">
                  <div className="card-title"><span>◻</span> Today's Focus List</div>
                  <div className="todo-list">
                    {todos_.map((t, i) => (
                      <div key={i} className="todo-item" onClick={() => toggleTodo(i)} style={{cursor:"pointer"}}>
                        <div className={`todo-check${t.done ? " done" : ""}`}>{t.done ? "✓" : ""}</div>
                        <div className={`todo-text${t.done ? " done" : ""}`}>{t.text}</div>
                        {t.aiNote && <span className="todo-ai-note">🤖 {t.aiNote}</span>}
                        <span className={`todo-priority p-${t.priority}`}>{t.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", gap:12}}>
                  <div className="card">
                    <div className="card-title"><span>⚡</span> AI Suggestion</div>
                    <div style={{fontSize:12, color:"var(--muted)", lineHeight:1.7}}>
                      Based on your calendar and project risks, your <strong style={{color:"var(--text)"}}>top priority today</strong> is reviewing the Q2 prioritization doc — exec review is Thursday and Mobile Onboarding is your highest-RICE item.
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-title"><span>📋</span> Task Sources</div>
                    {[
                      ["Meeting Scribe Agent", "2 tasks"],
                      ["Risk & Blocker Agent", "1 flag"],
                      ["Manual (you)", "3 tasks"],
                      ["Stakeholder email", "1 follow-up"],
                    ].map(([src, count], i) => (
                      <div key={i} style={{display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom: i<3 ? "1px solid var(--border)" : "none", fontSize:12}}>
                        <span style={{color:"var(--muted)"}}>{src}</span>
                        <span style={{fontFamily:"DM Mono", fontSize:11, color:"var(--accent)"}}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB: Daily Schedule */}
          {activeTab === "schedule" && (
            <>
              <div className="section-header">
                <div className="section-title">Daily Schedule · Friday</div>
                <div className="section-sub">AI-optimised time blocks — deep work protected, meetings batched, energy tracked</div>
              </div>
              <div className="schedule-layout">
                {/* Timeline */}
                <div className="card" style={{padding:"20px 16px"}}>
                  <div style={{display:"flex", gap:6, marginBottom:16}}>
                    {[["meeting","#7c3aed","Meetings"],["deep","#00d4ff","Deep Work"],["admin","#64748b","Admin"],["buffer","#10b981","Buffer"],["break","#f59e0b","Break"]].map(([type,col,label])=>(
                      <div key={type} style={{display:"flex",alignItems:"center",gap:5,fontSize:11}}>
                        <div style={{width:8,height:8,borderRadius:2,background:col,flexShrink:0}}/>
                        <span style={{color:"var(--muted)"}}>{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="timeline">
                    {scheduleEvents.map((ev, i) => (
                      <div key={i} className="time-slot">
                        <div className="time-label">{ev.label}</div>
                        <div className="slot-content">
                          <div className={`event-block ev-${ev.type}`}>
                            <div className="ev-title">{ev.title}</div>
                            <div className="ev-meta">
                              <span>{ev.desc}</span>
                              <span className="ev-duration">{ev.duration}</span>
                              {ev.ai && <span className="ev-ai-tag">🤖 {ev.ai}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Aside */}
                <div className="sched-aside">
                  <div className="card">
                    <div className="card-title">📊 Day at a Glance</div>
                    <div className="day-stat-grid">
                      {[["5","Meetings"],["3h","Deep Work"],["1.5h","Admin"],["1h","Buffer"]].map(([val,lbl])=>(
                        <div key={lbl} className="day-stat">
                          <div className="day-stat-val" style={{color:"var(--accent)"}}>{val}</div>
                          <div className="day-stat-label">{lbl}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{marginTop:4}}>
                      <div style={{fontSize:11,fontFamily:"DM Mono",color:"var(--muted)",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Energy Curve</div>
                      <div className="energy-bar">
                        {[70,85,90,80,60,50,75,80,85,70,55,45,50].map((h,i)=>(
                          <div key={i} className="energy-seg" style={{height:`${h}%`,background: h>75?"var(--accent3)":h>60?"var(--accent4)":"var(--accent5)",opacity:0.7}} />
                        ))}
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,fontFamily:"DM Mono",color:"var(--muted)",marginTop:4}}>
                        <span>8am</span><span>1pm</span><span>5pm</span>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-title">🤖 AI Time Protections</div>
                    {[
                      ["8:00–9:30","Deep Work","No meetings allowed. AI declines calendar invites."],
                      ["12:30–13:30","Lunch","Calendar blocked. Auto-decline enabled."],
                      ["14:30–16:00","PRD Writing","Focus mode. Slack DND on."],
                    ].map(([time, label, note], i)=>(
                      <div key={i} style={{padding:"10px 0",borderBottom: i<2?"1px solid var(--border)":"none"}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                          <span style={{fontFamily:"Syne",fontWeight:700,fontSize:12}}>{label}</span>
                          <span style={{fontFamily:"DM Mono",fontSize:10,color:"var(--accent)"}}>{time}</span>
                        </div>
                        <div style={{fontSize:11,color:"var(--muted)"}}>{note}</div>
                      </div>
                    ))}
                  </div>
                  <div className="card">
                    <div className="card-title">📅 This Week's Load</div>
                    <div style={{display:"flex",alignItems:"flex-end",gap:6,height:60,marginBottom:8}}>
                      {([["M",8,"#10b981"],["T",5,"#10b981"],["W",9,"#f59e0b"],["Th",11,"#ef4444"],["F",6,"#10b981"]] as [string, number, string][]).map(([d,h,c])=>(
                        <div key={d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                          <div style={{width:"100%",background:c,borderRadius:"3px 3px 0 0",height:`${(h/12)*52}px`,opacity:0.7}}/>
                          <span style={{fontFamily:"DM Mono",fontSize:9,color:"var(--muted)"}}>{d}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{fontSize:11,color:"var(--muted)"}}>Thursday is over-allocated. Agent flagged 2 optional meetings to defer.</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB: OKR Tracker */}
          {activeTab === "okr" && (
            <>
              <div className="section-header">
                <div className="section-title">Q2 OKR Progress Tracker</div>
                <div className="section-sub">April – June 2025 · Week 3 of 13 · AI monitors KRs and flags drift weekly</div>
              </div>
              {/* Quarter summary */}
              <div className="okr-quarter-header">
                {[
                  {num:"43%",lbl:"Overall Q2 Progress",col:"var(--accent)"},
                  {num:"3/9",lbl:"KRs On Track",col:"var(--accent3)"},
                  {num:"4/9",lbl:"KRs At Risk",col:"var(--accent4)"},
                  {num:"10",lbl:"Weeks Remaining",col:"var(--muted)"},
                ].map(({num,lbl,col})=>(
                  <div key={lbl} className="q-stat-card">
                    <div className="q-stat-num" style={{color:col}}>{num}</div>
                    <div className="q-stat-lbl">{lbl}</div>
                  </div>
                ))}
              </div>
              {/* Week timeline */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,fontFamily:"DM Mono",color:"var(--muted)",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.08em"}}>Quarter Timeline · W1–W13</div>
                <div style={{display:"flex",gap:0,borderRadius:8,overflow:"hidden",border:"1px solid var(--border)"}}>
                  {Array.from({length:13},(_,i)=>{
                    const w = i+1;
                    const isPast = w < 3;
                    const isCurrent = w === 3;
                    return (
                      <div key={w} style={{
                        flex:1, padding:"7px 2px", textAlign:"center",
                        fontFamily:"DM Mono", fontSize:9,
                        borderRight: w<13?"1px solid var(--border)":"none",
                        background: isCurrent?"rgba(0,212,255,0.1)":isPast?"rgba(16,185,129,0.05)":"transparent",
                        color: isCurrent?"var(--accent)":isPast?"var(--accent3)":"var(--muted)",
                        position:"relative"
                      }}>
                        W{w}
                        {isCurrent && <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:2,height:4,background:"var(--accent)"}}/>}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* OKR objectives */}
              <div className="okr-layout">
                {okrData.map((obj, oi) => (
                  <div key={oi} className="okr-objective">
                    <div className="okr-obj-header" onClick={() => toggleOkr(oi)} style={{cursor:"pointer"}}>
                      <div className="okr-obj-icon" style={{background:`${obj.color}18`,border:`1px solid ${obj.color}30`}}>{obj.icon}</div>
                      <div style={{flex:1}}>
                        <div className="okr-obj-title">{obj.objective}</div>
                        <div className="okr-obj-sub">Owner: {obj.owner}</div>
                      </div>
                      <div className="okr-obj-progress">
                        <div className="okr-obj-pct" style={{color:obj.color}}>{obj.overall}%</div>
                        <div className="okr-obj-label">overall progress</div>
                      </div>
                      <div style={{marginLeft:16,fontSize:16,color:"var(--muted)",userSelect:"none"}}>{expandedOkr.includes(oi)?"▾":"▸"}</div>
                    </div>
                    <div style={{padding:"0 20px 4px"}}>
                      <div className="okr-track"><div className="okr-track-fill" style={{width:`${obj.overall}%`,background:obj.color}}/></div>
                    </div>
                    {expandedOkr.includes(oi) && (
                      <div className="kr-list">
                        {obj.krs.map((kr, ki) => {
                          const pct = kr.invert
                            ? Math.max(0, Math.min(100, Math.round(((kr.target * 2 - kr.current) / (kr.target * 2)) * 100)))
                            : Math.max(0, Math.min(100, Math.round((kr.current / kr.target) * 100)));
                          const barColor = kr.status === "on-track" ? "var(--accent3)" : kr.status === "at-risk" ? "var(--accent4)" : "var(--accent2)";
                          const chipStyle = kr.status === "on-track"
                            ? {background:"rgba(16,185,129,0.1)",color:"var(--accent3)",border:"1px solid rgba(16,185,129,0.2)"}
                            : kr.status === "at-risk"
                            ? {background:"rgba(245,158,11,0.1)",color:"var(--accent4)",border:"1px solid rgba(245,158,11,0.2)"}
                            : {background:"rgba(124,58,237,0.1)",color:"var(--accent2)",border:"1px solid rgba(124,58,237,0.2)"};
                          return (
                            <div key={ki} className="kr-item">
                              <div className="kr-name">{kr.name}</div>
                              <div className="kr-bar-wrap">
                                <div className="kr-bar"><div className="kr-fill" style={{width:`${pct}%`,background:barColor}}/></div>
                                <div className="kr-numbers">
                                  <span>Current: <strong style={{color:"var(--text)"}}>{kr.current}{kr.unit}</strong></span>
                                  <span>Target: {kr.target}{kr.unit}</span>
                                </div>
                              </div>
                              <div className="kr-status-chip" style={chipStyle}>{kr.status.replace("-"," ")}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{marginTop:12,padding:"12px 16px",background:"rgba(0,212,255,0.04)",border:"1px solid rgba(0,212,255,0.12)",borderRadius:10,fontSize:12,color:"var(--muted)"}}>
                🤖 <strong style={{color:"var(--accent)"}}>Weekly AI Insight:</strong> At current velocity, D7 activation will reach ~46% by end of Q2 — 4pp short of target. Shipping the new onboarding flow by Apr 30 is critical. B2B Dashboard is the highest delivery risk this quarter.
              </div>
            </>
          )}

          {/* TAB: Stakeholders */}
          {activeTab === "stakeholders" && (
            <>
              <div className="section-header">
                <div className="section-title">Stakeholder Directory</div>
                <div className="section-sub">Everyone who matters — filterable by project, with influence level and last contact</div>
              </div>
              {/* Filter bar */}
              <div className="sh-filter-bar">
                {shProjects.map(p => (
                  <button key={p} className={`sh-filter-btn${shFilter===p?" active":""}`} onClick={()=>setShFilter(p)}>
                    {p}
                  </button>
                ))}
              </div>
              {/* Summary row */}
              <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
                {[
                  {label:`${filteredSh.length} People`,col:"var(--accent)"},
                  {label:`${filteredSh.filter(s=>s.contactAge==="stale").length} Need Contact`,col:"var(--accent5)"},
                  {label:`${filteredSh.filter(s=>s.influence>=4).length} High Influence`,col:"var(--accent2)"},
                ].map(({label,col})=>(
                  <div key={label} style={{fontSize:12,fontFamily:"DM Mono",padding:"5px 12px",borderRadius:100,background:"var(--surface)",border:"1px solid var(--border)",color:col}}>{label}</div>
                ))}
              </div>
              {/* Table */}
              <div className="card" style={{padding:0,overflow:"hidden"}}>
                <div className="sh-table-header">
                  <span>Name</span><span>Type</span><span>Email</span><span>Projects</span><span>Influence</span><span>Last Contact</span>
                </div>
                {filteredSh.map((s, i) => (
                  <div key={i} className="sh-row">
                    <div className="sh-name-wrap">
                      <div className="sh-avatar" style={{background:`${s.color}18`,border:`1px solid ${s.color}30`,color:s.color}}>{s.initials}</div>
                      <div>
                        <div className="sh-name">{s.name}</div>
                        <div className="sh-role">{s.role}</div>
                      </div>
                    </div>
                    <div style={{fontSize:11,color:"var(--muted)"}}>{s.type}</div>
                    <a className="sh-email" href={`mailto:${s.email}`}>{s.email}</a>
                    <div className="sh-project-tags">
                      {s.projects.map((p,j)=><span key={j} className="sh-proj-tag">{p}</span>)}
                    </div>
                    <div className="influence-bar">
                      {Array.from({length:5},(_,j)=>(
                        <div key={j} className={`inf-dot ${j<s.influence?"filled":"empty"}`}/>
                      ))}
                    </div>
                    <div className={`last-contact lc-${s.contactAge}`}>{s.lastContact}</div>
                  </div>
                ))}
              </div>
              {/* Stale contact alert */}
              {filteredSh.filter(s=>s.contactAge==="stale").length > 0 && (
                <div style={{marginTop:12,padding:"12px 16px",background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:10,display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{fontSize:18}}>🔔</span>
                  <div>
                    <div style={{fontFamily:"Syne",fontWeight:700,fontSize:13,color:"var(--accent5)",marginBottom:4}}>Stakeholder Agent Alert</div>
                    <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6}}>
                      <strong style={{color:"var(--text)"}}>{filteredSh.filter(s=>s.contactAge==="stale").map(s=>s.name).join(", ")}</strong> haven't been contacted in 15+ days. Agent has drafted check-in emails — review and send from the Meetings tab.
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB: PRD Agent */}
          {activeTab === "prd" && (
            <>
              <div className="section-header">
                <div className="section-title">Focus Group → PRD Agent</div>
                <div className="section-sub">Paste raw transcripts, survey exports or feedback notes — agent clusters themes and writes a structured PRD in seconds</div>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
                {/* Input side */}
                <div style={{display:"flex", flexDirection:"column", gap:12}}>
                  <div className="card">
                    <div className="card-title">📥 Input — Focus Group Data</div>
                    {prdStatus === "idle" || prdStatus === "processing" ? (
                      <>
                        <div className="upload-zone" style={{marginBottom:12}} onClick={() => document.getElementById('prd-file').click()}>
                          <div className="upload-zone-icon">📎</div>
                          <div className="upload-zone-label">Drop files or click to upload</div>
                          <div className="upload-zone-sub">Supports .txt, .csv, .docx, .pdf — transcripts, survey exports, feedback sheets</div>
                          <input id="prd-file" type="file" style={{display:"none"}} />
                        </div>
                        <div style={{fontSize:11, fontFamily:"DM Mono", color:"var(--muted)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em"}}>Or paste raw text</div>
                        <textarea
                          value={prdInput}
                          onChange={e => setPrdInput(e.target.value)}
                          placeholder={`Paste focus group transcript, survey responses, or feedback notes here...\n\nExample:\n"Participant 3: The onboarding took me 45 minutes and I still didn't understand the core feature..."\n"Survey Q4: 18 of 32 respondents said slow onboarding was their #1 pain point..."`}
                          style={{
                            width:"100%", minHeight:180, background:"var(--surface2)",
                            border:"1px solid var(--border)", borderRadius:8, padding:12,
                            color:"var(--text)", fontSize:12, lineHeight:1.6, resize:"vertical",
                            fontFamily:"var(--font-sans, DM Sans)", outline:"none"
                          }}
                        />
                        <button
                          onClick={runPRDAgent}
                          disabled={prdStatus === "processing" || !prdInput.trim()}
                          style={{
                            marginTop:10, width:"100%", padding:"11px 0",
                            background: prdInput.trim() ? "var(--accent)" : "var(--border)",
                            color: prdInput.trim() ? "#000" : "var(--muted)",
                            border:"none", borderRadius:8, fontFamily:"Syne, sans-serif",
                            fontWeight:700, fontSize:14, cursor: prdInput.trim() ? "pointer" : "default",
                            transition:"all 0.2s"
                          }}
                        >
                          {prdStatus === "processing" ? "Analysing..." : "⚡ Generate PRD"}
                        </button>
                        {prdStatus === "processing" && (
                          <div className="prd-processing">
                            <div className="spinner" />
                            <span>Agent is clustering themes, extracting pain points and writing your PRD...</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div>
                        <div style={{fontSize:12, color:"var(--accent3)", marginBottom:10, fontFamily:"DM Mono"}}>✓ Processed {prdInput.split(' ').length} words of input data</div>
                        <div style={{display:"flex", flexWrap:"wrap", gap:6, marginBottom:14}}>
                          {prdResult.themes.map((t,i) => (
                            <span key={i} className="theme-tag">
                              {t.label} <span className="theme-freq">×{t.freq}</span>
                            </span>
                          ))}
                        </div>
                        <button onClick={() => { setPrdStatus("idle"); setPrdInput(""); setPrdResult(null); }}
                          style={{fontSize:11, fontFamily:"DM Mono", padding:"5px 12px", border:"1px solid var(--border)", borderRadius:6, background:"transparent", color:"var(--muted)", cursor:"pointer"}}>
                          ↺ New input
                        </button>
                      </div>
                    )}
                  </div>
                  {prdResult && (
                    <div className="card">
                      <div className="card-title">🎯 Theme Frequency</div>
                      {prdResult.themes.map((t, i) => (
                        <div key={i} style={{display:"flex", alignItems:"center", gap:10, padding:"6px 0", borderBottom: i<prdResult.themes.length-1 ? "1px solid rgba(30,45,66,0.4)" : "none"}}>
                          <span style={{fontSize:12, flex:1}}>{t.label}</span>
                          <div style={{width:80, height:4, background:"var(--border)", borderRadius:2, overflow:"hidden"}}>
                            <div style={{height:"100%", width:`${(t.freq/18)*100}%`, background:"var(--accent)", borderRadius:2}}/>
                          </div>
                          <span style={{fontFamily:"DM Mono", fontSize:11, color:"var(--muted)", width:20, textAlign:"right"}}>{t.freq}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* PRD Output side */}
                <div>
                  {!prdResult && prdStatus !== "processing" && (
                    <div className="card" style={{height:"100%", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, opacity:0.5}}>
                      <div style={{fontSize:40}}>📄</div>
                      <div style={{fontFamily:"Syne", fontWeight:700, fontSize:14}}>PRD will appear here</div>
                      <div style={{fontSize:12, color:"var(--muted)", textAlign:"center", maxWidth:240}}>Paste focus group data on the left and click Generate PRD</div>
                    </div>
                  )}
                  {prdStatus === "processing" && (
                    <div className="card" style={{height:"100%", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12}}>
                      <div className="spinner" style={{width:32, height:32, borderWidth:3}} />
                      <div style={{fontFamily:"Syne", fontWeight:700}}>Writing PRD...</div>
                      <div style={{fontSize:11, color:"var(--muted)", fontFamily:"DM Mono"}}>Clustering → Pain points → User stories → Metrics</div>
                    </div>
                  )}
                  {prdResult && (
                    <div className="card" style={{padding:0, overflow:"hidden"}}>
                      <div style={{padding:"14px 20px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(255,255,255,0.02)"}}>
                        <div>
                          <div style={{fontFamily:"Syne", fontWeight:800, fontSize:15}}>Product Requirements Document</div>
                          <div style={{fontFamily:"DM Mono", fontSize:10, color:"var(--muted)"}}>AI-generated · {new Date().toLocaleDateString()} · Review before sharing</div>
                        </div>
                        <div style={{fontSize:11, fontFamily:"DM Mono", color:"var(--accent3)", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", padding:"3px 8px", borderRadius:4}}>Draft</div>
                      </div>
                      <div className="prd-output">
                        <div className="prd-section">
                          <div className="prd-section-label">Problem Statement</div>
                          <div className="prd-section-content">{prdResult.problemStatement}</div>
                        </div>
                        <div className="prd-section">
                          <div className="prd-section-label">User Stories</div>
                          {prdResult.userStories.map((s,i) => (
                            <div key={i} className="user-story">{s}</div>
                          ))}
                        </div>
                        <div className="prd-section">
                          <div className="prd-section-label">Acceptance Criteria</div>
                          {prdResult.acceptanceCriteria.map((c,i) => (
                            <div key={i} className="acceptance-item">
                              <span className="acceptance-check">✓</span>
                              <span style={{fontSize:12}}>{c}</span>
                            </div>
                          ))}
                        </div>
                        <div className="prd-section">
                          <div className="prd-section-label">Success Metrics</div>
                          {prdResult.successMetrics.map((m,i) => (
                            <div key={i} style={{fontSize:12, padding:"4px 0", borderBottom: i<prdResult.successMetrics.length-1?"1px solid rgba(30,45,66,0.3)":"none", display:"flex", alignItems:"center", gap:8}}>
                              <div style={{width:4, height:4, borderRadius:"50%", background:"var(--accent)", flexShrink:0}}/>
                              {m}
                            </div>
                          ))}
                        </div>
                        <div className="prd-section">
                          <div className="prd-section-label">Open Questions</div>
                          {prdResult.openQuestions.map((q,i) => (
                            <div key={i} style={{fontSize:12, padding:"4px 0", color:"var(--accent4)", display:"flex", gap:8, alignItems:"flex-start"}}>
                              <span style={{flexShrink:0}}>?</span>{q}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{padding:"12px 20px", borderTop:"1px solid var(--border)"}}>
                        <div style={{fontSize:11, fontFamily:"DM Mono", color:"var(--muted)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em"}}>Export</div>
                        <div className="export-bar">
                          {["Confluence", "Notion", "Google Docs", "Markdown", "Copy"].map((fmt,i) => (
                            <button key={i} className="export-btn">{fmt}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* TAB: Privacy Controls */}
          {activeTab === "privacy" && (
            <>
              <div className="section-header">
                <div className="section-title">Privacy Controls & Data Residency</div>
                <div className="section-sub">Transparency into what the system remembers, where your data goes, and full control to delete it</div>
              </div>
              {/* Data residency banner */}
              <div style={{padding:"12px 16px", background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:10, display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8}}>
                <div style={{display:"flex", alignItems:"center", gap:10}}>
                  <div style={{width:10, height:10, borderRadius:"50%", background:"var(--accent3)", boxShadow:"0 0 6px var(--accent3)"}}/>
                  <span style={{fontFamily:"Syne", fontWeight:700, fontSize:13}}>No data has left this machine</span>
                  <span style={{fontSize:12, color:"var(--muted)"}}>All processing is local · Only approved outbound: Claude API</span>
                </div>
                <div style={{display:"flex", gap:8}}>
                  {["Local Postgres", "Docker Network", "MacBook Pro"].map((l,i) => (
                    <span key={i} className="residency-badge" style={{background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", color:"var(--accent3)"}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:"var(--accent3)"}}/>
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              <div className="privacy-grid">
                {/* Memory log */}
                <div className="card">
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14}}>
                    <div className="card-title" style={{margin:0}}>🧠 Agent Memory Log</div>
                    <button
                      onClick={() => setMemoryLog([])}
                      style={{fontSize:10, fontFamily:"DM Mono", padding:"3px 8px", border:"1px solid rgba(239,68,68,0.3)", borderRadius:4, color:"var(--accent5)", background:"transparent", cursor:"pointer"}}
                    >Forget All</button>
                  </div>
                  {memoryLog.length === 0 ? (
                    <div style={{textAlign:"center", padding:"24px 0", fontSize:13, color:"var(--muted)"}}>Memory cleared</div>
                  ) : (
                    memoryLog.map((m) => (
                      <div key={m.id} className="memory-row">
                        <div className="memory-dot" style={{
                          background: m.type==="project"?"var(--accent)":m.type==="agent"?"var(--accent2)":m.type==="meeting"?"var(--accent4)":"var(--accent3)"
                        }}/>
                        <div style={{flex:1}}>
                          <div className="memory-text">{m.text}</div>
                          <div className="memory-meta">{m.source} · {m.age}</div>
                        </div>
                        <button className="forget-btn" onClick={() => forgetMemory(m.id)}>Forget</button>
                      </div>
                    ))
                  )}
                </div>

                {/* Controls column */}
                <div style={{display:"flex", flexDirection:"column", gap:12}}>
                  <div className="card">
                    <div className="card-title">⚙️ Memory Settings</div>
                    {([
                      { key:"persistentMemory" as const, label:"Persistent memory", sub:"Agent remembers across sessions" },
                      { key:"agentLearning" as const, label:"Agent learning", sub:"Agents improve from your usage patterns" },
                      { key:"sessionOnly" as const, label:"Session-only mode", sub:"Wipe all memory when you close the app" },
                      { key:"auditLog" as const, label:"Audit log", sub:"Record every agent action for compliance" },
                    ]).map(({key, label, sub}) => (
                      <div key={key} className="toggle-row">
                        <div>
                          <div className="toggle-label">{label}</div>
                          <div className="toggle-sub">{sub}</div>
                        </div>
                        <div className={`toggle-switch${privacyToggles[key]?" on":""}`} onClick={() => togglePrivacy(key)}/>
                      </div>
                    ))}
                  </div>

                  <div className="card">
                    <div className="card-title">🔍 Data Flow Audit</div>
                    {[
                      {source:"Jira tickets", dest:"Local Postgres only", safe:true},
                      {source:"Calendar events", dest:"Local Postgres only", safe:true},
                      {source:"Meeting transcripts", dest:"Claude API (anonymised)", safe:true},
                      {source:"Backlog items", dest:"Claude API (no PII)", safe:true},
                      {source:"Stakeholder emails", dest:"Local only — never sent to AI", safe:true},
                      {source:"OKR data", dest:"Local Postgres only", safe:true},
                    ].map((row, i) => (
                      <div key={i} className="data-flow-row">
                        <div className="flow-source">{row.source}</div>
                        <div style={{fontSize:11, color:"var(--muted)"}}>→</div>
                        <div className={`flow-dest`} style={{color: row.safe?"var(--accent3)":"var(--accent5)"}}>{row.dest}</div>
                        <div className="flow-status" style={{background: row.safe?"var(--accent3)":"var(--accent5)"}}/>
                      </div>
                    ))}
                  </div>

                  <div className="card">
                    <div className="card-title">📋 Right to Delete</div>
                    <div style={{fontSize:12, color:"var(--muted)", lineHeight:1.7, marginBottom:12}}>
                      All your data is stored in a local Postgres database. You have full control to export or permanently delete it at any time.
                    </div>
                    <div style={{display:"flex", flexDirection:"column", gap:6}}>
                      {["Export all my data (JSON)", "Delete meeting transcripts", "Wipe agent run history", "Full data reset"].map((action, i) => (
                        <button key={i} style={{
                          padding:"8px 12px", borderRadius:7, border:"1px solid var(--border)",
                          background:"var(--surface2)", color: i===3?"var(--accent5)":"var(--text)",
                          fontSize:12, textAlign:"left", cursor:"pointer",
                          borderColor: i===3?"rgba(239,68,68,0.3)":"var(--border)"
                        }}>{action}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB: Pilot Metrics */}
          {activeTab === "metrics" && (
            <>
              <div className="section-header">
                <div className="section-title">Pilot Metrics & Adoption</div>
                <div className="section-sub">Tracking what gets used, how much time is saved, and where adoption drops — the product health layer</div>
              </div>
              {/* KPI row */}
              <div className="metrics-grid">
                {[
                  {val:"23", label:"DAU", delta:"+4 vs last week", up:true},
                  {val:"61%", label:"WAU retention", delta:"+8pp vs week 1", up:true},
                  {val:"3.2h", label:"Avg time saved / user / week", delta:"+0.4h vs last week", up:true},
                  {val:"47min", label:"Meeting Scribe saved this week", delta:"top agent", up:true},
                ].map(({val,label,delta,up},i) => (
                  <div key={i} className="metric-card">
                    <div className="metric-val" style={{color:"var(--accent)"}}>{val}</div>
                    <div className="metric-label">{label}</div>
                    <div className={`metric-delta ${up?"delta-up":"delta-down"}`}>{up?"▲":"▼"} {delta}</div>
                  </div>
                ))}
              </div>

              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16}}>
                {/* Adoption funnel */}
                <div className="card">
                  <div className="card-title">⬡ Adoption Funnel · Week 3</div>
                  {[
                    {label:"Invited", n:40, pct:100, color:"var(--accent)"},
                    {label:"Activated", n:31, pct:78, color:"var(--accent)"},
                    {label:"Used an agent", n:23, pct:74, color:"var(--accent3)"},
                    {label:"Used 3+ agents", n:14, pct:61, color:"var(--accent3)"},
                    {label:"Retained (D7)", n:9, pct:64, color:"var(--accent4)"},
                  ].map(({label,n,pct,color},i,arr) => (
                    <div key={i} className="funnel-row">
                      <div className="funnel-label">{label}</div>
                      <div className="funnel-bar-wrap">
                        <div style={{flex:1, height:8, background:"var(--border)", borderRadius:4, overflow:"hidden"}}>
                          <div style={{height:"100%", width:`${pct}%`, background:color, borderRadius:4}}/>
                        </div>
                      </div>
                      <div className="funnel-num">{n} users</div>
                      <div className="funnel-pct">{i===0?"":pct+"%"}</div>
                    </div>
                  ))}
                </div>

                {/* Agent usage */}
                <div className="card">
                  <div className="card-title">🤖 Agent Usage Ranking</div>
                  {[
                    {name:"Meeting Scribe", runs:47, color:"var(--accent)"},
                    {name:"Weekly Digest", runs:23, color:"var(--accent3)"},
                    {name:"Stakeholder Update", runs:19, color:"var(--accent2)"},
                    {name:"Prioritization", runs:14, color:"var(--accent4)"},
                    {name:"PRD Agent", runs:8, color:"var(--accent)"},
                    {name:"Risk Monitor", runs:6, color:"var(--accent5)"},
                  ].map(({name,runs,color},i) => (
                    <div key={i} className="agent-usage-row">
                      <div className="agent-usage-name">{name}</div>
                      <div className="agent-usage-bar-wrap">
                        <div className="agent-usage-bar">
                          <div className="agent-usage-fill" style={{width:`${(runs/47)*100}%`, background:color}}/>
                        </div>
                        <div className="agent-usage-num">{runs}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
                {/* Time saved breakdown */}
                <div className="card">
                  <div className="card-title">⏱ Time Saved by Workflow · This Week</div>
                  {[
                    {label:"Meeting notes → tasks", val:"47 min"},
                    {label:"Weekly stakeholder email", val:"38 min"},
                    {label:"Backlog prioritization", val:"55 min"},
                    {label:"Focus group → PRD", val:"2.1 hrs"},
                    {label:"Competitive intel digest", val:"30 min"},
                    {label:"Risk flag review", val:"22 min"},
                  ].map(({label,val},i) => (
                    <div key={i} className="time-saved-row">
                      <span className="time-saved-label">{label}</span>
                      <span className="time-saved-val">{val}</span>
                    </div>
                  ))}
                  <div style={{marginTop:12, padding:"10px 12px", background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.15)", borderRadius:8, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <span style={{fontFamily:"Syne", fontWeight:700, fontSize:13}}>Total this week</span>
                    <span style={{fontFamily:"Syne", fontWeight:800, fontSize:18, color:"var(--accent3)"}}>5.5 hrs</span>
                  </div>
                </div>

                {/* Threshold alerts */}
                <div>
                  <div className="card-title" style={{marginBottom:12}}>🔔 Adoption Alerts</div>
                  <div className="alert-card alert-warn">
                    <span style={{fontSize:18}}>⚠️</span>
                    <div>
                      <div style={{fontFamily:"Syne", fontWeight:700, fontSize:13, color:"var(--accent4)", marginBottom:4}}>Prioritization Agent usage dropped 30%</div>
                      <div style={{fontSize:12, color:"var(--muted)", lineHeight:1.6}}>Usage fell from 20 runs/week to 14. Possible causes: sprint planning moved, feature unclear, or competing manual process. <span style={{color:"var(--accent)"}}>Investigate with top users.</span></div>
                    </div>
                  </div>
                  <div className="alert-card alert-good">
                    <span style={{fontSize:18}}>✅</span>
                    <div>
                      <div style={{fontFamily:"Syne", fontWeight:700, fontSize:13, color:"var(--accent3)", marginBottom:4}}>PRD Agent retention high</div>
                      <div style={{fontSize:12, color:"var(--muted)", lineHeight:1.6}}>All 8 users who tried PRD Agent used it again within 48 hours. Strong signal — consider promoting it as a default workflow.</div>
                    </div>
                  </div>
                  <div className="alert-card alert-warn">
                    <span style={{fontSize:18}}>👥</span>
                    <div>
                      <div style={{fontFamily:"Syne", fontWeight:700, fontSize:13, color:"var(--accent4)", marginBottom:4}}>D7 retention below target</div>
                      <div style={{fontSize:12, color:"var(--muted)", lineHeight:1.6}}>64% vs 75% target. Users who attend onboarding session retain at 89%. <span style={{color:"var(--accent)"}}>Schedule 2 more onboarding sessions this week.</span></div>
                    </div>
                  </div>
                  <div style={{marginTop:12, padding:"12px 14px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10}}>
                    <div style={{fontFamily:"DM Mono", fontSize:10, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6}}>NPS · Week 3 Survey</div>
                    <div style={{display:"flex", alignItems:"baseline", gap:8}}>
                      <span style={{fontFamily:"Syne", fontWeight:800, fontSize:32, color:"var(--accent)"}}>+52</span>
                      <span style={{fontSize:12, color:"var(--muted)"}}>from 11 responses · Target ≥ 45 ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}

