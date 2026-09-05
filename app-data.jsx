// app-data.jsx — ISOCMEDED Year 1 question bank: structure, helpers & sample themes.
// Real question banks (themes 1b–7) are loaded from questions/*.jsx, which push into
// window.QUESTIONS. Themes 1a and 8–16 use placeholder samples defined here.

const YEARS = [
  { id: 1, label: "Year 1", systems: ["Reproductive System", "Cardiovascular System", "Respiratory System"], locked: false },
  { id: 2, label: "Year 2", systems: ["Nervous System", "Digestive System"], locked: false },
];

// Canonical subsection labels (order used for display)
const SUBS = {
  ANAT: "Anatomy",
  PHYS: "Physiology & Biochem",
  CLIN: "Clinical & Pharmacology",
  ETH: "Ethics & EBM",
  BSS: "BSS",
};

// Themes per year (actual ISOCMEDED curriculum). subs vary per theme.
const Y2SUBS = ["Anatomy", "Physiology & Biochem", "Clinical & Pharmacology", "Ethics & EBM", "BSS"];
const THEMES = {
  1: [
    { id: "t1a", num: "1a", title: "Early embryology", subs: ["Anatomy", "Physiology & Biochem"] },
    { id: "t1b", num: "1b", title: "Fertilisation, pregnancy & parturition", subs: ["Anatomy", "Physiology & Biochem", "Ethics & EBM", "BSS"] },
    { id: "t2", num: "02", title: "Chromosomal abnormalities", subs: ["Anatomy", "Physiology & Biochem", "Ethics & EBM", "BSS"] },
    { id: "t3", num: "03", title: "Cystic fibrosis", subs: ["Anatomy", "Physiology & Biochem", "Ethics & EBM", "BSS"] },
    { id: "t4", num: "04", title: "Postnatal growth & puberty", subs: ["Anatomy", "Physiology & Biochem", "Ethics & EBM", "BSS"] },
    { id: "t5", num: "05", title: "HIV & immunity", subs: ["Anatomy", "Physiology & Biochem", "Clinical & Pharmacology", "Ethics & EBM", "BSS"] },
    { id: "t6", num: "06", title: "Cancer", subs: ["Anatomy", "Physiology & Biochem", "Ethics & EBM", "BSS"] },
    { id: "t7", num: "07", title: "Ageing, frailty & polypharmacy", subs: ["Anatomy", "Physiology & Biochem", "Clinical & Pharmacology", "BSS"] },
    { id: "t8", num: "08", title: "Pneumothorax", subs: ["Anatomy", "Physiology & Biochem", "BSS"] },
    { id: "t9", num: "09", title: "Asthma", subs: ["Anatomy", "Physiology & Biochem", "Ethics & EBM", "BSS"] },
    { id: "t10", num: "10", title: "COPD", subs: ["Anatomy", "Physiology & Biochem", "Clinical & Pharmacology", "Ethics & EBM", "BSS"] },
    { id: "t11", num: "11", title: "Heart valve dysfunction", subs: ["Anatomy", "Physiology & Biochem", "Clinical & Pharmacology", "BSS"] },
    { id: "t12", num: "12", title: "Ischaemic heart disease", subs: ["Anatomy", "Physiology & Biochem", "Clinical & Pharmacology", "Ethics & EBM", "BSS"] },
    { id: "t13", num: "13", title: "Hypertension", subs: ["Anatomy", "Physiology & Biochem", "Clinical & Pharmacology", "BSS"] },
    { id: "t14", num: "14", title: "Haematology", subs: ["Anatomy", "Physiology & Biochem", "Ethics & EBM"] },
    { id: "t15", num: "15", title: "DVT & PE (VTE)", subs: ["Anatomy", "Physiology & Biochem", "Clinical & Pharmacology", "BSS"] },
    { id: "t16", num: "16", title: "Shock", subs: ["Physiology & Biochem", "Clinical & Pharmacology", "Ethics & EBM"] },
  ],
  2: [
    { id: "y2t1", num: "01", title: "Neuroembryology", subs: Y2SUBS },
    { id: "y2t2", num: "02", title: "Musculoskeletal system", subs: Y2SUBS },
    { id: "y2t3", num: "03", title: "Neurodegeneration", subs: Y2SUBS },
    { id: "y2t4", num: "04", title: "Neurocognition", subs: Y2SUBS },
    { id: "y2t5", num: "05", title: "Mental disorders", subs: Y2SUBS },
    { id: "y2t6", num: "06", title: "Neurovascular conditions", subs: Y2SUBS },
    { id: "y2t7", num: "07", title: "Severe mental disorders", subs: Y2SUBS },
    { id: "y2t8", num: "08", title: "Vision & hearing", subs: Y2SUBS },
    { id: "y2t9", num: "09", title: "Pain & arthritis", subs: Y2SUBS },
    { id: "y2t10", num: "10", title: "Oesophagus", subs: Y2SUBS },
    { id: "y2t11", num: "11", title: "GORD", subs: Y2SUBS },
    { id: "y2t12", num: "12", title: "Stomach", subs: Y2SUBS },
    { id: "y2t13", num: "13", title: "Pancreas", subs: Y2SUBS },
    { id: "y2t14", num: "14", title: "Colon", subs: Y2SUBS },
    { id: "y2t15", num: "15", title: "Liver", subs: Y2SUBS },
    { id: "y2t16", num: "16", title: "Diabetes", subs: Y2SUBS },
    { id: "y2t17", num: "17", title: "Kidney", subs: Y2SUBS },
    { id: "y2t18", num: "18", title: "Prostate", subs: Y2SUBS },
    { id: "y2t19", num: "19", title: "Thyroid", subs: Y2SUBS },
  ],
};

const THEME_TITLE = {}; const THEME_YEAR = {};
Object.entries(THEMES).forEach(([yr, list]) => list.forEach((t) => { THEME_TITLE[t.id] = t.title; THEME_YEAR[t.id] = Number(yr); }));

// Q(id, themeId, subsection, stem, options, correct, explanation, keyPoint?, difficulty?)
// difficulty: "legacy" (the original easy/legacy bank) | "hard" (application questions)
function Q(id, themeId, subsection, stem, options, correct, explanation, keyPoint, difficulty) {
  return {
    id, year: THEME_YEAR[themeId] || 1, themeId, subsection, theme: THEME_TITLE[themeId],
    stem, options, correct, explanation, keyPoint: keyPoint || "",
    difficulty: difficulty || "legacy",
    source: `ISOCMEDED · ${THEME_TITLE[themeId]}`,
  };
}

// QH(...) — same as Q but tagged as a hard application question.
// To avoid the correct answer always sitting in the same slot, each hard question's
// options are rotated so the correct answer lands at a target index that cycles
// evenly through all positions (deterministic — stable across reloads).
let __hardCounter = 0;
const __HARD_TARGET_CYCLE = [0, 2, 4, 1, 3];
function QH(id, themeId, subsection, stem, options, correct, explanation, keyPoint) {
  const n = options.length;
  const target = __HARD_TARGET_CYCLE[__hardCounter % __HARD_TARGET_CYCLE.length] % n;
  __hardCounter += 1;
  const shift = ((target - correct) % n + n) % n; // rotate so correct → target
  const rotated = new Array(n);
  for (let i = 0; i < n; i++) rotated[(i + shift) % n] = options[i];
  return Q(id, themeId, subsection, stem, rotated, target, explanation, keyPoint, "hard");
}

window.QUESTIONS = [];

// ── Sample questions for themes without a provided bank (1a, 8–16) ──
window.QUESTIONS.push(
  // Theme 1a — Early embryology
  Q("t1a_p", "t1a", "Physiology & Biochem",
    "Following gastrulation, the trilaminar embryonic disc is composed of which three primary germ layers?",
    ["Ectoderm, mesoderm and endoderm", "Epiblast, hypoblast and trophoblast", "Cytotrophoblast, syncytiotrophoblast and amnion", "Endoderm, notochord and somite"], 0,
    "Gastrulation converts the bilaminar disc into three germ layers (ectoderm, mesoderm and endoderm) from which all tissues arise.",
    "The three germ layers are ectoderm, mesoderm and endoderm."),
  Q("t1a_a", "t1a", "Anatomy",
    "Which germ layer gives rise to the nervous system and the epidermis of the skin?",
    ["Endoderm", "Mesoderm", "Ectoderm", "Notochord"], 2,
    "Ectoderm forms the nervous system (via the neural tube) and the epidermis. Mesoderm forms muscle, bone and the cardiovascular system; endoderm forms the gut lining.",
    "Ectoderm → nervous system + epidermis."),
);

function themesForYear(year) { return THEMES[year] || []; }
function questionsFor(themeId, subsection, difficulty) {
  return window.QUESTIONS.filter((q) =>
    q.themeId === themeId &&
    (!subsection || q.subsection === subsection) &&
    (!difficulty || q.difficulty === difficulty));
}
function defaultSelection(year) {
  const sel = {};
  themesForYear(year).forEach((t) => { sel[t.id] = [...t.subs]; });
  return sel;
}

Object.assign(window, { YEARS, THEMES, THEME_TITLE, THEME_YEAR, SUBS, Q, QH, themesForYear, questionsFor, defaultSelection });
