/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Blog & Dispatches Script
 */

let allArticles = [];
let activeTag = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  await loadArticles();
  initTagFilter();
});

async function loadArticles() {
  const posts = await window.CRII_API.getPosts();
  allArticles = posts.filter(p => p.published !== false);
  renderArticles();
  renderPopularTags();
}

function renderArticles() {
  const container = document.getElementById('blogContainer');
  if (!container) return;

  const filtered = allArticles.filter(art => {
    if (activeTag === 'all') return true;
    return art.tags && art.tags.some(t => t.toLowerCase() === activeTag.toLowerCase());
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:3rem; background:var(--bg-surface); border-radius:16px; border:1px dashed var(--border-color); width:100%;">
        <p style="color:var(--text-muted);">No dispatches found under tag #${activeTag}.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(post => {
    return `
      <article class="card">
        <div class="card-top">
          <span class="badge badge-blue">${post.category}</span>
          <span class="card-date">${post.date} • ${post.readingTime || '8 min read'}</span>
        </div>
        <h2 class="card-title" style="font-size:1.45rem;">
          <a href="article.html?id=${post.id}">${post.title}</a>
        </h2>
        <div class="card-authors">
          By ${post.authors ? post.authors.join(', ') : 'CRII Fellow'}
        </div>
        <p class="card-desc">${post.summary || post.abstract.slice(0, 180) + '...'}</p>
        <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-bottom:1.25rem;">
          ${(post.tags || []).map(t => `<span class="tag-item">#${t}</span>`).join('')}
        </div>
        <div class="card-footer">
          <span style="font-size:0.78rem; font-family:monospace; color:var(--text-muted);">${post.doi || 'Open Access'}</span>
          <a href="article.html?id=${post.id}" class="btn btn-primary btn-sm">Read Full Dispatch</a>
        </div>
      </article>
    `;
  }).join('');
}

function renderPopularTags() {
  const tagContainer = document.getElementById('tagList');
  if (!tagContainer) return;

  const tagCounts = {};
  allArticles.forEach(a => {
    (a.tags || []).forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });

  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);

  tagContainer.innerHTML = `
    <button class="category-pill ${activeTag === 'all' ? 'active' : ''}" onclick="selectTag('all')">All Dispatches</button>
    ${sortedTags.map(t => `
      <button class="category-pill ${activeTag.toLowerCase() === t.toLowerCase() ? 'active' : ''}" onclick="selectTag('${t}')">
        #${t} (${tagCounts[t]})
      </button>
    `).join('')}
  `;
}

window.selectTag = function(tag) {
  activeTag = tag;
  renderArticles();
  renderPopularTags();
};
