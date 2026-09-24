# Curiomas Research & Innovation Institute (CRII)
> *"Bring structure to your research — A secure platform for developing and sharing reproducible methods."*

An autonomous, student-led scientific institute web platform built for high-performance hosting on **Cloudflare Pages** with **Autz.org SSO** authentication and serverless **Cloudflare Pages Functions** (`/functions/api/`).

---

## 🌟 Key Features & Redesign Highlights

- **Floating 85% Width Glassy Capsule Navbar**:
  - Floats separated from the top with rounded pill capsule styling and backdrop blur.
  - Institute Logo emblem + dynamic Navbar Title (Default: *Curiomas Research & Innovation Institute*, customizable in the Admin Panel).
  - Built-in **Light / Dark Mode Theme Switcher** (Default: **Light Mode**, saved in `localStorage`).
- **Zero Unicode Emojis**:
  - Replaced with high-precision vector SVG icons (Lucide / Feather style).
- **Hero Section with Ambient Background Video**:
  - Smooth HTML5 background video loop behind the hero with radial gradient masking.
  - Clear academic focus: *"Bring structure to your research — A secure platform for developing and sharing reproducible methods."*
- **Interactive Scientific Custom Cursor**:
  - Smooth trailing cursor ring that gently expands over interactive cards, buttons, and links.
- **Featured Articles Section**:
  - Highlighting peer-grade preprints across astrophysics, evolutionary paleogenomics, and AI biophysics.
- **Dedicated Contact & Collaboration Page (`contact.html`)**:
  - Interactive institutional inquiry form, admissions desk info, and direct channels.
- **Cookie Consent Banner**:
  - Clean floating cookie & session storage banner with "Accept All" and preference controls.
- **Autz.org SSO Authentication & Whitelist Access Control**:
  - Direct integration with **Autz.org** (App ID: `t0i7jkia` or customizable in settings).
  - **Strict Whitelist Verification**: Only pre-authorized Gmail/Autz accounts can access the portal.
  - Super Admin (`harunabdullahrakin@gmail.com`) can add/revoke allowed emails and assign permission roles (*Super Admin*, *Research Fellow*, *Intern Coordinator*).
  - Anti-SQL injection, type-safe data access, and parameterized operations.
- **Admin Management Portal (`portal.html`)**:
  - Paper publisher with live Markdown preview split pane.
  - Intern admissions review queue (one-click accept/enroll, interview, decline).
  - Open datasets catalog manager.
  - Institute & Navbar branding settings editor.

---

## 📂 Project Architecture

```
curiomas-crii/
├── index.html              # Homepage with Background Video & Featured Articles
├── research.html           # Research Papers & Open Datasets Catalog
├── blog.html               # Scientific Dispatches & Field Notes
├── article.html            # Article Reader with Reading Bar & Math Formatting
├── interns.html            # Student Fellows Roster & Admissions Application
├── contact.html            # Contact & Institutional Collaboration Page
├── portal.html             # Admin Management Portal & Autz.org Login
├── css/
│   ├── style.css           # Core Design System (Light & Dark Mode, 85% Nav, Video)
│   ├── components.css      # Reusable Cards, Buttons, Badges, Modals, Forms
│   └── portal.css          # Admin Portal & Split-Pane Editor Layouts
├── js/
│   ├── config.js           # Autz SSO, Whitelist Permissions & Data Layer
│   ├── app.js              # Theme Engine, Custom Cursor, Cookies, Branding
│   ├── research.js         # Papers & Datasets Catalog Filtering
│   ├── blog.js             # Blog rendering and tag filters
│   ├── article.js          # Reader view with markdown parser & reading bar
│   ├── interns.js          # Roster showcase & application handler
│   ├── auth.js             # Autz.org authentication & verification logic
│   └── portal.js           # CRUD, Admissions Review, Settings & Whitelist
├── functions/              # Cloudflare Pages Functions (Serverless Backend)
│   ├── _middleware.js      # Global CORS & Security Headers
│   └── api/
│       ├── stats.js        # GET /api/stats (Institute statistics)
│       ├── auth/
│       │   ├── login.js    # POST /api/auth/login (Autz.org & Whitelist verify)
│       │   └── me.js       # GET /api/auth/me (Session check)
│       ├── posts/
│       │   └── [[id]].js   # Publications CRUD
│       ├── interns/
│       │   └── [[id]].js   # Admissions submissions & updates
│       └── datasets/
│           └── [[id]].js   # Open datasets endpoints
├── data/
│   ├── seed-posts.json     # Initial research papers (Space, Paleobiology, AI)
│   ├── seed-interns.json   # Fellows roster & sample applications
│   └── seed-datasets.json  # Curated open datasets (TRAPPIST-1e, Cambrian clocks)
├── _headers                # Security & caching rules for Cloudflare Pages
├── _routes.json            # Edge routing rules for Cloudflare
├── wrangler.toml           # Wrangler configuration
└── README.md
```

---

## ⚡ Testing Locally

You can test the entire site immediately using Python:

```powershell
cd C:\Users\USER\.gemini\antigravity\scratch\curiomas-crii
python -m http.server 8000
```

Open your browser to:
- **Homepage**: `http://localhost:8000`
- **Contact Page**: `http://localhost:8000/contact.html`
- **Portal**: `http://localhost:8000/portal.html`

In the Portal, click **"Harun Abdullah Rakin (Super Admin)"** to test instant authorized access!

---

## 🚀 Pushing to GitHub & Deploying to Cloudflare Pages

### 1. Commit and Push to GitHub
```powershell
cd C:\Users\USER\.gemini\antigravity\scratch\curiomas-crii
git add .
git commit -m "Redesign CRII platform with Autz.org, floating navbar, video hero, and light mode"
git push -u origin main
```

### 2. Cloudflare Pages Settings
In the Cloudflare dashboard:
- **Build command**: *Leave completely blank*
- **Build output directory**: `.` *(a single dot)*
- **Root directory**: *Leave blank*
- Click **Save and Deploy**!
