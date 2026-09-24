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
      <div class="intern-card">
        <div class="intern-header">
          <div class="intern-avatar">${initials}</div>
          <div class="intern-info">
            <h3>${intern.name}</h3>
            <div class="intern-role">${intern.role}</div>
            <div class="intern-university">${intern.university}</div>
          </div>
        </div>

        <div style="font-size:0.8rem; color:var(--text-cyan); font-weight:600;">
          Division: ${intern.division}
        </div>

        <p class="intern-bio">${intern.bio}</p>

        <div class="intern-projects">
          <span class="intern-projects-title">Active Projects & Focus</span>
          <div style="display:flex; flex-wrap:wrap; gap:0.35rem;">
            ${(intern.projects || []).map(p => `<span class="tag-item">🔬 ${p}</span>`).join('')}
          </div>
        </div>

        <div style="margin-top:auto; padding-top:1rem; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:var(--text-dim);">
          <span>Cohort: ${intern.cohort}</span>
          <span class="badge badge-emerald">Active Fellow</span>
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
          <div style="width:64px; height:64px; border-radius:50%; background:rgba(16, 185, 129, 0.2); border:1px solid #10b981; color:#10b981; display:grid; place-items:center; font-size:2rem; margin:0 auto 1.5rem;">✓</div>
          <h2 style="font-size:1.8rem; margin-bottom:0.75rem; color:#fff;">Application Received!</h2>
          <p style="color:var(--text-muted); max-width:540px; margin:0 auto 1.5rem;">
            Thank you, <strong style="color:#fff;">${res.fullName}</strong>. Your research application for the 
            <span style="color:var(--cyan-bright); font-weight:600;">${res.preferredDivision}</span> division has been logged into the CRII admissions registry.
          </p>
          <div style="background:rgba(0,0,0,0.4); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); display:inline-block; font-family:var(--font-mono); font-size:0.9rem; color:var(--cyan-bright); margin-bottom:2rem;">
            Application Reference: ${res.id}
          </div>
          <div>
            <a href="research.html" class="btn btn-secondary">Explore Research Papers</a>
          </div>
        </div>
      `;

      window.showToast('Research internship application successfully submitted!', 'success');
    } catch (err) {
      window.showToast('Submission error. Please verify fields and retry.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Submit Research Application`;
    }
  });
}
