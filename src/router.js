/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Client-Side SPA Router (Vite Rendering - No Reloads Required)
 */

import { renderHomePageHtml, mountHomePage } from './pages/HomePage.js';
import { renderResearchPageHtml, mountResearchPage } from './pages/ResearchPage.js';
import { renderTeamPageHtml, mountTeamPage } from './pages/TeamPage.js';
import { renderBlogPageHtml, mountBlogPage } from './pages/BlogPage.js';
import { renderArticlePageHtml, mountArticlePage } from './pages/ArticlePage.js';
import { renderContactPageHtml, mountContactPage } from './pages/ContactPage.js';
import { renderLoginPageHtml, mountLoginPage } from './pages/LoginPage.js';
import { renderPortalPageHtml, mountPortalPage } from './pages/PortalPage.js';
import { updateNavbarActive } from './components/Navbar.js';
import { auth } from './services/auth.js';

export class Router {
  constructor(appContainer) {
    this.appContainer = appContainer;
    this.currentRoute = null;
    this.initLinkInterceptor();
    this.initPopstate();
  }

  initLinkInterceptor() {
    document.addEventListener('click', (e) => {
      // Find closest anchor tag
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore external links, mailto, tel, javascript
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
        return;
      }

      // If it's a target="_blank", let browser handle it
      if (anchor.getAttribute('target') === '_blank') return;

      // Handle in-page hash links (e.g. href="#editorialSection")
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.slice(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
          history.pushState(null, '', href);
        }
        return;
      }

      // Handle internal relative paths
      if (href.startsWith('/') || href.startsWith('./') || !href.includes('://')) {
        e.preventDefault();
        this.navigate(href);
      }
    });
  }

  initPopstate() {
    window.addEventListener('popstate', () => {
      this.resolveRoute(window.location.pathname, window.location.hash);
    });
  }

  navigate(url) {
    // Parse path and hash
    const [pathPart, hashPart] = url.split('#');
    const path = pathPart || '/';
    const hash = hashPart ? `#${hashPart}` : '';

    if (window.location.pathname !== path || window.location.hash !== hash) {
      history.pushState(null, '', url);
    }

    this.resolveRoute(path, hash);
  }

  async resolveRoute(rawPath = '/', hash = '') {
    // Normalize path
    let path = rawPath.toLowerCase().replace(/\.html$/, '');
    if (!path.startsWith('/')) path = '/' + path;
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);

    // Aliases
    if (path === '/interns') path = '/team';

    this.currentRoute = path;

    // Toggle public shell (navbar/footer)
    const isSpecialLayout = path === '/login' || path === '/portal';
    const navbarWrapper = document.getElementById('navbarMount');
    const footerWrapper = document.getElementById('footerMount');
    const contentMount = document.getElementById('pageContentMount');

    if (navbarWrapper) navbarWrapper.style.display = isSpecialLayout ? 'none' : 'block';
    if (footerWrapper) footerWrapper.style.display = isSpecialLayout ? 'none' : 'block';

    // Route Guardians
    if (path === '/portal' && !auth.isAuthenticated()) {
      this.navigate('/login?redirect=/portal');
      return;
    }
    if (path === '/login' && auth.isAuthenticated()) {
      this.navigate('/portal');
      return;
    }

    // Render Page View
    let html = '';
    let mountFn = null;

    switch (path) {
      case '/':
      case '':
        html = renderHomePageHtml();
        mountFn = mountHomePage;
        document.title = 'Curiomas Research & Innovation Institute — CRII';
        break;
      case '/research':
        html = renderResearchPageHtml();
        mountFn = mountResearchPage;
        document.title = 'Research Publications & Datasets — CRII';
        break;
      case '/team':
        html = renderTeamPageHtml();
        mountFn = mountTeamPage;
        document.title = 'Core Team & Research Mentors — CRII';
        break;
      case '/blog':
        html = renderBlogPageHtml();
        mountFn = mountBlogPage;
        document.title = 'Dispatches from the Institute — CRII';
        break;
      case '/article':
        html = renderArticlePageHtml();
        mountFn = mountArticlePage;
        document.title = 'Scientific Dispatch — CRII';
        break;
      case '/contact':
        html = renderContactPageHtml();
        mountFn = mountContactPage;
        document.title = 'Contact the Institute — CRII';
        break;
      case '/login':
        html = renderLoginPageHtml();
        mountFn = () => mountLoginPage(this);
        document.title = 'Institute Sign In — CRII';
        break;
      case '/portal':
        html = renderPortalPageHtml();
        mountFn = () => mountPortalPage(this);
        document.title = 'Researcher Portal — CRII';
        break;
      default:
        // Fallback to Home if unknown
        html = renderHomePageHtml();
        mountFn = mountHomePage;
        document.title = 'Curiomas Research & Innovation Institute — CRII';
        break;
    }

    if (contentMount) {
      contentMount.innerHTML = html;
    }

    // Update active state on floating navbar
    updateNavbarActive(path);

    // Call page mount hook
    if (mountFn) {
      try {
        await mountFn();
      } catch (err) {
        console.error(`Error mounting page ${path}:`, err);
      }
    }

    // Handle hash scroll or scroll to top
    if (hash) {
      const targetId = hash.replace(/^#/, '');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }
}
