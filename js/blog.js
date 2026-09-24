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
  allArticles = posts.filter(p => p.published);
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
      <div style="text-align:center; padding:3rem; background:var(--bg-card); border-radius:var(--radius-lg); border:1px dashed var(--border-subtle); width:100%;">
        <p style="color:#fff;">No articles found with the tag #${activeTag}.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(post => {
    return `
      <article class="paper-card" style="margin-bottom:2rem;">
        <div class="paper-card-top">
          <span class="badge badge-cyan">${post.category}</span>
          <span class="paper-date">${post.date} • ${post.readingTime || '8 min read'}</span>
        </div>
        <h2 class="paper-title" style="font-size:1.55rem;">
          <a href="article.html?id=${post.id}">${post.title}</a>
        </h2>
        <div class="paper-authors">
          <span>By ${post.authors ? post.authors.join(', ') : 'CRII Contributor'}</span>
        </div>
        <p class="paper-summary">${post.summary || post.abstract.slice(0, 180) + '...'}</p>
        <div class="domain-topics" style="margin-bottom:1.5rem;">
          ${(post.tags || []).map(t => `<span class="tag-item">#${t}</span>`).join('')}
        </div>
        <div class="paper-footer">
          <div class="paper-metrics">
            <span>DOI: ${post.doi || 'Open Research'}</span>
          </div>
          <a href="article.html?id=${post.id}" class="btn btn-primary btn-sm">Read Full Dispatch →</a>
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
    <button class="category-pill ${activeTag === 'all' ? 'active' : ''}" onclick="selectTag('all')">All Topics</button>
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
