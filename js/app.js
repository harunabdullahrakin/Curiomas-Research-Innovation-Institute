/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Core Application Script & Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initUserSessionState();
  initToastContainer();
});

// Mobile Navigation Toggle
function initMobileNav() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('show');
      }
    });
  }
}

// Update Top Navigation depending on whether User is Logged In
function initUserSessionState() {
  const user = window.CRII_API ? window.CRII_API.getCurrentUser() : null;
  const portalBtn = document.querySelector('.nav-portal-btn');

  if (portalBtn && user) {
    portalBtn.innerHTML = `
      <span class="portal-user-chip" style="display:inline-flex;align-items:center;gap:0.4rem;">
        <span style="width:8px;height:8px;background:#10b981;border-radius:50%;box-shadow:0 0 8px #10b981;"></span>
        ${user.name.split(' ')[0]} (Portal)
      </span>
    `;
    portalBtn.href = "portal.html";
  }
}

// Global Toast Notifications
function initToastContainer() {
  if (!document.querySelector('.toast-container')) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

window.showToast = function (message, type = 'info', duration = 3800) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    initToastContainer();
    container = document.querySelector('.toast-container');
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✓';
  if (type === 'error') icon = '⚠';

  toast.innerHTML = `
    <span style="font-weight: bold; font-size: 1.1rem;">${icon}</span>
    <span style="font-size: 0.9rem;">${message}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, duration);
};

// Clipboard Helper
window.copyToClipboard = async function (text, successMsg = 'Copied to clipboard!') {
  try {
    await navigator.clipboard.writeText(text);
    window.showToast(successMsg, 'success');
  } catch (err) {
    window.showToast('Failed to copy to clipboard', 'error');
  }
};
