
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

  const activeOptions = window._criiActiveAppFormOptions || {};
  let selectedPackageObj = null;
  const uniqueDebounceTimers = {};

  async function runUniqueCheck(fieldKey, value, isCustom, statusEl, inputEl) {
    const trimmed = String(value || '').trim();
    if (!trimmed) {
      if (statusEl) statusEl.innerHTML = '';
      if (inputEl) delete inputEl.dataset.uniqueConflict;
      return true;
    }
    if (statusEl) statusEl.innerHTML = '<span style="color:#64748b;">Checking availability...</span>';
    const res = await window.CRII_API.checkApplicationFieldUnique(fieldKey, trimmed, isCustom);
    if (res && res.exists) {
      if (statusEl) statusEl.innerHTML = '<span style="color:#dc2626; font-weight:600;">✕ Already used — this value must be unique.</span>';
      if (inputEl) {
        inputEl.dataset.uniqueConflict = 'true';
        inputEl.style.borderColor = '#dc2626';
      }
      return false;
    }
    if (statusEl) statusEl.innerHTML = '<span style="color:#059669; font-weight:600;">✓ Available</span>';
    if (inputEl) {
      delete inputEl.dataset.uniqueConflict;
      inputEl.style.borderColor = '#10b981';
    }
    return true;
  }

  function bindUniqueAutoCheck(inputEl, fieldKey, isCustom, statusEl) {
    if (!inputEl) return;
    const trigger = () => {
      clearTimeout(uniqueDebounceTimers[fieldKey]);
      uniqueDebounceTimers[fieldKey] = setTimeout(() => {
        runUniqueCheck(fieldKey, inputEl.value, isCustom, statusEl, inputEl);
      }, 400);
    };
    inputEl.addEventListener('input', trigger);
    inputEl.addEventListener('blur', () => runUniqueCheck(fieldKey, inputEl.value, isCustom, statusEl, inputEl));
  }

  const curiousEmailEl = document.getElementById('curiousEmailInput');
  const curiousEmailStatus = document.getElementById('curiousEmailUniqueStatus');
  if (formConfig.uniqueEmail && curiousEmailEl) {
    bindUniqueAutoCheck(curiousEmailEl, 'email', false, curiousEmailStatus);
  }

  const paymentRefEl = document.getElementById('appPaymentRefInput');
  const paymentRefStatus = document.getElementById('appPaymentRefUniqueStatus');
  if (paymentRefEl) {
    bindUniqueAutoCheck(paymentRefEl, 'paymentRef', false, paymentRefStatus);
  }

  window.togglePublicAppUrlInput = function(inputId) {
    const wrap = document.getElementById(inputId + '_urlWrap');
    if (!wrap) return;
    const hidden = wrap.style.display === 'none' || !wrap.style.display;
    wrap.style.display = hidden ? 'block' : 'none';
    if (hidden) {
      const inp = document.getElementById(inputId);
      if (inp) inp.focus();
    }
  };

  window.triggerPublicAppMediaUpload = function(inputId, accept = 'image/*', isPfp = false) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = accept;
    fileInput.style.display = 'none';
    fileInput.onchange = async (ev) => {
      const file = ev.target.files && ev.target.files[0];
      if (!file) return;
      const statusEl = document.getElementById(inputId + '_status');
      const targetInp = document.getElementById(inputId);
      const previewEl = document.getElementById(inputId + '_preview');
      if (statusEl) statusEl.innerHTML = `<span style="color:#ea580c; font-weight:600;">Uploading ${escapeHtml(file.name)}...</span>`;
      const fd = new FormData();
      fd.append('file', file);
      fd.append('source', 'fellowship_application');
      try {
        const res = await fetch('/api/storage', { method: 'POST', body: fd });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Upload failed');
        const uploadedUrl = data.url || (data.item && data.item.url) || ('/api/images/' + data.item.key.replace(/^uploads\//, ''));
        if (targetInp) {
          targetInp.value = uploadedUrl;
          targetInp.dispatchEvent(new Event('input', { bubbles: true }));
          targetInp.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (statusEl) statusEl.innerHTML = '<span style="color:#059669; font-weight:600;">✓ Uploaded</span>';
        if (previewEl) {
          if (accept.includes('video')) {
            previewEl.innerHTML = `<video src="${escapeHtml(uploadedUrl)}" controls style="max-height:140px; max-width:100%; border-radius:8px; margin-top:0.45rem;"></video>`;
          } else {
            previewEl.innerHTML = `<img src="${escapeHtml(uploadedUrl)}" style="${isPfp ? 'width:76px; height:76px; border-radius:50%;' : 'max-height:120px; max-width:220px; border-radius:10px;'} object-fit:cover; border:2px solid #ea580c; margin-top:0.45rem;">`;
          }
        }
      } catch (err) {
        if (statusEl) statusEl.innerHTML = `<span style="color:#dc2626;">Upload failed: ${escapeHtml(err.message)}</span>`;
      } finally {
        fileInput.remove();
      }
    };
    document.body.appendChild(fileInput);
    fileInput.click();
    setTimeout(() => fileInput.remove(), 60000);
  };

  window.setAppCustomStarRating = function(inputId, ratingVal) {
    const inp = document.getElementById(inputId);
    if (inp) {
      inp.value = String(ratingVal);
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const wrap = document.getElementById(inputId + '_stars');
    if (wrap) {
      wrap.querySelectorAll('button[data-star]').forEach(btn => {
        const s = Number(btn.getAttribute('data-star'));
        btn.style.color = s <= ratingVal ? '#f59e0b' : '#cbd5e1';
        btn.style.transform = s <= ratingVal ? 'scale(1.12)' : 'scale(1)';
      });
    }
    const lbl = document.getElementById(inputId + '_ratingLabel');
    if (lbl) lbl.textContent = `${ratingVal} / 5`;
  };

  window.proceedFromCuriousGateway = async function() {
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
    if (formConfig.uniqueEmail) {
      const ok = await runUniqueCheck('email', email, false, curiousEmailStatus, emailInput);
      if (!ok) {
        emailInput?.focus();
        return;
      }
    }

    const appFullName = document.getElementById('appFullName');
    const appEmail = document.getElementById('appEmail');
    const dossierNameBadge = document.getElementById('dossierNameBadge');
    const dossierEmailBadge = document.getElementById('dossierEmailBadge');

    if (appFullName) appFullName.value = name;
    if (appEmail) appEmail.value = email;
    if (dossierNameBadge) dossierNameBadge.textContent = name;
    if (dossierEmailBadge) dossierEmailBadge.textContent = email;

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
    } catch (e) {}
  }

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
    } catch (e) {}
  }

  const pkgContainer = document.getElementById('appPackagesSelectorContainer');
  const payBox = document.getElementById('appPaymentDetailsBox');
  const payInstr = document.getElementById('appPaymentInstructionsText');
  const payLinkWrap = document.getElementById('appPaymentLinkWrap');
  const payLinkBtn = document.getElementById('appPaymentLinkBtn');
  if (pkgContainer && window.CRII_API && window.CRII_API.getFellowshipPackages) {
    try {
      let pkgs = (await window.CRII_API.getFellowshipPackages()) || [];
      pkgs = pkgs.filter(p => p && p.active !== false);
      if (Array.isArray(activeOptions.allowedPackageIds) && activeOptions.allowedPackageIds.length > 0) {
        pkgs = pkgs.filter(p => activeOptions.allowedPackageIds.includes(p.id));
      }

      const formatPrice = (p) => {
        const n = Number(p.price || 0);
        if (!n || n <= 0) return 'Free';
        const syms = { BDT: '৳', USD: '$', EUR: '€', GBP: '£', INR: '₹' };
        return `${syms[p.currency] || (p.currency ? p.currency + ' ' : '')}${n.toLocaleString()}`;
      };

      window.selectApplicationPackage = function(pkgId) {
        const found = pkgs.find(p => p.id === pkgId) || null;
        selectedPackageObj = found;
        pkgContainer.querySelectorAll('.app-pkg-card').forEach(card => {
          const isMatch = card.getAttribute('data-pkg-id') === pkgId;
          card.style.borderColor = isMatch ? '#ea580c' : '#e2e8f0';
          card.style.background = isMatch ? '#fff7ed' : '#ffffff';
          card.style.boxShadow = isMatch ? '0 8px 22px rgba(234,88,12,0.14)' : 'none';
          const chk = card.querySelector('.app-pkg-check');
          if (chk) chk.style.display = isMatch ? 'inline-flex' : 'none';
        });
        if (payBox) {
          if (found && Number(found.price || 0) > 0) {
            payBox.style.display = 'block';
            if (payInstr) payInstr.textContent = found.paymentInstructions || `Selected package fee: ${formatPrice(found)} (${found.billingCycle || 'One-time'}). Complete payment and enter your transaction reference below.`;
            if (payLinkWrap && payLinkBtn) {
              if (found.paymentLink) {
                payLinkBtn.href = found.paymentLink;
                payLinkWrap.style.display = 'block';
              } else {
                payLinkWrap.style.display = 'none';
              }
            }
            if (paymentRefEl) paymentRefEl.required = true;
          } else {
            payBox.style.display = 'none';
            if (paymentRefEl) paymentRefEl.required = false;
          }
        }
      };

      if (pkgs.length > 0) {
        pkgContainer.style.display = 'block';
        pkgContainer.innerHTML = `
          <label class="form-label" style="font-weight:700; display:block; margin-bottom:0.65rem;">Select Fellowship Package / Student Fee Tier *</label>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.85rem;">
            ${pkgs.map(p => `
              <div class="app-pkg-card" data-pkg-id="${escapeHtml(p.id)}" onclick="window.selectApplicationPackage('${escapeHtml(p.id)}')" style="border:2px solid #e2e8f0; border-radius:12px; padding:1rem; background:#ffffff; cursor:pointer; transition:all 0.2s ease; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:0.4rem; margin-bottom:0.35rem;">
                    <span style="font-weight:700; font-size:0.95rem; color:#0f172a;">${escapeHtml(p.name)}</span>
                    <span class="app-pkg-check" style="display:none; width:20px; height:20px; border-radius:50%; background:#ea580c; color:#fff; align-items:center; justify-content:center; font-size:0.72rem; font-weight:700;">✓</span>
                  </div>
                  ${p.badge ? `<span style="display:inline-block; font-size:0.68rem; font-weight:700; color:#ea580c; background:rgba(234,88,12,0.12); padding:2px 7px; border-radius:999px; margin-bottom:0.45rem;">${escapeHtml(p.badge)}</span>` : ''}
                  <div style="font-size:1.35rem; font-weight:800; color:#ea580c; margin-bottom:0.4rem;">${formatPrice(p)} <span style="font-size:0.74rem; font-weight:500; color:#64748b;">/ ${escapeHtml(p.billingCycle || 'One-time')}</span></div>
                  <ul style="margin:0; padding:0; list-style:none; display:flex; flex-direction:column; gap:0.25rem;">
                    ${(p.benefits || []).slice(0, 5).map(b => `<li style="font-size:0.76rem; color:#475569; display:flex; gap:0.35rem;"><span style="color:#10b981;">✓</span><span>${escapeHtml(b)}</span></li>`).join('')}
                  </ul>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        const urlPkg = new URLSearchParams(window.location.search).get('package');
        const initialPkgId = activeOptions.preselectedPackageId || urlPkg || (pkgs.find(p => p.highlighted) || pkgs[0]).id;
        window.selectApplicationPackage(initialPkgId);
      } else {
        pkgContainer.style.display = 'none';
      }
    } catch (e) {}
  }

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

  const customContainer = document.getElementById('appCustomFieldsContainer');
  if (customContainer) {
    if (Array.isArray(formConfig.customFields) && formConfig.customFields.length > 0) {
      customContainer.innerHTML = formConfig.customFields.map((cf, idx) => {
        const inputId = `appCustom_${idx}`;
        const keyAttr = escapeHtml(cf.label || ('Field ' + (idx + 1)));
        const reqAttr = cf.required ? 'required' : '';
        const uniqAttr = cf.unique ? 'data-unique="true"' : '';
        const phAttr = escapeHtml(cf.placeholder || '');
        let inputHtml = '';

        if (cf.type === 'textarea') {
          inputHtml = `<textarea id="${inputId}" class="form-input" rows="3" data-custom-key="${keyAttr}" ${uniqAttr} ${reqAttr} placeholder="${phAttr}"></textarea>`;
        } else if (cf.type === 'select') {
          const opts = Array.isArray(cf.options) ? cf.options : [];
          inputHtml = `
            <select id="${inputId}" class="form-select" data-custom-key="${keyAttr}" ${uniqAttr} ${reqAttr}>
              <option value="">Select option...</option>
              ${opts.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join('')}
            </select>
          `;
        } else if (cf.type === 'number') {
          inputHtml = `<input type="number" step="any" id="${inputId}" class="form-input" data-custom-key="${keyAttr}" ${uniqAttr} ${reqAttr} placeholder="${phAttr}">`;
        } else if (cf.type === 'id') {
          inputHtml = `<input type="text" id="${inputId}" class="form-input" style="font-family:monospace; letter-spacing:0.04em;" data-custom-key="${keyAttr}" ${uniqAttr} ${reqAttr} placeholder="${phAttr || 'e.g. ID-2026-0041'}">`;
        } else if (cf.type === 'email') {
          inputHtml = `<input type="email" id="${inputId}" class="form-input" data-custom-key="${keyAttr}" ${uniqAttr} ${reqAttr} placeholder="${phAttr || 'name@example.com'}">`;
        } else if (cf.type === 'phone') {
          inputHtml = `<input type="tel" id="${inputId}" class="form-input" data-custom-key="${keyAttr}" ${uniqAttr} ${reqAttr} placeholder="${phAttr || '+880 1XXX-XXXXXX'}">`;
        } else if (cf.type === 'date') {
          inputHtml = `<input type="date" id="${inputId}" class="form-input" data-custom-key="${keyAttr}" ${uniqAttr} ${reqAttr}>`;
        } else if (cf.type === 'url') {
          inputHtml = `<input type="text" id="${inputId}" class="form-input" data-custom-key="${keyAttr}" ${uniqAttr} ${reqAttr} placeholder="${phAttr || 'Paste link or path...'}">`;
        } else if (cf.type === 'rating') {
          inputHtml = `
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <div id="${inputId}_stars" style="display:inline-flex; gap:0.25rem;">
                ${[1, 2, 3, 4, 5].map(n => `<button type="button" data-star="${n}" onclick="window.setAppCustomStarRating('${inputId}', ${n})" style="background:none; border:none; font-size:1.7rem; color:#cbd5e1; cursor:pointer; transition:transform 0.15s ease, color 0.15s ease; padding:0 0.1rem;">★</button>`).join('')}
              </div>
              <span id="${inputId}_ratingLabel" style="font-size:0.85rem; font-weight:700; color:#ea580c;"></span>
              <input type="hidden" id="${inputId}" data-custom-key="${keyAttr}" data-custom-required="${cf.required ? '1' : '0'}" ${uniqAttr} value="">
            </div>
          `;
        } else if (cf.type === 'image' || cf.type === 'pfp' || cf.type === 'video') {
          const isVid = cf.type === 'video';
          const isPfp = cf.type === 'pfp';
          const acc = isVid ? 'video/mp4,video/webm,video/*' : 'image/*';
          const btnText = isVid ? 'Upload Video' : (isPfp ? 'Upload Profile Photo' : 'Upload Image');
          inputHtml = `
            <div style="display:flex; flex-direction:column; gap:0.45rem;">
              <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                <button type="button" class="btn btn-primary btn-sm" onclick="window.triggerPublicAppMediaUpload('${inputId}', '${acc}', ${isPfp ? 'true' : 'false'})">${btnText}</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.togglePublicAppUrlInput('${inputId}')">URL</button>
                <span id="${inputId}_status" style="font-size:0.78rem; color:#64748b;"></span>
              </div>
              <div id="${inputId}_urlWrap" style="display:none;">
                <input type="text" id="${inputId}" class="form-input" data-custom-key="${keyAttr}" data-custom-required="${cf.required ? '1' : '0'}" ${uniqAttr} placeholder="${phAttr || 'Paste URL or server path...'}">
              </div>
              <div id="${inputId}_preview"></div>
            </div>
          `;
        } else if (cf.type === 'checkbox') {
          inputHtml = `
            <label style="display:flex; align-items:center; gap:0.55rem; font-size:0.9rem; cursor:pointer; padding:0.5rem 0.75rem; background:#faf8f5; border-radius:8px; border:1px solid #d4c8b6;">
              <input type="checkbox" id="${inputId}" data-custom-key="${keyAttr}" data-is-checkbox="1" ${reqAttr} style="width:17px; height:17px; accent-color:#ea580c;">
              <span>${phAttr || 'Yes, I confirm'}</span>
            </label>
          `;
        } else {
          inputHtml = `<input type="text" id="${inputId}" class="form-input" data-custom-key="${keyAttr}" ${uniqAttr} ${reqAttr} placeholder="${phAttr}">`;
        }

        return `
          <div class="form-group" style="margin-bottom:1.25rem;">
            <label class="form-label" for="${inputId}" style="font-weight:600; display:flex; align-items:center; gap:0.45rem;">
              <span>${keyAttr} ${cf.required ? '*' : ''}</span>
              ${cf.unique ? '<span style="font-size:0.68rem; font-weight:700; color:#ea580c; background:rgba(234,88,12,0.1); padding:1px 6px; border-radius:999px;">Unique</span>' : ''}
            </label>
            ${inputHtml}
            ${cf.unique ? `<div id="${inputId}_uniqueStatus" style="font-size:0.78rem; margin-top:0.3rem; min-height:1em;"></div>` : ''}
          </div>
        `;
      }).join('');

      formConfig.customFields.forEach((cf, idx) => {
        if (!cf.unique) return;
        const inputEl = document.getElementById(`appCustom_${idx}`);
        const statusEl = document.getElementById(`appCustom_${idx}_uniqueStatus`);
        bindUniqueAutoCheck(inputEl, cf.label || ('Field ' + (idx + 1)), true, statusEl);
      });
    } else {
      customContainer.innerHTML = '';
    }
  }

  if (!form) return;
  if (form.dataset.criiBound === '1') return;
  form.dataset.criiBound = '1';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const uniqueChecks = [];
    const applicantEmail = document.getElementById('appEmail')?.value.trim() || document.getElementById('curiousEmailInput')?.value.trim() || '';
    if (formConfig.uniqueEmail && applicantEmail) {
      uniqueChecks.push({ fieldKey: 'email', label: 'Email Address', value: applicantEmail, isCustom: false });
    }
    if (selectedPackageObj && Number(selectedPackageObj.price || 0) > 0 && paymentRefEl && paymentRefEl.value.trim()) {
      uniqueChecks.push({ fieldKey: 'paymentRef', label: 'Payment Transaction ID', value: paymentRefEl.value.trim(), isCustom: false });
    }

    const customFields = {};
    const customEls = document.querySelectorAll('#appCustomFieldsContainer [data-custom-key]');
    for (const el of customEls) {
      const key = el.getAttribute('data-custom-key');
      const isCb = el.getAttribute('data-is-checkbox') === '1';
      const val = isCb ? (el.checked ? 'Yes' : 'No') : String(el.value || '').trim();
      if (el.getAttribute('data-custom-required') === '1' && !val) {
        alert(`Please complete the required field: "${key}"`);
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (el.dataset.uniqueConflict === 'true') {
        alert(`"${key}" already exists in our records and must be unique.`);
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (el.getAttribute('data-unique') === 'true' && val) {
        uniqueChecks.push({ fieldKey: key, label: key, value: val, isCustom: true });
      }
      if (key) customFields[key] = val;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Verifying & Transmitting Dossier...';
    }

    const formatFeeText = (pkg) => {
      if (!pkg) return '';
      const n = Number(pkg.price || 0);
      if (!n || n <= 0) return 'Free';
      return `${pkg.currency || 'BDT'} ${n.toLocaleString()} (${pkg.billingCycle || 'One-time'})`;
    };

    const formData = {
      fullName: document.getElementById('appFullName')?.value.trim() || document.getElementById('curiousNameInput')?.value.trim() || 'Fellow Applicant',
      email: applicantEmail,
      university: document.getElementById('appUniversity')?.value.trim() || '',
      fieldOfStudy: document.getElementById('appFieldOfStudy')?.value.trim() || '',
      preferredDivision: document.getElementById('appDivision')?.value || 'General Science',
      academicLevel: document.getElementById('appLevel')?.value || '',
      portfolioUrl: document.getElementById('appPortfolio')?.value.trim() || '',
      statement: document.getElementById('appStatement')?.value.trim() || '',
      packageId: selectedPackageObj ? selectedPackageObj.id : '',
      packageName: selectedPackageObj ? selectedPackageObj.name : '',
      packageFee: selectedPackageObj ? formatFeeText(selectedPackageObj) : '',
      paymentRef: paymentRefEl ? paymentRefEl.value.trim() : '',
      paymentReceiptUrl: document.getElementById('appPaymentReceiptInput')?.value.trim() || '',
      recruitPageSlug: activeOptions.recruitPageSlug || '',
      customFields,
      uniqueChecks
    };

    try {
      const res = await window.CRII_API.submitInternApplication(formData);

      const formCardEl = document.getElementById('applicationFormCard');
      if (formCardEl) {
        formCardEl.innerHTML = `
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
              <span style="color:var(--accent-primary, #ea580c); font-weight:700;">${escapeHtml(res.preferredDivision)}</span> track${res.packageName ? ` (${escapeHtml(res.packageName)})` : ''} has been entered into the admissions queue.
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
              message: `New fellowship application received from ${res.fullName} (${res.email}) from ${res.university} for track: ${res.preferredDivision} (${res.academicLevel}).\nPackage: ${res.packageName || 'Standard'} (${res.packageFee || 'Free'})\nPayment Ref: ${res.paymentRef || 'N/A'}\nPortfolio: ${res.portfolioUrl || 'None'}\n\nStatement:\n${res.statement}`
            }, 'h3x_9dtR8frBq2pCi');
          }
        } catch (mailErr) {}
      }
    } catch (err) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Fellowship Application →';
      }
      alert(err.message || 'There was an issue submitting your application. Please check your entries and try again.');
    }
  });
}
