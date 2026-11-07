/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Home Page View & Interactive Controller
 */

import { renderCurveDivider } from '../components/CurveDivider.js';
import { audioController } from '../services/audio.js';

export function renderHomePageHtml() {
  return `
    <div class="page-home-wrapper">
      <!-- =========================================================================
           SECTION 1: DARK COSMOS HERO & FLOATING CAPSULE NAVBAR
           ========================================================================= -->
      <section class="mockup-hero-section">
        <!-- Ambient Hero Video Layer -->
        <video id="heroVideo" class="mockup-hero-video" autoplay muted loop playsinline style="background:#060b16;"></video>
        <!-- Dynamic Background Image Layer (only activated if mediaType is 'image' or 'both') -->
        <div class="mockup-hero-bg-layer" id="heroBgImageLayer" style="display:none; opacity:0;"></div>
        <div class="mockup-hero-bg-overlay"></div>

        <!-- Floating Small Audio Play/Pause Button (Top Right Side) -->
        <button type="button" class="hero-sound-floating-btn is-playing" id="heroSoundToggle" aria-label="Toggle Sound" title="Mute Sound" style="display:none;">
          <span class="hero-sound-icon" id="heroSoundIcon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
          </span>
        </button>

        <div class="mockup-container">
          <!-- Hero Main Content -->
          <div class="mockup-hero-body scroll-reveal">
            <h1 class="mockup-hero-title">
              Bring structure<br>to your research
            </h1>

            <div class="mockup-hero-actions">
              <a href="#editorialSection" class="mockup-btn-white">
                <span>Explore Featured Articles</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
              <a href="/team#apply" class="mockup-hero-link">
                <span>Apply as Student Fellow</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>
          </div>

          <!-- Hero Bottom Ticker -->
          <div class="mockup-hero-ticker" style="justify-content: center; text-align: center;">
            <span class="ticker-center">Turning Curiosity into Action.</span>
          </div>
        </div>
      </section>

      <!-- Seamless Wave Divider from Hero (#060b16) into Editorial (#f4efe6) -->
      ${renderCurveDivider({ bgColor: '#060b16', color: '#f4efe6', connectorId: 'editorialSection' })}

      <!-- =========================================================================
           SECTION 2: FROM THE INSTITUTE (OPEN-SOURCE, VERIFIABLE)
           ========================================================================= -->
      <section class="mockup-editorial-section" id="editorialSection">
        <div class="mockup-container">
          <div class="editorial-header scroll-reveal">
            <div class="editorial-header-left">
              <h2 class="mockup-h2">From the Institute.</h2>
              <svg class="wavy-title-line" viewBox="0 0 120 12" fill="none"><path d="M2 6 Q 16 0, 30 6 T 60 6 T 90 6 T 118 6"/></svg>
            </div>
            <div class="editorial-header-right">
              <p>Rigorous, reproducible research and upcoming editorial dispatches across astrophysics, evolutionary paleogenomics and machine-learning biophysics.</p>
            </div>
          </div>

          <div id="fromTheInstituteContainer" class="scroll-reveal">
            <!-- Dynamically populated with published articles -->
          </div>
        </div>
      </section>

      <!-- =========================================================================
           SECTION 3: THE INSTITUTE INTRO
           ========================================================================= -->
      <section class="mockup-institute-section">
        <div class="mockup-container">
          <div class="institute-grid">
            <div class="institute-left scroll-reveal scroll-reveal-left">
              <div class="institute-big-acronym">CRII</div>
              <div class="institute-subname">Curiomas Research & Innovation Institute</div>
            </div>

            <div class="institute-right scroll-reveal scroll-reveal-right">
              <h2 class="institute-heading">
                A student-driven institute.<br>A shared pursuit of discovery.
              </h2>
              <p class="institute-desc">
                We are an autonomous research institute connecting deep-space exoplanetary atmospheres with ancient biology and genomic divergence. Our work brings verifiable datasets, peer-grade articles and open pipelines into a shared framework for discovery.
              </p>
              <a href="/contact" class="mockup-arrow-link">
                <span>Contact Institute</span>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- =========================================================================
           SECTION 4: OUR RESEARCH DIVISIONS
           ========================================================================= -->
      <section class="mockup-divisions-section">
        <div class="mockup-container">
          <div class="divisions-header scroll-reveal">
            <div class="divisions-header-left">
              <h2 class="mockup-h2">A wider field of inquiry.</h2>
            </div>
            <a href="/research" class="mockup-arrow-link">
              <span>Explore all research</span>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </a>
          </div>

          <div class="divisions-cards-grid scroll-reveal" id="homeDivisionsContainer">
            <!-- Rendered dynamically from CRII API / Portal -->
          </div>
        </div>
      </section>

      <!-- Repo Section Wave -->
      ${renderCurveDivider({ bgColor: '#faf8f5', color: '#f4efe6' })}

      <!-- =========================================================================
           SECTION 5: PUBLICATIONS REPOSITORY INITIALIZING
           ========================================================================= -->
      <section class="mockup-repo-section">
        <div class="mockup-container">
          <div class="repo-main-grid">
            <div class="repo-left scroll-reveal scroll-reveal-left">
              <h3 class="repo-heading">Publications Repository Initializing</h3>
              <p class="repo-desc">
                Peer-reviewed articles, preprints and open datasets are currently being prepared by the institute research fellows. The repository will open to the public as soon as initial peer-review cycles complete.
              </p>
              <a href="/portal" class="mockup-btn-outline">
                <span>RESEARCH PORTAL ACCESS</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>

            <div class="repo-right scroll-reveal scroll-reveal-right">
              <a href="/research" class="repo-row scroll-reveal">
                <div class="repo-row-content">
                  <div class="repo-row-title">Articles & preprints</div>
                  <div class="repo-row-sub">All our research papers, openly accessible.</div>
                </div>
                <div class="repo-row-action">
                  <span>View articles</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                </div>
              </a>

              <a href="/research" class="repo-row scroll-reveal">
                <div class="repo-row-content">
                  <div class="repo-row-title">Methods & open pipelines</div>
                  <div class="repo-row-sub">Reproducible code and step-by-step methods.</div>
                </div>
                <div class="repo-row-action">
                  <span>View methods</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                </div>
              </a>

              <a href="/research" class="repo-row scroll-reveal">
                <div class="repo-row-content">
                  <div class="repo-row-title">Research datasets</div>
                  <div class="repo-row-sub">Raw and processed data, published for anyone.</div>
                </div>
                <div class="repo-row-action">
                  <span>View datasets</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                </div>
              </a>
            </div>
          </div>

          <div class="repo-footer-bar">
            <span>Curated under Creative Commons Open Research (CC-BY 4.0)</span>
            <span>Protected by Cloudflare Pages & Workers D1 SQL Backend</span>
          </div>
        </div>
      </section>

      <!-- Emerald Section Wave -->
      ${renderCurveDivider({ bgColor: '#f4efe6', color: '#09231a' })}

      <!-- =========================================================================
           SECTION 6: BUILT FOR RIGOROUS, VERIFIABLE SCIENCE (DEEP GREEN)
           ========================================================================= -->
      <section class="mockup-emerald-section">
        <div class="mockup-container">
          <div class="emerald-header scroll-reveal">
            <div class="emerald-header-left">
              <h2 class="emerald-title">Built for Rigorous, Verifiable Science</h2>
            </div>
            <div class="emerald-header-right">
              <p>Our commitments span open access preprints and curated datasets, alongside transparent student fellowship cohorts that power continuous verification.</p>
            </div>
          </div>

          <div class="emerald-columns-grid">
            <div class="emerald-col scroll-reveal">
              <div class="emerald-col-num">01</div>
              <h3 class="emerald-col-title">Preprints & Open Access</h3>
              <p class="emerald-col-desc">Crucially open access: all preprints are published in open repository under Creative Commons licenses. Authors retain full copyright, always.</p>
              <a href="/research" class="emerald-col-link">
                <span>Learn about our preprint policy</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>

            <div class="emerald-col scroll-reveal" style="transition-delay: 0.12s;">
              <div class="emerald-col-num">02</div>
              <h3 class="emerald-col-title">Curated Datasets</h3>
              <p class="emerald-col-desc">Public open data, structured and machine-readable. We publish alongside each paper all raw and processed datasets under standard protocols.</p>
              <a href="/research" class="emerald-col-link">
                <span>Explore our datasets</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>

            <div class="emerald-col scroll-reveal" style="transition-delay: 0.24s;">
              <div class="emerald-col-num">03</div>
              <h3 class="emerald-col-title">Student Fellowship Cohorts</h3>
              <p class="emerald-col-desc">Organised research cohorts. Participants receive mentoring, collaborate across disciplines and contribute to published outputs under mentorship.</p>
              <a href="/team#apply" class="emerald-col-link">
                <span>Fellowship programme details</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Mentors Section Wave -->
      ${renderCurveDivider({ bgColor: '#09231a', color: '#faf8f5' })}

      <!-- =========================================================================
           SECTION 7: CORE TEAM & RESEARCH MENTORS
           ========================================================================= -->
      <section class="mockup-mentors-section">
        <div class="mockup-container">
          <div class="mentors-grid">
            <div class="mentors-left scroll-reveal scroll-reveal-left">
              <div class="mentors-image-wrap">
                <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80" alt="Mentorship notebook and keys" loading="lazy">
              </div>
              <div class="mentors-caption">Fellowship cohorts are guided by peer mentors.</div>
            </div>

            <div class="mentors-right scroll-reveal scroll-reveal-right">
              <h2 class="mockup-h2">Core Team & Research Mentors</h2>
              <p class="mentors-desc">
                Founded by a hands-on core team of student researchers and mentors who pursue discovery together. We bring researchers from astronomy to evolutionary biology into an open, collaborative, and peer-to-peer learning environment.
              </p>
              <div class="mentors-meta-pill">
                STUDENT MENTORS • PEER-TO-PEER RESEARCH • OPEN COMMUNITY
              </div>
              <a href="/team" class="mockup-arrow-link">
                <span>Meet the team</span>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Mentors to Sand CTA Wave -->
      ${renderCurveDivider({ bgColor: '#faf8f5', color: '#ded3be' })}

      <!-- =========================================================================
           SECTION 8: READY TO ADVANCE FRONTIER SCIENCE? (WARM SAND)
           ========================================================================= -->
      <section class="mockup-sand-cta-section">
        <div class="mockup-container">
          <div class="sand-cta-grid scroll-reveal scroll-reveal-scale">
            <div class="sand-cta-left">
              <h2 class="sand-cta-title">Ready to Advance Frontier Science?</h2>
            </div>

            <div class="sand-cta-right">
              <p class="sand-cta-desc">
                Find a supportive cohort, explore our open publications, or join the next fellowship intake. Applications for the upcoming research intake are now being reviewed on a rolling basis.
              </p>
              <div class="sand-cta-actions">
                <a href="/team#apply" class="mockup-btn-dark-green">
                  <span>Submit Fellowship Application</span>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                </a>
                <a href="/contact" class="mockup-arrow-link dark-link">
                  <span>Contact admissions desk</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Cohort Section Wave -->
      ${renderCurveDivider({ bgColor: '#ded3be', color: '#faf8f5' })}

      <!-- =========================================================================
           SECTION 9: WHO CAN JOIN US? (COHORT PROFILES)
           ========================================================================= -->
      <section class="mockup-cohort-section">
        <div class="mockup-container">
          <div class="cohort-header scroll-reveal">
            <div class="cohort-header-left">
              <h2 class="mockup-h2">Who can join us?</h2>
            </div>
            <div class="cohort-header-right">
              <p>CRII was built by and for students, regardless of formal institutional affiliation. We welcome curious, committed individuals across disciplines who want to contribute to frontier open science.</p>
            </div>
          </div>

          <div class="cohort-cards-grid scroll-reveal" id="cohortCardsContainer">
            <!-- Dynamically rendered from CRII API / Portal -->
          </div>

          <div class="cohort-bottom-banner scroll-reveal">
            <div class="cohort-note-text">
              Applicant Note: All CRII Fellowship positions are remote, open to applicants worldwide, and conducted under open-science principles.
            </div>
            <a href="/team#apply" class="mockup-btn-dark-green">
              <span>Apply for Research Cohort</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </a>
          </div>
        </div>
      </section>

      <!-- Cohort to Midnight Section Wave -->
      ${renderCurveDivider({ bgColor: '#faf8f5', color: '#07101d' })}

      <!-- =========================================================================
           SECTION 10: HAVE A QUESTION? (DEEP MIDNIGHT NAVY)
           ========================================================================= -->
      <section class="mockup-midnight-section">
        <div class="mockup-container">
          <h2 class="midnight-title scroll-reveal">Have a question? Do not hesitate to reach out.</h2>

          <div class="midnight-columns-grid">
            <div class="midnight-col scroll-reveal">
              <div class="midnight-col-num">01</div>
              <h3 class="midnight-col-title">Research & Publications</h3>
              <p class="midnight-col-desc">For discussions on paper submissions, preprints, methods data and open-source science collaborations.</p>
              <a href="/contact" class="midnight-col-link">
                <span>Research Enquiries</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>

            <div class="midnight-col scroll-reveal" style="transition-delay: 0.12s;">
              <div class="midnight-col-num">02</div>
              <h3 class="midnight-col-title">Fellowship Enquiries</h3>
              <p class="midnight-col-desc">For questions about the application cycle, eligibility, remote cohort participation, or mentorship.</p>
              <a href="/contact" class="midnight-col-link">
                <span>Admissions Enquiries</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>

            <div class="midnight-col scroll-reveal" style="transition-delay: 0.24s;">
              <div class="midnight-col-num">03</div>
              <h3 class="midnight-col-title">Institutional Collaboration</h3>
              <p class="midnight-col-desc">Interested in partnering with CRII on datasets, shared research or educational open-source pipelines?</p>
              <a href="/contact" class="midnight-col-link">
                <span>Contact the Director</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>
          </div>

          <div class="midnight-bottom-bar">
            <span>For all other inquiries, please use the contact form.</span>
            <a href="/contact" class="mockup-btn-white">
              <span>Open contact form</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </a>
          </div>
        </div>
      </section>

      <!-- Midnight to Footer Wave -->
      ${renderCurveDivider({ bgColor: '#07101d', color: '#071f16' })}
    </div>
  `;
}

export async function mountHomePage() {
  // 1. Initialize Hero Background, Video & Audio Engine
  if (typeof window.initHeroCustomization === 'function') {
    await window.initHeroCustomization();
  }

  // 2. Load "From the Institute" articles
  if (typeof window.initFeaturedArticles === 'function') {
    window.initFeaturedArticles();
  }

  // 3. Load Divisions
  if (typeof window.initDivisions === 'function') {
    window.initDivisions();
  }

  // 4. Load Cohorts
  if (typeof window.initCohorts === 'function') {
    window.initCohorts();
  }

  // 5. Trigger scroll animation observer
  if (typeof window.refreshScrollAnimations === 'function') {
    window.refreshScrollAnimations();
  }
}
