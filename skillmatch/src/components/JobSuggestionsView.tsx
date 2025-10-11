import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { storageUtils } from "@/utils/storage";
import { JobSuggestionResult, User } from "@/types";
import { generateJobSuggestions } from "@/utils/jobRecommender";
import { supabase } from "@/integrations/supabase/client";
import { extractTextFromPDF, extractTextFromDocx, readFileAsText } from "@/utils/pdfParser";
import { toast } from "sonner";
import {
  Briefcase,
  Clock,
  FileText,
  FileUp,
  History,
  Loader2,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";

const SESSION_RESULT_KEY = "jobSuggestionResult";

type DeleteTarget = "all" | string | null;

interface JobSuggestionsViewProps {
  user: User;
}

export function JobSuggestionsView({ user }: JobSuggestionsViewProps) {
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<JobSuggestionResult | null>(null);
  const [history, setHistory] = useState<JobSuggestionResult[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const isSupabaseConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY &&
      import.meta.env.VITE_SUPABASE_URL?.trim() !== "" &&
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() !== ""
  );

  useEffect(() => {
    const storedHistory = storageUtils.getJobSuggestions(user.email);
    setHistory(storedHistory);

    const storedResult = sessionStorage.getItem(SESSION_RESULT_KEY);
    if (storedResult) {
      try {
        const parsed: JobSuggestionResult = JSON.parse(storedResult);
        setResult(parsed);
      } catch (error) {
        console.warn("Failed to parse stored job suggestion result", error);
        sessionStorage.removeItem(SESSION_RESULT_KEY);
      }
    }
  }, [user.email]);

  useEffect(() => {
    if (result) {
      sessionStorage.setItem(SESSION_RESULT_KEY, JSON.stringify(result));
    } else {
      sessionStorage.removeItem(SESSION_RESULT_KEY);
    }
  }, [result]);

  const topMatches = useMemo(() => {
    if (!result?.recommendations) return [];
    return result.recommendations.slice(0, 3);
  }, [result]);

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFileName(file.name);

    try {
      let text = "";

      if (file.type === "application/pdf") {
        toast.info("Extracting text from PDF...");
        text = await extractTextFromPDF(file);
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.toLowerCase().endsWith(".docx")) {
        toast.info("Extracting text from DOCX...");
        text = await extractTextFromDocx(file);
      } else if (file.type === "text/plain") {
        text = await readFileAsText(file);
      } else {
        toast.error("Please upload a .txt, .pdf, or .docx file");
        return;
      }

      setResumeText(text);
      toast.success("Resume loaded successfully");
    } catch (error) {
      console.error("Resume upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load file");
      setResumeFileName("");
    }
  };

  const handleSuggestJobs = async () => {
    if (!resumeText.trim()) {
      toast.error("Please provide your resume content before requesting suggestions");
      return;
    }

    setIsLoading(true);

    const sanitizedResume = resumeText.trim();
    let normalizedResult: JobSuggestionResult | null = null;
    let remoteError: unknown = null;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.functions.invoke("recommend-job", {
          body: {
            resumeText: sanitizedResume,
            resumeFileName: resumeFileName || "Pasted Resume",
          },
        });

        if (error) throw error;

        normalizedResult = {
          id: data?.id || Date.now().toString(),
          timestamp: data?.timestamp || new Date().toISOString(),
          resumeFileName: data?.resumeFileName || resumeFileName || "Pasted Resume",
          resumeSummary: data?.resumeSummary || "",
          recommendations: Array.isArray(data?.recommendations)
            ? data.recommendations.map((rec: any) => ({
                jobTitle: rec?.jobTitle || "Untitled Role",
                matchScore: typeof rec?.matchScore === "number" ? rec.matchScore : 0,
                matchedSkills: Array.isArray(rec?.matchedSkills) ? rec.matchedSkills : [],
                missingCoreSkills: Array.isArray(rec?.missingCoreSkills) ? rec.missingCoreSkills : [],
                complementarySkills: Array.isArray(rec?.complementarySkills) ? rec.complementarySkills : [],
                summary: typeof rec?.summary === "string" ? rec.summary : "",
              }))
            : [],
        };
      } catch (err) {
        remoteError = err;
        console.error("Job suggestion API error:", err);
      }
    } else {
      remoteError = new Error("Supabase client is not configured");
    }

    if (!normalizedResult) {
      normalizedResult = generateJobSuggestions(sanitizedResume, resumeFileName || "Pasted Resume");
      const message = remoteError instanceof Error && remoteError.message
        ? `Using local suggestions (${remoteError.message}).`
        : "Supabase service unavailable. Served local suggestions.";
      toast.warning(message);
    } else {
      toast.success("Fresh job suggestions are ready for you!");
    }

    storageUtils.saveJobSuggestion(user.email, normalizedResult);
    setHistory(storageUtils.getJobSuggestions(user.email));
    setResult(normalizedResult);

    setIsLoading(false);
  };

  const handleReset = () => {
    setResumeText("");
    setResumeFileName("");
    setResult(null);
  };

  const handleSelectHistory = (suggestion: JobSuggestionResult) => {
    setResult(suggestion);
  };

  const handleDeleteSuggestion = () => {
    if (!deleteTarget) return;

    if (deleteTarget === "all") {
      storageUtils.deleteAllJobSuggestions(user.email);
      setHistory([]);
      toast.success("Cleared your job suggestion history.");
    } else {
      storageUtils.deleteJobSuggestion(user.email, deleteTarget);
      setHistory((prev) => prev.filter((item) => item.id !== deleteTarget));
      if (result?.id === deleteTarget) {
        setResult(null);
      }
      toast.success("Suggestion removed.");
    }

    setDeleteTarget(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Get Suitable Job Matches</h2>
        <p className="text-muted-foreground">
          Upload or paste your resume and let our knowledge engine reveal your best-fit roles.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Your Resume
              </CardTitle>
              <CardDescription>Provide your resume once — no job description needed.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">
                    <FileUp className="w-4 h-4 mr-2" />
                    Upload
                  </TabsTrigger>
                  <TabsTrigger value="paste">
                    <FileText className="w-4 h-4 mr-2" />
                    Paste
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="space-y-4">
                  <Label htmlFor="job-resume-file" className="cursor-pointer">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                      <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">
                        {resumeFileName || "Click to upload"}
                      </p>
                      <p className="text-xs text-muted-foreground">Supports .txt, .pdf, and .docx files</p>
                      <input
                        id="job-resume-file"
                        type="file"
                        accept=".txt,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                        onChange={handleResumeFileUpload}
                        className="hidden"
                      />
                    </div>
                  </Label>
                  {resumeText && (
                    <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
                      <p className="font-medium mb-1">Preview</p>
                      <p className="line-clamp-4 whitespace-pre-wrap">{resumeText}</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="paste">
                  <Textarea
                    placeholder="Paste your resume content here..."
                    value={resumeText}
                    onChange={(e) => {
                      setResumeText(e.target.value);
                      setResumeFileName("");
                    }}
                    className="min-h-[350px] resize-none"
                  />
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleSuggestJobs}
                  disabled={isLoading || !resumeText.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Finding matches...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Get job suggestions
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset} disabled={isLoading}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-secondary" />
                Suggested Roles
              </CardTitle>
              <CardDescription>
                We highlight the closest matches and the skills that strengthen your fit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="rounded-md border bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {result.resumeFileName} · {new Date(result.timestamp).toLocaleString()}
                    </p>
                    {result.resumeSummary ? (
                      <p className="text-sm">
                        <span className="font-semibold">Detected strengths:</span> {result.resumeSummary}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        We'll surface more insights once you upload a richer resume.
                      </p>
                    )}
                  </div>

                  {result.recommendations.length > 0 ? (
                    <div className="space-y-4">
                      {result.recommendations.map((rec) => (
                        <div key={`${result.id}-${rec.jobTitle}`} className="rounded-lg border p-4 hover:border-primary/50 transition-colors">
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                            <div>
                              <h4 className="text-lg font-semibold">{rec.jobTitle}</h4>
                              {rec.summary && <p className="text-sm text-muted-foreground">{rec.summary}</p>}
                            </div>
                            <div className="text-right">
                              <p className="text-xs uppercase tracking-wide text-muted-foreground">Match score</p>
                              <p className="text-2xl font-bold text-primary">{rec.matchScore}%</p>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-success mb-2">Strong matches</p>
                              <div className="flex flex-wrap gap-1">
                                {rec.matchedSkills.length ? (
                                  rec.matchedSkills.map((skill) => (
                                    <Badge key={skill} variant="outline" className="border-success text-success text-xs">
                                      {skill}
                                    </Badge>
                                  ))
                                ) : (
                                  <p className="text-xs text-muted-foreground">No direct overlaps yet.</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-warning mb-2">Missing core skills</p>
                              <div className="flex flex-wrap gap-1">
                                {rec.missingCoreSkills.length ? (
                                  rec.missingCoreSkills.map((skill) => (
                                    <Badge key={skill} variant="outline" className="border-warning text-warning text-xs">
                                      {skill}
                                    </Badge>
                                  ))
                                ) : (
                                  <p className="text-xs text-muted-foreground">You're covering all essentials.</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-accent mb-2">Bonus boosters</p>
                              <div className="flex flex-wrap gap-1">
                                {rec.complementarySkills.length ? (
                                  rec.complementarySkills.map((skill) => (
                                    <Badge key={skill} variant="outline" className="border-accent text-accent text-xs">
                                      {skill}
                                    </Badge>
                                  ))
                                ) : (
                                  <p className="text-xs text-muted-foreground">Consider adding complementary skills.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border border-dashed p-6 text-center text-muted-foreground">
                      <p>No tailored roles yet. Upload your resume to get started.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-md border border-dashed p-6 text-center text-muted-foreground">
                  <p>Upload or paste your resume to receive personalized job suggestions.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {result && topMatches.length > 0 && (
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Quick Win Opportunities
                </CardTitle>
                <CardDescription>
                  These roles are closest to your current strengths — start targeting them first.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  {topMatches.map((match) => (
                    <div key={`${result.id}-top-${match.jobTitle}`} className="rounded-lg border p-4 bg-muted/30">
                      <p className="text-sm font-semibold mb-2">{match.jobTitle}</p>
                      <p className="text-3xl font-bold text-primary">{match.matchScore}%</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {match.matchedSkills.slice(0, 3).join(", ") || "Build up core overlaps"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="shadow-medium">
          <CardHeader className="flex flex-row items-start justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-muted-foreground" />
                Suggestion History
              </CardTitle>
              <CardDescription>Revisit previous matches and track your progress.</CardDescription>
            </div>
            {history.length > 0 && (
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => setDeleteTarget("all")}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="rounded-md border border-dashed p-6 text-center text-muted-foreground">
                <p>No history yet. Generate job matches to build your personalized archive.</p>
              </div>
            ) : (
              <ScrollArea className="h-[560px] pr-3">
                <div className="space-y-4">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectHistory(item)}
                      className={`w-full text-left rounded-lg border p-4 transition-colors ${
                        result?.id === item.id ? "border-primary bg-primary/5" : "hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-sm">{item.resumeFileName}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(item.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {item.recommendations.slice(0, 3).map((rec) => (
                          <Badge key={`${item.id}-${rec.jobTitle}`} variant="secondary" className="text-xs">
                            {rec.jobTitle} · {rec.matchScore}%
                          </Badge>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteTarget !== null} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete job suggestions?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget === "all"
                ? "This will clear your entire job suggestion history."
                : "This suggestion will be permanently removed."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSuggestion} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
