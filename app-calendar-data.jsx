// app-calendar-data.jsx — calendar constants, helpers & seed events (26/27 term-time)

// Academic year: September 2026 → June 2027 (term-time). month is 0-indexed.
const ACADEMIC_MONTHS = [
  { y: 2026, m: 8 }, { y: 2026, m: 9 }, { y: 2026, m: 10 }, { y: 2026, m: 11 },
  { y: 2027, m: 0 }, { y: 2027, m: 1 }, { y: 2027, m: 2 }, { y: 2027, m: 3 },
  { y: 2027, m: 4 }, { y: 2027, m: 5 },
];

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Year colour coding, harmonised with the navy/amber scheme.
const YEAR_META = {
  1: { label: "Year 1", color: "oklch(0.55 0.14 252)", deep: "oklch(0.42 0.13 254)", tint: "oklch(0.95 0.04 252)" },
  2: { label: "Year 2", color: "oklch(0.58 0.11 158)", deep: "oklch(0.44 0.10 158)", tint: "oklch(0.95 0.045 160)" },
  3: { label: "Year 3", color: "oklch(0.62 0.13 75)",  deep: "oklch(0.48 0.12 70)",  tint: "oklch(0.96 0.04 80)" },
  4: { label: "Year 4", color: "oklch(0.55 0.13 320)", deep: "oklch(0.42 0.12 320)", tint: "oklch(0.95 0.04 320)" },
  5: { label: "Year 5", color: "oklch(0.55 0.12 20)",  deep: "oklch(0.43 0.12 20)",  tint: "oklch(0.95 0.04 20)" },
};

const TYPE_META = {
  lecture:  { label: "Teaching", icon: "book" },
  mock:     { label: "Mock exam", icon: "target" },
  social:   { label: "Social", icon: "users" },
  deadline: { label: "Deadline", icon: "flag" },
};

// ── date helpers (all local-time, no timezone parsing) ──
function dstr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function dateToStr(date) { return dstr(date.getFullYear(), date.getMonth(), date.getDate()); }

// Monday-start month grid → array of weeks, each a 7-cell array of { date, inMonth }.
function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) {
    cells.push({ date: new Date(year, month, 1 - (startOffset - i)), inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false });
  }
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function fmtTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "pm" : "am";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hh}${ap}` : `${hh}:${String(m).padStart(2, "0")}${ap}`;
}
function fmtTimeRange(s, e) {
  if (!s) return "All day";
  return e ? `${fmtTime(s)} – ${fmtTime(e)}` : fmtTime(s);
}
function fmtLongDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${WEEKDAYS[(date.getDay() + 6) % 7]} ${d} ${MONTH_SHORT[m - 1]}`;
}

// ════════════════════════════════════════════════════════════════════
//  LIVE DATA SOURCE
//  Paste your Google Sheet "Publish to web" CSV link between the quotes
//  below. While it is empty (""), the calendar shows the built-in example
//  events. Once you add the link, every visitor sees whatever is in the sheet.
// ════════════════════════════════════════════════════════════════════
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS6H-1w93S47oqYRBIAH7VTIWyV4431liJvlJD-PeHRXjOaa6zx0fErIcdQi7P2UwlD9bfwKTnlJhmZ/pub?gid=0&single=true&output=csv";

// Robust CSV parser — handles quoted fields, commas and newlines in notes.
function parseCSV(text) {
  const rows = []; let field = "", row = [], inQ = false, i = 0;
  while (i < text.length) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQ = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { inQ = true; i++; continue; }
    if (c === ",") { row.push(field); field = ""; i++; continue; }
    if (c === "\r") { i++; continue; }
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    field += c; i++;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const TYPE_ALIASES = {
  lecture: "lecture", teaching: "lecture", session: "lecture",
  mock: "mock", exam: "mock", "mock exam": "mock", test: "mock",
  social: "social", event: "social",
  deadline: "deadline", due: "deadline", submission: "deadline",
};
function normType(s) { return TYPE_ALIASES[(s || "").trim().toLowerCase()] || "lecture"; }

// Accept YYYY-MM-DD / YYYY/M/D (preferred) or UK-style DD/MM/YYYY → always YYYY-MM-DD.
function normDate(s) {
  s = (s || "").trim();
  let m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);   // year first
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);            // UK day first
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  return s;
}

// Turn parsed CSV rows into event objects (first row = header names).
function rowsToEvents(rows) {
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const col = (name) => head.indexOf(name);
  const di = col("date"), yi = col("year"), ti = col("type"), tli = col("title"),
    si = col("start"), ei = col("end"), li = col("location"), ni = col("notes");
  const out = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]; if (!row) continue;
    const date = normDate(di >= 0 ? row[di] : "");
    const title = (tli >= 0 ? row[tli] : "").trim();
    if (!date || !title) continue;
    out.push({
      id: "sheet-" + r, date, title,
      year: (function () { const n = Number((yi >= 0 ? row[yi] : "1").trim()); return n >= 1 && n <= 5 ? n : 1; })(),
      type: normType(ti >= 0 ? row[ti] : ""),
      start: (si >= 0 ? row[si] : "").trim(),
      end: (ei >= 0 ? row[ei] : "").trim(),
      location: (li >= 0 ? row[li] : "").trim(),
      notes: (ni >= 0 ? row[ni] : "").trim(),
    });
  }
  return out;
}

// ── persistence ──
const CAL_KEY = "isocmeded_cal_events_v1";function loadEvents() {
  try {
    const raw = localStorage.getItem(CAL_KEY);
    if (raw !== null) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return SEED_EVENTS;
}
function saveEvents(events) {
  try { localStorage.setItem(CAL_KEY, JSON.stringify(events)); } catch (e) { /* ignore */ }
}

let __eid = 0;
function ev(date, year, type, title, start, end, location, notes) {
  __eid += 1;
  return { id: "seed-" + __eid, date, year, type, title, start, end, location, notes: notes || "" };
}

// Seeded teaching sessions, mocks, socials & deadlines across the term-time year.
const SEED_EVENTS = [
  // ── September ──
  ev("2026-09-21", 1, "lecture", "Welcome & Foundations of Medicine", "13:00", "15:00", "Stopford, Theatre 1"),
  ev("2026-09-24", 1, "social", "Freshers Meet & Greet", "18:00", "20:00", "Students' Union"),
  ev("2026-09-28", 2, "lecture", "Cardio-Respiratory Recap", "14:00", "16:00", "Stopford, Theatre 2"),
  // ── October ──
  ev("2026-10-05", 1, "lecture", "Anatomy of the Thorax", "13:00", "14:30", "AV Hill, Lab 3"),
  ev("2026-10-12", 2, "lecture", "Renal Physiology", "14:00", "16:00", "Stopford, Theatre 1"),
  ev("2026-10-19", 1, "mock", "MSK Spotter Mock", "10:00", "12:00", "Stopford, Lab 1"),
  ev("2026-10-26", 2, "lecture", "Endocrine Systems", "14:00", "15:30", "Stopford, Theatre 2"),
  // ── November ──
  ev("2026-11-02", 1, "lecture", "Cardiovascular Physiology", "13:00", "14:30", "Stopford, Theatre 1"),
  ev("2026-11-09", 2, "mock", "Semester 1 Mock Exam", "09:30", "12:30", "University Place"),
  ev("2026-11-16", 1, "social", "Charity Bake Sale", "12:00", "15:00", "Stopford Foyer"),
  ev("2026-11-23", 2, "lecture", "Principles of Pharmacology", "14:00", "16:00", "Stopford, Theatre 2"),
  ev("2026-11-30", 1, "deadline", "PEP Assignment Due", "17:00", "", "Online · Blackboard"),
  // ── December ──
  ev("2026-12-07", 1, "mock", "End-of-Term Progress Mock", "10:00", "12:00", "University Place"),
  ev("2026-12-14", 2, "deadline", "Portfolio Submission", "17:00", "", "Online · Blackboard"),
  // ── January ──
  ev("2027-01-18", 1, "lecture", "The Gastrointestinal System", "13:00", "14:30", "Stopford, Theatre 1"),
  ev("2027-01-25", 2, "lecture", "Introduction to Neuroscience", "14:00", "16:00", "Stopford, Theatre 2"),
  // ── February ──
  ev("2027-02-01", 1, "lecture", "Immunology Essentials", "13:00", "14:30", "Stopford, Theatre 1"),
  ev("2027-02-08", 2, "mock", "Mock OSCE Practice", "09:00", "13:00", "Clinical Skills Suite"),
  ev("2027-02-22", 1, "social", "Inter-Year Quiz Night", "18:30", "21:00", "Students' Union"),
  // ── March ──
  ev("2027-03-01", 2, "lecture", "Clinical Pharmacology", "14:00", "16:00", "Stopford, Theatre 2"),
  ev("2027-03-08", 1, "mock", "Progress Test Mock", "10:00", "12:30", "University Place"),
  ev("2027-03-15", 2, "deadline", "SSC Report Due", "17:00", "", "Online · Blackboard"),
  // ── April ──
  ev("2027-04-19", 1, "lecture", "Reproductive System", "13:00", "14:30", "Stopford, Theatre 1"),
  ev("2027-04-26", 2, "mock", "Finals Preparation Mock", "09:30", "12:30", "University Place"),
  // ── May ──
  ev("2027-05-03", 1, "lecture", "Whole-Year Revision", "13:00", "15:00", "Stopford, Theatre 1"),
  ev("2027-05-10", 2, "lecture", "Exam Technique Workshop", "14:00", "15:30", "Stopford, Theatre 2"),
  ev("2027-05-17", 1, "mock", "Summer Mock Exam", "09:30", "12:30", "University Place"),
  // ── June ──
  ev("2027-06-07", 2, "social", "End-of-Year Celebration", "18:00", "21:00", "Students' Union"),
  ev("2027-06-14", 1, "lecture", "Results & Feedback Session", "13:00", "14:00", "Stopford, Theatre 1"),
];

Object.assign(window, {
  ACADEMIC_MONTHS, MONTH_NAMES, MONTH_SHORT, WEEKDAYS, YEAR_META, TYPE_META,
  dstr, dateToStr, buildMonthGrid, fmtTime, fmtTimeRange, fmtLongDate,
  loadEvents, saveEvents, SEED_EVENTS,
  SHEET_CSV_URL, parseCSV, rowsToEvents,
});
