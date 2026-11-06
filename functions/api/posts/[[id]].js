/**
 * Cloudflare Pages Function: /api/posts/[[id]]
 * Relational SQL CRUD operations for research articles & blog dispatches via Cloudflare D1
 */

const SEED_POSTS = [
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

function formatSqlRow(row) {
  if (!row) return null;
  return {
    ...row,
    authors: safeJsonParse(row.authors_json, [row.authors_json || "CRII Fellow"]),
    tags: safeJsonParse(row.tags_json, ["Research"]),
    blocks: safeJsonParse(row.blocks_json, []),
    published: Boolean(row.published),
    featured: Boolean(row.featured)
  };
}

function safeJsonParse(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

export async function onRequestGet(context) {
  const { params, request, env } = context;
  const idOrSlug = params.id ? params.id[0] : null;

  // 1. Cloudflare D1 SQL implementation
  if (env && env.DB) {
    try {
      if (idOrSlug) {
        const stmt = env.DB.prepare(
          "SELECT * FROM posts WHERE id = ? OR slug = ? LIMIT 1"
        );
        const row = await stmt.bind(idOrSlug, idOrSlug).first();
        if (row) {
          return new Response(JSON.stringify(formatSqlRow(row)), {
            headers: { "Content-Type": "application/json" }
          });
        }
        const seedMatch = SEED_POSTS.find(p => p.id === idOrSlug || p.slug === idOrSlug);
        if (seedMatch) {
          return new Response(JSON.stringify(seedMatch), {
            headers: { "Content-Type": "application/json" }
          });
        }
        return new Response(JSON.stringify({ error: "Post not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Query list
      const url = new URL(request.url);
      const category = url.searchParams.get("category");
      const includeDrafts = url.searchParams.get("includeDrafts") === "true";

      let query = "SELECT * FROM posts";
      const conditions = [];
      const binds = [];

      if (!includeDrafts) {
        conditions.push("published = 1");
      }
      if (category) {
        conditions.push("category = ?");
        binds.push(category);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }
      query += " ORDER BY date DESC";

      const stmt = env.DB.prepare(query);
      const { results } = binds.length > 0 ? await stmt.bind(...binds).all() : await stmt.all();
      let formatted = (results || []).map(formatSqlRow);
      if (formatted.length === 0) {
        let seedList = SEED_POSTS;
        if (category) {
          seedList = seedList.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
        }
        if (!includeDrafts) {
          seedList = seedList.filter(p => p.published !== false);
        }
        formatted = seedList;
      }
      return new Response(JSON.stringify(formatted), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error("D1 SQL Error:", err);
      // fallback to memory below
    }
  }

  // 2. Memory / Seed fallback if D1 not yet bound
  let posts = SEED_POSTS;

  if (idOrSlug) {
    const found = posts.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    if (!found) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(found), {
      headers: { "Content-Type": "application/json" }
    });
  }

  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  let filtered = posts;
  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
  }

  return new Response(JSON.stringify(filtered), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=30"
    }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    const id = data.id || `crii-paper-${Date.now()}`;
    const title = (data.title || "Untitled Research Publication").trim();
    let slug = (data.slug || title || "paper")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    if (!slug) slug = `paper-${Date.now().toString(36)}`;
    const category = data.category || "Space & Astrophysics";
    const date = data.date || new Date().toISOString().split("T")[0];
    const nowIso = new Date().toISOString();
    const updatedAt = nowIso;
    const updatedBy = data.updatedBy || "Institute Fellow";

    const authorsJson = JSON.stringify(Array.isArray(data.authors) && data.authors.length > 0 ? data.authors : [data.authors || "CRII Fellow"]);
    const tagsJson = JSON.stringify(Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : ["Research"]);
    const blocksJson = data.blocks ? JSON.stringify(data.blocks) : "[]";
    const published = data.published !== false ? 1 : 0;
    const featured = data.featured ? 1 : 0;
    const downloads = Number(data.downloads) || 0;
    const citations = Number(data.citations) || 0;
    const coverImage = data.coverImage || "";
    const readingTime = data.readingTime || "5 min read";
    const doi = data.doi || `10.5281/crii.2026.${Math.floor(1000 + Math.random() * 9000)}`;
    const summary = data.summary || title;
    const abstract = data.abstract || summary;
    const content = data.content || summary;

    // 1. Save to Cloudflare D1 SQL Database with automatic slug deduplication
    if (env && env.DB) {
      // Check if another article uses this slug
      let finalSlug = slug;
      let counter = 1;
      while (true) {
        const existing = await env.DB.prepare(
          "SELECT id FROM posts WHERE slug = ? AND id != ? LIMIT 1"
        ).bind(finalSlug, id).first();
        if (!existing) break;
        finalSlug = `${slug}-${counter++}`;
      }
      slug = finalSlug;

      if (featured === 1) {
        await env.DB.prepare("UPDATE posts SET featured = 0 WHERE id != ?").bind(id).run().catch(() => {});
      }

      const sql = `
        INSERT INTO posts (
          id, slug, title, coverImage, category, authors_json, date,
          updatedAt, updatedBy, readingTime, doi, summary, abstract,
          content, blocks_json, tags_json, published, featured, downloads, citations
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        ON CONFLICT(id) DO UPDATE SET
          slug=excluded.slug,
          title=excluded.title,
          coverImage=excluded.coverImage,
          category=excluded.category,
          authors_json=excluded.authors_json,
          updatedAt=excluded.updatedAt,
          updatedBy=excluded.updatedBy,
          readingTime=excluded.readingTime,
          doi=excluded.doi,
          summary=excluded.summary,
          abstract=excluded.abstract,
          content=excluded.content,
          blocks_json=excluded.blocks_json,
          tags_json=excluded.tags_json,
          published=excluded.published,
          featured=excluded.featured;
      `;
      await env.DB.prepare(sql).bind(
        id, slug, title, coverImage, category, authorsJson, date,
        updatedAt, updatedBy, readingTime, doi, summary, abstract,
        content, blocksJson, tagsJson, published, featured, downloads, citations
      ).run();
    }

    const saved = {
      ...data,
      id,
      slug,
      title,
      category,
      date,
      updatedAt,
      updatedBy,
      coverImage,
      readingTime,
      doi,
      summary,
      abstract,
      content,
      published: Boolean(published),
      featured: Boolean(featured),
      downloads,
      citations
    };

    return new Response(JSON.stringify(saved), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Failed to create/update post in D1:", err);
    return new Response(JSON.stringify({ error: err.message || "Failed to process post" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestDelete(context) {
  const { params, env } = context;
  const id = params.id ? params.id[0] : null;

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400 });
  }

  if (env && env.DB) {
    try {
      await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
    } catch (e) {
      console.error("D1 delete error:", e);
    }
  }

  return new Response(JSON.stringify({ success: true, id }), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
