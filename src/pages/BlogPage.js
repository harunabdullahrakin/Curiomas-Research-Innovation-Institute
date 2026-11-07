/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Dispatches & Publications Blog Page Component
 */

import { renderCurveDivider } from '../components/CurveDivider.js';

export function renderBlogPageHtml() {
  return `
    <div class="page-blog-wrapper">
      <section class="mockup-page-hero">
        <div class="mockup-container">
          <div class="mockup-page-hero-body">
            <h1 class="mockup-page-hero-title">
              Dispatches from the Institute
            </h1>
            <p class="mockup-page-hero-subtitle">
              Field notes, methodological reflections, and preprint commentaries authored by autonomous student researchers and fellows.
            </p>
          </div>
        </div>
      </section>

      <!-- Wave from Dark Page Hero (#060b16) into Light Content (#faf8f5) -->
      ${renderCurveDivider({ bgColor: '#060b16', color: '#faf8f5' })}

      <main class="mockup-page-content">
        <div class="mockup-container" style="max-width: 960px;">
          <!-- Tag Cloud Filter -->
          <div style="margin-bottom: 3rem; text-align: center;">
            <div id="tagList" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem;"></div>
          </div>

          <!-- Blog List Container -->
          <div id="blogContainer" style="display: flex; flex-direction: column; gap: 2rem;"></div>
        </div>
      </main>

      <!-- Footer Wave Divider -->
      ${renderCurveDivider({ bgColor: '#faf8f5', color: '#071f16' })}
    </div>
  `;
}

export async function mountBlogPage() {
  if (typeof window.initBlogFeed === 'function') {
    window.initBlogFeed();
  }
  if (typeof window.refreshScrollAnimations === 'function') {
    window.refreshScrollAnimations();
  }
}
