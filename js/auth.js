/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Autz.org Authentication & Permission Verification
 */

document.addEventListener('DOMContentLoaded', () => {
  initAutzAuthHandler();
});

function initAutzAuthHandler() {
  const autzBtn = document.getElementById('loginWithAutzBtn');
  const autzEmailInput = document.getElementById('autzEmailDirectInput');
  const autzDirectForm = document.getElementById('autzDirectForm');
  const errorContainer = document.getElementById('loginError');

  // 1. Direct Autz.org Launch Button
  if (autzBtn) {
    autzBtn.addEventListener('click', () => {
      const appId = window.CRII_API.getAutzAppId();
      const callbackOrigin = encodeURIComponent(window.location.origin + window.location.pathname);
      
      // Modal or prompt for Autz session
      const modal = document.getElementById('autzPromptModal');
      if (modal) {
        modal.classList.add('active');
      } else {
        // Fallback direct window
        const autzUrl = `https://autz.org/oauth?app_id=${appId}&callback=${callbackOrigin}`;
        window.open(autzUrl, '_blank', 'width=500,height=650');
      }
    });
  }

  // 2. Autz Verified Email Verification Form
  if (autzDirectForm) {
    autzDirectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = autzEmailInput.value.trim();
      const submitBtn = autzDirectForm.querySelector('button[type="submit"]');

      submitBtn.disabled = true;
      submitBtn.innerHTML = `Verifying with Autz.org...`;
      if (errorContainer) errorContainer.style.display = 'none';

      // Simulate Autz.org verified payload
      const autzPayload = {
        email: email,
        autzorg_id: `autz_${Math.random().toString(36).substring(2, 9)}`,
        verified: true
      };

      const result = await window.CRII_API.authenticateWithAutz(autzPayload);

      if (result.success) {
        window.showToast(`Access Granted: Welcome back, ${result.user.name}!`, 'success');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Verify & Sign In 🔒`;
        if (errorContainer) {
          errorContainer.innerHTML = `
            <strong>Security Alert:</strong> ${result.error}
          `;
          errorContainer.style.display = 'block';
        }
        window.showToast('Authentication Rejected: Not Whitelisted', 'error');
      }
    });
  }

  // Check URL query parameters for Autz.org callback token if redirected
  const urlParams = new URLSearchParams(window.location.search);
  const autzEmailParam = urlParams.get('autz_email') || urlParams.get('email');
  if (autzEmailParam) {
    window.CRII_API.authenticateWithAutz({
      email: autzEmailParam,
      autzorg_id: urlParams.get('autzorg_id') || 'autz_oauth',
      verified: true
    }).then(res => {
      if (res.success) {
        window.location.href = 'portal.html';
      } else {
        if (errorContainer) {
          errorContainer.innerText = res.error;
          errorContainer.style.display = 'block';
        }
      }
    });
  }
}

// Quick fill for testing
window.fillAutzAccount = function(email) {
  const input = document.getElementById('autzEmailDirectInput');
  if (input) {
    input.value = email;
  }
};
