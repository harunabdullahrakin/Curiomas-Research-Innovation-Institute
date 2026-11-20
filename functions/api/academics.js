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
    `)
  ]);
}

async function seedDefaultAcademicsIfEmpty(db) {
  const countRow = await db.prepare("SELECT COUNT(*) AS c FROM academics_classes").first();
  if (countRow && Number(countRow.c) > 0) return;

  const now = new Date().toISOString();

  const seedClasses = [
    ["cls_ssc", "ssc", "SSC (Class 9–10)", "SSC", "Secondary", "Complete NCTB SSC Science & General curriculum: chapter-wise MCQs, Timed Auto-Exams, Creative Questions (CQ), and formula sheets.", "Board Prep", "#ea580c", 1, "public", "", now],
    ["cls_hsc", "hsc", "HSC (Class 11–12)", "HSC", "Higher Secondary", "Rigorous HSC 1st & 2nd Paper Physics, Chemistry, Higher Mathematics, Biology & ICT question banks, CQs, and model tests.", "College Prep", "#0ea5e9", 2, "public", "", now],
    ["cls_junior", "class-6-8", "Class 6–8 Foundation", "Class 6–8", "Junior Secondary", "Conceptual science, mathematics, and early Olympiad foundation resources for middle-school scholars.", "Foundation", "#10b981", 3, "public", "", now],
    ["cls_admission", "admission", "Admission & Olympiad", "Admission", "Competitive", "Engineering (BUET), Medical, University (DU/Ka Unit), and National Science Olympiad rapid MCQ drills with negative marking.", "Competitive", "#8b5cf6", 4, "public", "", now]
  ];

  const seedSubjects = [
    ["sub_ssc_phy", "cls_ssc", "Physics", "PHY-136", "⚛️", "Motion, Force, Work-Energy, Waves, Optics & Electricity", JSON.stringify(["Chapter 2: Motion", "Chapter 3: Force", "Chapter 4: Work, Power & Energy", "Chapter 7: Waves & Sound", "Chapter 11: Current Electricity"]), 1, "public", "", now],
    ["sub_ssc_chem", "cls_ssc", "Chemistry", "CHEM-137", "🧪", "Atomic Structure, Periodic Table, Chemical Bonding, Mole Concept & Organic Chemistry", JSON.stringify(["Chapter 3: Structure of Matter", "Chapter 4: Periodic Table", "Chapter 5: Chemical Bond", "Chapter 6: Concept of Mole", "Chapter 11: Mineral Resources - Fossils"]), 2, "public", "", now],
    ["sub_ssc_math", "cls_ssc", "Higher Mathematics", "HMATH-126", "📐", "Sets & Functions, Algebraic Expressions, Geometry, Trigonometry & Probability", JSON.stringify(["Chapter 1: Sets & Functions", "Chapter 8: Trigonometry", "Chapter 11: Coordinate Geometry", "Chapter 14: Probability"]), 3, "public", "", now],
    ["sub_ssc_bio", "cls_ssc", "Biology", "BIO-138", "🧬", "Cell Division, Bioenergetics, Transport in Organisms & Genetics", JSON.stringify(["Chapter 2: Cells & Tissues", "Chapter 3: Cell Division", "Chapter 4: Bioenergetics", "Chapter 12: Heredity in Organisms"]), 4, "public", "", now],
    ["sub_ssc_ict", "cls_ssc", "ICT", "ICT-154", "💻", "Information Society, Digital Troubleshooting, Multimedia & Databases", JSON.stringify(["Chapter 1: ICT & Bangladesh", "Chapter 4: Word & Spreadsheet", "Chapter 6: Database Management"]), 5, "public", "", now],
    ["sub_hsc_phy", "cls_hsc", "Physics (1st & 2nd Paper)", "PHY-174", "🔭", "Vectors, Newtonian Mechanics, Gravitation, Thermodynamics, Modern Physics & Semiconductors", JSON.stringify(["1st Paper Ch 2: Vector", "1st Paper Ch 4: Newtonian Mechanics", "1st Paper Ch 6: Gravitation & Gravity", "2nd Paper Ch 1: Thermodynamics", "2nd Paper Ch 8: Modern Physics"]), 1, "public", "", now],
    ["sub_hsc_chem", "cls_hsc", "Chemistry (1st & 2nd Paper)", "CHEM-176", "⚗️", "Qualitative Chemistry, Periodic Properties, Chemical Changes, Environmental & Organic Chemistry", JSON.stringify(["1st Paper Ch 2: Qualitative Chemistry", "1st Paper Ch 4: Chemical Changes", "2nd Paper Ch 1: Environmental Chemistry", "2nd Paper Ch 2: Organic Chemistry"]), 2, "public", "", now],
    ["sub_hsc_math", "cls_hsc", "Higher Math (1st & 2nd Paper)", "HMATH-265", "∑", "Matrices, Straight Lines, Calculus (Differentiation & Integration), Complex Numbers & Conics", JSON.stringify(["1st Paper Ch 1: Matrix & Determinant", "1st Paper Ch 9: Differentiation", "1st Paper Ch 10: Integration", "2nd Paper Ch 3: Complex Numbers"]), 3, "public", "", now],
    ["sub_hsc_bio", "cls_hsc", "Biology (Botany & Zoology)", "BIO-178", "🔬", "Cell & Its Structure, Cell Division, Biotechnology, Human Physiology & Genetics", JSON.stringify(["1st Paper Ch 1: Cell & Its Structure", "1st Paper Ch 11: Biotechnology", "2nd Paper Ch 4: Blood & Circulation", "2nd Paper Ch 11: Genetics & Evolution"]), 4, "public", "", now],
    ["sub_hsc_ict", "cls_hsc", "ICT (HSC)", "ICT-275", "🖥️", "Number Systems, Digital Logic Gates, HTML/Web Design, C Programming & SQL Databases", JSON.stringify(["Chapter 3: Number System & Digital Devices", "Chapter 4: Web Design & HTML", "Chapter 5: Programming Language (C)"]), 5, "public", "", now],
    ["sub_jr_sci", "cls_junior", "General Science & Math", "JR-SCI", "🌱", "Core mechanics, atoms, cells, algebra & geometry foundations", JSON.stringify(["Atoms & Molecules", "Light & Optics", "Algebraic Formulas"]), 1, "public", "", now],
    ["sub_adm_stem", "cls_admission", "STEM Rapid Drills", "ADM-01", "🚀", "BUET, Medical & DU high-speed conceptual physics, chemistry & calculus problems", JSON.stringify(["Mechanics & Gravitation", "Organic Reactions", "Calculus Shortcuts"]), 1, "public", "", now]
  ];

  const seedMcqs = [
    ["mcq_ssc_p1", "cls_ssc", "sub_ssc_phy", "Chapter 2: Motion", "A car starts from rest and accelerates uniformly at 4 m/s² for 5 seconds. What distance does it cover?", JSON.stringify(["20 m", "40 m", "50 m", "100 m"]), 2, "Using s = ut + ½at² with u = 0, a = 4 m/s², t = 5 s: s = 0 + 0.5 × 4 × 25 = 50 m.", "Dhaka Board", "Easy", "", "public", "", now],
    ["mcq_ssc_p2", "cls_ssc", "sub_ssc_phy", "Chapter 3: Force", "Which physical quantity is equivalent to the rate of change of momentum?", JSON.stringify(["Work", "Force", "Impulse", "Power"]), 1, "By Newton's Second Law of Motion, F = dp/dt = (mv - mu)/t.", "Rajshahi Board", "Easy", "", "public", "", now],
    ["mcq_ssc_p3", "cls_ssc", "sub_ssc_phy", "Chapter 4: Work, Power & Energy", "If the velocity of a moving body is doubled while its mass remains constant, its kinetic energy becomes:", JSON.stringify(["2 times", "4 times", "Half", "8 times"]), 1, "Kinetic energy Ek = ½mv². Since Ek ∝ v², doubling v increases Ek by 2² = 4 times.", "Chattogram Board", "Easy", "", "public", "", now],
    ["mcq_ssc_p4", "cls_ssc", "sub_ssc_phy", "Chapter 11: Current Electricity", "Three resistors of 6 Ω each are connected in parallel. What is their equivalent resistance?", JSON.stringify(["18 Ω", "6 Ω", "3 Ω", "2 Ω"]), 3, "1/Rp = 1/6 + 1/6 + 1/6 = 3/6 = 1/2, so Rp = 2 Ω.", "Sylhet Board", "Medium", "", "public", "", now],
    ["mcq_ssc_c1", "cls_ssc", "sub_ssc_chem", "Chapter 3: Structure of Matter", "What is the maximum number of electrons that can occupy the M-shell (n = 3) of an atom?", JSON.stringify(["8", "18", "32", "2"]), 1, "Maximum capacity of shell n is 2n². For M-shell (n = 3), 2 × 3² = 18 electrons.", "Dhaka Board", "Easy", "", "public", "", now],
    ["mcq_ssc_c2", "cls_ssc", "sub_ssc_chem", "Chapter 6: Concept of Mole", "How many molecules are present in 18 grams of pure water (H₂O)?", JSON.stringify(["6.023 × 10²³", "3.011 × 10²³", "1.204 × 10²⁴", "18 × 10²³"]), 0, "Molar mass of H₂O = 2(1) + 16 = 18 g/mol. Therefore 18 g = 1 mole = Avogadro's number (6.023 × 10²³) molecules.", "Cumilla Board", "Easy", "", "public", "", now],
    ["mcq_ssc_m1", "cls_ssc", "sub_ssc_math", "Chapter 8: Trigonometry", "What is the exact value of sin²(30°) + cos²(30°)?", JSON.stringify(["0", "1/2", "1", "√3/2"]), 2, "Fundamental Pythagorean trigonometric identity: sin²θ + cos²θ = 1 for any angle θ.", "Jessore Board", "Easy", "", "public", "", now],
    ["mcq_ssc_b1", "cls_ssc", "sub_ssc_bio", "Chapter 4: Bioenergetics", "In which organelle does the Krebs cycle of aerobic cellular respiration occur?", JSON.stringify(["Chloroplast", "Ribosome", "Mitochondria", "Golgi body"]), 2, "Glycolysis takes place in the cytoplasm, while the Krebs cycle and electron transport chain occur inside the mitochondria.", "Dinajpur Board", "Easy", "", "public", "", now],
    ["mcq_hsc_p1", "cls_hsc", "sub_hsc_phy", "1st Paper Ch 2: Vector", "Two vectors A and B are perpendicular to each other. What is the value of their dot product A · B?", JSON.stringify(["AB", "0", "-AB", "1"]), 1, "A · B = |A||B|cos(90°) = 0. Zero dot product is the condition for orthogonality.", "HSC Dhaka Board", "Easy", "", "public", "", now],
    ["mcq_hsc_p2", "cls_hsc", "sub_hsc_phy", "1st Paper Ch 6: Gravitation & Gravity", "What is the approximate escape velocity from the surface of the Earth?", JSON.stringify(["7.9 km/s", "9.8 km/s", "11.2 km/s", "16.5 km/s"]), 2, "Escape velocity ve = √(2gR) ≈ √(2 × 9.8 × 6.4 × 10⁶) ≈ 11.2 km/s.", "HSC Rajshahi Board", "Easy", "", "public", "", now],
    ["mcq_hsc_p3", "cls_hsc", "sub_hsc_phy", "2nd Paper Ch 1: Thermodynamics", "In an isothermal process of an ideal gas, which quantity remains constant?", JSON.stringify(["Pressure", "Volume", "Internal Energy", "Entropy"]), 2, "For an ideal gas, internal energy U depends solely on absolute temperature T. Since ΔT = 0 in an isothermal process, ΔU = 0.", "HSC Sylhet Board", "Medium", "", "public", "", now],
    ["mcq_hsc_p4", "cls_hsc", "sub_hsc_phy", "2nd Paper Ch 8: Modern Physics", "According to Einstein's photoelectric equation, the maximum kinetic energy of emitted photoelectrons depends linearly on:", JSON.stringify(["Intensity of incident light", "Frequency of incident light", "Duration of exposure", "Surface area of metal"]), 1, "Kmax = hf - φ. Above threshold frequency f₀, Kmax increases linearly with photon frequency f, independent of intensity.", "HSC Cumilla Board", "Medium", "", "public", "", now],
    ["mcq_hsc_c1", "cls_hsc", "sub_hsc_chem", "1st Paper Ch 2: Qualitative Chemistry", "Which set of quantum numbers (n, l, m, s) is NOT valid for an electron?", JSON.stringify(["(3, 2, -1, +1/2)", "(2, 1, 0, -1/2)", "(3, 3, 0, +1/2)", "(4, 0, 0, +1/2)"]), 2, "Azimuthal quantum number l must satisfy 0 ≤ l ≤ n - 1. For n = 3, l cannot be 3.", "HSC Dhaka Board", "Medium", "", "public", "", now],
    ["mcq_hsc_c2", "cls_hsc", "sub_hsc_chem", "2nd Paper Ch 2: Organic Chemistry", "Which reagent is used in the Lucas test to distinguish primary, secondary, and tertiary alcohols?", JSON.stringify(["Conc. HCl + Anhydrous ZnCl₂", "Dil. H₂SO₄ + K₂Cr₂O₇", "Tollens' reagent", "Fehling's solution"]), 0, "Lucas reagent is concentrated HCl with anhydrous ZnCl₂. Tertiary alcohols give immediate turbidity, secondary within 5–10 min, and primary only on heating.", "Medical Admission", "Medium", "", "public", "", now],
    ["mcq_hsc_m1", "cls_hsc", "sub_hsc_math", "1st Paper Ch 9: Differentiation", "What is the derivative of f(x) = ln(sin x) with respect to x?", JSON.stringify(["tan x", "cot x", "sec x", "csc x"]), 1, "By chain rule: d/dx [ln(sin x)] = (1 / sin x) · cos x = cot x.", "HSC Jessore Board", "Easy", "", "public", "", now],
    ["mcq_hsc_ict1", "cls_hsc", "sub_hsc_ict", "Chapter 3: Number System & Digital Devices", "What is the binary equivalent of the decimal number 25?", JSON.stringify(["11001", "10101", "11011", "10011"]), 0, "25 = 16 + 8 + 1 = 1·2⁴ + 1·2³ + 0·2² + 0·2¹ + 1·2⁰ = (11001)₂.", "HSC Barishal Board", "Easy", "", "public", "", now],
    ["mcq_hsc_ict2", "cls_hsc", "sub_hsc_ict", "Chapter 3: Number System & Digital Devices", "Which logic gates are called Universal Gates because any Boolean function can be built from them alone?", JSON.stringify(["AND & OR", "XOR & XNOR", "NAND & NOR", "NOT & AND"]), 2, "Both NAND and NOR gates are functionally complete universal gates.", "HSC Dhaka Board", "Easy", "", "public", "", now],
    ["mcq_adm_1", "cls_admission", "sub_adm_stem", "Mechanics & Gravitation", "A projectile is launched at 45° with speed v. At the highest point of its trajectory, its kinetic energy is what fraction of its initial kinetic energy E?", JSON.stringify(["0", "E / 4", "E / 2", "E / √2"]), 2, "At max height, vertical velocity vy = 0 and horizontal velocity vx = v cos(45°) = v/√2. So K = ½m(v/√2)² = E/2.", "BUET Admission", "Hard", "", "public", "", now]
  ];

  const seedCqs = [
    [
      "cq_ssc_phy_1", "cls_ssc", "sub_ssc_phy", "Chapter 4: Work, Power & Energy",
      "Free-Fall Conservation of Mechanical Energy", "SSC Dhaka Board",
      "An object of mass 2 kg is dropped freely from the roof of a building of height 40 m (take g = 9.8 m/s²). Air resistance is negligible.",
      "",
      "Define 1 Joule of work.",
      "When a force of 1 Newton displaces an object by 1 meter in the direction of the force, the work done is called 1 Joule (1 J = 1 N·m).",
      "Why does an athlete run a short distance before taking a long jump?",
      "By running first, the athlete acquires horizontal inertia of motion (momentum). At take-off, this forward momentum combines with the upward push, allowing a much longer horizontal jump distance.",
      "Calculate the velocity of the object right before hitting the ground.",
      "Given: u = 0 m/s, h = 40 m, g = 9.8 m/s².\nUsing v² = u² + 2gh:\nv² = 0 + 2 × 9.8 × 40 = 784\nv = √784 = 28 m/s.\nTherefore, the impact velocity is 28 m/s.",
      "Mathematically verify that the total mechanical energy at height 15 m above the ground equals the initial energy at the roof.",
      "1) At roof (h = 40 m): Ep = mgh = 2 × 9.8 × 40 = 784 J, Ek = 0 J → Total E₁ = 784 J.\n2) At height h' = 15 m (fallen distance x = 40 - 15 = 25 m):\n   Ep' = mgh' = 2 × 9.8 × 15 = 294 J.\n   v'² = 2gx = 2 × 9.8 × 25 = 490 → Ek' = ½mv'² = 0.5 × 2 × 490 = 490 J.\n   Total E₂ = 294 + 490 = 784 J.\nSince E₁ = E₂ = 784 J, the Law of Conservation of Mechanical Energy is verified.",
      "public", "", now
    ],
    [
      "cq_ssc_chem_1", "cls_ssc", "sub_ssc_chem", "Chapter 5: Chemical Bond",
      "Ionic vs Covalent Bonding in Sodium Chloride & Water", "SSC Rajshahi Board",
      "Two elements X and Y have atomic numbers 11 and 17 respectively, while element Z has atomic number 8.",
      "",
      "What is a valence electron?",
      "The electrons present in the outermost energy shell (valence shell) of an atom are called valence electrons.",
      "Why is Helium chemically inert?",
      "Helium (atomic number 2) has electron configuration 1s². Its first and only shell is completely filled (duplet rule satisfied), so it neither donates, accepts, nor shares electrons.",
      "Explain the bond formation mechanism between elements X and Y.",
      "X (Z = 11) is Sodium (Na: 2, 8, 1) and Y (Z = 17) is Chlorine (Cl: 2, 8, 7).\nNa donates its 1 valence electron to form Na⁺ (2, 8), achieving Neon's stable octet. Cl accepts that electron to form Cl⁻ (2, 8, 8), achieving Argon's stable octet.\nStrong electrostatic attraction binds Na⁺ and Cl⁻ into ionic compound NaCl.",
      "Analyze whether the compound XY is soluble in polar solvent H₂Z (water).",
      "Z (Z = 8) is Oxygen, so H₂Z is Water (H₂O), a polar covalent molecule with partial δ⁻ on O and δ⁺ on H.\nWhen ionic NaCl is added to H₂O, the δ⁻ oxygen ends attract Na⁺ ions while the δ⁺ hydrogen ends attract Cl⁻ ions, overcoming the crystal lattice energy (hydration).\nHence NaCl dissolves readily in water and conducts electricity in aqueous solution.",
      "public", "", now
    ],
    [
      "cq_hsc_phy_1", "cls_hsc", "sub_hsc_phy", "1st Paper Ch 6: Gravitation & Gravity",
      "Geostationary Satellite Orbital Mechanics", "HSC Dhaka Board",
      "An artificial communication satellite orbits Earth in a circular path at an altitude of h = 35,786 km above the equatorial surface. Earth's radius R = 6.4 × 10⁶ m and surface gravity g = 9.8 m/s².",
      "",
      "State Kepler's Third Law of planetary motion.",
      "The square of the orbital time period (T²) of any planet around the Sun is directly proportional to the cube of the semi-major axis (a³) of its elliptical orbit: T² ∝ a³.",
      "Why does an astronaut feel weightless inside an orbiting spacecraft?",
      "Both the astronaut and the spacecraft are continuously in free fall toward Earth with the same centripetal acceleration (g'). Because there is zero normal reaction force from the floor on the astronaut (N = 0), apparent weight is zero.",
      "Determine the linear orbital velocity of the satellite at this altitude.",
      "Orbital radius r = R + h = 6.4×10⁶ + 35.786×10⁶ = 42.186 × 10⁶ m.\nSince GM = gR² = 9.8 × (6.4×10⁶)² = 4.014 × 10¹⁴ N·m²/kg.\nOrbital speed v = √(GM / r) = √(4.014×10¹⁴ / 42.186×10⁶) ≈ 3,085 m/s (3.085 km/s).",
      "Verify mathematically whether this satellite can serve as a geostationary communication satellite over Bangladesh.",
      "Time period T = 2πr / v = (2 × 3.1416 × 42.186×10⁶) / 3085 ≈ 85,920 seconds ≈ 23.87 hours ≈ 24 hours.\nSince T matches Earth's sidereal rotation period (~23h 56m) and it orbits in the equatorial plane from West to East, it appears stationary from Earth and is ideal for continuous telecommunications.",
      "public", "", now
    ],
    [
      "cq_hsc_ict_1", "cls_hsc", "sub_hsc_ict", "Chapter 3: Number System & Digital Devices",
      "Binary Arithmetic & 2's Complement Subtraction", "HSC Chattogram Board",
      "In an ICT laboratory quiz, Rakin scored (65)₁₀ marks and Mahim scored (52)₈ marks in Practical Robotics.",
      "",
      "What is a radix (base) of a number system?",
      "The total number of unique digits/symbols used to represent numbers in a positional number system is called its base or radix (e.g., 2 for binary, 10 for decimal, 16 for hexadecimal).",
      "Explain why 2's complement is preferred over sign-magnitude form in digital computers.",
      "In 2's complement, zero has only one unique representation (no +0 and -0 ambiguity), and subtraction is performed using the exact same hardware adder circuit as addition.",
      "Convert Mahim's score (52)₈ into Decimal and Hexadecimal.",
      "Decimal: 5×8¹ + 2×8⁰ = 40 + 2 = (42)₁₀.\nHexadecimal: 42 ÷ 16 = 2 remainder 10 (A) → (2A)₁₆.",
      "Calculate the difference between Rakin's and Mahim's scores using 8-bit 2's complement addition.",
      "Rakin = +65 = 01000001₂.\nMahim = +42 = 00101010₂.\n1's complement of 42 = 11010101₂.\n2's complement (-42) = 11010101 + 1 = 11010110₂.\nAdd (+65) + (-42): 01000001 + 11010110 = (1) 00010111₂.\nDiscarding carry bit: 00010111₂ = 16 + 4 + 2 + 1 = +23. Verified: 65 - 42 = 23.",
      "public", "", now
    ]
  ];

  const seedNotes = [
    [
      "note_ssc_phy_formulas", "cls_ssc", "sub_ssc_phy", "Chapter 2: Motion",
      "SSC Physics Master Formula Sheet (Chapters 2–11)", "formula",
      "Essential kinematics, Newton's laws, work-energy, waves, and Ohm's law equations for quick pre-exam revision.",
      "## Kinematics (Uniform Acceleration)\n- v = u + at\n- s = ut + ½at²\n- v² = u² + 2as\n- s = ((u + v) / 2) × t\n\n## Force & Momentum\n- Momentum: p = mv\n- Newton's 2nd Law: F = ma = (mv - mu)/t\n- Conservation of Momentum: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂\n\n## Work, Power & Energy\n- Work: W = Fs cosθ\n- Kinetic Energy: Ek = ½mv² = p²/(2m)\n- Potential Energy: Ep = mgh\n- Power: P = W/t = Fv\n- Efficiency: η = (Useful Output / Total Input) × 100%\n\n## Electricity\n- Ohm's Law: V = IR\n- Series: Rs = R₁ + R₂ + ...\n- Parallel: 1/Rp = 1/R₁ + 1/R₂ + ...\n- Electrical Power: P = VI = I²R = V²/R",
      "", "", "public", "", now
    ],
    [
      "note_hsc_phy_vec", "cls_hsc", "sub_hsc_phy", "1st Paper Ch 2: Vector",
      "HSC Physics: Vector Algebra, Dot & Cross Product Guide", "note",
      "Complete revision notes on resultant vectors, river-boat problems, rain-umbrella angle, gradient, divergence, and curl.",
      "## Parallelogram Law of Vector Addition\n- Resultant magnitude: R = √(P² + Q² + 2PQ cosα)\n- Angle with P: tanθ = (Q sinα) / (P + Q cosα)\n- Max resultant: Rmax = P + Q (α = 0°)\n- Min resultant: Rmin = |P - Q| (α = 180°)\n\n## River-Boat Crossing Shortcuts\n- Minimum time to cross width d: tmin = d / v (steer perpendicular to bank, α = 90°)\n- Shortest distance (straight across): cosα = -u / v (requires boat speed v > river speed u)\n\n## Vector Calculus (Del Operator ∇)\n- Gradient (∇φ): converts scalar field to vector field\n- Divergence (∇·V = 0): solenoidal vector field\n- Curl (∇×V = 0): irrotational / conservative vector field",
      "", "", "public", "", now
    ],
    [
      "note_hsc_ict_gates", "cls_hsc", "sub_hsc_ict", "Chapter 3: Number System & Digital Devices",
      "HSC ICT: Number Conversions & De Morgan's Laws Cheat Sheet", "formula",
      "Binary/Octal/Hex shortcuts, Boolean identities, De Morgan's theorems, and universal gate conversions.",
      "## Quick Base Conversions\n- Binary ↔ Octal: Group 3 bits from binary point (e.g. 110 101₂ = 65₈)\n- Binary ↔ Hex: Group 4 bits from binary point (e.g. 1010 1111₂ = AF₁₆)\n\n## Key Boolean & De Morgan Identities\n- (A + B)' = A' · B'\n- (A · B)' = A' + B'\n- A + A'B = A + B\n- A + AB = A\n- XOR: A ⊕ B = A'B + AB'\n- XNOR: (A ⊕ B)' = AB + A'B'\n\n## Adder Circuits\n- Half Adder: Sum = A ⊕ B, Carry = A · B\n- Full Adder: Built using 2 Half Adders + 1 OR gate",
      "", "", "public", "", now
    ],
    [
      "note_hsc_chem_org", "cls_hsc", "sub_hsc_chem", "2nd Paper Ch 2: Organic Chemistry",
      "HSC Chemistry: Must-Know Organic Identification Tests", "note",
      "Rapid table of Bromine water, Tollens', Fehling's, Lucas, Iodoform, and 2,4-DNPH identification tests.",
      "## Classic Functional Group Identification Tests\n- Unsaturation (Alkene/Alkyne): Decolorizes orange-red Bromine water (Br₂/CCl₄) & purple Baeyer's reagent (alkaline KMnO₄).\n- Terminal Alkyne (-C≡CH): White precipitate with ammoniacal AgNO₃; red precipitate with ammoniacal Cu₂Cl₂.\n- Alcohols (1°/2°/3°): Lucas Test (Conc. HCl + anhy. ZnCl₂) — 3° immediate, 2° ~5 min, 1° only on heating.\n- Aldehydes vs Ketones: Both give yellow/orange ppt with 2,4-DNPH. Only Aldehydes give Silver Mirror with Tollens' reagent & brick-red Cu₂O ppt with Fehling's solution.\n- Methyl Ketones / Ethanol / Ethanal: Yellow crystal precipitate of CHI₃ (Iodoform Test with I₂ + NaOH).",
      "", "", "public", "", now
    ]
  ];

  const stmts = [];
  for (const r of seedClasses) {
    stmts.push(db.prepare("INSERT OR IGNORE INTO academics_classes (id, slug, name, shortName, level, description, badge, accentColor, displayOrder, accessTier, packageId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(...r));
  }
  for (const r of seedSubjects) {
    stmts.push(db.prepare("INSERT OR IGNORE INTO academics_subjects (id, classId, name, code, icon, description, chaptersJson, displayOrder, accessTier, packageId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(...r));
  }
  for (const r of seedMcqs) {
    stmts.push(db.prepare("INSERT OR IGNORE INTO academics_mcqs (id, classId, subjectId, chapter, question, optionsJson, correctIndex, explanation, boardTag, difficulty, imageUrl, accessTier, packageId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(...r));
  }
  for (const r of seedCqs) {
    stmts.push(db.prepare("INSERT OR IGNORE INTO academics_cqs (id, classId, subjectId, chapter, title, boardTag, stem, imageUrl, partA, ansA, partB, ansB, partC, ansC, partD, ansD, accessTier, packageId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(...r));
  }
  for (const r of seedNotes) {
    stmts.push(db.prepare("INSERT OR IGNORE INTO academics_notes (id, classId, subjectId, chapter, title, resourceType, summary, content, fileUrl, videoUrl, accessTier, packageId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(...r));
  }

  await db.batch(stmts);
}

async function fetchFullCatalog(db) {
  const [clsRes, subRes, mcqRes, cqRes, noteRes] = await Promise.all([
    db.prepare("SELECT * FROM academics_classes ORDER BY displayOrder ASC, createdAt ASC").all(),
    db.prepare("SELECT * FROM academics_subjects ORDER BY displayOrder ASC, createdAt ASC").all(),
    db.prepare("SELECT * FROM academics_mcqs ORDER BY createdAt DESC").all(),
    db.prepare("SELECT * FROM academics_cqs ORDER BY createdAt DESC").all(),
    db.prepare("SELECT * FROM academics_notes ORDER BY createdAt DESC").all()
  ]);

  const classes = clsRes.results || [];
  const subjects = (subRes.results || []).map(s => ({
    ...s,
    chapters: safeJsonParse(s.chaptersJson, [])
  }));
  const mcqs = (mcqRes.results || []).map(m => ({
    ...m,
    options: safeJsonParse(m.optionsJson, ["", "", "", ""])
  }));
  const cqs = cqRes.results || [];
  const notes = noteRes.results || [];

  return {
    classes,
    subjects,
    mcqs,
    cqs,
    notes,
    stats: {
      classes: classes.length,
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
    await seedDefaultAcademicsIfEmpty(env.DB);
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
        String(body.level || "General").trim(),
        String(body.description || "").trim(),
        String(body.badge || "Public").trim(),
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
      const classId = String(body.classId || "").trim();
      if (!name || !classId) return jsonResp({ error: "Subject name and Class are required" }, 400);
      const id = String(body.id || ("sub_" + Date.now().toString(36))).trim();
      const chapters = Array.isArray(body.chapters)
        ? body.chapters.map(c => String(c).trim()).filter(Boolean)
        : String(body.chapters || "").split(/\r?\n|,/).map(c => c.trim()).filter(Boolean);
      await env.DB.prepare(`
        INSERT INTO academics_subjects (id, classId, name, code, icon, description, chaptersJson, displayOrder, accessTier, packageId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          classId = excluded.classId,
          name = excluded.name,
          code = excluded.code,
          icon = excluded.icon,
          description = excluded.description,
          chaptersJson = excluded.chaptersJson,
          displayOrder = excluded.displayOrder,
          accessTier = excluded.accessTier,
          packageId = excluded.packageId
      `).bind(
        id,
        classId,
        name,
        String(body.code || "").trim(),
        String(body.icon || "📘").trim(),
        String(body.description || "").trim(),
        JSON.stringify(chapters),
        Number(body.displayOrder) || 0,
        String(body.accessTier || "public").trim(),
        String(body.packageId || "").trim(),
        now
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
      const classId = String(body.classId || "").trim();
      const subjectId = String(body.subjectId || "").trim();
      const options = Array.isArray(body.options) ? body.options.map(o => String(o || "").trim()) : [];
      if (!question || !classId || !subjectId || options.filter(Boolean).length < 2) {
        return jsonResp({ error: "Class, Subject, Question, and at least 2 options are required." }, 400);
      }
      const id = String(body.id || ("mcq_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5))).trim();
      await env.DB.prepare(`
        INSERT INTO academics_mcqs (id, classId, subjectId, chapter, question, optionsJson, correctIndex, explanation, boardTag, difficulty, imageUrl, accessTier, packageId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          classId = excluded.classId,
          subjectId = excluded.subjectId,
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
      const classId = String(body.classId || "").trim();
      const subjectId = String(body.subjectId || "").trim();
      if (!classId || !subjectId || items.length === 0) {
        return jsonResp({ error: "Class, Subject, and MCQ items array are required." }, 400);
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
            INSERT INTO academics_mcqs (id, classId, subjectId, chapter, question, optionsJson, correctIndex, explanation, boardTag, difficulty, imageUrl, accessTier, packageId, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            id,
            classId,
            subjectId,
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
      const classId = String(body.classId || "").trim();
      const subjectId = String(body.subjectId || "").trim();
      const stem = String(body.stem || "").trim();
      if (!classId || !subjectId || !stem) {
        return jsonResp({ error: "Class, Subject, and Uddipok/Stem are required." }, 400);
      }
      const id = String(body.id || ("cq_" + Date.now().toString(36))).trim();
      await env.DB.prepare(`
        INSERT INTO academics_cqs (id, classId, subjectId, chapter, title, boardTag, stem, imageUrl, partA, ansA, partB, ansB, partC, ansC, partD, ansD, accessTier, packageId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          classId = excluded.classId,
          subjectId = excluded.subjectId,
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
      const classId = String(body.classId || "").trim();
      const subjectId = String(body.subjectId || "").trim();
      const title = String(body.title || "").trim();
      if (!classId || !subjectId || !title) {
        return jsonResp({ error: "Class, Subject, and Resource Title are required." }, 400);
      }
      const id = String(body.id || ("note_" + Date.now().toString(36))).trim();
      await env.DB.prepare(`
        INSERT INTO academics_notes (id, classId, subjectId, chapter, title, resourceType, summary, content, fileUrl, videoUrl, accessTier, packageId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          classId = excluded.classId,
          subjectId = excluded.subjectId,
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
