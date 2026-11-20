import { renderCurveDivider } from '../components/CurveDivider.js';
import { renderPageHero } from '../components/PageHero.js';

export function renderAcademicsPageHtml() {
  return `
    <div class="page-academics-wrapper">
      ${renderPageHero({
        title: 'HSC Academics & Exam Hub',
        subtitle: 'Select your HSC subject, choose Academics, Books, Medical, BUET, or College Questions, and master MCQs & CQs with our offline-ready automated exam engine.',
        breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Academics', href: '/academics' }]
      })}

      ${renderCurveDivider({ bgColor: '#060b16', color: '#faf8f5' })}

      <main class="mockup-page-content" style="padding-top: 2rem; padding-bottom: 4.5rem;">
        <div class="mockup-container">

          <div class="acad-glass-panel" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.85rem; padding:1rem 1.25rem; margin-bottom:1.5rem;">
            <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
              <span style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.74rem; font-weight:800; padding:0.3rem 0.78rem; border-radius:999px; background:rgba(234,88,12,0.12); color:#ea580c;">🎓 HSC Active</span>
              <span id="acadOfflineBadge" style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.74rem; font-weight:700; padding:0.3rem 0.75rem; border-radius:999px; background:rgba(16,185,129,0.14); color:#059669;">Syncing DB...</span>
              <span id="acadStatsStrip" style="font-size:0.82rem; color:#475569; font-weight:600;"></span>
            </div>
            <div style="display:flex; gap:0.45rem; flex-wrap:wrap;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.openAcadStatsView()">📊 My Exams</button>
              <button type="button" class="btn btn-secondary btn-sm" id="acadSaveOfflineBtn" onclick="window.saveAcademicsOffline()">⬇ Download Qn DB Offline</button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.exportAcadOfflineFile()" title="Download offline JSON backup">📦 Export DB</button>
              <button type="button" class="btn btn-primary btn-sm" id="acadInstallPwaBtn" onclick="window.triggerPwaInstall()">📲 Install App</button>
            </div>
          </div>

          <div id="acadCatalogView">
            <div class="acad-glass-panel" style="padding:1.05rem 1.25rem; margin-bottom:1.4rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
              <div id="acadCatalogFilterPills" style="display:flex; gap:0.45rem; flex-wrap:wrap;">
                <button type="button" class="btn btn-sm btn-primary" data-cfilter="all" onclick="window.setAcadSubjectFilter('all')">All HSC Subjects</button>
                <button type="button" class="btn btn-sm btn-secondary" data-cfilter="science" onclick="window.setAcadSubjectFilter('science')">⚛️ Science Core</button>
                <button type="button" class="btn btn-sm btn-secondary" data-cfilter="lang_ict" onclick="window.setAcadSubjectFilter('lang_ict')">📖 Bangla, English & ICT</button>
                <button type="button" class="btn btn-sm btn-secondary" data-cfilter="free" onclick="window.setAcadSubjectFilter('free')">✓ Free Access</button>
                <button type="button" class="btn btn-sm btn-secondary" data-cfilter="paid" onclick="window.setAcadSubjectFilter('paid')">💎 Paid Courses</button>
              </div>
              <input type="text" id="acadSubjectSearchInput" class="form-input" placeholder="Search Physics, Chem, Bio, H.M., Bangla, Eng, ICT..." oninput="window.setAcadSubjectSearch(this.value)" style="min-width:240px; max-width:340px; flex:1; font-size:0.85rem; padding:0.45rem 0.85rem;">
            </div>

            <div id="acadSubjectsGrid" class="acad-course-grid"></div>
          </div>

          <div id="acadEnrollView" style="display:none;"></div>

          <div id="acadWorkspaceView" style="display:none;"></div>

          <div id="acadStatsView" style="display:none;"></div>

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
