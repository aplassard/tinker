export type BreathPhase = "inhale" | "hold" | "exhale";

export interface PhaseStep {
  phase: BreathPhase;
  duration: number; // ms
}

export interface BreathPattern {
  id: string;
  name: string;
  description: string;
  steps: PhaseStep[];
}

export const PATTERNS: BreathPattern[] = [
  {
    id: "box",
    name: "Box breathing",
    description: "4s · 4s · 4s · 4s",
    steps: [
      { phase: "inhale", duration: 4000 },
      { phase: "hold", duration: 4000 },
      { phase: "exhale", duration: 4000 },
      { phase: "hold", duration: 4000 },
    ],
  },
  {
    id: "478",
    name: "4-7-8 relaxation",
    description: "4s · 7s · 8s",
    steps: [
      { phase: "inhale", duration: 4000 },
      { phase: "hold", duration: 7000 },
      { phase: "exhale", duration: 8000 },
    ],
  },
  {
    id: "basic",
    name: "Basic",
    description: "5s · 5s",
    steps: [
      { phase: "inhale", duration: 5000 },
      { phase: "exhale", duration: 5000 },
    ],
  },
  {
    id: "deep-calm",
    name: "Deep calm",
    description: "4s · 2s · 4s · 2s",
    steps: [
      { phase: "inhale", duration: 4000 },
      { phase: "hold", duration: 2000 },
      { phase: "exhale", duration: 4000 },
      { phase: "hold", duration: 2000 },
    ],
  },
];
