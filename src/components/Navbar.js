import { auth } from '../services/auth.js';

export function renderNavbarHtml(currentPath = '/') {
  const isAuth = auth.isAuthenticated();
  const loginLabel = isAuth ? 'PORTAL' : 'LOGIN';
  const loginPath = isAuth ? '/portal' : '/login';

  const isActive = (path) => {
    if (path === '/' && (currentPath === '/' || currentPath === '')) return 'active';
    if (path !== '/' && currentPath.startsWith(path)) return 'active';
    return '';
  };

  return `
    <div class="mockup-nav-wrapper">
      <header class="crii-nav-capsule">
        <!-- 1. Left Nav Segment: Home, Research, Dispatches -->
        <nav class="nav-segment nav-segment-left">
          <a href="/" class="nav-item ${isActive('/')}">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Home</span>
          </a>

          <a href="/research" class="nav-item ${isActive('/research')}">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 2v7.31L4.1 20.3a2 2 0 0 0 1.7 2.7h12.4a2 2 0 0 0 1.7-2.7L14 9.31V2"/>
              <path d="M8.5 2h7"/>
              <path d="M7 16h10"/>
            </svg>
            <span>Research</span>
          </a>

          <a href="/blog" class="nav-item ${isActive('/blog')}">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
              <path d="M6 6h10"/>
              <path d="M6 10h10"/>
            </svg>
            <span>Dispatches</span>
          </a>
        </nav>

        <!-- 2. Middle Chamfered Badge: Institute Logo + CRII -->
        <a href="/" class="nav-center-badge" title="Curiomas Research & Innovation Institute">
          <div class="badge-logo-wrap">
            <img src="/assets/curiomas-no-bg.png" alt="CRII Logo" class="badge-logo-img">
          </div>
          <span class="badge-title">CRII</span>
        </a>

        <!-- 3. Right Nav Segment: Team, Contact, Divider, Language, Search, Explore/Portal Pill -->
        <div class="nav-segment nav-segment-right">
          <nav class="nav-sub-links">
            <a href="/team" class="nav-item ${isActive('/team')}">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Team</span>
            </a>

            <a href="/contact" class="nav-item ${isActive('/contact')}">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <span>Contact</span>
            </a>
          </nav>

          <div class="nav-v-divider"></div>

          <!-- Language Dropdown -->
          <div class="nav-lang-dropdown" id="navLangDropdown">
            <button type="button" class="nav-icon-action nav-lang-btn" id="navLangBtn" aria-expanded="false" title="Language">
              <img src="https://flagcdn.com/w40/gb.png" alt="English" class="nav-lang-flag-img" id="navLangFlagImg">
            </button>
            <div class="nav-lang-menu" id="navLangMenu">
              <button type="button" class="nav-lang-opt active" data-lang="en">
                <img src="https://flagcdn.com/w40/gb.png" class="opt-flag" alt="GB">
                <span>English</span>
              </button>
              <button type="button" class="nav-lang-opt" data-lang="bn">
                <img src="https://flagcdn.com/w40/bd.png" class="opt-flag" alt="BD">
                <span>বাংলা</span>
              </button>
            </div>
          </div>

          <!-- Search Button -->
          <button type="button" class="nav-icon-action nav-search-trigger" id="navSearchTrigger" aria-label="Search" title="Search posts (Ctrl+K)">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

          <!-- Vibrant Blue Explore / Portal Pill -->
          <a href="${loginPath}" class="nav-explore-btn">
            <span>${loginLabel}</span>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>

          <!-- Mobile Hamburger Toggle -->
          <button class="nav-icon-action menu-toggle" id="menuToggleBtn" aria-label="Toggle Menu" type="button" aria-expanded="false">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Mobile Dropdown Menu -->
      <nav class="crii-mobile-menu" id="criiMobileMenu">
        <a href="/" class="mobile-nav-link ${isActive('/')}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          <span>Home</span>
        </a>
        <a href="/research" class="mobile-nav-link ${isActive('/research')}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31L4.1 20.3a2 2 0 0 0 1.7 2.7h12.4a2 2 0 0 0 1.7-2.7L14 9.31V2"/></svg>
          <span>Research</span>
        </a>
        <a href="/blog" class="mobile-nav-link ${isActive('/blog')}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
          <span>Dispatches</span>
        </a>
        <a href="/team" class="mobile-nav-link ${isActive('/team')}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          <span>Team</span>
        </a>
        <a href="/contact" class="mobile-nav-link ${isActive('/contact')}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          <span>Contact</span>
        </a>
        <div style="border-top:1px solid rgba(255,255,255,0.12); margin-top:0.4rem; padding-top:0.4rem;">
          <a href="${loginPath}" class="mobile-nav-link mobile-login-pill ${isActive('/portal') || isActive('/login')}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            <span>${loginLabel}</span>
          </a>
        </div>
      </nav>
    </div>
  `;
}

export function initNavbarInteractions(router) {
  const searchBtn = document.getElementById('navSearchTrigger');
  if (searchBtn && window.CRII_OPEN_SEARCH) {
    searchBtn.addEventListener('click', () => window.CRII_OPEN_SEARCH());
  }

  const langBtn = document.getElementById('navLangBtn');
  const langMenu = document.getElementById('navLangMenu');
  const langDropdown = document.getElementById('navLangDropdown');
  if (langBtn && langMenu) {
    const savedLang = localStorage.getItem('crii_site_language') || 'en';
    if (savedLang === 'bn') {
      const flagImg = document.getElementById('navLangFlagImg');
      if (flagImg) {
        flagImg.src = 'https://flagcdn.com/w40/bd.png';
        flagImg.alt = 'বাংলা';
      }
      langMenu.querySelectorAll('.nav-lang-opt').forEach(o => {
        o.classList.toggle('active', o.getAttribute('data-lang') === 'bn');
      });
    }

    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = langMenu.classList.toggle('show');
      langBtn.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', (e) => {
      if (langDropdown && !langDropdown.contains(e.target)) {
        langMenu.classList.remove('show');
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });

    langMenu.querySelectorAll('.nav-lang-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        const lang = opt.getAttribute('data-lang');
        langMenu.querySelectorAll('.nav-lang-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        const flagImg = document.getElementById('navLangFlagImg');
        if (flagImg) {
          flagImg.src = lang === 'bn' ? 'https://flagcdn.com/w40/bd.png' : 'https://flagcdn.com/w40/gb.png';
          flagImg.alt = lang === 'bn' ? 'বাংলা' : 'English';
        }
        langMenu.classList.remove('show');
        langBtn.setAttribute('aria-expanded', 'false');

        if (typeof window.triggerGoogleTranslate === 'function') {
          window.triggerGoogleTranslate(lang);
        }
      });
    });
  }

  const menuToggle = document.getElementById('menuToggleBtn');
  const mobileMenu = document.getElementById('criiMobileMenu');
  if (menuToggle && mobileMenu) {
    const setMenuState = (isOpen) => {
      mobileMenu.classList.toggle('show', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.innerHTML = isOpen
        ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`
        : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;
    };

    menuToggle.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = !mobileMenu.classList.contains('show');
      setMenuState(isOpen);
    };

    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        setMenuState(false);
      });
    });

    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        setMenuState(false);
      }
    });
  }
}

export function updateNavbarActive(path = '/') {
  const links = document.querySelectorAll('.nav-item, .mobile-nav-link');
  links.forEach(l => {
    const href = l.getAttribute('href');
    if (href === '/' && (path === '/' || path === '')) {
      l.classList.add('active');
    } else if (href !== '/' && path.startsWith(href)) {
      l.classList.add('active');
    } else {
      l.classList.remove('active');
    }
  });

  const isAuth = auth.isAuthenticated();
  const loginBtns = document.querySelectorAll('.nav-explore-btn span, .mobile-login-pill span');
  loginBtns.forEach(b => {
    b.textContent = isAuth ? 'PORTAL' : 'LOGIN';
  });
  const loginLinks = document.querySelectorAll('.nav-explore-btn, .mobile-login-pill');
  loginLinks.forEach(l => {
    l.setAttribute('href', isAuth ? '/portal' : '/login');
  });
}
