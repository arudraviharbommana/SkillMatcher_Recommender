import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { storageUtils } from "@/utils/storage";
import { AnalysisResult, User } from "@/types";
import { Calendar, TrendingUp, FileText, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ComparisonTable } from "./ComparisonTable";
import { buildComparisonRows } from "@/utils/comparisonBuilder";

interface HistoryViewProps {
  user: User;
}

export function HistoryView({ user }: HistoryViewProps) {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null); // 'all' or analysis.id
  const [password, setPassword] = useState("");

  useEffect(() => {
    const userAnalyses = storageUtils.getAnalyses(user.email);
    setAnalyses(userAnalyses);
  }, [user.email]);

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteTarget(id);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    const currentUser = storageUtils.getCurrentUser();
    if (currentUser?.password !== password) {
      toast.error("Incorrect password. Deletion cancelled.");
      setPassword("");
      setDeleteTarget(null);
      return;
    }

    if (deleteTarget === "all") {
      storageUtils.deleteAllAnalyses(user.email);
      setAnalyses([]);
      toast.success("All analysis history has been deleted.");
    } else {
      storageUtils.deleteAnalysis(user.email, deleteTarget);
      setAnalyses(analyses.filter(a => a.id !== deleteTarget));
      toast.success("Analysis has been deleted.");
    }

    setPassword("");
    setDeleteTarget(null);
  };

  if (analyses.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Analysis History</h2>
          <p className="text-muted-foreground">
            Start analyzing resumes to see your history here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8 relative">
        <h2 className="text-3xl font-bold mb-2">Analysis History</h2>
        <p className="text-muted-foreground">
          View all your past resume analyses ({analyses.length} total)
        </p>
        {analyses.length > 0 && (
          <Button
            variant="destructive"
            className="absolute top-0 right-0"
            onClick={() => handleDeleteRequest("all")}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {analyses.map((analysis) => {
          const comparisonRows = buildComparisonRows(analysis);

          return (
            <Collapsible
              key={analysis.id}
              open={expandedId === analysis.id}
              onOpenChange={(open) => setExpandedId(open ? analysis.id : null)}
            >
              <Card className="shadow-medium hover:shadow-strong transition-shadow">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-lg font-bold">{analysis.jobTitle || "Untitled Analysis"}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {analysis.resumeFileName}
                      </CardDescription>
                      <div className="flex items-center gap-2 pt-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(analysis.timestamp).toLocaleDateString()} at{" "}
                          {new Date(analysis.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 pt-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Match Score:</span>
                          <span className={`ml-2 text-2xl font-bold ${getScoreColor(analysis.matchScore)}`}>
                            {analysis.matchScore}%
                          </span>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <span className="text-success">✓ {analysis.matchedSkills.length} matched</span>
                          <span className="text-warning">✗ {analysis.missingSkills.length} missing</span>
                          <span className="text-accent">+ {analysis.extraSkills.length} extra</span>
                        </div>
                      </div>
                      <Progress value={analysis.matchScore} className="h-2 w-full max-w-xs" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(expandedId === analysis.id ? null : analysis.id)
                      }}>
                        {expandedId === analysis.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRequest(analysis.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-success mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Matched Skills
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.matchedSkills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="border-success text-success text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-warning mb-2">Missing Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.missingSkills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="border-warning text-warning text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-accent mb-2">Extra Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.extraSkills.slice(0, 10).map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="border-accent text-accent text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {analysis.extraSkills.length > 10 && (
                          <Badge variant="outline" className="text-xs">
                            +{analysis.extraSkills.length - 10} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Recommendations</h4>
                    {(() => {
                      const formatted = (analysis.recommendations ?? [])
                        .map((rec) => {
                          if (typeof rec === "string") {
                            return rec.trim();
                          }
                          if (rec?.reason) {
                            return rec.reason.trim();
                          }
                          if (rec?.skill) {
                            return rec.skill.trim();
                          }
                          return "";
                        })
                        .filter((text) => text.length > 0);

                      if (formatted.length === 0) {
                        return (
                          <p className="text-sm text-muted-foreground">
                            No recommendations available.
                          </p>
                        );
                      }

                      return (
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          {formatted.map((text, idx) => (
                            <li key={idx}>• {text}</li>
                          ))}
                        </ul>
                      );
                    })()}
                  </div>
                  {comparisonRows.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold mb-2">Skills Comparison Table</h4>
                      <ComparisonTable comparisonData={comparisonRows} />
                    </div>
                  )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Please enter your password to confirm deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="delete-password">Password</Label>
            <Input
              id="delete-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPassword("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={!password}>
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
