/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Floating Capsule Navbar Component
 */

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
      <header class="mockup-nav-capsule">
        <!-- Left Logo & Expanding Tag on Hover -->
        <a href="/" class="mockup-brand" aria-label="Curiomas Research & Innovation Institute" title="Curiomas">
          <img src="/assets/curiomas-no-bg.png" alt="CRII" class="mockup-brand-img">
          <span class="mockup-brand-tag">CURIOMAS</span>
        </a>

        <!-- Main Nav Links -->
        <nav class="mockup-nav-center">
          <ul class="mockup-nav-links" id="mainNavMenu">
            <li><a href="/" class="mockup-nav-link ${isActive('/')}">Home</a></li>
            <li><a href="/research" class="mockup-nav-link ${isActive('/research')}">Research</a></li>
            <li><a href="/blog" class="mockup-nav-link ${isActive('/blog')}">Dispatches</a></li>
            <li><a href="/team" class="mockup-nav-link ${isActive('/team')}">Team</a></li>
            <li><a href="/contact" class="mockup-nav-link ${isActive('/contact')}">Contact</a></li>
            <li class="mobile-nav-login-item">
              <a href="${loginPath}" class="mockup-nav-link mobile-login-link ${isActive('/portal') || isActive('/login')}">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                <span>${loginLabel}</span>
              </a>
            </li>
          </ul>
        </nav>

        <!-- Right Action Group -->
        <div class="mockup-nav-right">
          <!-- Orange LOGIN/PORTAL Button -->
          <a href="${loginPath}" class="nav-login-btn">${loginLabel}</a>

          <!-- RSS Feed Icon Button -->
          <a href="/blog" class="nav-action-icon-btn nav-rss-link" title="Dispatches RSS Feed" aria-label="Dispatches RSS Feed">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>
          </a>

          <!-- Search Icon Button -->
          <button type="button" class="nav-action-icon-btn nav-search-trigger" id="navSearchTrigger" aria-label="Search posts" title="Search posts (Ctrl+K)">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>

          <!-- Language / Flag Dropdown -->
          <div class="nav-lang-dropdown" id="navLangDropdown">
            <button type="button" class="nav-action-icon-btn nav-lang-btn" id="navLangBtn" aria-expanded="false" aria-label="Select Language" title="Change Language">
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

          <!-- Mobile Hamburger Toggle -->
          <button class="nav-action-icon-btn menu-toggle" id="menuToggleBtn" aria-label="Toggle Menu" type="button">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </header>
    </div>
  `;
}

export function initNavbarInteractions(router) {
  // 1. Search trigger
  const searchBtn = document.getElementById('navSearchTrigger');
  if (searchBtn && window.CRII_OPEN_SEARCH) {
    searchBtn.addEventListener('click', () => window.CRII_OPEN_SEARCH());
  }

  // 2. Language dropdown
  const langBtn = document.getElementById('navLangBtn');
  const langMenu = document.getElementById('navLangMenu');
  const langDropdown = document.getElementById('navLangDropdown');
  if (langBtn && langMenu) {
    // Restore saved language preference on mount
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

        // Trigger Google Translate cookie
        if (typeof window.triggerGoogleTranslate === 'function') {
          window.triggerGoogleTranslate(lang);
        }
      });
    });
  }

  // 3. Mobile menu toggle
  const menuToggle = document.getElementById('menuToggleBtn');
  const navMenu = document.getElementById('mainNavMenu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });

    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navMenu.classList.remove('show');
      });
    });
  }
}

export function updateNavbarActive(path = '/') {
  const links = document.querySelectorAll('.mockup-nav-link');
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

  // Also update login/portal button text
  const isAuth = auth.isAuthenticated();
  const loginBtns = document.querySelectorAll('.nav-login-btn, .mobile-login-link span');
  loginBtns.forEach(b => {
    b.textContent = isAuth ? 'PORTAL' : 'LOGIN';
  });
  const loginLinks = document.querySelectorAll('.nav-login-btn, .mobile-login-link');
  loginLinks.forEach(l => {
    l.setAttribute('href', isAuth ? '/portal' : '/login');
  });
}
