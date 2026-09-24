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
  initCustomCursor();
  initCookieConsent();
  initMobileNav();
  initUserSessionState();
  initToastContainer();
});

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
  const logoUrl = window.CRII_API.getInstituteLogo();

  document.querySelectorAll('.brand-title').forEach(el => {
    el.innerText = instituteTitle;
  });

  if (logoUrl) {
    document.querySelectorAll('.brand-logo-container').forEach(container => {
      container.innerHTML = `<img src="${logoUrl}" alt="Logo" class="brand-logo-img" onerror="this.remove()">`;
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
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
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
    portalBtn.href = "portal.html";
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
