import"./config-WQoC_c_K.js";import"./app-a7Or-imY.js";var e=[],t=`all`;document.addEventListener(`DOMContentLoaded`,async()=>{await n(),initTagFilter()});async function n(){e=(await window.CRII_API.getPosts()).filter(e=>e.published!==!1),r(),i()}function r(){let n=document.getElementById(`blogContainer`);if(!n)return;let r=e.filter(e=>t===`all`||e.tags&&e.tags.some(e=>e.toLowerCase()===t.toLowerCase()));n.innerHTML=r.length===0?`
      <div style="text-align:center; padding:3rem; background:var(--bg-surface); border-radius:16px; border:1px dashed var(--border-color); width:100%;">
        <p style="color:var(--text-muted);">No dispatches found under tag #${t}.</p>
      </div>
    `:r.map(e=>{let t=e.coverImage?`
      <div class="card-cover">
        <img src="${e.coverImage}" alt="${e.title}" class="card-cover-img" loading="lazy">
      </div>
    `:``,n=!!(e.isEdited||e.updatedBy&&e.updatedAt),r=e.updatedBy||e.authors&&e.authors[0]||`CRII Researcher`,i=e.createdBy||e.authors&&e.authors[0]||`CRII Researcher`,a=n?new Date(e.updatedAt||e.date).toLocaleDateString(void 0,{year:`numeric`,month:`short`,day:`numeric`}):new Date(e.createdAt||e.date).toLocaleDateString(void 0,{year:`numeric`,month:`short`,day:`numeric`}),o=n?`<div class="article-meta-attribution" style="margin-bottom:0.75rem;"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg><span>Last edited by <strong>${r}</strong> on ${a}</span></div>`:`<div class="article-meta-attribution" style="margin-bottom:0.75rem;"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>Created by <strong>${i}</strong> on ${a}</span></div>`;return`
      <article class="card" style="padding:0; overflow:hidden;">
        ${t}
        <div style="padding:1.5rem; display:flex; flex-direction:column; flex:1;">
          <div class="card-top" style="margin-bottom:0.75rem;">
            <span class="badge badge-blue">${e.category}</span>
            <span class="card-date">${e.date} • ${e.readingTime||`8 min read`}</span>
          </div>
          <h2 class="card-title" style="font-size:1.45rem;">
            <a href="/article?id=${e.id}">${e.title}</a>
          </h2>
          <div class="card-authors" style="margin-bottom:0.4rem;">
            By ${e.authors?e.authors.join(`, `):`CRII Fellow`}
          </div>
          ${o}
          <p class="card-desc" style="flex:1;">${e.summary||(e.abstract?e.abstract.slice(0,180)+`...`:``)}</p>
          <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-bottom:1.25rem;">
            ${(e.tags||[]).map(e=>`<span class="tag-item">#${e}</span>`).join(``)}
          </div>
          <div class="card-footer" style="margin-top:auto; padding-top:1rem; border-top:1px solid var(--border-color);">
            <span style="font-size:0.78rem; font-family:monospace; color:var(--text-muted);">${e.doi||`Open Access`}</span>
            <a href="/article?id=${e.id}" class="btn btn-primary btn-sm">Read Full Dispatch</a>
          </div>
        </div>
      </article>
    `}).join(``)}function i(){let n=document.getElementById(`tagList`);if(!n)return;let r={};e.forEach(e=>{(e.tags||[]).forEach(e=>{r[e]=(r[e]||0)+1})});let i=Object.keys(r).sort((e,t)=>r[t]-r[e]);n.innerHTML=`
    <button class="category-pill ${t===`all`?`active`:``}" onclick="selectTag('all')">All Dispatches</button>
    ${i.map(e=>`
      <button class="category-pill ${t.toLowerCase()===e.toLowerCase()?`active`:``}" onclick="selectTag('${e}')">
        #${e} (${r[e]})
      </button>
    `).join(``)}
  `}window.selectTag=function(e){t=e,r(),i()};