(function () {
  const OFFLINE_CACHE_KEY = 'crii_academics_offline_cache_v1';
  const HISTORY_KEY = 'crii_academics_exam_history_v1';
  const BOOKMARKS_KEY = 'crii_academics_bookmarks_v1';

  let catalog = { classes: [], subjects: [], mcqs: [], cqs: [], notes: [], stats: {} };
  let activeClassId = 'all';
  let activeSubjectId = 'all';
  let activeChapter = 'all';
  let searchQuery = '';
  let activeMode = 'exam';

  let examState = null;
  let examTimerHandle = null;
  let cqTimerHandles = {};
  let practiceAnswers = {};

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function loadJsonStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function saveJsonStorage(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  function getBookmarks() {
    return loadJsonStorage(BOOKMARKS_KEY, { mcqs: [], cqs: [] });
  }

  function getHistory() {
    return loadJsonStorage(HISTORY_KEY, []);
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

  function getSubjectName(subjectId) {
    const s = catalog.subjects.find((x) => x.id === subjectId);
    return s ? s.name : 'General';
  }

  function getClassName(classId) {
    const c = catalog.classes.find((x) => x.id === classId);
    return c ? (c.shortName || c.name) : '';
  }

  function getFilteredSubjects() {
    if (activeClassId === 'all') return catalog.subjects;
    return catalog.subjects.filter((s) => s.classId === activeClassId);
  }

  function matchesBaseFilters(item) {
    if (activeClassId !== 'all' && item.classId !== activeClassId) return false;
    if (activeSubjectId !== 'all' && item.subjectId !== activeSubjectId) return false;
    if (activeChapter !== 'all' && String(item.chapter || '') !== activeChapter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const hay = [
        item.question, item.explanation, item.boardTag, item.chapter, item.title,
        item.stem, item.partA, item.partB, item.partC, item.partD, item.summary, item.content,
        getSubjectName(item.subjectId), getClassName(item.classId),
        ...(Array.isArray(item.options) ? item.options : [])
      ].filter(Boolean).join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }

  function updateOfflineBadge(fromCache, ts) {
    const badge = document.getElementById('acadOfflineBadge');
    const strip = document.getElementById('acadStatsStrip');
    if (badge) {
      if (!navigator.onLine) {
        badge.textContent = '📡 Offline Mode Active';
        badge.style.background = 'rgba(245,158,11,0.16)';
        badge.style.color = '#b45309';
      } else if (fromCache) {
        badge.textContent = '✓ Offline Ready (Cached)';
        badge.style.background = 'rgba(16,185,129,0.14)';
        badge.style.color = '#059669';
      } else {
        badge.textContent = '✓ Synced & Offline Cached';
        badge.style.background = 'rgba(16,185,129,0.14)';
        badge.style.color = '#059669';
      }
    }
    if (strip) {
      strip.textContent = `${catalog.classes.length} Classes • ${catalog.subjects.length} Subjects • ${catalog.mcqs.length} MCQs • ${catalog.cqs.length} CQs • ${catalog.notes.length} Notes`;
    }
  }

  function renderClassesGrid() {
    const grid = document.getElementById('acadClassesGrid');
    if (!grid) return;

    const allCard = `
      <button type="button" onclick="window.setAcadClass('all')" style="text-align:left; cursor:pointer; background:${activeClassId === 'all' ? 'linear-gradient(135deg, #ea580c, #f97316)' : '#ffffff'}; color:${activeClassId === 'all' ? '#ffffff' : '#0f172a'}; border:1.5px solid ${activeClassId === 'all' ? '#ea580c' : '#e7e2da'}; border-radius:16px; padding:1.1rem 1.2rem; display:flex; flex-direction:column; justify-content:space-between; gap:0.5rem; box-shadow:0 6px 18px rgba(15,23,42,0.04); transition:transform 0.15s ease;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem;">
          <span style="font-weight:800; font-size:1.05rem;">All Classes</span>
          <span style="font-size:0.68rem; font-weight:700; padding:2px 8px; border-radius:999px; background:${activeClassId === 'all' ? 'rgba(255,255,255,0.2)' : 'rgba(234,88,12,0.1)'}; color:${activeClassId === 'all' ? '#ffffff' : '#ea580c'};">ALL</span>
        </div>
        <div style="font-size:0.78rem; opacity:${activeClassId === 'all' ? '0.92' : '0.75'}; line-height:1.45;">Browse SSC, HSC, Foundation & Admission question banks together.</div>
        <div style="font-size:0.74rem; font-weight:700; opacity:0.9;">${catalog.mcqs.length} MCQs • ${catalog.cqs.length} CQs • ${catalog.notes.length} Notes</div>
      </button>
    `;

    const cards = catalog.classes.map((c) => {
      const isAct = activeClassId === c.id;
      const mc = catalog.mcqs.filter((m) => m.classId === c.id).length;
      const cc = catalog.cqs.filter((q) => q.classId === c.id).length;
      const nc = catalog.notes.filter((n) => n.classId === c.id).length;
      const accent = c.accentColor || '#ea580c';
      return `
        <button type="button" onclick="window.setAcadClass('${esc(c.id)}')" style="text-align:left; cursor:pointer; background:${isAct ? accent : '#ffffff'}; color:${isAct ? '#ffffff' : '#0f172a'}; border:1.5px solid ${isAct ? accent : '#e7e2da'}; border-radius:16px; padding:1.1rem 1.2rem; display:flex; flex-direction:column; justify-content:space-between; gap:0.5rem; box-shadow:0 6px 18px rgba(15,23,42,0.04); transition:transform 0.15s ease;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem;">
            <span style="font-weight:800; font-size:1.05rem;">${esc(c.name)}</span>
            <span style="font-size:0.68rem; font-weight:700; padding:2px 8px; border-radius:999px; background:${isAct ? 'rgba(255,255,255,0.22)' : 'rgba(15,23,42,0.06)'}; color:${isAct ? '#ffffff' : accent}; white-space:nowrap;">${esc(c.badge || c.level || 'Public')}</span>
          </div>
          <div style="font-size:0.78rem; opacity:${isAct ? '0.92' : '0.75'}; line-height:1.45;">${esc(c.description || '')}</div>
          <div style="font-size:0.74rem; font-weight:700; opacity:0.9;">${mc} MCQs • ${cc} CQs • ${nc} Notes</div>
        </button>
      `;
    }).join('');

    grid.innerHTML = allCard + cards;
  }

  function renderSubjectsAndChapters() {
    const bar = document.getElementById('acadSubjectsBar');
    const chSel = document.getElementById('acadChapterFilter');
    const subs = getFilteredSubjects();
    if (activeSubjectId !== 'all' && !subs.some((s) => s.id === activeSubjectId)) {
      activeSubjectId = 'all';
    }

    if (bar) {
      bar.innerHTML = `
        <span style="font-size:0.76rem; font-weight:700; color:#64748b; text-transform:uppercase; margin-right:0.25rem;">Subjects:</span>
        <button type="button" class="btn btn-sm ${activeSubjectId === 'all' ? 'btn-primary' : 'btn-secondary'}" onclick="window.setAcadSubject('all')">All Subjects (${subs.length})</button>
      ` + subs.map((s) => {
        const act = activeSubjectId === s.id;
        return `<button type="button" class="btn btn-sm ${act ? 'btn-primary' : 'btn-secondary'}" onclick="window.setAcadSubject('${esc(s.id)}')">${esc(s.icon || '📘')} ${esc(s.name)}</button>`;
      }).join('');
    }

    if (chSel) {
      const chSet = new Set();
      subs.forEach((s) => {
        if (activeSubjectId === 'all' || s.id === activeSubjectId) {
          (s.chapters || []).forEach((ch) => chSet.add(ch));
        }
      });
      [...catalog.mcqs, ...catalog.cqs, ...catalog.notes].forEach((item) => {
        if ((activeClassId === 'all' || item.classId === activeClassId) && (activeSubjectId === 'all' || item.subjectId === activeSubjectId)) {
          if (item.chapter) chSet.add(item.chapter);
        }
      });
      const chapters = Array.from(chSet);
      if (activeChapter !== 'all' && !chapters.includes(activeChapter)) activeChapter = 'all';
      chSel.innerHTML = `<option value="all">All Chapters (${chapters.length})</option>` +
        chapters.map((ch) => `<option value="${esc(ch)}" ${activeChapter === ch ? 'selected' : ''}>${esc(ch)}</option>`).join('');
    }
  }

  function clearExamTimer() {
    if (examTimerHandle) {
      clearInterval(examTimerHandle);
      examTimerHandle = null;
    }
  }

  function renderExamPane() {
    const pane = document.getElementById('acadPane_exam');
    if (!pane) return;

    const pool = catalog.mcqs.filter(matchesBaseFilters);

    if (!examState) {
      const scopeLabel = [
        activeClassId === 'all' ? 'All Classes' : getClassName(activeClassId),
        activeSubjectId === 'all' ? 'All Subjects' : getSubjectName(activeSubjectId),
        activeChapter === 'all' ? 'All Chapters' : activeChapter
      ].join(' › ');

      pane.innerHTML = `
        <div style="background:#ffffff; border:1px solid #e7e2da; border-radius:18px; padding:1.75rem; box-shadow:0 8px 26px rgba(15,23,42,0.04);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; margin-bottom:1.35rem;">
            <div>
              <h3 style="font-size:1.35rem; margin:0 0 0.35rem; color:#0f172a;">⚡ Automated MCQ Exam Taker</h3>
              <p style="margin:0; font-size:0.88rem; color:#475569;">Configure your timed SSC/HSC board or admission test, submit for instant automated grading, GPA calculation & step-by-step explanations. Works 100% offline.</p>
            </div>
            <div style="padding:0.45rem 0.9rem; border-radius:10px; background:rgba(234,88,12,0.08); border:1px solid rgba(234,88,12,0.22); font-size:0.82rem; font-weight:700; color:#ea580c;">
              ${pool.length} MCQs Ready in Current Filter
            </div>
          </div>

          <div style="padding:0.75rem 1rem; border-radius:10px; background:#faf8f5; border:1px solid #e7e2da; font-size:0.82rem; color:#334155; margin-bottom:1.25rem;">
            <strong>Active Exam Scope:</strong> ${esc(scopeLabel)}
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(195px, 1fr)); gap:1rem; margin-bottom:1.35rem;">
            <div class="form-group" style="margin:0;">
              <label class="form-label" style="font-size:0.8rem; font-weight:700;">Number of Questions</label>
              <select id="acadExamCount" class="form-select">
                <option value="5">5 Questions (Quick Sprint)</option>
                <option value="10" selected>10 Questions (Mini Test)</option>
                <option value="15">15 Questions (Chapter Test)</option>
                <option value="25">25 Questions (Board Full MCQ)</option>
                <option value="all">All Matching (${pool.length})</option>
              </select>
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" style="font-size:0.8rem; font-weight:700;">Time Limit</label>
              <select id="acadExamSecPerQ" class="form-select">
                <option value="60" selected>1 min / question (Board Pace)</option>
                <option value="45">45 sec / question (Fast)</option>
                <option value="30">30 sec / question (Admission Drill)</option>
                <option value="0">Untimed Practice Mode</option>
              </select>
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" style="font-size:0.8rem; font-weight:700;">Negative Marking</label>
              <select id="acadExamNegMark" class="form-select">
                <option value="0" selected>None (SSC / HSC Board)</option>
                <option value="0.25">-0.25 per wrong (Medical / DU / BUET)</option>
              </select>
            </div>
            <div class="form-group" style="margin:0; display:flex; align-items:flex-end;">
              <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.86rem; font-weight:600; cursor:pointer; padding:0.55rem 0.85rem; border-radius:10px; border:1px solid #e7e2da; background:#faf8f5; width:100%;">
                <input type="checkbox" id="acadExamShuffle" checked style="accent-color:#ea580c; width:16px; height:16px;">
                <span>Shuffle Questions</span>
              </label>
            </div>
          </div>

          <div style="display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap;">
            <button type="button" class="btn btn-primary" onclick="window.startAcadAutoExam()" ${pool.length === 0 ? 'disabled' : ''} style="padding:0.72rem 1.8rem; font-weight:700; font-size:0.95rem;">
              🚀 Start Timed Auto-Exam
            </button>
            ${pool.length === 0 ? '<span style="font-size:0.82rem; color:#ef4444; font-weight:600;">No MCQs match this filter — reset filters or pick another class/subject.</span>' : ''}
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
      const grade = pct >= 80 ? 'A+ (GPA 5.0)' : pct >= 70 ? 'A (GPA 4.0)' : pct >= 60 ? 'A- (GPA 3.5)' : pct >= 50 ? 'B (GPA 3.0)' : pct >= 40 ? 'C (GPA 2.0)' : pct >= 33 ? 'D (Pass)' : 'F (Needs Review)';
      const elapsedSec = Math.max(1, Math.round(((finishedAt || Date.now()) - startedAt) / 1000));
      const mins = Math.floor(elapsedSec / 60);
      const secs = elapsedSec % 60;

      pane.innerHTML = `
        <div style="background:#ffffff; border:1px solid #e7e2da; border-radius:18px; padding:1.75rem; margin-bottom:1.5rem; box-shadow:0 8px 26px rgba(15,23,42,0.05);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.35rem;">
            <div>
              <div style="font-size:0.76rem; font-weight:700; text-transform:uppercase; color:#ea580c; letter-spacing:0.06em;">Automated Scorecard</div>
              <h3 style="font-size:1.55rem; margin:0.2rem 0 0; color:#0f172a;">Score: ${rawScore} / ${questions.length} (${pct}%) — ${grade}</h3>
            </div>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              ${wrongIds.length > 0 ? `<button type="button" class="btn btn-primary btn-sm" onclick="window.startAcadCustomExam(${JSON.stringify(wrongIds).replace(/"/g, '&quot;')})">🔁 Retake ${wrongIds.length} Wrong Qs</button>` : ''}
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.exitAcadExam()">+ New Exam</button>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:0.75rem; margin-bottom:1.5rem;">
            <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:12px; padding:0.85rem; text-align:center;">
              <div style="font-size:1.45rem; font-weight:800; color:#059669;">${correct}</div>
              <div style="font-size:0.75rem; color:#047857; font-weight:600;">Correct</div>
            </div>
            <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:12px; padding:0.85rem; text-align:center;">
              <div style="font-size:1.45rem; font-weight:800; color:#dc2626;">${wrong}</div>
              <div style="font-size:0.75rem; color:#b91c1c; font-weight:600;">Wrong ${negMark > 0 ? `(-${(wrong * negMark).toFixed(2)})` : ''}</div>
            </div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:0.85rem; text-align:center;">
              <div style="font-size:1.45rem; font-weight:800; color:#475569;">${skipped}</div>
              <div style="font-size:0.75rem; color:#64748b; font-weight:600;">Skipped</div>
            </div>
            <div style="background:#fff7ed; border:1px solid #fed7aa; border-radius:12px; padding:0.85rem; text-align:center;">
              <div style="font-size:1.45rem; font-weight:800; color:#ea580c;">${mins}m ${secs}s</div>
              <div style="font-size:0.75rem; color:#c2410c; font-weight:600;">Time Taken</div>
            </div>
          </div>

          <h4 style="font-size:1.05rem; margin:0 0 0.85rem; color:#0f172a;">Detailed Solution & Explanation Review</h4>
          <div style="display:flex; flex-direction:column; gap:1rem;">
            ${questions.map((q, idx) => {
              const chosen = answers[idx];
              const isCorrect = chosen !== undefined && Number(chosen) === Number(q.correctIndex);
              const isSkipped = chosen === undefined || chosen === null;
              const letters = ['A', 'B', 'C', 'D'];
              return `
                <div style="border:1.5px solid ${isCorrect ? '#86efac' : isSkipped ? '#cbd5e1' : '#fca5a5'}; border-radius:14px; padding:1.1rem 1.2rem; background:${isCorrect ? '#f0fdf4' : isSkipped ? '#f8fafc' : '#fef2f2'};">
                  <div style="display:flex; justify-content:space-between; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.45rem;">
                    <span style="font-size:0.74rem; font-weight:700; color:#475569;">Q${idx + 1} • ${esc(getSubjectName(q.subjectId))} • ${esc(q.chapter || '')}</span>
                    <span style="font-size:0.74rem; font-weight:800; color:${isCorrect ? '#059669' : isSkipped ? '#64748b' : '#dc2626'};">${isCorrect ? '✓ Correct' : isSkipped ? '— Skipped' : '✕ Wrong'}</span>
                  </div>
                  <div style="font-weight:700; font-size:0.95rem; color:#0f172a; margin-bottom:0.65rem;">${esc(q.question)}</div>
                  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:0.45rem; margin-bottom:0.65rem;">
                    ${(q.options || []).map((opt, oi) => {
                      const right = oi === Number(q.correctIndex);
                      const picked = chosen !== undefined && Number(chosen) === oi;
                      let bg = '#ffffff';
                      let brd = '#e2e8f0';
                      if (right) { bg = '#dcfce7'; brd = '#16a34a'; }
                      else if (picked && !right) { bg = '#fee2e2'; brd = '#dc2626'; }
                      return `<div style="padding:0.45rem 0.7rem; border-radius:8px; border:1px solid ${brd}; background:${bg}; font-size:0.84rem; color:#0f172a;"><strong>${letters[oi] || oi + 1}.</strong> ${esc(opt)} ${right ? '✓' : picked ? '✕' : ''}</div>`;
                    }).join('')}
                  </div>
                  ${q.explanation ? `<div style="font-size:0.82rem; color:#334155; background:rgba(255,255,255,0.85); border-radius:8px; padding:0.6rem 0.8rem; border:1px solid #e2e8f0;"><strong>Explanation:</strong> ${esc(q.explanation)}</div>` : ''}
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
    const answeredCount = Object.keys(answers).length;
    const letters = ['A', 'B', 'C', 'D'];
    const timerStr = totalSec > 0
      ? `${String(Math.floor(remainingSec / 60)).padStart(2, '0')}:${String(remainingSec % 60).padStart(2, '0')}`
      : 'Untimed';

    pane.innerHTML = `
      <div style="background:#ffffff; border:1.5px solid #e7e2da; border-radius:18px; padding:1.5rem; box-shadow:0 10px 30px rgba(15,23,42,0.06);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; padding-bottom:1rem; border-bottom:1px solid #e7e2da; margin-bottom:1.15rem;">
          <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
            <span style="font-weight:800; font-size:0.95rem; color:#0f172a;">Question ${currentIndex + 1} / ${questions.length}</span>
            <span style="font-size:0.78rem; color:#475569; font-weight:600;">Answered: ${answeredCount}/${questions.length}</span>
          </div>
          <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
            <span id="acadLiveTimerBadge" style="font-family:monospace; font-weight:800; font-size:0.95rem; padding:0.32rem 0.78rem; border-radius:999px; background:${totalSec > 0 && remainingSec <= 30 ? '#fee2e2' : 'rgba(234,88,12,0.12)'}; color:${totalSec > 0 && remainingSec <= 30 ? '#dc2626' : '#ea580c'};">⏱ ${timerStr}</span>
            <button type="button" class="btn btn-primary btn-sm" onclick="window.submitAcadAutoExam()">✓ Submit Exam</button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.exitAcadExam()">Quit</button>
          </div>
        </div>

        <div style="display:flex; gap:0.35rem; flex-wrap:wrap; margin-bottom:1.2rem;">
          ${questions.map((_, i) => {
            const isCur = i === currentIndex;
            const isAns = answers[i] !== undefined;
            const isFlg = flagged[i];
            let bg = '#f1f5f9';
            let clr = '#334155';
            let brd = '#cbd5e1';
            if (isCur) { bg = '#ea580c'; clr = '#ffffff'; brd = '#ea580c'; }
            else if (isFlg) { bg = '#fef3c7'; clr = '#b45309'; brd = '#f59e0b'; }
            else if (isAns) { bg = '#dcfce7'; clr = '#15803d'; brd = '#22c55e'; }
            return `<button type="button" onclick="window.jumpAcadExamQ(${i})" style="width:32px; height:32px; border-radius:8px; border:1.5px solid ${brd}; background:${bg}; color:${clr}; font-weight:700; font-size:0.78rem; cursor:pointer;">${i + 1}</button>`;
          }).join('')}
        </div>

        <div style="margin-bottom:0.55rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.4rem;">
          <span style="font-size:0.76rem; font-weight:700; color:#ea580c;">${esc(getClassName(q.classId))} • ${esc(getSubjectName(q.subjectId))} • ${esc(q.chapter || '')}</span>
          <div style="display:flex; gap:0.4rem; align-items:center;">
            ${q.boardTag ? `<span style="font-size:0.7rem; padding:2px 8px; border-radius:999px; background:#f1f5f9; color:#475569; font-weight:700;">${esc(q.boardTag)}</span>` : ''}
            <button type="button" class="btn btn-secondary btn-sm" style="font-size:0.72rem; padding:0.2rem 0.55rem;" onclick="window.toggleFlagAcadExamQ(${currentIndex})">${flagged[currentIndex] ? '🚩 Flagged' : '⚑ Flag'}</button>
          </div>
        </div>

        <div style="font-size:1.08rem; font-weight:700; color:#0f172a; line-height:1.55; margin-bottom:1.1rem;">${esc(q.question)}</div>
        ${q.imageUrl ? `<div style="margin-bottom:1rem;"><img src="${esc(q.imageUrl)}" alt="Question figure" style="max-width:100%; max-height:240px; border-radius:10px; border:1px solid #e2e8f0;"></div>` : ''}

        <div style="display:grid; grid-template-columns:1fr; gap:0.6rem; margin-bottom:1.35rem;">
          ${(q.options || []).map((opt, oi) => {
            const sel = answers[currentIndex] === oi;
            return `
              <button type="button" onclick="window.selectAcadExamOpt(${currentIndex}, ${oi})" style="text-align:left; cursor:pointer; display:flex; align-items:center; gap:0.75rem; padding:0.82rem 1rem; border-radius:12px; border:1.5px solid ${sel ? '#ea580c' : '#e2e8f0'}; background:${sel ? 'rgba(234,88,12,0.08)' : '#ffffff'}; color:#0f172a; font-size:0.93rem; font-weight:${sel ? '700' : '500'}; transition:all 0.12s ease;">
                <span style="width:28px; height:28px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:800; font-size:0.8rem; background:${sel ? '#ea580c' : '#f1f5f9'}; color:${sel ? '#ffffff' : '#334155'}; flex-shrink:0;">${letters[oi] || oi + 1}</span>
                <span>${esc(opt)}</span>
              </button>
            `;
          }).join('')}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.jumpAcadExamQ(${Math.max(0, currentIndex - 1)})" ${currentIndex === 0 ? 'disabled' : ''}>← Previous</button>
          ${currentIndex < questions.length - 1
            ? `<button type="button" class="btn btn-primary btn-sm" onclick="window.jumpAcadExamQ(${currentIndex + 1})">Next Question →</button>`
            : `<button type="button" class="btn btn-primary btn-sm" onclick="window.submitAcadAutoExam()">✓ Finish & Grade Exam</button>`}
        </div>
      </div>
    `;
  }

  function renderMcqPracticePane() {
    const pane = document.getElementById('acadPane_mcq');
    if (!pane) return;
    const list = catalog.mcqs.filter(matchesBaseFilters);
    const bm = getBookmarks();
    const letters = ['A', 'B', 'C', 'D'];

    if (list.length === 0) {
      pane.innerHTML = '<div style="background:#ffffff; border:1px dashed #cbd5e1; border-radius:14px; padding:2.5rem; text-align:center; color:#64748b;">No MCQs found for this filter.</div>';
      return;
    }

    pane.innerHTML = `<div style="display:flex; flex-direction:column; gap:1rem;">` + list.map((q, idx) => {
      const picked = practiceAnswers[q.id];
      const revealed = picked !== undefined;
      const isBm = bm.mcqs.includes(q.id);
      return `
        <div style="background:#ffffff; border:1px solid #e7e2da; border-radius:16px; padding:1.25rem 1.35rem; box-shadow:0 4px 14px rgba(15,23,42,0.03);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.5rem;">
            <span style="font-size:0.74rem; font-weight:700; color:#ea580c;">#${idx + 1} • ${esc(getClassName(q.classId))} • ${esc(getSubjectName(q.subjectId))} • ${esc(q.chapter || '')}</span>
            <div style="display:flex; gap:0.35rem; align-items:center;">
              ${q.boardTag ? `<span style="font-size:0.7rem; padding:2px 8px; border-radius:999px; background:#f1f5f9; color:#475569; font-weight:700;">${esc(q.boardTag)}</span>` : ''}
              <span style="font-size:0.7rem; padding:2px 8px; border-radius:999px; background:rgba(234,88,12,0.1); color:#ea580c; font-weight:700;">${esc(q.difficulty || 'Medium')}</span>
              <button type="button" onclick="window.toggleAcadBookmark('mcqs', '${esc(q.id)}')" style="border:none; background:transparent; cursor:pointer; font-size:1rem; color:${isBm ? '#f59e0b' : '#94a3b8'};" title="Bookmark for offline revision">${isBm ? '★' : '☆'}</button>
            </div>
          </div>

          <div style="font-weight:700; font-size:0.98rem; color:#0f172a; line-height:1.5; margin-bottom:0.85rem;">${esc(q.question)}</div>
          ${q.imageUrl ? `<div style="margin-bottom:0.85rem;"><img src="${esc(q.imageUrl)}" alt="Diagram" style="max-width:100%; max-height:220px; border-radius:10px; border:1px solid #e2e8f0;"></div>` : ''}

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.5rem;">
            ${(q.options || []).map((opt, oi) => {
              const isRight = oi === Number(q.correctIndex);
              const isPicked = picked === oi;
              let bg = '#faf8f5';
              let brd = '#e7e2da';
              if (revealed && isRight) { bg = '#dcfce7'; brd = '#16a34a'; }
              else if (revealed && isPicked && !isRight) { bg = '#fee2e2'; brd = '#dc2626'; }
              return `
                <button type="button" onclick="window.answerPracticeMcq('${esc(q.id)}', ${oi})" style="text-align:left; cursor:pointer; padding:0.65rem 0.85rem; border-radius:10px; border:1.5px solid ${brd}; background:${bg}; color:#0f172a; font-size:0.88rem; display:flex; align-items:center; gap:0.55rem;">
                  <strong style="color:#ea580c;">${letters[oi] || oi + 1}.</strong>
                  <span>${esc(opt)}</span>
                </button>
              `;
            }).join('')}
          </div>

          ${revealed ? `
            <div style="margin-top:0.8rem; padding:0.75rem 0.95rem; border-radius:10px; background:${picked === Number(q.correctIndex) ? '#f0fdf4' : '#fef2f2'}; border:1px solid ${picked === Number(q.correctIndex) ? '#86efac' : '#fca5a5'}; font-size:0.84rem; color:#1e293b;">
              <div style="font-weight:700; color:${picked === Number(q.correctIndex) ? '#15803d' : '#b91c1c'}; margin-bottom:0.25rem;">
                ${picked === Number(q.correctIndex) ? '✓ Correct Answer!' : `✕ Incorrect — Correct Option: ${letters[q.correctIndex] || Number(q.correctIndex) + 1}`}
              </div>
              <div>${esc(q.explanation || 'Review this concept in the Notes tab.')}</div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('') + '</div>';
  }

  function renderCqPane() {
    const pane = document.getElementById('acadPane_cq');
    if (!pane) return;
    const list = catalog.cqs.filter(matchesBaseFilters);
    const bm = getBookmarks();

    if (list.length === 0) {
      pane.innerHTML = '<div style="background:#ffffff; border:1px dashed #cbd5e1; border-radius:14px; padding:2.5rem; text-align:center; color:#64748b;">No Creative Questions (CQs) match this filter yet.</div>';
      return;
    }

    pane.innerHTML = `<div style="display:flex; flex-direction:column; gap:1.2rem;">` + list.map((cq, idx) => {
      const isBm = bm.cqs.includes(cq.id);
      return `
        <article style="background:#ffffff; border:1px solid #e7e2da; border-radius:18px; padding:1.45rem 1.55rem; box-shadow:0 6px 20px rgba(15,23,42,0.04);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.75rem;">
            <div>
              <div style="font-size:0.74rem; font-weight:700; color:#ea580c; text-transform:uppercase;">CQ #${idx + 1} • ${esc(getClassName(cq.classId))} • ${esc(getSubjectName(cq.subjectId))} • ${esc(cq.chapter || '')}</div>
              <h3 style="margin:0.2rem 0 0; font-size:1.12rem; color:#0f172a;">${esc(cq.title || 'Creative Question')}</h3>
            </div>
            <div style="display:flex; gap:0.45rem; align-items:center; flex-wrap:wrap;">
              ${cq.boardTag ? `<span style="font-size:0.72rem; padding:3px 9px; border-radius:999px; background:#f1f5f9; color:#334155; font-weight:700;">${esc(cq.boardTag)}</span>` : ''}
              <button type="button" class="btn btn-secondary btn-sm" id="cqTimerBtn_${esc(cq.id)}" onclick="window.toggleCqTimer('${esc(cq.id)}')" style="font-size:0.74rem;">⏱ 20m Practice Timer</button>
              <button type="button" onclick="window.toggleAcadBookmark('cqs', '${esc(cq.id)}')" style="border:none; background:transparent; cursor:pointer; font-size:1.1rem; color:${isBm ? '#f59e0b' : '#94a3b8'};" title="Bookmark CQ">${isBm ? '★' : '☆'}</button>
            </div>
          </div>

          <div style="background:#faf8f5; border-left:4px solid #ea580c; border-radius:10px; padding:0.95rem 1.1rem; margin-bottom:1rem; font-size:0.93rem; color:#1e293b; line-height:1.6;">
            <div style="font-size:0.72rem; font-weight:800; color:#ea580c; text-transform:uppercase; margin-bottom:0.25rem;">Uddipok / Scenario Stem</div>
            <div>${esc(cq.stem)}</div>
            ${cq.imageUrl ? `<div style="margin-top:0.75rem;"><img src="${esc(cq.imageUrl)}" alt="CQ Figure" style="max-width:100%; max-height:240px; border-radius:8px; border:1px solid #e2e8f0;"></div>` : ''}
          </div>

          <div style="display:flex; flex-direction:column; gap:0.55rem; margin-bottom:1rem; font-size:0.92rem; color:#0f172a;">
            <div><strong style="color:#ea580c;">(ক) [1 Mark]:</strong> ${esc(cq.partA)}</div>
            <div><strong style="color:#ea580c;">(খ) [2 Marks]:</strong> ${esc(cq.partB)}</div>
            <div><strong style="color:#ea580c;">(গ) [3 Marks]:</strong> ${esc(cq.partC)}</div>
            <div><strong style="color:#ea580c;">(ঘ) [4 Marks]:</strong> ${esc(cq.partD)}</div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" onclick="window.toggleCqSolution('${esc(cq.id)}', this)">👁 Show Model Answer & Marking Scheme</button>

          <div id="cqSol_${esc(cq.id)}" style="display:none; margin-top:0.9rem; background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:1rem 1.15rem; font-size:0.86rem; color:#1e293b; line-height:1.65;">
            <div style="margin-bottom:0.65rem;"><strong style="color:#059669;">Answer (ক):</strong><br>${esc(cq.ansA || 'Not provided yet.').replace(/\n/g, '<br>')}</div>
            <div style="margin-bottom:0.65rem;"><strong style="color:#059669;">Answer (খ):</strong><br>${esc(cq.ansB || 'Not provided yet.').replace(/\n/g, '<br>')}</div>
            <div style="margin-bottom:0.65rem;"><strong style="color:#059669;">Answer (গ):</strong><br>${esc(cq.ansC || 'Not provided yet.').replace(/\n/g, '<br>')}</div>
            <div><strong style="color:#059669;">Answer (ঘ):</strong><br>${esc(cq.ansD || 'Not provided yet.').replace(/\n/g, '<br>')}</div>
          </div>
        </article>
      `;
    }).join('') + '</div>';
  }

  function renderNotesPane() {
    const pane = document.getElementById('acadPane_notes');
    if (!pane) return;
    const list = catalog.notes.filter(matchesBaseFilters);

    if (list.length === 0) {
      pane.innerHTML = '<div style="background:#ffffff; border:1px dashed #cbd5e1; border-radius:14px; padding:2.5rem; text-align:center; color:#64748b;">No Study Notes or Formula Sheets match this filter yet.</div>';
      return;
    }

    pane.innerHTML = `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(340px, 1fr)); gap:1.1rem;">` + list.map((n) => {
      const typeLabel = n.resourceType === 'formula' ? '📐 Formula Sheet' : n.resourceType === 'video' ? '🎬 Video Lesson' : n.resourceType === 'pdf' ? '📄 Handout / PDF' : '📚 Chapter Note';
      return `
        <article style="background:#ffffff; border:1px solid #e7e2da; border-radius:16px; padding:1.35rem; display:flex; flex-direction:column; justify-content:space-between; gap:0.85rem; box-shadow:0 5px 16px rgba(15,23,42,0.03);">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.45rem;">
              <span style="font-size:0.72rem; font-weight:700; color:#ea580c;">${esc(getClassName(n.classId))} • ${esc(getSubjectName(n.subjectId))}</span>
              <span style="font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:999px; background:rgba(234,88,12,0.1); color:#ea580c;">${typeLabel}</span>
            </div>
            <h3 style="margin:0 0 0.35rem; font-size:1.08rem; color:#0f172a;">${esc(n.title)}</h3>
            <div style="font-size:0.78rem; color:#64748b; margin-bottom:0.7rem;">${esc(n.chapter || '')}${n.summary ? ' — ' + esc(n.summary) : ''}</div>
            ${n.content ? `<div style="background:#faf8f5; border:1px solid #e7e2da; border-radius:12px; padding:0.9rem 1rem; max-height:280px; overflow-y:auto;">${formatSimpleMd(n.content)}</div>` : ''}
          </div>
          ${(n.fileUrl || n.videoUrl) ? `
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap; padding-top:0.5rem; border-top:1px solid #f1ece4;">
              ${n.fileUrl ? `<a href="${esc(n.fileUrl)}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">📄 Open / Download Handout ↗</a>` : ''}
              ${n.videoUrl ? `<a href="${esc(n.videoUrl)}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">▶ Watch Lecture ↗</a>` : ''}
            </div>
          ` : ''}
        </article>
      `;
    }).join('') + '</div>';
  }

  function renderProgressPane() {
    const pane = document.getElementById('acadPane_progress');
    if (!pane) return;
    const hist = getHistory();
    const bm = getBookmarks();
    const avgPct = hist.length ? Math.round(hist.reduce((a, b) => a + (b.pct || 0), 0) / hist.length) : 0;
    const totalSolved = hist.reduce((a, b) => a + (b.total || 0), 0);
    const bmMcqs = catalog.mcqs.filter((m) => bm.mcqs.includes(m.id));
    const bmCqs = catalog.cqs.filter((c) => bm.cqs.includes(c.id));

    pane.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(170px, 1fr)); gap:0.85rem; margin-bottom:1.4rem;">
        <div style="background:#ffffff; border:1px solid #e7e2da; border-radius:14px; padding:1.1rem; text-align:center;">
          <div style="font-size:1.6rem; font-weight:800; color:#ea580c;">${hist.length}</div>
          <div style="font-size:0.78rem; color:#64748b; font-weight:600;">Exams Completed</div>
        </div>
        <div style="background:#ffffff; border:1px solid #e7e2da; border-radius:14px; padding:1.1rem; text-align:center;">
          <div style="font-size:1.6rem; font-weight:800; color:#059669;">${avgPct}%</div>
          <div style="font-size:0.78rem; color:#64748b; font-weight:600;">Average Accuracy</div>
        </div>
        <div style="background:#ffffff; border:1px solid #e7e2da; border-radius:14px; padding:1.1rem; text-align:center;">
          <div style="font-size:1.6rem; font-weight:800; color:#0f172a;">${totalSolved}</div>
          <div style="font-size:0.78rem; color:#64748b; font-weight:600;">Total MCQs Attempted</div>
        </div>
        <div style="background:#ffffff; border:1px solid #e7e2da; border-radius:14px; padding:1.1rem; text-align:center;">
          <div style="font-size:1.6rem; font-weight:800; color:#f59e0b;">${bmMcqs.length + bmCqs.length}</div>
          <div style="font-size:0.78rem; color:#64748b; font-weight:600;">Offline Bookmarks</div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(310px, 1fr)); gap:1.2rem;">
        <div style="background:#ffffff; border:1px solid #e7e2da; border-radius:16px; padding:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.85rem;">
            <h3 style="margin:0; font-size:1.05rem; color:#0f172a;">Recent Auto-Exam Scores</h3>
            ${hist.length ? `<button type="button" class="btn btn-secondary btn-sm" style="font-size:0.72rem;" onclick="window.clearAcadHistory()">Clear</button>` : ''}
          </div>
          ${hist.length === 0
            ? '<div style="font-size:0.84rem; color:#64748b;">Complete an MCQ Auto-Exam to track your offline scores and GPA trend here.</div>'
            : `<div style="display:flex; flex-direction:column; gap:0.55rem;">` + hist.slice(0, 12).map((h) => `
                <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem; padding:0.65rem 0.8rem; border-radius:10px; background:#faf8f5; border:1px solid #e7e2da;">
                  <div>
                    <div style="font-weight:700; font-size:0.84rem; color:#0f172a;">${esc(h.scope || 'Auto-Exam')}</div>
                    <div style="font-size:0.72rem; color:#64748b;">${new Date(h.ts).toLocaleString()}</div>
                  </div>
                  <div style="text-align:right;">
                    <div style="font-weight:800; font-size:0.9rem; color:${h.pct >= 70 ? '#059669' : '#ea580c'};">${h.score}/${h.total} (${h.pct}%)</div>
                  </div>
                </div>
              `).join('') + '</div>'}
        </div>

        <div style="background:#ffffff; border:1px solid #e7e2da; border-radius:16px; padding:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.85rem;">
            <h3 style="margin:0; font-size:1.05rem; color:#0f172a;">★ Bookmarked for Revision</h3>
            ${bmMcqs.length ? `<button type="button" class="btn btn-primary btn-sm" style="font-size:0.72rem;" onclick="window.startAcadCustomExam(${JSON.stringify(bmMcqs.map(m => m.id)).replace(/"/g, '&quot;')})">Quiz Bookmarks (${bmMcqs.length})</button>` : ''}
          </div>
          ${bmMcqs.length === 0 && bmCqs.length === 0
            ? '<div style="font-size:0.84rem; color:#64748b;">Click ☆ on any MCQ or CQ card to save tricky questions for quick offline revision.</div>'
            : `<div style="display:flex; flex-direction:column; gap:0.55rem;">` +
              bmMcqs.map((m) => `<div style="padding:0.6rem 0.8rem; border-radius:10px; background:#faf8f5; border:1px solid #e7e2da; font-size:0.82rem; color:#0f172a;"><strong>[MCQ]</strong> ${esc(m.question)}</div>`).join('') +
              bmCqs.map((c) => `<div style="padding:0.6rem 0.8rem; border-radius:10px; background:#faf8f5; border:1px solid #e7e2da; font-size:0.82rem; color:#0f172a;"><strong>[CQ]</strong> ${esc(c.title || c.stem.slice(0, 90))}</div>`).join('') +
              '</div>'}
        </div>
      </div>
    `;
  }

  function renderActivePane() {
    ['exam', 'mcq', 'cq', 'notes', 'progress'].forEach((m) => {
      const el = document.getElementById('acadPane_' + m);
      if (el) el.style.display = m === activeMode ? 'block' : 'none';
    });
    const tabs = document.getElementById('acadModeTabs');
    if (tabs) {
      tabs.querySelectorAll('button').forEach((b) => {
        const act = b.dataset.amode === activeMode;
        b.classList.toggle('btn-primary', act);
        b.classList.toggle('btn-secondary', !act);
      });
    }
    if (activeMode === 'exam') renderExamPane();
    else if (activeMode === 'mcq') renderMcqPracticePane();
    else if (activeMode === 'cq') renderCqPane();
    else if (activeMode === 'notes') renderNotesPane();
    else if (activeMode === 'progress') renderProgressPane();
  }

  window.setAcadClass = function (cid) {
    activeClassId = cid;
    activeSubjectId = 'all';
    activeChapter = 'all';
    renderClassesGrid();
    renderSubjectsAndChapters();
    renderActivePane();
  };

  window.setAcadSubject = function (sid) {
    activeSubjectId = sid;
    activeChapter = 'all';
    renderSubjectsAndChapters();
    renderActivePane();
  };

  window.setAcadChapter = function (ch) {
    activeChapter = ch;
    renderActivePane();
  };

  window.setAcadSearch = function (q) {
    searchQuery = String(q || '').trim();
    renderActivePane();
  };

  window.resetAcadFilters = function () {
    activeClassId = 'all';
    activeSubjectId = 'all';
    activeChapter = 'all';
    searchQuery = '';
    const inp = document.getElementById('acadSearchInput');
    if (inp) inp.value = '';
    renderClassesGrid();
    renderSubjectsAndChapters();
    renderActivePane();
  };

  window.switchAcadMode = function (mode) {
    activeMode = mode;
    renderActivePane();
  };

  window.startAcadAutoExam = function () {
    const pool = catalog.mcqs.filter(matchesBaseFilters);
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
    if (countVal !== 'all') {
      selected = selected.slice(0, Math.min(selected.length, Number(countVal) || 10));
    }

    const scope = [
      activeClassId === 'all' ? 'All Classes' : getClassName(activeClassId),
      activeSubjectId === 'all' ? 'All Subjects' : getSubjectName(activeSubjectId)
    ].join(' • ');

    launchExamWithQuestions(selected, secPerQ, negMark, scope);
  };

  window.startAcadCustomExam = function (ids) {
    const idSet = new Set(Array.isArray(ids) ? ids : []);
    const selected = catalog.mcqs.filter((m) => idSet.has(m.id));
    if (!selected.length) return;
    activeMode = 'exam';
    launchExamWithQuestions(selected, 60, 0, 'Targeted Revision Test');
  };

  function launchExamWithQuestions(questions, secPerQ, negMark, scope) {
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
          if (examState.remainingSec <= 30) {
            badge.style.background = '#fee2e2';
            badge.style.color = '#dc2626';
          }
        }
        if (examState.remainingSec <= 0) {
          window.submitAcadAutoExam(true);
        }
      }, 1000);
    }
    renderActivePane();
  }

  window.selectAcadExamOpt = function (qIdx, optIdx) {
    if (!examState || examState.submitted) return;
    examState.answers[qIdx] = optIdx;
    renderExamPane();
  };

  window.jumpAcadExamQ = function (idx) {
    if (!examState || examState.submitted) return;
    examState.currentIndex = Math.max(0, Math.min(examState.questions.length - 1, idx));
    renderExamPane();
  };

  window.toggleFlagAcadExamQ = function (idx) {
    if (!examState || examState.submitted) return;
    examState.flagged[idx] = !examState.flagged[idx];
    renderExamPane();
  };

  window.submitAcadAutoExam = function (autoTimedOut = false) {
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
    saveJsonStorage(HISTORY_KEY, hist.slice(0, 40));

    if (autoTimedOut && window.showToast) {
      window.showToast('Time up! Your exam was automatically graded.', 'info');
    }
    renderExamPane();
  };

  window.exitAcadExam = function () {
    clearExamTimer();
    examState = null;
    renderExamPane();
  };

  window.answerPracticeMcq = function (id, optIdx) {
    practiceAnswers[id] = optIdx;
    renderMcqPracticePane();
  };

  window.toggleAcadBookmark = function (kind, id) {
    const bm = getBookmarks();
    const arr = Array.isArray(bm[kind]) ? bm[kind] : [];
    const idx = arr.indexOf(id);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(id);
    bm[kind] = arr;
    saveJsonStorage(BOOKMARKS_KEY, bm);
    renderActivePane();
  };

  window.toggleCqSolution = function (id, btnEl) {
    const box = document.getElementById('cqSol_' + id);
    if (!box) return;
    const open = box.style.display === 'none';
    box.style.display = open ? 'block' : 'none';
    if (btnEl) btnEl.textContent = open ? '🙈 Hide Model Answer' : '👁 Show Model Answer & Marking Scheme';
  };

  window.toggleCqTimer = function (id) {
    const btn = document.getElementById('cqTimerBtn_' + id);
    if (cqTimerHandles[id]) {
      clearInterval(cqTimerHandles[id]);
      delete cqTimerHandles[id];
      if (btn) btn.textContent = '⏱ 20m Practice Timer';
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
        if (window.showToast) window.showToast('20-minute CQ writing time complete! Check the model answer.', 'info');
      }
      left--;
    };
    tick();
    cqTimerHandles[id] = setInterval(tick, 1000);
  };

  window.clearAcadHistory = function () {
    saveJsonStorage(HISTORY_KEY, []);
    renderProgressPane();
  };

  window.saveAcademicsOffline = async function () {
    const btn = document.getElementById('acadSaveOfflineBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Caching...'; }
    try {
      const res = await fetch('/api/academics');
      if (res.ok) {
        const data = await res.json();
        catalog = data;
        saveJsonStorage(OFFLINE_CACHE_KEY, data);
      }
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const assetUrls = Array.from(document.querySelectorAll('link[rel="stylesheet"], script[src]'))
          .map((el) => el.href || el.src)
          .filter((u) => u && u.startsWith(window.location.origin))
          .map((u) => new URL(u).pathname);
        navigator.serviceWorker.controller.postMessage({ type: 'CACHE_OFFLINE_PACK', urls: ['/academics', ...assetUrls] });
      }
      updateOfflineBadge(true, Date.now());
      if (window.showToast) window.showToast('All SSC/HSC classes, MCQs, CQs & Notes saved for offline study!', 'success');
    } catch (e) {
      if (window.showToast) window.showToast('Using existing offline cache.', 'info');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '✓ Saved Offline'; }
    }
  };

  window.initAcademicsHub = async function () {
    const cached = loadJsonStorage(OFFLINE_CACHE_KEY, null);
    if (cached && Array.isArray(cached.classes)) {
      catalog = cached;
      updateOfflineBadge(true, cached.syncedAt);
      renderClassesGrid();
      renderSubjectsAndChapters();
      renderActivePane();
    }

    try {
      const res = await fetch('/api/academics', { cache: 'no-store' });
      if (res.ok) {
        const fresh = await res.json();
        if (fresh && Array.isArray(fresh.classes)) {
          catalog = fresh;
          saveJsonStorage(OFFLINE_CACHE_KEY, fresh);
          updateOfflineBadge(false, fresh.syncedAt);
          renderClassesGrid();
          renderSubjectsAndChapters();
          renderActivePane();
        }
      }
    } catch (e) {
      updateOfflineBadge(true);
    }
  };
})();
