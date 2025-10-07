import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { storageUtils } from "@/utils/storage";
import { AnalysisResult, User } from "@/types";
import { toast } from "sonner";
import { Loader2, Upload, Briefcase, FileText, FileUp } from "lucide-react";
import { ResultsDisplay } from "./ResultsDisplay";
import { supabase } from "@/integrations/supabase/client";
import { extractTextFromPDF, readFileAsText } from "@/utils/pdfParser";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { buildComparisonRows } from "@/utils/comparisonBuilder";

interface AnalyzeViewProps {
  user: User;
  onAnalysisComplete: () => void;
}

export function AnalyzeView({ user, onAnalysisComplete }: AnalyzeViewProps) {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [jdFileName, setJdFileName] = useState("");
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isJdOpen, setIsJdOpen] = useState(false);

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFileName(file.name);
    
    try {
      let text = "";
      
      if (file.type === "application/pdf") {
        toast.info("Extracting text from PDF...");
        text = await extractTextFromPDF(file);
      } else if (file.type === "text/plain") {
        text = await readFileAsText(file);
      } else {
        toast.error("Please upload a .txt or .pdf file");
        return;
      }
      
      setResumeText(text);
      toast.success("Resume loaded successfully");
    } catch (error) {
      console.error("File upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load file");
      setResumeFileName("");
    }
  };

  const handleJDFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setJdFileName(file.name);
    
    try {
      let text = "";
      
      if (file.type === "application/pdf") {
        toast.info("Extracting text from PDF...");
        text = await extractTextFromPDF(file);
      } else if (file.type === "text/plain") {
        text = await readFileAsText(file);
      } else {
        toast.error("Please upload a .txt or .pdf file");
        return;
      }
      
      setJdText(text);
      toast.success("Job description loaded successfully");
    } catch (error) {
      console.error("File upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load file");
      setJdFileName("");
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jdText.trim() || !jobTitle.trim()) {
      toast.error("Please provide resume, job description, and job title");
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: {
          resumeText: resumeText.trim(),
          jdText: jdText.trim(),
          resumeFileName: resumeFileName || "Pasted Resume",
          jobTitle: jobTitle.trim(),
        }
      });

      if (error) throw error;

      const analysisResult: AnalysisResult = {
        id: data.id || Date.now().toString(),
        timestamp: data.timestamp || new Date().toISOString(),
        resumeFileName: resumeFileName || "Pasted Resume",
        jobTitle: jobTitle.trim(),
        matchScore: data.matchScore,
        matchedSkills: data.matchedSkills || [],
        missingSkills: data.missingSkills || [],
        extraSkills: data.extraSkills || [],
        recommendations: data.recommendations || [],
        comparison: Array.isArray(data.comparison) ? data.comparison : [],
      };

      const normalizedResult: AnalysisResult = {
        ...analysisResult,
        comparison: buildComparisonRows(analysisResult),
      };

      sessionStorage.setItem("analysisResult", JSON.stringify(normalizedResult));
      storageUtils.saveAnalysis(user.email, normalizedResult);
      setResults(normalizedResult);
      onAnalysisComplete();
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResumeText("");
    setJdText("");
    setResults(null);
    setJobTitle("");
    setResumeFileName("");
    setJdFileName("");
    setIsResumeOpen(false);
    setIsJdOpen(false);
  };

  if (results) {
    return <ResultsDisplay results={results} onReset={handleReset} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Resume & Job Match Analysis</h2>
        <p className="text-muted-foreground">Upload or paste your resume and job description for AI-powered analysis</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Your Resume
            </CardTitle>
            <CardDescription>Upload .txt or .pdf file, or paste text directly</CardDescription>
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
                <Label htmlFor="resume-file" className="cursor-pointer">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">
                      {resumeFileName || "Click to upload"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports .txt and .pdf files
                    </p>
                    <input
                      id="resume-file"
                      type="file"
                      accept=".txt,.pdf,application/pdf,text/plain"
                      onChange={handleResumeFileUpload}
                      className="hidden"
                    />
                  </div>
                </Label>
                {resumeText && (
                  <Collapsible open={isResumeOpen} onOpenChange={setIsResumeOpen} className="space-y-2">
                    <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                      <div className="text-sm text-success flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        Resume loaded ({resumeText.length} characters)
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0">
                          <ChevronDown className="h-4 w-4 transition-transform duration-200 ui-open:rotate-180" />
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <div className="prose prose-sm max-h-48 overflow-y-auto rounded-md border p-3 text-sm">
                        <p>{resumeText}</p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
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
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent" />
              Job Description
            </CardTitle>
            <CardDescription>Upload .txt or .pdf file, or paste text directly</CardDescription>
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
                <Label htmlFor="jd-file" className="cursor-pointer">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-accent transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">
                      {jdFileName || "Click to upload"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports .txt and .pdf files
                    </p>
                    <input
                      id="jd-file"
                      type="file"
                      accept=".txt,.pdf,application/pdf,text/plain"
                      onChange={handleJDFileUpload}
                      className="hidden"
                    />
                  </div>
                </Label>
                {jdText && (
                  <Collapsible open={isJdOpen} onOpenChange={setIsJdOpen} className="space-y-2">
                    <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                      <div className="text-sm text-success flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        Job description loaded ({jdText.length} characters)
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0">
                          <ChevronDown className="h-4 w-4 transition-transform duration-200 ui-open:rotate-180" />
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <div className="prose prose-sm max-h-48 overflow-y-auto rounded-md border p-3 text-sm">
                        <p>{jdText}</p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </TabsContent>
              <TabsContent value="paste">
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jdText}
                  onChange={(e) => {
                    setJdText(e.target.value);
                    setJdFileName("");
                  }}
                  className="min-h-[350px] resize-none"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 max-w-xl mx-auto">
        <Label htmlFor="job-title" className="text-lg font-semibold mb-2 block text-center">
          Job Title
        </Label>
        <Input
          id="job-title"
          placeholder="e.g., Senior Frontend Developer"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="text-base py-6"
        />
      </div>

      <div className="mt-8 text-center">
        <Button
          size="lg"
          onClick={handleAnalyze}
          disabled={isAnalyzing || !resumeText.trim() || !jdText.trim() || !jobTitle.trim()}
          className="px-8"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            "Analyze Match"
          )}
        </Button>
      </div>
    </div>
  );
}
