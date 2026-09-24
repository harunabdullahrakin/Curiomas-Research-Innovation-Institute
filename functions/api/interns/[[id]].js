/**
 * Cloudflare Pages Function: /api/interns/[[id]]
 * Handles intern applications, status updates, and researcher roster
 */

const SEED_INTERNS_DATA = {
  activeInterns: [
    {
      id: "crii-int-001",
      name: "Zainab Chowdhury",
      email: "zainab.c@curiomas.org",
      university: "Institute of Science & Technology",
      degree: "B.Sc. Biotechnology & Astrobiology",
      division: "Astrobiology & Extremophiles",
      role: "Lead Student Researcher",
      cohort: "Spring 2026",
      status: "Active",
      projects: ["Radiotrophic Fungal Shielding", "Martian Regolith Bio-leaching"],
      bio: "Passionate about fungal biotechnology and interstellar survival biology."
    },
    {
      id: "crii-int-002",
      name: "Aria Rahman",
      email: "aria.rahman@curiomas.org",
      university: "Metropolitan University of Technology",
      degree: "B.Sc. Applied Physics & Computational Science",
      division: "Astrophysics & Space Science",
      role: "Senior Research Fellow",
      cohort: "Fall 2025",
      status: "Active",
      projects: ["TRAPPIST-1e Atmospheric Retrieval", "Transit Lightcurve Deconvolution"],
      bio: "Specializes in planetary radiative transfer modeling and open astrophysics pipelines."
    }
  ],
  applications: [
    {
      id: "app-2026-101",
      fullName: "Siddharth Roy",
      email: "sid.roy@example.edu",
      university: "Global Institute of Technology",
      fieldOfStudy: "Aerospace Engineering",
      preferredDivision: "Astrophysics & Space Science",
      status: "Under Review",
      appliedDate: "2026-09-20",
      statement: "I have spent the past year building orbital mechanics simulations in Python."
    }
  ]
};

export async function onRequestGet(context) {
  const { env } = context;

  let data = SEED_INTERNS_DATA;
  if (env && env.CRII_KV) {
    const kvData = await env.CRII_KV.get("crii_interns", "json");
    if (kvData) data = kvData;
  }

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=30"
    }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const appData = await request.json();

    let data = SEED_INTERNS_DATA;
    if (env && env.CRII_KV) {
      const kvData = await env.CRII_KV.get("crii_interns", "json");
      if (kvData) data = kvData;
    }

    const newApp = {
      ...appData,
      id: `app-2026-${Math.floor(100 + Math.random() * 900)}`,
      appliedDate: new Date().toISOString().split("T")[0],
      status: "Pending"
    };

    data.applications.unshift(newApp);

    if (env && env.CRII_KV) {
      await env.CRII_KV.put("crii_interns", JSON.stringify(data));
    }

    return new Response(JSON.stringify(newApp), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to submit application" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestPatch(context) {
  const { params, request, env } = context;
  const appId = params.id ? params.id[0] : null;

  try {
    const { status } = await request.json();

    let data = SEED_INTERNS_DATA;
    if (env && env.CRII_KV) {
      const kvData = await env.CRII_KV.get("crii_interns", "json");
      if (kvData) data = kvData;
    }

    const app = data.applications.find(a => a.id === appId);
    if (!app) {
      return new Response(JSON.stringify({ error: "Application not found" }), { status: 404 });
    }

    app.status = status;

    if (status === "Accepted") {
      data.activeInterns.push({
        id: `crii-int-${Date.now().toString().slice(-4)}`,
        name: app.fullName,
        email: app.email,
        university: app.university,
        degree: app.fieldOfStudy,
        division: app.preferredDivision,
        role: "Research Intern",
        cohort: "Upcoming Cohort",
        status: "Active",
        projects: ["Onboarding Research Track"],
        bio: app.statement ? app.statement.slice(0, 140) + "..." : "Student Researcher at CRII"
      });
    }

    if (env && env.CRII_KV) {
      await env.CRII_KV.put("crii_interns", JSON.stringify(data));
    }

    return new Response(JSON.stringify(app), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to update status" }), { status: 400 });
  }
}
