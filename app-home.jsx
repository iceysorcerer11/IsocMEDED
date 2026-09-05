// app-home.jsx — landing / home screen shown first and when the logo is clicked.

function FeatureCard({ icon, title, desc, status, live, onClick }) {
  const clickable = live && onClick;
  return (
    <div
      onClick={clickable ? onClick : undefined}
      className="card"
      style={{
        position: "relative", overflow: "hidden", textAlign: "left",
        padding: "26px 24px 22px", display: "flex", flexDirection: "column",
        cursor: clickable ? "pointer" : "default",
        borderColor: live ? "var(--navy-tint2)" : "var(--line)",
        transition: "transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease",
      }}
      onMouseEnter={(e) => { if (!clickable) return; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.borderColor = "var(--navy-bright)"; }}
      onMouseLeave={(e) => { if (!clickable) return; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.borderColor = "var(--navy-tint2)"; }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ width: 50, height: 50, borderRadius: "var(--radius)", display: "grid", placeItems: "center", background: live ? "var(--navy-tint)" : "var(--bg)", border: "1px solid var(--line)" }}>
          <Icon name={icon} size={24} color={live ? "var(--navy)" : "var(--ink-faint)"} />
        </div>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.64rem", letterSpacing: "0.06em", textTransform: "uppercase",
          padding: "4px 10px", borderRadius: "var(--radius-pill)", whiteSpace: "nowrap",
          color: live ? "var(--good-deep)" : "var(--amber-deep)",
          background: live ? "var(--good-tint)" : "var(--amber-tint)",
        }}>{status}</span>
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.42rem", fontWeight: 600, color: "var(--ink)" }}>{title}</div>
      <div style={{ fontSize: "0.92rem", color: "var(--ink-soft)", lineHeight: 1.5, marginTop: 8, flex: 1 }}>{desc}</div>
      {live && (
        <div style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.86rem", fontWeight: 700, color: "var(--navy)" }}>
          Open <Icon name="arrowRight" size={16} color="var(--navy)" />
        </div>
      )}
    </div>
  );
}

function HomeScreen({ onBank, onCalendar, onResources }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNav active="home" onHome={() => window.scrollTo(0, 0)} onBank={onBank} onCalendar={onCalendar} onResources={onResources} />

      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
        <div className="geo-bg" style={{ opacity: 0.05 }} />

        <main style={{ position: "relative", maxWidth: 920, margin: "0 auto", padding: "clamp(40px, 7vw, 84px) 28px 72px", width: "100%" }}>

          {/* ── Bismillah ── */}
          <div className="fade-up" style={{ textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
              <span style={{ height: 1, flex: "0 1 90px", background: "linear-gradient(to right, transparent, var(--navy-tint2))" }} />
              <StarMark size={20} color="var(--amber-deep)" stroke={1.4} />
              <span style={{ height: 1, flex: "0 1 90px", background: "linear-gradient(to left, transparent, var(--navy-tint2))" }} />
            </div>
            <div style={{ margin: "22px 0 14px" }}>
              <img src="assets/bismillah.png" alt="Bismillah ir-Rahman ir-Raheem"
                style={{ display: "block", margin: "0 auto", width: "min(440px, 78%)", height: "auto" }} />
            </div>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "0.74rem", letterSpacing: "0.1em",
              textTransform: "uppercase", color: "var(--ink-faint)",
            }}>
              In the name of Allah, the Most Gracious, the Most Merciful
            </div>
          </div>

          {/* ── Intro ── */}
          <div className="fade-up" style={{ textAlign: "center", maxWidth: 640, margin: "clamp(40px, 6vw, 64px) auto 0" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber-deep)", marginBottom: 16 }}>
              ISOCMEDED · Manchester
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.9rem)", lineHeight: 1.12, color: "var(--ink)" }}>
              A teaching society<br />by students, for students
            </h1>
            <p style={{ fontSize: "1.08rem", color: "var(--ink-soft)", lineHeight: 1.6, marginTop: 18, textWrap: "pretty" }}>
              We are a student-led medical education society, supporting your learning
              through every theme of the year. From practice questions to curated notes
              and a shared calendar, everything we make is created by students who have
              sat where you are now, built to help you understand, not just memorise.
            </p>
          </div>

          {/* ── Sections ── */}
          <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, marginTop: "clamp(40px, 6vw, 60px)" }}>
            <FeatureCard
              icon="target" title="Question Bank" status="Live now" live
              desc="Hundreds of MCQs across every theme, written and explained by students. Revise in practice mode for instant feedback, or exam mode to test yourself."
              onClick={onBank} />
            <FeatureCard
              icon="notes" title="Resources" status="Live now" live
              desc="Concise, theme-by-theme revision notes, Anki decks and links. The essentials distilled, so you can spend less time searching and more time learning."
              onClick={onResources} />
            <FeatureCard
              icon="calendar" title="Calendar" status="Live now" live
              desc="Teaching sessions, mock exams and key deadlines gathered in one place, so you always know what's coming up and how to prepare."
              onClick={onCalendar} />
          </div>

          {/* ── Footer note ── */}
          <div className="fade-up" style={{ textAlign: "center", marginTop: "clamp(48px, 7vw, 72px)", color: "var(--ink-faint)", fontSize: "0.82rem", lineHeight: 1.6 }}>
            A revision companion, not a replacement. The University's own resources always come first.
          </div>
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen });
