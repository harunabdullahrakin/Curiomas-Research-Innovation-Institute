/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Dual-Mode Data Layer & Autz.org Authentication Client
 * Compatible with Cloudflare D1 SQL Relational Database + Zero-Downtime Local Persistence
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
    HERO_SETTINGS: "crii_hero_settings_v1",
    AUTZ_APP_ID: "crii_autz_app_id",
    AUTH_USER: "crii_auth_user",
    AUTH_TOKEN: "crii_auth_token",
    ALLOWED_USERS: "crii_allowed_users_v1",
    POSTS: "crii_posts_v2",
    INTERNS: "crii_interns_v2",
    DATASETS: "crii_datasets_v1"
  }
};

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

    // 3. Initial Seed Research Posts
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

    // 4. Initial Seed Interns & Team Members
    if (!localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.INTERNS)) {
      const seedRoster = {
        activeInterns: [
          {
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
          },
          {
            id: "team-002",
            name: "Aria Rahman",
            email: "aria.rahman@curiomas.org",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
            university: "Metropolitan University of Technology",
            degree: "B.Sc. Applied Physics",
            division: "Space & Astrophysics",
            role: "Principal Fellow — Astrophysics",
            cohort: "Founding",
            status: "Active",
            bio: "Lead investigator on terrestrial exoplanet atmospheres and spectroscopic synthetic retrieval models.",
            socials: { github: "https://github.com", linkedin: "https://linkedin.com" },
            projects: ["TRAPPIST-1e Atmospheric Retrieval"],
            isTeamMember: true,
            orderIndex: 2
          },
          {
            id: "team-003",
            name: "Zainab Chowdhury",
            email: "zainab.c@curiomas.org",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
            university: "Institute of Science & Technology",
            degree: "B.Sc. Biotechnology",
            division: "Astrobiology & Extremophiles",
            role: "Principal Fellow — Astrobiology",
            cohort: "Founding",
            status: "Active",
            bio: "Specializing in radiotrophic fungal biology, extremophile metabolic pathways, and deep-time biochemical resilience.",
            socials: { github: "https://github.com", linkedin: "https://linkedin.com" },
            projects: ["Extremophile Enzyme Stabilization"],
            isTeamMember: true,
            orderIndex: 3
          },
          {
            id: "int-001",
            name: "Kenji Takahashi",
            email: "kenji.t@curiomas.org",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
            university: "Tokyo Institute of Technology",
            degree: "M.Sc. Computational Biology",
            division: "AI & Computational Science",
            role: "Research Fellow",
            cohort: "Spring 2026",
            status: "Active",
            bio: "Developing equivariant graph neural networks for thermostable enzyme design inspired by hydrothermal vent microbes.",
            socials: { github: "https://github.com" },
            projects: ["DeepVent Graph Networks"],
            isTeamMember: false,
            orderIndex: 4
          },
          {
            id: "int-002",
            name: "Maya Lin-Cruz",
            email: "maya.l@curiomas.org",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            university: "National University",
            degree: "B.Sc. Evolutionary Genomics",
            division: "Ancient Biology & Paleontology",
            role: "Research Fellow",
            cohort: "Spring 2026",
            status: "Active",
            bio: "Reassessing Cambrian explosion chronologies through Bayesian relaxed molecular clocks and fossil calibrations.",
            socials: { github: "https://github.com" },
            projects: ["Ediacaran Divergence Rates"],
            isTeamMember: false,
            orderIndex: 5
          }
        ],
        applications: []
      };
      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INTERNS, JSON.stringify(seedRoster));
    }
  }

  // --- HERO SECTION CONFIGURATION ---
  getHeroSettings() {
    try {
      const raw = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.HERO_SETTINGS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      videoUrl: "assets/hero-bg.mp4",
      blurPx: 12,
      overlayOpacity: 0.55
    };
  }

  async saveHeroSettings(settings) {
    if (!settings) return;
    const sanitized = {
      videoUrl: settings.videoUrl || "assets/hero-bg.mp4",
      blurPx: Math.max(0, Math.min(40, Number(settings.blurPx) || 0)),
      overlayOpacity: Math.max(0, Math.min(1, Number(settings.overlayOpacity) || 0.55))
    };

    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.HERO_SETTINGS, JSON.stringify(sanitized));

    // Edge API sync
    try {
      const user = this.getCurrentUser();
      fetch(`${CRII_CONFIG.API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: "hero",
          value: sanitized,
          updatedBy: user ? (user.name || user.email) : "Administrator"
        })
      }).catch(() => {});
    } catch (e) {}

    return sanitized;
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
  async authenticateWithAutz(autzUserData) {
    if (!autzUserData || !autzUserData.email) {
      return { success: false, error: "Invalid authentication response from Autz.org" };
    }

    const email = autzUserData.email.toLowerCase().trim();
    const allowedUsers = this.getAllowedUsers();
    const matchedUser = allowedUsers.find(u => u.email.toLowerCase().trim() === email);

    if (!matchedUser) {
      return {
        success: false,
        isUnauthorized: true,
        email: email,
        error: `Access Denied: The account "${email}" is not authorized on the CRII Portal. Only whitelisted directors and researchers may authenticate.`
      };
    }

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
    if (targetEmail === "harunabdullahrakin@gmail.com") {
      return { success: false, error: "Cannot remove primary Super Admin account." };
    }
    users = users.filter(u => u.email.toLowerCase().trim() !== targetEmail);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.ALLOWED_USERS, JSON.stringify(users));
    return { success: true };
  }

  // --- POSTS & RESEARCH ARTICLES (D1 SQL SYNCED) ---
  async getPosts(options = {}) {
    // Attempt D1 fetch if online
    if (options.preferNetwork) {
      try {
        const query = options.includeDrafts ? '?includeDrafts=true' : '';
        const res = await fetch(`${CRII_CONFIG.API_BASE}/posts${query}`);
        if (res.ok) {
          const remote = await res.json();
          if (Array.isArray(remote) && remote.length > 0) {
            localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(remote));
            return remote;
          }
        }
      } catch (e) {}
    }

    const local = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.POSTS);
    let posts = local ? JSON.parse(local) : [];

    if (!options.includeDrafts) {
      posts = posts.filter(p => p.published !== false);
    }
    return posts;
  }

  async getPostBySlugOrId(identifier) {
    const posts = await this.getPosts({ includeDrafts: true });
    return posts.find(p => p.slug === identifier || p.id === identifier);
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

    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(posts));

    // Sync to Cloudflare D1 SQL
    try {
      fetch(`${CRII_CONFIG.API_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postRecord)
      }).catch(() => {});
    } catch (e) {}

    return postRecord;
  }

  async createPost(postData) {
    return this.savePost(postData);
  }

  async deletePost(id) {
    const posts = await this.getPosts({ includeDrafts: true });
    const filtered = posts.filter(p => p.id !== id);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(filtered));

    try {
      fetch(`${CRII_CONFIG.API_BASE}/posts/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}

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
        fetch(`${CRII_CONFIG.API_BASE}/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(target)
        }).catch(() => {});
      } catch (e) {}

      return target;
    }
    return null;
  }

  // --- INTERNS & CORE TEAM MEMBERS ---
  async getInternsData() {
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

    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INTERNS, JSON.stringify(data));

    // Cloudflare D1 sync
    try {
      fetch(`${CRII_CONFIG.API_BASE}/interns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      }).catch(() => {});
    } catch (e) {}

    return record;
  }

  async deleteIntern(id) {
    const data = await this.getInternsData();
    data.activeInterns = (data.activeInterns || []).filter(m => m.id !== id);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INTERNS, JSON.stringify(data));

    try {
      fetch(`${CRII_CONFIG.API_BASE}/interns/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}

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
      fetch(`${CRII_CONFIG.API_BASE}/interns/apply`, {
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

  // --- STATS ---
  async getStats() {
    const posts = await this.getPosts({ includeDrafts: true });
    const internsData = await this.getInternsData();
    return {
      publishedPapers: posts.filter(p => p.published).length,
      activeInterns: (internsData.activeInterns || []).length,
      pendingApplications: (internsData.applications || []).filter(a => a.status === 'Pending' || a.status === 'Under Review').length,
      openDatasets: 4
    };
  }
}

window.CRII_API = new CriiApiClient();
