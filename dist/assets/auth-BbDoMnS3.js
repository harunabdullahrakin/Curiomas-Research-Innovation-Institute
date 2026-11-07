document.addEventListener(`DOMContentLoaded`,()=>{e()});function e(){let e=document.getElementById(`loginWithAutzBtn`)||document.getElementById(`loginWithAccountBtn`),t=document.getElementById(`loginStatus`),n=document.getElementById(`loginError`);if(localStorage.getItem(`crii_autz_app_id`)===`t0i7jkia`&&localStorage.setItem(`crii_autz_app_id`,`gqiqh6qia`),window.location.pathname.includes(`login`)&&window.CRII_API&&window.CRII_API.isAuthenticated()){window.location.href=`/portal`;return}if(e){let t=window.location.pathname.includes(`login`)?`/login.html`:`/portal.html`,n=window.location.origin.includes(`curiomas.zone.id`)?`https://www.curiomas.zone.id${t}`:window.location.origin+t,r=`https://autz.org/onboarding/gqiqh6qia?callback_url=${encodeURIComponent(n)}`;e.setAttribute(`href`,r),e.addEventListener(`click`,()=>{e.style.pointerEvents=`none`,e.innerHTML=`
        <span class="spinner" style="display:inline-block; width:16px; height:16px; border:2px solid #ffffff; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; margin-right:0.6rem;"></span>
        <span>Connecting to Single Sign-On...</span>
      `})}let r=new URLSearchParams(window.location.search),i=r.get(`auth_code`)||r.get(`code`);i&&(e&&(e.disabled=!0,e.innerHTML=`
        <span class="spinner" style="display:inline-block; width:16px; height:16px; border:2px solid #ffffff; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; margin-right:0.6rem;"></span>
        <span>Authenticating...</span>
      `),t&&(t.innerHTML=`
        <div style="display:flex; align-items:center; justify-content:center; gap:0.6rem;">
          <span class="spinner" style="display:inline-block; width:16px; height:16px; border:2px solid var(--accent-primary); border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite;"></span>
          <span>Verifying credentials with Institute Authentication...</span>
        </div>
      `,t.style.display=`block`),n&&(n.style.display=`none`),window.CRII_API.exchangeAutzCode(i).then(r=>{let i=window.location.pathname;window.history.replaceState({},document.title,i),r&&r.success?(t&&(t.innerHTML=`Access granted! Redirecting to research portal...`,t.style.background=`rgba(16, 185, 129, 0.1)`,t.style.borderColor=`rgba(16, 185, 129, 0.3)`,t.style.color=`#10b981`),window.showToast&&window.showToast(`Authenticated: Welcome, ${r.user.name}!`,`success`),setTimeout(()=>{window.location.pathname.includes(`login`)?window.location.href=`/portal`:window.location.reload()},600)):(t&&(t.style.display=`none`),e&&(e.disabled=!1,e.innerHTML=`
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.6rem;"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            <span>Login with your account</span>
          `),n&&(n.innerHTML=`
            <strong>Authentication Failed:</strong> ${r.error||`Access denied. Account is not authorized.`}
          `,n.style.display=`block`),window.showToast&&window.showToast(`Access Denied: Account not in authorized roster`,`error`))}).catch(r=>{t&&(t.style.display=`none`),e&&(e.disabled=!1,e.innerHTML=`
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.6rem;"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          <span>Login with your account</span>
        `),n&&(n.innerHTML=`<strong>Error:</strong> Failed to communicate with authentication service.`,n.style.display=`block`)}))}