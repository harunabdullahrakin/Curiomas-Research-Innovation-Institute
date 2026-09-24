/**
 * Cloudflare Pages Function: /api/stats
 * Returns live institute activity statistics
 */

export async function onRequestGet(context) {
  const { env } = context;

  // If Cloudflare KV is bound (e.g. CRII_KV)
  let stats = {
    publishedPapers: 4,
    activeInterns: 4,
    pendingApplications: 3,
    openDatasets: 4,
    totalDownloads: 1648,
    totalCitations: 49,
    timestamp: new Date().toISOString()
  };

  if (env && env.CRII_KV) {
    try {
      const kvStats = await env.CRII_KV.get("crii_stats", "json");
      if (kvStats) stats = { ...stats, ...kvStats };
    } catch (e) {
      console.warn("KV stats read error", e);
    }
  }

  return new Response(JSON.stringify(stats), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60"
    }
  });
}
