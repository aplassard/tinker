export type HandicapEstimate = "beginner" | "intermediate" | "advanced";

export interface CategoryAnalysis {
  score: number; // 1-10
  tips: string[];
}

export interface SwingAnalysis {
  overall_score: number; // 1-10
  handicap_estimate: HandicapEstimate;
  categories: {
    grip: CategoryAnalysis;
    stance: CategoryAnalysis;
    backswing: CategoryAnalysis;
    downswing: CategoryAnalysis;
    follow_through: CategoryAnalysis;
  };
  top_priority_fix: string;
}

export interface AnalyzeResponse {
  analysis: SwingAnalysis;
}

export interface AnalyzeErrorResponse {
  error: string;
}
