/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Institute Single Sign-On & Strict Whitelist Verification
 */

document.addEventListener('DOMContentLoaded', () => {
  initInstituteAuthHandler();
});

function initInstituteAuthHandler() {
  const loginBtn = document.getElementById('loginWithAutzBtn') || document.getElementById('loginWithAccountBtn');
  const loginStatus = document.getElementById('loginStatus');
  const loginError = document.getElementById('loginError');

  // Clean legacy cached app ID from localStorage if present
  if (localStorage.getItem('crii_autz_app_id') === 't0i7jkia') {
    localStorage.setItem('crii_autz_app_id', 'gqiqh6qia');
  }

  // If already authenticated and on login page, redirect directly to portal
  if (window.location.pathname.includes('login') && window.CRII_API && window.CRII_API.isAuthenticated()) {
    window.location.href = '/portal';
    return;
  }

  // 1. Primary Single Sign-On OAuth Link Setup
  if (loginBtn) {
    const appId = 'gqiqh6qia';
    const isLoginPath = window.location.pathname.includes('login');
    const callbackTarget = isLoginPath ? '/login.html' : '/portal.html';
    const callbackOrigin = window.location.origin.includes('curiomas.zone.id')
      ? `https://www.curiomas.zone.id${callbackTarget}`
      : (window.location.origin + callbackTarget);

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

  // 2. Capture and Exchange Authorization Code from Callback
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('auth_code') || urlParams.get('code');

  if (code) {
    // Show verifying state
    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.innerHTML = `
        <span class="spinner" style="display:inline-block; width:16px; height:16px; border:2px solid #ffffff; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; margin-right:0.6rem;"></span>
        <span>Authenticating...</span>
      `;
    }

    if (loginStatus) {
      loginStatus.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:center; gap:0.6rem;">
          <span class="spinner" style="display:inline-block; width:16px; height:16px; border:2px solid var(--accent-primary); border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite;"></span>
          <span>Verifying credentials with Institute Authentication...</span>
        </div>
      `;
      loginStatus.style.display = 'block';
    }

    if (loginError) loginError.style.display = 'none';

    // Call backend API to exchange code for userinfo & session token
    window.CRII_API.exchangeAutzCode(code).then(res => {
      // Clear sensitive code from browser history bar
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      if (res && res.success) {
        if (loginStatus) {
          loginStatus.innerHTML = `Access granted! Redirecting to research portal...`;
          loginStatus.style.background = 'rgba(16, 185, 129, 0.1)';
          loginStatus.style.borderColor = 'rgba(16, 185, 129, 0.3)';
          loginStatus.style.color = '#10b981';
        }
        if (window.showToast) {
          window.showToast(`Authenticated: Welcome, ${res.user.name}!`, 'success');
        }
        setTimeout(() => {
          if (window.location.pathname.includes('login')) {
            window.location.href = '/portal';
          } else {
            window.location.reload();
          }
        }, 600);
      } else {
        if (loginStatus) loginStatus.style.display = 'none';
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.6rem;"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            <span>Login with your account</span>
          `;
        }
        if (loginError) {
          loginError.innerHTML = `
            <strong>Authentication Failed:</strong> ${res.error || 'Access denied. Account is not authorized.'}
          `;
          loginError.style.display = 'block';
        }
        if (window.showToast) {
          window.showToast('Access Denied: Account not in authorized roster', 'error');
        }
      }
    }).catch(err => {
      if (loginStatus) loginStatus.style.display = 'none';
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.6rem;"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          <span>Login with your account</span>
        `;
      }
      if (loginError) {
        loginError.innerHTML = `<strong>Error:</strong> Failed to communicate with authentication service.`;
        loginError.style.display = 'block';
      }
    });
  }
}
