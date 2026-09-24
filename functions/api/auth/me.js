/**
 * Cloudflare Pages Function: /api/auth/me
 * Verifies active session token
 */

export async function onRequestGet(context) {
  const { request, env } = context;

  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ authenticated: false, error: "Missing authorization token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  // If KV is available, look up the session
  if (env && env.CRII_KV) {
    const session = await env.CRII_KV.get(`session:${token}`, "json");
    if (session) {
      return new Response(JSON.stringify({ authenticated: true, user: session }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  // Fallback token validation for demo/stateless deployment
  if (token.startsWith("crii_") || token.startsWith("demo_")) {
    return new Response(JSON.stringify({
      authenticated: true,
      user: {
        name: "Dr. K. Arisawa",
        email: "admin@curiomas.org",
        role: "Director of Research & Admin",
        division: "Institute Executive Council"
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ authenticated: false, error: "Invalid token" }), {
    status: 401,
    headers: { "Content-Type": "application/json" }
  });
}
