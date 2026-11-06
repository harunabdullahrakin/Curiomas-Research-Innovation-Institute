/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Dual-Mode Data Layer & Autz.org Authentication Client
 * Compatible with Cloudflare D1 SQL Relational Database + Zero-Downtime Local Persistence
 */

const CRII_CONFIG = {
  DEFAULT_INSTITUTE_NAME: "Curiomas Research & Innovation Institute",
  ACRONYM: "CRII",
  MOTTO: "Turning Curiosity into Action",
  DEFAULT_AUTZ_APP_ID: "gqiqh6qia",
  API_BASE: "/api",
  STORAGE_KEYS: {
    THEME: "crii_theme_mode",
    COOKIE_CONSENT: "crii_cookie_consent_v1",
    INSTITUTE_NAME: "crii_custom_navbar_title",
    INSTITUTE_LOGO: "crii_custom_logo_url",
    HERO_SETTINGS: "crii_hero_settings_v1",
    AUTZ_APP_ID: "crii_autz_app_id",
    AUTH_USER: "crii_auth_user",
    AUTH_TOKEN: "crii_auth_token",
    ALLOWED_USERS: "crii_allowed_users_v1",
    POSTS: "crii_posts_v2",
    INTERNS: "crii_interns_v2",
    DATASETS: "crii_datasets_v1",
    EMAILJS_TEMPLATE_ID: "crii_emailjs_template_id",
    DIVISIONS: "crii_divisions_v1",
    COHORTS: "crii_cohorts_v1",
    DELETED_POSTS: "crii_deleted_posts_v2",
    POSTS_INITIALIZED: "crii_posts_initialized_v2",
    FESTIVE_SETTINGS: "crii_festive_settings_v1"
  }
};

const CRII_DEFAULT_ARTICLES = [];

const CRII_PERMANENT_PURGED_POST_IDS = [
  'crii-article-exoplanetary-spectra',
  'crii-article-fossil-calibration',
  'crii-article-ml-biophysics',
  'crii-article-edge-of-habitability'
];

const CRII_LEGACY_PURGED_DIVISION_IDS = [
  'div-space-astrophysics',
  'div-ancient-biology',
  'div-ai-computational-science',
  'div-astrobiology'
];

const CRII_LEGACY_PURGED_COHORT_IDS = [
  'cohort-undergraduates',
  'cohort-postgraduates',
  'cohort-self-directed',
  'cohort-fellows',
  'Undergraduates',
  'Postgraduates',
  'Self-Directed Researchers',
  'Research Fellows'
];

const CRII_DEFAULT_DIVISIONS = [];

class CriiApiClient {
  constructor() {
    this.initStore();
  }

  // Initialize store and defaults
  async initStore() {
    // 1. Initial Whitelist
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

    // 2. Initial Hero Appearance Settings
    if (!localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.HERO_SETTINGS)) {
      const defaultHero = {
        videoUrl: "assets/hero-bg.mp4",
        blurPx: 12,
        overlayOpacity: 0.55
      };
      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.HERO_SETTINGS, JSON.stringify(defaultHero));
    }

    // 3. Purge permanent deleted posts from localStorage and sync tombstone
    try {
      let deletedList = [];
      const delRaw = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.DELETED_POSTS);
      if (delRaw) {
        const parsed = JSON.parse(delRaw);
        if (Array.isArray(parsed)) deletedList = parsed;
      }
      let tombstoneChanged = false;
      CRII_PERMANENT_PURGED_POST_IDS.forEach(id => {
        if (!deletedList.includes(id)) {
          deletedList.push(id);
          tombstoneChanged = true;
        }
      });
      if (tombstoneChanged) {
        localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.DELETED_POSTS, JSON.stringify(deletedList));
      }

      const storedPosts = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.POSTS);
      if (storedPosts) {
        const parsed = JSON.parse(storedPosts);
        if (Array.isArray(parsed)) {
          const purgedSet = new Set(CRII_PERMANENT_PURGED_POST_IDS);
          let cleaned = parsed.filter(p => p && p.id && !p.id.startsWith('crii-paper-2026-00') && !purgedSet.has(p.id));
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(cleaned));
        }
      } else {
        localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify([]));
      }
    } catch (e) {
      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify([]));
    }

    // 4. Initial Seed Interns & Team Members + Cache Purge
    const singleFounder = {
      id: "team-001",
      name: "Harun Abdullah Rakin",
      email: "harunabdullahrakin@gmail.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      university: "CRII Council",
      degree: "Director of Research",
      division: "Executive Council",
      role: "Super Admin & Lead Investigator",
      cohort: "Founding",
      status: "Active",
      bio: "Pioneering open computational science, astrophysical synthetic models, and multi-agent systems for student discovery.",
      socials: { github: "https://github.com/harunabdullahrakin", linkedin: "https://linkedin.com", email: "harunabdullahrakin@gmail.com" },
      projects: ["CRII Computational Core", "Autonomous Research Pipelines"],
      isTeamMember: true,
      orderIndex: 1
    };

    try {
      const stored = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.INTERNS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.activeInterns)) {
          const dummyIds = ['team-002', 'team-003', 'int-001', 'int-002', 'crii-int-002', 'crii-int-003', 'crii-int-004'];
          parsed.activeInterns = parsed.activeInterns.filter(m => !dummyIds.includes(m.id));
          if (!parsed.activeInterns.some(m => m.id === 'team-001')) {
            parsed.activeInterns.unshift(singleFounder);
          }
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INTERNS, JSON.stringify(parsed));
        }
      } else {
        localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INTERNS, JSON.stringify({
          activeInterns: [singleFounder],
          applications: []
        }));
      }
    } catch (e) {
      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INTERNS, JSON.stringify({
        activeInterns: [singleFounder],
        applications: []
      }));
    }

        // 6. Seed / Clean Research Divisions
    try {
      const storedDivs = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.DIVISIONS);
      if (storedDivs) {
        const parsed = JSON.parse(storedDivs);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(d => !CRII_LEGACY_PURGED_DIVISION_IDS.includes(d.id));
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.DIVISIONS, JSON.stringify(cleaned));
        }
      } else {
        localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.DIVISIONS, JSON.stringify([]));
      }
    } catch (e) {
      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.DIVISIONS, JSON.stringify([]));
    }
    // 5. Background sync settings and allowed users from Cloudflare D1
    this.syncSettingsFromDb().catch(() => {});
    this.syncAllowedUsersFromDb().catch(() => {});
  }

  // --- HERO & BRANDING CONFIGURATION (D1 SYNCED) ---
  async syncSettingsFromDb() {
    try {
      const res = await fetch(`${CRII_CONFIG.API_BASE}/settings`);
      if (res.ok) {
        const settings = await res.json();
        if (settings && settings.hero) {
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.HERO_SETTINGS, JSON.stringify(settings.hero));
        }
        if (settings && Array.isArray(settings.divisions)) {
          const cleaned = settings.divisions.filter(d => !CRII_LEGACY_PURGED_DIVISION_IDS.includes(d.id));
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.DIVISIONS, JSON.stringify(cleaned));
        }
        if (settings && settings.festive) {
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.FESTIVE_SETTINGS, JSON.stringify(settings.festive));
        }
        if (settings && settings.emailjs && settings.emailjs.templateId) {
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.EMAILJS_TEMPLATE_ID, settings.emailjs.templateId);
        }
        if (settings && settings.branding) {
          if (settings.branding.name) localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INSTITUTE_NAME, settings.branding.name);
          if (settings.branding.logoUrl) localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INSTITUTE_LOGO, settings.branding.logoUrl);
          if (settings.branding.autzAppId && settings.branding.autzAppId !== "t0i7jkia") {
            localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.AUTZ_APP_ID, settings.branding.autzAppId);
          }
          if (settings.branding.emailjsTemplateId) {
            localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.EMAILJS_TEMPLATE_ID, settings.branding.emailjsTemplateId);
          }
        }
      }
    } catch (e) {}
  }

  // --- FESTIVE THEMES (HOLI COLOR PAINTS & SPLATTERS) ---
  getFestiveSettings() {
    try {
      const raw = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.FESTIVE_SETTINGS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      mode: "auto",      // "auto", "always", or "disabled"
      theme: "holi",     // "holi" (Festival of colors vibrant paint splatters)
      intensity: 0.70    // 0.20 to 1.00
    };
  }

  async saveFestiveSettings(settings) {
    if (!settings) return;
    const sanitized = {
      mode: ["auto", "always", "disabled"].includes(settings.mode) ? settings.mode : "auto",
      theme: settings.theme || "holi",
      intensity: Math.max(0.1, Math.min(1, Number(settings.intensity) || 0.70))
    };

    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.FESTIVE_SETTINGS, JSON.stringify(sanitized));

    try {
      const user = this.getCurrentUser();
      await fetch(`${CRII_CONFIG.API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: "festive",
          value: sanitized,
          updatedBy: user ? (user.name || user.email) : "Administrator"
        })
      });
    } catch (e) {
      console.warn("Failed to sync festive settings to D1:", e);
    }

    return sanitized;
  }

  getHeroSettings() {
    try {
      const raw = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.HERO_SETTINGS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      videoUrl: "assets/hero-bg.mp4",
      blurPx: 12,
      overlayOpacity: 0.55,
      fontFamily: "Eyekons",
      backgroundImages: [
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=85",
        "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=85",
        "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1920&q=85",
        "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=85",
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=85"
      ],
      imageOpacity: 0.40
    };
  }

  async saveHeroSettings(settings) {
    if (!settings) return;
    const sanitized = {
      videoUrl: settings.videoUrl || "assets/hero-bg.mp4",
      blurPx: Math.max(0, Math.min(40, Number(settings.blurPx) || 0)),
      overlayOpacity: Math.max(0, Math.min(1, Number(settings.overlayOpacity) || 0.55)),
      fontFamily: settings.fontFamily || "Eyekons",
      backgroundImages: Array.isArray(settings.backgroundImages) ? settings.backgroundImages.filter(url => typeof url === 'string' && url.trim().length > 0) : [],
      imageOpacity: Math.max(0.05, Math.min(1, Number(settings.imageOpacity) || 0.40))
    };

    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.HERO_SETTINGS, JSON.stringify(sanitized));

    // Edge API sync to Cloudflare D1 SQL
    try {
      const user = this.getCurrentUser();
      await fetch(`${CRII_CONFIG.API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: "hero",
          value: sanitized,
          updatedBy: user ? (user.name || user.email) : "Administrator"
        })
      });
    } catch (e) {
      console.warn("Failed to sync hero settings to D1:", e);
    }

    return sanitized;
  }

  // --- INSTITUTE BRANDING & NAVBAR SETTINGS (D1 SYNCED) ---
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
    return localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.INSTITUTE_LOGO) || "assets/curiomas-no-bg.png";
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
    const stored = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.AUTZ_APP_ID);
    if (!stored || stored === "t0i7jkia") {
      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.AUTZ_APP_ID, "gqiqh6qia");
      return "gqiqh6qia";
    }
    return stored;
  }

  setAutzAppId(appId) {
    const sanitized = (appId || "").trim();
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.AUTZ_APP_ID, sanitized);
    return sanitized;
  }

  getEmailjsTemplateId() {
    return localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.EMAILJS_TEMPLATE_ID) || "zhelx7y";
  }

  setEmailjsTemplateId(id) {
    if (!id || typeof id !== 'string') return;
    const sanitized = id.trim();
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.EMAILJS_TEMPLATE_ID, sanitized);
    return sanitized;
  }

  async saveEmailjsTemplateId(id) {
    if (!id || typeof id !== 'string') return;
    const sanitized = this.setEmailjsTemplateId(id);
    try {
      const user = this.getCurrentUser();
      await fetch(`${CRII_CONFIG.API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: "emailjs",
          value: { templateId: sanitized },
          updatedBy: user ? (user.name || user.email) : "Administrator"
        })
      });
    } catch (e) {
      console.warn("Failed to sync emailjs settings to D1:", e);
    }
    return sanitized;
  }

  getInstituteSettings() {
    return {
      name: this.getInstituteName(),
      logoUrl: this.getInstituteLogo(),
      autzAppId: this.getAutzAppId(),
      emailjsTemplateId: this.getEmailjsTemplateId()
    };
  }

  async saveInstituteSettings(settings) {
    if (!settings) return;
    if (settings.name) this.setInstituteName(settings.name);
    if (settings.logo !== undefined) this.setInstituteLogo(settings.logo);
    if (settings.autzAppId) this.setAutzAppId(settings.autzAppId);
    if (settings.emailjsTemplateId) this.setEmailjsTemplateId(settings.emailjsTemplateId);

    try {
      const user = this.getCurrentUser();
      await fetch(`${CRII_CONFIG.API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: "branding",
          value: {
            name: this.getInstituteName(),
            logoUrl: this.getInstituteLogo(),
            autzAppId: this.getAutzAppId(),
            emailjsTemplateId: this.getEmailjsTemplateId()
          },
          updatedBy: user ? (user.name || user.email) : "Administrator"
        })
      });

      // Also persist direct emailjs key
      if (settings.emailjsTemplateId) {
        await this.saveEmailjsTemplateId(settings.emailjsTemplateId);
      }
    } catch (e) {
      console.warn("Failed to sync branding settings to D1:", e);
    }
  }

  // --- AUTZ.ORG OAUTH & STRICT WHITELIST AUTHENTICATION ---
  async exchangeAutzCode(code) {
    if (!code) {
      return { success: false, error: "Missing authorization code from Single Sign-On" };
    }

    try {
      const res = await fetch(`${CRII_CONFIG.API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          appId: this.getAutzAppId()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.AUTH_USER, JSON.stringify(data.user));
        localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.AUTH_TOKEN, data.token);
        return { success: true, user: data.user, token: data.token };
      } else {
        return { success: false, error: data.error || "Authentication failed" };
      }
    } catch (e) {
      console.error("Autz login error:", e);
      return { success: false, error: "Failed to connect to authentication backend" };
    }
  }

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.AUTH_USER));
    } catch (e) {
      return null;
    }
  }

  getAuthToken() {
    return localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.AUTH_TOKEN) || "";
  }

  async logout() {
    const token = this.getAuthToken();
    try {
      if (token) {
        await fetch(`${CRII_CONFIG.API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (e) {}
    localStorage.removeItem(CRII_CONFIG.STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(CRII_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    window.location.reload();
  }

  getAllowedUsers() {
    let users = [];
    try {
      const raw = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.ALLOWED_USERS);
      users = raw ? JSON.parse(raw) : [];
    } catch (e) {
      users = [];
    }

    if (!Array.isArray(users) || users.length === 0) {
      users = [
        {
          email: "harunabdullahrakin@gmail.com",
          name: "Harun Abdullah Rakin",
          role: "Super Admin & Director",
          division: "Institute Executive Council",
          status: "Active",
          addedDate: "2026-01-01"
        },
        {
          email: "admin@curiomas.org",
          name: "CRII Administration",
          role: "Institute Admin",
          division: "Operations & Governance",
          status: "Active",
          addedDate: "2026-01-01"
        }
      ];
      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.ALLOWED_USERS, JSON.stringify(users));
    }

    // Background sync from remote D1 (merges non-destructively)
    this.syncAllowedUsersFromDb().catch(() => {});
    return users;
  }

  async syncAllowedUsersFromDb() {
    try {
      const res = await fetch(`${CRII_CONFIG.API_BASE}/auth/users`);
      if (res.ok) {
        const remoteUsers = await res.json();
        if (Array.isArray(remoteUsers) && remoteUsers.length > 0) {
          const raw = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.ALLOWED_USERS);
          const localUsers = raw ? JSON.parse(raw) : [];

          // Merge by email: Remote users + any locally added users
          const userMap = new Map();
          remoteUsers.forEach(u => {
            if (u && u.email) userMap.set(u.email.toLowerCase().trim(), u);
          });
          localUsers.forEach(u => {
            if (u && u.email) {
              const k = u.email.toLowerCase().trim();
              if (!userMap.has(k)) {
                userMap.set(k, u);
              }
            }
          });

          const merged = Array.from(userMap.values());
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.ALLOWED_USERS, JSON.stringify(merged));
          return merged;
        }
      }
    } catch (e) {
      console.warn("syncAllowedUsersFromDb notice:", e);
    }
  }

  async addAllowedUser(userRecord) {
    if (!userRecord || !userRecord.email) {
      return { success: false, error: "Email is required" };
    }
    const email = userRecord.email.toLowerCase().trim();
    if (!email.includes("@")) {
      return { success: false, error: "Please enter a valid email address" };
    }

    const raw = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.ALLOWED_USERS);
    let users = raw ? JSON.parse(raw) : [];

    if (users.some(u => u.email.toLowerCase().trim() === email)) {
      return { success: false, error: "This email is already in the authorized list." };
    }

    const newRecord = {
      email: email,
      name: (userRecord.name || email.split('@')[0]).trim(),
      role: (userRecord.role || "Research Fellow").trim(),
      division: (userRecord.division || "Scientific Division").trim(),
      addedDate: new Date().toISOString().split('T')[0],
      status: "Active"
    };

    users.unshift(newRecord);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.ALLOWED_USERS, JSON.stringify(users));

    // Sync to Cloudflare D1 SQL backend
    try {
      const token = this.getAuthToken();
      await fetch(`${CRII_CONFIG.API_BASE}/auth/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newRecord)
      });
    } catch (e) {
      console.warn("D1 users sync error (safely retained locally):", e);
    }

    return { success: true, user: newRecord };
  }

  async removeAllowedUser(email) {
    const targetEmail = (email || '').toLowerCase().trim();
    if (targetEmail === "harunabdullahrakin@gmail.com") {
      return { success: false, error: "Cannot remove primary Super Admin account." };
    }

    const raw = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.ALLOWED_USERS);
    let users = raw ? JSON.parse(raw) : [];
    users = users.filter(u => u.email.toLowerCase().trim() !== targetEmail);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.ALLOWED_USERS, JSON.stringify(users));

    // Sync removal to Cloudflare D1 SQL backend
    try {
      const token = this.getAuthToken();
      await fetch(`${CRII_CONFIG.API_BASE}/auth/users?email=${encodeURIComponent(targetEmail)}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
    } catch (e) {
      console.warn("D1 delete user error:", e);
    }

    return { success: true };
  }


  // --- RESEARCH DIVISIONS MANAGEMENT (D1 SYNCED) ---
  async getDivisions() {
    try {
      const raw = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.DIVISIONS);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter(d => !CRII_LEGACY_PURGED_DIVISION_IDS.includes(d.id));
        }
      }
    } catch (e) {}
    return [];
  }

  async saveDivision(divisionData) {
    let divisions = await this.getDivisions();
    const id = divisionData.id || ('div-' + Date.now().toString(36));
    const idx = divisions.findIndex(d => d.id === id);

    const record = {
      ...divisionData,
      id,
      number: divisionData.number || String(idx >= 0 ? idx + 1 : divisions.length + 1).padStart(2, '0'),
      tag: divisionData.tag || ((divisionData.number || '01') + ' / RESEARCH DIVISION'),
      title: divisionData.title || "Untitled Division",
      desc: divisionData.desc || "",
      image: divisionData.image || "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=800&q=80",
      link: divisionData.link || "/research"
    };

    if (idx >= 0) {
      divisions[idx] = record;
    } else {
      divisions.push(record);
    }

    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.DIVISIONS, JSON.stringify(divisions));

    // Direct Cloudflare D1 settings sync
    try {
      const user = this.getCurrentUser();
      const editor = user ? (user.name || user.email) : "Administrator";
      await fetch(CRII_CONFIG.API_BASE + '/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: "divisions",
          value: divisions,
          updatedBy: editor
        })
      });
    } catch (e) {
      console.warn("Failed to sync divisions to D1:", e);
    }

    return record;
  }

  async deleteDivision(id) {
    let divisions = await this.getDivisions();
    divisions = divisions.filter(d => d.id !== id);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.DIVISIONS, JSON.stringify(divisions));

    // Direct Cloudflare D1 settings sync
    try {
      const user = this.getCurrentUser();
      const editor = user ? (user.name || user.email) : "Administrator";
      await fetch(CRII_CONFIG.API_BASE + '/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: "divisions",
          value: divisions,
          updatedBy: editor
        })
      });
    } catch (e) {
      console.warn("Failed to sync divisions delete to D1:", e);
    }

    return { success: true, id };
  }

  // --- WHO CAN JOIN US? / COHORT PROFILES (D1 SQL SYNCED) ---
  async getCohorts() {
    try {
      const raw = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.COHORTS);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter(c => !CRII_LEGACY_PURGED_COHORT_IDS.includes(c.id) && !CRII_LEGACY_PURGED_COHORT_IDS.includes(c.title));
        }
      }
    } catch (e) {}

    // Fallback to fetch from D1 settings
    try {
      const res = await fetch(CRII_CONFIG.API_BASE + '/settings');
      if (res.ok) {
        const settings = await res.json();
        if (Array.isArray(settings.cohorts)) {
          const filtered = settings.cohorts.filter(c => !CRII_LEGACY_PURGED_COHORT_IDS.includes(c.id) && !CRII_LEGACY_PURGED_COHORT_IDS.includes(c.title));
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.COHORTS, JSON.stringify(filtered));
          return filtered;
        }
      }
    } catch (e) {}

    return [];
  }

  async saveCohort(cohortData) {
    let cohorts = await this.getCohorts();
    const id = cohortData.id || ('cohort-' + Date.now().toString(36));
    const idx = cohorts.findIndex(c => c.id === id);

    const record = {
      ...cohortData,
      id,
      title: cohortData.title || "Untitled Profile",
      desc: cohortData.desc || "",
      image: cohortData.image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      link: cohortData.link || "/team#apply",
      linkText: cohortData.linkText || "Apply as Fellow"
    };

    if (idx >= 0) {
      cohorts[idx] = record;
    } else {
      cohorts.push(record);
    }

    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.COHORTS, JSON.stringify(cohorts));

    // Direct Cloudflare D1 settings sync
    try {
      const user = this.getCurrentUser();
      const editor = user ? (user.name || user.email) : "Administrator";
      await fetch(CRII_CONFIG.API_BASE + '/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: "cohorts",
          value: cohorts,
          updatedBy: editor
        })
      });
    } catch (e) {
      console.warn("Failed to sync cohorts to D1:", e);
    }

    return record;
  }

  async deleteCohort(id) {
    let cohorts = await this.getCohorts();
    cohorts = cohorts.filter(c => c.id !== id);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.COHORTS, JSON.stringify(cohorts));

    // Direct Cloudflare D1 settings sync
    try {
      const user = this.getCurrentUser();
      const editor = user ? (user.name || user.email) : "Administrator";
      await fetch(CRII_CONFIG.API_BASE + '/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: "cohorts",
          value: cohorts,
          updatedBy: editor
        })
      });
    } catch (e) {
      console.warn("Failed to sync cohorts delete to D1:", e);
    }

    return { success: true, id };
  }

  // --- POSTS & RESEARCH ARTICLES (D1 SQL SYNCED) ---
  async getPosts(options = {}) {
    let deletedIds = new Set(CRII_PERMANENT_PURGED_POST_IDS);
    try {
      const delRaw = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.DELETED_POSTS);
      if (delRaw) {
        const arr = JSON.parse(delRaw);
        if (Array.isArray(arr)) arr.forEach(id => deletedIds.add(id));
      }
    } catch (e) {}

    let localPosts = [];
    try {
      const local = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.POSTS);
      localPosts = local ? JSON.parse(local) : [];
      if (!Array.isArray(localPosts)) localPosts = [];
    } catch (e) {
      localPosts = [];
    }
    localPosts = localPosts.filter(p => p && !deletedIds.has(p.id));

    const isInitialized = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.POSTS_INITIALIZED) === 'true';

    // 1. Fetch directly from Cloudflare D1 SQL backend
    try {
      const query = options.includeDrafts ? '?includeDrafts=true' : '';
      const res = await fetch(`${CRII_CONFIG.API_BASE}/posts${query}`);
      if (res.ok) {
        const remote = await res.json();
        if (Array.isArray(remote)) {
          const validRemote = remote.filter(r => r && !deletedIds.has(r.id));
          const remoteIds = new Set(validRemote.map(r => r.id));
          const pendingLocal = localPosts.filter(p => !remoteIds.has(p.id) && !deletedIds.has(p.id));
          let merged = [...validRemote, ...pendingLocal];

          // Only seed if brand new, never initialized before, and no deleted tombstones
          if (!isInitialized && merged.length === 0 && deletedIds.size === 0) {
            merged = [...CRII_DEFAULT_ARTICLES];
            localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS_INITIALIZED, 'true');
          }

          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(merged));
          return options.includeDrafts ? merged : merged.filter(p => p.published !== false);
        }
      }
    } catch (e) {
      console.warn("D1 posts fetch error, falling back to cache:", e);
    }

    // 2. Cache fallback
    return options.includeDrafts ? localPosts : localPosts.filter(p => p.published !== false);
  }

  async getPostBySlugOrId(identifier) {
    if (!identifier) return null;
    // Attempt D1 fetch first
    try {
      const res = await fetch(`${CRII_CONFIG.API_BASE}/posts/${encodeURIComponent(identifier)}`);
      if (res.ok) {
        const post = await res.json();
        if (post && post.id) return post;
      }
    } catch (e) {}
    const posts = await this.getPosts({ includeDrafts: true });
    let found = posts.find(p => p.slug === identifier || p.id === identifier);
    if (!found) {
      found = CRII_DEFAULT_ARTICLES.find(p => p.slug === identifier || p.id === identifier);
    }
    return found || null;
  }

  async savePost(postData) {
    const posts = await this.getPosts({ includeDrafts: true });
    const user = this.getCurrentUser();
    const editorName = user ? (user.name || user.email) : "Institute Editor";
    const nowIso = new Date().toISOString();

    let postRecord;
    const existingIndex = posts.findIndex(p => p.id === postData.id);

    if (existingIndex >= 0) {
      postRecord = {
        ...posts[existingIndex],
        ...postData,
        updatedAt: nowIso,
        updatedBy: editorName
      };
      posts[existingIndex] = postRecord;
    } else {
      const id = postData.id || `crii-paper-${Date.now()}`;
      const slug = (postData.slug || postData.title || "paper")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      postRecord = {
        ...postData,
        id,
        slug,
        date: postData.date || nowIso.split('T')[0],
        updatedAt: nowIso,
        updatedBy: editorName,
        downloads: postData.downloads || 0,
        citations: postData.citations || 0,
        published: postData.published !== undefined ? postData.published : true
      };
      posts.unshift(postRecord);
    }

    if (postRecord.featured) {
      posts.forEach(p => {
        if (p.id !== postRecord.id) {
          p.featured = false;
        }
      });
    }

    // Always immediately persist locally to guarantee zero data loss
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(posts));

    // Direct Cloudflare D1 SQL write
    try {
      const res = await fetch(`${CRII_CONFIG.API_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postRecord)
      });
      if (res.ok) {
        const savedRemote = await res.json();
        Object.assign(postRecord, savedRemote);
        if (existingIndex >= 0) {
          posts[existingIndex] = postRecord;
        } else {
          posts[0] = postRecord;
        }
        localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(posts));
      } else {
        const errJson = await res.json().catch(() => ({}));
        console.warn("Server returned error when syncing post:", errJson);
      }
    } catch (e) {
      console.warn("Failed to sync post to D1:", e);
    }

    return postRecord;
  }

  async createPost(postData) {
    return this.savePost(postData);
  }

  async deletePost(id) {
    if (!id) return true;

    // 1. Record in tombstone
    let deletedList = [];
    try {
      const delRaw = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.DELETED_POSTS);
      if (delRaw) {
        const parsed = JSON.parse(delRaw);
        if (Array.isArray(parsed)) deletedList = parsed;
      }
    } catch (e) {}

    if (!deletedList.includes(id)) {
      deletedList.push(id);
      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.DELETED_POSTS, JSON.stringify(deletedList));
    }
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS_INITIALIZED, 'true');

    // 2. Remove from local store immediately
    let localPosts = [];
    try {
      const local = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.POSTS);
      localPosts = local ? JSON.parse(local) : [];
      if (Array.isArray(localPosts)) {
        localPosts = localPosts.filter(p => p.id !== id);
        localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(localPosts));
      }
    } catch (e) {}

    // 3. Remove draft key if any
    try {
      localStorage.removeItem('crii_doc_draft_' + id);
    } catch (e) {}

    // 4. Send DELETE to D1 backend
    try {
      await fetch(`${CRII_CONFIG.API_BASE}/posts/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {
      console.warn("Failed to delete post from D1:", e);
    }

    return true;
  }

  async togglePostPublish(id) {
    const posts = await this.getPosts({ includeDrafts: true });
    const target = posts.find(p => p.id === id);
    if (target) {
      target.published = !target.published;
      const user = this.getCurrentUser();
      target.updatedAt = new Date().toISOString();
      target.updatedBy = user ? (user.name || user.email) : "Administrator";

      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(posts));

      try {
        await fetch(`${CRII_CONFIG.API_BASE}/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(target)
        });
      } catch (e) {
        console.warn("Failed to sync publish state to D1:", e);
      }

      return target;
    }
    return null;
  }

  // --- INTERNS & CORE TEAM MEMBERS (D1 SQL SYNCED) ---
  async getInternsData() {
    // 1. Fetch live from Cloudflare D1 SQL backend
    try {
      const res = await fetch(`${CRII_CONFIG.API_BASE}/interns`);
      if (res.ok) {
        const remote = await res.json();
        if (remote && Array.isArray(remote.activeInterns)) {
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INTERNS, JSON.stringify(remote));
          return remote;
        }
      }
    } catch (e) {
      console.warn("D1 interns fetch error, falling back to cache:", e);
    }

    // 2. Cache fallback
    const raw = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.INTERNS);
    return raw ? JSON.parse(raw) : { activeInterns: [], applications: [] };
  }

  async getCoreTeamMembers() {
    const data = await this.getInternsData();
    return (data.activeInterns || []).filter(m => m.isTeamMember);
  }

  async getFellowsAndInterns() {
    const data = await this.getInternsData();
    return (data.activeInterns || []).filter(m => !m.isTeamMember);
  }

  async saveIntern(memberData) {
    const data = await this.getInternsData();
    const id = memberData.id || `crii-${memberData.isTeamMember ? 'team' : 'int'}-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const record = {
      ...memberData,
      id,
      name: memberData.name || "Researcher",
      email: memberData.email || "",
      avatar: memberData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      university: memberData.university || "CRII",
      degree: memberData.degree || "",
      division: memberData.division || "Space & Astrophysics",
      role: memberData.role || "Research Fellow",
      cohort: memberData.cohort || "Spring 2026",
      status: memberData.status || "Active",
      bio: memberData.bio || "",
      socials: memberData.socials || {},
      projects: Array.isArray(memberData.projects) ? memberData.projects : [],
      isTeamMember: Boolean(memberData.isTeamMember),
      orderIndex: Number(memberData.orderIndex) || 10,
      updatedAt: nowIso
    };

    const idx = data.activeInterns.findIndex(m => m.id === id);
    if (idx >= 0) {
      data.activeInterns[idx] = record;
    } else {
      data.activeInterns.push(record);
    }

    // Sort: team first, then orderIndex
    data.activeInterns.sort((a, b) => {
      if (a.isTeamMember !== b.isTeamMember) return a.isTeamMember ? -1 : 1;
      return (a.orderIndex || 99) - (b.orderIndex || 99);
    });

    // Save directly to Cloudflare D1 SQL database
    try {
      const res = await fetch(`${CRII_CONFIG.API_BASE}/interns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      if (res.ok) {
        const savedRemote = await res.json();
        Object.assign(record, savedRemote);
      }
    } catch (e) {
      console.warn("Failed to sync intern to D1:", e);
    }

    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INTERNS, JSON.stringify(data));
    return record;
  }

  async deleteIntern(id) {
    const data = await this.getInternsData();
    data.activeInterns = (data.activeInterns || []).filter(m => m.id !== id);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INTERNS, JSON.stringify(data));

    try {
      await fetch(`${CRII_CONFIG.API_BASE}/interns/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn("Failed to delete intern from D1:", e);
    }

    return true;
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
      await fetch(`${CRII_CONFIG.API_BASE}/interns/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      });
    } catch (e) {
      console.warn("Failed to sync application to D1:", e);
    }

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
          await this.saveIntern({
            name: app.fullName,
            email: app.email,
            university: app.university,
            degree: app.fieldOfStudy,
            division: app.preferredDivision,
            role: "Research Intern",
            cohort: "Upcoming Cohort",
            status: "Active",
            isTeamMember: false,
            bio: app.statement ? app.statement.slice(0, 140) + "..." : "Student Researcher at CRII"
          });
        }
      }
      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INTERNS, JSON.stringify(data));
      return app;
    }
    return null;
  }

  // --- DATASETS (OPEN REPRODUCIBLE DATA) ---
  async getDatasets() {
    let localDatasets = [];
    try {
      const local = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.DATASETS);
      localDatasets = local ? JSON.parse(local) : [];
      if (!Array.isArray(localDatasets)) localDatasets = [];
    } catch (e) {
      localDatasets = [];
    }

    try {
      const res = await fetch(`${CRII_CONFIG.API_BASE}/datasets`);
      if (res.ok) {
        const remote = await res.json();
        if (Array.isArray(remote) && remote.length > 0) {
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.DATASETS, JSON.stringify(remote));
          return remote;
        }
      }
    } catch (e) {
      console.warn("Datasets fetch error:", e);
    }

    if (localDatasets.length > 0) {
      return localDatasets;
    }

    // Default seed datasets fallback
    const defaultSeeds = [
      {
        id: "ds-crii-001",
        title: "TRAPPIST-1e Synthetic Atmospheric Transmission Spectra (0.6 - 12.0 μm)",
        category: "Space & Astrophysics",
        version: "v1.4.0",
        updated: "2026-03-12",
        format: "CSV & HDF5",
        size: "42.8 MB",
        license: "CC-BY 4.0 Open Science",
        leadResearcher: "Aria Rahman",
        description: "Synthetic radiative transfer transits modeled under 6 distinct atmospheric regimes.",
        parameters: ["Wavelength (μm)", "Transit Depth (ppm)", "1-sigma Uncertainty", "Molecular Absorption", "Stellar Flare Residual"],
        previewRows: [
          { "wavelength_um": 0.852, "transit_depth_ppm": 5280.12, "uncertainty": 12.4, "primary_absorber": "H2O / Rayleigh", "regime": "Archean" },
          { "wavelength_um": 1.414, "transit_depth_ppm": 5315.40, "uncertainty": 14.1, "primary_absorber": "H2O", "regime": "Archean" },
          { "wavelength_um": 3.310, "transit_depth_ppm": 5392.88, "uncertainty": 18.2, "primary_absorber": "CH4", "regime": "Archean" },
          { "wavelength_um": 4.280, "transit_depth_ppm": 5540.60, "uncertainty": 21.0, "primary_absorber": "CO2", "regime": "Archean" },
          { "wavelength_um": 9.600, "transit_depth_ppm": 5304.15, "uncertainty": 28.5, "primary_absorber": "O3 (Trace)", "regime": "Archean" }
        ]
      },
      {
        id: "ds-crii-002",
        title: "Ediacaran-Cambrian Metazoan Ortholog Calibrations & Fossil Node Chronologies",
        category: "Ancient Biology & Paleontology",
        version: "v2.1.0",
        updated: "2026-02-25",
        format: "JSON & FASTA",
        size: "18.3 MB",
        license: "CC-BY 4.0 Open Science",
        leadResearcher: "Shayan Debnath",
        description: "Curated dataset comprising 124 orthologous ribosomal and mitochondrial protein alignments with stratigraphic calibrations.",
        parameters: ["Gene Family ID", "Phylogenetic Clade", "Minimum Node Age (Ma)", "Maximum Node Age (Ma)", "Stratigraphic Reference"],
        previewRows: [
          { "clade": "Basal Bilateria", "node_min_ma": 575.4, "node_max_ma": 612.0, "calibration_marker": "Lantian / Doushantuo", "tree_support_posterior": 0.98 },
          { "clade": "Ecdysozoa", "node_min_ma": 541.0, "node_max_ma": 560.2, "calibration_marker": "Cloudina / Kimberella", "tree_support_posterior": 0.95 },
          { "clade": "Lophotrochozoa", "node_min_ma": 538.8, "node_max_ma": 558.0, "calibration_marker": "Small Shelly Fossils (SSF)", "tree_support_posterior": 0.96 },
          { "clade": "Deuterostomia", "node_min_ma": 526.0, "node_max_ma": 545.1, "calibration_marker": "Chengjiang Vetulicolians", "tree_support_posterior": 0.92 }
        ]
      }
    ];
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.DATASETS, JSON.stringify(defaultSeeds));
    return defaultSeeds;
  }

  async createDataset(datasetData) {
    const datasets = await this.getDatasets();
    const newRecord = {
      ...datasetData,
      id: datasetData.id || `ds-crii-${Date.now().toString(36)}`,
      updated: new Date().toISOString().split('T')[0],
      version: datasetData.version || "v1.0.0"
    };
    datasets.unshift(newRecord);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.DATASETS, JSON.stringify(datasets));

    try {
      await fetch(`${CRII_CONFIG.API_BASE}/datasets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      });
    } catch (e) {}

    return newRecord;
  }

  // --- STATS ---
  async getStats() {
    const posts = await this.getPosts({ includeDrafts: true });
    const internsData = await this.getInternsData();
    const datasets = await this.getDatasets().catch(() => []);
    return {
      publishedPapers: posts.filter(p => p.published).length,
      activeInterns: (internsData.activeInterns || []).length,
      pendingApplications: (internsData.applications || []).filter(a => a.status === 'Pending' || a.status === 'Under Review').length,
      openDatasets: datasets.length
    };
  }
}

window.CRII_API = new CriiApiClient();
