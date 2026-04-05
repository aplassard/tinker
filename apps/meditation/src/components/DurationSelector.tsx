const DURATIONS = [5, 10, 15];

interface Props {
  selected: number;
  onChange: (minutes: number) => void;
  disabled: boolean;
}

export default function DurationSelector({ selected, onChange, disabled }: Props) {
  return (
    <div className="flex gap-3">
      {DURATIONS.map((min) => (
        <button
          key={min}
          onClick={() => onChange(min)}
          disabled={disabled}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
            selected === min
              ? "bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40"
              : "text-slate-500 hover:text-slate-300"
          } disabled:cursor-not-allowed disabled:opacity-40`}
        >
          {min}m
        </button>
      ))}
    </div>
  );
}
