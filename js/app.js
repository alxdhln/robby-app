/* =============================================================
   RoBby v2.0 – Baby Tracker
   ============================================================= */

// ─── FEEDING GUIDE ────────────────────────────────────────────
// NAN Supreme Pro 1 — confirmed via label data.
// Key: 32 days old (1 lună + 2 zile) → 5h interval → 06:42+5h = 11:42
const FEEDING_GUIDE = [
  { maxDays: 14,   ml: 60,  scoops: 2, intervalHours: 3,   label: '0–2 săptămâni' },
  { maxDays: 28,   ml: 90,  scoops: 3, intervalHours: 3.5, label: '2–4 săptămâni' },
  { maxDays: 60,   ml: 120, scoops: 4, intervalHours: 5,   label: '1–2 luni' },
  { maxDays: 90,   ml: 150, scoops: 5, intervalHours: 5,   label: '2–3 luni' },
  { maxDays: 120,  ml: 180, scoops: 6, intervalHours: 5,   label: '3–4 luni' },
  { maxDays: 180,  ml: 210, scoops: 7, intervalHours: 6,   label: '4–6 luni' },
];

// ─── STATE ───────────────────────────────────────────────────
const state = {
  currentScreen: 'home',
  reportDate: new Date(),
  milkType: 'formula',
  urineColor: 'clear',
  stoolColor: 'yellow',
  stoolAspect: 'normal',
  reminderTimer: null,
  firebaseDB: null,
  firebaseRef: null,
};

// ─── SETTINGS ────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  babyName: '', birthDate: '', gender: 'boy',
  formula: 'NAN Supreme Pro 1', theme: 'blue',
  remindersEnabled: false, customInterval: '', familyCode: '',
  firebase: { apiKey: '', authDomain: '', projectId: '', databaseURL: '', appId: '' },
};

function loadSettings() {
  try { return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(localStorage.getItem('robby_settings') || '{}')); }
  catch { return { ...DEFAULT_SETTINGS }; }
}
function saveSettingsToStorage(s) { localStorage.setItem('robby_settings', JSON.stringify(s)); }

let settings = loadSettings();

// ─── ENTRIES ─────────────────────────────────────────────────
function loadEntries() {
  try { return JSON.parse(localStorage.getItem('robby_entries') || '[]'); }
  catch { return []; }
}
function saveEntries(e) { localStorage.setItem('robby_entries', JSON.stringify(e)); }

function addEntry(entry) {
  const entries = loadEntries();
  entry.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  entry.createdAt = new Date().toISOString();
  entries.push(entry);
  saveEntries(entries);
  syncToFirebase(entry);
  return entry;
}

function deleteEntry(id) {
  saveEntries(loadEntries().filter(e => e.id !== id));
  deleteFromFirebase(id);
}

function getEntriesForDate(date) {
  const d = new Date(date);
  return loadEntries().filter(e => {
    const ed = new Date(e.timestamp);
    return ed.getFullYear() === d.getFullYear() &&
           ed.getMonth() === d.getMonth() &&
           ed.getDate() === d.getDate();
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// ─── HELPERS ─────────────────────────────────────────────────
function getBabyAgeInDays() {
  if (!settings.birthDate) return null;
  return Math.floor((Date.now() - new Date(settings.birthDate)) / 86400000);
}

// Returns { months, days } using calendar months (not 30-day approximation)
function getBabyAgeCalendar() {
  if (!settings.birthDate) return null;
  const birth = new Date(settings.birthDate);
  const now   = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months--;
  if (months < 0) months = 0;
  const afterMonths = new Date(birth);
  afterMonths.setMonth(afterMonths.getMonth() + months);
  const days = Math.floor((now - afterMonths) / 86400000);
  return { months, days };
}

function formatBabyAge() {
  const cal = getBabyAgeCalendar();
  if (!cal) return '';
  if (cal.months >= 1) {
    const ml = cal.months === 1 ? 'lună' : 'luni';
    return cal.days > 0
      ? `${cal.months} ${ml} și ${cal.days} ${cal.days === 1 ? 'zi' : 'zile'}`
      : `${cal.months} ${ml}`;
  }
  // Sub 1 lună → săptămâni + zile
  const days = getBabyAgeInDays() || 0;
  const w = Math.floor(days / 7), d = days % 7;
  let s = w > 0 ? `${w} săpt.` : '';
  if (d > 0) s += (s ? ' ' : '') + `${d} zile`;
  return s || '0 zile';
}

function getFeedingGuide() {
  const days = getBabyAgeInDays();
  if (days === null) return FEEDING_GUIDE[2]; // default: 1-2 luni
  return FEEDING_GUIDE.find(g => days <= g.maxDays) || FEEDING_GUIDE[FEEDING_GUIDE.length - 1];
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
}

function formatDateShort(date) {
  return new Date(date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' });
}

function toLocalDatetimeInput(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function isToday(date) {
  return new Date(date).toDateString() === new Date().toDateString();
}

function uid() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }

// ─── TIME AGO (fix #6) ────────────────────────────────────────
function timeAgo(iso) {
  const min = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (min < 1)  return 'acum';
  if (min < 60) return `acum ${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  if (h < 24)   return m > 0 ? `acum ${h}h ${m}min` : `acum ${h}h`;
  const days = Math.floor(h / 24);
  return days === 1 ? 'ieri' : `acum ${days} zile`;
}

// ─── TOAST / MODAL ───────────────────────────────────────────
let toastTimer;
function showToast(msg, dur = 2500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), dur);
}

function showModal(title, msg, onConfirm) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-message').textContent = msg;
  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('modal-confirm-btn').onclick = () => { closeModal(); onConfirm && onConfirm(); };
}
function closeModal() { document.getElementById('modal').classList.add('hidden'); }

// ─── NAVIGATION ──────────────────────────────────────────────
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const screen = document.getElementById(`screen-${name}`);
  if (screen) screen.classList.add('active');

  const btn = document.querySelector(`.nav-btn[data-screen="${name}"]`);
  if (btn) btn.classList.add('active');

  state.currentScreen = name;

  if (name === 'home')     refreshHome();
  if (name === 'meal')     initMealForm();
  if (name === 'urine')    initUrineForm();
  if (name === 'stool')    initStoolForm();
  if (name === 'report')   refreshReport();
  if (name === 'settings') loadSettingsForm();
}

// ─── HEADER HELPERS ──────────────────────────────────────────
function updateHeaderAge() {
  const ageEl = document.getElementById('header-baby-age');
  if (!ageEl) return;
  if (!settings.babyName || !settings.birthDate) { ageEl.textContent = ''; return; }
  ageEl.textContent = formatBabyAge();
}

// ─── HOME SCREEN ─────────────────────────────────────────────
function refreshHome() {
  document.getElementById('home-date').textContent = new Date().toLocaleDateString('ro-RO', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  updateHeaderAge();

  const now = new Date();
  const todayEntries = getEntriesForDate(now);
  const meals  = todayEntries.filter(e => e.type === 'meal');
  const urines = todayEntries.filter(e => e.type === 'urine');
  const stools = todayEntries.filter(e => e.type === 'stool');

  document.getElementById('today-meals').textContent  = meals.length;
  document.getElementById('today-urines').textContent = urines.length;
  document.getElementById('today-stools').textContent = stools.length;

  const totalMl = meals.filter(m => m.milkType === 'formula').reduce((s, m) => s + (m.ml || 0), 0);
  document.getElementById('today-ml').textContent = totalMl > 0 ? `${totalMl} ml` : '';

  updateNextFeeding(meals);
  renderTimeline(todayEntries.slice(0, 10));
}

// ─── FEEDING TIMER (fix #1) ───────────────────────────────────
function updateNextFeeding(meals) {
  const guide   = getFeedingGuide();
  const formula = settings.formula || 'NAN Supreme Pro 1';
  const scoopsTxt = guide.scoops ? ` · ${guide.scoops} linguri` : '';

  document.getElementById('next-feeding-amount').textContent =
    `${guide.ml} ml${scoopsTxt} · ${formula} · ${guide.label}`;

  const progressFill = document.getElementById('feeding-progress-fill');
  const countdown    = document.getElementById('feeding-countdown');
  const timeEl       = document.getElementById('next-feeding-time');

  if (meals.length === 0) {
    timeEl.textContent    = '--:--';
    countdown.textContent = 'Adaugă prima hrănire';
    if (progressFill) progressFill.style.width = '0%';
    document.getElementById('reminder-badge').classList.add('hidden');
    return;
  }

  const lastMeal = [...meals].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  const lastTime = new Date(lastMeal.timestamp);

  // Use custom interval (hours) from settings if set, otherwise use guide
  const intervalHours = parseFloat(settings.customInterval) || guide.intervalHours;
  const intervalMs    = intervalHours * 3600000;
  const nextTime      = new Date(lastTime.getTime() + intervalMs);
  const now           = new Date();
  const diffMs        = nextTime - now;
  const diffMin       = Math.round(diffMs / 60000);
  const progress      = Math.min(100, Math.max(0, ((now - lastTime) / intervalMs) * 100));

  if (progressFill) progressFill.style.width = progress + '%';
  timeEl.textContent = formatTime(nextTime);

  if (diffMin <= 0) {
    countdown.textContent = '🔔 Ora mesei a venit!';
    document.getElementById('reminder-badge').classList.remove('hidden');
    document.getElementById('reminder-text').textContent = 'Masă!';
    if (settings.remindersEnabled) triggerNotification();
  } else if (diffMin < 60) {
    countdown.textContent = `în ${diffMin} min`;
    document.getElementById('reminder-badge').classList.remove('hidden');
    document.getElementById('reminder-text').textContent = `${diffMin}min`;
  } else {
    const h = Math.floor(diffMin / 60), m = diffMin % 60;
    countdown.textContent = `în ${h}h${m > 0 ? ` ${m}min` : ''}`;
    document.getElementById('reminder-badge').classList.add('hidden');
  }
}

// ─── TIMELINE RENDERING (fix #6 + design) ────────────────────
function renderTimeline(entries) {
  const container = document.getElementById('recent-entries');
  if (entries.length === 0) {
    container.className = '';
    container.innerHTML = '<p class="empty-state">Nicio înregistrare astăzi.</p>';
    return;
  }
  container.className = 'timeline';
  container.innerHTML = entries.map(e => entryHTML(e)).join('');
}

function entryHTML(e) {
  let typeClass, dot, title, detail;

  if (e.type === 'meal') {
    typeClass = 'type-meal';
    dot = '🍼';
    if (e.milkType === 'breast') {
      title  = `Alăptare${e.duration ? ` · ${e.duration} min` : ''}`;
      detail = 'Sân';
    } else {
      title  = `Hrănire · ${e.ml} ml`;
      detail = settings.formula || 'Formulă';
    }
    if (e.notes) detail += ' · ' + e.notes;
  } else if (e.type === 'urine') {
    typeClass = 'type-urine';
    dot   = '💧';
    title  = `Pipi · ${urineColorLabel(e.color)}`;
    detail = e.notes || '';
  } else {
    typeClass = 'type-stool';
    dot   = '💩';
    title  = `Caca · ${stoolColorLabel(e.color)}`;
    detail = stoolAspectLabel(e.aspect) + (e.notes ? ' · ' + e.notes : '');
  }

  return `
  <div class="tl-item ${typeClass}">
    <div class="tl-dot">${dot}</div>
    <div class="tl-content">
      <div class="tl-header">
        <div class="tl-main">
          <div class="tl-title">${title}</div>
          ${detail ? `<div class="tl-detail">${detail}</div>` : ''}
        </div>
        <div class="tl-right">
          <div class="tl-time">${formatTime(e.timestamp)}</div>
          <div class="tl-ago">${timeAgo(e.timestamp)}</div>
          <button class="tl-delete" onclick="confirmDelete('${e.id}')" title="Șterge">✕</button>
        </div>
      </div>
    </div>
  </div>`;
}

// Flat card for report list (no timeline positioning)
function entryHTMLFlat(e) {
  let emoji, title, detail;
  if (e.type === 'meal') {
    emoji  = '🍼';
    title  = e.milkType === 'breast' ? `Alăptare${e.duration ? ` · ${e.duration} min` : ''}` : `Hrănire · ${e.ml} ml`;
    detail = e.milkType === 'formula' ? settings.formula || 'Formulă' : 'Sân';
    if (e.notes) detail += ' · ' + e.notes;
  } else if (e.type === 'urine') {
    emoji  = '💧';
    title  = `Pipi · ${urineColorLabel(e.color)}`;
    detail = e.notes || '';
  } else {
    emoji  = '💩';
    title  = `Caca · ${stoolColorLabel(e.color)} · ${stoolAspectLabel(e.aspect)}`;
    detail = e.notes || '';
  }
  return `<div class="entry-item">
    <span class="entry-emoji">${emoji}</span>
    <div class="entry-body">
      <div class="entry-title">${title}</div>
      ${detail ? `<div class="entry-detail">${detail}</div>` : ''}
    </div>
    <span class="entry-time">${formatTime(e.timestamp)}</span>
    <button class="delete-btn" onclick="confirmDelete('${e.id}')" title="Șterge">✕</button>
  </div>`;
}

function urineColorLabel(c)  { return { clear:'Clară', yellow:'Galbenă', dark:'Închisă' }[c] || c; }
function stoolColorLabel(c)  { return { yellow:'Galben', green:'Verde', brown:'Maro', black:'Negru', red:'Roșu ⚠️', white:'Alb ⚠️' }[c] || c; }
function stoolAspectLabel(a) { return { normal:'Normal', liquid:'Lichid', hard:'Tare', mucus:'Cu mucus' }[a] || a; }

function confirmDelete(id) {
  showModal('Șterge înregistrarea', 'Ești sigur că vrei să ștergi această înregistrare?', () => {
    deleteEntry(id);
    showToast('Înregistrare ștearsă');
    if (state.currentScreen === 'home')   refreshHome();
    if (state.currentScreen === 'report') refreshReport();
  });
}

// ─── MEAL FORM ───────────────────────────────────────────────
function initMealForm() {
  document.getElementById('meal-time').value  = toLocalDatetimeInput(new Date());
  document.getElementById('meal-notes').value = '';
  selectMilkType('formula');
  const guide   = getFeedingGuide();
  const formula = settings.formula || 'NAN Supreme Pro 1';
  document.getElementById('meal-ml').value = guide.ml;
  document.getElementById('suggested-amount').textContent =
    `✓ Recomandat: ${guide.ml} ml · ${guide.scoops} linguri (${guide.label}) · ${formula}`;
}

function selectMilkType(type) {
  state.milkType = type;
  document.getElementById('milk-formula').classList.toggle('active', type === 'formula');
  document.getElementById('milk-breast').classList.toggle('active', type === 'breast');
  document.getElementById('ml-group').classList.toggle('hidden', type === 'breast');
  document.getElementById('breast-duration-group').classList.toggle('hidden', type === 'formula');
}

function adjustMl(d) {
  const i = document.getElementById('meal-ml');
  i.value = Math.max(0, Math.min(400, (parseInt(i.value) || 0) + d));
}
function setMl(v) { document.getElementById('meal-ml').value = v; }

function adjustDuration(d) {
  const i = document.getElementById('meal-duration');
  i.value = Math.max(1, Math.min(60, (parseInt(i.value) || 0) + d));
}

function saveMeal() {
  const timeVal = document.getElementById('meal-time').value;
  if (!timeVal) { showToast('Selectați ora hrănirii'); return; }

  const entry = { type: 'meal', timestamp: new Date(timeVal).toISOString(), milkType: state.milkType };

  if (state.milkType === 'formula') {
    const ml = parseInt(document.getElementById('meal-ml').value);
    if (!ml || ml < 0) { showToast('Introduceți cantitatea în ml'); return; }
    entry.ml = ml;
  } else {
    entry.duration = parseInt(document.getElementById('meal-duration').value) || 15;
  }

  const notes = document.getElementById('meal-notes').value.trim();
  if (notes) entry.notes = notes;

  addEntry(entry);
  showToast('✓ Hrănire salvată!');
  showScreen('home');
}

// ─── PIPI FORM (fix #5 — fără cantitate) ─────────────────────
function initUrineForm() {
  document.getElementById('urine-time').value  = toLocalDatetimeInput(new Date());
  document.getElementById('urine-notes').value = '';
  state.urineColor = 'clear';
  document.querySelectorAll('#screen-urine .color-btn').forEach(b => b.classList.remove('active'));
  const first = document.querySelector('#screen-urine .color-btn[data-value="clear"]');
  if (first) first.classList.add('active');
}

function selectUrineColor(btn, val) {
  state.urineColor = val;
  document.querySelectorAll('#screen-urine .color-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function saveUrine() {
  const timeVal = document.getElementById('urine-time').value;
  if (!timeVal) { showToast('Selectați ora'); return; }
  const notes = document.getElementById('urine-notes').value.trim();
  addEntry({ type: 'urine', timestamp: new Date(timeVal).toISOString(), color: state.urineColor, ...(notes && { notes }) });
  showToast('✓ Pipi salvat!');
  showScreen('home');
}

// ─── CACA FORM ───────────────────────────────────────────────
function initStoolForm() {
  document.getElementById('stool-time').value  = toLocalDatetimeInput(new Date());
  document.getElementById('stool-notes').value = '';
  state.stoolColor  = 'yellow';
  state.stoolAspect = 'normal';
  document.querySelectorAll('#screen-stool .color-btn').forEach(b => b.classList.remove('active'));
  const yel = document.querySelector('#screen-stool .color-btn[data-value="yellow"]');
  if (yel) yel.classList.add('active');
  ['normal','liquid','hard','mucus'].forEach(a =>
    document.getElementById(`stool-${a}`)?.classList.toggle('active', a === 'normal')
  );
}

function selectStoolColor(btn, val) {
  state.stoolColor = val;
  document.querySelectorAll('#screen-stool .color-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function selectStoolAspect(btn, val) {
  state.stoolAspect = val;
  document.querySelectorAll('#screen-stool .toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function saveStool() {
  const timeVal = document.getElementById('stool-time').value;
  if (!timeVal) { showToast('Selectați ora'); return; }
  const notes = document.getElementById('stool-notes').value.trim();
  addEntry({ type: 'stool', timestamp: new Date(timeVal).toISOString(), color: state.stoolColor, aspect: state.stoolAspect, ...(notes && { notes }) });
  if (['red','white'].includes(state.stoolColor)) {
    showToast('⚠️ Culoare neobișnuită! Consultați medicul.', 4000);
  } else {
    showToast('✓ Caca salvată!');
  }
  showScreen('home');
}

// ─── REPORT ──────────────────────────────────────────────────
function refreshReport() {
  const entries = getEntriesForDate(state.reportDate);
  const meals   = entries.filter(e => e.type === 'meal');
  const urines  = entries.filter(e => e.type === 'urine');
  const stools  = entries.filter(e => e.type === 'stool');
  const totalMl = meals.filter(m => m.milkType === 'formula').reduce((s, m) => s + (m.ml || 0), 0);
  const breast  = meals.filter(m => m.milkType === 'breast').length;
  const days    = getBabyAgeInDays();
  const dateStr = formatDateShort(state.reportDate);

  document.getElementById('report-date-display').textContent = dateStr;
  const nextBtn = document.getElementById('report-next-btn');
  nextBtn.disabled = isToday(state.reportDate);
  nextBtn.style.opacity = isToday(state.reportDate) ? '0.3' : '1';

  document.getElementById('report-stats').innerHTML = `
    <div class="stat-card">
      <div class="stat-label">🍼 Hrăniri</div>
      <div class="stat-value">${meals.length}</div>
      <div class="stat-sub">${totalMl > 0 ? totalMl + ' ml' : ''}${breast > 0 ? (totalMl > 0 ? ' + ' : '') + breast + ' alăptări' : ''}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">💧 Pipi</div>
      <div class="stat-value">${urines.length}</div>
      <div class="stat-sub">${urines.map(u => urineColorLabel(u.color)).slice(0,3).join(', ') || '—'}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">💩 Caca</div>
      <div class="stat-value">${stools.length}</div>
      <div class="stat-sub">${stools.map(s => stoolColorLabel(s.color)).slice(0,3).join(', ') || '—'}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">⏱️ Interval mediu</div>
      <div class="stat-value">${avgInterval(meals)}</div>
      <div class="stat-sub">între hrăniri</div>
    </div>`;

  const babyInfo = settings.babyName
    ? `${settings.babyName}${days !== null ? ` · ${Math.floor(days/7)} săpt. ${days%7} zile` : ''}`
    : 'Bebeluș';

  const sections = [
    { label: '🍼 Hrăniri', items: meals },
    { label: '💧 Pipi',    items: urines },
    { label: '💩 Caca',    items: stools },
  ];

  document.getElementById('report-entries').innerHTML =
    sections.map(sec => `
      <div class="report-section">
        <div class="report-section-title">${sec.label} (${sec.items.length})</div>
        <div class="entries-list">
          ${sec.items.length === 0
            ? '<p class="empty-state" style="padding:10px 0">Nicio înregistrare</p>'
            : sec.items.sort((a,b) => new Date(b.timestamp)-new Date(a.timestamp)).map(e => entryHTMLFlat(e)).join('')}
        </div>
      </div>`).join('')
    + `<p style="text-align:center;font-size:12px;color:var(--text-muted);margin-top:8px">${babyInfo} · ${dateStr}</p>`;
}

function avgInterval(meals) {
  if (meals.length < 2) return '—';
  const sorted = [...meals].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  let total = 0;
  for (let i = 1; i < sorted.length; i++)
    total += (new Date(sorted[i].timestamp) - new Date(sorted[i-1].timestamp)) / 60000;
  const avg = Math.round(total / (sorted.length - 1));
  const h = Math.floor(avg / 60), m = avg % 60;
  return h > 0 ? `${h}h${m > 0 ? m + 'min' : ''}` : `${m}min`;
}

function changeReportDate(delta) {
  const d = new Date(state.reportDate);
  d.setDate(d.getDate() + delta);
  if (d > new Date()) return;
  state.reportDate = d;
  refreshReport();
}

// ─── PDF EXPORT ──────────────────────────────────────────────
function exportPrint() {
  const entries = getEntriesForDate(state.reportDate);
  const meals   = entries.filter(e => e.type === 'meal');
  const urines  = entries.filter(e => e.type === 'urine');
  const stools  = entries.filter(e => e.type === 'stool');
  const totalMl = meals.filter(m => m.milkType === 'formula').reduce((s,m) => s+(m.ml||0), 0);
  const days    = getBabyAgeInDays();
  const themeColor = settings.theme === 'pink' ? '#C95B87' : '#4A90D9';

  const rowMeals  = meals.sort((a,b) => new Date(a.timestamp)-new Date(b.timestamp)).map(m =>
    `<tr><td>${formatTime(m.timestamp)}</td><td>${m.milkType==='breast'?'Sân':'Formulă'}</td>
     <td>${m.milkType==='breast'?(m.duration||'—')+' min':(m.ml||'—')+' ml'}</td><td>${m.notes||''}</td></tr>`).join('');
  const rowUrines = urines.sort((a,b) => new Date(a.timestamp)-new Date(b.timestamp)).map(u =>
    `<tr><td>${formatTime(u.timestamp)}</td><td>${urineColorLabel(u.color)}</td><td>${u.notes||''}</td></tr>`).join('');
  const rowStools = stools.sort((a,b) => new Date(a.timestamp)-new Date(b.timestamp)).map(s =>
    `<tr><td>${formatTime(s.timestamp)}</td><td>${stoolColorLabel(s.color)}</td><td>${stoolAspectLabel(s.aspect)}</td><td>${s.notes||''}</td></tr>`).join('');

  const html = `<!DOCTYPE html><html lang="ro"><head><meta charset="UTF-8">
  <title>Raport RoBby – ${formatDateShort(state.reportDate)}</title>
  <style>
    body{font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;color:#222}
    h1{font-size:22px;border-bottom:3px solid ${themeColor};padding-bottom:8px;color:${themeColor};margin-bottom:12px}
    .meta{font-size:13px;color:#555;margin-bottom:18px;line-height:1.8}
    .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:22px}
    .stat{background:#f5f8ff;border-radius:8px;padding:12px;text-align:center;border:1px solid #dde8ff}
    .stat-n{font-size:26px;font-weight:800;color:${themeColor}}
    .stat-l{font-size:11px;color:#777;margin-top:3px}
    h2{font-size:15px;font-weight:700;color:${themeColor};margin:18px 0 8px;border-left:3px solid ${themeColor};padding-left:8px}
    table{width:100%;border-collapse:collapse;margin-bottom:4px}
    th{background:${themeColor};color:#fff;padding:8px 10px;text-align:left;font-size:13px;font-weight:600}
    td{padding:7px 10px;border-bottom:1px solid #eee;font-size:13px}
    tr:nth-child(even) td{background:#fafafa}
    .empty{color:#aaa;font-style:italic;font-size:13px;padding:8px 0}
    .footer{font-size:11px;color:#aaa;text-align:center;margin-top:28px;border-top:1px solid #eee;padding-top:12px}
    @media print{body{padding:8px}}
  </style></head><body>
  <h1>🍼 Raport Zilnic – RoBby</h1>
  <div class="meta">
    <b>Bebeluș:</b> ${settings.babyName||'N/A'} &nbsp;·&nbsp;
    <b>Vârstă:</b> ${days!==null?Math.floor(days/7)+' săpt. '+(days%7)+' zile':'N/A'} &nbsp;·&nbsp;
    <b>Data:</b> ${formatDateShort(state.reportDate)} &nbsp;·&nbsp;
    <b>Formulă:</b> ${settings.formula||'N/A'}
  </div>
  <div class="stats">
    <div class="stat"><div class="stat-n">${meals.length}</div><div class="stat-l">Hrăniri</div></div>
    <div class="stat"><div class="stat-n">${totalMl}</div><div class="stat-l">ml formulă</div></div>
    <div class="stat"><div class="stat-n">${urines.length}</div><div class="stat-l">Pipi</div></div>
    <div class="stat"><div class="stat-n">${stools.length}</div><div class="stat-l">Caca</div></div>
  </div>
  <h2>🍼 Hrăniri</h2>
  ${meals.length===0?'<p class="empty">Fără înregistrări</p>':`<table><tr><th>Ora</th><th>Tip</th><th>Cantitate</th><th>Observații</th></tr>${rowMeals}</table>`}
  <h2>💧 Pipi</h2>
  ${urines.length===0?'<p class="empty">Fără înregistrări</p>':`<table><tr><th>Ora</th><th>Culoare</th><th>Observații</th></tr>${rowUrines}</table>`}
  <h2>💩 Caca</h2>
  ${stools.length===0?'<p class="empty">Fără înregistrări</p>':`<table><tr><th>Ora</th><th>Culoare</th><th>Consistență</th><th>Observații</th></tr>${rowStools}</table>`}
  <div class="footer">Generat de RoBby · ${new Date().toLocaleString('ro-RO')} · Document pentru uz medical</div>
  </body></html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  } else {
    showToast('Permiteți popup-urile pentru export PDF');
  }
}

// ─── SETTINGS ────────────────────────────────────────────────
function loadSettingsForm() {
  document.getElementById('setting-baby-name').value  = settings.babyName || '';
  document.getElementById('setting-birth-date').value = settings.birthDate || '';
  document.getElementById('setting-formula').value    = settings.formula || 'NAN Supreme Pro 1';
  document.getElementById('setting-interval').value   = settings.customInterval || '';
  document.getElementById('setting-reminders').checked = !!settings.remindersEnabled;
  document.getElementById('reminder-settings').classList.toggle('hidden', !settings.remindersEnabled);

  selectGender(settings.gender || 'boy');
  applyTheme(settings.theme || 'blue');
  document.getElementById('theme-blue').classList.toggle('active', settings.theme !== 'pink');
  document.getElementById('theme-pink').classList.toggle('active', settings.theme === 'pink');

  document.getElementById('family-code-text').textContent = settings.familyCode || '—';

  const fb = settings.firebase || {};
  document.getElementById('fb-api-key').value     = fb.apiKey     || '';
  document.getElementById('fb-auth-domain').value = fb.authDomain || '';
  document.getElementById('fb-project-id').value  = fb.projectId  || '';
  document.getElementById('fb-db-url').value       = fb.databaseURL|| '';
  document.getElementById('fb-app-id').value       = fb.appId      || '';
}

function selectGender(g) {
  settings.gender = g;
  document.getElementById('gender-boy').classList.toggle('active', g === 'boy');
  document.getElementById('gender-girl').classList.toggle('active', g === 'girl');
}

function saveSettings() {
  settings.babyName       = document.getElementById('setting-baby-name').value.trim();
  settings.birthDate      = document.getElementById('setting-birth-date').value;
  settings.formula        = document.getElementById('setting-formula').value.trim() || 'NAN Supreme Pro 1';
  settings.customInterval = document.getElementById('setting-interval').value;
  saveSettingsToStorage(settings);
  document.getElementById('header-baby-name').textContent = settings.babyName || 'RoBby';
  updateHeaderAge();
  showToast('✓ Setări salvate!');
}

function selectTheme(theme) {
  settings.theme = theme;
  applyTheme(theme);
  document.getElementById('theme-blue').classList.toggle('active', theme === 'blue');
  document.getElementById('theme-pink').classList.toggle('active', theme === 'pink');
  saveSettingsToStorage(settings);
  showToast(`Temă: ${theme === 'blue' ? 'Baby Blue 💙' : 'Cotton Pink 🩷'}`);
}

function applyTheme(theme) {
  document.getElementById('app').className = `theme-${theme}`;
  document.getElementById('meta-theme-color').content = theme === 'pink' ? '#C95B87' : '#4A90D9';
}

function toggleReminders(enabled) {
  settings.remindersEnabled = enabled;
  document.getElementById('reminder-settings').classList.toggle('hidden', !enabled);
  saveSettingsToStorage(settings);
  if (enabled) { requestNotificationPermission(); startReminderTimer(); }
  else          { clearInterval(state.reminderTimer); }
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default')
    Notification.requestPermission();
}

function startReminderTimer() {
  clearInterval(state.reminderTimer);
  state.reminderTimer = setInterval(() => {
    if (state.currentScreen === 'home') refreshHome();
    checkReminderNotification();
  }, 60000);
}

function checkReminderNotification() {
  if (!settings.remindersEnabled) return;
  const meals = getEntriesForDate(new Date()).filter(e => e.type === 'meal');
  if (!meals.length) return;
  const guide     = getFeedingGuide();
  const interval  = (parseFloat(settings.customInterval) || guide.intervalHours) * 3600000;
  const lastMeal  = [...meals].sort((a,b) => new Date(b.timestamp)-new Date(a.timestamp))[0];
  const nextTime  = new Date(new Date(lastMeal.timestamp).getTime() + interval);
  if (new Date() >= nextTime) triggerNotification();
}

function triggerNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    const guide = getFeedingGuide();
    new Notification('🍼 RoBby – Ora hrănirii!', {
      body: `${settings.babyName || 'Bebelușul'} trebuie hrănit. Recomandat: ${guide.ml} ml`,
      icon: 'icons/icon-192.png',
      tag: 'feeding-reminder',
      renotify: false,
    });
  }
}

// ─── FAMILY SYNC ─────────────────────────────────────────────
function createFamily() {
  const code = uid();
  settings.familyCode = code;
  saveSettingsToStorage(settings);
  document.getElementById('family-code-text').textContent = code;
  showToast(`Cod familie: ${code}`);
  if (state.firebaseDB) connectFirebaseFamily(code);
}

function joinFamily() {
  const code = document.getElementById('join-code').value.trim().toUpperCase();
  if (code.length !== 6) { showToast('Codul trebuie să aibă 6 caractere'); return; }
  settings.familyCode = code;
  saveSettingsToStorage(settings);
  document.getElementById('family-code-text').textContent = code;
  showToast(`Alăturat familiei: ${code}`);
  if (state.firebaseDB) connectFirebaseFamily(code);
}

function copyFamilyCode() {
  const code = settings.familyCode;
  if (!code) { showToast('Creați mai întâi un cod de familie'); return; }
  navigator.clipboard?.writeText(code)
    .then(() => showToast('Cod copiat!'))
    .catch(() => showToast(`Cod: ${code}`));
}

// ─── FIREBASE ────────────────────────────────────────────────
function saveFirebaseConfig() {
  const fb = {
    apiKey:      document.getElementById('fb-api-key').value.trim(),
    authDomain:  document.getElementById('fb-auth-domain').value.trim(),
    projectId:   document.getElementById('fb-project-id').value.trim(),
    databaseURL: document.getElementById('fb-db-url').value.trim(),
    appId:       document.getElementById('fb-app-id').value.trim(),
  };
  if (!fb.apiKey || !fb.projectId || !fb.databaseURL) {
    showToast('Completați API Key, Project ID și Database URL');
    return;
  }
  settings.firebase = fb;
  saveSettingsToStorage(settings);
  initFirebase(fb);
}

function initFirebase(config) {
  const statusEl = document.getElementById('sync-status');
  if (!statusEl) return;
  statusEl.textContent = 'Se conectează…';
  statusEl.className = 'sync-status';

  loadFirebase().then(() => {
    try {
      if (!firebase.apps.length) firebase.initializeApp(config);
      state.firebaseDB = firebase.database();
      statusEl.textContent = '✓ Conectat la Firebase!';
      statusEl.className = 'sync-status ok';
      showToast('✓ Firebase conectat!');
      if (settings.familyCode) connectFirebaseFamily(settings.familyCode);
    } catch (err) {
      statusEl.textContent = 'Eroare: ' + err.message;
      statusEl.className = 'sync-status error';
    }
  }).catch(() => {
    statusEl.textContent = 'Nu s-a putut încărca Firebase.';
    statusEl.className = 'sync-status error';
  });
}

function connectFirebaseFamily(code) {
  if (!state.firebaseDB) return;
  if (state.firebaseRef) state.firebaseRef.off();
  state.firebaseRef = state.firebaseDB.ref(`families/${code}/entries`);

  state.firebaseRef.on('child_added', snap => {
    const remote = snap.val();
    if (!remote) return;
    const entries = loadEntries();
    if (!entries.find(e => e.id === remote.id)) {
      entries.push(remote);
      saveEntries(entries);
      if (state.currentScreen === 'home')   refreshHome();
      if (state.currentScreen === 'report') refreshReport();
    }
  });

  state.firebaseRef.on('child_removed', snap => {
    saveEntries(loadEntries().filter(e => e.id !== snap.key));
    if (state.currentScreen === 'home')   refreshHome();
    if (state.currentScreen === 'report') refreshReport();
  });
}

function syncToFirebase(entry) {
  if (!state.firebaseDB || !settings.familyCode) return;
  state.firebaseDB.ref(`families/${settings.familyCode}/entries/${entry.id}`).set(entry);
}

function deleteFromFirebase(id) {
  if (!state.firebaseDB || !settings.familyCode) return;
  state.firebaseDB.ref(`families/${settings.familyCode}/entries/${id}`).remove();
}

// ─── DATA ────────────────────────────────────────────────────
function confirmClearData() {
  showModal('Șterge toate datele', 'Ești sigur? Această acțiune va șterge TOATE înregistrările și nu poate fi anulată.', () => {
    localStorage.removeItem('robby_entries');
    showToast('Toate datele au fost șterse');
    showScreen('home');
  });
}

// ─── INIT ────────────────────────────────────────────────────
function init() {
  // Corectare dată naștere: dacă e salvată 2026-04-03 → înlocuiește cu 2026-04-05
  if (settings.birthDate === '2026-04-03') {
    settings.birthDate = '2026-04-05';
    saveSettingsToStorage(settings);
  }

  applyTheme(settings.theme || 'blue');

  setTimeout(() => {
    document.getElementById('screen-splash').style.display = 'none';
    document.getElementById('app-header').classList.remove('hidden');
    document.getElementById('app-main').classList.remove('hidden');
    document.getElementById('bottom-nav').classList.remove('hidden');

    document.getElementById('header-baby-name').textContent = settings.babyName || 'RoBby';
    updateHeaderAge();

    if (!settings.babyName) showToast('Configurați bebelușul în Setări ⚙️', 3500);

    showScreen('home'); // fix #2 — always home on launch

    if (settings.remindersEnabled) startReminderTimer();

    if (settings.firebase?.apiKey && settings.firebase?.databaseURL)
      initFirebase(settings.firebase);

    if ('serviceWorker' in navigator)
      navigator.serviceWorker.register('sw.js').catch(() => {});

    // Refresh home every minute for live countdown
    setInterval(() => {
      if (state.currentScreen === 'home') refreshHome();
    }, 60000);

  }, 1500);
}

// fix #2 — restore to home if browser restores from bfcache (PWA)
window.addEventListener('pageshow', e => {
  if (e.persisted) showScreen('home');
});

document.addEventListener('DOMContentLoaded', init);
