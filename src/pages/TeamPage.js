/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Team & Research Mentors Page View & Admissions Form
 */

import { renderCurveDivider } from '../components/CurveDivider.js';
import { renderPageHero } from '../components/PageHero.js';

export function renderTeamPageHtml() {
  return `
    <div class="page-team-wrapper">
      <!-- Dark Page Hero -->
      ${renderPageHero({
        title: 'Core Team & Research Mentors',
        subtitle: 'Meet the student researchers, principal investigators, and mentors shaping autonomous open science tracks across astrophysics, paleobiology, and machine learning.',
        breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Team', href: '/team' }]
      })}

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
      <section id="apply" class="mockup-sand-cta-section" style="background: #ded3be; padding: 5.5rem 0; scroll-margin-top: 80px; position: relative;">
        <div class="mockup-container">
          <div style="max-width: 760px; margin: 0 auto;">
            <h2 class="sand-cta-title" style="margin-bottom: 0.5rem; text-align: center;">Apply for Student Research Fellowship</h2>
            <svg class="wavy-title-line" viewBox="0 0 120 12" fill="none" style="margin: 0 auto 1.5rem auto; display: block;"><path d="M2 6 Q 16 0, 30 6 T 60 6 T 90 6 T 118 6"/></svg>
            <p id="fellowshipSectionSubtitle" class="sand-cta-desc" style="margin-bottom: 2.5rem; text-align: center;">
              Join an active research track. No prior publications required — we value intellectual curiosity, self-drive, and rigor.
            </p>

            <!-- State A: Applications Closed Card (shown when admin toggled off) -->
            <div id="fellowshipClosedCard" style="display: none; background: #ffffff; padding: 3rem 2.5rem; border-radius: 16px; border: 1px solid #d4c8b6; box-shadow: 0 4px 20px rgba(0,0,0,0.06); text-align: center;">
              <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(234, 88, 12, 0.1); border: 1px solid rgba(234, 88, 12, 0.3); color: #ea580c; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div style="display: inline-block; padding: 0.25rem 0.85rem; border-radius: 9999px; background: rgba(234, 88, 12, 0.1); color: #ea580c; font-weight: 700; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">
                Submissions Paused
              </div>
              <h3 style="font-size: 1.6rem; font-weight: 800; color: #1a221b; margin-bottom: 0.75rem; font-family: var(--font-display);">Fellowship Applications Currently Closed</h3>
              <p id="fellowshipClosedMessageText" style="color: #5c635d; max-width: 540px; margin: 0 auto 2rem; font-size: 0.98rem; line-height: 1.65;">
                Applications for the current fellowship cohort are currently closed. The Institute Research Council is currently reviewing candidate dossiers. Please check back for announcements regarding the next cohort.
              </p>
              <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                <a href="/research" class="mockup-btn-dark-green" style="padding: 0.85rem 1.6rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;">
                  <span>Explore Published Research</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
                <a href="/" class="btn btn-secondary" style="padding: 0.85rem 1.6rem; text-decoration: none;">Return Home</a>
              </div>
            </div>

            <!-- State B: Applications Open Container -->
            <div id="fellowshipOpenContainer">
              <!-- Step 0: Curiosity Invitation Card -->
              <div id="fellowshipInviteCard" style="background: #ffffff; padding: 3rem 2.5rem; border-radius: 16px; border: 1px solid #d4c8b6; box-shadow: 0 4px 24px rgba(0,0,0,0.06); text-align: center;">
                <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.9rem; border-radius: 9999px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); color: #059669; font-size: 0.8rem; font-weight: 700; margin-bottom: 1.25rem;">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; animation: pulse 1.5s infinite;"></span>
                  <span>Cohort Applications Active</span>
                </div>
                <h3 style="font-size: 1.85rem; font-weight: 800; color: #1a221b; margin-bottom: 1rem; font-family: var(--font-display);">Join the Open Science Frontier</h3>
                <p style="color: #5c635d; max-width: 580px; margin: 0 auto 2rem; font-size: 1.02rem; line-height: 1.65;">
                  Collaborate directly with institute principal investigators on computational astrophysics, deep-time paleobiology, and autonomous AI systems. Authorship credited on every published model.
                </p>

                <!-- Curiosity feature badges -->
                <div style="display: flex; justify-content: center; gap: 0.85rem; flex-wrap: wrap; margin-bottom: 2.25rem;">
                  <div style="background: #faf8f5; border: 1px solid #e6ded3; border-radius: 10px; padding: 0.75rem 1.15rem; font-size: 0.88rem; font-weight: 600; color: #2e382f; display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: #ea580c;">⚡</span>
                    <span>No Prior Publications Required</span>
                  </div>
                  <div style="background: #faf8f5; border: 1px solid #e6ded3; border-radius: 10px; padding: 0.75rem 1.15rem; font-size: 0.88rem; font-weight: 600; color: #2e382f; display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: #ea580c;">🪐</span>
                    <span>Active D1 Computational Tracks</span>
                  </div>
                  <div style="background: #faf8f5; border: 1px solid #e6ded3; border-radius: 10px; padding: 0.75rem 1.15rem; font-size: 0.88rem; font-weight: 600; color: #2e382f; display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: #ea580c;">🔬</span>
                    <span>1-on-1 Research Mentorship</span>
                  </div>
                </div>

                <button type="button" id="startFellowshipBtn" class="mockup-btn-dark-green" onclick="window.startCuriousApplication()" style="font-size: 1.05rem; padding: 1rem 2.25rem; border: none; cursor: pointer; box-shadow: 0 6px 20px rgba(26, 34, 27, 0.18);">
                  <span>Apply as Fellow →</span>
                </button>
              </div>

              <!-- Step 1: Curiosity Gateway (Name & Email) -->
              <div id="fellowshipGatewayCard" style="display: none; background: #ffffff; padding: 2.75rem 2.5rem; border-radius: 16px; border: 1px solid #d4c8b6; box-shadow: 0 4px 24px rgba(0,0,0,0.06); animation: fadeIn 0.3s ease;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
                  <span style="font-size: 0.78rem; font-weight: 700; color: #ea580c; text-transform: uppercase; letter-spacing: 0.05em;">Step 1 of 2: Candidate Identification</span>
                  <span style="font-size: 0.82rem; color: #78716c; font-family: monospace;">CRII // Admissions Protocol</span>
                </div>
                <h3 style="font-size: 1.7rem; font-weight: 800; color: #1a221b; margin-bottom: 0.5rem; font-family: var(--font-display);">Who is entering the institute?</h3>
                <p style="color: #5c635d; font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem;">
                  Introduce yourself to the Institute Research Council. We'll personalize your application dossier and match you with active research clusters.
                </p>

                <div class="form-row" style="margin-bottom: 1.5rem;">
                  <div class="form-group" style="flex: 1;">
                    <label class="form-label" for="curiousNameInput" style="font-weight: 700; color: #1a221b;">Full Name *</label>
                    <input type="text" id="curiousNameInput" class="form-input" placeholder="e.g. Maya Lin" style="background: #faf8f5; border: 1.5px solid #d4c8b6; font-size: 1rem; padding: 0.85rem;" required>
                  </div>
                  <div class="form-group" style="flex: 1;">
                    <label class="form-label" for="curiousEmailInput" style="font-weight: 700; color: #1a221b;">Email Address *</label>
                    <input type="email" id="curiousEmailInput" class="form-input" placeholder="e.g. maya@university.edu" style="background: #faf8f5; border: 1.5px solid #d4c8b6; font-size: 1rem; padding: 0.85rem;" required>
                  </div>
                </div>

                <!-- Curiosity Inspiration Box -->
                <div style="background: linear-gradient(135deg, rgba(234,88,12,0.06) 0%, rgba(249,115,22,0.02) 100%); border-left: 3px solid #ea580c; padding: 1rem 1.25rem; border-radius: 0 10px 10px 0; margin-bottom: 2rem;">
                  <div style="font-size: 0.82rem; font-weight: 700; color: #ea580c; text-transform: uppercase; margin-bottom: 0.25rem;">Institute Premise</div>
                  <div style="font-size: 0.92rem; color: #44403c; font-style: italic; line-height: 1.5;">
                    "Scientific curiosity is the refusal to accept that the universe has run out of questions. At CRII, students lead real discoveries."
                  </div>
                </div>

                <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
                  <button type="button" class="btn btn-secondary" onclick="window.backToFellowshipInvite()" style="padding: 0.85rem 1.25rem;">Back</button>
                  <button type="button" class="mockup-btn-dark-green" onclick="window.proceedFromCuriousGateway()" style="padding: 0.85rem 1.75rem; border: none; cursor: pointer;">
                    <span>Continue to Research Track →</span>
                  </button>
                </div>
              </div>

              <!-- Step 2: Curiosity High-Tech Loader -->
              <div id="fellowshipCuriosityLoader" style="display: none; background: #ffffff; padding: 4rem 2.5rem; border-radius: 16px; border: 1px solid #d4c8b6; box-shadow: 0 4px 24px rgba(0,0,0,0.06); text-align: center; animation: fadeIn 0.3s ease;">
                <div style="position: relative; width: 72px; height: 72px; margin: 0 auto 2rem;">
                  <div style="position: absolute; inset: 0; border: 3px solid rgba(234,88,12,0.15); border-top-color: #ea580c; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                  <div style="position: absolute; inset: 8px; border: 3px dashed rgba(16,185,129,0.3); border-bottom-color: #10b981; border-radius: 50%; animation: spin 2s linear infinite reverse;"></div>
                  <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #ea580c;">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/></svg>
                  </div>
                </div>
                <div style="font-size: 0.82rem; font-weight: 700; color: #ea580c; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem;">CRII Neural Pipeline</div>
                <h3 id="curiosityLoaderTitle" style="font-size: 1.45rem; font-weight: 800; color: #1a221b; margin-bottom: 0.5rem; font-family: var(--font-display);">Connecting Candidate to Research Core...</h3>
                <p id="curiosityLoaderSubtitle" style="font-size: 0.92rem; color: #5c635d; max-width: 480px; margin: 0 auto; line-height: 1.6;">
                  Scanning active research divisions & preparing personalized fellowship dossier...
                </p>
              </div>

              <!-- Step 3: Full Dossier Form (pre-filled with verified name & email) -->
              <div id="applicationFormCard" style="display: none; background: #ffffff; padding: 2.75rem 2.5rem; border-radius: 16px; border: 1px solid #d4c8b6; box-shadow: 0 4px 24px rgba(0,0,0,0.06); animation: fadeIn 0.3s ease;">
                <!-- Verified Candidate Header Banner -->
                <div style="background: #faf8f5; border: 1px solid #e6ded3; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(16,185,129,0.15); color: #059669; display: flex; align-items: center; justify-content: center; font-weight: 700;">
                      ✓
                    </div>
                    <div>
                      <div style="font-weight: 700; color: #1a221b; font-size: 0.95rem;">
                        <span id="dossierNameBadge">Fellow Applicant</span>
                        <span style="font-size: 0.75rem; background: rgba(16,185,129,0.15); color: #059669; padding: 0.15rem 0.45rem; border-radius: 9999px; margin-left: 0.35rem; font-weight: 600;">Verified ID</span>
                      </div>
                      <div id="dossierEmailBadge" style="font-size: 0.82rem; color: #78716c; font-family: monospace;">applicant@university.edu</div>
                    </div>
                  </div>
                  <button type="button" class="btn btn-xs btn-secondary" onclick="window.backToCuriousGateway()" style="font-size: 0.78rem;">Edit Identity</button>
                </div>

                <form id="internApplicationForm">
                  <!-- Inputs receiving the verified name & email -->
                  <input type="hidden" id="appFullName">
                  <input type="hidden" id="appEmail">

                  <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                      <label class="form-label" for="appUniversity" style="font-weight: 600;">University / Institution *</label>
                      <input type="text" id="appUniversity" class="form-input" placeholder="e.g. Oxford University / MIT / High School" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                      <label class="form-label" for="appFieldOfStudy" style="font-weight: 600;">Field of Study / Major *</label>
                      <input type="text" id="appFieldOfStudy" class="form-input" placeholder="e.g. Physics, Molecular Biology, CS" required>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                      <label class="form-label" for="appDivision" style="font-weight: 600;">Preferred Research Division Track *</label>
                      <select id="appDivision" class="form-select" required>
                        <option value="">Select Research Division Track...</option>
                      </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                      <label class="form-label" for="appLevel" style="font-weight: 600;">Academic Level / Cohort Profile</label>
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
                    <textarea id="appStatement" class="form-textarea" rows="4" placeholder="Describe the scientific question, theoretical paradox, or computational domain that obsesses you. What do you want to explore at CRII?..." required></textarea>
                  </div>

                  <div style="margin-top: 2rem;">
                    <button type="submit" class="mockup-btn-dark-green" style="width: 100%; padding: 1rem; font-size: 1.05rem; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(26, 34, 27, 0.2);">
                      <span>Submit Fellowship Application →</span>
                    </button>
                  </div>
                </form>
              </div>
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
