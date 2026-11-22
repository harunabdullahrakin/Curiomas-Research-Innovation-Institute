export function renderAdminAcademicsTab(renderMediaPickerField) {
  return `
      <div id="tab-academics" class="portal-tab-content" style="display:none;">
        <style>
          .as-hero-bar {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 0.9rem;
            padding: 1.15rem 1.35rem;
            border-radius: 16px;
            background: linear-gradient(135deg, #ffffff 0%, #fff7ed 100%);
            border: 1px solid rgba(234, 88, 12, 0.22);
            margin-bottom: 1.15rem;
          }
          [data-theme="dark"] .as-hero-bar {
            background: linear-gradient(135deg, var(--bg-surface) 0%, rgba(234, 88, 12, 0.1) 100%);
          }
          .as-explorer-card {
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 1.15rem 1.25rem;
            margin-bottom: 1.15rem;
            display: flex;
            flex-direction: column;
            gap: 1.05rem;
          }
          .as-section-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.65rem;
            flex-wrap: wrap;
          }
          .as-section-label {
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            font-size: 0.74rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--text-muted);
          }
          .as-step-num {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            border-radius: 6px;
            background: rgba(234, 88, 12, 0.14);
            color: #ea580c;
            font-size: 0.7rem;
            font-weight: 800;
          }
          .as-course-strip {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(245px, 1fr));
            gap: 0.75rem;
          }
          .as-course-tile {
            position: relative;
            border-radius: 14px;
            overflow: hidden;
            border: 2px solid var(--border-color);
            background: var(--bg-secondary);
            cursor: pointer;
            transition: transform 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
            display: flex;
            flex-direction: column;
          }
          .as-course-tile:hover {
            transform: translateY(-2px);
            border-color: rgba(234, 88, 12, 0.55);
          }
          .as-course-tile.active {
            border-color: #ea580c;
            box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.16);
          }
          .as-course-cover {
            height: 84px;
            position: relative;
            background: #0f172a;
            overflow: hidden;
          }
          .as-course-cover img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
          .as-course-cover::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.12) 0%, rgba(15, 23, 42, 0.72) 100%);
          }
          .as-subject-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
            gap: 0.65rem;
          }
          .as-subject-tile {
            position: relative;
            height: 92px;
            border-radius: 13px;
            overflow: hidden;
            border: 2px solid var(--border-color);
            background: #0f172a;
            cursor: pointer;
            transition: transform 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 0.65rem 0.75rem;
          }
          .as-subject-tile:hover {
            transform: translateY(-2px);
            border-color: rgba(234, 88, 12, 0.65);
          }
          .as-subject-tile.active {
            border-color: #ea580c;
            box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.22);
          }
          .as-subject-tile-bg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.65;
          }
          .as-subject-tile-scrim {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.18) 0%, rgba(15, 23, 42, 0.88) 100%);
          }
          .as-subject-tile-actions {
            position: absolute;
            top: 6px;
            right: 6px;
            z-index: 3;
            display: flex;
            gap: 4px;
          }
          .as-icon-chip {
            width: 24px;
            height: 24px;
            border-radius: 7px;
            border: 1px solid rgba(255, 255, 255, 0.28);
            background: rgba(15, 23, 42, 0.75);
            color: #ffffff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 0;
            transition: background 0.15s ease;
          }
          .as-icon-chip:hover {
            background: #ea580c;
            border-color: #ea580c;
          }
          .as-icon-chip.danger:hover {
            background: #dc2626;
            border-color: #dc2626;
          }
          .as-add-card {
            border: 2px dashed rgba(234, 88, 12, 0.42);
            border-radius: 13px;
            background: rgba(234, 88, 12, 0.04);
            color: #ea580c;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.3rem;
            font-size: 0.8rem;
            font-weight: 800;
            cursor: pointer;
            min-height: 92px;
            transition: background 0.15s ease, border-color 0.15s ease;
          }
          .as-add-card:hover {
            background: rgba(234, 88, 12, 0.1);
            border-color: #ea580c;
          }
          .as-div-strip {
            display: flex;
            flex-wrap: wrap;
            gap: 0.45rem;
            align-items: center;
          }
          .as-div-pill {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.42rem 0.78rem;
            border-radius: 999px;
            border: 1.5px solid var(--border-color);
            background: var(--bg-secondary);
            color: var(--text-primary);
            font-size: 0.8rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .as-div-pill:hover {
            border-color: rgba(234, 88, 12, 0.55);
          }
          .as-div-pill.active {
            background: #ea580c;
            border-color: #ea580c;
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25);
          }
          .as-div-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            flex-shrink: 0;
          }
          .as-workspace-shell {
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            overflow: hidden;
          }
          .as-ws-header {
            padding: 1rem 1.25rem;
            border-bottom: 1px solid var(--border-color);
            background: var(--bg-secondary);
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
          }
          .as-ws-tabs {
            display: flex;
            gap: 0.4rem;
            flex-wrap: wrap;
          }
          .as-ws-tab {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.48rem 0.9rem;
            border-radius: 10px;
            border: 1px solid transparent;
            background: transparent;
            color: var(--text-secondary);
            font-size: 0.82rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .as-ws-tab:hover {
            background: var(--bg-surface);
            color: var(--text-primary);
          }
          .as-ws-tab.active {
            background: #ea580c;
            color: #ffffff;
            box-shadow: 0 3px 10px rgba(234, 88, 12, 0.25);
          }
          .as-ws-cnt {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 20px;
            height: 19px;
            padding: 0 6px;
            border-radius: 999px;
            font-size: 0.69rem;
            font-weight: 800;
            background: rgba(15, 23, 42, 0.09);
            color: var(--text-primary);
          }
          .as-ws-tab.active .as-ws-cnt {
            background: rgba(255, 255, 255, 0.24);
            color: #ffffff;
          }
          .as-ws-body {
            padding: 1.2rem 1.25rem;
          }
          .as-filter-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.55rem;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.85rem;
          }
          .as-bulk-bar {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 0.65rem;
            padding: 0.72rem 0.95rem;
            border-radius: 12px;
            background: rgba(234, 88, 12, 0.08);
            border: 1px solid rgba(234, 88, 12, 0.35);
            margin-bottom: 0.85rem;
          }
          .as-item-card {
            display: flex;
            align-items: flex-start;
            gap: 0.8rem;
            padding: 0.95rem 1.05rem;
            border-radius: 13px;
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
          }
          .as-item-card:hover {
            border-color: rgba(234, 88, 12, 0.42);
            box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
          }
          .as-item-card.selected {
            border-color: #ea580c;
            background: rgba(234, 88, 12, 0.04);
          }
          .as-pill {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 0.7rem;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 999px;
            background: var(--bg-secondary);
            color: var(--text-secondary);
            border: 1px solid var(--border-color);
          }
          .as-pill.accent {
            background: rgba(234, 88, 12, 0.1);
            color: #ea580c;
            border-color: rgba(234, 88, 12, 0.25);
          }
          .as-pill.green {
            background: rgba(5, 150, 105, 0.1);
            color: #059669;
            border-color: rgba(5, 150, 105, 0.25);
          }
          .as-pill.red {
            background: rgba(220, 38, 38, 0.1);
            color: #dc2626;
            border-color: rgba(220, 38, 38, 0.25);
          }
          .as-opt-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
            gap: 0.4rem;
            margin-top: 0.5rem;
          }
          .as-opt-chip {
            font-size: 0.77rem;
            padding: 0.34rem 0.62rem;
            border-radius: 8px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
          }
          .as-opt-chip.correct {
            background: rgba(5, 150, 105, 0.1);
            border-color: rgba(5, 150, 105, 0.42);
            color: #047857;
            font-weight: 700;
          }
          .as-modal-backdrop {
            position: fixed;
            inset: 0;
            z-index: 9500;
            background: rgba(15, 23, 42, 0.62);
            backdrop-filter: blur(4px);
            display: none;
            align-items: center;
            justify-content: center;
            padding: 1.25rem;
          }
          .as-modal-backdrop.open {
            display: flex;
          }
          .as-modal-dialog {
            width: 100%;
            max-width: 780px;
            max-height: 90vh;
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            border-radius: 18px;
            box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28);
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          .as-modal-head {
            padding: 1rem 1.35rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
            background: var(--bg-secondary);
          }
          .as-modal-body {
            padding: 1.3rem 1.35rem;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 0.85rem;
          }
          .as-modal-foot {
            padding: 0.9rem 1.35rem;
            border-top: 1px solid var(--border-color);
            background: var(--bg-secondary);
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.5rem;
            flex-wrap: wrap;
          }
          .as-radio-opt {
            display: flex;
            align-items: center;
            gap: 0.55rem;
            padding: 0.55rem 0.65rem;
            border-radius: 11px;
            border: 1.5px solid var(--border-color);
            background: var(--bg-secondary);
            transition: border-color 0.15s ease, background 0.15s ease;
          }
          .as-radio-opt.is-correct {
            border-color: #059669;
            background: rgba(5, 150, 105, 0.08);
          }
          .as-radio-badge {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 2px solid var(--border-color);
            background: var(--bg-surface);
            color: var(--text-primary);
            font-weight: 800;
            font-size: 0.8rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            flex-shrink: 0;
            transition: all 0.15s ease;
          }
          .as-radio-opt.is-correct .as-radio-badge {
            background: #059669;
            border-color: #059669;
            color: #ffffff;
          }
          .as-chapter-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
            padding: 0.78rem 1rem;
            border-radius: 12px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
          }
        </style>

        <div class="as-hero-bar">
          <div>
            <h1 style="margin:0; font-size:1.45rem; font-weight:800; color:var(--text-primary);">Academic Studio</h1>
            <p id="acadStudioBreadcrumb" style="margin:0.25rem 0 0; font-size:0.84rem; color:var(--text-muted); font-weight:600;">Click any Course, Subject tile, or Division below to inspect and manage questions, chapters, and books.</p>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;">
            <a href="/academics" target="_blank" class="btn btn-secondary btn-sm" style="display:inline-flex; align-items:center; gap:0.35rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Live /academics
            </a>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.exportAcadAdminJson('all')" style="display:inline-flex; align-items:center; gap:0.35rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Backup JSON
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.loadAdminAcademics()" style="display:inline-flex; align-items:center; gap:0.35rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              Refresh
            </button>
          </div>
        </div>

        <div id="acadAdminStatsGrid" class="portal-stats-grid" style="margin-bottom:1.15rem;"></div>

        <div class="as-explorer-card">
          <div>
            <div class="as-section-head" style="margin-bottom:0.65rem;">
              <span class="as-section-label"><span class="as-step-num">1</span> Courses in Database (Click to Scope)</span>
              <button type="button" class="btn btn-primary btn-sm" onclick="window.openAcadCourseModal()" style="display:inline-flex; align-items:center; gap:0.35rem;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Course
              </button>
            </div>
            <div id="acadVisualCoursesRow" class="as-course-strip"></div>
          </div>

          <div style="border-top:1px solid var(--border-color); padding-top:0.95rem;">
            <div class="as-section-head" style="margin-bottom:0.65rem;">
              <span class="as-section-label"><span class="as-step-num">2</span> Subject Tiles (Click Any Subject to Focus Questions & Chapters)</span>
              <div style="display:flex; gap:0.45rem; align-items:center; flex-wrap:wrap;">
                <input type="text" id="acadAdminSubSearch" class="form-input" placeholder="Find subject..." oninput="window.renderAcadVisualExplorer()" style="width:170px; font-size:0.78rem; padding:0.3rem 0.65rem;">
                <button type="button" class="btn btn-primary btn-sm" onclick="window.openAcadSubjectModal()" style="display:inline-flex; align-items:center; gap:0.35rem;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add Subject
                </button>
              </div>
            </div>
            <div id="acadVisualSubjectsRow" class="as-subject-grid"></div>
          </div>

          <div style="border-top:1px solid var(--border-color); padding-top:0.9rem;">
            <div class="as-section-head" style="margin-bottom:0.55rem;">
              <span class="as-section-label"><span class="as-step-num">3</span> Academic Divisions (Filter or Manage Tracks)</span>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.openAcadDivisionModal()" style="display:inline-flex; align-items:center; gap:0.35rem;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Division
              </button>
            </div>
            <div id="acadVisualDivisionsRow" class="as-div-strip"></div>
          </div>

          <div style="border-top:1px solid var(--border-color); padding-top:0.9rem;">
            <div class="as-section-head" style="margin-bottom:0.55rem;">
              <span class="as-section-label"><span class="as-step-num">4</span> Topics & Custom Topics (Select a Subject Above, Then Click Any Topic to Add MCQs, CQs, Dagano Boi & Images Inside It)</span>
              <div id="acadQuickTopicAddWrap" style="display:flex; gap:0.4rem; align-items:center; flex-wrap:wrap;">
                <input type="text" id="acadQuickCustomTopicInput" class="form-input" placeholder="New custom topic (e.g. Vector, Dagano Boi Ch-1)..." style="width:265px; font-size:0.78rem; padding:0.3rem 0.65rem;" onkeydown="if(event.key==='Enter'){event.preventDefault();window.handleQuickAddCustomTopic();}">
                <button type="button" class="btn btn-primary btn-sm" onclick="window.handleQuickAddCustomTopic()" style="display:inline-flex; align-items:center; gap:0.3rem;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add Topic
                </button>
              </div>
            </div>
            <div id="acadVisualTopicsRow" class="as-div-strip"></div>
          </div>
        </div>

        <datalist id="acadChapterDatalist"></datalist>

        <div class="as-workspace-shell">
          <div class="as-ws-header">
            <div id="acadAdminSubTabs" class="as-ws-tabs">
              <button type="button" class="as-ws-tab active" data-asub="mcqs" onclick="window.switchAcadAdminTab('mcqs')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                MCQ Bank <span class="as-ws-cnt" id="acadTabCnt_mcqs">0</span>
              </button>
              <button type="button" class="as-ws-tab" data-asub="cqs" onclick="window.switchAcadAdminTab('cqs')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                CQ Bank <span class="as-ws-cnt" id="acadTabCnt_cqs">0</span>
              </button>
              <button type="button" class="as-ws-tab" data-asub="notes" onclick="window.switchAcadAdminTab('notes')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                Dagano Boi, Images & Books <span class="as-ws-cnt" id="acadTabCnt_notes">0</span>
              </button>
              <button type="button" class="as-ws-tab" data-asub="chapters" onclick="window.switchAcadAdminTab('chapters')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                Topics Manager <span class="as-ws-cnt" id="acadTabCnt_chapters">0</span>
              </button>
              <button type="button" class="as-ws-tab" data-asub="enrollments" onclick="window.switchAcadAdminTab('enrollments')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Enrollments <span class="as-ws-cnt" id="acadTabCnt_enrollments">0</span>
              </button>
            </div>
            <div id="acadActiveContextPill" class="as-pill accent">All Courses / All Subjects / All Divisions</div>
          </div>

          <div class="as-ws-body">
            <div id="acadAdminPane_mcqs">
              <div class="as-filter-row">
                <div style="display:flex; gap:0.45rem; flex-wrap:wrap; align-items:center;">
                  <button type="button" class="btn btn-primary btn-sm" onclick="window.openAcadMcqModal()" style="display:inline-flex; align-items:center; gap:0.35rem;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add MCQ
                  </button>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="window.openAcadBulkModal('mcq')" style="display:inline-flex; align-items:center; gap:0.35rem;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Bulk Import MCQs
                  </button>
                  <div style="display:inline-flex; align-items:center; gap:0.35rem; padding:0.18rem 0.35rem; border-radius:9px; background:rgba(234,88,12,0.08); border:1px solid rgba(234,88,12,0.3);">
                    <select id="acadAiMcqCountSelect" class="form-select" style="width:auto; font-size:0.76rem; padding:0.25rem 0.45rem; border:none; background:transparent; font-weight:700;">
                      <option value="5">5 MCQs</option>
                      <option value="10">10 MCQs</option>
                      <option value="15">15 MCQs</option>
                    </select>
                    <button type="button" id="acadAiGenMcqBtn" class="btn btn-sm" onclick="window.handleAiGenerateMcqs()" style="background:#ea580c; color:#ffffff; border:none; font-size:0.76rem; font-weight:700; padding:0.28rem 0.65rem; display:inline-flex; align-items:center; gap:0.3rem;">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      AI Generate
                    </button>
                  </div>
                </div>
                <div style="display:flex; gap:0.45rem; flex-wrap:wrap; align-items:center;">
                  <select id="acadFilterMcqDiff" class="form-select" onchange="window.renderAcadAdminMcqList()" style="width:auto; font-size:0.78rem; padding:0.35rem 0.6rem;">
                    <option value="all">All Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <input type="text" id="acadFilterMcqChapter" class="form-input" placeholder="Chapter filter..." oninput="window.renderAcadAdminMcqList()" style="width:150px; font-size:0.78rem; padding:0.35rem 0.65rem;">
                  <input type="text" id="acadAdminMcqSearch" class="form-input" placeholder="Search questions..." oninput="window.renderAcadAdminMcqList()" style="width:190px; font-size:0.78rem; padding:0.35rem 0.65rem;">
                  <button type="button" class="btn btn-secondary btn-sm" onclick="window.exportAcadAdminJson('mcqs')">Export</button>
                </div>
              </div>

              <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.6rem; margin-bottom:0.75rem; padding:0.48rem 0.75rem; border-radius:10px; background:var(--bg-secondary);">
                <label style="display:inline-flex; align-items:center; gap:0.45rem; font-size:0.8rem; font-weight:700; cursor:pointer;">
                  <input type="checkbox" id="acadSelectAllMcqs" onchange="window.toggleAcadSelectAll('mcq', this.checked)">
                  Select All Visible
                </label>
                <span id="acadMcqFilteredCount" class="as-pill accent">0 MCQs shown</span>
              </div>

              <div id="acadMcqBulkBar" class="as-bulk-bar" style="display:none;">
                <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                  <span id="acadMcqBulkCount" style="font-weight:800; font-size:0.82rem; color:#ea580c;">0 selected</span>
                  <select id="acadBulkMoveMcqSub" class="form-select" style="width:auto; min-width:165px; font-size:0.76rem; padding:0.3rem 0.55rem;"></select>
                  <select id="acadBulkMoveMcqDiv" class="form-select" style="width:auto; min-width:130px; font-size:0.76rem; padding:0.3rem 0.55rem;"></select>
                  <input type="text" id="acadBulkMoveMcqChap" class="form-input" placeholder="New Chapter (optional)" style="width:155px; font-size:0.76rem; padding:0.3rem 0.55rem;">
                  <button type="button" class="btn btn-secondary btn-sm" onclick="window.handleBulkMoveMcqs()">Move Selected</button>
                </div>
                <div style="display:flex; gap:0.4rem;">
                  <button type="button" class="btn btn-secondary btn-sm" onclick="window.exportAcadAdminJson('mcqs_selected')">Export Selected</button>
                  <button type="button" class="btn btn-danger btn-sm" onclick="window.handleBulkDeleteMcqs()">Delete Selected</button>
                </div>
              </div>

              <div id="acadAdminMcqList" style="display:flex; flex-direction:column; gap:0.65rem; max-height:640px; overflow-y:auto;"></div>
            </div>

            <div id="acadAdminPane_cqs" style="display:none;">
              <div class="as-filter-row">
                <div style="display:flex; gap:0.45rem; flex-wrap:wrap; align-items:center;">
                  <button type="button" class="btn btn-primary btn-sm" onclick="window.openAcadCqModal()" style="display:inline-flex; align-items:center; gap:0.35rem;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add CQ
                  </button>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="window.openAcadBulkModal('cq')" style="display:inline-flex; align-items:center; gap:0.35rem;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Bulk Import CQs
                  </button>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="window.openAcadCqModal(null, false, true)" style="border-color:rgba(234,88,12,0.45); color:#ea580c; background:rgba(234,88,12,0.08); font-weight:700; display:inline-flex; align-items:center; gap:0.35rem;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    AI Draft Full CQ
                  </button>
                </div>
                <div style="display:flex; gap:0.45rem; flex-wrap:wrap; align-items:center;">
                  <input type="text" id="acadAdminCqSearch" class="form-input" placeholder="Search CQ title, stem, board..." oninput="window.renderAcadAdminCqList()" style="width:220px; font-size:0.78rem; padding:0.35rem 0.65rem;">
                  <button type="button" class="btn btn-secondary btn-sm" onclick="window.exportAcadAdminJson('cqs')">Export</button>
                </div>
              </div>

              <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.6rem; margin-bottom:0.75rem; padding:0.48rem 0.75rem; border-radius:10px; background:var(--bg-secondary);">
                <label style="display:inline-flex; align-items:center; gap:0.45rem; font-size:0.8rem; font-weight:700; cursor:pointer;">
                  <input type="checkbox" id="acadSelectAllCqs" onchange="window.toggleAcadSelectAll('cq', this.checked)">
                  Select All Visible
                </label>
                <span id="acadCqFilteredCount" class="as-pill accent">0 CQs shown</span>
              </div>

              <div id="acadCqBulkBar" class="as-bulk-bar" style="display:none;">
                <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                  <span id="acadCqBulkCount" style="font-weight:800; font-size:0.82rem; color:#ea580c;">0 selected</span>
                  <select id="acadBulkMoveCqSub" class="form-select" style="width:auto; min-width:165px; font-size:0.76rem; padding:0.3rem 0.55rem;"></select>
                  <select id="acadBulkMoveCqDiv" class="form-select" style="width:auto; min-width:130px; font-size:0.76rem; padding:0.3rem 0.55rem;"></select>
                  <input type="text" id="acadBulkMoveCqChap" class="form-input" placeholder="New Chapter (optional)" style="width:155px; font-size:0.76rem; padding:0.3rem 0.55rem;">
                  <button type="button" class="btn btn-secondary btn-sm" onclick="window.handleBulkMoveCqs()">Move Selected</button>
                </div>
                <div style="display:flex; gap:0.4rem;">
                  <button type="button" class="btn btn-secondary btn-sm" onclick="window.exportAcadAdminJson('cqs_selected')">Export Selected</button>
                  <button type="button" class="btn btn-danger btn-sm" onclick="window.handleBulkDeleteCqs()">Delete Selected</button>
                </div>
              </div>

              <div id="acadAdminCqList" style="display:flex; flex-direction:column; gap:0.65rem;"></div>
            </div>

            <div id="acadAdminPane_notes" style="display:none;">
              <div class="as-filter-row">
                <div style="display:flex; gap:0.4rem; flex-wrap:wrap; align-items:center;">
                  <button type="button" class="btn btn-primary btn-sm" onclick="window.openAcadNoteModal(null, 'dagano_boi')" style="display:inline-flex; align-items:center; gap:0.35rem;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Dagano Boi
                  </button>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="window.openAcadNoteModal(null, 'image')" style="display:inline-flex; align-items:center; gap:0.35rem;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    Add Images / Diagrams
                  </button>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="window.openAcadNoteModal(null, 'pdf')">+ PDF / Book</button>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="window.openAcadNoteModal(null, 'formula')">+ Formula / Note</button>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="window.openAcadNoteModal(null, 'video')">+ Video</button>
                </div>
                <div style="display:flex; gap:0.45rem; flex-wrap:wrap; align-items:center;">
                  <select id="acadFilterNoteType" class="form-select" onchange="window.renderAcadAdminNoteList()" style="width:auto; font-size:0.78rem; padding:0.35rem 0.6rem;">
                    <option value="all">All Material Types</option>
                    <option value="dagano_boi">Dagano Boi (Marked Book)</option>
                    <option value="image">Images / Diagrams / Notes</option>
                    <option value="pdf">PDF / Book / Handout</option>
                    <option value="formula">Formula Sheet</option>
                    <option value="note">Concept Note</option>
                    <option value="video">Video Lecture</option>
                  </select>
                  <input type="text" id="acadAdminNoteSearch" class="form-input" placeholder="Search materials..." oninput="window.renderAcadAdminNoteList()" style="width:190px; font-size:0.78rem; padding:0.35rem 0.65rem;">
                </div>
              </div>

              <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.6rem; margin-bottom:0.75rem; padding:0.48rem 0.75rem; border-radius:10px; background:var(--bg-secondary);">
                <label style="display:inline-flex; align-items:center; gap:0.45rem; font-size:0.8rem; font-weight:700; cursor:pointer;">
                  <input type="checkbox" id="acadSelectAllNotes" onchange="window.toggleAcadSelectAll('note', this.checked)">
                  Select All Visible
                </label>
                <span id="acadNoteFilteredCount" class="as-pill accent">0 shown</span>
              </div>

              <div id="acadNoteBulkBar" class="as-bulk-bar" style="display:none;">
                <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                  <span id="acadNoteBulkCount" style="font-weight:800; font-size:0.82rem; color:#ea580c;">0 selected</span>
                  <select id="acadBulkMoveNoteSub" class="form-select" style="width:auto; min-width:160px; font-size:0.76rem; padding:0.3rem 0.55rem;"></select>
                  <select id="acadBulkMoveNoteDiv" class="form-select" style="width:auto; min-width:125px; font-size:0.76rem; padding:0.3rem 0.55rem;"></select>
                  <input type="text" id="acadBulkMoveNoteChap" class="form-input" placeholder="New Topic (optional)" style="width:155px; font-size:0.76rem; padding:0.3rem 0.55rem;">
                  <button type="button" class="btn btn-secondary btn-sm" onclick="window.handleBulkMoveNotes()">Move Selected</button>
                </div>
                <button type="button" class="btn btn-danger btn-sm" onclick="window.handleBulkDeleteNotes()">Delete Selected</button>
              </div>

              <div id="acadAdminNoteList" style="display:flex; flex-direction:column; gap:0.65rem;"></div>
            </div>

            <div id="acadAdminPane_chapters" style="display:none;">
              <div class="as-filter-row">
                <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap; flex:1;">
                  <select id="acadChapterManagerSubSelect" class="form-select" onchange="window.renderAcadChapterManager()" style="max-width:260px; font-weight:700; font-size:0.82rem;"></select>
                  <input type="text" id="acadNewChapterInput" class="form-input" placeholder="New topic or custom topic name (e.g. Ch 4: Mechanics, Dagano Boi Special)" style="flex:1; min-width:220px; font-size:0.82rem;" onkeydown="if(event.key==='Enter'){event.preventDefault();window.handleAddAcadChapter();}">
                  <button type="button" class="btn btn-primary btn-sm" onclick="window.handleAddAcadChapter()">Add Topic</button>
                </div>
              </div>
              <div id="acadChapterManagerList" style="display:flex; flex-direction:column; gap:0.55rem;"></div>
            </div>

            <div id="acadAdminPane_enrollments" style="display:none;">
              <div class="as-filter-row">
                <h3 style="margin:0; font-size:1rem;">Paid Course Enrollments & TrxID Verification</h3>
                <div style="display:flex; gap:0.45rem; flex-wrap:wrap;">
                  <select id="acadEnrollStatusFilter" class="form-select" onchange="window.renderAcadAdminEnrollments()" style="width:auto; font-size:0.8rem;">
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="declined">Declined</option>
                  </select>
                  <input type="text" id="acadEnrollSearch" class="form-input" placeholder="Search student or TrxID..." oninput="window.renderAcadAdminEnrollments()" style="width:200px; font-size:0.8rem;">
                  <button type="button" class="btn btn-secondary btn-sm" onclick="window.loadAdminAcadEnrollments()">Refresh</button>
                </div>
              </div>
              <div id="acadAdminEnrollmentsList" style="display:flex; flex-direction:column; gap:0.7rem;"></div>
            </div>
          </div>
        </div>

        <div id="acadCourseModal" class="as-modal-backdrop" onclick="if(event.target===this)window.closeAcadModal('acadCourseModal')">
          <div class="as-modal-dialog">
            <div class="as-modal-head">
              <h3 id="acadCourseFormHeading" style="margin:0; font-size:1.06rem;">Add / Edit Course</h3>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.closeAcadModal('acadCourseModal')">Close</button>
            </div>
            <form id="acadCourseForm" onsubmit="window.handleSaveAcadClass(event)" style="display:flex; flex-direction:column; overflow:hidden; flex:1;">
              <div class="as-modal-body">
                <input type="hidden" id="acadCourseIdInput">
                <div id="acadCourseLivePreview" style="border-radius:14px; overflow:hidden; border:1px solid var(--border-color); background:#0f172a; position:relative; height:128px; display:flex; align-items:flex-end; padding:0.9rem 1rem;">
                  <img id="acadCoursePrevImg" src="/assets/curiomas-no-bg.png" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.65;">
                  <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.88) 100%);"></div>
                  <div style="position:relative; z-index:2; width:100%; display:flex; justify-content:space-between; align-items:flex-end; gap:0.75rem;">
                    <div>
                      <span id="acadCoursePrevBadge" style="display:inline-block; font-size:0.68rem; font-weight:800; padding:2px 8px; border-radius:999px; background:#ea580c; color:#ffffff; margin-bottom:4px;">HSC</span>
                      <div id="acadCoursePrevTitle" style="color:#ffffff; font-size:1.1rem; font-weight:800;">Course Title Preview</div>
                    </div>
                    <span id="acadCoursePrevPrice" style="font-size:0.8rem; font-weight:800; padding:4px 10px; border-radius:999px; background:#059669; color:#ffffff;">Free</span>
                  </div>
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(165px, 1fr)); gap:0.65rem;">
                  <div>
                    <label class="form-label" style="font-size:0.73rem;">Course Title *</label>
                    <input type="text" id="acadCourseNameInput" class="form-input" oninput="window.updateAcadCoursePreview()" placeholder="e.g. HSC Academic Program" required>
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.73rem;">Short Name</label>
                    <input type="text" id="acadCourseShortInput" class="form-input" placeholder="e.g. HSC">
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.73rem;">Badge</label>
                    <input type="text" id="acadCourseBadgeInput" class="form-input" value="HSC" oninput="window.updateAcadCoursePreview()">
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.73rem;">Students Count</label>
                    <input type="number" id="acadCourseStudentsInput" class="form-input" value="0">
                  </div>
                </div>
                <div>
                  <label class="form-label" style="font-size:0.74rem;">Course Banner Image (R2 Upload or URL)</label>
                  ${renderMediaPickerField({ id: 'acadCourseImageInput', accept: 'image/*', uploadLabel: 'Upload Banner', placeholder: 'Paste banner URL or /api/images/...', extraOnInput: 'window.updateAcadCoursePreview()' })}
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(145px, 1fr)); gap:0.6rem; padding:0.85rem; border-radius:12px; background:var(--bg-secondary); border:1px solid var(--border-color);">
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Access Mode</label>
                    <select id="acadCourseAccessInput" class="form-select" onchange="window.updateAcadCoursePreview()">
                      <option value="public">Free (Public)</option>
                      <option value="paid">Paid Course</option>
                    </select>
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Price (৳)</label>
                    <input type="number" id="acadCoursePriceInput" class="form-input" value="0" min="0" oninput="window.updateAcadCoursePreview()">
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Original Price (৳)</label>
                    <input type="number" id="acadCourseOrigPriceInput" class="form-input" value="0" min="0">
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Unlock Code</label>
                    <input type="text" id="acadCourseUnlockInput" class="form-input" placeholder="e.g. CRII-HSC28">
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Helpline</label>
                    <input type="text" id="acadCoursePhoneInput" class="form-input" placeholder="017XXXXXXXX">
                  </div>
                </div>
                <textarea id="acadCourseDescInput" class="form-textarea" rows="2" placeholder="Course overview & syllabus summary..."></textarea>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.65rem;">
                  <textarea id="acadCourseFeaturesInput" class="form-textarea" rows="2" placeholder="Included features (one per line)"></textarea>
                  <textarea id="acadCoursePayInstrInput" class="form-textarea" rows="2" placeholder="bKash / Nagad / Rocket payment instructions"></textarea>
                </div>
              </div>
              <div class="as-modal-foot">
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.closeAcadModal('acadCourseModal')">Cancel</button>
                <button type="submit" class="btn btn-primary btn-sm">Save Course</button>
              </div>
            </form>
          </div>
        </div>

        <div id="acadSubjectModal" class="as-modal-backdrop" onclick="if(event.target===this)window.closeAcadModal('acadSubjectModal')">
          <div class="as-modal-dialog">
            <div class="as-modal-head">
              <h3 id="acadSubFormHeading" style="margin:0; font-size:1.06rem;">Add / Edit Subject Tile</h3>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.closeAcadModal('acadSubjectModal')">Close</button>
            </div>
            <form id="acadSubjectForm" onsubmit="window.handleSaveAcadSubject(event)" style="display:flex; flex-direction:column; overflow:hidden; flex:1;">
              <div class="as-modal-body">
                <input type="hidden" id="acadSubIdInput">
                <div style="display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
                  <div style="width:210px; height:112px; border-radius:14px; overflow:hidden; position:relative; background:#0f172a; border:1px solid var(--border-color); flex-shrink:0; display:flex; align-items:flex-end; padding:0.7rem;">
                    <img id="acadSubPrevImg" src="/assets/curiomas-no-bg.png" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.7;">
                    <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(15,23,42,0.12) 0%, rgba(15,23,42,0.88) 100%);"></div>
                    <div id="acadSubPrevTitle" style="position:relative; z-index:2; color:#ffffff; font-weight:800; font-size:0.95rem;">Subject Tile Preview</div>
                  </div>
                  <div style="flex:1; min-width:240px; display:grid; grid-template-columns:1fr 1fr; gap:0.6rem;">
                    <div>
                      <label class="form-label" style="font-size:0.72rem;">Parent Course *</label>
                      <select id="acadSubClassSelect" class="form-select" required></select>
                    </div>
                    <div>
                      <label class="form-label" style="font-size:0.72rem;">Subject Title *</label>
                      <input type="text" id="acadSubNameInput" class="form-input" oninput="window.updateAcadSubjectPreview()" placeholder="e.g. Physics 1st Paper" required>
                    </div>
                    <div>
                      <label class="form-label" style="font-size:0.72rem;">Subject Code</label>
                      <input type="text" id="acadSubCodeInput" class="form-input" placeholder="e.g. PHY-174">
                    </div>
                    <div>
                      <label class="form-label" style="font-size:0.72rem;">Badge</label>
                      <input type="text" id="acadSubBadgeInput" class="form-input" value="HSC">
                    </div>
                  </div>
                </div>
                <div>
                  <label class="form-label" style="font-size:0.74rem;">Subject Tile Background Image (R2 Upload or URL)</label>
                  ${renderMediaPickerField({ id: 'acadSubImageInput', accept: 'image/*', uploadLabel: 'Upload Background', placeholder: 'Paste image URL or /api/images/...', extraOnInput: 'window.updateAcadSubjectPreview()' })}
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:0.6rem; padding:0.85rem; border-radius:12px; background:var(--bg-secondary); border:1px solid var(--border-color);">
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Access Mode</label>
                    <select id="acadSubAccessInput" class="form-select">
                      <option value="public">Free (Public)</option>
                      <option value="paid">Paid Subject</option>
                    </select>
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Price (৳)</label>
                    <input type="number" id="acadSubPriceInput" class="form-input" value="0" min="0">
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Original Price (৳)</label>
                    <input type="number" id="acadSubOrigPriceInput" class="form-input" value="0" min="0">
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Students Count</label>
                    <input type="number" id="acadSubStudentsInput" class="form-input" value="0">
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Unlock Code</label>
                    <input type="text" id="acadSubCodeUnlockInput" class="form-input" placeholder="Optional">
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Helpline</label>
                    <input type="text" id="acadSubPhoneInput" class="form-input" placeholder="Optional">
                  </div>
                </div>
                <textarea id="acadSubDescInput" class="form-textarea" rows="2" placeholder="Subject overview..."></textarea>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.65rem;">
                  <textarea id="acadSubChaptersInput" class="form-textarea" rows="3" placeholder="Chapters (comma or newline separated)"></textarea>
                  <textarea id="acadSubFeaturesInput" class="form-textarea" rows="3" placeholder="Features (one per line)"></textarea>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.65rem;">
                  <textarea id="acadSubIncludedInput" class="form-textarea" rows="2" placeholder="Included sub-courses (optional)"></textarea>
                  <textarea id="acadSubPayInstrInput" class="form-textarea" rows="2" placeholder="Payment instructions (optional)"></textarea>
                </div>
              </div>
              <div class="as-modal-foot">
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.closeAcadModal('acadSubjectModal')">Cancel</button>
                <button type="submit" class="btn btn-primary btn-sm">Save Subject</button>
              </div>
            </form>
          </div>
        </div>

        <div id="acadDivisionModal" class="as-modal-backdrop" onclick="if(event.target===this)window.closeAcadModal('acadDivisionModal')">
          <div class="as-modal-dialog" style="max-width:560px;">
            <div class="as-modal-head">
              <h3 id="acadDivFormHeading" style="margin:0; font-size:1.06rem;">Add / Edit Academic Division</h3>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.closeAcadModal('acadDivisionModal')">Close</button>
            </div>
            <form id="acadDivisionForm" onsubmit="window.handleSaveAcadDivision(event)" style="display:flex; flex-direction:column; overflow:hidden; flex:1;">
              <div class="as-modal-body">
                <input type="hidden" id="acadDivIdInput">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.65rem;">
                  <div>
                    <label class="form-label" style="font-size:0.73rem;">Division Name *</label>
                    <input type="text" id="acadDivNameInput" class="form-input" placeholder="e.g. DU Ka Unit, BUET" required>
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.73rem;">Icon Style</label>
                    <select id="acadDivIconInput" class="form-select">
                      <option value="graduation">Graduation</option>
                      <option value="book">Books</option>
                      <option value="cpu">Engineering / BUET</option>
                      <option value="heart">Medical</option>
                      <option value="building">College</option>
                      <option value="layers">Layers / General</option>
                    </select>
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.73rem;">Accent Color</label>
                    <input type="color" id="acadDivColorInput" class="form-input" value="#ea580c" style="padding:0.2rem; height:38px;">
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.73rem;">Display Order</label>
                    <input type="number" id="acadDivOrderInput" class="form-input" value="6">
                  </div>
                </div>
                <div>
                  <label class="form-label" style="font-size:0.73rem;">Short Description</label>
                  <input type="text" id="acadDivDescInput" class="form-input" placeholder="Shown on the public division selector...">
                </div>
              </div>
              <div class="as-modal-foot">
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.closeAcadModal('acadDivisionModal')">Cancel</button>
                <button type="submit" class="btn btn-primary btn-sm">Save Division</button>
              </div>
            </form>
          </div>
        </div>

        <div id="acadMcqModal" class="as-modal-backdrop" onclick="if(event.target===this)window.closeAcadModal('acadMcqModal')">
          <div class="as-modal-dialog">
            <div class="as-modal-head">
              <h3 id="acadMcqFormHeading" style="margin:0; font-size:1.06rem;">Add New MCQ</h3>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.closeAcadModal('acadMcqModal')">Close</button>
            </div>
            <form id="acadMcqForm" onsubmit="window.handleSaveAcadMcq(event, false)" style="display:flex; flex-direction:column; overflow:hidden; flex:1;">
              <div class="as-modal-body">
                <input type="hidden" id="acadMcqIdInput">
                <input type="hidden" id="acadMcqCorrectSelect" value="0">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:0.6rem;">
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Course *</label>
                    <select id="acadMcqClassSelect" class="form-select" onchange="window.syncAcadFormSubjects('acadMcqClassSelect', 'acadMcqSubjectSelect')" required></select>
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Subject *</label>
                    <select id="acadMcqSubjectSelect" class="form-select" onchange="window.syncAcadChapterDatalist(this.value)" required></select>
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Division *</label>
                    <select id="acadMcqDivisionSelect" class="form-select" required></select>
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Chapter</label>
                    <input type="text" id="acadMcqChapterInput" list="acadChapterDatalist" class="form-input" placeholder="e.g. Ch 2: Vector">
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Board / Exam Tag</label>
                    <input type="text" id="acadMcqBoardInput" class="form-input" placeholder="e.g. BUET 2024">
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Difficulty</label>
                    <select id="acadMcqDiffInput" class="form-select">
                      <option value="Easy">Easy</option>
                      <option value="Medium" selected>Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="form-label" style="font-size:0.73rem;">Question Stem *</label>
                  <textarea id="acadMcqQuestionInput" class="form-textarea" rows="3" placeholder="Type the full MCQ question..." required></textarea>
                </div>
                <div>
                  <label class="form-label" style="font-size:0.73rem;">Optional Diagram / Figure</label>
                  ${renderMediaPickerField({ id: 'acadMcqImageInput', accept: 'image/*', uploadLabel: 'Upload Diagram', placeholder: 'Optional image URL or /api/images/...' })}
                </div>
                <div>
                  <label class="form-label" style="font-size:0.73rem;">Options (Click A / B / C / D circle to mark the Correct Answer) *</label>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.55rem;">
                    <div id="acadMcqOptWrap0" class="as-radio-opt is-correct">
                      <button type="button" class="as-radio-badge" onclick="window.setAcadMcqCorrect(0)" title="Mark Option A Correct">A</button>
                      <input type="text" id="acadMcqOpt0" class="form-input" placeholder="Option A *" required style="border:none; background:transparent; padding:0.2rem;">
                    </div>
                    <div id="acadMcqOptWrap1" class="as-radio-opt">
                      <button type="button" class="as-radio-badge" onclick="window.setAcadMcqCorrect(1)" title="Mark Option B Correct">B</button>
                      <input type="text" id="acadMcqOpt1" class="form-input" placeholder="Option B *" required style="border:none; background:transparent; padding:0.2rem;">
                    </div>
                    <div id="acadMcqOptWrap2" class="as-radio-opt">
                      <button type="button" class="as-radio-badge" onclick="window.setAcadMcqCorrect(2)" title="Mark Option C Correct">C</button>
                      <input type="text" id="acadMcqOpt2" class="form-input" placeholder="Option C *" required style="border:none; background:transparent; padding:0.2rem;">
                    </div>
                    <div id="acadMcqOptWrap3" class="as-radio-opt">
                      <button type="button" class="as-radio-badge" onclick="window.setAcadMcqCorrect(3)" title="Mark Option D Correct">D</button>
                      <input type="text" id="acadMcqOpt3" class="form-input" placeholder="Option D *" required style="border:none; background:transparent; padding:0.2rem;">
                    </div>
                  </div>
                </div>
                <div>
                  <label class="form-label" style="font-size:0.73rem;">Step-by-Step Solution / Explanation</label>
                  <textarea id="acadMcqExplanationInput" class="form-textarea" rows="2" placeholder="Shown to students after exam submission..."></textarea>
                </div>
              </div>
              <div class="as-modal-foot">
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.closeAcadModal('acadMcqModal')">Cancel</button>
                <button type="button" id="acadMcqSaveAnotherBtn" class="btn btn-secondary btn-sm" onclick="window.handleSaveAcadMcq(null, true)">Save & Add Another</button>
                <button type="submit" id="acadMcqSubmitBtn" class="btn btn-primary btn-sm">Save MCQ</button>
              </div>
            </form>
          </div>
        </div>

        <div id="acadCqModal" class="as-modal-backdrop" onclick="if(event.target===this)window.closeAcadModal('acadCqModal')">
          <div class="as-modal-dialog" style="max-width:860px;">
            <div class="as-modal-head">
              <div style="display:flex; align-items:center; gap:0.65rem; flex-wrap:wrap;">
                <h3 id="acadCqFormHeading" style="margin:0; font-size:1.06rem;">Add Creative Question (CQ)</h3>
                <button type="button" id="acadAiGenCqBtn" class="btn btn-secondary btn-sm" onclick="window.handleAiGenerateCq()" style="border-color:rgba(234,88,12,0.45); color:#ea580c; background:rgba(234,88,12,0.08); font-weight:700;">AI Draft Full CQ</button>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.closeAcadModal('acadCqModal')">Close</button>
            </div>
            <form id="acadCqForm" onsubmit="window.handleSaveAcadCq(event)" style="display:flex; flex-direction:column; overflow:hidden; flex:1;">
              <div class="as-modal-body">
                <input type="hidden" id="acadCqIdInput">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:0.6rem;">
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Course *</label>
                    <select id="acadCqClassSelect" class="form-select" onchange="window.syncAcadFormSubjects('acadCqClassSelect', 'acadCqSubjectSelect')" required></select>
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Subject *</label>
                    <select id="acadCqSubjectSelect" class="form-select" onchange="window.syncAcadChapterDatalist(this.value)" required></select>
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Division *</label>
                    <select id="acadCqDivisionSelect" class="form-select" required></select>
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Chapter</label>
                    <input type="text" id="acadCqChapterInput" list="acadChapterDatalist" class="form-input" placeholder="Chapter">
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Board / Year</label>
                    <input type="text" id="acadCqBoardInput" class="form-input" placeholder="e.g. Dhaka Board 2024">
                  </div>
                </div>
                <input type="text" id="acadCqTitleInput" class="form-input" placeholder="CQ Topic Title *" required>
                <textarea id="acadCqStemInput" class="form-textarea" rows="3" placeholder="Uddipok / Scenario Stem *" required></textarea>
                <div>
                  <label class="form-label" style="font-size:0.73rem;">Optional Diagram / Figure</label>
                  ${renderMediaPickerField({ id: 'acadCqImageInput', accept: 'image/*', uploadLabel: 'Upload Diagram', placeholder: 'Optional diagram URL or /api/images/...' })}
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem;">
                  <input type="text" id="acadCqPartA" class="form-input" placeholder="(ক) Knowledge Question [1m] *" required>
                  <input type="text" id="acadCqAnsA" class="form-input" placeholder="(ক) Model Answer">
                  <input type="text" id="acadCqPartB" class="form-input" placeholder="(খ) Comprehension Question [2m] *" required>
                  <input type="text" id="acadCqAnsB" class="form-input" placeholder="(খ) Model Answer">
                  <textarea id="acadCqPartC" class="form-textarea" rows="2" placeholder="(গ) Application Question [3m] *" required></textarea>
                  <textarea id="acadCqAnsC" class="form-textarea" rows="2" placeholder="(গ) Step-by-step Answer"></textarea>
                  <textarea id="acadCqPartD" class="form-textarea" rows="2" placeholder="(ঘ) Higher-Order Question [4m] *" required></textarea>
                  <textarea id="acadCqAnsD" class="form-textarea" rows="2" placeholder="(ঘ) Analytical Answer"></textarea>
                </div>
              </div>
              <div class="as-modal-foot">
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.closeAcadModal('acadCqModal')">Cancel</button>
                <button type="submit" id="acadCqSubmitBtn" class="btn btn-primary btn-sm">Save CQ</button>
              </div>
            </form>
          </div>
        </div>

        <div id="acadNoteModal" class="as-modal-backdrop" onclick="if(event.target===this)window.closeAcadModal('acadNoteModal')">
          <div class="as-modal-dialog" style="max-width:840px;">
            <div class="as-modal-head">
              <h3 id="acadNoteFormHeading" style="margin:0; font-size:1.06rem;">Add Dagano Boi / Images / Book / Note</h3>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.closeAcadModal('acadNoteModal')">Close</button>
            </div>
            <form id="acadNoteForm" onsubmit="window.handleSaveAcadNote(event)" style="display:flex; flex-direction:column; overflow:hidden; flex:1;">
              <div class="as-modal-body">
                <input type="hidden" id="acadNoteIdInput">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:0.6rem;">
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Course *</label>
                    <select id="acadNoteClassSelect" class="form-select" onchange="window.syncAcadFormSubjects('acadNoteClassSelect', 'acadNoteSubjectSelect')" required></select>
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Subject *</label>
                    <select id="acadNoteSubjectSelect" class="form-select" onchange="window.syncAcadChapterDatalist(this.value)" required></select>
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Division *</label>
                    <select id="acadNoteDivisionSelect" class="form-select" required></select>
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Topic / Custom Topic</label>
                    <input type="text" id="acadNoteChapterInput" list="acadChapterDatalist" class="form-input" placeholder="e.g. Ch 2: Vector">
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.72rem;">Material Type *</label>
                    <select id="acadNoteTypeSelect" class="form-select">
                      <option value="dagano_boi">Dagano Boi (Marked Book)</option>
                      <option value="image">Images / Diagrams / Notes</option>
                      <option value="pdf">PDF / Book / Handout</option>
                      <option value="formula">Formula Sheet</option>
                      <option value="note">Concept Note</option>
                      <option value="video">Video Lecture</option>
                    </select>
                  </div>
                </div>
                <input type="text" id="acadNoteTitleInput" class="form-input" placeholder="Title (e.g. Hazari Nag Ch 2 Dagano Boi, Vector Mind Map) *" required>
                <input type="text" id="acadNoteSummaryInput" class="form-input" placeholder="Short summary or edition info (e.g. 2025 Edition Marked Lines)...">

                <div style="padding:0.9rem; border-radius:12px; background:var(--bg-secondary); border:1px solid var(--border-color); display:flex; flex-direction:column; gap:0.65rem;">
                  <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                    <div>
                      <div style="font-size:0.8rem; font-weight:800; color:var(--text-primary);">Marked Book Pages / Image Gallery (Upload Multiple Images to R2)</div>
                      <div style="font-size:0.72rem; color:var(--text-muted);">Ideal for Dagano Boi pages, handwritten notes, reaction charts, and diagrams.</div>
                    </div>
                    <label id="acadNoteGalleryUploadBtn" class="btn btn-primary btn-sm" style="cursor:pointer; margin:0; display:inline-flex; align-items:center; gap:0.35rem;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span>Upload Multiple Images</span>
                      <input type="file" accept="image/*" multiple style="display:none;" onchange="window.handleAcadGalleryMultiUpload(event)">
                    </label>
                  </div>
                  <div style="display:flex; gap:0.45rem;">
                    <input type="text" id="acadNoteGalleryUrlAdd" class="form-input" placeholder="Or paste an image URL and click Add..." style="flex:1; font-size:0.78rem;">
                    <button type="button" class="btn btn-secondary btn-sm" onclick="window.handleAcadGalleryAddUrl()">Add Image URL</button>
                  </div>
                  <div id="acadNoteGalleryGrid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(112px, 1fr)); gap:0.55rem;"></div>
                </div>

                <textarea id="acadNoteContentInput" class="form-textarea" rows="4" placeholder="Optional Markdown notes, key lines, formulas, or description..."></textarea>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.7rem;">
                  <div>
                    <label class="form-label" style="font-size:0.73rem;">Optional PDF / Book File (R2 Upload or URL)</label>
                    ${renderMediaPickerField({ id: 'acadNoteFileInput', accept: 'image/*,.pdf', uploadLabel: 'Upload PDF / File', placeholder: 'Paste PDF/Image URL or /api/images/...' })}
                  </div>
                  <div>
                    <label class="form-label" style="font-size:0.73rem;">Optional Video Lecture</label>
                    ${renderMediaPickerField({ id: 'acadNoteVideoInput', accept: 'video/*', uploadLabel: 'Upload Video', placeholder: 'Paste YouTube or MP4 URL...' })}
                  </div>
                </div>
              </div>
              <div class="as-modal-foot">
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.closeAcadModal('acadNoteModal')">Cancel</button>
                <button type="submit" id="acadNoteSubmitBtn" class="btn btn-primary btn-sm">Save Material</button>
              </div>
            </form>
          </div>
        </div>

        <div id="acadBulkModal" class="as-modal-backdrop" onclick="if(event.target===this)window.closeAcadModal('acadBulkModal')">
          <div class="as-modal-dialog" style="max-width:840px;">
            <div class="as-modal-head">
              <div style="display:flex; align-items:center; gap:0.55rem; flex-wrap:wrap;">
                <h3 id="acadBulkModalHeading" style="margin:0; font-size:1.06rem;">Bulk Import Studio</h3>
                <button type="button" id="acadBulkSwitchMcq" class="btn btn-primary btn-sm" onclick="window.switchAcadBulkKind('mcq')">MCQs</button>
                <button type="button" id="acadBulkSwitchCq" class="btn btn-secondary btn-sm" onclick="window.switchAcadBulkKind('cq')">CQs (JSON)</button>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.closeAcadModal('acadBulkModal')">Close</button>
            </div>
            <div class="as-modal-body">
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(145px, 1fr)); gap:0.6rem;">
                <div>
                  <label class="form-label" style="font-size:0.72rem;">Target Course *</label>
                  <select id="acadBulkClassSelect" class="form-select" onchange="window.syncAcadFormSubjects('acadBulkClassSelect', 'acadBulkSubjectSelect')"></select>
                </div>
                <div>
                  <label class="form-label" style="font-size:0.72rem;">Target Subject *</label>
                  <select id="acadBulkSubjectSelect" class="form-select"></select>
                </div>
                <div>
                  <label class="form-label" style="font-size:0.72rem;">Target Division *</label>
                  <select id="acadBulkDivisionSelect" class="form-select"></select>
                </div>
                <div>
                  <label class="form-label" style="font-size:0.72rem;">Default Chapter</label>
                  <input type="text" id="acadBulkChapterInput" list="acadChapterDatalist" class="form-input" placeholder="e.g. Ch 2: Vector">
                </div>
                <div>
                  <label class="form-label" style="font-size:0.72rem;">Default Board Tag</label>
                  <input type="text" id="acadBulkBoardInput" class="form-input" placeholder="e.g. HSC 2024">
                </div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                <span id="acadBulkFormatHint" style="font-size:0.76rem; color:var(--text-muted);">Paste <code>Question | OptA | OptB | OptC | OptD | A/B/C/D | Explanation | Board</code> (or Tab-separated Excel rows) or JSON array.</span>
                <div style="display:flex; gap:0.4rem;">
                  <button type="button" id="acadBulkSampleLinesBtn" class="btn btn-secondary btn-sm" onclick="window.loadAcadBulkSample('mcq_lines')">Sample Lines</button>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="window.loadAcadBulkSample(window._acadBulkKind === 'cq' ? 'cq_json' : 'mcq_json')">Sample JSON</button>
                  <label class="btn btn-secondary btn-sm" style="cursor:pointer; margin:0;">
                    Upload File
                    <input type="file" accept=".json,.txt,.csv,.tsv" style="display:none;" onchange="window.handleAcadBulkFileLoad(event)">
                  </label>
                </div>
              </div>
              <textarea id="acadBulkTextarea" class="form-textarea" rows="8" oninput="window.updateAcadBulkPreview()" style="font-family:monospace; font-size:0.8rem;" placeholder="Paste MCQs or JSON here..."></textarea>
              <div id="acadBulkPreviewBox" style="padding:0.75rem 0.9rem; border-radius:12px; background:var(--bg-secondary); border:1px solid var(--border-color); font-size:0.78rem; color:var(--text-secondary);">
                Detected: 0 valid items
              </div>
            </div>
            <div class="as-modal-foot">
              <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('acadBulkTextarea').value=''; window.updateAcadBulkPreview();">Clear</button>
              <button type="button" id="acadBulkImportBtn" class="btn btn-primary btn-sm" onclick="window.handleBulkImportSubmit()">Import All to D1</button>
            </div>
          </div>
        </div>
      </div>
  `;
}
