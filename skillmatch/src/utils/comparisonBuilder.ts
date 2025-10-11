import { AnalysisResult, ComparisonRow } from "@/types";

const CATEGORY_RULES: { category: string; keywords: string[] }[] = [
  {
    category: "Programming Languages",
    keywords: [
      "python",
      "javascript",
      "typescript",
      "java",
      "c++",
      "c#",
      "ruby",
      "php",
      "swift",
      "kotlin",
      "go",
      "golang",
      "rust",
      "scala",
      "r",
      "matlab",
      "sql",
      "html",
      "css",
    ],
  },
  {
    category: "Frameworks & Libraries",
    keywords: [
      "react",
      "angular",
      "vue",
      "node",
      "node.js",
      "express",
      "django",
      "flask",
      "spring",
      "asp.net",
      "laravel",
      "rails",
      "jquery",
      "bootstrap",
      "tailwind",
      "next.js",
      "nuxt.js",
      "tensorflow",
      "pytorch",
      "scikit-learn",
      "keras",
    ],
  },
  {
    category: "Cloud & DevOps",
    keywords: [
      "aws",
      "azure",
      "gcp",
      "google cloud",
      "docker",
      "kubernetes",
      "jenkins",
      "terraform",
      "ansible",
      "devops",
      "ci/cd",
      "github actions",
      "gitlab",
    ],
  },
  {
    category: "Data & AI",
    keywords: [
      "machine learning",
      "deep learning",
      "data analysis",
      "data science",
      "nlp",
      "natural language processing",
      "computer vision",
      "ai",
      "artificial intelligence",
      "big data",
      "hadoop",
      "spark",
    ],
  },
  {
    category: "Soft Skills",
    keywords: [
      "communication",
      "leadership",
      "teamwork",
      "problem solving",
      "critical thinking",
      "project management",
      "time management",
      "collaboration",
      "presentation",
      "negotiation",
    ],
  },
  {
    category: "Business",
    keywords: [
      "product management",
      "business analysis",
      "stakeholder management",
      "strategy",
      "marketing",
      "sales",
      "customer service",
      "financial analysis",
      "business development",
    ],
  },
  {
    category: "Databases",
    keywords: [
      "postgresql",
      "mysql",
      "mongodb",
      "redis",
      "oracle",
      "sqlite",
      "dynamodb",
      "sql server",
      "firestore",
    ],
  },
];

const normalize = (skill: string) => skill.toLowerCase().trim();

function inferCategory(skill: string): string {
  const normalized = normalize(skill);

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => normalized === keyword)) {
      return rule.category;
    }

    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.category;
    }
  }

  return "General";
}

export function buildComparisonRows(analysis: Pick<AnalysisResult, "matchedSkills" | "missingSkills" | "comparison">): ComparisonRow[] {
  if (analysis.comparison && analysis.comparison.length > 0) {
    return analysis.comparison;
  }

  const rows: ComparisonRow[] = [];

  analysis.matchedSkills.forEach((skill) => {
    rows.push({
      resumeSkill: skill,
      jobSkill: skill,
      matchType: "EXACT MATCH",
      similarityScore: 1,
      category: inferCategory(skill),
      priority: "REQUIRED",
    });
  });

  analysis.missingSkills.forEach((skill) => {
    rows.push({
      resumeSkill: null,
      jobSkill: skill,
      matchType: "MISSING",
      similarityScore: 0,
      category: inferCategory(skill),
      priority: "REQUIRED",
    });
  });

  return rows;
}
