// app-questions-live.jsx — live weekly questions from the ISOCMEDED Google Form sheet.
// One form submission = up to 3 questions (Q1–Q3). Fetched fresh on every page
// load and merged into window.QUESTIONS — no redeploys needed.
const Q_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRwoBFm-QW3iN1KFHcfiegqL4LFl1DJvt6tKZMD5ul_Si8cepEtvuIvWzWSXflg2qcLS5Gfs53cFIzJ/pub?gid=1201587659&single=true&output=csv";
//
// Expected form columns (any casing/punctuation): a year question (header containing
// "year", values like "Year 1"/"Year 2") · Theme · "TBL or anatomy qs?" ·
// then per question N (1–10): "QN Question Stem", "QN OPTION A–E",
// "QN Correct Answer", "QN Correct Answer Explanation", optional "QN Image".
// Optional per-row: "Approved" (if present, only yes/y/true/1 rows go live).

// Resolve a theme within the chosen year. Year 2: "1a"/"1b" both map to theme 1.
function qLiveTheme(raw, year) {
  let s = (raw || "").trim().toLowerCase();
  if (!s) return null;
  if (year === 2) s = s.replace(/^(\d+)[ab]$/, "$1"); // 1a/1b → 1 (Y2 has no lettered themes)
  const themes = THEMES[year] || [];
  const num = s.replace(/^theme\s*/, "");
  return themes.find((t) => t.num.toLowerCase() === num || t.num.toLowerCase() === num.padStart(2, "0") || t.id === "t" + num || t.id === "y2t" + num || t.id === num)
    || themes.find((t) => t.title.toLowerCase() === s || t.title.toLowerCase().startsWith(s)) || null;
}

// New-bank questions file under Anatomy or Physiology only, per the form's choice.
function qLiveSub(raw, theme) {
  const s = (raw || "").trim().toLowerCase();
  if (s.includes("anat")) return "Anatomy";
  return "Physiology & Biochem";
}

// Google Drive share link → embeddable image URL (other URLs pass through).
function qImageUrl(raw) {
  const s = (raw || "").trim();
  if (!s) return "";
  const m = s.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?.*id=)([\w-]+)/);
  return m ? "https://drive.google.com/thumbnail?id=" + m[1] + "&sz=w1200" : s;
}

function qRowsToQuestions(rows) {
  if (!rows.length) return [];
  const head = rows[0].map((h) => (h || "").toLowerCase().replace(/[^a-z0-9]/g, ""));
  const col = (n) => head.indexOf(n);
  // Theme column: header starting with "theme" (survives renames with extra guidance text).
  const themeC = head.findIndex((h) => h.startsWith("theme"));
  // Year column: a header containing "year" that is not the teacher-name or theme column
  // (e.g. "THE QUESTIONS IF FOR WHICH YEAR?"). Prefer one mentioning "which"/"questions".
  const yearCands = head.map((h, i) => ({ h, i })).filter(({ h, i }) => i !== themeC && h.includes("year") && !h.includes("teacher") && !h.includes("name"));
  const yearPref = yearCands.find(({ h }) => h.includes("which") || h.includes("question"));
  const yearC = (yearPref || yearCands[0] || { i: -1 }).i;
  const kindC = head.findIndex((h) => h.includes("tbl") || h.includes("anatomy"));
  const approvedC = col("approved");
  const out = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]; if (!row) continue;
    const get = (i) => (i >= 0 && row[i] != null ? String(row[i]).trim() : "");
    if (approvedC >= 0 && !["yes", "y", "true", "1", "approved"].includes(get(approvedC).toLowerCase())) continue;
    // Year: read "2" from values like "Year 2"; default Year 1 if absent/unclear.
    const yearRaw = get(yearC);
    const year = /2/.test(yearRaw) ? 2 : 1;
    const theme = qLiveTheme(get(themeC), year);
    if (!theme) continue;
    const sub = qLiveSub(get(kindC), theme);
    for (let n = 1; n <= 10; n++) {
      const stemC = head.findIndex((h) => h === "q" + n + "questionstem" || h === "q" + n + "stem");
      if (stemC < 0) continue;
      const stem = get(stemC);
      if (!stem) continue;
      const options = ["a", "b", "c", "d", "e"].map((L) => get(col("q" + n + "option" + L))).filter(Boolean);
      if (options.length < 2) continue;
      const letter = get(col("q" + n + "correctanswer")).toUpperCase().replace(/[^A-E]/g, "");
      const correct = "ABCDE".indexOf(letter);
      if (correct < 0 || correct >= options.length) continue;
      const q = Q("live-" + r + "-" + n, theme.id, sub, stem, options, correct,
        get(col("q" + n + "correctanswerexplanation")), "", "hard");
      q.image = qImageUrl(get(col("q" + n + "image")));
      q.source = "ISOCMEDED · Weekly submission";
      out.push(q);
    }
  }
  return out;
}

function qParseCSV(text) {
  const rows = []; let field = "", row = [], inQ = false, i = 0;
  while (i < text.length) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i += 2; continue; } inQ = false; i++; continue; }
      field += c; i++; continue;
    }
    if (c === '"') { inQ = true; i++; continue; }
    if (c === ",") { row.push(field); field = ""; i++; continue; }
    if (c === "\r") { i++; continue; }
    if (c === "\n") { row.push(field); rows.push(row); field = ""; row = []; i++; continue; }
    field += c; i++;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows;
}

if (Q_SHEET_URL) {
  const bust = (Q_SHEET_URL.includes("?") ? "&" : "?") + "_cb=" + Date.now();
  fetch(Q_SHEET_URL + bust, { cache: "no-store" })
    .then((r) => { if (!r.ok) throw new Error("bad"); return r.text(); })
    .then((txt) => {
      const live = qRowsToQuestions(qParseCSV(txt));
      if (!live.length) return;
      window.QUESTIONS = window.QUESTIONS.filter((q) => !String(q.id).startsWith("live-")).concat(live);
      window.dispatchEvent(new CustomEvent("live-questions", { detail: { count: live.length } }));
    })
    .catch(() => {});
}
