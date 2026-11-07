/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Reusable Page Hero Component
 * Consistent across Research, Team, Blog, Contact, and Article pages
 */

export function renderPageHero({
  title = '',
  subtitle = '',
  breadcrumbs = null,
  minHeight = 'auto',
  customHtml = ''
} = {}) {
  const breadcrumbsHtml = breadcrumbs ? `
    <div class="mockup-page-hero-breadcrumbs" style="font-size: 0.86rem; color: #94a3b8; margin-bottom: 1.25rem;">
      ${breadcrumbs.map((crumb, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        if (isLast) {
          return `<span style="color: #38bdf8; font-weight: 600;">${crumb.label}</span>`;
        }
        return `<a href="${crumb.href}" style="color: inherit; text-decoration: none;">${crumb.label}</a> / `;
      }).join('')}
    </div>
  ` : '';

  const subtitleHtml = subtitle ? `
    <p class="mockup-page-hero-subtitle">
      ${subtitle}
    </p>
  ` : '';

  return `
    <section class="mockup-page-hero" style="${minHeight !== 'auto' ? `min-height: ${minHeight};` : ''}">
      <div class="mockup-page-hero-bg-layer"></div>
      <div class="mockup-page-hero-bg-overlay"></div>
      <div class="mockup-container">
        <div class="mockup-page-hero-body scroll-reveal">
          ${breadcrumbsHtml}
          <h1 class="mockup-page-hero-title">${title}</h1>
          ${subtitleHtml}
          ${customHtml}
        </div>
      </div>
    </section>
  `;
}
