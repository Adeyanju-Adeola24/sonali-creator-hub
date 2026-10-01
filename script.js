// Menu with a11y + auto-close
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
function closeMenu() {
  if (!navLinks) return;
  navLinks.classList.remove('open');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
}
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) closeMenu();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 960) closeMenu(); });
}
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
  document.querySelectorAll('.nav-links a').forEach(x => x.classList.remove('active'));
  a.classList.add('active');
  closeMenu();
}));

// Active nav on scroll
const sections = ['home','ai','services','editing','shooting','courses','problem','agency','founders'];
window.addEventListener('scroll', () => {
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 140) current = id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// ---- Helpers ----
function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function safeStore(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
function safeLoad(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }

// ---- AI CHATBOT PRO (30+ intents, typing, memory, lead capture) ----
const chatBody = document.getElementById('chatBody');
let lastTopic = safeLoad('hub_last_topic', null);
let chatHistory = safeLoad('hub_chat', []);
function saveChat() {
  try {
    safeStore('hub_chat', chatHistory.slice(-30));
    safeStore('hub_last_topic', lastTopic);
  } catch (e) {}
}
function addMsg(text, who) {
  if (!chatBody) return;
  const d = document.createElement('div');
  d.className = 'msg ' + who;
  if (who === 'user') d.textContent = text;
  else d.innerHTML = text;
  chatBody.appendChild(d);
  chatBody.scrollTop = chatBody.scrollHeight;
  if (who !== 'typing') { chatHistory.push({ t: text.slice(0, 400), w: who }); saveChat(); }
}
function showTyping() {
  if (!chatBody) return null;
  const d = document.createElement('div');
  d.className = 'msg ai typing';
  d.innerHTML = '<span></span><span></span><span></span>';
  d.id = 'typingBubble';
  chatBody.appendChild(d);
  chatBody.scrollTop = chatBody.scrollHeight;
  return d;
}
function hideTyping() { const t = document.getElementById('typingBubble'); if (t) t.remove(); }
(function restoreChat() {
  if (!chatBody || !chatHistory.length) return;
  chatHistory.slice(-6).forEach(m => {
    const d = document.createElement('div');
    d.className = 'msg ' + m.w;
    if (m.w === 'user') d.textContent = m.t; else d.innerHTML = m.t;
    chatBody.appendChild(d);
  });
  chatBody.scrollTop = chatBody.scrollHeight;
})();

const WA = 'https://wa.me/917000000000?text=Hi%20TCS%20The%20Creator%20Society!';
function secLink(id, label) { return '<a href="#' + id + '" style="color:#7c3aed;font-weight:800">' + label + ' →</a>'; }

const INTENTS = [
 { id:'greeting', keys:['hello','hi','hey','namaste','good morning','good evening','hii'], reply:"Hello! Welcome to <b>TCS - The Creator Society</b>. I can help with <b>editing, shooting, courses, services, agency work, support, pricing, founders</b>. What do you need today?" },
 { id:'howareyou', keys:['how are you','how r u','kaise ho','your name','who are you'], reply:"I am <b>Hub AI</b>, your 24x7 creator assistant. I am doing great! Tell me — do you need <b>editing, shooting, a course, or agency work</b>?" },
 { id:'editing_price', keys:['editing price','edit price','reel price','shorts price','vlog price','rate card','rates','how much edit','cost of edit','price list','charge'], reply:"<b>Editing prices:</b><br>• Reel/Shorts — <b>₹499</b><br>• Vlog/YouTube — <b>₹1499</b><br>• Photo retouch — <b>₹99/photo</b><br>• Product ad — <b>₹999</b><br>• Wedding highlight — <b>₹2999</b><br>Urgent +50%. Try the " + secLink('editing','Editing calculator') + " for exact total." },
 { id:'editing_process', keys:['editing process','how to order edit','order edit','send raw','drive link','revision edit','delivery edit','how long edit'], reply:"<b>Editing order in 3 steps:</b><br>1. Go to " + secLink('editing','Editing') + " and fill the order form (name, WhatsApp, drive link)<br>2. We edit in 24-48 hrs (reels) / 3-5 days (vlogs)<br>3. You get preview → 2 free revisions → final file. First reel edit is <b>FREE</b> with code TCS20." },
 { id:'shooting_price', keys:['shoot price','shooting price','shoot cost','cameraman price','studio price','product shoot','reel shoot price'], reply:"<b>Shooting prices:</b><br>• Reel shoot — <b>₹1999</b> (2 hrs, 3 reels)<br>• Product shoot — <b>₹3499</b> (20 photos + 2 reels)<br>• Vlog/Event — <b>₹7999/day</b><br>20% OFF with TCS20. Book in " + secLink('shooting','Shooting') + "." },
 { id:'shooting_process', keys:['book shoot','shoot booking','how to book','shoot location','shoot city','cameraman book','studio book'], reply:"<b>Shoot booking:</b> open " + secLink('shooting','Shooting') + " → enter name, city, shoot type + date. We confirm on WhatsApp within 2 hours with location, timing and advance details. Pan India, remote + on-site." },
 { id:'courses_all', keys:['course','courses','learn','class','join course','training','seekhna','sikhna'], reply:"We have <b>3 courses</b>:<br>• <b>Mobile Editing ₹999</b> — CapCut, captions, hooks (20 lessons + certificate)<br>• <b>0-100K Growth ₹1499</b> — niche, calendar, algorithm + live doubts<br>• <b>Brand Deals ₹1999</b> — rate card, media kit, contracts<br>Click Enroll in " + secLink('courses','Courses') + ". Which one interests you?" },
 { id:'course_editing', keys:['mobile editing','capcut course','vn course','editing course'], reply:"<b>Mobile Editing Masterclass (₹999):</b> 20 videos, CapCut + VN, captions, viral hooks, certificate. Lifetime access. Enroll in " + secLink('courses','Courses') + " — we send payment link on WhatsApp." },
 { id:'course_growth', keys:['100k','growth course','followers','algorithm','viral course'], reply:"<b>0 to 100K Growth (₹1499):</b> niche selection, content calendar, algorithm secrets, collab pitch + live doubt class. Best for 0-50K creators. Enroll in " + secLink('courses','Courses') + "." },
 { id:'course_brand', keys:['brand deal course','sponsorship course','media kit course'], reply:"<b>Brand Deals + Agency (₹1999):</b> rate card, media kit, contracts, agency onboarding, freelance setup. You also get listed for agency work. Enroll in " + secLink('courses','Courses') + "." },
 { id:'agency_inf', keys:['influencer work','brand reel work','collab work','promotion work','paid promotion'], reply:"<b>For Influencers:</b> open " + secLink('agency','Agency Work') + " → For Influencers tab. Current: Skincare Reel ₹3000, Food Vlog ₹5000, Fashion Haul ₹4500. Click Apply, then share your profile link on WhatsApp. 10K+ followers preferred but micro-creators welcome." },
 { id:'agency_editor', keys:['editor work','editing job','editor job','thumbnail job','video editor work'], reply:"<b>For Editors:</b> open " + secLink('agency','Agency Work') + " → For Editors tab. Current: 10 Reels ₹4999/week, Wedding Teaser ₹6000, Thumbnails ₹1500. Remote work, weekly payout. Click Apply with your samples." },
 { id:'agency_post', keys:['post work','hire influencer','hire editor','need creator','agency post','i am agency'], reply:"<b>For Agencies:</b> open " + secLink('agency','Agency Work') + " → For Agencies tab → fill agency name, work type, budget, date → Post. Your job appears instantly and creators apply." },
 { id:'agency_general', keys:['agency','part time','part-time','job','work from home','earn','salary','payout'], reply:"<b>Part-time agency work:</b> you can work with <b>multiple agencies</b> at once. Influencers do brand reels, editors do remote edits. Payout weekly/monthly via UPI. See " + secLink('agency','Agency Work') + ". Are you an <b>influencer, editor or agency</b>?" },
 { id:'support', keys:['problem','help','support','issue','complaint','ticket','not working'], reply:"Sorry about that! Please fill the " + secLink('problem','Support form') + " (name, WhatsApp, category, details). You get a <b>ticket number</b> and reply within 24 hours. For urgent: <a href='" + WA + "' target='_blank' style='color:#7c3aed;font-weight:800'>WhatsApp us →</a>" },
 { id:'refund', keys:['refund','payment failed','money back','paid but','not received'], reply:"For <b>payments/refunds</b>: share your name, date, amount and screenshot in the " + secLink('problem','Support form') + " under <b>Payment / Refund</b>. Refunds for undelivered work are processed in 5-7 days." },
 { id:'services_all', keys:['services','what services','all services','service list','what do you do'], reply:"We offer <b>12 categories</b>: Strategy, Production, Editing, Social Media, Branding, Growth & SEO, Monetization, Brand Partnerships, Podcast, AI Tech, Management, Global. Open " + secLink('services','All Services') + " and click Order on any card." },
 { id:'seo', keys:['seo','keyword','hashtag','title','ranking','reach','views','growth'], reply:"<b>Growth & SEO:</b> YouTube SEO, keyword research, title/description optimization, hashtag + discoverability strategy, analytics. Ask in " + secLink('services','Services') + " → Growth & SEO card, or take the 0-100K course." },
 { id:'branding', keys:['branding','logo','banner','thumbnail','media kit','brand identity','personal brand'], reply:"<b>Creator Branding:</b> personal branding, logo, channel art, thumbnail style, media kit, guidelines + website. Order from " + secLink('services','Services') + " → Creator Branding." },
 { id:'monetization', keys:['monetiz','sponsor','brand deal','affiliate','merch','membership','earn money'], reply:"<b>Monetization:</b> YouTube monetization, sponsorships, brand deals, affiliate, digital products, course launch, memberships. Start with the Brand Deals course or " + secLink('services','Services') + " → Monetization." },
 { id:'podcast', keys:['podcast'], reply:"<b>Podcast:</b> strategy, setup, recording, production, editing, branding, distribution, clips + marketing. Order from " + secLink('services','Services') + " → Podcast card." },
 { id:'ai_tech', keys:['ai','automation','avatar','voice','ai video','ai tool'], reply:"<b>AI & Creator Tech:</b> AI content strategy, AI video, AI scripts/thumbnails, AI voice, AI avatars, repurposing + workflow automation. This chat itself is a demo — full WhatsApp/Instagram automation coming soon." },
 { id:'founders', keys:['founder','owner','tom','tcs','samridhi','who owns','team','who are you run'], reply:"Our founders: <b>Tom (Owner & Founder)</b> — strategy & YouTube growth, and <b>Samridhi Singh (Co-Founder)</b> — operations & brand deals. They work privately behind the scenes (introvert-friendly). Contact via this hub: " + secLink('founders','Founders') + "." },
 { id:'offer', keys:['offer','discount','coupon','promo','free','deal','sonali20'], reply:"Today's offer: first reel edit <b>FREE</b> + <b>20% OFF</b> on shooting with code <b>TCS20</b>. Mention the code in any form or chat." },
 { id:'timing', keys:['timing','time','open','working hours','when','available','holiday'], reply:"We work <b>Mon–Sat, 10am–8pm</b>. AI replies 24x7. Humans reply on WhatsApp within working hours, support tickets within 24 hours." },
 { id:'contact', keys:['contact','phone','number','whatsapp','email','address','location address','talk to human','human','call'], reply:"Contact: <b>WhatsApp Support</b> (Mon–Sat 10-8), Pan India remote + on-site. Fastest: <a href='" + WA + "' target='_blank' style='color:#7c3aed;font-weight:800'>Chat on WhatsApp →</a> or use the " + secLink('problem','Support form') + "." },
 { id:'location', keys:['city','cities','location','delhi','mumbai','bangalore','where'], reply:"We serve <b>Pan India</b>. Editing/courses/support are fully remote. Shooting is on-site — enter your city in the " + secLink('shooting','Shooting form') + " and we arrange a local team." },
 { id:'portfolio', keys:['sample','portfolio','demo','previous work','proof','trust','review'], reply:"Samples: check <b>Courses + finished reels</b> shared after enquiry, plus 500+ creators and 5400+ projects delivered. Share your niche on WhatsApp and we send matching samples." },
 { id:'payment_mode', keys:['upi','payment method','how to pay','gpay','phonepe','paytm','bank'], reply:"Payments via <b>UPI / bank transfer</b>. Link is sent on WhatsApp after you submit a form. 50% advance for shoots, 100% for editing under ₹2000. GST invoice on request." },
 { id:'thanks', keys:['thank','thanks','great','nice','awesome','good'], reply:"You are most welcome! Anything else — <b>editing, shooting, course or agency work</b>?" },
 { id:'bye', keys:['bye','see you','good night','tata'], reply:"Bye! Good luck with your content. I am here 24x7 whenever you need editing, shooting or brand deals." }
];

function aiReply(raw) {
  const q = ' ' + String(raw).toLowerCase().trim() + ' ';
  // Lead capture: phone number
  const phone = String(raw).replace(/\D/g, '');
  if (phone.length >= 10 && phone.length <= 13 && /(number|mobile|phone|call|whatsapp|contact)/.test(q)) {
    try { safeStore('hub_lead', { phone, at: new Date().toISOString() }); } catch (e) {}
    lastTopic = 'contact'; saveChat();
    return "Thanks! Saved your number ending <b>" + escapeHtml(phone.slice(-5)) + "</b>. Our team will WhatsApp you shortly. Meanwhile — do you need <b>editing, shooting or a course</b>?";
  }
  // Score intents
  let best = null, bestScore = 0;
  INTENTS.forEach(it => {
    let s = 0;
    it.keys.forEach(k => { if (q.includes(k)) s += k.length > 5 ? 2 : 1; });
    if (s > bestScore) { bestScore = s; best = it; }
  });
  // Follow-up context: short queries
  if ((!best || bestScore < 2) && lastTopic && /^(price|prices|cost|how much|how|process|join|apply|where|when)/.test(q.trim())) {
    const ctx = INTENTS.find(i => i.id === lastTopic);
    if (ctx) { return ctx.reply + "<br><br><small>Tip: type <b>services</b> for all 12 categories, or <b>human</b> for WhatsApp.</small>"; }
  }
  if (best && bestScore > 0) {
    lastTopic = best.id === 'greeting' || best.id === 'thanks' ? lastTopic : best.id;
    saveChat();
    return best.reply + (best.id === 'greeting' ? '' : "<br><br><small>Need more? Ask about <b>price, courses, agency work, founders</b> or type <b>human</b>.</small>");
  }
  return "I want to help correctly. I can answer about:<br>• <b>Editing</b> (price/process)<br>• <b>Shooting</b> (price/booking)<br>• <b>Courses</b> (which one to join)<br>• <b>Agency work</b> (influencer/editor)<br>• <b>Services</b> (all 12)<br>• <b>Support / refund</b><br>• <b>Founders, timings, offers</b><br>Please ask one of these, or type <b>human</b> for WhatsApp support.";
}
function respondWithTyping(userText) {
  showTyping();
  const delay = 500 + Math.min(userText.length * 12, 900);
  setTimeout(() => { hideTyping(); addMsg(aiReply(userText), 'ai'); }, delay);
}
function sendChat() {
  const inp = document.getElementById('chatInput');
  if (!inp) return;
  const v = inp.value.trim().slice(0, 500);
  if (!v) return;
  addMsg(v, 'user');
  inp.value = '';
  inp.focus();
  respondWithTyping(v);
}
function askAI(q) {
  q = String(q).slice(0, 200);
  addMsg(q, 'user');
  const sec = document.getElementById('ai');
  if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  respondWithTyping(q);
}

// ---- Editing calculator ----
const eService = document.getElementById('eService');
const eQty = document.getElementById('eQty');
const eUrgent = document.getElementById('eUrgent');
const eTotal = document.getElementById('eTotal');
function calcEdit() {
  if (!eService || !eQty || !eTotal) return;
  let qty = Math.min(Math.max(parseInt(eQty.value) || 1, 1), 100);
  let t = (parseInt(eService.value) || 0) * qty;
  if (eUrgent && eUrgent.checked) t = Math.round(t * 1.5);
  eTotal.textContent = '₹' + t.toLocaleString('en-IN');
}
[eService, eQty, eUrgent].forEach(el => { if (el) el.addEventListener('input', calcEdit); });
calcEdit();

const editForm = document.getElementById('editForm');
if (editForm) editForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const n = document.getElementById('edName').value.trim().slice(0, 60);
  const p = document.getElementById('edPhone').value.trim();
  if (!n || !p) { document.getElementById('editMsg').textContent = 'Please enter your name and WhatsApp number.'; return; }
  document.getElementById('editMsg').textContent = 'Thank you ' + n + '! Your editing order (' + (eTotal ? eTotal.textContent : '') + ') has been received. We will contact you on WhatsApp shortly.';
  this.reset(); calcEdit();
});

// ---- Shooting ----
const shootForm = document.getElementById('shootForm');
if (shootForm) shootForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const n = document.getElementById('shName').value.trim().slice(0, 60);
  const t = document.getElementById('shType').value;
  if (!n) { document.getElementById('shootMsg').textContent = 'Please enter your name.'; return; }
  document.getElementById('shootMsg').textContent = 'Thank you ' + n + '! Your ' + t + ' request is booked. Our team will call to confirm location and timing.';
  this.reset();
});
const shDate = document.getElementById('shDate');
if (shDate) shDate.min = new Date().toISOString().split('T')[0];
const aDate = document.getElementById('aDate');
if (aDate) aDate.min = new Date().toISOString().split('T')[0];

// ---- Courses ----
function enroll(course) {
  const el = document.getElementById('courseMsg');
  if (el) el.innerHTML = 'Great choice! <b>' + escapeHtml(course) + '</b> selected. We will send the payment link and login details on WhatsApp. Offer code: <b>TCS20</b>';
}

// ---- Problem tickets ----
let tickets = safeLoad('hub_tickets', []);
function renderTickets() {
  const count = document.getElementById('tCount');
  const list = document.getElementById('ticketList');
  if (!count || !list) return;
  count.textContent = tickets.length;
  list.innerHTML = tickets.length
    ? tickets.slice().reverse().map(t => '<div class="tk"><b>#' + escapeHtml(t.id) + '</b> ' + escapeHtml(t.cat) + ' — ' + escapeHtml(t.desc).slice(0,80) + '<br><small>' + escapeHtml(t.date) + ' • Pending</small></div>').join('')
    : '<small>No tickets yet.</small>';
}
renderTickets();
const probForm = document.getElementById('probForm');
if (probForm) probForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const desc = document.getElementById('pDesc').value.trim();
  if (!desc) { document.getElementById('probMsg').textContent = 'Please describe your problem.'; return; }
  const id = 'T' + Date.now().toString().slice(-6);
  tickets.push({ id, cat: document.getElementById('pCat').value, desc: desc.slice(0, 500), date: new Date().toLocaleString() });
  safeStore('hub_tickets', tickets);
  renderTickets();
  document.getElementById('probMsg').textContent = 'Problem received! Ticket number: ' + id + '. We will reply within 24 hours.';
  this.reset();
});

// ---- Agency tabs + apply ----
function switchTab(k, btn) {
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  ['inf','edit','ag'].forEach(x => {
    const pane = document.getElementById('tab-' + x);
    if (pane) pane.style.display = x === k ? 'block' : 'none';
  });
}
function apply(job) {
  const el = document.getElementById('applyMsg');
  if (el) el.textContent = 'Applied for "' + String(job).slice(0,60) + '"! Share your profile link on WhatsApp to complete your application.';
}
const agencyForm = document.getElementById('agencyForm');
if (agencyForm) agencyForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const n = document.getElementById('aName').value.trim().slice(0, 60);
  const b = document.getElementById('aBudget').value;
  const t = document.getElementById('aType').value;
  if (!n || !b) { document.getElementById('agencyMsg').textContent = 'Please enter agency name and budget.'; return; }
  const div = document.createElement('div');
  div.className = 'job';
  const h = document.createElement('h4'); h.textContent = t + ' — ₹' + Number(b).toLocaleString('en-IN');
  const p = document.createElement('p'); p.textContent = n + ' • Just posted';
  const btn = document.createElement('button'); btn.type = 'button'; btn.textContent = 'New';
  div.append(h, p, btn);
  document.getElementById('postedJobs').prepend(div);
  document.getElementById('agencyMsg').textContent = 'Work posted successfully! Influencers/editors can now apply.';
  this.reset();
});
