document.addEventListener(`DOMContentLoaded`,()=>{let t=(e,t)=>{try{e()}catch(e){console.error(`[CRII Core] Error initializing ${t}:`,e)}};t(a,`initThemeEngine`),t(s,`initBrandingAndNavbar`),t(e,`initHeroCustomization`),t(r,`initScrollRevealEffects`),t(i,`initFestiveSeasonalTheme`),t(c,`initCustomCursor`),t(l,`initCookieConsent`),t(u,`initMobileNav`),t(d,`initAutoHidingNavbar`),t(f,`initUserSessionState`),t(g,`initToastContainer`),t(y,`initFeaturedArticles`),t(x,`initDivisions`),t(S,`initCohorts`),t(b,`initHomeTeam`),t(m,`initGoogleTranslateAndLang`),t(h,`initSearchOverlay`)});function e(){if(!window.CRII_API)return;let e=window.CRII_API.getHeroSettings();if(!e)return;let n=e.mediaType||`both`,r=e.selectionMode||`random`,i=document.getElementById(`heroBgImageLayer`),a=document.getElementById(`heroVideo`),o=[`https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=85`,`https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=85`,`https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1920&q=85`,`https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=85`,`https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=85`],s=[`assets/hero-bg.mp4`,`https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4`,`https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-starfield-in-space-41539-large.mp4`,`https://assets.mixkit.co/videos/preview/mixkit-planet-earth-rotating-in-space-39982-large.mp4`],c=Array.isArray(e.backgroundImages)&&e.backgroundImages.length>0?e.backgroundImages:o,l=Array.isArray(e.backgroundVideos)&&e.backgroundVideos.length>0?e.backgroundVideos:e.videoUrl?[e.videoUrl,...s.slice(1)]:s,u=c[0];u=r===`random`?c[Math.floor(Math.random()*c.length)]:c[Math.max(0,Math.min(Number(e.fixedImageIndex)||0,c.length-1))]||c[0];let d=l[0];d=r===`random`?l[Math.floor(Math.random()*l.length)]:l[Math.max(0,Math.min(Number(e.fixedVideoIndex)||0,l.length-1))]||l[0];let f=e.imageOpacity===void 0?.4:e.imageOpacity;if(i&&(i.style.backgroundImage=`url('${u}')`,i.style.backgroundSize=`cover`,i.style.backgroundPosition=`center`,i.style.transition=`opacity 0.8s ease`),n===`image`)a&&(a.pause(),a.style.display=`none`,a.style.opacity=`0`),i&&(i.style.display=`block`,i.style.opacity=String(f));else if(n===`video`){if(i&&(i.style.display=`block`,i.style.opacity=String(f)),a){a.style.display=`block`,a.style.opacity=`0`,a.style.transition=`opacity 0.8s ease`,(a.querySelector(`source`)?.getAttribute(`src`)||a.src)!==d&&(a.innerHTML=`<source src="${d}" type="video/mp4">`,a.load());let e=!1,t=()=>{e||(e=!0,a.style.opacity=`0.70`,i&&(i.style.opacity=`0`,setTimeout(()=>{i.style.opacity===`0`&&(i.style.display=`none`)},850)))};a.onplaying=t,a.addEventListener(`playing`,t,{once:!0}),a.onerror=()=>{i&&(i.style.display=`block`,i.style.opacity=String(f)),a.style.display=`none`};let n=a.play();n!==void 0&&n.catch(()=>{i&&(i.style.display=`block`,i.style.opacity=String(f))})}}else r===`random`?Math.random()<.5&&a?(i&&(i.style.display=`block`,i.style.opacity=String(f)),a.style.display=`block`,a.style.opacity=`0`,a.style.transition=`opacity 0.8s ease`,(a.querySelector(`source`)?.getAttribute(`src`)||a.src)!==d&&(a.innerHTML=`<source src="${d}" type="video/mp4">`,a.load()),a.onplaying=()=>{a.style.opacity=`0.70`,i&&(i.style.opacity=`0`,setTimeout(()=>{i.style.opacity===`0`&&(i.style.display=`none`)},850))},a.play().catch(()=>{i&&(i.style.display=`block`,i.style.opacity=String(f))})):(a&&(a.pause(),a.style.display=`none`),i&&(i.style.display=`block`,i.style.opacity=String(f))):(i&&(i.style.display=`block`,i.style.opacity=`0.20`),a&&(a.style.display=`block`,a.style.opacity=`0.65`,(a.querySelector(`source`)?.getAttribute(`src`)||a.src)!==d&&(a.innerHTML=`<source src="${d}" type="video/mp4">`,a.load()),a.play().catch(()=>{})));if(a&&a.style.display!==`none`)t(a,e);else{let e=document.getElementById(`heroSoundToggle`);e&&(e.style.display=`none`)}let p=document.querySelector(`.mockup-hero-title`);if(p&&e.fontFamily){let t={Eyekons:`'Eyekons', Georgia, serif`,"Playfair Display":`'Playfair Display', Georgia, serif`,"Cinzel Decorative":`'Cinzel Decorative', 'Cinzel', Georgia, serif`,"Space Grotesk":`'Space Grotesk', -apple-system, sans-serif`,Syne:`'Syne', -apple-system, sans-serif`,Outfit:`'Outfit', -apple-system, sans-serif`,"system-ui":`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`}[e.fontFamily]||e.fontFamily;p.style.setProperty(`font-family`,t,`important`)}let m=e.blurPx===void 0?12:e.blurPx,h=e.overlayOpacity===void 0?.55:e.overlayOpacity;document.documentElement.style.setProperty(`--hero-blur`,`${m}px`),document.documentElement.style.setProperty(`--hero-overlay-bg`,`rgba(10, 15, 30, ${h})`);let g=document.querySelectorAll(`.mockup-page-hero`);g&&g.length>0&&g.forEach(e=>{let t=e.querySelector(`.mockup-page-hero-bg-layer`);!t&&typeof document.createElement==`function`&&(t=document.createElement(`div`),t.className=`mockup-page-hero-bg-layer`,e.prepend?e.prepend(t):e.insertBefore&&e.firstChild?e.insertBefore(t,e.firstChild):e.appendChild&&e.appendChild(t));let n=e.querySelector(`.mockup-page-hero-bg-overlay`);if(!n&&typeof document.createElement==`function`&&(n=document.createElement(`div`),n.className=`mockup-page-hero-bg-overlay`,t&&t.insertAdjacentElement?t.insertAdjacentElement(`afterend`,n):e.appendChild&&e.appendChild(n)),t&&t.style){let e=c[Math.floor(Math.random()*c.length)];t.style.backgroundImage=`url('${e}')`,t.style.opacity=String(f||.38)}})}function t(e,t){if(!e)return;let n=document.getElementById(`heroSoundToggle`),r=document.getElementById(`heroSoundIcon`);function i(e){n&&(e?(n.classList.remove(`is-muted`),n.classList.add(`is-playing`),n.setAttribute(`title`,`Mute Sound`),n.setAttribute(`aria-label`,`Mute Sound`),r&&(r.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`)):(n.classList.remove(`is-playing`),n.classList.add(`is-muted`),n.setAttribute(`title`,`Unmute Sound`),n.setAttribute(`aria-label`,`Unmute Sound`),r&&(r.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`)))}let a=localStorage.getItem(`crii_hero_sound_muted`)===`1`;if(n&&(n.style.display=`inline-flex`,i(!a),n.onclick=t=>{t.preventDefault(),t.stopPropagation(),!e.muted&&e.volume>0?(e.muted=!0,localStorage.setItem(`crii_hero_sound_muted`,`1`),i(!1)):(e.muted=!1,e.volume=.85,e.play().catch(()=>{}),localStorage.removeItem(`crii_hero_sound_muted`),i(!0))}),a)e.muted=!0,i(!1);else{e.muted=!1,e.volume=.85;let t=e.play();t!==void 0&&t.then(()=>{i(!0)}).catch(()=>{e.muted=!0,e.play().catch(()=>{}),i(!0);let t=()=>{e&&localStorage.getItem(`crii_hero_sound_muted`)!==`1`&&(e.muted=!1,e.volume=.85,e.play().catch(()=>{}),i(!0)),[`click`,`pointerdown`,`keydown`,`scroll`,`touchstart`].forEach(e=>{window.removeEventListener(e,t,{capture:!0})})};[`click`,`pointerdown`,`keydown`,`scroll`,`touchstart`].forEach(e=>{window.addEventListener(e,t,{capture:!0,once:!0})})})}}var n=null;function r(){if(window.matchMedia(`(prefers-reduced-motion: reduce)`).matches){document.querySelectorAll(`.scroll-reveal, .scroll-reveal-scale, .scroll-reveal-left, .scroll-reveal-right`).forEach(e=>e.classList.add(`is-revealed`));return}let e=[`.mockup-section-header`,`.divisions-header`,`.cohort-header`,`.editorial-header`,`.editorial-spotlight-card`,`.editorial-post-card`,`.division-card`,`.cohort-card`,`.feature-card`,`.repo-card`,`.mockup-mentor-card`,`.mockup-stats-grid > *`,`.lead-copy`,`.mockup-cta-card`,`.footer-top-grid > *`];function t(){e.forEach(e=>{document.querySelectorAll(e).forEach(e=>{if(!e.classList.contains(`scroll-reveal`)&&!e.classList.contains(`scroll-reveal-scale`)){e.classList.add(`scroll-reveal`);let t=e.parentElement;if(t&&(t.classList.contains(`divisions-cards-grid`)||t.classList.contains(`cohort-cards-grid`)||t.classList.contains(`editorial-posts-grid`)||t.classList.contains(`mockup-stats-grid`))){let n=Array.from(t.children).indexOf(e);e.style.transitionDelay=`${Math.min(n*.1,.4)}s`}}})}),n||=new IntersectionObserver((e,t)=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add(`is-revealed`),t.unobserve(e.target))})},{root:null,rootMargin:`0px 0px -40px 0px`,threshold:.12}),document.querySelectorAll(`.scroll-reveal:not(.is-revealed), .scroll-reveal-scale:not(.is-revealed), .scroll-reveal-left:not(.is-revealed), .scroll-reveal-right:not(.is-revealed)`).forEach(e=>n.observe(e))}t(),window.refreshScrollAnimations=t}function i(){let e=(window.location.pathname||``).toLowerCase();if(e.includes(`portal`)||e.includes(`login`)||document.body.classList.contains(`portal-body`)||document.querySelector(`.portal-sidebar`))return;let t=window.CRII_API&&window.CRII_API.getFestiveSettings?window.CRII_API.getFestiveSettings():{mode:`always`,theme:`holi`,intensity:.7},n=new URLSearchParams(window.location.search),r=n.get(`theme`)||n.get(`festive`),i=new Date,a=i.getMonth(),o=i.getDate(),s=`holi`,c=!1;a===11||a===0&&o<=10?(s=`christmas`,c=!0):a===1&&o>=15||a===2?(s=`holi`,c=!0):(a===3||a===4)&&(s=`cherry-blossom`,c=!0);let l=t.theme||`holi`,u=!1;r?r===`none`||r===`disabled`?u=!1:(u=!0,l=r):t.mode===`always`?(u=!0,l=t.theme||`holi`):t.mode===`disabled`?u=!1:t.mode===`auto`&&(u=c,l=s);let d=t.intensity||.72;document.documentElement.style.setProperty(`--festive-intensity`,d),[`theme-festive-active`,`theme-holi`,`theme-christmas`,`theme-cherry-blossom`,`theme-eid`,`theme-festival`].forEach(e=>{document.documentElement.classList.remove(e),document.body.classList.remove(e)});let f=document.getElementById(`holiPillToggle`);if(f&&f.remove(),!u){document.querySelectorAll(`.festive-bg-layer, .holi-splatter-bg`).forEach(e=>e.remove());return}document.documentElement.classList.add(`theme-festive-active`,`theme-${l}`),document.body.classList.add(`theme-festive-active`,`theme-${l}`),p(l);function p(e){if([{sel:`.mockup-hero-section`,variant:1},{sel:`.mockup-editorial-section`,variant:2},{sel:`.mockup-divisions-section`,variant:3},{sel:`.mockup-cohort-section`,variant:2},{sel:`.mockup-repo-section`,variant:1},{sel:`.mockup-institute-section`,variant:3},{sel:`.mockup-page-hero`,variant:1},{sel:`.mockup-page-content`,variant:2},{sel:`.research-layout`,variant:2},{sel:`.blog-layout`,variant:2},{sel:`.contact-section`,variant:3}].forEach(t=>{let n=document.querySelector(t.sel);if(n&&!n.querySelector(`.festive-bg-layer`)){let r=m(e,t.variant);n.prepend(r)}}),!document.getElementById(`globalFestiveBgLayer`)){let t=m(e,1);t.id=`globalFestiveBgLayer`,t.className=`festive-global-bg-layer`,document.body.prepend(t)}}function m(e,t){let n=document.createElement(`div`);return n.className=`festive-bg-layer`,n.setAttribute(`aria-hidden`,`true`),n.innerHTML=e===`holi`?h(t):e===`christmas`?g():e===`cherry-blossom`?_():e===`eid`?v(t):y(),n}function h(e){let t=`
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
    `;return e===1?t+`
        <div class="holi-blob holi-blob-top-left">
          <svg viewBox="0 0 500 500" fill="none"><path d="M380,140 C430,190 480,260 450,330 C420,400 340,460 270,480 C200,500 130,470 90,410 C50,350 30,270 70,200 C110,130 190,80 280,70 C330,65 350,90 380,140 Z" fill="url(#holiGradPurple)" fill-opacity="0.85"/><circle cx="110" cy="110" r="14" fill="url(#holiGradPurple)"/><circle cx="440" cy="150" r="18" fill="url(#holiGradPurple)"/><circle cx="470" cy="420" r="12" fill="url(#holiGradPurple)"/></svg>
        </div>
        <div class="holi-blob holi-blob-mid-right">
          <svg viewBox="0 0 500 500" fill="none"><path d="M360,120 C420,180 470,270 440,340 C410,410 320,450 250,470 C180,490 120,440 80,380 C40,320 50,230 90,170 C130,110 210,60 290,70 C330,75 340,90 360,120 Z" fill="url(#holiGradCyan)" fill-opacity="0.85"/><circle cx="430" cy="110" r="15" fill="url(#holiGradCyan)"/><circle cx="120" cy="90" r="11" fill="url(#holiGradCyan)"/><circle cx="460" cy="440" r="16" fill="url(#holiGradCyan)"/></svg>
        </div>
      `:e===2?t+`
        <div class="holi-blob holi-blob-bottom-left">
          <svg viewBox="0 0 500 500" fill="none"><path d="M390,150 C450,220 440,310 400,380 C360,450 280,490 200,480 C120,470 60,400 50,320 C40,240 80,160 140,110 C200,60 300,70 360,100 C380,110 380,130 390,150 Z" fill="url(#holiGradPink)" fill-opacity="0.85"/><circle cx="420" cy="120" r="16" fill="url(#holiGradPink)"/><circle cx="80" cy="180" r="12" fill="url(#holiGradPink)"/><circle cx="430" cy="450" r="14" fill="url(#holiGradPink)"/></svg>
        </div>
        <div class="holi-blob holi-blob-mid-left">
          <svg viewBox="0 0 500 500" fill="none"><path d="M340,130 C410,190 460,280 430,350 C400,420 310,460 230,470 C150,480 90,420 60,350 C30,280 40,200 80,140 C120,80 200,50 270,60 C310,65 320,90 340,130 Z" fill="url(#holiGradLime)" fill-opacity="0.85"/><circle cx="430" cy="140" r="14" fill="url(#holiGradLime)"/><circle cx="100" cy="80" r="10" fill="url(#holiGradLime)"/></svg>
        </div>
        <div class="holi-blob holi-blob-bottom-right">
          <svg viewBox="0 0 500 500" fill="none"><path d="M360,140 C430,200 450,290 420,360 C390,430 310,470 230,460 C150,450 80,390 60,320 C40,250 60,170 110,120 C160,70 250,50 310,70 C340,80 350,110 360,140 Z" fill="url(#holiGradOrange)" fill-opacity="0.8"/><circle cx="440" cy="200" r="15" fill="url(#holiGradOrange)"/><circle cx="90" cy="140" r="12" fill="url(#holiGradOrange)"/></svg>
        </div>
      `:t+`
        <div class="holi-blob holi-blob-top-left">
          <svg viewBox="0 0 500 500" fill="none"><path d="M350,120 C420,180 450,270 420,340 C390,410 310,460 230,470 C150,480 80,420 50,350 C20,280 40,190 90,130 C140,70 220,50 290,60 C320,65 340,90 350,120 Z" fill="url(#holiGradBlue)" fill-opacity="0.85"/><circle cx="430" cy="130" r="14" fill="url(#holiGradBlue)"/><circle cx="90" cy="100" r="10" fill="url(#holiGradBlue)"/></svg>
        </div>
        <div class="holi-blob holi-blob-bottom-right">
          <svg viewBox="0 0 500 500" fill="none"><path d="M380,150 C440,220 450,310 410,380 C370,450 290,480 210,470 C130,460 70,390 60,320 C50,250 80,170 130,120 C180,70 270,60 330,80 C360,90 370,120 380,150 Z" fill="url(#holiGradAmber)" fill-opacity="0.82"/><circle cx="100" cy="120" r="12" fill="url(#holiGradAmber)"/><circle cx="440" cy="180" r="15" fill="url(#holiGradAmber)"/></svg>
        </div>
      `}function g(){let e=`
      <div class="christmas-glow-orb" style="top:-60px; right:10%; width:380px; height:380px; background:radial-gradient(circle, rgba(5,150,105,0.22) 0%, transparent 70%);"></div>
      <div class="christmas-glow-orb" style="bottom:-80px; left:5%; width:420px; height:420px; background:radial-gradient(circle, rgba(220,38,38,0.18) 0%, transparent 70%);"></div>
      <div class="christmas-glow-orb" style="top:40%; left:30%; width:300px; height:300px; background:radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%);"></div>
    `,t=[`❄`,`❅`,`✻`,`•`,`❆`,`❄`];for(let n=0;n<22;n++){let r=Math.round(Math.random()*96),i=(7+Math.random()*9).toFixed(1),a=(Math.random()*8).toFixed(1),o=(.75+Math.random()*.95).toFixed(2),s=t[n%t.length];e+=`<span class="festive-snow-item" style="left:${r}%; font-size:${o}rem; animation-duration:${i}s; animation-delay:${a}s;">${s}</span>`}return e}function _(){let e=`
      <div class="christmas-glow-orb" style="top:-50px; left:10%; width:440px; height:440px; background:radial-gradient(circle, rgba(244,63,94,0.22) 0%, transparent 70%);"></div>
      <div class="christmas-glow-orb" style="bottom:-60px; right:8%; width:460px; height:460px; background:radial-gradient(circle, rgba(251,113,133,0.20) 0%, transparent 70%);"></div>
    `,t=[`🌸`,`🌸`,`💮`];for(let n=0;n<18;n++){let r=Math.round(Math.random()*94),i=(8+Math.random()*8).toFixed(1),a=(Math.random()*7).toFixed(1),o=(.85+Math.random()*.7).toFixed(2),s=t[n%t.length];e+=`<span class="festive-sakura-petal" style="left:${r}%; font-size:${o}rem; animation-duration:${i}s; animation-delay:${a}s;">${s}</span>`}return e}function v(e){let t=`
      <div class="festive-eid-crescent">🌙</div>
      <div class="christmas-glow-orb" style="top:-30px; right:15%; width:360px; height:360px; background:radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 70%);"></div>
      <div class="christmas-glow-orb" style="bottom:-40px; left:8%; width:340px; height:340px; background:radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%);"></div>
    `,n=[`✨`,`⭐`,`✦`,`★`];for(let e=0;e<8;e++){let r=Math.round(8+e*11+Math.random()*5),i=Math.round(5+e*12+Math.random()*5),a=(2.2+e%3*.8).toFixed(1),o=(e*.35).toFixed(1),s=(.75+e%3*.25).toFixed(2),c=n[e%n.length];t+=`<span class="festive-star" style="top:${r}%; left:${i}%; font-size:${s}rem; animation-duration:${a}s; animation-delay:${o}s;">${c}</span>`}return t}function y(){let e=`
      <div class="christmas-glow-orb" style="top:10%; left:20%; width:400px; height:400px; background:radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%);"></div>
      <div class="christmas-glow-orb" style="bottom:10%; right:15%; width:420px; height:420px; background:radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%);"></div>
    `,t=[`#ec4899`,`#8b5cf6`,`#06b6d4`,`#10b981`,`#f59e0b`,`#3b82f6`,`#f43f5e`];for(let n=0;n<28;n++){let r=Math.round(Math.random()*95),i=(5+Math.random()*7).toFixed(1),a=(Math.random()*6).toFixed(1),o=Math.round(8+Math.random()*10),s=Math.round(12+Math.random()*12),c=t[n%t.length];e+=`<div class="festive-confetti-piece" style="left:${r}%; width:${o}px; height:${s}px; background:${c}; border-radius:${Math.random()>.5?`2px`:`50%`}; animation-duration:${i}s; animation-delay:${a}s;"></div>`}return e}}function a(){o(localStorage.getItem(`crii_theme_mode`)||`light`),document.querySelectorAll(`.theme-toggle-btn`).forEach(e=>{e.addEventListener(`click`,()=>{o((document.documentElement.getAttribute(`data-theme`)||`light`)===`light`?`dark`:`light`)})})}function o(e){document.documentElement.setAttribute(`data-theme`,e),localStorage.setItem(`crii_theme_mode`,e)}function s(){if(!window.CRII_API)return;let e=window.CRII_API.getInstituteName(),t=window.CRII_API.getInstituteLogo()||`assets/curiomas-no-bg.png`;document.querySelectorAll(`.brand-title`).forEach(t=>{t.innerText=e}),t&&document.querySelectorAll(`.brand-logo-container`).forEach(e=>{e.innerHTML=`<img src="${t}" alt="CRII Logo" class="brand-logo-img" style="width:36px; height:36px; object-fit:contain;">`})}function c(){document.querySelectorAll(`.custom-cursor-dot, .custom-cursor-ring`).forEach(e=>e.remove())}function l(){if(localStorage.getItem(`crii_cookie_consent_v1`))return;let e=document.createElement(`div`);e.className=`cookie-banner`,e.innerHTML=`
    <div class="cookie-text">
      We use strictly essential local cookies and session storage to verify research access and provide reproducible data methods.
    </div>
    <div class="cookie-actions">
      <button id="acceptCookiesBtn" class="btn btn-primary btn-sm">Accept All</button>
      <button id="closeCookiesBtn" class="btn btn-secondary btn-sm">Dismiss</button>
    </div>
  `,document.body.appendChild(e),setTimeout(()=>e.classList.add(`show`),600);let t=e.querySelector(`#acceptCookiesBtn`),n=e.querySelector(`#closeCookiesBtn`),r=()=>{localStorage.setItem(`crii_cookie_consent_v1`,`accepted`),e.classList.remove(`show`),setTimeout(()=>e.remove(),400)};t&&t.addEventListener(`click`,r),n&&n.addEventListener(`click`,r)}function u(){let e=document.getElementById(`menuToggleBtn`)||document.querySelector(`.menu-toggle`),t=document.getElementById(`mainNavMenu`)||document.querySelector(`.mockup-nav-links`);e&&t&&(e.addEventListener(`click`,n=>{n.preventDefault(),n.stopPropagation();let r=!t.classList.contains(`show`);t.classList.toggle(`show`,r),e.setAttribute(`aria-expanded`,String(r))}),document.addEventListener(`click`,n=>{!e.contains(n.target)&&!t.contains(n.target)&&(t.classList.remove(`show`),e.setAttribute(`aria-expanded`,`false`))}),t.querySelectorAll(`a`).forEach(n=>{n.addEventListener(`click`,()=>{t.classList.remove(`show`),e.setAttribute(`aria-expanded`,`false`)})}))}function d(){let e=document.querySelector(`.mockup-nav-wrapper`);if(!e)return;let t=window.pageYOffset||document.documentElement.scrollTop,n=!1;window.addEventListener(`scroll`,()=>{n||=(window.requestAnimationFrame(()=>{let r=window.pageYOffset||document.documentElement.scrollTop;if(r>15?e.classList.add(`nav-scrolled`):e.classList.remove(`nav-scrolled`),r<=40)e.classList.remove(`nav-hidden`);else if(r>t+6){e.classList.add(`nav-hidden`);let t=document.getElementById(`mainNavMenu`);t&&t.classList.remove(`show`);let n=document.getElementById(`navLangMenu`);n&&n.classList.remove(`show`)}else r<t-6&&e.classList.remove(`nav-hidden`);t=r<=0?0:r,n=!1}),!0)},{passive:!0})}function f(){let e=window.CRII_API?window.CRII_API.getCurrentUser():null,t=document.querySelectorAll(`.nav-login-btn, .nav-portal-btn, .mobile-login-link`);t.length&&e&&t.forEach(t=>{t.innerHTML=`
        <span style="display:inline-flex; align-items:center; gap:0.4rem;">
          <span style="width:6px; height:6px; background:#10b981; border-radius:50%; box-shadow:0 0 6px #10b981;"></span>
          ${(e.name||`User`).split(` `)[0].toUpperCase()}
        </span>
      `,t.href=`/portal`,t.title=`Signed in as ${e.name} (${e.role||`Member`})`})}var p={en:{name:`English`,flag:`https://flagcdn.com/w40/gb.png`},bn:{name:`বাংলা`,flag:`https://flagcdn.com/w40/bd.png`}};function m(){let e=`crii_site_language`,t=localStorage.getItem(e)||`en`;function n(e){let t=e&&e!==`en`?`/en/${e}`:``,n=window.location.hostname,r=e===`en`||!e?`expires=Thu, 01 Jan 1970 00:00:00 UTC;`:`max-age=31536000;`;if(document.cookie=`googtrans=${t}; path=/; ${r}`,n){document.cookie=`googtrans=${t}; path=/; domain=${n}; ${r}`;let e=n.split(`.`);e.length>2&&(document.cookie=`googtrans=${t}; path=/; domain=.${e.slice(-2).join(`.`)}; ${r}`)}}function r(e){let t=document.getElementById(`navLangLabel`),n=document.getElementById(`navLangFlagImg`),r=p[e]||p.en;t&&(t.textContent=r.name),n&&(n.src=r.flag,n.alt=r.name),document.querySelectorAll(`.nav-lang-opt`).forEach(t=>{t.getAttribute(`data-lang`)===e?t.classList.add(`active`):t.classList.remove(`active`)})}t!==`en`&&n(t),r(t);let i=document.getElementById(`navLangBtn`),a=document.getElementById(`navLangMenu`);if(i&&a&&(i.addEventListener(`click`,e=>{e.stopPropagation();let t=a.classList.contains(`show`);a.classList.toggle(`show`,!t),i.setAttribute(`aria-expanded`,String(!t))}),document.addEventListener(`click`,e=>{!a.contains(e.target)&&!i.contains(e.target)&&(a.classList.remove(`show`),i.setAttribute(`aria-expanded`,`false`))}),a.querySelectorAll(`.nav-lang-opt`).forEach(t=>{t.addEventListener(`click`,()=>{let o=t.getAttribute(`data-lang`)||`en`;if(o===(localStorage.getItem(e)||`en`)){a.classList.remove(`show`);return}localStorage.setItem(e,o),n(o),r(o),a.classList.remove(`show`),i.setAttribute(`aria-expanded`,`false`);let s=document.querySelector(`.goog-te-combo`);s&&(s.value=o,s.dispatchEvent(new Event(`change`))),setTimeout(()=>{window.location.reload()},120)})})),window.googleTranslateElementInit=function(){try{new google.translate.TranslateElement({pageLanguage:`en`,includedLanguages:`en,bn`,autoDisplay:!1},`google_translate_element`)}catch(e){console.warn(`Google Translate init deferred:`,e)}},!document.getElementById(`google-translate-api-script`)){let e=document.createElement(`script`);e.id=`google-translate-api-script`,e.type=`text/javascript`,e.src=`//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`,e.async=!0,document.head.appendChild(e)}}function h(){let e=document.querySelectorAll(`#navSearchTrigger, #mobileSearchTrigger, .nav-search-trigger`),t=document.getElementById(`criiSearchOverlay`),n=document.getElementById(`criiSearchBackdrop`),r=document.getElementById(`criiSearchEsc`),i=document.getElementById(`siteSearchInput`),a=document.getElementById(`criiSearchResults`),o=document.getElementById(`criiSearchQuickTags`);if(!t||!i)return;function s(){t.style.display=`flex`,t.setAttribute(`aria-hidden`,`false`),i.value=``,u(``),setTimeout(()=>i.focus(),60),document.body.style.overflow=`hidden`}function c(){t.style.display=`none`,t.setAttribute(`aria-hidden`,`true`),document.body.style.overflow=``}e.forEach(e=>{e.addEventListener(`click`,e=>{e.preventDefault(),s()})}),n&&n.addEventListener(`click`,c),r&&r.addEventListener(`click`,c),o&&o.querySelectorAll(`.quick-tag-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault();let n=e.getAttribute(`data-query`)||e.innerText.trim();i.value=n,i.focus(),u(n)})}),document.addEventListener(`keydown`,e=>{(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`k`?(e.preventDefault(),t.style.display===`flex`?c():s()):e.key===`Escape`&&t.style.display===`flex`&&c()});let l=null;i.addEventListener(`input`,()=>{clearTimeout(l),l=setTimeout(()=>{u(i.value.trim())},120)});async function u(e){if(!a)return;if(!e){a.innerHTML=`
        <div class="crii-search-empty">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" style="margin-bottom:0.75rem; color:#38bdf8; opacity:0.8;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <p style="margin:0 0 0.4rem; font-weight:600; color:#f1f5f9;">Search the CRII Open Knowledge Base</p>
          <span style="font-size:0.84rem; color:#94a3b8;">Type keywords or click one of the suggested topics above.</span>
        </div>
      `;return}a.innerHTML=`
      <div class="crii-search-empty">
        <span class="crii-search-spinner"></span>
        <p style="margin-top:0.6rem; color:#94a3b8;">Searching publications & dispatches...</p>
      </div>
    `;let t=[];if(window.CRII_API&&typeof window.CRII_API.getPosts==`function`)try{t=await window.CRII_API.getPosts()}catch{t=[]}let n=e.toLowerCase(),r=t.filter(e=>{let t=(e.title||``).toLowerCase(),r=(e.excerpt||e.abstract||``).toLowerCase(),i=(e.division||``).toLowerCase(),a=(e.author||(Array.isArray(e.authors)?e.authors.join(` `):``)).toLowerCase(),o=Array.isArray(e.tags)?e.tags.join(` `).toLowerCase():``;return t.includes(n)||r.includes(n)||i.includes(n)||a.includes(n)||o.includes(n)});r.length===0?a.innerHTML=`
        <div class="crii-search-empty">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" style="margin-bottom:0.5rem; color:#64748b;"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          <p style="margin:0 0 0.35rem; color:#e2e8f0; font-weight:600;">No matching publications found</p>
          <span style="font-size:0.84rem; color:#64748b;">No results found for "<strong>${d(e)}</strong>". Try broader keywords.</span>
        </div>
      `:a.innerHTML=r.slice(0,8).map(e=>{let t=`/article?id=${encodeURIComponent(e.id)}`,n=e.division||`Research`,r=e.author||Array.isArray(e.authors)&&e.authors[0]||`CRII Research Core`,i=e.excerpt||e.abstract||`Explore the complete research dispatch, datasets, and code.`;return`
        <a href="${t}" class="crii-search-result-item">
          <div class="crii-search-result-top">
            <span class="crii-search-result-badge">${d(n)}</span>
            <span class="crii-search-result-meta">${d(r)}</span>
          </div>
          <h4 class="crii-search-result-title">${d(e.title)}</h4>
          <p class="crii-search-result-snippet">${d(i)}</p>
        </a>
      `}).join(``)}function d(e){return String(e||``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}}function g(){if(!document.querySelector(`.toast-container`)){let e=document.createElement(`div`);e.className=`toast-container`,document.body.appendChild(e)}}window.showToast=function(e,t=`info`,n=3600){let r=document.querySelector(`.toast-container`);r||=(g(),document.querySelector(`.toast-container`));let i=document.createElement(`div`);i.className=`toast toast-${t}`,i.innerHTML=`<span>${e}</span>`,r.appendChild(i),requestAnimationFrame(()=>i.classList.add(`show`)),setTimeout(()=>{i.classList.remove(`show`),setTimeout(()=>i.remove(),300)},n)},window.copyToClipboard=async function(e,t=`Copied to clipboard!`){try{await navigator.clipboard.writeText(e),window.showToast(t,`success`)}catch{window.showToast(`Failed to copy`,`error`)}};function _(e){if(!e)return`04 November 2026`;try{let t=new Date(e);return isNaN(t.getTime())?e:`${String(t.getDate()).padStart(2,`0`)} ${[`January`,`February`,`March`,`April`,`May`,`June`,`July`,`August`,`September`,`October`,`November`,`December`][t.getMonth()]} ${t.getFullYear()}`}catch{return e}}function v(e){let t=!!(e.isEdited||e.updatedBy&&e.updatedAt),n=e.updatedBy||e.authors&&e.authors[0]||`CRII Researcher`,r=e.createdBy||e.authors&&e.authors[0]||`CRII Researcher`;return t?`
      <div class="article-meta-attribution">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        <span>Last edited by <strong>${n}</strong> on ${_(e.updatedAt||e.date)}</span>
      </div>
    `:`
      <div class="article-meta-attribution">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span>Created by <strong>${r}</strong> on ${_(e.createdAt||e.date)}</span>
      </div>
    `}async function y(){let e=document.getElementById(`fromTheInstituteContainer`)||document.getElementById(`featuredArticlesContainer`);if(e&&window.CRII_API)try{let t=(await window.CRII_API.getPosts({preferNetwork:!0})||[]).filter(e=>e.published!==!1&&!e.id.startsWith(`crii-paper-2026-00`));if(t.length===0){e.innerHTML=`
        <div class="editorial-empty-notice" style="text-align:center; padding:3.5rem 1.5rem; background:rgba(0,0,0,0.02); border-radius:14px; border:1px dashed #d5cebf; color:#78716c;">
          <p style="font-size:1.05rem; font-weight:600; color:#44403c; margin-bottom:0.4rem;">No publications currently published</p>
          <p style="font-size:0.88rem; color:#78716c; margin:0;">New peer-reviewed articles, synthetic spectra, and research dispatches will appear here once released by the institute.</p>
        </div>
      `;return}let n=[`https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1200&q=80`,`https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80`],r=t.find(e=>e.featured===!0)||t[0],i=t.filter(e=>e.id!==r.id).slice(0,3),a=r.coverImage||n[0];(r.category||r.division||`FEATURED RESEARCH`).toUpperCase();let o=`
      <div class="editorial-feature-card">
        <div class="feature-card-media">
          <img src="${a}" alt="${r.title}" loading="lazy">
        </div>
        <div class="feature-card-body">
          <h3 class="feature-card-title">
            <a href="/article?id=${encodeURIComponent(r.id)}" style="color:inherit; text-decoration:none;">${r.title}</a>
          </h3>
          <p class="feature-card-desc">
            ${r.summary||r.abstract||r.excerpt||``}
          </p>
          <a href="/article?id=${encodeURIComponent(r.id)}" class="mockup-arrow-link" style="margin-bottom:0.75rem;">
            <span>Read full publication</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
          </a>
          ${v(r)}
        </div>
      </div>
    `,s=``;if(i.length>0)for(let e=0;e<i.length;e++){let t=i[e],r=t.coverImage||n[(e+1)%n.length];(t.category||t.division||`RESEARCH`).toUpperCase(),s+=`
          <div class="editorial-sub-card">
            <div class="sub-card-media">
              <img src="${r}" alt="${t.title}" loading="lazy">
            </div>
            <div class="sub-card-body">
              <h4 class="sub-card-title">
                <a href="/article?id=${encodeURIComponent(t.id)}" style="color:inherit; text-decoration:none;">${t.title}</a>
              </h4>
              <p class="sub-card-desc">${t.summary||t.abstract||t.excerpt||``}</p>
              <a href="/article?id=${encodeURIComponent(t.id)}" class="mockup-arrow-link">
                <span>Read dispatch</span>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
              ${v(t)}
            </div>
          </div>
        `}e.innerHTML=`
      ${o}
      ${s?`<div class="editorial-sub-grid">${s}</div>`:``}
    `}catch(e){console.warn(`Featured articles render error:`,e)}}async function b(){let e=document.getElementById(`homeTeamContainer`);if(e&&window.CRII_API)try{let t=await window.CRII_API.getInternsData(),n=t&&t.activeInterns?t.activeInterns:[],r=[`team-002`,`team-003`,`int-001`,`int-002`,`crii-int-002`,`crii-int-003`,`crii-int-004`];n=n.filter(e=>e.status===`Active`&&!r.includes(e.id)),n.sort((e,t)=>{let n=+!!e.isTeamMember,r=+!!t.isTeamMember;if(n!==r)return r-n;let i=e.orderIndex===void 0?999:Number(e.orderIndex),a=t.orderIndex===void 0?999:Number(t.orderIndex);return i===a?(e.name||``).localeCompare(t.name||``):i-a});let i=n.slice(0,3);if(i.length===0){e.innerHTML=`
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--bg-surface); border-radius: 16px; border: 1px dashed var(--border-color);">
          <p style="color: var(--text-muted);">Leadership council roster initializing.</p>
        </div>
      `;return}e.innerHTML=i.map(e=>{let t=e.avatar||`https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,n=e.isTeamMember?`★ Executive Council`:`★ Research Fellow`;return`
        <div class="card">
          <div style="display:flex; align-items:center; gap:1.15rem; margin-bottom:1.15rem;">
            <img src="${t}" alt="${e.name}" style="width:58px; height:58px; border-radius:50%; object-fit:cover; border:2px solid var(--accent-primary);">
            <div>
              <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:0.15rem;">${e.name}</h3>
              <div style="font-size:0.84rem; color:var(--accent-primary); font-weight:600;">${e.role||`Principal Investigator`}</div>
              <div style="font-size:0.78rem; color:var(--text-muted);">${e.division||`Executive Council`}</div>
            </div>
          </div>
          <p class="card-desc" style="font-size:0.9rem; line-height:1.6; margin-bottom:1.25rem;">
            ${e.bio||`Leading open computational research and multi-disciplinary student discovery.`}
          </p>
          <div class="card-footer" style="padding-top:0.75rem; border-top:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
            <span class="badge-core-team">${n}</span>
            <a href="/team" class="btn btn-glass btn-sm">Full Team →</a>
          </div>
        </div>
      `}).join(``)}catch(e){console.warn(`Failed to load home team:`,e)}}async function x(){let e=document.getElementById(`homeDivisionsContainer`)||document.querySelector(`.divisions-cards-grid`);if(e&&window.CRII_API)try{let t=await window.CRII_API.getDivisions();t&&Array.isArray(t)&&t.length>0?(e.innerHTML=t.map(e=>`
        <a href="${e.link||`/research`}" class="division-card">
          <div class="division-card-media">
            <img src="${e.image||`https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=800&q=80`}" alt="${e.title}" loading="lazy">
          </div>
          <div class="division-card-tag">
            <span>${e.tag||(e.number?e.number+` / RESEARCH DIVISION`:`RESEARCH DIVISION`)}</span>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
          </div>
          <h3 class="division-card-title">${e.title}</h3>
          <p class="division-card-desc">${e.desc||``}</p>
        </a>
      `).join(``),window.refreshScrollAnimations&&window.refreshScrollAnimations()):e.innerHTML=`
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; background: rgba(0, 0, 0, 0.02); border-radius: 12px; border: 1px dashed #d5cebf; color: #78716c;">
          <p style="font-size: 1.05rem; font-weight: 600; color: #44403c; margin-bottom: 0.4rem;">Research Divisions Initializing</p>
          <p style="font-size: 0.88rem; color: #78716c; margin-bottom: 1rem;">Frontier research departments across astrophysics, paleogenomics and biophysics.</p>
          <a href="/research" class="mockup-btn-dark-green" style="display: inline-flex;">Explore Research Programs</a>
        </div>
      `}catch(e){console.warn(`initDivisions error:`,e)}}async function S(){let e=document.getElementById(`cohortCardsContainer`);if(e&&window.CRII_API)try{let t=await window.CRII_API.getCohorts();t&&Array.isArray(t)&&t.length>0?(e.innerHTML=t.map(e=>`
        <div class="cohort-card">
          <div class="cohort-card-media">
            <img src="${e.image||`https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80`}" alt="${e.title}" loading="lazy">
          </div>
          <div class="cohort-card-body">
            <h3 class="cohort-card-title">${e.title}</h3>
            <p class="cohort-card-desc">${e.desc||``}</p>
            <a href="${e.link||`/team#apply`}" class="cohort-card-link">
              <span>${e.linkText||`Apply as Fellow`}</span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </a>
          </div>
        </div>
      `).join(``),window.refreshScrollAnimations&&window.refreshScrollAnimations()):e.innerHTML=`
        <div class="cohort-empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; background: rgba(0, 0, 0, 0.02); border-radius: 12px; border: 1px dashed #d5cebf; color: #78716c;">
          <p style="font-size: 1.05rem; font-weight: 600; color: #44403c; margin-bottom: 0.4rem;">Admissions Open Globally</p>
          <p style="font-size: 0.88rem; color: #78716c; margin: 0;">We welcome self-directed researchers, university students, and fellows. Specific cohort profiles can be configured by institute administrators.</p>
        </div>
      `}catch(e){console.warn(`initCohorts error:`,e)}}