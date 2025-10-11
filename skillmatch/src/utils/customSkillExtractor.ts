import similarity from 'string-similarity-js';

type CategoryLabel =
    | 'Technical / Analytical'
    | 'Business / Management'
    | 'Creative / Design'
    | 'Academic / Teaching'
    | 'Communication / Soft Skills';

type RelatedSkill = {
    skill: string;
    weight?: number;
};

type CanonicalMeta = {
    canonical: string;
    category: CategoryLabel;
    synonyms: string[];
    related: RelatedSkill[];
    isDomainTerm: boolean;
    source: 'technical' | 'nonTechnical';
};

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

    nonTechnicalSkills: Record<string, {
        category: CategoryLabel;
        synonyms: string[];
        related?: RelatedSkill[];
        isDomainTerm?: boolean;
    }> = {
        'Financial Modelling': {
            category: 'Business / Management',
            synonyms: ['financial modelling', 'financial modeling', 'financial projections', 'valuation modelling', 'valuation modeling'],
            related: [
                { skill: 'Budget Forecasting', weight: 0.75 },
                { skill: 'Scenario Analysis', weight: 0.7 },
            ],
            isDomainTerm: true,
        },
        'Budget Forecasting': {
            category: 'Business / Management',
            synonyms: ['budget forecasting', 'budget planning', 'financial forecasting'],
            related: [
                { skill: 'Financial Modelling', weight: 0.72 },
                { skill: 'Risk Analysis', weight: 0.6 },
            ],
        },
        'Scenario Analysis': {
            category: 'Technical / Analytical',
            synonyms: ['scenario analysis', 'what-if analysis', 'sensitivity analysis'],
            related: [
                { skill: 'Financial Modelling', weight: 0.65 },
                { skill: 'Risk Analysis', weight: 0.62 },
            ],
            isDomainTerm: true,
        },
        'Risk Analysis': {
            category: 'Technical / Analytical',
            synonyms: ['risk analysis', 'risk assessment', 'risk evaluation', 'risk management'],
            related: [
                { skill: 'Compliance Management', weight: 0.6 },
                { skill: 'Scenario Analysis', weight: 0.6 },
            ],
        },
        'Market Research': {
            category: 'Business / Management',
            synonyms: ['market research', 'market analysis', 'competitive analysis'],
            related: [
                { skill: 'Customer Insights', weight: 0.6 },
                { skill: 'Go-to-Market Strategy', weight: 0.6 },
            ],
        },
        'Strategic Planning': {
            category: 'Business / Management',
            synonyms: ['strategic planning', 'strategy development', 'business strategy'],
            related: [
                { skill: 'Go-to-Market Strategy', weight: 0.65 },
                { skill: 'Operational Excellence', weight: 0.6 },
            ],
        },
        'Go-to-Market Strategy': {
            category: 'Business / Management',
            synonyms: ['go-to-market strategy', 'gtm strategy', 'market entry strategy'],
            related: [
                { skill: 'Product Positioning', weight: 0.65 },
                { skill: 'Market Research', weight: 0.6 },
            ],
            isDomainTerm: true,
        },
        'Stakeholder Management': {
            category: 'Business / Management',
            synonyms: ['stakeholder management', 'stakeholder engagement', 'stakeholder coordination'],
            related: [
                { skill: 'Communication Strategy', weight: 0.58 },
                { skill: 'Change Management', weight: 0.6 },
            ],
        },
        'Project Management': {
            category: 'Business / Management',
            synonyms: ['project management', 'program management', 'portfolio management'],
            related: [
                { skill: 'Resource Planning', weight: 0.6 },
                { skill: 'Risk Analysis', weight: 0.55 },
            ],
        },
        'Resource Planning': {
            category: 'Business / Management',
            synonyms: ['resource planning', 'capacity planning', 'workforce planning'],
            related: [
                { skill: 'Project Management', weight: 0.6 },
            ],
        },
        'People Management': {
            category: 'Business / Management',
            synonyms: ['people management', 'talent management', 'team supervision', 'staff management'],
            related: [
                { skill: 'Team Leadership', weight: 0.72 },
                { skill: 'Performance Management', weight: 0.65 },
            ],
        },
        'Team Leadership': {
            category: 'Communication / Soft Skills',
            synonyms: ['team leadership', 'team lead', 'leading teams'],
            related: [
                { skill: 'People Management', weight: 0.72 },
                { skill: 'Coaching & Mentorship', weight: 0.62 },
            ],
        },
        'Performance Management': {
            category: 'Business / Management',
            synonyms: ['performance management', 'kpi tracking', 'goal setting'],
            related: [
                { skill: 'People Management', weight: 0.6 },
            ],
        },
        'Change Management': {
            category: 'Business / Management',
            synonyms: ['change management', 'organizational change', 'transformation management'],
            related: [
                { skill: 'Stakeholder Management', weight: 0.6 },
                { skill: 'Communication Strategy', weight: 0.6 },
            ],
        },
        'Compliance Management': {
            category: 'Business / Management',
            synonyms: ['compliance management', 'regulatory compliance', 'audit readiness'],
            related: [
                { skill: 'Risk Analysis', weight: 0.62 },
                { skill: 'Financial Reporting', weight: 0.58 },
            ],
        },
        'Financial Reporting': {
            category: 'Business / Management',
            synonyms: ['financial reporting', 'management reporting', 'month-end close'],
            related: [
                { skill: 'Compliance Management', weight: 0.58 },
                { skill: 'Financial Modelling', weight: 0.55 },
            ],
        },
        'Operational Excellence': {
            category: 'Business / Management',
            synonyms: ['operational excellence', 'lean operations', 'continuous improvement'],
            related: [
                { skill: 'Process Optimization', weight: 0.65 },
                { skill: 'Strategic Planning', weight: 0.55 },
            ],
        },
        'Process Optimization': {
            category: 'Technical / Analytical',
            synonyms: ['process optimization', 'process improvement', 'lean process', 'continuous improvement'],
            related: [
                { skill: 'Operational Excellence', weight: 0.65 },
                { skill: 'Six Sigma', weight: 0.6 },
            ],
        },
        'Six Sigma': {
            category: 'Technical / Analytical',
            synonyms: ['six sigma', 'lean six sigma'],
            related: [
                { skill: 'Process Optimization', weight: 0.6 },
            ],
        },
        'Customer Insights': {
            category: 'Business / Management',
            synonyms: ['customer insights', 'consumer insights'],
            related: [
                { skill: 'Market Research', weight: 0.6 },
                { skill: 'Communication Strategy', weight: 0.55 },
            ],
        },
        'Product Positioning': {
            category: 'Business / Management',
            synonyms: ['product positioning', 'brand positioning'],
            related: [
                { skill: 'Go-to-Market Strategy', weight: 0.6 },
                { skill: 'Marketing Communications', weight: 0.55 },
            ],
        },
        'Brand Identity': {
            category: 'Creative / Design',
            synonyms: ['brand identity', 'visual identity', 'branding guidelines'],
            related: [
                { skill: 'Logo Design', weight: 0.78 },
                { skill: 'Art Direction', weight: 0.68 },
            ],
            isDomainTerm: true,
        },
        'Logo Design': {
            category: 'Creative / Design',
            synonyms: ['logo design', 'identity design', 'brand marks'],
            related: [
                { skill: 'Brand Identity', weight: 0.78 },
                { skill: 'Typography', weight: 0.55 },
            ],
            isDomainTerm: true,
        },
        'Typography': {
            category: 'Creative / Design',
            synonyms: ['typography', 'font selection'],
            related: [
                { skill: 'Logo Design', weight: 0.55 },
                { skill: 'Brand Identity', weight: 0.5 },
            ],
        },
        'Art Direction': {
            category: 'Creative / Design',
            synonyms: ['art direction', 'creative direction', 'visual direction'],
            related: [
                { skill: 'Brand Identity', weight: 0.68 },
                { skill: 'Creative Strategy', weight: 0.6 },
            ],
        },
        'Creative Strategy': {
            category: 'Creative / Design',
            synonyms: ['creative strategy', 'campaign strategy', 'concept development'],
            related: [
                { skill: 'Campaign Development', weight: 0.6 },
                { skill: 'Art Direction', weight: 0.6 },
            ],
        },
        'Campaign Development': {
            category: 'Creative / Design',
            synonyms: ['campaign development', 'campaign management', 'integrated campaigns'],
            related: [
                { skill: 'Creative Strategy', weight: 0.6 },
                { skill: 'Marketing Communications', weight: 0.55 },
            ],
        },
        'Content Writing': {
            category: 'Creative / Design',
            synonyms: ['content writing', 'blog writing', 'long-form content'],
            related: [
                { skill: 'Copywriting', weight: 0.65 },
                { skill: 'Editorial Planning', weight: 0.6 },
            ],
        },
        'Copywriting': {
            category: 'Creative / Design',
            synonyms: ['copywriting', 'sales copy', 'persuasive writing'],
            related: [
                { skill: 'Content Writing', weight: 0.65 },
                { skill: 'Storytelling', weight: 0.6 },
            ],
        },
        'Editorial Planning': {
            category: 'Creative / Design',
            synonyms: ['editorial planning', 'content calendar', 'content planning'],
            related: [
                { skill: 'Content Writing', weight: 0.6 },
                { skill: 'Marketing Communications', weight: 0.55 },
            ],
        },
        'Storytelling': {
            category: 'Communication / Soft Skills',
            synonyms: ['storytelling', 'narrative design', 'brand storytelling'],
            related: [
                { skill: 'Presentation Skills', weight: 0.58 },
                { skill: 'Content Writing', weight: 0.6 },
            ],
        },
        'UX Research': {
            category: 'Creative / Design',
            synonyms: ['ux research', 'user research', 'user interviews', 'usability testing'],
            related: [
                { skill: 'Design Thinking', weight: 0.62 },
                { skill: 'Journey Mapping', weight: 0.6 },
            ],
            isDomainTerm: true,
        },
        'Design Thinking': {
            category: 'Creative / Design',
            synonyms: ['design thinking', 'human-centered design', 'human centred design', 'service design'],
            related: [
                { skill: 'UX Research', weight: 0.62 },
                { skill: 'Journey Mapping', weight: 0.6 },
            ],
        },
        'Journey Mapping': {
            category: 'Creative / Design',
            synonyms: ['journey mapping', 'customer journey mapping', 'experience mapping'],
            related: [
                { skill: 'UX Research', weight: 0.6 },
                { skill: 'Design Thinking', weight: 0.6 },
            ],
        },
        'Curriculum Planning': {
            category: 'Academic / Teaching',
            synonyms: ['curriculum planning', 'curriculum design', 'programme development', 'program development'],
            related: [
                { skill: 'Instructional Design', weight: 0.7 },
                { skill: 'Assessment Design', weight: 0.65 },
            ],
            isDomainTerm: true,
        },
        'Instructional Design': {
            category: 'Academic / Teaching',
            synonyms: ['instructional design', 'learning experience design', 'course design'],
            related: [
                { skill: 'Curriculum Planning', weight: 0.7 },
                { skill: 'Learning Outcomes', weight: 0.6 },
            ],
        },
        'Assessment Design': {
            category: 'Academic / Teaching',
            synonyms: ['assessment design', 'evaluation strategy', 'rubric creation'],
            related: [
                { skill: 'Curriculum Planning', weight: 0.65 },
                { skill: 'Curriculum Assessment', weight: 0.6 },
            ],
            isDomainTerm: true,
        },
        'Curriculum Assessment': {
            category: 'Academic / Teaching',
            synonyms: ['curriculum assessment', 'programme evaluation', 'program evaluation'],
            related: [
                { skill: 'Assessment Design', weight: 0.6 },
            ],
        },
        'Learning Outcomes': {
            category: 'Academic / Teaching',
            synonyms: ['learning outcomes', 'learning objectives', 'educational outcomes'],
            related: [
                { skill: 'Instructional Design', weight: 0.6 },
            ],
        },
        'Workshop Facilitation': {
            category: 'Academic / Teaching',
            synonyms: ['workshop facilitation', 'training facilitation', 'learning facilitation'],
            related: [
                { skill: 'Instructional Design', weight: 0.58 },
                { skill: 'Communication Strategy', weight: 0.55 },
            ],
        },
        'Academic Research': {
            category: 'Academic / Teaching',
            synonyms: ['academic research', 'scholarly research', 'literature review'],
            related: [
                { skill: 'Research Methodology', weight: 0.68 },
                { skill: 'Data Analysis', weight: 0.6 },
            ],
            isDomainTerm: true,
        },
        'Research Methodology': {
            category: 'Academic / Teaching',
            synonyms: ['research methodology', 'research design', 'qualitative research', 'quantitative research'],
            related: [
                { skill: 'Academic Research', weight: 0.68 },
                { skill: 'Data Analysis', weight: 0.6 },
            ],
        },
        'Mentorship': {
            category: 'Academic / Teaching',
            synonyms: ['mentorship', 'mentoring', 'training & mentorship'],
            related: [
                { skill: 'Coaching & Mentorship', weight: 0.7 },
                { skill: 'Team Leadership', weight: 0.62 },
            ],
        },
        'Coaching & Mentorship': {
            category: 'Communication / Soft Skills',
            synonyms: ['coaching', 'leadership coaching', 'talent coaching', 'coaching and mentorship'],
            related: [
                { skill: 'People Management', weight: 0.68 },
                { skill: 'Mentorship', weight: 0.7 },
            ],
        },
        'Communication Strategy': {
            category: 'Communication / Soft Skills',
            synonyms: ['communication strategy', 'comms strategy', 'messaging strategy'],
            related: [
                { skill: 'Marketing Communications', weight: 0.6 },
                { skill: 'Stakeholder Management', weight: 0.58 },
            ],
        },
        'Marketing Communications': {
            category: 'Communication / Soft Skills',
            synonyms: ['marketing communications', 'marcom', 'brand communications'],
            related: [
                { skill: 'Communication Strategy', weight: 0.6 },
                { skill: 'Campaign Development', weight: 0.55 },
            ],
        },
        'Public Relations': {
            category: 'Communication / Soft Skills',
            synonyms: ['public relations', 'pr', 'media relations'],
            related: [
                { skill: 'Communication Strategy', weight: 0.6 },
                { skill: 'Crisis Communication', weight: 0.65 },
            ],
        },
        'Crisis Communication': {
            category: 'Communication / Soft Skills',
            synonyms: ['crisis communication', 'issue management', 'reputation management'],
            related: [
                { skill: 'Public Relations', weight: 0.65 },
            ],
            isDomainTerm: true,
        },
        'Presentation Skills': {
            category: 'Communication / Soft Skills',
            synonyms: ['presentation skills', 'public speaking', 'executive presentations'],
            related: [
                { skill: 'Communication Coaching', weight: 0.6 },
                { skill: 'Storytelling', weight: 0.58 },
            ],
        },
        'Communication Coaching': {
            category: 'Communication / Soft Skills',
            synonyms: ['communication coaching', 'speech coaching', 'presentation coaching'],
            related: [
                { skill: 'Presentation Skills', weight: 0.6 },
            ],
        },
        'Negotiation': {
            category: 'Communication / Soft Skills',
            synonyms: ['negotiation', 'contract negotiation', 'influence and persuasion', 'influence & persuasion'],
            related: [
                { skill: 'Stakeholder Management', weight: 0.58 },
                { skill: 'Conflict Resolution', weight: 0.55 },
            ],
        },
        'Conflict Resolution': {
            category: 'Communication / Soft Skills',
            synonyms: ['conflict resolution', 'mediation', 'dispute management'],
            related: [
                { skill: 'Team Collaboration', weight: 0.55 },
                { skill: 'Negotiation', weight: 0.55 },
            ],
        },
        'Team Collaboration': {
            category: 'Communication / Soft Skills',
            synonyms: ['team collaboration', 'cross-functional collaboration', 'teamwork'],
            related: [
                { skill: 'Conflict Resolution', weight: 0.55 },
                { skill: 'Stakeholder Management', weight: 0.5 },
            ],
        },
        'Emotional Intelligence': {
            category: 'Communication / Soft Skills',
            synonyms: ['emotional intelligence', 'eq', 'empathy'],
            related: [
                { skill: 'Coaching & Mentorship', weight: 0.6 },
                { skill: 'Leadership', weight: 0.58 },
            ],
        },
        'Leadership': {
            category: 'Communication / Soft Skills',
            synonyms: ['leadership', 'executive leadership', 'leadership development'],
            related: [
                { skill: 'Team Leadership', weight: 0.68 },
                { skill: 'People Management', weight: 0.62 },
            ],
        },
        'Marketing': {
            category: 'Business / Management',
            synonyms: ['marketing', 'marketing strategy', 'marketing management'],
            related: [
                { skill: 'Digital Marketing', weight: 0.72 },
                { skill: 'Brand Management', weight: 0.68 },
            ],
        },
        'Digital Marketing': {
            category: 'Business / Management',
            synonyms: ['digital marketing', 'online marketing'],
            related: [
                { skill: 'Social Media Marketing', weight: 0.7 },
                { skill: 'Content Marketing', weight: 0.65 },
            ],
        },
        'Social Media Marketing': {
            category: 'Business / Management',
            synonyms: ['social media marketing', 'social marketing'],
            related: [
                { skill: 'Digital Marketing', weight: 0.7 },
                { skill: 'Content Marketing', weight: 0.6 },
            ],
        },
        'Search Engine Optimization': {
            category: 'Business / Management',
            synonyms: ['search engine optimization', 'seo'],
            related: [
                { skill: 'Digital Marketing', weight: 0.68 },
                { skill: 'Content Marketing', weight: 0.55 },
            ],
        },
        'Search Engine Marketing': {
            category: 'Business / Management',
            synonyms: ['search engine marketing', 'sem'],
            related: [
                { skill: 'Digital Marketing', weight: 0.65 },
                { skill: 'Campaign Management', weight: 0.58 },
            ],
        },
        'Brand Management': {
            category: 'Business / Management',
            synonyms: ['brand management', 'brand strategy'],
            related: [
                { skill: 'Marketing', weight: 0.68 },
                { skill: 'Content Marketing', weight: 0.6 },
            ],
        },
        'Advertising': {
            category: 'Business / Management',
            synonyms: ['advertising', 'ad campaigns'],
            related: [
                { skill: 'Campaign Management', weight: 0.62 },
                { skill: 'Creative Strategy', weight: 0.6 },
            ],
        },
        'Content Marketing': {
            category: 'Business / Management',
            synonyms: ['content marketing', 'inbound marketing'],
            related: [
                { skill: 'Digital Marketing', weight: 0.65 },
                { skill: 'Content Strategy', weight: 0.62 },
            ],
        },
        'Campaign Management': {
            category: 'Business / Management',
            synonyms: ['campaign management', 'marketing campaigns'],
            related: [
                { skill: 'Advertising', weight: 0.62 },
                { skill: 'Digital Marketing', weight: 0.6 },
            ],
        },
        'Finance': {
            category: 'Business / Management',
            synonyms: ['finance', 'financial management'],
            related: [
                { skill: 'Financial Analysis', weight: 0.7 },
                { skill: 'Budgeting', weight: 0.6 },
            ],
        },
        'Financial Analysis': {
            category: 'Business / Management',
            synonyms: ['financial analysis', 'financial analyst'],
            related: [
                { skill: 'Financial Modelling', weight: 0.7 },
                { skill: 'Forecasting', weight: 0.62 },
            ],
        },
        'Investment': {
            category: 'Business / Management',
            synonyms: ['investment', 'investment management'],
            related: [
                { skill: 'Finance', weight: 0.65 },
                { skill: 'Financial Analysis', weight: 0.6 },
            ],
        },
        'Accounting': {
            category: 'Business / Management',
            synonyms: ['accounting', 'financial accounting'],
            related: [
                { skill: 'Auditing', weight: 0.62 },
                { skill: 'Taxation', weight: 0.6 },
            ],
        },
        'Budgeting': {
            category: 'Business / Management',
            synonyms: ['budgeting', 'budget management'],
            related: [
                { skill: 'Forecasting', weight: 0.62 },
                { skill: 'Financial Modelling', weight: 0.6 },
            ],
        },
        'Taxation': {
            category: 'Business / Management',
            synonyms: ['taxation', 'tax planning'],
            related: [
                { skill: 'Accounting', weight: 0.62 },
                { skill: 'Auditing', weight: 0.58 },
            ],
        },
        'Auditing': {
            category: 'Business / Management',
            synonyms: ['auditing', 'audit'],
            related: [
                { skill: 'Accounting', weight: 0.62 },
                { skill: 'Compliance Management', weight: 0.6 },
            ],
        },
        'Human Resources': {
            category: 'Business / Management',
            synonyms: ['human resources', 'hr'],
            related: [
                { skill: 'Talent Acquisition', weight: 0.68 },
                { skill: 'Employee Engagement', weight: 0.62 },
            ],
        },
        'Recruitment': {
            category: 'Business / Management',
            synonyms: ['recruitment', 'hiring'],
            related: [
                { skill: 'Talent Acquisition', weight: 0.7 },
                { skill: 'Onboarding', weight: 0.58 },
            ],
        },
        'Talent Acquisition': {
            category: 'Business / Management',
            synonyms: ['talent acquisition', 'talent sourcing'],
            related: [
                { skill: 'Recruitment', weight: 0.7 },
                { skill: 'Human Resources', weight: 0.68 },
            ],
        },
        'Employee Engagement': {
            category: 'Business / Management',
            synonyms: ['employee engagement', 'employee retention'],
            related: [
                { skill: 'Human Resources', weight: 0.62 },
                { skill: 'People Management', weight: 0.6 },
            ],
        },
        'Payroll Management': {
            category: 'Business / Management',
            synonyms: ['payroll', 'payroll management'],
            related: [
                { skill: 'Human Resources', weight: 0.6 },
                { skill: 'Accounting', weight: 0.58 },
            ],
        },
        'Training and Development': {
            category: 'Business / Management',
            synonyms: ['training and development', 'learning and development'],
            related: [
                { skill: 'Coaching & Mentorship', weight: 0.65 },
                { skill: 'Mentorship', weight: 0.6 },
            ],
        },
        'HR Policies': {
            category: 'Business / Management',
            synonyms: ['hr policies', 'human resources policies'],
            related: [
                { skill: 'Compliance Management', weight: 0.62 },
                { skill: 'Human Resources', weight: 0.6 },
            ],
        },
        'Onboarding': {
            category: 'Business / Management',
            synonyms: ['onboarding', 'employee onboarding'],
            related: [
                { skill: 'Recruitment', weight: 0.58 },
                { skill: 'Talent Acquisition', weight: 0.58 },
            ],
        },
        'Business Strategy': {
            category: 'Business / Management',
            synonyms: ['business strategy', 'corporate strategy'],
            related: [
                { skill: 'Strategic Planning', weight: 0.7 },
                { skill: 'Management Consulting', weight: 0.65 },
            ],
        },
        'Management Consulting': {
            category: 'Business / Management',
            synonyms: ['management consulting', 'business consulting'],
            related: [
                { skill: 'Business Strategy', weight: 0.65 },
                { skill: 'Operations Management', weight: 0.6 },
            ],
        },
        'Operations Management': {
            category: 'Business / Management',
            synonyms: ['operations management', 'operations'],
            related: [
                { skill: 'Process Optimization', weight: 0.65 },
                { skill: 'Supply Chain Management', weight: 0.62 },
            ],
        },
        'Business Analysis': {
            category: 'Business / Management',
            synonyms: ['business analysis', 'business analyst'],
            related: [
                { skill: 'Operations Management', weight: 0.6 },
                { skill: 'Strategic Planning', weight: 0.58 },
            ],
        },
        'Supply Chain Management': {
            category: 'Business / Management',
            synonyms: ['supply chain management', 'supply chain'],
            related: [
                { skill: 'Operations Management', weight: 0.62 },
                { skill: 'Logistics', weight: 0.6 },
            ],
        },
        'Entrepreneurship': {
            category: 'Business / Management',
            synonyms: ['entrepreneurship', 'startup management'],
            related: [
                { skill: 'Business Strategy', weight: 0.6 },
                { skill: 'Business Development', weight: 0.6 },
            ],
        },
        'Business Development': {
            category: 'Business / Management',
            synonyms: ['business development', 'partnership development'],
            related: [
                { skill: 'Sales', weight: 0.65 },
                { skill: 'Lead Generation', weight: 0.6 },
            ],
        },
        'Sales': {
            category: 'Business / Management',
            synonyms: ['sales', 'sales management'],
            related: [
                { skill: 'B2B Sales', weight: 0.68 },
                { skill: 'Account Management', weight: 0.6 },
            ],
        },
        'B2B Sales': {
            category: 'Business / Management',
            synonyms: ['b2b sales', 'business-to-business sales'],
            related: [
                { skill: 'Sales', weight: 0.68 },
                { skill: 'Lead Generation', weight: 0.62 },
            ],
        },
        'B2C Sales': {
            category: 'Business / Management',
            synonyms: ['b2c sales', 'business-to-consumer sales'],
            related: [
                { skill: 'Sales', weight: 0.68 },
                { skill: 'Retail Management', weight: 0.6 },
            ],
        },
        'Lead Generation': {
            category: 'Business / Management',
            synonyms: ['lead generation', 'demand generation'],
            related: [
                { skill: 'Sales', weight: 0.62 },
                { skill: 'Business Development', weight: 0.6 },
            ],
        },
        'Customer Relationship Management': {
            category: 'Business / Management',
            synonyms: ['customer relationship management', 'crm', 'crm management'],
            related: [
                { skill: 'Account Management', weight: 0.65 },
                { skill: 'Sales', weight: 0.6 },
            ],
        },
        'Retail Management': {
            category: 'Business / Management',
            synonyms: ['retail management', 'store management'],
            related: [
                { skill: 'B2C Sales', weight: 0.6 },
                { skill: 'Sales', weight: 0.58 },
            ],
        },
        'Sales Forecasting': {
            category: 'Business / Management',
            synonyms: ['sales forecasting', 'sales projections'],
            related: [
                { skill: 'Forecasting', weight: 0.62 },
                { skill: 'Sales', weight: 0.58 },
            ],
        },
        'Account Management': {
            category: 'Business / Management',
            synonyms: ['account management', 'key account management'],
            related: [
                { skill: 'Customer Relationship Management', weight: 0.65 },
                { skill: 'Sales', weight: 0.6 },
            ],
        },
        'Graphic Design': {
            category: 'Creative / Design',
            synonyms: ['graphic design', 'graphic designer'],
            related: [
                { skill: 'Logo Design', weight: 0.7 },
                { skill: 'Brand Identity', weight: 0.68 },
            ],
        },
        'Poster Design': {
            category: 'Creative / Design',
            synonyms: ['poster design', 'poster creation'],
            related: [
                { skill: 'Graphic Design', weight: 0.6 },
            ],
        },
        'Illustration': {
            category: 'Creative / Design',
            synonyms: ['illustration', 'illustrator'],
            related: [
                { skill: 'Graphic Design', weight: 0.62 },
                { skill: 'Digital Art', weight: 0.6 },
            ],
        },
        'Layout Design': {
            category: 'Creative / Design',
            synonyms: ['layout design', 'layout composition'],
            related: [
                { skill: 'Graphic Design', weight: 0.6 },
                { skill: 'Typography', weight: 0.55 },
            ],
        },
        'Adobe Photoshop': {
            category: 'Creative / Design',
            synonyms: ['adobe photoshop', 'photoshop'],
            related: [
                { skill: 'Graphic Design', weight: 0.65 },
                { skill: 'Photo Editing', weight: 0.68 },
            ],
        },
        'Adobe Illustrator': {
            category: 'Creative / Design',
            synonyms: ['adobe illustrator', 'illustrator'],
            related: [
                { skill: 'Logo Design', weight: 0.7 },
                { skill: 'Graphic Design', weight: 0.65 },
            ],
        },
        'CorelDRAW': {
            category: 'Creative / Design',
            synonyms: ['coreldraw', 'corel draw'],
            related: [
                { skill: 'Graphic Design', weight: 0.6 },
            ],
        },
        'UI Design': {
            category: 'Creative / Design',
            synonyms: ['ui design', 'user interface design'],
            related: [
                { skill: 'Interaction Design', weight: 0.65 },
                { skill: 'UX Design', weight: 0.68 },
            ],
        },
        'UX Design': {
            category: 'Creative / Design',
            synonyms: ['ux design', 'user experience design'],
            related: [
                { skill: 'UI Design', weight: 0.68 },
                { skill: 'UX Research', weight: 0.65 },
            ],
        },
        'User Experience': {
            category: 'Creative / Design',
            synonyms: ['user experience', 'ux'],
            related: [
                { skill: 'UX Design', weight: 0.7 },
                { skill: 'UX Research', weight: 0.65 },
            ],
        },
        'User Interface': {
            category: 'Creative / Design',
            synonyms: ['user interface', 'ui'],
            related: [
                { skill: 'UI Design', weight: 0.7 },
                { skill: 'Interaction Design', weight: 0.65 },
            ],
        },
        'Wireframing': {
            category: 'Creative / Design',
            synonyms: ['wireframing', 'wireframe creation'],
            related: [
                { skill: 'Prototyping', weight: 0.68 },
                { skill: 'UX Design', weight: 0.6 },
            ],
        },
        'Prototyping': {
            category: 'Creative / Design',
            synonyms: ['prototyping', 'prototype design'],
            related: [
                { skill: 'Wireframing', weight: 0.68 },
                { skill: 'Interaction Design', weight: 0.6 },
            ],
        },
        'Figma': {
            category: 'Creative / Design',
            synonyms: ['figma'],
            related: [
                { skill: 'UI Design', weight: 0.65 },
                { skill: 'Prototyping', weight: 0.6 },
            ],
        },
        'Adobe XD': {
            category: 'Creative / Design',
            synonyms: ['adobe xd', 'xd'],
            related: [
                { skill: 'UI Design', weight: 0.65 },
                { skill: 'Prototyping', weight: 0.58 },
            ],
        },
        'Usability Testing': {
            category: 'Creative / Design',
            synonyms: ['usability testing', 'user testing'],
            related: [
                { skill: 'UX Research', weight: 0.7 },
                { skill: 'UX Design', weight: 0.65 },
            ],
        },
        'Interaction Design': {
            category: 'Creative / Design',
            synonyms: ['interaction design', 'ixd'],
            related: [
                { skill: 'UI Design', weight: 0.65 },
                { skill: 'UX Design', weight: 0.62 },
            ],
        },
        'Creative Writing': {
            category: 'Creative / Design',
            synonyms: ['creative writing', 'creative storyteller'],
            related: [
                { skill: 'Content Writing', weight: 0.6 },
                { skill: 'Storytelling', weight: 0.6 },
            ],
        },
        'Blog Writing': {
            category: 'Creative / Design',
            synonyms: ['blog writing', 'blogging'],
            related: [
                { skill: 'Content Writing', weight: 0.6 },
            ],
        },
        'Script Writing': {
            category: 'Creative / Design',
            synonyms: ['script writing', 'screenwriting'],
            related: [
                { skill: 'Storytelling', weight: 0.62 },
                { skill: 'Content Writing', weight: 0.6 },
            ],
        },
        'Social Media Content': {
            category: 'Creative / Design',
            synonyms: ['social media content', 'social content'],
            related: [
                { skill: 'Social Media Marketing', weight: 0.65 },
                { skill: 'Content Marketing', weight: 0.6 },
            ],
        },
        'Email Marketing': {
            category: 'Creative / Design',
            synonyms: ['email marketing', 'email campaigns'],
            related: [
                { skill: 'Content Marketing', weight: 0.6 },
                { skill: 'Digital Marketing', weight: 0.58 },
            ],
        },
        'Content Strategy': {
            category: 'Creative / Design',
            synonyms: ['content strategy', 'content planning'],
            related: [
                { skill: 'Content Marketing', weight: 0.62 },
                { skill: 'Editorial Planning', weight: 0.62 },
            ],
        },
        'Proofreading': {
            category: 'Creative / Design',
            synonyms: ['proofreading', 'proofreader'],
            related: [
                { skill: 'Content Writing', weight: 0.58 },
            ],
        },
        'Photography': {
            category: 'Creative / Design',
            synonyms: ['photography', 'photographer'],
            related: [
                { skill: 'Photo Editing', weight: 0.7 },
                { skill: 'Visual Communication', weight: 0.6 },
            ],
        },
        'Videography': {
            category: 'Creative / Design',
            synonyms: ['videography', 'videographer'],
            related: [
                { skill: 'Video Editing', weight: 0.7 },
                { skill: 'Visual Communication', weight: 0.6 },
            ],
        },
        'Photo Editing': {
            category: 'Creative / Design',
            synonyms: ['photo editing', 'image editing'],
            related: [
                { skill: 'Photography', weight: 0.7 },
                { skill: 'Adobe Photoshop', weight: 0.68 },
            ],
        },
        'Video Editing': {
            category: 'Creative / Design',
            synonyms: ['video editing', 'video post-production'],
            related: [
                { skill: 'Videography', weight: 0.7 },
                { skill: 'Adobe Premiere Pro', weight: 0.68 },
            ],
        },
        'Adobe Premiere Pro': {
            category: 'Creative / Design',
            synonyms: ['adobe premiere pro', 'premiere pro'],
            related: [
                { skill: 'Video Editing', weight: 0.68 },
                { skill: 'Videography', weight: 0.6 },
            ],
        },
        'After Effects': {
            category: 'Creative / Design',
            synonyms: ['after effects', 'adobe after effects'],
            related: [
                { skill: 'Animation', weight: 0.68 },
                { skill: 'Video Editing', weight: 0.62 },
            ],
        },
        'Animation': {
            category: 'Creative / Design',
            synonyms: ['animation', 'motion graphics'],
            related: [
                { skill: 'After Effects', weight: 0.68 },
                { skill: 'Digital Art', weight: 0.6 },
            ],
        },
        'Visual Communication': {
            category: 'Creative / Design',
            synonyms: ['visual communication', 'visual storytelling'],
            related: [
                { skill: 'Graphic Design', weight: 0.65 },
                { skill: 'Photography', weight: 0.6 },
            ],
        },
        'Digital Art': {
            category: 'Creative / Design',
            synonyms: ['digital art', 'digital illustration'],
            related: [
                { skill: 'Illustration', weight: 0.6 },
                { skill: 'Animation', weight: 0.6 },
            ],
        },
        'Teaching': {
            category: 'Academic / Teaching',
            synonyms: ['teaching', 'teacher'],
            related: [
                { skill: 'Lesson Planning', weight: 0.7 },
                { skill: 'Academic Instruction', weight: 0.68 },
            ],
        },
        'Lecturing': {
            category: 'Academic / Teaching',
            synonyms: ['lecturing', 'lecturer'],
            related: [
                { skill: 'Teaching', weight: 0.68 },
                { skill: 'Academic Instruction', weight: 0.65 },
            ],
        },
        'Academic Instruction': {
            category: 'Academic / Teaching',
            synonyms: ['academic instruction', 'instruction'],
            related: [
                { skill: 'Teaching', weight: 0.68 },
                { skill: 'Curriculum Planning', weight: 0.6 },
            ],
        },
        'Lesson Planning': {
            category: 'Academic / Teaching',
            synonyms: ['lesson planning', 'lesson design'],
            related: [
                { skill: 'Curriculum Planning', weight: 0.7 },
                { skill: 'Assessment Design', weight: 0.6 },
            ],
        },
        'Student Evaluation': {
            category: 'Academic / Teaching',
            synonyms: ['student evaluation', 'student assessment'],
            related: [
                { skill: 'Assessment Design', weight: 0.65 },
                { skill: 'Curriculum Assessment', weight: 0.6 },
            ],
        },
        'Pedagogy': {
            category: 'Academic / Teaching',
            synonyms: ['pedagogy', 'instructional methods'],
            related: [
                { skill: 'Instructional Design', weight: 0.62 },
                { skill: 'Teaching', weight: 0.6 },
            ],
        },
        'E-learning': {
            category: 'Academic / Teaching',
            synonyms: ['e-learning', 'elearning', 'online learning'],
            related: [
                { skill: 'Educational Technology', weight: 0.68 },
                { skill: 'Virtual Classroom', weight: 0.6 },
            ],
        },
        'Distance Education': {
            category: 'Academic / Teaching',
            synonyms: ['distance education', 'distance learning'],
            related: [
                { skill: 'E-learning', weight: 0.68 },
                { skill: 'Virtual Classroom', weight: 0.6 },
            ],
        },
        'Thesis Writing': {
            category: 'Academic / Teaching',
            synonyms: ['thesis writing', 'dissertation writing'],
            related: [
                { skill: 'Academic Writing', weight: 0.68 },
                { skill: 'Research Methodology', weight: 0.6 },
            ],
        },
        'Publication': {
            category: 'Academic / Teaching',
            synonyms: ['publication', 'academic publication'],
            related: [
                { skill: 'Academic Research', weight: 0.6 },
                { skill: 'Academic Writing', weight: 0.6 },
            ],
        },
        'Data Collection': {
            category: 'Academic / Teaching',
            synonyms: ['data collection', 'field data collection'],
            related: [
                { skill: 'Survey Design', weight: 0.6 },
                { skill: 'Research Methodology', weight: 0.6 },
            ],
        },
        'Survey Design': {
            category: 'Academic / Teaching',
            synonyms: ['survey design', 'survey development'],
            related: [
                { skill: 'Research Methodology', weight: 0.6 },
                { skill: 'Data Collection', weight: 0.6 },
            ],
        },
        'Qualitative Analysis': {
            category: 'Academic / Teaching',
            synonyms: ['qualitative analysis', 'qualitative research analysis'],
            related: [
                { skill: 'Research Methodology', weight: 0.62 },
                { skill: 'Academic Research', weight: 0.6 },
            ],
        },
        'Quantitative Research': {
            category: 'Academic / Teaching',
            synonyms: ['quantitative research', 'quantitative analysis'],
            related: [
                { skill: 'Research Methodology', weight: 0.62 },
                { skill: 'Data Analysis', weight: 0.6 },
            ],
        },
        'Journal Writing': {
            category: 'Academic / Teaching',
            synonyms: ['journal writing', 'journal publication'],
            related: [
                { skill: 'Academic Writing', weight: 0.6 },
                { skill: 'Academic Research', weight: 0.6 },
            ],
        },
        'Academic Writing': {
            category: 'Academic / Teaching',
            synonyms: ['academic writing', 'scholarly writing'],
            related: [
                { skill: 'Publication', weight: 0.6 },
                { skill: 'Thesis Writing', weight: 0.68 },
            ],
        },
        'Interpersonal Skills': {
            category: 'Communication / Soft Skills',
            synonyms: ['interpersonal skills', 'people skills'],
            related: [
                { skill: 'Team Collaboration', weight: 0.6 },
                { skill: 'Communication Strategy', weight: 0.55 },
            ],
        },
        'Motivation': {
            category: 'Communication / Soft Skills',
            synonyms: ['motivation', 'motivational leadership'],
            related: [
                { skill: 'Leadership', weight: 0.6 },
                { skill: 'Coaching & Mentorship', weight: 0.58 },
            ],
        },
        'Critical Thinking': {
            category: 'Communication / Soft Skills',
            synonyms: ['critical thinking', 'analytical thinking'],
            related: [
                { skill: 'Problem Solving', weight: 0.62 },
                { skill: 'Decision Making', weight: 0.55 },
            ],
        },
        'Educational Technology': {
            category: 'Academic / Teaching',
            synonyms: ['educational technology', 'edtech'],
            related: [
                { skill: 'E-learning', weight: 0.68 },
                { skill: 'Online Learning Tools', weight: 0.6 },
            ],
        },
        'Moodle': {
            category: 'Academic / Teaching',
            synonyms: ['moodle'],
            related: [
                { skill: 'Educational Technology', weight: 0.6 },
                { skill: 'Learning Management Systems', weight: 0.6 },
            ],
        },
        'Google Classroom': {
            category: 'Academic / Teaching',
            synonyms: ['google classroom'],
            related: [
                { skill: 'Educational Technology', weight: 0.6 },
                { skill: 'Learning Management Systems', weight: 0.6 },
            ],
        },
        'Canvas LMS': {
            category: 'Academic / Teaching',
            synonyms: ['canvas', 'canvas lms'],
            related: [
                { skill: 'Educational Technology', weight: 0.6 },
                { skill: 'Learning Management Systems', weight: 0.6 },
            ],
        },
        'Zoom Teaching': {
            category: 'Academic / Teaching',
            synonyms: ['zoom teaching', 'virtual teaching'],
            related: [
                { skill: 'Virtual Classroom', weight: 0.6 },
                { skill: 'E-learning', weight: 0.6 },
            ],
        },
        'Online Learning Tools': {
            category: 'Academic / Teaching',
            synonyms: ['online learning tools', 'digital learning tools'],
            related: [
                { skill: 'Educational Technology', weight: 0.6 },
                { skill: 'Learning Management Systems', weight: 0.6 },
            ],
        },
        'Learning Management Systems': {
            category: 'Academic / Teaching',
            synonyms: ['learning management systems', 'lms'],
            related: [
                { skill: 'Educational Technology', weight: 0.6 },
                { skill: 'Online Learning Tools', weight: 0.6 },
            ],
        },
        'Educational Content Creation': {
            category: 'Academic / Teaching',
            synonyms: ['educational content creation', 'learning content creation'],
            related: [
                { skill: 'Instructional Design', weight: 0.6 },
                { skill: 'Teaching', weight: 0.6 },
            ],
        },
        'Virtual Classroom': {
            category: 'Academic / Teaching',
            synonyms: ['virtual classroom', 'virtual learning environment'],
            related: [
                { skill: 'E-learning', weight: 0.6 },
                { skill: 'Zoom Teaching', weight: 0.6 },
            ],
        },
        'Assessment Tools': {
            category: 'Academic / Teaching',
            synonyms: ['assessment tools', 'evaluation tools'],
            related: [
                { skill: 'Assessment Design', weight: 0.6 },
                { skill: 'Student Evaluation', weight: 0.6 },
            ],
        },
    };

    private technicalCategoryMap: Record<string, CategoryLabel> = {
        programming_languages: 'Technical / Analytical',
        frameworks_libraries: 'Technical / Analytical',
        databases: 'Technical / Analytical',
        cloud_platforms: 'Technical / Analytical',
        tools_technologies: 'Technical / Analytical',
        data_science: 'Technical / Analytical',
        soft_skills: 'Communication / Soft Skills',
    };

    private keywordToCanonical: Record<string, string> = {};
    private canonicalMeta: Record<string, CanonicalMeta> = {};
    private pendingRelations: { from: string; to: string; weight: number }[] = [];
    private semanticGraph: Record<string, [string, number][]> = {};

    constructor() {
        this._buildLookups();
    }

    private _buildLookups() {
        this.keywordToCanonical = {};
        this.canonicalMeta = {};
        this.pendingRelations = [];
        this.semanticGraph = {};

        for (const categoryName in this.skillsData) {
            const categorySet = this.skillsData[categoryName];
            for (const canonical in categorySet) {
                const canonicalKey = canonical.toLowerCase();
                const synonyms = new Set<string>();
                synonyms.add(canonicalKey);
                categorySet[canonical].forEach(keyword => synonyms.add(keyword.toLowerCase()));

                const categoryLabel = this.technicalCategoryMap[categoryName] || 'Technical / Analytical';

                this.canonicalMeta[canonicalKey] = {
                    canonical,
                    category: categoryLabel,
                    synonyms: Array.from(synonyms),
                    related: [],
                    isDomainTerm: false,
                    source: 'technical',
                };

                synonyms.forEach(keyword => {
                    this.keywordToCanonical[keyword] = canonicalKey;
                });
            }
        }

        for (const canonicalName in this.nonTechnicalSkills) {
            const definition = this.nonTechnicalSkills[canonicalName];
            const canonicalKey = canonicalName.toLowerCase();
            const synonyms = new Set<string>();
            synonyms.add(canonicalKey);
            definition.synonyms.forEach(keyword => synonyms.add(keyword.toLowerCase()));

            this.canonicalMeta[canonicalKey] = {
                canonical: canonicalName,
                category: definition.category,
                synonyms: Array.from(synonyms),
                related: [],
                isDomainTerm: Boolean(definition.isDomainTerm),
                source: 'nonTechnical',
            };

            synonyms.forEach(keyword => {
                this.keywordToCanonical[keyword] = canonicalKey;
            });

            definition.related?.forEach(rel => {
                this._queueRelation(canonicalName, rel.skill, rel.weight ?? 0.6);
            });
        }

        const technicalRelations: Record<string, RelatedSkill[]> = {
            'artificial intelligence': [
                { skill: 'machine learning', weight: 0.82 },
                { skill: 'deep_learning', weight: 0.7 },
                { skill: 'nlp', weight: 0.68 },
            ],
            'machine learning': [
                { skill: 'deep_learning', weight: 0.8 },
                { skill: 'tensorflow', weight: 0.65 },
                { skill: 'pytorch', weight: 0.65 },
                { skill: 'scikit-learn', weight: 0.6 },
            ],
            'python': [
                { skill: 'django', weight: 0.55 },
                { skill: 'flask', weight: 0.55 },
                { skill: 'fastapi', weight: 0.5 },
                { skill: 'pandas', weight: 0.6 },
                { skill: 'numpy', weight: 0.6 },
            ],
            'javascript': [
                { skill: 'react', weight: 0.7 },
                { skill: 'angular', weight: 0.6 },
                { skill: 'vue', weight: 0.6 },
                { skill: 'node.js', weight: 0.62 },
                { skill: 'typescript', weight: 0.58 },
            ],
            'devops': [
                { skill: 'docker', weight: 0.65 },
                { skill: 'kubernetes', weight: 0.65 },
                { skill: 'jenkins', weight: 0.58 },
                { skill: 'terraform', weight: 0.6 },
                { skill: 'ansible', weight: 0.55 },
            ],
            'cloud': [
                { skill: 'aws', weight: 0.6 },
                { skill: 'azure', weight: 0.6 },
                { skill: 'gcp', weight: 0.6 },
            ],
            'pandas': [
                { skill: 'data_analysis', weight: 0.55 },
                { skill: 'numpy', weight: 0.58 },
            ],
            'numpy': [
                { skill: 'data_analysis', weight: 0.55 },
                { skill: 'pandas', weight: 0.58 },
            ],
            'matplotlib': [
                { skill: 'data_visualization', weight: 0.62 },
            ],
            'seaborn': [
                { skill: 'data_visualization', weight: 0.62 },
            ],
            'plotly': [
                { skill: 'data_visualization', weight: 0.6 },
            ],
        };

        Object.entries(technicalRelations).forEach(([from, rels]) => {
            rels.forEach(rel => {
                this._queueRelation(from, rel.skill, rel.weight ?? 0.6);
            });
        });

        this._processPendingRelations();
        this._buildSemanticGraph();
    }

    private _queueRelation(from: string, to: string, weight: number) {
        this.pendingRelations.push({ from, to, weight });
    }

    private _processPendingRelations() {
        let remaining = this.pendingRelations;
        let progress = true;

        while (remaining.length > 0 && progress) {
            progress = false;
            const next: { from: string; to: string; weight: number }[] = [];
            remaining.forEach(rel => {
                const fromKey = this._resolveCanonicalKey(rel.from);
                const toKey = this._resolveCanonicalKey(rel.to);
                if (!fromKey || !toKey) {
                    next.push(rel);
                    return;
                }
                const registered = this._registerRelation(fromKey, toKey, rel.weight);
                if (registered) {
                    progress = true;
                } else {
                    next.push(rel);
                }
            });
            remaining = next;
        }
        this.pendingRelations = remaining;
    }

    private _registerRelation(fromKey: string, toKey: string, weight: number): boolean {
        const fromRecord = this.canonicalMeta[fromKey];
        const toRecord = this.canonicalMeta[toKey];
        if (!fromRecord || !toRecord) {
            return false;
        }
        const normalizedWeight = Math.max(0.1, Math.min(1, weight)) || 0.6;
        if (!fromRecord.related.some(rel => rel.skill === toRecord.canonical)) {
            fromRecord.related.push({ skill: toRecord.canonical, weight: normalizedWeight });
        }
        if (!toRecord.related.some(rel => rel.skill === fromRecord.canonical)) {
            toRecord.related.push({ skill: fromRecord.canonical, weight: normalizedWeight });
        }
        return true;
    }

    private _buildSemanticGraph() {
        const graph: Record<string, [string, number][]> = {};
        Object.values(this.canonicalMeta).forEach(record => {
            const entries: [string, number][] = [];
            record.related.forEach(rel => {
                const targetKey = this._resolveCanonicalKey(rel.skill);
                if (!targetKey) {
                    return;
                }
                const targetRecord = this.canonicalMeta[targetKey];
                if (!targetRecord) {
                    return;
                }
                if (!entries.some(([name]) => name === targetRecord.canonical)) {
                    entries.push([targetRecord.canonical, Math.max(0.1, Math.min(1, rel.weight ?? 0.6))]);
                }
            });
            if (entries.length > 0) {
                graph[record.canonical] = entries;
            }
        });
        this.semanticGraph = graph;
    }

    getAllSkills(): Set<string> {
        return new Set(Object.keys(this.keywordToCanonical));
    }

    findSkillCategory(skill: string): string {
        const canonicalKey = this._resolveCanonicalKey(skill);
        if (canonicalKey && this.canonicalMeta[canonicalKey]) {
            return this.canonicalMeta[canonicalKey].category;
        }

        const skillLower = skill.toLowerCase();
        for (const categoryName in this.skillsData) {
            for (const mainSkill in this.skillsData[categoryName]) {
                if (this.skillsData[categoryName][mainSkill].map(s => s.toLowerCase()).includes(skillLower)) {
                    return this.technicalCategoryMap[categoryName] || 'Technical / Analytical';
                }
            }
        }
        return 'Other';
    }

    isRelated(skillA: string, skillB: string): boolean {
        const canonicalA = this.findCanonicalSkill(skillA);
        const canonicalB = this.findCanonicalSkill(skillB);

        if (!canonicalA || !canonicalB) {
            return false;
        }

        if (canonicalA === canonicalB) {
            return true;
        }

        const neighborsA = this.semanticGraph[canonicalA] || [];
        if (neighborsA.some(([name]) => name === canonicalB)) {
            return true;
        }

        const neighborsB = this.semanticGraph[canonicalB] || [];
        if (neighborsB.some(([name]) => name === canonicalA)) {
            return true;
        }

        return false;
    }

    findCanonicalSkill(term: string): string | null {
        const canonicalKey = this._resolveCanonicalKey(term);
        if (canonicalKey && this.canonicalMeta[canonicalKey]) {
            return this.canonicalMeta[canonicalKey].canonical;
        }
        return null;
    }

    getCanonicalMeta(canonical: string): CanonicalMeta | null {
        const canonicalKey = this._resolveCanonicalKey(canonical);
        if (canonicalKey && this.canonicalMeta[canonicalKey]) {
            return this.canonicalMeta[canonicalKey];
        }
        return null;
    }

    getRelatedSkills(canonical: string): RelatedSkill[] {
        const record = this.getCanonicalMeta(canonical);
        if (!record) {
            return [];
        }
        return record.related;
    }

    collectDomainTerms(): Set<string> {
        const domainTerms = new Set<string>();
        Object.values(this.canonicalMeta).forEach(record => {
            if (record.isDomainTerm) {
                domainTerms.add(record.canonical);
            }
        });
        return domainTerms;
    }

    getSemanticRelations(): Record<string, [string, number][]> {
        return this.semanticGraph;
    }

    private _resolveCanonicalKey(term: string): string | null {
        if (!term) {
            return null;
        }
        const normalized = term.toLowerCase();
        return this.keywordToCanonical[normalized] || null;
    }
}

class CustomSkillExtractor {
    skillDb = new SkillDatabase();
    allSkills = this.skillDb.getAllSkills();
    patterns = {
        years_experience: /(\d+)[+\s]*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/g,
        skill_with_years: /(\w+(?:\.\w+)*)\s*[:-]\s*(\d+)[+\s]*(?:years?|yrs?)/g,
        frameworks: /(?:using|with|in)\s+([A-Za-z][A-Za-z0-9.#+\-]*)/g,
        technologies: /(?:technologies?|tools?|platforms?)[:\s]+([^,.;!?]+)/g,
        programming_languages: /(?:programming\s+)?(?:languages?|lang)[:\s]+([^,.;!?]+)/g,
    };

    extractSkillsFromText(text: string): any {
        const textLower = text.toLowerCase();
        const foundSkills: Record<string, any> = {};
        const skillCategories: Record<string, string[]> = {};
        const domainTermsFound = new Set<string>();
        const suggestionPool = new Set<string>();

        this.allSkills.forEach(skill => {
            if (this._fuzzyMatch(skill, textLower)) {
                const canonical = this.skillDb.findCanonicalSkill(skill);
                if (!canonical) {
                    return;
                }

                const meta = this.skillDb.getCanonicalMeta(canonical);
                if (!meta) {
                    return;
                }

                const confidence = this._calculateConfidence(skill, canonical, textLower);
                if (confidence <= 0.55) {
                    return;
                }

                if (!foundSkills[canonical]) {
                    foundSkills[canonical] = {
                        confidence,
                        category: meta.category,
                        context: this._extractContext(skill, text, 50),
                        matchedVariants: new Set<string>([skill.toLowerCase()]),
                        related: [...meta.related],
                    };
                } else {
                    foundSkills[canonical].confidence = Math.max(foundSkills[canonical].confidence, confidence);
                    foundSkills[canonical].matchedVariants.add(skill.toLowerCase());
                }

                if (!skillCategories[meta.category]) {
                    skillCategories[meta.category] = [];
                }
                if (!skillCategories[meta.category].includes(canonical)) {
                    skillCategories[meta.category].push(canonical);
                }

                if (meta.isDomainTerm) {
                    domainTermsFound.add(canonical);
                }

                meta.related.forEach(rel => {
                    suggestionPool.add(rel.skill);
                });
            }
        });

        const experienceInfo = this._extractExperience(text);

        Object.entries(foundSkills).forEach(([canonical, data]) => {
            const relatedSkills = (data.related as RelatedSkill[] | undefined) || [];
            const filtered = relatedSkills
                .map(rel => rel.skill)
                .filter(relSkill => !foundSkills[relSkill]);
            data.relatedSkills = filtered.slice(0, 5);
            data.matchedVariants = Array.from(data.matchedVariants);
            delete data.related;
        });

        const relatedSuggestions = Array.from(suggestionPool)
            .filter(skill => !foundSkills[skill])
            .slice(0, 10);

        return {
            'skills': foundSkills,
            'categories': skillCategories,
            'experience': experienceInfo,
            'total_skills': Object.keys(foundSkills).length,
            'top_categories': this._getTopCategories(skillCategories),
            'domain_specific_terms': Array.from(domainTermsFound),
            'related_skill_suggestions': relatedSuggestions,
        };
    }

    private _fuzzyMatch(skill: string, text: string, threshold: number = 0.8): boolean {
        const skillLower = skill.toLowerCase();
        if (text.includes(skillLower)) {
            return true;
        }
        if (new RegExp(`\b${skillLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\b`).test(text)) {
            return true;
        }
        if (skillLower.length > 3) {
            const words = text.split(/\s+/);
            for (const word of words) {
                if (similarity(skillLower, word) > threshold) {
                    return true;
                }
            }
        }
        return false;
    }

    private _calculateConfidence(matchedTerm: string, canonical: string, textLower: string): number {
        const termLower = matchedTerm.toLowerCase();
        const canonicalLower = canonical.toLowerCase();
        let confidence = 0;

        if (textLower.includes(termLower)) {
            confidence += 0.45;
        }
        if (termLower !== canonicalLower && textLower.includes(canonicalLower)) {
            confidence += 0.1;
        }

        const directTermPattern = new RegExp(`\\b${this._escapeRegex(termLower)}\\b`);
        const canonicalPattern = new RegExp(`\\b${this._escapeRegex(canonicalLower)}\\b`);

        if (directTermPattern.test(textLower)) {
            confidence += 0.25;
        }
        if (termLower !== canonicalLower && canonicalPattern.test(textLower)) {
            confidence += 0.1;
        }

        const contextPatterns = [
            `${this._escapeRegex(termLower)}.*experience`,
            `experience.*${this._escapeRegex(termLower)}`,
            `${this._escapeRegex(termLower)}.*years?`,
            `proficient.*${this._escapeRegex(termLower)}`,
            `expert.*${this._escapeRegex(termLower)}`,
        ];

        for (const pattern of contextPatterns) {
            if (new RegExp(pattern).test(textLower)) {
                confidence += 0.15;
                break;
            }
        }

        const termOccurrences = (textLower.match(new RegExp(this._escapeRegex(termLower), 'g')) || []).length;
        confidence += Math.min(termOccurrences * 0.08, 0.2);

        if (termLower !== canonicalLower) {
            const canonicalOccurrences = (textLower.match(new RegExp(this._escapeRegex(canonicalLower), 'g')) || []).length;
            confidence += Math.min(canonicalOccurrences * 0.05, 0.15);
        }

        return Math.min(confidence, 1);
    }

    private _escapeRegex(term: string): string {
        return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
        this.similarityMap = this.skillDb.getSemanticRelations();
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
            'comparison': comparisonData.comparison,
            'domain_specific_terms': jobAnalysis.domain_specific_terms,
            'related_skill_suggestions': jobAnalysis.related_skill_suggestions,
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

        const adjacencySuggestions = this._suggestAdjacentSkills(jobAnalysis, resumeAnalysis);
        adjacencySuggestions.forEach(suggestion => {
            if (!recommendations.some(r => r.skill === suggestion.skill)) {
                recommendations.push(suggestion);
            }
        });

        return recommendations;
    }

    private _suggestAdjacentSkills(jobAnalysis: any, resumeAnalysis: any): any[] {
        const suggestions: Record<string, any> = {};
        const resumeSkills = new Set(Object.keys(resumeAnalysis.skills));

        Object.keys(jobAnalysis.skills).forEach(skill => {
            const related = this.skillDb.getRelatedSkills(skill);
            related.forEach(rel => {
                if (!resumeSkills.has(rel.skill)) {
                    suggestions[rel.skill] = suggestions[rel.skill] || {
                        skill: rel.skill,
                        priority: rel.weight && rel.weight > 0.7 ? 'High' : 'Advisory',
                        reason: `Closely related to ${skill} and frequently expected in similar roles.`
                    };
                }
            });
        });

        return Object.values(suggestions).slice(0, 5);
    }
}
