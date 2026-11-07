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
import '../js/portal.js';
import '../js/research.js';
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
      document.querySelectorAll('.nav-login-btn').forEach(btn => {
        btn.textContent = 'PORTAL';
        btn.setAttribute('href', '/portal');
      });
    }
  });

  // Resolve initial route based on browser URL
  router.resolveRoute(window.location.pathname, window.location.hash);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
