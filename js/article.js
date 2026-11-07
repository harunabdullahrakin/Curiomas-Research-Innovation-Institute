async function initArticleReader(explicitId = null) {
  const urlParams = new URLSearchParams(window.location.search);
  const identifier = explicitId || urlParams.get('id') || urlParams.get('slug');

  const container = document.getElementById('articleContainer');
  if (!container) return;

  if (!identifier) {
    container.innerHTML = `
      <div style="text-align:center; padding:5rem 1rem;">
        <h1 style="font-size:2rem; margin-bottom:1rem; color:var(--text-primary);">Scientific Dispatch</h1>
        <p style="margin-bottom:2rem; color:var(--text-muted);">No article was selected. Please explore our open publications catalog.</p>
        <a href="/research" class="btn btn-primary">Browse Research Catalog</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="text-align:center; padding:5rem 1rem; color:var(--text-muted);">
      <div style="width:36px; height:36px; border:3px solid var(--border-color); border-top-color:var(--accent-primary); border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 1.5rem auto;"></div>
      <p style="font-size:1.1rem; font-weight:600; color:var(--text-primary);">Loading scientific publication...</p>
    </div>
  `;

  let post = null;
  try {
    if (window.CRII_API && typeof window.CRII_API.getPostBySlugOrId === 'function') {
      post = await window.CRII_API.getPostBySlugOrId(identifier);
    } else {
      const res = await fetch(`/api/posts/${encodeURIComponent(identifier)}`);
      if (res.ok) post = await res.json();
    }
  } catch (err) {
    console.error('Failed to load article:', err);
  }

  if (!post) {
    container.innerHTML = `
      <div style="text-align:center; padding:5rem 1rem;">
        <h1 style="font-size:2rem; margin-bottom:1rem; color:var(--text-primary);">Publication Not Found</h1>
        <p style="margin-bottom:2rem; color:var(--text-muted);">The requested research publication could not be located in our repository.</p>
        <a href="/research" class="btn btn-primary">Back to Research Catalog</a>
      </div>
    `;
    return;
  }

  renderArticle(post, container);
  initScrollProgress();
}
window.initArticleReader = initArticleReader;

document.addEventListener('DOMContentLoaded', async () => {
  await initArticleReader();
});

function renderArticle(post, container) {
  document.title = `${post.title || 'Publication'} — CRII Publications`;

  const heroTitle = document.getElementById('postHeroTitle');
  if (heroTitle) heroTitle.innerText = post.title || '';
  const heroCategory = document.getElementById('postCategoryHero');
  if (heroCategory) heroCategory.innerText = post.category || 'Article';

  const authorsList = (post.authors && post.authors.length) ? post.authors.join(' • ') : 'CRII Researcher';
  const readTime = post.readingTime || '5 min read';
  const doi = post.doi ? `DOI: ${post.doi}` : 'DOI: 10.5281/crii.2026';
  const dateStr = post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '2026');

  let updatedNotice = '';
  if (post.isEdited || (post.updatedBy && post.updatedAt)) {
    const editor = post.updatedBy || 'CRII Researcher';
    const updatedDate = new Date(post.updatedAt || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    updatedNotice = `Last edited by ${editor} on ${updatedDate}`;
  } else {
    const creator = post.createdBy || authorsList.split('•')[0].trim();
    updatedNotice = `Created by ${creator} on ${dateStr}`;
  }

  let coverHtml = '';
  if (post.coverImage) {
    coverHtml = `
      <div class="article-cover-wrapper" style="margin-bottom:2.5rem; border-radius:16px; overflow:hidden; border:1px solid #e5dfd5; box-shadow:0 8px 30px rgba(0,0,0,0.06);">
        <img src="${post.coverImage}" alt="${post.title || ''}" class="article-cover-img" style="width:100%; max-height:480px; object-fit:cover; display:block;" onerror="this.parentElement.style.display='none'">
      </div>
    `;
  }

  let abstractHtml = '';
  if (post.abstract || post.summary) {
    const text = post.abstract || post.summary;
    abstractHtml = `
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:1.75rem; margin-bottom:2.5rem; box-shadow:0 2px 8px rgba(0,0,0,0.02);">
        <h3 style="font-size:0.85rem; text-transform:uppercase; letter-spacing:0.08em; color:#0284c7; font-weight:700; margin-bottom:0.75rem;">Abstract</h3>
        <p style="font-size:1.05rem; line-height:1.75; color:#334155; font-style:italic; margin:0;">${text}</p>
      </div>
    `;
  }

  let contentBodyHtml = '';
  if (Array.isArray(post.blocks) && post.blocks.length > 0) {
    contentBodyHtml = post.blocks.map(b => renderBlockToHtml(b)).join('');
  } else if (window.CriiDoc && window.CriiDoc.isDoc(post.content)) {
    contentBodyHtml = '<div class="crii-doc">' + window.CriiDoc.sanitize(post.content.slice(window.CriiDoc.MARK.length)) + '</div>';
  } else {
    contentBodyHtml = parseMarkdownContent(post.content || '');
  }

  let tagsHtml = '';
  if (Array.isArray(post.tags) && post.tags.length > 0) {
    tagsHtml = post.tags.map(t => `<span class="tag-item" style="display:inline-block; padding:0.25rem 0.75rem; background:#f1f5f9; color:#475569; border-radius:9999px; font-size:0.82rem; font-weight:600;">#${t}</span>`).join(' ');
  }

  container.innerHTML = `
    <div style="margin-bottom: 2.75rem;">
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; font-size: 0.86rem; color: #64748b; flex-wrap: wrap;">
        <span>${dateStr}</span>
        <span>•</span>
        <span>${readTime}</span>
        <span>•</span>
        <span style="color: #0284c7; font-family: monospace;">${doi}</span>
      </div>

      <h1 style="font-size: 2.65rem; line-height: 1.2; margin-bottom: 1.25rem; color: #0f172a; letter-spacing: -0.025em; font-weight:800;">${post.title || ''}</h1>

      <div style="font-size: 1.05rem; color: #475569; margin-bottom: 1.25rem;">
        <strong>Authors:</strong> <span style="color: #0f172a; font-weight: 600;">${authorsList}</span>
      </div>

      <div style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1.75rem; font-size: 0.82rem; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); padding: 0.35rem 0.85rem; border-radius: 9999px; color: #047857; font-weight: 600;">
        <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #10b981;"></span>
        <span>${updatedNotice}</span>
      </div>

      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; padding: 1.25rem 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
        <button id="citePostBtn" class="btn btn-secondary btn-sm" style="border-radius: 9999px;">Cite This Paper</button>
        <button id="sharePostBtn" class="btn btn-secondary btn-sm" style="border-radius: 9999px;">Share Article</button>
        <a href="/research" class="btn btn-glass btn-sm" style="border-radius: 9999px;">Browse Datasets</a>
      </div>
    </div>

    ${coverHtml}
    ${abstractHtml}

    <article id="postContent" style="margin-bottom: 4rem; line-height: 1.85; font-size: 1.1rem; color: #334155;">
      ${contentBodyHtml}
    </article>

    ${tagsHtml ? `
      <div style="padding: 1.75rem 0; border-top: 1px solid #e2e8f0; margin-bottom: 3.5rem;">
        <span style="font-size: 0.78rem; text-transform: uppercase; color: #64748b; font-weight: 700; display: block; margin-bottom: 0.65rem; letter-spacing: 0.08em;">Keywords</span>
        <div style="display: flex; flex-wrap: wrap; gap: 0.45rem;">${tagsHtml}</div>
      </div>
    ` : ''}

    <div style="background: #ffffff; padding: 2rem; display: flex; gap: 1.25rem; align-items: center; border-radius: 14px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
      <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(2, 132, 199, 0.1); color: #0284c7; display: grid; place-items: center; flex-shrink: 0;">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
      </div>
      <div>
        <h4 style="font-size: 1.15rem; margin-bottom: 0.35rem; color: #0f172a; font-weight:700;">Curiomas Research & Innovation Institute</h4>
        <p style="font-size: 0.92rem; line-height: 1.6; color: #64748b; margin: 0;">
          Authored by student researchers at CRII under open science principles. "Turning Curiosity into Action."
        </p>
      </div>
    </div>
  `;

  if (window.CriiDoc && typeof window.CriiDoc.renderMath === 'function') {
    const postArticleEl = document.getElementById('postContent');
    if (postArticleEl) window.CriiDoc.renderMath(postArticleEl);
  }

  const citeBtn = document.getElementById('citePostBtn');
  if (citeBtn) {
    citeBtn.addEventListener('click', () => {
      const citeStr = `${authorsList} (${dateStr.split('-')[0]}). ${post.title}. Curiomas Research & Innovation Institute. ${doi}`;
      if (typeof window.copyToClipboard === 'function') {
        window.copyToClipboard(citeStr, 'APA Citation copied to clipboard!');
      } else {
        navigator.clipboard.writeText(citeStr).then(() => alert('Citation copied to clipboard!'));
      }
    });
  }

  const shareBtn = document.getElementById('sharePostBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (typeof window.copyToClipboard === 'function') {
        window.copyToClipboard(window.location.href, 'Article link copied to clipboard!');
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => alert('Article link copied!'));
      }
    });
  }
}

function renderBlockToHtml(block) {
  if (!block) return '';
  const type = block.type || 'text';
  const c = block.content || '';

  switch (type) {
    case 'heading': {
      const level = block.level || 2;
      return `<h${level} style="font-size:${level === 1 ? '2.1rem' : level === 2 ? '1.65rem' : '1.35rem'}; color:#0f172a; font-weight:800; margin:2.25rem 0 1rem 0;">${c}</h${level}>`;
    }
    case 'quote':
      return `<blockquote style="border-left:4px solid #0284c7; padding:1rem 1.5rem; margin:1.75rem 0; background:#f8fafc; color:#334155; font-style:italic; border-radius:0 10px 10px 0;">${c}</blockquote>`;
    case 'callout':
      return `<div style="background:#eff6ff; border:1px solid #bfdbfe; border-left:4px solid #3b82f6; padding:1.25rem 1.5rem; border-radius:8px; margin:1.75rem 0; color:#1e40af;">${c}</div>`;
    case 'code':
      return `<pre style="background:#0f172a; color:#f8fafc; padding:1.25rem; border-radius:10px; overflow-x:auto; margin:1.75rem 0; font-family:monospace; font-size:0.92rem;"><code>${escapeHtml(c)}</code></pre>`;
    case 'math':
      return `<div style="background:#f8fafc; padding:1.25rem; border-radius:10px; border:1px solid #e2e8f0; margin:1.75rem 0; font-family:monospace; color:#0284c7; text-align:center; overflow-x:auto;">$$${c}$$</div>`;
    case 'image':
      return `<figure style="margin:2rem 0; text-align:center;"><img src="${block.url || c}" alt="${block.caption || ''}" style="max-width:100%; border-radius:12px; box-shadow:0 4px 16px rgba(0,0,0,0.06);"><figcaption style="font-size:0.85rem; color:#64748b; margin-top:0.5rem; font-style:italic;">${block.caption || ''}</figcaption></figure>`;
    case 'divider':
      return `<hr style="border:none; border-top:1px solid #e2e8f0; margin:2.5rem 0;">`;
    case 'text':
    default:
      return `<p style="font-size:1.08rem; line-height:1.85; margin-bottom:1.5rem; color:#334155;">${c}</p>`;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseMarkdownContent(md) {
  let html = md;
  html = html.replace(/^### (.*$)/gim, '<h3 style="font-size:1.35rem; margin:2.25rem 0 1rem; color:#0f172a; font-weight:700;">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="font-size:1.65rem; margin:2.75rem 0 1rem; color:#0f172a; font-weight:800;">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 style="font-size:2rem; margin:3rem 0 1.25rem; color:#0f172a; font-weight:800;">$1</h1>');
  html = html.replace(/\$\$(.*?)\$\$/gs, '<div style="background:#f8fafc; padding:1.25rem; border-radius:12px; border:1px solid #e2e8f0; margin:1.5rem 0; font-family:monospace; color:#0284c7; text-align:center; overflow-x:auto;">$$$1$$</div>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/^\s*-\s+(.*$)/gim, '<li style="margin-left:1.5rem; margin-bottom:0.5rem; color:#475569;">$1</li>');

  const paragraphs = html.split('\n\n');
  return paragraphs.map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<h') || p.startsWith('<div') || p.startsWith('<li') || p.startsWith('<blockquote') || p.startsWith('<pre')) return p;
    return `<p style="font-size:1.08rem; line-height:1.85; margin-bottom:1.5rem; color:#334155;">${p}</p>`;
  }).join('');
}

function initScrollProgress() {
  const bar = document.getElementById('readProgressBar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  });
}
