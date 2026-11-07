/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Enhanced Authentication & Session Security Service
 * Supports HttpOnly Secure Cookies + Bearer Token + Cloudflare D1 SQL Verification
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

  isAuthenticated() {
    return Boolean(this.getToken() && this.getCurrentUser());
  }

  /**
   * Verify session with Cloudflare D1 SQL backend via /api/auth/me
   * Sends both Authorization header and credentials: 'include' for HttpOnly cookie
   */
  async verifySession() {
    const token = this.getToken();
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
      }
    } catch (e) {
      console.warn('Session verification network error, keeping local cache:', e);
      if (this.isAuthenticated()) {
        return { authenticated: true, user: this.currentUser, cached: true };
      }
    }

    // If server rejected or token invalid, clear local auth
    if (this.token) {
      this.clearSession();
    }
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
window.CRII_AUTH = auth;
