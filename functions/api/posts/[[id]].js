/**
 * Cloudflare Pages Function: /api/posts/[[id]]
 * Relational SQL CRUD operations for research articles & blog dispatches via Cloudflare D1
 */

const SEED_POSTS = [
  {
    id: "crii-paper-2026-001",
    slug: "spectroscopic-signatures-trappist-1e",
    title: "Spectroscopic Signatures of Atmospheric Biosignatures on TRAPPIST-1e: A Comparative Synthetic Simulation",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    authors: ["Aria Rahman (CRII Fellow)", "Tariq Al-Mansoor", "CRII Astrophysics Group"],
    date: "2026-03-14",
    updatedAt: "2026-09-24T18:30:00Z",
    updatedBy: "Harun Abdullah Rakin",
    category: "Space & Astrophysics",
    tags: ["Exoplanets", "Spectroscopy", "JWST Data", "Atmospheric Modeling"],
    readingTime: "12 min read",
    doi: "10.5281/crii.2026.0101",
    summary: "Using synthetic radiative transfer modeling and planetary atmospheric codes, our student research team models transit spectroscopy signatures to discern false-positive abiotic oxygen from true biological equilibrium on rocky M-dwarf worlds.",
    abstract: "The characterization of terrestrial exoplanet atmospheres around M-dwarf host stars presents unprecedented opportunities and distinct challenges. In this research, we construct a 1D radiative-convective photochemical equilibrium model simulating the atmosphere of TRAPPIST-1e across diverse ocean-fraction baselines.",
    content: "### 1. Introduction and Orbital Dynamics\n\nThe detection of exoplanetary atmospheres has transitioned from broad gas-giant characterization to high-precision terrestrial exoplanet spectroscopy.\n\n$$\\tau_\\nu = \\int \\kappa_\\nu \\rho \\, ds$$\n\n### 2. Abiotic Oxygen False Positives\n\nStellar ultraviolet flare activity can photolyze ocean water inventories, leaving behind massive abiotic oxygen columns that mimic biological signatures without active metabolism.\n\n### 3. Conclusion\n\nHigh-resolution cross-dispersion infrared spectroscopy remains our most viable path for validating genuine chemical disequilibrium.",
    published: true,
    featured: true,
    downloads: 482,
    citations: 14
  },
  {
    id: "crii-paper-2026-002",
    slug: "molecular-clocks-ediacaran-cambrian",
    title: "Molecular Clocks and the Ediacaran-Cambrian Explosion: Reassessing Divergence Chronologies",
    coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
    authors: ["Shayan Debnath", "Maya Lin-Cruz", "CRII Paleobiology Division"],
    date: "2026-02-28",
    updatedAt: "2026-09-24T19:00:00Z",
    updatedBy: "Harun Abdullah Rakin",
    category: "Ancient Biology & Paleontology",
    tags: ["Paleogenomics", "Cambrian Explosion", "Molecular Clocks", "Evolution"],
    readingTime: "15 min read",
    doi: "10.5281/crii.2026.0102",
    summary: "Bridging disparate fossil horizons and Bayesian relaxed molecular clock frameworks to address the enigmatic evolutionary pulse of the early Paleozoic.",
    abstract: "The rapid emergence of bilateral animal body plans during the Ediacaran-Cambrian transition (~541 Ma) has fascinated biologists since Darwin. We analyze multi-locus nucleotide and amino acid alignments calibrated against conservative paleontological boundary constraints.",
    content: "### 1. The Darwinian Conundrum in Contemporary Light\n\nThe apparent suddenness of the Cambrian radiation in the fossil record was historically deemed a profound challenge to phyletic gradualism.\n\n### 2. Relaxed Clock Methodologies\n\nBy integrating autocorrelated and uncorrelated lognormal rate models, our divergence estimations align deep metazoan roots into the Cryogenian period.",
    published: true,
    featured: true,
    downloads: 319,
    citations: 9
  },
  {
    id: "crii-paper-2026-003",
    slug: "geometric-deep-learning-extremophile-enzymes",
    title: "Geometric Deep Learning for Thermostable Enzyme Design Inspired by Deep-Sea Hydrothermal Vent Microbes",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    authors: ["Kenji Takahashi", "Elena Rostova", "CRII AI & Bioengineering Core"],
    date: "2026-01-20",
    updatedAt: "2026-09-24T19:15:00Z",
    updatedBy: "Harun Abdullah Rakin",
    category: "AI & Computational Science",
    tags: ["Machine Learning", "Structural Biology", "Extremophiles", "Graph Neural Networks"],
    readingTime: "10 min read",
    doi: "10.5281/crii.2026.0103",
    summary: "Applying equivariant graph neural networks to decipher thermal stabilization mechanisms in hyperthermophilic archaea and synthesize green biocatalysts.",
    abstract: "Industrial biocatalysis is severely hindered by enzyme denaturation under thermal stress. We harness geometric deep learning to model electrostatic interactions and salt-bridge networks in deep-sea vent archaea.",
    content: "### 1. High-Temperature Frontiers\n\nProteins from Methanocaldococcus jannaschii maintain structural integrity at temperatures exceeding 90°C.\n\n### 2. SE(3)-Equivariant Neural Architectures\n\nOur graph architecture explicitly respects 3D rotational and translational symmetries in atomic point clouds.",
    published: true,
    featured: true,
    downloads: 612,
    citations: 21
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
        if (!row) {
          return new Response(JSON.stringify({ error: "Post not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }
        return new Response(JSON.stringify(formatSqlRow(row)), {
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
      return new Response(JSON.stringify((results || []).map(formatSqlRow)), {
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
    const slug = (data.slug || data.title || "paper")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const date = data.date || new Date().toISOString().split("T")[0];
    const nowIso = new Date().toISOString();
    const updatedAt = nowIso;
    const updatedBy = data.updatedBy || "Institute Fellow";

    const authorsJson = JSON.stringify(Array.isArray(data.authors) ? data.authors : [data.authors || "CRII Fellow"]);
    const tagsJson = JSON.stringify(Array.isArray(data.tags) ? data.tags : [data.tags || "Research"]);
    const blocksJson = data.blocks ? JSON.stringify(data.blocks) : null;
    const published = data.published !== false ? 1 : 0;
    const featured = data.featured ? 1 : 0;
    const downloads = data.downloads || 0;
    const citations = data.citations || 0;
    const coverImage = data.coverImage || "";
    const readingTime = data.readingTime || "10 min read";
    const doi = data.doi || `10.5281/crii.2026.${Math.floor(1000 + Math.random() * 9000)}`;
    const summary = data.summary || "";
    const abstract = data.abstract || "";
    const content = data.content || "";

    // 1. Save to Cloudflare D1 SQL Database
    if (env && env.DB) {
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
        id, slug, data.title, coverImage, data.category, authorsJson, date,
        updatedAt, updatedBy, readingTime, doi, summary, abstract,
        content, blocksJson, tagsJson, published, featured, downloads, citations
      ).run();
    }

    const saved = {
      ...data,
      id,
      slug,
      date,
      updatedAt,
      updatedBy,
      coverImage,
      readingTime,
      doi,
      published: Boolean(published),
      featured: Boolean(featured),
      downloads,
      citations
    };

    return new Response(JSON.stringify(saved), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Failed to create/update post:", err);
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
