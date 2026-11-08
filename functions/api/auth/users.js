/**
 * Cloudflare Pages Function: /api/auth/users
 * Whitelist Management for Autz.org accounts via Cloudflare D1 SQL database
 */

async function ensureTables(db) {
  if (!db) return;
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS allowed_users (
        email TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'Research Fellow',
        division TEXT DEFAULT 'Institute Research Council',
        status TEXT NOT NULL DEFAULT 'Active',
        addedDate TEXT NOT NULL,
        autzorg_id TEXT
      )
    `).run().catch(() => {});

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value_json TEXT NOT NULL,
        updatedAt TEXT,
        updatedBy TEXT
      )
    `).run().catch(() => {});
  } catch (e) {
    console.error("ensureTables error:", e);
  }
}

export async function onRequestGet(context) {
  const { env } = context;

  if (env && env.DB) {
    try {
      await ensureTables(env.DB);

      // Load revoked users tombstone
      let revokedSet = new Set();
      try {
        const revRow = await env.DB.prepare("SELECT value_json FROM settings WHERE key = 'revoked_users'").first();
        if (revRow && revRow.value_json) {
          const arr = JSON.parse(revRow.value_json);
          if (Array.isArray(arr)) arr.forEach(em => revokedSet.add(String(em).toLowerCase().trim()));
        }
      } catch (e) {}

      // One-time seed for founding Super Admin only
      let isInitialized = false;
      try {
        const initRow = await env.DB.prepare("SELECT value_json FROM settings WHERE key = 'users_initialized'").first();
        if (initRow) isInitialized = true;
      } catch (e) {}

      if (!isInitialized) {
        await env.DB.prepare(`
          INSERT OR IGNORE INTO allowed_users (email, name, role, division, status, addedDate)
          VALUES ('harunabdullahrakin@gmail.com', 'Harun Abdullah Rakin', 'Super Admin & Director', 'Institute Executive Council', 'Active', '2026-01-01')
        `).run().catch(() => {});
        await env.DB.prepare("INSERT OR REPLACE INTO settings (key, value_json, updatedAt, updatedBy) VALUES ('users_initialized', 'true', datetime('now'), 'system')").run().catch(() => {});
      }

      const { results } = await env.DB.prepare(
        "SELECT email, name, role, division, status, addedDate, autzorg_id FROM allowed_users ORDER BY addedDate DESC"
      ).all();

      // Filter out any emails marked in revoked_users
      const activeUsers = (results || []).filter(u => u && u.email && !revokedSet.has(u.email.toLowerCase().trim()));

      return new Response(JSON.stringify(activeUsers), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      });
    } catch (e) {
      console.warn("Cloudflare D1 allowed_users read error:", e);
    }
  }

  // Minimal safe fallback
  return new Response(JSON.stringify([
    {
      email: "harunabdullahrakin@gmail.com",
      name: "Harun Abdullah Rakin",
      role: "Super Admin & Director",
      division: "Institute Executive Council",
      status: "Active",
      addedDate: "2026-01-01"
    }
  ]), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const email = (body.email || "").toLowerCase().trim();
    const name = (body.name || email.split("@")[0] || "Researcher").trim();
    const role = (body.role || "Research Fellow").trim();
    const division = (body.division || "Scientific Division").trim();
    const addedDate = new Date().toISOString().split("T")[0];

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "A valid email address is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (env && env.DB) {
      try {
        await ensureTables(env.DB);

        await env.DB.prepare(`
          INSERT INTO allowed_users (email, name, role, division, status, addedDate)
          VALUES (?, ?, ?, ?, 'Active', ?)
          ON CONFLICT(email) DO UPDATE SET
            name = excluded.name,
            role = excluded.role,
            division = excluded.division,
            status = 'Active'
        `).bind(email, name, role, division, addedDate).run();

        // If previously revoked, un-revoke
        try {
          const revRow = await env.DB.prepare("SELECT value_json FROM settings WHERE key = 'revoked_users'").first();
          if (revRow && revRow.value_json) {
            let list = JSON.parse(revRow.value_json);
            if (Array.isArray(list)) {
              list = list.filter(em => String(em).toLowerCase().trim() !== email);
              await env.DB.prepare("UPDATE settings SET value_json = ?, updatedAt = datetime('now') WHERE key = 'revoked_users'").bind(JSON.stringify(list)).run();
            }
          }
        } catch (e) {}
      } catch (dbErr) {
        console.error("Cloudflare D1 allowed_users insert error:", dbErr);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      user: { email, name, role, division, status: "Active", addedDate }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid request payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestDelete(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    let email = url.searchParams.get("email");

    if (!email) {
      const body = await request.json().catch(() => ({}));
      email = body.email;
    }

    if (!email) {
      return new Response(JSON.stringify({ error: "Email query param is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    email = email.toLowerCase().trim();

    if (email === "harunabdullahrakin@gmail.com") {
      return new Response(JSON.stringify({ error: "Cannot revoke Super Admin access" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (env && env.DB) {
      try {
        await ensureTables(env.DB);

        // 1. Delete from allowed_users table
        await env.DB.prepare("DELETE FROM allowed_users WHERE LOWER(email) = LOWER(?)")
          .bind(email)
          .run();

        // 2. Terminate any active sessions for this user
        await env.DB.prepare("DELETE FROM sessions WHERE LOWER(email) = LOWER(?)")
          .bind(email)
          .run()
          .catch(() => {});

        // 3. Record in revoked_users tombstone in settings table
        let revoked = [];
        const revRow = await env.DB.prepare("SELECT value_json FROM settings WHERE key = 'revoked_users'").first();
        if (revRow && revRow.value_json) {
          try { revoked = JSON.parse(revRow.value_json); } catch(e){}
        }
        if (!Array.isArray(revoked)) revoked = [];
        if (!revoked.includes(email)) {
          revoked.push(email);
          await env.DB.prepare(`
            INSERT INTO settings (key, value_json, updatedAt, updatedBy)
            VALUES ('revoked_users', ?, datetime('now'), 'system')
            ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json, updatedAt=excluded.updatedAt;
          `).bind(JSON.stringify(revoked)).run();
        }
      } catch (dbErr) {
        console.error("Cloudflare D1 allowed_users delete error:", dbErr);
      }
    }

    return new Response(JSON.stringify({ success: true, removed: email }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to remove user" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
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
