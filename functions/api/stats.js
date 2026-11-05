/**
 * Cloudflare Pages Function: /api/stats
 * Returns live institute activity statistics
 */

export async function onRequestGet(context) {
  const { env } = context;

  let stats = {
    publishedPapers: 0,
    activeInterns: 4,
    pendingApplications: 0,
    openDatasets: 2,
    totalDownloads: 0,
    totalCitations: 0,
    timestamp: new Date().toISOString()
  };

  let diag = {
    envKeys: env ? Object.keys(env) : [],
    hasDB: Boolean(env && env.DB),
    dbError: null,
    tables: []
  };

  if (env && env.DB) {
    try {
      const tablesRes = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
      diag.tables = (tablesRes && tablesRes.results) ? tablesRes.results.map(r => r.name) : [];
      const papersCount = await env.DB.prepare("SELECT COUNT(*) as count FROM posts WHERE published = 1").first();
      if (papersCount && papersCount.count !== undefined) {
        stats.publishedPapers = papersCount.count;
      }
    } catch (e) {
      diag.dbError = e.message;
    }
  }

  if (env && env.CRII_KV) {
    try {
      const kvStats = await env.CRII_KV.get("crii_stats", "json");
      if (kvStats) stats = { ...stats, ...kvStats };
    } catch (e) {
      console.warn("KV stats read error", e);
    }
  }

  return new Response(JSON.stringify({ ...stats, _diag: diag }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
