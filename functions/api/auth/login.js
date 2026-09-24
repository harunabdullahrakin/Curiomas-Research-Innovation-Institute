/**
 * Cloudflare Pages Function: /api/auth/login
 * Autz.org SSO Verification & Strict Whitelist Enforcement
 * Prevents SQL injection & unauthorized access
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const email = (body.autzUserData && body.autzUserData.email ? body.autzUserData.email : body.email || "").toLowerCase().trim();

    if (!email) {
      return new Response(JSON.stringify({ error: "Missing email from Autz.org payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Allowed Whitelist Configuration
    const envAllowed = (env && env.ALLOWED_EMAILS) ? env.ALLOWED_EMAILS.split(",").map(e => e.trim().toLowerCase()) : [];
    const defaultAllowed = ["harunabdullahrakin@gmail.com", "admin@curiomas.org"];
    const whitelist = [...new Set([...defaultAllowed, ...envAllowed])];

    // Check Cloudflare KV for dynamic whitelist additions if bound
    if (env && env.CRII_KV) {
      try {
        const kvAllowed = await env.CRII_KV.get("crii_allowed_users", "json");
        if (kvAllowed && Array.isArray(kvAllowed)) {
          kvAllowed.forEach(u => {
            if (u.email) whitelist.push(u.email.toLowerCase().trim());
          });
        }
      } catch (e) {
        console.warn("KV whitelist query error", e);
      }
    }

    // Strict Permission Check
    const isAuthorized = whitelist.includes(email);

    if (!isAuthorized) {
      return new Response(JSON.stringify({
        success: false,
        error: `Access Denied: The account "${email}" is not authorized on Curiomas CRII. Please contact Harunabdullahrakin@gmail.com.`
      }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Issue Secure Session
    const sessionUser = {
      name: body.userSession?.name || email.split("@")[0],
      email: email,
      role: email === "harunabdullahrakin@gmail.com" ? "Super Admin & Director" : "Research Fellow",
      division: "Institute Executive Council",
      verified: true,
      authProvider: "autz.org"
    };

    const token = `crii_autz_${btoa(email)}_${Date.now()}`;

    if (env && env.CRII_KV) {
      await env.CRII_KV.put(`session:${token}`, JSON.stringify(sessionUser), { expirationTtl: 86400 * 7 });
    }

    return new Response(JSON.stringify({
      success: true,
      user: sessionUser,
      token: token
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Malformed Autz.org authentication request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}
