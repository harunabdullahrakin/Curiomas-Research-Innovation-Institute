/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Dual-Mode Data Layer & Cloudflare Pages Functions Client
 * 
 * Auto-detects Cloudflare Pages Functions live environment:
 * - If /api/posts responds, routes all queries via Cloudflare Functions.
 * - Otherwise gracefully falls back to persistent client-side store (localStorage + seed fixtures).
 */

const CRII_CONFIG = {
  INSTITUTE_NAME: "Curiomas Research & Innovation Institute",
  ACRONYM: "CRII",
  MOTTO: "Learning has no bound",
  API_BASE: "/api",
  STORAGE_KEYS: {
    POSTS: "crii_posts_v1",
    INTERNS: "crii_interns_v1",
    DATASETS: "crii_datasets_v1",
    AUTH_USER: "crii_auth_user",
    AUTH_TOKEN: "crii_auth_token"
  }
};

class CriiApiClient {
  constructor() {
    this.isCfPagesFunctionAvailable = null;
    this.initStore();
  }

  // Initialize client-side persistence store with fallback seed data
  async initStore() {
    if (!localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.POSTS)) {
      try {
        const res = await fetch('data/seed-posts.json');
        if (res.ok) {
          const posts = await res.json();
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(posts));
        }
      } catch (e) {
        console.warn('Seed posts fetch fallback', e);
      }
    }

    if (!localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.INTERNS)) {
      try {
        const res = await fetch('data/seed-interns.json');
        if (res.ok) {
          const internsData = await res.json();
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INTERNS, JSON.stringify(internsData));
        }
      } catch (e) {
        console.warn('Seed interns fetch fallback', e);
      }
    }

    if (!localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.DATASETS)) {
      try {
        const res = await fetch('data/seed-datasets.json');
        if (res.ok) {
          const datasets = await res.json();
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.DATASETS, JSON.stringify(datasets));
        }
      } catch (e) {
        console.warn('Seed datasets fetch fallback', e);
      }
    }
  }

  // Probes whether /api/posts Cloudflare Pages Function is active
  async checkBackend() {
    if (this.isCfPagesFunctionAvailable !== null) {
      return this.isCfPagesFunctionAvailable;
    }
    try {
      const res = await fetch(`${CRII_CONFIG.API_BASE}/stats`, { method: 'HEAD' });
      this.isCfPagesFunctionAvailable = res.ok;
    } catch (e) {
      this.isCfPagesFunctionAvailable = false;
    }
    return this.isCfPagesFunctionAvailable;
  }

  // --- AUTHENTICATION ---
  async login(email, password) {
    const isCloudflare = await this.checkBackend();
    if (isCloudflare) {
      try {
        const res = await fetch(`${CRII_CONFIG.API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.AUTH_USER, JSON.stringify(data.user));
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.AUTH_TOKEN, data.token);
          return { success: true, user: data.user };
        }
        return { success: false, error: data.error || 'Authentication failed' };
      } catch (err) {
        console.warn('Cloudflare login failed, testing local fallback...', err);
      }
    }

    // Default Local / Mock Authentication for Testing
    // Admin demo: admin@curiomas.org / curiomas2026
    // Fellow demo: aria@curiomas.org / research2026
    if (email === 'admin@curiomas.org' && password === 'curiomas2026') {
      const user = {
        name: "Dr. K. Arisawa",
        email: "admin@curiomas.org",
        role: "Director of Research & Admin",
        division: "Institute Executive Council"
      };
      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.AUTH_TOKEN, "demo_jwt_token_admin_9823");
      return { success: true, user };
    } else if (email === 'aria@curiomas.org' && password === 'research2026') {
      const user = {
        name: "Aria Rahman",
        email: "aria@curiomas.org",
        role: "Senior Student Fellow",
        division: "Astrophysics & Space Science"
      };
      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.AUTH_TOKEN, "demo_jwt_token_fellow_4421");
      return { success: true, user };
    }

    return {
      success: false,
      error: "Invalid credentials. Use admin@curiomas.org / curiomas2026 or aria@curiomas.org / research2026"
    };
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

  // --- POSTS & RESEARCH ARTICLES ---
  async getPosts() {
    const isCloudflare = await this.checkBackend();
    if (isCloudflare) {
      try {
        const res = await fetch(`${CRII_CONFIG.API_BASE}/posts`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Cloudflare getPosts fallback', e);
      }
    }
    const local = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.POSTS);
    return local ? JSON.parse(local) : [];
  }

  async getPostBySlugOrId(identifier) {
    const posts = await this.getPosts();
    return posts.find(p => p.slug === identifier || p.id === identifier);
  }

  async createPost(postData) {
    const isCloudflare = await this.checkBackend();
    if (isCloudflare) {
      try {
        const res = await fetch(`${CRII_CONFIG.API_BASE}/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.AUTH_TOKEN)}`
          },
          body: JSON.stringify(postData)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Cloudflare createPost fallback', e);
      }
    }

    // Local Store Implementation
    const posts = await this.getPosts();
    const newPost = {
      ...postData,
      id: `crii-post-${Date.now()}`,
      slug: (postData.slug || postData.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      date: new Date().toISOString().split('T')[0],
      downloads: 0,
      citations: 0,
      published: postData.published !== undefined ? postData.published : true
    };
    posts.unshift(newPost);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return newPost;
  }

  async deletePost(id) {
    const isCloudflare = await this.checkBackend();
    if (isCloudflare) {
      try {
        await fetch(`${CRII_CONFIG.API_BASE}/posts/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.AUTH_TOKEN)}` }
        });
      } catch (e) {
        console.warn('Cloudflare deletePost fallback', e);
      }
    }
    const posts = await this.getPosts();
    const filtered = posts.filter(p => p.id !== id);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(filtered));
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

  // --- INTERNS & RESEARCH APPLICATIONS ---
  async getInternsData() {
    const isCloudflare = await this.checkBackend();
    if (isCloudflare) {
      try {
        const res = await fetch(`${CRII_CONFIG.API_BASE}/interns`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Cloudflare getInterns fallback', e);
      }
    }
    const raw = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.INTERNS);
    return raw ? JSON.parse(raw) : { activeInterns: [], applications: [] };
  }

  async submitInternApplication(formData) {
    const isCloudflare = await this.checkBackend();
    if (isCloudflare) {
      try {
        const res = await fetch(`${CRII_CONFIG.API_BASE}/interns`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Cloudflare submitInternApplication fallback', e);
      }
    }

    const data = await this.getInternsData();
    const newApp = {
      ...formData,
      id: `app-2026-${Math.floor(100 + Math.random() * 900)}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    data.applications.unshift(newApp);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INTERNS, JSON.stringify(data));
    return newApp;
  }

  async updateApplicationStatus(appId, newStatus) {
    const data = await this.getInternsData();
    const app = data.applications.find(a => a.id === appId);
    if (app) {
      app.status = newStatus;
      // If approved, optionally promote to active intern cohort
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
            projects: ["Onboarding & Orientation"],
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
    const isCloudflare = await this.checkBackend();
    if (isCloudflare) {
      try {
        const res = await fetch(`${CRII_CONFIG.API_BASE}/datasets`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Cloudflare getDatasets fallback', e);
      }
    }
    const raw = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.DATASETS);
    return raw ? JSON.parse(raw) : [];
  }

  async createDataset(datasetData) {
    const isCloudflare = await this.checkBackend();
    if (isCloudflare) {
      try {
        const res = await fetch(`${CRII_CONFIG.API_BASE}/datasets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datasetData)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Cloudflare createDataset fallback', e);
      }
    }

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

    const totalCitations = posts.reduce((acc, p) => acc + (p.citations || 0), 0);
    const totalDownloads = posts.reduce((acc, p) => acc + (p.downloads || 0), 0);

    return {
      publishedPapers: posts.filter(p => p.published).length,
      activeInterns: internsData.activeInterns.length,
      pendingApplications: internsData.applications.filter(a => a.status === 'Pending' || a.status === 'Under Review').length,
      openDatasets: datasets.length,
      totalDownloads: totalDownloads + 1420,
      totalCitations: totalCitations + 48
    };
  }
}

// Global Singleton Instance
window.CRII_API = new CriiApiClient();
