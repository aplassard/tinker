import type { BreathPattern } from "../patterns";
import { PATTERNS } from "../patterns";

interface Props {
  selected: BreathPattern;
  onChange: (pattern: BreathPattern) => void;
  disabled: boolean;
}

export default function PatternSelector({ selected, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs tracking-widest text-slate-500 uppercase">pattern</span>
      <div className="grid grid-cols-2 gap-2">
        {PATTERNS.map((pattern) => (
          <button
            key={pattern.id}
            onClick={() => onChange(pattern)}
            disabled={disabled}
            className={`rounded-xl px-4 py-2.5 text-left transition-all ${
              selected.id === pattern.id
                ? "bg-sky-500/20 ring-1 ring-sky-400/40"
                : "bg-slate-800/50 hover:bg-slate-800"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <div className={`text-sm font-medium ${selected.id === pattern.id ? "text-sky-300" : "text-slate-400"}`}>
              {pattern.name}
            </div>
            <div className="text-xs text-slate-600">{pattern.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
