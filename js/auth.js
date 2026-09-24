/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Authentication Form & Session Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('portalLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      const errorMsg = document.getElementById('loginError');
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      submitBtn.disabled = true;
      submitBtn.innerText = 'Authenticating...';
      if (errorMsg) errorMsg.style.display = 'none';

      const res = await window.CRII_API.login(email, password);
      if (res.success) {
        window.showToast(`Welcome back, ${res.user.name}!`, 'success');
        setTimeout(() => {
          window.location.reload();
        }, 400);
      } else {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Sign In to Portal';
        if (errorMsg) {
          errorMsg.innerText = res.error || 'Invalid credentials';
          errorMsg.style.display = 'block';
        }
        window.showToast('Login failed', 'error');
      }
    });
  }

  // Pre-fill demo account helper buttons
  window.fillDemoAccount = function(role) {
    const emailInput = document.getElementById('loginEmail');
    const passInput = document.getElementById('loginPassword');
    if (!emailInput || !passInput) return;

    if (role === 'admin') {
      emailInput.value = 'admin@curiomas.org';
      passInput.value = 'curiomas2026';
    } else {
      emailInput.value = 'aria@curiomas.org';
      passInput.value = 'research2026';
    }
  };
});
