import { useRef, useCallback, useEffect } from "react";

export type SoundscapeId = "silent" | "rain" | "ocean" | "forest" | "bowl" | "whitenoise";

export interface SoundscapeOption {
  id: SoundscapeId;
  name: string;
  description: string;
}

export const SOUNDSCAPES: SoundscapeOption[] = [
  { id: "silent", name: "Silent", description: "No background sound" },
  { id: "rain", name: "Rain", description: "Gentle rainfall" },
  { id: "ocean", name: "Ocean", description: "Rolling waves" },
  { id: "forest", name: "Forest", description: "Birds & nature" },
  { id: "bowl", name: "Singing Bowl", description: "Resonant drone" },
  { id: "whitenoise", name: "White Noise", description: "Steady hum" },
];

interface SoundNodes {
  sources: (AudioBufferSourceNode | OscillatorNode)[];
  gains: GainNode[];
  masterGain: GainNode;
  intervals?: ReturnType<typeof setInterval>[];
}

function createNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * seconds;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function startRain(ctx: AudioContext, masterGain: GainNode): SoundNodes {
  const noiseBuffer = createNoiseBuffer(ctx, 4);

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;
  source.loop = true;

  // Bandpass filter to shape rain sound
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(800, ctx.currentTime);
  filter.Q.setValueAtTime(0.5, ctx.currentTime);

  // Highpass to add crispness
  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.setValueAtTime(200, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.6, ctx.currentTime);

  source.connect(filter);
  filter.connect(highpass);
  highpass.connect(gain);
  gain.connect(masterGain);
  source.start();

  return { sources: [source], gains: [gain], masterGain };
}

function startOcean(ctx: AudioContext, masterGain: GainNode): SoundNodes {
  const noiseBuffer = createNoiseBuffer(ctx, 4);

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;
  source.loop = true;

  // Low-pass filter for deep ocean sound
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(400, ctx.currentTime);
  filter.Q.setValueAtTime(1, ctx.currentTime);

  // LFO to modulate filter for wave effect
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.type = "sine";
  lfo.frequency.setValueAtTime(0.1, ctx.currentTime); // slow wave cycle
  lfoGain.gain.setValueAtTime(300, ctx.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.7, ctx.currentTime);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  source.start();

  return { sources: [source, lfo], gains: [gain], masterGain };
}

function startForest(ctx: AudioContext, masterGain: GainNode): SoundNodes {
  const sources: (AudioBufferSourceNode | OscillatorNode)[] = [];
  const gains: GainNode[] = [];
  const intervals: ReturnType<typeof setInterval>[] = [];

  // Very soft background wind/rustle
  const noiseBuffer = createNoiseBuffer(ctx, 4);
  const windSource = ctx.createBufferSource();
  windSource.buffer = noiseBuffer;
  windSource.loop = true;

  const windFilter = ctx.createBiquadFilter();
  windFilter.type = "lowpass";
  windFilter.frequency.setValueAtTime(250, ctx.currentTime);
  windFilter.Q.setValueAtTime(0.2, ctx.currentTime);

  const windGain = ctx.createGain();
  windGain.gain.setValueAtTime(0.1, ctx.currentTime);

  windSource.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(masterGain);
  windSource.start();
  sources.push(windSource);
  gains.push(windGain);

  // Gentle bird chirps that fade in and out sporadically
  function scheduleBird() {
    const freq = 1600 + Math.random() * 1200; // 1600-2800 Hz
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    // Gentle downward frequency sweep for natural chirp
    osc.frequency.exponentialRampToValueAtTime(freq * 0.7, ctx.currentTime + 0.15);

    const birdGain = ctx.createGain();
    birdGain.gain.setValueAtTime(0, ctx.currentTime);
    birdGain.gain.linearRampToValueAtTime(0.04 + Math.random() * 0.03, ctx.currentTime + 0.02);
    birdGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(birdGain);
    birdGain.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  // Schedule birds at random intervals (every 2-6 seconds)
  const birdInterval = setInterval(() => {
    if (ctx.state === "running") {
      scheduleBird();
      // Occasionally add a second chirp right after
      if (Math.random() > 0.5) {
        setTimeout(() => { if (ctx.state === "running") scheduleBird(); }, 120);
      }
    }
  }, 2000 + Math.random() * 4000);
  intervals.push(birdInterval);

  // Re-randomize the bird interval periodically
  const rerollInterval = setInterval(() => {
    clearInterval(birdInterval);
    const newInterval = setInterval(() => {
      if (ctx.state === "running") {
        scheduleBird();
        if (Math.random() > 0.6) {
          setTimeout(() => { if (ctx.state === "running") scheduleBird(); }, 100 + Math.random() * 80);
        }
      }
    }, 2500 + Math.random() * 4500);
    intervals.push(newInterval);
  }, 15000);
  intervals.push(rerollInterval);

  // Start with a chirp after a brief pause
  setTimeout(() => { if (ctx.state === "running") scheduleBird(); }, 1500);

  return { sources, gains, masterGain, intervals };
}

function startBowl(ctx: AudioContext, masterGain: GainNode): SoundNodes {
  const sources: OscillatorNode[] = [];
  const gains: GainNode[] = [];
  const intervals: ReturnType<typeof setInterval>[] = [];

  // Strike the bowl: fundamental + harmonics that swell and decay naturally
  function strike() {
    const fundamentals = [174, 348, 522]; // ~F3 + overtones
    fundamentals.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Subtle vibrato for shimmer
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.type = "sine";
      vibrato.frequency.setValueAtTime(3 + i * 0.5, ctx.currentTime);
      vibratoGain.gain.setValueAtTime(1.5, ctx.currentTime);
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      vibrato.start();

      const gain = ctx.createGain();
      const amplitude = 0.3 / (i + 1);
      // Quick attack, long natural decay
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(amplitude, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(amplitude * 0.3, ctx.currentTime + 3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 7);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 7.5);
      vibrato.stop(ctx.currentTime + 7.5);
    });
  }

  // Initial strike
  strike();

  // Repeat strike every 8 seconds (overlapping with the tail of the previous)
  const strikeInterval = setInterval(() => {
    if (ctx.state === "running") strike();
  }, 8000);
  intervals.push(strikeInterval);

  return { sources, gains, masterGain, intervals };
}

function startWhiteNoise(ctx: AudioContext, masterGain: GainNode): SoundNodes {
  const noiseBuffer = createNoiseBuffer(ctx, 4);

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;
  source.loop = true;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, ctx.currentTime);

  source.connect(gain);
  gain.connect(masterGain);
  source.start();

  return { sources: [source], gains: [gain], masterGain };
}

const GENERATORS: Record<Exclude<SoundscapeId, "silent">, (ctx: AudioContext, master: GainNode) => SoundNodes> = {
  rain: startRain,
  ocean: startOcean,
  forest: startForest,
  bowl: startBowl,
  whitenoise: startWhiteNoise,
};

export function useSoundscape() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<SoundNodes | null>(null);
  const volumeRef = useRef(0.5);

  const getContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    // Resume if suspended (iOS requires user gesture)
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const stop = useCallback((fadeMs = 0) => {
    const nodes = nodesRef.current;
    if (!nodes) return;

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Clear any scheduled intervals (bird chirps, bowl strikes)
    nodes.intervals?.forEach((id) => clearInterval(id));

    const fadeSec = fadeMs / 1000;
    if (fadeSec > 0) {
      nodes.masterGain.gain.setValueAtTime(nodes.masterGain.gain.value, ctx.currentTime);
      nodes.masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + fadeSec);
      // Stop sources after fade completes
      setTimeout(() => {
        nodes.sources.forEach((s) => {
          try { s.stop(); } catch { /* already stopped */ }
        });
      }, fadeMs + 50);
    } else {
      nodes.sources.forEach((s) => {
        try { s.stop(); } catch { /* already stopped */ }
      });
    }

    nodesRef.current = null;
  }, []);

  const play = useCallback((soundId: SoundscapeId) => {
    // Stop any current playback
    stop();

    if (soundId === "silent") return;

    const ctx = getContext();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volumeRef.current, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const generator = GENERATORS[soundId];
    const nodes = generator(ctx, masterGain);
    nodesRef.current = nodes;
  }, [stop, getContext]);

  const setVolume = useCallback((vol: number) => {
    volumeRef.current = vol;
    const nodes = nodesRef.current;
    const ctx = audioCtxRef.current;
    if (nodes && ctx) {
      nodes.masterGain.gain.setValueAtTime(vol, ctx.currentTime);
    }
  }, []);

  const fadeOut = useCallback((durationMs = 1500) => {
    stop(durationMs);
  }, [stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [stop]);

  return { play, stop, fadeOut, setVolume };
}
