 // @ts-ignore Deno remote import
import "https://deno.land/x/xhr@0.1.0/mod.ts";
// @ts-ignore Deno remote import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

class SkillDatabase {
  skillsData: Record<string, Record<string, string[]>> = {
    "programming_languages": {
      "python": ["python", "py", "python3", "django", "flask", "fastapi"],
      "javascript": ["javascript", "js", "node.js", "express"],
      "java": ["java", "spring", "spring boot"],
      "typescript": ["typescript", "ts", "angular", "vue", "react"],
      "c++": ["c++", "cpp"],
      "c#": ["c#", "asp.net"],
      "ruby": ["ruby", "rails", "ruby on rails"],
      "php": ["php", "laravel"],
      "swift": ["swift", "ios"],
      "kotlin": ["kotlin", "android"],
      "go": ["go", "golang"],
      "rust": ["rust"],
      "scala": ["scala", "spark"],
      "r": ["r", "shiny"],
      "matlab": ["matlab"],
      "sql": ["sql", "mysql", "postgresql", "sqlite"],
      "html": ["html", "css"],
      "bash": ["bash", "shell"],
      "powershell": ["powershell"],
      "perl": ["perl"],
      "dart": ["dart", "flutter"],
      "objective-c": ["objective-c", "ios"],
      "groovy": ["groovy"],
      "lua": ["lua"],
      "assembly": ["assembly"],
      "vhdl": ["vhdl"],
      "verilog": ["verilog"],
      "solidity": ["solidity", "ethereum"],
    },
    "frameworks_libraries": {
      "react": ["react", "reactjs", "react.js", "jsx"],
      "angular": ["angular", "angularjs"],
      "vue": ["vue", "vue.js", "vuejs"],
      "django": ["django", "django rest framework"],
      "flask": ["flask", "flask-restful"],
      "express": ["express", "express.js", "expressjs"],
      "spring": ["spring", "spring boot", "spring mvc"],
      "asp.net": ["asp.net"],
      "laravel": ["laravel"],
      "rails": ["rails", "ruby on rails"],
      "jquery": ["jquery"],
      "bootstrap": ["bootstrap"],
      "tailwind": ["tailwind", "tailwind css"],
      "next.js": ["next.js"],
      "nuxt.js": ["nuxt.js"],
      "nest.js": ["nest.js"],
      "electron": ["electron"],
      "react native": ["react native"],
      "flutter": ["flutter"],
      "xamarin": ["xamarin"],
      "ionic": ["ionic"],
      "cordova": ["cordova"],
      "meteor": ["meteor"],
      "struts": ["struts"],
      "hibernate": ["hibernate"],
      "pytorch": ["pytorch"],
      "tensorflow": ["tensorflow", "tf", "keras"],
      "scikit-learn": ["scikit-learn"],
      "pandas": ["pandas"],
      "numpy": ["numpy"],
      "streamlit": ["streamlit"],
      "gradio": ["gradio"],
    },
    "databases": {
      "mongodb": ["mongodb"],
      "postgresql": ["postgresql"],
      "mysql": ["mysql"],
      "redis": ["redis"],
      "elasticsearch": ["elasticsearch"],
      "cassandra": ["cassandra"],
      "oracle": ["oracle"],
      "sql server": ["sql server"],
      "dynamodb": ["dynamodb"],
      "firebase": ["firebase"],
      "firestore": ["firestore"],
      "couchdb": ["couchdb"],
      "neo4j": ["neo4j"],
      "mariadb": ["mariadb"],
      "sqlite": ["sqlite"],
      "influxdb": ["influxdb"],
      "timescaledb": ["timescaledb"],
      "cockroachdb": ["cockroachdb"],
      "supabase": ["supabase"],
      "planetscale": ["planetscale"],
    },
    "cloud": {
      "aws": ["aws", "amazon web services"],
      "azure": ["azure", "microsoft azure"],
      "gcp": ["gcp", "google cloud"],
      "google cloud": ["google cloud"],
      "docker": ["docker"],
      "kubernetes": ["kubernetes"],
      "jenkins": ["jenkins"],
      "gitlab": ["gitlab"],
      "github actions": ["github actions"],
      "terraform": ["terraform"],
      "ansible": ["ansible"],
      "ci/cd": ["ci/cd"],
      "devops": ["devops"],
      "cloud computing": ["cloud computing"],
      "heroku": ["heroku"],
      "digitalocean": ["digitalocean"],
      "vercel": ["vercel"],
      "netlify": ["netlify"],
      "cloudflare": ["cloudflare"],
      "lambda": ["lambda"],
      "ec2": ["ec2"],
      "s3": ["s3"],
      "cloud functions": ["cloud functions"],
      "cloud run": ["cloud run"],
      "app engine": ["app engine"],
      "ecs": ["ecs"],
      "eks": ["eks"],
      "aks": ["aks"],
      "openshift": ["openshift"],
      "rancher": ["rancher"],
      "helm": ["helm"],
    },
    "tools": {
      "git": ["git"],
      "github": ["github"],
      "bitbucket": ["bitbucket"],
      "jira": ["jira"],
      "confluence": ["confluence"],
      "trello": ["trello"],
      "asana": ["asana"],
      "slack": ["slack"],
      "postman": ["postman"],
      "insomnia": ["insomnia"],
      "figma": ["figma"],
      "sketch": ["sketch"],
      "adobe xd": ["adobe xd"],
      "photoshop": ["photoshop"],
      "illustrator": ["illustrator"],
      "linux": ["linux"],
      "unix": ["unix"],
      "vim": ["vim"],
      "emacs": ["emacs"],
      "vscode": ["vscode"],
      "intellij": ["intellij"],
      "eclipse": ["eclipse"],
      "visual studio": ["visual studio"],
      "xcode": ["xcode"],
      "webpack": ["webpack"],
      "vite": ["vite"],
      "rollup": ["rollup"],
      "parcel": ["parcel"],
      "babel": ["babel"],
      "eslint": ["eslint"],
      "prettier": ["prettier"],
      "jest": ["jest"],
      "mocha": ["mocha"],
      "cypress": ["cypress"],
      "selenium": ["selenium"],
    },
    "architecture": {
      "restful api": ["restful api", "rest api"],
      "graphql": ["graphql"],
      "microservices": ["microservices"],
      "monolithic": ["monolithic"],
      "serverless": ["serverless"],
      "soa": ["soa"],
      "event-driven": ["event-driven"],
      "message queue": ["message queue", "rabbitmq", "kafka"],
      "api gateway": ["api gateway"],
      "load balancing": ["load balancing"],
      "caching": ["caching"],
      "cdn": ["cdn"],
      "websockets": ["websockets"],
      "grpc": ["grpc"],
      "soap": ["soap"],
      "json": ["json"],
      "xml": ["xml"],
      "oauth": ["oauth"],
      "jwt": ["jwt"],
      "saml": ["saml"],
    },
    "data_science": {
      "machine learning": ["machine learning", "ml"],
      "deep learning": ["deep learning", "dl"],
      "data analysis": ["data analysis"],
      "data science": ["data science"],
      "artificial intelligence": ["artificial intelligence", "ai"],
      "nlp": ["nlp", "natural language processing"],
      "computer vision": ["computer vision"],
      "neural networks": ["neural networks", "cnn", "rnn", "lstm"],
      "transformer": ["transformer"],
      "bert": ["bert"],
      "gpt": ["gpt"],
      "reinforcement learning": ["reinforcement learning"],
      "supervised learning": ["supervised learning"],
      "unsupervised learning": ["unsupervised learning"],
      "data mining": ["data mining"],
      "big data": ["big data", "hadoop", "spark"],
      "data visualization": ["data visualization", "tableau", "power bi", "matplotlib", "seaborn", "plotly", "d3.js"],
      "statistical analysis": ["statistical analysis"],
    },
    "soft_skills": {
      "communication": ["communication"],
      "leadership": ["leadership"],
      "teamwork": ["teamwork", "team collaboration"],
      "problem solving": ["problem solving"],
      "critical thinking": ["critical thinking"],
      "analytical thinking": ["analytical thinking"],
      "project management": ["project management"],
      "time management": ["time management"],
      "collaboration": ["collaboration"],
      "presentation": ["presentation", "public speaking"],
      "negotiation": ["negotiation"],
      "conflict resolution": ["conflict resolution"],
      "mentoring": ["mentoring"],
      "coaching": ["coaching"],
      "adaptability": ["adaptability"],
      "creativity": ["creativity"],
      "innovation": ["innovation"],
      "decision making": ["decision making"],
      "emotional intelligence": ["emotional intelligence"],
      "stress management": ["stress management"],
      "attention to detail": ["attention to detail"],
      "multitasking": ["multitasking"],
    },
    "business": {
      "product management": ["product management"],
      "business analysis": ["business analysis", "business analyst"],
      "stakeholder management": ["stakeholder management"],
      "strategy": ["strategy", "strategic planning"],
      "marketing": ["marketing", "digital marketing"],
      "sales": ["sales"],
      "customer service": ["customer service"],
      "business development": ["business development"],
      "financial analysis": ["financial analysis"],
      "budgeting": ["budgeting"],
      "forecasting": ["forecasting"],
      "roi analysis": ["roi analysis"],
      "market research": ["market research"],
      "competitive analysis": ["competitive analysis"],
      "business intelligence": ["business intelligence"],
      "crm": ["crm", "salesforce"],
      "kpi": ["kpi", "okr", "metrics"],
      "analytics": ["analytics", "reporting"],
      "requirements gathering": ["requirements gathering"],
      "agile": ["agile", "scrum", "kanban"],
      "waterfall": ["waterfall"],
      "prince2": ["prince2"],
      "pmp": ["pmp"],
      "lean": ["lean"],
      "six sigma": ["six sigma"],
    },
    "design": {
      "ui design": ["ui design", "user interface"],
      "ux design": ["ux design", "user experience"],
      "graphic design": ["graphic design"],
      "web design": ["web design"],
      "mobile design": ["mobile design"],
      "user research": ["user research"],
      "usability testing": ["usability testing"],
      "prototyping": ["prototyping"],
      "wireframing": ["wireframing"],
      "responsive design": ["responsive design"],
      "accessibility": ["accessibility", "wcag"],
      "design thinking": ["design thinking"],
      "design systems": ["design systems"],
      "interaction design": ["interaction design"],
      "visual design": ["visual design"],
      "typography": ["typography"],
      "color theory": ["color theory"],
      "branding": ["branding"],
      "illustration": ["illustration"],
    },
    "security": {
      "cybersecurity": ["cybersecurity"],
      "information security": ["information security"],
      "network security": ["network security"],
      "application security": ["application security"],
      "penetration testing": ["penetration testing"],
      "ethical hacking": ["ethical hacking"],
      "vulnerability assessment": ["vulnerability assessment"],
      "security audit": ["security audit"],
      "encryption": ["encryption", "cryptography"],
      "ssl": ["ssl", "tls"],
      "firewall": ["firewall"],
      "vpn": ["vpn"],
      "ids": ["ids"],
      "ips": ["ips"],
      "siem": ["siem"],
      "compliance": ["compliance", "gdpr", "hipaa", "pci dss", "iso 27001"],
      "owasp": ["owasp"],
      "security best practices": ["security best practices"],
    },
    "mobile": {
      "ios development": ["ios development", "swift", "objective-c"],
      "android development": ["android development", "java", "kotlin"],
      "mobile development": ["mobile development"],
      "mobile app development": ["mobile app development"],
      "react native": ["react native"],
      "flutter": ["flutter"],
      "xamarin": ["xamarin"],
      "ionic": ["ionic"],
      "cordova": ["cordova"],
      "phonegap": ["phonegap"],
      "app store": ["app store"],
      "google play": ["google play"],
      "mobile ui": ["mobile ui"],
      "mobile ux": ["mobile ux"],
    },
    "testing": {
      "testing": ["testing", "qa", "quality assurance"],
      "test automation": ["test automation"],
      "unit testing": ["unit testing"],
      "integration testing": ["integration testing"],
      "e2e testing": ["e2e testing", "end-to-end testing"],
      "regression testing": ["regression testing"],
      "performance testing": ["performance testing"],
      "load testing": ["load testing"],
      "stress testing": ["stress testing"],
      "security testing": ["security testing"],
      "manual testing": ["manual testing"],
      "test cases": ["test cases"],
      "test plans": ["test plans"],
      "bug tracking": ["bug tracking"],
      "defect management": ["defect management"],
      "tdd": ["tdd"],
      "bdd": ["bdd"],
      "continuous testing": ["continuous testing"],
    },
    "other": {
      "api development": ["api development"],
      "backend development": ["backend development"],
      "frontend development": ["frontend development"],
      "full stack development": ["full stack development", "full-stack"],
      "debugging": ["debugging"],
      "documentation": ["documentation"],
      "technical writing": ["technical writing"],
      "code review": ["code review"],
      "performance optimization": ["performance optimization"],
      "scalability": ["scalability"],
      "seo": ["seo"],
      "sem": ["sem"],
      "google analytics": ["google analytics"],
      "monitoring": ["monitoring"],
      "logging": ["logging"],
      "observability": ["observability"],
      "automation": ["automation"],
      "scripting": ["scripting"],
      "excel": ["excel"],
      "powerpoint": ["powerpoint"],
      "word": ["word"],
      "microsoft office": ["microsoft office"],
      "google workspace": ["google workspace"],
      "spreadsheets": ["spreadsheets"],
      "data entry": ["data entry"],
      "customer support": ["customer support"],
    },
  };

  getAllSkills(): string[] {
    return Object.values(this.skillsData)
      .flatMap((category) => Object.values(category).flat())
      .filter((value, index, self) => self.indexOf(value) === index);
  }
}

class CustomSkillExtractor {
  skillDatabase: SkillDatabase;

  constructor() {
    this.skillDatabase = new SkillDatabase();
  }

  extractSkills(text: string): string[] {
    const lowerText = text.toLowerCase();
    const foundSkills = new Set<string>();
    const allSkills = this.skillDatabase.getAllSkills();

    allSkills.forEach((skill) => {
      const skillPattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      if (skillPattern.test(lowerText)) {
        foundSkills.add(skill);
      }
    });

    const genericTerms = lowerText.match(/\b[a-z-]{2,}\b/g) || [];
    genericTerms.forEach((term) => {
      if (allSkills.includes(term)) {
        foundSkills.add(term);
      }
    });

    return Array.from(foundSkills);
  }
}

interface JobProfile {
  title: string;
  summary: string;
  coreSkills: string[];
  complementarySkills: string[];
}

const jobProfiles: JobProfile[] = [
  {
    title: "Frontend Engineer",
    summary: "Build engaging, accessible, and performant user interfaces.",
    coreSkills: ["javascript", "typescript", "react", "html", "css", "tailwind"],
    complementarySkills: ["next.js", "redux", "testing", "jest", "cypress", "ux design"],
  },
  {
    title: "Backend Engineer",
    summary: "Design scalable APIs, services, and data pipelines.",
    coreSkills: ["node.js", "express", "python", "java", "sql", "restful api"],
    complementarySkills: ["microservices", "docker", "kubernetes", "aws", "graphql", "redis"],
  },
  {
    title: "Full Stack Developer",
    summary: "Own features end-to-end across frontend and backend layers.",
    coreSkills: ["javascript", "typescript", "react", "node.js", "express", "sql"],
    complementarySkills: ["next.js", "graphql", "docker", "aws", "testing", "tailwind"],
  },
  {
    title: "Data Scientist",
    summary: "Leverage statistical models to uncover insights and drive business decisions.",
    coreSkills: ["python", "pandas", "numpy", "scikit-learn", "data analysis", "machine learning"],
  complementarySkills: ["tensorflow", "pytorch", "nlp", "computer vision", "sql", "power bi"],
  },
  {
    title: "Machine Learning Engineer",
    summary: "Productionize ML models with robust pipelines and monitoring.",
    coreSkills: ["python", "tensorflow", "pytorch", "ml", "model deployment", "docker"],
  complementarySkills: ["mlops", "kubernetes", "aws", "feature engineering", "monitoring", "data pipelines"],
  },
  {
    title: "DevOps Engineer",
    summary: "Automate infrastructure, CI/CD, and observability capabilities.",
    coreSkills: ["devops", "ci/cd", "docker", "kubernetes", "aws", "terraform"],
    complementarySkills: ["ansible", "monitoring", "logging", "security", "sre", "scripting"],
  },
  {
    title: "Product Manager",
    summary: "Translate customer needs into product strategy and roadmaps.",
    coreSkills: ["product management", "stakeholder management", "roadmap", "agile", "user research", "analytics"],
    complementarySkills: ["market research", "strategy", "data analysis", "communication", "presentation", "kpi"],
  },
  {
    title: "UI/UX Designer",
    summary: "Craft intuitive digital experiences through research and design systems.",
    coreSkills: ["ux design", "ui design", "wireframing", "prototyping", "figma", "user research"],
    complementarySkills: ["design systems", "accessibility", "usability testing", "visual design", "interaction design", "communication"],
  },
  {
    title: "Data Engineer",
    summary: "Develop resilient data platforms powering analytics and ML workloads.",
    coreSkills: ["python", "sql", "spark", "hadoop", "data pipelines", "etl"],
    complementarySkills: ["aws", "kafka", "airflow", "data warehousing", "scala", "dbt"],
  },
  {
    title: "Security Engineer",
    summary: "Protect systems through secure architecture, testing, and monitoring.",
    coreSkills: ["security", "cybersecurity", "network security", "encryption", "vulnerability assessment", "penetration testing"],
    complementarySkills: ["aws", "scripting", "incident response", "siem", "compliance", "risk management"],
  },
];

// Improved semantic scoring using fuzzy matching and frequency weighting
function stringSimilarity(a: string, b: string): number {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a === b) return 1;
  if (!a.length || !b.length) return 0;
  // Simple Jaccard similarity for now
  const aSet = new Set(a.split(/\W+/));
  const bSet = new Set(b.split(/\W+/));
  const intersection = new Set([...aSet].filter(x => bSet.has(x)));
  const union = new Set([...aSet, ...bSet]);
  return intersection.size / union.size;
}

function scoreJobFit(resumeSkills: string[]): {
  jobTitle: string;
  matchScore: number;
  matchedSkills: string[];
  missingCoreSkills: string[];
  complementarySkills: string[];
  summary: string;
}[] {
  // Build a frequency map for resume skills
  const freqMap: Record<string, number> = {};
  resumeSkills.forEach(skill => {
    const key = skill.toLowerCase();
    freqMap[key] = (freqMap[key] || 0) + 1;
  });

  return jobProfiles.map((profile) => {
    // Fuzzy match core skills
    const coreMatches: string[] = [];
    const missingCore: string[] = [];
    let coreScoreSum = 0;
    profile.coreSkills.forEach((coreSkill) => {
      let bestScore = 0;
      let bestMatch = "";
      for (const resumeSkill of resumeSkills) {
        const sim = stringSimilarity(coreSkill, resumeSkill);
        if (sim > bestScore) {
          bestScore = sim;
          bestMatch = resumeSkill;
        }
      }
      if (bestScore > 0.7) { // threshold for fuzzy match
        coreMatches.push(bestMatch);
        coreScoreSum += bestScore * (freqMap[bestMatch.toLowerCase()] || 1);
      } else {
        missingCore.push(coreSkill);
      }
    });
    // Fuzzy match complementary skills
    const complementaryMatches: string[] = [];
    let complementaryScoreSum = 0;
    profile.complementarySkills.forEach((compSkill) => {
      let bestScore = 0;
      let bestMatch = "";
      for (const resumeSkill of resumeSkills) {
        const sim = stringSimilarity(compSkill, resumeSkill);
        if (sim > bestScore) {
          bestScore = sim;
          bestMatch = resumeSkill;
        }
      }
      if (bestScore > 0.7) {
        complementaryMatches.push(bestMatch);
        complementaryScoreSum += bestScore * (freqMap[bestMatch.toLowerCase()] || 1);
      }
    });

    // Weighted score: core 75%, complementary 25%, normalized by skill count
    const coreScore = profile.coreSkills.length > 0 ? coreScoreSum / profile.coreSkills.length : 0;
    const complementaryScore = profile.complementarySkills.length > 0 ? complementaryScoreSum / profile.complementarySkills.length : 0;
    const blendedScore = Math.round((coreScore * 0.75 + complementaryScore * 0.25) * 100);

    const matchedSkills = Array.from(new Set([...coreMatches, ...complementaryMatches]));

    return {
      jobTitle: profile.title,
      matchScore: blendedScore,
      matchedSkills,
      missingCoreSkills: missingCore,
      complementarySkills: complementaryMatches,
      summary: profile.summary,
    };
  })
  .filter((recommendation) => recommendation.matchScore > 0 || recommendation.matchedSkills.length > 0)
  .sort((a, b) => b.matchScore - a.matchScore)
  .slice(0, 5);
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, resumeFileName } = await req.json();

    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: "Resume text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const extractor = new CustomSkillExtractor();
    const resumeSkills = [...new Set(extractor.extractSkills(resumeText))];

    // Fallback: if nothing extracted, surface top keywords via simple frequency
    const fallbackSkillsMatches = resumeText.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const fallbackSkills: Record<string, number> = {};
    fallbackSkillsMatches.forEach((word: string) => {
      fallbackSkills[word] = (fallbackSkills[word] || 0) + 1;
    });

    const topWords = Object.entries(fallbackSkills)
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word)
      .filter((word) => word.length > 3 && !resumeSkills.includes(word))
      .slice(0, 10);

    const allSkills = resumeSkills.length > 0 ? resumeSkills : topWords;

    const recommendations = scoreJobFit(allSkills);

    const resumeSummary = allSkills.slice(0, 12).join(", ");

    const result = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      resumeFileName: resumeFileName || "Uploaded Resume",
      resumeSummary,
      recommendations,
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in recommend-job function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
