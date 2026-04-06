import { SOUNDSCAPES, type SoundscapeId } from "../hooks/useSoundscape";

interface Props {
  selected: SoundscapeId;
  volume: number;
  onChange: (id: SoundscapeId) => void;
  onVolumeChange: (vol: number) => void;
  disabled: boolean;
}

export default function SoundscapeSelector({
  selected,
  volume,
  onChange,
  onVolumeChange,
  disabled,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs tracking-widest text-slate-500 uppercase">
        soundscape
      </span>
      <div className="flex flex-wrap justify-center gap-2">
        {SOUNDSCAPES.map((sound) => (
          <button
            key={sound.id}
            onClick={() => onChange(sound.id)}
            disabled={disabled}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
              selected === sound.id
                ? "bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40"
                : "text-slate-500 hover:text-slate-300"
            } disabled:cursor-not-allowed disabled:opacity-40`}
            title={sound.description}
          >
            {sound.name}
          </button>
        ))}
      </div>
      {selected !== "silent" && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-600">vol</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            disabled={disabled}
            className="h-1 w-32 cursor-pointer appearance-none rounded-full bg-slate-700 accent-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
          />
        </div>
      )}
    </div>
  );
}
