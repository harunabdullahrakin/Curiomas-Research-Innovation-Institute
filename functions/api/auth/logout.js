/**
 * Cloudflare Pages Function: /api/auth/logout
 * Terminates session in Cloudflare D1 SQL database
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  let token = "";
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.replace("Bearer ", "").trim();
  }
  if (!token) {
    const cookieHeader = request.headers.get("Cookie") || "";
    const match = cookieHeader.match(/(?:^|;\s*)crii_session=([^;]*)/);
    if (match) {
      token = decodeURIComponent(match[1]).trim();
    }
  }

  if (token) {
    if (env && env.DB) {
      try {
        await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
      } catch (e) {
        console.warn("D1 delete session error:", e);
      }
    }

    if (env && env.CRII_KV) {
      try {
        await env.CRII_KV.delete(`session:${token}`);
      } catch (e) {
        console.warn("KV delete session error:", e);
      }
    }
  }

  return new Response(JSON.stringify({ success: true, message: "Logged out successfully" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": "crii_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0"
    }
  });
}
