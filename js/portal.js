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
    if (authSection) authSection.style.display = 'flex';
    if (dashboardSection) dashboardSection.style.display = 'none';
    return;
  }

  if (authSection) authSection.style.display = 'none';
  if (dashboardSection) dashboardSection.style.display = 'flex';

  // Render User profile
  const userNameEl = document.getElementById('portalUserName');
  const userEmailEl = document.getElementById('portalUserEmail');
  const userRoleEl = document.getElementById('portalUserRole');
  if (userNameEl) userNameEl.innerText = user.name || "Researcher";
  if (userEmailEl) userEmailEl.innerText = user.email || "";
  if (userRoleEl) userRoleEl.innerText = user.role || "Member";

  initSidebarNavigation();
  initBloggerEditor();
  initRosterManagement();
  initHeroAppearanceSettings();
  initDatasetForm();
  initApplicationModal();
  initAccessControl();
  initInstituteSettings();

  await refreshDashboardData();
});

// -----------------------------------------------------------------------------
// NAVIGATION & DASHBOARD DATA
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
    document.getElementById('bloggerTitleInput').value = "The Last Dance";
    isCurrentPostPublished = true;
    document.getElementById('bloggerCoverInput').value = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80";
    document.getElementById('bloggerSlugInput').value = "the-last-dance";
    document.getElementById('bloggerCategoryInput').value = "Space & Astrophysics";
    const user = window.CRII_API.getCurrentUser();
    document.getElementById('bloggerAuthorsInput').value = user ? (user.name || "CRII Fellow") : "CRII Fellow";
    document.getElementById('bloggerDoiInput').value = `10.5281/crii.2026.${Math.floor(1000 + Math.random() * 9000)}`;
    document.getElementById('bloggerSummaryInput').value = "An open inquiry into celestial mechanics, deep time horizons, and emergent discovery.";
    document.getElementById('bloggerAbstractInput').value = "This publication documents multi-observer calibrations, synthetic spectral modeling, and open-source data pipelines developed by student researchers.";
    document.getElementById('bloggerTagsInput').value = "Research, Astrophysics, OpenScience";
    updateCoverPreview("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80");

    currentPostBlocks = [
      { id: `b-${Date.now()}-1`, type: 'heading', content: '1. Introduction & Overview' },
      { id: `b-${Date.now()}-2`, type: 'text', content: 'The Last Dance was held on 4/9/2026 (4:10pm) with @saad @kinsuk @arian @soron @harun collaborating on astrophysical instrumentation.' },
      { id: `b-${Date.now()}-3`, type: 'callout', style: 'note', content: 'All raw spectral data and notebook pipelines are fully archived in the CRII Open Datasets repository under CC-BY 4.0.' }
    ];
  }

  updateBloggerStatusUI();
  renderBlockStack();
  switchBloggerSubtab('write');
}

function closeBloggerEditor() {
  const dirView = document.getElementById('postsDirectoryView');
  const editView = document.getElementById('postsEditorView');
  if (dirView) dirView.style.display = 'block';
  if (editView) editView.style.display = 'none';
  currentEditingPostId = null;
  refreshDashboardData();
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
  currentPostBlocks.forEach(b => {
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
      ${blocksHtml}
    </div>

    ${tags.length > 0 ? `
      <div style="margin-top:2.5rem; padding-top:1.5rem; border-top:1px solid var(--border-color); display:flex; gap:0.4rem; flex-wrap:wrap;">
        ${tags.map(t => `<span class="tag-item">#${escapeHtml(t)}</span>`).join(' ')}
      </div>
    ` : ''}
  `;
}

// Save Post
async function saveCurrentPost() {
  const title = document.getElementById('bloggerTitleInput').value.trim();
  if (!title) {
    window.showToast('Please enter an article title', 'error');
    return;
  }

  const category = document.getElementById('bloggerCategoryInput').value;
  const coverImage = document.getElementById('bloggerCoverInput').value.trim();
  const slugInput = document.getElementById('bloggerSlugInput').value.trim();
  const slug = slugInput || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const authorsStr = document.getElementById('bloggerAuthorsInput').value.trim();
  const doi = document.getElementById('bloggerDoiInput').value.trim() || `10.5281/crii.2026.${Math.floor(1000 + Math.random() * 9000)}`;
  const summary = document.getElementById('bloggerSummaryInput').value.trim() || title;
  const abstract = document.getElementById('bloggerAbstractInput').value.trim();
  const tagsStr = document.getElementById('bloggerTagsInput').value.trim();
  const user = window.CRII_API.getCurrentUser();
  const editorName = user ? (user.name || user.email) : "Administrator";

  let wordCount = 0;
  currentPostBlocks.forEach(b => {
    if (b.content) wordCount += b.content.split(/\s+/).length;
  });
  const readingTime = `${Math.max(1, Math.ceil(wordCount / 180))} min read`;

  const compiledContent = compileBlocksToContent(currentPostBlocks);

  const postPayload = {
    id: currentEditingPostId || `crii-paper-${Date.now()}`,
    title,
    slug,
    category,
    coverImage,
    authors: authorsStr ? authorsStr.split(',').map(a => a.trim()) : ["CRII Fellow"],
    readingTime,
    doi,
    summary,
    abstract,
    content: compiledContent,
    blocks: currentPostBlocks,
    tags: tagsStr ? tagsStr.split(',').map(t => t.trim()) : ["Research"],
    published: isCurrentPostPublished,
    updatedBy: editorName,
    updatedAt: new Date().toISOString()
  };

  await window.CRII_API.savePost(postPayload);
  window.showToast(`Publication successfully ${isCurrentPostPublished ? 'published' : 'saved as draft'}!`, 'success');
  closeBloggerEditor();
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
            <a href="article.html?id=${post.id}" target="_blank" class="btn btn-glass btn-sm" title="View public article">
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
// 3. CONFIGURABLE HERO VIDEO & BACKDROP BLUR SETTINGS
// -----------------------------------------------------------------------------
function initHeroAppearanceSettings() {
  const settings = window.CRII_API.getHeroSettings();
  const videoInput = document.getElementById('settingHeroVideoUrl');
  const blurSlider = document.getElementById('settingHeroBlur');
  const overlaySlider = document.getElementById('settingHeroOverlay');
  const blurBadge = document.getElementById('heroBlurValueBadge');
  const overlayBadge = document.getElementById('heroOverlayValueBadge');
  const previewOverlay = document.getElementById('heroLivePreviewOverlay');

  if (videoInput) videoInput.value = settings.videoUrl || "assets/hero-bg.mp4";
  if (blurSlider) blurSlider.value = settings.blurPx !== undefined ? settings.blurPx : 12;
  if (overlaySlider) overlaySlider.value = Math.round((settings.overlayOpacity !== undefined ? settings.overlayOpacity : 0.55) * 100);

  function updateHeroPreview() {
    const blur = blurSlider ? blurSlider.value : 12;
    const overlay = overlaySlider ? overlaySlider.value : 55;
    if (blurBadge) blurBadge.innerText = `${blur}px`;
    if (overlayBadge) overlayBadge.innerText = `${overlay}%`;
    if (previewOverlay) {
      previewOverlay.style.backdropFilter = `blur(${blur}px)`;
      previewOverlay.style.webkitBackdropFilter = `blur(${blur}px)`;
      previewOverlay.style.background = `rgba(10, 15, 30, ${overlay / 100})`;
    }
  }

  if (blurSlider) blurSlider.addEventListener('input', updateHeroPreview);
  if (overlaySlider) overlaySlider.addEventListener('input', updateHeroPreview);
  updateHeroPreview();

  const heroForm = document.getElementById('heroAppearanceForm');
  if (heroForm) {
    heroForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const videoUrl = videoInput ? videoInput.value.trim() : "assets/hero-bg.mp4";
      const blurPx = blurSlider ? Number(blurSlider.value) : 12;
      const overlayOpacity = overlaySlider ? Number(overlaySlider.value) / 100 : 0.55;

      await window.CRII_API.saveHeroSettings({
        videoUrl,
        blurPx,
        overlayOpacity
      });

      window.showToast('Hero section appearance updated!', 'success');
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
          <button class="btn btn-secondary btn-sm" onclick="reviewApplication('${a.id}')">
            Review Statement →
          </button>
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newAllowedEmail').value.trim();
    const name = document.getElementById('newAllowedName').value.trim();
    const role = document.getElementById('newAllowedRole').value;
    const division = document.getElementById('newAllowedDivision').value;

    const res = window.CRII_API.addAllowedUser({ email, name, role, division });
    if (!res.success) {
      window.showToast(res.error, 'error');
      return;
    }

    window.showToast(`User ${email} added to Autz whitelist!`, 'success');
    form.reset();
    renderAllowedUsersTable();
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
          `<button class="btn btn-sm" style="background:rgba(239, 68, 68, 0.1); color:#ef4444; border:1px solid rgba(239, 68, 68, 0.25);" onclick="removeAllowedEmail('${u.email}')">Revoke</button>`
        }
      </td>
    </tr>
  `).join('');
}

window.removeAllowedEmail = function(email) {
  if (confirm(`Revoke portal permissions for ${email}?`)) {
    const res = window.CRII_API.removeAllowedUser(email);
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
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newTitle = titleInput ? titleInput.value : '';
      const newLogo = logoInput ? logoInput.value : '';
      const newAppId = appIdInput ? appIdInput.value : '';

      window.CRII_API.setInstituteName(newTitle);
      window.CRII_API.setInstituteLogo(newLogo);
      window.CRII_API.setAutzAppId(newAppId);

      window.showToast('Institute settings saved!', 'success');
      setTimeout(() => window.location.reload(), 800);
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
