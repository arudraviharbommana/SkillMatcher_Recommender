export interface User {
  email: string;
  username: string;
  password?: string;
}

export interface ComparisonRow {
  resumeSkill: string | null;
  jobSkill: string;
  matchType: "EXACT MATCH" | "WEAK MATCH" | "MISSING";
  similarityScore: number;
  category: string;
  priority: "REQUIRED" | "PREFERRED";
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  resumeFileName: string;
  jobTitle: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  extraSkills: string[];
  recommendations: any[];
  comparison: ComparisonRow[];
}

export interface AnalysisHistory {
  email: string;
  analyses: AnalysisResult[];
}

export interface JobRecommendation {
  jobTitle: string;
  matchScore: number;
  matchedSkills: string[];
  missingCoreSkills: string[];
  complementarySkills: string[];
  summary: string;
}

export interface JobSuggestionResult {
  id: string;
  timestamp: string;
  resumeFileName: string;
  resumeSummary: string;
  recommendations: JobRecommendation[];
}
