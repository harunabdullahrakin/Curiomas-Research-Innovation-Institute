import { renderCurveDivider } from '../components/CurveDivider.js';
import { renderPageHero } from '../components/PageHero.js';

export function renderAcademicsPageHtml() {
  return `
    <div class="page-academics-wrapper">
      ${renderPageHero({
        title: 'CRII Academics — SSC, HSC & STEM Hub',
        subtitle: 'Interactive MCQ Auto-Exam Taker, Board Creative Questions (CQ), Formula Sheets & Chapter Notes for SSC, HSC, and Olympiad scholars — open to everyone and works offline.',
        breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Academics', href: '/academics' }]
      })}

      ${renderCurveDivider({ bgColor: '#060b16', color: '#faf8f5' })}

      <main class="mockup-page-content" style="padding-top: 2rem; padding-bottom: 4.5rem;">
        <div class="mockup-container">

          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.85rem; background:#ffffff; border:1px solid #e7e2da; border-radius:16px; padding:1rem 1.25rem; margin-bottom:1.5rem; box-shadow:0 4px 18px rgba(15,23,42,0.04);">
            <div style="display:flex; align-items:center; gap:0.65rem; flex-wrap:wrap;">
              <span style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.74rem; font-weight:700; padding:0.28rem 0.7rem; border-radius:999px; background:rgba(16,185,129,0.12); color:#059669;">✓ Public Open Access</span>
              <span id="acadOfflineBadge" style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.74rem; font-weight:700; padding:0.28rem 0.7rem; border-radius:999px; background:rgba(234,88,12,0.1); color:#ea580c;">Syncing resources...</span>
              <span id="acadStatsStrip" style="font-size:0.82rem; color:#475569; font-weight:600;"></span>
            </div>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button type="button" class="btn btn-secondary btn-sm" id="acadSaveOfflineBtn" onclick="window.saveAcademicsOffline()">⬇ Save All Offline</button>
              <button type="button" class="btn btn-primary btn-sm" id="acadInstallPwaBtn" onclick="window.triggerPwaInstall()">📲 Install App</button>
            </div>
          </div>

          <section style="margin-bottom:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.8rem;">
              <h2 class="mockup-h2" style="font-size:1.45rem; margin:0; color:#0f172a;">Select Your Class / Track</h2>
              <span style="font-size:0.8rem; color:#64748b;">Choose SSC, HSC, Foundation, or Admission to filter subjects & exams</span>
            </div>
            <div id="acadClassesGrid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:0.9rem;"></div>
          </section>

          <section style="background:#ffffff; border:1px solid #e7e2da; border-radius:16px; padding:1.1rem 1.25rem; margin-bottom:1.5rem; box-shadow:0 4px 16px rgba(15,23,42,0.03);">
            <div style="display:flex; flex-direction:column; gap:0.85rem;">
              <div id="acadSubjectsBar" style="display:flex; gap:0.45rem; flex-wrap:wrap; align-items:center;"></div>
              <div style="display:flex; gap:0.65rem; flex-wrap:wrap; align-items:center;">
                <select id="acadChapterFilter" class="form-select" onchange="window.setAcadChapter(this.value)" style="max-width:290px; font-size:0.86rem; background:#faf8f5;">
                  <option value="all">All Chapters</option>
                </select>
                <input type="text" id="acadSearchInput" class="form-input" placeholder="Search questions, CQs, topics, board years, or formulas..." oninput="window.setAcadSearch(this.value)" style="flex:1; min-width:220px; font-size:0.86rem; background:#faf8f5;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.resetAcadFilters()">Reset</button>
              </div>
            </div>
          </section>

          <div id="acadModeTabs" style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.5rem;">
            <button type="button" class="btn btn-primary" data-amode="exam" onclick="window.switchAcadMode('exam')">⚡ MCQ Auto-Exam Taker</button>
            <button type="button" class="btn btn-secondary" data-amode="mcq" onclick="window.switchAcadMode('mcq')">🧠 MCQ Practice Bank</button>
            <button type="button" class="btn btn-secondary" data-amode="cq" onclick="window.switchAcadMode('cq')">📝 CQ Bank (সৃজনশীল)</button>
            <button type="button" class="btn btn-secondary" data-amode="notes" onclick="window.switchAcadMode('notes')">📚 Notes & Formula Sheets</button>
            <button type="button" class="btn btn-secondary" data-amode="progress" onclick="window.switchAcadMode('progress')">📊 My Stats & Bookmarks</button>
          </div>

          <div id="acadPane_exam"></div>
          <div id="acadPane_mcq" style="display:none;"></div>
          <div id="acadPane_cq" style="display:none;"></div>
          <div id="acadPane_notes" style="display:none;"></div>
          <div id="acadPane_progress" style="display:none;"></div>

        </div>
      </main>
    </div>
  `;
}

export async function mountAcademicsPage() {
  if (typeof window.initAcademicsHub === 'function') {
    await window.initAcademicsHub();
  }
}
