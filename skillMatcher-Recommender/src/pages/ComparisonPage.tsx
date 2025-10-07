import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnalysisResult } from "@/types";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buildComparisonRows } from "@/utils/comparisonBuilder";

const ComparisonPage = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const result = sessionStorage.getItem("analysisResult");
    if (result) {
      setAnalysisResult(JSON.parse(result));
    } else {
      // If no result in session storage, redirect to home
      navigate("/");
    }
  }, [navigate]);

  if (!analysisResult) {
    return null; // Or a loading spinner
  }

  const comparisonRows = useMemo(() => buildComparisonRows(analysisResult), [analysisResult]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="space-y-3">
          <div>
            <CardTitle>Skills Comparison</CardTitle>
            <CardDescription>
              {analysisResult.jobTitle} · {analysisResult.resumeFileName}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>
              Match score: <span className="font-semibold text-foreground">{analysisResult.matchScore}%</span>
            </span>
            <span>✓ {analysisResult.matchedSkills.length} matched</span>
            <span>✗ {analysisResult.missingSkills.length} missing</span>
            <span>+ {analysisResult.extraSkills.length} extra</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Review how each job requirement aligns with your resume to identify strengths and immediate upskilling opportunities.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-success flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-success"></span>
                Matched Skills
              </h3>
              <div className="flex flex-wrap gap-1">
                {analysisResult.matchedSkills.length > 0 ? (
                  analysisResult.matchedSkills.map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="border-success text-success text-xs">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No direct matches detected.</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-warning">Missing Skills</h3>
              <div className="flex flex-wrap gap-1">
                {analysisResult.missingSkills.length > 0 ? (
                  analysisResult.missingSkills.map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="border-warning text-warning text-xs">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">You cover every required skill.</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-accent">Extra Skills</h3>
              <div className="flex flex-wrap gap-1">
                {analysisResult.extraSkills.length > 0 ? (
                  analysisResult.extraSkills.slice(0, 15).map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="border-accent text-accent text-xs">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No additional skills highlighted.</span>
                )}
                {analysisResult.extraSkills.length > 15 && (
                  <Badge variant="outline" className="text-xs">
                    +{analysisResult.extraSkills.length - 15} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <ComparisonTable comparisonData={comparisonRows} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonPage;
