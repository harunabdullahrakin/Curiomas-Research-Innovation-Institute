/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Contact Page Component
 */

import { renderCurveDivider } from '../components/CurveDivider.js';
import { renderPageHero } from '../components/PageHero.js';

export function renderContactPageHtml() {
  return `
    <div class="page-contact-wrapper">
      ${renderPageHero({
        title: 'Contact the Institute',
        subtitle: 'Have questions about our open research papers, collaborative research tracks, or student admissions? Reach out to our leadership and fellow cohorts.',
        breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact' }]
      })}

      <!-- Wave from Dark Page Hero (#060b16) into Light Content (#faf8f5) -->
      ${renderCurveDivider({ bgColor: '#060b16', color: '#faf8f5' })}

      <main class="mockup-page-content">
        <div class="mockup-container" style="max-width: 1080px;">
          <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 3.5rem; align-items: flex-start;">
            <!-- Contact Form Card -->
            <div style="background: #ffffff; padding: 2.75rem; border-radius: 14px; border: 1px solid #e5dfd5; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
              <h2 class="mockup-h2" style="font-size: 2rem; margin-bottom: 0.5rem;">Direct Institute Dispatch</h2>
              <p style="font-size: 0.94rem; color: #5f6862; margin-bottom: 2rem; line-height: 1.6;">
                Our student coordinators and research mentors typically respond within 24 to 48 hours.
              </p>

              <form id="contactForm">
                <div class="form-group">
                  <label class="form-label" for="contactName" style="font-weight: 600;">Your Full Name *</label>
                  <input type="text" id="contactName" class="form-input" placeholder="e.g. Dr. Alex Mercer" required>
                </div>

                <div class="form-group">
                  <label class="form-label" for="contactEmail" style="font-weight: 600;">Email Address *</label>
                  <input type="email" id="contactEmail" class="form-input" placeholder="alex.mercer@institution.edu" required>
                </div>

                <div class="form-group">
                  <label class="form-label" for="contactAffiliation" style="font-weight: 600;">Institutional Affiliation / Organization</label>
                  <input type="text" id="contactAffiliation" class="form-input" placeholder="University, Research Lab, or Independent Scholar">
                </div>

                <div class="form-group">
                  <label class="form-label" for="contactSubject" style="font-weight: 600;">Inquiry Category *</label>
                  <select id="contactSubject" class="form-select" required>
                    <option value="Research Collaboration">Academic & Research Collaboration</option>
                    <option value="Internship Question">Student Fellowship & Internship Inquiries</option>
                    <option value="Dataset Request">Dataset Verification & Licensing</option>
                    <option value="General Question">General Institute Question</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" for="contactMessage" style="font-weight: 600;">Message *</label>
                  <textarea id="contactMessage" class="form-textarea" placeholder="Describe your inquiry, project proposal, or feedback in detail..." required style="min-height: 130px;"></textarea>
                </div>

                <button type="submit" class="mockup-btn-dark-green" style="width: 100%; padding: 0.95rem; font-size: 1rem; border: none; cursor: pointer; margin-top: 1rem;">
                  <span>Send Inquiry</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </button>
              </form>
            </div>

            <!-- Direct Channels & Context -->
            <div style="display: flex; flex-direction: column; gap: 2rem;">
              <div style="background: #ffffff; padding: 2.25rem; border-radius: 14px; border: 1px solid #e5dfd5; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
                <h3 style="font-size: 1.35rem; font-weight: 600; color: #16281e; margin-bottom: 1.5rem;">Direct Channels</h3>

                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                  <div style="display: flex; gap: 1rem; align-items: flex-start;">
                    <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(37, 99, 235, 0.1); color: #0284c7; display: grid; place-items: center; flex-shrink: 0;">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                    <div>
                      <div style="font-weight: 600; font-size: 0.95rem; color: #16281e;">General Administration</div>
                      <div style="font-size: 0.88rem; color: #5f6862; margin-top: 0.2rem;">contact@curiomas.org</div>
                    </div>
                  </div>

                  <div style="display: flex; gap: 1rem; align-items: flex-start;">
                    <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(16, 185, 129, 0.1); color: #059669; display: grid; place-items: center; flex-shrink: 0;">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    </div>
                    <div>
                      <div style="font-weight: 600; font-size: 0.95rem; color: #16281e;">Student Fellowship Admissions</div>
                      <div style="font-size: 0.88rem; color: #5f6862; margin-top: 0.2rem;">admissions@curiomas.org</div>
                    </div>
                  </div>

                  <div style="display: flex; gap: 1rem; align-items: flex-start;">
                    <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(99, 102, 241, 0.1); color: #6366f1; display: grid; place-items: center; flex-shrink: 0;">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                    </div>
                    <div>
                      <div style="font-weight: 600; font-size: 0.95rem; color: #16281e;">Open Source Code & Data</div>
                      <div style="font-size: 0.88rem; color: #5f6862; margin-top: 0.2rem;">github.com/curiomas-crii</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style="background: #f1ebe1; padding: 2.25rem; border-radius: 14px; border: 1px solid #e2d9cc;">
                <h3 style="font-size: 1.25rem; font-weight: 600; color: #18281e; margin-bottom: 0.85rem;">Autonomous & Reproducible</h3>
                <p style="font-size: 0.92rem; line-height: 1.65; color: #555f58; margin: 0;">
                  All scientific communications, dataset releases, and preprints are maintained under the institute's commitment to public reproducibility and global access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer Wave Divider -->
      ${renderCurveDivider({ bgColor: '#faf8f5', color: '#071f16' })}
    </div>
  `;
}

export async function mountContactPage() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const affiliation = document.getElementById('contactAffiliation').value.trim();
      const subject = document.getElementById('contactSubject').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      const btn = form.querySelector('button[type="submit"]');
      const origText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span>Sending inquiry...</span>';

      try {
        if (window.emailjs) {
          const tplId = localStorage.getItem('crii_emailjs_template_id') || 
            (window.CRII_API && typeof window.CRII_API.getEmailjsTemplateId === 'function' ? window.CRII_API.getEmailjsTemplateId() : null) || 'zhelx7y';
          emailjs.init({ publicKey: 'h3x_9dtR8frBq2pCi' });
          await emailjs.send('curiomas', tplId, {
            to_email: 'curiomas.members@gmail.com',
            from_name: name,
            sender_email: email,
            sender_affiliation: affiliation,
            subject: `CRII Inquiry [${subject}]: ${name}`,
            message: `From: ${name} (${email})\nAffiliation: ${affiliation}\nCategory: ${subject}\n\nMessage:\n${message}`,
            reply_to: email
          });
        }
        if (window.showToast) window.showToast('Your message has been sent successfully. We will be in touch shortly!', 'success');
        form.reset();
      } catch (err) {
        console.error('Contact submit error:', err);
        if (window.showToast) window.showToast('Inquiry received. If urgent, please email contact@curiomas.org directly.', 'info');
        form.reset();
      } finally {
        btn.disabled = false;
        btn.innerHTML = origText;
      }
    });
  }

  if (typeof window.refreshScrollAnimations === 'function') {
    window.refreshScrollAnimations();
  }
}
