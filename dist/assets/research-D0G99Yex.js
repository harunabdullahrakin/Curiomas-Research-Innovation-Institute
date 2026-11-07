import"./config-WQoC_c_K.js";import"./app-a7Or-imY.js";var e=[],t=[],n=`all`,r=``,i=`papers`;document.addEventListener(`DOMContentLoaded`,async()=>{await a(),s(),o(),d()});async function a(){e=await window.CRII_API.getPosts(),t=await window.CRII_API.getDatasets(),c()}function o(){let e=document.querySelectorAll(`.catalog-tab`);e.forEach(t=>{t.addEventListener(`click`,()=>{e.forEach(e=>{e.classList.remove(`active`,`btn-primary`),e.classList.add(`btn-secondary`)}),t.classList.add(`active`,`btn-primary`),t.classList.remove(`btn-secondary`),i=t.dataset.tab,c()})})}function s(){let e=document.querySelectorAll(`.category-pill`);e.forEach(t=>{t.addEventListener(`click`,()=>{e.forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),n=t.dataset.category,c()})});let t=document.getElementById(`researchSearch`);t&&t.addEventListener(`input`,e=>{r=e.target.value.toLowerCase().trim(),c()})}function c(){let e=document.getElementById(`papersContainer`),t=document.getElementById(`datasetsContainer`);i===`papers`?(e.style.display=`grid`,t.style.display=`none`,l()):(e.style.display=`none`,t.style.display=`grid`,u())}function l(){let t=document.getElementById(`papersContainer`);if(!t)return;let i=e.filter(e=>{let t=n===`all`||e.category.toLowerCase().includes(n.toLowerCase()),i=!r||e.title.toLowerCase().includes(r)||e.summary&&e.summary.toLowerCase().includes(r)||e.authors&&e.authors.some(e=>e.toLowerCase().includes(r))||e.tags&&e.tags.some(e=>e.toLowerCase().includes(r));return t&&i});t.innerHTML=i.length===0?`
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-surface); border-radius: 16px; border: 1px dashed var(--border-color);">
        <p style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 0.5rem;">No publications match your criteria.</p>
        <p style="font-size: 0.9rem; color: var(--text-muted);">Try selecting a different division or clearing your search query.</p>
      </div>
    `:i.map(e=>{let t=`badge-blue`;e.category.includes(`Ancient`)&&(t=`badge-amber`),e.category.includes(`AI`)&&(t=`badge-indigo`),e.category.includes(`Astrobiology`)&&(t=`badge-emerald`);let n=e.coverImage?`
      <div class="card-cover">
        <img src="${e.coverImage}" alt="${e.title}" class="card-cover-img" loading="lazy">
      </div>
    `:``,r=!!(e.isEdited||e.updatedBy&&e.updatedAt),i=e.updatedBy||e.authors&&e.authors[0]||`CRII Researcher`,a=e.createdBy||e.authors&&e.authors[0]||`CRII Researcher`,o=r?new Date(e.updatedAt||e.date).toLocaleDateString(void 0,{year:`numeric`,month:`short`,day:`numeric`}):new Date(e.createdAt||e.date).toLocaleDateString(void 0,{year:`numeric`,month:`short`,day:`numeric`}),s=r?`<div class="article-meta-attribution" style="margin-bottom:0.75rem;"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg><span>Last edited by <strong>${i}</strong> on ${o}</span></div>`:`<div class="article-meta-attribution" style="margin-bottom:0.75rem;"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>Created by <strong>${a}</strong> on ${o}</span></div>`;return`
      <article class="card" style="padding:0; overflow:hidden;">
        ${n}
        <div style="padding:1.5rem; display:flex; flex-direction:column; flex:1;">
          <div class="card-top" style="margin-bottom:0.75rem;">
            <span class="badge ${t}">${e.category}</span>
            <span class="card-date">${e.date}</span>
          </div>
          <h3 class="card-title">
            <a href="/article?id=${e.id}">${e.title}</a>
          </h3>
          <div class="card-authors" style="margin-bottom:0.5rem;">
            ${e.authors?e.authors.join(` • `):`CRII Fellows`}
          </div>
          ${s}
          <p class="card-desc" style="flex:1;">${e.summary||(e.abstract?e.abstract.slice(0,150)+`...`:``)}</p>
          <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-bottom:1.25rem;">
            ${(e.tags||[]).map(e=>`<span class="tag-item">#${e}</span>`).join(``)}
          </div>
          <div class="card-footer" style="margin-top:auto; padding-top:1rem; border-top:1px solid var(--border-color);">
            <span style="font-size: 0.76rem; font-family: monospace; color: var(--text-muted);">${e.doi||`Open Research`}</span>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-secondary btn-sm" onclick="openCiteModal('${e.id}')">Cite</button>
              <a href="/article?id=${e.id}" class="btn btn-primary btn-sm">Read Article</a>
            </div>
          </div>
        </div>
      </article>
    `}).join(``)}function u(){let e=document.getElementById(`datasetsContainer`);if(!e)return;let i=t.filter(e=>{let t=n===`all`||e.category.toLowerCase().includes(n.toLowerCase()),i=!r||e.title.toLowerCase().includes(r)||e.description&&e.description.toLowerCase().includes(r)||e.parameters&&e.parameters.some(e=>e.toLowerCase().includes(r));return t&&i});e.innerHTML=i.length===0?`
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-surface); border-radius: 16px; border: 1px dashed var(--border-color);">
        <p style="font-size: 1.1rem; color: var(--text-primary);">No datasets found for this selection.</p>
      </div>
    `:i.map(e=>`
      <div class="card">
        <div class="card-top">
          <span class="badge badge-indigo">${e.category}</span>
          <span style="font-size:0.78rem; font-family:monospace; color:var(--text-muted);">${e.version}</span>
        </div>
        <h3 class="card-title">${e.title}</h3>
        <p class="card-desc">${e.description}</p>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; background: var(--bg-primary); padding: 0.75rem; border-radius: 10px; margin-bottom: 1.25rem; font-size: 0.8rem;">
          <div>
            <div style="color:var(--text-muted); font-size:0.7rem; text-transform:uppercase;">Format</div>
            <div style="font-weight:600; color:var(--text-primary); font-family:monospace;">${e.format}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); font-size:0.7rem; text-transform:uppercase;">Size</div>
            <div style="font-weight:600; color:var(--text-primary); font-family:monospace;">${e.size}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); font-size:0.7rem; text-transform:uppercase;">License</div>
            <div style="font-weight:600; color:var(--text-primary); font-size:0.72rem;">${e.license}</div>
          </div>
        </div>

        <div class="card-footer">
          <span style="font-size:0.8rem; color:var(--accent-primary);">Lead: ${e.leadResearcher}</span>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary btn-sm" onclick="openDatasetPreview('${e.id}')">Inspect</button>
            <button class="btn btn-primary btn-sm" onclick="downloadDataset('${e.id}')">Download</button>
          </div>
        </div>
      </div>
    `).join(``)}function d(){document.querySelectorAll(`.modal-close, .modal-cancel`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.modal-overlay`).forEach(e=>e.classList.remove(`active`))})})}window.openCiteModal=function(t){let n=e.find(e=>e.id===t);if(!n)return;let r=document.getElementById(`citeModal`),i=document.getElementById(`citeModalBody`),a=document.getElementById(`citeModalTitle`);a.innerText=`Cite: ${n.title.slice(0,45)}...`;let o=(n.authors||[]).join(`, `),s=n.date?n.date.split(`-`)[0]:`2026`,c=`${o} (${s}). ${n.title}. Curiomas Research & Innovation Institute. DOI: ${n.doi||`10.5281/crii.2026`}`,l=`@article{crii_${n.slug||n.id},\n  title={${n.title}},\n  author={${o}},\n  journal={Curiomas Research & Innovation Institute Preprints},\n  year={${s}},\n  doi={${n.doi||`10.5281/crii.2026`}}\n}`;i.innerHTML=`
    <div style="margin-bottom:1.5rem;">
      <h4 style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.4rem; font-weight:700;">APA Citation Format</h4>
      <div style="background:var(--bg-primary); padding:0.9rem; border-radius:8px; border:1px solid var(--border-color); font-size:0.88rem; line-height:1.5; color:var(--text-primary);">
        ${c}
      </div>
      <button class="btn btn-secondary btn-sm" style="margin-top:0.5rem;" onclick="copyToClipboard(\`${c.replace(/"/g,`&quot;`)}\`, 'APA citation copied!')">Copy APA</button>
    </div>

    <div>
      <h4 style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.4rem; font-weight:700;">BibTeX</h4>
      <pre style="background:var(--bg-primary); padding:0.9rem; border-radius:8px; border:1px solid var(--border-color); font-size:0.8rem; font-family:monospace; color:var(--accent-primary); overflow-x:auto;">${l}</pre>
      <button class="btn btn-secondary btn-sm" style="margin-top:0.5rem;" onclick="copyToClipboard(\`${l.replace(/"/g,`&quot;`)}\`, 'BibTeX copied!')">Copy BibTeX</button>
    </div>
  `,r.classList.add(`active`)},window.openDatasetPreview=function(e){let n=t.find(t=>t.id===e);if(!n)return;let r=document.getElementById(`datasetModal`),i=document.getElementById(`datasetModalBody`),a=document.getElementById(`datasetModalTitle`);a.innerText=`Inspect Dataset: ${n.title.slice(0,45)}...`;let o=``;if(n.previewRows&&n.previewRows.length>0){let e=Object.keys(n.previewRows[0]);o=`
      <div style="overflow-x:auto; margin:1rem 0; border:1px solid var(--border-color); border-radius:10px;">
        <table class="admin-table" style="font-size:0.8rem;">
          <thead>
            <tr>${e.map(e=>`<th>${e}</th>`).join(``)}</tr>
          </thead>
          <tbody>
            ${n.previewRows.map(t=>`
              <tr>${e.map(e=>`<td>${t[e]}</td>`).join(``)}</tr>
            `).join(``)}
          </tbody>
        </table>
      </div>
    `}else o=`<p style="padding:1rem; color:var(--text-muted);">Tabular preview specification is packaged inside download bundle.</p>`;i.innerHTML=`
    <p style="color:var(--text-secondary); font-size:0.92rem; margin-bottom:0.75rem;">${n.description}</p>
    <div style="font-size:0.82rem; color:var(--accent-primary); font-family:monospace; margin-bottom:1rem;">License: ${n.license} | Version: ${n.version}</div>
    <h4 style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Sample Feature Rows</h4>
    ${o}
    <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.5rem;">File size: ${n.size} (${n.format})</p>
  `,r.classList.add(`active`)},window.downloadDataset=function(e){let n=t.find(t=>t.id===e);if(!n)return;let r=`data:text/json;charset=utf-8,`+encodeURIComponent(JSON.stringify(n,null,2)),i=document.createElement(`a`);i.setAttribute(`href`,r),i.setAttribute(`download`,`${n.id}_data_spec.json`),document.body.appendChild(i),i.click(),i.remove(),window.showToast(`Downloading dataset specification: ${n.title.slice(0,30)}...`,`success`)};