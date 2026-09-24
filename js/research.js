/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Research Papers & Open Datasets Catalog Script
 */

let allPapers = [];
let allDatasets = [];
let currentCategory = 'all';
let searchQuery = '';
let activeTab = 'papers'; // 'papers' or 'datasets'

document.addEventListener('DOMContentLoaded', async () => {
  await loadResearchData();
  initFilters();
  initTabs();
  initModals();
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
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
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
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
        <p style="font-size: 1.1rem; color: #fff; margin-bottom: 0.5rem;">No publications match your filter criteria.</p>
        <p style="font-size: 0.9rem;">Try selecting a different domain or clearing your search query.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(paper => {
    let badgeClass = 'badge-cyan';
    if (paper.category.includes('Ancient')) badgeClass = 'badge-amber';
    if (paper.category.includes('AI')) badgeClass = 'badge-purple';
    if (paper.category.includes('Astrobiology')) badgeClass = 'badge-emerald';

    return `
      <article class="paper-card">
        <div class="paper-card-top">
          <span class="badge ${badgeClass}">${paper.category}</span>
          <span class="paper-date">${paper.date}</span>
        </div>
        <h3 class="paper-title">
          <a href="article.html?id=${paper.id}">${paper.title}</a>
        </h3>
        <div class="paper-authors">
          <span>✍️ ${paper.authors ? paper.authors.join(' • ') : 'CRII Research Cohort'}</span>
        </div>
        <p class="paper-summary">${paper.summary || paper.abstract.slice(0, 160) + '...'}</p>
        <div class="domain-topics">
          ${(paper.tags || []).map(t => `<span class="tag-item">#${t}</span>`).join('')}
        </div>
        <div class="paper-footer">
          <div class="paper-metrics">
            <span>📥 ${paper.downloads || 0} downloads</span>
            <span>⭐ ${paper.citations || 0} citations</span>
          </div>
          <div style="display:flex;gap:0.5rem;">
            <button class="btn btn-secondary btn-sm" onclick="openCiteModal('${paper.id}')">Cite</button>
            <a href="article.html?id=${paper.id}" class="btn btn-glass btn-sm">Read Paper →</a>
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
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
        <p style="font-size: 1.1rem; color: #fff;">No datasets found for this selection.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(ds => {
    return `
      <div class="dataset-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <span class="badge badge-purple">${ds.category}</span>
          <span style="font-size:0.78rem; font-family:var(--font-mono); color:var(--text-dim);">${ds.version}</span>
        </div>
        <h3 style="font-size:1.25rem; font-weight:700; margin-bottom:0.5rem; color:#fff;">${ds.title}</h3>
        <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.5; margin-bottom:1rem;">${ds.description}</p>
        
        <div class="dataset-meta-grid">
          <div class="meta-block">
            <span class="meta-label">Format</span>
            <span class="meta-val">${ds.format}</span>
          </div>
          <div class="meta-block">
            <span class="meta-label">Data Size</span>
            <span class="meta-val">${ds.size}</span>
          </div>
          <div class="meta-block">
            <span class="meta-label">License</span>
            <span class="meta-val" style="font-size:0.78rem;">${ds.license}</span>
          </div>
        </div>

        <div style="margin-bottom:1rem;">
          <span style="font-size:0.72rem; text-transform:uppercase; color:var(--text-dim); display:block; margin-bottom:0.35rem;">Tracked Features</span>
          <div style="display:flex; flex-wrap:wrap; gap:0.35rem;">
            ${(ds.parameters || []).map(p => `<span class="tag-item">${p}</span>`).join('')}
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:1rem; border-top:1px solid var(--border-subtle);">
          <span style="font-size:0.8rem; color:var(--text-cyan);">Lead: ${ds.leadResearcher}</span>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary btn-sm" onclick="openDatasetPreview('${ds.id}')">Inspect Data</button>
            <button class="btn btn-primary btn-sm" onclick="downloadDataset('${ds.id}')">Download</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Modal logic
function initModals() {
  const closeButtons = document.querySelectorAll('.modal-close, .modal-cancel');
  closeButtons.forEach(btn => {
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

  title.innerText = `Cite: ${paper.title.slice(0, 50)}...`;
  
  const authorsStr = (paper.authors || []).join(', ');
  const year = paper.date ? paper.date.split('-')[0] : '2026';
  
  const apa = `${authorsStr} (${year}). ${paper.title}. Curiomas Research & Innovation Institute. DOI: ${paper.doi || '10.5281/crii.2026'}`;
  const bibtex = `@article{crii_${paper.slug || paper.id},\n  title={${paper.title}},\n  author={${authorsStr}},\n  journal={Curiomas Research & Innovation Institute Preprints},\n  year={${year}},\n  doi={${paper.doi || '10.5281/crii.2026'}}\n}`;

  body.innerHTML = `
    <div style="margin-bottom:1.5rem;">
      <h4 style="font-size:0.85rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:0.4rem;">APA Format</h4>
      <div style="background:rgba(0,0,0,0.4); padding:0.9rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); font-size:0.9rem; line-height:1.5; color:#fff;">
        ${apa}
      </div>
      <button class="btn btn-secondary btn-sm" style="margin-top:0.5rem;" onclick="copyToClipboard(\`${apa.replace(/"/g, '&quot;')}\`, 'APA citation copied!')">Copy APA</button>
    </div>

    <div>
      <h4 style="font-size:0.85rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:0.4rem;">BibTeX</h4>
      <pre style="background:rgba(0,0,0,0.4); padding:0.9rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); font-size:0.82rem; font-family:var(--font-mono); color:var(--text-cyan); overflow-x:auto;">${bibtex}</pre>
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

  title.innerText = `Dataset Inspection: ${ds.title.slice(0, 45)}...`;

  let rowsHtml = '';
  if (ds.previewRows && ds.previewRows.length > 0) {
    const keys = Object.keys(ds.previewRows[0]);
    rowsHtml = `
      <div style="overflow-x:auto; margin:1rem 0; border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
        <table class="admin-table" style="font-size:0.82rem;">
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
    rowsHtml = `<p style="padding:1rem; color:var(--text-dim);">No preview rows available for this format.</p>`;
  }

  body.innerHTML = `
    <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:0.75rem;">${ds.description}</p>
    <div style="font-size:0.82rem; color:var(--cyan-bright); font-family:var(--font-mono); margin-bottom:1rem;">License: ${ds.license} | Schema Version: ${ds.version}</div>
    <h4 style="font-size:0.85rem; text-transform:uppercase; color:var(--text-dim);">First Sample Rows</h4>
    ${rowsHtml}
    <p style="font-size:0.8rem; color:var(--text-dim); margin-top:0.5rem;">Total verified file size: ${ds.size} (${ds.format})</p>
  `;

  modal.classList.add('active');
};

window.downloadDataset = function(dsId) {
  const ds = allDatasets.find(d => d.id === dsId);
  if (!ds) return;

  // Generate downloadable JSON blob on the fly
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ds, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `${ds.id}_data_spec.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  window.showToast(`Downloading dataset specification: ${ds.title.slice(0, 30)}...`, 'success');
};
