import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnalysisResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const RecommendationsPage = () => {
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

  const formattedRecommendations = (analysisResult.recommendations ?? [])
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

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="space-y-3">
          <div>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>
              {analysisResult.jobTitle} · {analysisResult.resumeFileName}
            </CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">
            Overall match score: <span className="font-semibold text-foreground">{analysisResult.matchScore}%</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {formattedRecommendations.length > 0 ? (
            <ul className="space-y-3 text-sm text-muted-foreground">
              {formattedRecommendations.map((text, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="pt-0.5">•</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No personalized recommendations were generated for this analysis. Review the priority skills below to guide your next steps.
            </p>
          )}

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Priority Skills to Highlight</h3>
            {analysisResult.missingSkills.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {analysisResult.missingSkills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Great news! Your resume already covers all of the required skills for this role.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsPage;
