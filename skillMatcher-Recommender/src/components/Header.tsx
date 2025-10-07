import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { LogOut, History, FileText, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  user: User;
  onLogout: () => void;
  currentView: "analyze" | "jobs" | "history";
  onViewChange: (view: "analyze" | "jobs" | "history") => void;
}

export function Header({ user, onLogout, currentView, onViewChange }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-card shadow-soft">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">SkillMatcher</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={currentView === "analyze" ? "default" : "outline"}
            onClick={() => {
              onViewChange("analyze");
              navigate("/");
            }}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            Analyze
          </Button>
          <Button
            variant={currentView === "jobs" ? "default" : "outline"}
            onClick={() => onViewChange("jobs")}
            className="gap-2"
          >
            <Briefcase className="w-4 h-4" />
            Get Suitable Job
          </Button>
          <Button
            variant={currentView === "history" ? "default" : "outline"}
            onClick={() => onViewChange("history")}
            className="gap-2"
          >
            <History className="w-4 h-4" />
            History
          </Button>
          <Button variant="outline" onClick={onLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
