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
  divisions: [
    {
      id: "div-space-astrophysics",
      number: "01",
      tag: "01 / RESEARCH DIVISION",
      title: "Space & Astrophysics",
      desc: "Sparking distant atmospheres through exoplanetary spectra and light curves.",
      image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=800&q=80",
      link: "/research?division=space-astrophysics"
    },
    {
      id: "div-ancient-biology",
      number: "02",
      tag: "02 / RESEARCH DIVISION",
      title: "Ancient Biology & Paleontology",
      desc: "Tracing the history of life through fossil records and genomic divergence.",
      image: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80",
      link: "/research?division=ancient-biology"
    },
    {
      id: "div-ai-computational-science",
      number: "03",
      tag: "03 / RESEARCH DIVISION",
      title: "AI & Computational Science",
      desc: "Building open computational methods for complex biological and physical systems.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      link: "/research?division=ai-computational"
    },
    {
      id: "div-astrobiology",
      number: "04",
      tag: "04 / RESEARCH DIVISION",
      title: "Astrobiology & Extremophiles",
      desc: "Exploring life's resilience at the edges of habitability, on Earth and beyond.",
      image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
      link: "/research?division=astrobiology"
    }
  ],
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
