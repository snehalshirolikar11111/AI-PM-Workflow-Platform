import { useState } from "react";

type PrdTheme = { lbl: string; n: number };
type PrdResult = {
  themes: PrdTheme[];
  problem: string;
  stories: string[];
  criteria: string[];
  metrics: string[];
  questions: string[];
};
type PrivKey = "persist" | "learn" | "session" | "audit";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #07090f;
    --surf:    #0c1018;
    --surf2:   #101520;
    --bdr:     #192030;
    --bdr2:    #1e2a3d;
    --acc:     #00d4ff;
    --pur:     #7c3aed;
    --grn:     #10b981;
    --amb:     #f59e0b;
    --red:     #ef4444;
    --txt:     #dde4ef;
    --mut:     #4e5f74;
    --r:       10px;
    --r-sm:    7px;
    --gap:     14px;
  }

  html, body { height: 100%; }
  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--txt); font-size: 14px; line-height: 1.5; }

  /* ─ App Shell ───────────────────────────────────────────────────────── */
  .app  { display: flex; min-height: 100vh; }

  /* ─ Sidebar ─────────────────────────────────────────────────────────── */
  .sb {
    width: 208px; flex-shrink: 0;
    background: var(--surf); border-right: 1px solid var(--bdr);
    position: fixed; inset: 0 auto 0 0;
    display: flex; flex-direction: column;
    overflow-y: auto; z-index: 20;
  }
  .sb-brand {
    padding: 18px 16px 14px;
    border-bottom: 1px solid var(--bdr);
  }
  .sb-logo {
    display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
  }
  .sb-logo-mark {
    width: 28px; height: 28px; border-radius: 7px;
    background: linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15));
    border: 1px solid rgba(0,212,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
  }
  .sb-logo-name { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; letter-spacing: 0.02em; }
  .sb-context { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--acc); letter-spacing: 0.12em; text-transform: uppercase; }

  .sb-nav { flex: 1; padding: 8px 0; }
  .sb-grp-lbl {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--mut); padding: 12px 14px 4px;
  }
  .sb-item {
    display: flex; align-items: center; gap: 9px;
    padding: 7px 14px; cursor: pointer;
    font-size: 13px; color: var(--mut);
    transition: all 0.13s;
    border-left: 2px solid transparent;
    user-select: none; white-space: nowrap;
  }
  .sb-item:hover { color: var(--txt); background: rgba(255,255,255,0.025); }
  .sb-item.on { color: var(--acc); border-left-color: var(--acc); background: rgba(0,212,255,0.055); font-weight: 500; }
  .sb-item-ic { font-size: 12px; width: 15px; text-align: center; flex-shrink: 0; opacity: 0.8; }

  .sb-foot {
    padding: 12px 14px; border-top: 1px solid var(--bdr);
    display: flex; flex-direction: column; gap: 5px;
  }
  .sb-stat {
    display: flex; align-items: center; gap: 7px;
    font-family: 'DM Mono', monospace; font-size: 10px; color: var(--mut);
  }
  .sdot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

  /* ─ Main ─────────────────────────────────────────────────────────────── */
  .main { margin-left: 208px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  .ph {
    padding: 20px 28px 16px;
    border-bottom: 1px solid var(--bdr);
    background: var(--surf);
    position: sticky; top: 0; z-index: 10;
    display: flex; align-items: flex-end; justify-content: space-between; gap: 16px;
  }
  .ph-left {}
  .ph-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; line-height: 1.1; margin-bottom: 3px; }
  .ph-sub { font-size: 12px; color: var(--mut); }

  .pb { padding: 22px 28px; }

  /* ─ Cards ─────────────────────────────────────────────────────────────  */
  .card { background: var(--surf); border: 1px solid var(--bdr); border-radius: var(--r); }
  .ch { padding: 13px 16px; border-bottom: 1px solid var(--bdr); display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .ct { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; color: var(--mut); }
  .cb { padding: 14px 16px; }
  .cb0 { padding: 0; }

  /* ─ Grid helpers ──────────────────────────────────────────────────────  */
  .g2  { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gap); }
  .g3  { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--gap); }
  .g4  { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: var(--gap); }
  .ga  { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: var(--gap); }
  .col { display: flex; flex-direction: column; gap: var(--gap); }
  .row { display: flex; align-items: center; gap: var(--gap); }
  .sep { border: none; border-top: 1px solid var(--bdr); margin: 4px 0; }

  /* ─ Badges ────────────────────────────────────────────────────────────  */
  .tag {
    display: inline-flex; align-items: center; gap: 4px;
    font-family: 'DM Mono', monospace; font-size: 10px;
    padding: 2px 8px; border-radius: 100px; white-space: nowrap; border: 1px solid;
  }
  .tag-grn { background: rgba(16,185,129,0.1);  color: var(--grn); border-color: rgba(16,185,129,0.25); }
  .tag-amb { background: rgba(245,158,11,0.1);  color: var(--amb); border-color: rgba(245,158,11,0.25); }
  .tag-red { background: rgba(239,68,68,0.1);   color: var(--red); border-color: rgba(239,68,68,0.25); }
  .tag-blu { background: rgba(0,212,255,0.09);  color: var(--acc); border-color: rgba(0,212,255,0.2); }
  .tag-pur { background: rgba(124,58,237,0.1);  color: var(--pur); border-color: rgba(124,58,237,0.25); }
  .tag-dim { background: rgba(78,95,116,0.12);  color: var(--mut); border-color: rgba(78,95,116,0.2); }

  /* ─ Progress ──────────────────────────────────────────────────────────  */
  .bar-wrap { display: flex; align-items: center; gap: 8px; }
  .bar-track { flex: 1; height: 3px; background: var(--bdr2); border-radius: 2px; overflow: hidden; }
  .bar-fill  { height: 100%; border-radius: 2px; transition: width 0.4s; }
  .bar-pct   { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--mut); width: 28px; text-align: right; }

  /* ─ Table rows ────────────────────────────────────────────────────────  */
  .tr {
    display: grid; align-items: center; gap: 12px;
    padding: 10px 16px; border-bottom: 1px solid var(--bdr);
    font-size: 13px;
  }
  .tr:last-child { border-bottom: none; }
  .tr:hover { background: rgba(255,255,255,0.015); }
  .th-row {
    display: grid; align-items: center; gap: 12px;
    padding: 7px 16px; border-bottom: 1px solid var(--bdr);
    font-family: 'DM Mono', monospace; font-size: 9px;
    text-transform: uppercase; letter-spacing: 0.1em; color: var(--mut);
  }

  /* ─ Toggle ────────────────────────────────────────────────────────────  */
  .tog { width: 36px; height: 20px; border-radius: 10px; cursor: pointer; position: relative; transition: background 0.2s; flex-shrink: 0; }
  .tog.off { background: var(--bdr2); }
  .tog.on  { background: var(--grn); }
  .tog::after { content: ''; position: absolute; width: 14px; height: 14px; border-radius: 50%; background: #fff; top: 3px; transition: left 0.2s; }
  .tog.off::after { left: 3px; }
  .tog.on::after  { left: 19px; }

  /* ─ Spinner ───────────────────────────────────────────────────────────  */
  .spin { width: 18px; height: 18px; border: 2px solid var(--bdr2); border-top-color: var(--acc); border-radius: 50%; animation: rot 0.8s linear infinite; flex-shrink: 0; }
  @keyframes rot { to { transform: rotate(360deg); } }

  /* ─ Workflow cards ────────────────────────────────────────────────────  */
  .wfc { background: var(--surf); border: 1px solid var(--bdr); border-radius: var(--r); padding: 16px; position: relative; overflow: hidden; transition: border-color 0.15s; }
  .wfc:hover { border-color: rgba(0,212,255,0.3); }
  .wfc::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; border-radius: var(--r) var(--r) 0 0; }
  .wf-full::before    { background: linear-gradient(90deg, var(--grn), var(--acc)); }
  .wf-partial::before { background: linear-gradient(90deg, var(--amb), var(--pur)); }
  .wf-none::before    { background: var(--bdr2); }
  .wf-title  { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; margin-bottom: 2px; }
  .wf-cat    { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--mut); text-transform: uppercase; letter-spacing: 0.1em; }
  .wf-desc   { font-size: 12px; color: var(--mut); line-height: 1.6; margin: 9px 0 10px; }
  .wf-step   { display: flex; align-items: center; gap: 7px; font-size: 11px; padding: 5px 8px; background: var(--surf2); border-radius: 5px; margin-top: 3px; }
  .wf-ai     { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--acc); margin-left: auto; opacity: 0.7; }

  /* ─ Agent cards ───────────────────────────────────────────────────────  */
  .agc { background: var(--surf); border: 1px solid var(--bdr); border-radius: var(--r); padding: 16px; transition: all 0.15s; }
  .agc:hover { border-color: var(--pur); transform: translateY(-1px); }
  .ag-icon { width: 38px; height: 38px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 10px; }
  .ic-blu { background: rgba(0,212,255,0.1);   border: 1px solid rgba(0,212,255,0.2); }
  .ic-pur { background: rgba(124,58,237,0.1);  border: 1px solid rgba(124,58,237,0.2); }
  .ic-grn { background: rgba(16,185,129,0.1);  border: 1px solid rgba(16,185,129,0.2); }
  .ic-amb { background: rgba(245,158,11,0.1);  border: 1px solid rgba(245,158,11,0.2); }
  .ag-name { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; margin-bottom: 4px; }
  .ag-trig { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--acc); background: rgba(0,212,255,0.07); border: 1px solid rgba(0,212,255,0.15); padding: 2px 7px; border-radius: 4px; display: inline-block; margin-bottom: 8px; }
  .ag-desc { font-size: 12px; color: var(--mut); line-height: 1.6; margin-bottom: 10px; }
  .chips { display: flex; flex-wrap: wrap; gap: 4px; }
  .chip  { font-size: 10px; padding: 2px 7px; border-radius: 100px; background: var(--surf2); border: 1px solid var(--bdr2); color: var(--mut); }

  /* ─ Schedule timeline ─────────────────────────────────────────────────  */
  .tl-wrap { position: relative; }
  .tl-slot { display: grid; grid-template-columns: 46px 1fr; gap: 0; min-height: 62px; }
  .tl-slot::before { content: ''; position: absolute; left: 46px; width: 1px; background: var(--bdr); top: 0; bottom: 0; }
  .tl-time { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--mut); padding-top: 5px; text-align: right; padding-right: 8px; }
  .tl-ev   { border-radius: var(--r-sm); padding: 6px 10px; margin: 2px 0 4px 10px; border-left: 3px solid; transition: opacity 0.15s; }
  .tl-ev:hover { opacity: 0.8; }
  .ev-meet   { background: rgba(124,58,237,0.09); border-color: var(--pur); }
  .ev-deep   { background: rgba(0,212,255,0.07);  border-color: var(--acc); }
  .ev-admin  { background: rgba(78,95,116,0.08);  border-color: var(--mut); }
  .ev-buf    { background: rgba(16,185,129,0.06); border-color: var(--grn); }
  .ev-break  { background: rgba(245,158,11,0.06); border-color: var(--amb); }
  .ev-title  { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; margin-bottom: 1px; }
  .ev-meta   { font-size: 10px; color: var(--mut); display: flex; gap: 8px; align-items: center; }
  .ev-ai-tag { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--acc); }

  /* ─ OKR blocks ────────────────────────────────────────────────────────  */
  .okr-blk { background: var(--surf); border: 1px solid var(--bdr); border-radius: var(--r); overflow: hidden; }
  .okr-hd  { padding: 14px 16px; display: flex; align-items: center; gap: 11px; cursor: pointer; border-bottom: 1px solid var(--bdr); transition: background 0.13s; }
  .okr-hd:hover { background: rgba(255,255,255,0.02); }
  .okr-ico { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
  .okr-obj { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; margin-bottom: 2px; }
  .okr-own { font-size: 11px; color: var(--mut); }
  .okr-pct { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; line-height: 1; }
  .okr-plbl{ font-family: 'DM Mono', monospace; font-size: 9px; color: var(--mut); margin-top: 2px; }
  .okr-bar { height: 3px; background: var(--bdr2); border-radius: 2px; overflow: hidden; margin: 0 16px 2px; }
  .okr-bf  { height: 100%; border-radius: 2px; }
  .kr-row  { display: grid; grid-template-columns: 1fr 160px 80px; gap: 12px; align-items: center; padding: 11px 16px; border-bottom: 1px solid var(--bdr); }
  .kr-row:last-child { border-bottom: none; }
  .kr-name { font-size: 12px; line-height: 1.4; }
  .kr-bars { display: flex; flex-direction: column; gap: 3px; }
  .kr-bar  { height: 4px; background: var(--bdr2); border-radius: 2px; overflow: hidden; }
  .kr-fill { height: 100%; border-radius: 2px; }
  .kr-nums { display: flex; justify-content: space-between; font-family: 'DM Mono', monospace; font-size: 9px; color: var(--mut); }

  /* ─ PRD Agent ─────────────────────────────────────────────────────────  */
  .upload-z { border: 2px dashed var(--bdr2); border-radius: var(--r); padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s; }
  .upload-z:hover { border-color: var(--acc); background: rgba(0,212,255,0.02); }
  .prd-sec  { padding: 13px 16px; border-bottom: 1px solid var(--bdr); }
  .prd-sec:last-child { border-bottom: none; }
  .prd-lbl  { font-family: 'DM Mono', monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--mut); margin-bottom: 8px; }
  .story    { padding: 8px 10px; background: var(--surf2); border-radius: var(--r-sm); border-left: 3px solid var(--pur); margin-bottom: 5px; font-size: 12px; line-height: 1.6; }
  .xbtn     { font-family: 'DM Mono', monospace; font-size: 10px; padding: 5px 11px; border-radius: var(--r-sm); cursor: pointer; border: 1px solid var(--bdr); background: var(--surf2); color: var(--txt); transition: all 0.13s; }
  .xbtn:hover { border-color: var(--acc); color: var(--acc); }

  /* ─ Privacy ───────────────────────────────────────────────────────────  */
  .mem-row  { display: flex; align-items: flex-start; gap: 9px; padding: 9px 0; border-bottom: 1px solid var(--bdr); }
  .mem-row:last-child { border-bottom: none; }
  .mdot     { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
  .mem-text { flex: 1; font-size: 12px; line-height: 1.5; }
  .mem-src  { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--mut); }
  .del-btn  { font-family: 'DM Mono', monospace; font-size: 9px; padding: 2px 7px; border-radius: 4px; border: 1px solid rgba(239,68,68,0.3); color: var(--red); background: rgba(239,68,68,0.05); cursor: pointer; flex-shrink: 0; transition: all 0.13s; }
  .del-btn:hover { background: rgba(239,68,68,0.12); }
  .tog-row  { display: flex; justify-content: space-between; align-items: center; padding: 11px 0; border-bottom: 1px solid var(--bdr); }
  .tog-row:last-child { border-bottom: none; }
  .tog-lbl  { font-size: 13px; }
  .tog-sub  { font-size: 11px; color: var(--mut); margin-top: 2px; }
  .flow-row { display: flex; align-items: center; gap: 8px; font-size: 12px; padding: 7px 0; border-bottom: 1px solid var(--bdr); }
  .flow-row:last-child { border-bottom: none; }
  .flow-src { flex: 1; }
  .flow-dst { font-family: 'DM Mono', monospace; font-size: 11px; }
  .fdot     { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

  /* ─ Metrics ───────────────────────────────────────────────────────────  */
  .kpi      { background: var(--surf); border: 1px solid var(--bdr); border-radius: var(--r); padding: 15px; }
  .kpi-v    { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
  .kpi-l    { font-size: 11px; color: var(--mut); font-family: 'DM Mono', monospace; }
  .kpi-d    { font-size: 10px; font-family: 'DM Mono', monospace; margin-top: 3px; }
  .d-up     { color: var(--grn); }
  .d-dn     { color: var(--red); }
  .alert-b  { padding: 11px 13px; border-radius: 9px; display: flex; gap: 10px; align-items: flex-start; margin-bottom: 7px; }
  .al-warn  { background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.2); }
  .al-good  { background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.2); }
  .al-ttl   { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 12px; margin-bottom: 3px; }
  .al-body  { font-size: 11px; color: var(--mut); line-height: 1.6; }
  .use-row  { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--bdr); }
  .use-row:last-child { border-bottom: none; }
  .use-name { font-size: 12px; flex: 1; }
  .use-bw   { width: 100px; display: flex; align-items: center; gap: 5px; }
  .use-bar  { flex: 1; height: 3px; background: var(--bdr2); border-radius: 2px; overflow: hidden; }
  .use-fill { height: 100%; border-radius: 2px; }
  .use-n    { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--mut); }
  .tsav-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px solid var(--bdr); }
  .tsav-row:last-child { border-bottom: none; }
  .tsav-l   { font-size: 12px; color: var(--mut); }
  .tsav-v   { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: var(--grn); }
  .sh-row   { display: flex; align-items: center; gap: 9px; padding: 11px 16px; border-bottom: 1px solid var(--bdr); }
  .sh-row:hover { background: rgba(255,255,255,0.015); }
  .sh-row:last-child { border-bottom: none; }
  .sh-av    { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; font-family: 'Syne', sans-serif; }

  /* ─ Todo ──────────────────────────────────────────────────────────────  */
  .todo-item { display: flex; align-items: center; gap: 9px; padding: 9px 11px; border-radius: var(--r-sm); background: var(--surf2); border: 1px solid var(--bdr); transition: border-color 0.13s; cursor: pointer; }
  .todo-item:hover { border-color: var(--bdr2); }
  .todo-chk  { width: 15px; height: 15px; border-radius: 4px; border: 1px solid var(--bdr2); display: flex; align-items: center; justify-content: center; font-size: 9px; transition: all 0.13s; flex-shrink: 0; }
  .todo-chk.dn { background: var(--grn); border-color: var(--grn); color: #000; }
  .todo-txt  { flex: 1; font-size: 13px; }
  .todo-txt.dn { text-decoration: line-through; color: var(--mut); }
  .ai-note   { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--acc); }

  /* ─ Misc ──────────────────────────────────────────────────────────────  */
  .mono { font-family: 'DM Mono', monospace; }
  .dim  { color: var(--mut); }
  .acc  { color: var(--acc); }
  .section-lbl { font-family: 'DM Mono', monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--mut); margin-bottom: 10px; }
  .infobox { padding: 11px 14px; border-radius: var(--r-sm); font-size: 12px; line-height: 1.6; color: var(--mut); }
  .ib-blue { background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.12); }
  .ib-red  { background: rgba(239,68,68,0.05);  border: 1px solid rgba(239,68,68,0.15); }
  .ib-grn  { background: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.15); }

  @media (max-width: 800px) {
    .sb { width: 52px; }
    .sb-item span:not(.sb-item-ic) { display: none; }
    .sb-grp-lbl, .sb-brand-name, .sb-context, .sb-stat span:last-child { display: none; }
    .main { margin-left: 52px; }
    .g2, .g3, .g4 { grid-template-columns: 1fr; }
    .pb { padding: 14px; }
  }
`;

/* ─ Data ───────────────────────────────────────────────────────────────── */

const NAV = [
  { grp: "Today",       items: [{ id:"schedule",    ic:"🕐", lbl:"Daily Schedule" }, { id:"todos",  ic:"☑", lbl:"To-Do List" }] },
  { grp: "Execution",   items: [{ id:"tracker",     ic:"◎", lbl:"Projects" },       { id:"meetings",ic:"✦", lbl:"Meetings" }] },
  { grp: "Strategy",    items: [{ id:"priority",    ic:"◈", lbl:"Prioritization" }, { id:"okr",    ic:"◎", lbl:"OKR Tracker" }] },
  { grp: "Intelligence",items: [{ id:"overview",    ic:"⬡", lbl:"Workflows" },      { id:"agents", ic:"⬡", lbl:"AI Agents" },   { id:"prd", ic:"📄", lbl:"PRD Agent" }] },
  { grp: "People",      items: [{ id:"stakeholders",ic:"◉", lbl:"Stakeholders" }] },
  { grp: "Operations",  items: [{ id:"metrics",     ic:"◎", lbl:"Pilot Metrics" },  { id:"privacy",ic:"◈", lbl:"Privacy" }] },
];

const PAGE_INFO = {
  overview:     { title:"All Workflows",      sub:"Every core PM task mapped by AI automation potential" },
  schedule:     { title:"Daily Schedule",     sub:"AI-optimised time blocks — deep work protected, meetings batched" },
  todos:        { title:"Today's Focus List", sub:"Agent-curated priorities synthesised from all your tools" },
  tracker:      { title:"Project Tracker",    sub:"Live project health — AI monitors status and flags risk automatically" },
  meetings:     { title:"Meeting Intelligence",sub:"Agent transcribes, extracts decisions, creates tasks — zero manual notes" },
  priority:     { title:"Prioritization",     sub:"RICE scoring aligned to vision, OKRs and quarterly strategy" },
  okr:          { title:"OKR Tracker",        sub:"Q2 · April–June 2025 · Week 3 of 13 · AI monitors KR drift weekly" },
  agents:       { title:"AI Agent Stack",     sub:"6 agents handling the repetitive, cognitive-load-heavy work" },
  prd:          { title:"PRD Agent",          sub:"Paste focus group data — agent clusters themes and writes a structured PRD in seconds" },
  stakeholders: { title:"Stakeholders",       sub:"Everyone who matters — filterable by project, with influence and last contact" },
  metrics:      { title:"Pilot Metrics",      sub:"Adoption funnel, time saved, agent usage and threshold alerts" },
  privacy:      { title:"Privacy & Data Controls", sub:"What the system remembers, where data goes, and your right to delete" },
};

const WORKFLOWS = [
  { title:"Feature Prioritization", cat:"Strategy", ai:"full", desc:"Rank features using RICE/ICE, align with vision and quarterly OKRs, auto-score backlog items.", tasks:[{ic:"🤖",lbl:"Auto-score features via RICE",ai:true},{ic:"🤖",lbl:"Map to vision + quarterly goals",ai:true},{ic:"✏️",lbl:"Final call on strategic tradeoffs",ai:false}] },
  { title:"Meeting Intelligence", cat:"Communication", ai:"full", desc:"Transcribe, summarize, extract decisions and action items from all meetings automatically.", tasks:[{ic:"🤖",lbl:"Transcribe & summarize notes",ai:true},{ic:"🤖",lbl:"Extract action items + owners",ai:true},{ic:"🤖",lbl:"Update project tracker",ai:true}] },
  { title:"Stakeholder Updates", cat:"Communication", ai:"partial", desc:"Auto-draft weekly status emails and executive summaries from live project data.", tasks:[{ic:"🤖",lbl:"Pull data & draft status update",ai:true},{ic:"✏️",lbl:"Review, tailor tone & send",ai:false}] },
  { title:"Data Synthesis & Insights", cat:"Analytics", ai:"full", desc:"Aggregate metrics from multiple tools, surface anomalies, generate weekly insights report.", tasks:[{ic:"🤖",lbl:"Pull data from Jira, Amplitude",ai:true},{ic:"🤖",lbl:"Detect trends & anomalies",ai:true},{ic:"🤖",lbl:"Generate insights summary",ai:true}] },
  { title:"Project Status Tracking", cat:"Execution", ai:"full", desc:"Monitor sprint progress, flag blockers, predict delivery risk in real-time.", tasks:[{ic:"🤖",lbl:"Monitor Jira/Linear changes",ai:true},{ic:"🤖",lbl:"Flag at-risk items automatically",ai:true},{ic:"✏️",lbl:"Resolve blockers & replan",ai:false}] },
  { title:"Assignment Tracking", cat:"Execution", ai:"partial", desc:"Track who owns what, surface overdue tasks, send reminders and escalations.", tasks:[{ic:"🤖",lbl:"Monitor assignments across tools",ai:true},{ic:"🤖",lbl:"Send nudge reminders to owners",ai:true},{ic:"✏️",lbl:"Handle escalations",ai:false}] },
  { title:"User Research Synthesis", cat:"Discovery", ai:"partial", desc:"Summarize interviews, cluster themes, surface key pain points from qualitative data.", tasks:[{ic:"🤖",lbl:"Cluster themes from interviews",ai:true},{ic:"✏️",lbl:"Interpret strategic implications",ai:false}] },
  { title:"Roadmap Planning", cat:"Strategy", ai:"partial", desc:"Generate draft roadmap from backlog priorities, goals and capacity data.", tasks:[{ic:"🤖",lbl:"Draft roadmap from scored backlog",ai:true},{ic:"✏️",lbl:"Negotiate scope with engineering",ai:false},{ic:"✏️",lbl:"Align with leadership",ai:false}] },
  { title:"Competitive Intelligence", cat:"Discovery", ai:"full", desc:"Monitor competitors, scrape release notes and news, summarize weekly landscape changes.", tasks:[{ic:"🤖",lbl:"Scrape competitor blogs & notes",ai:true},{ic:"🤖",lbl:"Weekly landscape digest",ai:true}] },
];

const AGENTS = [
  { ic:"🧠", col:"ic-blu", name:"Prioritization Agent", trig:"Every sprint planning session", desc:"Takes your backlog, applies RICE scoring based on business impact, reach, confidence and effort. Cross-references quarterly OKRs to surface the top 10 items.", inputs:["Backlog (Jira/Linear)","OKR doc","Vision doc","Capacity data"] },
  { ic:"🎙️", col:"ic-pur", name:"Meeting Scribe Agent", trig:"After every meeting ends", desc:"Listens to meeting recordings, produces a structured summary with key decisions, action items with owner and due date, and auto-pushes tasks to your project tracker.", inputs:["Meeting recording","Calendar context","Project tracker API"] },
  { ic:"📊", col:"ic-grn", name:"Weekly Digest Agent", trig:"Every Monday 8am", desc:"Aggregates data from Jira, Amplitude, Slack and CRM. Generates an executive-ready briefing: what shipped, what's at risk, key metrics, top 3 decisions needed from you.", inputs:["Jira","Amplitude","Slack","Salesforce"] },
  { ic:"🔔", col:"ic-amb", name:"Risk & Blocker Agent", trig:"Continuous monitoring", desc:"Watches for sprint velocity drops, overdue milestones, unassigned critical tickets, and silent stakeholders. Sends smart Slack alerts with suggested actions.", inputs:["Jira / Linear","Slack","Calendar","Project roadmap"] },
  { ic:"📝", col:"ic-blu", name:"Stakeholder Update Agent", trig:"Every Friday 3pm", desc:"Pulls project status data, compares against last week's targets, writes a polished status email for each stakeholder group tailored to their level of detail.", inputs:["Project tracker","OKR targets","Stakeholder map","Last week's update"] },
  { ic:"🔭", col:"ic-pur", name:"Competitive Intel Agent", trig:"Daily / on-demand", desc:"Monitors competitor websites, product blogs, App Store reviews and tech news. Surfaces relevant changes as a clean weekly digest with implications for your roadmap.", inputs:["Competitor URLs","G2/Capterra","App Store","Tech news feeds"] },
];

const PROJECTS = [
  { name:"Mobile Onboarding V2", pct:78, status:"on-track", owner:"Ana + Raj",       due:"Apr 30" },
  { name:"B2B Dashboard Revamp",  pct:45, status:"at-risk",  owner:"Chen + Dev team", due:"May 15" },
  { name:"Payments Integration",  pct:20, status:"delayed",  owner:"Priya",           due:"May 28" },
  { name:"AI Recommendations",    pct:10, status:"planning", owner:"You + ML team",   due:"Q3" },
  { name:"Search Improvement",    pct:91, status:"on-track", owner:"Marcus",          due:"Apr 22" },
];

const STATUS_COLOR = { "on-track":"tag-grn", "at-risk":"tag-amb", "delayed":"tag-red", "planning":"tag-pur" };
const BAR_COLOR    = { "on-track":"var(--grn)", "at-risk":"var(--amb)", "delayed":"var(--red)", "planning":"var(--pur)" };

const TODOS_INIT = [
  { text:"Review Q2 prioritization doc before standup",   pri:"high", done:false, ai:"AI-drafted" },
  { text:"Approve mobile onboarding spec from Ana",        pri:"high", done:false, ai:null },
  { text:"Synthesize last week's user interviews",         pri:"med",  done:false, ai:"Agent queued" },
  { text:"Send weekly stakeholder update email",           pri:"med",  done:true,  ai:"AI-drafted" },
  { text:"Review competitive intel digest from agent",     pri:"low",  done:false, ai:"Ready" },
  { text:"Prep for exec roadmap review (Thursday)",        pri:"high", done:false, ai:null },
  { text:"Follow up on payments integration blocker",      pri:"med",  done:false, ai:"Agent flagged" },
];

const MEETINGS_DATA = [
  { title:"Sprint Planning — Mobile Team", time:"Mon 10:00am · 60 min", outputs:["Sprint backlog prioritized","Action items extracted","Tracker updated"] },
  { title:"Exec Roadmap Review",           time:"Thu 2:00pm · 45 min",  outputs:["Decision log created","Stakeholder update drafted","3 action items"] },
  { title:"User Research Readout",         time:"Tue 3:00pm · 30 min",  outputs:["Theme clusters identified","Pain point summary","PRD inputs generated"] },
];

const RICE = [
  { name:"Mobile Onboarding V2", r:85, i:8, c:90, e:5,  score:122 },
  { name:"Search Improvement",   r:60, i:7, c:80, e:3,  score:112 },
  { name:"AI Recommendations",   r:90, i:9, c:70, e:8,  score:101 },
  { name:"B2B Dashboard",        r:40, i:8, c:60, e:9,  score:21  },
];

const SCHEDULE = [
  { t:"08:00", type:"deep",  title:"🧠 Deep Work Block",          desc:"Strategy doc / roadmap writing",          dur:"90 min", ai:"AI-blocked" },
  { t:"09:30", type:"admin", title:"📬 Inbox Triage",              desc:"Emails, Slack, agent digests",            dur:"30 min", ai:"Agent-sorted" },
  { t:"10:00", type:"meet",  title:"Sprint Planning — Mobile",     desc:"Ana, Raj, Marcus · Zoom",                 dur:"60 min", ai:"Scribe active" },
  { t:"11:00", type:"buf",   title:"☕ Buffer + Follow-ups",        desc:"Action items from sprint planning",       dur:"30 min", ai:null },
  { t:"11:30", type:"deep",  title:"🔬 User Research Synthesis",   desc:"Review interview notes, cluster themes",  dur:"60 min", ai:"Agent queued" },
  { t:"12:30", type:"break", title:"🍱 Lunch",                     desc:"Protected — no meetings",                 dur:"60 min", ai:null },
  { t:"13:30", type:"meet",  title:"1:1 with Engineering Lead",    desc:"Chen · Payments blocker + capacity",      dur:"30 min", ai:"Scribe active" },
  { t:"14:00", type:"admin", title:"📊 Metrics Review",            desc:"Weekly digest · Amplitude + Jira",        dur:"30 min", ai:"Agent-compiled" },
  { t:"14:30", type:"deep",  title:"📝 PRD Writing",               desc:"AI Recommendations — no interruptions",  dur:"90 min", ai:null },
  { t:"16:00", type:"meet",  title:"Exec Roadmap Review Prep",     desc:"Slides review with design lead",          dur:"30 min", ai:null },
  { t:"16:30", type:"admin", title:"📤 EOD Stakeholder Update",    desc:"AI-drafted email — review and send",      dur:"30 min", ai:"AI-drafted" },
  { t:"17:00", type:"buf",   title:"🌅 Wind Down / Plan Tomorrow", desc:"Review to-dos, set next day priorities",  dur:"30 min", ai:"Agent-suggested" },
];

const EV_CLS = { deep:"ev-deep", meet:"ev-meet", admin:"ev-admin", buf:"ev-buf", break:"ev-break" };

const OKRS = [
  { ic:"🚀", color:"#00d4ff", obj:"Accelerate User Activation & Time-to-Value", owner:"You + Growth team", pct:62,
    krs:[
      { name:"D7 activation rate: 34% → 50%",              cur:41,  tgt:50,  unit:"%",    st:"on-track" },
      { name:"Time-to-first-value: 8 days → 5 days",       cur:6.5, tgt:5,   unit:"days", st:"at-risk",  inv:true },
      { name:"Ship new onboarding to 100% of new users",    cur:0,   tgt:100, unit:"%",    st:"planning" },
    ]},
  { ic:"🤖", color:"#7c3aed", obj:"Launch AI-Powered Personalisation at Scale", owner:"You + ML team", pct:22,
    krs:[
      { name:"Ship AI Recommendations to 10K users in beta",cur:0,   tgt:10000,unit:"users",st:"planning" },
      { name:"≥15% lift in feature adoption",               cur:0,   tgt:15,  unit:"%",    st:"planning" },
      { name:"Complete model training & A/B infrastructure", cur:60,  tgt:100, unit:"%",    st:"on-track" },
    ]},
  { ic:"💼", color:"#10b981", obj:"Win the B2B Segment with Best-in-Class Tooling", owner:"You + Sales Eng", pct:45,
    krs:[
      { name:"B2B Dashboard live to 50 enterprise accounts", cur:12,  tgt:50,  unit:"accounts",st:"at-risk" },
      { name:"Enterprise onboarding: 14 days → 7 days",      cur:11,  tgt:7,   unit:"days",    st:"on-track", inv:true },
      { name:"B2B cohort NPS ≥ 55",                          cur:48,  tgt:55,  unit:"pts",     st:"at-risk" },
    ]},
];

const KR_COLOR = { "on-track":"var(--grn)", "at-risk":"var(--amb)", "planning":"var(--pur)" };
const KR_TAG   = { "on-track":"tag-grn",    "at-risk":"tag-amb",    "planning":"tag-pur" };

const STAKEHOLDERS = [
  { name:"Sarah Mitchell", in:"SM", col:"#7c3aed", role:"Chief Product Officer",   type:"Executive",  proj:["All Projects"],                      inf:5, last:"2d ago",  age:"recent" },
  { name:"James Okafor",  in:"JO", col:"#00d4ff", role:"VP Engineering",           type:"Engineering",proj:["Mobile Onboarding","Payments"],       inf:5, last:"3d ago",  age:"recent" },
  { name:"Ana Reyes",     in:"AR", col:"#10b981", role:"Senior Designer",           type:"Design",     proj:["Mobile Onboarding V2","B2B Dashboard"],inf:3, last:"1d ago",  age:"recent" },
  { name:"Chen Wei",      in:"CW", col:"#f59e0b", role:"Engineering Lead",          type:"Engineering",proj:["B2B Dashboard","Payments"],           inf:4, last:"Today",   age:"recent" },
  { name:"Priya Nair",    in:"PN", col:"#ef4444", role:"Backend Engineer",          type:"Engineering",proj:["Payments Integration"],              inf:2, last:"4d ago",  age:"recent" },
  { name:"Marcus Liu",    in:"ML", col:"#00d4ff", role:"Frontend Engineer",         type:"Engineering",proj:["Search Improvement"],                inf:2, last:"2d ago",  age:"recent" },
  { name:"David Park",    in:"DP", col:"#7c3aed", role:"Head of Sales",             type:"GTM",        proj:["B2B Dashboard Revamp"],              inf:4, last:"8d ago",  age:"old" },
  { name:"Fiona Clarke",  in:"FC", col:"#10b981", role:"Enterprise Account Lead",   type:"GTM",        proj:["B2B Dashboard Revamp"],              inf:3, last:"12d ago", age:"old" },
  { name:"Tom Nguyen",    in:"TN", col:"#f59e0b", role:"ML Engineer",               type:"ML",         proj:["AI Recommendations"],                inf:3, last:"5d ago",  age:"recent" },
  { name:"Alicia Warren", in:"AW", col:"#ef4444", role:"Customer Success Lead",     type:"CS",         proj:["Mobile Onboarding V2"],              inf:3, last:"15d ago", age:"stale" },
  { name:"Raj Patel",     in:"RP", col:"#00d4ff", role:"Product Designer",          type:"Design",     proj:["Mobile Onboarding V2"],              inf:2, last:"1d ago",  age:"recent" },
  { name:"Novex Corp",    in:"NC", col:"#7c3aed", role:"Enterprise Client",         type:"External",   proj:["B2B Dashboard Revamp"],              inf:4, last:"18d ago", age:"stale" },
];

const AGE_TAG = { recent:"tag-grn", old:"tag-amb", stale:"tag-red" };

/* ─ Component ──────────────────────────────────────────────────────────── */

const Index = () => {
  const [page, setPage]             = useState("overview");
  const [todos, setTodos]           = useState<typeof TODOS_INIT>(TODOS_INIT);
  const [expandedOkr, setExpandedOkr] = useState<number[]>([0,1,2]);
  const [shFilter, setShFilter]     = useState("All");
  const [prdInput, setPrdInput]     = useState("");
  const [prdStatus, setPrdStatus]   = useState<"idle"|"processing"|"done">("idle");
  const [prdResult, setPrdResult]   = useState<PrdResult | null>(null);
  const [memLog, setMemLog]         = useState([
    { id:1, text:"You own the Mobile Onboarding V2 project",        src:"Jira sync",       type:"project" },
    { id:2, text:"Your weekly digest runs every Monday 8am",         src:"User preference", type:"pref" },
    { id:3, text:"Prioritization last ran on Apr 17 — 12 items",    src:"Agent run",       type:"agent" },
    { id:4, text:"Stakeholder Sarah Mitchell: last contact 2d ago",  src:"Stakeholder sync",type:"contact" },
    { id:5, text:"Sprint Planning transcript processed",             src:"Meeting Scribe",  type:"meeting" },
    { id:6, text:"Q2 OKR progress: 43% overall",                     src:"OKR sync",        type:"okr" },
  ]);
  const [privTogs, setPrivTogs]     = useState<Record<PrivKey, boolean>>({ persist:true, learn:true, session:false, audit:true });

  const toggleTodo = (i: number) => setTodos(t => t.map((x,j) => j===i ? {...x,done:!x.done} : x));
  const toggleOkr  = (i: number) => setExpandedOkr(p => p.includes(i) ? p.filter(x=>x!==i) : [...p,i]);
  const forgetMem  = (id: number) => setMemLog(m => m.filter(x => x.id!==id));
  const togglePriv = (k: PrivKey) => setPrivTogs(p => ({...p,[k]:!p[k]}));

  const runPRD = () => {
    if (!prdInput.trim()) return;
    setPrdStatus("processing");
    setTimeout(() => {
      setPrdStatus("done");
      setPrdResult({
        themes:[
          { lbl:"Slow onboarding",       n:18 },
          { lbl:"Missing search",        n:14 },
          { lbl:"No mobile app",         n:11 },
          { lbl:"Dashboard confusing",   n:9  },
          { lbl:"Integration gaps",      n:7  },
        ],
        problem:"Enterprise users abandon the product within the first 3 days due to a slow, confusing onboarding experience and lack of mobile access. 18 of 32 focus group participants cited onboarding as their top friction point.",
        stories:[
          "As a new enterprise user, I want guided onboarding steps so that I reach my first value moment within 24 hours.",
          "As a PM on mobile, I want to view and triage my task list so that I can stay productive between meetings.",
          "As a team admin, I want to configure dashboard layout so my team sees relevant metrics immediately.",
        ],
        criteria:[
          "New user completes onboarding checklist in ≤ 10 minutes",
          "Mobile app available on iOS and Android with core task management",
          "Dashboard shows personalised widgets on first login",
          "Time-to-first-value ≤ 24h for 80% of new users",
        ],
        metrics:[
          "D7 activation rate: 34% → 55%",
          "Median time-to-first-value: 8 days → 2 days",
          "Mobile MAU: 0 → 40% of DAU within 90 days",
          "Onboarding NPS: unknown → ≥ 45",
        ],
        questions:[
          "Do we build mobile native or PWA first?",
          "Should onboarding be role-based (admin vs end user)?",
          "Who owns the integration SDK — platform or product?",
        ],
      });
    }, 2600);
  };

  const shProjects = ["All", ...Array.from(new Set(STAKEHOLDERS.flatMap(s=>s.proj)))];
  const filteredSh = shFilter === "All" ? STAKEHOLDERS : STAKEHOLDERS.filter(s=>s.proj.includes(shFilter));
  const info = PAGE_INFO[page] || { title:page, sub:"" };

  return (
    <>
      <style>{S}</style>
      <div className="app">

        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <aside className="sb">
          <div className="sb-brand">
            <div className="sb-logo">
              <div className="sb-logo-mark">⬡</div>
              <span className="sb-logo-name">PM Agent OS</span>
            </div>
            <div className="sb-context">Sr. Product Manager</div>
          </div>

          <nav className="sb-nav">
            {NAV.map(g => (
              <div key={g.grp}>
                <div className="sb-grp-lbl">{g.grp}</div>
                {g.items.map(it => (
                  <div
                    key={it.id}
                    className={`sb-item${page===it.id?" on":""}`}
                    onClick={() => setPage(it.id)}
                  >
                    <span className="sb-item-ic">{it.ic}</span>
                    <span>{it.lbl}</span>
                  </div>
                ))}
              </div>
            ))}
          </nav>

          <div className="sb-foot">
            <div className="sb-stat"><div className="sdot" style={{background:"var(--grn)",boxShadow:"0 0 4px var(--grn)"}} /><span>6 agents active</span></div>
            <div className="sb-stat"><div className="sdot" style={{background:"var(--acc)"}} /><span>5 projects</span></div>
            <div className="sb-stat"><div className="sdot" style={{background:"var(--amb)"}} /><span>1 at risk</span></div>
            <div className="sb-stat"><div className="sdot" style={{background:"var(--pur)"}} /><span>Q2 · Wk 3/13</span></div>
          </div>
        </aside>

        {/* ── Main ────────────────────────────────────────────────────── */}
        <main className="main">

          {/* Page header */}
          <div className="ph">
            <div className="ph-left">
              <div className="ph-title">{info.title}</div>
              <div className="ph-sub">{info.sub}</div>
            </div>
          </div>

          <div className="pb">

            {/* ══ WORKFLOWS ══════════════════════════════════════════════ */}
            {page === "overview" && (
              <div className="col">
                <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:4}}>
                  {[["var(--grn)","Fully automatable"],["var(--amb)","AI-assisted"],["var(--bdr2)","Human-led"]].map(([c,l])=>(
                    <div key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--mut)"}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>
                      {l}
                    </div>
                  ))}
                </div>
                <div className="ga">
                  {WORKFLOWS.map((w,i) => (
                    <div key={i} className={`wfc wf-${w.ai}`}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                        <div>
                          <div className="wf-title">{w.title}</div>
                          <div className="wf-cat">{w.cat}</div>
                        </div>
                        <span className={`tag ${w.ai==="full"?"tag-grn":w.ai==="partial"?"tag-amb":"tag-dim"}`}>
                          {w.ai==="full"?"⚡ Full AI":w.ai==="partial"?"◑ AI-Assist":"◯ Manual"}
                        </span>
                      </div>
                      <div className="wf-desc">{w.desc}</div>
                      <div className="col" style={{gap:3}}>
                        {w.tasks.map((t,j) => (
                          <div key={j} className="wf-step">
                            <span style={{fontSize:12}}>{t.ic}</span>
                            <span style={{flex:1,fontSize:11}}>{t.lbl}</span>
                            {t.ai && <span className="wf-ai">agent</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══ SCHEDULE ═══════════════════════════════════════════════ */}
            {page === "schedule" && (
              <div className="g2" style={{gridTemplateColumns:"1fr 260px"}}>
                {/* Timeline */}
                <div className="card">
                  <div className="ch">
                    <div className="ct">Today · Friday</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {[["var(--pur)","Meetings"],["var(--acc)","Deep Work"],["var(--mut)","Admin"],["var(--grn)","Buffer"]].map(([c,l])=>(
                        <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"var(--mut)"}}>
                          <div style={{width:6,height:6,borderRadius:2,background:c}}/>
                          {l}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="cb" style={{padding:"14px 16px 14px 14px"}}>
                    <div className="tl-wrap">
                      {SCHEDULE.map((ev,i) => (
                        <div key={i} className="tl-slot">
                          <div className="tl-time">{ev.t}</div>
                          <div>
                            <div className={`tl-ev ${(EV_CLS as Record<string,string>)[ev.type]}`}>
                              <div className="ev-title">{ev.title}</div>
                              <div className="ev-meta">
                                <span>{ev.desc}</span>
                                <span className="mono dim" style={{fontSize:10}}>{ev.dur}</span>
                                {ev.ai && <span className="ev-ai-tag">🤖 {ev.ai}</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Aside */}
                <div className="col">
                  <div className="card">
                    <div className="ch"><div className="ct">Day at a Glance</div></div>
                    <div className="cb">
                      <div className="g2" style={{gap:8,marginBottom:14}}>
                        {[["5","Meetings"],["3h","Deep Work"],["1.5h","Admin"],["1h","Buffer"]].map(([v,l])=>(
                          <div key={l} style={{background:"var(--surf2)",border:"1px solid var(--bdr)",borderRadius:7,padding:"9px 11px"}}>
                            <div style={{fontFamily:"Syne, sans-serif",fontWeight:800,fontSize:20,color:"var(--acc)",lineHeight:1}}>{v}</div>
                            <div style={{fontSize:10,color:"var(--mut)",marginTop:3}}>{l}</div>
                          </div>
                        ))}
                      </div>
                      <div className="section-lbl">Energy Curve</div>
                      <div style={{display:"flex",alignItems:"flex-end",gap:2,height:32}}>
                        {[70,85,90,80,60,50,75,80,85,70,55,45,50].map((h,i)=>(
                          <div key={i} style={{flex:1,borderRadius:"2px 2px 0 0",height:`${h}%`,background:h>75?"var(--grn)":h>60?"var(--amb)":"var(--red)",opacity:0.65}}/>
                        ))}
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:9,fontFamily:"DM Mono",color:"var(--mut)",marginTop:4}}>
                        <span>8am</span><span>1pm</span><span>5pm</span>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="ch"><div className="ct">AI Time Protections</div></div>
                    <div className="cb">
                      {[["8:00–9:30","Deep Work","AI declines invites automatically"],["12:30–13:30","Lunch","Calendar blocked, auto-decline on"],["14:30–16:00","PRD Writing","Focus mode, Slack DND active"]].map(([t,l,n],i)=>(
                        <div key={i} style={{padding:"9px 0",borderBottom:i<2?"1px solid var(--bdr)":"none"}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                            <span style={{fontFamily:"Syne",fontWeight:700,fontSize:12}}>{l}</span>
                            <span className="mono acc" style={{fontSize:10}}>{t}</span>
                          </div>
                          <div style={{fontSize:11,color:"var(--mut)"}}>{n}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card">
                    <div className="ch"><div className="ct">This Week's Load</div></div>
                    <div className="cb">
                      <div style={{display:"flex",alignItems:"flex-end",gap:6,height:52,marginBottom:6}}>
                        {([["M",8,"var(--grn)"],["T",5,"var(--grn)"],["W",9,"var(--amb)"],["Th",11,"var(--red)"],["F",6,"var(--grn)"]] as [string,number,string][]).map(([d,h,c])=>(
                          <div key={d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                            <div style={{width:"100%",background:c,borderRadius:"3px 3px 0 0",height:`${(h/12)*46}px`,opacity:0.7}}/>
                            <span style={{fontFamily:"DM Mono",fontSize:9,color:"var(--mut)"}}>{d}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{fontSize:11,color:"var(--mut)"}}>Thursday over-allocated. Agent flagged 2 meetings to defer.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ TO-DO ══════════════════════════════════════════════════ */}
            {page === "todos" && (
              <div className="g2" style={{gridTemplateColumns:"1fr 240px"}}>
                <div className="card">
                  <div className="ch"><div className="ct">Focus List · Today</div></div>
                  <div className="cb">
                    <div className="col" style={{gap:6}}>
                      {todos.map((t,i) => (
                        <div key={i} className="todo-item" onClick={() => toggleTodo(i)}>
                          <div className={`todo-chk${t.done?" dn":""}`}>{t.done?"✓":""}</div>
                          <span className={`todo-txt${t.done?" dn":""}`}>{t.text}</span>
                          {t.ai && <span className="ai-note">🤖 {t.ai}</span>}
                          <span className={`tag ${t.pri==="high"?"tag-red":t.pri==="med"?"tag-amb":"tag-grn"}`}>{t.pri}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col">
                  <div className="card">
                    <div className="ch"><div className="ct">AI Suggestion</div></div>
                    <div className="cb">
                      <p style={{fontSize:12,color:"var(--mut)",lineHeight:1.7}}>
                        Based on your calendar and project risks, top priority today is the <strong style={{color:"var(--txt)"}}>Q2 prioritization doc</strong> — exec review is Thursday and Mobile Onboarding is your highest-RICE item.
                      </p>
                    </div>
                  </div>

                  <div className="card">
                    <div className="ch"><div className="ct">Task Sources</div></div>
                    <div className="cb0">
                      {[["Meeting Scribe","2 tasks"],["Risk Agent","1 flag"],["Manual","3 tasks"],["Stakeholder email","1 follow-up"]].map(([s,n],i,a)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 16px",borderBottom:i<a.length-1?"1px solid var(--bdr)":"none",fontSize:12}}>
                          <span style={{color:"var(--mut)"}}>{s}</span>
                          <span className="mono acc" style={{fontSize:11}}>{n}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ PROJECTS ═══════════════════════════════════════════════ */}
            {page === "tracker" && (
              <div className="col">
                <div className="card">
                  <div className="ch"><div className="ct">Active Projects · Q2 2025</div></div>
                  <div className="th-row" style={{gridTemplateColumns:"1fr 1fr 90px 120px 60px"}}>
                    <span>Project</span><span>Progress</span><span>Status</span><span>Owner</span><span>Due</span>
                  </div>
                  {PROJECTS.map((p,i) => (
                    <div key={i} className="tr" style={{gridTemplateColumns:"1fr 1fr 90px 120px 60px"}}>
                      <span style={{fontWeight:500}}>{p.name}</span>
                      <div className="bar-wrap">
                        <div className="bar-track">
                          <div className="bar-fill" style={{width:`${p.pct}%`,background:(BAR_COLOR as Record<string,string>)[p.status]}}/>
                        </div>
                        <span className="bar-pct">{p.pct}%</span>
                      </div>
                      <span className={`tag ${(STATUS_COLOR as Record<string,string>)[p.status]}`}>{p.status.replace("-"," ")}</span>
                      <span className="dim" style={{fontSize:12}}>{p.owner}</span>
                      <span className="mono dim" style={{fontSize:11}}>{p.due}</span>
                    </div>
                  ))}
                </div>

                <div className="infobox ib-red" style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <span style={{fontSize:18}}>🔔</span>
                  <div>
                    <div style={{fontFamily:"Syne",fontWeight:700,fontSize:13,color:"var(--red)",marginBottom:3}}>Risk Agent Alert</div>
                    <div style={{fontSize:12,color:"var(--mut)",lineHeight:1.6}}>
                      <strong style={{color:"var(--txt)"}}>Payments Integration</strong> is 3 days behind sprint target. Priya has 2 unreviewed PRs and 1 blocked dependency. <span className="acc">Suggested: Schedule async sync today.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ MEETINGS ═══════════════════════════════════════════════ */}
            {page === "meetings" && (
              <div className="g2">
                <div className="col">
                  <div className="card">
                    <div className="ch"><div className="ct">This Week's Meetings</div></div>
                    <div className="cb0">
                      {MEETINGS_DATA.map((m,i) => (
                        <div key={i} style={{padding:"14px 16px",borderBottom:i<MEETINGS_DATA.length-1?"1px solid var(--bdr)":"none"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                            <span style={{fontFamily:"Syne",fontWeight:700,fontSize:13}}>{m.title}</span>
                            <span className="mono dim" style={{fontSize:11,whiteSpace:"nowrap",marginLeft:8}}>{m.time}</span>
                          </div>
                          <div className="section-lbl" style={{marginBottom:6}}>Agent outputs</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                            {m.outputs.map((o,j) => <span key={j} className="tag tag-blu">{o}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="ch"><div className="ct">Agent Meeting Flow</div></div>
                  <div className="cb0">
                    {[
                      ["Record",    "Meeting auto-recorded via Zoom/Webex integration"],
                      ["Transcribe","Whisper/Deepgram converts audio to text in real-time"],
                      ["Summarize", "Claude generates structured summary in ~30 seconds"],
                      ["Extract",   "Decisions, action items, open questions pulled out"],
                      ["Assign",    "Each action item gets owner, due date, priority"],
                      ["Sync",      "Jira/Linear updated. Slack summary sent to team"],
                    ].map(([t,d],i,a) => (
                      <div key={i} style={{display:"flex",gap:12,padding:"12px 16px",borderBottom:i<a.length-1?"1px solid var(--bdr)":"none",alignItems:"flex-start"}}>
                        <div style={{width:20,height:20,borderRadius:"50%",background:"rgba(0,212,255,0.1)",border:"1px solid rgba(0,212,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"DM Mono",fontSize:10,color:"var(--acc)",flexShrink:0}}>{i+1}</div>
                        <div>
                          <div style={{fontFamily:"Syne",fontWeight:700,fontSize:12,marginBottom:2}}>{t}</div>
                          <div style={{fontSize:11,color:"var(--mut)"}}>{d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══ PRIORITIZATION ═════════════════════════════════════════ */}
            {page === "priority" && (
              <div className="col">
                <div className="g2">
                  {/* Impact / Effort matrix */}
                  <div className="card">
                    <div className="ch"><div className="ct">Impact vs Effort Matrix</div></div>
                    <div className="cb">
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:9,fontFamily:"DM Mono",color:"var(--mut)",marginBottom:6}}>
                        <span>← Low Effort</span><span>High Effort →</span>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr 1fr",gap:8,height:240}}>
                        {[
                          {c:"rgba(16,185,129,0.08)",bc:"rgba(16,185,129,0.2)",label:"🚀 Quick Wins",sub:"High impact, low effort",items:["Mobile Onboarding","Search Improvement"]},
                          {c:"rgba(0,212,255,0.06)", bc:"rgba(0,212,255,0.15)",label:"🎯 Major Projects",sub:"High impact, high effort",items:["AI Recommendations","Payments Integration"]},
                          {c:"rgba(245,158,11,0.06)",bc:"rgba(245,158,11,0.15)",label:"🔧 Fill-ins",sub:"Low impact, low effort",items:["UI Polish","Minor bug fixes"]},
                          {c:"rgba(78,95,116,0.06)", bc:"rgba(78,95,116,0.15)",label:"🚫 Avoid",sub:"Low impact, high effort",items:["Legacy migration","Niche edge cases"]},
                        ].map((q,i)=>(
                          <div key={i} style={{background:q.c,border:`1px solid ${q.bc}`,borderRadius:8,padding:12,display:"flex",flexDirection:"column",gap:4}}>
                            <div style={{fontFamily:"Syne",fontSize:11,fontWeight:700}}>{q.label}</div>
                            <div style={{fontSize:10,color:"var(--mut)"}}>{q.sub}</div>
                            <div style={{marginTop:"auto"}}>
                              {q.items.map((it,j)=><div key={j} style={{fontSize:10,color:"var(--mut)",display:"flex",gap:4,alignItems:"center"}}><span style={{opacity:0.4}}>—</span>{it}</div>)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RICE scores */}
                  <div className="card">
                    <div className="ch">
                      <div className="ct">RICE Score · AI-Calculated</div>
                    </div>
                    <div className="th-row" style={{gridTemplateColumns:"1fr 32px 32px 32px 32px 80px"}}>
                      <span>Feature</span><span>R</span><span>I</span><span>C</span><span>E</span><span>Score</span>
                    </div>
                    {[...RICE].sort((a,b)=>b.score-a.score).map((it,i)=>(
                      <div key={i} className="tr" style={{gridTemplateColumns:"1fr 32px 32px 32px 32px 80px"}}>
                        <span style={{fontWeight:500,fontSize:12}}>{it.name}</span>
                        {[it.r,it.i,it.c,it.e].map((v,j)=><span key={j} className="mono dim" style={{fontSize:11}}>{v}</span>)}
                        <div className="bar-wrap">
                          <div className="bar-track"><div className="bar-fill" style={{width:`${(it.score/130)*100}%`,background:`hsl(${it.score+80},60%,58%)`}}/></div>
                          <span className="mono acc" style={{fontSize:11,width:22,textAlign:"right"}}>{it.score}</span>
                        </div>
                      </div>
                    ))}
                    <div className="infobox ib-blue" style={{margin:"12px 16px"}}>
                      🤖 <strong className="acc">Agent insight:</strong> <span style={{fontSize:11,color:"var(--mut)"}}>Mobile Onboarding V2 is your highest RICE score and directly aligns with Q2 activation OKR. Ship it first.</span>
                    </div>
                  </div>
                </div>

                {/* OKR alignment */}
                <div className="card">
                  <div className="ch"><div className="ct">Q2 OKR Alignment · Vision → Goals → Features</div></div>
                  <div className="cb">
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1px 1fr 1px 1fr",gap:"0 16px",alignItems:"start"}}>
                      {[
                        {label:"🔭 Vision",col:"var(--acc)",bg:"rgba(0,212,255,0.05)",bdr:"rgba(0,212,255,0.12)",items:["Become the #1 B2B productivity platform","Best-in-class user experience","Data-driven personalization at scale"]},
                        null,
                        {label:"◎ Q2 Goals",col:"var(--pur)",bg:"rgba(124,58,237,0.05)",bdr:"rgba(124,58,237,0.12)",items:["Improve activation rate by 25%","Reduce time-to-value by 40%","Launch AI feature to 10K users"]},
                        null,
                        {label:"🚀 Top Features",col:"var(--grn)",bg:"rgba(16,185,129,0.05)",bdr:"rgba(16,185,129,0.12)",items:["Mobile Onboarding V2 ↑ activation","AI Recommendations ↑ engagement","Search Improvement ↑ time-to-value"]},
                      ].map((col,i)=>
                        col === null
                          ? <div key={i} style={{background:"var(--bdr)",borderRadius:1}}/>
                          : <div key={i}>
                              <div style={{fontFamily:"Syne",fontWeight:700,fontSize:12,color:col.col,marginBottom:8}}>{col.label}</div>
                              <div className="col" style={{gap:5}}>
                                {col.items.map((it,j)=>(
                                  <div key={j} style={{fontSize:11,padding:"7px 9px",background:col.bg,border:`1px solid ${col.bdr}`,borderRadius:7,color:"var(--txt)"}}>{it}</div>
                                ))}
                              </div>
                            </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ OKR TRACKER ════════════════════════════════════════════ */}
            {page === "okr" && (
              <div className="col">
                {/* Quarter summary */}
                <div className="g4">
                  {[{v:"43%",l:"Overall Q2 Progress",c:"var(--acc)"},{v:"3/9",l:"KRs On Track",c:"var(--grn)"},{v:"4/9",l:"KRs At Risk",c:"var(--amb)"},{v:"10",l:"Weeks Remaining",c:"var(--mut)"}].map(({v,l,c})=>(
                    <div key={l} className="kpi">
                      <div className="kpi-v" style={{color:c}}>{v}</div>
                      <div className="kpi-l">{l}</div>
                    </div>
                  ))}
                </div>

                {/* Objectives */}
                <div className="col">
                  {OKRS.map((obj,oi) => (
                    <div key={oi} className="okr-blk">
                      <div className="okr-hd" onClick={() => toggleOkr(oi)}>
                        <div className="okr-ico" style={{background:`${obj.color}18`,border:`1px solid ${obj.color}30`}}>{obj.ic}</div>
                        <div style={{flex:1}}>
                          <div className="okr-obj">{obj.obj}</div>
                          <div className="okr-own">{obj.owner}</div>
                        </div>
                        <div style={{textAlign:"right",marginLeft:12}}>
                          <div className="okr-pct" style={{color:obj.color}}>{obj.pct}%</div>
                          <div className="okr-plbl">progress</div>
                        </div>
                        <span style={{marginLeft:12,fontSize:14,color:"var(--mut)"}}>{expandedOkr.includes(oi)?"▾":"▸"}</span>
                      </div>
                      <div className="okr-bar"><div className="okr-bf" style={{width:`${obj.pct}%`,background:obj.color}}/></div>
                      {expandedOkr.includes(oi) && (
                        <div>
                          {obj.krs.map((kr,ki) => {
                            const pct = kr.inv
                              ? Math.max(0,Math.min(100,Math.round(((kr.tgt*2-kr.cur)/(kr.tgt*2))*100)))
                              : Math.max(0,Math.min(100,Math.round((kr.cur/kr.tgt)*100)));
                            return (
                              <div key={ki} className="kr-row">
                                <div className="kr-name">{kr.name}</div>
                                <div className="kr-bars">
                                  <div className="kr-bar"><div className="kr-fill" style={{width:`${pct}%`,background:(KR_COLOR as Record<string,string>)[kr.st]}}/></div>
                                  <div className="kr-nums">
                                    <span>Current: <strong style={{color:"var(--txt)"}}>{kr.cur}{kr.unit}</strong></span>
                                    <span>Target: {kr.tgt}{kr.unit}</span>
                                  </div>
                                </div>
                                <span className={`tag ${(KR_TAG as Record<string,string>)[kr.st]}`}>{kr.st.replace("-"," ")}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="infobox ib-blue">
                  🤖 <strong className="acc">Weekly AI Insight:</strong> At current velocity, D7 activation will reach ~46% by end of Q2 — 4pp short of target. Shipping the onboarding flow by Apr 30 is critical. B2B Dashboard is the highest delivery risk this quarter.
                </div>
              </div>
            )}

            {/* ══ AI AGENTS ══════════════════════════════════════════════ */}
            {page === "agents" && (
              <div className="col">
                <div className="ga">
                  {AGENTS.map((a,i) => (
                    <div key={i} className="agc">
                      <div className={`ag-icon ${a.col}`}>{a.ic}</div>
                      <div className="ag-name">{a.name}</div>
                      <div className="ag-trig">{a.trig}</div>
                      <div className="ag-desc">{a.desc}</div>
                      <div className="section-lbl">Inputs</div>
                      <div className="chips">{a.inputs.map((inp,j)=><span key={j} className="chip">{inp}</span>)}</div>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <div className="ch"><div className="ct">Recommended Tech Stack</div></div>
                  <div className="cb">
                    <div className="g3" style={{gap:8}}>
                      {[["LLM","Claude API (Sonnet)"],["Orchestration","LangGraph / CrewAI"],["Memory","Supabase / Pinecone"],["Integrations","Zapier / Make.com"],["Comms","Slack Bot API"],["Voice/TTS","ElevenLabs"]].map(([l,v])=>(
                        <div key={l} style={{background:"var(--surf2)",border:"1px solid var(--bdr)",borderRadius:8,padding:"10px 12px"}}>
                          <div className="section-lbl" style={{marginBottom:3}}>{l}</div>
                          <div className="acc" style={{fontWeight:500,fontSize:12}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ PRD AGENT ══════════════════════════════════════════════ */}
            {page === "prd" && (
              <div className="g2">
                {/* Left: input */}
                <div className="col">
                  <div className="card">
                    <div className="ch"><div className="ct">Input — Focus Group Data</div></div>
                    <div className="cb">
                      {prdStatus !== "done" ? (
                        <>
                          <div className="upload-z" style={{marginBottom:12}} onClick={()=>document.getElementById('pf')?.click()}>
                            <div style={{fontSize:28,marginBottom:8}}>📎</div>
                            <div style={{fontFamily:"Syne",fontWeight:700,fontSize:13,marginBottom:3}}>Drop files or click to upload</div>
                            <div style={{fontSize:12,color:"var(--mut)"}}>Supports .txt .csv .docx .pdf</div>
                            <input id="pf" type="file" style={{display:"none"}}/>
                          </div>
                          <div className="section-lbl">Or paste raw text</div>
                          <textarea
                            value={prdInput}
                            onChange={e=>setPrdInput(e.target.value)}
                            placeholder={`Paste focus group transcript, survey responses, or feedback notes here...\n\nExample:\n"Participant 3: Onboarding took 45 minutes and I still didn't understand the core feature..."\n"Survey Q4: 18 of 32 respondents said slow onboarding was their #1 pain point..."`}
                            style={{width:"100%",minHeight:180,background:"var(--surf2)",border:"1px solid var(--bdr)",borderRadius:8,padding:11,color:"var(--txt)",fontSize:12,lineHeight:1.6,resize:"vertical",fontFamily:"DM Sans",outline:"none",marginBottom:10}}
                          />
                          <button
                            onClick={runPRD}
                            disabled={!prdInput.trim() || prdStatus==="processing"}
                            style={{width:"100%",padding:"10px 0",background:prdInput.trim()?"var(--acc)":"var(--bdr)",color:prdInput.trim()?"#000":"var(--mut)",border:"none",borderRadius:8,fontFamily:"Syne",fontWeight:700,fontSize:13,cursor:prdInput.trim()?"pointer":"default",transition:"all 0.2s"}}
                          >{prdStatus==="processing"?"Analysing...":"⚡ Generate PRD"}</button>
                          {prdStatus==="processing" && (
                            <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12,fontSize:12,color:"var(--mut)"}}>
                              <div className="spin"/>
                              Clustering themes, extracting pain points, writing PRD...
                            </div>
                          )}
                        </>
                      ) : (
                        <div>
                          <div style={{fontSize:12,color:"var(--grn)",marginBottom:10,fontFamily:"DM Mono"}}>✓ Processed {prdInput.split(' ').length} words</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
                            {prdResult.themes.map((t,i)=>(
                              <span key={i} className="tag tag-blu">{t.lbl} <span style={{opacity:0.6}}>×{t.n}</span></span>
                            ))}
                          </div>
                          <div className="section-lbl" style={{marginBottom:8}}>Theme Frequency</div>
                          {prdResult.themes.map((t,i)=>(
                            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"5px 0",borderBottom:i<prdResult.themes.length-1?"1px solid var(--bdr)":"none"}}>
                              <span style={{fontSize:12,flex:1}}>{t.lbl}</span>
                              <div style={{width:70,height:3,background:"var(--bdr2)",borderRadius:2,overflow:"hidden"}}>
                                <div style={{height:"100%",width:`${(t.n/18)*100}%`,background:"var(--acc)",borderRadius:2}}/>
                              </div>
                              <span className="mono dim" style={{fontSize:11,width:18,textAlign:"right"}}>{t.n}</span>
                            </div>
                          ))}
                          <button onClick={()=>{setPrdStatus("idle");setPrdInput("");setPrdResult(null);}} style={{marginTop:12,fontSize:11,fontFamily:"DM Mono",padding:"4px 10px",border:"1px solid var(--bdr)",borderRadius:6,background:"transparent",color:"var(--mut)",cursor:"pointer"}}>↺ New input</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: output */}
                <div>
                  {!prdResult && prdStatus!=="processing" && (
                    <div className="card" style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10,opacity:0.4}}>
                      <div style={{fontSize:36}}>📄</div>
                      <div style={{fontFamily:"Syne",fontWeight:700,fontSize:13}}>PRD will appear here</div>
                      <div style={{fontSize:12,color:"var(--mut)",textAlign:"center",maxWidth:220}}>Paste focus group data and click Generate PRD</div>
                    </div>
                  )}
                  {prdStatus==="processing" && (
                    <div className="card" style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
                      <div className="spin" style={{width:32,height:32,borderWidth:3}}/>
                      <div style={{fontFamily:"Syne",fontWeight:700}}>Writing PRD...</div>
                      <div style={{fontSize:11,color:"var(--mut)",fontFamily:"DM Mono"}}>Clustering → Pain points → Stories → Metrics</div>
                    </div>
                  )}
                  {prdResult && (
                    <div className="card">
                      <div className="ch" style={{background:"rgba(255,255,255,0.015)"}}>
                        <div>
                          <div style={{fontFamily:"Syne",fontWeight:800,fontSize:14}}>Product Requirements Document</div>
                          <div className="mono dim" style={{fontSize:10}}>AI-generated · {new Date().toLocaleDateString()} · Review before sharing</div>
                        </div>
                        <span className="tag tag-grn">Draft</span>
                      </div>
                      <div>
                        <div className="prd-sec">
                          <div className="prd-lbl">Problem Statement</div>
                          <p style={{fontSize:12,lineHeight:1.7}}>{prdResult.problem}</p>
                        </div>
                        <div className="prd-sec">
                          <div className="prd-lbl">User Stories</div>
                          {prdResult.stories.map((s,i)=><div key={i} className="story">{s}</div>)}
                        </div>
                        <div className="prd-sec">
                          <div className="prd-lbl">Acceptance Criteria</div>
                          {prdResult.criteria.map((c,i)=>(
                            <div key={i} style={{display:"flex",gap:7,fontSize:12,marginBottom:4,alignItems:"flex-start"}}>
                              <span style={{color:"var(--grn)",marginTop:1,flexShrink:0}}>✓</span>{c}
                            </div>
                          ))}
                        </div>
                        <div className="prd-sec">
                          <div className="prd-lbl">Success Metrics</div>
                          {prdResult.metrics.map((m,i)=>(
                            <div key={i} style={{fontSize:12,padding:"3px 0",borderBottom:i<prdResult.metrics.length-1?"1px solid rgba(28,43,64,0.3)":"none",display:"flex",gap:7,alignItems:"center"}}>
                              <div style={{width:3,height:3,borderRadius:"50%",background:"var(--acc)",flexShrink:0}}/>
                              {m}
                            </div>
                          ))}
                        </div>
                        <div className="prd-sec">
                          <div className="prd-lbl">Open Questions</div>
                          {prdResult.questions.map((q,i)=>(
                            <div key={i} style={{fontSize:12,padding:"3px 0",color:"var(--amb)",display:"flex",gap:6,alignItems:"flex-start"}}>
                              <span style={{flexShrink:0}}>?</span>{q}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{padding:"11px 16px",borderTop:"1px solid var(--bdr)"}}>
                        <div className="section-lbl" style={{marginBottom:7}}>Export</div>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                          {["Confluence","Notion","Google Docs","Markdown","Copy"].map((f,i)=><button key={i} className="xbtn">{f}</button>)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══ STAKEHOLDERS ═══════════════════════════════════════════ */}
            {page === "stakeholders" && (
              <div className="col">
                {/* Filter + summary */}
                <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                  {shProjects.map(p=>(
                    <button key={p} onClick={()=>setShFilter(p)} style={{fontFamily:"DM Mono",fontSize:10,padding:"4px 12px",borderRadius:100,cursor:"pointer",border:`1px solid ${shFilter===p?"var(--acc)":"var(--bdr)"}`,background:shFilter===p?"rgba(0,212,255,0.07)":"var(--surf)",color:shFilter===p?"var(--acc)":"var(--mut)",transition:"all 0.13s"}}>{p}</button>
                  ))}
                  <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                    {[
                      {n:`${filteredSh.length} people`,c:"var(--acc)"},
                      {n:`${filteredSh.filter(s=>s.age==="stale").length} need contact`,c:"var(--red)"},
                      {n:`${filteredSh.filter(s=>s.inf>=4).length} high influence`,c:"var(--pur)"},
                    ].map(({n,c})=>(
                      <span key={n} style={{fontFamily:"DM Mono",fontSize:10,padding:"4px 10px",borderRadius:100,background:"var(--surf)",border:"1px solid var(--bdr)",color:c}}>{n}</span>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="th-row" style={{gridTemplateColumns:"200px 110px 190px 1fr 80px 80px"}}>
                    <span>Name</span><span>Type</span><span>Email</span><span>Projects</span><span>Influence</span><span>Last Contact</span>
                  </div>
                  {filteredSh.map((s,i) => (
                    <div key={i} className="sh-row" style={{display:"grid",gridTemplateColumns:"200px 110px 190px 1fr 80px 80px",gap:12,padding:"11px 16px",borderBottom:"1px solid var(--bdr)",alignItems:"center",transition:"background 0.13s"}}>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <div className="sh-av" style={{background:`${s.col}18`,border:`1px solid ${s.col}30`,color:s.col}}>{s.in}</div>
                        <div>
                          <div style={{fontSize:13,fontWeight:500}}>{s.name}</div>
                          <div style={{fontSize:11,color:"var(--mut)"}}>{s.role}</div>
                        </div>
                      </div>
                      <span style={{fontSize:11,color:"var(--mut)"}}>{s.type}</span>
                      <a href={`mailto:${s.in}@company.com`} style={{fontFamily:"DM Mono",fontSize:11,color:"var(--acc)",textDecoration:"none"}} onMouseOver={(e)=>{(e.currentTarget as HTMLAnchorElement).style.textDecoration="underline";}} onMouseOut={(e)=>{(e.currentTarget as HTMLAnchorElement).style.textDecoration="none";}}>{s.in.toLowerCase()}@company.com</a>
                      <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                        {s.proj.map((p,j)=><span key={j} style={{fontSize:10,padding:"1px 6px",borderRadius:4,background:"var(--surf2)",border:"1px solid var(--bdr)",color:"var(--mut)"}}>{p}</span>)}
                      </div>
                      <div style={{display:"flex",gap:3}}>
                        {Array.from({length:5},(_,j)=>(
                          <div key={j} style={{width:8,height:8,borderRadius:2,background:j<s.inf?"var(--pur)":"var(--bdr2)"}}/>
                        ))}
                      </div>
                      <span className={`tag ${(AGE_TAG as Record<string,string>)[s.age]}`}>{s.last}</span>
                    </div>
                  ))}
                </div>

                {filteredSh.filter(s=>s.age==="stale").length > 0 && (
                  <div className="infobox ib-red" style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <span style={{fontSize:18}}>🔔</span>
                    <div>
                      <div style={{fontFamily:"Syne",fontWeight:700,fontSize:13,color:"var(--red)",marginBottom:3}}>Stakeholder Agent Alert</div>
                      <div style={{fontSize:12,color:"var(--mut)",lineHeight:1.6}}>
                        <strong style={{color:"var(--txt)"}}>{filteredSh.filter(s=>s.age==="stale").map(s=>s.name).join(", ")}</strong> haven't been contacted in 15+ days. Agent has drafted check-in emails — review and send from the Meetings tab.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ══ PILOT METRICS ══════════════════════════════════════════ */}
            {page === "metrics" && (
              <div className="col">
                {/* KPIs */}
                <div className="g4">
                  {[
                    {v:"23",   l:"DAU",                        d:"+4 vs last week",  up:true},
                    {v:"61%",  l:"WAU retention",              d:"+8pp vs week 1",   up:true},
                    {v:"3.2h", l:"Avg time saved / user / wk", d:"+0.4h vs last wk", up:true},
                    {v:"47min",l:"Meeting Scribe saved",        d:"top agent",        up:true},
                  ].map(({v,l,d,up})=>(
                    <div key={l} className="kpi">
                      <div className="kpi-v" style={{color:"var(--acc)"}}>{v}</div>
                      <div className="kpi-l">{l}</div>
                      <div className={`kpi-d ${up?"d-up":"d-dn"}`}>{up?"▲":"▼"} {d}</div>
                    </div>
                  ))}
                </div>

                <div className="g2">
                  {/* Adoption funnel */}
                  <div className="card">
                    <div className="ch"><div className="ct">Adoption Funnel · Week 3</div></div>
                    <div className="cb0">
                      {[
                        {l:"Invited",      n:40, pct:100,c:"var(--acc)"},
                        {l:"Activated",    n:31, pct:78, c:"var(--acc)"},
                        {l:"Used an agent",n:23, pct:74, c:"var(--grn)"},
                        {l:"Used 3+ agents",n:14,pct:61, c:"var(--grn)"},
                        {l:"Retained (D7)",n:9,  pct:64, c:"var(--amb)"},
                      ].map(({l,n,pct,c},i,a)=>(
                        <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 16px",borderBottom:i<a.length-1?"1px solid var(--bdr)":"none"}}>
                          <span style={{fontSize:12,width:100,flexShrink:0}}>{l}</span>
                          <div style={{flex:1,height:7,background:"var(--bdr2)",borderRadius:4,overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${pct}%`,background:c,borderRadius:4}}/>
                          </div>
                          <span className="mono dim" style={{fontSize:11,width:46,textAlign:"right"}}>{n} users</span>
                          <span className="mono acc" style={{fontSize:11,width:34,textAlign:"right"}}>{i===0?"":pct+"%"}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Agent usage */}
                  <div className="card">
                    <div className="ch"><div className="ct">Agent Usage Ranking</div></div>
                    <div className="cb0" style={{padding:"4px 16px 4px"}}>
                      {[
                        {n:"Meeting Scribe",    r:47, c:"var(--acc)"},
                        {n:"Weekly Digest",     r:23, c:"var(--grn)"},
                        {n:"Stakeholder Update",r:19, c:"var(--pur)"},
                        {n:"Prioritization",    r:14, c:"var(--amb)"},
                        {n:"PRD Agent",         r:8,  c:"var(--acc)"},
                        {n:"Risk Monitor",      r:6,  c:"var(--red)"},
                      ].map(({n,r,c})=>(
                        <div key={n} className="use-row">
                          <div className="use-name">{n}</div>
                          <div className="use-bw">
                            <div className="use-bar"><div className="use-fill" style={{width:`${(r/47)*100}%`,background:c}}/></div>
                            <div className="use-n">{r}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="g2">
                  {/* Time saved */}
                  <div className="card">
                    <div className="ch"><div className="ct">Time Saved · This Week</div></div>
                    <div className="cb0" style={{padding:"4px 16px 4px"}}>
                      {[
                        {l:"Meeting notes → tasks",  v:"47 min"},
                        {l:"Weekly stakeholder email",v:"38 min"},
                        {l:"Backlog prioritization",  v:"55 min"},
                        {l:"Focus group → PRD",       v:"2.1 hrs"},
                        {l:"Competitive intel digest",v:"30 min"},
                        {l:"Risk flag review",        v:"22 min"},
                      ].map(({l,v})=>(
                        <div key={l} className="tsav-row">
                          <span className="tsav-l">{l}</span>
                          <span className="tsav-v">{v}</span>
                        </div>
                      ))}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderTop:"1px solid var(--bdr)"}}>
                        <span style={{fontFamily:"Syne",fontWeight:700,fontSize:13}}>Total this week</span>
                        <span style={{fontFamily:"Syne",fontWeight:800,fontSize:18,color:"var(--grn)"}}>5.5 hrs</span>
                      </div>
                    </div>
                  </div>

                  {/* Alerts */}
                  <div className="col">
                    <div className="alert-b al-warn">
                      <span style={{fontSize:16}}>⚠️</span>
                      <div>
                        <div className="al-ttl" style={{color:"var(--amb)"}}>Prioritization Agent usage dropped 30%</div>
                        <div className="al-body">Usage fell from 20 to 14 runs/week. Possible causes: sprint planning moved, or competing manual process. <span className="acc">Investigate with top users.</span></div>
                      </div>
                    </div>
                    <div className="alert-b al-good">
                      <span style={{fontSize:16}}>✅</span>
                      <div>
                        <div className="al-ttl" style={{color:"var(--grn)"}}>PRD Agent retention high</div>
                        <div className="al-body">All 8 users who tried PRD Agent used it again within 48 hours. Consider promoting it as a default workflow.</div>
                      </div>
                    </div>
                    <div className="alert-b al-warn">
                      <span style={{fontSize:16}}>👥</span>
                      <div>
                        <div className="al-ttl" style={{color:"var(--amb)"}}>D7 retention below target</div>
                        <div className="al-body">64% vs 75% target. Users who attend onboarding session retain at 89%. <span className="acc">Schedule 2 more sessions this week.</span></div>
                      </div>
                    </div>
                    <div style={{padding:"12px 14px",background:"var(--surf)",border:"1px solid var(--bdr)",borderRadius:10}}>
                      <div className="section-lbl" style={{marginBottom:5}}>NPS · Week 3 Survey</div>
                      <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                        <span style={{fontFamily:"Syne",fontWeight:800,fontSize:30,color:"var(--acc)"}}>+52</span>
                        <span style={{fontSize:12,color:"var(--mut)"}}>from 11 responses · Target ≥ 45 ✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ PRIVACY ════════════════════════════════════════════════ */}
            {page === "privacy" && (
              <div className="col">
                {/* Residency banner */}
                <div style={{padding:"12px 16px",background:"rgba(16,185,129,0.05)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:"var(--grn)",boxShadow:"0 0 5px var(--grn)"}}/>
                    <span style={{fontFamily:"Syne",fontWeight:700,fontSize:13}}>No data has left this machine</span>
                    <span style={{fontSize:12,color:"var(--mut)"}}>All processing local · Only outbound: Claude API</span>
                  </div>
                  <div style={{display:"flex",gap:7}}>
                    {["Local Postgres","Docker Network","MacBook Pro"].map(l=>(
                      <span key={l} style={{display:"inline-flex",alignItems:"center",gap:5,fontFamily:"DM Mono",fontSize:10,padding:"4px 9px",borderRadius:7,background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)",color:"var(--grn)"}}>
                        <div style={{width:5,height:5,borderRadius:"50%",background:"var(--grn)"}}/>
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="g2">
                  {/* Memory log */}
                  <div className="card">
                    <div className="ch">
                      <div className="ct">Agent Memory Log</div>
                      <button onClick={()=>setMemLog([])} style={{fontFamily:"DM Mono",fontSize:10,padding:"2px 8px",border:"1px solid rgba(239,68,68,0.3)",borderRadius:4,color:"var(--red)",background:"transparent",cursor:"pointer"}}>Forget All</button>
                    </div>
                    <div className="cb">
                      {memLog.length===0
                        ? <div style={{textAlign:"center",padding:"20px 0",fontSize:13,color:"var(--mut)"}}>Memory cleared</div>
                        : memLog.map(m=>(
                          <div key={m.id} className="mem-row">
                            <div className="mdot" style={{background:m.type==="project"?"var(--acc)":m.type==="agent"?"var(--pur)":m.type==="meeting"?"var(--amb)":"var(--grn)"}}/>
                            <div style={{flex:1}}>
                              <div className="mem-text">{m.text}</div>
                              <div className="mem-src">{m.src}</div>
                            </div>
                            <button className="del-btn" onClick={()=>forgetMem(m.id)}>Forget</button>
                          </div>
                        ))
                      }
                    </div>
                  </div>

                  {/* Settings column */}
                  <div className="col">
                    <div className="card">
                      <div className="ch"><div className="ct">Memory Settings</div></div>
                      <div className="cb">
                        {[
                          {k:"persist", l:"Persistent memory",  s:"Agent remembers across sessions"},
                          {k:"learn",   l:"Agent learning",      s:"Agents improve from your usage patterns"},
                          {k:"session", l:"Session-only mode",   s:"Wipe memory when you close the app"},
                          {k:"audit",   l:"Audit log",           s:"Record every agent action for compliance"},
                        ].map(({k,l,s})=>(
                          <div key={k} className="tog-row">
                            <div>
                              <div className="tog-lbl">{l}</div>
                              <div className="tog-sub">{s}</div>
                            </div>
                            <div className={`tog ${privTogs[k]?"on":"off"}`} onClick={()=>togglePriv(k)}/>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card">
                      <div className="ch"><div className="ct">Data Flow Audit</div></div>
                      <div className="cb">
                        {[
                          {s:"Jira tickets",         d:"Local Postgres only",          ok:true},
                          {s:"Calendar events",      d:"Local Postgres only",          ok:true},
                          {s:"Meeting transcripts",  d:"Claude API (anonymised)",      ok:true},
                          {s:"Backlog items",        d:"Claude API (no PII)",          ok:true},
                          {s:"Stakeholder emails",   d:"Local only — never sent to AI",ok:true},
                          {s:"OKR data",             d:"Local Postgres only",          ok:true},
                        ].map((r,i)=>(
                          <div key={i} className="flow-row">
                            <div className="flow-src dim" style={{fontSize:12}}>{r.s}</div>
                            <span className="dim" style={{fontSize:11}}>→</span>
                            <div className="flow-dst" style={{color:r.ok?"var(--grn)":"var(--red)"}}>{r.d}</div>
                            <div className="fdot" style={{background:r.ok?"var(--grn)":"var(--red)"}}/>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card">
                      <div className="ch"><div className="ct">Right to Delete</div></div>
                      <div className="cb">
                        <p style={{fontSize:12,color:"var(--mut)",lineHeight:1.7,marginBottom:12}}>All data is stored in a local Postgres database. Export or permanently delete it at any time.</p>
                        <div className="col" style={{gap:6}}>
                          {["Export all my data (JSON)","Delete meeting transcripts","Wipe agent run history","Full data reset"].map((a,i)=>(
                            <button key={i} style={{padding:"8px 11px",borderRadius:7,border:`1px solid ${i===3?"rgba(239,68,68,0.3)":"var(--bdr)"}`,background:"var(--surf2)",color:i===3?"var(--red)":"var(--txt)",fontSize:12,textAlign:"left",cursor:"pointer"}}>{a}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
};

export default Index;
