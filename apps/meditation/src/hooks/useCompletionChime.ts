import { useRef, useCallback } from "react";

export function useCompletionChime() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const play = useCallback(() => {
    const ctx = audioCtxRef.current ?? new AudioContext();
    audioCtxRef.current = ctx;

    // Play a gentle two-tone chime
    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(528, now, 1.5);
    playTone(660, now + 0.3, 1.5);
    playTone(792, now + 0.6, 2);
  }, []);

  return play;
}
