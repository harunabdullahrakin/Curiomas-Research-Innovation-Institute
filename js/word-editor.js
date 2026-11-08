/**
 * CRII Word-style Document Editor
 * A familiar, ribbon-based rich text editor (Microsoft Word / Google Docs feel)
 * Stores articles as sanitized HTML prefixed with CriiDoc.MARK.
 */
(function () {
  'use strict';

  const CD = window.CriiDoc;
  if (!CD) { console.error('CriiDoc missing — load js/doc-sanitize.js first'); return; }

  /* ------------------------------------------------------------------ */
  /* State                                                               */
  /* ------------------------------------------------------------------ */
  let wrap, doc, modeBar, ribbonEl, tabsEl, navEl, statusEl, findPanel;
  let mounted = false;
  let mode = 'doc';
  let savedRange = null;
  let zoom = 100;
  let painter = null;
  let blocksProvider = () => [];
  let draftKey = 'crii_doc_draft_new';
  let dirty = false;
  let autosaveTimer = null, statusTimer = null, navTimer = null;
  let stateBtns = [];
  let ctlFont, ctlSize, ctlStyle;
  let ctxTabs = {};
  let activeTab = 'home';
  let selImg = null;
  let pop = null, popOutside = null;
  let lastTextColor = '#ef4444', lastHiColor = '#ffff00';
  let colorBars = {};
  let readingAloud = false;

  const RECENT_KEY = 'crii_doc_recent_colors';

  /* ------------------------------------------------------------------ */
  /* Utilities                                                           */
  /* ------------------------------------------------------------------ */
  const ICONS = {
    undo: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
    redo: '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>',
    cut: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    paste: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
    painter: '<path d="M18 2l4 4-9 9-4-4z"/><path d="M9 11l-4 4a3 3 0 0 0 4 4l4-4"/>',
    ul: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
    ol: '<line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',
    alignL: '<line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>',
    alignC: '<line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/>',
    alignR: '<line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/>',
    alignJ: '<line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/>',
    indent: '<polyline points="3 8 7 12 3 16"/><line x1="21" y1="12" x2="11" y2="12"/><line x1="21" y1="6" x2="11" y2="6"/><line x1="21" y1="18" x2="11" y2="18"/>',
    outdent: '<polyline points="7 8 3 12 7 16"/><line x1="21" y1="12" x2="11" y2="12"/><line x1="21" y1="6" x2="11" y2="6"/><line x1="21" y1="18" x2="11" y2="18"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
    table: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>',
    video: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    hr: '<line x1="4" y1="12" x2="20" y2="12"/>',
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    callout: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    quote: '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h4"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h4"/>',
    sigma: '<path d="M18 7V4H6l6 8-6 8h12v-3"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    pagebreak: '<path d="M3 12h4M10 12h4M17 12h4"/><path d="M6 3h12v6H6zM6 15h12v6H6z"/>',
    columns: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    speaker: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
    check: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    max: '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>',
    zoomIn: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>',
    zoomOut: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>',
    eraser: '<path d="M20 20H9L4 15a2 2 0 0 1 0-2.8l8.2-8.2a2 2 0 0 1 2.8 0l5 5a2 2 0 0 1 0 2.8L13 20"/>',
    filePlus: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    printer: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    sidebar: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>',
    pilcrow: '<path d="M13 4v16"/><path d="M17 4v16"/><path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13"/>',
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    toc: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="12" y1="12" x2="21" y2="12"/><line x1="12" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="4" y2="6"/><line x1="3" y1="12" x2="4" y2="12"/><line x1="3" y1="18" x2="4" y2="18"/>',
    spacing: '<line x1="21" y1="6" x2="11" y2="6"/><line x1="21" y1="12" x2="11" y2="12"/><line x1="21" y1="18" x2="11" y2="18"/><polyline points="3 8 6 5 9 8"/><polyline points="3 16 6 19 9 16"/><line x1="6" y1="5" x2="6" y2="19"/>',
    rtl: '<path d="M13 4v16"/><path d="M17 4v16"/><path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13"/>',
    word: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    template: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
    undoAll: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><polyline points="3 3 3 8 8 8"/>'
  };
  const ic = (n, s) => '<svg viewBox="0 0 24 24" width="' + (s || 16) + '" height="' + (s || 16) + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[n] || '') + '</svg>';
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toast = (m, t) => { if (window.showToast) window.showToast(m, t || 'info'); };

  const FONTS = [
    ['Default', ''], ['Eyekons', 'Eyekons, Georgia, serif'], ['Arial', 'Arial, Helvetica, sans-serif'],
    ['Calibri', 'Calibri, Carlito, sans-serif'], ['Cambria', 'Cambria, Georgia, serif'],
    ['Times New Roman', '"Times New Roman", Times, serif'], ['Georgia', 'Georgia, serif'],
    ['Garamond', 'Garamond, "EB Garamond", serif'], ['Palatino', '"Palatino Linotype", Palatino, serif'],
    ['Verdana', 'Verdana, Geneva, sans-serif'], ['Trebuchet MS', '"Trebuchet MS", sans-serif'],
    ['Segoe UI', '"Segoe UI", sans-serif'], ['Courier New', '"Courier New", monospace'],
    ['Consolas', 'Consolas, monospace'], ['Comic Sans MS', '"Comic Sans MS", cursive']
  ];
  const SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48, 60, 72];
  const STYLES = [['normal', 'Normal'], ['title', 'Title'], ['subtitle', 'Subtitle'], ['h1', 'Heading 1'], ['h2', 'Heading 2'], ['h3', 'Heading 3'], ['h4', 'Heading 4'], ['quote', 'Quote'], ['code', 'Code block']];

  const THEME = ['#000000', '#FFFFFF', '#44546A', '#4472C4', '#ED7D31', '#A5A5A5', '#FFC000', '#5B9BD5', '#70AD47', '#7030A0'];
  const STANDARD = ['#C00000', '#FF0000', '#FFC000', '#FFFF00', '#92D050', '#00B050', '#00B0F0', '#0070C0', '#002060', '#7030A0'];
  const SHADES = [0.8, 0.6, 0.4, -0.25, -0.5];

  function mix(hex, t) {
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = t >= 0 ? 255 : 0, a = Math.abs(t);
    r = Math.round(r + (f - r) * a); g = Math.round(g + (f - g) * a); b = Math.round(b + (f - b) * a);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  const rgbToHex = c => {
    const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c || '');
    if (!m) return null;
    return '#' + ((1 << 24) + (+m[1] << 16) + (+m[2] << 8) + +m[3]).toString(16).slice(1);
  };

  /* ------------------------------------------------------------------ */
  /* Selection helpers                                                   */
  /* ------------------------------------------------------------------ */
  function saveSel() {
    const s = window.getSelection();
    if (s && s.rangeCount) {
      const r = s.getRangeAt(0);
      if (doc && doc.contains(r.commonAncestorContainer)) savedRange = r.cloneRange();
    }
  }
  function restoreSel() {
    if (!doc) return;
    doc.focus({ preventScroll: true });
    if (savedRange) {
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(savedRange);
    }
  }
  function exec(cmd, val) {
    restoreSel();
    try { document.execCommand(cmd, false, val == null ? null : val); } catch (e) { /* ignore */ }
    saveSel();
  }
  function anchorEl() {
    const s = window.getSelection();
    let n = s && s.rangeCount && doc.contains(s.anchorNode) ? s.anchorNode : (savedRange ? savedRange.startContainer : null);
    if (!n) return null;
    if (n.nodeType === 3) n = n.parentElement;
    return n && doc.contains(n) ? n : null;
  }
  function up(n, sel) {
    const e = n && n.closest ? n.closest(sel) : null;
    return e && doc.contains(e) && e !== doc ? e : null;
  }
  const BLOCK_SEL = 'p,h1,h2,h3,h4,h5,h6,li,blockquote,pre,td,th,figcaption';
  function selectedBlocks() {
    restoreSel();
    const s = window.getSelection();
    if (!s.rangeCount) return [];
    const r = s.getRangeAt(0);
    const out = Array.from(doc.querySelectorAll(BLOCK_SEL)).filter(b => {
      try { return r.intersectsNode(b); } catch (e) { return false; }
    });
    if (!out.length) {
      const b = up(anchorEl(), 'div,' + BLOCK_SEL);
      if (b) out.push(b);
    }
    // drop blocks that contain other selected blocks (e.g. blockquote > p)
    return out.filter(b => !out.some(o => o !== b && b.contains(o)));
  }
  function selectWordIfCollapsed() {
    const s = window.getSelection();
    if (s.isCollapsed && s.modify) {
      s.modify('move', 'backward', 'word');
      s.modify('extend', 'forward', 'word');
      saveSel();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Popovers, menus & dialogs                                           */
  /* ------------------------------------------------------------------ */
  function closePop() {
    if (pop) { pop.remove(); pop = null; }
    if (popOutside) { document.removeEventListener('mousedown', popOutside, true); popOutside = null; }
  }
  function openPop(anchor, content) {
    closePop();
    pop = el('div', 'we-pop');
    pop.append(content);
    pop.addEventListener('mousedown', e => { if (!/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) e.preventDefault(); });
    document.body.append(pop);
    const r = anchor.getBoundingClientRect();
    const w = pop.offsetWidth, h = pop.offsetHeight;
    let left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8));
    let top = r.bottom + 4;
    if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 4);
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    popOutside = e => { if (pop && !pop.contains(e.target) && !anchor.contains(e.target)) closePop(); };
    setTimeout(() => document.addEventListener('mousedown', popOutside, true), 0);
    return pop;
  }
  function menuContent(items) {
    const box = el('div');
    items.forEach(it => {
      if (it === '-') { box.append(el('div', '', '<hr style="margin:4px 0;border:none;border-top:1px solid var(--border-color)">')); return; }
      const row = el('div', 'we-menu-item', (it.icon ? ic(it.icon, 15) : '') + '<span>' + esc(it.label) + '</span>' + (it.hint ? '<small>' + esc(it.hint) + '</small>' : ''));
      row.addEventListener('click', () => { closePop(); restoreSel(); it.fn(); afterChange(); });
      box.append(row);
    });
    return box;
  }

  function dialog(opts) {
    const ov = el('div', 'we-modal-overlay');
    const box = el('div', 'we-modal' + (opts.wide ? ' wide' : ''));
    box.innerHTML = '<div class="we-modal-head"><span>' + esc(opts.title) + '</span><button type="button" class="we-x" aria-label="Close">&times;</button></div><div class="we-modal-body"></div><div class="we-modal-foot"></div>';
    const body = box.querySelector('.we-modal-body');
    const foot = box.querySelector('.we-modal-foot');
    const inputs = {};
    (opts.fields || []).forEach(f => {
      const row = el('div', 'we-field' + (f.type === 'checkbox' ? ' we-check' : ''));
      if (f.type === 'html') { row.innerHTML = f.html; body.append(row); return; }
      let inp;
      if (f.type === 'textarea') inp = el('textarea');
      else if (f.type === 'select') {
        inp = el('select');
        f.options.forEach(o => { const op = el('option'); op.value = o[0]; op.textContent = o[1]; inp.append(op); });
      } else { inp = el('input'); inp.type = f.type || 'text'; }
      if (f.type === 'file') { inp.accept = f.accept || ''; }
      if (f.placeholder) inp.placeholder = f.placeholder;
      if (f.value != null && f.type !== 'checkbox' && f.type !== 'file') inp.value = f.value;
      if (f.type === 'checkbox') { inp.checked = !!f.value; }
      inputs[f.id] = inp;
      if (f.type === 'checkbox') {
        const lab = el('label'); lab.append(inp); lab.append(document.createTextNode(' ' + f.label)); row.append(lab);
      } else {
        const lab = el('label', '', esc(f.label || '')); row.append(lab); row.append(inp);
      }
      if (f.hint) row.append(el('div', 'we-hint', f.hint));
      if (f.type === 'file' && f.onFile) {
        const st = el('div', 'we-hint'); row.append(st);
        inp.addEventListener('change', () => { if (inp.files[0]) f.onFile(inp.files[0], t => { st.textContent = t; }, inputs); });
      }
      body.append(row);
    });
    const cancel = el('button', 'btn btn-secondary btn-sm', 'Cancel'); cancel.type = 'button';
    foot.append(cancel);
    let okBtn = null;
    if (opts.ok !== false) {
      okBtn = el('button', 'btn btn-primary btn-sm', esc(opts.ok || 'OK')); okBtn.type = 'button';
      foot.append(okBtn);
    }
    const api = { inputs, close: () => { ov.remove(); document.removeEventListener('keydown', onKey, true); } };
    const values = () => {
      const v = {};
      Object.keys(inputs).forEach(k => { const i = inputs[k]; v[k] = i.type === 'checkbox' ? i.checked : i.type === 'file' ? i.files[0] : i.value; });
      return v;
    };
    api.values = values;
    const submit = async () => {
      if (!opts.onOk) { api.close(); return; }
      const res = await opts.onOk(values(), api);
      if (res !== false) api.close();
    };
    function onKey(e) {
      if (e.key === 'Escape') { e.stopPropagation(); api.close(); }
      else if (e.key === 'Enter' && !e.shiftKey && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON' && okBtn) { e.preventDefault(); submit(); }
    }
    document.addEventListener('keydown', onKey, true);
    cancel.addEventListener('click', api.close);
    box.querySelector('.we-x').addEventListener('click', api.close);
    if (okBtn) okBtn.addEventListener('click', submit);
    ov.addEventListener('mousedown', e => { if (e.target === ov) api.close(); });
    ov.append(box);
    document.body.append(ov);
    const first = body.querySelector('input:not([type=file]),textarea,select');
    if (first) setTimeout(() => first.focus(), 30);
    return api;
  }

  /* ------------------------------------------------------------------ */
  /* Ribbon builders                                                     */
  /* ------------------------------------------------------------------ */
  function btn(icon, title, fn, o) {
    o = o || {};
    const b = el('button', 'we-btn' + (o.big ? ' we-big' : ''));
    b.type = 'button';
    b.title = title;
    b.innerHTML = (icon ? ic(icon, o.big ? 22 : 16) : '') + (o.html || '') + (o.text ? '<span>' + esc(o.text) + '</span>' : '') + (o.caret ? '<span class="we-caret">&#9660;</span>' : '');
    b.addEventListener('mousedown', e => e.preventDefault());
    b.addEventListener('click', e => { e.preventDefault(); if (fn) { fn(e, b); } });
    if (o.state) stateBtns.push({ b, cmd: o.state });
    return b;
  }
  const cmdBtn = (icon, title, cmd, o) => btn(icon, title, () => { exec(cmd); afterChange(); }, Object.assign({ state: cmd }, o || {}));
  function fmtBtn(html, title, cmd) {
    return btn(null, title, () => { exec(cmd); afterChange(); }, { html, state: cmd });
  }
  function menuBtn(icon, title, items, o) {
    o = o || {};
    return btn(icon, title, (e, b) => { saveSel(); openPop(b, menuContent(typeof items === 'function' ? items() : items)); }, Object.assign({ caret: true }, o));
  }
  function group(label, rows) {
    const g = el('div', 'we-group');
    const body = el('div', 'we-group-body');
    rows.forEach(r => { const row = el('div', 'we-row'); r.forEach(n => row.append(n)); body.append(row); });
    g.append(body);
    g.append(el('div', 'we-group-label', esc(label)));
    return g;
  }
  function select(cls, title, options, onChange) {
    const s = el('select', 'we-select ' + cls);
    s.title = title;
    options.forEach(o => { const op = el('option'); op.value = o[0]; op.textContent = o[1]; s.append(op); });
    s.addEventListener('change', () => { restoreSel(); onChange(s.value); afterChange(); });
    return s;
  }

  /* -- Color palette -- */
  function recentColors() { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch (e) { return []; } }
  function pushRecent(c) {
    const r = recentColors().filter(x => x !== c); r.unshift(c);
    localStorage.setItem(RECENT_KEY, JSON.stringify(r.slice(0, 10)));
  }
  function paletteContent(onPick, noneLabel) {
    const box = el('div', 'we-palette');
    const none = el('div', 'we-menu-item', '<span style="width:16px;height:16px;border:1px solid #9ca3af;display:inline-block;background:linear-gradient(135deg,#fff 45%,#ef4444 45%,#ef4444 55%,#fff 55%)"></span><span>' + esc(noneLabel) + '</span>');
    none.addEventListener('click', () => { closePop(); onPick(null); });
    box.append(none);
    const addSwatches = (title, colors) => {
      box.append(el('div', 'we-palette-title', esc(title)));
      const g = el('div', 'we-swatches');
      colors.forEach(c => {
        const s = el('button', 'we-swatch'); s.type = 'button'; s.style.background = c; s.title = c.toUpperCase();
        s.addEventListener('click', () => { closePop(); onPick(c); });
        g.append(s);
      });
      box.append(g);
    };
    box.append(el('div', 'we-palette-title', 'Theme colors'));
    const tg = el('div', 'we-swatches');
    [THEME].concat(SHADES.map(sh => THEME.map(c => mix(c, sh)))).forEach(row => row.forEach(c => {
      const s = el('button', 'we-swatch'); s.type = 'button'; s.style.background = c; s.title = c.toUpperCase();
      s.addEventListener('click', () => { closePop(); onPick(c); });
      tg.append(s);
    }));
    box.append(tg);
    addSwatches('Standard colors', STANDARD);
    const rec = recentColors();
    if (rec.length) addSwatches('Recent colors', rec);
    box.append(el('div', 'we-palette-title', 'Custom color (hex code)'));
    const cu = el('div', 'we-color-custom');
    const pick = el('input'); pick.type = 'color'; pick.value = '#2563eb';
    const hex = el('input'); hex.type = 'text'; hex.placeholder = '#2563EB'; hex.maxLength = 7;
    const go = el('button', 'btn btn-primary btn-sm', 'Apply'); go.type = 'button';
    pick.addEventListener('input', () => { hex.value = pick.value.toUpperCase(); });
    const apply = () => {
      let v = hex.value.trim();
      if (/^[0-9a-f]{6}$/i.test(v)) v = '#' + v;
      if (/^#[0-9a-f]{3}$/i.test(v)) v = '#' + v.slice(1).split('').map(x => x + x).join('');
      if (!/^#[0-9a-f]{6}$/i.test(v)) { toast('Enter a valid hex color like #2563EB', 'error'); return; }
      closePop(); onPick(v);
    };
    go.addEventListener('click', apply);
    hex.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); apply(); } });
    cu.append(pick, hex, go);
    box.append(cu);
    return box;
  }
  function colorButton(kind) {
    const isText = kind === 'text';
    const wrapper = el('div', 'we-row');
    wrapper.style.gap = '0';
    const main = btn(null, isText ? 'Font color' : 'Text highlight color', () => applyColor(kind, isText ? lastTextColor : lastHiColor), {
      html: (isText ? '<span style="font-weight:800;font-size:1rem;font-family:serif">A</span>' : ic('painter', 15))
    });
    main.classList.add('we-colorbtn');
    const bar = el('span', 'we-colorbar'); bar.style.background = isText ? lastTextColor : lastHiColor;
    main.append(bar);
    colorBars[kind] = bar;
    const arrow = btn(null, 'Choose color', (e, b) => {
      saveSel();
      openPop(b, paletteContent(c => applyColor(kind, c), isText ? 'Automatic (dark)' : 'No highlight'));
    }, { html: '<span class="we-caret">&#9660;</span>' });
    arrow.style.minWidth = '16px'; arrow.style.padding = '0 3px';
    wrapper.append(main, arrow);
    return wrapper;
  }
  function applyColor(kind, c) {
    restoreSel();
    exec('styleWithCSS', true);
    if (kind === 'text') {
      const col = c || '#111827';
      if (c) { lastTextColor = c; pushRecent(c); colorBars.text.style.background = c; }
      exec('foreColor', col);
    } else {
      if (c) { lastHiColor = c; pushRecent(c); colorBars.hi.style.background = c; }
      exec('hiliteColor', c || 'transparent');
    }
    afterChange();
  }

  /* ------------------------------------------------------------------ */
  /* Commands                                                            */
  /* ------------------------------------------------------------------ */
  function setFontSize(px) {
    restoreSel();
    selectWordIfCollapsed();
    exec('styleWithCSS', false);
    exec('fontSize', '7');
    exec('styleWithCSS', true);
    doc.querySelectorAll('font[size="7"]').forEach(f => {
      const sp = el('span'); sp.style.fontSize = px + 'px';
      while (f.firstChild) sp.append(f.firstChild);
      f.replaceWith(sp);
    });
    // flatten nested font-size spans
    doc.querySelectorAll('span[style*="font-size"] span[style*="font-size"]').forEach(inner => {
      const outer = inner.parentElement;
      if (outer && outer.childNodes.length === 1) { outer.style.fontSize = inner.style.fontSize; outer.replaceChildren(...inner.childNodes); }
    });
    saveSel();
  }
  function stepFontSize(dir) {
    const a = anchorEl(); if (!a) return;
    const cur = Math.round(parseFloat(getComputedStyle(a).fontSize)) || 16;
    let idx = SIZES.findIndex(s => s >= cur);
    if (dir > 0) idx = SIZES[idx] === cur ? idx + 1 : idx; else idx = idx <= 0 ? 0 : idx - 1;
    setFontSize(SIZES[Math.max(0, Math.min(SIZES.length - 1, idx))]);
  }
  function currentBlock() { return up(anchorEl(), 'p,h1,h2,h3,h4,h5,h6,li,blockquote,pre,div'); }
  function unwrap(node) {
    const p = node.parentNode;
    while (node.firstChild) p.insertBefore(node.firstChild, node);
    node.remove();
  }
  function applyStyle(name) {
    restoreSel();
    const bq = up(anchorEl(), 'blockquote');
    if (bq && name !== 'quote') {
      const kids = bq.querySelector('footer'); if (kids) kids.remove();
      unwrap(bq);
    }
    const map = { normal: 'p', h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', title: 'h1', subtitle: 'p', quote: 'blockquote', code: 'pre' };
    document.execCommand('formatBlock', false, '<' + (map[name] || 'p') + '>');
    saveSel();
    const b = currentBlock();
    if (b) {
      b.classList.remove('doc-title', 'doc-subtitle', 'doc-code');
      if (name === 'title') b.classList.add('doc-title');
      if (name === 'subtitle') b.classList.add('doc-subtitle');
      if (name === 'code') b.classList.add('doc-code');
      if (!b.classList.length) b.removeAttribute('class');
    }
  }
  function setBlockStyle(prop, val) {
    selectedBlocks().forEach(b => { b.style[prop] = val; });
  }
  function transformCase(kind) {
    restoreSel();
    const s = window.getSelection();
    if (s.isCollapsed) selectWordIfCollapsed();
    const t = s.toString();
    if (!t) return;
    let out = t;
    if (kind === 'upper') out = t.toUpperCase();
    else if (kind === 'lower') out = t.toLowerCase();
    else if (kind === 'title') out = t.toLowerCase().replace(/\b\p{L}/gu, c => c.toUpperCase());
    else if (kind === 'sentence') out = t.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
    document.execCommand('insertText', false, out);
  }
  function insertHtml(html) {
    restoreSel();
    document.execCommand('insertHTML', false, html);
    saveSel();
    CD.renderMath(doc);
    afterChange();
  }
  function clearFormatting() {
    restoreSel();
    exec('removeFormat');
    exec('unlink');
    const s = window.getSelection();
    if (s.rangeCount) {
      const r = s.getRangeAt(0);
      doc.querySelectorAll('span[style]').forEach(sp => { try { if (r.intersectsNode(sp)) { sp.removeAttribute('style'); } } catch (e) { /* ignore */ } });
    }
    selectedBlocks().forEach(b => { b.removeAttribute('style'); });
    applyStyle('normal');
  }

  /* -- Links -- */
  function openLinkDialog() {
    saveSel();
    const a = up(anchorEl(), 'a');
    const sel = savedRange ? savedRange.toString() : '';
    dialog({
      title: a ? 'Edit link' : 'Insert link',
      ok: 'Apply',
      fields: [
        { id: 'text', label: 'Text to display', value: a ? a.textContent : sel },
        { id: 'url', label: 'Web address (URL)', type: 'url', value: a ? a.getAttribute('href') : 'https://', placeholder: 'https://example.com' },
        { id: 'blank', label: 'Open in a new tab', type: 'checkbox', value: a ? a.getAttribute('target') === '_blank' : true }
      ],
      onOk: v => {
        let url = v.url.trim();
        if (!url || url === 'https://') { toast('Please enter a web address', 'error'); return false; }
        if (!/^(https?:|mailto:|tel:|#|\/)/i.test(url)) url = 'https://' + url;
        restoreSel();
        if (a) {
          a.setAttribute('href', url);
          if (v.text.trim()) a.textContent = v.text.trim();
          v.blank ? a.setAttribute('target', '_blank') : a.removeAttribute('target');
        } else {
          const label = v.text.trim() || url;
          document.execCommand('insertHTML', false, '<a href="' + esc(url) + '"' + (v.blank ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + esc(label) + '</a>');
        }
        afterChange();
      }
    });
  }

  /* -- Images -- */
  async function uploadFile(file) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) throw new Error(data.details || data.error || 'Upload failed');
    return data.url;
  }
  function fileToDataUrl(file) {
    return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
  }
  function figureHtml(url, alt, caption, width, align) {
    const st = width && width !== 'auto' ? ' style="width:' + width + '%"' : '';
    const cls = 'doc-figure' + (align && align !== 'center' ? ' doc-align-' + align : '');
    return '<figure class="' + cls + '"><img src="' + esc(url) + '" alt="' + esc(alt || '') + '"' + st + '>' + (caption ? '<figcaption>' + esc(caption) + '</figcaption>' : '') + '</figure><p><br></p>';
  }
  async function insertImageFile(file) {
    try {
      toast('Uploading image...', 'info');
      let url;
      try { url = await uploadFile(file); } catch (e) {
        if (file.size > 250000) throw e;
        url = await fileToDataUrl(file);
      }
      insertHtml(figureHtml(url, file.name.replace(/\.[^.]+$/, ''), '', '75', 'center'));
    } catch (err) {
      toast('Image upload failed: ' + err.message, 'error');
    }
  }
  function openImageDialog() {
    saveSel();
    dialog({
      title: 'Insert picture',
      ok: 'Insert',
      fields: [
        { id: 'file', label: 'Upload from your computer', type: 'file', accept: 'image/*', hint: 'Uploads to your institute storage (R2). Or paste an image address below.',
          onFile: async (file, say, inputs) => {
            say('Uploading...');
            try { const u = await uploadFile(file); inputs.url.value = u; say('Uploaded successfully.'); }
            catch (e) { say('Upload failed: ' + e.message + ' — you can paste an image URL instead.'); }
          } },
        { id: 'url', label: 'Image address (URL)', type: 'url', placeholder: 'https://...' },
        { id: 'alt', label: 'Alternative text (for accessibility)', placeholder: 'Describe the image' },
        { id: 'caption', label: 'Caption (optional)' },
        { id: 'width', label: 'Size', type: 'select', value: '75', options: [['auto', 'Original'], ['25', 'Small (25%)'], ['50', 'Medium (50%)'], ['75', 'Large (75%)'], ['100', 'Full width']] },
        { id: 'align', label: 'Alignment', type: 'select', value: 'center', options: [['center', 'Center'], ['left', 'Float left (text wraps)'], ['right', 'Float right (text wraps)']] }
      ],
      onOk: async (v, api) => {
        let url = v.url.trim();
        if (!url && v.file) {
          try { url = await uploadFile(v.file); } catch (e) { url = await fileToDataUrl(v.file); }
        }
        if (!url) { toast('Choose a file or paste an image address', 'error'); return false; }
        insertHtml(figureHtml(url, v.alt, v.caption, v.width, v.align));
      }
    });
  }

  /* -- Video / audio -- */
  function videoEmbed(url) {
    url = (url || '').trim();
    let m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{6,})/i);
    if (m) return 'https://www.youtube-nocookie.com/embed/' + m[1];
    m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    if (m) return 'https://player.vimeo.com/video/' + m[1];
    return null;
  }
  function openVideoDialog() {
    saveSel();
    dialog({
      title: 'Insert online video', ok: 'Insert',
      fields: [{ id: 'url', label: 'YouTube or Vimeo link', type: 'url', placeholder: 'https://www.youtube.com/watch?v=...' }],
      onOk: v => {
        const src = videoEmbed(v.url);
        if (!src) { toast('Only YouTube and Vimeo links are supported', 'error'); return false; }
        insertHtml('<div class="doc-video"><iframe src="' + src + '" allowfullscreen frameborder="0"></iframe></div><p><br></p>');
      }
    });
  }
  function openAudioDialog() {
    saveSel();
    dialog({
      title: 'Insert audio / music', ok: 'Insert',
      fields: [
        { id: 'url', label: 'Audio file address (mp3, wav, ogg)', type: 'url', placeholder: 'https://.../track.mp3' },
        { id: 'title', label: 'Title / caption', placeholder: 'Soundtrack: ...' }
      ],
      onOk: v => {
        if (!/^https?:\/\//i.test(v.url.trim())) { toast('Enter a valid audio address', 'error'); return false; }
        insertHtml('<div class="doc-audio"><p><strong>' + esc(v.title || 'Audio') + '</strong></p><audio controls preload="none" src="' + esc(v.url.trim()) + '"></audio></div><p><br></p>');
      }
    });
  }

  /* -- Tables -- */
  function tableHtml(r, c) {
    let h = '<table class="doc-table doc-table-grid"><tbody>';
    for (let i = 0; i < r; i++) {
      h += '<tr>';
      for (let j = 0; j < c; j++) h += (i === 0 ? '<th><br></th>' : '<td><br></td>');
      h += '</tr>';
    }
    return h + '</tbody></table><p><br></p>';
  }
  function tableGridPicker(anchor) {
    saveSel();
    const box = el('div');
    const grid = el('div', 'we-grid-pick');
    const label = el('div', 'we-grid-label', 'Insert table');
    const cells = [];
    for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
      const cell = el('div', 'we-grid-cell'); cell.dataset.r = r + 1; cell.dataset.c = c + 1;
      cell.addEventListener('mouseover', () => {
        cells.forEach(x => x.classList.toggle('on', +x.dataset.r <= r + 1 && +x.dataset.c <= c + 1));
        label.textContent = (r + 1) + ' x ' + (c + 1) + ' table';
      });
      cell.addEventListener('click', () => { closePop(); insertHtml(tableHtml(r + 1, c + 1)); });
      cells.push(cell); grid.append(cell);
    }
    box.append(grid, label);
    const custom = el('div', 'we-menu-item', '<span>Custom size...</span>');
    custom.addEventListener('click', () => {
      closePop();
      dialog({ title: 'Insert table', ok: 'Insert', fields: [
        { id: 'r', label: 'Rows', type: 'number', value: 3 }, { id: 'c', label: 'Columns', type: 'number', value: 3 }
      ], onOk: v => { insertHtml(tableHtml(Math.max(1, Math.min(50, +v.r || 3)), Math.max(1, Math.min(12, +v.c || 3)))); } });
    });
    box.append(custom);
    openPop(anchor, box);
  }
  const curCell = () => up(anchorEl(), 'td,th');
  const curTable = () => up(anchorEl(), 'table');
  function newCellLike(tag) { const c = document.createElement(tag); c.innerHTML = '<br>'; return c; }
  function tableOp(op) {
    restoreSel();
    const cell = curCell(), table = curTable();
    if (!cell || !table) { toast('Place the cursor inside a table first', 'info'); return; }
    const tr = cell.parentElement;
    const idx = cell.cellIndex;
    if (op === 'rowAbove' || op === 'rowBelow') {
      const nr = tr.cloneNode(false);
      Array.from(tr.cells).forEach(c => { for (let k = 0; k < (c.colSpan || 1); k++) nr.append(newCellLike('td')); });
      op === 'rowAbove' ? tr.before(nr) : tr.after(nr);
    } else if (op === 'colLeft' || op === 'colRight') {
      Array.from(table.rows).forEach(r => {
        const ref = r.cells[Math.min(idx, r.cells.length - 1)];
        const nc = newCellLike(ref ? ref.tagName.toLowerCase() : 'td');
        if (!ref) r.append(nc); else op === 'colLeft' ? ref.before(nc) : ref.after(nc);
      });
    } else if (op === 'delRow') {
      if (table.rows.length === 1) table.remove(); else tr.remove();
    } else if (op === 'delCol') {
      Array.from(table.rows).forEach(r => { if (r.cells[idx]) r.cells[idx].remove(); });
      if (!table.rows[0] || !table.rows[0].cells.length) table.remove();
    } else if (op === 'delTable') {
      table.remove();
    } else if (op === 'mergeRight') {
      const nx = cell.nextElementSibling;
      if (!nx) { toast('No cell to the right to merge with', 'info'); return; }
      cell.colSpan = (cell.colSpan || 1) + (nx.colSpan || 1);
      if (nx.textContent.trim()) cell.innerHTML = (cell.textContent.trim() ? cell.innerHTML.replace(/<br>$/, '') + ' ' : '') + nx.innerHTML;
      nx.remove();
    } else if (op === 'split') {
      if ((cell.colSpan || 1) > 1) {
        const extra = newCellLike(cell.tagName.toLowerCase());
        extra.colSpan = cell.colSpan - 1; cell.colSpan = 1; cell.after(extra);
        if (extra.colSpan === 1) extra.removeAttribute('colspan');
        cell.removeAttribute('colspan');
      }
    } else if (op === 'header') {
      const first = table.rows[0];
      const makeTh = first.cells[0].tagName !== 'TH';
      Array.from(first.cells).forEach(c => {
        const n = document.createElement(makeTh ? 'th' : 'td');
        n.innerHTML = c.innerHTML; Array.from(c.attributes).forEach(a => n.setAttribute(a.name, a.value));
        c.replaceWith(n);
      });
    }
    afterChange();
  }
  function cellsInSelection() {
    const s = window.getSelection();
    if (!s.rangeCount) return [];
    const r = s.getRangeAt(0);
    const all = Array.from(doc.querySelectorAll('td,th')).filter(c => { try { return r.intersectsNode(c); } catch (e) { return false; } });
    if (all.length > 1) return all;
    const c = curCell(); return c ? [c] : [];
  }

  /* -- Images context -- */
  function selectImage(img) {
    if (selImg) selImg.classList.remove('we-selected');
    selImg = img;
    if (img) img.classList.add('we-selected');
    updateCtx();
  }
  function imageOp(op, val) {
    if (!selImg) return;
    const img = selImg;
    let fig = img.closest('figure.doc-figure');
    const ensureFig = () => {
      if (!fig) { fig = el('figure', 'doc-figure'); img.replaceWith(fig); fig.append(img); }
      return fig;
    };
    if (op === 'width') { val === 'auto' ? img.style.removeProperty('width') : (img.style.width = val + '%'); }
    else if (op === 'align') {
      ensureFig();
      fig.classList.remove('doc-align-left', 'doc-align-right');
      if (val !== 'center') fig.classList.add('doc-align-' + val);
    } else if (op === 'alt') {
      dialog({ title: 'Alternative text', ok: 'Save', fields: [{ id: 'alt', label: 'Describe this picture for screen readers', value: img.getAttribute('alt') || '' }], onOk: v => { img.setAttribute('alt', v.alt); afterChange(); } });
    } else if (op === 'caption') {
      ensureFig();
      const cap = fig.querySelector('figcaption');
      if (cap) cap.remove(); else { const c = el('figcaption', '', 'Caption'); fig.append(c); }
    } else if (op === 'delete') {
      (fig || img).remove(); selImg = null; updateCtx();
    }
    afterChange();
  }

  /* -- Equations -- */
  function openEquationDialog(inline, existing) {
    saveSel();
    dialog({
      title: existing ? 'Edit equation' : (inline ? 'Insert inline equation' : 'Insert equation'), ok: existing ? 'Update' : 'Insert', wide: true,
      fields: [
        { id: 'tex', label: 'LaTeX expression', type: 'textarea', value: existing ? existing.getAttribute('data-latex') : '', placeholder: 'E = mc^2   or   \\frac{a}{b}   or   \\sum_{i=1}^{n} x_i' ,
          hint: 'Examples: \\alpha + \\beta, \\sqrt{x^2+y^2}, \\int_0^\\infty e^{-x}\\,dx, \\Delta G = \\Delta H - T\\Delta S' }
      ],
      onOk: v => {
        const tex = v.tex.trim();
        if (!tex) { toast('Type a LaTeX expression', 'error'); return false; }
        if (existing) { existing.setAttribute('data-latex', tex); existing.innerHTML = ''; CD.renderMath(doc); afterChange(); return; }
        if (inline) insertHtml('<span class="doc-equation doc-eq-inline" data-latex="' + esc(tex) + '" contenteditable="false"></span>&nbsp;');
        else insertHtml('<div class="doc-equation" data-latex="' + esc(tex) + '" contenteditable="false"></div><p><br></p>');
      }
    });
  }

  /* -- Symbols -- */
  const SYMBOLS = '© ® ™ ° ± × ÷ ≤ ≥ ≠ ≈ ∞ √ ∑ ∏ ∫ ∂ ∆ ∇ π μ Ω α β γ δ ε θ λ σ τ φ ψ ω → ← ↑ ↓ ↔ ⇒ ⇔ ∈ ∉ ⊂ ⊆ ∪ ∩ ∀ ∃ ∴ ∵ ‰ § ¶ † ‡ • … – — ‘ ’ “ ” « » ¼ ½ ¾ ¹ ² ³ ⁴ € £ ¥ ¢ ₹ ₿ ★ ☆ ✓ ✗ ♠ ♣ ♥ ♦ ☀ ☁ ☂ ♀ ♂ ⚛ ☢'.split(' ');
  function symbolPicker(anchor) {
    saveSel();
    const box = el('div', 'we-symbols');
    SYMBOLS.forEach(s => {
      const b = el('button', '', s); b.type = 'button';
      b.addEventListener('click', () => { closePop(); restoreSel(); document.execCommand('insertText', false, s); afterChange(); });
      box.append(b);
    });
    openPop(anchor, box);
  }

  /* -- Callouts & other building blocks -- */
  function insertCallout(kind, label) {
    insertHtml('<div class="doc-callout doc-callout-' + kind + '" data-callout="' + kind + '"><p><strong>' + label + '</strong></p><p>Type your ' + label.toLowerCase() + ' here...</p></div><p><br></p>');
  }
  function insertCodeBlock() {
    insertHtml('<pre class="doc-code"><code>// Paste or type your code here</code></pre><p><br></p>');
  }
  function insertQuote() {
    saveSel();
    dialog({ title: 'Insert quotation', ok: 'Insert', fields: [
      { id: 'q', label: 'Quotation', type: 'textarea', value: (savedRange ? savedRange.toString() : '') },
      { id: 'a', label: 'Attribution (optional)', placeholder: 'Author / source' }
    ], onOk: v => {
      if (!v.q.trim()) return false;
      insertHtml('<blockquote><p>' + esc(v.q.trim()) + '</p>' + (v.a.trim() ? '<footer>— ' + esc(v.a.trim()) + '</footer>' : '') + '</blockquote><p><br></p>');
    } });
  }
  function insertTimeline() {
    saveSel();
    dialog({ title: 'Insert timeline entry', ok: 'Insert', fields: [
      { id: 'd', label: 'Date / label', placeholder: 'e.g. March 2026', value: '' },
      { id: 't', label: 'Description', type: 'textarea' }
    ], onOk: v => { insertHtml('<div class="doc-timeline"><strong>' + esc(v.d || 'Date') + '</strong><p>' + esc(v.t || 'Description') + '</p></div><p><br></p>'); } });
  }
  function insertTOC() {
    const heads = Array.from(doc.querySelectorAll('h1,h2,h3')).filter(h => !h.closest('.doc-toc'));
    if (!heads.length) { toast('Add some headings first, then insert a table of contents', 'info'); return; }
    let n = 0;
    const items = heads.map(h => {
      if (!h.id || !/^doc-h-/.test(h.id)) h.id = 'doc-h-' + (++n) + '-' + Math.random().toString(36).slice(2, 6);
      return '<li class="doc-toc-l' + h.tagName[1] + '"><a href="#' + h.id + '">' + esc(h.textContent.trim()) + '</a></li>';
    }).join('');
    doc.querySelectorAll('.doc-toc').forEach(t => t.remove());
    insertHtml('<nav class="doc-toc"><div class="doc-toc-title">Table of Contents</div><ul>' + items + '</ul></nav><p><br></p>');
  }
  function wrapColumns(n) {
    restoreSel();
    const r = window.getSelection().rangeCount ? window.getSelection().getRangeAt(0) : null;
    if (!r) return;
    const kids = Array.from(doc.children).filter(c => { try { return r.intersectsNode(c); } catch (e) { return false; } });
    if (!kids.length) return;
    const existing = kids.length === 1 && kids[0].classList.contains('doc-columns') ? kids[0] : null;
    if (existing) {
      if (n === 1) { unwrap(existing); return; }
      existing.classList.remove('doc-cols-2', 'doc-cols-3'); existing.classList.add('doc-cols-' + n); return;
    }
    if (n === 1) return;
    const box = el('div', 'doc-columns doc-cols-' + n);
    kids[0].before(box);
    kids.forEach(k => box.append(k));
  }

  /* ------------------------------------------------------------------ */
  /* File: templates / import / export                                   */
  /* ------------------------------------------------------------------ */
  const TEMPLATES = {
    paper: {
      name: 'Research paper',
      html: '<h1 class="doc-title">Title of Your Research Paper</h1><p class="doc-subtitle">Author names &middot; CRII Division &middot; Date</p>' +
        '<div class="doc-callout doc-callout-note" data-callout="note"><p><strong>Abstract</strong></p><p>Summarise the problem, method, key results and conclusion in 150&ndash;250 words.</p></div>' +
        '<h2>1. Introduction</h2><p>Explain the background, the gap in knowledge and your research question.</p>' +
        '<h2>2. Methods</h2><p>Describe data, instruments, algorithms and how others can reproduce your work.</p>' +
        '<h2>3. Results</h2><p>Present findings with tables, figures and equations.</p>' +
        '<h2>4. Discussion</h2><p>Interpret the results, limitations and implications.</p>' +
        '<h2>5. Conclusion</h2><p>State the main takeaway and future work.</p>' +
        '<h2>References</h2><ol><li>Author, A. (2026). <em>Title</em>. Journal, 1(1), 1&ndash;10.</li></ol>'
    },
    dispatch: {
      name: 'Blog dispatch / news',
      html: '<h1 class="doc-title">Headline Goes Here</h1><p class="doc-subtitle">A short, engaging summary of the story.</p><p>Open with the most important news in a single strong paragraph.</p><h2>Why it matters</h2><p>Give context and background.</p><h2>What happens next</h2><ul><li>Next step one</li><li>Next step two</li></ul><blockquote><p>Add a memorable quote here.</p><footer>&mdash; Name, Role</footer></blockquote>'
    },
    notes: {
      name: 'Meeting / lab notes',
      html: '<h1>Meeting Notes</h1><table class="doc-table doc-table-grid"><tbody><tr><th>Date</th><th>Attendees</th><th>Topic</th></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><h2>Agenda</h2><ol><li><br></li></ol><h2>Decisions</h2><ul><li><br></li></ul><h2>Action items</h2><table class="doc-table doc-table-striped"><tbody><tr><th>Task</th><th>Owner</th><th>Due</th></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table>'
    },
    tutorial: {
      name: 'Tutorial / how-to',
      html: '<h1 class="doc-title">How to ...</h1><p class="doc-subtitle">What you will learn and what you need.</p><div class="doc-callout doc-callout-tip" data-callout="tip"><p><strong>Tip</strong></p><p>List prerequisites here.</p></div><h2>Step 1</h2><p>Describe the first step.</p><pre class="doc-code"><code>// code example</code></pre><h2>Step 2</h2><p>Describe the second step.</p><div class="doc-callout doc-callout-warning" data-callout="warning"><p><strong>Warning</strong></p><p>Mention common mistakes.</p></div>'
    }
  };
  function setHtml(html) {
    doc.innerHTML = html && html.trim() ? html : '<p><br></p>';
    CD.renderMath(doc);
    selImg = null;
    updateStatus(); updateNav(); updateCtx();
  }
  function applyTemplate(key) {
    if (!isEmpty() && !confirm('This replaces everything currently in the document. Continue?')) return;
    setHtml(TEMPLATES[key].html);
    dirty = true; scheduleAutosave();
  }
  function loadMammoth() {
    if (window.mammoth) return Promise.resolve();
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js';
      s.onload = res; s.onerror = () => rej(new Error('Could not load Word import library (check your internet connection)'));
      document.head.appendChild(s);
    });
  }
  function openDocxDialog() {
    saveSel();
    const inp = el('input'); inp.type = 'file'; inp.accept = '.docx';
    inp.addEventListener('change', async () => {
      const file = inp.files[0]; if (!file) return;
      try {
        toast('Importing Word document...', 'info');
        await loadMammoth();
        const buf = await file.arrayBuffer();
        const result = await window.mammoth.convertToHtml({ arrayBuffer: buf }, {
          convertImage: window.mammoth.images.imgElement(async image => {
            const b64 = await image.read('base64');
            const blob = await (await fetch('data:' + image.contentType + ';base64,' + b64)).blob();
            const f = new File([blob], 'word-image.' + (image.contentType.split('/')[1] || 'png'), { type: image.contentType });
            try { return { src: await uploadFile(f) }; } catch (e) { return { src: 'data:' + image.contentType + ';base64,' + b64 }; }
          })
        });
        const html = CD.sanitize(result.value);
        if (isEmpty() || confirm('Replace the current document with the imported Word file? (Cancel = insert at cursor)')) setHtml(html);
        else insertHtml(html);
        dirty = true; scheduleAutosave();
        toast('Word document imported', 'success');
      } catch (e) { toast('Import failed: ' + e.message, 'error'); }
    });
    inp.click();
  }
  function fullHtmlDocument(inner, title) {
    return '<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>' + esc(title) + '</title><style>' +
      'body{font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.5;color:#111;max-width:800px;margin:2cm auto}' +
      'table{border-collapse:collapse;width:100%}td,th{border:1px solid #999;padding:6px}th{background:#eef}' +
      'blockquote{border-left:4px solid #2563eb;padding-left:12px;font-style:italic}pre{background:#f1f5f9;padding:10px;white-space:pre-wrap}' +
      '.doc-callout{border-left:4px solid #2563eb;background:#eff6ff;padding:8px 14px}img{max-width:100%}.doc-title{text-align:center;font-size:26pt}.doc-subtitle{text-align:center;color:#555}' +
      '</style></head><body>' + inner + '</body></html>';
  }
  function download(filename, mime, content) {
    const blob = new Blob([content], { type: mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.append(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  const docTitle = () => (document.getElementById('bloggerTitleInput') || {}).value || 'article';
  const fileSafe = s => (s || 'article').trim().replace(/[^\w\- ]+/g, '').replace(/\s+/g, '-').slice(0, 60) || 'article';
  function exportWord() { download(fileSafe(docTitle()) + '.doc', 'application/msword', fullHtmlDocument(getCleanHtml(), docTitle())); }
  function exportHtml() { download(fileSafe(docTitle()) + '.html', 'text/html', fullHtmlDocument(getCleanHtml(), docTitle())); }
  function printDoc() {
    const w = window.open('', '_blank');
    if (!w) { toast('Allow pop-ups to print / save as PDF', 'error'); return; }
    w.document.write(fullHtmlDocument('<h1 style="text-align:center">' + esc(docTitle()) + '</h1>' + getCleanHtml(), docTitle()));
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 500);
  }

  /* ------------------------------------------------------------------ */
  /* Review tools                                                        */
  /* ------------------------------------------------------------------ */
  function plainText() {
    const c = doc.cloneNode(true);
    c.querySelectorAll('.doc-equation,.doc-toc').forEach(e => e.remove());
    c.querySelectorAll('p,h1,h2,h3,h4,h5,h6,li,td,th,blockquote,pre,div,br,figcaption').forEach(b => b.after(document.createTextNode(' ')));
    return c.textContent.replace(/\u200b/g, '').replace(/\u00a0/g, ' ');
  }
  const wordCount = () => { const t = plainText().trim(); return t ? t.split(/\s+/).length : 0; };
  const isEmpty = () => !wordCount() && !doc.querySelector('img,table,iframe,audio,hr,.doc-equation');

  function showWordCount() {
    const t = plainText().trim();
    const words = t ? t.split(/\s+/).length : 0;
    const paras = doc.querySelectorAll('p,li,h1,h2,h3,h4,h5,h6,blockquote').length;
    const sentences = (t.match(/[.!?]+(\s|$)/g) || []).length;
    const d = dialog({ title: 'Word count', ok: false, fields: [{ type: 'html', html:
      '<div class="we-stat-grid">' +
      '<div class="we-stat"><b>' + words + '</b>Words</div>' +
      '<div class="we-stat"><b>' + t.length + '</b>Characters (with spaces)</div>' +
      '<div class="we-stat"><b>' + t.replace(/\s/g, '').length + '</b>Characters (no spaces)</div>' +
      '<div class="we-stat"><b>' + paras + '</b>Paragraphs</div>' +
      '<div class="we-stat"><b>' + sentences + '</b>Sentences</div>' +
      '<div class="we-stat"><b>' + Math.max(1, Math.ceil(words / 200)) + ' min</b>Reading time</div></div>' }] });
    return d;
  }
  function accessibilityCheck() {
    const issues = [];
    doc.querySelectorAll('img').forEach(i => { if (!(i.getAttribute('alt') || '').trim()) issues.push('A picture has no alternative text. Select it and use Picture Tools → Alt text.'); });
    let prev = 0;
    doc.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => {
      const lvl = +h.tagName[1];
      if (!h.textContent.trim()) issues.push('There is an empty ' + h.tagName + ' heading.');
      if (prev && lvl > prev + 1) issues.push('Heading level skips from H' + prev + ' to H' + lvl + ': "' + h.textContent.trim().slice(0, 40) + '".');
      prev = lvl;
    });
    doc.querySelectorAll('a').forEach(a => { if (!a.textContent.trim()) issues.push('A link has no text.'); if (/^(click here|here|link)$/i.test(a.textContent.trim())) issues.push('Link text "' + a.textContent.trim() + '" is not descriptive.'); });
    doc.querySelectorAll('table').forEach(t => { if (!t.querySelector('th')) issues.push('A table has no header row (Table Tools → Header row).'); });
    dialog({ title: 'Accessibility checker', ok: false, fields: [{ type: 'html', html: issues.length
      ? issues.map(i => '<div class="we-issue">' + esc(i) + '</div>').join('')
      : '<div class="we-issue ok">No accessibility problems found. Nice work!</div>' }] });
  }
  function readAloud() {
    if (!('speechSynthesis' in window)) { toast('Read aloud is not supported in this browser', 'error'); return; }
    if (readingAloud) { speechSynthesis.cancel(); readingAloud = false; toast('Stopped reading', 'info'); return; }
    const sel = window.getSelection().toString().trim();
    const u = new SpeechSynthesisUtterance(sel || plainText());
    u.onend = u.onerror = () => { readingAloud = false; };
    readingAloud = true; speechSynthesis.speak(u);
    toast('Reading aloud... click again to stop', 'info');
  }

  /* -- Find & replace -- */
  function buildFindPanel() {
    findPanel = el('div', 'we-find');
    findPanel.innerHTML =
      '<input type="text" class="we-f-q" placeholder="Find"><input type="text" class="we-f-r" placeholder="Replace with">' +
      '<div class="we-find-row"><label style="font-size:.76rem;display:flex;align-items:center;gap:4px"><input type="checkbox" class="we-f-case"> Match case</label><span class="we-find-count"></span></div>' +
      '<div class="we-find-row"><button type="button" data-a="prev">Previous</button><button type="button" data-a="next">Next</button><button type="button" data-a="rep">Replace</button><button type="button" data-a="all">Replace all</button><button type="button" data-a="close">Close</button></div>';
    const q = findPanel.querySelector('.we-f-q'), r = findPanel.querySelector('.we-f-r'), cs = findPanel.querySelector('.we-f-case'), cnt = findPanel.querySelector('.we-find-count');
    const inDocSel = () => { const s = window.getSelection(); return s.rangeCount && doc.contains(s.anchorNode); };
    const countMatches = () => {
      if (!q.value) { cnt.textContent = ''; return; }
      const re = new RegExp(q.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), cs.checked ? 'g' : 'gi');
      cnt.textContent = (plainText().match(re) || []).length + ' match(es)';
    };
    const findNext = back => {
      if (!q.value) return;
      if (!inDocSel()) { const rg = document.createRange(); rg.selectNodeContents(doc); rg.collapse(!back); const s = window.getSelection(); s.removeAllRanges(); s.addRange(rg); }
      let ok = false, tries = 0;
      do { ok = window.find(q.value, cs.checked, !!back, true, false, false, false); tries++; } while (ok && !inDocSel() && tries < 60);
      if (ok && inDocSel()) { saveSel(); const a = anchorEl(); if (a) a.scrollIntoView({ block: 'center', behavior: 'smooth' }); } else cnt.textContent = 'No matches';
    };
    findPanel.addEventListener('click', e => {
      const a = e.target.dataset && e.target.dataset.a;
      if (!a) return;
      if (a === 'close') findPanel.classList.remove('show');
      else if (a === 'next') findNext(false);
      else if (a === 'prev') findNext(true);
      else if (a === 'rep') {
        restoreSel();
        const s = window.getSelection();
        if (s.toString() && (cs.checked ? s.toString() === q.value : s.toString().toLowerCase() === q.value.toLowerCase())) { document.execCommand('insertText', false, r.value); afterChange(); }
        findNext(false); countMatches();
      } else if (a === 'all') {
        if (!q.value) return;
        const rg = document.createRange(); rg.selectNodeContents(doc); rg.collapse(true);
        const s = window.getSelection(); s.removeAllRanges(); s.addRange(rg);
        doc.focus();
        let n = 0;
        while (n < 2000 && window.find(q.value, cs.checked, false, false, false, false, false)) {
          if (!inDocSel()) break;
          document.execCommand('insertText', false, r.value); n++;
        }
        toast(n + ' replacement(s) made', 'success'); afterChange(); countMatches();
      }
    });
    q.addEventListener('input', countMatches);
    cs.addEventListener('change', countMatches);
    q.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); findNext(e.shiftKey); } });
    findPanel.addEventListener('keydown', e => { if (e.key === 'Escape') findPanel.classList.remove('show'); });
    return findPanel;
  }
  function openFind(focusReplace) {
    saveSel();
    findPanel.classList.add('show');
    const s = window.getSelection().toString();
    const q = findPanel.querySelector('.we-f-q');
    if (s && s.length < 80) q.value = s;
    (focusReplace ? findPanel.querySelector('.we-f-r') : q).focus();
    q.dispatchEvent(new Event('input'));
  }

  /* ------------------------------------------------------------------ */
  /* Navigation pane, status, state                                      */
  /* ------------------------------------------------------------------ */
  function updateNav() {
    if (!navEl) return;
    const heads = Array.from(doc.querySelectorAll('h1,h2,h3'));
    navEl.innerHTML = '<h4>Navigation</h4>' + (heads.length ? '' : '<div style="font-size:.8rem;color:var(--text-muted)">Add headings (Home → Styles) to build your outline.</div>');
    heads.forEach(h => {
      const a = el('a', 'l' + h.tagName[1], esc(h.textContent.trim() || '(empty heading)'));
      a.addEventListener('click', () => { h.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      navEl.append(a);
    });
  }
  function updateStatus() {
    if (!statusEl) return;
    const w = wordCount();
    statusEl.querySelector('.we-st-words').textContent = w + ' word' + (w === 1 ? '' : 's');
    statusEl.querySelector('.we-st-chars').textContent = plainText().trim().length + ' characters';
    statusEl.querySelector('.we-st-read').textContent = Math.max(1, Math.ceil(w / 200)) + ' min read';
    const badge = document.getElementById('bloggerReadTimeBadge');
    if (badge && mode === 'doc') badge.textContent = Math.max(1, Math.ceil(w / 180)) + ' min read';
  }
  function updateCtx() {
    const showT = !!curCell();
    const showI = !!selImg && doc.contains(selImg);
    ctxTabs.table.classList.toggle('show', showT);
    ctxTabs.image.classList.toggle('show', showI);
    if ((!showT && activeTab === 'table') || (!showI && activeTab === 'image')) showTab('home');
  }
  function updateState() {
    if (!mounted || mode !== 'doc') return;
    stateBtns.forEach(o => { let on = false; try { on = document.queryCommandState(o.cmd); } catch (e) { /* ignore */ } o.b.classList.toggle('active', !!on); });
    const a = anchorEl();
    if (a) {
      const cs = getComputedStyle(a);
      const fam = (cs.fontFamily || '').split(',')[0].replace(/["']/g, '').trim().toLowerCase();
      const f = FONTS.find(x => x[1] && x[1].split(',')[0].replace(/["']/g, '').trim().toLowerCase() === fam);
      ctlFont.value = f ? f[1] : '';
      const px = Math.round(parseFloat(cs.fontSize));
      ctlSize.value = SIZES.includes(px) ? String(px) : '';
      const blk = up(a, 'h1,h2,h3,h4,blockquote,pre,p,li');
      let st = 'normal';
      if (blk) {
        if (blk.classList.contains('doc-title')) st = 'title';
        else if (blk.classList.contains('doc-subtitle')) st = 'subtitle';
        else if (/^H[1-4]$/.test(blk.tagName)) st = blk.tagName.toLowerCase();
        else if (blk.tagName === 'BLOCKQUOTE' || up(a, 'blockquote')) st = 'quote';
        else if (blk.tagName === 'PRE') st = 'code';
      }
      ctlStyle.value = st;
    }
    updateCtx();
  }
  function afterChange() {
    dirty = true;
    scheduleAutosave();
    clearTimeout(statusTimer); statusTimer = setTimeout(updateStatus, 180);
    clearTimeout(navTimer); navTimer = setTimeout(updateNav, 500);
    clearTimeout(snapDebounceTimer); snapDebounceTimer = setTimeout(() => takeSnapshot('edit'), 800);
    const st = statusEl && statusEl.querySelector('.we-saved'); if (st) st.textContent = '';
  }
  function scheduleAutosave() {
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify({ html: getCleanHtml(), t: Date.now() }));
        const st = statusEl && statusEl.querySelector('.we-saved'); if (st) st.textContent = 'Draft auto-saved ' + new Date().toLocaleTimeString();
      } catch (e) { /* storage full */ }
    }, 2500);
  }

  /* ------------------------------------------------------------------ */
  /* Output                                                              */
  /* ------------------------------------------------------------------ */
  function getCleanHtml() {
    const c = doc.cloneNode(true);
    c.querySelectorAll('.doc-equation[data-latex]').forEach(e => {
      const tex = e.getAttribute('data-latex');
      e.textContent = e.classList.contains('doc-eq-inline') ? '$' + tex + '$' : '$$' + tex + '$$';
      e.removeAttribute('contenteditable');
    });
    c.querySelectorAll('.we-selected').forEach(i => i.classList.remove('we-selected'));
    c.querySelectorAll('[class=""]').forEach(n => n.removeAttribute('class'));
    c.querySelectorAll('[contenteditable]').forEach(n => n.removeAttribute('contenteditable'));
    return CD.sanitize(c.innerHTML);
  }
  function getExcerpt(n) {
    const t = plainText().replace(/\s+/g, ' ').trim();
    return t.length > n ? t.slice(0, n - 1).trim() + '…' : t;
  }

  /* ------------------------------------------------------------------ */
  /* Blocks → HTML conversion                                            */
  /* ------------------------------------------------------------------ */
  function inlineMd(t) {
    return esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*(?!\s)(.+?)\*/g, '$1<em>$2</em>').replace(/`([^`]+)`/g, '<code>$1</code>');
  }
  function blocksToHtml(blocks) {
    return (blocks || []).map(b => {
      const c = b.content || '';
      switch (b.type) {
        case 'heading': {
          const lvl = b.level || 2;
          return `<h${lvl} data-block-type="heading">${esc(c)}</h${lvl}>`;
        }
        case 'subheading':
          return `<h3 data-block-type="subheading">${esc(c)}</h3>`;
        case 'image':
          return b.url ? `<figure class="doc-figure" data-block-type="image" data-url="${esc(b.url)}"><img src="${esc(b.url)}" alt="${esc(b.caption || '')}" style="width:75%;"><figcaption class="doc-caption">${esc(b.caption || '')}</figcaption></figure><p><br></p>` : '';
        case 'code':
          return `<pre class="doc-code" data-block-type="code" data-language="${esc(b.language || 'python')}"><code class="language-${esc(b.language || 'python')}">${esc(c)}</code></pre><p><br></p>`;
        case 'quote':
          return `<blockquote class="doc-quote" data-block-type="quote" data-author="${esc(b.author || '')}"><p>${inlineMd(c)}</p>${b.author ? `<footer class="doc-citation">— ${esc(b.author)}</footer>` : ''}</blockquote><p><br></p>`;
        case 'callout': {
          const k = (b.style || 'note').toLowerCase();
          const kind = ['note', 'tip', 'warning', 'important', 'caution', 'success'].includes(k) ? k : 'note';
          const title = kind.charAt(0).toUpperCase() + kind.slice(1);
          return `<div class="doc-callout doc-callout-${kind}" data-block-type="callout" data-callout="${kind}"><p><strong>${title}</strong></p><p>${inlineMd(c)}</p></div><p><br></p>`;
        }
        case 'list': {
          const lines = c.split('\n').filter(x => x.trim());
          return `<ul class="doc-list" data-block-type="list">${lines.map(x => `<li>${inlineMd(x.replace(/^[-*]\s*/, ''))}</li>`).join('')}</ul><p><br></p>`;
        }
        case 'divider':
          return `<hr class="doc-divider" data-block-type="divider"><p><br></p>`;
        case 'video': {
          const s = videoEmbed(b.url);
          return s ? `<div class="doc-video doc-video-wrapper" data-block-type="video" data-url="${esc(b.url)}"><iframe src="${s}" allowfullscreen frameborder="0"></iframe></div><p><br></p>` : '';
        }
        case 'timeline':
          return `<div class="doc-timeline" data-block-type="timeline" data-date="${esc(b.date || 'Phase 1')}"><p><strong>${esc(b.date || 'Phase 1')}</strong></p><p>${inlineMd(c)}</p></div><p><br></p>`;
        case 'music':
          return b.url ? `<div class="doc-music-card doc-audio" data-block-type="music" data-url="${esc(b.url)}" data-content="${esc(c || '')}"><p>🎵 <strong>${esc(c || 'Research Soundtrack')}</strong></p><p><a href="${esc(b.url)}" target="_blank" rel="noopener">${esc(b.url)}</a></p>${b.opinion ? `<p class="doc-music-opinion"><em>${esc(b.opinion)}</em></p>` : ''}</div><p><br></p>` : '';
        case 'math':
          return `<div class="doc-equation" data-block-type="math" data-latex="${esc(c)}" contenteditable="false"></div><p><br></p>`;
        case 'table': {
          const rows = c.split('\n').filter(r => r.trim());
          if (rows.length === 0) return '';
          let tblHtml = '<div class="table-wrapper doc-table-wrapper" data-block-type="table"><table class="doc-table admin-table">';
          rows.forEach((row, rIdx) => {
            const cells = row.split('|').map(cell => cell.trim());
            const cellTag = rIdx === 0 ? 'th' : 'td';
            tblHtml += '<tr>' + cells.map(cell => `<${cellTag}>${inlineMd(cell)}</${cellTag}>`).join('') + '</tr>';
          });
          tblHtml += '</table></div><p><br></p>';
          return tblHtml;
        }
        case 'text':
        default:
          return c.split(/\n{2,}/).map(p => `<p data-block-type="text">${inlineMd(p).replace(/\n/g, '<br>')}</p>`).join('');
      }
    }).join('');
  }

  /* ------------------------------------------------------------------ */
  /* Build UI                                                            */
  /* ------------------------------------------------------------------ */
  function showTab(name) {
    activeTab = name;
    tabsEl.querySelectorAll('.we-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    ribbonEl.querySelectorAll('.we-panel').forEach(p => p.classList.toggle('active', p.dataset.tab === name));
  }
  function setZoom(z) {
    zoom = Math.max(50, Math.min(200, z));
    doc.style.setProperty('--we-zoom', zoom / 100);
    const r = statusEl.querySelector('.we-zoom-range'); if (r) r.value = zoom;
    const l = statusEl.querySelector('.we-zoom-label'); if (l) l.textContent = zoom + '%';
  }

  function build() {
    wrap = el('div', 'we-wrap');
    tabsEl = el('div', 'we-tabs');
    ribbonEl = el('div', 'we-ribbon');

    const tabDefs = [['file', 'File'], ['home', 'Home'], ['insert', 'Insert'], ['layout', 'Layout'], ['review', 'Review'], ['view', 'View'], ['table', 'Table Tools'], ['image', 'Picture Tools']];
    tabDefs.forEach(([k, label]) => {
      const t = el('button', 'we-tab' + (k === 'file' ? ' we-tab-file' : '') + (k === 'table' || k === 'image' ? ' we-ctx' : ''), label);
      t.type = 'button'; t.dataset.tab = k;
      t.addEventListener('mousedown', e => e.preventDefault());
      t.addEventListener('click', () => showTab(k));
      tabsEl.append(t);
      if (k === 'table' || k === 'image') ctxTabs[k] = t;
    });
    const fsBar = el('div', 'we-fs-bar');
    const fsSave = el('button', 'btn btn-primary btn-sm', 'Save & Publish'); fsSave.type = 'button';
    fsSave.addEventListener('click', () => { const b = document.getElementById('bloggerSaveBtn'); if (b) b.click(); });
    const fsExit = el('button', 'btn btn-secondary btn-sm', 'Exit focus mode'); fsExit.type = 'button';
    fsExit.addEventListener('click', toggleFullscreen);
    fsBar.append(fsSave, fsExit);
    tabsEl.append(fsBar);

    const panels = {};
    ['file', 'home', 'insert', 'layout', 'review', 'view', 'table', 'image'].forEach(k => { const p = el('div', 'we-panel'); p.dataset.tab = k; panels[k] = p; ribbonEl.append(p); });

    /* ---- FILE ---- */
    panels.file.append(
      group('New', [[
        menuBtn('template', 'Start from a template', Object.keys(TEMPLATES).map(k => ({ label: TEMPLATES[k].name, fn: () => applyTemplate(k) })), { big: true, text: 'Templates' }),
        btn('filePlus', 'Clear the document and start blank', () => { if (isEmpty() || confirm('Clear the whole document?')) { setHtml(''); afterChange(); } }, { big: true, text: 'Blank' })
      ]]),
      group('Import', [[btn('upload', 'Open a Microsoft Word (.docx) file', openDocxDialog, { big: true, text: 'Open Word file' })]]),
      group('Export & Print', [[
        btn('word', 'Download as Word document (.doc)', exportWord, { big: true, text: 'Word (.doc)' }),
        btn('download', 'Download as web page (.html)', exportHtml, { big: true, text: 'HTML' }),
        btn('printer', 'Print or save as PDF', printDoc, { big: true, text: 'Print / PDF' })
      ]]),
      group('Draft', [[btn('undoAll', 'Restore the last auto-saved draft of this article', () => restoreDraft(true), { big: true, text: 'Restore draft' })]])
    );

    /* ---- HOME ---- */
    ctlFont = select('we-font', 'Font', FONTS.map(f => [f[1], f[0]]), v => { if (v) { selectWordIfCollapsed(); exec('styleWithCSS', true); exec('fontName', v); } });
    ctlSize = select('we-size', 'Font size', [['', 'Size']].concat(SIZES.map(s => [String(s), String(s)])), v => { if (v) setFontSize(+v); });
    ctlStyle = select('we-style', 'Styles', STYLES, v => applyStyle(v));
    const painterBtn = btn('painter', 'Format Painter — copy formatting, then select text to apply', () => {
      const a = anchorEl(); if (!a) return;
      const cs = getComputedStyle(a);
      painter = { fontFamily: cs.fontFamily, fontSize: cs.fontSize, color: cs.color, bold: document.queryCommandState('bold'), italic: document.queryCommandState('italic'), underline: document.queryCommandState('underline') };
      painterBtn.classList.add('active'); toast('Format copied — now select the text to format', 'info');
    });
    panels.home.append(
      group('Clipboard', [[
        btn('paste', 'Paste as plain text (Ctrl+Shift+V)', async () => { try { const t = await navigator.clipboard.readText(); restoreSel(); document.execCommand('insertText', false, t); afterChange(); } catch (e) { toast('Use Ctrl+V to paste (browser blocked clipboard access)', 'info'); } }, { text: 'Paste' }),
        cmdBtn('cut', 'Cut (Ctrl+X)', 'cut'), cmdBtn('copy', 'Copy (Ctrl+C)', 'copy'), painterBtn
      ]]),
      group('Undo', [[cmdBtn('undo', 'Undo (Ctrl+Z)', 'undo'), cmdBtn('redo', 'Redo (Ctrl+Y)', 'redo')]]),
      group('Font', [
        [ctlFont, ctlSize, btn(null, 'Increase font size', () => stepFontSize(1), { html: '<b style="font-size:.95rem">A<sup>+</sup></b>' }), btn(null, 'Decrease font size', () => stepFontSize(-1), { html: '<b style="font-size:.8rem">A<sup>−</sup></b>' })],
        [fmtBtn('<b>B</b>', 'Bold (Ctrl+B)', 'bold'), fmtBtn('<i>I</i>', 'Italic (Ctrl+I)', 'italic'), fmtBtn('<u>U</u>', 'Underline (Ctrl+U)', 'underline'), fmtBtn('<s>S</s>', 'Strikethrough', 'strikeThrough'),
          fmtBtn('x<sub style="font-size:.6rem">2</sub>', 'Subscript', 'subscript'), fmtBtn('x<sup style="font-size:.6rem">2</sup>', 'Superscript', 'superscript'),
          menuBtn(null, 'Change case', [{ label: 'UPPERCASE', fn: () => transformCase('upper') }, { label: 'lowercase', fn: () => transformCase('lower') }, { label: 'Title Case', fn: () => transformCase('title') }, { label: 'Sentence case', fn: () => transformCase('sentence') }], { html: '<span style="font-weight:700">Aa</span>' }),
          colorButton('text'), colorButton('hi'),
          btn('eraser', 'Clear all formatting (Ctrl+\\)', clearFormatting)]
      ]),
      group('Paragraph', [
        [menuBtn('ul', 'Bullets', [{ label: 'Solid bullets', fn: () => listStyle('ul', 'disc') }, { label: 'Hollow bullets', fn: () => listStyle('ul', 'circle') }, { label: 'Square bullets', fn: () => listStyle('ul', 'square') }]),
          menuBtn('ol', 'Numbering', [{ label: '1. 2. 3.', fn: () => listStyle('ol', 'decimal') }, { label: 'a. b. c.', fn: () => listStyle('ol', 'lower-alpha') }, { label: 'A. B. C.', fn: () => listStyle('ol', 'upper-alpha') }, { label: 'i. ii. iii.', fn: () => listStyle('ol', 'lower-roman') }, { label: 'I. II. III.', fn: () => listStyle('ol', 'upper-roman') }]),
          cmdBtn('outdent', 'Decrease indent', 'outdent'), cmdBtn('indent', 'Increase indent', 'indent'),
          menuBtn('spacing', 'Line spacing', ['1', '1.15', '1.5', '2', '2.5', '3'].map(v => ({ label: v === '1.15' ? '1.15 (recommended)' : v, fn: () => setBlockStyle('lineHeight', v) })))],
        [cmdBtn('alignL', 'Align left (Ctrl+L)', 'justifyLeft'), cmdBtn('alignC', 'Center (Ctrl+E)', 'justifyCenter'), cmdBtn('alignR', 'Align right (Ctrl+R)', 'justifyRight'), cmdBtn('alignJ', 'Justify (Ctrl+J)', 'justifyFull')]
      ]),
      group('Styles', [[ctlStyle], [btn(null, 'Heading 1', () => applyStyle('h1'), { html: '<b>H1</b>' }), btn(null, 'Heading 2', () => applyStyle('h2'), { html: '<b>H2</b>' }), btn(null, 'Heading 3', () => applyStyle('h3'), { html: '<b>H3</b>' }), btn(null, 'Normal text', () => applyStyle('normal'), { html: 'Normal' })]]),
      group('Editing', [[btn('search', 'Find (Ctrl+F)', () => openFind(false), { text: 'Find' }), btn('search', 'Find and replace (Ctrl+H)', () => openFind(true), { text: 'Replace' })], [btn(null, 'Select all (Ctrl+A)', () => { exec('selectAll'); }, { text: 'Select all' })]])
    );

    /* ---- INSERT ---- */
    const tableBtn = btn('table', 'Insert a table', (e, b) => tableGridPicker(b), { big: true, text: 'Table', caret: false });
    panels.insert.append(
      group('Pages', [[btn('pagebreak', 'Insert a page break', () => insertHtml('<div class="doc-pagebreak"></div><p><br></p>'), { big: true, text: 'Page break' }), btn('toc', 'Insert table of contents from headings', insertTOC, { big: true, text: 'Contents' })]]),
      group('Tables', [[tableBtn]]),
      group('Illustrations', [[btn('image', 'Insert a picture', openImageDialog, { big: true, text: 'Picture' }), btn('video', 'Insert YouTube / Vimeo video', openVideoDialog, { big: true, text: 'Video' }), btn('music', 'Insert audio / music', openAudioDialog, { big: true, text: 'Audio' })]]),
      group('Links', [[btn('link', 'Insert link (Ctrl+K)', openLinkDialog, { big: true, text: 'Link' })]]),
      group('Text blocks', [[
        menuBtn('callout', 'Insert a callout box', [{ label: 'Note', fn: () => insertCallout('note', 'Note') }, { label: 'Tip', fn: () => insertCallout('tip', 'Tip') }, { label: 'Warning', fn: () => insertCallout('warning', 'Warning') }, { label: 'Important', fn: () => insertCallout('important', 'Important') }, { label: 'Success', fn: () => insertCallout('success', 'Success') }], { big: true, text: 'Callout' }),
        btn('quote', 'Insert a quotation', insertQuote, { big: true, text: 'Quote' }),
        btn('code', 'Insert a code block', insertCodeBlock, { big: true, text: 'Code' }),
        btn('clock', 'Insert a timeline entry', insertTimeline, { big: true, text: 'Timeline' })
      ]]),
      group('Symbols', [[
        btn('sigma', 'Insert equation (LaTeX)', () => openEquationDialog(false), { big: true, text: 'Equation' }),
        btn(null, 'Insert symbol', (e, b) => symbolPicker(b), { big: true, html: '<span style="font-size:1.35rem;line-height:22px">Ω</span>', text: 'Symbol' })
      ], [
        btn(null, 'Inline equation', () => openEquationDialog(true), { html: 'ƒ(x)', text: 'Inline' }),
        btn('calendar', 'Insert today\'s date', () => { restoreSel(); document.execCommand('insertText', false, new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })); afterChange(); }, { text: 'Date' }),
        btn('hr', 'Horizontal line', () => exec('insertHorizontalRule'), { text: 'Line' })
      ]])
    );

    /* ---- LAYOUT ---- */
    panels.layout.append(
      group('Paragraph spacing', [[
        menuBtn('spacing', 'Line spacing', ['1', '1.15', '1.5', '2', '2.5', '3'].map(v => ({ label: 'Line spacing ' + v, fn: () => setBlockStyle('lineHeight', v) })), { big: true, text: 'Line spacing' }),
        menuBtn(null, 'Space after paragraph', [0, 6, 12, 18, 24, 36].map(v => ({ label: 'After: ' + v + ' px', fn: () => setBlockStyle('marginBottom', v + 'px') })), { big: true, html: '<span style="font-size:1.2rem">↧</span>', text: 'Space after' }),
        menuBtn(null, 'Space before paragraph', [0, 6, 12, 18, 24, 36].map(v => ({ label: 'Before: ' + v + ' px', fn: () => setBlockStyle('marginTop', v + 'px') })), { big: true, html: '<span style="font-size:1.2rem">↥</span>', text: 'Space before' }),
        menuBtn(null, 'First-line indent', [{ label: 'None', fn: () => setBlockStyle('textIndent', '0') }, { label: '0.5 inch', fn: () => setBlockStyle('textIndent', '2em') }, { label: '1 inch', fn: () => setBlockStyle('textIndent', '4em') }], { big: true, html: '<span style="font-size:1.2rem">⇥</span>', text: 'First line' })
      ]]),
      group('Columns', [[
        btn('columns', 'One column', () => { wrapColumns(1); afterChange(); }, { big: true, text: 'One' }),
        btn('columns', 'Two columns (selected content)', () => { wrapColumns(2); afterChange(); }, { big: true, text: 'Two' }),
        btn('columns', 'Three columns (selected content)', () => { wrapColumns(3); afterChange(); }, { big: true, text: 'Three' })
      ]]),
      group('Direction', [[
        btn(null, 'Left-to-right text', () => { selectedBlocks().forEach(b => { b.setAttribute('dir', 'ltr'); b.style.textAlign = 'left'; }); afterChange(); }, { big: true, html: '<span style="font-size:1.2rem">¶▸</span>', text: 'LTR' }),
        btn(null, 'Right-to-left text', () => { selectedBlocks().forEach(b => { b.setAttribute('dir', 'rtl'); b.style.textAlign = 'right'; }); afterChange(); }, { big: true, html: '<span style="font-size:1.2rem">◂¶</span>', text: 'RTL' })
      ]]),
      group('Page', [[
        btn('pagebreak', 'Insert page break', () => insertHtml('<div class="doc-pagebreak"></div><p><br></p>'), { big: true, text: 'Break' }),
        btn('toc', 'Table of contents', insertTOC, { big: true, text: 'Contents' })
      ]])
    );

    /* ---- REVIEW ---- */
    panels.review.append(
      group('Proofing', [[
        btn('check', 'Toggle spell check', (e, b) => { const on = doc.spellcheck = !doc.spellcheck; b.classList.toggle('active', on); toast('Spell check ' + (on ? 'on' : 'off'), 'info'); doc.blur(); doc.focus(); }, { big: true, text: 'Spelling' }),
        btn('sigma', 'Word count', showWordCount, { big: true, text: 'Word count' }),
        btn('check', 'Check accessibility', accessibilityCheck, { big: true, text: 'Accessibility' })
      ]]),
      group('Find', [[btn('search', 'Find & replace', () => openFind(false), { big: true, text: 'Find' })]]),
      group('Speech', [[btn('speaker', 'Read aloud (selection or whole document)', readAloud, { big: true, text: 'Read aloud' })]])
    );
    panels.review.querySelector('.we-btn[title="Toggle spell check"]').classList.add('active');

    /* ---- VIEW ---- */
    panels.view.append(
      group('Zoom', [[
        btn('zoomOut', 'Zoom out', () => setZoom(zoom - 10), { big: true, text: 'Zoom out' }),
        btn('zoomIn', 'Zoom in', () => setZoom(zoom + 10), { big: true, text: 'Zoom in' }),
        btn(null, 'Reset zoom to 100%', () => setZoom(100), { big: true, html: '<b style="font-size:1.1rem">100%</b>', text: 'Reset' })
      ]]),
      group('Show', [[
        btn('sidebar', 'Navigation pane (outline of headings)', (e, b) => { wrap.classList.toggle('we-has-nav'); b.classList.toggle('active', wrap.classList.contains('we-has-nav')); updateNav(); }, { big: true, text: 'Navigation' }),
        btn('pilcrow', 'Show / hide paragraph marks', (e, b) => { doc.classList.toggle('we-marks'); b.classList.toggle('active'); }, { big: true, text: 'Marks' })
      ]]),
      group('Page width', [[
        select('we-style', 'Page width (editor view only)', [['820', 'Standard'], ['640', 'Narrow'], ['1000', 'Wide'], ['1280', 'Extra wide']], v => doc.style.setProperty('--we-page-w', v + 'px'))
      ]]),
      group('Window', [[btn('max', 'Focus mode (full screen)', toggleFullscreen, { big: true, text: 'Focus mode' })]])
    );

    /* ---- TABLE TOOLS ---- */
    const tb = (label, op) => btn(null, label, () => tableOp(op), { text: label });
    const shadeBtn = (() => {
      const w = el('div', 'we-row'); w.style.gap = '0';
      const b = btn(null, 'Shade cell', (e, bb) => { saveSel(); openPop(bb, paletteContent(c => { cellsInSelection().forEach(cl => { c ? (cl.style.backgroundColor = c) : cl.style.removeProperty('background-color'); }); afterChange(); }, 'No shading')); }, { html: ic('painter', 15), text: 'Cell shading', caret: true });
      w.append(b); return w;
    })();
    panels.table.append(
      group('Rows & columns', [[tb('Row above', 'rowAbove'), tb('Row below', 'rowBelow'), tb('Column left', 'colLeft'), tb('Column right', 'colRight')], [tb('Delete row', 'delRow'), tb('Delete column', 'delCol'), btn('trash', 'Delete table', () => { if (confirm('Delete this table?')) tableOp('delTable'); }, { text: 'Delete table' })]]),
      group('Merge', [[tb('Merge right', 'mergeRight')], [tb('Split cell', 'split')]]),
      group('Style', [[
        select('we-style', 'Table style', [['doc-table-grid', 'Grid'], ['doc-table-plain', 'Clean lines'], ['doc-table-striped', 'Striped']], v => { const t = curTable(); if (t) { t.classList.remove('doc-table-grid', 'doc-table-plain', 'doc-table-striped'); t.classList.add(v); } }),
        tb('Header row', 'header')
      ], [
        shadeBtn,
        select('we-style', 'Table width', [['full', 'Full width'], ['auto', 'Fit to content']], v => { const t = curTable(); if (t) t.classList.toggle('doc-table-auto', v === 'auto'); })
      ]])
    );

    /* ---- PICTURE TOOLS ---- */
    panels.image.append(
      group('Size', [[
        select('we-style', 'Picture size', [['', 'Size...'], ['auto', 'Original'], ['25', '25%'], ['50', '50%'], ['75', '75%'], ['100', 'Full width']], v => { if (v) imageOp('width', v); })
      ]]),
      group('Arrange', [[
        btn('alignL', 'Float left (text wraps)', () => imageOp('align', 'left'), { text: 'Left' }),
        btn('alignC', 'Center', () => imageOp('align', 'center'), { text: 'Center' }),
        btn('alignR', 'Float right (text wraps)', () => imageOp('align', 'right'), { text: 'Right' })
      ]]),
      group('Accessibility & text', [[
        btn(null, 'Edit alternative text', () => imageOp('alt'), { text: 'Alt text' }),
        btn(null, 'Add or remove caption', () => imageOp('caption'), { text: 'Caption' }),
        btn('trash', 'Delete picture', () => imageOp('delete'), { text: 'Delete' })
      ]])
    );

    /* ---- stage ---- */
    const body = el('div', 'we-body');
    navEl = el('div', 'we-nav');
    const stage = el('div', 'we-stage');
    doc = el('div', 'we-page crii-doc');
    doc.contentEditable = 'true';
    doc.spellcheck = true;
    doc.setAttribute('role', 'textbox');
    doc.setAttribute('aria-multiline', 'true');
    doc.setAttribute('aria-label', 'Article editor');
    doc.innerHTML = '<p><br></p>';
    stage.append(doc);
    body.append(navEl, stage);
    buildFindPanel();

    statusEl = el('div', 'we-status',
      '<span class="we-st-words">0 words</span><span class="we-st-chars">0 characters</span><span class="we-st-read">1 min read</span><span class="we-saved"></span><span class="we-spacer"></span>' +
      '<button type="button" class="we-zoom-out" title="Zoom out">−</button><input type="range" class="we-zoom-range" min="50" max="200" value="100"><button type="button" class="we-zoom-in" title="Zoom in">+</button><span class="we-zoom-label">100%</span>');
    statusEl.querySelector('.we-zoom-range').addEventListener('input', e => setZoom(+e.target.value));
    statusEl.querySelector('.we-zoom-out').addEventListener('click', () => setZoom(zoom - 10));
    statusEl.querySelector('.we-zoom-in').addEventListener('click', () => setZoom(zoom + 10));

    wrap.append(tabsEl, ribbonEl, body, findPanel, statusEl);
    showTab('home');
    bindEditorEvents();
  }

  function listStyle(kind, type) {
    restoreSel();
    let list = up(anchorEl(), kind);
    if (!list) { document.execCommand(kind === 'ul' ? 'insertUnorderedList' : 'insertOrderedList'); saveSel(); list = up(anchorEl(), 'ul,ol'); }
    if (list && list.tagName.toLowerCase() !== kind) {
      const n = document.createElement(kind); n.innerHTML = list.innerHTML; list.replaceWith(n); list = n;
    }
    if (list) list.style.listStyleType = type;
  }

  function toggleFullscreen() {
    wrap.classList.toggle('we-fullscreen');
    document.body.style.overflow = wrap.classList.contains('we-fullscreen') ? 'hidden' : '';
  }

  function bindEditorEvents() {
    document.addEventListener('selectionchange', () => { if (mounted && doc) { saveSel(); } updateStateSoon(); });
    let stTimer;
    function updateStateSoon() { clearTimeout(stTimer); stTimer = setTimeout(updateState, 80); }

    doc.addEventListener('focus', () => { try { document.execCommand('styleWithCSS', false, true); document.execCommand('defaultParagraphSeparator', false, 'p'); } catch (e) { /* ignore */ } });
    doc.addEventListener('input', afterChange);

    doc.addEventListener('mouseup', () => {
      if (painter) {
        const s = window.getSelection();
        if (!s.isCollapsed) {
          exec('styleWithCSS', true);
          exec('fontName', painter.fontFamily);
          setFontSize(parseFloat(painter.fontSize));
          exec('foreColor', painter.color);
          const now = { bold: document.queryCommandState('bold'), italic: document.queryCommandState('italic'), underline: document.queryCommandState('underline') };
          if (now.bold !== painter.bold) exec('bold');
          if (now.italic !== painter.italic) exec('italic');
          if (now.underline !== painter.underline) exec('underline');
          painter = null;
          wrap.querySelectorAll('.we-btn.active').forEach(b => { if (b.title && b.title.indexOf('Format Painter') === 0) b.classList.remove('active'); });
          afterChange();
        }
      }
    });

    doc.addEventListener('click', e => {
      if (e.target.tagName === 'IMG') selectImage(e.target); else if (selImg) selectImage(null);
      const a = e.target.closest && e.target.closest('a');
      if (a && (e.ctrlKey || e.metaKey)) window.open(a.href, '_blank', 'noopener');
    });
    doc.addEventListener('dblclick', e => {
      const eq = e.target.closest && e.target.closest('.doc-equation');
      if (eq) openEquationDialog(eq.classList.contains('doc-eq-inline'), eq);
    });

    doc.addEventListener('keydown', e => {
      const mod = e.ctrlKey || e.metaKey;
      const k = e.key.toLowerCase();
      if (e.key === 'Tab') {
        e.preventDefault();
        const cell = curCell();
        if (cell) {
          let next = e.shiftKey ? cell.previousElementSibling : cell.nextElementSibling;
          if (!next) { const tr = cell.parentElement; const nr = e.shiftKey ? tr.previousElementSibling : tr.nextElementSibling; if (nr) next = e.shiftKey ? nr.lastElementChild : nr.firstElementChild; else if (!e.shiftKey) { tableOp('rowBelow'); const t = curTable(); const last = t.rows[t.rows.length - 1]; next = last && last.cells[0]; } }
          if (next) { const r = document.createRange(); r.selectNodeContents(next); r.collapse(true); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
        } else if (up(anchorEl(), 'li')) { document.execCommand(e.shiftKey ? 'outdent' : 'indent'); }
        else if (!e.shiftKey) { document.execCommand('insertText', false, '\u00a0\u00a0\u00a0\u00a0'); }
        return;
      }
      if (!mod) return;
      if (k === 'k') { e.preventDefault(); openLinkDialog(); }
      else if (k === 'f') { e.preventDefault(); openFind(false); }
      else if (k === 'h') { e.preventDefault(); openFind(true); }
      else if (k === 's') { e.preventDefault(); const b = document.getElementById('bloggerSaveBtn'); if (b) b.click(); }
      else if (k === 'l' && !e.shiftKey) { e.preventDefault(); exec('justifyLeft'); }
      else if (k === 'e') { e.preventDefault(); exec('justifyCenter'); }
      else if (k === 'r') { e.preventDefault(); exec('justifyRight'); }
      else if (k === 'j') { e.preventDefault(); exec('justifyFull'); }
      else if (k === '\\') { e.preventDefault(); clearFormatting(); }
      else if (e.altKey && ['1', '2', '3'].includes(k)) { e.preventDefault(); applyStyle('h' + k); }
      else if (e.altKey && k === '0') { e.preventDefault(); applyStyle('normal'); }
      else if (e.shiftKey && (k === '.' || k === '>')) { e.preventDefault(); stepFontSize(1); }
      else if (e.shiftKey && (k === ',' || k === '<')) { e.preventDefault(); stepFontSize(-1); }
    });

    doc.addEventListener('paste', async e => {
      const cd = e.clipboardData; if (!cd) return;
      const files = Array.from(cd.files || []).filter(f => f.type.indexOf('image/') === 0);
      if (files.length) { e.preventDefault(); for (const f of files) await insertImageFile(f); return; }
      const html = cd.getData('text/html');
      if (html && !e.shiftKey) {
        e.preventDefault();
        document.execCommand('insertHTML', false, CD.sanitize(html));
        CD.renderMath(doc);
        afterChange();
      }
    });
    doc.addEventListener('drop', async e => {
      const files = Array.from((e.dataTransfer && e.dataTransfer.files) || []).filter(f => f.type.indexOf('image/') === 0);
      if (files.length) { e.preventDefault(); for (const f of files) await insertImageFile(f); }
    });
    window.addEventListener('beforeunload', () => { if (dirty && mounted && mode === 'doc') { try { localStorage.setItem(draftKey, JSON.stringify({ html: getCleanHtml(), t: Date.now() })); } catch (e) { /* ignore */ } } });
  }

  /* ------------------------------------------------------------------ */
  /* Reversible Conversion: HTML Document → Modular Blocks             */
  /* ------------------------------------------------------------------ */
  function htmlToBlocks(html) {
    if (!html || !html.trim()) return [];
    const div = document.createElement('div');
    div.innerHTML = html;
    const blocks = [];
    let counter = Date.now();

    function uid() {
      return `b-${Date.now()}-${(counter++).toString(36)}`;
    }

    const children = Array.from(div.children);
    if (children.length === 0 && div.textContent.trim()) {
      return [{ id: uid(), type: 'text', content: div.textContent.trim() }];
    }

    children.forEach(el => {
      const explicitType = el.getAttribute('data-block-type');
      const tag = el.tagName.toLowerCase();

      if (explicitType === 'heading' || tag === 'h1' || tag === 'h2') {
        const lvl = tag === 'h1' ? 1 : 2;
        blocks.push({ id: uid(), type: 'heading', level: lvl, content: el.innerText.trim() });
      } else if (explicitType === 'subheading' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6') {
        blocks.push({ id: uid(), type: 'subheading', content: el.innerText.trim() });
      } else if (explicitType === 'image' || tag === 'figure' || el.classList.contains('doc-figure') || tag === 'img') {
        const img = tag === 'img' ? el : el.querySelector('img');
        const cap = el.querySelector('figcaption') || el.querySelector('.doc-caption');
        const url = el.getAttribute('data-url') || (img ? img.src : '');
        if (url) {
          blocks.push({
            id: uid(),
            type: 'image',
            url: url,
            caption: cap ? cap.innerText.trim() : (img ? img.alt || '' : '')
          });
        }
      } else if (explicitType === 'quote' || tag === 'blockquote') {
        const authorAttr = el.getAttribute('data-author');
        const foot = el.querySelector('footer');
        const author = authorAttr || (foot ? foot.innerText.replace(/^—\s*/, '').trim() : '');
        const clone = el.cloneNode(true);
        const fInClone = clone.querySelector('footer');
        if (fInClone) fInClone.remove();
        blocks.push({
          id: uid(),
          type: 'quote',
          content: clone.innerText.trim(),
          author
        });
      } else if (explicitType === 'callout' || el.classList.contains('doc-callout')) {
        const style = el.getAttribute('data-callout') || 'note';
        const clone = el.cloneNode(true);
        const p1 = clone.querySelector('p');
        if (p1 && clone.children.length > 1 && ['note', 'tip', 'warning', 'important', 'caution', 'success'].includes(p1.innerText.trim().toLowerCase())) {
          p1.remove();
        }
        blocks.push({
          id: uid(),
          type: 'callout',
          style,
          content: clone.innerText.trim()
        });
      } else if (explicitType === 'code' || tag === 'pre' || el.classList.contains('doc-code')) {
        const lang = el.getAttribute('data-language') || 'python';
        const code = el.querySelector('code') || el;
        blocks.push({
          id: uid(),
          type: 'code',
          content: code.innerText.trim(),
          language: lang
        });
      } else if (explicitType === 'math' || el.classList.contains('doc-equation') || el.classList.contains('doc-math-block')) {
        const latex = el.getAttribute('data-latex') || el.innerText.replace(/\$\$/g, '').trim();
        blocks.push({
          id: uid(),
          type: 'math',
          content: latex
        });
      } else if (explicitType === 'timeline' || el.classList.contains('doc-timeline')) {
        const dateAttr = el.getAttribute('data-date');
        const str = el.querySelector('strong, .timeline-badge');
        const p = el.querySelector('p, .timeline-desc');
        blocks.push({
          id: uid(),
          type: 'timeline',
          date: dateAttr || (str ? str.innerText.trim() : 'Phase 1'),
          content: p ? p.innerText.trim() : el.innerText.trim()
        });
      } else if (explicitType === 'music' || el.classList.contains('doc-music-card') || el.classList.contains('doc-audio')) {
        const url = el.getAttribute('data-url') || el.querySelector('a')?.href || el.querySelector('audio')?.src || '';
        const title = el.getAttribute('data-content') || el.querySelector('strong')?.innerText.trim() || 'Research Soundtrack';
        const opinion = el.querySelector('.doc-music-opinion')?.innerText.trim() || '';
        blocks.push({
          id: uid(),
          type: 'music',
          url,
          content: title,
          opinion
        });
      } else if (explicitType === 'video' || el.classList.contains('doc-video') || el.classList.contains('doc-video-wrapper')) {
        const url = el.getAttribute('data-url') || el.querySelector('iframe')?.src || '';
        blocks.push({
          id: uid(),
          type: 'video',
          url
        });
      } else if (explicitType === 'table' || tag === 'table' || el.classList.contains('table-wrapper')) {
        const tbl = tag === 'table' ? el : el.querySelector('table');
        if (tbl) {
          const rows = Array.from(tbl.querySelectorAll('tr')).map(r => {
            return Array.from(r.querySelectorAll('th, td')).map(c => c.innerText.trim()).join(' | ');
          });
          blocks.push({
            id: uid(),
            type: 'table',
            content: rows.join('\n')
          });
        }
      } else if (explicitType === 'divider' || tag === 'hr') {
        blocks.push({ id: uid(), type: 'divider' });
      } else if (tag === 'ul' || tag === 'ol') {
        const items = Array.from(el.querySelectorAll('li')).map(li => li.innerText.trim()).filter(Boolean);
        blocks.push({
          id: uid(),
          type: 'list',
          content: items.map(x => '- ' + x).join('\n')
        });
      } else {
        const text = el.innerText.trim();
        if (text) {
          blocks.push({ id: uid(), type: 'text', content: text });
        }
      }
    });

    return blocks.length > 0 ? blocks : [{ id: uid(), type: 'text', content: '' }];
  }

  /* ------------------------------------------------------------------ */
  /* Undo / Redo History Stack (Document & Conversion Operations)      */
  /* ------------------------------------------------------------------ */
  const historyStack = [];
  let historyIndex = -1;
  const MAX_HISTORY = 40;
  let isRestoringHistory = false;
  let snapDebounceTimer = null;

  function takeSnapshot(source = 'edit') {
    if (isRestoringHistory || !mounted) return;
    const currentHtml = getCleanHtml();
    const currentBlocks = window.getEditorBlocks ? window.getEditorBlocks() : [];
    const snapshot = {
      source,
      mode,
      html: currentHtml,
      blocks: JSON.parse(JSON.stringify(currentBlocks))
    };

    if (historyIndex >= 0) {
      const top = historyStack[historyIndex];
      if (top.mode === snapshot.mode && top.html === snapshot.html && JSON.stringify(top.blocks) === JSON.stringify(snapshot.blocks)) {
        return;
      }
    }

    if (historyIndex < historyStack.length - 1) {
      historyStack.splice(historyIndex + 1);
    }
    historyStack.push(snapshot);
    if (historyStack.length > MAX_HISTORY) {
      historyStack.shift();
    }
    historyIndex = historyStack.length - 1;
    updateUndoRedoUI();
  }

  function undoHistory() {
    if (historyIndex > 0) {
      historyIndex--;
      restoreSnapshot(historyStack[historyIndex]);
    } else {
      document.execCommand('undo');
      afterChange();
    }
    updateUndoRedoUI();
  }

  function redoHistory() {
    if (historyIndex < historyStack.length - 1) {
      historyIndex++;
      restoreSnapshot(historyStack[historyIndex]);
    } else {
      document.execCommand('redo');
      afterChange();
    }
    updateUndoRedoUI();
  }

  function restoreSnapshot(snap) {
    if (!snap) return;
    isRestoringHistory = true;
    try {
      if (snap.mode === 'blocks') {
        if (window.setEditorBlocks) {
          window.setEditorBlocks(snap.blocks || []);
        }
        setMode('blocks');
        toast('Restored previous block builder state', 'info');
      } else {
        setHtml(snap.html || '');
        setMode('doc');
        toast('Restored previous document state', 'info');
      }
      afterChange();
    } finally {
      isRestoringHistory = false;
    }
  }

  function updateUndoRedoUI() {
    if (!modeBar) return;
    const undoBtn = modeBar.querySelector('.we-undo-btn');
    const redoBtn = modeBar.querySelector('.we-redo-btn');
    if (undoBtn) {
      const canUndo = historyIndex > 0;
      undoBtn.disabled = !canUndo;
      undoBtn.style.opacity = canUndo ? '1' : '0.45';
      undoBtn.style.cursor = canUndo ? 'pointer' : 'not-allowed';
    }
    if (redoBtn) {
      const canRedo = historyIndex < historyStack.length - 1;
      redoBtn.disabled = !canRedo;
      redoBtn.style.opacity = canRedo ? '1' : '0.45';
      redoBtn.style.cursor = canRedo ? 'pointer' : 'not-allowed';
    }
  }

  function convertBlocksToDoc() {
    takeSnapshot('before_convert_to_doc');
    const blocks = window.getEditorBlocks ? window.getEditorBlocks() : (blocksProvider ? blocksProvider() : []);
    if (!blocks || blocks.length === 0) {
      toast('No blocks found to convert', 'info');
      return;
    }
    const html = blocksToHtml(blocks);
    setHtml(html);
    setMode('doc');
    takeSnapshot('converted_to_doc');
    afterChange();
    toast('Blocks converted to Word document! (Click Undo to revert)', 'success');
  }

  function convertDocToBlocks() {
    takeSnapshot('before_convert_to_blocks');
    const html = getCleanHtml();
    if (!html || !html.trim() || isEmpty()) {
      toast('Document is empty', 'info');
      return;
    }
    const blocks = htmlToBlocks(html);
    if (window.setEditorBlocks) {
      window.setEditorBlocks(blocks);
    }
    setMode('blocks');
    takeSnapshot('converted_to_blocks');
    toast('Document converted into modular blocks! (Click Undo to revert)', 'success');
  }

  /* ------------------------------------------------------------------ */
  /* Mode bar & mounting                                                 */
  /* ------------------------------------------------------------------ */
  function setMode(m) {
    mode = m;
    if (!mounted) return;
    wrap.style.display = m === 'doc' ? 'flex' : 'none';
    const stack = document.getElementById('bloggerBlockStack');
    const add = document.getElementById('bloggerOpenAddBlockBtn');
    if (stack) stack.style.display = m === 'blocks' ? '' : 'none';
    if (add) add.style.display = m === 'blocks' ? '' : 'none';

    modeBar.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('active', b.dataset.mode === m));

    // Show appropriate conversion button
    const toDocBtn = modeBar.querySelector('.we-convert-blocks-btn');
    const toBlocksBtn = modeBar.querySelector('.we-convert-doc-btn');
    if (toDocBtn) toDocBtn.style.display = m === 'blocks' ? 'inline-flex' : 'none';
    if (toBlocksBtn) toBlocksBtn.style.display = m === 'doc' ? 'inline-flex' : 'none';

    modeBar.querySelector('.we-modehint').textContent = m === 'doc'
      ? 'Document mode: Word-style ribbon, tables, pictures, LaTeX and custom formatting. Auto-saves continuously.'
      : 'Block mode: Modular structured cards. Use "Convert blocks to document" anytime to switch to Word editor.';

    if (m === 'doc') { updateStatus(); updateNav(); }
    else { const badge = document.getElementById('bloggerReadTimeBadge'); if (badge && typeof updateEstimatedReadingTime === 'function') { try { updateEstimatedReadingTime(); } catch (e) { /* ignore */ } } }
    updateUndoRedoUI();
  }

  function mount() {
    if (mounted) return;
    const pane = document.getElementById('bloggerPaneWrite');
    if (!pane) return;
    build();

    modeBar = el('div', 'we-modebar');
    modeBar.innerHTML = `
      <div class="we-modeswitch">
        <button type="button" data-mode="doc" title="Microsoft Word document style editor">
          ${ic('word', 15)} <span>Document editor</span>
        </button>
        <button type="button" data-mode="blocks" title="Modular block builder mode">
          ${ic('table', 15)} <span>Block builder</span>
        </button>
      </div>

      <div class="we-mode-actions">
        <!-- Reversible Conversions -->
        <button type="button" class="btn btn-secondary btn-sm we-convert-blocks-btn" title="Convert all modular blocks into a rich Word document">
          ⚡ Convert blocks to document
        </button>
        <button type="button" class="btn btn-secondary btn-sm we-convert-doc-btn" style="display:none;" title="Convert the Word document into modular blocks">
          ⚡ Convert document into blocks
        </button>

        <!-- Undo & Redo Controls -->
        <div class="we-history-group">
          <button type="button" class="btn btn-secondary btn-sm we-undo-btn" title="Undo (Ctrl+Z)" disabled>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
            <span>Undo</span>
          </button>
          <button type="button" class="btn btn-secondary btn-sm we-redo-btn" title="Redo (Ctrl+Y)" disabled>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14l5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></svg>
            <span>Redo</span>
          </button>
        </div>
      </div>

      <span class="we-modehint"></span>
    `;

    pane.prepend(wrap);
    pane.prepend(modeBar);
    mounted = true;

    function syncBlocksToDoc() {
      const blocks = (window.getEditorBlocks ? window.getEditorBlocks() : (blocksProvider ? blocksProvider() : [])) || [];
      if (blocks && blocks.length > 0) {
        setHtml(blocksToHtml(blocks));
      }
    }

    function syncDocToBlocks() {
      const html = getCleanHtml();
      if (html && html.trim() && !isEmpty()) {
        const blocks = htmlToBlocks(html);
        if (window.setEditorBlocks) {
          window.setEditorBlocks(blocks);
        }
      }
    }

    modeBar.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
      const target = b.dataset.mode;
      if (target === mode) return;
      takeSnapshot('switch_mode_' + target);
      if (target === 'doc') {
        syncBlocksToDoc();
      } else if (target === 'blocks') {
        syncDocToBlocks();
      }
      setMode(target);
      afterChange();
    }));

    // Bind Conversion Buttons
    modeBar.querySelector('.we-convert-blocks-btn').addEventListener('click', convertBlocksToDoc);
    modeBar.querySelector('.we-convert-doc-btn').addEventListener('click', convertDocToBlocks);

    // Bind Undo / Redo Buttons
    modeBar.querySelector('.we-undo-btn').addEventListener('click', undoHistory);
    modeBar.querySelector('.we-redo-btn').addEventListener('click', redoHistory);

    // Global keyboard shortcut for Undo / Redo in both modes
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redoHistory();
        } else if (mode === 'blocks') {
          e.preventDefault();
          undoHistory();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        if (mode === 'blocks') {
          e.preventDefault();
          redoHistory();
        }
      }
    });

    setZoom(100);
    // Take initial snapshot
    setTimeout(() => takeSnapshot('initial'), 300);
  }

  function restoreDraft(force) {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(draftKey) || 'null'); } catch (e) { d = null; }
    if (!d || !d.html) { if (force) toast('No saved draft found for this article', 'info'); return false; }
    if (force || confirm('An auto-saved draft from ' + new Date(d.t).toLocaleString() + ' was found for this article.\n\nRestore it?')) {
      setHtml(d.html); setMode('doc'); dirty = true; return true;
    }
    return false;
  }

  /* ------------------------------------------------------------------ */
  /* Public API                                                          */
  /* ------------------------------------------------------------------ */
  window.CRII_WORD = {
    load(post, provider) {
      mount();
      if (!mounted) return;
      blocksProvider = provider || (() => []);
      draftKey = 'crii_doc_draft_' + (post && post.id ? post.id : 'new');
      dirty = false;
      if (post && CD.isDoc(post.content)) {
        setHtml(post.content.slice(CD.MARK.length));
        setMode('doc');
        let d = null; try { d = JSON.parse(localStorage.getItem(draftKey) || 'null'); } catch (e) { d = null; }
        if (d && d.html && d.html !== getCleanHtml()) restoreDraft(false);
      } else if (post && Array.isArray(post.blocks) && post.blocks.length > 0) {
        setHtml(blocksToHtml(post.blocks));
        setMode('blocks');
      } else if (post) {
        setHtml('');
        setMode('blocks');
      } else {
        setHtml('');
        setMode('doc');
        restoreDraft(false);
      }
      setZoom(100);
      showTab('home');
      selImg = null;
      updateStatus(); updateNav();
    },
    getMode: () => (mounted ? mode : 'blocks'),
    setMode,
    setHtml,
    getCleanHtml: () => (mounted ? getCleanHtml() : ''),
    getWordCount: () => (mounted ? wordCount() : 0),
    getExcerpt: n => (mounted ? getExcerpt(n || 200) : ''),
    isEmpty: () => (mounted ? isEmpty() : true),
    clearDraft() { try { localStorage.removeItem(draftKey); } catch (e) { /* ignore */ } dirty = false; },
    blocksToHtml,
    htmlToBlocks,
    syncBlocksToDoc: () => {
      const blocks = (window.getEditorBlocks ? window.getEditorBlocks() : (blocksProvider ? blocksProvider() : [])) || [];
      if (blocks && blocks.length > 0) setHtml(blocksToHtml(blocks));
    },
    syncDocToBlocks: () => {
      const html = getCleanHtml();
      if (html && html.trim() && !isEmpty()) {
        const blocks = htmlToBlocks(html);
        if (window.setEditorBlocks) window.setEditorBlocks(blocks);
        return blocks;
      }
      return [];
    }
  };
})();
