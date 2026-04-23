import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{--bg:#07090f;--surf:#0c1018;--surf2:#101520;--bdr:#192030;--bdr2:#1e2a3d;--acc:#00d4ff;--pur:#7c3aed;--grn:#10b981;--amb:#f59e0b;--red:#ef4444;--txt:#dde4ef;--mut:#4e5f74;--r:10px;--r-sm:7px;--gap:14px;}
  html,body{height:100%;}
  body{background:var(--bg);font-family:'DM Sans',sans-serif;color:var(--txt);font-size:14px;line-height:1.5;}
  .app{display:flex;min-height:100vh;}
  .sb{width:212px;flex-shrink:0;background:var(--surf);border-right:1px solid var(--bdr);position:fixed;inset:0 auto 0 0;display:flex;flex-direction:column;overflow-y:auto;z-index:20;}
  .sb-brand{padding:18px 16px 14px;border-bottom:1px solid var(--bdr);}
  .sb-logo{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
  .sb-logo-mark{width:28px;height:28px;border-radius:7px;background:linear-gradient(135deg,rgba(0,212,255,0.15),rgba(124,58,237,0.15));border:1px solid rgba(0,212,255,0.2);display:flex;align-items:center;justify-content:center;font-size:14px;}
  .sb-logo-name{font-family:'Syne',sans-serif;font-size:13px;font-weight:800;}
  .sb-context{font-family:'DM Mono',monospace;font-size:9px;color:var(--acc);letter-spacing:0.12em;text-transform:uppercase;}
  .sb-nav{flex:1;padding:8px 0;}
  .sb-grp-lbl{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:var(--mut);padding:12px 14px 4px;}
  .sb-grp-lbl.sub{padding-left:20px;color:rgba(78,95,116,0.7);letter-spacing:0.1em;}
  .sb-item{display:flex;align-items:center;gap:9px;padding:7px 14px;cursor:pointer;font-size:13px;color:var(--mut);transition:all 0.13s;border-left:2px solid transparent;user-select:none;white-space:nowrap;}
  .sb-item:hover{color:var(--txt);background:rgba(255,255,255,0.025);}
  .sb-item.on{color:var(--acc);border-left-color:var(--acc);background:rgba(0,212,255,0.055);font-weight:500;}
  .sb-item-ic{font-size:12px;width:15px;text-align:center;flex-shrink:0;}
  .sb-foot{padding:12px 14px;border-top:1px solid var(--bdr);display:flex;flex-direction:column;gap:5px;}
  .sb-stat{display:flex;align-items:center;gap:7px;font-family:'DM Mono',monospace;font-size:10px;color:var(--mut);}
  .sdot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}
  .main{margin-left:212px;flex:1;display:flex;flex-direction:column;min-height:100vh;}
  .ph{padding:18px 28px 14px;border-bottom:1px solid var(--bdr);background:var(--surf);position:sticky;top:0;z-index:10;display:flex;align-items:flex-end;justify-content:space-between;gap:16px;}
  .ph-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;line-height:1.1;margin-bottom:3px;}
  .ph-sub{font-size:12px;color:var(--mut);}
  .pb{padding:22px 28px;}
  .card{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--r);}
  .ch{padding:13px 16px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;gap:10px;}
  .ct{font-family:'DM Mono',monospace;font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;color:var(--mut);}
  .cb{padding:14px 16px;}.cb0{padding:0;}
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:var(--gap);}
  .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--gap);}
  .g4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:var(--gap);}
  .ga{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--gap);}
  .col{display:flex;flex-direction:column;gap:var(--gap);}
  .row{display:flex;align-items:center;gap:var(--gap);}
  .tag{display:inline-flex;align-items:center;gap:4px;font-family:'DM Mono',monospace;font-size:10px;padding:2px 8px;border-radius:100px;white-space:nowrap;border:1px solid;}
  .tag-grn{background:rgba(16,185,129,0.1);color:var(--grn);border-color:rgba(16,185,129,0.25);}
  .tag-amb{background:rgba(245,158,11,0.1);color:var(--amb);border-color:rgba(245,158,11,0.25);}
  .tag-red{background:rgba(239,68,68,0.1);color:var(--red);border-color:rgba(239,68,68,0.25);}
  .tag-blu{background:rgba(0,212,255,0.09);color:var(--acc);border-color:rgba(0,212,255,0.2);}
  .tag-pur{background:rgba(124,58,237,0.1);color:var(--pur);border-color:rgba(124,58,237,0.25);}
  .tag-dim{background:rgba(78,95,116,0.12);color:var(--mut);border-color:rgba(78,95,116,0.2);}
  .bar-wrap{display:flex;align-items:center;gap:8px;}
  .bar-track{flex:1;height:3px;background:var(--bdr2);border-radius:2px;overflow:hidden;}
  .bar-fill{height:100%;border-radius:2px;transition:width 0.4s;}
  .bar-pct{font-family:'DM Mono',monospace;font-size:10px;color:var(--mut);width:28px;text-align:right;}
  .tr{display:grid;align-items:center;gap:12px;padding:10px 16px;border-bottom:1px solid var(--bdr);font-size:13px;}
  .tr:last-child{border-bottom:none;}
  .tr:hover{background:rgba(255,255,255,0.015);}
  .th-row{display:grid;align-items:center;gap:12px;padding:7px 16px;border-bottom:1px solid var(--bdr);font-family:'DM Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--mut);}
  .tog{width:36px;height:20px;border-radius:10px;cursor:pointer;position:relative;transition:background 0.2s;flex-shrink:0;}
  .tog.off{background:var(--bdr2);}.tog.on{background:var(--grn);}
  .tog::after{content:'';position:absolute;width:14px;height:14px;border-radius:50%;background:#fff;top:3px;transition:left 0.2s;}
  .tog.off::after{left:3px;}.tog.on::after{left:19px;}
  .spin{width:18px;height:18px;border:2px solid var(--bdr2);border-top-color:var(--acc);border-radius:50%;animation:rot 0.8s linear infinite;flex-shrink:0;}
  @keyframes rot{to{transform:rotate(360deg);}}
  .sync-bar{position:fixed;top:0;left:212px;right:0;height:2px;background:linear-gradient(90deg,var(--acc),var(--pur));z-index:999;animation:sp 1.5s ease-in-out infinite;}
  @keyframes sp{0%,100%{opacity:0.4;}50%{opacity:1;}}
  .btn{font-family:'DM Mono',monospace;font-size:11px;padding:6px 13px;border-radius:var(--r-sm);cursor:pointer;border:1px solid var(--bdr);background:var(--surf2);color:var(--txt);transition:all 0.13s;white-space:nowrap;}
  .btn:hover{border-color:var(--acc);color:var(--acc);}
  .btn:disabled{opacity:0.5;cursor:not-allowed;}
  .btn-primary{background:var(--acc);color:#000;border-color:var(--acc);font-weight:500;}
  .btn-primary:hover{opacity:0.85;color:#000;}
  .btn-danger{border-color:rgba(239,68,68,0.3);color:var(--red);background:rgba(239,68,68,0.05);}
  .btn-danger:hover{background:rgba(239,68,68,0.12);}
  .btn-sm{padding:3px 8px;font-size:10px;}
  .btn-icon{width:24px;height:24px;padding:0;display:inline-flex;align-items:center;justify-content:center;border-radius:5px;opacity:0;transition:opacity 0.13s;}
  .tr:hover .btn-icon,.sh-row:hover .btn-icon,.todo-item:hover .btn-icon,.meet-row:hover .btn-icon{opacity:1;}
  .input{width:100%;background:var(--surf2);border:1px solid var(--bdr2);border-radius:var(--r-sm);padding:8px 10px;color:var(--txt);font-size:13px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color 0.13s;}
  .input:focus{border-color:var(--acc);}
  .input-sm{padding:5px 8px;font-size:12px;}
  .select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%234e5f74'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center;padding-right:24px;}
  .form-row{display:flex;flex-direction:column;gap:4px;}
  .form-label{font-family:'DM Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:var(--mut);}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .form-actions{display:flex;gap:8px;justify-content:flex-end;padding-top:4px;}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;}
  .modal{background:var(--surf);border:1px solid var(--bdr);border-radius:14px;padding:22px;width:100%;max-width:520px;display:flex;flex-direction:column;gap:14px;max-height:90vh;overflow-y:auto;}
  .modal-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:800;}
  .add-row{display:flex;gap:8px;align-items:center;padding:10px 16px;border-top:1px solid var(--bdr);background:rgba(0,212,255,0.02);}
  .agc{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--r);padding:16px;transition:all 0.15s;}
  .agc:hover{border-color:var(--pur);transform:translateY(-1px);}
  .ag-icon{width:38px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:10px;}
  .ic-blu{background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.2);}
  .ic-pur{background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.2);}
  .ic-grn{background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);}
  .ic-amb{background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);}
  .ag-name{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;margin-bottom:4px;}
  .ag-trig{font-family:'DM Mono',monospace;font-size:9px;color:var(--acc);background:rgba(0,212,255,0.07);border:1px solid rgba(0,212,255,0.15);padding:2px 7px;border-radius:4px;display:inline-block;margin-bottom:8px;}
  .ag-desc{font-size:12px;color:var(--mut);line-height:1.6;margin-bottom:10px;}
  .chips{display:flex;flex-wrap:wrap;gap:4px;}
  .chip{font-size:10px;padding:2px 7px;border-radius:100px;background:var(--surf2);border:1px solid var(--bdr2);color:var(--mut);}
  .tl-wrap{position:relative;}
  .tl-slot{display:grid;grid-template-columns:52px 1fr;gap:0;min-height:58px;}
  .tl-slot::before{content:'';position:absolute;left:52px;width:1px;background:var(--bdr);top:0;bottom:0;}
  .tl-time{font-family:'DM Mono',monospace;font-size:10px;color:var(--mut);padding-top:5px;text-align:right;padding-right:8px;}
  .tl-ev{border-radius:var(--r-sm);padding:6px 10px;margin:2px 0 4px 12px;border-left:3px solid;}
  .ev-meet{background:rgba(124,58,237,0.09);border-color:var(--pur);}
  .ev-deep{background:rgba(0,212,255,0.07);border-color:var(--acc);}
  .ev-admin{background:rgba(78,95,116,0.08);border-color:var(--mut);}
  .ev-buf{background:rgba(16,185,129,0.06);border-color:var(--grn);}
  .ev-break{background:rgba(245,158,11,0.06);border-color:var(--amb);}
  .ev-title{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;margin-bottom:1px;}
  .ev-meta{font-size:10px;color:var(--mut);display:flex;gap:8px;align-items:center;}
  .okr-blk{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--r);overflow:hidden;}
  .okr-hd{padding:14px 16px;display:flex;align-items:center;gap:11px;cursor:pointer;border-bottom:1px solid var(--bdr);}
  .okr-hd:hover{background:rgba(255,255,255,0.02);}
  .okr-ico{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;}
  .okr-obj{font-family:'Syne',sans-serif;font-size:13px;font-weight:800;margin-bottom:2px;}
  .okr-own{font-size:11px;color:var(--mut);}
  .okr-pct{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;line-height:1;}
  .okr-plbl{font-family:'DM Mono',monospace;font-size:9px;color:var(--mut);margin-top:2px;}
  .okr-bar{height:3px;background:var(--bdr2);border-radius:2px;overflow:hidden;margin:0 16px 2px;}
  .okr-bf{height:100%;border-radius:2px;}
  .kr-row{display:grid;grid-template-columns:1fr 160px 140px;gap:12px;align-items:center;padding:11px 16px;border-bottom:1px solid var(--bdr);}
  .kr-row:last-child{border-bottom:none;}
  .kr-name{font-size:12px;line-height:1.4;}
  .kr-bars{display:flex;flex-direction:column;gap:3px;}
  .kr-bar{height:4px;background:var(--bdr2);border-radius:2px;overflow:hidden;}
  .kr-fill{height:100%;border-radius:2px;}
  .kr-nums{display:flex;justify-content:space-between;font-family:'DM Mono',monospace;font-size:9px;color:var(--mut);}
  .kr-edit-wrap{display:flex;align-items:center;gap:6px;}
  .kr-edit-input{width:60px;font-family:'DM Mono',monospace;font-size:12px;text-align:right;}
  .upload-z{border:2px dashed var(--bdr2);border-radius:var(--r);padding:24px;text-align:center;cursor:pointer;transition:all 0.2s;}
  .upload-z:hover{border-color:var(--acc);background:rgba(0,212,255,0.02);}
  .prd-sec{padding:13px 16px;border-bottom:1px solid var(--bdr);}
  .prd-sec:last-child{border-bottom:none;}
  .prd-lbl{font-family:'DM Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.12em;color:var(--mut);margin-bottom:8px;}
  .story{padding:8px 10px;background:var(--surf2);border-radius:var(--r-sm);border-left:3px solid var(--pur);margin-bottom:5px;font-size:12px;line-height:1.6;}
  .xbtn{font-family:'DM Mono',monospace;font-size:10px;padding:5px 11px;border-radius:var(--r-sm);cursor:pointer;border:1px solid var(--bdr);background:var(--surf2);color:var(--txt);transition:all 0.13s;}
  .xbtn:hover{border-color:var(--acc);color:var(--acc);}
  .mem-row{display:flex;align-items:flex-start;gap:9px;padding:9px 0;border-bottom:1px solid var(--bdr);}
  .mem-row:last-child{border-bottom:none;}
  .mdot{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:5px;}
  .mem-text{flex:1;font-size:12px;line-height:1.5;}
  .mem-src{font-family:'DM Mono',monospace;font-size:10px;color:var(--mut);}
  .tog-row{display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid var(--bdr);}
  .tog-row:last-child{border-bottom:none;}
  .tog-lbl{font-size:13px;}.tog-sub{font-size:11px;color:var(--mut);margin-top:2px;}
  .flow-row{display:flex;align-items:center;gap:8px;font-size:12px;padding:7px 0;border-bottom:1px solid var(--bdr);}
  .flow-row:last-child{border-bottom:none;}
  .fdot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
  .kpi{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--r);padding:15px;}
  .kpi-v{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;line-height:1;margin-bottom:4px;}
  .kpi-l{font-size:11px;color:var(--mut);font-family:'DM Mono',monospace;}
  .kpi-d{font-size:10px;font-family:'DM Mono',monospace;margin-top:3px;}
  .d-up{color:var(--grn);}.d-dn{color:var(--red);}
  .alert-b{padding:11px 13px;border-radius:9px;display:flex;gap:10px;align-items:flex-start;margin-bottom:7px;}
  .al-warn{background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.2);}
  .al-good{background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.2);}
  .al-ttl{font-family:'Syne',sans-serif;font-weight:700;font-size:12px;margin-bottom:3px;}
  .al-body{font-size:11px;color:var(--mut);line-height:1.6;}
  .use-row{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--bdr);}
  .use-row:last-child{border-bottom:none;}
  .use-name{font-size:12px;flex:1;}
  .use-bw{width:100px;display:flex;align-items:center;gap:5px;}
  .use-bar{flex:1;height:3px;background:var(--bdr2);border-radius:2px;overflow:hidden;}
  .use-fill{height:100%;border-radius:2px;}
  .use-n{font-family:'DM Mono',monospace;font-size:10px;color:var(--mut);}
  .sh-row{display:flex;align-items:center;gap:9px;padding:11px 16px;border-bottom:1px solid var(--bdr);}
  .sh-row:hover{background:rgba(255,255,255,0.015);}
  .sh-row:last-child{border-bottom:none;}
  .sh-av{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;font-family:'Syne',sans-serif;}
  .todo-item{display:flex;align-items:center;gap:8px;padding:9px 11px;border-radius:var(--r-sm);background:var(--surf2);border:1px solid var(--bdr);transition:border-color 0.13s;}
  .todo-item:hover{border-color:var(--bdr2);}
  .todo-chk{width:15px;height:15px;border-radius:4px;border:1px solid var(--bdr2);display:flex;align-items:center;justify-content:center;font-size:9px;transition:all 0.13s;flex-shrink:0;cursor:pointer;}
  .todo-chk.dn{background:var(--grn);border-color:var(--grn);color:#000;}
  .todo-txt{flex:1;font-size:13px;min-width:0;}
  .todo-txt.dn{text-decoration:line-through;color:var(--mut);}
  .ai-note{font-family:'DM Mono',monospace;font-size:10px;color:var(--acc);}
  .mono{font-family:'DM Mono',monospace;}.dim{color:var(--mut);}.acc{color:var(--acc);}
  .section-lbl{font-family:'DM Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.12em;color:var(--mut);margin-bottom:8px;}
  .infobox{padding:11px 14px;border-radius:var(--r-sm);font-size:12px;line-height:1.6;color:var(--mut);}
  .ib-blue{background:rgba(0,212,255,0.05);border:1px solid rgba(0,212,255,0.12);}
  .ib-red{background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.15);}
  .ib-grn{background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.15);}
  .ib-amb{background:rgba(245,158,11,0.05);border:1px solid rgba(245,158,11,0.15);}
  .loading{display:flex;align-items:center;gap:10px;padding:20px;color:var(--mut);font-size:13px;}
  .empty{text-align:center;padding:32px;color:var(--mut);font-size:13px;}
  .meet-row{padding:14px 16px;border-bottom:1px solid var(--bdr);}
  .meet-row:hover{background:rgba(255,255,255,0.01);}
  .meet-row:last-child{border-bottom:none;}
  /* Mini Calendar */
  .mini-cal{position:relative;}
  .mini-cal-grid{background:var(--surf2);border:1px solid var(--bdr);border-radius:var(--r);padding:10px;cursor:pointer;transition:all 0.2s;}
  .mini-cal-grid:hover{border-color:var(--acc);}
  .cal-expanded{position:absolute;top:calc(100% + 6px);left:0;right:0;background:var(--surf);border:1px solid var(--acc);border-radius:var(--r);padding:14px;z-index:50;box-shadow:0 8px 32px rgba(0,0,0,0.5);}
  .cal-day{width:32px;height:28px;display:flex;align-items:center;justify-content:center;font-size:11px;border-radius:5px;cursor:pointer;transition:all 0.1s;font-family:'DM Mono',monospace;}
  .cal-day:hover{background:rgba(0,212,255,0.1);color:var(--acc);}
  .cal-day.today{background:var(--acc);color:#000;font-weight:700;}
  .cal-day.has-event{position:relative;}
  .cal-day.has-event::after{content:'';position:absolute;bottom:2px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:var(--pur);}
  .cal-day.selected-day{background:rgba(124,58,237,0.3);color:var(--pur);border:1px solid var(--pur);}
  .cal-day.other-month{opacity:0.3;}
  /* Health badges */
  .h-green{background:rgba(16,185,129,0.12);color:var(--grn);border:1px solid rgba(16,185,129,0.3);padding:3px 10px;border-radius:100px;font-family:'DM Mono',monospace;font-size:10px;font-weight:600;}
  .h-yellow{background:rgba(245,158,11,0.12);color:var(--amb);border:1px solid rgba(245,158,11,0.3);padding:3px 10px;border-radius:100px;font-family:'DM Mono',monospace;font-size:10px;font-weight:600;}
  .h-red{background:rgba(239,68,68,0.12);color:var(--red);border:1px solid rgba(239,68,68,0.3);padding:3px 10px;border-radius:100px;font-family:'DM Mono',monospace;font-size:10px;font-weight:600;}
  /* Roadmap */
  .rm-row{display:grid;grid-template-columns:160px repeat(4,1fr);border-bottom:1px solid var(--bdr);min-height:52px;}
  .rm-row:last-child{border-bottom:none;}
  .rm-row:hover{background:rgba(255,255,255,0.01);}
  .rm-name{padding:10px 14px;font-size:12px;font-weight:500;border-right:1px solid var(--bdr);display:flex;flex-direction:column;justify-content:center;gap:2px;}
  .rm-cell{padding:8px 4px;display:flex;align-items:center;}
  .rm-block{height:28px;border-radius:5px;width:100%;display:flex;align-items:center;justify-content:center;font-size:9px;font-family:'DM Mono',monospace;}
  /* Framework tabs */
  .fw-tabs{display:flex;gap:3px;background:var(--surf2);padding:3px;border-radius:var(--r-sm);}
  .fw-tab{flex:1;padding:6px 8px;font-family:'DM Mono',monospace;font-size:10px;text-align:center;cursor:pointer;border-radius:5px;border:none;background:transparent;color:var(--mut);transition:all 0.13s;white-space:nowrap;}
  .fw-tab.on{background:var(--surf);color:var(--acc);border:1px solid var(--bdr);}
  /* Moscow */
  .mos-bucket{border:1px solid var(--bdr);border-radius:var(--r);overflow:hidden;}
  .mos-hd{padding:10px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--bdr);}
  .mos-item{padding:8px 14px;border-bottom:1px solid var(--bdr);font-size:12px;display:flex;align-items:center;gap:8px;}
  .mos-item:last-child{border-bottom:none;}
  /* Action items */
  .act-row{display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid var(--bdr);font-size:12px;}
  .act-row:last-child{border-bottom:none;}
  @media(max-width:800px){
    .sb{width:52px;}.sb-item span:not(.sb-item-ic){display:none;}.sb-grp-lbl,.sb-logo-name,.sb-context{display:none;}
    .main{margin-left:52px;}.g2,.g3,.g4{grid-template-columns:1fr;}.pb{padding:14px;}.form-grid{grid-template-columns:1fr;}
  }
  /* Super Agent */
  .sa-hero{background:linear-gradient(135deg,rgba(124,58,237,0.12),rgba(0,212,255,0.08));border:1px solid rgba(124,58,237,0.25);border-radius:14px;padding:24px 28px;}
  .sa-hero-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;margin-bottom:6px;}
  .sa-hero-sub{font-size:13px;color:var(--mut);line-height:1.6;max-width:600px;}
  .sa-pipeline{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:14px;}
  .sa-step{font-family:'DM Mono',monospace;font-size:9px;padding:4px 10px;border-radius:100px;border:1px solid;white-space:nowrap;}
  .sa-arrow{color:var(--mut);font-size:11px;}
  .sa-out-sec{background:var(--surf2);border:1px solid var(--bdr);border-radius:10px;overflow:hidden;}
  .sa-out-hd{padding:11px 16px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;cursor:pointer;}
  .sa-out-hd:hover{background:rgba(255,255,255,0.02);}
  .sa-out-body{padding:14px 16px;}
  .sa-field{margin-bottom:10px;}
  .sa-field:last-child{margin-bottom:0;}
  .sa-lbl{font-family:'DM Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--mut);margin-bottom:5px;}
  .sa-val{font-size:12px;line-height:1.7;}
  .sa-list{display:flex;flex-direction:column;gap:5px;}
  .sa-list-item{display:flex;gap:8px;font-size:12px;padding:"3px 0";}
  .sa-rank-card{background:var(--surf);border:1px solid var(--bdr);border-radius:8px;padding:12px;margin-bottom:8px;}
  .sa-rank-card:last-child{margin-bottom:0;}
  .sa-risk-card{border-radius:8px;padding:10px 12px;margin-bottom:7px;display:flex;gap:10px;}
  .sa-risk-card:last-child{margin-bottom:0;}
  .sa-crit{background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.2);}
  .sa-high{background:rgba(245,158,11,0.07);border:1px solid rgba(245,158,11,0.2);}
  .sa-med{background:rgba(0,212,255,0.05);border:1px solid rgba(0,212,255,0.12);}
  .sa-low{background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.12);}
  .confidence-high{color:var(--grn);background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);padding:3px 10px;border-radius:100px;font-family:'DM Mono',monospace;font-size:10px;font-weight:600;}
  .confidence-medium{color:var(--amb);background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);padding:3px 10px;border-radius:100px;font-family:'DM Mono',monospace;font-size:10px;font-weight:600;}
  .confidence-low{color:var(--red);background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);padding:3px 10px;border-radius:100px;font-family:'DM Mono',monospace;font-size:10px;font-weight:600;}
  .sa-run-btn{width:100%;padding:14px;background:linear-gradient(90deg,var(--pur),var(--acc));border:none;border-radius:10px;font-family:'Syne',sans-serif;font-weight:800;font-size:15px;color:#000;cursor:pointer;transition:opacity 0.15s;display:flex;align-items:center;justify-content:center;gap:10px;}
  .sa-run-btn:hover{opacity:0.85;}
  .sa-run-btn:disabled{opacity:0.5;cursor:not-allowed;}
  .sa-thinking{background:var(--surf2);border:1px solid var(--bdr);border-radius:10px;padding:20px;display:flex;flex-direction:column;gap:12px;}
  .sa-think-step{display:flex;align-items:center;gap:10px;font-size:12px;}
  .sa-think-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
  .sa-think-done{background:var(--grn);}
  .sa-think-active{background:var(--acc);animation:pulse 1s ease-in-out infinite;}
  .sa-think-wait{background:var(--bdr2);}
  @keyframes pulse{0%,100%{opacity:0.4;}50%{opacity:1;}}

`;

const NAV = [
  {grp:"Today",        items:[{id:"schedule",ic:"🕐",lbl:"Daily Schedule"},{id:"todos",ic:"☑",lbl:"To-Do List"}]},
  {grp:"Execution",    items:[{id:"tracker",ic:"◎",lbl:"Projects"},{id:"roadmap",ic:"🗺",lbl:"Roadmap"}]},
  {grp:"AI Agents",    items:[{id:"super",ic:"🔮",lbl:"Executive Briefing"},{id:"sprint",ic:"⚡",lbl:"Sprint Intelligence"},{id:"release",ic:"🚦",lbl:"Release Readiness"},{id:"research",ic:"🔍",lbl:"Research Agents"}]},
  {grp:"AI Workflows", items:[{id:"meetings",ic:"✦",lbl:"Meeting Intel"},{id:"prd",ic:"📄",lbl:"PRD Agent"},{id:"priority",ic:"◈",lbl:"Prioritization"},{id:"agents",ic:"⬡",lbl:"All Agents"}]},
  {grp:"Insights",     items:[{id:"optimizer",ic:"⚡",lbl:"Cost Optimizer"},{id:"decisions",ic:"📌",lbl:"Decision Log"},{id:"knowledge",ic:"🧠",lbl:"Knowledge"}]},
  {grp:"Metrics",      items:[{id:"okr",ic:"◎",lbl:"OKR Tracker"},{id:"tokens",ic:"◈",lbl:"Token Analytics"},{id:"outcomes",ic:"🎯",lbl:"Outcomes"},{id:"metrics",ic:"◎",lbl:"Pilot Metrics"}]},
  {grp:"People",       items:[{id:"stakeholders",ic:"◉",lbl:"Stakeholders"}]},
  {grp:"Settings",     items:[{id:"privacy",ic:"◈",lbl:"Privacy"},{id:"integrations",ic:"⚡",lbl:"Integrations"}]},
];

const PAGE_INFO: Record<string,{title:string;sub:string}> = {
  schedule:{title:"Daily Schedule",sub:"Live Google Calendar — click any date to load events"},
  todos:{title:"To-Do List",sub:"Tasks from Jira, meetings and Gmail — schedule any task to a future day"},
  tracker:{title:"Projects",sub:"Program Health Score computed from Jira signals — signal compression, not raw data"},
  meetings:{title:"Meeting Intel",sub:"Paste transcript → AI extracts decisions, action items and risks"},
  priority:{title:"Prioritization",sub:"Choose a framework and project — AI scores your backlog"},
  roadmap:{title:"Roadmap",sub:"Quarterly initiative planning across all projects"},
  okr:{title:"OKR Tracker",sub:"Key results · AI weekly and quarterly insights · outcome alignment"},
  sprint:{title:"Sprint Intelligence Agent",sub:"Autonomous sprint monitoring · detects risks · creates tasks · drafts alerts · no manual trigger needed"},
  release:{title:"Release Readiness Agent",sub:"Autonomous go/no-go · Jira + risks + stakeholders + OKRs · saves to Decision Log"},
  research:{title:"Research Agents",sub:"3 parallel agents · live web search · competitive, market and customer intelligence"},
  decisions:{title:"Decision Log",sub:"Every decision · rationale · data used · trade-offs · outcome status"},
  knowledge:{title:"Knowledge Memory",sub:"Past PRDs · insights · learnings · reusable patterns"},
  outcomes:{title:"Outcome Tracking",sub:"Feature impact post-launch · OKR contribution · business results"},
  optimizer:{title:"Token Cost Optimizer",sub:"Analyze any agent · reduce token spend · model recommendations · caching strategy"},
  super:{title:"Executive Briefing Agent",sub:"Autonomous multi-source intelligence · tools · cross-agent orchestration · writes back to platform"},
  agents:{title:"All Agents",sub:"All AI-powered automations — overview and quick launch"},
  prd:{title:"PRD Agent",sub:"Focus group data in → structured PRD out in seconds"},
  stakeholders:{title:"Stakeholders",sub:"Influence map with last-contact tracking"},
  metrics:{title:"Pilot Metrics",sub:"Adoption funnel · time saved · agent engagement"},
  tokens:{title:"Token Analytics",sub:"Cost per agent · daily trends · anomaly detection · FinOps"},
  privacy:{title:"Privacy Controls",sub:"Memory log, data flow audit and right to delete"},
  integrations:{title:"Integrations",sub:"Jira, Gmail and Google Calendar — auto-synced"},
};

const STATUS_COLOR:Record<string,string>={"on-track":"tag-grn","at-risk":"tag-amb","delayed":"tag-red","planning":"tag-pur"};
const BAR_COLOR:Record<string,string>={"on-track":"var(--grn)","at-risk":"var(--amb)","delayed":"var(--red)","planning":"var(--pur)"};
const KR_COLOR:Record<string,string>={"on-track":"var(--grn)","at-risk":"var(--amb)","planning":"var(--pur)"};
const KR_TAG:Record<string,string>={"on-track":"tag-grn","at-risk":"tag-amb","planning":"tag-pur"};
const AGE_TAG:Record<string,string>={recent:"tag-grn",old:"tag-amb",stale:"tag-red"};

const initials=(n:string)=>n.split(' ').map(x=>x[0]).join('').toUpperCase().slice(0,2);
const contactAge=(dt:string)=>{if(!dt)return"stale";const d=(Date.now()-new Date(dt).getTime())/86400000;return d<7?"recent":d<14?"old":"stale";};
const contactLabel=(dt:string)=>{if(!dt)return"Never";const d=Math.floor((Date.now()-new Date(dt).getTime())/86400000);return d===0?"Today":d===1?"1d ago":`${d}d ago`;};

const computeHealth=(issues:any[])=>{
  if(!issues.length)return null;
  const total=issues.length;
  const done=issues.filter(i=>["done","closed","resolved"].includes(i.status?.toLowerCase()||"")).length;
  const blocked=issues.filter(i=>(i.status||"").toLowerCase().includes("block")).length;
  const highBugs=issues.filter(i=>i.issue_type==="Bug"&&i.priority==="high").length;
  const rate=done/total;
  if(blocked>2||highBugs>3||rate<0.3)return"red";
  if(blocked>0||highBugs>1||rate<0.6)return"yellow";
  return"green";
};

function HealthBadge({score}:{score:string|null}){
  if(!score)return null;
  const cls=score==="green"?"h-green":score==="yellow"?"h-yellow":"h-red";
  const lbl=score==="green"?"🟢 On Track":score==="yellow"?"🟡 At Risk":"🔴 Off Track";
  return <span className={cls}>{lbl}</span>;
}

function Modal({title,onClose,children,wide=false}:any){
  return(
    <div className="modal-overlay" onClick={(e:any)=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={wide?{maxWidth:680}:{}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div className="modal-title">{title}</div>
          <button className="btn btn-sm" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MiniCalendar({selectedDate,onSelect,eventDates=[]}:{selectedDate:Date;onSelect:(d:Date)=>void;eventDates?:string[]}){
  const [expanded,setExpanded]=useState(false);
  const [viewMonth,setViewMonth]=useState(new Date(selectedDate.getFullYear(),selectedDate.getMonth(),1));
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const fn=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))setExpanded(false);};
    document.addEventListener("mousedown",fn);return()=>document.removeEventListener("mousedown",fn);
  },[]);
  const y=viewMonth.getFullYear(),m=viewMonth.getMonth();
  const firstDay=new Date(y,m,1).getDay();
  const dim=new Date(y,m+1,0).getDate();
  const today=new Date();
  const fmt=(d:Date)=>d.toISOString().split("T")[0];
  const cells:any[]=[];
  for(let i=0;i<firstDay;i++)cells.push({date:new Date(y,m,-(firstDay-i-1)),other:true});
  for(let d=1;d<=dim;d++)cells.push({date:new Date(y,m,d),other:false});
  while(cells.length<42)cells.push({date:new Date(y,m+1,cells.length-dim-firstDay+1),other:true});

  // Mini compact grid
  const miniItems=[];
  for(let d=1;d<=dim;d++){
    const date=new Date(y,m,d);
    const isTod=fmt(date)===fmt(today),isSel=fmt(date)===fmt(selectedDate),hasEv=eventDates.includes(fmt(date));
    miniItems.push(
      <div key={d} style={{width:17,height:15,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontFamily:"DM Mono",borderRadius:3,
        background:isSel?"var(--pur)":isTod?"var(--acc)":"transparent",
        color:isSel||isTod?"#000":"var(--mut)",position:"relative",cursor:"pointer"}}
        onClick={()=>{onSelect(date);setViewMonth(new Date(y,m,1));}}>
        {d}
        {hasEv&&<div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:3,height:3,borderRadius:"50%",background:isSel||isTod?"#000":"var(--pur)"}}/>}
      </div>
    );
  }

  return(
    <div className="mini-cal" ref={ref}>
      <div className="mini-cal-grid" onClick={()=>setExpanded(!expanded)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
          <span style={{fontFamily:"DM Mono",fontSize:10,color:"var(--acc)"}}>{viewMonth.toLocaleDateString("en-US",{month:"short",year:"numeric"})}</span>
          <span style={{fontSize:9,color:"var(--mut)"}}>{expanded?"▴":"▾"}</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1}}>
          {["S","M","T","W","T","F","S"].map((d,i)=><div key={i} style={{width:17,height:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontFamily:"DM Mono",color:"var(--mut)"}}>{d}</div>)}
          {miniItems}
        </div>
      </div>
      {expanded&&(
        <div className="cal-expanded">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <button className="btn btn-sm" onClick={e=>{e.stopPropagation();setViewMonth(new Date(y,m-1,1));}}>‹</button>
            <span style={{fontFamily:"Syne",fontWeight:700,fontSize:13}}>{viewMonth.toLocaleDateString("en-US",{month:"long",year:"numeric"})}</span>
            <button className="btn btn-sm" onClick={e=>{e.stopPropagation();setViewMonth(new Date(y,m+1,1));}}>›</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:3}}>
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d,i)=><div key={i} style={{height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontFamily:"DM Mono",color:"var(--mut)"}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
            {cells.map((item,idx)=>{
              const isTod=fmt(item.date)===fmt(today);
              const isSel=fmt(item.date)===fmt(selectedDate);
              const hasEv=eventDates.includes(fmt(item.date));
              return(
                <div key={idx}
                  className={`cal-day${isTod?" today":""}${isSel?" selected-day":""}${hasEv?" has-event":""}${item.other?" other-month":""}`}
                  onClick={()=>{onSelect(item.date);setExpanded(false);}}>
                  {item.date.getDate()}
                </div>
              );
            })}
          </div>
          <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid var(--bdr)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <button className="btn btn-sm" onClick={()=>{onSelect(today);setViewMonth(new Date(today.getFullYear(),today.getMonth(),1));setExpanded(false);}}>Today</button>
            <span style={{fontSize:10,color:"var(--mut)",fontFamily:"DM Mono"}}>{selectedDate.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PMDashboard(){
  const [page,setPage]=useState("schedule");
  const [user,setUser]=useState<any>(null);
  const [isSyncing,setIsSyncing]=useState(false);
  const syncRunning=useRef(false);

  // Tasks
  const [todos,setTodos]=useState<any[]>([]);
  const [todosLoading,setTodosLoading]=useState(true);
  const [showAddTask,setShowAddTask]=useState(false);
  const [newTask,setNewTask]=useState({title:"",priority:"med",scheduled_date:""});

  // Projects
  const [projects,setProjects]=useState<any[]>([]);
  const [projLoading,setProjLoading]=useState(true);
  const [showAddProj,setShowAddProj]=useState(false);
  const [editProj,setEditProj]=useState<any>(null);
  const [projForm,setProjForm]=useState({name:"",owner:"",status:"planning",progress:0,due_date:"",priority:"med",research_summary:"",competitive_summary:""});
  const [expandedProj,setExpandedProj]=useState<string|null>(null);

  // Meetings
  const [meetings,setMeetings]=useState<any[]>([]);
  const [meetLoading,setMeetLoading]=useState(true);
  const [showAddMeet,setShowAddMeet]=useState(false);
  const [meetForm,setMeetForm]=useState({title:"",meeting_time:"",raw_transcript:""});
  const [meetProcessing,setMeetProcessing]=useState(false);
  const [editingAction,setEditingAction]=useState<{meetingId:string;idx:number;item:any}|null>(null);
  const [actionForm,setActionForm]=useState({text:"",owner:"",priority:"med",due_date:""});

  // OKRs
  const [okrs,setOkrs]=useState<any[]>([]);
  const [okrsLoading,setOkrsLoading]=useState(true);
  const [expandedOkr,setExpandedOkr]=useState<number[]>([]);
  const [editingKR,setEditingKR]=useState<string|null>(null);
  const [krEditVal,setKrEditVal]=useState("");
  const [showAddOkr,setShowAddOkr]=useState(false);
  const [okrForm,setOkrForm]=useState({objective:"",owner:"",color:"#00d4ff",icon:"🎯"});
  const [okrInsight,setOkrInsight]=useState<{okr:any;data:any;type:string}|null>(null);
  const [generatingInsight,setGeneratingInsight]=useState<string|null>(null);
  const [selectedOkrProj,setSelectedOkrProj]=useState("all");

  // Stakeholders
  const [stakeholders,setStakeholders]=useState<any[]>([]);
  const [shLoading,setShLoading]=useState(true);
  const [shFilter,setShFilter]=useState("All");
  const [showAddSh,setShowAddSh]=useState(false);
  const [editSh,setEditSh]=useState<any>(null);
  const [shForm,setShForm]=useState({name:"",role:"",email:"",type:"Internal — Engineering",influence:3,color:"#00d4ff"});

  // Privacy
  const [memLog,setMemLog]=useState<any[]>([]);
  const [privTogs,setPrivTogs]=useState({persist:true,learn:true,session:false,audit:true});

  // PRD
  const [prdInput,setPrdInput]=useState("");
  const [prdStatus,setPrdStatus]=useState("idle");
  const [prdResult,setPrdResult]=useState<any>(null);

  // Agents
  const [agentRunning,setAgentRunning]=useState<string|null>(null);
  const [agentResult,setAgentResult]=useState<any>(null);
  const [agentResultType,setAgentResultType]=useState<string|null>(null);
  const [agentError,setAgentError]=useState<string|null>(null);
  const [updateInput,setUpdateInput]=useState({show:false,name:"",role:""});

  // Integrations
  const [integrations,setIntegrations]=useState<any[]>([]);
  const [jiraIssues,setJiraIssues]=useState<any[]>([]);
  const [gmailThreads,setGmailThreads]=useState<any[]>([]);
  const [calendarEvents,setCalEvents]=useState<any[]>([]);
  const [syncingInt,setSyncingInt]=useState<string|null>(null);
  const [showCreateJira,setShowCreateJira]=useState(false);
  const [jiraForm,setJiraForm]=useState({summary:"",description:"",projectKey:"PM",priority:"med",issueType:"Task"});
  const [showAddCal,setShowAddCal]=useState(false);
  const [calForm,setCalForm]=useState({title:"",startTime:"",endTime:"",attendees:"",description:""});
  const [agentRuns,setAgentRuns]=useState<any[]>([]);
  const [riceScores,setRiceScores]=useState<any[]>([]);
  const [selectedCalDate,setSelectedCalDate]=useState(new Date());

  // Prioritization
  const [prioFw,setPrioFw]=useState("rice");
  const [prioProjId,setPrioProjId]=useState("all");
  const [moscowItems,setMoscowItems]=useState<any[]>([]);
  const [showAddMoscow,setShowAddMoscow]=useState(false);
  const [moscowForm,setMoscowForm]=useState({title:"",bucket:"must",project:""});
  const [okrAlign,setOkrAlign]=useState({vision:[] as string[],goals:[] as string[],features:[] as string[]});
  const [showAddAlign,setShowAddAlign]=useState<string|null>(null);
  const [newAlignText,setNewAlignText]=useState("");

  // Roadmap
  const [roadmapItems,setRoadmapItems]=useState<any[]>([]);
  const [showAddRoadmap,setShowAddRoadmap]=useState(false);
  const [rmForm,setRmForm]=useState({title:"",project:"",startQ:0,endQ:1,color:"#00d4ff"});
  const [rmYear,setRmYear]=useState(new Date().getFullYear());

  // Calendar date for todos
  const [selectedTodoDate,setSelectedTodoDate]=useState(new Date());

  // Sprint Intelligence
  const [siProject,setSiProject]=useState("");
  const [siProjectKey,setSiProjectKey]=useState("");
  const [siRunning,setSiRunning]=useState(false);
  const [siResult,setSiResult]=useState<any>(null);
  const [siError,setSiError]=useState<string|null>(null);
  const [siStep,setSiStep]=useState(0);

  // Release Readiness
  const [rrProject,setRrProject]=useState("");
  const [rrScope,setRrScope]=useState("");
  const [rrRunning,setRrRunning]=useState(false);
  const [rrResult,setRrResult]=useState<any>(null);
  const [rrError,setRrError]=useState<string|null>(null);
  const [rrStep,setRrStep]=useState(0);

  // Research Agents
  const [researchProduct,setResearchProduct]=useState("");
  const [researchContext,setResearchContext]=useState("");
  const [researchProject,setResearchProject]=useState("");
  const [researchRunning,setResearchRunning]=useState(false);
  const [researchResult,setResearchResult]=useState<any>(null);
  const [researchError,setResearchError]=useState<string|null>(null);
  const [researchTab,setResearchTab]=useState("synthesis");
  const [researchStep,setResearchStep]=useState(0);

  // Decision Log
  const [decisions,setDecisions]=useState<any[]>([]);
  const [showAddDecision,setShowAddDecision]=useState(false);
  const [decisionForm,setDecisionForm]=useState({title:"",decision:"",rationale:"",trade_offs:"",project_id:"",tags:""});

  // Knowledge
  const [knowledgeItems,setKnowledgeItems]=useState<any[]>([]);
  const [knowledgeFilter,setKnowledgeFilter]=useState("all");
  const [showAddKnowledge,setShowAddKnowledge]=useState(false);
  const [knowledgeForm,setKnowledgeForm]=useState({type:"insight",title:"",content:"",tags:""});

  // Outcomes
  const [outcomes,setOutcomes]=useState<any[]>([]);
  const [showAddOutcome,setShowAddOutcome]=useState(false);
  const [outcomeForm,setOutcomeForm]=useState({feature_name:"",project_id:"",hypothesis:"",target_metric:"",target_value:"",measurement_date:""});

  // Risk predictions
  const [riskPredictions,setRiskPredictions]=useState<any[]>([]);

  // Cost anomalies
  const [costAnomalies,setCostAnomalies]=useState<any[]>([]);
  const [budgetStatus,setBudgetStatus]=useState<any>(null);

  // Feedback
  const [feedbackEvents,setFeedbackEvents]=useState<any[]>([]);

  // Cost Optimizer
  const [optAgentName,setOptAgentName]=useState("super-agent");
  const [optPrompt,setOptPrompt]=useState("");
  const [optMemory,setOptMemory]=useState("");
  const [optTools,setOptTools]=useState("");
  const [optWorkflow,setOptWorkflow]=useState("single-agent");
  const [optFreq,setOptFreq]=useState("medium");
  const [optRunning,setOptRunning]=useState(false);
  const [optResult,setOptResult]=useState<any>(null);
  const [optError,setOptError]=useState<string|null>(null);
  const [optExpanded,setOptExpanded]=useState<Record<string,boolean>>({summary:true,tokens:true,prompt:true,memory:false,tools:false,model:true,cache:false,workflow:false,reco:true});

  // Token Analytics
  const [tokenUsage,setTokenUsage]=useState<any[]>([]);
  const [tokenWorkflows,setTokenWorkflows]=useState<any[]>([]);
  const [tokenRollup,setTokenRollup]=useState<any[]>([]);
  const [tokenLoading,setTokenLoading]=useState(false);

  // Super Agent
  const [superRequest,setSuperRequest]=useState("");
  const [superFocus,setSuperFocus]=useState("all");
  const [superRunning,setSuperRunning]=useState(false);
  const [superResult,setSuperResult]=useState<any>(null);
  const [superError,setSuperError]=useState<string|null>(null);
  const [superExpanded,setSuperExpanded]=useState<Record<string,boolean>>({exec:true,prd:true,risks:true,prio:true,sources:false,eval:false,changed:true,decisions_needed:true,actions_taken:true});
  const [thinkStep,setThinkStep]=useState(0);

  /* ── Auth ── */
  useEffect(()=>{
    supabase.auth.getUser().then(({data:{user}})=>setUser(user));
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_,s)=>setUser(s?.user??null));
    return()=>subscription.unsubscribe();
  },[]);

  /* ── Loaders ── */
  const loadTasks=useCallback(async()=>{setTodosLoading(true);const{data}=await supabase.from("tasks").select("*").order("created_at",{ascending:false});if(data)setTodos(data);setTodosLoading(false);},[]);
  const loadProjects=useCallback(async()=>{setProjLoading(true);const{data}=await supabase.from("projects").select("*").order("created_at");if(data)setProjects(data);setProjLoading(false);},[]);
  const loadMeetings=useCallback(async()=>{setMeetLoading(true);const{data}=await supabase.from("meetings").select("*").order("meeting_time",{ascending:false});if(data)setMeetings(data);setMeetLoading(false);},[]);
  const loadOkrs=useCallback(async()=>{
    setOkrsLoading(true);
    const{data:od}=await supabase.from("okrs").select("*").order("sort_order");
    if(od){
      const wk=await Promise.all(od.map(async o=>{const{data:krs}=await supabase.from("key_results").select("*").eq("okr_id",o.id).order("sort_order");return{...o,krs:krs||[]};}));
      setOkrs(wk);setExpandedOkr(wk.map((_,i)=>i));
    }
    setOkrsLoading(false);
  },[]);
  const loadStakeholders=useCallback(async()=>{
    setShLoading(true);
    const{data}=await supabase.from("stakeholders").select("*, stakeholder_projects(project_id, projects(name))").order("name");
    if(data)setStakeholders(data.map((s:any)=>({...s,proj:s.stakeholder_projects?.map((sp:any)=>sp.projects?.name).filter(Boolean)||[]})));
    setShLoading(false);
  },[]);
  const loadMemory=useCallback(async()=>{const{data}=await supabase.from("memory_log").select("*").order("created_at",{ascending:false});if(data)setMemLog(data);},[]);
  const loadIntegrations=useCallback(async()=>{const{data}=await supabase.from("integrations").select("*");if(data)setIntegrations(data);},[]);
  const loadJira=useCallback(async()=>{const{data}=await supabase.from("jira_issues").select("*").order("jira_updated_at",{ascending:false}).limit(100);if(data)setJiraIssues(data);},[]);
  const loadGmail=useCallback(async()=>{const{data}=await supabase.from("gmail_threads").select("*").order("received_at",{ascending:false}).limit(30);if(data)setGmailThreads(data);},[]);
  const loadCal=useCallback(async()=>{const{data}=await supabase.from("schedule_blocks").select("*").order("start_time");if(data)setCalEvents(data);},[]);
  const loadAgentRuns=useCallback(async()=>{const{data}=await supabase.from("agent_runs").select("*").order("ran_at",{ascending:false}).limit(20);if(data)setAgentRuns(data);},[]);
  const loadRice=useCallback(async()=>{const{data}=await supabase.from("rice_scores").select("*").order("rice_score",{ascending:false});if(data)setRiceScores(data);},[]);
  const loadMoscow=useCallback(async()=>{const{data}=await supabase.from("moscow_items").select("*").order("created_at").catch(()=>({data:[]}));if(data)setMoscowItems(data);},[]);
  const loadRoadmap=useCallback(async()=>{const{data}=await supabase.from("roadmap_items").select("*").order("start_quarter").catch(()=>({data:[]}));if(data)setRoadmapItems(data);},[]);
  const loadAlign=useCallback(async()=>{const{data}=await supabase.from("okr_alignment").select("*").limit(1).catch(()=>({data:[]}));if(data&&data[0])setOkrAlign(data[0]);},[]);
  const loadDecisions=useCallback(async()=>{const{data}=await supabase.from("decision_log").select("*,projects(name)").order("created_at",{ascending:false}).catch(()=>({data:[]}));if(data)setDecisions(data);},[]);
  const loadKnowledge=useCallback(async()=>{const{data}=await supabase.from("knowledge_items").select("*").order("created_at",{ascending:false}).catch(()=>({data:[]}));if(data)setKnowledgeItems(data);},[]);
  const loadOutcomes=useCallback(async()=>{const{data}=await supabase.from("outcomes").select("*,projects(name),okrs(objective)").order("created_at",{ascending:false}).catch(()=>({data:[]}));if(data)setOutcomes(data);},[]);
  const loadRiskPreds=useCallback(async()=>{const{data}=await supabase.from("risk_predictions").select("*,projects(name)").eq("status","active").order("detected_at",{ascending:false}).catch(()=>({data:[]}));if(data)setRiskPredictions(data);},[]);
  const loadCostAnomalies=useCallback(async()=>{const{data}=await supabase.from("v_cost_anomalies").select("*").limit(10).catch(()=>({data:[]}));if(data)setCostAnomalies(data);const{data:bs}=await supabase.from("v_budget_status").select("*").limit(1).catch(()=>({data:[]}));if(bs&&bs[0])setBudgetStatus(bs[0]);},[]);
  const loadFeedback=useCallback(async()=>{const{data}=await supabase.from("feedback_events").select("*").order("created_at",{ascending:false}).limit(30).catch(()=>({data:[]}));if(data)setFeedbackEvents(data);},[]);
  const loadTokens=useCallback(async()=>{
    setTokenLoading(true);
    const[a,b,c]=await Promise.allSettled([
      supabase.from("token_usage").select("*").order("created_at",{ascending:false}).limit(100),
      supabase.from("token_workflows").select("*").order("started_at",{ascending:false}).limit(20),
      supabase.from("token_daily_rollup").select("*").order("date",{ascending:false}).limit(60),
    ]);
    if(a.status==="fulfilled"&&a.value.data)setTokenUsage(a.value.data);
    if(b.status==="fulfilled"&&b.value.data)setTokenWorkflows(b.value.data);
    if(c.status==="fulfilled"&&c.value.data)setTokenRollup(c.value.data);
    setTokenLoading(false);
  },[]);

  useEffect(()=>{
    loadTasks();loadProjects();loadMeetings();loadOkrs();loadStakeholders();loadMemory();
    loadIntegrations();loadJira();loadGmail();loadCal();loadAgentRuns();loadRice();
    loadMoscow();loadRoadmap();loadAlign();loadTokens();loadDecisions();loadKnowledge();loadOutcomes();loadRiskPreds();loadCostAnomalies();loadFeedback();
  },[loadTasks,loadProjects,loadMeetings,loadOkrs,loadStakeholders,loadMemory,
     loadIntegrations,loadJira,loadGmail,loadCal,loadAgentRuns,loadRice,loadMoscow,loadRoadmap,loadAlign,loadTokens,loadDecisions,loadKnowledge,loadOutcomes,loadRiskPreds,loadCostAnomalies,loadFeedback]);

  useEffect(()=>{
    if(!user)return;
    supabase.from("user_settings").select("*").eq("user_id",user.id).single().then(({data})=>{if(data)setPrivTogs({persist:data.persistent_memory,learn:data.agent_learning,session:data.session_only,audit:data.audit_log});});
  },[user]);

  /* ── Realtime ── */
  useEffect(()=>{
    const ch=supabase.channel("rt")
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"tasks"},p=>setTodos(prev=>[p.new,...prev]))
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"tasks"},p=>setTodos(prev=>prev.map((t:any)=>t.id===p.new.id?p.new:t)))
      .on("postgres_changes",{event:"DELETE",schema:"public",table:"tasks"},p=>setTodos(prev=>prev.filter((t:any)=>t.id!==p.old.id)))
      .on("postgres_changes",{event:"*",schema:"public",table:"projects"},()=>loadProjects())
      .on("postgres_changes",{event:"*",schema:"public",table:"integrations"},()=>loadIntegrations())
      .on("postgres_changes",{event:"*",schema:"public",table:"jira_issues"},()=>{loadJira();loadTasks();})
      .on("postgres_changes",{event:"*",schema:"public",table:"schedule_blocks"},()=>loadCal())
      .on("postgres_changes",{event:"*",schema:"public",table:"agent_runs"},()=>loadAgentRuns())
      .subscribe();
    return()=>supabase.removeChannel(ch);
  },[loadProjects,loadIntegrations,loadJira,loadTasks,loadCal,loadAgentRuns]);

  /* ── Auto-sync ── */
  const autoSync=useCallback(async()=>{
    if(syncRunning.current)return;
    syncRunning.current=true;setIsSyncing(true);
    try{
      await Promise.allSettled([
        supabase.functions.invoke("jira-sync",{body:{action:"pull"}}),
        supabase.functions.invoke("gmail-sync",{body:{action:"pull"}}),
        supabase.functions.invoke("calendar-sync",{body:{date:new Date().toISOString().split("T")[0]}}),
      ]);
      await Promise.allSettled([loadIntegrations(),loadJira(),loadGmail(),loadCal(),loadTasks(),loadProjects()]);
    }finally{syncRunning.current=false;setIsSyncing(false);}
  },[loadIntegrations,loadJira,loadGmail,loadCal,loadTasks,loadProjects]);

  useEffect(()=>{autoSync();},[autoSync]);
  useEffect(()=>{
    const fn=()=>{if(document.visibilityState==="visible")autoSync();};
    document.addEventListener("visibilitychange",fn);window.addEventListener("focus",fn);
    return()=>{document.removeEventListener("visibilitychange",fn);window.removeEventListener("focus",fn);};
  },[autoSync]);
  useEffect(()=>{const t=setInterval(autoSync,5*60*1000);return()=>clearInterval(t);},[autoSync]);

  /* ── Sync fns ── */
  const syncJira=async(pk?:string)=>{setSyncingInt("jira");const{data,error}=await supabase.functions.invoke("jira-sync",{body:{action:"pull",projectKey:pk}});setSyncingInt(null);if(error){alert("Jira: "+error.message);return;}await Promise.all([loadJira(),loadTasks(),loadProjects(),loadIntegrations()]);alert(`Jira: ${data?.synced||0} synced`);};
  const syncGmail=async()=>{setSyncingInt("gmail");const{data,error}=await supabase.functions.invoke("gmail-sync",{body:{action:"pull"}});setSyncingInt(null);if(error){alert("Gmail: "+error.message);return;}await Promise.all([loadGmail(),loadTasks(),loadIntegrations()]);alert(`Gmail: ${data?.synced||0} synced`);};
  const syncCal=async(date?:string)=>{setSyncingInt("calendar");const{data,error}=await supabase.functions.invoke("calendar-sync",{body:{date}});setSyncingInt(null);if(error){alert("Calendar: "+error.message);return;}await Promise.all([loadCal(),loadIntegrations()]);return data?.events||[];};
  const createCalEvent=async()=>{
    if(!calForm.title.trim()||!calForm.startTime)return;
    setSyncingInt("cal-create");
    const date=selectedCalDate.toISOString().split("T")[0];
    const{data,error}=await supabase.functions.invoke("calendar-sync",{body:{action:"create_event",title:calForm.title,startTime:`${date}T${calForm.startTime}:00`,endTime:`${date}T${calForm.endTime||calForm.startTime}:00`,attendees:calForm.attendees.split(",").map((e:string)=>e.trim()).filter(Boolean),description:calForm.description}});
    setSyncingInt(null);if(error){alert("Failed: "+error.message);return;}
    setShowAddCal(false);setCalForm({title:"",startTime:"",endTime:"",attendees:"",description:""});
    await loadCal();alert(`Created! Meet: ${data?.meet_link||"none"}`);
  };
  const deleteCalEvent=async(ev:any)=>{
    if(!window.confirm("Delete from Google Calendar?"))return;
    if(ev.calendar_event_id)await supabase.functions.invoke("calendar-sync",{body:{action:"delete_event",eventId:ev.calendar_event_id}});
    await supabase.from("schedule_blocks").delete().eq("id",ev.id);loadCal();
  };
  const createJira=async()=>{
    if(!jiraForm.summary.trim())return;
    setSyncingInt("jira-c");const{data,error}=await supabase.functions.invoke("jira-sync",{body:{action:"create_issue",issueData:jiraForm}});setSyncingInt(null);
    if(error){alert("Failed: "+error.message);return;}
    setShowCreateJira(false);setJiraForm({summary:"",description:"",projectKey:"PM",priority:"med",issueType:"Task"});
    await Promise.all([loadJira(),loadTasks()]);alert(`Created ${data?.jira_key}`);
  };
  const markGmailRead=async(tid:string)=>{await supabase.functions.invoke("gmail-sync",{body:{action:"mark_read",threadId:tid}});setGmailThreads(p=>p.map((t:any)=>t.thread_id===tid?{...t,is_read:true}:t));};
  const getIntSt=(name:string)=>integrations.find(i=>i.name===name)||{status:"disconnected"};

  /* ── Task CRUD ── */
  const todayStr=new Date().toISOString().split("T")[0];
  const selDateStr=selectedTodoDate.toISOString().split("T")[0];
  const filteredTodos=todos.filter((t:any)=>{
    if(t.scheduled_date)return t.scheduled_date===selDateStr;
    return selDateStr===todayStr;
  });
  const toggleTodo=async(t:any)=>{
    const ns=t.status==="done"?"open":"done";
    setTodos(p=>p.map((x:any)=>x.id===t.id?{...x,status:ns}:x));
    await supabase.from("tasks").update({status:ns}).eq("id",t.id);
    if(t.jira_key)supabase.functions.invoke("jira-sync",{body:{action:"transition_issue",issueData:{jiraKey:t.jira_key,transitionName:ns==="done"?"done":"in progress"}}}).then(undefined,()=>{});
  };
  const addTask=async()=>{
    if(!newTask.title.trim())return;
    await supabase.from("tasks").insert({title:newTask.title.trim(),priority:newTask.priority,status:"open",source:"manual",user_id:user?.id,scheduled_date:newTask.scheduled_date||null});
    setNewTask({title:"",priority:"med",scheduled_date:""});setShowAddTask(false);
  };
  const deleteTask=async(id:string)=>{if(!window.confirm("Delete task?"))return;setTodos(p=>p.filter((t:any)=>t.id!==id));await supabase.from("tasks").delete().eq("id",id);};
  const updatePriority=async(id:string,priority:string)=>{setTodos(p=>p.map((t:any)=>t.id===id?{...t,priority}:t));await supabase.from("tasks").update({priority}).eq("id",id);};
  const reschedule=async(id:string,date:string)=>{setTodos(p=>p.map((t:any)=>t.id===id?{...t,scheduled_date:date||null}:t));await supabase.from("tasks").update({scheduled_date:date||null}).eq("id",id);};

  /* ── Project CRUD ── */
  const openAddProj=()=>{setProjForm({name:"",owner:"",status:"planning",progress:0,due_date:"",priority:"med",research_summary:"",competitive_summary:""});setEditProj(null);setShowAddProj(true);};
  const openEditProj=(p:any)=>{setProjForm({name:p.name,owner:p.owner||"",status:p.status,progress:p.progress,due_date:p.due_date||"",priority:p.priority||"med",research_summary:p.research_summary||"",competitive_summary:p.competitive_summary||""});setEditProj(p);setShowAddProj(true);};
  const saveProject=async()=>{
    if(!projForm.name.trim())return;
    const payload={name:projForm.name.trim(),owner:projForm.owner,status:projForm.status,progress:parseInt(String(projForm.progress))||0,due_date:projForm.due_date||null,priority:projForm.priority,research_summary:projForm.research_summary||null,competitive_summary:projForm.competitive_summary||null};
    if(editProj){
      await supabase.from("projects").update(payload).eq("id",editProj.id);
      if(editProj.jira_key)supabase.functions.invoke("jira-sync",{body:{action:"update_issue",issueData:{jiraKey:editProj.jira_key,fields:{summary:payload.name}}}}).then(undefined,()=>{});
    }else{
      const{data:np}=await supabase.from("projects").insert({...payload,user_id:user?.id}).select().single();
      const{data:jd}=await supabase.functions.invoke("jira-sync",{body:{action:"create_issue",issueData:{summary:payload.name,description:`Owner: ${payload.owner||"TBD"}`,projectKey:"PM",priority:"med",issueType:"Epic"}}}).catch(()=>({data:null}));
      if(jd?.jira_key&&np?.id)await supabase.from("projects").update({jira_key:jd.jira_key}).eq("id",np.id);
    }
    setShowAddProj(false);loadProjects();
  };
  const deleteProject=async(id:string)=>{if(!window.confirm("Delete project?"))return;await supabase.from("projects").delete().eq("id",id);loadProjects();};

  /* ── Meeting CRUD ── */
  const saveMeeting=async()=>{
    if(!meetForm.title.trim())return;
    setMeetProcessing(true);
    const{data}=await supabase.from("meetings").insert({title:meetForm.title.trim(),meeting_time:meetForm.meeting_time||new Date().toISOString(),raw_transcript:meetForm.raw_transcript,user_id:user?.id}).select().single();
    if(data&&meetForm.raw_transcript.trim())await supabase.functions.invoke("meeting-scribe",{body:{transcript:meetForm.raw_transcript,title:meetForm.title,meetingId:data.id}});
    setMeetProcessing(false);setShowAddMeet(false);setMeetForm({title:"",meeting_time:"",raw_transcript:""});loadMeetings();
  };
  const deleteMeeting=async(id:string)=>{if(!window.confirm("Remove meeting?"))return;await supabase.from("meetings").delete().eq("id",id);loadMeetings();};
  const saveActionEdit=async()=>{
    if(!editingAction)return;
    const items=[...editingAction.item.parent];
    items[editingAction.idx]={...items[editingAction.idx],...actionForm};
    await supabase.from("meetings").update({action_items:items}).eq("id",editingAction.meetingId);
    setEditingAction(null);loadMeetings();
  };

  /* ── OKR CRUD ── */
  const startEditKR=(kr:any)=>{setEditingKR(kr.id);setKrEditVal(String(kr.current_val??0));};
  const saveKR=async(kr:any)=>{const v=parseFloat(krEditVal);if(isNaN(v)){setEditingKR(null);return;}await supabase.from("key_results").update({current_val:v}).eq("id",kr.id);setEditingKR(null);loadOkrs();};
  const toggleOkr=(i:number)=>setExpandedOkr(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]);
  const addOkr=async()=>{
    if(!okrForm.objective.trim())return;
    await supabase.from("okrs").insert({...okrForm,overall_pct:0,quarter:"Q2-2025",user_id:user?.id,sort_order:okrs.length+1});
    setShowAddOkr(false);setOkrForm({objective:"",owner:"",color:"#00d4ff",icon:"🎯"});loadOkrs();
  };
  const deleteOkr=async(id:string)=>{if(!window.confirm("Delete objective?"))return;await supabase.from("okrs").delete().eq("id",id);loadOkrs();};
  const genOkrInsight=async(okr:any,type:string)=>{
    setGeneratingInsight(okr.id+type);
    try{
      const{data}=await supabase.functions.invoke("weekly-digest",{body:{okrContext:{objective:okr.objective,krs:okr.krs,type}}});
      setOkrInsight({okr,data,type});
    }catch(e:any){alert("Insight failed: "+e.message);}
    setGeneratingInsight(null);
  };

  /* ── Stakeholders ── */
  const openAddSh=()=>{setShForm({name:"",role:"",email:"",type:"Internal — Engineering",influence:3,color:"#00d4ff"});setEditSh(null);setShowAddSh(true);};
  const openEditSh=(s:any)=>{setShForm({name:s.name,role:s.role||"",email:s.email||"",type:s.type||"",influence:s.influence||3,color:s.color||"#00d4ff"});setEditSh(s);setShowAddSh(true);};
  const saveSh=async()=>{
    if(!shForm.name.trim())return;
    const p={name:shForm.name.trim(),role:shForm.role,email:shForm.email,type:shForm.type,influence:parseInt(String(shForm.influence)),color:shForm.color,initials:initials(shForm.name)};
    if(editSh)await supabase.from("stakeholders").update(p).eq("id",editSh.id);
    else await supabase.from("stakeholders").insert({...p,user_id:user?.id});
    setShowAddSh(false);loadStakeholders();
  };
  const deleteSh=async(id:string)=>{await supabase.from("stakeholders").delete().eq("id",id);loadStakeholders();};
  const markContacted=async(id:string)=>{await supabase.from("stakeholders").update({last_contacted_at:new Date().toISOString()}).eq("id",id);loadStakeholders();};

  /* ── Privacy ── */
  const forgetMem=async(id:string)=>{setMemLog(m=>m.filter((x:any)=>x.id!==id));await supabase.from("memory_log").delete().eq("id",id);};
  const forgetAll=async()=>{setMemLog([]);await supabase.from("memory_log").delete().eq("user_id",user?.id);};
  const togglePriv=async(key:string)=>{const n={...privTogs,[key]:!(privTogs as any)[key]};setPrivTogs(n);await supabase.from("user_settings").upsert({user_id:user?.id,persistent_memory:n.persist,agent_learning:n.learn,session_only:n.session,audit_log:n.audit});};

  /* ── PRD ── */
  const runPRD=async()=>{
    if(!prdInput.trim())return;
    setPrdStatus("processing");
    try{
      const{data}=await supabase.functions.invoke("prd-agent",{body:{text:prdInput}});
      if(data){setPrdResult({themes:data.themes?.map((t:any)=>({lbl:t.label,n:t.frequency}))||[],problem:data.problem_statement||"",stories:data.user_stories?.map((s:any)=>`As a ${s.role}, I want ${s.goal} so that ${s.outcome}.`)||[],criteria:data.acceptance_criteria||[],metrics:data.success_metrics?.map((m:any)=>`${m.metric}: ${m.baseline} → ${m.target}`)||[],questions:data.open_questions||[]});setPrdStatus("done");}
    }catch{setPrdStatus("idle");alert("PRD Agent failed.");}
  };

  /* ── Agent runners ── */
  const runAgent=async(name:string,body:any)=>{
    setAgentRunning(name);setAgentError(null);setAgentResult(null);
    try{const{data,error}=await supabase.functions.invoke(name,{body});if(error)throw new Error(error.message);if(data?.error)throw new Error(data.error);setAgentResult(data);setAgentResultType(name);}
    catch(e:any){setAgentError(e.message);setAgentResultType("error");}
    finally{setAgentRunning(null);}
  };
  const runPrio=async()=>{
    const items=(prioProjId==="all"?projects:projects.filter(p=>p.id===prioProjId)).map(p=>({title:p.name,description:`Status:${p.status},Progress:${p.progress}%`}));
    if(!items.length){setAgentError("No projects to score.");setAgentResultType("error");return;}
    await runAgent("prioritization",{items});loadRice();
  };
  const runDigest=()=>runAgent("weekly-digest",{});
  const runRisk=async()=>{await runAgent("risk-monitor",{});loadProjects();loadTasks();};
  const runSHUpdate=(name:string,role:string)=>{setUpdateInput({show:false,name:"",role:""});runAgent("stakeholder-update",{recipientName:name||undefined,recipientRole:role||undefined});};
  const closeResult=()=>{setAgentResult(null);setAgentResultType(null);setAgentError(null);};

  /* ── OKR Alignment ── */
  const addAlignItem=async(section:string)=>{
    if(!newAlignText.trim())return;
    const updated={...okrAlign,[section]:[...(okrAlign as any)[section],newAlignText.trim()]};
    setOkrAlign(updated);setNewAlignText("");setShowAddAlign(null);
    await supabase.from("okr_alignment").upsert({user_id:user?.id,...updated},{onConflict:"user_id"}).then(undefined,()=>{});
  };
  const removeAlignItem=async(section:string,idx:number)=>{
    const arr=[...(okrAlign as any)[section]];arr.splice(idx,1);
    const updated={...okrAlign,[section]:arr};setOkrAlign(updated);
    await supabase.from("okr_alignment").upsert({user_id:user?.id,...updated},{onConflict:"user_id"}).then(undefined,()=>{});
  };

  /* ── Roadmap ── */
  const saveRm=async()=>{if(!rmForm.title.trim())return;await supabase.from("roadmap_items").insert({...rmForm,year:rmYear,user_id:user?.id}).then(undefined,()=>{});setShowAddRoadmap(false);setRmForm({title:"",project:"",startQ:0,endQ:1,color:"#00d4ff"});loadRoadmap();};
  const deleteRm=async(id:string)=>{await supabase.from("roadmap_items").delete().eq("id",id).then(undefined,()=>{});loadRoadmap();};

  /* ── Sprint Intelligence ── */
  const SI_STEPS=["Fetching Jira sprint issues…","Analyzing velocity trend across sprints…","Deep-diving blockers and durations…","Checking assignee workload distribution…","Correlating meeting actions with blockers…","Assessing OKR impact of delays…","Running autonomous action tools…","Self-evaluating and finalizing…"];
  const runSprintIntelligence=async()=>{
    if(!siProject)return;
    const proj=projects.find(p=>p.name===siProject);
    const key=proj?.jira_key||siProjectKey;
    if(!key){setSiError("This project has no Jira key. Sync Jira or enter a key.");return;}
    setSiRunning(true);setSiResult(null);setSiError(null);setSiStep(0);
    const iv=setInterval(()=>setSiStep(s=>Math.min(s+1,SI_STEPS.length-1)),2200);
    try{
      const{data,error}=await supabase.functions.invoke("sprint-intelligence-agent",{body:{projectName:siProject,projectKey:key,projectId:proj?.id||null,userId:user?.id}});
      if(error)throw new Error(error.message);if(data?.error)throw new Error(data.error);
      setSiResult(data);loadDecisions();loadRiskPreds();loadAgentRuns();loadTasks();
    }catch(e:any){setSiError(e.message);}
    finally{clearInterval(iv);setSiStep(SI_STEPS.length-1);setSiRunning(false);}
  };
  const siColor=(s:string)=>s==="green"?"var(--grn)":s==="yellow"?"var(--amb)":"var(--red)";
  const siBg=(s:string)=>s==="green"?"rgba(16,185,129,0.08)":s==="yellow"?"rgba(245,158,11,0.08)":"rgba(239,68,68,0.08)";
  const siBdr=(s:string)=>s==="green"?"rgba(16,185,129,0.2)":s==="yellow"?"rgba(245,158,11,0.2)":"rgba(239,68,68,0.2)";

  /* ── Release Readiness ── */
  const RR_STEPS=["Checking Jira issues and P0s…","Analyzing blockers and bug trends…","Checking stakeholder coverage…","Scanning meeting action items…","Checking OKR alignment and risk predictions…","Running self-evaluation loop…","Generating go/no-go recommendation…"];
  const runReleaseReadiness=async()=>{
    if(!rrProject.trim())return;
    setRrRunning(true);setRrResult(null);setRrError(null);setRrStep(0);
    const iv=setInterval(()=>setRrStep(s=>Math.min(s+1,RR_STEPS.length-1)),2000);
    try{
      const proj=projects.find(p=>p.name===rrProject);
      const{data,error}=await supabase.functions.invoke("release-readiness-agent",{body:{projectName:rrProject,projectId:proj?.id||null,releaseScope:rrScope,userId:user?.id}});
      if(error)throw new Error(error.message);if(data?.error)throw new Error(data.error);
      setRrResult(data);loadDecisions();loadRiskPreds();loadAgentRuns();
    }catch(e:any){setRrError(e.message);}
    finally{clearInterval(iv);setRrStep(RR_STEPS.length-1);setRrRunning(false);}
  };
  const rrStatusColor=(s:string)=>s==="green"?"var(--grn)":s==="yellow"?"var(--amb)":"var(--red)";
  const rrStatusBg=(s:string)=>s==="green"?"rgba(16,185,129,0.08)":s==="yellow"?"rgba(245,158,11,0.08)":"rgba(239,68,68,0.08)";
  const rrStatusBdr=(s:string)=>s==="green"?"rgba(16,185,129,0.2)":s==="yellow"?"rgba(245,158,11,0.2)":"rgba(239,68,68,0.2)";

  /* ── Research Agents ── */
  const RESEARCH_STEPS=["Running Competitive Analysis Agent…","Running Market Analysis Agent (web search)…","Running Customer Insights Agent…","Synthesizing across all three agents…"];
  const runResearch=async()=>{
    if(!researchProduct.trim())return;
    setResearchRunning(true);setResearchResult(null);setResearchError(null);setResearchStep(0);
    const interval=setInterval(()=>setResearchStep(s=>Math.min(s+1,RESEARCH_STEPS.length-1)),3500);
    try{
      const{data,error}=await supabase.functions.invoke("research-agents",{body:{product:researchProduct,context:researchContext,userId:user?.id,projectId:researchProject||null}});
      if(error)throw new Error(error.message);if(data?.error)throw new Error(data.error);
      setResearchResult(data);setResearchTab("synthesis");loadKnowledge();loadAgentRuns();
    }catch(e:any){setResearchError(e.message);}
    finally{clearInterval(interval);setResearchStep(3);setResearchRunning(false);}
  };

  /* ── Decision Log ── */
  const saveDecision=async()=>{
    if(!decisionForm.title.trim()||!decisionForm.decision.trim())return;
    await supabase.from("decision_log").insert({...decisionForm,user_id:user?.id,trade_offs:decisionForm.trade_offs?decisionForm.trade_offs.split("\n").filter(Boolean):undefined,tags:decisionForm.tags?decisionForm.tags.split(",").map((t:string)=>t.trim()).filter(Boolean):undefined,project_id:decisionForm.project_id||null}).then(undefined,()=>{});
    setShowAddDecision(false);setDecisionForm({title:"",decision:"",rationale:"",trade_offs:"",project_id:"",tags:""});loadDecisions();
  };
  const logFeedback=async(agentName:string,eventType:string,field:string,original:string,corrected:string)=>{
    await supabase.from("feedback_events").insert({user_id:user?.id,agent_name:agentName,event_type:eventType,field,original,corrected}).then(undefined,()=>{});loadFeedback();
  };
  const saveKnowledgeItem=async()=>{
    if(!knowledgeForm.title.trim()||!knowledgeForm.content.trim())return;
    await supabase.from("knowledge_items").insert({...knowledgeForm,user_id:user?.id,tags:knowledgeForm.tags?knowledgeForm.tags.split(",").map((t:string)=>t.trim()).filter(Boolean):[]}).then(undefined,()=>{});
    setShowAddKnowledge(false);setKnowledgeForm({type:"insight",title:"",content:"",tags:""});loadKnowledge();
  };
  const saveOutcome=async()=>{
    if(!outcomeForm.feature_name.trim())return;
    await supabase.from("outcomes").insert({...outcomeForm,user_id:user?.id,project_id:outcomeForm.project_id||null,target_value:parseFloat(outcomeForm.target_value)||null}).then(undefined,()=>{});
    setShowAddOutcome(false);setOutcomeForm({feature_name:"",project_id:"",hypothesis:"",target_metric:"",target_value:"",measurement_date:""});loadOutcomes();
  };

  /* ── Cost Optimizer ── */
  const runOptimizer=async()=>{
    setOptRunning(true);setOptResult(null);setOptError(null);
    try{
      const{data,error}=await supabase.functions.invoke("token-cost-optimizer",{body:{
        agent_name:optAgentName,
        prompt:optPrompt,
        memory_context:optMemory,
        tools_used:optTools.split(",").map((t:string)=>t.trim()).filter(Boolean),
        workflow_type:optWorkflow,
        frequency:optFreq,
        userId:user?.id,
      }});
      if(error)throw new Error(error.message);
      if(data?.error)throw new Error(data.error);
      setOptResult(data);
    }catch(e:any){setOptError(e.message);}
    finally{setOptRunning(false);loadTokens();}
  };
  const toggleOpt=(k:string)=>setOptExpanded(p=>({...p,[k]:!p[k]}));

  /* ── Super Agent ── */
  const THINK_STEPS = [
    "Fetching Jira issues and project signals…",
    "Analyzing meeting intelligence and action items…",
    "Loading OKRs, RICE scores and stakeholder context…",
    "Computing program health across all projects…",
    "Running decision engine — synthesizing insights…",
    "Self-evaluation loop — checking for hallucination…",
    "Generating structured output…",
  ];
  const runSuperAgent=async()=>{
    setSuperRunning(true);setSuperResult(null);setSuperError(null);setThinkStep(0);
    const interval=setInterval(()=>setThinkStep(s=>Math.min(s+1,THINK_STEPS.length-1)),900);
    try{
      const{data,error}=await supabase.functions.invoke("super-agent",{body:{userRequest:superRequest||undefined,focusArea:superFocus!=="all"?superFocus:undefined,userId:user?.id}});
      if(error)throw new Error(error.message);
      if(data?.error)throw new Error(data.error);
      // Unwrap spec envelope: { result, token_optimization }
      const payload = data?.result ? { ...data.result, token_optimization: data.token_optimization } : data;
      setSuperResult(payload);
      setSuperExpanded({exec:true,prd:true,risks:true,prio:true,sources:false,eval:false});
    }catch(e:any){setSuperError(e.message);}
    finally{clearInterval(interval);setThinkStep(THINK_STEPS.length-1);setSuperRunning(false);}
    loadAgentRuns();
  };
  const toggleSuperSec=(key:string)=>setSuperExpanded(p=>({...p,[key]:!p[key]}));
  const saRiskClass=(sev:string)=>sev==="Critical"?"sa-crit":sev==="High"?"sa-high":sev==="Medium"?"sa-med":"sa-low";
  const saRiskColor=(sev:string)=>sev==="Critical"?"var(--red)":sev==="High"?"var(--amb)":sev==="Medium"?"var(--acc)":"var(--grn)";
  const confClass=(c:string)=>c==="High"?"confidence-high":c==="Medium"?"confidence-medium":"confidence-low";

  /* ── Derived ── */
  const shProjects=["All",...Array.from(new Set(stakeholders.flatMap((s:any)=>s.proj)))];
  const filteredSh=shFilter==="All"?stakeholders:stakeholders.filter((s:any)=>s.proj.includes(shFilter));
  const info=PAGE_INFO[page]||{title:page,sub:""};
  const prioProjects=[{id:"all",name:"All Projects"},...projects.map(p=>({id:p.id,name:p.name}))];
  const rmItemsThisYear=roadmapItems.filter((r:any)=>r.year===rmYear);
  const scheduledDates=[...new Set(todos.filter((t:any)=>t.scheduled_date).map((t:any)=>t.scheduled_date as string))];
  const calEventDates=calendarEvents.filter((e:any)=>e.calendar_event_id).map(()=>new Date().toISOString().split("T")[0]);
  const RM_COLORS=["rgba(0,212,255,0.2)","rgba(124,58,237,0.2)","rgba(16,185,129,0.2)","rgba(245,158,11,0.2)"];
  const RM_BORDERS=["var(--acc)","var(--pur)","var(--grn)","var(--amb)"];

  return(
    <>
      <style>{S}</style>
      {isSyncing&&<div className="sync-bar"/>}
      <div className="app">

        <aside className="sb">
          <div className="sb-brand">
            <div className="sb-logo"><div className="sb-logo-mark">⬡</div><span className="sb-logo-name">PM Agent OS</span></div>
            <div className="sb-context">Sr. Product Manager</div>
          </div>
          <nav className="sb-nav">
            {NAV.map(g=>(
              <div key={g.grp}>
                <div className={`sb-grp-lbl${["AI Agents","AI Workflows","Insights"].includes(g.grp)?" sub":""}`}>{g.grp}</div>
                {g.items.map(it=>(
                  <div key={it.id} className={`sb-item${page===it.id?" on":""}`} onClick={()=>setPage(it.id)}>
                    <span className="sb-item-ic">{it.ic}</span><span>{it.lbl}</span>
                  </div>
                ))}
              </div>
            ))}
          </nav>
          <div className="sb-foot">
            <div className="sb-stat"><div className="sdot" style={{background:isSyncing?"var(--acc)":"var(--grn)",boxShadow:`0 0 4px ${isSyncing?"var(--acc)":"var(--grn)"}`}}/><span>{isSyncing?"Syncing...":"Live"}</span></div>
            <div className="sb-stat"><div className="sdot" style={{background:"var(--acc)"}}/><span>{projects.length} projects</span></div>
            <div className="sb-stat"><div className="sdot" style={{background:"var(--amb)"}}/><span>{todos.filter((t:any)=>t.status==="open").length} open tasks</span></div>
            <div className="sb-stat"><div className="sdot" style={{background:"var(--pur)"}}/><span>{agentRuns.length} agent runs</span></div>
          </div>
        </aside>

        <main className="main">
          <div className="ph">
            <div><div className="ph-title">{info.title}</div><div className="ph-sub">{info.sub}</div></div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              {isSyncing&&<span style={{fontFamily:"DM Mono",fontSize:10,color:"var(--acc)"}}>⟳ syncing…</span>}
              {user&&<span className="mono dim" style={{fontSize:11}}>{user.email}</span>}
            </div>
          </div>
          <div className="pb">

            {/* SCHEDULE */}
            {page==="schedule"&&(
              <div className="g2" style={{gridTemplateColumns:"1fr 280px"}}>
                <div className="card">
                  <div className="ch">
                    <div className="ct">{selectedCalDate.toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}</div>
                    <div style={{display:"flex",gap:6}}>
                      <button className="btn btn-sm" onClick={()=>syncCal(selectedCalDate.toISOString().split("T")[0])} disabled={syncingInt==="calendar"}>{syncingInt==="calendar"?<span className="spin" style={{width:12,height:12,borderWidth:1.5,display:"inline-block"}}/>:"⟳ Sync"}</button>
                      <button className="btn btn-primary btn-sm" onClick={()=>setShowAddCal(true)}>+ Event</button>
                    </div>
                  </div>
                  <div className="cb0">
                    {calendarEvents.length===0?(<div className="empty">{isSyncing?"Syncing Google Calendar...":"No events. Sync or add one."}</div>):(
                      <div style={{padding:"12px 14px"}}>
                        <div className="tl-wrap">
                          {[...calendarEvents].sort((a:any,b:any)=>(a.start_time||"").localeCompare(b.start_time||"")).map((ev:any)=>(
                            <div key={ev.id} className="tl-slot">
                              <div className="tl-time">{ev.start_time||"—"}</div>
                              <div><div className={`tl-ev ev-${ev.block_type||"meet"}`}>
                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                                  <div className="ev-title">{ev.calendar_event_title||ev.label}</div>
                                  <div style={{display:"flex",gap:5}}>
                                    {ev.meet_link&&<a href={ev.meet_link} target="_blank" rel="noopener noreferrer" style={{fontFamily:"DM Mono",fontSize:9,color:"var(--acc)",textDecoration:"none",padding:"1px 5px",border:"1px solid rgba(0,212,255,0.2)",borderRadius:3}}>Join</a>}
                                    <button className="btn btn-icon btn-danger" style={{width:18,height:18,fontSize:9,opacity:0.5}} onClick={()=>deleteCalEvent(ev)}>✕</button>
                                  </div>
                                </div>
                                <div className="ev-meta"><span>{ev.start_time}–{ev.end_time}</span>{ev.attendees?.length>0&&<span className="dim" style={{fontSize:10}}>{ev.attendees.slice(0,2).join(", ")}{ev.attendees.length>2?` +${ev.attendees.length-2}`:""}</span>}</div>
                              </div></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col">
                  <div className="card">
                    <div className="ch"><div className="ct">Calendar</div><span style={{fontSize:10,color:"var(--mut)",fontFamily:"DM Mono"}}>Click to expand</span></div>
                    <div className="cb">
                      <MiniCalendar selectedDate={selectedCalDate} onSelect={(d)=>{setSelectedCalDate(d);syncCal(d.toISOString().split("T")[0]);}} eventDates={[]}/>
                      <div style={{marginTop:10,fontSize:11,color:"var(--mut)"}}>{getIntSt("google_calendar").status==="connected"?`✓ ${new Date(getIntSt("google_calendar").last_synced_at).toLocaleTimeString()}`:isSyncing?"Syncing...":"Click a date to load"}</div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="ch"><div className="ct">Day Summary</div></div>
                    <div className="cb">
                      {[[calendarEvents.filter((e:any)=>e.block_type==="meet").length,"Meetings"],[calendarEvents.length,"Events"],[calendarEvents.filter((e:any)=>e.meet_link).length,"With Meet"],[calendarEvents.filter((e:any)=>e.block_type==="deep").length,"Focus"]].map(([v,l])=>(
                        <div key={l as string} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid var(--bdr)",fontSize:12}}><span className="dim">{l}</span><span className="mono acc" style={{fontSize:11}}>{v}</span></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TODOS */}
            {page==="todos"&&(
              <div className="g2" style={{gridTemplateColumns:"1fr 260px"}}>
                <div className="card">
                  <div className="ch">
                    <div><div className="ct">To-Do · {selectedTodoDate.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</div>{selDateStr!==todayStr&&<div style={{fontSize:10,color:"var(--acc)",fontFamily:"DM Mono",marginTop:2}}>Scheduled tasks for this date</div>}</div>
                    <button className="btn btn-primary btn-sm" onClick={()=>setShowAddTask(true)}>+ Add Task</button>
                  </div>
                  <div className="cb">
                    {todosLoading&&<div className="loading"><div className="spin"/>Loading...</div>}
                    {!todosLoading&&filteredTodos.length===0&&<div className="empty">No tasks for this day.<br/><span style={{fontSize:11,color:"var(--mut)"}}>Unscheduled tasks show on today. Use the date field to schedule future tasks.</span></div>}
                    <div className="col" style={{gap:6}}>
                      {filteredTodos.map((t:any)=>(
                        <div key={t.id} className="todo-item">
                          <div className={`todo-chk${t.status==="done"?" dn":""}`} onClick={()=>toggleTodo(t)}>{t.status==="done"?"✓":""}</div>
                          <span className={`todo-txt${t.status==="done"?" dn":""}`}>{t.title}</span>
                          {t.jira_key&&<a href={t.jira_url||"#"} target="_blank" rel="noopener noreferrer" style={{fontFamily:"DM Mono",fontSize:9,color:"var(--pur)",textDecoration:"none",flexShrink:0}}>{t.jira_key}</a>}
                          <select className="input input-sm select" style={{width:64,padding:"2px 18px 2px 4px",fontSize:10,flexShrink:0}} value={t.priority} onChange={e=>updatePriority(t.id,e.target.value)}><option value="high">High</option><option value="med">Med</option><option value="low">Low</option></select>
                          <input type="date" className="input input-sm" style={{width:120,fontSize:10,flexShrink:0}} title="Schedule for a day" value={t.scheduled_date||""} onChange={e=>reschedule(t.id,e.target.value)}/>
                          <button className="btn btn-icon btn-danger btn-sm" onClick={()=>deleteTask(t.id)}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card"><div className="ch"><div className="ct">Browse by Date</div></div><div className="cb"><MiniCalendar selectedDate={selectedTodoDate} onSelect={setSelectedTodoDate} eventDates={scheduledDates}/><div style={{marginTop:8,fontSize:11,color:"var(--mut)"}}>Dots = scheduled tasks</div></div></div>
                  <div className="card"><div className="ch"><div className="ct">Overview</div></div><div className="cb">{[["Total",todos.length],["Open",todos.filter((t:any)=>t.status==="open").length],["Done",todos.filter((t:any)=>t.status==="done").length],["High priority",todos.filter((t:any)=>t.priority==="high"&&t.status==="open").length],["Scheduled",todos.filter((t:any)=>t.scheduled_date&&t.scheduled_date>todayStr).length],["From Jira",todos.filter((t:any)=>t.source==="jira").length],["From Meetings",todos.filter((t:any)=>t.source==="meeting-scribe").length]].map(([l,v])=>(<div key={l as string} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid var(--bdr)",fontSize:12}}><span className="dim">{l}</span><span className="mono acc" style={{fontSize:11}}>{v}</span></div>))}</div></div>
                </div>
              </div>
            )}

            {/* PROJECTS */}
            {page==="tracker"&&(
              <div className="col">
                <div className="card">
                  <div className="ch">
                    <div className="ct">Projects</div>
                    <div style={{display:"flex",gap:6}}>
                      <button className="btn btn-sm" onClick={()=>syncJira()} disabled={syncingInt==="jira"}>{syncingInt==="jira"?<span className="spin" style={{width:12,height:12,borderWidth:1.5,display:"inline-block"}}/>:"⟳ Sync Jira"}</button>
                      <button className="btn btn-primary btn-sm" onClick={openAddProj}>+ Project</button>
                    </div>
                  </div>
                  {projLoading&&<div className="loading"><div className="spin"/>Loading...</div>}
                  {!projLoading&&projects.length===0&&<div className="empty">No projects yet. Add one to get started.</div>}
                  {projects.map((p:any)=>{
                    const pIssues=jiraIssues.filter(i=>i.project_key===p.jira_key);
                    const ph=computeHealth(pIssues.length>0?pIssues:[]);
                    const blockers=pIssues.filter(i=>(i.status||"").toLowerCase().includes("block")).length;
                    const bugs=pIssues.filter(i=>i.issue_type==="Bug"&&i.priority==="high").length;
                    const done=pIssues.filter(i=>["done","closed","resolved"].includes(i.status)).length;
                    const completion=pIssues.length>0?Math.round(done/pIssues.length*100):p.progress;
                    const isExp=expandedProj===p.id;
                    return(
                      <div key={p.id} style={{borderBottom:"1px solid var(--bdr)"}}>
                        <div style={{padding:"14px 16px",cursor:"pointer"}} onClick={()=>setExpandedProj(isExp?null:p.id)}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                            <div style={{flex:1}}>
                              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                                <span style={{fontFamily:"Syne",fontWeight:700,fontSize:14}}>{p.name}</span>
                                {p.jira_key&&<span style={{fontFamily:"DM Mono",fontSize:9,color:"var(--pur)"}}>{p.jira_key}</span>}
                                <span className={`tag ${STATUS_COLOR[p.status]||"tag-dim"}`} style={{fontSize:9}}>{p.status?.replace("-"," ")}</span>
                                {p.priority&&<span className={`tag ${p.priority==="high"?"tag-red":p.priority==="low"?"tag-grn":"tag-amb"}`} style={{fontSize:9}}>{p.priority} priority</span>}
                                <HealthBadge score={ph}/>
                              </div>
                              <div style={{fontSize:11,color:"var(--mut)"}}>Owner: {p.owner||"—"} · Due: {p.due_date?new Date(p.due_date).toLocaleDateString("en-GB",{day:"numeric",month:"short"}):"—"}</div>
                            </div>
                            <div style={{display:"flex",gap:4,alignItems:"center"}} onClick={e=>e.stopPropagation()}>
                              <button className="btn btn-sm" onClick={()=>openEditProj(p)}>✎</button>
                              <button className="btn btn-danger btn-sm" onClick={()=>deleteProject(p.id)}>✕</button>
                              <span style={{fontSize:11,color:"var(--mut)",marginLeft:2}}>{isExp?"▾":"▸"}</span>
                            </div>
                          </div>
                          <div className="bar-wrap"><div className="bar-track"><div className="bar-fill" style={{width:`${completion}%`,background:BAR_COLOR[p.status]||"var(--acc)"}}/></div><span className="bar-pct">{completion}%</span></div>
                        </div>
                        {isExp&&(
                          <div style={{padding:"0 16px 14px",borderTop:"1px solid var(--bdr)"}}>
                            {pIssues.length>0&&(
                              <div style={{display:"flex",gap:20,padding:"10px 0",borderBottom:"1px solid var(--bdr)",marginBottom:10}}>
                                {[[pIssues.length,"Issues","var(--acc)"],[blockers,"Blockers",blockers>0?"var(--red)":"var(--grn)"],[bugs,"High Bugs",bugs>0?"var(--red)":"var(--grn)"],[`${completion}%`,"Complete",completion>=60?"var(--grn)":completion>=30?"var(--amb)":"var(--red)"]].map(([v,l,c])=>(
                                  <div key={l as string} style={{textAlign:"center"}}><div style={{fontFamily:"Syne",fontWeight:800,fontSize:18,color:c as string}}>{v}</div><div style={{fontSize:10,color:"var(--mut)"}}>{l}</div></div>
                                ))}
                              </div>
                            )}
                            {p.research_summary&&<div className="infobox ib-blue" style={{marginBottom:6,fontSize:11}}>🔬 <strong style={{color:"var(--acc)"}}>Research:</strong> {p.research_summary}</div>}
                            {p.competitive_summary&&<div className="infobox ib-amb" style={{fontSize:11}}>🔭 <strong style={{color:"var(--amb)"}}>Competitive:</strong> {p.competitive_summary}</div>}
                            {!p.research_summary&&!p.competitive_summary&&pIssues.length===0&&<div style={{fontSize:11,color:"var(--mut)"}}>Click Edit to add research and competitive intelligence summaries.</div>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="infobox ib-blue" style={{fontSize:11}}>🧠 <strong className="acc">Program Health</strong> is computed from Jira signals: completion rate, blocker count, high-severity bugs. Green = on track. Yellow = needs attention. Red = intervene now.</div>
              </div>
            )}

            {/* MEETINGS */}
            {page==="meetings"&&(
              <div className="g2">
                <div className="col">
                  <div className="card">
                    <div className="ch"><div className="ct">Meetings</div><button className="btn btn-primary btn-sm" onClick={()=>setShowAddMeet(true)}>+ New Meeting</button></div>
                    <div className="cb0">
                      {meetLoading&&<div className="loading"><div className="spin"/>Loading...</div>}
                      {!meetLoading&&meetings.length===0&&<div className="empty">No meetings yet. Paste a transcript to extract intelligence.</div>}
                      {meetings.map((m:any,mi:number)=>(
                        <div key={m.id} className="meet-row">
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                            <div><div style={{fontFamily:"Syne",fontWeight:700,fontSize:13}}>{m.title}</div><div style={{fontSize:11,color:"var(--mut)",marginTop:2}}>{m.meeting_time?new Date(m.meeting_time).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}):"—"}</div></div>
                            <button className="btn btn-danger btn-sm" onClick={()=>deleteMeeting(m.id)}>Delete</button>
                          </div>
                          {m.summary&&<div style={{fontSize:12,lineHeight:1.7,marginBottom:10,padding:"8px 10px",background:"rgba(0,212,255,0.04)",borderRadius:7,borderLeft:"2px solid var(--acc)"}}>{m.summary}</div>}
                          {m.action_items?.length>0&&(
                            <><div className="section-lbl" style={{marginBottom:4}}>Action Items</div>
                            {m.action_items.map((a:any,aj:number)=>{
                              const item=typeof a==="string"?{text:a,owner:"TBD",priority:"med",due_date:""}:a;
                              return(
                                <div key={aj} className="act-row">
                                  <div style={{flex:1}}><div style={{fontWeight:500,marginBottom:2}}>{item.text}</div><div style={{fontSize:11,color:"var(--mut)"}}><strong style={{color:"var(--txt)"}}>{item.owner||"TBD"}</strong>{item.due_date&&<> · {item.due_date}</>}</div></div>
                                  <span className={`tag ${item.priority==="high"?"tag-red":item.priority==="low"?"tag-grn":"tag-amb"}`} style={{fontSize:9}}>{item.priority||"med"}</span>
                                  <button className="btn btn-sm" onClick={()=>{setEditingAction({meetingId:m.id,idx:aj,item:{parent:m.action_items}});setActionForm({text:item.text,owner:item.owner||"",priority:item.priority||"med",due_date:item.due_date||""});}}>✎</button>
                                </div>
                              );
                            })}</>
                          )}
                          {m.decisions?.length>0&&<><div className="section-lbl" style={{marginBottom:4,marginTop:10}}>Decisions</div>{m.decisions.map((d:string,di:number)=><div key={di} style={{fontSize:12,padding:"3px 0",display:"flex",gap:6,color:"var(--mut)"}}><span style={{color:"var(--grn)"}}>✓</span>{d}</div>)}</>}
                          {!m.summary&&!m.action_items&&<div style={{fontSize:12,color:"var(--mut)",fontStyle:"italic"}}>Transcript saved. AI processing pending.</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="ch"><div className="ct">How It Works</div></div>
                  <div className="cb0">
                    {[["Paste transcript","Any source: Zoom, Meet, Teams, Webex or manual notes"],["AI extracts","Decisions, action items with owners and due dates"],["Tasks auto-created","Each action item becomes a task in To-Do list"],["Edit inline","Change owner, priority or due date at any time"]].map(([t,d],i,a)=>(
                      <div key={i} style={{display:"flex",gap:12,padding:"12px 16px",borderBottom:i<a.length-1?"1px solid var(--bdr)":"none",alignItems:"flex-start"}}>
                        <div style={{width:20,height:20,borderRadius:"50%",background:"rgba(0,212,255,0.1)",border:"1px solid rgba(0,212,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"DM Mono",fontSize:10,color:"var(--acc)",flexShrink:0}}>{i+1}</div>
                        <div><div style={{fontFamily:"Syne",fontWeight:700,fontSize:12,marginBottom:2}}>{t}</div><div style={{fontSize:11,color:"var(--mut)"}}>{d}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PRIORITIZATION */}
            {page==="priority"&&(
              <div className="col">
                <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                  <div className="fw-tabs">
                    {[{k:"rice",l:"RICE"},{k:"moscow",l:"MoSCoW"},{k:"cost-delay",l:"Cost of Delay"},{k:"impact-effort",l:"Impact / Effort"}].map(({k,l})=>(
                      <button key={k} className={`fw-tab${prioFw===k?" on":""}`} onClick={()=>setPrioFw(k)}>{l}</button>
                    ))}
                  </div>
                  <select className="input select" style={{width:190}} value={prioProjId} onChange={e=>setPrioProjId(e.target.value)}>
                    {prioProjects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  {(prioFw==="rice"||prioFw==="cost-delay")&&<button className="btn btn-primary btn-sm" onClick={runPrio} disabled={agentRunning==="prioritization"}>{agentRunning==="prioritization"?<span style={{display:"flex",alignItems:"center",gap:6}}><span className="spin" style={{width:12,height:12,borderWidth:1.5}}/>Scoring...</span>:"⚡ AI Score"}</button>}
                </div>

                {prioFw==="rice"&&(
                  <div className="card">
                    <div className="ch"><div className="ct">RICE Score · AI-Calculated</div><div style={{fontSize:11,color:"var(--mut)"}}>Reach × Impact × Confidence ÷ Effort</div></div>
                    {(riceScores.length>0?riceScores:projects.filter(p=>prioProjId==="all"||p.id===prioProjId).map(p=>({title:p.name,rice_score:0,reach:0,impact:0,confidence:0,effort:0,reasoning:"Click AI Score to calculate"}))).sort((a:any,b:any)=>b.rice_score-a.rice_score).map((it:any,i:number)=>(
                      <div key={i} className="tr" style={{gridTemplateColumns:"1fr 36px 36px 36px 36px 100px"}}>
                        <div><div style={{fontWeight:500,fontSize:12}}>{it.title||it.name}</div>{it.reasoning&&<div style={{fontSize:10,color:"var(--mut)",marginTop:1}}>{it.reasoning}</div>}</div>
                        {[it.reach??0,it.impact??0,it.confidence??0,it.effort??0].map((v:any,j:number)=><span key={j} className="mono dim" style={{fontSize:11}}>{v||"—"}</span>)}
                        <div className="bar-wrap"><div className="bar-track"><div className="bar-fill" style={{width:`${Math.min(100,(it.rice_score/130)*100)}%`,background:`hsl(${Math.min(it.rice_score+80,160)},60%,58%)`}}/></div><span className="mono acc" style={{fontSize:11,width:24,textAlign:"right"}}>{Math.round(it.rice_score||0)}</span></div>
                      </div>
                    ))}
                    {riceScores.length===0&&projects.length>0&&<div className="empty" style={{padding:16}}>Click ⚡ AI Score above.</div>}
                  </div>
                )}

                {prioFw==="moscow"&&(
                  <div className="col">
                    <div style={{display:"flex",justifyContent:"flex-end"}}><button className="btn btn-primary btn-sm" onClick={()=>setShowAddMoscow(true)}>+ Add Item</button></div>
                    <div className="g2">
                      {[{k:"must",l:"Must Have",c:"var(--red)"},{k:"should",l:"Should Have",c:"var(--amb)"},{k:"could",l:"Could Have",c:"var(--grn)"},{k:"wont",l:"Won't Have",c:"var(--mut)"}].map(({k,l,c})=>{
                        const items=moscowItems.filter((i:any)=>i.bucket===k&&(prioProjId==="all"||i.project===prioProjId));
                        return(
                          <div key={k} className="mos-bucket">
                            <div className="mos-hd"><span style={{fontFamily:"Syne",fontWeight:700,fontSize:13,color:c}}>{l}</span><span className="tag tag-dim" style={{fontSize:9}}>{items.length}</span></div>
                            {items.length===0&&<div style={{padding:"12px 14px",fontSize:12,color:"var(--mut)"}}>No items</div>}
                            {items.map((it:any)=>(<div key={it.id} className="mos-item"><div style={{flex:1}}>{it.title}</div>{it.project&&<span className="tag tag-dim" style={{fontSize:9}}>{it.project}</span>}<button className="btn btn-icon btn-danger btn-sm" onClick={async()=>{await supabase.from("moscow_items").delete().eq("id",it.id).then(undefined,()=>{});loadMoscow();}}>✕</button></div>))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {prioFw==="cost-delay"&&(
                  <div className="card">
                    <div className="ch"><div className="ct">Cost of Delay = Urgency × Value ÷ Duration</div></div>
                    {projects.length===0?<div className="empty">Add projects first.</div>:(
                      <>
                        <div className="th-row" style={{gridTemplateColumns:"1fr 80px 80px 80px 110px"}}><span>Project</span><span>Urgency</span><span>Value</span><span>Duration</span><span>CoD Score</span></div>
                        {(prioProjId==="all"?projects:projects.filter((p:any)=>p.id===prioProjId)).map((p:any,i:number)=>{
                          const rs=riceScores.find((r:any)=>r.title===p.name);
                          const urg=rs?.reach||50,val=rs?.impact||5,dur=rs?.effort||3;
                          const cod=dur>0?Math.round((urg*val)/dur):0;
                          return(<div key={i} className="tr" style={{gridTemplateColumns:"1fr 80px 80px 80px 110px"}}><span style={{fontWeight:500,fontSize:12}}>{p.name}</span><span className="mono dim" style={{fontSize:11}}>{urg}</span><span className="mono dim" style={{fontSize:11}}>{val}</span><span className="mono dim" style={{fontSize:11}}>{dur}w</span><div className="bar-wrap"><div className="bar-track"><div className="bar-fill" style={{width:`${Math.min(100,cod/200*100)}%`,background:"var(--red)"}}/></div><span className="mono" style={{fontSize:11,color:"var(--red)",width:32,textAlign:"right"}}>{cod}</span></div></div>);
                        })}
                        {riceScores.length===0&&<div className="infobox ib-blue" style={{margin:"12px 16px",fontSize:11}}>Run RICE scoring first to populate urgency and effort values.</div>}
                      </>
                    )}
                  </div>
                )}

                {prioFw==="impact-effort"&&(
                  <div className="card">
                    <div className="ch"><div className="ct">Impact vs Effort Matrix</div></div>
                    <div className="cb">
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:9,fontFamily:"DM Mono",color:"var(--mut)",marginBottom:6}}><span>← Low Effort</span><span>High Effort →</span></div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr 1fr",gap:8,height:280}}>
                        {[{c:"rgba(16,185,129,0.08)",bc:"rgba(16,185,129,0.2)",l:"🚀 Quick Wins",sub:"High impact, low effort"},{c:"rgba(0,212,255,0.06)",bc:"rgba(0,212,255,0.15)",l:"🎯 Major Projects",sub:"High impact, high effort"},{c:"rgba(245,158,11,0.06)",bc:"rgba(245,158,11,0.15)",l:"🔧 Fill-ins",sub:"Low impact, low effort"},{c:"rgba(78,95,116,0.06)",bc:"rgba(78,95,116,0.15)",l:"🚫 Avoid",sub:"Low impact, high effort"}].map((q,qi)=>{
                          const sorted=[...riceScores].sort((a:any,b:any)=>b.rice_score-a.rice_score);
                          const displayItems=sorted.length>0?sorted.filter((_:any,i:number)=>i%4===qi).map((r:any)=>r.title):(prioProjId==="all"?projects:projects.filter((p:any)=>p.id===prioProjId)).filter((_:any,i:number)=>i%4===qi).map((p:any)=>p.name);
                          return(<div key={qi} style={{background:q.c,border:`1px solid ${q.bc}`,borderRadius:8,padding:12,display:"flex",flexDirection:"column",gap:4}}><div style={{fontFamily:"Syne",fontSize:11,fontWeight:700}}>{q.l}</div><div style={{fontSize:10,color:"var(--mut)",marginBottom:4}}>{q.sub}</div><div>{displayItems.length===0?<span style={{fontSize:10,color:"var(--mut)"}}>None</span>:displayItems.map((it:string,j:number)=><div key={j} style={{fontSize:10,padding:"2px 0",color:"var(--txt)",display:"flex",gap:4}}><span style={{opacity:0.4}}>—</span>{it}</div>)}</div></div>);
                        })}
                      </div>
                      {riceScores.length===0&&<div className="infobox ib-blue" style={{marginTop:12,fontSize:11}}>Run RICE scoring to auto-populate quadrants.</div>}
                    </div>
                  </div>
                )}

                <div className="card">
                  <div className="ch"><div className="ct">OKR Alignment · Vision → Goals → Features</div></div>
                  <div className="cb">
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1px 1fr 1px 1fr",gap:"0 16px",alignItems:"start"}}>
                      {[{key:"vision",label:"🔭 Vision",col:"var(--acc)",bg:"rgba(0,212,255,0.05)",bdr:"rgba(0,212,255,0.12)"},{key:"goals",label:"◎ Goals",col:"var(--pur)",bg:"rgba(124,58,237,0.05)",bdr:"rgba(124,58,237,0.12)"},{key:"features",label:"🚀 Features",col:"var(--grn)",bg:"rgba(16,185,129,0.05)",bdr:"rgba(16,185,129,0.12)"}].reduce((acc:any[],col,i)=>i===0?[col]:i===1?[...acc,null,col]:[...acc,null,col],[]).map((col:any,i:number)=>
                        col===null?<div key={i} style={{background:"var(--bdr)",borderRadius:1}}/>:
                        <div key={i}>
                          <div style={{fontFamily:"Syne",fontWeight:700,fontSize:12,color:col.col,marginBottom:8}}>{col.label}</div>
                          <div className="col" style={{gap:4}}>
                            {((okrAlign as any)[col.key]||[]).map((it:string,j:number)=>(<div key={j} style={{fontSize:11,padding:"6px 9px",background:col.bg,border:`1px solid ${col.bdr}`,borderRadius:7,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6}}><span style={{flex:1,lineHeight:1.4}}>{it}</span><button className="btn btn-icon btn-danger" style={{width:16,height:16,fontSize:9,opacity:0.6,flexShrink:0}} onClick={()=>removeAlignItem(col.key,j)}>✕</button></div>))}
                            {showAddAlign===col.key?(<div style={{display:"flex",gap:4}}><input className="input input-sm" style={{flex:1}} value={newAlignText} onChange={e=>setNewAlignText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addAlignItem(col.key)} autoFocus placeholder="Add..."/><button className="btn btn-primary btn-sm" onClick={()=>addAlignItem(col.key)}>✓</button><button className="btn btn-sm" onClick={()=>{setShowAddAlign(null);setNewAlignText("");}}>✕</button></div>):(<button className="btn btn-sm" style={{fontSize:10,opacity:0.6}} onClick={()=>setShowAddAlign(col.key)}>+ Add</button>)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ROADMAP */}
            {page==="roadmap"&&(
              <div className="col">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <button className="btn btn-sm" onClick={()=>setRmYear(y=>y-1)}>‹</button>
                    <span style={{fontFamily:"Syne",fontWeight:800,fontSize:20}}>{rmYear}</span>
                    <button className="btn btn-sm" onClick={()=>setRmYear(y=>y+1)}>›</button>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={()=>setShowAddRoadmap(true)}>+ Add Initiative</button>
                </div>
                <div className="card">
                  <div style={{display:"grid",gridTemplateColumns:"160px repeat(4,1fr)",borderBottom:"1px solid var(--bdr)"}}>
                    <div style={{padding:"8px 14px",fontFamily:"DM Mono",fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--mut)",borderRight:"1px solid var(--bdr)"}}>Initiative</div>
                    {["Q1","Q2","Q3","Q4"].map((q,i)=><div key={q} style={{padding:"8px 14px",fontFamily:"DM Mono",fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--mut)",textAlign:"center",borderRight:i<3?"1px solid var(--bdr)":"none"}}>{q}</div>)}
                  </div>
                  {rmItemsThisYear.length===0&&<div className="empty">No roadmap items for {rmYear}. Add an initiative above.</div>}
                  {rmItemsThisYear.map((item:any)=>(
                    <div key={item.id} className="rm-row">
                      <div className="rm-name">
                        <span style={{fontWeight:500,fontSize:12}}>{item.title}</span>
                        {item.project&&<span style={{fontSize:10,color:"var(--mut)"}}>{item.project}</span>}
                      </div>
                      {[0,1,2,3].map(qi=>{
                        const inRange=qi>=item.start_quarter&&qi<=item.end_quarter;
                        const isStart=qi===item.start_quarter,isEnd=qi===item.end_quarter;
                        return(<div key={qi} className="rm-cell" style={{borderRight:qi<3?"1px solid var(--bdr)":"none",padding:"8px 4px"}}>
                          {inRange&&<div className="rm-block" style={{background:item.color||"rgba(0,212,255,0.15)",border:`1px solid ${item.color||"var(--acc)"}`,opacity:0.85,borderRadius:isStart&&isEnd?"6px":isStart?"6px 0 0 6px":isEnd?"0 6px 6px 0":"0"}}>
                            {isStart&&<span style={{fontSize:9,fontFamily:"DM Mono",color:"var(--txt)",padding:"0 6px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.title.slice(0,12)}{item.title.length>12?"…":""}</span>}
                          </div>}
                        </div>);
                      })}
                      <div style={{gridColumn:"6",display:"flex",alignItems:"center",paddingLeft:8}}>
                        <button className="btn btn-danger btn-sm" style={{opacity:0.5}} onClick={()=>deleteRm(item.id)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OKR */}
            {page==="okr"&&(
              <div className="col">
                <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",justifyContent:"space-between"}}>
                  <div className="g4" style={{flex:1,minWidth:400}}>
                    {[{v:`${okrs.length>0?Math.round(okrs.reduce((s:number,o:any)=>s+o.overall_pct,0)/okrs.length):0}%`,l:"Overall Progress",c:"var(--acc)"},{v:`${okrs.flatMap((o:any)=>o.krs||[]).filter((kr:any)=>kr.status==="on-track").length}/${okrs.flatMap((o:any)=>o.krs||[]).length}`,l:"KRs On Track",c:"var(--grn)"},{v:`${okrs.flatMap((o:any)=>o.krs||[]).filter((kr:any)=>kr.status==="at-risk").length}`,l:"KRs At Risk",c:"var(--amb)"},{v:`${okrs.length}`,l:"Objectives",c:"var(--pur)"}].map(({v,l,c})=>(
                      <div key={l} className="kpi"><div className="kpi-v" style={{color:c}}>{v}</div><div className="kpi-l">{l}</div></div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <select className="input select" style={{width:180}} value={selectedOkrProj} onChange={e=>setSelectedOkrProj(e.target.value)}><option value="all">All Projects</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
                    <button className="btn btn-primary btn-sm" onClick={()=>setShowAddOkr(true)}>+ Objective</button>
                  </div>
                </div>
                {okrsLoading&&<div className="loading"><div className="spin"/>Loading OKRs...</div>}
                {!okrsLoading&&okrs.length===0&&<div className="empty">No objectives yet. Add one to start tracking.</div>}
                <div className="col">
                  {okrs.map((obj:any,oi:number)=>(
                    <div key={obj.id} className="okr-blk">
                      <div className="okr-hd" onClick={()=>toggleOkr(oi)}>
                        <div className="okr-ico" style={{background:`${obj.color}18`,border:`1px solid ${obj.color}30`}}>{obj.icon||"🎯"}</div>
                        <div style={{flex:1}}><div className="okr-obj">{obj.objective}</div><div className="okr-own">{obj.owner}</div></div>
                        <div style={{textAlign:"right",marginLeft:12}}><div className="okr-pct" style={{color:obj.color}}>{obj.overall_pct}%</div><div className="okr-plbl">progress</div></div>
                        <div style={{display:"flex",gap:6,alignItems:"center",marginLeft:12}} onClick={e=>e.stopPropagation()}>
                          <button className="btn btn-sm" disabled={generatingInsight===obj.id+"weekly"} onClick={()=>genOkrInsight(obj,"weekly")}>{generatingInsight===obj.id+"weekly"?<span className="spin" style={{width:11,height:11,borderWidth:1.5,display:"inline-block"}}/>:"🤖 Weekly"}</button>
                          <button className="btn btn-sm" disabled={generatingInsight===obj.id+"quarterly"} onClick={()=>genOkrInsight(obj,"quarterly")}>{generatingInsight===obj.id+"quarterly"?<span className="spin" style={{width:11,height:11,borderWidth:1.5,display:"inline-block"}}/>:"🤖 Quarterly"}</button>
                          <button className="btn btn-danger btn-sm" onClick={()=>deleteOkr(obj.id)}>✕</button>
                          <span style={{fontSize:14,color:"var(--mut)"}}>{expandedOkr.includes(oi)?"▾":"▸"}</span>
                        </div>
                      </div>
                      <div className="okr-bar"><div className="okr-bf" style={{width:`${obj.overall_pct}%`,background:obj.color}}/></div>
                      {expandedOkr.includes(oi)&&(obj.krs||[]).map((kr:any)=>{
                        const pct=Math.max(0,Math.min(100,Math.round((kr.current_val/kr.target_val)*100)));
                        return(
                          <div key={kr.id} className="kr-row">
                            <div className="kr-name">{kr.name}</div>
                            <div className="kr-bars"><div className="kr-bar"><div className="kr-fill" style={{width:`${pct}%`,background:KR_COLOR[kr.status]||"var(--acc)"}}/></div><div className="kr-nums"><span>Current: <strong style={{color:"var(--txt)"}}>{kr.current_val}{kr.unit}</strong></span><span>Target: {kr.target_val}{kr.unit}</span></div></div>
                            <div className="kr-edit-wrap">
                              <span className={`tag ${KR_TAG[kr.status]||"tag-dim"}`} style={{fontSize:9}}>{kr.status?.replace("-"," ")}</span>
                              {editingKR===kr.id?(<><input className="input input-sm kr-edit-input" value={krEditVal} onChange={e=>setKrEditVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveKR(kr)} autoFocus/><button className="btn btn-primary btn-sm" onClick={()=>saveKR(kr)}>✓</button><button className="btn btn-sm" onClick={()=>setEditingKR(null)}>✕</button></>):(<button className="btn btn-sm" onClick={()=>startEditKR(kr)}>✎</button>)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}



            {/* COST OPTIMIZER */}
            {page==="optimizer"&&(
              <div className="col">

                {/* Hero */}
                <div style={{background:"linear-gradient(135deg,rgba(0,212,255,0.08),rgba(16,185,129,0.06))",border:"1px solid rgba(0,212,255,0.2)",borderRadius:14,padding:"22px 26px"}}>
                  <div style={{fontFamily:"Syne",fontWeight:800,fontSize:20,marginBottom:6}}>⚡ Token Cost Optimizer</div>
                  <div style={{fontSize:13,color:"var(--mut)",maxWidth:600,lineHeight:1.6}}>Analyzes any agent's prompt, memory and tool usage. Returns optimization recommendations, model strategy, caching opportunities and a compressed prompt — powered by Claude Haiku (cheapest model, ~$0.001 per analysis).</div>
                  <div style={{display:"flex",gap:6,marginTop:14,flexWrap:"wrap"}}>
                    {["Prompt compression","Memory trimming","Tool batching","Model selection","Cache strategy","Workflow collapse"].map(l=>(
                      <span key={l} style={{fontFamily:"DM Mono",fontSize:9,padding:"3px 9px",borderRadius:100,background:"rgba(0,212,255,0.07)",border:"1px solid rgba(0,212,255,0.15)",color:"var(--acc)"}}>{l}</span>
                    ))}
                  </div>
                </div>

                {/* Input form */}
                <div className="card">
                  <div className="ch"><div className="ct">Agent to Analyze</div></div>
                  <div className="cb">
                    <div className="g2" style={{gap:10,marginBottom:10}}>
                      <div className="form-row">
                        <label className="form-label">Agent Name</label>
                        <select className="input select" value={optAgentName} onChange={e=>setOptAgentName(e.target.value)}>
                          {["super-agent","meeting-scribe","weekly-digest","risk-monitor","stakeholder-update","prd-agent","prioritization","token-cost-optimizer"].map(a=><option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>
                      <div className="form-row">
                        <label className="form-label">Workflow Type</label>
                        <select className="input select" value={optWorkflow} onChange={e=>setOptWorkflow(e.target.value)}>
                          <option value="single-agent">Single Agent</option>
                          <option value="multi-agent">Multi-Agent</option>
                          <option value="orchestrated">Orchestrated</option>
                        </select>
                      </div>
                      <div className="form-row">
                        <label className="form-label">Run Frequency</label>
                        <select className="input select" value={optFreq} onChange={e=>setOptFreq(e.target.value)}>
                          <option value="low">Low (on-demand)</option>
                          <option value="medium">Medium (daily)</option>
                          <option value="high">High (per user action)</option>
                        </select>
                      </div>
                      <div className="form-row">
                        <label className="form-label">Tools Used (comma-separated)</label>
                        <input className="input" value={optTools} onChange={e=>setOptTools(e.target.value)} placeholder="jira-sync, calendar-sync, gmail-sync"/>
                      </div>
                    </div>
                    <div className="form-row" style={{marginBottom:10}}>
                      <label className="form-label">System Prompt (paste or describe)</label>
                      <textarea className="input" value={optPrompt} onChange={e=>setOptPrompt(e.target.value)} style={{minHeight:100,resize:"vertical" as any}} placeholder={"Paste the agent's system prompt here.\n\nLeave blank to analyze based on live token_usage DB stats for the selected agent."}/>
                    </div>
                    <div className="form-row" style={{marginBottom:14}}>
                      <label className="form-label">Memory / Context Injected (optional)</label>
                      <textarea className="input" value={optMemory} onChange={e=>setOptMemory(e.target.value)} style={{minHeight:60,resize:"vertical" as any}} placeholder="Paste any memory or context block injected into this agent..."/>
                    </div>
                    {optError&&<div className="infobox ib-red" style={{marginBottom:10}}>{optError}</div>}
                    <button style={{width:"100%",padding:13,background:"linear-gradient(90deg,var(--acc),var(--grn))",border:"none",borderRadius:9,fontFamily:"Syne",fontWeight:800,fontSize:14,color:"#000",cursor:optRunning?"not-allowed":"pointer",opacity:optRunning?0.6:1,display:"flex",alignItems:"center",justifyContent:"center",gap:10}} onClick={runOptimizer} disabled={optRunning}>
                      {optRunning?<><span className="spin" style={{width:16,height:16,borderWidth:2,borderTopColor:"#000",borderColor:"rgba(0,0,0,0.2)"}}/>Analyzing...</>:"⚡ Run Optimizer"}
                    </button>
                  </div>
                </div>

                {/* Results */}
                {optResult&&(
                  <div className="col">

                    {/* Summary + tokens */}
                    {[
                      {k:"summary",icon:"📋",label:"Summary",content:(
                        <p style={{fontSize:13,lineHeight:1.8}}>{optResult.summary}</p>
                      )},
                      {k:"tokens",icon:"📊",label:"Token Analysis",content:(
                        <div className="g4" style={{gap:10}}>
                          {[
                            {v:optResult.token_analysis?.input_tokens?.toLocaleString()||"—",  l:"Input Tokens",  c:"var(--acc)"},
                            {v:optResult.token_analysis?.output_tokens?.toLocaleString()||"—", l:"Output Tokens", c:"var(--pur)"},
                            {v:`${optResult.token_analysis?.optimization_potential_percent||0}%`,l:"Reduction Potential",c:"var(--grn)"},
                            {v:optResult.token_analysis?.estimated_cost||optResult.token_analysis?.live_total_cost||"—",l:"Est. Cost",c:"var(--amb)"},
                          ].map(({v,l,c})=>(
                            <div key={l} style={{background:"var(--surf2)",border:"1px solid var(--bdr)",borderRadius:9,padding:"12px 14px"}}>
                              <div style={{fontFamily:"Syne",fontWeight:800,fontSize:20,color:c,marginBottom:4}}>{v}</div>
                              <div style={{fontFamily:"DM Mono",fontSize:10,color:"var(--mut)"}}>{l}</div>
                            </div>
                          ))}
                        </div>
                      )},
                    ].map(({k,icon,label,content})=>(
                      <div key={k} className="sa-out-sec">
                        <div className="sa-out-hd" onClick={()=>toggleOpt(k)}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:14}}>{icon}</span><span style={{fontFamily:"Syne",fontWeight:700,fontSize:14}}>{label}</span></div>
                          <span style={{fontSize:13,color:"var(--mut)"}}>{optExpanded[k]?"▾":"▸"}</span>
                        </div>
                        {optExpanded[k]&&<div className="sa-out-body">{content}</div>}
                      </div>
                    ))}

                    {/* Prompt optimization */}
                    <div className="sa-out-sec">
                      <div className="sa-out-hd" onClick={()=>toggleOpt("prompt")}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:14}}>✏️</span><span style={{fontFamily:"Syne",fontWeight:700,fontSize:14}}>Prompt Optimization</span>{optResult.prompt_optimization?.reduction_percent>0&&<span className="tag tag-grn" style={{fontSize:9}}>-{optResult.prompt_optimization.reduction_percent}% tokens</span>}</div>
                        <span style={{fontSize:13,color:"var(--mut)"}}>{optExpanded.prompt?"▾":"▸"}</span>
                      </div>
                      {optExpanded.prompt&&optResult.prompt_optimization&&(
                        <div className="sa-out-body">
                          {optResult.prompt_optimization.issues?.length>0&&(
                            <div style={{marginBottom:12}}>
                              <div className="section-lbl" style={{marginBottom:6}}>Issues Found</div>
                              {optResult.prompt_optimization.issues.map((i:string,j:number)=><div key={j} style={{fontSize:12,display:"flex",gap:7,padding:"3px 0",color:"var(--amb)"}}><span>⚠</span>{i}</div>)}
                            </div>
                          )}
                          {optResult.prompt_optimization.optimized_prompt&&(
                            <>
                              <div className="section-lbl" style={{marginBottom:6}}>Optimized Prompt</div>
                              <div style={{background:"var(--surf2)",border:"1px solid var(--bdr)",borderRadius:8,padding:12,fontSize:12,lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:"DM Mono",marginBottom:8}}>{optResult.prompt_optimization.optimized_prompt}</div>
                              <button className="btn btn-sm" onClick={()=>navigator.clipboard.writeText(optResult.prompt_optimization.optimized_prompt).then(()=>alert("Copied!"))}>Copy Optimized Prompt</button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Memory, Tools, Model, Cache, Workflow in collapsible sections */}
                    {[
                      {k:"memory",icon:"🧠",label:"Memory Optimization",data:optResult.memory_optimization,render:(d:any)=>(
                        <div>
                          {d.issues?.map((i:string,j:number)=><div key={j} style={{fontSize:12,display:"flex",gap:7,padding:"3px 0",color:"var(--amb)"}}><span>⚠</span>{i}</div>)}
                          {d.recommended_context&&<div style={{marginTop:10}}><div className="section-lbl" style={{marginBottom:4}}>Recommended Context</div><div style={{fontSize:12,color:"var(--txt)",lineHeight:1.6}}>{d.recommended_context}</div></div>}
                          {d.reduction_percent>0&&<div className="tag tag-grn" style={{marginTop:8,display:"inline-flex"}}>-{d.reduction_percent}% context tokens</div>}
                        </div>
                      )},
                      {k:"tools",icon:"🔧",label:"Tool Optimization",data:optResult.tool_optimization,render:(d:any)=>(
                        <div className="col" style={{gap:10}}>
                          {d.redundant_calls?.length>0&&<div><div className="section-lbl" style={{marginBottom:4}}>Redundant Calls</div>{d.redundant_calls.map((c:string,j:number)=><div key={j} style={{fontSize:12,display:"flex",gap:7,color:"var(--red)"}}><span>✕</span>{c}</div>)}</div>}
                          {d.recommended_calls?.length>0&&<div><div className="section-lbl" style={{marginBottom:4}}>Recommended</div>{d.recommended_calls.map((c:string,j:number)=><div key={j} style={{fontSize:12,display:"flex",gap:7,color:"var(--grn)"}}><span>✓</span>{c}</div>)}</div>}
                          {d.batching_strategy&&<div className="infobox ib-blue" style={{fontSize:12}}>Batching: {d.batching_strategy}</div>}
                        </div>
                      )},
                      {k:"model",icon:"🤖",label:"Model Strategy",data:optResult.model_strategy,render:(d:any)=>(
                        <div style={{display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
                          <div style={{flex:1}}><div className="section-lbl" style={{marginBottom:4}}>Current</div><span className="tag tag-amb">{d.current_model}</span></div>
                          <div style={{fontSize:20,paddingTop:14}}>→</div>
                          <div style={{flex:1}}><div className="section-lbl" style={{marginBottom:4}}>Recommended</div><span className="tag tag-grn">{d.recommended_model}</span></div>
                          <div style={{flex:2}}><div className="section-lbl" style={{marginBottom:4}}>Justification</div><div style={{fontSize:12,color:"var(--mut)",lineHeight:1.6}}>{d.justification}</div></div>
                        </div>
                      )},
                      {k:"cache",icon:"💾",label:"Caching Strategy",data:optResult.caching_strategy,render:(d:any)=>(
                        <div className="col" style={{gap:8}}>
                          {d.cacheable_components?.length>0&&<div><div className="section-lbl" style={{marginBottom:4}}>Cacheable</div>{d.cacheable_components.map((c:string,j:number)=><div key={j} style={{fontSize:12,display:"flex",gap:7,color:"var(--grn)"}}><span>💾</span>{c}</div>)}</div>}
                          <div style={{display:"flex",gap:20,flexWrap:"wrap",marginTop:4}}>
                            {d.ttl_recommendation&&<div><div className="section-lbl" style={{marginBottom:2}}>TTL</div><span className="mono acc" style={{fontSize:12}}>{d.ttl_recommendation}</span></div>}
                            {d.expected_savings&&<div><div className="section-lbl" style={{marginBottom:2}}>Expected Savings</div><span className="mono" style={{fontSize:12,color:"var(--grn)"}}>{d.expected_savings}</span></div>}
                          </div>
                        </div>
                      )},
                      {k:"workflow",icon:"🔀",label:"Workflow Optimization",data:optResult.workflow_optimization,render:(d:any)=>(
                        <div>
                          {d.issues?.map((i:string,j:number)=><div key={j} style={{fontSize:12,display:"flex",gap:7,padding:"3px 0",color:"var(--amb)"}}><span>⚠</span>{i}</div>)}
                          {d.optimized_flow&&<div style={{marginTop:10}}><div className="section-lbl" style={{marginBottom:4}}>Optimized Flow</div><div style={{fontSize:12,lineHeight:1.7,color:"var(--txt)"}}>{d.optimized_flow}</div></div>}
                        </div>
                      )},
                    ].map(({k,icon,label,data,render})=>data?(
                      <div key={k} className="sa-out-sec">
                        <div className="sa-out-hd" onClick={()=>toggleOpt(k)}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:14}}>{icon}</span><span style={{fontFamily:"Syne",fontWeight:700,fontSize:14}}>{label}</span></div>
                          <span style={{fontSize:13,color:"var(--mut)"}}>{optExpanded[k]?"▾":"▸"}</span>
                        </div>
                        {optExpanded[k]&&<div className="sa-out-body">{render(data)}</div>}
                      </div>
                    ):null)}

                    {/* Final recommendations */}
                    {optResult.final_recommendation?.length>0&&(
                      <div className="sa-out-sec">
                        <div className="sa-out-hd" onClick={()=>toggleOpt("reco")}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:14}}>🎯</span><span style={{fontFamily:"Syne",fontWeight:700,fontSize:14}}>Top 3 Actions</span></div>
                          <span style={{fontSize:13,color:"var(--mut)"}}>{optExpanded.reco?"▾":"▸"}</span>
                        </div>
                        {optExpanded.reco&&(
                          <div className="sa-out-body">
                            {optResult.final_recommendation.map((r:string,i:number)=>(
                              <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid var(--bdr)",alignItems:"flex-start"}}>
                                <div style={{width:24,height:24,borderRadius:"50%",background:"rgba(0,212,255,0.1)",border:"1px solid rgba(0,212,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"DM Mono",fontWeight:700,fontSize:11,color:"var(--acc)",flexShrink:0}}>#{i+1}</div>
                                <span style={{fontSize:13,lineHeight:1.6}}>{r}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}

                {/* Empty state */}
                {!optResult&&!optRunning&&(
                  <div className="card" style={{padding:32,textAlign:"center",opacity:0.5}}>
                    <div style={{fontSize:42,marginBottom:10}}>⚡</div>
                    <div style={{fontFamily:"Syne",fontWeight:700,fontSize:15,marginBottom:6}}>Analysis appears here</div>
                    <div style={{fontSize:12,color:"var(--mut)",maxWidth:340,margin:"0 auto"}}>Select an agent, optionally paste its prompt, and click Run Optimizer. Works even without a prompt — uses live token_usage data from the DB.</div>
                  </div>
                )}

              </div>
            )}





            {/* SPRINT INTELLIGENCE */}
            {page==="sprint"&&(
              <div className="col">

                {/* Input */}
                <div className="card">
                  <div className="ch">
                    <div>
                      <div style={{fontFamily:"Syne",fontWeight:800,fontSize:16}}>⚡ Sprint Intelligence Agent</div>
                      <div style={{fontSize:12,color:"var(--mut)",marginTop:3}}>Autonomous — investigates, detects risks, creates tasks, and drafts alerts without manual prompting</div>
                    </div>
                  </div>
                  <div className="cb">
                    <div className="form-grid" style={{marginBottom:10}}>
                      <div className="form-row">
                        <label className="form-label">Project</label>
                        <select className="input select" value={siProject} onChange={e=>{setSiProject(e.target.value);const p=projects.find(x=>x.name===e.target.value);setSiProjectKey(p?.jira_key||"");}}>
                          <option value="">Select project...</option>
                          {projects.map(p=><option key={p.id} value={p.name}>{p.name} {p.jira_key?`(${p.jira_key})`:""}</option>)}
                        </select>
                      </div>
                      <div className="form-row">
                        <label className="form-label">Jira Project Key (auto-filled)</label>
                        <input className="input" value={siProjectKey} onChange={e=>setSiProjectKey(e.target.value)} placeholder="e.g. ANA, ZTS, WAI"/>
                      </div>
                    </div>
                    {/* What the agent does */}
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                      {["Checks sprint completion","Analyzes velocity trend","Deep-dives blockers","Detects overload","Correlates meeting actions","Assesses OKR impact","Creates tasks autonomously","Drafts stakeholder alerts"].map(l=>(
                        <span key={l} style={{fontFamily:"DM Mono",fontSize:9,padding:"3px 9px",borderRadius:100,background:"rgba(0,212,255,0.07)",border:"1px solid rgba(0,212,255,0.15)",color:"var(--acc)"}}>{l}</span>
                      ))}
                    </div>
                    {siError&&<div className="infobox ib-red" style={{marginBottom:10}}>⚠️ {siError}</div>}
                    <button style={{width:"100%",padding:13,background:siRunning||!siProject?"var(--bdr)":"linear-gradient(90deg,var(--amb),var(--acc))",border:"none",borderRadius:9,fontFamily:"Syne",fontWeight:800,fontSize:14,color:siRunning||!siProject?"var(--mut)":"#000",cursor:siRunning||!siProject?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10}} onClick={runSprintIntelligence} disabled={siRunning||!siProject}>
                      {siRunning?<><span className="spin" style={{width:16,height:16,borderWidth:2,borderTopColor:"#000",borderColor:"rgba(0,0,0,0.2)"}}/>Investigating...</>:"⚡ Run Sprint Intelligence"}
                    </button>
                  </div>
                </div>

                {/* Thinking */}
                {siRunning&&(
                  <div className="sa-thinking">
                    <div style={{fontFamily:"Syne",fontWeight:700,fontSize:13,marginBottom:4}}>Agent investigating and acting autonomously…</div>
                    {SI_STEPS.map((step,i)=>(
                      <div key={i} className="sa-think-step">
                        <div className={`sa-think-dot ${i<siStep?"sa-think-done":i===siStep?"sa-think-active":"sa-think-wait"}`}/>
                        <span style={{color:i<siStep?"var(--grn)":i===siStep?"var(--acc)":"var(--mut)"}}>{step}</span>
                        {i<siStep&&<span style={{marginLeft:"auto",fontFamily:"DM Mono",fontSize:9,color:"var(--grn)"}}>✓</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Result */}
                {siResult&&!siRunning&&(()=>{
                  const health=siResult.sprint_health||"yellow";
                  return(
                    <div className="col">

                      {/* Health banner */}
                      <div style={{background:siBg(health),border:`1px solid ${siBdr(health)}`,borderRadius:14,padding:"20px 24px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                          <div>
                            <div style={{fontFamily:"Syne",fontWeight:800,fontSize:26,color:siColor(health),marginBottom:6}}>
                              {health==="green"?"🟢":health==="yellow"?"🟡":"🔴"} Sprint Health: {health.toUpperCase()}
                            </div>
                            {/* Key metrics strip */}
                            {siResult.key_metrics&&(
                              <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
                                {[
                                  ["Completion",siResult.key_metrics.completion_rate,"var(--acc)"],
                                  ["Blockers",siResult.key_metrics.blockers,siResult.key_metrics.blockers>2?"var(--red)":"var(--amb)"],
                                  ["Velocity",siResult.key_metrics.velocity_direction||siResult.key_metrics.carryover_trend,"var(--mut)"],
                                  ["Bug Trend",siResult.key_metrics.bug_trend,"var(--mut)"],
                                  ["Scope Changes",siResult.key_metrics.scope_changes,"var(--mut)"],
                                ].map(([l,v,c])=>v!==undefined&&v!==null&&<div key={l as string}><div style={{fontFamily:"DM Mono",fontSize:10,color:"var(--mut)",marginBottom:2}}>{l}</div><div style={{fontFamily:"Syne",fontWeight:700,fontSize:13,color:c as string}}>{String(v)}</div></div>)}
                              </div>
                            )}
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                            <span className={`tag ${siResult.confidence_score==="high"?"tag-grn":siResult.confidence_score==="medium"?"tag-amb":"tag-red"}`} style={{fontSize:9}}>Confidence: {siResult.confidence_score}</span>
                            <div style={{fontSize:10,color:"var(--grn)",fontFamily:"DM Mono"}}>✓ Saved to Decision Log</div>
                            <div style={{fontSize:10,color:"var(--mut)",fontFamily:"DM Mono"}}>{siResult.assessed_at?new Date(siResult.assessed_at).toLocaleString():""}</div>
                          </div>
                        </div>
                      </div>

                      {/* Actions taken (the agent actually did things) */}
                      {siResult.actions_taken?.length>0&&(
                        <div className="card">
                          <div className="ch">
                            <div className="ct">⚡ Actions Taken Autonomously</div>
                            <span className="tag tag-grn" style={{fontSize:9}}>{siResult.actions_taken.length} actions</span>
                          </div>
                          <div className="cb">
                            {siResult.actions_taken.map((a:any,i:number)=>(
                              <div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:"1px solid var(--bdr)",alignItems:"flex-start"}}>
                                <span className={`tag ${a.status==="success"?"tag-grn":a.status==="skipped"?"tag-dim":"tag-amb"}`} style={{fontSize:9,flexShrink:0}}>{a.status}</span>
                                <div style={{flex:1}}>
                                  <div style={{fontSize:12,fontWeight:500,marginBottom:2}}>{a.action}</div>
                                  <div style={{fontSize:11,color:"var(--mut)"}}>{a.rationale}</div>
                                  {a.tool_used&&<span style={{fontFamily:"DM Mono",fontSize:9,color:"var(--pur)"}}>{a.tool_used} → {a.target}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Risks + recommendations */}
                      <div className="g2">
                        {siResult.risks_detected?.length>0&&(
                          <div className="card">
                            <div className="ch"><div className="ct">Risks Detected</div></div>
                            <div className="cb">
                              {siResult.risks_detected.map((r:any,i:number)=>(
                                <div key={i} style={{padding:"8px 0",borderBottom:"1px solid var(--bdr)"}}>
                                  <div style={{display:"flex",gap:6,marginBottom:3}}>
                                    <span className={`tag ${r.severity==="high"?"tag-red":r.severity==="medium"?"tag-amb":"tag-dim"}`} style={{fontSize:9}}>{r.severity}</span>
                                    <span style={{fontFamily:"DM Mono",fontSize:9,color:"var(--mut)"}}>{r.type}</span>
                                  </div>
                                  <div style={{fontSize:12,fontWeight:500,marginBottom:2}}>{r.description}</div>
                                  {r.root_cause&&<div style={{fontSize:11,color:"var(--acc)"}}>Root cause: {r.root_cause}</div>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {siResult.recommended_actions?.length>0&&(
                          <div className="card">
                            <div className="ch"><div className="ct">Recommended Actions</div></div>
                            <div className="cb">
                              {siResult.recommended_actions.map((a:string,i:number)=>(
                                <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid var(--bdr)",fontSize:12,alignItems:"flex-start"}}>
                                  <div style={{width:20,height:20,borderRadius:"50%",background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"DM Mono",fontSize:10,color:"var(--amb)",flexShrink:0}}>{i+1}</div>
                                  {a}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Stakeholder alert if drafted */}
                      {siResult.stakeholder_alert?.generated&&(
                        <div className="card" style={{border:"1px solid rgba(239,68,68,0.2)"}}>
                          <div className="ch">
                            <div className="ct" style={{color:"var(--red)"}}>🚨 Stakeholder Alert Drafted</div>
                            <span className="tag tag-dim" style={{fontSize:9}}>Not auto-sent — review first</span>
                          </div>
                          <div className="cb">
                            <div style={{fontSize:12,marginBottom:6}}><strong>Recipients:</strong> {siResult.stakeholder_alert.recipients}</div>
                            <div style={{fontSize:12,color:"var(--mut)"}}>{siResult.stakeholder_alert.summary}</div>
                            <div style={{display:"flex",gap:6,marginTop:10}}>
                              <button className="btn btn-primary btn-sm" onClick={()=>{runSHUpdate("",siResult.project);}}>Send via Stakeholder Agent</button>
                              <button className="btn btn-sm" onClick={()=>navigator.clipboard.writeText(siResult.stakeholder_alert.summary||"").then(()=>alert("Copied!"))}>Copy Draft</button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Self evaluation + sources */}
                      <div className="g2">
                        {siResult.data_sources?.length>0&&(
                          <div className="card">
                            <div className="ch"><div className="ct">Data Sources</div></div>
                            <div className="cb">
                              {siResult.data_sources.map((s:any,i:number)=>(
                                <div key={i} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:"1px solid var(--bdr)",fontSize:11}}>
                                  <span className="tag tag-pur" style={{fontSize:9,flexShrink:0}}>{s.source}</span>
                                  <span style={{color:"var(--mut)"}}>{s.summary}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {siResult.self_evaluation&&(
                          <div className="infobox ib-blue" style={{fontSize:11,alignSelf:"flex-start"}}>
                            <strong className="acc">Self-Eval:</strong> {siResult.self_evaluation.improvements_made||siResult.self_evaluation.critique}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })()}

                {/* Empty state */}
                {!siResult&&!siRunning&&(
                  <div className="card" style={{padding:32,textAlign:"center",opacity:0.5}}>
                    <div style={{fontSize:40,marginBottom:10}}>⚡</div>
                    <div style={{fontFamily:"Syne",fontWeight:700,fontSize:15,marginBottom:6}}>Select a project and run</div>
                    <div style={{fontSize:12,color:"var(--mut)",maxWidth:400,margin:"0 auto"}}>The agent autonomously fetches sprint data, analyzes velocity trends, diagnoses blockers, detects overload, creates tasks, and drafts stakeholder alerts — all without manual prompting.</div>
                  </div>
                )}
              </div>
            )}

            {/* RELEASE READINESS */}
            {page==="release"&&(
              <div className="col">

                {/* Input */}
                <div className="card">
                  <div className="ch">
                    <div>
                      <div style={{fontFamily:"Syne",fontWeight:800,fontSize:16}}>🚦 Release Readiness Agent</div>
                      <div style={{fontSize:12,color:"var(--mut)",marginTop:3}}>Autonomous multi-step assessment — agent decides what to investigate based on what it finds</div>
                    </div>
                  </div>
                  <div className="cb">
                    <div className="form-grid" style={{marginBottom:10}}>
                      <div className="form-row">
                        <label className="form-label">Project</label>
                        <select className="input select" value={rrProject} onChange={e=>setRrProject(e.target.value)}>
                          <option value="">Select project...</option>
                          {projects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}
                        </select>
                      </div>
                      <div className="form-row">
                        <label className="form-label">Release Scope (optional)</label>
                        <input className="input" value={rrScope} onChange={e=>setRrScope(e.target.value)} placeholder="e.g. Sprint 9 — PDF export + SSO redesign"/>
                      </div>
                    </div>
                    {rrError&&<div className="infobox ib-red" style={{marginBottom:10}}>⚠️ {rrError}</div>}
                    <button style={{width:"100%",padding:13,background:rrRunning||!rrProject?"var(--bdr)":"linear-gradient(90deg,#ef4444,#f59e0b,#10b981)",border:"none",borderRadius:9,fontFamily:"Syne",fontWeight:800,fontSize:14,color:rrRunning||!rrProject?"var(--mut)":"#000",cursor:rrRunning||!rrProject?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10}} onClick={runReleaseReadiness} disabled={rrRunning||!rrProject}>
                      {rrRunning?<><span className="spin" style={{width:16,height:16,borderWidth:2,borderTopColor:"#000",borderColor:"rgba(0,0,0,0.2)"}}/>Assessing...</>:"🚦 Run Release Readiness Check"}
                    </button>
                  </div>
                </div>

                {/* Thinking */}
                {rrRunning&&(
                  <div className="sa-thinking">
                    <div style={{fontFamily:"Syne",fontWeight:700,fontSize:13,marginBottom:4}}>Agent investigating autonomously…</div>
                    {RR_STEPS.map((step,i)=>(
                      <div key={i} className="sa-think-step">
                        <div className={`sa-think-dot ${i<rrStep?"sa-think-done":i===rrStep?"sa-think-active":"sa-think-wait"}`}/>
                        <span style={{color:i<rrStep?"var(--grn)":i===rrStep?"var(--acc)":"var(--mut)"}}>{step}</span>
                        {i<rrStep&&<span style={{marginLeft:"auto",fontFamily:"DM Mono",fontSize:9,color:"var(--grn)"}}>✓</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Result */}
                {rrResult&&!rrRunning&&(()=>{
                  const status=rrResult.release_status||"yellow";
                  const rec=rrResult.go_no_go_recommendation||"conditional_go";
                  return(
                    <div className="col">

                      {/* Verdict banner */}
                      <div style={{background:rrStatusBg(status),border:`1px solid ${rrStatusBdr(status)}`,borderRadius:14,padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
                            <div style={{fontFamily:"Syne",fontWeight:800,fontSize:28,color:rrStatusColor(status)}}>
                              {status==="green"?"🟢":status==="yellow"?"🟡":"🔴"} {status.toUpperCase()}
                            </div>
                            <span style={{fontFamily:"DM Mono",fontSize:11,padding:"4px 12px",borderRadius:100,background:`${rrStatusColor(status)}15`,border:`1px solid ${rrStatusColor(status)}30`,color:rrStatusColor(status),fontWeight:600}}>
                              {rec==="go"?"✓ GO":rec==="no_go"?"✗ NO-GO":"⚠ CONDITIONAL GO"}
                            </span>
                          </div>
                          <div style={{fontSize:13,lineHeight:1.7,maxWidth:600}}>{rrResult.summary}</div>
                        </div>
                        <div style={{display:"flex",flex:"column",gap:6,alignItems:"flex-end"}}>
                          <span className={`tag ${rrResult.confidence_score==="high"?"tag-grn":rrResult.confidence_score==="medium"?"tag-amb":"tag-red"}`} style={{fontSize:9}}>Confidence: {rrResult.confidence_score}</span>
                          <div style={{fontSize:10,color:"var(--mut)",fontFamily:"DM Mono",marginTop:4}}>{rrResult.assessed_at?new Date(rrResult.assessed_at).toLocaleString():""}</div>
                          <div style={{fontSize:10,color:"var(--grn)",fontFamily:"DM Mono"}}>✓ Saved to Decision Log</div>
                        </div>
                      </div>

                      {/* Readiness grid */}
                      {rrResult.readiness_breakdown&&(
                        <div className="g3" style={{gap:8}}>
                          {Object.entries(rrResult.readiness_breakdown).map(([dim,data]:any)=>(
                            <div key={dim} style={{background:rrStatusBg(data.status||"yellow"),border:`1px solid ${rrStatusBdr(data.status||"yellow")}`,borderRadius:9,padding:"12px 14px"}}>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                                <span style={{fontFamily:"Syne",fontWeight:700,fontSize:12,textTransform:"capitalize"}}>{dim}</span>
                                <span style={{fontFamily:"DM Mono",fontSize:10,color:rrStatusColor(data.status||"yellow"),fontWeight:600}}>{(data.status||"unknown").toUpperCase()}</span>
                              </div>
                              {(data.key_signals||[]).slice(0,3).map((sig:string,i:number)=>(
                                <div key={i} style={{fontSize:11,color:"var(--mut)",display:"flex",gap:5,padding:"2px 0"}}><span style={{opacity:0.5}}>—</span>{sig}</div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Blocking issues */}
                      {rrResult.blocking_issues?.length>0&&(
                        <div className="card">
                          <div className="ch"><div className="ct">🚫 Blocking Issues</div><span className="tag tag-red" style={{fontSize:9}}>{rrResult.blocking_issues.length} blockers</span></div>
                          <div className="cb">
                            {rrResult.blocking_issues.map((b:string,i:number)=>(
                              <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid var(--bdr)",fontSize:13}}>
                                <span style={{color:"var(--red)",flexShrink:0}}>✕</span>{b}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Critical risks + actions */}
                      <div className="g2">
                        {rrResult.critical_risks?.length>0&&(
                          <div className="card">
                            <div className="ch"><div className="ct">Critical Risks</div></div>
                            <div className="cb">
                              {rrResult.critical_risks.map((r:any,i:number)=>(
                                <div key={i} style={{padding:"8px 0",borderBottom:"1px solid var(--bdr)"}}>
                                  <div style={{display:"flex",gap:6,marginBottom:3}}>
                                    <span className={`tag ${r.severity==="high"?"tag-red":r.severity==="medium"?"tag-amb":"tag-dim"}`} style={{fontSize:9}}>{r.severity}</span>
                                    <span style={{fontSize:12,fontWeight:500}}>{r.risk}</span>
                                  </div>
                                  <div style={{fontSize:11,color:"var(--mut)",marginBottom:2}}>{r.impact}</div>
                                  {r.mitigation&&<div style={{fontSize:11,color:"var(--acc)"}}>→ {r.mitigation}</div>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {rrResult.recommended_actions?.length>0&&(
                          <div className="card">
                            <div className="ch"><div className="ct">Actions Required</div></div>
                            <div className="cb">
                              {rrResult.recommended_actions.map((a:string,i:number)=>(
                                <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid var(--bdr)",fontSize:12,alignItems:"flex-start"}}>
                                  <div style={{width:20,height:20,borderRadius:"50%",background:"rgba(0,212,255,0.1)",border:"1px solid rgba(0,212,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"DM Mono",fontSize:10,color:"var(--acc)",flexShrink:0}}>{i+1}</div>
                                  {a}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Data sources + gaps */}
                      <div className="g2">
                        {rrResult.data_sources?.length>0&&(
                          <div className="card">
                            <div className="ch"><div className="ct">Data Sources Used</div></div>
                            <div className="cb">
                              {rrResult.data_sources.map((s:any,i:number)=>(
                                <div key={i} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:"1px solid var(--bdr)",fontSize:11}}>
                                  <span className="tag tag-pur" style={{fontSize:9,flexShrink:0}}>{s.source}</span>
                                  <span style={{color:"var(--mut)"}}>{s.summary}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {rrResult.data_gaps?.length>0&&(
                          <div className="card">
                            <div className="ch"><div className="ct">Data Gaps</div></div>
                            <div className="cb">
                              {rrResult.data_gaps.map((g:string,i:number)=>(
                                <div key={i} style={{fontSize:12,display:"flex",gap:7,padding:"4px 0",color:"var(--amb)"}}><span>⚠</span>{g}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Self-evaluation */}
                      {rrResult.self_evaluation&&(
                        <div className="infobox ib-blue" style={{fontSize:11}}>
                          <strong className="acc">Self-Evaluation:</strong> {rrResult.self_evaluation.improvements_made||rrResult.self_evaluation.critique}
                        </div>
                      )}

                    </div>
                  );
                })()}

                {/* Empty state */}
                {!rrResult&&!rrRunning&&(
                  <div className="card" style={{padding:32,textAlign:"center",opacity:0.5}}>
                    <div style={{fontSize:40,marginBottom:10}}>🚦</div>
                    <div style={{fontFamily:"Syne",fontWeight:700,fontSize:15,marginBottom:6}}>Select a project and run</div>
                    <div style={{fontSize:12,color:"var(--mut)",maxWidth:380,margin:"0 auto"}}>The agent autonomously investigates Jira, risks, stakeholders, meetings, and OKRs — then returns a structured go/no-go recommendation with evidence.</div>
                  </div>
                )}
              </div>
            )}

            {/* RESEARCH AGENTS */}
            {page==="research"&&(
              <div className="col">

                {/* Hero */}
                <div style={{background:"linear-gradient(135deg,rgba(124,58,237,0.1),rgba(0,212,255,0.07))",border:"1px solid rgba(124,58,237,0.2)",borderRadius:14,padding:"20px 24px"}}>
                  <div style={{fontFamily:"Syne",fontWeight:800,fontSize:20,marginBottom:6}}>🔍 Research Agents</div>
                  <div style={{fontSize:13,color:"var(--mut)",maxWidth:600,lineHeight:1.6,marginBottom:12}}>Three specialized AI agents running in parallel with live web search. Produces competitive analysis, market sizing, and customer insights — grounded in real data.</div>
                  <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                    {[{ic:"🏆",l:"Competitive Agent",d:"Competitors · Pricing · Gaps",c:"var(--pur)"},{ic:"🌍",l:"Market Agent",d:"TAM/SAM/SOM · Trends · Growth",c:"var(--acc)"},{ic:"👥",l:"Customer Agent",d:"Themes · Pain Points · Segments",c:"var(--grn)"}].map(({ic,l,d,c})=>(
                      <div key={l} style={{background:"var(--surf)",border:`1px solid ${c}30`,borderRadius:9,padding:"10px 14px",flex:"1 1 180px"}}>
                        <div style={{fontSize:18,marginBottom:4}}>{ic}</div>
                        <div style={{fontFamily:"Syne",fontWeight:700,fontSize:12,color:c,marginBottom:2}}>{l}</div>
                        <div style={{fontSize:11,color:"var(--mut)"}}>{d}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="card">
                  <div className="ch"><div className="ct">Research Brief</div></div>
                  <div className="cb">
                    <div className="form-grid" style={{marginBottom:10}}>
                      <div className="form-row" style={{gridColumn:"1/-1"}}>
                        <label className="form-label">Product / Feature / Problem</label>
                        <input className="input" value={researchProduct} onChange={e=>setResearchProduct(e.target.value)} placeholder="e.g. AI-powered network anomaly detection for enterprise NOC teams" autoFocus/>
                      </div>
                      <div className="form-row">
                        <label className="form-label">Link to Project (optional)</label>
                        <select className="input select" value={researchProject} onChange={e=>setResearchProject(e.target.value)}>
                          <option value="">None</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div className="form-row">
                        <label className="form-label">Additional Context</label>
                        <input className="input" value={researchContext} onChange={e=>setResearchContext(e.target.value)} placeholder="Target market, stage, constraints..."/>
                      </div>
                    </div>
                    {researchError&&<div className="infobox ib-red" style={{marginBottom:10}}>⚠️ {researchError}</div>}
                    <button style={{width:"100%",padding:13,background:researchRunning||!researchProduct.trim()?"var(--bdr)":"linear-gradient(90deg,var(--pur),var(--acc))",border:"none",borderRadius:9,fontFamily:"Syne",fontWeight:800,fontSize:14,color:researchRunning||!researchProduct.trim()?"var(--mut)":"#000",cursor:researchRunning||!researchProduct.trim()?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10}} onClick={runResearch} disabled={researchRunning||!researchProduct.trim()}>
                      {researchRunning?<><span className="spin" style={{width:16,height:16,borderWidth:2,borderTopColor:"#000",borderColor:"rgba(0,0,0,0.2)"}}/>Researching...</>:"🔍 Run Research Agents"}
                    </button>
                  </div>
                </div>

                {/* Thinking steps */}
                {researchRunning&&(
                  <div className="sa-thinking">
                    <div style={{fontFamily:"Syne",fontWeight:700,fontSize:13,marginBottom:4}}>3 agents running in parallel…</div>
                    {RESEARCH_STEPS.map((step,i)=>(
                      <div key={i} className="sa-think-step">
                        <div className={`sa-think-dot ${i<researchStep?"sa-think-done":i===researchStep?"sa-think-active":"sa-think-wait"}`}/>
                        <span style={{color:i<researchStep?"var(--grn)":i===researchStep?"var(--acc)":"var(--mut)"}}>{step}</span>
                        {i<researchStep&&<span style={{marginLeft:"auto",fontFamily:"DM Mono",fontSize:9,color:"var(--grn)"}}>✓</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Results */}
                {researchResult&&!researchRunning&&(
                  <div className="col">
                    {/* Confidence + meta strip */}
                    <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",padding:"10px 14px",background:"var(--surf2)",border:"1px solid var(--bdr)",borderRadius:9}}>
                      <span style={{fontFamily:"Syne",fontWeight:700,fontSize:13,flex:1}}>{researchResult.product}</span>
                      <span className={researchResult.confidence_score==="high"?"confidence-high":researchResult.confidence_score==="medium"?"confidence-medium":"confidence-low"}>Confidence: {researchResult.confidence_score}</span>
                      <span className="mono dim" style={{fontSize:10}}>{researchResult.data_sources?.length||0} sources · {new Date(researchResult.generated_at).toLocaleTimeString()}</span>
                      {researchResult.data_gaps?.length>0&&<span className="tag tag-amb" style={{fontSize:9}}>{researchResult.data_gaps.length} data gaps</span>}
                      <button className="btn btn-sm" onClick={()=>navigator.clipboard.writeText(JSON.stringify(researchResult,null,2)).then(()=>alert("Copied JSON!"))}>Copy JSON</button>
                    </div>

                    {/* Tab navigation */}
                    <div className="fw-tabs">
                      {[{k:"synthesis",l:"🎯 Synthesis"},{k:"competitive",l:"🏆 Competitive"},{k:"market",l:"🌍 Market"},{k:"customer",l:"👥 Customer"}].map(({k,l})=>(
                        <button key={k} className={`fw-tab${researchTab===k?" on":""}`} onClick={()=>setResearchTab(k)}>{l}</button>
                      ))}
                    </div>

                    {/* Synthesis tab */}
                    {researchTab==="synthesis"&&researchResult.synthesis&&(
                      <div className="col">
                        <div className="card">
                          <div className="ch"><div style={{fontFamily:"Syne",fontWeight:700,fontSize:14}}>Strategic Synthesis</div><span className={`tag ${researchResult.synthesis.investment_recommendation==="build"?"tag-grn":researchResult.synthesis.investment_recommendation==="avoid"?"tag-red":"tag-amb"}`} style={{fontSize:9,textTransform:"uppercase"}}>Recommendation: {researchResult.synthesis.investment_recommendation}</span></div>
                          {researchResult.synthesis.investment_rationale&&<div className="cb"><p style={{fontSize:13,lineHeight:1.8,color:"var(--txt)"}}>{researchResult.synthesis.investment_rationale}</p></div>}
                        </div>
                        <div className="g2">
                          <div className="card">
                            <div className="ch"><div className="ct">Key Insights</div></div>
                            <div className="cb">
                              {(researchResult.synthesis.key_insights||[]).map((ins:string,i:number)=>(
                                <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid var(--bdr)",alignItems:"flex-start"}}>
                                  <div style={{width:20,height:20,borderRadius:"50%",background:"rgba(0,212,255,0.1)",border:"1px solid rgba(0,212,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"DM Mono",fontSize:10,color:"var(--acc)",flexShrink:0}}>{i+1}</div>
                                  <span style={{fontSize:12,lineHeight:1.6}}>{ins}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="card">
                            <div className="ch"><div className="ct">Recommended Actions</div></div>
                            <div className="cb">
                              {(researchResult.synthesis.recommended_actions||[]).map((a:any,i:number)=>(
                                <div key={i} style={{padding:"9px 0",borderBottom:"1px solid var(--bdr)"}}>
                                  <div style={{display:"flex",gap:6,marginBottom:3}}>
                                    <span className={`tag ${a.priority==="p0"?"tag-red":a.priority==="p1"?"tag-amb":"tag-dim"}`} style={{fontSize:9}}>{a.priority}</span>
                                    <span className="tag tag-dim" style={{fontSize:9}}>{a.timeframe}</span>
                                  </div>
                                  <div style={{fontWeight:500,fontSize:12,marginBottom:2}}>{a.action}</div>
                                  <div style={{fontSize:11,color:"var(--mut)"}}>{a.rationale}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {(researchResult.synthesis.strategic_implications||[]).length>0&&(
                          <div className="card">
                            <div className="ch"><div className="ct">Strategic Implications</div></div>
                            <div className="cb">
                              {researchResult.synthesis.strategic_implications.map((si:string,i:number)=>(
                                <div key={i} style={{fontSize:12,display:"flex",gap:8,padding:"5px 0",borderBottom:"1px solid var(--bdr)",color:"var(--txt)"}}><span style={{color:"var(--pur)",flexShrink:0}}>◈</span>{si}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Competitive tab */}
                    {researchTab==="competitive"&&researchResult.competitive_analysis&&(()=>{
                      const ca=researchResult.competitive_analysis;
                      return(
                        <div className="col">
                          <div style={{display:"flex",gap:10,alignItems:"center"}}>
                            <span className={`tag ${ca.threat_level==="high"?"tag-red":ca.threat_level==="medium"?"tag-amb":"tag-grn"}`}>Threat Level: {ca.threat_level}</span>
                            {ca.competitive_positioning&&<span style={{fontSize:12,color:"var(--mut)"}}>{ca.competitive_positioning}</span>}
                          </div>
                          <div className="ga">
                            {(ca.competitors||[]).map((c:any,i:number)=>(
                              <div key={i} className="card" style={{padding:"14px 16px"}}>
                                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                                  <div style={{fontFamily:"Syne",fontWeight:700,fontSize:14}}>{c.name}</div>
                                  <span className={`tag ${c.type==="direct"?"tag-red":"tag-amb"}`} style={{fontSize:9}}>{c.type}</span>
                                </div>
                                {c.pricing_model&&<div style={{fontFamily:"DM Mono",fontSize:10,color:"var(--acc)",marginBottom:8}}>{c.pricing_model}</div>}
                                {c.key_features?.length>0&&<div style={{marginBottom:6}}><div className="section-lbl" style={{marginBottom:3}}>Key Features</div>{c.key_features.slice(0,4).map((f:string,j:number)=><div key={j} style={{fontSize:11,display:"flex",gap:5,padding:"1px 0",color:"var(--txt)"}}><span style={{opacity:0.4}}>—</span>{f}</div>)}</div>}
                                <div className="g2" style={{gap:8}}>
                                  {c.strengths?.length>0&&<div><div className="section-lbl" style={{marginBottom:3}}>Strengths</div>{c.strengths.slice(0,3).map((s:string,j:number)=><div key={j} style={{fontSize:10,color:"var(--grn)",display:"flex",gap:4}}><span>+</span>{s}</div>)}</div>}
                                  {c.weaknesses?.length>0&&<div><div className="section-lbl" style={{marginBottom:3}}>Weaknesses</div>{c.weaknesses.slice(0,3).map((w:string,j:number)=><div key={j} style={{fontSize:10,color:"var(--red)",display:"flex",gap:4}}><span>−</span>{w}</div>)}</div>}
                                </div>
                              </div>
                            ))}
                          </div>
                          {ca.gaps_opportunities?.length>0&&(
                            <div className="card">
                              <div className="ch"><div className="ct">Gaps & Opportunities</div></div>
                              <div className="cb">{ca.gaps_opportunities.map((g:string,i:number)=><div key={i} style={{fontSize:12,display:"flex",gap:8,padding:"5px 0",borderBottom:"1px solid var(--bdr)"}}><span style={{color:"var(--grn)"}}>💡</span>{g}</div>)}</div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Market tab */}
                    {researchTab==="market"&&researchResult.market_analysis&&(()=>{
                      const ma=researchResult.market_analysis;
                      return(
                        <div className="col">
                          <div className="g3">
                            {[["TAM",ma.market_size?.TAM,"var(--acc)"],["SAM",ma.market_size?.SAM,"var(--pur)"],["SOM",ma.market_size?.SOM,"var(--grn)"]].map(([l,v,c])=>(
                              <div key={l} className="kpi"><div className="kpi-v" style={{color:c as string,fontSize:22}}>{v||"DATA GAP"}</div><div className="kpi-l">{l as string}</div>{ma.market_size?.source&&l==="TAM"&&<div style={{fontSize:9,color:"var(--mut)",marginTop:2,fontFamily:"DM Mono"}}>{ma.market_size.source}</div>}</div>
                            ))}
                          </div>
                          <div style={{display:"flex",gap:8,alignItems:"center"}}>
                            <span style={{fontFamily:"DM Mono",fontSize:10,color:"var(--mut)"}}>Market Opportunity:</span>
                            <span className={`tag ${ma.market_opportunity_score==="high"?"tag-grn":ma.market_opportunity_score==="low"?"tag-red":"tag-amb"}`}>{ma.market_opportunity_score}</span>
                          </div>
                          <div className="g2">
                            <div className="card">
                              <div className="ch"><div className="ct">Key Trends</div></div>
                              <div className="cb">{(ma.key_trends||[]).map((t:any,i:number)=><div key={i} style={{padding:"8px 0",borderBottom:"1px solid var(--bdr)"}}><div style={{fontWeight:500,fontSize:12,marginBottom:2}}>{t.trend||t}</div>{t.evidence&&<div style={{fontSize:11,color:"var(--mut)",marginBottom:2}}>{t.evidence}</div>}{t.implication&&<div style={{fontSize:11,color:"var(--acc)"}}>→ {t.implication}</div>}</div>)}</div>
                            </div>
                            <div className="col">
                              {ma.growth_drivers?.length>0&&<div className="card"><div className="ch"><div className="ct">Growth Drivers</div></div><div className="cb">{ma.growth_drivers.map((d:string,i:number)=><div key={i} style={{fontSize:12,display:"flex",gap:7,padding:"4px 0",borderBottom:"1px solid var(--bdr)"}}><span style={{color:"var(--grn)"}}>▲</span>{d}</div>)}</div></div>}
                              {ma.risks?.length>0&&<div className="card"><div className="ch"><div className="ct">Risks</div></div><div className="cb">{ma.risks.map((r:any,i:number)=><div key={i} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:"1px solid var(--bdr)",fontSize:12}}><span className={`tag ${(r.severity||"medium")==="high"?"tag-red":(r.severity||"medium")==="low"?"tag-grn":"tag-amb"}`} style={{fontSize:9,flexShrink:0}}>{r.severity||"med"}</span>{r.risk||r}</div>)}</div></div>}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Customer tab */}
                    {researchTab==="customer"&&researchResult.customer_insights&&(()=>{
                      const ci=researchResult.customer_insights;
                      return(
                        <div className="col">
                          {ci.insight_summary&&<div className="infobox ib-blue" style={{fontSize:13,lineHeight:1.8}}>{ci.insight_summary}</div>}
                          <div className="g2">
                            <div className="card">
                              <div className="ch"><div className="ct">Themes</div></div>
                              <div className="cb0" style={{padding:"4px 16px"}}>
                                {(ci.themes||[]).map((t:any,i:number)=>(
                                  <div key={i} style={{padding:"10px 0",borderBottom:"1px solid var(--bdr)"}}>
                                    <div style={{display:"flex",gap:6,marginBottom:4}}>
                                      <span style={{fontWeight:600,fontSize:12}}>{t.label}</span>
                                      <span className={`tag ${t.frequency==="high"?"tag-red":t.frequency==="medium"?"tag-amb":"tag-dim"}`} style={{fontSize:9}}>{t.frequency}</span>
                                      {t.source&&<span className="tag tag-dim" style={{fontSize:9}}>{t.source}</span>}
                                    </div>
                                    {t.representative_quote&&<div style={{fontSize:11,color:"var(--mut)",fontStyle:"italic",padding:"4px 8px",borderLeft:"2px solid var(--bdr2)",lineHeight:1.6}}>"{t.representative_quote}"</div>}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="col">
                              <div className="card">
                                <div className="ch"><div className="ct">Pain Points</div></div>
                                <div className="cb">{(ci.pain_points||[]).map((p:any,i:number)=><div key={i} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:"1px solid var(--bdr)",fontSize:12}}><span className={`tag ${(p.severity||"high")==="critical"?"tag-red":(p.severity||"high")==="high"?"tag-amb":"tag-dim"}`} style={{fontSize:9,flexShrink:0}}>{p.severity||"high"}</span><div><div>{p.pain||p}</div>{p.affected_segment&&<div style={{fontSize:10,color:"var(--mut)"}}>{p.affected_segment}</div>}</div></div>)}</div>
                              </div>
                              <div className="card">
                                <div className="ch"><div className="ct">User Segments</div></div>
                                <div className="cb">{(ci.user_segments||[]).map((s:any,i:number)=><div key={i} style={{padding:"7px 0",borderBottom:"1px solid var(--bdr)"}}><div style={{display:"flex",gap:6,marginBottom:2}}><span style={{fontWeight:500,fontSize:12}}>{s.segment}</span>{s.willingness_to_pay&&<span className={`tag ${s.willingness_to_pay==="high"?"tag-grn":"tag-dim"}`} style={{fontSize:9}}>WTP: {s.willingness_to_pay}</span>}</div><div style={{fontSize:11,color:"var(--mut)"}}>{s.key_need}</div>{s.size_estimate&&<div style={{fontSize:10,color:"var(--acc)",fontFamily:"DM Mono"}}>{s.size_estimate}</div>}</div>)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Data Sources */}
                    {researchResult.data_sources?.length>0&&(
                      <div className="card">
                        <div className="ch"><div className="ct">Data Sources · {researchResult.data_sources.length} total</div></div>
                        <div className="cb">
                          {researchResult.data_sources.slice(0,8).map((s:any,i:number)=>(
                            <div key={i} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:"1px solid var(--bdr)",fontSize:11}}>
                              <span className={`tag ${s.type==="web"?"tag-blu":s.type==="internal"?"tag-grn":"tag-dim"}`} style={{fontSize:9,flexShrink:0}}>{s.type}</span>
                              <span style={{color:"var(--mut)"}}>{s.summary}</span>
                            </div>
                          ))}
                          {researchResult.data_gaps?.length>0&&<div style={{marginTop:10}}>{researchResult.data_gaps.map((g:string,i:number)=><div key={i} style={{fontSize:11,color:"var(--amb)",display:"flex",gap:6,padding:"2px 0"}}><span>⚠</span>{g}</div>)}</div>}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Empty state */}
                {!researchResult&&!researchRunning&&(
                  <div className="card" style={{padding:32,textAlign:"center",opacity:0.5}}>
                    <div style={{fontSize:40,marginBottom:10}}>🔍</div>
                    <div style={{fontFamily:"Syne",fontWeight:700,fontSize:15,marginBottom:6}}>Research appears here</div>
                    <div style={{fontSize:12,color:"var(--mut)",maxWidth:380,margin:"0 auto"}}>Enter a product or feature. Three AI agents run in parallel with live web search — competitive analysis, market sizing, and customer insights in one pass.</div>
                  </div>
                )}
              </div>
            )}

            {/* DECISION LOG */}
            {page==="decisions"&&(
              <div className="col">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                  <div style={{display:"flex",gap:8}}>
                    {[["all","All"],["pending","Pending"],["validated","Validated"],["reversed","Reversed"]].map(([v,l])=>(
                      <button key={v} style={{fontFamily:"DM Mono",fontSize:10,padding:"4px 12px",borderRadius:100,cursor:"pointer",border:`1px solid ${v==="all"&&decisions.length>=0?"var(--acc)":"var(--bdr)"}`,background:"var(--surf)",color:"var(--mut)"}} onClick={()=>{}}>{l}</button>
                    ))}
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={()=>setShowAddDecision(true)}>+ Log Decision</button>
                </div>
                {decisions.length===0&&<div className="empty">No decisions logged yet. Every major PM decision should be recorded here — what, why, what data, what trade-offs.</div>}
                <div className="col">
                  {decisions.map((d:any)=>(
                    <div key={d.id} className="card" style={{padding:"16px 18px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,gap:10}}>
                        <div style={{flex:1}}>
                          <div style={{fontFamily:"Syne",fontWeight:700,fontSize:14,marginBottom:3}}>{d.title}</div>
                          <div style={{fontSize:12,color:"var(--mut)"}}>{new Date(d.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}{d.projects?.name&&<> · {d.projects.name}</>}</div>
                        </div>
                        <div style={{display:"flex",gap:5,alignItems:"center",flexShrink:0}}>
                          <span className={`tag ${d.outcome_status==="validated"?"tag-grn":d.outcome_status==="reversed"?"tag-red":"tag-dim"}`} style={{fontSize:9}}>{d.outcome_status}</span>
                          <button className="btn btn-danger btn-sm" onClick={async()=>{if(!window.confirm("Delete?"))return;await supabase.from("decision_log").delete().eq("id",d.id).then(undefined,()=>{});loadDecisions();}}>✕</button>
                        </div>
                      </div>
                      <div style={{fontSize:13,lineHeight:1.7,marginBottom:10,padding:"8px 10px",background:"rgba(0,212,255,0.04)",borderRadius:7,borderLeft:"2px solid var(--acc)"}}>{d.decision}</div>
                      {d.rationale&&<div style={{marginBottom:8}}><div className="section-lbl" style={{marginBottom:3}}>Rationale</div><div style={{fontSize:12,color:"var(--mut)",lineHeight:1.6}}>{d.rationale}</div></div>}
                      {d.trade_offs?.length>0&&<div style={{marginBottom:8}}><div className="section-lbl" style={{marginBottom:3}}>Trade-offs considered</div>{d.trade_offs.map((t:string,i:number)=><div key={i} style={{fontSize:12,display:"flex",gap:6,color:"var(--mut)",padding:"2px 0"}}><span style={{color:"var(--amb)"}}>↔</span>{t}</div>)}</div>}
                      {d.tags?.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{d.tags.map((t:string,i:number)=><span key={i} className="tag tag-dim" style={{fontSize:9}}>{t}</span>)}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KNOWLEDGE MEMORY */}
            {page==="knowledge"&&(
              <div className="col">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {["all","prd","insight","learning","template","competitive","research"].map(t=>(
                      <button key={t} onClick={()=>setKnowledgeFilter(t)} style={{fontFamily:"DM Mono",fontSize:10,padding:"4px 11px",borderRadius:100,cursor:"pointer",border:`1px solid ${knowledgeFilter===t?"var(--acc)":"var(--bdr)"}`,background:knowledgeFilter===t?"rgba(0,212,255,0.07)":"var(--surf)",color:knowledgeFilter===t?"var(--acc)":"var(--mut)"}}>{t}</button>
                    ))}
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={()=>setShowAddKnowledge(true)}>+ Add Item</button>
                </div>
                {knowledgeItems.filter(k=>knowledgeFilter==="all"||k.type===knowledgeFilter).length===0&&<div className="empty">No knowledge items yet. Save insights, PRD patterns, competitive learnings here for AI reuse.</div>}
                <div className="ga">
                  {knowledgeItems.filter((k:any)=>knowledgeFilter==="all"||k.type===knowledgeFilter).map((k:any)=>(
                    <div key={k.id} className="card" style={{padding:"14px 16px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                        <span className={`tag ${k.type==="prd"?"tag-pur":k.type==="insight"?"tag-blu":k.type==="competitive"?"tag-amb":k.type==="learning"?"tag-grn":"tag-dim"}`} style={{fontSize:9}}>{k.type}</span>
                        <button className="btn btn-danger btn-sm" onClick={async()=>{await supabase.from("knowledge_items").delete().eq("id",k.id).then(undefined,()=>{});loadKnowledge();}}>✕</button>
                      </div>
                      <div style={{fontFamily:"Syne",fontWeight:700,fontSize:13,marginBottom:6}}>{k.title}</div>
                      <div style={{fontSize:12,color:"var(--mut)",lineHeight:1.6,marginBottom:8}}>{k.content.slice(0,200)}{k.content.length>200?"...":""}</div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{(k.tags||[]).slice(0,3).map((t:string,i:number)=><span key={i} className="tag tag-dim" style={{fontSize:9}}>{t}</span>)}</div>
                        <span className="mono dim" style={{fontSize:9}}>{new Date(k.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OUTCOME TRACKING */}
            {page==="outcomes"&&(
              <div className="col">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div className="g4" style={{flex:1}}>
                    {[
                      {v:outcomes.length,l:"Tracked Features",c:"var(--acc)"},
                      {v:outcomes.filter((o:any)=>o.status==="achieved"||o.status==="exceeded").length,l:"Achieved / Exceeded",c:"var(--grn)"},
                      {v:outcomes.filter((o:any)=>o.status==="missed").length,l:"Missed",c:"var(--red)"},
                      {v:outcomes.filter((o:any)=>o.status==="tracking").length,l:"In Progress",c:"var(--amb)"},
                    ].map(({v,l,c})=>(
                      <div key={l} className="kpi"><div className="kpi-v" style={{color:c}}>{v}</div><div className="kpi-l">{l}</div></div>
                    ))}
                  </div>
                  <button className="btn btn-primary btn-sm" style={{flexShrink:0}} onClick={()=>setShowAddOutcome(true)}>+ Track Outcome</button>
                </div>
                {outcomes.length===0&&<div className="empty">No outcomes tracked yet. For every shipped feature, define what success looks like — then measure it.</div>}
                <div className="card">
                  {outcomes.length>0&&(
                    <>
                      <div className="th-row" style={{gridTemplateColumns:"1fr 120px 140px 80px 100px 90px"}}>
                        <span>Feature</span><span>Project</span><span>Target Metric</span><span>Target</span><span>Actual</span><span>Status</span>
                      </div>
                      {outcomes.map((o:any)=>(
                        <div key={o.id} className="tr" style={{gridTemplateColumns:"1fr 120px 140px 80px 100px 90px"}}>
                          <div>
                            <div style={{fontWeight:500,fontSize:12}}>{o.feature_name}</div>
                            {o.hypothesis&&<div style={{fontSize:10,color:"var(--mut)",marginTop:1}}>{o.hypothesis.slice(0,60)}{o.hypothesis.length>60?"...":""}</div>}
                          </div>
                          <span style={{fontSize:11,color:"var(--mut)"}}>{o.projects?.name||"—"}</span>
                          <span style={{fontSize:11}}>{o.target_metric||"—"}</span>
                          <span className="mono dim" style={{fontSize:11}}>{o.target_value||"—"}</span>
                          <span className="mono" style={{fontSize:11,color:o.actual_value>=o.target_value?"var(--grn)":o.actual_value>0?"var(--amb)":"var(--mut)"}}>{o.actual_value||"—"}</span>
                          <span className={`tag ${o.status==="achieved"||o.status==="exceeded"?"tag-grn":o.status==="missed"?"tag-red":o.status==="tracking"?"tag-amb":"tag-dim"}`} style={{fontSize:9}}>{o.status}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Risk Predictions */}
                {riskPredictions.length>0&&(
                  <div className="card">
                    <div className="ch"><div className="ct">⚠️ Early Risk Predictions</div><span className="tag tag-red" style={{fontSize:9}}>{riskPredictions.length} active</span></div>
                    {riskPredictions.map((r:any)=>(
                      <div key={r.id} style={{padding:"12px 16px",borderBottom:"1px solid var(--bdr)",display:"flex",gap:12,alignItems:"flex-start"}}>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:4}}>
                            <span className={`tag ${r.confidence>70?"tag-red":r.confidence>40?"tag-amb":"tag-dim"}`} style={{fontSize:9}}>{r.risk_type.replace("_"," ")}</span>
                            <span style={{fontFamily:"DM Mono",fontSize:9,color:"var(--mut)"}}>{r.confidence}% confidence</span>
                          </div>
                          <div style={{fontSize:12,marginBottom:3}}>{r.prediction}</div>
                          {r.recommended_action&&<div style={{fontSize:11,color:"var(--acc)"}}>→ {r.recommended_action}</div>}
                        </div>
                        <button className="btn btn-sm" onClick={async()=>{await supabase.from("risk_predictions").update({status:"dismissed"}).eq("id",r.id).then(undefined,()=>{});loadRiskPreds();}}>Dismiss</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Feedback loop stats */}
                {feedbackEvents.length>0&&(
                  <div className="card">
                    <div className="ch"><div className="ct">🔁 Feedback Loop · Agent Learning Signals</div></div>
                    <div className="cb">
                      <div className="g4" style={{gap:8,marginBottom:12}}>
                        {Object.entries(feedbackEvents.reduce((acc:any,e:any)=>{acc[e.event_type]=(acc[e.event_type]||0)+1;return acc;},{})).map(([type,count])=>(
                          <div key={type} style={{background:"var(--surf2)",border:"1px solid var(--bdr)",borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
                            <div style={{fontFamily:"Syne",fontWeight:800,fontSize:18,color:"var(--acc)"}}>{count as number}</div>
                            <div style={{fontFamily:"DM Mono",fontSize:10,color:"var(--mut)"}}>{type}s</div>
                          </div>
                        ))}
                      </div>
                      {feedbackEvents.slice(0,5).map((e:any)=>(
                        <div key={e.id} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:"1px solid var(--bdr)",fontSize:12,alignItems:"flex-start"}}>
                          <span className="tag tag-pur" style={{fontSize:9,flexShrink:0}}>{e.agent_name}</span>
                          <span className="tag tag-dim" style={{fontSize:9,flexShrink:0}}>{e.event_type}</span>
                          {e.field&&<span style={{color:"var(--mut)",fontSize:11}}>{e.field}</span>}
                          <span className="mono dim" style={{fontSize:10,marginLeft:"auto",flexShrink:0}}>{new Date(e.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUPER AGENT */}
            {page==="super"&&(
              <div className="col">

                {/* Hero */}
                <div className="sa-hero">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                    <div>
                      <div className="sa-hero-title">🔮 PM Orchestrator Super Agent</div>
                      <div className="sa-hero-sub">Multi-agent reasoning engine. Fetches real data from Jira, meetings, OKRs and RICE scores. Runs a self-evaluation loop. Returns structured PRD + Risks + Prioritization + Exec Summary.</div>
                    </div>
                    {superResult&&<span className={confClass(superResult.confidence_score||"Low")}>Confidence: {superResult.confidence_score}</span>}
                  </div>
                  <div className="sa-pipeline">
                    {[{l:"Jira Agent",c:"rgba(124,58,237,0.15)",bc:"var(--pur)"},{l:"Meeting Intel",c:"rgba(0,212,255,0.1)",bc:"var(--acc)"},{l:"OKR Agent",c:"rgba(16,185,129,0.1)",bc:"var(--grn)"},{l:"RICE Scores",c:"rgba(245,158,11,0.1)",bc:"var(--amb)"},{l:"Decision Engine",c:"rgba(239,68,68,0.1)",bc:"var(--red)"},{l:"Self-Eval Loop",c:"rgba(124,58,237,0.15)",bc:"var(--pur)"},{l:"Structured Output",c:"rgba(0,212,255,0.1)",bc:"var(--acc)"}].map((s,i,a)=>(
                      <span key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                        <span className="sa-step" style={{background:s.c,borderColor:s.bc,color:"var(--txt)"}}>{s.l}</span>
                        {i<a.length-1&&<span className="sa-arrow">→</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="card">
                  <div className="ch"><div className="ct">Your Request (optional)</div></div>
                  <div className="cb">
                    <div className="col" style={{gap:10}}>
                      <textarea className="input" value={superRequest} onChange={e=>setSuperRequest(e.target.value)} placeholder={"Leave blank for a full portfolio brief, or ask something specific:\n\n• What are the biggest risks this sprint?\n• Prioritize my backlog for Q2 against OKRs\n• Generate a PRD for the top-scored initiative\n• What decisions need exec attention this week?"} style={{minHeight:100,resize:"vertical" as any}}/>
                      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                        <div className="form-row" style={{flex:"none"}}>
                          <label className="form-label" style={{marginBottom:4}}>Focus Area</label>
                          <select className="input select" style={{width:200}} value={superFocus} onChange={e=>setSuperFocus(e.target.value)}>
                            <option value="all">Full Portfolio</option>
                            <option value="delivery">Delivery & Risks</option>
                            <option value="prioritization">Backlog Prioritization</option>
                            <option value="stakeholders">Stakeholder Updates</option>
                            <option value="okrs">OKR Progress</option>
                            {projects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}
                          </select>
                        </div>
                        <div style={{flex:1}}/>
                        <div style={{fontSize:11,color:"var(--mut)",fontFamily:"DM Mono"}}>
                          Context: {projects.length} projects · {jiraIssues.length} Jira issues · {meetings.length} meetings · {riceScores.length} RICE scores
                        </div>
                      </div>
                      <button className="sa-run-btn" onClick={runSuperAgent} disabled={superRunning}>
                        {superRunning?<><span className="spin" style={{width:18,height:18,borderWidth:2,borderTopColor:"#000",borderColor:"rgba(0,0,0,0.2)"}}/>Running…</>:"🔮 Run Super Agent"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Thinking steps */}
                {superRunning&&(
                  <div className="sa-thinking">
                    <div style={{fontFamily:"Syne",fontWeight:700,fontSize:13,marginBottom:4}}>Orchestrating agents…</div>
                    {THINK_STEPS.map((step,i)=>(
                      <div key={i} className="sa-think-step">
                        <div className={`sa-think-dot ${i<thinkStep?"sa-think-done":i===thinkStep?"sa-think-active":"sa-think-wait"}`}/>
                        <span style={{color:i<thinkStep?"var(--grn)":i===thinkStep?"var(--acc)":"var(--mut)"}}>{step}</span>
                        {i<thinkStep&&<span style={{marginLeft:"auto",fontFamily:"DM Mono",fontSize:9,color:"var(--grn)"}}>✓</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Error */}
                {superError&&!superRunning&&(
                  <div className="infobox ib-red" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>⚠️ {superError}</span>
                    <button className="btn btn-sm" onClick={()=>setSuperError(null)}>✕</button>
                  </div>
                )}

                {/* Results */}
                {superResult&&!superRunning&&(
                  <div className="col">

                    {/* Model Routing Decision */}
                    {/* Portfolio health badge */}
                    {superResult.portfolio_health&&(
                      <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:superResult.portfolio_health==="green"?"rgba(16,185,129,0.06)":superResult.portfolio_health==="yellow"?"rgba(245,158,11,0.06)":"rgba(239,68,68,0.06)",border:`1px solid ${superResult.portfolio_health==="green"?"rgba(16,185,129,0.2)":superResult.portfolio_health==="yellow"?"rgba(245,158,11,0.2)":"rgba(239,68,68,0.2)"}`,borderRadius:10,marginBottom:-8}}>
                        <span style={{fontFamily:"Syne",fontWeight:800,fontSize:18,color:superResult.portfolio_health==="green"?"var(--grn)":superResult.portfolio_health==="yellow"?"var(--amb)":"var(--red)"}}>
                          {superResult.portfolio_health==="green"?"🟢":superResult.portfolio_health==="yellow"?"🟡":"🔴"} Portfolio: {superResult.portfolio_health.toUpperCase()}
                        </span>
                        {superResult.confidence_score&&<span className={confClass(superResult.confidence_score)}>Confidence: {superResult.confidence_score}</span>}
                        {superResult.actions_taken?.length>0&&<span className="tag tag-grn" style={{fontSize:9,marginLeft:"auto"}}>{superResult.actions_taken.filter((a:any)=>a.status==="success").length} actions taken</span>}
                      </div>
                    )}

                    {(superResult.task_classification||superResult.model_decision)&&(
                      <div style={{background:"var(--surf2)",border:"1px solid var(--bdr)",borderRadius:10,padding:"12px 16px",display:"flex",gap:20,flexWrap:"wrap",alignItems:"flex-start"}}>
                        {superResult.task_classification&&(
                          <div>
                            <div className="section-lbl" style={{marginBottom:5}}>Task Classification</div>
                            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                              <span className="tag tag-pur" style={{fontSize:9}}>{superResult.task_classification.type}</span>
                              <span className={`tag ${superResult.task_classification.complexity==="high"?"tag-red":superResult.task_classification.complexity==="low"?"tag-grn":"tag-amb"}`} style={{fontSize:9}}>{superResult.task_classification.complexity} complexity</span>
                              <span className="tag tag-dim" style={{fontSize:9}}>{superResult.task_classification.context_size} context</span>
                            </div>
                          </div>
                        )}
                        {superResult.optimizer_recommendation?.recommended_model&&(
                          <div>
                            <div className="section-lbl" style={{marginBottom:5}}>Optimizer Rec</div>
                            <div style={{display:"flex",gap:6,alignItems:"center"}}>
                              <span className="tag tag-blu" style={{fontSize:9}}>{superResult.optimizer_recommendation.recommended_model?.split("-").slice(-2).join("-")}</span>
                              <span className={`tag ${superResult.optimizer_recommendation.confidence==="high"?"tag-grn":superResult.optimizer_recommendation.confidence==="low"?"tag-red":"tag-amb"}`} style={{fontSize:9}}>{superResult.optimizer_recommendation.confidence} confidence</span>
                            </div>
                          </div>
                        )}
                        {superResult.model_decision&&(
                          <div>
                            <div className="section-lbl" style={{marginBottom:5}}>Model Selected</div>
                            <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                              <span className="tag tag-grn" style={{fontSize:9}}>{superResult.model_decision.selected_model?.split("-").slice(-2).join("-")}</span>
                              <span className="tag tag-dim" style={{fontSize:9}}>{superResult.model_decision.selection_source}</span>
                            </div>
                            {superResult.model_decision.reason&&<div style={{fontSize:10,color:"var(--mut)",marginTop:4,maxWidth:240}}>{superResult.model_decision.reason}</div>}
                          </div>
                        )}
                        {superResult.post_optimization&&(
                          <div>
                            <div className="section-lbl" style={{marginBottom:5}}>Post-Opt</div>
                            <div style={{display:"flex",gap:6,alignItems:"center"}}>
                              <span className={`tag ${superResult.post_optimization.model_was_optimal?"tag-grn":"tag-amb"}`} style={{fontSize:9}}>{(superResult.token_optimization?.model_was_optimal??superResult.post_optimization?.model_was_optimal)?"✓ Optimal":"⚠ Suboptimal"}</span>
                              {(superResult.token_optimization?.estimated_savings_percent>0||superResult.post_optimization?.estimated_cost_savings)&&(
                                <span className="tag tag-grn" style={{fontSize:9}}>Save {superResult.post_optimization.estimated_cost_savings}</span>
                              )}
                            </div>
                            {superResult.post_optimization.suggested_change&&superResult.post_optimization.suggested_change!=="none"&&(
                              <div style={{fontSize:10,color:"var(--acc)",marginTop:4}}>{superResult.post_optimization.suggested_change}</div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Exec Summary */}
                    <div className="sa-out-sec">
                      <div className="sa-out-hd" onClick={()=>toggleSuperSec("exec")}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:16}}>📋</span><span style={{fontFamily:"Syne",fontWeight:700,fontSize:14}}>Executive Summary</span></div>
                        <span style={{fontSize:13,color:"var(--mut)"}}>{superExpanded.exec?"▾":"▸"}</span>
                      </div>
                      {superExpanded.exec&&(
                        <div className="sa-out-body">
                          <p style={{fontSize:13,lineHeight:1.8,color:"var(--txt)"}}>{superResult.exec_summary}</p>
                          <div style={{display:"flex",gap:6,marginTop:12,flexWrap:"wrap"}}>
                            <button className="btn btn-sm" onClick={()=>navigator.clipboard.writeText(superResult.exec_summary||"").then(()=>alert("Copied!"))}>Copy Summary</button>
                            <button className="btn btn-sm" onClick={()=>{runSHUpdate("Leadership","CPO");}}>Send Stakeholder Update</button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* What Changed + Decisions Needed */}
                    {(superResult.whats_changed?.length>0||superResult.decisions_needed?.length>0)&&(
                      <div className="g2">
                        {superResult.whats_changed?.length>0&&(
                          <div className="sa-out-sec">
                            <div className="sa-out-hd" onClick={()=>toggleSuperSec("changed")}>
                              <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:14}}>🔄</span><span style={{fontFamily:"Syne",fontWeight:700,fontSize:13}}>What Changed</span><span className="tag tag-blu" style={{fontSize:9}}>{superResult.whats_changed.length}</span></div>
                              <span style={{fontSize:13,color:"var(--mut)"}}>{superExpanded.changed?"▾":"▸"}</span>
                            </div>
                            {(superExpanded.changed!==false)&&<div className="sa-out-body">{superResult.whats_changed.map((c:string,i:number)=><div key={i} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:"1px solid var(--bdr)",fontSize:12}}><span style={{color:"var(--acc)",flexShrink:0}}>→</span>{c}</div>)}</div>}
                          </div>
                        )}
                        {superResult.decisions_needed?.length>0&&(
                          <div className="sa-out-sec">
                            <div className="sa-out-hd" onClick={()=>toggleSuperSec("decisions_needed")}>
                              <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:14}}>⚡</span><span style={{fontFamily:"Syne",fontWeight:700,fontSize:13}}>Decisions Needed</span><span className="tag tag-red" style={{fontSize:9}}>{superResult.decisions_needed.length}</span></div>
                              <span style={{fontSize:13,color:"var(--mut)"}}>{superExpanded.decisions_needed?"▾":"▸"}</span>
                            </div>
                            {(superExpanded.decisions_needed!==false)&&<div className="sa-out-body">{superResult.decisions_needed.map((d:string,i:number)=><div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid var(--bdr)",fontSize:12,alignItems:"flex-start"}}><div style={{width:20,height:20,borderRadius:"50%",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"DM Mono",fontSize:10,color:"var(--red)",flexShrink:0}}>{i+1}</div>{d}</div>)}</div>}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions Taken */}
                    {superResult.actions_taken?.length>0&&(
                      <div className="sa-out-sec">
                        <div className="sa-out-hd" onClick={()=>toggleSuperSec("actions_taken")}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:14}}>⚡</span><span style={{fontFamily:"Syne",fontWeight:700,fontSize:13}}>Actions Taken Autonomously</span><span className="tag tag-grn" style={{fontSize:9}}>{superResult.actions_taken.filter((a:any)=>a.status==="success").length} completed</span></div>
                          <span style={{fontSize:13,color:"var(--mut)"}}>{superExpanded.actions_taken?"▾":"▸"}</span>
                        </div>
                        {(superExpanded.actions_taken!==false)&&<div className="sa-out-body">{superResult.actions_taken.map((a:any,i:number)=><div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:"1px solid var(--bdr)",alignItems:"flex-start"}}><span className={`tag ${a.status==="success"?"tag-grn":a.status==="pending"?"tag-amb":"tag-dim"}`} style={{fontSize:9,flexShrink:0}}>{a.status}</span><div><div style={{fontSize:12,fontWeight:500,marginBottom:1}}>{a.action}</div><div style={{fontSize:11,color:"var(--mut)"}}>{a.rationale}</div>{a.tool_used&&<span style={{fontFamily:"DM Mono",fontSize:9,color:"var(--pur)"}}>{a.tool_used}</span>}</div></div>)}</div>}
                      </div>
                    )}

                    {/* Prioritization */}
                    <div className="sa-out-sec">
                      <div className="sa-out-hd" onClick={()=>toggleSuperSec("prio")}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:16}}>◈</span><span style={{fontFamily:"Syne",fontWeight:700,fontSize:14}}>Prioritization</span><span className="tag tag-blu" style={{fontSize:9}}>{superResult.prioritization?.length||0} items</span></div>
                        <span style={{fontSize:13,color:"var(--mut)"}}>{superExpanded.prio?"▾":"▸"}</span>
                      </div>
                      {superExpanded.prio&&superResult.prioritization?.length>0&&(
                        <div className="sa-out-body">
                          {superResult.prioritization.map((item:any,i:number)=>(
                            <div key={i} className="sa-rank-card">
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                                  <div style={{width:24,height:24,borderRadius:"50%",background:"rgba(0,212,255,0.12)",border:"1px solid rgba(0,212,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"DM Mono",fontWeight:700,fontSize:11,color:"var(--acc)",flexShrink:0}}>#{item.priority_rank}</div>
                                  <span style={{fontFamily:"Syne",fontWeight:700,fontSize:13}}>{item.feature}</span>
                                </div>
                                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                                  {item.scores_used?.rice&&<span className="tag tag-blu" style={{fontSize:9}}>RICE {item.scores_used.rice}</span>}
                                  {item.scores_used?.risk&&<span className={`tag ${item.scores_used.risk==="high"?"tag-red":item.scores_used.risk==="low"?"tag-grn":"tag-amb"}`} style={{fontSize:9}}>Risk {item.scores_used.risk}</span>}
                                  {item.scores_used?.impact&&<span className="tag tag-pur" style={{fontSize:9}}>Impact {item.scores_used.impact}</span>}
                                </div>
                              </div>
                              <div style={{fontSize:12,color:"var(--mut)",lineHeight:1.6}}>{item.justification}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* PRD */}
                    <div className="sa-out-sec">
                      <div className="sa-out-hd" onClick={()=>toggleSuperSec("prd")}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:16}}>📄</span><span style={{fontFamily:"Syne",fontWeight:700,fontSize:14}}>Product Requirements</span></div>
                        <div style={{display:"flex",gap:6}}><button className="btn btn-sm" onClick={e=>{e.stopPropagation();const prd=superResult.prd;if(prd)navigator.clipboard.writeText(`# PRD\n\n## Problem\n${prd.problem}\n\n## Goals\n${prd.goals}\n\n## Users\n${prd.users}\n\n## Requirements\n${(prd.requirements||[]).map((r:string)=>`- ${r}`).join("\n")}\n\n## Metrics\n${(prd.metrics||[]).map((m:string)=>`- ${m}`).join("\n")}\n\n## Constraints\n${(prd.constraints||[]).map((c:string)=>`- ${c}`).join("\n")}\n\n## Open Questions\n${(prd.open_questions||[]).map((q:string)=>`- ${q}`).join("\n")}`).then(()=>alert("Copied!"));}}>Copy MD</button><span style={{fontSize:13,color:"var(--mut)",lineHeight:"24px"}}>{superExpanded.prd?"▾":"▸"}</span></div>
                      </div>
                      {superExpanded.prd&&superResult.prd&&(
                        <div className="sa-out-body">
                          <div className="g2" style={{gap:14}}>
                            {[{k:"problem",l:"Problem Statement"},{k:"goals",l:"Goals"},{k:"users",l:"User Segments"}].map(({k,l})=>(
                              <div key={k} className="sa-field">
                                <div className="sa-lbl">{l}</div>
                                <div className="sa-val">{(superResult.prd as any)[k]||<span style={{color:"var(--mut)"}}>—</span>}</div>
                              </div>
                            ))}
                          </div>
                          <div className="g2" style={{gap:14,marginTop:12}}>
                            {[{k:"requirements",l:"Requirements"},{k:"metrics",l:"Success Metrics"},{k:"constraints",l:"Constraints"},{k:"open_questions",l:"Open Questions"}].map(({k,l})=>{
                              const items=(superResult.prd as any)[k]||[];
                              return(
                                <div key={k} className="sa-field">
                                  <div className="sa-lbl">{l}</div>
                                  {Array.isArray(items)?<div className="sa-list">{items.map((it:string,j:number)=><div key={j} style={{display:"flex",gap:8,fontSize:12,padding:"3px 0",borderBottom:"1px solid var(--bdr)",color:"var(--txt)"}}><span style={{color:k==="open_questions"?"var(--amb)":k==="constraints"?"var(--red)":"var(--grn)",flexShrink:0}}>{k==="open_questions"?"?":k==="constraints"?"⚠":"✓"}</span>{it}</div>)}</div>:<div className="sa-val">{items}</div>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Risks */}
                    <div className="sa-out-sec">
                      <div className="sa-out-hd" onClick={()=>toggleSuperSec("risks")}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:16}}>🔔</span><span style={{fontFamily:"Syne",fontWeight:700,fontSize:14}}>Risks</span><span className="tag tag-red" style={{fontSize:9}}>{superResult.risks?.filter((r:any)=>r.severity==="Critical"||r.severity==="High").length||0} critical/high</span></div>
                        <span style={{fontSize:13,color:"var(--mut)"}}>{superExpanded.risks?"▾":"▸"}</span>
                      </div>
                      {superExpanded.risks&&superResult.risks?.length>0&&(
                        <div className="sa-out-body">
                          {[...superResult.risks].sort((a:any,b:any)=>{const ord:any={Critical:0,High:1,Medium:2,Low:3};return(ord[a.severity]??4)-(ord[b.severity]??4);}).map((risk:any,i:number)=>(
                            <div key={i} className={`sa-risk-card ${saRiskClass(risk.severity)}`}>
                              <div style={{flexShrink:0,marginTop:2}}>
                                <span style={{fontFamily:"DM Mono",fontSize:9,color:saRiskColor(risk.severity),background:`${saRiskColor(risk.severity)}15`,border:`1px solid ${saRiskColor(risk.severity)}30`,padding:"2px 7px",borderRadius:100}}>{risk.severity}</span>
                              </div>
                              <div style={{flex:1}}>
                                <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                                  <span style={{fontFamily:"Syne",fontWeight:700,fontSize:12}}>{risk.description}</span>
                                  <span className="tag tag-dim" style={{fontSize:9}}>{risk.type}</span>
                                </div>
                                <div style={{fontSize:11,color:"var(--acc)"}}>→ {risk.mitigation}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Data Sources */}
                    <div className="sa-out-sec">
                      <div className="sa-out-hd" onClick={()=>toggleSuperSec("sources")}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:14}}>⚡</span><span style={{fontFamily:"Syne",fontWeight:700,fontSize:13}}>Data Sources</span><span className="tag tag-grn" style={{fontSize:9}}>{superResult.data_sources?.length||0} agents</span>{superResult.data_gaps?.length>0&&<span className="tag tag-amb" style={{fontSize:9}}>{superResult.data_gaps.length} gaps</span>}</div>
                        <span style={{fontSize:13,color:"var(--mut)"}}>{superExpanded.sources?"▾":"▸"}</span>
                      </div>
                      {superExpanded.sources&&(
                        <div className="sa-out-body">
                          {superResult.data_sources?.map((ds:any,i:number)=>(
                            <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:"1px solid var(--bdr)",fontSize:12}}>
                              <span className="tag tag-pur" style={{fontSize:9,flexShrink:0,alignSelf:"flex-start",marginTop:2}}>{ds.agent}</span>
                              <span style={{color:"var(--mut)"}}>{ds.summary}</span>
                            </div>
                          ))}
                          {superResult.data_gaps?.length>0&&(
                            <div style={{marginTop:12}}>
                              <div className="section-lbl" style={{marginBottom:6}}>Data Gaps</div>
                              {superResult.data_gaps.map((gap:string,i:number)=>(
                                <div key={i} style={{display:"flex",gap:7,fontSize:11,padding:"4px 0",color:"var(--amb)"}}><span>⚠</span>{gap}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Self Evaluation */}
                    {superResult.self_evaluation&&(
                      <div className="sa-out-sec">
                        <div className="sa-out-hd" onClick={()=>toggleSuperSec("eval")}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:14}}>🔍</span><span style={{fontFamily:"Syne",fontWeight:700,fontSize:13}}>Self-Evaluation</span><span className={superResult.self_evaluation.hallucination_check==="passed"?"tag tag-grn":"tag tag-red"} style={{fontSize:9}}>Hallucination: {superResult.self_evaluation.hallucination_check}</span></div>
                          <span style={{fontSize:13,color:"var(--mut)"}}>{superExpanded.eval?"▾":"▸"}</span>
                        </div>
                        {superExpanded.eval&&(
                          <div className="sa-out-body">
                            {[["Data grounding",superResult.self_evaluation.data_grounding],["Hallucination check",superResult.self_evaluation.hallucination_check],["Improvements made",superResult.self_evaluation.improvements_made]].map(([l,v])=>(
                              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid var(--bdr)",fontSize:12}}>
                                <span className="dim">{l}</span>
                                <span style={{color:"var(--acc)",fontFamily:"DM Mono",fontSize:11,maxWidth:300,textAlign:"right"}}>{v}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}

                {/* Empty state */}
                {!superResult&&!superRunning&&!superError&&(
                  <div className="card" style={{padding:32,textAlign:"center",opacity:0.5}}>
                    <div style={{fontSize:48,marginBottom:12}}>🔮</div>
                    <div style={{fontFamily:"Syne",fontWeight:700,fontSize:16,marginBottom:6}}>Structured output appears here</div>
                    <div style={{fontSize:12,color:"var(--mut)",maxWidth:380,margin:"0 auto"}}>Enter a request above or leave blank for a full portfolio brief. The agent will fetch real data from all sources and return PRD + Risks + Prioritization + Exec Summary.</div>
                  </div>
                )}

              </div>
            )}


            {/* TOKEN ANALYTICS */}
            {page==="tokens"&&(
              <div className="col">
                {tokenLoading&&<div className="loading"><div className="spin"/>Loading token data...</div>}

                {/* KPI strip */}
                {/* Budget alert */}
                {budgetStatus&&budgetStatus.budget_status!=="ok"&&(
                  <div className={`infobox ${budgetStatus.budget_status==="critical"?"ib-red":"ib-amb"}`} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>{budgetStatus.budget_status==="critical"?"🚨 Daily budget exceeded":"⚠️ Approaching daily budget"} · Today: ${parseFloat(budgetStatus.today_cost||0).toFixed(4)} · Week: ${parseFloat(budgetStatus.week_cost||0).toFixed(4)} · Month: ${parseFloat(budgetStatus.month_cost||0).toFixed(4)}</span>
                  </div>
                )}
                {costAnomalies.length>0&&(
                  <div className="infobox ib-amb" style={{fontSize:11}}>
                    🔍 <strong style={{color:"var(--amb)"}}>Cost anomaly detected:</strong> {costAnomalies[0].multiplier}x above 7-day average on {costAnomalies[0].date} (${parseFloat(costAnomalies[0].day_cost).toFixed(4)} vs avg ${costAnomalies[0].rolling_avg_7d})
                  </div>
                )}
                {!tokenLoading&&(()=>{
                  const totalTokens=tokenUsage.reduce((s:number,r:any)=>s+(r.total_tokens||0),0);
                  const totalCost=tokenUsage.reduce((s:number,r:any)=>s+(parseFloat(r.estimated_cost)||0),0);
                  const todayCost=tokenRollup.filter((r:any)=>r.date===new Date().toISOString().split("T")[0]).reduce((s:number,r:any)=>s+(parseFloat(r.total_cost)||0),0);
                  const agentSet=new Set(tokenUsage.map((r:any)=>r.agent_name));
                  return(
                    <div className="g4">
                      {[
                        {v:totalTokens.toLocaleString(),l:"Total Tokens",c:"var(--acc)"},
                        {v:`$${totalCost.toFixed(4)}`,l:"Total Cost (USD)",c:"var(--grn)"},
                        {v:`$${todayCost.toFixed(4)}`,l:"Cost Today",c:"var(--amb)"},
                        {v:agentSet.size.toString(),l:"Agents Tracked",c:"var(--pur)"},
                      ].map(({v,l,c})=>(
                        <div key={l} className="kpi"><div className="kpi-v" style={{color:c}}>{v}</div><div className="kpi-l">{l}</div></div>
                      ))}
                    </div>
                  );
                })()}

                <div className="g2">
                  {/* Top agents */}
                  <div className="card">
                    <div className="ch"><div className="ct">Top Agents · Token Usage</div></div>
                    {tokenUsage.length===0?<div className="empty">No token data yet. Run any agent to start tracking.</div>:(()=>{
                      const byAgent=tokenUsage.reduce((acc:any,r:any)=>{
                        const k=r.agent_name;
                        if(!acc[k])acc[k]={agent:k,calls:0,tokens:0,cost:0};
                        acc[k].calls++;acc[k].tokens+=(r.total_tokens||0);acc[k].cost+=(parseFloat(r.estimated_cost)||0);
                        return acc;
                      },{});
                      const sorted=Object.values(byAgent).sort((a:any,b:any)=>b.tokens-a.tokens);
                      const max=(sorted[0] as any)?.tokens||1;
                      return(
                        <div className="cb0" style={{padding:"4px 16px"}}>
                          {sorted.map((ag:any)=>(
                            <div key={ag.agent} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:"1px solid var(--bdr)"}}>
                              <span style={{width:140,fontSize:12,flexShrink:0}}>{ag.agent}</span>
                              <div style={{flex:1,height:6,background:"var(--bdr2)",borderRadius:3,overflow:"hidden"}}>
                                <div style={{height:"100%",width:`${(ag.tokens/max)*100}%`,background:"var(--acc)",borderRadius:3}}/>
                              </div>
                              <span className="mono" style={{fontSize:10,color:"var(--acc)",width:70,textAlign:"right"}}>{ag.tokens.toLocaleString()}</span>
                              <span className="mono" style={{fontSize:10,color:"var(--grn)",width:55,textAlign:"right"}}>${ag.cost.toFixed(4)}</span>
                              <span className="mono dim" style={{fontSize:10,width:35,textAlign:"right"}}>{ag.calls}x</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Daily trend */}
                  <div className="card">
                    <div className="ch"><div className="ct">Daily Cost Trend · Last 14 Days</div></div>
                    {tokenRollup.length===0?<div className="empty">No rollup data yet.</div>:(()=>{
                      const byDate=tokenRollup.reduce((acc:any,r:any)=>{
                        const d=r.date;
                        if(!acc[d])acc[d]={date:d,cost:0,tokens:0};
                        acc[d].cost+=(parseFloat(r.total_cost)||0);acc[d].tokens+=(r.total_tokens||0);
                        return acc;
                      },{});
                      const days=Object.values(byDate).sort((a:any,b:any)=>a.date.localeCompare(b.date)).slice(-14);
                      const maxCost=Math.max(...days.map((d:any)=>d.cost),0.001);
                      return(
                        <div className="cb0" style={{padding:"4px 16px"}}>
                          {days.map((d:any)=>(
                            <div key={d.date} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:"1px solid var(--bdr)"}}>
                              <span className="mono dim" style={{fontSize:10,width:80,flexShrink:0}}>{new Date(d.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
                              <div style={{flex:1,height:6,background:"var(--bdr2)",borderRadius:3,overflow:"hidden"}}>
                                <div style={{height:"100%",width:`${(d.cost/maxCost)*100}%`,background:"var(--grn)",borderRadius:3}}/>
                              </div>
                              <span className="mono" style={{fontSize:10,color:"var(--grn)",width:60,textAlign:"right"}}>${d.cost.toFixed(4)}</span>
                              <span className="mono dim" style={{fontSize:10,width:65,textAlign:"right"}}>{d.tokens.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Model breakdown */}
                <div className="card">
                  <div className="ch"><div className="ct">Model Breakdown</div></div>
                  {tokenUsage.length===0?<div className="empty">No data yet.</div>:(()=>{
                    const byModel=tokenUsage.reduce((acc:any,r:any)=>{
                      const k=r.model||"unknown";
                      if(!acc[k])acc[k]={model:k,calls:0,input:0,output:0,cost:0};
                      acc[k].calls++;acc[k].input+=(r.input_tokens||0);acc[k].output+=(r.output_tokens||0);acc[k].cost+=(parseFloat(r.estimated_cost)||0);
                      return acc;
                    },{});
                    const rows=Object.values(byModel).sort((a:any,b:any)=>b.cost-a.cost);
                    return(
                      <>
                        <div className="th-row" style={{gridTemplateColumns:"1fr 60px 80px 80px 80px 80px"}}>
                          <span>Model</span><span>Calls</span><span>Input tok</span><span>Output tok</span><span>Total tok</span><span>Cost USD</span>
                        </div>
                        {rows.map((m:any)=>(
                          <div key={m.model} className="tr" style={{gridTemplateColumns:"1fr 60px 80px 80px 80px 80px"}}>
                            <span className="tag tag-pur" style={{fontSize:9,width:"fit-content"}}>{m.model}</span>
                            <span className="mono dim" style={{fontSize:11}}>{m.calls}</span>
                            <span className="mono dim" style={{fontSize:11}}>{m.input.toLocaleString()}</span>
                            <span className="mono dim" style={{fontSize:11}}>{m.output.toLocaleString()}</span>
                            <span className="mono acc" style={{fontSize:11}}>{(m.input+m.output).toLocaleString()}</span>
                            <span className="mono" style={{fontSize:11,color:"var(--grn)"}}>${m.cost.toFixed(4)}</span>
                          </div>
                        ))}
                      </>
                    );
                  })()}
                </div>

                {/* Workflow runs */}
                <div className="card">
                  <div className="ch">
                    <div className="ct">Workflow Runs · Orchestrated Calls</div>
                    <button className="btn btn-sm" onClick={loadTokens}>⟳ Refresh</button>
                  </div>
                  {tokenWorkflows.length===0?<div className="empty">No workflow runs yet. Workflow tracking activates on Super Agent runs.</div>:(
                    <>
                      <div className="th-row" style={{gridTemplateColumns:"1fr 80px 80px 80px 60px 90px"}}>
                        <span>Workflow</span><span>Agents</span><span>Tokens</span><span>Cost</span><span>Status</span><span>Started</span>
                      </div>
                      {tokenWorkflows.map((wf:any)=>(
                        <div key={wf.id} className="tr" style={{gridTemplateColumns:"1fr 80px 80px 80px 60px 90px"}}>
                          <div><div style={{fontWeight:500,fontSize:12}}>{wf.workflow_name}</div>{wf.triggered_by&&<span className="mono dim" style={{fontSize:9}}>{wf.triggered_by}</span>}</div>
                          <span className="mono dim" style={{fontSize:11}}>{wf.agent_count}</span>
                          <span className="mono acc" style={{fontSize:11}}>{(wf.total_tokens||0).toLocaleString()}</span>
                          <span className="mono" style={{fontSize:11,color:"var(--grn)"}}>${parseFloat(wf.total_cost||0).toFixed(4)}</span>
                          <span className={`tag ${wf.status==="completed"?"tag-grn":wf.status==="failed"?"tag-red":"tag-amb"}`} style={{fontSize:9}}>{wf.status}</span>
                          <span className="mono dim" style={{fontSize:10}}>{wf.started_at?new Date(wf.started_at).toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):"—"}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Raw log */}
                <div className="card">
                  <div className="ch"><div className="ct">Raw Token Log · Last 100 Calls</div></div>
                  {tokenUsage.length===0?<div className="empty">No token logs yet.</div>:(
                    <>
                      <div className="th-row" style={{gridTemplateColumns:"140px 1fr 70px 70px 80px 80px 100px"}}>
                        <span>Agent</span><span>Model</span><span>Input</span><span>Output</span><span>Total</span><span>Cost USD</span><span>When</span>
                      </div>
                      {tokenUsage.slice(0,50).map((r:any)=>(
                        <div key={r.id} className="tr" style={{gridTemplateColumns:"140px 1fr 70px 70px 80px 80px 100px"}}>
                          <span className="tag tag-pur" style={{fontSize:9}}>{r.agent_name}</span>
                          <span className="mono dim" style={{fontSize:10}}>{r.model}</span>
                          <span className="mono dim" style={{fontSize:11}}>{(r.input_tokens||0).toLocaleString()}</span>
                          <span className="mono dim" style={{fontSize:11}}>{(r.output_tokens||0).toLocaleString()}</span>
                          <span className="mono acc" style={{fontSize:11}}>{(r.total_tokens||0).toLocaleString()}</span>
                          <span className="mono" style={{fontSize:11,color:"var(--grn)"}}>${parseFloat(r.estimated_cost||0).toFixed(6)}</span>
                          <span className="mono dim" style={{fontSize:10}}>{r.created_at?new Date(r.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):"—"}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

              </div>
            )}

            {/* AGENTS */}
            {page==="agents"&&(
              <div className="col">
                {agentError&&<div className="infobox ib-red" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>⚠️ {agentError}</span><button className="btn btn-sm" onClick={()=>setAgentError(null)}>✕</button></div>}
                <div className="ga">
                  {[
                    {ic:"🎙️",col:"ic-pur",name:"Meeting Scribe",trig:"After every meeting",desc:"Extracts decisions, action items with owners and due dates, and pushes to To-Do automatically.",chips:["Transcript","Calendar","Jira"],action:()=>setPage("meetings"),lbl:"▶ Go to Meetings",run:null},
                    {ic:"🧠",col:"ic-blu",name:"Prioritization",trig:"Sprint planning",desc:"RICE-scores your backlog against Q2 OKRs. Surfaces top items with reasoning per item.",chips:["Backlog","OKRs","Capacity"],action:runPrio,lbl:`⚡ Score (${projects.length})`,run:"prioritization"},
                    {ic:"📊",col:"ic-grn",name:"Weekly Digest",trig:"Every Monday 8am",desc:"Aggregates live project data, tasks and meetings into an executive Monday briefing.",chips:["Projects","Tasks","Meetings"],action:runDigest,lbl:"⚡ Generate Digest",run:"weekly-digest"},
                    {ic:"🔔",col:"ic-amb",name:"Risk Monitor",trig:"Continuous",desc:"Scans all projects for risk signals, flags blockers, creates alert tasks automatically.",chips:["Projects","Sprints","Blockers"],action:runRisk,lbl:"⚡ Run Risk Scan",run:"risk-monitor"},
                    {ic:"📝",col:"ic-blu",name:"Stakeholder Update",trig:"Every Friday 3pm",desc:"Writes a polished status email tailored to the recipient from live project data.",chips:["Projects","Tasks","OKRs"],action:null,lbl:"⚡ Draft Update",run:"stakeholder-update"},
                    {ic:"📄",col:"ic-pur",name:"PRD Agent",trig:"On demand",desc:"Takes focus group transcripts, clusters themes, writes structured PRD with user stories.",chips:["Transcripts","Surveys","Research"],action:()=>setPage("prd"),lbl:"▶ Go to PRD Agent",run:null},
                  ].map((ag,i)=>(
                    <div key={i} className="agc">
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                        <div className={`ag-icon ${ag.col}`}>{ag.ic}</div>
                        <span className={`tag ${ag.run&&agentRunning===ag.run?"tag-amb":"tag-grn"}`} style={{fontSize:9}}>{ag.run&&agentRunning===ag.run?"● Running":"● Active"}</span>
                      </div>
                      <div className="ag-name">{ag.name}</div>
                      <div className="ag-trig">{ag.trig}</div>
                      <div className="ag-desc">{ag.desc}</div>
                      <div className="chips" style={{marginBottom:12}}>{ag.chips.map((c,j)=><span key={j} className="chip">{c}</span>)}</div>
                      {ag.name==="Stakeholder Update"&&!updateInput.show?(<button className="btn btn-primary" style={{width:"100%"}} disabled={agentRunning==="stakeholder-update"} onClick={()=>setUpdateInput(p=>({...p,show:true}))}>{agentRunning==="stakeholder-update"?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span className="spin" style={{width:13,height:13,borderWidth:1.5}}/>Drafting...</span>:"⚡ Draft Update"}</button>)
                      :ag.name==="Stakeholder Update"&&updateInput.show?(<div style={{display:"flex",flexDirection:"column",gap:6}}><input className="input input-sm" placeholder="Recipient name" value={updateInput.name} onChange={e=>setUpdateInput(p=>({...p,name:e.target.value}))}/><input className="input input-sm" placeholder="Recipient role" value={updateInput.role} onChange={e=>setUpdateInput(p=>({...p,role:e.target.value}))}/><div style={{display:"flex",gap:6}}><button className="btn btn-primary" style={{flex:1}} onClick={()=>runSHUpdate(updateInput.name,updateInput.role)}>Generate</button><button className="btn" onClick={()=>setUpdateInput({show:false,name:"",role:""})}>Cancel</button></div></div>)
                      :(<button className="btn btn-primary" style={{width:"100%"}} disabled={!!ag.run&&agentRunning===ag.run} onClick={ag.action||undefined}>{ag.run&&agentRunning===ag.run?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span className="spin" style={{width:13,height:13,borderWidth:1.5}}/>Working...</span>:ag.lbl}</button>)}
                    </div>
                  ))}
                </div>
                <div className="card">
                  <div className="ch"><div className="ct">Stack</div></div>
                  <div className="cb"><div className="g3" style={{gap:8}}>{[["LLM","Claude API (Sonnet)"],["Orchestration","Supabase Edge Functions"],["Database","Supabase Postgres"],["Auth","Supabase Auth"],["Realtime","Supabase Realtime"],["Integrations","Jira · Gmail · GCal"]].map(([l,v])=>(<div key={l} style={{background:"var(--surf2)",border:"1px solid var(--bdr)",borderRadius:8,padding:"10px 12px"}}><div className="section-lbl" style={{marginBottom:3}}>{l}</div><div className="acc" style={{fontWeight:500,fontSize:12}}>{v}</div></div>))}</div></div>
                </div>
              </div>
            )}

            {/* PRD */}
            {page==="prd"&&(
              <div className="g2">
                <div className="col">
                  <div className="card">
                    <div className="ch"><div className="ct">Input — Research / Focus Group Data</div></div>
                    <div className="cb">
                      {prdStatus!=="done"?(<>
                        <div className="upload-z" style={{marginBottom:12}} onClick={()=>document.getElementById("pf")?.click()}>
                          <div style={{fontSize:28,marginBottom:8}}>📎</div>
                          <div style={{fontFamily:"Syne",fontWeight:700,fontSize:13,marginBottom:3}}>Drop files or click to upload</div>
                          <div style={{fontSize:12,color:"var(--mut)"}}>Supports .txt .csv .docx .pdf</div>
                          <input id="pf" type="file" style={{display:"none"}} onChange={async(e:any)=>{const f=e.target.files[0];if(f){const t=await f.text();setPrdInput(t);}}}/>
                        </div>
                        <div className="section-lbl">Or paste raw text</div>
                        <textarea className="input" value={prdInput} onChange={e=>setPrdInput(e.target.value)} placeholder={"Paste focus group transcript or survey results...\n\nExample:\n\"Participant 3: Onboarding took 45 minutes...\"\n\"Survey: 18 of 32 said onboarding was #1 pain point...\""} style={{minHeight:180,resize:"vertical" as any,marginBottom:10}}/>
                        <button onClick={runPRD} disabled={!prdInput.trim()||prdStatus==="processing"} style={{width:"100%",padding:"10px 0",background:prdInput.trim()?"var(--acc)":"var(--bdr)",color:prdInput.trim()?"#000":"var(--mut)",border:"none",borderRadius:8,fontFamily:"Syne",fontWeight:700,fontSize:13,cursor:prdInput.trim()?"pointer":"default"}}>{prdStatus==="processing"?"Analysing...":"⚡ Generate PRD"}</button>
                        {prdStatus==="processing"&&<div style={{display:"flex",alignItems:"center",gap:10,marginTop:12,fontSize:12,color:"var(--mut)"}}><div className="spin"/>Clustering themes, extracting pain points, writing PRD...</div>}
                      </>):(<div><div style={{fontSize:12,color:"var(--grn)",marginBottom:10,fontFamily:"DM Mono"}}>✓ Processed {prdInput.split(' ').length} words</div><div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>{prdResult.themes.map((t:any,i:number)=><span key={i} className="tag tag-blu">{t.lbl} <span style={{opacity:0.6}}>×{t.n}</span></span>)}</div><button onClick={()=>{setPrdStatus("idle");setPrdInput("");setPrdResult(null);}} style={{fontSize:11,fontFamily:"DM Mono",padding:"4px 10px",border:"1px solid var(--bdr)",borderRadius:6,background:"transparent",color:"var(--mut)",cursor:"pointer"}}>↺ New input</button></div>)}
                    </div>
                  </div>
                </div>
                <div>
                  {!prdResult&&prdStatus!=="processing"&&<div className="card" style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10,opacity:0.4}}><div style={{fontSize:36}}>📄</div><div style={{fontFamily:"Syne",fontWeight:700,fontSize:13}}>PRD appears here</div></div>}
                  {prdStatus==="processing"&&<div className="card" style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}><div className="spin" style={{width:32,height:32,borderWidth:3}}/><div style={{fontFamily:"Syne",fontWeight:700}}>Writing PRD...</div></div>}
                  {prdResult&&(<div className="card">
                    <div className="ch"><div><div style={{fontFamily:"Syne",fontWeight:800,fontSize:14}}>Product Requirements Document</div><div className="mono dim" style={{fontSize:10}}>AI-generated · {new Date().toLocaleDateString()} · Review before sharing</div></div><span className="tag tag-grn">Draft</span></div>
                    <div className="prd-sec"><div className="prd-lbl">Problem Statement</div><p style={{fontSize:12,lineHeight:1.7}}>{prdResult.problem}</p></div>
                    <div className="prd-sec"><div className="prd-lbl">User Stories</div>{prdResult.stories.map((s:string,i:number)=><div key={i} className="story">{s}</div>)}</div>
                    <div className="prd-sec"><div className="prd-lbl">Acceptance Criteria</div>{prdResult.criteria.map((c:string,i:number)=><div key={i} style={{display:"flex",gap:7,fontSize:12,marginBottom:4,alignItems:"flex-start"}}><span style={{color:"var(--grn)",flexShrink:0}}>✓</span>{c}</div>)}</div>
                    <div className="prd-sec"><div className="prd-lbl">Success Metrics</div>{prdResult.metrics.map((m:string,i:number)=><div key={i} style={{fontSize:12,padding:"3px 0",borderBottom:i<prdResult.metrics.length-1?"1px solid var(--bdr2)":"none",display:"flex",gap:7}}><div style={{width:3,height:3,borderRadius:"50%",background:"var(--acc)",flexShrink:0,marginTop:7}}/>{m}</div>)}</div>
                    {prdResult.questions?.length>0&&<div className="prd-sec"><div className="prd-lbl">Open Questions</div>{prdResult.questions.map((q:string,i:number)=><div key={i} style={{fontSize:12,padding:"3px 0",color:"var(--amb)",display:"flex",gap:6}}><span>?</span>{q}</div>)}</div>}
                    <div style={{padding:"11px 16px",borderTop:"1px solid var(--bdr)"}}><button className="xbtn" onClick={()=>{const md=`# PRD\n\n## Problem\n${prdResult.problem}\n\n## User Stories\n${prdResult.stories.map((s:string)=>`- ${s}`).join("\n")}\n\n## Acceptance Criteria\n${prdResult.criteria.map((c:string)=>`- [ ] ${c}`).join("\n")}\n\n## Success Metrics\n${prdResult.metrics.map((m:string)=>`- ${m}`).join("\n")}`;navigator.clipboard.writeText(md).then(()=>alert("Copied!"));}}>Copy as Markdown</button></div>
                  </div>)}
                </div>
              </div>
            )}

            {/* STAKEHOLDERS */}
            {page==="stakeholders"&&(
              <div className="col">
                <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                  {shProjects.map(p=><button key={p as string} onClick={()=>setShFilter(p as string)} style={{fontFamily:"DM Mono",fontSize:10,padding:"4px 12px",borderRadius:100,cursor:"pointer",border:`1px solid ${shFilter===p?"var(--acc)":"var(--bdr)"}`,background:shFilter===p?"rgba(0,212,255,0.07)":"var(--surf)",color:shFilter===p?"var(--acc)":"var(--mut)"}}>{p}</button>)}
                  <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                    <span style={{fontFamily:"DM Mono",fontSize:10,padding:"4px 10px",borderRadius:100,background:"var(--surf)",border:"1px solid var(--bdr)",color:"var(--red)"}}>{filteredSh.filter((s:any)=>contactAge(s.last_contacted_at)==="stale").length} overdue</span>
                    <button className="btn btn-primary btn-sm" onClick={openAddSh}>+ Add</button>
                  </div>
                </div>
                <div className="card">
                  {shLoading&&<div className="loading"><div className="spin"/>Loading...</div>}
                  {!shLoading&&filteredSh.length===0&&<div className="empty">No stakeholders found.</div>}
                  {filteredSh.map((s:any)=>{
                    const age=contactAge(s.last_contacted_at);
                    return(
                      <div key={s.id} className="sh-row" style={{display:"grid",gridTemplateColumns:"180px 120px 160px 1fr 80px 85px 100px",gap:12,alignItems:"center"}}>
                        <div style={{display:"flex",alignItems:"center",gap:9}}><div className="sh-av" style={{background:`${s.color||"#00d4ff"}18`,border:`1px solid ${s.color||"#00d4ff"}30`,color:s.color||"#00d4ff"}}>{s.initials||initials(s.name)}</div><div><div style={{fontSize:13,fontWeight:500}}>{s.name}</div><div style={{fontSize:11,color:"var(--mut)"}}>{s.role}</div></div></div>
                        <span style={{fontSize:11,color:"var(--mut)"}}>{s.type}</span>
                        <a href={`mailto:${s.email}`} style={{fontFamily:"DM Mono",fontSize:11,color:"var(--acc)",textDecoration:"none"}}>{s.email}</a>
                        <div style={{display:"flex",flexWrap:"wrap",gap:3}}>{(s.proj||[]).map((p:string,j:number)=><span key={j} style={{fontSize:10,padding:"1px 6px",borderRadius:4,background:"var(--surf2)",border:"1px solid var(--bdr)",color:"var(--mut)"}}>{p}</span>)}</div>
                        <div style={{display:"flex",gap:3}}>{Array.from({length:5},(_,j)=><div key={j} style={{width:8,height:8,borderRadius:2,background:j<(s.influence||0)?"var(--pur)":"var(--bdr2)"}}/>)}</div>
                        <span className={`tag ${AGE_TAG[age]}`} style={{fontSize:9}}>{contactLabel(s.last_contacted_at)}</span>
                        <div style={{display:"flex",gap:4}}><button className="btn btn-sm" onClick={()=>markContacted(s.id)}>✓</button><button className="btn btn-icon btn-sm" onClick={()=>openEditSh(s)}>✎</button><button className="btn btn-icon btn-danger btn-sm" onClick={()=>deleteSh(s.id)}>✕</button></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* METRICS */}
            {page==="metrics"&&(
              <div className="col">
                <div className="g4">{[{v:"23",l:"DAU",d:"+4 vs last week",up:true},{v:"61%",l:"WAU Retention",d:"+8pp",up:true},{v:"3.2h",l:"Time saved/user/wk",d:"+0.4h",up:true},{v:`${agentRuns.length}`,l:"Agent Runs (live)",d:"from DB",up:true}].map(({v,l,d,up})=>(<div key={l} className="kpi"><div className="kpi-v" style={{color:"var(--acc)"}}>{v}</div><div className="kpi-l">{l}</div><div className={`kpi-d ${up?"d-up":"d-dn"}`}>{up?"▲":"▼"} {d}</div></div>))}</div>
                <div className="g2">
                  <div className="card">
                    <div className="ch"><div className="ct">Adoption Funnel</div></div>
                    <div className="cb0">{[{l:"Invited",n:40,pct:100,c:"var(--acc)"},{l:"Activated",n:31,pct:78,c:"var(--acc)"},{l:"Used agent",n:23,pct:74,c:"var(--grn)"},{l:"3+ agents",n:14,pct:61,c:"var(--grn)"},{l:"Retained D7",n:9,pct:64,c:"var(--amb)"}].map(({l,n,pct,c},i,a)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 16px",borderBottom:i<a.length-1?"1px solid var(--bdr)":"none"}}><span style={{fontSize:12,width:90,flexShrink:0}}>{l}</span><div style={{flex:1,height:7,background:"var(--bdr2)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:c,borderRadius:4}}/></div><span className="mono dim" style={{fontSize:11,width:46,textAlign:"right"}}>{n}</span></div>))}</div>
                  </div>
                  <div className="card">
                    <div className="ch"><div className="ct">Agent Usage</div></div>
                    <div className="cb0" style={{padding:"4px 16px"}}>{(agentRuns.length>0?Object.entries(agentRuns.reduce((acc:any,run:any)=>{acc[run.agent_name]=(acc[run.agent_name]||0)+1;return acc;},{})).sort((a:any,b:any)=>b[1]-a[1]).map(([name,count]:any)=>({n:name,r:count,max:Math.max(...Object.values(agentRuns.reduce((acc:any,run:any)=>{acc[run.agent_name]=(acc[run.agent_name]||0)+1;return acc;},{}) as any) as number[])})):[{n:"Meeting Scribe",r:47,max:47},{n:"Weekly Digest",r:23,max:47},{n:"Prioritization",r:14,max:47},{n:"PRD Agent",r:8,max:47}]).map(({n,r,max}:any)=>(<div key={n} className="use-row"><div className="use-name">{n}</div><div className="use-bw"><div className="use-bar"><div className="use-fill" style={{width:`${(r/max)*100}%`,background:"var(--acc)"}}/></div><div className="use-n">{r}</div></div></div>))}</div>
                  </div>
                </div>
              </div>
            )}

            {/* PRIVACY */}
            {page==="privacy"&&(
              <div className="col">
                <div style={{padding:"12px 16px",background:"rgba(16,185,129,0.05)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:10,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}><div style={{width:8,height:8,borderRadius:"50%",background:"var(--grn)",boxShadow:"0 0 5px var(--grn)"}}/><span style={{fontFamily:"Syne",fontWeight:700,fontSize:13}}>No data has left this machine</span><span style={{fontSize:12,color:"var(--mut)"}}>Only outbound: Claude API calls</span></div>
                <div className="g2">
                  <div className="card">
                    <div className="ch"><div className="ct">Memory Log</div><button className="btn btn-danger btn-sm" onClick={forgetAll}>Forget All</button></div>
                    <div className="cb">{memLog.length===0?<div className="empty">Memory cleared</div>:memLog.map((m:any)=>(<div key={m.id} className="mem-row"><div className="mdot" style={{background:m.type==="project"?"var(--acc)":m.type==="agent"?"var(--pur)":m.type==="meeting"?"var(--amb)":"var(--grn)"}}/><div style={{flex:1}}><div className="mem-text">{m.content||m.text}</div><div className="mem-src">{m.source||m.src}</div></div><button className="btn btn-danger btn-sm" onClick={()=>forgetMem(m.id)}>Forget</button></div>))}</div>
                  </div>
                  <div className="col">
                    <div className="card">
                      <div className="ch"><div className="ct">Settings</div></div>
                      <div className="cb">{[{k:"persist",l:"Persistent memory",s:"Agents remember across sessions"},{k:"learn",l:"Agent learning",s:"Improve from usage patterns"},{k:"session",l:"Session-only",s:"Wipe on close"},{k:"audit",l:"Audit log",s:"Record every agent action"}].map(({k,l,s})=>(<div key={k} className="tog-row"><div><div className="tog-lbl">{l}</div><div className="tog-sub">{s}</div></div><div className={`tog ${(privTogs as any)[k]?"on":"off"}`} onClick={()=>togglePriv(k)}/></div>))}</div>
                    </div>
                    <div className="card">
                      <div className="ch"><div className="ct">Data Flow</div></div>
                      <div className="cb">{[{s:"Jira tickets",d:"Local Postgres only"},{s:"Calendar events",d:"Local Postgres only"},{s:"Meeting transcripts",d:"Claude API (anonymised)"},{s:"Backlog items",d:"Claude API (no PII)"},{s:"Stakeholder emails",d:"Local only — never AI"}].map((r,i)=>(<div key={i} className="flow-row"><div style={{flex:1,fontSize:12,color:"var(--mut)"}}>{r.s}</div><span className="dim" style={{fontSize:11}}>→</span><div style={{fontFamily:"DM Mono",fontSize:11,flex:1,color:"var(--grn)"}}>{r.d}</div><div className="fdot" style={{background:"var(--grn)"}}/></div>))}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* INTEGRATIONS */}
            {page==="integrations"&&(
              <div className="col">
                <div className="g4">
                  {[{name:"jira",label:"Jira",icon:"🔷",desc:"Issues, sprints, project tracking",fn:()=>syncJira()},{name:"webex",label:"Webex",icon:"💬",desc:"Meetings (personal token)",fn:async()=>{setSyncingInt("webex");const{data,error}=await supabase.functions.invoke("webex-sync",{body:{action:"pull"}});setSyncingInt(null);if(error){alert(error.message);return;}alert(`Synced ${data?.synced||0}`);}},{name:"gmail",label:"Gmail",icon:"📧",desc:"Starred emails as tasks",fn:syncGmail},{name:"google_calendar",label:"Calendar",icon:"📅",desc:"Bidirectional GCal sync",fn:()=>syncCal()}].map(({name,label,icon,desc,fn})=>{
                    const st=getIntSt(name);
                    const syncing=syncingInt===name;
                    const disp=syncing?"syncing":st.status;
                    return(<div key={name} className="card" style={{padding:16}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div style={{fontSize:24}}>{icon}</div><span className={`tag ${disp==="connected"?"tag-grn":disp==="syncing"?"tag-blu":disp==="error"?"tag-red":"tag-dim"}`} style={{fontSize:9}}>{disp==="connected"?"● Connected":disp==="syncing"?"⟳ Syncing...":disp==="error"?"● Error":"○ Disconnected"}</span></div>
                      <div style={{fontFamily:"Syne",fontWeight:700,fontSize:14,marginBottom:3}}>{label}</div>
                      <div style={{fontSize:11,color:"var(--mut)",marginBottom:10}}>{desc}</div>
                      {st.last_synced_at&&<div style={{fontFamily:"DM Mono",fontSize:9,color:"var(--mut)",marginBottom:8}}>Last: {new Date(st.last_synced_at).toLocaleString()}</div>}
                      <button className="btn btn-primary" style={{width:"100%",fontSize:11}} disabled={syncingInt===name} onClick={fn}>{syncingInt===name?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><span className="spin" style={{width:12,height:12,borderWidth:1.5}}/>Syncing...</span>:`⟳ Sync ${label}`}</button>
                    </div>);
                  })}
                </div>
                <div className="card">
                  <div className="ch"><div className="ct">Jira Issues</div><div style={{display:"flex",gap:6}}><button className="btn btn-sm" onClick={()=>syncJira()} disabled={syncingInt==="jira"}>⟳ Sync</button><button className="btn btn-primary btn-sm" onClick={()=>setShowCreateJira(true)}>+ Create</button></div></div>
                  {jiraIssues.length===0?<div className="empty">{isSyncing?"Syncing Jira...":"No issues synced."}</div>:(<><div className="th-row" style={{gridTemplateColumns:"80px 1fr 80px 80px 100px"}}><span>Key</span><span>Summary</span><span>Status</span><span>Priority</span><span>Assignee</span></div>{jiraIssues.map((issue:any)=>(<div key={issue.id} className="tr" style={{gridTemplateColumns:"80px 1fr 80px 80px 100px"}}><span style={{fontFamily:"DM Mono",fontSize:11,color:"var(--acc)"}}>{issue.jira_key}</span><span style={{fontSize:12}}>{issue.summary}</span><span className={`tag ${["done","closed"].some(s=>issue.status?.includes(s))?"tag-grn":issue.status?.includes("progress")?"tag-blu":"tag-dim"}`} style={{fontSize:9}}>{issue.status}</span><span className={`tag ${issue.priority==="high"?"tag-red":issue.priority==="low"?"tag-grn":"tag-amb"}`} style={{fontSize:9}}>{issue.priority}</span><span style={{fontSize:11,color:"var(--mut)"}}>{issue.assignee||"—"}</span></div>))}</>)}
                </div>
                <div className="card">
                  <div className="ch"><div className="ct">Gmail Threads</div><button className="btn btn-sm" onClick={syncGmail} disabled={syncingInt==="gmail"}>⟳ Sync</button></div>
                  {gmailThreads.length===0?<div className="empty">{isSyncing?"Syncing Gmail...":"No threads synced."}</div>:gmailThreads.map((t:any,i:number)=>(<div key={t.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 16px",borderBottom:i<gmailThreads.length-1?"1px solid var(--bdr)":"none"}}><div style={{width:6,height:6,borderRadius:"50%",background:t.is_read?"var(--bdr2)":"var(--acc)",flexShrink:0,marginTop:5}}/><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:13,fontWeight:t.is_read?400:600}}>{t.subject}</span><span className="mono dim" style={{fontSize:10}}>{t.received_at?new Date(t.received_at).toLocaleDateString():"—"}</span></div><div style={{fontSize:11,color:"var(--mut)"}}>{t.from_email}</div></div><div style={{display:"flex",gap:5,flexShrink:0}}>{!t.is_read&&<button className="btn btn-sm" onClick={()=>markGmailRead(t.thread_id)}>Read</button>}<a href={`https://mail.google.com/mail/u/0/#inbox/${t.thread_id}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm">Open</a></div></div>))}
                </div>
                <div className="card">
                  <div className="ch"><div className="ct">Agent Run History</div></div>
                  {agentRuns.length===0?<div className="empty">No agent runs yet.</div>:(<><div className="th-row" style={{gridTemplateColumns:"140px 1fr 1fr 70px 80px"}}><span>Agent</span><span>Input</span><span>Output</span><span>Tokens</span><span>When</span></div>{agentRuns.map((run:any)=>(<div key={run.id} className="tr" style={{gridTemplateColumns:"140px 1fr 1fr 70px 80px"}}><span className="tag tag-pur" style={{fontSize:9}}>{run.agent_name}</span><span style={{fontSize:11,color:"var(--mut)"}}>{run.input_summary}</span><span style={{fontSize:11,color:"var(--mut)"}}>{run.output_summary}</span><span className="mono dim" style={{fontSize:10}}>{run.tokens_used}</span><span className="mono dim" style={{fontSize:10}}>{run.ran_at?new Date(run.ran_at).toLocaleDateString():"—"}</span></div>))}</>)}
                </div>
              </div>
            )}

          </div>
        </main>

        {/* MODALS */}
        {agentResultType==="error"&&<Modal title="Agent Error" onClose={closeResult}><div className="infobox ib-red">{agentError}</div><div className="form-actions"><button className="btn btn-primary" onClick={closeResult}>Close</button></div></Modal>}
        {agentResultType==="prioritization"&&agentResult&&(<Modal title="Prioritization Results" onClose={closeResult} wide>{agentResult.summary&&<div className="infobox ib-blue" style={{fontSize:12}}>🤖 {agentResult.summary}</div>}{agentResult.scored_items?.length>0&&<div className="col" style={{gap:6}}>{[...agentResult.scored_items].sort((a:any,b:any)=>b.rice_score-a.rice_score).map((it:any,i:number)=><div key={i} style={{padding:"8px 10px",background:"var(--surf2)",borderRadius:7,border:"1px solid var(--bdr)"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontWeight:500,fontSize:12}}>{it.title}</span><div style={{display:"flex",gap:5}}><span className="tag tag-blu" style={{fontSize:9}}>RICE {Math.round(it.rice_score)}</span><span className="tag tag-dim" style={{fontSize:9}}>{it.recommended_quarter}</span></div></div><div style={{fontSize:11,color:"var(--mut)"}}>{it.reasoning}</div></div>)}</div>}<div className="form-actions"><button className="btn" onClick={()=>{closeResult();setPage("priority");}}>View in Prioritization</button><button className="btn btn-primary" onClick={closeResult}>Done</button></div></Modal>)}
        {agentResultType==="weekly-digest"&&agentResult&&(<Modal title="Weekly Digest" onClose={closeResult} wide>{agentResult.headline&&<div style={{fontFamily:"Syne",fontWeight:800,fontSize:16,color:"var(--acc)"}}>{agentResult.headline}</div>}{[{label:"On Track",items:agentResult.whats_on_track,c:"var(--grn)"},{label:"At Risk",items:agentResult.whats_at_risk,c:"var(--red)"},{label:"Top Priorities",items:agentResult.top_3_priorities,c:"var(--amb)"}].filter(s=>s.items?.length>0).map(({label,items,c})=>(<div key={label}><div className="section-lbl">{label}</div>{items.map((item:string,i:number)=><div key={i} style={{display:"flex",gap:7,fontSize:12,padding:"4px 0",borderBottom:"1px solid var(--bdr)"}}><div style={{width:4,height:4,borderRadius:"50%",background:c,flexShrink:0,marginTop:5}}/>{item}</div>)}</div>))}<div className="form-actions"><button className="btn btn-primary" onClick={closeResult}>Done</button></div></Modal>)}
        {agentResultType==="risk-monitor"&&agentResult&&(<Modal title="Risk Scan" onClose={closeResult} wide><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontFamily:"Syne",fontWeight:700}}>Portfolio Health</span><span className={`tag ${agentResult.overall_health==="green"?"tag-grn":agentResult.overall_health==="amber"?"tag-amb":"tag-red"}`}>{agentResult.overall_health?.toUpperCase()}</span></div>{agentResult.alerts?.length>0?<div className="col" style={{gap:8}}>{agentResult.alerts.map((a:any,i:number)=><div key={i} className={`alert-b ${a.risk_level==="high"?"al-warn":"al-good"}`}><div style={{flex:1}}><div className="al-ttl" style={{color:a.risk_level==="high"?"var(--red)":"var(--amb)"}}>{a.project}</div><div className="al-body">{a.reason}</div><div style={{fontSize:11,color:"var(--acc)",marginTop:3}}>→ {a.suggested_action}</div></div></div>)}</div>:<div className="infobox ib-grn">✓ No critical risks.</div>}<div className="form-actions"><button className="btn" onClick={()=>{closeResult();setPage("tracker");}}>View Projects</button><button className="btn btn-primary" onClick={closeResult}>Done</button></div></Modal>)}
        {agentResultType==="stakeholder-update"&&agentResult&&(<Modal title="Stakeholder Update Draft" onClose={closeResult} wide><div style={{background:"var(--surf2)",border:"1px solid var(--bdr)",borderRadius:8,padding:12}}><div className="form-label" style={{marginBottom:4}}>SUBJECT</div><div style={{fontWeight:500,fontSize:13,marginBottom:12}}>{agentResult.subject}</div><div className="form-label" style={{marginBottom:4}}>BODY</div><div style={{fontSize:12,lineHeight:1.8,whiteSpace:"pre-line"}}>{agentResult.body}</div></div><div className="form-actions"><button className="btn" onClick={()=>navigator.clipboard.writeText(`Subject: ${agentResult.subject}\n\n${agentResult.body}`).then(()=>alert("Copied!"))}>Copy Email</button><button className="btn btn-primary" onClick={closeResult}>Done</button></div></Modal>)}

        {okrInsight&&(<Modal title={`${okrInsight.type==="weekly"?"Weekly":"Quarterly"} AI Insight`} onClose={()=>setOkrInsight(null)} wide>
          <div style={{fontFamily:"Syne",fontWeight:700,fontSize:13,marginBottom:4}}>{okrInsight.okr.objective}</div>
          {okrInsight.data?.headline&&<div style={{fontFamily:"Syne",fontWeight:800,fontSize:15,color:"var(--acc)"}}>{okrInsight.data.headline}</div>}
          {[{label:"On Track",items:okrInsight.data?.whats_on_track,c:"var(--grn)"},{label:"At Risk",items:okrInsight.data?.whats_at_risk,c:"var(--red)"},{label:"Top Priorities",items:okrInsight.data?.top_3_priorities,c:"var(--amb)"}].filter(s=>s.items?.length>0).map(({label,items,c})=>(<div key={label}><div className="section-lbl">{label}</div>{items.map((item:string,i:number)=><div key={i} style={{fontSize:12,padding:"4px 0",borderBottom:"1px solid var(--bdr)",display:"flex",gap:7}}><div style={{width:4,height:4,borderRadius:"50%",background:c,flexShrink:0,marginTop:5}}/>{item}</div>)}</div>))}
          <div className="form-actions">
            <button className="btn" onClick={()=>navigator.clipboard.writeText(JSON.stringify(okrInsight.data,null,2)).then(()=>alert("Copied!"))}>Copy for Exec Summary</button>
            <button className="btn" onClick={()=>{runSHUpdate("Leadership","CPO");setOkrInsight(null);}}>Send Stakeholder Update</button>
            <button className="btn btn-primary" onClick={()=>setOkrInsight(null)}>Done</button>
          </div>
        </Modal>)}

        {showAddTask&&(<Modal title="Add Task" onClose={()=>setShowAddTask(false)}><div className="form-row"><label className="form-label">Title</label><input className="input" value={newTask.title} onChange={e=>setNewTask(p=>({...p,title:e.target.value}))} placeholder="Task description..." autoFocus onKeyDown={e=>e.key==="Enter"&&addTask()}/></div><div className="form-grid"><div className="form-row"><label className="form-label">Priority</label><select className="input select" value={newTask.priority} onChange={e=>setNewTask(p=>({...p,priority:e.target.value}))}><option value="high">High</option><option value="med">Medium</option><option value="low">Low</option></select></div><div className="form-row"><label className="form-label">Schedule for date</label><input className="input" type="date" value={newTask.scheduled_date} onChange={e=>setNewTask(p=>({...p,scheduled_date:e.target.value}))}/></div></div><div className="form-actions"><button className="btn" onClick={()=>setShowAddTask(false)}>Cancel</button><button className="btn btn-primary" onClick={addTask}>Add Task</button></div></Modal>)}

        {showAddProj&&(<Modal title={editProj?"Edit Project":"Add Project"} onClose={()=>setShowAddProj(false)}>
          <div className="form-grid">
            <div className="form-row" style={{gridColumn:"1/-1"}}><label className="form-label">Project Name</label><input className="input" value={projForm.name} onChange={e=>setProjForm(p=>({...p,name:e.target.value}))} autoFocus placeholder="e.g. Mobile Onboarding V2"/></div>
            <div className="form-row"><label className="form-label">Owner</label><input className="input" value={projForm.owner} onChange={e=>setProjForm(p=>({...p,owner:e.target.value}))} placeholder="Ana + Raj"/></div>
            <div className="form-row"><label className="form-label">Status</label><select className="input select" value={projForm.status} onChange={e=>setProjForm(p=>({...p,status:e.target.value}))}><option value="planning">Planning</option><option value="on-track">On Track</option><option value="at-risk">At Risk</option><option value="delayed">Delayed</option></select></div>
            <div className="form-row"><label className="form-label">Progress (%)</label><input className="input" type="number" min="0" max="100" value={projForm.progress} onChange={e=>setProjForm(p=>({...p,progress:e.target.value as any}))}/></div>
            <div className="form-row"><label className="form-label">Priority</label><select className="input select" value={projForm.priority} onChange={e=>setProjForm(p=>({...p,priority:e.target.value}))}><option value="high">High</option><option value="med">Medium</option><option value="low">Low</option></select></div>
            <div className="form-row"><label className="form-label">Due Date</label><input className="input" type="date" value={projForm.due_date} onChange={e=>setProjForm(p=>({...p,due_date:e.target.value}))}/></div>
            <div className="form-row" style={{gridColumn:"1/-1"}}><label className="form-label">User Research Summary (optional)</label><textarea className="input" value={projForm.research_summary} onChange={e=>setProjForm(p=>({...p,research_summary:e.target.value}))} style={{minHeight:70,resize:"vertical" as any}} placeholder="Key user research findings, pain points, themes..."/></div>
            <div className="form-row" style={{gridColumn:"1/-1"}}><label className="form-label">Competitive Intelligence Summary (optional)</label><textarea className="input" value={projForm.competitive_summary} onChange={e=>setProjForm(p=>({...p,competitive_summary:e.target.value}))} style={{minHeight:70,resize:"vertical" as any}} placeholder="Competitor positioning, feature gaps, market signals..."/></div>
          </div>
          <div className="form-actions"><button className="btn" onClick={()=>setShowAddProj(false)}>Cancel</button><button className="btn btn-primary" onClick={saveProject}>{editProj?"Save Changes":"Add Project"}</button></div>
        </Modal>)}

        {showAddMeet&&(<Modal title="New Meeting" onClose={()=>setShowAddMeet(false)} wide><div className="form-row"><label className="form-label">Title</label><input className="input" value={meetForm.title} onChange={e=>setMeetForm(p=>({...p,title:e.target.value}))} autoFocus placeholder="Sprint Planning — Mobile Team"/></div><div className="form-row"><label className="form-label">Date & Time (optional)</label><input className="input" type="datetime-local" value={meetForm.meeting_time} onChange={e=>setMeetForm(p=>({...p,meeting_time:e.target.value}))}/></div><div className="form-row"><label className="form-label">Paste Transcript</label><textarea className="input" value={meetForm.raw_transcript} onChange={e=>setMeetForm(p=>({...p,raw_transcript:e.target.value}))} placeholder="Paste transcript here. AI will extract action items, decisions and owners automatically..." style={{minHeight:160,resize:"vertical" as any}}/></div><div className="form-actions"><button className="btn" onClick={()=>setShowAddMeet(false)}>Cancel</button><button className="btn btn-primary" onClick={saveMeeting} disabled={meetProcessing}>{meetProcessing?<><span className="spin" style={{width:13,height:13,borderWidth:1.5,display:"inline-block",verticalAlign:"middle",marginRight:6}}/>Processing...</>:meetForm.raw_transcript.trim()?"Save & Extract with AI":"Save Meeting"}</button></div></Modal>)}

        {editingAction&&(<Modal title="Edit Action Item" onClose={()=>setEditingAction(null)}><div className="form-row"><label className="form-label">Action</label><input className="input" value={actionForm.text} onChange={e=>setActionForm(p=>({...p,text:e.target.value}))} autoFocus/></div><div className="form-grid"><div className="form-row"><label className="form-label">Owner</label><input className="input" value={actionForm.owner} onChange={e=>setActionForm(p=>({...p,owner:e.target.value}))} placeholder="Person responsible"/></div><div className="form-row"><label className="form-label">Priority</label><select className="input select" value={actionForm.priority} onChange={e=>setActionForm(p=>({...p,priority:e.target.value}))}><option value="high">High</option><option value="med">Medium</option><option value="low">Low</option></select></div><div className="form-row"><label className="form-label">Due Date</label><input className="input" type="date" value={actionForm.due_date} onChange={e=>setActionForm(p=>({...p,due_date:e.target.value}))}/></div></div><div className="form-actions"><button className="btn" onClick={()=>setEditingAction(null)}>Cancel</button><button className="btn btn-primary" onClick={saveActionEdit}>Save</button></div></Modal>)}

        {showAddOkr&&(<Modal title="Add Objective" onClose={()=>setShowAddOkr(false)}><div className="form-row"><label className="form-label">Objective</label><input className="input" value={okrForm.objective} onChange={e=>setOkrForm(p=>({...p,objective:e.target.value}))} autoFocus placeholder="Become the #1 B2B productivity platform"/></div><div className="form-grid"><div className="form-row"><label className="form-label">Owner</label><input className="input" value={okrForm.owner} onChange={e=>setOkrForm(p=>({...p,owner:e.target.value}))} placeholder="PM / Team lead"/></div><div className="form-row"><label className="form-label">Icon</label><input className="input" value={okrForm.icon} onChange={e=>setOkrForm(p=>({...p,icon:e.target.value}))} placeholder="🎯"/></div><div className="form-row"><label className="form-label">Color</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["#00d4ff","#7c3aed","#10b981","#f59e0b","#ef4444","#ec4899"].map(c=><div key={c} onClick={()=>setOkrForm(p=>({...p,color:c}))} style={{width:24,height:24,borderRadius:6,background:c,cursor:"pointer",border:okrForm.color===c?"2px solid #fff":"2px solid transparent"}}/>)}</div></div></div><div className="form-actions"><button className="btn" onClick={()=>setShowAddOkr(false)}>Cancel</button><button className="btn btn-primary" onClick={addOkr}>Add Objective</button></div></Modal>)}

        {showAddSh&&(<Modal title={editSh?"Edit Stakeholder":"Add Stakeholder"} onClose={()=>setShowAddSh(false)}><div className="form-grid"><div className="form-row"><label className="form-label">Full Name</label><input className="input" value={shForm.name} onChange={e=>setShForm(p=>({...p,name:e.target.value}))} autoFocus placeholder="Sarah Mitchell"/></div><div className="form-row"><label className="form-label">Role</label><input className="input" value={shForm.role} onChange={e=>setShForm(p=>({...p,role:e.target.value}))} placeholder="Chief Product Officer"/></div><div className="form-row" style={{gridColumn:"1/-1"}}><label className="form-label">Email</label><input className="input" type="email" value={shForm.email} onChange={e=>setShForm(p=>({...p,email:e.target.value}))} placeholder="s.mitchell@company.com"/></div><div className="form-row"><label className="form-label">Type</label><select className="input select" value={shForm.type} onChange={e=>setShForm(p=>({...p,type:e.target.value}))}>{["Internal — Executive","Internal — Engineering","Internal — Design","Internal — GTM","Internal — ML","External — Client"].map(t=><option key={t}>{t}</option>)}</select></div><div className="form-row"><label className="form-label">Influence (1–5)</label><select className="input select" value={shForm.influence} onChange={e=>setShForm(p=>({...p,influence:parseInt(e.target.value)}))}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}</select></div><div className="form-row"><label className="form-label">Color</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["#00d4ff","#7c3aed","#10b981","#f59e0b","#ef4444","#ec4899"].map(c=><div key={c} onClick={()=>setShForm(p=>({...p,color:c}))} style={{width:22,height:22,borderRadius:6,background:c,cursor:"pointer",border:shForm.color===c?"2px solid #fff":"2px solid transparent"}}/>)}</div></div></div><div className="form-actions"><button className="btn" onClick={()=>setShowAddSh(false)}>Cancel</button><button className="btn btn-primary" onClick={saveSh}>{editSh?"Save Changes":"Add Stakeholder"}</button></div></Modal>)}

        {showCreateJira&&(<Modal title="Create Jira Issue" onClose={()=>setShowCreateJira(false)}><div className="form-grid"><div className="form-row" style={{gridColumn:"1/-1"}}><label className="form-label">Summary</label><input className="input" value={jiraForm.summary} onChange={e=>setJiraForm(p=>({...p,summary:e.target.value}))} autoFocus placeholder="Issue summary..."/></div><div className="form-row"><label className="form-label">Project Key</label><input className="input" value={jiraForm.projectKey} onChange={e=>setJiraForm(p=>({...p,projectKey:e.target.value}))} placeholder="PM"/></div><div className="form-row"><label className="form-label">Issue Type</label><select className="input select" value={jiraForm.issueType} onChange={e=>setJiraForm(p=>({...p,issueType:e.target.value}))}><option>Task</option><option>Story</option><option>Bug</option><option>Epic</option></select></div><div className="form-row"><label className="form-label">Priority</label><select className="input select" value={jiraForm.priority} onChange={e=>setJiraForm(p=>({...p,priority:e.target.value}))}><option value="high">High</option><option value="med">Medium</option><option value="low">Low</option></select></div><div className="form-row" style={{gridColumn:"1/-1"}}><label className="form-label">Description</label><textarea className="input" value={jiraForm.description} onChange={e=>setJiraForm(p=>({...p,description:e.target.value}))} style={{minHeight:80,resize:"vertical" as any}} placeholder="Describe the issue..."/></div></div><div className="form-actions"><button className="btn" onClick={()=>setShowCreateJira(false)}>Cancel</button><button className="btn btn-primary" onClick={createJira} disabled={syncingInt==="jira-c"}>{syncingInt==="jira-c"?"Creating...":"Create in Jira"}</button></div></Modal>)}

        {showAddCal&&(<Modal title="Add Calendar Event" onClose={()=>setShowAddCal(false)}><div className="form-grid"><div className="form-row" style={{gridColumn:"1/-1"}}><label className="form-label">Title</label><input className="input" value={calForm.title} onChange={e=>setCalForm(p=>({...p,title:e.target.value}))} autoFocus placeholder="Sprint Planning — Mobile Team"/></div><div className="form-row"><label className="form-label">Start Time</label><input className="input" type="time" value={calForm.startTime} onChange={e=>setCalForm(p=>({...p,startTime:e.target.value}))}/></div><div className="form-row"><label className="form-label">End Time</label><input className="input" type="time" value={calForm.endTime} onChange={e=>setCalForm(p=>({...p,endTime:e.target.value}))}/></div><div className="form-row" style={{gridColumn:"1/-1"}}><label className="form-label">Attendees (comma-separated)</label><input className="input" value={calForm.attendees} onChange={e=>setCalForm(p=>({...p,attendees:e.target.value}))} placeholder="ana@company.com, chen@company.com"/></div><div className="form-row" style={{gridColumn:"1/-1"}}><label className="form-label">Description</label><input className="input" value={calForm.description} onChange={e=>setCalForm(p=>({...p,description:e.target.value}))} placeholder="Agenda or context..."/></div></div><div style={{fontSize:11,color:"var(--mut)"}}>A Google Meet link will be auto-generated.</div><div className="form-actions"><button className="btn" onClick={()=>setShowAddCal(false)}>Cancel</button><button className="btn btn-primary" onClick={createCalEvent} disabled={syncingInt==="cal-create"}>{syncingInt==="cal-create"?"Creating...":"Create Event + Meet Link"}</button></div></Modal>)}

        {showAddMoscow&&(<Modal title="Add MoSCoW Item" onClose={()=>setShowAddMoscow(false)}><div className="form-row"><label className="form-label">Feature / Initiative</label><input className="input" value={moscowForm.title} onChange={e=>setMoscowForm(p=>({...p,title:e.target.value}))} autoFocus placeholder="e.g. Real-time notifications"/></div><div className="form-grid"><div className="form-row"><label className="form-label">Bucket</label><select className="input select" value={moscowForm.bucket} onChange={e=>setMoscowForm(p=>({...p,bucket:e.target.value}))}><option value="must">Must Have</option><option value="should">Should Have</option><option value="could">Could Have</option><option value="wont">Won't Have</option></select></div><div className="form-row"><label className="form-label">Project</label><select className="input select" value={moscowForm.project} onChange={e=>setMoscowForm(p=>({...p,project:e.target.value}))}><option value="">All</option>{projects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></div></div><div className="form-actions"><button className="btn" onClick={()=>setShowAddMoscow(false)}>Cancel</button><button className="btn btn-primary" onClick={async()=>{if(!moscowForm.title.trim())return;await supabase.from("moscow_items").insert({...moscowForm,user_id:user?.id}).then(undefined,()=>{});setShowAddMoscow(false);setMoscowForm({title:"",bucket:"must",project:""});loadMoscow();}}>Add Item</button></div></Modal>)}

        {showAddRoadmap&&(<Modal title="Add Initiative" onClose={()=>setShowAddRoadmap(false)}><div className="form-row"><label className="form-label">Title</label><input className="input" value={rmForm.title} onChange={e=>setRmForm(p=>({...p,title:e.target.value}))} autoFocus placeholder="e.g. Mobile App v2"/></div><div className="form-grid"><div className="form-row"><label className="form-label">Project</label><select className="input select" value={rmForm.project} onChange={e=>setRmForm(p=>({...p,project:e.target.value}))}><option value="">None</option>{projects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></div><div className="form-row"><label className="form-label">Color</label><div style={{display:"flex",gap:6,paddingTop:4}}>{["#00d4ff","#7c3aed","#10b981","#f59e0b","#ef4444"].map(c=><div key={c} onClick={()=>setRmForm(p=>({...p,color:c}))} style={{width:24,height:24,borderRadius:6,background:c,cursor:"pointer",border:rmForm.color===c?"2px solid #fff":"2px solid transparent"}}/>)}</div></div><div className="form-row"><label className="form-label">Start Quarter</label><select className="input select" value={rmForm.startQ} onChange={e=>setRmForm(p=>({...p,startQ:parseInt(e.target.value)}))}>{["Q1","Q2","Q3","Q4"].map((q,i)=><option key={q} value={i}>{q}</option>)}</select></div><div className="form-row"><label className="form-label">End Quarter</label><select className="input select" value={rmForm.endQ} onChange={e=>setRmForm(p=>({...p,endQ:parseInt(e.target.value)}))}>{["Q1","Q2","Q3","Q4"].map((q,i)=><option key={q} value={i}>{q}</option>)}</select></div></div><div className="form-actions"><button className="btn" onClick={()=>setShowAddRoadmap(false)}>Cancel</button><button className="btn btn-primary" onClick={saveRm}>Add Initiative</button></div></Modal>)}

      </div>
    </>
  );
}
