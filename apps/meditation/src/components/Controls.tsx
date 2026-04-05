import type { SessionState } from "../hooks/useBreathingTimer";

interface Props {
  sessionState: SessionState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function Controls({ sessionState, onStart, onPause, onReset }: Props) {
  return (
    <div className="flex gap-4">
      {sessionState === "running" ? (
        <button
          onClick={onPause}
          className="rounded-full bg-slate-700/50 px-8 py-3 text-sm font-medium tracking-wide text-slate-300 transition-colors hover:bg-slate-700"
        >
          pause
        </button>
      ) : (
        <button
          onClick={onStart}
          className="rounded-full bg-sky-500/20 px-8 py-3 text-sm font-medium tracking-wide text-sky-300 ring-1 ring-sky-400/30 transition-colors hover:bg-sky-500/30"
        >
          {sessionState === "idle" ? "start" : sessionState === "complete" ? "restart" : "resume"}
        </button>
      )}
      {sessionState !== "idle" && (
        <button
          onClick={onReset}
          className="rounded-full bg-slate-800/50 px-8 py-3 text-sm font-medium tracking-wide text-slate-500 transition-colors hover:text-slate-300"
        >
          reset
        </button>
      )}
    </div>
  );
}
