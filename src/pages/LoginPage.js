/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Login Page Component
 */

import { auth } from '../services/auth.js';

export function renderLoginPageHtml() {
  return `
    <div class="page-login-wrapper">
      <main class="login-split-page">
        <!-- LEFT PANEL: Visual Showcase with Random Scientific Image API -->
        <div class="login-showcase-pane" id="loginShowcasePane">
          <div class="login-showcase-overlay"></div>
          
          <div class="login-showcase-content">
            <div class="login-brand-header">
              <img src="/assets/curiomas-no-bg.png" alt="CRII Emblem" loading="eager">
              <div>
                <div class="login-brand-name">Curiomas Institute</div>
                <div class="login-brand-sub">Research & Innovation</div>
              </div>
            </div>

            <div class="login-hero-center">
              <h1 class="login-hero-title">Bring structure to your research.</h1>
              <p class="login-hero-desc">
                An autonomous, student-driven research collective unifying deep-space atmospheres, ancient paleogenomics, and biophysical machine learning into open, reproducible frameworks.
              </p>
            </div>

            <div class="login-showcase-footer">
              <div class="login-showcase-motto">Turning Curiosity into Action.</div>
              <div class="login-showcase-note">Autonomous by Design • CC-BY 4.0</div>
            </div>
          </div>
        </div>

        <!-- RIGHT PANEL: Authentication Panel -->
        <div class="login-form-pane">
          <div class="login-form-top-nav">
            <a href="/" class="login-back-link">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span>Return to Institute Website</span>
            </a>
          </div>

          <div class="login-form-center">
            <div class="login-form-crest">
              <img src="/assets/curiomas-no-bg.png" alt="CRII Crest">
            </div>

            <h2 class="login-form-title">Institute Sign In</h2>
            <p class="login-form-subtitle">
              Welcome back. Access the verified researcher dashboard, editorial suite, and publication repositories.
            </p>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <a id="loginWithAutzBtn" class="login-primary-btn" href="#" style="text-decoration:none;">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                <span>Login with your account</span>
              </a>

              <div id="loginStatus" style="display:none; text-align: center; padding: 0.9rem; border-radius: 12px; font-size: 0.88rem; line-height: 1.5; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.25); color: var(--accent-primary);"></div>

              <div id="loginError" style="display:none; text-align: left; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: 0.9rem; border-radius: 12px; font-size: 0.85rem; line-height: 1.5;"></div>
            </div>
          </div>

          <div class="login-form-footer">
            Protected by parameterized institute access control
          </div>
        </div>
      </main>
    </div>
  `;
}

export async function mountLoginPage(router) {
  const loginBtn = document.getElementById('loginWithAutzBtn');
  const loginStatus = document.getElementById('loginStatus');
  const loginError = document.getElementById('loginError');

  // If already authenticated, redirect to portal immediately
  if (auth.isAuthenticated()) {
    if (router) router.navigate('/portal');
    return;
  }

  // Setup SSO link
  if (loginBtn) {
    const appId = 'gqiqh6qia';
    const callbackOrigin = window.location.origin.includes('curiomas.zone.id')
      ? 'https://www.curiomas.zone.id/login'
      : (window.location.origin + '/login');
    const ssoUrl = `https://autz.org/onboarding/${encodeURIComponent(appId)}?callback_url=${encodeURIComponent(callbackOrigin)}`;
    loginBtn.setAttribute('href', ssoUrl);

    loginBtn.addEventListener('click', () => {
      loginBtn.style.pointerEvents = 'none';
      loginBtn.innerHTML = `
        <span class="spinner" style="display:inline-block; width:16px; height:16px; border:2px solid #ffffff; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; margin-right:0.6rem;"></span>
        <span>Connecting to Single Sign-On...</span>
      `;
    });
  }

  // Check if returning from SSO with code
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('auth_code') || urlParams.get('code');

  if (code) {
    if (loginBtn) {
      loginBtn.style.pointerEvents = 'none';
      loginBtn.innerHTML = `
        <span class="spinner" style="display:inline-block; width:16px; height:16px; border:2px solid #ffffff; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; margin-right:0.6rem;"></span>
        <span>Authenticating with Institute...</span>
      `;
    }

    if (loginStatus) {
      loginStatus.style.display = 'block';
      loginStatus.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:center; gap:0.6rem;">
          <span class="spinner" style="display:inline-block; width:16px; height:16px; border:2px solid var(--accent-primary); border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite;"></span>
          <span>Verifying credentials with Institute Authentication...</span>
        </div>
      `;
    }

    const result = await auth.handleAuthCode(code);
    window.history.replaceState({}, document.title, window.location.pathname);

    if (result.success) {
      if (loginStatus) {
        loginStatus.innerHTML = '<span style="color:#059669; font-weight:600;">✓ Verification complete! Redirecting to Researcher Portal...</span>';
      }
      setTimeout(() => {
        if (router) router.navigate('/portal');
        else window.location.href = '/portal';
      }, 400);
    } else {
      if (loginStatus) loginStatus.style.display = 'none';
      if (loginError) {
        loginError.style.display = 'block';
        loginError.innerHTML = `<strong>Authentication Failed:</strong> ${result.error || 'Access denied'}`;
      }
      if (loginBtn) {
        loginBtn.style.pointerEvents = 'auto';
        loginBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          <span>Try Signing In Again</span>
        `;
      }
    }
  }

  // Load random scientific background
  loadRandomScientificBackground();
}

async function loadRandomScientificBackground() {
  const pane = document.getElementById('loginShowcasePane');
  if (!pane) return;

  const topics = ['galaxy', 'nebula', 'deep+space', 'telescope', 'hubble', 'astrophysics', 'supernova'];
  const topic = topics[Math.floor(Math.random() * topics.length)];

  try {
    const res = await fetch('https://images-api.nasa.gov/search?q=' + topic + '&media_type=image');
    if (res.ok) {
      const data = await res.json();
      const items = (data?.collection?.items || []).filter(it => it.links && it.links.length > 0 && it.links[0].href);
      if (items.length > 0) {
        const randomItem = items[Math.floor(Math.random() * Math.min(items.length, 25))];
        const rawHref = randomItem.links[0].href;
        const imgUrl = rawHref.replace(/~thumb\.jpg$/, '~large.jpg').replace(/~small\.jpg$/, '~large.jpg');
        const img = new Image();
        img.onload = () => {
          pane.style.backgroundImage = 'url("' + imgUrl + '")';
        };
        img.src = imgUrl;
      }
    }
  } catch (e) {
    pane.style.backgroundImage = "url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=85')";
  }
}
