/**
 * Cloudflare Pages Function: /api/datasets/[[id]]
 * Handles open scientific research datasets
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
    description: "Curated dataset comprising 124 orthologous ribosomal and mitochondrial protein alignments with stratigraphic calibrations.",
    parameters: ["Gene Family ID", "Phylogenetic Clade", "Minimum Node Age (Ma)", "Maximum Node Age (Ma)", "Stratigraphic Reference"]
  }
];

export async function onRequestGet(context) {
  const { env } = context;

  let datasets = SEED_DATASETS;
  if (env && env.CRII_KV) {
    const kvDatasets = await env.CRII_KV.get("crii_datasets", "json");
    if (kvDatasets) datasets = kvDatasets;
  }

  return new Response(JSON.stringify(datasets), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60"
    }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();

    let datasets = SEED_DATASETS;
    if (env && env.CRII_KV) {
      const kvDatasets = await env.CRII_KV.get("crii_datasets", "json");
      if (kvDatasets) datasets = kvDatasets;
    }

    const newDs = {
      ...data,
      id: `ds-crii-${Math.floor(100 + Math.random() * 900)}`,
      updated: new Date().toISOString().split("T")[0],
      version: data.version || "v1.0.0"
    };

    datasets.unshift(newDs);

    if (env && env.CRII_KV) {
      await env.CRII_KV.put("crii_datasets", JSON.stringify(datasets));
    }

    return new Response(JSON.stringify(newDs), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to publish dataset" }), { status: 400 });
  }
}
