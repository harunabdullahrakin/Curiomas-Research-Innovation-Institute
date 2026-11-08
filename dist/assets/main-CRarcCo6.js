(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={DEFAULT_INSTITUTE_NAME:`Curiomas Research & Innovation Institute`,ACRONYM:`CRII`,MOTTO:`Turning Curiosity into Action`,DEFAULT_AUTZ_APP_ID:`gqiqh6qia`,API_BASE:`/api`,STORAGE_KEYS:{THEME:`crii_theme_mode`,COOKIE_CONSENT:`crii_cookie_consent_v1`,INSTITUTE_NAME:`crii_custom_navbar_title`,INSTITUTE_LOGO:`crii_custom_logo_url`,HERO_SETTINGS:`crii_hero_settings_v1`,AUTZ_APP_ID:`crii_autz_app_id`,AUTH_USER:`crii_auth_user`,AUTH_TOKEN:`crii_auth_token`,ALLOWED_USERS:`crii_allowed_users_v1`,POSTS:`crii_posts_v2`,INTERNS:`crii_interns_v2`,DATASETS:`crii_datasets_v1`,EMAILJS_TEMPLATE_ID:`crii_emailjs_template_id`,DIVISIONS:`crii_divisions_v1`,COHORTS:`crii_cohorts_v1`,DELETED_POSTS:`crii_deleted_posts_v2`,POSTS_INITIALIZED:`crii_posts_initialized_v2`,FESTIVE_SETTINGS:`crii_festive_settings_v1`,APP_FORM_CONFIG:`crii_app_form_config_v1`}},t=[];typeof window<`u`&&(window.CRII_CONFIG=e,window.CRII_DEFAULT_ARTICLES=t);var n=[`crii-article-exoplanetary-spectra`,`crii-article-fossil-calibration`,`crii-article-ml-biophysics`,`crii-article-edge-of-habitability`],r=[`div-space-astrophysics`,`div-ancient-biology`,`div-ai-computational-science`,`div-astrobiology`],i=[`cohort-undergraduates`,`cohort-postgraduates`,`cohort-self-directed`,`cohort-fellows`,`Undergraduates`,`Postgraduates`,`Self-Directed Researchers`,`Research Fellows`];window.CRII_API=new class{constructor(){this.initStore()}async initStore(){localStorage.getItem(e.STORAGE_KEYS.ALLOWED_USERS)||localStorage.setItem(e.STORAGE_KEYS.ALLOWED_USERS,JSON.stringify([{email:`harunabdullahrakin@gmail.com`,name:`Harun Abdullah Rakin`,role:`Super Admin & Director`,division:`Institute Executive Council`,addedDate:`2026-09-24`,status:`Active`}])),localStorage.getItem(e.STORAGE_KEYS.HERO_SETTINGS)||localStorage.setItem(e.STORAGE_KEYS.HERO_SETTINGS,JSON.stringify({videoUrl:`assets/hero-bg.mp4`,blurPx:12,overlayOpacity:.55}));try{let t=[],r=localStorage.getItem(e.STORAGE_KEYS.DELETED_POSTS);if(r){let e=JSON.parse(r);Array.isArray(e)&&(t=e)}let i=!1;n.forEach(e=>{t.includes(e)||(t.push(e),i=!0)}),i&&localStorage.setItem(e.STORAGE_KEYS.DELETED_POSTS,JSON.stringify(t));let a=localStorage.getItem(e.STORAGE_KEYS.POSTS);if(a){let t=JSON.parse(a);if(Array.isArray(t)){let r=new Set(n),i=t.filter(e=>e&&e.id&&!e.id.startsWith(`crii-paper-2026-00`)&&!r.has(e.id));localStorage.setItem(e.STORAGE_KEYS.POSTS,JSON.stringify(i))}}else localStorage.setItem(e.STORAGE_KEYS.POSTS,JSON.stringify([]))}catch{localStorage.setItem(e.STORAGE_KEYS.POSTS,JSON.stringify([]))}let t={id:`team-001`,name:`Harun Abdullah Rakin`,email:`harunabdullahrakin@gmail.com`,avatar:`https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,university:`CRII Council`,degree:`Director of Research`,division:`Executive Council`,role:`Super Admin & Lead Investigator`,cohort:`Founding`,status:`Active`,bio:`Pioneering open computational science, astrophysical synthetic models, and multi-agent systems for student discovery.`,socials:{github:`https://github.com/harunabdullahrakin`,linkedin:`https://linkedin.com`,email:`harunabdullahrakin@gmail.com`},projects:[`CRII Computational Core`,`Autonomous Research Pipelines`],isTeamMember:!0,orderIndex:1};try{let n=localStorage.getItem(e.STORAGE_KEYS.INTERNS);if(n){let r=JSON.parse(n);if(r&&Array.isArray(r.activeInterns)){let n=[`team-002`,`team-003`,`int-001`,`int-002`,`crii-int-002`,`crii-int-003`,`crii-int-004`];r.activeInterns=r.activeInterns.filter(e=>!n.includes(e.id)),r.activeInterns.some(e=>e.id===`team-001`)||r.activeInterns.unshift(t),localStorage.setItem(e.STORAGE_KEYS.INTERNS,JSON.stringify(r))}}else localStorage.setItem(e.STORAGE_KEYS.INTERNS,JSON.stringify({activeInterns:[t],applications:[]}))}catch{localStorage.setItem(e.STORAGE_KEYS.INTERNS,JSON.stringify({activeInterns:[t],applications:[]}))}try{let t=localStorage.getItem(e.STORAGE_KEYS.DIVISIONS);if(t){let n=JSON.parse(t);if(Array.isArray(n)){let t=n.filter(e=>!r.includes(e.id));localStorage.setItem(e.STORAGE_KEYS.DIVISIONS,JSON.stringify(t))}}else localStorage.setItem(e.STORAGE_KEYS.DIVISIONS,JSON.stringify([]))}catch{localStorage.setItem(e.STORAGE_KEYS.DIVISIONS,JSON.stringify([]))}this.syncSettingsFromDb().catch(()=>{}),this.syncAllowedUsersFromDb().catch(()=>{})}async syncSettingsFromDb(){try{let t=await fetch(`${e.API_BASE}/settings`,{cache:`no-store`});if(t.ok){let n=await t.json();if(n&&n.hero&&localStorage.setItem(e.STORAGE_KEYS.HERO_SETTINGS,JSON.stringify(n.hero)),n&&Array.isArray(n.divisions)){let t=n.divisions.filter(e=>!r.includes(e.id));localStorage.setItem(e.STORAGE_KEYS.DIVISIONS,JSON.stringify(t))}if(n&&Array.isArray(n.cohorts)){let t=n.cohorts.filter(e=>!i.includes(e.id)&&!i.includes(e.title));localStorage.setItem(e.STORAGE_KEYS.COHORTS,JSON.stringify(t))}n&&n.festive&&localStorage.setItem(e.STORAGE_KEYS.FESTIVE_SETTINGS,JSON.stringify(n.festive));let a=n&&n.emailjs&&n.emailjs.templateId||n&&n.branding&&n.branding.emailjsTemplateId||``;a&&localStorage.setItem(e.STORAGE_KEYS.EMAILJS_TEMPLATE_ID,a),n&&n.app_form_config&&localStorage.setItem(e.STORAGE_KEYS.APP_FORM_CONFIG,JSON.stringify(n.app_form_config)),n&&n.branding&&(n.branding.name&&localStorage.setItem(e.STORAGE_KEYS.INSTITUTE_NAME,n.branding.name),n.branding.logoUrl&&localStorage.setItem(e.STORAGE_KEYS.INSTITUTE_LOGO,n.branding.logoUrl),n.branding.autzAppId&&n.branding.autzAppId!==`t0i7jkia`&&localStorage.setItem(e.STORAGE_KEYS.AUTZ_APP_ID,n.branding.autzAppId))}}catch{}}getApplicationFormConfig(){let t={fields:{fullName:{label:`Full Legal Name`,required:!0,visible:!0},email:{label:`Email Address`,required:!0,visible:!0},university:{label:`University / Institution`,required:!0,visible:!0},fieldOfStudy:{label:`Field of Study / Major`,required:!0,visible:!0},division:{label:`Preferred Research Division`,required:!0,visible:!0},academicLevel:{label:`Academic Level / Grade`,required:!1,visible:!0},portfolio:{label:`GitHub, ORCID, or Portfolio Link`,required:!1,visible:!0},phone:{label:`Contact Phone / WhatsApp`,required:!1,visible:!1},statement:{label:`Statement of Intent & Research Interests`,required:!0,visible:!0}},customFields:[]};try{let n=localStorage.getItem(e.STORAGE_KEYS.APP_FORM_CONFIG);if(n){let e=JSON.parse(n);if(e&&typeof e==`object`)return{fields:{...t.fields,...e.fields||{}},customFields:Array.isArray(e.customFields)?e.customFields:[]}}}catch{}return t}async saveApplicationFormConfig(t){if(t&&typeof t==`object`){try{localStorage.setItem(e.STORAGE_KEYS.APP_FORM_CONFIG,JSON.stringify(t));let n=this.getCurrentUser();await fetch(`${e.API_BASE}/settings`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({key:`app_form_config`,value:t,updatedBy:n?n.name||n.email:`Administrator`})})}catch(e){console.warn(`Failed to sync app_form_config to D1:`,e)}return t}}getFestiveSettings(){try{let t=localStorage.getItem(e.STORAGE_KEYS.FESTIVE_SETTINGS);if(t)return JSON.parse(t)}catch{}return{mode:`auto`,theme:`holi`,intensity:.7}}async saveFestiveSettings(t){if(!t)return;let n={mode:[`auto`,`always`,`disabled`].includes(t.mode)?t.mode:`auto`,theme:t.theme||`holi`,intensity:Math.max(.1,Math.min(1,Number(t.intensity)||.7))};localStorage.setItem(e.STORAGE_KEYS.FESTIVE_SETTINGS,JSON.stringify(n));try{let t=this.getCurrentUser();await fetch(`${e.API_BASE}/settings`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({key:`festive`,value:n,updatedBy:t?t.name||t.email:`Administrator`})})}catch(e){console.warn(`Failed to sync festive settings to D1:`,e)}return n}getHeroSettings(){try{let t=localStorage.getItem(e.STORAGE_KEYS.HERO_SETTINGS);if(t){let e=JSON.parse(t);return e.mediaType||=`both`,e.selectionMode||=`random`,e.fixedImageIndex===void 0&&(e.fixedImageIndex=0),e.soundEnabled===void 0&&(e.soundEnabled=!0),Array.isArray(e.backgroundVideos)&&e.backgroundVideos.length!==0||(e.backgroundVideos=[`assets/hero-bg.mp4`,`https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4`,`https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-starfield-in-space-41539-large.mp4`,`https://assets.mixkit.co/videos/preview/mixkit-planet-earth-rotating-in-space-39982-large.mp4`]),e.fixedVideoIndex===void 0&&(e.fixedVideoIndex=0),e}}catch{}return{mediaType:`both`,selectionMode:`random`,fixedImageIndex:0,fixedVideoIndex:0,soundEnabled:!0,fixedVideoIndex:0,backgroundVideos:[`assets/hero-bg.mp4`,`https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4`,`https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-starfield-in-space-41539-large.mp4`,`https://assets.mixkit.co/videos/preview/mixkit-planet-earth-rotating-in-space-39982-large.mp4`],videoUrl:`assets/hero-bg.mp4`,blurPx:12,overlayOpacity:.55,fontFamily:`Eyekons`,backgroundImages:[`https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=85`,`https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=85`,`https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1920&q=85`,`https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=85`,`https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=85`],imageOpacity:.4}}async saveHeroSettings(t){if(!t)return;let n={mediaType:[`image`,`video`,`both`].includes(t.mediaType)?t.mediaType:`both`,selectionMode:[`random`,`fixed`].includes(t.selectionMode)?t.selectionMode:`random`,fixedImageIndex:Math.max(0,Number(t.fixedImageIndex)||0),fixedVideoIndex:Math.max(0,Number(t.fixedVideoIndex)||0),backgroundVideos:Array.isArray(t.backgroundVideos)?t.backgroundVideos.filter(e=>typeof e==`string`&&e.trim().length>0):[],videoUrl:t.videoUrl||Array.isArray(t.backgroundVideos)&&t.backgroundVideos[0]||`assets/hero-bg.mp4`,soundEnabled:t.soundEnabled===void 0||!!t.soundEnabled,blurPx:Math.max(0,Math.min(40,Number(t.blurPx)||0)),overlayOpacity:Math.max(0,Math.min(1,Number(t.overlayOpacity)||.55)),fontFamily:t.fontFamily||`Eyekons`,backgroundImages:Array.isArray(t.backgroundImages)?t.backgroundImages.filter(e=>typeof e==`string`&&e.trim().length>0):[],imageOpacity:Math.max(.05,Math.min(1,Number(t.imageOpacity)||.4))};localStorage.setItem(e.STORAGE_KEYS.HERO_SETTINGS,JSON.stringify(n));try{let t=this.getCurrentUser();await fetch(`${e.API_BASE}/settings`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({key:`hero`,value:n,updatedBy:t?t.name||t.email:`Administrator`})})}catch(e){console.warn(`Failed to sync hero settings to D1:`,e)}return n}getInstituteName(){return localStorage.getItem(e.STORAGE_KEYS.INSTITUTE_NAME)||e.DEFAULT_INSTITUTE_NAME}setInstituteName(t){if(!t||typeof t!=`string`)return;let n=t.trim().slice(0,100);return localStorage.setItem(e.STORAGE_KEYS.INSTITUTE_NAME,n),n}getInstituteLogo(){return localStorage.getItem(e.STORAGE_KEYS.INSTITUTE_LOGO)||`assets/curiomas-no-bg.png`}setInstituteLogo(t){if(!t)return localStorage.removeItem(e.STORAGE_KEYS.INSTITUTE_LOGO),``;let n=t.trim();return localStorage.setItem(e.STORAGE_KEYS.INSTITUTE_LOGO,n),n}getAutzAppId(){let t=localStorage.getItem(e.STORAGE_KEYS.AUTZ_APP_ID);return!t||t===`t0i7jkia`?(localStorage.setItem(e.STORAGE_KEYS.AUTZ_APP_ID,`gqiqh6qia`),`gqiqh6qia`):t}setAutzAppId(t){let n=(t||``).trim();return localStorage.setItem(e.STORAGE_KEYS.AUTZ_APP_ID,n),n}getEmailjsTemplateId(){return localStorage.getItem(e.STORAGE_KEYS.EMAILJS_TEMPLATE_ID)||`zhelx7y`}setEmailjsTemplateId(t){if(!t||typeof t!=`string`)return;let n=t.trim();return localStorage.setItem(e.STORAGE_KEYS.EMAILJS_TEMPLATE_ID,n),n}async saveEmailjsTemplateId(t){if(!t||typeof t!=`string`)return;let n=this.setEmailjsTemplateId(t);try{let t=this.getCurrentUser();await fetch(`${e.API_BASE}/settings`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({key:`emailjs`,value:{templateId:n},updatedBy:t?t.name||t.email:`Administrator`})})}catch(e){console.warn(`Failed to sync emailjs settings to D1:`,e)}return n}getInstituteSettings(){return{name:this.getInstituteName(),logoUrl:this.getInstituteLogo(),autzAppId:this.getAutzAppId(),emailjsTemplateId:this.getEmailjsTemplateId()}}async saveInstituteSettings(t){if(t){t.name&&this.setInstituteName(t.name),t.logo!==void 0&&this.setInstituteLogo(t.logo),t.autzAppId&&this.setAutzAppId(t.autzAppId),t.emailjsTemplateId&&this.setEmailjsTemplateId(t.emailjsTemplateId);try{let n=this.getCurrentUser();await fetch(`${e.API_BASE}/settings`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({key:`branding`,value:{name:this.getInstituteName(),logoUrl:this.getInstituteLogo(),autzAppId:this.getAutzAppId(),emailjsTemplateId:this.getEmailjsTemplateId()},updatedBy:n?n.name||n.email:`Administrator`})}),t.emailjsTemplateId&&await this.saveEmailjsTemplateId(t.emailjsTemplateId)}catch(e){console.warn(`Failed to sync branding settings to D1:`,e)}}}async exchangeAutzCode(t){if(!t)return{success:!1,error:`Missing authorization code from Single Sign-On`};try{let n=await fetch(`${e.API_BASE}/auth/login`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({code:t,appId:this.getAutzAppId()})}),r=await n.json();return n.ok&&r.success?(localStorage.setItem(e.STORAGE_KEYS.AUTH_USER,JSON.stringify(r.user)),localStorage.setItem(e.STORAGE_KEYS.AUTH_TOKEN,r.token),{success:!0,user:r.user,token:r.token}):{success:!1,error:r.error||`Authentication failed`}}catch(e){return console.error(`Autz login error:`,e),{success:!1,error:`Failed to connect to authentication backend`}}}getCurrentUser(){try{return JSON.parse(localStorage.getItem(e.STORAGE_KEYS.AUTH_USER))}catch{return null}}getAuthToken(){return localStorage.getItem(e.STORAGE_KEYS.AUTH_TOKEN)||``}async logout(){let t=this.getAuthToken();try{t&&await fetch(`${e.API_BASE}/auth/logout`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${t}`}})}catch{}localStorage.removeItem(e.STORAGE_KEYS.AUTH_USER),localStorage.removeItem(e.STORAGE_KEYS.AUTH_TOKEN),window.location.reload()}async getAllowedUsers(){try{let t=await fetch(`${e.API_BASE}/auth/users?_t=${Date.now()}`,{cache:`no-store`,headers:{"Cache-Control":`no-cache, no-store, must-revalidate`}});if(t.ok){let n=await t.json();if(Array.isArray(n))return localStorage.setItem(e.STORAGE_KEYS.ALLOWED_USERS,JSON.stringify(n)),n}}catch(e){console.warn(`D1 users fetch error, falling back to cache:`,e)}let t=[];try{let n=localStorage.getItem(e.STORAGE_KEYS.ALLOWED_USERS);t=n?JSON.parse(n):[]}catch{t=[]}return Array.isArray(t)&&t.length!==0||(t=[{email:`harunabdullahrakin@gmail.com`,name:`Harun Abdullah Rakin`,role:`Super Admin & Director`,division:`Institute Executive Council`,status:`Active`,addedDate:`2026-01-01`}],localStorage.setItem(e.STORAGE_KEYS.ALLOWED_USERS,JSON.stringify(t))),t}async syncAllowedUsersFromDb(){try{let t=await fetch(`${e.API_BASE}/auth/users?_t=${Date.now()}`,{cache:`no-store`,headers:{"Cache-Control":`no-cache, no-store, must-revalidate`}});if(t.ok){let n=await t.json();if(Array.isArray(n))return localStorage.setItem(e.STORAGE_KEYS.ALLOWED_USERS,JSON.stringify(n)),n}}catch(e){console.warn(`syncAllowedUsersFromDb notice:`,e)}}async addAllowedUser(t){if(!t||!t.email)return{success:!1,error:`Email is required`};let n=t.email.toLowerCase().trim();if(!n.includes(`@`))return{success:!1,error:`Please enter a valid email address`};let r=localStorage.getItem(e.STORAGE_KEYS.ALLOWED_USERS),i=r?JSON.parse(r):[];if(i.some(e=>e.email.toLowerCase().trim()===n))return{success:!1,error:`This email is already in the authorized list.`};let a={email:n,name:(t.name||n.split(`@`)[0]).trim(),role:(t.role||`Research Fellow`).trim(),division:(t.division||`Scientific Division`).trim(),addedDate:new Date().toISOString().split(`T`)[0],status:`Active`};i.unshift(a),localStorage.setItem(e.STORAGE_KEYS.ALLOWED_USERS,JSON.stringify(i));try{let t=this.getAuthToken(),n=await fetch(`${e.API_BASE}/auth/users`,{method:`POST`,headers:{"Content-Type":`application/json`,...t?{Authorization:`Bearer ${t}`}:{}},body:JSON.stringify(a)});if(n.ok){let e=await n.json();e&&e.user&&Object.assign(a,e.user)}}catch(e){console.warn(`D1 users sync error (safely retained locally):`,e)}return{success:!0,user:a}}async removeAllowedUser(t){let n=(t||``).toLowerCase().trim();if(n===`harunabdullahrakin@gmail.com`)return{success:!1,error:`Cannot remove primary Super Admin account.`};let r=localStorage.getItem(e.STORAGE_KEYS.ALLOWED_USERS),i=r?JSON.parse(r):[];i=i.filter(e=>e&&e.email&&e.email.toLowerCase().trim()!==n),localStorage.setItem(e.STORAGE_KEYS.ALLOWED_USERS,JSON.stringify(i));try{let t=this.getAuthToken(),r=await fetch(`${e.API_BASE}/auth/users?email=${encodeURIComponent(n)}&_t=${Date.now()}`,{method:`DELETE`,headers:{"Content-Type":`application/json`,...t?{Authorization:`Bearer ${t}`}:{}},body:JSON.stringify({email:n})});if(!r.ok){let e=await r.json().catch(()=>({}));console.warn(`D1 delete user response warning:`,e)}}catch(e){console.warn(`D1 delete user error:`,e)}return{success:!0}}async getDivisions(){try{let t=await fetch(`${e.API_BASE}/settings?_t=${Date.now()}`,{cache:`no-store`,headers:{"Cache-Control":`no-cache, no-store, must-revalidate`}});if(t.ok){let n=await t.json();if(Array.isArray(n.divisions)){let t=n.divisions.filter(e=>!r.includes(e.id));return localStorage.setItem(e.STORAGE_KEYS.DIVISIONS,JSON.stringify(t)),t}}}catch{}try{let t=localStorage.getItem(e.STORAGE_KEYS.DIVISIONS);if(t!==null){let e=JSON.parse(t);if(Array.isArray(e))return e.filter(e=>!r.includes(e.id))}}catch{}return[]}async saveDivision(t){let n=await this.getDivisions(),r=t.id||`div-`+Date.now().toString(36),i=n.findIndex(e=>e.id===r),a={...t,id:r,number:t.number||String(i>=0?i+1:n.length+1).padStart(2,`0`),tag:t.tag||(t.number||`01`)+` / RESEARCH DIVISION`,title:t.title||`Untitled Division`,desc:t.desc||``,image:t.image||`https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=800&q=80`,link:t.link||`/research`};i>=0?n[i]=a:n.push(a),localStorage.setItem(e.STORAGE_KEYS.DIVISIONS,JSON.stringify(n));try{let t=this.getCurrentUser(),r=t?t.name||t.email:`Administrator`;await fetch(e.API_BASE+`/settings`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({key:`divisions`,value:n,updatedBy:r})})}catch(e){console.warn(`Failed to sync divisions to D1:`,e)}return a}async deleteDivision(t){let n=await this.getDivisions();n=n.filter(e=>e.id!==t),localStorage.setItem(e.STORAGE_KEYS.DIVISIONS,JSON.stringify(n));try{let t=this.getCurrentUser(),r=t?t.name||t.email:`Administrator`;await fetch(e.API_BASE+`/settings`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({key:`divisions`,value:n,updatedBy:r})})}catch(e){console.warn(`Failed to sync divisions delete to D1:`,e)}return{success:!0,id:t}}async getCohorts(){try{let t=await fetch(`${e.API_BASE}/settings?_t=${Date.now()}`,{cache:`no-store`,headers:{"Cache-Control":`no-cache, no-store, must-revalidate`}});if(t.ok){let n=await t.json();if(Array.isArray(n.cohorts)){let t=n.cohorts.filter(e=>!i.includes(e.id)&&!i.includes(e.title));return localStorage.setItem(e.STORAGE_KEYS.COHORTS,JSON.stringify(t)),t}}}catch{}try{let t=localStorage.getItem(e.STORAGE_KEYS.COHORTS);if(t!==null){let e=JSON.parse(t);if(Array.isArray(e))return e.filter(e=>!i.includes(e.id)&&!i.includes(e.title))}}catch{}return[]}async saveCohort(t){let n=await this.getCohorts(),r=t.id||`cohort-`+Date.now().toString(36),i=n.findIndex(e=>e.id===r),a={...t,id:r,title:t.title||`Untitled Profile`,grade:t.grade||t.academicLevel||`Undergraduate / Graduate`,academicLevel:t.academicLevel||t.grade||`Undergraduate`,divisionScope:t.divisionScope||`All Research Tracks`,desc:t.desc||``,image:t.image||`https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80`,link:t.link||`/team#apply`,linkText:t.linkText||`Apply as Fellow`};i>=0?n[i]=a:n.push(a),localStorage.setItem(e.STORAGE_KEYS.COHORTS,JSON.stringify(n));try{let t=this.getCurrentUser(),r=t?t.name||t.email:`Administrator`;await fetch(e.API_BASE+`/settings`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({key:`cohorts`,value:n,updatedBy:r})})}catch(e){console.warn(`Failed to sync cohorts to D1:`,e)}return a}async deleteCohort(t){let n=await this.getCohorts();n=n.filter(e=>e.id!==t),localStorage.setItem(e.STORAGE_KEYS.COHORTS,JSON.stringify(n));try{let t=this.getCurrentUser(),r=t?t.name||t.email:`Administrator`;await fetch(e.API_BASE+`/settings`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({key:`cohorts`,value:n,updatedBy:r})})}catch(e){console.warn(`Failed to sync cohorts delete to D1:`,e)}return{success:!0,id:t}}async getPosts(r={}){let i=new Set(n);try{let t=localStorage.getItem(e.STORAGE_KEYS.DELETED_POSTS);if(t){let e=JSON.parse(t);Array.isArray(e)&&e.forEach(e=>i.add(e))}}catch{}let a=[];try{let t=localStorage.getItem(e.STORAGE_KEYS.POSTS);a=t?JSON.parse(t):[],Array.isArray(a)||(a=[])}catch{a=[]}a=a.filter(e=>e&&!i.has(e.id));let o=localStorage.getItem(e.STORAGE_KEYS.POSTS_INITIALIZED)===`true`;try{let n=r.includeDrafts?`?includeDrafts=true`:``,s=n?`&`:`?`,c=await fetch(`${e.API_BASE}/posts${n}${s}_t=${Date.now()}`,{cache:`no-store`,headers:{"Cache-Control":`no-cache, no-store, must-revalidate`}});if(c.ok){let n=await c.json();if(Array.isArray(n)){let s=n.filter(e=>e&&!i.has(e.id)),c=new Set(s.map(e=>e.id)),l=a.filter(e=>!c.has(e.id)&&!i.has(e.id)),u=[...s,...l];return!o&&u.length===0&&i.size===0&&(u=[...t],localStorage.setItem(e.STORAGE_KEYS.POSTS_INITIALIZED,`true`)),localStorage.setItem(e.STORAGE_KEYS.POSTS,JSON.stringify(u)),r.includeDrafts?u:u.filter(e=>e.published!==!1)}}}catch(e){console.warn(`D1 posts fetch error, falling back to cache:`,e)}return r.includeDrafts?a:a.filter(e=>e.published!==!1)}async getPostBySlugOrId(n){if(!n)return null;try{let t=await fetch(`${e.API_BASE}/posts/${encodeURIComponent(n)}?_t=${Date.now()}`,{cache:`no-store`,headers:{"Cache-Control":`no-cache, no-store, must-revalidate`}});if(t.ok){let e=await t.json();if(e&&e.id)return e}}catch{}let r=(await this.getPosts({includeDrafts:!0})).find(e=>e.slug===n||e.id===n);return r||=t.find(e=>e.slug===n||e.id===n),r||null}async savePost(t){let n=await this.getPosts({includeDrafts:!0}),r=this.getCurrentUser(),i=r?r.name||r.email:`Institute Editor`,a=new Date().toISOString(),o,s=n.findIndex(e=>e.id===t.id);if(s>=0)o={...n[s],...t,updatedAt:a,updatedBy:i},n[s]=o;else{let e=t.id||`crii-paper-${Date.now()}`,r=(t.slug||t.title||`paper`).toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/(^-|-$)+/g,``);o={...t,id:e,slug:r,date:t.date||a.split(`T`)[0],updatedAt:a,updatedBy:i,downloads:t.downloads||0,citations:t.citations||0,published:t.published===void 0||t.published},n.unshift(o)}o.featured&&n.forEach(e=>{e.id!==o.id&&(e.featured=!1)}),localStorage.setItem(e.STORAGE_KEYS.POSTS,JSON.stringify(n));try{let t=await fetch(`${e.API_BASE}/posts`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(o)});if(t.ok){let r=await t.json();Object.assign(o,r),s>=0?n[s]=o:n[0]=o,localStorage.setItem(e.STORAGE_KEYS.POSTS,JSON.stringify(n))}else{let e=await t.json().catch(()=>({}));console.warn(`Server returned error when syncing post:`,e)}}catch(e){console.warn(`Failed to sync post to D1:`,e)}return o}async createPost(e){return this.savePost(e)}async deletePost(t){if(!t)return!0;let n=[];try{let t=localStorage.getItem(e.STORAGE_KEYS.DELETED_POSTS);if(t){let e=JSON.parse(t);Array.isArray(e)&&(n=e)}}catch{}n.includes(t)||(n.push(t),localStorage.setItem(e.STORAGE_KEYS.DELETED_POSTS,JSON.stringify(n))),localStorage.setItem(e.STORAGE_KEYS.POSTS_INITIALIZED,`true`);let r=[];try{let n=localStorage.getItem(e.STORAGE_KEYS.POSTS);r=n?JSON.parse(n):[],Array.isArray(r)&&(r=r.filter(e=>e.id!==t),localStorage.setItem(e.STORAGE_KEYS.POSTS,JSON.stringify(r)))}catch{}try{localStorage.removeItem(`crii_doc_draft_`+t)}catch{}try{await fetch(`${e.API_BASE}/posts/${encodeURIComponent(t)}`,{method:`DELETE`})}catch(e){console.warn(`Failed to delete post from D1:`,e)}return!0}async togglePostPublish(t){let n=await this.getPosts({includeDrafts:!0}),r=n.find(e=>e.id===t);if(r){r.published=!r.published;let t=this.getCurrentUser();r.updatedAt=new Date().toISOString(),r.updatedBy=t?t.name||t.email:`Administrator`,localStorage.setItem(e.STORAGE_KEYS.POSTS,JSON.stringify(n));try{await fetch(`${e.API_BASE}/posts`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(r)})}catch(e){console.warn(`Failed to sync publish state to D1:`,e)}return r}return null}async getInternsData(){try{let t=await fetch(`${e.API_BASE}/interns?_t=${Date.now()}`,{cache:`no-store`,headers:{"Cache-Control":`no-cache, no-store, must-revalidate`}});if(t.ok){let n=await t.json();if(n&&Array.isArray(n.activeInterns))return localStorage.setItem(e.STORAGE_KEYS.INTERNS,JSON.stringify(n)),n}}catch(e){console.warn(`D1 interns fetch error, falling back to cache:`,e)}let t=localStorage.getItem(e.STORAGE_KEYS.INTERNS);return t?JSON.parse(t):{activeInterns:[],applications:[]}}async getCoreTeamMembers(){return((await this.getInternsData()).activeInterns||[]).filter(e=>e.isTeamMember)}async getFellowsAndInterns(){return((await this.getInternsData()).activeInterns||[]).filter(e=>!e.isTeamMember)}async saveIntern(t){let n=await this.getInternsData(),r=t.id||`crii-${t.isTeamMember?`team`:`int`}-${Date.now()}`,i=new Date().toISOString(),a={...t,id:r,name:t.name||`Researcher`,email:t.email||``,avatar:t.avatar||`https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,university:t.university||`CRII`,degree:t.degree||``,division:t.division||`Space & Astrophysics`,role:t.role||`Research Fellow`,cohort:t.cohort||`Spring 2026`,status:t.status||`Active`,bio:t.bio||``,socials:t.socials||{},projects:Array.isArray(t.projects)?t.projects:[],isTeamMember:!!t.isTeamMember,orderIndex:Number(t.orderIndex)||10,updatedAt:i},o=n.activeInterns.findIndex(e=>e.id===r);o>=0?n.activeInterns[o]=a:n.activeInterns.push(a),n.activeInterns.sort((e,t)=>e.isTeamMember===t.isTeamMember?(e.orderIndex||99)-(t.orderIndex||99):e.isTeamMember?-1:1);try{let t=await fetch(`${e.API_BASE}/interns`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(a)});if(t.ok){let e=await t.json();Object.assign(a,e)}}catch(e){console.warn(`Failed to sync intern to D1:`,e)}return localStorage.setItem(e.STORAGE_KEYS.INTERNS,JSON.stringify(n)),a}async deleteIntern(t){let n=await this.getInternsData();n.activeInterns=(n.activeInterns||[]).filter(e=>e.id!==t),localStorage.setItem(e.STORAGE_KEYS.INTERNS,JSON.stringify(n));try{await fetch(`${e.API_BASE}/interns/${t}`,{method:`DELETE`})}catch(e){console.warn(`Failed to delete intern from D1:`,e)}return!0}async deleteApplication(t){let n=await this.getInternsData();n.applications=(n.applications||[]).filter(e=>e.id!==t),localStorage.setItem(e.STORAGE_KEYS.INTERNS,JSON.stringify(n));try{await fetch(`${e.API_BASE}/applications?id=${encodeURIComponent(t)}`,{method:`DELETE`})}catch(e){console.warn(`Failed to delete application from D1:`,e)}return!0}async submitInternApplication(t){let n=await this.getInternsData(),r={...t,id:t.id||`app-2026-${Date.now()}-${Math.floor(100+Math.random()*900)}`,appliedDate:new Date().toISOString().split(`T`)[0],status:`Under Review`};Array.isArray(n.applications)||(n.applications=[]),n.applications=n.applications.filter(e=>e.id!==r.id),n.applications.unshift(r),localStorage.setItem(e.STORAGE_KEYS.INTERNS,JSON.stringify(n));try{let t=await fetch(`${e.API_BASE}/applications`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(r)});if(!t.ok)throw Error(`applications endpoint status `+t.status)}catch{try{await fetch(`${e.API_BASE}/interns/apply`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(r)})}catch(e){console.warn(`Failed to sync application to D1 endpoints:`,e)}}return r}async updateApplicationStatus(t,n,r={}){let i=this.getCurrentUser(),a=i?i.name||i.email:`Administrator`,{role:o=`Research Fellow`,division:s=`Institute Research Council`,grantLoginAccess:c=!0,addToRoster:l=!0}=r;try{await fetch(`${e.API_BASE}/applications`,{method:`PUT`,headers:{"Content-Type":`application/json`},body:JSON.stringify({id:t,status:n,reviewedBy:a,role:o,division:s,grantLoginAccess:c,addToRoster:l})})}catch(e){console.warn(`D1 application status sync notice:`,e)}if(n===`Accepted`&&c)try{let n=((await this.getInternsData()).applications||[]).find(e=>e.id===t);n&&n.email&&await fetch(`${e.API_BASE}/auth/users`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({email:n.email,name:n.fullName,role:o,division:s})})}catch(e){console.warn(`Direct allowed_users sync notice:`,e)}let u=await this.getInternsData(),d=u.applications.find(e=>e.id===t);return d?(d.status=n,d.reviewedBy=a,d.reviewedAt=new Date().toISOString(),n===`Accepted`&&!u.activeInterns.some(e=>e.email===d.email)&&l&&await this.saveIntern({name:d.fullName,email:d.email,university:d.university||`Independent Research`,degree:d.fieldOfStudy||`Fellow Researcher`,division:s||d.preferredDivision||`Institute Research Council`,role:o||`Research Fellow`,cohort:`Fellowship Intake `+new Date().getFullYear(),status:`Active`,isTeamMember:!1,bio:d.statement?d.statement.slice(0,140)+`...`:`Autonomous Fellow Researcher at CRII`}),localStorage.setItem(e.STORAGE_KEYS.INTERNS,JSON.stringify(u)),d):null}async getDatasets(){try{let t=await fetch(`${e.API_BASE}/datasets?_t=${Date.now()}`,{cache:`no-store`,headers:{"Cache-Control":`no-cache, no-store, must-revalidate`}});if(t.ok){let n=await t.json();if(Array.isArray(n)&&n.length>0)return localStorage.setItem(e.STORAGE_KEYS.DATASETS,JSON.stringify(n)),n}}catch(e){console.warn(`Datasets fetch error:`,e)}let t=[];try{let n=localStorage.getItem(e.STORAGE_KEYS.DATASETS);t=n?JSON.parse(n):[],Array.isArray(t)||(t=[])}catch{t=[]}if(t.length>0)return t;let n=[{id:`ds-crii-001`,title:`TRAPPIST-1e Synthetic Atmospheric Transmission Spectra (0.6 - 12.0 μm)`,category:`Space & Astrophysics`,version:`v1.4.0`,updated:`2026-03-12`,format:`CSV & HDF5`,size:`42.8 MB`,license:`CC-BY 4.0 Open Science`,leadResearcher:`Aria Rahman`,description:`Synthetic radiative transfer transits modeled under 6 distinct atmospheric regimes.`,parameters:[`Wavelength (μm)`,`Transit Depth (ppm)`,`1-sigma Uncertainty`,`Molecular Absorption`,`Stellar Flare Residual`],previewRows:[{wavelength_um:.852,transit_depth_ppm:5280.12,uncertainty:12.4,primary_absorber:`H2O / Rayleigh`,regime:`Archean`},{wavelength_um:1.414,transit_depth_ppm:5315.4,uncertainty:14.1,primary_absorber:`H2O`,regime:`Archean`},{wavelength_um:3.31,transit_depth_ppm:5392.88,uncertainty:18.2,primary_absorber:`CH4`,regime:`Archean`},{wavelength_um:4.28,transit_depth_ppm:5540.6,uncertainty:21,primary_absorber:`CO2`,regime:`Archean`},{wavelength_um:9.6,transit_depth_ppm:5304.15,uncertainty:28.5,primary_absorber:`O3 (Trace)`,regime:`Archean`}]},{id:`ds-crii-002`,title:`Ediacaran-Cambrian Metazoan Ortholog Calibrations & Fossil Node Chronologies`,category:`Ancient Biology & Paleontology`,version:`v2.1.0`,updated:`2026-02-25`,format:`JSON & FASTA`,size:`18.3 MB`,license:`CC-BY 4.0 Open Science`,leadResearcher:`Shayan Debnath`,description:`Curated dataset comprising 124 orthologous ribosomal and mitochondrial protein alignments with stratigraphic calibrations.`,parameters:[`Gene Family ID`,`Phylogenetic Clade`,`Minimum Node Age (Ma)`,`Maximum Node Age (Ma)`,`Stratigraphic Reference`],previewRows:[{clade:`Basal Bilateria`,node_min_ma:575.4,node_max_ma:612,calibration_marker:`Lantian / Doushantuo`,tree_support_posterior:.98},{clade:`Ecdysozoa`,node_min_ma:541,node_max_ma:560.2,calibration_marker:`Cloudina / Kimberella`,tree_support_posterior:.95},{clade:`Lophotrochozoa`,node_min_ma:538.8,node_max_ma:558,calibration_marker:`Small Shelly Fossils (SSF)`,tree_support_posterior:.96},{clade:`Deuterostomia`,node_min_ma:526,node_max_ma:545.1,calibration_marker:`Chengjiang Vetulicolians`,tree_support_posterior:.92}]}];return localStorage.setItem(e.STORAGE_KEYS.DATASETS,JSON.stringify(n)),n}async createDataset(t){let n=await this.getDatasets(),r={...t,id:t.id||`ds-crii-${Date.now().toString(36)}`,updated:new Date().toISOString().split(`T`)[0],version:t.version||`v1.0.0`},i=n.findIndex(e=>e.id===r.id);i>=0?n[i]=r:n.unshift(r),localStorage.setItem(e.STORAGE_KEYS.DATASETS,JSON.stringify(n));try{let t=await fetch(`${e.API_BASE}/datasets`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(r)});if(t.ok){let e=await t.json();Object.assign(r,e)}}catch(e){console.warn(`Failed to save dataset to D1:`,e)}return r}async deleteDataset(t){if(!t)return!0;let n=await this.getDatasets();n=n.filter(e=>e.id!==t),localStorage.setItem(e.STORAGE_KEYS.DATASETS,JSON.stringify(n));try{await fetch(`${e.API_BASE}/datasets/${encodeURIComponent(t)}`,{method:`DELETE`})}catch(e){console.warn(`Failed to delete dataset from D1:`,e)}return!0}async getStats(){let e=await this.getPosts({includeDrafts:!0}),t=await this.getInternsData(),n=await this.getDatasets().catch(()=>[]);return{publishedPapers:e.filter(e=>e.published).length,activeInterns:(t.activeInterns||[]).length,pendingApplications:(t.applications||[]).filter(e=>e.status===`Pending`||e.status===`Under Review`).length,openDatasets:n.length}}async getImprovMXKeys(){try{let e=await fetch(`/api/improvmx?action=keys`);return e.ok?await e.json():{success:!1,keys:[]}}catch{return{success:!1,keys:[]}}}async addImprovMXKey(e,t){try{return await(await fetch(`/api/improvmx`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`add_key`,label:e,key:t})})).json()}catch(e){return{error:e.message}}}async deleteImprovMXKey(e){try{return await(await fetch(`/api/improvmx?action=delete_key&targetKeyId=${encodeURIComponent(e)}`,{method:`DELETE`})).json()}catch(e){return{error:e.message}}}async getImprovMXAccount(e){try{let t=`/api/improvmx?action=account${e?`&keyId=`+encodeURIComponent(e):``}`;return await(await fetch(t)).json()}catch(e){return{error:e.message}}}async getImprovMXDomains(e){try{let t=`/api/improvmx?action=domains${e?`&keyId=`+encodeURIComponent(e):``}`;return await(await fetch(t)).json()}catch(e){return{error:e.message}}}async checkImprovMXDomain(e,t){try{let n=`/api/improvmx?action=check&domain=${encodeURIComponent(e)}${t?`&keyId=`+encodeURIComponent(t):``}`;return await(await fetch(n)).json()}catch(e){return{error:e.message}}}async getImprovMXAliases(e,t){try{let n=`/api/improvmx?action=aliases&domain=${encodeURIComponent(e)}${t?`&keyId=`+encodeURIComponent(t):``}`;return await(await fetch(n)).json()}catch(e){return{error:e.message}}}async createImprovMXAlias({domain:e,alias:t,forward:n,keyId:r}){try{return await(await fetch(`/api/improvmx`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`create_alias`,domain:e,alias:t,forward:n,keyId:r})})).json()}catch(e){return{error:e.message}}}async updateImprovMXAlias({domain:e,aliasId:t,forward:n,keyId:r}){try{return await(await fetch(`/api/improvmx`,{method:`PUT`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`update_alias`,domain:e,aliasId:t,forward:n,keyId:r})})).json()}catch(e){return{error:e.message}}}async deleteImprovMXAlias({domain:e,aliasId:t,keyId:n}){try{let r=`/api/improvmx?action=delete_alias&domain=${encodeURIComponent(e)}&aliasId=${encodeURIComponent(t)}${n?`&keyId=`+encodeURIComponent(n):``}`;return await(await fetch(r,{method:`DELETE`})).json()}catch(e){return{error:e.message}}}async getDbSchema(){try{let t=localStorage.getItem(e.STORAGE_KEYS.AUTH_TOKEN),n={};t&&(n.Authorization=`Bearer `+t);let r=await fetch(`/api/sql?action=schema`,{headers:n});return r.ok?await r.json():{success:!1,error:(await r.json().catch(()=>({}))).error||`Failed to fetch database schema`}}catch(e){return{success:!1,error:e.message}}}async executeSql(t){try{let n=localStorage.getItem(e.STORAGE_KEYS.AUTH_TOKEN),r={"Content-Type":`application/json`};n&&(r.Authorization=`Bearer `+n);let i=await fetch(`/api/sql`,{method:`POST`,headers:r,body:JSON.stringify({query:t})}),a=await i.json().catch(()=>({}));return i.ok?a:{success:!1,error:a.error||`SQL query execution failed`,duration:a.duration}}catch(e){return{success:!1,error:e.message}}}},document.addEventListener(`DOMContentLoaded`,()=>{let e=(e,t)=>{try{e()}catch(e){console.error(`[CRII Core] Error initializing ${t}:`,e)}};e(u,`initThemeEngine`),e(f,`initBrandingAndNavbar`),e(a,`initHeroCustomization`),e(c,`initScrollRevealEffects`),e(l,`initFestiveSeasonalTheme`),e(p,`initCustomCursor`),e(m,`initCookieConsent`),e(h,`initMobileNav`),e(g,`initAutoHidingNavbar`),e(ee,`initUserSessionState`),e(re,`initToastContainer`),e(oe,`initFeaturedArticles`),e(v,`initDivisions`),e(y,`initCohorts`),e(se,`initHomeTeam`),e(te,`initGoogleTranslateAndLang`),e(ne,`initSearchOverlay`)});async function a(){if(!window.CRII_API)return;if(typeof window.CRII_API.syncSettingsFromDb==`function`)try{await window.CRII_API.syncSettingsFromDb()}catch{}let e=window.CRII_API.getHeroSettings();if(!e)return;let t=e.mediaType||`both`,n=e.selectionMode||`random`,r=document.getElementById(`heroBgImageLayer`),i=document.getElementById(`heroVideo`),a=[`https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=85`,`https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=85`,`https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1920&q=85`,`https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=85`,`https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=85`],s=[`assets/hero-bg.mp4`,`https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4`,`https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-starfield-in-space-41539-large.mp4`,`https://assets.mixkit.co/videos/preview/mixkit-planet-earth-rotating-in-space-39982-large.mp4`],c=Array.isArray(e.backgroundImages)&&e.backgroundImages.length>0?e.backgroundImages:a,l=Array.isArray(e.backgroundVideos)&&e.backgroundVideos.length>0?e.backgroundVideos:e.videoUrl?[e.videoUrl,...s.slice(1)]:s,u=c[0];u=n===`random`?c[Math.floor(Math.random()*c.length)]:c[Math.max(0,Math.min(Number(e.fixedImageIndex)||0,c.length-1))]||c[0];let d=l[0];d=n===`random`?l[Math.floor(Math.random()*l.length)]:l[Math.max(0,Math.min(Number(e.fixedVideoIndex)||0,l.length-1))]||l[0];let f=e.imageOpacity===void 0?.4:e.imageOpacity;if(t===`image`)i&&(i.pause(),i.style.display=`none`,i.style.opacity=`0`),r&&(r.style.backgroundImage=`url('${u}')`,r.style.backgroundSize=`cover`,r.style.backgroundPosition=`center`,r.style.display=`block`,r.style.opacity=String(f));else if(t===`video`){if(r&&(r.style.backgroundImage=`none`,r.style.display=`none`,r.style.opacity=`0`),i){i.style.display=`block`,i.style.opacity=`1`,i.style.background=`#060b16`,i.style.transition=`opacity 0.6s ease`,((i.querySelector(`source`)?.getAttribute(`src`)||i.src)!==d||i.readyState===0)&&(i.innerHTML=`<source src="${d}" type="video/mp4">`,i.load()),i.onerror=()=>{r&&(r.style.backgroundImage=`none`,r.style.display=`none`)},i.muted=!0;let e=i.play();e!==void 0&&e.catch(()=>{})}}else r&&(r.style.backgroundImage=`url('${u}')`,r.style.backgroundSize=`cover`,r.style.backgroundPosition=`center`,r.style.display=`block`,r.style.opacity=String(Math.min(f,.35))),i&&(i.style.display=`block`,i.style.opacity=`0.70`,((i.querySelector(`source`)?.getAttribute(`src`)||i.src)!==d||i.readyState===0)&&(i.innerHTML=`<source src="${d}" type="video/mp4">`,i.load()),i.muted=!0,i.play().catch(()=>{i.muted=!0,i.play().catch(()=>{})}));if(i&&i.style.display!==`none`)o(i,e);else{let e=document.getElementById(`heroSoundToggle`);e&&(e.style.display=`none`)}let p=document.querySelector(`.mockup-hero-title`);if(p&&e.fontFamily){let t={Eyekons:`'Eyekons', Georgia, serif`,"Playfair Display":`'Playfair Display', Georgia, serif`,"Cinzel Decorative":`'Cinzel Decorative', 'Cinzel', Georgia, serif`,"Space Grotesk":`'Space Grotesk', -apple-system, sans-serif`,Syne:`'Syne', -apple-system, sans-serif`,Outfit:`'Outfit', -apple-system, sans-serif`,"system-ui":`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`}[e.fontFamily]||e.fontFamily;p.style.setProperty(`font-family`,t,`important`)}let m=e.blurPx===void 0?12:e.blurPx,h=e.overlayOpacity===void 0?.55:e.overlayOpacity;document.documentElement.style.setProperty(`--hero-blur`,`${m}px`),document.documentElement.style.setProperty(`--hero-overlay-bg`,`rgba(10, 15, 30, ${h})`);let g=document.querySelectorAll(`.mockup-page-hero`);g&&g.length>0&&g.forEach(e=>{let t=e.querySelector(`.mockup-page-hero-bg-layer`);!t&&typeof document.createElement==`function`&&(t=document.createElement(`div`),t.className=`mockup-page-hero-bg-layer`,e.prepend?e.prepend(t):e.insertBefore&&e.firstChild?e.insertBefore(t,e.firstChild):e.appendChild&&e.appendChild(t));let n=e.querySelector(`.mockup-page-hero-bg-overlay`);if(!n&&typeof document.createElement==`function`&&(n=document.createElement(`div`),n.className=`mockup-page-hero-bg-overlay`,t&&t.insertAdjacentElement?t.insertAdjacentElement(`afterend`,n):e.appendChild&&e.appendChild(n)),t&&t.style){let e=c[Math.floor(Math.random()*c.length)];t.style.backgroundImage=`url('${e}')`,t.style.opacity=String(f||.38)}})}window.initHeroCustomization=a,window.initHeroSound=o;function o(e,t){if(!e)return;let n=document.getElementById(`heroSoundToggle`),r=document.getElementById(`heroSoundIcon`);function i(e){n&&(e?(n.classList.remove(`is-muted`),n.classList.add(`is-playing`),n.setAttribute(`title`,`Mute Sound`),n.setAttribute(`aria-label`,`Mute Sound`),r&&(r.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`)):(n.classList.remove(`is-playing`),n.classList.add(`is-muted`),n.setAttribute(`title`,`Unmute Sound`),n.setAttribute(`aria-label`,`Unmute Sound`),r&&(r.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`)))}let a=localStorage.getItem(`crii_hero_sound_muted`)===`1`;if(n&&(n.style.display=`inline-flex`,i(!a),n.onclick=t=>{t.preventDefault(),t.stopPropagation(),!e.muted&&e.volume>0?(e.muted=!0,localStorage.setItem(`crii_hero_sound_muted`,`1`),i(!1)):(e.muted=!1,e.volume=.85,e.play().catch(()=>{}),localStorage.removeItem(`crii_hero_sound_muted`),i(!0))}),a)e.muted=!0,i(!1);else{e.muted=!1,e.volume=.85;let t=e.play();t!==void 0&&t.then(()=>{i(!0)}).catch(()=>{e.muted=!0,e.play().catch(()=>{}),i(!0);let t=()=>{e&&localStorage.getItem(`crii_hero_sound_muted`)!==`1`&&(e.muted=!1,e.volume=.85,e.play().catch(()=>{}),i(!0)),[`click`,`pointerdown`,`keydown`,`scroll`,`touchstart`].forEach(e=>{window.removeEventListener(e,t,{capture:!0})})};[`click`,`pointerdown`,`keydown`,`scroll`,`touchstart`].forEach(e=>{window.addEventListener(e,t,{capture:!0,once:!0})})})}}var s=null;function c(){if(window.matchMedia(`(prefers-reduced-motion: reduce)`).matches){document.querySelectorAll(`.scroll-reveal, .scroll-reveal-scale, .scroll-reveal-left, .scroll-reveal-right`).forEach(e=>e.classList.add(`is-revealed`));return}let e=[`.mockup-section-header`,`.divisions-header`,`.cohort-header`,`.editorial-header`,`.editorial-spotlight-card`,`.editorial-post-card`,`.division-card`,`.cohort-card`,`.feature-card`,`.repo-card`,`.mockup-mentor-card`,`.mockup-stats-grid > *`,`.lead-copy`,`.mockup-cta-card`,`.footer-top-grid > *`];function t(){e.forEach(e=>{document.querySelectorAll(e).forEach(e=>{if(!e.classList.contains(`scroll-reveal`)&&!e.classList.contains(`scroll-reveal-scale`)){e.classList.add(`scroll-reveal`);let t=e.parentElement;if(t&&(t.classList.contains(`divisions-cards-grid`)||t.classList.contains(`cohort-cards-grid`)||t.classList.contains(`editorial-posts-grid`)||t.classList.contains(`mockup-stats-grid`))){let n=Array.from(t.children).indexOf(e);e.style.transitionDelay=`${Math.min(n*.1,.4)}s`}}})}),s||=new IntersectionObserver((e,t)=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add(`is-revealed`),t.unobserve(e.target))})},{root:null,rootMargin:`0px 0px -40px 0px`,threshold:.12}),document.querySelectorAll(`.scroll-reveal:not(.is-revealed), .scroll-reveal-scale:not(.is-revealed), .scroll-reveal-left:not(.is-revealed), .scroll-reveal-right:not(.is-revealed)`).forEach(e=>s.observe(e))}t(),window.refreshScrollAnimations=t}function l(){let e=(window.location.pathname||``).toLowerCase();if(e.includes(`portal`)||e.includes(`login`)||document.body.classList.contains(`portal-body`)||document.querySelector(`.portal-sidebar`))return;let t=window.CRII_API&&window.CRII_API.getFestiveSettings?window.CRII_API.getFestiveSettings():{mode:`always`,theme:`holi`,intensity:.7},n=new URLSearchParams(window.location.search),r=n.get(`theme`)||n.get(`festive`),i=new Date,a=i.getMonth(),o=i.getDate(),s=`holi`,c=!1;a===11||a===0&&o<=10?(s=`christmas`,c=!0):a===1&&o>=15||a===2?(s=`holi`,c=!0):(a===3||a===4)&&(s=`cherry-blossom`,c=!0);let l=t.theme||`holi`,u=!1;r?r===`none`||r===`disabled`?u=!1:(u=!0,l=r):t.mode===`always`?(u=!0,l=t.theme||`holi`):t.mode===`disabled`?u=!1:t.mode===`auto`&&(u=c,l=s);let d=t.intensity||.72;document.documentElement.style.setProperty(`--festive-intensity`,d),[`theme-festive-active`,`theme-holi`,`theme-christmas`,`theme-cherry-blossom`,`theme-eid`,`theme-festival`].forEach(e=>{document.documentElement.classList.remove(e),document.body.classList.remove(e)});let f=document.getElementById(`holiPillToggle`);if(f&&f.remove(),!u){document.querySelectorAll(`.festive-bg-layer, .holi-splatter-bg`).forEach(e=>e.remove());return}document.documentElement.classList.add(`theme-festive-active`,`theme-${l}`),document.body.classList.add(`theme-festive-active`,`theme-${l}`),p(l);function p(e){if([{sel:`.mockup-hero-section`,variant:1},{sel:`.mockup-editorial-section`,variant:2},{sel:`.mockup-divisions-section`,variant:3},{sel:`.mockup-cohort-section`,variant:2},{sel:`.mockup-repo-section`,variant:1},{sel:`.mockup-institute-section`,variant:3},{sel:`.mockup-page-hero`,variant:1},{sel:`.mockup-page-content`,variant:2},{sel:`.research-layout`,variant:2},{sel:`.blog-layout`,variant:2},{sel:`.contact-section`,variant:3}].forEach(t=>{let n=document.querySelector(t.sel);if(n&&!n.querySelector(`.festive-bg-layer`)){let r=m(e,t.variant);n.prepend(r)}}),!document.getElementById(`globalFestiveBgLayer`)){let t=m(e,1);t.id=`globalFestiveBgLayer`,t.className=`festive-global-bg-layer`,document.body.prepend(t)}}function m(e,t){let n=document.createElement(`div`);return n.className=`festive-bg-layer`,n.setAttribute(`aria-hidden`,`true`),n.innerHTML=e===`holi`?h(t):e===`christmas`?g():e===`cherry-blossom`?ee():e===`eid`?_(t):te(),n}function h(e){let t=`
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
    `,t=[`❄`,`❅`,`✻`,`•`,`❆`,`❄`];for(let n=0;n<22;n++){let r=Math.round(Math.random()*96),i=(7+Math.random()*9).toFixed(1),a=(Math.random()*8).toFixed(1),o=(.75+Math.random()*.95).toFixed(2),s=t[n%t.length];e+=`<span class="festive-snow-item" style="left:${r}%; font-size:${o}rem; animation-duration:${i}s; animation-delay:${a}s;">${s}</span>`}return e}function ee(){let e=`
      <div class="christmas-glow-orb" style="top:-50px; left:10%; width:440px; height:440px; background:radial-gradient(circle, rgba(244,63,94,0.22) 0%, transparent 70%);"></div>
      <div class="christmas-glow-orb" style="bottom:-60px; right:8%; width:460px; height:460px; background:radial-gradient(circle, rgba(251,113,133,0.20) 0%, transparent 70%);"></div>
    `,t=[`🌸`,`🌸`,`💮`];for(let n=0;n<18;n++){let r=Math.round(Math.random()*94),i=(8+Math.random()*8).toFixed(1),a=(Math.random()*7).toFixed(1),o=(.85+Math.random()*.7).toFixed(2),s=t[n%t.length];e+=`<span class="festive-sakura-petal" style="left:${r}%; font-size:${o}rem; animation-duration:${i}s; animation-delay:${a}s;">${s}</span>`}return e}function _(e){let t=`
      <div class="festive-eid-crescent">🌙</div>
      <div class="christmas-glow-orb" style="top:-30px; right:15%; width:360px; height:360px; background:radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 70%);"></div>
      <div class="christmas-glow-orb" style="bottom:-40px; left:8%; width:340px; height:340px; background:radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%);"></div>
    `,n=[`✨`,`⭐`,`✦`,`★`];for(let e=0;e<8;e++){let r=Math.round(8+e*11+Math.random()*5),i=Math.round(5+e*12+Math.random()*5),a=(2.2+e%3*.8).toFixed(1),o=(e*.35).toFixed(1),s=(.75+e%3*.25).toFixed(2),c=n[e%n.length];t+=`<span class="festive-star" style="top:${r}%; left:${i}%; font-size:${s}rem; animation-duration:${a}s; animation-delay:${o}s;">${c}</span>`}return t}function te(){let e=`
      <div class="christmas-glow-orb" style="top:10%; left:20%; width:400px; height:400px; background:radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%);"></div>
      <div class="christmas-glow-orb" style="bottom:10%; right:15%; width:420px; height:420px; background:radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%);"></div>
    `,t=[`#ec4899`,`#8b5cf6`,`#06b6d4`,`#10b981`,`#f59e0b`,`#3b82f6`,`#f43f5e`];for(let n=0;n<28;n++){let r=Math.round(Math.random()*95),i=(5+Math.random()*7).toFixed(1),a=(Math.random()*6).toFixed(1),o=Math.round(8+Math.random()*10),s=Math.round(12+Math.random()*12),c=t[n%t.length];e+=`<div class="festive-confetti-piece" style="left:${r}%; width:${o}px; height:${s}px; background:${c}; border-radius:${Math.random()>.5?`2px`:`50%`}; animation-duration:${i}s; animation-delay:${a}s;"></div>`}return e}}function u(){d(localStorage.getItem(`crii_theme_mode`)||`light`),document.querySelectorAll(`.theme-toggle-btn`).forEach(e=>{e.addEventListener(`click`,()=>{d((document.documentElement.getAttribute(`data-theme`)||`light`)===`light`?`dark`:`light`)})})}function d(e){document.documentElement.setAttribute(`data-theme`,e),localStorage.setItem(`crii_theme_mode`,e)}function f(){if(!window.CRII_API)return;let e=window.CRII_API.getInstituteName(),t=window.CRII_API.getInstituteLogo()||`assets/curiomas-no-bg.png`;document.querySelectorAll(`.brand-title`).forEach(t=>{t.innerText=e}),t&&document.querySelectorAll(`.brand-logo-container`).forEach(e=>{e.innerHTML=`<img src="${t}" alt="CRII Logo" class="brand-logo-img" style="width:36px; height:36px; object-fit:contain;">`})}function p(){document.querySelectorAll(`.custom-cursor-dot, .custom-cursor-ring`).forEach(e=>e.remove())}function m(){if(localStorage.getItem(`crii_cookie_consent_v1`))return;let e=document.createElement(`div`);e.className=`cookie-banner`,e.innerHTML=`
    <div class="cookie-text">
      We use strictly essential local cookies and session storage to verify research access and provide reproducible data methods.
    </div>
    <div class="cookie-actions">
      <button id="acceptCookiesBtn" class="btn btn-primary btn-sm">Accept All</button>
      <button id="closeCookiesBtn" class="btn btn-secondary btn-sm">Dismiss</button>
    </div>
  `,document.body.appendChild(e),setTimeout(()=>e.classList.add(`show`),600);let t=e.querySelector(`#acceptCookiesBtn`),n=e.querySelector(`#closeCookiesBtn`),r=()=>{localStorage.setItem(`crii_cookie_consent_v1`,`accepted`),e.classList.remove(`show`),setTimeout(()=>e.remove(),400)};t&&t.addEventListener(`click`,r),n&&n.addEventListener(`click`,r)}function h(){let e=document.getElementById(`menuToggleBtn`)||document.querySelector(`.menu-toggle`),t=document.getElementById(`mainNavMenu`)||document.querySelector(`.mockup-nav-links`);e&&t&&(e.addEventListener(`click`,n=>{n.preventDefault(),n.stopPropagation();let r=!t.classList.contains(`show`);t.classList.toggle(`show`,r),e.setAttribute(`aria-expanded`,String(r))}),document.addEventListener(`click`,n=>{!e.contains(n.target)&&!t.contains(n.target)&&(t.classList.remove(`show`),e.setAttribute(`aria-expanded`,`false`))}),t.querySelectorAll(`a`).forEach(n=>{n.addEventListener(`click`,()=>{t.classList.remove(`show`),e.setAttribute(`aria-expanded`,`false`)})}))}function g(){let e=document.querySelector(`.mockup-nav-wrapper`);if(!e)return;function t(){let t=document.querySelector(`.mockup-hero-section, .mockup-page-hero`),n=!1;t&&(n=t.getBoundingClientRect().bottom>85),n?(e.classList.remove(`nav-theme-light`),e.classList.add(`nav-theme-dark`)):(e.classList.remove(`nav-theme-dark`),e.classList.add(`nav-theme-light`))}t(),window.updateNavbarTheme=t;let n=window.pageYOffset||document.documentElement.scrollTop,r=!1;window.addEventListener(`scroll`,()=>{r||=(window.requestAnimationFrame(()=>{let i=window.pageYOffset||document.documentElement.scrollTop;if(t(),i>15?e.classList.add(`nav-scrolled`):e.classList.remove(`nav-scrolled`),i<=40)e.classList.remove(`nav-hidden`);else if(i>n+6){e.classList.add(`nav-hidden`);let t=document.getElementById(`mainNavMenu`);t&&t.classList.remove(`show`);let n=document.getElementById(`navLangMenu`);n&&n.classList.remove(`show`)}else i<n-6&&e.classList.remove(`nav-hidden`);n=i<=0?0:i,r=!1}),!0)},{passive:!0})}function ee(){let e=window.CRII_API?window.CRII_API.getCurrentUser():null,t=document.querySelectorAll(`.nav-login-btn, .nav-portal-btn, .mobile-login-link`);t.length&&e&&t.forEach(t=>{t.innerHTML=`
        <span style="display:inline-flex; align-items:center; gap:0.4rem;">
          <span style="width:6px; height:6px; background:#10b981; border-radius:50%; box-shadow:0 0 6px #10b981;"></span>
          ${(e.name||`User`).split(` `)[0].toUpperCase()}
        </span>
      `,t.href=`/portal`,t.title=`Signed in as ${e.name} (${e.role||`Member`})`})}var _={en:{name:`English`,flag:`https://flagcdn.com/w40/gb.png`},bn:{name:`বাংলা`,flag:`https://flagcdn.com/w40/bd.png`}};function te(){let e=`crii_site_language`,t=localStorage.getItem(e)||`en`;function n(e){let t=e&&e!==`en`?`/en/${e}`:``,n=window.location.hostname,r=e===`en`||!e?`expires=Thu, 01 Jan 1970 00:00:00 UTC;`:`max-age=31536000;`;if(document.cookie=`googtrans=${t}; path=/; ${r}`,n){document.cookie=`googtrans=${t}; path=/; domain=${n}; ${r}`;let e=n.split(`.`);e.length>2&&(document.cookie=`googtrans=${t}; path=/; domain=.${e.slice(-2).join(`.`)}; ${r}`)}}function r(e){let t=document.getElementById(`navLangLabel`),n=document.getElementById(`navLangFlagImg`),r=_[e]||_.en;t&&(t.textContent=r.name),n&&(n.src=r.flag,n.alt=r.name),document.querySelectorAll(`.nav-lang-opt`).forEach(t=>{t.getAttribute(`data-lang`)===e?t.classList.add(`active`):t.classList.remove(`active`)})}t!==`en`&&n(t),r(t);let i=document.getElementById(`navLangBtn`),a=document.getElementById(`navLangMenu`);if(i&&a&&(i.addEventListener(`click`,e=>{e.stopPropagation();let t=a.classList.contains(`show`);a.classList.toggle(`show`,!t),i.setAttribute(`aria-expanded`,String(!t))}),document.addEventListener(`click`,e=>{!a.contains(e.target)&&!i.contains(e.target)&&(a.classList.remove(`show`),i.setAttribute(`aria-expanded`,`false`))}),a.querySelectorAll(`.nav-lang-opt`).forEach(t=>{t.addEventListener(`click`,()=>{let o=t.getAttribute(`data-lang`)||`en`;if(o===(localStorage.getItem(e)||`en`)){a.classList.remove(`show`);return}localStorage.setItem(e,o),n(o),r(o),a.classList.remove(`show`),i.setAttribute(`aria-expanded`,`false`);let s=document.querySelector(`.goog-te-combo`);s&&(s.value=o,s.dispatchEvent(new Event(`change`))),setTimeout(()=>{window.location.reload()},120)})})),window.googleTranslateElementInit=function(){try{new google.translate.TranslateElement({pageLanguage:`en`,includedLanguages:`en,bn`,autoDisplay:!1},`google_translate_element`)}catch(e){console.warn(`Google Translate init deferred:`,e)}},!document.getElementById(`google-translate-api-script`)){let e=document.createElement(`script`);e.id=`google-translate-api-script`,e.type=`text/javascript`,e.src=`//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`,e.async=!0,document.head.appendChild(e)}}function ne(){let e=document.querySelectorAll(`#navSearchTrigger, #mobileSearchTrigger, .nav-search-trigger`),t=document.getElementById(`criiSearchOverlay`),n=document.getElementById(`criiSearchBackdrop`),r=document.getElementById(`criiSearchEsc`),i=document.getElementById(`siteSearchInput`),a=document.getElementById(`criiSearchResults`),o=document.getElementById(`criiSearchQuickTags`);if(!t||!i)return;function s(){t.style.display=`flex`,t.setAttribute(`aria-hidden`,`false`),i.value=``,u(``),setTimeout(()=>i.focus(),60),document.body.style.overflow=`hidden`}function c(){t.style.display=`none`,t.setAttribute(`aria-hidden`,`true`),document.body.style.overflow=``}e.forEach(e=>{e.addEventListener(`click`,e=>{e.preventDefault(),s()})}),n&&n.addEventListener(`click`,c),r&&r.addEventListener(`click`,c),o&&o.querySelectorAll(`.quick-tag-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault();let n=e.getAttribute(`data-query`)||e.innerText.trim();i.value=n,i.focus(),u(n)})}),document.addEventListener(`keydown`,e=>{(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`k`?(e.preventDefault(),t.style.display===`flex`?c():s()):e.key===`Escape`&&t.style.display===`flex`&&c()});let l=null;i.addEventListener(`input`,()=>{clearTimeout(l),l=setTimeout(()=>{u(i.value.trim())},120)});async function u(e){if(!a)return;if(!e){a.innerHTML=`
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
      `}).join(``)}function d(e){return String(e||``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}}function re(){if(!document.querySelector(`.toast-container`)){let e=document.createElement(`div`);e.className=`toast-container`,document.body.appendChild(e)}}window.showToast=function(e,t=`info`,n=3600){let r=document.querySelector(`.toast-container`);r||=(re(),document.querySelector(`.toast-container`));let i=document.createElement(`div`);i.className=`toast toast-${t}`,i.innerHTML=`<span>${e}</span>`,r.appendChild(i),requestAnimationFrame(()=>i.classList.add(`show`)),setTimeout(()=>{i.classList.remove(`show`),setTimeout(()=>i.remove(),300)},n)},window.copyToClipboard=async function(e,t=`Copied to clipboard!`){try{await navigator.clipboard.writeText(e),window.showToast(t,`success`)}catch{window.showToast(`Failed to copy`,`error`)}};function ie(e){if(!e)return`04 November 2026`;try{let t=new Date(e);return isNaN(t.getTime())?e:`${String(t.getDate()).padStart(2,`0`)} ${[`January`,`February`,`March`,`April`,`May`,`June`,`July`,`August`,`September`,`October`,`November`,`December`][t.getMonth()]} ${t.getFullYear()}`}catch{return e}}function ae(e){let t=!!(e.isEdited||e.updatedBy&&e.updatedAt),n=e.updatedBy||e.authors&&e.authors[0]||`CRII Researcher`,r=e.createdBy||e.authors&&e.authors[0]||`CRII Researcher`;return t?`
      <div class="article-meta-attribution">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        <span>Last edited by <strong>${n}</strong> on ${ie(e.updatedAt||e.date)}</span>
      </div>
    `:`
      <div class="article-meta-attribution">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span>Created by <strong>${r}</strong> on ${ie(e.createdAt||e.date)}</span>
      </div>
    `}async function oe(){let e=document.getElementById(`fromTheInstituteContainer`)||document.getElementById(`featuredArticlesContainer`);if(e&&window.CRII_API)try{let t=(await window.CRII_API.getPosts({preferNetwork:!0})||[]).filter(e=>e.published!==!1&&!e.id.startsWith(`crii-paper-2026-00`));if(t.length===0){e.innerHTML=`
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
          ${ae(r)}
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
              ${ae(t)}
            </div>
          </div>
        `}e.innerHTML=`
      ${o}
      ${s?`<div class="editorial-sub-grid">${s}</div>`:``}
    `}catch(e){console.warn(`Featured articles render error:`,e)}}async function se(){let e=document.getElementById(`homeTeamContainer`);if(e&&window.CRII_API)try{let t=await window.CRII_API.getInternsData(),n=t&&t.activeInterns?t.activeInterns:[],r=[`team-002`,`team-003`,`int-001`,`int-002`,`crii-int-002`,`crii-int-003`,`crii-int-004`];n=n.filter(e=>e.status===`Active`&&!r.includes(e.id)),n.sort((e,t)=>{let n=+!!e.isTeamMember,r=+!!t.isTeamMember;if(n!==r)return r-n;let i=e.orderIndex===void 0?999:Number(e.orderIndex),a=t.orderIndex===void 0?999:Number(t.orderIndex);return i===a?(e.name||``).localeCompare(t.name||``):i-a});let i=n.slice(0,3);if(i.length===0){e.innerHTML=`
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
      `}).join(``)}catch(e){console.warn(`Failed to load home team:`,e)}}async function v(){let e=document.getElementById(`homeDivisionsContainer`)||document.querySelector(`.divisions-cards-grid`);if(e&&window.CRII_API)try{let t=await window.CRII_API.getDivisions();t&&Array.isArray(t)&&t.length>0?(e.innerHTML=t.map(e=>`
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
      `}catch(e){console.warn(`initDivisions error:`,e)}}async function y(){let e=document.getElementById(`cohortCardsContainer`);if(e&&window.CRII_API)try{let t=await window.CRII_API.getCohorts();t&&Array.isArray(t)&&t.length>0?(e.innerHTML=t.map(e=>`
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
      `}catch(e){console.warn(`initCohorts error:`,e)}}window.initFeaturedArticles=oe,window.initDivisions=v,window.initCohorts=y,window.triggerGoogleTranslate=function(e=`en`){try{let t=e===`bn`?`bn`:`en`;localStorage.setItem(`crii_site_language`,t);let n=`/en/${t}`;if(document.cookie=`googtrans=${n}; path=/;`,window.location.hostname){document.cookie=`googtrans=${n}; path=/; domain=${window.location.hostname};`;let e=window.location.hostname.split(`.`);e.length>=2&&(document.cookie=`googtrans=${n}; path=/; domain=.${e.slice(-2).join(`.`)};`)}let r=document.querySelector(`.goog-te-combo`);r?(r.value=t,r.dispatchEvent(new Event(`change`))):window.location.reload();let i=document.getElementById(`navLangFlagImg`);i&&(i.src=t===`bn`?`https://flagcdn.com/w40/bd.png`:`https://flagcdn.com/w40/gb.png`,i.alt=t===`bn`?`বাংলা`:`English`)}catch(e){console.warn(`Language switch notice:`,e)}},document.addEventListener(`DOMContentLoaded`,()=>{ce()});function ce(){let e=document.getElementById(`loginWithAutzBtn`)||document.getElementById(`loginWithAccountBtn`),t=document.getElementById(`loginStatus`),n=document.getElementById(`loginError`);if(localStorage.getItem(`crii_autz_app_id`)===`t0i7jkia`&&localStorage.setItem(`crii_autz_app_id`,`gqiqh6qia`),window.location.pathname.includes(`login`)&&window.CRII_API&&window.CRII_API.isAuthenticated()){window.location.href=`/portal`;return}if(e){let t=window.location.pathname.includes(`login`)?`/login.html`:`/portal.html`,n=window.location.origin.includes(`curiomas.zone.id`)?`https://www.curiomas.zone.id${t}`:window.location.origin+t,r=`https://autz.org/onboarding/gqiqh6qia?callback_url=${encodeURIComponent(n)}`;e.setAttribute(`href`,r),e.addEventListener(`click`,()=>{e.style.pointerEvents=`none`,e.innerHTML=`
        <span class="spinner" style="display:inline-block; width:16px; height:16px; border:2px solid #ffffff; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; margin-right:0.6rem;"></span>
        <span>Connecting to Single Sign-On...</span>
      `})}if(document.getElementById(`app`)||window.CRII_ROUTER)return;let r=new URLSearchParams(window.location.search),i=r.get(`auth_code`)||r.get(`code`);i&&(e&&(e.disabled=!0,e.innerHTML=`
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
        `),n&&(n.innerHTML=`<strong>Error:</strong> Failed to communicate with authentication service.`,n.style.display=`block`)}))}(function(){let e=`<!--crii-html-->`,t=new Set(`p.div.span.br.hr.h1.h2.h3.h4.h5.h6.b.strong.i.em.u.s.strike.del.ins.sub.sup.mark.small.code.pre.kbd.samp.blockquote.cite.footer.q.abbr.ul.ol.li.dl.dt.dd.a.img.figure.figcaption.table.thead.tbody.tfoot.tr.td.th.caption.colgroup.col.iframe.audio.nav.details.summary`.split(`.`)),n=new Set([`script`,`style`,`object`,`embed`,`link`,`meta`,`form`,`input`,`button`,`textarea`,`select`,`svg`,`math`,`base`,`title`,`head`,`noscript`,`template`,`frame`,`frameset`,`applet`]),r=new Set(`color.background.background-color.font-family.font-size.font-weight.font-style.font-variant.text-decoration.text-decoration-line.text-decoration-color.text-align.text-indent.text-transform.line-height.letter-spacing.word-spacing.vertical-align.width.max-width.height.min-height.float.list-style-type.direction.column-count.column-gap.page-break-before.page-break-after`.split(`.`)),i=/^https:\/\/(www\.)?(youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/|player\.vimeo\.com\/video\/)/i;function a(e){return String(e||``).split(`;`).map(e=>e.trim()).filter(Boolean).filter(e=>{let t=e.indexOf(`:`);if(t<0)return!1;let n=e.slice(0,t).trim().toLowerCase(),i=e.slice(t+1).trim().toLowerCase();return!(!r.has(n)&&!/^(margin|padding|border)(-[a-z]+)*$/.test(n)||/url\(|expression|javascript:|@import|behavior|-moz-binding/.test(i))}).join(`; `)}function o(e,t){return e=String(e||``).trim(),/^(https?:|mailto:|tel:|#|\/)/i.test(e)||t&&t.img&&/^data:image\/(png|jpe?g|gif|webp);base64,/i.test(e)?e:null}function s(e,t){Array.from(e.attributes).forEach(n=>{let r=n.name.toLowerCase(),s=n.value;if(r===`style`){let t=a(s);t?e.setAttribute(`style`,t):e.removeAttribute(`style`)}else if(r===`class`){let t=s.split(/\s+/).filter(e=>/^doc-[a-z0-9-]+$/.test(e)).join(` `);t?e.setAttribute(`class`,t):e.removeAttribute(`class`)}else if(![`title`,`dir`,`lang`,`data-callout`,`data-latex`,`data-date`,`data-lang`].includes(r)){if(r===`id`)/^doc-h-[a-z0-9-]+$/i.test(s)&&/^h[1-6]$/.test(t)||e.removeAttribute(r);else if(t===`a`&&r===`href`){let t=o(s);t?e.setAttribute(`href`,t):e.removeAttribute(`href`)}else if(t===`a`&&r===`target`)s!==`_blank`&&e.removeAttribute(`target`);else if(t!==`a`||r!==`rel`){if(t===`img`&&r===`src`){let t=o(s,{img:!0});t?e.setAttribute(`src`,t):e.removeAttribute(`src`)}else if((t!==`img`&&t!==`iframe`||![`alt`,`width`,`height`,`loading`].includes(r))&&(t!==`td`&&t!==`th`||![`colspan`,`rowspan`,`width`].includes(r))){if(t===`iframe`&&r===`src`)i.test(s)||e.removeAttribute(`src`);else if(!(t===`iframe`&&[`allowfullscreen`,`frameborder`,`allow`].includes(r))&&!(t===`audio`&&[`controls`,`preload`].includes(r))){if(t===`audio`&&r===`src`){let t=o(s);t?e.setAttribute(`src`,t):e.removeAttribute(`src`)}else(t!==`col`||r!==`span`)&&e.removeAttribute(r)}}}}}),t===`a`&&e.getAttribute(`target`)===`_blank`&&e.setAttribute(`rel`,`noopener noreferrer`)}function c(e){Array.from(e.childNodes).forEach(r=>{if(r.nodeType===3)return;if(r.nodeType!==1){r.remove();return}let i=r.tagName.toLowerCase();if(n.has(i))r.remove();else if(i===`font`||i===`center`){let e=document.createElement(i===`center`?`div`:`span`),t=[];i===`center`&&t.push(`text-align:center`),r.getAttribute(`color`)&&t.push(`color:`+r.getAttribute(`color`)),r.getAttribute(`face`)&&t.push(`font-family:`+r.getAttribute(`face`));let n=r.getAttribute(`style`);for(n&&t.push(n),t.length&&e.setAttribute(`style`,t.join(`;`));r.firstChild;)e.appendChild(r.firstChild);r.replaceWith(e),s(e,e.tagName.toLowerCase()),c(e)}else if(!t.has(i)){for(c(r);r.firstChild;)e.insertBefore(r.firstChild,r);r.remove()}else if(s(r,i),i===`img`&&!r.getAttribute(`src`))r.remove();else{if(i===`iframe`){if(!r.getAttribute(`src`)){r.remove();return}r.setAttribute(`allowfullscreen`,``),r.setAttribute(`frameborder`,`0`)}c(r)}})}function l(e){let t=new DOMParser().parseFromString(`<body>`+String(e||``),`text/html`);return c(t.body),t.body.innerHTML}let u=null;function d(){return window.katex?Promise.resolve():(u||=new Promise((e,t)=>{let n=document.createElement(`link`);n.rel=`stylesheet`,n.href=`https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css`,document.head.appendChild(n);let r=document.createElement(`script`);r.src=`https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js`,r.onload=()=>e(),r.onerror=()=>{u=null,t(Error(`KaTeX failed to load`))},document.head.appendChild(r)}),u)}function f(e){if(!e)return;let t=Array.from(e.querySelectorAll(`.doc-equation[data-latex]`));t.length&&d().then(()=>{t.forEach(e=>{try{window.katex.render(e.getAttribute(`data-latex`),e,{displayMode:!e.classList.contains(`doc-eq-inline`),throwOnError:!1})}catch{e.textContent=e.getAttribute(`data-latex`)}})}).catch(()=>{t.forEach(e=>{e.textContent=e.getAttribute(`data-latex`),e.classList.add(`doc-eq-raw`)})})}function p(t){return typeof t==`string`&&t.indexOf(e)===0}window.CriiDoc={MARK:e,sanitize:l,renderMath:f,isDoc:p}})(),(function(){let e=window.CriiDoc;if(!e){console.error(`CriiDoc missing — load js/doc-sanitize.js first`);return}let t,n,r,i,a,o,s,c,l=!1,u=`doc`,d=null,f=100,p=null,m=()=>[],h=`crii_doc_draft_new`,g=!1,ee=null,_=null,te=null,ne=[],re,ie,ae,oe={},se=`home`,v=null,y=null,ce=null,le=`#ef4444`,ue=`#ffff00`,b={},de=!1,fe=`crii_doc_recent_colors`,x={undo:`<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>`,redo:`<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>`,cut:`<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>`,copy:`<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`,paste:`<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>`,painter:`<path d="M18 2l4 4-9 9-4-4z"/><path d="M9 11l-4 4a3 3 0 0 0 4 4l4-4"/>`,ul:`<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>`,ol:`<line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>`,alignL:`<line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>`,alignC:`<line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/>`,alignR:`<line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/>`,alignJ:`<line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/>`,indent:`<polyline points="3 8 7 12 3 16"/><line x1="21" y1="12" x2="11" y2="12"/><line x1="21" y1="6" x2="11" y2="6"/><line x1="21" y1="18" x2="11" y2="18"/>`,outdent:`<polyline points="7 8 3 12 7 16"/><line x1="21" y1="12" x2="11" y2="12"/><line x1="21" y1="6" x2="11" y2="6"/><line x1="21" y1="18" x2="11" y2="18"/>`,link:`<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>`,image:`<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>`,table:`<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>`,video:`<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>`,music:`<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>`,hr:`<line x1="4" y1="12" x2="20" y2="12"/>`,code:`<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,callout:`<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`,quote:`<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h4"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h4"/>`,sigma:`<path d="M18 7V4H6l6 8-6 8h12v-3"/>`,calendar:`<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,pagebreak:`<path d="M3 12h4M10 12h4M17 12h4"/><path d="M6 3h12v6H6zM6 15h12v6H6z"/>`,columns:`<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/>`,search:`<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`,speaker:`<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>`,check:`<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`,max:`<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>`,zoomIn:`<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>`,zoomOut:`<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>`,eraser:`<path d="M20 20H9L4 15a2 2 0 0 1 0-2.8l8.2-8.2a2 2 0 0 1 2.8 0l5 5a2 2 0 0 1 0 2.8L13 20"/>`,filePlus:`<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>`,upload:`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>`,download:`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`,printer:`<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>`,sidebar:`<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>`,pilcrow:`<path d="M13 4v16"/><path d="M17 4v16"/><path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13"/>`,trash:`<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>`,clock:`<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,toc:`<line x1="8" y1="6" x2="21" y2="6"/><line x1="12" y1="12" x2="21" y2="12"/><line x1="12" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="4" y2="6"/><line x1="3" y1="12" x2="4" y2="12"/><line x1="3" y1="18" x2="4" y2="18"/>`,spacing:`<line x1="21" y1="6" x2="11" y2="6"/><line x1="21" y1="12" x2="11" y2="12"/><line x1="21" y1="18" x2="11" y2="18"/><polyline points="3 8 6 5 9 8"/><polyline points="3 16 6 19 9 16"/><line x1="6" y1="5" x2="6" y2="19"/>`,rtl:`<path d="M13 4v16"/><path d="M17 4v16"/><path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13"/>`,word:`<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,template:`<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>`,undoAll:`<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><polyline points="3 3 3 8 8 8"/>`},S=(e,t)=>`<svg viewBox="0 0 24 24" width="`+(t||16)+`" height="`+(t||16)+`" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`+(x[e]||``)+`</svg>`,C=(e,t,n)=>{let r=document.createElement(e);return t&&(r.className=t),n!=null&&(r.innerHTML=n),r},w=e=>String(e??``).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e]),T=(e,t)=>{window.showToast&&window.showToast(e,t||`info`)},pe=[[`Default`,``],[`Eyekons`,`Eyekons, Georgia, serif`],[`Arial`,`Arial, Helvetica, sans-serif`],[`Calibri`,`Calibri, Carlito, sans-serif`],[`Cambria`,`Cambria, Georgia, serif`],[`Times New Roman`,`"Times New Roman", Times, serif`],[`Georgia`,`Georgia, serif`],[`Garamond`,`Garamond, "EB Garamond", serif`],[`Palatino`,`"Palatino Linotype", Palatino, serif`],[`Verdana`,`Verdana, Geneva, sans-serif`],[`Trebuchet MS`,`"Trebuchet MS", sans-serif`],[`Segoe UI`,`"Segoe UI", sans-serif`],[`Courier New`,`"Courier New", monospace`],[`Consolas`,`Consolas, monospace`],[`Comic Sans MS`,`"Comic Sans MS", cursive`]],E=[8,9,10,11,12,14,16,18,20,22,24,26,28,32,36,40,48,60,72],me=[[`normal`,`Normal`],[`title`,`Title`],[`subtitle`,`Subtitle`],[`h1`,`Heading 1`],[`h2`,`Heading 2`],[`h3`,`Heading 3`],[`h4`,`Heading 4`],[`quote`,`Quote`],[`code`,`Code block`]],he=[`#000000`,`#FFFFFF`,`#44546A`,`#4472C4`,`#ED7D31`,`#A5A5A5`,`#FFC000`,`#5B9BD5`,`#70AD47`,`#7030A0`],ge=[`#C00000`,`#FF0000`,`#FFC000`,`#FFFF00`,`#92D050`,`#00B050`,`#00B0F0`,`#0070C0`,`#002060`,`#7030A0`],_e=[.8,.6,.4,-.25,-.5];function ve(e,t){let n=parseInt(e.slice(1),16),r=n>>16,i=n>>8&255,a=n&255,o=t>=0?255:0,s=Math.abs(t);return r=Math.round(r+(o-r)*s),i=Math.round(i+(o-i)*s),a=Math.round(a+(o-a)*s),`#`+((1<<24)+(r<<16)+(i<<8)+a).toString(16).slice(1)}function D(){let e=window.getSelection();if(e&&e.rangeCount){let t=e.getRangeAt(0);n&&n.contains(t.commonAncestorContainer)&&(d=t.cloneRange())}}function O(){if(n&&(n.focus({preventScroll:!0}),d)){let e=window.getSelection();e.removeAllRanges(),e.addRange(d)}}function k(e,t){O();try{document.execCommand(e,!1,t??null)}catch{}D()}function A(){let e=window.getSelection(),t=e&&e.rangeCount&&n.contains(e.anchorNode)?e.anchorNode:d?d.startContainer:null;return t?(t.nodeType===3&&(t=t.parentElement),t&&n.contains(t)?t:null):null}function j(e,t){let r=e&&e.closest?e.closest(t):null;return r&&n.contains(r)&&r!==n?r:null}let ye=`p,h1,h2,h3,h4,h5,h6,li,blockquote,pre,td,th,figcaption`;function be(){O();let e=window.getSelection();if(!e.rangeCount)return[];let t=e.getRangeAt(0),r=Array.from(n.querySelectorAll(ye)).filter(e=>{try{return t.intersectsNode(e)}catch{return!1}});if(!r.length){let e=j(A(),`div,`+ye);e&&r.push(e)}return r.filter(e=>!r.some(t=>t!==e&&e.contains(t)))}function xe(){let e=window.getSelection();e.isCollapsed&&e.modify&&(e.modify(`move`,`backward`,`word`),e.modify(`extend`,`forward`,`word`),D())}function Se(){y&&=(y.remove(),null),ce&&=(document.removeEventListener(`mousedown`,ce,!0),null)}function Ce(e,t){Se(),y=C(`div`,`we-pop`),y.append(t),y.addEventListener(`mousedown`,e=>{/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||e.preventDefault()}),document.body.append(y);let n=e.getBoundingClientRect(),r=y.offsetWidth,i=y.offsetHeight,a=Math.max(8,Math.min(n.left,window.innerWidth-r-8)),o=n.bottom+4;return o+i>window.innerHeight-8&&(o=Math.max(8,n.top-i-4)),y.style.left=a+`px`,y.style.top=o+`px`,ce=t=>{y&&!y.contains(t.target)&&!e.contains(t.target)&&Se()},setTimeout(()=>document.addEventListener(`mousedown`,ce,!0),0),y}function we(e){let t=C(`div`);return e.forEach(e=>{if(e===`-`){t.append(C(`div`,``,`<hr style="margin:4px 0;border:none;border-top:1px solid var(--border-color)">`));return}let n=C(`div`,`we-menu-item`,(e.icon?S(e.icon,15):``)+`<span>`+w(e.label)+`</span>`+(e.hint?`<small>`+w(e.hint)+`</small>`:``));n.addEventListener(`click`,()=>{Se(),O(),e.fn(),K()}),t.append(n)}),t}function M(e){let t=C(`div`,`we-modal-overlay`),n=C(`div`,`we-modal`+(e.wide?` wide`:``));n.innerHTML=`<div class="we-modal-head"><span>`+w(e.title)+`</span><button type="button" class="we-x" aria-label="Close">&times;</button></div><div class="we-modal-body"></div><div class="we-modal-foot"></div>`;let r=n.querySelector(`.we-modal-body`),i=n.querySelector(`.we-modal-foot`),a={};(e.fields||[]).forEach(e=>{let t=C(`div`,`we-field`+(e.type===`checkbox`?` we-check`:``));if(e.type===`html`){t.innerHTML=e.html,r.append(t);return}let n;if(e.type===`textarea`?n=C(`textarea`):e.type===`select`?(n=C(`select`),e.options.forEach(e=>{let t=C(`option`);t.value=e[0],t.textContent=e[1],n.append(t)})):(n=C(`input`),n.type=e.type||`text`),e.type===`file`&&(n.accept=e.accept||``),e.placeholder&&(n.placeholder=e.placeholder),e.value!=null&&e.type!==`checkbox`&&e.type!==`file`&&(n.value=e.value),e.type===`checkbox`&&(n.checked=!!e.value),a[e.id]=n,e.type===`checkbox`){let r=C(`label`);r.append(n),r.append(document.createTextNode(` `+e.label)),t.append(r)}else{let r=C(`label`,``,w(e.label||``));t.append(r),t.append(n)}if(e.hint&&t.append(C(`div`,`we-hint`,e.hint)),e.type===`file`&&e.onFile){let r=C(`div`,`we-hint`);t.append(r),n.addEventListener(`change`,()=>{n.files[0]&&e.onFile(n.files[0],e=>{r.textContent=e},a)})}r.append(t)});let o=C(`button`,`btn btn-secondary btn-sm`,`Cancel`);o.type=`button`,i.append(o);let s=null;e.ok!==!1&&(s=C(`button`,`btn btn-primary btn-sm`,w(e.ok||`OK`)),s.type=`button`,i.append(s));let c={inputs:a,close:()=>{t.remove(),document.removeEventListener(`keydown`,d,!0)}},l=()=>{let e={};return Object.keys(a).forEach(t=>{let n=a[t];e[t]=n.type===`checkbox`?n.checked:n.type===`file`?n.files[0]:n.value}),e};c.values=l;let u=async()=>{e.onOk?await e.onOk(l(),c)!==!1&&c.close():c.close()};function d(e){e.key===`Escape`?(e.stopPropagation(),c.close()):e.key===`Enter`&&!e.shiftKey&&e.target.tagName!==`TEXTAREA`&&e.target.tagName!==`BUTTON`&&s&&(e.preventDefault(),u())}document.addEventListener(`keydown`,d,!0),o.addEventListener(`click`,c.close),n.querySelector(`.we-x`).addEventListener(`click`,c.close),s&&s.addEventListener(`click`,u),t.addEventListener(`mousedown`,e=>{e.target===t&&c.close()}),t.append(n),document.body.append(t);let f=r.querySelector(`input:not([type=file]),textarea,select`);return f&&setTimeout(()=>f.focus(),30),c}function N(e,t,n,r){r||={};let i=C(`button`,`we-btn`+(r.big?` we-big`:``));return i.type=`button`,i.title=t,i.innerHTML=(e?S(e,r.big?22:16):``)+(r.html||``)+(r.text?`<span>`+w(r.text)+`</span>`:``)+(r.caret?`<span class="we-caret">&#9660;</span>`:``),i.addEventListener(`mousedown`,e=>e.preventDefault()),i.addEventListener(`click`,e=>{e.preventDefault(),n&&n(e,i)}),r.state&&ne.push({b:i,cmd:r.state}),i}let P=(e,t,n,r)=>N(e,t,()=>{k(n),K()},Object.assign({state:n},r||{}));function F(e,t,n){return N(null,t,()=>{k(n),K()},{html:e,state:n})}function I(e,t,n,r){return r||={},N(e,t,(e,t)=>{D(),Ce(t,we(typeof n==`function`?n():n))},Object.assign({caret:!0},r))}function L(e,t){let n=C(`div`,`we-group`),r=C(`div`,`we-group-body`);return t.forEach(e=>{let t=C(`div`,`we-row`);e.forEach(e=>t.append(e)),r.append(t)}),n.append(r),n.append(C(`div`,`we-group-label`,w(e))),n}function R(e,t,n,r){let i=C(`select`,`we-select `+e);return i.title=t,n.forEach(e=>{let t=C(`option`);t.value=e[0],t.textContent=e[1],i.append(t)}),i.addEventListener(`change`,()=>{O(),r(i.value),K()}),i}function Te(){try{return JSON.parse(localStorage.getItem(fe)||`[]`)}catch{return[]}}function Ee(e){let t=Te().filter(t=>t!==e);t.unshift(e),localStorage.setItem(fe,JSON.stringify(t.slice(0,10)))}function De(e,t){let n=C(`div`,`we-palette`),r=C(`div`,`we-menu-item`,`<span style="width:16px;height:16px;border:1px solid #9ca3af;display:inline-block;background:linear-gradient(135deg,#fff 45%,#ef4444 45%,#ef4444 55%,#fff 55%)"></span><span>`+w(t)+`</span>`);r.addEventListener(`click`,()=>{Se(),e(null)}),n.append(r);let i=(t,r)=>{n.append(C(`div`,`we-palette-title`,w(t)));let i=C(`div`,`we-swatches`);r.forEach(t=>{let n=C(`button`,`we-swatch`);n.type=`button`,n.style.background=t,n.title=t.toUpperCase(),n.addEventListener(`click`,()=>{Se(),e(t)}),i.append(n)}),n.append(i)};n.append(C(`div`,`we-palette-title`,`Theme colors`));let a=C(`div`,`we-swatches`);[he].concat(_e.map(e=>he.map(t=>ve(t,e)))).forEach(t=>t.forEach(t=>{let n=C(`button`,`we-swatch`);n.type=`button`,n.style.background=t,n.title=t.toUpperCase(),n.addEventListener(`click`,()=>{Se(),e(t)}),a.append(n)})),n.append(a),i(`Standard colors`,ge);let o=Te();o.length&&i(`Recent colors`,o),n.append(C(`div`,`we-palette-title`,`Custom color (hex code)`));let s=C(`div`,`we-color-custom`),c=C(`input`);c.type=`color`,c.value=`#2563eb`;let l=C(`input`);l.type=`text`,l.placeholder=`#2563EB`,l.maxLength=7;let u=C(`button`,`btn btn-primary btn-sm`,`Apply`);u.type=`button`,c.addEventListener(`input`,()=>{l.value=c.value.toUpperCase()});let d=()=>{let t=l.value.trim();/^[0-9a-f]{6}$/i.test(t)&&(t=`#`+t),/^#[0-9a-f]{3}$/i.test(t)&&(t=`#`+t.slice(1).split(``).map(e=>e+e).join(``)),/^#[0-9a-f]{6}$/i.test(t)?(Se(),e(t)):T(`Enter a valid hex color like #2563EB`,`error`)};return u.addEventListener(`click`,d),l.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),d())}),s.append(c,l,u),n.append(s),n}function Oe(e){let t=e===`text`,n=C(`div`,`we-row`);n.style.gap=`0`;let r=N(null,t?`Font color`:`Text highlight color`,()=>z(e,t?le:ue),{html:t?`<span style="font-weight:800;font-size:1rem;font-family:serif">A</span>`:S(`painter`,15)});r.classList.add(`we-colorbtn`);let i=C(`span`,`we-colorbar`);i.style.background=t?le:ue,r.append(i),b[e]=i;let a=N(null,`Choose color`,(n,r)=>{D(),Ce(r,De(t=>z(e,t),t?`Automatic (dark)`:`No highlight`))},{html:`<span class="we-caret">&#9660;</span>`});return a.style.minWidth=`16px`,a.style.padding=`0 3px`,n.append(r,a),n}function z(e,t){if(O(),k(`styleWithCSS`,!0),e===`text`){let e=t||`#111827`;t&&(le=t,Ee(t),b.text.style.background=t),k(`foreColor`,e)}else t&&(ue=t,Ee(t),b.hi.style.background=t),k(`hiliteColor`,t||`transparent`);K()}function ke(e){O(),xe(),k(`styleWithCSS`,!1),k(`fontSize`,`7`),k(`styleWithCSS`,!0),n.querySelectorAll(`font[size="7"]`).forEach(t=>{let n=C(`span`);for(n.style.fontSize=e+`px`;t.firstChild;)n.append(t.firstChild);t.replaceWith(n)}),n.querySelectorAll(`span[style*="font-size"] span[style*="font-size"]`).forEach(e=>{let t=e.parentElement;t&&t.childNodes.length===1&&(t.style.fontSize=e.style.fontSize,t.replaceChildren(...e.childNodes))}),D()}function Ae(e){let t=A();if(!t)return;let n=Math.round(parseFloat(getComputedStyle(t).fontSize))||16,r=E.findIndex(e=>e>=n);r=e>0?E[r]===n?r+1:r:r<=0?0:r-1,ke(E[Math.max(0,Math.min(E.length-1,r))])}function je(){return j(A(),`p,h1,h2,h3,h4,h5,h6,li,blockquote,pre,div`)}function Me(e){let t=e.parentNode;for(;e.firstChild;)t.insertBefore(e.firstChild,e);e.remove()}function B(e){O();let t=j(A(),`blockquote`);if(t&&e!==`quote`){let e=t.querySelector(`footer`);e&&e.remove(),Me(t)}document.execCommand(`formatBlock`,!1,`<`+({normal:`p`,h1:`h1`,h2:`h2`,h3:`h3`,h4:`h4`,title:`h1`,subtitle:`p`,quote:`blockquote`,code:`pre`}[e]||`p`)+`>`),D();let n=je();n&&(n.classList.remove(`doc-title`,`doc-subtitle`,`doc-code`),e===`title`&&n.classList.add(`doc-title`),e===`subtitle`&&n.classList.add(`doc-subtitle`),e===`code`&&n.classList.add(`doc-code`),n.classList.length||n.removeAttribute(`class`))}function Ne(e,t){be().forEach(n=>{n.style[e]=t})}function Pe(e){O();let t=window.getSelection();t.isCollapsed&&xe();let n=t.toString();if(!n)return;let r=n;e===`upper`?r=n.toUpperCase():e===`lower`?r=n.toLowerCase():e===`title`?r=n.toLowerCase().replace(/\b\p{L}/gu,e=>e.toUpperCase()):e===`sentence`&&(r=n.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu,(e,t,n)=>t+n.toUpperCase())),document.execCommand(`insertText`,!1,r)}function V(t){O(),document.execCommand(`insertHTML`,!1,t),D(),e.renderMath(n),K()}function Fe(){O(),k(`removeFormat`),k(`unlink`);let e=window.getSelection();if(e.rangeCount){let t=e.getRangeAt(0);n.querySelectorAll(`span[style]`).forEach(e=>{try{t.intersectsNode(e)&&e.removeAttribute(`style`)}catch{}})}be().forEach(e=>{e.removeAttribute(`style`)}),B(`normal`)}function Ie(){D();let e=j(A(),`a`),t=d?d.toString():``;M({title:e?`Edit link`:`Insert link`,ok:`Apply`,fields:[{id:`text`,label:`Text to display`,value:e?e.textContent:t},{id:`url`,label:`Web address (URL)`,type:`url`,value:e?e.getAttribute(`href`):`https://`,placeholder:`https://example.com`},{id:`blank`,label:`Open in a new tab`,type:`checkbox`,value:!e||e.getAttribute(`target`)===`_blank`}],onOk:t=>{let n=t.url.trim();if(!n||n===`https://`)return T(`Please enter a web address`,`error`),!1;if(/^(https?:|mailto:|tel:|#|\/)/i.test(n)||(n=`https://`+n),O(),e)e.setAttribute(`href`,n),t.text.trim()&&(e.textContent=t.text.trim()),t.blank?e.setAttribute(`target`,`_blank`):e.removeAttribute(`target`);else{let e=t.text.trim()||n;document.execCommand(`insertHTML`,!1,`<a href="`+w(n)+`"`+(t.blank?` target="_blank" rel="noopener noreferrer"`:``)+`>`+w(e)+`</a>`)}K()}})}async function Le(e){let t=new FormData;t.append(`file`,e);let n=await fetch(`/api/upload`,{method:`POST`,body:t}),r=await n.json().catch(()=>({}));if(!n.ok||r.error)throw Error(r.details||r.error||`Upload failed`);return r.url}function Re(e){return new Promise((t,n)=>{let r=new FileReader;r.onload=()=>t(r.result),r.onerror=n,r.readAsDataURL(e)})}function ze(e,t,n,r,i){let a=r&&r!==`auto`?` style="width:`+r+`%"`:``;return`<figure class="`+(`doc-figure`+(i&&i!==`center`?` doc-align-`+i:``))+`"><img src="`+w(e)+`" alt="`+w(t||``)+`"`+a+`>`+(n?`<figcaption>`+w(n)+`</figcaption>`:``)+`</figure><p><br></p>`}async function Be(e){try{T(`Uploading image...`,`info`);let t;try{t=await Le(e)}catch(n){if(e.size>25e4)throw n;t=await Re(e)}V(ze(t,e.name.replace(/\.[^.]+$/,``),``,`75`,`center`))}catch(e){T(`Image upload failed: `+e.message,`error`)}}function Ve(){D(),M({title:`Insert picture`,ok:`Insert`,fields:[{id:`file`,label:`Upload from your computer`,type:`file`,accept:`image/*`,hint:`Uploads to your institute storage (R2). Or paste an image address below.`,onFile:async(e,t,n)=>{t(`Uploading...`);try{let r=await Le(e);n.url.value=r,t(`Uploaded successfully.`)}catch(e){t(`Upload failed: `+e.message+` — you can paste an image URL instead.`)}}},{id:`url`,label:`Image address (URL)`,type:`url`,placeholder:`https://...`},{id:`alt`,label:`Alternative text (for accessibility)`,placeholder:`Describe the image`},{id:`caption`,label:`Caption (optional)`},{id:`width`,label:`Size`,type:`select`,value:`75`,options:[[`auto`,`Original`],[`25`,`Small (25%)`],[`50`,`Medium (50%)`],[`75`,`Large (75%)`],[`100`,`Full width`]]},{id:`align`,label:`Alignment`,type:`select`,value:`center`,options:[[`center`,`Center`],[`left`,`Float left (text wraps)`],[`right`,`Float right (text wraps)`]]}],onOk:async(e,t)=>{let n=e.url.trim();if(!n&&e.file)try{n=await Le(e.file)}catch{n=await Re(e.file)}if(!n)return T(`Choose a file or paste an image address`,`error`),!1;V(ze(n,e.alt,e.caption,e.width,e.align))}})}function He(e){e=(e||``).trim();let t=e.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{6,})/i);return t?`https://www.youtube-nocookie.com/embed/`+t[1]:(t=e.match(/vimeo\.com\/(?:video\/)?(\d+)/i),t?`https://player.vimeo.com/video/`+t[1]:null)}function Ue(){D(),M({title:`Insert online video`,ok:`Insert`,fields:[{id:`url`,label:`YouTube or Vimeo link`,type:`url`,placeholder:`https://www.youtube.com/watch?v=...`}],onOk:e=>{let t=He(e.url);if(!t)return T(`Only YouTube and Vimeo links are supported`,`error`),!1;V(`<div class="doc-video"><iframe src="`+t+`" allowfullscreen frameborder="0"></iframe></div><p><br></p>`)}})}function We(){D(),M({title:`Insert audio / music`,ok:`Insert`,fields:[{id:`url`,label:`Audio file address (mp3, wav, ogg)`,type:`url`,placeholder:`https://.../track.mp3`},{id:`title`,label:`Title / caption`,placeholder:`Soundtrack: ...`}],onOk:e=>{if(!/^https?:\/\//i.test(e.url.trim()))return T(`Enter a valid audio address`,`error`),!1;V(`<div class="doc-audio"><p><strong>`+w(e.title||`Audio`)+`</strong></p><audio controls preload="none" src="`+w(e.url.trim())+`"></audio></div><p><br></p>`)}})}function Ge(e,t){let n=`<table class="doc-table doc-table-grid"><tbody>`;for(let r=0;r<e;r++){n+=`<tr>`;for(let e=0;e<t;e++)n+=r===0?`<th><br></th>`:`<td><br></td>`;n+=`</tr>`}return n+`</tbody></table><p><br></p>`}function Ke(e){D();let t=C(`div`),n=C(`div`,`we-grid-pick`),r=C(`div`,`we-grid-label`,`Insert table`),i=[];for(let e=0;e<8;e++)for(let t=0;t<10;t++){let a=C(`div`,`we-grid-cell`);a.dataset.r=e+1,a.dataset.c=t+1,a.addEventListener(`mouseover`,()=>{i.forEach(n=>n.classList.toggle(`on`,+n.dataset.r<=e+1&&+n.dataset.c<=t+1)),r.textContent=e+1+` x `+(t+1)+` table`}),a.addEventListener(`click`,()=>{Se(),V(Ge(e+1,t+1))}),i.push(a),n.append(a)}t.append(n,r);let a=C(`div`,`we-menu-item`,`<span>Custom size...</span>`);a.addEventListener(`click`,()=>{Se(),M({title:`Insert table`,ok:`Insert`,fields:[{id:`r`,label:`Rows`,type:`number`,value:3},{id:`c`,label:`Columns`,type:`number`,value:3}],onOk:e=>{V(Ge(Math.max(1,Math.min(50,+e.r||3)),Math.max(1,Math.min(12,+e.c||3))))}})}),t.append(a),Ce(e,t)}let qe=()=>j(A(),`td,th`),Je=()=>j(A(),`table`);function H(e){let t=document.createElement(e);return t.innerHTML=`<br>`,t}function Ye(e){O();let t=qe(),n=Je();if(!t||!n){T(`Place the cursor inside a table first`,`info`);return}let r=t.parentElement,i=t.cellIndex;if(e===`rowAbove`||e===`rowBelow`){let t=r.cloneNode(!1);Array.from(r.cells).forEach(e=>{for(let n=0;n<(e.colSpan||1);n++)t.append(H(`td`))}),e===`rowAbove`?r.before(t):r.after(t)}else if(e===`colLeft`||e===`colRight`)Array.from(n.rows).forEach(t=>{let n=t.cells[Math.min(i,t.cells.length-1)],r=H(n?n.tagName.toLowerCase():`td`);n?e===`colLeft`?n.before(r):n.after(r):t.append(r)});else if(e===`delRow`)n.rows.length===1?n.remove():r.remove();else if(e===`delCol`)Array.from(n.rows).forEach(e=>{e.cells[i]&&e.cells[i].remove()}),n.rows[0]&&n.rows[0].cells.length||n.remove();else if(e===`delTable`)n.remove();else if(e===`mergeRight`){let e=t.nextElementSibling;if(!e){T(`No cell to the right to merge with`,`info`);return}t.colSpan=(t.colSpan||1)+(e.colSpan||1),e.textContent.trim()&&(t.innerHTML=(t.textContent.trim()?t.innerHTML.replace(/<br>$/,``)+` `:``)+e.innerHTML),e.remove()}else if(e===`split`){if((t.colSpan||1)>1){let e=H(t.tagName.toLowerCase());e.colSpan=t.colSpan-1,t.colSpan=1,t.after(e),e.colSpan===1&&e.removeAttribute(`colspan`),t.removeAttribute(`colspan`)}}else if(e===`header`){let e=n.rows[0],t=e.cells[0].tagName!==`TH`;Array.from(e.cells).forEach(e=>{let n=document.createElement(t?`th`:`td`);n.innerHTML=e.innerHTML,Array.from(e.attributes).forEach(e=>n.setAttribute(e.name,e.value)),e.replaceWith(n)})}K()}function Xe(){let e=window.getSelection();if(!e.rangeCount)return[];let t=e.getRangeAt(0),r=Array.from(n.querySelectorAll(`td,th`)).filter(e=>{try{return t.intersectsNode(e)}catch{return!1}});if(r.length>1)return r;let i=qe();return i?[i]:[]}function Ze(e){v&&v.classList.remove(`we-selected`),v=e,e&&e.classList.add(`we-selected`),Dt()}function Qe(e,t){if(!v)return;let n=v,r=n.closest(`figure.doc-figure`),i=()=>(r||(r=C(`figure`,`doc-figure`),n.replaceWith(r),r.append(n)),r);if(e===`width`)t===`auto`?n.style.removeProperty(`width`):n.style.width=t+`%`;else if(e===`align`)i(),r.classList.remove(`doc-align-left`,`doc-align-right`),t!==`center`&&r.classList.add(`doc-align-`+t);else if(e===`alt`)M({title:`Alternative text`,ok:`Save`,fields:[{id:`alt`,label:`Describe this picture for screen readers`,value:n.getAttribute(`alt`)||``}],onOk:e=>{n.setAttribute(`alt`,e.alt),K()}});else if(e===`caption`){i();let e=r.querySelector(`figcaption`);if(e)e.remove();else{let e=C(`figcaption`,``,`Caption`);r.append(e)}}else e===`delete`&&((r||n).remove(),v=null,Dt());K()}function $e(t,r){D(),M({title:r?`Edit equation`:t?`Insert inline equation`:`Insert equation`,ok:r?`Update`:`Insert`,wide:!0,fields:[{id:`tex`,label:`LaTeX expression`,type:`textarea`,value:r?r.getAttribute(`data-latex`):``,placeholder:`E = mc^2   or   \\frac{a}{b}   or   \\sum_{i=1}^{n} x_i`,hint:`Examples: \\alpha + \\beta, \\sqrt{x^2+y^2}, \\int_0^\\infty e^{-x}\\,dx, \\Delta G = \\Delta H - T\\Delta S`}],onOk:i=>{let a=i.tex.trim();if(!a)return T(`Type a LaTeX expression`,`error`),!1;r?(r.setAttribute(`data-latex`,a),r.innerHTML=``,e.renderMath(n),K()):V(t?`<span class="doc-equation doc-eq-inline" data-latex="`+w(a)+`" contenteditable="false"></span>&nbsp;`:`<div class="doc-equation" data-latex="`+w(a)+`" contenteditable="false"></div><p><br></p>`)}})}let et=`© ® ™ ° ± × ÷ ≤ ≥ ≠ ≈ ∞ √ ∑ ∏ ∫ ∂ ∆ ∇ π μ Ω α β γ δ ε θ λ σ τ φ ψ ω → ← ↑ ↓ ↔ ⇒ ⇔ ∈ ∉ ⊂ ⊆ ∪ ∩ ∀ ∃ ∴ ∵ ‰ § ¶ † ‡ • … – — ‘ ’ “ ” « » ¼ ½ ¾ ¹ ² ³ ⁴ € £ ¥ ¢ ₹ ₿ ★ ☆ ✓ ✗ ♠ ♣ ♥ ♦ ☀ ☁ ☂ ♀ ♂ ⚛ ☢`.split(` `);function tt(e){D();let t=C(`div`,`we-symbols`);et.forEach(e=>{let n=C(`button`,``,e);n.type=`button`,n.addEventListener(`click`,()=>{Se(),O(),document.execCommand(`insertText`,!1,e),K()}),t.append(n)}),Ce(e,t)}function nt(e,t){V(`<div class="doc-callout doc-callout-`+e+`" data-callout="`+e+`"><p><strong>`+t+`</strong></p><p>Type your `+t.toLowerCase()+` here...</p></div><p><br></p>`)}function rt(){V(`<pre class="doc-code"><code>// Paste or type your code here</code></pre><p><br></p>`)}function it(){D(),M({title:`Insert quotation`,ok:`Insert`,fields:[{id:`q`,label:`Quotation`,type:`textarea`,value:d?d.toString():``},{id:`a`,label:`Attribution (optional)`,placeholder:`Author / source`}],onOk:e=>{if(!e.q.trim())return!1;V(`<blockquote><p>`+w(e.q.trim())+`</p>`+(e.a.trim()?`<footer>— `+w(e.a.trim())+`</footer>`:``)+`</blockquote><p><br></p>`)}})}function at(){D(),M({title:`Insert timeline entry`,ok:`Insert`,fields:[{id:`d`,label:`Date / label`,placeholder:`e.g. March 2026`,value:``},{id:`t`,label:`Description`,type:`textarea`}],onOk:e=>{V(`<div class="doc-timeline"><strong>`+w(e.d||`Date`)+`</strong><p>`+w(e.t||`Description`)+`</p></div><p><br></p>`)}})}function ot(){let e=Array.from(n.querySelectorAll(`h1,h2,h3`)).filter(e=>!e.closest(`.doc-toc`));if(!e.length){T(`Add some headings first, then insert a table of contents`,`info`);return}let t=0,r=e.map(e=>(e.id&&/^doc-h-/.test(e.id)||(e.id=`doc-h-`+ ++t+`-`+Math.random().toString(36).slice(2,6)),`<li class="doc-toc-l`+e.tagName[1]+`"><a href="#`+e.id+`">`+w(e.textContent.trim())+`</a></li>`)).join(``);n.querySelectorAll(`.doc-toc`).forEach(e=>e.remove()),V(`<nav class="doc-toc"><div class="doc-toc-title">Table of Contents</div><ul>`+r+`</ul></nav><p><br></p>`)}function U(e){O();let t=window.getSelection().rangeCount?window.getSelection().getRangeAt(0):null;if(!t)return;let r=Array.from(n.children).filter(e=>{try{return t.intersectsNode(e)}catch{return!1}});if(!r.length)return;let i=r.length===1&&r[0].classList.contains(`doc-columns`)?r[0]:null;if(i){if(e===1){Me(i);return}i.classList.remove(`doc-cols-2`,`doc-cols-3`),i.classList.add(`doc-cols-`+e);return}if(e===1)return;let a=C(`div`,`doc-columns doc-cols-`+e);r[0].before(a),r.forEach(e=>a.append(e))}let st={paper:{name:`Research paper`,html:`<h1 class="doc-title">Title of Your Research Paper</h1><p class="doc-subtitle">Author names &middot; CRII Division &middot; Date</p><div class="doc-callout doc-callout-note" data-callout="note"><p><strong>Abstract</strong></p><p>Summarise the problem, method, key results and conclusion in 150&ndash;250 words.</p></div><h2>1. Introduction</h2><p>Explain the background, the gap in knowledge and your research question.</p><h2>2. Methods</h2><p>Describe data, instruments, algorithms and how others can reproduce your work.</p><h2>3. Results</h2><p>Present findings with tables, figures and equations.</p><h2>4. Discussion</h2><p>Interpret the results, limitations and implications.</p><h2>5. Conclusion</h2><p>State the main takeaway and future work.</p><h2>References</h2><ol><li>Author, A. (2026). <em>Title</em>. Journal, 1(1), 1&ndash;10.</li></ol>`},dispatch:{name:`Blog dispatch / news`,html:`<h1 class="doc-title">Headline Goes Here</h1><p class="doc-subtitle">A short, engaging summary of the story.</p><p>Open with the most important news in a single strong paragraph.</p><h2>Why it matters</h2><p>Give context and background.</p><h2>What happens next</h2><ul><li>Next step one</li><li>Next step two</li></ul><blockquote><p>Add a memorable quote here.</p><footer>&mdash; Name, Role</footer></blockquote>`},notes:{name:`Meeting / lab notes`,html:`<h1>Meeting Notes</h1><table class="doc-table doc-table-grid"><tbody><tr><th>Date</th><th>Attendees</th><th>Topic</th></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><h2>Agenda</h2><ol><li><br></li></ol><h2>Decisions</h2><ul><li><br></li></ul><h2>Action items</h2><table class="doc-table doc-table-striped"><tbody><tr><th>Task</th><th>Owner</th><th>Due</th></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table>`},tutorial:{name:`Tutorial / how-to`,html:`<h1 class="doc-title">How to ...</h1><p class="doc-subtitle">What you will learn and what you need.</p><div class="doc-callout doc-callout-tip" data-callout="tip"><p><strong>Tip</strong></p><p>List prerequisites here.</p></div><h2>Step 1</h2><p>Describe the first step.</p><pre class="doc-code"><code>// code example</code></pre><h2>Step 2</h2><p>Describe the second step.</p><div class="doc-callout doc-callout-warning" data-callout="warning"><p><strong>Warning</strong></p><p>Mention common mistakes.</p></div>`}};function W(t){n.innerHTML=t&&t.trim()?t:`<p><br></p>`,e.renderMath(n),v=null,Et(),Tt(),Dt()}function G(e){(yt()||confirm(`This replaces everything currently in the document. Continue?`))&&(W(st[e].html),g=!0,q())}function ct(){return window.mammoth?Promise.resolve():new Promise((e,t)=>{let n=document.createElement(`script`);n.src=`https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js`,n.onload=e,n.onerror=()=>t(Error(`Could not load Word import library (check your internet connection)`)),document.head.appendChild(n)})}function lt(){D();let t=C(`input`);t.type=`file`,t.accept=`.docx`,t.addEventListener(`change`,async()=>{let n=t.files[0];if(n)try{T(`Importing Word document...`,`info`),await ct();let t=await n.arrayBuffer(),r=await window.mammoth.convertToHtml({arrayBuffer:t},{convertImage:window.mammoth.images.imgElement(async e=>{let t=await e.read(`base64`),n=await(await fetch(`data:`+e.contentType+`;base64,`+t)).blob(),r=new File([n],`word-image.`+(e.contentType.split(`/`)[1]||`png`),{type:e.contentType});try{return{src:await Le(r)}}catch{return{src:`data:`+e.contentType+`;base64,`+t}}})}),i=e.sanitize(r.value);yt()||confirm(`Replace the current document with the imported Word file? (Cancel = insert at cursor)`)?W(i):V(i),g=!0,q(),T(`Word document imported`,`success`)}catch(e){T(`Import failed: `+e.message,`error`)}}),t.click()}function ut(e,t){return`<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>`+w(t)+`</title><style>body{font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.5;color:#111;max-width:800px;margin:2cm auto}table{border-collapse:collapse;width:100%}td,th{border:1px solid #999;padding:6px}th{background:#eef}blockquote{border-left:4px solid #2563eb;padding-left:12px;font-style:italic}pre{background:#f1f5f9;padding:10px;white-space:pre-wrap}.doc-callout{border-left:4px solid #2563eb;background:#eff6ff;padding:8px 14px}img{max-width:100%}.doc-title{text-align:center;font-size:26pt}.doc-subtitle{text-align:center;color:#555}</style></head><body>`+e+`</body></html>`}function dt(e,t,n){let r=new Blob([n],{type:t}),i=document.createElement(`a`);i.href=URL.createObjectURL(r),i.download=e,document.body.append(i),i.click(),setTimeout(()=>{URL.revokeObjectURL(i.href),i.remove()},500)}let ft=()=>(document.getElementById(`bloggerTitleInput`)||{}).value||`article`,pt=e=>(e||`article`).trim().replace(/[^\w\- ]+/g,``).replace(/\s+/g,`-`).slice(0,60)||`article`;function mt(){dt(pt(ft())+`.doc`,`application/msword`,ut(J(),ft()))}function ht(){dt(pt(ft())+`.html`,`text/html`,ut(J(),ft()))}function gt(){let e=window.open(``,`_blank`);e?(e.document.write(ut(`<h1 style="text-align:center">`+w(ft())+`</h1>`+J(),ft())),e.document.close(),setTimeout(()=>{e.focus(),e.print()},500)):T(`Allow pop-ups to print / save as PDF`,`error`)}function _t(){let e=n.cloneNode(!0);return e.querySelectorAll(`.doc-equation,.doc-toc`).forEach(e=>e.remove()),e.querySelectorAll(`p,h1,h2,h3,h4,h5,h6,li,td,th,blockquote,pre,div,br,figcaption`).forEach(e=>e.after(document.createTextNode(` `))),e.textContent.replace(/\u200b/g,``).replace(/\u00a0/g,` `)}let vt=()=>{let e=_t().trim();return e?e.split(/\s+/).length:0},yt=()=>!vt()&&!n.querySelector(`img,table,iframe,audio,hr,.doc-equation`);function bt(){let e=_t().trim(),t=e?e.split(/\s+/).length:0,r=n.querySelectorAll(`p,li,h1,h2,h3,h4,h5,h6,blockquote`).length,i=(e.match(/[.!?]+(\s|$)/g)||[]).length;return M({title:`Word count`,ok:!1,fields:[{type:`html`,html:`<div class="we-stat-grid"><div class="we-stat"><b>`+t+`</b>Words</div><div class="we-stat"><b>`+e.length+`</b>Characters (with spaces)</div><div class="we-stat"><b>`+e.replace(/\s/g,``).length+`</b>Characters (no spaces)</div><div class="we-stat"><b>`+r+`</b>Paragraphs</div><div class="we-stat"><b>`+i+`</b>Sentences</div><div class="we-stat"><b>`+Math.max(1,Math.ceil(t/200))+` min</b>Reading time</div></div>`}]})}function xt(){let e=[];n.querySelectorAll(`img`).forEach(t=>{(t.getAttribute(`alt`)||``).trim()||e.push(`A picture has no alternative text. Select it and use Picture Tools → Alt text.`)});let t=0;n.querySelectorAll(`h1,h2,h3,h4,h5,h6`).forEach(n=>{let r=+n.tagName[1];n.textContent.trim()||e.push(`There is an empty `+n.tagName+` heading.`),t&&r>t+1&&e.push(`Heading level skips from H`+t+` to H`+r+`: "`+n.textContent.trim().slice(0,40)+`".`),t=r}),n.querySelectorAll(`a`).forEach(t=>{t.textContent.trim()||e.push(`A link has no text.`),/^(click here|here|link)$/i.test(t.textContent.trim())&&e.push(`Link text "`+t.textContent.trim()+`" is not descriptive.`)}),n.querySelectorAll(`table`).forEach(t=>{t.querySelector(`th`)||e.push(`A table has no header row (Table Tools → Header row).`)}),M({title:`Accessibility checker`,ok:!1,fields:[{type:`html`,html:e.length?e.map(e=>`<div class="we-issue">`+w(e)+`</div>`).join(``):`<div class="we-issue ok">No accessibility problems found. Nice work!</div>`}]})}function St(){if(!(`speechSynthesis`in window)){T(`Read aloud is not supported in this browser`,`error`);return}if(de){speechSynthesis.cancel(),de=!1,T(`Stopped reading`,`info`);return}let e=window.getSelection().toString().trim(),t=new SpeechSynthesisUtterance(e||_t());t.onend=t.onerror=()=>{de=!1},de=!0,speechSynthesis.speak(t),T(`Reading aloud... click again to stop`,`info`)}function Ct(){c=C(`div`,`we-find`),c.innerHTML=`<input type="text" class="we-f-q" placeholder="Find"><input type="text" class="we-f-r" placeholder="Replace with"><div class="we-find-row"><label style="font-size:.76rem;display:flex;align-items:center;gap:4px"><input type="checkbox" class="we-f-case"> Match case</label><span class="we-find-count"></span></div><div class="we-find-row"><button type="button" data-a="prev">Previous</button><button type="button" data-a="next">Next</button><button type="button" data-a="rep">Replace</button><button type="button" data-a="all">Replace all</button><button type="button" data-a="close">Close</button></div>`;let e=c.querySelector(`.we-f-q`),t=c.querySelector(`.we-f-r`),r=c.querySelector(`.we-f-case`),i=c.querySelector(`.we-find-count`),a=()=>{let e=window.getSelection();return e.rangeCount&&n.contains(e.anchorNode)},o=()=>{if(!e.value){i.textContent=``;return}let t=new RegExp(e.value.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`),r.checked?`g`:`gi`);i.textContent=(_t().match(t)||[]).length+` match(es)`},s=t=>{if(!e.value)return;if(!a()){let e=document.createRange();e.selectNodeContents(n),e.collapse(!t);let r=window.getSelection();r.removeAllRanges(),r.addRange(e)}let o=!1,s=0;do o=window.find(e.value,r.checked,!!t,!0,!1,!1,!1),s++;while(o&&!a()&&s<60);if(o&&a()){D();let e=A();e&&e.scrollIntoView({block:`center`,behavior:`smooth`})}else i.textContent=`No matches`};return c.addEventListener(`click`,i=>{let l=i.target.dataset&&i.target.dataset.a;if(l){if(l===`close`)c.classList.remove(`show`);else if(l===`next`)s(!1);else if(l===`prev`)s(!0);else if(l===`rep`){O();let n=window.getSelection();n.toString()&&(r.checked?n.toString()===e.value:n.toString().toLowerCase()===e.value.toLowerCase())&&(document.execCommand(`insertText`,!1,t.value),K()),s(!1),o()}else if(l===`all`){if(!e.value)return;let i=document.createRange();i.selectNodeContents(n),i.collapse(!0);let s=window.getSelection();s.removeAllRanges(),s.addRange(i),n.focus();let c=0;for(;c<2e3&&window.find(e.value,r.checked,!1,!1,!1,!1,!1)&&a();)document.execCommand(`insertText`,!1,t.value),c++;T(c+` replacement(s) made`,`success`),K(),o()}}}),e.addEventListener(`input`,o),r.addEventListener(`change`,o),e.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),s(e.shiftKey))}),c.addEventListener(`keydown`,e=>{e.key===`Escape`&&c.classList.remove(`show`)}),c}function wt(e){D(),c.classList.add(`show`);let t=window.getSelection().toString(),n=c.querySelector(`.we-f-q`);t&&t.length<80&&(n.value=t),(e?c.querySelector(`.we-f-r`):n).focus(),n.dispatchEvent(new Event(`input`))}function Tt(){if(!o)return;let e=Array.from(n.querySelectorAll(`h1,h2,h3`));o.innerHTML=`<h4>Navigation</h4>`+(e.length?``:`<div style="font-size:.8rem;color:var(--text-muted)">Add headings (Home → Styles) to build your outline.</div>`),e.forEach(e=>{let t=C(`a`,`l`+e.tagName[1],w(e.textContent.trim()||`(empty heading)`));t.addEventListener(`click`,()=>{e.scrollIntoView({behavior:`smooth`,block:`start`})}),o.append(t)})}function Et(){if(!s)return;let e=vt();s.querySelector(`.we-st-words`).textContent=e+` word`+(e===1?``:`s`),s.querySelector(`.we-st-chars`).textContent=_t().trim().length+` characters`,s.querySelector(`.we-st-read`).textContent=Math.max(1,Math.ceil(e/200))+` min read`;let t=document.getElementById(`bloggerReadTimeBadge`);t&&u===`doc`&&(t.textContent=Math.max(1,Math.ceil(e/180))+` min read`)}function Dt(){let e=!!qe(),t=!!v&&n.contains(v);oe.table.classList.toggle(`show`,e),oe.image.classList.toggle(`show`,t),(!e&&se===`table`||!t&&se===`image`)&&Mt(`home`)}function Ot(){if(!l||u!==`doc`)return;ne.forEach(e=>{let t=!1;try{t=document.queryCommandState(e.cmd)}catch{}e.b.classList.toggle(`active`,!!t)});let e=A();if(e){let t=getComputedStyle(e),n=(t.fontFamily||``).split(`,`)[0].replace(/["']/g,``).trim().toLowerCase(),r=pe.find(e=>e[1]&&e[1].split(`,`)[0].replace(/["']/g,``).trim().toLowerCase()===n);re.value=r?r[1]:``;let i=Math.round(parseFloat(t.fontSize));ie.value=E.includes(i)?String(i):``;let a=j(e,`h1,h2,h3,h4,blockquote,pre,p,li`),o=`normal`;a&&(a.classList.contains(`doc-title`)?o=`title`:a.classList.contains(`doc-subtitle`)?o=`subtitle`:/^H[1-4]$/.test(a.tagName)?o=a.tagName.toLowerCase():a.tagName===`BLOCKQUOTE`||j(e,`blockquote`)?o=`quote`:a.tagName===`PRE`&&(o=`code`)),ae.value=o}Dt()}function K(){g=!0,q(),clearTimeout(_),_=setTimeout(Et,180),clearTimeout(te),te=setTimeout(Tt,500),clearTimeout(Bt),Bt=setTimeout(()=>Vt(`edit`),800);let e=s&&s.querySelector(`.we-saved`);e&&(e.textContent=``)}function q(){clearTimeout(ee),ee=setTimeout(()=>{try{localStorage.setItem(h,JSON.stringify({html:J(),t:Date.now()}));let e=s&&s.querySelector(`.we-saved`);e&&(e.textContent=`Draft auto-saved `+new Date().toLocaleTimeString())}catch{}},2500)}function J(){let t=n.cloneNode(!0);return t.querySelectorAll(`.doc-equation[data-latex]`).forEach(e=>{let t=e.getAttribute(`data-latex`);e.textContent=e.classList.contains(`doc-eq-inline`)?`$`+t+`$`:`$$`+t+`$$`,e.removeAttribute(`contenteditable`)}),t.querySelectorAll(`.we-selected`).forEach(e=>e.classList.remove(`we-selected`)),t.querySelectorAll(`[class=""]`).forEach(e=>e.removeAttribute(`class`)),t.querySelectorAll(`[contenteditable]`).forEach(e=>e.removeAttribute(`contenteditable`)),e.sanitize(t.innerHTML)}function kt(e){let t=_t().replace(/\s+/g,` `).trim();return t.length>e?t.slice(0,e-1).trim()+`…`:t}function At(e){return w(e).replace(/\*\*(.+?)\*\*/g,`<strong>$1</strong>`).replace(/(^|[^*])\*(?!\s)(.+?)\*/g,`$1<em>$2</em>`).replace(/`([^`]+)`/g,`<code>$1</code>`)}function jt(e){return(e||[]).map(e=>{let t=e.content||``;switch(e.type){case`heading`:return`<h2>`+w(t)+`</h2>`;case`subheading`:return`<h3>`+w(t)+`</h3>`;case`image`:return e.url?ze(e.url,e.caption||``,e.caption||``,`75`,`center`).replace(`<p><br></p>`,``):``;case`code`:return`<pre class="doc-code"><code>`+w(t)+`</code></pre>`;case`quote`:return`<blockquote><p>`+At(t)+`</p>`+(e.author?`<footer>— `+w(e.author)+`</footer>`:``)+`</blockquote>`;case`callout`:{let n=(e.style||`note`).toLowerCase(),r=[`note`,`tip`,`warning`,`important`,`success`].includes(n)?n:`note`;return`<div class="doc-callout doc-callout-`+r+`" data-callout="`+r+`"><p><strong>`+w(r.charAt(0).toUpperCase()+r.slice(1))+`</strong></p><p>`+At(t)+`</p></div>`}case`list`:return`<ul>`+t.split(`
`).filter(e=>e.trim()).map(e=>`<li>`+At(e.replace(/^[-*]\s*/,``))+`</li>`).join(``)+`</ul>`;case`divider`:return`<hr>`;case`video`:{let t=He(e.url);return t?`<div class="doc-video"><iframe src="`+t+`" allowfullscreen frameborder="0"></iframe></div>`:``}case`timeline`:return`<div class="doc-timeline"><strong>`+w(e.date||``)+`</strong><p>`+At(t)+`</p></div>`;case`music`:return e.url?`<div class="doc-audio"><p><strong>`+w(t||`Audio`)+`</strong></p><audio controls preload="none" src="`+w(e.url)+`"></audio></div>`:``;case`table`:return`<pre class="doc-code"><code>`+w(t)+`</code></pre>`;default:return t.split(/\n{2,}/).map(e=>`<p>`+At(e).replace(/\n/g,`<br>`)+`</p>`).join(``)}}).join(``)}function Mt(e){se=e,a.querySelectorAll(`.we-tab`).forEach(t=>t.classList.toggle(`active`,t.dataset.tab===e)),i.querySelectorAll(`.we-panel`).forEach(t=>t.classList.toggle(`active`,t.dataset.tab===e))}function Nt(e){f=Math.max(50,Math.min(200,e)),n.style.setProperty(`--we-zoom`,f/100);let t=s.querySelector(`.we-zoom-range`);t&&(t.value=f);let r=s.querySelector(`.we-zoom-label`);r&&(r.textContent=f+`%`)}function Pt(){t=C(`div`,`we-wrap`),a=C(`div`,`we-tabs`),i=C(`div`,`we-ribbon`),[[`file`,`File`],[`home`,`Home`],[`insert`,`Insert`],[`layout`,`Layout`],[`review`,`Review`],[`view`,`View`],[`table`,`Table Tools`],[`image`,`Picture Tools`]].forEach(([e,t])=>{let n=C(`button`,`we-tab`+(e===`file`?` we-tab-file`:``)+(e===`table`||e===`image`?` we-ctx`:``),t);n.type=`button`,n.dataset.tab=e,n.addEventListener(`mousedown`,e=>e.preventDefault()),n.addEventListener(`click`,()=>Mt(e)),a.append(n),(e===`table`||e===`image`)&&(oe[e]=n)});let e=C(`div`,`we-fs-bar`),r=C(`button`,`btn btn-primary btn-sm`,`Save & Publish`);r.type=`button`,r.addEventListener(`click`,()=>{let e=document.getElementById(`bloggerSaveBtn`);e&&e.click()});let l=C(`button`,`btn btn-secondary btn-sm`,`Exit focus mode`);l.type=`button`,l.addEventListener(`click`,It),e.append(r,l),a.append(e);let u={};[`file`,`home`,`insert`,`layout`,`review`,`view`,`table`,`image`].forEach(e=>{let t=C(`div`,`we-panel`);t.dataset.tab=e,u[e]=t,i.append(t)}),u.file.append(L(`New`,[[I(`template`,`Start from a template`,Object.keys(st).map(e=>({label:st[e].name,fn:()=>G(e)})),{big:!0,text:`Templates`}),N(`filePlus`,`Clear the document and start blank`,()=>{(yt()||confirm(`Clear the whole document?`))&&(W(``),K())},{big:!0,text:`Blank`})]]),L(`Import`,[[N(`upload`,`Open a Microsoft Word (.docx) file`,lt,{big:!0,text:`Open Word file`})]]),L(`Export & Print`,[[N(`word`,`Download as Word document (.doc)`,mt,{big:!0,text:`Word (.doc)`}),N(`download`,`Download as web page (.html)`,ht,{big:!0,text:`HTML`}),N(`printer`,`Print or save as PDF`,gt,{big:!0,text:`Print / PDF`})]]),L(`Draft`,[[N(`undoAll`,`Restore the last auto-saved draft of this article`,()=>Yt(!0),{big:!0,text:`Restore draft`})]])),re=R(`we-font`,`Font`,pe.map(e=>[e[1],e[0]]),e=>{e&&(xe(),k(`styleWithCSS`,!0),k(`fontName`,e))}),ie=R(`we-size`,`Font size`,[[``,`Size`]].concat(E.map(e=>[String(e),String(e)])),e=>{e&&ke(+e)}),ae=R(`we-style`,`Styles`,me,e=>B(e));let d=N(`painter`,`Format Painter — copy formatting, then select text to apply`,()=>{let e=A();if(!e)return;let t=getComputedStyle(e);p={fontFamily:t.fontFamily,fontSize:t.fontSize,color:t.color,bold:document.queryCommandState(`bold`),italic:document.queryCommandState(`italic`),underline:document.queryCommandState(`underline`)},d.classList.add(`active`),T(`Format copied — now select the text to format`,`info`)});u.home.append(L(`Clipboard`,[[N(`paste`,`Paste as plain text (Ctrl+Shift+V)`,async()=>{try{let e=await navigator.clipboard.readText();O(),document.execCommand(`insertText`,!1,e),K()}catch{T(`Use Ctrl+V to paste (browser blocked clipboard access)`,`info`)}},{text:`Paste`}),P(`cut`,`Cut (Ctrl+X)`,`cut`),P(`copy`,`Copy (Ctrl+C)`,`copy`),d]]),L(`Undo`,[[P(`undo`,`Undo (Ctrl+Z)`,`undo`),P(`redo`,`Redo (Ctrl+Y)`,`redo`)]]),L(`Font`,[[re,ie,N(null,`Increase font size`,()=>Ae(1),{html:`<b style="font-size:.95rem">A<sup>+</sup></b>`}),N(null,`Decrease font size`,()=>Ae(-1),{html:`<b style="font-size:.8rem">A<sup>−</sup></b>`})],[F(`<b>B</b>`,`Bold (Ctrl+B)`,`bold`),F(`<i>I</i>`,`Italic (Ctrl+I)`,`italic`),F(`<u>U</u>`,`Underline (Ctrl+U)`,`underline`),F(`<s>S</s>`,`Strikethrough`,`strikeThrough`),F(`x<sub style="font-size:.6rem">2</sub>`,`Subscript`,`subscript`),F(`x<sup style="font-size:.6rem">2</sup>`,`Superscript`,`superscript`),I(null,`Change case`,[{label:`UPPERCASE`,fn:()=>Pe(`upper`)},{label:`lowercase`,fn:()=>Pe(`lower`)},{label:`Title Case`,fn:()=>Pe(`title`)},{label:`Sentence case`,fn:()=>Pe(`sentence`)}],{html:`<span style="font-weight:700">Aa</span>`}),Oe(`text`),Oe(`hi`),N(`eraser`,`Clear all formatting (Ctrl+\\)`,Fe)]]),L(`Paragraph`,[[I(`ul`,`Bullets`,[{label:`Solid bullets`,fn:()=>Ft(`ul`,`disc`)},{label:`Hollow bullets`,fn:()=>Ft(`ul`,`circle`)},{label:`Square bullets`,fn:()=>Ft(`ul`,`square`)}]),I(`ol`,`Numbering`,[{label:`1. 2. 3.`,fn:()=>Ft(`ol`,`decimal`)},{label:`a. b. c.`,fn:()=>Ft(`ol`,`lower-alpha`)},{label:`A. B. C.`,fn:()=>Ft(`ol`,`upper-alpha`)},{label:`i. ii. iii.`,fn:()=>Ft(`ol`,`lower-roman`)},{label:`I. II. III.`,fn:()=>Ft(`ol`,`upper-roman`)}]),P(`outdent`,`Decrease indent`,`outdent`),P(`indent`,`Increase indent`,`indent`),I(`spacing`,`Line spacing`,[`1`,`1.15`,`1.5`,`2`,`2.5`,`3`].map(e=>({label:e===`1.15`?`1.15 (recommended)`:e,fn:()=>Ne(`lineHeight`,e)})))],[P(`alignL`,`Align left (Ctrl+L)`,`justifyLeft`),P(`alignC`,`Center (Ctrl+E)`,`justifyCenter`),P(`alignR`,`Align right (Ctrl+R)`,`justifyRight`),P(`alignJ`,`Justify (Ctrl+J)`,`justifyFull`)]]),L(`Styles`,[[ae],[N(null,`Heading 1`,()=>B(`h1`),{html:`<b>H1</b>`}),N(null,`Heading 2`,()=>B(`h2`),{html:`<b>H2</b>`}),N(null,`Heading 3`,()=>B(`h3`),{html:`<b>H3</b>`}),N(null,`Normal text`,()=>B(`normal`),{html:`Normal`})]]),L(`Editing`,[[N(`search`,`Find (Ctrl+F)`,()=>wt(!1),{text:`Find`}),N(`search`,`Find and replace (Ctrl+H)`,()=>wt(!0),{text:`Replace`})],[N(null,`Select all (Ctrl+A)`,()=>{k(`selectAll`)},{text:`Select all`})]]));let m=N(`table`,`Insert a table`,(e,t)=>Ke(t),{big:!0,text:`Table`,caret:!1});u.insert.append(L(`Pages`,[[N(`pagebreak`,`Insert a page break`,()=>V(`<div class="doc-pagebreak"></div><p><br></p>`),{big:!0,text:`Page break`}),N(`toc`,`Insert table of contents from headings`,ot,{big:!0,text:`Contents`})]]),L(`Tables`,[[m]]),L(`Illustrations`,[[N(`image`,`Insert a picture`,Ve,{big:!0,text:`Picture`}),N(`video`,`Insert YouTube / Vimeo video`,Ue,{big:!0,text:`Video`}),N(`music`,`Insert audio / music`,We,{big:!0,text:`Audio`})]]),L(`Links`,[[N(`link`,`Insert link (Ctrl+K)`,Ie,{big:!0,text:`Link`})]]),L(`Text blocks`,[[I(`callout`,`Insert a callout box`,[{label:`Note`,fn:()=>nt(`note`,`Note`)},{label:`Tip`,fn:()=>nt(`tip`,`Tip`)},{label:`Warning`,fn:()=>nt(`warning`,`Warning`)},{label:`Important`,fn:()=>nt(`important`,`Important`)},{label:`Success`,fn:()=>nt(`success`,`Success`)}],{big:!0,text:`Callout`}),N(`quote`,`Insert a quotation`,it,{big:!0,text:`Quote`}),N(`code`,`Insert a code block`,rt,{big:!0,text:`Code`}),N(`clock`,`Insert a timeline entry`,at,{big:!0,text:`Timeline`})]]),L(`Symbols`,[[N(`sigma`,`Insert equation (LaTeX)`,()=>$e(!1),{big:!0,text:`Equation`}),N(null,`Insert symbol`,(e,t)=>tt(t),{big:!0,html:`<span style="font-size:1.35rem;line-height:22px">Ω</span>`,text:`Symbol`})],[N(null,`Inline equation`,()=>$e(!0),{html:`ƒ(x)`,text:`Inline`}),N(`calendar`,`Insert today's date`,()=>{O(),document.execCommand(`insertText`,!1,new Date().toLocaleDateString(void 0,{year:`numeric`,month:`long`,day:`numeric`})),K()},{text:`Date`}),N(`hr`,`Horizontal line`,()=>k(`insertHorizontalRule`),{text:`Line`})]])),u.layout.append(L(`Paragraph spacing`,[[I(`spacing`,`Line spacing`,[`1`,`1.15`,`1.5`,`2`,`2.5`,`3`].map(e=>({label:`Line spacing `+e,fn:()=>Ne(`lineHeight`,e)})),{big:!0,text:`Line spacing`}),I(null,`Space after paragraph`,[0,6,12,18,24,36].map(e=>({label:`After: `+e+` px`,fn:()=>Ne(`marginBottom`,e+`px`)})),{big:!0,html:`<span style="font-size:1.2rem">↧</span>`,text:`Space after`}),I(null,`Space before paragraph`,[0,6,12,18,24,36].map(e=>({label:`Before: `+e+` px`,fn:()=>Ne(`marginTop`,e+`px`)})),{big:!0,html:`<span style="font-size:1.2rem">↥</span>`,text:`Space before`}),I(null,`First-line indent`,[{label:`None`,fn:()=>Ne(`textIndent`,`0`)},{label:`0.5 inch`,fn:()=>Ne(`textIndent`,`2em`)},{label:`1 inch`,fn:()=>Ne(`textIndent`,`4em`)}],{big:!0,html:`<span style="font-size:1.2rem">⇥</span>`,text:`First line`})]]),L(`Columns`,[[N(`columns`,`One column`,()=>{U(1),K()},{big:!0,text:`One`}),N(`columns`,`Two columns (selected content)`,()=>{U(2),K()},{big:!0,text:`Two`}),N(`columns`,`Three columns (selected content)`,()=>{U(3),K()},{big:!0,text:`Three`})]]),L(`Direction`,[[N(null,`Left-to-right text`,()=>{be().forEach(e=>{e.setAttribute(`dir`,`ltr`),e.style.textAlign=`left`}),K()},{big:!0,html:`<span style="font-size:1.2rem">¶▸</span>`,text:`LTR`}),N(null,`Right-to-left text`,()=>{be().forEach(e=>{e.setAttribute(`dir`,`rtl`),e.style.textAlign=`right`}),K()},{big:!0,html:`<span style="font-size:1.2rem">◂¶</span>`,text:`RTL`})]]),L(`Page`,[[N(`pagebreak`,`Insert page break`,()=>V(`<div class="doc-pagebreak"></div><p><br></p>`),{big:!0,text:`Break`}),N(`toc`,`Table of contents`,ot,{big:!0,text:`Contents`})]])),u.review.append(L(`Proofing`,[[N(`check`,`Toggle spell check`,(e,t)=>{let r=n.spellcheck=!n.spellcheck;t.classList.toggle(`active`,r),T(`Spell check `+(r?`on`:`off`),`info`),n.blur(),n.focus()},{big:!0,text:`Spelling`}),N(`sigma`,`Word count`,bt,{big:!0,text:`Word count`}),N(`check`,`Check accessibility`,xt,{big:!0,text:`Accessibility`})]]),L(`Find`,[[N(`search`,`Find & replace`,()=>wt(!1),{big:!0,text:`Find`})]]),L(`Speech`,[[N(`speaker`,`Read aloud (selection or whole document)`,St,{big:!0,text:`Read aloud`})]])),u.review.querySelector(`.we-btn[title="Toggle spell check"]`).classList.add(`active`),u.view.append(L(`Zoom`,[[N(`zoomOut`,`Zoom out`,()=>Nt(f-10),{big:!0,text:`Zoom out`}),N(`zoomIn`,`Zoom in`,()=>Nt(f+10),{big:!0,text:`Zoom in`}),N(null,`Reset zoom to 100%`,()=>Nt(100),{big:!0,html:`<b style="font-size:1.1rem">100%</b>`,text:`Reset`})]]),L(`Show`,[[N(`sidebar`,`Navigation pane (outline of headings)`,(e,n)=>{t.classList.toggle(`we-has-nav`),n.classList.toggle(`active`,t.classList.contains(`we-has-nav`)),Tt()},{big:!0,text:`Navigation`}),N(`pilcrow`,`Show / hide paragraph marks`,(e,t)=>{n.classList.toggle(`we-marks`),t.classList.toggle(`active`)},{big:!0,text:`Marks`})]]),L(`Page width`,[[R(`we-style`,`Page width (editor view only)`,[[`820`,`Standard`],[`640`,`Narrow`],[`1000`,`Wide`],[`1280`,`Extra wide`]],e=>n.style.setProperty(`--we-page-w`,e+`px`))]]),L(`Window`,[[N(`max`,`Focus mode (full screen)`,It,{big:!0,text:`Focus mode`})]]));let h=(e,t)=>N(null,e,()=>Ye(t),{text:e}),g=(()=>{let e=C(`div`,`we-row`);e.style.gap=`0`;let t=N(null,`Shade cell`,(e,t)=>{D(),Ce(t,De(e=>{Xe().forEach(t=>{e?t.style.backgroundColor=e:t.style.removeProperty(`background-color`)}),K()},`No shading`))},{html:S(`painter`,15),text:`Cell shading`,caret:!0});return e.append(t),e})();u.table.append(L(`Rows & columns`,[[h(`Row above`,`rowAbove`),h(`Row below`,`rowBelow`),h(`Column left`,`colLeft`),h(`Column right`,`colRight`)],[h(`Delete row`,`delRow`),h(`Delete column`,`delCol`),N(`trash`,`Delete table`,()=>{confirm(`Delete this table?`)&&Ye(`delTable`)},{text:`Delete table`})]]),L(`Merge`,[[h(`Merge right`,`mergeRight`)],[h(`Split cell`,`split`)]]),L(`Style`,[[R(`we-style`,`Table style`,[[`doc-table-grid`,`Grid`],[`doc-table-plain`,`Clean lines`],[`doc-table-striped`,`Striped`]],e=>{let t=Je();t&&(t.classList.remove(`doc-table-grid`,`doc-table-plain`,`doc-table-striped`),t.classList.add(e))}),h(`Header row`,`header`)],[g,R(`we-style`,`Table width`,[[`full`,`Full width`],[`auto`,`Fit to content`]],e=>{let t=Je();t&&t.classList.toggle(`doc-table-auto`,e===`auto`)})]])),u.image.append(L(`Size`,[[R(`we-style`,`Picture size`,[[``,`Size...`],[`auto`,`Original`],[`25`,`25%`],[`50`,`50%`],[`75`,`75%`],[`100`,`Full width`]],e=>{e&&Qe(`width`,e)})]]),L(`Arrange`,[[N(`alignL`,`Float left (text wraps)`,()=>Qe(`align`,`left`),{text:`Left`}),N(`alignC`,`Center`,()=>Qe(`align`,`center`),{text:`Center`}),N(`alignR`,`Float right (text wraps)`,()=>Qe(`align`,`right`),{text:`Right`})]]),L(`Accessibility & text`,[[N(null,`Edit alternative text`,()=>Qe(`alt`),{text:`Alt text`}),N(null,`Add or remove caption`,()=>Qe(`caption`),{text:`Caption`}),N(`trash`,`Delete picture`,()=>Qe(`delete`),{text:`Delete`})]]));let ee=C(`div`,`we-body`);o=C(`div`,`we-nav`);let _=C(`div`,`we-stage`);n=C(`div`,`we-page crii-doc`),n.contentEditable=`true`,n.spellcheck=!0,n.setAttribute(`role`,`textbox`),n.setAttribute(`aria-multiline`,`true`),n.setAttribute(`aria-label`,`Article editor`),n.innerHTML=`<p><br></p>`,_.append(n),ee.append(o,_),Ct(),s=C(`div`,`we-status`,`<span class="we-st-words">0 words</span><span class="we-st-chars">0 characters</span><span class="we-st-read">1 min read</span><span class="we-saved"></span><span class="we-spacer"></span><button type="button" class="we-zoom-out" title="Zoom out">−</button><input type="range" class="we-zoom-range" min="50" max="200" value="100"><button type="button" class="we-zoom-in" title="Zoom in">+</button><span class="we-zoom-label">100%</span>`),s.querySelector(`.we-zoom-range`).addEventListener(`input`,e=>Nt(+e.target.value)),s.querySelector(`.we-zoom-out`).addEventListener(`click`,()=>Nt(f-10)),s.querySelector(`.we-zoom-in`).addEventListener(`click`,()=>Nt(f+10)),t.append(a,i,ee,c,s),Mt(`home`),Lt()}function Ft(e,t){O();let n=j(A(),e);if(n||=(document.execCommand(e===`ul`?`insertUnorderedList`:`insertOrderedList`),D(),j(A(),`ul,ol`)),n&&n.tagName.toLowerCase()!==e){let t=document.createElement(e);t.innerHTML=n.innerHTML,n.replaceWith(t),n=t}n&&(n.style.listStyleType=t)}function It(){t.classList.toggle(`we-fullscreen`),document.body.style.overflow=t.classList.contains(`we-fullscreen`)?`hidden`:``}function Lt(){document.addEventListener(`selectionchange`,()=>{l&&n&&D(),i()});let r;function i(){clearTimeout(r),r=setTimeout(Ot,80)}n.addEventListener(`focus`,()=>{try{document.execCommand(`styleWithCSS`,!1,!0),document.execCommand(`defaultParagraphSeparator`,!1,`p`)}catch{}}),n.addEventListener(`input`,K),n.addEventListener(`mouseup`,()=>{if(p&&!window.getSelection().isCollapsed){k(`styleWithCSS`,!0),k(`fontName`,p.fontFamily),ke(parseFloat(p.fontSize)),k(`foreColor`,p.color);let e={bold:document.queryCommandState(`bold`),italic:document.queryCommandState(`italic`),underline:document.queryCommandState(`underline`)};e.bold!==p.bold&&k(`bold`),e.italic!==p.italic&&k(`italic`),e.underline!==p.underline&&k(`underline`),p=null,t.querySelectorAll(`.we-btn.active`).forEach(e=>{e.title&&e.title.indexOf(`Format Painter`)===0&&e.classList.remove(`active`)}),K()}}),n.addEventListener(`click`,e=>{e.target.tagName===`IMG`?Ze(e.target):v&&Ze(null);let t=e.target.closest&&e.target.closest(`a`);t&&(e.ctrlKey||e.metaKey)&&window.open(t.href,`_blank`,`noopener`)}),n.addEventListener(`dblclick`,e=>{let t=e.target.closest&&e.target.closest(`.doc-equation`);t&&$e(t.classList.contains(`doc-eq-inline`),t)}),n.addEventListener(`keydown`,e=>{let t=e.ctrlKey||e.metaKey,n=e.key.toLowerCase();if(e.key===`Tab`){e.preventDefault();let t=qe();if(t){let n=e.shiftKey?t.previousElementSibling:t.nextElementSibling;if(!n){let r=t.parentElement,i=e.shiftKey?r.previousElementSibling:r.nextElementSibling;if(i)n=e.shiftKey?i.lastElementChild:i.firstElementChild;else if(!e.shiftKey){Ye(`rowBelow`);let e=Je(),t=e.rows[e.rows.length-1];n=t&&t.cells[0]}}if(n){let e=document.createRange();e.selectNodeContents(n),e.collapse(!0);let t=window.getSelection();t.removeAllRanges(),t.addRange(e)}}else j(A(),`li`)?document.execCommand(e.shiftKey?`outdent`:`indent`):e.shiftKey||document.execCommand(`insertText`,!1,`\xA0\xA0\xA0\xA0`)}else if(t){if(n===`k`)e.preventDefault(),Ie();else if(n===`f`)e.preventDefault(),wt(!1);else if(n===`h`)e.preventDefault(),wt(!0);else if(n===`s`){e.preventDefault();let t=document.getElementById(`bloggerSaveBtn`);t&&t.click()}else n===`l`&&!e.shiftKey?(e.preventDefault(),k(`justifyLeft`)):n===`e`?(e.preventDefault(),k(`justifyCenter`)):n===`r`?(e.preventDefault(),k(`justifyRight`)):n===`j`?(e.preventDefault(),k(`justifyFull`)):n===`\\`?(e.preventDefault(),Fe()):e.altKey&&[`1`,`2`,`3`].includes(n)?(e.preventDefault(),B(`h`+n)):e.altKey&&n===`0`?(e.preventDefault(),B(`normal`)):e.shiftKey&&(n===`.`||n===`>`)?(e.preventDefault(),Ae(1)):e.shiftKey&&(n===`,`||n===`<`)&&(e.preventDefault(),Ae(-1))}}),n.addEventListener(`paste`,async t=>{let r=t.clipboardData;if(!r)return;let i=Array.from(r.files||[]).filter(e=>e.type.indexOf(`image/`)===0);if(i.length){t.preventDefault();for(let e of i)await Be(e);return}let a=r.getData(`text/html`);a&&!t.shiftKey&&(t.preventDefault(),document.execCommand(`insertHTML`,!1,e.sanitize(a)),e.renderMath(n),K())}),n.addEventListener(`drop`,async e=>{let t=Array.from(e.dataTransfer&&e.dataTransfer.files||[]).filter(e=>e.type.indexOf(`image/`)===0);if(t.length){e.preventDefault();for(let e of t)await Be(e)}}),window.addEventListener(`beforeunload`,()=>{if(g&&l&&u===`doc`)try{localStorage.setItem(h,JSON.stringify({html:J(),t:Date.now()}))}catch{}})}function Rt(e){if(!e||!e.trim())return[];let t=document.createElement(`div`);t.innerHTML=e;let n=[],r=Date.now();function i(){return`b-${Date.now()}-${(r++).toString(36)}`}let a=Array.from(t.children);return a.length===0&&t.textContent.trim()?[{id:i(),type:`text`,content:t.textContent.trim()}]:(a.forEach(e=>{let t=e.tagName.toLowerCase();if(t===`h1`||t===`h2`)n.push({id:i(),type:`heading`,content:e.innerText.trim()});else if(t===`h3`||t===`h4`||t===`h5`||t===`h6`)n.push({id:i(),type:`subheading`,content:e.innerText.trim()});else if(t===`figure`||e.classList.contains(`doc-figure`)||t===`img`){let r=t===`img`?e:e.querySelector(`img`),a=e.querySelector(`figcaption`)||e.querySelector(`.doc-caption`);r&&r.src&&n.push({id:i(),type:`image`,url:r.src,caption:a?a.innerText.trim():r.alt||``})}else if(t===`blockquote`){let t=e.querySelector(`footer`),r=t?t.innerText.replace(/^—\s*/,``).trim():``,a=e.cloneNode(!0),o=a.querySelector(`footer`);o&&o.remove(),n.push({id:i(),type:`quote`,content:a.innerText.trim(),author:r})}else if(e.classList.contains(`doc-callout`)){let t=e.getAttribute(`data-callout`)||`note`,r=e.cloneNode(!0),a=r.querySelector(`p`);a&&r.children.length>1&&a.remove(),n.push({id:i(),type:`callout`,style:t,content:r.innerText.trim()})}else if(t===`pre`||e.classList.contains(`doc-code`)){let t=e.querySelector(`code`)||e;n.push({id:i(),type:`code`,content:t.innerText.trim(),language:`python`})}else if(t===`ul`||t===`ol`){let t=Array.from(e.querySelectorAll(`li`)).map(e=>e.innerText.trim()).filter(Boolean);n.push({id:i(),type:`list`,content:t.map(e=>`- `+e).join(`
`)})}else if(t===`table`||e.classList.contains(`table-wrapper`)){let r=t===`table`?e:e.querySelector(`table`);if(r){let e=Array.from(r.querySelectorAll(`tr`)).map(e=>Array.from(e.querySelectorAll(`th, td`)).map(e=>e.innerText.trim()).join(` | `));n.push({id:i(),type:`table`,content:e.join(`
`)})}}else if(t===`hr`)n.push({id:i(),type:`divider`});else if(e.classList.contains(`doc-timeline`)){let t=e.querySelector(`strong`),r=e.querySelector(`p`);n.push({id:i(),type:`timeline`,date:t?t.innerText.trim():``,content:r?r.innerText.trim():e.innerText.trim()})}else if(e.classList.contains(`doc-video`)){let t=e.querySelector(`iframe`);n.push({id:i(),type:`video`,url:t?t.src:``})}else if(e.classList.contains(`doc-audio`)){let t=e.querySelector(`audio`),r=e.querySelector(`strong`);n.push({id:i(),type:`music`,url:t?t.src:``,content:r?r.innerText.trim():`Audio`})}else{let t=e.innerText.trim();t&&n.push({id:i(),type:`text`,content:t})}}),n.length>0?n:[{id:i(),type:`text`,content:``}])}let Y=[],X=-1,zt=!1,Bt=null;function Vt(e=`edit`){if(zt||!l)return;let t=J(),n=window.getEditorBlocks?window.getEditorBlocks():[],r={source:e,mode:u,html:t,blocks:JSON.parse(JSON.stringify(n))};if(X>=0){let e=Y[X];if(e.mode===r.mode&&e.html===r.html&&JSON.stringify(e.blocks)===JSON.stringify(r.blocks))return}X<Y.length-1&&Y.splice(X+1),Y.push(r),Y.length>40&&Y.shift(),X=Y.length-1,Wt()}function Ht(){X>0?(X--,Z(Y[X])):(document.execCommand(`undo`),K()),Wt()}function Ut(){X<Y.length-1?(X++,Z(Y[X])):(document.execCommand(`redo`),K()),Wt()}function Z(e){if(e){zt=!0;try{e.mode===`blocks`?(window.setEditorBlocks&&window.setEditorBlocks(e.blocks||[]),qt(`blocks`),T(`Restored previous block builder state`,`info`)):(W(e.html||``),qt(`doc`),T(`Restored previous document state`,`info`)),K()}finally{zt=!1}}}function Wt(){if(!r)return;let e=r.querySelector(`.we-undo-btn`),t=r.querySelector(`.we-redo-btn`);if(e){let t=X>0;e.disabled=!t,e.style.opacity=t?`1`:`0.45`,e.style.cursor=t?`pointer`:`not-allowed`}if(t){let e=X<Y.length-1;t.disabled=!e,t.style.opacity=e?`1`:`0.45`,t.style.cursor=e?`pointer`:`not-allowed`}}function Gt(){Vt(`before_convert_to_doc`);let e=window.getEditorBlocks?window.getEditorBlocks():m?m():[];!e||e.length===0?T(`No blocks found to convert`,`info`):(W(jt(e)),qt(`doc`),Vt(`converted_to_doc`),K(),T(`Blocks converted to Word document! (Click Undo to revert)`,`success`))}function Kt(){Vt(`before_convert_to_blocks`);let e=J();if(!e||!e.trim()||yt()){T(`Document is empty`,`info`);return}let t=Rt(e);window.setEditorBlocks&&window.setEditorBlocks(t),qt(`blocks`),Vt(`converted_to_blocks`),T(`Document converted into modular blocks! (Click Undo to revert)`,`success`)}function qt(e){if(u=e,!l)return;t.style.display=e===`doc`?`flex`:`none`;let n=document.getElementById(`bloggerBlockStack`),i=document.getElementById(`bloggerOpenAddBlockBtn`);n&&(n.style.display=e===`blocks`?``:`none`),i&&(i.style.display=e===`blocks`?``:`none`),r.querySelectorAll(`[data-mode]`).forEach(t=>t.classList.toggle(`active`,t.dataset.mode===e));let a=r.querySelector(`.we-convert-blocks-btn`),o=r.querySelector(`.we-convert-doc-btn`);if(a&&(a.style.display=e===`blocks`?`inline-flex`:`none`),o&&(o.style.display=e===`doc`?`inline-flex`:`none`),r.querySelector(`.we-modehint`).textContent=e===`doc`?`Document mode: Word-style ribbon, tables, pictures, LaTeX and custom formatting. Auto-saves continuously.`:`Block mode: Modular structured cards. Use "Convert blocks to document" anytime to switch to Word editor.`,e===`doc`)Et(),Tt();else if(document.getElementById(`bloggerReadTimeBadge`)&&typeof updateEstimatedReadingTime==`function`)try{updateEstimatedReadingTime()}catch{}Wt()}function Jt(){if(l)return;let e=document.getElementById(`bloggerPaneWrite`);e&&(Pt(),r=C(`div`,`we-modebar`),r.innerHTML=`
      <div class="we-modeswitch">
        <button type="button" data-mode="doc" title="Microsoft Word document style editor">
          ${S(`word`,15)} <span>Document editor</span>
        </button>
        <button type="button" data-mode="blocks" title="Modular block builder mode">
          ${S(`table`,15)} <span>Block builder</span>
        </button>
      </div>

      <div class="we-mode-actions">
        <!-- Reversible Conversions -->
        <button type="button" class="btn btn-secondary btn-sm we-convert-blocks-btn" title="Convert all modular blocks into a rich Word document">
          ⚡ Convert blocks to document
        </button>
        <button type="button" class="btn btn-secondary btn-sm we-convert-doc-btn" style="display:none;" title="Convert the Word document into modular blocks">
          ⚡ Convert document into blocks
        </button>

        <!-- Undo & Redo Controls -->
        <div class="we-history-group">
          <button type="button" class="btn btn-secondary btn-sm we-undo-btn" title="Undo (Ctrl+Z)" disabled>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
            <span>Undo</span>
          </button>
          <button type="button" class="btn btn-secondary btn-sm we-redo-btn" title="Redo (Ctrl+Y)" disabled>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14l5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></svg>
            <span>Redo</span>
          </button>
        </div>
      </div>

      <span class="we-modehint"></span>
    `,e.prepend(t),e.prepend(r),l=!0,r.querySelectorAll(`[data-mode]`).forEach(e=>e.addEventListener(`click`,()=>{let t=e.dataset.mode;if(t!==u){if(t===`doc`&&yt()){let e=(window.getEditorBlocks?window.getEditorBlocks():m())||[];e.some(e=>e&&(e.content||e.url))&&confirm(`Convert your existing blocks into the document editor?

OK = convert, Cancel = start with an empty document.`)&&W(jt(e))}qt(t)}})),r.querySelector(`.we-convert-blocks-btn`).addEventListener(`click`,Gt),r.querySelector(`.we-convert-doc-btn`).addEventListener(`click`,Kt),r.querySelector(`.we-undo-btn`).addEventListener(`click`,Ht),r.querySelector(`.we-redo-btn`).addEventListener(`click`,Ut),window.addEventListener(`keydown`,e=>{(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`z`?e.shiftKey?(e.preventDefault(),Ut()):u===`blocks`&&(e.preventDefault(),Ht()):(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`y`&&u===`blocks`&&(e.preventDefault(),Ut())}),Nt(100),setTimeout(()=>Vt(`initial`),300))}function Yt(e){let t=null;try{t=JSON.parse(localStorage.getItem(h)||`null`)}catch{t=null}return!t||!t.html?(e&&T(`No saved draft found for this article`,`info`),!1):e||confirm(`An auto-saved draft from `+new Date(t.t).toLocaleString()+` was found for this article.

Restore it?`)?(W(t.html),qt(`doc`),g=!0,!0):!1}window.CRII_WORD={load(t,n){if(Jt(),l){if(m=n||(()=>[]),h=`crii_doc_draft_`+(t&&t.id?t.id:`new`),g=!1,t&&e.isDoc(t.content)){W(t.content.slice(e.MARK.length)),qt(`doc`);let n=null;try{n=JSON.parse(localStorage.getItem(h)||`null`)}catch{n=null}n&&n.html&&n.html!==J()&&Yt(!1)}else t?(W(``),qt(`blocks`)):(W(``),qt(`doc`),Yt(!1));Nt(100),Mt(`home`),v=null,Et(),Tt()}},getMode:()=>l?u:`blocks`,getCleanHtml:()=>l?J():``,getWordCount:()=>l?vt():0,getExcerpt:e=>l?kt(e||200):``,isEmpty:()=>!l||yt(),clearDraft(){try{localStorage.removeItem(h)}catch{}g=!1},blocksToHtml:jt}})();var le=`overview`,ue=[],b={activeInterns:[],applications:[]},de=[],fe=null,x=[],S=!0;async function C(){let e=window.CRII_AUTH&&typeof window.CRII_AUTH.getUser==`function`&&window.CRII_AUTH.getUser()||window.CRII_API&&typeof window.CRII_API.getCurrentUser==`function`&&window.CRII_API.getCurrentUser(),t=document.getElementById(`portalAuthSection`),n=document.getElementById(`portalDashboardSection`);if(!e){t&&(t.style.display=`grid`,Je()),n&&(n.style.display=`none`);return}t&&(t.style.display=`none`),n&&(n.style.display=`flex`);let r=document.getElementById(`portalUserName`),i=document.getElementById(`portalUserEmail`),a=document.getElementById(`portalUserRole`),o=document.getElementById(`portalUserAvatar`);r&&(r.innerText=e.name||`Researcher`),i&&(i.innerText=e.email||``),a&&(a.innerText=e.role||`Member`),o&&(o.innerText=(e.name||e.email||`R`).trim().charAt(0).toUpperCase()),T(),w(),me(),M(),De(),Ae(),ke(),Me(),Ne(),Pe(),Fe(),ot(),lt(),await E()}window.initPortalDashboard=C,window.refreshDashboardData=E,typeof document<`u`&&(document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>C()):document.getElementById(`portalDashboardSection`)&&C());function w(){let e=document.getElementById(`portalSidebar`),t=document.getElementById(`portalSidebarToggleBtn`),n=document.getElementById(`portalDashboardSection`),r=document.getElementById(`portalMobileMenuBtn`),i=document.getElementById(`portalSidebarBackdrop`);if(!e)return;localStorage.getItem(`crii_sidebar_collapsed`)===`true`&&window.innerWidth>992&&(e.classList.add(`collapsed`),n&&n.classList.add(`sidebar-collapsed`)),t&&t.addEventListener(`click`,t=>{t.stopPropagation();let r=!e.classList.contains(`collapsed`);e.classList.toggle(`collapsed`,r),n&&n.classList.toggle(`sidebar-collapsed`,r),localStorage.setItem(`crii_sidebar_collapsed`,r?`true`:`false`)}),r&&r.addEventListener(`click`,()=>{e.classList.add(`mobile-open`),i&&i.classList.add(`active`)});let a=document.getElementById(`portalSidebarCloseBtn`);a&&a.addEventListener(`click`,t=>{t.stopPropagation(),e.classList.remove(`mobile-open`),i&&i.classList.remove(`active`)}),i&&i.addEventListener(`click`,()=>{e.classList.remove(`mobile-open`),i.classList.remove(`active`)}),document.querySelectorAll(`.portal-nav-btn, .portal-public-link`).forEach(t=>{t.addEventListener(`click`,()=>{window.innerWidth<=992&&(e.classList.remove(`mobile-open`),i&&i.classList.remove(`active`))})}),window.addEventListener(`keydown`,e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`b`){let n=document.activeElement?document.activeElement.tagName.toLowerCase():``;if(n===`input`||n===`textarea`||document.activeElement&&document.activeElement.isContentEditable)return;e.preventDefault(),t&&t.click()}}),document.querySelectorAll(`.theme-toggle-btn`).forEach(e=>{e.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation();let t=(document.documentElement.getAttribute(`data-theme`)||`light`)===`light`?`dark`:`light`;document.documentElement.setAttribute(`data-theme`,t),localStorage.setItem(`crii_theme_mode`,t)})})}function T(){let e=document.querySelectorAll(`.portal-nav-btn`);e.forEach(t=>{t.addEventListener(`click`,()=>{e.forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),le=t.dataset.tab,pe(le)})});let t=document.getElementById(`portalLogoutBtn`);t&&t.addEventListener(`click`,()=>{window.CRII_API.logout()});let n=new URLSearchParams(window.location.search),r=n.get(`tab`)||n.get(`page`);r&&document.getElementById(`tab-${r}`)&&(le=r),pe(le)}function pe(e){document.querySelectorAll(`.portal-tab-content`).forEach(e=>e.style.display=`none`);let t=document.getElementById(`tab-${e}`);t&&(t.style.display=`block`),document.querySelectorAll(`.portal-nav-btn`).forEach(t=>{t.classList.toggle(`active`,t.dataset.tab===e)}),le=e,e===`posts`&&typeof we==`function`&&we(),e===`roster`&&typeof N==`function`&&N(),e===`access`&&typeof B==`function`&&B(),e===`applications`&&typeof Oe==`function`&&Oe(),e===`datasets`&&typeof je==`function`&&je(),e===`divisions`&&typeof window.renderDivisionsTab==`function`&&window.renderDivisionsTab(),e===`storage`&&typeof window.renderStorageTab==`function`&&window.renderStorageTab(),e===`aliases`&&typeof window.renderAliasesTab==`function`&&window.renderAliasesTab(),e===`sql`&&typeof window.renderSqlStudioTab==`function`&&window.renderSqlStudioTab(),e===`cohorts`&&(typeof window.renderCohortsTab==`function`&&window.renderCohortsTab(),typeof window.initApplicationFormBuilder==`function`&&window.initApplicationFormBuilder());try{let t=new URL(window.location);t.searchParams.set(`tab`,e),window.history.replaceState({},``,t)}catch{}}window.showTab=pe;async function E(){let e=await window.CRII_API.getStats();ue=await window.CRII_API.getPosts({includeDrafts:!0}),b=await window.CRII_API.getInternsData(),de=await window.CRII_API.getDatasets();let t=document.getElementById(`statPapers`);t&&(t.innerText=e.publishedPapers);let n=document.getElementById(`statInterns`);n&&(n.innerText=e.activeInterns);let r=document.getElementById(`statApps`);r&&(r.innerText=e.pendingApplications);let i=document.getElementById(`statDatasets`);i&&(i.innerText=e.openDatasets);let a=document.getElementById(`sidebarAppBadge`);a&&(a.innerText=e.pendingApplications),we(),N(),Oe(),je(),await Ie(),await He(),await B()}function me(){let e=document.getElementById(`openNewPostEditorBtn`);e&&e.addEventListener(`click`,()=>{_e(null)});let t=document.getElementById(`bloggerBackBtn`);t&&t.addEventListener(`click`,()=>{ve()});let n=document.getElementById(`bloggerSaveBtn`);n&&n.addEventListener(`click`,async()=>{await Ce()});let r=document.getElementById(`bloggerStatusBtn`);r&&r.addEventListener(`click`,()=>{S=!S,he()});let i=document.querySelectorAll(`.blogger-tab-btn`);i.forEach(e=>{e.addEventListener(`click`,()=>{i.forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),ge(e.dataset.subtab)})});let a=document.getElementById(`bloggerOpenAddBlockBtn`);a&&a.addEventListener(`click`,()=>{openAddBlockModal()});let o=document.getElementById(`bloggerTitleInput`),s=document.getElementById(`bloggerSlugInput`);o&&s&&(o.addEventListener(`input`,()=>{fe&&s.dataset.custom||(s.value=o.value.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/(^-|-$)+/g,``))}),s.addEventListener(`input`,()=>{s.dataset.custom=`true`}));let c=document.getElementById(`bloggerCoverInput`);c&&c.addEventListener(`input`,()=>{D(c.value)});let l=document.getElementById(`searchPostsInput`);l&&l.addEventListener(`input`,()=>{we()})}function he(){let e=document.getElementById(`bloggerStatusBtn`);e&&(S?(e.className=`status-chip published`,e.innerText=`Published`):(e.className=`status-chip draft`,e.innerText=`Draft`))}function ge(e){document.getElementById(`bloggerPaneWrite`).style.display=e===`write`?`block`:`none`,document.getElementById(`bloggerPaneDetails`).style.display=e===`details`?`block`:`none`,document.getElementById(`bloggerPanePreview`).style.display=e===`preview`?`block`:`none`,e===`preview`&&Se()}function _e(e){fe=e;let t=document.getElementById(`postsDirectoryView`),n=document.getElementById(`postsEditorView`);t&&(t.style.display=`none`),n&&(n.style.display=`block`);let r=null;e&&(r=ue.find(t=>t.id===e));let i=e=>{document.getElementById(`bloggerTitleInput`).value=e.title||``,S=e.published!==!1,document.getElementById(`bloggerCoverInput`).value=e.coverImage||``,document.getElementById(`bloggerSlugInput`).value=e.slug||``,document.getElementById(`bloggerCategoryInput`).value=e.category||`Space & Astrophysics`;let t=document.getElementById(`bloggerFeaturedInput`);t&&(t.checked=!!e.featured),document.getElementById(`bloggerAuthorsInput`).value=(e.authors||[]).join(`, `),document.getElementById(`bloggerDoiInput`).value=e.doi||``,document.getElementById(`bloggerSummaryInput`).value=e.summary||``,document.getElementById(`bloggerAbstractInput`).value=e.abstract||``,document.getElementById(`bloggerTagsInput`).value=(e.tags||[]).join(`, `),D(e.coverImage||``),x=Array.isArray(e.blocks)&&e.blocks.length>0?JSON.parse(JSON.stringify(e.blocks)):O(e.content||``),he(),k(),window.CRII_WORD&&window.CRII_WORD.load(e,()=>x),ge(`write`)};if(r)i(r);else if(e)window.CRII_API&&typeof window.CRII_API.getPostBySlugOrId==`function`&&window.CRII_API.getPostBySlugOrId(e).then(e=>{e&&i(e)});else{document.getElementById(`bloggerTitleInput`).value=``,S=!0,document.getElementById(`bloggerCoverInput`).value=``,document.getElementById(`bloggerSlugInput`).value=``,document.getElementById(`bloggerCategoryInput`).value=`Space & Astrophysics`;let e=document.getElementById(`bloggerFeaturedInput`);e&&(e.checked=!1);let t=window.CRII_API.getCurrentUser();document.getElementById(`bloggerAuthorsInput`).value=t&&(t.name||t.email)||`CRII Fellow`,document.getElementById(`bloggerDoiInput`).value=`10.5281/crii.2026.${Math.floor(1e3+Math.random()*9e3)}`,document.getElementById(`bloggerSummaryInput`).value=``,document.getElementById(`bloggerAbstractInput`).value=``,document.getElementById(`bloggerTagsInput`).value=`Research`,D(``),x=[{id:`b-${Date.now()}-1`,type:`heading`,content:`1. Introduction & Overview`},{id:`b-${Date.now()}-2`,type:`text`,content:`Describe research objectives, experimental setups, and discovery outcomes here.`}],he(),k(),window.CRII_WORD&&window.CRII_WORD.load(null,()=>x),ge(`write`)}}window.openBloggerEditor=_e;async function ve(){let e=document.getElementById(`postsDirectoryView`),t=document.getElementById(`postsEditorView`);e&&(e.style.display=`block`),t&&(t.style.display=`none`),fe=null,await E()}window.closeBloggerEditor=ve,window.switchBloggerSubtab=ge,window.saveCurrentPost=Ce;function D(e){let t=document.getElementById(`bloggerCoverPreviewBox`);t&&(t.innerHTML=e?`<img src="${e}" style="width:100%; height:100%; object-fit:cover;" onerror="this.parentElement.innerHTML='<span style=\\'color:#ef4444; font-size:0.8rem;\\'>Failed to load cover image</span>'">`:`<span style="color:var(--text-muted); font-size:0.82rem;">Cover preview will appear here</span>`)}window.setBloggerCoverPreset=function(e){let t=document.getElementById(`bloggerCoverInput`);t&&(t.value=e,D(e))},window.handleCoverFileUpload=async function(e){let t=e.target.files&&e.target.files[0];if(!t)return;let n=document.getElementById(`bloggerCoverUploadStatus`);n&&(n.style.display=`block`,n.style.color=`var(--accent)`,n.innerHTML=`⏳ Uploading "${t.name}" to Cloudflare R2...`);let r=new FormData;r.append(`file`,t);try{let e=await fetch(`/api/upload`,{method:`POST`,body:r}),t=await e.json();if(!e.ok||t.error)throw Error(t.details||t.error||`Upload failed`);let i=document.getElementById(`bloggerCoverInput`);i&&(i.value=t.url,D(t.url)),n&&(n.style.color=`#10b981`,n.innerHTML=`✓ Uploaded to R2 successfully: <code>${t.url}</code>`)}catch(e){console.error(`R2 Upload error:`,e),n&&(n.style.color=`#ef4444`,n.innerHTML=`⚠️ Upload failed: ${e.message}. (You can still paste any external image URL).`)}},window.handleBlockImageUpload=async function(e,t){let n=e.target.files&&e.target.files[0];if(!n)return;let r=document.getElementById(`blockUploadStatus_${t}`);r&&(r.style.display=`inline-block`,r.style.color=`var(--accent)`,r.innerHTML=`⏳ Uploading...`);let i=new FormData;i.append(`file`,n);try{let e=await fetch(`/api/upload`,{method:`POST`,body:i}),n=await e.json();if(!e.ok||n.error)throw Error(n.details||n.error||`Upload failed`);updateBlockContent(t,`url`,n.url),k()}catch(e){console.error(`R2 Block Upload error:`,e),window.alert(`Upload failed: `+e.message+`

Make sure Cloudflare R2 is bound as "STORAGE" in Pages Settings -> Functions.`),r&&(r.style.display=`none`)}};function O(e){if(!e)return[{id:`b-${Date.now()}`,type:`text`,content:``}];let t=e.split(`

`),n=[];return t.forEach((e,t)=>{let r=e.trim();if(r){if(r.startsWith(`### `))n.push({id:`b-${Date.now()}-${t}`,type:`subheading`,content:r.replace(`### `,``)});else if(r.startsWith(`## `)||r.startsWith(`# `))n.push({id:`b-${Date.now()}-${t}`,type:`heading`,content:r.replace(/^#+ /,``)});else if(r.startsWith(`> `))n.push({id:`b-${Date.now()}-${t}`,type:`quote`,content:r.replace(/^> /,``),author:`CRII Report`});else if(r.startsWith("```")){let e=r.replace(/```[a-z]*\n?/g,``).trim();n.push({id:`b-${Date.now()}-${t}`,type:`code`,content:e,language:`python`})}else n.push({id:`b-${Date.now()}-${t}`,type:`text`,content:r})}}),n.length>0?n:[{id:`b-${Date.now()}`,type:`text`,content:``}]}window.getEditorBlocks=function(){return x||[]},window.setEditorBlocks=function(e){x=e||[],k()};function k(){let e=document.getElementById(`bloggerBlockStack`);e&&(x.length===0?(e.innerHTML=`
      <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
        <p style="margin-bottom: 0.5rem; font-weight: 600;">No blocks in this publication yet.</p>
        <p style="font-size: 0.85rem;">Click "Add a Block" below to start composing.</p>
      </div>
    `,ye()):(e.innerHTML=x.map((e,t)=>`
      <div class="blogger-block-card" data-block-id="${e.id}">
        <div class="blogger-block-header">
          <div class="blogger-block-type-badge">
            ${A(e.type)}
            <span>${e.type}</span>
          </div>
          <div class="blogger-block-actions">
            <button type="button" class="block-tool-btn" title="Move Up" onclick="moveBlock(${t}, -1)" ${t===0?`disabled style="opacity:0.3;"`:``}>
              ▲
            </button>
            <button type="button" class="block-tool-btn" title="Move Down" onclick="moveBlock(${t}, 1)" ${t===x.length-1?`disabled style="opacity:0.3;"`:``}>
              ▼
            </button>
            <button type="button" class="block-tool-btn delete" title="Delete Block" onclick="deleteBlock(${t})">
              ✕
            </button>
          </div>
        </div>
        <div class="blogger-block-body">
          ${j(e,t)}
        </div>
      </div>
    `).join(``),ye()))}function A(e){return{text:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/></svg>`,heading:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 12h16M4 4v16M20 4v16"/></svg>`,subheading:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 12h8M6 6v12M14 6v12"/></svg>`,image:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/></svg>`,code:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,quote:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/></svg>`,list:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/></svg>`,callout:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>`,table:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/></svg>`,timeline:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,music:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,divider:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="12" x2="21" y2="12"/></svg>`,video:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="14" x="3" y="5" rx="2"/><polygon points="10 9 15 12 10 15 10 9"/></svg>`}[e]||``}function j(e,t){switch(e.type){case`text`:return`
        <textarea class="form-textarea" style="min-height: 85px; font-size: 0.95rem; line-height: 1.6;" placeholder="Type regular paragraph text..." oninput="updateBlockContent(${t}, 'content', this.value)">${V(e.content||``)}</textarea>
      `;case`heading`:return`
        <input type="text" class="form-input" style="font-size: 1.15rem; font-weight: 700;" placeholder="Section Heading..." value="${V(e.content||``)}" oninput="updateBlockContent(${t}, 'content', this.value)">
      `;case`subheading`:return`
        <input type="text" class="form-input" style="font-size: 1rem; font-weight: 600;" placeholder="Subsection Subheading..." value="${V(e.content||``)}" oninput="updateBlockContent(${t}, 'content', this.value)">
      `;case`image`:return`
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <input type="url" class="form-input" style="flex:1;" placeholder="Image URL (https://... or upload from device)" value="${V(e.url||``)}" oninput="updateBlockContent(${t}, 'url', this.value)">
            <label class="btn btn-secondary btn-sm" style="cursor:pointer; display:inline-flex; align-items:center; gap:0.35rem; margin-bottom:0; font-size:0.75rem; padding:0.4rem 0.65rem;" title="Upload image to Cloudflare R2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span>Upload</span>
              <input type="file" accept="image/*" style="display:none;" onchange="handleBlockImageUpload(event, ${t})">
            </label>
          </div>
          <span id="blockUploadStatus_${t}" style="font-size:0.75rem; display:none;"></span>
          <input type="text" class="form-input" placeholder="Optional caption or credit..." value="${V(e.caption||``)}" oninput="updateBlockContent(${t}, 'caption', this.value)">
          ${e.url?`<div style="max-height:160px; overflow:hidden; border-radius:8px; border:1px solid var(--border-color);"><img src="${e.url}" style="width:100%; height:160px; object-fit:cover;"></div>`:``}
        </div>
      `;case`code`:return`
        <div style="display:flex; flex-direction:column; gap:0.4rem;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <select class="form-select" style="max-width:160px; padding:0.25rem 0.5rem; font-size:0.8rem;" onchange="updateBlockContent(${t}, 'language', this.value)">
              <option value="python" ${e.language===`python`?`selected`:``}>Python</option>
              <option value="javascript" ${e.language===`javascript`?`selected`:``}>JavaScript</option>
              <option value="cpp" ${e.language===`cpp`?`selected`:``}>C++</option>
              <option value="sql" ${e.language===`sql`?`selected`:``}>SQL</option>
              <option value="bash" ${e.language===`bash`?`selected`:``}>Bash</option>
            </select>
          </div>
          <textarea class="form-textarea" style="font-family:monospace; min-height:100px; font-size:0.85rem;" placeholder="Code snippet..." oninput="updateBlockContent(${t}, 'content', this.value)">${V(e.content||``)}</textarea>
        </div>
      `;case`quote`:return`
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          <textarea class="form-textarea" style="font-style:italic; min-height:70px;" placeholder="Quote text..." oninput="updateBlockContent(${t}, 'content', this.value)">${V(e.content||``)}</textarea>
          <input type="text" class="form-input" placeholder="Author / Citation..." value="${V(e.author||``)}" oninput="updateBlockContent(${t}, 'author', this.value)">
        </div>
      `;case`list`:return`
        <textarea class="form-textarea" style="min-height:80px;" placeholder="Enter items, one per line..." oninput="updateBlockContent(${t}, 'content', this.value)">${V(e.content||``)}</textarea>
      `;case`callout`:return`
        <div style="display:flex; flex-direction:column; gap:0.4rem;">
          <select class="form-select" style="max-width:160px; font-size:0.8rem;" onchange="updateBlockContent(${t}, 'style', this.value)">
            <option value="note" ${e.style===`note`?`selected`:``}>Note / Info</option>
            <option value="important" ${e.style===`important`?`selected`:``}>Important</option>
            <option value="caution" ${e.style===`caution`?`selected`:``}>Caution / Warning</option>
          </select>
          <textarea class="form-textarea" style="min-height:70px;" placeholder="Callout message..." oninput="updateBlockContent(${t}, 'content', this.value)">${V(e.content||``)}</textarea>
        </div>
      `;case`table`:return`
        <div style="display:flex; flex-direction:column; gap:0.4rem;">
          <textarea class="form-textarea" style="font-family:monospace; min-height:80px; font-size:0.82rem;" placeholder="Header 1 | Header 2&#10;Row 1 Col 1 | Row 1 Col 2" oninput="updateBlockContent(${t}, 'content', this.value)">${V(e.content||`Metric | Value
Sampling | 120 nm
SNR | 24.5 dB`)}</textarea>
        </div>
      `;case`timeline`:return`
        <div style="display:flex; gap:0.5rem;">
          <input type="text" class="form-input" style="max-width:140px;" placeholder="Date / Step" value="${V(e.date||`Phase 1`)}" oninput="updateBlockContent(${t}, 'date', this.value)">
          <input type="text" class="form-input" placeholder="Milestone description..." value="${V(e.content||``)}" oninput="updateBlockContent(${t}, 'content', this.value)">
        </div>
      `;case`music`:return`
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          <input type="text" class="form-input" placeholder="Track / Audio link (Spotify or YT URL)" value="${V(e.url||``)}" oninput="updateBlockContent(${t}, 'url', this.value)">
          <input type="text" class="form-input" placeholder="Opinion or research soundscape notes..." value="${V(e.content||``)}" oninput="updateBlockContent(${t}, 'content', this.value)">
        </div>
      `;case`divider`:return`<hr style="border:none; border-top:1px solid var(--border-color); margin:0.5rem 0;">`;case`video`:return`
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          <input type="url" class="form-input" placeholder="YouTube or MP4 Video URL (e.g. https://www.youtube.com/watch?v=...)" value="${V(e.url||``)}" oninput="updateBlockContent(${t}, 'url', this.value)">
        </div>
      `;default:return`<textarea class="form-textarea" oninput="updateBlockContent(${t}, 'content', this.value)">${V(e.content||``)}</textarea>`}}window.updateBlockContent=function(e,t,n){x[e]&&(x[e][t]=n,ye())},window.moveBlock=function(e,t){let n=e+t;if(n<0||n>=x.length)return;let r=x[e];x[e]=x[n],x[n]=r,k()},window.deleteBlock=function(e){x.splice(e,1),k()},window.openAddBlockModal=function(){let e=document.getElementById(`addBlockModal`);e&&e.classList.add(`active`)},window.closeAddBlockModal=function(){let e=document.getElementById(`addBlockModal`);e&&e.classList.remove(`active`)},window.insertBlock=function(e){let t={id:`b-${Date.now()}-${Math.floor(Math.random()*1e3)}`,type:e,content:``};e===`image`&&(t.url=``),e===`code`&&(t.language=`python`),e===`quote`&&(t.author=``),e===`callout`&&(t.style=`note`),e===`timeline`&&(t.date=`Phase 1`),e===`video`&&(t.url=``),e===`music`&&(t.url=``),x.push(t),closeAddBlockModal(),k()};function ye(){let e=0;x.forEach(t=>{t.content&&(e+=t.content.split(/\s+/).length)});let t=Math.max(1,Math.ceil(e/180)),n=document.getElementById(`bloggerReadTimeBadge`);n&&(n.innerText=`${t} min read`)}function be(e){return e.map(e=>{switch(e.type){case`heading`:return`## ${e.content||``}`;case`subheading`:return`### ${e.content||``}`;case`image`:return`![${e.caption||`Research Image`}](${e.url||``})\n*${e.caption||``}*`;case`code`:return`\`\`\`${e.language||`text`}\n${e.content||``}\n\`\`\``;case`quote`:return`> ${e.content||``}\n> — *${e.author||`CRII`}*`;case`callout`:return`> [!${(e.style||`NOTE`).toUpperCase()}]\n> ${e.content||``}`;case`list`:return(e.content||``).split(`
`).map(e=>`- ${e}`).join(`
`);case`divider`:return`---`;case`video`:return`<div class="video-embed"><iframe src="${xe(e.url||``)}" frameborder="0" allowfullscreen></iframe></div>`;case`timeline`:return`**${e.date||``}**: ${e.content||``}`;case`music`:return`🎵 **Soundtrack**: ${e.url||``} — *${e.content||``}*`;case`table`:return`<pre>${e.content||``}</pre>`;default:return e.content||``}}).join(`

`)}function xe(e){return e?e.includes(`youtube.com/watch?v=`)?e.replace(`watch?v=`,`embed/`):e.includes(`youtu.be/`)?e.replace(`youtu.be/`,`www.youtube.com/embed/`):e:``}function Se(){let e=document.getElementById(`bloggerReaderPreviewContainer`);if(!e)return;let t=document.getElementById(`bloggerTitleInput`).value.trim()||`Untitled Article`,n=document.getElementById(`bloggerCategoryInput`).value,r=document.getElementById(`bloggerCoverInput`).value.trim(),i=document.getElementById(`bloggerAuthorsInput`).value.trim()||`CRII Fellow`,a=document.getElementById(`bloggerAbstractInput`).value.trim();document.getElementById(`bloggerSummaryInput`).value.trim();let o=document.getElementById(`bloggerTagsInput`).value.trim(),s=document.getElementById(`bloggerDoiInput`).value.trim()||`10.5281/crii.2026.xxxx`,c=o?o.split(`,`).map(e=>e.trim()):[],l=window.CRII_API.getCurrentUser(),u=l?l.name||l.email:`Administrator`,d=``,f=!!(window.CRII_WORD&&window.CRII_WORD.getMode()===`doc`);(f?[]:x).forEach(e=>{switch(e.type){case`heading`:d+=`<h2 style="font-size:1.6rem; margin:1.75rem 0 0.75rem; color:var(--text-primary);">${V(e.content||``)}</h2>`;break;case`subheading`:d+=`<h3 style="font-size:1.3rem; margin:1.5rem 0 0.5rem; color:var(--text-primary);">${V(e.content||``)}</h3>`;break;case`text`:d+=`<p style="font-size:1.02rem; line-height:1.75; color:var(--text-secondary); margin-bottom:1.25rem;">${V(e.content||``)}</p>`;break;case`image`:d+=`
          <div style="margin:1.75rem 0; text-align:center;">
            <img src="${e.url||``}" style="max-width:100%; border-radius:12px; box-shadow:var(--shadow-md);">
            ${e.caption?`<div style="font-size:0.82rem; color:var(--text-muted); margin-top:0.4rem; font-style:italic;">${V(e.caption)}</div>`:``}
          </div>
        `;break;case`code`:d+=`
          <div style="background:#0f172a; color:#f8fafc; padding:1.25rem; border-radius:10px; font-family:monospace; font-size:0.85rem; overflow-x:auto; margin:1.5rem 0;">
            <pre><code>${V(e.content||``)}</code></pre>
          </div>
        `;break;case`quote`:d+=`
          <blockquote style="border-left:4px solid var(--accent-primary); padding-left:1.25rem; font-style:italic; margin:1.5rem 0; color:var(--text-primary);">
            <p style="font-size:1.05rem; margin-bottom:0.4rem;">${V(e.content||``)}</p>
            ${e.author?`<cite style="font-size:0.85rem; color:var(--text-muted); font-style:normal;">— ${V(e.author)}</cite>`:``}
          </blockquote>
        `;break;case`callout`:d+=`
          <div style="background:rgba(234, 88, 12, 0.08); border-left:4px solid var(--accent-primary); padding:1rem 1.25rem; border-radius:0 10px 10px 0; margin:1.5rem 0;">
            <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--accent-primary); margin-bottom:0.3rem;">${(e.style||`NOTE`).toUpperCase()}</div>
            <div style="font-size:0.95rem; color:var(--text-primary);">${V(e.content||``)}</div>
          </div>
        `;break;case`divider`:d+=`<hr style="border:none; border-top:1px solid var(--border-color); margin:2rem 0;">`;break;default:d+=`<p style="font-size:1rem; line-height:1.7; margin-bottom:1rem;">${V(e.content||``)}</p>`}}),e.innerHTML=`
    <div style="margin-bottom:1.5rem; font-size:0.84rem; color:var(--text-muted);">
      <span style="color:var(--accent-primary); font-weight:600;">${n}</span> • <span>${new Date().toISOString().split(`T`)[0]}</span> • <span>DOI: ${s}</span>
    </div>

    <h1 style="font-size:2.2rem; line-height:1.3; margin-bottom:0.75rem; color:var(--text-primary);">${V(t)}</h1>
    <div style="font-size:0.95rem; color:var(--text-secondary); margin-bottom:1.25rem;">
      <strong>Authors:</strong> <span style="color:var(--accent-primary);">${V(i)}</span>
    </div>

    <!-- Updated By Attribution Stamp -->
    <div style="display:inline-flex; align-items:center; gap:0.4rem; padding:0.3rem 0.75rem; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); border-radius:9999px; font-size:0.76rem; color:var(--accent-emerald); font-weight:600; margin-bottom:1.5rem;">
      <span>●</span>
      <span>Updated by ${V(u)} on ${new Date().toLocaleDateString()}</span>
    </div>

    ${r?`
      <div style="border-radius:14px; overflow:hidden; margin-bottom:2rem; max-height:360px; box-shadow:var(--shadow-md);">
        <img src="${r}" style="width:100%; height:100%; object-fit:cover;">
      </div>
    `:``}

    ${a?`
      <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:12px; padding:1.5rem; margin-bottom:2rem;">
        <div style="font-size:0.78rem; text-transform:uppercase; color:var(--accent-primary); font-weight:700; margin-bottom:0.5rem; letter-spacing:0.06em;">Academic Abstract</div>
        <p style="font-style:italic; font-size:0.98rem; line-height:1.65; color:var(--text-secondary);">${V(a)}</p>
      </div>
    `:``}

    <div class="preview-content-body">
      ${f?`<div class="crii-doc">`+window.CRII_WORD.getCleanHtml()+`</div>`:d}
    </div>

    ${c.length>0?`
      <div style="margin-top:2.5rem; padding-top:1.5rem; border-top:1px solid var(--border-color); display:flex; gap:0.4rem; flex-wrap:wrap;">
        ${c.map(e=>`<span class="tag-item">#${V(e)}</span>`).join(` `)}
      </div>
    `:``}
  `,window.CriiDoc&&window.CriiDoc.renderMath(e)}async function Ce(){let e=(document.getElementById(`bloggerTitleInput`)?.value||``).trim();if(!e){window.showToast(`Please enter an article title`,`error`),document.getElementById(`bloggerTitleInput`)?.focus();return}let t=document.getElementById(`bloggerCategoryInput`)?.value||`Space & Astrophysics`,n=(document.getElementById(`bloggerCoverInput`)?.value||``).trim(),r=(document.getElementById(`bloggerSlugInput`)?.value||``).trim();r||=e.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/(^-|-$)+/g,``),r||=`article-${Date.now().toString(36)}`;let i=(document.getElementById(`bloggerAuthorsInput`)?.value||``).trim(),a=(document.getElementById(`bloggerDoiInput`)?.value||``).trim()||`10.5281/crii.2026.${Math.floor(1e3+Math.random()*9e3)}`,o=!!(window.CRII_WORD&&window.CRII_WORD.getMode()===`doc`),s=(document.getElementById(`bloggerSummaryInput`)?.value||``).trim()||(o?window.CRII_WORD.getExcerpt(220):``)||e,c=(document.getElementById(`bloggerAbstractInput`)?.value||``).trim()||s,l=(document.getElementById(`bloggerTagsInput`)?.value||``).trim(),u=window.CRII_API.getCurrentUser(),d=u&&(u.name||u.email)||`Administrator`,f=0,p;o?(f=window.CRII_WORD.getWordCount(),p=window.CriiDoc.MARK+window.CRII_WORD.getCleanHtml()):(x.forEach(e=>{e.content&&(f+=String(e.content).split(/\s+/).length)}),p=be(x)||s);let m=`${Math.max(1,Math.ceil(f/180))} min read`,h=!!document.getElementById(`bloggerFeaturedInput`)?.checked,g=fe?ue.find(e=>e.id===fe):null,ee={id:fe||`crii-paper-${Date.now()}`,title:e,slug:r,category:t,coverImage:n,featured:h,authors:i?i.split(`,`).map(e=>e.trim()).filter(Boolean):[d],readingTime:m,doi:a,summary:s,abstract:c,content:p,blocks:o?[]:x,tags:l?l.split(`,`).map(e=>e.trim()).filter(Boolean):[`Research`],published:S,createdBy:g&&(g.createdBy||g.authors?.[0])||d,createdAt:g&&(g.createdAt||g.date)||new Date().toISOString(),updatedBy:g?d:null,updatedAt:g?new Date().toISOString():null,isEdited:!!g},_=document.getElementById(`bloggerSaveBtn`);_&&(_.disabled=!0,_.innerText=`Saving...`);try{await window.CRII_API.savePost(ee),window.CRII_WORD&&window.CRII_WORD.clearDraft(),window.showToast(`Publication successfully ${S?`published`:`saved as draft`}!`,`success`);try{await ve()}catch(e){console.warn(`Publication saved, background refresh encountered notice:`,e)}}catch(e){console.error(`Save publication error:`,e),window.showToast(`Failed to save publication: ${e.message}`,`error`)}finally{_&&(_.disabled=!1,_.innerText=S?`Save & Publish`:`Save as Draft`)}}function we(){let e=document.getElementById(`portalPostsTbody`);if(!e)return;let t=(document.getElementById(`searchPostsInput`)?.value||``).toLowerCase().trim(),n=ue;t&&(n=n.filter(e=>(e.title||``).toLowerCase().includes(t)||(e.category||``).toLowerCase().includes(t)||(e.summary||``).toLowerCase().includes(t))),e.innerHTML=n.length===0?`<tr><td colspan="5" style="text-align:center; padding:3rem; color:var(--text-muted);">No publications found. Click "+ Create New Publication" to publish.</td></tr>`:n.map(e=>{let t=e.published!==!1,n=e.coverImage||`https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=120&q=60`,r=e.updatedBy?`by ${e.updatedBy}`:`by Lead Fellow`,i=e.updatedAt?new Date(e.updatedAt).toLocaleDateString():e.date;return`
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:0.85rem;">
            <img src="${n}" style="width:48px; height:48px; border-radius:8px; object-fit:cover; border:1px solid var(--border-color); flex-shrink:0;">
            <div>
              <div style="font-weight:600; color:var(--text-primary); font-size:0.92rem; line-height:1.3;">${V(e.title)}</div>
              <div style="font-size:0.74rem; color:var(--text-muted); font-family:monospace; margin-top:0.2rem;">/${e.slug||e.id} • ${e.readingTime||`10 min`}</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-blue">${e.category}</span></td>
        <td>
          <div style="font-size:0.84rem; font-weight:500; color:var(--text-primary);">${i}</div>
          <div style="font-size:0.74rem; color:var(--text-muted);">${V(r)}</div>
        </td>
        <td>
          <span class="status-chip ${t?`published`:`draft`}">
            ${t?`Published`:`Draft`}
          </span>
        </td>
        <td style="text-align:right;">
          <div style="display:inline-flex; gap:0.4rem;">
            <button class="btn btn-secondary btn-sm" onclick="openBloggerEditor('${e.id}')" title="Edit publication in studio">
              Edit
            </button>
            <a href="/article?id=${e.id}" target="_blank" class="btn btn-glass btn-sm" title="View public article">
              Preview ↗
            </a>
            <button class="btn btn-sm btn-icon" title="Toggle status" onclick="togglePublishPost('${e.id}')" style="background:rgba(0,0,0,0.04);">
              ${t?`Hide`:`Show`}
            </button>
            <button class="btn btn-sm btn-icon" title="Delete" style="background:rgba(239, 68, 68, 0.1); color:#ef4444;" onclick="deletePost('${e.id}')">
              ✕
            </button>
          </div>
        </td>
      </tr>
    `}).join(``)}window.renderPostsDirectory=we,window.filterPostsList=function(e){[`All`,`Pub`,`Draft`].forEach(e=>{document.getElementById(`filterPosts${e}`)?.classList.remove(`active`)}),e===`all`?(document.getElementById(`filterPostsAll`)?.classList.add(`active`),ue=window.CRII_API.getPosts({includeDrafts:!0}).then(e=>{ue=e,we()})):e===`published`?(document.getElementById(`filterPostsPub`)?.classList.add(`active`),window.CRII_API.getPosts({includeDrafts:!0}).then(e=>{ue=e.filter(e=>e.published!==!1),we()})):e===`draft`&&(document.getElementById(`filterPostsDraft`)?.classList.add(`active`),window.CRII_API.getPosts({includeDrafts:!0}).then(e=>{ue=e.filter(e=>e.published===!1),we()}))},window.togglePublishPost=async function(e){await window.CRII_API.togglePostPublish(e),window.showToast(`Publication visibility updated`,`success`),await E()},window.deletePost=async function(e){window.confirm(`Permanently delete this research publication?`)&&(await window.CRII_API.deletePost(e),window.showToast(`Publication deleted`,`info`),await E())};function M(){let e=document.getElementById(`openAddResearcherBtn`);e&&e.addEventListener(`click`,()=>{openResearcherModal(null)});let t=document.getElementById(`researcherForm`);t&&t.addEventListener(`submit`,async e=>{e.preventDefault();let t=document.getElementById(`researcherEditId`).value,n=document.getElementById(`resNameInput`).value.trim(),r=document.getElementById(`resEmailInput`).value.trim(),i=document.getElementById(`resAvatarInput`).value.trim(),a=document.getElementById(`resRoleInput`).value.trim(),o=document.getElementById(`resDivisionInput`).value,s=document.getElementById(`resUniversityInput`).value.trim(),c=document.getElementById(`resDegreeInput`).value.trim(),l=document.getElementById(`resBioInput`).value.trim(),u=document.getElementById(`resGithubInput`).value.trim(),d=document.getElementById(`resLinkedinInput`).value.trim(),f=document.getElementById(`resIsTeamMember`).checked,p=Number(document.getElementById(`resOrderIndex`).value)||10,m={id:t||void 0,name:n,email:r,avatar:i||`https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,role:a,division:o,university:s,degree:c,bio:l,isTeamMember:f,orderIndex:p,socials:{github:u,linkedin:d,email:r}};await window.CRII_API.saveIntern(m),window.showToast(`Researcher profile ${t?`updated`:`added`}!`,`success`),closeResearcherModal(),await E()});let n=document.getElementById(`searchRosterInput`);n&&n.addEventListener(`input`,()=>{N()})}function N(){let e=document.getElementById(`rosterCardsGrid`);if(!e)return;let t=(document.getElementById(`searchRosterInput`)?.value||``).toLowerCase().trim(),n=b.activeInterns||[];t&&(n=n.filter(e=>(e.name||``).toLowerCase().includes(t)||(e.role||``).toLowerCase().includes(t)||(e.division||``).toLowerCase().includes(t))),e.innerHTML=n.length===0?`<div style="grid-column: 1/-1; text-align:center; padding:3rem; color:var(--text-muted);">No researchers match your query. Click "+ Add Researcher / Fellow" to add members.</div>`:n.map(e=>{let t=!!e.isTeamMember;return`
      <div class="roster-card">
        <div class="roster-card-header">
          <img src="${e.avatar||`https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`}" alt="${V(e.name)}" class="roster-avatar-img">
          <div>
            <div style="font-weight:700; color:var(--text-primary); font-size:1.05rem;">${V(e.name)}</div>
            <div style="font-size:0.82rem; color:var(--accent-primary); font-weight:600;">${V(e.role)}</div>
            ${t?`<span class="badge-core-team" style="margin-top:0.3rem;">★ Core Leadership</span>`:`<span class="badge badge-blue" style="margin-top:0.3rem;">Fellow</span>`}
          </div>
        </div>

        <div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:0.5rem;">
          <strong>Division:</strong> ${V(e.division||`Research`)}
        </div>

        <p style="font-size:0.86rem; color:var(--text-secondary); line-height:1.5; margin-bottom:1rem; flex-grow:1;">
          ${V(e.bio||`Research researcher and student contributor.`)}
        </p>

        <div class="roster-actions">
          <button class="btn btn-secondary btn-sm" onclick="openResearcherModal('${e.id}')" style="flex:1;">
            Edit Profile
          </button>
          ${e.email||e.socials&&e.socials.email?`
          <button class="btn btn-sm btn-icon" style="background:rgba(234,88,12,0.1); color:#ea580c;" onclick="openEmailComposer('${V(e.email||e.socials.email)}', '${V(e.name)}')" title="Send Email">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </button>`:``}
          <button class="btn btn-sm btn-icon" style="background:rgba(239, 68, 68, 0.1); color:#ef4444;" onclick="deleteResearcher('${e.id}')" title="Delete">
            ✕
          </button>
        </div>
      </div>
    `}).join(``)}window.renderRosterGrid=N,window.filterRosterList=function(e){[`All`,`Team`,`Fellows`].forEach(e=>{document.getElementById(`filterRoster${e}`)?.classList.remove(`active`)}),window.CRII_API.getInternsData().then(t=>{e===`all`?(document.getElementById(`filterRosterAll`)?.classList.add(`active`),b.activeInterns=t.activeInterns):e===`team`?(document.getElementById(`filterRosterTeam`)?.classList.add(`active`),b.activeInterns=(t.activeInterns||[]).filter(e=>e.isTeamMember)):e===`fellows`&&(document.getElementById(`filterRosterFellows`)?.classList.add(`active`),b.activeInterns=(t.activeInterns||[]).filter(e=>!e.isTeamMember)),N()})},window.openResearcherModal=function(e){let t=document.getElementById(`researcherModal`),n=document.getElementById(`researcherModalTitle`),r=document.getElementById(`researcherEditId`);if(t){if(e){let t=(b.activeInterns||[]).find(t=>t.id===e);t&&(n&&(n.innerText=`Edit Researcher Profile`),r&&(r.value=t.id),document.getElementById(`resNameInput`).value=t.name||``,document.getElementById(`resEmailInput`).value=t.email||``,document.getElementById(`resAvatarInput`).value=t.avatar||``,document.getElementById(`resRoleInput`).value=t.role||``,document.getElementById(`resDivisionInput`).value=t.division||`Space & Astrophysics`,document.getElementById(`resUniversityInput`).value=t.university||``,document.getElementById(`resDegreeInput`).value=t.degree||``,document.getElementById(`resBioInput`).value=t.bio||``,document.getElementById(`resGithubInput`).value=t.socials?.github||``,document.getElementById(`resLinkedinInput`).value=t.socials?.linkedin||``,document.getElementById(`resIsTeamMember`).checked=!!t.isTeamMember,document.getElementById(`resOrderIndex`).value=t.orderIndex||1)}else n&&(n.innerText=`Add Researcher / Fellow`),r&&(r.value=``),document.getElementById(`researcherForm`).reset(),document.getElementById(`resAvatarInput`).value=`https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,document.getElementById(`resIsTeamMember`).checked=!1,document.getElementById(`resOrderIndex`).value=10;t.classList.add(`active`)}},window.closeResearcherModal=function(){let e=document.getElementById(`researcherModal`);e&&e.classList.remove(`active`)},window.deleteResearcher=async function(e){window.confirm(`Delete this researcher from the institute roster? This also revokes their portal login permissions.`)&&(await window.CRII_API.deleteIntern(e),b.activeInterns=(b.activeInterns||[]).filter(t=>t.id!==e),N(),renderResearchersTable(),window.showToast(`Researcher profile and portal access removed`,`info`),await E())};var P=[],F=0,I=[],L=0;function R(){let e=document.getElementById(`settingHeroFontFamily`),t=document.getElementById(`settingHeroImageOpacity`),n=document.getElementById(`heroImageOpacityValueBadge`),r=document.getElementById(`settingHeroBlur`),i=document.getElementById(`settingHeroOverlay`),a=document.getElementById(`heroBlurValueBadge`),o=document.getElementById(`heroOverlayValueBadge`),s=document.getElementById(`heroLivePreviewTitle`),c=document.getElementById(`heroLivePreviewOverlay`),l=document.getElementById(`heroLivePreviewStage`),u=e?e.value:`Eyekons`;t&&Number(t.value)/100;let d=r?r.value:12,f=i?i.value:55;if(n&&t&&(n.innerText=`${t.value}%`),a&&(a.innerText=`${d}px`),o&&(o.innerText=`${f}%`),s&&(s.style.fontFamily=`"${u}", sans-serif`),c&&(c.style.background=`rgba(5, 7, 15, ${f/100})`),l&&P.length>0){let e=P[F]||P[0];l.style.backgroundImage=`url('${e}')`}}function Te(){let e=document.getElementById(`heroImagesListContainer`),t=document.getElementById(`heroImagesCountBadge`);t&&(t.innerText=`${P.length} Image${P.length===1?``:`s`}`),e&&(e.innerHTML=P.length===0?`
      <div style="grid-column: 1 / -1; padding: 1.25rem; text-align: center; color: var(--text-muted); font-size: 0.8rem; border: 1px dashed var(--border-color); border-radius: 6px;">
        No images in background pool. Please add an image URL or click "Upload Image" below.
      </div>
    `:P.map((e,t)=>{let n=t===F;return`
      <div class="hero-image-chip ${n?`is-fixed-active`:``}" title="${V(e)}">
        <img src="${V(e)}" alt="Hero BG ${t+1}" loading="lazy" onerror="this.src='assets/curiomas-no-bg.png'">
        <button type="button" class="hero-image-chip-pin" title="${n?`Currently pinned fixed active image`:`Pin as fixed active image`}" onclick="setHeroFixedImage(${t})">
          ${n?`★`:`☆`}
        </button>
        <button type="button" class="hero-image-chip-delete" title="Remove image" onclick="removeHeroImage(${t})">
          &times;
        </button>
      </div>
    `}).join(``))}function Ee(){let e=document.getElementById(`heroVideosListContainer`),t=document.getElementById(`heroVideosCountBadge`);t&&(t.innerText=`${I.length} Video${I.length===1?``:`s`}`),e&&(e.innerHTML=I.length===0?`
      <div style="grid-column: 1 / -1; padding: 1.25rem; text-align: center; color: var(--text-muted); font-size: 0.8rem; border: 1px dashed var(--border-color); border-radius: 6px;">
        No videos in pool. Please add a video URL or click "Upload Video" below.
      </div>
    `:I.map((e,t)=>{let n=t===L;return`
      <div class="hero-video-chip ${n?`is-fixed-active`:``}" title="${V(e)}">
        <video src="${V(e)}" muted loop playsinline autoplay onmouseover="this.play()" onmouseout="this.pause()"></video>
        <button type="button" class="hero-video-chip-pin" title="${n?`Currently pinned fixed active video`:`Pin as fixed active video`}" onclick="setHeroFixedVideo(${t})">
          ${n?`★`:`☆`}
        </button>
        <button type="button" class="hero-video-chip-delete" title="Remove video" onclick="removeHeroVideo(${t})">
          &times;
        </button>
        <div class="hero-video-chip-badge">Video #${t+1}</div>
      </div>
    `}).join(``))}window.renderHeroVideosList=Ee,window.removeHeroImage=function(e){P.length<=1?window.showToast&&window.showToast(`You must keep at least 1 image in the pool.`,`warning`):(P.splice(e,1),F>=P.length&&(F=Math.max(0,P.length-1)),Te(),R())},window.setHeroFixedImage=function(e){F=e,Te(),R(),window.showToast&&window.showToast(`Image #${e+1} pinned as fixed active background!`,`info`)},window.removeHeroVideo=function(e){I.length<=1?window.showToast&&window.showToast(`You must keep at least 1 video in the pool.`,`warning`):(I.splice(e,1),L>=I.length&&(L=Math.max(0,I.length-1)),Ee())},window.setHeroFixedVideo=function(e){L=e,Ee(),window.showToast&&window.showToast(`Video #${e+1} pinned as fixed active background!`,`info`)},window.addHeroImageFromInput=function(){let e=document.getElementById(`newHeroImageUrl`);if(!e)return;let t=e.value.trim();t?P.includes(t)?window.showToast&&window.showToast(`Image already exists in pool`,`warning`):(P.push(t),e.value=``,Te(),R(),window.showToast&&window.showToast(`Image added to hero background pool!`,`success`)):window.showToast&&window.showToast(`Please enter an image URL`,`error`)},window.addHeroVideoFromInput=function(){let e=document.getElementById(`newHeroVideoUrl`);if(!e)return;let t=e.value.trim();t?I.includes(t)?window.showToast&&window.showToast(`Video already exists in pool`,`warning`):(I.push(t),e.value=``,Ee(),window.showToast&&window.showToast(`Video added to hero background pool!`,`success`)):window.showToast&&window.showToast(`Please enter a video URL`,`error`)},window.handleHeroImageUpload=async function(e){let t=e.target.files&&e.target.files[0];if(!t)return;let n=document.getElementById(`heroImageUploadStatus`);n&&(n.style.display=`block`,n.style.color=`var(--accent-primary)`,n.innerHTML=`⏳ Uploading "${V(t.name)}"... Please wait.`);let r=null;try{let e=new FormData;e.append(`file`,t);let n=await fetch(`/api/upload`,{method:`POST`,body:e});if(n.ok){let e=await n.json();e.url&&(r=e.url)}}catch(e){console.warn(`API upload fallback:`,e)}if(!r)try{r=await new Promise((e,n)=>{let r=new FileReader;r.onload=()=>e(r.result),r.onerror=n,r.readAsDataURL(t)})}catch(e){n&&(n.style.color=`#ef4444`,n.innerHTML=`⚠️ Upload failed: ${V(e.message)}`);return}r&&(P.push(r),Te(),R(),n&&(n.style.color=`#10b981`,n.innerHTML=`✓ Image uploaded & added to pool successfully!`,setTimeout(()=>{n&&(n.style.display=`none`)},4e3)),window.showToast&&window.showToast(`Image uploaded and added to pool!`,`success`)),e.target.value=``},window.handleHeroVideoUpload=async function(e){let t=e.target.files&&e.target.files[0];if(!t)return;let n=document.getElementById(`heroVideoUploadStatus`);n&&(n.style.display=`block`,n.style.color=`var(--accent-primary)`,n.innerHTML=`⏳ Uploading video "${V(t.name)}"... Please wait.`);let r=null;try{let e=new FormData;e.append(`file`,t);let n=await fetch(`/api/upload`,{method:`POST`,body:e});if(n.ok){let e=await n.json();e.url&&(r=e.url)}}catch(e){console.warn(`Video upload API error:`,e)}if(!r)try{r=await new Promise((e,n)=>{let r=new FileReader;r.onload=()=>e(r.result),r.onerror=n,r.readAsDataURL(t)})}catch(e){n&&(n.style.color=`#ef4444`,n.innerHTML=`⚠️ Upload failed: ${V(e.message)}`);return}r&&(I.push(r),Ee(),n&&(n.style.color=`#10b981`,n.innerHTML=`✓ Video uploaded & added to pool successfully!`,setTimeout(()=>{n&&(n.style.display=`none`)},4e3)),window.showToast&&window.showToast(`Hero video uploaded and added to pool!`,`success`)),e.target.value=``},window.addHeroImagePreset=function(e){e&&(P.includes(e)?window.showToast&&window.showToast(`Preset already added to pool`,`info`):(P.push(e),Te(),R(),window.showToast&&window.showToast(`Preset added to hero images pool!`,`success`)))},window.addHeroVideoPreset=function(e){e&&(I.includes(e)?window.showToast&&window.showToast(`Video preset already added to pool`,`info`):(I.push(e),Ee(),window.showToast&&window.showToast(`Video preset added to pool!`,`success`)))},window.setHeroVideoPreset=function(e){addHeroVideoPreset(e)};function De(){if(!window.CRII_API)return;let e=window.CRII_API.getHeroSettings();if(!e)return;let t=document.getElementById(`settingHeroFontFamily`),n=document.getElementById(`settingHeroMediaType`),r=document.getElementById(`settingHeroSelectionMode`),i=document.getElementById(`settingHeroImageOpacity`),a=document.getElementById(`heroImageOpacityValueBadge`),o=document.getElementById(`settingHeroBlur`),s=document.getElementById(`settingHeroOverlay`);document.getElementById(`heroBlurValueBadge`),document.getElementById(`heroOverlayValueBadge`);let c=document.getElementById(`settingHeroSoundEnabled`);if(F=Number(e.fixedImageIndex)||0,L=Number(e.fixedVideoIndex)||0,c&&(c.checked=e.soundEnabled===void 0||!!e.soundEnabled),t&&e.fontFamily&&(t.value=e.fontFamily),n&&e.mediaType&&(n.value=e.mediaType),r&&e.selectionMode&&(r.value=e.selectionMode),P=Array.isArray(e.backgroundImages)&&e.backgroundImages.length>0?[...e.backgroundImages]:[`https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=85`,`https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=85`,`https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=85`,`https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=85`],I=Array.isArray(e.backgroundVideos)&&e.backgroundVideos.length>0?[...e.backgroundVideos]:[`assets/hero-bg.mp4`,`https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4`,`https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-starfield-in-space-41539-large.mp4`,`https://assets.mixkit.co/videos/preview/mixkit-planet-earth-rotating-in-space-39982-large.mp4`],i){let t=e.imageOpacity===void 0?40:Math.round(e.imageOpacity*100);i.value=t,a&&(a.innerText=`${t}%`)}o&&(o.value=e.blurPx===void 0?12:e.blurPx),s&&(s.value=Math.round((e.overlayOpacity===void 0?.55:e.overlayOpacity)*100)),t&&t.addEventListener(`change`,R),n&&n.addEventListener(`change`,R),r&&r.addEventListener(`change`,R),i&&i.addEventListener(`input`,R),o&&o.addEventListener(`input`,R),s&&s.addEventListener(`input`,R),Te(),Ee(),R();let l=document.getElementById(`heroAppearanceForm`);l&&l.addEventListener(`submit`,async e=>{e.preventDefault();let a=n?n.value:`both`,l=r?r.value:`random`,u=t?t.value:`Eyekons`,d=i?Number(i.value)/100:.4,f=o?Number(o.value):12,p=s?Number(s.value)/100:.55,m=!c||c.checked;await window.CRII_API.saveHeroSettings({mediaType:a,selectionMode:l,fixedImageIndex:F,fixedVideoIndex:L,fontFamily:u,soundEnabled:m,backgroundImages:[...P],backgroundVideos:[...I],videoUrl:I[0]||`assets/hero-bg.mp4`,imageOpacity:d,blurPx:f,overlayOpacity:p}),window.showToast&&window.showToast(`Hero section media pool & typography saved!`,`success`)})}function Oe(){let e=document.getElementById(`portalAppsTbody`);if(!e)return;let t=b.applications||[];e.innerHTML=t.length===0?`<tr><td colspan="6" style="text-align:center; padding:3rem; color:var(--text-muted);">No student fellowship applications pending review.</td></tr>`:t.map(e=>{let t=`warning`;return e.status===`Accepted`&&(t=`success`),e.status===`Declined`&&(t=`danger`),`
      <tr>
        <td>
          <div style="font-weight:600; color:var(--text-primary);">${V(e.fullName)}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${V(e.email)}</div>
        </td>
        <td>
          <div>${V(e.university)}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${V(e.fieldOfStudy)}</div>
        </td>
        <td><span class="badge badge-blue">${V(e.preferredDivision)}</span></td>
        <td>${e.appliedDate}</td>
        <td><span class="badge badge-${t}">${e.status}</span></td>
        <td>
          <div style="display:inline-flex; gap:0.4rem; align-items:center;">
            <button class="btn btn-secondary btn-sm" onclick="reviewApplication('${e.id}')">
              Review
            </button>
            <button class="btn btn-sm btn-icon" title="Email Candidate via EmailJS" onclick="openEmailComposer('${V(e.email)}', '${V(e.fullName)}', 'CRII Fellowship Update')" style="background:rgba(234,88,12,0.08); color:var(--accent-primary);">
              ✉
            </button>
            <button class="btn btn-sm btn-icon" title="Delete Application Record" onclick="deleteApplicationRow('${e.id}')" style="background:rgba(239, 68, 68, 0.1); color:#ef4444;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `}).join(``)}window.renderApplicationsTable=Oe,window.deleteApplicationRow=async function(e){window.confirm(`Are you sure you want to permanently delete this application record?`)&&(await window.CRII_API.deleteApplication(e),b.applications=(b.applications||[]).filter(t=>t.id!==e),Oe(),window.showToast(`Application record deleted successfully`,`info`))};var z=null;function ke(){let e=document.getElementById(`appReviewModal`);if(!e)return;e.querySelectorAll(`.modal-close`).forEach(t=>{t.addEventListener(`click`,()=>e.classList.remove(`active`))});let t=document.getElementById(`acceptAppBtn`);t&&t.addEventListener(`click`,async()=>{if(!z)return;let n=(b.applications||[]).find(e=>e.id===z);if(!n)return;let r=document.getElementById(`reviewAppRoleSelect`)?.value||`Research Fellow`,i=document.getElementById(`reviewAppDivisionSelect`)?.value||n.preferredDivision||`Scientific Division`,a=document.getElementById(`reviewAppGrantAccess`)?.checked??!0,o=document.getElementById(`reviewAppAddToRoster`)?.checked??!0,s=document.getElementById(`reviewAppSendEmail`)?.checked??!0;t.disabled=!0,t.innerHTML=`<span>Processing Admission...</span>`;try{if(await window.CRII_API.updateApplicationStatus(z,`Accepted`,{role:r,division:i,grantLoginAccess:a,addToRoster:o}),s&&typeof emailjs<`u`){let e=localStorage.getItem(`crii_emailjs_template_id`)||window.CRII_API.getEmailjsTemplateId&&window.CRII_API.getEmailjsTemplateId()||`zhelx7y`,t={to_name:n.fullName,to_email:n.email,reply_to:`harunabdullahrakin@gmail.com`,subject:`Welcome to Curiomas Research & Innovation Institute — Admission Confirmed`,message:`Dear ${n.fullName},\n\nCongratulations! We are pleased to inform you that your application to the Curiomas Research & Innovation Institute (CRII) has been Accepted.\n\nYou have been officially appointed as:\n• Role: ${r}\n• Division: ${i}\n\nYour researcher portal access has been provisioned. You can sign in using your account at:\nhttps://www.curiomas.zone.id/login\n\nWelcome to the collective. We look forward to your scientific contributions.\n\nWarm regards,\nHarun Abdullah Rakin\nSuper Admin & Director\nCuriomas Research & Innovation Institute (CRII)`};try{await emailjs.send(`curiomas`,e,t,`h3x_9dtR8frBq2pCi`),window.showToast&&window.showToast(`Acceptance email dispatched to ${n.email}`,`success`)}catch(e){console.warn(`EmailJS dispatch failed:`,e)}}e.classList.remove(`active`),window.showToast&&window.showToast(`Candidate accepted, access provisioned & enrolled to cohort!`,`success`),await E()}catch(e){window.showToast&&window.showToast(`Failed to accept application: `+e.message,`error`)}finally{t.disabled=!1,t.innerHTML=`
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Accept & Grant Access</span>
        `}});let n=document.getElementById(`reviewUnderwayBtn`);n&&n.addEventListener(`click`,async()=>{z&&(await window.CRII_API.updateApplicationStatus(z,`Under Review`),e.classList.remove(`active`),window.showToast(`Application marked as Under Review`,`info`),await E())});let r=document.getElementById(`rejectAppBtn`);r&&r.addEventListener(`click`,async()=>{if(!z)return;let t=(b.applications||[]).find(e=>e.id===z);if(!t||!confirm(`Are you sure you want to decline the application from ${t.fullName}?`))return;let n=document.getElementById(`reviewAppSendEmail`)?.checked??!0;r.disabled=!0,r.innerHTML=`<span>Processing...</span>`;try{if(await window.CRII_API.updateApplicationStatus(z,`Declined`,{}),n&&typeof emailjs<`u`){let e=localStorage.getItem(`crii_emailjs_template_id`)||window.CRII_API.getEmailjsTemplateId&&window.CRII_API.getEmailjsTemplateId()||`zhelx7y`,n={to_name:t.fullName,to_email:t.email,reply_to:`harunabdullahrakin@gmail.com`,subject:`Update on your Curiomas Research & Innovation Institute Application`,message:`Dear ${t.fullName},\n\nThank you for your interest in the Curiomas Research & Innovation Institute and for submitting your application.\n\nAfter careful review of our current cohort capacity and division alignments, we regret to inform you that we are unable to offer you a research fellowship at this time.\n\nWe appreciate the time you took to share your background with us, and we encourage you to stay engaged with our open-source datasets and publications, and re-apply for upcoming cohorts.\n\nSincerely,\nAdmissions Review Committee\nCuriomas Research & Innovation Institute (CRII)`};try{await emailjs.send(`curiomas`,e,n,`h3x_9dtR8frBq2pCi`),window.showToast&&window.showToast(`Decline notice emailed to ${t.email}`,`info`)}catch(e){console.warn(`EmailJS dispatch failed:`,e)}}e.classList.remove(`active`),window.showToast&&window.showToast(`Application marked as Declined`,`info`),await E()}catch(e){window.showToast&&window.showToast(`Failed to decline application: `+e.message,`error`)}finally{r.disabled=!1,r.innerHTML=`
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          <span>Decline Application</span>
        `}})}window.reviewApplication=function(e){z=e;let t=(b.applications||[]).find(t=>t.id===e);if(!t)return;let n=document.getElementById(`appReviewModal`),r=document.getElementById(`appReviewDetails`);if(!n||!r)return;let i=document.getElementById(`reviewAppDivisionSelect`);if(i&&(i.innerHTML=(window.CRII_API&&window.CRII_API.getDivisions&&window.CRII_API.getDivisions()||[]).map(e=>`<option value="${V(e.title)}">${V(e.title)}</option>`).join(``),t.preferredDivision)){let e=Array.from(i.options).find(e=>e.value.toLowerCase().includes(t.preferredDivision.toLowerCase()));e&&(i.value=e.value)}let a=document.getElementById(`reviewAppRoleSelect`);a&&(a.value=`Research Fellow`);let o={};if(t.customFields)o=t.customFields;else if(typeof t.customFields_json==`string`)try{o=JSON.parse(t.customFields_json)}catch{}let s=Object.entries(o);r.innerHTML=`
    <div style="margin-bottom:1.5rem;">
      <h2 style="font-size:1.4rem; color:var(--text-primary); margin-bottom:0.25rem;">${V(t.fullName)}</h2>
      <div style="font-size:0.85rem; color:var(--text-muted);">${V(t.email)} • ${V(t.university||`Independent`)} • ${V(t.fieldOfStudy||`General Science`)}</div>
    </div>
    
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.75rem; margin-bottom:1.25rem;">
      <div style="background:var(--bg-primary); padding:0.85rem 1rem; border-radius:8px; border:1px solid var(--border-color);">
        <div style="font-size:0.72rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; margin-bottom:0.2rem;">Preferred Division</div>
        <div style="font-weight:600; color:var(--accent-primary);">${V(t.preferredDivision||`Any Track`)}</div>
      </div>
      ${t.academicLevel?`
      <div style="background:var(--bg-primary); padding:0.85rem 1rem; border-radius:8px; border:1px solid var(--border-color);">
        <div style="font-size:0.72rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; margin-bottom:0.2rem;">Academic Level / Grade</div>
        <div style="font-weight:600; color:var(--text-primary);">${V(t.academicLevel)}</div>
      </div>`:``}
      ${t.portfolioUrl?`
      <div style="background:var(--bg-primary); padding:0.85rem 1rem; border-radius:8px; border:1px solid var(--border-color);">
        <div style="font-size:0.72rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; margin-bottom:0.2rem;">Portfolio / GitHub</div>
        <div><a href="${V(t.portfolioUrl)}" target="_blank" rel="noopener" style="color:var(--accent-primary); word-break:break-all; font-weight:500;">View Profile &rarr;</a></div>
      </div>`:``}
    </div>

    ${s.length>0?`
    <div style="background:var(--bg-primary); padding:1rem 1.25rem; border-radius:10px; margin-bottom:1.25rem; border:1px solid var(--border-color);">
      <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; margin-bottom:0.5rem;">Additional Custom Questions</div>
      ${s.map(([e,t])=>`
        <div style="margin-bottom:0.4rem; font-size:0.85rem;">
          <strong style="color:var(--text-muted);">${V(e)}:</strong>
          <span style="color:var(--text-primary); margin-left:0.35rem;">${V(String(t))}</span>
        </div>
      `).join(``)}
    </div>`:``}

    <div>
      <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; margin-bottom:0.5rem;">Research Statement</div>
      <p style="font-size:0.95rem; line-height:1.7; color:var(--text-secondary); background:var(--bg-primary); padding:1.25rem; border-radius:10px; border:1px solid var(--border-color); white-space:pre-wrap;">${V(t.statement||`No statement submitted.`)}</p>
    </div>
  `,n.classList.add(`active`)};function Ae(){let e=document.getElementById(`newDatasetForm`);e&&e.addEventListener(`submit`,async t=>{t.preventDefault();let n=document.getElementById(`dsTitleInput`).value.trim(),r=document.getElementById(`dsCategoryInput`).value,i=document.getElementById(`dsLeadInput`).value.trim(),a=document.getElementById(`dsFormatInput`).value.trim()||`CSV / HDF5`,o=document.getElementById(`dsSizeInput`).value.trim()||`25 MB`,s=document.getElementById(`dsVersionInput`).value.trim()||`v1.0.0`,c=document.getElementById(`dsLicenseInput`).value.trim()||`CC-BY 4.0`,l=document.getElementById(`dsDescInput`).value.trim();await window.CRII_API.createDataset({title:n,category:r,lead:i,format:a,size:o,version:s,license:c,description:l}),window.showToast(`Open dataset published to catalog!`,`success`),e.reset(),await E()})}function je(){let e=document.getElementById(`portalDatasetsTbody`);e&&(e.innerHTML=de.map(e=>`
    <tr>
      <td>
        <div style="font-weight:600; color:var(--text-primary);">${V(e.title)}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">${V(e.format||``)} • ${V(e.size||``)}</div>
      </td>
      <td><span class="badge badge-blue">${V(e.category||`Science`)}</span></td>
      <td><span class="status-chip published">${V(e.version||`v1.0`)}</span></td>
      <td>${V(e.lead||e.leadResearcher||`CRII Fellow`)}</td>
      <td><span style="font-size:0.78rem; font-family:monospace;">${V(e.license||`CC-BY 4.0`)}</span></td>
      <td>
        <button class="btn btn-sm btn-icon" title="Delete Dataset" style="background:rgba(239, 68, 68, 0.1); color:#ef4444; border:none; padding:0.35rem 0.65rem; border-radius:8px; cursor:pointer;" onclick="deleteDataset('${e.id}')">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </td>
    </tr>
  `).join(``))}window.renderDatasetsTable=je,window.deleteDataset=async function(e){if(e&&window.confirm(`Are you sure you want to permanently delete this scientific dataset?`))try{await window.CRII_API.deleteDataset(e),window.showToast&&window.showToast(`Dataset deleted from catalog.`,`info`),await E()}catch(e){window.alert(`Failed to delete dataset: `+(e.message||e))}};function Me(){let e=document.getElementById(`addAllowedUserForm`);e&&e.addEventListener(`submit`,async t=>{t.preventDefault();let n=e.querySelector(`button[type="submit"]`);n&&(n.disabled=!0,n.innerText=`Authorizing...`);let r=document.getElementById(`newAllowedEmail`).value.trim(),i=document.getElementById(`newAllowedName`).value.trim(),a=document.getElementById(`newAllowedRole`).value,o=document.getElementById(`newAllowedDivision`).value;try{let t=await window.CRII_API.addAllowedUser({email:r,name:i,role:a,division:o});if(!t.success){window.showToast(t.error,`error`);return}window.showToast(`User ${r} authorized and saved successfully!`,`success`),e.reset(),await B()}catch(e){window.showToast(`Failed to authorize account: `+e.message,`error`)}finally{n&&(n.disabled=!1,n.innerText=`Authorize Account`)}})}async function B(){let e=document.getElementById(`allowedUsersTbody`);e&&(e.innerHTML=(await window.CRII_API.getAllowedUsers()||[]).map(e=>`
    <tr>
      <td>
        <div style="font-weight:600; color:var(--text-primary);">${V(e.name||``)}</div>
        <div style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">${V(e.email||``)}</div>
      </td>
      <td><span class="status-chip published">${V(e.role||`Research Fellow`)}</span></td>
      <td>${V(e.division||`Scientific Division`)}</td>
      <td>${e.addedDate||`2026-09-24`}</td>
      <td>
        ${e.email===`harunabdullahrakin@gmail.com`?`<span style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">Protected</span>`:`<button class="btn btn-sm" style="background:rgba(239, 68, 68, 0.1); color:#ef4444; border:1px solid rgba(239, 68, 68, 0.25);" onclick="removeAllowedEmail('${V(e.email)}')">Revoke</button>`}
      </td>
    </tr>
  `).join(``))}window.renderAllowedUsersTable=B,window.removeAllowedEmail=async function(e){if(window.confirm(`Revoke portal permissions for ${e}?`)){let t=await window.CRII_API.removeAllowedUser(e);if(!t.success){window.showToast(t.error,`error`);return}window.showToast(`User permission revoked`,`info`),await B()}};function Ne(){let e=document.getElementById(`settingNavbarTitle`),t=document.getElementById(`settingLogoUrl`),n=document.getElementById(`settingAutzAppId`);e&&(e.value=window.CRII_API.getInstituteName()),t&&(t.value=window.CRII_API.getInstituteLogo()),n&&(n.value=window.CRII_API.getAutzAppId());let r=document.getElementById(`instituteSettingsForm`);r&&r.addEventListener(`submit`,async r=>{r.preventDefault();let i=e?e.value:``,a=t?t.value:``,o=n?n.value:``;await window.CRII_API.saveInstituteSettings({name:i,logo:a,autzAppId:o}),window.showToast(`Institute settings saved to database!`,`success`),setTimeout(()=>window.location.reload(),800)});let i=document.getElementById(`settingEmailjsTemplateId`);if(i){let e=localStorage.getItem(`crii_emailjs_template_id`)||(window.CRII_API&&typeof window.CRII_API.getEmailjsTemplateId==`function`?window.CRII_API.getEmailjsTemplateId():null)||``;e&&(i.value=e),window.CRII_API&&window.CRII_API.syncSettingsFromDb&&window.CRII_API.syncSettingsFromDb().then(()=>{let e=window.CRII_API.getEmailjsTemplateId();e&&i&&(i.value=e)}).catch(()=>{})}let a=document.getElementById(`emailjsSettingsForm`);a&&a.addEventListener(`submit`,async e=>{e.preventDefault();let t=(document.getElementById(`settingEmailjsTemplateId`)?.value||``).trim();if(!t)window.showToast(`Please enter your EmailJS Template ID`,`error`);else{localStorage.setItem(`crii_emailjs_template_id`,t);try{window.CRII_API&&typeof window.CRII_API.saveEmailjsTemplateId==`function`&&await window.CRII_API.saveEmailjsTemplateId(t);let e=window.CRII_API&&typeof window.CRII_API.getInstituteSettings==`function`?window.CRII_API.getInstituteSettings():{};window.CRII_API&&typeof window.CRII_API.saveInstituteSettings==`function`&&await window.CRII_API.saveInstituteSettings({...e,emailjsTemplateId:t})}catch(e){console.warn(`Institute settings save note:`,e)}window.showToast(`EmailJS Template ID saved as "${t}"!`,`success`)}})}function Pe(){let e=window.CRII_API&&window.CRII_API.getFestiveSettings?window.CRII_API.getFestiveSettings():{mode:`always`,theme:`holi`,intensity:.7},t=document.getElementById(`settingFestiveTheme`),n=document.getElementById(`settingFestiveMode`),r=document.getElementById(`settingFestiveIntensity`),i=document.getElementById(`festiveIntensityBadge`),a=document.getElementById(`previewSplatterLayer`),o=document.getElementById(`previewCardTitle`),s=document.getElementById(`previewCardDesc`);if(t&&(t.value=e.theme||`holi`),n&&(n.value=e.mode||`always`),r){let t=Math.round((e.intensity===void 0?.7:e.intensity)*100);r.value=t,i&&(i.innerText=`${t}%`)}function c(){let e=t?t.value:`holi`,n=r?Number(r.value):70;i&&(i.innerText=`${n}%`),a&&(a.style.opacity=n/100,e===`holi`?(o&&(o.innerText=`🎨 Festival of Colors`),s&&(s.innerText=`Vibrant multi-color paint splashes & fluid splatters.`),a.innerHTML=`
          <div style="position: absolute; top: -20px; left: -20px; width: 140px; height: 140px; border-radius: 50%; background: radial-gradient(circle, #9333ea 0%, rgba(99, 102, 241, 0) 70%); filter: blur(10px);"></div>
          <div style="position: absolute; bottom: -20px; right: -20px; width: 150px; height: 150px; border-radius: 50%; background: radial-gradient(circle, #00f2fe 0%, rgba(6, 182, 212, 0) 70%); filter: blur(10px);"></div>
          <div style="position: absolute; top: 10px; right: 20px; width: 110px; height: 110px; border-radius: 50%; background: radial-gradient(circle, #ff2a85 0%, rgba(236, 72, 153, 0) 70%); filter: blur(10px);"></div>
          <div style="position: absolute; bottom: 0; left: 20px; width: 100px; height: 100px; border-radius: 50%; background: radial-gradient(circle, #10b981 0%, rgba(132, 204, 22, 0) 70%); filter: blur(10px);"></div>
        `):e===`christmas`?(o&&(o.innerText=`❄️ Christmas Holiday`),s&&(s.innerText=`Gentle falling snowflakes, winter frost & pine glow.`),a.innerHTML=`
          <div style="position: absolute; inset: 0; background: radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.25) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(220, 38, 38, 0.25) 0%, transparent 60%);"></div>
          <div style="position: absolute; top: 15px; left: 25px; font-size: 1.4rem; color: #fff; text-shadow: 0 0 10px #fff;">❄</div>
          <div style="position: absolute; top: 40px; right: 35px; font-size: 1.1rem; color: #fff;">❅</div>
          <div style="position: absolute; bottom: 20px; left: 70px; font-size: 1.3rem; color: #fff;">❄</div>
          <div style="position: absolute; bottom: 30px; right: 20px; font-size: 1.5rem; color: #fbbf24;">✨</div>
        `):e===`cherry-blossom`?(o&&(o.innerText=`🌸 Cherry Blossom (Sakura)`),s&&(s.innerText=`Floating soft pink sakura petals & spring rose aura.`),a.innerHTML=`
          <div style="position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.25) 0%, transparent 70%);"></div>
          <div style="position: absolute; top: 15px; left: 30px; font-size: 1.4rem;">🌸</div>
          <div style="position: absolute; top: 35px; right: 30px; font-size: 1.1rem;">🌸</div>
          <div style="position: absolute; bottom: 20px; left: 45%; font-size: 1.3rem;">🌸</div>
        `):e===`eid`?(o&&(o.innerText=`🌙 Eid Mubarak`),s&&(s.innerText=`Crescent moon, geometric stars & emerald aura.`),a.innerHTML=`
          <div style="position: absolute; inset: 0; background: radial-gradient(circle at 75% 20%, rgba(16, 185, 129, 0.35) 0%, transparent 65%), radial-gradient(circle at 25% 75%, rgba(245, 158, 11, 0.25) 0%, transparent 60%);"></div>
          <div style="position: absolute; top: 15px; right: 30px; font-size: 2.2rem; color: #fbbf24; text-shadow: 0 0 20px #fbbf24;">🌙</div>
          <div style="position: absolute; top: 25px; left: 35px; font-size: 1.2rem; color: #fbbf24;">✨</div>
          <div style="position: absolute; bottom: 25px; left: 60px; font-size: 1.1rem; color: #fbbf24;">⭐</div>
          <div style="position: absolute; bottom: 20px; right: 50px; font-size: 1.3rem; color: #fbbf24;">✨</div>
        `):(o&&(o.innerText=`🎉 Festival / Carnival`),s&&(s.innerText=`Celebratory ribbons, multi-color confetti & sparkles.`),a.innerHTML=`
          <div style="position: absolute; top: 20px; left: 25px; width: 10px; height: 16px; background: #ec4899; transform: rotate(25deg);"></div>
          <div style="position: absolute; top: 40px; right: 40px; width: 14px; height: 10px; background: #06b6d4; transform: rotate(-35deg);"></div>
          <div style="position: absolute; bottom: 25px; left: 50px; width: 12px; height: 12px; background: #fbbf24; transform: rotate(15deg);"></div>
          <div style="position: absolute; bottom: 35px; right: 30px; width: 8px; height: 18px; background: #10b981; transform: rotate(45deg);"></div>
          <div style="position: absolute; top: 15px; right: 80px; font-size: 1.3rem;">✨</div>
        `))}t&&t.addEventListener(`change`,c),n&&n.addEventListener(`change`,c),r&&r.addEventListener(`input`,c),c();let l=document.getElementById(`festiveSettingsForm`);l&&l.addEventListener(`submit`,async e=>{e.preventDefault();let i=t?t.value:`holi`,a=n?n.value:`always`,o=r?Number(r.value)/100:.7;await window.CRII_API.saveFestiveSettings({mode:a,theme:i,intensity:o}),window.showToast(`Global festive theme updated! Effects will display for all visitors.`,`success`)})}function V(e){return e?String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`):``}function Fe(){if(window.emailjs)try{emailjs.init({publicKey:`h3x_9dtR8frBq2pCi`})}catch(e){console.warn(`EmailJS initialization notice:`,e)}let e=document.getElementById(`emailComposerForm`);e&&e.addEventListener(`submit`,async e=>{e.preventDefault();let t=document.getElementById(`composerSendBtn`),n=(document.getElementById(`composerToEmail`)?.value||``).trim(),r=(document.getElementById(`composerToName`)?.value||``).trim(),i=(document.getElementById(`composerSubject`)?.value||``).trim(),a=(document.getElementById(`composerTemplateId`)?.value||``).trim()||`zhelx7y`,o=(document.getElementById(`composerMessage`)?.value||``).trim();if(!n||!o)window.showToast(`Please specify a recipient email and message.`,`error`);else if(!a)window.showToast(`Please enter your EmailJS Template ID from dashboard.emailjs.com/admin/templates`,`error`,5e3),document.getElementById(`composerTemplateId`)?.focus();else{localStorage.setItem(`crii_emailjs_template_id`,a),t.disabled=!0,t.innerText=`Dispatching via curiomas...`;try{if(!window.emailjs)throw Error(`EmailJS library not loaded`);let e={to_email:n,to_name:r||n,user_email:n,from_name:`Curiomas Research & Innovation Institute`,subject:i,message:o,reply_to:`curiomas.members@gmail.com`};await emailjs.send(`curiomas`,a,e,`h3x_9dtR8frBq2pCi`),window.showToast(`Email dispatched successfully to ${n}!`,`success`),closeEmailComposer()}catch(e){console.error(`EmailJS dispatch error:`,e);let t=e?.text||e?.message||`Email dispatch failed`;t.toLowerCase().includes(`template`)&&t.toLowerCase().includes(`not found`)?window.showToast(`Template ID '${a}' not found. Please visit dashboard.emailjs.com/admin/templates to copy your actual Template ID.`,`error`,6500):window.showToast(`Email error: ${t}`,`error`,5e3)}finally{t.disabled=!1,t.innerHTML=`<span>Send Email via EmailJS</span><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`}}});let t=document.getElementById(`reviewEmailApplicantBtn`);t&&t.addEventListener(`click`,()=>{if(z){let e=(b.applications||[]).find(e=>e.id===z);e&&e.email&&openEmailComposer(e.email,e.fullName,`CRII Research Fellowship Application - ${e.preferredDivision||`Admissions`}`,`Dear ${e.fullName},\n\nThank you for applying to the Curiomas Research & Innovation Institute (CRII) Student Fellowship Cohort in ${e.preferredDivision||`the research stream`}.\n\n`)}})}window.applyComposerPreset=function(e){let t=document.getElementById(`composerSubject`),n=document.getElementById(`composerMessage`),r=document.getElementById(`composerToName`)?.value.trim()||`Researcher / Candidate`;switch(e){case`fellow_accept`:t&&(t.value=`Welcome to Curiomas Research & Innovation Institute — Fellowship Admitted`),n&&(n.value=`Dear ${r},\n\nCongratulations! On behalf of the Directorate and Academic Board at Curiomas Research & Innovation Institute (CRII), we are pleased to inform you that your application for the Research Fellowship Cohort has been accepted.\n\nYour researcher access profile has been provisioned. You can sign in using your registered email at:\nhttps://www.curiomas.zone.id/portal\n\nWelcome to the institute! We look forward to your impactful contributions to open science.\n\nWarm regards,\nDirectorate of Admissions & Research\nCuriomas Research & Innovation Institute (CRII)\ncuriomas.members@gmail.com`);break;case`fellow_update`:t&&(t.value=`CRII Fellowship Application Status Update`),n&&(n.value=`Dear ${r},\n\nThank you for your fellowship application to Curiomas Research & Innovation Institute. We are currently conducting technical review across all candidate portfolios.\n\nIf any additional artifacts, GitHub repositories, or preprint links are required, our admissions office will reach out directly.\n\nWarm regards,\nAdmissions Office\nCuriomas Research & Innovation Institute (CRII)`);break;case`fellow_decline`:t&&(t.value=`Update on your Fellowship Application — CRII`),n&&(n.value=`Dear ${r},\n\nThank you for applying to the Curiomas Research & Innovation Institute (CRII) Fellowship. We received many outstanding applications this cohort cycle and regrettably cannot offer you a placement at this time.\n\nWe encourage you to follow our open-source scientific dispatches and reapply in our upcoming cycle.\n\nWarm regards,\nAcademic Review Board\nCuriomas Research & Innovation Institute (CRII)`);break;case`inquiry_reply`:t&&(t.value=`Response from Curiomas Research & Innovation Institute (CRII)`),n&&(n.value=`Dear ${r},\n\nThank you for contacting Curiomas Research & Innovation Institute (CRII).\n\nRegarding your inquiry, our research leads and administrative office have reviewed your message.\n\nPlease let us know if you require further details, datasets, or collaboration arrangements.\n\nWarm regards,\nDirectorate Office\nCuriomas Research & Innovation Institute (CRII)\ncuriomas.members@gmail.com`);break;default:t&&(t.value=`CRII Research Institute Dispatch`),n&&(n.value=``)}},window.openEmailComposer=function(e=``,t=``,n=``,r=``){let i=document.getElementById(`emailComposerModal`);if(!i)return;let a=document.getElementById(`composerToEmail`),o=document.getElementById(`composerToName`),s=document.getElementById(`composerSubject`),c=document.getElementById(`composerMessage`),l=document.getElementById(`composerTemplateId`),u=document.getElementById(`composerTemplateSelect`);a&&(a.value=e),o&&(o.value=t),s&&(s.value=n||`CRII Research Institute Dispatch`),c&&(c.value=r||``),u&&(u.value=`custom`);let d=localStorage.getItem(`crii_emailjs_template_id`)||(window.CRII_API&&typeof window.CRII_API.getEmailjsTemplateId==`function`?window.CRII_API.getEmailjsTemplateId():null)||`zhelx7y`;l&&(l.value=d),i.classList.add(`active`)},window.closeEmailComposer=function(){let e=document.getElementById(`emailComposerModal`);e&&e.classList.remove(`active`)};async function Ie(){let e=document.getElementById(`portalDivisionsList`);if(!e||!window.CRII_API)return;let t=await window.CRII_API.getDivisions();e.innerHTML=!t||!Array.isArray(t)||t.length===0?`
      <div style="text-align:center; padding:3.5rem 1rem; color:var(--text-muted); grid-column: 1 / -1; background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: 16px;">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" style="margin-bottom:0.75rem; color:var(--text-muted);"><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/></svg>
        <p style="margin:0 0 1rem;">No research divisions found. Click "Add New Division" above to create one.</p>
        <button class="btn btn-primary btn-sm" onclick="openDivisionModal()">+ Add New Division</button>
      </div>
    `:t.map(e=>`
    <div class="division-manage-card">
      <div class="division-manage-media">
        <img src="${e.image||`https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=800&q=80`}" alt="${e.title}" loading="lazy">
        <span class="division-manage-badge">${e.tag||(e.number?e.number+` / RESEARCH DIVISION`:`RESEARCH DIVISION`)}</span>
      </div>
      <div class="division-manage-body">
        <h3 class="division-manage-title">${e.title}</h3>
        <p class="division-manage-desc">${e.desc||``}</p>
        <div class="division-manage-meta">
          <span>Route: <code>${e.link||`/research`}</code></span>
        </div>
        <div class="division-manage-actions">
          <button type="button" class="btn btn-secondary btn-sm" onclick="editDivision('${e.id}')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.35rem;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <span>Edit</span>
          </button>
          <button type="button" class="btn btn-danger btn-sm" onclick="deleteDivisionConfirm('${e.id}', '${e.title.replace(/'/g,`\\'`)}')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.35rem;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  `).join(``)}async function Le(e=null){let t=document.getElementById(`divisionModal`),n=document.getElementById(`divisionModalTitle`),r=document.getElementById(`divisionForm`);if(!t||!r)return;r.reset();let i=document.getElementById(`divisionIdInput`);if(i&&(i.value=``),e){n&&(n.innerText=`Edit Research Division`);try{let t=(await window.CRII_API.getDivisions()||[]).find(t=>String(t.id)===String(e));t&&(document.getElementById(`divisionIdInput`).value=t.id,document.getElementById(`divisionTitleInput`).value=t.title||``,document.getElementById(`divisionNumberInput`).value=t.number||``,document.getElementById(`divisionTagInput`).value=t.tag||``,document.getElementById(`divisionDescInput`).value=t.desc||``,document.getElementById(`divisionImageInput`).value=t.image||``,document.getElementById(`divisionLinkInput`).value=t.link||`/research`)}catch(e){console.warn(`Could not load division for edit:`,e)}}else n&&(n.innerText=`Add Research Division`),document.getElementById(`divisionLinkInput`).value=`/research`;t.classList.add(`active`),t.style.display=`flex`,t.style.opacity=`1`,t.style.pointerEvents=`auto`}function Re(){let e=document.getElementById(`divisionModal`);e&&(e.classList.remove(`active`),e.style.display=`none`,e.style.opacity=`0`,e.style.pointerEvents=`none`)}function ze(e){window.openDivisionModal(e)}async function Be(e){e.preventDefault();let t=document.getElementById(`divisionIdInput`).value.trim(),n=document.getElementById(`divisionTitleInput`).value.trim(),r=document.getElementById(`divisionNumberInput`).value.trim(),i=document.getElementById(`divisionTagInput`).value.trim()||(r?`${r} / RESEARCH DIVISION`:`RESEARCH DIVISION`),a=document.getElementById(`divisionDescInput`).value.trim(),o=document.getElementById(`divisionImageInput`).value.trim(),s=document.getElementById(`divisionLinkInput`).value.trim()||`/research`,c={id:t||void 0,number:r||`01`,tag:i,title:n,desc:a,image:o,link:s},l=document.getElementById(`saveDivisionBtn`);l&&(l.disabled=!0,l.innerText=`Saving...`);try{await window.CRII_API.saveDivision(c),window.closeDivisionModal(),await window.renderDivisionsTab(),window.showToast&&window.showToast(`Research division saved successfully!`,`success`)}catch(e){window.alert(`Failed to save division: `+(e.message||e))}finally{l&&(l.disabled=!1,l.innerText=`Save Division`)}}async function Ve(e,t){if(window.confirm(`Are you sure you want to delete the division "${t}"?\nThis will remove it from the homepage and research catalog.`))try{await window.CRII_API.deleteDivision(e),await window.renderDivisionsTab(),window.showToast&&window.showToast(`Division removed.`,`info`)}catch(e){window.alert(`Failed to delete division: `+(e.message||e))}}window.renderDivisionsTab=Ie,window.openDivisionModal=Le,window.closeDivisionModal=Re,window.editDivision=ze,window.handleSaveDivision=Be,window.deleteDivisionConfirm=Ve,window.renderCohortsTab=He;async function He(){let e=document.getElementById(`portalCohortsList`);if(!e||!window.CRII_API)return;let t=await window.CRII_API.getCohorts();e.innerHTML=!t||!Array.isArray(t)||t.length===0?`
      <div style="text-align:center; padding:3.5rem 1rem; color:var(--text-muted); grid-column: 1 / -1; background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: 16px;">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" style="margin-bottom:0.75rem; color:var(--text-muted);"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></svg>
        <p style="margin:0 0 1rem;">No cohort profiles found. Click "Add New Profile" above to create one.</p>
        <button class="btn btn-primary btn-sm" onclick="openCohortModal()">+ Add New Profile</button>
      </div>
    `:t.map(e=>`
    <div class="cohort-manage-card">
      <div class="cohort-manage-media">
        <img src="${e.image||`https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80`}" alt="${e.title}" loading="lazy">
      </div>
      <div class="cohort-manage-body">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem; flex-wrap:wrap; gap:0.35rem;">
          <h3 class="cohort-manage-title" style="margin:0;">${e.title}</h3>
          <span class="badge badge-blue" style="font-size:0.75rem;">${e.grade||e.academicLevel||`All Grades`}</span>
        </div>
        <div style="font-size:0.76rem; color:var(--text-muted); margin-bottom:0.5rem;">Track: <strong>${e.divisionScope||`All Research Tracks`}</strong></div>
        <p class="cohort-manage-desc">${e.desc||``}</p>
        <div class="cohort-manage-meta">
          <span>Target: <code>${e.link||`/team#apply`}</code> (${e.linkText||`Apply as Fellow`})</span>
        </div>
        <div class="cohort-manage-actions">
          <button type="button" class="btn btn-secondary btn-sm" onclick="editCohort('${e.id}')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.35rem;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <span>Edit</span>
          </button>
          <button type="button" class="btn btn-danger btn-sm" onclick="deleteCohortConfirm('${e.id}', '${(e.title||``).replace(/'/g,`\\'`)}')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.35rem;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  `).join(``)}async function Ue(e=null){let t=document.getElementById(`cohortModal`),n=document.getElementById(`cohortModalTitle`),r=document.getElementById(`cohortForm`);if(!t){console.error(`cohortModal element not found`);return}r&&r.reset();let i=document.getElementById(`cohortIdInput`);i&&(i.value=``);let a=document.getElementById(`cohortDivisionInput`);if(a&&window.CRII_API){a.innerHTML=`<option value="All Research Tracks">All Research Tracks</option>`;try{let e=await window.CRII_API.getDivisions()||[];Array.isArray(e)&&e.forEach(e=>{a.innerHTML+=`<option value="${e.title}">${e.title}</option>`})}catch(e){console.warn(`Could not load divisions for cohort modal:`,e)}}if(e){n&&(n.innerText=`Edit Cohort Profile`);try{let t=(await window.CRII_API.getCohorts()||[]).find(t=>String(t.id)===String(e));if(t){i&&(i.value=t.id);let e=document.getElementById(`cohortTitleInput`);e&&(e.value=t.title||``);let n=document.getElementById(`cohortGradeInput`);n&&(n.value=t.grade||t.academicLevel||``),a&&t.divisionScope&&(a.value=t.divisionScope);let r=document.getElementById(`cohortDescInput`);r&&(r.value=t.desc||``);let o=document.getElementById(`cohortImageInput`);o&&(o.value=t.image||``);let s=document.getElementById(`cohortLinkInput`);s&&(s.value=t.link||`/team#apply`);let c=document.getElementById(`cohortLinkTextInput`);c&&(c.value=t.linkText||`Apply as Fellow`)}}catch(e){console.warn(`Could not load cohort for edit:`,e)}}else{n&&(n.innerText=`Add Cohort Profile`);let e=document.getElementById(`cohortGradeInput`);e&&(e.value=`Undergraduate (1st - 4th Year)`);let t=document.getElementById(`cohortLinkInput`);t&&(t.value=`/team#apply`);let r=document.getElementById(`cohortLinkTextInput`);r&&(r.value=`Apply as Fellow`)}t.classList.add(`active`),t.style.display=`flex`,t.style.opacity=`1`,t.style.pointerEvents=`auto`}window.openCohortModal=Ue;function We(){let e=document.getElementById(`cohortModal`);e&&(e.classList.remove(`active`),e.style.display=`none`,e.style.opacity=`0`,e.style.pointerEvents=`none`)}window.closeCohortModal=We;function Ge(e){Ue(e)}window.editCohort=Ge;async function Ke(e){e&&e.preventDefault&&e.preventDefault();let t=document.getElementById(`cohortIdInput`).value.trim(),n=document.getElementById(`cohortTitleInput`).value.trim(),r=document.getElementById(`cohortDescInput`).value.trim(),i=document.getElementById(`cohortImageInput`).value.trim(),a=document.getElementById(`cohortLinkInput`).value.trim()||`/team#apply`,o=document.getElementById(`cohortLinkTextInput`).value.trim()||`Apply as Fellow`,s=(document.getElementById(`cohortGradeInput`)?.value||``).trim()||`Undergraduate`,c=document.getElementById(`cohortDivisionInput`)?.value||`All Research Tracks`,l={id:t||void 0,title:n,grade:s,academicLevel:s,divisionScope:c,desc:r,image:i,link:a,linkText:o},u=document.getElementById(`saveCohortBtn`);u&&(u.disabled=!0,u.innerText=`Saving...`);try{await window.CRII_API.saveCohort(l),window.closeCohortModal(),await window.renderCohortsTab(),window.showToast&&window.showToast(`Cohort profile saved successfully!`,`success`)}catch(e){window.alert(`Failed to save cohort profile: `+(e.message||e))}finally{u&&(u.disabled=!1,u.innerText=`Save Cohort Profile`)}}window.handleSaveCohort=Ke;async function qe(e,t){if(window.confirm(`Are you sure you want to delete the profile "${t}"?\nThis will remove it from the homepage "Who can join us?" section.`))try{await window.CRII_API.deleteCohort(e),await window.renderCohortsTab(),window.showToast&&window.showToast(`Cohort profile deleted.`,`info`)}catch(e){window.alert(`Failed to delete cohort profile: `+(e.message||e))}}window.deleteCohortConfirm=qe;async function Je(){let e=document.querySelector(`.login-showcase-pane`);if(!e)return;let t=[`galaxy`,`nebula`,`deep+space`,`telescope`,`hubble`,`astrophysics`,`supernova`],n=t[Math.floor(Math.random()*t.length)],r=[`https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=85`,`https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85`,`https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1600&q=85`,`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=85`,`https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1600&q=85`];try{let t=await fetch(`https://images-api.nasa.gov/search?q=`+n+`&media_type=image`);if(t.ok){let n=((await t.json())?.collection?.items||[]).filter(e=>e.links&&e.links.length>0&&e.links[0].href);if(n.length>0){let t=n[Math.floor(Math.random()*Math.min(n.length,25))].links[0].href.replace(/~thumb\.jpg$/,`~large.jpg`).replace(/~small\.jpg$/,`~large.jpg`),r=new Image;r.onload=()=>{e.style.backgroundImage=`url("`+t+`")`},r.src=t;return}}}catch(e){console.warn(`NASA image API notice:`,e)}let i=r[Math.floor(Math.random()*r.length)];e.style.backgroundImage=`url("`+i+`")`}var H=null;function Ye(){let e=document.getElementById(`customFieldsBuilderList`);if(!e||!H)return;let t=H.customFields||[];e.innerHTML=t.length===0?`<div style="font-size:0.85rem; color:var(--text-muted); padding:0.75rem 0; font-style:italic;">No custom fields added yet. Click "+ Add Custom Question" to create one.</div>`:t.map((e,t)=>`
    <div style="background:var(--bg-secondary); padding:0.85rem 1rem; border-radius:8px; border:1px solid var(--border-color); display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
      <div style="flex:2; min-width:180px;">
        <label style="font-size:0.75rem; color:var(--text-muted); font-weight:600; display:block; margin-bottom:0.2rem;">Question / Label</label>
        <input type="text" class="form-input" style="padding:0.35rem 0.65rem; font-size:0.85rem;" value="${V(e.label||``)}" onchange="updateCustomFieldProp(${t}, 'label', this.value)" placeholder="e.g. Graduation Year">
      </div>
      <div style="flex:1; min-width:120px;">
        <label style="font-size:0.75rem; color:var(--text-muted); font-weight:600; display:block; margin-bottom:0.2rem;">Type</label>
        <select class="form-select" style="padding:0.35rem 0.65rem; font-size:0.85rem;" onchange="updateCustomFieldProp(${t}, 'type', this.value)">
          <option value="text" ${e.type===`text`?`selected`:``}>Text (Single line)</option>
          <option value="textarea" ${e.type===`textarea`?`selected`:``}>Long Text</option>
          <option value="number" ${e.type===`number`?`selected`:``}>Number</option>
          <option value="select" ${e.type===`select`?`selected`:``}>Dropdown Select</option>
        </select>
      </div>
      ${e.type===`select`?`
      <div style="flex:2; min-width:180px;">
        <label style="font-size:0.75rem; color:var(--text-muted); font-weight:600; display:block; margin-bottom:0.2rem;">Options (comma-separated)</label>
        <input type="text" class="form-input" style="padding:0.35rem 0.65rem; font-size:0.85rem;" value="${V((e.options||[]).join(`, `))}" onchange="updateCustomFieldProp(${t}, 'options', this.value.split(',').map(s=>s.trim()).filter(Boolean))" placeholder="Option 1, Option 2, Option 3">
      </div>`:``}
      <div style="display:flex; align-items:center; gap:0.5rem; margin-top:1.2rem;">
        <label style="display:flex; align-items:center; gap:0.35rem; font-size:0.8rem; cursor:pointer;">
          <input type="checkbox" ${e.required?`checked`:``} onchange="updateCustomFieldProp(${t}, 'required', this.checked)"> Required
        </label>
        <button type="button" class="btn btn-danger btn-sm" style="padding:0.25rem 0.55rem; font-size:0.75rem;" onclick="removeCustomFormFieldRow(${t})">&times; Remove</button>
      </div>
    </div>
  `).join(``)}window.renderCustomFieldsBuilder=Ye;function Xe(){if(!window.CRII_API||!window.CRII_API.getApplicationFormConfig||(H=window.CRII_API.getApplicationFormConfig(),!H))return;let e=H.fields||{};Object.keys(e).forEach(t=>{let n=document.getElementById(`fieldVis_`+t),r=document.getElementById(`fieldReq_`+t);n&&(n.checked=e[t].visible!==!1),r&&(r.checked=e[t].required===!0)}),Ye()}window.initApplicationFormBuilder=Xe;function Ze(e,t,n){H&&H.customFields[e]&&(H.customFields[e][t]=n,t===`type`&&Ye())}window.updateCustomFieldProp=Ze;function Qe(){H||={fields:{},customFields:[]},Array.isArray(H.customFields)||(H.customFields=[]),H.customFields.push({id:`cf_`+Date.now().toString(36),label:`New Question`,type:`text`,placeholder:``,required:!1}),Ye()}window.addCustomFormFieldRow=Qe;function $e(e){H&&Array.isArray(H.customFields)&&(H.customFields.splice(e,1),Ye())}window.removeCustomFormFieldRow=$e;async function et(e){if(e&&e.preventDefault&&e.preventDefault(),!window.CRII_API||!window.CRII_API.saveApplicationFormConfig)return;let t=H||window.CRII_API.getApplicationFormConfig();t.fields||={},[`university`,`fieldOfStudy`,`division`,`academicLevel`,`portfolio`,`statement`].forEach(e=>{let n=document.getElementById(`fieldVis_`+e)?.checked!==!1,r=document.getElementById(`fieldReq_`+e)?.checked===!0;t.fields[e]={label:t.fields[e]?.label||e,visible:n,required:r}}),await window.CRII_API.saveApplicationFormConfig(t),window.showToast&&window.showToast(`Application form settings & custom questions saved to database!`,`success`)}window.handleSaveAppFormSettings=et;var tt=[],nt=`all`,rt=``;async function it(){let e=document.getElementById(`storageMediaGrid`);if(e){e.innerHTML=`
    <div style="grid-column: 1 / -1; padding: 3rem 1rem; text-align: center; color: var(--text-muted);">
      <div class="spinner" style="display:inline-block; width: 28px; height: 28px; border: 3px solid var(--accent-primary); border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 0.75rem;"></div>
      <p style="font-size: 0.9rem;">Connecting to Cloudflare R2 Bucket & fetching object catalog...</p>
    </div>
  `;try{let e=await fetch(`/api/storage`,{headers:{Accept:`application/json`}});if(!e.ok)throw Error(`HTTP ${e.status}`);let t=await e.json();tt=Array.isArray(t.items)?t.items:[];let n=tt.length,r=0,i=0,a=0;tt.forEach(e=>{r+=Number(e.size)||0,e.type===`video`||e.mimeType&&e.mimeType.startsWith(`video/`)||/\.(mp4|webm|mov|mkv)$/i.test(e.filename||e.key)?i++:a++});let o=(r/1048576).toFixed(1),s=document.getElementById(`storageTotalCount`),c=document.getElementById(`storageTotalSize`),l=document.getElementById(`storageVideoCount`),u=document.getElementById(`storageImageCount`);s&&(s.innerText=String(n)),c&&(c.innerText=`${o} MB`),l&&(l.innerText=String(i)),u&&(u.innerText=String(a)),at()}catch(t){e.innerHTML=`
      <div style="grid-column: 1 / -1; padding: 3rem 1rem; text-align: center; color: #ef4444; background: rgba(239, 68, 68, 0.08); border-radius: 12px; border: 1px dashed rgba(239, 68, 68, 0.3);">
        <p style="font-weight: 600; margin-bottom: 0.35rem;">Failed to load Cloudflare R2 storage catalog</p>
        <p style="font-size: 0.8rem; color: var(--text-muted);">${V(t.message)}</p>
        <button class="btn btn-secondary btn-sm" onclick="renderStorageTab()" style="margin-top: 1rem;">Retry</button>
      </div>
    `}}}window.renderStorageTab=it;function at(){let e=document.getElementById(`storageMediaGrid`);if(!e)return;let t=[...tt];nt===`image`?t=t.filter(e=>e.type===`image`||e.mimeType&&e.mimeType.startsWith(`image/`)||/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(e.filename||e.key)):nt===`video`&&(t=t.filter(e=>e.type===`video`||e.mimeType&&e.mimeType.startsWith(`video/`)||/\.(mp4|webm|mov|mkv)$/i.test(e.filename||e.key))),rt&&(t=t.filter(e=>{let t=rt;return e.filename&&e.filename.toLowerCase().includes(t)||e.key&&e.key.toLowerCase().includes(t)||e.mimeType&&e.mimeType.toLowerCase().includes(t)})),e.innerHTML=t.length===0?`
      <div style="grid-column: 1 / -1; padding: 3.5rem 1rem; text-align: center; color: var(--text-muted); background: var(--bg-surface); border-radius: 12px; border: 1px dashed var(--border-color);">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.6" style="margin-bottom: 0.75rem; opacity: 0.6;"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        <p style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">No media assets found</p>
        <p style="font-size: 0.82rem;">${tt.length===0?`Your R2 storage bucket is empty. Click "Upload Media" above to upload your first image or video.`:`No assets match the active search / filter criteria.`}</p>
      </div>
    `:t.map(e=>{let t=e.type===`video`||e.mimeType&&e.mimeType.startsWith(`video/`)||/\.(mp4|webm|mov|mkv)$/i.test(e.filename||e.key),n=((Number(e.size)||0)/1048576).toFixed(2),r=e.uploadedAt?new Date(e.uploadedAt).toLocaleDateString():`Recent`,i=e.url||`/api/images/${e.key.replace(/^uploads\//,``)}`;return`
      <div class="storage-card" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <!-- Media Preview -->
        <div style="position: relative; height: 160px; background: #07101d; overflow: hidden; display: flex; align-items: center; justify-content: center;">
          ${t?`
            <video src="${V(i)}" preload="metadata" muted playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
            <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; pointer-events: none;">
              <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(0,0,0,0.65); display: flex; align-items: center; justify-content: center; color: #ffffff;">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
            </div>
          `:`
            <img src="${V(i)}" alt="${V(e.filename)}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/assets/curiomas-no-bg.png'; this.style.objectFit='contain'; this.style.padding='1.5rem';">
          `}
          <!-- Type Badge -->
          <span style="position: absolute; top: 8px; right: 8px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; padding: 2px 7px; border-radius: 6px; background: ${t?`rgba(245, 158, 11, 0.9)`:`rgba(234, 88, 12, 0.9)`}; color: #ffffff; backdrop-filter: blur(4px);">
            ${t?`VIDEO`:`IMAGE`}
          </span>
        </div>

        <!-- Info & Metadata -->
        <div style="padding: 0.9rem 1rem; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-weight: 600; font-size: 0.88rem; color: var(--text-primary); margin-bottom: 0.2rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${V(e.filename)}">
              ${V(e.filename)}
            </div>
            <div style="font-size: 0.74rem; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <span>${n} MB</span>
              <span>${r}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm" style="flex: 1; font-size: 0.72rem; padding: 0.35rem 0.5rem;" onclick="copyStorageUrl('${V(i)}')">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.25rem;"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span>Copy URL</span>
            </button>
            <button class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 0.35rem 0.5rem;" title="Set as Hero Background ${t?`Video`:`Image`}" onclick="useAsHeroMedia('${V(i)}', ${t})">
              <span>Use in Hero</span>
            </button>
            <button class="btn btn-sm" style="background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.25); font-size: 0.72rem; padding: 0.35rem 0.5rem;" title="Delete Object from R2" onclick="deleteStorageMedia('${V(e.key)}', '${V(e.filename)}')">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    `}).join(``)}window.filterStorageMedia=function(e){nt=e,document.querySelectorAll(`.storage-filter-btn`).forEach(t=>{t.classList.toggle(`active`,t.dataset.filter===e),t.dataset.filter===e?(t.classList.remove(`btn-secondary`),t.classList.add(`btn-primary`)):(t.classList.remove(`btn-primary`),t.classList.add(`btn-secondary`))}),at()},window.handleStorageSearch=function(e){rt=(e||``).toLowerCase().trim(),at()},window.copyStorageUrl=function(e){let t=e.startsWith(`http`)?e:window.location.origin+e;navigator.clipboard.writeText(t).then(()=>{window.showToast&&window.showToast(`Public media URL copied to clipboard!`,`success`)}).catch(()=>{prompt(`Copy media URL:`,t)})},window.useAsHeroMedia=function(e,t){let n=e.startsWith(`http`)?e:window.location.origin+e;if(t)typeof window.addHeroVideoPreset==`function`&&(window.addHeroVideoPreset(n),window.showToast&&window.showToast(`Video added to Hero Background Video Pool!`,`success`));else{let e=window.CRII_API&&window.CRII_API.getHeroSettings&&window.CRII_API.getHeroSettings()||{},t=Array.isArray(e.backgroundImages)?[...e.backgroundImages]:[];t.includes(n)?window.showToast&&window.showToast(`Image already exists in Hero Pool`,`info`):(t.unshift(n),e.backgroundImages=t,window.CRII_API&&window.CRII_API.saveHeroSettings&&window.CRII_API.saveHeroSettings(e),typeof window.renderHeroImagesList==`function`&&window.renderHeroImagesList(),typeof window.updateHeroPreview==`function`&&window.updateHeroPreview(),window.showToast&&window.showToast(`Image added to Hero Background Image Pool!`,`success`))}},window.deleteStorageMedia=async function(e,t){if(confirm(`Are you sure you want to permanently delete "${t||e}" from Cloudflare R2? This cannot be undone.`))try{let n=await fetch(`/api/storage?key=${encodeURIComponent(e)}`,{method:`DELETE`});if(!n.ok)throw Error(`HTTP ${n.status}`);let r=await n.json();if(r.success)window.showToast&&window.showToast(`Deleted "${t||e}" successfully`,`success`),tt=tt.filter(t=>t.key!==e),it();else throw Error(r.error||`Failed to delete`)}catch(e){window.showToast&&window.showToast(`Delete failed: ${e.message}`,`error`)}},window.handleStorageFileUpload=async function(e){let t=e.target.files;if(!t||t.length===0)return;window.showToast&&window.showToast(`Uploading ${t.length} file${t.length===1?``:`s`} to Cloudflare R2...`,`info`);let n=0,r=0;for(let e=0;e<t.length;e++){let i=t[e],a=new FormData;a.append(`file`,i),a.append(`source`,`portal_storage`);try{let e=await fetch(`/api/storage`,{method:`POST`,body:a});if(!e.ok)throw Error(`HTTP ${e.status}`);(await e.json()).success?n++:r++}catch{r++}}e.target.value=``,n>0&&(window.showToast&&window.showToast(`Successfully uploaded ${n} asset${n===1?``:`s`} to R2!`,`success`),it()),r>0&&window.showToast&&window.showToast(`${r} asset upload(s) failed.`,`error`)};function ot(){let e=document.getElementById(`storageDropzone`),t=document.getElementById(`storageFileInput`);e&&t&&(e.onclick=()=>t.click(),[`dragenter`,`dragover`].forEach(t=>{e.addEventListener(t,t=>{t.preventDefault(),t.stopPropagation(),e.style.borderColor=`var(--accent-primary, #ea580c)`,e.style.background=`rgba(234, 88, 12, 0.05)`})}),[`dragleave`,`drop`].forEach(t=>{e.addEventListener(t,t=>{t.preventDefault(),t.stopPropagation(),e.style.borderColor=`var(--border-color)`,e.style.background=`var(--bg-surface)`})}),e.addEventListener(`drop`,e=>{let t=e.dataTransfer.files;t&&t.length>0&&window.handleStorageFileUpload({target:{files:t,value:``}})}))}window.initStorageDropzone=ot;var U=[],st=[],W=null,G=null,ct=null;function lt(){let e=document.getElementById(`openCreateAliasBtn`);e&&e.addEventListener(`click`,()=>window.openProvisionAliasModal());let t=document.getElementById(`openManageKeysBtn`);t&&t.addEventListener(`click`,()=>window.openManageKeysModal());let n=document.getElementById(`refreshAliasesBtn`);n&&n.addEventListener(`click`,()=>window.refreshAliasesData());let r=document.getElementById(`improvmxDomainSelect`);r&&r.addEventListener(`change`,async e=>{W=e.target.value,await window.loadImprovmxAliases(W),await window.checkDomainHealth(W)});let i=document.getElementById(`searchAliasesInput`);i&&i.addEventListener(`input`,()=>{window.filterAliasesList(`all`)}),[`provisionAliasModal`,`editAliasModal`,`manageImprovmxKeysModal`].forEach(e=>{let t=document.getElementById(e);t&&t.addEventListener(`click`,e=>{e.target===t&&t.classList.remove(`active`)})});let a=document.getElementById(`provAliasInput`),o=document.getElementById(`provDomainSelect`),s=document.getElementById(`provForwardInput`),c=()=>{let e=(a?.value||`handle`).trim().toLowerCase().replace(/^@+/,``),t=o?.value||W||`domain.com`,n=(s?.value||`researcher@gmail.com`).trim(),r=document.getElementById(`provRelayPreview`),i=document.getElementById(`provDomainSuffix`);i&&(i.textContent=`@`+t),r&&(r.innerHTML=`<strong>`+V(e)+`@`+V(t)+`</strong> &rarr; <span style="color:#ea580c;">`+V(n)+`</span>`)};a&&a.addEventListener(`input`,c),o&&o.addEventListener(`change`,c),s&&s.addEventListener(`input`,c)}window.initAliasesTab=lt,window.refreshAliasesData=async function(){window.showToast(`Syncing ImprovMX domains & aliases...`,`info`),await window.renderAliasesTab(!0),window.showToast(`ImprovMX status refreshed!`,`success`)},window.testAliasDispatch=function(e,t){let n=t||`Researcher`,r=`Hello `+n+`,

This is a verification dispatch sent via your official institute email alias (`+e+`).

Best regards,
Curiomas Executive Council`;typeof window.openEmailComposer==`function`?window.openEmailComposer(e,n,`Institute Direct Dispatch Test`,r):window.showToast(`Alias email: `+e,`info`)};async function ut(e=!1){let t=document.getElementById(`improvmxAliasesTbody`),n=document.getElementById(`improvmxAliasesMobileGrid`);if(t||n){if(e||U.length===0){t&&(t.innerHTML=`<tr><td colspan="6" style="text-align:center; padding:2.5rem; color:var(--text-muted);"><span class="spinner" style="display:inline-block; width:16px; height:16px; border:2px solid #ea580c; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; margin-right:0.5rem; vertical-align:middle;"></span> Fetching verified domains from ImprovMX...</td></tr>`);let e=await window.CRII_API.getImprovMXAccount(G);if(e&&e.account){ct=e.account;let t=document.getElementById(`improvmxPlanTier`),n=document.getElementById(`improvmxAccountEmail`);t&&(t.textContent=e.account.premium?`ImprovMX Premium Tier`:`ImprovMX Free Tier`),n&&(n.textContent=`Account: `+(e.account.email||`harunabdullahrakin@gmail.com`))}let n=await window.CRII_API.getImprovMXDomains(G);if(n&&Array.isArray(n.domains)&&n.domains.length>0){U=n.domains;let e=document.getElementById(`improvmxDomainSelect`),t=document.getElementById(`provDomainSelect`);e&&(e.innerHTML=U.map(e=>`<option value="`+V(e.domain)+`"`+(e.domain===W?` selected`:``)+`>`+V(e.domain)+(e.active?` (Active)`:``)+`</option>`).join(``)),t&&(t.innerHTML=U.map(e=>`<option value="`+V(e.domain)+`"`+(e.domain===W?` selected`:``)+`>`+V(e.domain)+`</option>`).join(``)),W&&U.some(e=>e.domain===W)||(W=U[0].domain)}else{t&&(t.innerHTML=`<tr><td colspan="6" style="text-align:center; padding:3rem; color:var(--text-muted);">No domains found on connected ImprovMX key. Please verify your API key in "API Keys & Accounts".</td></tr>`);return}}W&&(await window.checkDomainHealth(W),await window.loadImprovmxAliases(W))}}window.renderAliasesTab=ut;async function dt(e){let t=document.getElementById(`improvmxMxStatus`),n=document.getElementById(`improvmxMxDetails`),r=document.getElementById(`improvmxSpfStatus`),i=document.getElementById(`improvmxSpfDetails`),a=await window.CRII_API.checkImprovMXDomain(e,G);if(a&&a.records){let e=a.records,o=e.mx&&e.mx.valid,s=e.spf&&e.spf.valid;t&&(t.innerHTML=o?`<span class="status-chip published">✓ MX Records Active</span>`:`<span class="status-chip draft" style="color:#ef4444; border-color:rgba(239,68,68,0.3); background:rgba(239,68,68,0.08);">⚠️ MX Setup Incomplete</span>`),n&&(n.textContent=o?`Relaying via mx1.improvmx.com & mx2.improvmx.com`:`Point DNS MX to mx1.improvmx.com (10) & mx2.improvmx.com (20)`),r&&(r.innerHTML=s?`<span class="status-chip published">✓ SPF Valid</span>`:`<span class="status-chip draft" style="color:#f59e0b; border-color:rgba(245,158,11,0.3); background:rgba(245,158,11,0.08);">⚠️ SPF Advisory</span>`),i&&(i.textContent=s?`Sender Policy Framework verified`:`Add TXT record: v=spf1 include:spf.improvmx.com ~all`)}}window.checkDomainHealth=dt;async function ft(e){let t=document.getElementById(`improvmxAliasesTbody`);if(!e)return;let n=await window.CRII_API.getImprovMXAliases(e,G);if(n&&Array.isArray(n.aliases)){st=n.aliases;let e=document.getElementById(`improvmxAliasCount`),t=document.getElementById(`improvmxAliasLimit`),r=ct?.limits?.aliases||25;e&&(e.textContent=n.aliases.length),t&&(t.textContent=`/ `+r+` Used`),pt(n.aliases)}else t&&(t.innerHTML=`<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">Failed to load aliases: `+V(n?.error||`Unknown error`)+`</td></tr>`)}window.loadImprovmxAliases=ft;function pt(e){let t=document.getElementById(`improvmxAliasesTbody`),n=document.getElementById(`improvmxAliasesMobileGrid`);if(!t&&!n)return;let r=(document.getElementById(`searchAliasesInput`)?.value||``).toLowerCase().trim(),i=e||[];r&&(i=i.filter(e=>(e.alias||``).toLowerCase().includes(r)||(e.forward||``).toLowerCase().includes(r)));let a=b&&b.activeInterns?b.activeInterns:[];if(i.length===0){let e=r?`No aliases match your search.`:`No email aliases provisioned for this domain yet. Click "+ Provision Email Alias" to create one.`;t&&(t.innerHTML=`<tr><td colspan="6" style="text-align:center; padding:3rem; color:var(--text-muted);">`+V(e)+`</td></tr>`),n&&(n.innerHTML=`<div style="text-align:center; padding:3rem; color:var(--text-muted);">`+V(e)+`</div>`)}else t&&(t.innerHTML=i.map(e=>{let t=(e.alias===`*`?`* (Catch-all)`:e.alias)+`@`+W,n=e.created?new Date(e.created).toLocaleDateString():`Active`,r=a.find(t=>(t.email||``).toLowerCase()===(e.forward||``).toLowerCase()),i=r?r.name:e.alias===`*`?`System Catch-All`:`Institute Researcher`,o=r?r.role:e.alias===`*`?`Domain Fallback`:`Active Member`;return`
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:0.6rem;">
              <span style="font-family:monospace; font-weight:700; color:var(--accent-primary, #ea580c); font-size:0.94rem;">
                ${V(t)}
              </span>
              <button type="button" class="btn btn-sm btn-icon" title="Copy email address" onclick="window.copyAliasToClipboard('${V(e.alias)}@${V(W)}')">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </button>
            </div>
          </td>
          <td>
            <div style="display:flex; align-items:center; gap:0.45rem;">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#10b981; flex-shrink:0;"><polyline points="9 18 15 12 9 6"/></svg>
              <span style="font-size:0.88rem; color:var(--text-primary); font-weight:500;">${V(e.forward)}</span>
            </div>
          </td>
          <td>
            <div style="font-size:0.86rem; font-weight:600; color:var(--text-primary);">${V(i)}</div>
            <div style="font-size:0.74rem; color:var(--text-muted);">${V(o)}</div>
          </td>
          <td>
            <span class="status-chip published">✓ Active Forwarding</span>
          </td>
          <td style="font-size:0.82rem; color:var(--text-muted);">
            ${n}
          </td>
          <td style="text-align:right;">
            <div style="display:inline-flex; gap:0.4rem;">
              <button type="button" class="btn btn-secondary btn-sm" title="Edit destination Gmail" onclick="window.openEditAliasModal('${e.id}', '${V(e.alias)}', '${V(e.forward)}', '${V(W)}')">
                Edit
              </button>
              <button type="button" class="btn btn-glass btn-sm" title="Send test email to alias" onclick="window.testAliasDispatch('${V(e.alias)}@${V(W)}', '${V(i)}')">
                Test ✉
              </button>
              <button type="button" class="btn btn-sm btn-icon" title="Revoke and delete alias" style="background:rgba(239, 68, 68, 0.1); color:#ef4444;" onclick="window.deleteImprovmxAlias('${e.id}', '${V(e.alias)}', '${V(W)}')">
                ✕
              </button>
            </div>
          </td>
        </tr>
      `}).join(``)),n&&(n.innerHTML=i.map(e=>{let t=(e.alias===`*`?`* (Catch-all)`:e.alias)+`@`+W,n=e.created?new Date(e.created).toLocaleDateString():`Active`,r=a.find(t=>(t.email||``).toLowerCase()===(e.forward||``).toLowerCase()),i=r?r.name:e.alias===`*`?`System Catch-All`:`Institute Researcher`;return`
        <div class="portal-alias-card">
          <div class="portal-alias-card-top">
            <div>
              <div class="portal-alias-handle">${V(t)}</div>
              <div style="font-size:0.76rem; color:var(--text-muted); margin-top:0.2rem;">Assigned: ${V(i)}</div>
            </div>
            <span class="status-chip published" style="font-size:0.7rem;">Active</span>
          </div>

          <div class="portal-alias-forward-row">
            <span style="color:var(--text-muted); font-size:0.78rem;">Relaying to:</span>
            <strong style="color:var(--text-primary); font-size:0.86rem; word-break:break-all;">${V(e.forward)}</strong>
          </div>

          <div style="font-size:0.74rem; color:var(--text-muted);">Provisioned on ${n}</div>

          <div class="portal-alias-actions">
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.openEditAliasModal('${e.id}', '${V(e.alias)}', '${V(e.forward)}', '${V(W)}')">
              Edit
            </button>
            <button type="button" class="btn btn-glass btn-sm" onclick="window.testAliasDispatch('${V(e.alias)}@${V(W)}', '${V(i)}')">
              Test Dispatch
            </button>
            <button type="button" class="btn btn-sm btn-icon" style="background:rgba(239, 68, 68, 0.1); color:#ef4444;" onclick="window.deleteImprovmxAlias('${e.id}', '${V(e.alias)}', '${V(W)}')">
              ✕
            </button>
          </div>
        </div>
      `}).join(``))}function mt(e){[`All`,`Fellows`,`Custom`].forEach(e=>{document.getElementById(`filterAliases`+e)?.classList.remove(`active`)});let t=b&&b.activeInterns?b.activeInterns:[],n=st;e===`all`?document.getElementById(`filterAliasesAll`)?.classList.add(`active`):e===`fellows`?(document.getElementById(`filterAliasesFellows`)?.classList.add(`active`),n=n.filter(e=>t.some(t=>(t.email||``).toLowerCase()===(e.forward||``).toLowerCase()))):e===`custom`&&(document.getElementById(`filterAliasesCustom`)?.classList.add(`active`),n=n.filter(e=>e.alias===`*`||!t.some(t=>(t.email||``).toLowerCase()===(e.forward||``).toLowerCase()))),pt(n)}window.filterAliasesList=mt;function ht(){let e=document.getElementById(`provisionAliasModal`);if(!e)return;let t=document.getElementById(`provFellowSelect`);t&&(t.innerHTML=`<option value="">-- Choose fellow to auto-fill Gmail --</option>`+(b&&b.activeInterns?b.activeInterns:[]).map(e=>`<option value="`+V(e.email||``)+`" data-name="`+V(e.name||``)+`">`+V(e.name||``)+` (`+V(e.email||``)+`)</option>`).join(``));let n=document.getElementById(`provDomainSelect`);n&&(n.innerHTML=(U&&U.length>0?U:W?[{domain:W}]:[]).map(e=>`<option value="`+V(e.domain)+`"`+(e.domain===W?` selected`:``)+`>`+V(e.domain)+`</option>`).join(``));let r=document.getElementById(`provAliasInput`),i=document.getElementById(`provForwardInput`);r&&(r.value=``),i&&(i.value=``);let a=document.getElementById(`provDomainSuffix`);a&&(a.textContent=`@`+(W||`domain.com`));let o=document.getElementById(`provRelayPreview`);o&&(o.innerHTML=`<strong>handle@`+V(W||`domain.com`)+`</strong> &rarr; <span style="color:#ea580c;">researcher@gmail.com</span>`),e.classList.add(`active`)}window.openProvisionAliasModal=ht;function gt(){let e=document.getElementById(`provisionAliasModal`);e&&e.classList.remove(`active`)}window.closeProvisionAliasModal=gt;function _t(e){if(!e)return;let t=document.getElementById(`provForwardInput`),n=document.getElementById(`provAliasInput`);t&&(t.value=e),n&&!n.value&&(n.value=e.split(`@`)[0].toLowerCase().replace(/[^a-z0-9.]+/g,``)),document.getElementById(`provAliasInput`)?.dispatchEvent(new Event(`input`))}window.handleFellowSelect=_t;async function vt(e){e.preventDefault();let t=document.getElementById(`provDomainSelect`)?.value,n=document.getElementById(`provAliasInput`)?.value.trim(),r=document.getElementById(`provForwardInput`)?.value.trim(),i=document.getElementById(`provSubmitBtn`);if(!t||!n||!r)window.showToast(`Please fill in all required fields`,`error`);else{i&&(i.disabled=!0,i.textContent=`Provisioning in ImprovMX...`);try{let e=await window.CRII_API.createImprovMXAlias({domain:t,alias:n,forward:r,keyId:G});e&&e.success?(window.showToast(`Email alias "`+n+`@`+t+`" created successfully!`,`success`),gt(),await window.loadImprovmxAliases(t)):window.showToast(`ImprovMX error: `+(e?.error||e?.errors?.alias?.[0]||`Failed to create alias`),`error`)}catch(e){window.showToast(`Failed to provision email: `+e.message,`error`)}finally{i&&(i.disabled=!1,i.textContent=`Provision Email Alias`)}}}window.handleProvisionAliasSubmit=vt;function yt(e,t,n,r){let i=document.getElementById(`editAliasModal`);if(!i)return;let a=document.getElementById(`editAliasId`),o=document.getElementById(`editAliasDomain`),s=document.getElementById(`editAliasDisplay`),c=document.getElementById(`editForwardInput`);a&&(a.value=e),o&&(o.value=r),s&&(s.value=t+`@`+r),c&&(c.value=n),i.classList.add(`active`)}window.openEditAliasModal=yt;function bt(){let e=document.getElementById(`editAliasModal`);e&&e.classList.remove(`active`)}window.closeEditAliasModal=bt;async function xt(e){e.preventDefault();let t=document.getElementById(`editAliasId`)?.value,n=document.getElementById(`editAliasDomain`)?.value,r=document.getElementById(`editForwardInput`)?.value.trim(),i=document.getElementById(`editSubmitBtn`);if(!t||!n||!r)window.showToast(`Destination email cannot be empty`,`error`);else{i&&(i.disabled=!0,i.textContent=`Updating...`);try{let e=await window.CRII_API.updateImprovMXAlias({domain:n,aliasId:t,forward:r,keyId:G});e&&e.success?(window.showToast(`Forwarding destination updated successfully!`,`success`),bt(),await window.loadImprovmxAliases(n)):window.showToast(`ImprovMX update error: `+(e?.error||`Failed to update`),`error`)}catch(e){window.showToast(`Update failed: `+e.message,`error`)}finally{i&&(i.disabled=!1,i.textContent=`Save Changes`)}}}window.handleEditAliasSubmit=xt;async function St(e,t,n){let r=t+`@`+n;if(window.confirm(`Permanently revoke and delete the email alias "`+r+`"?

Incoming messages to this address will no longer be relayed.`)){window.showToast(`Revoking alias in ImprovMX...`,`info`);try{let t=await window.CRII_API.deleteImprovMXAlias({domain:n,aliasId:e,keyId:G});t&&t.success?(window.showToast(`Email alias "`+r+`" deleted successfully!`,`info`),await window.loadImprovmxAliases(n)):window.showToast(`Failed to delete alias: `+(t?.error||`Unknown error`),`error`)}catch(e){window.showToast(`Error deleting alias: `+e.message,`error`)}}}window.deleteImprovmxAlias=St;async function Ct(){let e=document.getElementById(`manageImprovmxKeysModal`);e&&(e.classList.add(`active`),await Tt())}window.openManageKeysModal=Ct;function wt(){let e=document.getElementById(`manageImprovmxKeysModal`);e&&e.classList.remove(`active`)}window.closeManageKeysModal=wt;async function Tt(){let e=document.getElementById(`improvmxKeysList`);if(!e)return;let t=await window.CRII_API.getImprovMXKeys();t&&Array.isArray(t.keys)&&(t.keys,e.innerHTML=t.keys.map(e=>{let t=!G&&e.isDefault||G===e.id;return`
        <div style="display:flex; align-items:center; justify-content:space-between; padding:0.75rem 1rem; border:1px solid ${t?`var(--accent-primary, #ea580c)`:`var(--border-color)`}; border-radius:8px; background:var(--bg-surface);">
          <div>
            <div style="font-weight:600; font-size:0.88rem; color:var(--text-primary); display:flex; align-items:center; gap:0.4rem;">
              ${V(e.label)}
              ${t?`<span class="status-chip published" style="font-size:0.68rem; padding:1px 6px;">Active</span>`:``}
              ${e.isDefault?`<span class="badge" style="font-size:0.68rem; background:rgba(100,116,139,0.15);">Default</span>`:``}
            </div>
            <div style="font-family:monospace; font-size:0.76rem; color:var(--text-muted); margin-top:0.2rem;">${V(e.maskedKey)}</div>
          </div>
          <div style="display:flex; gap:0.4rem; align-items:center;">
            ${t?``:`<button type="button" class="btn btn-secondary btn-sm" onclick="window.switchActiveApiKey('${e.id}')">Use Key</button>`}
            ${e.isDefault?``:`<button type="button" class="btn btn-sm btn-icon" style="color:#ef4444;" onclick="window.handleDeleteApiKey('${e.id}')" title="Delete key">✕</button>`}
          </div>
        </div>
      `}).join(``))}window.renderImprovmxKeysList=Tt;async function Et(e){G=e,wt(),window.showToast(`Switched active ImprovMX API Key`,`info`),await ut(!0)}window.switchActiveApiKey=Et;async function Dt(){let e=document.getElementById(`newKeyLabelInput`),t=document.getElementById(`newKeySecretInput`),n=document.getElementById(`addNewKeyBtn`),r=(e?.value||``).trim(),i=(t?.value||``).trim();if(!i||!i.startsWith(`sk_`))window.showToast(`Please enter a valid ImprovMX API key (sk_...)`,`error`);else{n&&(n.disabled=!0,n.textContent=`Verifying key with ImprovMX...`);try{let n=await window.CRII_API.addImprovMXKey(r||`Secondary Account`,i);n&&n.success?(window.showToast(`ImprovMX API Key verified and saved successfully!`,`success`),e&&(e.value=``),t&&(t.value=``),await Tt()):window.showToast(`Failed to verify API key: `+(n?.error||`Invalid credentials`),`error`)}catch(e){window.showToast(`Error connecting key: `+e.message,`error`)}finally{n&&(n.disabled=!1,n.textContent=`Verify & Connect Key`)}}}window.handleAddNewApiKey=Dt;async function Ot(e){if(window.confirm(`Remove this secondary ImprovMX API key?`))try{let t=await window.CRII_API.deleteImprovMXKey(e);t&&t.success&&(window.showToast(`API key removed`,`info`),G===e&&(G=null),await Tt())}catch{window.showToast(`Failed to delete key`,`error`)}}window.handleDeleteApiKey=Ot;function K(e){navigator.clipboard?navigator.clipboard.writeText(e).then(()=>{window.showToast(`Copied "`+e+`" to clipboard!`,`success`)}).catch(()=>{window.showToast(`Alias: `+e,`info`)}):window.showToast(`Alias: `+e,`info`)}window.copyAliasToClipboard=K;var q=null,J=null,kt=null,At=!1;async function jt(){if(!At){At=!0;let e=document.getElementById(`sqlQueryInput`);e&&e.addEventListener(`keydown`,e=>{(e.ctrlKey||e.metaKey)&&e.key===`Enter`&&(e.preventDefault(),Ft())})}await Mt()}window.renderSqlStudioTab=jt;async function Mt(){let e=document.getElementById(`sqlTableListContainer`),t=document.getElementById(`sqlTableCountBadge`),n=document.getElementById(`sqlRefreshSchemaBtn`);n&&(n.disabled=!0,n.innerHTML=`
      <svg class="portal-spinner" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
      <span>Loading Schema...</span>
    `);try{let n=await window.CRII_API.getDbSchema();if(!n||!n.success){e&&(e.innerHTML=`<div style="padding: 1rem; color: #ef4444; font-size: 0.82rem;">${n?.error||`Failed to load database schema.`}</div>`);return}q=n,window._criiDbSchema=n,t&&(t.textContent=`${n.tables?.length||0} Tables`),Nt(),!J&&n.tables&&n.tables.length>0&&Pt(n.tables[0].name)}catch(t){e&&(e.innerHTML=`<div style="padding: 1rem; color: #ef4444; font-size: 0.82rem;">Error: ${t.message}</div>`)}finally{n&&(n.disabled=!1,n.innerHTML=`
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        <span>Refresh Schema</span>
      `)}}window.loadSqlSchema=Mt;function Nt(){let e=document.getElementById(`sqlTableListContainer`);if(!e||!q)return;let t=q.tables||[];if(t.length===0){e.innerHTML=`<div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.82rem;">No user tables found in database.</div>`;return}let n=``;t.forEach(e=>{let t=J===e.name,r=e.columns?.length||0,i=e.rowCount===void 0?0:e.rowCount;n+=`
      <button type="button" class="sql-table-item ${t?`active`:``}" onclick="window.selectSqlTable('${e.name}')" title="${r} columns, ${i} rows">
        <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="${t?`#ea580c`:`currentColor`}" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>
          <span class="sql-table-name" style="color: ${t?`#ea580c`:`inherit`};">${e.name}</span>
        </div>
        <span class="sql-table-badge">${i} rows</span>
      </button>
    `}),e.innerHTML=n}window.renderSqlTablesList=Nt;function Pt(e){J=e,Nt();let t=document.getElementById(`sqlSelectedTableInfo`),n=document.getElementById(`sqlSelectedTableName`),r=document.getElementById(`sqlSelectedTableRowCount`),i=q?.tables?.find(t=>t.name===e);i&&t&&(t.style.display=`block`,n&&(n.textContent=i.name),r&&(r.textContent=`${i.rowCount||0} rows, ${i.columns?.length||0} cols`))}window.selectSqlTable=Pt;async function Ft(){let e=(document.getElementById(`sqlQueryInput`)?.value||``).trim(),t=document.getElementById(`sqlExecuteBtn`),n=document.getElementById(`sqlExecutionStatus`),r=document.getElementById(`sqlErrorContainer`),i=document.getElementById(`sqlErrorMessage`),a=document.getElementById(`sqlResultsCard`),o=document.getElementById(`sqlResultsSummary`),s=document.getElementById(`sqlResultsTableContainer`);if(!e)window.showToast(`Please enter a SQL query to execute.`,`warning`);else{r&&(r.style.display=`none`),t&&(t.disabled=!0,t.innerHTML=`
      <svg class="portal-spinner" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
      <span>Executing...</span>
    `),n&&(n.className=`sql-status-badge`,n.innerHTML=`
      <span style="width: 8px; height: 8px; border-radius: 50%; background: #ea580c; animation: pulse 1s infinite;"></span>
      <span>Executing query on D1...</span>
    `);try{let t=await window.CRII_API.executeSql(e);if(!t||!t.success){r&&i&&(r.style.display=`block`,i.textContent=t?.error||`SQL Query failed to execute.`),n&&(n.className=`sql-status-badge error`,n.innerHTML=`
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #ef4444;"></span>
          <span>Failed in ${t?.duration||0}ms</span>
        `),a&&(a.style.display=`none`);return}if(kt=t,window._criiLastSqlResults=t,n&&(n.className=`sql-status-badge success`,n.innerHTML=`
        <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></span>
        <span>Success (${t.statementCount>1?`${t.statementCount} statements executed`:`1 statement executed`}${t.changes?`, ${t.changes} rows affected`:``} in ${t.duration||0}ms)</span>
      `),t.changes&&t.changes>0&&Mt(),a&&s){a.style.display=`block`;let e=t.rows||[],n=t.columns||(e.length>0?Object.keys(e[0]):[]);if(o&&(o.textContent=e.length>0?`${e.length} rows returned in ${t.duration||0}ms`:t.changes?`${t.changes} rows affected in ${t.duration||0}ms`:`Executed in ${t.duration||0}ms`),e.length===0)s.innerHTML=`
          <div style="padding: 2.5rem 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#10b981" stroke-width="2" style="margin-bottom: 0.5rem;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">Command Executed Successfully</div>
            <div>${t.changes?t.changes+` row(s) affected.`:`No rows returned.`} Execution time: ${t.duration||0}ms</div>
          </div>
        `;else{let t=`<table class="sql-table"><thead><tr>`;n.forEach(e=>{t+=`<th>${V(e)}</th>`}),t+=`</tr></thead><tbody>`,e.forEach(e=>{t+=`<tr>`,n.forEach(n=>{let r=e[n];r=r==null?`<span style="color: #94a3b8; font-style: italic;">null</span>`:typeof r==`object`?`<span title="${V(JSON.stringify(r))}">${V(JSON.stringify(r))}</span>`:V(String(r)),t+=`<td>${r}</td>`}),t+=`</tr>`}),t+=`</tbody></table>`,s.innerHTML=t}}window.showToast(`SQL executed successfully!`,`success`)}catch(e){r&&i&&(r.style.display=`block`,i.textContent=e.message||`Execution error`)}finally{t&&(t.disabled=!1,t.innerHTML=`
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <span>Execute SQL</span>
      `)}}}window.runSqlQuery=Ft;function It(e){let t=document.getElementById(`sqlQueryInput`);if(!t)return;let n=J||`posts`;switch(e){case`selectPosts`:t.value=`SELECT id, slug, title, category, date, published FROM posts ORDER BY date DESC LIMIT 20;`;break;case`selectInterns`:t.value=`SELECT id, name, role, division, status, degree FROM interns ORDER BY orderIndex ASC LIMIT 25;`;break;case`tableCounts`:t.value=`SELECT 'posts' as table_name, count(*) as total_rows FROM posts
UNION ALL SELECT 'interns', count(*) FROM interns
UNION ALL SELECT 'applications', count(*) FROM applications
UNION ALL SELECT 'allowed_users', count(*) FROM allowed_users
UNION ALL SELECT 'settings', count(*) FROM settings;`;break;case`templateInsertPost`:t.value=`-- Bulk Insert Publication Template
INSERT INTO posts (id, slug, title, coverImage, category, authors_json, date, readingTime, summary, content, tags_json, published, featured)
VALUES (
  'pub-' || lower(hex(randomblob(4))),
  'spectral-biosignatures-discovery-' || lower(hex(randomblob(2))),
  'Deep Learning in Astrobiological Spectra and Biosignatures',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  'Astrophysics',
  '["Harun Abdullah", "CRII Fellow"]',
  date('now'),
  '7 min read',
  'Investigation of spectral biosignatures across exoplanetary atmospheres using deep reinforcement learning models.',
  '<p>Comprehensive computational models deployed across high-resolution spectral libraries...</p>',
  '["Astrophysics", "Deep Learning", "CRII"]',
  1,
  0
);`;break;case`templateInsertIntern`:t.value=`-- Bulk Insert Fellow Template
INSERT INTO interns (id, name, email, avatar, university, degree, division, role, cohort, status, isTeamMember, orderIndex, createdAt)
VALUES (
  'fellow-' || lower(hex(randomblob(4))),
  'Dr. Sarah Lin',
  'sarah.lin@example.com',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'MIT',
  'Ph.D. Computational Biophysics',
  'Biophysics & Bioengineering',
  'Senior Research Fellow',
  'Cohort Alpha',
  'Active',
  0,
  10,
  datetime('now')
);`;break;case`selectFromSelected`:t.value=`SELECT * FROM "${n}" LIMIT 25;`;break;case`countSelected`:t.value=`SELECT COUNT(*) AS total_rows FROM "${n}";`}t.focus()}window.insertSqlPreset=It;function Lt(e){if(!q||!q.aiPromptTemplates){window.showToast(`Please wait for database schema to load.`,`warning`);return}let t=q.aiPromptTemplates[e]||q.aiPromptTemplates.fullSchemaPrompt;t&&(navigator.clipboard?navigator.clipboard.writeText(t).then(()=>{window.showToast(`AI Bulk Data Prompt copied! Paste into ChatGPT or Claude with your raw data.`,`success`)}).catch(()=>{window.prompt(`Copy AI Bulk Data Prompt:`,t)}):window.prompt(`Copy AI Bulk Data Prompt:`,t))}window.copyAiPrompt=Lt;function Rt(){let e=q?.tables?.find(e=>e.name===J);!e||!e.sql?window.showToast(`No DDL available for selected table`,`info`):navigator.clipboard&&navigator.clipboard.writeText(e.sql+`;`).then(()=>{window.showToast(`DDL for "${e.name}" copied to clipboard!`,`success`)})}window.copySelectedTableDdl=Rt;function Y(){let e=document.getElementById(`sqlQueryInput`);if(!e||!e.value)return;let t=e.value.trim();[`SELECT`,`FROM`,`WHERE`,`INSERT INTO`,`VALUES`,`UPDATE`,`SET`,`DELETE FROM`,`ORDER BY`,`GROUP BY`,`LIMIT`,`JOIN`,`LEFT JOIN`,`INNER JOIN`,`AND`,`OR`,`UNION ALL`,`UNION`,`CREATE TABLE`,`DROP TABLE`,`ALTER TABLE`].forEach(e=>{let n=RegExp(`\\b`+e.replace(` `,`\\s+`)+`\\b`,`gi`);t=t.replace(n,e)}),e.value=t,window.showToast(`SQL keywords formatted`,`info`)}window.formatSqlQuery=Y;function X(){let e=document.getElementById(`sqlQueryInput`);e&&(e.value=``)}window.clearSqlEditor=X;function zt(){if(!kt||!kt.rows||kt.rows.length===0){window.showToast(`No results to export`,`warning`);return}let e=kt.rows,t=kt.columns||Object.keys(e[0]),n=t.map(e=>`"${e.replace(/"/g,`""`)}"`).join(`,`)+`
`;e.forEach(e=>{let r=t.map(t=>{let n=e[t];return n==null?`""`:(typeof n==`object`&&(n=JSON.stringify(n)),`"${String(n).replace(/"/g,`""`)}"`)}).join(`,`);n+=r+`
`});let r=new Blob([n],{type:`text/csv;charset=utf-8;`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=`d1-query-export-${Date.now()}.csv`,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(i),window.showToast(`CSV downloaded successfully`,`success`)}window.exportSqlResultsToCsv=zt;function Bt(){if(!kt||!kt.rows){window.showToast(`No results to copy`,`warning`);return}let e=JSON.stringify(kt.rows,null,2);navigator.clipboard&&navigator.clipboard.writeText(e).then(()=>{window.showToast(`Results JSON copied to clipboard!`,`success`)})}window.copySqlResultsJson=Bt;var Vt=[],Ht=[],Ut=`all`,Z=``,Wt=`papers`;async function Gt(){await Kt(),Jt(),qt(),Qt()}window.initResearchCatalog=Gt,document.addEventListener(`DOMContentLoaded`,async()=>{await Gt()});async function Kt(){Vt=await window.CRII_API.getPosts(),Ht=await window.CRII_API.getDatasets(),Yt()}function qt(){let e=document.querySelectorAll(`.catalog-tab`);e.forEach(t=>{t.addEventListener(`click`,()=>{e.forEach(e=>{e.classList.remove(`active`,`btn-primary`),e.classList.add(`btn-secondary`)}),t.classList.add(`active`,`btn-primary`),t.classList.remove(`btn-secondary`),Wt=t.dataset.tab,Yt()})})}function Jt(){let e=document.querySelectorAll(`.category-pill`);e.forEach(t=>{t.addEventListener(`click`,()=>{e.forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),Ut=t.dataset.category,Yt()})});let t=document.getElementById(`researchSearch`);t&&t.addEventListener(`input`,e=>{Z=e.target.value.toLowerCase().trim(),Yt()})}function Yt(){let e=document.getElementById(`papersContainer`),t=document.getElementById(`datasetsContainer`);Wt===`papers`?(e.style.display=`grid`,t.style.display=`none`,Xt()):(e.style.display=`none`,t.style.display=`grid`,Zt())}function Xt(){let e=document.getElementById(`papersContainer`);if(!e)return;let t=Vt.filter(e=>{let t=Ut===`all`||e.category.toLowerCase().includes(Ut.toLowerCase()),n=!Z||e.title.toLowerCase().includes(Z)||e.summary&&e.summary.toLowerCase().includes(Z)||e.authors&&e.authors.some(e=>e.toLowerCase().includes(Z))||e.tags&&e.tags.some(e=>e.toLowerCase().includes(Z));return t&&n});e.innerHTML=t.length===0?`
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-surface); border-radius: 16px; border: 1px dashed var(--border-color);">
        <p style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 0.5rem;">No publications match your criteria.</p>
        <p style="font-size: 0.9rem; color: var(--text-muted);">Try selecting a different division or clearing your search query.</p>
      </div>
    `:t.map(e=>{let t=`badge-blue`;e.category.includes(`Ancient`)&&(t=`badge-amber`),e.category.includes(`AI`)&&(t=`badge-indigo`),e.category.includes(`Astrobiology`)&&(t=`badge-emerald`);let n=e.coverImage?`
      <div class="card-cover">
        <img src="${e.coverImage}" alt="${e.title}" class="card-cover-img" loading="lazy">
      </div>
    `:``,r=!!(e.isEdited||e.updatedBy&&e.updatedAt),i=e.updatedBy||e.authors&&e.authors[0]||`CRII Researcher`,a=e.createdBy||e.authors&&e.authors[0]||`CRII Researcher`,o=r?new Date(e.updatedAt||e.date).toLocaleDateString(void 0,{year:`numeric`,month:`short`,day:`numeric`}):new Date(e.createdAt||e.date).toLocaleDateString(void 0,{year:`numeric`,month:`short`,day:`numeric`}),s=r?`<div class="article-meta-attribution" style="margin-bottom:0.75rem;"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg><span>Last edited by <strong>${i}</strong> on ${o}</span></div>`:`<div class="article-meta-attribution" style="margin-bottom:0.75rem;"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>Created by <strong>${a}</strong> on ${o}</span></div>`;return`
      <article class="card" style="padding:0; overflow:hidden;">
        ${n}
        <div style="padding:1.5rem; display:flex; flex-direction:column; flex:1;">
          <div class="card-top" style="margin-bottom:0.75rem;">
            <span class="badge ${t}">${e.category}</span>
            <span class="card-date">${e.date}</span>
          </div>
          <h3 class="card-title">
            <a href="/article?id=${e.id}">${e.title}</a>
          </h3>
          <div class="card-authors" style="margin-bottom:0.5rem;">
            ${e.authors?e.authors.join(` • `):`CRII Fellows`}
          </div>
          ${s}
          <p class="card-desc" style="flex:1;">${e.summary||(e.abstract?e.abstract.slice(0,150)+`...`:``)}</p>
          <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-bottom:1.25rem;">
            ${(e.tags||[]).map(e=>`<span class="tag-item">#${e}</span>`).join(``)}
          </div>
          <div class="card-footer" style="margin-top:auto; padding-top:1rem; border-top:1px solid var(--border-color);">
            <span style="font-size: 0.76rem; font-family: monospace; color: var(--text-muted);">${e.doi||`Open Research`}</span>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-secondary btn-sm" onclick="openCiteModal('${e.id}')">Cite</button>
              <a href="/article?id=${e.id}" class="btn btn-primary btn-sm">Read Article</a>
            </div>
          </div>
        </div>
      </article>
    `}).join(``)}function Zt(){let e=document.getElementById(`datasetsContainer`);if(!e)return;let t=Ht.filter(e=>{let t=Ut===`all`||e.category.toLowerCase().includes(Ut.toLowerCase()),n=!Z||e.title.toLowerCase().includes(Z)||e.description&&e.description.toLowerCase().includes(Z)||e.parameters&&e.parameters.some(e=>e.toLowerCase().includes(Z));return t&&n});e.innerHTML=t.length===0?`
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-surface); border-radius: 16px; border: 1px dashed var(--border-color);">
        <p style="font-size: 1.1rem; color: var(--text-primary);">No datasets found for this selection.</p>
      </div>
    `:t.map(e=>`
      <div class="card">
        <div class="card-top">
          <span class="badge badge-indigo">${e.category}</span>
          <span style="font-size:0.78rem; font-family:monospace; color:var(--text-muted);">${e.version}</span>
        </div>
        <h3 class="card-title">${e.title}</h3>
        <p class="card-desc">${e.description}</p>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; background: var(--bg-primary); padding: 0.75rem; border-radius: 10px; margin-bottom: 1.25rem; font-size: 0.8rem;">
          <div>
            <div style="color:var(--text-muted); font-size:0.7rem; text-transform:uppercase;">Format</div>
            <div style="font-weight:600; color:var(--text-primary); font-family:monospace;">${e.format}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); font-size:0.7rem; text-transform:uppercase;">Size</div>
            <div style="font-weight:600; color:var(--text-primary); font-family:monospace;">${e.size}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); font-size:0.7rem; text-transform:uppercase;">License</div>
            <div style="font-weight:600; color:var(--text-primary); font-size:0.72rem;">${e.license}</div>
          </div>
        </div>

        <div class="card-footer">
          <span style="font-size:0.8rem; color:var(--accent-primary);">Lead: ${e.leadResearcher}</span>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary btn-sm" onclick="openDatasetPreview('${e.id}')">Inspect</button>
            <button class="btn btn-primary btn-sm" onclick="downloadDataset('${e.id}')">Download</button>
          </div>
        </div>
      </div>
    `).join(``)}function Qt(){document.querySelectorAll(`.modal-close, .modal-cancel`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.modal-overlay`).forEach(e=>e.classList.remove(`active`))})})}window.openCiteModal=function(e){let t=Vt.find(t=>t.id===e);if(!t)return;let n=document.getElementById(`citeModal`),r=document.getElementById(`citeModalBody`),i=document.getElementById(`citeModalTitle`);i.innerText=`Cite: ${t.title.slice(0,45)}...`;let a=(t.authors||[]).join(`, `),o=t.date?t.date.split(`-`)[0]:`2026`,s=`${a} (${o}). ${t.title}. Curiomas Research & Innovation Institute. DOI: ${t.doi||`10.5281/crii.2026`}`,c=`@article{crii_${t.slug||t.id},\n  title={${t.title}},\n  author={${a}},\n  journal={Curiomas Research & Innovation Institute Preprints},\n  year={${o}},\n  doi={${t.doi||`10.5281/crii.2026`}}\n}`;r.innerHTML=`
    <div style="margin-bottom:1.5rem;">
      <h4 style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.4rem; font-weight:700;">APA Citation Format</h4>
      <div style="background:var(--bg-primary); padding:0.9rem; border-radius:8px; border:1px solid var(--border-color); font-size:0.88rem; line-height:1.5; color:var(--text-primary);">
        ${s}
      </div>
      <button class="btn btn-secondary btn-sm" style="margin-top:0.5rem;" onclick="copyToClipboard(\`${s.replace(/"/g,`&quot;`)}\`, 'APA citation copied!')">Copy APA</button>
    </div>

    <div>
      <h4 style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.4rem; font-weight:700;">BibTeX</h4>
      <pre style="background:var(--bg-primary); padding:0.9rem; border-radius:8px; border:1px solid var(--border-color); font-size:0.8rem; font-family:monospace; color:var(--accent-primary); overflow-x:auto;">${c}</pre>
      <button class="btn btn-secondary btn-sm" style="margin-top:0.5rem;" onclick="copyToClipboard(\`${c.replace(/"/g,`&quot;`)}\`, 'BibTeX copied!')">Copy BibTeX</button>
    </div>
  `,n.classList.add(`active`)},window.openDatasetPreview=function(e){let t=Ht.find(t=>t.id===e);if(!t)return;let n=document.getElementById(`datasetModal`),r=document.getElementById(`datasetModalBody`),i=document.getElementById(`datasetModalTitle`);i.innerText=`Inspect Dataset: ${t.title.slice(0,45)}...`;let a=``;if(t.previewRows&&t.previewRows.length>0){let e=Object.keys(t.previewRows[0]);a=`
      <div style="overflow-x:auto; margin:1rem 0; border:1px solid var(--border-color); border-radius:10px;">
        <table class="admin-table" style="font-size:0.8rem;">
          <thead>
            <tr>${e.map(e=>`<th>${e}</th>`).join(``)}</tr>
          </thead>
          <tbody>
            ${t.previewRows.map(t=>`
              <tr>${e.map(e=>`<td>${t[e]}</td>`).join(``)}</tr>
            `).join(``)}
          </tbody>
        </table>
      </div>
    `}else a=`<p style="padding:1rem; color:var(--text-muted);">Tabular preview specification is packaged inside download bundle.</p>`;r.innerHTML=`
    <p style="color:var(--text-secondary); font-size:0.92rem; margin-bottom:0.75rem;">${t.description}</p>
    <div style="font-size:0.82rem; color:var(--accent-primary); font-family:monospace; margin-bottom:1rem;">License: ${t.license} | Version: ${t.version}</div>
    <h4 style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Sample Feature Rows</h4>
    ${a}
    <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.5rem;">File size: ${t.size} (${t.format})</p>
  `,n.classList.add(`active`)},window.downloadDataset=function(e){let t=Ht.find(t=>t.id===e);if(!t)return;let n=`data:text/json;charset=utf-8,`+encodeURIComponent(JSON.stringify(t,null,2)),r=document.createElement(`a`);r.setAttribute(`href`,n),r.setAttribute(`download`,`${t.id}_data_spec.json`),document.body.appendChild(r),r.click(),r.remove(),window.showToast(`Downloading dataset specification: ${t.title.slice(0,30)}...`,`success`)};function Q(e){return e==null?``:String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}window.initInternsRoster=$t,window.initApplicationForm=tn,document.addEventListener(`DOMContentLoaded`,async()=>{await $t(),await tn()});async function $t(){let e=await window.CRII_API.getInternsData(),t=[`team-002`,`team-003`,`int-001`,`int-002`,`crii-int-002`,`crii-int-003`,`crii-int-004`],n=(e.activeInterns||[]).filter(e=>!t.includes(e.id));n.sort((e,t)=>{let n=e.orderIndex===void 0?999:Number(e.orderIndex),r=t.orderIndex===void 0?999:Number(t.orderIndex);return n===r?(e.name||``).localeCompare(t.name||``):n-r});let r=document.getElementById(`coreTeamContainer`),i=document.getElementById(`fellowsContainer`),a=n.filter(e=>e.isTeamMember),o=n.filter(e=>!e.isTeamMember);r&&(r.innerHTML=a.length===0?`<div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted);">Core team roster is currently updating.</div>`:a.map(en).join(``)),i&&(i.innerHTML=o.length===0?`<div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted);">No fellows currently in this cohort.</div>`:o.map(en).join(``))}function en(e){let t=e.avatar||`https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80`,n=!!e.isTeamMember,r=``;if(e.socials){let t=e.socials;t.github&&(r+=`
        <a href="${t.github}" target="_blank" rel="noopener" class="btn btn-sm btn-icon" title="GitHub" style="background:rgba(0,0,0,0.05); border-radius:50%;">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
          </svg>
        </a>
      `),t.linkedin&&(r+=`
        <a href="${t.linkedin}" target="_blank" rel="noopener" class="btn btn-sm btn-icon" title="LinkedIn" style="background:rgba(0,0,0,0.05); border-radius:50%;">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
          </svg>
        </a>
      `),t.email&&(r+=`
        <a href="mailto:${t.email}" class="btn btn-sm btn-icon" title="Email" style="background:rgba(0,0,0,0.05); border-radius:50%;">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </a>
      `)}return`
    <div class="card" style="padding: 1.25rem; border-radius: 16px; border: 1px solid #e5dfd5; display: flex; flex-direction: column;">
      <!-- Almost Full Div Photo -->
      <div style="width: 100%; aspect-ratio: 16 / 12; border-radius: 12px; overflow: hidden; background: #000000; margin-bottom: 1.25rem;">
        <img src="${t}" alt="${e.name}" style="width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease;" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'">
      </div>

      <!-- Member Details Below Photo -->
      <div style="margin-bottom: 0.65rem;">
        <h3 style="font-size: 1.35rem; font-weight: 700; color: #16281e; line-height: 1.25; margin-bottom: 0.25rem;">${e.name}</h3>
        <div style="font-size: 0.92rem; color: #0284c7; font-weight: 600;">${e.role}</div>
        <div style="font-size: 0.82rem; color: #78716c;">${e.university||`Curiomas CRII`}</div>
      </div>

      <div style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap;">
        <span class="badge badge-indigo" style="font-size: 0.74rem;">${e.division}</span>
        ${n?`<span class="badge badge-blue" style="font-size: 0.74rem;">★ Principal Leadership</span>`:`<span class="badge badge-blue" style="font-size: 0.74rem;">Active Fellow</span>`}
      </div>

      <p class="card-desc" style="font-size: 0.92rem; line-height: 1.6; color: #4b5852; margin-bottom: 1.25rem; flex-grow: 1;">
        ${e.bio||`Contributing to open student-led research.`}
      </p>

      ${e.projects&&e.projects.length>0?`
        <div style="margin-bottom: 1.25rem;">
          <span style="font-size: 0.7rem; text-transform: uppercase; color: #78716c; font-weight: 700; display: block; margin-bottom: 0.35rem; letter-spacing: 0.05em;">Research Focus</span>
          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
            ${e.projects.map(e=>`<span class="tag-item">${e}</span>`).join(``)}
          </div>
        </div>
      `:``}

      <div class="card-footer" style="padding-top: 0.85rem; border-top: 1px solid #e5dfd5; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.78rem; color: #78716c;">Cohort: ${e.cohort||`Founding`}</span>
        <div style="display: flex; gap: 0.35rem;">
          ${r}
        </div>
      </div>
    </div>
  `}async function tn(){let e=document.getElementById(`internApplicationForm`);if(!e)return;if(window.CRII_API&&window.CRII_API.syncSettingsFromDb)try{await window.CRII_API.syncSettingsFromDb()}catch{}let t=document.getElementById(`appDivision`);if(t&&window.CRII_API)try{let e=await window.CRII_API.getDivisions()||[];t.innerHTML=Array.isArray(e)&&e.length>0?`<option value="">Select Research Division Track...</option>`+e.map(e=>`<option value="${Q(e.title)}">${Q(e.title)}</option>`).join(``):`
          <option value="">Select Research Division Track...</option>
          <option value="Space & Astrophysics">Space & Astrophysics</option>
          <option value="Ancient Biology & Paleogenomics">Ancient Biology & Paleogenomics</option>
          <option value="AI & Computational Science">AI & Computational Science</option>
          <option value="Astrobiology & Extremophiles">Astrobiology & Extremophiles</option>
          <option value="Interdisciplinary Open Science">Interdisciplinary Open Science</option>
        `}catch(e){console.warn(`Error fetching divisions for form:`,e)}let n=document.getElementById(`appLevel`);if(n&&window.CRII_API)try{let e=await window.CRII_API.getCohorts()||[];n.innerHTML=Array.isArray(e)&&e.length>0?`<option value="">Select Academic Level / Cohort Profile...</option>`+e.map(e=>{let t=e.grade||e.academicLevel?` (${e.grade||e.academicLevel})`:``;return`<option value="${Q(e.title+t)}">${Q(e.title+t)}</option>`}).join(``):`
          <option value="">Select Academic Level / Cohort Profile...</option>
          <option value="Undergraduate Researchers (1st - 4th Year)">Undergraduate Researchers (1st - 4th Year)</option>
          <option value="Postgraduate & Masters Scholars">Postgraduate & Masters Scholars</option>
          <option value="High School Scholars (Grade 10-12)">High School Scholars (Grade 10-12)</option>
          <option value="PhD Candidates & Postdoctoral Fellows">PhD Candidates & Postdoctoral Fellows</option>
          <option value="Self-Directed & Independent Researchers">Self-Directed & Independent Researchers</option>
        `}catch(e){console.warn(`Error fetching cohorts for form:`,e)}if(window.CRII_API&&window.CRII_API.getApplicationFormConfig){let e=window.CRII_API.getApplicationFormConfig();if(e&&e.fields){let t=e.fields,n=(e,n)=>{let r=document.getElementById(e);if(!r)return;let i=r.closest(`.form-group`),a=t[n];a&&(i&&a.visible===!1?(i.style.display=`none`,r.required=!1):(i&&(i.style.display=``),r.required=a.required===!0))};n(`appUniversity`,`university`),n(`appFieldOfStudy`,`fieldOfStudy`),n(`appDivision`,`division`),n(`appLevel`,`academicLevel`),n(`appPortfolio`,`portfolio`),n(`appStatement`,`statement`)}let t=document.getElementById(`appCustomFieldsContainer`);t&&(t.innerHTML=Array.isArray(e.customFields)&&e.customFields.length>0?e.customFields.map((e,t)=>{let n=`appCustom_${t}`,r=``;if(e.type===`textarea`)r=`<textarea id="${n}" class="form-input" rows="3" data-custom-key="${Q(e.label)}" ${e.required?`required`:``} placeholder="${Q(e.placeholder||``)}"></textarea>`;else if(e.type===`select`){let t=Array.isArray(e.options)?e.options:[];r=`
              <select id="${n}" class="form-select" data-custom-key="${Q(e.label)}" ${e.required?`required`:``}>
                <option value="">Select option...</option>
                ${t.map(e=>`<option value="${Q(e)}">${Q(e)}</option>`).join(``)}
              </select>
            `}else r=e.type===`number`?`<input type="number" id="${n}" class="form-input" data-custom-key="${Q(e.label)}" ${e.required?`required`:``} placeholder="${Q(e.placeholder||``)}">`:`<input type="text" id="${n}" class="form-input" data-custom-key="${Q(e.label)}" ${e.required?`required`:``} placeholder="${Q(e.placeholder||``)}">`;return`
            <div class="form-group" style="margin-bottom:1.25rem;">
              <label class="form-label" for="${n}" style="font-weight:600;">
                ${Q(e.label)} ${e.required?`*`:``}
              </label>
              ${r}
            </div>
          `}).join(``):``)}e.addEventListener(`submit`,async t=>{t.preventDefault();let n=e.querySelector(`button[type="submit"]`);n&&(n.disabled=!0,n.innerHTML=`Submitting Application...`);let r={};document.querySelectorAll(`#appCustomFieldsContainer [data-custom-key]`).forEach(e=>{let t=e.getAttribute(`data-custom-key`);t&&(r[t]=(e.value||``).trim())});let i={fullName:document.getElementById(`appFullName`)?.value.trim()||`Fellow Applicant`,email:document.getElementById(`appEmail`)?.value.trim()||``,university:document.getElementById(`appUniversity`)?.value.trim()||``,fieldOfStudy:document.getElementById(`appFieldOfStudy`)?.value.trim()||``,preferredDivision:document.getElementById(`appDivision`)?.value||`General Science`,academicLevel:document.getElementById(`appLevel`)?.value||``,portfolioUrl:document.getElementById(`appPortfolio`)?.value.trim()||``,statement:document.getElementById(`appStatement`)?.value.trim()||``,customFields:r};try{let e=await window.CRII_API.submitInternApplication(i),t=document.getElementById(`applicationFormCard`);if(t&&(t.innerHTML=`
          <div style="text-align:center; padding:3rem 1.5rem;">
            <div style="width:56px; height:56px; border-radius:50%; background:rgba(16, 185, 129, 0.1); border:1px solid #10b981; color:#059669; display:grid; place-items:center; margin:0 auto 1.5rem;">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </div>
            <h2 style="font-size:1.8rem; margin-bottom:0.75rem; color:var(--text-primary);">Application Received</h2>
            <p style="color:var(--text-secondary); max-width:540px; margin:0 auto 1.5rem; line-height:1.6;">
              Thank you, <strong>${Q(e.fullName)}</strong>. Your research application for the 
              <span style="color:var(--accent-primary); font-weight:600;">${Q(e.preferredDivision)}</span> track has been submitted to the admissions review board.
            </p>
            <div style="background:var(--bg-primary); padding:0.85rem 1.25rem; border-radius:10px; border:1px solid var(--border-color); display:inline-block; font-family:monospace; font-size:0.88rem; color:var(--accent-primary); margin-bottom:2rem;">
              Application Reference: ${e.id}
            </div>
            <div>
              <a href="/research" class="btn btn-secondary">Explore Research Papers</a>
            </div>
          </div>
        `),window.emailjs)try{let t=window.CRII_API&&typeof window.CRII_API.getEmailjsTemplateId==`function`?window.CRII_API.getEmailjsTemplateId():localStorage.getItem(`crii_emailjs_template_id`)||``;t&&(emailjs.init({publicKey:`h3x_9dtR8frBq2pCi`}),await emailjs.send(`curiomas`,t,{to_email:`curiomas.members@gmail.com`,to_name:`CRII Admissions Board`,applicant_name:e.fullName,applicant_email:e.email,applicant_university:e.university,applicant_division:e.preferredDivision,applicant_level:e.academicLevel,message:`New fellowship application received from ${e.fullName} (${e.email}) from ${e.university} for track: ${e.preferredDivision} (${e.academicLevel}).\n\nPortfolio: ${e.portfolioUrl||`None`}\n\nStatement:\n${e.statement}`},`h3x_9dtR8frBq2pCi`))}catch(e){console.warn(`EmailJS application alert notification note:`,e)}}catch(e){console.error(`Error submitting application:`,e),n&&(n.disabled=!1,n.innerHTML=`Submit Research Application`),alert(`There was an issue submitting your application. Please check your connection and try again.`)}})}var nn=[],rn=`all`;async function an(){await on(),initTagFilter()}window.initBlogFeed=an,document.addEventListener(`DOMContentLoaded`,async()=>{await an()});async function on(){nn=(await window.CRII_API.getPosts()).filter(e=>e.published!==!1),sn(),cn()}function sn(){let e=document.getElementById(`blogContainer`);if(!e)return;let t=nn.filter(e=>rn===`all`||e.tags&&e.tags.some(e=>e.toLowerCase()===rn.toLowerCase()));e.innerHTML=t.length===0?`
      <div style="text-align:center; padding:3rem; background:var(--bg-surface); border-radius:16px; border:1px dashed var(--border-color); width:100%;">
        <p style="color:var(--text-muted);">No dispatches found under tag #${rn}.</p>
      </div>
    `:t.map(e=>{let t=e.coverImage?`
      <div class="card-cover">
        <img src="${e.coverImage}" alt="${e.title}" class="card-cover-img" loading="lazy">
      </div>
    `:``,n=!!(e.isEdited||e.updatedBy&&e.updatedAt),r=e.updatedBy||e.authors&&e.authors[0]||`CRII Researcher`,i=e.createdBy||e.authors&&e.authors[0]||`CRII Researcher`,a=n?new Date(e.updatedAt||e.date).toLocaleDateString(void 0,{year:`numeric`,month:`short`,day:`numeric`}):new Date(e.createdAt||e.date).toLocaleDateString(void 0,{year:`numeric`,month:`short`,day:`numeric`}),o=n?`<div class="article-meta-attribution" style="margin-bottom:0.75rem;"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg><span>Last edited by <strong>${r}</strong> on ${a}</span></div>`:`<div class="article-meta-attribution" style="margin-bottom:0.75rem;"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>Created by <strong>${i}</strong> on ${a}</span></div>`;return`
      <article class="card" style="padding:0; overflow:hidden;">
        ${t}
        <div style="padding:1.5rem; display:flex; flex-direction:column; flex:1;">
          <div class="card-top" style="margin-bottom:0.75rem;">
            <span class="badge badge-blue">${e.category}</span>
            <span class="card-date">${e.date} • ${e.readingTime||`8 min read`}</span>
          </div>
          <h2 class="card-title" style="font-size:1.45rem;">
            <a href="/article?id=${e.id}">${e.title}</a>
          </h2>
          <div class="card-authors" style="margin-bottom:0.4rem;">
            By ${e.authors?e.authors.join(`, `):`CRII Fellow`}
          </div>
          ${o}
          <p class="card-desc" style="flex:1;">${e.summary||(e.abstract?e.abstract.slice(0,180)+`...`:``)}</p>
          <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-bottom:1.25rem;">
            ${(e.tags||[]).map(e=>`<span class="tag-item">#${e}</span>`).join(``)}
          </div>
          <div class="card-footer" style="margin-top:auto; padding-top:1rem; border-top:1px solid var(--border-color);">
            <span style="font-size:0.78rem; font-family:monospace; color:var(--text-muted);">${e.doi||`Open Access`}</span>
            <a href="/article?id=${e.id}" class="btn btn-primary btn-sm">Read Full Dispatch</a>
          </div>
        </div>
      </article>
    `}).join(``)}function cn(){let e=document.getElementById(`tagList`);if(!e)return;let t={};nn.forEach(e=>{(e.tags||[]).forEach(e=>{t[e]=(t[e]||0)+1})});let n=Object.keys(t).sort((e,n)=>t[n]-t[e]);e.innerHTML=`
    <button class="category-pill ${rn===`all`?`active`:``}" onclick="selectTag('all')">All Dispatches</button>
    ${n.map(e=>`
      <button class="category-pill ${rn.toLowerCase()===e.toLowerCase()?`active`:``}" onclick="selectTag('${e}')">
        #${e} (${t[e]})
      </button>
    `).join(``)}
  `}window.selectTag=function(e){rn=e,sn(),cn()};function ln(e,t=`2026`){if(!e)return t;try{let t=new Date(e);return isNaN(t.getTime())?String(e):t.toLocaleDateString(void 0,{year:`numeric`,month:`short`,day:`numeric`})}catch{return String(e)||t}}async function un(e=null){let t=new URLSearchParams(window.location.search),n=(e||t.get(`id`)||t.get(`slug`)||``).trim(),r=document.getElementById(`articleContainer`);if(!r)return;if(!n){r.innerHTML=`
      <div style="text-align:center; padding:5rem 1rem;">
        <h1 style="font-size:2rem; margin-bottom:1rem; color:var(--text-primary);">Scientific Dispatch</h1>
        <p style="margin-bottom:2rem; color:var(--text-muted);">No article was selected. Please explore our open publications catalog.</p>
        <a href="/research" class="btn btn-primary">Browse Research Catalog</a>
      </div>
    `;return}r.innerHTML=`
    <div style="text-align:center; padding:5rem 1rem; color:var(--text-muted);">
      <div style="width:36px; height:36px; border:3px solid var(--border-color); border-top-color:var(--accent-primary); border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 1.5rem auto;"></div>
      <p style="font-size:1.1rem; font-weight:600; color:var(--text-primary);">Loading scientific publication...</p>
    </div>
  `;let i=null;try{if(window.CRII_API&&typeof window.CRII_API.getPostBySlugOrId==`function`)i=await window.CRII_API.getPostBySlugOrId(n);else{let e=await fetch(`/api/posts/${encodeURIComponent(n)}`);e.ok&&(i=await e.json())}}catch(e){console.error(`Failed to load article from API:`,e)}if(!i)try{let e=localStorage.getItem(`crii_posts_v2`);if(e){let t=JSON.parse(e);Array.isArray(t)&&(i=t.find(e=>e.id===n||e.slug===n||e.id===n.replace(/\s+/g,`-`)))}}catch{}if(!i)r.innerHTML=`
      <div style="text-align:center; padding:5rem 1rem;">
        <h1 style="font-size:2rem; margin-bottom:1rem; color:var(--text-primary);">Publication Not Found</h1>
        <p style="margin-bottom:2rem; color:var(--text-muted);">The requested research publication could not be located in our repository.</p>
        <a href="/research" class="btn btn-primary">Back to Research Catalog</a>
      </div>
    `;else try{dn(i,r),hn()}catch(e){console.error(`Error rendering article, using safe fallback:`,e),r.innerHTML=`
      <div style="margin-bottom: 2.75rem;">
        <h1 style="font-size: 2.5rem; margin-bottom: 1.25rem; color: #0f172a;">${pn(i.title||`Publication`)}</h1>
        <div style="font-size: 1rem; color: #475569; margin-bottom: 2rem;"><strong>Authors:</strong> ${i.authors&&i.authors.length?i.authors.join(` • `):`CRII Fellow`}</div>
        <article style="line-height: 1.8; font-size: 1.1rem; color: #334155;">
          ${pn(i.content||i.summary||``)}
        </article>
      </div>
    `}}window.initArticleReader=un;function dn(e,t){document.title=`${e.title||`Publication`} — CRII Publications`;let n=document.getElementById(`postHeroTitle`);n&&(n.innerText=e.title||``);let r=document.getElementById(`postCategoryHero`);r&&(r.innerText=e.category||`Article`);let i=e.authors&&e.authors.length?e.authors.join(` • `):`CRII Researcher`,a=e.readingTime||`5 min read`,o=e.doi?`DOI: ${e.doi}`:`DOI: 10.5281/crii.2026`,s=ln(e.date||e.createdAt),c=``;c=e.isEdited||e.updatedBy&&e.updatedAt?`Last edited by ${e.updatedBy||`CRII Researcher`} on ${ln(e.updatedAt)}`:`Created by ${e.createdBy||i.split(`•`)[0].trim()} on ${s}`;let l=``;e.coverImage&&(l=`
      <div class="article-cover-wrapper" style="margin-bottom:2.5rem; border-radius:16px; overflow:hidden; border:1px solid #e5dfd5; box-shadow:0 8px 30px rgba(0,0,0,0.06);">
        <img src="${e.coverImage}" alt="${e.title||``}" class="article-cover-img" style="width:100%; max-height:480px; object-fit:cover; display:block;" onerror="this.parentElement.style.display='none'">
      </div>
    `);let u=``;(e.abstract||e.summary)&&(u=`
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:1.75rem; margin-bottom:2.5rem; box-shadow:0 2px 8px rgba(0,0,0,0.02);">
        <h3 style="font-size:0.85rem; text-transform:uppercase; letter-spacing:0.08em; color:#0284c7; font-weight:700; margin-bottom:0.75rem;">Abstract</h3>
        <p style="font-size:1.05rem; line-height:1.75; color:#334155; font-style:italic; margin:0;">${e.abstract||e.summary}</p>
      </div>
    `);let d=``,f=typeof e.content==`string`?e.content:e.summary||``;if(Array.isArray(e.blocks)&&e.blocks.length>0)d=e.blocks.map(e=>fn(e)).join(``);else if(window.CriiDoc&&(window.CriiDoc.isDoc(f)||/<[a-z][\s\S]*>/i.test(f))){let e=window.CriiDoc.isDoc(f)?f.slice(window.CriiDoc.MARK.length):f;d=`<div class="crii-doc">`+window.CriiDoc.sanitize(e)+`</div>`}else d=mn(f);let p=``;if(Array.isArray(e.tags)&&e.tags.length>0&&(p=e.tags.map(e=>`<span class="tag-item" style="display:inline-block; padding:0.25rem 0.75rem; background:#f1f5f9; color:#475569; border-radius:9999px; font-size:0.82rem; font-weight:600;">#${e}</span>`).join(` `)),t.innerHTML=`
    <div style="margin-bottom: 2.75rem;">
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; font-size: 0.86rem; color: #64748b; flex-wrap: wrap;">
        <span>${s}</span>
        <span>•</span>
        <span>${a}</span>
        <span>•</span>
        <span style="color: #0284c7; font-family: monospace;">${o}</span>
      </div>

      <h1 style="font-size: 2.65rem; line-height: 1.2; margin-bottom: 1.25rem; color: #0f172a; letter-spacing: -0.025em; font-weight:800;">${e.title||``}</h1>

      <div style="font-size: 1.05rem; color: #475569; margin-bottom: 1.25rem;">
        <strong>Authors:</strong> <span style="color: #0f172a; font-weight: 600;">${i}</span>
      </div>

      <div style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1.75rem; font-size: 0.82rem; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); padding: 0.35rem 0.85rem; border-radius: 9999px; color: #047857; font-weight: 600;">
        <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #10b981;"></span>
        <span>${c}</span>
      </div>

      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; padding: 1.25rem 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
        <button id="citePostBtn" class="btn btn-secondary btn-sm" style="border-radius: 9999px;">Cite This Paper</button>
        <button id="sharePostBtn" class="btn btn-secondary btn-sm" style="border-radius: 9999px;">Share Article</button>
        <a href="/research" class="btn btn-glass btn-sm" style="border-radius: 9999px;">Browse Datasets</a>
      </div>
    </div>

    ${l}
    ${u}

    <article id="postContent" style="margin-bottom: 4rem; line-height: 1.85; font-size: 1.1rem; color: #334155;">
      ${d}
    </article>

    ${p?`
      <div style="padding: 1.75rem 0; border-top: 1px solid #e2e8f0; margin-bottom: 2rem;">
        <span style="font-size: 0.78rem; text-transform: uppercase; color: #64748b; font-weight: 700; display: block; margin-bottom: 0.65rem; letter-spacing: 0.08em;">Keywords</span>
        <div style="display: flex; flex-wrap: wrap; gap: 0.45rem;">${p}</div>
      </div>
    `:``}
  `,window.CriiDoc&&typeof window.CriiDoc.renderMath==`function`){let e=document.getElementById(`postContent`);e&&window.CriiDoc.renderMath(e)}let m=document.getElementById(`citePostBtn`);m&&m.addEventListener(`click`,()=>{let t=`${i} (${s.split(`-`)[0]}). ${e.title}. Curiomas Research & Innovation Institute. ${o}`;typeof window.copyToClipboard==`function`?window.copyToClipboard(t,`APA Citation copied to clipboard!`):navigator.clipboard.writeText(t).then(()=>alert(`Citation copied to clipboard!`))});let h=document.getElementById(`sharePostBtn`);h&&h.addEventListener(`click`,()=>{typeof window.copyToClipboard==`function`?window.copyToClipboard(window.location.href,`Article link copied to clipboard!`):navigator.clipboard.writeText(window.location.href).then(()=>alert(`Article link copied!`))})}function fn(e){if(!e)return``;if(window.CRII_WORD&&typeof window.CRII_WORD.blocksToHtml==`function`)return window.CRII_WORD.blocksToHtml([e]);let t=e.type||`text`,n=e.content||``;switch(t){case`heading`:{let t=e.level||2;return`<h${t} style="font-size:${t===1?`2.1rem`:t===2?`1.65rem`:`1.35rem`}; color:#0f172a; font-weight:800; margin:2.25rem 0 1rem 0;">${n}</h${t}>`}case`subheading`:return`<h3 style="font-size:1.35rem; color:#0f172a; font-weight:700; margin:2rem 0 0.85rem 0;">${n}</h3>`;case`quote`:return`<blockquote style="border-left:4px solid #0284c7; padding:1rem 1.5rem; margin:1.75rem 0; background:#f8fafc; color:#334155; font-style:italic; border-radius:0 10px 10px 0;">${n}${e.author?`<cite style="display:block; margin-top:0.6rem; font-size:0.85rem; color:#64748b; font-style:normal; font-weight:600;">— ${pn(e.author)}</cite>`:``}</blockquote>`;case`callout`:{let t=e.tone||`note`,r={note:{bg:`#eff6ff`,border:`#bfdbfe`,accent:`#3b82f6`,color:`#1e40af`,icon:`ℹ`},warning:{bg:`#fffbeb`,border:`#fde68a`,accent:`#f59e0b`,color:`#92400e`,icon:`⚠`},tip:{bg:`#ecfdf5`,border:`#a7f3d0`,accent:`#10b981`,color:`#065f46`,icon:`💡`},important:{bg:`#fef2f2`,border:`#fecaca`,accent:`#ef4444`,color:`#991b1b`,icon:`★`}},i=r[t]||r.note;return`<div style="background:${i.bg}; border:1px solid ${i.border}; border-left:4px solid ${i.accent}; padding:1.15rem 1.4rem; border-radius:8px; margin:1.75rem 0; color:${i.color}; font-size:1.02rem; line-height:1.7;"><strong style="margin-right:0.4rem;">${i.icon}</strong> ${n}</div>`}case`code`:return`<pre style="background:#0f172a; color:#f8fafc; padding:1.25rem; border-radius:10px; overflow-x:auto; margin:1.75rem 0; font-family:monospace; font-size:0.92rem;"><code data-lang="${pn(e.language||`text`)}">${pn(n)}</code></pre>`;case`math`:return`<div class="doc-equation" style="background:#f8fafc; padding:1.25rem; border-radius:10px; border:1px solid #e2e8f0; margin:1.75rem 0; font-family:monospace; color:#0284c7; text-align:center; overflow-x:auto;">$$${n}$$</div>`;case`image`:return`<figure style="margin:2rem 0; text-align:center;"><img src="${e.url||n}" alt="${e.caption||``}" style="max-width:100%; border-radius:12px; box-shadow:0 4px 16px rgba(0,0,0,0.06);"><figcaption style="font-size:0.85rem; color:#64748b; margin-top:0.5rem; font-style:italic;">${e.caption||``}</figcaption></figure>`;case`video`:{let t=e.url||n||``,r=t,i=t.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]+)/);return i&&(r=`https://www.youtube.com/embed/${i[1]}`),`<div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:12px; margin:2rem 0; box-shadow:0 4px 16px rgba(0,0,0,0.08); background:#000;"><iframe src="${r}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" allowfullscreen></iframe></div>`}case`timeline`:return`<div style="display:flex; gap:1.25rem; padding:1rem 0; border-left:3px solid #3b82f6; padding-left:1.25rem; margin:1.25rem 0;"><span style="font-size:0.82rem; font-weight:700; color:#2563eb; background:#eff6ff; padding:0.25rem 0.65rem; border-radius:9999px; height:fit-content; white-space:nowrap;">${pn(e.date||`Milestone`)}</span><div style="font-size:1.02rem; color:#334155; line-height:1.7;">${n}</div></div>`;case`music`:return`<div style="display:flex; align-items:center; gap:1rem; padding:1rem 1.25rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; margin:1.75rem 0;"><span style="font-size:1.5rem;">🎵</span><div style="flex:1;"><a href="${pn(e.url||`#`)}" target="_blank" style="font-weight:600; color:#0f172a; text-decoration:none;">${pn(e.title||`Soundtrack / Track`)}</a><p style="margin:0.2rem 0 0 0; font-size:0.86rem; color:#64748b;">${n}</p></div></div>`;case`table`:return`<div style="overflow-x:auto; margin:1.75rem 0;"><table style="width:100%; border-collapse:collapse; border:1px solid #e2e8f0; font-size:0.95rem;">${n}</table></div>`;case`list`:return`<ul style="margin:1.5rem 0; padding-left:1.75rem; color:#334155; line-height:1.8;">${(Array.isArray(e.items)?e.items:String(n).split(`
`)).filter(Boolean).map(e=>`<li>${e}</li>`).join(``)}</ul>`;case`divider`:return`<hr style="border:none; border-top:1px solid #e2e8f0; margin:2.5rem 0;">`;default:return`<p style="font-size:1.08rem; line-height:1.85; margin-bottom:1.5rem; color:#334155;">${n}</p>`}}function pn(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function mn(e){let t=e;return t=t.replace(/^### (.*$)/gim,`<h3 style="font-size:1.35rem; margin:2.25rem 0 1rem; color:#0f172a; font-weight:700;">$1</h3>`),t=t.replace(/^## (.*$)/gim,`<h2 style="font-size:1.65rem; margin:2.75rem 0 1rem; color:#0f172a; font-weight:800;">$1</h2>`),t=t.replace(/^# (.*$)/gim,`<h1 style="font-size:2rem; margin:3rem 0 1.25rem; color:#0f172a; font-weight:800;">$1</h1>`),t=t.replace(/\$\$(.*?)\$\$/gs,`<div style="background:#f8fafc; padding:1.25rem; border-radius:12px; border:1px solid #e2e8f0; margin:1.5rem 0; font-family:monospace; color:#0284c7; text-align:center; overflow-x:auto;">$$$1$$</div>`),t=t.replace(/\*\*(.*?)\*\*/g,`<strong>$1</strong>`),t=t.replace(/\*(.*?)\*/g,`<em>$1</em>`),t=t.replace(/^\s*-\s+(.*$)/gim,`<li style="margin-left:1.5rem; margin-bottom:0.5rem; color:#475569;">$1</li>`),t.split(`

`).map(e=>(e=e.trim(),e?e.startsWith(`<h`)||e.startsWith(`<div`)||e.startsWith(`<li`)||e.startsWith(`<blockquote`)||e.startsWith(`<pre`)?e:`<p style="font-size:1.08rem; line-height:1.85; margin-bottom:1.5rem; color:#334155;">${e}</p>`:``)).join(``)}function hn(){let e=document.getElementById(`readProgressBar`);e&&window.addEventListener(`scroll`,()=>{let t=document.documentElement.scrollHeight-window.innerHeight,n=t>0?window.scrollY/t*100:0;e.style.width=`${Math.min(100,Math.max(0,n))}%`})}var gn=new class{constructor(){this.currentUser=null,this.token=null,this.isVerified=!1,this.initFromStorage()}initFromStorage(){try{this.token=localStorage.getItem(`crii_auth_token`)||null;let e=localStorage.getItem(`crii_auth_user`);this.currentUser=e?JSON.parse(e):null}catch{this.currentUser=null,this.token=null}}getToken(){return this.token||localStorage.getItem(`crii_auth_token`)}getCurrentUser(){if(this.currentUser)return this.currentUser;try{let e=localStorage.getItem(`crii_auth_user`);return e?JSON.parse(e):null}catch{return null}}getUser(){return this.getCurrentUser()}isAuthenticated(){let e=this.getToken(),t=this.getCurrentUser();if(!e||!t)return!1;if(e.startsWith(`crii_v2.`))try{let t=e.split(`.`)[1].replace(/-/g,`+`).replace(/_/g,`/`),n=JSON.parse(atob(t));if(n.exp&&Date.now()>n.exp)return this.clearSession(),!1}catch{}return!0}async verifySession(){let e=this.getToken();if(!e)return{authenticated:!1,user:null};try{let t={Accept:`application/json`};e&&(t.Authorization=`Bearer ${e}`);let n=await fetch(`/api/auth/me`,{method:`GET`,headers:t,credentials:`include`});if(n.ok){let e=await n.json();if(e.authenticated&&e.user)return this.currentUser=e.user,this.isVerified=!0,localStorage.setItem(`crii_auth_user`,JSON.stringify(e.user)),{authenticated:!0,user:e.user}}else if(n.status===401&&(await n.json().catch(()=>({}))).revoked)return this.clearSession(),{authenticated:!1,revoked:!0,user:null}}catch(e){console.warn(`Session verification network error, keeping verified local cache:`,e)}return this.isAuthenticated()?{authenticated:!0,user:this.getCurrentUser(),cached:!0}:(this.clearSession(),{authenticated:!1,user:null})}async handleAuthCode(e){if(!e)return{success:!1,error:`No authorization code provided`};try{let t=await fetch(`/api/auth/login`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({code:e}),credentials:`include`}),n=await t.json();return t.ok&&n.success?(this.token=n.token,this.currentUser=n.user,this.isVerified=!0,localStorage.setItem(`crii_auth_token`,n.token),localStorage.setItem(`crii_auth_user`,JSON.stringify(n.user)),{success:!0,user:n.user,token:n.token}):{success:!1,error:n.error||`Authentication rejected`}}catch{return{success:!1,error:`Network error connecting to authentication service`}}}async logout(){let e=this.getToken();try{let t={"Content-Type":`application/json`};e&&(t.Authorization=`Bearer ${e}`),await fetch(`/api/auth/logout`,{method:`POST`,headers:t,credentials:`include`}).catch(()=>{})}finally{this.clearSession()}}clearSession(){this.currentUser=null,this.token=null,this.isVerified=!1,localStorage.removeItem(`crii_auth_token`),localStorage.removeItem(`crii_auth_user`)}};typeof window<`u`&&(window.CRII_AUTH=gn);function _n(e=`/`){let t=gn.isAuthenticated(),n=t?`PORTAL`:`LOGIN`,r=t?`/portal`:`/login`,i=t=>t===`/`&&(e===`/`||e===``)||t!==`/`&&e.startsWith(t)?`active`:``;return`
    <div class="mockup-nav-wrapper">
      <header class="crii-nav-capsule">
        <!-- 1. Left Nav Segment: Home, Research, Dispatches -->
        <nav class="nav-segment nav-segment-left">
          <a href="/" class="nav-item ${i(`/`)}">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Home</span>
          </a>

          <a href="/research" class="nav-item ${i(`/research`)}">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 2v7.31L4.1 20.3a2 2 0 0 0 1.7 2.7h12.4a2 2 0 0 0 1.7-2.7L14 9.31V2"/>
              <path d="M8.5 2h7"/>
              <path d="M7 16h10"/>
            </svg>
            <span>Research</span>
          </a>

          <a href="/blog" class="nav-item ${i(`/blog`)}">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
              <path d="M6 6h10"/>
              <path d="M6 10h10"/>
            </svg>
            <span>Dispatches</span>
          </a>
        </nav>

        <!-- 2. Middle Chamfered Badge: Institute Logo + CRII -->
        <a href="/" class="nav-center-badge" title="Curiomas Research & Innovation Institute">
          <div class="badge-logo-wrap">
            <img src="/assets/curiomas-no-bg.png" alt="CRII Logo" class="badge-logo-img">
          </div>
          <span class="badge-title">CRII</span>
        </a>

        <!-- 3. Right Nav Segment: Team, Contact, Divider, Language, Search, Explore/Portal Pill -->
        <div class="nav-segment nav-segment-right">
          <nav class="nav-sub-links">
            <a href="/team" class="nav-item ${i(`/team`)}">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Team</span>
            </a>

            <a href="/contact" class="nav-item ${i(`/contact`)}">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <span>Contact</span>
            </a>
          </nav>

          <div class="nav-v-divider"></div>

          <!-- Language Dropdown -->
          <div class="nav-lang-dropdown" id="navLangDropdown">
            <button type="button" class="nav-icon-action nav-lang-btn" id="navLangBtn" aria-expanded="false" title="Language">
              <img src="https://flagcdn.com/w40/gb.png" alt="English" class="nav-lang-flag-img" id="navLangFlagImg">
            </button>
            <div class="nav-lang-menu" id="navLangMenu">
              <button type="button" class="nav-lang-opt active" data-lang="en">
                <img src="https://flagcdn.com/w40/gb.png" class="opt-flag" alt="GB">
                <span>English</span>
              </button>
              <button type="button" class="nav-lang-opt" data-lang="bn">
                <img src="https://flagcdn.com/w40/bd.png" class="opt-flag" alt="BD">
                <span>বাংলা</span>
              </button>
            </div>
          </div>

          <!-- Search Button -->
          <button type="button" class="nav-icon-action nav-search-trigger" id="navSearchTrigger" aria-label="Search" title="Search posts (Ctrl+K)">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

          <!-- Vibrant Blue Explore / Portal Pill -->
          <a href="${r}" class="nav-explore-btn">
            <span>${n}</span>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>

          <!-- Mobile Hamburger Toggle -->
          <button class="nav-icon-action menu-toggle" id="menuToggleBtn" aria-label="Toggle Menu" type="button" aria-expanded="false">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Mobile Dropdown Menu -->
      <nav class="crii-mobile-menu" id="criiMobileMenu">
        <a href="/" class="mobile-nav-link ${i(`/`)}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          <span>Home</span>
        </a>
        <a href="/research" class="mobile-nav-link ${i(`/research`)}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31L4.1 20.3a2 2 0 0 0 1.7 2.7h12.4a2 2 0 0 0 1.7-2.7L14 9.31V2"/></svg>
          <span>Research</span>
        </a>
        <a href="/blog" class="mobile-nav-link ${i(`/blog`)}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
          <span>Dispatches</span>
        </a>
        <a href="/team" class="mobile-nav-link ${i(`/team`)}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          <span>Team</span>
        </a>
        <a href="/contact" class="mobile-nav-link ${i(`/contact`)}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          <span>Contact</span>
        </a>
        <div style="border-top:1px solid rgba(255,255,255,0.12); margin-top:0.4rem; padding-top:0.4rem;">
          <a href="${r}" class="mobile-nav-link mobile-login-pill ${i(`/portal`)||i(`/login`)}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            <span>${n}</span>
          </a>
        </div>
      </nav>
    </div>
  `}function vn(e){try{localStorage.setItem(`crii_site_language`,e);let t=window.location.hostname,n=e===`en`?`/en/en`:`/en/${e}`;if(document.cookie=`googtrans=${n}; path=/;`,t){document.cookie=`googtrans=${n}; path=/; domain=${t};`;let e=t.replace(/^www\./,``);e!==t&&(document.cookie=`googtrans=${n}; path=/; domain=.${e};`)}let r=document.querySelector(`.goog-te-combo`);r?(r.value=e,r.dispatchEvent(new Event(`change`,{bubbles:!0}))):window.location.reload()}catch(e){console.error(`Translation error:`,e),window.location.reload()}}window.triggerGoogleTranslate=vn;function yn(e){let t=document.getElementById(`navSearchTrigger`);t&&window.CRII_OPEN_SEARCH&&t.addEventListener(`click`,()=>window.CRII_OPEN_SEARCH());let n=document.getElementById(`navLangBtn`),r=document.getElementById(`navLangMenu`),i=document.getElementById(`navLangDropdown`);if(n&&r){if((localStorage.getItem(`crii_site_language`)||`en`)===`bn`){let e=document.getElementById(`navLangFlagImg`);e&&(e.src=`https://flagcdn.com/w40/bd.png`,e.alt=`বাংলা`),r.querySelectorAll(`.nav-lang-opt`).forEach(e=>{e.classList.toggle(`active`,e.getAttribute(`data-lang`)===`bn`)});let t=window.location.hostname;document.cookie=`googtrans=/en/bn; path=/;`,document.cookie=`googtrans=/en/bn; path=/; domain=${t};`;let n=setInterval(()=>{let e=document.querySelector(`.goog-te-combo`);e&&(e.value!==`bn`&&(e.value=`bn`,e.dispatchEvent(new Event(`change`,{bubbles:!0}))),clearInterval(n))},300);setTimeout(()=>clearInterval(n),4e3)}n.addEventListener(`click`,e=>{e.stopPropagation();let t=r.classList.toggle(`show`);n.setAttribute(`aria-expanded`,String(t))}),document.addEventListener(`click`,e=>{i&&!i.contains(e.target)&&(r.classList.remove(`show`),n.setAttribute(`aria-expanded`,`false`))}),r.querySelectorAll(`.nav-lang-opt`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-lang`);r.querySelectorAll(`.nav-lang-opt`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`);let i=document.getElementById(`navLangFlagImg`);i&&(i.src=t===`bn`?`https://flagcdn.com/w40/bd.png`:`https://flagcdn.com/w40/gb.png`,i.alt=t===`bn`?`বাংলা`:`English`),r.classList.remove(`show`),n.setAttribute(`aria-expanded`,`false`),typeof window.triggerGoogleTranslate==`function`&&window.triggerGoogleTranslate(t)})})}let a=document.getElementById(`menuToggleBtn`),o=document.getElementById(`criiMobileMenu`);if(a&&o){let e=e=>{o.classList.toggle(`show`,e),a.setAttribute(`aria-expanded`,String(e)),a.classList.toggle(`active`,e),a.innerHTML=e?`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`:`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`};a.onclick=t=>{t.preventDefault(),t.stopPropagation();let n=!o.classList.contains(`show`);e(n)},o.querySelectorAll(`a`).forEach(t=>{t.addEventListener(`click`,()=>{e(!1)})}),document.addEventListener(`click`,t=>{!o.contains(t.target)&&!a.contains(t.target)&&e(!1)})}}function bn(e=`/`){document.querySelectorAll(`.nav-item, .mobile-nav-link`).forEach(t=>{let n=t.getAttribute(`href`);n===`/`&&(e===`/`||e===``)||n!==`/`&&e.startsWith(n)?t.classList.add(`active`):t.classList.remove(`active`)});let t=gn.isAuthenticated();document.querySelectorAll(`.nav-explore-btn span, .mobile-login-pill span`).forEach(e=>{e.textContent=t?`PORTAL`:`LOGIN`}),document.querySelectorAll(`.nav-explore-btn, .mobile-login-pill`).forEach(e=>{e.setAttribute(`href`,t?`/portal`:`/login`)})}function xn(){return`
    <footer class="mockup-forest-footer" style="background:#071f16; color:#ffffff;">
      <style>
        .mockup-forest-footer { background: #071f16 !important; color: #ffffff !important; }
        .mockup-forest-footer .footer-col-header,
        .mockup-forest-footer .footer-col h4,
        .mockup-forest-footer h4 {
          color: #ffffff !important;
          font-size: 0.78rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.12em !important;
          text-transform: uppercase !important;
          margin-bottom: 1.25rem !important;
        }
        .mockup-forest-footer ul { list-style: none !important; margin: 0 !important; padding: 0 !important; }
        .mockup-forest-footer li { list-style: none !important; margin: 0 !important; padding: 0 !important; }
        .mockup-forest-footer a { color: #a3c2b4 !important; text-decoration: none !important; font-size: 0.9rem; transition: color 0.2s ease, transform 0.2s ease; display: inline-block; }
        .mockup-forest-footer a:hover { color: #ffffff !important; transform: translateX(2px); }
        .mockup-forest-footer .footer-huge-motto {
          color: #ffffff !important;
          font-size: 3.25rem !important;
          font-style: italic !important;
          font-weight: 400 !important;
          letter-spacing: -0.01em !important;
          font-family: var(--font-display, 'Eyekons', 'Playfair Display', Georgia, serif) !important;
        }
      </style>
      <div class="mockup-container">
        <!-- 1. Top Grid: Brand Column + 4 Navigation / Focus Columns -->
        <div class="footer-top-grid">
          <!-- Brand Column -->
          <div class="footer-brand-col">
            <div class="footer-brand-header">
              <img src="/assets/curiomas-no-bg.png" alt="CRII" class="footer-brand-logo">
              <span class="footer-brand-name" style="color:#ffffff !important; font-size:1.35rem; font-weight:700;">curiomas</span>
            </div>
            <div class="footer-brand-sub" style="color:#a3c2b4 !important; font-size:0.88rem; margin-bottom:0.2rem;">Autonomous Research Institute</div>
            <div class="footer-brand-sub" style="color:#a3c2b4 !important; font-size:0.88rem; margin-bottom:0.5rem;">Founded 2026</div>
            <div class="footer-brand-tagline" style="color:#94b8a7 !important; font-size:0.86rem; line-height:1.5;">
              Open-source scientific inquiry across exoplanetary atmospheres, ancient biology, and machine intelligence.
            </div>
          </div>

          <!-- Column 1: Navigation -->
          <div class="footer-col">
            <h4 class="footer-col-header" style="color:#ffffff !important;">NAVIGATION</h4>
            <ul class="footer-links-list">
              <li><a href="/">Home</a></li>
              <li><a href="/research">Research & Publications</a></li>
              <li><a href="/blog">Dispatches</a></li>
              <li><a href="/team">Team & Mentors</a></li>
              <li><a href="/team#apply">Admissions</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/portal">Researcher Portal</a></li>
            </ul>
          </div>

          <!-- Column 2: Research Focus -->
          <div class="footer-col">
            <h4 class="footer-col-header" style="color:#ffffff !important;">RESEARCH FOCUS</h4>
            <ul class="footer-links-list">
              <li><a href="/research">Astrophysics & Space Science</a></li>
              <li><a href="/research">Ancient Evolutionary Biology</a></li>
              <li><a href="/research">AI & Computational Biophysics</a></li>
              <li><a href="/research">Open Datasets & Methods</a></li>
            </ul>
          </div>

          <!-- Column 3: Admissions & Fellowships -->
          <div class="footer-col">
            <h4 class="footer-col-header" style="color:#ffffff !important;">ADMISSIONS</h4>
            <ul class="footer-links-list">
              <li><a href="/team#apply">Student Fellowships</a></li>
              <li><a href="/team">Mentorship Tracks</a></li>
              <li><a href="/contact">Research Collaborations</a></li>
              <li><a href="/contact">Peer Review Office</a></li>
            </ul>
          </div>

          <!-- Column 4: Get in Touch -->
          <div class="footer-col">
            <h4 class="footer-col-header" style="color:#ffffff !important;">GET IN TOUCH</h4>
            <ul class="footer-links-list">
              <li><a href="/contact">Inquiries & Partnerships</a></li>
              <li><a href="mailto:harunabdullahrakin@gmail.com">Director's Office</a></li>
              <li><a href="mailto:curiomas.members@gmail.com">General Contact</a></li>
            </ul>
          </div>
        </div>

        <!-- 2. Institute Motto Banner -->
        <div class="footer-motto-row" style="border-top: 1px solid rgba(255, 255, 255, 0.12); padding: 3rem 0 2rem 0; display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap; gap:1.5rem;">
          <div class="footer-huge-motto" style="color:#ffffff !important;">Turning Curiosity into Action.</div>
          <div class="footer-institute-note" style="color:#a3c2b4 !important; font-size:0.92rem;">Autonomous. Open by design. Verifiable.</div>
        </div>

        <!-- 3. Legal & Open License Disclaimer Bar -->
        <div class="footer-legal-bar" style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; font-size:0.82rem; color:#719584;">
          <div>© 2026 Curiomas Research & Innovation Institute. Autonomous open science.</div>
          <div>All scientific dispatches and code released under CC-BY 4.0 Open Science License.</div>
        </div>
      </div>
    </footer>
  `}function Sn(){return`
    <div class="crii-search-overlay" id="criiSearchOverlay" aria-hidden="true" style="display:none;">
      <div class="crii-search-backdrop" id="criiSearchBackdrop"></div>
      <div class="crii-search-modal">
        <div class="crii-search-header">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" class="crii-search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="siteSearchInput" class="crii-search-input" placeholder="Search dispatches, research, topics..." autocomplete="off" spellcheck="false">
          <kbd class="crii-search-esc" id="criiSearchEsc">ESC</kbd>
        </div>
        <div class="crii-search-quick-tags" id="criiSearchQuickTags">
          <span class="quick-tag-label">Suggested:</span>
          <button type="button" class="quick-tag-btn" data-query="Spectra">Spectra</button>
          <button type="button" class="quick-tag-btn" data-query="Biophysics">Biophysics</button>
          <button type="button" class="quick-tag-btn" data-query="Paleogenomics">Paleogenomics</button>
          <button type="button" class="quick-tag-btn" data-query="Habitability">Habitability</button>
        </div>
        <div class="crii-search-body" id="criiSearchResults">
          <div class="crii-search-empty">Type keywords or click a suggestion above to search...</div>
        </div>
        <div class="crii-search-footer">
          <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Select</span>
          <span><kbd>ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  `}function Cn(e){let t=document.getElementById(`criiSearchOverlay`),n=document.getElementById(`criiSearchBackdrop`),r=document.getElementById(`siteSearchInput`),i=document.getElementById(`criiSearchResults`),a=document.getElementById(`criiSearchEsc`),o=document.getElementById(`criiSearchQuickTags`);if(!t||!r)return;function s(e=``){t.style.display=`flex`,t.setAttribute(`aria-hidden`,`false`),document.body.classList.add(`search-modal-open`),e?(r.value=e,u(e)):(r.value=``,i&&(i.innerHTML=`<div class="crii-search-empty">Type keywords or click a suggestion above to search...</div>`)),setTimeout(()=>r.focus(),60)}function c(){t.style.display=`none`,t.setAttribute(`aria-hidden`,`true`),document.body.classList.remove(`search-modal-open`),r.value=``}document.addEventListener(`keydown`,e=>{(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`k`?(e.preventDefault(),t.style.display===`flex`?c():s()):e.key===`Escape`&&t.style.display===`flex`&&c()}),n&&n.addEventListener(`click`,c),a&&a.addEventListener(`click`,c),o&&o.addEventListener(`click`,e=>{let t=e.target.closest(`.quick-tag-btn`);if(t){let e=t.getAttribute(`data-query`);r.value=e,u(e)}});let l;r.addEventListener(`input`,()=>{clearTimeout(l),l=setTimeout(()=>{u(r.value.trim())},180)});async function u(t){if(!i)return;if(!t){i.innerHTML=`<div class="crii-search-empty">Type keywords or click a suggestion above to search...</div>`;return}let n=[];if(window.CRII_API&&typeof window.CRII_API.getPosts==`function`)try{n=await window.CRII_API.getPosts()}catch{}let r=t.toLowerCase(),a=n.filter(e=>{let t=(e.title||``).toLowerCase(),n=(e.author||``).toLowerCase(),i=(e.category||``).toLowerCase(),a=(e.excerpt||``).toLowerCase();return t.includes(r)||n.includes(r)||i.includes(r)||a.includes(r)});a.length===0?i.innerHTML=`<div class="crii-search-empty">No results found for "<strong>${d(t)}</strong>". Try searching for <em>Spectra</em>, <em>Biophysics</em>, or <em>Habitability</em>.</div>`:(i.innerHTML=a.map((e,t)=>`
        <a href="${e.slug?`/article?id=${e.slug}`:`/article?id=${e.id}`}" class="crii-search-result-item ${t===0?`active`:``}" data-index="${t}">
          <div class="result-title">${d(e.title)}</div>
          <div class="result-meta">
            <span>${d(e.author||`CRII Researcher`)}</span>
            <span>•</span>
            <span>${d(e.category||`Science`)}</span>
            <span>•</span>
            <span>${e.readTime||`4 min read`}</span>
          </div>
          ${e.excerpt?`<div class="result-snippet">${d(e.excerpt)}</div>`:``}
        </a>
      `).join(``),i.querySelectorAll(`.crii-search-result-item`).forEach(t=>{t.addEventListener(`click`,n=>{n.preventDefault();let r=t.getAttribute(`href`);c(),e&&e.navigate(r)})}))}function d(e){return e?e.replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e]):``}window.CRII_OPEN_SEARCH=s,window.CRII_CLOSE_SEARCH=c}function $({bgColor:e=`#060b16`,color:t=`#f4efe6`,flip:n=!1,connectorId:r=null}={}){let i=n?`curve-flip`:``,a=r?`
    <a href="#${r}" class="mockup-section-connector" style="position: absolute; top: -19px; left: 50%; transform: translateX(-50%); z-index: 20; margin: 0; text-decoration: none;" aria-label="Scroll to section">
      <div class="connector-circle">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#ffffff" stroke-width="2.8"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </a>
  `:``;return`
    <div class="mockup-curve-divider ${i}" aria-hidden="true" style="background-color: ${e}; color: ${t}; margin-top: -4px; margin-bottom: -4px; ${n?`transform: rotate(180deg) translateZ(0);`:`transform: translateZ(0);`}">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" class="mockup-curve-svg" style="display:block; width:calc(100% + 4px); margin-left:-2px; height:56px;">
        <rect x="-60" y="-10" width="1560" height="95" fill="${e}"></rect>
        <path class="curve-path-2" d="M-60,32 C360,60 720,5 1080,44 C1260,62 1380,20 1500,30 L1500,85 L-60,85 Z" fill="${t}" fill-opacity="0.75"></path>
        <path class="curve-path-1" d="M-60,22 C320,54 680,10 1020,38 C1200,52 1350,16 1500,22 L1500,85 L-60,85 Z" fill="${t}"></path>
      </svg>
      ${a}
    </div>
  `}new class{constructor(){this.isPlaying=!1,this.isMuted=!1,this.videoEl=null,this.buttonEl=null,this.userInteracted=!1}init(e=`heroSoundToggle`){if(this.buttonEl=document.getElementById(e),this.videoEl=document.getElementById(`heroVideo`),!this.buttonEl)return;this.buttonEl.addEventListener(`click`,()=>this.toggleSound());let t=()=>{this.userInteracted||(this.userInteracted=!0,this.videoEl&&!this.isMuted&&(this.videoEl.muted=!1,this.videoEl.play().catch(()=>{}),this.updateButtonUI(!0)),window.removeEventListener(`click`,t,{capture:!0}),window.removeEventListener(`keydown`,t,{capture:!0}))};window.addEventListener(`click`,t,{capture:!0,once:!0}),window.addEventListener(`keydown`,t,{capture:!0,once:!0})}attachVideo(e){this.videoEl=e,this.videoEl&&(this.videoEl.muted=this.isMuted)}toggleSound(){this.videoEl&&(this.videoEl.muted?(this.videoEl.muted=!1,this.isMuted=!1,this.videoEl.play().catch(()=>{}),this.updateButtonUI(!0)):(this.videoEl.muted=!0,this.isMuted=!0,this.updateButtonUI(!1)))}updateButtonUI(e){this.buttonEl&&(e?(this.buttonEl.classList.add(`is-playing`),this.buttonEl.title=`Mute Sound`,this.buttonEl.innerHTML=`
        <span class="hero-sound-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
        </span>
      `):(this.buttonEl.classList.remove(`is-playing`),this.buttonEl.title=`Play Sound`,this.buttonEl.innerHTML=`
        <span class="hero-sound-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        </span>
      `))}};function wn(){return`
    <div class="page-home-wrapper">
      <!-- =========================================================================
           SECTION 1: DARK COSMOS HERO & FLOATING CAPSULE NAVBAR
           ========================================================================= -->
      <section class="mockup-hero-section">
        <!-- Ambient Hero Video Layer -->
        <video id="heroVideo" class="mockup-hero-video" autoplay muted loop playsinline style="background:#060b16;"></video>
        <!-- Dynamic Background Image Layer (only activated if mediaType is 'image' or 'both') -->
        <div class="mockup-hero-bg-layer" id="heroBgImageLayer" style="display:none; opacity:0;"></div>
        <div class="mockup-hero-bg-overlay"></div>

        <!-- Floating Small Audio Play/Pause Button (Top Right Side) -->
        <button type="button" class="hero-sound-floating-btn is-playing" id="heroSoundToggle" aria-label="Toggle Sound" title="Mute Sound" style="display:none;">
          <span class="hero-sound-icon" id="heroSoundIcon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
          </span>
        </button>

        <div class="mockup-container">
          <!-- Hero Main Content -->
          <div class="mockup-hero-body scroll-reveal">
            <h1 class="mockup-hero-title">
              Bring structure<br>to your research
            </h1>

            <div class="mockup-hero-actions">
              <a href="#editorialSection" class="mockup-btn-white">
                <span>Explore Featured Articles</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
              <a href="/team#apply" class="mockup-hero-link">
                <span>Apply as Student Fellow</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>
          </div>

          <!-- Hero Bottom Ticker -->
          <div class="mockup-hero-ticker" style="justify-content: center; text-align: center;">
            <span class="ticker-center">Turning Curiosity into Action.</span>
          </div>
        </div>
      </section>

      <!-- Seamless Wave Divider from Hero (#060b16) into Editorial (#f4efe6) -->
      ${$({bgColor:`#060b16`,color:`#f4efe6`,connectorId:`editorialSection`})}

      <!-- =========================================================================
           SECTION 2: FROM THE INSTITUTE (OPEN-SOURCE, VERIFIABLE)
           ========================================================================= -->
      <section class="mockup-editorial-section" id="editorialSection">
        <div class="mockup-container">
          <div class="editorial-header scroll-reveal">
            <div class="editorial-header-left">
              <h2 class="mockup-h2">From the Institute.</h2>
              <svg class="wavy-title-line" viewBox="0 0 120 12" fill="none"><path d="M2 6 Q 16 0, 30 6 T 60 6 T 90 6 T 118 6"/></svg>
            </div>
            <div class="editorial-header-right">
              <p>Rigorous, reproducible research and upcoming editorial dispatches across astrophysics, evolutionary paleogenomics and machine-learning biophysics.</p>
            </div>
          </div>

          <div id="fromTheInstituteContainer" class="scroll-reveal">
            <!-- Dynamically populated with published articles -->
          </div>
        </div>
      </section>

      <!-- =========================================================================
           SECTION 3: THE INSTITUTE INTRO
           ========================================================================= -->
      <section class="mockup-institute-section">
        <div class="mockup-container">
          <div class="institute-grid">
            <div class="institute-left scroll-reveal scroll-reveal-left">
              <div class="institute-big-acronym">CRII</div>
              <div class="institute-subname">Curiomas Research & Innovation Institute</div>
            </div>

            <div class="institute-right scroll-reveal scroll-reveal-right">
              <h2 class="institute-heading">
                A student-driven institute.<br>A shared pursuit of discovery.
              </h2>
              <p class="institute-desc">
                We are an autonomous research institute connecting deep-space exoplanetary atmospheres with ancient biology and genomic divergence. Our work brings verifiable datasets, peer-grade articles and open pipelines into a shared framework for discovery.
              </p>
              <a href="/contact" class="mockup-arrow-link">
                <span>Contact Institute</span>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- =========================================================================
           SECTION 4: OUR RESEARCH DIVISIONS
           ========================================================================= -->
      <section class="mockup-divisions-section">
        <div class="mockup-container">
          <div class="divisions-header scroll-reveal">
            <div class="divisions-header-left">
              <h2 class="mockup-h2">A wider field of inquiry.</h2>
            </div>
            <a href="/research" class="mockup-arrow-link">
              <span>Explore all research</span>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </a>
          </div>

          <div class="divisions-cards-grid scroll-reveal" id="homeDivisionsContainer">
            <!-- Rendered dynamically from CRII API / Portal -->
          </div>
        </div>
      </section>

      <!-- Repo Section Wave -->
      ${$({bgColor:`#faf8f5`,color:`#f4efe6`})}

      <!-- =========================================================================
           SECTION 5: PUBLICATIONS REPOSITORY INITIALIZING
           ========================================================================= -->
      <section class="mockup-repo-section">
        <div class="mockup-container">
          <div class="repo-main-grid">
            <div class="repo-left scroll-reveal scroll-reveal-left">
              <h3 class="repo-heading">Publications Repository Initializing</h3>
              <p class="repo-desc">
                Peer-reviewed articles, preprints and open datasets are currently being prepared by the institute research fellows. The repository will open to the public as soon as initial peer-review cycles complete.
              </p>
              <a href="/portal" class="mockup-btn-outline">
                <span>RESEARCH PORTAL ACCESS</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>

            <div class="repo-right scroll-reveal scroll-reveal-right">
              <a href="/research" class="repo-row scroll-reveal">
                <div class="repo-row-content">
                  <div class="repo-row-title">Articles & preprints</div>
                  <div class="repo-row-sub">All our research papers, openly accessible.</div>
                </div>
                <div class="repo-row-action">
                  <span>View articles</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                </div>
              </a>

              <a href="/research" class="repo-row scroll-reveal">
                <div class="repo-row-content">
                  <div class="repo-row-title">Methods & open pipelines</div>
                  <div class="repo-row-sub">Reproducible code and step-by-step methods.</div>
                </div>
                <div class="repo-row-action">
                  <span>View methods</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                </div>
              </a>

              <a href="/research" class="repo-row scroll-reveal">
                <div class="repo-row-content">
                  <div class="repo-row-title">Research datasets</div>
                  <div class="repo-row-sub">Raw and processed data, published for anyone.</div>
                </div>
                <div class="repo-row-action">
                  <span>View datasets</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                </div>
              </a>
            </div>
          </div>

          <div class="repo-footer-bar">
            <span>Curated under Creative Commons Open Research (CC-BY 4.0)</span>
            <span>Protected by Cloudflare Pages & Workers D1 SQL Backend</span>
          </div>
        </div>
      </section>

      <!-- Emerald Section Wave -->
      ${$({bgColor:`#f4efe6`,color:`#09231a`})}

      <!-- =========================================================================
           SECTION 6: BUILT FOR RIGOROUS, VERIFIABLE SCIENCE (DEEP GREEN)
           ========================================================================= -->
      <section class="mockup-emerald-section">
        <div class="mockup-container">
          <div class="emerald-header scroll-reveal">
            <div class="emerald-header-left">
              <h2 class="emerald-title">Built for Rigorous, Verifiable Science</h2>
            </div>
            <div class="emerald-header-right">
              <p>Our commitments span open access preprints and curated datasets, alongside transparent student fellowship cohorts that power continuous verification.</p>
            </div>
          </div>

          <div class="emerald-columns-grid">
            <div class="emerald-col scroll-reveal">
              <div class="emerald-col-num">01</div>
              <h3 class="emerald-col-title">Preprints & Open Access</h3>
              <p class="emerald-col-desc">Crucially open access: all preprints are published in open repository under Creative Commons licenses. Authors retain full copyright, always.</p>
              <a href="/research" class="emerald-col-link">
                <span>Learn about our preprint policy</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>

            <div class="emerald-col scroll-reveal" style="transition-delay: 0.12s;">
              <div class="emerald-col-num">02</div>
              <h3 class="emerald-col-title">Curated Datasets</h3>
              <p class="emerald-col-desc">Public open data, structured and machine-readable. We publish alongside each paper all raw and processed datasets under standard protocols.</p>
              <a href="/research" class="emerald-col-link">
                <span>Explore our datasets</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>

            <div class="emerald-col scroll-reveal" style="transition-delay: 0.24s;">
              <div class="emerald-col-num">03</div>
              <h3 class="emerald-col-title">Student Fellowship Cohorts</h3>
              <p class="emerald-col-desc">Organised research cohorts. Participants receive mentoring, collaborate across disciplines and contribute to published outputs under mentorship.</p>
              <a href="/team#apply" class="emerald-col-link">
                <span>Fellowship programme details</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Mentors Section Wave -->
      ${$({bgColor:`#09231a`,color:`#faf8f5`})}

      <!-- =========================================================================
           SECTION 7: CORE TEAM & RESEARCH MENTORS
           ========================================================================= -->
      <section class="mockup-mentors-section">
        <div class="mockup-container">
          <div class="mentors-grid">
            <div class="mentors-left scroll-reveal scroll-reveal-left">
              <div class="mentors-image-wrap">
                <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80" alt="Mentorship notebook and keys" loading="lazy">
              </div>
              <div class="mentors-caption">Fellowship cohorts are guided by peer mentors.</div>
            </div>

            <div class="mentors-right scroll-reveal scroll-reveal-right">
              <h2 class="mockup-h2">Core Team & Research Mentors</h2>
              <p class="mentors-desc">
                Founded by a hands-on core team of student researchers and mentors who pursue discovery together. We bring researchers from astronomy to evolutionary biology into an open, collaborative, and peer-to-peer learning environment.
              </p>
              <div class="mentors-meta-pill">
                STUDENT MENTORS • PEER-TO-PEER RESEARCH • OPEN COMMUNITY
              </div>
              <a href="/team" class="mockup-arrow-link">
                <span>Meet the team</span>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Mentors to Sand CTA Wave -->
      ${$({bgColor:`#faf8f5`,color:`#ded3be`})}

      <!-- =========================================================================
           SECTION 8: READY TO ADVANCE FRONTIER SCIENCE? (WARM SAND)
           ========================================================================= -->
      <section class="mockup-sand-cta-section">
        <div class="mockup-container">
          <div class="sand-cta-grid scroll-reveal scroll-reveal-scale">
            <div class="sand-cta-left">
              <h2 class="sand-cta-title">Ready to Advance Frontier Science?</h2>
            </div>

            <div class="sand-cta-right">
              <p class="sand-cta-desc">
                Find a supportive cohort, explore our open publications, or join the next fellowship intake. Applications for the upcoming research intake are now being reviewed on a rolling basis.
              </p>
              <div class="sand-cta-actions">
                <a href="/team#apply" class="mockup-btn-dark-green">
                  <span>Submit Fellowship Application</span>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                </a>
                <a href="/contact" class="mockup-arrow-link dark-link">
                  <span>Contact admissions desk</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Cohort Section Wave -->
      ${$({bgColor:`#ded3be`,color:`#faf8f5`})}

      <!-- =========================================================================
           SECTION 9: WHO CAN JOIN US? (COHORT PROFILES)
           ========================================================================= -->
      <section class="mockup-cohort-section">
        <div class="mockup-container">
          <div class="cohort-header scroll-reveal">
            <div class="cohort-header-left">
              <h2 class="mockup-h2">Who can join us?</h2>
            </div>
            <div class="cohort-header-right">
              <p>CRII was built by and for students, regardless of formal institutional affiliation. We welcome curious, committed individuals across disciplines who want to contribute to frontier open science.</p>
            </div>
          </div>

          <div class="cohort-cards-grid scroll-reveal" id="cohortCardsContainer">
            <!-- Dynamically rendered from CRII API / Portal -->
          </div>

          <div class="cohort-bottom-banner scroll-reveal">
            <div class="cohort-note-text">
              Applicant Note: All CRII Fellowship positions are remote, open to applicants worldwide, and conducted under open-science principles.
            </div>
            <a href="/team#apply" class="mockup-btn-dark-green">
              <span>Apply for Research Cohort</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </a>
          </div>
        </div>
      </section>

      <!-- Cohort to Midnight Section Wave -->
      ${$({bgColor:`#faf8f5`,color:`#07101d`})}

      <!-- =========================================================================
           SECTION 10: HAVE A QUESTION? (DEEP MIDNIGHT NAVY)
           ========================================================================= -->
      <section class="mockup-midnight-section">
        <div class="mockup-container">
          <h2 class="midnight-title scroll-reveal">Have a question? Do not hesitate to reach out.</h2>

          <div class="midnight-columns-grid">
            <div class="midnight-col scroll-reveal">
              <div class="midnight-col-num">01</div>
              <h3 class="midnight-col-title">Research & Publications</h3>
              <p class="midnight-col-desc">For discussions on paper submissions, preprints, methods data and open-source science collaborations.</p>
              <a href="/contact" class="midnight-col-link">
                <span>Research Enquiries</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>

            <div class="midnight-col scroll-reveal" style="transition-delay: 0.12s;">
              <div class="midnight-col-num">02</div>
              <h3 class="midnight-col-title">Fellowship Enquiries</h3>
              <p class="midnight-col-desc">For questions about the application cycle, eligibility, remote cohort participation, or mentorship.</p>
              <a href="/contact" class="midnight-col-link">
                <span>Admissions Enquiries</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>

            <div class="midnight-col scroll-reveal" style="transition-delay: 0.24s;">
              <div class="midnight-col-num">03</div>
              <h3 class="midnight-col-title">Institutional Collaboration</h3>
              <p class="midnight-col-desc">Interested in partnering with CRII on datasets, shared research or educational open-source pipelines?</p>
              <a href="/contact" class="midnight-col-link">
                <span>Contact the Director</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </a>
            </div>
          </div>

          <div class="midnight-bottom-bar">
            <span>For all other inquiries, please use the contact form.</span>
            <a href="/contact" class="mockup-btn-white">
              <span>Open contact form</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </a>
          </div>
        </div>
      </section>

      <!-- Midnight to Footer Wave -->
      ${$({bgColor:`#07101d`,color:`#071f16`})}
    </div>
  `}async function Tn(){typeof window.initHeroCustomization==`function`&&await window.initHeroCustomization(),typeof window.initFeaturedArticles==`function`&&window.initFeaturedArticles(),typeof window.initDivisions==`function`&&window.initDivisions(),typeof window.initCohorts==`function`&&window.initCohorts(),typeof window.refreshScrollAnimations==`function`&&window.refreshScrollAnimations()}function En({title:e=``,subtitle:t=``,breadcrumbs:n=null,minHeight:r=`auto`,customHtml:i=``}={}){let a=n?`
    <div class="mockup-page-hero-breadcrumbs" style="font-size: 0.86rem; color: #94a3b8; margin-bottom: 1.25rem;">
      ${n.map((e,t)=>t===n.length-1?`<span style="color: #38bdf8; font-weight: 600;">${e.label}</span>`:`<a href="${e.href}" style="color: inherit; text-decoration: none;">${e.label}</a> / `).join(``)}
    </div>
  `:``,o=t?`
    <p class="mockup-page-hero-subtitle">
      ${t}
    </p>
  `:``;return`
    <section class="mockup-page-hero" style="${r===`auto`?``:`min-height: ${r};`}">
      <div class="mockup-page-hero-bg-layer"></div>
      <div class="mockup-page-hero-bg-overlay"></div>
      <div class="mockup-container">
        <div class="mockup-page-hero-body scroll-reveal">
          ${a}
          <h1 class="mockup-page-hero-title">${e}</h1>
          ${o}
          ${i}
        </div>
      </div>
    </section>
  `}function Dn(){return`
    <div class="page-research-wrapper">
      ${En({title:`Research Publications & Datasets`,subtitle:`Browse peer-grade publications, synthetic spectroscopic transits, and genomic clock calibrations authored by autonomous student researchers and fellows.`,breadcrumbs:[{label:`Home`,href:`/`},{label:`Research`,href:`/research`}]})}

      <!-- Wave from Dark Page Hero (#060b16) into Light Content (#faf8f5) -->
      ${$({bgColor:`#060b16`,color:`#faf8f5`})}

      <main class="mockup-page-content">
        <div class="mockup-container">
          <!-- Catalog Toggle Buttons -->
          <div class="research-catalog-tabs">
            <button class="btn btn-primary catalog-tab active" data-tab="papers">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
              <span>Research Papers & Preprints</span>
            </button>
            <button class="btn btn-secondary catalog-tab" data-tab="datasets">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
              <span>Open Scientific Datasets</span>
            </button>
          </div>

          <!-- Filter Bar -->
          <div class="filter-bar research-filter-card">
            <div class="search-input-group">
              <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input type="text" id="researchSearch" class="search-input" placeholder="Search publications, authors, or scientific keywords...">
            </div>

            <div class="category-pills">
              <button class="category-pill active" data-category="all">All Disciplines</button>
              <button class="category-pill" data-category="Space">Space & Astrophysics</button>
              <button class="category-pill" data-category="Ancient">Ancient Biology</button>
              <button class="category-pill" data-category="AI">AI & Computational</button>
              <button class="category-pill" data-category="Astrobiology">Astrobiology</button>
            </div>
          </div>

          <!-- Papers Container -->
          <div id="papersContainer" class="cards-grid"></div>

          <!-- Datasets Container -->
          <div id="datasetsContainer" class="cards-grid" style="display: none;"></div>
        </div>
      </main>

      <!-- Citation Modal -->
      <div id="citeModal" class="modal-overlay">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 id="citeModalTitle" class="modal-title">Cite Publication</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div id="citeModalBody" class="modal-body"></div>
          <div class="modal-footer">
            <button class="btn btn-secondary modal-cancel">Close</button>
          </div>
        </div>
      </div>

      <!-- Dataset Inspection Modal -->
      <div id="datasetModal" class="modal-overlay">
        <div class="modal-dialog" style="max-width: 820px;">
          <div class="modal-header">
            <h3 id="datasetModalTitle" class="modal-title">Dataset Inspection</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div id="datasetModalBody" class="modal-body"></div>
          <div class="modal-footer">
            <button class="btn btn-secondary modal-cancel">Done</button>
          </div>
        </div>
      </div>

      <!-- Footer Wave Divider -->
      ${$({bgColor:`#faf8f5`,color:`#071f16`})}
    </div>
  `}async function On(){typeof window.initResearchCatalog==`function`&&window.initResearchCatalog(),typeof window.refreshScrollAnimations==`function`&&window.refreshScrollAnimations()}function kn(){return`
    <div class="page-team-wrapper">
      <!-- Dark Page Hero -->
      ${En({title:`Core Team & Research Mentors`,subtitle:`Meet the student researchers, principal investigators, and mentors shaping autonomous open science tracks across astrophysics, paleobiology, and machine learning.`,breadcrumbs:[{label:`Home`,href:`/`},{label:`Team`,href:`/team`}]})}

      <!-- Wave from Dark Page Hero (#060b16) into Light Content (#faf8f5) -->
      ${$({bgColor:`#060b16`,color:`#faf8f5`})}

      <!-- Main Team & Fellows Content -->
      <main class="mockup-page-content">
        <div class="mockup-container">
          <!-- 1. REAL CORE TEAM & PRINCIPAL INVESTIGATORS -->
          <div style="margin-bottom: 4.5rem;">
            <h2 class="mockup-h2">Principal Researchers & Directors</h2>
            <p style="font-size: 1.05rem; line-height: 1.65; color: #5c635d; margin-bottom: 2rem; max-width: 720px;">
              Meet the founding investigators, research directors, and student leaders steering the institute's initiatives and research clusters.
            </p>
            <div id="coreTeamContainer" class="cards-grid"></div>
          </div>

          <!-- 2. STUDENT RESEARCH FELLOWS & INTERNS -->
          <div>
            <h2 class="mockup-h2">Student Fellows & Active Researchers</h2>
            <p style="font-size: 1.05rem; line-height: 1.65; color: #5c635d; margin-bottom: 2rem; max-width: 720px;">
              Independent and undergraduate researchers investigating deep time genomics, transit spectroscopy, and extreme environment bioenergetics.
            </p>
            <div id="fellowsContainer" class="cards-grid"></div>
          </div>
        </div>
      </main>

      <!-- Wave from Light Content (#faf8f5) into Warm Sand Admissions (#ded3be) -->
      ${$({bgColor:`#faf8f5`,color:`#ded3be`})}

      <!-- 3. FELLOWSHIP ADMISSIONS SECTION (WARM SAND FULL-WIDTH) -->
      <section id="apply" class="mockup-sand-cta-section" style="background: #ded3be; padding: 5rem 0; scroll-margin-top: 80px;">
        <div class="mockup-container">
          <div style="max-width: 760px; margin: 0 auto;">
            <h2 class="sand-cta-title" style="margin-bottom: 0.5rem; text-align: center;">Apply for Student Research Fellowship</h2>
            <svg class="wavy-title-line" viewBox="0 0 120 12" fill="none" style="margin: 0 auto 1.5rem auto; display: block;"><path d="M2 6 Q 16 0, 30 6 T 60 6 T 90 6 T 118 6"/></svg>
            <p class="sand-cta-desc" style="margin-bottom: 2.5rem; text-align: center;">
              Join an active research track. No prior publications required — we value intellectual curiosity, self-drive, and rigor.
            </p>

            <div id="applicationFormCard" style="background: #ffffff; padding: 2.5rem; border-radius: 12px; border: 1px solid #d4c8b6; box-shadow: 0 4px 18px rgba(0,0,0,0.05);">
              <form id="internApplicationForm">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="appFullName" style="font-weight: 600;">Full Legal Name *</label>
                    <input type="text" id="appFullName" class="form-input" placeholder="e.g. Maya Lin" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="appEmail" style="font-weight: 600;">Email Address *</label>
                    <input type="email" id="appEmail" class="form-input" placeholder="maya.lin@university.edu" required>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="appUniversity" style="font-weight: 600;">University / Institution *</label>
                    <input type="text" id="appUniversity" class="form-input" placeholder="e.g. Institute of Science" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="appFieldOfStudy" style="font-weight: 600;">Field of Study / Major *</label>
                    <input type="text" id="appFieldOfStudy" class="form-input" placeholder="e.g. Physics, Molecular Biology, CS" required>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="appDivision" style="font-weight: 600;">Preferred Research Division *</label>
                    <select id="appDivision" class="form-select" required>
                      <option value="">Select Research Division Track...</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="appLevel" style="font-weight: 600;">Academic Level</label>
                    <select id="appLevel" class="form-select">
                      <option value="">Select Academic Level / Cohort Profile...</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="appPortfolio" style="font-weight: 600;">GitHub Profile, ORCID, or Portfolio Link</label>
                  <input type="url" id="appPortfolio" class="form-input" placeholder="https://github.com/your-username">
                </div>

                <!-- Dynamic Custom Fields Configured in Admin Portal -->
                <div id="appCustomFieldsContainer"></div>

                <div class="form-group">
                  <label class="form-label" for="appStatement" style="font-weight: 600;">Statement of Scientific Curiosity & Research Motivation *</label>
                  <textarea id="appStatement" class="form-textarea" placeholder="Describe the scientific question or domain that obsesses you. What do you want to explore at CRII?..." required></textarea>
                </div>

                <div style="margin-top: 2rem;">
                  <button type="submit" class="mockup-btn-dark-green" style="width: 100%; padding: 0.95rem; font-size: 1rem; border: none; cursor: pointer;">
                    <span>Submit Fellowship Application</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <!-- Wave from Warm Sand (#ded3be) into Forest Green Footer (#071f16) -->
      ${$({bgColor:`#ded3be`,color:`#071f16`})}
    </div>
  `}async function An(){typeof window.initInternsRoster==`function`&&window.initInternsRoster(),typeof window.initApplicationForm==`function`&&window.initApplicationForm(),typeof window.refreshScrollAnimations==`function`&&window.refreshScrollAnimations()}function jn(){return`
    <div class="page-blog-wrapper">
      ${En({title:`Dispatches from the Institute`,subtitle:`Field notes, methodological reflections, and preprint commentaries authored by autonomous student researchers and fellows.`,breadcrumbs:[{label:`Home`,href:`/`},{label:`Dispatches`,href:`/blog`}]})}

      <!-- Wave from Dark Page Hero (#060b16) into Light Content (#faf8f5) -->
      ${$({bgColor:`#060b16`,color:`#faf8f5`})}

      <main class="mockup-page-content">
        <div class="mockup-container" style="max-width: 960px;">
          <!-- Tag Cloud Filter -->
          <div style="margin-bottom: 3rem; text-align: center;">
            <div id="tagList" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem;"></div>
          </div>

          <!-- Blog List Container -->
          <div id="blogContainer" style="display: flex; flex-direction: column; gap: 2rem;"></div>
        </div>
      </main>

      <!-- Footer Wave Divider -->
      ${$({bgColor:`#faf8f5`,color:`#071f16`})}
    </div>
  `}async function Mn(){typeof window.initBlogFeed==`function`&&window.initBlogFeed(),typeof window.refreshScrollAnimations==`function`&&window.refreshScrollAnimations()}function Nn(){return`
    <div class="page-article-wrapper">
      <section class="mockup-page-hero" style="min-height: 280px; padding: 7rem 0 3.5rem 0;">
        <div class="mockup-page-hero-bg-layer"></div>
        <div class="mockup-page-hero-bg-overlay"></div>
        <div class="mockup-container">
          <div class="mockup-page-hero-body" style="max-width: 860px;">
            <div style="font-size: 0.86rem; color: #94a3b8; margin-bottom: 1.25rem;">
              <a href="/" style="color: inherit; text-decoration: none;">Home</a> / 
              <a href="/blog" style="color: inherit; text-decoration: none;">Dispatches</a> / 
              <span id="postCategoryHero" style="color: #38bdf8; font-weight: 600;">Article</span>
            </div>
            <h1 id="postHeroTitle" class="mockup-page-hero-title" style="font-size: 2.75rem; line-height: 1.15;"></h1>
          </div>
        </div>
      </section>

      <!-- Wave from Page Hero into Content -->
      ${$({bgColor:`#060b16`,color:`#faf8f5`})}

      <main class="mockup-page-content" style="padding: 3.5rem 0 6rem 0;">
        <div class="mockup-container" style="max-width: 860px;" id="articleContainer">
          <!-- Article Meta -->
          <div style="margin-bottom: 2.75rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; font-size: 0.86rem; color: #6b7280; flex-wrap: wrap;">
              <span id="postDate"></span>
              <span>•</span>
              <span id="postReadTime"></span>
              <span>•</span>
              <span id="postDoi" style="color: #0284c7; font-family: monospace;"></span>
            </div>

            <h1 id="postTitle" style="font-size: 2.65rem; line-height: 1.2; margin-bottom: 1.25rem; color: #16281e; letter-spacing: -0.025em;"></h1>

            <div style="font-size: 1.05rem; color: #4b5563; margin-bottom: 1.25rem;">
              <strong>Authors:</strong> <span id="postAuthors" style="color: #16281e; font-weight: 600;"></span>
            </div>

            <div id="postUpdatedMeta" style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1.75rem; font-size: 0.82rem; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); padding: 0.35rem 0.85rem; border-radius: 9999px; color: #047857; font-weight: 600;">
              <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #10b981;"></span>
              <span id="postUpdatedText"></span>
            </div>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; padding: 1.25rem 0; border-top: 1px solid #e5dfd5; border-bottom: 1px solid #e5dfd5;">
              <button id="citePostBtn" class="btn btn-secondary btn-sm" style="border-radius: 9999px;">Cite This Paper</button>
              <button id="sharePostBtn" class="btn btn-secondary btn-sm" style="border-radius: 9999px;">Share Article</button>
              <a href="/research" class="btn btn-glass btn-sm" style="border-radius: 9999px;">Browse Datasets</a>
            </div>
          </div>

          <!-- Article Cover Image -->
          <div id="postCoverWrapper" style="margin-bottom: 2.5rem;"></div>

          <!-- Abstract Box -->
          <div id="postAbstract" style="margin-bottom: 2rem;"></div>

          <!-- Article Body -->
          <article id="postContent" style="margin-bottom: 4rem; line-height: 1.8; font-size: 1.08rem; color: #2d3748;"></article>

          <!-- Keywords / Tags -->
          <div style="padding: 1.75rem 0; border-top: 1px solid #e5dfd5; margin-bottom: 2rem;">
            <span style="font-size: 0.78rem; text-transform: uppercase; color: #78716c; font-weight: 700; display: block; margin-bottom: 0.65rem; letter-spacing: 0.08em;">Keywords</span>
            <div id="postTags" style="display: flex; flex-wrap: wrap; gap: 0.45rem;"></div>
          </div>
        </div>
      </main>

      <!-- Footer Wave Divider -->
      ${$({bgColor:`#faf8f5`,color:`#071f16`})}
    </div>
  `}async function Pn(){let e=new URLSearchParams(window.location.search),t=e.get(`id`)||e.get(`slug`);typeof window.initArticleReader==`function`&&await window.initArticleReader(t),typeof window.refreshScrollAnimations==`function`&&window.refreshScrollAnimations()}function Fn(){return`
    <div class="page-contact-wrapper">
      ${En({title:`Contact the Institute`,subtitle:`Have questions about our open research papers, collaborative research tracks, or student admissions? Reach out to our leadership and fellow cohorts.`,breadcrumbs:[{label:`Home`,href:`/`},{label:`Contact`,href:`/contact`}]})}

      <!-- Wave from Dark Page Hero (#060b16) into Light Content (#faf8f5) -->
      ${$({bgColor:`#060b16`,color:`#faf8f5`})}

      <main class="mockup-page-content">
        <div class="mockup-container" style="max-width: 1080px;">
          <div class="contact-layout-grid">
            <!-- Contact Form Column -->
            <div class="contact-form-col">
              <div class="contact-form-card">
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
            </div>

            <!-- Direct Channels & Context Column -->
            <div class="contact-channels-col" style="display: flex; flex-direction: column; gap: 2rem;">
              <div class="contact-channels-card">
                <h3 style="font-size: 1.35rem; font-weight: 600; color: #16281e; margin-bottom: 1.5rem;">Direct Channels</h3>

                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                  <div style="display: flex; gap: 1rem; align-items: flex-start;">
                    <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(37, 99, 235, 0.1); color: #0284c7; display: grid; place-items: center; flex-shrink: 0;">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                    <div>
                      <div style="font-weight: 600; font-size: 0.95rem; color: #16281e;">General Administration</div>
                      <a href="mailto:curiomas.members@gmail.com" style="font-size: 0.88rem; color: #0284c7; margin-top: 0.2rem; display: block; text-decoration: none; font-weight: 500;">curiomas.members@gmail.com</a>
                    </div>
                  </div>

                  <div style="display: flex; gap: 1rem; align-items: flex-start;">
                    <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(16, 185, 129, 0.1); color: #059669; display: grid; place-items: center; flex-shrink: 0;">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    </div>
                    <div>
                      <div style="font-weight: 600; font-size: 0.95rem; color: #16281e;">Student Fellowship Admissions</div>
                      <a href="mailto:curiomas.members@gmail.com" style="font-size: 0.88rem; color: #059669; margin-top: 0.2rem; display: block; text-decoration: none; font-weight: 500;">curiomas.members@gmail.com</a>
                    </div>
                  </div>

                  <div style="display: flex; gap: 1rem; align-items: flex-start;">
                    <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(99, 102, 241, 0.1); color: #6366f1; display: grid; place-items: center; flex-shrink: 0;">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 17.93V18a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h1.5a1 1 0 0 0 1-1v-.5a1.5 1.5 0 0 0-1.5-1.5H13a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1V4.07A8 8 0 0 1 20 12a7.92 7.92 0 0 1-.7 3.23z"/></svg>
                    </div>
                    <div>
                      <div style="font-weight: 600; font-size: 0.95rem; color: #16281e;">Official Domain & Portal</div>
                      <a href="https://www.curiomas.zone.id" target="_blank" rel="noopener noreferrer" style="font-size: 0.88rem; color: #6366f1; margin-top: 0.2rem; display: block; text-decoration: none; font-weight: 500;">https://www.curiomas.zone.id</a>
                    </div>
                  </div>

                  <div style="display: flex; gap: 1rem; align-items: flex-start;">
                    <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(15, 23, 42, 0.08); color: #1e293b; display: grid; place-items: center; flex-shrink: 0;">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                    </div>
                    <div>
                      <div style="font-weight: 600; font-size: 0.95rem; color: #16281e;">Open Source Code & Data</div>
                      <a href="https://github.com/curiomas-crii" target="_blank" rel="noopener noreferrer" style="font-size: 0.88rem; color: #5f6862; margin-top: 0.2rem; display: block; text-decoration: none;">github.com/curiomas-crii</a>
                    </div>
                  </div>
                </div>
              </div>

              <div class="contact-context-card">
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
      ${$({bgColor:`#faf8f5`,color:`#071f16`})}
    </div>
  `}async function In(){let e=document.getElementById(`contactForm`);e&&e.addEventListener(`submit`,async t=>{t.preventDefault();let n=document.getElementById(`contactName`).value.trim(),r=document.getElementById(`contactEmail`).value.trim(),i=document.getElementById(`contactAffiliation`).value.trim(),a=document.getElementById(`contactSubject`).value.trim(),o=document.getElementById(`contactMessage`).value.trim(),s=e.querySelector(`button[type="submit"]`),c=s.innerHTML;s.disabled=!0,s.innerHTML=`<span>Sending inquiry...</span>`;try{if(window.emailjs){let e=localStorage.getItem(`crii_emailjs_template_id`)||(window.CRII_API&&typeof window.CRII_API.getEmailjsTemplateId==`function`?window.CRII_API.getEmailjsTemplateId():null)||`zhelx7y`;emailjs.init({publicKey:`h3x_9dtR8frBq2pCi`}),await emailjs.send(`curiomas`,e,{to_email:`curiomas.members@gmail.com`,from_name:n,sender_email:r,sender_affiliation:i,subject:`CRII Inquiry [${a}]: ${n}`,message:`From: ${n} (${r})\nAffiliation: ${i}\nCategory: ${a}\n\nMessage:\n${o}`,reply_to:r})}window.showToast&&window.showToast(`Your message has been sent successfully. We will be in touch shortly!`,`success`),e.reset()}catch(t){console.error(`Contact submit error:`,t),window.showToast&&window.showToast(`Inquiry received. If urgent, please email curiomas.members@gmail.com directly.`,`info`),e.reset()}finally{s.disabled=!1,s.innerHTML=c}}),typeof window.refreshScrollAnimations==`function`&&window.refreshScrollAnimations()}function Ln(){return`
    <div class="page-login-wrapper">
      <main class="login-split-page">
        <!-- LEFT PANEL: Visual Showcase with Random Scientific Image API -->
        <div class="login-showcase-pane" id="loginShowcasePane">
          <div class="login-showcase-overlay"></div>
          
          <div class="login-showcase-content">
            <div class="login-brand-header">
              <img src="/assets/curiomas-no-bg.png" alt="CRII Emblem" loading="eager">
              <div>
                <div class="login-brand-name">Curiomas Institute</div>
                <div class="login-brand-sub">Research & Innovation</div>
              </div>
            </div>

            <div class="login-hero-center">
              <h1 class="login-hero-title">Bring structure to your research.</h1>
              <p class="login-hero-desc">
                An autonomous, student-driven research collective unifying deep-space atmospheres, ancient paleogenomics, and biophysical machine learning into open, reproducible frameworks.
              </p>
            </div>

            <div class="login-showcase-footer">
              <div class="login-showcase-motto">Turning Curiosity into Action.</div>
              <div class="login-showcase-note">Autonomous by Design • CC-BY 4.0</div>
            </div>
          </div>
        </div>

        <!-- RIGHT PANEL: Authentication Panel -->
        <div class="login-form-pane">
          <div class="login-form-top-nav">
            <a href="/" class="login-back-link">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span>Return to Institute Website</span>
            </a>
          </div>

          <div class="login-form-center">
            <div class="login-form-crest">
              <img src="/assets/curiomas-no-bg.png" alt="CRII Crest">
            </div>

            <h2 class="login-form-title">Institute Sign In</h2>
            <p class="login-form-subtitle">
              Welcome back. Access the verified researcher dashboard, editorial suite, and publication repositories.
            </p>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <a id="loginWithAutzBtn" class="login-primary-btn" href="#" style="text-decoration:none;">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                <span>Login with your account</span>
              </a>

              <div id="loginStatus" style="display:none; text-align: center; padding: 0.9rem; border-radius: 12px; font-size: 0.88rem; line-height: 1.5; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.25); color: var(--accent-primary);"></div>

              <div id="loginError" style="display:none; text-align: left; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: 0.9rem; border-radius: 12px; font-size: 0.85rem; line-height: 1.5;"></div>
            </div>
          </div>

          <div class="login-form-footer">
            Protected by parameterized institute access control
          </div>
        </div>
      </main>
    </div>
  `}async function Rn(e){let t=document.getElementById(`loginWithAutzBtn`),n=document.getElementById(`loginStatus`),r=document.getElementById(`loginError`);if(gn.isAuthenticated()){e&&e.navigate(`/portal`);return}if(t){let e=window.location.origin.includes(`curiomas.zone.id`)?`https://www.curiomas.zone.id/login`:window.location.origin+`/login`,n=`https://autz.org/onboarding/gqiqh6qia?callback_url=${encodeURIComponent(e)}`;t.setAttribute(`href`,n),t.addEventListener(`click`,()=>{t.style.pointerEvents=`none`,t.innerHTML=`
        <span class="spinner" style="display:inline-block; width:16px; height:16px; border:2px solid #ffffff; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; margin-right:0.6rem;"></span>
        <span>Connecting to Single Sign-On...</span>
      `})}let i=new URLSearchParams(window.location.search),a=i.get(`auth_code`)||i.get(`code`);if(a){t&&(t.style.pointerEvents=`none`,t.innerHTML=`
        <span class="spinner" style="display:inline-block; width:16px; height:16px; border:2px solid #ffffff; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; margin-right:0.6rem;"></span>
        <span>Authenticating with Institute...</span>
      `),n&&(n.style.display=`block`,n.innerHTML=`
        <div style="display:flex; align-items:center; justify-content:center; gap:0.6rem;">
          <span class="spinner" style="display:inline-block; width:16px; height:16px; border:2px solid var(--accent-primary); border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite;"></span>
          <span>Verifying credentials with Institute Authentication...</span>
        </div>
      `);let i=await gn.handleAuthCode(a);window.history.replaceState({},document.title,window.location.pathname),i.success?(n&&(n.innerHTML=`<span style="color:#059669; font-weight:600;">✓ Verification complete! Redirecting to Researcher Portal...</span>`),setTimeout(()=>{e?e.navigate(`/portal`):window.location.href=`/portal`},400)):(n&&(n.style.display=`none`),r&&(r.style.display=`block`,r.innerHTML=`<strong>Authentication Failed:</strong> ${i.error||`Access denied`}`),t&&(t.style.pointerEvents=`auto`,t.innerHTML=`
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          <span>Try Signing In Again</span>
        `))}zn()}async function zn(){let e=document.getElementById(`loginShowcasePane`);if(!e)return;let t=[`galaxy`,`nebula`,`deep+space`,`telescope`,`hubble`,`astrophysics`,`supernova`],n=t[Math.floor(Math.random()*t.length)];try{let t=await fetch(`https://images-api.nasa.gov/search?q=`+n+`&media_type=image`);if(t.ok){let n=((await t.json())?.collection?.items||[]).filter(e=>e.links&&e.links.length>0&&e.links[0].href);if(n.length>0){let t=n[Math.floor(Math.random()*Math.min(n.length,25))].links[0].href.replace(/~thumb\.jpg$/,`~large.jpg`).replace(/~small\.jpg$/,`~large.jpg`),r=new Image;r.onload=()=>{e.style.backgroundImage=`url("`+t+`")`},r.src=t}}}catch{e.style.backgroundImage=`url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=85')`}}function Bn(){return`
    <div class="page-portal-wrapper">
      <section class="portal-layout" id="portalDashboardSection">
        <!-- Mobile Drawer Backdrop -->
        <div class="portal-sidebar-backdrop" id="portalSidebarBackdrop"></div>

        <!-- Sidebar Shell -->
        <aside class="portal-sidebar" id="portalSidebar">
          <!-- Sidebar Brand Header -->
          <div class="portal-brand">
            <a href="/" class="portal-brand-content" title="Return to CRII Public Website">
              <div class="brand-logo-container">
                <img src="/assets/curiomas-no-bg.png" alt="CRII Logo" class="brand-logo-img">
              </div>
              <div class="brand-text-block">
                <div class="brand-title">CRII PORTAL</div>
                <div class="brand-badge">Institute Verified</div>
              </div>
            </a>

            <!-- Desktop Toggle Button -->
            <button id="portalSidebarToggleBtn" class="portal-sidebar-toggle-btn" title="Toggle sidebar (Ctrl+B)" aria-label="Toggle sidebar">
              <svg class="toggle-icon-collapse" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="M9 3v18"/>
                <path d="m15 9-3 3 3 3"/>
              </svg>
              <svg class="toggle-icon-expand" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="M9 3v18"/>
                <path d="m13 9 3 3-3 3"/>
              </svg>
            </button>

            <!-- Mobile Drawer Close Button -->
            <button id="portalSidebarCloseBtn" class="portal-sidebar-close-btn" title="Close drawer" aria-label="Close drawer">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

      <!-- Navigation Menu -->
      <nav class="portal-nav">
        
        <!-- Group 1: General -->
        <div class="portal-nav-group">
          <div class="portal-nav-group-title">Main</div>
          <button class="portal-nav-btn active" data-tab="overview" data-tooltip="Overview">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
            </svg>
            <span class="portal-nav-label">Overview</span>
          </button>
        </div>

        <!-- Group 2: Research & Publishing -->
        <div class="portal-nav-group">
          <div class="portal-nav-group-title">Research & Editorial</div>
          
          <button class="portal-nav-btn" data-tab="posts" data-tooltip="Publications & Blog">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
            </svg>
            <span class="portal-nav-label">Publications & Blog</span>
          </button>

          <button class="portal-nav-btn" data-tab="divisions" data-tooltip="Research Divisions">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="12" y1="9" x2="12" y2="3"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="9" y1="12" x2="3" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/>
            </svg>
            <span class="portal-nav-label">Research Divisions</span>
          </button>

          <button class="portal-nav-btn" data-tab="datasets" data-tooltip="Open Datasets">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
            </svg>
            <span class="portal-nav-label">Open Datasets</span>
          </button>
        </div>

        <!-- Group 3: Community & Cohorts -->
        <div class="portal-nav-group">
          <div class="portal-nav-group-title">Community & Queue</div>

          <button class="portal-nav-btn" data-tab="roster" data-tooltip="Team & Fellows">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span class="portal-nav-label">Team & Fellows</span>
          </button>

          <button class="portal-nav-btn" data-tab="interns" data-tooltip="Admissions Queue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span class="portal-nav-label">Admissions Queue</span>
            <span id="sidebarAppBadge" class="portal-nav-badge">0</span>
          </button>

          <button class="portal-nav-btn" data-tab="cohorts" data-tooltip="Who Can Join Us">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/>
            </svg>
            <span class="portal-nav-label">Who Can Join Us?</span>
          </button>
        </div>

        <!-- Group 4: Storage & Media Manager -->
        <div class="portal-nav-group">
          <div class="portal-nav-group-title">Storage & Assets</div>

          <button class="portal-nav-btn" data-tab="storage" data-tooltip="Media Storage Manager">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
            <span class="portal-nav-label">Media & R2 Storage</span>
            <span id="sidebarMediaBadge" class="portal-nav-badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; font-weight: 700;">R2</span>
          </button>
        </div>

        <!-- Group 5: Governance & System -->
        <div class="portal-nav-group">
          <div class="portal-nav-group-title">Governance & Settings</div>

          
          <button class="portal-nav-btn" data-tab="aliases" data-tooltip="Researcher Emails (ImprovMX)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span class="portal-nav-label">Researcher Emails</span>
            <span class="portal-nav-badge" style="background: rgba(234, 88, 12, 0.15); color: #ea580c; font-weight: 700;">MX</span>
          </button>
          <button class="portal-nav-btn" data-tab="permissions" data-tooltip="Access Control">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>
            </svg>
            <span class="portal-nav-label">Access Control</span>
          </button>

          <button class="portal-nav-btn" data-tab="sql" data-tooltip="D1 Database & SQL Studio">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
            </svg>
            <span class="portal-nav-label">D1 SQL Studio</span>
            <span class="portal-nav-badge" style="background: rgba(234, 88, 12, 0.15); color: #ea580c; font-weight: 700;">D1</span>
          </button>
          <button class="portal-nav-btn" data-tab="settings" data-tooltip="Institute & Navbar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            <span class="portal-nav-label">Institute & Navbar</span>
          </button>

          <button class="portal-nav-btn" data-tab="emailer" onclick="openEmailComposer('', '', '', ''); return false;" data-tooltip="Email Dispatcher">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            <span class="portal-nav-label">Email Dispatcher</span>
            <span class="portal-nav-badge" style="background: rgba(234, 88, 12, 0.15); color: #ea580c; font-weight: 700;">Gmail</span>
          </button>
        </div>

      </nav>

      <!-- Sidebar Footer -->
      <div class="portal-sidebar-footer">
        <div class="portal-user-card">
          <div class="portal-user-avatar" id="portalUserAvatar">R</div>
          <div class="portal-user-meta">
            <span id="portalUserName" class="portal-user-name">User</span>
            <span id="portalUserRole" class="portal-user-role">Role</span>
            <span id="portalUserEmail" class="portal-user-email">user@gmail.com</span>
          </div>
          <div class="portal-user-actions">
            <button class="portal-user-action-btn theme-toggle-btn" title="Toggle theme">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            </button>
            <button id="portalLogoutBtn" class="portal-user-action-btn" title="Sign out">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
              </svg>
            </button>
          </div>
        </div>

        <a href="/" class="portal-public-link" title="Open Public Website">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          <span class="portal-public-label">View Public Site ↗</span>
        </a>
      </div>
    </aside>

    <!-- Mobile Topbar for Admin Portal -->
    <header class="portal-mobile-topbar" id="portalMobileTopbar">
      <div class="portal-mobile-brand">
        <button id="portalMobileMenuBtn" class="portal-mobile-menu-btn" type="button" aria-label="Open portal navigation">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div style="display:flex; align-items:center; gap:0.55rem;">
          <img src="/assets/curiomas-no-bg.png" alt="CRII" style="width:26px; height:26px; object-fit:contain;">
          <span style="font-weight:700; font-size:0.98rem; color:var(--text-primary); letter-spacing:0.03em;">CRII PORTAL</span>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <button type="button" class="portal-icon-btn" onclick="openEmailComposer('', '', '', '')" title="Compose Email via curiomas.members@gmail.com" aria-label="Compose Email">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        </button>
        <button type="button" class="portal-icon-btn theme-toggle-btn" title="Toggle theme" aria-label="Toggle theme">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="portal-main">
      <!-- ====================================================================
           TAB 1: OVERVIEW
           ==================================================================== -->
      <div id="tab-overview" class="portal-tab-content">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Institute Operations Dashboard</h1>
            <p>Overview of publications, admissions queue, and open datasets.</p>
          </div>
          <div style="display:inline-flex; gap:0.6rem; align-items:center;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="openEmailComposer('', '', '', '')" title="Compose Email via curiomas.members@gmail.com" style="display:inline-flex; align-items:center; gap:0.4rem;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span>Compose Email</span>
            </button>
            <button class="btn btn-primary btn-sm" onclick="showTab('posts'); if (window.openBloggerEditor) openBloggerEditor(null);">
              <span>+ New Publication</span>
            </button>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-title">Published Papers</span>
              <svg class="metric-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
              </svg>
            </div>
            <div id="statPapers" class="metric-val">0</div>
            <div class="metric-desc">Available in open catalog</div>
          </div>

          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-title">Active Fellows</span>
              <svg class="metric-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
            </div>
            <div id="statInterns" class="metric-val">0</div>
            <div class="metric-desc">Engaged across 4 divisions</div>
          </div>

          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-title">Admissions Queue</span>
              <svg class="metric-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div id="statApps" class="metric-val" style="color: var(--accent-amber);">0</div>
            <div class="metric-desc">Pending committee review</div>
          </div>

          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-title">Open Datasets</span>
              <svg class="metric-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
            </div>
            <div id="statDatasets" class="metric-val">0</div>
            <div class="metric-desc">Open science formats</div>
          </div>
        </div>

        <!-- Quick Summary Box -->
        <div class="card" style="padding: 2rem;">
          <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--text-primary);">Security & Edge Operations Status</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
            CRII runs with Single Sign-On protection. Only verified emails configured in your 
            <a href="#" onclick="showTab('permissions'); return false;" style="font-weight: 600;">Access Control Whitelist</a> can authenticate.
            All client requests are strictly sanitized to prevent injection attacks and preserve reproducible data.
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm" onclick="showTab('interns')">Review Intern Applications →</button>
            <button class="btn btn-secondary btn-sm" onclick="showTab('permissions')">Manage Authorized Roster →</button>
            <button class="btn btn-glass btn-sm" onclick="showTab('settings')">Institute & Navbar Settings</button>
          </div>
        </div>
      </div>

      <!-- ====================================================================
           TAB 2: PUBLICATIONS & BLOG (Blogger.com Style Studio)
           ==================================================================== -->
      <div id="tab-posts" class="portal-tab-content" style="display:none;">
        
        <!-- 2A. DIRECTORY VIEW: Lists all existing publications -->
        <div id="postsDirectoryView">
          <div class="portal-topbar">
            <div class="portal-title-block">
              <h1>Research Publications & Dispatches</h1>
              <p>Curate peer-grade research papers, track revision history, and publish new dispatches.</p>
            </div>
            <button class="btn btn-primary" id="openNewPostEditorBtn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>+ Create New Publication</span>
            </button>
          </div>

          <!-- Filter & Search Toolbar -->
          <div class="data-table-card" style="padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap;">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn btn-sm btn-secondary active" id="filterPostsAll" onclick="filterPostsList('all')">All Articles</button>
              <button class="btn btn-sm btn-secondary" id="filterPostsPub" onclick="filterPostsList('published')">Published</button>
              <button class="btn btn-sm btn-secondary" id="filterPostsDraft" onclick="filterPostsList('draft')">Drafts</button>
            </div>
            <div style="min-width: 240px; flex: 1; max-width: 380px;">
              <input type="text" id="searchPostsInput" class="form-input" placeholder="Search by title, author, or keyword..." style="padding: 0.45rem 0.85rem; font-size: 0.85rem;">
            </div>
          </div>

          <!-- Existing Posts Table Card -->
          <div class="data-table-card">
            <div class="table-wrapper">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Article & Cover</th>
                    <th>Division</th>
                    <th>Last Revision & Author</th>
                    <th>Status</th>
                    <th style="text-align: right;">Actions</th>
                  </tr>
                </thead>
                <tbody id="portalPostsTbody"></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 2B. BLOGGER-STYLE FULL BLOCK PUBLISHER (Shown when creating or editing) -->
        <div id="postsEditorView" style="display: none;">
          <div class="blogger-editor-container">
            <!-- Topbar (Back, Title, Read time, Status, Save) -->
            <div class="blogger-topbar">
              <div class="blogger-topbar-left">
                <button type="button" class="btn btn-secondary btn-sm" id="bloggerBackBtn" title="Back to Publications Directory">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                  </svg>
                  <span>Back</span>
                </button>
                <input type="text" id="bloggerTitleInput" class="blogger-title-input" placeholder="Untitled Research Publication...">
              </div>

              <div class="blogger-topbar-right">
                <span id="bloggerReadTimeBadge" style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">1 min read</span>
                <button type="button" id="bloggerStatusBtn" class="status-chip published" style="cursor: pointer; border: none; font-size: 0.78rem; padding: 0.3rem 0.75rem;">
                  Published
                </button>
                <button type="button" id="bloggerSaveBtn" class="btn btn-primary btn-sm" style="padding: 0.5rem 1.4rem;">
                  Save & Publish
                </button>
              </div>
            </div>

            <!-- Editor Sub-navigation Tabs -->
            <div class="blogger-tabs">
              <button type="button" class="blogger-tab-btn active" data-subtab="write">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                </svg>
                <span>Write</span>
              </button>
              <button type="button" class="blogger-tab-btn" data-subtab="details">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>Details & Cover</span>
              </button>
              <button type="button" class="blogger-tab-btn" data-subtab="preview">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <span>Live Preview</span>
              </button>
            </div>

            <!-- Tab 1: Write (Modular Blocks) -->
            <div id="bloggerPaneWrite" class="blogger-tab-pane">
              <div id="bloggerBlockStack" class="blogger-block-stack"></div>

              <!-- Add a Block trigger zone -->
              <div class="blogger-add-block-zone" id="bloggerOpenAddBlockBtn">
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: var(--accent-primary); font-weight: 600; font-size: 0.95rem;">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span>Add a Block</span>
                </div>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.3rem;">
                  Insert paragraph, heading, image, equation, code snippet, callout, table, or video
                </div>
              </div>
            </div>

            <!-- Tab 2: Details & Cover -->
            <div id="bloggerPaneDetails" class="blogger-tab-pane" style="display: none; max-width: 860px;">
              <div class="form-group" style="margin-bottom: 1.5rem;">
                <label class="form-label" for="bloggerCoverInput">Cover Image URL</label>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <input type="url" id="bloggerCoverInput" class="form-input" style="flex: 1;" placeholder="https://images.unsplash.com/... or upload below">
                  <label class="btn btn-secondary btn-sm" style="cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; white-space: nowrap; margin-bottom: 0; padding: 0.5rem 0.85rem;" title="Upload image directly to Cloudflare R2 storage">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span>Upload Image</span>
                    <input type="file" id="bloggerCoverFileInput" accept="image/*" style="display: none;" onchange="handleCoverFileUpload(event)">
                  </label>
                </div>
                <div id="bloggerCoverUploadStatus" style="font-size: 0.78rem; margin-top: 0.35rem; display: none;"></div>
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap; font-size: 0.75rem;">
                  <span style="color: var(--text-muted); align-self: center;">Scientific Presets:</span>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="setBloggerCoverPreset('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80')">Space / Cosmos</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="setBloggerCoverPreset('https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80')">Ancient Biology</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="setBloggerCoverPreset('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80')">AI Neural Net</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="setBloggerCoverPreset('https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80')">Lab Microscopy</button>
                </div>
                <!-- Live Cover Preview Box -->
                <div id="bloggerCoverPreviewBox" style="margin-top: 0.85rem; height: 160px; border-radius: 10px; overflow: hidden; border: 1px solid var(--border-color); background: rgba(0,0,0,0.03); display: flex; align-items: center; justify-content: center;">
                  <span style="color: var(--text-muted); font-size: 0.82rem;">Cover preview will appear here</span>
                </div>
              </div>

              <!-- Spotlight Feature Toggle -->
              <div class="form-group" style="display: flex; align-items: center; gap: 0.75rem; background: rgba(234, 88, 12, 0.08); padding: 0.9rem 1.15rem; border-radius: 10px; border: 1.5px solid rgba(234, 88, 12, 0.25); margin-bottom: 1.5rem;">
                <input type="checkbox" id="bloggerFeaturedInput" style="width: 20px; height: 20px; accent-color: var(--accent-primary); cursor: pointer;">
                <div>
                  <label for="bloggerFeaturedInput" style="font-weight: 700; font-size: 0.94rem; color: var(--text-primary); cursor: pointer; display: block; margin: 0;">
                    ★ Spotlight as Featured Publication (Shows in Big Card on Homepage)
                  </label>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">
                    When enabled, this publication will take the large spotlight position in the "From the Institute" section on the homepage.
                  </span>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="bloggerCategoryInput">Scientific Division / Category / Sector *</label>
                  <input type="text" id="bloggerCategoryInput" list="bloggerCategoryDatalist" class="form-input" placeholder="Select or type new category/sector..." value="Space & Astrophysics">
                  <datalist id="bloggerCategoryDatalist">
                    <option value="Space & Astrophysics">
                    <option value="Ancient Biology & Paleontology">
                    <option value="AI & Computational Science">
                    <option value="Astrobiology & Extremophiles">
                    <option value="Quantum Biophysics">
                    <option value="Exoplanetary Atmospheres">
                    <option value="Evolutionary Genomics">
                    <option value="Open Methods">
                  </datalist>
                </div>
                <div class="form-group">
                  <label class="form-label" for="bloggerSlugInput">URL Slug / Permalink</label>
                  <input type="text" id="bloggerSlugInput" class="form-input" placeholder="e.g. the-last-dance">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="bloggerAuthorsInput">Authors & Contributors</label>
                  <input type="text" id="bloggerAuthorsInput" class="form-input" placeholder="e.g. Harun Abdullah Rakin, Aria Rahman">
                </div>
                <div class="form-group">
                  <label class="form-label" for="bloggerDoiInput">DOI Identifier</label>
                  <input type="text" id="bloggerDoiInput" class="form-input" placeholder="10.5281/crii.2026.xxxx">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="bloggerSummaryInput">Summary / Excerpt *</label>
                <input type="text" id="bloggerSummaryInput" class="form-input" placeholder="Brief 1-2 sentence description for search and cards">
              </div>

              <div class="form-group">
                <label class="form-label" for="bloggerAbstractInput">Academic Abstract</label>
                <textarea id="bloggerAbstractInput" class="form-textarea" style="min-height: 80px;" placeholder="Formal scientific abstract..."></textarea>
              </div>

              <div class="form-group">
                <label class="form-label" for="bloggerTagsInput">Keywords / Tags (comma separated)</label>
                <input type="text" id="bloggerTagsInput" class="form-input" placeholder="Exoplanets, JWST, Deep Time">
              </div>
            </div>

            <!-- Tab 3: Live Reader Preview -->
            <div id="bloggerPanePreview" class="blogger-tab-pane" style="display: none;">
              <div id="bloggerReaderPreviewContainer" style="max-width: 820px; margin: 0 auto; background: var(--bg-surface); padding: 2rem; border-radius: 12px; border: 1px solid var(--border-color);"></div>
            </div>
          </div>
        </div>

      </div>

      
      <!-- =====================================================================
           TAB: RESEARCH DIVISIONS MANAGEMENT
           ===================================================================== -->
      <div id="tab-divisions" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Research Divisions Management</h1>
            <p>Create, edit, and organize the scientific research divisions displayed on the homepage and across the research repository.</p>
          </div>
          <button class="btn btn-primary" onclick="openDivisionModal()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>Add New Division</span>
          </button>
        </div>

        <div id="portalDivisionsList" class="divisions-manage-grid">
          <!-- Dynamically populated by portal.js -->
        </div>
      </div>

      <!-- =====================================================================
           TAB: WHO CAN JOIN US? (COHORT ADMISSIONS MANAGEMENT)
           ===================================================================== -->
      <div id="tab-cohorts" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Who Can Join Us? (Cohort Admissions)</h1>
            <p>Create, edit, and organize the admission and cohort profiles displayed on the homepage "Who can join us?" section.</p>
          </div>
          <button class="btn btn-primary" onclick="openCohortModal()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>Add New Profile</span>
          </button>
        </div>

        <div id="portalCohortsList" class="cohorts-manage-grid">
          <!-- Dynamically populated by portal.js -->
        </div>

        <!-- Fellowship Application Form Builder & Field Settings -->
        <div class="data-table-card" style="padding: 2rem; margin-top: 2rem;">
          <div class="portal-card-header" style="margin-bottom: 1.25rem;">
            <div class="portal-card-title-group">
              <h3 style="font-size: 1.15rem; font-weight: 700; display:flex; align-items:center; gap:0.5rem;">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
                <span>Fellowship Application Form Settings (team#apply)</span>
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
                Configure which fields appear on the fellowship application form, make any field optional or required, and add custom questions.
              </p>
            </div>
          </div>

          <form id="appFormSettingsForm" onsubmit="handleSaveAppFormSettings(event)">
            <!-- Standard Form Fields Toggles -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div class="form-group" style="background:var(--bg-secondary); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
                <div style="font-weight:600; margin-bottom:0.4rem;">University / Institution</div>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; margin-bottom:0.3rem; cursor:pointer;">
                  <input type="checkbox" id="fieldVis_university" checked> Show field
                </label>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; cursor:pointer;">
                  <input type="checkbox" id="fieldReq_university" checked> Required
                </label>
              </div>

              <div class="form-group" style="background:var(--bg-secondary); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
                <div style="font-weight:600; margin-bottom:0.4rem;">Field of Study / Major</div>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; margin-bottom:0.3rem; cursor:pointer;">
                  <input type="checkbox" id="fieldVis_fieldOfStudy" checked> Show field
                </label>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; cursor:pointer;">
                  <input type="checkbox" id="fieldReq_fieldOfStudy" checked> Required
                </label>
              </div>

              <div class="form-group" style="background:var(--bg-secondary); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
                <div style="font-weight:600; margin-bottom:0.4rem;">Preferred Research Division</div>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; margin-bottom:0.3rem; cursor:pointer;">
                  <input type="checkbox" id="fieldVis_division" checked> Show field (Dynamic Real Divisions)
                </label>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; cursor:pointer;">
                  <input type="checkbox" id="fieldReq_division" checked> Required
                </label>
              </div>

              <div class="form-group" style="background:var(--bg-secondary); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
                <div style="font-weight:600; margin-bottom:0.4rem;">Academic Level / Grade</div>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; margin-bottom:0.3rem; cursor:pointer;">
                  <input type="checkbox" id="fieldVis_academicLevel" checked> Show field (Dynamic Cohorts)
                </label>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; cursor:pointer;">
                  <input type="checkbox" id="fieldReq_academicLevel"> Required
                </label>
              </div>

              <div class="form-group" style="background:var(--bg-secondary); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
                <div style="font-weight:600; margin-bottom:0.4rem;">Portfolio / GitHub / ORCID</div>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; margin-bottom:0.3rem; cursor:pointer;">
                  <input type="checkbox" id="fieldVis_portfolio" checked> Show field
                </label>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; cursor:pointer;">
                  <input type="checkbox" id="fieldReq_portfolio"> Required
                </label>
              </div>

              <div class="form-group" style="background:var(--bg-secondary); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
                <div style="font-weight:600; margin-bottom:0.4rem;">Statement of Intent</div>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; margin-bottom:0.3rem; cursor:pointer;">
                  <input type="checkbox" id="fieldVis_statement" checked> Show field
                </label>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; cursor:pointer;">
                  <input type="checkbox" id="fieldReq_statement" checked> Required
                </label>
              </div>
            </div>

            <!-- Custom Questions Builder -->
            <div style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.75rem;">
                <div>
                  <h4 style="font-weight:600; margin-bottom:0.25rem;">Custom Questions & Additional Fields</h4>
                  <p style="font-size:0.8rem; color:var(--text-muted);">Add new fields such as Graduation Year, GPA, Discord Handle, or Weekly Availability.</p>
                </div>
                <button type="button" class="btn btn-secondary btn-sm" onclick="addCustomFormFieldRow()">
                  + Add Custom Question
                </button>
              </div>

              <div id="customFieldsBuilderList" style="display:flex; flex-direction:column; gap:0.75rem;">
                <!-- Populated by portal.js -->
              </div>
            </div>

            <div style="margin-top: 1.5rem; text-align:right;">
              <button type="submit" class="btn btn-primary" style="padding: 0.65rem 1.75rem;">
                Save Form Settings & Questions
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ====================================================================
           TAB: TEAM & FELLOWS ROSTER (Manage Interns & Core Team)
           ==================================================================== -->
      <div id="tab-roster" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Institute Roster & Core Team Management</h1>
            <p>Manage real core team members, student research fellows, profile photos, bios, roles, and socials.</p>
          </div>
          <button class="btn btn-primary" id="openAddResearcherBtn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>Add Researcher / Fellow</span>
          </button>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="data-table-card" style="padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap;">
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn btn-sm btn-secondary active" id="filterRosterAll" onclick="filterRosterList('all')">All Roster</button>
            <button class="btn btn-sm btn-secondary" id="filterRosterTeam" onclick="filterRosterList('team')">Core Leadership Team</button>
            <button class="btn btn-sm btn-secondary" id="filterRosterFellows" onclick="filterRosterList('fellows')">Research Fellows & Interns</button>
          </div>
          <div style="min-width: 240px; flex: 1; max-width: 360px;">
            <input type="text" id="searchRosterInput" class="form-input" placeholder="Search by name, role, or division..." style="padding: 0.45rem 0.85rem; font-size: 0.85rem;">
          </div>
        </div>

        <!-- Roster Cards Grid -->
        <div id="rosterCardsGrid" class="roster-grid"></div>
      </div>

      <!-- ====================================================================
           TAB 3: ADMISSIONS QUEUE
           ==================================================================== -->
      <div id="tab-interns" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Student Fellowship Admissions Queue</h1>
            <p>Review incoming student applications, evaluate statements, and enroll candidates.</p>
          </div>
        </div>

        <div class="data-table-card">
          <div class="table-toolbar">
            <h3 style="font-size: 1.15rem; color: var(--text-primary);">Incoming Applicants</h3>
          </div>
          <div class="table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Institution & Field</th>
                  <th>Preferred Division</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="portalAppsTbody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ====================================================================
           TAB 4: OPEN DATASETS
           ==================================================================== -->
      <div id="tab-datasets" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Open Datasets Repository Manager</h1>
            <p>Publish and curate reproducible scientific datasets for public download.</p>
          </div>
        </div>

        <!-- Add Dataset Form -->
        <div class="data-table-card" style="padding: 2rem; margin-bottom: 2rem;">
          <h3 style="font-size: 1.25rem; margin-bottom: 1.25rem; color: var(--text-primary);">Register New Dataset</h3>

          <form id="newDatasetForm">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="dsTitleInput">Dataset Title *</label>
                <input type="text" id="dsTitleInput" class="form-input" placeholder="e.g. Atmospheric Transmission Spectra Library" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="dsCategoryInput">Division *</label>
                <select id="dsCategoryInput" class="form-select" required>
                  <option value="Space & Astrophysics">Space & Astrophysics</option>
                  <option value="Ancient Biology & Paleontology">Ancient Biology & Paleontology</option>
                  <option value="AI & Computational Science">AI & Computational Science</option>
                  <option value="Astrobiology & Extremophiles">Astrobiology & Extremophiles</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="dsLeadInput">Lead Student Researcher *</label>
                <input type="text" id="dsLeadInput" class="form-input" placeholder="e.g. Aria Rahman" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="dsFormatInput">Format & Size</label>
                <div style="display:flex; gap:0.5rem;">
                  <input type="text" id="dsFormatInput" class="form-input" placeholder="CSV & HDF5">
                  <input type="text" id="dsSizeInput" class="form-input" placeholder="42.8 MB">
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="dsVersionInput">Version & License</label>
                <div style="display:flex; gap:0.5rem;">
                  <input type="text" id="dsVersionInput" class="form-input" placeholder="v1.0.0">
                  <input type="text" id="dsLicenseInput" class="form-input" placeholder="CC-BY 4.0 Open Science">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="dsParamsInput">Tracked Features (comma separated)</label>
                <input type="text" id="dsParamsInput" class="form-input" placeholder="Wavelength, Transit Depth, Flux Uncertainty">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="dsDescInput">Description & Calibration Notes *</label>
              <textarea id="dsDescInput" class="form-textarea" placeholder="Detail simulation parameters, observational instruments, and soft bounds..." required></textarea>
            </div>

            <div style="text-align: right;">
              <button type="submit" class="btn btn-primary" style="padding: 0.8rem 2.2rem;">
                Publish Dataset
              </button>
            </div>
          </form>
        </div>

        <div class="data-table-card">
          <div class="table-toolbar">
            <h3 style="font-size: 1.15rem; color: var(--text-primary);">Active Datasets</h3>
          </div>
          <div class="table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Dataset</th>
                  <th>Division</th>
                  <th>Version</th>
                  <th>Lead Researcher</th>
                  <th>License</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="portalDatasetsTbody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ====================================================================
           TAB 5: ACCESS CONTROL & PERMISSIONS (AUTZ WHITELIST)
           ==================================================================== -->
      <div id="tab-permissions" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Institute Access Control & Permissions</h1>
            <p>Strictly control which verified email accounts have permission to access the management portal.</p>
          </div>
        </div>

        <!-- Add Allowed Email Card -->
        <div class="data-table-card" style="padding: 2rem; margin-bottom: 2rem;">
          <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-primary);">Authorize New Account</h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
            When this user signs in with their email, they will be granted portal access with the specified role.
          </p>

          <form id="addAllowedUserForm">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="newAllowedEmail">Verified Gmail / Email *</label>
                <input type="email" id="newAllowedEmail" class="form-input" placeholder="colleague@gmail.com" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="newAllowedName">Full Name *</label>
                <input type="text" id="newAllowedName" class="form-input" placeholder="e.g. Dr. Jane Smith" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="newAllowedRole">Portal Permission Role *</label>
                <select id="newAllowedRole" class="form-select" required>
                  <option value="Research Fellow">Research Fellow (Publish Papers & View Data)</option>
                  <option value="Intern Coordinator">Intern Coordinator (Review & Accept Admissions)</option>
                  <option value="Institute Admin">Institute Admin (Full Management)</option>
                  <option value="Super Admin">Super Admin (All Privileges)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="newAllowedDivision">Assigned Division</label>
                <select id="newAllowedDivision" class="form-select">
                  <option value="Executive Council">Executive Council</option>
                  <option value="Astrophysics & Space Science">Astrophysics & Space Science</option>
                  <option value="Ancient Biology & Paleontology">Ancient Biology & Paleontology</option>
                  <option value="AI & Computational Science">AI & Computational Science</option>
                  <option value="Astrobiology & Extremophiles">Astrobiology & Extremophiles</option>
                </select>
              </div>
            </div>

            <div style="text-align: right; margin-top: 1rem;">
              <button type="submit" class="btn btn-primary" style="padding: 0.75rem 2rem;">
                Add to Whitelist
              </button>
            </div>
          </form>
        </div>

        <!-- Whitelist Table -->
        <div class="data-table-card">
          <div class="table-toolbar">
            <h3 style="font-size: 1.15rem; color: var(--text-primary);">Authorized Users Whitelist</h3>
          </div>
          <div class="table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>User & Email</th>
                  <th>Permission Role</th>
                  <th>Division</th>
                  <th>Added Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="allowedUsersTbody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ====================================================================
           TAB 6: INSTITUTE & APPEARANCE SETTINGS
           ==================================================================== -->
      
      <!-- ====================================================================
           TAB: RESEARCHER CUSTOM EMAILS (IMPROVMX)
           ==================================================================== -->
      <div id="tab-aliases" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Researcher Custom Emails & Forwarding</h1>
            <p>Provide and manage custom verified @domain email aliases for institute researchers, forwarding seamlessly to their personal Gmail accounts via ImprovMX.</p>
          </div>
          <div style="display: flex; gap: 0.65rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary btn-sm" id="openManageKeysBtn" onclick="window.openManageKeysModal()" title="Manage ImprovMX API Keys">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              <span>API Keys & Accounts</span>
            </button>
            <button type="button" class="btn btn-secondary btn-sm" id="refreshAliasesBtn" onclick="window.refreshAliasesData()" title="Sync ImprovMX status">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
              <span>Refresh Status</span>
            </button>
            <button type="button" class="btn btn-primary" id="openCreateAliasBtn" onclick="window.openProvisionAliasModal()">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Provision Email Alias</span>
            </button>
          </div>
        </div>

        <!-- Domain Overview & Health Stats -->
        <div class="portal-grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
          <!-- Active Domain Card -->
          <div class="card" style="padding: 1.25rem;">
            <div style="font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700; margin-bottom: 0.4rem;">
              Active Domain Scope
            </div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <select id="improvmxDomainSelect" class="form-input" style="padding: 0.4rem 0.65rem; font-weight: 600; font-size: 0.92rem;"></select>
            </div>
            <div id="improvmxAccountEmail" style="font-size: 0.74rem; color: var(--text-muted); margin-top: 0.45rem;">
              Connected via ImprovMX
            </div>
          </div>

          <!-- DNS MX Health Card -->
          <div class="card" style="padding: 1.25rem;">
            <div style="font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700; margin-bottom: 0.4rem;">
              Mail Exchange (MX) Status
            </div>
            <div id="improvmxMxStatus">
              <span class="status-chip published">✓ MX Records Active</span>
            </div>
            <div id="improvmxMxDetails" style="font-size: 0.74rem; color: var(--text-muted); margin-top: 0.45rem;">
              Relaying mail via ImprovMX clusters
            </div>
          </div>

          <!-- SPF / Delivery Health Card -->
          <div class="card" style="padding: 1.25rem;">
            <div style="font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700; margin-bottom: 0.4rem;">
              SPF & DMARC Status
            </div>
            <div id="improvmxSpfStatus">
              <span class="status-chip published">✓ SPF Valid</span>
            </div>
            <div id="improvmxSpfDetails" style="font-size: 0.74rem; color: var(--text-muted); margin-top: 0.45rem;">
              v=spf1 include:spf.improvmx.com ~all
            </div>
          </div>

          <!-- Plan Quota Card -->
          <div class="card" style="padding: 1.25rem;">
            <div style="font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700; margin-bottom: 0.4rem;">
              Aliases Allocation
            </div>
            <div style="display: flex; align-items: baseline; gap: 0.5rem;">
              <span id="improvmxAliasCount" style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">0</span>
              <span id="improvmxAliasLimit" style="font-size: 0.9rem; color: var(--text-muted);">/ 25 Used</span>
            </div>
            <div id="improvmxPlanTier" style="font-size: 0.74rem; color: var(--accent-primary, #ea580c); font-weight: 600; margin-top: 0.35rem;">
              ImprovMX Free Tier
            </div>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="data-table-card portal-filter-card" style="margin-bottom: 1.25rem;">
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Filter:</span>
            <button type="button" class="btn btn-sm btn-secondary active" id="filterAliasesAll" onclick="window.filterAliasesList('all')">All Aliases</button>
            <button type="button" class="btn btn-sm btn-secondary" id="filterAliasesFellows" onclick="window.filterAliasesList('fellows')">Verified Fellows</button>
            <button type="button" class="btn btn-sm btn-secondary" id="filterAliasesCustom" onclick="window.filterAliasesList('custom')">Catch-all / Other</button>
          </div>
          <div style="min-width: 220px; flex: 1; max-width: 400px;">
            <input type="text" id="searchAliasesInput" class="form-input" placeholder="Search by alias or destination Gmail..." style="padding: 0.45rem 0.85rem; font-size: 0.85rem;">
          </div>
        </div>

        <!-- Aliases Table & Mobile Cards -->
        <div class="data-table-card">
          <!-- Desktop Table -->
          <div class="table-wrapper portal-aliases-desktop-table">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Custom Email Alias</th>
                  <th>Forward Destination (Gmail)</th>
                  <th>Assigned Fellow / Scope</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th style="text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody id="improvmxAliasesTbody">
                <tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">Loading email aliases...</td></tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards Grid -->
          <div id="improvmxAliasesMobileGrid" class="portal-aliases-mobile-grid"></div>
        </div>
      </div>

      <div id="tab-settings" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Institute & Appearance Settings</h1>
            <p>Configure the homepage hero video, backdrop blur, overlay darkness, navbar title, and single sign-on settings.</p>
          </div>
        </div>

        <div class="portal-settings-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 1.5rem; max-width: 1040px; width: 100%;">
          <!-- 1. Hero Section Appearance, Multi-Image Background & Typography Engine -->
          <div class="data-table-card" style="padding: 2rem;">
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-primary);">Hero Section Appearance & Engine</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
              Customize the hero title font family, configure a pool of background images (a random one displays on load), and set opacity.
            </p>

            <form id="heroAppearanceForm">

              <!-- Hero Media Display & Selection Options -->
              <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div class="form-group">
                  <label class="form-label" for="settingHeroMediaType" style="font-weight: 600;">Media Display Type</label>
                  <select id="settingHeroMediaType" class="form-input">
                    <option value="both">Video + Image (Mixed)</option>
                    <option value="image">Image Only</option>
                    <option value="video">Video Only</option>
                  </select>
                  <span style="font-size: 0.72rem; color: var(--text-muted); display: block; margin-top: 0.25rem;">
                    Display background images, ambient video, or both.
                  </span>
                </div>
                <div class="form-group">
                  <label class="form-label" for="settingHeroSelectionMode" style="font-weight: 600;">Selection Behavior</label>
                  <select id="settingHeroSelectionMode" class="form-input">
                    <option value="random">Random on Load (Shuffles on each reload)</option>
                    <option value="fixed">Fixed (Always show selected / pinned media)</option>
                  </select>
                  <span style="font-size: 0.72rem; color: var(--text-muted); display: block; margin-top: 0.25rem;">
                    Random rotates on visit; Fixed shows the chosen pinned one.
                  </span>
                </div>
              </div>

              <!-- Font Selection -->
              <div class="form-group" style="margin-bottom: 1.5rem;">
                <label class="form-label" for="settingHeroFontFamily">Hero Title Font Family</label>
                <select id="settingHeroFontFamily" class="form-input">
                  <option value="Eyekons">Eyekons (Modern Tech Display - Default)</option>
                  <option value="Playfair Display">Playfair Display (Editorial Serif)</option>
                  <option value="Cinzel Decorative">Cinzel Decorative (Classical Royal / Sci-Fi)</option>
                  <option value="Space Grotesk">Space Grotesk (Tech Monospace-Feel)</option>
                  <option value="Syne">Syne (Geometric Avant-Garde)</option>
                  <option value="Outfit">Outfit (Ultra-Clean Geometric Sans)</option>
                  <option value="system-ui">System Sans (Clean Neutral Sans)</option>
                </select>
                <span style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-top: 0.3rem;">
                  Controls the primary headline typography on the homepage hero section.
                </span>
              </div>

              <!-- Multi-Image Background Pool -->
              <div class="form-group" style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                  <label class="form-label" style="margin: 0;">Background Images Pool (Random on Load)</label>
                  <span id="heroImagesCountBadge" style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 700;">0 Images</span>
                </div>
                <p style="font-size: 0.74rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                  Every time a visitor opens or reloads the homepage, one image is randomly selected from this pool.
                </p>

                <!-- Thumbnail Grid -->
                <div id="heroImagesListContainer" class="hero-images-manage-grid">
                  <!-- Rendered dynamically via JS -->
                </div>

                
                <!-- Add New Image URL or Upload File -->
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
                  <input type="url" id="newHeroImageUrl" class="form-input" placeholder="Paste image URL (https://...)" style="flex: 1; min-width: 180px;">
                  <button type="button" class="btn btn-secondary" onclick="addHeroImageFromInput()" style="white-space: nowrap; padding: 0.5rem 1rem;">
                    + Add URL
                  </button>
                  <input type="file" id="heroImageUploadInput" accept="image/*" style="display: none;" onchange="handleHeroImageUpload(event)">
                  <button type="button" class="btn btn-secondary" onclick="document.getElementById('heroImageUploadInput').click()" style="white-space: nowrap; padding: 0.5rem 1rem;">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.35rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span>Upload Image</span>
                  </button>
                </div>
                <div id="heroImageUploadStatus" style="font-size: 0.75rem; color: var(--accent-primary); margin-top: 0.35rem; display: none;"></div>


                <!-- Quick Presets -->
                <div style="display: flex; gap: 0.4rem; margin-top: 0.6rem; flex-wrap: wrap; font-size: 0.72rem;">
                  <span style="color: var(--text-muted); align-self: center;">Quick Presets:</span>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="addHeroImagePreset('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=85')">+ Deep Stars</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="addHeroImagePreset('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=85')">+ Earth Blue</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="addHeroImagePreset('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=85')">+ Cosmos Glow</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="addHeroImagePreset('https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=85')">+ Orbit View</button>
                </div>
              </div>

              <!-- Image Opacity Slider -->
              <div class="form-group" style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                  <label class="form-label" for="settingHeroImageOpacity" style="margin: 0;">Background Image Visibility (Opacity)</label>
                  <span id="heroImageOpacityValueBadge" style="font-weight: 700; color: var(--accent-primary); font-size: 0.88rem;">40%</span>
                </div>
                <input type="range" id="settingHeroImageOpacity" min="10" max="90" step="5" value="40" style="width: 100%; accent-color: var(--accent-primary);">
                <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted);">
                  <span>10% (Subtle Glow)</span>
                  <span>40% (Balanced)</span>
                  <span>90% (Vivid Photo)</span>
                </div>
              </div>

              <!-- Multi-Video Background Pool -->
              <div class="form-group" style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                  <label class="form-label" style="margin: 0; font-weight: 600;">Background Videos Pool</label>
                  <span id="heroVideosCountBadge" style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 700;">0 Videos</span>
                </div>
                <p style="font-size: 0.74rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                  When Video mode is active, one video is played (randomly on visit, or the pinned ★ video). While the video is buffering, a random image is displayed and smoothly fades out once the video begins.
                </p>

                <!-- Video Chips Grid -->
                <div id="heroVideosListContainer" class="hero-videos-manage-grid">
                  <!-- Rendered dynamically via JS -->
                </div>

                <!-- Add New Video URL or Upload File -->
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
                  <input type="url" id="newHeroVideoUrl" class="form-input" placeholder="Paste video URL (https://... or .mp4 / .webm)" style="flex: 1; min-width: 180px;">
                  <button type="button" class="btn btn-secondary" onclick="addHeroVideoFromInput()" style="white-space: nowrap; padding: 0.5rem 1rem;">
                    + Add Video URL
                  </button>
                  <input type="file" id="heroVideoUploadInput" accept="video/mp4,video/webm" style="display: none;" onchange="handleHeroVideoUpload(event)">
                  <button type="button" class="btn btn-secondary" onclick="document.getElementById('heroVideoUploadInput').click()" style="white-space: nowrap; padding: 0.5rem 1rem;">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.35rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span>Upload Video</span>
                  </button>
                </div>
                <div id="heroVideoUploadStatus" style="font-size: 0.75rem; color: var(--accent-primary); margin-top: 0.35rem; display: none;"></div>

                <!-- Quick Video Presets -->
                <div style="display: flex; gap: 0.4rem; margin-top: 0.6rem; flex-wrap: wrap; font-size: 0.72rem;">
                  <span style="color: var(--text-muted); align-self: center;">Quick Video Presets:</span>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="addHeroVideoPreset('assets/hero-bg.mp4')">+ Local Cosmos</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="addHeroVideoPreset('https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4')">+ Deep Stars</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="addHeroVideoPreset('https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-starfield-in-space-41539-large.mp4')">+ Starfield Warp</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="addHeroVideoPreset('https://assets.mixkit.co/videos/preview/mixkit-planet-earth-rotating-in-space-39982-large.mp4')">+ Earth Orbit</button>
                </div>
              </div>

              <!-- Video Sound / Audio Option -->
              <div class="form-group" style="margin-bottom: 1.5rem; background: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.20); border-radius: 12px; padding: 1rem 1.25rem;">
                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; margin: 0; font-weight: 700; color: var(--text-primary);">
                  <input type="checkbox" id="settingHeroSoundEnabled" style="width: 18px; height: 18px; accent-color: var(--accent-primary);">
                  <span>Enable Video Audio (Sound Support)</span>
                </label>
                <p style="font-size: 0.74rem; color: var(--text-muted); margin: 0.35rem 0 0 2rem;">
                  Allows visitors to hear video soundtrack. Videos start muted to comply with browser autoplay policies, with an interactive sound toggle pill that automatically un-mutes on user interaction.
                </p>
              </div>

              <!-- Blur & Overlay Settings -->
              <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div class="form-group">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                    <label class="form-label" for="settingHeroBlur" style="margin: 0;">Backdrop Blur</label>
                    <span id="heroBlurValueBadge" style="font-weight: 700; color: var(--accent-primary); font-size: 0.88rem;">12px</span>
                  </div>
                  <input type="range" id="settingHeroBlur" min="0" max="30" step="1" value="12" style="width: 100%; accent-color: var(--accent-primary);">
                </div>
                <div class="form-group">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                    <label class="form-label" for="settingHeroOverlay" style="margin: 0;">Overlay Darkness</label>
                    <span id="heroOverlayValueBadge" style="font-weight: 700; color: var(--accent-primary); font-size: 0.88rem;">55%</span>
                  </div>
                  <input type="range" id="settingHeroOverlay" min="10" max="90" step="5" value="55" style="width: 100%; accent-color: var(--accent-primary);">
                </div>
              </div>

              <!-- Real-time Live Preview of Hero Font & Background Image -->
              <div style="margin-top: 1.5rem;">
                <label class="form-label">Live Hero Preview</label>
                <div id="heroLivePreviewStage" class="hero-preview-stage" style="background-image: url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80'); background-size: cover; background-position: center; min-height: 140px; border-radius: 8px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                  <div id="heroLivePreviewOverlay" class="hero-preview-overlay" style="position: absolute; inset: 0; background: rgba(5, 7, 15, 0.40); display: flex; align-items: center; justify-content: center;">
                    <div style="text-align: center; padding: 1.5rem; position: relative; z-index: 2;">
                      <div id="heroLivePreviewTitle" style="font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; font-family: 'Eyekons', sans-serif; color: #ffffff;">
                        Bring structure<br>to your research.
                      </div>
                      <div style="font-size: 0.75rem; opacity: 0.85; margin-top: 0.4rem; color: #e2e8f0;">
                        Turning Curiosity into Action.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style="margin-top: 1.5rem; text-align: right;">
                <button type="submit" class="btn btn-primary" style="padding: 0.75rem 2rem;">
                  Save Hero Settings
                </button>
              </div>
            </form>
          </div>

          <!-- 2. Institute Branding & Navbar Settings -->
          <div class="data-table-card" style="padding: 2rem;">
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-primary);">Branding & Navbar</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
              Customize title text, logo emblem, and single sign-on app credentials.
            </p>

            <form id="instituteSettingsForm">
              <div class="form-group">
                <label class="form-label" for="settingNavbarTitle">Navbar Title *</label>
                <input type="text" id="settingNavbarTitle" class="form-input" required>
                <span style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.2rem;">
                  Default: <strong>Curiomas Research & Innovation Institute</strong>
                </span>
              </div>

              <div class="form-group">
                <label class="form-label" for="settingLogoUrl">Institute Logo Image URL (Optional)</label>
                <input type="url" id="settingLogoUrl" class="form-input" placeholder="https://example.com/logo.png">
                <span style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.2rem;">
                  Replaces the default quantum vector emblem in the navbar.
                </span>
              </div>

              <div class="form-group">
                <label class="form-label" for="settingAutzAppId">Single Sign-On App ID</label>
                <input type="text" id="settingAutzAppId" class="form-input" placeholder="gqiqh6qia">
                <span style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.2rem;">
                  Registered application identifier for institute Single Sign-On.
                </span>
              </div>

              <div style="margin-top: 1.75rem; text-align: right;">
                <button type="submit" class="btn btn-primary" style="padding: 0.75rem 2rem;">
                  Save Branding
                </button>
              </div>
            </form>
          </div>

          <!-- 3. Festive Themes & Seasonal Effects Engine -->
          <div class="data-table-card" style="padding: 2rem;">
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
              <span>🎨</span>
              <span>Festive Themes & Global Seasonal Effects</span>
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
              Enable celebratory, vibrant themes behind website content sections. Managed exclusively by administrators to effect all visitors globally.
            </p>

            <form id="festiveSettingsForm">
              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label class="form-label" for="settingFestiveTheme">Active Festive Theme</label>
                <select id="settingFestiveTheme" class="form-input">
                  <option value="holi">🎨 Holi (Festival of Colors & Multi-Color Paint Splatters)</option>
                  <option value="christmas">❄️ Christmas (Winter Snowfall, Frost & Pine Gold Glow)</option>
                  <option value="cherry-blossom">🌸 Cherry Blossom (Sakura Petals & Spring Rose Aura)</option>
                  <option value="eid">🌙 Eid (Crescent Moon, Golden Stars & Emerald Aurora)</option>
                  <option value="festival">🎉 Festival / Carnival (Celebratory Confetti & Ribbons)</option>
                </select>
                <span style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-top: 0.3rem;">
                  Choose the visual experience rendered behind cards and content across the website.
                </span>
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label class="form-label" for="settingFestiveMode">Festive Status Mode</label>
                <select id="settingFestiveMode" class="form-input">
                  <option value="always">Always Active (Force ON for all visitors)</option>
                  <option value="auto">Auto-Detect (Active dynamically during festival dates)</option>
                  <option value="disabled">Disabled (Clean scientific default)</option>
                </select>
                <span style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-top: 0.3rem;">
                  "Always Active" enables the selected theme year-round. "Auto-Detect" turns it on during seasonal dates.
                </span>
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                  <label class="form-label" for="settingFestiveIntensity" style="margin: 0;">Effect Vibrancy & Intensity</label>
                  <span id="festiveIntensityBadge" style="font-weight: 700; color: var(--accent-primary); font-size: 0.88rem;">70%</span>
                </div>
                <input type="range" id="settingFestiveIntensity" min="20" max="100" step="5" value="70" style="width: 100%; accent-color: var(--accent-primary);">
                <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted);">
                  <span>20% (Subtle Glow)</span>
                  <span>70% (Balanced Vibrancy)</span>
                  <span>100% (Maximum Richness)</span>
                </div>
              </div>

              <!-- Live Preview of Frosted Card on Festive Theme -->
              <div style="margin-top: 1.5rem;">
                <label class="form-label">Live Appearance Preview</label>
                <div id="festiveLivePreviewStage" style="position: relative; overflow: hidden; min-height: 145px; border-radius: 8px; background: #070a13; padding: 1.25rem; display: flex; align-items: center; justify-content: center;">
                  <!-- Dynamic Preview Layer -->
                  <div id="previewSplatterLayer" style="position: absolute; inset: 0; pointer-events: none; opacity: 0.7; overflow: hidden;">
                    <!-- Rendered via JS based on selected theme -->
                  </div>
                  <!-- Frosted Sample Card -->
                  <div style="position: relative; z-index: 2; background: rgba(14, 20, 36, 0.75); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 10px; padding: 1rem 1.5rem; text-align: center; max-width: 300px; box-shadow: 0 10px 25px rgba(0,0,0,0.4);">
                    <div id="previewCardTitle" style="font-size: 0.9rem; font-weight: 700; color: #ffffff;">Festival of Colors</div>
                    <div id="previewCardDesc" style="font-size: 0.74rem; color: #cbd5e1; margin-top: 0.2rem;">Vibrant paint splatters and particles glow behind cards.</div>
                  </div>
                </div>
              </div>

              <div style="margin-top: 1.5rem; text-align: right;">
                <button type="submit" class="btn btn-primary" style="padding: 0.75rem 2rem;">
                  Save Festive Settings
                </button>
              </div>
            </form>
          </div>

          <!-- 3. EmailJS Dispatch Configuration -->
          <div class="data-table-card" style="padding: 2rem;">
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span>EmailJS & Mail Dispatches</span>
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
              Set your EmailJS Template ID so you can dispatch emails directly to applicants, fellows, and users.
            </p>

            <form id="emailjsSettingsForm">
              <div class="form-group">
                <label class="form-label">Connected Gmail Account</label>
                <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); padding: 0.5rem 0.75rem; background: var(--bg-surface); border-radius: 6px; border: 1px solid var(--border-color);">
                  curiomas.members@gmail.com (Service ID: <code>curiomas</code>)
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="settingEmailjsTemplateId" style="display:flex; justify-content:space-between; align-items:center;">
                  <span>EmailJS Template ID *</span>
                  <a href="https://dashboard.emailjs.com/admin/templates" target="_blank" rel="noopener" style="font-size: 0.75rem; color: var(--accent-primary); text-decoration: underline;">
                    Find / Create Template &rarr;
                  </a>
                </label>
                <input type="text" id="settingEmailjsTemplateId" class="form-input" placeholder="e.g. your_emailjs_template_id" required>
                <span style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.35rem; display: block; line-height: 1.4;">
                  Find your Template ID at <a href="https://dashboard.emailjs.com/admin/templates" target="_blank" style="color:var(--accent-primary); text-decoration:underline;">EmailJS Dashboard &gt; Email Templates</a>. If you haven't created a template yet, click "Create New Template" and copy its ID.
                </span>
              </div>

              <div style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; background: rgba(234, 88, 12, 0.06); padding: 0.75rem; border-radius: 6px; margin-top: 1rem;">
                <strong>Template Variables in EmailJS:</strong><br>
                In your EmailJS template content, you can use: <code>{{to_email}}</code>, <code>{{to_name}}</code>, <code>{{subject}}</code>, <code>{{message}}</code>, <code>{{reply_to}}</code>.
              </div>

              <div style="margin-top: 1.5rem; text-align: right;">
                <button type="submit" class="btn btn-primary" style="padding: 0.75rem 2rem;">
                  Save Template ID
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- ====================================================================
           TAB: MEDIA & R2 STORAGE MANAGER
           ==================================================================== -->
      <div id="tab-storage" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar">
          <div class="portal-title-block">
            <h1>Image & Video Storage Manager</h1>
            <p>Cloudflare R2 Bucket Object Catalog — Upload, inspect, manage, and delete images and videos.</p>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm" id="refreshStorageBtn" onclick="renderStorageTab()">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span>Refresh R2</span>
            </button>
            <button class="btn btn-primary btn-sm" onclick="document.getElementById('storageFileInput').click()">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span>Upload Media</span>
            </button>
            <input type="file" id="storageFileInput" style="display: none;" accept="image/*,video/mp4,video/webm" multiple onchange="handleStorageFileUpload(event)">
          </div>
        </div>

        <!-- Metrics Cards -->
        <div class="portal-stats-grid" style="margin-bottom: 2rem;">
          <div class="stat-card">
            <div class="stat-icon-wrapper" style="background: rgba(234, 88, 12, 0.1); color: #ea580c;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Total Stored Objects</span>
              <span class="stat-value" id="storageTotalCount">0</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper" style="background: rgba(16,185,129,0.1); color: #10b981;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Storage Used</span>
              <span class="stat-value" id="storageTotalSize">0 MB</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper" style="background: rgba(245,158,11,0.1); color: #f59e0b;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Video Files</span>
              <span class="stat-value" id="storageVideoCount">0</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper" style="background: rgba(139,92,246,0.1); color: #8b5cf6;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m10 15 5-3-5-3v6Z"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Image Files</span>
              <span class="stat-value" id="storageImageCount">0</span>
            </div>
          </div>
        </div>

        <!-- Filter & Search Bar + Drag & Drop Area -->
        <div class="data-table-card" style="padding: 1.25rem 1.5rem; margin-bottom: 1.5rem;">
          <div style="display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap;">
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <button class="btn btn-sm btn-primary storage-filter-btn active" data-filter="all" onclick="filterStorageMedia('all')">All Media</button>
              <button class="btn btn-sm btn-secondary storage-filter-btn" data-filter="image" onclick="filterStorageMedia('image')">Images</button>
              <button class="btn btn-sm btn-secondary storage-filter-btn" data-filter="video" onclick="filterStorageMedia('video')">Videos</button>
            </div>

            <div class="search-input-group" style="max-width: 380px; flex: 1;">
              <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input type="text" id="storageSearchInput" class="search-input" placeholder="Search filenames, extensions, or keys..." oninput="handleStorageSearch(this.value)">
            </div>
          </div>

          <!-- Drag & Drop Zone -->
          <div id="storageDropzone" class="storage-dropzone" style="margin-top: 1.25rem; border: 2px dashed var(--border-color); border-radius: 12px; padding: 2rem 1.5rem; text-align: center; background: var(--bg-surface); cursor: pointer; transition: all 0.2s ease;">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="var(--accent-primary, #ea580c)" stroke-width="1.8" style="margin-bottom: 0.65rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">Drag and drop files here, or click to upload</div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">Supports PNG, JPG, WEBP, SVG, GIF images and MP4, WEBM videos (Up to 100MB per file)</div>
          </div>
        </div>

        <!-- Media Grid Container -->
        <div id="storageMediaGrid" class="storage-media-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <!-- Dynamically populated -->
        </div>
      </div>

      <!-- ====================================================================
           TAB: CLOUDFLARE D1 SQL STUDIO & DB SCHEMA EXPLORER
           Direct SQL console & AI Bulk Data Prompt Generator
           ==================================================================== -->
      <div id="tab-sql" class="portal-tab-content" style="display:none;">
        <div class="portal-topbar" style="margin-top: 0.25rem;">
          <div class="portal-title-block">
            <h1 style="line-height: 1.25;">Cloudflare D1 SQL Studio & Schema</h1>
            <p>Direct query console for <code>crii-production-db</code> — inspect live table schemas, run raw SQL queries, and generate bulk data prompts for AI.</p>
          </div>
          <div style="display: flex; gap: 0.65rem; align-items: center; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary btn-sm" id="sqlRefreshSchemaBtn" onclick="window.loadSqlSchema()">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span>Refresh Schema</span>
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.copyAiPrompt('fullSchemaPrompt')" title="Copy complete database schema and rules to paste into ChatGPT/Claude">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span>Copy Full Schema for AI</span>
            </button>
            <button type="button" class="btn btn-primary btn-sm" onclick="window.runSqlQuery()">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>Execute SQL (Ctrl+Enter)</span>
            </button>
          </div>
        </div>

        <!-- AI Bulk Data Generation Banner -->
        <div class="sql-ai-banner" style="margin-bottom: 1.5rem;">
          <div style="display: flex; gap: 1rem; align-items: center;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(234, 88, 12, 0.15); color: #ea580c; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            </div>
            <div>
              <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">AI Bulk Data Importer & Prompt Generator</div>
              <div style="font-size: 0.82rem; color: var(--text-muted);">
                Need to add multiple articles, publications, or research fellows? Copy the schema prompt below, paste your raw data to any AI (ChatGPT, Claude, Gemini), and execute the generated SQL here.
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-sm btn-secondary" onclick="window.copyAiPrompt('bulkArticles')">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span>Prompt: Bulk Articles</span>
            </button>
            <button type="button" class="btn btn-sm btn-secondary" onclick="window.copyAiPrompt('bulkResearchers')">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span>Prompt: Bulk Researchers</span>
            </button>
          </div>
        </div>

        <!-- Main Studio Grid: Left Schema Explorer, Right Query Console -->
        <div class="sql-studio-grid">
          <!-- Left: Schema Explorer Sidebar -->
          <div class="sql-sidebar-card">
            <div class="sql-sidebar-header">
              <div class="sql-sidebar-title">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ea580c" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>
                <span>Live D1 Tables</span>
              </div>
              <span id="sqlTableCountBadge" class="sql-table-badge">0 Tables</span>
            </div>
            <div id="sqlTableListContainer" class="sql-table-list">
              <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.82rem;">Loading database schema...</div>
            </div>
            <!-- Selected Table Detail / Quick Actions -->
            <div id="sqlSelectedTableInfo" style="padding: 1rem; border-top: 1px solid var(--border-color); background: var(--bg-primary); display: none;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span id="sqlSelectedTableName" style="font-weight: 700; font-family: monospace; font-size: 0.85rem; color: var(--accent-primary);"></span>
                <span id="sqlSelectedTableRowCount" class="sql-table-badge"></span>
              </div>
              <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                <button type="button" class="btn btn-xs btn-secondary" onclick="window.insertSqlPreset('selectFromSelected')">SELECT *</button>
                <button type="button" class="btn btn-xs btn-secondary" onclick="window.insertSqlPreset('countSelected')">COUNT</button>
                <button type="button" class="btn btn-xs btn-secondary" onclick="window.copySelectedTableDdl()">Copy DDL</button>
              </div>
            </div>
          </div>

          <!-- Right: SQL Console & Results -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem; min-width: 0;">
            <!-- Console Box -->
            <div class="sql-console-card">
              <div class="sql-toolbar">
                <div class="sql-presets-group">
                  <span style="font-size: 0.76rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Presets:</span>
                  <button type="button" class="sql-preset-chip" onclick="window.insertSqlPreset('selectPosts')">Posts (20)</button>
                  <button type="button" class="sql-preset-chip" onclick="window.insertSqlPreset('selectInterns')">Researchers</button>
                  <button type="button" class="sql-preset-chip" onclick="window.insertSqlPreset('tableCounts')">All Row Counts</button>
                  <button type="button" class="sql-preset-chip" onclick="window.insertSqlPreset('templateInsertPost')">+ Insert Post</button>
                  <button type="button" class="sql-preset-chip" onclick="window.insertSqlPreset('templateInsertIntern')">+ Insert Fellow</button>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <button type="button" class="btn btn-xs btn-secondary" onclick="window.formatSqlQuery()" title="Format SQL query">Format</button>
                  <button type="button" class="btn btn-xs btn-secondary" onclick="window.clearSqlEditor()" title="Clear editor">Clear</button>
                </div>
              </div>

              <!-- Monospace Editor Wrapper -->
              <div class="sql-editor-wrapper">
                <div class="sql-editor-header">
                  <div class="sql-editor-dots">
                    <span class="sql-editor-dot" style="background: #ef4444;"></span>
                    <span class="sql-editor-dot" style="background: #f59e0b;"></span>
                    <span class="sql-editor-dot" style="background: #10b981;"></span>
                  </div>
                  <span style="font-size: 0.75rem; color: #94a3b8; font-family: monospace;">crii-production-db (Cloudflare D1 SQLite)</span>
                </div>
                <textarea id="sqlQueryInput" class="sql-editor-textarea" spellcheck="false" placeholder="-- Enter SQL query or bulk INSERT statements here...
-- Example: SELECT * FROM posts ORDER BY date DESC LIMIT 10;
-- Keyboard Shortcut: Press Ctrl + Enter (or Cmd + Enter) to execute."></textarea>
              </div>

              <!-- Execution Status Bar -->
              <div class="sql-status-bar">
                <div id="sqlExecutionStatus" class="sql-status-badge">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background: #94a3b8;"></span>
                  <span>Ready. Press Ctrl+Enter to execute.</span>
                </div>
                <button type="button" class="btn btn-primary btn-sm" id="sqlExecuteBtn" onclick="window.runSqlQuery()">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  <span>Execute SQL</span>
                </button>
              </div>
            </div>

            <!-- Error Display Card (Hidden by default) -->
            <div id="sqlErrorContainer" style="display: none; background: #fef2f2; border: 1px solid #fecaca; border-radius: 14px; padding: 1.25rem 1.5rem; color: #b91c1c;">
              <div style="font-weight: 700; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.5rem;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>SQL Execution Error</span>
              </div>
              <div id="sqlErrorMessage" style="font-family: monospace; font-size: 0.85rem; white-space: pre-wrap; word-break: break-all;"></div>
            </div>

            <!-- Results Card -->
            <div id="sqlResultsCard" class="sql-results-card" style="display: none;">
              <div class="sql-results-header">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">Query Results</span>
                  <span id="sqlResultsSummary" class="sql-table-badge" style="background: rgba(16, 185, 129, 0.1); color: #10b981; font-weight: 700;"></span>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <button type="button" class="btn btn-xs btn-secondary" onclick="window.exportSqlResultsToCsv()">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    <span>Export CSV</span>
                  </button>
                  <button type="button" class="btn btn-xs btn-secondary" onclick="window.copySqlResultsJson()">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    <span>Copy JSON</span>
                  </button>
                </div>
              </div>
              <div id="sqlResultsTableContainer" class="sql-results-table-container">
                <!-- Dynamically populated table -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  
  <!-- ====================================================================
       IMPROVMX EMAIL ALIAS MANAGER MODALS
       ==================================================================== -->

  <!-- Modal 1: Provision Email Alias -->
  <div id="provisionAliasModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 520px;">
      <div class="modal-header">
        <h3 class="modal-title">Provision Researcher Email Alias</h3>
        <button type="button" class="modal-close" onclick="window.closeProvisionAliasModal()">&times;</button>
      </div>
      <form id="provisionAliasForm" onsubmit="window.handleProvisionAliasSubmit(event)">
        <div class="modal-body">
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.2rem;">
            Assign an official institute email handle that automatically forwards all incoming mail directly to the researcher's personal Gmail.
          </p>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Target Domain *</label>
            <select id="provDomainSelect" class="form-input" required></select>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Email Alias Handle *</label>
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <input type="text" id="provAliasInput" class="form-input" placeholder="e.g. harun, research, or first.last" required style="font-family: monospace;">
              <span id="provDomainSuffix" style="font-weight: 600; color: var(--text-muted); font-size: 0.88rem; white-space: nowrap;">@domain</span>
            </div>
            <small style="font-size: 0.74rem; color: var(--text-muted); margin-top: 0.25rem; display: block;">Use lowercase letters, numbers, hyphens, dots, or * for catch-all.</small>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Quick Pick from Active Fellows / Team (Optional)</label>
            <select id="provFellowSelect" class="form-input" onchange="window.handleFellowSelect(this.value)">
              <option value="">-- Choose fellow to auto-fill Gmail --</option>
            </select>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Forwarding Destination (Gmail / Personal Email) *</label>
            <input type="email" id="provForwardInput" class="form-input" placeholder="researcher.personal@gmail.com" required>
            <small style="font-size: 0.74rem; color: var(--text-muted); margin-top: 0.25rem; display: block;">All emails sent to this alias will be instantly delivered to this address.</small>
          </div>

          <!-- Live Preview Box -->
          <div style="background: rgba(234, 88, 12, 0.06); border: 1px solid rgba(234, 88, 12, 0.2); border-radius: 8px; padding: 0.75rem 1rem; margin-top: 0.75rem;">
            <div style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--accent-primary, #ea580c); margin-bottom: 0.2rem;">Relay Preview</div>
            <div id="provRelayPreview" style="font-family: monospace; font-size: 0.85rem; color: var(--text-primary);">
              (handle)@(domain) &rarr; (destination)
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="window.closeProvisionAliasModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" id="provSubmitBtn">Provision Email Alias</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 2: Edit Email Alias -->
  <div id="editAliasModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 480px;">
      <div class="modal-header">
        <h3 class="modal-title">Edit Forwarding Destination</h3>
        <button type="button" class="modal-close" onclick="window.closeEditAliasModal()">&times;</button>
      </div>
      <form id="editAliasForm" onsubmit="window.handleEditAliasSubmit(event)">
        <input type="hidden" id="editAliasId">
        <input type="hidden" id="editAliasDomain">
        <div class="modal-body">
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Email Alias</label>
            <input type="text" id="editAliasDisplay" class="form-input" readonly style="font-family: monospace; background: var(--bg-surface);">
          </div>
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Forward To (Gmail Address) *</label>
            <input type="email" id="editForwardInput" class="form-input" required>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="window.closeEditAliasModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" id="editSubmitBtn">Save Changes</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 3: Manage ImprovMX API Keys -->
  <div id="manageImprovmxKeysModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 580px;">
      <div class="modal-header">
        <h3 class="modal-title">ImprovMX API Keys & Accounts</h3>
        <button type="button" class="modal-close" onclick="window.closeManageKeysModal()">&times;</button>
      </div>
      <div class="modal-body">
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
          Connect multiple ImprovMX accounts or API keys to manage different custom domains across your research institute.
        </p>

        <!-- Connected Keys List -->
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary);">Configured API Keys</h4>
          <div id="improvmxKeysList" style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.84rem; color: var(--text-muted);">Loading keys...</div>
          </div>
        </div>

        <!-- Add New Key Form -->
        <div style="padding-top: 1rem; border-top: 1px solid var(--border-color);">
          <h4 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.6rem; color: var(--text-primary);">+ Connect Additional ImprovMX API Key</h4>
          <div class="form-group" style="margin-bottom: 0.75rem;">
            <label class="form-label">Account Label *</label>
            <input type="text" id="newKeyLabelInput" class="form-input" placeholder="e.g. Secondary Lab / Personal Domain">
          </div>
          <div class="form-group" style="margin-bottom: 0.75rem;">
            <label class="form-label">ImprovMX API Key (sk_...) *</label>
            <input type="password" id="newKeySecretInput" class="form-input" placeholder="sk_xxxxxxxxxxxxxxxxxxxxxxxx">
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="addNewKeyBtn" onclick="window.handleAddNewApiKey()">
            Verify & Connect Key
          </button>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="window.closeManageKeysModal()">Close</button>
      </div>
    </div>
  </div>

  </section>

  <!-- ==========================================================================
       MODAL 1: "ADD A BLOCK" PALETTE (Blogger.com Style Modular Blocks)
       ========================================================================== -->
  <div id="addBlockModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 680px;">
      <div class="modal-header">
        <h3 class="modal-title">Add a Block</h3>
        <button class="modal-close" onclick="closeAddBlockModal()">&times;</button>
      </div>
      <div class="modal-body">
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
          Select a modular block type to insert into your publication:
        </p>

        <div class="block-picker-grid">
          <!-- Text -->
          <div class="block-picker-item" onclick="insertBlock('text')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
            </svg>
            <div class="block-picker-title">Text</div>
            <div class="block-picker-desc">Regular paragraph</div>
          </div>

          <!-- Heading -->
          <div class="block-picker-item" onclick="insertBlock('heading')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 12h16"/><path d="M4 4v16"/><path d="M20 4v16"/>
            </svg>
            <div class="block-picker-title">Heading</div>
            <div class="block-picker-desc">Section title (H2)</div>
          </div>

          <!-- Subheading -->
          <div class="block-picker-item" onclick="insertBlock('subheading')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 12h8"/><path d="M6 6v12"/><path d="M14 6v12"/><path d="M19 10v4"/>
            </svg>
            <div class="block-picker-title">Subheading</div>
            <div class="block-picker-desc">Smaller subsection</div>
          </div>

          <!-- Image -->
          <div class="block-picker-item" onclick="insertBlock('image')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
            <div class="block-picker-title">Image</div>
            <div class="block-picker-desc">Photo or graphic</div>
          </div>

          <!-- Code -->
          <div class="block-picker-item" onclick="insertBlock('code')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
            <div class="block-picker-title">Code</div>
            <div class="block-picker-desc">Code snippet</div>
          </div>

          <!-- Quote -->
          <div class="block-picker-item" onclick="insertBlock('quote')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
            </svg>
            <div class="block-picker-title">Quote</div>
            <div class="block-picker-desc">Blockquote & citation</div>
          </div>

          <!-- List -->
          <div class="block-picker-item" onclick="insertBlock('list')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <div class="block-picker-title">List</div>
            <div class="block-picker-desc">Bullet or numbered</div>
          </div>

          <!-- Callout -->
          <div class="block-picker-item" onclick="insertBlock('callout')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div class="block-picker-title">Callout</div>
            <div class="block-picker-desc">Highlighted note</div>
          </div>

          <!-- Table -->
          <div class="block-picker-item" onclick="insertBlock('table')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/>
            </svg>
            <div class="block-picker-title">Table</div>
            <div class="block-picker-desc">Data table</div>
          </div>

          <!-- Timeline -->
          <div class="block-picker-item" onclick="insertBlock('timeline')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <div class="block-picker-title">Timeline</div>
            <div class="block-picker-desc">Event milestones</div>
          </div>

          <!-- Music -->
          <div class="block-picker-item" onclick="insertBlock('music')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
            <div class="block-picker-title">Music</div>
            <div class="block-picker-desc">Spotify/YT + opinion</div>
          </div>

          <!-- Divider -->
          <div class="block-picker-item" onclick="insertBlock('divider')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"/>
            </svg>
            <div class="block-picker-title">Divider</div>
            <div class="block-picker-desc">Horizontal line</div>
          </div>

          <!-- Video -->
          <div class="block-picker-item" onclick="insertBlock('video')">
            <svg class="block-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="14" x="3" y="5" rx="2"/><polygon points="10 9 15 12 10 15 10 9"/>
            </svg>
            <div class="block-picker-title">Video</div>
            <div class="block-picker-desc">YouTube / MP4 embed</div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeAddBlockModal()">Cancel</button>
      </div>
    </div>
  </div>

  <!-- ==========================================================================
       MODAL 2: ADD / EDIT RESEARCHER & CORE TEAM MEMBER
       ========================================================================== -->
  <div id="researcherModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 650px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;">
      <div class="modal-header" style="flex-shrink: 0;">
        <h3 id="researcherModalTitle" class="modal-title">Add Researcher / Fellow</h3>
        <button class="modal-close" onclick="closeResearcherModal()">&times;</button>
      </div>
      <form id="researcherForm" style="display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; margin: 0;">
        <div class="modal-body" style="overflow-y: auto; flex: 1; min-height: 0; max-height: calc(90vh - 140px); padding: 1.5rem;">
          <input type="hidden" id="researcherEditId">

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="resNameInput">Full Name *</label>
              <input type="text" id="resNameInput" class="form-input" placeholder="e.g. Dr. Jane Smith" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="resEmailInput">Email Address *</label>
              <input type="email" id="resEmailInput" class="form-input" placeholder="curiomas.members@gmail.com" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="resAvatarInput">Profile Photo (PFP URL)</label>
            <input type="url" id="resAvatarInput" class="form-input" placeholder="https://images.unsplash.com/...">
            <div style="display: flex; gap: 0.4rem; margin-top: 0.4rem; flex-wrap: wrap; font-size: 0.72rem;">
              <span style="color: var(--text-muted); align-self: center;">Avatar Presets:</span>
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="document.getElementById('resAvatarInput').value='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'">Avatar 1</button>
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="document.getElementById('resAvatarInput').value='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'">Avatar 2</button>
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="document.getElementById('resAvatarInput').value='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'">Avatar 3</button>
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;" onclick="document.getElementById('resAvatarInput').value='https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'">Avatar 4</button>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="resRoleInput">Role / Title *</label>
              <input type="text" id="resRoleInput" class="form-input" placeholder="e.g. Lead Investigator / Fellow" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="resDivisionInput">Division *</label>
              <select id="resDivisionInput" class="form-select" required>
                <option value="Executive Council">Executive Council</option>
                <option value="Space & Astrophysics">Space & Astrophysics</option>
                <option value="Ancient Biology & Paleontology">Ancient Biology & Paleontology</option>
                <option value="AI & Computational Science">AI & Computational Science</option>
                <option value="Astrobiology & Extremophiles">Astrobiology & Extremophiles</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="resUniversityInput">University / Institution</label>
              <input type="text" id="resUniversityInput" class="form-input" placeholder="e.g. MIT / Cambridge">
            </div>
            <div class="form-group">
              <label class="form-label" for="resDegreeInput">Degree / Field</label>
              <input type="text" id="resDegreeInput" class="form-input" placeholder="e.g. B.Sc. Astrophysics">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="resBioInput">Biography & Focus *</label>
            <textarea id="resBioInput" class="form-textarea" style="min-height: 70px;" placeholder="Brief bio describing research specialization..." required></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="resGithubInput">GitHub URL</label>
              <input type="url" id="resGithubInput" class="form-input" placeholder="https://github.com/username">
            </div>
            <div class="form-group">
              <label class="form-label" for="resLinkedinInput">LinkedIn URL</label>
              <input type="url" id="resLinkedinInput" class="form-input" placeholder="https://linkedin.com/in/username">
            </div>
          </div>

          <!-- Core Team Toggle & Ordering -->
          <div class="form-row" style="align-items: center; padding: 1rem; background: rgba(234, 88, 12, 0.05); border: 1px solid rgba(234, 88, 12, 0.15); border-radius: 10px;">
            <div class="form-group" style="margin: 0; display: flex; align-items: center; gap: 0.6rem;">
              <input type="checkbox" id="resIsTeamMember" style="width: 18px; height: 18px; accent-color: var(--accent-primary);">
              <label for="resIsTeamMember" style="font-weight: 600; font-size: 0.88rem; cursor: pointer; color: var(--text-primary); margin: 0;">
                Core Team Member (Displays in Real Team Section)
              </label>
            </div>
            <div class="form-group" style="margin: 0; max-width: 130px;">
              <label class="form-label" for="resOrderIndex" style="margin-bottom: 0.2rem; font-size: 0.75rem;">Display Order</label>
              <input type="number" id="resOrderIndex" class="form-input" value="1" min="1" max="99">
            </div>
          </div>
        </div>
        <div class="modal-footer" style="flex-shrink: 0;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="closeResearcherModal()">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Save Researcher Profile</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Application Review Modal -->
  <div id="appReviewModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 760px;">
      <div class="modal-header">
        <h3 class="modal-title" style="display:flex; align-items:center; gap:0.5rem;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Fellowship Application Review</span>
        </h3>
        <button class="modal-close">&times;</button>
      </div>
      <div id="appReviewDetails" class="modal-body" style="padding: 1.5rem;"></div>
      <div class="modal-footer" style="justify-content:space-between; flex-wrap:wrap; gap:0.5rem; background: var(--bg-surface); border-top: 1px solid var(--border-color); padding: 1rem 1.5rem;">
        <button id="rejectAppBtn" class="btn btn-sm" style="background:rgba(239, 68, 68, 0.1); color:#ef4444; border:1px solid rgba(239, 68, 68, 0.25); font-weight:600; padding:0.5rem 1rem;">
          ✕ Decline & Send Email
        </button>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;">
          <button id="reviewEmailApplicantBtn" class="btn btn-sm" style="background:rgba(234, 88, 12, 0.08); color:var(--accent-primary); border:1px solid rgba(234, 88, 12, 0.2);">
            ✉ Custom Email
          </button>
          <button id="reviewUnderwayBtn" class="btn btn-secondary btn-sm">Mark Under Review</button>
          <button id="acceptAppBtn" class="btn btn-primary btn-sm" style="font-weight:600; padding:0.5rem 1.25rem;">
            ✓ Accept & Provision Fellow
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- EmailJS Email Composer Modal -->
  <div id="emailComposerModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 680px;">
      <div class="modal-header">
        <h3 class="modal-title" style="display:flex; align-items:center; gap:0.55rem;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          <span>Email Dispatch (curiomas.members@gmail.com)</span>
        </h3>
        <button class="modal-close" onclick="closeEmailComposer()">&times;</button>
      </div>
      <form id="emailComposerForm">
        <div class="modal-body">
          <div class="form-group" style="margin-bottom: 1.15rem; background: rgba(234, 88, 12, 0.04); border: 1px solid rgba(234, 88, 12, 0.12); padding: 0.85rem; border-radius: 8px;">
            <label class="form-label" for="composerTemplateSelect" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
              <span>Quick Template / Preset</span>
              <span style="font-size:0.75rem; color:var(--text-muted);">Auto-fills subject and dispatch body</span>
            </label>
            <select id="composerTemplateSelect" class="form-input" onchange="applyComposerPreset(this.value)">
              <option value="custom">Custom Email (Blank)</option>
              <option value="fellow_accept">Fellowship Admission & Welcome (With Portal Login URL)</option>
              <option value="fellow_update">Fellowship Application Status Update</option>
              <option value="fellow_decline">Application Not Accepted Notice</option>
              <option value="inquiry_reply">Institute General Inquiry Response</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="composerToEmail">Recipient Email *</label>
              <input type="email" id="composerToEmail" class="form-input" required placeholder="recipient@university.edu">
            </div>
            <div class="form-group">
              <label class="form-label" for="composerToName">Recipient Name</label>
              <input type="text" id="composerToName" class="form-input" placeholder="e.g. Maya Lin">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="composerSubject">Subject *</label>
              <input type="text" id="composerSubject" class="form-input" required value="CRII Research Fellowship Update">
            </div>
            <div class="form-group">
              <label class="form-label" for="composerTemplateId" style="display:flex; justify-content:space-between; align-items:center;">
                <span>EmailJS Template ID *</span>
                <a href="https://dashboard.emailjs.com/admin/templates" target="_blank" rel="noopener" style="font-size:0.75rem; color:var(--accent-primary); text-decoration:underline;">
                  Find / Create Template &rarr;
                </a>
              </label>
              <input type="text" id="composerTemplateId" class="form-input" placeholder="e.g. zhelx7y" value="zhelx7y" required>
              <span style="font-size: 0.74rem; color: var(--text-muted); margin-top: 0.25rem; display: block;">
                From <a href="https://dashboard.emailjs.com/admin/templates" target="_blank" rel="noopener" style="color:var(--accent-primary); text-decoration:underline;">EmailJS Dashboard</a> (saved automatically once used).
              </span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="composerMessage">Message *</label>
            <textarea id="composerMessage" class="form-textarea" style="min-height: 150px;" required placeholder="Write your email dispatch to the applicant or team member..."></textarea>
          </div>

          <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; background: rgba(234, 88, 12, 0.06); border: 1px solid rgba(234, 88, 12, 0.15); padding: 0.85rem 1rem; border-radius: 8px;">
            <strong>EmailJS Service:</strong> <code>curiomas</code> (connected to <code>curiomas.members@gmail.com</code>)<br>
            Supported parameters in your EmailJS template: <code>{{to_email}}</code>, <code>{{to_name}}</code>, <code>{{subject}}</code>, <code>{{message}}</code>, <code>{{reply_to}}</code>.
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" onclick="closeEmailComposer()">Cancel</button>
          <button type="submit" id="composerSendBtn" class="btn btn-primary btn-sm">
            <span>Send Email via EmailJS</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Division Edit / Create Modal -->
  <div id="divisionModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 620px;">
      <div class="modal-header">
        <h3 id="divisionModalTitle" class="modal-title">Add Research Division</h3>
        <button class="modal-close" onclick="closeDivisionModal()">&times;</button>
      </div>
      <form id="divisionForm" onsubmit="handleSaveDivision(event)">
        <div class="modal-body" style="padding: 1.5rem;">
          <input type="hidden" id="divisionIdInput">
          
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" for="divisionTitleInput">Division Name / Title *</label>
            <input type="text" id="divisionTitleInput" class="form-input" required placeholder="e.g. Quantum Computing & Condensed Matter">
          </div>

          <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div class="form-group">
              <label class="form-label" for="divisionNumberInput">Division Number</label>
              <input type="text" id="divisionNumberInput" class="form-input" placeholder="e.g. 05">
            </div>
            <div class="form-group">
              <label class="form-label" for="divisionTagInput">Card Tag Header</label>
              <input type="text" id="divisionTagInput" class="form-input" placeholder="e.g. 05 / RESEARCH DIVISION">
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" for="divisionDescInput">Summary & Research Scope *</label>
            <textarea id="divisionDescInput" class="form-input" rows="3" required placeholder="Exploring macroscopic entanglement, topological quantum matter, and verifiable quantum simulations..."></textarea>
          </div>

          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" for="divisionImageInput">Cover Image URL *</label>
            <input type="url" id="divisionImageInput" class="form-input" required placeholder="https://images.unsplash.com/...">
            <div style="display:flex; gap:0.4rem; margin-top:0.45rem; flex-wrap:wrap; font-size:0.75rem;">
              <span style="color:var(--text-muted); align-self:center;">Image Presets:</span>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="document.getElementById('divisionImageInput').value='https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80'">Quantum</button>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="document.getElementById('divisionImageInput').value='https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80'">Cosmology</button>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="document.getElementById('divisionImageInput').value='https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80'">Laboratory</button>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="document.getElementById('divisionImageInput').value='https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80'">Genomics</button>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 0.5rem;">
            <label class="form-label" for="divisionLinkInput">Target Link / Route</label>
            <input type="text" id="divisionLinkInput" class="form-input" placeholder="/research" value="/research">
          </div>
        </div>

        <div class="modal-footer" style="padding: 1rem 1.5rem; display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="closeDivisionModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" id="saveDivisionBtn">Save Division</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Cohort Edit / Create Modal -->
  <div id="cohortModal" class="modal-overlay">
    <div class="modal-dialog" style="max-width: 620px;">
      <div class="modal-header">
        <h3 id="cohortModalTitle" class="modal-title">Add Cohort Profile</h3>
        <button class="modal-close" onclick="closeCohortModal()">&times;</button>
      </div>
      <form id="cohortForm" onsubmit="handleSaveCohort(event)">
        <div class="modal-body" style="padding: 1.5rem;">
          <input type="hidden" id="cohortIdInput">
          
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" for="cohortTitleInput">Target Cohort / Title *</label>
            <input type="text" id="cohortTitleInput" class="form-input" required placeholder="e.g. Undergraduates, Postgraduates, Self-Directed Researchers">
          </div>

          <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div class="form-group">
              <label class="form-label" for="cohortGradeInput">Grade / Academic Level *</label>
              <input type="text" id="cohortGradeInput" class="form-input" placeholder="e.g. Undergrad (1st - 4th Year), Grade 10-12">
              <div style="display:flex; gap:0.3rem; margin-top:0.35rem; flex-wrap:wrap; font-size:0.7rem;">
                <button type="button" class="btn btn-secondary btn-sm" style="padding:0.12rem 0.4rem; font-size:0.7rem;" onclick="document.getElementById('cohortGradeInput').value='Undergraduate (1st - 4th Year)'">Undergrad</button>
                <button type="button" class="btn btn-secondary btn-sm" style="padding:0.12rem 0.4rem; font-size:0.7rem;" onclick="document.getElementById('cohortGradeInput').value='Postgraduate / Master's'">Postgrad</button>
                <button type="button" class="btn btn-secondary btn-sm" style="padding:0.12rem 0.4rem; font-size:0.7rem;" onclick="document.getElementById('cohortGradeInput').value='High School / Grade 10-12'">Grade 10-12</button>
                <button type="button" class="btn btn-secondary btn-sm" style="padding:0.12rem 0.4rem; font-size:0.7rem;" onclick="document.getElementById('cohortGradeInput').value='Self-Directed / Independent'">Independent</button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="cohortDivisionInput">Target Division Scope</label>
              <select id="cohortDivisionInput" class="form-select">
                <option value="All Research Tracks">All Research Tracks</option>
              </select>
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" for="cohortDescInput">Description / Requirements *</label>
            <textarea id="cohortDescInput" class="form-input" rows="3" required placeholder="Early-stage researchers looking to contribute to real-world science beyond coursework..."></textarea>
          </div>

          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" for="cohortImageInput">Card Media / Photo URL *</label>
            <input type="url" id="cohortImageInput" class="form-input" required placeholder="https://images.unsplash.com/...">
            <div style="display:flex; gap:0.4rem; margin-top:0.45rem; flex-wrap:wrap; font-size:0.75rem;">
              <span style="color:var(--text-muted); align-self:center;">Presets:</span>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="document.getElementById('cohortImageInput').value='https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80'">Lab Undergrad</button>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="document.getElementById('cohortImageInput').value='https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'">Postgrad Group</button>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="document.getElementById('cohortImageInput').value='https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'">Independent Research</button>
              <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="document.getElementById('cohortImageInput').value='https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'">Fellows & Mentors</button>
            </div>
          </div>

          <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 0.5rem;">
            <div class="form-group">
              <label class="form-label" for="cohortLinkInput">Action Link</label>
              <input type="text" id="cohortLinkInput" class="form-input" placeholder="/team#apply" value="/team#apply">
            </div>
            <div class="form-group">
              <label class="form-label" for="cohortLinkTextInput">Button / Link Text</label>
              <input type="text" id="cohortLinkTextInput" class="form-input" placeholder="Apply as Fellow" value="Apply as Fellow">
            </div>
          </div>
        </div>

        <div class="modal-footer" style="padding: 1rem 1.5rem; display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="closeCohortModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" id="saveCohortBtn">Save Cohort Profile</button>
        </div>
      </form>
    </div>
  </div>

    </div>
  `}async function Vn(e){gn.isAuthenticated()?(gn.verifySession().then(t=>{t&&t.revoked&&(window.showToast&&window.showToast(`Your session has expired. Please sign in again.`,`error`),e?e.navigate(`/login`):window.location.href=`/login`)}),typeof window.initPortalDashboard==`function`&&window.initPortalDashboard()):e?e.navigate(`/login?redirect=/portal`):window.location.href=`/login?redirect=/portal`}var Hn=class{constructor(e){this.appContainer=e,this.currentRoute=null,this.initLinkInterceptor(),this.initPopstate()}initLinkInterceptor(){document.addEventListener(`click`,e=>{let t=e.target.closest(`a`);if(!t)return;let n=t.getAttribute(`href`);if(n&&!(n.startsWith(`http://`)||n.startsWith(`https://`)||n.startsWith(`mailto:`)||n.startsWith(`tel:`)||n.startsWith(`javascript:`))&&t.getAttribute(`target`)!==`_blank`){if(n.startsWith(`#`)){e.preventDefault();let t=n.slice(1),r=document.getElementById(t);r&&(r.scrollIntoView({behavior:`smooth`}),history.pushState(null,``,n))}else(n.startsWith(`/`)||n.startsWith(`./`)||!n.includes(`://`))&&(e.preventDefault(),this.navigate(n))}})}initPopstate(){window.addEventListener(`popstate`,()=>{this.resolveRoute(window.location.pathname,window.location.hash)})}navigate(e){let[t,n]=e.split(`#`),r=n?`#${n}`:``;(window.location.pathname+window.location.search!==t||window.location.hash!==r)&&history.pushState(null,``,e),this.resolveRoute(t,r)}async resolveRoute(e=`/`,t=``){let[n,r]=e.split(`?`),i=(n||`/`).toLowerCase().replace(/\.html$/,``);i.startsWith(`/`)||(i=`/`+i),i.length>1&&i.endsWith(`/`)&&(i=i.slice(0,-1)),i===`/interns`&&(i=`/team`),this.currentRoute=i;let a=i===`/login`||i===`/portal`,o=document.getElementById(`navbarMount`),s=document.getElementById(`footerMount`),c=document.getElementById(`pageContentMount`);if(o&&(o.style.display=a?`none`:`block`),s&&(s.style.display=a?`none`:`block`),i===`/portal`&&!gn.isAuthenticated()){this.navigate(`/login?redirect=/portal`);return}if(i===`/login`&&gn.isAuthenticated()){this.navigate(`/portal`);return}let l=``,u=null;switch(i){case`/`:case``:l=wn(),u=Tn,document.title=`Curiomas Research & Innovation Institute — CRII`;break;case`/research`:l=Dn(),u=On,document.title=`Research Publications & Datasets — CRII`;break;case`/team`:l=kn(),u=An,document.title=`Core Team & Research Mentors — CRII`;break;case`/blog`:l=jn(),u=Mn,document.title=`Dispatches from the Institute — CRII`;break;case`/article`:l=Nn(),u=Pn,document.title=`Scientific Dispatch — CRII`;break;case`/contact`:l=Fn(),u=In,document.title=`Contact the Institute — CRII`;break;case`/login`:l=Ln(),u=()=>Rn(this),document.title=`Institute Sign In — CRII`;break;case`/portal`:l=Bn(),u=()=>Vn(this),document.title=`Researcher Portal — CRII`;break;default:l=wn(),u=Tn,document.title=`Curiomas Research & Innovation Institute — CRII`}if(c&&(c.innerHTML=l),bn(i),u)try{await u()}catch(e){console.error(`Error mounting page ${i}:`,e)}if(typeof window.initHeroCustomization==`function`)try{window.initHeroCustomization()}catch(e){console.warn(`initHeroCustomization error:`,e)}if(typeof window.updateNavbarTheme==`function`&&window.updateNavbarTheme(),t){let e=t.replace(/^#/,``);setTimeout(()=>{let t=document.getElementById(e);t&&t.scrollIntoView({behavior:`smooth`})},50)}else window.scrollTo({top:0,behavior:`instant`})}};function Un(){let e=document.getElementById(`app`);if(!e)return;let t=window.location.pathname;e.innerHTML=`
    <div id="navbarMount">${_n(t)}</div>
    <div id="pageContentMount"></div>
    <div id="footerMount">${xn()}</div>
    <div id="searchModalMount">${Sn()}</div>
  `;let n=new Hn(e);window.CRII_ROUTER=n,yn(n),Cn(n),gn.verifySession().then(e=>{e.authenticated&&document.querySelectorAll(`.nav-login-btn, .nav-explore-btn, .mobile-login-pill`).forEach(e=>{let t=e.querySelector(`span`);t?t.textContent=`PORTAL`:e.textContent=`PORTAL`,e.setAttribute(`href`,`/portal`)})}),n.resolveRoute(window.location.pathname,window.location.hash)}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,Un):Un();