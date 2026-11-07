/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Reusable Animated Organic Wave Curve Divider
 * Guaranteed 100% gapless with extended SVG viewBox coordinates
 */

export function renderCurveDivider({ bgColor = '#060b16', color = '#f4efe6', flip = false, connectorId = null } = {}) {
  const flipClass = flip ? 'curve-flip' : '';
  const connectorHtml = connectorId ? `
    <a href="#${connectorId}" class="mockup-section-connector" style="position: absolute; top: -19px; left: 50%; transform: translateX(-50%); z-index: 20; margin: 0; text-decoration: none;" aria-label="Scroll to section">
      <div class="connector-circle">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#ffffff" stroke-width="2.8"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </a>
  ` : '';

  return `
    <div class="mockup-curve-divider ${flipClass}" aria-hidden="true" style="background-color: ${bgColor}; color: ${color}; margin-top: -2px; margin-bottom: -2px;">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" class="mockup-curve-svg">
        <path class="curve-path-2" d="M-50,32 C360,60 720,5 1080,44 C1260,62 1380,20 1490,30 L1490,70 L-50,70 Z" fill="currentColor" fill-opacity="0.8"></path>
        <path class="curve-path-1" d="M-50,22 C320,54 680,10 1020,38 C1200,52 1350,16 1490,22 L1490,70 L-50,70 Z" fill="currentColor"></path>
      </svg>
      ${connectorHtml}
    </div>
  `;
}
