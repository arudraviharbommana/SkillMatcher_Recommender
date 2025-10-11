// @ts-ignore Deno remote import
import "https://deno.land/x/xhr@0.1.0/mod.ts";
// @ts-ignore Deno remote import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import similarity from 'string-similarity-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive skill database with categories
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
            "solidity": ["solidity", "ethereum"]
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
            "gradio": ["gradio"]
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
            "planetscale": ["planetscale"]
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
            "helm": ["helm"]
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
            "selenium": ["selenium"]
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
            "saml": ["saml"]
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
            "statistical analysis": ["statistical analysis"]
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
            "multitasking": ["multitasking"]
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
            "six sigma": ["six sigma"]
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
            "illustration": ["illustration"]
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
            "security best practices": ["security best practices"]
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
            "mobile ux": ["mobile ux"]
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
            "continuous testing": ["continuous testing"]
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
            "customer support": ["customer support"]
        }
    };

    // Method to retrieve skills by category
    getSkills(category: string): string[] {
        const skills = this.skillsData[category];
        return skills ? Object.keys(skills).flatMap(key => skills[key]) : [];
    }

    // Method to retrieve all skills
    getAllSkills(): string[] {
        return Object.values(this.skillsData).flatMap(category => 
            Object.values(category).flat()
        ).filter((value, index, self) => self.indexOf(value) === index);
    }

    // Method to find the category of a skill
    getSkillCategory(skill: string): string {
        const lowerSkill = skill.toLowerCase();
        for (const category in this.skillsData) {
            for (const primarySkill in this.skillsData[category]) {
                const aliases = this.skillsData[category][primarySkill];
                if (primarySkill === lowerSkill || aliases.includes(lowerSkill)) {
                    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                }
            }
        }
        return "Other"; // Default category if not found
    }
}

// Custom skill extractor class
class CustomSkillExtractor {
    skillDatabase: SkillDatabase;

    constructor() {
        this.skillDatabase = new SkillDatabase();
    }

    // Extract skills using enhanced pattern matching
    extractSkills(text: string): string[] {
        const lowerText = text.toLowerCase();
        const foundSkills = new Set<string>();
        const allSkills = this.skillDatabase.getAllSkills();

        allSkills.forEach(skill => {
            // Use a regex that matches whole words only to avoid partial matches (e.g., 'react' in 'reaction')
            const skillPattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            if (skillPattern.test(lowerText)) {
                // Find the canonical name for the skill
                for (const category in this.skillDatabase.skillsData) {
                    for (const primarySkill in this.skillDatabase.skillsData[category]) {
                        if (this.skillDatabase.skillsData[category][primarySkill].includes(skill)) {
                            foundSkills.add(primarySkill);
                            break;
                        }
                    }
                }
            }
        });
        
        // Also add generic terms that might not be in the DB but are clearly skills
        const genericTerms = lowerText.match(/\b[a-z-]{2,}\b/g) || [];
        const skillLikeTerms = new Set([...this.skillDatabase.getAllSkills()]);
        genericTerms.forEach(term => {
            if(skillLikeTerms.has(term)){
                foundSkills.add(term);
            }
        });


        return Array.from(foundSkills);
    }
}

// Custom job matcher class
class CustomJobMatcher {
    skillDatabase: SkillDatabase;

    constructor() {
        this.skillDatabase = new SkillDatabase();
    }
    
    // Calculate match score between resume and job description
    calculateMatchScore(resumeText: string, jdText: string) {
        const extractor = new CustomSkillExtractor();
        const resumeSkills = [...new Set(extractor.extractSkills(resumeText))];
        const jdSkills = [...new Set(extractor.extractSkills(jdText))];

        console.log("Extracted Resume Skills:", resumeSkills);
        console.log("Extracted JD Skills:", jdSkills);

        const matched: string[] = [];
        const missing: string[] = [];
        const comparison: any[] = [];
        const matchedResumeSkills = new Set<string>();

        jdSkills.forEach(jdSkill => {
            let bestMatch = { skill: null as string | null, score: 0 };
            resumeSkills.forEach(resumeSkill => {
                const score = similarity(jdSkill.toLowerCase(), resumeSkill.toLowerCase());
                if (score > bestMatch.score) {
                    bestMatch = { skill: resumeSkill, score: score };
                }
            });

            let matchType: "EXACT MATCH" | "WEAK MATCH" | "MISSING" = "MISSING";
            let resumeSkillForTable: string | null = null;

            if (bestMatch.score >= 0.9) { // High threshold for exact match
                matchType = "EXACT MATCH";
                resumeSkillForTable = bestMatch.skill;
                if(bestMatch.skill) matchedResumeSkills.add(bestMatch.skill);
                if (!matched.includes(jdSkill)) matched.push(jdSkill);
            } else if (bestMatch.score >= 0.6) { // Threshold for weak match
                matchType = "WEAK MATCH";
                resumeSkillForTable = bestMatch.skill;
                if(bestMatch.skill) matchedResumeSkills.add(bestMatch.skill);
                 if (!matched.includes(jdSkill)) matched.push(jdSkill); // Count weak matches as matched for score
            } else {
                missing.push(jdSkill);
            }

            comparison.push({
                resumeSkill: resumeSkillForTable,
                jobSkill: jdSkill,
                matchType: matchType,
                similarityScore: bestMatch.score,
                category: this.skillDatabase.getSkillCategory(jdSkill),
                priority: "REQUIRED" // Placeholder
            });
        });

        const extra = resumeSkills.filter(skill => !matchedResumeSkills.has(skill));

        const matchScore = jdSkills.length > 0 
            ? Math.round((matched.length / jdSkills.length) * 100) 
            : 0;

        return {
            matchedSkills: [...new Set(matched)],
            missingSkills: [...new Set(missing)],
            extraSkills: [...new Set(extra)],
            matchScore,
            comparison
        };
    }

    // Generate personalized recommendations
    generateRecommendations(missingSkills: string[], matchScore: number, matchedCount: number): any[] {
        const recommendations: any[] = [];

        // Score-based recommendations
        if (matchScore >= 90) {
            recommendations.push({ skill: "Overall", reason: "Outstanding match! You're an excellent fit for this role with almost all required skills."});
            recommendations.push({ skill: "Strategy", reason: "Focus on highlighting your experience with these technologies in your application."});
        } else if (matchScore >= 75) {
            recommendations.push({ skill: "Overall", reason: "Excellent match! You possess most of the required skills for this position."});
            recommendations.push({ skill: "Strategy", reason: "Your profile strongly aligns with the job requirements."});
        } else if (matchScore >= 60) {
            recommendations.push({ skill: "Overall", reason: "Good match! You have a solid foundation with room for targeted skill development."});
            recommendations.push({ skill: "Strategy", reason: "Consider emphasizing your transferable skills and learning abilities."});
        } else if (matchScore >= 40) {
            recommendations.push({ skill: "Overall", reason: "Moderate match. Consider strengthening key skills before applying."});
            recommendations.push({ skill: "Strategy", reason: "Focus on bridging the skill gaps through courses and practical projects."});
        } else {
            recommendations.push({ skill: "Overall", reason: "Significant skill development needed. This role may be too advanced currently."});
            recommendations.push({ skill: "Strategy", reason: "Build foundational skills first before targeting similar positions."});
        }

        // Missing skills recommendations
        if (missingSkills.length > 0) {
            const topMissing = missingSkills.slice(0, 5);
            recommendations.push({ skill: "Missing Skills", reason: `Priority skills to develop: ${topMissing.join(", ")}`});
            
            if (missingSkills.length <= 3) {
                recommendations.push({ skill: "Upskilling", reason: "The skill gap is manageable - you could quickly upskill through online courses or certifications."});
            } else if (missingSkills.length <= 6) {
                recommendations.push({ skill: "Upskilling", reason: "Consider a structured learning path to acquire these skills over 2-3 months."});
            } else {
                recommendations.push({ skill: "Upskilling", reason: "Extensive skill development required. Consider entry-level positions or intensive bootcamps."});
            }

            recommendations.push({ skill: "Resources", reason: "Look for free resources on platforms like Coursera, Udemy, or YouTube to learn these skills."});
        }

        // Application strategy
        if (matchScore >= 70) {
            recommendations.push({ skill: "Application", reason: "Strong candidate! Tailor your resume to emphasize matched skills prominently."});
            recommendations.push({ skill: "Interview", reason: "Prepare specific examples and achievements demonstrating each key skill."});
            recommendations.push({ skill: "Networking", reason: "Consider reaching out to the hiring manager or recruiter directly."});
        } else if (matchScore >= 50) {
            recommendations.push({ skill: "Application", reason: "Update your resume to highlight relevant projects that demonstrate related competencies."});
            recommendations.push({ skill: "Cover Letter", reason: "In your cover letter, address skill gaps and emphasize your ability to learn quickly."});
        }

        // Matched skills strategy
        if (matchedCount >= 10) {
            recommendations.push({ skill: "Matched Skills", reason: "You have strong breadth of relevant skills. Showcase depth through specific accomplishments."});
        } else if (matchedCount >= 5) {
            recommendations.push({ skill: "Matched Skills", reason: "Focus your application on your strongest matching skills with concrete examples."});
        }

        return recommendations;
    }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jdText, resumeFileName, jobTitle } = await req.json();

    if (!resumeText || !jdText) {
      return new Response(
        JSON.stringify({ error: 'Both resume and job description are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing resume...');
    console.log('Resume length:', resumeText.length);
    console.log('JD length:', jdText.length);

    const matcher = new CustomJobMatcher();
    const result = matcher.calculateMatchScore(resumeText, jdText);
    const recommendations = matcher.generateRecommendations(result.missingSkills, result.matchScore, result.matchedSkills.length);

    const fullResult = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      resumeFileName,
      jobTitle,
      ...result,
      recommendations,
    };

    return new Response(
      JSON.stringify(fullResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
