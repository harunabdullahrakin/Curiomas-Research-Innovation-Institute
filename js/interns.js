/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Interns & Core Team Showcase Script
 */

document.addEventListener('DOMContentLoaded', async () => {
  await loadRosters();
  initApplicationForm();
});

async function loadRosters() {
  const data = await window.CRII_API.getInternsData();
  const allMembers = data.activeInterns || [];

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
  const avatarUrl = member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  const isTeam = Boolean(member.isTeamMember);

  let socialsHtml = '';
  if (member.socials) {
    const s = member.socials;
    if (s.github) {
      socialsHtml += `
        <a href="${s.github}" target="_blank" rel="noopener" class="btn btn-sm btn-icon" title="GitHub" style="background:rgba(0,0,0,0.04);">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
          </svg>
        </a>
      `;
    }
    if (s.linkedin) {
      socialsHtml += `
        <a href="${s.linkedin}" target="_blank" rel="noopener" class="btn btn-sm btn-icon" title="LinkedIn" style="background:rgba(0,0,0,0.04);">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
          </svg>
        </a>
      `;
    }
    if (s.email) {
      socialsHtml += `
        <a href="mailto:${s.email}" class="btn btn-sm btn-icon" title="Email" style="background:rgba(0,0,0,0.04);">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </a>
      `;
    }
  }

  return `
    <div class="card reveal-on-scroll">
      <div style="display:flex; align-items:center; gap:1.15rem; margin-bottom:1.15rem;">
        <img src="${avatarUrl}" alt="${member.name}" style="width:58px; height:58px; border-radius:50%; object-fit:cover; border:2px solid var(--accent-primary); box-shadow:var(--shadow-sm); flex-shrink:0;" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'">
        <div>
          <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:0.15rem;">${member.name}</h3>
          <div style="font-size:0.84rem; color:var(--accent-primary); font-weight:600;">${member.role}</div>
          <div style="font-size:0.78rem; color:var(--text-muted);">${member.university || 'Curiomas CRII'}</div>
        </div>
      </div>

      <div style="display:flex; gap:0.4rem; align-items:center; margin-bottom:0.85rem; flex-wrap:wrap;">
        <span class="badge badge-indigo">${member.division}</span>
        ${isTeam ? `<span class="badge badge-blue">★ Principal Leadership</span>` : `<span class="badge badge-blue">Active Fellow</span>`}
      </div>

      <p class="card-desc" style="font-size:0.9rem; line-height:1.6; margin-bottom:1.25rem;">
        ${member.bio || 'Contributing to open student-led research.'}
      </p>

      ${(member.projects && member.projects.length > 0) ? `
        <div style="margin-bottom:1.25rem;">
          <span style="font-size:0.7rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; display:block; margin-bottom:0.35rem;">Research Focus</span>
          <div style="display:flex; flex-wrap:wrap; gap:0.35rem;">
            ${member.projects.map(p => `<span class="tag-item">${p}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <div class="card-footer" style="padding-top:0.75rem; border-top:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.76rem; color:var(--text-muted);">Cohort: ${member.cohort || 'Founding'}</span>
        <div style="display:flex; gap:0.35rem;">
          ${socialsHtml}
        </div>
      </div>
    </div>
  `;
}

function initApplicationForm() {
  const form = document.getElementById('internApplicationForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Submitting Application...`;

    const formData = {
      fullName: document.getElementById('appFullName').value.trim(),
      email: document.getElementById('appEmail').value.trim(),
      university: document.getElementById('appUniversity').value.trim(),
      fieldOfStudy: document.getElementById('appFieldOfStudy').value.trim(),
      preferredDivision: document.getElementById('appDivision').value,
      statement: document.getElementById('appStatement').value.trim()
    };

    try {
      const res = await window.CRII_API.submitInternApplication(formData);
      
      const formCard = document.getElementById('applicationFormCard');
      formCard.innerHTML = `
        <div style="text-align:center; padding:3rem 1.5rem;">
          <div style="width:56px; height:56px; border-radius:50%; background:rgba(16, 185, 129, 0.1); border:1px solid #10b981; color:#059669; display:grid; place-items:center; margin:0 auto 1.5rem;">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>
          <h2 style="font-size:1.8rem; margin-bottom:0.75rem; color:var(--text-primary);">Application Received</h2>
          <p style="color:var(--text-secondary); max-width:540px; margin:0 auto 1.5rem; line-height:1.6;">
            Thank you, <strong>${res.fullName}</strong>. Your research application for the 
            <span style="color:var(--accent-primary); font-weight:600;">${res.preferredDivision}</span> track has been submitted to the admissions review board.
          </p>
          <div style="background:var(--bg-primary); padding:0.85rem 1.25rem; border-radius:10px; border:1px solid var(--border-color); display:inline-block; font-family:monospace; font-size:0.88rem; color:var(--accent-primary); margin-bottom:2rem;">
            Application Reference: ${res.id}
          </div>
          <div>
            <a href="research.html" class="btn btn-secondary">Explore Research Papers</a>
          </div>
        </div>
      `;

      window.showToast('Research application successfully submitted!', 'success');
    } catch (err) {
      window.showToast('Failed to submit application. Please try again.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Submit Application`;
    }
  });
}
