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
const sections = ['home','ai','services','tools','editing','shooting','courses','process','problem','agency','results','faq','founders'];
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
 { id:'tools', keys:['ai tool','ai tools','tool directory','opus','elevenlabs','higgsfield','heygen','descript','midjourney','runway','vidiq','tubebuddy','trending tool'], reply:"Check the <b>AI Tools Directory</b> " + secLink('tools','here') + " — Top 5 trending (Opus Clip, ElevenLabs, Higgsfield, vidIQ, HeyGen) plus 18 searchable tools across Video, Voice, Design, Writing, Growth and Productivity. Which task do you need a tool for?" },
 { id:'process', keys:['process','how it works','how tcs works','discover','convert','workflow','steps'], reply:"<b>How TCS works:</b><br>1. <b>Discover</b> — niche + audience research, creator matching<br>2. <b>Create</b> — script, shoot, edit with full rights<br>3. <b>Convert</b> — SEO, deals, amplification + reporting.<br>See " + secLink('process','the process') + "." },
 { id:'founders', keys:['founder','owner','tom','tcs','samridhi','who owns','team','who are you run'], reply:"Our founders: <b>Tom (Owner & Founder)</b> — strategy & YouTube growth, and <b>Samridhi Singh (Co-Founder)</b> — operations & brand deals. They work privately behind the scenes. Contact via this hub: " + secLink('founders','Founders') + "." },
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

// ---- AI TOOLS DIRECTORY ----
const TOOLS = [
 { n:'Opus Clip', c:'Video', p:'Freemium', r:'4.8', d:'Long videos to viral shorts with auto hooks + captions.', i:'fa-solid fa-scissors', g:['#ef4444','#f97316'] },
 { n:'ElevenLabs', c:'Voice', p:'Freemium', r:'4.9', d:'Studio AI voiceover + cloning in 30+ languages.', i:'fa-solid fa-microphone', g:['#7c3aed','#ec4899'] },
 { n:'Higgsfield AI', c:'Video', p:'Paid', r:'4.7', d:'Cinematic AI video for ads and reels.', i:'fa-solid fa-wand-magic-sparkles', g:['#8b5cf6','#6366f1'] },
 { n:'HeyGen', c:'Video', p:'Freemium', r:'4.7', d:'AI avatar presenters for faceless videos.', i:'fa-solid fa-user-astronaut', g:['#3b82f6','#06b6d4'] },
 { n:'Descript', c:'Video', p:'Freemium', r:'4.6', d:'Edit video by editing text + filler removal.', i:'fa-solid fa-keyboard', g:['#14b8a6','#3b82f6'] },
 { n:'CapCut', c:'Video', p:'Free', r:'4.8', d:'Free mobile/desktop editor with auto-captions.', i:'fa-solid fa-clapperboard', g:['#111827','#4b5563'] },
 { n:'Midjourney', c:'Design', p:'Paid', r:'4.8', d:'Best-in-class AI art for thumbnails + branding.', i:'fa-solid fa-palette', g:['#6366f1','#a855f7'] },
 { n:'Leonardo AI', c:'Design', p:'Freemium', r:'4.6', d:'Game-style art + thumbnails with control.', i:'fa-solid fa-shapes', g:['#06b6d4','#8b5cf6'] },
 { n:'Canva Magic', c:'Design', p:'Freemium', r:'4.7', d:'Text-to-design posts, decks and brand kits.', i:'fa-solid fa-pen-nib', g:['#10b981','#14b8a6'] },
 { n:'ChatGPT', c:'Writing', p:'Freemium', r:'4.9', d:'Scripts, hooks, captions and content calendars.', i:'fa-solid fa-comments', g:['#16a34a','#65a30d'] },
 { n:'Claude', c:'Writing', p:'Freemium', r:'4.8', d:'Long-form scripts + nuanced brand voice.', i:'fa-solid fa-brain', g:['#f59e0b','#ef4444'] },
 { n:'vidIQ', c:'Growth', p:'Freemium', r:'4.6', d:'YouTube keywords, title scores, best upload time.', i:'fa-solid fa-chart-line', g:['#ef4444','#ec4899'] },
 { n:'TubeBuddy', c:'Growth', p:'Freemium', r:'4.5', d:'A/B titles, tags and competitor tracking.', i:'fa-solid fa-bullseye', g:['#3b82f6','#8b5cf6'] },
 { n:'Metricool', c:'Growth', p:'Freemium', r:'4.6', d:'Schedule + analytics across all platforms.', i:'fa-solid fa-calendar-days', g:['#16a34a','#14b8a6'] },
 { n:'Notion AI', c:'Productivity', p:'Paid', r:'4.6', d:'Content calendars, SOPs and second brain.', i:'fa-solid fa-note-sticky', g:['#334155','#64748b'] },
 { n:'Suno', c:'Voice', p:'Freemium', r:'4.7', d:'Royalty-friendly AI music for vlogs + ads.', i:'fa-solid fa-music', g:['#ec4899','#f43f5e'] },
 { n:'Runway', c:'Video', p:'Freemium', r:'4.6', d:'Green-screen, inpainting + Gen video models.', i:'fa-solid fa-photo-film', g:['#84cc16','#14b8a6'] },
 { n:'Framer AI', c:'Productivity', p:'Free', r:'4.5', d:'Creator websites generated from a prompt.', i:'fa-solid fa-globe', g:['#0ea5e9','#6366f1'] }
];
let toolCat = 'All', toolQ = '';
function renderTools() {
  const grid = document.getElementById('toolsGrid');
  const count = document.getElementById('toolsCount');
  if (!grid) return;
  const list = TOOLS.filter(t =>
    (toolCat === 'All' || t.c === toolCat) &&
    (t.n + ' ' + t.c + ' ' + t.d).toLowerCase().includes(toolQ)
  );
  grid.innerHTML = list.length ? list.map(t =>
    '<div class="tool-card"><div class="tool-top"><div class="tool-logo" style="background:linear-gradient(135deg,' + t.g[0] + ',' + t.g[1] + ')"><i class="' + t.i + '"></i></div><h3>' + escapeHtml(t.n) + '</h3></div>' +
    '<p>' + escapeHtml(t.d) + '</p><div class="tool-meta"><span class="c">' + t.c + '</span><span class="p">' + t.p + '</span><span class="r">★ ' + t.r + '</span></div></div>'
  ).join('') : '<p style="grid-column:1/-1;text-align:center;color:var(--muted)">No tools match. Try another search.</p>';
  if (count) count.textContent = 'Showing ' + list.length + ' of ' + TOOLS.length + ' creator tools';
}
const toolSearch = document.getElementById('toolSearch');
if (toolSearch) toolSearch.addEventListener('input', () => { toolQ = toolSearch.value.trim().toLowerCase(); renderTools(); });
document.querySelectorAll('#toolPills .dtab').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('#toolPills .dtab').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  toolCat = b.dataset.cat;
  renderTools();
}));
renderTools();

// ---- Animated counters ----
const counters = document.querySelectorAll('.count');
if ('IntersectionObserver' in window && counters.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, target = parseInt(el.dataset.count) || 0;
      io.unobserve(el);
      const t0 = performance.now(), dur = 1400;
      (function tick(t) {
        const k = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))).toLocaleString('en-IN');
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: .5 });
  counters.forEach(c => io.observe(c));
} else {
  counters.forEach(c => c.textContent = (parseInt(c.dataset.count) || 0).toLocaleString('en-IN'));
}

// ---- FAQ accordion ----
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q'), a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => {
      o.classList.remove('open');
      o.querySelector('.faq-a').style.maxHeight = null;
      o.querySelector('.faq-a').classList.remove('pad');
    });
    if (!open) {
      item.classList.add('open');
      a.classList.add('pad');
      a.style.maxHeight = a.scrollHeight + 40 + 'px';
    }
  });
});
