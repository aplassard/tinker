import { useState } from "react";

const PRESET_DURATIONS = [3, 5, 10, 15, 20];

interface Props {
  selected: number;
  onChange: (minutes: number) => void;
  disabled: boolean;
}

export default function DurationSelector({ selected, onChange, disabled }: Props) {
  const [customInput, setCustomInput] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const isPreset = PRESET_DURATIONS.includes(selected);

  function handleCustomSubmit() {
    const val = parseInt(customInput, 10);
    if (val > 0 && val <= 180) {
      onChange(val);
      setShowCustom(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs tracking-widest text-slate-500 uppercase">duration</span>
      <div className="flex flex-wrap justify-center gap-2">
        {PRESET_DURATIONS.map((min) => (
          <button
            key={min}
            onClick={() => { onChange(min); setShowCustom(false); }}
            disabled={disabled}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              selected === min && !showCustom
                ? "bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40"
                : "text-slate-500 hover:text-slate-300"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {min}m
          </button>
        ))}
        <button
          onClick={() => setShowCustom((v) => !v)}
          disabled={disabled}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            !isPreset || showCustom
              ? "bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40"
              : "text-slate-500 hover:text-slate-300"
          } disabled:cursor-not-allowed disabled:opacity-40`}
        >
          custom
        </button>
      </div>
      {showCustom && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={180}
            placeholder="min"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
            className="w-20 rounded-lg bg-slate-800 px-3 py-1.5 text-center text-sm text-slate-300 outline-none ring-1 ring-slate-700 focus:ring-sky-400/40"
          />
          <button
            onClick={handleCustomSubmit}
            className="rounded-lg bg-sky-500/20 px-3 py-1.5 text-sm text-sky-300 ring-1 ring-sky-400/30 hover:bg-sky-500/30"
          >
            set
          </button>
        </div>
      )}
    </div>
  );
}
