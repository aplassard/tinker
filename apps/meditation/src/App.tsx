import { useState, useEffect, useRef } from "react";
import BreathingCircle from "./components/BreathingCircle";
import Controls from "./components/Controls";
import DurationSelector from "./components/DurationSelector";
import Timer from "./components/Timer";
import { useBreathingTimer } from "./hooks/useBreathingTimer";
import { useCompletionChime } from "./hooks/useCompletionChime";

function App() {
  const [duration, setDuration] = useState(5);
  const timer = useBreathingTimer(duration);
  const playChime = useCompletionChime();
  const prevStateRef = useRef(timer.sessionState);

  // Play chime when session completes
  useEffect(() => {
    if (prevStateRef.current !== "complete" && timer.sessionState === "complete") {
      playChime();
    }
    prevStateRef.current = timer.sessionState;
  }, [timer.sessionState, playChime]);

  const isActive = timer.sessionState === "running" || timer.sessionState === "paused";

  return (
    <div className="flex min-h-screen select-none flex-col items-center justify-center gap-10 bg-slate-900 px-4">
      {/* Duration selector - hidden during active session */}
      <div className={`transition-opacity duration-500 ${isActive ? "pointer-events-none opacity-0" : "opacity-100"}`}>
        <DurationSelector
          selected={duration}
          onChange={setDuration}
          disabled={isActive}
        />
      </div>

      {/* Breathing circle */}
      <BreathingCircle
        phase={timer.phase}
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
