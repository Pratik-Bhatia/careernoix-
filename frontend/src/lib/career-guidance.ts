import { ResumeData } from '@/store/useResumeStore';

// ─── Interfaces ────────────────────────────────────────────────────────────

export interface CareerPathSuggestion {
    title: string;
    type: 'Core Path' | 'Eligible Path' | 'Adjacent Opportunity';
    matchPercentage: number;
    reason: string;
    averageSalary: string;
    matchingSkills: string[];
    missingSkills: string[];
}

export interface LearningStep {
    step: string;
    desc: string;
}

export interface CareerGuide {
    title: string;
    salaryEstimate: string;
    description: string;
    careerOpportunities: string[];
    recommendedCertifications: string[];
    skillsRoadmap: string[];
    suggestedTools: string[];
    suggestedProjects: string[];
    learningPath: LearningStep[];
    careerProgression: string;
}

// ─── Career Path Suggestions for Dashboard ───────────────────────────────

export function getCareerPathSuggestions(resumeData: ResumeData): CareerPathSuggestion[] {
    const skills = (resumeData.skills || []).map(s => s.toLowerCase());
    const jobTitle = (resumeData.personalInfo?.jobTitle || '').toLowerCase();
    
    const suggestions: CareerPathSuggestion[] = [];

    // Helper to count skill intersections
    const checkSkills = (reqSkills: string[]) => {
        const matching = reqSkills.filter(rs => 
            skills.some(us => us.includes(rs.toLowerCase()) || rs.toLowerCase().includes(us))
        );
        const missing = reqSkills.filter(rs => !matching.includes(rs));
        return { matching, missing };
    };

    // 1. Data Analyst / Analytics Path
    const dataAnalystReqs = ['SQL', 'Python', 'Power BI', 'Tableau', 'Excel', 'pandas'];
    const dataAnalystStats = checkSkills(dataAnalystReqs);
    if (dataAnalystStats.matching.length > 0 || jobTitle.includes('data') || jobTitle.includes('analyst')) {
        const matchPct = Math.round((dataAnalystStats.matching.length / dataAnalystReqs.length) * 100);
        suggestions.push({
            title: 'Data Analyst',
            type: jobTitle.includes('data') && jobTitle.includes('analyst') ? 'Core Path' : 'Eligible Path',
            matchPercentage: Math.max(30, matchPct),
            reason: `Matches key analysis tools like ${dataAnalystStats.matching.slice(0, 3).join(', ')} in your profile.`,
            averageSalary: '$75,000 - $105,000',
            matchingSkills: dataAnalystStats.matching,
            missingSkills: dataAnalystStats.missing
        });
    }

    // 2. Frontend Developer Path
    const frontendReqs = ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Next.js', 'Figma'];
    const frontendStats = checkSkills(frontendReqs);
    if (frontendStats.matching.length > 0 || jobTitle.includes('front') || jobTitle.includes('web') || jobTitle.includes('ui')) {
        const matchPct = Math.round((frontendStats.matching.length / frontendReqs.length) * 100);
        suggestions.push({
            title: 'Frontend Developer',
            type: jobTitle.includes('front') ? 'Core Path' : 'Eligible Path',
            matchPercentage: Math.max(30, matchPct),
            reason: `Based on your frontend capabilities in ${frontendStats.matching.slice(0, 3).join(', ')}.`,
            averageSalary: '$85,000 - $120,000',
            matchingSkills: frontendStats.matching,
            missingSkills: frontendStats.missing
        });
    }

    // 3. Backend Developer Path
    const backendReqs = ['Node.js', 'Express', 'Python', 'SQL', 'Docker', 'AWS', 'REST API'];
    const backendStats = checkSkills(backendReqs);
    if (backendStats.matching.length > 0 || jobTitle.includes('back') || jobTitle.includes('cloud') || jobTitle.includes('api')) {
        const matchPct = Math.round((backendStats.matching.length / backendReqs.length) * 100);
        suggestions.push({
            title: 'Backend Developer',
            type: jobTitle.includes('back') ? 'Core Path' : 'Eligible Path',
            matchPercentage: Math.max(30, matchPct),
            reason: `Leverages your server-side knowledge of ${backendStats.matching.slice(0, 3).join(', ')}.`,
            averageSalary: '$90,000 - $135,000',
            matchingSkills: backendStats.matching,
            missingSkills: backendStats.missing
        });
    }

    // 4. Machine Learning Engineer
    const mlReqs = ['Python', 'Machine Learning', 'TensorFlow', 'sklearn', 'Deep Learning', 'Statistics'];
    const mlStats = checkSkills(mlReqs);
    if (mlStats.matching.length > 0 || jobTitle.includes('ml') || jobTitle.includes('machine') || jobTitle.includes('ai') || jobTitle.includes('science')) {
        const matchPct = Math.round((mlStats.matching.length / mlReqs.length) * 100);
        suggestions.push({
            title: 'Machine Learning Engineer',
            type: jobTitle.includes('ml') || jobTitle.includes('ai') ? 'Core Path' : 'Adjacent Opportunity',
            matchPercentage: Math.max(25, matchPct),
            reason: `Capitalizes on your algorithmic and mathematical foundation in ${mlStats.matching.slice(0, 2).join(', ')}.`,
            averageSalary: '$110,000 - $160,000',
            matchingSkills: mlStats.matching,
            missingSkills: mlStats.missing
        });
    }

    // 5. Full Stack Developer (requires parts of both frontend and backend)
    if (frontendStats.matching.length >= 2 && backendStats.matching.length >= 2) {
        const fullStackReqs = ['React', 'Node.js', 'TypeScript', 'SQL', 'Git'];
        const fullStackStats = checkSkills(fullStackReqs);
        const matchPct = Math.round((fullStackStats.matching.length / fullStackReqs.length) * 100);
        suggestions.push({
            title: 'Full Stack Developer',
            type: 'Core Path',
            matchPercentage: Math.max(40, matchPct),
            reason: 'You demonstrate competencies in both client-side and server-side components.',
            averageSalary: '$95,000 - $140,000',
            matchingSkills: fullStackStats.matching,
            missingSkills: fullStackStats.missing
        });
    }

    // Add general fallback if suggestions list is too short or empty
    if (suggestions.length < 3) {
        const genericReqs = ['Git', 'Agile', 'Project Management', 'JavaScript'];
        const genericStats = checkSkills(genericReqs);
        suggestions.push({
            title: 'Junior Software Engineer',
            type: 'Adjacent Opportunity',
            matchPercentage: Math.max(35, Math.round((genericStats.matching.length / 4) * 100)),
            reason: 'A strong general technical entry point for graduates and early-career switchers.',
            averageSalary: '$70,000 - $95,000',
            matchingSkills: genericStats.matching,
            missingSkills: genericStats.missing
        });
    }

    // Sort by match percentage descending
    return suggestions.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

// ─── Predefined Detailed Guides DB ──────────────────────────────────────────

const CAREER_GUIDES: Record<string, CareerGuide> = {
    'data analyst': {
        title: 'Data Analyst',
        salaryEstimate: '$75,000 - $105,000',
        description: 'Data Analysts bridge the gap between business decisions and technical analysis. They collect, process, and perform statistical analyses on large datasets, translating numbers into actionable strategic insights.',
        careerOpportunities: [
            'Junior Data Analyst',
            'Business Intelligence (BI) Analyst',
            'Product Analytics Specialist',
            'Senior Data Analyst',
            'Analytics Manager / Director'
        ],
        recommendedCertifications: [
            'Google Data Analytics Professional Certificate',
            'Microsoft Certified: Power BI Data Analyst Associate',
            'Tableau Desktop Certified Associate',
            'SAS Certified Advanced Analytics Professional'
        ],
        skillsRoadmap: [
            'SQL (Aggregate functions, Subqueries, Joins)',
            'Python / R (pandas, numpy, matplotlib, seaborn)',
            'Data Visualization Tools (Tableau, Power BI, Excel Charts)',
            'Statistical Analysis (Hypothesis Testing, Regression)',
            'Data Cleaning & ETL (Extract, Transform, Load) pipelines'
        ],
        suggestedTools: [
            'PostgreSQL / Snowflake',
            'Jupyter Notebooks',
            'Power BI',
            'Tableau',
            'Microsoft Excel',
            'dbt (Data Build Tool)'
        ],
        suggestedProjects: [
            'Interactive Sales Analytics Dashboard (SQL, Power BI)',
            'Customer Segmentation Analysis (Python K-Means Clustering)',
            'Automated Weekly KPI Reporting Pipeline (Python, SMTP, Cron)'
        ],
        learningPath: [
            { step: 'Phase 1: Foundations & Excel', desc: 'Master advanced Excel functions, pivot tables, and fundamental descriptive statistics.' },
            { step: 'Phase 2: SQL Mastery', desc: 'Learn relational database queries, table creation, join syntax, and data cleaning.' },
            { step: 'Phase 3: Python for Analytics', desc: 'Study Jupyter, NumPy, Pandas, and visualization libraries like Seaborn.' },
            { step: 'Phase 4: Dashboard BI tools', desc: 'Learn Tableau or Power BI to publish interactive reports for business users.' }
        ],
        careerProgression: 'Junior Data Analyst (0-2y) ➔ Senior Data Analyst (2-5y) ➔ Lead Analyst or Analytics Manager (5y+)'
    },
    'frontend developer': {
        title: 'Frontend Developer',
        salaryEstimate: '$85,000 - $120,000',
        description: 'Frontend Developers design and build the interactive UI/UX components of web applications. They focus on responsive designs, performance optimization, and seamless client-side user flows.',
        careerOpportunities: [
            'Junior Web Developer',
            'UI/UX Developer',
            'Frontend Engineer',
            'Senior Frontend Architect',
            'UI Engineering Lead'
        ],
        recommendedCertifications: [
            'Meta Front-End Developer Professional Certificate',
            'W3Cx Front-End Web Developer Credentials',
            'AWS Certified Cloud Practitioner (helpful for static hosting)'
        ],
        skillsRoadmap: [
            'HTML5 & CSS3 (Flexbox, Grid, Custom Properties)',
            'Modern JavaScript (ES6+, Async/Await, DOM manipulation)',
            'TypeScript (Type safety, Interfaces, Generics)',
            'Component Frameworks (React.js, Next.js or Vue)',
            'State Management (Zustand, Redux Toolkit, Context API)',
            'CSS Frameworks (Tailwind CSS, Sass, CSS Modules)'
        ],
        suggestedTools: [
            'Visual Studio Code',
            'Vite / Webpack',
            'Git / GitHub',
            'Chrome DevTools',
            'Figma',
            'Vercel / Netlify'
        ],
        suggestedProjects: [
            'Personal Portfolio Website (Next.js, Framer Motion, Vercel)',
            'Collaborative Task Board / Kanban Tool (React, TypeScript, Drag-and-Drop)',
            'E-commerce Storefront with Cart & Checkout (React, Tailwind, Local Storage)'
        ],
        learningPath: [
            { step: 'Phase 1: HTML, CSS & UI Layouts', desc: 'Learn layout structures, typography, CSS selectors, and responsive design.' },
            { step: 'Phase 2: JavaScript ES6+', desc: 'Learn variables, functions, promises, fetch API, array methods, and event handling.' },
            { step: 'Phase 3: React.js & TypeScript', desc: 'Understand props, state, hooks, typescript interfaces, and component architectures.' },
            { step: 'Phase 4: Next.js & Production', desc: 'Learn server-side rendering, folder routing, SEO, and static web deployments.' }
        ],
        careerProgression: 'Junior Web Developer (0-2y) ➔ Frontend Engineer (2-5y) ➔ Senior Frontend Engineer / Architect (5y+)'
    },
    'backend developer': {
        title: 'Backend Developer',
        salaryEstimate: '$90,000 - $135,000',
        description: 'Backend Developers design, build, and maintain the server-side code, database structures, business logic pipelines, and REST/GraphQL APIs that power applications.',
        careerOpportunities: [
            'API Developer',
            'Backend Engineer',
            'Database Administrator / Architect',
            'Systems Engineer',
            'Lead Systems Architect'
        ],
        recommendedCertifications: [
            'AWS Certified Solutions Architect – Associate',
            'Oracle Certified Associate Java SE Programmer',
            'Google Professional Cloud Developer'
        ],
        skillsRoadmap: [
            'Server-side Languages (Node.js/Express, Python/FastAPI, Go, or Java)',
            'Database Systems (PostgreSQL, MongoDB, Redis caching)',
            'API Protocols (RESTful endpoints, GraphQL, WebSockets)',
            'Containerization (Docker, Docker Compose)',
            'Authentication (JWT, OAuth 2.0, bcrypt hashing)',
            'Cloud Infrastructures (AWS EC2/S3, Serverless functions)'
        ],
        suggestedTools: [
            'Postman / Insomnia',
            'Docker Desktop',
            'Git',
            'AWS CLI',
            'DBeaver (Database client)',
            'PM2 / Nodemon'
        ],
        suggestedProjects: [
            'Production REST API with JWT Auth & Rate Limiting (Node.js, Express, PostgreSQL)',
            'Real-Time Chat Server via WebSockets (Node.js, Socket.io, Redis)',
            'Automated CI/CD Deployment Pipeline (GitHub Actions, Docker, AWS EC2)'
        ],
        learningPath: [
            { step: 'Phase 1: Server Logic & Express', desc: 'Learn HTTP protocol, Node.js fundamentals, routing, and middleware patterns.' },
            { step: 'Phase 2: Database Design', desc: 'Master SQL schema design, normalization, joins, and MongoDB document modeling.' },
            { step: 'Phase 3: Security & Auth', desc: 'Implement JWT tokens, password hashing, and CORS/helmet security modules.' },
            { step: 'Phase 4: Containership & Cloud', desc: 'Dockerize applications, deploy to cloud VMs, and configure reverse proxies.' }
        ],
        careerProgression: 'Junior Backend Developer (0-2y) ➔ Backend Engineer (2-5y) ➔ Technical Architect or SRE (5y+)'
    },
    'full stack developer': {
        title: 'Full Stack Developer',
        salaryEstimate: '$95,000 - $140,000',
        description: 'Full Stack Developers are generalists who possess a comprehensive understanding of both frontend client experiences and backend server/database components.',
        careerOpportunities: [
            'Software Engineer',
            'Full Stack Engineer',
            'Product Developer',
            'Tech Lead / Engineering Manager',
            'CTO / Technical Cofounder'
        ],
        recommendedCertifications: [
            'Meta Full-Stack Developer Professional Certificate',
            'AWS Certified Solutions Architect – Associate',
            'Certified ScrumMaster (CSM)'
        ],
        skillsRoadmap: [
            'Frontend technologies (HTML/CSS, React, TypeScript)',
            'Backend tools (Node.js, Express, REST APIs)',
            'Database architectures (Relational SQL & Non-relational NoSQL)',
            'Systems Architecture & Deployment (Docker, AWS, Netlify, Vercel)',
            'Version Control (Git workflow, Pull Requests, Merge conflict resolution)'
        ],
        suggestedTools: [
            'VS Code',
            'Postman',
            'Docker',
            'Vercel / AWS',
            'GitHub Desktop'
        ],
        suggestedProjects: [
            'E-commerce Admin Dashboard (React, Node.js, PostgreSQL, charts)',
            'SaaS Collaborative Workspace App (Next.js, FastAPI, PostgreSQL, WebSockets)'
        ],
        learningPath: [
            { step: 'Phase 1: Frontend foundations', desc: 'Build responsive client layouts and master React/TypeScript state.' },
            { step: 'Phase 2: API & Servers', desc: 'Create REST interfaces with Node.js/Express and handle database queries.' },
            { step: 'Phase 3: Project Integration', desc: 'Connect frontend clients to backend APIs with secure JWT flows.' },
            { step: 'Phase 4: DevOps & CI/CD', desc: 'Automate build runs, dockerize apps, and push live applications.' }
        ],
        careerProgression: 'Junior Developer (0-2y) ➔ Software Engineer (2-5y) ➔ Tech Lead or Principal Engineer (5y+)'
    },
    'machine learning engineer': {
        title: 'Machine Learning Engineer',
        salaryEstimate: '$110,000 - $160,000',
        description: 'Machine Learning Engineers build and deploy production-ready AI models. They design algorithmic data pipelines, train neural networks, and optimize inference performance.',
        careerOpportunities: [
            'Data Scientist',
            'Machine Learning Developer',
            'NLP Engineer',
            'Computer Vision Specialist',
            'Lead AI Architect'
        ],
        recommendedCertifications: [
            'DeepLearning.AI TensorFlow Developer Professional Certificate',
            'AWS Certified Machine Learning – Specialty',
            'Google Professional Machine Learning Engineer'
        ],
        skillsRoadmap: [
            'Python (scikit-learn, numpy, pandas)',
            'Deep Learning frameworks (PyTorch, TensorFlow)',
            'Data Pipelines & Engineering (Apache Spark, SQL)',
            'NLP & Large Language Models (BERT, HuggingFace, OpenAI APIs)',
            'Model Deployment (FastAPI, Docker, Triton Inference Server)'
        ],
        suggestedTools: [
            'Jupyter Lab / Google Colab',
            'TensorBoard',
            'Weights & Biases (Experiment tracking)',
            'Docker',
            'AWS SageMaker'
        ],
        suggestedProjects: [
            'Customer Reviews Sentiment Classifier (Python BERT NLP, FastAPI, Docker)',
            'Real-Time Product Recommendation System (K-Means, Matrix Factorization)',
            'Time-Series Forecasting Model (Facebook Prophet, Pandas, ARIMA)'
        ],
        learningPath: [
            { step: 'Phase 1: Statistics & Python Data libraries', desc: 'Master linear algebra, calculus, probability, and Pandas/NumPy.' },
            { step: 'Phase 2: Classical Machine Learning', desc: 'Study supervised/unsupervised learning models via scikit-learn.' },
            { step: 'Phase 3: Deep Learning & NLP', desc: 'Train neural nets and BERT models with PyTorch or TensorFlow.' },
            { step: 'Phase 4: Model Serving', desc: 'Wrap models in API endpoints, containerize, and deploy for production inference.' }
        ],
        careerProgression: 'Junior ML Dev / Data Scientist (0-2y) ➔ ML Engineer (2-5y) ➔ Principal AI Engineer / Researcher (5y+)'
    }
};

export function getCareerGuidance(query: string): CareerGuide {
    const q = query.toLowerCase().trim();
    
    // Check direct matches
    if (q.includes('data analyst') || q.includes('bi analyst') || q.includes('product analyst') || q.includes('analysis')) {
        return CAREER_GUIDES['data analyst'];
    }
    if (q.includes('frontend') || q.includes('front-end') || q.includes('web developer') || q.includes('ui')) {
        return CAREER_GUIDES['frontend developer'];
    }
    if (q.includes('backend') || q.includes('back-end') || q.includes('server') || q.includes('api')) {
        return CAREER_GUIDES['backend developer'];
    }
    if (q.includes('full stack') || q.includes('full-stack') || q.includes('software engineer') || q.includes('developer')) {
        return CAREER_GUIDES['full stack developer'];
    }
    if (q.includes('machine learning') || q.includes('ml engineer') || q.includes('data scientist') || q.includes('ai') || q.includes('deep learning') || q.includes('nlp')) {
        return CAREER_GUIDES['machine learning engineer'];
    }

    // Qualification mappings to career guides
    if (q.includes('computer science') || q.includes('cs') || q.includes('information technology') || q.includes('software')) {
        return CAREER_GUIDES['full stack developer']; // CS mapping
    }
    if (q.includes('data science') || q.includes('statistics') || q.includes('math')) {
        return CAREER_GUIDES['machine learning engineer']; // Data Science mapping
    }

    // Default fallback to keep it robust and functional
    return {
        title: query ? `Career Roadmap for "${query}"` : 'General Software Engineer',
        salaryEstimate: '$80,000 - $125,000',
        description: `This roadmap provides progression and training guidance for career paths associated with "${query || 'Software Engineering'}". Focus on foundational engineering skills, source control, and algorithms.`,
        careerOpportunities: [
            'Junior Engineer',
            'Associate Developer',
            'Software Engineer',
            'Senior Software Engineer',
            'Engineering Lead'
        ],
        recommendedCertifications: [
            'AWS Certified Cloud Practitioner',
            'CompTIA Security+',
            'Scrum Alliance Certified ScrumMaster'
        ],
        skillsRoadmap: [
            'Object-Oriented Programming (OOP)',
            'Algorithms & Data Structures',
            'Version Control (Git)',
            'Basic Cloud Deployments',
            'Relational Database Basics'
        ],
        suggestedTools: [
            'VS Code',
            'Git & GitHub',
            'Docker',
            'Postman'
        ],
        suggestedProjects: [
            'Personal portfolio showcasing work',
            'Simple full-stack task organizer',
            'Auth-enabled server with API routes'
        ],
        learningPath: [
            { step: 'Phase 1: Basic Programming', desc: 'Master one language (Python, JavaScript, Java) and OOP structures.' },
            { step: 'Phase 2: DB & VCS', desc: 'Learn SQL relational schema principles and standard Git flows.' },
            { step: 'Phase 3: Core Frameworks', desc: 'Pick up a standard framework like React or Express.' },
            { step: 'Phase 4: Hosting & DevOps', desc: 'Understand Docker container setups and web deployments.' }
        ],
        careerProgression: 'Junior Engineer (0-2y) ➔ Software Engineer (2-5y) ➔ Tech Lead / Staff Engineer (5y+)'
    };
}
