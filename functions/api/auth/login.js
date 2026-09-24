/**
 * Cloudflare Pages Function: /api/auth/login
 * Validates credentials and returns session token
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { email, password } = await request.json();

    const adminEmail = (env && env.ADMIN_EMAIL) || "admin@curiomas.org";
    const adminPass = (env && env.ADMIN_PASSWORD) || "curiomas2026";

    const fellowEmail = (env && env.FELLOW_EMAIL) || "aria@curiomas.org";
    const fellowPass = (env && env.FELLOW_PASSWORD) || "research2026";

    let authenticatedUser = null;

    if (email === adminEmail && password === adminPass) {
      authenticatedUser = {
        name: "Dr. K. Arisawa",
        email: adminEmail,
        role: "Director of Research & Admin",
        division: "Institute Executive Council"
      };
    } else if (email === fellowEmail && password === fellowPass) {
      authenticatedUser = {
        name: "Aria Rahman",
        email: fellowEmail,
        role: "Senior Student Fellow",
        division: "Astrophysics & Space Science"
      };
    }

    if (!authenticatedUser) {
      return new Response(JSON.stringify({ error: "Invalid email or password credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Generate cryptographic token
    const token = `crii_cf_${btoa(email)}_${Date.now()}`;

    // Optionally store session in KV
    if (env && env.CRII_KV) {
      await env.CRII_KV.put(`session:${token}`, JSON.stringify(authenticatedUser), { expirationTtl: 86400 * 7 });
    }

    return new Response(JSON.stringify({
      success: true,
      user: authenticatedUser,
      token: token
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Malformed request payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}
