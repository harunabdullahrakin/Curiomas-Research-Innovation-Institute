/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Portal Management Studio & Control Center
 * 
 * Features:
 * - Blogger.com Style Modular Block Editor (Write, Details, Preview)
 * - 13 Block Types: Text, Heading, Subheading, Image, Code, Quote, List, Callout, Table, Timeline, Music, Divider, Video
 * - Publications Directory with Search, Filter & Updated-By Attribution
 * - Interns & Core Leadership Team Roster CRUD Management
 * - Configurable Hero Section Background Video, Blur Intensity Slider & Live Preview
 * - Admissions Queue Review Modal
 * - Autz.org Whitelist Access Control
 */

let currentTab = 'overview';
let cachedPosts = [];
let cachedInternsData = { activeInterns: [], applications: [] };
let cachedDatasets = [];

// Blogger Editor State
let currentEditingPostId = null;
let currentPostBlocks = [];
let currentEditorSubtab = 'write';
let isCurrentPostPublished = true;

document.addEventListener('DOMContentLoaded', async () => {
  const user = window.CRII_API.getCurrentUser();
  const authSection = document.getElementById('portalAuthSection');
  const dashboardSection = document.getElementById('portalDashboardSection');

  if (!user) {
    if (authSection) {
      authSection.style.display = 'grid';
      loadRandomScientificBackground();
    }
    if (dashboardSection) dashboardSection.style.display = 'none';
    return;
  }

  if (authSection) authSection.style.display = 'none';
  if (dashboardSection) dashboardSection.style.display = 'flex';

  // Render User profile
  const userNameEl = document.getElementById('portalUserName');
  const userEmailEl = document.getElementById('portalUserEmail');
  const userRoleEl = document.getElementById('portalUserRole');
  const userAvatarEl = document.getElementById('portalUserAvatar');
  if (userNameEl) userNameEl.innerText = user.name || "Researcher";
  if (userEmailEl) userEmailEl.innerText = user.email || "";
  if (userRoleEl) userRoleEl.innerText = user.role || "Member";
  if (userAvatarEl) {
    const initial = (user.name || user.email || "R").trim().charAt(0).toUpperCase();
    userAvatarEl.innerText = initial;
  }

  initSidebarNavigation();
  initSidebarToggle();
  initBloggerEditor();
  initRosterManagement();
  initHeroAppearanceSettings();
  initDatasetForm();
  initApplicationModal();
  initAccessControl();
  initInstituteSettings();
  initEmailComposer();

  await refreshDashboardData();
});

// -----------------------------------------------------------------------------
// NAVIGATION & DASHBOARD DATA
// -----------------------------------------------------------------------------
function initSidebarToggle() {
  const sidebar = document.getElementById('portalSidebar');
  const toggleBtn = document.getElementById('portalSidebarToggleBtn');
  const dashboardSection = document.getElementById('portalDashboardSection');
  const mobileMenuBtn = document.getElementById('portalMobileMenuBtn');
  const backdrop = document.getElementById('portalSidebarBackdrop');

  if (!sidebar) return;

  // Restore saved collapsed state
  const isCollapsed = localStorage.getItem('crii_sidebar_collapsed') === 'true';
  if (isCollapsed && window.innerWidth > 992) {
    sidebar.classList.add('collapsed');
    if (dashboardSection) dashboardSection.classList.add('sidebar-collapsed');
  }

  // Toggle button handler
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willCollapse = !sidebar.classList.contains('collapsed');
      sidebar.classList.toggle('collapsed', willCollapse);
      if (dashboardSection) {
        dashboardSection.classList.toggle('sidebar-collapsed', willCollapse);
      }
      localStorage.setItem('crii_sidebar_collapsed', willCollapse ? 'true' : 'false');
    });
  }

  // Mobile menu button handler
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.add('mobile-open');
      if (backdrop) backdrop.classList.add('active');
    });
  }

  // Mobile backdrop click handler
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      backdrop.classList.remove('active');
    });
  }

  // Close mobile sidebar when nav button clicked
  document.querySelectorAll('.portal-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        sidebar.classList.remove('mobile-open');
        if (backdrop) backdrop.classList.remove('active');
      }
    });
  });

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement && document.activeElement.isContentEditable)) {
        return;
      }
      e.preventDefault();
      if (toggleBtn) toggleBtn.click();
    }
  });

  // Quick theme toggle buttons in user card & mobile topbar
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('crii_theme_mode', nextTheme);
    });
  });
}
// -----------------------------------------------------------------------------
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

  // Restore tab from URL parameter on load/reload
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') || urlParams.get('page');
  if (initialTab && document.getElementById(`tab-${initialTab}`)) {
    currentTab = initialTab;
  }
  showTab(currentTab);
}

window.showTab = function(tabName) {
  document.querySelectorAll('.portal-tab-content').forEach(el => el.style.display = 'none');
  const target = document.getElementById(`tab-${tabName}`);
  if (target) target.style.display = 'block';

  document.querySelectorAll('.portal-nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabName);
  });

  currentTab = tabName;
  if (tabName === 'divisions') renderDivisionsTab();
  if (tabName === 'cohorts') renderCohortsTab();
  try {
    const url = new URL(window.location);
    url.searchParams.set('tab', tabName);
    window.history.replaceState({}, '', url);
  } catch (e) {}
};

async function refreshDashboardData() {
  const stats = await window.CRII_API.getStats();
  cachedPosts = await window.CRII_API.getPosts({ includeDrafts: true });
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

  renderPostsDirectory();
  renderRosterGrid();
  renderApplicationsTable();
  renderDatasetsTable();
  await renderDivisionsTab();
  renderDivisionsTab();
  renderAllowedUsersTable();
}

// -----------------------------------------------------------------------------
// 1. BLOGGER.COM STYLE MODULAR BLOCK EDITOR & PUBLICATIONS
// -----------------------------------------------------------------------------
function initBloggerEditor() {
  const openNewBtn = document.getElementById('openNewPostEditorBtn');
  if (openNewBtn) {
    openNewBtn.addEventListener('click', () => {
      openBloggerEditor(null);
    });
  }

  const backBtn = document.getElementById('bloggerBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      closeBloggerEditor();
    });
  }

  const saveBtn = document.getElementById('bloggerSaveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      await saveCurrentPost();
    });
  }

  const statusBtn = document.getElementById('bloggerStatusBtn');
  if (statusBtn) {
    statusBtn.addEventListener('click', () => {
      isCurrentPostPublished = !isCurrentPostPublished;
      updateBloggerStatusUI();
    });
  }

  // Subtabs (Write, Details, Preview)
  const tabBtns = document.querySelectorAll('.blogger-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      switchBloggerSubtab(btn.dataset.subtab);
    });
  });

  // Add block trigger
  const addBlockBtn = document.getElementById('bloggerOpenAddBlockBtn');
  if (addBlockBtn) {
    addBlockBtn.addEventListener('click', () => {
      openAddBlockModal();
    });
  }

  // Title to slug automatic generator
  const titleInput = document.getElementById('bloggerTitleInput');
  const slugInput = document.getElementById('bloggerSlugInput');
  if (titleInput && slugInput) {
    titleInput.addEventListener('input', () => {
      if (!currentEditingPostId || !slugInput.dataset.custom) {
        slugInput.value = titleInput.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
    });
    slugInput.addEventListener('input', () => {
      slugInput.dataset.custom = 'true';
    });
  }

  // Cover image input preview listener
  const coverInput = document.getElementById('bloggerCoverInput');
  if (coverInput) {
    coverInput.addEventListener('input', () => {
      updateCoverPreview(coverInput.value);
    });
  }

  // Search posts
  const searchInput = document.getElementById('searchPostsInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderPostsDirectory();
    });
  }
}

function updateBloggerStatusUI() {
  const statusBtn = document.getElementById('bloggerStatusBtn');
  if (!statusBtn) return;
  if (isCurrentPostPublished) {
    statusBtn.className = 'status-chip published';
    statusBtn.innerText = 'Published';
  } else {
    statusBtn.className = 'status-chip draft';
    statusBtn.innerText = 'Draft';
  }
}

function switchBloggerSubtab(subtab) {
  currentEditorSubtab = subtab;
  document.getElementById('bloggerPaneWrite').style.display = subtab === 'write' ? 'block' : 'none';
  document.getElementById('bloggerPaneDetails').style.display = subtab === 'details' ? 'block' : 'none';
  document.getElementById('bloggerPanePreview').style.display = subtab === 'preview' ? 'block' : 'none';

  if (subtab === 'preview') {
    renderBloggerLiveReaderPreview();
  }
}

function openBloggerEditor(postId) {
  currentEditingPostId = postId;
  const dirView = document.getElementById('postsDirectoryView');
  const editView = document.getElementById('postsEditorView');
  if (dirView) dirView.style.display = 'none';
  if (editView) editView.style.display = 'block';

  let post = null;
  if (postId) {
    post = cachedPosts.find(p => p.id === postId);
  }

  if (post) {
    document.getElementById('bloggerTitleInput').value = post.title || "";
    isCurrentPostPublished = post.published !== false;
    document.getElementById('bloggerCoverInput').value = post.coverImage || "";
    document.getElementById('bloggerSlugInput').value = post.slug || "";
    document.getElementById('bloggerCategoryInput').value = post.category || "Space & Astrophysics";
    const featEl = document.getElementById('bloggerFeaturedInput');
    if (featEl) featEl.checked = Boolean(post.featured);
    document.getElementById('bloggerAuthorsInput').value = (post.authors || []).join(', ');
    document.getElementById('bloggerDoiInput').value = post.doi || "";
    document.getElementById('bloggerSummaryInput').value = post.summary || "";
    document.getElementById('bloggerAbstractInput').value = post.abstract || "";
    document.getElementById('bloggerTagsInput').value = (post.tags || []).join(', ');
    updateCoverPreview(post.coverImage || "");

    // Load blocks
    if (Array.isArray(post.blocks) && post.blocks.length > 0) {
      currentPostBlocks = JSON.parse(JSON.stringify(post.blocks));
    } else {
      // Convert legacy content string to initial blocks
      currentPostBlocks = convertContentToInitialBlocks(post.content || "");
    }
  } else {
    // Brand new post
    document.getElementById('bloggerTitleInput').value = "";
    isCurrentPostPublished = true;
    document.getElementById('bloggerCoverInput').value = "";
    document.getElementById('bloggerSlugInput').value = "";
    document.getElementById('bloggerCategoryInput').value = "Space & Astrophysics";
    const featEl = document.getElementById('bloggerFeaturedInput');
    if (featEl) featEl.checked = false;
    const user = window.CRII_API.getCurrentUser();
    document.getElementById('bloggerAuthorsInput').value = user ? (user.name || user.email || "CRII Fellow") : "CRII Fellow";
    document.getElementById('bloggerDoiInput').value = `10.5281/crii.2026.${Math.floor(1000 + Math.random() * 9000)}`;
    document.getElementById('bloggerSummaryInput').value = "";
    document.getElementById('bloggerAbstractInput').value = "";
    document.getElementById('bloggerTagsInput').value = "Research";
    updateCoverPreview("");

    currentPostBlocks = [
      { id: `b-${Date.now()}-1`, type: 'heading', content: '1. Introduction & Overview' },
      { id: `b-${Date.now()}-2`, type: 'text', content: 'Describe research objectives, experimental setups, and discovery outcomes here.' }
    ];
  }

  updateBloggerStatusUI();
  renderBlockStack();
  if (window.CRII_WORD) window.CRII_WORD.load(post, () => currentPostBlocks);
  switchBloggerSubtab('write');
}

async function closeBloggerEditor() {
  const dirView = document.getElementById('postsDirectoryView');
  const editView = document.getElementById('postsEditorView');
  if (dirView) dirView.style.display = 'block';
  if (editView) editView.style.display = 'none';
  currentEditingPostId = null;
  await refreshDashboardData();
}

function updateCoverPreview(url) {
  const box = document.getElementById('bloggerCoverPreviewBox');
  if (!box) return;
  if (url) {
    box.innerHTML = `<img src="${url}" style="width:100%; height:100%; object-fit:cover;" onerror="this.parentElement.innerHTML='<span style=\\'color:#ef4444; font-size:0.8rem;\\'>Failed to load cover image</span>'">`;
  } else {
    box.innerHTML = `<span style="color:var(--text-muted); font-size:0.82rem;">Cover preview will appear here</span>`;
  }
}

window.setBloggerCoverPreset = function(url) {
  const input = document.getElementById('bloggerCoverInput');
  if (input) {
    input.value = url;
    updateCoverPreview(url);
  }
};

window.handleCoverFileUpload = async function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const statusEl = document.getElementById('bloggerCoverUploadStatus');
  if (statusEl) {
    statusEl.style.display = 'block';
    statusEl.style.color = 'var(--accent)';
    statusEl.innerHTML = `⏳ Uploading "${file.name}" to Cloudflare R2...`;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.details || data.error || 'Upload failed');
    }

    const input = document.getElementById('bloggerCoverInput');
    if (input) {
      input.value = data.url;
      updateCoverPreview(data.url);
    }

    if (statusEl) {
      statusEl.style.color = '#10b981';
      statusEl.innerHTML = `✓ Uploaded to R2 successfully: <code>${data.url}</code>`;
    }
  } catch (err) {
    console.error('R2 Upload error:', err);
    if (statusEl) {
      statusEl.style.color = '#ef4444';
      statusEl.innerHTML = `⚠️ Upload failed: ${err.message}. (You can still paste any external image URL).`;
    }
  }
};

window.handleBlockImageUpload = async function(event, idx) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const statusSpan = document.getElementById(`blockUploadStatus_${idx}`);
  if (statusSpan) {
    statusSpan.style.display = 'inline-block';
    statusSpan.style.color = 'var(--accent)';
    statusSpan.innerHTML = `⏳ Uploading...`;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.details || data.error || 'Upload failed');
    }

    updateBlockContent(idx, 'url', data.url);
    renderBlockStack();
  } catch (err) {
    console.error('R2 Block Upload error:', err);
    alert('Upload failed: ' + err.message + '\n\nMake sure Cloudflare R2 is bound as "STORAGE" in Pages Settings -> Functions.');
    if (statusSpan) statusSpan.style.display = 'none';
  }
};

// Convert string markdown to block array
function convertContentToInitialBlocks(content) {
  if (!content) return [{ id: `b-${Date.now()}`, type: 'text', content: '' }];
  const lines = content.split('\n\n');
  const blocks = [];

  lines.forEach((chunk, i) => {
    const trimmed = chunk.trim();
    if (!trimmed) return;
    if (trimmed.startsWith('### ')) {
      blocks.push({ id: `b-${Date.now()}-${i}`, type: 'subheading', content: trimmed.replace('### ', '') });
    } else if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      blocks.push({ id: `b-${Date.now()}-${i}`, type: 'heading', content: trimmed.replace(/^#+ /, '') });
    } else if (trimmed.startsWith('> ')) {
      blocks.push({ id: `b-${Date.now()}-${i}`, type: 'quote', content: trimmed.replace(/^> /, ''), author: 'CRII Report' });
    } else if (trimmed.startsWith('```')) {
      const code = trimmed.replace(/```[a-z]*\n?/g, '').trim();
      blocks.push({ id: `b-${Date.now()}-${i}`, type: 'code', content: code, language: 'python' });
    } else {
      blocks.push({ id: `b-${Date.now()}-${i}`, type: 'text', content: trimmed });
    }
  });

  return blocks.length > 0 ? blocks : [{ id: `b-${Date.now()}`, type: 'text', content: '' }];
}

// Global getters/setters for Word editor bridge
window.getEditorBlocks = function() {
  return currentPostBlocks || [];
};
window.setEditorBlocks = function(newBlocks) {
  currentPostBlocks = newBlocks || [];
  renderBlockStack();
};

// Render Block Cards
function renderBlockStack() {
  const stack = document.getElementById('bloggerBlockStack');
  if (!stack) return;

  if (currentPostBlocks.length === 0) {
    stack.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
        <p style="margin-bottom: 0.5rem; font-weight: 600;">No blocks in this publication yet.</p>
        <p style="font-size: 0.85rem;">Click "Add a Block" below to start composing.</p>
      </div>
    `;
    updateEstimatedReadingTime();
    return;
  }

  stack.innerHTML = currentPostBlocks.map((block, idx) => {
    return `
      <div class="blogger-block-card" data-block-id="${block.id}">
        <div class="blogger-block-header">
          <div class="blogger-block-type-badge">
            ${getBlockTypeIcon(block.type)}
            <span>${block.type}</span>
          </div>
          <div class="blogger-block-actions">
            <button type="button" class="block-tool-btn" title="Move Up" onclick="moveBlock(${idx}, -1)" ${idx === 0 ? 'disabled style="opacity:0.3;"' : ''}>
              ▲
            </button>
            <button type="button" class="block-tool-btn" title="Move Down" onclick="moveBlock(${idx}, 1)" ${idx === currentPostBlocks.length - 1 ? 'disabled style="opacity:0.3;"' : ''}>
              ▼
            </button>
            <button type="button" class="block-tool-btn delete" title="Delete Block" onclick="deleteBlock(${idx})">
              ✕
            </button>
          </div>
        </div>
        <div class="blogger-block-body">
          ${renderBlockEditorFields(block, idx)}
        </div>
      </div>
    `;
  }).join('');

  updateEstimatedReadingTime();
}

function getBlockTypeIcon(type) {
  const icons = {
    text: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/></svg>',
    heading: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 12h16M4 4v16M20 4v16"/></svg>',
    subheading: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 12h8M6 6v12M14 6v12"/></svg>',
    image: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/></svg>',
    code: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    quote: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/></svg>',
    list: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/></svg>',
    callout: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>',
    table: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/></svg>',
    timeline: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    music: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    divider: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="12" x2="21" y2="12"/></svg>',
    video: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="14" x="3" y="5" rx="2"/><polygon points="10 9 15 12 10 15 10 9"/></svg>'
  };
  return icons[type] || '';
}

function renderBlockEditorFields(block, idx) {
  switch (block.type) {
    case 'text':
      return `
        <textarea class="form-textarea" style="min-height: 85px; font-size: 0.95rem; line-height: 1.6;" placeholder="Type regular paragraph text..." oninput="updateBlockContent(${idx}, 'content', this.value)">${escapeHtml(block.content || '')}</textarea>
      `;

    case 'heading':
      return `
        <input type="text" class="form-input" style="font-size: 1.15rem; font-weight: 700;" placeholder="Section Heading..." value="${escapeHtml(block.content || '')}" oninput="updateBlockContent(${idx}, 'content', this.value)">
      `;

    case 'subheading':
      return `
        <input type="text" class="form-input" style="font-size: 1rem; font-weight: 600;" placeholder="Subsection Subheading..." value="${escapeHtml(block.content || '')}" oninput="updateBlockContent(${idx}, 'content', this.value)">
      `;

    case 'image':
      return `
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <input type="url" class="form-input" style="flex:1;" placeholder="Image URL (https://... or upload from device)" value="${escapeHtml(block.url || '')}" oninput="updateBlockContent(${idx}, 'url', this.value)">
            <label class="btn btn-secondary btn-sm" style="cursor:pointer; display:inline-flex; align-items:center; gap:0.35rem; margin-bottom:0; font-size:0.75rem; padding:0.4rem 0.65rem;" title="Upload image to Cloudflare R2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span>Upload</span>
              <input type="file" accept="image/*" style="display:none;" onchange="handleBlockImageUpload(event, ${idx})">
            </label>
          </div>
          <span id="blockUploadStatus_${idx}" style="font-size:0.75rem; display:none;"></span>
          <input type="text" class="form-input" placeholder="Optional caption or credit..." value="${escapeHtml(block.caption || '')}" oninput="updateBlockContent(${idx}, 'caption', this.value)">
          ${block.url ? `<div style="max-height:160px; overflow:hidden; border-radius:8px; border:1px solid var(--border-color);"><img src="${block.url}" style="width:100%; height:160px; object-fit:cover;"></div>` : ''}
        </div>
      `;

    case 'code':
      return `
        <div style="display:flex; flex-direction:column; gap:0.4rem;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <select class="form-select" style="max-width:160px; padding:0.25rem 0.5rem; font-size:0.8rem;" onchange="updateBlockContent(${idx}, 'language', this.value)">
              <option value="python" ${block.language === 'python' ? 'selected' : ''}>Python</option>
              <option value="javascript" ${block.language === 'javascript' ? 'selected' : ''}>JavaScript</option>
              <option value="cpp" ${block.language === 'cpp' ? 'selected' : ''}>C++</option>
              <option value="sql" ${block.language === 'sql' ? 'selected' : ''}>SQL</option>
              <option value="bash" ${block.language === 'bash' ? 'selected' : ''}>Bash</option>
            </select>
          </div>
          <textarea class="form-textarea" style="font-family:monospace; min-height:100px; font-size:0.85rem;" placeholder="Code snippet..." oninput="updateBlockContent(${idx}, 'content', this.value)">${escapeHtml(block.content || '')}</textarea>
        </div>
      `;

    case 'quote':
      return `
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          <textarea class="form-textarea" style="font-style:italic; min-height:70px;" placeholder="Quote text..." oninput="updateBlockContent(${idx}, 'content', this.value)">${escapeHtml(block.content || '')}</textarea>
          <input type="text" class="form-input" placeholder="Author / Citation..." value="${escapeHtml(block.author || '')}" oninput="updateBlockContent(${idx}, 'author', this.value)">
        </div>
      `;

    case 'list':
      return `
        <textarea class="form-textarea" style="min-height:80px;" placeholder="Enter items, one per line..." oninput="updateBlockContent(${idx}, 'content', this.value)">${escapeHtml(block.content || '')}</textarea>
      `;

    case 'callout':
      return `
        <div style="display:flex; flex-direction:column; gap:0.4rem;">
          <select class="form-select" style="max-width:160px; font-size:0.8rem;" onchange="updateBlockContent(${idx}, 'style', this.value)">
            <option value="note" ${block.style === 'note' ? 'selected' : ''}>Note / Info</option>
            <option value="important" ${block.style === 'important' ? 'selected' : ''}>Important</option>
            <option value="caution" ${block.style === 'caution' ? 'selected' : ''}>Caution / Warning</option>
          </select>
          <textarea class="form-textarea" style="min-height:70px;" placeholder="Callout message..." oninput="updateBlockContent(${idx}, 'content', this.value)">${escapeHtml(block.content || '')}</textarea>
        </div>
      `;

    case 'table':
      return `
        <div style="display:flex; flex-direction:column; gap:0.4rem;">
          <textarea class="form-textarea" style="font-family:monospace; min-height:80px; font-size:0.82rem;" placeholder="Header 1 | Header 2&#10;Row 1 Col 1 | Row 1 Col 2" oninput="updateBlockContent(${idx}, 'content', this.value)">${escapeHtml(block.content || 'Metric | Value\nSampling | 120 nm\nSNR | 24.5 dB')}</textarea>
        </div>
      `;

    case 'timeline':
      return `
        <div style="display:flex; gap:0.5rem;">
          <input type="text" class="form-input" style="max-width:140px;" placeholder="Date / Step" value="${escapeHtml(block.date || 'Phase 1')}" oninput="updateBlockContent(${idx}, 'date', this.value)">
          <input type="text" class="form-input" placeholder="Milestone description..." value="${escapeHtml(block.content || '')}" oninput="updateBlockContent(${idx}, 'content', this.value)">
        </div>
      `;

    case 'music':
      return `
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          <input type="text" class="form-input" placeholder="Track / Audio link (Spotify or YT URL)" value="${escapeHtml(block.url || '')}" oninput="updateBlockContent(${idx}, 'url', this.value)">
          <input type="text" class="form-input" placeholder="Opinion or research soundscape notes..." value="${escapeHtml(block.content || '')}" oninput="updateBlockContent(${idx}, 'content', this.value)">
        </div>
      `;

    case 'divider':
      return `<hr style="border:none; border-top:1px solid var(--border-color); margin:0.5rem 0;">`;

    case 'video':
      return `
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          <input type="url" class="form-input" placeholder="YouTube or MP4 Video URL (e.g. https://www.youtube.com/watch?v=...)" value="${escapeHtml(block.url || '')}" oninput="updateBlockContent(${idx}, 'url', this.value)">
        </div>
      `;

    default:
      return `<textarea class="form-textarea" oninput="updateBlockContent(${idx}, 'content', this.value)">${escapeHtml(block.content || '')}</textarea>`;
  }
}

window.updateBlockContent = function(index, key, val) {
  if (currentPostBlocks[index]) {
    currentPostBlocks[index][key] = val;
    updateEstimatedReadingTime();
  }
};

window.moveBlock = function(index, direction) {
  const target = index + direction;
  if (target < 0 || target >= currentPostBlocks.length) return;
  const temp = currentPostBlocks[index];
  currentPostBlocks[index] = currentPostBlocks[target];
  currentPostBlocks[target] = temp;
  renderBlockStack();
};

window.deleteBlock = function(index) {
  currentPostBlocks.splice(index, 1);
  renderBlockStack();
};

// Add block modal
window.openAddBlockModal = function() {
  const modal = document.getElementById('addBlockModal');
  if (modal) modal.classList.add('active');
};

window.closeAddBlockModal = function() {
  const modal = document.getElementById('addBlockModal');
  if (modal) modal.classList.remove('active');
};

window.insertBlock = function(type) {
  const newBlock = {
    id: `b-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: type,
    content: ''
  };

  if (type === 'image') newBlock.url = '';
  if (type === 'code') newBlock.language = 'python';
  if (type === 'quote') newBlock.author = '';
  if (type === 'callout') newBlock.style = 'note';
  if (type === 'timeline') newBlock.date = 'Phase 1';
  if (type === 'video') newBlock.url = '';
  if (type === 'music') newBlock.url = '';

  currentPostBlocks.push(newBlock);
  closeAddBlockModal();
  renderBlockStack();
};

function updateEstimatedReadingTime() {
  let wordCount = 0;
  currentPostBlocks.forEach(b => {
    if (b.content) wordCount += b.content.split(/\s+/).length;
  });
  const minutes = Math.max(1, Math.ceil(wordCount / 180));
  const badge = document.getElementById('bloggerReadTimeBadge');
  if (badge) badge.innerText = `${minutes} min read`;
}

// Convert blocks to Markdown/HTML for public reader
function compileBlocksToContent(blocks) {
  return blocks.map(b => {
    switch (b.type) {
      case 'heading':
        return `## ${b.content || ''}`;
      case 'subheading':
        return `### ${b.content || ''}`;
      case 'image':
        return `![${b.caption || 'Research Image'}](${b.url || ''})\n*${b.caption || ''}*`;
      case 'code':
        return `\`\`\`${b.language || 'text'}\n${b.content || ''}\n\`\`\``;
      case 'quote':
        return `> ${b.content || ''}\n> — *${b.author || 'CRII'}*`;
      case 'callout':
        return `> [!${(b.style || 'NOTE').toUpperCase()}]\n> ${b.content || ''}`;
      case 'list':
        return (b.content || '').split('\n').map(item => `- ${item}`).join('\n');
      case 'divider':
        return `---`;
      case 'video':
        return `<div class="video-embed"><iframe src="${formatVideoEmbedUrl(b.url || '')}" frameborder="0" allowfullscreen></iframe></div>`;
      case 'timeline':
        return `**${b.date || ''}**: ${b.content || ''}`;
      case 'music':
        return `🎵 **Soundtrack**: ${b.url || ''} — *${b.content || ''}*`;
      case 'table':
        return `<pre>${b.content || ''}</pre>`;
      case 'text':
      default:
        return b.content || '';
    }
  }).join('\n\n');
}

function formatVideoEmbedUrl(url) {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=')) {
    return url.replace('watch?v=', 'embed/');
  }
  if (url.includes('youtu.be/')) {
    return url.replace('youtu.be/', 'www.youtube.com/embed/');
  }
  return url;
}

// Render Live Preview Tab
function renderBloggerLiveReaderPreview() {
  const container = document.getElementById('bloggerReaderPreviewContainer');
  if (!container) return;

  const title = document.getElementById('bloggerTitleInput').value.trim() || "Untitled Article";
  const category = document.getElementById('bloggerCategoryInput').value;
  const coverImage = document.getElementById('bloggerCoverInput').value.trim();
  const authors = document.getElementById('bloggerAuthorsInput').value.trim() || "CRII Fellow";
  const abstract = document.getElementById('bloggerAbstractInput').value.trim();
  const summary = document.getElementById('bloggerSummaryInput').value.trim();
  const tagsStr = document.getElementById('bloggerTagsInput').value.trim();
  const doi = document.getElementById('bloggerDoiInput').value.trim() || "10.5281/crii.2026.xxxx";
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : [];
  const user = window.CRII_API.getCurrentUser();
  const editorName = user ? (user.name || user.email) : "Administrator";

  let blocksHtml = '';
  const __docPrev = !!(window.CRII_WORD && window.CRII_WORD.getMode() === 'doc');
  (__docPrev ? [] : currentPostBlocks).forEach(b => {
    switch (b.type) {
      case 'heading':
        blocksHtml += `<h2 style="font-size:1.6rem; margin:1.75rem 0 0.75rem; color:var(--text-primary);">${escapeHtml(b.content || '')}</h2>`;
        break;
      case 'subheading':
        blocksHtml += `<h3 style="font-size:1.3rem; margin:1.5rem 0 0.5rem; color:var(--text-primary);">${escapeHtml(b.content || '')}</h3>`;
        break;
      case 'text':
        blocksHtml += `<p style="font-size:1.02rem; line-height:1.75; color:var(--text-secondary); margin-bottom:1.25rem;">${escapeHtml(b.content || '')}</p>`;
        break;
      case 'image':
        blocksHtml += `
          <div style="margin:1.75rem 0; text-align:center;">
            <img src="${b.url || ''}" style="max-width:100%; border-radius:12px; box-shadow:var(--shadow-md);">
            ${b.caption ? `<div style="font-size:0.82rem; color:var(--text-muted); margin-top:0.4rem; font-style:italic;">${escapeHtml(b.caption)}</div>` : ''}
          </div>
        `;
        break;
      case 'code':
        blocksHtml += `
          <div style="background:#0f172a; color:#f8fafc; padding:1.25rem; border-radius:10px; font-family:monospace; font-size:0.85rem; overflow-x:auto; margin:1.5rem 0;">
            <pre><code>${escapeHtml(b.content || '')}</code></pre>
          </div>
        `;
        break;
      case 'quote':
        blocksHtml += `
          <blockquote style="border-left:4px solid var(--accent-primary); padding-left:1.25rem; font-style:italic; margin:1.5rem 0; color:var(--text-primary);">
            <p style="font-size:1.05rem; margin-bottom:0.4rem;">${escapeHtml(b.content || '')}</p>
            ${b.author ? `<cite style="font-size:0.85rem; color:var(--text-muted); font-style:normal;">— ${escapeHtml(b.author)}</cite>` : ''}
          </blockquote>
        `;
        break;
      case 'callout':
        blocksHtml += `
          <div style="background:rgba(37,99,235,0.08); border-left:4px solid var(--accent-primary); padding:1rem 1.25rem; border-radius:0 10px 10px 0; margin:1.5rem 0;">
            <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--accent-primary); margin-bottom:0.3rem;">${(b.style || 'NOTE').toUpperCase()}</div>
            <div style="font-size:0.95rem; color:var(--text-primary);">${escapeHtml(b.content || '')}</div>
          </div>
        `;
        break;
      case 'divider':
        blocksHtml += `<hr style="border:none; border-top:1px solid var(--border-color); margin:2rem 0;">`;
        break;
      default:
        blocksHtml += `<p style="font-size:1rem; line-height:1.7; margin-bottom:1rem;">${escapeHtml(b.content || '')}</p>`;
    }
  });

  container.innerHTML = `
    <div style="margin-bottom:1.5rem; font-size:0.84rem; color:var(--text-muted);">
      <span style="color:var(--accent-primary); font-weight:600;">${category}</span> • <span>${new Date().toISOString().split('T')[0]}</span> • <span>DOI: ${doi}</span>
    </div>

    <h1 style="font-size:2.2rem; line-height:1.3; margin-bottom:0.75rem; color:var(--text-primary);">${escapeHtml(title)}</h1>
    <div style="font-size:0.95rem; color:var(--text-secondary); margin-bottom:1.25rem;">
      <strong>Authors:</strong> <span style="color:var(--accent-primary);">${escapeHtml(authors)}</span>
    </div>

    <!-- Updated By Attribution Stamp -->
    <div style="display:inline-flex; align-items:center; gap:0.4rem; padding:0.3rem 0.75rem; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); border-radius:9999px; font-size:0.76rem; color:var(--accent-emerald); font-weight:600; margin-bottom:1.5rem;">
      <span>●</span>
      <span>Updated by ${escapeHtml(editorName)} on ${new Date().toLocaleDateString()}</span>
    </div>

    ${coverImage ? `
      <div style="border-radius:14px; overflow:hidden; margin-bottom:2rem; max-height:360px; box-shadow:var(--shadow-md);">
        <img src="${coverImage}" style="width:100%; height:100%; object-fit:cover;">
      </div>
    ` : ''}

    ${abstract ? `
      <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:12px; padding:1.5rem; margin-bottom:2rem;">
        <div style="font-size:0.78rem; text-transform:uppercase; color:var(--accent-primary); font-weight:700; margin-bottom:0.5rem; letter-spacing:0.06em;">Academic Abstract</div>
        <p style="font-style:italic; font-size:0.98rem; line-height:1.65; color:var(--text-secondary);">${escapeHtml(abstract)}</p>
      </div>
    ` : ''}

    <div class="preview-content-body">
      ${__docPrev ? '<div class="crii-doc">' + window.CRII_WORD.getCleanHtml() + '</div>' : blocksHtml}
    </div>

    ${tags.length > 0 ? `
      <div style="margin-top:2.5rem; padding-top:1.5rem; border-top:1px solid var(--border-color); display:flex; gap:0.4rem; flex-wrap:wrap;">
        ${tags.map(t => `<span class="tag-item">#${escapeHtml(t)}</span>`).join(' ')}
      </div>
    ` : ''}
  `;
  if (window.CriiDoc) window.CriiDoc.renderMath(container);
}

// Save Post
async function saveCurrentPost() {
  const title = (document.getElementById('bloggerTitleInput')?.value || '').trim();
  if (!title) {
    window.showToast('Please enter an article title', 'error');
    document.getElementById('bloggerTitleInput')?.focus();
    return;
  }

  const category = document.getElementById('bloggerCategoryInput')?.value || "Space & Astrophysics";
  const coverImage = (document.getElementById('bloggerCoverInput')?.value || '').trim();
  let slug = (document.getElementById('bloggerSlugInput')?.value || '').trim();
  if (!slug) {
    slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  if (!slug) {
    slug = `article-${Date.now().toString(36)}`;
  }

  const authorsStr = (document.getElementById('bloggerAuthorsInput')?.value || '').trim();
  const doi = (document.getElementById('bloggerDoiInput')?.value || '').trim() || `10.5281/crii.2026.${Math.floor(1000 + Math.random() * 9000)}`;
  const __docMode = !!(window.CRII_WORD && window.CRII_WORD.getMode() === 'doc');
  const summary = (document.getElementById('bloggerSummaryInput')?.value || '').trim() || (__docMode ? window.CRII_WORD.getExcerpt(220) : '') || title;
  const abstract = (document.getElementById('bloggerAbstractInput')?.value || '').trim() || summary;
  const tagsStr = (document.getElementById('bloggerTagsInput')?.value || '').trim();
  const user = window.CRII_API.getCurrentUser();
  const editorName = user ? (user.name || user.email || "Administrator") : "Administrator";

  let wordCount = 0;
  let compiledContent;
  if (__docMode) {
    wordCount = window.CRII_WORD.getWordCount();
    compiledContent = window.CriiDoc.MARK + window.CRII_WORD.getCleanHtml();
  } else {
    currentPostBlocks.forEach(b => {
      if (b.content) wordCount += String(b.content).split(/\s+/).length;
    });
    compiledContent = compileBlocksToContent(currentPostBlocks) || summary;
  }
  const readingTime = `${Math.max(1, Math.ceil(wordCount / 180))} min read`;
  const featured = Boolean(document.getElementById('bloggerFeaturedInput')?.checked);
  const existingPost = currentEditingPostId ? cachedPosts.find(p => p.id === currentEditingPostId) : null;

  const postPayload = {
    id: currentEditingPostId || `crii-paper-${Date.now()}`,
    title,
    slug,
    category,
    coverImage,
    featured,
    authors: authorsStr ? authorsStr.split(',').map(a => a.trim()).filter(Boolean) : [editorName],
    readingTime,
    doi,
    summary,
    abstract,
    content: compiledContent,
    blocks: __docMode ? [] : currentPostBlocks,
    tags: tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : ["Research"],
    published: isCurrentPostPublished,
    createdBy: existingPost ? (existingPost.createdBy || existingPost.authors?.[0] || editorName) : editorName,
    createdAt: existingPost ? (existingPost.createdAt || existingPost.date || new Date().toISOString()) : new Date().toISOString(),
    updatedBy: existingPost ? editorName : null,
    updatedAt: existingPost ? new Date().toISOString() : null,
    isEdited: Boolean(existingPost)
  };

  const saveBtn = document.getElementById('bloggerSaveBtn');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerText = 'Saving...';
  }

  try {
    await window.CRII_API.savePost(postPayload);
    if (window.CRII_WORD) window.CRII_WORD.clearDraft();
    window.showToast(`Publication successfully ${isCurrentPostPublished ? 'published' : 'saved as draft'}!`, 'success');
    try {
      await closeBloggerEditor();
    } catch (uiErr) {
      console.warn('Publication saved, background refresh encountered notice:', uiErr);
    }
  } catch (err) {
    console.error('Save publication error:', err);
    window.showToast(`Failed to save publication: ${err.message}`, 'error');
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerText = isCurrentPostPublished ? 'Save & Publish' : 'Save as Draft';
    }
  }
}

// Render Directory Table
function renderPostsDirectory() {
  const tbody = document.getElementById('portalPostsTbody');
  if (!tbody) return;

  const searchVal = (document.getElementById('searchPostsInput')?.value || '').toLowerCase().trim();

  let posts = cachedPosts;
  if (searchVal) {
    posts = posts.filter(p => 
      (p.title || '').toLowerCase().includes(searchVal) ||
      (p.category || '').toLowerCase().includes(searchVal) ||
      (p.summary || '').toLowerCase().includes(searchVal)
    );
  }

  if (posts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:3rem; color:var(--text-muted);">No publications found. Click "+ Create New Publication" to publish.</td></tr>`;
    return;
  }

  tbody.innerHTML = posts.map(post => {
    const isPub = post.published !== false;
    const coverThumb = post.coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=120&q=60';
    const updatedByText = post.updatedBy ? `by ${post.updatedBy}` : 'by Lead Fellow';
    const updatedDate = post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : post.date;

    return `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:0.85rem;">
            <img src="${coverThumb}" style="width:48px; height:48px; border-radius:8px; object-fit:cover; border:1px solid var(--border-color); flex-shrink:0;">
            <div>
              <div style="font-weight:600; color:var(--text-primary); font-size:0.92rem; line-height:1.3;">${escapeHtml(post.title)}</div>
              <div style="font-size:0.74rem; color:var(--text-muted); font-family:monospace; margin-top:0.2rem;">/${post.slug || post.id} • ${post.readingTime || '10 min'}</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-blue">${post.category}</span></td>
        <td>
          <div style="font-size:0.84rem; font-weight:500; color:var(--text-primary);">${updatedDate}</div>
          <div style="font-size:0.74rem; color:var(--text-muted);">${escapeHtml(updatedByText)}</div>
        </td>
        <td>
          <span class="status-chip ${isPub ? 'published' : 'draft'}">
            ${isPub ? 'Published' : 'Draft'}
          </span>
        </td>
        <td style="text-align:right;">
          <div style="display:inline-flex; gap:0.4rem;">
            <button class="btn btn-secondary btn-sm" onclick="openBloggerEditor('${post.id}')" title="Edit publication in studio">
              Edit
            </button>
            <a href="/article?id=${post.id}" target="_blank" class="btn btn-glass btn-sm" title="View public article">
              Preview ↗
            </a>
            <button class="btn btn-sm btn-icon" title="Toggle status" onclick="togglePublishPost('${post.id}')" style="background:rgba(0,0,0,0.04);">
              ${isPub ? 'Hide' : 'Show'}
            </button>
            <button class="btn btn-sm btn-icon" title="Delete" style="background:rgba(239, 68, 68, 0.1); color:#ef4444;" onclick="deletePost('${post.id}')">
              ✕
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.filterPostsList = function(type) {
  ['All', 'Pub', 'Draft'].forEach(t => {
    document.getElementById(`filterPosts${t}`)?.classList.remove('active');
  });
  if (type === 'all') {
    document.getElementById('filterPostsAll')?.classList.add('active');
    cachedPosts = window.CRII_API.getPosts({ includeDrafts: true }).then(posts => {
      cachedPosts = posts;
      renderPostsDirectory();
    });
  } else if (type === 'published') {
    document.getElementById('filterPostsPub')?.classList.add('active');
    window.CRII_API.getPosts({ includeDrafts: true }).then(posts => {
      cachedPosts = posts.filter(p => p.published !== false);
      renderPostsDirectory();
    });
  } else if (type === 'draft') {
    document.getElementById('filterPostsDraft')?.classList.add('active');
    window.CRII_API.getPosts({ includeDrafts: true }).then(posts => {
      cachedPosts = posts.filter(p => p.published === false);
      renderPostsDirectory();
    });
  }
};

window.togglePublishPost = async function(id) {
  await window.CRII_API.togglePostPublish(id);
  window.showToast('Publication visibility updated', 'success');
  await refreshDashboardData();
};

window.deletePost = async function(id) {
  if (confirm('Permanently delete this research publication?')) {
    await window.CRII_API.deletePost(id);
    window.showToast('Publication deleted', 'info');
    await refreshDashboardData();
  }
};

// -----------------------------------------------------------------------------
// 2. INTERNS & CORE TEAM ROSTER MANAGEMENT
// -----------------------------------------------------------------------------
function initRosterManagement() {
  const addBtn = document.getElementById('openAddResearcherBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      openResearcherModal(null);
    });
  }

  const form = document.getElementById('researcherForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('researcherEditId').value;
      const name = document.getElementById('resNameInput').value.trim();
      const email = document.getElementById('resEmailInput').value.trim();
      const avatar = document.getElementById('resAvatarInput').value.trim();
      const role = document.getElementById('resRoleInput').value.trim();
      const division = document.getElementById('resDivisionInput').value;
      const university = document.getElementById('resUniversityInput').value.trim();
      const degree = document.getElementById('resDegreeInput').value.trim();
      const bio = document.getElementById('resBioInput').value.trim();
      const github = document.getElementById('resGithubInput').value.trim();
      const linkedin = document.getElementById('resLinkedinInput').value.trim();
      const isTeamMember = document.getElementById('resIsTeamMember').checked;
      const orderIndex = Number(document.getElementById('resOrderIndex').value) || 10;

      const memberData = {
        id: id || undefined,
        name,
        email,
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        role,
        division,
        university,
        degree,
        bio,
        isTeamMember,
        orderIndex,
        socials: { github, linkedin, email }
      };

      await window.CRII_API.saveIntern(memberData);
      window.showToast(`Researcher profile ${id ? 'updated' : 'added'}!`, 'success');
      closeResearcherModal();
      await refreshDashboardData();
    });
  }

  const searchInput = document.getElementById('searchRosterInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderRosterGrid();
    });
  }
}

function renderRosterGrid() {
  const grid = document.getElementById('rosterCardsGrid');
  if (!grid) return;

  const searchVal = (document.getElementById('searchRosterInput')?.value || '').toLowerCase().trim();
  let members = cachedInternsData.activeInterns || [];

  if (searchVal) {
    members = members.filter(m => 
      (m.name || '').toLowerCase().includes(searchVal) ||
      (m.role || '').toLowerCase().includes(searchVal) ||
      (m.division || '').toLowerCase().includes(searchVal)
    );
  }

  if (members.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:3rem; color:var(--text-muted);">No researchers match your query. Click "+ Add Researcher / Fellow" to add members.</div>`;
    return;
  }

  grid.innerHTML = members.map(m => {
    const isTeam = Boolean(m.isTeamMember);
    const avatarUrl = m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

    return `
      <div class="roster-card">
        <div class="roster-card-header">
          <img src="${avatarUrl}" alt="${escapeHtml(m.name)}" class="roster-avatar-img">
          <div>
            <div style="font-weight:700; color:var(--text-primary); font-size:1.05rem;">${escapeHtml(m.name)}</div>
            <div style="font-size:0.82rem; color:var(--accent-primary); font-weight:600;">${escapeHtml(m.role)}</div>
            ${isTeam ? `<span class="badge-core-team" style="margin-top:0.3rem;">★ Core Leadership</span>` : `<span class="badge badge-blue" style="margin-top:0.3rem;">Fellow</span>`}
          </div>
        </div>

        <div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:0.5rem;">
          <strong>Division:</strong> ${escapeHtml(m.division || 'Research')}
        </div>

        <p style="font-size:0.86rem; color:var(--text-secondary); line-height:1.5; margin-bottom:1rem; flex-grow:1;">
          ${escapeHtml(m.bio || 'Research researcher and student contributor.')}
        </p>

        <div class="roster-actions">
          <button class="btn btn-secondary btn-sm" onclick="openResearcherModal('${m.id}')" style="flex:1;">
            Edit Profile
          </button>
          ${(m.email || (m.socials && m.socials.email)) ? `
          <button class="btn btn-sm btn-icon" style="background:rgba(2,132,199,0.1); color:#0284c7;" onclick="openEmailComposer('${escapeHtml(m.email || m.socials.email)}', '${escapeHtml(m.name)}')" title="Send Email">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </button>` : ''}
          <button class="btn btn-sm btn-icon" style="background:rgba(239, 68, 68, 0.1); color:#ef4444;" onclick="deleteResearcher('${m.id}')" title="Delete">
            ✕
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.filterRosterList = function(type) {
  ['All', 'Team', 'Fellows'].forEach(t => {
    document.getElementById(`filterRoster${t}`)?.classList.remove('active');
  });

  window.CRII_API.getInternsData().then(data => {
    if (type === 'all') {
      document.getElementById('filterRosterAll')?.classList.add('active');
      cachedInternsData.activeInterns = data.activeInterns;
    } else if (type === 'team') {
      document.getElementById('filterRosterTeam')?.classList.add('active');
      cachedInternsData.activeInterns = (data.activeInterns || []).filter(m => m.isTeamMember);
    } else if (type === 'fellows') {
      document.getElementById('filterRosterFellows')?.classList.add('active');
      cachedInternsData.activeInterns = (data.activeInterns || []).filter(m => !m.isTeamMember);
    }
    renderRosterGrid();
  });
};

window.openResearcherModal = function(id) {
  const modal = document.getElementById('researcherModal');
  const title = document.getElementById('researcherModalTitle');
  const editId = document.getElementById('researcherEditId');
  if (!modal) return;

  if (id) {
    const member = (cachedInternsData.activeInterns || []).find(m => m.id === id);
    if (member) {
      if (title) title.innerText = 'Edit Researcher Profile';
      if (editId) editId.value = member.id;
      document.getElementById('resNameInput').value = member.name || '';
      document.getElementById('resEmailInput').value = member.email || '';
      document.getElementById('resAvatarInput').value = member.avatar || '';
      document.getElementById('resRoleInput').value = member.role || '';
      document.getElementById('resDivisionInput').value = member.division || 'Space & Astrophysics';
      document.getElementById('resUniversityInput').value = member.university || '';
      document.getElementById('resDegreeInput').value = member.degree || '';
      document.getElementById('resBioInput').value = member.bio || '';
      document.getElementById('resGithubInput').value = member.socials?.github || '';
      document.getElementById('resLinkedinInput').value = member.socials?.linkedin || '';
      document.getElementById('resIsTeamMember').checked = Boolean(member.isTeamMember);
      document.getElementById('resOrderIndex').value = member.orderIndex || 1;
    }
  } else {
    if (title) title.innerText = 'Add Researcher / Fellow';
    if (editId) editId.value = '';
    document.getElementById('researcherForm').reset();
    document.getElementById('resAvatarInput').value = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
    document.getElementById('resIsTeamMember').checked = false;
    document.getElementById('resOrderIndex').value = 10;
  }

  modal.classList.add('active');
};

window.closeResearcherModal = function() {
  const modal = document.getElementById('researcherModal');
  if (modal) modal.classList.remove('active');
};

window.deleteResearcher = async function(id) {
  if (confirm('Delete this researcher from the institute roster?')) {
    await window.CRII_API.deleteIntern(id);
    window.showToast('Researcher profile removed', 'info');
    await refreshDashboardData();
  }
};

// -----------------------------------------------------------------------------
// 3. CONFIGURABLE HERO VIDEO, MULTI-IMAGE & TYPOGRAPHY SETTINGS
// -----------------------------------------------------------------------------
let activeHeroBackgroundImages = [];

function initHeroAppearanceSettings() {
  const settings = window.CRII_API.getHeroSettings();
  const fontSelect = document.getElementById('settingHeroFontFamily');
  const imageOpacitySlider = document.getElementById('settingHeroImageOpacity');
  const imageOpacityBadge = document.getElementById('heroImageOpacityValueBadge');
  const previewStage = document.getElementById('heroLivePreviewStage');
  const previewOverlay = document.getElementById('heroLivePreviewOverlay');
  const previewTitle = document.getElementById('heroLivePreviewTitle');

  const videoInput = document.getElementById('settingHeroVideoUrl');
  const blurSlider = document.getElementById('settingHeroBlur');
  const overlaySlider = document.getElementById('settingHeroOverlay');
  const blurBadge = document.getElementById('heroBlurValueBadge');
  const overlayBadge = document.getElementById('heroOverlayValueBadge');

  // Populate font
  if (fontSelect && settings.fontFamily) {
    fontSelect.value = settings.fontFamily;
  }

  // Populate background images
  activeHeroBackgroundImages = Array.isArray(settings.backgroundImages) && settings.backgroundImages.length > 0
    ? [...settings.backgroundImages]
    : [
        "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=85",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=85",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=85",
        "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=85"
      ];

  // Populate image opacity
  if (imageOpacitySlider) {
    const op = settings.imageOpacity !== undefined ? Math.round(settings.imageOpacity * 100) : 40;
    imageOpacitySlider.value = op;
    if (imageOpacityBadge) imageOpacityBadge.innerText = `${op}%`;
  }

  // Video and legacy blur fields
  if (videoInput) videoInput.value = settings.videoUrl || "assets/hero-bg.mp4";
  if (blurSlider) blurSlider.value = settings.blurPx !== undefined ? settings.blurPx : 12;
  if (overlaySlider) overlaySlider.value = Math.round((settings.overlayOpacity !== undefined ? settings.overlayOpacity : 0.55) * 100);

  function updateHeroPreview() {
    const selectedFont = fontSelect ? fontSelect.value : 'Eyekons';
    const imgOpacity = imageOpacitySlider ? Number(imageOpacitySlider.value) / 100 : 0.40;
    const blur = blurSlider ? blurSlider.value : 12;
    const overlay = overlaySlider ? overlaySlider.value : 55;

    if (imageOpacityBadge && imageOpacitySlider) {
      imageOpacityBadge.innerText = `${imageOpacitySlider.value}%`;
    }
    if (blurBadge) blurBadge.innerText = `${blur}px`;
    if (overlayBadge) overlayBadge.innerText = `${overlay}%`;

    if (previewTitle) {
      previewTitle.style.fontFamily = `"${selectedFont}", sans-serif`;
    }

    if (previewOverlay) {
      // Reflect background darkness & glass blur
      previewOverlay.style.background = `rgba(5, 7, 15, ${1 - imgOpacity * 0.5})`;
    }

    if (previewStage && activeHeroBackgroundImages.length > 0) {
      previewStage.style.backgroundImage = `url('${activeHeroBackgroundImages[0]}')`;
    }
  }

  function renderHeroImagesList() {
    const container = document.getElementById('heroImagesListContainer');
    const badge = document.getElementById('heroImagesCountBadge');
    if (badge) {
      badge.innerText = `${activeHeroBackgroundImages.length} Image${activeHeroBackgroundImages.length === 1 ? '' : 's'}`;
    }
    if (!container) return;

    if (activeHeroBackgroundImages.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 1.25rem; text-align: center; color: var(--text-muted); font-size: 0.8rem; border: 1px dashed var(--border-color); border-radius: 6px;">
          No images in background pool. Please add an image or preset below.
        </div>
      `;
      return;
    }

    container.innerHTML = activeHeroBackgroundImages.map((url, idx) => `
      <div class="hero-image-chip" title="${escapeHtml(url)}">
        <img src="${escapeHtml(url)}" alt="Hero BG ${idx + 1}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=60';">
        <button type="button" class="hero-image-chip-delete" onclick="removeHeroImage(${idx})" title="Remove image">&times;</button>
        <span class="hero-image-badge-active">#${idx + 1}</span>
      </div>
    `).join('');

    updateHeroPreview();
  }

  window.removeHeroImage = function(idx) {
    if (idx >= 0 && idx < activeHeroBackgroundImages.length) {
      activeHeroBackgroundImages.splice(idx, 1);
      renderHeroImagesList();
      window.showToast('Image removed from pool', 'info');
    }
  };

  window.addHeroImageFromInput = function() {
    const input = document.getElementById('newHeroImageUrl');
    if (!input) return;
    const url = input.value.trim();
    if (!url) {
      window.showToast('Please enter an image URL', 'error');
      return;
    }
    if (activeHeroBackgroundImages.includes(url)) {
      window.showToast('Image already exists in pool', 'warning');
      return;
    }
    activeHeroBackgroundImages.push(url);
    input.value = '';
    renderHeroImagesList();
    window.showToast('Image added to hero background pool!', 'success');
  };

  window.addHeroImagePreset = function(url) {
    if (!url) return;
    if (activeHeroBackgroundImages.includes(url)) {
      window.showToast('Preset already added to pool', 'info');
      return;
    }
    activeHeroBackgroundImages.push(url);
    renderHeroImagesList();
    window.showToast('Preset added to hero pool!', 'success');
  };

  if (fontSelect) fontSelect.addEventListener('change', updateHeroPreview);
  if (imageOpacitySlider) imageOpacitySlider.addEventListener('input', updateHeroPreview);
  if (blurSlider) blurSlider.addEventListener('input', updateHeroPreview);
  if (overlaySlider) overlaySlider.addEventListener('input', updateHeroPreview);

  renderHeroImagesList();
  updateHeroPreview();

  const heroForm = document.getElementById('heroAppearanceForm');
  if (heroForm) {
    heroForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fontFamily = fontSelect ? fontSelect.value : 'Eyekons';
      const imageOpacity = imageOpacitySlider ? Number(imageOpacitySlider.value) / 100 : 0.40;
      const videoUrl = videoInput ? videoInput.value.trim() : "assets/hero-bg.mp4";
      const blurPx = blurSlider ? Number(blurSlider.value) : 12;
      const overlayOpacity = overlaySlider ? Number(overlaySlider.value) / 100 : 0.55;

      await window.CRII_API.saveHeroSettings({
        fontFamily,
        backgroundImages: [...activeHeroBackgroundImages],
        imageOpacity,
        videoUrl,
        blurPx,
        overlayOpacity
      });

      window.showToast('Hero section typography & multi-image settings saved!', 'success');
    });
  }
}

window.setHeroVideoPreset = function(url) {
  const videoInput = document.getElementById('settingHeroVideoUrl');
  if (videoInput) {
    videoInput.value = url;
  }
};

// -----------------------------------------------------------------------------
// 4. ADMISSIONS QUEUE REVIEW
// -----------------------------------------------------------------------------
function renderApplicationsTable() {
  const tbody = document.getElementById('portalAppsTbody');
  if (!tbody) return;

  const apps = cachedInternsData.applications || [];
  if (apps.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:3rem; color:var(--text-muted);">No student fellowship applications pending review.</td></tr>`;
    return;
  }

  tbody.innerHTML = apps.map(a => {
    let chipClass = 'warning';
    if (a.status === 'Accepted') chipClass = 'success';
    if (a.status === 'Declined') chipClass = 'danger';

    return `
      <tr>
        <td>
          <div style="font-weight:600; color:var(--text-primary);">${escapeHtml(a.fullName)}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(a.email)}</div>
        </td>
        <td>
          <div>${escapeHtml(a.university)}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(a.fieldOfStudy)}</div>
        </td>
        <td><span class="badge badge-blue">${escapeHtml(a.preferredDivision)}</span></td>
        <td>${a.appliedDate}</td>
        <td><span class="badge badge-${chipClass}">${a.status}</span></td>
        <td>
          <div style="display:inline-flex; gap:0.4rem; align-items:center;">
            <button class="btn btn-secondary btn-sm" onclick="reviewApplication('${a.id}')">
              Review
            </button>
            <button class="btn btn-sm btn-icon" title="Email Candidate via EmailJS" onclick="openEmailComposer('${escapeHtml(a.email)}', '${escapeHtml(a.fullName)}', 'CRII Fellowship Update')" style="background:rgba(37,99,235,0.08); color:var(--accent-primary);">
              ✉
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

let activeAppId = null;
function initApplicationModal() {
  const modal = document.getElementById('appReviewModal');
  if (!modal) return;

  modal.querySelectorAll('.modal-close').forEach(c => {
    c.addEventListener('click', () => modal.classList.remove('active'));
  });

  const acceptBtn = document.getElementById('acceptAppBtn');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', async () => {
      if (activeAppId) {
        await window.CRII_API.updateApplicationStatus(activeAppId, 'Accepted');
        modal.classList.remove('active');
        window.showToast('Candidate accepted & enrolled to research cohort!', 'success');
        await refreshDashboardData();
      }
    });
  }

  const underwayBtn = document.getElementById('reviewUnderwayBtn');
  if (underwayBtn) {
    underwayBtn.addEventListener('click', async () => {
      if (activeAppId) {
        await window.CRII_API.updateApplicationStatus(activeAppId, 'Under Review');
        modal.classList.remove('active');
        window.showToast('Application marked as Under Review', 'info');
        await refreshDashboardData();
      }
    });
  }

  const rejectBtn = document.getElementById('rejectAppBtn');
  if (rejectBtn) {
    rejectBtn.addEventListener('click', async () => {
      if (activeAppId) {
        await window.CRII_API.updateApplicationStatus(activeAppId, 'Declined');
        modal.classList.remove('active');
        window.showToast('Application marked as Declined', 'info');
        await refreshDashboardData();
      }
    });
  }
}

window.reviewApplication = function(appId) {
  activeAppId = appId;
  const app = (cachedInternsData.applications || []).find(a => a.id === appId);
  if (!app) return;

  const modal = document.getElementById('appReviewModal');
  const details = document.getElementById('appReviewDetails');
  if (!modal || !details) return;

  details.innerHTML = `
    <div style="margin-bottom:1.5rem;">
      <h2 style="font-size:1.4rem; color:var(--text-primary); margin-bottom:0.25rem;">${escapeHtml(app.fullName)}</h2>
      <div style="font-size:0.85rem; color:var(--text-muted);">${escapeHtml(app.email)} • ${escapeHtml(app.university)}</div>
    </div>
    <div style="background:var(--bg-primary); padding:1rem 1.25rem; border-radius:10px; margin-bottom:1.25rem; border:1px solid var(--border-color);">
      <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; margin-bottom:0.25rem;">Research Division Preference</div>
      <div style="font-weight:600; color:var(--accent-primary);">${escapeHtml(app.preferredDivision)}</div>
    </div>
    <div>
      <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; margin-bottom:0.5rem;">Research Statement</div>
      <p style="font-size:0.95rem; line-height:1.7; color:var(--text-secondary); background:var(--bg-primary); padding:1.25rem; border-radius:10px; border:1px solid var(--border-color); white-space:pre-wrap;">${escapeHtml(app.statement || 'No statement submitted.')}</p>
    </div>
  `;

  modal.classList.add('active');
};

// -----------------------------------------------------------------------------
// 5. DATASETS, PERMISSIONS & BRANDING
// -----------------------------------------------------------------------------
function initDatasetForm() {
  const form = document.getElementById('newDatasetForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('dsTitleInput').value.trim();
    const category = document.getElementById('dsCategoryInput').value;
    const lead = document.getElementById('dsLeadInput').value.trim();
    const format = document.getElementById('dsFormatInput').value.trim() || 'CSV / HDF5';
    const size = document.getElementById('dsSizeInput').value.trim() || '25 MB';
    const version = document.getElementById('dsVersionInput').value.trim() || 'v1.0.0';
    const license = document.getElementById('dsLicenseInput').value.trim() || 'CC-BY 4.0';
    const desc = document.getElementById('dsDescInput').value.trim();

    await window.CRII_API.createDataset({
      title,
      category,
      lead,
      format,
      size,
      version,
      license,
      description: desc
    });

    window.showToast('Open dataset published to catalog!', 'success');
    form.reset();
    await refreshDashboardData();
  });
}

function renderDatasetsTable() {
  const tbody = document.getElementById('portalDatasetsTbody');
  if (!tbody) return;

  tbody.innerHTML = cachedDatasets.map(d => `
    <tr>
      <td>
        <div style="font-weight:600; color:var(--text-primary);">${escapeHtml(d.title)}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(d.format)} • ${escapeHtml(d.size)}</div>
      </td>
      <td><span class="badge badge-blue">${escapeHtml(d.category)}</span></td>
      <td><span class="status-chip published">${escapeHtml(d.version)}</span></td>
      <td>${escapeHtml(d.lead)}</td>
      <td><span style="font-size:0.78rem; font-family:monospace;">${escapeHtml(d.license)}</span></td>
    </tr>
  `).join('');
}

function initAccessControl() {
  const form = document.getElementById('addAllowedUserForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Authorizing...';
    }

    const email = document.getElementById('newAllowedEmail').value.trim();
    const name = document.getElementById('newAllowedName').value.trim();
    const role = document.getElementById('newAllowedRole').value;
    const division = document.getElementById('newAllowedDivision').value;

    try {
      const res = await window.CRII_API.addAllowedUser({ email, name, role, division });
      if (!res.success) {
        window.showToast(res.error, 'error');
        return;
      }

      window.showToast(`User ${email} authorized and saved successfully!`, 'success');
      form.reset();
      renderAllowedUsersTable();
    } catch (err) {
      window.showToast('Failed to authorize account: ' + err.message, 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Authorize Account';
      }
    }
  });
}

function renderAllowedUsersTable() {
  const tbody = document.getElementById('allowedUsersTbody');
  if (!tbody) return;

  const users = window.CRII_API.getAllowedUsers();
  tbody.innerHTML = users.map(u => `
    <tr>
      <td>
        <div style="font-weight:600; color:var(--text-primary);">${escapeHtml(u.name)}</div>
        <div style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">${escapeHtml(u.email)}</div>
      </td>
      <td><span class="status-chip published">${escapeHtml(u.role)}</span></td>
      <td>${escapeHtml(u.division || 'Scientific Division')}</td>
      <td>${u.addedDate || '2026-09-24'}</td>
      <td>
        ${u.email === 'harunabdullahrakin@gmail.com' ? 
          `<span style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">Protected</span>` : 
          `<button class="btn btn-sm" style="background:rgba(239, 68, 68, 0.1); color:#ef4444; border:1px solid rgba(239, 68, 68, 0.25);" onclick="removeAllowedEmail('${escapeHtml(u.email)}')">Revoke</button>`
        }
      </td>
    </tr>
  `).join('');
}

window.removeAllowedEmail = async function(email) {
  if (confirm(`Revoke portal permissions for ${email}?`)) {
    const res = await window.CRII_API.removeAllowedUser(email);
    if (!res.success) {
      window.showToast(res.error, 'error');
      return;
    }
    window.showToast('User permission revoked', 'info');
    renderAllowedUsersTable();
  }
};

function initInstituteSettings() {
  const titleInput = document.getElementById('settingNavbarTitle');
  const logoInput = document.getElementById('settingLogoUrl');
  const appIdInput = document.getElementById('settingAutzAppId');

  if (titleInput) titleInput.value = window.CRII_API.getInstituteName();
  if (logoInput) logoInput.value = window.CRII_API.getInstituteLogo();
  if (appIdInput) appIdInput.value = window.CRII_API.getAutzAppId();

  const form = document.getElementById('instituteSettingsForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newTitle = titleInput ? titleInput.value : '';
      const newLogo = logoInput ? logoInput.value : '';
      const newAppId = appIdInput ? appIdInput.value : '';

      await window.CRII_API.saveInstituteSettings({
        name: newTitle,
        logo: newLogo,
        autzAppId: newAppId
      });

      window.showToast('Institute settings saved to database!', 'success');
      setTimeout(() => window.location.reload(), 800);
    });
  }

  // EmailJS Settings Form in Tab 6
  const emailjsTplInput = document.getElementById('settingEmailjsTemplateId');
  if (emailjsTplInput) {
    emailjsTplInput.value = localStorage.getItem('crii_emailjs_template_id') || 
      (window.CRII_API && typeof window.CRII_API.getEmailjsTemplateId === 'function' ? window.CRII_API.getEmailjsTemplateId() : null) || 'zhelx7y';
  }

  const emailjsForm = document.getElementById('emailjsSettingsForm');
  if (emailjsForm) {
    emailjsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = (document.getElementById('settingEmailjsTemplateId')?.value || '').trim();
      if (!val) {
        window.showToast('Please enter your EmailJS Template ID', 'error');
        return;
      }
      localStorage.setItem('crii_emailjs_template_id', val);
      try {
        const current = (window.CRII_API && typeof window.CRII_API.getInstituteSettings === 'function') ? window.CRII_API.getInstituteSettings() : {};
        if (window.CRII_API && typeof window.CRII_API.saveInstituteSettings === 'function') {
          await window.CRII_API.saveInstituteSettings({
            ...current,
            emailjsTemplateId: val
          });
        }
      } catch (err) {
        console.warn('Institute settings save note:', err);
      }
      window.showToast(`EmailJS Template ID saved as "${val}"!`, 'success');
    });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// -----------------------------------------------------------------------------
// 7. EMAILJS DISPATCH INTEGRATION
// -----------------------------------------------------------------------------
function initEmailComposer() {
  if (window.emailjs) {
    try {
      emailjs.init({ publicKey: 'h3x_9dtR8frBq2pCi' });
    } catch (e) {
      console.warn('EmailJS initialization notice:', e);
    }
  }

  const emailForm = document.getElementById('emailComposerForm');
  if (emailForm) {
    emailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const sendBtn = document.getElementById('composerSendBtn');
      const toEmail = (document.getElementById('composerToEmail')?.value || '').trim();
      const toName = (document.getElementById('composerToName')?.value || '').trim();
      const subject = (document.getElementById('composerSubject')?.value || '').trim();
      const templateId = (document.getElementById('composerTemplateId')?.value || '').trim() || 'zhelx7y';
      const message = (document.getElementById('composerMessage')?.value || '').trim();

      if (!toEmail || !message) {
        window.showToast('Please specify a recipient email and message.', 'error');
        return;
      }

      if (!templateId) {
        window.showToast('Please enter your EmailJS Template ID from dashboard.emailjs.com/admin/templates', 'error', 5000);
        document.getElementById('composerTemplateId')?.focus();
        return;
      }

      // Persist the entered template ID for future dispatches
      localStorage.setItem('crii_emailjs_template_id', templateId);

      sendBtn.disabled = true;
      sendBtn.innerText = 'Dispatching via curiomas...';

      try {
        if (!window.emailjs) {
          throw new Error('EmailJS library not loaded');
        }

        const templateParams = {
          to_email: toEmail,
          to_name: toName || toEmail,
          user_email: toEmail,
          from_name: 'Curiomas Research & Innovation Institute',
          subject: subject,
          message: message,
          reply_to: 'curiomas.members@gmail.com'
        };

        await emailjs.send('curiomas', templateId, templateParams, 'h3x_9dtR8frBq2pCi');
        window.showToast(`Email dispatched successfully to ${toEmail}!`, 'success');
        closeEmailComposer();
      } catch (err) {
        console.error('EmailJS dispatch error:', err);
        const errMsg = err?.text || err?.message || 'Email dispatch failed';
        if (errMsg.toLowerCase().includes('template') && errMsg.toLowerCase().includes('not found')) {
          window.showToast(`Template ID '${templateId}' not found. Please visit dashboard.emailjs.com/admin/templates to copy your actual Template ID.`, 'error', 6500);
        } else {
          window.showToast(`Email error: ${errMsg}`, 'error', 5000);
        }
      } finally {
        sendBtn.disabled = false;
        sendBtn.innerHTML = `<span>Send Email via EmailJS</span><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`;
      }
    });
  }

  const reviewEmailBtn = document.getElementById('reviewEmailApplicantBtn');
  if (reviewEmailBtn) {
    reviewEmailBtn.addEventListener('click', () => {
      if (activeAppId) {
        const app = (cachedInternsData.applications || []).find(a => a.id === activeAppId);
        if (app && app.email) {
          openEmailComposer(
            app.email,
            app.fullName,
            `CRII Research Fellowship Application - ${app.preferredDivision || 'Admissions'}`,
            `Dear ${app.fullName},\n\nThank you for applying to the Curiomas Research & Innovation Institute (CRII) Student Fellowship Cohort in ${app.preferredDivision || 'the research stream'}.\n\n`
          );
        }
      }
    });
  }
}

window.openEmailComposer = function(toEmail = '', toName = '', defaultSubject = '', defaultMsg = '') {
  const modal = document.getElementById('emailComposerModal');
  if (!modal) return;
  const toEl = document.getElementById('composerToEmail');
  const nameEl = document.getElementById('composerToName');
  const subjEl = document.getElementById('composerSubject');
  const msgEl = document.getElementById('composerMessage');
  const tplEl = document.getElementById('composerTemplateId');

  if (toEl) toEl.value = toEmail;
  if (nameEl) nameEl.value = toName;
  if (subjEl && defaultSubject) subjEl.value = defaultSubject;
  if (msgEl && defaultMsg) msgEl.value = defaultMsg;

  // Prepopulate saved Template ID from localStorage or settings
  const savedTemplateId = localStorage.getItem('crii_emailjs_template_id') || 
    (window.CRII_API && typeof window.CRII_API.getEmailjsTemplateId === 'function' ? window.CRII_API.getEmailjsTemplateId() : null) || 'zhelx7y';
  if (tplEl) {
    tplEl.value = savedTemplateId;
  }

  modal.classList.add('active');
};

window.closeEmailComposer = function() {
  const modal = document.getElementById('emailComposerModal');
  if (modal) modal.classList.remove('active');
};


// -----------------------------------------------------------------------------
// RESEARCH DIVISIONS CRUD MANAGEMENT
// -----------------------------------------------------------------------------
window.renderDivisionsTab = async function() {
  const container = document.getElementById('portalDivisionsList');
  if (!container || !window.CRII_API) return;

  const divisions = await window.CRII_API.getDivisions();
  if (!divisions || !Array.isArray(divisions) || divisions.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:3.5rem 1rem; color:var(--text-muted); grid-column: 1 / -1; background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: 16px;">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" style="margin-bottom:0.75rem; color:var(--text-muted);"><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/></svg>
        <p style="margin:0 0 1rem;">No research divisions found. Click "Add New Division" above to create one.</p>
        <button class="btn btn-primary btn-sm" onclick="openDivisionModal()">+ Add New Division</button>
      </div>
    `;
    return;
  }

  container.innerHTML = divisions.map(div => `
    <div class="division-manage-card">
      <div class="division-manage-media">
        <img src="${div.image || 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=800&q=80'}" alt="${div.title}" loading="lazy">
        <span class="division-manage-badge">${div.tag || (div.number ? div.number + ' / RESEARCH DIVISION' : 'RESEARCH DIVISION')}</span>
      </div>
      <div class="division-manage-body">
        <h3 class="division-manage-title">${div.title}</h3>
        <p class="division-manage-desc">${div.desc || ''}</p>
        <div class="division-manage-meta">
          <span>Route: <code>${div.link || '/research'}</code></span>
        </div>
        <div class="division-manage-actions">
          <button type="button" class="btn btn-secondary btn-sm" onclick="editDivision('${div.id}')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.35rem;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <span>Edit</span>
          </button>
          <button type="button" class="btn btn-danger btn-sm" onclick="deleteDivisionConfirm('${div.id}', '${div.title.replace(/'/g, "\\'")}')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.35rem;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
};

window.openDivisionModal = function(id = null) {
  const modal = document.getElementById('divisionModal');
  const modalTitle = document.getElementById('divisionModalTitle');
  const form = document.getElementById('divisionForm');
  if (!modal || !form) return;

  form.reset();
  document.getElementById('divisionIdInput').value = '';

  if (id) {
    if (modalTitle) modalTitle.innerText = 'Edit Research Division';
    window.CRII_API.getDivisions().then(divisions => {
      const div = divisions.find(d => String(d.id) === String(id));
      if (div) {
        document.getElementById('divisionIdInput').value = div.id;
        document.getElementById('divisionTitleInput').value = div.title || '';
        document.getElementById('divisionNumberInput').value = div.number || '';
        document.getElementById('divisionTagInput').value = div.tag || '';
        document.getElementById('divisionDescInput').value = div.desc || '';
        document.getElementById('divisionImageInput').value = div.image || '';
        document.getElementById('divisionLinkInput').value = div.link || '/research';
      }
    });
  } else {
    if (modalTitle) modalTitle.innerText = 'Add Research Division';
    document.getElementById('divisionLinkInput').value = '/research';
  }

  modal.classList.add('active');
};

window.closeDivisionModal = function() {
  const modal = document.getElementById('divisionModal');
  if (modal) {
    modal.classList.remove('active');
  }
};

window.editDivision = function(id) {
  window.openDivisionModal(id);
};

window.handleSaveDivision = async function(e) {
  e.preventDefault();
  const id = document.getElementById('divisionIdInput').value.trim();
  const title = document.getElementById('divisionTitleInput').value.trim();
  const number = document.getElementById('divisionNumberInput').value.trim();
  const tag = document.getElementById('divisionTagInput').value.trim() || (number ? `${number} / RESEARCH DIVISION` : 'RESEARCH DIVISION');
  const desc = document.getElementById('divisionDescInput').value.trim();
  const image = document.getElementById('divisionImageInput').value.trim();
  const link = document.getElementById('divisionLinkInput').value.trim() || '/research';

  const divisionData = {
    id: id || undefined,
    number: number || '01',
    tag,
    title,
    desc,
    image,
    link
  };

  const saveBtn = document.getElementById('saveDivisionBtn');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerText = 'Saving...';
  }

  try {
    await window.CRII_API.saveDivision(divisionData);
    window.closeDivisionModal();
    await window.renderDivisionsTab();
    if (window.showToast) window.showToast('Research division saved successfully!', 'success');
  } catch (err) {
    alert('Failed to save division: ' + (err.message || err));
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerText = 'Save Division';
    }
  }
};

window.deleteDivisionConfirm = async function(id, title) {
  if (!confirm(`Are you sure you want to delete the division "${title}"?\nThis will remove it from the homepage and research catalog.`)) {
    return;
  }

  try {
    await window.CRII_API.deleteDivision(id);
    await window.renderDivisionsTab();
    if (window.showToast) window.showToast('Division removed.', 'info');
  } catch (err) {
    alert('Failed to delete division: ' + (err.message || err));
  }
};

// --- COHORTS / WHO CAN JOIN US MANAGEMENT ---
window.renderCohortsTab = async function() {
  const container = document.getElementById('portalCohortsList');
  if (!container || !window.CRII_API) return;

  const cohorts = await window.CRII_API.getCohorts();
  if (!cohorts || !Array.isArray(cohorts) || cohorts.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:3.5rem 1rem; color:var(--text-muted); grid-column: 1 / -1; background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: 16px;">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" style="margin-bottom:0.75rem; color:var(--text-muted);"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></svg>
        <p style="margin:0 0 1rem;">No cohort profiles found. Click "Add New Profile" above to create one.</p>
        <button class="btn btn-primary btn-sm" onclick="openCohortModal()">+ Add New Profile</button>
      </div>
    `;
    return;
  }

  container.innerHTML = cohorts.map(c => `
    <div class="cohort-manage-card">
      <div class="cohort-manage-media">
        <img src="${c.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'}" alt="${c.title}" loading="lazy">
      </div>
      <div class="cohort-manage-body">
        <h3 class="cohort-manage-title">${c.title}</h3>
        <p class="cohort-manage-desc">${c.desc || ''}</p>
        <div class="cohort-manage-meta">
          <span>Target: <code>${c.link || '/team#apply'}</code> (${c.linkText || 'Apply as Fellow'})</span>
        </div>
        <div class="cohort-manage-actions">
          <button type="button" class="btn btn-secondary btn-sm" onclick="editCohort('${c.id}')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.35rem;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <span>Edit</span>
          </button>
          <button type="button" class="btn btn-danger btn-sm" onclick="deleteCohortConfirm('${c.id}', '${(c.title || '').replace(/'/g, "\\'")}')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.35rem;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
};

window.openCohortModal = function(id = null) {
  const modal = document.getElementById('cohortModal');
  const modalTitle = document.getElementById('cohortModalTitle');
  const form = document.getElementById('cohortForm');
  if (!modal) return;

  if (form) form.reset();
  document.getElementById('cohortIdInput').value = '';

  if (id) {
    if (modalTitle) modalTitle.innerText = 'Edit Cohort Profile';
    window.CRII_API.getCohorts().then(cohorts => {
      const c = cohorts.find(item => String(item.id) === String(id));
      if (c) {
        document.getElementById('cohortIdInput').value = c.id;
        document.getElementById('cohortTitleInput').value = c.title || '';
        document.getElementById('cohortDescInput').value = c.desc || '';
        document.getElementById('cohortImageInput').value = c.image || '';
        document.getElementById('cohortLinkInput').value = c.link || '/team#apply';
        document.getElementById('cohortLinkTextInput').value = c.linkText || 'Apply as Fellow';
      }
    });
  } else {
    if (modalTitle) modalTitle.innerText = 'Add Cohort Profile';
    document.getElementById('cohortLinkInput').value = '/team#apply';
    document.getElementById('cohortLinkTextInput').value = 'Apply as Fellow';
  }

  modal.classList.add('active');
  modal.style.display = 'flex';
};

window.closeCohortModal = function() {
  const modal = document.getElementById('cohortModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
};

window.editCohort = function(id) {
  window.openCohortModal(id);
};

window.handleSaveCohort = async function(e) {
  if (e && e.preventDefault) e.preventDefault();

  const id = document.getElementById('cohortIdInput').value.trim();
  const title = document.getElementById('cohortTitleInput').value.trim();
  const desc = document.getElementById('cohortDescInput').value.trim();
  const image = document.getElementById('cohortImageInput').value.trim();
  const link = document.getElementById('cohortLinkInput').value.trim() || '/team#apply';
  const linkText = document.getElementById('cohortLinkTextInput').value.trim() || 'Apply as Fellow';

  const cohortData = {
    id: id || undefined,
    title,
    desc,
    image,
    link,
    linkText
  };

  const saveBtn = document.getElementById('saveCohortBtn');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerText = 'Saving...';
  }

  try {
    await window.CRII_API.saveCohort(cohortData);
    window.closeCohortModal();
    await window.renderCohortsTab();
    if (window.showToast) window.showToast('Cohort profile saved successfully!', 'success');
  } catch (err) {
    alert('Failed to save cohort profile: ' + (err.message || err));
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerText = 'Save Cohort Profile';
    }
  }
};

window.deleteCohortConfirm = async function(id, title) {
  if (!confirm(`Are you sure you want to delete the profile "${title}"?\nThis will remove it from the homepage "Who can join us?" section.`)) {
    return;
  }

  try {
    await window.CRII_API.deleteCohort(id);
    await window.renderCohortsTab();
    if (window.showToast) window.showToast('Cohort profile deleted.', 'info');
  } catch (err) {
    alert('Failed to delete cohort profile: ' + (err.message || err));
  }
};


async function loadRandomScientificBackground() {
  const pane = document.querySelector('.login-showcase-pane');
  if (!pane) return;

  const topics = ['galaxy', 'nebula', 'deep+space', 'telescope', 'hubble', 'astrophysics', 'supernova'];
  const topic = topics[Math.floor(Math.random() * topics.length)];

  const curatedScienceImages = [
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1600&q=85'
  ];

  try {
    const res = await fetch('https://images-api.nasa.gov/search?q=' + topic + '&media_type=image');
    if (res.ok) {
      const data = await res.json();
      const items = (data?.collection?.items || []).filter(it => it.links && it.links.length > 0 && it.links[0].href);
      if (items.length > 0) {
        const randomItem = items[Math.floor(Math.random() * Math.min(items.length, 25))];
        const rawHref = randomItem.links[0].href;
        const imgUrl = rawHref.replace(/~thumb\.jpg$/, '~large.jpg').replace(/~small\.jpg$/, '~large.jpg');
        const img = new Image();
        img.onload = () => {
          pane.style.backgroundImage = 'url("' + imgUrl + '")';
        };
        img.src = imgUrl;
        return;
      }
    }
  } catch (e) {
    console.warn('NASA image API notice:', e);
  }

  const fallback = curatedScienceImages[Math.floor(Math.random() * curatedScienceImages.length)];
  pane.style.backgroundImage = 'url("' + fallback + '")';
}
