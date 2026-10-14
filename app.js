/* Google Apps Script mode: when config.js has a URL, every /api/ call is sent there */
if(window.HOOK_API){
  const real=window.fetch.bind(window);
  const sget=k=>{try{return sessionStorage.getItem(k)||localStorage.getItem(k)||''}catch(e){return ''}};
  const sset=(k,v,keep)=>{try{sessionStorage.removeItem(k);localStorage.removeItem(k);if(v)(keep===false?sessionStorage:localStorage).setItem(k,v)}catch(e){}};
  const vid=()=>{let v='';try{v=localStorage.getItem('hookvid')||''}catch(e){}if(!v){v=Math.random().toString(36).slice(2)+Date.now().toString(36);try{localStorage.setItem('hookvid',v)}catch(e){}}return v};
  window.fetch=async(u,o)=>{
    o=o||{};if(typeof u!=='string'||u.indexOf('/api/')!==0)return real(u,o);
    const m=(o.method||'GET').toUpperCase(),tok=sget('hooktok');
    if(u==='/api/me'&&!tok)return new Response(JSON.stringify({user:null}),{status:200});
    let body=null;
    if(o.body instanceof Blob)body=await new Promise(r=>{const f=new FileReader();f.onload=()=>r({b64:f.result.split(',')[1]});f.readAsDataURL(o.body)});
    else if(o.body){try{body=JSON.parse(o.body)}catch(e){}}
    if((u==='/api/track'||u==='/api/boot')&&body)body.vid=vid();
    const r=await real(window.HOOK_API,{method:'POST',headers:{'content-type':'text/plain;charset=utf-8'},body:JSON.stringify({route:u,method:m,body:body,token:tok})});
    const j=await r.json();
    if(j.token)sset('hooktok',j.token,body&&body.remember);
    if(u==='/api/logout')sset('hooktok','');
    return new Response(JSON.stringify(j.d),{status:j.s||200});
  };
}
const $=id=>document.getElementById(id);
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const ar=()=>document.documentElement.lang=='ar';
const t=(en,a)=>ar()?a:en;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ERR={'Wrong username/email or password':'اليوزر أو الباسورد غلط','Too many attempts, wait 15 minutes':'محاولات كتير، استنى 15 دقيقة','Too many attempts, try later':'محاولات كتير، جرّب بعد شوية','Username or email already used':'اليوزر أو الإيميل مستخدم قبل كده','Username: 3-24 letters, numbers or _':'اليوزر من 3 لـ 24 حرف إنجليزي أو أرقام أو _','Invalid email':'الإيميل مش صح','Password must be at least 8 characters':'الباسورد لازم يكون 8 حروف على الأقل','Current password is wrong':'الباسورد الحالي غلط','New password must be at least 8 characters':'الباسورد الجديد لازم يكون 8 حروف على الأقل','Name is required':'الاسم مطلوب','Image is required':'الصورة مطلوبة','Only PNG, JPG or WEBP images':'الصور المسموحة PNG أو JPG أو WEBP بس','Invalid WhatsApp number':'رقم الواتساب مش صح','Admin only':'للأدمن بس','Name is too short':'الاسم قصير أوي','Subject and message are required':'لازم تكتب العنوان والرسالة','Too many reports, try later':'بلاغات كتير، جرّب بعد شوية','Please sign in':'سجّل دخولك الأول','Wrong code':'الكود غلط','Session expired, sign in again':'الجلسة خلصت، سجّل دخول من الأول','Could not send the code, try again later':'معرفناش نبعت الكود، جرّب بعد شوية','Write a reply first':'اكتب الرد الأول','Bad request':'طلب غلط','Bad response':'رد غير متوقع من السيرفر','Too many orders':'طلبات كتير، جرّب بعد شوية','Google sign-in failed':'تسجيل الدخول بجوجل فشل، جرّب تاني','Google sign-in is not set up':'تسجيل الدخول بجوجل لسه متفعّلش','Video is too large (max 10 MB). Use a YouTube or Drive link.':'الفيديو كبير (الحد 10 ميجا). استخدم لينك يوتيوب أو درايف.','Only MP4 or WEBM videos':'الفيديو لازم يكون MP4 أو WEBM','Keep at least one section':'لازم يفضل قسم واحد على الأقل'};
const errT=m=>(ar()&&ERR[m])||m;
const L=o=>o?(ar()?(o.ar||o.en):(o.en||o.ar))||'':'';
const fmtPhone=d=>/^20\d{10}$/.test(d)?`+20 ${d.slice(2,5)} ${d.slice(5,8)} ${d.slice(8)}`:'+'+d;
const pages=[['index.html','Home','الرئيسية'],['services.html','Services','خدماتنا'],['portfolio.html','Portfolio','أعمالنا'],['shop.html','Shop','المتجر'],['contact.html','Contact','كلمنا']];
const here=(()=>{let h=location.pathname.split('/').pop()||'index';if(!/\.\w+$/.test(h))h+='.html';return h})();
(()=>{try{if(location.protocol==='file:')return;const c=location.pathname.replace(/index\.html$/,'').replace(/\.html$/,'');if(c!==location.pathname)history.replaceState(null,'',(c||'/')+location.search+location.hash)}catch(e){}})();
const post=(u,b)=>fetch(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
let DB=null,ME=null;const hooks=[];
const onContent=fn=>{hooks.push(fn);if(DB)fn()};
const loadScript=s=>new Promise(r=>{const e=document.createElement('script');e.src=s;e.onload=e.onerror=r;document.head.appendChild(e)});

/* ---------- head, header, footer ---------- */
document.head.insertAdjacentHTML('beforeend','<link rel="icon" href="favicon.png"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;800;900&family=Sacramento&family=Aref+Ruqaa:wght@700&family=Silkscreen&display=swap">');
document.body.insertAdjacentHTML('afterbegin',`<div id="bar"></div><header><nav>
<a class="logo" href="index.html" aria-label="Hook"><img src="logo-cream.png" alt="Hook" height="38"></a>
<ul>${pages.map(([h,e,a])=>`<li><a href="${h}" data-ar="${a}" ${h===here?'aria-current="page"':''}>${e}</a></li>`).join('')}</ul>
<div class="tools"><button class="ibtn" id="lang" aria-label="Language">العربية</button>
<button class="ibtn" id="theme" aria-pressed="false" aria-label="Night mode"><svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>
<a class="ibtn" id="acct" href="login.html" aria-label="Account"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg></a>
<button class="ibtn cartbtn" id="cartbtn"><span data-ar="السلة">Cart</span> (<span id="cnt">0</span>)</button></div></nav></header>
<aside id="cart" aria-label="Cart"><button class="x" id="cx" aria-label="Close">×</button>
<h2 data-ar="السلة بتاعتك">Your cart</h2><ul id="items"></ul><p id="tot" style="margin:18px 0;font-weight:800"></p>
<button class="btn" id="order" data-ar="اطلب على واتساب">Order on WhatsApp</button></aside>`);
document.body.insertAdjacentHTML('beforeend',`<footer><div class="wrap"><img class="flogo" src="logotag-cream.png" alt="Hook - Catch The Attention"><div class="fr"><div id="fcontact" data-k="contact"></div><div class="soc" id="soc" data-k="social"></div></div></div></footer>`);

/* ---------- language ---------- */
function splitHero(){const h=document.querySelector('.hero h1');if(!h||reduce)return;const s=h.textContent;h.setAttribute('aria-label',s);h.innerHTML=s.split(' ').map((w,i)=>`<span class="w" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`).join(' ')}
function applyTexts(){
  const l=ar()?'ar':'en',tx=(DB&&DB.texts)||{};
  document.querySelectorAll('[data-ar]').forEach(el=>{
    if(el.dataset.en===undefined)el.dataset.en=el.textContent;
    const o=tx[el.dataset.en],d=l=='ar'?el.dataset.ar:el.dataset.en;
    el.textContent=(o&&o[l])||d;
  });
}
let lastTx='';
function applyLang(l){
  const d=document.documentElement;d.lang=l;d.dir=l=='ar'?'rtl':'ltr';
  applyTexts();
  $('lang').textContent=l=='ar'?'EN':'العربية';
  try{localStorage.setItem('hooklang',l)}catch(e){}
  lastTx=JSON.stringify((DB&&DB.texts)||{});splitHero();if(DB)runHooks();
  document.dispatchEvent(new Event('langchange'));
}
$('lang').onclick=()=>applyLang(ar()?'en':'ar');

/* ---------- content ---------- */
function fillContact(c){
  const wa='https://wa.me/'+c.whatsapp;
  $('fcontact').innerHTML=`<a href="${wa}" dir="ltr">${fmtPhone(c.whatsapp)}</a><br><a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`;$('fcontact').removeAttribute('data-ed');
  document.querySelectorAll('[data-wa]').forEach(a=>{a.href=wa;a.textContent=fmtPhone(c.whatsapp)});
  document.querySelectorAll('[data-mail]').forEach(a=>{a.href='mailto:'+c.email;a.textContent=c.email});
}
function runHooks(){
  cart=cart.filter(i=>prod(i.id));
  document.querySelectorAll('[data-btn]').forEach(a=>{const b=DB.buttons&&DB.buttons[a.dataset.btn];if(b){a.textContent=L(b.label);a.href=b.href}});
  const k=JSON.stringify(DB.texts||{});if(k!==lastTx){lastTx=k;applyTexts();splitHero()}
  applyImages();fillSocial();fillContact(DB.contact);renderCart();hooks.forEach(f=>f());
}
async function jget(u){try{const r=await fetch(u);return r.ok?await r.json():null}catch(e){return null}}
const cacheDB=d=>{try{localStorage.setItem('hookdb',JSON.stringify(d))}catch(e){}};
window.reloadContent=async()=>{DB=(await jget('/api/content'))||DB;cacheDB(DB);runHooks()};

/* ---------- theme and sea depth color ---------- */
const PAL={light:[[255,81,46],[156,43,22],[29,29,27]],dark:[[0,85,80],[9,59,56],[12,18,17]]};
function paint(){
  const m=Math.max(1,document.documentElement.scrollHeight-innerHeight),d=window.DEPTH=Math.min(1,Math.max(0,scrollY/m));
  const P=PAL[document.documentElement.dataset.theme||'light'],a=d<.5?P[0]:P[1],b=d<.5?P[1]:P[2],k=d<.5?d*2:(d-.5)*2;
  document.documentElement.style.setProperty('--bg',`rgb(${a.map((v,i)=>Math.round(v+(b[i]-v)*k))})`);
  document.body.classList.toggle('deep',d>.5);
  $('bar').style.transform=`scaleX(${d})`;
}
function setTheme(m){document.documentElement.dataset.theme=m;$('theme').setAttribute('aria-pressed',m=='dark');try{localStorage.setItem('hooktheme',m)}catch(e){}paint()}
$('theme').onclick=()=>setTheme(document.documentElement.dataset.theme=='dark'?'light':'dark');
addEventListener('scroll',paint,{passive:true});addEventListener('resize',paint);
new ResizeObserver(paint).observe(document.body);

/* ---------- sections, units, discounts ---------- */
const DEFCATS={work:[{id:'Design',name:{en:'Design',ar:'تصميم'}},{id:'Content',name:{en:'Content',ar:'محتوى'}},{id:'Media Buying',name:{en:'Media Buying',ar:'شراء إعلانات'}}],shop:[{id:'packages',name:{en:'Marketing packages',ar:'باقات التسويق'}}]};
const cats=k=>(DB&&DB.categories&&DB.categories[k])||DEFCATS[k];
const catName=(k,id)=>{const c=cats(k).find(x=>x.id===id);return c?L(c.name):''};
const pdef=p=>Object.assign({kind:'product',unit:'item',pricing:'total',min:1,step:1,amount:0,disc:0,discEnds:'',cat:'packages',episodes:0,hours:0,desc:{en:'',ar:''},tag:{en:'',ar:''},per:{en:'',ar:''},items:[],img:''},p);
const prod=id=>{const p=DB&&DB.products.find(x=>x.id===id);return p&&pdef(p)};
const cur=()=>t('EGP','ج.م');
const discOn=(p,now)=>+p.disc>0&&(!p.discEnds||Date.parse(p.discEnds)>(now||Date.now()));
const effPrice=(p,now)=>discOn(p,now)?Math.round(p.price*(100-p.disc))/100:p.price;
const fm=n=>String(Math.round(n*100)/100);
const UN={piece:['piece','pieces','قطعة'],meter:['m','m','متر'],sheet:['sheet','sheets','ورقة']};
const unitTxt=(u,q)=>{const x=UN[u];return x?(ar()?x[2]:(q==1?x[0]:x[1])):''};
const isPer=p=>p.pricing==='per'&&p.unit!=='item';
const lineTxt=(i)=>(i.pricing==='per'&&i.unit&&i.unit!=='item')?fm(i.q)+' '+unitTxt(i.unit,i.q):(i.q>1?'× '+i.q:'');
const lineTotal=(p,q)=>Math.round(effPrice(p)*q*100)/100;
function priceTxt(p){
  const e=effPrice(p),c=cur();
  if(isPer(p))return fm(e)+' '+c+' / '+unitTxt(p.unit,1);
  if(p.unit!=='item'&&p.amount)return fm(e)+' '+c+' · '+t('pack of ','عبوة ')+fm(p.amount)+' '+unitTxt(p.unit,p.amount);
  return fm(e)+' '+c+(L(p.per)?' · '+L(p.per):'');
}
const stepOf=p=>isPer(p)?(p.step||1):1,minOf=p=>isPer(p)?(p.min||1):1;

/* ---------- cart ---------- */
let cart=[];try{cart=(JSON.parse(localStorage.getItem('hookcart'))||[]).filter(i=>i&&i.id&&+i.q>0)}catch(e){}
function saveCart(){try{localStorage.setItem('hookcart',JSON.stringify(cart))}catch(e){}renderCart()}
function renderCart(){
  $('cnt').textContent=cart.length;if(!DB)return;
  const tot=Math.round(cart.reduce((a,i)=>a+lineTotal(prod(i.id),i.q),0)*100)/100;
  $('items').innerHTML=cart.length?cart.map((i,n)=>{const p=prod(i.id),q=isPer(p)?fm(i.q)+' '+unitTxt(p.unit,i.q):fm(i.q);
    return `<li class="cl"><div><b>${esc(L(p.name))}</b><br><small>${esc(priceTxt(p))}${discOn(p)?' · -'+p.disc+'%':''}</small><div class="qs"><button type="button" data-q="${n}|-1" aria-label="-">−</button><span>${esc(q)}</span><button type="button" data-q="${n}|1" aria-label="+">+</button></div></div><span>${fm(lineTotal(p,i.q))} ${cur()} <button class="x" data-rm="${n}" aria-label="Remove">×</button></span></li>`}).join(''):`<li>${t('Your cart is empty. Pick something from the shop.','السلة فاضية. اختار حاجة من المتجر.')}</li>`;
  $('tot').textContent=cart.length?`${t('Total','الإجمالي')}: ${fm(tot)} ${cur()}`:'';
  $('order').style.display=cart.length?'':'none';
}
window.addToCart=(id,q)=>{const p=prod(id);if(!p)return;q=Math.max(minOf(p),Math.round((+q||minOf(p))*100)/100);const f=cart.find(i=>i.id==id);f?f.q=Math.round((f.q+q)*100)/100:cart.push({id,q});saveCart();$('cart').classList.add('open')};
$('cartbtn').onclick=()=>$('cart').classList.toggle('open');
$('cx').onclick=()=>$('cart').classList.remove('open');
$('items').onclick=e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.rm!==undefined){cart.splice(+b.dataset.rm,1);saveCart();return}
  if(b.dataset.q){const[n,d]=b.dataset.q.split('|'),it=cart[+n],p=prod(it.id),nq=Math.round((it.q+ +d*stepOf(p))*100)/100;if(nq<minOf(p))cart.splice(+n,1);else it.q=Math.min(nq,isPer(p)?100000:99);saveCart()}
};
$('order').onclick=()=>{
  post('/api/order',{items:cart.map(i=>({id:i.id,q:i.q}))}).catch(()=>{});
  const tot=Math.round(cart.reduce((a,i)=>a+lineTotal(prod(i.id),i.q),0)*100)/100;
  const msg=t('Hi Hook, I want to order:','أهلاً هوك، عايز أطلب:')+'\n'+cart.map(i=>{const p=prod(i.id),q=isPer(p)?fm(i.q)+' '+unitTxt(p.unit,i.q):(i.q>1?'× '+i.q:'');return `- ${L(p.name)} ${q} (${fm(lineTotal(p,i.q))} ${cur()}${discOn(p)?', -'+p.disc+'%':''})`}).join('\n')+`\n${t('Total','الإجمالي')}: ${fm(tot)} ${cur()}`;
  open(`https://wa.me/${DB.contact.whatsapp}?text=${encodeURIComponent(msg)}`,'_blank');
};

/* ---------- slider (LTR and RTL) ---------- */
function slider(root,ms){
  const tr=root.querySelector('.track'),dots=root.querySelector('.dots'),play=root.querySelector('.play');
  const rtl=()=>document.documentElement.dir=='rtl',pos=()=>Math.abs(tr.scrollLeft);
  const st=()=>tr.firstElementChild?tr.firstElementChild.offsetWidth+parseFloat(getComputedStyle(tr).columnGap||0):1;
  const go=d=>{if(d>0&&pos()>=tr.scrollWidth-tr.clientWidth-6)tr.scrollTo({left:0});else if(d<0&&pos()<=6)tr.scrollTo({left:rtl()?-tr.scrollWidth:tr.scrollWidth});else tr.scrollBy({left:d*st()*(rtl()?-1:1)})};
  let on=!reduce,hov=false,timer;
  const tick=()=>{clearInterval(timer);if(on)timer=setInterval(()=>{if(!hov)go(1)},ms)};
  root.querySelector('.prev').onclick=()=>{go(-1);tick()};root.querySelector('.next').onclick=()=>{go(1);tick()};
  if(play){play.textContent=on?'❚❚':'▶';play.onclick=()=>{on=!on;play.textContent=on?'❚❚':'▶';tick()}}
  root.onmouseenter=root.onfocusin=()=>hov=true;root.onmouseleave=root.onfocusout=()=>hov=false;
  const mark=()=>{if(dots){const i=Math.round(pos()/st());[...dots.children].forEach((b,k)=>b.classList.toggle('on',k==i))}};
  root._refresh=()=>{if(dots){dots.innerHTML=[...tr.children].map((_,i)=>`<button aria-label="${i+1}"></button>`).join('');mark()}};
  if(dots){dots.onclick=e=>{const i=[...dots.children].indexOf(e.target);if(i>=0){tr.scrollTo({left:(rtl()?-1:1)*i*st()});tick()}};tr.addEventListener('scroll',mark,{passive:true})}
  root._refresh();tick();
}

/* ---------- effects ---------- */
function count(b){const n=+b.textContent;if(!n)return;const t0=performance.now();b._v=b.textContent;(function f(x){if(b.textContent!==b._v)return;const p=Math.min((x-t0)/1400,1);b._v=b.textContent=String(Math.round(n*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(f)})(t0)}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;io.unobserve(el);el.classList.add('in');
  const b=el.classList.contains('stat')&&el.querySelector('b');if(b)count(b);setTimeout(()=>el.classList.remove('reveal','in'),1400)}),{threshold:.12});
function watch(){eyes();if(reduce)return;document.querySelectorAll('main .card,main .panel,main h2,main .script,main .tabs,main .slider,main .lg,main form,.mq-wrap').forEach(el=>{if(el.dataset.w)return;el.dataset.w=1;el.classList.add('reveal');el.style.setProperty('--d',[...el.parentNode.children].indexOf(el)%5*.09+'s');io.observe(el)})}
if(!reduce&&matchMedia('(pointer:fine)').matches)document.addEventListener('pointermove',e=>{
  const c=e.target.closest&&e.target.closest('main .card');
  document.querySelectorAll('.card[style*="--rx"]').forEach(x=>{if(x!==c){x.style.removeProperty('--rx');x.style.removeProperty('--ry')}});
  if(c){const r=c.getBoundingClientRect();c.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*7+'deg');c.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*7+'deg')}
});
function typeTag(){const px=document.querySelector('.hero .pix');if(!px||reduce)return;const s=px.dataset.full||(px.dataset.full=px.textContent);px.textContent='';px.classList.add('typing');[...s].forEach((c,i)=>setTimeout(()=>px.textContent+=c,500+i*70))}

/* ---------- tracking ---------- */
window.trackView=id=>{try{const s=JSON.parse(sessionStorage.getItem('hv')||'[]');if(s.includes(id))return;s.push(id);sessionStorage.setItem('hv',JSON.stringify(s))}catch(e){}post('/api/track',{k:'view',id}).catch(()=>{})};
document.addEventListener('click',e=>{const a=e.target.closest('[data-view]');if(a)trackView(a.dataset.view)});

/* ---------- helpers: any text, images, social icons, password eye, video ---------- */
function autoMark(){
  const skip='script,style,textarea,input,select,option,button,svg,[data-btn],#fcontact,#soc,#mq,.track,#work,#shop,#tabs,#dash,#acc,#box,.abar,dialog,#cart,.hero .pix,.menu,[data-k]';
  document.querySelectorAll('main *, footer *').forEach(el=>{
    if(el.children.length||el.hasAttribute('data-ar')||el.closest(skip))return;
    const s=el.textContent.trim();if(s&&s.length<400)el.dataset.ar=s;
  });
}
function applyImages(){
  const im=(DB&&DB.images)||{};
  document.querySelectorAll('img').forEach(i=>{
    if(i.closest('[data-k],.menu,dialog,.abar,#acc,#box,#vd'))return;
    if(!i.dataset.o)i.dataset.o=i.getAttribute('src');
    const want=im[i.dataset.o]||i.dataset.o;if(i.getAttribute('src')!==want)i.src=want;
  });
}
const SOC={facebook:'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
instagram:'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
tiktok:'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z'};
function fillSocial(){
  const s=(DB&&DB.social)||{};
  $('soc').innerHTML=['facebook','instagram','tiktok'].filter(k=>/^https:\/\//.test(s[k]||'')).map(k=>'<a href="'+esc(s[k])+'" target="_blank" rel="noopener" aria-label="'+k+'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+SOC[k]+'"/></svg></a>').join('');
  $('soc').removeAttribute('data-ed');
}
const EYE='<svg viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>',EYEX='<svg viewBox="0 0 24 24"><path d="M17.9 17.9A10.9 10.9 0 0 1 12 19c-7 0-11-7-11-7a19.8 19.8 0 0 1 5.1-5.9M9.9 5.2A10.4 10.4 0 0 1 12 5c7 0 11 7 11 7a19.7 19.7 0 0 1-3.2 4.2M1 1l22 22"/><path d="M14.1 14.1a3 3 0 1 1-4.2-4.2"/></svg>';
function eyes(){
  document.querySelectorAll('input[type=password]:not([data-eye])').forEach(i=>{
    i.dataset.eye=1;const w=document.createElement('span');w.className='pw';i.replaceWith(w);w.appendChild(i);
    const b=document.createElement('button');b.type='button';b.className='eye';b.innerHTML=EYE;b.setAttribute('aria-label',t('Show password','إظهار الباسورد'));
    b.onclick=()=>{const show=i.type==='password';i.type=show?'text':'password';b.innerHTML=show?EYEX:EYE;b.setAttribute('aria-pressed',show);b.setAttribute('aria-label',show?t('Hide password','إخفاء الباسورد'):t('Show password','إظهار الباسورد'))};
    w.appendChild(b);
  });
}
window.openVideo=url=>{
  let d=$('vd');
  if(!d){d=document.createElement('dialog');d.id='vd';d.className='vd';d.innerHTML='<button class="vx" aria-label="Close">×</button><div id="vbox"></div>';document.body.appendChild(d);
    d.querySelector('.vx').onclick=()=>d.close();d.addEventListener('close',()=>{$('vbox').innerHTML=''});d.addEventListener('click',e=>{if(e.target===d)d.close()})}
  const frame=/^https:\/\/(www\.youtube\.com\/embed|drive\.google\.com\/file)\//.test(url);
  $('vbox').innerHTML=frame?'<iframe src="'+esc(url)+'" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen></iframe>':'<video src="'+esc(url)+'" controls autoplay playsinline></video>';
  d.showModal();
};
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('[data-video]');if(a){e.preventDefault();openVideo(a.dataset.video)}});

/* ---------- start ---------- */
const FALLBACK={whatsapp:'201120767519',email:'mm.Mido1270@gmail.com'};
const SHAPE=f=>!!(f&&Array.isArray(f.work)&&Array.isArray(f.clients)&&Array.isArray(f.products)&&f.buttons&&f.contact);
function showErr(m){if($('errbar'))return;const d=document.createElement('div');d.id='errbar';d.style.cssText='position:fixed;bottom:0;left:0;right:0;z-index:99;background:#b3200a;color:#fff;padding:8px 14px;font:13px/1.4 monospace;direction:ltr';d.textContent='Script error: '+m;document.body.appendChild(d)}
addEventListener('error',e=>{if(e.message)showErr(e.message)});addEventListener('unhandledrejection',e=>showErr(String((e.reason&&e.reason.message)||e.reason)));
let th='light',lang='en';try{th=localStorage.getItem('hooktheme')||'light';lang=localStorage.getItem('hooklang')||'en'}catch(e){}
autoMark();setTheme(th);applyLang(lang);fillContact(FALLBACK);fillSocial();typeTag();watch();
new MutationObserver(watch).observe(document.querySelector('main'),{childList:true,subtree:true});
(async()=>{
  const quiet=['login.html','dashboard.html','account.html'].includes(here);
  if(!quiet)post('/api/track',{k:'visit',p:'/'+here}).catch(()=>{});
  let c0=null;try{c0=JSON.parse(localStorage.getItem('hookdb'))}catch(e){}
  DB=SHAPE(c0)?c0:(SHAPE(window.SEED)?window.SEED:null);if(DB)runHooks();
  let boot=null;try{const r=await post('/api/boot',{});if(r.ok)boot=await r.json()}catch(e){}
  if(boot&&SHAPE(boot.content)){DB=boot.content;cacheDB(DB);runHooks();ME=boot.user||null;window.BOOT_NOTIFS=boot.notifs||null}
  else{
    const f=await jget('/api/content');
    if(SHAPE(f)){DB=f;cacheDB(f);runHooks()}
    else{window.BACKEND_EMPTY=1;document.dispatchEvent(new Event('backend'));if(!DB&&SHAPE(window.SEED)){DB=window.SEED;runHooks()}if(!DB)showErr('No content loaded. Make sure seed.js is uploaded next to index.html, and config.js has the Apps Script link.')}
    let me=null;try{me=await jget('/api/me')}catch(e){}
    ME=me&&me.user||null;
  }
  if(ME){$('acct').href=ME.role==='admin'?'dashboard.html':'login.html';$('acct').title=ME.username}
  window.AUTH_DONE=1;document.dispatchEvent(new Event('auth'));
  if(ME)await loadScript('user.js');
  if(ME&&ME.role==='admin')loadScript('admin.js');
  if(!quiet)loadScript('three.min.js').then(()=>loadScript('scene.js'));
})().catch(e=>showErr(e.message));

/* a missing image shows its name instead of a blank space, and the bad path is logged */
document.addEventListener('error',e=>{const i=e.target;if(!i||i.tagName!=='IMG'||i.dataset.f||i.dataset.keep!==undefined)return;if(i.dataset.o&&i.getAttribute('src')!==i.dataset.o){i.src=i.dataset.o;return}i.dataset.f=1;console.warn('Image not found:',i.src);const d=document.createElement('div');d.className='imgfail';d.textContent=i.alt||'';i.replaceWith(d)},true);
