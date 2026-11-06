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
  initAutoHidingNavbar();
  initUserSessionState();
  initToastContainer();
  initFeaturedArticles();
  initDivisions();
  initHomeTeam();
  initGoogleTranslateAndLang();
  initSearchOverlay();
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

// 3. Custom Scientific Interactive Cursor (Cursoji Distorted Face)
function initCustomCursor() {
  // Remove any legacy dot/ring cursor elements if present
  document.querySelectorAll('.custom-cursor-dot, .custom-cursor-ring').forEach(el => el.remove());
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
  const toggleBtn = document.getElementById('menuToggleBtn') || document.querySelector('.menu-toggle');
  const navMenu = document.getElementById('mainNavMenu') || document.querySelector('.mockup-nav-links');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const willShow = !navMenu.classList.contains('show');
    navMenu.classList.toggle('show', willShow);
    toggleBtn.setAttribute('aria-expanded', String(willShow));
  });

  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('show');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('show');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// 5b. Auto-hiding Navbar on Scroll Down, Re-appearing on Scroll Up
function initAutoHidingNavbar() {
  const navWrapper = document.querySelector('.mockup-nav-wrapper');
  if (!navWrapper) return;

  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  let ticking = false;
  const delta = 6;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollY > 15) {
          navWrapper.classList.add('nav-scrolled');
        } else {
          navWrapper.classList.remove('nav-scrolled');
        }

        if (currentScrollY <= 40) {
          navWrapper.classList.remove('nav-hidden');
        } else if (currentScrollY > lastScrollY + delta) {
          // Scrolling down -> hide navbar
          navWrapper.classList.add('nav-hidden');
          const navMenu = document.getElementById('mainNavMenu');
          if (navMenu) navMenu.classList.remove('show');
          const langMenu = document.getElementById('navLangMenu');
          if (langMenu) langMenu.classList.remove('show');
        } else if (currentScrollY < lastScrollY - delta) {
          // Scrolling up -> reappear smoothly
          navWrapper.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// 6. User Session State in Navbar
function initUserSessionState() {
  const user = window.CRII_API ? window.CRII_API.getCurrentUser() : null;
  const loginBtns = document.querySelectorAll('.nav-login-btn, .nav-portal-btn, .mobile-login-link');

  if (loginBtns.length && user) {
    loginBtns.forEach(btn => {
      const firstName = (user.name || 'User').split(' ')[0];
      btn.innerHTML = `
        <span style="display:inline-flex; align-items:center; gap:0.4rem;">
          <span style="width:6px; height:6px; background:#10b981; border-radius:50%; box-shadow:0 0 6px #10b981;"></span>
          ${firstName.toUpperCase()}
        </span>
      `;
      btn.href = "/portal";
      btn.title = `Signed in as ${user.name} (${user.role || 'Member'})`;
    });
  }
}

// 6b. Google Translate & Language Selector (Persisted in localStorage)
const CRII_LANG_CONFIG = {
  'en': { name: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
  'zh-CN': { name: '中文 (简体)', flag: 'https://flagcdn.com/w40/cn.png' },
  'es': { name: 'Español', flag: 'https://flagcdn.com/w40/es.png' },
  'fr': { name: 'Français', flag: 'https://flagcdn.com/w40/fr.png' },
  'de': { name: 'Deutsch', flag: 'https://flagcdn.com/w40/de.png' },
  'bn': { name: 'বাংলা', flag: 'https://flagcdn.com/w40/bd.png' },
  'ja': { name: '日本語', flag: 'https://flagcdn.com/w40/jp.png' },
  'ar': { name: 'العربية', flag: 'https://flagcdn.com/w40/sa.png' }
};

function initGoogleTranslateAndLang() {
  const langKey = 'crii_site_language';
  const savedLang = localStorage.getItem(langKey) || 'en';

  function setTranslateCookie(lang) {
    const val = (lang && lang !== 'en') ? `/en/${lang}` : '';
    const host = window.location.hostname;
    const expires = (lang === 'en' || !lang) ? 'expires=Thu, 01 Jan 1970 00:00:00 UTC;' : 'max-age=31536000;';

    document.cookie = `googtrans=${val}; path=/; ${expires}`;
    if (host) {
      document.cookie = `googtrans=${val}; path=/; domain=${host}; ${expires}`;
      const parts = host.split('.');
      if (parts.length > 2) {
        document.cookie = `googtrans=${val}; path=/; domain=.${parts.slice(-2).join('.')}; ${expires}`;
      }
    }
  }

  function updateLangUI(lang) {
    const labelEl = document.getElementById('navLangLabel');
    const flagEl = document.getElementById('navLangFlagImg');
    const info = CRII_LANG_CONFIG[lang] || CRII_LANG_CONFIG['en'];

    if (labelEl) {
      labelEl.textContent = info.name;
    }
    if (flagEl) {
      flagEl.src = info.flag;
      flagEl.alt = info.name;
    }
    document.querySelectorAll('.nav-lang-opt').forEach(opt => {
      if (opt.getAttribute('data-lang') === lang) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });
  }

  // Pre-sync cookie if user previously picked a language
  if (savedLang !== 'en') {
    setTranslateCookie(savedLang);
  }
  updateLangUI(savedLang);

  // Dropdown UI toggle
  const langBtn = document.getElementById('navLangBtn');
  const langMenu = document.getElementById('navLangMenu');

  if (langBtn && langMenu) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langMenu.classList.contains('show');
      langMenu.classList.toggle('show', !isOpen);
      langBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!langMenu.contains(e.target) && !langBtn.contains(e.target)) {
        langMenu.classList.remove('show');
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Selecting a language option
    langMenu.querySelectorAll('.nav-lang-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        const targetLang = opt.getAttribute('data-lang') || 'en';
        const currentLang = localStorage.getItem(langKey) || 'en';
        if (targetLang === currentLang) {
          langMenu.classList.remove('show');
          return;
        }

        localStorage.setItem(langKey, targetLang);
        setTranslateCookie(targetLang);
        updateLangUI(targetLang);
        langMenu.classList.remove('show');
        langBtn.setAttribute('aria-expanded', 'false');

        // Trigger Google Translate engine combo if present
        const combo = document.querySelector('.goog-te-combo');
        if (combo) {
          combo.value = targetLang;
          combo.dispatchEvent(new Event('change'));
        }
        
        // Reload page to let Google Translate cleanly render the target language
        setTimeout(() => {
          window.location.reload();
        }, 120);
      });
    });
  }

  // Global Google Translate init callback
  window.googleTranslateElementInit = function() {
    try {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,zh-CN,es,fr,de,bn,ja,ar,ru,hi,pt,it,ko',
        autoDisplay: false
      }, 'google_translate_element');
    } catch (err) {
      console.warn('Google Translate init deferred:', err);
    }
  };

  // Load Google Translate script if not present
  if (!document.getElementById('google-translate-api-script')) {
    const s = document.createElement('script');
    s.id = 'google-translate-api-script';
    s.type = 'text/javascript';
    s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.head.appendChild(s);
  }
}

// 6c. Search Modal Overlay (Posts & Dispatches)
function initSearchOverlay() {
  const triggers = document.querySelectorAll('#navSearchTrigger, #mobileSearchTrigger, .nav-search-trigger');
  const overlay = document.getElementById('criiSearchOverlay');
  const backdrop = document.getElementById('criiSearchBackdrop');
  const escBtn = document.getElementById('criiSearchEsc');
  const input = document.getElementById('siteSearchInput');
  const resultsContainer = document.getElementById('criiSearchResults');

  if (!overlay || !input) return;

  function openSearch() {
    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
    input.value = '';
    renderSearchResults('');
    setTimeout(() => input.focus(), 60);
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  triggers.forEach(t => {
    t.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });
  });

  if (backdrop) backdrop.addEventListener('click', closeSearch);
  if (escBtn) escBtn.addEventListener('click', closeSearch);

  // Keyboard navigation: Ctrl+K / Cmd+K opens, Escape closes
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (overlay.style.display === 'flex') {
        closeSearch();
      } else {
        openSearch();
      }
    } else if (e.key === 'Escape' && overlay.style.display === 'flex') {
      closeSearch();
    }
  });

  // Search input typing
  let searchDebounce = null;
  input.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      renderSearchResults(input.value.trim());
    }, 120);
  });

  async function renderSearchResults(query) {
    if (!resultsContainer) return;

    if (!query) {
      resultsContainer.innerHTML = '<div class="crii-search-empty">Type to search...</div>';
      return;
    }

    resultsContainer.innerHTML = '<div class="crii-search-empty">Searching dispatches...</div>';

    let posts = [];
    if (window.CRII_API && typeof window.CRII_API.getPosts === 'function') {
      try {
        posts = await window.CRII_API.getPosts();
      } catch (e) {
        posts = [];
      }
    }

    const q = query.toLowerCase();
    const matched = posts.filter(p => {
      const title = (p.title || '').toLowerCase();
      const excerpt = (p.excerpt || p.abstract || '').toLowerCase();
      const division = (p.division || '').toLowerCase();
      const author = (p.author || p.authors?.join(' ') || '').toLowerCase();
      const tags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';
      return title.includes(q) || excerpt.includes(q) || division.includes(q) || author.includes(q) || tags.includes(q);
    });

    if (matched.length === 0) {
      resultsContainer.innerHTML = `
        <div class="crii-search-empty">
          No dispatches found matching "<strong>${escapeHtmlApp(query)}</strong>"
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = matched.slice(0, 8).map(post => {
      const postUrl = `/article?id=${encodeURIComponent(post.id)}`;
      const division = post.division || 'Research';
      const excerpt = post.excerpt || post.abstract || 'Explore the complete research dispatch and open dataset.';
      return `
        <a href="${postUrl}" class="crii-search-result-item">
          <div class="crii-search-result-title">
            <span>${escapeHtmlApp(post.title)}</span>
            <span class="crii-search-result-badge">${escapeHtmlApp(division)}</span>
          </div>
          <div class="crii-search-result-snippet">${escapeHtmlApp(excerpt)}</div>
        </a>
      `;
    }).join('');
  }

  function escapeHtmlApp(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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

    if (published.length === 0) {
      container.innerHTML = `
        <div class="editorial-empty-notice" style="text-align:center; padding:3.5rem 1.5rem; background:rgba(0,0,0,0.02); border-radius:14px; border:1px dashed #d5cebf; color:#78716c;">
          <p style="font-size:1.05rem; font-weight:600; color:#44403c; margin-bottom:0.4rem;">No publications currently published</p>
          <p style="font-size:0.88rem; color:#78716c; margin:0;">New peer-reviewed articles, synthetic spectra, and research dispatches will appear here once released by the institute.</p>
        </div>
      `;
      return;
    }

    const fallbackCovers = [
      'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80'
    ];

    // Priority: An article marked featured: true, or the most recent published article
    const featuredPost = published.find(p => p.featured === true) || published[0];
    const subPosts = published.filter(p => p.id !== featuredPost.id).slice(0, 3);

    const featuredCover = featuredPost.coverImage || fallbackCovers[0];
    const featuredCategory = (featuredPost.category || featuredPost.division || 'FEATURED RESEARCH').toUpperCase();

    // Render Featured Large Card
    let featureCardHtml = `
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
            ${featuredPost.summary || featuredPost.abstract || featuredPost.excerpt || ''}
          </p>
          <a href="/article?id=${encodeURIComponent(featuredPost.id)}" class="mockup-arrow-link" style="margin-bottom:0.75rem;">
            <span>Read full publication</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
          </a>
          ${getMetaAttributionHtml(featuredPost)}
        </div>
      </div>
    `;

    // Render Sub-Cards ONLY for actual published articles (no hardcoded fallbacks)
    let subCardsHtml = '';
    if (subPosts.length > 0) {
      for (let i = 0; i < subPosts.length; i++) {
        const p = subPosts[i];
        const pCover = p.coverImage || fallbackCovers[(i + 1) % fallbackCovers.length];
        const pCategory = (p.category || p.division || 'RESEARCH').toUpperCase();
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
              <p class="sub-card-desc">${p.summary || p.abstract || p.excerpt || ''}</p>
              <a href="/article?id=${encodeURIComponent(p.id)}" class="mockup-arrow-link">
                <span>Read dispatch</span>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
              ${getMetaAttributionHtml(p)}
            </div>
          </div>
        `;
      }
    }

    container.innerHTML = `
      ${featureCardHtml}
      ${subCardsHtml ? `<div class="editorial-sub-grid">${subCardsHtml}</div>` : ''}
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


async function initDivisions() {
  const container = document.getElementById('homeDivisionsContainer') || document.querySelector('.divisions-cards-grid');
  if (!container || !window.CRII_API) return;

  try {
    const divisions = await window.CRII_API.getDivisions();
    if (divisions && Array.isArray(divisions) && divisions.length > 0) {
      container.innerHTML = divisions.map(div => `
        <a href="${div.link || '/research'}" class="division-card">
          <div class="division-card-media">
            <img src="${div.image || 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=800&q=80'}" alt="${div.title}" loading="lazy">
          </div>
          <div class="division-card-tag">
            <span>${div.tag || (div.number ? div.number + ' / RESEARCH DIVISION' : 'RESEARCH DIVISION')}</span>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
          </div>
          <h3 class="division-card-title">${div.title}</h3>
          <p class="division-card-desc">${div.desc || ''}</p>
        </a>
      `).join('');
    } else {
      container.innerHTML = '';
      const section = container.closest('.divisions-section') || container.closest('section');
      if (section) section.style.display = 'none';
    }
  } catch (e) {
    console.warn('initDivisions error:', e);
  }
}
