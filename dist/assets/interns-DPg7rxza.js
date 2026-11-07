function e(e){return e==null?``:String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}document.addEventListener(`DOMContentLoaded`,async()=>{await t(),await r()});async function t(){let e=await window.CRII_API.getInternsData(),t=[`team-002`,`team-003`,`int-001`,`int-002`,`crii-int-002`,`crii-int-003`,`crii-int-004`],r=(e.activeInterns||[]).filter(e=>!t.includes(e.id));r.sort((e,t)=>{let n=e.orderIndex===void 0?999:Number(e.orderIndex),r=t.orderIndex===void 0?999:Number(t.orderIndex);return n===r?(e.name||``).localeCompare(t.name||``):n-r});let i=document.getElementById(`coreTeamContainer`),a=document.getElementById(`fellowsContainer`),o=r.filter(e=>e.isTeamMember),s=r.filter(e=>!e.isTeamMember);i&&(i.innerHTML=o.length===0?`<div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted);">Core team roster is currently updating.</div>`:o.map(n).join(``)),a&&(a.innerHTML=s.length===0?`<div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted);">No fellows currently in this cohort.</div>`:s.map(n).join(``))}function n(e){let t=e.avatar||`https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80`,n=!!e.isTeamMember,r=``;if(e.socials){let t=e.socials;t.github&&(r+=`
        <a href="${t.github}" target="_blank" rel="noopener" class="btn btn-sm btn-icon" title="GitHub" style="background:rgba(0,0,0,0.05); border-radius:50%;">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
          </svg>
        </a>
      `),t.linkedin&&(r+=`
        <a href="${t.linkedin}" target="_blank" rel="noopener" class="btn btn-sm btn-icon" title="LinkedIn" style="background:rgba(0,0,0,0.05); border-radius:50%;">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
          </svg>
        </a>
      `),t.email&&(r+=`
        <a href="mailto:${t.email}" class="btn btn-sm btn-icon" title="Email" style="background:rgba(0,0,0,0.05); border-radius:50%;">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </a>
      `)}return`
    <div class="card" style="padding: 1.25rem; border-radius: 16px; border: 1px solid #e5dfd5; display: flex; flex-direction: column;">
      <!-- Almost Full Div Photo -->
      <div style="width: 100%; aspect-ratio: 16 / 12; border-radius: 12px; overflow: hidden; background: #000000; margin-bottom: 1.25rem;">
        <img src="${t}" alt="${e.name}" style="width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease;" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'">
      </div>

      <!-- Member Details Below Photo -->
      <div style="margin-bottom: 0.65rem;">
        <h3 style="font-size: 1.35rem; font-weight: 700; color: #16281e; line-height: 1.25; margin-bottom: 0.25rem;">${e.name}</h3>
        <div style="font-size: 0.92rem; color: #0284c7; font-weight: 600;">${e.role}</div>
        <div style="font-size: 0.82rem; color: #78716c;">${e.university||`Curiomas CRII`}</div>
      </div>

      <div style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap;">
        <span class="badge badge-indigo" style="font-size: 0.74rem;">${e.division}</span>
        ${n?`<span class="badge badge-blue" style="font-size: 0.74rem;">★ Principal Leadership</span>`:`<span class="badge badge-blue" style="font-size: 0.74rem;">Active Fellow</span>`}
      </div>

      <p class="card-desc" style="font-size: 0.92rem; line-height: 1.6; color: #4b5852; margin-bottom: 1.25rem; flex-grow: 1;">
        ${e.bio||`Contributing to open student-led research.`}
      </p>

      ${e.projects&&e.projects.length>0?`
        <div style="margin-bottom: 1.25rem;">
          <span style="font-size: 0.7rem; text-transform: uppercase; color: #78716c; font-weight: 700; display: block; margin-bottom: 0.35rem; letter-spacing: 0.05em;">Research Focus</span>
          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
            ${e.projects.map(e=>`<span class="tag-item">${e}</span>`).join(``)}
          </div>
        </div>
      `:``}

      <div class="card-footer" style="padding-top: 0.85rem; border-top: 1px solid #e5dfd5; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.78rem; color: #78716c;">Cohort: ${e.cohort||`Founding`}</span>
        <div style="display: flex; gap: 0.35rem;">
          ${r}
        </div>
      </div>
    </div>
  `}async function r(){let t=document.getElementById(`internApplicationForm`);if(!t)return;if(window.CRII_API&&window.CRII_API.syncSettingsFromDb)try{await window.CRII_API.syncSettingsFromDb()}catch{}let n=document.getElementById(`appDivision`);if(n&&window.CRII_API)try{let t=await window.CRII_API.getDivisions()||[];n.innerHTML=Array.isArray(t)&&t.length>0?`<option value="">Select Research Division Track...</option>`+t.map(t=>`<option value="${e(t.title)}">${e(t.title)}</option>`).join(``):`
          <option value="">Select Research Division Track...</option>
          <option value="Space & Astrophysics">Space & Astrophysics</option>
          <option value="Ancient Biology & Paleogenomics">Ancient Biology & Paleogenomics</option>
          <option value="AI & Computational Science">AI & Computational Science</option>
          <option value="Astrobiology & Extremophiles">Astrobiology & Extremophiles</option>
          <option value="Interdisciplinary Open Science">Interdisciplinary Open Science</option>
        `}catch(e){console.warn(`Error fetching divisions for form:`,e)}let r=document.getElementById(`appLevel`);if(r&&window.CRII_API)try{let t=await window.CRII_API.getCohorts()||[];r.innerHTML=Array.isArray(t)&&t.length>0?`<option value="">Select Academic Level / Cohort Profile...</option>`+t.map(t=>{let n=t.grade||t.academicLevel?` (${t.grade||t.academicLevel})`:``;return`<option value="${e(t.title+n)}">${e(t.title+n)}</option>`}).join(``):`
          <option value="">Select Academic Level / Cohort Profile...</option>
          <option value="Undergraduate Researchers (1st - 4th Year)">Undergraduate Researchers (1st - 4th Year)</option>
          <option value="Postgraduate & Masters Scholars">Postgraduate & Masters Scholars</option>
          <option value="High School Scholars (Grade 10-12)">High School Scholars (Grade 10-12)</option>
          <option value="PhD Candidates & Postdoctoral Fellows">PhD Candidates & Postdoctoral Fellows</option>
          <option value="Self-Directed & Independent Researchers">Self-Directed & Independent Researchers</option>
        `}catch(e){console.warn(`Error fetching cohorts for form:`,e)}if(window.CRII_API&&window.CRII_API.getApplicationFormConfig){let t=window.CRII_API.getApplicationFormConfig();if(t&&t.fields){let e=t.fields,n=(t,n)=>{let r=document.getElementById(t);if(!r)return;let i=r.closest(`.form-group`),a=e[n];a&&(i&&a.visible===!1?(i.style.display=`none`,r.required=!1):(i&&(i.style.display=``),r.required=a.required===!0))};n(`appUniversity`,`university`),n(`appFieldOfStudy`,`fieldOfStudy`),n(`appDivision`,`division`),n(`appLevel`,`academicLevel`),n(`appPortfolio`,`portfolio`),n(`appStatement`,`statement`)}let n=document.getElementById(`appCustomFieldsContainer`);n&&(n.innerHTML=Array.isArray(t.customFields)&&t.customFields.length>0?t.customFields.map((t,n)=>{let r=`appCustom_${n}`,i=``;if(t.type===`textarea`)i=`<textarea id="${r}" class="form-input" rows="3" data-custom-key="${e(t.label)}" ${t.required?`required`:``} placeholder="${e(t.placeholder||``)}"></textarea>`;else if(t.type===`select`){let n=Array.isArray(t.options)?t.options:[];i=`
              <select id="${r}" class="form-select" data-custom-key="${e(t.label)}" ${t.required?`required`:``}>
                <option value="">Select option...</option>
                ${n.map(t=>`<option value="${e(t)}">${e(t)}</option>`).join(``)}
              </select>
            `}else i=t.type===`number`?`<input type="number" id="${r}" class="form-input" data-custom-key="${e(t.label)}" ${t.required?`required`:``} placeholder="${e(t.placeholder||``)}">`:`<input type="text" id="${r}" class="form-input" data-custom-key="${e(t.label)}" ${t.required?`required`:``} placeholder="${e(t.placeholder||``)}">`;return`
            <div class="form-group" style="margin-bottom:1.25rem;">
              <label class="form-label" for="${r}" style="font-weight:600;">
                ${e(t.label)} ${t.required?`*`:``}
              </label>
              ${i}
            </div>
          `}).join(``):``)}t.addEventListener(`submit`,async n=>{n.preventDefault();let r=t.querySelector(`button[type="submit"]`);r&&(r.disabled=!0,r.innerHTML=`Submitting Application...`);let i={};document.querySelectorAll(`#appCustomFieldsContainer [data-custom-key]`).forEach(e=>{let t=e.getAttribute(`data-custom-key`);t&&(i[t]=(e.value||``).trim())});let a={fullName:document.getElementById(`appFullName`)?.value.trim()||`Fellow Applicant`,email:document.getElementById(`appEmail`)?.value.trim()||``,university:document.getElementById(`appUniversity`)?.value.trim()||``,fieldOfStudy:document.getElementById(`appFieldOfStudy`)?.value.trim()||``,preferredDivision:document.getElementById(`appDivision`)?.value||`General Science`,academicLevel:document.getElementById(`appLevel`)?.value||``,portfolioUrl:document.getElementById(`appPortfolio`)?.value.trim()||``,statement:document.getElementById(`appStatement`)?.value.trim()||``,customFields:i};try{let t=await window.CRII_API.submitInternApplication(a),n=document.getElementById(`applicationFormCard`);if(n&&(n.innerHTML=`
          <div style="text-align:center; padding:3rem 1.5rem;">
            <div style="width:56px; height:56px; border-radius:50%; background:rgba(16, 185, 129, 0.1); border:1px solid #10b981; color:#059669; display:grid; place-items:center; margin:0 auto 1.5rem;">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </div>
            <h2 style="font-size:1.8rem; margin-bottom:0.75rem; color:var(--text-primary);">Application Received</h2>
            <p style="color:var(--text-secondary); max-width:540px; margin:0 auto 1.5rem; line-height:1.6;">
              Thank you, <strong>${e(t.fullName)}</strong>. Your research application for the 
              <span style="color:var(--accent-primary); font-weight:600;">${e(t.preferredDivision)}</span> track has been submitted to the admissions review board.
            </p>
            <div style="background:var(--bg-primary); padding:0.85rem 1.25rem; border-radius:10px; border:1px solid var(--border-color); display:inline-block; font-family:monospace; font-size:0.88rem; color:var(--accent-primary); margin-bottom:2rem;">
              Application Reference: ${t.id}
            </div>
            <div>
              <a href="/research" class="btn btn-secondary">Explore Research Papers</a>
            </div>
          </div>
        `),window.emailjs)try{let e=window.CRII_API&&typeof window.CRII_API.getEmailjsTemplateId==`function`?window.CRII_API.getEmailjsTemplateId():localStorage.getItem(`crii_emailjs_template_id`)||``;e&&(emailjs.init({publicKey:`h3x_9dtR8frBq2pCi`}),await emailjs.send(`curiomas`,e,{to_email:`curiomas.members@gmail.com`,to_name:`CRII Admissions Board`,applicant_name:t.fullName,applicant_email:t.email,applicant_university:t.university,applicant_division:t.preferredDivision,applicant_level:t.academicLevel,message:`New fellowship application received from ${t.fullName} (${t.email}) from ${t.university} for track: ${t.preferredDivision} (${t.academicLevel}).\n\nPortfolio: ${t.portfolioUrl||`None`}\n\nStatement:\n${t.statement}`},`h3x_9dtR8frBq2pCi`))}catch(e){console.warn(`EmailJS application alert notification note:`,e)}}catch(e){console.error(`Error submitting application:`,e),r&&(r.disabled=!1,r.innerHTML=`Submit Research Application`),alert(`There was an issue submitting your application. Please check your connection and try again.`)}})}