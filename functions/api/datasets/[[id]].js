/**
 * Cloudflare Pages Function: /api/datasets/[[id]]
 * Handles open scientific research datasets with Cloudflare D1 SQL persistence
 */

const SEED_DATASETS = [
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
    lead: "Aria Rahman",
    description: "Synthetic radiative transfer transits modeled under 6 distinct atmospheric regimes.",
    parameters: ["Wavelength (μm)", "Transit Depth (ppm)", "1-sigma Uncertainty", "Molecular Absorption", "Stellar Flare Residual"]
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
    lead: "Shayan Debnath",
    description: "Curated dataset comprising 124 orthologous ribosomal and mitochondrial protein alignments with stratigraphic calibrations.",
    parameters: ["Gene Family ID", "Phylogenetic Clade", "Minimum Node Age (Ma)", "Maximum Node Age (Ma)", "Stratigraphic Reference"]
  }
];

async function getDatasetsFromD1(db) {
  if (!db) return SEED_DATASETS;
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value_json TEXT NOT NULL,
        updatedAt TEXT,
        updatedBy TEXT
      )
    `).run().catch(() => {});

    const row = await db.prepare("SELECT value_json FROM settings WHERE key = 'datasets'").first();
    if (row && row.value_json) {
      const parsed = JSON.parse(row.value_json);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("D1 get datasets error:", e);
  }
  return SEED_DATASETS;
}

async function saveDatasetsToD1(db, datasets, updatedBy = "Administrator") {
  if (!db) return;
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value_json TEXT NOT NULL,
        updatedAt TEXT,
        updatedBy TEXT
      )
    `).run().catch(() => {});

    await db.prepare(`
      INSERT INTO settings (key, value_json, updatedAt, updatedBy)
      VALUES ('datasets', ?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET
        value_json=excluded.value_json,
        updatedAt=excluded.updatedAt,
        updatedBy=excluded.updatedBy;
    `).bind(JSON.stringify(datasets), new Date().toISOString(), updatedBy).run();
  } catch (e) {
    console.error("D1 save datasets error:", e);
  }
}

export async function onRequestGet(context) {
  const { env } = context;
  const datasets = await getDatasetsFromD1(env && env.DB);

  return new Response(JSON.stringify(datasets), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    let datasets = await getDatasetsFromD1(env && env.DB);

    const id = data.id || `ds-crii-${Math.floor(100 + Math.random() * 900)}`;
    const newDs = {
      ...data,
      id,
      lead: data.lead || data.leadResearcher || "CRII Fellow",
      leadResearcher: data.leadResearcher || data.lead || "CRII Fellow",
      updated: data.updated || new Date().toISOString().split("T")[0],
      version: data.version || "v1.0.0"
    };

    const existingIdx = datasets.findIndex(d => d.id === id);
    if (existingIdx >= 0) {
      datasets[existingIdx] = newDs;
    } else {
      datasets.unshift(newDs);
    }

    await saveDatasetsToD1(env && env.DB, datasets, data.updatedBy || "Administrator");

    return new Response(JSON.stringify(newDs), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (e) {
    console.error("D1 post dataset error:", e);
    return new Response(JSON.stringify({ error: "Failed to publish dataset" }), { status: 400 });
  }
}

export async function onRequestDelete(context) {
  const { params, request, env } = context;

  let id = null;
  if (params && params.id) {
    id = Array.isArray(params.id) ? params.id.join('/') : String(params.id);
  }
  if (!id) {
    const url = new URL(request.url);
    id = url.searchParams.get("id");
  }
  if (!id) {
    try {
      const body = await request.json();
      id = body.id;
    } catch (e) {}
  }

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing dataset ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    let datasets = await getDatasetsFromD1(env && env.DB);
    datasets = datasets.filter(d => d.id !== id);
    await saveDatasetsToD1(env && env.DB, datasets, "Administrator");

    return new Response(JSON.stringify({ success: true, id }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (e) {
    console.error("D1 delete dataset error:", e);
    return new Response(JSON.stringify({ error: "Failed to delete dataset" }), { status: 500 });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
