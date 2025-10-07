import similarity from 'string-similarity-js';

class SkillDatabase {
    skillsData: Record<string, Record<string, string[]>> = {
        "programming_languages": {
            "python": ["python", "py", "python3", "django", "flask", "fastapi"],
            "javascript": ["javascript", "js", "node.js", "nodejs", "es6", "es2015"],
            "java": ["java", "spring", "spring boot", "hibernate"],
            "typescript": ["typescript", "ts", "angular", "nest.js"],
            "react": ["react", "reactjs", "react.js", "jsx", "next.js", "gatsby"],
            "vue": ["vue", "vue.js", "vuejs", "nuxt.js"],
            "angular": ["angular", "angularjs", "angular2+"],
            "php": ["php", "laravel", "symfony", "wordpress"],
            "c++": ["c++", "cpp", "c plus plus"],
            "c#": ["c#", "csharp", "c sharp", ".net", "asp.net"],
            "go": ["go", "golang"],
            "rust": ["rust", "rustlang"],
            "swift": ["swift", "ios", "xcode"],
            "kotlin": ["kotlin", "android"],
            "ruby": ["ruby", "rails", "ruby on rails"],
            "scala": ["scala", "akka", "play framework"],
            "r": ["r programming", "r language", "rstudio"],
            "matlab": ["matlab", "simulink"],
            "sql": ["sql", "mysql", "postgresql", "sqlite", "oracle", "sql server"]
        },
        "frameworks_libraries": {
            "react": ["react", "reactjs", "react.js", "jsx"],
            "angular": ["angular", "angularjs"],
            "vue": ["vue", "vue.js", "vuejs"],
            "django": ["django", "django rest framework"],
            "flask": ["flask", "flask-restful"],
            "express": ["express", "express.js", "expressjs"],
            "spring": ["spring", "spring boot", "spring mvc"],
            "tensorflow": ["tensorflow", "tf", "keras"],
            "pytorch": ["pytorch", "torch"],
            "scikit-learn": ["scikit-learn", "sklearn", "scikit learn"],
            "pandas": ["pandas", "pd"],
            "numpy": ["numpy", "np"],
            "bootstrap": ["bootstrap", "bootstrap4", "bootstrap5"],
            "tailwind": ["tailwind", "tailwindcss", "tailwind css"],
            "jquery": ["jquery", "jquery ui"]
        },
        "databases": {
            "mysql": ["mysql", "mariadb"],
            "postgresql": ["postgresql", "postgres", "psql"],
            "mongodb": ["mongodb", "mongo", "mongoose"],
            "redis": ["redis", "redis cache"],
            "elasticsearch": ["elasticsearch", "elastic search", "elk stack"],
            "cassandra": ["cassandra", "apache cassandra"],
            "dynamodb": ["dynamodb", "dynamo db"],
            "sqlite": ["sqlite", "sqlite3"],
            "oracle": ["oracle", "oracle db"],
            "neo4j": ["neo4j", "graph database"],
            "influxdb": ["influxdb", "influx"],
            "couchdb": ["couchdb", "couch db"]
        },
        "cloud_platforms": {
            "aws": ["aws", "amazon web services", "ec2", "s3", "lambda", "cloudformation"],
            "azure": ["azure", "microsoft azure", "azure functions"],
            "gcp": ["gcp", "google cloud", "google cloud platform"],
            "docker": ["docker", "containerization", "dockerfile"],
            "kubernetes": ["kubernetes", "k8s", "kubectl"],
            "terraform": ["terraform", "infrastructure as code"],
            "ansible": ["ansible", "configuration management"],
            "jenkins": ["jenkins", "ci/cd", "continuous integration"]
        },
        "tools_technologies": {
            "git": ["git", "github", "gitlab", "bitbucket", "version control"],
            "linux": ["linux", "ubuntu", "centos", "debian", "unix"],
            "docker": ["docker", "containerization", "docker-compose"],
            "kubernetes": ["kubernetes", "k8s", "container orchestration"],
            "nginx": ["nginx", "web server", "reverse proxy"],
            "apache": ["apache", "apache2", "httpd"],
            "elasticsearch": ["elasticsearch", "search engine"],
            "kafka": ["kafka", "apache kafka", "message queue"],
            "rabbitmq": ["rabbitmq", "message broker"],
            "graphql": ["graphql", "graph ql", "apollo"],
            "rest": ["rest", "restful", "rest api", "api"],
            "microservices": ["microservices", "micro services", "service oriented"]
        },
        "data_science": {
            "machine_learning": ["machine learning", "ml", "artificial intelligence", "ai"],
            "deep_learning": ["deep learning", "neural networks", "cnn", "rnn", "lstm"],
            "data_analysis": ["data analysis", "data analytics", "statistical analysis"],
            "python_data": ["pandas", "numpy", "matplotlib", "seaborn", "plotly"],
            "r_data": ["r programming", "ggplot2", "dplyr", "tidyr"],
            "big_data": ["big data", "spark", "hadoop", "pyspark"],
            "nlp": ["nlp", "natural language processing", "text mining", "sentiment analysis"],
            "computer_vision": ["computer vision", "opencv", "image processing"]
        },
        "soft_skills": {
            "leadership": ["leadership", "team lead", "project management", "scrum master"],
            "communication": ["communication", "presentation", "documentation", "technical writing"],
            "problem_solving": ["problem solving", "analytical thinking", "troubleshooting"],
            "agile": ["agile", "scrum", "kanban", "sprint planning"],
            "teamwork": ["teamwork", "collaboration", "cross-functional"]
        }
    };

    getAllSkills(): Set<string> {
        const allSkills = new Set<string>();
        for (const category in this.skillsData) {
            for (const skill in this.skillsData[category]) {
                this.skillsData[category][skill].forEach(s => allSkills.add(s));
            }
        }
        return allSkills;
    }

    findSkillCategory(skill: string): string {
        const skillLower = skill.toLowerCase();
        for (const categoryName in this.skillsData) {
            for (const mainSkill in this.skillsData[categoryName]) {
                if (this.skillsData[categoryName][mainSkill].map(s => s.toLowerCase()).includes(skillLower)) {
                    return categoryName;
                }
            }
        }
        return "other";
    }

    isRelated(skillA: string, skillB: string): boolean {
        const relations: Record<string, string[]> = {
            "artificial intelligence": ["machine learning", "deep learning", "nlp", "computer vision", "ai"],
            "machine learning": ["deep learning", "supervised learning", "unsupervised learning", "tensorflow", "pytorch", "scikit-learn"],
            "python": ["django", "flask", "fastapi", "pandas", "numpy"],
            "javascript": ["react", "angular", "vue", "node.js", "typescript"],
            "devops": ["docker", "kubernetes", "ci/cd", "jenkins", "terraform", "ansible"],
            "cloud": ["aws", "azure", "gcp"],
        };

        const findParents = (skill: string, allRelations: Record<string, string[]>): string[] => {
            const parents: string[] = [];
            for (const parent in allRelations) {
                if (allRelations[parent].includes(skill)) {
                    parents.push(parent);
                    parents.push(...findParents(parent, allRelations));
                }
            }
            return parents;
        };

        const skillALower = skillA.toLowerCase();
        const skillBLower = skillB.toLowerCase();

        if (skillALower === skillBLower) return true;

        const aParents = findParents(skillALower, relations);
        const bParents = findParents(skillBLower, relations);

        if (aParents.includes(skillBLower) || bParents.includes(skillALower)) return true;

        if (aParents.some(p => bParents.includes(p))) return true;

        for (const parent in relations) {
            const children = relations[parent];
            if (children.includes(skillALower) && children.includes(skillBLower)) return true;
        }

        return false;
    }
}

class CustomSkillExtractor {
    skillDb = new SkillDatabase();
    allSkills = this.skillDb.getAllSkills();
    patterns = {
        'years_experience': /(\d+)[\+\s]*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/g,
        'skill_with_years': /(\w+(?:\.\w+)*)\s*[:-]\s*(\d+)[\+\s]*(?:years?|yrs?)/g,
        'frameworks': /(?:using|with|in)\s+([A-Za-z][A-Za-z0-9\.\-\+#]*)/g,
        'technologies': /(?:technologies?|tools?|platforms?)[:\s]+([^,.;!?]+)/g,
        'programming_languages': /(?:programming\s+)?(?:languages?|lang)[:\s]+([^,.;!?]+)/g,
    };

    extractSkillsFromText(text: string): any {
        const textLower = text.toLowerCase();
        const foundSkills: Record<string, any> = {};
        const skillCategories: Record<string, string[]> = {};

        this.allSkills.forEach(skill => {
            if (this._fuzzyMatch(skill, textLower)) {
                const confidence = this._calculateConfidence(skill, textLower);
                if (confidence > 0.6) {
                    const category = this.skillDb.findSkillCategory(skill);
                    foundSkills[skill] = {
                        'confidence': confidence,
                        'category': category,
                        'context': this._extractContext(skill, text, 50)
                    };
                    if (!skillCategories[category]) {
                        skillCategories[category] = [];
                    }
                    skillCategories[category].push(skill);
                }
            }
        });

        const experienceInfo = this._extractExperience(text);

        return {
            'skills': foundSkills,
            'categories': skillCategories,
            'experience': experienceInfo,
            'total_skills': Object.keys(foundSkills).length,
            'top_categories': this._getTopCategories(skillCategories)
        };
    }

    private _fuzzyMatch(skill: string, text: string, threshold: number = 0.8): boolean {
        const skillLower = skill.toLowerCase();
        if (text.includes(skillLower)) {
            return true;
        }
        if (new RegExp(`\\b${skillLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`).test(text)) {
            return true;
        }
        if (skill.length > 3) {
            const words = text.split(/\s+/);
            for (const word of words) {
                if (similarity(skillLower, word) > threshold) {
                    return true;
                }
            }
        }
        return false;
    }

    private _calculateConfidence(skill: string, text: string): number {
        const skillLower = skill.toLowerCase();
        let confidence = 0.0;
        if (text.includes(skillLower)) {
            confidence += 0.5;
        }
        if (new RegExp(`\\b${skillLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`).test(text)) {
            confidence += 0.3;
        }

        const contextPatterns = [
            `${skillLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}.*experience`,
            `experience.*${skillLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`,
            `${skillLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}.*years?`,
            `proficient.*${skillLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`,
            `expert.*${skillLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`,
        ];

        for (const pattern of contextPatterns) {
            if (new RegExp(pattern).test(text)) {
                confidence += 0.2;
                break;
            }
        }

        const frequency = (text.match(new RegExp(skillLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "g")) || []).length;
        confidence += Math.min(frequency * 0.1, 0.3);

        return Math.min(confidence, 1.0);
    }

    private _extractContext(skill: string, text: string, window: number = 50): string {
        const skillLower = skill.toLowerCase();
        const textLower = text.toLowerCase();

        const index = textLower.indexOf(skillLower);
        if (index === -1) {
            return "";
        }

        const start = Math.max(0, index - window);
        const end = Math.min(text.length, index + skill.length + window);

        return text.substring(start, end).trim();
    }

    private _extractExperience(text: string): any {
        const experienceInfo: any = {
            'total_years': 0,
            'skill_experience': {},
            'experience_level': 'entry'
        };

        let match;
        while ((match = this.patterns['years_experience'].exec(text.toLowerCase())) !== null) {
            experienceInfo['total_years'] = Math.max(experienceInfo['total_years'], parseInt(match[1]));
        }
        
        while ((match = this.patterns['skill_with_years'].exec(text.toLowerCase())) !== null) {
            experienceInfo['skill_experience'][match[1]] = parseInt(match[2]);
        }

        const total_years = experienceInfo['total_years'];
        if (total_years >= 8) {
            experienceInfo['experience_level'] = 'senior';
        } else if (total_years >= 3) {
            experienceInfo['experience_level'] = 'mid';
        } else {
            experienceInfo['experience_level'] = 'entry';
        }

        return experienceInfo;
    }

    private _getTopCategories(skillCategories: Record<string, string[]>, topN: number = 3): any[] {
        const categoryCounts = Object.keys(skillCategories).map(category => ({ category, count: skillCategories[category].length }));
        const sortedCategories = categoryCounts.sort((a, b) => b.count - a.count);
        const totalSkills = categoryCounts.reduce((sum, cat) => sum + cat.count, 0);

        return sortedCategories.slice(0, topN).map(({ category, count }) => ({
            category,
            count,
            percentage: totalSkills > 0 ? Math.round(count / totalSkills * 100) : 0
        }));
    }
}

export class CustomJobMatcher {
    skillExtractor = new CustomSkillExtractor();
    skillDb = new SkillDatabase();
    similarityMap: Record<string, [string, number][]> = {};

    constructor() {
        this._buildSimilarityMap();
    }

    private _buildSimilarityMap() {
        for (const cat in this.skillDb.skillsData) {
            if (cat === 'frameworks_libraries') {
                for (const mainSkill in this.skillDb.skillsData[cat]) {
                    if (['tensorflow', 'pytorch', 'scikit-learn'].includes(mainSkill)) {
                        if (!this.similarityMap[mainSkill]) this.similarityMap[mainSkill] = [];
                        this.similarityMap[mainSkill].push(['deep_learning', 0.3]);
                        this.similarityMap[mainSkill].push(['machine_learning', 0.4]);
                    }
                    if (['pandas', 'numpy'].includes(mainSkill)) {
                        if (!this.similarityMap[mainSkill]) this.similarityMap[mainSkill] = [];
                        this.similarityMap[mainSkill].push(['data_analysis', 0.5]);
                    }
                    if (['matplotlib', 'seaborn', 'plotly'].includes(mainSkill)) {
                        if (!this.similarityMap[mainSkill]) this.similarityMap[mainSkill] = [];
                        this.similarityMap[mainSkill].push(['data_visualization', 0.7]);
                    }
                }
            }
            if (cat === 'data_science') {
                for (const mainSkill in this.skillDb.skillsData[cat]) {
                    if (mainSkill === 'python_data') {
                        this.skillDb.skillsData[cat][mainSkill].forEach(s => {
                            if (!this.similarityMap[s]) this.similarityMap[s] = [];
                            this.similarityMap[s].push(['data_analysis', 0.6]);
                            this.similarityMap[s].push(['data_visualization', 0.6]);
                        });
                    }
                }
            }
        }
    }

    getComparisonView(resumeText: string, jobDescription: string): any {
        const resumeAnalysis = this.skillExtractor.extractSkillsFromText(resumeText);
        const jobAnalysis = this.skillExtractor.extractSkillsFromText(jobDescription);

        const resumeSkills = new Set(Object.keys(resumeAnalysis.skills));
        const jobSkills = new Set(Object.keys(jobAnalysis.skills));

        const comparison: any[] = [];

        const exactMatches = new Set([...resumeSkills].filter(x => jobSkills.has(x)));
        exactMatches.forEach(skill => {
            const jobSkillInfo = jobAnalysis.skills[skill];
            comparison.push({
                "resumeSkill": skill,
                "jobSkill": skill,
                "matchType": "EXACT MATCH",
                "similarityScore": 1.0,
                "category": jobSkillInfo.category,
                "priority": jobSkillInfo.confidence > 0.7 ? "REQUIRED" : "MENTIONED"
            });
        });

        const resumeSkillsForWeakMatch = new Set([...resumeSkills].filter(x => !exactMatches.has(x)));
        const jobSkillsForWeakMatch = new Set([...jobSkills].filter(x => !exactMatches.has(x)));

        resumeSkillsForWeakMatch.forEach(rSkill => {
            if (this.similarityMap[rSkill]) {
                this.similarityMap[rSkill].forEach(([jSkillTarget, score]) => {
                    let foundInJob = false;
                    jobSkillsForWeakMatch.forEach(js => {
                        const targetSynonyms = this.skillDb.skillsData.data_science?.[jSkillTarget] || [];
                        if (js === jSkillTarget || targetSynonyms.includes(js)) {
                            foundInJob = true;
                            const jobSkillInfo = jobAnalysis.skills[js];
                            comparison.push({
                                "resumeSkill": rSkill,
                                "jobSkill": js,
                                "matchType": "WEAK MATCH",
                                "similarityScore": score,
                                "category": jobSkillInfo.category,
                                "priority": jobSkillInfo.confidence > 0.7 ? "REQUIRED" : "MENTIONED"
                            });
                        }
                    });
                    if (!foundInJob && jobDescription.toLowerCase().includes('data visualization') && jSkillTarget === 'data_visualization') {
                        comparison.push({
                            "resumeSkill": rSkill,
                            "jobSkill": "Data Visualization",
                            "matchType": "WEAK MATCH",
                            "similarityScore": score,
                            "category": "Data Science & AI",
                            "priority": "REQUIRED"
                        });
                    }
                });
            }
        });

        comparison.sort((a, b) => b.similarityScore - a.similarityScore);

        return { "comparison": comparison };
    }

    calculateMatchScore(resumeText: string, jobDescription: string): any {
        const comparisonData = this.getComparisonView(resumeText, jobDescription);
        const resumeAnalysis = this.skillExtractor.extractSkillsFromText(resumeText);
        const jobAnalysis = this.skillExtractor.extractSkillsFromText(jobDescription);

        const resumeSkills = new Set(Object.keys(resumeAnalysis.skills));
        const jobSkills = new Set(Object.keys(jobAnalysis.skills));

        const intersection = new Set([...resumeSkills].filter(x => jobSkills.has(x)));
        const union = new Set([...resumeSkills, ...jobSkills]);

        const jaccardSimilarity = union.size > 0 ? intersection.size / union.size : 0;
        const precision = resumeSkills.size > 0 ? intersection.size / resumeSkills.size : 0;
        const recall = jobSkills.size > 0 ? intersection.size / jobSkills.size : 0;
        const f1Score = (precision + recall) > 0 ? 2 * (precision * recall) / (precision + recall) : 0;

        const weightedScore = this._calculateWeightedScore(resumeAnalysis, jobAnalysis, intersection);
        const experienceMatch = this._matchExperience(resumeAnalysis.experience, jobAnalysis.experience);
        const categoryMatch = this._matchCategories(resumeAnalysis.categories, jobAnalysis.categories);

        const missingSkills = new Set([...jobSkills].filter(x => !resumeSkills.has(x)));
        const extraSkills = new Set([...resumeSkills].filter(x => !jobSkills.has(x)));

        const overallScore = (
            weightedScore * 0.4 +
            f1Score * 0.3 +
            experienceMatch * 0.2 +
            categoryMatch * 0.1
        );

        return {
            'overallScore': Math.round(overallScore * 100),
            'detailed_scores': {
                'skill_match': Math.round(jaccardSimilarity * 100),
                'precision': Math.round(precision * 100),
                'recall': Math.round(recall * 100),
                'f1_score': Math.round(f1Score * 100),
                'weighted_score': Math.round(weightedScore * 100),
                'experience_match': Math.round(experienceMatch * 100),
                'category_match': Math.round(categoryMatch * 100)
            },
            'matched_skills': Array.from(intersection),
            'missing_skills': Array.from(missingSkills),
            'extra_skills': Array.from(extraSkills),
            'skill_gaps': this._analyzeSkillGaps(missingSkills, jobAnalysis),
            'recommendations': this._generateRecommendations(missingSkills, resumeAnalysis, jobAnalysis),
            'comparison': comparisonData.comparison
        };
    }

    private _calculateWeightedScore(resumeAnalysis: any, jobAnalysis: any, intersection: Set<string>): number {
        if (intersection.size === 0) {
            return 0.0;
        }

        let totalWeight = 0.0;
        let matchedWeight = 0.0;

        for (const skill in jobAnalysis.skills) {
            const importance = jobAnalysis.skills[skill].confidence;
            totalWeight += importance;

            if (intersection.has(skill)) {
                const resumeConfidence = resumeAnalysis.skills[skill].confidence;
                matchedWeight += importance * resumeConfidence;
            }
        }

        return totalWeight > 0 ? matchedWeight / totalWeight : 0.0;
    }

    private _matchExperience(resumeExp: any, jobExp: any): number {
        const resumeYears = resumeExp.total_years || 0;
        const jobYears = jobExp.total_years || 0;

        if (jobYears === 0) {
            return 1.0;
        }

        return resumeYears >= jobYears ? 1.0 : resumeYears / jobYears;
    }

    private _matchCategories(resumeCategories: any, jobCategories: any): number {
        if (Object.keys(jobCategories).length === 0) {
            return 1.0;
        }

        let matchedCategories = 0;
        const totalCategories = Object.keys(jobCategories).length;

        for (const category in jobCategories) {
            if (resumeCategories[category]) {
                matchedCategories++;
            }
        }

        return matchedCategories / totalCategories;
    }

    private _analyzeSkillGaps(missingSkills: Set<string>, jobAnalysis: any): any[] {
        const gaps: any[] = [];

        missingSkills.forEach(skill => {
            if (jobAnalysis.skills[skill]) {
                const gapInfo = {
                    'skill': skill,
                    'importance': jobAnalysis.skills[skill].confidence,
                    'category': jobAnalysis.skills[skill].category,
                    'priority': jobAnalysis.skills[skill].confidence > 0.8 ? 'high' : 'medium'
                };
                gaps.push(gapInfo);
            }
        });

        gaps.sort((a, b) => b.importance - a.importance);
        return gaps;
    }

    private _generateRecommendations(missingSkills: Set<string>, resumeAnalysis: any, jobAnalysis: any): any[] {
        const recommendations: any[] = [];
        const gaps = this._analyzeSkillGaps(missingSkills, jobAnalysis);

        gaps.forEach(gap => {
            recommendations.push({
                "skill": gap.skill,
                "priority": gap.priority,
                "reason": `This is a ${gap.priority} priority skill for the job, based on its importance in the description.`
            });
        });

        const resumeExp = resumeAnalysis.experience.total_years;
        const jobExp = jobAnalysis.experience.total_years || 0;
        if (jobExp > resumeExp && jobExp > 0) {
            recommendations.push({
                "skill": "Industry Experience",
                "priority": "High",
                "reason": `The job requires ${jobExp} years of experience, and your resume shows ${resumeExp} years. Gaining more project experience is key.`
            });
        }

        return recommendations;
    }
}
