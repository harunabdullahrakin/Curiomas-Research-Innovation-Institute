/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Main Vite Application Entry Point
 * Vite Rendering — Zero Page Reloads — Enhanced Auth Security
 */

// 1. Global CSS Design System
import '../css/style.css';
import '../css/components.css';
import '../css/portal.css';
import '../css/word-editor.css';

// 2. Underlying Institute Data Layer & Module Engines
import '../js/config.js';
import '../js/app.js';
import '../js/auth.js';
import '../js/doc-sanitize.js';
import '../js/word-editor.js';
import '../js/ai-catalog.js';
import '../js/portal.js';
import '../js/research.js';
import '../js/academics.js';
import '../js/interns.js';
import '../js/blog.js';
import '../js/article.js';

// 3. Components & Services
import { renderNavbarHtml, initNavbarInteractions } from './components/Navbar.js';
import { renderFooterHtml } from './components/Footer.js';
import { renderSearchModalHtml, initSearchModal } from './components/SearchModal.js';
import { auth } from './services/auth.js';
import { Router } from './router.js';

// 4. Bootstrap App Shell
const CRII_VERSION_STAMP = 'v2.1.8-capsule-glass';

function bootstrap() {
  const app = document.getElementById('app');
  if (!app) return;

  const currentPath = window.location.pathname;

  app.innerHTML = `
    <div id="navbarMount">${renderNavbarHtml(currentPath)}</div>
    <div id="pageContentMount"></div>
    <div id="footerMount">${renderFooterHtml()}</div>
    <div id="searchModalMount">${renderSearchModalHtml()}</div>
  `;

  // Initialize Router
  const router = new Router(app);
  window.CRII_ROUTER = router;

  // Initialize Shell Interactions
  initNavbarInteractions(router);
  initSearchModal(router);

  // Background Session Validation with Cloudflare D1 SQL
  auth.verifySession().then(res => {
    if (res.authenticated) {
      document.querySelectorAll('.nav-login-btn, .nav-explore-btn, .mobile-login-pill').forEach(btn => {
        const span = btn.querySelector('span');
        if (span) span.textContent = 'PORTAL';
        else btn.textContent = 'PORTAL';
        btn.setAttribute('href', '/portal');
      });
    }
  });

  router.resolveRoute(window.location.pathname, window.location.hash);
  initPwaAndOfflineEngine();
}

function initPwaAndOfflineEngine() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
  }

  let deferredPrompt = null;
  const syncInstallButtons = () => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const desktopBtn = document.getElementById('navPwaInstallBtn');
    const mobileBtn = document.getElementById('mobilePwaInstallBtn');
    const acadBtn = document.getElementById('acadInstallPwaBtn');
    if (isStandalone) {
      if (desktopBtn) desktopBtn.style.display = 'none';
      if (mobileBtn) mobileBtn.style.display = 'none';
      if (acadBtn) acadBtn.style.display = 'none';
      return;
    }
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (deferredPrompt || isIos) {
      if (desktopBtn) desktopBtn.style.display = 'inline-flex';
      if (mobileBtn) mobileBtn.style.display = 'flex';
    }
  };

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    window.__criiDeferredInstallPrompt = e;
    syncInstallButtons();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    window.__criiDeferredInstallPrompt = null;
    syncInstallButtons();
    if (window.showToast) window.showToast('CRII App installed! Ready for offline study.', 'success');
  });

  window.triggerPwaInstall = async function () {
    const promptEvt = deferredPrompt || window.__criiDeferredInstallPrompt;
    if (promptEvt) {
      promptEvt.prompt();
      const choice = await promptEvt.userChoice.catch(() => null);
      if (choice && choice.outcome === 'accepted') {
        deferredPrompt = null;
        window.__criiDeferredInstallPrompt = null;
        syncInstallButtons();
      }
      return;
    }
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) {
      if (window.showToast) window.showToast('CRII App is already installed on your device!', 'info');
      return;
    }
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const msg = isIos
      ? 'To install on iPhone/iPad: tap the Share button (↑) in Safari, then tap "Add to Home Screen".'
      : 'To install CRII App: open your browser menu (⋮) and choose "Install App" or "Add to Home Screen".';
    if (window.showToast) window.showToast(msg, 'info');
    else alert(msg);
  };

  let offlinePill = document.getElementById('criiOfflineStatusPill');
  if (!offlinePill) {
    offlinePill = document.createElement('div');
    offlinePill.id = 'criiOfflineStatusPill';
    offlinePill.style.cssText = 'position:fixed; left:1rem; bottom:1rem; z-index:9999; display:none; align-items:center; gap:0.5rem; padding:0.5rem 0.95rem; border-radius:999px; background:#0f172a; color:#fbbf24; border:1px solid rgba(251,191,36,0.45); font-size:0.78rem; font-weight:700; box-shadow:0 10px 25px rgba(0,0,0,0.28);';
    offlinePill.innerHTML = '<span>📡</span><span>Offline Mode — Cached Academics & MCQs Active</span>';
    document.body.appendChild(offlinePill);
  }

  const syncOnlineUi = () => {
    if (offlinePill) offlinePill.style.display = navigator.onLine ? 'none' : 'inline-flex';
  };
  window.addEventListener('online', () => {
    syncOnlineUi();
    if (window.showToast) window.showToast('Back online! Syncing latest content...', 'success');
  });
  window.addEventListener('offline', () => {
    syncOnlineUi();
    if (window.showToast) window.showToast('Offline mode active — cached Academics, MCQs & CQs remain available.', 'info');
  });
  syncOnlineUi();
  syncInstallButtons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
