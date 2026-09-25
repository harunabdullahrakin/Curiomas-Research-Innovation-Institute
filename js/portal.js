/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Portal Management Dashboard Script
 * - Publications Manager with Live Markdown
 * - Admissions Queue & Review
 * - Datasets Manager
 * - Whitelist Access Control & Permission Roles
 * - Institute & Navbar Title Settings
 */

let currentTab = 'overview';
let cachedPosts = [];
let cachedInternsData = { activeInterns: [], applications: [] };
let cachedDatasets = [];

document.addEventListener('DOMContentLoaded', async () => {
  const user = window.CRII_API.getCurrentUser();
  const authSection = document.getElementById('portalAuthSection');
  const dashboardSection = document.getElementById('portalDashboardSection');

  if (!user) {
    if (authSection) authSection.style.display = 'flex';
    if (dashboardSection) dashboardSection.style.display = 'none';
    return;
  }

  if (authSection) authSection.style.display = 'none';
  if (dashboardSection) dashboardSection.style.display = 'flex';

  // Render User profile
  document.getElementById('portalUserName').innerText = user.name;
  document.getElementById('portalUserEmail').innerText = user.email;
  document.getElementById('portalUserRole').innerText = user.role;

  initSidebarNavigation();
  await refreshDashboardData();
  initPostForm();
  initDatasetForm();
  initMarkdownLivePreview();
  initApplicationModal();
  initAccessControl();
  initInstituteSettings();
});

function initSidebarNavigation() {
  const buttons = document.querySelectorAll('.portal-nav-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.tab;
      showTab(currentTab);
    });
  });

  const logoutBtn = document.getElementById('portalLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.CRII_API.logout();
    });
  }
}

window.showTab = function(tabName) {
  document.querySelectorAll('.portal-tab-content').forEach(el => el.style.display = 'none');
  const target = document.getElementById(`tab-${tabName}`);
  if (target) target.style.display = 'block';

  document.querySelectorAll('.portal-nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabName);
  });
};

async function refreshDashboardData() {
  const stats = await window.CRII_API.getStats();
  cachedPosts = await window.CRII_API.getPosts();
  cachedInternsData = await window.CRII_API.getInternsData();
  cachedDatasets = await window.CRII_API.getDatasets();

  // Metrics
  const statPapers = document.getElementById('statPapers');
  if (statPapers) statPapers.innerText = stats.publishedPapers;
  const statInterns = document.getElementById('statInterns');
  if (statInterns) statInterns.innerText = stats.activeInterns;
  const statApps = document.getElementById('statApps');
  if (statApps) statApps.innerText = stats.pendingApplications;
  const statDatasets = document.getElementById('statDatasets');
  if (statDatasets) statDatasets.innerText = stats.openDatasets;

  const appBadge = document.getElementById('sidebarAppBadge');
  if (appBadge) appBadge.innerText = stats.pendingApplications;

  renderPostsTable();
  renderApplicationsTable();
  renderDatasetsTable();
  renderAllowedUsersTable();
}

// 1. PUBLICATIONS MANAGER
function renderPostsTable() {
  const tbody = document.getElementById('portalPostsTbody');
  if (!tbody) return;

  tbody.innerHTML = cachedPosts.map(post => {
    const isPub = post.published !== false;
    return `
      <tr>
        <td>
          <div style="font-weight:600; color:var(--text-primary);">${post.title}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">${post.slug || post.id}</div>
        </td>
        <td><span class="badge badge-blue">${post.category}</span></td>
        <td>${post.date}</td>
        <td>
          <span class="status-chip ${isPub ? 'published' : 'draft'}">
            ${isPub ? 'Published' : 'Draft'}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn btn-secondary btn-sm" onclick="togglePublishPost('${post.id}')">
              ${isPub ? 'Unpublish' : 'Publish'}
            </button>
            <a href="article.html?id=${post.id}" target="_blank" class="btn btn-glass btn-sm">View</a>
            <button class="btn btn-sm" style="background:rgba(239, 68, 68, 0.1); color:#ef4444; border:1px solid rgba(239, 68, 68, 0.25);" onclick="deletePost('${post.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.togglePublishPost = async function(id) {
  await window.CRII_API.togglePostPublish(id);
  window.showToast('Publication status updated', 'success');
  await refreshDashboardData();
};

window.deletePost = async function(id) {
  if (confirm('Are you sure you want to delete this research publication?')) {
    await window.CRII_API.deletePost(id);
    window.showToast('Publication deleted', 'info');
    await refreshDashboardData();
  }
};

function initPostForm() {
  const form = document.getElementById('newPostForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('postTitleInput').value.trim();
    const category = document.getElementById('postCategoryInput').value;
    const authorsStr = document.getElementById('postAuthorsInput').value.trim();
    const readingTime = document.getElementById('postReadTimeInput').value.trim();
    const summary = document.getElementById('postSummaryInput').value.trim();
    const coverInput = document.getElementById('postCoverInput');
    const coverImage = coverInput ? coverInput.value.trim() : '';
    const abstract = document.getElementById('postAbstractInput').value.trim();
    const content = document.getElementById('postContentInput').value.trim();
    const tagsStr = document.getElementById('postTagsInput').value.trim();
    const isPublished = document.getElementById('postPublishToggle').checked;

    const postData = {
      title,
      category,
      coverImage: coverImage || undefined,
      authors: authorsStr ? authorsStr.split(',').map(a => a.trim()) : ["CRII Fellow"],
      readingTime: readingTime || "8 min read",
      summary,
      abstract,
      content,
      tags: tagsStr ? tagsStr.split(',').map(t => t.trim()) : ["Research"],
      published: isPublished
    };

    await window.CRII_API.createPost(postData);
    window.showToast('Research article successfully published!', 'success');
    form.reset();
    document.getElementById('markdownLivePreview').innerHTML = '<p style="color:var(--text-muted);">Live preview will appear here...</p>';
    await refreshDashboardData();
  });
}

function initMarkdownLivePreview() {
  const contentInput = document.getElementById('postContentInput');
  const previewBox = document.getElementById('markdownLivePreview');

  if (contentInput && previewBox) {
    contentInput.addEventListener('input', () => {
      const val = contentInput.value;
      if (!val) {
        previewBox.innerHTML = '<p style="color:var(--text-muted);">Live preview will appear here...</p>';
        return;
      }
      let html = val
        .replace(/^### (.*$)/gim, '<h4 style="margin:1rem 0 0.5rem;">$1</h4>')
        .replace(/^## (.*$)/gim, '<h3 style="margin:1.2rem 0 0.5rem;">$1</h3>')
        .replace(/^# (.*$)/gim, '<h2 style="margin:1.5rem 0 0.5rem;">$1</h2>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\$\$(.*?)\$\$/gs, '<div style="background:rgba(0,0,0,0.06); padding:0.5rem; font-family:monospace; margin:0.5rem 0;">$$$1$$</div>')
        .replace(/\n/g, '<br/>');
      previewBox.innerHTML = html;
    });
  }
}

// 2. INTERN ADMISSIONS QUEUE
function renderApplicationsTable() {
  const tbody = document.getElementById('portalAppsTbody');
  if (!tbody) return;

  tbody.innerHTML = cachedInternsData.applications.map(app => {
    let chipClass = 'pending';
    if (app.status === 'Accepted') chipClass = 'accepted';
    if (app.status === 'Rejected') chipClass = 'rejected';

    return `
      <tr>
        <td>
          <div style="font-weight:600; color:var(--text-primary);">${app.fullName}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${app.email}</div>
        </td>
        <td>
          <div style="font-size:0.85rem;">${app.university}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${app.fieldOfStudy}</div>
        </td>
        <td><span class="badge badge-indigo">${app.preferredDivision}</span></td>
        <td>${app.appliedDate}</td>
        <td><span class="status-chip ${chipClass}">${app.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="reviewApplication('${app.id}')">Review</button>
        </td>
      </tr>
    `;
  }).join('');
}

let currentReviewAppId = null;
window.reviewApplication = function(appId) {
  const app = cachedInternsData.applications.find(a => a.id === appId);
  if (!app) return;

  currentReviewAppId = appId;
  const modal = document.getElementById('appReviewModal');
  const detailsEl = document.getElementById('appReviewDetails');

  detailsEl.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-bottom:1.5rem; background:var(--bg-primary); padding:1.25rem; border-radius:12px; border:1px solid var(--border-color);">
      <div>
        <span style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted);">Applicant</span>
        <div style="font-weight:700; color:var(--text-primary); font-size:1.1rem;">${app.fullName}</div>
        <div style="font-size:0.85rem; color:var(--text-secondary);">${app.email}</div>
      </div>
      <div>
        <span style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted);">Institution & Level</span>
        <div style="color:var(--text-primary);">${app.university}</div>
        <div style="font-size:0.85rem; color:var(--text-muted);">${app.fieldOfStudy} (${app.experienceLevel || 'Undergraduate'})</div>
      </div>
      <div>
        <span style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted);">Applied Division</span>
        <div style="color:var(--accent-primary); font-weight:600;">${app.preferredDivision}</div>
      </div>
      <div>
        <span style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted);">Portfolio / GitHub</span>
        <div><a href="${app.githubOrPortfolio}" target="_blank" style="font-size:0.85rem;">${app.githubOrPortfolio || 'None provided'}</a></div>
      </div>
    </div>

    <div>
      <h4 style="font-size:0.85rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.5rem;">Statement of Research Curiosity</h4>
      <div style="background:var(--bg-primary); padding:1rem; border-radius:8px; border:1px solid var(--border-color); font-size:0.92rem; line-height:1.6; color:var(--text-secondary); font-style:italic;">
        "${app.statement || 'No statement provided.'}"
      </div>
    </div>
  `;

  modal.classList.add('active');
};

function initApplicationModal() {
  document.getElementById('acceptAppBtn').addEventListener('click', async () => {
    if (currentReviewAppId) {
      await window.CRII_API.updateApplicationStatus(currentReviewAppId, 'Accepted');
      window.showToast('Applicant accepted and enrolled into research cohort!', 'success');
      document.getElementById('appReviewModal').classList.remove('active');
      await refreshDashboardData();
    }
  });

  document.getElementById('reviewUnderwayBtn').addEventListener('click', async () => {
    if (currentReviewAppId) {
      await window.CRII_API.updateApplicationStatus(currentReviewAppId, 'Under Review');
      window.showToast('Application marked as Under Review', 'info');
      document.getElementById('appReviewModal').classList.remove('active');
      await refreshDashboardData();
    }
  });

  document.getElementById('rejectAppBtn').addEventListener('click', async () => {
    if (currentReviewAppId) {
      await window.CRII_API.updateApplicationStatus(currentReviewAppId, 'Rejected');
      window.showToast('Application declined', 'info');
      document.getElementById('appReviewModal').classList.remove('active');
      await refreshDashboardData();
    }
  });
}

// 3. DATASETS MANAGER
function renderDatasetsTable() {
  const tbody = document.getElementById('portalDatasetsTbody');
  if (!tbody) return;

  tbody.innerHTML = cachedDatasets.map(ds => {
    return `
      <tr>
        <td>
          <div style="font-weight:600; color:var(--text-primary);">${ds.title}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${ds.format} • ${ds.size}</div>
        </td>
        <td><span class="badge badge-indigo">${ds.category}</span></td>
        <td>${ds.version}</td>
        <td>${ds.leadResearcher}</td>
        <td>${ds.license}</td>
      </tr>
    `;
  }).join('');
}

function initDatasetForm() {
  const form = document.getElementById('newDatasetForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newDs = {
      title: document.getElementById('dsTitleInput').value.trim(),
      category: document.getElementById('dsCategoryInput').value,
      version: document.getElementById('dsVersionInput').value.trim() || 'v1.0.0',
      format: document.getElementById('dsFormatInput').value.trim() || 'CSV',
      size: document.getElementById('dsSizeInput').value.trim() || '15 MB',
      license: document.getElementById('dsLicenseInput').value.trim() || 'CC-BY 4.0 Open Science',
      leadResearcher: document.getElementById('dsLeadInput').value.trim(),
      description: document.getElementById('dsDescInput').value.trim(),
      parameters: document.getElementById('dsParamsInput').value.split(',').map(p => p.trim())
    };

    await window.CRII_API.createDataset(newDs);
    window.showToast('Scientific dataset registered successfully!', 'success');
    form.reset();
    await refreshDashboardData();
  });
}

// 4. ACCESS CONTROL & USER PERMISSIONS (AUTZ WHITELIST)
function renderAllowedUsersTable() {
  const tbody = document.getElementById('allowedUsersTbody');
  if (!tbody) return;

  const users = window.CRII_API.getAllowedUsers();
  tbody.innerHTML = users.map(u => {
    const isRoot = u.email === 'harunabdullahrakin@gmail.com';
    return `
      <tr>
        <td>
          <div style="font-weight:600; color:var(--text-primary);">${u.name}</div>
          <div style="font-size:0.78rem; color:var(--accent-primary);">${u.email}</div>
        </td>
        <td>
          <span class="badge ${isRoot ? 'badge-amber' : 'badge-blue'}">${u.role}</span>
        </td>
        <td>${u.division}</td>
        <td>${u.addedDate || 'Initial'}</td>
        <td>
          ${isRoot ? '<span style="font-size:0.75rem; color:var(--text-muted);">Root Super Admin</span>' : `
            <button class="btn btn-sm" style="background:rgba(239, 68, 68, 0.1); color:#ef4444; border:1px solid rgba(239, 68, 68, 0.25);" onclick="removeAllowedEmail('${u.email}')">
              Revoke Access
            </button>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

function initAccessControl() {
  const form = document.getElementById('addAllowedUserForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newAllowedEmail').value.trim();
    const name = document.getElementById('newAllowedName').value.trim();
    const role = document.getElementById('newAllowedRole').value;
    const division = document.getElementById('newAllowedDivision').value;

    const res = window.CRII_API.addAllowedUser({ email, name, role, division });
    if (res.success) {
      window.showToast(`User ${email} added to Autz.org Whitelist!`, 'success');
      form.reset();
      renderAllowedUsersTable();
    } else {
      window.showToast(res.error || 'Failed to add user', 'error');
    }
  });
}

window.removeAllowedEmail = function(email) {
  if (confirm(`Are you sure you want to revoke portal access for ${email}?`)) {
    const res = window.CRII_API.removeAllowedUser(email);
    if (res.success) {
      window.showToast(`Access revoked for ${email}`, 'info');
      renderAllowedUsersTable();
    } else {
      window.showToast(res.error, 'error');
    }
  }
};

// 5. INSTITUTE & NAVBAR SETTINGS
function initInstituteSettings() {
  const form = document.getElementById('instituteSettingsForm');
  if (!form) return;

  const titleInput = document.getElementById('settingNavbarTitle');
  const logoInput = document.getElementById('settingLogoUrl');
  const autzInput = document.getElementById('settingAutzAppId');

  titleInput.value = window.CRII_API.getInstituteName();
  logoInput.value = window.CRII_API.getInstituteLogo();
  autzInput.value = window.CRII_API.getAutzAppId();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTitle = titleInput.value.trim();
    const newLogo = logoInput.value.trim();
    const newAutzId = autzInput.value.trim();

    window.CRII_API.setInstituteName(newTitle);
    window.CRII_API.setInstituteLogo(newLogo);
    window.CRII_API.setAutzAppId(newAutzId);

    window.showToast('Institute & Navbar branding settings saved!', 'success');
    setTimeout(() => window.location.reload(), 400);
  });
}
