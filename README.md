# Curiomas Research & Innovation Institute (CRII)
> *"From Deep Space to Ancient Biology — Learning Has No Bound."*

A modern, student-led scientific research institute web platform built for high-performance hosting on **Cloudflare Pages** with serverless **Cloudflare Pages Functions** (`/functions/api/`).

---

## 🌌 Overview

**Curiomas Research & Innovation Institute (CRII)** is an autonomous student research collective. The institute bridges frontiers from astrophysics and rocky exoplanetary atmospheres to ancient Ediacaran-Cambrian paleogenomics, AI structural biology, and astrobiological radio-synthesis.

This web application includes:
- **Hero & Public Hub**: Interactive constellation and neural synaptic canvas, live statistics bar, research division spotlights.
- **Research & Open Datasets Catalog**: Filter by discipline (*Space & Astrophysics*, *Ancient Biology*, *AI & Computational*, *Astrobiology*), search by author/keyword, live APA/BibTeX citation generator, and dataset sample inspection.
- **Full Article / Preprint Reader View**: Rich typography, reading progress bar, KaTeX math blocks, abstract callouts, and citation copying.
- **Scientific Dispatches & Blog**: Tag clouds, student reflections, and field notes.
- **Interns Showcase & Admissions Portal**: Directory of active student fellows and an interactive internship application form.
- **Admin & Researcher Management Portal (`portal.html`)**:
  - Secure authentication with session verification (`/api/auth/login`, `/api/auth/me`).
  - Interactive research paper publisher with live Markdown preview and metadata controls.
  - Admissions Queue with applicant review modal (one-click accept/enroll, interview, decline).
  - Open dataset registration and parameter tracking.
  - JSON database export and backup diagnostics.
- **Cloudflare Pages Serverless Backend (`/functions/api/`)**:
  - Full REST API ready for Cloudflare edge deployment with optional KV / D1 persistence.
  - Dual-Mode Client Adapter (`js/config.js`): Works automatically whether deployed live on Cloudflare Pages or previewed locally with instant fallback fixtures!

---

## 📂 Project Structure

```
curiomas-crii/
├── index.html              # Institute Homepage & Hero
├── research.html           # Research Papers & Open Datasets Catalog
├── blog.html               # Scientific Dispatches & Blog with Tags
├── article.html            # Full Research Paper Reader & Citation Engine
├── interns.html            # Fellows Roster & Intern Application Form
├── portal.html             # Admin & Researcher Management Dashboard
├── css/
│   ├── style.css           # Core Design System (Cosmic Dark & Bioluminescence)
│   ├── components.css      # Reusable Cards, Modals, Badges, Tabs, Forms
│   └── portal.css          # Admin Portal & Split-Pane Editor Layouts
├── js/
│   ├── config.js           # Dual-Mode Data Layer (Cloudflare API vs Local Store)
│   ├── app.js              # Navigation, User Session, Toasts, Clipboard
│   ├── canvas.js           # Cosmic & Synaptic Interactive Particle Simulation
│   ├── research.js         # Filtering, Search, APA/BibTeX Citation Generator
│   ├── blog.js             # Blog rendering and tag filter
│   ├── article.js          # Reader view with markdown parser & reading bar
│   ├── interns.js          # Roster showcase & admissions application handler
│   ├── auth.js             # Authentication form & session manager
│   └── portal.js           # CRUD for papers, admissions review, datasets
├── functions/              # Cloudflare Pages Functions (Serverless Backend)
│   ├── _middleware.js      # Global CORS and Security Headers
│   └── api/
│       ├── stats.js        # GET /api/stats (Aggregate institute statistics)
│       ├── auth/
│       │   ├── login.js    # POST /api/auth/login (Issues edge session token)
│       │   └── me.js       # GET /api/auth/me (Verifies token)
│       ├── posts/
│       │   └── [[id]].js   # GET, POST, DELETE /api/posts/[[id]]
│       ├── interns/
│       │   └── [[id]].js   # GET, POST, PATCH /api/interns/[[id]]
│       └── datasets/
│           └── [[id]].js   # GET, POST /api/datasets/[[id]]
├── data/
│   ├── seed-posts.json     # Initial research papers (Space, Paleobiology, AI)
│   ├── seed-interns.json   # Fellows roster & sample admissions applications
│   └── seed-datasets.json  # Curated open datasets (TRAPPIST-1e, Cambrian clocks)
├── _headers                # Security & caching rules for Cloudflare Pages
├── _routes.json            # Edge routing rules for Cloudflare
├── wrangler.toml           # Wrangler configuration
└── README.md
```

---

## ⚡ Quick Start: Running & Testing Locally

Since the project uses vanilla HTML, CSS, and modern JavaScript with dual-mode storage, you can test it immediately on any machine with Python:

1. Open your terminal in the `curiomas-crii` folder:
   ```bash
   cd curiomas-crii
   python -m http.server 8000
   ```
2. Open your browser at:
   ```
   http://localhost:8000
   ```
3. Open `portal.html` to test backend management!
   - Click **"Director / Admin"** (or use `admin@curiomas.org` / `curiomas2026`).
   - Publish a new paper, review pending applications, or export a JSON backup.

---

## 🚀 How to Upload to GitHub and Deploy to Cloudflare Pages

### Step 1: Push to GitHub
1. In your `curiomas-crii` directory:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Curiomas CRII platform"
   git branch -M main
   ```
2. Create a new repository on [GitHub](https://github.com/new) named `curiomas-crii`.
3. Link and push:
   ```bash
   git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/curiomas-crii.git
   git push -u origin main
   ```

---

### Step 2: Connect to Cloudflare Pages
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left sidebar, click **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select your GitHub account and choose the `curiomas-crii` repository.
4. Set up the build configuration:
   - **Project name**: `curiomas-crii`
   - **Production branch**: `main`
   - **Framework preset**: `None`
   - **Build command**: *(Leave blank)*
   - **Build output directory**: `.` (or leave as root `/`)
5. Click **Save and Deploy**!

Within ~30 seconds, Cloudflare Pages will build and deploy your site to `https://curiomas-crii.pages.dev`.

---

### Step 3: Cloudflare Pages Functions & KV (Optional for Edge Persistence)
Cloudflare Pages automatically detects the `/functions` directory and activates the serverless edge API endpoints at `/api/*`!

To bind a Cloudflare KV namespace for permanent edge persistence:
1. In the Cloudflare Dashboard, go to **Workers & Pages** → **KV** → **Create a namespace** named `CRII_KV`.
2. Go to your Pages project → **Settings** → **Functions** → **KV namespace bindings**.
3. Add a binding:
   - Variable name: `CRII_KV`
   - KV namespace: select `CRII_KV`.
4. (Optional) In **Settings** → **Environment variables**, you can set custom credentials:
   - `ADMIN_EMAIL`: `your-email@curiomas.org`
   - `ADMIN_PASSWORD`: `your-secure-password`

---

## 🔑 Default Portal Credentials (for immediate testing)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Director & Admin** | `admin@curiomas.org` | `curiomas2026` |
| **Senior Fellow** | `aria@curiomas.org` | `research2026` |

*(You can also use the one-click demo credentials buttons on `portal.html`)*.

---

## 📜 Open Science License
All publications and datasets released through CRII are published under the **Creative Commons Attribution 4.0 International (CC-BY 4.0)** license unless specified otherwise. Code is released under the **MIT License**.
