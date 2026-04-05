import { useState, useRef, useCallback, useEffect } from "react";

export type BreathPhase = "inhale" | "hold" | "exhale";
export type SessionState = "idle" | "running" | "paused" | "complete";

const PHASE_DURATION = 4000; // 4 seconds per phase
const PHASES: BreathPhase[] = ["inhale", "hold", "exhale"];

export function useBreathingTimer(durationMinutes: number) {
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  const animFrameRef = useRef<number>(0);
  const phaseStartRef = useRef(0);
  const phaseIndexRef = useRef(0);
  const sessionStartRef = useRef(0);
  const pausedElapsedRef = useRef(0);
  const pausedPhaseElapsedRef = useRef(0);

  const totalMs = durationMinutes * 60 * 1000;

  const tick = useCallback(
    (now: number) => {
      const sessionElapsed = pausedElapsedRef.current + (now - sessionStartRef.current);
      const phaseElapsed = pausedPhaseElapsedRef.current + (now - phaseStartRef.current);

      if (sessionElapsed >= totalMs) {
        setSessionState("complete");
        setElapsedMs(totalMs);
        setPhaseProgress(0);
        return;
      }

      setElapsedMs(sessionElapsed);

      if (phaseElapsed >= PHASE_DURATION) {
        phaseIndexRef.current = (phaseIndexRef.current + 1) % PHASES.length;
        setPhase(PHASES[phaseIndexRef.current]);
        phaseStartRef.current = now;
        pausedPhaseElapsedRef.current = 0;
        setPhaseProgress(0);
      } else {
        setPhaseProgress(phaseElapsed / PHASE_DURATION);
      }

      animFrameRef.current = requestAnimationFrame(tick);
    },
    [totalMs],
  );

  const start = useCallback(() => {
    const now = performance.now();
    if (sessionState === "idle" || sessionState === "complete") {
      phaseIndexRef.current = 0;
      setPhase("inhale");
      setPhaseProgress(0);
      setElapsedMs(0);
      pausedElapsedRef.current = 0;
      pausedPhaseElapsedRef.current = 0;
      sessionStartRef.current = now;
      phaseStartRef.current = now;
    } else if (sessionState === "paused") {
      sessionStartRef.current = now;
      phaseStartRef.current = now;
    }
    setSessionState("running");
    animFrameRef.current = requestAnimationFrame(tick);
  }, [sessionState, tick]);

  const pause = useCallback(() => {
    if (sessionState !== "running") return;
    cancelAnimationFrame(animFrameRef.current);
    const now = performance.now();
    pausedElapsedRef.current += now - sessionStartRef.current;
    pausedPhaseElapsedRef.current += now - phaseStartRef.current;
    setSessionState("paused");
  }, [sessionState]);

  const reset = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    setSessionState("idle");
    setPhase("inhale");
    setPhaseProgress(0);
    setElapsedMs(0);
    phaseIndexRef.current = 0;
    pausedElapsedRef.current = 0;
    pausedPhaseElapsedRef.current = 0;
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // Reset when duration changes while idle
  useEffect(() => {
    if (sessionState === "idle") {
      setElapsedMs(0);
    }
  }, [durationMinutes, sessionState]);

  return {
    sessionState,
    phase,
    phaseProgress,
    elapsedMs,
    totalMs,
    start,
    pause,
    reset,
  };
}
