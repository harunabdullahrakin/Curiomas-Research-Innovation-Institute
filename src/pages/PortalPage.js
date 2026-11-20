import { auth } from '../services/auth.js';

function renderMediaPickerField({ id, accept = 'image/*', uploadLabel = 'Upload Image', placeholder = 'Paste URL or server path (/assets/... or /api/images/...)', extraOnInput = '' }) {
  const inputHook = extraOnInput ? `${extraOnInput}; window.syncMediaPreviewBadge('${id}')` : `window.syncMediaPreviewBadge('${id}')`;
  return `
    <div class="crii-media-picker" data-media-input="${id}" style="display:flex; flex-direction:column; gap:0.5rem;">
      <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
        <button type="button" class="btn btn-primary btn-sm" onclick="window.triggerFieldMediaUpload('${id}', '${accept}')" style="display:inline-flex; align-items:center; gap:0.4rem; white-space:nowrap;">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <span>${uploadLabel}</span>
        </button>
        <button type="button" class="btn btn-secondary btn-sm" id="${id}_urlBtn" onclick="window.toggleMediaUrlRow('${id}')" style="display:inline-flex; align-items:center; gap:0.35rem; white-space:nowrap;">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          <span>URL</span>
        </button>
        <div id="${id}_preview" style="font-size:0.76rem; color:var(--text-muted); display:inline-flex; align-items:center; gap:0.45rem; min-width:0; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"></div>
      </div>
      <div id="${id}_urlWrap" style="display:none;">
        <input type="text" id="${id}" class="form-input" placeholder="${placeholder}" oninput="${inputHook}" onchange="${inputHook}" style="width:100%;">
      </div>
    </div>
  `;
}

export function renderPortalPageHtml() {
  return `
    <div class="page-portal-wrapper">
      <section class="portal-layout" id="portalDashboardSection">
        <!-- Mobile Drawer Backdrop -->
        <div class="portal-sidebar-backdrop" id="portalSidebarBackdrop"></div>

        <!-- Sidebar Shell -->
        <aside class="portal-sidebar" id="portalSidebar">
          <!-- Sidebar Brand Header -->
          <div class="portal-brand">
            <a href="/" class="portal-brand-content" title="Return to CRII Public Website">
              <div class="brand-logo-container">
                <img src="/assets/curiomas-no-bg.png" alt="CRII Logo" class="brand-logo-img">
              </div>
              <div class="brand-text-block">
                <div class="brand-title">CRII PORTAL</div>
                <div class="brand-badge">Institute Verified</div>
              </div>
            </a>

            <!-- Desktop Toggle Button -->
            <button id="portalSidebarToggleBtn" class="portal-sidebar-toggle-btn" title="Toggle sidebar (Ctrl+B)" aria-label="Toggle sidebar">
              <svg class="toggle-icon-collapse" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="M9 3v18"/>
                <path d="m15 9-3 3 3 3"/>
              </svg>
              <svg class="toggle-icon-expand" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="M9 3v18"/>
                <path d="m13 9 3 3-3 3"/>
              </svg>
            </button>

            <!-- Mobile Drawer Close Button -->
            <button id="portalSidebarCloseBtn" class="portal-sidebar-close-btn" title="Close drawer" aria-label="Close drawer">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

      <!-- Navigation Menu -->
      <nav class="portal-nav">
        
        <!-- Group 1: General -->
        <div class="portal-nav-group">
          <div class="portal-nav-group-title">Main</div>
          <button class="portal-nav-btn active" data-tab="overview" data-tooltip="Overview">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
            </svg>
            <span class="portal-nav-label">Overview</span>
          </button>
        </div>

        <!-- Group 2: Research & Publishing -->
        <div class="portal-nav-group">
          <div class="portal-nav-group-title">Research & Editorial</div>
          
          <button class="portal-nav-btn" data-tab="posts" data-tooltip="Publications & Blog">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
            </svg>
            <span class="portal-nav-label">Publications & Blog</span>
          </button>

          <button class="portal-nav-btn" data-tab="divisions" data-tooltip="Research Divisions">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="12" y1="9" x2="12" y2="3"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="9" y1="12" x2="3" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/>
            </svg>
            <span class="portal-nav-label">Research Divisions</span>
          </button>

          <button class="portal-nav-btn" data-tab="datasets" data-tooltip="Open Datasets">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
            </svg>
            <span class="portal-nav-label">Open Datasets</span>
          </button>

          <button class="portal-nav-btn" data-tab="academics" data-tooltip="Academics (SSC / HSC)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            <span class="portal-nav-label">Academics (SSC/HSC)</span>
            <span class="portal-nav-badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: 700;">EDU</span>
          </button>
        </div>

        <!-- Group 3: Community & Cohorts -->
        <div class="portal-nav-group">
          <div class="portal-nav-group-title">Community & Queue</div>

          <button class="portal-nav-btn" data-tab="roster" data-tooltip="Team & Fellows">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span class="portal-nav-label">Team & Fellows</span>
          </button>

          <button class="portal-nav-btn" data-tab="interns" data-tooltip="Admissions Queue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span class="portal-nav-label">Admissions Queue</span>
            <span id="sidebarAppBadge" class="portal-nav-badge">0</span>
          </button>

          <button class="portal-nav-btn" data-tab="cohorts" data-tooltip="Who Can Join Us">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/>
            </svg>
            <span class="portal-nav-label">Who Can Join Us?</span>
          </button>

          <button class="portal-nav-btn" data-tab="recruit" data-tooltip="Fees, Packages & Recruit Pages">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
            <span class="portal-nav-label">Packages & Recruit Pages</span>
          </button>
        </div>

        <!-- Group 4: Storage & Media Manager -->
        <div class="portal-nav-group">
          <div class="portal-nav-group-title">Storage & Assets</div>

          <button class="portal-nav-btn" data-tab="storage" data-tooltip="Media Storage Manager">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
            <span class="portal-nav-label">Media & R2 Storage</span>
            <span id="sidebarMediaBadge" class="portal-nav-badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; font-weight: 700;">R2</span>
          </button>
        </div>

        <!-- Group 5: Governance & System -->
        <div class="portal-nav-group">
          <div class="portal-nav-group-title">Governance & Settings</div>

          
          <button class="portal-nav-btn" data-tab="aliases" data-tooltip="Researcher Emails (ImprovMX)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span class="portal-nav-label">Researcher Emails</span>
            <span class="portal-nav-badge" style="background: rgba(234, 88, 12, 0.15); color: #ea580c; font-weight: 700;">MX</span>
          </button>
          <button class="portal-nav-btn" data-tab="permissions" data-tooltip="Access Control">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>
            </svg>
            <span class="portal-nav-label">Access Control</span>
          </button>

          <button class="portal-nav-btn" data-tab="sql" data-tooltip="D1 Database & SQL Studio">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
            </svg>
            <span class="portal-nav-label">D1 SQL Studio</span>
            <span class="portal-nav-badge" style="background: rgba(234, 88, 12, 0.15); color: #ea580c; font-weight: 700;">D1</span>
          </button>
          <button class="portal-nav-btn" data-tab="settings" data-tooltip="Institute & Navbar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            <span class="portal-nav-label">Institute & Navbar</span>
          </button>

          <button class="portal-nav-btn" data-tab="emailer" onclick="openEmailComposer('', '', '', ''); return false;" data-tooltip="Email Dispatcher">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            <span class="portal-nav-label">Email Dispatcher</span>
            <span class="portal-nav-badge" style="background: rgba(234, 88, 12, 0.15); color: #ea580c; font-weight: 700;">Gmail</span>
          </button>

          <button class="portal-nav-btn" data-tab="aihelp" onclick="window.openAiHelpModal('chat'); return false;" data-tooltip="AI Help & Free APIs Guide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span class="portal-nav-label">AI Help & Guides</span>
            <span class="portal-nav-badge" style="background: rgba(234, 88, 12, 0.18); color: #ea580c; font-weight: 700;">AI</span>
          </button>
        </div>

      </nav>

      <!-- Sidebar Footer -->
      <div class="portal-sidebar-footer">
        <div class="portal-user-card">
          <div class="portal-user-avatar" id="portalUserAvatar">R</div>
          <div class="portal-user-meta">
            <span id="portalUserName" class="portal-user-name">User</span>
            <span id="portalUserRole" class="portal-user-role">Role</span>
            <span id="portalUserEmail" class="portal-user-email">user@gmail.com</span>
          </div>
          <div class="portal-user-actions">
            <button class="portal-user-action-btn theme-toggle-btn" title="Toggle theme">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            </button>
            <button id="portalLogoutBtn" class="portal-user-action-btn" title="Sign out">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
              </svg>
            </button>
          </div>
        </div>

        <a href="/" class="portal-public-link" title="Open Public Website">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          <span class="portal-public-label">View Public Site ↗</span>
        </a>
      </div>
    </aside>

    <!-- Mobile Topbar for Admin Portal -->
    <header class="portal-mobile-topbar" id="portalMobileTopbar">
      <div class="portal-mobile-brand">
        <button id="portalMobileMenuBtn" class="portal-mobile-menu-btn" type="button" aria-label="Open portal navigation">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div style="display:flex; align-items:center; gap:0.55rem;">
          <img src="/assets/curiomas-no-bg.png" alt="CRII" style="width:26px; height:26px; object-fit:contain;">
          <span style="font-weight:700; font-size:0.98rem; color:var(--text-primary); letter-spacing:0.03em;">CRII PORTAL</span>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <button type="button" class="portal-icon-btn" onclick="openEmailComposer('', '', '', '')" title="Compose Email via curiomas.members@gmail.com" aria-label="Compose Email">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        </button>
        <button type="button" class="portal-icon-btn theme-toggle-btn" title="Toggle theme" aria-label="Toggle theme">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="portal-main">
      <!-- ====================================================================
           TAB 1: OVERVIEW
           ==================================================================== -->
      <div id="tab-overview" class="portal-tab-content">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Institute Operations Dashboard</h1>
            <p>Overview of publications, admissions queue, and open datasets.</p>
          </div>
          <div style="display:inline-flex; gap:0.6rem; align-items:center;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="openEmailComposer('', '', '', '')" title="Compose Email via curiomas.members@gmail.com" style="display:inline-flex; align-items:center; gap:0.4rem;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span>Compose Email</span>
            </button>
            <button class="btn btn-primary btn-sm" onclick="showTab('posts'); if (window.openBloggerEditor) openBloggerEditor(null);">
              <span>+ New Publication</span>
            </button>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-title">Published Papers</span>
              <svg class="metric-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
              </svg>
            </div>
            <div id="statPapers" class="metric-val">0</div>
            <div class="metric-desc">Available in open catalog</div>
          </div>

          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-title">Active Fellows</span>
              <svg class="metric-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
            </div>
            <div id="statInterns" class="metric-val">0</div>
            <div class="metric-desc">Engaged across 4 divisions</div>
          </div>

          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-title">Admissions Queue</span>
              <svg class="metric-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div id="statApps" class="metric-val" style="color: var(--accent-amber);">0</div>
            <div class="metric-desc">Pending committee review</div>
          </div>

          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-title">Open Datasets</span>
              <svg class="metric-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
            </div>
            <div id="statDatasets" class="metric-val">0</div>
            <div class="metric-desc">Open science formats</div>
          </div>
        </div>

        <!-- Quick Summary Box -->
        <div class="card" style="padding: 2rem;">
          <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--text-primary);">Security & Edge Operations Status</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
            CRII runs with Single Sign-On protection. Only verified emails configured in your 
            <a href="#" onclick="showTab('permissions'); return false;" style="font-weight: 600;">Access Control Whitelist</a> can authenticate.
            All client requests are strictly sanitized to prevent injection attacks and preserve reproducible data.
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm" onclick="showTab('interns')">Review Intern Applications →</button>
            <button class="btn btn-secondary btn-sm" onclick="showTab('permissions')">Manage Authorized Roster →</button>
            <button class="btn btn-glass btn-sm" onclick="showTab('settings')">Institute & Navbar Settings</button>
          </div>
        </div>
      </div>

      <!-- ====================================================================
           TAB 2: PUBLICATIONS & BLOG (Blogger.com Style Studio)
           ==================================================================== -->
      <div id="tab-posts" class="portal-tab-content" style="display:none;">
        
        <!-- 2A. DIRECTORY VIEW: Lists all existing publications -->
        <div id="postsDirectoryView">
          <div class="portal-topbar">
            <div class="portal-title-block">
              <h1>Research Publications & Dispatches</h1>
              <p>Curate peer-grade research papers, track revision history, and publish new dispatches.</p>
            </div>
            <button class="btn btn-primary" id="openNewPostEditorBtn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>+ Create New Publication</span>
            </button>
          </div>

          <!-- Filter & Search Toolbar -->
          <div class="data-table-card" style="padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap;">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn btn-sm btn-secondary active" id="filterPostsAll" onclick="filterPostsList('all')">All Articles</button>
              <button class="btn btn-sm btn-secondary" id="filterPostsPub" onclick="filterPostsList('published')">Published</button>
              <button class="btn btn-sm btn-secondary" id="filterPostsDraft" onclick="filterPostsList('draft')">Drafts</button>
            </div>
            <div style="min-width: 240px; flex: 1; max-width: 380px;">
              <input type="text" id="searchPostsInput" class="form-input" placeholder="Search by title, author, or keyword..." style="padding: 0.45rem 0.85rem; font-size: 0.85rem;">
            </div>
          </div>

          <!-- Existing Posts Table Card -->
          <div class="data-table-card">
            <div class="table-wrapper">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Article & Cover</th>
                    <th>Division</th>
                    <th>Last Revision & Author</th>
                    <th>Status</th>
                    <th style="text-align: right;">Actions</th>
                  </tr>
                </thead>
                <tbody id="portalPostsTbody"></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 2B. BLOGGER-STYLE FULL BLOCK PUBLISHER (Shown when creating or editing) -->
        <div id="postsEditorView" style="display: none;">
          <div class="blogger-editor-container">
            <!-- Topbar (Back, Title, Read time, Status, Save) -->
            <div class="blogger-topbar">
              <div class="blogger-topbar-left">
                <button type="button" class="btn btn-secondary btn-sm" id="bloggerBackBtn" title="Back to Publications Directory">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                  </svg>
                  <span>Back</span>
                </button>
                <input type="text" id="bloggerTitleInput" class="blogger-title-input" placeholder="Untitled Research Publication...">
              </div>

              <div class="blogger-topbar-right">
                <span id="bloggerReadTimeBadge" style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">1 min read</span>
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.openAiWriterModal('full_draft')" style="display:inline-flex; align-items:center; gap:0.35rem; border-color:rgba(234,88,12,0.45); color:#ea580c; background:rgba(234,88,12,0.08); font-weight:700;">
                  <span>✍ AI Writer</span>
                </button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.openAiImageStudio('thumbnail')" style="display:inline-flex; align-items:center; gap:0.35rem; border-color:rgba(234,88,12,0.4); color:#ea580c; background:rgba(234,88,12,0.06); font-weight:700;">
                  <span>✨ AI Image Studio</span>
                </button>
                <button type="button" id="bloggerStatusBtn" class="status-chip published" style="cursor: pointer; border: none; font-size: 0.78rem; padding: 0.3rem 0.75rem;">
                  Published
                </button>
                <button type="button" id="bloggerSaveBtn" class="btn btn-primary btn-sm" style="padding: 0.5rem 1.4rem;">
                  Save & Publish
                </button>
              </div>
            </div>

            <!-- Editor Sub-navigation Tabs -->
            <div class="blogger-tabs">
              <button type="button" class="blogger-tab-btn active" data-subtab="write">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                </svg>
                <span>Write</span>
              </button>
              <button type="button" class="blogger-tab-btn" data-subtab="details">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>Details & Cover</span>
              </button>
              <button type="button" class="blogger-tab-btn" data-subtab="preview">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <span>Live Preview</span>
              </button>
            </div>

            <!-- Tab 1: Write (Modular Blocks) -->
            <div id="bloggerPaneWrite" class="blogger-tab-pane">
              <div id="bloggerBlockStack" class="blogger-block-stack"></div>

              <!-- Add a Block trigger zone -->
              <div class="blogger-add-block-zone" id="bloggerOpenAddBlockBtn">
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: var(--accent-primary); font-weight: 600; font-size: 0.95rem;">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span>Add a Block</span>
                </div>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.3rem;">
                  Insert paragraph, heading, image, equation, code snippet, callout, table, or video
                </div>
              </div>
            </div>

            <!-- Tab 2: Details & Cover -->
            <div id="bloggerPaneDetails" class="blogger-tab-pane" style="display: none; max-width: 860px;">
              <div class="form-group" style="margin-bottom: 1.5rem;">
                <label class="form-label" for="bloggerCoverInput">Cover Image</label>
                <div style="display:flex; flex-direction:column; gap:0.5rem;">
                  <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                    <label class="btn btn-primary btn-sm" style="cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap; margin-bottom: 0; padding: 0.45rem 0.85rem;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span>Upload Image</span>
                      <input type="file" id="bloggerCoverFileInput" accept="image/*" style="display: none;" onchange="handleCoverFileUpload(event)">
                    </label>
                    <button type="button" class="btn btn-secondary btn-sm" id="bloggerCoverInput_urlBtn" onclick="window.toggleMediaUrlRow('bloggerCoverInput')" style="display:inline-flex; align-items:center; gap:0.35rem; white-space:nowrap;">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                      <span>URL</span>
                    </button>
                    <button type="button" class="btn btn-secondary btn-sm" onclick="window.openAiImageStudio('thumbnail')" style="display:inline-flex; align-items:center; gap:0.35rem; white-space:nowrap; border-color:rgba(234,88,12,0.45); color:#ea580c; background:rgba(234,88,12,0.08); font-weight:700;">
                      <span>✨ AI Generate Thumbnail</span>
                    </button>
                    <div id="bloggerCoverInput_preview" style="font-size:0.76rem; color:var(--text-muted); display:inline-flex; align-items:center; gap:0.45rem; min-width:0; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"></div>
                  </div>
                  <div id="bloggerCoverInput_urlWrap" style="display:none;">
                    <input type="text" id="bloggerCoverInput" class="form-input" style="width:100%;" placeholder="/assets/... or /api/images/... or https://..." oninput="window.syncMediaPreviewBadge('bloggerCoverInput')" onchange="window.syncMediaPreviewBadge('bloggerCoverInput')">
                  </div>
                </div>
                <div id="bloggerCoverUploadStatus" style="font-size: 0.78rem; margin-top: 0.35rem; display: none;"></div>
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap; font-size: 0.75rem;">
                  <span style="color: var(--text-muted); align-self: center;">Scientific Presets:</span>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="setBloggerCoverPreset('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80')">Space / Cosmos</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="setBloggerCoverPreset('https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80')">Ancient Biology</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="setBloggerCoverPreset('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80')">AI Neural Net</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="setBloggerCoverPreset('https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80')">Lab Microscopy</button>
                </div>
                <!-- Live Cover Preview Box -->
                <div id="bloggerCoverPreviewBox" style="margin-top: 0.85rem; height: 160px; border-radius: 10px; overflow: hidden; border: 1px solid var(--border-color); background: rgba(0,0,0,0.03); display: flex; align-items: center; justify-content: center;">
                  <span style="color: var(--text-muted); font-size: 0.82rem;">Cover preview will appear here</span>
                </div>
              </div>

              <!-- Spotlight Feature Toggle -->
              <div class="form-group" style="display: flex; align-items: center; gap: 0.75rem; background: rgba(234, 88, 12, 0.08); padding: 0.9rem 1.15rem; border-radius: 10px; border: 1.5px solid rgba(234, 88, 12, 0.25); margin-bottom: 1.5rem;">
                <input type="checkbox" id="bloggerFeaturedInput" style="width: 20px; height: 20px; accent-color: var(--accent-primary); cursor: pointer;">
                <div>
                  <label for="bloggerFeaturedInput" style="font-weight: 700; font-size: 0.94rem; color: var(--text-primary); cursor: pointer; display: block; margin: 0;">
                    ★ Spotlight as Featured Publication (Shows in Big Card on Homepage)
                  </label>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">
                    When enabled, this publication will take the large spotlight position in the "From the Institute" section on the homepage.
                  </span>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="bloggerCategoryInput">Scientific Division / Category / Sector *</label>
                  <input type="text" id="bloggerCategoryInput" list="bloggerCategoryDatalist" class="form-input" placeholder="Select or type new category/sector..." value="Space & Astrophysics">
                  <datalist id="bloggerCategoryDatalist">
                    <option value="Space & Astrophysics">
                    <option value="Ancient Biology & Paleontology">
                    <option value="AI & Computational Science">
                    <option value="Astrobiology & Extremophiles">
                    <option value="Quantum Biophysics">
                    <option value="Exoplanetary Atmospheres">
                    <option value="Evolutionary Genomics">
                    <option value="Open Methods">
                  </datalist>
                </div>
                <div class="form-group">
                  <label class="form-label" for="bloggerSlugInput">URL Slug / Permalink</label>
                  <input type="text" id="bloggerSlugInput" class="form-input" placeholder="e.g. the-last-dance">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="bloggerAuthorsInput">Authors & Contributors</label>
                  <input type="text" id="bloggerAuthorsInput" class="form-input" placeholder="e.g. Harun Abdullah Rakin, Aria Rahman">
                </div>
                <div class="form-group">
                  <label class="form-label" for="bloggerDoiInput">DOI Identifier</label>
                  <input type="text" id="bloggerDoiInput" class="form-input" placeholder="10.5281/crii.2026.xxxx">
                </div>
              </div>

              <div class="form-group">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.35rem;">
                  <label class="form-label" for="bloggerSummaryInput" style="margin:0;">Summary / Excerpt *</label>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="window.openAiWriterModal('abstract_tags', true)" style="font-size:0.74rem; border-color:rgba(234,88,12,0.4); color:#ea580c; background:rgba(234,88,12,0.06); font-weight:700;">✨ AI Auto-Generate Summary, Abstract & Tags</button>
                </div>
                <input type="text" id="bloggerSummaryInput" class="form-input" placeholder="Brief 1-2 sentence description for search and cards">
              </div>

              <div class="form-group">
                <label class="form-label" for="bloggerAbstractInput">Academic Abstract</label>
                <textarea id="bloggerAbstractInput" class="form-textarea" style="min-height: 80px;" placeholder="Formal scientific abstract..."></textarea>
              </div>

              <div class="form-group">
                <label class="form-label" for="bloggerTagsInput">Keywords / Tags (comma separated)</label>
                <input type="text" id="bloggerTagsInput" class="form-input" placeholder="Exoplanets, JWST, Deep Time">
              </div>
            </div>

            <!-- Tab 3: Live Reader Preview -->
            <div id="bloggerPanePreview" class="blogger-tab-pane" style="display: none;">
              <div id="bloggerReaderPreviewContainer" style="max-width: 820px; margin: 0 auto; background: var(--bg-surface); padding: 2rem; border-radius: 12px; border: 1px solid var(--border-color);"></div>
            </div>
          </div>
        </div>

      </div>

      
      <!-- =====================================================================
           TAB: RESEARCH DIVISIONS MANAGEMENT
           ===================================================================== -->
      <div id="tab-divisions" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Research Divisions Management</h1>
            <p>Create, edit, and organize the scientific research divisions displayed on the homepage and across the research repository.</p>
          </div>
          <button class="btn btn-primary" onclick="openDivisionModal()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>Add New Division</span>
          </button>
        </div>

        <div id="portalDivisionsList" class="divisions-manage-grid">
          <!-- Dynamically populated by portal.js -->
        </div>
      </div>

      <!-- =====================================================================
           TAB: WHO CAN JOIN US? (COHORT ADMISSIONS MANAGEMENT)
           ===================================================================== -->
      <div id="tab-cohorts" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Who Can Join Us? (Cohort Admissions)</h1>
            <p>Create, edit, and organize the admission and cohort profiles displayed on the homepage "Who can join us?" section.</p>
          </div>
          <button class="btn btn-primary" onclick="openCohortModal()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>Add New Profile</span>
          </button>
        </div>

        <div id="portalCohortsList" class="cohorts-manage-grid">
          <!-- Dynamically populated by portal.js -->
        </div>

        <!-- Fellowship Application Form Builder & Field Settings -->
        <div class="data-table-card" style="padding: 2rem; margin-top: 2rem;">
          <div class="portal-card-header" style="margin-bottom: 1.25rem;">
            <div class="portal-card-title-group">
              <h3 style="font-size: 1.15rem; font-weight: 700; display:flex; align-items:center; gap:0.5rem;">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
                <span>Fellowship Application Form Settings (team#apply)</span>
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
                Configure which fields appear on the fellowship application form, make any field optional or required, and add custom questions.
              </p>
            </div>
          </div>

          <form id="appFormSettingsForm" onsubmit="handleSaveAppFormSettings(event)">
            <!-- Application Status Master Toggle Card -->
            <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: 12px; padding: 1.4rem 1.6rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.15rem;">
                <div>
                  <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 0.65rem;">
                    <span>Fellowship Applications Status</span>
                    <span id="appStatusIndicator" class="portal-nav-badge" style="background: rgba(16,185,129,0.15); color: #10b981; font-weight: 700; font-size: 0.78rem;">Open (Accepting Submissions)</span>
                  </div>
                  <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
                    Toggle whether prospective researchers can apply on <code>/team#apply</code>. If turned off, a closed notice is shown instead of the application form.
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <label style="display: inline-flex; align-items: center; cursor: pointer; gap: 0.6rem; user-select: none; background: var(--bg-primary); padding: 0.5rem 1rem; border-radius: 9999px; border: 1px solid var(--border-color);">
                    <input type="checkbox" id="appFormIsOpen" checked onchange="window.handleToggleAppStatus(this.checked)" style="width: 18px; height: 18px; accent-color: #ea580c; cursor: pointer;">
                    <span style="font-weight: 700; font-size: 0.92rem; color: var(--text-primary);">Accepting Applications</span>
                  </label>
                </div>
              </div>

              <!-- Application Timeline Window (Start & Optional End Date) -->
              <div style="padding-top: 1.15rem; border-top: 1px solid var(--border-color); margin-bottom: 1.15rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.85rem;">
                  <div>
                    <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ea580c" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span>Cohort Application Timeline & Deadlines</span>
                    </div>
                    <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
                      Set when fellowship submissions open and an optional deadline. Candidates on <code>/team#apply</code> will see the active window and countdown. If the end date has passed, applications automatically close and display when the window concluded so candidates get a track of time.
                    </div>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
                  <div>
                    <label class="form-label" for="appFormStartDate" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Application Start Date</label>
                    <input type="date" id="appFormStartDate" class="form-input" style="font-size: 0.88rem;">
                    <div style="display: flex; gap: 0.4rem; margin-top: 0.35rem;">
                      <button type="button" class="btn btn-xs btn-secondary" onclick="document.getElementById('appFormStartDate').value = new Date().toISOString().split('T')[0]">Set Today</button>
                      <button type="button" class="btn btn-xs btn-secondary" onclick="document.getElementById('appFormStartDate').value = ''">Clear</button>
                    </div>
                  </div>

                  <div>
                    <label class="form-label" for="appFormEndDate" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Application End Date (Optional Deadline)</label>
                    <input type="date" id="appFormEndDate" class="form-input" style="font-size: 0.88rem;">
                    <div style="display: flex; gap: 0.4rem; margin-top: 0.35rem;">
                      <button type="button" class="btn btn-xs btn-secondary" onclick="const d = new Date(); d.setDate(d.getDate() + 30); document.getElementById('appFormEndDate').value = d.toISOString().split('T')[0];">+30 Days</button>
                      <button type="button" class="btn btn-xs btn-secondary" onclick="const d = new Date(); d.setDate(d.getDate() + 60); document.getElementById('appFormEndDate').value = d.toISOString().split('T')[0];">+60 Days</button>
                      <button type="button" class="btn btn-xs btn-secondary" onclick="document.getElementById('appFormEndDate').value = ''">No Deadline (Rolling)</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Closed Message Notice -->
              <div id="appClosedMessageContainer" style="display: none; padding-top: 1rem; border-top: 1px solid var(--border-color); margin-bottom: 1rem;">
                <label class="form-label" for="appFormClosedMessage" style="font-weight: 600; font-size: 0.88rem; margin-bottom: 0.4rem; display: block;">Message to Display When Applications Are Closed:</label>
                <textarea id="appFormClosedMessage" class="form-textarea" rows="2" style="font-size: 0.9rem;" placeholder="e.g. Applications for the current fellowship cohort are currently closed. Follow our updates for announcements regarding the next cohort."></textarea>
              </div>

              <!-- Curiosity Gateway Toggle -->
              <div style="padding-top: 1rem; border-top: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
                <div>
                  <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);">Interactive Curiosity Discovery Gateway</div>
                  <div style="font-size: 0.82rem; color: var(--text-muted);">Asks for candidate identity first, animates research track matching, then reveals the personalized dossier.</div>
                </div>
                <label style="display: inline-flex; align-items: center; cursor: pointer; gap: 0.5rem;">
                  <input type="checkbox" id="appFormCuriosityGateway" checked style="width: 17px; height: 17px; accent-color: #ea580c; cursor: pointer;">
                  <span style="font-size: 0.86rem; font-weight: 600; color: var(--text-secondary);">Enable Interactive Curiosity Flow</span>
                </label>
              </div>
            </div>

            <!-- Standard Form Fields Toggles -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div class="form-group" style="background:var(--bg-secondary); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
                <div style="font-weight:600; margin-bottom:0.4rem;">University / Institution</div>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; margin-bottom:0.3rem; cursor:pointer;">
                  <input type="checkbox" id="fieldVis_university" checked> Show field
                </label>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; cursor:pointer;">
                  <input type="checkbox" id="fieldReq_university" checked> Required
                </label>
              </div>

              <div class="form-group" style="background:var(--bg-secondary); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
                <div style="font-weight:600; margin-bottom:0.4rem;">Field of Study / Major</div>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; margin-bottom:0.3rem; cursor:pointer;">
                  <input type="checkbox" id="fieldVis_fieldOfStudy" checked> Show field
                </label>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; cursor:pointer;">
                  <input type="checkbox" id="fieldReq_fieldOfStudy" checked> Required
                </label>
              </div>

              <div class="form-group" style="background:var(--bg-secondary); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
                <div style="font-weight:600; margin-bottom:0.4rem;">Preferred Research Division</div>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; margin-bottom:0.3rem; cursor:pointer;">
                  <input type="checkbox" id="fieldVis_division" checked> Show field (Dynamic Real Divisions)
                </label>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; cursor:pointer;">
                  <input type="checkbox" id="fieldReq_division" checked> Required
                </label>
              </div>

              <div class="form-group" style="background:var(--bg-secondary); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
                <div style="font-weight:600; margin-bottom:0.4rem;">Academic Level / Grade</div>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; margin-bottom:0.3rem; cursor:pointer;">
                  <input type="checkbox" id="fieldVis_academicLevel" checked> Show field (Dynamic Cohorts)
                </label>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; cursor:pointer;">
                  <input type="checkbox" id="fieldReq_academicLevel"> Required
                </label>
              </div>

              <div class="form-group" style="background:var(--bg-secondary); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
                <div style="font-weight:600; margin-bottom:0.4rem;">Portfolio / GitHub / ORCID</div>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; margin-bottom:0.3rem; cursor:pointer;">
                  <input type="checkbox" id="fieldVis_portfolio" checked> Show field
                </label>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; cursor:pointer;">
                  <input type="checkbox" id="fieldReq_portfolio"> Required
                </label>
              </div>

              <div class="form-group" style="background:var(--bg-secondary); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
                <div style="font-weight:600; margin-bottom:0.4rem;">Statement of Intent</div>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; margin-bottom:0.3rem; cursor:pointer;">
                  <input type="checkbox" id="fieldVis_statement" checked> Show field
                </label>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; cursor:pointer;">
                  <input type="checkbox" id="fieldReq_statement" checked> Required
                </label>
              </div>

              <div class="form-group" style="background:rgba(234,88,12,0.04); padding:1rem; border-radius:8px; border:1px solid rgba(234,88,12,0.22);">
                <div style="font-weight:600; margin-bottom:0.4rem; color:#ea580c;">Unique Email Enforcement</div>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; cursor:pointer;">
                  <input type="checkbox" id="appFormUniqueEmail" style="accent-color:#ea580c;"> Auto-check & block duplicate emails live
                </label>
              </div>
            </div>

            <div style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.75rem;">
                <div>
                  <h4 style="font-weight:600; margin-bottom:0.25rem;">Custom Questions & Dynamic Fields</h4>
                  <p style="font-size:0.8rem; color:var(--text-muted);">Supports Text, Long Answer, Number, ID Number, Rating (1-5 Stars), Image, Profile Photo (PFP), Video, URL, Email, Phone, Date, Dropdown, and Agreement Checkbox. Enable <strong>Unique</strong> on any field to auto-verify duplicates live against Cloudflare D1.</p>
                </div>
                <button type="button" class="btn btn-primary btn-sm" onclick="addCustomFormFieldRow()">
                  + Add Custom Field
                </button>
              </div>

              <div id="customFieldsBuilderList" style="display:flex; flex-direction:column; gap:0.85rem;"></div>
            </div>

            <div style="margin-top: 1.5rem; text-align:right;">
              <button type="submit" class="btn btn-primary" style="padding: 0.65rem 1.75rem;">
                Save Form Settings & Questions
              </button>
            </div>
          </form>
        </div>
      </div>

      <div id="tab-recruit" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Student Fees, Packages & Recruit Pages</h1>
            <p>Configure fellowship fee tiers, benefits packages, and launch custom recruitment landing pages with embedded live applications.</p>
          </div>
          <div style="display:flex; gap:0.65rem; flex-wrap:wrap;">
            <a href="/recruit" target="_blank" class="btn btn-secondary btn-sm" style="display:inline-flex; align-items:center; gap:0.35rem; text-decoration:none;">
              <span>View /recruit Directory</span>
            </a>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.openPackageModal()">
              + Add Fee / Package Tier
            </button>
            <button type="button" class="btn btn-primary btn-sm" onclick="window.openRecruitPageModal()">
              + Create Recruit Page
            </button>
          </div>
        </div>

        <div class="data-table-card" style="padding:1.5rem; margin-bottom:2rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.75rem;">
            <div>
              <h3 style="margin:0 0 0.25rem; font-size:1.15rem; font-weight:700; color:var(--text-primary);">Student Fees & Fellowship Packages</h3>
              <p style="margin:0; font-size:0.84rem; color:var(--text-muted);">Create Free or Paid student tracks with custom currency, benefits checklists, and payment instructions shown on /team#apply and Recruit Pages.</p>
            </div>
            <button type="button" class="btn btn-primary btn-sm" onclick="window.openPackageModal()">+ New Package</button>
          </div>
          <div id="packagesManageGrid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(290px, 1fr)); gap:1.25rem;"></div>
        </div>

        <div class="data-table-card" style="padding:1.5rem; margin-bottom:2rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.75rem;">
            <div>
              <h3 style="margin:0 0 0.25rem; font-size:1.15rem; font-weight:700; color:var(--text-primary);">Custom Recruit Landing Pages</h3>
              <p style="margin:0; font-size:0.84rem; color:var(--text-muted);">Build dedicated recruitment campaign pages (e.g. /recruit?page=summer-2026) with hero media, benefits cards, attached packages, and instant application forms.</p>
            </div>
            <button type="button" class="btn btn-primary btn-sm" onclick="window.openRecruitPageModal()">+ New Recruit Page</button>
          </div>
          <div id="recruitPagesManageGrid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.25rem;"></div>
        </div>
      </div>

      <!-- ====================================================================
           TAB: TEAM & FELLOWS ROSTER (Manage Interns & Core Team)
           ==================================================================== -->
      <div id="tab-roster" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Institute Roster & Core Team Management</h1>
            <p>Manage real core team members, student research fellows, profile photos, bios, roles, and socials.</p>
          </div>
          <button class="btn btn-primary" id="openAddResearcherBtn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>Add Researcher / Fellow</span>
          </button>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="data-table-card" style="padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap;">
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn btn-sm btn-secondary active" id="filterRosterAll" onclick="filterRosterList('all')">All Roster</button>
            <button class="btn btn-sm btn-secondary" id="filterRosterTeam" onclick="filterRosterList('team')">Core Leadership Team</button>
            <button class="btn btn-sm btn-secondary" id="filterRosterFellows" onclick="filterRosterList('fellows')">Research Fellows & Interns</button>
          </div>
          <div style="min-width: 240px; flex: 1; max-width: 360px;">
            <input type="text" id="searchRosterInput" class="form-input" placeholder="Search by name, role, or division..." style="padding: 0.45rem 0.85rem; font-size: 0.85rem;">
          </div>
        </div>

        <!-- Roster Cards Grid -->
        <div id="rosterCardsGrid" class="roster-grid"></div>
      </div>

      <!-- ====================================================================
           TAB 3: ADMISSIONS QUEUE
           ==================================================================== -->
      <div id="tab-interns" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Student Fellowship Admissions Queue</h1>
            <p>Review incoming student applications, evaluate statements, and enroll candidates.</p>
          </div>
        </div>

        <div class="data-table-card">
          <div class="table-toolbar">
            <h3 style="font-size: 1.15rem; color: var(--text-primary);">Incoming Applicants</h3>
          </div>
          <div class="table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Institution & Field</th>
                  <th>Preferred Division</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="portalAppsTbody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ====================================================================
           TAB 4: OPEN DATASETS
           ==================================================================== -->
      <div id="tab-datasets" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Open Datasets Repository Manager</h1>
            <p>Publish and curate reproducible scientific datasets for public download.</p>
          </div>
        </div>

        <!-- Add Dataset Form -->
        <div class="data-table-card" style="padding: 2rem; margin-bottom: 2rem;">
          <h3 style="font-size: 1.25rem; margin-bottom: 1.25rem; color: var(--text-primary);">Register New Dataset</h3>

          <form id="newDatasetForm">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="dsTitleInput">Dataset Title *</label>
                <input type="text" id="dsTitleInput" class="form-input" placeholder="e.g. Atmospheric Transmission Spectra Library" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="dsCategoryInput">Division *</label>
                <select id="dsCategoryInput" class="form-select" required>
                  <option value="Space & Astrophysics">Space & Astrophysics</option>
                  <option value="Ancient Biology & Paleontology">Ancient Biology & Paleontology</option>
                  <option value="AI & Computational Science">AI & Computational Science</option>
                  <option value="Astrobiology & Extremophiles">Astrobiology & Extremophiles</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="dsLeadInput">Lead Student Researcher *</label>
                <input type="text" id="dsLeadInput" class="form-input" placeholder="e.g. Aria Rahman" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="dsFormatInput">Format & Size</label>
                <div style="display:flex; gap:0.5rem;">
                  <input type="text" id="dsFormatInput" class="form-input" placeholder="CSV & HDF5">
                  <input type="text" id="dsSizeInput" class="form-input" placeholder="42.8 MB">
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="dsVersionInput">Version & License</label>
                <div style="display:flex; gap:0.5rem;">
                  <input type="text" id="dsVersionInput" class="form-input" placeholder="v1.0.0">
                  <input type="text" id="dsLicenseInput" class="form-input" placeholder="CC-BY 4.0 Open Science">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="dsParamsInput">Tracked Features (comma separated)</label>
                <input type="text" id="dsParamsInput" class="form-input" placeholder="Wavelength, Transit Depth, Flux Uncertainty">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="dsDescInput">Description & Calibration Notes *</label>
              <textarea id="dsDescInput" class="form-textarea" placeholder="Detail simulation parameters, observational instruments, and soft bounds..." required></textarea>
            </div>

            <div style="text-align: right;">
              <button type="submit" class="btn btn-primary" style="padding: 0.8rem 2.2rem;">
                Publish Dataset
              </button>
            </div>
          </form>
        </div>

        <div class="data-table-card">
          <div class="table-toolbar">
            <h3 style="font-size: 1.15rem; color: var(--text-primary);">Active Datasets</h3>
          </div>
          <div class="table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Dataset</th>
                  <th>Division</th>
                  <th>Version</th>
                  <th>Lead Researcher</th>
                  <th>License</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="portalDatasetsTbody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ====================================================================
           TAB 5: ACCESS CONTROL & PERMISSIONS (AUTZ WHITELIST)
           ==================================================================== -->
      <div id="tab-permissions" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Institute Access Control & Permissions</h1>
            <p>Strictly control which verified email accounts have permission to access the management portal.</p>
          </div>
        </div>

        <!-- Add Allowed Email Card -->
        <div class="data-table-card" style="padding: 2rem; margin-bottom: 2rem;">
          <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-primary);">Authorize New Account</h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
            When this user signs in with their email, they will be granted portal access with the specified role.
          </p>

          <form id="addAllowedUserForm">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="newAllowedEmail">Verified Gmail / Email *</label>
                <input type="email" id="newAllowedEmail" class="form-input" placeholder="colleague@gmail.com" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="newAllowedName">Full Name *</label>
                <input type="text" id="newAllowedName" class="form-input" placeholder="e.g. Dr. Jane Smith" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="newAllowedRole">Portal Permission Role *</label>
                <select id="newAllowedRole" class="form-select" required>
                  <option value="Research Fellow">Research Fellow (Publish Papers & View Data)</option>
                  <option value="Intern Coordinator">Intern Coordinator (Review & Accept Admissions)</option>
                  <option value="Institute Admin">Institute Admin (Full Management)</option>
                  <option value="Super Admin">Super Admin (All Privileges)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="newAllowedDivision">Assigned Division</label>
                <select id="newAllowedDivision" class="form-select">
                  <option value="Executive Council">Executive Council</option>
                  <option value="Astrophysics & Space Science">Astrophysics & Space Science</option>
                  <option value="Ancient Biology & Paleontology">Ancient Biology & Paleontology</option>
                  <option value="AI & Computational Science">AI & Computational Science</option>
                  <option value="Astrobiology & Extremophiles">Astrobiology & Extremophiles</option>
                </select>
              </div>
            </div>

            <div style="text-align: right; margin-top: 1rem;">
              <button type="submit" class="btn btn-primary" style="padding: 0.75rem 2rem;">
                Add to Whitelist
              </button>
            </div>
          </form>
        </div>

        <!-- Whitelist Table -->
        <div class="data-table-card">
          <div class="table-toolbar">
            <h3 style="font-size: 1.15rem; color: var(--text-primary);">Authorized Users Whitelist</h3>
          </div>
          <div class="table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>User & Email</th>
                  <th>Permission Role</th>
                  <th>Division</th>
                  <th>Added Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="allowedUsersTbody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ====================================================================
           TAB 6: INSTITUTE & APPEARANCE SETTINGS
           ==================================================================== -->
      
      <!-- ====================================================================
           TAB: RESEARCHER CUSTOM EMAILS (IMPROVMX)
           ==================================================================== -->
      <div id="tab-aliases" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Researcher Custom Emails & Forwarding</h1>
            <p>Provide and manage custom verified @domain email aliases for institute researchers, forwarding seamlessly to their personal Gmail accounts via ImprovMX.</p>
          </div>
          <div style="display: flex; gap: 0.65rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary btn-sm" id="openManageKeysBtn" onclick="window.openManageKeysModal()" title="Manage ImprovMX API Keys">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              <span>API Keys & Accounts</span>
            </button>
            <button type="button" class="btn btn-secondary btn-sm" id="refreshAliasesBtn" onclick="window.refreshAliasesData()" title="Sync ImprovMX status">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
              <span>Refresh Status</span>
            </button>
            <button type="button" class="btn btn-primary" id="openCreateAliasBtn" onclick="window.openProvisionAliasModal()">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Provision Email Alias</span>
            </button>
          </div>
        </div>

        <!-- Domain Overview & Health Stats -->
        <div class="portal-grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
          <!-- Active Domain Card -->
          <div class="card" style="padding: 1.25rem;">
            <div style="font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700; margin-bottom: 0.4rem;">
              Active Domain Scope
            </div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <select id="improvmxDomainSelect" class="form-input" style="padding: 0.4rem 0.65rem; font-weight: 600; font-size: 0.92rem;"></select>
            </div>
            <div id="improvmxAccountEmail" style="font-size: 0.74rem; color: var(--text-muted); margin-top: 0.45rem;">
              Connected via ImprovMX
            </div>
          </div>

          <!-- DNS MX Health Card -->
          <div class="card" style="padding: 1.25rem;">
            <div style="font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700; margin-bottom: 0.4rem;">
              Mail Exchange (MX) Status
            </div>
            <div id="improvmxMxStatus">
              <span class="status-chip published">✓ MX Records Active</span>
            </div>
            <div id="improvmxMxDetails" style="font-size: 0.74rem; color: var(--text-muted); margin-top: 0.45rem;">
              Relaying mail via ImprovMX clusters
            </div>
          </div>

          <!-- SPF / Delivery Health Card -->
          <div class="card" style="padding: 1.25rem;">
            <div style="font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700; margin-bottom: 0.4rem;">
              SPF & DMARC Status
            </div>
            <div id="improvmxSpfStatus">
              <span class="status-chip published">✓ SPF Valid</span>
            </div>
            <div id="improvmxSpfDetails" style="font-size: 0.74rem; color: var(--text-muted); margin-top: 0.45rem;">
              v=spf1 include:spf.improvmx.com ~all
            </div>
          </div>

          <!-- Plan Quota Card -->
          <div class="card" style="padding: 1.25rem;">
            <div style="font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700; margin-bottom: 0.4rem;">
              Aliases Allocation
            </div>
            <div style="display: flex; align-items: baseline; gap: 0.5rem;">
              <span id="improvmxAliasCount" style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">0</span>
              <span id="improvmxAliasLimit" style="font-size: 0.9rem; color: var(--text-muted);">/ 25 Used</span>
            </div>
            <div id="improvmxPlanTier" style="font-size: 0.74rem; color: var(--accent-primary, #ea580c); font-weight: 600; margin-top: 0.35rem;">
              ImprovMX Free Tier
            </div>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="data-table-card portal-filter-card" style="margin-bottom: 1.25rem;">
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Filter:</span>
            <button type="button" class="btn btn-sm btn-secondary active" id="filterAliasesAll" onclick="window.filterAliasesList('all')">All Aliases</button>
            <button type="button" class="btn btn-sm btn-secondary" id="filterAliasesFellows" onclick="window.filterAliasesList('fellows')">Verified Fellows</button>
            <button type="button" class="btn btn-sm btn-secondary" id="filterAliasesCustom" onclick="window.filterAliasesList('custom')">Catch-all / Other</button>
          </div>
          <div style="min-width: 220px; flex: 1; max-width: 400px;">
            <input type="text" id="searchAliasesInput" class="form-input" placeholder="Search by alias or destination Gmail..." style="padding: 0.45rem 0.85rem; font-size: 0.85rem;">
          </div>
        </div>

        <!-- Aliases Table & Mobile Cards -->
        <div class="data-table-card">
          <!-- Desktop Table -->
          <div class="table-wrapper portal-aliases-desktop-table">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Custom Email Alias</th>
                  <th>Forward Destination (Gmail)</th>
                  <th>Assigned Fellow / Scope</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th style="text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody id="improvmxAliasesTbody">
                <tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">Loading email aliases...</td></tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards Grid -->
          <div id="improvmxAliasesMobileGrid" class="portal-aliases-mobile-grid"></div>
        </div>
      </div>

      <div id="tab-settings" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Institute & Appearance Settings</h1>
            <p>Configure the homepage hero video, backdrop blur, overlay darkness, navbar title, and single sign-on settings.</p>
          </div>
        </div>

        <div class="portal-settings-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 1.5rem; max-width: 1040px; width: 100%;">
          <!-- 1. Hero Section Appearance, Multi-Image Background & Typography Engine -->
          <div class="data-table-card" style="padding: 2rem;">
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-primary);">Hero Section Appearance & Engine</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
              Customize the hero title font family, configure a pool of background images (a random one displays on load), and set opacity.
            </p>

            <form id="heroAppearanceForm">

              <!-- Hero Media Display & Selection Options -->
              <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div class="form-group">
                  <label class="form-label" for="settingHeroMediaType" style="font-weight: 600;">Media Display Type</label>
                  <select id="settingHeroMediaType" class="form-input">
                    <option value="both">Video + Image (Mixed)</option>
                    <option value="image">Image Only</option>
                    <option value="video">Video Only</option>
                  </select>
                  <span style="font-size: 0.72rem; color: var(--text-muted); display: block; margin-top: 0.25rem;">
                    Display background images, ambient video, or both.
                  </span>
                </div>
                <div class="form-group">
                  <label class="form-label" for="settingHeroSelectionMode" style="font-weight: 600;">Selection Behavior</label>
                  <select id="settingHeroSelectionMode" class="form-input">
                    <option value="random">Random on Load (Shuffles on each reload)</option>
                    <option value="fixed">Fixed (Always show selected / pinned media)</option>
                  </select>
                  <span style="font-size: 0.72rem; color: var(--text-muted); display: block; margin-top: 0.25rem;">
                    Random rotates on visit; Fixed shows the chosen pinned one.
                  </span>
                </div>
              </div>

              <!-- Font Selection -->
              <div class="form-group" style="margin-bottom: 1.5rem;">
                <label class="form-label" for="settingHeroFontFamily">Hero Title Font Family</label>
                <select id="settingHeroFontFamily" class="form-input">
                  <option value="Eyekons">Eyekons (Modern Tech Display - Default)</option>
                  <option value="Playfair Display">Playfair Display (Editorial Serif)</option>
                  <option value="Cinzel Decorative">Cinzel Decorative (Classical Royal / Sci-Fi)</option>
                  <option value="Space Grotesk">Space Grotesk (Tech Monospace-Feel)</option>
                  <option value="Syne">Syne (Geometric Avant-Garde)</option>
                  <option value="Outfit">Outfit (Ultra-Clean Geometric Sans)</option>
                  <option value="system-ui">System Sans (Clean Neutral Sans)</option>
                </select>
                <span style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-top: 0.3rem;">
                  Controls the primary headline typography on the homepage hero section.
                </span>
              </div>

              <!-- Multi-Image Background Pool -->
              <div class="form-group" style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                  <label class="form-label" style="margin: 0;">Background Images Pool (Random on Load)</label>
                  <span id="heroImagesCountBadge" style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 700;">0 Images</span>
                </div>
                <p style="font-size: 0.74rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                  Every time a visitor opens or reloads the homepage, one image is randomly selected from this pool.
                </p>

                <!-- Thumbnail Grid -->
                <div id="heroImagesListContainer" class="hero-images-manage-grid">
                  <!-- Rendered dynamically via JS -->
                </div>

                
                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
                  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                    <input type="file" id="heroImageUploadInput" accept="image/*" style="display: none;" onchange="handleHeroImageUpload(event)">
                    <button type="button" class="btn btn-primary btn-sm" onclick="document.getElementById('heroImageUploadInput').click()" style="white-space: nowrap; display: inline-flex; align-items: center; gap: 0.35rem;">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span>Upload Image</span>
                    </button>
                    <button type="button" class="btn btn-secondary btn-sm" id="newHeroImageUrl_urlBtn" onclick="window.toggleMediaUrlRow('newHeroImageUrl')" style="white-space: nowrap; display: inline-flex; align-items: center; gap: 0.35rem;">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                      <span>URL</span>
                    </button>
                  </div>
                  <div id="newHeroImageUrl_urlWrap" style="display: none;">
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                      <input type="text" id="newHeroImageUrl" class="form-input" placeholder="Paste image URL or server path (/assets/... or /api/images/...)" style="flex: 1; min-width: 180px;">
                      <button type="button" class="btn btn-secondary btn-sm" onclick="addHeroImageFromInput()" style="white-space: nowrap; padding: 0.5rem 1rem;">+ Add URL</button>
                    </div>
                  </div>
                </div>
                <div id="heroImageUploadStatus" style="font-size: 0.75rem; color: var(--accent-primary); margin-top: 0.35rem; display: none;"></div>


                <!-- Quick Presets -->
                <div style="display: flex; gap: 0.4rem; margin-top: 0.6rem; flex-wrap: wrap; font-size: 0.72rem;">
                  <span style="color: var(--text-muted); align-self: center;">Quick Presets:</span>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="addHeroImagePreset('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=85')">+ Deep Stars</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="addHeroImagePreset('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=85')">+ Earth Blue</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="addHeroImagePreset('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=85')">+ Cosmos Glow</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="addHeroImagePreset('https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=85')">+ Orbit View</button>
                </div>
              </div>

              <!-- Image Opacity Slider -->
              <div class="form-group" style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                  <label class="form-label" for="settingHeroImageOpacity" style="margin: 0;">Background Image Visibility (Opacity)</label>
                  <span id="heroImageOpacityValueBadge" style="font-weight: 700; color: var(--accent-primary); font-size: 0.88rem;">40%</span>
                </div>
                <input type="range" id="settingHeroImageOpacity" min="10" max="90" step="5" value="40" style="width: 100%; accent-color: var(--accent-primary);">
                <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted);">
                  <span>10% (Subtle Glow)</span>
                  <span>40% (Balanced)</span>
                  <span>90% (Vivid Photo)</span>
                </div>
              </div>

              <!-- Multi-Video Background Pool -->
              <div class="form-group" style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                  <label class="form-label" style="margin: 0; font-weight: 600;">Background Videos Pool</label>
                  <span id="heroVideosCountBadge" style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 700;">0 Videos</span>
                </div>
                <p style="font-size: 0.74rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                  When Video mode is active, one video is played (randomly on visit, or the pinned ★ video). While the video is buffering, a random image is displayed and smoothly fades out once the video begins.
                </p>

                <!-- Video Chips Grid -->
                <div id="heroVideosListContainer" class="hero-videos-manage-grid">
                  <!-- Rendered dynamically via JS -->
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
                  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                    <input type="file" id="heroVideoUploadInput" accept="video/mp4,video/webm" style="display: none;" onchange="handleHeroVideoUpload(event)">
                    <button type="button" class="btn btn-primary btn-sm" onclick="document.getElementById('heroVideoUploadInput').click()" style="white-space: nowrap; display: inline-flex; align-items: center; gap: 0.35rem;">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span>Upload Video</span>
                    </button>
                    <button type="button" class="btn btn-secondary btn-sm" id="newHeroVideoUrl_urlBtn" onclick="window.toggleMediaUrlRow('newHeroVideoUrl')" style="white-space: nowrap; display: inline-flex; align-items: center; gap: 0.35rem;">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                      <span>URL</span>
                    </button>
                  </div>
                  <div id="newHeroVideoUrl_urlWrap" style="display: none;">
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                      <input type="text" id="newHeroVideoUrl" class="form-input" placeholder="Paste video URL or server path (assets/hero-bg.mp4 or /api/images/...)" style="flex: 1; min-width: 180px;">
                      <button type="button" class="btn btn-secondary btn-sm" onclick="addHeroVideoFromInput()" style="white-space: nowrap; padding: 0.5rem 1rem;">+ Add Video URL</button>
                    </div>
                  </div>
                </div>
                <div id="heroVideoUploadStatus" style="font-size: 0.75rem; color: var(--accent-primary); margin-top: 0.35rem; display: none;"></div>

                <!-- Quick Video Presets -->
                <div style="display: flex; gap: 0.4rem; margin-top: 0.6rem; flex-wrap: wrap; font-size: 0.72rem;">
                  <span style="color: var(--text-muted); align-self: center;">Quick Video Presets:</span>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="addHeroVideoPreset('assets/hero-bg.mp4')">+ Local Cosmos</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="addHeroVideoPreset('https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4')">+ Deep Stars</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="addHeroVideoPreset('https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-starfield-in-space-41539-large.mp4')">+ Starfield Warp</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="addHeroVideoPreset('https://assets.mixkit.co/videos/preview/mixkit-planet-earth-rotating-in-space-39982-large.mp4')">+ Earth Orbit</button>
                </div>
              </div>

              <!-- Video Sound / Audio Option -->
              <div class="form-group" style="margin-bottom: 1.5rem; background: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.20); border-radius: 12px; padding: 1rem 1.25rem;">
                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; margin: 0; font-weight: 700; color: var(--text-primary);">
                  <input type="checkbox" id="settingHeroSoundEnabled" style="width: 18px; height: 18px; accent-color: var(--accent-primary);">
                  <span>Enable Video Audio (Sound Support)</span>
                </label>
                <p style="font-size: 0.74rem; color: var(--text-muted); margin: 0.35rem 0 0 2rem;">
                  Allows visitors to hear video soundtrack. Videos start muted to comply with browser autoplay policies, with an interactive sound toggle pill that automatically un-mutes on user interaction.
                </p>
              </div>

              <!-- Blur & Overlay Settings -->
              <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div class="form-group">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                    <label class="form-label" for="settingHeroBlur" style="margin: 0;">Backdrop Blur</label>
                    <span id="heroBlurValueBadge" style="font-weight: 700; color: var(--accent-primary); font-size: 0.88rem;">12px</span>
                  </div>
                  <input type="range" id="settingHeroBlur" min="0" max="30" step="1" value="12" style="width: 100%; accent-color: var(--accent-primary);">
                </div>
                <div class="form-group">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                    <label class="form-label" for="settingHeroOverlay" style="margin: 0;">Overlay Darkness</label>
                    <span id="heroOverlayValueBadge" style="font-weight: 700; color: var(--accent-primary); font-size: 0.88rem;">55%</span>
                  </div>
                  <input type="range" id="settingHeroOverlay" min="10" max="90" step="5" value="55" style="width: 100%; accent-color: var(--accent-primary);">
                </div>
              </div>

              <!-- Real-time Live Preview of Hero Font & Background Image -->
              <div style="margin-top: 1.5rem;">
                <label class="form-label">Live Hero Preview</label>
                <div id="heroLivePreviewStage" class="hero-preview-stage" style="background-image: url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80'); background-size: cover; background-position: center; min-height: 140px; border-radius: 8px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                  <div id="heroLivePreviewOverlay" class="hero-preview-overlay" style="position: absolute; inset: 0; background: rgba(5, 7, 15, 0.40); display: flex; align-items: center; justify-content: center;">
                    <div style="text-align: center; padding: 1.5rem; position: relative; z-index: 2;">
                      <div id="heroLivePreviewTitle" style="font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; font-family: 'Eyekons', sans-serif; color: #ffffff;">
                        Bring structure<br>to your research.
                      </div>
                      <div style="font-size: 0.75rem; opacity: 0.85; margin-top: 0.4rem; color: #e2e8f0;">
                        Turning Curiosity into Action.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style="margin-top: 1.5rem; text-align: right;">
                <button type="submit" class="btn btn-primary" style="padding: 0.75rem 2rem;">
                  Save Hero Settings
                </button>
              </div>
            </form>
          </div>

          <!-- 2. Institute Branding & Navbar Settings -->
          <div class="data-table-card" style="padding: 2rem;">
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-primary);">Branding & Navbar</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
              Customize title text, logo emblem, and single sign-on app credentials.
            </p>

            <form id="instituteSettingsForm">
              <div class="form-group">
                <label class="form-label" for="settingNavbarTitle">Navbar Title *</label>
                <input type="text" id="settingNavbarTitle" class="form-input" required>
                <span style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.2rem;">
                  Default: <strong>Curiomas Research & Innovation Institute</strong>
                </span>
              </div>

              <div class="form-group">
                <label class="form-label" for="settingLogoUrl">Institute Logo Image (Optional)</label>
                ${renderMediaPickerField({ id: 'settingLogoUrl', accept: 'image/*', uploadLabel: 'Upload Logo', placeholder: 'Paste logo URL or server path (/assets/curiomas-no-bg.png)' })}
                <span style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.2rem;">
                  Replaces the default quantum vector emblem in the navbar.
                </span>
              </div>

              <div class="form-group">
                <label class="form-label" for="settingAutzAppId">Single Sign-On App ID</label>
                <input type="text" id="settingAutzAppId" class="form-input" placeholder="gqiqh6qia">
                <span style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.2rem;">
                  Registered application identifier for institute Single Sign-On.
                </span>
              </div>

              <div style="margin-top: 1.75rem; text-align: right;">
                <button type="submit" class="btn btn-primary" style="padding: 0.75rem 2rem;">
                  Save Branding
                </button>
              </div>
            </form>
          </div>

          <!-- 3. Festive Themes & Seasonal Effects Engine -->
          <div class="data-table-card" style="padding: 2rem;">
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
              <span>🎨</span>
              <span>Festive Themes & Global Seasonal Effects</span>
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
              Enable celebratory, vibrant themes behind website content sections. Managed exclusively by administrators to effect all visitors globally.
            </p>

            <form id="festiveSettingsForm">
              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label class="form-label" for="settingFestiveTheme">Active Festive Theme</label>
                <select id="settingFestiveTheme" class="form-input">
                  <option value="holi">🎨 Holi (Festival of Colors & Multi-Color Paint Splatters)</option>
                  <option value="christmas">❄️ Christmas (Winter Snowfall, Frost & Pine Gold Glow)</option>
                  <option value="cherry-blossom">🌸 Cherry Blossom (Sakura Petals & Spring Rose Aura)</option>
                  <option value="eid">🌙 Eid (Crescent Moon, Golden Stars & Emerald Aurora)</option>
                  <option value="festival">🎉 Festival / Carnival (Celebratory Confetti & Ribbons)</option>
                </select>
                <span style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-top: 0.3rem;">
                  Choose the visual experience rendered behind cards and content across the website.
                </span>
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label class="form-label" for="settingFestiveMode">Festive Status Mode</label>
                <select id="settingFestiveMode" class="form-input">
                  <option value="always">Always Active (Force ON for all visitors)</option>
                  <option value="auto">Auto-Detect (Active dynamically during festival dates)</option>
                  <option value="disabled">Disabled (Clean scientific default)</option>
                </select>
                <span style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-top: 0.3rem;">
                  "Always Active" enables the selected theme year-round. "Auto-Detect" turns it on during seasonal dates.
                </span>
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                  <label class="form-label" for="settingFestiveIntensity" style="margin: 0;">Effect Vibrancy & Intensity</label>
                  <span id="festiveIntensityBadge" style="font-weight: 700; color: var(--accent-primary); font-size: 0.88rem;">70%</span>
                </div>
                <input type="range" id="settingFestiveIntensity" min="20" max="100" step="5" value="70" style="width: 100%; accent-color: var(--accent-primary);">
                <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted);">
                  <span>20% (Subtle Glow)</span>
                  <span>70% (Balanced Vibrancy)</span>
                  <span>100% (Maximum Richness)</span>
                </div>
              </div>

              <!-- Live Preview of Frosted Card on Festive Theme -->
              <div style="margin-top: 1.5rem;">
                <label class="form-label">Live Appearance Preview</label>
                <div id="festiveLivePreviewStage" style="position: relative; overflow: hidden; min-height: 145px; border-radius: 8px; background: #070a13; padding: 1.25rem; display: flex; align-items: center; justify-content: center;">
                  <!-- Dynamic Preview Layer -->
                  <div id="previewSplatterLayer" style="position: absolute; inset: 0; pointer-events: none; opacity: 0.7; overflow: hidden;">
                    <!-- Rendered via JS based on selected theme -->
                  </div>
                  <!-- Frosted Sample Card -->
                  <div style="position: relative; z-index: 2; background: rgba(14, 20, 36, 0.75); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 10px; padding: 1rem 1.5rem; text-align: center; max-width: 300px; box-shadow: 0 10px 25px rgba(0,0,0,0.4);">
                    <div id="previewCardTitle" style="font-size: 0.9rem; font-weight: 700; color: #ffffff;">Festival of Colors</div>
                    <div id="previewCardDesc" style="font-size: 0.74rem; color: #cbd5e1; margin-top: 0.2rem;">Vibrant paint splatters and particles glow behind cards.</div>
                  </div>
                </div>
              </div>

              <div style="margin-top: 1.5rem; text-align: right;">
                <button type="submit" class="btn btn-primary" style="padding: 0.75rem 2rem;">
                  Save Festive Settings
                </button>
              </div>
            </form>
          </div>

          <!-- 3. EmailJS Dispatch Configuration -->
          <div class="data-table-card" style="padding: 2rem;">
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span>EmailJS & Mail Dispatches</span>
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
              Set your EmailJS Template ID so you can dispatch emails directly to applicants, fellows, and users.
            </p>

            <form id="emailjsSettingsForm">
              <div class="form-group">
                <label class="form-label">Connected Gmail Account</label>
                <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); padding: 0.5rem 0.75rem; background: var(--bg-surface); border-radius: 6px; border: 1px solid var(--border-color);">
                  curiomas.members@gmail.com (Service ID: <code>curiomas</code>)
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="settingEmailjsTemplateId" style="display:flex; justify-content:space-between; align-items:center;">
                  <span>EmailJS Template ID *</span>
                  <a href="https://dashboard.emailjs.com/admin/templates" target="_blank" rel="noopener" style="font-size: 0.75rem; color: var(--accent-primary); text-decoration: underline;">
                    Find / Create Template &rarr;
                  </a>
                </label>
                <input type="text" id="settingEmailjsTemplateId" class="form-input" placeholder="e.g. your_emailjs_template_id" required>
                <span style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.35rem; display: block; line-height: 1.4;">
                  Find your Template ID at <a href="https://dashboard.emailjs.com/admin/templates" target="_blank" style="color:var(--accent-primary); text-decoration:underline;">EmailJS Dashboard &gt; Email Templates</a>. If you haven't created a template yet, click "Create New Template" and copy its ID.
                </span>
              </div>

              <div style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; background: rgba(234, 88, 12, 0.06); padding: 0.75rem; border-radius: 6px; margin-top: 1rem;">
                <strong>Template Variables in EmailJS:</strong><br>
                In your EmailJS template content, you can use: <code>{{to_email}}</code>, <code>{{to_name}}</code>, <code>{{subject}}</code>, <code>{{message}}</code>, <code>{{reply_to}}</code>.
              </div>

              <div style="margin-top: 1.5rem; text-align: right;">
                <button type="submit" class="btn btn-primary" style="padding: 0.75rem 2rem;">
                  Save Template ID
                </button>
              </div>
            </form>
          </div>

          <div id="settingsAiApiManagerCard" class="data-table-card" style="padding: 2rem; grid-column: 1 / -1;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; margin-bottom:1.25rem;">
              <div>
                <h3 style="font-size:1.3rem; margin:0 0 0.35rem; color:var(--text-primary); display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                  <span>⚡</span>
                  <span>AI & External APIs Management Hub</span>
                  <span id="aiCatalogCountBadge" style="font-size:0.74rem; padding:0.18rem 0.6rem; border-radius:999px; background:rgba(234,88,12,0.12); color:#ea580c; font-weight:700;">61 Providers Supported</span>
                </h3>
                <p style="font-size:0.85rem; color:var(--text-secondary); margin:0; max-width:780px; line-height:1.55;">
                  Connect and manage unlimited AI providers for Image Generation, AI Article Writer, and AI Help Assistant. Includes zero-key free engines (Pollinations FLUX, Pollinations Text, AI Horde GPU) plus 60+ free-tier & studio APIs with automatic cascading fallbacks.
                </p>
              </div>
              <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.openAiHelpModal('free_apis')">🎁 Free API Guide</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.loadAiProvidersManager()">Refresh</button>
                <button type="button" class="btn btn-primary btn-sm" onclick="window.openAiProviderModal()">+ Add Custom / Any API</button>
              </div>
            </div>

            <div style="margin-bottom:0.65rem; font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">Connected & Built-in Active Engines</div>
            <div id="settingsAiProvidersGrid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(310px, 1fr)); gap:1rem; margin-bottom:1.75rem;"></div>

            <div style="border-top:1px solid var(--border-color); padding-top:1.4rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; margin-bottom:0.85rem;">
                <div>
                  <div style="font-size:1.02rem; font-weight:700; color:var(--text-primary);">Browse 60+ AI & Free Image/Text API Directory</div>
                  <div style="font-size:0.78rem; color:var(--text-muted);">Click any provider below to auto-fill its verified API endpoint, free model IDs, and key link.</div>
                </div>
                <input type="text" id="aiCatalogSearchInput" class="form-input" placeholder="Search 60+ AIs (Groq, FLUX, Claude, DeepSeek, Cloudflare, AI Horde...)" oninput="window.renderAiCatalogBrowser()" style="min-width:260px; max-width:360px; flex:1; font-size:0.84rem; padding:0.45rem 0.85rem;">
              </div>

              <div id="aiCatalogFilterBar" style="display:flex; gap:0.4rem; flex-wrap:wrap; margin-bottom:1rem;">
                <button type="button" class="btn btn-sm btn-primary" data-cat="all" onclick="window.setAiCatalogFilter('all', this)">All (61)</button>
                <button type="button" class="btn btn-sm btn-secondary" data-cat="free" onclick="window.setAiCatalogFilter('free', this)">🎁 Free / No-Card</button>
                <button type="button" class="btn btn-sm btn-secondary" data-cat="nokey" onclick="window.setAiCatalogFilter('nokey', this)">⚡ No Key Needed</button>
                <button type="button" class="btn btn-sm btn-secondary" data-cat="image" onclick="window.setAiCatalogFilter('image', this)">🎨 Image Generation</button>
                <button type="button" class="btn btn-sm btn-secondary" data-cat="text" onclick="window.setAiCatalogFilter('text', this)">✍ Text / Writer / Chat</button>
                <button type="button" class="btn btn-sm btn-secondary" data-cat="pro" onclick="window.setAiCatalogFilter('pro', this)">💎 Studio & Flagship</button>
              </div>

              <div id="aiCatalogBrowserGrid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(255px, 1fr)); gap:0.75rem; max-height:460px; overflow-y:auto; padding:0.25rem;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ====================================================================
           TAB: MEDIA & R2 STORAGE MANAGER
           ==================================================================== -->
      <div id="tab-storage" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Image & Video Storage Manager</h1>
            <p>Cloudflare R2 Bucket Object Catalog — Upload, inspect, manage, and delete images and videos.</p>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm" id="refreshStorageBtn" onclick="renderStorageTab()">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span>Refresh R2</span>
            </button>
            <button class="btn btn-primary btn-sm" onclick="document.getElementById('storageFileInput').click()">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span>Upload Media</span>
            </button>
            <input type="file" id="storageFileInput" style="display: none;" accept="image/*,video/mp4,video/webm" multiple onchange="handleStorageFileUpload(event)">
          </div>
        </div>

        <!-- Metrics Cards (Responsive White + Orange Stat Cards) -->
        <div class="portal-stats-grid" style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <div class="stat-card" style="background: var(--bg-surface, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 14px; padding: 1.25rem 1.4rem; display: flex; align-items: center; gap: 1.15rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); min-width: 0;">
            <div class="stat-icon-wrapper" style="width: 48px; height: 48px; min-width: 48px; max-width: 48px; border-radius: 12px; background: rgba(234, 88, 12, 0.12); color: #ea580c; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
            <div class="stat-info" style="display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; flex: 1;">
              <span class="stat-label" style="font-size: 0.76rem; font-weight: 700; color: var(--text-secondary, #64748b); text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Total Stored Objects</span>
              <div id="storageTotalCount" class="stat-value" style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary, #0f172a); line-height: 1.1; font-family: var(--font-display);">0</div>
              <div style="font-size: 0.76rem; color: var(--text-muted, #94a3b8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Indexed in Cloudflare R2</div>
            </div>
          </div>

          <div class="stat-card" style="background: var(--bg-surface, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 14px; padding: 1.25rem 1.4rem; display: flex; align-items: center; gap: 1.15rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); min-width: 0;">
            <div class="stat-icon-wrapper" style="width: 48px; height: 48px; min-width: 48px; max-width: 48px; border-radius: 12px; background: rgba(16, 185, 129, 0.12); color: #10b981; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>
            </div>
            <div class="stat-info" style="display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; flex: 1;">
              <span class="stat-label" style="font-size: 0.76rem; font-weight: 700; color: var(--text-secondary, #64748b); text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Storage Used</span>
              <div id="storageTotalSize" class="stat-value" style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary, #0f172a); line-height: 1.1; font-family: var(--font-display);">0 MB</div>
              <div style="font-size: 0.76rem; color: var(--text-muted, #94a3b8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Aggregate R2 size</div>
            </div>
          </div>

          <div class="stat-card" style="background: var(--bg-surface, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 14px; padding: 1.25rem 1.4rem; display: flex; align-items: center; gap: 1.15rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); min-width: 0;">
            <div class="stat-icon-wrapper" style="width: 48px; height: 48px; min-width: 48px; max-width: 48px; border-radius: 12px; background: rgba(245, 158, 11, 0.12); color: #f59e0b; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/></svg>
            </div>
            <div class="stat-info" style="display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; flex: 1;">
              <span class="stat-label" style="font-size: 0.76rem; font-weight: 700; color: var(--text-secondary, #64748b); text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Video Files</span>
              <div id="storageVideoCount" class="stat-value" style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary, #0f172a); line-height: 1.1; font-family: var(--font-display);">0</div>
              <div style="font-size: 0.76rem; color: var(--text-muted, #94a3b8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">MP4 & WEBM streams</div>
            </div>
          </div>

          <div class="stat-card" style="background: var(--bg-surface, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 14px; padding: 1.25rem 1.4rem; display: flex; align-items: center; gap: 1.15rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); min-width: 0;">
            <div class="stat-icon-wrapper" style="width: 48px; height: 48px; min-width: 48px; max-width: 48px; border-radius: 12px; background: rgba(139, 92, 246, 0.12); color: #8b5cf6; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m10 15 5-3-5-3v6Z"/></svg>
            </div>
            <div class="stat-info" style="display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; flex: 1;">
              <span class="stat-label" style="font-size: 0.76rem; font-weight: 700; color: var(--text-secondary, #64748b); text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Image Files</span>
              <div id="storageImageCount" class="stat-value" style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary, #0f172a); line-height: 1.1; font-family: var(--font-display);">0</div>
              <div style="font-size: 0.76rem; color: var(--text-muted, #94a3b8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">WEBP, PNG, JPG & SVG</div>
            </div>
          </div>
        </div>

        <!-- Filter & Search Bar + Drag & Drop Area -->
        <div class="data-table-card" style="padding: 1.25rem 1.5rem; margin-bottom: 1.5rem;">
          <div style="display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap;">
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <button class="btn btn-sm btn-primary storage-filter-btn active" data-filter="all" onclick="filterStorageMedia('all')">All Media</button>
              <button class="btn btn-sm btn-secondary storage-filter-btn" data-filter="image" onclick="filterStorageMedia('image')">Images</button>
              <button class="btn btn-sm btn-secondary storage-filter-btn" data-filter="video" onclick="filterStorageMedia('video')">Videos</button>
            </div>

            <div class="search-input-group" style="max-width: 380px; flex: 1;">
              <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input type="text" id="storageSearchInput" class="search-input" placeholder="Search filenames, extensions, or keys..." oninput="handleStorageSearch(this.value)">
            </div>
          </div>

          <!-- Drag & Drop Zone -->
          <div id="storageDropzone" class="storage-dropzone" style="margin-top: 1.25rem; border: 2px dashed var(--border-color); border-radius: 12px; padding: 2rem 1.5rem; text-align: center; background: var(--bg-surface); cursor: pointer; transition: all 0.2s ease;">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="var(--accent-primary, #ea580c)" stroke-width="1.8" style="margin-bottom: 0.65rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">Drag and drop files here, or click to upload</div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">Supports PNG, JPG, WEBP, SVG, GIF images and MP4, WEBM videos (Up to 100MB per file)</div>
          </div>
        </div>

        <!-- Media Grid Container -->
        <div id="storageMediaGrid" class="storage-media-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <!-- Dynamically populated -->
        </div>
      </div>

      <!-- ====================================================================
           TAB: CLOUDFLARE D1 SQL STUDIO & DB SCHEMA EXPLORER
           Direct SQL console & AI Bulk Data Prompt Generator
           ==================================================================== -->
      <div id="tab-sql" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar" style="margin-top: 0.25rem;">
          <div class="portal-title-block">
            <h1 style="line-height: 1.25;">Cloudflare D1 SQL Studio & Schema</h1>
            <p>Direct query console for <code>crii-production-db</code> — inspect live table schemas, run raw SQL queries, and generate bulk data prompts for AI.</p>
          </div>
          <div style="display: flex; gap: 0.65rem; align-items: center; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary btn-sm" id="sqlRefreshSchemaBtn" onclick="window.loadSqlSchema()">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span>Refresh Schema</span>
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.copyAiPrompt('fullSchemaPrompt')" title="Copy complete database schema and rules to paste into ChatGPT/Claude">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span>Copy Full Schema for AI</span>
            </button>
            <button type="button" class="btn btn-primary btn-sm" onclick="window.runSqlQuery()">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>Execute SQL (Ctrl+Enter)</span>
            </button>
          </div>
        </div>

        <!-- AI Bulk Data Generation Banner -->
        <div class="sql-ai-banner" style="margin-bottom: 1.5rem;">
          <div style="display: flex; gap: 1rem; align-items: center;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(234, 88, 12, 0.15); color: #ea580c; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            </div>
            <div>
              <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">AI Bulk Data Importer & Prompt Generator</div>
              <div style="font-size: 0.82rem; color: var(--text-muted);">
                Need to add multiple articles, publications, or research fellows? Copy the schema prompt below, paste your raw data to any AI (ChatGPT, Claude, Gemini), and execute the generated SQL here.
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-sm btn-secondary" onclick="window.copyAiPrompt('bulkArticles')">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span>Prompt: Bulk Articles</span>
            </button>
            <button type="button" class="btn btn-sm btn-secondary" onclick="window.copyAiPrompt('bulkResearchers')">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span>Prompt: Bulk Researchers</span>
            </button>
            <button type="button" class="btn btn-sm btn-secondary" onclick="window.copyAiPrompt('bulkDivisions')">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/></svg>
              <span>Prompt: Bulk Divisions</span>
            </button>
          </div>
        </div>

        <!-- Main Studio Grid: Left Schema Explorer, Right Query Console -->
        <div class="sql-studio-grid">
          <!-- Left: Schema Explorer Sidebar -->
          <div class="sql-sidebar-card">
            <div class="sql-sidebar-header">
              <div class="sql-sidebar-title">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ea580c" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>
                <span>Live D1 Tables</span>
              </div>
              <span id="sqlTableCountBadge" class="sql-table-badge">0 Tables</span>
            </div>
            <div id="sqlTableListContainer" class="sql-table-list">
              <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.82rem;">Loading database schema...</div>
            </div>
            <!-- Selected Table Detail / Quick Actions -->
            <div id="sqlSelectedTableInfo" style="padding: 1rem; border-top: 1px solid var(--border-color); background: var(--bg-primary); display: none;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span id="sqlSelectedTableName" style="font-weight: 700; font-family: monospace; font-size: 0.85rem; color: var(--accent-primary);"></span>
                <span id="sqlSelectedTableRowCount" class="sql-table-badge"></span>
              </div>
              <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                <button type="button" class="btn btn-xs btn-secondary" onclick="window.insertSqlPreset('selectFromSelected')">SELECT *</button>
                <button type="button" class="btn btn-xs btn-secondary" onclick="window.insertSqlPreset('countSelected')">COUNT</button>
                <button type="button" class="btn btn-xs btn-secondary" onclick="window.copySelectedTableDdl()">Copy DDL</button>
              </div>
            </div>
          </div>

          <!-- Right: SQL Console & Results -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem; min-width: 0;">
            <!-- Console Box -->
            <div class="sql-console-card">
              <div class="sql-toolbar">
                <div class="sql-presets-group">
                  <span style="font-size: 0.76rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Presets:</span>
                  <button type="button" class="sql-preset-chip" onclick="window.insertSqlPreset('selectPosts')">Posts (20)</button>
                  <button type="button" class="sql-preset-chip" onclick="window.insertSqlPreset('selectInterns')">Researchers</button>
                  <button type="button" class="sql-preset-chip" onclick="window.insertSqlPreset('selectDivisions')">Divisions</button>
                  <button type="button" class="sql-preset-chip" onclick="window.insertSqlPreset('tableCounts')">All Row Counts</button>
                  <button type="button" class="sql-preset-chip" onclick="window.insertSqlPreset('templateInsertPost')">+ Insert Post</button>
                  <button type="button" class="sql-preset-chip" onclick="window.insertSqlPreset('templateInsertIntern')">+ Insert Fellow</button>
                  <button type="button" class="sql-preset-chip" onclick="window.insertSqlPreset('templateInsertDivision')">+ Insert Division</button>
                  <button type="button" class="sql-preset-chip" onclick="window.insertSqlPreset('templateBulkDivisions')" style="background: rgba(234, 88, 12, 0.1); color: #ea580c; border-color: rgba(234, 88, 12, 0.3);">Bulk Insert 4 Divisions</button>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <button type="button" class="btn btn-xs btn-secondary" onclick="window.formatSqlQuery()" title="Format SQL query">Format</button>
                  <button type="button" class="btn btn-xs btn-secondary" onclick="window.clearSqlEditor()" title="Clear editor">Clear</button>
                </div>
              </div>

              <!-- Monospace Editor Wrapper -->
              <div class="sql-editor-wrapper">
                <div class="sql-editor-header">
                  <div class="sql-editor-dots">
                    <span class="sql-editor-dot" style="background: #ef4444;"></span>
                    <span class="sql-editor-dot" style="background: #f59e0b;"></span>
                    <span class="sql-editor-dot" style="background: #10b981;"></span>
                  </div>
                  <span style="font-size: 0.75rem; color: #94a3b8; font-family: monospace;">crii-production-db (Cloudflare D1 SQLite)</span>
                </div>
                <textarea id="sqlQueryInput" class="sql-editor-textarea" spellcheck="false" placeholder="-- Enter SQL query or bulk INSERT statements here...
-- Example: SELECT * FROM posts ORDER BY date DESC LIMIT 10;
-- Keyboard Shortcut: Press Ctrl + Enter (or Cmd + Enter) to execute."></textarea>
              </div>

              <!-- Execution Status Bar -->
              <div class="sql-status-bar">
                <div id="sqlExecutionStatus" class="sql-status-badge">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background: #94a3b8;"></span>
                  <span>Ready. Press Ctrl+Enter to execute.</span>
                </div>
                <button type="button" class="btn btn-primary btn-sm" id="sqlExecuteBtn" onclick="window.runSqlQuery()">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  <span>Execute SQL</span>
                </button>
              </div>
            </div>

            <!-- Error Display Card (Hidden by default) -->
            <div id="sqlErrorContainer" style="display: none; background: #fef2f2; border: 1px solid #fecaca; border-radius: 14px; padding: 1.25rem 1.5rem; color: #b91c1c;">
              <div style="font-weight: 700; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.5rem;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>SQL Execution Error</span>
              </div>
              <div id="sqlErrorMessage" style="font-family: monospace; font-size: 0.85rem; white-space: pre-wrap; word-break: break-all;"></div>
            </div>

            <!-- Results Card -->
            <div id="sqlResultsCard" class="sql-results-card" style="display: none;">
              <div class="sql-results-header">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">Query Results</span>
                  <span id="sqlResultsSummary" class="sql-table-badge" style="background: rgba(16, 185, 129, 0.1); color: #10b981; font-weight: 700;"></span>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <button type="button" class="btn btn-xs btn-secondary" onclick="window.exportSqlResultsToCsv()">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    <span>Export CSV</span>
                  </button>
                  <button type="button" class="btn btn-xs btn-secondary" onclick="window.copySqlResultsJson()">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    <span>Copy JSON</span>
                  </button>
                </div>
              </div>
              <div id="sqlResultsTableContainer" class="sql-results-table-container">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="tab-academics" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Academics Manager (SSC, HSC & STEM)</h1>
            <p>Manage public classes, subjects, MCQ Auto-Exam question banks, Creative Questions (CQs), and chapter notes. All items include future Student Package access controls.</p>
          </div>
          <div style="display:flex; gap:0.55rem; flex-wrap:wrap;">
            <a href="/academics" target="_blank" class="btn btn-secondary btn-sm">Open Public /academics ↗</a>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.loadAdminAcademics()">Refresh</button>
          </div>
        </div>

        <div id="acadAdminStatsGrid" class="portal-stats-grid" style="margin-bottom:1.5rem;"></div>

        <div id="acadAdminSubTabs" style="display:flex; gap:0.45rem; flex-wrap:wrap; margin-bottom:1.25rem;">
          <button type="button" class="btn btn-sm btn-primary" data-asub="classes" onclick="window.switchAcadAdminTab('classes')">🎓 Classes & Subjects</button>
          <button type="button" class="btn btn-sm btn-secondary" data-asub="mcqs" onclick="window.switchAcadAdminTab('mcqs')">🧠 MCQ Bank + AI Gen</button>
          <button type="button" class="btn btn-sm btn-secondary" data-asub="cqs" onclick="window.switchAcadAdminTab('cqs')">📝 Creative Questions (CQ)</button>
          <button type="button" class="btn btn-sm btn-secondary" data-asub="notes" onclick="window.switchAcadAdminTab('notes')">📚 Notes & Formula Sheets</button>
        </div>

        <div id="acadAdminPane_classes">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(340px, 1fr)); gap:1.25rem; margin-bottom:1.5rem;">
            <div class="data-table-card" style="padding:1.4rem;">
              <h3 style="margin:0 0 0.85rem; font-size:1.05rem;">Add / Edit Class (SSC, HSC, etc.)</h3>
              <form id="acadClassForm" onsubmit="window.handleSaveAcadClass(event)" style="display:flex; flex-direction:column; gap:0.7rem;">
                <input type="hidden" id="acadClassIdInput">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.65rem;">
                  <input type="text" id="acadClassNameInput" class="form-input" placeholder="Class Name (e.g. SSC (Class 9–10))" required>
                  <input type="text" id="acadClassShortInput" class="form-input" placeholder="Short Label (e.g. SSC)">
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr 90px; gap:0.65rem;">
                  <input type="text" id="acadClassBadgeInput" class="form-input" placeholder="Badge (e.g. Board Prep)">
                  <select id="acadClassAccessInput" class="form-select">
                    <option value="public">Public (Free)</option>
                    <option value="package">Student Package (Future)</option>
                  </select>
                  <input type="color" id="acadClassColorInput" class="form-input" value="#ea580c" style="padding:0.2rem; height:38px;">
                </div>
                <textarea id="acadClassDescInput" class="form-textarea" rows="2" placeholder="Class overview & exam focus..."></textarea>
                <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
                  <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('acadClassForm').reset(); document.getElementById('acadClassIdInput').value='';">Clear</button>
                  <button type="submit" class="btn btn-primary btn-sm">Save Class</button>
                </div>
              </form>
            </div>

            <div class="data-table-card" style="padding:1.4rem;">
              <h3 style="margin:0 0 0.85rem; font-size:1.05rem;">Add / Edit Subject & Chapters</h3>
              <form id="acadSubjectForm" onsubmit="window.handleSaveAcadSubject(event)" style="display:flex; flex-direction:column; gap:0.7rem;">
                <input type="hidden" id="acadSubIdInput">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.65rem;">
                  <select id="acadSubClassSelect" class="form-select" required></select>
                  <input type="text" id="acadSubNameInput" class="form-input" placeholder="Subject Name (e.g. Physics)" required>
                </div>
                <div style="display:grid; grid-template-columns:80px 1fr 1fr; gap:0.65rem;">
                  <input type="text" id="acadSubIconInput" class="form-input" value="⚛️" placeholder="Icon">
                  <input type="text" id="acadSubCodeInput" class="form-input" placeholder="Code (e.g. PHY-136)">
                  <select id="acadSubAccessInput" class="form-select">
                    <option value="public">Public (Free)</option>
                    <option value="package">Student Package</option>
                  </select>
                </div>
                <textarea id="acadSubChaptersInput" class="form-textarea" rows="2" placeholder="Chapters (comma or newline separated, e.g. Chapter 1: Motion, Chapter 2: Force)"></textarea>
                <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
                  <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('acadSubjectForm').reset(); document.getElementById('acadSubIdInput').value='';">Clear</button>
                  <button type="submit" class="btn btn-primary btn-sm">Save Subject</button>
                </div>
              </form>
            </div>
          </div>

          <div class="data-table-card" style="padding:1.35rem;">
            <h3 style="margin:0 0 0.9rem; font-size:1.05rem;">Configured Classes & Subjects</h3>
            <div id="acadAdminClassesList" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:0.9rem;"></div>
          </div>
        </div>

        <div id="acadAdminPane_mcqs" style="display:none;">
          <div class="data-table-card" style="padding:1.45rem; margin-bottom:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; margin-bottom:1rem;">
              <h3 style="margin:0; font-size:1.05rem;">Add MCQ Question (or AI Auto-Generate Batch)</h3>
              <button type="button" class="btn btn-secondary btn-sm" id="acadAiGenMcqBtn" onclick="window.handleAiGenerateMcqs()" style="border-color:rgba(234,88,12,0.45); color:#ea580c; background:rgba(234,88,12,0.08); font-weight:700;">✨ AI Generate 5 MCQs for Selected Subject/Chapter</button>
            </div>
            <form id="acadMcqForm" onsubmit="window.handleSaveAcadMcq(event)" style="display:flex; flex-direction:column; gap:0.75rem;">
              <input type="hidden" id="acadMcqIdInput">
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(175px, 1fr)); gap:0.65rem;">
                <select id="acadMcqClassSelect" class="form-select" onchange="window.syncAcadSubjectSelect('acadMcqClassSelect', 'acadMcqSubjectSelect')" required></select>
                <select id="acadMcqSubjectSelect" class="form-select" required></select>
                <input type="text" id="acadMcqChapterInput" class="form-input" placeholder="Chapter (e.g. Chapter 2: Motion)">
                <input type="text" id="acadMcqBoardInput" class="form-input" placeholder="Board/Year (e.g. Dhaka Board 2025)">
                <select id="acadMcqDiffInput" class="form-select">
                  <option value="Easy">Easy</option>
                  <option value="Medium" selected>Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <textarea id="acadMcqQuestionInput" class="form-textarea" rows="2" placeholder="Enter MCQ question text..." required></textarea>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.65rem;">
                <input type="text" id="acadMcqOpt0" class="form-input" placeholder="Option A *" required>
                <input type="text" id="acadMcqOpt1" class="form-input" placeholder="Option B *" required>
                <input type="text" id="acadMcqOpt2" class="form-input" placeholder="Option C *" required>
                <input type="text" id="acadMcqOpt3" class="form-input" placeholder="Option D *" required>
              </div>
              <div style="display:grid; grid-template-columns:180px 1fr; gap:0.65rem;">
                <select id="acadMcqCorrectSelect" class="form-select">
                  <option value="0">Correct: Option A</option>
                  <option value="1">Correct: Option B</option>
                  <option value="2">Correct: Option C</option>
                  <option value="3">Correct: Option D</option>
                </select>
                <input type="text" id="acadMcqExplanationInput" class="form-input" placeholder="Step-by-step explanation shown after student submits...">
              </div>
              <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('acadMcqForm').reset(); document.getElementById('acadMcqIdInput').value='';">Clear</button>
                <button type="submit" class="btn btn-primary btn-sm">Save MCQ</button>
              </div>
            </form>
          </div>
          <div class="data-table-card" style="padding:1.35rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.6rem; margin-bottom:0.85rem;">
              <h3 style="margin:0; font-size:1.05rem;">Existing MCQ Question Bank</h3>
              <input type="text" id="acadAdminMcqSearch" class="form-input" placeholder="Filter MCQs..." oninput="window.renderAcadAdminMcqList()" style="max-width:260px; font-size:0.82rem; padding:0.38rem 0.7rem;">
            </div>
            <div id="acadAdminMcqList" style="display:flex; flex-direction:column; gap:0.65rem; max-height:460px; overflow-y:auto;"></div>
          </div>
        </div>

        <div id="acadAdminPane_cqs" style="display:none;">
          <div class="data-table-card" style="padding:1.45rem; margin-bottom:1.25rem;">
            <h3 style="margin:0 0 0.9rem; font-size:1.05rem;">Add Creative Question (CQ / সৃজনশীল)</h3>
            <form id="acadCqForm" onsubmit="window.handleSaveAcadCq(event)" style="display:flex; flex-direction:column; gap:0.7rem;">
              <input type="hidden" id="acadCqIdInput">
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(175px, 1fr)); gap:0.65rem;">
                <select id="acadCqClassSelect" class="form-select" onchange="window.syncAcadSubjectSelect('acadCqClassSelect', 'acadCqSubjectSelect')" required></select>
                <select id="acadCqSubjectSelect" class="form-select" required></select>
                <input type="text" id="acadCqChapterInput" class="form-input" placeholder="Chapter">
                <input type="text" id="acadCqBoardInput" class="form-input" placeholder="Board/Year (e.g. HSC Dhaka 2025)">
              </div>
              <input type="text" id="acadCqTitleInput" class="form-input" placeholder="CQ Topic Title (e.g. Geostationary Satellite Orbital Speed)" required>
              <textarea id="acadCqStemInput" class="form-textarea" rows="3" placeholder="Uddipok / Scenario Stem *" required></textarea>
              <div>
                <label class="form-label" style="font-size:0.78rem;">Optional Diagram / Figure</label>
                ${renderMediaPickerField({ id: 'acadCqImageInput', accept: 'image/*', uploadLabel: 'Upload Diagram', placeholder: 'Paste diagram URL or /api/images/...' })}
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.65rem;">
                <input type="text" id="acadCqPartA" class="form-input" placeholder="(ক) Knowledge Question [1m] *" required>
                <input type="text" id="acadCqAnsA" class="form-input" placeholder="(ক) Model Answer">
                <input type="text" id="acadCqPartB" class="form-input" placeholder="(খ) Comprehension Question [2m] *" required>
                <input type="text" id="acadCqAnsB" class="form-input" placeholder="(খ) Model Answer">
                <textarea id="acadCqPartC" class="form-textarea" rows="2" placeholder="(গ) Application Question [3m] *" required></textarea>
                <textarea id="acadCqAnsC" class="form-textarea" rows="2" placeholder="(গ) Step-by-step Answer"></textarea>
                <textarea id="acadCqPartD" class="form-textarea" rows="2" placeholder="(ঘ) Higher-Order Question [4m] *" required></textarea>
                <textarea id="acadCqAnsD" class="form-textarea" rows="2" placeholder="(ঘ) Full Analytical Answer"></textarea>
              </div>
              <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('acadCqForm').reset(); document.getElementById('acadCqIdInput').value='';">Clear</button>
                <button type="submit" class="btn btn-primary btn-sm">Save CQ</button>
              </div>
            </form>
          </div>
          <div class="data-table-card" style="padding:1.35rem;">
            <h3 style="margin:0 0 0.85rem; font-size:1.05rem;">Published Creative Questions</h3>
            <div id="acadAdminCqList" style="display:flex; flex-direction:column; gap:0.65rem;"></div>
          </div>
        </div>

        <div id="acadAdminPane_notes" style="display:none;">
          <div class="data-table-card" style="padding:1.45rem; margin-bottom:1.25rem;">
            <h3 style="margin:0 0 0.9rem; font-size:1.05rem;">Add Study Note, Formula Sheet, PDF Handout or Lecture</h3>
            <form id="acadNoteForm" onsubmit="window.handleSaveAcadNote(event)" style="display:flex; flex-direction:column; gap:0.7rem;">
              <input type="hidden" id="acadNoteIdInput">
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(175px, 1fr)); gap:0.65rem;">
                <select id="acadNoteClassSelect" class="form-select" onchange="window.syncAcadSubjectSelect('acadNoteClassSelect', 'acadNoteSubjectSelect')" required></select>
                <select id="acadNoteSubjectSelect" class="form-select" required></select>
                <input type="text" id="acadNoteChapterInput" class="form-input" placeholder="Chapter">
                <select id="acadNoteTypeSelect" class="form-select">
                  <option value="note">Chapter Note</option>
                  <option value="formula">Formula Sheet</option>
                  <option value="pdf">PDF / Handout</option>
                  <option value="video">Video Lecture</option>
                </select>
              </div>
              <input type="text" id="acadNoteTitleInput" class="form-input" placeholder="Resource Title *" required>
              <input type="text" id="acadNoteSummaryInput" class="form-input" placeholder="Short summary...">
              <textarea id="acadNoteContentInput" class="form-textarea" rows="5" placeholder="Markdown notes / formulas (use ## Headings and - bullet points)..."></textarea>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
                <div>
                  <label class="form-label" style="font-size:0.78rem;">Optional Handout File / Image (R2 Upload or URL)</label>
                  ${renderMediaPickerField({ id: 'acadNoteFileInput', accept: 'image/*,.pdf', uploadLabel: 'Upload File', placeholder: 'Paste PDF/Image URL or /api/images/...' })}
                </div>
                <div>
                  <label class="form-label" style="font-size:0.78rem;">Optional Video Lecture (Upload MP4 or URL)</label>
                  ${renderMediaPickerField({ id: 'acadNoteVideoInput', accept: 'video/*', uploadLabel: 'Upload Video', placeholder: 'Paste YouTube or MP4 URL...' })}
                </div>
              </div>
              <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('acadNoteForm').reset(); document.getElementById('acadNoteIdInput').value='';">Clear</button>
                <button type="submit" class="btn btn-primary btn-sm">Save Study Resource</button>
              </div>
            </form>
          </div>
          <div class="data-table-card" style="padding:1.35rem;">
            <h3 style="margin:0 0 0.85rem; font-size:1.05rem;">Published Study Notes & Formula Sheets</h3>
            <div id="acadAdminNoteList" style="display:flex; flex-direction:column; gap:0.65rem;"></div>
          </div>
        </div>
      </div>
    </main>
  
  <!-- ====================================================================
       IMPROVMX EMAIL ALIAS MANAGER MODALS
       ==================================================================== -->

  <!-- Modal 1: Provision Email Alias -->
  <div id="provisionAliasModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 520px;">
      <div class="modal-header">
        <h3 class="modal-title">Provision Researcher Email Alias</h3>
        <button type="button" class="modal-close" onclick="window.closeProvisionAliasModal()">&times;</button>
      </div>
      <form id="provisionAliasForm" onsubmit="window.handleProvisionAliasSubmit(event)">
        <div class="modal-body">
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.2rem;">
            Assign an official institute email handle that automatically forwards all incoming mail directly to the researcher's personal Gmail.
          </p>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Target Domain *</label>
            <select id="provDomainSelect" class="form-input" required></select>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Email Alias Handle *</label>
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <input type="text" id="provAliasInput" class="form-input" placeholder="e.g. harun, research, or first.last" required style="font-family: monospace;">
              <span id="provDomainSuffix" style="font-weight: 600; color: var(--text-muted); font-size: 0.88rem; white-space: nowrap;">@domain</span>
            </div>
            <small style="font-size: 0.74rem; color: var(--text-muted); margin-top: 0.25rem; display: block;">Use lowercase letters, numbers, hyphens, dots, or * for catch-all.</small>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Quick Pick from Active Fellows / Team (Optional)</label>
            <select id="provFellowSelect" class="form-input" onchange="window.handleFellowSelect(this.value)">
              <option value="">-- Choose fellow to auto-fill Gmail --</option>
            </select>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Forwarding Destination (Gmail / Personal Email) *</label>
            <input type="email" id="provForwardInput" class="form-input" placeholder="researcher.personal@gmail.com" required>
            <small style="font-size: 0.74rem; color: var(--text-muted); margin-top: 0.25rem; display: block;">All emails sent to this alias will be instantly delivered to this address.</small>
          </div>

          <!-- Live Preview Box -->
          <div style="background: rgba(234, 88, 12, 0.06); border: 1px solid rgba(234, 88, 12, 0.2); border-radius: 8px; padding: 0.75rem 1rem; margin-top: 0.75rem;">
            <div style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--accent-primary, #ea580c); margin-bottom: 0.2rem;">Relay Preview</div>
            <div id="provRelayPreview" style="font-family: monospace; font-size: 0.85rem; color: var(--text-primary);">
              (handle)@(domain) &rarr; (destination)
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="window.closeProvisionAliasModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" id="provSubmitBtn">Provision Email Alias</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 2: Edit Email Alias -->
  <div id="editAliasModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 480px;">
      <div class="modal-header">
        <h3 class="modal-title">Edit Forwarding Destination</h3>
        <button type="button" class="modal-close" onclick="window.closeEditAliasModal()">&times;</button>
      </div>
      <form id="editAliasForm" onsubmit="window.handleEditAliasSubmit(event)">
        <input type="hidden" id="editAliasId">
        <input type="hidden" id="editAliasDomain">
        <div class="modal-body">
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Email Alias</label>
            <input type="text" id="editAliasDisplay" class="form-input" readonly style="font-family: monospace; background: var(--bg-surface);">
          </div>
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Forward To (Gmail Address) *</label>
            <input type="email" id="editForwardInput" class="form-input" required>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="window.closeEditAliasModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" id="editSubmitBtn">Save Changes</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 3: Manage ImprovMX API Keys -->
  <div id="manageImprovmxKeysModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 580px;">
      <div class="modal-header">
        <h3 class="modal-title">ImprovMX API Keys & Accounts</h3>
        <button type="button" class="modal-close" onclick="window.closeManageKeysModal()">&times;</button>
      </div>
      <div class="modal-body">
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
          Connect multiple ImprovMX accounts or API keys to manage different custom domains across your research institute.
        </p>

        <!-- Connected Keys List -->
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary);">Configured API Keys</h4>
          <div id="improvmxKeysList" style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.84rem; color: var(--text-muted);">Loading keys...</div>
          </div>
        </div>

        <div id="addImprovmxKeySection" style="padding-top: 1rem; border-top: 1px solid var(--border-color);">
          <h4 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.6rem; color: var(--text-primary);">+ Connect Additional ImprovMX API Key</h4>
          <div class="form-group" style="margin-bottom: 0.75rem;">
            <label class="form-label">Account Label *</label>
            <input type="text" id="newKeyLabelInput" class="form-input" placeholder="e.g. Scholar Domain Account">
          </div>
          <div class="form-group" style="margin-bottom: 0.75rem;">
            <label class="form-label">ImprovMX API Key (sk_...) *</label>
            <input type="password" id="newKeySecretInput" class="form-input" placeholder="sk_xxxxxxxxxxxxxxxxxxxxxxxx">
          </div>
          <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.82rem; margin-bottom:0.85rem; cursor:pointer; color:var(--text-secondary);">
            <input type="checkbox" id="newKeyMakeDefaultInput" style="accent-color:#ea580c;"> Set as default institute key immediately
          </label>
          <button type="button" class="btn btn-primary btn-sm" id="addNewKeyBtn" onclick="window.handleAddNewApiKey()">
            Verify & Connect Key
          </button>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="window.closeManageKeysModal()">Close</button>
      </div>
    </div>
  </div>

  </section>

  <!-- ==========================================================================
       MODAL 1: "ADD A BLOCK" PALETTE (Blogger.com Style Modular Blocks)
       ========================================================================== -->
  <div id="addBlockModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 680px;">
      <div class="modal-header">
        <h3 class="modal-title">Add a Block</h3>
        <button class="modal-close" onclick="closeAddBlockModal()">&times;</button>
      </div>
      <div class="modal-body">
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
          Select a modular block type to insert into your publication:
        </p>

        <div class="block-picker-grid">
          <!-- Text -->
          <div class="block-picker-item" onclick="insertBlock('text')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
            </svg>
            <div class="block-picker-title">Text</div>
            <div class="block-picker-desc">Regular paragraph</div>
          </div>

          <!-- Heading -->
          <div class="block-picker-item" onclick="insertBlock('heading')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 12h16"/><path d="M4 4v16"/><path d="M20 4v16"/>
            </svg>
            <div class="block-picker-title">Heading</div>
            <div class="block-picker-desc">Section title (H2)</div>
          </div>

          <!-- Subheading -->
          <div class="block-picker-item" onclick="insertBlock('subheading')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 12h8"/><path d="M6 6v12"/><path d="M14 6v12"/><path d="M19 10v4"/>
            </svg>
            <div class="block-picker-title">Subheading</div>
            <div class="block-picker-desc">Smaller subsection</div>
          </div>

          <!-- Image -->
          <div class="block-picker-item" onclick="insertBlock('image')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
            <div class="block-picker-title">Image</div>
            <div class="block-picker-desc">Photo or graphic</div>
          </div>

          <!-- Code -->
          <div class="block-picker-item" onclick="insertBlock('code')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
            <div class="block-picker-title">Code</div>
            <div class="block-picker-desc">Code snippet</div>
          </div>

          <!-- Quote -->
          <div class="block-picker-item" onclick="insertBlock('quote')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
            </svg>
            <div class="block-picker-title">Quote</div>
            <div class="block-picker-desc">Blockquote & citation</div>
          </div>

          <!-- List -->
          <div class="block-picker-item" onclick="insertBlock('list')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <div class="block-picker-title">List</div>
            <div class="block-picker-desc">Bullet or numbered</div>
          </div>

          <!-- Callout -->
          <div class="block-picker-item" onclick="insertBlock('callout')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div class="block-picker-title">Callout</div>
            <div class="block-picker-desc">Highlighted note</div>
          </div>

          <!-- Table -->
          <div class="block-picker-item" onclick="insertBlock('table')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/>
            </svg>
            <div class="block-picker-title">Table</div>
            <div class="block-picker-desc">Data table</div>
          </div>

          <!-- Timeline -->
          <div class="block-picker-item" onclick="insertBlock('timeline')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <div class="block-picker-title">Timeline</div>
            <div class="block-picker-desc">Event milestones</div>
          </div>

          <!-- Music -->
          <div class="block-picker-item" onclick="insertBlock('music')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
            <div class="block-picker-title">Music</div>
            <div class="block-picker-desc">Spotify/YT + opinion</div>
          </div>

          <!-- Divider -->
          <div class="block-picker-item" onclick="insertBlock('divider')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"/>
            </svg>
            <div class="block-picker-title">Divider</div>
            <div class="block-picker-desc">Horizontal line</div>
          </div>

          <!-- Video -->
          <div class="block-picker-item" onclick="insertBlock('video')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="14" x="3" y="5" rx="2"/><polygon points="10 9 15 12 10 15 10 9"/>
            </svg>
            <div class="block-picker-title">Video</div>
            <div class="block-picker-desc">YouTube / MP4 embed</div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeAddBlockModal()">Cancel</button>
      </div>
    </div>
  </div>

  <!-- ==========================================================================
       MODAL 2: ADD / EDIT RESEARCHER & CORE TEAM MEMBER
       ========================================================================== -->
  <div id="researcherModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 650px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;">
      <div class="modal-header" style="flex-shrink: 0;">
        <h3 id="researcherModalTitle" class="modal-title">Add Researcher / Fellow</h3>
        <button class="modal-close" onclick="closeResearcherModal()">&times;</button>
      </div>
      <form id="researcherForm" style="display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; margin: 0;">
        <div class="modal-body" style="overflow-y: auto; flex: 1; min-height: 0; max-height: calc(90vh - 140px); padding: 1.5rem;">
          <input type="hidden" id="researcherEditId">

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="resNameInput">Full Name *</label>
              <input type="text" id="resNameInput" class="form-input" placeholder="e.g. Dr. Jane Smith" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="resEmailInput">Email Address *</label>
              <input type="email" id="resEmailInput" class="form-input" placeholder="curiomas.members@gmail.com" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="resAvatarInput">Profile Photo (PFP)</label>
            ${renderMediaPickerField({ id: 'resAvatarInput', accept: 'image/*', uploadLabel: 'Upload Photo', placeholder: 'Paste PFP URL or server path (/api/images/... or /assets/...)' })}
            <div style="display: flex; gap: 0.4rem; margin-top: 0.4rem; flex-wrap: wrap; font-size: 0.72rem;">
              <span style="color: var(--text-muted); align-self: center;">Avatar Presets:</span>
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="window.setMediaInputValue('resAvatarInput','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80')">Avatar 1</button>
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="window.setMediaInputValue('resAvatarInput','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80')">Avatar 2</button>
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="window.setMediaInputValue('resAvatarInput','https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80')">Avatar 3</button>
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="window.setMediaInputValue('resAvatarInput','https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80')">Avatar 4</button>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="resRoleInput">Role / Title *</label>
              <input type="text" id="resRoleInput" class="form-input" placeholder="e.g. Lead Investigator / Fellow" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="resDivisionInput">Division *</label>
              <select id="resDivisionInput" class="form-select" required>
                <option value="Executive Council">Executive Council</option>
                <option value="Space & Astrophysics">Space & Astrophysics</option>
                <option value="Ancient Biology & Paleontology">Ancient Biology & Paleontology</option>
                <option value="AI & Computational Science">AI & Computational Science</option>
                <option value="Astrobiology & Extremophiles">Astrobiology & Extremophiles</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="resUniversityInput">University / Institution</label>
              <input type="text" id="resUniversityInput" class="form-input" placeholder="e.g. MIT / Cambridge">
            </div>
            <div class="form-group">
              <label class="form-label" for="resDegreeInput">Degree / Field</label>
              <input type="text" id="resDegreeInput" class="form-input" placeholder="e.g. B.Sc. Astrophysics">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="resBioInput">Biography & Focus *</label>
            <textarea id="resBioInput" class="form-textarea" style="min-height: 70px;" placeholder="Brief bio describing research specialization..." required></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="resGithubInput">GitHub URL</label>
              <input type="text" id="resGithubInput" class="form-input" placeholder="github.com/username or full link">
            </div>
            <div class="form-group">
              <label class="form-label" for="resLinkedinInput">LinkedIn URL</label>
              <input type="text" id="resLinkedinInput" class="form-input" placeholder="linkedin.com/in/username or full link">
            </div>
          </div>

          <!-- Core Team Toggle & Ordering -->
          <div class="form-row" style="align-items: center; padding: 1rem; background: rgba(234, 88, 12, 0.05); border: 1px solid rgba(234, 88, 12, 0.15); border-radius: 10px;">
            <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.6rem;">
              <input type="checkbox" id="resIsTeamMember" style="width: 18px; height: 18px; accent-color: var(--accent-primary);">
              <label for="resIsTeamMember" style="font-weight: 600; font-size: 0.88rem; cursor: pointer; color: var(--text-primary); margin: 0;">
                Core Team Member (Displays in Real Team Section)
              </label>
            </div>
            <div class="form-group" style="margin: 0; max-width: 130px;">
              <label class="form-label" for="resOrderIndex" style="margin-bottom: 0.2rem; font-size: 0.75rem;">Display Order</label>
              <input type="number" id="resOrderIndex" class="form-input" value="1" min="1" max="99">
            </div>
          </div>
        </div>
        <div class="modal-footer" style="flex-shrink: 0;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="closeResearcherModal()">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Save Researcher Profile</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Application Review Modal -->
  <div id="appReviewModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 760px;">
      <div class="modal-header">
        <h3 class="modal-title" style="display:flex; align-items:center; gap:0.5rem;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Fellowship Application Review</span>
        </h3>
        <button class="modal-close">&times;</button>
      </div>
      <div id="appReviewDetails" class="modal-body" style="padding: 1.5rem;"></div>
      <div class="modal-footer" style="justify-content:space-between; flex-wrap:wrap; gap:0.5rem; background: var(--bg-surface); border-top: 1px solid var(--border-color); padding: 1rem 1.5rem;">
        <button id="rejectAppBtn" class="btn btn-sm" style="background:rgba(239, 68, 68, 0.1); color:#ef4444; border:1px solid rgba(239, 68, 68, 0.25); font-weight:600; padding:0.5rem 1rem;">
          ✕ Decline & Send Email
        </button>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;">
          <button id="reviewEmailApplicantBtn" class="btn btn-sm" style="background:rgba(234, 88, 12, 0.08); color:var(--accent-primary); border:1px solid rgba(234, 88, 12, 0.2);">
            ✉ Custom Email
          </button>
          <button id="reviewUnderwayBtn" class="btn btn-secondary btn-sm">Mark Under Review</button>
          <button id="acceptAppBtn" class="btn btn-primary btn-sm" style="font-weight:600; padding:0.5rem 1.25rem;">
            ✓ Accept & Provision Fellow
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- EmailJS Email Composer Modal -->
  <div id="emailComposerModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 680px;">
      <div class="modal-header">
        <h3 class="modal-title" style="display:flex; align-items:center; gap:0.55rem;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          <span>Email Dispatch (curiomas.members@gmail.com)</span>
        </h3>
        <button class="modal-close" onclick="closeEmailComposer()">&times;</button>
      </div>
      <form id="emailComposerForm">
        <div class="modal-body">
          <div class="form-group" style="margin-bottom: 1.15rem; background: rgba(234, 88, 12, 0.04); border: 1px solid rgba(234, 88, 12, 0.12); padding: 0.85rem; border-radius: 8px;">
            <label class="form-label" for="composerTemplateSelect" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
              <span>Quick Template / Preset</span>
              <span style="font-size:0.75rem; color:var(--text-muted);">Auto-fills subject and dispatch body</span>
            </label>
            <select id="composerTemplateSelect" class="form-input" onchange="applyComposerPreset(this.value)">
              <option value="custom">Custom Email (Blank)</option>
              <option value="fellow_accept">Fellowship Admission & Welcome (With Portal Login URL)</option>
              <option value="fellow_update">Fellowship Application Status Update</option>
              <option value="fellow_decline">Application Not Accepted Notice</option>
              <option value="inquiry_reply">Institute General Inquiry Response</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="composerToEmail">Recipient Email *</label>
              <input type="email" id="composerToEmail" class="form-input" required placeholder="recipient@university.edu">
            </div>
            <div class="form-group">
              <label class="form-label" for="composerToName">Recipient Name</label>
              <input type="text" id="composerToName" class="form-input" placeholder="e.g. Maya Lin">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="composerSubject">Subject *</label>
              <input type="text" id="composerSubject" class="form-input" required value="CRII Research Fellowship Update">
            </div>
            <div class="form-group">
              <label class="form-label" for="composerTemplateId" style="display:flex; justify-content:space-between; align-items:center;">
                <span>EmailJS Template ID *</span>
                <a href="https://dashboard.emailjs.com/admin/templates" target="_blank" rel="noopener" style="font-size:0.75rem; color:var(--accent-primary); text-decoration:underline;">
                  Find / Create Template &rarr;
                </a>
              </label>
              <input type="text" id="composerTemplateId" class="form-input" placeholder="e.g. zhelx7y" value="zhelx7y" required>
              <span style="font-size: 0.74rem; color: var(--text-muted); margin-top: 0.25rem; display: block;">
                From <a href="https://dashboard.emailjs.com/admin/templates" target="_blank" rel="noopener" style="color:var(--accent-primary); text-decoration:underline;">EmailJS Dashboard</a> (saved automatically once used).
              </span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="composerMessage">Message *</label>
            <textarea id="composerMessage" class="form-textarea" style="min-height: 150px;" required placeholder="Write your email dispatch to the applicant or team member..."></textarea>
          </div>

          <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; background: rgba(234, 88, 12, 0.06); border: 1px solid rgba(234, 88, 12, 0.15); padding: 0.85rem 1rem; border-radius: 8px;">
            <strong>EmailJS Service:</strong> <code>curiomas</code> (connected to <code>curiomas.members@gmail.com</code>)<br>
            Supported parameters in your EmailJS template: <code>{{to_email}}</code>, <code>{{to_name}}</code>, <code>{{subject}}</code>, <code>{{message}}</code>, <code>{{reply_to}}</code>.
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" onclick="closeEmailComposer()">Cancel</button>
          <button type="submit" id="composerSendBtn" class="btn btn-primary btn-sm">
            <span>Send Email via EmailJS</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Division Edit / Create Modal -->
  <div id="divisionModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 620px;">
      <div class="modal-header">
        <h3 id="divisionModalTitle" class="modal-title">Add Research Division</h3>
        <button class="modal-close" onclick="closeDivisionModal()">&times;</button>
      </div>
      <form id="divisionForm" onsubmit="handleSaveDivision(event)">
        <div class="modal-body" style="padding: 1.5rem;">
          <input type="hidden" id="divisionIdInput">
          
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" for="divisionTitleInput">Division Name / Title *</label>
            <input type="text" id="divisionTitleInput" class="form-input" required placeholder="e.g. Quantum Computing & Condensed Matter">
          </div>

          <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div class="form-group">
              <label class="form-label" for="divisionNumberInput">Division Number</label>
              <input type="text" id="divisionNumberInput" class="form-input" placeholder="e.g. 05">
            </div>
            <div class="form-group">
              <label class="form-label" for="divisionTagInput">Card Tag Header</label>
              <input type="text" id="divisionTagInput" class="form-input" placeholder="e.g. 05 / RESEARCH DIVISION">
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" for="divisionDescInput">Summary & Research Scope *</label>
            <textarea id="divisionDescInput" class="form-input" rows="3" required placeholder="Exploring macroscopic entanglement, topological quantum matter, and verifiable quantum simulations..."></textarea>
          </div>

          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" for="divisionImageInput">Cover Image *</label>
            ${renderMediaPickerField({ id: 'divisionImageInput', accept: 'image/*', uploadLabel: 'Upload Cover', placeholder: 'Paste banner URL or server path (/api/images/... or /assets/...)' })}
            <div style="display:flex; gap:0.4rem; margin-top:0.45rem; flex-wrap:wrap; font-size:0.75rem;">
              <span style="color:var(--text-muted); align-self:center;">Image Presets:</span>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="window.setMediaInputValue('divisionImageInput','https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80')">Quantum</button>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="window.setMediaInputValue('divisionImageInput','https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80')">Cosmology</button>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="window.setMediaInputValue('divisionImageInput','https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80')">Laboratory</button>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="window.setMediaInputValue('divisionImageInput','https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80')">Genomics</button>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 0.5rem;">
            <label class="form-label" for="divisionLinkInput">Target Link / Route</label>
            <input type="text" id="divisionLinkInput" class="form-input" placeholder="/research" value="/research">
          </div>
        </div>

        <div class="modal-footer" style="padding: 1rem 1.5rem; display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="closeDivisionModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" id="saveDivisionBtn">Save Division</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Cohort Edit / Create Modal -->
  <div id="cohortModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 620px;">
      <div class="modal-header">
        <h3 id="cohortModalTitle" class="modal-title">Add Cohort Profile</h3>
        <button class="modal-close" onclick="closeCohortModal()">&times;</button>
      </div>
      <form id="cohortForm" onsubmit="handleSaveCohort(event)">
        <div class="modal-body" style="padding: 1.5rem;">
          <input type="hidden" id="cohortIdInput">
          
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" for="cohortTitleInput">Target Cohort / Title *</label>
            <input type="text" id="cohortTitleInput" class="form-input" required placeholder="e.g. Undergraduates, Postgraduates, Self-Directed Researchers">
          </div>

          <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div class="form-group">
              <label class="form-label" for="cohortGradeInput">Grade / Academic Level *</label>
              <input type="text" id="cohortGradeInput" class="form-input" placeholder="e.g. Undergrad (1st - 4th Year), Grade 10-12">
              <div style="display:flex; gap:0.3rem; margin-top:0.35rem; flex-wrap:wrap; font-size:0.7rem;">
                <button type="button" class="btn btn-secondary btn-sm" style="padding:0.12rem 0.4rem; font-size:0.7rem;" onclick="document.getElementById('cohortGradeInput').value='Undergraduate (1st - 4th Year)'">Undergrad</button>
                <button type="button" class="btn btn-secondary btn-sm" style="padding:0.12rem 0.4rem; font-size:0.7rem;" onclick="document.getElementById('cohortGradeInput').value='Postgraduate / Master\'s'">Postgrad</button>
                <button type="button" class="btn btn-secondary btn-sm" style="padding:0.12rem 0.4rem; font-size:0.7rem;" onclick="document.getElementById('cohortGradeInput').value='High School / Grade 10-12'">Grade 10-12</button>
                <button type="button" class="btn btn-secondary btn-sm" style="padding:0.12rem 0.4rem; font-size:0.7rem;" onclick="document.getElementById('cohortGradeInput').value='Self-Directed / Independent'">Independent</button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="cohortDivisionInput">Target Division Scope</label>
              <select id="cohortDivisionInput" class="form-select">
                <option value="All Research Tracks">All Research Tracks</option>
              </select>
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" for="cohortDescInput">Description / Requirements *</label>
            <textarea id="cohortDescInput" class="form-input" rows="3" required placeholder="Early-stage researchers looking to contribute to real-world science beyond coursework..."></textarea>
          </div>

          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" for="cohortImageInput">Card Media / Photo *</label>
            ${renderMediaPickerField({ id: 'cohortImageInput', accept: 'image/*', uploadLabel: 'Upload Photo', placeholder: 'Paste cover URL or server path (/api/images/... or /assets/...)' })}
            <div style="display:flex; gap:0.4rem; margin-top:0.45rem; flex-wrap:wrap; font-size:0.75rem;">
              <span style="color:var(--text-muted); align-self:center;">Presets:</span>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="window.setMediaInputValue('cohortImageInput','https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80')">Lab Undergrad</button>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="window.setMediaInputValue('cohortImageInput','https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80')">Postgrad Group</button>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="window.setMediaInputValue('cohortImageInput','https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80')">Independent Research</button>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="window.setMediaInputValue('cohortImageInput','https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80')">Fellows & Mentors</button>
            </div>
          </div>

          <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 0.5rem;">
            <div class="form-group">
              <label class="form-label" for="cohortLinkInput">Action Link</label>
              <input type="text" id="cohortLinkInput" class="form-input" placeholder="/team#apply" value="/team#apply">
            </div>
            <div class="form-group">
              <label class="form-label" for="cohortLinkTextInput">Button / Link Text</label>
              <input type="text" id="cohortLinkTextInput" class="form-input" placeholder="Apply as Fellow" value="Apply as Fellow">
            </div>
          </div>
        </div>

        <div class="modal-footer" style="padding: 1rem 1.5rem; display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="closeCohortModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" id="saveCohortBtn">Save Cohort Profile</button>
        </div>
      </form>
    </div>
  </div>

  <div id="packageModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 660px;">
      <div class="modal-header">
        <h3 id="packageModalTitle" class="modal-title">Add Fellowship Package / Fee Tier</h3>
        <button type="button" class="modal-close" onclick="window.closePackageModal()">&times;</button>
      </div>
      <form id="packageForm" onsubmit="window.handleSavePackage(event)">
        <div class="modal-body" style="padding: 1.5rem; max-height: 75vh; overflow-y: auto;">
          <input type="hidden" id="pkgIdInput">
          <div class="form-row" style="display:grid; grid-template-columns:2fr 1fr; gap:1rem; margin-bottom:1rem;">
            <div class="form-group">
              <label class="form-label" for="pkgNameInput">Package / Tier Name *</label>
              <input type="text" id="pkgNameInput" class="form-input" required placeholder="e.g. Research Scholar Track">
            </div>
            <div class="form-group">
              <label class="form-label" for="pkgBadgeInput">Tag / Badge</label>
              <input type="text" id="pkgBadgeInput" class="form-input" placeholder="e.g. Most Popular, Free">
            </div>
          </div>

          <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem; margin-bottom:1rem;">
            <div class="form-group">
              <label class="form-label" for="pkgPriceInput">Student Fee Amount (0 = Free)</label>
              <input type="number" id="pkgPriceInput" class="form-input" min="0" step="any" value="0">
            </div>
            <div class="form-group">
              <label class="form-label" for="pkgCurrencyInput">Currency</label>
              <select id="pkgCurrencyInput" class="form-select">
                <option value="BDT">BDT (৳)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="pkgBillingInput">Billing Cycle</label>
              <select id="pkgBillingInput" class="form-select">
                <option value="One-time">One-time Fee</option>
                <option value="Per Cohort">Per Cohort</option>
                <option value="Monthly">Monthly</option>
                <option value="Free">Free / Sponsored</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:1rem;">
            <label class="form-label" for="pkgDescInput">Short Description</label>
            <textarea id="pkgDescInput" class="form-input" rows="2" placeholder="What this student package unlocks..."></textarea>
          </div>

          <div class="form-group" style="margin-bottom:1rem;">
            <label class="form-label" for="pkgBenefitsInput">Package Benefits (One per line) *</label>
            <textarea id="pkgBenefitsInput" class="form-input" rows="4" required placeholder="Custom @scholar.zone.id Email&#10;1-on-1 Research Mentorship&#10;Verified Publication Certificate&#10;Cloudflare D1 & Compute Access"></textarea>
          </div>

          <div class="form-group" style="margin-bottom:1rem;">
            <label class="form-label" for="pkgPaymentInstructionsInput">Payment Instructions (Shown if Fee > 0)</label>
            <textarea id="pkgPaymentInstructionsInput" class="form-input" rows="2" placeholder="e.g. Send fee via bKash/Nagad to 01XXXXXXXXX (Send Money) and enter Transaction ID below."></textarea>
          </div>

          <div class="form-group" style="margin-bottom:1rem;">
            <label class="form-label" for="pkgPaymentLinkInput">Optional Payment Portal / Checkout Link</label>
            <input type="text" id="pkgPaymentLinkInput" class="form-input" placeholder="/checkout or https://...">
          </div>

          <div style="display:flex; gap:1.5rem; flex-wrap:wrap; padding:0.75rem 1rem; background:var(--bg-secondary); border-radius:10px; border:1px solid var(--border-color);">
            <label style="display:flex; align-items:center; gap:0.45rem; font-size:0.86rem; font-weight:600; cursor:pointer;">
              <input type="checkbox" id="pkgHighlightedInput" style="accent-color:#ea580c;"> Highlight as Recommended Tier
            </label>
            <label style="display:flex; align-items:center; gap:0.45rem; font-size:0.86rem; font-weight:600; cursor:pointer;">
              <input type="checkbox" id="pkgActiveInput" checked style="accent-color:#10b981;"> Active (Selectable by Applicants)
            </label>
          </div>
        </div>
        <div class="modal-footer" style="padding: 1rem 1.5rem; display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="window.closePackageModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" id="savePackageBtn">Save Package</button>
        </div>
      </form>
    </div>
  </div>

  <div id="recruitPageModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 740px;">
      <div class="modal-header">
        <h3 id="recruitPageModalTitle" class="modal-title">Create Custom Recruit Landing Page</h3>
        <button type="button" class="modal-close" onclick="window.closeRecruitPageModal()">&times;</button>
      </div>
      <form id="recruitPageForm" onsubmit="window.handleSaveRecruitPage(event)">
        <div class="modal-body" style="padding: 1.5rem; max-height: 76vh; overflow-y: auto;">
          <input type="hidden" id="recIdInput">

          <div class="form-row" style="display:grid; grid-template-columns:2fr 1fr; gap:1rem; margin-bottom:1rem;">
            <div class="form-group">
              <label class="form-label" for="recTitleInput">Recruit Page Headline *</label>
              <input type="text" id="recTitleInput" class="form-input" required placeholder="e.g. Summer 2026 Frontier Research Fellowship" oninput="window.autoFillRecruitSlug(this.value)">
            </div>
            <div class="form-group">
              <label class="form-label" for="recSlugInput">URL Slug *</label>
              <input type="text" id="recSlugInput" class="form-input" required placeholder="summer-2026">
            </div>
          </div>

          <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem; margin-bottom:1rem;">
            <div class="form-group">
              <label class="form-label" for="recBadgeInput">Top Hero Badge</label>
              <input type="text" id="recBadgeInput" class="form-input" placeholder="COHORT 2026 • NOW HIRING">
            </div>
            <div class="form-group">
              <label class="form-label" for="recDivisionInput">Target Division Scope</label>
              <input type="text" id="recDivisionInput" class="form-input" placeholder="All Research Divisions">
            </div>
            <div class="form-group">
              <label class="form-label" for="recStatusInput">Page Status</label>
              <select id="recStatusInput" class="form-select">
                <option value="Active">Active (Public)</option>
                <option value="Draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:1rem;">
            <label class="form-label" for="recSubtitleInput">Hero Subtitle / Recruitment Pitch *</label>
            <textarea id="recSubtitleInput" class="form-input" rows="2" required placeholder="Explain the mission, mentorship, and why ambitious student researchers should join..."></textarea>
          </div>

          <div class="form-group" style="margin-bottom:1rem;">
            <label class="form-label" for="recHeroMediaInput">Hero Banner Image or Video</label>
            ${renderMediaPickerField({ id: 'recHeroMediaInput', accept: 'image/*,video/mp4,video/webm', uploadLabel: 'Upload Banner', placeholder: 'Paste image/video URL or server path (/assets/... or /api/images/...)' })}
          </div>

          <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
            <div class="form-group">
              <label class="form-label" for="recCtaTextInput">Primary CTA Button Label</label>
              <input type="text" id="recCtaTextInput" class="form-input" value="Apply for Fellowship">
            </div>
            <div class="form-group" style="display:flex; align-items:flex-end; padding-bottom:0.4rem;">
              <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.86rem; font-weight:600; cursor:pointer;">
                <input type="checkbox" id="recShowFormInput" checked style="accent-color:#ea580c;"> Embed Live Application Form on This Page
              </label>
            </div>
          </div>

          <div style="margin-bottom:1.15rem; padding:1rem; background:var(--bg-secondary); border-radius:10px; border:1px solid var(--border-color);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.65rem;">
              <label class="form-label" style="margin:0; font-weight:700;">Fellowship Benefits & Perks Cards</label>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.addRecruitBenefitRow()">+ Add Benefit</button>
            </div>
            <div id="recBenefitsBuilderList" style="display:flex; flex-direction:column; gap:0.6rem;"></div>
          </div>

          <div style="padding:1rem; background:var(--bg-secondary); border-radius:10px; border:1px solid var(--border-color);">
            <label class="form-label" style="margin-bottom:0.5rem; font-weight:700; display:block;">Attached Fee Packages / Tiers</label>
            <div id="recPackagesCheckboxList" style="display:flex; flex-wrap:wrap; gap:0.6rem;"></div>
          </div>
        </div>
        <div class="modal-footer" style="padding: 1rem 1.5rem; display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="window.closeRecruitPageModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" id="saveRecruitPageBtn">Save Recruit Page</button>
        </div>
      </form>
    </div>
  </div>

  <div id="aiImageGenModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 840px;">
      <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem;">
        <div>
          <h3 class="modal-title" style="margin:0; display:flex; align-items:center; gap:0.45rem;">
            <span>✨ Multi-AI Article Image Studio</span>
          </h3>
          <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.15rem;">Reads your full article to synthesize editable prompts & generate thumbnails or figures with automatic multi-provider fallbacks & R2 storage.</div>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.openAiProviderModal()" style="font-size:0.76rem; white-space:nowrap;">+ Add API</button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.closeAiImageStudio(); window.showTab('settings'); setTimeout(()=>document.getElementById('settingsAiApiManagerCard')?.scrollIntoView({behavior:'smooth'}),150);" style="font-size:0.76rem; white-space:nowrap;">⚙ Manage APIs</button>
          <button type="button" class="modal-close" onclick="window.closeAiImageStudio()">&times;</button>
        </div>
      </div>

      <div class="modal-body" style="padding: 1.35rem 1.5rem; max-height: 78vh; overflow-y: auto;">
        <div id="aiArticleContextBar" style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:0.75rem 1rem; margin-bottom:1.15rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.6rem;">
          <div style="font-size:0.82rem; color:var(--text-secondary);" id="aiArticleContextText">Scanning active article...</div>
          <button type="button" class="btn btn-secondary btn-sm" style="font-size:0.75rem;" onclick="window.draftAiPromptFromArticle()" id="aiDraftPromptBtn">🧠 Auto-Read Article & Draft Prompt</button>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(175px, 1fr)); gap:0.85rem; margin-bottom:1rem;">
          <div class="form-group" style="margin:0;">
            <label class="form-label" for="aiImgModeSelect" style="font-size:0.78rem;">Image Purpose</label>
            <select id="aiImgModeSelect" class="form-select" style="font-size:0.84rem;" onchange="window.syncAiModeRatio(this.value)">
              <option value="thumbnail">Cover Thumbnail</option>
              <option value="illustration">In-Article Illustration</option>
              <option value="diagram">Scientific Diagram / Infographic</option>
              <option value="banner">Editorial Header Banner</option>
            </select>
          </div>
          <div class="form-group" style="margin:0;">
            <label class="form-label" for="aiImgStyleSelect" style="font-size:0.78rem;">Visual Style</label>
            <select id="aiImgStyleSelect" class="form-select" style="font-size:0.84rem;">
              <option value="Editorial Scientific Photography">Editorial Scientific Photography</option>
              <option value="3D Molecular & Astrophysics Render">3D Molecular / Space Render</option>
              <option value="Minimalist Academic Diagram">Minimalist Academic Diagram</option>
              <option value="Futuristic Laboratory Concept Art">Futuristic Lab Concept Art</option>
              <option value="Photorealistic Macro Science">Photorealistic Macro Science</option>
              <option value="Classic Naturalist Scientific Illustration">Classic Scientific Illustration</option>
            </select>
          </div>
          <div class="form-group" style="margin:0;">
            <label class="form-label" for="aiImgProviderSelect" style="font-size:0.78rem;">AI Image Provider / Engine</label>
            <select id="aiImgProviderSelect" class="form-select" style="font-size:0.84rem;">
              <option value="auto">Auto Smart Cascade (Best + Free Fallback)</option>
            </select>
          </div>
          <div class="form-group" style="margin:0;">
            <label class="form-label" for="aiImgRatioSelect" style="font-size:0.78rem;">Aspect Ratio & Size</label>
            <div style="display:flex; gap:0.4rem;">
              <select id="aiImgRatioSelect" class="form-select" style="font-size:0.84rem; flex:1;">
                <option value="16:9">16:9</option>
                <option value="3:2">3:2</option>
                <option value="4:3">4:3</option>
                <option value="1:1">1:1</option>
                <option value="9:16">9:16</option>
              </select>
              <select id="aiImgSizeSelect" class="form-select" style="font-size:0.84rem; width:74px;">
                <option value="1K">1K</option>
                <option value="2K">2K</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-group" style="margin-bottom:1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
            <label class="form-label" for="aiImgPromptInput" style="margin:0; font-weight:700;">Image Prompt (Fully Editable)</label>
            <span style="font-size:0.74rem; color:var(--text-muted);">Auto-generated from your article — customize freely before generating</span>
          </div>
          <textarea id="aiImgPromptInput" class="form-textarea" rows="4" placeholder="Click 'Auto-Read Article & Draft Prompt' or write/modify your own visual description here..."></textarea>
        </div>

        <div style="display:flex; gap:0.65rem; align-items:center; flex-wrap:wrap; margin-bottom:1.25rem;">
          <button type="button" class="btn btn-primary" id="aiGenerateImgBtn" onclick="window.runAiImageGeneration()" style="padding:0.65rem 1.5rem; font-weight:700;">
            ✨ Generate Image
          </button>
          <span id="aiGenStatusText" style="font-size:0.82rem; color:var(--text-muted);"></span>
        </div>

        <div id="aiResultPreviewSection" style="display:none; border-top:1px solid var(--border-color); padding-top:1.15rem;">
          <div style="border-radius:12px; overflow:hidden; border:1px solid var(--border-color); background:#0f172a; margin-bottom:0.85rem; text-align:center;">
            <img id="aiGeneratedPreviewImg" src="" alt="AI Generated Result" style="max-width:100%; max-height:360px; object-fit:contain; display:block; margin:0 auto;">
          </div>
          <div style="display:flex; gap:0.55rem; flex-wrap:wrap; align-items:center; justify-content:space-between;">
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button type="button" class="btn btn-primary btn-sm" onclick="window.applyAiImageAsCover()">Use as Article Thumbnail</button>
              <button type="button" class="btn btn-secondary btn-sm" id="aiInsertBodyBtn" onclick="window.insertAiImageIntoArticle()">Insert into Article Body</button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.copyAiImageUrl()">Copy R2 URL</button>
            </div>
            <span id="aiGeneratedR2Badge" style="font-size:0.74rem; color:#10b981; font-weight:700;"></span>
          </div>

          <div id="aiSessionHistoryWrap" style="display:none; margin-top:1rem;">
            <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.45rem;">Generated Variations (Click to Select)</div>
            <div id="aiSessionHistoryGrid" style="display:flex; gap:0.6rem; overflow-x:auto; padding-bottom:0.25rem;"></div>
          </div>
        </div>
      </div>

      <div class="modal-footer" style="padding:0.85rem 1.5rem; display:flex; justify-content:flex-end;">
        <button type="button" class="btn btn-secondary" onclick="window.closeAiImageStudio()">Close</button>
      </div>
    </div>
  </div>

  <div id="aiProviderModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 680px;">
      <div class="modal-header">
        <h3 id="aiProviderModalTitle" class="modal-title">Connect AI / Image Generation API</h3>
        <button type="button" class="modal-close" onclick="window.closeAiProviderModal()">&times;</button>
      </div>
      <form id="aiProviderForm" onsubmit="window.handleSaveAiProvider(event)">
        <div class="modal-body" style="padding: 1.4rem 1.5rem; max-height: 76vh; overflow-y: auto;">
          <input type="hidden" id="aiProvIdInput">
          <input type="hidden" id="aiProvAdapterInput">

          <div class="form-group" style="margin-bottom:0.85rem;">
            <label class="form-label" for="aiProvQuickFilter">Filter 61+ Providers</label>
            <input type="text" id="aiProvQuickFilter" class="form-input" placeholder="Type to filter (e.g. Groq, FLUX, Claude, Hugging Face, AI Horde, DeepSeek...)" oninput="window.filterAiVendorSelect(this.value)">
          </div>

          <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
            <div class="form-group">
              <label class="form-label" for="aiProvVendorInput">Provider / Company *</label>
              <select id="aiProvVendorInput" class="form-select" onchange="window.applyAiVendorPreset(this.value)"></select>
            </div>
            <div class="form-group">
              <label class="form-label" for="aiProvLabelInput">Display Name / Label *</label>
              <input type="text" id="aiProvLabelInput" class="form-input" required placeholder="e.g. Groq Llama 3.3 Free">
            </div>
          </div>

          <div id="aiProvGuideBanner" style="font-size:0.8rem; color:var(--text-secondary); background:rgba(234,88,12,0.06); border:1px solid rgba(234,88,12,0.22); border-radius:8px; padding:0.7rem 0.9rem; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center; gap:0.75rem; flex-wrap:wrap;"></div>

          <div class="form-group" style="margin-bottom:1rem;">
            <label class="form-label" for="aiProvKeyInput">API Key / Token <span id="aiProvKeyHint" style="font-weight:400; color:var(--text-muted); font-size:0.78rem;"></span></label>
            <input type="password" id="aiProvKeyInput" class="form-input" placeholder="Paste API key (leave blank while editing to keep existing key)">
          </div>

          <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
            <div class="form-group" id="aiProvAccountIdGroup" style="display:none;">
              <label class="form-label" for="aiProvAccountIdInput">Cloudflare Account ID *</label>
              <input type="text" id="aiProvAccountIdInput" class="form-input" placeholder="32-character Cloudflare Account ID">
            </div>
            <div class="form-group" id="aiProvBaseUrlGroup">
              <label class="form-label" for="aiProvBaseUrlInput">API Base URL</label>
              <input type="text" id="aiProvBaseUrlInput" class="form-input" placeholder="https://api.openai.com/v1">
            </div>
          </div>

          <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
            <div class="form-group">
              <label class="form-label" for="aiProvImageModelInput">Image Generation Model ID</label>
              <input type="text" id="aiProvImageModelInput" class="form-input" placeholder="e.g. flux, black-forest-labs/FLUX.1-schnell">
            </div>
            <div class="form-group">
              <label class="form-label" for="aiProvTextModelInput">Text / Writer / Help Model ID</label>
              <input type="text" id="aiProvTextModelInput" class="form-input" placeholder="e.g. llama-3.3-70b-versatile, gpt-4o-mini">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(170px, 1fr)); gap:0.65rem; padding:0.85rem 1rem; background:var(--bg-secondary); border-radius:10px; border:1px solid var(--border-color);">
            <label style="display:flex; align-items:center; gap:0.45rem; font-size:0.84rem; font-weight:600; cursor:pointer;">
              <input type="checkbox" id="aiProvSupportsImageInput" checked style="accent-color:#ea580c;"> Supports Image Gen
            </label>
            <label style="display:flex; align-items:center; gap:0.45rem; font-size:0.84rem; font-weight:600; cursor:pointer;">
              <input type="checkbox" id="aiProvSupportsTextInput" style="accent-color:#ea580c;"> Supports Text / Writer
            </label>
            <label style="display:flex; align-items:center; gap:0.45rem; font-size:0.84rem; font-weight:600; cursor:pointer;">
              <input type="checkbox" id="aiProvDefaultImageInput" style="accent-color:#ea580c;"> Default Image Engine
            </label>
            <label style="display:flex; align-items:center; gap:0.45rem; font-size:0.84rem; font-weight:600; cursor:pointer;">
              <input type="checkbox" id="aiProvDefaultTextInput" style="accent-color:#ea580c;"> Default Writer / Text Engine
            </label>
          </div>
        </div>
        <div class="modal-footer" style="padding:1rem 1.5rem; display:flex; justify-content:flex-end; gap:0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="window.closeAiProviderModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" id="aiSaveProviderBtn">Save AI Provider</button>
        </div>
      </form>
    </div>
  </div>

  <div id="aiWriterModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 860px;">
      <div class="modal-header" style="background: linear-gradient(135deg, rgba(234,88,12,0.12), rgba(234,88,12,0.03)); border-bottom: 1px solid var(--border-color);">
        <div>
          <h3 class="modal-title" style="display:flex; align-items:center; gap:0.5rem; margin:0;">
            <span>✍</span>
            <span>AI Research Writer Co-Pilot</span>
          </h3>
          <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.15rem;">Draft full research articles, outlines, academic rewrites, Bengali/English translations, or auto-fill Summary, Abstract & Tags directly into your editor.</div>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.openAiProviderModal()" style="font-size:0.76rem; white-space:nowrap;">+ Add API</button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.closeAiWriterModal(); window.showTab('settings'); setTimeout(()=>document.getElementById('settingsAiApiManagerCard')?.scrollIntoView({behavior:'smooth'}),150);" style="font-size:0.76rem; white-space:nowrap;">⚙ Manage APIs</button>
          <button type="button" class="modal-close" onclick="window.closeAiWriterModal()">&times;</button>
        </div>
      </div>

      <div class="modal-body" style="padding: 1.35rem 1.5rem; max-height: 78vh; overflow-y: auto;">
        <div id="aiWriterContextBar" style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:0.65rem 0.95rem; margin-bottom:1rem; font-size:0.82rem; color:var(--text-secondary);"></div>

        <div style="margin-bottom:1rem;">
          <div style="font-size:0.74rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.45rem;">Select AI Writing Action</div>
          <div id="aiWriterModeChips" style="display:flex; gap:0.4rem; flex-wrap:wrap;">
            <button type="button" class="btn btn-sm btn-primary" data-wmode="full_draft" onclick="window.selectAiWriterMode('full_draft', this)">📝 Full Article Draft</button>
            <button type="button" class="btn btn-sm btn-secondary" data-wmode="outline" onclick="window.selectAiWriterMode('outline', this)">🗂 Research Outline</button>
            <button type="button" class="btn btn-sm btn-secondary" data-wmode="continue" onclick="window.selectAiWriterMode('continue', this)">⏩ Continue Writing</button>
            <button type="button" class="btn btn-sm btn-secondary" data-wmode="expand" onclick="window.selectAiWriterMode('expand', this)">🔬 Expand & Deepen</button>
            <button type="button" class="btn btn-sm btn-secondary" data-wmode="polish" onclick="window.selectAiWriterMode('polish', this)">✨ Academic Polish</button>
            <button type="button" class="btn btn-sm btn-secondary" data-wmode="simplify" onclick="window.selectAiWriterMode('simplify', this)">🎓 Student-Friendly</button>
            <button type="button" class="btn btn-sm btn-secondary" data-wmode="abstract_tags" onclick="window.selectAiWriterMode('abstract_tags', this)">🏷 Abstract, Summary & Tags</button>
            <button type="button" class="btn btn-sm btn-secondary" data-wmode="key_takeaways" onclick="window.selectAiWriterMode('key_takeaways', this)">💡 Key Takeaways</button>
            <button type="button" class="btn btn-sm btn-secondary" data-wmode="translate_bn" onclick="window.selectAiWriterMode('translate_bn', this)">🇧🇩 Translate to Bengali</button>
            <button type="button" class="btn btn-sm btn-secondary" data-wmode="translate_en" onclick="window.selectAiWriterMode('translate_en', this)">🌐 Translate to English</button>
            <button type="button" class="btn btn-sm btn-secondary" data-wmode="custom" onclick="window.selectAiWriterMode('custom', this)">🎯 Custom Prompt</button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(185px, 1fr)); gap:0.8rem; margin-bottom:0.95rem;">
          <div class="form-group" style="margin:0;">
            <label class="form-label" for="aiWriterProviderSelect" style="font-size:0.78rem;">Text AI Engine</label>
            <select id="aiWriterProviderSelect" class="form-select" style="font-size:0.84rem;">
              <option value="auto">Auto Smart Cascade (Free Fallbacks)</option>
            </select>
          </div>
          <div class="form-group" style="margin:0;">
            <label class="form-label" for="aiWriterToneSelect" style="font-size:0.78rem;">Writing Tone</label>
            <select id="aiWriterToneSelect" class="form-select" style="font-size:0.84rem;">
              <option value="Academic & Peer-Reviewed">Academic & Peer-Reviewed</option>
              <option value="Accessible Science Journalism">Accessible Science Journalism</option>
              <option value="Technical Research Dispatch">Technical Research Dispatch</option>
              <option value="Student-Friendly Explainer">Student-Friendly Explainer</option>
            </select>
          </div>
          <div class="form-group" style="margin:0;">
            <label class="form-label" for="aiWriterLengthSelect" style="font-size:0.78rem;">Target Length</label>
            <select id="aiWriterLengthSelect" class="form-select" style="font-size:0.84rem;">
              <option value="Short">Short (~300 words)</option>
              <option value="Medium" selected>Medium (~650 words)</option>
              <option value="Comprehensive">Comprehensive (~1200 words)</option>
            </select>
          </div>
        </div>

        <div class="form-group" style="margin-bottom:0.95rem;">
          <label class="form-label" for="aiWriterInstructionInput" style="font-size:0.82rem; font-weight:700;">Custom Instructions / Focus Notes (Optional)</label>
          <textarea id="aiWriterInstructionInput" class="form-textarea" rows="2" placeholder="e.g. Focus on computational methods, include a methodology section, cite key theoretical frameworks..."></textarea>
        </div>

        <div style="display:flex; gap:0.65rem; align-items:center; flex-wrap:wrap; margin-bottom:1.15rem;">
          <button type="button" class="btn btn-primary" id="aiWriterRunBtn" onclick="window.runAiWriterAssist()" style="padding:0.6rem 1.45rem; font-weight:700;">✍ Generate with AI</button>
          <span id="aiWriterStatusText" style="font-size:0.82rem; color:var(--text-muted);"></span>
        </div>

        <div id="aiWriterResultSection" style="display:none; border-top:1px solid var(--border-color); padding-top:1.1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem; flex-wrap:wrap; gap:0.5rem;">
            <label class="form-label" for="aiWriterOutputTextarea" style="margin:0; font-weight:700;">AI Generated Output (Editable Before Inserting)</label>
            <span id="aiWriterModelBadge" style="font-size:0.74rem; color:#10b981; font-weight:700;"></span>
          </div>
          <textarea id="aiWriterOutputTextarea" class="form-textarea" rows="11" style="font-family:inherit; line-height:1.6; margin-bottom:0.85rem;"></textarea>

          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;">
            <button type="button" class="btn btn-primary btn-sm" id="aiWriterInsertBtn" onclick="window.applyAiWriterToEditor(false)">+ Insert into Article</button>
            <button type="button" class="btn btn-secondary btn-sm" id="aiWriterReplaceBtn" onclick="window.applyAiWriterToEditor(true)">Replace Article Body</button>
            <button type="button" class="btn btn-primary btn-sm" id="aiWriterApplyMetaBtn" style="display:none;" onclick="window.applyAiWriterMetadata()">✓ Fill Summary, Abstract & Tags</button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.copyAiWriterOutput()">Copy Text</button>
          </div>
        </div>
      </div>

      <div class="modal-footer" style="padding:0.85rem 1.5rem; display:flex; justify-content:flex-end;">
        <button type="button" class="btn btn-secondary" onclick="window.closeAiWriterModal()">Close</button>
      </div>
    </div>
  </div>

  <div id="aiHelpModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 820px;">
      <div class="modal-header" style="background: linear-gradient(135deg, rgba(234,88,12,0.12), rgba(234,88,12,0.03)); border-bottom: 1px solid var(--border-color);">
        <div>
          <h3 class="modal-title" style="display:flex; align-items:center; gap:0.5rem; margin:0;">
            <span>✨</span>
            <span>CRII AI Help Assistant & Free APIs Center</span>
          </h3>
          <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.15rem;">Ask AI anything about the portal, writing papers, or setting up 60+ free AI & image APIs.</div>
        </div>
        <button type="button" class="modal-close" onclick="window.closeAiHelpModal()">&times;</button>
      </div>

      <div style="display:flex; gap:0.4rem; padding:0.75rem 1.5rem 0; border-bottom:1px solid var(--border-color); flex-wrap:wrap;">
        <button type="button" class="btn btn-sm btn-primary" id="aiHelpTabBtn_chat" onclick="window.switchAiHelpTab('chat')">💬 Ask AI Assistant</button>
        <button type="button" class="btn btn-sm btn-secondary" id="aiHelpTabBtn_free_apis" onclick="window.switchAiHelpTab('free_apis')">🎁 Best Free AI APIs (No Card)</button>
        <button type="button" class="btn btn-sm btn-secondary" id="aiHelpTabBtn_shortcuts" onclick="window.switchAiHelpTab('shortcuts')">📘 Portal Quick Guide</button>
      </div>

      <div class="modal-body" style="padding: 1.25rem 1.5rem; max-height: 72vh; overflow-y: auto;">
        <div id="aiHelpPane_chat">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.75rem;">
            <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
              <button type="button" class="btn btn-secondary btn-sm" style="font-size:0.73rem; padding:0.2rem 0.55rem;" onclick="window.sendQuickAiHelp('Which free AI APIs give free keys with no credit card for images and writing?')">Best free APIs?</button>
              <button type="button" class="btn btn-secondary btn-sm" style="font-size:0.73rem; padding:0.2rem 0.55rem;" onclick="window.sendQuickAiHelp('How do I set up Cloudflare Workers AI free 10,000 daily neurons in Settings?')">Cloudflare AI setup</button>
              <button type="button" class="btn btn-secondary btn-sm" style="font-size:0.73rem; padding:0.2rem 0.55rem;" onclick="window.sendQuickAiHelp('How do I use AI Writer and AI Image Studio together to publish a research article?')">AI Writer workflow</button>
              <button type="button" class="btn btn-secondary btn-sm" style="font-size:0.73rem; padding:0.2rem 0.55rem;" onclick="window.sendQuickAiHelp('How do I add unique custom fields and recruit packages for student fellowships?')">Recruit & Unique fields</button>
            </div>
            <div style="display:flex; align-items:center; gap:0.4rem;">
              <select id="aiHelpProviderSelect" class="form-select" style="font-size:0.76rem; padding:0.28rem 0.5rem; width:auto; max-width:210px;">
                <option value="auto">Auto Free AI Cascade</option>
              </select>
              <button type="button" class="btn btn-secondary btn-sm" style="font-size:0.73rem;" onclick="window.clearAiHelpChat()">Clear</button>
            </div>
          </div>

          <div id="aiHelpMessagesBox" style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px; padding:1rem; min-height:280px; max-height:380px; overflow-y:auto; display:flex; flex-direction:column; gap:0.75rem; margin-bottom:0.85rem;"></div>

          <form onsubmit="window.handleSendAiHelp(event)" style="display:flex; gap:0.5rem; align-items:center;">
            <input type="text" id="aiHelpChatInput" class="form-input" placeholder="Ask anything about CRII Portal, writing articles, free AI APIs, or troubleshooting..." style="flex:1;">
            <button type="submit" class="btn btn-primary" id="aiHelpSendBtn" style="white-space:nowrap;">Send ↵</button>
          </form>
        </div>

        <div id="aiHelpPane_free_apis" style="display:none;">
          <div style="font-size:0.84rem; color:var(--text-secondary); margin-bottom:1rem; line-height:1.55;">
            These top providers offer generous <strong>100% free tiers without a credit card</strong>. Click <strong>Connect →</strong> on any card to open the pre-filled setup form, or click <strong>Get Key ↗</strong> to grab a free key in ~30 seconds.
          </div>
          <div id="aiHelpFreeApisGrid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(245px, 1fr)); gap:0.75rem;"></div>
        </div>

        <div id="aiHelpPane_shortcuts" style="display:none;">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:0.85rem;">
            <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:1rem;">
              <div style="font-weight:700; color:var(--text-primary); margin-bottom:0.35rem;">✍ AI Article Writer</div>
              <div style="font-size:0.8rem; color:var(--text-secondary); line-height:1.55;">Open any article in <strong>Publications & Blog</strong> and click <strong>✍ AI Writer</strong> to generate full drafts, outlines, academic rewrites, Bengali/English translations, or auto-fill Summary, Abstract & Tags. Works in both Word and Block editors.</div>
            </div>
            <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:1rem;">
              <div style="font-weight:700; color:var(--text-primary); margin-bottom:0.35rem;">✨ AI Image Studio</div>
              <div style="font-size:0.8rem; color:var(--text-secondary); line-height:1.55;">Reads your full article to craft an editable visual prompt, then generates cover thumbnails or in-article figures via your chosen engine (with built-in free FLUX & AI Horde fallbacks) and saves directly to <strong>Cloudflare R2</strong>.</div>
            </div>
            <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:1rem;">
              <div style="font-weight:700; color:var(--text-primary); margin-bottom:0.35rem;">⚡ 61+ AI APIs Hub</div>
              <div style="font-size:0.8rem; color:var(--text-secondary); line-height:1.55;">Go to <strong>Institute & Navbar → AI & External APIs Management Hub</strong> to browse 61+ free & studio AI providers, test connections live, set Default Image & Text engines, and enable automatic cascading fallbacks.</div>
            </div>
            <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:1rem;">
              <div style="font-weight:700; color:var(--text-primary); margin-bottom:0.35rem;">📤 R2 Upload-First Media</div>
              <div style="font-size:0.8rem; color:var(--text-secondary); line-height:1.55;">Every media field defaults to <strong>Upload</strong> straight to Cloudflare R2. Click the adjacent <strong>URL</strong> button anytime to paste external links or local server paths (<code>/assets/...</code>, <code>/api/images/...</code>).</div>
            </div>
            <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:1rem;">
              <div style="font-weight:700; color:var(--text-primary); margin-bottom:0.35rem;">🎓 Recruit Pages & Unique Fields</div>
              <div style="font-size:0.8rem; color:var(--text-secondary); line-height:1.55;">Use <strong>Who Can Join Us?</strong> to add 14 custom field types (rating, image, video, pfp, id, number) with live <strong>Unique</strong> duplicate checks, and <strong>Packages & Recruit Pages</strong> for fees & custom landing pages.</div>
            </div>
            <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:1rem;">
              <div style="font-weight:700; color:var(--text-primary); margin-bottom:0.35rem;">✉ ImprovMX & EmailJS</div>
              <div style="font-size:0.8rem; color:var(--text-secondary); line-height:1.55;">Manage researcher <code>@scholar.zone.id</code> aliases in <strong>Researcher Emails</strong> (add, remove, or switch default ImprovMX API keys) and dispatch fellowship notices via <strong>Email Dispatcher</strong>.</div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer" style="padding:0.85rem 1.5rem; display:flex; justify-content:space-between; align-items:center;">
        <button type="button" class="btn btn-secondary btn-sm" onclick="window.closeAiHelpModal(); window.showTab('settings'); setTimeout(()=>document.getElementById('settingsAiApiManagerCard')?.scrollIntoView({behavior:'smooth'}),150);">⚙ Open 61+ AI APIs Hub</button>
        <button type="button" class="btn btn-secondary" onclick="window.closeAiHelpModal()">Close</button>
      </div>
    </div>
  </div>

  <button type="button" id="portalFloatingAiHelpBtn" onclick="window.openAiHelpModal('chat')" title="CRII AI Assistant & Free APIs Help" style="position:fixed; right:1.35rem; bottom:1.35rem; z-index:950; display:inline-flex; align-items:center; gap:0.45rem; padding:0.62rem 1.05rem; border-radius:999px; border:1px solid rgba(234,88,12,0.45); background:linear-gradient(135deg, #ea580c, #f97316); color:#ffffff; font-weight:700; font-size:0.84rem; box-shadow:0 10px 26px rgba(234,88,12,0.34); cursor:pointer;">
    <span>✨</span>
    <span>AI Help</span>
  </button>

    </div>
  `;
}

export async function mountPortalPage(router) {
  // 1. Strict Authentication Guard
  if (!auth.isAuthenticated()) {
    if (router) router.navigate('/login?redirect=/portal');
    else window.location.href = '/login?redirect=/portal';
    return;
  }

  // 2. Verify Session with Cloudflare D1 SQL Backend in background
  auth.verifySession().then(res => {
    if (res && res.revoked) {
      if (window.showToast) window.showToast('Your session has expired. Please sign in again.', 'error');
      if (router) router.navigate('/login');
      else window.location.href = '/login';
    }
  });

  // 3. Initialize Portal Dashboard Engine
  if (typeof window.initPortalDashboard === 'function') {
    window.initPortalDashboard();
  }
}
