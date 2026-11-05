/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Global Application Engine
 * - Light/Dark Theme Switcher (Default: Light)
 * - Dynamic Navbar Title & Logo Loader
 * - Interactive Custom Scientific Cursor
 * - Cookie Consent Banner
 * - Mobile Navigation & Toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initBrandingAndNavbar();
  initHeroCustomization();
  initScrollRevealEffects();
  initCustomCursor();
  initCookieConsent();
  initMobileNav();
  initUserSessionState();
  initToastContainer();
  initFeaturedArticles();
  initHomeTeam();
});

// Hero Appearance & Video Customization
function initHeroCustomization() {
  if (!window.CRII_API) return;
  const settings = window.CRII_API.getHeroSettings();
  if (!settings) return;

  const video = document.getElementById('heroVideo');
  if (video && settings.videoUrl) {
    const currentSrc = video.querySelector('source')?.getAttribute('src');
    if (currentSrc !== settings.videoUrl) {
      video.innerHTML = `<source src="${settings.videoUrl}" type="video/mp4">`;
      video.load();
    }
  }

  const blurPx = settings.blurPx !== undefined ? settings.blurPx : 12;
  const opacity = settings.overlayOpacity !== undefined ? settings.overlayOpacity : 0.55;

  document.documentElement.style.setProperty('--hero-blur', `${blurPx}px`);
  document.documentElement.style.setProperty('--hero-overlay-bg', `rgba(10, 15, 30, ${opacity})`);
}

// Scroll Reveal Animations - Immediate visibility guaranteed
function initScrollRevealEffects() {
  const targets = document.querySelectorAll('.reveal-on-scroll, .feature-card, .research-preview-card, .data-card, .roster-card, .hero-metric-item, .card');
  targets.forEach(t => {
    t.classList.add('revealed');
  });
}

// 1. Theme Engine (Default: Light Mode)
function initThemeEngine() {
  const savedTheme = localStorage.getItem('crii_theme_mode') || 'light';
  applyTheme(savedTheme);

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = current === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('crii_theme_mode', theme);
}

// 2. Dynamic Branding & Navbar Title
function initBrandingAndNavbar() {
  if (!window.CRII_API) return;
  const instituteTitle = window.CRII_API.getInstituteName();
  const logoUrl = window.CRII_API.getInstituteLogo() || "assets/curiomas-no-bg.png";

  document.querySelectorAll('.brand-title').forEach(el => {
    el.innerText = instituteTitle;
  });

  if (logoUrl) {
    document.querySelectorAll('.brand-logo-container').forEach(container => {
      container.innerHTML = `<img src="${logoUrl}" alt="CRII Logo" class="brand-logo-img" style="width:36px; height:36px; object-fit:contain;">`;
    });
  }
}

// 3. Custom Scientific Interactive Cursor
function initCustomCursor() {
  // Do not initialize on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';

  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderRing);
  }
  renderRing();

  // Hover states
  const interactives = 'a, button, input, select, textarea, .card, .category-pill';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) {
      ring.classList.add('active');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) {
      ring.classList.remove('active');
    }
  });
}

// 4. Cookie Consent Banner
function initCookieConsent() {
  const consented = localStorage.getItem('crii_cookie_consent_v1');
  if (consented) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-text">
      We use strictly essential local cookies and session storage to verify research access and provide reproducible data methods.
    </div>
    <div class="cookie-actions">
      <button id="acceptCookiesBtn" class="btn btn-primary btn-sm">Accept All</button>
      <button id="closeCookiesBtn" class="btn btn-secondary btn-sm">Dismiss</button>
    </div>
  `;

  document.body.appendChild(banner);
  setTimeout(() => banner.classList.add('show'), 600);

  const acceptBtn = banner.querySelector('#acceptCookiesBtn');
  const closeBtn = banner.querySelector('#closeCookiesBtn');

  const dismiss = () => {
    localStorage.setItem('crii_cookie_consent_v1', 'accepted');
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 400);
  };

  if (acceptBtn) acceptBtn.addEventListener('click', dismiss);
  if (closeBtn) closeBtn.addEventListener('click', dismiss);
}

// 5. Mobile Navigation
function initMobileNav() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.mockup-nav-links') || document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('show');
      }
    });
  }
}

// 6. User Session State in Navbar
function initUserSessionState() {
  const user = window.CRII_API ? window.CRII_API.getCurrentUser() : null;
  const portalBtn = document.querySelector('.nav-portal-btn');

  if (portalBtn && user) {
    portalBtn.innerHTML = `
      <span style="display:inline-flex; align-items:center; gap:0.4rem;">
        <span style="width:7px; height:7px; background:#10b981; border-radius:50%;"></span>
        ${user.name.split(' ')[0]} (Portal)
      </span>
    `;
    portalBtn.href = "/portal";
  }
}

// 7. Global Toasts
function initToastContainer() {
  if (!document.querySelector('.toast-container')) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

window.showToast = function (message, type = 'info', duration = 3600) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    initToastContainer();
    container = document.querySelector('.toast-container');
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

window.copyToClipboard = async function (text, successMsg = 'Copied to clipboard!') {
  try {
    await navigator.clipboard.writeText(text);
    window.showToast(successMsg, 'success');
  } catch (err) {
    window.showToast('Failed to copy', 'error');
  }
};

function formatEditorialDate(dateStr) {
  if (!dateStr) return '04 November 2026';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch (e) {
    return dateStr;
  }
}

function formatEditorialReadTime(readingTime) {
  if (!readingTime) return '5 minutes';
  const digits = String(readingTime).match(/\d+/);
  if (digits) {
    const num = parseInt(digits[0], 10);
    return `${num} ${num === 1 ? 'minute' : 'minutes'}`;
  }
  return readingTime;
}

function getMetaAttributionHtml(post) {
  const isEdited = Boolean(post.isEdited || (post.updatedBy && post.updatedAt));
  const editor = post.updatedBy || (post.authors && post.authors[0]) || 'CRII Researcher';
  const creator = post.createdBy || (post.authors && post.authors[0]) || 'CRII Researcher';

  if (isEdited) {
    const timeStr = formatEditorialDate(post.updatedAt || post.date);
    return `
      <div class="article-meta-attribution">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        <span>Last edited by <strong>${editor}</strong> on ${timeStr}</span>
      </div>
    `;
  } else {
    const timeStr = formatEditorialDate(post.createdAt || post.date);
    return `
      <div class="article-meta-attribution">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span>Created by <strong>${creator}</strong> on ${timeStr}</span>
      </div>
    `;
  }
}

async function initFeaturedArticles() {
  const container = document.getElementById('fromTheInstituteContainer') || document.getElementById('featuredArticlesContainer');
  if (!container || !window.CRII_API) return;

  try {
    const posts = await window.CRII_API.getPosts({ preferNetwork: true });
    const published = (posts || []).filter(p => p.published !== false && !p.id.startsWith('crii-paper-2026-00'));

    if (published.length === 0) return;

    const fallbackCovers = [
      'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80'
    ];

    // Priority: An article marked featured: true, or the most recent published article
    const featuredPost = published.find(p => p.featured === true) || published[0];
    const subPosts = published.filter(p => p.id !== featuredPost.id).slice(0, 3);

    const curatedFallbacks = [
      {
        category: 'ANCIENT BIOLOGY',
        title: 'Fossil Calibration in an Open Framework',
        desc: 'How verifiable fossil records and open divergence datasets are being prepared for the CRII repository.',
        cover: fallbackCovers[1],
        link: '/research',
        linkText: 'Coming soon',
        attribution: ''
      },
      {
        category: 'AI & COMPUTATIONAL SCIENCE',
        title: 'Building Reproducible ML Pipelines for Biophysics',
        desc: 'A look at why open, test-driven computational methods matter when we are developing across biological and physical systems.',
        cover: fallbackCovers[2],
        link: '/research',
        linkText: 'Coming soon',
        attribution: ''
      },
      {
        category: 'ASTROBIOLOGY',
        title: 'Life at the Edge of Habitability',
        desc: "Dispatches from the Astrobiology & Extremophiles division on what Earth's most resilient organisms tell us about life beyond it.",
        cover: fallbackCovers[3],
        link: '/research',
        linkText: 'Coming soon',
        attribution: ''
      }
    ];

    const featuredCover = featuredPost.coverImage || fallbackCovers[0];
    const featuredCategory = (featuredPost.category || 'FEATURED RESEARCH').toUpperCase();

    // Render Featured Large Card and 3 Sub-Cards
    let subCardsHtml = '';
    for (let i = 0; i < 3; i++) {
      if (i < subPosts.length) {
        const p = subPosts[i];
        const pCover = p.coverImage || fallbackCovers[(i + 1) % fallbackCovers.length];
        const pCategory = (p.category || 'RESEARCH').toUpperCase();
        subCardsHtml += `
          <div class="editorial-sub-card">
            <div class="sub-card-media">
              <img src="${pCover}" alt="${p.title}" loading="lazy">
            </div>
            <div class="sub-card-body">
              <div class="sub-card-tag">
                <span class="mockup-tag-dot"></span>
                <span>${pCategory}</span>
              </div>
              <h4 class="sub-card-title">
                <a href="/article?id=${encodeURIComponent(p.id)}" style="color:inherit; text-decoration:none;">${p.title}</a>
              </h4>
              <p class="sub-card-desc">${p.summary || p.abstract || ''}</p>
              <a href="/article?id=${encodeURIComponent(p.id)}" class="mockup-arrow-link">
                <span>Read dispatch</span>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
              ${getMetaAttributionHtml(p)}
            </div>
          </div>
        `;
      } else {
        const fb = curatedFallbacks[i];
        subCardsHtml += `
          <div class="editorial-sub-card">
            <div class="sub-card-media">
              <img src="${fb.cover}" alt="${fb.title}" loading="lazy">
            </div>
            <div class="sub-card-body">
              <div class="sub-card-tag">
                <span class="mockup-tag-dot"></span>
                <span>${fb.category}</span>
              </div>
              <h4 class="sub-card-title">${fb.title}</h4>
              <p class="sub-card-desc">${fb.desc}</p>
              <a href="${fb.link}" class="mockup-arrow-link">
                <span>${fb.linkText}</span>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>
          </div>
        `;
      }
    }

    container.innerHTML = `
      <!-- Featured Big Horizontal Card -->
      <div class="editorial-feature-card">
        <div class="feature-card-media">
          <img src="${featuredCover}" alt="${featuredPost.title}" loading="lazy">
        </div>
        <div class="feature-card-body">
          <div class="mockup-section-tag">
            <span class="mockup-tag-dot"></span>
            <span>${featuredCategory} • SPOTLIGHT PUBLICATION</span>
          </div>
          <h3 class="feature-card-title">
            <a href="/article?id=${encodeURIComponent(featuredPost.id)}" style="color:inherit; text-decoration:none;">${featuredPost.title}</a>
          </h3>
          <p class="feature-card-desc">
            ${featuredPost.summary || featuredPost.abstract || ''}
          </p>
          <a href="/article?id=${encodeURIComponent(featuredPost.id)}" class="mockup-arrow-link" style="margin-bottom:0.75rem;">
            <span>Read full publication</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
          </a>
          ${getMetaAttributionHtml(featuredPost)}
        </div>
      </div>

      <!-- 3-Column Sub-Cards -->
      <div class="editorial-sub-grid">
        ${subCardsHtml}
      </div>
    `;
  } catch (e) {
    console.warn('Featured articles render error:', e);
  }
}

async function initHomeTeam() {
  const container = document.getElementById('homeTeamContainer');
  if (!container || !window.CRII_API) return;

  try {
    const data = await window.CRII_API.getInternsData();
    let members = (data && data.activeInterns) ? data.activeInterns : [];

    // Filter out dummy test members if lingering in legacy local storage
    const dummyIds = ['team-002', 'team-003', 'int-001', 'int-002', 'crii-int-002', 'crii-int-003', 'crii-int-004'];
    members = members.filter(m => m.status === 'Active' && !dummyIds.includes(m.id));

    // Sort by priority: Core leadership (isTeamMember) first, then orderIndex ascending, then name
    members.sort((a, b) => {
      const teamA = a.isTeamMember ? 1 : 0;
      const teamB = b.isTeamMember ? 1 : 0;
      if (teamA !== teamB) return teamB - teamA;
      const orderA = a.orderIndex !== undefined ? Number(a.orderIndex) : 999;
      const orderB = b.orderIndex !== undefined ? Number(b.orderIndex) : 999;
      if (orderA !== orderB) return orderA - orderB;
      return (a.name || '').localeCompare(b.name || '');
    });

    // Top 3 priority people only on index
    const top3 = members.slice(0, 3);

    if (top3.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--bg-surface); border-radius: 16px; border: 1px dashed var(--border-color);">
          <p style="color: var(--text-muted);">Leadership council roster initializing.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = top3.map(member => {
      const avatarUrl = member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
      const badgeText = member.isTeamMember ? '★ Executive Council' : '★ Research Fellow';
      return `
        <div class="card">
          <div style="display:flex; align-items:center; gap:1.15rem; margin-bottom:1.15rem;">
            <img src="${avatarUrl}" alt="${member.name}" style="width:58px; height:58px; border-radius:50%; object-fit:cover; border:2px solid var(--accent-primary);">
            <div>
              <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:0.15rem;">${member.name}</h3>
              <div style="font-size:0.84rem; color:var(--accent-primary); font-weight:600;">${member.role || 'Principal Investigator'}</div>
              <div style="font-size:0.78rem; color:var(--text-muted);">${member.division || 'Executive Council'}</div>
            </div>
          </div>
          <p class="card-desc" style="font-size:0.9rem; line-height:1.6; margin-bottom:1.25rem;">
            ${member.bio || 'Leading open computational research and multi-disciplinary student discovery.'}
          </p>
          <div class="card-footer" style="padding-top:0.75rem; border-top:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
            <span class="badge-core-team">${badgeText}</span>
            <a href="/team" class="btn btn-glass btn-sm">Full Team →</a>
          </div>
        </div>
      `;
    }).join('');
  } catch (e) {
    console.warn('Failed to load home team:', e);
  }
}
