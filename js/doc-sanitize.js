/**
 * CRII Document Engine — shared HTML sanitizer + math renderer
 * Used by the portal Word-style editor and the public article reader.
 */
(function () {
  'use strict';

  const MARK = '<!--crii-html-->';

  const TAGS = new Set([
    'p','div','span','br','hr','h1','h2','h3','h4','h5','h6','b','strong','i','em','u','s','strike','del','ins',
    'sub','sup','mark','small','code','pre','kbd','samp','blockquote','cite','footer','q','abbr',
    'ul','ol','li','dl','dt','dd','a','img','figure','figcaption',
    'table','thead','tbody','tfoot','tr','td','th','caption','colgroup','col','iframe','audio','nav','details','summary'
  ]);
  const DROP = new Set(['script','style','object','embed','link','meta','form','input','button','textarea','select','svg','math','base','title','head','noscript','template','frame','frameset','applet']);

  const STYLE_OK = new Set([
    'color','background','background-color','font-family','font-size','font-weight','font-style','font-variant',
    'text-decoration','text-decoration-line','text-decoration-color','text-align','text-indent','text-transform',
    'line-height','letter-spacing','word-spacing','vertical-align','width','max-width','height','min-height',
    'float','list-style-type','direction','column-count','column-gap','page-break-before','page-break-after'
  ]);

  const IFRAME_OK = /^https:\/\/(www\.)?(youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/|player\.vimeo\.com\/video\/)/i;

  function cleanStyle(s) {
    return String(s || '').split(';').map(x => x.trim()).filter(Boolean).filter(decl => {
      const i = decl.indexOf(':');
      if (i < 0) return false;
      const p = decl.slice(0, i).trim().toLowerCase();
      const v = decl.slice(i + 1).trim().toLowerCase();
      if (!STYLE_OK.has(p) && !/^(margin|padding|border)(-[a-z]+)*$/.test(p)) return false;
      if (/url\(|expression|javascript:|@import|behavior|-moz-binding/.test(v)) return false;
      return true;
    }).join('; ');
  }

  function safeUrl(u, opts) {
    u = String(u || '').trim();
    if (/^(https?:|mailto:|tel:|#|\/)/i.test(u)) return u;
    if (opts && opts.img && /^data:image\/(png|jpe?g|gif|webp);base64,/i.test(u)) return u;
    return null;
  }

  function cleanAttrs(el, tag) {
    Array.from(el.attributes).forEach(a => {
      const n = a.name.toLowerCase();
      const v = a.value;
      if (n === 'style') {
        const s = cleanStyle(v);
        if (s) el.setAttribute('style', s); else el.removeAttribute('style');
        return;
      }
      if (n === 'class') {
        const c = v.split(/\s+/).filter(t => /^doc-[a-z0-9-]+$/.test(t)).join(' ');
        if (c) el.setAttribute('class', c); else el.removeAttribute('class');
        return;
      }
      if (['title', 'dir', 'lang', 'data-callout', 'data-latex', 'data-date', 'data-lang'].includes(n)) return;
      if (n === 'id') {
        if (!(/^doc-h-[a-z0-9-]+$/i.test(v) && /^h[1-6]$/.test(tag))) el.removeAttribute(n);
        return;
      }
      if (tag === 'a' && n === 'href') {
        const u = safeUrl(v);
        if (u) el.setAttribute('href', u); else el.removeAttribute('href');
        return;
      }
      if (tag === 'a' && n === 'target') {
        if (v !== '_blank') el.removeAttribute('target');
        return;
      }
      if (tag === 'a' && n === 'rel') return;
      if (tag === 'img' && n === 'src') {
        const u = safeUrl(v, { img: true });
        if (u) el.setAttribute('src', u); else el.removeAttribute('src');
        return;
      }
      if ((tag === 'img' || tag === 'iframe') && ['alt', 'width', 'height', 'loading'].includes(n)) return;
      if ((tag === 'td' || tag === 'th') && ['colspan', 'rowspan', 'width'].includes(n)) return;
      if (tag === 'iframe' && n === 'src') {
        if (!IFRAME_OK.test(v)) el.removeAttribute('src');
        return;
      }
      if (tag === 'iframe' && ['allowfullscreen', 'frameborder', 'allow'].includes(n)) return;
      if (tag === 'audio' && ['controls', 'preload'].includes(n)) return;
      if (tag === 'audio' && n === 'src') {
        const u = safeUrl(v);
        if (u) el.setAttribute('src', u); else el.removeAttribute('src');
        return;
      }
      if (tag === 'col' && n === 'span') return;
      el.removeAttribute(n);
    });
    if (tag === 'a' && el.getAttribute('target') === '_blank') el.setAttribute('rel', 'noopener noreferrer');
  }

  function walk(node) {
    Array.from(node.childNodes).forEach(ch => {
      if (ch.nodeType === 3) return;
      if (ch.nodeType !== 1) { ch.remove(); return; }
      const tag = ch.tagName.toLowerCase();
      if (DROP.has(tag)) { ch.remove(); return; }

      if (tag === 'font' || tag === 'center') {
        const span = document.createElement(tag === 'center' ? 'div' : 'span');
        const st = [];
        if (tag === 'center') st.push('text-align:center');
        if (ch.getAttribute('color')) st.push('color:' + ch.getAttribute('color'));
        if (ch.getAttribute('face')) st.push('font-family:' + ch.getAttribute('face'));
        const prev = ch.getAttribute('style');
        if (prev) st.push(prev);
        if (st.length) span.setAttribute('style', st.join(';'));
        while (ch.firstChild) span.appendChild(ch.firstChild);
        ch.replaceWith(span);
        cleanAttrs(span, span.tagName.toLowerCase());
        walk(span);
        return;
      }

      if (!TAGS.has(tag)) {
        walk(ch);
        while (ch.firstChild) node.insertBefore(ch.firstChild, ch);
        ch.remove();
        return;
      }

      cleanAttrs(ch, tag);
      if (tag === 'img' && !ch.getAttribute('src')) { ch.remove(); return; }
      if (tag === 'iframe') {
        if (!ch.getAttribute('src')) { ch.remove(); return; }
        ch.setAttribute('allowfullscreen', '');
        ch.setAttribute('frameborder', '0');
      }
      walk(ch);
    });
  }

  function sanitize(html) {
    const parsed = new DOMParser().parseFromString('<body>' + String(html || ''), 'text/html');
    walk(parsed.body);
    return parsed.body.innerHTML;
  }

  /* ---------------- Math (KaTeX, lazy) ---------------- */
  let katexPromise = null;
  function loadKatex() {
    if (window.katex) return Promise.resolve();
    if (!katexPromise) {
      katexPromise = new Promise((resolve, reject) => {
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css';
        document.head.appendChild(css);
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js';
        s.onload = () => resolve();
        s.onerror = () => { katexPromise = null; reject(new Error('KaTeX failed to load')); };
        document.head.appendChild(s);
      });
    }
    return katexPromise;
  }

  function renderMath(root) {
    if (!root) return;
    const els = Array.from(root.querySelectorAll('.doc-equation[data-latex]'));
    if (!els.length) return;
    loadKatex().then(() => {
      els.forEach(e => {
        try {
          window.katex.render(e.getAttribute('data-latex'), e, {
            displayMode: !e.classList.contains('doc-eq-inline'),
            throwOnError: false
          });
        } catch (_) {
          e.textContent = e.getAttribute('data-latex');
        }
      });
    }).catch(() => {
      els.forEach(e => { e.textContent = e.getAttribute('data-latex'); e.classList.add('doc-eq-raw'); });
    });
  }

  function isDoc(content) {
    return typeof content === 'string' && content.indexOf(MARK) === 0;
  }

  window.CriiDoc = { MARK, sanitize, renderMath, isDoc };
})();
