/**
 * Cloudflare Pages Function: /api/settings
 * Relational SQL storage for hero appearance, video background, blur, and navbar settings
 */

const DEFAULT_SETTINGS = {
  hero: {
    videoUrl: "assets/hero-bg.mp4",
    blurPx: 12,
    overlayOpacity: 0.55
  },
  navbar: {
    title: "Curiomas Research & Innovation Institute",
    subtitle: "CRII • Open Science Collective",
    logoUrl: ""
  }
};

export async function onRequestGet(context) {
  const { env } = context;

  if (env && env.DB) {
    try {
      const { results } = await env.DB.prepare("SELECT * FROM settings").all();
      const settings = { ...DEFAULT_SETTINGS };

      for (const row of (results || [])) {
        try {
          settings[row.key] = JSON.parse(row.value_json);
        } catch (e) {
          // ignore corrupted json
        }
      }

      return new Response(JSON.stringify(settings), {
        headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=15" }
      });
    } catch (e) {
      console.error("D1 Settings read error:", e);
    }
  }

  return new Response(JSON.stringify(DEFAULT_SETTINGS), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const payload = await request.json(); // e.g. { key: "hero", value: { videoUrl, blurPx, overlayOpacity }, updatedBy }
    const key = payload.key || "hero";
    const valueJson = JSON.stringify(payload.value || {});
    const updatedBy = payload.updatedBy || "Administrator";
    const updatedAt = new Date().toISOString();

    if (env && env.DB) {
      await env.DB.prepare(`
        INSERT INTO settings (key, value_json, updatedAt, updatedBy)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET
          value_json=excluded.value_json,
          updatedAt=excluded.updatedAt,
          updatedBy=excluded.updatedBy;
      `).bind(key, valueJson, updatedAt, updatedBy).run();
    }

    return new Response(JSON.stringify({ success: true, key, value: payload.value }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("D1 Settings write error:", err);
    return new Response(JSON.stringify({ error: err.message || "Failed to save settings" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}
