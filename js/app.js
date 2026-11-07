/**
 * CURIOMAS RESEARCH & INNOVATION INSTITUTE (CRII)
 * Global Application Engine
 * - Light/Dark Theme Switcher (Default: Light)
 * - Dynamic Navbar Title & Logo Loader
 * - Interactive Custom Scientific Cursor
 * - Cookie Consent Banner
 * - Mobile Navigation & Toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initBrandingAndNavbar();
  initHeroCustomization();
  initScrollRevealEffects();
  initFestiveSeasonalTheme();
  initCustomCursor();
  initCookieConsent();
  initMobileNav();
  initAutoHidingNavbar();
  initUserSessionState();
  initToastContainer();
  initFeaturedArticles();
  initDivisions();
  initCohorts();
  initHomeTeam();
  initGoogleTranslateAndLang();
  initSearchOverlay();
});

// Hero Appearance & Dynamic Multi-Image / Video / Font Customization
function initHeroCustomization() {
  if (!window.CRII_API) return;
  const settings = window.CRII_API.getHeroSettings();
  if (!settings) return;

  const mediaType = settings.mediaType || 'both'; // 'image', 'video', 'both'
  const selectionMode = settings.selectionMode || 'random'; // 'random', 'fixed'

  const bgLayer = document.getElementById('heroBgImageLayer');
  const video = document.getElementById('heroVideo');

  const defaultImages = [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=85',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=85',
    'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1920&q=85',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=85',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=85'
  ];

  const imagePool = (Array.isArray(settings.backgroundImages) && settings.backgroundImages.length > 0)
    ? settings.backgroundImages
    : defaultImages;

  // 1. Determine media active state
  let showVideo = false;
  let showImage = false;

  if (mediaType === 'video') {
    showVideo = true;
    showImage = false;
  } else if (mediaType === 'image') {
    showVideo = false;
    showImage = true;
  } else {
    // mediaType === 'both'
    if (selectionMode === 'random') {
      // 50% chance video, 50% chance image on load
      const pickVideo = Math.random() < 0.5;
      showVideo = pickVideo;
      showImage = !pickVideo;
    } else {
      // fixed mode: play video with image as backdrop/fallback
      showVideo = true;
      showImage = true;
    }
  }

  // 2. Select image (random or fixed)
  let pickedImage = imagePool[0];
  if (selectionMode === 'random') {
    pickedImage = imagePool[Math.floor(Math.random() * imagePool.length)];
  } else {
    const fixedIdx = Number(settings.fixedImageIndex) || 0;
    pickedImage = imagePool[fixedIdx] || imagePool[0];
  }

  // Apply Background Image Layer
  if (bgLayer) {
    if (showImage || showVideo) {
      const imgLoader = new Image();
      imgLoader.onload = () => {
        bgLayer.style.backgroundImage = `url('${pickedImage}')`;
        bgLayer.style.display = 'block';
        const imgOpacity = settings.imageOpacity !== undefined ? settings.imageOpacity : (showVideo ? 0.25 : 0.40);
        bgLayer.style.opacity = showImage ? imgOpacity : '0.20';
      };
      imgLoader.src = pickedImage;
    } else {
      bgLayer.style.display = 'none';
    }
  }

  // Apply Video Layer
  if (video) {
    if (showVideo && settings.videoUrl) {
      video.style.display = 'block';
      const currentSrc = video.querySelector('source')?.getAttribute('src');
      if (currentSrc !== settings.videoUrl) {
        video.innerHTML = `<source src="${settings.videoUrl}" type="video/mp4">`;
        video.load();
      }
      video.play().catch(() => {});
    } else {
      video.style.display = 'none';
      try { video.pause(); } catch(e){}
    }
  }

  // 3. Dynamic Hero Title Font Family
  const heroTitle = document.querySelector('.mockup-hero-title');
  if (heroTitle && settings.fontFamily) {
    const fontMap = {
      'Eyekons': "'Eyekons', Georgia, serif",
      'Playfair Display': "'Playfair Display', Georgia, serif",
      'Cinzel Decorative': "'Cinzel Decorative', 'Cinzel', Georgia, serif",
      'Space Grotesk': "'Space Grotesk', -apple-system, sans-serif",
      'Syne': "'Syne', -apple-system, sans-serif",
      'Outfit': "'Outfit', -apple-system, sans-serif",
      'System Sans': "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    };
    const resolvedFont = fontMap[settings.fontFamily] || settings.fontFamily;
    heroTitle.style.setProperty('font-family', resolvedFont, 'important');
  }

  const blurPx = settings.blurPx !== undefined ? settings.blurPx : 12;
  const opacity = settings.overlayOpacity !== undefined ? settings.overlayOpacity : 0.55;

  document.documentElement.style.setProperty('--hero-blur', `${blurPx}px`);
  document.documentElement.style.setProperty('--hero-overlay-bg', `rgba(10, 15, 30, ${opacity})`);
}

// =============================================================================
// SCROLL ANIMATIONS ENGINE (IntersectionObserver with smooth reveals & stagger)
// =============================================================================
let criiScrollObserver = null;

function initScrollRevealEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.scroll-reveal, .scroll-reveal-scale, .scroll-reveal-left, .scroll-reveal-right')
      .forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const autoSelectors = [
    '.mockup-section-header',
    '.divisions-header',
    '.cohort-header',
    '.editorial-header',
    '.editorial-spotlight-card',
    '.editorial-post-card',
    '.division-card',
    '.cohort-card',
    '.feature-card',
    '.repo-card',
    '.mockup-mentor-card',
    '.mockup-stats-grid > *',
    '.lead-copy',
    '.mockup-cta-card',
    '.footer-top-grid > *'
  ];

  function tagAndObserve() {
    autoSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach((el) => {
        if (!el.classList.contains('scroll-reveal') && !el.classList.contains('scroll-reveal-scale')) {
          el.classList.add('scroll-reveal');
          // Add stagger if part of a card grid
          const parent = el.parentElement;
          if (parent && (
            parent.classList.contains('divisions-cards-grid') ||
            parent.classList.contains('cohort-cards-grid') ||
            parent.classList.contains('editorial-posts-grid') ||
            parent.classList.contains('mockup-stats-grid')
          )) {
            const childIdx = Array.from(parent.children).indexOf(el);
            el.style.transitionDelay = `${Math.min(childIdx * 0.1, 0.4)}s`;
          }
        }
      });
    });

    if (!criiScrollObserver) {
      criiScrollObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
      });
    }

    document.querySelectorAll('.scroll-reveal:not(.is-revealed), .scroll-reveal-scale:not(.is-revealed), .scroll-reveal-left:not(.is-revealed), .scroll-reveal-right:not(.is-revealed)')
      .forEach(el => criiScrollObserver.observe(el));
  }

  tagAndObserve();
  window.refreshScrollAnimations = tagAndObserve;
}

// =============================================================================
// FESTIVE THEMES ENGINE (Admin Controlled: Holi, Christmas, Cherry Blossom, Eid, Festival)
// =============================================================================
function initFestiveSeasonalTheme() {
  // STRICTLY DO NOT RUN FESTIVE EFFECTS ON ADMIN DASHBOARD OR LOGIN
  const curPath = (window.location.pathname || '').toLowerCase();
  if (curPath.includes('portal') || curPath.includes('login') || document.body.classList.contains('portal-body') || document.querySelector('.portal-sidebar')) {
    return;
  }
  const festiveConfig = (window.CRII_API && window.CRII_API.getFestiveSettings)
    ? window.CRII_API.getFestiveSettings()
    : { mode: "always", theme: "holi", intensity: 0.70 };

  const urlParams = new URLSearchParams(window.location.search);
  const urlTheme = urlParams.get('theme') || urlParams.get('festive');

  // Calendar dates calculation for auto-detect
  const now = new Date();
  const month = now.getMonth(); // 0: Jan, 1: Feb, 2: Mar, 3: Apr, 4: May, ..., 11: Dec
  const day = now.getDate();

  let detectedTheme = 'holi';
  let isSeasonalActive = false;

  if (month === 11 || (month === 0 && day <= 10)) {
    // December or early January -> Christmas
    detectedTheme = 'christmas';
    isSeasonalActive = true;
  } else if ((month === 1 && day >= 15) || month === 2) {
    // Late February or March -> Holi / Spring
    detectedTheme = 'holi';
    isSeasonalActive = true;
  } else if (month === 3 || month === 4) {
    // April or May -> Cherry Blossom (Sakura)
    detectedTheme = 'cherry-blossom';
    isSeasonalActive = true;
  }

  // Target Theme Resolution
  let activeTheme = festiveConfig.theme || 'holi';
  let isFestiveActive = false;

  if (urlTheme) {
    if (urlTheme === 'none' || urlTheme === 'disabled') {
      isFestiveActive = false;
    } else {
      isFestiveActive = true;
      activeTheme = urlTheme;
    }
  } else if (festiveConfig.mode === 'always') {
    isFestiveActive = true;
    activeTheme = festiveConfig.theme || 'holi';
  } else if (festiveConfig.mode === 'disabled') {
    isFestiveActive = false;
  } else if (festiveConfig.mode === 'auto') {
    isFestiveActive = isSeasonalActive;
    activeTheme = detectedTheme;
  }

  const intensity = festiveConfig.intensity || 0.72;
  document.documentElement.style.setProperty('--festive-intensity', intensity);

  // Clean previous theme classes
  ['theme-festive-active', 'theme-holi', 'theme-christmas', 'theme-cherry-blossom', 'theme-eid', 'theme-festival']
    .forEach(cls => {
      document.documentElement.classList.remove(cls);
      document.body.classList.remove(cls);
    });

  // Remove any obsolete legacy floating pill
  const oldPill = document.getElementById('holiPillToggle');
  if (oldPill) oldPill.remove();

  if (!isFestiveActive) {
    document.querySelectorAll('.festive-bg-layer, .holi-splatter-bg').forEach(el => el.remove());
    return;
  }

  // Activate theme classes
  document.documentElement.classList.add('theme-festive-active', `theme-${activeTheme}`);
  document.body.classList.add('theme-festive-active', `theme-${activeTheme}`);

  injectFestiveElements(activeTheme);

  function injectFestiveElements(theme) {
    const sections = [
      { sel: '.mockup-hero-section', variant: 1 },
      { sel: '.mockup-editorial-section', variant: 2 },
      { sel: '.mockup-divisions-section', variant: 3 },
      { sel: '.mockup-cohort-section', variant: 2 },
      { sel: '.mockup-repo-section', variant: 1 },
      { sel: '.mockup-institute-section', variant: 3 },
      // Inner page sections
      { sel: '.mockup-page-hero', variant: 1 },
      { sel: '.mockup-page-content', variant: 2 },
      { sel: '.research-layout', variant: 2 },
      { sel: '.blog-layout', variant: 2 },
      { sel: '.contact-section', variant: 3 }
    ];

    sections.forEach(s => {
      const el = document.querySelector(s.sel);
      if (el && !el.querySelector('.festive-bg-layer')) {
        const layer = createFestiveLayer(theme, s.variant);
        el.prepend(layer);
      }
    });

    // Ambient background layer for continuous festive atmosphere across all pages
    if (!document.getElementById('globalFestiveBgLayer')) {
      const globalLayer = createFestiveLayer(theme, 1);
      globalLayer.id = 'globalFestiveBgLayer';
      globalLayer.className = 'festive-global-bg-layer';
      document.body.prepend(globalLayer);
    }
  }

  function createFestiveLayer(theme, variant) {
    const layer = document.createElement('div');
    layer.className = 'festive-bg-layer';
    layer.setAttribute('aria-hidden', 'true');

    if (theme === 'holi') {
      layer.innerHTML = buildHoliSplattersHtml(variant);
    } else if (theme === 'christmas') {
      layer.innerHTML = buildChristmasSnowHtml();
    } else if (theme === 'cherry-blossom') {
      layer.innerHTML = buildCherryBlossomHtml();
    } else if (theme === 'eid') {
      layer.innerHTML = buildEidHtml(variant);
    } else {
      layer.innerHTML = buildFestivalConfettiHtml();
    }
    return layer;
  }

  function buildHoliSplattersHtml(variant) {
    const defs = `
      <svg width="0" height="0" style="position:absolute; width:0; height:0;">
        <defs>
          <linearGradient id="holiGradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#9333ea" /><stop offset="100%" stop-color="#6366f1" />
          </linearGradient>
          <linearGradient id="holiGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00f2fe" /><stop offset="100%" stop-color="#06b6d4" />
          </linearGradient>
          <linearGradient id="holiGradPink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff2a85" /><stop offset="100%" stop-color="#ec4899" />
          </linearGradient>
          <linearGradient id="holiGradLime" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#10b981" /><stop offset="100%" stop-color="#84cc16" />
          </linearGradient>
          <linearGradient id="holiGradAmber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fbbf24" /><stop offset="100%" stop-color="#f59e0b" />
          </linearGradient>
          <linearGradient id="holiGradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2563eb" /><stop offset="100%" stop-color="#38bdf8" />
          </linearGradient>
          <linearGradient id="holiGradOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff6b35" /><stop offset="100%" stop-color="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
    `;

    if (variant === 1) {
      return defs + `
        <div class="holi-blob holi-blob-top-left">
          <svg viewBox="0 0 500 500" fill="none"><path d="M380,140 C430,190 480,260 450,330 C420,400 340,460 270,480 C200,500 130,470 90,410 C50,350 30,270 70,200 C110,130 190,80 280,70 C330,65 350,90 380,140 Z" fill="url(#holiGradPurple)" fill-opacity="0.85"/><circle cx="110" cy="110" r="14" fill="url(#holiGradPurple)"/><circle cx="440" cy="150" r="18" fill="url(#holiGradPurple)"/><circle cx="470" cy="420" r="12" fill="url(#holiGradPurple)"/></svg>
        </div>
        <div class="holi-blob holi-blob-mid-right">
          <svg viewBox="0 0 500 500" fill="none"><path d="M360,120 C420,180 470,270 440,340 C410,410 320,450 250,470 C180,490 120,440 80,380 C40,320 50,230 90,170 C130,110 210,60 290,70 C330,75 340,90 360,120 Z" fill="url(#holiGradCyan)" fill-opacity="0.85"/><circle cx="430" cy="110" r="15" fill="url(#holiGradCyan)"/><circle cx="120" cy="90" r="11" fill="url(#holiGradCyan)"/><circle cx="460" cy="440" r="16" fill="url(#holiGradCyan)"/></svg>
        </div>
      `;
    } else if (variant === 2) {
      return defs + `
        <div class="holi-blob holi-blob-bottom-left">
          <svg viewBox="0 0 500 500" fill="none"><path d="M390,150 C450,220 440,310 400,380 C360,450 280,490 200,480 C120,470 60,400 50,320 C40,240 80,160 140,110 C200,60 300,70 360,100 C380,110 380,130 390,150 Z" fill="url(#holiGradPink)" fill-opacity="0.85"/><circle cx="420" cy="120" r="16" fill="url(#holiGradPink)"/><circle cx="80" cy="180" r="12" fill="url(#holiGradPink)"/><circle cx="430" cy="450" r="14" fill="url(#holiGradPink)"/></svg>
        </div>
        <div class="holi-blob holi-blob-mid-left">
          <svg viewBox="0 0 500 500" fill="none"><path d="M340,130 C410,190 460,280 430,350 C400,420 310,460 230,470 C150,480 90,420 60,350 C30,280 40,200 80,140 C120,80 200,50 270,60 C310,65 320,90 340,130 Z" fill="url(#holiGradLime)" fill-opacity="0.85"/><circle cx="430" cy="140" r="14" fill="url(#holiGradLime)"/><circle cx="100" cy="80" r="10" fill="url(#holiGradLime)"/></svg>
        </div>
        <div class="holi-blob holi-blob-bottom-right">
          <svg viewBox="0 0 500 500" fill="none"><path d="M360,140 C430,200 450,290 420,360 C390,430 310,470 230,460 C150,450 80,390 60,320 C40,250 60,170 110,120 C160,70 250,50 310,70 C340,80 350,110 360,140 Z" fill="url(#holiGradOrange)" fill-opacity="0.8"/><circle cx="440" cy="200" r="15" fill="url(#holiGradOrange)"/><circle cx="90" cy="140" r="12" fill="url(#holiGradOrange)"/></svg>
        </div>
      `;
    } else {
      return defs + `
        <div class="holi-blob holi-blob-top-left">
          <svg viewBox="0 0 500 500" fill="none"><path d="M350,120 C420,180 450,270 420,340 C390,410 310,460 230,470 C150,480 80,420 50,350 C20,280 40,190 90,130 C140,70 220,50 290,60 C320,65 340,90 350,120 Z" fill="url(#holiGradBlue)" fill-opacity="0.85"/><circle cx="430" cy="130" r="14" fill="url(#holiGradBlue)"/><circle cx="90" cy="100" r="10" fill="url(#holiGradBlue)"/></svg>
        </div>
        <div class="holi-blob holi-blob-bottom-right">
          <svg viewBox="0 0 500 500" fill="none"><path d="M380,150 C440,220 450,310 410,380 C370,450 290,480 210,470 C130,460 70,390 60,320 C50,250 80,170 130,120 C180,70 270,60 330,80 C360,90 370,120 380,150 Z" fill="url(#holiGradAmber)" fill-opacity="0.82"/><circle cx="100" cy="120" r="12" fill="url(#holiGradAmber)"/><circle cx="440" cy="180" r="15" fill="url(#holiGradAmber)"/></svg>
        </div>
      `;
    }
  }

  function buildChristmasSnowHtml() {
    let items = `
      <div class="christmas-glow-orb" style="top:-60px; right:10%; width:380px; height:380px; background:radial-gradient(circle, rgba(5,150,105,0.22) 0%, transparent 70%);"></div>
      <div class="christmas-glow-orb" style="bottom:-80px; left:5%; width:420px; height:420px; background:radial-gradient(circle, rgba(220,38,38,0.18) 0%, transparent 70%);"></div>
      <div class="christmas-glow-orb" style="top:40%; left:30%; width:300px; height:300px; background:radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%);"></div>
    `;
    const snowflakes = ['❄', '❅', '✻', '•', '❆', '❄'];
    for (let i = 0; i < 22; i++) {
      const left = Math.round(Math.random() * 96);
      const dur = (7 + Math.random() * 9).toFixed(1);
      const delay = (Math.random() * 8).toFixed(1);
      const size = (0.75 + Math.random() * 0.95).toFixed(2);
      const flake = snowflakes[i % snowflakes.length];
      items += `<span class="festive-snow-item" style="left:${left}%; font-size:${size}rem; animation-duration:${dur}s; animation-delay:${delay}s;">${flake}</span>`;
    }
    return items;
  }

  function buildCherryBlossomHtml() {
    let items = `
      <div class="christmas-glow-orb" style="top:-50px; left:10%; width:440px; height:440px; background:radial-gradient(circle, rgba(244,63,94,0.22) 0%, transparent 70%);"></div>
      <div class="christmas-glow-orb" style="bottom:-60px; right:8%; width:460px; height:460px; background:radial-gradient(circle, rgba(251,113,133,0.20) 0%, transparent 70%);"></div>
    `;
    const petals = ['🌸', '🌸', '💮'];
    for (let i = 0; i < 18; i++) {
      const left = Math.round(Math.random() * 94);
      const dur = (8 + Math.random() * 8).toFixed(1);
      const delay = (Math.random() * 7).toFixed(1);
      const size = (0.85 + Math.random() * 0.7).toFixed(2);
      const p = petals[i % petals.length];
      items += `<span class="festive-sakura-petal" style="left:${left}%; font-size:${size}rem; animation-duration:${dur}s; animation-delay:${delay}s;">${p}</span>`;
    }
    return items;
  }

  function buildEidHtml(variant) {
    let items = `
      <div class="festive-eid-crescent">🌙</div>
      <div class="christmas-glow-orb" style="top:-30px; right:15%; width:360px; height:360px; background:radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 70%);"></div>
      <div class="christmas-glow-orb" style="bottom:-40px; left:8%; width:340px; height:340px; background:radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%);"></div>
    `;
    const stars = ['✨', '⭐', '✦', '★'];
    for (let i = 0; i < 8; i++) {
      const top = Math.round(8 + (i * 11) + (Math.random() * 5));
      const left = Math.round(5 + (i * 12) + (Math.random() * 5));
      const dur = (2.2 + (i % 3) * 0.8).toFixed(1);
      const delay = (i * 0.35).toFixed(1);
      const size = (0.75 + (i % 3) * 0.25).toFixed(2);
      const s = stars[i % stars.length];
      items += `<span class="festive-star" style="top:${top}%; left:${left}%; font-size:${size}rem; animation-duration:${dur}s; animation-delay:${delay}s;">${s}</span>`;
    }
    return items;
  }

  function buildFestivalConfettiHtml() {
    let items = `
      <div class="christmas-glow-orb" style="top:10%; left:20%; width:400px; height:400px; background:radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%);"></div>
      <div class="christmas-glow-orb" style="bottom:10%; right:15%; width:420px; height:420px; background:radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%);"></div>
    `;
    const colors = ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#3b82f6', '#f43f5e'];
    for (let i = 0; i < 28; i++) {
      const left = Math.round(Math.random() * 95);
      const dur = (5 + Math.random() * 7).toFixed(1);
      const delay = (Math.random() * 6).toFixed(1);
      const w = Math.round(8 + Math.random() * 10);
      const h = Math.round(12 + Math.random() * 12);
      const col = colors[i % colors.length];
      const rad = Math.random() > 0.5 ? '2px' : '50%';
      items += `<div class="festive-confetti-piece" style="left:${left}%; width:${w}px; height:${h}px; background:${col}; border-radius:${rad}; animation-duration:${dur}s; animation-delay:${delay}s;"></div>`;
    }
    return items;
  }
}

// 1. Theme Engine (Default: Light Mode)
function initThemeEngine() {
  const savedTheme = localStorage.getItem('crii_theme_mode') || 'light';
  applyTheme(savedTheme);

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = current === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('crii_theme_mode', theme);
}

// 2. Dynamic Branding & Navbar Title
function initBrandingAndNavbar() {
  if (!window.CRII_API) return;
  const instituteTitle = window.CRII_API.getInstituteName();
  const logoUrl = window.CRII_API.getInstituteLogo() || "assets/curiomas-no-bg.png";

  document.querySelectorAll('.brand-title').forEach(el => {
    el.innerText = instituteTitle;
  });

  if (logoUrl) {
    document.querySelectorAll('.brand-logo-container').forEach(container => {
      container.innerHTML = `<img src="${logoUrl}" alt="CRII Logo" class="brand-logo-img" style="width:36px; height:36px; object-fit:contain;">`;
    });
  }
}

// 3. Custom Scientific Interactive Cursor (Cursoji Distorted Face)
function initCustomCursor() {
  // Remove any legacy dot/ring cursor elements if present
  document.querySelectorAll('.custom-cursor-dot, .custom-cursor-ring').forEach(el => el.remove());
}

// 4. Cookie Consent Banner
function initCookieConsent() {
  const consented = localStorage.getItem('crii_cookie_consent_v1');
  if (consented) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-text">
      We use strictly essential local cookies and session storage to verify research access and provide reproducible data methods.
    </div>
    <div class="cookie-actions">
      <button id="acceptCookiesBtn" class="btn btn-primary btn-sm">Accept All</button>
      <button id="closeCookiesBtn" class="btn btn-secondary btn-sm">Dismiss</button>
    </div>
  `;

  document.body.appendChild(banner);
  setTimeout(() => banner.classList.add('show'), 600);

  const acceptBtn = banner.querySelector('#acceptCookiesBtn');
  const closeBtn = banner.querySelector('#closeCookiesBtn');

  const dismiss = () => {
    localStorage.setItem('crii_cookie_consent_v1', 'accepted');
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 400);
  };

  if (acceptBtn) acceptBtn.addEventListener('click', dismiss);
  if (closeBtn) closeBtn.addEventListener('click', dismiss);
}

// 5. Mobile Navigation
function initMobileNav() {
  const toggleBtn = document.getElementById('menuToggleBtn') || document.querySelector('.menu-toggle');
  const navMenu = document.getElementById('mainNavMenu') || document.querySelector('.mockup-nav-links');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const willShow = !navMenu.classList.contains('show');
    navMenu.classList.toggle('show', willShow);
    toggleBtn.setAttribute('aria-expanded', String(willShow));
  });

  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('show');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('show');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// 5b. Auto-hiding Navbar on Scroll Down, Re-appearing on Scroll Up
function initAutoHidingNavbar() {
  const navWrapper = document.querySelector('.mockup-nav-wrapper');
  if (!navWrapper) return;

  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  let ticking = false;
  const delta = 6;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollY > 15) {
          navWrapper.classList.add('nav-scrolled');
        } else {
          navWrapper.classList.remove('nav-scrolled');
        }

        if (currentScrollY <= 40) {
          navWrapper.classList.remove('nav-hidden');
        } else if (currentScrollY > lastScrollY + delta) {
          // Scrolling down -> hide navbar
          navWrapper.classList.add('nav-hidden');
          const navMenu = document.getElementById('mainNavMenu');
          if (navMenu) navMenu.classList.remove('show');
          const langMenu = document.getElementById('navLangMenu');
          if (langMenu) langMenu.classList.remove('show');
        } else if (currentScrollY < lastScrollY - delta) {
          // Scrolling up -> reappear smoothly
          navWrapper.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// 6. User Session State in Navbar
function initUserSessionState() {
  const user = window.CRII_API ? window.CRII_API.getCurrentUser() : null;
  const loginBtns = document.querySelectorAll('.nav-login-btn, .nav-portal-btn, .mobile-login-link');

  if (loginBtns.length && user) {
    loginBtns.forEach(btn => {
      const firstName = (user.name || 'User').split(' ')[0];
      btn.innerHTML = `
        <span style="display:inline-flex; align-items:center; gap:0.4rem;">
          <span style="width:6px; height:6px; background:#10b981; border-radius:50%; box-shadow:0 0 6px #10b981;"></span>
          ${firstName.toUpperCase()}
        </span>
      `;
      btn.href = "/portal";
      btn.title = `Signed in as ${user.name} (${user.role || 'Member'})`;
    });
  }
}

// 6b. Google Translate & Language Selector (Persisted in localStorage)
const CRII_LANG_CONFIG = {
  'en': { name: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
  'bn': { name: 'বাংলা', flag: 'https://flagcdn.com/w40/bd.png' }
};

function initGoogleTranslateAndLang() {
  const langKey = 'crii_site_language';
  const savedLang = localStorage.getItem(langKey) || 'en';

  function setTranslateCookie(lang) {
    const val = (lang && lang !== 'en') ? `/en/${lang}` : '';
    const host = window.location.hostname;
    const expires = (lang === 'en' || !lang) ? 'expires=Thu, 01 Jan 1970 00:00:00 UTC;' : 'max-age=31536000;';

    document.cookie = `googtrans=${val}; path=/; ${expires}`;
    if (host) {
      document.cookie = `googtrans=${val}; path=/; domain=${host}; ${expires}`;
      const parts = host.split('.');
      if (parts.length > 2) {
        document.cookie = `googtrans=${val}; path=/; domain=.${parts.slice(-2).join('.')}; ${expires}`;
      }
    }
  }

  function updateLangUI(lang) {
    const labelEl = document.getElementById('navLangLabel');
    const flagEl = document.getElementById('navLangFlagImg');
    const info = CRII_LANG_CONFIG[lang] || CRII_LANG_CONFIG['en'];

    if (labelEl) {
      labelEl.textContent = info.name;
    }
    if (flagEl) {
      flagEl.src = info.flag;
      flagEl.alt = info.name;
    }
    document.querySelectorAll('.nav-lang-opt').forEach(opt => {
      if (opt.getAttribute('data-lang') === lang) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });
  }

  // Pre-sync cookie if user previously picked a language
  if (savedLang !== 'en') {
    setTranslateCookie(savedLang);
  }
  updateLangUI(savedLang);

  // Dropdown UI toggle
  const langBtn = document.getElementById('navLangBtn');
  const langMenu = document.getElementById('navLangMenu');

  if (langBtn && langMenu) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langMenu.classList.contains('show');
      langMenu.classList.toggle('show', !isOpen);
      langBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!langMenu.contains(e.target) && !langBtn.contains(e.target)) {
        langMenu.classList.remove('show');
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Selecting a language option
    langMenu.querySelectorAll('.nav-lang-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        const targetLang = opt.getAttribute('data-lang') || 'en';
        const currentLang = localStorage.getItem(langKey) || 'en';
        if (targetLang === currentLang) {
          langMenu.classList.remove('show');
          return;
        }

        localStorage.setItem(langKey, targetLang);
        setTranslateCookie(targetLang);
        updateLangUI(targetLang);
        langMenu.classList.remove('show');
        langBtn.setAttribute('aria-expanded', 'false');

        // Trigger Google Translate engine combo if present
        const combo = document.querySelector('.goog-te-combo');
        if (combo) {
          combo.value = targetLang;
          combo.dispatchEvent(new Event('change'));
        }
        
        // Reload page to let Google Translate cleanly render the target language
        setTimeout(() => {
          window.location.reload();
        }, 120);
      });
    });
  }

  // Global Google Translate init callback
  window.googleTranslateElementInit = function() {
    try {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,bn',
        autoDisplay: false
      }, 'google_translate_element');
    } catch (err) {
      console.warn('Google Translate init deferred:', err);
    }
  };

  // Load Google Translate script if not present
  if (!document.getElementById('google-translate-api-script')) {
    const s = document.createElement('script');
    s.id = 'google-translate-api-script';
    s.type = 'text/javascript';
    s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.head.appendChild(s);
  }
}

// 6c. Search Modal Overlay (Posts & Dispatches)
function initSearchOverlay() {
  const triggers = document.querySelectorAll('#navSearchTrigger, #mobileSearchTrigger, .nav-search-trigger');
  const overlay = document.getElementById('criiSearchOverlay');
  const backdrop = document.getElementById('criiSearchBackdrop');
  const escBtn = document.getElementById('criiSearchEsc');
  const input = document.getElementById('siteSearchInput');
  const resultsContainer = document.getElementById('criiSearchResults');
  const quickTagsContainer = document.getElementById('criiSearchQuickTags');

  if (!overlay || !input) return;

  function openSearch() {
    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
    input.value = '';
    renderSearchResults('');
    setTimeout(() => input.focus(), 60);
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  triggers.forEach(t => {
    t.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });
  });

  if (backdrop) backdrop.addEventListener('click', closeSearch);
  if (escBtn) escBtn.addEventListener('click', closeSearch);

  // Quick Tags Click
  if (quickTagsContainer) {
    quickTagsContainer.querySelectorAll('.quick-tag-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const q = btn.getAttribute('data-query') || btn.innerText.trim();
        input.value = q;
        input.focus();
        renderSearchResults(q);
      });
    });
  }

  // Keyboard navigation: Ctrl+K / Cmd+K opens, Escape closes
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (overlay.style.display === 'flex') {
        closeSearch();
      } else {
        openSearch();
      }
    } else if (e.key === 'Escape' && overlay.style.display === 'flex') {
      closeSearch();
    }
  });

  // Search input typing
  let searchDebounce = null;
  input.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      renderSearchResults(input.value.trim());
    }, 120);
  });

  async function renderSearchResults(query) {
    if (!resultsContainer) return;

    if (!query) {
      resultsContainer.innerHTML = `
        <div class="crii-search-empty">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" style="margin-bottom:0.75rem; color:#38bdf8; opacity:0.8;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <p style="margin:0 0 0.4rem; font-weight:600; color:#f1f5f9;">Search the CRII Open Knowledge Base</p>
          <span style="font-size:0.84rem; color:#94a3b8;">Type keywords or click one of the suggested topics above.</span>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div class="crii-search-empty">
        <span class="crii-search-spinner"></span>
        <p style="margin-top:0.6rem; color:#94a3b8;">Searching publications & dispatches...</p>
      </div>
    `;

    let posts = [];
    if (window.CRII_API && typeof window.CRII_API.getPosts === 'function') {
      try {
        posts = await window.CRII_API.getPosts();
      } catch (e) {
        posts = [];
      }
    }

    const q = query.toLowerCase();
    const matched = posts.filter(p => {
      const title = (p.title || '').toLowerCase();
      const excerpt = (p.excerpt || p.abstract || '').toLowerCase();
      const division = (p.division || '').toLowerCase();
      const author = (p.author || (Array.isArray(p.authors) ? p.authors.join(' ') : '')).toLowerCase();
      const tags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';
      return title.includes(q) || excerpt.includes(q) || division.includes(q) || author.includes(q) || tags.includes(q);
    });

    if (matched.length === 0) {
      resultsContainer.innerHTML = `
        <div class="crii-search-empty">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" style="margin-bottom:0.5rem; color:#64748b;"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          <p style="margin:0 0 0.35rem; color:#e2e8f0; font-weight:600;">No matching publications found</p>
          <span style="font-size:0.84rem; color:#64748b;">No results found for "<strong>${escapeHtmlApp(query)}</strong>". Try broader keywords.</span>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = matched.slice(0, 8).map(post => {
      const postUrl = `/article?id=${encodeURIComponent(post.id)}`;
      const division = post.division || 'Research';
      const author = post.author || (Array.isArray(post.authors) && post.authors[0]) || 'CRII Research Core';
      const excerpt = post.excerpt || post.abstract || 'Explore the complete research dispatch, datasets, and code.';
      return `
        <a href="${postUrl}" class="crii-search-result-item">
          <div class="crii-search-result-top">
            <span class="crii-search-result-badge">${escapeHtmlApp(division)}</span>
            <span class="crii-search-result-meta">${escapeHtmlApp(author)}</span>
          </div>
          <h4 class="crii-search-result-title">${escapeHtmlApp(post.title)}</h4>
          <p class="crii-search-result-snippet">${escapeHtmlApp(excerpt)}</p>
        </a>
      `;
    }).join('');
  }

  function escapeHtmlApp(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

// 7. Global Toasts
function initToastContainer() {
  if (!document.querySelector('.toast-container')) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

window.showToast = function (message, type = 'info', duration = 3600) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    initToastContainer();
    container = document.querySelector('.toast-container');
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

window.copyToClipboard = async function (text, successMsg = 'Copied to clipboard!') {
  try {
    await navigator.clipboard.writeText(text);
    window.showToast(successMsg, 'success');
  } catch (err) {
    window.showToast('Failed to copy', 'error');
  }
};

function formatEditorialDate(dateStr) {
  if (!dateStr) return '04 November 2026';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch (e) {
    return dateStr;
  }
}

function formatEditorialReadTime(readingTime) {
  if (!readingTime) return '5 minutes';
  const digits = String(readingTime).match(/\d+/);
  if (digits) {
    const num = parseInt(digits[0], 10);
    return `${num} ${num === 1 ? 'minute' : 'minutes'}`;
  }
  return readingTime;
}

function getMetaAttributionHtml(post) {
  const isEdited = Boolean(post.isEdited || (post.updatedBy && post.updatedAt));
  const editor = post.updatedBy || (post.authors && post.authors[0]) || 'CRII Researcher';
  const creator = post.createdBy || (post.authors && post.authors[0]) || 'CRII Researcher';

  if (isEdited) {
    const timeStr = formatEditorialDate(post.updatedAt || post.date);
    return `
      <div class="article-meta-attribution">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        <span>Last edited by <strong>${editor}</strong> on ${timeStr}</span>
      </div>
    `;
  } else {
    const timeStr = formatEditorialDate(post.createdAt || post.date);
    return `
      <div class="article-meta-attribution">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span>Created by <strong>${creator}</strong> on ${timeStr}</span>
      </div>
    `;
  }
}

async function initFeaturedArticles() {
  const container = document.getElementById('fromTheInstituteContainer') || document.getElementById('featuredArticlesContainer');
  if (!container || !window.CRII_API) return;

  try {
    const posts = await window.CRII_API.getPosts({ preferNetwork: true });
    const published = (posts || []).filter(p => p.published !== false && !p.id.startsWith('crii-paper-2026-00'));

    if (published.length === 0) {
      container.innerHTML = `
        <div class="editorial-empty-notice" style="text-align:center; padding:3.5rem 1.5rem; background:rgba(0,0,0,0.02); border-radius:14px; border:1px dashed #d5cebf; color:#78716c;">
          <p style="font-size:1.05rem; font-weight:600; color:#44403c; margin-bottom:0.4rem;">No publications currently published</p>
          <p style="font-size:0.88rem; color:#78716c; margin:0;">New peer-reviewed articles, synthetic spectra, and research dispatches will appear here once released by the institute.</p>
        </div>
      `;
      return;
    }

    const fallbackCovers = [
      'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80'
    ];

    // Priority: An article marked featured: true, or the most recent published article
    const featuredPost = published.find(p => p.featured === true) || published[0];
    const subPosts = published.filter(p => p.id !== featuredPost.id).slice(0, 3);

    const featuredCover = featuredPost.coverImage || fallbackCovers[0];
    const featuredCategory = (featuredPost.category || featuredPost.division || 'FEATURED RESEARCH').toUpperCase();

    // Render Featured Large Card
    let featureCardHtml = `
      <div class="editorial-feature-card">
        <div class="feature-card-media">
          <img src="${featuredCover}" alt="${featuredPost.title}" loading="lazy">
        </div>
        <div class="feature-card-body">
          <h3 class="feature-card-title">
            <a href="/article?id=${encodeURIComponent(featuredPost.id)}" style="color:inherit; text-decoration:none;">${featuredPost.title}</a>
          </h3>
          <p class="feature-card-desc">
            ${featuredPost.summary || featuredPost.abstract || featuredPost.excerpt || ''}
          </p>
          <a href="/article?id=${encodeURIComponent(featuredPost.id)}" class="mockup-arrow-link" style="margin-bottom:0.75rem;">
            <span>Read full publication</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
          </a>
          ${getMetaAttributionHtml(featuredPost)}
        </div>
      </div>
    `;

    // Render Sub-Cards ONLY for actual published articles (no hardcoded fallbacks)
    let subCardsHtml = '';
    if (subPosts.length > 0) {
      for (let i = 0; i < subPosts.length; i++) {
        const p = subPosts[i];
        const pCover = p.coverImage || fallbackCovers[(i + 1) % fallbackCovers.length];
        const pCategory = (p.category || p.division || 'RESEARCH').toUpperCase();
        subCardsHtml += `
          <div class="editorial-sub-card">
            <div class="sub-card-media">
              <img src="${pCover}" alt="${p.title}" loading="lazy">
            </div>
            <div class="sub-card-body">
              <h4 class="sub-card-title">
                <a href="/article?id=${encodeURIComponent(p.id)}" style="color:inherit; text-decoration:none;">${p.title}</a>
              </h4>
              <p class="sub-card-desc">${p.summary || p.abstract || p.excerpt || ''}</p>
              <a href="/article?id=${encodeURIComponent(p.id)}" class="mockup-arrow-link">
                <span>Read dispatch</span>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
              ${getMetaAttributionHtml(p)}
            </div>
          </div>
        `;
      }
    }

    container.innerHTML = `
      ${featureCardHtml}
      ${subCardsHtml ? `<div class="editorial-sub-grid">${subCardsHtml}</div>` : ''}
    `;
  } catch (e) {
    console.warn('Featured articles render error:', e);
  }
}

async function initHomeTeam() {
  const container = document.getElementById('homeTeamContainer');
  if (!container || !window.CRII_API) return;

  try {
    const data = await window.CRII_API.getInternsData();
    let members = (data && data.activeInterns) ? data.activeInterns : [];

    // Filter out dummy test members if lingering in legacy local storage
    const dummyIds = ['team-002', 'team-003', 'int-001', 'int-002', 'crii-int-002', 'crii-int-003', 'crii-int-004'];
    members = members.filter(m => m.status === 'Active' && !dummyIds.includes(m.id));

    // Sort by priority: Core leadership (isTeamMember) first, then orderIndex ascending, then name
    members.sort((a, b) => {
      const teamA = a.isTeamMember ? 1 : 0;
      const teamB = b.isTeamMember ? 1 : 0;
      if (teamA !== teamB) return teamB - teamA;
      const orderA = a.orderIndex !== undefined ? Number(a.orderIndex) : 999;
      const orderB = b.orderIndex !== undefined ? Number(b.orderIndex) : 999;
      if (orderA !== orderB) return orderA - orderB;
      return (a.name || '').localeCompare(b.name || '');
    });

    // Top 3 priority people only on index
    const top3 = members.slice(0, 3);

    if (top3.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--bg-surface); border-radius: 16px; border: 1px dashed var(--border-color);">
          <p style="color: var(--text-muted);">Leadership council roster initializing.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = top3.map(member => {
      const avatarUrl = member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
      const badgeText = member.isTeamMember ? '★ Executive Council' : '★ Research Fellow';
      return `
        <div class="card">
          <div style="display:flex; align-items:center; gap:1.15rem; margin-bottom:1.15rem;">
            <img src="${avatarUrl}" alt="${member.name}" style="width:58px; height:58px; border-radius:50%; object-fit:cover; border:2px solid var(--accent-primary);">
            <div>
              <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:0.15rem;">${member.name}</h3>
              <div style="font-size:0.84rem; color:var(--accent-primary); font-weight:600;">${member.role || 'Principal Investigator'}</div>
              <div style="font-size:0.78rem; color:var(--text-muted);">${member.division || 'Executive Council'}</div>
            </div>
          </div>
          <p class="card-desc" style="font-size:0.9rem; line-height:1.6; margin-bottom:1.25rem;">
            ${member.bio || 'Leading open computational research and multi-disciplinary student discovery.'}
          </p>
          <div class="card-footer" style="padding-top:0.75rem; border-top:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
            <span class="badge-core-team">${badgeText}</span>
            <a href="/team" class="btn btn-glass btn-sm">Full Team →</a>
          </div>
        </div>
      `;
    }).join('');
  } catch (e) {
    console.warn('Failed to load home team:', e);
  }
}


async function initDivisions() {
  const container = document.getElementById('homeDivisionsContainer') || document.querySelector('.divisions-cards-grid');
  if (!container || !window.CRII_API) return;

  try {
    const divisions = await window.CRII_API.getDivisions();
    if (divisions && Array.isArray(divisions) && divisions.length > 0) {
      container.innerHTML = divisions.map(div => `
        <a href="${div.link || '/research'}" class="division-card">
          <div class="division-card-media">
            <img src="${div.image || 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=800&q=80'}" alt="${div.title}" loading="lazy">
          </div>
          <div class="division-card-tag">
            <span>${div.tag || (div.number ? div.number + ' / RESEARCH DIVISION' : 'RESEARCH DIVISION')}</span>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
          </div>
          <h3 class="division-card-title">${div.title}</h3>
          <p class="division-card-desc">${div.desc || ''}</p>
        </a>
      `).join('');
      if (window.refreshScrollAnimations) window.refreshScrollAnimations();
    } else {
      container.innerHTML = '';
      const section = container.closest('.divisions-section') || container.closest('section');
      if (section) section.style.display = 'none';
    }
  } catch (e) {
    console.warn('initDivisions error:', e);
  }
}

async function initCohorts() {
  const container = document.getElementById('cohortCardsContainer');
  if (!container || !window.CRII_API) return;

  try {
    const cohorts = await window.CRII_API.getCohorts();
    if (cohorts && Array.isArray(cohorts) && cohorts.length > 0) {
      container.innerHTML = cohorts.map(c => `
        <div class="cohort-card">
          <div class="cohort-card-media">
            <img src="${c.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'}" alt="${c.title}" loading="lazy">
          </div>
          <div class="cohort-card-body">
            <h3 class="cohort-card-title">${c.title}</h3>
            <p class="cohort-card-desc">${c.desc || ''}</p>
            <a href="${c.link || '/team#apply'}" class="cohort-card-link">
              <span>${c.linkText || 'Apply as Fellow'}</span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </a>
          </div>
        </div>
      `).join('');
      if (window.refreshScrollAnimations) window.refreshScrollAnimations();
    } else {
      container.innerHTML = `
        <div class="cohort-empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; background: rgba(0, 0, 0, 0.02); border-radius: 12px; border: 1px dashed #d5cebf; color: #78716c;">
          <p style="font-size: 1.05rem; font-weight: 600; color: #44403c; margin-bottom: 0.4rem;">Admissions Open Globally</p>
          <p style="font-size: 0.88rem; color: #78716c; margin: 0;">We welcome self-directed researchers, university students, and fellows. Specific cohort profiles can be configured by institute administrators.</p>
        </div>
      `;
    }
  } catch (e) {
    console.warn('initCohorts error:', e);
  }
}
