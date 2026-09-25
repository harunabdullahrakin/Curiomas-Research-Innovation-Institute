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
  },
  {
    id: "team-002",
    name: "Aria Rahman",
    email: "aria.rahman@curiomas.org",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    university: "Metropolitan University of Technology",
    degree: "B.Sc. Applied Physics",
    division: "Space & Astrophysics",
    role: "Principal Fellow — Astrophysics",
    cohort: "Founding",
    status: "Active",
    bio: "Lead investigator on terrestrial exoplanet atmospheres and spectroscopic synthetic retrieval models.",
    socials: { github: "https://github.com", linkedin: "https://linkedin.com" },
    projects: ["TRAPPIST-1e Atmospheric Retrieval"],
    isTeamMember: true,
    orderIndex: 2
  },
  {
    id: "team-003",
    name: "Zainab Chowdhury",
    email: "zainab.c@curiomas.org",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    university: "Institute of Science & Technology",
    degree: "B.Sc. Biotechnology",
    division: "Astrobiology & Extremophiles",
    role: "Principal Fellow — Astrobiology",
    cohort: "Founding",
    status: "Active",
    bio: "Specializing in radiotrophic fungal biology, extremophile metabolic pathways, and deep-time biochemical resilience.",
    socials: { github: "https://github.com", linkedin: "https://linkedin.com" },
    projects: ["Extremophile Enzyme Stabilization"],
    isTeamMember: true,
    orderIndex: 3
  },
  {
    id: "int-001",
    name: "Kenji Takahashi",
    email: "kenji.t@curiomas.org",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    university: "Tokyo Institute of Technology",
    degree: "M.Sc. Computational Biology",
    division: "AI & Computational Science",
    role: "Research Fellow",
    cohort: "Spring 2026",
    status: "Active",
    bio: "Developing equivariant graph neural networks for thermostable enzyme design inspired by hydrothermal vent microbes.",
    socials: { github: "https://github.com" },
    projects: ["DeepVent Graph Networks"],
    isTeamMember: false,
    orderIndex: 4
  },
  {
    id: "int-002",
    name: "Maya Lin-Cruz",
    email: "maya.l@curiomas.org",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    university: "National University",
    degree: "B.Sc. Evolutionary Genomics",
    division: "Ancient Biology & Paleontology",
    role: "Research Fellow",
    cohort: "Spring 2026",
    status: "Active",
    bio: "Reassessing Cambrian explosion chronologies through Bayesian relaxed molecular clocks and fossil calibrations.",
    socials: { github: "https://github.com" },
    projects: ["Ediacaran Divergence Rates"],
    isTeamMember: false,
    orderIndex: 5
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

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const teamOnly = url.searchParams.get("team") === "true";

  if (env && env.DB) {
    try {
      let query = "SELECT * FROM interns";
      if (teamOnly) {
        query += " WHERE isTeamMember = 1";
      }
      query += " ORDER BY isTeamMember DESC, orderIndex ASC, name ASC";
      const { results: interns } = await env.DB.prepare(query).all();

      const { results: applications } = await env.DB.prepare(
        "SELECT * FROM applications ORDER BY appliedDate DESC"
      ).all();

      return new Response(JSON.stringify({
        activeInterns: (interns || []).map(formatInternRow),
        applications: applications || []
      }), {
        headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=30" }
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
  const isApply = params.id && params.id[0] === "apply";

  try {
    const data = await request.json();

    // Application submission
    if (isApply) {
      const app = {
        id: `app-${Date.now()}`,
        fullName: data.fullName || "Anonymous Applicant",
        email: data.email || "",
        university: data.university || "",
        fieldOfStudy: data.fieldOfStudy || "",
        preferredDivision: data.preferredDivision || "General Science",
        status: "Under Review",
        appliedDate: new Date().toISOString().split("T")[0],
        statement: data.statement || ""
      };

      if (env && env.DB) {
        await env.DB.prepare(`
          INSERT INTO applications (id, fullName, email, university, fieldOfStudy, preferredDivision, status, appliedDate, statement)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          app.id, app.fullName, app.email, app.university,
          app.fieldOfStudy, app.preferredDivision, app.status,
          app.appliedDate, app.statement
        ).run();
      }

      return new Response(JSON.stringify({ success: true, application: app }), {
        status: 201,
        headers: { "Content-Type": "application/json" }
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
  const { params, env } = context;
  const id = params.id ? params.id[0] : null;

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400 });
  }

  if (env && env.DB) {
    try {
      await env.DB.prepare("DELETE FROM interns WHERE id = ?").bind(id).run();
      await env.DB.prepare("DELETE FROM applications WHERE id = ?").bind(id).run();
    } catch (e) {
      console.error("D1 delete error:", e);
    }
  }

  return new Response(JSON.stringify({ success: true, id }), {
    headers: { "Content-Type": "application/json" }
  });
}
