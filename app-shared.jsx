// app-shared.jsx — shared brand & UI primitives

// 8-point geometric star mark (two overlapping squares — simple Islamic motif)
function StarMark({ size = 28, color = "currentColor", stroke = 1.6 }) {
  const c = size / 2;
  const s = size * 0.62;
  const o = (size - s) / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth={stroke} strokeLinejoin="round">
        <rect x={o} y={o} width={s} height={s} rx={size * 0.04} />
        <rect x={o} y={o} width={s} height={s} rx={size * 0.04} transform={`rotate(45 ${c} ${c})`} />
      </g>
    </svg>
  );
}

function Logo({ scale = 1, mono = false, onClick }) {
  return (
    <div onClick={onClick} role={onClick ? "button" : undefined} title={onClick ? "Back to home" : undefined}
      style={{ display: "flex", alignItems: "center", gap: 11 * scale, cursor: onClick ? "pointer" : "default" }}>
      <img src="assets/isoc-mededu-mark.png" alt="ISOC MedEd"
        style={{
          width: 40 * scale, height: 40 * scale, objectFit: "contain", flexShrink: 0,
          filter: mono ? "brightness(0) invert(1)" : "none",
        }} />
      <div style={{ lineHeight: 1.05 }}>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 19 * scale,
          color: mono ? "#fff" : "var(--ink)", letterSpacing: "-0.01em",
        }}>
          ISOC<span style={{ color: mono ? "var(--amber)" : "var(--amber-deep)" }}>MEDED</span>
        </div>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 9.5 * scale, letterSpacing: "0.08em",
          color: mono ? "rgba(255,255,255,0.6)" : "var(--ink-faint)", textTransform: "uppercase", marginTop: 2 * scale,
        }}>
          Manchester Med Education
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ value, total, tone = "navy" }) {
  const pct = total ? (value / total) * 100 : 0;
  const fill = tone === "amber" ? "var(--amber)" : "var(--navy-bright)";
  return (
    <div style={{ height: 6, background: "var(--navy-tint2)", borderRadius: 999, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${pct}%`, background: fill, borderRadius: 999,
        transition: "width 0.45s cubic-bezier(0.22,1,0.36,1)",
      }} />
    </div>
  );
}

function ScoreRing({ pct, size = 168 }) {
  const stroke = 13;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const tone = pct >= 70 ? "var(--good)" : pct >= 50 ? "var(--amber)" : "var(--bad)";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--navy-tint2)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={tone} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 0.9s cubic-bezier(0.22,1,0.36,1)" }}
      />
      <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle"
        style={{ fontFamily: "var(--font-display)", fontSize: size * 0.26, fontWeight: 600, fill: "var(--ink)" }}>
        {Math.round(pct)}%
      </text>
      <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle"
        style={{ fontFamily: "var(--font-mono)", fontSize: size * 0.07, letterSpacing: "0.08em", fill: "var(--ink-faint)" }}>
        SCORE
      </text>
    </svg>
  );
}

// Letter badge for options (A B C D)
function OptionLetter({ index, state }) {
  // state: 'idle' | 'selected' | 'correct' | 'wrong'
  const letter = String.fromCharCode(65 + index);
  const styles = {
    idle:     { bg: "var(--navy-tint)", fg: "var(--navy)", bd: "var(--line)" },
    selected: { bg: "var(--navy-bright)", fg: "#fff", bd: "var(--navy-bright)" },
    correct:  { bg: "var(--good)", fg: "#fff", bd: "var(--good)" },
    wrong:    { bg: "var(--bad)", fg: "#fff", bd: "var(--bad)" },
  }[state] || { bg: "var(--navy-tint)", fg: "var(--navy)", bd: "var(--line)" };
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "calc(var(--radius-sm) * 0.85)", flexShrink: 0,
      display: "grid", placeItems: "center", fontWeight: 700, fontSize: "0.9rem",
      background: styles.bg, color: styles.fg, border: `1.5px solid ${styles.bd}`,
      transition: "all 0.2s ease",
    }}>{letter}</div>
  );
}

function Icon({ name, size = 18, color = "currentColor", stroke = 1.8 }) {
  const paths = {
    check: <polyline points="20 6 9 17 4 12" />,
    x: <g><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></g>,
    arrowRight: <g><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></g>,
    arrowLeft: <g><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></g>,
    flag: <g><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></g>,
    clock: <g><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></g>,
    book: <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z" />,
    bulb: <g><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a6 6 0 0 0-4 10.5c.7.8 1 1.3 1 2.5h6c0-1.2.3-1.7 1-2.5A6 6 0 0 0 12 2z" /></g>,
    target: <g><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill={color} /></g>,
    restart: <g><polyline points="1 4 1 10 7 10" /><path d="M3.5 15a9 9 0 1 0 2-9.5L1 10" /></g>,
    home: <g><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></g>,
    calendar: <g><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /></g>,
    notes: <g><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><polyline points="14 3 14 8 19 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="13" y2="17" /></g>,
    plus: <g><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></g>,
    trash: <g><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></g>,
    edit: <g><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" /></g>,
    mapPin: <g><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></g>,
    users: <g><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></g>,
    chevronLeft: <polyline points="15 18 9 12 15 6" />,
    chevronRight: <polyline points="9 18 15 12 9 6" />,
    file: <g><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></g>,
    layers: <g><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></g>,
    page: <g><rect x="4" y="3" width="16" height="18" rx="2" /><line x1="8" y1="8" x2="16" y2="8" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="8" y1="16" x2="13" y2="16" /></g>,
    link: <g><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></g>,
    download: <g><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></g>,
    search: <g><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></g>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

// Shared top navigation. Logo → home; Question Bank is live, others are upcoming.
function TopNav({ active = "bank", onHome, onBank, onCalendar, onResources }) {
  const items = [
    { id: "bank", label: "Question Bank", live: true, on: onBank },
    { id: "resources", label: "Resources", live: true, on: onResources },
    { id: "calendar", label: "Calendar", live: true, on: onCalendar },
  ];
  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 28px", borderBottom: "1px solid var(--line)",
      background: "color-mix(in oklab, var(--card) 88%, transparent)",
      backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 20,
    }}>
      <Logo onClick={onHome} />
      <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {items.map((it) => {
          const isActive = it.id === active;
          const clickable = it.live && !isActive && it.on;
          return (
            <div key={it.id}
              onClick={clickable ? it.on : undefined}
              title={it.live ? "" : "Part of the wider ISOCMEDED platform"}
              style={{
                position: "relative", fontSize: "0.88rem", fontWeight: isActive ? 700 : 500,
                color: isActive ? "var(--navy)" : "var(--ink-soft)",
                padding: "8px 14px", borderRadius: "var(--radius-pill)", whiteSpace: "nowrap",
                background: isActive ? "var(--navy-tint)" : "transparent",
                cursor: isActive ? "default" : clickable ? "pointer" : "default",
              }}>
              {it.label}
              {!it.live && (
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.55rem", verticalAlign: "super",
                  marginLeft: 4, color: "var(--ink-faint)",
                }}>soon</span>
              )}
            </div>
          );
        })}
      </nav>
    </header>
  );
}

Object.assign(window, { StarMark, Logo, ProgressBar, ScoreRing, OptionLetter, Icon, TopNav });
