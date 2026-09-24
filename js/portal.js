/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Portal Management Dashboard Script
 * Handles: Posts Publisher, Intern Applicant Review, Dataset Creator, System Diagnostics
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
    if (authSection) authSection.style.display = 'block';
    if (dashboardSection) dashboardSection.style.display = 'none';
    return;
  }

  if (authSection) authSection.style.display = 'none';
  if (dashboardSection) dashboardSection.style.display = 'flex';

  // Render User details in sidebar
  document.getElementById('portalUserName').innerText = user.name;
  document.getElementById('portalUserRole').innerText = user.role;

  initSidebarNavigation();
  await refreshDashboardData();
  initPostForm();
  initDatasetForm();
  initMarkdownLivePreview();
  initApplicationModal();
  checkCloudflareBackendStatus();
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

function showTab(tabName) {
  document.querySelectorAll('.portal-tab-content').forEach(el => el.style.display = 'none');
  const target = document.getElementById(`tab-${tabName}`);
  if (target) target.style.display = 'block';
}

async function refreshDashboardData() {
  const stats = await window.CRII_API.getStats();
  cachedPosts = await window.CRII_API.getPosts();
  cachedInternsData = await window.CRII_API.getInternsData();
  cachedDatasets = await window.CRII_API.getDatasets();

  // Metrics
  document.getElementById('statPapers').innerText = stats.publishedPapers;
  document.getElementById('statInterns').innerText = stats.activeInterns;
  document.getElementById('statApps').innerText = stats.pendingApplications;
  document.getElementById('statDatasets').innerText = stats.openDatasets;
  document.getElementById('statDownloads').innerText = stats.totalDownloads;
  document.getElementById('statCitations').innerText = stats.totalCitations;

  // Sidebar badges
  const appBadge = document.getElementById('sidebarAppBadge');
  if (appBadge) appBadge.innerText = stats.pendingApplications;

  renderPostsTable();
  renderApplicationsTable();
  renderDatasetsTable();
}

// --- POSTS MANAGER ---
function renderPostsTable() {
  const tbody = document.getElementById('portalPostsTbody');
  if (!tbody) return;

  tbody.innerHTML = cachedPosts.map(post => {
    const isPub = post.published !== false;
    return `
      <tr>
        <td>
          <div style="font-weight:600; color:#fff;">${post.title}</div>
          <div style="font-size:0.75rem; color:var(--text-dim); font-family:var(--font-mono);">${post.slug || post.id}</div>
        </td>
        <td><span class="badge badge-cyan">${post.category}</span></td>
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
            <button class="btn btn-sm" style="background:rgba(239, 68, 68, 0.2); color:#f87171; border:1px solid rgba(239, 68, 68, 0.4);" onclick="deletePost('${post.id}')">Delete</button>
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
    const abstract = document.getElementById('postAbstractInput').value.trim();
    const content = document.getElementById('postContentInput').value.trim();
    const tagsStr = document.getElementById('postTagsInput').value.trim();
    const isPublished = document.getElementById('postPublishToggle').checked;

    const postData = {
      title,
      category,
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
    document.getElementById('markdownLivePreview').innerHTML = '<p style="color:var(--text-dim);">Live preview will appear here...</p>';
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
        previewBox.innerHTML = '<p style="color:var(--text-dim);">Live preview will appear here...</p>';
        return;
      }
      let html = val
        .replace(/^### (.*$)/gim, '<h4 style="color:#fff; margin:1rem 0 0.5rem;">$1</h4>')
        .replace(/^## (.*$)/gim, '<h3 style="color:#fff; margin:1.2rem 0 0.5rem;">$1</h3>')
        .replace(/^# (.*$)/gim, '<h2 style="color:#fff; margin:1.5rem 0 0.5rem;">$1</h2>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\$\$(.*?)\$\$/gs, '<code style="background:rgba(0,0,0,0.4); padding:0.2rem 0.4rem; color:var(--cyan-bright); display:block; margin:0.5rem 0;">$$$1$$</code>')
        .replace(/\n/g, '<br/>');
      previewBox.innerHTML = html;
    });
  }
}

// --- INTERN APPLICATIONS MANAGER ---
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
          <div style="font-weight:600; color:#fff;">${app.fullName}</div>
          <div style="font-size:0.75rem; color:var(--text-dim);">${app.email}</div>
        </td>
        <td>
          <div style="font-size:0.85rem;">${app.university}</div>
          <div style="font-size:0.75rem; color:var(--text-dim);">${app.fieldOfStudy}</div>
        </td>
        <td><span class="badge badge-purple">${app.preferredDivision}</span></td>
        <td>${app.appliedDate}</td>
        <td><span class="status-chip ${chipClass}">${app.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="reviewApplication('${app.id}')">Review</button>
        </td>
      </tr>
    `;
  }).join('');
}

function initApplicationModal() {
  // Modal buttons
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

let currentReviewAppId = null;
window.reviewApplication = function(appId) {
  const app = cachedInternsData.applications.find(a => a.id === appId);
  if (!app) return;

  currentReviewAppId = appId;
  const modal = document.getElementById('appReviewModal');
  const detailsEl = document.getElementById('appReviewDetails');

  detailsEl.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-bottom:1.5rem; background:rgba(0,0,0,0.3); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
      <div>
        <span style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim);">Applicant</span>
        <div style="font-weight:700; color:#fff; font-size:1.1rem;">${app.fullName}</div>
        <div style="font-size:0.85rem; color:var(--text-muted);">${app.email}</div>
      </div>
      <div>
        <span style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim);">Institution & Level</span>
        <div style="color:#fff;">${app.university}</div>
        <div style="font-size:0.85rem; color:var(--text-dim);">${app.fieldOfStudy} (${app.experienceLevel || 'Undergraduate'})</div>
      </div>
      <div>
        <span style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim);">Applied Division</span>
        <div style="color:var(--cyan-bright); font-weight:600;">${app.preferredDivision}</div>
      </div>
      <div>
        <span style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim);">Portfolio / GitHub</span>
        <div><a href="${app.githubOrPortfolio}" target="_blank" style="font-size:0.85rem;">${app.githubOrPortfolio || 'None provided'}</a></div>
      </div>
    </div>

    <div>
      <h4 style="font-size:0.85rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:0.5rem;">Statement of Research Purpose</h4>
      <div style="background:rgba(0,0,0,0.4); padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); font-size:0.92rem; line-height:1.6; color:#e2e8f0; font-style:italic;">
        "${app.statement || 'No statement provided.'}"
      </div>
    </div>
  `;

  modal.classList.add('active');
};

// --- DATASETS MANAGER ---
function renderDatasetsTable() {
  const tbody = document.getElementById('portalDatasetsTbody');
  if (!tbody) return;

  tbody.innerHTML = cachedDatasets.map(ds => {
    return `
      <tr>
        <td>
          <div style="font-weight:600; color:#fff;">${ds.title}</div>
          <div style="font-size:0.75rem; color:var(--text-dim);">${ds.format} • ${ds.size}</div>
        </td>
        <td><span class="badge badge-purple">${ds.category}</span></td>
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
    window.showToast('Open research dataset published to catalog!', 'success');
    form.reset();
    await refreshDashboardData();
  });
}

// --- CLOUDFLARE SYSTEM & DIAGNOSTICS ---
async function checkCloudflareBackendStatus() {
  const statusEl = document.getElementById('cfStatusIndicator');
  if (!statusEl) return;

  const isCf = await window.CRII_API.checkBackend();
  if (isCf) {
    statusEl.innerHTML = `
      <span style="color:#10b981; font-weight:600;">✓ Connected to Cloudflare Pages Functions</span>
      <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.35rem;">Edge functions active at /api/*. Full serverless runtime connected.</p>
    `;
  } else {
    statusEl.innerHTML = `
      <span style="color:#f59e0b; font-weight:600;">⚡ Running in Local Fallback & Testing Mode</span>
      <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.35rem;">
        Functions ready in <code>/functions/api/</code>. Once uploaded to GitHub and linked with Cloudflare Pages, your live site will instantly switch to serverless edge processing.
      </p>
    `;
  }
}

// Export Database JSON
window.exportDatabaseBackup = function() {
  const fullBackup = {
    institute: "Curiomas Research & Innovation Institute",
    exportedAt: new Date().toISOString(),
    posts: cachedPosts,
    interns: cachedInternsData,
    datasets: cachedDatasets
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
  const a = document.createElement('a');
  a.setAttribute("href", dataStr);
  a.setAttribute("download", `crii_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.showToast('Database exported as JSON backup', 'success');
};

// Reset to Initial Seed Data
window.resetToDefaultSeed = function() {
  if (confirm('Reset all publications, interns, and datasets to original institute seed data?')) {
    localStorage.removeItem(CRII_CONFIG.STORAGE_KEYS.POSTS);
    localStorage.removeItem(CRII_CONFIG.STORAGE_KEYS.INTERNS);
    localStorage.removeItem(CRII_CONFIG.STORAGE_KEYS.DATASETS);
    window.location.reload();
  }
};
