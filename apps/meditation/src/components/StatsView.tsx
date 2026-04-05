import type { MeditationSession } from "../hooks/useSessionStorage";

interface Props {
  sessions: MeditationSession[];
  stats: {
    totalSessions: number;
    totalMinutes: number;
    currentStreak: number;
    longestStreak: number;
    days: Set<string>;
  };
  onClose: () => void;
}

function toDateStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function ActivityCalendar({ days }: { days: Set<string> }) {
  const cells: { dateStr: string; active: boolean }[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = toDateStr(d);
    cells.push({ dateStr, active: days.has(dateStr) });
  }

  return (
    <div className="w-full">
      <p className="mb-2 text-xs tracking-widest text-slate-500 uppercase">Last 30 days</p>
      <div className="grid grid-cols-10 gap-1">
        {cells.map(({ dateStr, active }) => (
          <div
            key={dateStr}
            title={dateStr}
            className={`aspect-square rounded-sm ${
              active ? "bg-sky-400" : "bg-slate-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function StatsView({ sessions, stats, onClose }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-slate-900 px-6 pt-12 pb-8">
      {/* Header */}
      <div className="mb-8 flex w-full max-w-sm items-center justify-between">
        <h1 className="text-lg font-semibold tracking-widest text-slate-200 uppercase">Stats</h1>
        <button
          onClick={onClose}
          className="text-sm tracking-widest text-slate-400 uppercase transition-colors hover:text-slate-200"
        >
          ← Back
        </button>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* Streak cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center rounded-xl bg-slate-800 py-5 px-4">
            <span className="mb-1 text-2xl">🔥</span>
            <span className="text-3xl font-bold text-slate-100">{stats.currentStreak}</span>
            <span className="mt-1 text-center text-xs tracking-widest text-slate-400 uppercase">
              Current streak
            </span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-slate-800 py-5 px-4">
            <span className="mb-1 text-2xl">🏆</span>
            <span className="text-3xl font-bold text-slate-100">{stats.longestStreak}</span>
            <span className="mt-1 text-center text-xs tracking-widest text-slate-400 uppercase">
              Longest streak
            </span>
          </div>
        </div>

        {/* Total stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center rounded-xl bg-slate-800 py-5 px-4">
            <span className="text-3xl font-bold text-slate-100">{stats.totalSessions}</span>
            <span className="mt-1 text-center text-xs tracking-widest text-slate-400 uppercase">
              Sessions
            </span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-slate-800 py-5 px-4">
            <span className="text-3xl font-bold text-slate-100">{stats.totalMinutes}</span>
            <span className="mt-1 text-center text-xs tracking-widest text-slate-400 uppercase">
              Minutes
            </span>
          </div>
        </div>

        {/* Activity calendar */}
        <div className="rounded-xl bg-slate-800 p-4">
          <ActivityCalendar days={stats.days} />
        </div>

        {/* Empty state */}
        {sessions.length === 0 && (
          <p className="text-center text-sm tracking-widest text-slate-500">
            Complete your first session to start tracking progress.
          </p>
        )}
      </div>
    </div>
  );
}
