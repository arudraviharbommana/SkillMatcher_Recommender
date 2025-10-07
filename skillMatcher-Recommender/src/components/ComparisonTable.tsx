import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { ComparisonRow } from "@/types";

interface ComparisonTableProps {
  comparisonData: ComparisonRow[];
}

const matchTypeConfig = {
  "EXACT MATCH": {
    icon: <CheckCircle2 className="w-5 h-5 text-success" />,
    label: "Exact Match",
    color: "text-success",
  },
  "WEAK MATCH": {
    icon: <AlertCircle className="w-5 h-5 text-warning" />,
    label: "Weak Match",
    color: "text-warning",
  },
  "MISSING": {
    icon: <XCircle className="w-5 h-5 text-destructive" />,
    label: "Missing",
    color: "text-destructive",
  },
} as const;

const fallbackConfig = {
  icon: <AlertCircle className="w-5 h-5 text-muted-foreground" />,
  label: "Unclassified",
  color: "text-muted-foreground",
};

export function ComparisonTable({ comparisonData }: ComparisonTableProps) {
  if (!comparisonData || comparisonData.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No skills were found to compare.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="px-4 py-3 text-sm text-muted-foreground border-b bg-muted/40">
        Showing {comparisonData.length} job skill{comparisonData.length === 1 ? "" : "s"}.
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Resume Skill</TableHead>
            <TableHead className="w-1/3">Job Description Skill</TableHead>
            <TableHead>Match Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparisonData.map((row, index) => {
            const config = matchTypeConfig[row.matchType as keyof typeof matchTypeConfig] ?? fallbackConfig;

            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.resumeSkill || "—"}</TableCell>
                <TableCell className="font-medium">{row.jobSkill}</TableCell>
                <TableCell>
                  <div className={`flex items-center gap-2 ${config.color}`}>
                    {config.icon}
                    <span>{config.label}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{row.category || "General"}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={row.priority === "REQUIRED" ? "default" : "secondary"}>
                    {row.priority}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
