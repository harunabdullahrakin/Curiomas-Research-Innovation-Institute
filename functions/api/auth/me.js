/**
 * Cloudflare Pages Function: /api/auth/me
 * Verifies active session token via Cloudflare D1 SQL database
 */

export async function onRequestGet(context) {
  const { request, env } = context;

  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({
      authenticated: false,
      error: "Missing authorization token"
    }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const nowIso = new Date().toISOString();

  // 1. Look up session in Cloudflare D1 SQL database
  if (env && env.DB) {
    try {
      const row = await env.DB.prepare(
        "SELECT * FROM sessions WHERE token = ? AND expiresAt > ? LIMIT 1"
      ).bind(token, nowIso).first();

      if (row && row.user_json) {
        let userObj = null;
        try {
          userObj = JSON.parse(row.user_json);
        } catch (e) {
          userObj = { email: row.email, name: row.email.split("@")[0] };
        }

        return new Response(JSON.stringify({
          authenticated: true,
          user: userObj
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    } catch (e) {
      console.warn("Cloudflare D1 session lookup error:", e);
    }
  }

  // 2. Check Cloudflare KV if bound
  if (env && env.CRII_KV) {
    try {
      const session = await env.CRII_KV.get(`session:${token}`, "json");
      if (session) {
        return new Response(JSON.stringify({
          authenticated: true,
          user: session
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    } catch (e) {
      console.warn("KV session lookup error:", e);
    }
  }

  return new Response(JSON.stringify({
    authenticated: false,
    error: "Session expired or invalid"
  }), {
    status: 401,
    headers: { "Content-Type": "application/json" }
  });
}
