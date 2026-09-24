/**
 * Cloudflare Pages Function: /api/posts/[[id]]
 * CRUD operations for research articles & blog dispatches
 */

const SEED_POSTS = [
  {
    id: "crii-paper-2026-001",
    slug: "spectroscopic-signatures-trappist-1e",
    title: "Spectroscopic Signatures of Atmospheric Biosignatures on TRAPPIST-1e: A Comparative Synthetic Simulation",
    authors: ["Aria Rahman (CRII Fellow)", "Tariq Al-Mansoor", "CRII Astrophysics Group"],
    date: "2026-03-14",
    category: "Space & Astrophysics",
    tags: ["Exoplanets", "Spectroscopy", "JWST Data", "Atmospheric Modeling"],
    readingTime: "12 min read",
    doi: "10.5281/crii.2026.0101",
    summary: "Using synthetic radiative transfer modeling and planetary atmospheric codes, our student research team models transit spectroscopy signatures to discern false-positive abiotic oxygen from true biological equilibrium on rocky M-dwarf worlds.",
    abstract: "The characterization of terrestrial exoplanet atmospheres around M-dwarf host stars presents unprecedented opportunities and distinct challenges...",
    content: "### 1. Introduction and Orbital Dynamics\n\nThe detection of exoplanetary atmospheres has transitioned from broad gas-giant characterization to high-precision terrestrial exoplanet spectroscopy...",
    published: true,
    featured: true,
    downloads: 482,
    citations: 14
  },
  {
    id: "crii-paper-2026-002",
    slug: "molecular-clocks-ediacaran-cambrian",
    title: "Molecular Clocks and the Ediacaran-Cambrian Explosion: Reassessing Divergence Chronologies",
    authors: ["Shayan Debnath", "Maya Lin-Cruz", "CRII Paleobiology Division"],
    date: "2026-02-28",
    category: "Ancient Biology & Paleontology",
    tags: ["Paleogenomics", "Cambrian Explosion", "Molecular Clocks", "Evolution"],
    readingTime: "15 min read",
    doi: "10.5281/crii.2026.0102",
    summary: "Bridging disparate fossil horizons and Bayesian relaxed molecular clock frameworks to address the enigmatic evolutionary pulse of the early Paleozoic.",
    abstract: "The rapid emergence of bilateral animal body plans during the Ediacaran-Cambrian transition (~541 Ma) has fascinated biologists since Darwin...",
    content: "### 1. The Darwinian Conundrum in Contemporary Light\n\nThe apparent suddenness of the Cambrian radiation in the fossil record was historically deemed a profound challenge to phyletic gradualism...",
    published: true,
    featured: true,
    downloads: 319,
    citations: 9
  },
  {
    id: "crii-paper-2026-003",
    slug: "geometric-deep-learning-extremophile-enzymes",
    title: "Geometric Deep Learning for Thermostable Enzyme Design Inspired by Deep-Sea Hydrothermal Vent Microbes",
    authors: ["Kenji Takahashi", "Elena Rostova", "CRII AI & Bioengineering Core"],
    date: "2026-01-20",
    category: "AI & Computational Science",
    tags: ["Machine Learning", "Structural Biology", "Extremophiles", "Graph Neural Networks"],
    readingTime: "10 min read",
    doi: "10.5281/crii.2026.0103",
    summary: "Applying equivariant graph neural networks to decipher thermal stabilization mechanisms in hyperthermophilic archaea and synthesize green biocatalysts.",
    abstract: "Industrial biocatalysis is severely hindered by enzyme denaturation under thermal stress...",
    content: "### 1. High-Temperature Frontiers\n\nProteins are delicate thermodynamic machines stabilized by marginal free energy differences...",
    published: true,
    featured: true,
    downloads: 612,
    citations: 21
  }
];

export async function onRequestGet(context) {
  const { params, request, env } = context;
  const idOrSlug = params.id ? params.id[0] : null;

  let posts = SEED_POSTS;
  if (env && env.CRII_KV) {
    const kvPosts = await env.CRII_KV.get("crii_posts", "json");
    if (kvPosts) posts = kvPosts;
  }

  // If fetching single post
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

  // Filter list by category or query
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
    let posts = SEED_POSTS;
    if (env && env.CRII_KV) {
      const kvPosts = await env.CRII_KV.get("crii_posts", "json");
      if (kvPosts) posts = kvPosts;
    }

    const newPost = {
      ...data,
      id: `crii-paper-${Date.now()}`,
      slug: (data.slug || data.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      date: new Date().toISOString().split("T")[0],
      downloads: 0,
      citations: 0,
      published: data.published !== undefined ? data.published : true
    };

    posts.unshift(newPost);

    if (env && env.CRII_KV) {
      await env.CRII_KV.put("crii_posts", JSON.stringify(posts));
    }

    return new Response(JSON.stringify(newPost), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to create post" }), {
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

  if (env && env.CRII_KV) {
    let posts = await env.CRII_KV.get("crii_posts", "json") || SEED_POSTS;
    posts = posts.filter(p => p.id !== id);
    await env.CRII_KV.put("crii_posts", JSON.stringify(posts));
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
