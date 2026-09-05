// app-results.jsx — results summary + per-question review

function ResultsScreen({ result, onRestart, onRetryIncorrect, onHome }) {
  const { answers, questions, elapsed, mode } = result;
  const correctCount = questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
  const pct = (correctCount / questions.length) * 100;
  const incorrect = questions.filter((q, i) => answers[i] !== q.correct);

  // per-theme breakdown
  const bySubject = {};
  questions.forEach((q, i) => {
    if (!bySubject[q.theme]) bySubject[q.theme] = { correct: 0, total: 0 };
    bySubject[q.theme].total += 1;
    if (answers[i] === q.correct) bySubject[q.theme].correct += 1;
  });

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  const verdict = pct >= 80 ? "Excellent work." : pct >= 60 ? "Solid effort." : pct >= 40 ? "Getting there." : "Worth a review.";

  const [openIdx, setOpenIdx] = React.useState(null);

  return (
    <div>
      <TopNav active="bank" />
      <main style={{ maxWidth: 880, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* summary hero */}
        <div className="card fade-up" style={{ padding: 0, overflow: "hidden", marginBottom: 28 }}>
          <div style={{ position: "relative", background: "var(--navy-deep)", padding: "32px 32px", display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
            <div className="geo-bg" style={{ opacity: 0.08 }} />
            <div style={{ position: "relative", background: "var(--card)", borderRadius: "var(--radius-lg)", padding: 10 }}>
              <ScoreRing pct={pct} />
            </div>
            <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
              <div className="chip chip-amber" style={{ marginBottom: 10 }}>
                {mode === "exam" ? "Exam complete" : "Practice complete"}
              </div>
              <h1 style={{ fontSize: "2.2rem", color: "#fff", lineHeight: 1.1 }}>{verdict}</h1>
              <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "1.02rem", marginTop: 8 }}>
                You scored <strong style={{ color: "#fff" }}>{correctCount} / {questions.length}</strong>
                {mode === "exam" && <> in {mm}:{ss}</>}.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
                <button className="btn btn-amber" onClick={onRestart}>
                  <Icon name="restart" size={16} color="currentColor" /> New session
                </button>
                {incorrect.length > 0 && (
                  <button className="btn btn-ghost" style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)", color: "#fff" }} onClick={onRetryIncorrect}>
                    Retry {incorrect.length} incorrect
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* subject breakdown */}
          <div style={{ padding: "22px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 18 }}>
            {Object.entries(bySubject).map(([s, d]) => {
              const p = (d.correct / d.total) * 100;
              return (
                <div key={s}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--ink)" }}>{s}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--ink-faint)" }}>{d.correct}/{d.total}</span>
                  </div>
                  <div style={{ height: 6, background: "var(--navy-tint2)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p}%`, borderRadius: 999, background: p >= 70 ? "var(--good)" : p >= 50 ? "var(--amber)" : "var(--bad)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* review */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <h2 style={{ fontSize: "1.4rem" }}>Review &amp; explanations</h2>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--ink-faint)" }}>{questions.length} questions</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {questions.map((q, i) => {
            const userAns = answers[i];
            const correct = userAns === q.correct;
            const open = openIdx === i;
            return (
              <div key={q.id} className="card" style={{ overflow: "hidden", borderColor: correct ? "var(--good)" : "var(--bad)", borderLeftWidth: 4 }}>
                <button onClick={() => setOpenIdx(open ? null : i)} style={{
                  display: "flex", alignItems: "flex-start", gap: 13, width: "100%", textAlign: "left",
                  padding: "16px 18px", background: "transparent", border: "none", cursor: "pointer",
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 999, flexShrink: 0, display: "grid", placeItems: "center",
                    background: correct ? "var(--good-tint)" : "var(--bad-tint)",
                  }}>
                    <Icon name={correct ? "check" : "x"} size={15} color={correct ? "var(--good-deep)" : "var(--bad-deep)"} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--ink-faint)" }}>Q{i + 1}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--navy)" }}>{q.theme} · {q.subsection}</span>
                    </div>
                    <div style={{ fontSize: "0.98rem", color: "var(--ink)", lineHeight: 1.4, fontWeight: 500 }}>{q.stem}</div>
                  </div>
                  <div style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s ease", marginTop: 2 }}>
                    <Icon name="arrowRight" size={16} color="var(--ink-faint)" />
                  </div>
                </button>
                {open && (
                  <div className="fade-in" style={{ padding: "0 18px 18px", borderTop: "1px solid var(--line-soft)", marginTop: 2 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "16px 0" }}>
                      {q.options.map((opt, oi) => {
                        const isCorrect = oi === q.correct;
                        const isUser = oi === userAns;
                        let st = "dimmed";
                        if (isCorrect) st = "correct";
                        else if (isUser) st = "wrong";
                        const cfg = {
                          correct: { bd: "var(--good)", bg: "var(--good-tint)" },
                          wrong: { bd: "var(--bad)", bg: "var(--bad-tint)" },
                          dimmed: { bd: "var(--line-soft)", bg: "var(--card)" },
                        }[st];
                        return (
                          <div key={oi} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 13px", borderRadius: "var(--radius)", border: `1.5px solid ${cfg.bd}`, background: cfg.bg }}>
                            <OptionLetter index={oi} state={st === "dimmed" ? "idle" : st} />
                            <span style={{ flex: 1, fontSize: "0.92rem", color: st === "dimmed" ? "var(--ink-faint)" : "var(--ink)" }}>{opt}</span>
                            {isUser && !isCorrect && <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--bad-deep)", fontFamily: "var(--font-mono)" }}>YOUR ANSWER</span>}
                            {isCorrect && <Icon name="check" size={17} color="var(--good-deep)" />}
                          </div>
                        );
                      })}
                    </div>
                    <p style={{ fontSize: "0.94rem", lineHeight: 1.6, color: "var(--ink-soft)", margin: "0 0 14px" }}>{q.explanation}</p>
                    {q.keyPoint && (
                    <div style={{ padding: "12px 14px", borderRadius: "var(--radius)", background: "var(--amber-tint)", display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ marginTop: 1 }}><Icon name="bulb" size={16} color="var(--amber-deep)" /></div>
                      <div style={{ fontSize: "0.9rem", color: "var(--ink)", lineHeight: 1.5 }}>{q.keyPoint}</div>
                    </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 30 }}>
          <button className="btn btn-primary" onClick={onRestart}>
            <Icon name="home" size={16} color="currentColor" /> Back to question bank
          </button>
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { ResultsScreen });
