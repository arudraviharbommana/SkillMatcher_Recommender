import { useState, useEffect } from "react";
import { AuthForm } from "@/components/AuthForm";
import { Header } from "@/components/Header";
import { AnalyzeView } from "@/components/AnalyzeView";
import { HistoryView } from "@/components/HistoryView";
import { JobSuggestionsView } from "@/components/JobSuggestionsView";
import { storageUtils } from "@/utils/storage";
import { User } from "@/types";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<"analyze" | "jobs" | "history">("analyze");

  useEffect(() => {
    const currentUser = storageUtils.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleAnalysisComplete = () => {};

  const handleLogout = () => {
    storageUtils.logout();
    setUser(null);
    setCurrentView("analyze");
    sessionStorage.removeItem("analysisResult");
    sessionStorage.removeItem("jobSuggestionResult");
  };

  if (!user) {
    return <AuthForm onSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header
        user={user}
        onLogout={handleLogout}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      {currentView === "analyze" && (
        <AnalyzeView user={user} onAnalysisComplete={handleAnalysisComplete} />
      )}
      {currentView === "jobs" && <JobSuggestionsView user={user} />}
      {currentView === "history" && <HistoryView user={user} />}
    </div>
  );
};

export default Index;
