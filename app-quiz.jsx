// app-quiz.jsx — the quiz runner (practice + exam modes)

function QuizTopBar({ config, index, total, elapsed, onExit, flaggedCount }) {
  const isExam = config.mode === "exam";
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 20, background: "color-mix(in oklab, var(--card) 90%, transparent)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--line)" }}>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "13px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <button className="btn btn-ghost" style={{ padding: "0.5rem 0.9rem", fontSize: "0.84rem" }} onClick={onExit}>
          <Icon name="arrowLeft" size={15} color="currentColor" /> Exit
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className={`chip ${isExam ? "chip-amber" : ""}`}>
            <Icon name={isExam ? "clock" : "bulb"} size={12} color="currentColor" /> {isExam ? "Exam" : "Practice"}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--ink-soft)", fontWeight: 600 }}>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 92, justifyContent: "flex-end" }}>
          {flaggedCount > 0 && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.78rem", color: "var(--amber-deep)", fontWeight: 600 }}>
              <Icon name="flag" size={13} color="var(--amber-deep)" /> {flaggedCount}
            </span>
          )}
          {isExam && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--ink-soft)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
              {mm}:{ss}
            </span>
          )}
        </div>
      </div>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 12px" }}>
        <ProgressBar value={index + 1} total={total} tone={isExam ? "amber" : "navy"} />
      </div>
    </div>
  );
}

function OptionRow({ option, index, state, disabled, onClick }) {
  // state: idle | selected | correct | wrong | dimmed
  const styleByState = {
    idle:     { bd: "var(--line)", bg: "var(--card)", fg: "var(--ink)" },
    selected: { bd: "var(--navy-bright)", bg: "var(--navy-tint)", fg: "var(--ink)" },
    correct:  { bd: "var(--good)", bg: "var(--good-tint)", fg: "var(--ink)" },
    wrong:    { bd: "var(--bad)", bg: "var(--bad-tint)", fg: "var(--ink)" },
    dimmed:   { bd: "var(--line-soft)", bg: "var(--card)", fg: "var(--ink-faint)" },
  }[state];
  const letterState = state === "selected" ? "selected" : state === "correct" ? "correct" : state === "wrong" ? "wrong" : "idle";
  return (
    <button onClick={onClick} disabled={disabled} className="opt-row" style={{
      display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left",
      padding: "15px 18px", borderRadius: "var(--radius)", border: `1.5px solid ${styleByState.bd}`,
      background: styleByState.bg, color: styleByState.fg, cursor: disabled ? "default" : "pointer",
      transition: "all 0.16s ease", fontSize: "1rem", lineHeight: 1.45,
      boxShadow: state === "selected" ? "var(--shadow-sm)" : "none",
    }}
    onMouseEnter={(e) => { if (!disabled && state === "idle") { e.currentTarget.style.borderColor = "var(--navy-bright)"; e.currentTarget.style.background = "var(--navy-tint)"; } }}
    onMouseLeave={(e) => { if (!disabled && state === "idle") { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.background = "var(--card)"; } }}>
      <OptionLetter index={index} state={letterState} />
      <span style={{ flex: 1 }}>{option}</span>
      {state === "correct" && <Icon name="check" size={20} color="var(--good-deep)" />}
      {state === "wrong" && <Icon name="x" size={20} color="var(--bad-deep)" />}
    </button>
  );
}

function ExplanationPanel({ q, correct }) {
  return (
    <div className="fade-up" style={{
      marginTop: 18, borderRadius: "var(--radius-lg)", overflow: "hidden",
      border: `1px solid ${correct ? "var(--good)" : "var(--bad)"}`,
    }}>
      <div style={{
        padding: "11px 18px", display: "flex", alignItems: "center", gap: 9,
        background: correct ? "var(--good-tint)" : "var(--bad-tint)",
        borderBottom: `1px solid ${correct ? "var(--good)" : "var(--bad)"}`,
      }}>
        <Icon name={correct ? "check" : "x"} size={18} color={correct ? "var(--good-deep)" : "var(--bad-deep)"} />
        <span style={{ fontWeight: 700, whiteSpace: "nowrap", color: correct ? "var(--good-deep)" : "var(--bad-deep)" }}>
          {correct ? "Correct" : "Not quite"}
        </span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--ink-faint)" }}>
          Answer: {String.fromCharCode(65 + q.correct)}
        </span>
      </div>
      <div style={{ padding: "18px", background: "var(--card)" }}>
        <p style={{ margin: 0, fontSize: "0.96rem", lineHeight: 1.6, color: "var(--ink-soft)" }}>{q.explanation}</p>
        {q.keyPoint && (
        <div style={{
          marginTop: 16, padding: "13px 15px", borderRadius: "var(--radius)", background: "var(--amber-tint)",
          display: "flex", gap: 11, alignItems: "flex-start",
        }}>
          <div style={{ marginTop: 1 }}><Icon name="bulb" size={17} color="var(--amber-deep)" /></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.78rem", color: "var(--amber-deep)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Key learning point</div>
            <div style={{ fontSize: "0.92rem", color: "var(--ink)", marginTop: 3, lineHeight: 1.5 }}>{q.keyPoint}</div>
          </div>
        </div>
        )}
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 7, fontSize: "0.78rem", color: "var(--ink-faint)" }}>
          <Icon name="book" size={14} color="var(--ink-faint)" /> {q.source}
        </div>
      </div>
    </div>
  );
}

function QuizScreen({ config, questions, onFinish, onExit }) {
  const isExam = config.mode === "exam";
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState(() => questions.map(() => null));
  const [flags, setFlags] = React.useState(() => questions.map(() => false));
  const [revealed, setRevealed] = React.useState(() => questions.map(() => false)); // practice mode
  const [elapsed, setElapsed] = React.useState(0);

  React.useEffect(() => {
    if (!isExam) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [isExam]);

  const q = questions[index];
  const selected = answers[index];
  const isRevealed = revealed[index];

  function choose(i) {
    if (!isExam && isRevealed) return; // locked after reveal in practice
    setAnswers((a) => { const n = [...a]; n[index] = i; return n; });
    if (!isExam) {
      setRevealed((r) => { const n = [...r]; n[index] = true; return n; });
    }
  }
  function toggleFlag() {
    setFlags((f) => { const n = [...f]; n[index] = !n[index]; return n; });
  }
  function go(d) { setIndex((i) => Math.max(0, Math.min(questions.length - 1, i + d))); }

  const answeredCount = answers.filter((a) => a !== null).length;
  const isLast = index === questions.length - 1;

  function optionState(i) {
    if (isExam) return selected === i ? "selected" : "idle";
    if (!isRevealed) return selected === i ? "selected" : "idle";
    if (i === q.correct) return "correct";
    if (i === selected) return "wrong";
    return "dimmed";
  }

  return (
    <div>
      <QuizTopBar config={config} index={index} total={questions.length} elapsed={elapsed}
        onExit={onExit} flaggedCount={flags.filter(Boolean).length} />

      <main style={{ maxWidth: 880, margin: "0 auto", padding: "28px 24px 40px" }}>
        <div key={index} className="fade-in">
          {/* tags */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <span className="chip chip-mono">{q.theme}</span>
            <span className="chip chip-mono" style={{ background: "var(--amber-tint)", color: "var(--amber-deep)" }}>{q.subsection}</span>
            {q.difficulty === "hard" && (
              <span className="chip chip-mono" style={{ background: "var(--navy)", color: "#fff" }}>Hard · Application</span>
            )}
            <button onClick={toggleFlag} style={{
              marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6,
              background: flags[index] ? "var(--amber-tint)" : "transparent",
              border: `1px solid ${flags[index] ? "var(--amber)" : "var(--line)"}`,
              color: flags[index] ? "var(--amber-deep)" : "var(--ink-soft)",
              borderRadius: "var(--radius-pill)", padding: "6px 12px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
            }}>
              <Icon name="flag" size={14} color="currentColor" /> {flags[index] ? "Flagged" : "Flag"}
            </button>
          </div>

          {/* stem */}
          <h2 style={{ fontSize: "1.5rem", lineHeight: 1.34, color: "var(--ink)", marginBottom: 22, textWrap: "pretty", fontWeight: 500 }}>
            {q.stem}
          </h2>
          {q.image && (
            <div style={{ marginBottom: 22 }}>
              <img src={q.image} alt="Question figure" style={{ maxWidth: "100%", maxHeight: 420, borderRadius: "var(--radius)", border: "1px solid var(--line)", display: "block" }} />
            </div>
          )}

          {/* options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {q.options.map((opt, i) => (
              <OptionRow key={i} option={opt} index={i} state={optionState(i)}
                disabled={!isExam && isRevealed} onClick={() => choose(i)} />
            ))}
          </div>

          {/* practice explanation */}
          {!isExam && isRevealed && <ExplanationPanel q={q} correct={selected === q.correct} />}
        </div>
      </main>

      {/* footer nav */}
      <div style={{ position: "sticky", bottom: 0, background: "color-mix(in oklab, var(--card) 92%, transparent)", backdropFilter: "blur(8px)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "13px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => go(-1)} disabled={index === 0}>
            <Icon name="arrowLeft" size={16} color="currentColor" /> Previous
          </button>

          {/* dot palette */}
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "center", maxWidth: 360 }}>
            {questions.map((_, i) => {
              const done = answers[i] !== null;
              const isCur = i === index;
              let bg = "var(--navy-tint2)";
              if (done) bg = "var(--navy-bright)";
              if (flags[i]) bg = "var(--amber)";
              return (
                <button key={i} onClick={() => setIndex(i)} title={`Question ${i + 1}`} style={{
                  width: isCur ? 26 : 10, height: 10, borderRadius: 999, border: "none", padding: 0,
                  background: bg, cursor: "pointer", transition: "all 0.2s ease",
                  outline: isCur ? "2px solid var(--navy)" : "none", outlineOffset: 2,
                }} />
              );
            })}
          </div>

          {isExam ? (
            isLast ? (
              <button className="btn btn-primary" onClick={() => onFinish(answers, questions, elapsed)}>
                Submit exam <Icon name="check" size={16} color="currentColor" />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => go(1)}>
                Next <Icon name="arrowRight" size={16} color="currentColor" />
              </button>
            )
          ) : (
            isLast ? (
              <button className="btn btn-primary" onClick={() => onFinish(answers, questions, elapsed)} disabled={!isRevealed}>
                See results <Icon name="arrowRight" size={16} color="currentColor" />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => go(1)} disabled={!isRevealed}>
                Next <Icon name="arrowRight" size={16} color="currentColor" />
              </button>
            )
          )}
        </div>
        {isExam && (
          <div style={{ textAlign: "center", paddingBottom: 8, fontSize: "0.74rem", color: "var(--ink-faint)" }}>
            {answeredCount} of {questions.length} answered · explanations revealed after you submit
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { QuizScreen });
