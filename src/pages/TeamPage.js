/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Team & Research Mentors Page View & Admissions Form
 */

import { renderCurveDivider } from '../components/CurveDivider.js';

export function renderTeamPageHtml() {
  return `
    <div class="page-team-wrapper">
      <!-- Dark Page Hero -->
      <section class="mockup-page-hero">
        <div class="mockup-container">
          <div class="mockup-page-hero-body scroll-reveal">
            <h1 class="mockup-page-hero-title">
              Core Team & Research Mentors
            </h1>
            <p class="mockup-page-hero-subtitle">
              Meet the student researchers, principal investigators, and mentors shaping autonomous open science tracks across astrophysics, paleobiology, and machine learning.
            </p>
          </div>
        </div>
      </section>

      <!-- Wave from Dark Page Hero (#060b16) into Light Content (#faf8f5) -->
      ${renderCurveDivider({ bgColor: '#060b16', color: '#faf8f5' })}

      <!-- Main Team & Fellows Content -->
      <main class="mockup-page-content">
        <div class="mockup-container">
          <!-- 1. REAL CORE TEAM & PRINCIPAL INVESTIGATORS -->
          <div style="margin-bottom: 4.5rem;">
            <h2 class="mockup-h2">Principal Researchers & Directors</h2>
            <p style="font-size: 1.05rem; line-height: 1.65; color: #5c635d; margin-bottom: 2rem; max-width: 720px;">
              Meet the founding investigators, research directors, and student leaders steering the institute's initiatives and research clusters.
            </p>
            <div id="coreTeamContainer" class="cards-grid"></div>
          </div>

          <!-- 2. STUDENT RESEARCH FELLOWS & INTERNS -->
          <div>
            <h2 class="mockup-h2">Student Fellows & Active Researchers</h2>
            <p style="font-size: 1.05rem; line-height: 1.65; color: #5c635d; margin-bottom: 2rem; max-width: 720px;">
              Independent and undergraduate researchers investigating deep time genomics, transit spectroscopy, and extreme environment bioenergetics.
            </p>
            <div id="fellowsContainer" class="cards-grid"></div>
          </div>
        </div>
      </main>

      <!-- Wave from Light Content (#faf8f5) into Warm Sand Admissions (#ded3be) -->
      ${renderCurveDivider({ bgColor: '#faf8f5', color: '#ded3be' })}

      <!-- 3. FELLOWSHIP ADMISSIONS SECTION (WARM SAND FULL-WIDTH) -->
      <section id="apply" class="mockup-sand-cta-section" style="background: #ded3be; padding: 5rem 0; scroll-margin-top: 80px;">
        <div class="mockup-container">
          <div style="max-width: 760px; margin: 0 auto;">
            <h2 class="sand-cta-title" style="margin-bottom: 0.5rem; text-align: center;">Apply for Student Research Fellowship</h2>
            <svg class="wavy-title-line" viewBox="0 0 120 12" fill="none" style="margin: 0 auto 1.5rem auto; display: block;"><path d="M2 6 Q 16 0, 30 6 T 60 6 T 90 6 T 118 6"/></svg>
            <p class="sand-cta-desc" style="margin-bottom: 2.5rem; text-align: center;">
              Join an active research track. No prior publications required — we value intellectual curiosity, self-drive, and rigor.
            </p>

            <div id="applicationFormCard" style="background: #ffffff; padding: 2.5rem; border-radius: 12px; border: 1px solid #d4c8b6; box-shadow: 0 4px 18px rgba(0,0,0,0.05);">
              <form id="internApplicationForm">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="appFullName" style="font-weight: 600;">Full Legal Name *</label>
                    <input type="text" id="appFullName" class="form-input" placeholder="e.g. Maya Lin" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="appEmail" style="font-weight: 600;">Email Address *</label>
                    <input type="email" id="appEmail" class="form-input" placeholder="maya.lin@university.edu" required>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="appUniversity" style="font-weight: 600;">University / Institution *</label>
                    <input type="text" id="appUniversity" class="form-input" placeholder="e.g. Institute of Science" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="appFieldOfStudy" style="font-weight: 600;">Field of Study / Major *</label>
                    <input type="text" id="appFieldOfStudy" class="form-input" placeholder="e.g. Physics, Molecular Biology, CS" required>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="appDivision" style="font-weight: 600;">Preferred Research Division *</label>
                    <select id="appDivision" class="form-select" required>
                      <option value="">Select Research Division Track...</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="appLevel" style="font-weight: 600;">Academic Level</label>
                    <select id="appLevel" class="form-select">
                      <option value="">Select Academic Level / Cohort Profile...</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="appPortfolio" style="font-weight: 600;">GitHub Profile, ORCID, or Portfolio Link</label>
                  <input type="url" id="appPortfolio" class="form-input" placeholder="https://github.com/your-username">
                </div>

                <!-- Dynamic Custom Fields Configured in Admin Portal -->
                <div id="appCustomFieldsContainer"></div>

                <div class="form-group">
                  <label class="form-label" for="appStatement" style="font-weight: 600;">Statement of Scientific Curiosity & Research Motivation *</label>
                  <textarea id="appStatement" class="form-textarea" placeholder="Describe the scientific question or domain that obsesses you. What do you want to explore at CRII?..." required></textarea>
                </div>

                <div style="margin-top: 2rem;">
                  <button type="submit" class="mockup-btn-dark-green" style="width: 100%; padding: 0.95rem; font-size: 1rem; border: none; cursor: pointer;">
                    <span>Submit Fellowship Application</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <!-- Wave from Warm Sand (#ded3be) into Forest Green Footer (#071f16) -->
      ${renderCurveDivider({ bgColor: '#ded3be', color: '#071f16' })}
    </div>
  `;
}

export async function mountTeamPage() {
  if (typeof window.initInternsRoster === 'function') {
    window.initInternsRoster();
  }
  if (typeof window.initApplicationForm === 'function') {
    window.initApplicationForm();
  }
  if (typeof window.refreshScrollAnimations === 'function') {
    window.refreshScrollAnimations();
  }
}
