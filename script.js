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
const sections = ['home','ai','editing','shooting','courses','problem','agency'];
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

// ---- AI CHATBOT (English, rule-based demo) ----
const chatBody = document.getElementById('chatBody');
function addMsg(text, who) {
  if (!chatBody) return;
  const d = document.createElement('div');
  d.className = 'msg ' + who;
  if (who === 'user') d.textContent = text;
  else d.innerHTML = text;
  chatBody.appendChild(d);
  chatBody.scrollTop = chatBody.scrollHeight;
}
function aiReply(q) {
  q = String(q).toLowerCase();
  if (q.includes('price') || q.includes('edit') || q.includes('rate') || q.includes('cost'))
    return "Our editing prices: Reel/Shorts from <b>₹499</b>, Vlog/YouTube from <b>₹1499</b>, Photo retouch <b>₹99/photo</b>. Use the <b>Editing calculator</b> for the exact total. Want to place an order?";
  if (q.includes('shoot') || q.includes('camera') || q.includes('book') || q.includes('studio'))
    return "To book a shoot: go to the <b>Shooting section</b>, select type (Reel ₹1999 / Product ₹3499 / Event ₹7999), enter city + date. We confirm on WhatsApp within 2 hours.";
  if (q.includes('course') || q.includes('learn') || q.includes('class') || q.includes('join'))
    return "We have 3 courses: <b>Mobile Editing ₹999</b>, <b>0-100K Growth ₹1499</b>, <b>Brand Deals ₹1999</b>. Click <b>Enroll</b> in the Courses section and we will send payment + login details.";
  if (q.includes('agency') || q.includes('work') || q.includes('job') || q.includes('part'))
    return "For part-time agency work: open the <b>Agency Work</b> section. <b>Influencers</b> apply for brand reels, <b>Editors</b> apply for editing jobs. Agencies can post work in the <b>For Agencies</b> tab.";
  if (q.includes('problem') || q.includes('help') || q.includes('support') || q.includes('refund') || q.includes('payment'))
    return "Sorry to hear that! Please fill the <b>Support / Problem form</b> with your name, number and details. You will get a ticket number and a reply within 24 hours.";
  if (q.includes('hi') || q.includes('hello') || q.includes('hey'))
    return "Hello! How can I help — <b>editing, shooting, courses, support or agency work</b>?";
  if (q.includes('offer') || q.includes('discount') || q.includes('free'))
    return "Today's offer: first reel edit <b>FREE</b> + 20% OFF on shooting with code <b>SONALI20</b>.";
  return "Got it! Tell me which one you need — <b>editing prices, shooting booking, courses, support or agency work</b> — or use the quick buttons above. A human also replies on WhatsApp Mon–Sat 10am–8pm.";
}
function sendChat() {
  const inp = document.getElementById('chatInput');
  if (!inp) return;
  const v = inp.value.trim().slice(0, 500);
  if (!v) return;
  addMsg(v, 'user');
  inp.value = '';
  inp.focus();
  setTimeout(() => addMsg(aiReply(v), 'ai'), 450);
}
function askAI(q) {
  addMsg(String(q).slice(0, 200), 'user');
  const body = document.getElementById('ai');
  if (body) body.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => addMsg(aiReply(q), 'ai'), 450);
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
  if (el) el.innerHTML = 'Great choice! <b>' + escapeHtml(course) + '</b> selected. We will send the payment link and login details on WhatsApp. Offer code: <b>SONALI20</b>';
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
