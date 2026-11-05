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
    const coverHtml = post.coverImage ? `
      <div class="card-cover">
        <img src="${post.coverImage}" alt="${post.title}" class="card-cover-img" loading="lazy">
      </div>
    ` : '';

    const isEdited = Boolean(post.isEdited || (post.updatedBy && post.updatedAt));
    const editor = post.updatedBy || (post.authors && post.authors[0]) || 'CRII Researcher';
    const creator = post.createdBy || (post.authors && post.authors[0]) || 'CRII Researcher';
    const metaDate = isEdited 
      ? new Date(post.updatedAt || post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      : new Date(post.createdAt || post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    const attributionHtml = isEdited
      ? `<div class="article-meta-attribution" style="margin-bottom:0.75rem;"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg><span>Last edited by <strong>${editor}</strong> on ${metaDate}</span></div>`
      : `<div class="article-meta-attribution" style="margin-bottom:0.75rem;"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>Created by <strong>${creator}</strong> on ${metaDate}</span></div>`;

    return `
      <article class="card" style="padding:0; overflow:hidden;">
        ${coverHtml}
        <div style="padding:1.5rem; display:flex; flex-direction:column; flex:1;">
          <div class="card-top" style="margin-bottom:0.75rem;">
            <span class="badge badge-blue">${post.category}</span>
            <span class="card-date">${post.date} • ${post.readingTime || '8 min read'}</span>
          </div>
          <h2 class="card-title" style="font-size:1.45rem;">
            <a href="/article?id=${post.id}">${post.title}</a>
          </h2>
          <div class="card-authors" style="margin-bottom:0.4rem;">
            By ${post.authors ? post.authors.join(', ') : 'CRII Fellow'}
          </div>
          ${attributionHtml}
          <p class="card-desc" style="flex:1;">${post.summary || (post.abstract ? post.abstract.slice(0, 180) + '...' : '')}</p>
          <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-bottom:1.25rem;">
            ${(post.tags || []).map(t => `<span class="tag-item">#${t}</span>`).join('')}
          </div>
          <div class="card-footer" style="margin-top:auto; padding-top:1rem; border-top:1px solid var(--border-color);">
            <span style="font-size:0.78rem; font-family:monospace; color:var(--text-muted);">${post.doi || 'Open Access'}</span>
            <a href="/article?id=${post.id}" class="btn btn-primary btn-sm">Read Full Dispatch</a>
          </div>
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
