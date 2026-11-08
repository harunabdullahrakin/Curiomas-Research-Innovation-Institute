/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Portal Dashboard Page Component
 */

import { auth } from '../services/auth.js';

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

          <button class="portal-nav-btn" data-tab="permissions" data-tooltip="Access Control">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>
            </svg>
            <span class="portal-nav-label">Access Control</span>
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
            <span class="portal-nav-badge" style="background: rgba(37, 99, 235, 0.15); color: #2563eb; font-weight: 700;">Gmail</span>
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
                <label class="form-label" for="bloggerCoverInput">Cover Image URL</label>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <input type="url" id="bloggerCoverInput" class="form-input" style="flex: 1;" placeholder="https://images.unsplash.com/... or upload below">
                  <label class="btn btn-secondary btn-sm" style="cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap; margin-bottom: 0; padding: 0.5rem 0.85rem;" title="Upload image directly to Cloudflare R2 storage">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span>Upload Image</span>
                    <input type="file" id="bloggerCoverFileInput" accept="image/*" style="display: none;" onchange="handleCoverFileUpload(event)">
                  </label>
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
              <div class="form-group" style="display: flex; align-items: center; gap: 0.75rem; background: rgba(37, 99, 235, 0.08); padding: 0.9rem 1.15rem; border-radius: 10px; border: 1.5px solid rgba(37, 99, 235, 0.25); margin-bottom: 1.5rem;">
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
                <label class="form-label" for="bloggerSummaryInput">Summary / Excerpt *</label>
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
            </div>

            <!-- Custom Questions Builder -->
            <div style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.75rem;">
                <div>
                  <h4 style="font-weight:600; margin-bottom:0.25rem;">Custom Questions & Additional Fields</h4>
                  <p style="font-size:0.8rem; color:var(--text-muted);">Add new fields such as Graduation Year, GPA, Discord Handle, or Weekly Availability.</p>
                </div>
                <button type="button" class="btn btn-secondary btn-sm" onclick="addCustomFormFieldRow()">
                  + Add Custom Question
                </button>
              </div>

              <div id="customFieldsBuilderList" style="display:flex; flex-direction:column; gap:0.75rem;">
                <!-- Populated by portal.js -->
              </div>
            </div>

            <div style="margin-top: 1.5rem; text-align:right;">
              <button type="submit" class="btn btn-primary" style="padding: 0.65rem 1.75rem;">
                Save Form Settings & Questions
              </button>
            </div>
          </form>
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
      <div id="tab-settings" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Institute & Appearance Settings</h1>
            <p>Configure the homepage hero video, backdrop blur, overlay darkness, navbar title, and single sign-on settings.</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1.5rem; max-width: 1040px;">
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

                
                <!-- Add New Image URL or Upload File -->
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
                  <input type="url" id="newHeroImageUrl" class="form-input" placeholder="Paste image URL (https://...)" style="flex: 1; min-width: 180px;">
                  <button type="button" class="btn btn-secondary" onclick="addHeroImageFromInput()" style="white-space: nowrap; padding: 0.5rem 1rem;">
                    + Add URL
                  </button>
                  <input type="file" id="heroImageUploadInput" accept="image/*" style="display: none;" onchange="handleHeroImageUpload(event)">
                  <button type="button" class="btn btn-secondary" onclick="document.getElementById('heroImageUploadInput').click()" style="white-space: nowrap; padding: 0.5rem 1rem;">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.35rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span>Upload Image</span>
                  </button>
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

                <!-- Add New Video URL or Upload File -->
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
                  <input type="url" id="newHeroVideoUrl" class="form-input" placeholder="Paste video URL (https://... or .mp4 / .webm)" style="flex: 1; min-width: 180px;">
                  <button type="button" class="btn btn-secondary" onclick="addHeroVideoFromInput()" style="white-space: nowrap; padding: 0.5rem 1rem;">
                    + Add Video URL
                  </button>
                  <input type="file" id="heroVideoUploadInput" accept="video/mp4,video/webm" style="display: none;" onchange="handleHeroVideoUpload(event)">
                  <button type="button" class="btn btn-secondary" onclick="document.getElementById('heroVideoUploadInput').click()" style="white-space: nowrap; padding: 0.5rem 1rem;">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.35rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span>Upload Video</span>
                  </button>
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
                <label class="form-label" for="settingLogoUrl">Institute Logo Image URL (Optional)</label>
                <input type="url" id="settingLogoUrl" class="form-input" placeholder="https://example.com/logo.png">
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

              <div style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; background: rgba(37,99,235,0.05); padding: 0.75rem; border-radius: 6px; margin-top: 1rem;">
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

        <!-- Metrics Cards -->
        <div class="portal-stats-grid" style="margin-bottom: 2rem;">
          <div class="stat-card">
            <div class="stat-icon-wrapper" style="background: rgba(37,99,235,0.1); color: #2563eb;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Total Stored Objects</span>
              <span class="stat-value" id="storageTotalCount">0</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper" style="background: rgba(16,185,129,0.1); color: #10b981;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Storage Used</span>
              <span class="stat-value" id="storageTotalSize">0 MB</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper" style="background: rgba(245,158,11,0.1); color: #f59e0b;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Video Files</span>
              <span class="stat-value" id="storageVideoCount">0</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper" style="background: rgba(139,92,246,0.1); color: #8b5cf6;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m10 15 5-3-5-3v6Z"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Image Files</span>
              <span class="stat-value" id="storageImageCount">0</span>
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
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="var(--accent-primary, #0284c7)" stroke-width="1.8" style="margin-bottom: 0.65rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">Drag and drop files here, or click to upload</div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">Supports PNG, JPG, WEBP, SVG, GIF images and MP4, WEBM videos (Up to 100MB per file)</div>
          </div>
        </div>

        <!-- Media Grid Container -->
        <div id="storageMediaGrid" class="storage-media-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <!-- Dynamically populated -->
        </div>
      </div>
    </main>
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
            <label class="form-label" for="resAvatarInput">Profile Photo (PFP URL)</label>
            <input type="url" id="resAvatarInput" class="form-input" placeholder="https://images.unsplash.com/...">
            <div style="display: flex; gap: 0.4rem; margin-top: 0.4rem; flex-wrap: wrap; font-size: 0.72rem;">
              <span style="color: var(--text-muted); align-self: center;">Avatar Presets:</span>
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="document.getElementById('resAvatarInput').value='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'">Avatar 1</button>
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="document.getElementById('resAvatarInput').value='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'">Avatar 2</button>
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="document.getElementById('resAvatarInput').value='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'">Avatar 3</button>
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="document.getElementById('resAvatarInput').value='https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'">Avatar 4</button>
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
              <input type="url" id="resGithubInput" class="form-input" placeholder="https://github.com/username">
            </div>
            <div class="form-group">
              <label class="form-label" for="resLinkedinInput">LinkedIn URL</label>
              <input type="url" id="resLinkedinInput" class="form-input" placeholder="https://linkedin.com/in/username">
            </div>
          </div>

          <!-- Core Team Toggle & Ordering -->
          <div class="form-row" style="align-items: center; padding: 1rem; background: rgba(37, 99, 235, 0.05); border: 1px solid rgba(37, 99, 235, 0.15); border-radius: 10px;">
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
          <button id="reviewEmailApplicantBtn" class="btn btn-sm" style="background:rgba(37,99,235,0.08); color:var(--accent-primary); border:1px solid rgba(37,99,235,0.2);">
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
          <div class="form-group" style="margin-bottom: 1.15rem; background: rgba(37,99,235,0.04); border: 1px solid rgba(37,99,235,0.12); padding: 0.85rem; border-radius: 8px;">
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

          <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; background: rgba(37,99,235,0.06); border: 1px solid rgba(37,99,235,0.15); padding: 0.85rem 1rem; border-radius: 8px;">
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
            <label class="form-label" for="divisionImageInput">Cover Image URL *</label>
            <input type="url" id="divisionImageInput" class="form-input" required placeholder="https://images.unsplash.com/...">
            <div style="display:flex; gap:0.4rem; margin-top:0.45rem; flex-wrap:wrap; font-size:0.75rem;">
              <span style="color:var(--text-muted); align-self:center;">Image Presets:</span>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="document.getElementById('divisionImageInput').value='https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80'">Quantum</button>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="document.getElementById('divisionImageInput').value='https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80'">Cosmology</button>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="document.getElementById('divisionImageInput').value='https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80'">Laboratory</button>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="document.getElementById('divisionImageInput').value='https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80'">Genomics</button>
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
            <label class="form-label" for="cohortImageInput">Card Media / Photo URL *</label>
            <input type="url" id="cohortImageInput" class="form-input" required placeholder="https://images.unsplash.com/...">
            <div style="display:flex; gap:0.4rem; margin-top:0.45rem; flex-wrap:wrap; font-size:0.75rem;">
              <span style="color:var(--text-muted); align-self:center;">Presets:</span>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="document.getElementById('cohortImageInput').value='https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80'">Lab Undergrad</button>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="document.getElementById('cohortImageInput').value='https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'">Postgrad Group</button>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="document.getElementById('cohortImageInput').value='https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'">Independent Research</button>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="document.getElementById('cohortImageInput').value='https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'">Fellows & Mentors</button>
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
