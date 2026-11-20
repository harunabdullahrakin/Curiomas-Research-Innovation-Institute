function jsonResp(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

function safeJsonParse(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

async function safeAddColumn(db, table, colDef) {
  try {
    await db.prepare(`ALTER TABLE ${table} ADD COLUMN ${colDef}`).run();
  } catch (e) {}
}

async function ensureAcademicsTables(db) {
  await db.batch([
    db.prepare(`
      CREATE TABLE IF NOT EXISTS academics_meta (
        k TEXT PRIMARY KEY,
        v TEXT NOT NULL
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS academics_classes (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        shortName TEXT,
        level TEXT,
        description TEXT,
        badge TEXT,
        accentColor TEXT DEFAULT '#ea580c',
        displayOrder INTEGER DEFAULT 0,
        accessTier TEXT DEFAULT 'public',
        packageId TEXT DEFAULT '',
        createdAt TEXT
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS academics_divisions (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        icon TEXT DEFAULT 'book',
        description TEXT DEFAULT '',
        accentColor TEXT DEFAULT '#ea580c',
        displayOrder INTEGER DEFAULT 0,
        createdAt TEXT
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS academics_subjects (
        id TEXT PRIMARY KEY,
        classId TEXT NOT NULL,
        name TEXT NOT NULL,
        code TEXT,
        icon TEXT DEFAULT 'book',
        description TEXT,
        chaptersJson TEXT DEFAULT '[]',
        displayOrder INTEGER DEFAULT 0,
        accessTier TEXT DEFAULT 'public',
        packageId TEXT DEFAULT '',
        createdAt TEXT
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS academics_mcqs (
        id TEXT PRIMARY KEY,
        classId TEXT NOT NULL,
        subjectId TEXT NOT NULL,
        divisionId TEXT DEFAULT 'div_academics',
        chapter TEXT DEFAULT 'General',
        question TEXT NOT NULL,
        optionsJson TEXT NOT NULL,
        correctIndex INTEGER NOT NULL DEFAULT 0,
        explanation TEXT DEFAULT '',
        boardTag TEXT DEFAULT '',
        difficulty TEXT DEFAULT 'Medium',
        imageUrl TEXT DEFAULT '',
        accessTier TEXT DEFAULT 'public',
        packageId TEXT DEFAULT '',
        createdAt TEXT
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS academics_cqs (
        id TEXT PRIMARY KEY,
        classId TEXT NOT NULL,
        subjectId TEXT NOT NULL,
        divisionId TEXT DEFAULT 'div_academics',
        chapter TEXT DEFAULT 'General',
        title TEXT DEFAULT '',
        boardTag TEXT DEFAULT '',
        stem TEXT NOT NULL,
        imageUrl TEXT DEFAULT '',
        partA TEXT NOT NULL,
        ansA TEXT DEFAULT '',
        partB TEXT NOT NULL,
        ansB TEXT DEFAULT '',
        partC TEXT NOT NULL,
        ansC TEXT DEFAULT '',
        partD TEXT NOT NULL,
        ansD TEXT DEFAULT '',
        accessTier TEXT DEFAULT 'public',
        packageId TEXT DEFAULT '',
        createdAt TEXT
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS academics_notes (
        id TEXT PRIMARY KEY,
        classId TEXT NOT NULL,
        subjectId TEXT NOT NULL,
        divisionId TEXT DEFAULT 'div_books',
        chapter TEXT DEFAULT 'General',
        title TEXT NOT NULL,
        resourceType TEXT DEFAULT 'note',
        summary TEXT DEFAULT '',
        content TEXT DEFAULT '',
        fileUrl TEXT DEFAULT '',
        videoUrl TEXT DEFAULT '',
        accessTier TEXT DEFAULT 'public',
        packageId TEXT DEFAULT '',
        createdAt TEXT
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS academics_enrollments (
        id TEXT PRIMARY KEY,
        subjectId TEXT NOT NULL,
        subjectName TEXT DEFAULT '',
        studentName TEXT NOT NULL,
        studentEmail TEXT NOT NULL,
        studentPhone TEXT DEFAULT '',
        college TEXT DEFAULT '',
        paymentMethod TEXT DEFAULT 'bKash',
        trxId TEXT DEFAULT '',
        amount REAL DEFAULT 0,
        status TEXT DEFAULT 'pending',
        createdAt TEXT
      )
    `)
  ]);

  const sharedCourseCols = [
    "imageUrl TEXT DEFAULT ''",
    "price REAL DEFAULT 0",
    "originalPrice REAL DEFAULT 0",
    "studentCount INTEGER DEFAULT 0",
    "badgeText TEXT DEFAULT 'HSC'",
    "includedCoursesJson TEXT DEFAULT '[]'",
    "instructorsJson TEXT DEFAULT '[]'",
    "featuresJson TEXT DEFAULT '[]'",
    "faqJson TEXT DEFAULT '[]'",
    "paymentInstructions TEXT DEFAULT ''",
    "enrollPhone TEXT DEFAULT ''",
    "accessCode TEXT DEFAULT ''"
  ];
  for (const col of sharedCourseCols) {
    await safeAddColumn(db, "academics_classes", col);
    await safeAddColumn(db, "academics_subjects", col);
  }
  await safeAddColumn(db, "academics_mcqs", "divisionId TEXT DEFAULT 'div_academics'");
  await safeAddColumn(db, "academics_cqs", "divisionId TEXT DEFAULT 'div_academics'");
  await safeAddColumn(db, "academics_notes", "divisionId TEXT DEFAULT 'div_books'");
}

async function seedHscOnce(db) {
  const flag = await db.prepare("SELECT v FROM academics_meta WHERE k = 'hsc_v3_seeded'").first();
  if (flag && flag.v === "1") return;

  const now = new Date().toISOString();
  const defaultFeatures = JSON.stringify([
    "All 13 HSC Science & General Subjects in One Hub",
    "Academics, Books, Medical, BUET & College Question Banks",
    "Automated Timed MCQ Exam Engine with Negative Marking",
    "Structured 4-Part Creative Questions (CQ) with Model Answers",
    "Full Offline Question Bank Sync & Local Exam Tracking"
  ]);
  const defaultFaq = JSON.stringify([
    { q: "Can I take MCQ exams offline?", a: "Yes. Once loaded or synced, all questions, CQs, and exam results work offline via local storage and our PWA engine." },
    { q: "Which subjects are included in HSC?", a: "Bangla 1st & 2nd, English 1st & 2nd, Higher Math 1st & 2nd, Biology 1st & 2nd, Chemistry 1st & 2nd, Physics 1st & 2nd, and ICT." },
    { q: "How do paid courses unlock?", a: "Submit your payment TrxID through the enrollment form or enter your institute access code to unlock immediately." }
  ]);

  await db.prepare(`
    INSERT INTO academics_classes (
      id, slug, name, shortName, level, description, badge, accentColor, displayOrder, accessTier, packageId, createdAt,
      imageUrl, price, originalPrice, studentCount, badgeText, featuresJson, faqJson
    )
    VALUES (
      'cls_hsc', 'hsc', 'HSC Academic Program', 'HSC', 'Higher Secondary',
      'Complete HSC preparation covering all 13 subjects with Academics, Books, BUET, Medical, and Top College MCQ & CQ question banks.',
      'HSC', '#ea580c', 1, 'public', '', ?,
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
      0, 0, 4820, 'HSC', ?, ?
    )
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      shortName = excluded.shortName,
      description = excluded.description,
      badge = excluded.badge,
      imageUrl = CASE WHEN academics_classes.imageUrl = '' OR academics_classes.imageUrl IS NULL THEN excluded.imageUrl ELSE academics_classes.imageUrl END,
      featuresJson = CASE WHEN academics_classes.featuresJson = '[]' OR academics_classes.featuresJson IS NULL THEN excluded.featuresJson ELSE academics_classes.featuresJson END,
      faqJson = CASE WHEN academics_classes.faqJson = '[]' OR academics_classes.faqJson IS NULL THEN excluded.faqJson ELSE academics_classes.faqJson END
  `).bind(now, defaultFeatures, defaultFaq).run();

  const divOrder = [
    ["div_academics", "academics", "Academics", "graduation", "Board syllabus & chapter-wise standard questions.", "#ea580c", 1],
    ["div_books", "books", "Books", "book", "Concept books, formula sheets & reference notes.", "#0284c7", 2],
    ["div_buet", "buet", "BUET", "cpu", "BUET & Engineering conceptual admission problems.", "#7c3aed", 3],
    ["div_medical", "medical", "Medical", "heart", "Medical & Dental high-yield rapid drills.", "#059669", 4],
    ["div_college", "college-questions", "College Questions", "building", "Top college test & pre-test question papers.", "#d97706", 5]
  ];
  await db.batch(divOrder.map(([id, slug, name, icon, desc, color, order]) =>
    db.prepare(`
      INSERT INTO academics_divisions (id, slug, name, icon, description, accentColor, displayOrder, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        icon = excluded.icon,
        description = excluded.description,
        displayOrder = excluded.displayOrder
    `).bind(id, slug, name, icon, desc, color, order, now)
  ));

  await db.prepare(`
    INSERT INTO academics_meta (k, v)
    VALUES ('hsc_v3_seeded', '1')
    ON CONFLICT(k) DO UPDATE SET v = '1'
  `).run();
}

async function fetchFullCatalog(db) {
  const [clsRes, divRes, subRes, mcqRes, cqRes, noteRes] = await Promise.all([
    db.prepare("SELECT * FROM academics_classes ORDER BY displayOrder ASC, createdAt ASC").all(),
    db.prepare("SELECT * FROM academics_divisions ORDER BY displayOrder ASC, createdAt ASC").all(),
    db.prepare("SELECT * FROM academics_subjects ORDER BY displayOrder ASC, createdAt ASC").all(),
    db.prepare("SELECT * FROM academics_mcqs ORDER BY createdAt DESC").all(),
    db.prepare("SELECT * FROM academics_cqs ORDER BY createdAt DESC").all(),
    db.prepare("SELECT * FROM academics_notes ORDER BY createdAt DESC").all()
  ]);

  const classes = (clsRes.results || []).map(c => ({
    ...c,
    includedCourses: safeJsonParse(c.includedCoursesJson, []),
    instructors: safeJsonParse(c.instructorsJson, []),
    features: safeJsonParse(c.featuresJson, []),
    faq: safeJsonParse(c.faqJson, []),
    price: Number(c.price) || 0,
    originalPrice: Number(c.originalPrice) || 0,
    studentCount: Number(c.studentCount) || 0,
    hasAccessCode: Boolean(c.accessCode && String(c.accessCode).trim().length > 0),
    accessCode: undefined
  }));
  const divisions = divRes.results || [];
  const subjects = (subRes.results || []).map(s => ({
    ...s,
    chapters: safeJsonParse(s.chaptersJson, []),
    includedCourses: safeJsonParse(s.includedCoursesJson, []),
    instructors: safeJsonParse(s.instructorsJson, []),
    features: safeJsonParse(s.featuresJson, []),
    faq: safeJsonParse(s.faqJson, []),
    price: Number(s.price) || 0,
    originalPrice: Number(s.originalPrice) || 0,
    studentCount: Number(s.studentCount) || 0,
    hasAccessCode: Boolean(s.accessCode && String(s.accessCode).trim().length > 0),
    accessCode: undefined
  }));
  const mcqs = (mcqRes.results || []).map(m => ({
    ...m,
    divisionId: m.divisionId || "div_academics",
    options: safeJsonParse(m.optionsJson, ["", "", "", ""])
  }));
  const cqs = (cqRes.results || []).map(c => ({
    ...c,
    divisionId: c.divisionId || "div_academics"
  }));
  const notes = (noteRes.results || []).map(n => ({
    ...n,
    divisionId: n.divisionId || "div_books"
  }));

  return {
    classes,
    divisions,
    subjects,
    mcqs,
    cqs,
    notes,
    stats: {
      classes: classes.length,
      divisions: divisions.length,
      subjects: subjects.length,
      mcqs: mcqs.length,
      cqs: cqs.length,
      notes: notes.length
    },
    syncedAt: new Date().toISOString()
  };
}

export async function onRequestGet(context) {
  const { env } = context;
  if (!env || !env.DB) return jsonResp({ error: "Database binding missing" }, 503);
  try {
    await ensureAcademicsTables(env.DB);
    await seedHscOnce(env.DB);
    const catalog = await fetchFullCatalog(env.DB);
    return jsonResp(catalog);
  } catch (err) {
    return jsonResp({ error: err.message || "Failed to load academics data" }, 500);
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env || !env.DB) return jsonResp({ error: "Database binding missing" }, 503);

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResp({ error: "Invalid JSON payload" }, 400);
  }

  try {
    await ensureAcademicsTables(env.DB);
    const action = String(body.action || "").trim();
    const now = new Date().toISOString();

    if (action === "save_division") {
      const name = String(body.name || "").trim();
      if (!name) return jsonResp({ error: "Division name is required" }, 400);
      const id = String(body.id || ("div_" + Date.now().toString(36))).trim();
      const slug = String(body.slug || name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || id;
      await env.DB.prepare(`
        INSERT INTO academics_divisions (id, slug, name, icon, description, accentColor, displayOrder, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          slug = excluded.slug,
          name = excluded.name,
          icon = excluded.icon,
          description = excluded.description,
          accentColor = excluded.accentColor,
          displayOrder = excluded.displayOrder
      `).bind(
        id,
        slug,
        name,
        String(body.icon || "layers").trim(),
        String(body.description || "").trim(),
        String(body.accentColor || "#ea580c").trim(),
        Number(body.displayOrder) || 0,
        now
      ).run();
      return jsonResp({ success: true, id, ...(await fetchFullCatalog(env.DB)) });
    }

    if (action === "delete_division") {
      const id = String(body.id || "").trim();
      if (!id) return jsonResp({ error: "Division ID required" }, 400);
      await env.DB.prepare("DELETE FROM academics_divisions WHERE id = ?").bind(id).run();
      return jsonResp({ success: true, ...(await fetchFullCatalog(env.DB)) });
    }

    if (action === "save_class") {
      const name = String(body.name || "").trim();
      if (!name) return jsonResp({ error: "Course name required" }, 400);
      const id = String(body.id || ("cls_" + Date.now().toString(36))).trim();
      const prev = await env.DB.prepare("SELECT * FROM academics_classes WHERE id = ?").bind(id).first();
      const slug = String(body.slug || name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || id;
      const price = Math.max(0, Number(body.price) || 0);
      const originalPrice = Math.max(0, Number(body.originalPrice) || 0);
      const accessTier = body.accessTier === "paid" || price > 0 ? "paid" : "public";
      const features = Array.isArray(body.features)
        ? body.features.map(f => String(f).trim()).filter(Boolean)
        : String(body.features || "").split(/\r?\n/).map(f => f.trim()).filter(Boolean);
      const includedCourses = Array.isArray(body.includedCourses)
        ? body.includedCourses.map(x => String(x).trim()).filter(Boolean)
        : String(body.includedCourses || "").split(/\r?\n/).map(x => x.trim()).filter(Boolean);
      const accessCode = body.accessCode !== undefined && String(body.accessCode).trim() !== ""
        ? String(body.accessCode).trim()
        : (prev?.accessCode || "");

      await env.DB.prepare(`
        INSERT INTO academics_classes (
          id, slug, name, shortName, level, description, badge, accentColor, displayOrder, accessTier, packageId, createdAt,
          imageUrl, price, originalPrice, studentCount, badgeText, includedCoursesJson, featuresJson, paymentInstructions, enrollPhone, accessCode
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          slug = excluded.slug,
          name = excluded.name,
          shortName = excluded.shortName,
          level = excluded.level,
          description = excluded.description,
          badge = excluded.badge,
          accentColor = excluded.accentColor,
          displayOrder = excluded.displayOrder,
          accessTier = excluded.accessTier,
          packageId = excluded.packageId,
          imageUrl = excluded.imageUrl,
          price = excluded.price,
          originalPrice = excluded.originalPrice,
          studentCount = excluded.studentCount,
          badgeText = excluded.badgeText,
          includedCoursesJson = excluded.includedCoursesJson,
          featuresJson = excluded.featuresJson,
          paymentInstructions = excluded.paymentInstructions,
          enrollPhone = excluded.enrollPhone,
          accessCode = excluded.accessCode
      `).bind(
        id,
        slug,
        name,
        String(body.shortName || name).trim(),
        String(body.level || "Higher Secondary").trim(),
        String(body.description || "").trim(),
        String(body.badge || "Course").trim(),
        String(body.accentColor || "#ea580c").trim(),
        Number(body.displayOrder) || (prev ? prev.displayOrder : 0),
        accessTier,
        String(body.packageId || "").trim(),
        prev ? prev.createdAt : now,
        String(body.imageUrl !== undefined ? body.imageUrl : (prev?.imageUrl || "")).trim(),
        price,
        originalPrice,
        Number(body.studentCount) || (prev ? prev.studentCount : 0),
        String(body.badgeText || body.badge || "HSC").trim(),
        JSON.stringify(includedCourses),
        JSON.stringify(features.length ? features : (prev ? safeJsonParse(prev.featuresJson, []) : [])),
        String(body.paymentInstructions !== undefined ? body.paymentInstructions : (prev?.paymentInstructions || "")).trim(),
        String(body.enrollPhone !== undefined ? body.enrollPhone : (prev?.enrollPhone || "")).trim(),
        accessCode
      ).run();
      return jsonResp({ success: true, id, ...(await fetchFullCatalog(env.DB)) });
    }

    if (action === "delete_class") {
      const id = String(body.id || "").trim();
      if (!id) return jsonResp({ error: "Course ID required" }, 400);
      await env.DB.batch([
        env.DB.prepare("DELETE FROM academics_classes WHERE id = ?").bind(id),
        env.DB.prepare("DELETE FROM academics_subjects WHERE classId = ?").bind(id),
        env.DB.prepare("DELETE FROM academics_mcqs WHERE classId = ?").bind(id),
        env.DB.prepare("DELETE FROM academics_cqs WHERE classId = ?").bind(id),
        env.DB.prepare("DELETE FROM academics_notes WHERE classId = ?").bind(id)
      ]);
      return jsonResp({ success: true, ...(await fetchFullCatalog(env.DB)) });
    }

    if (action === "save_subject") {
      const name = String(body.name || "").trim();
      const classId = String(body.classId || "cls_hsc").trim();
      if (!name) return jsonResp({ error: "Subject name is required" }, 400);
      const id = String(body.id || ("sub_" + Date.now().toString(36))).trim();
      const prev = await env.DB.prepare("SELECT * FROM academics_subjects WHERE id = ?").bind(id).first();
      const chapters = Array.isArray(body.chapters)
        ? body.chapters.map(c => String(c).trim()).filter(Boolean)
        : String(body.chapters || "").split(/\r?\n|,/).map(c => c.trim()).filter(Boolean);
      const features = Array.isArray(body.features)
        ? body.features.map(f => String(f).trim()).filter(Boolean)
        : String(body.features || "").split(/\r?\n/).map(f => f.trim()).filter(Boolean);
      const includedCourses = Array.isArray(body.includedCourses)
        ? body.includedCourses.map(x => String(x).trim()).filter(Boolean)
        : String(body.includedCourses || "").split(/\r?\n/).map(x => x.trim()).filter(Boolean);
      const instructors = Array.isArray(body.instructors) ? body.instructors : safeJsonParse(body.instructorsJson, prev ? safeJsonParse(prev.instructorsJson, []) : []);
      const faq = Array.isArray(body.faq) ? body.faq : safeJsonParse(body.faqJson, prev ? safeJsonParse(prev.faqJson, []) : []);
      const accessCode = body.accessCode !== undefined && String(body.accessCode).trim() !== ""
        ? String(body.accessCode).trim()
        : (prev?.accessCode || "");
      const price = Math.max(0, Number(body.price) || 0);
      const originalPrice = Math.max(0, Number(body.originalPrice) || 0);
      const accessTier = body.accessTier === "paid" || price > 0 ? "paid" : "public";

      await env.DB.prepare(`
        INSERT INTO academics_subjects (
          id, classId, name, code, icon, description, chaptersJson, displayOrder, accessTier, packageId, createdAt,
          imageUrl, price, originalPrice, studentCount, badgeText, includedCoursesJson, instructorsJson, featuresJson, faqJson, paymentInstructions, enrollPhone, accessCode
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          classId = excluded.classId,
          name = excluded.name,
          code = excluded.code,
          icon = excluded.icon,
          description = excluded.description,
          chaptersJson = excluded.chaptersJson,
          displayOrder = excluded.displayOrder,
          accessTier = excluded.accessTier,
          packageId = excluded.packageId,
          imageUrl = excluded.imageUrl,
          price = excluded.price,
          originalPrice = excluded.originalPrice,
          studentCount = excluded.studentCount,
          badgeText = excluded.badgeText,
          includedCoursesJson = excluded.includedCoursesJson,
          instructorsJson = excluded.instructorsJson,
          featuresJson = excluded.featuresJson,
          faqJson = excluded.faqJson,
          paymentInstructions = excluded.paymentInstructions,
          enrollPhone = excluded.enrollPhone,
          accessCode = excluded.accessCode
      `).bind(
        id,
        classId,
        name,
        String(body.code || "").trim(),
        String(body.icon || "book").trim(),
        String(body.description || "").trim(),
        JSON.stringify(chapters),
        Number(body.displayOrder) || (prev ? prev.displayOrder : 0),
        accessTier,
        String(body.packageId || "").trim(),
        prev ? prev.createdAt : now,
        String(body.imageUrl !== undefined ? body.imageUrl : (prev?.imageUrl || "")).trim(),
        price,
        originalPrice,
        Number(body.studentCount) || (prev ? prev.studentCount : 0),
        String(body.badgeText || (prev?.badgeText || "HSC")).trim(),
        JSON.stringify(includedCourses),
        JSON.stringify(instructors),
        JSON.stringify(features.length ? features : (prev ? safeJsonParse(prev.featuresJson, []) : [])),
        JSON.stringify(faq),
        String(body.paymentInstructions !== undefined ? body.paymentInstructions : (prev?.paymentInstructions || "")).trim(),
        String(body.enrollPhone !== undefined ? body.enrollPhone : (prev?.enrollPhone || "")).trim(),
        accessCode
      ).run();
      return jsonResp({ success: true, id, ...(await fetchFullCatalog(env.DB)) });
    }

    if (action === "delete_subject") {
      const id = String(body.id || "").trim();
      if (!id) return jsonResp({ error: "Subject ID required" }, 400);
      await env.DB.batch([
        env.DB.prepare("DELETE FROM academics_subjects WHERE id = ?").bind(id),
        env.DB.prepare("DELETE FROM academics_mcqs WHERE subjectId = ?").bind(id),
        env.DB.prepare("DELETE FROM academics_cqs WHERE subjectId = ?").bind(id),
        env.DB.prepare("DELETE FROM academics_notes WHERE subjectId = ?").bind(id)
      ]);
      return jsonResp({ success: true, ...(await fetchFullCatalog(env.DB)) });
    }

    if (action === "save_mcq") {
      const question = String(body.question || "").trim();
      const classId = String(body.classId || "cls_hsc").trim();
      const subjectId = String(body.subjectId || "").trim();
      const divisionId = String(body.divisionId || "div_academics").trim();
      const options = Array.isArray(body.options) ? body.options.map(o => String(o || "").trim()) : [];
      if (!question || !subjectId || options.filter(Boolean).length < 2) {
        return jsonResp({ error: "Subject, Question, and at least 2 options are required." }, 400);
      }
      const id = String(body.id || ("mcq_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5))).trim();
      await env.DB.prepare(`
        INSERT INTO academics_mcqs (id, classId, subjectId, divisionId, chapter, question, optionsJson, correctIndex, explanation, boardTag, difficulty, imageUrl, accessTier, packageId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          classId = excluded.classId,
          subjectId = excluded.subjectId,
          divisionId = excluded.divisionId,
          chapter = excluded.chapter,
          question = excluded.question,
          optionsJson = excluded.optionsJson,
          correctIndex = excluded.correctIndex,
          explanation = excluded.explanation,
          boardTag = excluded.boardTag,
          difficulty = excluded.difficulty,
          imageUrl = excluded.imageUrl,
          accessTier = excluded.accessTier,
          packageId = excluded.packageId
      `).bind(
        id,
        classId,
        subjectId,
        divisionId,
        String(body.chapter || "General").trim(),
        question,
        JSON.stringify(options),
        Math.max(0, Math.min(options.length - 1, Number(body.correctIndex) || 0)),
        String(body.explanation || "").trim(),
        String(body.boardTag || "").trim(),
        String(body.difficulty || "Medium").trim(),
        String(body.imageUrl || "").trim(),
        String(body.accessTier || "public").trim(),
        String(body.packageId || "").trim(),
        now
      ).run();
      return jsonResp({ success: true, id, ...(await fetchFullCatalog(env.DB)) });
    }

    if (action === "bulk_save_mcqs") {
      const items = Array.isArray(body.items) ? body.items : [];
      const classId = String(body.classId || "cls_hsc").trim();
      const subjectId = String(body.subjectId || "").trim();
      const divisionId = String(body.divisionId || "div_academics").trim();
      if (!subjectId || items.length === 0) {
        return jsonResp({ error: "Subject and MCQ items array are required." }, 400);
      }
      const stmts = [];
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const q = String(it.question || "").trim();
        const opts = Array.isArray(it.options) ? it.options.map(o => String(o || "").trim()) : [];
        if (!q || opts.filter(Boolean).length < 2) continue;
        const id = "mcq_" + Date.now().toString(36) + "_" + i + "_" + Math.random().toString(36).slice(2, 5);
        stmts.push(
          env.DB.prepare(`
            INSERT INTO academics_mcqs (id, classId, subjectId, divisionId, chapter, question, optionsJson, correctIndex, explanation, boardTag, difficulty, imageUrl, accessTier, packageId, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            id,
            classId,
            subjectId,
            String(it.divisionId || divisionId).trim(),
            String(it.chapter || body.chapter || "General").trim(),
            q,
            JSON.stringify(opts),
            Math.max(0, Math.min(opts.length - 1, Number(it.correctIndex) || 0)),
            String(it.explanation || "").trim(),
            String(it.boardTag || body.boardTag || "").trim(),
            String(it.difficulty || "Medium").trim(),
            String(it.imageUrl || "").trim(),
            String(it.accessTier || "public").trim(),
            String(it.packageId || "").trim(),
            now
          )
        );
      }
      if (stmts.length > 0) await env.DB.batch(stmts);
      return jsonResp({ success: true, inserted: stmts.length, ...(await fetchFullCatalog(env.DB)) });
    }

    if (action === "delete_mcq") {
      const id = String(body.id || "").trim();
      if (!id) return jsonResp({ error: "MCQ ID required" }, 400);
      await env.DB.prepare("DELETE FROM academics_mcqs WHERE id = ?").bind(id).run();
      return jsonResp({ success: true, ...(await fetchFullCatalog(env.DB)) });
    }

    if (action === "save_cq") {
      const classId = String(body.classId || "cls_hsc").trim();
      const subjectId = String(body.subjectId || "").trim();
      const divisionId = String(body.divisionId || "div_academics").trim();
      const stem = String(body.stem || "").trim();
      if (!subjectId || !stem) {
        return jsonResp({ error: "Subject and Uddipok/Stem are required." }, 400);
      }
      const id = String(body.id || ("cq_" + Date.now().toString(36))).trim();
      await env.DB.prepare(`
        INSERT INTO academics_cqs (id, classId, subjectId, divisionId, chapter, title, boardTag, stem, imageUrl, partA, ansA, partB, ansB, partC, ansC, partD, ansD, accessTier, packageId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          classId = excluded.classId,
          subjectId = excluded.subjectId,
          divisionId = excluded.divisionId,
          chapter = excluded.chapter,
          title = excluded.title,
          boardTag = excluded.boardTag,
          stem = excluded.stem,
          imageUrl = excluded.imageUrl,
          partA = excluded.partA,
          ansA = excluded.ansA,
          partB = excluded.partB,
          ansB = excluded.ansB,
          partC = excluded.partC,
          ansC = excluded.ansC,
          partD = excluded.partD,
          ansD = excluded.ansD,
          accessTier = excluded.accessTier,
          packageId = excluded.packageId
      `).bind(
        id,
        classId,
        subjectId,
        divisionId,
        String(body.chapter || "General").trim(),
        String(body.title || "Creative Question").trim(),
        String(body.boardTag || "").trim(),
        stem,
        String(body.imageUrl || "").trim(),
        String(body.partA || "").trim(),
        String(body.ansA || "").trim(),
        String(body.partB || "").trim(),
        String(body.ansB || "").trim(),
        String(body.partC || "").trim(),
        String(body.ansC || "").trim(),
        String(body.partD || "").trim(),
        String(body.ansD || "").trim(),
        String(body.accessTier || "public").trim(),
        String(body.packageId || "").trim(),
        now
      ).run();
      return jsonResp({ success: true, id, ...(await fetchFullCatalog(env.DB)) });
    }

    if (action === "delete_cq") {
      const id = String(body.id || "").trim();
      if (!id) return jsonResp({ error: "CQ ID required" }, 400);
      await env.DB.prepare("DELETE FROM academics_cqs WHERE id = ?").bind(id).run();
      return jsonResp({ success: true, ...(await fetchFullCatalog(env.DB)) });
    }

    if (action === "save_note") {
      const classId = String(body.classId || "cls_hsc").trim();
      const subjectId = String(body.subjectId || "").trim();
      const divisionId = String(body.divisionId || "div_books").trim();
      const title = String(body.title || "").trim();
      if (!subjectId || !title) {
        return jsonResp({ error: "Subject and Resource Title are required." }, 400);
      }
      const id = String(body.id || ("note_" + Date.now().toString(36))).trim();
      await env.DB.prepare(`
        INSERT INTO academics_notes (id, classId, subjectId, divisionId, chapter, title, resourceType, summary, content, fileUrl, videoUrl, accessTier, packageId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          classId = excluded.classId,
          subjectId = excluded.subjectId,
          divisionId = excluded.divisionId,
          chapter = excluded.chapter,
          title = excluded.title,
          resourceType = excluded.resourceType,
          summary = excluded.summary,
          content = excluded.content,
          fileUrl = excluded.fileUrl,
          videoUrl = excluded.videoUrl,
          accessTier = excluded.accessTier,
          packageId = excluded.packageId
      `).bind(
        id,
        classId,
        subjectId,
        divisionId,
        String(body.chapter || "General").trim(),
        title,
        String(body.resourceType || "note").trim(),
        String(body.summary || "").trim(),
        String(body.content || "").trim(),
        String(body.fileUrl || "").trim(),
        String(body.videoUrl || "").trim(),
        String(body.accessTier || "public").trim(),
        String(body.packageId || "").trim(),
        now
      ).run();
      return jsonResp({ success: true, id, ...(await fetchFullCatalog(env.DB)) });
    }

    if (action === "delete_note") {
      const id = String(body.id || "").trim();
      if (!id) return jsonResp({ error: "Note ID required" }, 400);
      await env.DB.prepare("DELETE FROM academics_notes WHERE id = ?").bind(id).run();
      return jsonResp({ success: true, ...(await fetchFullCatalog(env.DB)) });
    }

    if (action === "enroll_course") {
      const targetId = String(body.targetId || body.subjectId || body.classId || "").trim();
      const studentName = String(body.studentName || "").trim();
      const studentEmail = String(body.studentEmail || "").trim();
      if (!targetId || !studentName || !studentEmail) {
        return jsonResp({ error: "Course, Full Name, and Email are required." }, 400);
      }
      const cls = await env.DB.prepare("SELECT name, price FROM academics_classes WHERE id = ?").bind(targetId).first();
      const sub = !cls ? await env.DB.prepare("SELECT name, price FROM academics_subjects WHERE id = ?").bind(targetId).first() : null;
      const item = cls || sub;
      const id = "enr_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
      await env.DB.prepare(`
        INSERT INTO academics_enrollments (id, subjectId, subjectName, studentName, studentEmail, studentPhone, college, paymentMethod, trxId, amount, status, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
      `).bind(
        id,
        targetId,
        item?.name || String(body.subjectName || ""),
        studentName,
        studentEmail,
        String(body.studentPhone || "").trim(),
        String(body.college || "").trim(),
        String(body.paymentMethod || "bKash").trim(),
        String(body.trxId || "").trim(),
        Number(body.amount) || Number(item?.price) || 0,
        now
      ).run();
      if (cls) {
        await env.DB.prepare("UPDATE academics_classes SET studentCount = COALESCE(studentCount, 0) + 1 WHERE id = ?").bind(targetId).run().catch(() => {});
      } else if (sub) {
        await env.DB.prepare("UPDATE academics_subjects SET studentCount = COALESCE(studentCount, 0) + 1 WHERE id = ?").bind(targetId).run().catch(() => {});
      }
      return jsonResp({ success: true, id, message: "Enrollment submitted. Our team will verify your payment shortly." });
    }

    if (action === "verify_access_code") {
      const targetId = String(body.targetId || body.subjectId || body.classId || "").trim();
      const code = String(body.code || "").trim();
      if (!targetId || !code) return jsonResp({ error: "Access code required" }, 400);
      const cls = await env.DB.prepare("SELECT accessCode FROM academics_classes WHERE id = ?").bind(targetId).first();
      const sub = !cls ? await env.DB.prepare("SELECT accessCode FROM academics_subjects WHERE id = ?").bind(targetId).first() : null;
      const row = cls || sub;
      if (!row || !row.accessCode) return jsonResp({ error: "No access code configured for this course." }, 400);
      if (String(row.accessCode).trim().toLowerCase() === code.toLowerCase()) {
        return jsonResp({ success: true, unlocked: true });
      }
      return jsonResp({ error: "Invalid access code. Please check your confirmation message." }, 403);
    }

    if (action === "list_enrollments") {
      const res = await env.DB.prepare("SELECT * FROM academics_enrollments ORDER BY createdAt DESC").all();
      return jsonResp({ success: true, enrollments: res.results || [] });
    }

    if (action === "update_enrollment_status") {
      const id = String(body.id || "").trim();
      const status = ["pending", "approved", "declined"].includes(body.status) ? body.status : "approved";
      if (!id) return jsonResp({ error: "Enrollment ID required" }, 400);
      await env.DB.prepare("UPDATE academics_enrollments SET status = ? WHERE id = ?").bind(status, id).run();
      const res = await env.DB.prepare("SELECT * FROM academics_enrollments ORDER BY createdAt DESC").all();
      return jsonResp({ success: true, enrollments: res.results || [] });
    }

    return jsonResp({ error: `Unknown academics action: ${action}` }, 400);
  } catch (err) {
    return jsonResp({ error: err.message || "Academics operation failed" }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
