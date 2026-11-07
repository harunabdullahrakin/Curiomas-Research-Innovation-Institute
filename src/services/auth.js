/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Enhanced Authentication & Session Security Service
 * Supports Cryptographic HMAC-SHA256 Signed Tokens + Cloudflare D1 SQL Verification
 */

export class AuthService {
  constructor() {
    this.currentUser = null;
    this.token = null;
    this.isVerified = false;
    this.initFromStorage();
  }

  initFromStorage() {
    try {
      this.token = localStorage.getItem('crii_auth_token') || null;
      const userRaw = localStorage.getItem('crii_auth_user');
      this.currentUser = userRaw ? JSON.parse(userRaw) : null;
    } catch (e) {
      this.currentUser = null;
      this.token = null;
    }
  }

  getToken() {
    return this.token || localStorage.getItem('crii_auth_token');
  }

  getCurrentUser() {
    if (this.currentUser) return this.currentUser;
    try {
      const u = localStorage.getItem('crii_auth_user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  }

  getUser() {
    return this.getCurrentUser();
  }

  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    if (!token || !user) return false;

    // If it's a signed v2 token, verify local expiration
    if (token.startsWith('crii_v2.')) {
      try {
        const parts = token.split('.');
        const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(b64));
        if (payload.exp && Date.now() > payload.exp) {
          this.clearSession();
          return false;
        }
      } catch (e) {
        // Fallback to true if base64 parse is not needed
      }
    }
    return true;
  }

  /**
   * Verify session with Cloudflare D1 SQL backend via /api/auth/me
   */
  async verifySession() {
    const token = this.getToken();
    if (!token) {
      return { authenticated: false, user: null };
    }

    try {
      const headers = { 'Accept': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers,
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          this.currentUser = data.user;
          this.isVerified = true;
          localStorage.setItem('crii_auth_user', JSON.stringify(data.user));
          return { authenticated: true, user: data.user };
        }
      } else if (res.status === 401) {
        const data = await res.json().catch(() => ({}));
        // If explicitly revoked by admin, wipe session
        if (data.revoked) {
          this.clearSession();
          return { authenticated: false, revoked: true, user: null };
        }
      }
    } catch (e) {
      console.warn('Session verification network error, keeping verified local cache:', e);
    }

    // If local token is still valid by timestamp, do not aggressively kick the user out
    if (this.isAuthenticated()) {
      return { authenticated: true, user: this.getCurrentUser(), cached: true };
    }

    this.clearSession();
    return { authenticated: false, user: null };
  }

  /**
   * Exchange Autz.org SSO authorization code for session
   */
  async handleAuthCode(code) {
    if (!code) return { success: false, error: 'No authorization code provided' };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
        credentials: 'include'
      });

      const data = await res.json();
      if (res.ok && data.success) {
        this.token = data.token;
        this.currentUser = data.user;
        this.isVerified = true;
        localStorage.setItem('crii_auth_token', data.token);
        localStorage.setItem('crii_auth_user', JSON.stringify(data.user));
        return { success: true, user: data.user, token: data.token };
      } else {
        return { success: false, error: data.error || 'Authentication rejected' };
      }
    } catch (e) {
      return { success: false, error: 'Network error connecting to authentication service' };
    }
  }

  /**
   * Logout and terminate session on server and client
   */
  async logout() {
    const token = this.getToken();
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch('/api/auth/logout', {
        method: 'POST',
        headers,
        credentials: 'include'
      }).catch(() => {});
    } finally {
      this.clearSession();
    }
  }

  clearSession() {
    this.currentUser = null;
    this.token = null;
    this.isVerified = false;
    localStorage.removeItem('crii_auth_token');
    localStorage.removeItem('crii_auth_user');
  }
}

export const auth = new AuthService();
if (typeof window !== 'undefined') {
  window.CRII_AUTH = auth;
}
