// app-resources-data.jsx — Google Drive links per year.
// ═══════════════════════════════════════════════════════
//  Paste each year's Google Drive folder link below.
// ═══════════════════════════════════════════════════════
const R_DRIVE_LINKS = {
  1: "",
  2: "",
  3: "",
  4: "",
  5: "",
};

const R_YEARS = {
  1: { label: "Year 1", color: "oklch(0.55 0.14 252)", deep: "oklch(0.42 0.13 254)", tint: "oklch(0.95 0.04 252)" },
  2: { label: "Year 2", color: "oklch(0.58 0.11 158)", deep: "oklch(0.44 0.10 158)", tint: "oklch(0.95 0.045 160)" },
  3: { label: "Year 3", color: "oklch(0.62 0.13 75)",  deep: "oklch(0.48 0.12 70)",  tint: "oklch(0.96 0.04 80)" },
  4: { label: "Year 4", color: "oklch(0.55 0.13 320)", deep: "oklch(0.42 0.12 320)", tint: "oklch(0.95 0.04 320)" },
  5: { label: "Year 5", color: "oklch(0.55 0.12 20)",  deep: "oklch(0.43 0.12 20)",  tint: "oklch(0.95 0.04 20)" },
};
const R_YEAR_ORDER = [1, 2, 3, 4, 5];

Object.assign(window, { R_DRIVE_LINKS, R_YEARS, R_YEAR_ORDER });
