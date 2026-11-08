/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Research Publications & Datasets Page Component
 */

import { renderCurveDivider } from '../components/CurveDivider.js';
import { renderPageHero } from '../components/PageHero.js';

export function renderResearchPageHtml() {
  return `
    <div class="page-research-wrapper">
      ${renderPageHero({
        title: 'Research Publications & Datasets',
        subtitle: 'Browse peer-grade publications, synthetic spectroscopic transits, and genomic clock calibrations authored by autonomous student researchers and fellows.',
        breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Research', href: '/research' }]
      })}

      <!-- Wave from Dark Page Hero (#060b16) into Light Content (#faf8f5) -->
      ${renderCurveDivider({ bgColor: '#060b16', color: '#faf8f5' })}

      <main class="mockup-page-content">
        <div class="mockup-container">
          <!-- Catalog Toggle Buttons -->
          <div class="research-catalog-tabs">
            <button class="btn btn-primary catalog-tab active" data-tab="papers">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
              <span>Research Papers & Preprints</span>
            </button>
            <button class="btn btn-secondary catalog-tab" data-tab="datasets">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
              <span>Open Scientific Datasets</span>
            </button>
          </div>

          <!-- Filter Bar -->
          <div class="filter-bar research-filter-card">
            <div class="search-input-group">
              <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input type="text" id="researchSearch" class="search-input" placeholder="Search publications, authors, or scientific keywords...">
            </div>

            <div class="category-pills">
              <button class="category-pill active" data-category="all">All Disciplines</button>
              <button class="category-pill" data-category="Space">Space & Astrophysics</button>
              <button class="category-pill" data-category="Ancient">Ancient Biology</button>
              <button class="category-pill" data-category="AI">AI & Computational</button>
              <button class="category-pill" data-category="Astrobiology">Astrobiology</button>
            </div>
          </div>

          <!-- Papers Container -->
          <div id="papersContainer" class="cards-grid"></div>

          <!-- Datasets Container -->
          <div id="datasetsContainer" class="cards-grid" style="display: none;"></div>
        </div>
      </main>

      <!-- Citation Modal -->
      <div id="citeModal" class="modal-overlay">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 id="citeModalTitle" class="modal-title">Cite Publication</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div id="citeModalBody" class="modal-body"></div>
          <div class="modal-footer">
            <button class="btn btn-secondary modal-cancel">Close</button>
          </div>
        </div>
      </div>

      <!-- Dataset Inspection Modal -->
      <div id="datasetModal" class="modal-overlay">
        <div class="modal-dialog" style="max-width: 820px;">
          <div class="modal-header">
            <h3 id="datasetModalTitle" class="modal-title">Dataset Inspection</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div id="datasetModalBody" class="modal-body"></div>
          <div class="modal-footer">
            <button class="btn btn-secondary modal-cancel">Done</button>
          </div>
        </div>
      </div>

      <!-- Footer Wave Divider -->
      ${renderCurveDivider({ bgColor: '#faf8f5', color: '#071f16' })}
    </div>
  `;
}

export async function mountResearchPage() {
  if (typeof window.initResearchCatalog === 'function') {
    window.initResearchCatalog();
  }
  if (typeof window.refreshScrollAnimations === 'function') {
    window.refreshScrollAnimations();
  }
}
