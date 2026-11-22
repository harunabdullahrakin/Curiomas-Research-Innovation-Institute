import { renderCurveDivider } from '../components/CurveDivider.js';
import { renderPageHero } from '../components/PageHero.js';

export function renderAcademicsPageHtml() {
  return `
    <div class="page-academics-wrapper">
      ${renderPageHero({
        title: 'Academics',
        subtitle: 'Structured HSC curriculum, subject question banks, timed automated exams, and creative question mastery.',
        breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Academics', href: '/academics' }]
      })}

      ${renderCurveDivider({ overlay: true, color: '#faf8f5', variant: 'layered', height: 76 })}

      <main class="mockup-page-content" style="padding-top: 2.25rem; padding-bottom: 5rem;">
        <div class="mockup-container">
          <div id="acadCoursesView"></div>
          <div id="acadEnrollView" style="display:none;"></div>
          <div id="acadSubjectsView" style="display:none;"></div>
          <div id="acadWorkspaceView" style="display:none;"></div>
          <div id="acadStatsView" style="display:none;"></div>
        </div>
      </main>

      ${renderCurveDivider({ bgColor: '#faf8f5', color: '#071f16', variant: 'crest', height: 74 })}
    </div>
  `;
}

export async function mountAcademicsPage() {
  if (typeof window.initAcademicsHub === 'function') {
    await window.initAcademicsHub();
  }
}
