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
        icon TEXT DEFAULT '🎓',
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
        icon TEXT DEFAULT '📘',
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

  const subjectExtraCols = [
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
  for (const col of subjectExtraCols) {
    await safeAddColumn(db, "academics_subjects", col);
  }
  await safeAddColumn(db, "academics_mcqs", "divisionId TEXT DEFAULT 'div_academics'");
  await safeAddColumn(db, "academics_cqs", "divisionId TEXT DEFAULT 'div_academics'");
  await safeAddColumn(db, "academics_notes", "divisionId TEXT DEFAULT 'div_books'");
}

async function seedHscCatalogIfNeeded(db) {
  const now = new Date().toISOString();

  const divCount = await db.prepare("SELECT COUNT(*) AS c FROM academics_divisions").first();
  if (!divCount || Number(divCount.c) === 0) {
    const seedDivs = [
      ["div_academics", "academics", "Academics", "🎓", "Complete HSC Board syllabus, chapter-wise board MCQs & CQs.", "#ea580c", 1, now],
      ["div_books", "books", "Books", "📚", "Standard textbooks, concept sheets, formula handbooks & lecture PDFs.", "#0ea5e9", 2, now],
      ["div_medical", "medical", "Medical", "🩺", "Medical & Dental admission high-yield MCQs, rapid drills & explanations.", "#10b981", 3, now],
      ["div_buet", "buet", "BUET", "⚙️", "BUET, CKRUET & Engineering conceptual problems, calculus & analytical CQs.", "#8b5cf6", 4, now],
      ["div_college", "college-questions", "College Questions", "🏫", "Notre Dame, Holy Cross, Viqarunnisa, Dhaka College & Rajuk test papers.", "#f59e0b", 5, now]
    ];
    await db.batch(seedDivs.map(d =>
      db.prepare("INSERT OR IGNORE INTO academics_divisions (id, slug, name, icon, description, accentColor, displayOrder, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(...d)
    ));
  }

  const hasHsc13 = await db.prepare("SELECT id FROM academics_subjects WHERE id = 'sub_hsc_bn1'").first();
  if (!hasHsc13) {
    await db.prepare("DELETE FROM academics_classes WHERE id IN ('cls_ssc', 'cls_junior', 'cls_admission')").run().catch(() => {});
    await db.prepare("DELETE FROM academics_subjects WHERE id IN ('sub_ssc_phy', 'sub_ssc_chem', 'sub_ssc_math', 'sub_ssc_bio', 'sub_ssc_ict', 'sub_hsc_phy', 'sub_hsc_chem', 'sub_hsc_math', 'sub_hsc_bio', 'sub_jr_sci', 'sub_adm_stem')").run().catch(() => {});

    await db.prepare(`
      INSERT INTO academics_classes (id, slug, name, shortName, level, description, badge, accentColor, displayOrder, accessTier, packageId, createdAt)
      VALUES ('cls_hsc', 'hsc', 'HSC (Higher Secondary)', 'HSC', 'Higher Secondary', 'Complete HSC Science & General curriculum covering all 13 subjects across Academics, Books, Medical, BUET & Top College Questions.', 'HSC Active', '#ea580c', 1, 'public', '', ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        shortName = excluded.shortName,
        description = excluded.description,
        badge = excluded.badge,
        displayOrder = 1
    `).bind(now).run();

    const defaultFeatures = JSON.stringify([
      "Chapter-wise Board, Medical, BUET & College MCQs",
      "Automated Timed MCQ Exam Taker with Negative Marking",
      "Structured 4-Part Creative Questions (CQ) with Model Solutions",
      "1-Click Offline Question Database Download for Zero-Internet Study",
      "Concept Books, Formula Cheat Sheets & PDF Handouts"
    ]);
    const defaultFaq = JSON.stringify([
      { q: "Can I take MCQ exams offline after downloading?", a: "Yes! Click 'Download Qn DB Offline' to save the complete question bank on your phone or PC and take unlimited timed exams without internet." },
      { q: "Are both Bangla and English versions supported?", a: "Yes, use the top language switcher or browse bilingual terminology across all 13 HSC subjects." },
      { q: "How do I unlock a paid course?", a: "Complete payment via bKash/Nagad/Rocket using the instructions provided, submit your TrxID, or enter your Institute Access Code for instant unlock." }
    ]);

    const hscSubjects = [
      ["sub_hsc_bn1", "Bangla 1st Paper", "BAN-101", "📖", "গদ্য, পদ্য, উপন্যাস (লালসালু) ও নাটক (সিরাজউদ্দৌলা) — HSC বোর্ড ও বিশ্ববিদ্যালয় প্রস্তুতি।", ["অপরিচিতা", "বিলাসী", "আমার পথ", "মানব-কল্যাণ", "সোনার তরী", "বিদ্রোহী", "লালসালু", "সিরাজউদ্দৌলা"], 1, "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80", 1420],
      ["sub_hsc_bn2", "Bangla 2nd Paper", "BAN-102", "✍️", "বাংলা ব্যাকরণ, উচ্চারণ, বানান, সমাস, উপসর্গ, বাক্যতত্ত্ব ও নির্মিতি অংশ।", ["বাংলা উচ্চারণের নিয়ম", "বাংলা বানানের নিয়ম", "বাংলা ভাষার ব্যাকরণিক শব্দশ্রেণি", "সমাস ও উপসর্গ", "বাক্যতত্ত্ব", "প্রবন্ধ ও প্রতিবেদন"], 2, "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80", 1280],
      ["sub_hsc_en1", "English 1st Paper", "ENG-107", "🌍", "Reading comprehension, flowcharts, summary writing, cloze tests & rearrangement.", ["Unit 1: People or Institutions Making History", "Unit 2: Education and Life", "Unit 3: Dreams", "Unit 4: Youthful Achievers", "Unit 6: Adolescence", "Flowchart & Summary Practice"], 3, "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80", 1650],
      ["sub_hsc_en2", "English 2nd Paper", "ENG-108", "📝", "Prepositions, modifiers, right form of verbs, narration, connectors & composition.", ["Prepositions", "Special Uses of Words & Phrases", "Completing Sentences", "Right Form of Verbs", "Narration & Transformation", "Modifiers & Connectors"], 4, "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80", 1590],
      ["sub_hsc_hm1", "Higher Math 1st Paper", "HM-265", "📐", "Matrices, Vectors, Straight Lines, Circles, Trigonometry, Differentiation & Integration.", ["Ch 1: Matrix & Determinant", "Ch 3: Straight Lines", "Ch 4: Circle", "Ch 7: Trigonometric Ratios", "Ch 9: Differentiation", "Ch 10: Integration"], 5, "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80", 2410],
      ["sub_hsc_hm2", "Higher Math 2nd Paper", "HM-266", "∑", "Complex Numbers, Polynomials, Conics, Inverse Trigonometry, Statics & Dynamics.", ["Ch 3: Complex Numbers", "Ch 4: Polynomials", "Ch 6: Conics", "Ch 7: Inverse Trigonometric Functions", "Ch 8: Statics", "Ch 9: Motion of a Particle in a Plane"], 6, "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80", 2180],
      ["sub_hsc_bio1", "Biology 1st Paper", "BIO-178", "🌿", "Botany: Cell & Structure, Cell Division, Microorganisms, Bryophyta, Plant Physiology & Biotechnology.", ["Ch 1: Cell & Its Structure", "Ch 2: Cell Division", "Ch 4: Microorganisms", "Ch 7: Gymnosperms & Angiosperms", "Ch 9: Plant Physiology", "Ch 11: Biotechnology"], 7, "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=900&q=80", 2640],
      ["sub_hsc_bio2", "Biology 2nd Paper", "BIO-179", "🧬", "Zoology: Animal Diversity, Hydra/Grasshopper/Rui, Digestion, Blood Circulation, Genetics & Evolution.", ["Ch 1: Animal Diversity & Classification", "Ch 2: Introduction to Animals", "Ch 3: Human Physiology - Digestion", "Ch 4: Blood & Circulation", "Ch 5: Breathing & Respiration", "Ch 11: Genetics & Evolution"], 8, "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80", 2520],
      ["sub_hsc_chem1", "Chemistry 1st Paper", "CHEM-176", "⚗️", "Laboratory Safety, Qualitative Chemistry, Periodic Properties, Chemical Changes & Vocational Chemistry.", ["Ch 1: Safe Use of Laboratory", "Ch 2: Qualitative Chemistry", "Ch 3: Periodic Properties & Chemical Bonding", "Ch 4: Chemical Changes", "Ch 5: Vocational Chemistry"], 9, "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=900&q=80", 2310],
      ["sub_hsc_chem2", "Chemistry 2nd Paper", "CHEM-177", "🧪", "Environmental Chemistry, Organic Chemistry, Quantitative Chemistry & Electrochemistry.", ["Ch 1: Environmental Chemistry", "Ch 2: Organic Chemistry", "Ch 3: Quantitative Chemistry", "Ch 4: Electrochemistry", "Ch 5: Economic Chemistry"], 10, "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80", 2490],
      ["sub_hsc_phy1", "Physics 1st Paper", "PHY-174", "⚛️", "Vector, Dynamics, Newtonian Mechanics, Work-Energy, Gravitation, Structural Properties & Periodic Motion.", ["Ch 2: Vector", "Ch 4: Newtonian Mechanics", "Ch 5: Work, Energy & Power", "Ch 6: Gravitation & Gravity", "Ch 8: Periodic Motion", "Ch 10: Ideal Gas & Kinetic Theory"], 11, "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=900&q=80", 2890],
      ["sub_hsc_phy2", "Physics 2nd Paper", "PHY-175", "🔭", "Thermodynamics, Electrostatics, Current Electricity, Optics, Modern Physics, Nuclear Physics & Semiconductors.", ["Ch 1: Thermodynamics", "Ch 2: Static Electricity", "Ch 3: Current Electricity", "Ch 7: Physical Optics", "Ch 8: Modern Physics", "Ch 10: Semiconductor & Electronics"], 12, "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80", 2740],
      ["sub_hsc_ict", "ICT", "ICT-275", "💻", "Communication Systems, Number Systems & Logic Gates, Web Design & HTML, C Programming & SQL Database.", ["Ch 1: ICT World & Bangladesh", "Ch 2: Communication Systems & Networking", "Ch 3: Number System & Digital Devices", "Ch 4: Web Design & HTML", "Ch 5: Programming Language (C)", "Ch 6: Database Management System"], 13, "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80", 3120]
    ];

    const stmts = hscSubjects.map(([id, name, code, icon, desc, chs, order, img, students]) =>
      db.prepare(`
        INSERT INTO academics_subjects (id, classId, name, code, icon, description, chaptersJson, displayOrder, accessTier, packageId, createdAt, imageUrl, price, originalPrice, studentCount, badgeText, featuresJson, faqJson)
        VALUES (?, 'cls_hsc', ?, ?, ?, ?, ?, ?, 'public', '', ?, ?, 0, 0, ?, 'HSC', ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          code = excluded.code,
          icon = excluded.icon,
          description = excluded.description,
          chaptersJson = excluded.chaptersJson,
          displayOrder = excluded.displayOrder,
          imageUrl = CASE WHEN academics_subjects.imageUrl = '' OR academics_subjects.imageUrl IS NULL THEN excluded.imageUrl ELSE academics_subjects.imageUrl END,
          studentCount = CASE WHEN academics_subjects.studentCount = 0 OR academics_subjects.studentCount IS NULL THEN excluded.studentCount ELSE academics_subjects.studentCount END
      `).bind(id, name, code, icon, desc, JSON.stringify(chs), order, now, img, students, defaultFeatures, defaultFaq)
    );
    await db.batch(stmts);

    const seedMcqs = [
      ["mcq_hsc_phy1_a1", "cls_hsc", "sub_hsc_phy1", "div_academics", "Ch 2: Vector", "Two vectors A and B are perpendicular to each other. What is the value of their dot product A · B?", JSON.stringify(["AB", "0", "-AB", "1"]), 1, "A · B = |A||B|cos(90°) = 0.", "Dhaka Board", "Easy"],
      ["mcq_hsc_phy1_b1", "cls_hsc", "sub_hsc_phy1", "div_buet", "Ch 6: Gravitation & Gravity", "A satellite orbits Earth at height R (Earth's radius). Its orbital velocity compared to surface orbital speed v₀ is:", JSON.stringify(["v₀ / 2", "v₀ / √2", "√2 v₀", "v₀ / 4"]), 1, "Orbital speed v = √(GM/r). At r = R + R = 2R, v = √(GM/2R) = v₀/√2.", "BUET Admission", "Hard"],
      ["mcq_hsc_phy1_c1", "cls_hsc", "sub_hsc_phy1", "div_college", "Ch 8: Periodic Motion", "If the effective length of a simple pendulum is quadrupled, its time period becomes:", JSON.stringify(["Half", "Double", "4 times", "Unchanged"]), 1, "T = 2π√(L/g). Since T ∝ √L, making L → 4L doubles T.", "Notre Dame College", "Medium"],
      ["mcq_hsc_phy2_a1", "cls_hsc", "sub_hsc_phy2", "div_academics", "Ch 1: Thermodynamics", "In an isothermal process of an ideal gas, which physical quantity remains constant?", JSON.stringify(["Pressure", "Volume", "Internal Energy", "Entropy"]), 2, "Internal energy U of an ideal gas depends only on temperature T. Since ΔT = 0, ΔU = 0.", "Sylhet Board", "Medium"],
      ["mcq_hsc_phy2_m1", "cls_hsc", "sub_hsc_phy2", "div_medical", "Ch 8: Modern Physics", "According to Einstein's photoelectric equation, maximum kinetic energy of photoelectrons depends on:", JSON.stringify(["Light intensity", "Light frequency", "Exposure duration", "Plate area"]), 1, "Kmax = hf - φ depends linearly on frequency f above threshold frequency.", "Medical Admission", "Easy"],
      ["mcq_hsc_chem1_a1", "cls_hsc", "sub_hsc_chem1", "div_academics", "Ch 2: Qualitative Chemistry", "Which set of quantum numbers (n, l, m, s) is NOT valid for an electron?", JSON.stringify(["(3, 2, -1, +1/2)", "(2, 1, 0, -1/2)", "(3, 3, 0, +1/2)", "(4, 0, 0, +1/2)"]), 2, "Azimuthal quantum number l must satisfy 0 ≤ l ≤ n - 1, so for n = 3, l cannot be 3.", "Dhaka Board", "Medium"],
      ["mcq_hsc_chem2_m1", "cls_hsc", "sub_hsc_chem2", "div_medical", "Ch 2: Organic Chemistry", "Which reagent is used in the Lucas test to distinguish 1°, 2°, and 3° alcohols?", JSON.stringify(["Conc. HCl + Anhydrous ZnCl₂", "Dil. H₂SO₄ + K₂Cr₂O₇", "Tollens' reagent", "Fehling's solution"]), 0, "Lucas reagent (Conc. HCl + anhydrous ZnCl₂) gives immediate turbidity with tertiary alcohols.", "Medical Admission", "Medium"],
      ["mcq_hsc_hm1_a1", "cls_hsc", "sub_hsc_hm1", "div_academics", "Ch 9: Differentiation", "What is d/dx [ln(sin x)]?", JSON.stringify(["tan x", "cot x", "sec x", "csc x"]), 1, "By chain rule: (1/sin x) · cos x = cot x.", "Jessore Board", "Easy"],
      ["mcq_hsc_hm1_b1", "cls_hsc", "sub_hsc_hm1", "div_buet", "Ch 10: Integration", "Evaluate ∫₀^(π/2) [sin x / (sin x + cos x)] dx:", JSON.stringify(["π/2", "π/4", "1", "0"]), 1, "Using King's property ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a-x)dx gives 2I = ∫₀^(π/2) 1 dx = π/2 ⇒ I = π/4.", "BUET Admission", "Hard"],
      ["mcq_hsc_hm2_a1", "cls_hsc", "sub_hsc_hm2", "div_academics", "Ch 3: Complex Numbers", "What is the value of 1 + ω + ω² where ω is a complex cube root of unity?", JSON.stringify(["1", "0", "-1", "3"]), 1, "The sum of the three cube roots of unity is always 1 + ω + ω² = 0.", "Rajshahi Board", "Easy"],
      ["mcq_hsc_bio1_m1", "cls_hsc", "sub_hsc_bio1", "div_medical", "Ch 1: Cell & Its Structure", "Which cell organelle is known as the 'Powerhouse of the Cell' due to ATP synthesis?", JSON.stringify(["Ribosome", "Mitochondria", "Lysosome", "Golgi body"]), 1, "Mitochondria carry out oxidative phosphorylation and the Krebs cycle to produce ATP.", "Medical Admission", "Easy"],
      ["mcq_hsc_bio2_m1", "cls_hsc", "sub_hsc_bio2", "div_medical", "Ch 4: Blood & Circulation", "Which heart valve separates the left atrium from the left ventricle?", JSON.stringify(["Tricuspid valve", "Bicuspid (Mitral) valve", "Semilunar valve", "Eustachian valve"]), 1, "The bicuspid (mitral) valve regulates blood flow from the left atrium to the left ventricle.", "Medical Admission", "Easy"],
      ["mcq_hsc_ict_a1", "cls_hsc", "sub_hsc_ict", "div_academics", "Ch 3: Number System & Digital Devices", "What is the binary equivalent of decimal (25)₁₀?", JSON.stringify(["11001", "10101", "11011", "10011"]), 0, "25 = 16 + 8 + 1 = (11001)₂.", "Dhaka Board", "Easy"],
      ["mcq_hsc_ict_c1", "cls_hsc", "sub_hsc_ict", "div_college", "Ch 3: Number System & Digital Devices", "Which pair of gates are Universal Logic Gates?", JSON.stringify(["AND & OR", "XOR & XNOR", "NAND & NOR", "NOT & AND"]), 2, "Any Boolean logic circuit can be built using only NAND gates or only NOR gates.", "Holy Cross College", "Easy"],
      ["mcq_hsc_bn1_a1", "cls_hsc", "sub_hsc_bn1", "div_academics", "অপরিচিতা", "রবীন্দ্রনাথ ঠাকুরের 'অপরিচিতা' গল্পের কথকের নাম কী?", JSON.stringify(["অনুপম", "শম্ভুনাথ", "হরিশ", "বিনু"]), 0, "'অপরিচিতা' ছোটগল্পটি উত্তম পুরুষে অনুপমের জবানিতে বর্ণিত হয়েছে।", "Dhaka Board", "Easy"],
      ["mcq_hsc_bn2_a1", "cls_hsc", "sub_hsc_bn2", "div_academics", "সমাস ও উপসর্গ", "'নীলপদ্ম' কোন সমাসের উদাহরণ?", JSON.stringify(["দ্বন্দ্ব", "কর্মধারয়", "বহুব্রীহি", "অব্যয়ীভাব"]), 1, "নীল যে পদ্ম = নীলপদ্ম (সাধারণ কর্মধারয় সমাস)।", "Cumilla Board", "Easy"],
      ["mcq_hsc_en1_a1", "cls_hsc", "sub_hsc_en1", "div_academics", "Unit 1: People or Institutions Making History", "In the historic 7th March 1971 speech, the word 'emancipation' closest means:", JSON.stringify(["Restriction", "Liberation / Freedom", "Celebration", "Negotiation"]), 1, "Emancipation means freeing from political, social, or legal restrictions.", "HSC Board", "Easy"],
      ["mcq_hsc_en2_a1", "cls_hsc", "sub_hsc_en2", "div_academics", "Right Form of Verbs", "Choose the correct completion: 'Hardly had we reached the station when the train ___.'", JSON.stringify(["leaves", "left", "had left", "leaving"]), 1, "The correlative structure is 'Hardly had + V3 ... when + Past Simple (V2)'.", "Dhaka Board", "Easy"]
    ];

    const mcqStmts = seedMcqs.map(m =>
      db.prepare("INSERT OR IGNORE INTO academics_mcqs (id, classId, subjectId, divisionId, chapter, question, optionsJson, correctIndex, explanation, boardTag, difficulty, imageUrl, accessTier, packageId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', 'public', '', ?)").bind(...m, now)
    );
    await db.batch(mcqStmts);

    const seedCqs = [
      [
        "cq_hsc_phy1_a1", "cls_hsc", "sub_hsc_phy1", "div_academics", "Ch 6: Gravitation & Gravity",
        "Geostationary Satellite Orbital Mechanics", "HSC Dhaka Board",
        "An artificial communication satellite orbits Earth in a circular path at altitude h = 35,786 km above the equator. Earth's radius R = 6.4 × 10⁶ m and surface gravity g = 9.8 m/s².",
        "State Kepler's Third Law of planetary motion.",
        "The square of the orbital time period (T²) of any planet around the Sun is proportional to the cube of the semi-major axis (a³): T² ∝ a³.",
        "Why does an astronaut feel weightless inside an orbiting spacecraft?",
        "Both astronaut and spacecraft fall continuously toward Earth with equal centripetal acceleration, making normal floor reaction force N = 0.",
        "Determine the linear orbital velocity of the satellite.",
        "r = R + h = 42.186 × 10⁶ m. GM = gR² = 4.014 × 10¹⁴. v = √(GM/r) ≈ 3,085 m/s (3.085 km/s).",
        "Verify mathematically whether this satellite is geostationary.",
        "T = 2πr / v ≈ 85,920 s ≈ 23.87 hours ≈ 24 hours. Matching Earth's rotation period in the equatorial plane confirms it is geostationary."
      ],
      [
        "cq_hsc_ict_a1", "cls_hsc", "sub_hsc_ict", "div_academics", "Ch 3: Number System & Digital Devices",
        "Binary Arithmetic & 2's Complement Subtraction", "HSC Chattogram Board",
        "In an ICT lab test, Rakin scored (65)₁₀ and Mahim scored (52)₈.",
        "What is the radix (base) of a number system?",
        "The total number of unique digits/symbols used in a positional number system (e.g., 2 for binary, 10 for decimal, 16 for hex).",
        "Why is 2's complement preferred in digital computers?",
        "It eliminates +0/-0 ambiguity and allows subtraction to be performed with the same hardware adder circuit as addition.",
        "Convert (52)₈ into Decimal and Hexadecimal.",
        "Decimal: 5×8 + 2 = (42)₁₀. Hexadecimal: 42 ÷ 16 = 2 rem 10 (A) → (2A)₁₆.",
        "Compute Rakin's score minus Mahim's score using 8-bit 2's complement addition.",
        "+65 = 01000001₂, +42 = 00101010₂, -42 (2's comp) = 11010110₂. Sum = (1)00010111₂ → discarding carry gives +23."
      ],
      [
        "cq_hsc_chem2_c1", "cls_hsc", "sub_hsc_chem2", "div_college", "Ch 2: Organic Chemistry",
        "Markovnikov Addition & Alcohol Identification", "Notre Dame College Pre-Test",
        "Compound A (C₃H₆) reacts with HBr to yield major product B, which upon aqueous KOH hydrolysis produces secondary alcohol C.",
        "What is a functional group?",
        "An atom or group of atoms that determines the characteristic chemical reactions of an organic molecule.",
        "Why are alkenes more reactive than alkanes?",
        "Alkenes contain a weaker π-bond with exposed electron density that readily undergoes electrophilic addition reactions.",
        "Write the reactions forming B and C with IUPAC names.",
        "CH₃-CH=CH₂ (Propene) + HBr → CH₃-CH(Br)-CH₃ (2-bromopropane, B) by Markovnikov's rule.\nB + aq. KOH → CH₃-CH(OH)-CH₃ (Propan-2-ol, C).",
        "Explain how you would distinguish C from its primary isomer using the Lucas test.",
        "Propan-2-ol (2° alcohol) gives white turbidity with Lucas reagent (Conc. HCl + anhy. ZnCl₂) within 5–10 minutes, whereas propan-1-ol (1° alcohol) shows no turbidity at room temperature."
      ]
    ];

    await db.batch(seedCqs.map(c =>
      db.prepare("INSERT OR IGNORE INTO academics_cqs (id, classId, subjectId, divisionId, chapter, title, boardTag, stem, imageUrl, partA, ansA, partB, ansB, partC, ansC, partD, ansD, accessTier, packageId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', ?, ?, ?, ?, ?, ?, ?, ?, 'public', '', ?)").bind(...c, now)
    ));

    const seedNotes = [
      ["note_hsc_phy1_vec", "cls_hsc", "sub_hsc_phy1", "div_books", "Ch 2: Vector", "Physics 1st Paper: Vector & Mechanics Formula Book", "formula", "Resultant vectors, river-boat shortcuts, projectile motion & vector calculus.", "## Parallelogram Law\n- R = √(P² + Q² + 2PQ cosα)\n- tanθ = (Q sinα) / (P + Q cosα)\n\n## River-Boat Shortcuts\n- Minimum Time: tmin = d / v (α = 90°)\n- Shortest Path: cosα = -u / v\n\n## Projectile Motion\n- Time of flight: T = 2v₀sinθ / g\n- Max Height: H = v₀²sin²θ / (2g)\n- Range: R = v₀²sin(2θ) / g"],
      ["note_hsc_ict_book", "cls_hsc", "sub_hsc_ict", "div_books", "Ch 3: Number System & Digital Devices", "ICT Chapter 3: Number Systems & Logic Gates Concept Book", "formula", "Base conversions, De Morgan's laws, Half/Full adders & universal gates.", "## De Morgan's Theorems\n- (A + B)' = A' · B'\n- (A · B)' = A' + B'\n\n## Adder Equations\n- Half Adder: S = A ⊕ B, C = A · B\n- Full Adder: S = A ⊕ B ⊕ Cin, Cout = AB + Cin(A ⊕ B)"],
      ["note_hsc_chem2_book", "cls_hsc", "sub_hsc_chem2", "div_books", "Ch 2: Organic Chemistry", "Organic Chemistry Master Reaction & Identification Book", "note", "All essential HSC Board & Medical functional group tests in one sheet.", "## Key Tests\n- Unsaturation: Bromine water (Br₂/CCl₄) decolorizes\n- Aldehyde: Silver Mirror with Tollens' reagent\n- 1°/2°/3° Alcohol: Lucas Test (Conc. HCl + anhy. ZnCl₂)\n- Iodoform Test: Yellow CHI₃ crystals with I₂ + NaOH"]
    ];

    await db.batch(seedNotes.map(n =>
      db.prepare("INSERT OR IGNORE INTO academics_notes (id, classId, subjectId, divisionId, chapter, title, resourceType, summary, content, fileUrl, videoUrl, accessTier, packageId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', 'public', '', ?)").bind(...n, now)
    ));
  }
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

  const classes = clsRes.results || [];
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
    await seedHscCatalogIfNeeded(env.DB);
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
        String(body.icon || "🎓").trim(),
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
      if (!name) return jsonResp({ error: "Class name required" }, 400);
      const id = String(body.id || ("cls_" + Date.now().toString(36))).trim();
      const slug = String(body.slug || name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || id;
      await env.DB.prepare(`
        INSERT INTO academics_classes (id, slug, name, shortName, level, description, badge, accentColor, displayOrder, accessTier, packageId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          packageId = excluded.packageId
      `).bind(
        id,
        slug,
        name,
        String(body.shortName || name).trim(),
        String(body.level || "Higher Secondary").trim(),
        String(body.description || "").trim(),
        String(body.badge || "Active").trim(),
        String(body.accentColor || "#ea580c").trim(),
        Number(body.displayOrder) || 0,
        String(body.accessTier || "public").trim(),
        String(body.packageId || "").trim(),
        now
      ).run();
      return jsonResp({ success: true, id, ...(await fetchFullCatalog(env.DB)) });
    }

    if (action === "delete_class") {
      const id = String(body.id || "").trim();
      if (!id) return jsonResp({ error: "Class ID required" }, 400);
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
      if (!name) return jsonResp({ error: "Subject / Course name is required" }, 400);
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
        String(body.icon || "📘").trim(),
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
      const subjectId = String(body.subjectId || "").trim();
      const studentName = String(body.studentName || "").trim();
      const studentEmail = String(body.studentEmail || "").trim();
      if (!subjectId || !studentName || !studentEmail) {
        return jsonResp({ error: "Course, Full Name, and Email are required." }, 400);
      }
      const sub = await env.DB.prepare("SELECT name, price FROM academics_subjects WHERE id = ?").bind(subjectId).first();
      const id = "enr_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
      await env.DB.prepare(`
        INSERT INTO academics_enrollments (id, subjectId, subjectName, studentName, studentEmail, studentPhone, college, paymentMethod, trxId, amount, status, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
      `).bind(
        id,
        subjectId,
        sub?.name || String(body.subjectName || ""),
        studentName,
        studentEmail,
        String(body.studentPhone || "").trim(),
        String(body.college || "").trim(),
        String(body.paymentMethod || "bKash").trim(),
        String(body.trxId || "").trim(),
        Number(body.amount) || Number(sub?.price) || 0,
        now
      ).run();
      await env.DB.prepare("UPDATE academics_subjects SET studentCount = COALESCE(studentCount, 0) + 1 WHERE id = ?").bind(subjectId).run().catch(() => {});
      return jsonResp({ success: true, id, message: "Enrollment submitted! Our academic council will verify your payment shortly." });
    }

    if (action === "verify_access_code") {
      const subjectId = String(body.subjectId || "").trim();
      const code = String(body.code || "").trim();
      if (!subjectId || !code) return jsonResp({ error: "Access code required" }, 400);
      const sub = await env.DB.prepare("SELECT accessCode FROM academics_subjects WHERE id = ?").bind(subjectId).first();
      if (!sub || !sub.accessCode) return jsonResp({ error: "No access code configured for this course." }, 400);
      if (String(sub.accessCode).trim().toLowerCase() === code.toLowerCase()) {
        return jsonResp({ success: true, unlocked: true });
      }
      return jsonResp({ error: "Invalid access code. Please check your enrollment confirmation." }, 403);
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
