/* =============================================================
   RoBby v2.0 – Baby Tracker
   ============================================================= */

// ─── FORMULA BRANDS ───────────────────────────────────────────
const FORMULA_BRANDS = [
  'NAN Supreme Pro 1','NAN Supreme Pro 2','NAN Optipro 1','NAN Optipro 2',
  'Aptamil 1','Aptamil 2','Aptamil Pronutra','Nutrilon 1','Nutrilon 2',
  'Similac Advance','Similac Total Comfort','Enfamil Premium','Enfamil Gentlease',
  'HiPP BIO 1','HiPP Combiotic 2','Humana 1','Humana 2',
  'Bebivita 1','Novalac 1','Milupa Milumil 1',
];

// ─── FORMULA BRAND GUIDE ─────────────────────────────────────
const FORMULA_BRAND_GUIDE = {
  'NAN Supreme Pro 1':     [{ maxDays: 999, ml: 120, scoops: 4, label: '0–6 luni' }],
  'NAN Supreme Pro 2':     [{ maxDays: 999, ml: 150, scoops: 5, label: '6–12 luni' }],
  'NAN Optipro 1':         [{ maxDays: 999, ml: 120, scoops: 4, label: '0–6 luni' }],
  'NAN Optipro 2':         [{ maxDays: 999, ml: 150, scoops: 5, label: '6–12 luni' }],
  'Aptamil 1':             [{ maxDays: 60, ml: 90, scoops: 3, label: '0–2 luni' }, { maxDays: 999, ml: 120, scoops: 4, label: '2–6 luni' }],
  'Aptamil 2':             [{ maxDays: 999, ml: 150, scoops: 5, label: '6–12 luni' }],
  'Aptamil Pronutra':      [{ maxDays: 999, ml: 90,  scoops: 3, label: '0–6 luni' }],
  'Nutrilon 1':            [{ maxDays: 999, ml: 90,  scoops: 3, label: '0–6 luni' }],
  'Nutrilon 2':            [{ maxDays: 999, ml: 150, scoops: 5, label: '6–12 luni' }],
  'Similac Advance':       [{ maxDays: 999, ml: 120, scoops: 4, label: '0–12 luni' }],
  'Similac Total Comfort': [{ maxDays: 999, ml: 120, scoops: 4, label: '0–12 luni' }],
  'Enfamil Premium':       [{ maxDays: 999, ml: 90,  scoops: 3, label: '0–6 luni' }],
  'Enfamil Gentlease':     [{ maxDays: 999, ml: 120, scoops: 4, label: '0–12 luni' }],
  'HiPP BIO 1':            [{ maxDays: 999, ml: 90,  scoops: 3, label: '0–6 luni' }],
  'HiPP Combiotic 2':      [{ maxDays: 999, ml: 150, scoops: 5, label: '6–12 luni' }],
  'Humana 1':              [{ maxDays: 999, ml: 90,  scoops: 3, label: '0–6 luni' }],
  'Humana 2':              [{ maxDays: 999, ml: 150, scoops: 5, label: '6–12 luni' }],
  'Bebivita 1':            [{ maxDays: 999, ml: 90,  scoops: 3, label: '0–6 luni' }],
  'Novalac 1':             [{ maxDays: 999, ml: 90,  scoops: 3, label: '0–6 luni' }],
  'Milupa Milumil 1':      [{ maxDays: 999, ml: 90,  scoops: 3, label: '0–6 luni' }],
};

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
  reportPeriod: 'zi',
  reportWeekOffset: 0,
  reportMonthOffset: 0,
  activeBabyId: '',
  editingBabyId: '',
  milkType: 'formula',
  urineColor: 'clear',
  stoolColor: 'yellow',
  stoolAspect: 'normal',
  reminderTimer: null,
  firebaseDB: null,
  firebaseRef: null,
  lastNotificationAtByTag: {},
  statsMonthOffset: 0,
};

// Window start month (0 or 6) per metric key for in-app growth charts
const growthChartWindows = {};

// ─── SETTINGS ────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  babyName: '', birthDate: '', gender: 'boy',
  formula: 'NAN Supreme Pro 1', theme: 'blue',
  darkMode: false,
  pdfIncludeCharts: true,
  pdfIncludeGrowth: true,
  defaultReportPeriod: 'zi',
  remindersEnabled: false, customInterval: '', familyCode: '',
  notifications: {
    feedingAlert: { enabled: false, limitHours: 3 },
    vitaminD: { enabled: false, time: '09:00' },
    vaccineDue: { enabled: false, daysAhead: 30 },
  },
  firebase: { apiKey: '', authDomain: '', projectId: '', databaseURL: '', appId: '' },
};
const BABIES_KEY = 'robby_babies';
const ACTIVE_BABY_KEY = 'robby_active_baby';
const MIGRATION_V3_KEY = 'robby_migrated_v3';
const GROWTH_KEY = 'robby_growth_records';
const VACCINE_RECORDS_KEY = 'robby_vaccine_records';
const VACCINE_SCHEDULE_RO = [
  { id: 'hep-b-1', name: 'Hepatita B (doza 1)', ageLabel: 'la naștere', dueDays: 0 },
  { id: 'bcg', name: 'BCG (tuberculoză)', ageLabel: 'la naștere', dueDays: 0 },
  { id: 'hep-b-2', name: 'Hepatita B (doza 2)', ageLabel: '2 luni', dueDays: 60 },
  { id: 'hexavalent-1', name: 'Hexavalent (DTPa-VPI-Hib-HepB) doza 1', ageLabel: '2 luni', dueDays: 60 },
  { id: 'pneumo-1', name: 'Pneumococic conjugat doza 1', ageLabel: '2 luni', dueDays: 60 },
  { id: 'hexavalent-2', name: 'Hexavalent doza 2', ageLabel: '4 luni', dueDays: 120 },
  { id: 'pneumo-2', name: 'Pneumococic conjugat doza 2', ageLabel: '4 luni', dueDays: 120 },
  { id: 'hexavalent-3', name: 'Hexavalent doza 3', ageLabel: '11 luni', dueDays: 335 },
  { id: 'pneumo-3', name: 'Pneumococic conjugat doza 3', ageLabel: '11 luni', dueDays: 335 },
  { id: 'mmr-1', name: 'ROR (rujeolă-rubeolă-oreion) doza 1', ageLabel: '12 luni', dueDays: 365 },
];

const WHO_GROWTH = {
  // Approximate WHO-style percentile points by month for 0-12m
  weightKg: {
    p3:  [2.5,3.3,4.1,4.8,5.3,5.8,6.2,6.6,6.9,7.2,7.4,7.6,7.8],
    p15: [2.8,3.8,4.7,5.4,6.0,6.5,6.9,7.3,7.6,7.9,8.2,8.4,8.6],
    p50: [3.3,4.5,5.6,6.4,7.0,7.5,7.9,8.3,8.6,8.9,9.2,9.4,9.6],
    p85: [3.8,5.1,6.3,7.2,7.9,8.5,9.0,9.4,9.8,10.1,10.4,10.7,10.9],
    p97: [4.2,5.7,7.0,7.9,8.7,9.3,9.8,10.3,10.7,11.1,11.4,11.7,12.0],
  },
  heightCm: {
    p3:  [46.0,50.0,53.0,55.5,58.0,60.0,62.0,63.5,65.0,66.2,67.4,68.5,69.5],
    p15: [47.5,51.5,54.8,57.5,60.0,62.2,64.0,65.8,67.2,68.6,69.8,71.0,72.0],
    p50: [49.5,53.7,57.1,60.0,62.5,64.7,66.5,68.0,69.5,70.8,72.0,73.2,74.2],
    p85: [51.5,55.7,59.2,62.2,64.8,67.0,69.0,70.8,72.2,73.8,75.0,76.2,77.2],
    p97: [53.0,57.2,60.8,64.0,66.8,69.2,71.2,73.0,74.8,76.2,77.8,79.0,80.2],
  },
  headCm: {
    p3:  [32.0,34.2,35.5,36.5,37.3,38.0,38.5,39.0,39.4,39.8,40.1,40.4,40.7],
    p15: [33.0,35.2,36.6,37.7,38.6,39.3,39.9,40.4,40.9,41.3,41.6,41.9,42.2],
    p50: [34.0,36.3,37.8,39.0,40.0,40.8,41.5,42.1,42.6,43.0,43.4,43.7,44.0],
    p85: [35.0,37.4,39.0,40.3,41.4,42.3,43.0,43.7,44.2,44.7,45.0,45.4,45.7],
    p97: [35.8,38.2,39.9,41.3,42.5,43.5,44.2,44.9,45.4,45.9,46.3,46.6,47.0],
  },
};

function loadSettings() {
  try {
    const raw = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(localStorage.getItem('robby_settings') || '{}'));
    const notif = raw.notifications || {};
    raw.notifications = {
      feedingAlert: {
        enabled: typeof notif.feedingAlert?.enabled === 'boolean' ? notif.feedingAlert.enabled : !!raw.remindersEnabled,
        limitHours: Number(notif.feedingAlert?.limitHours || 3),
      },
      vitaminD: {
        enabled: typeof notif.vitaminD?.enabled === 'boolean' ? notif.vitaminD.enabled : false,
        time: notif.vitaminD?.time || '09:00',
      },
      vaccineDue: {
        enabled: typeof notif.vaccineDue?.enabled === 'boolean' ? notif.vaccineDue.enabled : false,
        daysAhead: Number(notif.vaccineDue?.daysAhead || 30),
      },
    };
    return raw;
  }
  catch { return { ...DEFAULT_SETTINGS }; }
}
function saveSettingsToStorage(s) { localStorage.setItem('robby_settings', JSON.stringify(s)); }

let settings = loadSettings();

function createBabyProfile(data = {}) {
  return {
    id: data.id || ('b_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)),
    name: data.name || 'Bebeluș',
    birthDate: data.birthDate || '',
    birthWeight: data.birthWeight || '',
    bloodType: data.bloodType || '',
    gender: data.gender || 'boy',
    photoDataUrl: data.photoDataUrl || '',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function loadBabies() {
  try {
    const parsed = JSON.parse(localStorage.getItem(BABIES_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBabies(babies) {
  localStorage.setItem(BABIES_KEY, JSON.stringify(babies));
}

function getActiveBabyId() {
  return localStorage.getItem(ACTIVE_BABY_KEY) || '';
}

function setActiveBabyId(id) {
  state.activeBabyId = id;
  localStorage.setItem(ACTIVE_BABY_KEY, id);
}

function getActiveBaby() {
  const babies = loadBabies();
  return babies.find(b => b.id === state.activeBabyId) || babies[0] || null;
}

function migrateToV3IfNeeded() {
  if (localStorage.getItem(MIGRATION_V3_KEY) === '1') {
    state.activeBabyId = getActiveBabyId();
    return;
  }
  let babies = loadBabies();
  if (!babies.length) {
    babies = [createBabyProfile({
      name: settings.babyName || 'Bebeluș',
      birthDate: settings.birthDate || '',
      gender: settings.gender || 'boy',
    })];
    saveBabies(babies);
  }
  let activeId = getActiveBabyId();
  if (!activeId || !babies.find(b => b.id === activeId)) {
    activeId = babies[0].id;
    localStorage.setItem(ACTIVE_BABY_KEY, activeId);
  }
  const entries = loadEntries();
  const patched = entries.map(e => (e.babyId ? e : { ...e, babyId: activeId }));
  if (patched.length !== entries.length || patched.some((e, i) => e !== entries[i])) {
    saveEntries(patched);
  }
  state.activeBabyId = activeId;
  localStorage.setItem(MIGRATION_V3_KEY, '1');
}

// ─── ENTRIES ─────────────────────────────────────────────────
function loadEntries() {
  try { return JSON.parse(localStorage.getItem('robby_entries') || '[]'); }
  catch { return []; }
}
function saveEntries(e) { localStorage.setItem('robby_entries', JSON.stringify(e)); }

function loadGrowthRecords() {
  try {
    const parsed = JSON.parse(localStorage.getItem(GROWTH_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveGrowthRecords(records) {
  localStorage.setItem(GROWTH_KEY, JSON.stringify(records));
}

function loadVaccineRecords() {
  try {
    const parsed = JSON.parse(localStorage.getItem(VACCINE_RECORDS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveVaccineRecords(records) {
  localStorage.setItem(VACCINE_RECORDS_KEY, JSON.stringify(records));
}

function addEntry(entry) {
  const entries = loadEntries();
  entry.babyId = state.activeBabyId || getActiveBabyId();
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
  const activeId = state.activeBabyId || getActiveBabyId();
  return loadEntries().filter(e => {
    if (activeId && e.babyId !== activeId) return false;
    const ed = new Date(e.timestamp);
    return ed.getFullYear() === d.getFullYear() &&
           ed.getMonth() === d.getMonth() &&
           ed.getDate() === d.getDate();
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function getEntriesForRange(start, end) {
  const activeId = state.activeBabyId || getActiveBabyId();
  return loadEntries().filter(e => {
    if (activeId && e.babyId !== activeId) return false;
    const t = new Date(e.timestamp);
    return t >= start && t <= end;
  }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

function getWeekBounds(offset) {
  const now = new Date();
  const day = now.getDay();
  const mondayDelta = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayDelta + offset * 7);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

function getMonthBounds(offset) {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth() + offset, 1, 0, 0, 0, 0);
  const last  = new Date(first.getFullYear(), first.getMonth() + 1, 0, 23, 59, 59, 999);
  return { first, last };
}

// ─── HELPERS ─────────────────────────────────────────────────
function getBabyAgeInDays() {
  const baby = getActiveBaby();
  if (!baby?.birthDate) return null;
  return Math.floor((Date.now() - new Date(baby.birthDate)) / 86400000);
}

// Returns { months, days } using calendar months (not 30-day approximation)
function getBabyAgeCalendar() {
  const baby = getActiveBaby();
  if (!baby?.birthDate) return null;
  const birth = new Date(baby.birthDate);
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

function fmtDMY(date) {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

function setFormNow(prefix) {
  const now = new Date();
  const dateEl = document.getElementById(`${prefix}-date`);
  const timeEl = document.getElementById(`${prefix}-time`);
  if (dateEl) dateEl.value = now.toISOString().slice(0, 10);
  if (timeEl) timeEl.value = now.toTimeString().slice(0, 5);
}

function getFormDateTime(prefix) {
  const dateEl = document.getElementById(`${prefix}-date`);
  const timeEl = document.getElementById(`${prefix}-time`);
  if (!dateEl?.value || !timeEl?.value) return null;
  return new Date(`${dateEl.value}T${timeEl.value}`).toISOString();
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

let warnToastTimer;
function showWarnToast(msg, level = 'warn') {
  const t = document.getElementById('toast-warn');
  if (!t) return;
  clearTimeout(warnToastTimer);
  t.textContent = msg;
  t.className = `toast-warn toast-warn--${level}`;
  warnToastTimer = setTimeout(() => dismissWarnToast(), 4000);
}
function dismissWarnToast() {
  const t = document.getElementById('toast-warn');
  if (!t) return;
  clearTimeout(warnToastTimer);
  t.classList.add('hidden');
}

function showModal(title, msg, onConfirm) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-message').textContent = msg;
  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('modal-confirm-btn').onclick = () => { closeModal(); onConfirm && onConfirm(); };
}
function closeModal() { document.getElementById('modal').classList.add('hidden'); }

// ─── NAVIGATION ──────────────────────────────────────────────
const NAV_COPIL_SCREENS = ['meal','urine','stool','medication','vaccines'];
const NAV_INFO_SCREENS  = ['report','statistics','growth'];

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const screen = document.getElementById(`screen-${name}`);
  if (screen) screen.classList.add('active');

  if (name === 'home') {
    document.querySelector('.nav-btn[data-screen="home"]')?.classList.add('active');
  } else if (NAV_COPIL_SCREENS.includes(name)) {
    document.getElementById('nav-btn-copil')?.classList.add('active');
  } else if (NAV_INFO_SCREENS.includes(name)) {
    document.getElementById('nav-btn-info')?.classList.add('active');
  }

  state.currentScreen = name;

  if (name === 'home')       refreshHome();
  if (name === 'meal')       initMealForm();
  if (name === 'urine')      initUrineForm();
  if (name === 'stool')      initStoolForm();
  if (name === 'medication') initMedicationForm();
  if (name === 'statistics') refreshStatistics();
  if (name === 'growth')     refreshGrowth();
  if (name === 'vaccines')   refreshVaccines();
  if (name === 'report')     refreshReport();
  if (name === 'settings')   loadSettingsForm();
}

// ─── HEADER HELPERS ──────────────────────────────────────────
function updateHeaderAge() {
  const ageEl = document.getElementById('header-baby-age');
  if (!ageEl) return;
  const baby = getActiveBaby();
  if (!baby?.name || !baby?.birthDate) { ageEl.textContent = ''; return; }
  ageEl.textContent = formatBabyAge();
}

function refreshBabySelector() {
  const select = document.getElementById('baby-selector');
  if (!select) return;
  const babies = loadBabies();
  select.innerHTML = babies.map(b => `<option value="${b.id}">${b.name || 'Bebeluș'}</option>`).join('');
  if (state.activeBabyId) select.value = state.activeBabyId;
}

function switchActiveBaby(id) {
  const babies = loadBabies();
  const next = babies.find(b => b.id === id);
  if (!next) return;
  setActiveBabyId(id);
  refreshBabySelector();
  document.getElementById('header-baby-name').textContent = next.name || 'RoBby';
  updateHeaderAge();
  if (state.currentScreen === 'settings') loadSettingsForm();
  if (state.currentScreen === 'report') refreshReport();
  refreshHome();
}

function renderBabyProfilesList() {
  const list = document.getElementById('baby-profiles-list');
  if (!list) return;
  const babies = loadBabies();
  list.innerHTML = babies.map(b => `
    <button class="baby-chip ${b.id === state.activeBabyId ? 'active' : ''}" onclick="selectBabyProfileForEdit('${b.id}')">
      ${b.name || 'Bebeluș'}
    </button>
  `).join('');
}

function selectBabyProfileForEdit(id) {
  const baby = loadBabies().find(b => b.id === id);
  if (!baby) return;
  state.editingBabyId = id;
  document.getElementById('setting-baby-name').value = baby.name || '';
  document.getElementById('setting-birth-date').value = baby.birthDate || '';
  document.getElementById('setting-birth-weight').value = baby.birthWeight || '';
  document.getElementById('setting-blood-type').value = baby.bloodType || '';
  document.getElementById('setting-baby-photo-data').value = baby.photoDataUrl || '';
  selectGender(baby.gender || 'boy');
  const preview = document.getElementById('baby-photo-preview');
  if (baby.photoDataUrl) {
    preview.style.backgroundImage = `url('${baby.photoDataUrl}')`;
    preview.classList.remove('hidden');
  } else {
    preview.classList.add('hidden');
  }
  if (id !== state.activeBabyId) switchActiveBaby(id);
  renderBabyProfilesList();
}

function createNewBabyProfile() {
  const babies = loadBabies();
  const baby = createBabyProfile({ name: `Bebeluș ${babies.length + 1}` });
  babies.push(baby);
  saveBabies(babies);
  switchActiveBaby(baby.id);
  selectBabyProfileForEdit(baby.id);
  showToast('Profil nou creat');
}

function deleteCurrentBabyProfile() {
  const babies = loadBabies();
  if (babies.length <= 1) {
    showToast('Trebuie să rămână cel puțin un profil');
    return;
  }
  const current = getActiveBaby();
  if (!current) return;
  showModal('Șterge profilul', `Sigur vrei să ștergi profilul "${current.name}"?`, () => {
    const remaining = babies.filter(b => b.id !== current.id);
    saveBabies(remaining);
    const entries = loadEntries().filter(e => e.babyId !== current.id);
    saveEntries(entries);
    switchActiveBaby(remaining[0].id);
    selectBabyProfileForEdit(remaining[0].id);
    showToast('Profil șters');
  });
}

function onBabyPhotoSelected(event) {
  const file = event?.target?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const data = String(reader.result || '');
    document.getElementById('setting-baby-photo-data').value = data;
    const preview = document.getElementById('baby-photo-preview');
    preview.style.backgroundImage = `url('${data}')`;
    preview.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
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
  const vitDGiven = hasVitaminDToday(now);

  document.getElementById('today-meals').textContent  = meals.length;
  document.getElementById('today-urines').textContent = urines.length;
  document.getElementById('today-stools').textContent = stools.length;

  const totalMl = meals.filter(m => m.milkType === 'formula').reduce((s, m) => s + (m.ml || 0), 0);
  document.getElementById('today-ml').textContent = totalMl > 0 ? `${totalMl} ml` : '';
  const vitDEl = document.getElementById('vitamin-d-status');
  if (vitDEl) vitDEl.textContent = vitDGiven ? '✅ Vitamina D administrată astăzi' : '⏳ Vitamina D neadministrată azi';

  updateNextFeeding(meals);
  renderTimeline(todayEntries.slice(0, 10));
  refreshVaccineBanner();
}

function refreshVaccineBanner() {
  const banner = document.getElementById('vaccine-alert-banner');
  if (!banner) return;
  const dueSoon = getVaccinesDueSoon(30);
  if (dueSoon.length) {
    banner.textContent = `💉 ${dueSoon.length} vaccin(uri) scadente în următoarele 30 zile`;
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
  }
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
    countdown.innerHTML   = '<button class="add-first-btn" onclick="showScreen(\'meal\');closeNavSubmenu()">Adaugă</button>';
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
      detail = e.formula || settings.formula || 'Formulă';
    }
    if (e.notes) detail += ' · ' + e.notes;
  } else if (e.type === 'urine') {
    typeClass = 'type-urine';
    dot   = '💧';
    title  = `Treabă mică · ${urineColorLabel(e.color)}`;
    detail = e.notes || '';
  } else if (e.type === 'stool') {
    typeClass = 'type-stool';
    dot   = '💩';
    title  = `Treabă mare · ${stoolColorLabel(e.color)}`;
    detail = stoolAspectLabel(e.aspect) + (e.notes ? ' · ' + e.notes : '');
  } else if (e.type === 'temperature') {
    typeClass = 'type-temperature';
    dot = '🌡️';
    title = `Temperatură · ${Number(e.valueC).toFixed(1)}°C`;
    detail = e.notes || '';
    if (e.valueC > 38) typeClass += ' temp-danger';
    else if (e.valueC > 37.5) typeClass += ' temp-warn';
  } else {
    typeClass = 'type-medication';
    dot = '💊';
    const unitLabel = { ml: 'ml', mg: 'mg', drops: 'picături' }[e.unit] || e.unit || '';
    const vit = e.isVitaminD ? ' · Vitamina D' : '';
    title = `${e.name || 'Medicație'} · ${e.dose || '—'} ${unitLabel}${vit}`;
    detail = e.notes || '';
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
    detail = e.milkType === 'formula' ? (e.formula || settings.formula || 'Formulă') : 'Sân';
    if (e.notes) detail += ' · ' + e.notes;
  } else if (e.type === 'urine') {
    emoji  = '💧';
    title  = `Treabă mică · ${urineColorLabel(e.color)}`;
    detail = e.notes || '';
  } else if (e.type === 'stool') {
    emoji  = '💩';
    title  = `Treabă mare · ${stoolColorLabel(e.color)} · ${stoolAspectLabel(e.aspect)}`;
    detail = e.notes || '';
  } else if (e.type === 'temperature') {
    emoji = '🌡️';
    title = `Temperatură · ${Number(e.valueC).toFixed(1)}°C`;
    detail = e.notes || '';
  } else {
    emoji = '💊';
    const unitLabel = { ml: 'ml', mg: 'mg', drops: 'picături' }[e.unit] || e.unit || '';
    title = `${e.name || 'Medicație'} · ${e.dose || '—'} ${unitLabel}${e.isVitaminD ? ' · Vitamina D' : ''}`;
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

function urineColorLabel(c)  {
  return {
    light_yellow: 'Galbenă deschis',
    yellow:       'Galbenă',
    dark_yellow:  'Galbenă închis',
    orange:       'Portocalie',
    pink:         'Roz / Roșiatică',
    colorless:    'Incoloră',
    dark_brown:   'Maro închis',
    // legacy values
    clear:        'Clară',
    dark:         'Închisă',
  }[c] || c;
}
function stoolColorLabel(c)  { return { yellow:'Galben', green:'Verde', brown:'Maro', black:'Negru', red:'Roșu ⚠️', white:'Alb ⚠️' }[c] || c; }
function stoolAspectLabel(a) { return { normal:'Normal', liquid:'Lichid', hard:'Tare', mucus:'Cu mucus' }[a] || a; }

function confirmDelete(id) {
  showModal('Șterge înregistrarea', 'Ștergi această înregistrare?', () => {
    deleteEntry(id);
    showToast('Înregistrare ștearsă');
    if (state.currentScreen === 'home')   refreshHome();
    if (state.currentScreen === 'report') refreshReport();
  });
}

function deleteGrowthRecord(id) {
  showModal('Șterge măsurătoarea', 'Ștergi această măsurătoare?', () => {
    saveGrowthRecords(loadGrowthRecords().filter(r => r.id !== id));
    showToast('Măsurare ștearsă');
    refreshGrowth();
  });
}

// ─── MEAL FORM ───────────────────────────────────────────────
function getFormulaBrandRec(brand) {
  const days = getBabyAgeInDays();
  const guide = FORMULA_BRAND_GUIDE[brand];
  if (!guide) return null;
  return days !== null
    ? guide.find(g => days <= g.maxDays) || guide[guide.length - 1]
    : guide[0];
}

function updateFormulaRecommendation() {
  const el = document.getElementById('meal-formula');
  const suggestedEl = document.getElementById('suggested-amount');
  if (!suggestedEl) return;
  const brand = el?.value?.trim();
  const rec = brand ? getFormulaBrandRec(brand) : null;
  if (rec) {
    suggestedEl.textContent = `✓ Recomandat: ${rec.ml} ml · ${rec.scoops} linguri · ${brand} · ${rec.label}`;
    const mlEl = document.getElementById('meal-ml');
    if (mlEl && mlEl !== document.activeElement) mlEl.value = rec.ml;
  } else {
    const guide = getFeedingGuide();
    const displayBrand = brand || settings.formula || 'NAN Supreme Pro 1';
    suggestedEl.textContent = `✓ Recomandat: ${guide.ml} ml · ${guide.scoops} linguri · ${displayBrand} · ${guide.label}`;
  }
  updateFormulaClearBtn();
}

function onFormulaBrandClick() {
  const el = document.getElementById('meal-formula');
  if (!el) return;
  if (el.value && !el.dataset.savedBrand) {
    el.dataset.savedBrand = el.value;
    el.value = '';
  }
}

function onFormulaBrandBlur() {
  const el = document.getElementById('meal-formula');
  if (!el) return;
  if (!el.value && el.dataset.savedBrand) {
    el.value = el.dataset.savedBrand;
  }
  el.dataset.savedBrand = '';
  updateFormulaRecommendation();
}

function onFormulaBrandInput() {
  const el = document.getElementById('meal-formula');
  if (el) el.dataset.savedBrand = '';
  updateFormulaRecommendation();
}

function clearFormulaBrand() {
  const el = document.getElementById('meal-formula');
  if (!el) return;
  el.dataset.savedBrand = '';
  el.value = '';
  el.focus();
  updateFormulaRecommendation();
}

function updateFormulaClearBtn() {
  const el  = document.getElementById('meal-formula');
  const btn = document.getElementById('formula-clear-btn');
  if (!btn) return;
  btn.style.display = (el?.value || '') ? 'flex' : 'none';
}

// ── Settings formula brand (mirrors Feeding page behaviour) ──
function onStgFormulaBrandClick() {
  const el = document.getElementById('setting-formula');
  if (!el) return;
  if (el.value && !el.dataset.savedBrand) {
    el.dataset.savedBrand = el.value;
    el.value = '';
  }
}

function onStgFormulaBrandBlur() {
  const el = document.getElementById('setting-formula');
  if (!el) return;
  if (!el.value && el.dataset.savedBrand) el.value = el.dataset.savedBrand;
  el.dataset.savedBrand = '';
  _updateStgFormulaClearBtn();
  // Persist and sync to Feeding page
  settings.formula = el.value.trim() || 'NAN Supreme Pro 1';
  saveSettingsToStorage(settings);
  // Pre-fill Feeding page if it's already initialised
  const mealEl = document.getElementById('meal-formula');
  if (mealEl && !mealEl.dataset.savedBrand) mealEl.value = settings.formula;
}

function onStgFormulaBrandInput() {
  const el = document.getElementById('setting-formula');
  if (el) el.dataset.savedBrand = '';
  _updateStgFormulaClearBtn();
}

function clearStgFormulaBrand() {
  const el = document.getElementById('setting-formula');
  if (!el) return;
  el.dataset.savedBrand = '';
  el.value = '';
  el.focus();
  _updateStgFormulaClearBtn();
}

function _updateStgFormulaClearBtn() {
  const el  = document.getElementById('setting-formula');
  const btn = document.getElementById('stg-formula-clear-btn');
  if (!btn) return;
  btn.style.display = (el?.value || '') ? 'flex' : 'none';
}

function initMealForm() {
  setFormNow('meal');
  document.getElementById('meal-notes').value = '';
  selectMilkType('formula');
  const formula = settings.formula || 'NAN Supreme Pro 1';
  const dl = document.getElementById('formula-brands-list');
  if (dl) dl.innerHTML = FORMULA_BRANDS.map(b => `<option value="${b}">`).join('');
  const formulaEl = document.getElementById('meal-formula');
  if (formulaEl) {
    formulaEl.value = formula;
    formulaEl.dataset.savedBrand = '';
  }
  updateFormulaRecommendation();
}

function selectMilkType(type) {
  state.milkType = type;
  document.getElementById('milk-formula').classList.toggle('active', type === 'formula');
  document.getElementById('milk-breast').classList.toggle('active', type === 'breast');
  document.getElementById('ml-group').classList.toggle('hidden', type === 'breast');
  document.getElementById('breast-duration-group').classList.toggle('hidden', type === 'formula');
  document.getElementById('formula-brand-group')?.classList.toggle('hidden', type !== 'formula');
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
  const ts = getFormDateTime('meal');
  if (!ts) { showToast('Selectați data și ora hrănirii'); return; }

  const entry = { type: 'meal', timestamp: ts, milkType: state.milkType };

  if (state.milkType === 'formula') {
    const ml = parseInt(document.getElementById('meal-ml').value);
    if (!ml || ml < 0) { showToast('Introduceți cantitatea în ml'); return; }
    entry.ml = ml;
    const formulaBrand = document.getElementById('meal-formula')?.value?.trim();
    if (formulaBrand) entry.formula = formulaBrand;
  } else {
    entry.duration = parseInt(document.getElementById('meal-duration').value) || 15;
  }

  const notes = document.getElementById('meal-notes').value.trim();
  if (notes) entry.notes = notes;

  addEntry(entry);
  showToast('✓ Hrănire salvată!');
  showScreen('home');
}

// ─── PIPI FORM ───────────────────────────────────────────────
const URINE_COLOR_SHORT = {
  light_yellow: '💛 Galbenă deschis',
  yellow:       '🟡 Galbenă',
  dark_yellow:  '🟠 Galbenă închis',
  orange:       '🟠 Portocalie',
  pink:         '🔴 Roz / Roșiatică',
  colorless:    '⚪ Incoloră',
  dark_brown:   '🟫 Maro închis',
};
const URINE_COLOR_FULL = {
  light_yellow: '💛 Galbenă deschis',
  yellow:       '🟡 Galbenă',
  dark_yellow:  '🟠 Galbenă închis',
  orange:       '🟠 Portocalie',
  pink:         '🔴 Roz / Roșiatică',
  colorless:    '⚪ Incoloră',
  dark_brown:   '🟫 Maro închis',
};

function restoreUrineColorOptions() {
  const sel = document.getElementById('urine-color-select');
  if (!sel) return;
  sel.querySelectorAll('option').forEach(opt => {
    opt.textContent = URINE_COLOR_FULL[opt.value] || opt.textContent;
  });
}

function _collapseUrineColorOption(val) {
  const sel = document.getElementById('urine-color-select');
  if (!sel) return;
  const opt = sel.querySelector(`option[value="${val}"]`);
  if (opt) opt.textContent = URINE_COLOR_SHORT[val] || opt.textContent;
}

function initUrineForm() {
  setFormNow('urine');
  document.getElementById('urine-notes').value = '';
  state.urineColor = 'light_yellow';
  const sel = document.getElementById('urine-color-select');
  if (sel) sel.value = 'light_yellow';
  _collapseUrineColorOption('light_yellow');
}

function onUrineColorChange(val) {
  state.urineColor = val;
  _collapseUrineColorOption(val);
  const WARN_COLORS = {
    dark_yellow: { level: 'warn',   msg: 'Galbenă închis — posibil deshidratare. Consultați medicul dacă această culoare persistă.' },
    orange:      { level: 'warn',   msg: 'Portocalie — consultați medicul dacă această culoare persistă.' },
    pink:        { level: 'urgent', msg: 'Roz / Roșiatică — consultați medicul urgent.' },
    dark_brown:  { level: 'urgent', msg: 'Maro închis — consultați medicul urgent.' },
  };
  const w = WARN_COLORS[val];
  if (w) showWarnToast(w.msg, w.level);
  else   dismissWarnToast();
}

function saveUrine() {
  const ts = getFormDateTime('urine');
  if (!ts) { showToast('Selectați data și ora'); return; }
  const sel   = document.getElementById('urine-color-select');
  const color = sel ? sel.value : state.urineColor;
  const notes = document.getElementById('urine-notes').value.trim();
  addEntry({ type: 'urine', timestamp: ts, color, ...(notes && { notes }) });
  dismissWarnToast();
  showToast('✓ Treabă mică salvată!');
  showScreen('home');
}

// ─── CACA FORM ───────────────────────────────────────────────
function initStoolForm() {
  setFormNow('stool');
  document.getElementById('stool-notes').value = '';
  state.stoolColor  = 'yellow';
  state.stoolAspect = 'normal';
  const colorSel = document.getElementById('stool-color-select');
  if (colorSel) colorSel.value = 'yellow';
  ['normal','liquid','hard','mucus'].forEach(a =>
    document.getElementById(`stool-${a}`)?.classList.toggle('active', a === 'normal')
  );
}

function selectStoolAspect(btn, val) {
  state.stoolAspect = val;
  document.querySelectorAll('#screen-stool .toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function saveStool() {
  const ts = getFormDateTime('stool');
  if (!ts) { showToast('Selectați data și ora'); return; }
  const colorSel = document.getElementById('stool-color-select');
  const color = colorSel ? colorSel.value : state.stoolColor;
  const notes = document.getElementById('stool-notes').value.trim();
  addEntry({ type: 'stool', timestamp: ts, color, aspect: state.stoolAspect, ...(notes && { notes }) });
  if (['red','white','black'].includes(color)) {
    showToast('⚠️ Culoare neobișnuită! Consultați medicul.', 4000);
  } else {
    showToast('✓ Treabă mare salvată!');
  }
  showScreen('home');
}

function initTemperatureForm() {
  document.getElementById('temp-time').value = toLocalDatetimeInput(new Date());
  document.getElementById('temp-value').value = '';
  document.getElementById('temp-notes').value = '';
}

function saveTemperature() {
  const timeVal = document.getElementById('temp-time').value;
  const value = parseFloat(document.getElementById('temp-value').value);
  if (!timeVal) { showToast('Selectați ora'); return; }
  if (!Number.isFinite(value)) { showToast('Introduceți temperatura'); return; }
  const notes = document.getElementById('temp-notes').value.trim();
  addEntry({
    type: 'temperature',
    timestamp: new Date(timeVal).toISOString(),
    valueC: Number(value.toFixed(1)),
    ...(notes && { notes }),
  });
  showToast('✓ Temperatură salvată!');
  showScreen('home');
}

function initMedicationForm() {
  document.getElementById('med-time').value = toLocalDatetimeInput(new Date());
  document.getElementById('med-name').value = '';
  document.getElementById('med-dose').value = '';
  document.getElementById('med-unit').value = 'drops';
  document.getElementById('med-vitamin-d').checked = false;
  document.getElementById('med-notes').value = '';
}

function setMedicationName(name) {
  document.getElementById('med-name').value = name;
  if (name.toLowerCase().includes('vitamin')) {
    document.getElementById('med-vitamin-d').checked = true;
    document.getElementById('med-unit').value = 'drops';
  }
}

function saveMedication() {
  const timeVal = document.getElementById('med-time').value;
  const name = document.getElementById('med-name').value.trim();
  const dose = parseFloat(document.getElementById('med-dose').value);
  const unit = document.getElementById('med-unit').value;
  const isVitaminD = document.getElementById('med-vitamin-d').checked || name.toLowerCase().includes('vitamin d');
  if (!timeVal) { showToast('Selectați ora'); return; }
  if (!name) { showToast('Introduceți numele medicației'); return; }
  if (!Number.isFinite(dose)) { showToast('Introduceți doza'); return; }
  const notes = document.getElementById('med-notes').value.trim();
  addEntry({
    type: 'medication',
    timestamp: new Date(timeVal).toISOString(),
    name,
    dose,
    unit,
    isVitaminD,
    ...(notes && { notes }),
  });
  showToast('✓ Medicație salvată!');
  showScreen('home');
}

function logQuickVitaminD() {
  addEntry({
    type: 'medication',
    timestamp: new Date().toISOString(),
    name: 'Vitamin D',
    dose: 2,
    unit: 'drops',
    isVitaminD: true,
  });
  showToast('✓ Vitamina D marcată pentru azi');
  showScreen('home');
}

function hasVitaminDToday(date = new Date()) {
  return getEntriesForDate(date).some(e => e.type === 'medication' && (e.isVitaminD || String(e.name || '').toLowerCase().includes('vitamin d')));
}

function showNotificationFallback(msg) {
  const el = document.getElementById('notification-fallback-banner');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
}

function hideNotificationFallback() {
  const el = document.getElementById('notification-fallback-banner');
  if (!el) return;
  el.classList.add('hidden');
}

function showFeedingAlertBanner(msg) {
  const el = document.getElementById('feeding-alert-banner');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
}

function hideFeedingAlertBanner() {
  const el = document.getElementById('feeding-alert-banner');
  if (!el) return;
  el.classList.add('hidden');
}

function formatShortDay(date) {
  return new Date(date).toLocaleDateString('ro-RO', { weekday: 'short' }).replace('.', '');
}

function getLastNDates(n) {
  const arr = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(12, 0, 0, 0);
    d.setDate(now.getDate() - i);
    arr.push(d);
  }
  return arr;
}

function getDiaperStatsLast7Days() {
  return getLastNDates(7).map(date => {
    const entries = getEntriesForDate(date);
    const wet = entries.filter(e => e.type === 'urine').length;
    const dirty = entries.filter(e => e.type === 'stool').length;
    const both = Math.min(wet, dirty);
    return { day: formatShortDay(date), wet, dirty, both, total: wet + dirty + both };
  });
}

function getFeedingIntervalsLast7Days() {
  return getLastNDates(7).map(date => {
    const meals = getEntriesForDate(date)
      .filter(e => e.type === 'meal')
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    if (meals.length < 2) return { day: formatShortDay(date), avgMin: 0 };
    let total = 0;
    for (let i = 1; i < meals.length; i++) {
      total += (new Date(meals[i].timestamp) - new Date(meals[i - 1].timestamp)) / 60000;
    }
    return { day: formatShortDay(date), avgMin: Math.round(total / (meals.length - 1)) };
  });
}

function getSleepHoursLast7Days() {
  return getLastNDates(7).map(date => {
    const sleeps = getEntriesForDate(date).filter(e => e.type === 'sleep');
    let day = 0;
    let night = 0;
    sleeps.forEach(s => {
      const h = Number(s.durationHours || 0);
      if ((s.period || '').toLowerCase() === 'night') night += h;
      else day += h;
    });
    return { dayLabel: formatShortDay(date), day: Number(day.toFixed(1)), night: Number(night.toFixed(1)), total: day + night };
  });
}

function renderStackedBarChart(data, keys, colors, dayKey = 'day') {
  const max = Math.max(1, ...data.map(d => keys.reduce((s, k) => s + (Number(d[k]) || 0), 0)));
  return `<div class="stacked-bars">
    ${data.map(d => {
      const segments = keys.map((k, i) => {
        const val = Number(d[k]) || 0;
        const pct = (val / max) * 100;
        return `<div class="${colors[i]}" style="height:${pct}%"></div>`;
      }).join('');
      return `<div class="bar-col">
        <div class="bar-stack">${segments}</div>
        <div class="day-label">${d[dayKey]}</div>
      </div>`;
    }).join('')}
  </div>`;
}

function renderLineChart(data) {
  const width = 320;
  const height = 140;
  const pad = 16;
  const vals = data.map(d => Number(d.avgMin) || 0);
  const max = Math.max(60, ...vals);
  const min = 0;
  const stepX = (width - pad * 2) / Math.max(1, data.length - 1);
  const points = data.map((d, i) => {
    const x = pad + i * stepX;
    const y = height - pad - (((Number(d.avgMin) || 0) - min) / Math.max(1, max - min)) * (height - pad * 2);
    return `${x},${y}`;
  }).join(' ');
  return `
    <svg viewBox="0 0 ${width} ${height}" class="line-chart-svg" preserveAspectRatio="none">
      <polyline fill="none" stroke="var(--primary-soft)" stroke-width="1" points="${pad},${height-pad} ${width-pad},${height-pad}" />
      <polyline fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
      ${data.map((d, i) => {
        const x = pad + i * stepX;
        const y = height - pad - (((Number(d.avgMin) || 0) - min) / Math.max(1, max - min)) * (height - pad * 2);
        return `<circle cx="${x}" cy="${y}" r="3" fill="var(--primary-dark)" />`;
      }).join('')}
    </svg>
  `;
}

function getMonthlyMlData(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  return Array.from({length: daysInMonth}, (_, i) => {
    const date = new Date(year, month, i + 1);
    if (date > today) return { day: i + 1, value: 0 };
    const meals = getEntriesForDate(date).filter(e => e.type === 'meal' && e.milkType === 'formula');
    return { day: i + 1, value: meals.reduce((s, m) => s + (m.ml || 0), 0) };
  });
}

function getMonthlyUrineData(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  return Array.from({length: daysInMonth}, (_, i) => {
    const date = new Date(year, month, i + 1);
    if (date > today) return { day: i + 1, value: 0 };
    return { day: i + 1, value: getEntriesForDate(date).filter(e => e.type === 'urine').length };
  });
}

function getMonthlyStoolData(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  return Array.from({length: daysInMonth}, (_, i) => {
    const date = new Date(year, month, i + 1);
    if (date > today) return { day: i + 1, value: 0 };
    return { day: i + 1, value: getEntriesForDate(date).filter(e => e.type === 'stool').length };
  });
}

function changeStatsMonth(delta) {
  const now = new Date();
  const newOffset = state.statsMonthOffset + delta;
  const targetDate = new Date(now.getFullYear(), now.getMonth() + newOffset, 1);
  if (targetDate > now) return;
  state.statsMonthOffset = newOffset;
  refreshStatistics();
}

function renderMonthlyBarChart(data, isCurrentMonth) {
  const max = Math.max(1, ...data.map(d => d.value || 0));
  const nowDay = isCurrentMonth ? new Date().getDate() : -1;
  return `<div class="monthly-bar-chart">
    ${data.map(d => {
      const pct = Math.round(((d.value || 0) / max) * 100);
      return `<div class="monthly-bar-col${d.day === nowDay ? ' today' : ''}">
        <div class="monthly-bar-val">${d.value > 0 ? d.value : ''}</div>
        <div class="monthly-bar" style="height:${pct}%"></div>
        <div class="monthly-bar-day">${d.day}</div>
      </div>`;
    }).join('')}
  </div>`;
}

function buildStatisticsMarkup() {
  const now = new Date();
  const targetDate = new Date(now.getFullYear(), now.getMonth() + state.statsMonthOffset, 1);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const monthLabel = targetDate.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === month;

  const mlData    = getMonthlyMlData(year, month);
  const urineData = getMonthlyUrineData(year, month);
  const stoolData = getMonthlyStoolData(year, month);

  return `
    <div class="stats-month-nav">
      <button class="date-nav-btn" onclick="changeStatsMonth(-1)">◀</button>
      <span class="stats-month-label">${monthLabel}</span>
      <button class="date-nav-btn" onclick="changeStatsMonth(1)"${isCurrentMonth ? ' disabled style="opacity:0.3"' : ''}>▶</button>
    </div>
    <div class="chart-card">
      <div class="chart-title">🍼 Ml formulă / zi</div>
      ${renderMonthlyBarChart(mlData, isCurrentMonth)}
    </div>
    <div class="chart-card">
      <div class="chart-title">💧 Treabă mică / zi</div>
      ${renderMonthlyBarChart(urineData, isCurrentMonth)}
    </div>
    <div class="chart-card">
      <div class="chart-title">💩 Scaune / zi</div>
      ${renderMonthlyBarChart(stoolData, isCurrentMonth)}
    </div>
  `;
}

function refreshStatistics() {
  const container = document.getElementById('statistics-content');
  if (!container) return;
  container.innerHTML = buildStatisticsMarkup();
}

function setPdfProgress(message) {
  const el = document.getElementById('pdf-progress');
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden');
}

function hidePdfProgress() {
  const el = document.getElementById('pdf-progress');
  if (!el) return;
  el.classList.add('hidden');
}

function getGrowthRecordsForActiveBaby() {
  const activeId = state.activeBabyId || getActiveBabyId();
  return loadGrowthRecords()
    .filter(r => r.babyId === activeId)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function ageMonthsForRecord(recordDate) {
  const baby = getActiveBaby();
  if (!baby?.birthDate) return null;
  const birth = new Date(baby.birthDate);
  const d = new Date(recordDate);
  if (d < birth) return 0;
  const days = Math.floor((d - birth) / 86400000);
  return Math.max(0, Math.min(12, Math.round(days / 30.4375)));
}

function percentileBandForValue(metricKey, month, value) {
  if (!Number.isFinite(value)) return 'N/A';
  const dataset = WHO_GROWTH[metricKey];
  const bands = [
    { label: 'sub P3', max: dataset.p3[month] },
    { label: 'P3-P15', max: dataset.p15[month] },
    { label: 'P15-P50', max: dataset.p50[month] },
    { label: 'P50-P85', max: dataset.p85[month] },
    { label: 'P85-P97', max: dataset.p97[month] },
    { label: 'peste P97', max: Infinity },
  ];
  return bands.find(b => value <= b.max)?.label || 'N/A';
}

function initGrowthForm() {
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById('growth-date').value = today;
  document.getElementById('growth-weight').value = '';
  document.getElementById('growth-height').value = '';
  document.getElementById('growth-head').value = '';
  const details = document.getElementById('growth-extra-details');
  if (details) details.removeAttribute('open');
}

function saveGrowthRecord() {
  const date = document.getElementById('growth-date').value;
  const weightKg = parseFloat(document.getElementById('growth-weight').value);
  if (!date) { showToast('Selectați data'); return; }
  if (!Number.isFinite(weightKg)) { showToast('Introduceți greutatea'); return; }

  const heightVal = parseFloat(document.getElementById('growth-height').value);
  const headVal   = parseFloat(document.getElementById('growth-head').value);

  const record = {
    id: 'g_' + Date.now().toString(36),
    babyId: state.activeBabyId || getActiveBabyId(),
    date,
    weightKg: Number(weightKg.toFixed(2)),
  };
  if (Number.isFinite(heightVal)) record.heightCm = Number(heightVal.toFixed(1));
  if (Number.isFinite(headVal))   record.headCm   = Number(headVal.toFixed(1));

  const records = loadGrowthRecords();
  records.push(record);
  saveGrowthRecords(records);
  showToast('✓ Măsurare salvată');
  refreshGrowth();
}

function growthChartNav(metricKey, dir) {
  growthChartWindows[metricKey] = dir > 0 ? 6 : 0;
  refreshGrowth();
}

function renderGrowthChart(metricKey, label, unit, valueAccessor) {
  const records = getGrowthRecordsForActiveBaby();
  const startM = growthChartWindows[metricKey] || 0;
  const endM = startM + 6;

  const width = 340, height = 210;
  const padL = 28, padR = 10, padT = 22, padB = 26;
  const chartW = width - padL - padR, chartH = height - padT - padB;

  const curves = WHO_GROWTH[metricKey];
  const visMonths = [...Array(13).keys()].filter(m => m >= startM && m <= endM);

  const visWhoVals = visMonths.flatMap(m => [curves.p3[m], curves.p97[m]]);
  const allVals = [...visWhoVals, ...records.map(valueAccessor).filter(v => Number.isFinite(v))];
  const minV = Math.min(...allVals) - 0.3;
  const maxV = Math.max(...allVals) + 0.3;

  const xForMonth = m => padL + ((m - startM) / 6) * chartW;
  const yForVal = v => padT + chartH - ((v - minV) / Math.max(0.01, maxV - minV)) * chartH;
  const curvePath = key => visMonths.map((m, i) => `${i ? 'L' : 'M'} ${xForMonth(m)} ${yForVal(curves[key][m])}`).join(' ');

  // Deduplicate: keep most recent record per month, only in visible window
  const latestByMonth = new Map();
  records.forEach(r => {
    const month = ageMonthsForRecord(r.date);
    const value = valueAccessor(r);
    if (month === null || !Number.isFinite(value)) return;
    if (month < startM || month > endM) return;
    const ex = latestByMonth.get(month);
    if (!ex || new Date(r.date) > new Date(ex.date)) latestByMonth.set(month, { month, value, date: r.date });
  });
  const dedupedPts = [...latestByMonth.values()].sort((a, b) => a.month - b.month);

  // Baby line
  let babyLine = '';
  if (dedupedPts.length > 1) {
    const d = dedupedPts.map((p, i) => `${i ? 'L' : 'M'} ${xForMonth(p.month)} ${yForVal(p.value)}`).join(' ');
    babyLine = `<path d="${d}" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linejoin="round" />`;
  }

  // Data point circles + labels (alternate label above/below to avoid overlap)
  const circles = dedupedPts.map((p, i) => {
    const cx = xForMonth(p.month), cy = yForVal(p.value);
    const above = (i % 2 === 0);
    const ly = above ? Math.max(padT + 10, cy - 7) : Math.min(padT + chartH - 4, cy + 15);
    const txt = unit === 'kg' ? p.value.toFixed(2) : p.value.toFixed(1);
    return `<circle cx="${cx}" cy="${cy}" r="3.5" fill="var(--primary)" />
<text x="${cx}" y="${ly}" font-size="9" font-weight="700" fill="var(--text)" text-anchor="middle">${txt}</text>`;
  }).join('');

  // X axis labels (every month in window)
  const xLabels = visMonths.map(m =>
    `<text x="${xForMonth(m)}" y="${height - 4}" font-size="9" fill="#999" text-anchor="middle">${m}L</text>`
  ).join('');

  // Navigation: show arrows only when data exists beyond the current window
  const maxDataMonth = records.reduce((mx, r) => Math.max(mx, ageMonthsForRecord(r.date) || 0), 0);
  const canPrev = startM > 0;
  const canNext = maxDataMonth > 6 && endM < 12;

  const prevBtn = canPrev
    ? `<button class="growth-nav-btn" onclick="growthChartNav('${metricKey}', -1)">&#8249;</button>`
    : `<span class="growth-nav-placeholder"></span>`;
  const nextBtn = canNext
    ? `<button class="growth-nav-btn" onclick="growthChartNav('${metricKey}', 1)">&#8250;</button>`
    : `<span class="growth-nav-placeholder"></span>`;

  return `
    <div class="chart-card">
      <div class="chart-title">${label}</div>
      <div class="growth-chart-nav">
        ${prevBtn}
        <svg viewBox="0 0 ${width} ${height}" class="growth-svg" preserveAspectRatio="none">
          <path d="${curvePath('p3')}"  fill="none" stroke="#f2b6b6" stroke-width="1.2" />
          <path d="${curvePath('p15')}" fill="none" stroke="#f6d3a6" stroke-width="1.2" />
          <path d="${curvePath('p50')}" fill="none" stroke="#9ec5ff" stroke-width="1.7" />
          <path d="${curvePath('p85')}" fill="none" stroke="#a8d7b0" stroke-width="1.2" />
          <path d="${curvePath('p97')}" fill="none" stroke="#9fd0d8" stroke-width="1.2" />
          ${babyLine}
          ${circles}
          ${xLabels}
        </svg>
        ${nextBtn}
      </div>
      <div class="chart-note">Curbe WHO: P3 / P15 / P50 / P85 / P97 · ${unit}</div>
    </div>
  `;
}

function refreshGrowthInsight() {
  const records = getGrowthRecordsForActiveBaby();
  const insight = document.getElementById('growth-insight');
  if (!insight) return;
  if (!records.length) {
    insight.textContent = 'Adaugă prima măsurare pentru a vedea poziționarea pe percentile.';
    return;
  }
  const last = records[records.length - 1];
  const month = ageMonthsForRecord(last.date) || 0;
  const parts = [`Greutate ${percentileBandForValue('weightKg', month, Number(last.weightKg))}`];
  if (Number.isFinite(Number(last.heightCm)))
    parts.push(`Înălțime ${percentileBandForValue('heightCm', month, Number(last.heightCm))}`);
  if (Number.isFinite(Number(last.headCm)))
    parts.push(`Perimetru cranian ${percentileBandForValue('headCm', month, Number(last.headCm))}`);
  insight.textContent = `Ultima măsurare (${fmtDMY(last.date)}): ${parts.join(', ')}.`;
}

function refreshGrowth() {
  initGrowthForm();
  const container = document.getElementById('growth-charts');
  if (!container) return;
  const records = getGrowthRecordsForActiveBaby();
  const hasHeight = records.some(r => Number.isFinite(Number(r.heightCm)));
  const hasHead   = records.some(r => Number.isFinite(Number(r.headCm)));
  container.innerHTML = `
    ${renderGrowthChart('weightKg', 'Greutate în timp', 'kg', r => Number(r.weightKg))}
    ${hasHeight ? renderGrowthChart('heightCm', 'Înălțime în timp', 'cm', r => Number(r.heightCm)) : ''}
    ${hasHead   ? renderGrowthChart('headCm', 'Perimetru cranian în timp', 'cm', r => Number(r.headCm)) : ''}
    <div class="growth-list">
      ${records.slice().reverse().map(r => {
        const parts = [fmtDMY(r.date), `${r.weightKg} kg`];
        if (r.heightCm != null) parts.push(`${r.heightCm} cm`);
        if (r.headCm   != null) parts.push(`PC ${r.headCm} cm`);
        return `<div class="growth-row">
          <span class="growth-row-text">${parts.join(' · ')}</span>
          <button class="tl-delete" onclick="deleteGrowthRecord('${r.id}')" title="Șterge">🗑</button>
        </div>`;
      }).join('')}
    </div>
  `;
  refreshGrowthInsight();
}

function getVaccineDueDate(vaccine, baby) {
  if (!baby?.birthDate) return null;
  const d = new Date(baby.birthDate);
  d.setDate(d.getDate() + Number(vaccine.dueDays || 0));
  return d;
}

function getVaccineRecordsForActiveBaby() {
  const activeId = state.activeBabyId || getActiveBabyId();
  return loadVaccineRecords().filter(r => r.babyId === activeId);
}

function getVaccineRecordByScheduleId(scheduleId) {
  return getVaccineRecordsForActiveBaby().find(r => r.scheduleId === scheduleId);
}

function getVaccinesDueSoon(daysAhead = 30) {
  const baby = getActiveBaby();
  if (!baby?.birthDate) return [];
  const now = new Date();
  const limit = new Date();
  limit.setDate(limit.getDate() + daysAhead);
  return VACCINE_SCHEDULE_RO.filter(v => {
    const due = getVaccineDueDate(v, baby);
    if (!due) return false;
    const done = !!getVaccineRecordByScheduleId(v.id);
    return !done && due >= now && due <= limit;
  });
}

function openVaccineMarkDone(scheduleId) {
  const vaccine = VACCINE_SCHEDULE_RO.find(v => v.id === scheduleId);
  if (!vaccine) return;
  const dateAdministered = prompt(`Data administrării pentru ${vaccine.name} (YYYY-MM-DD):`, new Date().toISOString().slice(0, 10));
  if (!dateAdministered) return;
  const lotNumber = prompt('Lot (opțional):', '') || '';
  const notes = prompt('Observații (opțional):', '') || '';
  const records = loadVaccineRecords();
  const activeId = state.activeBabyId || getActiveBabyId();
  const existingIdx = records.findIndex(r => r.babyId === activeId && r.scheduleId === scheduleId);
  const payload = {
    id: existingIdx >= 0 ? records[existingIdx].id : ('v_' + Date.now().toString(36)),
    babyId: activeId,
    scheduleId,
    dateAdministered,
    lotNumber,
    notes,
    updatedAt: new Date().toISOString(),
  };
  if (existingIdx >= 0) records[existingIdx] = payload;
  else records.push(payload);
  saveVaccineRecords(records);
  showToast('✓ Vaccin marcat ca efectuat');
  refreshVaccines();
  evaluateNotifications();
}

function clearVaccineDone(scheduleId) {
  showModal('Anulează vaccinul', 'Ștergi înregistrarea acestui vaccin?', () => {
    const activeId = state.activeBabyId || getActiveBabyId();
    saveVaccineRecords(loadVaccineRecords().filter(r => !(r.babyId === activeId && r.scheduleId === scheduleId)));
    showToast('Înregistrare vaccin ștearsă');
    refreshVaccines();
  });
}

function refreshVaccines() {
  const list = document.getElementById('vaccines-list');
  const dueBanner = document.getElementById('vaccines-due-banner');
  if (!list || !dueBanner) return;
  const baby = getActiveBaby();
  if (!baby?.birthDate) {
    list.innerHTML = '<p class="empty-state">Setează data nașterii bebelușului în Setări pentru a calcula schema de vaccinare.</p>';
    dueBanner.classList.add('hidden');
    return;
  }
  const dueSoon = getVaccinesDueSoon(30);
  if (dueSoon.length) {
    dueBanner.textContent = `⚠️ ${dueSoon.length} vaccin(uri) scadente în următoarele 30 zile.`;
    dueBanner.classList.remove('hidden');
  } else {
    dueBanner.classList.add('hidden');
  }

  list.innerHTML = VACCINE_SCHEDULE_RO.map(v => {
    const due = getVaccineDueDate(v, baby);
    const rec = getVaccineRecordByScheduleId(v.id);
    const isDone = !!rec;
    const statusCls = isDone ? 'done' : 'upcoming';
    const statusText = isDone ? 'Efectuat' : 'În așteptare';
    return `
      <div class="vaccine-card">
        <div class="vaccine-top">
          <div>
            <div class="vaccine-name">${v.name}</div>
            <div class="vaccine-age">Recomandat: ${v.ageLabel} (${due ? due.toLocaleDateString('ro-RO') : '—'})</div>
          </div>
          <span class="vaccine-badge ${statusCls}">${statusText}</span>
        </div>
        ${isDone ? `<div class="vaccine-meta">Administrat: ${rec.dateAdministered}${rec.lotNumber ? ` · lot ${rec.lotNumber}` : ''}${rec.notes ? ` · ${rec.notes}` : ''}</div>` : ''}
        <div class="vaccine-actions">
          ${isDone
            ? `<button class="btn-secondary" onclick="clearVaccineDone('${v.id}')">Marchează ca neefectuat</button>`
            : `<button class="btn-primary" onclick="openVaccineMarkDone('${v.id}')">Marchează ca efectuat</button>`
          }
        </div>
      </div>
    `;
  }).join('');
}

// ─── REPORT ──────────────────────────────────────────────────
function refreshReport() {
  if (state.reportPeriod === 'saptamana') { refreshReportWeek(); return; }
  if (state.reportPeriod === 'luna')      { refreshReportMonth(); return; }
  refreshReportDay();
}

function setReportPeriod(period) {
  state.reportPeriod = period;
  document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`period-btn-${period}`)?.classList.add('active');
  document.getElementById('report-nav-zi').classList.toggle('hidden', period !== 'zi');
  document.getElementById('report-nav-saptamana').classList.toggle('hidden', period !== 'saptamana');
  document.getElementById('report-nav-luna').classList.toggle('hidden', period !== 'luna');
  refreshReport();
}

function refreshReportDay() {
  const entries = getEntriesForDate(state.reportDate);
  const meals   = entries.filter(e => e.type === 'meal');
  const urines  = entries.filter(e => e.type === 'urine');
  const stools  = entries.filter(e => e.type === 'stool');
  const meds    = entries.filter(e => e.type === 'medication');
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
      <div class="stat-sub">${totalMl > 0 ? totalMl + ' ml' : ''}${breast > 0 ? (totalMl > 0 ? ' + ' : '') + breast + ' alăpt.' : ''}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">💧 Treabă mică</div>
      <div class="stat-value">${urines.length}</div>
      <div class="stat-sub">${urines.map(u => urineColorLabel(u.color)).slice(0,2).join(', ') || '—'}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">💩 Treabă mare</div>
      <div class="stat-value">${stools.length}</div>
      <div class="stat-sub">${stools.map(s => stoolColorLabel(s.color)).slice(0,2).join(', ') || '—'}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">💊 Medicație</div>
      <div class="stat-value">${meds.length}</div>
      <div class="stat-sub">${meds.length ? (meds[0].name || '') : 'niciuna'}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">⏱️ Interval mediu</div>
      <div class="stat-value">${avgInterval(meals)}</div>
      <div class="stat-sub">între hrăniri</div>
    </div>`;

  const baby = getActiveBaby();
  const babyInfo = baby?.name
    ? `${baby.name}${days !== null ? ` · ${Math.floor(days/7)} săpt. ${days%7} zile` : ''}`
    : 'Bebeluș';

  const sections = [
    { id: 'acc-meals',  label: '🍼 Hrăniri',      items: meals  },
    { id: 'acc-urines', label: '💧 Treabă mică',  items: urines },
    { id: 'acc-stools', label: '💩 Treabă mare',  items: stools },
    { id: 'acc-meds',   label: '💊 Medicație',    items: meds   },
  ];

  document.getElementById('report-entries').innerHTML =
    sections.map(sec => `
      <div class="acc-section">
        <button class="acc-header" onclick="toggleAccordion('${sec.id}')">
          <span class="acc-title">${sec.label}</span>
          <span class="acc-count">${sec.items.length}</span>
          <span class="acc-chevron" id="chevron-${sec.id}">▼</span>
        </button>
        <div class="acc-body hidden" id="${sec.id}">
          <div class="entries-list">
            ${sec.items.length === 0
              ? '<p class="empty-state" style="padding:10px 0">Nicio înregistrare</p>'
              : sec.items.sort((a,b) => new Date(b.timestamp)-new Date(a.timestamp)).map(e => entryHTMLFlat(e)).join('')}
          </div>
        </div>
      </div>`).join('')
    + `<p style="text-align:center;font-size:12px;color:var(--text-muted);margin-top:12px">${babyInfo} · ${dateStr}</p>`;
}

function refreshReportWeek() {
  const { monday, sunday } = getWeekBounds(state.reportWeekOffset);
  const entries = getEntriesForRange(monday, sunday);
  const meals   = entries.filter(e => e.type === 'meal');
  const urines  = entries.filter(e => e.type === 'urine');
  const stools  = entries.filter(e => e.type === 'stool');
  const meds    = entries.filter(e => e.type === 'medication');
  const totalMl = meals.filter(m => m.milkType === 'formula').reduce((s, m) => s + (m.ml || 0), 0);
  const breast  = meals.filter(m => m.milkType === 'breast').length;

  const fmt = { day: 'numeric', month: 'short' };
  document.getElementById('report-week-display').textContent =
    `${monday.toLocaleDateString('ro-RO', fmt)} – ${sunday.toLocaleDateString('ro-RO', fmt)}`;
  const nextBtn = document.getElementById('report-week-next-btn');
  nextBtn.disabled = state.reportWeekOffset >= 0;
  nextBtn.style.opacity = state.reportWeekOffset >= 0 ? '0.3' : '1';

  document.getElementById('report-stats').innerHTML = `
    <div class="stat-card">
      <div class="stat-label">🍼 Hrăniri</div>
      <div class="stat-value">${meals.length}</div>
      <div class="stat-sub">${totalMl > 0 ? totalMl + ' ml' : ''}${breast > 0 ? (totalMl > 0 ? ' + ' : '') + breast + ' alăpt.' : ''}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">💧 Treabă mică</div>
      <div class="stat-value">${urines.length}</div>
      <div class="stat-sub">total săptămână</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">💩 Treabă mare</div>
      <div class="stat-value">${stools.length}</div>
      <div class="stat-sub">total săptămână</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">💊 Medicație</div>
      <div class="stat-value">${meds.length}</div>
      <div class="stat-sub">total săptămână</div>
    </div>`;

  document.getElementById('report-entries').innerHTML = buildDayGroupedHTML(entries);
}

function refreshReportMonth() {
  const { first, last } = getMonthBounds(state.reportMonthOffset);
  const entries = getEntriesForRange(first, last);
  const meals   = entries.filter(e => e.type === 'meal');
  const urines  = entries.filter(e => e.type === 'urine');
  const stools  = entries.filter(e => e.type === 'stool');
  const meds    = entries.filter(e => e.type === 'medication');
  const totalMl = meals.filter(m => m.milkType === 'formula').reduce((s, m) => s + (m.ml || 0), 0);
  const breast  = meals.filter(m => m.milkType === 'breast').length;
  const dayCount = new Set(entries.map(e => new Date(e.timestamp).toDateString())).size;
  const avgMlPerDay = dayCount > 0 ? Math.round(totalMl / dayCount) : 0;

  const monthStr = first.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });
  document.getElementById('report-month-display').textContent =
    monthStr.charAt(0).toUpperCase() + monthStr.slice(1);
  const nextBtn = document.getElementById('report-month-next-btn');
  nextBtn.disabled = state.reportMonthOffset >= 0;
  nextBtn.style.opacity = state.reportMonthOffset >= 0 ? '0.3' : '1';

  document.getElementById('report-stats').innerHTML = `
    <div class="stat-card">
      <div class="stat-label">🍼 Hrăniri</div>
      <div class="stat-value">${meals.length}</div>
      <div class="stat-sub">${totalMl > 0 ? totalMl + ' ml' : ''}${breast > 0 ? (totalMl > 0 ? ' + ' : '') + breast + ' alăpt.' : ''}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">📊 Medie ml/zi</div>
      <div class="stat-value">${avgMlPerDay > 0 ? avgMlPerDay : '—'}</div>
      <div class="stat-sub">ml formulă</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">💧 Treabă mică</div>
      <div class="stat-value">${urines.length}</div>
      <div class="stat-sub">total lună</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">💩 Treabă mare</div>
      <div class="stat-value">${stools.length}</div>
      <div class="stat-sub">total lună</div>
    </div>`;

  document.getElementById('report-entries').innerHTML = buildDayGroupedHTML(entries);
}

function buildDayGroupedHTML(entries) {
  if (!entries.length) {
    return '<p class="empty-state" style="padding:20px 0;text-align:center;">Nicio înregistrare în această perioadă.</p>';
  }
  const groups = {};
  entries.forEach(e => {
    const key = new Date(e.timestamp).toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  });
  return Object.keys(groups)
    .sort((a, b) => new Date(b) - new Date(a))
    .map(key => {
      const date = new Date(key);
      const dayEntries = groups[key].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const dayMeals  = dayEntries.filter(e => e.type === 'meal');
      const dayUrines = dayEntries.filter(e => e.type === 'urine');
      const dayStools = dayEntries.filter(e => e.type === 'stool');
      const dayMl     = dayMeals.filter(m => m.milkType === 'formula').reduce((s, m) => s + (m.ml || 0), 0);
      const id = `day-grp-${date.getTime()}`;
      const dayLabel = date.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' });
      const summary = [
        dayMeals.length  > 0 ? `${dayMeals.length} hrăniri${dayMl > 0 ? ' · ' + dayMl + ' ml' : ''}` : '',
        dayUrines.length > 0 ? `${dayUrines.length} 💧` : '',
        dayStools.length > 0 ? `${dayStools.length} 💩` : '',
      ].filter(Boolean).join('  ·  ');
      return `
        <div class="acc-section">
          <button class="acc-header" onclick="toggleAccordion('${id}')">
            <div class="acc-title-block">
              <span class="acc-title">${dayLabel}</span>
              ${summary ? `<span class="acc-day-summary">${summary}</span>` : ''}
            </div>
            <span class="acc-count">${dayEntries.length}</span>
            <span class="acc-chevron" id="chevron-${id}">▼</span>
          </button>
          <div class="acc-body hidden" id="${id}">
            <div class="entries-list">
              ${dayEntries.map(e => entryHTMLFlat(e)).join('')}
            </div>
          </div>
        </div>`;
    }).join('');
}

function toggleAccordion(id) {
  const body = document.getElementById(id);
  const chevron = document.getElementById(`chevron-${id}`);
  if (!body) return;
  body.classList.toggle('hidden');
  if (chevron) chevron.textContent = body.classList.contains('hidden') ? '▼' : '▲';
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

function changeReportWeek(delta) {
  const next = state.reportWeekOffset + delta;
  if (next > 0) return;
  state.reportWeekOffset = next;
  refreshReportWeek();
}

function changeReportMonth(delta) {
  const next = state.reportMonthOffset + delta;
  if (next > 0) return;
  state.reportMonthOffset = next;
  refreshReportMonth();
}

// ─── PDF CHART HELPERS (Canvas 2D) ───────────────────────────

function _pdfCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  return { c, ctx };
}

// Generic bar chart builder used by all 3 stat charts
function _buildBarChartImg(title, data, barColor) {
  const CW = 700, CH = 300;
  const { c, ctx } = _pdfCanvas(CW, CH);
  const PL = 48, PR = 14, PT = 44, PB = 34;
  const chartW = CW - PL - PR, chartH = CH - PT - PB;

  // White card bg
  ctx.fillStyle = '#f8fafd';
  ctx.fillRect(0, 0, CW, CH);

  // Title
  ctx.fillStyle = '#1a2e4a'; ctx.font = 'bold 17px Arial'; ctx.textAlign = 'left';
  ctx.fillText(title, PL, 30);

  const rawMax = Math.max(...data.map(d => d.value), 1);
  const step   = rawMax <= 5 ? 1 : rawMax <= 10 ? 2 : rawMax <= 20 ? 5 : rawMax <= 100 ? 10 : 100;
  const gMax   = Math.ceil(rawMax / step) * step;
  const n = data.length;
  const slotW = chartW / n;
  const barW  = Math.max(20, slotW * 0.55);

  // Grid
  for (let v = 0; v <= gMax; v += step) {
    const gy = PT + chartH - (v / gMax) * chartH;
    ctx.strokeStyle = v === 0 ? '#cccccc' : '#eeeeee';
    ctx.lineWidth   = v === 0 ? 1.5 : 1;
    ctx.beginPath(); ctx.moveTo(PL, gy); ctx.lineTo(CW - PR, gy); ctx.stroke();
    ctx.fillStyle = '#aaaaaa'; ctx.font = '12px Arial'; ctx.textAlign = 'right';
    ctx.fillText(String(v), PL - 6, gy + 4);
  }

  // Bars + labels
  data.forEach((d, i) => {
    const bx    = PL + i * slotW + (slotW - barW) / 2;
    const baseY = PT + chartH;
    const bh    = (d.value / gMax) * chartH;
    if (bh > 0) { ctx.fillStyle = barColor; ctx.fillRect(bx, baseY - bh, barW, bh); }
    if (d.value > 0) {
      ctx.fillStyle = '#333333'; ctx.font = 'bold 13px Arial'; ctx.textAlign = 'center';
      const lbl = d.label || String(d.value);
      ctx.fillText(lbl, bx + barW / 2, Math.max(PT + 18, baseY - bh - 5));
    }
    ctx.fillStyle = '#666666'; ctx.font = '13px Arial'; ctx.textAlign = 'center';
    ctx.fillText(d.day, bx + barW / 2, baseY + 22);
  });

  return c.toDataURL('image/png');
}

function buildPdfMealMlChartImg() {
  const data = getLastNDates(7).map(date => {
    const total = getEntriesForDate(date)
      .filter(e => e.type === 'meal' && e.milkType === 'formula')
      .reduce((s, m) => s + (m.ml || 0), 0);
    return { day: formatShortDay(date), value: total, label: total > 0 ? total + 'ml' : '0' };
  });
  return _buildBarChartImg('Ml formula / zi (ultimele 7 zile)', data, '#4A90D9');
}

function buildPdfUrineChartImg() {
  const data = getLastNDates(7).map(date => ({
    day: formatShortDay(date),
    value: getEntriesForDate(date).filter(e => e.type === 'urine').length,
  }));
  return _buildBarChartImg('Treaba mica / zi (ultimele 7 zile)', data, '#E89C20');
}

function buildPdfStoolChartImg() {
  const data = getLastNDates(7).map(date => ({
    day: formatShortDay(date),
    value: getEntriesForDate(date).filter(e => e.type === 'stool').length,
  }));
  return _buildBarChartImg('Treaba mare / zi (ultimele 7 zile)', data, '#8B6226');
}

function buildPdfWeightChartImg() {
  const baby = getActiveBaby();
  const birth = baby?.birthDate ? new Date(baby.birthDate) : null;
  const allRecords = getGrowthRecordsForActiveBaby()
    .filter(r => Number.isFinite(Number(r.weightKg)));
  if (!allRecords.length) return null;

  // Use fractional months for x-positioning so all records plot individually,
  // even when multiple measurements fall within the same integer month.
  const _mFrac = date => {
    if (!birth) return 0;
    const days = Math.max(0, Math.floor((new Date(date) - birth) / 86400000));
    return days / 30.4375;
  };

  // All records sorted by date — no deduplication
  const sorted = allRecords
    .map(r => ({ mFrac: _mFrac(r.date), mInt: ageMonthsForRecord(r.date) ?? 0, v: Number(r.weightKg), date: r.date }))
    .sort((a, b) => a.mFrac - b.mFrac);

  // 6-month visible window covering all baby data
  const maxBabyM = sorted.length ? Math.max(...sorted.map(p => p.mInt)) : 5;
  const endM   = Math.min(12, Math.max(6, maxBabyM));
  const startM = Math.max(0, endM - 6);
  const mRange = endM - startM;

  const CW = 700, CH = 420;
  const { c, ctx } = _pdfCanvas(CW, CH);
  const PL = 52, PR = 80, PT = 44, PB = 46;
  const chartW = CW - PL - PR, chartH = CH - PT - PB;

  const dataset = WHO_GROWTH.weightKg;
  const visVals = [...Array(mRange + 1).keys()].map(i => startM + i);
  const minV = Math.min(...visVals.map(m => dataset.p3[m])) * 0.93;
  const maxV = Math.max(...visVals.map(m => dataset.p97[m])) * 1.05;
  // toX accepts fractional or integer months
  const toX = m => PL + ((m - startM) / mRange) * chartW;
  const toY = v => PT + chartH - ((v - minV) / (maxV - minV)) * chartH;

  // Background
  ctx.fillStyle = '#f8fafd'; ctx.fillRect(0, 0, CW, CH);

  // Title
  ctx.fillStyle = '#1a2e4a'; ctx.font = 'bold 17px Arial'; ctx.textAlign = 'left';
  ctx.fillText('Evolutie greutate (kg) — curbe WHO', PL, 30);

  // Y grid lines
  const yGridStep = (maxV - minV) <= 3 ? 0.5 : 1;
  const yStart = Math.ceil(minV / yGridStep) * yGridStep;
  for (let v = yStart; v <= maxV + 0.01; v += yGridStep) {
    const gy = toY(v);
    ctx.strokeStyle = '#eeeeee'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PL, gy); ctx.lineTo(CW - PR, gy); ctx.stroke();
    ctx.fillStyle = '#999999'; ctx.font = '11px Arial'; ctx.textAlign = 'right';
    ctx.fillText(v.toFixed(1), PL - 5, gy + 4);
  }

  // WHO percentile lines (dashed) + right-side legend
  const whoLines = [
    { key: 'p3',  color: '#f59595', label: 'P3'  },
    { key: 'p15', color: '#f6c462', label: 'P15' },
    { key: 'p50', color: '#6cc96c', label: 'P50' },
    { key: 'p85', color: '#f6c462', label: 'P85' },
    { key: 'p97', color: '#72bfda', label: 'P97' },
  ];
  const legX = CW - PR + 8, legSpacing = chartH / 6;
  whoLines.forEach(({ key, color, label: lbl }, idx) => {
    ctx.strokeStyle = color; ctx.lineWidth = 1.8;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    for (let mi = startM; mi <= endM; mi++) {
      const x = toX(mi), y = toY(dataset[key][mi]);
      mi === startM ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    const legY = PT + (idx + 0.5) * legSpacing;
    ctx.fillStyle = color; ctx.font = 'bold 12px Arial'; ctx.textAlign = 'left';
    ctx.fillText(lbl, legX, legY + 4);
  });

  // Baby line legend entry
  ctx.strokeStyle = '#4A90D9'; ctx.lineWidth = 2.5; ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(legX, PT + 5.5 * legSpacing + 4); ctx.lineTo(legX + 18, PT + 5.5 * legSpacing + 4); ctx.stroke();
  ctx.fillStyle = '#4A90D9'; ctx.font = 'bold 11px Arial'; ctx.textAlign = 'left';
  ctx.fillText('Bebe', legX + 22, PT + 5.5 * legSpacing + 8);

  // Baby connecting line (uses fractional x)
  if (sorted.length > 1) {
    ctx.strokeStyle = '#4A90D9'; ctx.lineWidth = 3; ctx.lineJoin = 'round';
    ctx.setLineDash([]);
    ctx.beginPath();
    sorted.forEach((p, i) => i === 0 ? ctx.moveTo(toX(p.mFrac), toY(p.v)) : ctx.lineTo(toX(p.mFrac), toY(p.v)));
    ctx.stroke();
  }

  // Data points + labels — alternate above/below to prevent overlap
  // Track placed label y-ranges per above/below side to nudge if needed
  const usedAbove = [], usedBelow = [];
  sorted.forEach((p, i) => {
    const px = toX(p.mFrac), py = toY(p.v);
    ctx.setLineDash([]);
    ctx.fillStyle = '#4A90D9';
    ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();

    const above = (i % 2 === 0);
    let ly = above ? py - 14 : py + 26;
    // Nudge if overlapping a previously placed label on the same side
    const used = above ? usedAbove : usedBelow;
    const LABEL_H = 16;
    for (const [ux, uy] of used) {
      if (Math.abs(px - ux) < 55 && Math.abs(ly - uy) < LABEL_H) {
        ly = above ? Math.min(uy - LABEL_H, ly) : Math.max(uy + LABEL_H, ly);
      }
    }
    ly = above ? Math.max(PT + 14, ly) : Math.min(PT + chartH - 6, ly);
    used.push([px, ly]);

    ctx.fillStyle = '#1a2e4a'; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center';
    ctx.fillText(`${p.v.toFixed(2)} kg`, px, ly);
  });

  // X axis labels (integer months)
  for (let m = startM; m <= endM; m++) {
    ctx.fillStyle = '#888888'; ctx.font = '13px Arial'; ctx.textAlign = 'center';
    ctx.fillText(`${m}L`, toX(m), PT + chartH + 26);
  }

  // X axis title
  ctx.fillStyle = '#aaaaaa'; ctx.font = '11px Arial'; ctx.textAlign = 'center';
  ctx.fillText('Luna de viata', PL + chartW / 2, CH - 10);

  // Axis lines
  ctx.strokeStyle = '#cccccc'; ctx.lineWidth = 1.5; ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(PL, PT); ctx.lineTo(PL, PT + chartH); ctx.lineTo(CW - PR, PT + chartH); ctx.stroke();

  return c.toDataURL('image/png');
}

// ─── PDF DATA HELPERS ────────────────────────────────────────

function _pdfSafe(str) {
  return String(str || '')
    .replace(/[ăĂ]/g, m => m === 'ă' ? 'a' : 'A')
    .replace(/[șȘ]/g, m => m === 'ș' ? 's' : 'S')
    .replace(/[țȚ]/g, m => m === 'ț' ? 't' : 'T');
}

function _pdfNextVaccine(baby) {
  if (!baby?.birthDate) return { name: '—', date: '' };
  const activeId = state.activeBabyId || getActiveBabyId();
  const done = new Set(
    loadVaccineRecords().filter(r => r.babyId === activeId && r.done).map(r => r.vaccineId)
  );
  const birth = new Date(baby.birthDate);
  const upcoming = VACCINE_SCHEDULE_RO
    .filter(v => !done.has(v.id))
    .map(v => { const d = new Date(birth); d.setDate(d.getDate() + v.dueDays); return { v, d }; })
    .sort((a, b) => a.d - b.d);
  if (!upcoming.length) return { name: 'Toate efectuate', date: '' };
  const { v, d } = upcoming[0];
  const shortName = v.name.split('(')[0].trim().slice(0, 22);
  const dateStr = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  return { name: shortName, date: dateStr };
}

function _pdfLastWeight() {
  const recs = getGrowthRecordsForActiveBaby()
    .filter(r => Number.isFinite(Number(r.weightKg)))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  if (!recs.length) return { weight: '—', date: '' };
  const r = recs[0];
  const d = new Date(r.date);
  return {
    weight: `${Number(r.weightKg).toFixed(3)} kg`,
    date:   `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`,
  };
}

// ─── PDF EXPORT ──────────────────────────────────────────────
function pdfEntryLine(e) {
  let label = '', detail = '';
  if (e.type === 'meal') {
    label  = 'Hranire';
    detail = e.milkType === 'breast'
      ? `san — ${e.duration || '?'} min`
      : `formula — ${e.ml || 0} ml`;
    if (e.notes) detail += `  (${e.notes.slice(0, 36)})`;
  } else if (e.type === 'urine') {
    label  = 'Treaba mica';
    detail = urineColorLabel(e.color);
  } else if (e.type === 'stool') {
    label  = 'Treaba mare';
    detail = `${stoolColorLabel(e.color)}, ${stoolAspectLabel(e.aspect || 'normal')}`;
  } else if (e.type === 'medication') {
    label  = e.name || 'Medicament';
    detail = `${e.dose || '?'} ${e.unit || ''}`.trim();
  }
  return { label, detail };
}

async function exportPrint() {
  const jsPdfNs = window.jspdf;
  if (!jsPdfNs?.jsPDF) {
    showModal('Export PDF indisponibil',
      'Lipseste libraria jsPDF. Verificati conexiunea si reincercati.',
      () => exportPrint());
    return;
  }

  const baby    = getActiveBaby();
  const period  = state.reportPeriod;
  const genDate = new Date().toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });

  let entries, periodLabel, pdfFileName, periodTypeLabel;
  if (period === 'saptamana') {
    const { monday, sunday } = getWeekBounds(state.reportWeekOffset);
    entries         = getEntriesForRange(monday, sunday);
    periodTypeLabel = 'Raport Saptamanal';
    const fmt       = { day: 'numeric', month: 'short' };
    periodLabel     = `${monday.toLocaleDateString('ro-RO', fmt)} - ${sunday.toLocaleDateString('ro-RO', fmt)}`;
    pdfFileName     = `robby-saptamana-${monday.toISOString().slice(0, 10)}.pdf`;
  } else if (period === 'luna') {
    const { first } = getMonthBounds(state.reportMonthOffset);
    entries         = getEntriesForRange(first, getMonthBounds(state.reportMonthOffset).last);
    periodTypeLabel = 'Raport Lunar';
    const ml        = first.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });
    periodLabel     = ml.charAt(0).toUpperCase() + ml.slice(1);
    pdfFileName     = `robby-luna-${first.toISOString().slice(0, 7)}.pdf`;
  } else {
    entries         = getEntriesForDate(state.reportDate);
    periodTypeLabel = 'Raport Zilnic';
    const rd        = new Date(state.reportDate);
    periodLabel     = `${String(rd.getDate()).padStart(2,'0')}/${String(rd.getMonth()+1).padStart(2,'0')}/${rd.getFullYear()}`;
    pdfFileName     = `robby-raport-${new Date(state.reportDate).toISOString().slice(0, 10)}.pdf`;
  }

  const meals        = entries.filter(e => e.type === 'meal');
  const urines       = entries.filter(e => e.type === 'urine');
  const stools       = entries.filter(e => e.type === 'stool');
  const meds         = entries.filter(e => e.type === 'medication');
  const totalMl      = meals.filter(m => m.milkType === 'formula').reduce((s, m) => s + (m.ml || 0), 0);
  const breastMeals  = meals.filter(m => m.milkType === 'breast');

  const { jsPDF } = jsPdfNs;
  setPdfProgress('Generez pagina 1...');

  try {
    const doc   = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const ML = 15, MR = 15;
    const CW = pageW - ML - MR;        // 180 mm
    const HDR_H = 22;                  // blue header bar height
    const CS    = HDR_H + 7;           // content start y
    const CE    = pageH - 16;          // content end y (above footer)
    const BLU   = [74, 144, 217];      // brand blue

    // ── Shared: draw blue header bar ─────────────────────────
    const drawHeader = (left, right) => {
      doc.setFillColor(...BLU);
      doc.rect(0, 0, pageW, HDR_H, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(_pdfSafe(left),  ML, HDR_H * 0.65);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(_pdfSafe(right), pageW - MR, HDR_H * 0.65, { align: 'right' });
      doc.setTextColor(30, 30, 30);
    };

    // ── Shared: add new page with header, return content start y
    const newPage = (left, right) => { doc.addPage(); drawHeader(left, right); return CS; };

    // ── Shared: section divider bar ──────────────────────────
    const sectionBar = (label, y) => {
      doc.setFillColor(...BLU);
      doc.rect(ML, y, CW, 6.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text(_pdfSafe(label), ML + 3, y + 4.5);
      doc.setTextColor(30, 30, 30);
      return y + 8.5;
    };

    // ── Entry row renderer ───────────────────────────────────
    const TYPE_COLOR = {
      meal:       [74,  144, 217],
      urine:      [232, 156,  32],
      stool:      [139,  98,  38],
      medication: [46,  158, 107],
    };
    const ROW_H = 6.8;
    const renderRow = (e, y, idx) => {
      const { label, detail } = pdfEntryLine(e);
      if (!label) return y + ROW_H;
      if (idx % 2 === 0) {
        doc.setFillColor(246, 249, 254);
        doc.rect(ML, y, CW, ROW_H, 'F');
      }
      const [r, g, b] = TYPE_COLOR[e.type] || [150, 150, 150];
      const cy = y + ROW_H / 2;
      doc.setFillColor(r, g, b);
      doc.circle(ML + 3.8, cy, 2.3, 'F');
      const ty = cy + 1.2;
      doc.setFontSize(9); doc.setFont('helvetica', 'bold');
      doc.setTextColor(95, 95, 95);
      const ts = formatTime(e.timestamp);
      doc.text(ts, ML + 9, ty);
      const tw = doc.getTextWidth(ts);
      doc.setTextColor(r, g, b);
      const sl = _pdfSafe(label);
      doc.text(sl, ML + 9 + tw + 2, ty);
      const lw = doc.getTextWidth(sl);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(55, 55, 55);
      const dx = ML + 9 + tw + 2 + lw + 2;
      const mw = CW - (9 + tw + 2 + lw + 2);
      if (mw > 10) doc.text(_pdfSafe(detail), dx, ty, { maxWidth: mw });
      return y + ROW_H;
    };

    // ─────────────────────────────────────────────────────────
    // PAGE 1 — RAPORT
    // ─────────────────────────────────────────────────────────
    const babyName = _pdfSafe(baby?.name || '—');
    let ageStr = '';
    if (baby?.birthDate) {
      const ageDays = Math.floor((Date.now() - new Date(baby.birthDate)) / 86400000);
      const ageM    = Math.floor(ageDays / 30.4375);
      const ageW    = Math.floor(ageDays / 7);
      ageStr = ageM > 0 ? `${ageM} luni (${ageW} sapt.)` : `${ageW} sapt.`;
    }
    drawHeader(
      `RoBby  ·  ${periodTypeLabel}`,
      `${babyName}${ageStr ? '  ·  ' + ageStr : ''}  ·  ${periodLabel}`
    );
    let y = CS;

    // ── Summary grid 2×3 ─────────────────────────────────────
    const vacInfo = _pdfNextVaccine(baby);
    const wtInfo  = _pdfLastWeight();
    const isMonth = period === 'luna';
    const dayCount = isMonth ? new Set(entries.map(e => new Date(e.timestamp).toDateString())).size : 0;
    const avgMl    = isMonth && dayCount > 0 ? Math.round(totalMl / dayCount) : 0;

    const gridItems = [
      { lbl: 'Hraniri',          val: String(meals.length),        sub: `${totalMl} ml  ·  ${breastMeals.length} san` },
      { lbl: 'Treaba mica',      val: String(urines.length),       sub: '' },
      { lbl: 'Treaba mare',      val: String(stools.length),       sub: '' },
      { lbl: 'Medicatie',        val: String(meds.length),         sub: '' },
      { lbl: 'Vaccin urmator',   val: _pdfSafe(vacInfo.name),      sub: vacInfo.date },
      { lbl: 'Ultima greutate',  val: wtInfo.weight,               sub: wtInfo.date || (isMonth ? `${dayCount} zile` : '') },
    ];

    const cols = 2, gGap = 5, gW = (CW - gGap) / cols, gH = 22, gRowGap = 4;
    gridItems.forEach((item, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const gx = ML + col * (gW + gGap);
      const gy = y + row * (gH + gRowGap);
      doc.setFillColor(241, 247, 254);
      doc.setDrawColor(196, 220, 246);
      doc.roundedRect(gx, gy, gW, gH, 2.5, 2.5, 'FD');
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(115, 145, 180);
      doc.text(item.lbl, gx + gW / 2, gy + 6.5, { align: 'center' });
      doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(20, 50, 100);
      doc.text(item.val, gx + gW / 2, gy + 14.5, { align: 'center', maxWidth: gW - 4 });
      if (item.sub) {
        doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(150, 155, 165);
        doc.text(item.sub, gx + gW / 2, gy + 20, { align: 'center', maxWidth: gW - 4 });
      }
    });
    y += Math.ceil(gridItems.length / cols) * (gH + gRowGap) - gRowGap + 6;

    // ── Journal section ───────────────────────────────────────
    y = sectionBar('JURNAL ACTIVITATE', y);

    const sorted = [...entries].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    if (!sorted.length) {
      doc.setFontSize(9); doc.setTextColor(160, 160, 160);
      doc.text('Nicio inregistrare in aceasta perioada.', ML, y + 5);
      doc.setTextColor(30, 30, 30);
    } else if (period === 'zi') {
      let ri = 0;
      for (const e of sorted) {
        if (y + ROW_H > CE) { y = newPage(`RoBby  ·  ${periodTypeLabel}`, `${babyName}  ·  ${periodLabel} (cont.)`); ri = 0; }
        y = renderRow(e, y, ri++);
      }
    } else {
      const groups = {};
      sorted.forEach(e => { const k = new Date(e.timestamp).toDateString(); (groups[k] = groups[k] || []).push(e); });
      for (const key of Object.keys(groups).sort((a, b) => new Date(a) - new Date(b))) {
        if (y + 12 > CE) { y = newPage(`RoBby  ·  ${periodTypeLabel}`, `${babyName}  ·  ${periodLabel} (cont.)`); }
        const dlabel = new Date(key).toLocaleDateString('ro-RO', { weekday: 'short', day: 'numeric', month: 'short' });
        doc.setFillColor(228, 240, 255);
        doc.rect(ML, y, CW, 6.5, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(40, 90, 170);
        doc.text(_pdfSafe(dlabel), ML + 3, y + 4.5);
        doc.setTextColor(30, 30, 30);
        y += 7;
        let ri = 0;
        for (const e of groups[key]) {
          if (y + ROW_H > CE) { y = newPage(`RoBby  ·  ${periodTypeLabel}`, `${babyName}  ·  ${periodLabel} (cont.)`); ri = 0; }
          y = renderRow(e, y, ri++);
        }
        y += 3;
      }
    }

    // ─────────────────────────────────────────────────────────
    // PAGE 2 — STATISTICI
    // ─────────────────────────────────────────────────────────
    if (settings.pdfIncludeCharts !== false) {
      y = newPage('RoBby  ·  Statistici', 'ultimele 7 zile');
      const imgW = CW;
      const imgH = (300 / 700) * imgW;  // ≈ 77 mm
      const gap  = 8;

      setPdfProgress('Generez graficul ml formula...');
      doc.addImage(buildPdfMealMlChartImg(), 'PNG', ML, y, imgW, imgH, undefined, 'FAST');
      y += imgH + gap;

      setPdfProgress('Generez graficul treaba mica...');
      doc.addImage(buildPdfUrineChartImg(), 'PNG', ML, y, imgW, imgH, undefined, 'FAST');
      y += imgH + gap;

      setPdfProgress('Generez graficul treaba mare...');
      doc.addImage(buildPdfStoolChartImg(), 'PNG', ML, y, imgW, imgH, undefined, 'FAST');
    }

    // ─────────────────────────────────────────────────────────
    // PAGE 3 — EVOLUTIE GREUTATE
    // ─────────────────────────────────────────────────────────
    if (settings.pdfIncludeGrowth !== false) {
      const weightRecs = getGrowthRecordsForActiveBaby()
        .filter(r => Number.isFinite(Number(r.weightKg)));
      if (weightRecs.length > 0) {
        y = newPage('RoBby  ·  Evolutie greutate', babyName);
        setPdfProgress('Generez graficul de greutate...');

        const wImg = buildPdfWeightChartImg();
        if (wImg) {
          const wImgW = CW, wImgH = (420 / 700) * wImgW;  // ≈ 108 mm
          doc.addImage(wImg, 'PNG', ML, y, wImgW, wImgH, undefined, 'FAST');
          y += wImgH + 6;
        }

        // Weight measurements table
        if (y + 16 < CE) {
          y = sectionBar('MASURATORI GREUTATE', y);
          const C1 = 44, C2 = 44, C3 = CW - C1 - C2;

          // Table header
          doc.setFillColor(220, 234, 250);
          doc.rect(ML, y, CW, 6.5, 'F');
          doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(30, 60, 110);
          doc.text('Data',             ML + C1 / 2,         y + 4.5, { align: 'center' });
          doc.text('Greutate (kg)',    ML + C1 + C2 / 2,    y + 4.5, { align: 'center' });
          doc.text('Percentila',       ML + C1 + C2 + C3/2, y + 4.5, { align: 'center' });
          y += 7;

          const sortedW = [...weightRecs].sort((a, b) => new Date(a.date) - new Date(b.date));
          sortedW.forEach((r, idx) => {
            if (y + 6 > CE) return;
            if (idx % 2 === 0) { doc.setFillColor(246, 250, 255); doc.rect(ML, y, CW, 6, 'F'); }
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(35, 35, 35);
            const dd = new Date(r.date);
            const ds = `${String(dd.getDate()).padStart(2,'0')}/${String(dd.getMonth()+1).padStart(2,'0')}/${dd.getFullYear()}`;
            const kg = Number(r.weightKg).toFixed(3);
            const mo = ageMonthsForRecord(r.date) ?? 0;
            const pc = percentileBandForValue('weightKg', mo, Number(r.weightKg));
            doc.text(ds,             ML + C1 / 2,         y + 4.2, { align: 'center' });
            doc.text(kg + ' kg',     ML + C1 + C2 / 2,    y + 4.2, { align: 'center' });
            doc.text(_pdfSafe(pc),   ML + C1 + C2 + C3/2, y + 4.2, { align: 'center' });
            y += 6;
          });
        }

        // ── Percentile explanation box ──────────────────────────
        y += 8;
        if (y + 55 < CE) {
          const bPad = 5, bIndent = 8, bW = CW;
          const textW = bW - bIndent - 4;
          const lineH = 4.8, gapH = 2.5;

          doc.setFontSize(9);
          const para1 = doc.splitTextToSize(
            _pdfSafe('Percentilele arata pozitia bebelusului fata de 100 de bebelusi de aceeasi varsta si sex, conform standardelor OMS.'),
            textW
          );
          const bLines = [
            'P3  — mai greu decat  3% dintre bebelusi',
            'P15 — mai greu decat 15% dintre bebelusi',
            'P50 — media (jumatatea grupului)',
            'P85 — mai greu decat 85% dintre bebelusi',
            'P97 — mai greu decat 97% dintre bebelusi',
          ];
          const note = doc.splitTextToSize(
            _pdfSafe('O valoare intre P15 si P85 este considerata normala. Consultati medicul pediatru pentru interpretarea corecta.'),
            textW
          );
          const bH = bPad + 6 + gapH + para1.length * lineH + gapH + bLines.length * lineH + gapH + note.length * lineH + bPad;

          // Light blue background
          doc.setFillColor(235, 245, 255);
          doc.rect(ML, y, bW, bH, 'F');
          // Blue left border
          doc.setFillColor(...BLU);
          doc.rect(ML, y, 3, bH, 'F');

          let ty = y + bPad + 4;
          // Title
          doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(30, 60, 110);
          doc.text(_pdfSafe('Despre percentile'), ML + bIndent, ty);
          ty += 6 + gapH;
          // Paragraph
          doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(40, 40, 40);
          para1.forEach(line => { doc.text(line, ML + bIndent, ty); ty += lineH; });
          ty += gapH;
          // Bullet list
          bLines.forEach(line => { doc.text(line, ML + bIndent, ty); ty += lineH; });
          ty += gapH;
          // Closing note (italic)
          doc.setFont('helvetica', 'italic'); doc.setFontSize(8.5);
          note.forEach(line => { doc.text(line, ML + bIndent, ty); ty += lineH; });

          doc.setFont('helvetica', 'normal'); doc.setTextColor(30, 30, 30);
          y += bH + 4;
        }
      }
    }

    // ─────────────────────────────────────────────────────────
    // FOOTER — on every page
    // ─────────────────────────────────────────────────────────
    const totalPages = doc.getNumberOfPages();
    for (let pg = 1; pg <= totalPages; pg++) {
      doc.setPage(pg);
      doc.setDrawColor(210, 215, 220);
      doc.setLineWidth(0.3);
      doc.line(ML, pageH - 13, pageW - MR, pageH - 13);
      doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(160, 160, 160);
      doc.text(
        `RoBby  ·  Tracker nou-nascut  ·  Generat: ${genDate}  ·  Pagina ${pg} din ${totalPages}`,
        pageW / 2, pageH - 6.5, { align: 'center' }
      );
    }

    setPdfProgress('Finalizez fisierul PDF...');
    doc.save(pdfFileName);
    showToast('PDF generat');
  } catch (err) {
    console.error('PDF export error:', err);
    showToast('Eroare la export PDF. Reincearca.');
  } finally {
    hidePdfProgress();
  }
}

// ─── SETTINGS ────────────────────────────────────────────────
function loadSettingsForm() {
  const baby = getActiveBaby();
  state.editingBabyId = baby?.id || '';

  // Baby profile sub-form
  document.getElementById('setting-baby-name').value       = baby?.name || '';
  document.getElementById('setting-birth-date').value      = baby?.birthDate || '';
  document.getElementById('setting-birth-weight').value    = baby?.birthWeight || '';
  document.getElementById('setting-blood-type').value      = baby?.bloodType || '';
  document.getElementById('setting-baby-photo-data').value = baby?.photoDataUrl || '';
  const preview = document.getElementById('baby-photo-preview');
  if (baby?.photoDataUrl) {
    preview.style.backgroundImage = `url('${baby.photoDataUrl}')`;
    preview.classList.remove('hidden');
  } else {
    preview.classList.add('hidden');
  }
  selectGender(baby?.gender || 'boy');

  // Formula / feeding
  const stgDl = document.getElementById('stg-formula-brands-list');
  if (stgDl) stgDl.innerHTML = FORMULA_BRANDS.map(b => `<option value="${b}">`).join('');
  const stgFormulaEl = document.getElementById('setting-formula');
  if (stgFormulaEl) {
    stgFormulaEl.value = settings.formula || 'NAN Supreme Pro 1';
    stgFormulaEl.dataset.savedBrand = '';
  }
  _updateStgFormulaClearBtn();
  document.getElementById('setting-interval').value = settings.customInterval || '';

  // Notifications
  const feedAlert = !!settings.notifications?.feedingAlert?.enabled;
  document.getElementById('setting-feeding-alert-enabled').checked = feedAlert;
  document.getElementById('setting-feeding-alert-limit').value = settings.notifications?.feedingAlert?.limitHours || 3;
  const limitRow = document.getElementById('stg-feeding-limit-row');
  if (limitRow) limitRow.classList.toggle('hidden', !feedAlert);

  const vitD = !!settings.notifications?.vitaminD?.enabled;
  document.getElementById('setting-vitamin-d-enabled').checked = vitD;
  document.getElementById('setting-vitamin-d-time').value = settings.notifications?.vitaminD?.time || '09:00';
  const vitDRow = document.getElementById('stg-vitamin-d-time-row');
  if (vitDRow) vitDRow.classList.toggle('hidden', !vitD);

  document.getElementById('setting-vaccine-due-enabled').checked = !!settings.notifications?.vaccineDue?.enabled;

  // Reports / PDF
  const period = settings.defaultReportPeriod || 'zi';
  document.querySelectorAll('.stg-period-btn').forEach(b => b.classList.toggle('active', b.dataset.period === period));
  const chartsEl = document.getElementById('stg-pdf-charts');
  const growthEl = document.getElementById('stg-pdf-growth');
  if (chartsEl) chartsEl.checked = settings.pdfIncludeCharts !== false;
  if (growthEl) growthEl.checked = settings.pdfIncludeGrowth !== false;

  // App / theme
  applyTheme(settings.theme || 'blue');
  document.getElementById('theme-blue').classList.toggle('active', settings.theme !== 'pink');
  document.getElementById('theme-pink').classList.toggle('active', settings.theme === 'pink');
  const dmEl = document.getElementById('stg-dark-mode');
  if (dmEl) dmEl.checked = !!settings.darkMode;

  // Family sync
  const fcCode = settings.familyCode || '—';
  document.getElementById('family-code-text').textContent = fcCode;
  const fcInner = document.getElementById('family-code-text-inner');
  if (fcInner) fcInner.textContent = fcCode;
  const fb = settings.firebase || {};
  document.getElementById('fb-api-key').value     = fb.apiKey      || '';
  document.getElementById('fb-auth-domain').value = fb.authDomain  || '';
  document.getElementById('fb-project-id').value  = fb.projectId   || '';
  document.getElementById('fb-db-url').value       = fb.databaseURL || '';
  document.getElementById('fb-app-id').value       = fb.appId       || '';

  renderBabyProfilesList();
  refreshBabySelector();
}

function selectGender(g) {
  settings.gender = g;
  document.getElementById('gender-boy').classList.toggle('active', g === 'boy');
  document.getElementById('gender-girl').classList.toggle('active', g === 'girl');
}

function saveSettings() {
  const babies = loadBabies();
  const id = state.editingBabyId || state.activeBabyId;
  const idx = babies.findIndex(b => b.id === id);
  if (idx >= 0) {
    babies[idx] = {
      ...babies[idx],
      name: document.getElementById('setting-baby-name').value.trim() || 'Bebeluș',
      birthDate: document.getElementById('setting-birth-date').value,
      birthWeight: document.getElementById('setting-birth-weight').value,
      bloodType: document.getElementById('setting-blood-type').value.trim(),
      photoDataUrl: document.getElementById('setting-baby-photo-data').value || '',
      gender: settings.gender || babies[idx].gender || 'boy',
      updatedAt: new Date().toISOString(),
    };
    saveBabies(babies);
    if (id !== state.activeBabyId) setActiveBabyId(id);
  }
  settings.formula        = document.getElementById('setting-formula').value.trim() || 'NAN Supreme Pro 1';
  settings.customInterval = document.getElementById('setting-interval').value;
  settings.notifications.feedingAlert.limitHours = Math.max(1, Number(document.getElementById('setting-feeding-alert-limit').value || 3));
  settings.notifications.vitaminD.time = document.getElementById('setting-vitamin-d-time').value || '09:00';
  savePdfSettings();
  saveSettingsToStorage(settings);
  const active = getActiveBaby();
  document.getElementById('header-baby-name').textContent = active?.name || 'RoBby';
  refreshBabySelector();
  renderBabyProfilesList();
  updateHeaderAge();
  showToast('✓ Profil și setări salvate!');
  evaluateNotifications();
}

function selectTheme(theme) {
  settings.theme = theme;
  applyTheme(theme);
  ['blue', 'pink'].forEach(t => {
    document.getElementById(`theme-${t}`)?.classList.toggle('active', t === theme);
  });
  saveSettingsToStorage(settings);
  showToast(`Tema: ${theme === 'blue' ? 'Baby Blue' : 'Cotton Pink'}`);
}

function applyTheme(theme) {
  const dark = settings.darkMode ? ' dark' : '';
  document.getElementById('app').className = `theme-${theme}${dark}`;
  document.getElementById('meta-theme-color').content = theme === 'pink' ? '#C95B87' : '#4A90D9';
}

function toggleDarkMode(enabled) {
  settings.darkMode = !!enabled;
  applyTheme(settings.theme || 'blue');
  saveSettingsToStorage(settings);
}

function onFeedingAlertToggle(enabled) {
  toggleNotificationSetting('feedingAlert', enabled);
  const row = document.getElementById('stg-feeding-limit-row');
  if (row) row.classList.toggle('hidden', !enabled);
}

function onVitaminDToggle(enabled) {
  toggleNotificationSetting('vitaminD', enabled);
  const row = document.getElementById('stg-vitamin-d-time-row');
  if (row) row.classList.toggle('hidden', !enabled);
}

function setDefaultReportPeriod(period) {
  settings.defaultReportPeriod = period;
  saveSettingsToStorage(settings);
  document.querySelectorAll('.stg-period-btn').forEach(b => b.classList.toggle('active', b.dataset.period === period));
}

function savePdfSettings() {
  settings.pdfIncludeCharts = document.getElementById('stg-pdf-charts')?.checked ?? true;
  settings.pdfIncludeGrowth = document.getElementById('stg-pdf-growth')?.checked ?? true;
  saveSettingsToStorage(settings);
}

function toggleNotificationSetting(type, enabled) {
  if (!settings.notifications) settings.notifications = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.notifications));
  if (type === 'feedingAlert') settings.notifications.feedingAlert.enabled = enabled;
  if (type === 'vitaminD') settings.notifications.vitaminD.enabled = enabled;
  if (type === 'vaccineDue') settings.notifications.vaccineDue.enabled = enabled;
  saveSettingsToStorage(settings);
  if (enabled) requestNotificationPermission();
  evaluateNotifications();
}

function setVitaminDReminderTime(timeValue) {
  if (!settings.notifications) settings.notifications = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.notifications));
  settings.notifications.vitaminD.time = timeValue || '09:00';
  saveSettingsToStorage(settings);
}

function requestNotificationPermission() {
  if (!('Notification' in window)) {
    showNotificationFallback('Notificările browser nu sunt suportate pe acest dispozitiv. Se vor afișa bannere în aplicație.');
    return;
  }
  if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission !== 'granted') showNotificationFallback('Permisiunea pentru notificări a fost refuzată. Se folosesc bannere în aplicație.');
      else hideNotificationFallback();
    });
    return;
  }
  if (Notification.permission !== 'granted') showNotificationFallback('Permisiunea pentru notificări este blocată. Se folosesc bannere în aplicație.');
  else hideNotificationFallback();
}

function startReminderTimer() {
  clearInterval(state.reminderTimer);
  state.reminderTimer = setInterval(() => {
    if (state.currentScreen === 'home') refreshHome();
    evaluateNotifications();
  }, 60000);
}

function canUseBrowserNotifications() {
  return 'Notification' in window && Notification.permission === 'granted';
}

function notifyOncePerHour(tag, title, body) {
  const now = Date.now();
  const last = state.lastNotificationAtByTag[tag] || 0;
  if (now - last < 3600000) return;
  state.lastNotificationAtByTag[tag] = now;
  if (canUseBrowserNotifications()) {
    new Notification(title, { body, icon: 'icons/icon-192.png', tag, renotify: false });
  }
}

function evaluateNotifications() {
  const notif = settings.notifications || DEFAULT_SETTINGS.notifications;
  evaluateFeedingAlert(notif.feedingAlert);
  evaluateVitaminDReminder(notif.vitaminD);
  evaluateVaccineDueReminder(notif.vaccineDue);
}

function evaluateFeedingAlert(cfg) {
  if (!cfg?.enabled) {
    hideFeedingAlertBanner();
    return;
  }
  // Search last 24h so overnight meals are included
  const since = new Date(Date.now() - 24 * 3600000);
  const activeId = state.activeBabyId || getActiveBabyId();
  const recentMeals = loadEntries().filter(e =>
    (!activeId || e.babyId === activeId) &&
    e.type === 'meal' &&
    new Date(e.timestamp) >= since
  );
  if (!recentMeals.length) {
    hideFeedingAlertBanner();
    return;
  }
  const lastMeal = recentMeals.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  const elapsedHours = (Date.now() - new Date(lastMeal.timestamp)) / 3600000;
  // Use the custom interval the user set, not the notification-specific limitHours
  const intervalHours = parseFloat(settings.customInterval) || getFeedingGuide().intervalHours;
  const threshold = intervalHours + 1;
  if (elapsedHours >= threshold) {
    const txt = `⚠️ A trecut ${elapsedHours.toFixed(1)}h de la ultima hrănire (limită: ${intervalHours}h + 1h).`;
    showFeedingAlertBanner(txt);
    notifyOncePerHour('feeding-overdue', '🍼 RoBby – Hrănire întârziată', txt);
  } else {
    hideFeedingAlertBanner();
  }
}

function evaluateVitaminDReminder(cfg) {
  if (!cfg?.enabled) return;
  if (hasVitaminDToday(new Date())) {
    hideNotificationFallback();
    return;
  }
  const target = cfg.time || '09:00';
  const [h, m] = target.split(':').map(Number);
  const now = new Date();
  const due = new Date();
  due.setHours(Number.isFinite(h) ? h : 9, Number.isFinite(m) ? m : 0, 0, 0);
  if (now >= due) {
    notifyOncePerHour('vitamin-d-reminder', '💧 RoBby – Reminder Vitamina D', 'Nu este înregistrată Vitamina D pentru azi.');
  }
}

function evaluateVaccineDueReminder(cfg) {
  refreshVaccineBanner();
  if (!cfg?.enabled) return;
  const dueSoon = getVaccinesDueSoon(Number(cfg.daysAhead || 30));
  if (!dueSoon.length) return;
  const msg = `Ai ${dueSoon.length} vaccin(uri) scadente în următoarele ${Number(cfg.daysAhead || 30)} zile.`;
  notifyOncePerHour('vaccine-due', '💉 RoBby – Vaccin scadent curând', msg);
}

// ─── NAV SUBMENUS ────────────────────────────────────────────
function toggleNavSubmenu(name) {
  const panel = document.getElementById(`nav-submenu-${name}`);
  if (!panel) return;
  const isOpen = !panel.classList.contains('hidden');
  closeNavSubmenu();
  if (!isOpen) {
    panel.classList.remove('hidden');
    document.getElementById(`nav-btn-${name}`)?.classList.add('active');
  }
}

function closeNavSubmenu() {
  document.querySelectorAll('.nav-submenu').forEach(m => m.classList.add('hidden'));
  document.querySelectorAll('.nav-btn[data-group]').forEach(b => {
    // Only remove active if we're not on a screen belonging to that group
    const group = b.dataset.group;
    const screens = group === 'copil' ? NAV_COPIL_SCREENS : NAV_INFO_SCREENS;
    if (!screens.includes(state.currentScreen)) b.classList.remove('active');
  });
}

function triggerNotification() {
  if (canUseBrowserNotifications()) {
    const guide = getFeedingGuide();
    new Notification('🍼 RoBby – Ora hrănirii!', {
      body: `${getActiveBaby()?.name || 'Bebelușul'} trebuie hrănit. Recomandat: ${guide.ml} ml`,
      icon: 'icons/icon-192.png',
      tag: 'feeding-reminder',
      renotify: false,
    });
  }
}

// ─── FAMILY SYNC ─────────────────────────────────────────────
function _setFamilyCodeDisplay(code) {
  document.getElementById('family-code-text').textContent = code;
  const inner = document.getElementById('family-code-text-inner');
  if (inner) inner.textContent = code;
}

function createFamily() {
  const code = uid();
  settings.familyCode = code;
  saveSettingsToStorage(settings);
  _setFamilyCodeDisplay(code);
  showToast(`Cod familie: ${code}`);
  if (state.firebaseDB) connectFirebaseFamily(code);
}

function joinFamily() {
  const code = document.getElementById('join-code').value.trim().toUpperCase();
  if (code.length !== 6) { showToast('Codul trebuie sa aiba 6 caractere'); return; }
  settings.familyCode = code;
  saveSettingsToStorage(settings);
  _setFamilyCodeDisplay(code);
  showToast(`Alaturat familiei: ${code}`);
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
  migrateToV3IfNeeded();

  applyTheme(settings.theme || 'blue');

  setTimeout(() => {
    document.getElementById('screen-splash').style.display = 'none';
    document.getElementById('app-header').classList.remove('hidden');
    document.getElementById('app-main').classList.remove('hidden');
    document.getElementById('bottom-nav').classList.remove('hidden');

    refreshBabySelector();
    const active = getActiveBaby();
    document.getElementById('header-baby-name').textContent = active?.name || 'RoBby';
    updateHeaderAge();

    if (!active?.name) showToast('Configurați bebelușul în Setări ⚙️', 3500);

    showScreen('home'); // fix #2 — always home on launch

    startReminderTimer();
    evaluateNotifications();

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
