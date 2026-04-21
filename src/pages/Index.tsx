import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/* ─ Styles ─────────────────────────────────────────────────────────────── */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:    #07090f; --surf:  #0c1018; --surf2: #101520;
    --bdr:   #192030; --bdr2:  #1e2a3d;
    --acc:   #00d4ff; --pur:   #7c3aed; --grn:   #10b981;
    --amb:   #f59e0b; --red:   #ef4444;
    --txt:   #dde4ef; --mut:   #4e5f74;
    --r: 10px; --r-sm: 7px; --gap: 14px;
  }

  html, body { height: 100%; }
  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--txt); font-size: 14px; line-height: 1.5; }

  .app { display: flex; min-height: 100vh; }

  /* Sidebar */
  .sb { width: 208px; flex-shrink: 0; background: var(--surf); border-right: 1px solid var(--bdr); position: fixed; inset: 0 auto 0 0; display: flex; flex-direction: column; overflow-y: auto; z-index: 20; }
  .sb-brand { padding: 18px 16px 14px; border-bottom: 1px solid var(--bdr); }
  .sb-logo { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .sb-logo-mark { width: 28px; height: 28px; border-radius: 7px; background: linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15)); border: 1px solid rgba(0,212,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .sb-logo-name { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; }
  .sb-context { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--acc); letter-spacing: 0.12em; text-transform: uppercase; }
  .sb-nav { flex: 1; padding: 8px 0; }
  .sb-grp-lbl { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--mut); padding: 12px 14px 4px; }
  .sb-item { display: flex; align-items: center; gap: 9px; padding: 7px 14px; cursor: pointer; font-size: 13px; color: var(--mut); transition: all 0.13s; border-left: 2px solid transparent; user-select: none; white-space: nowrap; }
  .sb-item:hover { color: var(--txt); background: rgba(255,255,255,0.025); }
  .sb-item.on { color: var(--acc); border-left-color: var(--acc); background: rgba(0,212,255,0.055); font-weight: 500; }
  .sb-item-ic { font-size: 12px; width: 15px; text-align: center; flex-shrink: 0; }
  .sb-foot { padding: 12px 14px; border-top: 1px solid var(--bdr); display: flex; flex-direction: column; gap: 5px; }
  .sb-stat { display: flex; align-items: center; gap: 7px; font-family: 'DM Mono', monospace; font-size: 10px; color: var(--mut); }
  .sdot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

  /* Main */
  .main { margin-left: 208px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
  .ph { padding: 20px 28px 16px; border-bottom: 1px solid var(--bdr); background: var(--surf); position: sticky; top: 0; z-index: 10; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
  .ph-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; line-height: 1.1; margin-bottom: 3px; }
  .ph-sub { font-size: 12px; color: var(--mut); }
  .pb { padding: 22px 28px; }

  /* Cards */
  .card { background: var(--surf); border: 1px solid var(--bdr); border-radius: var(--r); }
  .ch { padding: 13px 16px; border-bottom: 1px solid var(--bdr); display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .ct { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; color: var(--mut); }
  .cb { padding: 14px 16px; }
  .cb0 { padding: 0; }

  /* Grids */
  .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gap); }
  .g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--gap); }
  .g4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: var(--gap); }
  .ga { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: var(--gap); }
  .col { display: flex; flex-direction: column; gap: var(--gap); }
  .row { display: flex; align-items: center; gap: var(--gap); }

  /* Tags */
  .tag { display: inline-flex; align-items: center; gap: 4px; font-family: 'DM Mono', monospace; font-size: 10px; padding: 2px 8px; border-radius: 100px; white-space: nowrap; border: 1px solid; }
  .tag-grn { background: rgba(16,185,129,0.1);  color: var(--grn); border-color: rgba(16,185,129,0.25); }
  .tag-amb { background: rgba(245,158,11,0.1);  color: var(--amb); border-color: rgba(245,158,11,0.25); }
  .tag-red { background: rgba(239,68,68,0.1);   color: var(--red); border-color: rgba(239,68,68,0.25); }
  .tag-blu { background: rgba(0,212,255,0.09);  color: var(--acc); border-color: rgba(0,212,255,0.2); }
  .tag-pur { background: rgba(124,58,237,0.1);  color: var(--pur); border-color: rgba(124,58,237,0.25); }
  .tag-dim { background: rgba(78,95,116,0.12);  color: var(--mut); border-color: rgba(78,95,116,0.2); }

  /* Progress */
  .bar-wrap { display: flex; align-items: center; gap: 8px; }
  .bar-track { flex: 1; height: 3px; background: var(--bdr2); border-radius: 2px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 2px; transition: width 0.4s; }
  .bar-pct { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--mut); width: 28px; text-align: right; }

  /* Table rows */
  .tr { display: grid; align-items: center; gap: 12px; padding: 10px 16px; border-bottom: 1px solid var(--bdr); font-size: 13px; }
  .tr:last-child { border-bottom: none; }
  .tr:hover { background: rgba(255,255,255,0.015); }
  .th-row { display: grid; align-items: center; gap: 12px; padding: 7px 16px; border-bottom: 1px solid var(--bdr); font-family: 'DM Mono', monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--mut); }

  /* Toggle */
  .tog { width: 36px; height: 20px; border-radius: 10px; cursor: pointer; position: relative; transition: background 0.2s; flex-shrink: 0; }
  .tog.off { background: var(--bdr2); }
  .tog.on  { background: var(--grn); }
  .tog::after { content: ''; position: absolute; width: 14px; height: 14px; border-radius: 50%; background: #fff; top: 3px; transition: left 0.2s; }
  .tog.off::after { left: 3px; }
  .tog.on::after  { left: 19px; }

  /* Spinner */
  .spin { width: 18px; height: 18px; border: 2px solid var(--bdr2); border-top-color: var(--acc); border-radius: 50%; animation: rot 0.8s linear infinite; flex-shrink: 0; }
  @keyframes rot { to { transform: rotate(360deg); } }

  /* Buttons */
  .btn { font-family: 'DM Mono', monospace; font-size: 11px; padding: 6px 13px; border-radius: var(--r-sm); cursor: pointer; border: 1px solid var(--bdr); background: var(--surf2); color: var(--txt); transition: all 0.13s; white-space: nowrap; }
  .btn:hover { border-color: var(--acc); color: var(--acc); }
  .btn-primary { background: var(--acc); color: #000; border-color: var(--acc); font-weight: 500; }
  .btn-primary:hover { opacity: 0.85; color: #000; }
  .btn-danger { border-color: rgba(239,68,68,0.3); color: var(--red); background: rgba(239,68,68,0.05); }
  .btn-danger:hover { background: rgba(239,68,68,0.12); }
  .btn-sm { padding: 3px 8px; font-size: 10px; }
  .btn-icon { width: 24px; height: 24px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 5px; opacity: 0; transition: opacity 0.13s; }
  .tr:hover .btn-icon, .sh-row:hover .btn-icon, .mem-row:hover .btn-icon { opacity: 1; }

  /* Forms */
  .input { width: 100%; background: var(--surf2); border: 1px solid var(--bdr2); border-radius: var(--r-sm); padding: 8px 10px; color: var(--txt); font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.13s; }
  .input:focus { border-color: var(--acc); }
  .input-sm { padding: 5px 8px; font-size: 12px; }
  .select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%234e5f74'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 8px center; padding-right: 24px; }
  .form-row { display: flex; flex-direction: column; gap: 4px; }
  .form-label { font-family: 'DM Mono', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--mut); }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .form-actions { display: flex; gap: 8px; justify-content: flex-end; padding-top: 4px; }

  /* Modal overlay */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: var(--surf); border: 1px solid var(--bdr); border-radius: 14px; padding: 22px; width: 100%; max-width: 480px; display: flex; flex-direction: column; gap: 14px; }
  .modal-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; }

  /* Inline add row */
  .add-row { display: flex; gap: 8px; align-items: center; padding: 10px 16px; border-top: 1px solid var(--bdr); background: rgba(0,212,255,0.02); }

  /* Workflow cards */
  .wfc { background: var(--surf); border: 1px solid var(--bdr); border-radius: var(--r); padding: 16px; position: relative; overflow: hidden; transition: border-color 0.15s; }
  .wfc:hover { border-color: rgba(0,212,255,0.3); }
  .wfc::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; border-radius: var(--r) var(--r) 0 0; }
  .wf-full::before    { background: linear-gradient(90deg, var(--grn), var(--acc)); }
  .wf-partial::before { background: linear-gradient(90deg, var(--amb), var(--pur)); }
  .wf-none::before    { background: var(--bdr2); }
  .wf-title  { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; margin-bottom: 2px; }
  .wf-cat    { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--mut); text-transform: uppercase; }
  .wf-desc   { font-size: 12px; color: var(--mut); line-height: 1.6; margin: 9px 0 10px; }
  .wf-step   { display: flex; align-items: center; gap: 7px; font-size: 11px; padding: 5px 8px; background: var(--surf2); border-radius: 5px; margin-top: 3px; }
  .wf-ai     { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--acc); margin-left: auto; opacity: 0.7; }

  /* Agent cards */
  .agc { background: var(--surf); border: 1px solid var(--bdr); border-radius: var(--r); padding: 16px; transition: all 0.15s; }
  .agc:hover { border-color: var(--pur); transform: translateY(-1px); }
  .ag-icon { width: 38px; height: 38px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 10px; }
  .ic-blu { background: rgba(0,212,255,0.1);  border: 1px solid rgba(0,212,255,0.2); }
  .ic-pur { background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.2); }
  .ic-grn { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); }
  .ic-amb { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); }
  .ag-name { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; margin-bottom: 4px; }
  .ag-trig { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--acc); background: rgba(0,212,255,0.07); border: 1px solid rgba(0,212,255,0.15); padding: 2px 7px; border-radius: 4px; display: inline-block; margin-bottom: 8px; }
  .ag-desc { font-size: 12px; color: var(--mut); line-height: 1.6; margin-bottom: 10px; }
  .chips { display: flex; flex-wrap: wrap; gap: 4px; }
  .chip  { font-size: 10px; padding: 2px 7px; border-radius: 100px; background: var(--surf2); border: 1px solid var(--bdr2); color: var(--mut); }

  /* Schedule */
  .tl-wrap { position: relative; }
  .tl-slot { display: grid; grid-template-columns: 46px 1fr; gap: 0; min-height: 62px; }
  .tl-slot::before { content: ''; position: absolute; left: 46px; width: 1px; background: var(--bdr); top: 0; bottom: 0; }
  .tl-time { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--mut); padding-top: 5px; text-align: right; padding-right: 8px; }
  .tl-ev   { border-radius: var(--r-sm); padding: 6px 10px; margin: 2px 0 4px 10px; border-left: 3px solid; }
  .ev-meet  { background: rgba(124,58,237,0.09); border-color: var(--pur); }
  .ev-deep  { background: rgba(0,212,255,0.07);  border-color: var(--acc); }
  .ev-admin { background: rgba(78,95,116,0.08);  border-color: var(--mut); }
  .ev-buf   { background: rgba(16,185,129,0.06); border-color: var(--grn); }
  .ev-break { background: rgba(245,158,11,0.06); border-color: var(--amb); }
  .ev-title { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; margin-bottom: 1px; }
  .ev-meta  { font-size: 10px; color: var(--mut); display: flex; gap: 8px; align-items: center; }
  .ev-ai-tag { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--acc); }

  /* OKR */
  .okr-blk { background: var(--surf); border: 1px solid var(--bdr); border-radius: var(--r); overflow: hidden; }
  .okr-hd  { padding: 14px 16px; display: flex; align-items: center; gap: 11px; cursor: pointer; border-bottom: 1px solid var(--bdr); }
  .okr-hd:hover { background: rgba(255,255,255,0.02); }
  .okr-ico { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
  .okr-obj { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; margin-bottom: 2px; }
  .okr-own { font-size: 11px; color: var(--mut); }
  .okr-pct { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; line-height: 1; }
  .okr-plbl{ font-family: 'DM Mono', monospace; font-size: 9px; color: var(--mut); margin-top: 2px; }
  .okr-bar { height: 3px; background: var(--bdr2); border-radius: 2px; overflow: hidden; margin: 0 16px 2px; }
  .okr-bf  { height: 100%; border-radius: 2px; }
  .kr-row  { display: grid; grid-template-columns: 1fr 160px 100px; gap: 12px; align-items: center; padding: 11px 16px; border-bottom: 1px solid var(--bdr); }
  .kr-row:last-child { border-bottom: none; }
  .kr-name { font-size: 12px; line-height: 1.4; }
  .kr-bars { display: flex; flex-direction: column; gap: 3px; }
  .kr-bar  { height: 4px; background: var(--bdr2); border-radius: 2px; overflow: hidden; }
  .kr-fill { height: 100%; border-radius: 2px; }
  .kr-nums { display: flex; justify-content: space-between; font-family: 'DM Mono', monospace; font-size: 9px; color: var(--mut); }
  .kr-edit-wrap { display: flex; align-items: center; gap: 6px; }
  .kr-edit-input { width: 60px; font-family: 'DM Mono', monospace; font-size: 12px; text-align: right; }

  /* PRD */
  .upload-z { border: 2px dashed var(--bdr2); border-radius: var(--r); padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s; }
  .upload-z:hover { border-color: var(--acc); background: rgba(0,212,255,0.02); }
  .prd-sec  { padding: 13px 16px; border-bottom: 1px solid var(--bdr); }
  .prd-sec:last-child { border-bottom: none; }
  .prd-lbl  { font-family: 'DM Mono', monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--mut); margin-bottom: 8px; }
  .story    { padding: 8px 10px; background: var(--surf2); border-radius: var(--r-sm); border-left: 3px solid var(--pur); margin-bottom: 5px; font-size: 12px; line-height: 1.6; }
  .xbtn     { font-family: 'DM Mono', monospace; font-size: 10px; padding: 5px 11px; border-radius: var(--r-sm); cursor: pointer; border: 1px solid var(--bdr); background: var(--surf2); color: var(--txt); transition: all 0.13s; }
  .xbtn:hover { border-color: var(--acc); color: var(--acc); }

  /* Privacy */
  .mem-row  { display: flex; align-items: flex-start; gap: 9px; padding: 9px 0; border-bottom: 1px solid var(--bdr); }
  .mem-row:last-child { border-bottom: none; }
  .mdot     { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
  .mem-text { flex: 1; font-size: 12px; line-height: 1.5; }
  .mem-src  { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--mut); }
  .tog-row  { display: flex; justify-content: space-between; align-items: center; padding: 11px 0; border-bottom: 1px solid var(--bdr); }
  .tog-row:last-child { border-bottom: none; }
  .tog-lbl  { font-size: 13px; }
  .tog-sub  { font-size: 11px; color: var(--mut); margin-top: 2px; }
  .flow-row { display: flex; align-items: center; gap: 8px; font-size: 12px; padding: 7px 0; border-bottom: 1px solid var(--bdr); }
  .flow-row:last-child { border-bottom: none; }
  .flow-src { flex: 1; }
  .fdot     { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

  /* Metrics */
  .kpi      { background: var(--surf); border: 1px solid var(--bdr); border-radius: var(--r); padding: 15px; }
  .kpi-v    { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
  .kpi-l    { font-size: 11px; color: var(--mut); font-family: 'DM Mono', monospace; }
  .kpi-d    { font-size: 10px; font-family: 'DM Mono', monospace; margin-top: 3px; }
  .d-up { color: var(--grn); } .d-dn { color: var(--red); }
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

  /* Stakeholders */
  .sh-row   { display: flex; align-items: center; gap: 9px; padding: 11px 16px; border-bottom: 1px solid var(--bdr); }
  .sh-row:hover { background: rgba(255,255,255,0.015); }
  .sh-row:last-child { border-bottom: none; }
  .sh-av    { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; font-family: 'Syne', sans-serif; }

  /* Todo */
  .todo-item { display: flex; align-items: center; gap: 9px; padding: 9px 11px; border-radius: var(--r-sm); background: var(--surf2); border: 1px solid var(--bdr); transition: border-color 0.13s; }
  .todo-item:hover { border-color: var(--bdr2); }
  .todo-chk  { width: 15px; height: 15px; border-radius: 4px; border: 1px solid var(--bdr2); display: flex; align-items: center; justify-content: center; font-size: 9px; transition: all 0.13s; flex-shrink: 0; cursor: pointer; }
  .todo-chk.dn { background: var(--grn); border-color: var(--grn); color: #000; }
  .todo-txt  { flex: 1; font-size: 13px; }
  .todo-txt.dn { text-decoration: line-through; color: var(--mut); }
  .ai-note   { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--acc); }

  /* Misc */
  .mono { font-family: 'DM Mono', monospace; }
  .dim  { color: var(--mut); }
  .acc  { color: var(--acc); }
  .section-lbl { font-family: 'DM Mono', monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--mut); margin-bottom: 10px; }
  .infobox { padding: 11px 14px; border-radius: var(--r-sm); font-size: 12px; line-height: 1.6; color: var(--mut); }
  .ib-blue { background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.12); }
  .ib-red  { background: rgba(239,68,68,0.05);  border: 1px solid rgba(239,68,68,0.15); }
  .ib-grn  { background: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.15); }
  .loading { display: flex; align-items: center; gap: 10px; padding: 20px; color: var(--mut); font-size: 13px; }
  .empty   { text-align: center; padding: 32px; color: var(--mut); font-size: 13px; }

  @media (max-width: 800px) {
    .sb { width: 52px; }
    .sb-item span:not(.sb-item-ic) { display: none; }
    .sb-grp-lbl, .sb-logo-name, .sb-context { display: none; }
    .main { margin-left: 52px; }
    .g2, .g3, .g4 { grid-template-columns: 1fr; }
    .pb { padding: 14px; }
    .form-grid { grid-template-columns: 1fr; }
  }
`;

/* ─ Static data (unchanged from v2) ────────────────────────────────────── */
const NAV = [
  { grp:"Today",        items:[{ id:"schedule",ic:"🕐",lbl:"Daily Schedule"},{ id:"todos",ic:"☑",lbl:"To-Do List"}]},
  { grp:"Execution",    items:[{ id:"tracker", ic:"◎",lbl:"Projects"},      { id:"meetings",ic:"✦",lbl:"Meetings"}]},
  { grp:"Strategy",     items:[{ id:"priority",ic:"◈",lbl:"Prioritization"},{ id:"okr",    ic:"◎",lbl:"OKR Tracker"}]},
  { grp:"Intelligence", items:[{ id:"overview",ic:"⬡",lbl:"Workflows"},     { id:"agents", ic:"⬡",lbl:"AI Agents"}, { id:"prd",ic:"📄",lbl:"PRD Agent"}]},
  { grp:"People",       items:[{ id:"stakeholders",ic:"◉",lbl:"Stakeholders"}]},
  { grp:"Operations",   items:[{ id:"metrics",ic:"◎",lbl:"Pilot Metrics"},  { id:"privacy",ic:"◈",lbl:"Privacy"}, { id:"integrations",ic:"⚡",lbl:"Integrations"}]},
];

const PAGE_INFO = {
  overview:    { title:"All Workflows",        sub:"Every core PM task mapped by AI automation potential" },
  schedule:    { title:"Daily Schedule",       sub:"AI-optimised time blocks — deep work protected, meetings batched" },
  todos:       { title:"Today's Focus List",   sub:"Agent-curated priorities synthesised from all your tools" },
  tracker:     { title:"Project Tracker",      sub:"Live project health — AI monitors status and flags risk automatically" },
  meetings:    { title:"Meeting Intelligence", sub:"Agent transcribes, extracts decisions, creates tasks — zero manual notes" },
  priority:    { title:"Prioritization",       sub:"RICE scoring aligned to vision, OKRs and quarterly strategy" },
  okr:         { title:"OKR Tracker",          sub:"Q2 · April–June 2025 · Week 3 of 13 · AI monitors KR drift weekly" },
  agents:      { title:"AI Agent Stack",       sub:"6 agents handling the repetitive, cognitive-load-heavy work" },
  prd:         { title:"PRD Agent",            sub:"Paste focus group data — agent clusters themes and writes a structured PRD in seconds" },
  stakeholders:{ title:"Stakeholders",         sub:"Everyone who matters — filterable by project, with influence and last contact" },
  metrics:     { title:"Pilot Metrics",        sub:"Adoption funnel, time saved, agent usage and threshold alerts" },
  privacy:     { title:"Privacy & Data Controls", sub:"What the system remembers, where data goes, and your right to delete" },
  integrations:{ title:"Integrations",            sub:"Live connections to Jira, Webex, Gmail and Google Calendar — bidirectional sync" },
};

const WORKFLOWS = [
  { title:"Feature Prioritization",   cat:"Strategy",     ai:"full",    desc:"Rank features using RICE/ICE, align with vision and quarterly OKRs, auto-score backlog items.",                tasks:[{ic:"🤖",lbl:"Auto-score features via RICE",ai:true},{ic:"🤖",lbl:"Map to vision + quarterly goals",ai:true},{ic:"✏️",lbl:"Final call on strategic tradeoffs",ai:false}]},
  { title:"Meeting Intelligence",     cat:"Communication",ai:"full",    desc:"Transcribe, summarize, extract decisions and action items from all meetings automatically.",                     tasks:[{ic:"🤖",lbl:"Transcribe & summarize notes",ai:true},{ic:"🤖",lbl:"Extract action items + owners",ai:true},{ic:"🤖",lbl:"Update project tracker",ai:true}]},
  { title:"Stakeholder Updates",      cat:"Communication",ai:"partial", desc:"Auto-draft weekly status emails and executive summaries from live project data.",                               tasks:[{ic:"🤖",lbl:"Pull data & draft status update",ai:true},{ic:"✏️",lbl:"Review, tailor tone & send",ai:false}]},
  { title:"Data Synthesis & Insights",cat:"Analytics",    ai:"full",    desc:"Aggregate metrics from multiple tools, surface anomalies, generate weekly insights report.",                   tasks:[{ic:"🤖",lbl:"Pull data from Jira, Amplitude",ai:true},{ic:"🤖",lbl:"Detect trends & anomalies",ai:true},{ic:"🤖",lbl:"Generate insights summary",ai:true}]},
  { title:"Project Status Tracking",  cat:"Execution",    ai:"full",    desc:"Monitor sprint progress, flag blockers, predict delivery risk in real-time.",                                   tasks:[{ic:"🤖",lbl:"Monitor Jira/Linear changes",ai:true},{ic:"🤖",lbl:"Flag at-risk items automatically",ai:true},{ic:"✏️",lbl:"Resolve blockers & replan",ai:false}]},
  { title:"Assignment Tracking",      cat:"Execution",    ai:"partial", desc:"Track who owns what, surface overdue tasks, send reminders and escalations.",                                   tasks:[{ic:"🤖",lbl:"Monitor assignments across tools",ai:true},{ic:"🤖",lbl:"Send nudge reminders to owners",ai:true},{ic:"✏️",lbl:"Handle escalations",ai:false}]},
  { title:"User Research Synthesis",  cat:"Discovery",    ai:"partial", desc:"Summarize interviews, cluster themes, surface key pain points from qualitative data.",                         tasks:[{ic:"🤖",lbl:"Cluster themes from interviews",ai:true},{ic:"✏️",lbl:"Interpret strategic implications",ai:false}]},
  { title:"Roadmap Planning",         cat:"Strategy",     ai:"partial", desc:"Generate draft roadmap from backlog priorities, goals and capacity data.",                                      tasks:[{ic:"🤖",lbl:"Draft roadmap from scored backlog",ai:true},{ic:"✏️",lbl:"Negotiate scope with engineering",ai:false},{ic:"✏️",lbl:"Align with leadership",ai:false}]},
  { title:"Competitive Intelligence", cat:"Discovery",    ai:"full",    desc:"Monitor competitors, scrape release notes and news, summarize weekly landscape changes.",                       tasks:[{ic:"🤖",lbl:"Scrape competitor blogs & notes",ai:true},{ic:"🤖",lbl:"Weekly landscape digest",ai:true}]},
];

const AGENTS = [
  { ic:"🧠",col:"ic-blu",name:"Prioritization Agent",   trig:"Every sprint planning session",desc:"Takes your backlog, applies RICE scoring based on business impact, reach, confidence and effort. Cross-references quarterly OKRs to surface the top 10 items.",inputs:["Backlog (Jira/Linear)","OKR doc","Vision doc","Capacity data"]},
  { ic:"🎙️",col:"ic-pur",name:"Meeting Scribe Agent",   trig:"After every meeting ends",     desc:"Listens to meeting recordings, produces a structured summary with key decisions, action items with owner and due date, and auto-pushes tasks to your project tracker.",inputs:["Meeting recording","Calendar context","Project tracker API"]},
  { ic:"📊",col:"ic-grn",name:"Weekly Digest Agent",    trig:"Every Monday 8am",             desc:"Aggregates data from Jira, Amplitude, Slack and CRM. Generates an executive-ready briefing: what shipped, what's at risk, key metrics, top 3 decisions needed.",inputs:["Jira","Amplitude","Slack","Salesforce"]},
  { ic:"🔔",col:"ic-amb",name:"Risk & Blocker Agent",   trig:"Continuous monitoring",        desc:"Watches for sprint velocity drops, overdue milestones, unassigned critical tickets, and silent stakeholders. Sends smart Slack alerts with suggested actions.",inputs:["Jira / Linear","Slack","Calendar","Project roadmap"]},
  { ic:"📝",col:"ic-blu",name:"Stakeholder Update Agent",trig:"Every Friday 3pm",            desc:"Pulls project status data, compares against last week's targets, writes a polished status email for each stakeholder group tailored to their level of detail.",inputs:["Project tracker","OKR targets","Stakeholder map","Last week's update"]},
  { ic:"🔭",col:"ic-pur",name:"Competitive Intel Agent", trig:"Daily / on-demand",           desc:"Monitors competitor websites, product blogs, App Store reviews and tech news. Surfaces relevant changes as a clean weekly digest with implications for your roadmap.",inputs:["Competitor URLs","G2/Capterra","App Store","Tech news feeds"]},
];

const SCHEDULE = [
  { t:"08:00",type:"deep", title:"🧠 Deep Work Block",         desc:"Strategy doc / roadmap writing",         dur:"90 min",ai:"AI-blocked"},
  { t:"09:30",type:"admin",title:"📬 Inbox Triage",             desc:"Emails, Slack, agent digests",           dur:"30 min",ai:"Agent-sorted"},
  { t:"10:00",type:"meet", title:"Sprint Planning — Mobile",    desc:"Ana, Raj, Marcus · Zoom",                dur:"60 min",ai:"Scribe active"},
  { t:"11:00",type:"buf",  title:"☕ Buffer + Follow-ups",       desc:"Action items from sprint planning",      dur:"30 min",ai:null},
  { t:"11:30",type:"deep", title:"🔬 User Research Synthesis",  desc:"Review interview notes, cluster themes", dur:"60 min",ai:"Agent queued"},
  { t:"12:30",type:"break",title:"🍱 Lunch",                    desc:"Protected — no meetings",                dur:"60 min",ai:null},
  { t:"13:30",type:"meet", title:"1:1 with Engineering Lead",   desc:"Chen · Payments blocker + capacity",     dur:"30 min",ai:"Scribe active"},
  { t:"14:00",type:"admin",title:"📊 Metrics Review",           desc:"Weekly digest · Amplitude + Jira",       dur:"30 min",ai:"Agent-compiled"},
  { t:"14:30",type:"deep", title:"📝 PRD Writing",              desc:"AI Recommendations — no interruptions",  dur:"90 min",ai:null},
  { t:"16:00",type:"meet", title:"Exec Roadmap Review Prep",    desc:"Slides review with design lead",         dur:"30 min",ai:null},
  { t:"16:30",type:"admin",title:"📤 EOD Stakeholder Update",   desc:"AI-drafted email — review and send",     dur:"30 min",ai:"AI-drafted"},
  { t:"17:00",type:"buf",  title:"🌅 Wind Down / Plan Tomorrow",desc:"Review to-dos, set next day priorities", dur:"30 min",ai:"Agent-suggested"},
];
const EV_CLS = { deep:"ev-deep",meet:"ev-meet",admin:"ev-admin",buf:"ev-buf",break:"ev-break" };

const RICE_STATIC = [
  { name:"Mobile Onboarding V2",r:85,i:8,c:90,e:5, score:122},
  { name:"Search Improvement",  r:60,i:7,c:80,e:3, score:112},
  { name:"AI Recommendations",  r:90,i:9,c:70,e:8, score:101},
  { name:"B2B Dashboard",       r:40,i:8,c:60,e:9, score:21},
];

const STATUS_COLOR = {"on-track":"tag-grn","at-risk":"tag-amb","delayed":"tag-red","planning":"tag-pur"};
const BAR_COLOR    = {"on-track":"var(--grn)","at-risk":"var(--amb)","delayed":"var(--red)","planning":"var(--pur)"};
const KR_COLOR     = {"on-track":"var(--grn)","at-risk":"var(--amb)","planning":"var(--pur)"};
const KR_TAG       = {"on-track":"tag-grn","at-risk":"tag-amb","planning":"tag-pur"};
const AGE_TAG      = { recent:"tag-grn", old:"tag-amb", stale:"tag-red" };

/* ─ Helpers ─────────────────────────────────────────────────────────────── */
const initials = name => name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
const contactAge = dt => {
  if (!dt) return "stale";
  const days = (Date.now() - new Date(dt).getTime()) / 86400000;
  return days < 7 ? "recent" : days < 14 ? "old" : "stale";
};
const contactLabel = dt => {
  if (!dt) return "Never";
  const days = Math.floor((Date.now() - new Date(dt).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
};

/* ─ Reusable Modal ───────────────────────────────────────────────────────── */
function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div className="modal-title">{title}</div>
          <button className="btn btn-sm" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─ Main Component ───────────────────────────────────────────────────────── */
export default function PMDashboard() {
  const [page, setPage]               = useState("overview");
  const [user, setUser]               = useState(null);

  /* Tasks */
  const [todos, setTodos]             = useState([]);
  const [todosLoading, setTodosLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask]         = useState({ title:"", priority:"med" });

  /* Projects */
  const [projects, setProjects]       = useState([]);
  const [projLoading, setProjLoading] = useState(true);
  const [showAddProj, setShowAddProj] = useState(false);
  const [editProj, setEditProj]       = useState(null);
  const [projForm, setProjForm]       = useState({ name:"", owner:"", status:"planning", progress:0, due_date:"" });

  /* Meetings */
  const [meetings, setMeetings]       = useState([]);
  const [meetLoading, setMeetLoading] = useState(true);
  const [showAddMeet, setShowAddMeet] = useState(false);
  const [meetForm, setMeetForm]       = useState({ title:"", meeting_time:"", raw_transcript:"" });
  const [meetProcessing, setMeetProcessing] = useState(false);

  /* OKRs */
  const [okrs, setOkrs]               = useState([]);
  const [okrsLoading, setOkrsLoading] = useState(true);
  const [expandedOkr, setExpandedOkr] = useState([]);
  const [editingKR, setEditingKR]     = useState(null);
  const [krEditVal, setKrEditVal]     = useState("");

  /* Stakeholders */
  const [stakeholders, setStakeholders] = useState([]);
  const [shLoading, setShLoading]     = useState(true);
  const [shFilter, setShFilter]       = useState("All");
  const [showAddSh, setShowAddSh]     = useState(false);
  const [editSh, setEditSh]           = useState(null);
  const [shForm, setShForm]           = useState({ name:"", role:"", email:"", type:"Internal — Engineering", influence:3, color:"#00d4ff" });

  /* Privacy */
  const [memLog, setMemLog]           = useState([]);
  const [privTogs, setPrivTogs]       = useState({ persist:true, learn:true, session:false, audit:true });

  /* PRD */
  const [prdInput, setPrdInput]       = useState("");
  const [prdStatus, setPrdStatus]     = useState("idle");
  const [prdResult, setPrdResult]     = useState(null);

  /* Agent runner state */
  const [agentRunning, setAgentRunning]   = useState(null); // which agent is running
  const [agentResult, setAgentResult]     = useState(null); // result to show in modal
  const [agentResultType, setAgentResultType] = useState(null); // which modal to show
  const [agentError, setAgentError]       = useState(null);
  const [digestInput, setDigestInput]     = useState({ show: false });
  const [updateInput, setUpdateInput]     = useState({ show: false, name: "", role: "" });

  /* Integrations */
  const [integrations, setIntegrations]   = useState([]);
  const [jiraIssues, setJiraIssues]       = useState([]);
  const [gmailThreads, setGmailThreads]   = useState([]);
  const [calendarEvents, setCalEvents]    = useState([]);
  const [syncingIntegration, setSyncing]  = useState(null);
  const [showCreateJira, setShowCreateJira] = useState(false);
  const [jiraForm, setJiraForm]           = useState({ summary:"", description:"", projectKey:"PM", priority:"med", issueType:"Task" });
  const [showAddCalEvent, setShowAddCalEvent] = useState(false);
  const [calForm, setCalForm]             = useState({ title:"", startTime:"", endTime:"", attendees:"", description:"" });
  const [agentRuns, setAgentRuns]         = useState([]);
  const [riceScores, setRiceScores]       = useState([]);

  /* ── Auth ─────────────────────────────────────────────────────────────── */
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* ── Fetch tasks ──────────────────────────────────────────────────────── */
  const loadTasks = useCallback(async () => {
    setTodosLoading(true);
    const { data } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
    if (data) setTodos(data);
    setTodosLoading(false);
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  useEffect(() => {
    const ch = supabase.channel("tasks-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "tasks" },
        payload => setTodos(p => [payload.new, ...p]))
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "tasks" },
        payload => setTodos(p => p.map(t => t.id === payload.new.id ? payload.new : t)))
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "tasks" },
        payload => setTodos(p => p.filter(t => t.id !== payload.old.id)))
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, []);

  /* ── Fetch projects ───────────────────────────────────────────────────── */
  const loadProjects = useCallback(async () => {
    setProjLoading(true);
    const { data } = await supabase.from("projects").select("*").order("created_at");
    if (data) setProjects(data);
    setProjLoading(false);
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  useEffect(() => {
    const ch = supabase.channel("projects-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => loadProjects())
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, [loadProjects]);

  /* ── Fetch meetings ───────────────────────────────────────────────────── */
  const loadMeetings = useCallback(async () => {
    setMeetLoading(true);
    const { data } = await supabase.from("meetings").select("*").order("meeting_time", { ascending: false });
    if (data) setMeetings(data);
    setMeetLoading(false);
  }, []);

  useEffect(() => { loadMeetings(); }, [loadMeetings]);

  /* ── Fetch OKRs ───────────────────────────────────────────────────────── */
  const loadOkrs = useCallback(async () => {
    setOkrsLoading(true);
    const { data: okrData } = await supabase.from("okrs").select("*").order("sort_order");
    if (okrData) {
      const withKRs = await Promise.all(okrData.map(async obj => {
        const { data: krs } = await supabase.from("key_results").select("*").eq("okr_id", obj.id).order("sort_order");
        return { ...obj, krs: krs || [] };
      }));
      setOkrs(withKRs);
      setExpandedOkr(withKRs.map((_,i) => i));
    }
    setOkrsLoading(false);
  }, []);

  useEffect(() => { loadOkrs(); }, [loadOkrs]);

  /* ── Fetch stakeholders ───────────────────────────────────────────────── */
  const loadStakeholders = useCallback(async () => {
    setShLoading(true);
    const { data } = await supabase.from("stakeholders").select("*, stakeholder_projects(project_id, projects(name))").order("name");
    if (data) setStakeholders(data.map(s => ({
      ...s,
      proj: s.stakeholder_projects?.map(sp => sp.projects?.name).filter(Boolean) || [],
    })));
    setShLoading(false);
  }, []);

  useEffect(() => { loadStakeholders(); }, [loadStakeholders]);

  /* ── Fetch memory log ─────────────────────────────────────────────────── */
  const loadMemory = useCallback(async () => {
    const { data } = await supabase.from("memory_log").select("*").order("created_at", { ascending: false });
    if (data) setMemLog(data);
  }, []);

  useEffect(() => { loadMemory(); }, [loadMemory]);

  /* ── Fetch user settings ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!user) return;
    supabase.from("user_settings").select("*").eq("user_id", user.id).single()
      .then(({ data }) => {
        if (data) setPrivTogs({ persist: data.persistent_memory, learn: data.agent_learning, session: data.session_only, audit: data.audit_log });
      });
  }, [user]);

  /* ── Fetch integrations ───────────────────────────────────────────────── */
  const loadIntegrations = useCallback(async () => {
    const { data } = await supabase.from("integrations").select("*");
    if (data) setIntegrations(data);
  }, []);

  const loadJiraIssues = useCallback(async () => {
    const { data } = await supabase.from("jira_issues").select("*").order("jira_updated_at", { ascending: false }).limit(50);
    if (data) setJiraIssues(data);
  }, []);

  const loadGmailThreads = useCallback(async () => {
    const { data } = await supabase.from("gmail_threads").select("*").order("received_at", { ascending: false }).limit(30);
    if (data) setGmailThreads(data);
  }, []);

  const loadCalendarEvents = useCallback(async () => {
    const { data } = await supabase.from("schedule_blocks").select("*").order("start_time");
    if (data) setCalEvents(data);
  }, []);

  const loadAgentRuns = useCallback(async () => {
    const { data } = await supabase.from("agent_runs").select("*").order("ran_at", { ascending: false }).limit(20);
    if (data) setAgentRuns(data);
  }, []);

  const loadRiceScores = useCallback(async () => {
    const { data } = await supabase.from("rice_scores").select("*").order("rice_score", { ascending: false });
    if (data) setRiceScores(data);
  }, []);

  useEffect(() => {
    loadIntegrations();
    loadJiraIssues();
    loadGmailThreads();
    loadCalendarEvents();
    loadAgentRuns();
    loadRiceScores();
  }, [loadIntegrations, loadJiraIssues, loadGmailThreads, loadCalendarEvents, loadAgentRuns, loadRiceScores]);

  // Realtime for integrations
  useEffect(() => {
    const ch = supabase.channel("integrations-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "integrations" }, () => loadIntegrations())
      .on("postgres_changes", { event: "*", schema: "public", table: "jira_issues" }, () => loadJiraIssues())
      .on("postgres_changes", { event: "*", schema: "public", table: "gmail_threads" }, () => loadGmailThreads())
      .on("postgres_changes", { event: "*", schema: "public", table: "schedule_blocks" }, () => loadCalendarEvents())
      .on("postgres_changes", { event: "*", schema: "public", table: "agent_runs" }, () => loadAgentRuns())
      .on("postgres_changes", { event: "*", schema: "public", table: "rice_scores" }, () => loadRiceScores())
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, [loadIntegrations, loadJiraIssues, loadGmailThreads, loadCalendarEvents, loadAgentRuns, loadRiceScores]);

  /* ── Integration sync functions ───────────────────────────────────────── */
  const syncJira = async (projectKey?: string) => {
    setSyncing("jira");
    const { data, error } = await supabase.functions.invoke("jira-sync", { body: { action: "pull", projectKey } });
    setSyncing(null);
    if (error) return alert("Jira sync failed: " + error.message);
    await Promise.all([loadJiraIssues(), loadTasks(), loadProjects(), loadIntegrations()]);
    alert(`Jira sync complete — ${data?.synced || 0} issues synced`);
  };

  const createJiraIssue = async () => {
    if (!jiraForm.summary.trim()) return;
    setSyncing("jira-create");
    const { data, error } = await supabase.functions.invoke("jira-sync", {
      body: { action: "create_issue", issueData: jiraForm },
    });
    setSyncing(null);
    if (error) return alert("Failed to create Jira issue: " + error.message);
    setShowCreateJira(false);
    setJiraForm({ summary:"", description:"", projectKey:"PM", priority:"med", issueType:"Task" });
    await Promise.all([loadJiraIssues(), loadTasks()]);
    alert(`Created ${data?.jira_key}`);
  };

  const syncWebex = async () => {
    setSyncing("webex");
    const { data, error } = await supabase.functions.invoke("webex-sync", { body: { action: "pull" } });
    setSyncing(null);
    if (error) return alert("Webex sync failed: " + error.message);
    await Promise.all([loadMeetings(), loadTasks(), loadIntegrations()]);
    alert(`Webex sync complete — ${data?.synced || 0} meetings synced`);
  };

  const syncGmail = async () => {
    setSyncing("gmail");
    const { data, error } = await supabase.functions.invoke("gmail-sync", { body: { action: "pull" } });
    setSyncing(null);
    if (error) return alert("Gmail sync failed: " + error.message);
    await Promise.all([loadGmailThreads(), loadTasks(), loadIntegrations()]);
    alert(`Gmail sync complete — ${data?.synced || 0} threads synced`);
  };

  const syncCalendar = async (date?: string) => {
    setSyncing("calendar");
    const { data, error } = await supabase.functions.invoke("calendar-sync", { body: { date } });
    setSyncing(null);
    if (error) return alert("Calendar sync failed: " + error.message);
    await Promise.all([loadCalendarEvents(), loadIntegrations()]);
    return data?.events || [];
  };

  const createCalendarEvent = async () => {
    if (!calForm.title.trim() || !calForm.startTime) return;
    setSyncing("cal-create");
    const date = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase.functions.invoke("calendar-sync", {
      body: {
        action: "create_event",
        title: calForm.title,
        startTime: `${date}T${calForm.startTime}:00`,
        endTime: `${date}T${calForm.endTime || calForm.startTime}:00`,
        attendees: calForm.attendees.split(",").map(e => e.trim()).filter(Boolean),
        description: calForm.description,
      },
    });
    setSyncing(null);
    if (error) return alert("Failed to create event: " + error.message);
    setShowAddCalEvent(false);
    setCalForm({ title:"", startTime:"", endTime:"", attendees:"", description:"" });
    await loadCalendarEvents();
    alert(`Event created! Meet link: ${data?.meet_link || "none"}`);
  };

  const markGmailRead = async (threadId) => {
    await supabase.functions.invoke("gmail-sync", { body: { action: "mark_read", threadId } });
    setGmailThreads(p => p.map(t => t.thread_id === threadId ? { ...t, is_read: true } : t));
  };

  const getIntegrationStatus = (name) => integrations.find(i => i.name === name) || { status: "disconnected" };

  /* ── Task CRUD ────────────────────────────────────────────────────────── */
  const toggleTodo = async (task) => {
    const newStatus = task.status === "done" ? "open" : "done";
    setTodos(p => p.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    await supabase.from("tasks").update({ status: newStatus }).eq("id", task.id);
  };

  const addTask = async () => {
    if (!newTask.title.trim()) return;
    await supabase.from("tasks").insert({
      title: newTask.title.trim(),
      priority: newTask.priority,
      status: "open",
      source: "manual",
      user_id: user?.id,
    });
    setNewTask({ title:"", priority:"med" });
    setShowAddTask(false);
  };

  const deleteTask = async (id) => {
    setTodos(p => p.filter(t => t.id !== id));
    await supabase.from("tasks").delete().eq("id", id);
  };

  /* ── Project CRUD ─────────────────────────────────────────────────────── */
  const openAddProj = () => {
    setProjForm({ name:"", owner:"", status:"planning", progress:0, due_date:"" });
    setEditProj(null);
    setShowAddProj(true);
  };

  const openEditProj = (p) => {
    setProjForm({ name: p.name, owner: p.owner||"", status: p.status, progress: p.progress, due_date: p.due_date||"" });
    setEditProj(p);
    setShowAddProj(true);
  };

  const saveProject = async () => {
    if (!projForm.name.trim()) return;
    const payload = { name: projForm.name.trim(), owner: projForm.owner, status: projForm.status, progress: Number(projForm.progress)||0, due_date: projForm.due_date||null };
    if (editProj) {
      await supabase.from("projects").update(payload).eq("id", editProj.id);
    } else {
      await supabase.from("projects").insert({ ...payload, user_id: user?.id });
    }
    setShowAddProj(false);
    loadProjects();
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    loadProjects();
  };

  /* ── Meeting CRUD ─────────────────────────────────────────────────────── */
  const saveMeeting = async () => {
    if (!meetForm.title.trim()) return;
    setMeetProcessing(true);
    const { data } = await supabase.from("meetings").insert({
      title: meetForm.title.trim(),
      meeting_time: meetForm.meeting_time || new Date().toISOString(),
      raw_transcript: meetForm.raw_transcript,
      user_id: user?.id,
    }).select().single();

    if (data && meetForm.raw_transcript.trim()) {
      const { data: result } = await supabase.functions.invoke("meeting-scribe", {
        body: { transcript: meetForm.raw_transcript, title: meetForm.title, meetingId: data.id },
      });
      if (result) await loadMeetings();
    }

    setMeetProcessing(false);
    setShowAddMeet(false);
    setMeetForm({ title:"", meeting_time:"", raw_transcript:"" });
    loadMeetings();
  };

  const deleteMeeting = async (id) => {
    await supabase.from("meetings").delete().eq("id", id);
    loadMeetings();
  };

  /* ── OKR CRUD ─────────────────────────────────────────────────────────── */
  const startEditKR = (kr) => {
    setEditingKR(kr.id);
    setKrEditVal(String(kr.current_val ?? 0));
  };

  const saveKR = async (kr) => {
    const newVal = parseFloat(krEditVal);
    if (isNaN(newVal)) { setEditingKR(null); return; }
    await supabase.from("key_results").update({ current_val: newVal }).eq("id", kr.id);
    setEditingKR(null);
    loadOkrs();
  };

  const toggleOkr = i => setExpandedOkr(p => p.includes(i) ? p.filter(x=>x!==i) : [...p,i]);

  /* ── Stakeholder CRUD ─────────────────────────────────────────────────── */
  const openAddSh = () => {
    setShForm({ name:"", role:"", email:"", type:"Internal — Engineering", influence:3, color:"#00d4ff" });
    setEditSh(null);
    setShowAddSh(true);
  };

  const openEditSh = (s) => {
    setShForm({ name: s.name, role: s.role||"", email: s.email||"", type: s.type||"", influence: s.influence||3, color: s.color||"#00d4ff" });
    setEditSh(s);
    setShowAddSh(true);
  };

  const saveSh = async () => {
    if (!shForm.name.trim()) return;
    const payload = { name: shForm.name.trim(), role: shForm.role, email: shForm.email, type: shForm.type, influence: Number(shForm.influence), color: shForm.color, initials: initials(shForm.name) };
    if (editSh) {
      await supabase.from("stakeholders").update(payload).eq("id", editSh.id);
    } else {
      await supabase.from("stakeholders").insert({ ...payload, user_id: user?.id });
    }
    setShowAddSh(false);
    loadStakeholders();
  };

  const deleteSh = async (id) => {
    await supabase.from("stakeholders").delete().eq("id", id);
    loadStakeholders();
  };

  const markContacted = async (id) => {
    await supabase.from("stakeholders").update({ last_contacted_at: new Date().toISOString() }).eq("id", id);
    loadStakeholders();
  };

  /* ── Privacy CRUD ─────────────────────────────────────────────────────── */
  const forgetMem = async (id) => {
    setMemLog(m => m.filter(x => x.id !== id));
    await supabase.from("memory_log").delete().eq("id", id);
  };

  const forgetAll = async () => {
    setMemLog([]);
    await supabase.from("memory_log").delete().eq("user_id", user?.id);
  };

  const togglePriv = async (key) => {
    const next = { ...privTogs, [key]: !privTogs[key] };
    setPrivTogs(next);
    await supabase.from("user_settings").upsert({
      user_id: user?.id,
      persistent_memory: next.persist,
      agent_learning: next.learn,
      session_only: next.session,
      audit_log: next.audit,
    });
  };

  /* ── PRD Agent ────────────────────────────────────────────────────────── */
  const runPRD = async () => {
    if (!prdInput.trim()) return;
    setPrdStatus("processing");
    try {
      const { data } = await supabase.functions.invoke("prd-agent", { body: { text: prdInput } });
      if (data) {
        setPrdResult({
          themes: data.themes?.map(t => ({ lbl: t.label, n: t.frequency })) || [],
          problem: data.problem_statement || "",
          stories: data.user_stories?.map(s => `As a ${s.role}, I want ${s.goal} so that ${s.outcome}.`) || [],
          criteria: data.acceptance_criteria || [],
          metrics: data.success_metrics?.map(m => `${m.metric}: ${m.baseline} → ${m.target}`) || [],
          questions: data.open_questions || [],
        });
        setPrdStatus("done");
      }
    } catch {
      setPrdStatus("idle");
      alert("PRD Agent failed. Check your Supabase edge function and API key.");
    }
  };

  /* ── Agent Runners ───────────────────────────────────────────────────── */
  const runAgent = async (agentName, body) => {
    setAgentRunning(agentName);
    setAgentError(null);
    setAgentResult(null);
    try {
      const { data, error } = await supabase.functions.invoke(agentName, { body });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      setAgentResult(data);
      setAgentResultType(agentName);
    } catch (err) {
      setAgentError(err.message);
      setAgentResultType("error");
    } finally {
      setAgentRunning(null);
    }
  };

  const runPrioritization = async () => {
    const items = projects.map(p => ({ title: p.name, description: `Status: ${p.status}, Progress: ${p.progress}%` }));
    if (!items.length) { setAgentError("No projects found. Add projects first."); setAgentResultType("error"); return; }
    await runAgent("prioritization", { items });
    loadProjects();
  };

  const runWeeklyDigest = () => runAgent("weekly-digest", {});

  const runRiskMonitor = async () => {
    await runAgent("risk-monitor", {});
    loadProjects();
    loadTasks();
  };

  const runStakeholderUpdate = (name, role) => {
    setUpdateInput({ show: false, name: "", role: "" });
    runAgent("stakeholder-update", { recipientName: name || undefined, recipientRole: role || undefined });
  };

  const closeAgentResult = () => {
    setAgentResult(null);
    setAgentResultType(null);
    setAgentError(null);
  };

  /* ── Derived data ─────────────────────────────────────────────────────── */
  const shProjects = ["All", ...Array.from(new Set(stakeholders.flatMap(s => s.proj)))];
  const filteredSh = shFilter === "All" ? stakeholders : stakeholders.filter(s => s.proj.includes(shFilter));
  const info = PAGE_INFO[page] || { title: page, sub: "" };

  /* ════════════════════════════════════════════════════════════════════════ */
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
                  <div key={it.id} className={`sb-item${page===it.id?" on":""}`} onClick={() => setPage(it.id)}>
                    <span className="sb-item-ic">{it.ic}</span>
                    <span>{it.lbl}</span>
                  </div>
                ))}
              </div>
            ))}
          </nav>
          <div className="sb-foot">
            <div className="sb-stat"><div className="sdot" style={{background:"var(--grn)",boxShadow:"0 0 4px var(--grn)"}}/><span>6 agents active</span></div>
            <div className="sb-stat"><div className="sdot" style={{background:"var(--acc)"}}/><span>{projects.length} projects</span></div>
            <div className="sb-stat"><div className="sdot" style={{background:"var(--amb)"}}/><span>{projects.filter(p=>p.status==="at-risk").length} at risk</span></div>
            <div className="sb-stat"><div className="sdot" style={{background:"var(--pur)"}}/><span>Q2 · Wk 3/13</span></div>
          </div>
        </aside>

        {/* ── Main ──────────────────────────────────────────────────────── */}
        <main className="main">
          <div className="ph">
            <div>
              <div className="ph-title">{info.title}</div>
              <div className="ph-sub">{info.sub}</div>
            </div>
            {user && <span className="mono dim" style={{fontSize:11}}>{user.email}</span>}
          </div>

          <div className="pb">

            {/* ══ WORKFLOWS ═══════════════════════════════════════════════ */}
            {page === "overview" && (
              <div className="col">
                <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:4}}>
                  {[["var(--grn)","Fully automatable"],["var(--amb)","AI-assisted"],["var(--bdr2)","Human-led"]].map(([c,l]) => (
                    <div key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--mut)"}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>{l}
                    </div>
                  ))}
                </div>
                <div className="ga">
                  {WORKFLOWS.map((w,i) => (
                    <div key={i} className={`wfc wf-${w.ai}`}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                        <div><div className="wf-title">{w.title}</div><div className="wf-cat">{w.cat}</div></div>
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

            {/* ══ SCHEDULE ════════════════════════════════════════════════ */}
            {page === "schedule" && (
              <div className="g2" style={{gridTemplateColumns:"1fr 260px"}}>
                <div className="card">
                  <div className="ch">
                    <div className="ct">Today · {new Date().toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}</div>
                    <div style={{display:"flex",gap:6}}>
                      <button className="btn btn-sm" onClick={() => syncCalendar()} disabled={syncingIntegration==="calendar"}>
                        {syncingIntegration==="calendar" ? <span className="spin" style={{width:12,height:12,borderWidth:1.5,display:"inline-block"}}/> : "⟳ Sync Calendar"}
                      </button>
                      <button className="btn btn-sm" onClick={() => setShowAddCalEvent(true)}>+ Add Event</button>
                    </div>
                  </div>
                  <div className="cb" style={{padding:"14px 16px 14px 14px"}}>
                    {calendarEvents.length === 0 && (
                      <div className="empty" style={{textAlign:"left"}}>
                        No events loaded. Click "Sync Calendar" to pull today's events from Google Calendar.
                      </div>
                    )}
                    <div className="tl-wrap">
                      {[...calendarEvents]
                        .sort((a,b) => (a.start_time||"").localeCompare(b.start_time||""))
                        .map((ev,i) => (
                        <div key={ev.id} className="tl-slot">
                          <div className="tl-time">{ev.start_time || "—"}</div>
                          <div>
                            <div className={`tl-ev ev-${ev.block_type || "meet"}`}>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                                <div className="ev-title">{ev.calendar_event_title || ev.label}</div>
                                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                                  {ev.meet_link && (
                                    <a href={ev.meet_link} target="_blank" rel="noopener noreferrer"
                                      style={{fontFamily:"DM Mono",fontSize:9,color:"var(--acc)",textDecoration:"none",padding:"1px 5px",border:"1px solid rgba(0,212,255,0.2)",borderRadius:3}}>
                                      Join
                                    </a>
                                  )}
                                  {ev.calendar_event_id && (
                                    <button className="btn btn-icon btn-danger" style={{width:18,height:18,fontSize:9,opacity:0.5}} title="Delete event"
                                      onClick={async () => {
                                        if (!window.confirm("Delete this calendar event?")) return;
                                        await supabase.functions.invoke("calendar-sync", { body: { action: "delete_event", eventId: ev.calendar_event_id } });
                                        await loadCalendarEvents();
                                      }}>✕</button>
                                  )}
                                </div>
                              </div>
                              <div className="ev-meta">
                                <span>{ev.start_time} – {ev.end_time}</span>
                                {ev.attendees?.length > 0 && <span className="dim" style={{fontSize:10}}>{ev.attendees.slice(0,2).join(", ")}{ev.attendees.length > 2 ? ` +${ev.attendees.length-2}` : ""}</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* Static protection blocks */}
                      {calendarEvents.filter(e => e.block_type === "deep").length === 0 && (
                        SCHEDULE.filter(s => s.type === "deep").map((ev,i) => (
                          <div key={`static-${i}`} className="tl-slot" style={{opacity:0.5}}>
                            <div className="tl-time">{ev.t}</div>
                            <div><div className="tl-ev ev-deep">
                              <div className="ev-title">{ev.title}</div>
                              <div className="ev-meta"><span>{ev.desc}</span><span className="ev-ai-tag">🤖 {ev.ai}</span></div>
                            </div></div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card">
                    <div className="ch"><div className="ct">Day at a Glance</div></div>
                    <div className="cb">
                      <div className="g2" style={{gap:8,marginBottom:14}}>
                        {[
                          [calendarEvents.filter(e=>e.block_type==="meet").length.toString(),"Meetings"],
                          [calendarEvents.filter(e=>e.block_type==="deep").length + "h","Deep Work"],
                          [calendarEvents.length.toString(),"Total Events"],
                          [calendarEvents.filter(e=>e.meet_link).length.toString(),"Have Meet Link"],
                        ].map(([v,l]) => (
                          <div key={l} style={{background:"var(--surf2)",border:"1px solid var(--bdr)",borderRadius:7,padding:"9px 11px"}}>
                            <div style={{fontFamily:"Syne",fontWeight:800,fontSize:20,color:"var(--acc)",lineHeight:1}}>{v}</div>
                            <div style={{fontSize:10,color:"var(--mut)",marginTop:3}}>{l}</div>
                          </div>
                        ))}
                      </div>
                      <div className="section-lbl">Calendar Status</div>
                      <div style={{fontSize:12,color:"var(--mut)"}}>
                        {getIntegrationStatus("google_calendar").status === "connected"
                          ? `Last synced: ${new Date(getIntegrationStatus("google_calendar").last_synced_at).toLocaleTimeString()}`
                          : "Not synced. Click ⟳ to connect Google Calendar."}
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="ch"><div className="ct">AI Time Protections</div></div>
                    <div className="cb">
                      {[["8:00–9:30","Deep Work","AI declines invites automatically"],["12:30–13:30","Lunch","Calendar blocked, auto-decline on"],["14:30–16:00","PRD Writing","Focus mode, Slack DND active"]].map(([t,l,n],i) => (
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
                </div>
              </div>
            )}

            {/* ══ TO-DO ════════════════════════════════════════════════════ */}
            {page === "todos" && (
              <div className="g2" style={{gridTemplateColumns:"1fr 240px"}}>
                <div className="card">
                  <div className="ch">
                    <div className="ct">Focus List · Today</div>
                    <button className="btn btn-sm" onClick={() => setShowAddTask(!showAddTask)}>+ Add Task</button>
                  </div>
                  {showAddTask && (
                    <div className="add-row">
                      <input className="input input-sm" style={{flex:1}} placeholder="Task title..." value={newTask.title} onChange={e => setNewTask(p => ({...p,title:e.target.value}))} onKeyDown={e => e.key==="Enter" && addTask()} autoFocus/>
                      <select className="input input-sm select" style={{width:80}} value={newTask.priority} onChange={e => setNewTask(p => ({...p,priority:e.target.value}))}>
                        <option value="high">High</option>
                        <option value="med">Med</option>
                        <option value="low">Low</option>
                      </select>
                      <button className="btn btn-primary btn-sm" onClick={addTask}>Add</button>
                      <button className="btn btn-sm" onClick={() => setShowAddTask(false)}>✕</button>
                    </div>
                  )}
                  <div className="cb">
                    {todosLoading && <div className="loading"><div className="spin"/>Loading tasks...</div>}
                    {!todosLoading && todos.length === 0 && <div className="empty">No tasks yet. Click + Add Task to get started.</div>}
                    {!todosLoading && (
                      <div className="col" style={{gap:6}}>
                        {todos.map(t => (
                          <div key={t.id} className="todo-item">
                            <div className={`todo-chk${t.status==="done"?" dn":""}`} onClick={() => toggleTodo(t)}>
                              {t.status==="done" ? "✓" : ""}
                            </div>
                            <span className={`todo-txt${t.status==="done"?" dn":""}`}>{t.title}</span>
                            {t.ai_note && <span className="ai-note">🤖 {t.ai_note}</span>}
                            <span className={`tag ${t.priority==="high"?"tag-red":t.priority==="med"?"tag-amb":"tag-grn"}`}>{t.priority}</span>
                            <button className="btn btn-icon btn-danger btn-sm" onClick={() => deleteTask(t.id)} title="Delete">✕</button>
                          </div>
                        ))}
                      </div>
                    )}
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
                    <div className="ch"><div className="ct">Summary</div></div>
                    <div className="cb">
                      {[
                        ["Total tasks", todos.length],
                        ["Open",        todos.filter(t => t.status==="open").length],
                        ["Done",        todos.filter(t => t.status==="done").length],
                        ["High priority",todos.filter(t => t.priority==="high" && t.status==="open").length],
                      ].map(([l,v]) => (
                        <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid var(--bdr)",fontSize:12}}>
                          <span style={{color:"var(--mut)"}}>{l}</span>
                          <span className="mono acc" style={{fontSize:11}}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ PROJECTS ════════════════════════════════════════════════ */}
            {page === "tracker" && (
              <div className="col">
                <div className="card">
                  <div className="ch">
                    <div className="ct">Active Projects · Q2 2025</div>
                    <button className="btn btn-sm" onClick={openAddProj}>+ Add Project</button>
                  </div>
                  <div className="th-row" style={{gridTemplateColumns:"1fr 1fr 90px 130px 60px 80px"}}>
                    <span>Project</span><span>Progress</span><span>Status</span><span>Owner</span><span>Due</span><span></span>
                  </div>
                  {projLoading && <div className="loading"><div className="spin"/>Loading...</div>}
                  {!projLoading && projects.length === 0 && <div className="empty">No projects yet. Click + Add Project.</div>}
                  {projects.map((p,i) => (
                    <div key={p.id} className="tr" style={{gridTemplateColumns:"1fr 1fr 90px 130px 60px 80px"}}>
                      <span style={{fontWeight:500,cursor:"pointer"}} onClick={() => openEditProj(p)}>{p.name}</span>
                      <div className="bar-wrap">
                        <div className="bar-track"><div className="bar-fill" style={{width:`${p.progress}%`,background:BAR_COLOR[p.status]}}/></div>
                        <span className="bar-pct">{p.progress}%</span>
                      </div>
                      <span className={`tag ${STATUS_COLOR[p.status]}`}>{p.status?.replace("-"," ")}</span>
                      <span className="dim" style={{fontSize:12}}>{p.owner}</span>
                      <span className="mono dim" style={{fontSize:11}}>{p.due_date ? new Date(p.due_date).toLocaleDateString("en-GB",{day:"numeric",month:"short"}) : "—"}</span>
                      <div style={{display:"flex",gap:4}}>
                        <button className="btn btn-icon btn-sm" onClick={() => openEditProj(p)} title="Edit">✎</button>
                        <button className="btn btn-icon btn-danger btn-sm" onClick={() => deleteProject(p.id)} title="Delete">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
                {projects.filter(p=>p.status==="delayed"||p.status==="at-risk").length > 0 && (
                  <div className="infobox ib-red" style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <span style={{fontSize:18}}>🔔</span>
                    <div>
                      <div style={{fontFamily:"Syne",fontWeight:700,fontSize:13,color:"var(--red)",marginBottom:3}}>Risk Agent Alert</div>
                      <div style={{fontSize:12,color:"var(--mut)",lineHeight:1.6}}>
                        {projects.filter(p=>p.status==="delayed"||p.status==="at-risk").map(p=>p.name).join(", ")} {projects.filter(p=>p.status==="delayed").length > 0 ? "is delayed." : "is at risk."} Review and replan sprint priorities.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ══ MEETINGS ════════════════════════════════════════════════ */}
            {page === "meetings" && (
              <div className="g2">
                <div className="col">
                  <div className="card">
                    <div className="ch">
                      <div className="ct">Meetings</div>
                      <button className="btn btn-sm" onClick={() => setShowAddMeet(true)}>+ New Meeting</button>
                    </div>
                    <div className="cb0">
                      {meetLoading && <div className="loading"><div className="spin"/>Loading...</div>}
                      {!meetLoading && meetings.length === 0 && <div className="empty">No meetings yet. Add one to get started.</div>}
                      {meetings.map((m,i) => (
                        <div key={m.id} style={{padding:"14px 16px",borderBottom:i<meetings.length-1?"1px solid var(--bdr)":"none"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                            <span style={{fontFamily:"Syne",fontWeight:700,fontSize:13}}>{m.title}</span>
                            <div style={{display:"flex",gap:6,alignItems:"center"}}>
                              <span className="mono dim" style={{fontSize:11}}>{m.meeting_time ? new Date(m.meeting_time).toLocaleDateString() : "—"}</span>
                              <button className="btn btn-icon btn-danger btn-sm" onClick={() => deleteMeeting(m.id)} title="Delete">✕</button>
                            </div>
                          </div>
                          {m.summary && (
                            <>
                              <div className="section-lbl" style={{marginBottom:6}}>Summary</div>
                              <p style={{fontSize:12,color:"var(--mut)",lineHeight:1.6,marginBottom:8}}>{m.summary}</p>
                            </>
                          )}
                          {m.action_items && m.action_items.length > 0 && (
                            <>
                              <div className="section-lbl" style={{marginBottom:6}}>Action Items</div>
                              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                                {m.action_items.map((a,j) => (
                                  <span key={j} className="tag tag-blu">{typeof a === "string" ? a : a.text}</span>
                                ))}
                              </div>
                            </>
                          )}
                          {!m.summary && !m.action_items && (
                            <div style={{fontSize:12,color:"var(--mut)"}}>Transcript saved. Agent processing pending.</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="ch"><div className="ct">Agent Meeting Flow</div></div>
                  <div className="cb0">
                    {[["Record","Meeting auto-recorded via Zoom/Webex integration"],["Transcribe","Whisper converts audio to text in real-time"],["Summarize","Claude generates structured summary in ~30 seconds"],["Extract","Decisions, action items, open questions pulled out"],["Assign","Each action item gets owner, due date, priority"],["Sync","Jira/Linear updated. Slack summary sent to team"]].map(([t,d],i,a) => (
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

            {/* ══ PRIORITIZATION ══════════════════════════════════════════ */}
            {page === "priority" && (
              <div className="col">
                <div className="g2">
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
                        ].map((q,i) => (
                          <div key={i} style={{background:q.c,border:`1px solid ${q.bc}`,borderRadius:8,padding:12,display:"flex",flexDirection:"column",gap:4}}>
                            <div style={{fontFamily:"Syne",fontSize:11,fontWeight:700}}>{q.label}</div>
                            <div style={{fontSize:10,color:"var(--mut)"}}>{q.sub}</div>
                            <div style={{marginTop:"auto"}}>
                              {q.items.map((it,j) => <div key={j} style={{fontSize:10,color:"var(--mut)",display:"flex",gap:4}}><span style={{opacity:0.4}}>—</span>{it}</div>)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="ch">
                      <div className="ct">RICE Score · AI-Calculated</div>
                      <button className="btn btn-sm" onClick={async () => {
                        const items = projects.map(p => ({ title: p.name, description: `Status: ${p.status}, Progress: ${p.progress}%` }));
                        const { data } = await supabase.functions.invoke("prioritization", { body: { items } });
                        await loadRiceScores();
                        alert(data?.summary || "Scoring complete.");
                      }}>⚡ Score Backlog</button>
                    </div>
                    <div className="th-row" style={{gridTemplateColumns:"1fr 32px 32px 32px 32px 80px"}}>
                      <span>Feature</span><span>R</span><span>I</span><span>C</span><span>E</span><span>Score</span>
                    </div>
                    {(riceScores.length > 0 ? riceScores : RICE_STATIC.map(r => ({...r, rice_score: r.score, title: r.name}))).sort((a,b) => b.rice_score-a.rice_score).map((it,i) => (
                      <div key={i} className="tr" style={{gridTemplateColumns:"1fr 32px 32px 32px 32px 80px"}}>
                        <div>
                          <span style={{fontWeight:500,fontSize:12}}>{it.title || it.name}</span>
                          {it.reasoning && <div style={{fontSize:10,color:"var(--mut)",marginTop:2}}>{it.reasoning}</div>}
                        </div>
                        {[it.reach ?? it.r, it.impact ?? it.i, it.confidence ?? it.c, it.effort ?? it.e].map((v,j) => <span key={j} className="mono dim" style={{fontSize:11}}>{v}</span>)}
                        <div className="bar-wrap">
                          <div className="bar-track"><div className="bar-fill" style={{width:`${(it.rice_score/130)*100}%`,background:`hsl(${it.rice_score+80},60%,58%)`}}/></div>
                          <span className="mono acc" style={{fontSize:11,width:22,textAlign:"right"}}>{Math.round(it.rice_score)}</span>
                        </div>
                      </div>
                    ))}
                    <div style={{margin:"12px 16px"}} className="infobox ib-blue">
                      🤖 <strong className="acc">Agent insight:</strong> <span style={{fontSize:11,color:"var(--mut)"}}>{riceScores.length > 0 ? `${riceScores[0]?.title} is your highest RICE score item. Run Score Backlog to refresh.` : "Click Score Backlog to run AI-powered RICE analysis on your projects."}</span>
                    </div>
                  </div>
                </div>
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
                      ].map((col,i) =>
                        col === null
                          ? <div key={i} style={{background:"var(--bdr)",borderRadius:1}}/>
                          : <div key={i}>
                              <div style={{fontFamily:"Syne",fontWeight:700,fontSize:12,color:col.col,marginBottom:8}}>{col.label}</div>
                              <div className="col" style={{gap:5}}>
                                {col.items.map((it,j) => <div key={j} style={{fontSize:11,padding:"7px 9px",background:col.bg,border:`1px solid ${col.bdr}`,borderRadius:7}}>{it}</div>)}
                              </div>
                            </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ OKR TRACKER ═════════════════════════════════════════════ */}
            {page === "okr" && (
              <div className="col">
                <div className="g4">
                  {[
                    {v:`${okrs.length > 0 ? Math.round(okrs.reduce((s,o)=>s+o.overall_pct,0)/okrs.length) : 0}%`,l:"Overall Q2 Progress",c:"var(--acc)"},
                    {v:`${okrs.flatMap(o=>o.krs||[]).filter(kr=>kr.status==="on-track").length}/${okrs.flatMap(o=>o.krs||[]).length}`,l:"KRs On Track",c:"var(--grn)"},
                    {v:`${okrs.flatMap(o=>o.krs||[]).filter(kr=>kr.status==="at-risk").length}/${okrs.flatMap(o=>o.krs||[]).length}`,l:"KRs At Risk",c:"var(--amb)"},
                    {v:"10",l:"Weeks Remaining",c:"var(--mut)"},
                  ].map(({v,l,c}) => (
                    <div key={l} className="kpi"><div className="kpi-v" style={{color:c}}>{v}</div><div className="kpi-l">{l}</div></div>
                  ))}
                </div>
                {okrsLoading && <div className="loading"><div className="spin"/>Loading OKRs...</div>}
                <div className="col">
                  {okrs.map((obj,oi) => (
                    <div key={obj.id} className="okr-blk">
                      <div className="okr-hd" onClick={() => toggleOkr(oi)}>
                        <div className="okr-ico" style={{background:`${obj.color}18`,border:`1px solid ${obj.color}30`}}>{obj.icon}</div>
                        <div style={{flex:1}}>
                          <div className="okr-obj">{obj.objective}</div>
                          <div className="okr-own">{obj.owner}</div>
                        </div>
                        <div style={{textAlign:"right",marginLeft:12}}>
                          <div className="okr-pct" style={{color:obj.color}}>{obj.overall_pct}%</div>
                          <div className="okr-plbl">progress</div>
                        </div>
                        <span style={{marginLeft:12,fontSize:14,color:"var(--mut)"}}>{expandedOkr.includes(oi)?"▾":"▸"}</span>
                      </div>
                      <div className="okr-bar"><div className="okr-bf" style={{width:`${obj.overall_pct}%`,background:obj.color}}/></div>
                      {expandedOkr.includes(oi) && (obj.krs||[]).map(kr => {
                        const pct = kr.invert
                          ? Math.max(0,Math.min(100,Math.round(((kr.target_val*2-kr.current_val)/(kr.target_val*2))*100)))
                          : Math.max(0,Math.min(100,Math.round((kr.current_val/kr.target_val)*100)));
                        return (
                          <div key={kr.id} className="kr-row">
                            <div className="kr-name">{kr.name}</div>
                            <div className="kr-bars">
                              <div className="kr-bar"><div className="kr-fill" style={{width:`${pct}%`,background:KR_COLOR[kr.status]}}/></div>
                              <div className="kr-nums">
                                <span>Current: <strong style={{color:"var(--txt)"}}>{kr.current_val}{kr.unit}</strong></span>
                                <span>Target: {kr.target_val}{kr.unit}</span>
                              </div>
                            </div>
                            <div className="kr-edit-wrap">
                              <span className={`tag ${KR_TAG[kr.status]}`}>{kr.status?.replace("-"," ")}</span>
                              {editingKR === kr.id ? (
                                <>
                                  <input className="input input-sm kr-edit-input" value={krEditVal} onChange={e => setKrEditVal(e.target.value)} onKeyDown={e => e.key==="Enter" && saveKR(kr)} autoFocus/>
                                  <button className="btn btn-primary btn-sm" onClick={() => saveKR(kr)}>✓</button>
                                  <button className="btn btn-sm" onClick={() => setEditingKR(null)}>✕</button>
                                </>
                              ) : (
                                <button className="btn btn-sm" onClick={() => startEditKR(kr)} title="Update current value">✎</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
                {okrs.length === 0 && !okrsLoading && (
                  <div className="empty">No OKRs found. Add them via Supabase Table Editor or the seed SQL.</div>
                )}
                <div className="infobox ib-blue">
                  🤖 <strong className="acc">Weekly AI Insight:</strong> At current velocity, D7 activation will reach ~46% by end of Q2 — 4pp short of target. Shipping the onboarding flow by Apr 30 is critical. B2B Dashboard is the highest delivery risk this quarter.
                </div>
              </div>
            )}

            {/* ══ AI AGENTS ═══════════════════════════════════════════════ */}
            {page === "agents" && (
              <div className="col">
                {agentError && (
                  <div className="infobox ib-red" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:12}}>⚠️ {agentError}</span>
                    <button className="btn btn-sm" onClick={() => setAgentError(null)}>✕</button>
                  </div>
                )}

                <div className="ga">

                  {/* ── Meeting Scribe ── */}
                  <div className="agc">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div className="ag-icon ic-pur">🎙️</div>
                      <span className="tag tag-grn" style={{fontSize:9}}>● Active</span>
                    </div>
                    <div className="ag-name">Meeting Scribe Agent</div>
                    <div className="ag-trig">After every meeting ends</div>
                    <div className="ag-desc">Transcribes meetings, extracts decisions and action items, auto-creates tasks in your tracker. Saves structured summary to the Meetings tab.</div>
                    <div className="chips" style={{marginBottom:12}}>{["Webex transcript","Calendar context","Jira API"].map((inp,j) => <span key={j} className="chip">{inp}</span>)}</div>
                    <button className="btn btn-primary" style={{width:"100%"}} onClick={() => setPage("meetings")}>
                      ▶ Go to Meetings tab to run
                    </button>
                    {meetings.length > 0 && (
                      <div style={{marginTop:8,fontSize:11,color:"var(--mut)",fontFamily:"DM Mono"}}>
                        Last run: {meetings[0]?.processed_at ? new Date(meetings[0].processed_at).toLocaleDateString() : "pending"}
                      </div>
                    )}
                  </div>

                  {/* ── Prioritization ── */}
                  <div className="agc">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div className="ag-icon ic-blu">🧠</div>
                      <span className="tag tag-grn" style={{fontSize:9}}>● Active</span>
                    </div>
                    <div className="ag-name">Prioritization Agent</div>
                    <div className="ag-trig">Every sprint planning session</div>
                    <div className="ag-desc">Scores your entire project backlog using the RICE framework, cross-references Q2 OKRs, and surfaces the top items to work on with one-sentence reasoning for each.</div>
                    <div className="chips" style={{marginBottom:12}}>{["Projects backlog","OKR alignment","Capacity data"].map((inp,j) => <span key={j} className="chip">{inp}</span>)}</div>
                    <button
                      className="btn btn-primary"
                      style={{width:"100%"}}
                      disabled={agentRunning === "prioritization"}
                      onClick={runPrioritization}
                    >
                      {agentRunning === "prioritization"
                        ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span className="spin" style={{width:13,height:13,borderWidth:1.5}}/>Scoring backlog...</span>
                        : `⚡ Score Backlog (${projects.length} projects)`}
                    </button>
                  </div>

                  {/* ── Weekly Digest ── */}
                  <div className="agc">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div className="ag-icon ic-grn">📊</div>
                      <span className="tag tag-grn" style={{fontSize:9}}>● Active</span>
                    </div>
                    <div className="ag-name">Weekly Digest Agent</div>
                    <div className="ag-trig">Every Monday 8am</div>
                    <div className="ag-desc">Aggregates live project data, open tasks, and recent meeting summaries into an executive-ready Monday morning briefing with top 3 priorities and decisions needed.</div>
                    <div className="chips" style={{marginBottom:12}}>{["Projects","Open tasks","Recent meetings"].map((inp,j) => <span key={j} className="chip">{inp}</span>)}</div>
                    <button
                      className="btn btn-primary"
                      style={{width:"100%"}}
                      disabled={agentRunning === "weekly-digest"}
                      onClick={runWeeklyDigest}
                    >
                      {agentRunning === "weekly-digest"
                        ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span className="spin" style={{width:13,height:13,borderWidth:1.5}}/>Generating digest...</span>
                        : "⚡ Generate Weekly Digest"}
                    </button>
                  </div>

                  {/* ── Risk Monitor ── */}
                  <div className="agc">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div className="ag-icon ic-amb">🔔</div>
                      <span className="tag tag-grn" style={{fontSize:9}}>● Active</span>
                    </div>
                    <div className="ag-name">Risk & Blocker Agent</div>
                    <div className="ag-trig">Continuous monitoring</div>
                    <div className="ag-desc">Scans all active projects and overdue tasks for risk signals. Flags at-risk items, auto-updates project status, and creates high-priority alert tasks for immediate blockers.</div>
                    <div className="chips" style={{marginBottom:12}}>{["Projects","Overdue tasks","Sprint velocity"].map((inp,j) => <span key={j} className="chip">{inp}</span>)}</div>
                    <button
                      className="btn btn-primary"
                      style={{width:"100%"}}
                      disabled={agentRunning === "risk-monitor"}
                      onClick={runRiskMonitor}
                    >
                      {agentRunning === "risk-monitor"
                        ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span className="spin" style={{width:13,height:13,borderWidth:1.5}}/>Scanning projects...</span>
                        : "⚡ Run Risk Scan"}
                    </button>
                  </div>

                  {/* ── Stakeholder Update ── */}
                  <div className="agc">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div className="ag-icon ic-blu">📝</div>
                      <span className="tag tag-grn" style={{fontSize:9}}>● Active</span>
                    </div>
                    <div className="ag-name">Stakeholder Update Agent</div>
                    <div className="ag-trig">Every Friday 3pm</div>
                    <div className="ag-desc">Pulls live project status, completed tasks, and high-priority open items to write a polished stakeholder update email tailored to the recipient's level of detail.</div>
                    <div className="chips" style={{marginBottom:12}}>{["Projects","Completed tasks","High priority items"].map((inp,j) => <span key={j} className="chip">{inp}</span>)}</div>
                    {!updateInput.show ? (
                      <button
                        className="btn btn-primary"
                        style={{width:"100%"}}
                        disabled={agentRunning === "stakeholder-update"}
                        onClick={() => setUpdateInput(p => ({...p, show: true}))}
                      >
                        {agentRunning === "stakeholder-update"
                          ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span className="spin" style={{width:13,height:13,borderWidth:1.5}}/>Drafting email...</span>
                          : "⚡ Draft Stakeholder Update"}
                      </button>
                    ) : (
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                        <input className="input input-sm" placeholder="Recipient name (optional)" value={updateInput.name} onChange={e => setUpdateInput(p=>({...p,name:e.target.value}))}/>
                        <input className="input input-sm" placeholder="Recipient role (optional)" value={updateInput.role} onChange={e => setUpdateInput(p=>({...p,role:e.target.value}))}/>
                        <div style={{display:"flex",gap:6}}>
                          <button className="btn btn-primary" style={{flex:1}} onClick={() => runStakeholderUpdate(updateInput.name, updateInput.role)}>Generate</button>
                          <button className="btn" onClick={() => setUpdateInput({show:false,name:"",role:""})}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── PRD Agent ── */}
                  <div className="agc">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div className="ag-icon ic-pur">📄</div>
                      <span className="tag tag-grn" style={{fontSize:9}}>● Active</span>
                    </div>
                    <div className="ag-name">PRD Agent</div>
                    <div className="ag-trig">On demand — focus group data</div>
                    <div className="ag-desc">Takes raw focus group transcripts and survey exports, clusters themes by frequency, extracts pain points, and writes a structured PRD with user stories, acceptance criteria, and success metrics.</div>
                    <div className="chips" style={{marginBottom:12}}>{["Transcripts","Survey exports","Feedback CSVs"].map((inp,j) => <span key={j} className="chip">{inp}</span>)}</div>
                    <button className="btn btn-primary" style={{width:"100%"}} onClick={() => setPage("prd")}>
                      ▶ Go to PRD Agent tab
                    </button>
                  </div>

                </div>

                {/* Tech Stack */}
                <div className="card">
                  <div className="ch"><div className="ct">Recommended Tech Stack</div></div>
                  <div className="cb">
                    <div className="g3" style={{gap:8}}>
                      {[["LLM","Claude API (Sonnet)"],["Orchestration","Supabase Edge Functions"],["Database","Supabase Postgres"],["Auth","Supabase Auth"],["Storage","Supabase Storage"],["Realtime","Supabase Realtime"]].map(([l,v]) => (
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

            {/* ══ PRD AGENT ═══════════════════════════════════════════════ */}
            {page === "prd" && (
              <div className="g2">
                <div className="col">
                  <div className="card">
                    <div className="ch"><div className="ct">Input — Focus Group Data</div></div>
                    <div className="cb">
                      {prdStatus !== "done" ? (
                        <>
                          <div className="upload-z" style={{marginBottom:12}} onClick={() => document.getElementById('pf').click()}>
                            <div style={{fontSize:28,marginBottom:8}}>📎</div>
                            <div style={{fontFamily:"Syne",fontWeight:700,fontSize:13,marginBottom:3}}>Drop files or click to upload</div>
                            <div style={{fontSize:12,color:"var(--mut)"}}>Supports .txt .csv .docx .pdf</div>
                            <input id="pf" type="file" style={{display:"none"}} onChange={async e => {
                              const file = e.target.files[0];
                              if (file) { const text = await file.text(); setPrdInput(text); }
                            }}/>
                          </div>
                          <div className="section-lbl">Or paste raw text</div>
                          <textarea className="input" value={prdInput} onChange={e => setPrdInput(e.target.value)}
                            placeholder={`Paste focus group transcript or survey responses...\n\nExample:\n"Participant 3: Onboarding took 45 minutes..."\n"Survey: 18 of 32 said onboarding was #1 pain point..."`}
                            style={{minHeight:180,resize:"vertical",marginBottom:10}}/>
                          <button onClick={runPRD} disabled={!prdInput.trim() || prdStatus==="processing"}
                            style={{width:"100%",padding:"10px 0",background:prdInput.trim()?"var(--acc)":"var(--bdr)",color:prdInput.trim()?"#000":"var(--mut)",border:"none",borderRadius:8,fontFamily:"Syne",fontWeight:700,fontSize:13,cursor:prdInput.trim()?"pointer":"default",transition:"all 0.2s"}}>
                            {prdStatus==="processing" ? "Analysing..." : "⚡ Generate PRD"}
                          </button>
                          {prdStatus==="processing" && (
                            <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12,fontSize:12,color:"var(--mut)"}}>
                              <div className="spin"/>Clustering themes, extracting pain points, writing PRD...
                            </div>
                          )}
                        </>
                      ) : (
                        <div>
                          <div style={{fontSize:12,color:"var(--grn)",marginBottom:10,fontFamily:"DM Mono"}}>✓ Processed {prdInput.split(' ').length} words</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
                            {prdResult.themes.map((t,i) => <span key={i} className="tag tag-blu">{t.lbl} <span style={{opacity:0.6}}>×{t.n}</span></span>)}
                          </div>
                          <div className="section-lbl" style={{marginBottom:8}}>Theme Frequency</div>
                          {prdResult.themes.map((t,i) => (
                            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"5px 0",borderBottom:i<prdResult.themes.length-1?"1px solid var(--bdr)":"none"}}>
                              <span style={{fontSize:12,flex:1}}>{t.lbl}</span>
                              <div style={{width:70,height:3,background:"var(--bdr2)",borderRadius:2,overflow:"hidden"}}>
                                <div style={{height:"100%",width:`${(t.n/18)*100}%`,background:"var(--acc)",borderRadius:2}}/>
                              </div>
                              <span className="mono dim" style={{fontSize:11,width:18,textAlign:"right"}}>{t.n}</span>
                            </div>
                          ))}
                          <button onClick={() => { setPrdStatus("idle"); setPrdInput(""); setPrdResult(null); }}
                            style={{marginTop:12,fontSize:11,fontFamily:"DM Mono",padding:"4px 10px",border:"1px solid var(--bdr)",borderRadius:6,background:"transparent",color:"var(--mut)",cursor:"pointer"}}>
                            ↺ New input
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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
                        <div className="prd-sec"><div className="prd-lbl">Problem Statement</div><p style={{fontSize:12,lineHeight:1.7}}>{prdResult.problem}</p></div>
                        <div className="prd-sec"><div className="prd-lbl">User Stories</div>{prdResult.stories.map((s,i) => <div key={i} className="story">{s}</div>)}</div>
                        <div className="prd-sec"><div className="prd-lbl">Acceptance Criteria</div>
                          {prdResult.criteria.map((c,i) => (
                            <div key={i} style={{display:"flex",gap:7,fontSize:12,marginBottom:4,alignItems:"flex-start"}}>
                              <span style={{color:"var(--grn)",flexShrink:0,marginTop:1}}>✓</span>{c}
                            </div>
                          ))}
                        </div>
                        <div className="prd-sec"><div className="prd-lbl">Success Metrics</div>
                          {prdResult.metrics.map((m,i) => (
                            <div key={i} style={{fontSize:12,padding:"3px 0",borderBottom:i<prdResult.metrics.length-1?"1px solid rgba(28,43,64,0.3)":"none",display:"flex",gap:7,alignItems:"center"}}>
                              <div style={{width:3,height:3,borderRadius:"50%",background:"var(--acc)",flexShrink:0}}/>{m}
                            </div>
                          ))}
                        </div>
                        <div className="prd-sec"><div className="prd-lbl">Open Questions</div>
                          {prdResult.questions.map((q,i) => (
                            <div key={i} style={{fontSize:12,padding:"3px 0",color:"var(--amb)",display:"flex",gap:6}}>
                              <span style={{flexShrink:0}}>?</span>{q}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{padding:"11px 16px",borderTop:"1px solid var(--bdr)"}}>
                        <div className="section-lbl" style={{marginBottom:7}}>Export</div>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                          {["Confluence","Notion","Markdown","Copy"].map((f,i) => (
                            <button key={i} className="xbtn" onClick={() => {
                              if (f === "Copy" || f === "Markdown") {
                                const md = `# ${prdResult.problem}\n\n## User Stories\n${prdResult.stories.map(s=>`- ${s}`).join("\n")}\n\n## Acceptance Criteria\n${prdResult.criteria.map(c=>`- [ ] ${c}`).join("\n")}\n\n## Success Metrics\n${prdResult.metrics.map(m=>`- ${m}`).join("\n")}`;
                                navigator.clipboard.writeText(md).then(() => alert("Copied to clipboard!"));
                              }
                            }}>{f}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══ STAKEHOLDERS ════════════════════════════════════════════ */}
            {page === "stakeholders" && (
              <div className="col">
                <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                  {shProjects.map(p => (
                    <button key={p} onClick={() => setShFilter(p)} style={{fontFamily:"DM Mono",fontSize:10,padding:"4px 12px",borderRadius:100,cursor:"pointer",border:`1px solid ${shFilter===p?"var(--acc)":"var(--bdr)"}`,background:shFilter===p?"rgba(0,212,255,0.07)":"var(--surf)",color:shFilter===p?"var(--acc)":"var(--mut)",transition:"all 0.13s"}}>{p}</button>
                  ))}
                  <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                    {[{n:`${filteredSh.length} people`,c:"var(--acc)"},{n:`${filteredSh.filter(s=>contactAge(s.last_contacted_at)==="stale").length} need contact`,c:"var(--red)"},{n:`${filteredSh.filter(s=>s.influence>=4).length} high influence`,c:"var(--pur)"}].map(({n,c}) => (
                      <span key={n} style={{fontFamily:"DM Mono",fontSize:10,padding:"4px 10px",borderRadius:100,background:"var(--surf)",border:"1px solid var(--bdr)",color:c}}>{n}</span>
                    ))}
                    <button className="btn btn-sm" onClick={openAddSh}>+ Add</button>
                  </div>
                </div>
                <div className="card">
                  <div className="th-row" style={{gridTemplateColumns:"200px 110px 190px 1fr 80px 90px 90px"}}>
                    <span>Name</span><span>Type</span><span>Email</span><span>Projects</span><span>Influence</span><span>Last Contact</span><span></span>
                  </div>
                  {shLoading && <div className="loading"><div className="spin"/>Loading...</div>}
                  {!shLoading && filteredSh.length === 0 && <div className="empty">No stakeholders found.</div>}
                  {filteredSh.map((s,i) => {
                    const age = contactAge(s.last_contacted_at);
                    return (
                      <div key={s.id} className="sh-row" style={{display:"grid",gridTemplateColumns:"200px 110px 190px 1fr 80px 90px 90px",gap:12,alignItems:"center"}}>
                        <div style={{display:"flex",alignItems:"center",gap:9}}>
                          <div className="sh-av" style={{background:`${s.color||"#00d4ff"}18`,border:`1px solid ${s.color||"#00d4ff"}30`,color:s.color||"#00d4ff"}}>{s.initials || initials(s.name)}</div>
                          <div>
                            <div style={{fontSize:13,fontWeight:500}}>{s.name}</div>
                            <div style={{fontSize:11,color:"var(--mut)"}}>{s.role}</div>
                          </div>
                        </div>
                        <span style={{fontSize:11,color:"var(--mut)"}}>{s.type}</span>
                        <a href={`mailto:${s.email}`} style={{fontFamily:"DM Mono",fontSize:11,color:"var(--acc)",textDecoration:"none"}} onMouseOver={e=>e.target.style.textDecoration="underline"} onMouseOut={e=>e.target.style.textDecoration="none"}>{s.email}</a>
                        <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                          {(s.proj||[]).map((p,j) => <span key={j} style={{fontSize:10,padding:"1px 6px",borderRadius:4,background:"var(--surf2)",border:"1px solid var(--bdr)",color:"var(--mut)"}}>{p}</span>)}
                        </div>
                        <div style={{display:"flex",gap:3}}>
                          {Array.from({length:5},(_,j) => <div key={j} style={{width:8,height:8,borderRadius:2,background:j<(s.influence||0)?"var(--pur)":"var(--bdr2)"}}/>)}
                        </div>
                        <span className={`tag ${AGE_TAG[age]}`}>{contactLabel(s.last_contacted_at)}</span>
                        <div style={{display:"flex",gap:4}}>
                          <button className="btn btn-sm" title="Mark contacted" onClick={() => markContacted(s.id)}>✓</button>
                          <button className="btn btn-icon btn-sm" onClick={() => openEditSh(s)} title="Edit">✎</button>
                          <button className="btn btn-icon btn-danger btn-sm" onClick={() => deleteSh(s.id)} title="Delete">✕</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ══ PILOT METRICS ═══════════════════════════════════════════ */}
            {page === "metrics" && (
              <div className="col">
                <div className="g4">
                  {[{v:"23",l:"DAU",d:"+4 vs last week",up:true},{v:"61%",l:"WAU retention",d:"+8pp vs week 1",up:true},{v:"3.2h",l:"Avg time saved / user / wk",d:"+0.4h",up:true},{v:"47min",l:"Meeting Scribe saved",d:"top agent",up:true}].map(({v,l,d,up}) => (
                    <div key={l} className="kpi"><div className="kpi-v" style={{color:"var(--acc)"}}>{v}</div><div className="kpi-l">{l}</div><div className={`kpi-d ${up?"d-up":"d-dn"}`}>{up?"▲":"▼"} {d}</div></div>
                  ))}
                </div>
                <div className="g2">
                  <div className="card">
                    <div className="ch"><div className="ct">Adoption Funnel · Week 3</div></div>
                    <div className="cb0">
                      {[{l:"Invited",n:40,pct:100,c:"var(--acc)"},{l:"Activated",n:31,pct:78,c:"var(--acc)"},{l:"Used an agent",n:23,pct:74,c:"var(--grn)"},{l:"Used 3+ agents",n:14,pct:61,c:"var(--grn)"},{l:"Retained (D7)",n:9,pct:64,c:"var(--amb)"}].map(({l,n,pct,c},i,a) => (
                        <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 16px",borderBottom:i<a.length-1?"1px solid var(--bdr)":"none"}}>
                          <span style={{fontSize:12,width:100,flexShrink:0}}>{l}</span>
                          <div style={{flex:1,height:7,background:"var(--bdr2)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:c,borderRadius:4}}/></div>
                          <span className="mono dim" style={{fontSize:11,width:46,textAlign:"right"}}>{n} users</span>
                          <span className="mono acc" style={{fontSize:11,width:34,textAlign:"right"}}>{i===0?"":pct+"%"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card">
                    <div className="ch"><div className="ct">Agent Usage Ranking</div></div>
                    <div className="cb0" style={{padding:"4px 16px 4px"}}>
                      {[{n:"Meeting Scribe",r:47,c:"var(--acc)"},{n:"Weekly Digest",r:23,c:"var(--grn)"},{n:"Stakeholder Update",r:19,c:"var(--pur)"},{n:"Prioritization",r:14,c:"var(--amb)"},{n:"PRD Agent",r:8,c:"var(--acc)"},{n:"Risk Monitor",r:6,c:"var(--red)"}].map(({n,r,c}) => (
                        <div key={n} className="use-row">
                          <div className="use-name">{n}</div>
                          <div className="use-bw"><div className="use-bar"><div className="use-fill" style={{width:`${(r/47)*100}%`,background:c}}/></div><div className="use-n">{r}</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="g2">
                  <div className="card">
                    <div className="ch"><div className="ct">Time Saved · This Week</div></div>
                    <div className="cb0" style={{padding:"4px 16px 4px"}}>
                      {[{l:"Meeting notes → tasks",v:"47 min"},{l:"Weekly stakeholder email",v:"38 min"},{l:"Backlog prioritization",v:"55 min"},{l:"Focus group → PRD",v:"2.1 hrs"},{l:"Competitive intel digest",v:"30 min"},{l:"Risk flag review",v:"22 min"}].map(({l,v}) => (
                        <div key={l} className="tsav-row"><span className="tsav-l">{l}</span><span className="tsav-v">{v}</span></div>
                      ))}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderTop:"1px solid var(--bdr)"}}>
                        <span style={{fontFamily:"Syne",fontWeight:700,fontSize:13}}>Total this week</span>
                        <span style={{fontFamily:"Syne",fontWeight:800,fontSize:18,color:"var(--grn)"}}>5.5 hrs</span>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="alert-b al-warn"><span style={{fontSize:16}}>⚠️</span><div><div className="al-ttl" style={{color:"var(--amb)"}}>Prioritization Agent usage dropped 30%</div><div className="al-body">Usage fell from 20 to 14 runs/week. <span className="acc">Investigate with top users.</span></div></div></div>
                    <div className="alert-b al-good"><span style={{fontSize:16}}>✅</span><div><div className="al-ttl" style={{color:"var(--grn)"}}>PRD Agent retention high</div><div className="al-body">All 8 users who tried PRD Agent returned within 48 hours.</div></div></div>
                    <div className="alert-b al-warn"><span style={{fontSize:16}}>👥</span><div><div className="al-ttl" style={{color:"var(--amb)"}}>D7 retention below target</div><div className="al-body">64% vs 75% target. <span className="acc">Schedule 2 more onboarding sessions.</span></div></div></div>
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

            {/* ══ PRIVACY ═════════════════════════════════════════════════ */}
            {page === "privacy" && (
              <div className="col">
                <div style={{padding:"12px 16px",background:"rgba(16,185,129,0.05)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:"var(--grn)",boxShadow:"0 0 5px var(--grn)"}}/>
                    <span style={{fontFamily:"Syne",fontWeight:700,fontSize:13}}>No data has left this machine</span>
                    <span style={{fontSize:12,color:"var(--mut)"}}>All processing local · Only outbound: Claude API</span>
                  </div>
                  <div style={{display:"flex",gap:7}}>
                    {["Local Postgres","Supabase","MacBook Pro"].map(l => (
                      <span key={l} style={{display:"inline-flex",alignItems:"center",gap:5,fontFamily:"DM Mono",fontSize:10,padding:"4px 9px",borderRadius:7,background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)",color:"var(--grn)"}}>
                        <div style={{width:5,height:5,borderRadius:"50%",background:"var(--grn)"}}/>{l}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="g2">
                  <div className="card">
                    <div className="ch">
                      <div className="ct">Agent Memory Log</div>
                      <button className="btn btn-danger btn-sm" onClick={forgetAll}>Forget All</button>
                    </div>
                    <div className="cb">
                      {memLog.length===0
                        ? <div className="empty">Memory cleared</div>
                        : memLog.map(m => (
                          <div key={m.id} className="mem-row">
                            <div className="mdot" style={{background:m.type==="project"?"var(--acc)":m.type==="agent"?"var(--pur)":m.type==="meeting"?"var(--amb)":"var(--grn)"}}/>
                            <div style={{flex:1}}>
                              <div className="mem-text">{m.content || m.text}</div>
                              <div className="mem-src">{m.source || m.src}</div>
                            </div>
                            <button className="btn btn-danger btn-sm" onClick={() => forgetMem(m.id)}>Forget</button>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  <div className="col">
                    <div className="card">
                      <div className="ch"><div className="ct">Memory Settings</div></div>
                      <div className="cb">
                        {[{k:"persist",l:"Persistent memory",s:"Agent remembers across sessions"},{k:"learn",l:"Agent learning",s:"Agents improve from your usage patterns"},{k:"session",l:"Session-only mode",s:"Wipe memory when you close the app"},{k:"audit",l:"Audit log",s:"Record every agent action for compliance"}].map(({k,l,s}) => (
                          <div key={k} className="tog-row">
                            <div><div className="tog-lbl">{l}</div><div className="tog-sub">{s}</div></div>
                            <div className={`tog ${privTogs[k]?"on":"off"}`} onClick={() => togglePriv(k)}/>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="card">
                      <div className="ch"><div className="ct">Data Flow Audit</div></div>
                      <div className="cb">
                        {[{s:"Jira tickets",d:"Local Postgres only",ok:true},{s:"Calendar events",d:"Local Postgres only",ok:true},{s:"Meeting transcripts",d:"Claude API (anonymised)",ok:true},{s:"Backlog items",d:"Claude API (no PII)",ok:true},{s:"Stakeholder emails",d:"Local only — never sent to AI",ok:true},{s:"OKR data",d:"Local Postgres only",ok:true}].map((r,i) => (
                          <div key={i} className="flow-row">
                            <div className="flow-src dim" style={{fontSize:12}}>{r.s}</div>
                            <span className="dim" style={{fontSize:11}}>→</span>
                            <div style={{fontFamily:"DM Mono",fontSize:11,flex:1,color:r.ok?"var(--grn)":"var(--red)"}}>{r.d}</div>
                            <div className="fdot" style={{background:r.ok?"var(--grn)":"var(--red)"}}/>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="card">
                      <div className="ch"><div className="ct">Right to Delete</div></div>
                      <div className="cb">
                        <p style={{fontSize:12,color:"var(--mut)",lineHeight:1.7,marginBottom:12}}>All data is stored in Supabase Postgres. Export or permanently delete at any time.</p>
                        <div className="col" style={{gap:6}}>
                          {[["Export all my data (JSON)","neutral"],["Delete meeting transcripts","neutral"],["Wipe agent run history","neutral"],["Full data reset","danger"]].map(([a,t],i) => (
                            <button key={i} style={{padding:"8px 11px",borderRadius:7,border:`1px solid ${t==="danger"?"rgba(239,68,68,0.3)":"var(--bdr)"}`,background:"var(--surf2)",color:t==="danger"?"var(--red)":"var(--txt)",fontSize:12,textAlign:"left",cursor:"pointer"}}>{a}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ INTEGRATIONS ════════════════════════════════════════════ */}
            {page === "integrations" && (
              <div className="col">

                {/* Connection status cards */}
                <div className="g4">
                  {[
                    { name:"jira", label:"Jira", icon:"🔷", desc:"Issues, sprints, project tracking", syncFn: () => syncJira() },
                    { name:"webex", label:"Webex", icon:"💬", desc:"Meeting recordings and transcripts", syncFn: syncWebex },
                    { name:"gmail", label:"Gmail", icon:"📧", desc:"Starred emails as tasks", syncFn: syncGmail },
                    { name:"google_calendar", label:"Google Calendar", icon:"📅", desc:"Events synced to schedule tab", syncFn: () => syncCalendar() },
                  ].map(({ name, label, icon, desc, syncFn }) => {
                    const status = getIntegrationStatus(name);
                    const isSyncing = syncingIntegration === name;
                    return (
                      <div key={name} className="card" style={{padding:16}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                          <div style={{fontSize:24}}>{icon}</div>
                          <span className={`tag ${status.status==="connected"?"tag-grn":status.status==="error"?"tag-red":"tag-dim"}`} style={{fontSize:9}}>
                            {status.status === "connected" ? "● Connected" : status.status === "error" ? "● Error" : "○ Disconnected"}
                          </span>
                        </div>
                        <div style={{fontFamily:"Syne",fontWeight:700,fontSize:14,marginBottom:3}}>{label}</div>
                        <div style={{fontSize:11,color:"var(--mut)",marginBottom:10}}>{desc}</div>
                        {status.last_synced_at && (
                          <div style={{fontFamily:"DM Mono",fontSize:9,color:"var(--mut)",marginBottom:8}}>
                            Last sync: {new Date(status.last_synced_at).toLocaleString()}
                          </div>
                        )}
                        <button className="btn btn-primary" style={{width:"100%",fontSize:11}} disabled={isSyncing} onClick={syncFn}>
                          {isSyncing ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><span className="spin" style={{width:12,height:12,borderWidth:1.5}}/>Syncing...</span> : `⟳ Sync ${label}`}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Jira Issues */}
                <div className="card">
                  <div className="ch">
                    <div className="ct">Jira Issues · Live</div>
                    <div style={{display:"flex",gap:6}}>
                      <button className="btn btn-sm" onClick={() => syncJira()} disabled={syncingIntegration==="jira"}>⟳ Sync</button>
                      <button className="btn btn-sm btn-primary" onClick={() => setShowCreateJira(true)}>+ Create Issue</button>
                    </div>
                  </div>
                  {jiraIssues.length === 0 ? (
                    <div className="empty">No Jira issues synced yet. Click Sync Jira to pull issues.</div>
                  ) : (
                    <>
                      <div className="th-row" style={{gridTemplateColumns:"80px 1fr 80px 80px 100px"}}>
                        <span>Key</span><span>Summary</span><span>Status</span><span>Priority</span><span>Assignee</span>
                      </div>
                      {jiraIssues.map((issue,i) => (
                        <div key={issue.id} className="tr" style={{gridTemplateColumns:"80px 1fr 80px 80px 100px"}}>
                          <a href={`${Deno?.env?.get?.("JIRA_BASE_URL") || "#"}/browse/${issue.jira_key}`} target="_blank" rel="noopener noreferrer"
                            style={{fontFamily:"DM Mono",fontSize:11,color:"var(--acc)",textDecoration:"none"}}>{issue.jira_key}</a>
                          <span style={{fontSize:12}}>{issue.summary}</span>
                          <span className={`tag ${issue.status?.includes("done")||issue.status?.includes("closed")?"tag-grn":issue.status?.includes("progress")?"tag-blu":"tag-dim"}`} style={{fontSize:9}}>{issue.status}</span>
                          <span className={`tag ${issue.priority==="high"?"tag-red":issue.priority==="low"?"tag-grn":"tag-amb"}`} style={{fontSize:9}}>{issue.priority}</span>
                          <span style={{fontSize:11,color:"var(--mut)"}}>{issue.assignee || "Unassigned"}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Gmail Threads */}
                <div className="card">
                  <div className="ch">
                    <div className="ct">Gmail · Starred & Important</div>
                    <button className="btn btn-sm" onClick={syncGmail} disabled={syncingIntegration==="gmail"}>⟳ Sync Gmail</button>
                  </div>
                  {gmailThreads.length === 0 ? (
                    <div className="empty">No Gmail threads synced. Click Sync Gmail to pull starred and important emails.</div>
                  ) : (
                    gmailThreads.map((thread,i) => (
                      <div key={thread.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 16px",borderBottom:i<gmailThreads.length-1?"1px solid var(--bdr)":"none"}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:thread.is_read?"var(--bdr2)":"var(--acc)",flexShrink:0,marginTop:5}}/>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                            <span style={{fontSize:13,fontWeight:thread.is_read?400:600}}>{thread.subject}</span>
                            <span style={{fontFamily:"DM Mono",fontSize:10,color:"var(--mut)"}}>{thread.received_at ? new Date(thread.received_at).toLocaleDateString() : "—"}</span>
                          </div>
                          <div style={{fontSize:11,color:"var(--mut)",marginBottom:5}}>{thread.from_email}</div>
                          <div style={{fontSize:11,color:"var(--mut)",lineHeight:1.5}}>{thread.snippet?.slice(0,120)}</div>
                        </div>
                        <div style={{display:"flex",gap:5,flexShrink:0}}>
                          {!thread.is_read && <button className="btn btn-sm" onClick={() => markGmailRead(thread.thread_id)}>Mark read</button>}
                          <a href={`https://mail.google.com/mail/u/0/#inbox/${thread.thread_id}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm">Open</a>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Agent Run History */}
                <div className="card">
                  <div className="ch"><div className="ct">Agent Run History · Live</div></div>
                  {agentRuns.length === 0 ? (
                    <div className="empty">No agent runs yet. Run any agent to see history here.</div>
                  ) : (
                    <>
                      <div className="th-row" style={{gridTemplateColumns:"140px 1fr 1fr 70px 60px"}}>
                        <span>Agent</span><span>Input</span><span>Output</span><span>Tokens</span><span>When</span>
                      </div>
                      {agentRuns.map((run,i) => (
                        <div key={run.id} className="tr" style={{gridTemplateColumns:"140px 1fr 1fr 70px 60px"}}>
                          <span className="tag tag-pur" style={{fontSize:9,display:"inline-flex"}}>{run.agent_name}</span>
                          <span style={{fontSize:11,color:"var(--mut)"}}>{run.input_summary}</span>
                          <span style={{fontSize:11,color:"var(--mut)"}}>{run.output_summary}</span>
                          <span className="mono dim" style={{fontSize:10}}>{run.tokens_used}</span>
                          <span className="mono dim" style={{fontSize:10}}>{run.ran_at ? new Date(run.ran_at).toLocaleDateString() : "—"}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

              </div>
            )}

          </div>
        </main>

        {/* ── Create Jira Issue Modal ─────────────────────────────────────── */}
        {showCreateJira && (
          <Modal title="Create Jira Issue" onClose={() => setShowCreateJira(false)}>
            <div className="form-grid">
              <div className="form-row" style={{gridColumn:"1/-1"}}>
                <label className="form-label">Summary</label>
                <input className="input" value={jiraForm.summary} onChange={e => setJiraForm(p=>({...p,summary:e.target.value}))} placeholder="Issue summary..." autoFocus/>
              </div>
              <div className="form-row">
                <label className="form-label">Project Key</label>
                <input className="input" value={jiraForm.projectKey} onChange={e => setJiraForm(p=>({...p,projectKey:e.target.value}))} placeholder="PM"/>
              </div>
              <div className="form-row">
                <label className="form-label">Issue Type</label>
                <select className="input select" value={jiraForm.issueType} onChange={e => setJiraForm(p=>({...p,issueType:e.target.value}))}>
                  <option>Task</option><option>Story</option><option>Bug</option><option>Epic</option>
                </select>
              </div>
              <div className="form-row">
                <label className="form-label">Priority</label>
                <select className="input select" value={jiraForm.priority} onChange={e => setJiraForm(p=>({...p,priority:e.target.value}))}>
                  <option value="high">High</option><option value="med">Medium</option><option value="low">Low</option>
                </select>
              </div>
              <div className="form-row" style={{gridColumn:"1/-1"}}>
                <label className="form-label">Description (optional)</label>
                <textarea className="input" value={jiraForm.description} onChange={e => setJiraForm(p=>({...p,description:e.target.value}))} style={{minHeight:80,resize:"vertical"}} placeholder="Describe the issue..."/>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn" onClick={() => setShowCreateJira(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={createJiraIssue} disabled={syncingIntegration==="jira-create"}>
                {syncingIntegration==="jira-create" ? "Creating..." : "Create in Jira"}
              </button>
            </div>
          </Modal>
        )}

        {/* ── Add Calendar Event Modal ────────────────────────────────────── */}
        {showAddCalEvent && (
          <Modal title="Add Calendar Event" onClose={() => setShowAddCalEvent(false)}>
            <div className="form-grid">
              <div className="form-row" style={{gridColumn:"1/-1"}}>
                <label className="form-label">Event Title</label>
                <input className="input" value={calForm.title} onChange={e => setCalForm(p=>({...p,title:e.target.value}))} placeholder="Sprint Planning — Mobile Team" autoFocus/>
              </div>
              <div className="form-row">
                <label className="form-label">Start Time</label>
                <input className="input" type="time" value={calForm.startTime} onChange={e => setCalForm(p=>({...p,startTime:e.target.value}))}/>
              </div>
              <div className="form-row">
                <label className="form-label">End Time</label>
                <input className="input" type="time" value={calForm.endTime} onChange={e => setCalForm(p=>({...p,endTime:e.target.value}))}/>
              </div>
              <div className="form-row" style={{gridColumn:"1/-1"}}>
                <label className="form-label">Attendees (comma-separated emails)</label>
                <input className="input" value={calForm.attendees} onChange={e => setCalForm(p=>({...p,attendees:e.target.value}))} placeholder="ana@company.com, chen@company.com"/>
              </div>
              <div className="form-row" style={{gridColumn:"1/-1"}}>
                <label className="form-label">Description (optional)</label>
                <input className="input" value={calForm.description} onChange={e => setCalForm(p=>({...p,description:e.target.value}))} placeholder="Agenda or context..."/>
              </div>
            </div>
            <div style={{fontSize:11,color:"var(--mut)"}}>
              A Google Meet link will be auto-generated and added to the event.
            </div>
            <div className="form-actions">
              <button className="btn" onClick={() => setShowAddCalEvent(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={createCalendarEvent} disabled={syncingIntegration==="cal-create"}>
                {syncingIntegration==="cal-create" ? "Creating..." : "Create Event + Meet Link"}
              </button>
            </div>
          </Modal>
        )}

        {/* Error modal */}
        {agentResultType === "error" && (
          <Modal title="Agent Error" onClose={closeAgentResult}>
            <div className="infobox ib-red" style={{fontSize:13}}>{agentError || "An unexpected error occurred."}</div>
            <div style={{fontSize:12,color:"var(--mut)"}}>Check that your edge function is deployed and all secrets are set in Supabase.</div>
            <div className="form-actions"><button className="btn btn-primary" onClick={closeAgentResult}>Close</button></div>
          </Modal>
        )}

        {/* Prioritization result */}
        {agentResultType === "prioritization" && agentResult && (
          <Modal title="Prioritization Results" onClose={closeAgentResult}>
            <div className="infobox ib-blue" style={{fontSize:12,marginBottom:4}}>
              🤖 {agentResult.summary}
            </div>
            {agentResult.top_3_recommendation?.length > 0 && (
              <div>
                <div className="section-lbl" style={{marginBottom:6}}>Top 3 to ship this sprint</div>
                {agentResult.top_3_recommendation.map((t, i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid var(--bdr)",fontSize:13}}>
                    <span style={{fontFamily:"DM Mono",fontSize:10,color:"var(--acc)",width:16}}>#{i+1}</span>
                    <span style={{flex:1}}>{t}</span>
                  </div>
                ))}
              </div>
            )}
            {agentResult.scored_items?.length > 0 && (
              <div>
                <div className="section-lbl" style={{marginBottom:6}}>All scored items</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {[...agentResult.scored_items].sort((a,b) => b.rice_score - a.rice_score).map((item, i) => (
                    <div key={i} style={{padding:"8px 10px",background:"var(--surf2)",borderRadius:7,border:"1px solid var(--bdr)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                        <span style={{fontWeight:500,fontSize:12}}>{item.title}</span>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          <span className="tag tag-blu" style={{fontSize:9}}>RICE {Math.round(item.rice_score)}</span>
                          <span className="tag tag-pur" style={{fontSize:9}}>{item.recommended_quarter}</span>
                        </div>
                      </div>
                      <div style={{fontSize:11,color:"var(--mut)"}}>{item.reasoning}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="form-actions">
              <button className="btn" onClick={() => { closeAgentResult(); setPage("priority"); }}>View in Prioritization tab</button>
              <button className="btn btn-primary" onClick={closeAgentResult}>Done</button>
            </div>
          </Modal>
        )}

        {/* Weekly Digest result */}
        {agentResultType === "weekly-digest" && agentResult && (
          <Modal title="Weekly Digest" onClose={closeAgentResult}>
            <div style={{fontFamily:"Syne",fontWeight:800,fontSize:16,color:"var(--acc)",marginBottom:4}}>
              {agentResult.headline}
            </div>
            {[
              { label: "On track", items: agentResult.whats_on_track, color: "var(--grn)" },
              { label: "At risk", items: agentResult.whats_at_risk, color: "var(--red)" },
              { label: "Wins last week", items: agentResult.wins_last_week, color: "var(--acc)" },
              { label: "Top 3 priorities this week", items: agentResult.top_3_priorities, color: "var(--amb)" },
              { label: "Decisions needed", items: agentResult.decisions_needed, color: "var(--pur)" },
              { label: "Blocked items", items: agentResult.blocked_items, color: "var(--red)" },
            ].filter(s => s.items?.length > 0).map(({ label, items, color }) => (
              <div key={label}>
                <div style={{fontFamily:"DM Mono",fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--mut)",marginBottom:5}}>{label}</div>
                {items.map((item, i) => (
                  <div key={i} style={{display:"flex",gap:7,fontSize:12,padding:"4px 0",borderBottom:"1px solid var(--bdr)",alignItems:"flex-start"}}>
                    <div style={{width:4,height:4,borderRadius:"50%",background:color,flexShrink:0,marginTop:5}}/>
                    {item}
                  </div>
                ))}
              </div>
            ))}
            <div className="form-actions">
              <button className="btn btn-primary" onClick={closeAgentResult}>Done</button>
            </div>
          </Modal>
        )}

        {/* Risk Monitor result */}
        {agentResultType === "risk-monitor" && agentResult && (
          <Modal title="Risk Scan Results" onClose={closeAgentResult}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
              <div style={{fontFamily:"Syne",fontWeight:700,fontSize:13}}>Portfolio Health</div>
              <span className={`tag ${agentResult.overall_health === "green" ? "tag-grn" : agentResult.overall_health === "amber" ? "tag-amb" : "tag-red"}`}>
                {agentResult.overall_health?.toUpperCase()}
              </span>
            </div>
            <div style={{fontSize:12,color:"var(--mut)",marginBottom:8}}>{agentResult.summary}</div>
            {agentResult.alerts?.length > 0 ? (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {agentResult.alerts.map((alert, i) => (
                  <div key={i} className={`alert-b ${alert.risk_level === "high" ? "al-warn" : "al-good"}`}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                        <div className="al-ttl" style={{color: alert.risk_level === "high" ? "var(--red)" : "var(--amb)"}}>{alert.project}</div>
                        <div style={{display:"flex",gap:5}}>
                          <span className={`tag ${alert.risk_level === "high" ? "tag-red" : alert.risk_level === "med" ? "tag-amb" : "tag-grn"}`} style={{fontSize:9}}>{alert.risk_level} risk</span>
                          <span className="tag tag-pur" style={{fontSize:9}}>{alert.urgency}</span>
                        </div>
                      </div>
                      <div className="al-body">{alert.reason}</div>
                      <div style={{fontSize:11,color:"var(--acc)",marginTop:3}}>→ {alert.suggested_action}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="infobox ib-grn" style={{fontSize:12}}>✓ No critical risks detected. All projects look healthy.</div>
            )}
            <div className="form-actions">
              <button className="btn" onClick={() => { closeAgentResult(); setPage("tracker"); }}>View Projects</button>
              <button className="btn btn-primary" onClick={closeAgentResult}>Done</button>
            </div>
          </Modal>
        )}

        {/* Stakeholder Update result */}
        {agentResultType === "stakeholder-update" && agentResult && (
          <Modal title="Stakeholder Update Draft" onClose={closeAgentResult}>
            <div style={{background:"var(--surf2)",border:"1px solid var(--bdr)",borderRadius:8,padding:12}}>
              <div style={{fontFamily:"DM Mono",fontSize:10,color:"var(--mut)",marginBottom:4}}>SUBJECT</div>
              <div style={{fontWeight:500,fontSize:13,marginBottom:12}}>{agentResult.subject}</div>
              <div style={{fontFamily:"DM Mono",fontSize:10,color:"var(--mut)",marginBottom:4}}>BODY</div>
              <div style={{fontSize:12,lineHeight:1.8,color:"var(--txt)",whiteSpace:"pre-line"}}>{agentResult.body}</div>
            </div>
            {agentResult.key_highlights?.length > 0 && (
              <div>
                <div className="section-lbl" style={{marginBottom:5}}>Key Highlights</div>
                {agentResult.key_highlights.map((h, i) => (
                  <div key={i} style={{fontSize:12,display:"flex",gap:7,padding:"3px 0",borderBottom:"1px solid var(--bdr)"}}>
                    <span style={{color:"var(--grn)"}}>✓</span>{h}
                  </div>
                ))}
              </div>
            )}
            <div className="form-actions">
              <button className="btn" onClick={() => {
                navigator.clipboard.writeText(`Subject: ${agentResult.subject}\n\n${agentResult.body}`)
                  .then(() => alert("Copied to clipboard!"));
              }}>Copy Email</button>
              <button className="btn btn-primary" onClick={closeAgentResult}>Done</button>
            </div>
          </Modal>
        )}



        {/* Add / Edit Project */}
        {showAddProj && (
          <Modal title={editProj ? "Edit Project" : "Add Project"} onClose={() => setShowAddProj(false)}>
            <div className="form-grid">
              <div className="form-row" style={{gridColumn:"1/-1"}}>
                <label className="form-label">Project Name</label>
                <input className="input" value={projForm.name} onChange={e => setProjForm(p=>({...p,name:e.target.value}))} placeholder="Mobile Onboarding V2" autoFocus/>
              </div>
              <div className="form-row">
                <label className="form-label">Owner</label>
                <input className="input" value={projForm.owner} onChange={e => setProjForm(p=>({...p,owner:e.target.value}))} placeholder="Ana + Raj"/>
              </div>
              <div className="form-row">
                <label className="form-label">Status</label>
                <select className="input select" value={projForm.status} onChange={e => setProjForm(p=>({...p,status:e.target.value}))}>
                  <option value="planning">Planning</option>
                  <option value="on-track">On Track</option>
                  <option value="at-risk">At Risk</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
              <div className="form-row">
                <label className="form-label">Progress (%)</label>
                <input className="input" type="number" min="0" max="100" value={projForm.progress} onChange={e => setProjForm(p=>({...p,progress:e.target.value}))}/>
              </div>
              <div className="form-row">
                <label className="form-label">Due Date</label>
                <input className="input" type="date" value={projForm.due_date} onChange={e => setProjForm(p=>({...p,due_date:e.target.value}))}/>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn" onClick={() => setShowAddProj(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveProject}>{editProj ? "Save Changes" : "Add Project"}</button>
            </div>
          </Modal>
        )}

        {/* Add Meeting */}
        {showAddMeet && (
          <Modal title="New Meeting" onClose={() => setShowAddMeet(false)}>
            <div className="form-row">
              <label className="form-label">Meeting Title</label>
              <input className="input" value={meetForm.title} onChange={e => setMeetForm(p=>({...p,title:e.target.value}))} placeholder="Sprint Planning — Mobile Team" autoFocus/>
            </div>
            <div className="form-row">
              <label className="form-label">Date & Time</label>
              <input className="input" type="datetime-local" value={meetForm.meeting_time} onChange={e => setMeetForm(p=>({...p,meeting_time:e.target.value}))}/>
            </div>
            <div className="form-row">
              <label className="form-label">Transcript (paste for AI processing)</label>
              <textarea className="input" value={meetForm.raw_transcript} onChange={e => setMeetForm(p=>({...p,raw_transcript:e.target.value}))}
                placeholder="Paste meeting transcript here. The Meeting Scribe agent will extract action items, decisions, and risks automatically..."
                style={{minHeight:140,resize:"vertical"}}/>
            </div>
            <div className="form-actions">
              <button className="btn" onClick={() => setShowAddMeet(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveMeeting} disabled={meetProcessing}>
                {meetProcessing ? <><span className="spin" style={{width:13,height:13,borderWidth:1.5,display:"inline-block",verticalAlign:"middle",marginRight:6}}/>Processing...</> : meetForm.raw_transcript.trim() ? "Save & Process with AI" : "Save Meeting"}
              </button>
            </div>
          </Modal>
        )}

        {/* Add / Edit Stakeholder */}
        {showAddSh && (
          <Modal title={editSh ? "Edit Stakeholder" : "Add Stakeholder"} onClose={() => setShowAddSh(false)}>
            <div className="form-grid">
              <div className="form-row">
                <label className="form-label">Full Name</label>
                <input className="input" value={shForm.name} onChange={e => setShForm(p=>({...p,name:e.target.value}))} placeholder="Sarah Mitchell" autoFocus/>
              </div>
              <div className="form-row">
                <label className="form-label">Role</label>
                <input className="input" value={shForm.role} onChange={e => setShForm(p=>({...p,role:e.target.value}))} placeholder="Chief Product Officer"/>
              </div>
              <div className="form-row" style={{gridColumn:"1/-1"}}>
                <label className="form-label">Email</label>
                <input className="input" type="email" value={shForm.email} onChange={e => setShForm(p=>({...p,email:e.target.value}))} placeholder="s.mitchell@company.com"/>
              </div>
              <div className="form-row">
                <label className="form-label">Type</label>
                <select className="input select" value={shForm.type} onChange={e => setShForm(p=>({...p,type:e.target.value}))}>
                  {["Internal — Executive","Internal — Engineering","Internal — Design","Internal — GTM","Internal — ML","Internal — CS","External — Client"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label className="form-label">Influence (1–5)</label>
                <select className="input select" value={shForm.influence} onChange={e => setShForm(p=>({...p,influence:parseInt(e.target.value)}))}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label className="form-label">Colour</label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {["#00d4ff","#7c3aed","#10b981","#f59e0b","#ef4444","#ec4899"].map(c => (
                    <div key={c} onClick={() => setShForm(p=>({...p,color:c}))} style={{width:22,height:22,borderRadius:6,background:c,cursor:"pointer",border:shForm.color===c?"2px solid #fff":"2px solid transparent"}}/>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn" onClick={() => setShowAddSh(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveSh}>{editSh ? "Save Changes" : "Add Stakeholder"}</button>
            </div>
          </Modal>
        )}

      </div>
    </>
  );
}
