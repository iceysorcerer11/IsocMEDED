// app-calendar.jsx — Academic Calendar: month / year / agenda views (read-only).
// Events come from the Google Sheet configured in app-calendar-data.jsx
// (SHEET_CSV_URL). With no link set, the built-in example events are shown.

// ── Event pill (inside a day cell) ──
function EventPill({ event, onClick, compact }) {
  const meta = YEAR_META[event.year];
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(event); }}
      title={`${event.title} · ${fmtTimeRange(event.start, event.end)}`}
      style={{
        display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
        padding: compact ? "1px 5px" : "3px 7px", borderRadius: 6,
        background: meta.tint, borderLeft: `3px solid ${meta.color}`,
        fontSize: compact ? "0.64rem" : "0.72rem", lineHeight: 1.25,
        color: meta.deep, fontWeight: 600, overflow: "hidden",
        whiteSpace: "nowrap", textOverflow: "ellipsis",
      }}>
      {!compact && event.start && (
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, opacity: 0.85, fontSize: "0.66rem" }}>
          {fmtTime(event.start)}
        </span>
      )}
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{event.title}</span>
    </div>
  );
}

// ── Month grid view ──
function MonthView({ monthIdx, events, onEventClick }) {
  const { y, m } = ACADEMIC_MONTHS[monthIdx];
  const weeks = buildMonthGrid(y, m);
  const byDate = {};
  events.forEach((e) => { (byDate[e.date] = byDate[e.date] || []).push(e); });
  Object.values(byDate).forEach((list) => list.sort((a, b) => (a.start || "").localeCompare(b.start || "")));

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      {/* weekday header */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid var(--line)" }}>
        {WEEKDAYS.map((d, i) => (
          <div key={d} style={{
            padding: "11px 0", textAlign: "center", fontFamily: "var(--font-mono)",
            fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase",
            color: i >= 5 ? "var(--ink-faint)" : "var(--ink-soft)", fontWeight: 600,
            background: i >= 5 ? "var(--navy-tint)" : "transparent",
          }}>{d}</div>
        ))}
      </div>
      {/* weeks */}
      {weeks.map((week, wi) => (
        <div key={wi} style={{
          display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
          borderBottom: wi < weeks.length - 1 ? "1px solid var(--line-soft)" : "none",
        }}>
          {week.map((cell, ci) => {
            const ds = dateToStr(cell.date);
            const dayEvents = byDate[ds] || [];
            const weekend = ci >= 5;
            return (
              <div key={ci}
                style={{
                  minHeight: 116, padding: "6px 7px 8px", position: "relative",
                  borderRight: ci < 6 ? "1px solid var(--line-soft)" : "none",
                  background: !cell.inMonth ? "var(--bg)" : weekend ? "color-mix(in oklab, var(--navy-tint) 45%, transparent)" : "var(--card)",
                }}>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 600,
                  color: cell.inMonth ? "var(--ink)" : "var(--ink-faint)", opacity: cell.inMonth ? 1 : 0.5,
                  marginBottom: 4,
                }}>{cell.date.getDate()}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {dayEvents.slice(0, 3).map((e) => (
                    <EventPill key={e.id} event={e} onClick={onEventClick} />
                  ))}
                  {dayEvents.length > 3 && (
                    <div style={{ fontSize: "0.66rem", fontWeight: 600, color: "var(--ink-faint)", paddingLeft: 2 }}>
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Year-at-a-glance: mini months ──
function MiniMonth({ monthIdx, events, onOpen }) {
  const { y, m } = ACADEMIC_MONTHS[monthIdx];
  const weeks = buildMonthGrid(y, m);
  const byDate = {};
  events.forEach((e) => { (byDate[e.date] = byDate[e.date] || []).push(e); });

  return (
    <div className="card" onClick={() => onOpen(monthIdx)}
      style={{ padding: 16, cursor: "pointer", transition: "transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.borderColor = "var(--navy-bright)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.borderColor = "var(--line)"; }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 600, color: "var(--ink)" }}>
          {MONTH_NAMES[m]}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "var(--ink-faint)" }}>{y}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
        {WEEKDAYS.map((d) => (
          <div key={d} style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.56rem", color: "var(--ink-faint)", paddingBottom: 3 }}>{d[0]}</div>
        ))}
        {weeks.flat().map((cell, i) => {
          const ds = dateToStr(cell.date);
          const evs = byDate[ds] || [];
          const years = [...new Set(evs.map((e) => e.year))];
          return (
            <div key={i} style={{ position: "relative", aspectRatio: "1", display: "grid", placeItems: "center" }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.62rem",
                color: cell.inMonth ? (evs.length ? "var(--ink)" : "var(--ink-soft)") : "transparent",
                fontWeight: evs.length ? 700 : 400,
              }}>{cell.date.getDate()}</span>
              {evs.length > 0 && (
                <div style={{ position: "absolute", bottom: 1, display: "flex", gap: 1.5 }}>
                  {years.map((yr) => (
                    <span key={yr} style={{ width: 4, height: 4, borderRadius: 999, background: YEAR_META[yr].color }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function YearView({ events, onOpen }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(248px, 1fr))", gap: 18 }}>
      {ACADEMIC_MONTHS.map((_, i) => (
        <MiniMonth key={i} monthIdx={i} events={events} onOpen={onOpen} />
      ))}
    </div>
  );
}

// ── Agenda (chronological list) ──
function AgendaView({ events, onEventClick }) {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date) || (a.start || "").localeCompare(b.start || ""));
  const groups = [];
  sorted.forEach((e) => {
    const key = e.date.slice(0, 7);
    let g = groups.find((x) => x.key === key);
    if (!g) { g = { key, items: [] }; groups.push(g); }
    g.items.push(e);
  });
  if (!sorted.length) {
    return (
      <div className="card" style={{ padding: "48px 24px", textAlign: "center", color: "var(--ink-faint)" }}>
        No events to show yet.
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
      {groups.map((g) => {
        const [yy, mm] = g.key.split("-").map(Number);
        return (
          <div key={g.key}>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 600,
              color: "var(--ink)", marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid var(--line)",
            }}>{MONTH_NAMES[mm - 1]} <span style={{ color: "var(--ink-faint)", fontWeight: 400 }}>{yy}</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {g.items.map((e) => {
                const meta = YEAR_META[e.year];
                const tm = TYPE_META[e.type] || TYPE_META.lecture;
                const [, , dd] = e.date.split("-").map(Number);
                return (
                  <div key={e.id} className="card" onClick={() => onEventClick(e)}
                    style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", cursor: "pointer", borderLeft: `4px solid ${meta.color}` }}
                    onMouseEnter={(ev2) => { ev2.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                    onMouseLeave={(ev2) => { ev2.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}>
                    <div style={{ textAlign: "center", minWidth: 46 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 600, color: "var(--ink)", lineHeight: 1 }}>{dd}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: 3 }}>{fmtLongDate(e.date).split(" ")[0]}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: "0.98rem" }}>{e.title}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 4, fontSize: "0.8rem", color: "var(--ink-soft)" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="clock" size={13} color="var(--ink-faint)" />{fmtTimeRange(e.start, e.end)}</span>
                        {e.location && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="mapPin" size={13} color="var(--ink-faint)" />{e.location}</span>}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--ink-soft)" }}>
                        <Icon name={tm.icon} size={13} color="var(--ink-faint)" />{tm.label}
                      </span>
                      <span className="chip" style={{ background: meta.tint, color: meta.deep }}>{meta.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Read-only event detail popup ──
function DetailRow({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
      <div style={{ width: 34, height: 34, borderRadius: "var(--radius-sm)", background: "var(--navy-tint)", display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Icon name={icon} size={16} color="var(--navy)" />
      </div>
      <span style={{ fontSize: "0.95rem", color: "var(--ink)", fontWeight: 500 }}>{text}</span>
    </div>
  );
}

function EventDetail({ event, onClose }) {
  const meta = YEAR_META[event.year];
  const tm = TYPE_META[event.type] || TYPE_META.lecture;
  const [y, m, d] = event.date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const wd = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dt.getDay()];
  const fullDate = `${wd} ${d} ${MONTH_NAMES[m - 1]} ${y}`;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 60, background: "oklch(0.2 0.03 250 / 0.45)",
      backdropFilter: "blur(3px)", display: "grid", placeItems: "center", padding: 20,
    }}>
      <div onClick={(e) => e.stopPropagation()} className="card fade-up" style={{
        width: "min(460px, 100%)", padding: 0, boxShadow: "var(--shadow-lg)", overflow: "hidden",
      }}>
        <div style={{ height: 6, background: meta.color }} />
        <div style={{ padding: "20px 24px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <h3 style={{ fontSize: "1.4rem", lineHeight: 1.2 }}>{event.title}</h3>
            <button className="btn btn-ghost" style={{ padding: "6px 10px", flexShrink: 0 }} onClick={onClose}>
              <Icon name="x" size={18} color="var(--navy)" />
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <span className="chip" style={{ background: meta.tint, color: meta.deep }}>
              <span style={{ width: 9, height: 9, borderRadius: 999, background: meta.color }} />{meta.label}
            </span>
            <span className="chip"><Icon name={tm.icon} size={13} color="var(--navy)" />{tm.label}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
            <DetailRow icon="calendar" text={fullDate} />
            <DetailRow icon="clock" text={fmtTimeRange(event.start, event.end)} />
            {event.location && <DetailRow icon="mapPin" text={event.location} />}
          </div>
          {event.notes && (
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--line)", fontSize: "0.92rem", color: "var(--ink-soft)", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
              {event.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── View switcher segmented control ──
function ViewSwitch({ view, onChange }) {
  const views = [["month", "Month"], ["year", "Year"], ["agenda", "Agenda"]];
  return (
    <div style={{ display: "inline-flex", padding: 3, gap: 2, background: "var(--navy-tint)", borderRadius: "var(--radius-pill)", border: "1px solid var(--line)" }}>
      {views.map(([id, label]) => {
        const on = view === id;
        return (
          <button key={id} onClick={() => onChange(id)} style={{
            padding: "7px 16px", borderRadius: "var(--radius-pill)", border: "none",
            fontWeight: on ? 700 : 600, fontSize: "0.84rem",
            background: on ? "var(--card)" : "transparent", color: on ? "var(--navy)" : "var(--ink-soft)",
            boxShadow: on ? "var(--shadow-sm)" : "none",
          }}>{label}</button>
        );
      })}
    </div>
  );
}

function CalendarScreen({ onHome, onBank, onResources }) {
  const [events, setEvents] = React.useState(() => (SHEET_CSV_URL ? [] : SEED_EVENTS));
  const [status, setStatus] = React.useState(() => (SHEET_CSV_URL ? "loading" : "seed"));
  const [view, setView] = React.useState("month");
  const [monthIdx, setMonthIdx] = React.useState(0);
  const [filter, setFilter] = React.useState({ 1: true, 2: true, 3: true, 4: true, 5: true });
  const [detail, setDetail] = React.useState(null);

  // Pull events from the published Google Sheet (if configured).
  React.useEffect(() => {
    if (!SHEET_CSV_URL) return;
    let cancelled = false;
    // Cache-bust: unique URL each load defeats the browser's HTTP cache and
    // helps slip past Google's published-CSV edge cache.
    const bust = (SHEET_CSV_URL.includes("?") ? "&" : "?") + "_cb=" + Date.now();
    fetch(SHEET_CSV_URL + bust, { cache: "no-store" })
      .then((r) => { if (!r.ok) throw new Error("bad"); return r.text(); })
      .then((txt) => {
        if (cancelled) return;
        const evs = rowsToEvents(parseCSV(txt));
        setEvents(evs);
        setStatus(evs.length ? "live" : "empty");
      })
      .catch(() => { if (!cancelled) { setEvents(SEED_EVENTS); setStatus("error"); } });
    return () => { cancelled = true; };
  }, []);

  const visible = events.filter((e) => filter[e.year]);
  const cur = ACADEMIC_MONTHS[monthIdx];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNav active="calendar" onHome={onHome} onBank={onBank} onResources={onResources} onCalendar={() => window.scrollTo(0, 0)} />

      <main style={{ flex: 1, maxWidth: "var(--maxw)", width: "100%", margin: "0 auto", padding: "clamp(24px, 4vw, 40px) 28px 64px" }}>
        {/* Title row */}
        <div className="fade-up" style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber-deep)", marginBottom: 8 }}>
            ISOCMEDED · Manchester
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", lineHeight: 1.1, color: "var(--ink)" }}>Academic Calendar</h1>
          <div style={{ fontSize: "1rem", color: "var(--ink-soft)", marginTop: 6 }}>Teaching, mocks &amp; key dates · 2026/27</div>
        </div>

        {/* Controls row */}
        <div className="fade-up" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 20 }}>
          <ViewSwitch view={view} onChange={setView} />

          {/* Year filter / legend */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {[1, 2, 3, 4, 5].map((yr) => {
              const meta = YEAR_META[yr];
              const on = filter[yr];
              return (
                <button key={yr} onClick={() => setFilter((f) => ({ ...f, [yr]: !f[yr] }))} style={{
                  display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 13px", whiteSpace: "nowrap",
                  borderRadius: "var(--radius-pill)", fontWeight: 600, fontSize: "0.82rem",
                  border: `1.5px solid ${on ? meta.color : "var(--line)"}`,
                  background: on ? meta.tint : "var(--card)", color: on ? meta.deep : "var(--ink-faint)",
                  opacity: on ? 1 : 0.6,
                }}>
                  <span style={{ width: 11, height: 11, borderRadius: 999, background: on ? meta.color : "var(--ink-faint)" }} />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Month nav (month view only) */}
        {view === "month" && (
          <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginBottom: 18 }}>
            <button className="btn btn-ghost" style={{ padding: "8px 12px" }} disabled={monthIdx === 0}
              onClick={() => setMonthIdx((i) => Math.max(0, i - 1))}><Icon name="chevronLeft" size={18} color="var(--navy)" /></button>
            <div style={{ minWidth: 220, textAlign: "center" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 600, color: "var(--ink)" }}>{MONTH_NAMES[cur.m]}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", color: "var(--ink-faint)", marginLeft: 10 }}>{cur.y}</span>
            </div>
            <button className="btn btn-ghost" style={{ padding: "8px 12px" }} disabled={monthIdx === ACADEMIC_MONTHS.length - 1}
              onClick={() => setMonthIdx((i) => Math.min(ACADEMIC_MONTHS.length - 1, i + 1))}><Icon name="chevronRight" size={18} color="var(--navy)" /></button>
          </div>
        )}

        {/* Active view */}
        {status === "loading" ? (
          <div className="card" style={{ padding: "56px 24px", textAlign: "center", color: "var(--ink-faint)" }}>Loading calendar…</div>
        ) : (
          <div className="fade-in" key={view + monthIdx}>
            {view === "month" && <MonthView monthIdx={monthIdx} events={visible} onEventClick={setDetail} />}
            {view === "year" && <YearView events={visible} onOpen={(i) => { setMonthIdx(i); setView("month"); window.scrollTo(0, 0); }} />}
            {view === "agenda" && <AgendaView events={visible} onEventClick={setDetail} />}
          </div>
        )}

        {/* Footer key + status */}
        <div className="fade-up" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 18, marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
          {Object.entries(TYPE_META).map(([key, tm]) => (
            <span key={key} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "var(--ink-soft)" }}>
              <Icon name={tm.icon} size={14} color="var(--ink-faint)" />{tm.label}
            </span>
          ))}
          <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--ink-faint)" }}>
            {status === "seed" && "Showing example events"}
            {status === "error" && "Couldn't reach the live calendar, showing examples"}
            {status === "empty" && "No events posted yet"}
            {(status === "live") && "Click an event for full details"}
          </span>
        </div>
      </main>

      {detail && <EventDetail event={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

Object.assign(window, { CalendarScreen });
