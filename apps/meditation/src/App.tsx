import { useState, useEffect, useRef } from "react";
import BreathingCircle from "./components/BreathingCircle";
import Controls from "./components/Controls";
import DurationSelector from "./components/DurationSelector";
import PatternSelector from "./components/PatternSelector";
import StatsView from "./components/StatsView";
import Timer from "./components/Timer";
import { useBreathingTimer } from "./hooks/useBreathingTimer";
import { useCompletionChime } from "./hooks/useCompletionChime";
import { useSessionStorage } from "./hooks/useSessionStorage";
import { PATTERNS } from "./patterns";

function App() {
  const [duration, setDuration] = useState(5);
  const [pattern, setPattern] = useState(PATTERNS[0]);
  const [showStats, setShowStats] = useState(false);
  const timer = useBreathingTimer(duration, pattern);
  const playChime = useCompletionChime();
  const { sessions, recordSession, stats } = useSessionStorage();
  const prevStateRef = useRef(timer.sessionState);

  // Play chime and record session when session completes
  useEffect(() => {
    if (prevStateRef.current !== "complete" && timer.sessionState === "complete") {
      playChime();
      recordSession(duration, pattern.id);
    }
    prevStateRef.current = timer.sessionState;
  }, [timer.sessionState, playChime, recordSession, duration, pattern.id]);

  const isActive = timer.sessionState === "running" || timer.sessionState === "paused";

  if (showStats) {
    return <StatsView sessions={sessions} stats={stats} onClose={() => setShowStats(false)} />;
  }

  return (
    <div className="flex min-h-screen select-none flex-col items-center justify-center gap-8 bg-slate-900 px-4">
      {/* Stats button */}
      <button
        onClick={() => setShowStats(true)}
        className={`absolute top-4 right-4 text-xs tracking-widest text-slate-500 uppercase transition-opacity hover:text-slate-300 ${isActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        Stats
      </button>

      {/* Pattern and duration selectors - hidden during active session */}
      <div className={`flex flex-col items-center gap-6 transition-opacity duration-500 ${isActive ? "pointer-events-none opacity-0" : "opacity-100"}`}>
        <PatternSelector
          selected={pattern}
          onChange={(p) => { setPattern(p); timer.reset(); }}
          disabled={isActive}
        />
        <DurationSelector
          selected={duration}
          onChange={setDuration}
          disabled={isActive}
        />
      </div>

      {/* Breathing circle */}
      <BreathingCircle
        phase={timer.phase}
        prevPhase={timer.prevPhase}
        phaseProgress={timer.phaseProgress}
        isActive={timer.sessionState === "running"}
      />

      {/* Timer display */}
      <Timer elapsedMs={timer.elapsedMs} totalMs={timer.totalMs} />

      {/* Session complete message */}
      {timer.sessionState === "complete" && (
        <p className="animate-pulse text-sm tracking-widest text-sky-300/70">
          session complete
        </p>
      )}

      {/* Controls */}
      <Controls
        sessionState={timer.sessionState}
        onStart={timer.start}
        onPause={timer.pause}
        onReset={timer.reset}
      />
    </div>
  );
}

export default App;
