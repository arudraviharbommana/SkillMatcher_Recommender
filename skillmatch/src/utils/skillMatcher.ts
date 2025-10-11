// Common technical and professional skills database
const SKILL_DATABASE = [
  // Programming Languages
  "javascript", "python", "java", "typescript", "c++", "c#", "ruby", "php", "swift", "kotlin",
  "go", "rust", "scala", "r", "matlab", "sql", "html", "css",
  
  // Frameworks & Libraries
  "react", "angular", "vue", "node.js", "express", "django", "flask", "spring", "asp.net",
  "laravel", "rails", "jquery", "bootstrap", "tailwind", "redux", "next.js", "nuxt.js",
  
  // Databases
  "mongodb", "postgresql", "mysql", "redis", "elasticsearch", "cassandra", "oracle",
  "sql server", "dynamodb", "firebase",
  
  // Cloud & DevOps
  "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "gitlab", "github actions",
  "terraform", "ansible", "ci/cd", "devops", "cloud computing",
  
  // Tools & Technologies
  "git", "jira", "confluence", "postman", "figma", "adobe", "sketch", "linux", "unix",
  "bash", "powershell", "restful api", "graphql", "microservices", "agile", "scrum",
  
  // Data & AI
  "machine learning", "deep learning", "data analysis", "data science", "tensorflow",
  "pytorch", "pandas", "numpy", "scikit-learn", "nlp", "computer vision", "ai",
  
  // Soft Skills
  "communication", "leadership", "teamwork", "problem solving", "critical thinking",
  "project management", "time management", "collaboration", "presentation", "negotiation",
  
  // Business & Management
  "product management", "business analysis", "stakeholder management", "strategy",
  "marketing", "sales", "customer service", "business development", "financial analysis",
  
  // Design
  "ui design", "ux design", "graphic design", "web design", "user research", "prototyping",
  "wireframing", "responsive design", "accessibility",
  
  // Other
  "api development", "testing", "debugging", "documentation", "security", "performance optimization",
  "seo", "analytics", "monitoring", "automation", "excel", "powerpoint", "word processing"
];

export function extractSkills(text: string): string[] {
  const normalizedText = text.toLowerCase();
  const foundSkills = new Set<string>();

  SKILL_DATABASE.forEach(skill => {
    const skillPattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (skillPattern.test(normalizedText)) {
      foundSkills.add(skill);
    }
  });

  // Also extract capitalized words that might be skills
  const words = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
  words.forEach(word => {
    if (word.length > 2 && !['The', 'This', 'That', 'With', 'From'].includes(word)) {
      foundSkills.add(word.toLowerCase());
    }
  });

  return Array.from(foundSkills);
}

export function matchSkills(resumeSkills: string[], jdSkills: string[]) {
  const matched: string[] = [];
  const missing: string[] = [];
  const extra: string[] = [];

  const resumeSet = new Set(resumeSkills.map(s => s.toLowerCase()));
  const jdSet = new Set(jdSkills.map(s => s.toLowerCase()));

  // Find matched skills
  jdSkills.forEach(skill => {
    if (resumeSet.has(skill.toLowerCase())) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });

  // Find extra skills in resume
  resumeSkills.forEach(skill => {
    if (!jdSet.has(skill.toLowerCase())) {
      extra.push(skill);
    }
  });

  const matchScore = jdSkills.length > 0 
    ? Math.round((matched.length / jdSkills.length) * 100) 
    : 0;

  return {
    matchedSkills: matched,
    missingSkills: missing,
    extraSkills: extra,
    matchScore
  };
}

export function generateRecommendations(missingSkills: string[], matchScore: number): string[] {
  const recommendations: string[] = [];

  if (matchScore < 50) {
    recommendations.push("Your profile needs significant enhancement to match this role. Focus on acquiring the missing key skills.");
  } else if (matchScore < 75) {
    recommendations.push("You have a good foundation. Strengthening a few key areas will make your profile more competitive.");
  } else {
    recommendations.push("Excellent match! You possess most of the required skills for this position.");
  }

  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 3);
    recommendations.push(`Priority skills to develop: ${topMissing.join(", ")}`);
    
    recommendations.push("Consider taking online courses or certifications in these areas.");
    recommendations.push("Update your resume to highlight relevant projects and achievements.");
  }

  if (matchScore >= 75) {
    recommendations.push("Tailor your resume to emphasize the matched skills when applying.");
    recommendations.push("Prepare specific examples demonstrating your expertise in these areas for interviews.");
  }

  return recommendations;
}
