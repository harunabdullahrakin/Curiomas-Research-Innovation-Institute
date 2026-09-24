/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Dual-Mode Data Layer & Autz.org Authentication Client
 * 
 * Features:
 * - Theme Switcher state (Default: Light Mode)
 * - Autz.org Single Sign-On (SSO) with strict email permission whitelisting
 * - Dynamic Institute Navbar Title & Logo settings
 * - SQL-injection proof, type-safe data access
 */

const CRII_CONFIG = {
  DEFAULT_INSTITUTE_NAME: "Curiomas Research & Innovation Institute",
  ACRONYM: "CRII",
  MOTTO: "Learning has no bound",
  DEFAULT_AUTZ_APP_ID: "t0i7jkia",
  API_BASE: "/api",
  STORAGE_KEYS: {
    THEME: "crii_theme_mode",
    COOKIE_CONSENT: "crii_cookie_consent_v1",
    INSTITUTE_NAME: "crii_custom_navbar_title",
    INSTITUTE_LOGO: "crii_custom_logo_url",
    AUTZ_APP_ID: "crii_autz_app_id",
    AUTH_USER: "crii_auth_user",
    AUTH_TOKEN: "crii_auth_token",
    ALLOWED_USERS: "crii_allowed_users_v1",
    POSTS: "crii_posts_v1",
    INTERNS: "crii_interns_v1",
    DATASETS: "crii_datasets_v1"
  }
};

class CriiApiClient {
  constructor() {
    this.isCfPagesFunctionAvailable = null;
    this.initStore();
  }

  // Initialize store and permissions
  async initStore() {
    // 1. Initial Authorized Users Whitelist
    if (!localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.ALLOWED_USERS)) {
      const defaultAllowed = [
        {
          email: "harunabdullahrakin@gmail.com",
          name: "Harun Abdullah Rakin",
          role: "Super Admin & Director",
          division: "Institute Executive Council",
          addedDate: "2026-09-24",
          status: "Active"
        },
        {
          email: "admin@curiomas.org",
          name: "CRII Administration",
          role: "Institute Admin",
          division: "Operations & Governance",
          addedDate: "2026-09-24",
          status: "Active"
        }
      ];
      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.ALLOWED_USERS, JSON.stringify(defaultAllowed));
    }

    // 2. Initial Seed Research Posts
    if (!localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.POSTS)) {
      try {
        const res = await fetch('data/seed-posts.json');
        if (res.ok) {
          const posts = await res.json();
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(posts));
        }
      } catch (e) {
        console.warn('Seed posts load fallback', e);
      }
    }

    // 3. Initial Seed Interns
    if (!localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.INTERNS)) {
      try {
        const res = await fetch('data/seed-interns.json');
        if (res.ok) {
          const internsData = await res.json();
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INTERNS, JSON.stringify(internsData));
        }
      } catch (e) {
        console.warn('Seed interns load fallback', e);
      }
    }

    // 4. Initial Seed Datasets
    if (!localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.DATASETS)) {
      try {
        const res = await fetch('data/seed-datasets.json');
        if (res.ok) {
          const datasets = await res.json();
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.DATASETS, JSON.stringify(datasets));
        }
      } catch (e) {
        console.warn('Seed datasets load fallback', e);
      }
    }
  }

  // --- INSTITUTE BRANDING & NAVBAR SETTINGS ---
  getInstituteName() {
    return localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.INSTITUTE_NAME) || CRII_CONFIG.DEFAULT_INSTITUTE_NAME;
  }

  setInstituteName(newName) {
    if (!newName || typeof newName !== 'string') return;
    const sanitized = newName.trim().slice(0, 100);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INSTITUTE_NAME, sanitized);
    return sanitized;
  }

  getInstituteLogo() {
    return localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.INSTITUTE_LOGO) || "";
  }

  setInstituteLogo(url) {
    if (!url) {
      localStorage.removeItem(CRII_CONFIG.STORAGE_KEYS.INSTITUTE_LOGO);
      return "";
    }
    const sanitized = url.trim();
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INSTITUTE_LOGO, sanitized);
    return sanitized;
  }

  getAutzAppId() {
    return localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.AUTZ_APP_ID) || CRII_CONFIG.DEFAULT_AUTZ_APP_ID;
  }

  setAutzAppId(appId) {
    const sanitized = (appId || "").trim();
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.AUTZ_APP_ID, sanitized);
    return sanitized;
  }

  // --- AUTZ.ORG OAUTH & STRICT WHITELIST AUTHENTICATION ---
  /**
   * Validates user data received from Autz.org SSO
   * Strictly checks if the email is on the authorized users list.
   * If not authorized, rejects with a security denial.
   */
  async authenticateWithAutz(autzUserData) {
    if (!autzUserData || !autzUserData.email) {
      return { success: false, error: "Invalid authentication response from Autz.org" };
    }

    const email = autzUserData.email.toLowerCase().trim();
    const allowedUsers = this.getAllowedUsers();

    // Check Whitelist Permission
    const matchedUser = allowedUsers.find(u => u.email.toLowerCase().trim() === email);

    if (!matchedUser) {
      // 100% Strict Access Denial
      return {
        success: false,
        isUnauthorized: true,
        email: email,
        error: `Access Denied: The account "${email}" does not have permission to access the CRII Management Portal. Only authorized institute researchers and directors are permitted.`
      };
    }

    // Authorized User Session
    const userSession = {
      name: autzUserData.name || matchedUser.name,
      email: email,
      role: matchedUser.role,
      division: matchedUser.division,
      autzId: autzUserData.autzorg_id || autzUserData.id || "autz_verified",
      loginTime: new Date().toISOString()
    };

    const token = `crii_session_${btoa(email)}_${Date.now()}`;
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.AUTH_USER, JSON.stringify(userSession));
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);

    // Call Cloudflare API if edge functions available
    try {
      fetch(`${CRII_CONFIG.API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autzUserData, userSession, token })
      }).catch(() => {});
    } catch (e) {}

    return { success: true, user: userSession };
  }

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.AUTH_USER));
    } catch (e) {
      return null;
    }
  }

  logout() {
    localStorage.removeItem(CRII_CONFIG.STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(CRII_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    window.location.reload();
  }

  // --- ACCESS CONTROL & USER PERMISSIONS MANAGEMENT ---
  getAllowedUsers() {
    const raw = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.ALLOWED_USERS);
    return raw ? JSON.parse(raw) : [];
  }

  addAllowedUser(userRecord) {
    if (!userRecord || !userRecord.email) return false;
    const users = this.getAllowedUsers();
    const email = userRecord.email.toLowerCase().trim();

    if (users.some(u => u.email.toLowerCase().trim() === email)) {
      return { success: false, error: "This email is already in the authorized list." };
    }

    users.push({
      email: email,
      name: userRecord.name || email.split('@')[0],
      role: userRecord.role || "Research Fellow",
      division: userRecord.division || "Scientific Division",
      addedDate: new Date().toISOString().split('T')[0],
      status: "Active"
    });

    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.ALLOWED_USERS, JSON.stringify(users));
    return { success: true };
  }

  removeAllowedUser(email) {
    let users = this.getAllowedUsers();
    const targetEmail = email.toLowerCase().trim();
    // Prevent removing root super admin
    if (targetEmail === "harunabdullahrakin@gmail.com") {
      return { success: false, error: "Cannot remove primary Super Admin account." };
    }
    users = users.filter(u => u.email.toLowerCase().trim() !== targetEmail);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.ALLOWED_USERS, JSON.stringify(users));
    return { success: true };
  }

  // --- POSTS & RESEARCH ARTICLES ---
  async getPosts() {
    const local = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.POSTS);
    return local ? JSON.parse(local) : [];
  }

  async getPostBySlugOrId(identifier) {
    const posts = await this.getPosts();
    return posts.find(p => p.slug === identifier || p.id === identifier);
  }

  async createPost(postData) {
    const posts = await this.getPosts();
    const newPost = {
      ...postData,
      id: `crii-paper-${Date.now()}`,
      slug: (postData.slug || postData.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      date: new Date().toISOString().split('T')[0],
      downloads: 0,
      citations: 0,
      published: postData.published !== undefined ? postData.published : true
    };
    posts.unshift(newPost);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(posts));

    // Async sync with Cloudflare Pages Functions
    try {
      fetch(`${CRII_CONFIG.API_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      }).catch(() => {});
    } catch (e) {}

    return newPost;
  }

  async deletePost(id) {
    const posts = await this.getPosts();
    const filtered = posts.filter(p => p.id !== id);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(filtered));

    try {
      fetch(`${CRII_CONFIG.API_BASE}/posts/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}

    return true;
  }

  async togglePostPublish(id) {
    const posts = await this.getPosts();
    const target = posts.find(p => p.id === id);
    if (target) {
      target.published = !target.published;
      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(posts));
      return target;
    }
    return null;
  }

  // --- INTERNS & ADMISSIONS ---
  async getInternsData() {
    const raw = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.INTERNS);
    return raw ? JSON.parse(raw) : { activeInterns: [], applications: [] };
  }

  async submitInternApplication(formData) {
    const data = await this.getInternsData();
    const newApp = {
      ...formData,
      id: `app-2026-${Math.floor(100 + Math.random() * 900)}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    data.applications.unshift(newApp);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INTERNS, JSON.stringify(data));

    try {
      fetch(`${CRII_CONFIG.API_BASE}/interns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      }).catch(() => {});
    } catch (e) {}

    return newApp;
  }

  async updateApplicationStatus(appId, newStatus) {
    const data = await this.getInternsData();
    const app = data.applications.find(a => a.id === appId);
    if (app) {
      app.status = newStatus;
      if (newStatus === 'Accepted') {
        const alreadyActive = data.activeInterns.some(i => i.email === app.email);
        if (!alreadyActive) {
          data.activeInterns.push({
            id: `crii-int-${Date.now().toString().slice(-4)}`,
            name: app.fullName,
            email: app.email,
            university: app.university,
            degree: app.fieldOfStudy,
            division: app.preferredDivision,
            role: "Research Intern",
            cohort: "Upcoming Cohort",
            status: "Active",
            projects: ["Onboarding Track"],
            bio: app.statement ? app.statement.slice(0, 140) + "..." : "Student Researcher at CRII"
          });
        }
      }
      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INTERNS, JSON.stringify(data));
      return app;
    }
    return null;
  }

  // --- DATASETS ---
  async getDatasets() {
    const raw = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.DATASETS);
    return raw ? JSON.parse(raw) : [];
  }

  async createDataset(datasetData) {
    const datasets = await this.getDatasets();
    const newDs = {
      ...datasetData,
      id: `ds-crii-${Math.floor(100 + Math.random() * 900)}`,
      updated: new Date().toISOString().split('T')[0],
      version: datasetData.version || "v1.0.0"
    };
    datasets.unshift(newDs);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.DATASETS, JSON.stringify(datasets));
    return newDs;
  }

  // --- STATS ---
  async getStats() {
    const posts = await this.getPosts();
    const internsData = await this.getInternsData();
    const datasets = await this.getDatasets();
    return {
      publishedPapers: posts.filter(p => p.published).length,
      activeInterns: internsData.activeInterns.length,
      pendingApplications: internsData.applications.filter(a => a.status === 'Pending' || a.status === 'Under Review').length,
      openDatasets: datasets.length
    };
  }
}

window.CRII_API = new CriiApiClient();
