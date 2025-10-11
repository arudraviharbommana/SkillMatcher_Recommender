import { User, AnalysisResult, JobSuggestionResult } from "@/types";

const USERS_KEY = "skillmatcher_users";
const CURRENT_USER_KEY = "skillmatcher_current_user";
const ANALYSES_KEY = "skillmatcher_analyses";
const JOB_SUGGESTIONS_KEY = "skillmatcher_job_suggestions";

export const storageUtils = {
  // User management
  getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.email === user.email);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser(user: User): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Analysis management
  getAnalyses(email: string): AnalysisResult[] {
    const allAnalyses = localStorage.getItem(ANALYSES_KEY);
    const analyses: Record<string, AnalysisResult[]> = allAnalyses ? JSON.parse(allAnalyses) : {};
    return analyses[email] || [];
  },

  saveAnalysis(email: string, analysis: AnalysisResult): void {
    const allAnalyses = localStorage.getItem(ANALYSES_KEY);
    const analyses: Record<string, AnalysisResult[]> = allAnalyses ? JSON.parse(allAnalyses) : {};
    
    if (!analyses[email]) {
      analyses[email] = [];
    }
    
    analyses[email].unshift(analysis);
    localStorage.setItem(ANALYSES_KEY, JSON.stringify(analyses));
  },

  deleteAnalysis(email: string, analysisId: string): void {
    const allAnalyses = localStorage.getItem(ANALYSES_KEY);
    const analyses: Record<string, AnalysisResult[]> = allAnalyses ? JSON.parse(allAnalyses) : {};
    
    if (analyses[email]) {
      analyses[email] = analyses[email].filter(a => a.id !== analysisId);
      localStorage.setItem(ANALYSES_KEY, JSON.stringify(analyses));
    }
  },

  deleteAllAnalyses(email: string): void {
    const allAnalyses = localStorage.getItem(ANALYSES_KEY);
    const analyses: Record<string, AnalysisResult[]> = allAnalyses ? JSON.parse(allAnalyses) : {};
    
    if (analyses[email]) {
      delete analyses[email];
      localStorage.setItem(ANALYSES_KEY, JSON.stringify(analyses));
    }
  },

  // Job suggestion management
  getJobSuggestions(email: string): JobSuggestionResult[] {
    const allSuggestions = localStorage.getItem(JOB_SUGGESTIONS_KEY);
    const suggestions: Record<string, JobSuggestionResult[]> = allSuggestions ? JSON.parse(allSuggestions) : {};
    return suggestions[email] || [];
  },

  saveJobSuggestion(email: string, suggestion: JobSuggestionResult): void {
    const allSuggestions = localStorage.getItem(JOB_SUGGESTIONS_KEY);
    const suggestions: Record<string, JobSuggestionResult[]> = allSuggestions ? JSON.parse(allSuggestions) : {};

    if (!suggestions[email]) {
      suggestions[email] = [];
    }

    suggestions[email].unshift(suggestion);
    localStorage.setItem(JOB_SUGGESTIONS_KEY, JSON.stringify(suggestions));
  },

  deleteJobSuggestion(email: string, suggestionId: string): void {
    const allSuggestions = localStorage.getItem(JOB_SUGGESTIONS_KEY);
    const suggestions: Record<string, JobSuggestionResult[]> = allSuggestions ? JSON.parse(allSuggestions) : {};

    if (suggestions[email]) {
      suggestions[email] = suggestions[email].filter(s => s.id !== suggestionId);
      localStorage.setItem(JOB_SUGGESTIONS_KEY, JSON.stringify(suggestions));
    }
  },

  deleteAllJobSuggestions(email: string): void {
    const allSuggestions = localStorage.getItem(JOB_SUGGESTIONS_KEY);
    const suggestions: Record<string, JobSuggestionResult[]> = allSuggestions ? JSON.parse(allSuggestions) : {};

    if (suggestions[email]) {
      delete suggestions[email];
      localStorage.setItem(JOB_SUGGESTIONS_KEY, JSON.stringify(suggestions));
    }
  },
};
