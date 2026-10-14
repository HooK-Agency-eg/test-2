/* Signed-in user: account menu, avatar and notification bell */
(function(){
const acct=$('acct');if(!ME||!acct)return;
const bellSvg='<svg viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',userSvg=acct.querySelector('svg').outerHTML;
const wrap=document.createElement('div');wrap.className='acm';
wrap.innerHTML='<div class="bellwrap"><button class="ibtn" id="bell" aria-haspopup="true">'+bellSvg+'<span class="bdg" id="bdg" hidden>0</span></button><div class="menu" id="npanel" hidden></div></div>'
 +'<div class="bellwrap"><button class="ibtn av-b" id="acb" aria-haspopup="true"></button><div class="menu" id="umenu" hidden></div></div>';
acct.replaceWith(wrap);
let items=[],unread=0;
const ago=s=>{try{return new Date(s).toLocaleString(ar()?'ar-EG':'en-GB',{dateStyle:'medium',timeStyle:'short'})}catch(e){return ''}};
function drawAvatar(){$('acb').innerHTML=ME.avatar?'<img data-keep src="'+esc(ME.avatar)+'" alt="">':userSvg;const im=$('acb').querySelector('img');if(im)im.onerror=()=>{$('acb').innerHTML=userSvg};$('acb').setAttribute('aria-label',t('Account','الحساب'));$('bell').setAttribute('aria-label',t('Notifications','الإشعارات'))}
function drawMenu(){
  $('umenu').innerHTML='<div class="who"><b>'+esc(ME.name||ME.username)+'</b><small>'+esc(ME.email)+'</small></div>'
   +'<a href="account.html#orders">'+t('My orders','طلباتي')+'</a><a href="account.html">'+t('Account settings','إعدادات الحساب')+'</a><a href="account.html#report">'+t('Report a problem','إبلاغ عن مشكلة')+'</a>'
   +(ME.role==='admin'?'<a href="dashboard.html">'+t('Dashboard','لوحة التحكم')+'</a>':'')
   +'<button class="mi" id="lo">'+t('Log out','تسجيل الخروج')+'</button>';
  $('lo').onclick=async()=>{try{await post('/api/logout',{})}catch(e){}location.href='index.html'};
}
function drawBadge(){const b=$('bdg');b.hidden=!unread;b.textContent=unread>9?'9+':unread}
function drawPanel(){
  $('npanel').innerHTML=items.length?items.map(n=>'<a class="nit'+(n.read?'':' un')+'" href="'+esc(n.link||'#')+'"><b>'+esc(L(n.title))+'</b><span>'+esc(L(n.body))+'</span><small>'+esc(ago(n.at))+'</small></a>').join(''):'<p style="padding:14px">'+t('No notifications yet.','مفيش إشعارات لسه.')+'</p>';
}
async function pull(){
  try{const r=await post('/api/account/notifs',{});if(!r.ok)return;const j=await r.json();items=j.items||[];unread=j.unread||0;drawBadge();drawPanel()}catch(e){}
}
const close=()=>{$('npanel').hidden=true;$('umenu').hidden=true};
$('bell').onclick=e=>{e.stopPropagation();const open=$('npanel').hidden;close();$('npanel').hidden=!open;
  if(open&&unread){unread=0;drawBadge();post('/api/account/notifs/read',{}).catch(()=>{})}};
$('acb').onclick=e=>{e.stopPropagation();const open=$('umenu').hidden;close();$('umenu').hidden=!open};
document.addEventListener('click',e=>{if(!e.target.closest('.acm'))close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
document.addEventListener('langchange',()=>{drawAvatar();drawMenu();drawPanel()});
window.refreshMe=async()=>{const m=await jget('/api/me');if(m&&m.user)ME=m.user;drawAvatar();drawMenu()};
drawAvatar();drawMenu();drawPanel();if(window.BOOT_NOTIFS){items=BOOT_NOTIFS.items||[];unread=BOOT_NOTIFS.unread||0;drawBadge();drawPanel()}else pull();
setInterval(()=>{if(!document.hidden)pull()},120000);
})();
