
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Interns & Core Team Showcase Script
 */

window.initInternsRoster = loadRosters;
window.initApplicationForm = initApplicationForm;

document.addEventListener('DOMContentLoaded', async () => {
  await loadRosters();
  await initApplicationForm();
});

async function loadRosters() {
  const data = await window.CRII_API.getInternsData();
  const dummyIds = ['team-002', 'team-003', 'int-001', 'int-002', 'crii-int-002', 'crii-int-003', 'crii-int-004'];
  const allMembers = (data.activeInterns || []).filter(m => !dummyIds.includes(m.id));

  allMembers.sort((a, b) => {
    const orderA = a.orderIndex !== undefined ? Number(a.orderIndex) : 999;
    const orderB = b.orderIndex !== undefined ? Number(b.orderIndex) : 999;
    if (orderA !== orderB) return orderA - orderB;
    return (a.name || '').localeCompare(b.name || '');
  });

  const teamContainer = document.getElementById('coreTeamContainer');
  const fellowsContainer = document.getElementById('fellowsContainer');

  const teamMembers = allMembers.filter(m => m.isTeamMember);
  const fellows = allMembers.filter(m => !m.isTeamMember);

  if (teamContainer) {
    if (teamMembers.length === 0) {
      teamContainer.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted);">Core team roster is currently updating.</div>`;
    } else {
      teamContainer.innerHTML = teamMembers.map(renderMemberCard).join('');
    }
  }

  if (fellowsContainer) {
    if (fellows.length === 0) {
      fellowsContainer.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted);">No fellows currently in this cohort.</div>`;
    } else {
      fellowsContainer.innerHTML = fellows.map(renderMemberCard).join('');
    }
  }
}

function renderMemberCard(member) {
  const avatarUrl = member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
  const isTeam = Boolean(member.isTeamMember);

  let socialsHtml = '';
  if (member.socials) {
    const s = member.socials;
    if (s.github) {
      socialsHtml += `
        <a href="${s.github}" target="_blank" rel="noopener" class="btn btn-sm btn-icon" title="GitHub" style="background:rgba(0,0,0,0.05); border-radius:50%;">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
          </svg>
        </a>
      `;
    }
    if (s.linkedin) {
      socialsHtml += `
        <a href="${s.linkedin}" target="_blank" rel="noopener" class="btn btn-sm btn-icon" title="LinkedIn" style="background:rgba(0,0,0,0.05); border-radius:50%;">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
          </svg>
        </a>
      `;
    }
    if (s.email) {
      socialsHtml += `
        <a href="mailto:${s.email}" class="btn btn-sm btn-icon" title="Email" style="background:rgba(0,0,0,0.05); border-radius:50%;">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </a>
      `;
    }
  }

  return `
    <div class="card" style="padding: 1.25rem; border-radius: 16px; border: 1px solid #e5dfd5; display: flex; flex-direction: column;">
      <!-- Almost Full Div Photo -->
      <div style="width: 100%; aspect-ratio: 16 / 12; border-radius: 12px; overflow: hidden; background: #000000; margin-bottom: 1.25rem;">
        <img src="${avatarUrl}" alt="${member.name}" style="width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease;" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'">
      </div>

      <!-- Member Details Below Photo -->
      <div style="margin-bottom: 0.65rem;">
        <h3 style="font-size: 1.35rem; font-weight: 700; color: #16281e; line-height: 1.25; margin-bottom: 0.25rem;">${member.name}</h3>
        <div style="font-size: 0.92rem; color: #0284c7; font-weight: 600;">${member.role}</div>
        <div style="font-size: 0.82rem; color: #78716c;">${member.university || 'Curiomas CRII'}</div>
      </div>

      <div style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap;">
        <span class="badge badge-indigo" style="font-size: 0.74rem;">${member.division}</span>
        ${isTeam ? `<span class="badge badge-blue" style="font-size: 0.74rem;">★ Principal Leadership</span>` : `<span class="badge badge-blue" style="font-size: 0.74rem;">Active Fellow</span>`}
      </div>

      <p class="card-desc" style="font-size: 0.92rem; line-height: 1.6; color: #4b5852; margin-bottom: 1.25rem; flex-grow: 1;">
        ${member.bio || 'Contributing to open student-led research.'}
      </p>

      ${(member.projects && member.projects.length > 0) ? `
        <div style="margin-bottom: 1.25rem;">
          <span style="font-size: 0.7rem; text-transform: uppercase; color: #78716c; font-weight: 700; display: block; margin-bottom: 0.35rem; letter-spacing: 0.05em;">Research Focus</span>
          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
            ${member.projects.map(p => `<span class="tag-item">${p}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <div class="card-footer" style="padding-top: 0.85rem; border-top: 1px solid #e5dfd5; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.78rem; color: #78716c;">Cohort: ${member.cohort || 'Founding'}</span>
        <div style="display: flex; gap: 0.35rem;">
          ${socialsHtml}
        </div>
      </div>
    </div>
  `;
}

async function initApplicationForm() {
  const form = document.getElementById('internApplicationForm');
  const closedCard = document.getElementById('fellowshipClosedCard');
  const openContainer = document.getElementById('fellowshipOpenContainer');
  const inviteCard = document.getElementById('fellowshipInviteCard');
  const gatewayCard = document.getElementById('fellowshipGatewayCard');
  const loaderCard = document.getElementById('fellowshipCuriosityLoader');
  const formCard = document.getElementById('applicationFormCard');
  const closedMsgEl = document.getElementById('fellowshipClosedMessageText');

  // 1. Sync latest database settings for divisions, cohorts, and form configuration
  if (window.CRII_API && window.CRII_API.syncSettingsFromDb) {
    try { await window.CRII_API.syncSettingsFromDb(); } catch(e){}
  }

  // 2. Read live application form configuration
  const formConfig = (window.CRII_API && window.CRII_API.getApplicationFormConfig)
    ? window.CRII_API.getApplicationFormConfig()
    : { isOpen: true, enableCuriosityGateway: true };

  const startDateStr = (formConfig.startDate || '').trim();
  const endDateStr = (formConfig.endDate || '').trim();

  function formatAppDate(isoStr) {
    if (!isoStr) return '';
    try {
      const parts = isoStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } catch(e) {}
    return isoStr;
  }

  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  let isExpired = false;
  let isUpcoming = false;

  if (endDateStr) {
    const endParts = endDateStr.split('-');
    if (endParts.length === 3) {
      const endMidnight = new Date(Number(endParts[0]), Number(endParts[1]) - 1, Number(endParts[2]), 23, 59, 59).getTime();
      if (Date.now() > endMidnight) {
        isExpired = true;
      }
    }
  }

  if (startDateStr) {
    const startParts = startDateStr.split('-');
    if (startParts.length === 3) {
      const startMidnight = new Date(Number(startParts[0]), Number(startParts[1]) - 1, Number(startParts[2]), 0, 0, 0).getTime();
      if (todayMidnight < startMidnight) {
        isUpcoming = true;
      }
    }
  }

  const manualOpen = formConfig.isOpen !== false;
  const isAppOpen = manualOpen && !isExpired && !isUpcoming;

  if (!isAppOpen) {
    // If applications are turned OFF or expired/upcoming
    if (closedCard) closedCard.style.display = 'block';
    if (openContainer) openContainer.style.display = 'none';

    const closedTitleEl = document.getElementById('fellowshipClosedTitle');
    const closedBadgeEl = document.getElementById('fellowshipClosedTimelineBadge');

    if (isExpired) {
      const formattedEnd = formatAppDate(endDateStr);
      if (closedBadgeEl) {
        closedBadgeEl.innerHTML = `⏱️ Cohort Application Window Ended: ${formattedEnd}`;
        closedBadgeEl.style.background = 'rgba(234, 88, 12, 0.12)';
        closedBadgeEl.style.color = '#ea580c';
      }
      if (closedTitleEl) {
        closedTitleEl.textContent = 'Fellowship Applications Have Closed';
      }
      if (closedMsgEl) {
        closedMsgEl.textContent = `Applications for this fellowship cohort officially closed on ${formattedEnd}. Candidate dossiers are currently under review by the Institute Research Council. Follow our dispatches for announcements regarding the next cohort.`;
      }
    } else if (isUpcoming) {
      const formattedStart = formatAppDate(startDateStr);
      if (closedBadgeEl) {
        closedBadgeEl.innerHTML = `⏳ Applications Opening Soon: ${formattedStart}`;
        closedBadgeEl.style.background = 'rgba(2, 132, 199, 0.12)';
        closedBadgeEl.style.color = '#0284c7';
      }
      if (closedTitleEl) {
        closedTitleEl.textContent = 'Fellowship Applications Opening Soon';
      }
      if (closedMsgEl) {
        closedMsgEl.textContent = `Candidate submissions for the upcoming cohort will open on ${formattedStart}. Review our published research tracks in the meantime to prepare your dossier.`;
      }
    } else {
      if (closedBadgeEl) {
        closedBadgeEl.textContent = 'Submissions Paused';
      }
      if (closedTitleEl) {
        closedTitleEl.textContent = 'Fellowship Applications Currently Closed';
      }
      if (closedMsgEl && formConfig.closedMessage) {
        closedMsgEl.textContent = formConfig.closedMessage;
      }
    }

    const subTitle = document.getElementById('fellowshipSectionSubtitle');
    if (subTitle) {
      if (isExpired) {
        subTitle.textContent = `Cohort applications concluded on ${formatAppDate(endDateStr)}. Review active research programs below.`;
      } else if (isUpcoming) {
        subTitle.textContent = `Cohort applications will open on ${formatAppDate(startDateStr)}. Admissions will run globally.`;
      } else {
        subTitle.textContent = "Cohort candidate applications are currently paused. The Institute Research Council is reviewing submitted dossiers.";
      }
    }
    return;
  } else {
    // If applications are turned ON and active
    if (closedCard) closedCard.style.display = 'none';
    if (openContainer) openContainer.style.display = 'block';

    // Display timeline tracker on invite card so candidates get a track of time
    const timelineIndicator = document.getElementById('fellowshipTimelineIndicator');
    const timelineLabel = document.getElementById('fellowshipTimelineLabel');

    if (timelineIndicator && timelineLabel) {
      if (startDateStr && endDateStr) {
        const startFormatted = formatAppDate(startDateStr);
        const endFormatted = formatAppDate(endDateStr);
        
        const endParts = endDateStr.split('-');
        const endMidnight = new Date(Number(endParts[0]), Number(endParts[1]) - 1, Number(endParts[2]), 23, 59, 59).getTime();
        const diffDays = Math.ceil((endMidnight - Date.now()) / (1000 * 60 * 60 * 24));
        const countdownStr = diffDays > 0 ? ` (${diffDays} day${diffDays === 1 ? '' : 's'} remaining)` : '';

        timelineLabel.innerHTML = `<strong>Application Window:</strong> ${startFormatted} – ${endFormatted}<span style="color: #ea580c; font-weight: 700;">${countdownStr}</span>`;
        timelineIndicator.style.display = 'flex';
      } else if (startDateStr) {
        timelineLabel.innerHTML = `<strong>Applications Open Since:</strong> ${formatAppDate(startDateStr)} • <em>Rolling Review</em>`;
        timelineIndicator.style.display = 'flex';
      } else if (endDateStr) {
        const endFormatted = formatAppDate(endDateStr);
        const endParts = endDateStr.split('-');
        const endMidnight = new Date(Number(endParts[0]), Number(endParts[1]) - 1, Number(endParts[2]), 23, 59, 59).getTime();
        const diffDays = Math.ceil((endMidnight - Date.now()) / (1000 * 60 * 60 * 24));
        const countdownStr = diffDays > 0 ? ` • ${diffDays} day${diffDays === 1 ? '' : 's'} left` : '';

        timelineLabel.innerHTML = `<strong>Deadline:</strong> ${endFormatted}<span style="color: #ea580c; font-weight: 700;">${countdownStr}</span>`;
        timelineIndicator.style.display = 'flex';
      } else {
        timelineIndicator.style.display = 'none';
      }
    }

    // If curious gateway is disabled in admin, jump straight to form
    if (formConfig.enableCuriosityGateway === false) {
      if (inviteCard) inviteCard.style.display = 'none';
      if (gatewayCard) gatewayCard.style.display = 'none';
      if (formCard) formCard.style.display = 'block';
    } else {
      if (inviteCard) inviteCard.style.display = 'block';
      if (gatewayCard) gatewayCard.style.display = 'none';
      if (formCard) formCard.style.display = 'none';
    }
  }

  // Window helper functions for interactive discovery journey
  window.startCuriousApplication = function() {
    if (inviteCard) inviteCard.style.display = 'none';
    if (gatewayCard) {
      gatewayCard.style.display = 'block';
      const nameInput = document.getElementById('curiousNameInput');
      if (nameInput) nameInput.focus();
    }
  };

  window.backToFellowshipInvite = function() {
    if (gatewayCard) gatewayCard.style.display = 'none';
    if (inviteCard) inviteCard.style.display = 'block';
  };

  window.proceedFromCuriousGateway = function() {
    const nameInput = document.getElementById('curiousNameInput');
    const emailInput = document.getElementById('curiousEmailInput');
    const name = (nameInput?.value || '').trim();
    const email = (emailInput?.value || '').trim();

    if (!name) {
      alert('Please enter your full name or preferred research title.');
      nameInput?.focus();
      return;
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      alert('Please enter a valid email address so the council can contact you.');
      emailInput?.focus();
      return;
    }

    // Set badges and form fields
    const appFullName = document.getElementById('appFullName');
    const appEmail = document.getElementById('appEmail');
    const dossierNameBadge = document.getElementById('dossierNameBadge');
    const dossierEmailBadge = document.getElementById('dossierEmailBadge');

    if (appFullName) appFullName.value = name;
    if (appEmail) appEmail.value = email;
    if (dossierNameBadge) dossierNameBadge.textContent = name;
    if (dossierEmailBadge) dossierEmailBadge.textContent = email;

    // Show curiosity loader animation
    if (gatewayCard) gatewayCard.style.display = 'none';
    if (loaderCard) {
      loaderCard.style.display = 'block';
      const titleEl = document.getElementById('curiosityLoaderTitle');
      const subEl = document.getElementById('curiosityLoaderSubtitle');

      if (titleEl) titleEl.textContent = `Initializing research dossier for ${name}...`;
      if (subEl) subEl.textContent = "Connecting candidate identity to CRII Open Science Core...";

      setTimeout(() => {
        if (titleEl) titleEl.textContent = "Cross-referencing active computational tracks...";
        if (subEl) subEl.textContent = "Accessing live research division catalogs & mentor availability...";
      }, 450);

      setTimeout(() => {
        if (titleEl) titleEl.textContent = "Dossier synthesized! Opening application...";
        if (subEl) subEl.textContent = "Please complete your research background and curiosity statement below.";
      }, 950);

      setTimeout(() => {
        if (loaderCard) loaderCard.style.display = 'none';
        if (formCard) {
          formCard.style.display = 'block';
          const univInput = document.getElementById('appUniversity');
          if (univInput) univInput.focus();
        }
      }, 1400);
    } else {
      if (formCard) formCard.style.display = 'block';
    }
  };

  window.backToCuriousGateway = function() {
    if (formCard) formCard.style.display = 'none';
    if (gatewayCard) {
      gatewayCard.style.display = 'block';
      const nameInput = document.getElementById('curiousNameInput');
      if (nameInput) nameInput.focus();
    }
  };

  // 3. Populate Real Divisions into Preferred Division dropdown (from live D1)
  const divSelect = document.getElementById('appDivision');
  if (divSelect && window.CRII_API) {
    try {
      const realDivisions = (await window.CRII_API.getDivisions()) || [];
      if (Array.isArray(realDivisions) && realDivisions.length > 0) {
        divSelect.innerHTML = '<option value="">Select Research Division Track...</option>' +
          realDivisions.map(d => `<option value="${escapeHtml(d.title)}">${escapeHtml(d.title)}</option>`).join('');
      } else {
        divSelect.innerHTML = `
          <option value="">Select Research Division Track...</option>
          <option value="Space & Astrophysics">Space & Astrophysics</option>
          <option value="Ancient Biology & Paleogenomics">Ancient Biology & Paleogenomics</option>
          <option value="AI & Computational Science">AI & Computational Science</option>
          <option value="Astrobiology & Extremophiles">Astrobiology & Extremophiles</option>
          <option value="Interdisciplinary Open Science">Interdisciplinary Open Science</option>
        `;
      }
    } catch (e) {
      console.warn('Error fetching divisions for form:', e);
    }
  }

  // 4. Populate Real Cohorts & Grades into Academic Level dropdown
  const levelSelect = document.getElementById('appLevel');
  if (levelSelect && window.CRII_API) {
    try {
      const realCohorts = (await window.CRII_API.getCohorts()) || [];
      if (Array.isArray(realCohorts) && realCohorts.length > 0) {
        levelSelect.innerHTML = '<option value="">Select Academic Level / Cohort Profile...</option>' +
          realCohorts.map(c => {
            const gradeText = c.grade || c.academicLevel ? ` (${c.grade || c.academicLevel})` : '';
            return `<option value="${escapeHtml(c.title + gradeText)}">${escapeHtml(c.title + gradeText)}</option>`;
          }).join('');
      } else {
        levelSelect.innerHTML = `
          <option value="">Select Academic Level / Cohort Profile...</option>
          <option value="Undergraduate Researchers (1st - 4th Year)">Undergraduate Researchers (1st - 4th Year)</option>
          <option value="Postgraduate & Masters Scholars">Postgraduate & Masters Scholars</option>
          <option value="High School Scholars (Grade 10-12)">High School Scholars (Grade 10-12)</option>
          <option value="PhD Candidates & Postdoctoral Fellows">PhD Candidates & Postdoctoral Fellows</option>
          <option value="Self-Directed & Independent Researchers">Self-Directed & Independent Researchers</option>
        `;
      }
    } catch (e) {
      console.warn('Error fetching cohorts for form:', e);
    }
  }

  // 5. Apply Application Form Settings (Visibility, Required status, Custom fields)
  if (formConfig && formConfig.fields) {
    const f = formConfig.fields;
    const applyFieldConfig = (id, fieldKey) => {
      const input = document.getElementById(id);
      if (!input) return;
      const group = input.closest('.form-group');
      const cfg = f[fieldKey];
      if (!cfg) return;
      if (group && cfg.visible === false) {
        group.style.display = 'none';
        input.required = false;
      } else {
        if (group) group.style.display = '';
        input.required = cfg.required === true;
      }
    };

    applyFieldConfig('appUniversity', 'university');
    applyFieldConfig('appFieldOfStudy', 'fieldOfStudy');
    applyFieldConfig('appDivision', 'division');
    applyFieldConfig('appLevel', 'academicLevel');
    applyFieldConfig('appPortfolio', 'portfolio');
    applyFieldConfig('appStatement', 'statement');
  }

  // Render Custom Fields
  const customContainer = document.getElementById('appCustomFieldsContainer');
  if (customContainer) {
    if (Array.isArray(formConfig.customFields) && formConfig.customFields.length > 0) {
      customContainer.innerHTML = formConfig.customFields.map((cf, idx) => {
        const inputId = `appCustom_${idx}`;
        let inputHtml = '';
        if (cf.type === 'textarea') {
          inputHtml = `<textarea id="${inputId}" class="form-input" rows="3" data-custom-key="${escapeHtml(cf.label)}" ${cf.required ? 'required' : ''} placeholder="${escapeHtml(cf.placeholder || '')}"></textarea>`;
        } else if (cf.type === 'select') {
          const opts = Array.isArray(cf.options) ? cf.options : [];
          inputHtml = `
            <select id="${inputId}" class="form-select" data-custom-key="${escapeHtml(cf.label)}" ${cf.required ? 'required' : ''}>
              <option value="">Select option...</option>
              ${opts.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join('')}
            </select>
          `;
        } else if (cf.type === 'number') {
          inputHtml = `<input type="number" id="${inputId}" class="form-input" data-custom-key="${escapeHtml(cf.label)}" ${cf.required ? 'required' : ''} placeholder="${escapeHtml(cf.placeholder || '')}">`;
        } else {
          inputHtml = `<input type="text" id="${inputId}" class="form-input" data-custom-key="${escapeHtml(cf.label)}" ${cf.required ? 'required' : ''} placeholder="${escapeHtml(cf.placeholder || '')}">`;
        }

        return `
          <div class="form-group" style="margin-bottom:1.25rem;">
            <label class="form-label" for="${inputId}" style="font-weight:600;">
              ${escapeHtml(cf.label)} ${cf.required ? '*' : ''}
            </label>
            ${inputHtml}
          </div>
        `;
      }).join('');
    } else {
      customContainer.innerHTML = '';
    }
  }

  // 6. Submission Handler
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Transmitting Research Dossier...';
    }

    // Extract custom fields
    const customFields = {};
    document.querySelectorAll('#appCustomFieldsContainer [data-custom-key]').forEach(el => {
      const key = el.getAttribute('data-custom-key');
      if (key) customFields[key] = (el.value || '').trim();
    });

    const formData = {
      fullName: document.getElementById('appFullName')?.value.trim() || document.getElementById('curiousNameInput')?.value.trim() || 'Fellow Applicant',
      email: document.getElementById('appEmail')?.value.trim() || document.getElementById('curiousEmailInput')?.value.trim() || '',
      university: document.getElementById('appUniversity')?.value.trim() || '',
      fieldOfStudy: document.getElementById('appFieldOfStudy')?.value.trim() || '',
      preferredDivision: document.getElementById('appDivision')?.value || 'General Science',
      academicLevel: document.getElementById('appLevel')?.value || '',
      portfolioUrl: document.getElementById('appPortfolio')?.value.trim() || '',
      statement: document.getElementById('appStatement')?.value.trim() || '',
      customFields
    };

    try {
      const res = await window.CRII_API.submitInternApplication(formData);
      
      const formCard = document.getElementById('applicationFormCard');
      if (formCard) {
        formCard.innerHTML = `
          <div style="text-align:center; padding:3.5rem 1.5rem; animation: fadeIn 0.4s ease;">
            <div style="width:64px; height:64px; border-radius:50%; background:rgba(16, 185, 129, 0.12); border:1.5px solid #10b981; color:#059669; display:grid; place-items:center; margin:0 auto 1.5rem;">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </div>
            <div style="display:inline-block; padding:0.25rem 0.85rem; border-radius:9999px; background:rgba(16,185,129,0.1); color:#059669; font-weight:700; font-size:0.8rem; margin-bottom:0.75rem;">
              Dossier Transmitted Successfully
            </div>
            <h2 style="font-size:2rem; margin-bottom:0.75rem; color:var(--text-primary); font-family:var(--font-display);">Welcome to the Cohort Queue</h2>
            <p style="color:var(--text-secondary); max-width:540px; margin:0 auto 1.5rem; line-height:1.65; font-size:1.02rem;">
              Thank you, <strong>${escapeHtml(res.fullName)}</strong>. Your research application for the 
              <span style="color:var(--accent-primary, #ea580c); font-weight:700;">${escapeHtml(res.preferredDivision)}</span> track has been entered into the admissions queue.
            </p>
            <div style="background:#faf8f5; padding:0.95rem 1.5rem; border-radius:12px; border:1px solid #d4c8b6; display:inline-block; font-family:monospace; font-size:0.92rem; color:#1a221b; margin-bottom:2.25rem;">
              Application Reference: <strong style="color:#ea580c;">${res.id}</strong>
            </div>
            <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap;">
              <a href="/research" class="mockup-btn-dark-green" style="padding:0.85rem 1.75rem; text-decoration:none;">Explore Research Papers</a>
              <a href="/" class="btn btn-secondary" style="padding:0.85rem 1.5rem; text-decoration:none;">Return to Homepage</a>
            </div>
          </div>
        `;
      }

      // Dispatch EmailJS alert if template configured
      if (window.emailjs) {
        try {
          const tplId = (window.CRII_API && typeof window.CRII_API.getEmailjsTemplateId === 'function')
            ? window.CRII_API.getEmailjsTemplateId()
            : (localStorage.getItem('crii_emailjs_template_id') || '');
          if (tplId) {
            emailjs.init({ publicKey: 'h3x_9dtR8frBq2pCi' });
            await emailjs.send('curiomas', tplId, {
              to_email: 'curiomas.members@gmail.com',
              to_name: 'CRII Admissions Board',
              applicant_name: res.fullName,
              applicant_email: res.email,
              applicant_university: res.university,
              applicant_division: res.preferredDivision,
              applicant_level: res.academicLevel,
              message: `New fellowship application received from ${res.fullName} (${res.email}) from ${res.university} for track: ${res.preferredDivision} (${res.academicLevel}).\n\nPortfolio: ${res.portfolioUrl || 'None'}\n\nStatement:\n${res.statement}`
            }, 'h3x_9dtR8frBq2pCi');
          }
        } catch (mailErr) {
          console.warn('EmailJS application alert notification note:', mailErr);
        }
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Fellowship Application →';
      }
      alert('There was an issue submitting your application. Please check your connection and try again.');
    }
  });
}
