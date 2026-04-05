interface Props {
  elapsedMs: number;
  totalMs: number;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function Timer({ elapsedMs, totalMs }: Props) {
  const remainingMs = Math.max(0, totalMs - elapsedMs);
  const progress = totalMs > 0 ? elapsedMs / totalMs : 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-mono text-2xl font-light tracking-wider text-slate-400">
        {formatTime(remainingMs)}
      </span>
      {/* Progress bar */}
      <div className="h-0.5 w-32 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-sky-500/40 transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
