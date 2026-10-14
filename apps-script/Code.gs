/**
 * Hook backend on Google Apps Script + Google Sheets. Steps: see README.md
 */
const ADMIN_USER = 'mido';
const ADMIN_EMAIL = 'mm.Mido1270@gmail.com';
const ADMIN_PW = 'CHANGE_ME';        // type your password here, run setup() once, then put CHANGE_ME back
const GOOGLE_CLIENT_ID = '';         // optional: Google "Web application" client ID for Sign in with Google
const ROUNDS_OLD = 400, ROUNDS = 120, TZ = 'Africa/Cairo';
const CATS = ['Design', 'Content', 'Media Buying'];
const SEED = {"work": [{"id": "w1", "cat": "Design", "name": {"en": "JMG Real Estate", "ar": "JMG Real Estate"}, "desc": {"en": "Designs that bring properties to life: social graphics, ads, brochures, site maps and branding that sells the lifestyle before the unit.", "ar": "تصاميم بتخلّي العقار يتكلم: جرافيك سوشيال وإعلانات وبروشورات وخرايط مواقع وهوية بتبيع الحياة اللي حواليك قبل الوحدة."}, "img": "img/jmg-design.jpg"}, {"id": "w2", "cat": "Design", "name": {"en": "M.A Express", "ar": "M.A Express"}, "desc": {"en": "Designs that deliver confidence: branded packaging, truck graphics, social visuals and ads for a shipping company.", "ar": "تصاميم بتبني الثقة: تغليف بهوية الشركة وجرافيك للعربيات وتصاميم سوشيال وإعلانات لشركة شحن."}, "img": "img/ma-design.jpg"}, {"id": "w3", "cat": "Design", "name": {"en": "Lumière Candles", "ar": "Lumière Candles"}, "desc": {"en": "Warm designs for warm moments: packaging, labels and social content for handmade candles.", "ar": "تصاميم دافية للحظات دافية: تغليف وستيكرات ومحتوى سوشيال لشموع هاند ميد."}, "img": "img/lumiere-design.jpg"}, {"id": "w4", "cat": "Content", "name": {"en": "Global Premier Properties", "ar": "Global Premier Properties"}, "desc": {"en": "Real estate content that sells before the site is built, from ad creatives to brand storytelling.", "ar": "محتوى عقاري بيبيع قبل ما المشروع يتبني، من الإعلانات لحكاية البراند."}, "img": "img/gpp-content.jpg"}, {"id": "w5", "cat": "Content", "name": {"en": "BestRate", "ar": "BestRate"}, "desc": {"en": "Content for the shipping industry: social posts and ad copy that highlight speed, safety and trust.", "ar": "محتوى لشركات الشحن: بوستات وإعلانات بتوضّح السرعة والأمان والثقة."}, "img": "img/bestrate-content.jpg"}, {"id": "w6", "cat": "Content", "name": {"en": "Silsal Corporation", "ar": "مؤسسة سلسال"}, "desc": {"en": "Persuasive content for postgraduate courses and executive diplomas.", "ar": "محتوى مقنع لبرامج الدراسات العليا والدبلومات التنفيذية."}, "img": "img/silsal-content.jpg"}, {"id": "w7", "cat": "Media Buying", "name": {"en": "JMG Real Estate", "ar": "JMG Real Estate"}, "desc": {"en": "Meta Ads and Google Display campaigns for qualified buyers. Two projects delivered 253 and 158 conversations.", "ar": "حملات ميتا وجوجل ديسبلاي بتوصل لمشترين جادين. مشروعين جابوا 253 و158 محادثة."}, "img": "img/jmg-media.jpg"}, {"id": "w8", "cat": "Media Buying", "name": {"en": "The Act of Teaching", "ar": "The Act of Teaching"}, "desc": {"en": "Ad campaigns for online courses: 362 conversations at 4.56 EGP per conversation.", "ar": "حملات إعلانية لكورسات أونلاين: 362 محادثة بتكلفة 4.56 ج.م للمحادثة."}, "img": "img/education-media.jpg"}], "clients": [{"id": "c1", "name": "Al-Malak", "logo": "logos/almalak.png"}, {"id": "c2", "name": "Holybelly", "logo": "logos/holybelly.png"}, {"id": "c3", "name": "2B Studio", "logo": "logos/2b-studio.png"}, {"id": "c4", "name": "BestRate", "logo": "logos/bestrate.png"}, {"id": "c5", "name": "JMG Real Estate", "logo": "logos/jmg.png"}, {"id": "c6", "name": "Silsal Corporation", "logo": "logos/silsal.png"}, {"id": "c7", "name": "Charly", "logo": "logos/charly.png"}, {"id": "c8", "name": "Bucharest Black", "logo": "logos/bucharest-black.png"}, {"id": "c9", "name": "Levai & Loris", "logo": "logos/levai-loris.png"}, {"id": "c10", "name": "Gramophone Co-Working Space", "logo": "logos/gramophone.png"}, {"id": "c11", "name": "M.A Express", "logo": "logos/ma-express.png"}, {"id": "c12", "name": "Global Premier Properties", "logo": "logos/gpp.png"}, {"id": "c13", "name": "The Act of Teaching", "logo": "logos/act-of-teaching.png"}, {"id": "c14", "name": "Lumière", "logo": "logos/lumiere.png"}], "products": [{"id": "p1", "name": {"en": "Social Media Starter", "ar": "باقة السوشيال الأساسية"}, "price": 3500, "per": {"en": "month", "ar": "في الشهر"}, "tag": {"en": "Social media", "ar": "سوشيال ميديا"}, "items": [{"en": "12 designed posts", "ar": "12 بوست مصمم"}, {"en": "4 stories", "ar": "4 ستوريز"}, {"en": "Basic community replies", "ar": "ردود أساسية على الكومنتات والرسايل"}], "cat": "packages"}, {"id": "p2", "name": {"en": "Social Media Growth", "ar": "باقة السوشيال للنمو"}, "price": 6500, "per": {"en": "month", "ar": "في الشهر"}, "tag": {"en": "Social media", "ar": "سوشيال ميديا"}, "items": [{"en": "20 designed posts", "ar": "20 بوست مصمم"}, {"en": "8 videos or reels", "ar": "8 فيديوهات أو ريلز"}, {"en": "Full community management", "ar": "إدارة كاملة للكومنتات والرسايل"}, {"en": "Monthly report", "ar": "تقرير شهري"}], "cat": "packages"}, {"id": "p3", "name": {"en": "Brand Identity", "ar": "الهوية البصرية"}, "price": 8000, "per": {"en": "one time", "ar": "مرة واحدة"}, "tag": {"en": "Branding", "ar": "هوية"}, "items": [{"en": "Logo and color palette", "ar": "لوجو وألوان البراند"}, {"en": "Typography", "ar": "خطوط البراند"}, {"en": "Social media templates", "ar": "قوالب سوشيال ميديا"}], "cat": "packages"}, {"id": "p4", "name": {"en": "Ads Management", "ar": "إدارة الإعلانات"}, "price": 4000, "per": {"en": "month + ad spend", "ar": "في الشهر + ميزانية الإعلان"}, "tag": {"en": "Media buying", "ar": "شراء إعلانات"}, "items": [{"en": "Meta Ads campaigns", "ar": "حملات ميتا"}, {"en": "Audience targeting", "ar": "استهداف الجمهور"}, {"en": "Weekly optimization", "ar": "تحسين أسبوعي"}], "cat": "packages"}, {"id": "p5", "name": {"en": "Content Pack", "ar": "باقة المحتوى"}, "price": 2500, "per": {"en": "one time", "ar": "مرة واحدة"}, "tag": {"en": "Content", "ar": "محتوى"}, "items": [{"en": "15 written posts", "ar": "15 بوست مكتوب"}, {"en": "Ad copy variations", "ar": "كذا نسخة للإعلان الواحد"}, {"en": "Brand voice guide", "ar": "دليل أسلوب كلام البراند"}], "cat": "packages"}, {"id": "p6", "name": {"en": "Full Launch Bundle", "ar": "باقة الإطلاق الكاملة"}, "price": 15000, "per": {"en": "one time", "ar": "مرة واحدة"}, "tag": {"en": "Bundle", "ar": "باقة شاملة"}, "items": [{"en": "Brand identity", "ar": "هوية بصرية"}, {"en": "1 month of social media", "ar": "شهر سوشيال ميديا"}, {"en": "1 month of ads management", "ar": "شهر إدارة إعلانات"}], "cat": "packages"}], "buttons": {"hero1": {"label": {"en": "Start a project", "ar": "ابدأ مشروعك"}, "href": "contact.html"}, "hero2": {"label": {"en": "See our work", "ar": "شوف أعمالنا"}, "href": "portfolio.html"}, "workAll": {"label": {"en": "View all work", "ar": "شوف كل الأعمال"}, "href": "portfolio.html"}, "cta": {"label": {"en": "Contact us", "ar": "كلمنا"}, "href": "contact.html"}, "servicesShop": {"label": {"en": "Browse packages in the shop", "ar": "شوف الباقات في المتجر"}, "href": "shop.html"}}, "contact": {"email": "mm.Mido1270@gmail.com", "whatsapp": "201120767519"}, "social": {"facebook": "https://www.facebook.com/", "instagram": "https://www.instagram.com/", "tiktok": "https://www.tiktok.com/"}, "texts": {}, "images": {}, "categories": {"work": [{"id": "Design", "name": {"en": "Design", "ar": "تصميم"}}, {"id": "Content", "name": {"en": "Content", "ar": "محتوى"}}, {"id": "Media Buying", "name": {"en": "Media Buying", "ar": "شراء إعلانات"}}], "shop": [{"id": "packages", "name": {"en": "Marketing packages", "ar": "باقات التسويق"}}]}};
const HEADS = {
  users: ['id', 'username', 'email', 'role', 'salt', 'hash', 'at', 'name', 'twofa', 'notif', 'lang', 'avatar'],
  orders: ['id', 'at', 'user', 'items', 'total', 'status'], events: ['day', 'type', 'a', 'vid'],
  notifs: ['id', 'uid', 'at', 'json', 'read'], reports: ['id', 'uid', 'username', 'at', 'subject', 'message', 'status', 'replies'],
  outbox: ['id', 'at', 'to', 'bcc', 'subject', 'html', 'status'], data: ['key', 'c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6']
};

/* ---------- sheets (one handle per execution) ---------- */
let SS_ = null; const SH_ = {}; let NQ_ = [], MQ_ = [];
function ss_() { return SS_ || (SS_ = SpreadsheetApp.getActiveSpreadsheet()); }
function sheet_(n) {
  if (SH_[n]) return SH_[n]; let s = ss_().getSheetByName(n);
  if (!s) { s = ss_().insertSheet(n); if (HEADS[n]) { s.appendRow(HEADS[n]); s.setFrozenRows(1); } if (n === 'events') s.getRange(1, 1, s.getMaxRows(), 1).setNumberFormat('@'); }
  return SH_[n] = s;
}
function rows_(n) { const s = sheet_(n), r = s.getLastRow(); return r < 2 ? [] : s.getRange(2, 1, r - 1, Math.max(s.getLastColumn(), HEADS[n] ? HEADS[n].length : 1)).getValues(); }
function rowOf_(n, id) { const r = rows_(n); for (let i = 0; i < r.length; i++) if (String(r[i][0]) === String(id)) return i + 2; return 0; }
function cache_() { return CacheService.getScriptCache(); }
function lock_(fn) { const l = LockService.getScriptLock(); l.waitLock(20000); try { return fn(); } finally { l.releaseLock(); } }
function day_(d) { return Utilities.formatDate(d || new Date(), TZ, 'yyyy-MM-dd'); }
function dayOf_(v) { return v instanceof Date ? Utilities.formatDate(v, ss_().getSpreadsheetTimeZone(), 'yyyy-MM-dd') : String(v).slice(0, 10); }
function iso_(v) { return v instanceof Date ? v.toISOString() : String(v); }
function id_(p) { return p + Utilities.getUuid().replace(/-/g, '').slice(0, 8); }

/* ---------- site content: ONE row in the "data" sheet ---------- */
function legacyRows_(n) { const s = ss_().getSheetByName(n); return !s || s.getLastRow() < 2 ? [] : s.getRange(2, 1, s.getLastRow() - 1, 2).getValues(); }
const DEFCATS = { work: [{ id: 'Design', name: { en: 'Design', ar: 'تصميم' } }, { id: 'Content', name: { en: 'Content', ar: 'محتوى' } }, { id: 'Media Buying', name: { en: 'Media Buying', ar: 'شراء إعلانات' } }], shop: [{ id: 'packages', name: { en: 'Marketing packages', ar: 'باقات التسويق' } }] };
function normProd_(p) {
  p.cat = p.cat || 'packages'; p.kind = p.kind === 'course' ? 'course' : 'product'; p.unit = ['item', 'piece', 'meter', 'sheet'].indexOf(p.unit) >= 0 ? p.unit : 'item';
  p.pricing = p.pricing === 'per' && p.unit !== 'item' ? 'per' : 'total'; p.desc = p.desc || { en: '', ar: '' }; p.tag = p.tag || { en: '', ar: '' }; p.per = p.per || { en: '', ar: '' }; p.items = p.items || [];
  p.img = p.img || ''; p.amount = +p.amount || 0; p.min = +p.min || 1; p.step = +p.step || 1; p.disc = +p.disc || 0; p.discEnds = p.discEnds || ''; p.episodes = +p.episodes || 0; p.hours = +p.hours || 0; return p;
}
function norm_(c) {
  c.work = c.work || []; c.clients = c.clients || []; c.products = (c.products || []).map(normProd_);
  c.categories = c.categories || {}; c.categories.work = c.categories.work || JSON.parse(JSON.stringify(DEFCATS.work)); c.categories.shop = c.categories.shop || JSON.parse(JSON.stringify(DEFCATS.shop));
  c.buttons = c.buttons || SEED.buttons; c.contact = c.contact || SEED.contact; c.social = c.social || SEED.social; c.texts = c.texts || {}; c.images = c.images || {}; return c;
}
function readContent_() {
  const s = sheet_('data'), r = s.getLastRow(); if (r < 2) return null;
  const v = s.getRange(2, 1, r - 1, 8).getValues();
  for (let i = 0; i < v.length; i++) if (v[i][0] === 'content') { try { return { row: i + 2, c: norm_(JSON.parse(v[i].slice(1).join(''))) }; } catch (e) { return null; } }
  return null;
}
function getContent_() {
  const k = cache_().get('content'); if (k) { try { return norm_(JSON.parse(k)); } catch (e) {} }
  const d = readContent_(); let c;
  if (d) c = d.c;
  else {
    const w = legacyRows_('work').map(x => JSON.parse(x[1])), cfg = {}; legacyRows_('config').forEach(x => cfg[x[0]] = JSON.parse(x[1]));
    c = norm_(w.length ? { work: w, clients: legacyRows_('clients').map(x => JSON.parse(x[1])), products: legacyRows_('products').map(x => JSON.parse(x[1])), buttons: cfg.buttons, contact: cfg.contact, texts: cfg.texts } : JSON.parse(JSON.stringify(SEED)));
    saveContent_(c);
  }
  try { cache_().put('content', JSON.stringify(c), 21600); } catch (e) {} return c;
}
function saveContent_(c) {
  const js = JSON.stringify(c), parts = []; for (let i = 0; i < 7; i++) parts.push(js.slice(i * 45000, (i + 1) * 45000));
  if (js.length > 315000) throw new Error('Content is too large');
  const d = readContent_(), s = sheet_('data'), row = ['content'].concat(parts);
  if (d) s.getRange(d.row, 1, 1, 8).setValues([row]); else s.appendRow(row);
  try { cache_().put('content', js, 21600); } catch (e) {} return c;
}

/* ---------- users and tokens ---------- */
function secret_() { return PropertiesService.getScriptProperties().getProperty('SECRET'); }
function sig_(s) { return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(s, secret_())); }
function same_(a, b) { a = String(a); b = String(b); if (a.length !== b.length) return false; let x = 0; for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i); return x === 0; }
function hashPw_(pw, salt, rounds) { rounds = rounds || ROUNDS; let h = pw + salt; for (let i = 0; i < rounds; i++) h = Utilities.base64Encode(Utilities.computeHmacSha256Signature(h, salt + pw)); return (rounds === ROUNDS_OLD ? 'h:' : 'k:') + h; }
function checkPw_(u, pw) { const old = String(u.hash).indexOf('h:') === 0; return same_(hashPw_(String(pw || ''), u.salt, old ? ROUNDS_OLD : ROUNDS), u.hash); }
function mkTok_(u, pending, remember) { const ttl = pending ? 10 * 60e3 : remember === false ? 12 * 3600e3 : 30 * 864e5; const p = u.id + '.' + (Date.now() + ttl) + '.' + (pending ? 'p' : u.role === 'admin' ? 'a' : 'u'); return p + '.' + sig_(p); }
function claims_(t) { const a = String(t || '').split('.'); if (a.length !== 4 || !same_(sig_(a.slice(0, 3).join('.')), a[3]) || +a[1] < Date.now()) return null; return { uid: a[0], r: a[2] }; }
function userObj_(r) { const un = String(r[1]); return { id: String(r[0]), username: un, email: String(r[2]), role: String(r[3]), salt: String(r[4]), hash: String(r[5]), at: iso_(r[6]), name: String(r[7] || un), twofa: +r[8] === 1, notif: String(r[9]) !== '0', lang: String(r[10] || 'en'), avatar: String(r[11] || '') }; }
function users_() {
  const c = cache_().get('users'); if (c) return JSON.parse(c);
  const u = rows_('users').map(userObj_); try { cache_().put('users', JSON.stringify(u), 1800); } catch (e) {} return u;
}
function userById_(id) { return users_().filter(u => u.id === id)[0] || null; }
function userFromTok_(t) { const c = claims_(t); if (!c || c.r === 'p') return null; return userById_(c.uid); }
function pub_(u) { return u ? { username: u.username, name: u.name, email: u.email, role: u.role, twofa: u.twofa, notif: u.notif, lang: u.lang, avatar: u.avatar } : null; }
function setUser_(id, f) {
  const row = rowOf_('users', id); if (!row) return; const col = { email: 3, salt: 5, hash: 6, name: 8, twofa: 9, notif: 10, lang: 11, avatar: 12 }, s = sheet_('users');
  Object.keys(f).forEach(k => s.getRange(row, col[k]).setValue(f[k])); cache_().remove('users');
}
function addUser_(username, email, pw, role, lang, name, avatar) {
  const salt = Utilities.getUuid(), at = new Date().toISOString(), id = id_('u'), hash = hashPw_(pw, salt);
  sheet_('users').appendRow([id, username, email, role, salt, hash, at, name || username, 0, 1, lang || 'en', avatar || '']);
  const u = { id: id, username: username, email: email, role: role, salt: salt, hash: hash, at: at, name: name || username, twofa: false, notif: true, lang: lang || 'en', avatar: avatar || '' };
  const c = cache_().get('users'); if (c) { try { const l = JSON.parse(c); l.push(u); cache_().put('users', JSON.stringify(l), 1800); } catch (e) { cache_().remove('users'); } }
  return u;
}
function adminUser_() { return users_().filter(u => u.role === 'admin')[0]; }
function limited_(key, max, secs) { const c = cache_(), n = (+c.get(key) || 0) + 1; c.put(key, String(n), secs); return n > max; }
function genCode_() { const b = Utilities.computeHmacSha256Signature(Utilities.getUuid(), secret_()); return String(100000 + (((b[0] & 255) << 16 | (b[1] & 255) << 8 | (b[2] & 255)) % 900000)); }
function maskEmail_(e) { return String(e).replace(/^(.).*(@.*)$/, '$1***$2'); }

/* ---------- validation ---------- */
function S_(v, n) { return String(v == null ? '' : v).trim().slice(0, n || 300); }
function LS_(o, n) { return { en: S_(o && o.en, n), ar: S_(o && o.ar, n) }; }
function href_(h) { h = S_(h, 300); return /^\s*(javascript|data|vbscript):/i.test(h) ? '#' : h; }
function img_(p) { p = S_(p, 200); return (/^(img|logos|uploads)\/[\w.\-]+$/.test(p) || /^https:\/\/lh3\.googleusercontent\.com\/[\w\-\/=.]+$/.test(p)) ? p : ''; }
function url_(u) { u = S_(u, 200); return /^https:\/\/[^\s"'<>]+$/.test(u) ? u : ''; }
function video_(v) {
  v = S_(v, 300); let m;
  if ((m = v.match(/^https:\/\/drive\.google\.com\/file\/d\/([\w\-]+)/))) return 'https://drive.google.com/file/d/' + m[1] + '/preview';
  if ((m = v.match(/^https:\/\/(?:www\.|m\.)?youtube\.com\/watch\?(?:[^#\s]*&)?v=([\w\-]{6,15})/)) || (m = v.match(/^https:\/\/youtu\.be\/([\w\-]{6,15})/)) || (m = v.match(/^https:\/\/(?:www\.)?youtube\.com\/(?:embed|shorts)\/([\w\-]{6,15})/))) return 'https://www.youtube.com/embed/' + m[1];
  if (/^https:\/\/[^\s"'<>]+\.(mp4|webm)(\?[^\s"'<>]*)?$/i.test(v)) return v;
  return '';
}
function digits_(v) { let d = String(v || '').replace(/\D/g, ''); if (/^0\d{10}$/.test(d)) d = '20' + d.slice(1); return d; }
function emailOk_(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function catId_(list, id) { return (list || []).some(c => c.id === id) ? id : ''; }
function num_(v, lo, hi, d) { const k = Math.pow(10, d); return Math.max(lo, Math.min(hi, Math.round((Number(v) || 0) * k) / k)); }
function discOn_(p, now) { return +p.disc > 0 && (!p.discEnds || Date.parse(p.discEnds) > now); }
function effPrice_(p, now) { return discOn_(p, now) ? Math.round(p.price * (100 - p.disc)) / 100 : p.price; }
const clean = {
  work: (b, C) => ({ cat: catId_(C.categories.work, b.cat), name: LS_(b.name, 100), desc: LS_(b.desc, 600), img: img_(b.img), video: video_(b.video) }),
  clients: b => ({ name: S_(b.name, 80), logo: img_(b.logo) }),
  products: (b, C) => {
    const kind = b.kind === 'course' ? 'course' : 'product', unit = kind === 'course' ? 'item' : (['item', 'piece', 'meter', 'sheet'].indexOf(b.unit) >= 0 ? b.unit : 'item');
    const pricing = kind === 'product' && unit !== 'item' && b.pricing === 'per' ? 'per' : 'total', end = S_(b.discEnds, 40);
    return { name: LS_(b.name, 100), tag: LS_(b.tag, 60), desc: LS_(b.desc, 1500), img: img_(b.img), cat: catId_(C.categories.shop, b.cat) || (C.categories.shop[0] || {}).id || 'packages', kind: kind, unit: unit, pricing: pricing,
      price: num_(b.price, 0, 1e7, 2), amount: pricing === 'total' && unit !== 'item' ? num_(b.amount, 0, 1e6, 2) : 0, min: num_(b.min, 0, 1e5, 2) || 1, step: num_(b.step, 0, 1e5, 2) || 1, per: LS_(b.per, 60),
      items: (Array.isArray(b.items) ? b.items : []).slice(0, 12).map(i => LS_(i, 100)), episodes: kind === 'course' ? num_(b.episodes, 0, 5000, 0) : 0, hours: kind === 'course' ? num_(b.hours, 0, 5000, 1) : 0,
      disc: num_(b.disc, 0, 95, 0), discEnds: /^\d{4}-\d{2}-\d{2}T/.test(end) && !isNaN(Date.parse(end)) ? new Date(end).toISOString() : '' };
  }
};
function named_(c) { return typeof c.name === 'string' ? !!c.name : !!(c.name.en || c.name.ar); }
function R_(s, d, x) { const o = { s: s, d: d }; if (x) for (const k in x) o[k] = x[k]; return o; }
function bytes_(b64) {
  const by = Utilities.base64Decode(String(b64 || '')); let mime = '', ext = '', kind = '';
  if (by[0] === -119 && by[1] === 80 && by[2] === 78 && by[3] === 71) { mime = 'image/png'; ext = 'png'; kind = 'image'; }
  else if (by[0] === -1 && by[1] === -40 && by[2] === -1) { mime = 'image/jpeg'; ext = 'jpg'; kind = 'image'; }
  else if (by[0] === 82 && by[1] === 73 && by[2] === 70 && by[3] === 70 && by[8] === 87 && by[9] === 69 && by[10] === 66 && by[11] === 80) { mime = 'image/webp'; ext = 'webp'; kind = 'image'; }
  else if (by[4] === 102 && by[5] === 116 && by[6] === 121 && by[7] === 112) { mime = 'video/mp4'; ext = 'mp4'; kind = 'video'; }
  else if (by[0] === 26 && by[1] === 69 && by[2] === -33 && by[3] === -93) { mime = 'video/webm'; ext = 'webm'; kind = 'video'; }
  return mime ? { by: by, mime: mime, ext: ext, kind: kind } : null;
}
function saveFile_(f) {
  const props = PropertiesService.getScriptProperties(); let folder = null, fid = props.getProperty('FOLDER');
  if (fid) { try { folder = DriveApp.getFolderById(fid); } catch (e) { folder = null; } }
  if (!folder) { const it = DriveApp.getFoldersByName('Hook uploads'); folder = it.hasNext() ? it.next() : DriveApp.createFolder('Hook uploads'); props.setProperty('FOLDER', folder.getId()); }
  const file = folder.createFile(Utilities.newBlob(f.by, f.mime, Utilities.getUuid() + '.' + f.ext)); file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getId();
}
function saveImage_(f) { return 'https://lh3.googleusercontent.com/d/' + saveFile_(f); }

/* ---------- notifications and email (written once, at the end of the request) ---------- */
function pick_(o, lang) { return (o && (lang === 'ar' ? o.ar || o.en : o.en || o.ar)) || ''; }
function notify_(uids, title, body, link) {
  uids = [].concat(uids); const now = new Date().toISOString(), js = JSON.stringify({ title: title, body: body, link: link || '' });
  uids.forEach(u => NQ_.push([id_('n'), u, now, js, 0]));
}
function h_(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function tpl_(lang, title, text, extra) {
  const ar = lang === 'ar';
  return '<div dir="' + (ar ? 'rtl' : 'ltr') + '" style="font-family:Arial,sans-serif;background:#fdfbee;padding:24px"><div style="max-width:520px;margin:auto;background:#fff;border-radius:16px;overflow:hidden"><div style="background:#fe502d;color:#fffdef;padding:18px 24px;font-size:22px;font-weight:bold">HOOK</div><div style="padding:24px;color:#1d1d1b;line-height:1.7"><h2 style="margin:0 0 12px">' + h_(title) + '</h2><p style="white-space:pre-wrap">' + h_(text) + '</p>' + (extra || '') + '</div><div style="padding:14px 24px;font-size:12px;color:#777">' + (ar ? 'دعم هوك. تقدر توقف الإشعارات دي من إعدادات حسابك.' : 'Hook Support. You can turn these emails off in your account settings.') + '</div></div></div>';
}
function qmail_(to, subject, html, bcc) { MQ_.push([id_('m'), new Date().toISOString(), to, bcc || '', subject, html, 'pending']); }
function tell_(u, title, body, force) { if (u && (u.notif || force)) qmail_(u.email, pick_(title, u.lang), tpl_(u.lang, pick_(title, u.lang), pick_(body, u.lang))); }
function appendRows_(name, rows) {
  if (!rows.length) return; const s = sheet_(name);
  if (rows.length === 1) { s.appendRow(rows[0]); return; }
  lock_(() => { s.getRange(s.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows); });
}
function flushQ_() { const n = NQ_, m = MQ_; NQ_ = []; MQ_ = []; appendRows_('notifs', n); appendRows_('outbox', m); }
function flushOutbox() {
  const s = sheet_('outbox'), r = rows_('outbox'); let n = 0;
  for (let i = 0; i < r.length && n < 15; i++) {
    if (r[i][6] !== 'pending') continue; const cnt = 1 + (r[i][3] ? String(r[i][3]).split(',').length : 0);
    if (MailApp.getRemainingDailyQuota() < cnt) break; n++;
    let st = 'sent'; try { const o = { to: r[i][2], subject: r[i][4], htmlBody: r[i][5], name: 'Hook Support', replyTo: ADMIN_EMAIL }; if (r[i][3]) o.bcc = r[i][3]; MailApp.sendEmail(o); } catch (e) { st = 'failed'; }
    s.getRange(i + 2, 7).setValue(st);
  }
  if (s.getLastRow() > 600) s.deleteRows(2, 300);
  const ns = sheet_('notifs'); if (ns.getLastRow() > 3000) ns.deleteRows(2, 1000);
  return n;
}
function onNewWork_(w) {
  const us = users_().filter(u => u.role !== 'admin'); if (!us.length) return;
  const title = { en: 'New work in our portfolio', ar: 'شغل جديد في البورتوفوليو' }, body = { en: w.name.en || w.name.ar, ar: w.name.ar || w.name.en };
  notify_(us.map(u => u.id), title, body, 'portfolio.html');
  ['en', 'ar'].forEach(l => { const to = us.filter(u => u.notif && u.lang === l).map(u => u.email); if (to.length) qmail_(ADMIN_EMAIL, pick_(title, l), tpl_(l, pick_(title, l), pick_(body, l)), to.slice(0, 90).join(',')); });
}
function notifsFor_(u) {
  const rs = rows_('notifs').filter(x => String(x[1]) === u.id), items = rs.slice(-30).reverse().map(x => Object.assign(JSON.parse(x[3]), { id: String(x[0]), at: iso_(x[2]), read: +x[4] === 1 }));
  return { items: items, unread: rs.filter(x => +x[4] !== 1).length };
}

/* ---------- entry points ---------- */
function doGet() { return ContentService.createTextOutput(JSON.stringify({ ok: 1, service: 'hook' })).setMimeType(ContentService.MimeType.JSON); }
function doPost(e) {
  let out, q; NQ_ = []; MQ_ = [];
  try { q = JSON.parse(e.postData.contents); out = route_(q); flushQ_(); }
  catch (err) { NQ_ = []; MQ_ = []; let m = 'Server error'; try { const c = claims_(q && q.token); if (c && c.r === 'a') m += ': ' + err.message; } catch (x) {} out = R_(500, { error: m }); }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
function login_(u, remember) { return R_(200, { user: pub_(u) }, { token: mkTok_(u, false, remember) }); }
function welcome_(u) { const t = { en: 'Welcome to Hook', ar: 'أهلاً بيك في هوك' }, bd = { en: 'Your account is ready. Follow our latest work and packages.', ar: 'حسابك جاهز. تابع أحدث أعمالنا وباقاتنا.' }; notify_(u.id, t, bd); tell_(u, t, bd); }
function verifyGoogle_(cred) {
  try {
    const r = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(String(cred || '').slice(0, 4000)), { muteHttpExceptions: true });
    if (r.getResponseCode() !== 200) return null; const j = JSON.parse(r.getContentText());
    if (j.aud !== GOOGLE_CLIENT_ID || String(j.email_verified) !== 'true' || !j.email || +j.exp * 1000 < Date.now()) return null; return j;
  } catch (e) { return null; }
}
function route_(q) {
  const p = String(q.route || ''), b = q.body || {}, tok = q.token || '';
  ensure_();
  if (p === '/api/content') return R_(200, getContent_());
  if (p === '/api/me') return R_(200, { user: pub_(userFromTok_(tok)) });
  if (p === '/api/boot') { const u = userFromTok_(tok); return R_(200, { content: getContent_(), user: pub_(u), notifs: u ? notifsFor_(u) : null }); }
  if (p === '/api/logout') return R_(200, { ok: 1 });
  if (p === '/api/track') {
    const c = claims_(tok); if (c && c.r === 'a') return R_(200, { ok: 1 });
    const vid = S_(b.vid, 40).replace(/[^\w]/g, '');
    if (b.k === 'visit') { let pg = S_(b.p, 80).replace(/[^\w\-.\/]/g, ''); if (!pg || pg === '/') pg = '/index.html'; pg = pg.replace(/^\/.*\/(?=[^\/]+$)/, '/'); sheet_('events').appendRow([day_(), 'visit', pg, vid]); }
    else if (b.k === 'view' && getContent_().work.some(w => w.id === b.id)) sheet_('events').appendRow([day_(), 'view', S_(b.id, 20), vid]);
    return R_(200, { ok: 1 });
  }
  if (p === '/api/register') {
    if (limited_('reg', 40, 3600)) return R_(429, { error: 'Too many attempts, try later' });
    const username = S_(b.username, 24), email = S_(b.email, 120).toLowerCase(), pw = String(b.password || ''), lang = b.lang === 'ar' ? 'ar' : 'en';
    if (!/^[A-Za-z0-9_]{3,24}$/.test(username)) return R_(400, { error: 'Username: 3-24 letters, numbers or _' });
    if (!emailOk_(email)) return R_(400, { error: 'Invalid email' });
    if (pw.length < 8 || pw.length > 100) return R_(400, { error: 'Password must be at least 8 characters' });
    return lock_(() => {
      if (users_().some(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email)) return R_(409, { error: 'Username or email already used' });
      const u = addUser_(username, email, pw, 'user', lang); welcome_(u); return login_(u, b.remember);
    });
  }
  if (p === '/api/google') {
    if (!GOOGLE_CLIENT_ID) return R_(400, { error: 'Google sign-in is not set up' });
    if (limited_('goog', 100, 3600)) return R_(429, { error: 'Too many attempts, try later' });
    const g = verifyGoogle_(b.credential); if (!g) return R_(401, { error: 'Google sign-in failed' });
    const email = String(g.email).toLowerCase(), lang = b.lang === 'ar' ? 'ar' : 'en';
    return lock_(() => {
      let u = users_().filter(x => x.email.toLowerCase() === email)[0];
      if (!u) {
        let base = email.split('@')[0].replace(/[^A-Za-z0-9_]/g, '').slice(0, 18); if (base.length < 3) base = 'user' + base;
        let username = base; while (users_().some(x => x.username.toLowerCase() === username.toLowerCase())) username = base + Math.floor(Math.random() * 9000 + 1000);
        const pic = /^https:\/\/lh3\.googleusercontent\.com\//.test(String(g.picture || '')) ? String(g.picture).slice(0, 300) : '';
        u = addUser_(username, email, Utilities.getUuid() + Utilities.getUuid(), 'user', lang, S_(g.name, 40) || username, pic); welcome_(u);
      }
      return login_(u, b.remember);
    });
  }
  if (p === '/api/login') {
    const id = S_(b.id, 120).toLowerCase();
    if (limited_('log:' + id.replace(/[^\w@.]/g, '').slice(0, 80), 8, 900) || limited_('logall', 200, 900)) return R_(429, { error: 'Too many attempts, wait 15 minutes' });
    const u = users_().filter(x => x.username.toLowerCase() === id || x.email.toLowerCase() === id)[0];
    if (!u || !checkPw_(u, b.password)) return R_(401, { error: 'Wrong username/email or password' });
    if (String(u.hash).indexOf('h:') === 0) { const salt = Utilities.getUuid(); setUser_(u.id, { salt: salt, hash: hashPw_(String(b.password), salt) }); }
    if (u.twofa) {
      const code = genCode_(); cache_().put('otpc:' + u.id, sig_(u.id + ':' + code), 600); cache_().remove('otp:' + u.id);
      try { MailApp.sendEmail({ to: u.email, subject: pick_({ en: 'Your Hook login code', ar: 'كود الدخول بتاعك على هوك' }, u.lang), htmlBody: tpl_(u.lang, pick_({ en: 'Your login code', ar: 'كود الدخول' }, u.lang), pick_({ en: 'Use this code to finish signing in. It expires in 10 minutes.', ar: 'استخدم الكود ده عشان تكمل الدخول. صالح لمدة 10 دقايق.' }, u.lang), '<p style="font-size:32px;font-weight:bold;letter-spacing:6px;margin:12px 0">' + code + '</p>'), name: 'Hook Support', replyTo: ADMIN_EMAIL }); }
      catch (err) { return R_(503, { error: 'Could not send the code, try again later' }); }
      return R_(200, { twofa: true, pending: mkTok_(u, true), hint: maskEmail_(u.email) });
    }
    return login_(u, b.remember);
  }
  if (p === '/api/login2') {
    const c = claims_(b.pending); if (!c || c.r !== 'p') return R_(401, { error: 'Session expired, sign in again' });
    if (limited_('otp:' + c.uid, 5, 600)) return R_(429, { error: 'Too many attempts, wait 15 minutes' });
    const st = cache_().get('otpc:' + c.uid), u = userById_(c.uid);
    if (!st || !u || !same_(st, sig_(c.uid + ':' + S_(b.code, 12)))) return R_(401, { error: 'Wrong code' });
    cache_().remove('otpc:' + c.uid); return login_(u, b.remember);
  }
  if (p === '/api/order') {
    if (limited_('ord', 60, 3600)) return R_(429, { error: 'Too many orders' });
    const prods = getContent_().products, items = [], me = userFromTok_(tok), now = Date.now();
    (Array.isArray(b.items) ? b.items : []).slice(0, 20).forEach(i => {
      const pr = prods.filter(x => x.id === i.id)[0]; if (!pr) return;
      const whole = pr.unit === 'item' || pr.pricing === 'total', min = whole ? 1 : (pr.min || 1); let q = Number(i.q) || 0; q = whole ? Math.round(q) : Math.round(q * 100) / 100;
      if (q < min) q = min; if (q > (whole ? 99 : 100000)) q = whole ? 99 : 100000; if (!whole && pr.step) q = Math.max(min, Math.round(Math.round(q / pr.step) * pr.step * 100) / 100);
      items.push({ id: pr.id, name: pr.name.en || pr.name.ar, q: q, price: effPrice_(pr, now), unit: pr.unit, pricing: pr.pricing, amount: pr.amount || 0, kind: pr.kind, disc: discOn_(pr, now) ? pr.disc : 0 });
    });
    if (!items.length) return R_(400, { error: 'empty' });
    const id = id_('o'), total = Math.round(items.reduce((a, i) => a + i.q * i.price, 0) * 100) / 100;
    sheet_('orders').appendRow([id, new Date().toISOString(), me ? me.username : '', JSON.stringify(items), total, 'new']);
    if (me) { const t = { en: 'Order received', ar: 'وصلنا طلبك' }, bd = { en: 'We received your order (' + total + ' EGP). We will contact you on WhatsApp soon.', ar: 'وصلنا طلبك (' + total + ' ج.م). هنكلمك على واتساب قريب.' }; notify_(me.id, t, bd); tell_(me, t, bd); }
    const ad = adminUser_(), summary = (me ? me.username : 'guest') + ': ' + items.map(i => i.name + ' x' + i.q).join(', ') + ' = ' + total + ' EGP';
    if (ad) notify_(ad.id, { en: 'New order', ar: 'طلب جديد' }, { en: summary, ar: summary }, 'dashboard.html');
    qmail_(ADMIN_EMAIL, 'New order on Hook', tpl_('en', 'New order', summary)); return R_(200, { ok: 1, id: id });
  }
  if (p.indexOf('/api/account') === 0) { const me = userFromTok_(tok); if (!me) return R_(401, { error: 'Please sign in' }); return account_(p, b, me); }
  if (p.indexOf('/api/admin/') === 0) {
    const me = userFromTok_(tok); if (!me || me.role !== 'admin') return R_(401, { error: 'Admin only' });
    return p === '/api/admin/stats' ? R_(200, stats_()) : lock_(() => admin_(p, String(q.method || 'GET'), b, me));
  }
  return R_(404, { error: 'Not found' });
}

/* ---------- signed-in users ---------- */
function account_(p, b, me) {
  if (p === '/api/account/notifs') return R_(200, notifsFor_(me));
  if (p === '/api/account/notifs/read') {
    const s = sheet_('notifs'), n = s.getLastRow(); if (n < 2) return R_(200, { ok: 1 });
    const rg = s.getRange(2, 1, n - 1, 5), v = rg.getValues(); let ch = false; v.forEach(x => { if (String(x[1]) === me.id && +x[4] !== 1) { x[4] = 1; ch = true; } }); if (ch) rg.setValues(v); return R_(200, { ok: 1 });
  }
  if (p === '/api/account/orders') {
    return R_(200, { items: rows_('orders').filter(r => String(r[2]) === me.username).reverse().slice(0, 50).map(r => ({ id: String(r[0]), at: iso_(r[1]), items: JSON.parse(r[3]), total: +r[4], status: String(r[5]) })) });
  }
  if (p === '/api/account/reports') {
    return R_(200, { items: rows_('reports').filter(x => String(x[1]) === me.id).reverse().map(x => ({ id: String(x[0]), at: iso_(x[3]), subject: String(x[4]), message: String(x[5]), status: String(x[6]), replies: JSON.parse(x[7] || '[]') })) });
  }
  if (p === '/api/account/report') {
    if (limited_('rep:' + me.id, 5, 3600)) return R_(429, { error: 'Too many reports, try later' });
    const subject = S_(b.subject, 100), message = S_(b.message, 2000); if (!subject || !message) return R_(400, { error: 'Subject and message are required' });
    const id = id_('r'); sheet_('reports').appendRow([id, me.id, me.username, new Date().toISOString(), subject, message, 'open', '[]']);
    const ad = adminUser_(), line = me.username + ': ' + subject;
    if (ad) notify_(ad.id, { en: 'New problem report', ar: 'بلاغ جديد' }, { en: line, ar: line }, 'dashboard.html');
    qmail_(ADMIN_EMAIL, 'Hook: problem report from ' + me.username, tpl_('en', 'Problem report', line + '\n\n' + message)); return R_(200, { ok: 1, id: id });
  }
  return lock_(() => {
    if (p === '/api/account/profile') {
      const f = {};
      if (b.name !== undefined) { const n = S_(b.name, 40); if (n.length < 2) return R_(400, { error: 'Name is too short' }); f.name = n; }
      if (b.lang !== undefined) f.lang = b.lang === 'ar' ? 'ar' : 'en';
      if (b.notif !== undefined) f.notif = b.notif ? 1 : 0;
      if (b.twofa !== undefined) f.twofa = b.twofa ? 1 : 0;
      setUser_(me.id, f); return R_(200, { user: pub_(userById_(me.id)) });
    }
    if (p === '/api/account/email') {
      const email = S_(b.email, 120).toLowerCase();
      if (!checkPw_(me, b.password)) return R_(400, { error: 'Current password is wrong' });
      if (!emailOk_(email)) return R_(400, { error: 'Invalid email' });
      if (users_().some(u => u.id !== me.id && u.email.toLowerCase() === email)) return R_(409, { error: 'Username or email already used' });
      const old = me.email; setUser_(me.id, { email: email }); const t = { en: 'Email changed', ar: 'تم تغيير الإيميل' }, bd = { en: 'The email of your Hook account was changed to ' + maskEmail_(email) + '. If this was not you, contact support.', ar: 'إيميل حسابك على هوك اتغيّر لـ ' + maskEmail_(email) + '. لو مش إنت، كلّم الدعم.' };
      notify_(me.id, t, bd); if (me.notif) qmail_(old, pick_(t, me.lang), tpl_(me.lang, pick_(t, me.lang), pick_(bd, me.lang))); return R_(200, { user: pub_(userById_(me.id)) });
    }
    if (p === '/api/account/password') {
      if (!checkPw_(me, b.old)) return R_(400, { error: 'Current password is wrong' });
      const n = String(b.new || ''); if (n.length < 8 || n.length > 100) return R_(400, { error: 'New password must be at least 8 characters' });
      const salt = Utilities.getUuid(); setUser_(me.id, { salt: salt, hash: hashPw_(n, salt) });
      const t = { en: 'Password changed', ar: 'تم تغيير الباسورد' }, bd = { en: 'Your password was changed. If this was not you, contact support right away.', ar: 'الباسورد بتاعك اتغيّر. لو مش إنت، كلّم الدعم فوراً.' };
      notify_(me.id, t, bd); tell_(me, t, bd); return R_(200, { ok: 1 });
    }
    if (p === '/api/account/avatar') {
      if (b.remove) { setUser_(me.id, { avatar: '' }); return R_(200, { user: pub_(userById_(me.id)) }); }
      const b64 = String(b.b64 || ''); if (!b64 || b64.length > 600000) return R_(400, { error: 'Only PNG, JPG or WEBP images' });
      const f = bytes_(b64); if (!f || f.kind !== 'image') return R_(400, { error: 'Only PNG, JPG or WEBP images' });
      setUser_(me.id, { avatar: saveImage_(f) }); return R_(200, { user: pub_(userById_(me.id)) });
    }
    return R_(404, { error: 'Not found' });
  });
}

/* ---------- admin (every content change answers with the new content) ---------- */
function admin_(p, m, b, me) {
  let r;
  const done = (C, extra) => R_(200, Object.assign({ content: C }, extra || {}));
  if (p === '/api/admin/password' && m === 'POST') {
    if (!checkPw_(me, b.old)) return R_(400, { error: 'Current password is wrong' });
    const n = String(b.new || ''); if (n.length < 8) return R_(400, { error: 'New password must be at least 8 characters' });
    const salt = Utilities.getUuid(); setUser_(me.id, { salt: salt, hash: hashPw_(n, salt) }); return R_(200, { ok: 1 });
  }
  if (p === '/api/admin/upload' && m === 'POST') {
    const b64 = String(b.b64 || ''); if (!b64 || b64.length > 7e6) return R_(400, { error: 'Only PNG, JPG or WEBP images' });
    const f = bytes_(b64); if (!f || f.kind !== 'image') return R_(400, { error: 'Only PNG, JPG or WEBP images' }); return R_(200, { path: saveImage_(f) });
  }
  if (p === '/api/admin/upload-video' && m === 'POST') {
    const b64 = String(b.b64 || ''); if (!b64 || b64.length > 14e6) return R_(400, { error: 'Video is too large (max 10 MB). Use a YouTube or Drive link.' });
    const f = bytes_(b64); if (!f || f.kind !== 'video') return R_(400, { error: 'Only MP4 or WEBM videos' });
    return R_(200, { video: 'https://drive.google.com/file/d/' + saveFile_(f) + '/preview' });
  }
  const C = getContent_();
  if (p === '/api/admin/texts' && m === 'PUT') {
    const key = S_(b.key, 200); if (!key) return R_(400, { error: 'Bad request' });
    if (b.reset) delete C.texts[key]; else C.texts[key] = { en: S_(b.en, 600), ar: S_(b.ar, 600) };
    return done(saveContent_(C));
  }
  if (p === '/api/admin/images' && m === 'PUT') {
    const key = S_(b.key, 200); if (!key) return R_(400, { error: 'Bad request' });
    if (b.reset) delete C.images[key]; else { const u = img_(b.url); if (!u) return R_(400, { error: 'Only PNG, JPG or WEBP images' }); C.images[key] = u; }
    return done(saveContent_(C));
  }
  if (p === '/api/admin/categories' && m === 'PUT') {
    const kind = b.kind === 'shop' ? 'shop' : 'work', old = C.categories[kind], seen = {};
    const list = (Array.isArray(b.list) ? b.list : []).slice(0, 30).map(x => ({ id: old.some(o => o.id === S_(x.id, 40)) ? S_(x.id, 40) : id_('c'), name: LS_(x.name, 40) })).filter(x => (x.name.en || x.name.ar) && !seen[x.id] && (seen[x.id] = 1));
    if (kind === 'shop' && !list.length) return R_(400, { error: 'Keep at least one section' });
    C.categories[kind] = list;
    if (kind === 'work') C.work.forEach(w => { if (!catId_(list, w.cat)) w.cat = ''; }); else C.products.forEach(pr => { if (!catId_(list, pr.cat)) pr.cat = list[0].id; });
    return done(saveContent_(C));
  }
  if (p === '/api/admin/social' && m === 'PUT') {
    C.social = { facebook: url_(b.facebook), instagram: url_(b.instagram), tiktok: url_(b.tiktok) }; return done(saveContent_(C));
  }
  if ((r = p.match(/^\/api\/admin\/(work|clients|products)(?:\/(\w+))?$/))) {
    const col = r[1], id = r[2], list = C[col];
    if (m === 'POST' && !id) {
      const c = clean[col](b, C); if (!named_(c)) return R_(400, { error: 'Name is required' });
      if (col !== 'products' && !(c.img || c.logo)) return R_(400, { error: 'Image is required' });
      const it = Object.assign({ id: col[0] + Utilities.getUuid().replace(/-/g, '').slice(0, 8) }, c); list.push(it); saveContent_(C);
      if (col === 'work') onNewWork_(it); return done(C, { item: it });
    }
    const cur = list.filter(x => x.id === id)[0]; if (!cur) return R_(404, { error: 'Not found' });
    if (m === 'PUT') {
      const c = clean[col](b, C); if (!named_(c)) return R_(400, { error: 'Name is required' });
      if (col !== 'products') { if (!c.img) delete c.img; if (!c.logo) delete c.logo; } Object.assign(cur, c); if (col === 'work' && !c.video) delete cur.video;
      return done(saveContent_(C), { item: cur });
    }
    if (m === 'DELETE') { list.splice(list.indexOf(cur), 1); return done(saveContent_(C)); }
  }
  if ((r = p.match(/^\/api\/admin\/buttons\/(\w+)$/)) && m === 'PUT') {
    if (!C.buttons[r[1]]) return R_(404, { error: 'Not found' });
    C.buttons[r[1]] = { label: LS_(b.label, 60), href: href_(b.href) }; return done(saveContent_(C));
  }
  if (p === '/api/admin/contact' && m === 'PUT') {
    const email = S_(b.email, 120), wa = digits_(b.whatsapp);
    if (!emailOk_(email)) return R_(400, { error: 'Invalid email' });
    if (wa.length < 8 || wa.length > 15) return R_(400, { error: 'Invalid WhatsApp number' });
    C.contact = { email: email, whatsapp: wa }; return done(saveContent_(C));
  }
  if ((r = p.match(/^\/api\/admin\/orders\/(\w+)$/)) && m === 'PATCH') {
    const row = rowOf_('orders', r[1]);
    if (!row || ['new', 'confirmed', 'done', 'cancelled'].indexOf(b.status) < 0) return R_(400, { error: 'Bad request' });
    const os = sheet_('orders'), od = os.getRange(row, 1, 1, 6).getValues()[0], prev = String(od[5]); os.getRange(row, 6).setValue(b.status);
    if (prev !== b.status && b.status !== 'new' && od[2]) {
      const u = users_().filter(x => x.username === String(od[2]))[0];
      if (u) { const T = { confirmed: { en: 'Your order is confirmed', ar: 'طلبك اتأكد' }, done: { en: 'Your order is complete', ar: 'طلبك اتنفّذ' }, cancelled: { en: 'Your order was cancelled', ar: 'طلبك اتلغى' } }[b.status], bd = { en: 'Order total: ' + od[4] + ' EGP.', ar: 'إجمالي الطلب: ' + od[4] + ' ج.م.' }; notify_(u.id, T, bd, 'account.html#orders'); tell_(u, T, bd); }
    }
    return R_(200, { ok: 1 });
  }
  if ((r = p.match(/^\/api\/admin\/reports\/(\w+)(\/reply)?$/))) {
    const row = rowOf_('reports', r[1]); if (!row) return R_(404, { error: 'Not found' });
    const s = sheet_('reports'), x = s.getRange(row, 1, 1, 8).getValues()[0];
    if (r[2] && m === 'POST') {
      const text = S_(b.text, 2000); if (!text) return R_(400, { error: 'Write a reply first' });
      const reps = JSON.parse(x[7] || '[]'); reps.push({ at: new Date().toISOString(), text: text });
      s.getRange(row, 7, 1, 2).setValues([['answered', JSON.stringify(reps)]]);
      const u = userById_(String(x[1])), t = { en: 'Hook Support replied', ar: 'دعم هوك رد عليك' };
      if (u) { notify_(u.id, t, { en: text, ar: text }, 'account.html#report'); tell_(u, t, { en: text, ar: text }); } return R_(200, { ok: 1 });
    }
    if (!r[2] && m === 'PATCH') { if (['open', 'closed'].indexOf(b.status) < 0) return R_(400, { error: 'Bad request' }); s.getRange(row, 7).setValue(b.status); return R_(200, { ok: 1 }); }
  }
  return R_(404, { error: 'Not found' });
}

function stats_() {
  const ev = rows_('events'), today = day_(), days = [], dv = {}, pages = {}, views = {}, all = {}; let pv = 0, anon = 0;
  ev.forEach(e => {
    const d = dayOf_(e[0]), t = e[1], a = String(e[2]), v = String(e[3]) || ('anon' + (++anon));
    if (t === 'visit') { pv++; pages[a] = (pages[a] || 0) + 1; (dv[d] = dv[d] || {})[v] = 1; all[v] = 1; } else if (t === 'view') views[a] = (views[a] || 0) + 1;
  });
  const last7 = {}; let visits = 0;
  Object.keys(dv).forEach(d => { visits += Object.keys(dv[d]).length; });
  for (let i = 13; i >= 0; i--) { const d = day_(new Date(Date.now() - i * 864e5)); days.push({ d: d, n: Object.keys(dv[d] || {}).length }); if (i < 7) Object.keys(dv[d] || {}).forEach(v => last7[v] = 1); }
  const orders = rows_('orders').map(r => ({ id: String(r[0]), at: iso_(r[1]), user: String(r[2]) || null, items: JSON.parse(r[3]), total: +r[4], status: String(r[5]) })).reverse();
  const sales = {}, buyers = {}; let revenue = 0;
  orders.filter(o => o.status !== 'cancelled').forEach(o => {
    revenue += o.total; o.items.forEach(i => { const s = sales[i.id] || (sales[i.id] = { id: i.id, name: i.name, qty: 0, revenue: 0 }); s.qty += i.q; s.revenue += i.q * i.price; });
    if (o.user) { const b = buyers[o.user] || (buyers[o.user] = { user: o.user, orders: 0, spent: 0, last: o.at }); b.orders++; b.spent += o.total; if (o.at > b.last) b.last = o.at; }
  });
  const C = getContent_(), work = C.work, users = users_(), tv = work.reduce((a, w) => a + (views[w.id] || 0), 0);
  return {
    visits: visits, pageviews: pv, today: Object.keys(dv[today] || {}).length, week: Object.keys(last7).length, unique: Object.keys(all).length, days: days,
    pages: Object.keys(pages).map(k => ({ p: k, n: pages[k] })).sort((a, b) => b.n - a.n),
    topWork: work.map(w => ({ id: w.id, name: w.name.en || w.name.ar, cat: w.cat, views: views[w.id] || 0, share: tv ? Math.round((views[w.id] || 0) / tv * 100) : 0 })).sort((a, b) => b.views - a.views),
    topProducts: Object.keys(sales).map(k => sales[k]).sort((a, b) => b.qty - a.qty), revenue: revenue,
    topBuyers: Object.keys(buyers).map(k => buyers[k]).sort((a, b) => b.spent - a.spent),
    accounts: users.length, users: users.map(u => ({ username: u.username, name: u.name, email: u.email, role: u.role, at: u.at, orders: (buyers[u.username] || {}).orders || 0, spent: (buyers[u.username] || {}).spent || 0 })),
    reports: rows_('reports').reverse().slice(0, 100).map(x => ({ id: String(x[0]), username: String(x[2]), at: iso_(x[3]), subject: String(x[4]), message: String(x[5]), status: String(x[6]), replies: JSON.parse(x[7] || '[]') })),
    orders: orders.slice(0, 100), counts: { work: work.length, clients: C.clients.length, products: C.products.length }
  };
}

/* ---------- setup (run from the editor) ---------- */
function init_() {
  Object.keys(HEADS).forEach(n => sheet_(n));
  sheet_('users').getRange(1, 1, 1, HEADS.users.length).setValues([HEADS.users]);
  const es = sheet_('events'); es.getRange(1, 1, es.getMaxRows(), 1).setNumberFormat('@');
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('SECRET')) props.setProperty('SECRET', Utilities.getUuid() + Utilities.getUuid());
  cache_().remove('content'); cache_().remove('users'); getContent_();
}
function ensure_() {
  if (cache_().get('ready')) return;
  if (!PropertiesService.getScriptProperties().getProperty('SECRET') || !readContent_()) lock_(() => { if (!PropertiesService.getScriptProperties().getProperty('SECRET') || !readContent_()) init_(); });
  cache_().put('ready', '1', 21600);
}
function setup() {
  init_();
  if (!users_().some(u => u.role === 'admin')) {
    if (ADMIN_PW === 'CHANGE_ME') throw new Error('Type your password in ADMIN_PW at the top first');
    addUser_(ADMIN_USER, ADMIN_EMAIL, ADMIN_PW, 'admin', 'ar');
  }
  if (!ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'flushOutbox')) ScriptApp.newTrigger('flushOutbox').timeBased().everyMinutes(5).create();
  cache_().remove('ready'); return 'Setup done';
}
function resetAdmin() {
  if (ADMIN_PW === 'CHANGE_ME') throw new Error('Type your password in ADMIN_PW at the top first');
  const a = adminUser_(), salt = Utilities.getUuid(); setUser_(a.id, { salt: salt, hash: hashPw_(ADMIN_PW, salt), twofa: 0 }); return 'Admin password reset';
}
