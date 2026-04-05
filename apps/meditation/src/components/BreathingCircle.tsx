import type { BreathPhase } from "../hooks/useBreathingTimer";

interface Props {
  phase: BreathPhase;
  phaseProgress: number;
  isActive: boolean;
}

const PHASE_LABELS: Record<BreathPhase, string> = {
  inhale: "breathe in",
  hold: "hold",
  exhale: "breathe out",
};

function getCircleScale(phase: BreathPhase, progress: number): number {
  switch (phase) {
    case "inhale":
      return 0.6 + 0.4 * progress;
    case "hold":
      return 1;
    case "exhale":
      return 1 - 0.4 * progress;
  }
}

function getCircleOpacity(phase: BreathPhase, progress: number): number {
  switch (phase) {
    case "inhale":
      return 0.3 + 0.4 * progress;
    case "hold":
      return 0.7;
    case "exhale":
      return 0.7 - 0.4 * progress;
  }
}

export default function BreathingCircle({ phase, phaseProgress, isActive }: Props) {
  const scale = isActive ? getCircleScale(phase, phaseProgress) : 0.6;
  const opacity = isActive ? getCircleOpacity(phase, phaseProgress) : 0.3;

  return (
    <div className="relative flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full bg-sky-500/20 blur-xl transition-transform duration-100"
        style={{ transform: `scale(${scale * 1.1})` }}
      />
      {/* Main breathing circle */}
      <div
        className="absolute inset-4 rounded-full border border-sky-400/30 transition-transform duration-100"
        style={{
          transform: `scale(${scale})`,
          backgroundColor: `rgba(56, 189, 248, ${opacity * 0.15})`,
          boxShadow: `0 0 ${40 * opacity}px rgba(56, 189, 248, ${opacity * 0.3})`,
        }}
      />
      {/* Inner circle */}
      <div
        className="absolute inset-16 rounded-full border border-sky-300/20 transition-transform duration-100"
        style={{ transform: `scale(${scale})` }}
      />
      {/* Phase label */}
      <span className="relative z-10 text-xl font-light tracking-widest text-slate-300 sm:text-2xl">
        {isActive ? PHASE_LABELS[phase] : "breathe"}
      </span>
    </div>
  );
}
