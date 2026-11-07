/**
 * Cloudflare Pages Function: /api/auth/me
 * Cryptographic HMAC-SHA256 Token Verification & Cloudflare D1 SQL Session Check
 */

function fromBase64Url(base64url) {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function verifyToken(token, secret) {
  try {
    if (!token || !token.startsWith('crii_v2.')) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = fromBase64Url(parts[2]);
    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(parts[1]));
    if (!isValid) return null;

    const payloadJson = new TextDecoder().decode(fromBase64Url(parts[1]));
    const payload = JSON.parse(payloadJson);
    if (!payload || !payload.exp || Date.now() > payload.exp) return null;

    return payload.user;
  } catch (e) {
    return null;
  }
}

export async function onRequestGet(context) {
  const { request, env } = context;

  let token = "";
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.replace("Bearer ", "").trim();
  }

  // Also fallback to HttpOnly session cookie
  if (!token) {
    const cookieHeader = request.headers.get("Cookie") || "";
    const match = cookieHeader.match(/(?:^|;\s*)crii_session=([^;]*)/);
    if (match) {
      token = decodeURIComponent(match[1]).trim();
    }
  }

  if (!token) {
    return new Response(JSON.stringify({
      authenticated: false,
      error: "Missing authorization token or session cookie"
    }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  // 1. Verify Cryptographic Token Signature (Instant & Immune to D1 Latency/Cold Starts)
  const secret = (env && (env.AUTH_SECRET || env.ADMIN_EMAIL)) || "crii_institute_jwt_hmac_secret_2026";
  const verifiedUser = await verifyToken(token, secret);
  if (verifiedUser) {
    return new Response(JSON.stringify({
      authenticated: true,
      user: verifiedUser
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  const nowIso = new Date().toISOString();

  // 2. Look up session in Cloudflare D1 SQL database (for legacy or D1-tracked tokens)
  if (env && env.DB) {
    try {
      // Ensure sessions table exists
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS sessions (
          token TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          user_json TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          expiresAt TEXT NOT NULL
        )
      `).run().catch(() => {});

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

  // 3. Check Cloudflare KV if bound
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
