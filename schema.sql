-- ==============================================================================
-- Curiomas Research & Innovation Institute (CRII)
-- Cloudflare D1 Relational SQL Database Schema
-- Run via: wrangler d1 execute crii-production-db --file=./schema.sql
-- ==============================================================================

-- 1. Research Publications and Blog Posts Table
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  coverImage TEXT,
  category TEXT NOT NULL,
  authors_json TEXT NOT NULL DEFAULT '["CRII Fellow"]',
  date TEXT NOT NULL,
  updatedAt TEXT,
  updatedBy TEXT,
  readingTime TEXT DEFAULT '10 min read',
  doi TEXT,
  summary TEXT NOT NULL,
  abstract TEXT,
  content TEXT NOT NULL,
  blocks_json TEXT,
  tags_json TEXT DEFAULT '["Research"]',
  published INTEGER NOT NULL DEFAULT 1,
  featured INTEGER NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  citations INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- 2. Interns, Fellows and Core Team Members Table
CREATE TABLE IF NOT EXISTS interns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar TEXT,
  university TEXT,
  degree TEXT,
  division TEXT NOT NULL,
  role TEXT NOT NULL,
  cohort TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  bio TEXT,
  socials_json TEXT DEFAULT '{}',
  projects_json TEXT DEFAULT '[]',
  isTeamMember INTEGER NOT NULL DEFAULT 0,
  orderIndex INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT,
  updatedAt TEXT
);

CREATE INDEX IF NOT EXISTS idx_interns_status ON interns(status);
CREATE INDEX IF NOT EXISTS idx_interns_team ON interns(isTeamMember);

-- 3. Student Fellowship Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  fullName TEXT NOT NULL,
  email TEXT NOT NULL,
  university TEXT,
  fieldOfStudy TEXT,
  preferredDivision TEXT,
  status TEXT NOT NULL DEFAULT 'Under Review',
  appliedDate TEXT NOT NULL,
  statement TEXT,
  reviewedBy TEXT,
  reviewedAt TEXT
);

CREATE INDEX IF NOT EXISTS idx_apps_status ON applications(status);

-- 4. Institute Appearance & Core Settings Table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updatedAt TEXT,
  updatedBy TEXT
);

-- 5. Authorized Whitelist Users Table (Autz.org & Cloudflare D1 SQL)
CREATE TABLE IF NOT EXISTS allowed_users (
  email TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Research Fellow',
  division TEXT DEFAULT 'Institute Research Council',
  status TEXT NOT NULL DEFAULT 'Active',
  addedDate TEXT NOT NULL,
  autzorg_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_allowed_users_status ON allowed_users(status);

-- 6. Active Authentication Sessions Table (Cloudflare D1 SQL)
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  user_json TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  expiresAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_email ON sessions(email);
CREATE INDEX IF NOT EXISTS idx_sessions_expiresAt ON sessions(expiresAt);

-- ==============================================================================
-- Initial Production Seed Data
-- ==============================================================================

-- Seed Whitelisted Users
INSERT OR IGNORE INTO allowed_users (email, name, role, division, status, addedDate) VALUES
('harunabdullahrakin@gmail.com', 'Harun Abdullah Rakin', 'Super Admin & Director', 'Institute Executive Council', 'Active', '2026-01-01'),
('admin@curiomas.org', 'CRII Administration', 'Institute Admin', 'Operations & Governance', 'Active', '2026-01-01');

-- Seed Settings
INSERT OR IGNORE INTO settings (key, value_json, updatedAt, updatedBy) VALUES
('hero', '{"videoUrl":"assets/hero-bg.mp4","blurPx":12,"overlayOpacity":0.55}', '2026-09-25T00:00:00Z', 'harunabdullahrakin@gmail.com'),
('navbar', '{"title":"Curiomas Research & Innovation Institute","subtitle":"CRII • Open Science Collective","logoUrl":"assets/curiomas-no-bg.png"}', '2026-09-25T00:00:00Z', 'harunabdullahrakin@gmail.com');

-- Seed Core Leadership
INSERT OR IGNORE INTO interns (id, name, email, avatar, university, degree, division, role, cohort, status, bio, socials_json, projects_json, isTeamMember, orderIndex, createdAt) VALUES
('team-001', 'Harun Abdullah Rakin', 'harunabdullahrakin@gmail.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'CRII Council', 'Director of Research', 'Executive Council', 'Super Admin & Lead Investigator', 'Founding', 'Active', 'Pioneering open computational science, astrophysical synthetic models, and multi-agent systems for student discovery.', '{"github":"https://github.com/harunabdullahrakin","linkedin":"https://linkedin.com","email":"harunabdullahrakin@gmail.com"}', '["CRII Computational Core","Autonomous Research Pipelines"]', 1, 1, '2026-01-01');


