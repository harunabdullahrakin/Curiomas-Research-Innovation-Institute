/**
 * Cloudflare Pages Function: /api/interns/[[id]]
 * Relational SQL CRUD operations for interns, fellows, and core team members via Cloudflare D1
 */

const SEED_INTERNS = [
  {
    id: "team-001",
    name: "Harun Abdullah Rakin",
    email: "harunabdullahrakin@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    university: "CRII Council",
    degree: "Director of Research",
    division: "Executive Council",
    role: "Super Admin & Lead Investigator",
    cohort: "Founding",
    status: "Active",
    bio: "Pioneering open computational science, astrophysical synthetic models, and multi-agent systems for student discovery.",
    socials: { github: "https://github.com/harunabdullahrakin", linkedin: "https://linkedin.com", email: "harunabdullahrakin@gmail.com" },
    projects: ["CRII Computational Core", "Autonomous Research Pipelines"],
    isTeamMember: true,
    orderIndex: 1
  }
];

function formatInternRow(row) {
  if (!row) return null;
  return {
    ...row,
    socials: safeJsonParse(row.socials_json, {}),
    projects: safeJsonParse(row.projects_json, []),
    isTeamMember: Boolean(row.isTeamMember)
  };
}

function safeJsonParse(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

async function ensureAppTable(db) {
  if (!db) return;
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL,
      university TEXT,
      fieldOfStudy TEXT,
      preferredDivision TEXT,
      academicLevel TEXT,
      portfolioUrl TEXT,
      customFields_json TEXT,
      status TEXT NOT NULL DEFAULT 'Under Review',
      appliedDate TEXT NOT NULL,
      statement TEXT,
      reviewedBy TEXT,
      reviewedAt TEXT
    )
  `).run().catch(() => {});
  await db.prepare("ALTER TABLE applications ADD COLUMN academicLevel TEXT").run().catch(() => {});
  await db.prepare("ALTER TABLE applications ADD COLUMN portfolioUrl TEXT").run().catch(() => {});
  await db.prepare("ALTER TABLE applications ADD COLUMN customFields_json TEXT").run().catch(() => {});
}

async function ensureInternsTable(db) {
  if (!db) return;
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS interns (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        avatar TEXT,
        university TEXT,
        degree TEXT,
        division TEXT NOT NULL,
        role TEXT NOT NULL,
        cohort TEXT,
        status TEXT NOT NULL DEFAULT 'Active',
        bio TEXT,
        socials_json TEXT DEFAULT '{}',
        projects_json TEXT DEFAULT '[]',
        isTeamMember INTEGER NOT NULL DEFAULT 0,
        orderIndex INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT,
        updatedAt TEXT
      )
    `).run().catch(() => {});
    await db.prepare("CREATE INDEX IF NOT EXISTS idx_interns_status ON interns(status)").run().catch(() => {});
    await db.prepare("CREATE INDEX IF NOT EXISTS idx_interns_team ON interns(isTeamMember)").run().catch(() => {});
  } catch (e) {}
}

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const teamOnly = url.searchParams.get("team") === "true";

  if (env && env.DB) {
    try {
      await ensureAppTable(env.DB);
      await ensureInternsTable(env.DB);
      let query = "SELECT * FROM interns";
      if (teamOnly) {
        query += " WHERE isTeamMember = 1";
      }
      query += " ORDER BY isTeamMember DESC, orderIndex ASC, name ASC";
      let { results: interns } = await env.DB.prepare(query).all();
      if (!interns) interns = [];

      let applications = [];
      try {
        const appRes = await env.DB.prepare("SELECT * FROM applications ORDER BY appliedDate DESC").all();
        applications = appRes.results || [];
      } catch (e) {
        // Fallback to settings store if needed
        try {
          const row = await env.DB.prepare("SELECT value_json FROM settings WHERE key = 'applications_store'").first();
          if (row && row.value_json) applications = JSON.parse(row.value_json);
        } catch(err){}
      }

      return new Response(JSON.stringify({
        activeInterns: (interns || []).map(formatInternRow),
        applications: applications || []
      }), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      });
    } catch (e) {
      console.error("D1 Interns error:", e);
    }
  }

  // Fallback to in-memory seeds
  return new Response(JSON.stringify({
    activeInterns: SEED_INTERNS,
    applications: []
  }), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequestPost(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const isApply = (params.id && params.id[0] === "apply") || url.pathname.endsWith("/apply");

  try {
    const data = await request.json();

    // Application submission
    if (isApply) {
      const app = {
        id: data.id || `app-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        fullName: (data.fullName || "Anonymous Applicant").trim(),
        email: (data.email || "").trim(),
        university: (data.university || "").trim(),
        fieldOfStudy: (data.fieldOfStudy || "").trim(),
        preferredDivision: (data.preferredDivision || "General Science").trim(),
        academicLevel: (data.academicLevel || data.appLevel || "").trim(),
        portfolioUrl: (data.portfolioUrl || data.portfolio || "").trim(),
        customFields_json: JSON.stringify(data.customFields || {}),
        status: data.status || "Under Review",
        appliedDate: data.appliedDate || new Date().toISOString().split("T")[0],
        statement: (data.statement || "").trim()
      };

      if (env && env.DB) {
        await ensureAppTable(env.DB);
        await env.DB.prepare(`
          INSERT INTO applications (
            id, fullName, email, university, fieldOfStudy, preferredDivision,
            academicLevel, portfolioUrl, customFields_json, status, appliedDate, statement
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            fullName=excluded.fullName,
            email=excluded.email,
            university=excluded.university,
            fieldOfStudy=excluded.fieldOfStudy,
            preferredDivision=excluded.preferredDivision,
            academicLevel=excluded.academicLevel,
            portfolioUrl=excluded.portfolioUrl,
            customFields_json=excluded.customFields_json,
            status=excluded.status,
            statement=excluded.statement;
        `).bind(
          app.id, app.fullName, app.email, app.university,
          app.fieldOfStudy, app.preferredDivision, app.academicLevel,
          app.portfolioUrl, app.customFields_json, app.status,
          app.appliedDate, app.statement
        ).run();

        // Backup in settings table
        try {
          const storeRow = await env.DB.prepare("SELECT value_json FROM settings WHERE key = 'applications_store'").first();
          let list = [];
          if (storeRow && storeRow.value_json) {
            try { list = JSON.parse(storeRow.value_json); } catch(e){}
          }
          if (!Array.isArray(list)) list = [];
          list = list.filter(item => item.id !== app.id);
          list.unshift(app);
          await env.DB.prepare(`
            INSERT INTO settings (key, value_json, updatedAt, updatedBy)
            VALUES ('applications_store', ?, ?, 'System')
            ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json, updatedAt=excluded.updatedAt;
          `).bind(JSON.stringify(list.slice(0, 500)), new Date().toISOString()).run();
        } catch(e){}
      }

      return new Response(JSON.stringify({ success: true, application: app }), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      });
    }

    // Upsert Intern or Core Team Member
    const id = data.id || `crii-fellow-${Date.now()}`;
    const name = data.name || "Fellow Researcher";
    const email = data.email || "";
    const avatar = data.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
    const university = data.university || "";
    const degree = data.degree || "";
    const division = data.division || "Space & Astrophysics";
    const role = data.role || "Research Fellow";
    const cohort = data.cohort || "Spring 2026";
    const status = data.status || "Active";
    const bio = data.bio || "";
    const socialsJson = JSON.stringify(data.socials || {});
    const projectsJson = JSON.stringify(Array.isArray(data.projects) ? data.projects : []);
    const isTeamMember = data.isTeamMember ? 1 : 0;
    const orderIndex = Number(data.orderIndex) || 10;
    const nowIso = new Date().toISOString();

    if (env && env.DB) {
      await ensureInternsTable(env.DB);
      const sql = `
        INSERT INTO interns (
          id, name, email, avatar, university, degree, division, role,
          cohort, status, bio, socials_json, projects_json, isTeamMember, orderIndex, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name=excluded.name,
          email=excluded.email,
          avatar=excluded.avatar,
          university=excluded.university,
          degree=excluded.degree,
          division=excluded.division,
          role=excluded.role,
          cohort=excluded.cohort,
          status=excluded.status,
          bio=excluded.bio,
          socials_json=excluded.socials_json,
          projects_json=excluded.projects_json,
          isTeamMember=excluded.isTeamMember,
          orderIndex=excluded.orderIndex,
          updatedAt=excluded.updatedAt;
      `;
      await env.DB.prepare(sql).bind(
        id, name, email, avatar, university, degree, division, role,
        cohort, status, bio, socialsJson, projectsJson, isTeamMember, orderIndex, nowIso, nowIso
      ).run();
    }

    const saved = {
      ...data,
      id,
      name,
      email,
      avatar,
      university,
      degree,
      division,
      role,
      cohort,
      status,
      bio,
      isTeamMember: Boolean(isTeamMember),
      orderIndex
    };

    return new Response(JSON.stringify(saved), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Failed to process intern/application:", err);
    return new Response(JSON.stringify({ error: err.message || "Failed to process request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestDelete(context) {
  const { params, request, env } = context;
  
  let id = null;
  if (params && params.id) {
    id = Array.isArray(params.id) ? params.id.join('/') : String(params.id);
  }
  if (!id) {
    const url = new URL(request.url);
    id = url.searchParams.get("id");
  }
  if (!id) {
    try {
      const body = await request.json();
      id = body.id;
    } catch (e) {}
  }

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing fellow or intern ID" }), { 
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (env && env.DB) {
    try {
      // Find candidate email first to revoke from allowed_users if granted
      let targetEmail = null;
      try {
        const row = await env.DB.prepare("SELECT email FROM interns WHERE id = ?").bind(id).first();
        if (row && row.email) targetEmail = row.email;
      } catch (e) {}

      // Delete from interns and applications tables
      await env.DB.prepare("DELETE FROM interns WHERE id = ?").bind(id).run();
      await env.DB.prepare("DELETE FROM applications WHERE id = ?").bind(id).run();

      // Revoke login permission if email existed
      if (targetEmail) {
        try {
          await env.DB.prepare("DELETE FROM allowed_users WHERE email = ?").bind(targetEmail).run();
        } catch (e) {}
      }
    } catch (e) {
      console.error("D1 delete error:", e);
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return new Response(JSON.stringify({ success: true, id }), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
