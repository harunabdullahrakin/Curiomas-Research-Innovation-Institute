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

-- ==============================================================================
-- Initial Production Seed Data
-- ==============================================================================

-- Seed Settings
INSERT OR IGNORE INTO settings (key, value_json, updatedAt, updatedBy) VALUES
('hero', '{"videoUrl":"assets/hero-bg.mp4","blurPx":12,"overlayOpacity":0.55}', '2026-09-25T00:00:00Z', 'harunabdullahrakin@gmail.com'),
('navbar', '{"title":"Curiomas Research & Innovation Institute","subtitle":"CRII • Open Science Collective","logoUrl":""}', '2026-09-25T00:00:00Z', 'harunabdullahrakin@gmail.com');

-- Seed Core Team & Fellows
INSERT OR IGNORE INTO interns (id, name, email, avatar, university, degree, division, role, cohort, status, bio, socials_json, projects_json, isTeamMember, orderIndex, createdAt) VALUES
('team-001', 'Harun Abdullah Rakin', 'harunabdullahrakin@gmail.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'CRII Council', 'Director of Research', 'Executive Council', 'Super Admin & Lead Investigator', 'Founding', 'Active', 'Pioneering open computational science, astrophysical synthetic models, and multi-agent systems for student discovery.', '{"github":"https://github.com/harunabdullahrakin","linkedin":"https://linkedin.com","email":"harunabdullahrakin@gmail.com"}', '["CRII Computational Core","Autonomous Research Pipelines"]', 1, 1, '2026-01-01'),
('team-002', 'Aria Rahman', 'aria.rahman@curiomas.org', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 'Metropolitan University of Technology', 'B.Sc. Applied Physics', 'Space & Astrophysics', 'Principal Fellow — Astrophysics', 'Founding', 'Active', 'Lead investigator on terrestrial exoplanet atmospheres and spectroscopic synthetic retrieval models.', '{"github":"https://github.com","linkedin":"https://linkedin.com"}', '["TRAPPIST-1e Atmospheric Retrieval"]', 1, 2, '2026-01-01'),
('team-003', 'Zainab Chowdhury', 'zainab.c@curiomas.org', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80', 'Institute of Science & Technology', 'B.Sc. Biotechnology', 'Astrobiology & Extremophiles', 'Principal Fellow — Astrobiology', 'Founding', 'Active', 'Specializing in radiotrophic fungal biology, extremophile metabolic pathways, and deep-time biochemical resilience.', '{"github":"https://github.com","linkedin":"https://linkedin.com"}', '["Extremophile Enzyme Stabilization"]', 1, 3, '2026-01-01'),
('int-001', 'Kenji Takahashi', 'kenji.t@curiomas.org', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'Tokyo Institute of Technology', 'M.Sc. Computational Biology', 'AI & Computational Science', 'Research Fellow', 'Spring 2026', 'Active', 'Developing equivariant graph neural networks for thermostable enzyme design inspired by hydrothermal vent microbes.', '{"github":"https://github.com"}', '["DeepVent Graph Networks"]', 0, 4, '2026-02-01'),
('int-002', 'Maya Lin-Cruz', 'maya.l@curiomas.org', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'National University', 'B.Sc. Evolutionary Genomics', 'Ancient Biology & Paleontology', 'Research Fellow', 'Spring 2026', 'Active', 'Reassessing Cambrian explosion chronologies through Bayesian relaxed molecular clocks and fossil calibrations.', '{"github":"https://github.com"}', '["Ediacaran Divergence Rates"]', 0, 5, '2026-02-15');

-- Seed Publications
INSERT OR IGNORE INTO posts (id, slug, title, coverImage, category, authors_json, date, updatedAt, updatedBy, readingTime, doi, summary, abstract, content, tags_json, published, featured, downloads, citations) VALUES
(
  'crii-paper-2026-001',
  'spectroscopic-signatures-trappist-1e',
  'Spectroscopic Signatures of Atmospheric Biosignatures on TRAPPIST-1e: A Comparative Synthetic Simulation',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  'Space & Astrophysics',
  '["Aria Rahman (CRII Fellow)", "Tariq Al-Mansoor", "CRII Astrophysics Group"]',
  '2026-03-14',
  '2026-09-24T18:30:00Z',
  'Harun Abdullah Rakin',
  '12 min read',
  '10.5281/crii.2026.0101',
  'Using synthetic radiative transfer modeling and planetary atmospheric codes, our student research team models transit spectroscopy signatures to discern false-positive abiotic oxygen from true biological equilibrium on rocky M-dwarf worlds.',
  'The characterization of terrestrial exoplanet atmospheres around M-dwarf host stars presents unprecedented opportunities and distinct challenges. In this research, we construct a 1D radiative-convective photochemical equilibrium model simulating the atmosphere of TRAPPIST-1e across diverse ocean-fraction baselines.',
  '### 1. Introduction and Orbital Dynamics\n\nThe detection of exoplanetary atmospheres has transitioned from broad gas-giant characterization to high-precision terrestrial exoplanet spectroscopy.\n\n$$\\tau_\\nu = \\int \\kappa_\\nu \\rho \\, ds$$\n\n### 2. Abiotic Oxygen False Positives\n\nStellar ultraviolet flare activity can photolyze ocean water inventories, leaving behind massive abiotic oxygen columns that mimic biological signatures without active metabolism.\n\n### 3. Conclusion\n\nHigh-resolution cross-dispersion infrared spectroscopy remains our most viable path for validating genuine chemical disequilibrium.',
  '["Exoplanets", "Spectroscopy", "JWST Data", "Atmospheric Modeling"]',
  1, 1, 482, 14
),
(
  'crii-paper-2026-002',
  'molecular-clocks-ediacaran-cambrian',
  'Molecular Clocks and the Ediacaran-Cambrian Explosion: Reassessing Divergence Chronologies',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
  'Ancient Biology & Paleontology',
  '["Shayan Debnath", "Maya Lin-Cruz", "CRII Paleobiology Division"]',
  '2026-02-28',
  '2026-09-24T19:00:00Z',
  'Harun Abdullah Rakin',
  '15 min read',
  '10.5281/crii.2026.0102',
  'Bridging disparate fossil horizons and Bayesian relaxed molecular clock frameworks to address the enigmatic evolutionary pulse of the early Paleozoic.',
  'The rapid emergence of bilateral animal body plans during the Ediacaran-Cambrian transition (~541 Ma) has fascinated biologists since Darwin. We analyze multi-locus nucleotide and amino acid alignments calibrated against conservative paleontological boundary constraints.',
  '### 1. The Darwinian Conundrum in Contemporary Light\n\nThe apparent suddenness of the Cambrian radiation in the fossil record was historically deemed a profound challenge to phyletic gradualism.\n\n### 2. Relaxed Clock Methodologies\n\nBy integrating autocorrelated and uncorrelated lognormal rate models, our divergence estimations align deep metazoan roots into the Cryogenian period.',
  '["Paleogenomics", "Cambrian Explosion", "Molecular Clocks", "Evolution"]',
  1, 1, 319, 9
),
(
  'crii-paper-2026-003',
  'geometric-deep-learning-extremophile-enzymes',
  'Geometric Deep Learning for Thermostable Enzyme Design Inspired by Deep-Sea Hydrothermal Vent Microbes',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'AI & Computational Science',
  '["Kenji Takahashi", "Elena Rostova", "CRII AI & Bioengineering Core"]',
  '2026-01-20',
  '2026-09-24T19:15:00Z',
  'Harun Abdullah Rakin',
  '10 min read',
  '10.5281/crii.2026.0103',
  'Applying equivariant graph neural networks to decipher thermal stabilization mechanisms in hyperthermophilic archaea and synthesize green biocatalysts.',
  'Industrial biocatalysis is severely hindered by enzyme denaturation under thermal stress. We harness geometric deep learning to model electrostatic interactions and salt-bridge networks in deep-sea vent archaea.',
  '### 1. High-Temperature Frontiers\n\nProteins from Methanocaldococcus jannaschii maintain structural integrity at temperatures exceeding 90°C.\n\n### 2. SE(3)-Equivariant Neural Architectures\n\nOur graph architecture explicitly respects 3D rotational and translational symmetries in atomic point clouds.',
  '["Machine Learning", "Structural Biology", "Extremophiles", "Graph Neural Networks"]',
  1, 1, 612, 21
);
