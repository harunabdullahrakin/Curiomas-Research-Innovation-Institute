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
    DIVISIONS: "crii_divisions_v1"
  }
};

const CRII_DEFAULT_ARTICLES = [
  {
    "id": "crii-article-exoplanetary-spectra",
    "slug": "reading-distant-atmospheres-methods-in-exoplanetary-spectra",
    "title": "Reading Distant Atmospheres: Methods in Exoplanetary Spectra",
    "category": "Space & Astrophysics",
    "coverImage": "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1200&q=80",
    "featured": true,
    "authors": [
      "Harun Abdullah Rakin",
      "CRII Astrophysics Group"
    ],
    "readingTime": "7 min read",
    "doi": "10.5281/crii.2026.0101",
    "date": "2026-10-18",
    "summary": "An editorial overview of the open pipeline approaches being developed within CRII's Space & Astrophysics division — reproducibility, synthetic spectra, and what comes next.",
    "abstract": "Transmission spectroscopy provides an essential observational window into exoplanetary atmospheres. However, pipeline variability and atmospheric retrieval opacity models often diverge across research teams. Here, we outline the open, verifiable spectral processing pipeline being developed within CRII's Space & Astrophysics Division, establishing reproducible synthetic baselines and publicly accessible cross-correlation methods for high-resolution transit surveys.",
    "content": "## 1. Introduction & Observational Challenges\n\nWhen an exoplanet transits its host star, a fraction of the stellar flux filters through the annular boundary of the planetary atmosphere. The resulting transmission spectrum encodes chemical fingerprints through wavelength-dependent absorption cross-sections. However, systemic instrument systematics—such as detector persistence, stellar limb darkening variations, and micro-telluric contaminations—often exceed the micro-scale amplitude of atmospheric molecular absorption signatures.\n\nWithin CRII's Space & Astrophysics division, we are designing verifiable calibration protocols that make every reduction step from raw flux calibrations to posterior abundance constraints fully reproducible by independent researchers.\n\n$\\Delta \\delta(\\lambda) \\approx \\frac{2 R_p H}{R_*^2} \\cdot \\ln\\left( \\frac{\\kappa(\\lambda) P_0}{\\mu g} \\sqrt{\\frac{2\\pi R_p}{H}} \\right)$\n\nWhere $R_p$ denotes planetary radius, $H = k_B T / (\\mu g)$ represents atmospheric scale height, and $\\kappa(\\lambda)$ is the wavelength-dependent monochromatic opacity.\n\n## 2. Radiative Transfer & Opacity Cross-Sections\n\nTraditional spectral retrieval software packages frequently rely on proprietary molecular line lists or closed cross-section interpolators. In our open architecture:\n\n1. **High-Resolution Opacity Tables:** Generated from verified databases (ExoMol, HITRAN, and line-by-line calculations) with consistent pressure-temperature grids.\n2. **Stellar Contamination Decoupling:** Integrating dynamic spot and faculae contamination maps based on simultaneous multi-band photometric monitoring.\n3. **Deterministic Sampling:** Markov Chain Monte Carlo (MCMC) and Nested Sampling implementations executing with documented random seeds and full hyperparameter logging.\n\n> *\"Reproducibility in exoplanet characterization requires that atmospheric retrievals are not treated as black-box optimizers, but as modular, inspectable, and falsifiable mathematical pipelines.\"*\n\n## 3. Open Synthetic Baselines & D1 Data Pipelines\n\nAll synthetic atmospheric profiles computed at CRII are stored under CC-BY 4.0 licenses and mapped to Cloudflare D1 SQL datasets. Researchers can inspect transit depths, stellar limb-darkening coefficients, and atmospheric retrieval posteriors directly through our open APIs.\n\n```python\n# Example CRII transmission spectrum retrieval hook\nimport numpy as np\nfrom crii_spectra import SyntheticAtmosphere, CrossCorrelator\n\natmosphere = SyntheticAtmosphere(\n    metallicity=1.0, \n    c_o_ratio=0.55, \n    cloud_top_pressure=1e-2 # bar\n)\nspectrum = atmosphere.compute_transmission(wavelength_range=(0.8, 5.0))\nprint(f\"Computed {len(spectrum.wavelengths)} spectral bins with SNR threshold > 15\")\n```\n\n## 4. Verification & Community Benchmarks\n\nOur open benchmarks test pipeline consistency against standardized synthetic datasets of gas giants (hot Jupiters), sub-Neptunes, and terrestrial super-Earths. By releasing both the forward-modeling routines and Bayesian parameter estimators, CRII aims to eliminate discrepancies between independent reduction pipelines across international teams.\n\n## References\n\n1. Madhusudhan, N. (2019). *Exoplanetary Atmospheres: Key Insights, Challenges, and Future Prospects*. Annual Review of Astronomy and Astrophysics, 57, 617-663.\n2. Seager, S. & Sasselov, D. D. (2000). *Theoretical Transmission Spectra during Extrasolar Giant Planet Transits*. The Astrophysical Journal, 537(2), 916.\n3. Line, M. R., et al. (2013). *A Systematic Retrieval Analysis of Secondary Eclipse Spectra. I. A Comprehensive Validation*. The Astrophysical Journal, 775(2), 137.",
    "tags": [
      "Space & Astrophysics",
      "Exoplanets",
      "Spectroscopy",
      "Reproducibility"
    ],
    "published": true,
    "createdBy": "Harun Abdullah Rakin",
    "createdAt": "2026-10-18T10:00:00.000Z",
    "updatedBy": null,
    "updatedAt": null,
    "isEdited": false
  },
  {
    "id": "crii-article-fossil-calibration",
    "slug": "fossil-calibration-in-an-open-framework",
    "title": "Fossil Calibration in an Open Framework",
    "category": "Ancient Biology",
    "coverImage": "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80",
    "featured": false,
    "authors": [
      "CRII Paleogenomics Council",
      "Harun Abdullah Rakin"
    ],
    "readingTime": "6 min read",
    "doi": "10.5281/crii.2026.0102",
    "date": "2026-10-22",
    "summary": "How verifiable fossil records and open divergence datasets are being prepared for the CRII repository.",
    "abstract": "Molecular clock dating relies heavily on fossil calibration nodes, yet paleobiological constraints often lack standardized provenance and stratigraphical uncertainty quantification. We present an open framework for fossil calibration that establishes uniform Bayesian priors, cross-validated morphological matrices, and reproducible divergence time estimations across evolutionary lineages.",
    "content": "## 1. Divergence Time Estimation & The Calibration Paradox\n\nMolecular evolutionary rates cannot be calibrated from genomic nucleotide substitutions alone; rate and time are fundamentally confounded in phylogenetic likelihood equations. Therefore, external temporal anchors from the fossil record are required. Unfortunately, paleontological calibrations frequently suffer from \"just-so\" node assignments, inadequate justification of crown-group apomorphies, and unmodeled taphonomic uncertainties.\n\nAt CRII, our Ancient Biology & Paleontology division is assembling an open framework that codifies best practices into computable, version-controlled constraints.\n\n$\\ln L(\\mathbf{D} | \\mathbf{T}, \\mathbf{r}) = \\sum_{i} \\ln P(d_i | t_i, r_i)$\n\nWhere $\\mathbf{D}$ represents molecular alignments, $\\mathbf{T}$ denotes node ages, and $\\mathbf{r}$ indicates lineage-specific branch rates.\n\n## 2. Stratigraphic Constraints & Bayesian Prior Modeling\n\nRather than applying simplistic hard minimums or arbitrary uniform bounds, the CRII calibration model integrates:\n\n- **Stratigraphic Geochronology:** Explicit radiometric uncertainty bounds derived from volcanic ash horizons (e.g. $^{40}\\text{Ar}/^{39}\\text{Ar}$ and $\\text{U-Pb}$ zircon dating).\n- **Truncated Cauchy & Lognormal Priors:** Accommodating asymmetric fossilization probability distributions that decay smoothly above soft maximum limits.\n- **Phylogenetic Morphometrics:** Total-evidence tip-dating using quantitative character matrices that allow extinct taxa to position themselves within tree topology.\n\n> *\"A fossil calibration point is not a single point in time, but a probability density function bounded by geology, taphonomy, and comparative anatomy.\"*\n\n## 3. The CRII Open Paleogenomic Repository\n\nOur open dataset repository indexes morphological character matrices, stratigraphic log summaries, and divergence posteriors for pivotal deep-time evolutionary nodes (e.g., early metazoan radiation, gnathostome origins, and angiosperm divergence).\n\n```json\n{\n  \"node\": \"Crown-Amniota\",\n  \"fossil_reference\": \"Hylonomus lyelli\",\n  \"formation\": \"Joggins Formation, Nova Scotia\",\n  \"stratigraphic_age_ma\": { \"min\": 318.0, \"max\": 323.2 },\n  \"prior_distribution\": \"truncated_lognormal\",\n  \"provenance_verified\": true\n}\n```\n\n## 4. Reproducibility & Downstream Phylogenetic Analysis\n\nAll calibration configuration files are published in machine-readable YAML and XML formats compatible with standard Bayesian inference packages (MCMCtree, BEAST2, and RevBayes). By bridging paleontology with modern paleogenomics, CRII provides researchers with open, reproducible divergence time estimates.\n\n## References\n\n1. Parham, J. F., et al. (2012). *Best Practices for Justifying Fossil Calibrations on Molecular Divergence Time Trees*. Systematic Biology, 61(2), 346-359.\n2. Donoghue, P. C. & Benton, M. J. (2007). *Rocks and Clocks: Calibrating the Tree of Life*. Trends in Ecology & Evolution, 22(8), 424-431.\n3. Dos Reis, M., et al. (2016). *The Phylogenomic Date of Mitochondrial Endosymbiosis*. Nature Ecology & Evolution, 1(1), 0008.",
    "tags": [
      "Ancient Biology",
      "Paleogenomics",
      "Fossil Records",
      "Molecular Clock"
    ],
    "published": true,
    "createdBy": "CRII Paleogenomics Council",
    "createdAt": "2026-10-22T14:30:00.000Z",
    "updatedBy": null,
    "updatedAt": null,
    "isEdited": false
  },
  {
    "id": "crii-article-ml-biophysics",
    "slug": "building-reproducible-ml-pipelines-for-biophysics",
    "title": "Building Reproducible ML Pipelines for Biophysics",
    "category": "AI & Computational Science",
    "coverImage": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    "featured": false,
    "authors": [
      "CRII Computational Core",
      "Harun Abdullah Rakin"
    ],
    "readingTime": "8 min read",
    "doi": "10.5281/crii.2026.0103",
    "date": "2026-10-29",
    "summary": "A look at why open, test-driven computational methods matter when we are developing across biological and physical systems.",
    "abstract": "Machine learning models in molecular biophysics frequently suffer from data leakage, uncalibrated confidence scores, and fragile dependency environments. We present CRII's test-driven design principles for open machine learning pipelines, detailing automated validation suites, deterministic seeds, and distributed training benchmarks for macromolecular structure analysis.",
    "content": "## 1. The Reproducibility Deficit in Scientific Machine Learning\n\nDeep learning models have accelerated macromolecular structure prediction, docking affinity calculations, and conformational sampling. However, independent replication often falters due to silent dataset leaks between homologous training folds, undocumented stochastic initializations, and unversioned training pipelines.\n\nCRII's AI & Computational Science division enforces strict engineering baselines to ensure that machine learning architectures serving biophysical research maintain reproducibility on par with experimental laboratory standards.\n\n$\\mathcal{L}_{total} = \\mathcal{L}_{FAPE} + \\lambda_1 \\mathcal{L}_{distogram} + \\lambda_2 \\mathcal{L}_{physics}$\n\nWhere $\\mathcal{L}_{physics}$ explicitly penalizes steric clashes and unphysical dihedral angles according to Ramachandran energy constraints.\n\n## 2. Architectural Blueprint: Determinism & Provenance\n\nTo ensure complete reproducibility across compute clusters:\n\n1. **Deterministic Execution:** Fixed PRNG seeding across CUDA and TensorRT kernels, guaranteeing bit-exact training checkouts.\n2. **Homology-Aware Splitting:** Automated structural clustering (MMseqs2 at 30% sequence identity) preventing test-set contamination.\n3. **Artifact Provenance Tracking:** Every model checkpoint embeds full Git commit hashes, environment lockfiles, and dataset SHA-256 manifests.\n\n> *\"If a biophysical neural network cannot reproduce its structural predictions when initialized on an isolated hardware environment, it is an experiment without controls.\"*\n\n## 3. Biophysical Loss Formulations & Physical Invariance\n\nPurely geometric deep learning models often output atomistic configurations that violate fundamental chemical invariances. At CRII, our architectures embed SE(3)-equivariant graph neural networks with differentiable molecular mechanics loss terms:\n\n```python\n# CRII Differentiable Force Field Loss Term\nimport torch\nimport torch.nn as nn\n\nclass StericClashLoss(nn.Module):\n    def __init__(self, clash_threshold=2.2):\n        super().__init__()\n        self.threshold = clash_threshold\n        \n    def forward(self, atom_coordinates):\n        # Pairwise Euclidean distance computation\n        dists = torch.cdist(atom_coordinates, atom_coordinates)\n        mask = (dists > 0) & (dists < self.threshold)\n        clash_penalty = torch.sum((self.threshold - dists[mask]) ** 2)\n        return clash_penalty\n```\n\n## 4. Open-Source Release & Continuous Evaluation\n\nAll pipelines, models, and benchmark evaluation suites developed in this division are released openly on GitHub with containerized Docker runtimes. Continuous integration benchmarks assess both computational throughput and physical validity across new parameter revisions.\n\n## References\n\n1. Jumper, J., et al. (2021). *Highly Accurate Protein Structure Prediction with AlphaFold*. Nature, 596(7873), 583-589.\n2. Batzner, S., et al. (2022). *E(3)-Equivariant Graph Neural Networks for Data-Efficient and Accurate Interatomic Potentials*. Nature Communications, 13, 2453.\n3. Kapoor, S. & Narayanan, A. (2023). *Leakage and the Reproducibility Crisis in Machine-Learning-Based Science*. Patterns, 4(9), 100804.",
    "tags": [
      "AI & Computational Science",
      "Machine Learning",
      "Biophysics",
      "Graph Neural Networks"
    ],
    "published": true,
    "createdBy": "CRII Computational Core",
    "createdAt": "2026-10-29T16:15:00.000Z",
    "updatedBy": null,
    "updatedAt": null,
    "isEdited": false
  },
  {
    "id": "crii-article-edge-of-habitability",
    "slug": "life-at-the-edge-of-habitability",
    "title": "Life at the Edge of Habitability",
    "category": "Astrobiology",
    "coverImage": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    "featured": false,
    "authors": [
      "Astrobiology & Extremophiles Division",
      "CRII Fellows"
    ],
    "readingTime": "5 min read",
    "doi": "10.5281/crii.2026.0104",
    "date": "2026-11-02",
    "summary": "Dispatches from the Astrobiology & Extremophiles division on what Earth's most resilient organisms tell us about life beyond it.",
    "abstract": "Extremophiles inhabiting hypersaline lakes, subglacial aquifers, and hydrothermal chimneys redefine our boundaries for thermodynamic feasibility in cellular biochemistry. This dispatch synthesizes recent metabolic characterizations from CRII's extremophile assays, translating terrestrial biochemical survival envelopes into biosignature search heuristics for icy ocean moons and Mars.",
    "content": "## 1. Thermodynamic Extremes & Cellular Integrity\n\nWhat constitutes a habitable planetary niche? Terrestrial life thrives within physical extremes once considered fundamentally sterilizing. Organisms isolated from deep subterranean fractures, permafrost cores, and hyper-acidic geothermal pools survive by balancing energetic maintenance demands against constant macromolecular breakdown.\n\nCRII's Astrobiology & Extremophiles division investigates how halophilic archaea and radiation-resistant bacteria stabilize enzymatic folds and maintain proton-motive gradients under severe thermodynamic deficits.\n\n$\\Delta G' = \\Delta G^{\\circ\\prime} + RT \\ln\\left( \\frac{[\\text{Products}]}{[\\text{Reactants}]} \\right) < 0$\n\nWhere metabolic pathways require a sustained negative Gibbs free energy yield exceeding the minimum biological quantum ($\\sim -15$ to $-20\\text{ kJ/mol}$) needed to synthesize ATP.\n\n## 2. Metabolic Pathways in Low-Water-Activity Niches\n\nIn hypersaline brine systems and desiccated environments, water activity ($a_w$) drops below standard metabolic limits ($a_w < 0.605$). Key adaptation mechanisms categorized in our open repository include:\n\n- **Osmoprotectant Biosynthesis:** Accumulation of compatible zwitterionic solutes (ectoine, betaine, and trehalose) that prevent cytoplasmic dehydration without inhibiting enzyme kinetics.\n- **\"Salt-in\" Proteome Adaptation:** Pervasive acidic amino acid substitutions (aspartate and glutamate) on protein surfaces, maintaining structural hydration shells in saturated ionic solutions.\n- **DNA Repair Machinery:** Hyper-efficient non-homologous end joining (NHEJ) and recombinational repair cascades that rebuild double-strand breaks caused by ionizing radiation or prolonged desiccation.\n\n> *\"Understanding the molecular boundary where biochemistry gives way to abiotic decay provides our primary roadmap for detecting life on worlds like Europa and Enceladus.\"*\n\n## 3. Extraterrestrial Analogs: Europa, Enceladus, and Mars\n\nThe geochemical conditions identified in Enceladus's plume (detected molecular hydrogen, methane, and complex organics) mirror terrestrial serpentinizing hydrothermal vents. By mapping extremophilic metabolic limits in open datasets, CRII researchers develop probabilistic biosignature detection matrices for upcoming space exploration missions.\n\n## 4. Open Dispatches & Laboratory Protocol Sharing\n\nAll culture metadata, metabolic kinetics models, and spectroscopic biosignature profiles are documented and shared openly through the CRII research catalog. Our mission is to ensure that student and early-career researchers have open access to frontier astrobiological datasets.\n\n## References\n\n1. Merino, N., et al. (2019). *Living at the Extremes: Extremophiles and the Limits of Life in a Planetary Context*. Frontiers in Microbiology, 10, 780.\n2. Waite, J. H., et al. (2017). *Cassini Finds Molecular Hydrogen in the Enceladus Plume: Evidence for Hydrothermal Activity*. Science, 356(6334), 155-159.\n3. Cockell, C. S., et al. (2016). *Habitability: A Review*. Astrobiology, 16(1), 89-117.",
    "tags": [
      "Astrobiology",
      "Extremophiles",
      "Habitability",
      "Biosignatures"
    ],
    "published": true,
    "createdBy": "Astrobiology & Extremophiles Division",
    "createdAt": "2026-11-02T09:00:00.000Z",
    "updatedBy": null,
    "updatedAt": null,
    "isEdited": false
  }
];

const CRII_DEFAULT_DIVISIONS = [
  {
    id: "div-space-astrophysics",
    number: "01",
    tag: "01 / RESEARCH DIVISION",
    title: "Space & Astrophysics",
    desc: "Sparking distant atmospheres through exoplanetary spectra and light curves.",
    image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=800&q=80",
    link: "/research?division=space-astrophysics",
    orderIndex: 1
  },
  {
    id: "div-ancient-biology",
    number: "02",
    tag: "02 / RESEARCH DIVISION",
    title: "Ancient Biology & Paleontology",
    desc: "Tracing the history of life through fossil records and genomic divergence.",
    image: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80",
    link: "/research?division=ancient-biology",
    orderIndex: 2
  },
  {
    id: "div-ai-computational-science",
    number: "03",
    tag: "03 / RESEARCH DIVISION",
    title: "AI & Computational Science",
    desc: "Building open computational methods for complex biological and physical systems.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    link: "/research?division=ai-computational",
    orderIndex: 3
  },
  {
    id: "div-astrobiology",
    number: "04",
    tag: "04 / RESEARCH DIVISION",
    title: "Astrobiology & Extremophiles",
    desc: "Exploring life's resilience at the edges of habitability, on Earth and beyond.",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    link: "/research?division=astrobiology",
    orderIndex: 4
  }
];

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

    // 3. Initial Seed Research Posts & Cache Purge / Merge
    try {
      const storedPosts = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.POSTS);
      if (storedPosts) {
        const parsed = JSON.parse(storedPosts);
        if (Array.isArray(parsed)) {
          let cleaned = parsed.filter(p => !p.id || !p.id.startsWith('crii-paper-2026-00'));
          const existingIds = new Set(cleaned.map(p => p.id));
          CRII_DEFAULT_ARTICLES.forEach(art => {
            if (!existingIds.has(art.id)) {
              cleaned.push(art);
            }
          });
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(cleaned));
        }
      } else {
        localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(CRII_DEFAULT_ARTICLES));
      }
    } catch (e) {
      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(CRII_DEFAULT_ARTICLES));
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

        // 6. Initial Seed Research Divisions
    try {
      const storedDivs = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.DIVISIONS);
      if (!storedDivs) {
        localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.DIVISIONS, JSON.stringify(CRII_DEFAULT_DIVISIONS));
      }
    } catch (e) {
      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.DIVISIONS, JSON.stringify(CRII_DEFAULT_DIVISIONS));
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
                if (settings && Array.isArray(settings.divisions) && settings.divisions.length > 0) {
          localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.DIVISIONS, JSON.stringify(settings.divisions));
        }
        if (settings && settings.branding) {
          if (settings.branding.name) localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INSTITUTE_NAME, settings.branding.name);
          if (settings.branding.logoUrl) localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.INSTITUTE_LOGO, settings.branding.logoUrl);
          if (settings.branding.autzAppId && settings.branding.autzAppId !== "t0i7jkia") {
            localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.AUTZ_APP_ID, settings.branding.autzAppId);
          }
        }
      }
    } catch (e) {}
  }

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
            autzAppId: this.getAutzAppId()
          },
          updatedBy: user ? (user.name || user.email) : "Administrator"
        })
      });
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
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return [...CRII_DEFAULT_DIVISIONS];
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

  // --- POSTS & RESEARCH ARTICLES (D1 SQL SYNCED) ---
  async getPosts(options = {}) {
    let localPosts = [];
    try {
      const local = localStorage.getItem(CRII_CONFIG.STORAGE_KEYS.POSTS);
      localPosts = local ? JSON.parse(local) : [];
      if (!Array.isArray(localPosts)) localPosts = [];
    } catch (e) {
      localPosts = [];
    }

    // 1. Fetch directly from Cloudflare D1 SQL backend
    try {
      const query = options.includeDrafts ? '?includeDrafts=true' : '';
      const res = await fetch(`${CRII_CONFIG.API_BASE}/posts${query}`);
      if (res.ok) {
        const remote = await res.json();
        if (Array.isArray(remote)) {
          if (remote.length > 0) {
            // Merge remote with locally created posts that might not be in remote yet
            const remoteIds = new Set(remote.map(r => r.id));
            const pendingLocal = localPosts.filter(p => !remoteIds.has(p.id));
            const merged = [...remote, ...pendingLocal];
            const mergedIds = new Set(merged.map(p => p.id));
            CRII_DEFAULT_ARTICLES.forEach(art => {
              if (!mergedIds.has(art.id)) merged.push(art);
            });
            localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(merged));
            return options.includeDrafts ? merged : merged.filter(p => p.published !== false);
          } else if (localPosts.length > 0) {
            // Remote returned empty (e.g. fresh DB or offline), preserve local articles!
            const localIds = new Set(localPosts.map(p => p.id));
            CRII_DEFAULT_ARTICLES.forEach(art => {
              if (!localIds.has(art.id)) localPosts.push(art);
            });
            localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(localPosts));
            return options.includeDrafts ? localPosts : localPosts.filter(p => p.published !== false);
          } else {
            localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(CRII_DEFAULT_ARTICLES));
            return CRII_DEFAULT_ARTICLES;
          }
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
    const posts = await this.getPosts({ includeDrafts: true });
    const filtered = posts.filter(p => p.id !== id);
    localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(filtered));

    try {
      await fetch(`${CRII_CONFIG.API_BASE}/posts/${id}`, { method: 'DELETE' });
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

      try {
        await fetch(`${CRII_CONFIG.API_BASE}/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(target)
        });
      } catch (e) {
        console.warn("Failed to sync publish state to D1:", e);
      }

      localStorage.setItem(CRII_CONFIG.STORAGE_KEYS.POSTS, JSON.stringify(posts));
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
