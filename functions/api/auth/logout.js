/**
 * Cloudflare Pages Function: /api/auth/logout
 * Terminates session in Cloudflare D1 SQL database
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "").trim();

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
    headers: { "Content-Type": "application/json" }
  });
}
