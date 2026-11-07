/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Forest Green Footer Component
 */

export function renderFooterHtml() {
  return `
    <footer class="mockup-forest-footer">
      <div class="mockup-container">
        <div class="footer-top-grid">
          <div class="footer-brand-col">
            <div class="footer-brand-header">
              <img src="/assets/curiomas-no-bg.png" alt="CRII" class="footer-brand-logo">
              <span class="footer-brand-name">curiomas</span>
            </div>
            <div class="footer-brand-sub">Autonomous Research Institute</div>
            <div class="footer-brand-sub">Founded 2026</div>
          </div>

          <div class="footer-huge-motto">
            Turning Curiosity<br>into Action.
          </div>
        </div>

        <div class="footer-links-grid">
          <div class="footer-links-col">
            <div class="footer-col-label">Navigation</div>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/research">Research & Publications</a></li>
              <li><a href="/blog">Dispatches</a></li>
              <li><a href="/team">Team & Mentors</a></li>
              <li><a href="/team#apply">Admissions</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/portal">Researcher Portal</a></li>
            </ul>
          </div>

          <div class="footer-links-col">
            <div class="footer-col-label">Research Focus</div>
            <ul>
              <li><a href="/research">Astrophysics & Space Science</a></li>
              <li><a href="/research">Ancient Evolutionary Biology</a></li>
              <li><a href="/research">AI & Computational Biophysics</a></li>
              <li><a href="/research">Open Datasets & Methods</a></li>
            </ul>
          </div>

          <div class="footer-links-col">
            <div class="footer-col-label">Get in Touch</div>
            <ul>
              <li><a href="/contact">Inquiries & Partnerships</a></li>
              <li><a href="mailto:harunabdullahrakin@gmail.com">Director's Office</a></li>
              <li><a href="mailto:curiomas.members@gmail.com">General Contact</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom-bar">
          <div>© 2026 Curiomas Research & Innovation Institute. Autonomous open science.</div>
          <div>All scientific dispatches and code released under CC-BY 4.0 Open Science License.</div>
        </div>
      </div>
    </footer>
  `;
}
