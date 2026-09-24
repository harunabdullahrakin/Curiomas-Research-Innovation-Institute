/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Interns Showcase & Application Form Script
 */

document.addEventListener('DOMContentLoaded', async () => {
  await loadInternRoster();
  initApplicationForm();
});

async function loadInternRoster() {
  const data = await window.CRII_API.getInternsData();
  const container = document.getElementById('internRosterContainer');
  if (!container) return;

  container.innerHTML = data.activeInterns.map(intern => {
    const initials = intern.name.split(' ').map(n => n[0]).join('').slice(0, 2);
    return `
      <div class="card">
        <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem;">
          <div style="width:48px; height:48px; border-radius:50%; background:var(--accent-primary); color:#fff; display:grid; place-items:center; font-weight:700; font-size:1.1rem; flex-shrink:0;">
            ${initials}
          </div>
          <div>
            <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:0.15rem;">${intern.name}</h3>
            <div style="font-size:0.82rem; color:var(--accent-primary); font-weight:600;">${intern.role}</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">${intern.university}</div>
          </div>
        </div>

        <div style="margin-bottom:0.75rem;">
          <span class="badge badge-indigo">${intern.division}</span>
        </div>

        <p class="card-desc" style="font-size:0.88rem; margin-bottom:1rem;">${intern.bio}</p>

        <div style="margin-bottom:1.25rem;">
          <span style="font-size:0.7rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; display:block; margin-bottom:0.35rem;">Active Focus</span>
          <div style="display:flex; flex-wrap:wrap; gap:0.35rem;">
            ${(intern.projects || []).map(p => `<span class="tag-item">${p}</span>`).join('')}
          </div>
        </div>

        <div class="card-footer">
          <span style="font-size:0.78rem; color:var(--text-muted);">Cohort: ${intern.cohort}</span>
          <span class="status-chip accepted">Active Fellow</span>
        </div>
      </div>
    `;
  }).join('');
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
      experienceLevel: document.getElementById('appLevel').value,
      githubOrPortfolio: document.getElementById('appPortfolio').value.trim(),
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
      window.showToast('Submission error. Please check fields and retry.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Submit Research Fellowship Application`;
    }
  });
}
