import { useState, useRef, useCallback, useEffect } from "react";
import type { BreathPhase, BreathPattern } from "../patterns";

export type { BreathPhase };
export type SessionState = "idle" | "running" | "paused" | "complete";

export function useBreathingTimer(durationMinutes: number, pattern: BreathPattern) {
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
      const currentStep = pattern.steps[phaseIndexRef.current];
      const phaseDuration = currentStep.duration;

      if (sessionElapsed >= totalMs) {
        setSessionState("complete");
        setElapsedMs(totalMs);
        setPhaseProgress(0);
        return;
      }

      setElapsedMs(sessionElapsed);

      if (phaseElapsed >= phaseDuration) {
        phaseIndexRef.current = (phaseIndexRef.current + 1) % pattern.steps.length;
        setPhase(pattern.steps[phaseIndexRef.current].phase);
        phaseStartRef.current = now;
        pausedPhaseElapsedRef.current = 0;
        setPhaseProgress(0);
      } else {
        setPhaseProgress(phaseElapsed / phaseDuration);
      }

      animFrameRef.current = requestAnimationFrame(tick);
    },
    [totalMs, pattern],
  );

  const start = useCallback(() => {
    const now = performance.now();
    if (sessionState === "idle" || sessionState === "complete") {
      phaseIndexRef.current = 0;
      setPhase(pattern.steps[0].phase);
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
  }, [sessionState, tick, pattern]);

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
    setPhase(pattern.steps[0].phase);
    setPhaseProgress(0);
    setElapsedMs(0);
    phaseIndexRef.current = 0;
    pausedElapsedRef.current = 0;
    pausedPhaseElapsedRef.current = 0;
  }, [pattern]);

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // Reset when duration or pattern changes while idle
  useEffect(() => {
    if (sessionState === "idle") {
      setElapsedMs(0);
      setPhase(pattern.steps[0].phase);
      phaseIndexRef.current = 0;
    }
  }, [durationMinutes, pattern, sessionState]);

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
