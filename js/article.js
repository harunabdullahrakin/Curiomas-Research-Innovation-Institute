/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Full Article & Research Paper Reader View
 */

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const identifier = urlParams.get('id') || urlParams.get('slug') || 'crii-paper-2026-001';

  const post = await window.CRII_API.getPostBySlugOrId(identifier);

  if (!post) {
    document.getElementById('articleContainer').innerHTML = `
      <div style="text-align:center; padding:5rem 1rem;">
        <h1 style="font-size:2rem; margin-bottom:1rem; color:var(--text-primary);">Publication Not Found</h1>
        <p style="margin-bottom:2rem; color:var(--text-muted);">The requested research publication could not be located in our repository.</p>
        <a href="research.html" class="btn btn-primary">Back to Research Catalog</a>
      </div>
    `;
    return;
  }

  renderArticle(post);
  initScrollProgress();
});

function renderArticle(post) {
  document.title = `${post.title} — CRII Publications`;

  // Meta headers
  const categoryEl = document.getElementById('postCategory');
  if (categoryEl) categoryEl.innerText = post.category;
  const dateEl = document.getElementById('postDate');
  if (dateEl) dateEl.innerText = post.date;
  const readTimeEl = document.getElementById('postReadTime');
  if (readTimeEl) readTimeEl.innerText = post.readingTime || '10 min read';
  const titleEl = document.getElementById('postTitle');
  if (titleEl) titleEl.innerText = post.title;
  const doiEl = document.getElementById('postDoi');
  if (doiEl) doiEl.innerText = `DOI: ${post.doi || '10.5281/crii.2026'}`;
  const authorsEl = document.getElementById('postAuthors');
  if (authorsEl) authorsEl.innerText = (post.authors || []).join(' • ');

  // Updated By & Timestamp
  const updatedEl = document.getElementById('postUpdatedText');
  if (updatedEl) {
    const editor = post.updatedBy || (post.authors && post.authors[0]) || 'Lead Investigator';
    const dateStr = post.updatedAt ? new Date(post.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : (post.date || '2026-03-14');
    updatedEl.innerText = `Revised by ${editor} on ${dateStr}`;
  }

  // Cover Image
  const coverWrapper = document.getElementById('postCoverWrapper');
  if (coverWrapper) {
    if (post.coverImage) {
      coverWrapper.innerHTML = `
        <div class="article-cover-wrapper">
          <img src="${post.coverImage}" alt="${post.title}" class="article-cover-img" loading="eager" onerror="this.parentElement.style.display='none'">
        </div>
      `;
    } else {
      coverWrapper.innerHTML = '';
    }
  }

  // Abstract
  const abstractEl = document.getElementById('postAbstract');
  if (abstractEl && post.abstract) {
    abstractEl.innerHTML = `
      <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:14px; padding:1.75rem; margin-bottom:2.5rem; box-shadow:var(--shadow-sm);">
        <h3 style="font-size:0.85rem; text-transform:uppercase; letter-spacing:0.08em; color:var(--accent-primary); font-weight:700; margin-bottom:0.75rem;">Abstract</h3>
        <p style="font-size:1.02rem; line-height:1.7; color:var(--text-secondary); font-style:italic;">${post.abstract}</p>
      </div>
    `;
  }

  // Content
  const contentEl = document.getElementById('postContent');
  if (contentEl) {
    contentEl.innerHTML = parseMarkdownContent(post.content || '');
  }

  // Tags
  const tagsEl = document.getElementById('postTags');
  if (tagsEl && post.tags) {
    tagsEl.innerHTML = post.tags.map(t => `<span class="tag-item">#${t}</span>`).join(' ');
  }

  // Cite Action
  const citeBtn = document.getElementById('citePostBtn');
  if (citeBtn) {
    citeBtn.addEventListener('click', () => {
      const citeStr = `${(post.authors || []).join(', ')} (${post.date ? post.date.split('-')[0] : '2026'}). ${post.title}. Curiomas Research & Innovation Institute. DOI: ${post.doi || '10.5281/crii.2026'}`;
      window.copyToClipboard(citeStr, 'APA Citation copied to clipboard!');
    });
  }

  // Share Action
  const shareBtn = document.getElementById('sharePostBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      window.copyToClipboard(window.location.href, 'Article link copied to clipboard!');
    });
  }
}

function parseMarkdownContent(md) {
  let html = md;

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3 style="font-size:1.35rem; margin:2.25rem 0 1rem; color:var(--text-primary); font-weight:700;">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="font-size:1.65rem; margin:2.75rem 0 1rem; color:var(--text-primary); font-weight:800;">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 style="font-size:2rem; margin:3rem 0 1.25rem; color:var(--text-primary); font-weight:800;">$1</h1>');

  // Math blocks
  html = html.replace(/\$\$(.*?)\$\$/gs, '<div style="background:var(--bg-surface); padding:1.25rem; border-radius:12px; border:1px solid var(--border-color); margin:1.5rem 0; font-family:monospace; color:var(--accent-primary); text-align:center; overflow-x:auto;">$$$1$$</div>');

  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Unordered list
  html = html.replace(/^\s*-\s+(.*$)/gim, '<li style="margin-left:1.5rem; margin-bottom:0.5rem; color:var(--text-secondary);">$1</li>');

  // Paragraphs
  const paragraphs = html.split('\n\n');
  return paragraphs.map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<h') || p.startsWith('<div') || p.startsWith('<li')) return p;
    return `<p style="font-size:1.05rem; line-height:1.8; margin-bottom:1.5rem; color:var(--text-secondary);">${p}</p>`;
  }).join('');
}

function initScrollProgress() {
  const bar = document.getElementById('readProgressBar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  });
}
