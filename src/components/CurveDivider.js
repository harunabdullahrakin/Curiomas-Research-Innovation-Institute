const CURVE_VARIANTS = {
  layered: {
    p3: 'M-120,46 C210,8 520,78 860,34 C1140,-2 1340,60 1560,36 L1560,115 L-120,115 Z',
    p2: 'M-120,34 C260,76 620,6 980,48 C1220,74 1390,22 1560,34 L1560,115 L-120,115 Z',
    p1: 'M-120,48 C220,18 560,72 920,36 C1180,10 1370,54 1560,42 L1560,115 L-120,115 Z'
  },
  crest: {
    p3: 'M-120,52 C320,10 680,76 1080,26 C1280,2 1420,44 1560,34 L1560,115 L-120,115 Z',
    p2: 'M-120,42 C240,74 580,12 940,52 C1190,78 1380,28 1560,40 L1560,115 L-120,115 Z',
    p1: 'M-120,56 C300,16 660,68 1040,30 C1260,8 1410,48 1560,40 L1560,115 L-120,115 Z'
  },
  swell: {
    p3: 'M-120,36 C280,78 640,8 1020,54 C1240,78 1400,26 1560,42 L1560,115 L-120,115 Z',
    p2: 'M-120,50 C220,12 560,74 920,30 C1180,-2 1360,56 1560,34 L1560,115 L-120,115 Z',
    p1: 'M-120,40 C260,72 620,18 980,54 C1220,76 1390,30 1560,46 L1560,115 L-120,115 Z'
  },
  flow: {
    p3: 'M-120,44 C300,72 680,14 1060,46 C1280,66 1420,24 1560,38 L1560,115 L-120,115 Z',
    p2: 'M-120,36 C280,68 640,12 1000,48 C1240,70 1400,22 1560,34 L1560,115 L-120,115 Z',
    p1: 'M-120,46 C260,20 620,66 980,34 C1220,14 1390,52 1560,40 L1560,115 L-120,115 Z'
  }
};

export function renderCurveDivider({
  bgColor = '#060b16',
  color = '#f4efe6',
  flip = false,
  overlay = false,
  variant = 'layered',
  height = 76,
  connectorId = null
} = {}) {
  const paths = CURVE_VARIANTS[variant] || CURVE_VARIANTS.layered;
  const flipClass = flip ? 'curve-flip' : '';
  const overlayClass = overlay ? 'curve-overlay' : '';
  const h = Math.max(48, Number(height) || 76);

  const connectorHtml = connectorId ? `
    <a href="#${connectorId}" class="mockup-section-connector curve-connector-btn" aria-label="Scroll to section">
      <span class="connector-circle">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </span>
    </a>
  ` : '';

  const bgRect = overlay
    ? ''
    : `<rect x="-120" y="-12" width="1680" height="130" fill="${bgColor}"></rect>`;

  const wrapStyle = overlay
    ? `background-color: transparent; color: ${color}; margin-top: -${h}px; margin-bottom: -2px;`
    : `background-color: ${bgColor}; color: ${color}; margin-top: -2px; margin-bottom: -2px;`;

  return `
    <div class="mockup-curve-divider ${flipClass} ${overlayClass}" style="${wrapStyle}">
      <div class="mockup-curve-svg-wrap" aria-hidden="true">
        <svg viewBox="0 0 1440 84" preserveAspectRatio="none" class="mockup-curve-svg" style="height: ${h}px;">
          ${bgRect}
          <path class="curve-path-3" d="${paths.p3}" fill="${color}" fill-opacity="0.28"></path>
          <path class="curve-path-2" d="${paths.p2}" fill="${color}" fill-opacity="0.58"></path>
          <path class="curve-path-1" d="${paths.p1}" fill="${color}"></path>
        </svg>
      </div>
      ${connectorHtml}
    </div>
  `;
}
