import { renderCurveDivider } from '../components/CurveDivider.js';

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtPrice(pkg) {
  const n = Number(pkg.price || 0);
  if (!n || n <= 0) return 'Free';
  const syms = { BDT: '৳', USD: '$', EUR: '€', GBP: '£', INR: '₹' };
  return `${syms[pkg.currency] || (pkg.currency ? pkg.currency + ' ' : '')}${n.toLocaleString()}`;
}

export function renderRecruitPageHtml() {
  return `
    <div class="page-recruit-wrapper" style="background:#faf8f5; min-height:100vh;">
      <div id="recruitPageDynamicRoot" style="min-height:70vh; display:flex; align-items:center; justify-content:center; padding:8rem 1.5rem 4rem;">
        <div style="text-align:center; color:#5c635d;">
          <div style="width:36px; height:36px; border:3px solid rgba(234,88,12,0.2); border-top-color:#ea580c; border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 1rem;"></div>
          <p style="font-size:0.95rem; font-weight:600;">Loading Recruitment Programs & Fellowship Packages...</p>
        </div>
      </div>
      ${renderCurveDivider({ bgColor: '#faf8f5', color: '#071f16' })}
    </div>
  `;
}

function renderEmbeddedApplicationHtml(ctaTitle) {
  return `
    <section id="recruitApplySection" style="padding:4.5rem 0 5rem; background:#ded3be;">
      <div class="mockup-container">
        <div style="max-width:860px; margin:0 auto;">
          <div style="text-align:center; margin-bottom:2.25rem;">
            <span style="display:inline-block; padding:0.3rem 0.9rem; border-radius:999px; background:rgba(234,88,12,0.12); color:#ea580c; font-weight:700; font-size:0.78rem; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:0.75rem;">Direct Fellowship Application</span>
            <h2 class="mockup-h2" style="color:#1a221b; margin-bottom:0.65rem;">${esc(ctaTitle || 'Apply for Fellowship')}</h2>
            <p id="fellowshipHeaderSubtitle" style="color:#4b554e; font-size:1rem; max-width:600px; margin:0 auto; line-height:1.6;">
              Complete your research dossier below to join the upcoming cohort.
            </p>
          </div>

          <div id="fellowshipClosedCard" style="display:none; background:#ffffff; padding:3.25rem 2.25rem; border-radius:18px; border:1px solid #d4c8b6; text-align:center;">
            <h3 id="fellowshipClosedTitle" style="font-size:1.55rem; color:#1a221b; margin-bottom:0.65rem;">Applications Currently Closed</h3>
            <div id="fellowshipClosedTimelineBadge" style="display:none; margin-bottom:1rem;"></div>
            <p id="fellowshipClosedMessageText" style="color:#5c635d; max-width:560px; margin:0 auto; line-height:1.65;"></p>
          </div>

          <div id="fellowshipOpenContainer">
            <div id="fellowshipInviteCard" style="display:none; background:#ffffff; padding:2.75rem 2.25rem; border-radius:18px; border:1px solid #d4c8b6; text-align:center;">
              <div id="fellowshipTimelineIndicator" style="display:none; align-items:center; justify-content:center; gap:0.5rem; margin-bottom:1.25rem; padding:0.5rem 1rem; border-radius:999px; background:rgba(234,88,12,0.08); border:1px solid rgba(234,88,12,0.25); font-size:0.84rem; color:#1a221b;">
                <span id="fellowshipTimelineLabel"></span>
              </div>
              <h3 style="font-size:1.6rem; color:#1a221b; margin-bottom:0.75rem; font-family:var(--font-display);">Ready to Start Your Research Track?</h3>
              <p style="color:#5c635d; max-width:540px; margin:0 auto 1.75rem; line-height:1.6;">Begin the quick candidate verification step to unlock your personalized fellowship dossier.</p>
              <button type="button" class="mockup-btn-dark-green" onclick="window.startCuriousApplication()" style="padding:0.95rem 2.25rem; font-size:1rem; border:none; cursor:pointer;">Begin Fellowship Application →</button>
            </div>

            <div id="fellowshipCuriousGateway" style="display:none; background:#ffffff; padding:2.5rem 2.25rem; border-radius:18px; border:1px solid #d4c8b6;">
              <h3 style="font-size:1.45rem; color:#1a221b; margin-bottom:0.5rem;">Step 1: Candidate Identity</h3>
              <p style="color:#5c635d; font-size:0.92rem; margin-bottom:1.5rem;">Enter your name and email address so the Admissions Council can initialize your research profile.</p>
              <div class="form-row" style="margin-bottom:1.25rem;">
                <div class="form-group" style="flex:1;">
                  <label class="form-label" for="curiousNameInput" style="font-weight:700;">Full Name *</label>
                  <input type="text" id="curiousNameInput" class="form-input" placeholder="e.g. Maya Lin" required>
                </div>
                <div class="form-group" style="flex:1;">
                  <label class="form-label" for="curiousEmailInput" style="font-weight:700;">Email Address *</label>
                  <input type="email" id="curiousEmailInput" class="form-input" placeholder="e.g. maya@university.edu" required>
                  <div id="curiousEmailUniqueStatus" style="font-size:0.78rem; margin-top:0.3rem; min-height:1em;"></div>
                </div>
              </div>
              <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
                <button type="button" class="btn btn-secondary" onclick="window.backToFellowshipInvite()">Back</button>
                <button type="button" class="mockup-btn-dark-green" onclick="window.proceedFromCuriousGateway()" style="padding:0.8rem 1.75rem; border:none; cursor:pointer;">Continue to Application →</button>
              </div>
            </div>

            <div id="fellowshipCuriosityLoader" style="display:none; background:#ffffff; padding:3.5rem 2rem; border-radius:18px; border:1px solid #d4c8b6; text-align:center;">
              <div style="width:52px; height:52px; border:3px solid rgba(234,88,12,0.18); border-top-color:#ea580c; border-radius:50%; animation:spin 0.9s linear infinite; margin:0 auto 1.25rem;"></div>
              <h3 id="curiosityLoaderTitle" style="font-size:1.35rem; color:#1a221b; margin-bottom:0.4rem;">Preparing Dossier...</h3>
              <p id="curiosityLoaderSubtitle" style="font-size:0.9rem; color:#5c635d;"></p>
            </div>

            <div id="applicationFormCard" style="display:none; background:#ffffff; padding:2.5rem 2.25rem; border-radius:18px; border:1px solid #d4c8b6; box-shadow:0 4px 24px rgba(0,0,0,0.06);">
              <div style="background:#faf8f5; border:1px solid #e6ded3; border-radius:12px; padding:0.9rem 1.15rem; margin-bottom:1.75rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem;">
                <div>
                  <div style="font-weight:700; color:#1a221b;" id="dossierNameBadge">Candidate</div>
                  <div style="font-size:0.82rem; color:#5c635d;" id="dossierEmailBadge">email@domain.com</div>
                </div>
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.backToCuriousGateway()">Change Identity</button>
              </div>

              <form id="internApplicationForm">
                <input type="hidden" id="appFullName">
                <input type="hidden" id="appEmail">

                <div class="form-row">
                  <div class="form-group" style="flex:1;">
                    <label class="form-label" for="appUniversity" style="font-weight:600;">University / Institution *</label>
                    <input type="text" id="appUniversity" class="form-input" placeholder="e.g. Oxford University / MIT / High School" required>
                  </div>
                  <div class="form-group" style="flex:1;">
                    <label class="form-label" for="appFieldOfStudy" style="font-weight:600;">Field of Study / Major *</label>
                    <input type="text" id="appFieldOfStudy" class="form-input" placeholder="e.g. Physics, Molecular Biology, CS" required>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group" style="flex:1;">
                    <label class="form-label" for="appDivision" style="font-weight:600;">Preferred Research Division Track *</label>
                    <select id="appDivision" class="form-select" required><option value="">Select Research Division Track...</option></select>
                  </div>
                  <div class="form-group" style="flex:1;">
                    <label class="form-label" for="appLevel" style="font-weight:600;">Academic Level / Cohort Profile</label>
                    <select id="appLevel" class="form-select"><option value="">Select Academic Level...</option></select>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="appPortfolio" style="font-weight:600;">GitHub Profile, ORCID, or Portfolio Link</label>
                  <input type="text" id="appPortfolio" class="form-input" placeholder="github.com/your-username or any link">
                </div>

                <div id="appPackagesSelectorContainer" style="display:none; margin-bottom:1.5rem;"></div>

                <div id="appPaymentDetailsBox" style="display:none; background:#fff7ed; border:1px solid #fdba74; border-radius:12px; padding:1.25rem; margin-bottom:1.5rem;">
                  <div style="font-weight:700; color:#c2410c; font-size:0.95rem; margin-bottom:0.35rem;">Student Fee & Payment Verification</div>
                  <div id="appPaymentInstructionsText" style="font-size:0.86rem; color:#7c2d12; line-height:1.55; margin-bottom:0.85rem;"></div>
                  <div id="appPaymentLinkWrap" style="display:none; margin-bottom:0.85rem;">
                    <a id="appPaymentLinkBtn" href="#" target="_blank" rel="noopener" class="btn btn-primary btn-sm" style="text-decoration:none; display:inline-flex;">Open Payment Portal →</a>
                  </div>
                  <div class="form-row" style="gap:1rem;">
                    <div class="form-group" style="flex:1; margin-bottom:0;">
                      <label class="form-label" for="appPaymentRefInput" style="font-weight:600; font-size:0.84rem;">Payment Transaction ID / Reference *</label>
                      <input type="text" id="appPaymentRefInput" class="form-input" placeholder="e.g. TRX9A8B7C6D">
                      <div id="appPaymentRefUniqueStatus" style="font-size:0.76rem; margin-top:0.25rem;"></div>
                    </div>
                    <div class="form-group" style="flex:1; margin-bottom:0;">
                      <label class="form-label" style="font-weight:600; font-size:0.84rem;">Payment Receipt Screenshot (Optional)</label>
                      <div style="display:flex; gap:0.45rem; align-items:center; flex-wrap:wrap;">
                        <button type="button" class="btn btn-primary btn-sm" onclick="window.triggerPublicAppMediaUpload('appPaymentReceiptInput', 'image/*')">Upload Receipt</button>
                        <button type="button" class="btn btn-secondary btn-sm" onclick="window.togglePublicAppUrlInput('appPaymentReceiptInput')">URL</button>
                        <span id="appPaymentReceiptInput_status" style="font-size:0.74rem; color:#64748b;"></span>
                      </div>
                      <div id="appPaymentReceiptInput_urlWrap" style="display:none; margin-top:0.4rem;">
                        <input type="text" id="appPaymentReceiptInput" class="form-input" placeholder="Receipt image URL or path">
                      </div>
                    </div>
                  </div>
                </div>

                <div id="appCustomFieldsContainer"></div>

                <div class="form-group">
                  <label class="form-label" for="appStatement" style="font-weight:600;">Statement of Scientific Curiosity & Research Motivation *</label>
                  <textarea id="appStatement" class="form-textarea" rows="4" placeholder="What scientific questions or discoveries drive your curiosity?" required></textarea>
                </div>

                <div style="margin-top:2rem;">
                  <button type="submit" class="mockup-btn-dark-green" style="width:100%; padding:1rem; font-size:1.05rem; border:none; cursor:pointer;">
                    <span>Submit Fellowship Application →</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export async function mountRecruitPage() {
  const root = document.getElementById('recruitPageDynamicRoot');
  if (!root || !window.CRII_API) return;

  const params = new URLSearchParams(window.location.search);
  const pathParts = window.location.pathname.replace(/^\/+|\/+$/g, '').split('/');
  const slugParam = (params.get('page') || (pathParts.length > 1 ? pathParts[1] : '') || '').toLowerCase();

  const allPages = (await window.CRII_API.getRecruitPages()) || [];
  const allPackages = (await window.CRII_API.getFellowshipPackages()) || [];
  const activePages = allPages.filter(p => p && p.status !== 'Draft');
  const activePackages = allPackages.filter(p => p && p.active !== false);

  const matchedPage = slugParam
    ? allPages.find(p => String(p.slug || '').toLowerCase() === slugParam)
    : null;

  if (!matchedPage) {
    root.style.display = 'block';
    root.style.padding = '0';
    root.innerHTML = `
      <section style="background:linear-gradient(135deg, #071f16 0%, #0f2920 60%, #1c1917 100%); color:#ffffff; padding:8.5rem 1.5rem 5rem; text-align:center;">
        <div class="mockup-container" style="max-width:920px;">
          <span style="display:inline-block; padding:0.35rem 1rem; border-radius:999px; background:rgba(234,88,12,0.18); border:1px solid rgba(234,88,12,0.45); color:#fb923c; font-size:0.78rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:1.25rem;">CRII Admissions & Recruitment</span>
          <h1 style="font-size:clamp(2.2rem, 5vw, 3.6rem); font-weight:800; line-height:1.12; margin-bottom:1.1rem; font-family:var(--font-display);">Join Our Open Research Cohorts</h1>
          <p style="font-size:1.08rem; color:rgba(255,255,255,0.82); max-width:660px; margin:0 auto 2rem; line-height:1.65;">
            Explore active recruitment campaigns, fellowship tiers, student benefits, and direct admissions tracks across Curiomas Research & Innovation Institute.
          </p>
          <a href="/team#apply" class="btn btn-primary" style="padding:0.9rem 2rem; border-radius:999px; font-weight:700; text-decoration:none; background:#ea580c; border:none; color:#ffffff;">Go to General Application →</a>
        </div>
      </section>

      <section style="padding:4.5rem 1.5rem;">
        <div class="mockup-container">
          ${activePages.length > 0 ? `
            <h2 class="mockup-h2" style="margin-bottom:2rem; color:#1a221b;">Active Recruitment Programs</h2>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.5rem; margin-bottom:4rem;">
              ${activePages.map(p => `
                <a href="/recruit?page=${encodeURIComponent(p.slug)}" style="text-decoration:none; color:inherit; background:#ffffff; border:1px solid #e2e8f0; border-radius:20px; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 4px 20px rgba(15,23,42,0.05); transition:transform 0.25s ease;">
                  <div>
                    ${p.heroMedia && !/\.(mp4|webm|mov)(\?.*)?$/i.test(p.heroMedia) ? `<div style="height:180px; overflow:hidden; background:#0f172a;"><img src="${esc(p.heroMedia)}" style="width:100%; height:100%; object-fit:cover;"></div>` : ''}
                    <div style="padding:1.5rem;">
                      ${p.badge ? `<span style="display:inline-block; font-size:0.7rem; font-weight:700; color:#ea580c; background:rgba(234,88,12,0.1); padding:3px 10px; border-radius:999px; margin-bottom:0.65rem;">${esc(p.badge)}</span>` : ''}
                      <h3 style="font-size:1.3rem; font-weight:700; color:#0f172a; margin:0 0 0.5rem;">${esc(p.title)}</h3>
                      <p style="font-size:0.88rem; color:#64748b; line-height:1.6; margin:0;">${esc(p.subtitle || '')}</p>
                    </div>
                  </div>
                  <div style="padding:1rem 1.5rem; border-top:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center; font-weight:700; font-size:0.85rem; color:#ea580c;">
                    <span>${esc(p.ctaText || 'Explore & Apply')}</span>
                    <span>→</span>
                  </div>
                </a>
              `).join('')}
            </div>
          ` : ''}

          ${activePackages.length > 0 ? `
            <h2 class="mockup-h2" style="margin-bottom:2rem; color:#1a221b;">Fellowship Packages & Student Tiers</h2>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem;">
              ${activePackages.map(pkg => `
                <div style="background:#ffffff; border:${pkg.highlighted ? '2px solid #ea580c' : '1px solid #e2e8f0'}; border-radius:20px; padding:1.75rem; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 6px 24px rgba(15,23,42,0.05);">
                  <div>
                    ${pkg.badge ? `<span style="display:inline-block; font-size:0.72rem; font-weight:700; color:#ea580c; background:rgba(234,88,12,0.12); padding:3px 10px; border-radius:999px; margin-bottom:0.75rem;">${esc(pkg.badge)}</span>` : ''}
                    <h3 style="font-size:1.35rem; font-weight:800; color:#0f172a; margin:0 0 0.4rem;">${esc(pkg.name)}</h3>
                    <div style="display:flex; align-items:baseline; gap:0.4rem; margin-bottom:0.85rem;">
                      <span style="font-size:2rem; font-weight:800; color:#ea580c;">${fmtPrice(pkg)}</span>
                      <span style="font-size:0.84rem; color:#64748b;">/ ${esc(pkg.billingCycle || 'One-time')}</span>
                    </div>
                    ${pkg.description ? `<p style="font-size:0.88rem; color:#475569; margin:0 0 1.25rem; line-height:1.55;">${esc(pkg.description)}</p>` : ''}
                    <ul style="list-style:none; padding:0; margin:0 0 1.5rem; display:flex; flex-direction:column; gap:0.55rem;">
                      ${(pkg.benefits || []).map(b => `<li style="display:flex; gap:0.5rem; font-size:0.88rem; color:#334155;"><span style="color:#10b981; font-weight:800;">✓</span><span>${esc(b)}</span></li>`).join('')}
                    </ul>
                  </div>
                  <a href="/team?package=${encodeURIComponent(pkg.id)}#apply" style="display:block; text-align:center; padding:0.85rem 1.25rem; border-radius:12px; font-weight:700; text-decoration:none; background:${pkg.highlighted ? '#ea580c' : '#0f172a'}; color:#ffffff;">Select & Apply →</a>
                </div>
              `).join('')}
            </div>
          ` : `
            <div style="text-align:center; padding:3rem 1.5rem; background:#ffffff; border-radius:18px; border:1px dashed #cbd5e1;">
              <h3 style="margin-bottom:0.5rem; color:#0f172a;">Open Fellowship Admissions</h3>
              <p style="color:#64748b; margin-bottom:1.5rem;">Apply directly to join CRII research tracks.</p>
              <a href="/team#apply" class="mockup-btn-dark-green" style="text-decoration:none; padding:0.85rem 2rem;">Apply Now →</a>
            </div>
          `}
        </div>
      </section>
    `;
    return;
  }

  document.title = `${matchedPage.title} — CRII Recruitment`;
  const pagePackages = Array.isArray(matchedPage.packageIds) && matchedPage.packageIds.length > 0
    ? activePackages.filter(p => matchedPage.packageIds.includes(p.id))
    : activePackages;
  const isHeroVideo = matchedPage.heroMedia && /\.(mp4|webm|mov)(\?.*)?$/i.test(matchedPage.heroMedia);

  root.style.display = 'block';
  root.style.padding = '0';
  root.innerHTML = `
    <section style="position:relative; overflow:hidden; background:#07101d; color:#ffffff; padding:9rem 1.5rem 6rem; text-align:center;">
      ${matchedPage.heroMedia ? (
        isHeroVideo
          ? `<video src="${esc(matchedPage.heroMedia)}" autoplay muted loop playsinline style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.35;"></video>`
          : `<img src="${esc(matchedPage.heroMedia)}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.35;">`
      ) : ''}
      <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(7,16,29,0.72) 0%, rgba(7,31,22,0.92) 100%);"></div>
      <div class="mockup-container" style="position:relative; z-index:2; max-width:900px;">
        ${matchedPage.badge ? `<span style="display:inline-block; padding:0.35rem 1rem; border-radius:999px; background:rgba(234,88,12,0.2); border:1px solid rgba(234,88,12,0.5); color:#fb923c; font-size:0.78rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:1.15rem;">${esc(matchedPage.badge)}</span>` : ''}
        <h1 style="font-size:clamp(2.2rem, 5vw, 3.7rem); font-weight:800; line-height:1.1; margin-bottom:1.15rem; font-family:var(--font-display);">${esc(matchedPage.title)}</h1>
        <p style="font-size:1.1rem; color:rgba(255,255,255,0.86); max-width:680px; margin:0 auto 2rem; line-height:1.65;">${esc(matchedPage.subtitle || '')}</p>
        <div style="display:flex; gap:0.85rem; justify-content:center; flex-wrap:wrap; align-items:center;">
          <button type="button" onclick="document.getElementById('recruitApplySection')?.scrollIntoView({behavior:'smooth'})" style="padding:0.95rem 2.25rem; border-radius:999px; background:#ea580c; color:#ffffff; border:none; font-weight:700; font-size:1rem; cursor:pointer; box-shadow:0 10px 28px rgba(234,88,12,0.35);">${esc(matchedPage.ctaText || 'Apply for Fellowship')} →</button>
          ${matchedPage.divisionScope ? `<span style="padding:0.55rem 1.1rem; border-radius:999px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.18); font-size:0.85rem; font-weight:600;">Scope: ${esc(matchedPage.divisionScope)}</span>` : ''}
        </div>
      </div>
    </section>

    ${Array.isArray(matchedPage.benefits) && matchedPage.benefits.length > 0 ? `
      <section style="padding:5rem 1.5rem; background:#faf8f5;">
        <div class="mockup-container">
          <div style="text-align:center; max-width:680px; margin:0 auto 3rem;">
            <span style="font-size:0.78rem; font-weight:700; color:#ea580c; text-transform:uppercase; letter-spacing:0.08em;">Fellowship Advantages</span>
            <h2 class="mockup-h2" style="color:#0f172a; margin-top:0.35rem;">Why Researchers Choose This Program</h2>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1.5rem;">
            ${matchedPage.benefits.map(b => `
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; padding:1.75rem; box-shadow:0 4px 20px rgba(15,23,42,0.04);">
                <div style="width:48px; height:48px; border-radius:12px; background:rgba(234,88,12,0.1); display:flex; align-items:center; justify-content:center; font-size:1.5rem; margin-bottom:1rem;">${esc(b.icon || '🔬')}</div>
                <h3 style="font-size:1.15rem; font-weight:700; color:#0f172a; margin:0 0 0.45rem;">${esc(b.title)}</h3>
                <p style="font-size:0.9rem; color:#64748b; line-height:1.6; margin:0;">${esc(b.desc)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    ` : ''}

    ${pagePackages.length > 0 ? `
      <section style="padding:4.5rem 1.5rem; background:#ffffff; border-top:1px solid #f1f5f9;">
        <div class="mockup-container">
          <div style="text-align:center; max-width:680px; margin:0 auto 3rem;">
            <span style="font-size:0.78rem; font-weight:700; color:#ea580c; text-transform:uppercase; letter-spacing:0.08em;">Packages & Student Fees</span>
            <h2 class="mockup-h2" style="color:#0f172a; margin-top:0.35rem;">Choose Your Research Tier</h2>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(290px, 1fr)); gap:1.5rem; max-width:1080px; margin:0 auto;">
            ${pagePackages.map(pkg => `
              <div style="background:${pkg.highlighted ? 'linear-gradient(180deg, #fff7ed 0%, #ffffff 45%)' : '#ffffff'}; border:${pkg.highlighted ? '2px solid #ea580c' : '1px solid #e2e8f0'}; border-radius:20px; padding:2rem; display:flex; flex-direction:column; justify-content:space-between; box-shadow:${pkg.highlighted ? '0 18px 40px rgba(234,88,12,0.14)' : '0 4px 18px rgba(15,23,42,0.04)'};">
                <div>
                  ${pkg.badge ? `<span style="display:inline-block; font-size:0.72rem; font-weight:700; color:#ea580c; background:rgba(234,88,12,0.14); padding:3px 10px; border-radius:999px; margin-bottom:0.75rem;">${esc(pkg.badge)}</span>` : ''}
                  <h3 style="font-size:1.38rem; font-weight:800; color:#0f172a; margin:0 0 0.45rem;">${esc(pkg.name)}</h3>
                  <div style="display:flex; align-items:baseline; gap:0.4rem; margin-bottom:0.9rem;">
                    <span style="font-size:2.15rem; font-weight:800; color:#ea580c;">${fmtPrice(pkg)}</span>
                    <span style="font-size:0.85rem; color:#64748b;">/ ${esc(pkg.billingCycle || 'One-time')}</span>
                  </div>
                  ${pkg.description ? `<p style="font-size:0.88rem; color:#475569; margin:0 0 1.25rem; line-height:1.6;">${esc(pkg.description)}</p>` : ''}
                  <ul style="list-style:none; padding:0; margin:0 0 1.75rem; display:flex; flex-direction:column; gap:0.55rem;">
                    ${(pkg.benefits || []).map(b => `<li style="display:flex; gap:0.5rem; font-size:0.9rem; color:#334155;"><span style="color:#10b981; font-weight:800;">✓</span><span>${esc(b)}</span></li>`).join('')}
                  </ul>
                </div>
                <button type="button" onclick="window.pickRecruitTierAndScroll('${esc(pkg.id)}')" style="width:100%; padding:0.9rem 1.25rem; border-radius:12px; font-weight:700; font-size:0.95rem; border:none; cursor:pointer; background:${pkg.highlighted ? '#ea580c' : '#0f172a'}; color:#ffffff;">Select ${esc(pkg.name)} & Apply →</button>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    ` : ''}

    ${matchedPage.showForm !== false ? renderEmbeddedApplicationHtml(matchedPage.ctaText || matchedPage.title) : ''}
  `;

  window.pickRecruitTierAndScroll = function(pkgId) {
    if (typeof window.selectApplicationPackage === 'function') {
      window.selectApplicationPackage(pkgId);
    }
    const sec = document.getElementById('recruitApplySection');
    if (sec) sec.scrollIntoView({ behavior: 'smooth' });
  };

  if (matchedPage.showForm !== false && typeof window.initApplicationForm === 'function') {
    window._criiActiveAppFormOptions = {
      recruitPageSlug: matchedPage.slug,
      allowedPackageIds: Array.isArray(matchedPage.packageIds) ? matchedPage.packageIds : []
    };
    await window.initApplicationForm();
  }
}
