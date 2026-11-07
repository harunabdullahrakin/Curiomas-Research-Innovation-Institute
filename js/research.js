/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Research Publications & Open Datasets Catalog
 * Zero Unicode Emojis — Clean Vector SVGs
 */

let allPapers = [];
let allDatasets = [];
let currentCategory = 'all';
let searchQuery = '';
let activeTab = 'papers';

async function initResearchCatalog() {
  await loadResearchData();
  initFilters();
  initTabs();
  initModals();
}
window.initResearchCatalog = initResearchCatalog;

document.addEventListener('DOMContentLoaded', async () => {
  await initResearchCatalog();
});

async function loadResearchData() {
  allPapers = await window.CRII_API.getPosts();
  allDatasets = await window.CRII_API.getDatasets();
  renderContent();
}

function initTabs() {
  const tabs = document.querySelectorAll('.catalog-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active', 'btn-primary');
        t.classList.add('btn-secondary');
      });
      tab.classList.add('active', 'btn-primary');
      tab.classList.remove('btn-secondary');
      activeTab = tab.dataset.tab;
      renderContent();
    });
  });
}

function initFilters() {
  const pills = document.querySelectorAll('.category-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.dataset.category;
      renderContent();
    });
  });

  const searchInput = document.getElementById('researchSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderContent();
    });
  }
}

function renderContent() {
  const papersContainer = document.getElementById('papersContainer');
  const datasetsContainer = document.getElementById('datasetsContainer');

  if (activeTab === 'papers') {
    papersContainer.style.display = 'grid';
    datasetsContainer.style.display = 'none';
    renderPapers();
  } else {
    papersContainer.style.display = 'none';
    datasetsContainer.style.display = 'grid';
    renderDatasets();
  }
}

function renderPapers() {
  const container = document.getElementById('papersContainer');
  if (!container) return;

  const filtered = allPapers.filter(paper => {
    const matchesCategory = currentCategory === 'all' || paper.category.toLowerCase().includes(currentCategory.toLowerCase());
    const matchesSearch = !searchQuery || 
      paper.title.toLowerCase().includes(searchQuery) ||
      (paper.summary && paper.summary.toLowerCase().includes(searchQuery)) ||
      (paper.authors && paper.authors.some(a => a.toLowerCase().includes(searchQuery))) ||
      (paper.tags && paper.tags.some(t => t.toLowerCase().includes(searchQuery)));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-surface); border-radius: 16px; border: 1px dashed var(--border-color);">
        <p style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 0.5rem;">No publications match your criteria.</p>
        <p style="font-size: 0.9rem; color: var(--text-muted);">Try selecting a different division or clearing your search query.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(paper => {
    let badgeClass = 'badge-blue';
    if (paper.category.includes('Ancient')) badgeClass = 'badge-amber';
    if (paper.category.includes('AI')) badgeClass = 'badge-indigo';
    if (paper.category.includes('Astrobiology')) badgeClass = 'badge-emerald';

    const coverHtml = paper.coverImage ? `
      <div class="card-cover">
        <img src="${paper.coverImage}" alt="${paper.title}" class="card-cover-img" loading="lazy">
      </div>
    ` : '';

    const isEdited = Boolean(paper.isEdited || (paper.updatedBy && paper.updatedAt));
    const editor = paper.updatedBy || (paper.authors && paper.authors[0]) || 'CRII Researcher';
    const creator = paper.createdBy || (paper.authors && paper.authors[0]) || 'CRII Researcher';
    const metaDate = isEdited 
      ? new Date(paper.updatedAt || paper.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      : new Date(paper.createdAt || paper.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    const attributionHtml = isEdited
      ? `<div class="article-meta-attribution" style="margin-bottom:0.75rem;"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg><span>Last edited by <strong>${editor}</strong> on ${metaDate}</span></div>`
      : `<div class="article-meta-attribution" style="margin-bottom:0.75rem;"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>Created by <strong>${creator}</strong> on ${metaDate}</span></div>`;

    return `
      <article class="card" style="padding:0; overflow:hidden;">
        ${coverHtml}
        <div style="padding:1.5rem; display:flex; flex-direction:column; flex:1;">
          <div class="card-top" style="margin-bottom:0.75rem;">
            <span class="badge ${badgeClass}">${paper.category}</span>
            <span class="card-date">${paper.date}</span>
          </div>
          <h3 class="card-title">
            <a href="/article?id=${paper.id}">${paper.title}</a>
          </h3>
          <div class="card-authors" style="margin-bottom:0.5rem;">
            ${paper.authors ? paper.authors.join(' • ') : 'CRII Fellows'}
          </div>
          ${attributionHtml}
          <p class="card-desc" style="flex:1;">${paper.summary || (paper.abstract ? paper.abstract.slice(0, 150) + '...' : '')}</p>
          <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-bottom:1.25rem;">
            ${(paper.tags || []).map(t => `<span class="tag-item">#${t}</span>`).join('')}
          </div>
          <div class="card-footer" style="margin-top:auto; padding-top:1rem; border-top:1px solid var(--border-color);">
            <span style="font-size: 0.76rem; font-family: monospace; color: var(--text-muted);">${paper.doi || 'Open Research'}</span>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-secondary btn-sm" onclick="openCiteModal('${paper.id}')">Cite</button>
              <a href="/article?id=${paper.id}" class="btn btn-primary btn-sm">Read Article</a>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function renderDatasets() {
  const container = document.getElementById('datasetsContainer');
  if (!container) return;

  const filtered = allDatasets.filter(ds => {
    const matchesCategory = currentCategory === 'all' || ds.category.toLowerCase().includes(currentCategory.toLowerCase());
    const matchesSearch = !searchQuery || 
      ds.title.toLowerCase().includes(searchQuery) ||
      (ds.description && ds.description.toLowerCase().includes(searchQuery)) ||
      (ds.parameters && ds.parameters.some(p => p.toLowerCase().includes(searchQuery)));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-surface); border-radius: 16px; border: 1px dashed var(--border-color);">
        <p style="font-size: 1.1rem; color: var(--text-primary);">No datasets found for this selection.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(ds => {
    return `
      <div class="card">
        <div class="card-top">
          <span class="badge badge-indigo">${ds.category}</span>
          <span style="font-size:0.78rem; font-family:monospace; color:var(--text-muted);">${ds.version}</span>
        </div>
        <h3 class="card-title">${ds.title}</h3>
        <p class="card-desc">${ds.description}</p>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; background: var(--bg-primary); padding: 0.75rem; border-radius: 10px; margin-bottom: 1.25rem; font-size: 0.8rem;">
          <div>
            <div style="color:var(--text-muted); font-size:0.7rem; text-transform:uppercase;">Format</div>
            <div style="font-weight:600; color:var(--text-primary); font-family:monospace;">${ds.format}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); font-size:0.7rem; text-transform:uppercase;">Size</div>
            <div style="font-weight:600; color:var(--text-primary); font-family:monospace;">${ds.size}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); font-size:0.7rem; text-transform:uppercase;">License</div>
            <div style="font-weight:600; color:var(--text-primary); font-size:0.72rem;">${ds.license}</div>
          </div>
        </div>

        <div class="card-footer">
          <span style="font-size:0.8rem; color:var(--accent-primary);">Lead: ${ds.leadResearcher}</span>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary btn-sm" onclick="openDatasetPreview('${ds.id}')">Inspect</button>
            <button class="btn btn-primary btn-sm" onclick="downloadDataset('${ds.id}')">Download</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Modal logic
function initModals() {
  document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    });
  });
}

window.openCiteModal = function(paperId) {
  const paper = allPapers.find(p => p.id === paperId);
  if (!paper) return;

  const modal = document.getElementById('citeModal');
  const body = document.getElementById('citeModalBody');
  const title = document.getElementById('citeModalTitle');

  title.innerText = `Cite: ${paper.title.slice(0, 45)}...`;
  
  const authorsStr = (paper.authors || []).join(', ');
  const year = paper.date ? paper.date.split('-')[0] : '2026';
  
  const apa = `${authorsStr} (${year}). ${paper.title}. Curiomas Research & Innovation Institute. DOI: ${paper.doi || '10.5281/crii.2026'}`;
  const bibtex = `@article{crii_${paper.slug || paper.id},\n  title={${paper.title}},\n  author={${authorsStr}},\n  journal={Curiomas Research & Innovation Institute Preprints},\n  year={${year}},\n  doi={${paper.doi || '10.5281/crii.2026'}}\n}`;

  body.innerHTML = `
    <div style="margin-bottom:1.5rem;">
      <h4 style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.4rem; font-weight:700;">APA Citation Format</h4>
      <div style="background:var(--bg-primary); padding:0.9rem; border-radius:8px; border:1px solid var(--border-color); font-size:0.88rem; line-height:1.5; color:var(--text-primary);">
        ${apa}
      </div>
      <button class="btn btn-secondary btn-sm" style="margin-top:0.5rem;" onclick="copyToClipboard(\`${apa.replace(/"/g, '&quot;')}\`, 'APA citation copied!')">Copy APA</button>
    </div>

    <div>
      <h4 style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.4rem; font-weight:700;">BibTeX</h4>
      <pre style="background:var(--bg-primary); padding:0.9rem; border-radius:8px; border:1px solid var(--border-color); font-size:0.8rem; font-family:monospace; color:var(--accent-primary); overflow-x:auto;">${bibtex}</pre>
      <button class="btn btn-secondary btn-sm" style="margin-top:0.5rem;" onclick="copyToClipboard(\`${bibtex.replace(/"/g, '&quot;')}\`, 'BibTeX copied!')">Copy BibTeX</button>
    </div>
  `;

  modal.classList.add('active');
};

window.openDatasetPreview = function(dsId) {
  const ds = allDatasets.find(d => d.id === dsId);
  if (!ds) return;

  const modal = document.getElementById('datasetModal');
  const body = document.getElementById('datasetModalBody');
  const title = document.getElementById('datasetModalTitle');

  title.innerText = `Inspect Dataset: ${ds.title.slice(0, 45)}...`;

  let rowsHtml = '';
  if (ds.previewRows && ds.previewRows.length > 0) {
    const keys = Object.keys(ds.previewRows[0]);
    rowsHtml = `
      <div style="overflow-x:auto; margin:1rem 0; border:1px solid var(--border-color); border-radius:10px;">
        <table class="admin-table" style="font-size:0.8rem;">
          <thead>
            <tr>${keys.map(k => `<th>${k}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${ds.previewRows.map(row => `
              <tr>${keys.map(k => `<td>${row[k]}</td>`).join('')}</tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else {
    rowsHtml = `<p style="padding:1rem; color:var(--text-muted);">Tabular preview specification is packaged inside download bundle.</p>`;
  }

  body.innerHTML = `
    <p style="color:var(--text-secondary); font-size:0.92rem; margin-bottom:0.75rem;">${ds.description}</p>
    <div style="font-size:0.82rem; color:var(--accent-primary); font-family:monospace; margin-bottom:1rem;">License: ${ds.license} | Version: ${ds.version}</div>
    <h4 style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Sample Feature Rows</h4>
    ${rowsHtml}
    <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.5rem;">File size: ${ds.size} (${ds.format})</p>
  `;

  modal.classList.add('active');
};

window.downloadDataset = function(dsId) {
  const ds = allDatasets.find(d => d.id === dsId);
  if (!ds) return;

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ds, null, 2));
  const a = document.createElement('a');
  a.setAttribute("href", dataStr);
  a.setAttribute("download", `${ds.id}_data_spec.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.showToast(`Downloading dataset specification: ${ds.title.slice(0, 30)}...`, 'success');
};
