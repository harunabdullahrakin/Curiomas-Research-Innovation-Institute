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
        <h1 style="font-size:2rem; margin-bottom:1rem;">Publication Not Found</h1>
        <p style="margin-bottom:2rem;">The requested research paper or article could not be located in our repository.</p>
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
  document.getElementById('postCategory').innerText = post.category;
  document.getElementById('postDate').innerText = post.date;
  document.getElementById('postReadTime').innerText = post.readingTime || '10 min read';
  document.getElementById('postTitle').innerText = post.title;
  document.getElementById('postDoi').innerText = `DOI: ${post.doi || '10.5281/crii.2026'}`;
  document.getElementById('postAuthors').innerText = (post.authors || []).join(' • ');

  // Abstract
  if (post.abstract) {
    document.getElementById('postAbstract').innerHTML = `
      <div style="background:rgba(0, 242, 254, 0.05); border:1px solid rgba(0, 242, 254, 0.2); border-radius:var(--radius-md); padding:1.75rem; margin-bottom:2.5rem;">
        <h3 style="font-size:0.95rem; text-transform:uppercase; letter-spacing:0.08em; color:var(--cyan-bright); margin-bottom:0.75rem;">Abstract</h3>
        <p style="font-size:1.05rem; line-height:1.7; color:var(--text-main); font-style:italic;">${post.abstract}</p>
      </div>
    `;
  }

  // Content (Convert markdown-like syntax to clean HTML)
  const contentEl = document.getElementById('postContent');
  contentEl.innerHTML = parseMarkdownContent(post.content || '');

  // Tags
  const tagsEl = document.getElementById('postTags');
  if (tagsEl && post.tags) {
    tagsEl.innerHTML = post.tags.map(t => `<span class="tag-item">#${t}</span>`).join(' ');
  }

  // Setup Cite Action
  const citeBtn = document.getElementById('citePostBtn');
  if (citeBtn) {
    citeBtn.addEventListener('click', () => {
      const citeStr = `${(post.authors || []).join(', ')} (${post.date ? post.date.split('-')[0] : '2026'}). ${post.title}. Curiomas Research & Innovation Institute. DOI: ${post.doi || '10.5281/crii.2026'}`;
      window.copyToClipboard(citeStr, 'APA Citation copied to clipboard!');
    });
  }

  // Setup Share Action
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
  html = html.replace(/^### (.*$)/gim, '<h3 style="font-size:1.4rem; margin:2rem 0 1rem; color:#fff;">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="font-size:1.7rem; margin:2.5rem 0 1rem; color:#fff;">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 style="font-size:2rem; margin:3rem 0 1.25rem; color:#fff;">$1</h1>');

  // Math blocks
  html = html.replace(/\$\$(.*?)\$\$/gs, '<div style="background:rgba(0,0,0,0.5); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); margin:1.5rem 0; font-family:var(--font-mono); color:var(--cyan-bright); text-align:center; overflow-x:auto;">$$$1$$</div>');

  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Unordered list
  html = html.replace(/^\s*-\s+(.*$)/gim, '<li style="margin-left:1.5rem; margin-bottom:0.5rem; color:var(--text-muted);">$1</li>');

  // Paragraphs
  const paragraphs = html.split('\n\n');
  return paragraphs.map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<h') || p.startsWith('<div') || p.startsWith('<li')) return p;
    return `<p style="font-size:1.1rem; line-height:1.8; margin-bottom:1.5rem; color:#cbd5e1;">${p}</p>`;
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
