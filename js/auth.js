/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Autz.org SSO OAuth & Strict Whitelist Verification
 */

document.addEventListener('DOMContentLoaded', () => {
  initAutzAuthHandler();
});

function initAutzAuthHandler() {
  const autzBtn = document.getElementById('loginWithAutzBtn');
  const loginStatus = document.getElementById('loginStatus');
  const loginError = document.getElementById('loginError');

  // Clean legacy cached app ID from localStorage if present
  if (localStorage.getItem('crii_autz_app_id') === 't0i7jkia') {
    localStorage.setItem('crii_autz_app_id', 'gqiqh6qia');
  }

  // 1. Primary Autz.org OAuth Link Setup
  if (autzBtn) {
    const appId = 'gqiqh6qia';
    const callbackOrigin = window.location.origin.includes('curiomas.zone.id')
      ? 'https://www.curiomas.zone.id/portal.html'
      : (window.location.origin + window.location.pathname);

    const autzUrl = `https://autz.org/onboarding/${encodeURIComponent(appId)}?callback_url=${encodeURIComponent(callbackOrigin)}`;
    autzBtn.setAttribute('href', autzUrl);

    autzBtn.addEventListener('click', () => {
      autzBtn.style.pointerEvents = 'none';
      autzBtn.innerHTML = `
        <span class="spinner" style="display:inline-block; width:16px; height:16px; border:2px solid #ffffff; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; margin-right:0.5rem;"></span>
        <span>Redirecting to Autz.org...</span>
      `;
    });
  }

  // 2. Capture and Exchange Authorization Code from Autz.org Callback
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('auth_code') || urlParams.get('code');

  if (code) {
    // Show verifying state
    if (autzBtn) {
      autzBtn.disabled = true;
      autzBtn.innerHTML = `
        <span class="spinner" style="display:inline-block; width:16px; height:16px; border:2px solid #ffffff; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; margin-right:0.5rem;"></span>
        <span>Authenticating...</span>
      `;
    }

    if (loginStatus) {
      loginStatus.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:center; gap:0.5rem;">
          <span class="spinner" style="display:inline-block; width:16px; height:16px; border:2px solid var(--accent-primary); border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite;"></span>
          <span>Verifying credentials with Autz.org & Cloudflare SQL...</span>
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
          loginStatus.innerHTML = `Access granted! Loading research portal...`;
          loginStatus.style.background = 'rgba(16, 185, 129, 0.1)';
          loginStatus.style.borderColor = 'rgba(16, 185, 129, 0.3)';
          loginStatus.style.color = '#10b981';
        }
        if (window.showToast) {
          window.showToast(`Authenticated: Welcome, ${res.user.name}!`, 'success');
        }
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        if (loginStatus) loginStatus.style.display = 'none';
        if (autzBtn) {
          autzBtn.disabled = false;
          autzBtn.innerHTML = `
            <span class="autz-logo-badge">Autz.org</span>
            <span>Sign In with Autz.org</span>
          `;
        }
        if (loginError) {
          loginError.innerHTML = `
            <strong>Authentication Failed:</strong> ${res.error || 'Access denied. Account is not authorized.'}
          `;
          loginError.style.display = 'block';
        }
        if (window.showToast) {
          window.showToast('Access Denied: Not Whitelisted', 'error');
        }
      }
    }).catch(err => {
      if (loginStatus) loginStatus.style.display = 'none';
      if (autzBtn) {
        autzBtn.disabled = false;
        autzBtn.innerHTML = `
          <span class="autz-logo-badge">Autz.org</span>
          <span>Sign In with Autz.org</span>
        `;
      }
      if (loginError) {
        loginError.innerHTML = `<strong>Error:</strong> Failed to communicate with authentication service.`;
        loginError.style.display = 'block';
      }
    });
  }
}
