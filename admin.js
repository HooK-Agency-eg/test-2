(function(){
const ACTIONS={'index.html':[['+ Project','+ مشروع','work'],['+ Client','+ عميل','clients']],'portfolio.html':[['+ Project','+ مشروع','work'],['Sections','الأقسام','cats:work']],'shop.html':[['+ Product / course','+ منتج / كورس','products'],['Sections','الأقسام','cats:shop']]};
/* field: [path, 'EN|AR label', type, options] */
const FIELDS={
 work:[['cat','Section|القسم','select',()=>[['','—']].concat(cats('work').map(c=>[c.id,L(c.name)]))],['name.en','Name (EN)|الاسم (EN)'],['name.ar','Name (AR)|الاسم (AR)'],['desc.en','Description (EN)|الوصف (EN)','area'],['desc.ar','Description (AR)|الوصف (AR)','area'],['img','Cover image|صورة الغلاف','image'],['video','Video: YouTube or Drive link, or upload an MP4 (max 10 MB)|فيديو: لينك يوتيوب أو درايف، أو ارفع MP4 (لحد 10 ميجا)','video']],
 clients:[['name','Client name|اسم العميل'],['logo','Logo|اللوجو','image']],
 products:[
  ['cat','Section|القسم','select',()=>cats('shop').map(c=>[c.id,L(c.name)])],
  ['kind','Type|النوع','select',()=>[['product',t('Product / package','منتج / باقة')],['course',t('Course','كورس')]]],
  ['name.en','Name (EN)|الاسم (EN)'],['name.ar','Name (AR)|الاسم (AR)'],
  ['desc.en','Description (EN)|الوصف (EN)','area'],['desc.ar','Description (AR)|الوصف (AR)','area'],
  ['img','Image (optional)|صورة (اختياري)','image'],
  ['unit','Sold by|بيتباع بـ','select',()=>[['item',t('One item / package','حاجة واحدة / باقة')],['piece',t('Piece','القطعة')],['meter',t('Meter','المتر')],['sheet',t('Sheet','الورقة')]]],
  ['pricing','Price type|نوع السعر','select',()=>[['total',t('Fixed total price (a pack)','سعر إجمالي ثابت (عبوة)')],['per',t('Price per piece / meter / sheet','سعر للقطعة / المتر / الورقة')]]],
  ['price','Price EGP (per unit, or the total price)|السعر بالجنيه (للوحدة، أو الإجمالي)','number'],
  ['amount','Units in one pack, e.g. 100 sheets|عدد الوحدات في العبوة، مثلاً 100 ورقة','number'],
  ['min','Minimum quantity|أقل كمية','number'],['step','Quantity step, e.g. 0.5 for half a meter|مقدار الزيادة، مثلاً 0.5 لنص متر','number'],
  ['per.en','Billing text (EN), e.g. per month|نص الدفع (EN)، مثلاً شهرياً'],['per.ar','Billing text (AR)|نص الدفع (AR)'],
  ['tag.en','Small label (EN)|ليبل صغير (EN)'],['tag.ar','Small label (AR)|ليبل صغير (AR)'],
  ['items.en','Features EN, one per line|المميزات EN، كل سطر ميزة','area'],['items.ar','Features AR, one per line|المميزات AR، كل سطر ميزة','area'],
  ['episodes','Course: number of episodes|الكورس: عدد الحلقات','number'],['hours','Course: total hours|الكورس: عدد الساعات','number'],
  ['disc','Discount % (0 = no discount)|الخصم % (0 = من غير خصم)','number'],
  ['discEnds','Discount ends at (empty = no countdown)|الخصم بينتهي في (فاضي = من غير عد تنازلي)','datetime']],
 buttons:[['label.en','Label (EN)|النص (EN)'],['label.ar','Label (AR)|النص (AR)'],['href','Link|الرابط']],
 contact:[['email','Email|الإيميل'],['whatsapp','WhatsApp number with country code|رقم الواتساب بكود الدولة']],
 social:[['facebook','Facebook link|لينك فيسبوك'],['instagram','Instagram link|لينك إنستجرام'],['tiktok','TikTok link|لينك تيك توك']]};
const TITLE={work:['project','المشروع'],clients:['client','العميل'],products:['product or course','المنتج أو الكورس'],buttons:['button','الزر'],contact:['contact details','بيانات التواصل'],social:['social links','لينكات السوشيال']};
const SINGLE=['contact','social'];
const lab=s=>t(...s.split('|'));
const get=(o,p)=>p.split('.').reduce((a,k)=>a==null?a:a[k],o);
const setp=(o,p,v)=>{const k=p.split('.');k.slice(0,-1).forEach(x=>o=o[x]=o[x]||{});o[k[k.length-1]]=v};
const find=(kind,id)=>kind==='buttons'?DB.buttons[id]:SINGLE.includes(kind)?DB[kind]:DB[kind].find(x=>x.id===id);
const jj=r=>r.json().catch(()=>({}));
const apply=async j=>{if(j&&j.content){DB=j.content;cacheDB(DB);runHooks()}else await reloadContent()};

/* images are shrunk before upload so saving is fast */
function shrink(file){
  if(!/^image\/(png|jpeg)$/.test(file.type)||file.size<500000)return Promise.resolve(file);
  return new Promise(res=>{const i=new Image(),u=URL.createObjectURL(file);
    i.onload=()=>{const k=Math.min(1,1600/Math.max(i.width,i.height));URL.revokeObjectURL(u);if(k===1&&file.size<1.5e6)return res(file);
      const c=document.createElement('canvas');c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);c.getContext('2d').drawImage(i,0,0,c.width,c.height);c.toBlob(b=>res(b||file),file.type,.85)};
    i.onerror=()=>res(file);i.src=u});
}
async function upImage(file){const r=await fetch('/api/admin/upload',{method:'POST',body:await shrink(file)}),j=await jj(r);if(!r.ok)throw new Error(errT(j.error||'Bad response'));return j.path}
function poster(file){
  return new Promise(res=>{const v=document.createElement('video'),u=URL.createObjectURL(file);v.muted=true;v.playsInline=true;v.preload='metadata';
    v.onloadeddata=()=>{v.currentTime=Math.min(1,(v.duration||1)/2)};
    v.onseeked=()=>{try{const k=Math.min(1,1280/Math.max(v.videoWidth,v.videoHeight)),c=document.createElement('canvas');c.width=Math.round(v.videoWidth*k);c.height=Math.round(v.videoHeight*k);c.getContext('2d').drawImage(v,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>res(b),'image/jpeg',.85)}catch(e){res(null)}};
    v.onerror=()=>res(null);v.src=u;setTimeout(()=>res(null),8000)});
}

const dlocal=iso=>{const d=new Date(iso),p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+'T'+p(d.getHours())+':'+p(d.getMinutes())};
const dlg=document.createElement('dialog');document.body.appendChild(dlg);
function btn(cls,txt,type){const b=document.createElement('button');b.className=cls;b.type=type||'button';b.textContent=txt;return b}
function editor(kind,id){
  const it=id||SINGLE.includes(kind)?find(kind,id):null,isNew=!it;
  const form=document.createElement('form'),h=document.createElement('h3');
  h.textContent=(isNew?t('Add ','إضافة '):t('Edit ','تعديل '))+t(...TITLE[kind]);form.appendChild(h);
  const inputs={};
  FIELDS[kind].forEach(([p,l,type,opts])=>{
    const w=document.createElement('label'),s=document.createElement('span');s.textContent=lab(l);w.appendChild(s);
    let el;
    if(type==='select'){el=document.createElement('select');(typeof opts==='function'?opts():opts).forEach(o=>{const [v,l]=Array.isArray(o)?o:[o,o];const op=document.createElement('option');op.value=v;op.textContent=l;el.appendChild(op)})}
    else if(type==='area'){el=document.createElement('textarea');el.rows=3}
    else{el=document.createElement('input');if(type==='number'){el.type='number';el.min=0;el.step='any'}if(type==='datetime')el.type='datetime-local'}
    const src=it&&kind==='products'?pdef(it):it;let v=src?get(src,p):'';
    if(type==='datetime')v=v?dlocal(v):'';
    if(kind==='products'&&p.startsWith('items.'))v=it?it.items.map(x=>x[p.slice(6)]).join('\n'):'';
    el.value=v==null?'':v;inputs[p]=el;w.appendChild(el);
    if(type==='image'){
      const f=document.createElement('input');f.type='file';f.accept='image/png,image/jpeg,image/webp';
      const pv=document.createElement('img');pv.style.cssText='max-height:110px;max-width:100%;object-fit:contain;border-radius:12px;display:none';
      const show=()=>{pv.src=el.value;pv.style.display=el.value?'block':'none'};show();el.addEventListener('input',show);
      f.onchange=async()=>{const file=f.files[0];if(!file)return;ok.disabled=true;msg.className='msg';msg.textContent=t('Uploading the image, please wait...','بيرفع الصورة، استنى شوية...');
        try{el.value=await upImage(file);show();msg.textContent=''}catch(e){msg.className='msg err';msg.textContent=e.message||t('Upload failed, try again.','الرفع فشل، جرّب تاني.')}
        ok.disabled=false};
      w.append(f,pv);
    }
    if(type==='video'){
      const f=document.createElement('input');f.type='file';f.accept='video/mp4,video/webm';
      f.onchange=async()=>{const file=f.files[0];if(!file)return;
        if(file.size>10*1024*1024){msg.className='msg err';msg.textContent=t('This video is bigger than 10 MB. Upload it to YouTube or Google Drive and paste the link instead.','الفيديو أكبر من 10 ميجا. ارفعه على يوتيوب أو جوجل درايف وحط اللينك هنا.');f.value='';return}
        ok.disabled=true;msg.className='msg';msg.textContent=t('Uploading the video, this can take a minute...','بيرفع الفيديو، ممكن ياخد دقيقة...');
        try{const r=await fetch('/api/admin/upload-video',{method:'POST',body:file}),j=await jj(r);if(!r.ok)throw new Error(errT(j.error||'Bad response'));el.value=j.video;msg.textContent='';
          if(!inputs.img.value){const pb=await poster(file);if(pb){msg.textContent=t('Making a cover image...','بيعمل صورة غلاف...');inputs.img.value=await upImage(pb);inputs.img.dispatchEvent(new Event('input'));msg.textContent=''}}}
        catch(e){msg.className='msg err';msg.textContent=e.message||t('Upload failed, try again.','الرفع فشل، جرّب تاني.')}
        ok.disabled=false};
      w.append(f);
    }
    form.appendChild(w);
  });
  if(kind==='products'){
    const show=(p,on)=>{const w=inputs[p]&&inputs[p].closest('label');if(w)w.style.display=on?'':'none'};
    const refresh=()=>{const course=inputs.kind.value==='course',unit=inputs.unit.value,per=inputs.pricing.value==='per',multi=!course&&unit!=='item';
      show('unit',!course);show('pricing',multi);show('amount',multi&&!per);show('min',multi&&per);show('step',multi&&per);show('per.en',!course&&unit==='item');show('per.ar',!course&&unit==='item');show('episodes',course);show('hours',course)};
    ['kind','unit','pricing'].forEach(k=>inputs[k].addEventListener('change',refresh));refresh();
  }
  const msg=document.createElement('p');msg.className='msg err';form.appendChild(msg);
  const row=document.createElement('div');row.className='row';
  const ok=btn('btn',t('Save','حفظ'),'submit'),no=btn('btn ghost',t('Cancel','إلغاء'));no.onclick=()=>dlg.close();
  row.append(ok,no);
  if(it&&['work','clients','products'].includes(kind)){
    const del=btn('btn del',t('Delete','حذف'));
    del.onclick=async()=>{if(!confirm(t('Delete this item?','تحذف العنصر ده؟')))return;del.disabled=true;
      const r=await fetch(`/api/admin/${kind}/${id}`,{method:'DELETE'}),j=await jj(r);if(r.ok){await apply(j);dlg.close()}else{del.disabled=false;msg.textContent=errT(j.error||'Bad response')}};
    row.appendChild(del);
  }
  form.appendChild(row);
  form.onsubmit=async e=>{
    e.preventDefault();const data={};
    Object.entries(inputs).forEach(([p,el])=>{if(!(kind==='products'&&p.startsWith('items.')))setp(data,p,el.type==='datetime-local'?(el.value?new Date(el.value).toISOString():''):el.value)});
    if(kind==='products'){const en=inputs['items.en'].value.split('\n').map(s=>s.trim()).filter(Boolean),a=inputs['items.ar'].value.split('\n').map(s=>s.trim()).filter(Boolean);
      data.items=Array.from({length:Math.max(en.length,a.length)},(_,i)=>({en:en[i]||a[i]||'',ar:a[i]||en[i]||''}))}
    const url=kind==='contact'?'/api/admin/contact':kind==='social'?'/api/admin/social':kind==='buttons'?`/api/admin/buttons/${id}`:`/api/admin/${kind}${id?'/'+id:''}`;
    ok.disabled=true;msg.className='msg';msg.textContent=t('Saving...','بيحفظ...');
    const r=await fetch(url,{method:id||SINGLE.includes(kind)?'PUT':'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)}),j=await jj(r);
    if(r.ok){await apply(j);dlg.close()}else{ok.disabled=false;msg.className='msg err';msg.textContent=errT(j.error||'Error')}
  };
  dlg.replaceChildren(form);dlg.showModal();
}

/* sections (categories) for the portfolio and the shop */
function catEditor(kind){
  const list=JSON.parse(JSON.stringify(cats(kind))),form=document.createElement('form'),h=document.createElement('h3'),box=document.createElement('div');
  h.textContent=kind==='shop'?t('Shop sections','أقسام المتجر'):t('Portfolio sections','أقسام الشغل');form.appendChild(h);box.className='catlist';form.appendChild(box);
  const note=document.createElement('p');note.style.cssText='opacity:.75;font-size:.9rem';note.textContent=kind==='shop'?t('Deleting a section moves its products to the first section.','لو مسحت قسم، منتجاته بتروح لأول قسم.'):t('Deleting a section keeps its projects, they just show under All.','لو مسحت قسم، مشاريعه بتفضل موجودة وبتظهر في "الكل".');form.appendChild(note);
  const draw=()=>{box.replaceChildren();list.forEach((c,i)=>{
    const r=document.createElement('div');r.className='catrow';
    const en=document.createElement('input'),arb=document.createElement('input'),x=btn('catx','×');en.placeholder='English';arb.placeholder='العربي';arb.dir='rtl';en.value=c.name.en||'';arb.value=c.name.ar||'';
    en.oninput=()=>c.name.en=en.value;arb.oninput=()=>c.name.ar=arb.value;x.setAttribute('aria-label','Delete');x.onclick=()=>{list.splice(i,1);draw()};
    r.append(en,arb,x);box.appendChild(r)})};
  draw();
  const add=btn('btn ghost',t('+ Add section','+ ضيف قسم'));add.onclick=()=>{list.push({id:'',name:{en:'',ar:''}});draw()};form.appendChild(add);
  const msg=document.createElement('p');msg.className='msg err';form.appendChild(msg);
  const row=document.createElement('div');row.className='row';const ok=btn('btn',t('Save','حفظ'),'submit'),no=btn('btn ghost',t('Cancel','إلغاء'));no.onclick=()=>dlg.close();row.append(ok,no);form.appendChild(row);
  form.onsubmit=async e=>{e.preventDefault();ok.disabled=true;msg.className='msg';msg.textContent=t('Saving...','بيحفظ...');
    const r=await fetch('/api/admin/categories',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({kind:kind,list:list})}),j=await jj(r);
    if(r.ok){await apply(j);dlg.close()}else{ok.disabled=false;msg.className='msg err';msg.textContent=errT(j.error||'Error')}};
  dlg.replaceChildren(form);dlg.showModal();
}

/* edit any text or image of the page: switch on "Edit page", then click it */
function textEditor(el){
  const key=el.dataset.en,tx=(DB.texts||{})[key]||{},form=document.createElement('form'),h=document.createElement('h3');
  h.textContent=t('Edit text','تعديل النص');form.appendChild(h);
  const mk=(lb,val,rtl)=>{const w=document.createElement('label'),s=document.createElement('span'),a=document.createElement('textarea');s.textContent=lb;a.rows=3;a.value=val;if(rtl)a.dir='rtl';w.append(s,a);form.appendChild(w);return a};
  const en=mk('English',tx.en||key),arb=mk('العربي',tx.ar||el.dataset.ar||'',true);
  const msg=document.createElement('p');msg.className='msg err';form.appendChild(msg);
  const row=document.createElement('div');row.className='row';const ok=btn('btn',t('Save','حفظ'),'submit'),no=btn('btn ghost',t('Cancel','إلغاء')),rs=btn('btn del',t('Back to default','رجّعه للأصلي'));no.onclick=()=>dlg.close();
  const send=async body=>{ok.disabled=true;msg.className='msg';msg.textContent=t('Saving...','بيحفظ...');
    const r=await fetch('/api/admin/texts',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(body)}),j=await jj(r);
    if(r.ok){await apply(j);dlg.close()}else{ok.disabled=false;msg.className='msg err';msg.textContent=errT(j.error||'Error')}};
  form.onsubmit=e=>{e.preventDefault();send({key:key,en:en.value,ar:arb.value})};rs.onclick=()=>send({key:key,reset:true});
  row.append(ok,no,rs);form.appendChild(row);dlg.replaceChildren(form);dlg.showModal();
}
function imageEditor(img){
  const key=img.dataset.o,form=document.createElement('form'),h=document.createElement('h3');h.textContent=t('Change this image','تغيير الصورة دي');form.appendChild(h);
  const pv=document.createElement('img');pv.src=img.src;pv.style.cssText='max-width:100%;max-height:150px;background:#1d1d1b;border-radius:12px;padding:8px;margin-bottom:10px';form.appendChild(pv);
  const f=document.createElement('input');f.type='file';f.accept='image/png,image/jpeg,image/webp';form.appendChild(f);
  const msg=document.createElement('p');msg.className='msg err';form.appendChild(msg);
  const row=document.createElement('div');row.className='row';const ok=btn('btn',t('Save','حفظ'),'submit'),no=btn('btn ghost',t('Cancel','إلغاء')),rs=btn('btn del',t('Back to default','رجّعها للأصلية'));no.onclick=()=>dlg.close();ok.disabled=true;let path='';
  f.onchange=async()=>{const file=f.files[0];if(!file)return;msg.className='msg';msg.textContent=t('Uploading the image, please wait...','بيرفع الصورة، استنى شوية...');
    try{path=await upImage(file);pv.src=path;msg.textContent='';ok.disabled=false}catch(e){msg.className='msg err';msg.textContent=e.message}};
  const send=async body=>{ok.disabled=true;const r=await fetch('/api/admin/images',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(body)}),j=await jj(r);
    if(r.ok){await apply(j);dlg.close()}else{msg.className='msg err';msg.textContent=errT(j.error||'Error')}};
  form.onsubmit=e=>{e.preventDefault();send({key:key,url:path})};rs.onclick=()=>send({key:key,reset:true});
  row.append(ok,no,rs);form.appendChild(row);dlg.replaceChildren(form);dlg.showModal();
}
document.addEventListener('click',e=>{
  if(!document.body.classList.contains('textedit')||e.target.closest('.abar,dialog'))return;
  const im=e.target.closest('img[data-o]');
  if(im){e.preventDefault();e.stopPropagation();imageEditor(im);return}
  const el=e.target.closest('[data-ar]');if(!el)return;
  e.preventDefault();e.stopPropagation();textEditor(el);
},true);

/* floating bar */
const bar=document.createElement('div');bar.className='abar';
function drawBar(){
  bar.replaceChildren();const b=document.createElement('b');b.textContent='✎ '+t('Admin','الأدمن');bar.appendChild(b);
  (ACTIONS[here]||[]).forEach(([en,a,k])=>{const x=btn('',t(en,a));x.onclick=()=>k.startsWith('cats:')?catEditor(k.slice(5)):editor(k);bar.appendChild(x)});
  const on=document.body.classList.contains('textedit'),tx=btn(on?'on':'',on?t('Done editing','خلّصت التعديل'):t('Edit page','تعديل الصفحة'));
  tx.onclick=()=>{document.body.classList.toggle('textedit');drawBar()};bar.appendChild(tx);
  const so=btn('',t('Social links','لينكات السوشيال'));so.onclick=()=>editor('social');bar.appendChild(so);
  const c=btn('',t('Contact info','بيانات التواصل'));c.onclick=()=>editor('contact');bar.appendChild(c);
  const d=document.createElement('a');d.href='dashboard.html';d.textContent=t('Dashboard','لوحة التحكم');bar.appendChild(d);
  const o=btn('',t('Logout','خروج'));o.onclick=async()=>{await post('/api/logout',{});location.href='index.html'};bar.appendChild(o);
}
document.body.appendChild(bar);drawBar();document.addEventListener('langchange',drawBar);

/* per-item edit buttons */
function decorate(){
  document.querySelectorAll('[data-k]:not([data-ed])').forEach(el=>{
    el.dataset.ed=1;const b=document.createElement('button');b.className='edit';b.type='button';b.textContent='✎';b.setAttribute('aria-label','Edit');
    b.onclick=e=>{e.preventDefault();e.stopPropagation();editor(el.dataset.k,el.dataset.id)};
    el.appendChild(b);
  });
  document.querySelectorAll('[data-btn]:not([data-ed])').forEach(el=>{
    el.dataset.ed=1;const b=document.createElement('button');b.className='edit inl';b.type='button';b.textContent='✎';b.setAttribute('aria-label','Edit button');
    b.onclick=e=>{e.preventDefault();editor('buttons',el.dataset.btn)};el.insertAdjacentElement('afterend',b);
  });
}
let q;new MutationObserver(()=>{cancelAnimationFrame(q);q=requestAnimationFrame(decorate)}).observe(document.body,{childList:true,subtree:true});
decorate();
})();
