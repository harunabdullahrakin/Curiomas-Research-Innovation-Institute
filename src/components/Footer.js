/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Deep Forest Green Footer Component (#071f16)
 * Strictly matches CSS layout rules in css/style.css (lines 2590-2698)
 */

export function renderFooterHtml() {
  return `
    <footer class="mockup-forest-footer">
      <div class="mockup-container">
        <!-- 1. Top Grid: Brand Column + 4 Navigation / Focus Columns -->
        <div class="footer-top-grid">
          <!-- Brand Column -->
          <div class="footer-brand-col">
            <div class="footer-brand-header">
              <img src="/assets/curiomas-no-bg.png" alt="CRII" class="footer-brand-logo">
              <span class="footer-brand-name">curiomas</span>
            </div>
            <div class="footer-brand-sub">Autonomous Research Institute</div>
            <div class="footer-brand-sub">Founded 2026</div>
            <div class="footer-brand-tagline">
              Open-source scientific inquiry across exoplanetary atmospheres, ancient biology, and machine intelligence.
            </div>
          </div>

          <!-- Column 1: Navigation -->
          <div class="footer-col">
            <h4 class="footer-col-header">NAVIGATION</h4>
            <ul class="footer-links-list">
              <li><a href="/">Home</a></li>
              <li><a href="/research">Research & Publications</a></li>
              <li><a href="/blog">Dispatches</a></li>
              <li><a href="/team">Team & Mentors</a></li>
              <li><a href="/team#apply">Admissions</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/portal">Researcher Portal</a></li>
            </ul>
          </div>

          <!-- Column 2: Research Focus -->
          <div class="footer-col">
            <h4 class="footer-col-header">RESEARCH FOCUS</h4>
            <ul class="footer-links-list">
              <li><a href="/research">Astrophysics & Space Science</a></li>
              <li><a href="/research">Ancient Evolutionary Biology</a></li>
              <li><a href="/research">AI & Computational Biophysics</a></li>
              <li><a href="/research">Open Datasets & Methods</a></li>
            </ul>
          </div>

          <!-- Column 3: Admissions & Fellowships -->
          <div class="footer-col">
            <h4 class="footer-col-header">ADMISSIONS</h4>
            <ul class="footer-links-list">
              <li><a href="/team#apply">Student Fellowships</a></li>
              <li><a href="/team">Mentorship Tracks</a></li>
              <li><a href="/contact">Research Collaborations</a></li>
              <li><a href="/contact">Peer Review Office</a></li>
            </ul>
          </div>

          <!-- Column 4: Get in Touch -->
          <div class="footer-col">
            <h4 class="footer-col-header">GET IN TOUCH</h4>
            <ul class="footer-links-list">
              <li><a href="/contact">Inquiries & Partnerships</a></li>
              <li><a href="mailto:harunabdullahrakin@gmail.com">Director's Office</a></li>
              <li><a href="mailto:curiomas.members@gmail.com">General Contact</a></li>
            </ul>
          </div>
        </div>

        <!-- 2. Huge Motto Row -->
        <div class="footer-motto-row">
          <div class="footer-huge-motto">Action.</div>
          <div class="footer-institute-note">Autonomous. Open by design. Verifiable.</div>
        </div>

        <!-- 3. Legal & Open License Disclaimer Bar -->
        <div class="footer-legal-bar">
          <div>© 2026 Curiomas Research & Innovation Institute. Autonomous open science.</div>
          <div>All scientific dispatches and code released under CC-BY 4.0 Open Science License.</div>
        </div>
      </div>
    </footer>
  `;
}
