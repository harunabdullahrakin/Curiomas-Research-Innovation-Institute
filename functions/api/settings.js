/**
 * Cloudflare Pages Function: /api/settings
 * Relational SQL storage for hero appearance, branding, festive themes, emailjs, and dynamic application form config
 */

const DEFAULT_SETTINGS = {
  hero: {
    mediaType: "both",
    selectionMode: "random",
    fixedImageIndex: 0,
    videoUrl: "assets/hero-bg.mp4",
    blurPx: 12,
    overlayOpacity: 0.55,
    fontFamily: "Eyekons",
    backgroundImages: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=85",
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=85",
      "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1920&q=85",
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=85",
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=85"
    ],
    imageOpacity: 0.40
  },
  divisions: [],
  cohorts: [],
  festive: {
    mode: "auto",
    theme: "holi",
    intensity: 0.70
  },
  emailjs: {
    templateId: ""
  },
  branding: {
    name: "Curiomas Research & Innovation Institute",
    logoUrl: "",
    autzAppId: "",
    emailjsTemplateId: ""
  },
  navbar: {
    title: "Curiomas Research & Innovation Institute",
    subtitle: "CRII • Open Science Collective",
    logoUrl: ""
  },
  app_form_config: {
    isOpen: true,
    closedMessage: "Applications for the current Student Research Fellowship cohort are currently closed. The Institute Research Council is reviewing candidate dossiers. Please check back for announcements regarding the next cohort.",
    enableCuriosityGateway: true,
    fields: {
      fullName: { label: "Full Legal Name", required: true, visible: true },
      email: { label: "Email Address", required: true, visible: true },
      university: { label: "University / Institution", required: true, visible: true },
      fieldOfStudy: { label: "Field of Study / Major", required: true, visible: true },
      division: { label: "Preferred Research Division", required: true, visible: true },
      academicLevel: { label: "Academic Level / Cohort", required: false, visible: true },
      portfolio: { label: "GitHub, ORCID, or Portfolio Link", required: false, visible: true },
      phone: { label: "Contact Phone / WhatsApp", required: false, visible: false },
      statement: { label: "Statement of Intent & Research Interests", required: true, visible: true }
    },
    customFields: []
  }
};

export async function onRequestGet(context) {
  const { env } = context;

  if (env && env.DB) {
    try {
      // Ensure settings table exists
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value_json TEXT NOT NULL,
          updatedAt TEXT,
          updatedBy TEXT
        )
      `).run().catch(() => {});

      const { results } = await env.DB.prepare("SELECT * FROM settings").all();
      const settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));

      for (const row of (results || [])) {
        try {
          settings[row.key] = JSON.parse(row.value_json);
        } catch (e) {
          // ignore corrupted json
        }
      }

      // If dedicated D1 divisions table has records, prioritize them
      try {
        const divRows = await env.DB.prepare("SELECT * FROM divisions ORDER BY orderIndex ASC, number ASC").all();
        if (divRows && divRows.results && divRows.results.length > 0) {
          settings.divisions = divRows.results;
        }
      } catch (divErr) {}

      // Synchronize EmailJS Template ID across both emailjs and branding keys
      const savedTplId = (settings.emailjs && settings.emailjs.templateId) ||
                         (settings.branding && settings.branding.emailjsTemplateId) || "";
      if (savedTplId) {
        if (!settings.emailjs) settings.emailjs = {};
        settings.emailjs.templateId = savedTplId;
        if (!settings.branding) settings.branding = {};
        settings.branding.emailjsTemplateId = savedTplId;
      }

      return new Response(JSON.stringify(settings), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      });
    } catch (e) {
      console.error("D1 Settings read error:", e);
    }
  }

  return new Response(JSON.stringify(DEFAULT_SETTINGS), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const payload = await request.json();
    const key = payload.key || "hero";
    const valueJson = JSON.stringify(payload.value || {});
    const updatedBy = payload.updatedBy || "Administrator";
    const updatedAt = new Date().toISOString();

    if (env && env.DB) {
      // Ensure settings table exists
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value_json TEXT NOT NULL,
          updatedAt TEXT,
          updatedBy TEXT
        )
      `).run().catch(() => {});

      await env.DB.prepare(`
        INSERT INTO settings (key, value_json, updatedAt, updatedBy)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET
          value_json=excluded.value_json,
          updatedAt=excluded.updatedAt,
          updatedBy=excluded.updatedBy;
      `).bind(key, valueJson, updatedAt, updatedBy).run();

      // If divisions are updated via settings, also sync dedicated divisions table
      if (key === 'divisions' && Array.isArray(payload.value)) {
        try {
          await env.DB.prepare(`
            CREATE TABLE IF NOT EXISTS divisions (
              id TEXT PRIMARY KEY,
              number TEXT NOT NULL,
              tag TEXT NOT NULL,
              title TEXT NOT NULL,
              desc TEXT,
              image TEXT,
              link TEXT DEFAULT '/research',
              orderIndex INTEGER DEFAULT 0,
              createdAt TEXT,
              updatedAt TEXT
            )
          `).run().catch(() => {});

          for (let i = 0; i < payload.value.length; i++) {
            const div = payload.value[i];
            const divId = div.id || ('div-' + Math.random().toString(36).substring(2, 9));
            const divNum = div.number || String(i + 1).padStart(2, '0');
            const divTag = div.tag || (divNum + ' / RESEARCH DIVISION');
            const divTitle = div.title || 'Untitled Division';
            const divDesc = div.desc || '';
            const divImg = div.image || '';
            const divLink = div.link || '/research';
            const divOrder = div.orderIndex !== undefined ? div.orderIndex : (i + 1);

            await env.DB.prepare(`
              INSERT INTO divisions (id, number, tag, title, desc, image, link, orderIndex, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
              ON CONFLICT(id) DO UPDATE SET
                number = excluded.number,
                tag = excluded.tag,
                title = excluded.title,
                desc = excluded.desc,
                image = excluded.image,
                link = excluded.link,
                orderIndex = excluded.orderIndex,
                updatedAt = datetime('now')
            `).bind(divId, divNum, divTag, divTitle, divDesc, divImg, divLink, divOrder).run().catch(() => {});
          }

          const activeIds = payload.value.map(d => d.id).filter(Boolean);
          if (activeIds.length > 0) {
            const placeholders = activeIds.map(() => '?').join(',');
            await env.DB.prepare(`DELETE FROM divisions WHERE id NOT IN (${placeholders})`).bind(...activeIds).run().catch(() => {});
          }
        } catch (syncErr) {}
      }

      // If emailjs template is updated, also ensure branding key stores it
      if (key === "emailjs" && payload.value && payload.value.templateId) {
        const tpl = payload.value.templateId.trim();
        const brandingRow = await env.DB.prepare("SELECT value_json FROM settings WHERE key = 'branding'").first();
        let brandingObj = {};
        if (brandingRow && brandingRow.value_json) {
          try { brandingObj = JSON.parse(brandingRow.value_json); } catch(e){}
        }
        brandingObj.emailjsTemplateId = tpl;
        await env.DB.prepare(`
          INSERT INTO settings (key, value_json, updatedAt, updatedBy)
          VALUES ('branding', ?, ?, ?)
          ON CONFLICT(key) DO UPDATE SET
            value_json=excluded.value_json,
            updatedAt=excluded.updatedAt;
        `).bind(JSON.stringify(brandingObj), updatedAt, updatedBy).run().catch(() => {});
      }
    }

    return new Response(JSON.stringify({ success: true, key, value: payload.value }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (err) {
    console.error("D1 Settings write error:", err);
    return new Response(JSON.stringify({ error: err.message || "Failed to save settings" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
