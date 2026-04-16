export interface SwingAnalysis {
  overall_score: number; // 1-10
  summary: string;
  phases: {
    setup: PhaseAnalysis;
    backswing: PhaseAnalysis;
    downswing: PhaseAnalysis;
    impact: PhaseAnalysis;
    follow_through: PhaseAnalysis;
  };
  drills: Drill[];
}

export interface PhaseAnalysis {
  score: number; // 1-10
  feedback: string;
}

export interface Drill {
  name: string;
  description: string;
}

export interface AnalyzeResponse {
  analysis: SwingAnalysis;
}

export interface AnalyzeErrorResponse {
  error: string;
}
