// app-main.jsx — root state machine + Tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "radius": 16,
  "accent": "#eebe3f",
  "serifHeadings": true,
  "optionStyle": "lettered"
}/*EDITMODE-END*/;

function buildQuestions(config) {
  let pool = QUESTIONS.filter((q) => q.year === config.year && q.difficulty === config.difficulty && (config.selected[q.themeId] || []).includes(q.subsection));
  // shuffle
  pool = [...pool].sort(() => Math.random() - 0.5);
  if (config.length !== "All") pool = pool.slice(0, config.length);
  return pool;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    window.addEventListener("live-questions", forceUpdate);
    return () => window.removeEventListener("live-questions", forceUpdate);
  }, []);
  const [screen, setScreen] = React.useState("home"); // home | setup | quiz | results
  const [config, setConfig] = React.useState({ year: 1, difficulty: "legacy", selected: defaultSelection(1), mode: "practice", length: 5 });
  const [activeQuestions, setActiveQuestions] = React.useState([]);
  const [result, setResult] = React.useState(null);

  // apply tweaks to :root
  React.useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--radius", t.radius + "px");
    // accent (warm) — derive harmonious deep & tint from the chosen hex
    r.style.setProperty("--amber", t.accent);
    r.style.setProperty("--amber-deep", `color-mix(in oklab, ${t.accent} 72%, oklch(0.2 0.03 60))`);
    r.style.setProperty("--amber-tint", `color-mix(in oklab, ${t.accent} 22%, white)`);
    r.style.setProperty("--font-display", t.serifHeadings ? '"Fraunces", Georgia, serif' : '"Public Sans", system-ui, sans-serif');
  }, [t.radius, t.accent, t.serifHeadings]);

  const available = QUESTIONS.filter((q) => q.year === config.year && q.difficulty === config.difficulty && (config.selected[q.themeId] || []).includes(q.subsection)).length;

  // Pin entrance animations visible shortly after each screen mounts, so content
  // can never stay hidden if the compositor froze the animation timeline.
  React.useEffect(() => {
    document.body.classList.remove("anim-done");
    const id = setTimeout(() => document.body.classList.add("anim-done"), 700);
    return () => clearTimeout(id);
  }, [screen]);

  function start() {
    const qs = buildQuestions(config);
    if (!qs.length) return;
    setActiveQuestions(qs);
    setScreen("quiz");
    window.scrollTo(0, 0);
  }

  function finish(answers, questions, elapsed) {
    setResult({ answers, questions, elapsed, mode: config.mode });
    setScreen("results");
    window.scrollTo(0, 0);
  }

  function retryIncorrect() {
    const wrong = result.questions.filter((q, i) => result.answers[i] !== q.correct);
    setActiveQuestions([...wrong].sort(() => Math.random() - 0.5));
    setScreen("quiz");
    window.scrollTo(0, 0);
  }

  function backToSetup() {
    setScreen("setup");
    window.scrollTo(0, 0);
  }

  function goHome() {
    setScreen("home");
    window.scrollTo(0, 0);
  }

  function goCalendar() {
    setScreen("calendar");
    window.scrollTo(0, 0);
  }

  function goResources() {
    setScreen("resources");
    window.scrollTo(0, 0);
  }  function goBank() {
    setScreen("setup");
    window.scrollTo(0, 0);
  }
  return (
    <React.Fragment>
      {screen === "home" && (
        <HomeScreen onBank={goBank} onCalendar={goCalendar} onResources={goResources} />
      )}
      {screen === "setup" && (
        <SetupScreen config={config} setConfig={setConfig} available={available} onStart={start} onHome={goHome} onCalendar={goCalendar} onResources={goResources} />
      )}
      {screen === "quiz" && (
        <QuizScreen config={config} questions={activeQuestions} optionStyle={t.optionStyle}
          onFinish={finish} onExit={backToSetup} />
      )}
      {screen === "results" && result && (
        <ResultsScreen result={result} onRestart={backToSetup} onRetryIncorrect={retryIncorrect} onHome={backToSetup} />
      )}
      {screen === "calendar" && (
        <CalendarScreen onHome={goHome} onBank={goBank} onResources={goResources} />
      )}
      {screen === "resources" && (
        <ResourcesScreen onHome={goHome} onBank={goBank} onCalendar={goCalendar} />
      )}

      <TweaksPanel>
        <TweakSection label="Shape & feel" />
        <TweakSlider label="Corner roundness" value={t.radius} min={0} max={28} step={2} unit="px"
          onChange={(v) => setTweak("radius", v)} />
        <TweakSection label="Colour" />
        <TweakColor label="Warm accent" value={t.accent}
          options={["#eebe3f", "#caa45a", "#c97b53", "#7b94c9"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Typography" />
        <TweakToggle label="Serif headings" value={t.serifHeadings}
          onChange={(v) => setTweak("serifHeadings", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
