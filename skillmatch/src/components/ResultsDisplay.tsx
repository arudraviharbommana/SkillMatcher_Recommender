import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnalysisResult } from "@/types";
import { CheckCircle2, ArrowLeft, TrendingUp } from "lucide-react";

interface ResultsDisplayProps {
  results: AnalysisResult;
  onReset: () => void;
}

export function ResultsDisplay({ results, onReset }: ResultsDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 75) return "Excellent Match!";
    if (score >= 50) return "Good Match";
    return "Needs Improvement";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-start items-center mb-6">
        <Button variant="outline" onClick={onReset} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          New Analysis
        </Button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Analysis Summary</h2>
        <p className="text-muted-foreground">
          {results.jobTitle} - {results.resumeFileName}
        </p>
        <p className="text-sm text-muted-foreground">
          Analyzed on {new Date(results.timestamp).toLocaleDateString()} at {new Date(results.timestamp).toLocaleTimeString()}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Match Score Card */}
        <Card className="shadow-strong border-2 md:col-span-2">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Overall Match Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className={`text-6xl font-bold ${getScoreColor(results.matchScore)}`}>
                {results.matchScore}%
              </div>
              <p className="text-xl text-muted-foreground mt-2">{getScoreMessage(results.matchScore)}</p>
            </div>
            <Progress value={results.matchScore} className="h-3" />
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{results.matchedSkills.length}</div>
                <p className="text-sm text-muted-foreground">Matched</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{results.missingSkills.length}</div>
                <p className="text-sm text-muted-foreground">Missing</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{results.extraSkills.length}</div>
                <p className="text-sm text-muted-foreground">Extra</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Breakdown */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckCircle2 className="w-5 h-5" />
              Matched Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {results.matchedSkills.length > 0 ? (
                results.matchedSkills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="border-success text-success">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No matched skills found</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <TrendingUp className="w-5 h-5" />
              Missing Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {results.missingSkills.length > 0 ? (
                results.missingSkills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="border-warning text-warning">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">You have all required skills!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
