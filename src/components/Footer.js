export function renderFooterHtml() {
  return `
    <footer class="mockup-forest-footer" style="background:#071f16; color:#ffffff;">
      <style>
        .mockup-forest-footer { background: #071f16 !important; color: #ffffff !important; }
        .mockup-forest-footer .footer-col-header,
        .mockup-forest-footer .footer-col h4,
        .mockup-forest-footer h4 {
          color: #ffffff !important;
          font-size: 0.78rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.12em !important;
          text-transform: uppercase !important;
          margin-bottom: 1.25rem !important;
        }
        .mockup-forest-footer ul { list-style: none !important; margin: 0 !important; padding: 0 !important; }
        .mockup-forest-footer li { list-style: none !important; margin: 0 !important; padding: 0 !important; }
        .mockup-forest-footer a { color: #a3c2b4 !important; text-decoration: none !important; font-size: 0.9rem; transition: color 0.2s ease, transform 0.2s ease; display: inline-block; }
        .mockup-forest-footer a:hover { color: #ffffff !important; transform: translateX(2px); }
        .mockup-forest-footer .footer-huge-motto {
          color: #ffffff !important;
          font-size: 3.25rem !important;
          font-style: italic !important;
          font-weight: 400 !important;
          letter-spacing: -0.01em !important;
          font-family: var(--font-display, 'Eyekons', 'Playfair Display', Georgia, serif) !important;
        }
      </style>
      <div class="mockup-container">
        <!-- 1. Top Grid: Brand Column + 4 Navigation / Focus Columns -->
        <div class="footer-top-grid">
          <!-- Brand Column -->
          <div class="footer-brand-col">
            <div class="footer-brand-header">
              <img src="/assets/curiomas-no-bg.png" alt="CRII" class="footer-brand-logo">
              <span class="footer-brand-name" style="color:#ffffff !important; font-size:1.35rem; font-weight:700;">curiomas</span>
            </div>
            <div class="footer-brand-sub" style="color:#a3c2b4 !important; font-size:0.88rem; margin-bottom:0.2rem;">Autonomous Research Institute</div>
            <div class="footer-brand-sub" style="color:#a3c2b4 !important; font-size:0.88rem; margin-bottom:0.5rem;">Founded 2026</div>
            <div class="footer-brand-tagline" style="color:#94b8a7 !important; font-size:0.86rem; line-height:1.5;">
              Open-source scientific inquiry across exoplanetary atmospheres, ancient biology, and machine intelligence.
            </div>
          </div>

          <!-- Column 1: Navigation -->
          <div class="footer-col">
            <h4 class="footer-col-header" style="color:#ffffff !important;">NAVIGATION</h4>
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
            <h4 class="footer-col-header" style="color:#ffffff !important;">RESEARCH FOCUS</h4>
            <ul class="footer-links-list">
              <li><a href="/research">Astrophysics & Space Science</a></li>
              <li><a href="/research">Ancient Evolutionary Biology</a></li>
              <li><a href="/research">AI & Computational Biophysics</a></li>
              <li><a href="/research">Open Datasets & Methods</a></li>
            </ul>
          </div>

          <!-- Column 3: Admissions & Fellowships -->
          <div class="footer-col">
            <h4 class="footer-col-header" style="color:#ffffff !important;">ADMISSIONS</h4>
            <ul class="footer-links-list">
              <li><a href="/team#apply">Student Fellowships</a></li>
              <li><a href="/team">Mentorship Tracks</a></li>
              <li><a href="/contact">Research Collaborations</a></li>
              <li><a href="/contact">Peer Review Office</a></li>
            </ul>
          </div>

          <!-- Column 4: Get in Touch -->
          <div class="footer-col">
            <h4 class="footer-col-header" style="color:#ffffff !important;">GET IN TOUCH</h4>
            <ul class="footer-links-list">
              <li><a href="/contact">Inquiries & Partnerships</a></li>
              <li><a href="mailto:harunabdullahrakin@gmail.com">Director's Office</a></li>
              <li><a href="mailto:curiomas.members@gmail.com">General Contact</a></li>
            </ul>
          </div>
        </div>

        <!-- 2. Institute Motto Banner -->
        <div class="footer-motto-row" style="border-top: 1px solid rgba(255, 255, 255, 0.12); padding: 3rem 0 2rem 0; display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap; gap:1.5rem;">
          <div class="footer-huge-motto" style="color:#ffffff !important;">Turning Curiosity into Action.</div>
          <div class="footer-institute-note" style="color:#a3c2b4 !important; font-size:0.92rem;">Autonomous. Open by design. Verifiable.</div>
        </div>

        <!-- 3. Legal & Open License Disclaimer Bar -->
        <div class="footer-legal-bar" style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; font-size:0.82rem; color:#719584;">
          <div>© 2026 Curiomas Research & Innovation Institute. Autonomous open science.</div>
          <div>All scientific dispatches and code released under CC-BY 4.0 Open Science License.</div>
        </div>
      </div>
    </footer>
  `;
}
