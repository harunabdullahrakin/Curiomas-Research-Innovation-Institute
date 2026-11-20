(function () {
  const OFFLINE_CACHE_KEY = 'crii_academics_offline_cache_v2';
  const HISTORY_KEY = 'crii_academics_exam_history_v1';
  const BOOKMARKS_KEY = 'crii_academics_bookmarks_v1';
  const UNLOCKED_KEY = 'crii_academics_unlocked_v1';

  let catalog = { classes: [], divisions: [], subjects: [], mcqs: [], cqs: [], notes: [], stats: {} };
  let subjectFilter = 'all';
  let subjectSearch = '';
  let currentView = 'catalog';
  let selectedSubjectId = null;
  let selectedDivisionId = null;
  let selectedQMode = 'mcq';
  let mcqSubMode = 'exam';
  let activeChapter = 'all';
  let workspaceSearch = '';

  let examState = null;
  let examTimerHandle = null;
  let cqTimerHandles = {};
  let practiceAnswers = {};

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function saveJson(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  function getUnlockedIds() {
    return loadJson(UNLOCKED_KEY, []);
  }

  function isSubjectLocked(sub) {
    if (!sub) return false;
    const isPaid = sub.accessTier === 'paid' || Number(sub.price) > 0;
    if (!isPaid) return false;
    return !getUnlockedIds().includes(sub.id);
  }

  function getBookmarks() {
    return loadJson(BOOKMARKS_KEY, { mcqs: [], cqs: [] });
  }

  function getHistory() {
    return loadJson(HISTORY_KEY, []);
  }

  function getSubjectById(id) {
    return catalog.subjects.find((s) => s.id === id) || null;
  }

  function getDivisionById(id) {
    return catalog.divisions.find((d) => d.id === id) || null;
  }

  function formatSimpleMd(md) {
    const lines = String(md || '').replace(/\r\n/g, '\n').split('\n');
    const out = [];
    let inUl = false;
    const closeUl = () => { if (inUl) { out.push('</ul>'); inUl = false; } };
    for (const raw of lines) {
      const line = raw.trim();
      if (!line) { closeUl(); continue; }
      if (/^###\s+/.test(line)) {
        closeUl();
        out.push(`<h4 style="margin:0.85rem 0 0.35rem; font-size:0.98rem; color:#0f172a;">${esc(line.replace(/^###\s+/, ''))}</h4>`);
      } else if (/^#{1,2}\s+/.test(line)) {
        closeUl();
        out.push(`<h3 style="margin:1rem 0 0.4rem; font-size:1.08rem; color:#ea580c; border-bottom:1px solid #f1ece4; padding-bottom:0.25rem;">${esc(line.replace(/^#{1,2}\s+/, ''))}</h3>`);
      } else if (/^[-*•]\s+/.test(line)) {
        if (!inUl) { out.push('<ul style="margin:0.35rem 0 0.7rem; padding-left:1.35rem; display:flex; flex-direction:column; gap:0.28rem;">'); inUl = true; }
        out.push(`<li style="color:#334155; font-size:0.9rem; line-height:1.55;">${esc(line.replace(/^[-*•]\s+/, ''))}</li>`);
      } else {
        closeUl();
        out.push(`<p style="margin:0.35rem 0; color:#334155; font-size:0.9rem; line-height:1.6;">${esc(line)}</p>`);
      }
    }
    closeUl();
    return out.join('');
  }

  function updateOfflineBadge(fromCache) {
    const badge = document.getElementById('acadOfflineBadge');
    const strip = document.getElementById('acadStatsStrip');
    if (badge) {
      if (!navigator.onLine) {
        badge.textContent = '📡 Offline Mode Active';
        badge.style.background = 'rgba(245,158,11,0.16)';
        badge.style.color = '#b45309';
      } else {
        badge.textContent = fromCache ? '✓ Offline DB Ready' : '✓ Live & Offline Cached';
        badge.style.background = 'rgba(16,185,129,0.14)';
        badge.style.color = '#059669';
      }
    }
    if (strip) {
      strip.textContent = `${catalog.subjects.length} HSC Subjects • ${catalog.divisions.length} Tracks • ${catalog.mcqs.length} MCQs • ${catalog.cqs.length} CQs • ${catalog.notes.length} Books/Notes`;
    }
  }

  function setView(viewName) {
    currentView = viewName;
    ['catalog', 'enroll', 'workspace', 'stats'].forEach((v) => {
      const el = document.getElementById('acad' + v.charAt(0).toUpperCase() + v.slice(1) + 'View');
      if (el) el.style.display = v === viewName ? 'block' : 'none';
    });
    if (viewName === 'catalog') renderSubjectsCatalog();
    else if (viewName === 'enroll') renderCourseEnrollView();
    else if (viewName === 'workspace') renderWorkspaceView();
    else if (viewName === 'stats') renderStatsView();
    window.scrollTo({ top: 180, behavior: 'smooth' });
  }

  function renderSubjectsCatalog() {
    const grid = document.getElementById('acadSubjectsGrid');
    if (!grid) return;

    const pillBar = document.getElementById('acadCatalogFilterPills');
    if (pillBar) {
      pillBar.querySelectorAll('button').forEach((b) => {
        const act = b.dataset.cfilter === subjectFilter;
        b.classList.toggle('btn-primary', act);
        b.classList.toggle('btn-secondary', !act);
      });
    }

    const q = subjectSearch.toLowerCase();
    const list = catalog.subjects.filter((s) => {
      const isPaid = s.accessTier === 'paid' || Number(s.price) > 0;
      const isLangOrIct = /bangla|english|ict/i.test(s.name || '');
      if (subjectFilter === 'science' && isLangOrIct) return false;
      if (subjectFilter === 'lang_ict' && !isLangOrIct) return false;
      if (subjectFilter === 'free' && isPaid) return false;
      if (subjectFilter === 'paid' && !isPaid) return false;
      if (q) {
        const hay = [s.name, s.code, s.description, s.badgeText, ...(s.chapters || [])].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (list.length === 0) {
      grid.innerHTML = '<div class="acad-glass-panel" style="grid-column:1 / -1; padding:2.5rem; text-align:center; color:#64748b;">No HSC subjects match this filter. Try switching back to "All HSC Subjects".</div>';
      return;
    }

    grid.innerHTML = list.map((s) => {
      const mc = catalog.mcqs.filter((m) => m.subjectId === s.id).length;
      const cc = catalog.cqs.filter((c) => c.subjectId === s.id).length;
      const nc = catalog.notes.filter((n) => n.subjectId === s.id).length;
      const isPaid = s.accessTier === 'paid' || Number(s.price) > 0;
      const locked = isSubjectLocked(s);
      const saveAmt = s.originalPrice > s.price && s.price > 0 ? Math.round(s.originalPrice - s.price) : 0;
      const imgSrc = s.imageUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80';
      const included = Array.isArray(s.includedCourses) ? s.includedCourses : [];

      return `
        <article class="acad-course-card">
          <div class="acad-course-media" onclick="window.handleSubjectCardClick('${esc(s.id)}')" style="cursor:pointer;">
            <img src="${esc(imgSrc)}" alt="${esc(s.name)}" loading="lazy" onerror="this.src='/assets/curiomas-no-bg.png'; this.style.objectFit='contain'; this.style.padding='1.5rem';">
            <div class="acad-course-media-overlay"></div>
            <span class="acad-course-badge-left">${esc(s.icon || '📘')} ${esc(s.badgeText || s.code || 'HSC')}</span>
            <span class="acad-course-badge-right ${locked ? 'locked' : 'free'}">${locked ? '🔒 Locked' : isPaid ? '✓ Unlocked' : '✓ Free'}</span>
          </div>

          <div class="acad-course-body">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
                <span style="font-size:0.72rem; font-weight:700; color:#ea580c; letter-spacing:0.04em; text-transform:uppercase;">${esc(s.code || 'HSC SUBJECT')}</span>
                <span style="font-size:0.74rem; color:#64748b; font-weight:600;">👥 ${(Number(s.studentCount) || 0).toLocaleString()} students</span>
              </div>
              <h3 style="margin:0 0 0.4rem; font-size:1.18rem; line-height:1.25; cursor:pointer;" onclick="window.handleSubjectCardClick('${esc(s.id)}')">${esc(s.name)}</h3>
              <p style="margin:0 0 0.7rem; font-size:0.82rem; color:#64748b; line-height:1.5; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${esc(s.description || '')}</p>

              ${included.length > 0 ? `
                <div style="background:rgba(15,23,42,0.03); border:1px solid rgba(15,23,42,0.07); border-radius:12px; padding:0.65rem; margin-bottom:0.7rem;">
                  <div style="font-size:0.72rem; font-weight:700; color:#475569; margin-bottom:0.4rem; text-align:center;">Included Courses (${included.length}):</div>
                  <div style="display:flex; flex-direction:column; gap:0.3rem;">
                    ${included.slice(0, 4).map((inc) => `<div style="font-size:0.76rem; color:#2563eb; font-weight:600; background:rgba(37,99,235,0.06); border:1px solid rgba(37,99,235,0.16); border-radius:8px; padding:0.32rem 0.55rem; text-align:center;">${esc(inc)}</div>`).join('')}
                  </div>
                </div>
              ` : ''}

              <div style="display:flex; gap:0.4rem; flex-wrap:wrap; font-size:0.73rem; font-weight:700; color:#475569;">
                <span style="padding:2px 8px; border-radius:8px; background:rgba(234,88,12,0.09); color:#ea580c;">⚡ ${mc} MCQs</span>
                <span style="padding:2px 8px; border-radius:8px; background:rgba(14,165,233,0.1); color:#0284c7;">📝 ${cc} CQs</span>
                <span style="padding:2px 8px; border-radius:8px; background:rgba(16,185,129,0.1); color:#059669;">📚 ${nc} Books</span>
              </div>
            </div>

            <div style="border-top:1px solid rgba(15,23,42,0.08); padding-top:0.8rem;">
              <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:0.65rem;">
                ${isPaid ? `
                  <div style="display:flex; align-items:baseline; gap:0.45rem;">
                    <span style="font-size:1.25rem; font-weight:800; color:#4f46e5;">৳${Number(s.price).toLocaleString()}</span>
                    ${s.originalPrice > s.price ? `<span style="font-size:0.84rem; color:#94a3b8; text-decoration:line-through;">৳${Number(s.originalPrice).toLocaleString()}</span>` : ''}
                  </div>
                  ${saveAmt > 0 ? `<span style="font-size:0.78rem; font-weight:800; color:#059669;">Save ৳${saveAmt.toLocaleString()}</span>` : ''}
                ` : `
                  <span style="font-size:1.02rem; font-weight:800; color:#059669;">Free Public Access</span>
                  <span style="font-size:0.72rem; color:#64748b; font-weight:600;">Offline Ready</span>
                `}
              </div>

              <div style="display:grid; grid-template-columns:${locked ? '1fr 1fr' : '1fr auto'}; gap:0.5rem;">
                ${locked ? `
                  <button type="button" class="btn btn-primary btn-sm" style="justify-content:center; font-weight:700;" onclick="window.openCourseEnroll('${esc(s.id)}')">Buy Now</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="justify-content:center; font-weight:700;" onclick="window.openCourseEnroll('${esc(s.id)}')">Course Details</button>
                ` : `
                  <button type="button" class="btn btn-primary btn-sm" style="justify-content:center; font-weight:700;" onclick="window.enterAcadSubject('${esc(s.id)}')">Access Now →</button>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="window.openCourseEnroll('${esc(s.id)}')" title="Course Overview & Syllabus">Details</button>
                `}
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderCourseEnrollView() {
    const wrap = document.getElementById('acadEnrollView');
    const sub = getSubjectById(selectedSubjectId);
    if (!wrap || !sub) { setView('catalog'); return; }

    const isPaid = sub.accessTier === 'paid' || Number(sub.price) > 0;
    const locked = isSubjectLocked(sub);
    const saveAmt = sub.originalPrice > sub.price && sub.price > 0 ? Math.round(sub.originalPrice - sub.price) : 0;
    const imgSrc = sub.imageUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80';
    const mc = catalog.mcqs.filter((m) => m.subjectId === sub.id).length;
    const cc = catalog.cqs.filter((c) => c.subjectId === sub.id).length;
    const nc = catalog.notes.filter((n) => n.subjectId === sub.id).length;

    const features = (Array.isArray(sub.features) && sub.features.length) ? sub.features : [
      'Chapter-wise Board, Medical, BUET & College MCQs',
      'Unlimited Automated Timed MCQ Practice Exams',
      'Complete 4-Part Creative Questions (CQ) with Solutions',
      'Offline Question DB Download (Study Without Internet)',
      'Concept Books, Formula Sheets & Lecture PDFs'
    ];
    const instructors = (Array.isArray(sub.instructors) && sub.instructors.length) ? sub.instructors : [
      { name: 'CRII Academic Council', role: 'BUET, DU & DMC Mentors', avatar: '/assets/curiomas-no-bg.png' },
      { name: 'Research & Olympiad Faculty', role: 'HSC Specialist Panel', avatar: '/assets/curiomas-no-bg.png' }
    ];
    const faqs = (Array.isArray(sub.faq) && sub.faq.length) ? sub.faq : [
      { q: 'Who is this HSC course designed for?', a: 'All HSC Science & General candidates preparing for Board Exams, Medical, BUET, University Admission, and Top College Tests.' },
      { q: 'Can I take MCQ exams offline?', a: 'Yes! Once you download the Question DB offline, you can take unlimited timed MCQ exams and review solutions with zero internet connection.' },
      { q: 'How do I activate access after paying?', a: 'Submit your bKash/Nagad/Rocket TrxID in the enrollment box below, or paste your CRII Access Code to unlock immediately.' }
    ];
    const structureCards = [
      { icon: '⚛️', title: 'Complete HSC Curriculum', desc: 'Covers every chapter across Academics, Books, Medical, BUET & College Question banks.' },
      { icon: '⚡', title: 'Automated Timed MCQ Exams', desc: 'Real board & admission timer with negative marking (-0.25), GPA scorecard & explanations.' },
      { icon: '📝', title: 'Creative Questions (CQ Bank)', desc: 'Authentic Uddipok stems with structured ক, খ, গ, ঘ model answers & 20-min timer.' },
      { icon: '📡', title: '100% Offline Ready PWA', desc: 'Install the CRII app and download the full Question DB for uninterrupted offline practice.' }
    ];
    const chapters = Array.isArray(sub.chapters) && sub.chapters.length ? sub.chapters : ['Core Syllabus Modules'];

    wrap.innerHTML = `
      <div style="margin-bottom:1rem;">
        <button type="button" class="btn btn-secondary btn-sm" onclick="window.backToAcadCatalog()">← Back to All HSC Subjects</button>
      </div>

      <div class="acad-enroll-hero">
        <div style="max-width:700px;">
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.75rem;">
            <span style="font-size:0.74rem; font-weight:800; padding:0.25rem 0.7rem; border-radius:999px; background:rgba(234,88,12,0.22); color:#fdba74; border:1px solid rgba(251,146,60,0.4);">${esc(sub.icon || '🎓')} ${esc(sub.badgeText || 'HSC')}</span>
            <span style="font-size:0.74rem; font-weight:700; padding:0.25rem 0.7rem; border-radius:999px; background:rgba(255,255,255,0.12); color:#e2e8f0;">👥 ${(Number(sub.studentCount) || 0).toLocaleString()} enrolled</span>
            <span style="font-size:0.74rem; font-weight:700; padding:0.25rem 0.7rem; border-radius:999px; background:${locked ? 'rgba(251,191,36,0.2)' : 'rgba(16,185,129,0.25)'}; color:${locked ? '#fde68a' : '#6ee7b7'};">${locked ? '🔒 Paid Course' : '✓ Open / Unlocked'}</span>
          </div>
          <h2 style="font-size:2.1rem; margin:0 0 0.75rem; color:#ffffff; line-height:1.2;">${esc(sub.name)}</h2>
          <p style="font-size:0.95rem; color:#cbd5e1; line-height:1.65; margin:0;">${esc(sub.description || 'Complete HSC exam mastery with MCQs, CQs, concept books, and offline exam simulation.')}</p>
        </div>
      </div>

      <div class="acad-enroll-layout">
        <div style="min-width:0; display:flex; flex-direction:column; gap:1.75rem;">
          <div class="acad-sticky-tabs">
            <button type="button" class="acad-sticky-tab-btn active" onclick="document.getElementById('enrSecInstructors')?.scrollIntoView({behavior:'smooth'})">Instructors</button>
            <button type="button" class="acad-sticky-tab-btn" onclick="document.getElementById('enrSecStructure')?.scrollIntoView({behavior:'smooth'})">How It's Structured</button>
            <button type="button" class="acad-sticky-tab-btn" onclick="document.getElementById('enrSecSyllabus')?.scrollIntoView({behavior:'smooth'})">Course Syllabus</button>
            <button type="button" class="acad-sticky-tab-btn" onclick="document.getElementById('enrSecPay')?.scrollIntoView({behavior:'smooth'})">Enroll & Payment</button>
            <button type="button" class="acad-sticky-tab-btn" onclick="document.getElementById('enrSecFaq')?.scrollIntoView({behavior:'smooth'})">FAQ</button>
          </div>

          <section id="enrSecInstructors" class="acad-glass-panel" style="padding:1.35rem;">
            <h3 style="margin:0 0 1rem; font-size:1.15rem;">Course Instructors</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.85rem;">
              ${instructors.map((inst) => `
                <div style="display:flex; align-items:center; gap:0.8rem; padding:0.85rem; border-radius:14px; border:1px solid rgba(15,23,42,0.08); background:rgba(255,255,255,0.65);">
                  <img src="${esc(inst.avatar || '/assets/curiomas-no-bg.png')}" alt="${esc(inst.name)}" style="width:52px; height:52px; border-radius:50%; object-fit:cover; background:#071f16; border:2px solid rgba(234,88,12,0.35);">
                  <div>
                    <div style="font-weight:700; font-size:0.92rem; color:#0f172a;">${esc(inst.name)}</div>
                    <span style="display:inline-block; margin-top:0.2rem; font-size:0.72rem; font-weight:700; padding:2px 8px; border-radius:999px; background:rgba(234,88,12,0.1); color:#ea580c;">⚡ ${esc(inst.role || 'Faculty Mentor')}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <section id="enrSecStructure" class="acad-glass-panel" style="padding:1.35rem;">
            <h3 style="margin:0 0 1rem; font-size:1.15rem;">How the Course is Structured</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(230px, 1fr)); gap:0.85rem;">
              ${structureCards.map((sc) => `
                <div style="padding:1rem; border-radius:14px; border:1px solid rgba(15,23,42,0.08); background:rgba(255,255,255,0.65);">
                  <div style="font-size:1.35rem; margin-bottom:0.4rem;">${sc.icon}</div>
                  <div style="font-weight:700; font-size:0.94rem; color:#0f172a; margin-bottom:0.25rem;">${esc(sc.title)}</div>
                  <div style="font-size:0.8rem; color:#64748b; line-height:1.5;">${esc(sc.desc)}</div>
                </div>
              `).join('')}
            </div>
          </section>

          <section id="enrSecSyllabus" class="acad-glass-panel" style="padding:1.35rem;">
            <h3 style="margin:0 0 0.9rem; font-size:1.15rem;">Course Syllabus & Chapters (${chapters.length})</h3>
            <div style="display:flex; flex-direction:column; gap:0.55rem;">
              ${chapters.map((ch, idx) => {
                const chMcq = catalog.mcqs.filter((m) => m.subjectId === sub.id && m.chapter === ch).length;
                const chCq = catalog.cqs.filter((c) => c.subjectId === sub.id && c.chapter === ch).length;
                return `
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:0.6rem; padding:0.8rem 1rem; border-radius:12px; border:1px solid rgba(15,23,42,0.08); background:rgba(255,255,255,0.7);">
                    <div style="font-weight:700; font-size:0.88rem; color:#0f172a;">📂 ${idx + 1}. ${esc(ch)}</div>
                    <span style="font-size:0.74rem; color:#64748b; font-weight:600; white-space:nowrap;">${chMcq} MCQs • ${chCq} CQs</span>
                  </div>
                `;
              }).join('')}
            </div>
          </section>

          <section id="enrSecPay" class="acad-glass-panel" style="padding:1.45rem;">
            <h3 style="margin:0 0 0.45rem; font-size:1.18rem;">${locked ? 'Enroll & Complete Payment' : 'Requirements & Instant Access'}</h3>
            <div style="display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:1.15rem; font-size:0.82rem; color:#334155;">
              <span>✓ Smartphone, Tablet or PC</span>
              <span>✓ Works Online & Offline (PWA)</span>
              <span>✓ Instant Question Bank Access</span>
            </div>

            ${locked ? `
              <div style="background:rgba(234,88,12,0.07); border:1px solid rgba(234,88,12,0.25); border-radius:14px; padding:1rem 1.1rem; margin-bottom:1.15rem; font-size:0.84rem; color:#1e293b; line-height:1.6;">
                <strong style="color:#ea580c;">How to Pay:</strong><br>
                ${esc(sub.paymentInstructions || `Send ৳${Number(sub.price).toLocaleString()} via bKash / Nagad / Rocket (Send Money) and enter your Transaction ID (TrxID) below. Once verified, you will receive your instant Unlock Access Code.`)}
              </div>

              <form id="acadEnrollForm" onsubmit="window.handleSubmitCourseEnroll(event, '${esc(sub.id)}')" style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.25rem;">
                <input type="text" id="enrNameInput" class="form-input" placeholder="Full Name *" required>
                <input type="email" id="enrEmailInput" class="form-input" placeholder="Email Address *" required>
                <input type="text" id="enrPhoneInput" class="form-input" placeholder="Mobile / bKash Number *" required>
                <input type="text" id="enrCollegeInput" class="form-input" placeholder="College Name (e.g. NDC / Dhaka College)">
                <select id="enrMethodInput" class="form-select">
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
                <input type="text" id="enrTrxInput" class="form-input" placeholder="Transaction ID (TrxID) *" required>
                <div style="grid-column:1 / -1; display:flex; justify-content:flex-end;">
                  <button type="submit" id="enrSubmitBtn" class="btn btn-primary" style="padding:0.65rem 1.6rem; font-weight:700;">Submit Enrollment & Payment (৳${Number(sub.price).toLocaleString()})</button>
                </div>
              </form>

              <div style="border-top:1px solid rgba(15,23,42,0.08); padding-top:1rem;">
                <div style="font-size:0.82rem; font-weight:700; color:#0f172a; margin-bottom:0.45rem;">Already have an Access Code? Unlock Instantly:</div>
                <form onsubmit="window.handleVerifyCourseCode(event, '${esc(sub.id)}')" style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                  <input type="text" id="enrAccessCodeInput" class="form-input" placeholder="Enter your course access code..." style="flex:1; min-width:200px;" required>
                  <button type="submit" class="btn btn-secondary">🔓 Unlock Now</button>
                </form>
              </div>
            ` : `
              <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:14px; padding:1.1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.8rem;">
                <div style="font-size:0.88rem; color:#065f46; font-weight:600;">✓ You have full access to all Divisions, MCQs, Auto-Exams, CQs & Offline Downloads in ${esc(sub.name)}!</div>
                <button type="button" class="btn btn-primary" onclick="window.enterAcadSubject('${esc(sub.id)}')">Enter ${esc(sub.name)} Now →</button>
              </div>
            `}
          </section>

          <section id="enrSecFaq" class="acad-glass-panel" style="padding:1.35rem;">
            <h3 style="margin:0 0 0.9rem; font-size:1.15rem;">Frequently Asked Questions</h3>
            <div style="display:flex; flex-direction:column; gap:0.6rem;">
              ${faqs.map((f, i) => `
                <div class="acad-faq-item">
                  <button type="button" class="acad-faq-q" onclick="const b=document.getElementById('acadFaqA_${i}'); b.style.display=b.style.display==='none'?'block':'none';">
                    <span>${esc(f.q)}</span>
                    <span>▾</span>
                  </button>
                  <div id="acadFaqA_${i}" class="acad-faq-a" style="display:${i === 0 ? 'block' : 'none'};">${esc(f.a)}</div>
                </div>
              `).join('')}
            </div>
          </section>
        </div>

        <aside class="acad-enroll-sticky">
          <div style="aspect-ratio:16/9; overflow:hidden; background:#071f16;">
            <img src="${esc(imgSrc)}" alt="${esc(sub.name)}" style="width:100%; height:100%; object-fit:cover; display:block;">
          </div>
          <div style="padding:1.35rem;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:0.85rem;">
              ${isPaid ? `
                <div style="display:flex; align-items:baseline; gap:0.5rem;">
                  <span style="font-size:1.65rem; font-weight:800; color:#059669;">৳${Number(sub.price).toLocaleString()}</span>
                  ${sub.originalPrice > sub.price ? `<span style="font-size:0.95rem; color:#94a3b8; text-decoration:line-through;">৳${Number(sub.originalPrice).toLocaleString()}</span>` : ''}
                </div>
                ${saveAmt > 0 ? `<span style="font-size:0.82rem; font-weight:800; color:#ea580c;">Save ৳${saveAmt.toLocaleString()}</span>` : ''}
              ` : `
                <span style="font-size:1.5rem; font-weight:800; color:#059669;">Free</span>
                <span style="font-size:0.76rem; font-weight:700; color:#64748b;">Public Open Access</span>
              `}
            </div>

            ${locked ? `
              <button type="button" class="btn btn-primary" onclick="document.getElementById('enrSecPay')?.scrollIntoView({behavior:'smooth'})" style="width:100%; justify-content:center; padding:0.82rem; font-size:0.98rem; font-weight:800; border-radius:12px; background:#059669; border-color:#059669; margin-bottom:1.15rem;">
                Enroll / Buy Course Now
              </button>
            ` : `
              <button type="button" class="btn btn-primary" onclick="window.enterAcadSubject('${esc(sub.id)}')" style="width:100%; justify-content:center; padding:0.82rem; font-size:0.98rem; font-weight:800; border-radius:12px; margin-bottom:1.15rem;">
                Access Subject Now →
              </button>
            `}

            <div style="font-weight:800; font-size:0.92rem; color:#0f172a; margin-bottom:0.65rem;">What's Included in This Course</div>
            <ul style="list-style:none; padding:0; margin:0 0 1.15rem; display:flex; flex-direction:column; gap:0.5rem; font-size:0.83rem; color:#334155;">
              ${features.map((ft) => `<li style="display:flex; align-items:flex-start; gap:0.45rem;"><span style="color:#059669; font-weight:800;">✓</span><span>${esc(ft)}</span></li>`).join('')}
              <li style="display:flex; align-items:flex-start; gap:0.45rem;"><span style="color:#059669; font-weight:800;">✓</span><span>${mc} MCQs • ${cc} CQs • ${nc} Books & Notes Ready</span></li>
            </ul>

            <div style="border-top:1px solid #e2e8f0; padding-top:0.85rem; text-align:center; font-size:0.8rem; color:#64748b;">
              Need help with enrollment?<br>
              <strong style="color:#059669;">📞 ${esc(sub.enrollPhone || 'curiomas.members@gmail.com')}</strong>
            </div>
          </div>
        </aside>
      </div>
    `;
  }

  function clearExamTimer() {
    if (examTimerHandle) {
      clearInterval(examTimerHandle);
      examTimerHandle = null;
    }
  }

  function filterWorkspaceItems(items) {
    return items.filter((it) => {
      if (it.subjectId !== selectedSubjectId) return false;
      if (selectedDivisionId && selectedDivisionId !== 'all' && (it.divisionId || 'div_academics') !== selectedDivisionId) return false;
      if (activeChapter !== 'all' && String(it.chapter || '') !== activeChapter) return false;
      if (workspaceSearch) {
        const q = workspaceSearch.toLowerCase();
        const hay = [it.question, it.explanation, it.boardTag, it.chapter, it.title, it.stem, it.partA, it.partB, it.partC, it.partD, it.summary, it.content, ...(Array.isArray(it.options) ? it.options : [])].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function renderWorkspaceView() {
    const wrap = document.getElementById('acadWorkspaceView');
    const sub = getSubjectById(selectedSubjectId);
    if (!wrap || !sub) { setView('catalog'); return; }

    const activeDiv = selectedDivisionId ? getDivisionById(selectedDivisionId) : null;
    const isBooksDiv = activeDiv && (activeDiv.slug === 'books' || /book/i.test(activeDiv.name));

    const divCardsHtml = catalog.divisions.map((d) => {
      const isAct = selectedDivisionId === d.id;
      const mc = catalog.mcqs.filter((m) => m.subjectId === sub.id && (m.divisionId || 'div_academics') === d.id).length;
      const cc = catalog.cqs.filter((c) => c.subjectId === sub.id && (c.divisionId || 'div_academics') === d.id).length;
      const nc = catalog.notes.filter((n) => n.subjectId === sub.id && (n.divisionId || 'div_books') === d.id).length;
      return `
        <button type="button" class="acad-div-card ${isAct ? 'active' : ''}" style="--div-accent:${esc(d.accentColor || '#ea580c')};" onclick="window.selectAcadDivision('${esc(d.id)}')">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem;">
            <span style="font-size:1.45rem;">${esc(d.icon || '🎓')}</span>
            <span style="font-size:0.68rem; font-weight:800; padding:2px 8px; border-radius:999px; background:${isAct ? 'rgba(255,255,255,0.22)' : 'rgba(234,88,12,0.1)'}; color:${isAct ? '#ffffff' : (d.accentColor || '#ea580c')};">${mc + cc + nc} items</span>
          </div>
          <div>
            <div style="font-weight:800; font-size:1rem; margin-bottom:0.2rem;">${esc(d.name)}</div>
            <div style="font-size:0.74rem; opacity:${isAct ? '0.9' : '0.72'}; line-height:1.4;">${esc(d.description || '')}</div>
          </div>
          <div style="font-size:0.72rem; font-weight:700; opacity:0.88;">${mc} MCQs • ${cc} CQs • ${nc} Books</div>
        </button>
      `;
    }).join('');

    let step2Html = '';
    if (selectedDivisionId) {
      const subDivMcqs = filterWorkspaceItems(catalog.mcqs);
      const subDivCqs = filterWorkspaceItems(catalog.cqs);
      const subDivNotes = filterWorkspaceItems(catalog.notes);

      const chSet = new Set(sub.chapters || []);
      [...catalog.mcqs, ...catalog.cqs, ...catalog.notes].forEach((it) => {
        if (it.subjectId === sub.id && it.chapter) chSet.add(it.chapter);
      });
      const chapters = Array.from(chSet);

      step2Html = `
        <div style="margin-top:1.5rem;">
          <div style="font-size:0.78rem; font-weight:800; color:#ea580c; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.65rem;">Step 2 — Choose Question Format (${esc(activeDiv ? activeDiv.name : 'All')})</div>
          <div class="acad-mode-grid" style="margin-bottom:1.35rem;">
            <button type="button" class="acad-mode-card ${selectedQMode === 'mcq' ? 'active' : ''}" onclick="window.selectAcadQMode('mcq')">
              <div>
                <div style="font-size:1.18rem; font-weight:800; color:#0f172a; margin-bottom:0.25rem;">⚡ MCQs (Exam & Practice)</div>
                <div style="font-size:0.8rem; color:#64748b;">Timed Auto-Exam Taker with scorecard, explanations & offline practice bank.</div>
              </div>
              <span style="font-size:1.25rem; font-weight:800; color:#ea580c; white-space:nowrap;">${subDivMcqs.length}</span>
            </button>

            <button type="button" class="acad-mode-card ${selectedQMode === 'cq' ? 'active' : ''}" onclick="window.selectAcadQMode('cq')">
              <div>
                <div style="font-size:1.18rem; font-weight:800; color:#0f172a; margin-bottom:0.25rem;">📝 CQs (সৃজনশীল)</div>
                <div style="font-size:0.8rem; color:#64748b;">Full Uddipok stems, ক/খ/গ/ঘ questions, 20m timer & model solutions.</div>
              </div>
              <span style="font-size:1.25rem; font-weight:800; color:#0284c7; white-space:nowrap;">${subDivCqs.length}</span>
            </button>

            ${(isBooksDiv || subDivNotes.length > 0) ? `
              <button type="button" class="acad-mode-card ${selectedQMode === 'books' ? 'active' : ''}" onclick="window.selectAcadQMode('books')">
                <div>
                  <div style="font-size:1.18rem; font-weight:800; color:#0f172a; margin-bottom:0.25rem;">📚 Books, Formulas & PDFs</div>
                  <div style="font-size:0.8rem; color:#64748b;">Chapter concept notes, formula cheat sheets, PDFs & video lectures.</div>
                </div>
                <span style="font-size:1.25rem; font-weight:800; color:#059669; white-space:nowrap;">${subDivNotes.length}</span>
              </button>
            ` : ''}
          </div>

          <div class="acad-glass-panel" style="padding:0.85rem 1.1rem; margin-bottom:1.35rem; display:flex; gap:0.6rem; flex-wrap:wrap; align-items:center;">
            <select id="acadWsChapterSel" class="form-select" onchange="window.setAcadWsChapter(this.value)" style="max-width:280px; font-size:0.84rem;">
              <option value="all">All Chapters (${chapters.length})</option>
              ${chapters.map((ch) => `<option value="${esc(ch)}" ${activeChapter === ch ? 'selected' : ''}>${esc(ch)}</option>`).join('')}
            </select>
            <input type="text" id="acadWsSearchInput" class="form-input" value="${esc(workspaceSearch)}" placeholder="Search within ${esc(sub.name)}..." oninput="window.setAcadWsSearch(this.value)" style="flex:1; min-width:200px; font-size:0.84rem;">
            ${selectedQMode === 'mcq' ? `
              <div style="display:flex; gap:0.35rem;">
                <button type="button" class="btn btn-sm ${mcqSubMode === 'exam' ? 'btn-primary' : 'btn-secondary'}" onclick="window.setAcadMcqSubMode('exam')">⚡ Auto-Exam</button>
                <button type="button" class="btn btn-sm ${mcqSubMode === 'practice' ? 'btn-primary' : 'btn-secondary'}" onclick="window.setAcadMcqSubMode('practice')">🧠 Practice List</button>
              </div>
            ` : ''}
          </div>

          <div id="acadWorkspaceContent"></div>
        </div>
      `;
    }

    wrap.innerHTML = `
      <div class="acad-glass-panel" style="padding:1.15rem 1.35rem; margin-bottom:1.35rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
        <div style="display:flex; align-items:center; gap:0.65rem; flex-wrap:wrap;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.backToAcadCatalog()">← HSC Subjects</button>
          <span style="color:#94a3b8;">›</span>
          <strong style="font-size:1.05rem;">${esc(sub.icon || '📘')} ${esc(sub.name)}</strong>
          ${activeDiv ? `<span style="color:#94a3b8;">›</span><span style="font-weight:700; color:#ea580c;">${esc(activeDiv.icon || '')} ${esc(activeDiv.name)}</span>` : ''}
        </div>
        <div style="display:flex; gap:0.45rem; flex-wrap:wrap;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.saveAcademicsOffline()">⬇ Save Offline</button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.openCourseEnroll('${esc(sub.id)}')">Course Overview</button>
        </div>
      </div>

      <div style="font-size:0.78rem; font-weight:800; color:#ea580c; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.65rem;">Step 1 — What do you want to study in ${esc(sub.name)}?</div>
      <div class="acad-div-grid">${divCardsHtml}</div>

      ${step2Html}
    `;

    if (selectedDivisionId) {
      renderWorkspaceInnerContent();
    }
  }

  function renderWorkspaceInnerContent() {
    const box = document.getElementById('acadWorkspaceContent');
    if (!box) return;
    if (selectedQMode === 'mcq') {
      if (mcqSubMode === 'exam') renderExamRunner(box);
      else renderMcqPracticeList(box);
    } else if (selectedQMode === 'cq') {
      renderCqList(box);
    } else {
      renderBooksList(box);
    }
  }

  function renderExamRunner(pane) {
    const sub = getSubjectById(selectedSubjectId);
    const div = getDivisionById(selectedDivisionId);
    const pool = filterWorkspaceItems(catalog.mcqs);
    const defaultNeg = div && /medical|buet/i.test(div.name || '') ? '0.25' : '0';

    if (!examState) {
      pane.innerHTML = `
        <div class="acad-glass-panel" style="padding:1.65rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.85rem; margin-bottom:1.2rem;">
            <div>
              <h3 style="font-size:1.3rem; margin:0 0 0.3rem;">⚡ ${esc(sub ? sub.name : '')} — ${esc(div ? div.name : '')} Auto-Exam</h3>
              <p style="margin:0; font-size:0.86rem; color:#64748b;">Give timed MCQ exams online or offline. Scores, GPA & explanations are stored automatically in your device.</p>
            </div>
            <span style="padding:0.4rem 0.85rem; border-radius:999px; background:rgba(234,88,12,0.1); color:#ea580c; font-size:0.8rem; font-weight:800;">${pool.length} MCQs Ready</span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(185px, 1fr)); gap:0.9rem; margin-bottom:1.25rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" style="font-size:0.78rem; font-weight:700;">Questions</label>
              <select id="acadExamCount" class="form-select">
                <option value="5">5 Questions (Quick)</option>
                <option value="10" selected>10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="25">25 Questions (Board Full)</option>
                <option value="all">All Matching (${pool.length})</option>
              </select>
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" style="font-size:0.78rem; font-weight:700;">Timer</label>
              <select id="acadExamSecPerQ" class="form-select">
                <option value="60" selected>1 min / question (HSC Board)</option>
                <option value="45">45 sec / question</option>
                <option value="30">30 sec / question (Medical/BUET)</option>
                <option value="0">Untimed Mode</option>
              </select>
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" style="font-size:0.78rem; font-weight:700;">Negative Marking</label>
              <select id="acadExamNegMark" class="form-select">
                <option value="0" ${defaultNeg === '0' ? 'selected' : ''}>None (HSC Board)</option>
                <option value="0.25" ${defaultNeg === '0.25' ? 'selected' : ''}>-0.25 per wrong (Medical / BUET)</option>
              </select>
            </div>
            <div class="form-group" style="margin:0; display:flex; align-items:flex-end;">
              <label style="display:flex; align-items:center; gap:0.45rem; font-size:0.84rem; font-weight:600; cursor:pointer; padding:0.55rem 0.85rem; border-radius:10px; border:1px solid rgba(15,23,42,0.12); width:100%;">
                <input type="checkbox" id="acadExamShuffle" checked style="accent-color:#ea580c; width:16px; height:16px;">
                <span>Shuffle Questions</span>
              </label>
            </div>
          </div>

          <div style="display:flex; gap:0.65rem; align-items:center; flex-wrap:wrap;">
            <button type="button" class="btn btn-primary" onclick="window.startAcadAutoExam()" ${pool.length === 0 ? 'disabled' : ''} style="padding:0.7rem 1.7rem; font-weight:700;">🚀 Start Timed Exam</button>
            ${pool.length === 0 ? '<span style="font-size:0.82rem; color:#64748b;">No MCQs uploaded in this track yet — add MCQs from Portal → Academics (or click AI Generate 5 MCQs!).</span>' : ''}
          </div>
        </div>
      `;
      return;
    }

    if (examState.submitted) {
      const { questions, answers, negMark, startedAt, finishedAt } = examState;
      let correct = 0;
      let wrong = 0;
      let skipped = 0;
      const wrongIds = [];
      questions.forEach((q, idx) => {
        const chosen = answers[idx];
        if (chosen === undefined || chosen === null) skipped++;
        else if (Number(chosen) === Number(q.correctIndex)) correct++;
        else { wrong++; wrongIds.push(q.id); }
      });
      const rawScore = Math.max(0, +(correct - wrong * negMark).toFixed(2));
      const pct = questions.length > 0 ? Math.round((rawScore / questions.length) * 100) : 0;
      const grade = pct >= 80 ? 'A+ (GPA 5.0)' : pct >= 70 ? 'A (GPA 4.0)' : pct >= 60 ? 'A- (GPA 3.5)' : pct >= 50 ? 'B (GPA 3.0)' : pct >= 40 ? 'C (GPA 2.0)' : pct >= 33 ? 'D (Pass)' : 'F (Review)';
      const elapsedSec = Math.max(1, Math.round(((finishedAt || Date.now()) - startedAt) / 1000));
      const letters = ['A', 'B', 'C', 'D'];

      pane.innerHTML = `
        <div class="acad-glass-panel" style="padding:1.65rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.9rem; margin-bottom:1.25rem;">
            <div>
              <div style="font-size:0.74rem; font-weight:800; color:#ea580c; text-transform:uppercase;">Automated Exam Result (Saved Offline)</div>
              <h3 style="font-size:1.5rem; margin:0.2rem 0 0;">Score: ${rawScore} / ${questions.length} (${pct}%) — ${grade}</h3>
            </div>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              ${wrongIds.length > 0 ? `<button type="button" class="btn btn-primary btn-sm" onclick="window.startAcadCustomExam(${JSON.stringify(wrongIds).replace(/"/g, '&quot;')})">🔁 Retake ${wrongIds.length} Wrong</button>` : ''}
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.exitAcadExam()">+ New Exam</button>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:0.75rem; margin-bottom:1.4rem;">
            <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:12px; padding:0.8rem; text-align:center;"><div style="font-size:1.4rem; font-weight:800; color:#059669;">${correct}</div><div style="font-size:0.74rem; color:#047857; font-weight:700;">Correct</div></div>
            <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:12px; padding:0.8rem; text-align:center;"><div style="font-size:1.4rem; font-weight:800; color:#dc2626;">${wrong}</div><div style="font-size:0.74rem; color:#b91c1c; font-weight:700;">Wrong ${negMark > 0 ? `(-${(wrong * negMark).toFixed(2)})` : ''}</div></div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:0.8rem; text-align:center;"><div style="font-size:1.4rem; font-weight:800; color:#475569;">${skipped}</div><div style="font-size:0.74rem; color:#64748b; font-weight:700;">Skipped</div></div>
            <div style="background:#fff7ed; border:1px solid #fed7aa; border-radius:12px; padding:0.8rem; text-align:center;"><div style="font-size:1.4rem; font-weight:800; color:#ea580c;">${Math.floor(elapsedSec / 60)}m ${elapsedSec % 60}s</div><div style="font-size:0.74rem; color:#c2410c; font-weight:700;">Time</div></div>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.9rem;">
            ${questions.map((q, idx) => {
              const chosen = answers[idx];
              const isCorrect = chosen !== undefined && Number(chosen) === Number(q.correctIndex);
              const isSkipped = chosen === undefined || chosen === null;
              return `
                <div style="border:1.5px solid ${isCorrect ? '#86efac' : isSkipped ? '#cbd5e1' : '#fca5a5'}; border-radius:14px; padding:1rem 1.15rem; background:${isCorrect ? '#f0fdf4' : isSkipped ? '#f8fafc' : '#fef2f2'};">
                  <div style="display:flex; justify-content:space-between; gap:0.5rem; margin-bottom:0.4rem; font-size:0.74rem; font-weight:700;">
                    <span style="color:#475569;">Q${idx + 1} • ${esc(q.chapter || '')} ${q.boardTag ? '• ' + esc(q.boardTag) : ''}</span>
                    <span style="color:${isCorrect ? '#059669' : isSkipped ? '#64748b' : '#dc2626'};">${isCorrect ? '✓ Correct' : isSkipped ? '— Skipped' : '✕ Wrong'}</span>
                  </div>
                  <div style="font-weight:700; font-size:0.95rem; color:#0f172a; margin-bottom:0.6rem;">${esc(q.question)}</div>
                  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.4rem; margin-bottom:0.6rem;">
                    ${(q.options || []).map((opt, oi) => {
                      const right = oi === Number(q.correctIndex);
                      const picked = chosen !== undefined && Number(chosen) === oi;
                      return `<div style="padding:0.42rem 0.65rem; border-radius:8px; border:1px solid ${right ? '#16a34a' : picked ? '#dc2626' : '#e2e8f0'}; background:${right ? '#dcfce7' : picked ? '#fee2e2' : '#ffffff'}; font-size:0.84rem; color:#0f172a;"><strong>${letters[oi] || oi + 1}.</strong> ${esc(opt)} ${right ? '✓' : picked ? '✕' : ''}</div>`;
                    }).join('')}
                  </div>
                  ${q.explanation ? `<div style="font-size:0.82rem; color:#334155; background:rgba(255,255,255,0.88); border-radius:8px; padding:0.55rem 0.75rem; border:1px solid #e2e8f0;"><strong>Explanation:</strong> ${esc(q.explanation)}</div>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
      return;
    }

    const { questions, answers, flagged, currentIndex, remainingSec, totalSec } = examState;
    const q = questions[currentIndex];
    const letters = ['A', 'B', 'C', 'D'];
    const timerStr = totalSec > 0
      ? `${String(Math.floor(remainingSec / 60)).padStart(2, '0')}:${String(remainingSec % 60).padStart(2, '0')}`
      : 'Untimed';

    pane.innerHTML = `
      <div class="acad-glass-panel" style="padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; padding-bottom:0.9rem; border-bottom:1px solid rgba(15,23,42,0.08); margin-bottom:1rem;">
          <div style="font-weight:800; font-size:0.95rem;">Question ${currentIndex + 1} / ${questions.length} <span style="font-weight:600; color:#64748b; font-size:0.8rem;">(${Object.keys(answers).length} answered)</span></div>
          <div style="display:flex; align-items:center; gap:0.55rem; flex-wrap:wrap;">
            <span id="acadLiveTimerBadge" style="font-family:monospace; font-weight:800; font-size:0.95rem; padding:0.3rem 0.75rem; border-radius:999px; background:${totalSec > 0 && remainingSec <= 30 ? '#fee2e2' : 'rgba(234,88,12,0.12)'}; color:${totalSec > 0 && remainingSec <= 30 ? '#dc2626' : '#ea580c'};">⏱ ${timerStr}</span>
            <button type="button" class="btn btn-primary btn-sm" onclick="window.submitAcadAutoExam()">✓ Submit Exam</button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.exitAcadExam()">Quit</button>
          </div>
        </div>

        <div style="display:flex; gap:0.35rem; flex-wrap:wrap; margin-bottom:1.1rem;">
          ${questions.map((_, i) => {
            const isCur = i === currentIndex;
            const isAns = answers[i] !== undefined;
            const isFlg = flagged[i];
            let bg = '#f1f5f9', clr = '#334155', brd = '#cbd5e1';
            if (isCur) { bg = '#ea580c'; clr = '#ffffff'; brd = '#ea580c'; }
            else if (isFlg) { bg = '#fef3c7'; clr = '#b45309'; brd = '#f59e0b'; }
            else if (isAns) { bg = '#dcfce7'; clr = '#15803d'; brd = '#22c55e'; }
            return `<button type="button" onclick="window.jumpAcadExamQ(${i})" style="width:32px; height:32px; border-radius:8px; border:1.5px solid ${brd}; background:${bg}; color:${clr}; font-weight:700; font-size:0.78rem; cursor:pointer;">${i + 1}</button>`;
          }).join('')}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.55rem; gap:0.4rem; flex-wrap:wrap;">
          <span style="font-size:0.76rem; font-weight:700; color:#ea580c;">${esc(q.chapter || '')} ${q.boardTag ? '• ' + esc(q.boardTag) : ''}</span>
          <button type="button" class="btn btn-secondary btn-sm" style="font-size:0.72rem; padding:0.2rem 0.55rem;" onclick="window.toggleFlagAcadExamQ(${currentIndex})">${flagged[currentIndex] ? '🚩 Flagged' : '⚑ Flag'}</button>
        </div>

        <div style="font-size:1.08rem; font-weight:700; line-height:1.55; margin-bottom:1rem;">${esc(q.question)}</div>
        ${q.imageUrl ? `<div style="margin-bottom:0.9rem;"><img src="${esc(q.imageUrl)}" alt="Figure" style="max-width:100%; max-height:240px; border-radius:10px;"></div>` : ''}

        <div style="display:grid; grid-template-columns:1fr; gap:0.55rem; margin-bottom:1.25rem;">
          ${(q.options || []).map((opt, oi) => {
            const sel = answers[currentIndex] === oi;
            return `
              <button type="button" onclick="window.selectAcadExamOpt(${currentIndex}, ${oi})" style="text-align:left; cursor:pointer; display:flex; align-items:center; gap:0.75rem; padding:0.8rem 1rem; border-radius:12px; border:1.5px solid ${sel ? '#ea580c' : 'rgba(15,23,42,0.12)'}; background:${sel ? 'rgba(234,88,12,0.1)' : 'rgba(255,255,255,0.75)'}; color:#0f172a; font-size:0.93rem; font-weight:${sel ? '700' : '500'};">
                <span style="width:28px; height:28px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:800; font-size:0.8rem; background:${sel ? '#ea580c' : '#f1f5f9'}; color:${sel ? '#ffffff' : '#334155'}; flex-shrink:0;">${letters[oi] || oi + 1}</span>
                <span>${esc(opt)}</span>
              </button>
            `;
          }).join('')}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.jumpAcadExamQ(${Math.max(0, currentIndex - 1)})" ${currentIndex === 0 ? 'disabled' : ''}>← Previous</button>
          ${currentIndex < questions.length - 1
            ? `<button type="button" class="btn btn-primary btn-sm" onclick="window.jumpAcadExamQ(${currentIndex + 1})">Next →</button>`
            : `<button type="button" class="btn btn-primary btn-sm" onclick="window.submitAcadAutoExam()">✓ Finish & Grade</button>`}
        </div>
      </div>
    `;
  }

  function renderMcqPracticeList(pane) {
    const list = filterWorkspaceItems(catalog.mcqs);
    const bm = getBookmarks();
    const letters = ['A', 'B', 'C', 'D'];
    if (!list.length) {
      pane.innerHTML = '<div class="acad-glass-panel" style="padding:2.25rem; text-align:center; color:#64748b;">No MCQs found in this track yet.</div>';
      return;
    }
    pane.innerHTML = `<div style="display:flex; flex-direction:column; gap:1rem;">` + list.map((q, idx) => {
      const picked = practiceAnswers[q.id];
      const revealed = picked !== undefined;
      const isBm = bm.mcqs.includes(q.id);
      return `
        <div class="acad-glass-panel" style="padding:1.25rem 1.35rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.45rem;">
            <span style="font-size:0.74rem; font-weight:700; color:#ea580c;">#${idx + 1} • ${esc(q.chapter || '')} ${q.boardTag ? '• ' + esc(q.boardTag) : ''}</span>
            <div style="display:flex; gap:0.35rem; align-items:center;">
              <span style="font-size:0.7rem; padding:2px 8px; border-radius:999px; background:rgba(234,88,12,0.1); color:#ea580c; font-weight:700;">${esc(q.difficulty || 'Medium')}</span>
              <button type="button" onclick="window.toggleAcadBookmark('mcqs', '${esc(q.id)}')" style="border:none; background:transparent; cursor:pointer; font-size:1rem; color:${isBm ? '#f59e0b' : '#94a3b8'};">${isBm ? '★' : '☆'}</button>
            </div>
          </div>
          <div style="font-weight:700; font-size:0.98rem; margin-bottom:0.8rem;">${esc(q.question)}</div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.5rem;">
            ${(q.options || []).map((opt, oi) => {
              const isRight = oi === Number(q.correctIndex);
              const isPicked = picked === oi;
              let bg = 'rgba(255,255,255,0.7)', brd = 'rgba(15,23,42,0.12)';
              if (revealed && isRight) { bg = '#dcfce7'; brd = '#16a34a'; }
              else if (revealed && isPicked && !isRight) { bg = '#fee2e2'; brd = '#dc2626'; }
              return `<button type="button" onclick="window.answerPracticeMcq('${esc(q.id)}', ${oi})" style="text-align:left; cursor:pointer; padding:0.65rem 0.85rem; border-radius:10px; border:1.5px solid ${brd}; background:${bg}; color:#0f172a; font-size:0.88rem; display:flex; gap:0.5rem;"><strong style="color:#ea580c;">${letters[oi] || oi + 1}.</strong><span>${esc(opt)}</span></button>`;
            }).join('')}
          </div>
          ${revealed ? `
            <div style="margin-top:0.75rem; padding:0.7rem 0.9rem; border-radius:10px; background:${picked === Number(q.correctIndex) ? '#f0fdf4' : '#fef2f2'}; border:1px solid ${picked === Number(q.correctIndex) ? '#86efac' : '#fca5a5'}; font-size:0.84rem; color:#1e293b;">
              <strong style="color:${picked === Number(q.correctIndex) ? '#15803d' : '#b91c1c'};">${picked === Number(q.correctIndex) ? '✓ Correct!' : `✕ Correct: ${letters[q.correctIndex] || Number(q.correctIndex) + 1}`}</strong><br>
              ${esc(q.explanation || '')}
            </div>
          ` : ''}
        </div>
      `;
    }).join('') + '</div>';
  }

  function renderCqList(pane) {
    const list = filterWorkspaceItems(catalog.cqs);
    const bm = getBookmarks();
    if (!list.length) {
      pane.innerHTML = '<div class="acad-glass-panel" style="padding:2.25rem; text-align:center; color:#64748b;">No Creative Questions (CQs) in this track yet. Add them from Portal → Academics!</div>';
      return;
    }
    pane.innerHTML = `<div style="display:flex; flex-direction:column; gap:1.15rem;">` + list.map((cq, idx) => {
      const isBm = bm.cqs.includes(cq.id);
      return `
        <article class="acad-glass-panel" style="padding:1.4rem 1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.75rem;">
            <div>
              <div style="font-size:0.74rem; font-weight:700; color:#ea580c; text-transform:uppercase;">CQ #${idx + 1} • ${esc(cq.chapter || '')} ${cq.boardTag ? '• ' + esc(cq.boardTag) : ''}</div>
              <h3 style="margin:0.2rem 0 0; font-size:1.12rem;">${esc(cq.title || 'Creative Question')}</h3>
            </div>
            <div style="display:flex; gap:0.45rem; align-items:center;">
              <button type="button" class="btn btn-secondary btn-sm" id="cqTimerBtn_${esc(cq.id)}" onclick="window.toggleCqTimer('${esc(cq.id)}')" style="font-size:0.74rem;">⏱ 20m Timer</button>
              <button type="button" onclick="window.toggleAcadBookmark('cqs', '${esc(cq.id)}')" style="border:none; background:transparent; cursor:pointer; font-size:1.1rem; color:${isBm ? '#f59e0b' : '#94a3b8'};">${isBm ? '★' : '☆'}</button>
            </div>
          </div>

          <div style="background:rgba(234,88,12,0.06); border-left:4px solid #ea580c; border-radius:10px; padding:0.9rem 1.05rem; margin-bottom:0.95rem; font-size:0.92rem; line-height:1.6;">
            <div style="font-size:0.7rem; font-weight:800; color:#ea580c; text-transform:uppercase; margin-bottom:0.2rem;">Uddipok / Stem</div>
            <div>${esc(cq.stem)}</div>
            ${cq.imageUrl ? `<div style="margin-top:0.7rem;"><img src="${esc(cq.imageUrl)}" alt="CQ Figure" style="max-width:100%; max-height:240px; border-radius:8px;"></div>` : ''}
          </div>

          <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1rem; font-size:0.91rem;">
            <div><strong style="color:#ea580c;">(ক) [1m]:</strong> ${esc(cq.partA)}</div>
            <div><strong style="color:#ea580c;">(খ) [2m]:</strong> ${esc(cq.partB)}</div>
            <div><strong style="color:#ea580c;">(গ) [3m]:</strong> ${esc(cq.partC)}</div>
            <div><strong style="color:#ea580c;">(ঘ) [4m]:</strong> ${esc(cq.partD)}</div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" onclick="window.toggleCqSolution('${esc(cq.id)}', this)">👁 Show Model Answer</button>
          <div id="cqSol_${esc(cq.id)}" style="display:none; margin-top:0.85rem; background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:0.95rem 1.1rem; font-size:0.85rem; color:#1e293b; line-height:1.6;">
            <div style="margin-bottom:0.6rem;"><strong style="color:#059669;">(ক):</strong> ${esc(cq.ansA || '—').replace(/\n/g, '<br>')}</div>
            <div style="margin-bottom:0.6rem;"><strong style="color:#059669;">(খ):</strong> ${esc(cq.ansB || '—').replace(/\n/g, '<br>')}</div>
            <div style="margin-bottom:0.6rem;"><strong style="color:#059669;">(গ):</strong> ${esc(cq.ansC || '—').replace(/\n/g, '<br>')}</div>
            <div><strong style="color:#059669;">(ঘ):</strong> ${esc(cq.ansD || '—').replace(/\n/g, '<br>')}</div>
          </div>
        </article>
      `;
    }).join('') + '</div>';
  }

  function renderBooksList(pane) {
    const list = filterWorkspaceItems(catalog.notes);
    if (!list.length) {
      pane.innerHTML = '<div class="acad-glass-panel" style="padding:2.25rem; text-align:center; color:#64748b;">No Books, Formula Sheets, or Notes in this track yet.</div>';
      return;
    }
    pane.innerHTML = `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(330px, 1fr)); gap:1.1rem;">` + list.map((n) => `
      <article class="acad-glass-panel" style="padding:1.3rem; display:flex; flex-direction:column; justify-content:space-between; gap:0.8rem;">
        <div>
          <span style="font-size:0.7rem; font-weight:800; padding:2px 8px; border-radius:999px; background:rgba(16,185,129,0.12); color:#059669; text-transform:uppercase;">${esc(n.resourceType || 'BOOK')}</span>
          <h3 style="margin:0.4rem 0 0.25rem; font-size:1.06rem;">${esc(n.title)}</h3>
          <div style="font-size:0.78rem; color:#64748b; margin-bottom:0.65rem;">${esc(n.chapter || '')}${n.summary ? ' — ' + esc(n.summary) : ''}</div>
          ${n.content ? `<div style="background:rgba(255,255,255,0.72); border:1px solid rgba(15,23,42,0.08); border-radius:12px; padding:0.85rem; max-height:260px; overflow-y:auto;">${formatSimpleMd(n.content)}</div>` : ''}
        </div>
        ${(n.fileUrl || n.videoUrl) ? `
          <div style="display:flex; gap:0.45rem; flex-wrap:wrap; padding-top:0.5rem; border-top:1px solid rgba(15,23,42,0.08);">
            ${n.fileUrl ? `<a href="${esc(n.fileUrl)}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">📄 Open Book / PDF ↗</a>` : ''}
            ${n.videoUrl ? `<a href="${esc(n.videoUrl)}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">▶ Watch Lecture ↗</a>` : ''}
          </div>
        ` : ''}
      </article>
    `).join('') + '</div>';
  }

  function renderStatsView() {
    const wrap = document.getElementById('acadStatsView');
    if (!wrap) return;
    const hist = getHistory();
    const bm = getBookmarks();
    const avgPct = hist.length ? Math.round(hist.reduce((a, b) => a + (b.pct || 0), 0) / hist.length) : 0;
    const bmMcqs = catalog.mcqs.filter((m) => bm.mcqs.includes(m.id));

    wrap.innerHTML = `
      <div style="margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
        <button type="button" class="btn btn-secondary btn-sm" onclick="window.backToAcadCatalog()">← Back to HSC Subjects</button>
        <div style="display:flex; gap:0.45rem;">
          <label class="btn btn-secondary btn-sm" style="cursor:pointer; margin:0;">
            📥 Import Offline DB (.json)
            <input type="file" accept=".json,application/json" style="display:none;" onchange="window.importAcadOfflineFile(event)">
          </label>
          ${hist.length ? `<button type="button" class="btn btn-secondary btn-sm" onclick="window.clearAcadHistory()">Clear History</button>` : ''}
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(170px, 1fr)); gap:0.85rem; margin-bottom:1.35rem;">
        <div class="acad-glass-panel" style="padding:1.1rem; text-align:center;"><div style="font-size:1.6rem; font-weight:800; color:#ea580c;">${hist.length}</div><div style="font-size:0.78rem; color:#64748b; font-weight:700;">Offline Exams Taken</div></div>
        <div class="acad-glass-panel" style="padding:1.1rem; text-align:center;"><div style="font-size:1.6rem; font-weight:800; color:#059669;">${avgPct}%</div><div style="font-size:0.78rem; color:#64748b; font-weight:700;">Average Score</div></div>
        <div class="acad-glass-panel" style="padding:1.1rem; text-align:center;"><div style="font-size:1.6rem; font-weight:800; color:#f59e0b;">${bmMcqs.length + bm.cqs.length}</div><div style="font-size:0.78rem; color:#64748b; font-weight:700;">Saved Bookmarks</div></div>
      </div>

      <div class="acad-glass-panel" style="padding:1.35rem;">
        <h3 style="margin:0 0 0.85rem; font-size:1.08rem;">Offline Exam History (Stored in localStorage)</h3>
        ${hist.length === 0
          ? '<div style="font-size:0.86rem; color:#64748b;">No exams completed yet. Pick any HSC subject and start a timed MCQ exam!</div>'
          : `<div style="display:flex; flex-direction:column; gap:0.55rem;">` + hist.slice(0, 20).map((h) => `
              <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem; padding:0.7rem 0.9rem; border-radius:10px; background:rgba(15,23,42,0.03); border:1px solid rgba(15,23,42,0.08);">
                <div>
                  <div style="font-weight:700; font-size:0.86rem;">${esc(h.scope || 'HSC Exam')}</div>
                  <div style="font-size:0.72rem; color:#64748b;">${new Date(h.ts).toLocaleString()}</div>
                </div>
                <div style="font-weight:800; font-size:0.95rem; color:${h.pct >= 70 ? '#059669' : '#ea580c'};">${h.score}/${h.total} (${h.pct}%)</div>
              </div>
            `).join('') + '</div>'}
      </div>
    `;
  }

  window.setAcadSubjectFilter = function (f) {
    subjectFilter = f;
    renderSubjectsCatalog();
  };

  window.setAcadSubjectSearch = function (q) {
    subjectSearch = String(q || '').trim();
    renderSubjectsCatalog();
  };

  window.handleSubjectCardClick = function (subId) {
    const sub = getSubjectById(subId);
    if (!sub) return;
    if (isSubjectLocked(sub)) window.openCourseEnroll(subId);
    else window.enterAcadSubject(subId);
  };

  window.openCourseEnroll = function (subId) {
    selectedSubjectId = subId;
    setView('enroll');
  };

  window.enterAcadSubject = function (subId) {
    const sub = getSubjectById(subId);
    if (sub && isSubjectLocked(sub)) {
      window.openCourseEnroll(subId);
      return;
    }
    clearExamTimer();
    examState = null;
    selectedSubjectId = subId;
    selectedDivisionId = null;
    selectedQMode = 'mcq';
    mcqSubMode = 'exam';
    activeChapter = 'all';
    workspaceSearch = '';
    setView('workspace');
  };

  window.backToAcadCatalog = function () {
    clearExamTimer();
    examState = null;
    setView('catalog');
  };

  window.openAcadStatsView = function () {
    setView('stats');
  };

  window.selectAcadDivision = function (divId) {
    clearExamTimer();
    examState = null;
    selectedDivisionId = divId;
    activeChapter = 'all';
    const div = getDivisionById(divId);
    selectedQMode = div && (div.slug === 'books' || /book/i.test(div.name)) ? 'books' : 'mcq';
    mcqSubMode = 'exam';
    renderWorkspaceView();
  };

  window.selectAcadQMode = function (mode) {
    clearExamTimer();
    examState = null;
    selectedQMode = mode;
    renderWorkspaceView();
  };

  window.setAcadMcqSubMode = function (sub) {
    clearExamTimer();
    examState = null;
    mcqSubMode = sub;
    renderWorkspaceView();
  };

  window.setAcadWsChapter = function (ch) {
    activeChapter = ch;
    renderWorkspaceInnerContent();
  };

  window.setAcadWsSearch = function (q) {
    workspaceSearch = String(q || '').trim();
    renderWorkspaceInnerContent();
  };

  window.handleSubmitCourseEnroll = async function (e, subId) {
    e.preventDefault();
    const btn = document.getElementById('enrSubmitBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }
    try {
      const sub = getSubjectById(subId);
      const res = await fetch('/api/academics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enroll_course',
          subjectId: subId,
          subjectName: sub ? sub.name : '',
          studentName: document.getElementById('enrNameInput').value.trim(),
          studentEmail: document.getElementById('enrEmailInput').value.trim(),
          studentPhone: document.getElementById('enrPhoneInput').value.trim(),
          college: document.getElementById('enrCollegeInput').value.trim(),
          paymentMethod: document.getElementById('enrMethodInput').value,
          trxId: document.getElementById('enrTrxInput').value.trim(),
          amount: sub ? sub.price : 0
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || `HTTP ${res.status}`);
      if (window.showToast) window.showToast(data.message || 'Enrollment submitted!', 'success');
      document.getElementById('acadEnrollForm')?.reset();
    } catch (err) {
      if (window.showToast) window.showToast('Enrollment failed: ' + err.message, 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Submit Enrollment'; }
    }
  };

  window.handleVerifyCourseCode = async function (e, subId) {
    e.preventDefault();
    const code = (document.getElementById('enrAccessCodeInput')?.value || '').trim();
    if (!code) return;
    try {
      const res = await fetch('/api/academics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_access_code', subjectId: subId, code })
      });
      const data = await res.json();
      if (!res.ok || !data.unlocked) throw new Error(data.error || 'Invalid code');
      const unlocked = getUnlockedIds();
      if (!unlocked.includes(subId)) {
        unlocked.push(subId);
        saveJson(UNLOCKED_KEY, unlocked);
      }
      if (window.showToast) window.showToast('Course unlocked! Entering subject...', 'success');
      window.enterAcadSubject(subId);
    } catch (err) {
      if (window.showToast) window.showToast(err.message, 'error');
    }
  };

  window.startAcadAutoExam = function () {
    const pool = filterWorkspaceItems(catalog.mcqs);
    if (!pool.length) return;
    const countVal = document.getElementById('acadExamCount')?.value || '10';
    const secPerQ = Number(document.getElementById('acadExamSecPerQ')?.value || 60);
    const negMark = Number(document.getElementById('acadExamNegMark')?.value || 0);
    const shuffle = document.getElementById('acadExamShuffle')?.checked !== false;

    let selected = [...pool];
    if (shuffle) {
      for (let i = selected.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selected[i], selected[j]] = [selected[j], selected[i]];
      }
    }
    if (countVal !== 'all') selected = selected.slice(0, Math.min(selected.length, Number(countVal) || 10));

    const sub = getSubjectById(selectedSubjectId);
    const div = getDivisionById(selectedDivisionId);
    launchExam(selected, secPerQ, negMark, `${sub ? sub.name : 'HSC'} • ${div ? div.name : ''}`);
  };

  window.startAcadCustomExam = function (ids) {
    const idSet = new Set(Array.isArray(ids) ? ids : []);
    const selected = catalog.mcqs.filter((m) => idSet.has(m.id));
    if (!selected.length) return;
    mcqSubMode = 'exam';
    launchExam(selected, 60, 0, 'Targeted Revision Exam');
  };

  function launchExam(questions, secPerQ, negMark, scope) {
    clearExamTimer();
    const totalSec = secPerQ > 0 ? questions.length * secPerQ : 0;
    examState = {
      questions,
      answers: {},
      flagged: {},
      currentIndex: 0,
      negMark,
      scope,
      totalSec,
      remainingSec: totalSec,
      startedAt: Date.now(),
      finishedAt: null,
      submitted: false
    };
    if (totalSec > 0) {
      examTimerHandle = setInterval(() => {
        if (!examState || examState.submitted) { clearExamTimer(); return; }
        examState.remainingSec--;
        const badge = document.getElementById('acadLiveTimerBadge');
        if (badge) {
          const m = Math.floor(Math.max(0, examState.remainingSec) / 60);
          const s = Math.max(0, examState.remainingSec) % 60;
          badge.textContent = `⏱ ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
        if (examState.remainingSec <= 0) window.submitAcadAutoExam(true);
      }, 1000);
    }
    renderWorkspaceInnerContent();
  }

  window.selectAcadExamOpt = function (qIdx, optIdx) {
    if (!examState || examState.submitted) return;
    examState.answers[qIdx] = optIdx;
    renderWorkspaceInnerContent();
  };

  window.jumpAcadExamQ = function (idx) {
    if (!examState || examState.submitted) return;
    examState.currentIndex = Math.max(0, Math.min(examState.questions.length - 1, idx));
    renderWorkspaceInnerContent();
  };

  window.toggleFlagAcadExamQ = function (idx) {
    if (!examState || examState.submitted) return;
    examState.flagged[idx] = !examState.flagged[idx];
    renderWorkspaceInnerContent();
  };

  window.submitAcadAutoExam = function (timedOut = false) {
    if (!examState || examState.submitted) return;
    clearExamTimer();
    examState.submitted = true;
    examState.finishedAt = Date.now();

    let correct = 0;
    let wrong = 0;
    examState.questions.forEach((q, idx) => {
      const ch = examState.answers[idx];
      if (ch !== undefined && ch !== null) {
        if (Number(ch) === Number(q.correctIndex)) correct++;
        else wrong++;
      }
    });
    const score = Math.max(0, +(correct - wrong * examState.negMark).toFixed(2));
    const pct = examState.questions.length ? Math.round((score / examState.questions.length) * 100) : 0;
    const hist = getHistory();
    hist.unshift({ scope: examState.scope, score, total: examState.questions.length, pct, ts: Date.now() });
    saveJson(HISTORY_KEY, hist.slice(0, 60));

    if (timedOut && window.showToast) window.showToast('Time up! Exam auto-graded & saved offline.', 'info');
    renderWorkspaceInnerContent();
  };

  window.exitAcadExam = function () {
    clearExamTimer();
    examState = null;
    renderWorkspaceInnerContent();
  };

  window.answerPracticeMcq = function (id, optIdx) {
    practiceAnswers[id] = optIdx;
    renderWorkspaceInnerContent();
  };

  window.toggleAcadBookmark = function (kind, id) {
    const bm = getBookmarks();
    const arr = Array.isArray(bm[kind]) ? bm[kind] : [];
    const idx = arr.indexOf(id);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(id);
    bm[kind] = arr;
    saveJson(BOOKMARKS_KEY, bm);
    renderWorkspaceInnerContent();
  };

  window.toggleCqSolution = function (id, btnEl) {
    const box = document.getElementById('cqSol_' + id);
    if (!box) return;
    const open = box.style.display === 'none';
    box.style.display = open ? 'block' : 'none';
    if (btnEl) btnEl.textContent = open ? '🙈 Hide Model Answer' : '👁 Show Model Answer';
  };

  window.toggleCqTimer = function (id) {
    const btn = document.getElementById('cqTimerBtn_' + id);
    if (cqTimerHandles[id]) {
      clearInterval(cqTimerHandles[id]);
      delete cqTimerHandles[id];
      if (btn) btn.textContent = '⏱ 20m Timer';
      return;
    }
    let left = 20 * 60;
    const tick = () => {
      const m = Math.floor(left / 60);
      const s = left % 60;
      if (btn) btn.textContent = `⏱ ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} (Stop)`;
      if (left <= 0) {
        clearInterval(cqTimerHandles[id]);
        delete cqTimerHandles[id];
        if (window.showToast) window.showToast('20-minute CQ timer finished!', 'info');
      }
      left--;
    };
    tick();
    cqTimerHandles[id] = setInterval(tick, 1000);
  };

  window.clearAcadHistory = function () {
    saveJson(HISTORY_KEY, []);
    renderStatsView();
  };

  window.saveAcademicsOffline = async function () {
    const btn = document.getElementById('acadSaveOfflineBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Downloading DB...'; }
    try {
      const res = await fetch('/api/academics');
      if (res.ok) {
        const data = await res.json();
        catalog = data;
        saveJson(OFFLINE_CACHE_KEY, data);
      }
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const assetUrls = Array.from(document.querySelectorAll('link[rel="stylesheet"], script[src]'))
          .map((el) => el.href || el.src)
          .filter((u) => u && u.startsWith(window.location.origin))
          .map((u) => new URL(u).pathname);
        navigator.serviceWorker.controller.postMessage({ type: 'CACHE_OFFLINE_PACK', urls: ['/academics', ...assetUrls] });
      }
      updateOfflineBadge(true);
      if (window.showToast) window.showToast(`Offline Qn DB saved (${catalog.mcqs.length} MCQs, ${catalog.cqs.length} CQs, ${catalog.notes.length} Books)!`, 'success');
    } catch (e) {
      if (window.showToast) window.showToast('Using existing offline Question DB.', 'info');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '✓ Offline DB Saved'; }
    }
  };

  window.exportAcadOfflineFile = function () {
    const blob = new Blob([JSON.stringify(catalog, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `crii-hsc-question-db-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    if (window.showToast) window.showToast('Exported portable offline Question DB (.json)!', 'success');
  };

  window.importAcadOfflineFile = function (e) {
    const file = e.target && e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        if (!Array.isArray(parsed.subjects)) throw new Error('Invalid Question DB file');
        catalog = parsed;
        saveJson(OFFLINE_CACHE_KEY, parsed);
        updateOfflineBadge(true);
        setView('catalog');
        if (window.showToast) window.showToast('Imported offline Question DB successfully!', 'success');
      } catch (err) {
        if (window.showToast) window.showToast('Import failed: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  };

  window.initAcademicsHub = async function () {
    const cached = loadJson(OFFLINE_CACHE_KEY, null);
    if (cached && Array.isArray(cached.subjects) && Array.isArray(cached.divisions)) {
      catalog = cached;
      updateOfflineBadge(true);
      setView('catalog');
    }

    try {
      const res = await fetch('/api/academics', { cache: 'no-store' });
      if (res.ok) {
        const fresh = await res.json();
        if (fresh && Array.isArray(fresh.subjects)) {
          catalog = fresh;
          saveJson(OFFLINE_CACHE_KEY, fresh);
          updateOfflineBadge(false);
          if (currentView === 'catalog') renderSubjectsCatalog();
          else if (currentView === 'workspace') renderWorkspaceView();
          else if (currentView === 'enroll') renderCourseEnrollView();
        }
      }
    } catch (e) {
      updateOfflineBadge(true);
    }
  };
})();
