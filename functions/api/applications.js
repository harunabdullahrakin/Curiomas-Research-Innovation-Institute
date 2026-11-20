async function ensureTable(db) {
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
      packageId TEXT,
      packageName TEXT,
      packageFee TEXT,
      paymentRef TEXT,
      paymentReceiptUrl TEXT,
      recruitPageSlug TEXT,
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
  await db.prepare("ALTER TABLE applications ADD COLUMN packageId TEXT").run().catch(() => {});
  await db.prepare("ALTER TABLE applications ADD COLUMN packageName TEXT").run().catch(() => {});
  await db.prepare("ALTER TABLE applications ADD COLUMN packageFee TEXT").run().catch(() => {});
  await db.prepare("ALTER TABLE applications ADD COLUMN paymentRef TEXT").run().catch(() => {});
  await db.prepare("ALTER TABLE applications ADD COLUMN paymentReceiptUrl TEXT").run().catch(() => {});
  await db.prepare("ALTER TABLE applications ADD COLUMN recruitPageSlug TEXT").run().catch(() => {});
}

async function checkValueExistsInDb(db, fieldKey, value, isCustom) {
  if (!db || !fieldKey) return false;
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return false;

  await ensureTable(db);
  const { results } = await db.prepare("SELECT email, university, portfolioUrl, paymentRef, customFields_json FROM applications").all();
  const rows = results || [];

  for (const row of rows) {
    if (!isCustom) {
      if (fieldKey === "email" && String(row.email || "").trim().toLowerCase() === normalized) return true;
      if (fieldKey === "portfolio" && String(row.portfolioUrl || "").trim().toLowerCase() === normalized) return true;
      if (fieldKey === "paymentRef" && String(row.paymentRef || "").trim().toLowerCase() === normalized) return true;
    } else if (row.customFields_json) {
      try {
        const parsed = JSON.parse(row.customFields_json);
        if (parsed && typeof parsed === "object") {
          const existingVal = parsed[fieldKey];
          if (existingVal !== undefined && String(existingVal).trim().toLowerCase() === normalized) {
            return true;
          }
        }
      } catch (e) {}
    }
  }

  if (!isCustom && fieldKey === "email") {
    try {
      const internMatch = await db.prepare("SELECT id FROM interns WHERE LOWER(email) = ? LIMIT 1").bind(normalized).first();
      if (internMatch) return true;
    } catch (e) {}
  }

  return false;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  if (action === "check_unique") {
    const fieldKey = url.searchParams.get("fieldKey") || "";
    const value = url.searchParams.get("value") || "";
    const isCustom = url.searchParams.get("isCustom") === "1";

    if (!fieldKey || !value.trim()) {
      return new Response(JSON.stringify({ success: true, exists: false, unique: true }), {
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
      });
    }

    let exists = false;
    if (env && env.DB) {
      try {
        exists = await checkValueExistsInDb(env.DB, fieldKey, value, isCustom);
      } catch (e) {}
    }

    return new Response(JSON.stringify({ success: true, exists, unique: !exists, fieldKey }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  }

  if (env && env.DB) {
    try {
      await ensureTable(env.DB);
      const { results } = await env.DB.prepare("SELECT * FROM applications ORDER BY appliedDate DESC").all();
      return new Response(JSON.stringify({
        success: true,
        applications: results || []
      }), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      });
    } catch (e) {
      console.error("D1 applications get error:", e);
    }
  }

  return new Response(JSON.stringify({ success: true, applications: [] }), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();

    if (env && env.DB && Array.isArray(data.uniqueChecks) && data.uniqueChecks.length > 0) {
      for (const chk of data.uniqueChecks) {
        if (!chk || !chk.fieldKey || !chk.value) continue;
        const dup = await checkValueExistsInDb(env.DB, chk.fieldKey, chk.value, Boolean(chk.isCustom));
        if (dup) {
          return new Response(JSON.stringify({
            error: `"${chk.label || chk.fieldKey}" value is already registered and must be unique.`,
            duplicateField: chk.fieldKey
          }), {
            status: 409,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }

    const app = {
      id: data.id || `app-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      fullName: (data.fullName || "Fellow Applicant").trim(),
      email: (data.email || "").trim(),
      university: (data.university || "").trim(),
      fieldOfStudy: (data.fieldOfStudy || "").trim(),
      preferredDivision: (data.preferredDivision || "General Science").trim(),
      academicLevel: (data.academicLevel || data.appLevel || "").trim(),
      portfolioUrl: (data.portfolioUrl || data.portfolio || "").trim(),
      customFields_json: JSON.stringify(data.customFields || {}),
      packageId: (data.packageId || "").trim(),
      packageName: (data.packageName || "").trim(),
      packageFee: (data.packageFee || "").trim(),
      paymentRef: (data.paymentRef || "").trim(),
      paymentReceiptUrl: (data.paymentReceiptUrl || "").trim(),
      recruitPageSlug: (data.recruitPageSlug || "").trim(),
      status: data.status || "Under Review",
      appliedDate: data.appliedDate || new Date().toISOString().split("T")[0],
      statement: (data.statement || "").trim()
    };

    if (env && env.DB) {
      await ensureTable(env.DB);

      await env.DB.prepare(`
        INSERT INTO applications (
          id, fullName, email, university, fieldOfStudy, preferredDivision,
          academicLevel, portfolioUrl, customFields_json, packageId, packageName,
          packageFee, paymentRef, paymentReceiptUrl, recruitPageSlug, status, appliedDate, statement
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          fullName=excluded.fullName,
          email=excluded.email,
          university=excluded.university,
          fieldOfStudy=excluded.fieldOfStudy,
          preferredDivision=excluded.preferredDivision,
          academicLevel=excluded.academicLevel,
          portfolioUrl=excluded.portfolioUrl,
          customFields_json=excluded.customFields_json,
          packageId=excluded.packageId,
          packageName=excluded.packageName,
          packageFee=excluded.packageFee,
          paymentRef=excluded.paymentRef,
          paymentReceiptUrl=excluded.paymentReceiptUrl,
          recruitPageSlug=excluded.recruitPageSlug,
          status=excluded.status,
          statement=excluded.statement;
      `).bind(
        app.id, app.fullName, app.email, app.university, app.fieldOfStudy,
        app.preferredDivision, app.academicLevel, app.portfolioUrl,
        app.customFields_json, app.packageId, app.packageName, app.packageFee,
        app.paymentRef, app.paymentReceiptUrl, app.recruitPageSlug,
        app.status, app.appliedDate, app.statement
      ).run();

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
      } catch (err) {
        console.warn("Application backup store note:", err);
      }
    }

    return new Response(JSON.stringify({ success: true, application: app }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (err) {
    console.error("D1 application submit error:", err);
    return new Response(JSON.stringify({ error: err.message || "Failed to submit application" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestPut(context) {
  const { request, env } = context;
  try {
    const data = await request.json();
    const { id, status, reviewedBy, role, division, grantLoginAccess, addToRoster } = data;
    if (!id || !status) {
      return new Response(JSON.stringify({ error: "Missing application id or status" }), { status: 400 });
    }

    const reviewedAt = new Date().toISOString();
    let updatedApp = null;

    if (env && env.DB) {
      await ensureTable(env.DB);
      await env.DB.prepare(`
        UPDATE applications
        SET status = ?, reviewedBy = ?, reviewedAt = ?
        WHERE id = ?
      `).bind(status, reviewedBy || "Admin", reviewedAt, id).run();

      updatedApp = await env.DB.prepare("SELECT * FROM applications WHERE id = ?").bind(id).first();

      if (status === 'Accepted' && updatedApp && updatedApp.email) {
        const assignedRole = (role || "Research Fellow").trim();
        const assignedDivision = (division || updatedApp.preferredDivision || "Institute Research Council").trim();
        const applicantName = (updatedApp.fullName || updatedApp.email.split('@')[0]).trim();
        const applicantEmail = updatedApp.email.toLowerCase().trim();

        if (grantLoginAccess !== false) {
          try {
            await env.DB.prepare(`
              CREATE TABLE IF NOT EXISTS allowed_users (
                email TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'Research Fellow',
                division TEXT DEFAULT 'Institute Research Council',
                status TEXT NOT NULL DEFAULT 'Active',
                addedDate TEXT NOT NULL,
                autzorg_id TEXT
              )
            `).run().catch(() => {});

            await env.DB.prepare(`
              INSERT INTO allowed_users (email, name, role, division, status, addedDate)
              VALUES (?, ?, ?, ?, 'Active', ?)
              ON CONFLICT(email) DO UPDATE SET
                name = excluded.name,
                role = excluded.role,
                division = excluded.division,
                status = 'Active';
            `).bind(applicantEmail, applicantName, assignedRole, assignedDivision, new Date().toISOString().split("T")[0]).run();
          } catch (err) {
            console.warn("Failed to auto-provision allowed_users for accepted fellow:", err);
          }
        }

        if (addToRoster !== false) {
          try {
            const internId = `fellow-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
            await env.DB.prepare(`
              INSERT INTO interns (
                id, name, email, university, degree, division, role, cohort,
                status, bio, socials_json, projects_json, isTeamMember, orderIndex
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?, '{}', '[]', 0, 99)
              ON CONFLICT(id) DO NOTHING;
            `).bind(
              internId, applicantName, applicantEmail,
              updatedApp.university || "Independent Research",
              updatedApp.fieldOfStudy || "Fellow Researcher",
              assignedDivision, assignedRole,
              "Research Fellow " + new Date().getFullYear(),
              updatedApp.statement || "Autonomous fellow researching with CRII."
            ).run().catch(() => {});
          } catch (err) {
            console.warn("Failed to add accepted fellow to interns table:", err);
          }
        }
      }

      if ((status === 'Declined' || status === 'Rejected') && updatedApp && updatedApp.email) {
        try {
          await env.DB.prepare("UPDATE allowed_users SET status = 'Disabled' WHERE LOWER(email) = LOWER(?)").bind(updatedApp.email).run().catch(() => {});
        } catch (e) {}
      }
    }

    return new Response(JSON.stringify({
      success: true,
      id,
      status,
      application: updatedApp
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

export async function onRequestDelete(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  let id = url.searchParams.get("id");

  if (!id) {
    try {
      const body = await request.json();
      id = body.id;
    } catch (e) {}
  }

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing application ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (env && env.DB) {
    try {
      await ensureTable(env.DB);
      await env.DB.prepare("DELETE FROM applications WHERE id = ?").bind(id).run();

      try {
        const storeRow = await env.DB.prepare("SELECT value_json FROM settings WHERE key = 'applications_store'").first();
        if (storeRow && storeRow.value_json) {
          let list = JSON.parse(storeRow.value_json);
          if (Array.isArray(list)) {
            list = list.filter(item => item.id !== id);
            await env.DB.prepare("UPDATE settings SET value_json = ?, updatedAt = ? WHERE key = 'applications_store'").bind(JSON.stringify(list), new Date().toISOString()).run();
          }
        }
      } catch (e) {}
    } catch (e) {
      console.error("D1 application delete error:", e);
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
