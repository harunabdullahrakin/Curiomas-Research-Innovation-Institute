/**
 * Cloudflare Pages Function: /api/auth/login
 * Autz.org SSO OAuth Verification & Cloudflare D1 SQL Session Enforcement
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json().catch(() => ({}));
    const code = (body.code || body.auth_code || "").trim();
    const appId = (body.appId || (env && env.AUTZ_APP_ID) || "gqiqh6qia").trim();

    let email = "";
    let name = "";
    let autzId = "";

    // 1. Authenticate with Autz.org API via Authorization Code Exchange
    if (code) {
      try {
        const autzUserInfoUrl = `https://autz.org/api/client/${encodeURIComponent(appId)}/userinfo?code=${encodeURIComponent(code)}`;
        const autzRes = await fetch(autzUserInfoUrl, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "User-Agent": "CRII-Institute-Cloudflare-Worker"
          }
        });

        if (autzRes.ok) {
          const autzData = await autzRes.json();
          email = (
            autzData.email ||
            (autzData.user && autzData.user.email) ||
            (autzData.data && autzData.data.email) ||
            ""
          ).toLowerCase().trim();

          name = (
            autzData.name ||
            (autzData.user && autzData.user.name) ||
            (autzData.data && autzData.data.name) ||
            (email ? email.split("@")[0] : "Researcher")
          );

          autzId = autzData.autzorg_id || autzData.id || autzData.sub || `autz_${Date.now()}`;
        } else {
          console.error("Autz.org userinfo error status:", autzRes.status);
          return new Response(JSON.stringify({
            success: false,
            error: `Autz.org verification failed (HTTP ${autzRes.status}). Please try logging in again.`
          }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        }
      } catch (err) {
        console.error("Autz.org exchange network error:", err);
        return new Response(JSON.stringify({
          success: false,
          error: "Failed to connect to Autz.org authentication service. Please check your connection."
        }), {
          status: 502,
          headers: { "Content-Type": "application/json" }
        });
      }
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing authorization code from Autz.org SSO."
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!email) {
      return new Response(JSON.stringify({
        success: false,
        error: "No verified email was returned by Autz.org."
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Strict Whitelist Check against Cloudflare D1 SQL Database & Environment
    let isAuthorized = false;
    let userRole = "Research Fellow";
    let userDivision = "Scientific Division";
    let userName = name;

    const superAdminEmail = ((env && env.ADMIN_EMAIL) || "harunabdullahrakin@gmail.com").toLowerCase().trim();
    if (email === superAdminEmail || email === "harunabdullahrakin@gmail.com") {
      isAuthorized = true;
      userRole = "Super Admin & Director";
      userDivision = "Institute Executive Council";
      userName = name || "Harun Abdullah Rakin";
    }

    // Query Cloudflare D1 Database
    if (env && env.DB) {
      try {
        const dbUser = await env.DB.prepare(
          "SELECT * FROM allowed_users WHERE LOWER(email) = LOWER(?) AND status = 'Active' LIMIT 1"
        ).bind(email).first();

        if (dbUser) {
          isAuthorized = true;
          userRole = dbUser.role || userRole;
          userDivision = dbUser.division || userDivision;
          userName = dbUser.name || userName;

          if (autzId) {
            await env.DB.prepare(
              "UPDATE allowed_users SET autzorg_id = ? WHERE LOWER(email) = LOWER(?)"
            ).bind(autzId, email).run().catch(() => {});
          }
        }
      } catch (e) {
        console.warn("Cloudflare D1 allowed_users lookup error:", e);
      }
    }

    // Fallback: check environment variable ALLOWED_EMAILS
    if (!isAuthorized && env && env.ALLOWED_EMAILS) {
      const envAllowed = env.ALLOWED_EMAILS.split(",").map(e => e.trim().toLowerCase());
      if (envAllowed.includes(email)) {
        isAuthorized = true;
      }
    }

    // If still not authorized, reject access
    if (!isAuthorized) {
      return new Response(JSON.stringify({
        success: false,
        error: `Access Denied: The account "${email}" is not authorized on the Curiomas CRII Portal. Please contact Harun Abdullah Rakin (Director) at harunabdullahrakin@gmail.com.`
      }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. Issue Session Token and Persist to Cloudflare D1 SQL
    const randomHex = crypto.randomUUID().replace(/-/g, "");
    const token = `crii_sess_${randomHex}_${Date.now()}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const sessionUser = {
      email: email,
      name: userName,
      role: userRole,
      division: userDivision,
      autzId: autzId,
      verified: true,
      authProvider: "autz.org",
      loginAt: now.toISOString()
    };

    if (env && env.DB) {
      try {
        await env.DB.prepare(
          "INSERT OR REPLACE INTO sessions (token, email, user_json, createdAt, expiresAt) VALUES (?, ?, ?, ?, ?)"
        ).bind(token, email, JSON.stringify(sessionUser), now.toISOString(), expiresAt).run();
      } catch (sessErr) {
        console.error("Cloudflare D1 session insert error:", sessErr);
      }
    }

    if (env && env.CRII_KV) {
      try {
        await env.CRII_KV.put(`session:${token}`, JSON.stringify(sessionUser), { expirationTtl: 86400 * 7 });
      } catch (kvErr) {
        console.warn("KV session store error:", kvErr);
      }
    }

    const cookieHeader = `crii_session=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`;

    return new Response(JSON.stringify({
      success: true,
      token: token,
      user: sessionUser
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookieHeader
      }
    });
  } catch (err) {
    console.error("Authentication server error:", err);
    return new Response(JSON.stringify({
      success: false,
      error: "Authentication service internal error."
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
