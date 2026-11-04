/**
 * Cloudflare Pages Function: /api/auth/users
 * Whitelist Management for Autz.org accounts via Cloudflare D1 SQL database
 */

export async function onRequestGet(context) {
  const { env } = context;

  const defaultUsers = [
    {
      email: "harunabdullahrakin@gmail.com",
      name: "Harun Abdullah Rakin",
      role: "Super Admin & Director",
      division: "Institute Executive Council",
      status: "Active",
      addedDate: "2026-01-01"
    },
    {
      email: "admin@curiomas.org",
      name: "CRII Administration",
      role: "Institute Admin",
      division: "Operations & Governance",
      status: "Active",
      addedDate: "2026-01-01"
    }
  ];

  if (env && env.DB) {
    try {
      const { results } = await env.DB.prepare(
        "SELECT email, name, role, division, status, addedDate, autzorg_id FROM allowed_users ORDER BY addedDate DESC"
      ).all();

      if (results && results.length > 0) {
        return new Response(JSON.stringify(results), {
          headers: { "Content-Type": "application/json" }
        });
      }
    } catch (e) {
      console.warn("Cloudflare D1 allowed_users read error:", e);
    }
  }

  return new Response(JSON.stringify(defaultUsers), {
    headers: { "Content-Type": "application/json" }
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
        await env.DB.prepare(`
          INSERT INTO allowed_users (email, name, role, division, status, addedDate)
          VALUES (?, ?, ?, ?, 'Active', ?)
          ON CONFLICT(email) DO UPDATE SET
            name = excluded.name,
            role = excluded.role,
            division = excluded.division,
            status = 'Active'
        `).bind(email, name, role, division, addedDate).run();
      } catch (dbErr) {
        console.error("Cloudflare D1 allowed_users insert error:", dbErr);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      user: { email, name, role, division, status: "Active", addedDate }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
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
        await env.DB.prepare("DELETE FROM allowed_users WHERE LOWER(email) = LOWER(?)")
          .bind(email)
          .run();
      } catch (dbErr) {
        console.error("Cloudflare D1 allowed_users delete error:", dbErr);
      }
    }

    return new Response(JSON.stringify({ success: true, removed: email }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to remove user" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
