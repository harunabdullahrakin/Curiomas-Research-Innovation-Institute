/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Reusable Animated Organic Wave Curve Divider
 * Guaranteed 100% gapless with SVG solid background rect & extended path bounds
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
    <div class="mockup-curve-divider ${flipClass}" aria-hidden="true" style="background-color: ${bgColor}; color: ${color}; margin-top: -4px; margin-bottom: -4px; transform: translateZ(0);">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" class="mockup-curve-svg" style="display:block; width:calc(100% + 4px); margin-left:-2px; height:56px;">
        <rect x="-60" y="-10" width="1560" height="95" fill="${bgColor}"></rect>
        <path class="curve-path-2" d="M-60,32 C360,60 720,5 1080,44 C1260,62 1380,20 1500,30 L1500,85 L-60,85 Z" fill="${color}" fill-opacity="0.75"></path>
        <path class="curve-path-1" d="M-60,22 C320,54 680,10 1020,38 C1200,52 1350,16 1500,22 L1500,85 L-60,85 Z" fill="${color}"></path>
      </svg>
      ${connectorHtml}
    </div>
  `;
}
