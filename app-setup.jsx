// app-setup.jsx — calm step-by-step quiz wizard (Year 1 focus)

function Stepper({ stage, setStage, steps }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap", marginBottom: 38 }}>
      {steps.map((s, i) => {
        const done = i < stage;
        const current = i === stage;
        const reachable = i <= stage;
        return (
          <React.Fragment key={s.key}>
            <button onClick={() => reachable && setStage(i)} disabled={!reachable} style={{
              display: "inline-flex", alignItems: "center", gap: 8, border: "none", background: "transparent",
              cursor: reachable ? "pointer" : "default", padding: "4px 2px",
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: 999, display: "grid", placeItems: "center", flexShrink: 0,
                fontSize: "0.74rem", fontWeight: 700, fontFamily: "var(--font-mono)",
                background: current ? "var(--navy)" : done ? "var(--navy-tint)" : "var(--card)",
                color: current ? "#fff" : done ? "var(--navy)" : "var(--ink-faint)",
                border: `1.5px solid ${current ? "var(--navy)" : done ? "var(--navy-tint2)" : "var(--line)"}`,
                transition: "all 0.2s ease",
              }}>{done ? "✓" : i + 1}</span>
              <span style={{ textAlign: "left", lineHeight: 1.1 }}>
                <span style={{
                  display: "block", fontSize: "0.82rem", fontWeight: current ? 700 : 600,
                  color: current ? "var(--ink)" : done ? "var(--navy)" : "var(--ink-faint)",
                }}>{s.label}</span>
                {done && s.value && (
                  <span style={{ display: "block", fontSize: "0.7rem", color: "var(--ink-faint)", fontFamily: "var(--font-mono)" }}>{s.value}</span>
                )}
              </span>
            </button>
            {i < steps.length - 1 && (
              <span style={{ width: 22, height: 1.5, background: i < stage ? "var(--navy-tint2)" : "var(--line)", borderRadius: 2, flexShrink: 0 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function YearTile({ year, selected, count, onClick }) {
  const locked = year.locked;
  return (
    <button onClick={locked ? undefined : onClick} className="card" disabled={locked} style={{
      textAlign: "left", padding: "22px 22px 20px", cursor: locked ? "default" : "pointer", position: "relative", overflow: "hidden",
      borderColor: selected ? "var(--navy-bright)" : "var(--line)", borderWidth: selected ? 2 : 1,
      background: locked ? "color-mix(in oklab, var(--card) 70%, var(--bg))" : selected ? "var(--navy-tint)" : "var(--card)",
      boxShadow: "var(--shadow-sm)", opacity: locked ? 0.92 : 1,
      transition: "transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease",
    }}
    onMouseEnter={(e) => { if (locked) return; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.borderColor = "var(--navy-bright)"; }}
    onMouseLeave={(e) => { if (locked) return; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; if (!selected) e.currentTarget.style.borderColor = "var(--line)"; }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: 600, lineHeight: 1, color: locked ? "var(--ink-faint)" : "var(--navy)" }}>{year.id}</div>
        <StarMark size={26} color={locked ? "var(--ink-faint)" : "var(--navy-bright)"} stroke={1.4} />
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.18rem", fontWeight: 600, color: locked ? "var(--ink-soft)" : "var(--ink)" }}>{year.label}</div>
      <ul style={{ listStyle: "disc", margin: "9px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 3 }}>
        {year.systems.map((s) => (
          <li key={s} style={{ fontSize: "0.86rem", color: locked ? "var(--ink-faint)" : "var(--ink-soft)", lineHeight: 1.4 }}>{s}</li>
        ))}
      </ul>
      <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {locked ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.04em", whiteSpace: "nowrap", color: "var(--amber-deep)", background: "var(--amber-tint)", padding: "4px 10px", borderRadius: "var(--radius-pill)", textTransform: "uppercase" }}>
            In progress
          </span>
        ) : (
          <React.Fragment>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", color: "var(--ink-faint)" }}>{count} questions</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.8rem", fontWeight: 700, color: "var(--navy)" }}>
              Start <Icon name="arrowRight" size={15} color="var(--navy)" />
            </span>
          </React.Fragment>
        )}
      </div>
    </button>
  );
}

// Tri-state checkbox: 'on' | 'off' | 'mixed'
function Check({ state, accent = "var(--navy-bright)" }) {
  const on = state === "on", mixed = state === "mixed";
  return (
    <span style={{
      width: 22, height: 22, borderRadius: "calc(var(--radius-sm) * 0.7)", flexShrink: 0,
      display: "grid", placeItems: "center", transition: "all 0.15s ease",
      background: on || mixed ? "var(--navy)" : "var(--card)",
      border: `1.5px solid ${on || mixed ? "var(--navy)" : "var(--line)"}`,
    }}>
      {on && <Icon name="check" size={14} color="#fff" stroke={2.6} />}
      {mixed && <span style={{ width: 10, height: 2.5, borderRadius: 2, background: "#fff" }} />}
    </span>
  );
}

function ThemeRow({ theme, selectedSubs, open, difficulty, onToggleTheme, onToggleSub, onToggleOpen }) {
  const subs = subsFor(theme, difficulty);
  const total = subs.length;
  const sel = selectedSubs.length;
  const state = sel === 0 ? "off" : sel === total ? "on" : "mixed";
  const qCount = questionsFor(theme.id, null, difficulty).length;
  return (
    <div className="card" style={{ overflow: "hidden", borderColor: state !== "off" ? "var(--navy-tint2)" : "var(--line)", boxShadow: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px" }}>
        <button onClick={onToggleTheme} aria-label={`Select ${theme.title}`} style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", display: "flex" }}>
          <Check state={state} />
        </button>
        <button onClick={onToggleOpen} style={{
          flex: 1, display: "flex", alignItems: "center", gap: 14, border: "none", background: "transparent",
          cursor: "pointer", padding: 0, textAlign: "left", minWidth: 0,
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 600, flexShrink: 0,
            color: state !== "off" ? "var(--navy)" : "var(--ink-faint)",
            width: 26, textAlign: "center",
          }}>{theme.num}</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontSize: "1rem", fontWeight: 600, color: "var(--ink)" }}>{theme.title}</span>
            <span style={{ display: "block", fontSize: "0.76rem", color: "var(--ink-faint)", marginTop: 1 }}>
              {subs.join(" · ")}
            </span>
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--ink-faint)", flexShrink: 0, marginRight: 4, whiteSpace: "nowrap" }}>{qCount} Qs</span>
          <span style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s ease", flexShrink: 0, display: "flex" }}>
            <Icon name="arrowRight" size={16} color="var(--ink-faint)" />
          </span>
        </button>
      </div>
      {open && (
        <div className="fade-in" style={{ borderTop: "1px solid var(--line-soft)", padding: "6px 16px 12px 52px", display: "flex", flexDirection: "column", gap: 2 }}>
          {subs.map((sub) => {
            const on = selectedSubs.includes(sub);
            const n = questionsFor(theme.id, sub, difficulty).length;
            return (
              <button key={sub} onClick={() => onToggleSub(sub)} style={{
                display: "flex", alignItems: "center", gap: 12, border: "none", background: "transparent",
                cursor: "pointer", padding: "8px 4px", textAlign: "left", borderRadius: "var(--radius-sm)",
              }}>
                <Check state={on ? "on" : "off"} />
                <span style={{ flex: 1, fontSize: "0.92rem", fontWeight: 500, color: on ? "var(--ink)" : "var(--ink-soft)" }}>{sub}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--ink-faint)", whiteSpace: "nowrap" }}>{n} Q</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ModeCard({ mode, active, onClick }) {
  const meta = {
    practice: { title: "Practice", icon: "bulb", desc: "Instant feedback and a full explanation after every question.", note: "Best for learning as you go" },
    exam: { title: "Exam", icon: "clock", desc: "Answer everything first, then review your score and the worked answers.", note: "Best for testing yourself" },
  }[mode];
  return (
    <button onClick={onClick} className="card" style={{
      flex: 1, minWidth: 240, textAlign: "left", padding: "26px 24px", cursor: "pointer",
      borderColor: active ? "var(--navy-bright)" : "var(--line)", borderWidth: active ? 2 : 1,
      background: active ? "var(--navy-tint)" : "var(--card)", transition: "transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.borderColor = "var(--navy-bright)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; if (!active) e.currentTarget.style.borderColor = "var(--line)"; }}>
      <div style={{ width: 46, height: 46, borderRadius: "var(--radius)", display: "grid", placeItems: "center", background: "var(--card)", border: "1px solid var(--line)", marginBottom: 16 }}>
        <Icon name={meta.icon} size={22} color="var(--navy)" />
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.35rem", color: "var(--ink)" }}>{meta.title}</div>
      <div style={{ fontSize: "0.9rem", color: "var(--ink-soft)", lineHeight: 1.5, marginTop: 6 }}>{meta.desc}</div>
      <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.76rem", fontWeight: 600, whiteSpace: "nowrap", color: "var(--amber-deep)", background: "var(--amber-tint)", padding: "5px 11px", borderRadius: "var(--radius-pill)" }}>
        {meta.note}
      </div>
    </button>
  );
}

const DIFFICULTY = {
  legacy: { label: "Legacy", tag: "Legacy bank", desc: "Questions from previous years which may still be applicable." },
  hard:   { label: "New!", tag: "New", desc: "New questions written and produced specifically for this year's ILOs.", labelColor: "#000000" },
};

// The New bank only offers Anatomy and Physiology; Legacy keeps all subdivisions.
const NEW_BANK_SUBS = ["Anatomy", "Physiology & Biochem"];
function subsFor(theme, difficulty) {
  return difficulty === "hard" ? theme.subs.filter((s) => NEW_BANK_SUBS.includes(s)) : theme.subs;
}

function DifficultyToggle({ value, onChange, counts }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
      {["legacy", "hard"].map((d) => {
        const meta = DIFFICULTY[d];
        const on = value === d;
        return (
          <button key={d} onClick={() => onChange(d)} style={{
            textAlign: "left", padding: "14px 16px", borderRadius: "var(--radius)", cursor: "pointer",
            border: `1.5px solid ${on ? "var(--navy-bright)" : "var(--line)"}`,
            background: on ? "var(--navy-tint)" : "var(--card)", transition: "all 0.15s ease",
            display: "flex", flexDirection: "column", gap: 5,
          }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.02rem", lineHeight: 1.15, color: meta.labelColor || (on ? "var(--navy)" : "var(--ink)") }}>{meta.label}</span>
            <span style={{ fontSize: "0.78rem", color: "var(--ink-soft)", lineHeight: 1.4 }}>{meta.desc}</span>
            <span style={{ marginTop: 2, fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.04em", color: on ? "var(--navy)" : "var(--ink-faint)" }}>{counts[d]} questions</span>
          </button>
        );
      })}
    </div>
  );
}

function StepShell({ eyebrow, title, subtitle, children }) {
  return (
    <div className="fade-up" style={{ width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        {eyebrow && <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber-deep)", marginBottom: 12 }}>{eyebrow}</div>}
        <h1 style={{ fontSize: "2.3rem", lineHeight: 1.1, color: "var(--ink)" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: "1.02rem", color: "var(--ink-soft)", marginTop: 10, maxWidth: 540, marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function SetupScreen({ config, setConfig, available, onStart, onHome, onCalendar, onResources }) {
  const [stage, setStage] = React.useState(0);
  const [open, setOpen] = React.useState({});
  const themes = themesForYear(config.year);
  const yearObj = YEARS.find((y) => y.id === config.year);
  const lengths = [5, 10, "All"];
  const finalCount = config.length === "All" ? available : Math.min(available, config.length);

  const fullThemes = themes.filter((t) => subsFor(t, config.difficulty).every((s) => (config.selected[t.id] || []).includes(s))).length;
  const anyThemes = themes.filter((t) => (config.selected[t.id] || []).length > 0).length;
  const allSelected = themes.length > 0 && fullThemes === themes.length;

  const steps = [
    { key: "year", label: "Year", value: `Year ${config.year}` },
    { key: "theme", label: "Themes", value: allSelected ? `All ${themes.length}` : `${anyThemes} selected` },
    { key: "mode", label: "Mode", value: config.mode === "practice" ? "Practice" : "Exam" },
    { key: "length", label: "Length", value: config.length === "All" ? "All Qs" : `${config.length} Qs` },
  ];

  function pickYear(id) {
    if (YEARS.find((y) => y.id === id).locked) return;
    setConfig((c) => ({ ...c, year: id, selected: defaultSelection(id) }));
    setStage(1);
  }
  function toggleTheme(t) {
    setConfig((c) => {
      const subs = subsFor(t, c.difficulty);
      const cur = c.selected[t.id] || [];
      const full = subs.every((s) => cur.includes(s));
      return { ...c, selected: { ...c.selected, [t.id]: full ? [] : [...subs] } };
    });
  }
  function toggleSub(t, sub) {
    setConfig((c) => {
      const cur = c.selected[t.id] || [];
      const has = cur.includes(sub);
      return { ...c, selected: { ...c.selected, [t.id]: has ? cur.filter((x) => x !== sub) : [...cur, sub] } };
    });
  }
  function selectAll(on) {
    setConfig((c) => {
      const next = {};
      themes.forEach((t) => { next[t.id] = on ? [...subsFor(t, c.difficulty)] : []; });
      return { ...c, selected: next };
    });
  }
  function pickMode(m) { setConfig((c) => ({ ...c, mode: m })); setStage(3); }
  function pickDifficulty(d) {
    // Keep which themes are selected, but reset each to the subs the chosen bank offers.
    setConfig((c) => ({ ...c, difficulty: d, selected: Object.fromEntries(themes.map((t) => [t.id, (c.selected[t.id] || []).length ? [...subsFor(t, d)] : []])) }));
  }
  const diffCounts = {
    legacy: QUESTIONS.filter((q) => q.year === config.year && q.difficulty === "legacy").length,
    hard: QUESTIONS.filter((q) => q.year === config.year && q.difficulty === "hard").length,
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNav active="bank" onHome={onHome} onCalendar={onCalendar} onResources={onResources} />
      <div style={{ position: "relative", flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div className="geo-bg" style={{ opacity: 0.04 }} />
        <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", maxWidth: 880, width: "100%", margin: "0 auto", padding: "40px 28px 56px" }}>
          <Stepper stage={stage} setStage={setStage} steps={steps} />

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: stage === 1 ? "flex-start" : "center" }}>
            {/* STEP 1 — YEAR */}
            {stage === 0 && (
              <StepShell eyebrow="ISOCMEDED Question Bank" title="Which year are you in?"
                subtitle="Pick a year to see its themes.">
                <div key="year" className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {YEARS.map((y) => (
                    <YearTile key={y.id} year={y} selected={config.year === y.id}
                      count={QUESTIONS.filter((q) => q.year === y.id).length} onClick={() => pickYear(y.id)} />
                  ))}
                </div>
              </StepShell>
            )}

            {/* STEP 2 — THEMES */}
            {stage === 1 && (
              <StepShell title="Choose your themes"
                subtitle={`${yearObj.label} runs across ${themes.length} themes. Pick a whole theme, or open one to choose Physiology or Anatomy.`}>
                <div key="theme" className="fade-up" style={{ maxWidth: 640, margin: "0 auto", width: "100%" }}>
                  <DifficultyToggle value={config.difficulty} onChange={pickDifficulty} counts={diffCounts} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.86rem", color: "var(--ink-soft)" }}>
                      <strong style={{ color: "var(--navy)" }}>{anyThemes}</strong> of {themes.length} themes · <strong style={{ color: "var(--navy)" }}>{available}</strong> questions
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => selectAll(true)} style={pillBtn(allSelected)}>Select all</button>
                      <button onClick={() => selectAll(false)} style={pillBtn(false)}>Clear</button>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {themes.map((t) => (
                      <ThemeRow key={t.id} theme={t} selectedSubs={config.selected[t.id] || []} open={!!open[t.id]} difficulty={config.difficulty}
                        onToggleTheme={() => toggleTheme(t)} onToggleSub={(s) => toggleSub(t, s)}
                        onToggleOpen={() => setOpen((o) => ({ ...o, [t.id]: !o[t.id] }))} />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                    <button className="btn btn-primary" style={{ fontSize: "1rem", padding: "0.85rem 1.8rem" }} disabled={available === 0} onClick={() => setStage(2)}>
                      Continue <Icon name="arrowRight" size={17} color="currentColor" />
                    </button>
                  </div>
                </div>
              </StepShell>
            )}

            {/* STEP 3 — MODE */}
            {stage === 2 && (
              <StepShell title="How do you want to revise?" subtitle="You can switch between modes any time. Your progress is per session.">
                <div key="mode" className="fade-up" style={{ display: "flex", gap: 18, flexWrap: "wrap", maxWidth: 660, margin: "0 auto" }}>
                  <ModeCard mode="practice" active={config.mode === "practice"} onClick={() => pickMode("practice")} />
                  <ModeCard mode="exam" active={config.mode === "exam"} onClick={() => pickMode("exam")} />
                </div>
              </StepShell>
            )}

            {/* STEP 4 — LENGTH */}
            {stage === 3 && (
              <StepShell title="How many questions?" subtitle={`${available} questions match your selection. Pick a length and you're set.`}>
                <div key="length" className="fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
                  <div style={{ display: "inline-flex", gap: 6, padding: 6, background: "var(--navy-tint)", borderRadius: "var(--radius-pill)" }}>
                    {lengths.map((l) => {
                      const on = String(config.length) === String(l);
                      const disabled = l !== "All" && l > available;
                      return (
                        <button key={l} onClick={() => !disabled && setConfig((c) => ({ ...c, length: l }))} disabled={disabled} style={{
                          padding: "11px 28px", borderRadius: "var(--radius-pill)", fontWeight: 700, fontSize: "0.98rem", whiteSpace: "nowrap",
                          border: "none", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.15s ease",
                          background: on ? "var(--card)" : "transparent", color: on ? "var(--navy)" : disabled ? "var(--ink-faint)" : "var(--ink-soft)",
                          boxShadow: on ? "var(--shadow-sm)" : "none", opacity: disabled ? 0.5 : 1,
                        }}>{l === "All" ? "All" : l + " Qs"}</button>
                      );
                    })}
                  </div>
                  <div style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap", width: "100%", maxWidth: 560, padding: "22px 26px", borderRadius: "var(--radius-lg)", background: "var(--navy-deep)" }}>
                    <div className="geo-bg" style={{ opacity: 0.08 }} />
                    <div style={{ position: "relative", minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.08em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>Your session</div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#fff", fontWeight: 600, marginTop: 4, whiteSpace: "nowrap" }}>
                        {yearObj.label} · {config.mode === "practice" ? "Practice" : "Exam"}
                      </div>
                      <div style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.88rem", marginTop: 3 }}>
                        {finalCount} questions · {DIFFICULTY[config.difficulty].tag} · {allSelected ? "all themes" : `${anyThemes} themes`}
                      </div>
                    </div>
                    <button className="btn btn-amber" style={{ position: "relative", fontSize: "1.02rem", padding: "0.9rem 1.8rem" }} onClick={onStart} disabled={available === 0}>
                      Start <Icon name="arrowRight" size={18} color="currentColor" />
                    </button>
                  </div>
                </div>
              </StepShell>
            )}
          </div>

          {stage > 0 && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 36 }}>
              <button className="btn btn-ghost" onClick={() => setStage((s) => s - 1)}>
                <Icon name="arrowLeft" size={16} color="currentColor" /> Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function pillBtn(active) {
  return {
    padding: "7px 14px", borderRadius: "var(--radius-pill)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
    border: `1.5px solid ${active ? "var(--navy-bright)" : "var(--line)"}`,
    background: active ? "var(--navy-tint)" : "var(--card)", color: active ? "var(--navy)" : "var(--ink-soft)",
  };
}

Object.assign(window, { SetupScreen });
