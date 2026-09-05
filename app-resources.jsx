// app-resources.jsx — Resources: five stacked year buttons, each opening
// that year's Google Drive folder in a new tab. No sub-pages.

function RYearRow({ year }) {
  const m = R_YEARS[year];
  const url = R_DRIVE_LINKS[year];
  const linked = !!url;
  return (
    <a href={linked ? url : undefined} target="_blank" rel="noopener noreferrer"
      onClick={linked ? undefined : (e) => e.preventDefault()}
      className="card" style={{
        textDecoration: "none", padding: "22px 24px", width: "100%",
        display: "flex", alignItems: "center", gap: 18, borderColor: "var(--navy-tint2)",
        cursor: linked ? "pointer" : "default", opacity: linked ? 1 : 0.65,
        transition: "transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease",
      }}
      onMouseEnter={(e) => { if (!linked) return; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.borderColor = m.color; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.borderColor = "var(--navy-tint2)"; }}>
      <div style={{ width: 52, height: 52, borderRadius: "var(--radius)", display: "grid", placeItems: "center", background: m.tint, border: "1px solid var(--line)", fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: m.deep, flexShrink: 0 }}>
        {year}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)" }}>{m.label}</div>
        <div style={{ fontSize: "0.9rem", color: "var(--ink-soft)", lineHeight: 1.45, marginTop: 3 }}>
          {linked ? "Opens the " + m.label + " Google Drive folder in a new tab." : "Google Drive folder coming soon."}
        </div>
      </div>
      <Icon name="arrowRight" size={18} color={m.deep} />
    </a>
  );
}

function ResourcesScreen({ onHome, onBank, onCalendar }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNav active="resources" onHome={onHome} onBank={onBank} onCalendar={onCalendar} onResources={() => {}} />
      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div className="geo-bg" style={{ opacity: 0.04 }} />
        <main style={{ position: "relative", flex: 1, maxWidth: 760, width: "100%", margin: "0 auto", padding: "clamp(24px, 4vw, 44px) 28px 64px" }}>
          <div className="fade-up" style={{ marginBottom: 6 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber-deep)", marginBottom: 8 }}>
              ISOCMEDED · Manchester
            </div>
            <h1 style={{ fontSize: "clamp(1.9rem, 4vw, 2.6rem)", lineHeight: 1.1, color: "var(--ink)" }}>Resources</h1>
            <p style={{ fontSize: "1.06rem", color: "var(--ink-soft)", marginTop: 8, maxWidth: 560, lineHeight: 1.55, textWrap: "pretty" }}>
              Notes, Anki decks and CCA prep, organised by year. Each button opens that year's Google Drive folder.
            </p>
          </div>
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: "clamp(24px, 4vw, 34px)" }}>
            {R_YEAR_ORDER.map((year) => <RYearRow key={year} year={year} />)}
          </div>
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { ResourcesScreen });
