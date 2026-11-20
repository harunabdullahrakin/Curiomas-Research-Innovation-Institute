(function () {
  const OFFLINE_CACHE_KEY = 'crii_academics_offline_cache_v3';
  const HISTORY_KEY = 'crii_academics_exam_history_v1';
  const BOOKMARKS_KEY = 'crii_academics_bookmarks_v1';
  const UNLOCKED_KEY = 'crii_academics_unlocked_v1';

  let catalog = { classes: [], divisions: [], subjects: [], mcqs: [], cqs: [], notes: [], stats: {} };
  let currentView = 'courses';
  let selectedClassId = null;
  let selectedSubjectId = null;
  let selectedDivisionId = null;
  let selectedQMode = 'mcq';
  let mcqSubMode = 'exam';
  let selectedCqId = null;
  let activeChapter = 'all';

  let examState = null;
  let examTimerHandle = null;
  let cqTimerHandles = {};
  let practiceAnswers = {};

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function svgIcon(name, size = 18) {
    const paths = {
      graduation: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
      book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h8"/><path d="M8 11h6"/>',
      cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',
      heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
      building: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
      layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
      checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
      fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
      lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
      unlock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
      arrowLeft: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
      arrowRight: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
      clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
      users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
      flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
      chevronDown: '<polyline points="6 9 12 15 18 9"/>',
      barChart: '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
      cloudOff: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
      phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
      check: '<polyline points="20 6 9 17 4 12"/>',
      x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
      eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>'
    };
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">${paths[name] || paths.layers}</svg>`;
  }

  function resolveDivIconName(div) {
    const raw = String((div && (div.icon || div.slug || div.name)) || '').toLowerCase();
    if (/book/.test(raw)) return 'book';
    if (/buet|eng|cpu/.test(raw)) return 'cpu';
    if (/med|bio|heart/.test(raw)) return 'heart';
    if (/col|clg|build/.test(raw)) return 'building';
    if (/acad|grad|hsc|board/.test(raw)) return 'graduation';
    return 'layers';
  }

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

  function isLocked(item) {
    if (!item) return false;
    const isPaid = item.accessTier === 'paid' || Number(item.price) > 0;
    if (!isPaid) return false;
    return !getUnlockedIds().includes(item.id);
  }

  function getBookmarks() {
    return loadJson(BOOKMARKS_KEY, { mcqs: [], cqs: [] });
  }

  function getHistory() {
    return loadJson(HISTORY_KEY, []);
  }

  function getClassById(id) {
    return catalog.classes.find((c) => c.id === id) || null;
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
        out.push(`<h4 style="margin:0.85rem 0 0.35rem; font-size:0.98rem;">${esc(line.replace(/^###\s+/, ''))}</h4>`);
      } else if (/^#{1,2}\s+/.test(line)) {
        closeUl();
        out.push(`<h3 style="margin:1rem 0 0.4rem; font-size:1.06rem; color:#ea580c; border-bottom:1px solid rgba(15,23,42,0.08); padding-bottom:0.25rem;">${esc(line.replace(/^#{1,2}\s+/, ''))}</h3>`);
      } else if (/^[-*]\s+/.test(line)) {
        if (!inUl) { out.push('<ul style="margin:0.35rem 0 0.7rem; padding-left:1.35rem; display:flex; flex-direction:column; gap:0.28rem;">'); inUl = true; }
        out.push(`<li style="font-size:0.9rem; line-height:1.55;">${esc(line.replace(/^[-*]\s+/, ''))}</li>`);
      } else {
        closeUl();
        out.push(`<p style="margin:0.35rem 0; font-size:0.9rem; line-height:1.6;">${esc(line)}</p>`);
      }
    }
    closeUl();
    return out.join('');
  }

  function setView(viewName) {
    currentView = viewName;
    ['courses', 'enroll', 'subjects', 'workspace', 'stats'].forEach((v) => {
      const el = document.getElementById('acad' + v.charAt(0).toUpperCase() + v.slice(1) + 'View');
      if (el) el.style.display = v === viewName ? 'block' : 'none';
    });
    if (viewName === 'courses') renderCoursesView();
    else if (viewName === 'enroll') renderCourseEnrollView();
    else if (viewName === 'subjects') renderSubjectsView();
    else if (viewName === 'workspace') renderWorkspaceView();
    else if (viewName === 'stats') renderStatsView();
    window.scrollTo({ top: 180, behavior: 'smooth' });
  }

  function renderCoursesView() {
    const wrap = document.getElementById('acadCoursesView');
    if (!wrap) return;
    const courses = catalog.classes || [];
    if (courses.length === 0) {
      wrap.innerHTML = '<div class="acad-glass-panel" style="padding:3rem; text-align:center; color:#64748b;">No academic courses available yet. Add a course from the Admin Portal.</div>';
      return;
    }

    wrap.innerHTML = `
      <div class="acad-courses-stage">
        ${courses.map((c) => {
          const subs = catalog.subjects.filter((s) => s.classId === c.id);
          const isPaid = c.accessTier === 'paid' || Number(c.price) > 0;
          const locked = isLocked(c);
          const saveAmt = c.originalPrice > c.price && c.price > 0 ? Math.round(c.originalPrice - c.price) : 0;
          const banner = c.imageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80';
          const included = Array.isArray(c.includedCourses) ? c.includedCourses : [];

          return `
            <article class="acad-course-card">
              <div class="acad-course-media" onclick="window.handleCourseCardClick('${esc(c.id)}')" style="cursor:pointer;">
                <img src="${esc(banner)}" alt="${esc(c.name)}" loading="lazy" onerror="this.src='/assets/curiomas-no-bg.png'; this.style.objectFit='contain'; this.style.padding='1.5rem';">
                <div class="acad-course-media-overlay"></div>
                <span class="acad-course-badge-left">${svgIcon('graduation', 14)} <span>${esc(c.badgeText || c.badge || c.shortName || 'Course')}</span></span>
                <span class="acad-course-badge-right ${locked ? 'locked' : 'free'}">
                  ${locked ? `${svgIcon('lock', 13)} <span>Locked</span>` : isPaid ? `${svgIcon('unlock', 13)} <span>Unlocked</span>` : `${svgIcon('check', 13)} <span>Free</span>`}
                </span>
              </div>

              <div class="acad-course-body">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem; margin-bottom:0.4rem;">
                    <span style="font-size:0.74rem; font-weight:700; color:#ea580c; text-transform:uppercase; letter-spacing:0.06em;">${subs.length} Subjects</span>
                    ${Number(c.studentCount) > 0 ? `<span style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.76rem; color:#64748b; font-weight:600;">${svgIcon('users', 14)} ${(Number(c.studentCount)).toLocaleString()} students</span>` : ''}
                  </div>
                  <h2 style="margin:0 0 0.45rem; font-size:1.45rem; line-height:1.25; cursor:pointer;" onclick="window.handleCourseCardClick('${esc(c.id)}')">${esc(c.name)}</h2>
                  <p style="margin:0 0 0.85rem; font-size:0.86rem; color:#64748b; line-height:1.55;">${esc(c.description || '')}</p>

                  ${included.length > 0 ? `
                    <div style="background:rgba(15,23,42,0.03); border:1px solid rgba(15,23,42,0.07); border-radius:12px; padding:0.7rem; margin-bottom:0.85rem;">
                      <div style="font-size:0.74rem; font-weight:700; color:#475569; margin-bottom:0.4rem; text-align:center;">Included Modules</div>
                      <div style="display:flex; flex-direction:column; gap:0.35rem;">
                        ${included.slice(0, 4).map((inc) => `<div style="font-size:0.78rem; color:#2563eb; font-weight:600; background:rgba(37,99,235,0.06); border:1px solid rgba(37,99,235,0.16); border-radius:8px; padding:0.35rem 0.6rem; text-align:center;">${esc(inc)}</div>`).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>

                <div style="border-top:1px solid rgba(15,23,42,0.08); padding-top:0.9rem;">
                  <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:0.75rem;">
                    ${isPaid ? `
                      <div style="display:flex; align-items:baseline; gap:0.5rem;">
                        <span style="font-size:1.35rem; font-weight:800; color:#4f46e5;">৳${Number(c.price).toLocaleString()}</span>
                        ${c.originalPrice > c.price ? `<span style="font-size:0.88rem; color:#94a3b8; text-decoration:line-through;">৳${Number(c.originalPrice).toLocaleString()}</span>` : ''}
                      </div>
                      ${saveAmt > 0 ? `<span style="font-size:0.8rem; font-weight:800; color:#059669;">Save ৳${saveAmt.toLocaleString()}</span>` : ''}
                    ` : `
                      <span style="font-size:1.08rem; font-weight:800; color:#059669;">Free</span>
                      <span style="font-size:0.76rem; color:#64748b; font-weight:600;">Public Access</span>
                    `}
                  </div>

                  <div style="display:grid; grid-template-columns:${locked ? '1fr 1fr' : '1fr auto'}; gap:0.55rem;">
                    ${locked ? `
                      <button type="button" class="btn btn-primary btn-sm" style="justify-content:center; padding:0.62rem 1rem; font-weight:700;" onclick="window.openCourseEnroll('${esc(c.id)}')">Buy Now</button>
                      <button type="button" class="btn btn-secondary btn-sm" style="justify-content:center; padding:0.62rem 1rem; font-weight:700;" onclick="window.openCourseEnroll('${esc(c.id)}')">Course Details</button>
                    ` : `
                      <button type="button" class="btn btn-primary btn-sm" style="justify-content:center; padding:0.65rem 1.1rem; font-weight:700; display:inline-flex; align-items:center; gap:0.4rem;" onclick="window.enterAcadCourse('${esc(c.id)}')">
                        <span>Access Now</span>
                        ${svgIcon('arrowRight', 15)}
                      </button>
                      <button type="button" class="btn btn-secondary btn-sm" style="padding:0.65rem 0.9rem;" onclick="window.openCourseEnroll('${esc(c.id)}')">Details</button>
                    `}
                  </div>
                </div>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderSubjectsView() {
    const wrap = document.getElementById('acadSubjectsView');
    const cls = getClassById(selectedClassId) || catalog.classes[0];
    if (!wrap || !cls) { setView('courses'); return; }
    selectedClassId = cls.id;

    const subs = catalog.subjects.filter((s) => s.classId === cls.id);

    wrap.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; margin-bottom:1.4rem;">
        <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.backToAcadCourses()" style="display:inline-flex; align-items:center; gap:0.4rem;">
            ${svgIcon('arrowLeft', 15)}
            <span>Courses</span>
          </button>
          <h2 style="margin:0; font-size:1.55rem;">${esc(cls.name)}</h2>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" onclick="window.openAcadStatsView()" style="display:inline-flex; align-items:center; gap:0.4rem;">
          ${svgIcon('barChart', 15)}
          <span>Exam History</span>
        </button>
      </div>

      ${subs.length === 0
        ? '<div class="acad-glass-panel" style="padding:2.5rem; text-align:center; color:#64748b;">No subjects added to this course yet.</div>'
        : `<div class="acad-subject-tile-grid">
            ${subs.map((s) => {
              const img = s.imageUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80';
              return `
                <button type="button" class="acad-subject-tile" onclick="window.handleSubjectTileClick('${esc(s.id)}')">
                  <img class="acad-subject-tile-bg" src="${esc(img)}" alt="${esc(s.name)}" loading="lazy" onerror="this.src='/assets/curiomas-no-bg.png';">
                  <div class="acad-subject-tile-scrim"></div>
                  <span class="acad-subject-tile-title">${esc(s.name)}</span>
                </button>
              `;
            }).join('')}
          </div>`}
    `;
  }

  function renderCourseEnrollView() {
    const wrap = document.getElementById('acadEnrollView');
    const item = getClassById(selectedClassId) || getSubjectById(selectedSubjectId);
    if (!wrap || !item) { setView('courses'); return; }

    const isClassItem = Boolean(getClassById(item.id));
    const isPaid = item.accessTier === 'paid' || Number(item.price) > 0;
    const locked = isLocked(item);
    const saveAmt = item.originalPrice > item.price && item.price > 0 ? Math.round(item.originalPrice - item.price) : 0;
    const imgSrc = item.imageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80';
    const relatedSubs = isClassItem ? catalog.subjects.filter((s) => s.classId === item.id) : [];

    const features = (Array.isArray(item.features) && item.features.length) ? item.features : [
      'Structured HSC Subject & Chapter Coverage',
      'Academics, Books, BUET, Medical & College Questions',
      'Unlimited Automated Timed MCQ Practice Exams',
      'Full 4-Part Creative Questions (CQ) with Model Solutions',
      'Offline Question DB Sync for Uninterrupted Study'
    ];
    const instructors = (Array.isArray(item.instructors) && item.instructors.length) ? item.instructors : [
      { name: 'CRII Academic Council', role: 'BUET, DU & DMC Mentors', avatar: '/assets/curiomas-no-bg.png' },
      { name: 'HSC Specialist Panel', role: 'Subject Research Leads', avatar: '/assets/curiomas-no-bg.png' }
    ];
    const faqs = (Array.isArray(item.faq) && item.faq.length) ? item.faq : [
      { q: 'Can I take MCQ exams offline?', a: 'Yes. Question databases and exam scores are stored locally so you can practice and take exams without internet.' },
      { q: 'How do I unlock access after payment?', a: 'Complete bKash/Nagad/Rocket transfer, submit your TrxID in the form below, or enter your access code for immediate unlock.' }
    ];
    const structureCards = [
      { icon: 'graduation', title: 'Complete HSC Syllabus', desc: 'All subjects organized cleanly across Academics, Books, BUET, Medical & College Questions.' },
      { icon: 'checkCircle', title: 'Automated Timed Exams', desc: 'Configurable board & admission timers, negative marking, instant GPA scorecard & solutions.' },
      { icon: 'fileText', title: 'Structured CQ Bank', desc: 'Uddipok stems with structured 1, 2, 3, and 4 mark answers and a 20-minute writing timer.' },
      { icon: 'cloudOff', title: 'Offline Exam Ready', desc: 'Sync the question database to your device and continue studying anywhere offline.' }
    ];

    const syllabusRows = isClassItem
      ? relatedSubs.map((s) => ({ title: s.name, meta: `${catalog.mcqs.filter((m) => m.subjectId === s.id).length} MCQs / ${catalog.cqs.filter((q) => q.subjectId === s.id).length} CQs` }))
      : (item.chapters || []).map((ch) => ({ title: ch, meta: `${catalog.mcqs.filter((m) => m.subjectId === item.id && m.chapter === ch).length} MCQs` }));

    wrap.innerHTML = `
      <div style="margin-bottom:1rem;">
        <button type="button" class="btn btn-secondary btn-sm" onclick="window.backToAcadCourses()" style="display:inline-flex; align-items:center; gap:0.4rem;">
          ${svgIcon('arrowLeft', 15)}
          <span>Back to Courses</span>
        </button>
      </div>

      <div class="acad-enroll-hero">
        <div style="max-width:720px;">
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.75rem;">
            <span style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.74rem; font-weight:800; padding:0.25rem 0.75rem; border-radius:999px; background:rgba(234,88,12,0.22); color:#fdba74; border:1px solid rgba(251,146,60,0.4);">${svgIcon('graduation', 14)} ${esc(item.badgeText || item.badge || 'HSC')}</span>
            ${Number(item.studentCount) > 0 ? `<span style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.74rem; font-weight:700; padding:0.25rem 0.75rem; border-radius:999px; background:rgba(255,255,255,0.12); color:#e2e8f0;">${svgIcon('users', 14)} ${Number(item.studentCount).toLocaleString()} enrolled</span>` : ''}
            <span style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.74rem; font-weight:700; padding:0.25rem 0.75rem; border-radius:999px; background:${locked ? 'rgba(251,191,36,0.2)' : 'rgba(16,185,129,0.25)'}; color:${locked ? '#fde68a' : '#6ee7b7'};">${locked ? `${svgIcon('lock', 13)} Paid Course` : `${svgIcon('check', 13)} Open Access`}</span>
          </div>
          <h2 style="font-size:2.1rem; margin:0 0 0.75rem; color:#ffffff; line-height:1.2;">${esc(item.name)}</h2>
          <p style="font-size:0.95rem; color:#cbd5e1; line-height:1.65; margin:0;">${esc(item.description || '')}</p>
        </div>
      </div>

      <div class="acad-enroll-layout">
        <div style="min-width:0; display:flex; flex-direction:column; gap:1.5rem;">
          <div class="acad-sticky-tabs">
            <button type="button" class="acad-sticky-tab-btn active" onclick="document.getElementById('enrSecInstructors')?.scrollIntoView({behavior:'smooth'})">Instructors</button>
            <button type="button" class="acad-sticky-tab-btn" onclick="document.getElementById('enrSecStructure')?.scrollIntoView({behavior:'smooth'})">Course Structure</button>
            <button type="button" class="acad-sticky-tab-btn" onclick="document.getElementById('enrSecSyllabus')?.scrollIntoView({behavior:'smooth'})">Syllabus</button>
            <button type="button" class="acad-sticky-tab-btn" onclick="document.getElementById('enrSecPay')?.scrollIntoView({behavior:'smooth'})">Enrollment & Payment</button>
            <button type="button" class="acad-sticky-tab-btn" onclick="document.getElementById('enrSecFaq')?.scrollIntoView({behavior:'smooth'})">FAQ</button>
          </div>

          <section id="enrSecInstructors" class="acad-glass-panel" style="padding:1.35rem;">
            <h3 style="margin:0 0 1rem; font-size:1.15rem;">Course Instructors</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.85rem;">
              ${instructors.map((inst) => `
                <div style="display:flex; align-items:center; gap:0.8rem; padding:0.85rem; border-radius:14px; border:1px solid rgba(15,23,42,0.08); background:rgba(255,255,255,0.65);">
                  <img src="${esc(inst.avatar || '/assets/curiomas-no-bg.png')}" alt="${esc(inst.name)}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; background:#071f16; border:2px solid rgba(234,88,12,0.35);">
                  <div>
                    <div style="font-weight:700; font-size:0.92rem;">${esc(inst.name)}</div>
                    <span style="display:inline-block; margin-top:0.2rem; font-size:0.72rem; font-weight:700; padding:2px 8px; border-radius:999px; background:rgba(234,88,12,0.1); color:#ea580c;">${esc(inst.role || 'Faculty Mentor')}</span>
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
                  <div style="color:#ea580c; margin-bottom:0.5rem;">${svgIcon(sc.icon, 22)}</div>
                  <div style="font-weight:700; font-size:0.94rem; margin-bottom:0.25rem;">${esc(sc.title)}</div>
                  <div style="font-size:0.8rem; color:#64748b; line-height:1.5;">${esc(sc.desc)}</div>
                </div>
              `).join('')}
            </div>
          </section>

          <section id="enrSecSyllabus" class="acad-glass-panel" style="padding:1.35rem;">
            <h3 style="margin:0 0 0.9rem; font-size:1.15rem;">Course Syllabus (${syllabusRows.length})</h3>
            <div style="display:flex; flex-direction:column; gap:0.55rem;">
              ${syllabusRows.map((row, idx) => `
                <div style="display:flex; justify-content:space-between; align-items:center; gap:0.6rem; padding:0.78rem 1rem; border-radius:12px; border:1px solid rgba(15,23,42,0.08); background:rgba(255,255,255,0.68);">
                  <div style="display:flex; align-items:center; gap:0.55rem; font-weight:700; font-size:0.88rem;">
                    <span style="color:#ea580c;">${svgIcon('book', 15)}</span>
                    <span>${idx + 1}. ${esc(row.title)}</span>
                  </div>
                  <span style="font-size:0.74rem; color:#64748b; font-weight:600; white-space:nowrap;">${esc(row.meta)}</span>
                </div>
              `).join('')}
            </div>
          </section>

          <section id="enrSecPay" class="acad-glass-panel" style="padding:1.45rem;">
            <h3 style="margin:0 0 0.5rem; font-size:1.18rem;">${locked ? 'Enroll & Complete Payment' : 'Course Access'}</h3>
            ${locked ? `
              <div style="background:rgba(234,88,12,0.07); border:1px solid rgba(234,88,12,0.25); border-radius:14px; padding:1rem 1.1rem; margin-bottom:1.15rem; font-size:0.84rem; line-height:1.6;">
                <strong style="color:#ea580c;">Payment Instructions:</strong><br>
                ${esc(item.paymentInstructions || `Send ৳${Number(item.price).toLocaleString()} via bKash / Nagad / Rocket and submit your Transaction ID (TrxID) below. Once verified, you will receive your Unlock Access Code.`)}
              </div>

              <form id="acadEnrollForm" onsubmit="window.handleSubmitCourseEnroll(event, '${esc(item.id)}')" style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.25rem;">
                <input type="text" id="enrNameInput" class="form-input" placeholder="Full Name *" required>
                <input type="email" id="enrEmailInput" class="form-input" placeholder="Email Address *" required>
                <input type="text" id="enrPhoneInput" class="form-input" placeholder="Mobile / bKash Number *" required>
                <input type="text" id="enrCollegeInput" class="form-input" placeholder="College Name">
                <select id="enrMethodInput" class="form-select">
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
                <input type="text" id="enrTrxInput" class="form-input" placeholder="Transaction ID (TrxID) *" required>
                <div style="grid-column:1 / -1; display:flex; justify-content:flex-end;">
                  <button type="submit" id="enrSubmitBtn" class="btn btn-primary" style="padding:0.65rem 1.6rem; font-weight:700;">Submit Enrollment (৳${Number(item.price).toLocaleString()})</button>
                </div>
              </form>

              <div style="border-top:1px solid rgba(15,23,42,0.08); padding-top:1rem;">
                <div style="font-size:0.82rem; font-weight:700; margin-bottom:0.45rem;">Have an Access Code? Unlock Instantly:</div>
                <form onsubmit="window.handleVerifyCourseCode(event, '${esc(item.id)}', ${isClassItem})" style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                  <input type="text" id="enrAccessCodeInput" class="form-input" placeholder="Enter your course access code..." style="flex:1; min-width:200px;" required>
                  <button type="submit" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:0.4rem;">${svgIcon('unlock', 15)} <span>Unlock Now</span></button>
                </form>
              </div>
            ` : `
              <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:14px; padding:1.1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.8rem;">
                <div style="font-size:0.88rem; color:#065f46; font-weight:600;">Full access is unlocked for ${esc(item.name)}.</div>
                <button type="button" class="btn btn-primary" onclick="${isClassItem ? `window.enterAcadCourse('${esc(item.id)}')` : `window.enterAcadSubject('${esc(item.id)}')`}">Enter Course</button>
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
                    ${svgIcon('chevronDown', 16)}
                  </button>
                  <div id="acadFaqA_${i}" class="acad-faq-a" style="display:${i === 0 ? 'block' : 'none'};">${esc(f.a)}</div>
                </div>
              `).join('')}
            </div>
          </section>
        </div>

        <aside class="acad-enroll-sticky">
          <div style="aspect-ratio:16/9; overflow:hidden; background:#071f16;">
            <img src="${esc(imgSrc)}" alt="${esc(item.name)}" style="width:100%; height:100%; object-fit:cover; display:block;">
          </div>
          <div style="padding:1.35rem;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:0.85rem;">
              ${isPaid ? `
                <div style="display:flex; align-items:baseline; gap:0.5rem;">
                  <span style="font-size:1.65rem; font-weight:800; color:#059669;">৳${Number(item.price).toLocaleString()}</span>
                  ${item.originalPrice > item.price ? `<span style="font-size:0.95rem; color:#94a3b8; text-decoration:line-through;">৳${Number(item.originalPrice).toLocaleString()}</span>` : ''}
                </div>
                ${saveAmt > 0 ? `<span style="font-size:0.82rem; font-weight:800; color:#ea580c;">Save ৳${saveAmt.toLocaleString()}</span>` : ''}
              ` : `
                <span style="font-size:1.5rem; font-weight:800; color:#059669;">Free</span>
                <span style="font-size:0.76rem; font-weight:700; color:#64748b;">Public Access</span>
              `}
            </div>

            ${locked ? `
              <button type="button" class="btn btn-primary" onclick="document.getElementById('enrSecPay')?.scrollIntoView({behavior:'smooth'})" style="width:100%; justify-content:center; padding:0.82rem; font-size:0.96rem; font-weight:800; border-radius:12px; background:#059669; border-color:#059669; margin-bottom:1.15rem;">
                Enroll / Buy Course Now
              </button>
            ` : `
              <button type="button" class="btn btn-primary" onclick="${isClassItem ? `window.enterAcadCourse('${esc(item.id)}')` : `window.enterAcadSubject('${esc(item.id)}')`}" style="width:100%; justify-content:center; padding:0.82rem; font-size:0.96rem; font-weight:800; border-radius:12px; margin-bottom:1.15rem;">
                Access Course Now
              </button>
            `}

            <div style="font-weight:800; font-size:0.92rem; margin-bottom:0.65rem;">Included in This Course</div>
            <ul style="list-style:none; padding:0; margin:0 0 1.15rem; display:flex; flex-direction:column; gap:0.5rem; font-size:0.83rem; color:#475569;">
              ${features.map((ft) => `<li style="display:flex; align-items:flex-start; gap:0.45rem;"><span style="color:#059669; margin-top:2px;">${svgIcon('checkCircle', 14)}</span><span>${esc(ft)}</span></li>`).join('')}
            </ul>

            <div style="border-top:1px solid #e2e8f0; padding-top:0.85rem; text-align:center; font-size:0.8rem; color:#64748b;">
              Need enrollment support?<br>
              <strong style="color:#059669; display:inline-flex; align-items:center; gap:0.35rem; margin-top:0.25rem;">${svgIcon('phone', 14)} ${esc(item.enrollPhone || 'curiomas.members@gmail.com')}</strong>
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
      if (selectedDivisionId && (it.divisionId || 'div_academics') !== selectedDivisionId) return false;
      if (activeChapter !== 'all' && String(it.chapter || '') !== activeChapter) return false;
      return true;
    });
  }

  function renderWorkspaceView() {
    const wrap = document.getElementById('acadWorkspaceView');
    const cls = getClassById(selectedClassId) || catalog.classes[0];
    const sub = getSubjectById(selectedSubjectId);
    if (!wrap || !sub) { setView('subjects'); return; }

    const activeDiv = selectedDivisionId ? getDivisionById(selectedDivisionId) : null;
    const isBooksDiv = activeDiv && (activeDiv.slug === 'books' || /book/i.test(activeDiv.name));

    const divCardsHtml = catalog.divisions.map((d) => {
      const isAct = selectedDivisionId === d.id;
      const mc = catalog.mcqs.filter((m) => m.subjectId === sub.id && (m.divisionId || 'div_academics') === d.id).length;
      const cc = catalog.cqs.filter((c) => c.subjectId === sub.id && (c.divisionId || 'div_academics') === d.id).length;
      const nc = catalog.notes.filter((n) => n.subjectId === sub.id && (n.divisionId || 'div_books') === d.id).length;
      const iconKey = resolveDivIconName(d);
      return `
        <button type="button" class="acad-div-card ${isAct ? 'active' : ''}" style="--div-accent:${esc(d.accentColor || '#ea580c')};" onclick="window.selectAcadDivision('${esc(d.id)}')">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem;">
            <span style="width:36px; height:36px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; background:${isAct ? 'rgba(255,255,255,0.2)' : 'rgba(234,88,12,0.1)'}; color:${isAct ? '#ffffff' : (d.accentColor || '#ea580c')};">${svgIcon(iconKey, 18)}</span>
            <span style="font-size:0.72rem; font-weight:700; opacity:0.8;">${mc + cc + nc}</span>
          </div>
          <div style="font-weight:800; font-size:1.02rem; margin-top:0.25rem;">${esc(d.name)}</div>
          <div style="font-size:0.74rem; opacity:${isAct ? '0.9' : '0.7'};">${mc} MCQs / ${cc} CQs${nc ? ` / ${nc} Books` : ''}</div>
        </button>
      `;
    }).join('');

    let step2Html = '';
    if (selectedDivisionId) {
      const divMcqs = filterWorkspaceItems(catalog.mcqs);
      const divCqs = filterWorkspaceItems(catalog.cqs);
      const divNotes = filterWorkspaceItems(catalog.notes);
      const chSet = new Set(sub.chapters || []);
      [...catalog.mcqs, ...catalog.cqs, ...catalog.notes].forEach((it) => {
        if (it.subjectId === sub.id && it.chapter) chSet.add(it.chapter);
      });
      const chapters = Array.from(chSet);

      step2Html = `
        <div style="margin-top:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.65rem; margin-bottom:0.85rem;">
            <div style="font-size:0.78rem; font-weight:800; color:#ea580c; text-transform:uppercase; letter-spacing:0.06em;">Select Question Mode</div>
            <select id="acadWsChapterSel" class="form-select" onchange="window.setAcadWsChapter(this.value)" style="max-width:270px; font-size:0.84rem;">
              <option value="all">All Chapters (${chapters.length})</option>
              ${chapters.map((ch) => `<option value="${esc(ch)}" ${activeChapter === ch ? 'selected' : ''}>${esc(ch)}</option>`).join('')}
            </select>
          </div>

          <div class="acad-seg-grid" style="margin-bottom:1.4rem;">
            <button type="button" class="acad-mode-card ${selectedQMode === 'mcq' ? 'active' : ''}" onclick="window.selectAcadQMode('mcq')" style="padding:1.15rem 1.25rem;">
              <div>
                <div style="display:flex; align-items:center; gap:0.45rem; font-size:1.08rem; font-weight:800; margin-bottom:0.2rem;">
                  <span style="color:#ea580c;">${svgIcon('checkCircle', 18)}</span>
                  <span>MCQ</span>
                </div>
                <div style="font-size:0.78rem; color:#64748b;">Timed Auto-Exam & Practice</div>
              </div>
              <span style="font-size:1.15rem; font-weight:800; color:#ea580c;">${divMcqs.length}</span>
            </button>

            <button type="button" class="acad-mode-card ${selectedQMode === 'cq' ? 'active' : ''}" onclick="window.selectAcadQMode('cq')" style="padding:1.15rem 1.25rem;">
              <div>
                <div style="display:flex; align-items:center; gap:0.45rem; font-size:1.08rem; font-weight:800; margin-bottom:0.2rem;">
                  <span style="color:#0284c7;">${svgIcon('fileText', 18)}</span>
                  <span>CQ</span>
                </div>
                <div style="font-size:0.78rem; color:#64748b;">Creative Question Selectors</div>
              </div>
              <span style="font-size:1.15rem; font-weight:800; color:#0284c7;">${divCqs.length}</span>
            </button>

            <button type="button" class="acad-mode-card ${selectedQMode === 'both' ? 'active' : ''}" onclick="window.selectAcadQMode('both')" style="padding:1.15rem 1.25rem;">
              <div>
                <div style="display:flex; align-items:center; gap:0.45rem; font-size:1.08rem; font-weight:800; margin-bottom:0.2rem;">
                  <span style="color:#059669;">${svgIcon('layers', 18)}</span>
                  <span>Both (MCQ + CQ)</span>
                </div>
                <div style="font-size:0.78rem; color:#64748b;">Combined Exam & CQ Bank</div>
              </div>
              <span style="font-size:1.15rem; font-weight:800; color:#059669;">${divMcqs.length + divCqs.length}</span>
            </button>
          </div>

          ${isBooksDiv && divNotes.length > 0 ? `<div id="acadBooksInlineBox" style="margin-bottom:1.5rem;"></div>` : ''}
          <div id="acadWorkspaceContent"></div>
        </div>
      `;
    }

    wrap.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; margin-bottom:1.35rem;">
        <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.backToAcadSubjects()" style="display:inline-flex; align-items:center; gap:0.4rem;">
            ${svgIcon('arrowLeft', 15)}
            <span>${esc(cls ? cls.shortName || cls.name : 'Subjects')}</span>
          </button>
          <span style="color:#94a3b8;">/</span>
          <strong style="font-size:1.1rem;">${esc(sub.name)}</strong>
          ${activeDiv ? `<span style="color:#94a3b8;">/</span><span style="font-weight:700; color:#ea580c;">${esc(activeDiv.name)}</span>` : ''}
        </div>
        <div style="display:flex; gap:0.45rem; flex-wrap:wrap;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.saveAcademicsOffline()" style="display:inline-flex; align-items:center; gap:0.35rem;" title="Save Question DB Offline">
            ${svgIcon('cloudOff', 15)}
            <span>Offline Sync</span>
          </button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.openAcadStatsView()" style="display:inline-flex; align-items:center; gap:0.35rem;">
            ${svgIcon('barChart', 15)}
            <span>History</span>
          </button>
        </div>
      </div>

      <div style="font-size:0.78rem; font-weight:800; color:#ea580c; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.7rem;">Select Track</div>
      <div class="acad-div-grid">${divCardsHtml}</div>

      ${step2Html}
    `;

    if (selectedDivisionId) {
      if (isBooksDiv) {
        const bBox = document.getElementById('acadBooksInlineBox');
        if (bBox) renderBooksList(bBox);
      }
      renderWorkspaceInnerContent();
    }
  }

  function renderWorkspaceInnerContent() {
    const box = document.getElementById('acadWorkspaceContent');
    if (!box) return;
    if (selectedQMode === 'mcq') {
      box.innerHTML = `<div id="acadMcqArea"></div>`;
      renderMcqSection(document.getElementById('acadMcqArea'));
    } else if (selectedQMode === 'cq') {
      box.innerHTML = `<div id="acadCqArea"></div>`;
      renderCqSelectorAndDetail(document.getElementById('acadCqArea'));
    } else {
      box.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.75rem;">
          <div id="acadMcqArea"></div>
          <div id="acadCqArea"></div>
        </div>
      `;
      renderMcqSection(document.getElementById('acadMcqArea'));
      renderCqSelectorAndDetail(document.getElementById('acadCqArea'));
    }
  }

  function renderMcqSection(pane) {
    if (!pane) return;
    const headerSwitch = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.65rem; margin-bottom:0.9rem;">
        <h3 style="margin:0; font-size:1.15rem;">MCQ Workspace</h3>
        <div style="display:flex; gap:0.4rem;">
          <button type="button" class="btn btn-sm ${mcqSubMode === 'exam' ? 'btn-primary' : 'btn-secondary'}" onclick="window.setAcadMcqSubMode('exam')">Timed Auto-Exam</button>
          <button type="button" class="btn btn-sm ${mcqSubMode === 'practice' ? 'btn-primary' : 'btn-secondary'}" onclick="window.setAcadMcqSubMode('practice')">Practice Bank</button>
        </div>
      </div>
      <div id="acadMcqInner"></div>
    `;
    pane.innerHTML = headerSwitch;
    const inner = document.getElementById('acadMcqInner');
    if (mcqSubMode === 'exam') renderExamRunner(inner);
    else renderMcqPracticeList(inner);
  }

  function renderExamRunner(pane) {
    const sub = getSubjectById(selectedSubjectId);
    const div = getDivisionById(selectedDivisionId);
    const pool = filterWorkspaceItems(catalog.mcqs);
    const defaultNeg = div && /medical|buet/i.test(div.name || '') ? '0.25' : '0';

    if (!examState) {
      pane.innerHTML = `
        <div class="acad-glass-panel" style="padding:1.55rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.8rem; margin-bottom:1.15rem;">
            <div>
              <h4 style="font-size:1.15rem; margin:0 0 0.25rem;">${esc(sub ? sub.name : '')} — ${esc(div ? div.name : '')} Exam</h4>
              <p style="margin:0; font-size:0.84rem; color:#64748b;">Automated timed test with instant scoring & offline localStorage history.</p>
            </div>
            <span style="padding:0.35rem 0.8rem; border-radius:999px; background:rgba(234,88,12,0.1); color:#ea580c; font-size:0.78rem; font-weight:800;">${pool.length} MCQs Available</span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(175px, 1fr)); gap:0.85rem; margin-bottom:1.2rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" style="font-size:0.76rem; font-weight:700;">Questions</label>
              <select id="acadExamCount" class="form-select">
                <option value="5">5 Questions</option>
                <option value="10" selected>10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="25">25 Questions</option>
                <option value="all">All Matching (${pool.length})</option>
              </select>
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" style="font-size:0.76rem; font-weight:700;">Timer</label>
              <select id="acadExamSecPerQ" class="form-select">
                <option value="60" selected>1 min / question</option>
                <option value="45">45 sec / question</option>
                <option value="30">30 sec / question</option>
                <option value="0">Untimed</option>
              </select>
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" style="font-size:0.76rem; font-weight:700;">Negative Marking</label>
              <select id="acadExamNegMark" class="form-select">
                <option value="0" ${defaultNeg === '0' ? 'selected' : ''}>None</option>
                <option value="0.25" ${defaultNeg === '0.25' ? 'selected' : ''}>-0.25 per wrong</option>
              </select>
            </div>
            <div class="form-group" style="margin:0; display:flex; align-items:flex-end;">
              <label style="display:flex; align-items:center; gap:0.45rem; font-size:0.84rem; font-weight:600; cursor:pointer; padding:0.55rem 0.85rem; border-radius:10px; border:1px solid rgba(15,23,42,0.12); width:100%;">
                <input type="checkbox" id="acadExamShuffle" checked style="accent-color:#ea580c; width:16px; height:16px;">
                <span>Shuffle</span>
              </label>
            </div>
          </div>

          <div style="display:flex; gap:0.65rem; align-items:center; flex-wrap:wrap;">
            <button type="button" class="btn btn-primary" onclick="window.startAcadAutoExam()" ${pool.length === 0 ? 'disabled' : ''} style="padding:0.68rem 1.65rem; font-weight:700;">Start Exam</button>
            ${pool.length === 0 ? '<span style="font-size:0.82rem; color:#64748b;">No MCQs added to this track yet.</span>' : ''}
          </div>
        </div>
      `;
      return;
    }

    if (examState.submitted) {
      const { questions, answers, negMark, startedAt, finishedAt } = examState;
      let correct = 0, wrong = 0, skipped = 0;
      const wrongIds = [];
      questions.forEach((q, idx) => {
        const chosen = answers[idx];
        if (chosen === undefined || chosen === null) skipped++;
        else if (Number(chosen) === Number(q.correctIndex)) correct++;
        else { wrong++; wrongIds.push(q.id); }
      });
      const rawScore = Math.max(0, +(correct - wrong * negMark).toFixed(2));
      const pct = questions.length > 0 ? Math.round((rawScore / questions.length) * 100) : 0;
      const grade = pct >= 80 ? 'A+ (5.0)' : pct >= 70 ? 'A (4.0)' : pct >= 60 ? 'A- (3.5)' : pct >= 50 ? 'B (3.0)' : pct >= 40 ? 'C (2.0)' : pct >= 33 ? 'D' : 'F';
      const elapsedSec = Math.max(1, Math.round(((finishedAt || Date.now()) - startedAt) / 1000));
      const letters = ['A', 'B', 'C', 'D'];

      pane.innerHTML = `
        <div class="acad-glass-panel" style="padding:1.55rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.9rem; margin-bottom:1.2rem;">
            <div>
              <div style="font-size:0.74rem; font-weight:800; color:#ea580c; text-transform:uppercase;">Scorecard (Saved Locally)</div>
              <h3 style="font-size:1.45rem; margin:0.2rem 0 0;">${rawScore} / ${questions.length} (${pct}%) — Grade ${grade}</h3>
            </div>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              ${wrongIds.length > 0 ? `<button type="button" class="btn btn-primary btn-sm" onclick="window.startAcadCustomExam(${JSON.stringify(wrongIds).replace(/"/g, '&quot;')})">Retake ${wrongIds.length} Wrong</button>` : ''}
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.exitAcadExam()">New Exam</button>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(125px, 1fr)); gap:0.75rem; margin-bottom:1.35rem;">
            <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:12px; padding:0.75rem; text-align:center;"><div style="font-size:1.35rem; font-weight:800; color:#059669;">${correct}</div><div style="font-size:0.73rem; color:#047857; font-weight:700;">Correct</div></div>
            <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:12px; padding:0.75rem; text-align:center;"><div style="font-size:1.35rem; font-weight:800; color:#dc2626;">${wrong}</div><div style="font-size:0.73rem; color:#b91c1c; font-weight:700;">Wrong</div></div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:0.75rem; text-align:center;"><div style="font-size:1.35rem; font-weight:800; color:#475569;">${skipped}</div><div style="font-size:0.73rem; color:#64748b; font-weight:700;">Skipped</div></div>
            <div style="background:#fff7ed; border:1px solid #fed7aa; border-radius:12px; padding:0.75rem; text-align:center;"><div style="font-size:1.35rem; font-weight:800; color:#ea580c;">${Math.floor(elapsedSec / 60)}m ${elapsedSec % 60}s</div><div style="font-size:0.73rem; color:#c2410c; font-weight:700;">Time</div></div>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.85rem;">
            ${questions.map((q, idx) => {
              const chosen = answers[idx];
              const isCorrect = chosen !== undefined && Number(chosen) === Number(q.correctIndex);
              const isSkipped = chosen === undefined || chosen === null;
              return `
                <div style="border:1.5px solid ${isCorrect ? '#86efac' : isSkipped ? '#cbd5e1' : '#fca5a5'}; border-radius:14px; padding:1rem 1.15rem; background:${isCorrect ? '#f0fdf4' : isSkipped ? '#f8fafc' : '#fef2f2'};">
                  <div style="display:flex; justify-content:space-between; gap:0.5rem; margin-bottom:0.4rem; font-size:0.74rem; font-weight:700;">
                    <span style="color:#475569;">Q${idx + 1} / ${esc(q.chapter || '')}</span>
                    <span style="color:${isCorrect ? '#059669' : isSkipped ? '#64748b' : '#dc2626'};">${isCorrect ? 'Correct' : isSkipped ? 'Skipped' : 'Incorrect'}</span>
                  </div>
                  <div style="font-weight:700; font-size:0.95rem; color:#0f172a; margin-bottom:0.6rem;">${esc(q.question)}</div>
                  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.4rem; margin-bottom:0.6rem;">
                    ${(q.options || []).map((opt, oi) => {
                      const right = oi === Number(q.correctIndex);
                      const picked = chosen !== undefined && Number(chosen) === oi;
                      return `<div style="padding:0.42rem 0.65rem; border-radius:8px; border:1px solid ${right ? '#16a34a' : picked ? '#dc2626' : '#e2e8f0'}; background:${right ? '#dcfce7' : picked ? '#fee2e2' : '#ffffff'}; font-size:0.84rem; color:#0f172a;"><strong>${letters[oi] || oi + 1}.</strong> ${esc(opt)}</div>`;
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
            <span id="acadLiveTimerBadge" style="display:inline-flex; align-items:center; gap:0.35rem; font-family:monospace; font-weight:800; font-size:0.92rem; padding:0.3rem 0.75rem; border-radius:999px; background:${totalSec > 0 && remainingSec <= 30 ? '#fee2e2' : 'rgba(234,88,12,0.12)'}; color:${totalSec > 0 && remainingSec <= 30 ? '#dc2626' : '#ea580c'};">${svgIcon('clock', 14)} ${timerStr}</span>
            <button type="button" class="btn btn-primary btn-sm" onclick="window.submitAcadAutoExam()">Submit Exam</button>
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
          <span style="font-size:0.76rem; font-weight:700; color:#ea580c;">${esc(q.chapter || '')}${q.boardTag ? ' / ' + esc(q.boardTag) : ''}</span>
          <button type="button" class="btn btn-secondary btn-sm" style="display:inline-flex; align-items:center; gap:0.3rem; font-size:0.72rem; padding:0.22rem 0.6rem;" onclick="window.toggleFlagAcadExamQ(${currentIndex})">${svgIcon('flag', 13)} <span>${flagged[currentIndex] ? 'Flagged' : 'Flag'}</span></button>
        </div>

        <div style="font-size:1.06rem; font-weight:700; line-height:1.55; margin-bottom:1rem;">${esc(q.question)}</div>
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
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.jumpAcadExamQ(${Math.max(0, currentIndex - 1)})" ${currentIndex === 0 ? 'disabled' : ''}>Previous</button>
          ${currentIndex < questions.length - 1
            ? `<button type="button" class="btn btn-primary btn-sm" onclick="window.jumpAcadExamQ(${currentIndex + 1})">Next Question</button>`
            : `<button type="button" class="btn btn-primary btn-sm" onclick="window.submitAcadAutoExam()">Finish & Grade</button>`}
        </div>
      </div>
    `;
  }

  function renderMcqPracticeList(pane) {
    const list = filterWorkspaceItems(catalog.mcqs);
    const bm = getBookmarks();
    const letters = ['A', 'B', 'C', 'D'];
    if (!list.length) {
      pane.innerHTML = '<div class="acad-glass-panel" style="padding:2rem; text-align:center; color:#64748b;">No MCQs found in this track yet.</div>';
      return;
    }
    pane.innerHTML = `<div style="display:flex; flex-direction:column; gap:0.95rem;">` + list.map((q, idx) => {
      const picked = practiceAnswers[q.id];
      const revealed = picked !== undefined;
      const isBm = bm.mcqs.includes(q.id);
      return `
        <div class="acad-glass-panel" style="padding:1.25rem 1.35rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.45rem;">
            <span style="font-size:0.74rem; font-weight:700; color:#ea580c;">#${idx + 1} / ${esc(q.chapter || '')}${q.boardTag ? ' / ' + esc(q.boardTag) : ''}</span>
            <div style="display:flex; gap:0.4rem; align-items:center;">
              <span style="font-size:0.7rem; padding:2px 8px; border-radius:999px; background:rgba(234,88,12,0.1); color:#ea580c; font-weight:700;">${esc(q.difficulty || 'Medium')}</span>
              <button type="button" onclick="window.toggleAcadBookmark('mcqs', '${esc(q.id)}')" style="border:none; background:transparent; cursor:pointer; color:${isBm ? '#ea580c' : '#94a3b8'};" title="Bookmark">${svgIcon('bookmark', 16)}</button>
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
              <strong style="color:${picked === Number(q.correctIndex) ? '#15803d' : '#b91c1c'};">${picked === Number(q.correctIndex) ? 'Correct' : `Incorrect — Correct Option: ${letters[q.correctIndex] || Number(q.correctIndex) + 1}`}</strong><br>
              ${esc(q.explanation || '')}
            </div>
          ` : ''}
        </div>
      `;
    }).join('') + '</div>';
  }

  function renderCqSelectorAndDetail(pane) {
    if (!pane) return;
    const list = filterWorkspaceItems(catalog.cqs);
    if (!list.length) {
      pane.innerHTML = '<div class="acad-glass-panel" style="padding:2rem; text-align:center; color:#64748b;">No Creative Questions (CQs) added to this track yet.</div>';
      return;
    }

    if (!selectedCqId || !list.some((c) => c.id === selectedCqId)) {
      selectedCqId = list[0].id;
    }
    const activeCq = list.find((c) => c.id === selectedCqId) || list[0];
    const bm = getBookmarks();
    const isBm = bm.cqs.includes(activeCq.id);

    pane.innerHTML = `
      <div>
        <div style="font-size:0.78rem; font-weight:800; color:#ea580c; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.65rem;">CQ Selector (${list.length})</div>
        <div class="acad-cq-selector-grid" style="margin-bottom:1.25rem;">
          ${list.map((cq, idx) => `
            <button type="button" class="acad-cq-selector-card ${cq.id === activeCq.id ? 'active' : ''}" onclick="window.selectAcadCq('${esc(cq.id)}')">
              <div style="font-size:0.72rem; font-weight:700; color:#ea580c; margin-bottom:0.2rem;">CQ #${idx + 1}${cq.boardTag ? ' / ' + esc(cq.boardTag) : ''}</div>
              <div style="font-weight:700; font-size:0.92rem; line-height:1.3; margin-bottom:0.2rem;">${esc(cq.title || 'Creative Question')}</div>
              <div style="font-size:0.75rem; color:#64748b;">${esc(cq.chapter || '')}</div>
            </button>
          `).join('')}
        </div>

        <article class="acad-glass-panel" style="padding:1.45rem 1.55rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.6rem; margin-bottom:0.85rem;">
            <div>
              <div style="font-size:0.74rem; font-weight:700; color:#ea580c; text-transform:uppercase;">${esc(activeCq.chapter || '')}${activeCq.boardTag ? ' / ' + esc(activeCq.boardTag) : ''}</div>
              <h3 style="margin:0.2rem 0 0; font-size:1.18rem;">${esc(activeCq.title || 'Creative Question')}</h3>
            </div>
            <div style="display:flex; gap:0.45rem; align-items:center;">
              <button type="button" class="btn btn-secondary btn-sm" id="cqTimerBtn_${esc(activeCq.id)}" onclick="window.toggleCqTimer('${esc(activeCq.id)}')" style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.76rem;">
                ${svgIcon('clock', 14)}
                <span>20m Timer</span>
              </button>
              <button type="button" onclick="window.toggleAcadBookmark('cqs', '${esc(activeCq.id)}')" style="border:none; background:transparent; cursor:pointer; color:${isBm ? '#ea580c' : '#94a3b8'};" title="Bookmark CQ">${svgIcon('bookmark', 17)}</button>
            </div>
          </div>

          <div style="background:rgba(234,88,12,0.06); border-left:4px solid #ea580c; border-radius:10px; padding:0.95rem 1.1rem; margin-bottom:1rem; font-size:0.93rem; line-height:1.6;">
            <div style="font-size:0.7rem; font-weight:800; color:#ea580c; text-transform:uppercase; margin-bottom:0.25rem;">Uddipok / Stem</div>
            <div>${esc(activeCq.stem)}</div>
            ${activeCq.imageUrl ? `<div style="margin-top:0.75rem;"><img src="${esc(activeCq.imageUrl)}" alt="CQ Figure" style="max-width:100%; max-height:240px; border-radius:8px;"></div>` : ''}
          </div>

          <div style="display:flex; flex-direction:column; gap:0.55rem; margin-bottom:1.1rem; font-size:0.92rem;">
            <div><strong style="color:#ea580c;">(ক) [1 Mark]:</strong> ${esc(activeCq.partA)}</div>
            <div><strong style="color:#ea580c;">(খ) [2 Marks]:</strong> ${esc(activeCq.partB)}</div>
            <div><strong style="color:#ea580c;">(গ) [3 Marks]:</strong> ${esc(activeCq.partC)}</div>
            <div><strong style="color:#ea580c;">(ঘ) [4 Marks]:</strong> ${esc(activeCq.partD)}</div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" onclick="window.toggleCqSolution('${esc(activeCq.id)}', this)" style="display:inline-flex; align-items:center; gap:0.4rem;">
            ${svgIcon('eye', 15)}
            <span>Show Model Answer</span>
          </button>

          <div id="cqSol_${esc(activeCq.id)}" style="display:none; margin-top:0.9rem; background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:1rem 1.15rem; font-size:0.86rem; color:#1e293b; line-height:1.65;">
            <div style="margin-bottom:0.65rem;"><strong style="color:#059669;">(ক):</strong> ${esc(activeCq.ansA || '—').replace(/\n/g, '<br>')}</div>
            <div style="margin-bottom:0.65rem;"><strong style="color:#059669;">(খ):</strong> ${esc(activeCq.ansB || '—').replace(/\n/g, '<br>')}</div>
            <div style="margin-bottom:0.65rem;"><strong style="color:#059669;">(গ):</strong> ${esc(activeCq.ansC || '—').replace(/\n/g, '<br>')}</div>
            <div><strong style="color:#059669;">(ঘ):</strong> ${esc(activeCq.ansD || '—').replace(/\n/g, '<br>')}</div>
          </div>
        </article>
      </div>
    `;
  }

  function renderBooksList(pane) {
    const list = filterWorkspaceItems(catalog.notes);
    if (!list.length) return;
    pane.innerHTML = `
      <div style="font-size:0.78rem; font-weight:800; color:#059669; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.65rem;">Books, Concept Sheets & Reference Notes</div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1rem;">
        ${list.map((n) => `
          <article class="acad-glass-panel" style="padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between; gap:0.8rem;">
            <div>
              <span style="font-size:0.68rem; font-weight:800; padding:2px 8px; border-radius:999px; background:rgba(16,185,129,0.12); color:#059669; text-transform:uppercase;">${esc(n.resourceType || 'BOOK')}</span>
              <h3 style="margin:0.4rem 0 0.25rem; font-size:1.05rem;">${esc(n.title)}</h3>
              <div style="font-size:0.78rem; color:#64748b; margin-bottom:0.65rem;">${esc(n.chapter || '')}${n.summary ? ' — ' + esc(n.summary) : ''}</div>
              ${n.content ? `<div style="background:rgba(255,255,255,0.72); border:1px solid rgba(15,23,42,0.08); border-radius:12px; padding:0.85rem; max-height:240px; overflow-y:auto;">${formatSimpleMd(n.content)}</div>` : ''}
            </div>
            ${(n.fileUrl || n.videoUrl) ? `
              <div style="display:flex; gap:0.45rem; flex-wrap:wrap; padding-top:0.5rem; border-top:1px solid rgba(15,23,42,0.08);">
                ${n.fileUrl ? `<a href="${esc(n.fileUrl)}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Open PDF / Book</a>` : ''}
                ${n.videoUrl ? `<a href="${esc(n.videoUrl)}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">Watch Lecture</a>` : ''}
              </div>
            ` : ''}
          </article>
        `).join('')}
      </div>
    `;
  }

  function renderStatsView() {
    const wrap = document.getElementById('acadStatsView');
    if (!wrap) return;
    const hist = getHistory();
    const bm = getBookmarks();
    const avgPct = hist.length ? Math.round(hist.reduce((a, b) => a + (b.pct || 0), 0) / hist.length) : 0;

    wrap.innerHTML = `
      <div style="margin-bottom:1.2rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
        <button type="button" class="btn btn-secondary btn-sm" onclick="window.backToAcadSubjects()" style="display:inline-flex; align-items:center; gap:0.4rem;">
          ${svgIcon('arrowLeft', 15)}
          <span>Back</span>
        </button>
        <div style="display:flex; gap:0.45rem; flex-wrap:wrap;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.saveAcademicsOffline()">Sync Offline DB</button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.exportAcadOfflineFile()">Export JSON</button>
          <label class="btn btn-secondary btn-sm" style="cursor:pointer; margin:0;">
            Import JSON
            <input type="file" accept=".json,application/json" style="display:none;" onchange="window.importAcadOfflineFile(event)">
          </label>
          ${hist.length ? `<button type="button" class="btn btn-secondary btn-sm" onclick="window.clearAcadHistory()">Clear History</button>` : ''}
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(170px, 1fr)); gap:0.85rem; margin-bottom:1.35rem;">
        <div class="acad-glass-panel" style="padding:1.1rem; text-align:center;"><div style="font-size:1.6rem; font-weight:800; color:#ea580c;">${hist.length}</div><div style="font-size:0.78rem; color:#64748b; font-weight:700;">Exams Taken</div></div>
        <div class="acad-glass-panel" style="padding:1.1rem; text-align:center;"><div style="font-size:1.6rem; font-weight:800; color:#059669;">${avgPct}%</div><div style="font-size:0.78rem; color:#64748b; font-weight:700;">Average Score</div></div>
        <div class="acad-glass-panel" style="padding:1.1rem; text-align:center;"><div style="font-size:1.6rem; font-weight:800; color:#0284c7;">${bm.mcqs.length + bm.cqs.length}</div><div style="font-size:0.78rem; color:#64748b; font-weight:700;">Bookmarks</div></div>
      </div>

      <div class="acad-glass-panel" style="padding:1.35rem;">
        <h3 style="margin:0 0 0.85rem; font-size:1.08rem;">Offline Exam History</h3>
        ${hist.length === 0
          ? '<div style="font-size:0.86rem; color:#64748b;">No exams completed yet.</div>'
          : `<div style="display:flex; flex-direction:column; gap:0.55rem;">` + hist.slice(0, 25).map((h) => `
              <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem; padding:0.7rem 0.9rem; border-radius:10px; background:rgba(15,23,42,0.03); border:1px solid rgba(15,23,42,0.08);">
                <div>
                  <div style="font-weight:700; font-size:0.86rem;">${esc(h.scope || 'Exam')}</div>
                  <div style="font-size:0.72rem; color:#64748b;">${new Date(h.ts).toLocaleString()}</div>
                </div>
                <div style="font-weight:800; font-size:0.95rem; color:${h.pct >= 70 ? '#059669' : '#ea580c'};">${h.score}/${h.total} (${h.pct}%)</div>
              </div>
            `).join('') + '</div>'}
      </div>
    `;
  }

  window.handleCourseCardClick = function (classId) {
    const cls = getClassById(classId);
    if (!cls) return;
    if (isLocked(cls)) window.openCourseEnroll(classId);
    else window.enterAcadCourse(classId);
  };

  window.openCourseEnroll = function (id) {
    if (getClassById(id)) {
      selectedClassId = id;
      selectedSubjectId = null;
    } else {
      selectedSubjectId = id;
    }
    setView('enroll');
  };

  window.enterAcadCourse = function (classId) {
    const cls = getClassById(classId);
    if (cls && isLocked(cls)) {
      window.openCourseEnroll(classId);
      return;
    }
    selectedClassId = classId;
    selectedSubjectId = null;
    selectedDivisionId = null;
    clearExamTimer();
    examState = null;
    setView('subjects');
  };

  window.handleSubjectTileClick = function (subId) {
    const sub = getSubjectById(subId);
    if (!sub) return;
    if (isLocked(sub)) {
      selectedSubjectId = subId;
      setView('enroll');
      return;
    }
    window.enterAcadSubject(subId);
  };

  window.enterAcadSubject = function (subId) {
    clearExamTimer();
    examState = null;
    selectedSubjectId = subId;
    selectedDivisionId = null;
    selectedQMode = 'mcq';
    mcqSubMode = 'exam';
    selectedCqId = null;
    activeChapter = 'all';
    setView('workspace');
  };

  window.backToAcadCourses = function () {
    clearExamTimer();
    examState = null;
    setView('courses');
  };

  window.backToAcadSubjects = function () {
    clearExamTimer();
    examState = null;
    if (!selectedClassId && catalog.classes[0]) selectedClassId = catalog.classes[0].id;
    setView('subjects');
  };

  window.openAcadStatsView = function () {
    setView('stats');
  };

  window.selectAcadDivision = function (divId) {
    clearExamTimer();
    examState = null;
    selectedDivisionId = divId;
    selectedCqId = null;
    activeChapter = 'all';
    selectedQMode = 'mcq';
    mcqSubMode = 'exam';
    renderWorkspaceView();
  };

  window.selectAcadQMode = function (mode) {
    clearExamTimer();
    examState = null;
    selectedQMode = mode;
    renderWorkspaceView();
  };

  window.selectAcadCq = function (cqId) {
    selectedCqId = cqId;
    renderWorkspaceInnerContent();
  };

  window.setAcadMcqSubMode = function (sub) {
    clearExamTimer();
    examState = null;
    mcqSubMode = sub;
    renderWorkspaceInnerContent();
  };

  window.setAcadWsChapter = function (ch) {
    activeChapter = ch;
    selectedCqId = null;
    renderWorkspaceInnerContent();
  };

  window.handleSubmitCourseEnroll = async function (e, targetId) {
    e.preventDefault();
    const btn = document.getElementById('enrSubmitBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }
    try {
      const item = getClassById(targetId) || getSubjectById(targetId);
      const res = await fetch('/api/academics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enroll_course',
          targetId,
          subjectId: targetId,
          subjectName: item ? item.name : '',
          studentName: document.getElementById('enrNameInput').value.trim(),
          studentEmail: document.getElementById('enrEmailInput').value.trim(),
          studentPhone: document.getElementById('enrPhoneInput').value.trim(),
          college: document.getElementById('enrCollegeInput').value.trim(),
          paymentMethod: document.getElementById('enrMethodInput').value,
          trxId: document.getElementById('enrTrxInput').value.trim(),
          amount: item ? item.price : 0
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

  window.handleVerifyCourseCode = async function (e, targetId, isClassItem) {
    e.preventDefault();
    const code = (document.getElementById('enrAccessCodeInput')?.value || '').trim();
    if (!code) return;
    try {
      const res = await fetch('/api/academics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_access_code', targetId, subjectId: targetId, code })
      });
      const data = await res.json();
      if (!res.ok || !data.unlocked) throw new Error(data.error || 'Invalid code');
      const unlocked = getUnlockedIds();
      if (!unlocked.includes(targetId)) {
        unlocked.push(targetId);
        saveJson(UNLOCKED_KEY, unlocked);
      }
      if (window.showToast) window.showToast('Course unlocked!', 'success');
      if (isClassItem) window.enterAcadCourse(targetId);
      else window.enterAcadSubject(targetId);
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
    launchExam(selected, secPerQ, negMark, `${sub ? sub.name : 'HSC'} / ${div ? div.name : ''}`);
  };

  window.startAcadCustomExam = function (ids) {
    const idSet = new Set(Array.isArray(ids) ? ids : []);
    const selected = catalog.mcqs.filter((m) => idSet.has(m.id));
    if (!selected.length) return;
    mcqSubMode = 'exam';
    launchExam(selected, 60, 0, 'Revision Exam');
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
          badge.innerHTML = `${svgIcon('clock', 14)} ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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

    let correct = 0, wrong = 0;
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

    if (timedOut && window.showToast) window.showToast('Time expired. Exam graded and saved locally.', 'info');
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
    if (btnEl) btnEl.innerHTML = `${svgIcon('eye', 15)} <span>${open ? 'Hide Model Answer' : 'Show Model Answer'}</span>`;
  };

  window.toggleCqTimer = function (id) {
    const btn = document.getElementById('cqTimerBtn_' + id);
    if (cqTimerHandles[id]) {
      clearInterval(cqTimerHandles[id]);
      delete cqTimerHandles[id];
      if (btn) btn.innerHTML = `${svgIcon('clock', 14)} <span>20m Timer</span>`;
      return;
    }
    let left = 20 * 60;
    const tick = () => {
      const m = Math.floor(left / 60);
      const s = left % 60;
      if (btn) btn.innerHTML = `${svgIcon('clock', 14)} <span>${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}</span>`;
      if (left <= 0) {
        clearInterval(cqTimerHandles[id]);
        delete cqTimerHandles[id];
        if (window.showToast) window.showToast('20-minute CQ timer finished.', 'info');
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
      if (window.showToast) window.showToast('Question DB synced for offline exams.', 'success');
    } catch (e) {
      if (window.showToast) window.showToast('Offline Question DB is already cached.', 'info');
    }
  };

  window.exportAcadOfflineFile = function () {
    const blob = new Blob([JSON.stringify(catalog, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `crii-academics-db-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    if (window.showToast) window.showToast('Exported offline Question DB.', 'success');
  };

  window.importAcadOfflineFile = function (e) {
    const file = e.target && e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        if (!Array.isArray(parsed.classes) || !Array.isArray(parsed.subjects)) throw new Error('Invalid DB file');
        catalog = parsed;
        saveJson(OFFLINE_CACHE_KEY, parsed);
        setView('courses');
        if (window.showToast) window.showToast('Offline Question DB imported.', 'success');
      } catch (err) {
        if (window.showToast) window.showToast('Import failed: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  };

  window.initAcademicsHub = async function () {
    const cached = loadJson(OFFLINE_CACHE_KEY, null);
    if (cached && Array.isArray(cached.classes)) {
      catalog = cached;
      setView('courses');
    }

    try {
      const res = await fetch('/api/academics', { cache: 'no-store' });
      if (res.ok) {
        const fresh = await res.json();
        if (fresh && Array.isArray(fresh.classes)) {
          catalog = fresh;
          saveJson(OFFLINE_CACHE_KEY, fresh);
          if (currentView === 'courses') renderCoursesView();
          else if (currentView === 'subjects') renderSubjectsView();
          else if (currentView === 'workspace') renderWorkspaceView();
          else if (currentView === 'enroll') renderCourseEnrollView();
        }
      }
    } catch (e) {}
  };
})();
