import { ResumeData, ProjectEntry } from '@/store/useResumeStore';

// ─── Types ──────────────────────────────────────────────────────────────────

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type ATSImpact = 'High' | 'Medium' | 'Low';
export type FilterCategory =
    | 'All'
    | 'Based On Your Skills'
    | 'High Impact'
    | 'Beginner Friendly'
    | 'ATS Boosters'
    | 'Data Analysis'
    | 'Machine Learning'
    | 'Frontend'
    | 'Backend'
    | 'Trending';

export interface ProjectRecommendation {
    id: string;
    title: string;
    description: string;
    atsImpact: ATSImpact;
    matchingSkills: string[];
    skillsGained: string[];
    reason: string;
    techTags: string[];
    difficulty: DifficultyLevel;
    categories: FilterCategory[];
    draftProject: Omit<ProjectEntry, 'id'>;
}

// ─── Project Pool ────────────────────────────────────────────────────────────

const PROJECT_POOL: ProjectRecommendation[] = [
    {
        id: 'proj-sales-dashboard',
        title: 'Sales Analytics Dashboard',
        description: 'Build an interactive dashboard tracking KPIs like revenue trends, churn rate, and conversion funnels using real-time SQL data pipelines.',
        atsImpact: 'High',
        matchingSkills: ['Python', 'SQL', 'Power BI', 'Tableau', 'pandas', 'Excel'],
        skillsGained: ['Data Visualization', 'ETL Pipelines', 'Business Intelligence'],
        reason: 'Data dashboard projects appear in 78% of top analytics job descriptions. This project directly demonstrates BI and stakeholder reporting skills employers actively search for.',
        techTags: ['Python', 'SQL', 'Power BI', 'Pandas', 'ETL'],
        difficulty: 'Intermediate',
        categories: ['Data Analysis', 'High Impact', 'ATS Boosters'],
        draftProject: {
            name: 'Sales Analytics Dashboard',
            role: 'Data Analyst (Draft)',
            startDate: '2024-01', endDate: '2024-04', current: false,
            description: 'Built an interactive sales analytics dashboard using Python and Power BI.\nProcessed 50,000+ records using SQL and Pandas to track revenue trends.\nAutomated weekly KPI reporting, reducing manual effort by 8 hours/week.',
            link: ''
        }
    },
    {
        id: 'proj-customer-segmentation',
        title: 'Customer Segmentation Analysis',
        description: 'Apply K-Means clustering to segment customers by purchase behavior and build Matplotlib visualizations to communicate insights to stakeholders.',
        atsImpact: 'High',
        matchingSkills: ['Python', 'SQL', 'pandas', 'Machine Learning', 'sklearn', 'Statistics'],
        skillsGained: ['K-Means Clustering', 'Customer Analytics', 'scikit-learn', 'Statistical Modeling'],
        reason: 'Customer segmentation projects signal data science depth. They appear frequently in product analytics, growth, and marketing analytics roles that pay 20–30% more.',
        techTags: ['Python', 'scikit-learn', 'K-Means', 'Pandas', 'Matplotlib'],
        difficulty: 'Intermediate',
        categories: ['Data Analysis', 'Machine Learning', 'High Impact'],
        draftProject: {
            name: 'Customer Segmentation Analysis',
            role: 'Data Scientist (Draft)',
            startDate: '2024-02', endDate: '2024-05', current: false,
            description: 'Performed customer segmentation using K-Means clustering on 20,000+ records.\nIdentified 4 distinct customer personas improving targeted campaign ROI by 25%.\nBuilt visualizations to communicate insights to marketing stakeholders.',
            link: ''
        }
    },
    {
        id: 'proj-revenue-forecast',
        title: 'Revenue Forecasting Model',
        description: 'Develop a Prophet/ARIMA time-series model to predict monthly revenue and inventory demand with confidence intervals.',
        atsImpact: 'High',
        matchingSkills: ['Python', 'pandas', 'SQL', 'Statistics', 'Excel'],
        skillsGained: ['Time Series Analysis', 'ARIMA', 'Facebook Prophet', 'Forecasting'],
        reason: 'Forecasting models demonstrate quantitative reasoning — a top skill in finance, supply chain, and operations analytics that significantly differentiates candidates.',
        techTags: ['Python', 'Prophet', 'ARIMA', 'Pandas', 'NumPy'],
        difficulty: 'Advanced',
        categories: ['Data Analysis', 'Machine Learning', 'High Impact'],
        draftProject: {
            name: 'Revenue Forecasting Model',
            role: 'Data Analyst (Draft)',
            startDate: '2024-03', endDate: '2024-06', current: false,
            description: 'Built a Prophet-based forecasting model for monthly revenue with 92% accuracy.\nAnalyzed 3 years of historical data to identify seasonal trends.\nDelivered model that reduced over-ordering costs by an estimated 15%.',
            link: ''
        }
    },
    {
        id: 'proj-sentiment-analysis',
        title: 'Sentiment Analysis Classifier',
        description: 'Train an NLP model to classify product reviews as positive, negative, or neutral. Deploy as a REST API endpoint for real-time inference.',
        atsImpact: 'High',
        matchingSkills: ['Python', 'Machine Learning', 'TensorFlow', 'sklearn', 'NLP', 'Deep Learning'],
        skillsGained: ['NLP', 'BERT / Transformers', 'Text Classification', 'Model Deployment'],
        reason: 'NLP and text classification projects are trending rapidly and appear in 65%+ of ML and AI engineer job descriptions this year.',
        techTags: ['Python', 'HuggingFace', 'BERT', 'scikit-learn', 'Flask'],
        difficulty: 'Advanced',
        categories: ['Machine Learning', 'High Impact', 'Trending'],
        draftProject: {
            name: 'Sentiment Analysis Classifier',
            role: 'ML Engineer (Draft)',
            startDate: '2024-04', endDate: '2024-07', current: false,
            description: 'Trained a BERT-based classifier on 100,000+ reviews achieving 89% accuracy.\nImplemented text preprocessing pipeline with tokenization and stop-word removal.\nDeployed model as a Flask REST API for real-time inference.',
            link: ''
        }
    },
    {
        id: 'proj-portfolio-site',
        title: 'Personal Developer Portfolio',
        description: 'Build a responsive, animated developer portfolio using Next.js to showcase your projects and experience to recruiters with a live URL.',
        atsImpact: 'Medium',
        matchingSkills: ['React', 'Next.js', 'TypeScript', 'CSS', 'HTML', 'JavaScript'],
        skillsGained: ['Next.js App Router', 'SEO Optimization', 'Responsive Design', 'Vercel Deployment'],
        reason: 'A live portfolio is direct proof-of-work for frontend developers. Recruiters actively look for live project URLs, and having one increases callback rates significantly.',
        techTags: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Vercel'],
        difficulty: 'Beginner',
        categories: ['Frontend', 'Beginner Friendly', 'Trending'],
        draftProject: {
            name: 'Personal Developer Portfolio',
            role: 'Frontend Developer (Draft)',
            startDate: '2024-01', endDate: '2024-02', current: false,
            description: 'Built a responsive portfolio using Next.js 14 and TypeScript showcasing 6+ projects.\nImplemented smooth page transitions, dark mode, and contact form with email.\nDeployed on Vercel with a 95+ Lighthouse performance score.',
            link: ''
        }
    },
    {
        id: 'proj-ecommerce-dashboard',
        title: 'E-commerce Admin Dashboard',
        description: 'Create a full-stack admin dashboard with product management, order tracking, and sales analytics charts for an e-commerce platform.',
        atsImpact: 'High',
        matchingSkills: ['React', 'Node.js', 'TypeScript', 'SQL', 'Next.js', 'FastAPI', 'Python'],
        skillsGained: ['Full-Stack Architecture', 'Admin UX Patterns', 'Chart Libraries', 'Role-Based Auth'],
        reason: 'Full-stack CRUD dashboards are the #1 most requested portfolio project in full-stack engineer job postings across LinkedIn and Indeed.',
        techTags: ['React', 'Node.js', 'PostgreSQL', 'REST API', 'TypeScript'],
        difficulty: 'Intermediate',
        categories: ['Frontend', 'Backend', 'High Impact', 'ATS Boosters'],
        draftProject: {
            name: 'E-commerce Admin Dashboard',
            role: 'Full Stack Developer (Draft)',
            startDate: '2024-03', endDate: '2024-06', current: false,
            description: 'Developed a full-stack admin panel with product CRUD, order management, and analytics.\nBuilt REST API with Node.js/Express and PostgreSQL backend.\nImplemented role-based access control; reduced page load time by 40%.',
            link: ''
        }
    },
    {
        id: 'proj-rest-api',
        title: 'Production REST API with Auth',
        description: 'Build a production-ready REST API with JWT authentication, rate limiting, PostgreSQL integration, and full Swagger documentation.',
        atsImpact: 'High',
        matchingSkills: ['Node.js', 'FastAPI', 'Python', 'Docker', 'SQL', 'PostgreSQL', 'Express'],
        skillsGained: ['JWT Auth', 'API Security', 'Rate Limiting', 'OpenAPI / Swagger'],
        reason: 'Auth-enabled APIs appear in nearly every backend developer JD. This project directly signals production readiness and systems design understanding.',
        techTags: ['Node.js', 'Express', 'JWT', 'PostgreSQL', 'Docker', 'Swagger'],
        difficulty: 'Intermediate',
        categories: ['Backend', 'High Impact', 'ATS Boosters'],
        draftProject: {
            name: 'RESTful API with JWT Authentication',
            role: 'Backend Developer (Draft)',
            startDate: '2024-02', endDate: '2024-04', current: false,
            description: 'Built a production-ready REST API using Node.js and Express with JWT-based authentication.\nImplemented rate limiting, input validation, and Swagger API documentation.\nContainerized with Docker and deployed to AWS EC2.',
            link: ''
        }
    },
    {
        id: 'proj-ci-cd',
        title: 'CI/CD Pipeline with Docker & GitHub Actions',
        description: 'Automate build, test, and deployment workflows for a Node.js or Python app using GitHub Actions, reducing deployment time by 80%.',
        atsImpact: 'High',
        matchingSkills: ['Docker', 'Git', 'AWS', 'Node.js', 'Python'],
        skillsGained: ['GitHub Actions', 'CI/CD Pipelines', 'Container Orchestration', 'DevOps'],
        reason: 'DevOps experience is expected in senior developer roles. CI/CD pipelines are listed in 55%+ of SWE JDs and are rarely shown in junior portfolios — giving you an edge.',
        techTags: ['Docker', 'GitHub Actions', 'AWS EC2', 'YAML', 'Bash'],
        difficulty: 'Intermediate',
        categories: ['Backend', 'ATS Boosters', 'Trending'],
        draftProject: {
            name: 'CI/CD Pipeline with Docker & GitHub Actions',
            role: 'DevOps Engineer (Draft)',
            startDate: '2024-05', endDate: '2024-07', current: false,
            description: 'Built a CI/CD pipeline using GitHub Actions for automated testing and Docker deployment.\nImplemented zero-downtime rolling deployments to AWS EC2.\nReduced deployment time from 30 minutes to under 4 minutes.',
            link: ''
        }
    },
    {
        id: 'proj-kpi-report',
        title: 'Automated KPI Reporting System',
        description: 'Build a Python pipeline that pulls multi-source data and auto-generates formatted business reports on a schedule via email.',
        atsImpact: 'Medium',
        matchingSkills: ['Python', 'SQL', 'Excel', 'Power BI', 'pandas'],
        skillsGained: ['Process Automation', 'Scheduled Jobs', 'Report Generation', 'Email APIs'],
        reason: 'Automation projects demonstrate initiative and ROI thinking — core traits valued in operations, finance, and business analyst roles.',
        techTags: ['Python', 'SQL', 'pandas', 'Cron', 'SMTP'],
        difficulty: 'Beginner',
        categories: ['Data Analysis', 'Beginner Friendly', 'ATS Boosters'],
        draftProject: {
            name: 'Automated KPI Reporting System',
            role: 'Business Analyst (Draft)',
            startDate: '2023-10', endDate: '2024-01', current: false,
            description: 'Developed an automated reporting system using Python to pull data from SQL databases.\nScheduled via cron to deliver formatted weekly Excel reports via email to 3 teams.\nEliminated 6 hours/week of manual reporting work per team.',
            link: ''
        }
    },
    {
        id: 'proj-chat-app',
        title: 'Real-Time Chat Application',
        description: 'Create a WebSocket-powered chat app with message history, user authentication, and online presence indicators using Socket.io and React.',
        atsImpact: 'Medium',
        matchingSkills: ['React', 'Node.js', 'TypeScript', 'JavaScript', 'Next.js'],
        skillsGained: ['WebSockets', 'Socket.io', 'Real-time Architecture', 'Optimistic UI'],
        reason: 'Real-time features differentiate full-stack developers and demonstrate event-driven architecture knowledge rarely shown in junior portfolios.',
        techTags: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'JWT'],
        difficulty: 'Intermediate',
        categories: ['Frontend', 'Backend', 'Trending'],
        draftProject: {
            name: 'Real-Time Chat Application',
            role: 'Full Stack Developer (Draft)',
            startDate: '2024-01', endDate: '2024-03', current: false,
            description: 'Built a real-time chat application with WebSocket support using Socket.io and React.\nImplemented message history, online presence indicators, and JWT authentication.\nScaled to 100+ concurrent WebSocket connections with optimized event handling.',
            link: ''
        }
    }
];

// ─── Main Export: Scored & Ranked Recommendations ────────────────────────────

export function getRecommendedProjects(data: ResumeData): ProjectRecommendation[] {
    const userSkillsLower = data.skills.map(s => s.toLowerCase());
    const jobTitle = (data.personalInfo.jobTitle || '').toLowerCase();
    const existingProjectNames = data.projects.map(p => p.name.toLowerCase());

    return PROJECT_POOL
        // Remove projects the user already has
        .filter(p => !existingProjectNames.some(ep => ep === p.title.toLowerCase()))
        .map(p => {
            // Count skill matches
            const matchCount = p.matchingSkills.filter(skill =>
                userSkillsLower.some(us =>
                    us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us)
                )
            ).length;

            // Role-title boost
            let boost = 0;
            if (jobTitle.includes('data') && p.categories.includes('Data Analysis')) boost += 2;
            if ((jobTitle.includes('ml') || jobTitle.includes('machine') || jobTitle.includes('ai'))
                && p.categories.includes('Machine Learning')) boost += 2;
            if ((jobTitle.includes('frontend') || jobTitle.includes('front-end'))
                && p.categories.includes('Frontend')) boost += 2;
            if ((jobTitle.includes('backend') || jobTitle.includes('back-end'))
                && p.categories.includes('Backend')) boost += 2;
            if ((jobTitle.includes('full') || jobTitle.includes('engineer') || jobTitle.includes('developer'))
                && (p.categories.includes('Frontend') || p.categories.includes('Backend'))) boost += 1;

            return { project: p, score: matchCount + boost };
        })
        .sort((a, b) => b.score - a.score)
        .map(item => item.project);
}

// ─── Filter helper ────────────────────────────────────────────────────────────

export function filterProjects(
    projects: ProjectRecommendation[],
    tab: FilterCategory,
    userSkills: string[]
): ProjectRecommendation[] {
    if (tab === 'All') return projects;
    if (tab === 'Based On Your Skills') {
        const low = userSkills.map(s => s.toLowerCase());
        return projects.filter(p =>
            p.matchingSkills.some(s => low.some(us => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us)))
        );
    }
    if (tab === 'High Impact') return projects.filter(p => p.atsImpact === 'High');
    if (tab === 'Beginner Friendly') return projects.filter(p => p.difficulty === 'Beginner');
    return projects.filter(p => p.categories.includes(tab));
}

// ─── Legacy: ATS text suggestion types (kept for SuggestionCard compat) ─────

export type SuggestionCategory = 'Projects' | 'Skills' | 'Content' | 'Keywords';

export interface AISuggestion {
    id: string;
    category: SuggestionCategory;
    title: string;
    description: string;
    reason: string;
    impact: string;
    actionType?: 'ADD_PROJECT' | 'ADD_SKILL';
    actionData?: any;
}

export function generateDeterministicSuggestions(data: ResumeData): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    const jobTitle = data.personalInfo.jobTitle?.toLowerCase() || '';

    if (data.skills.length < 8) {
        const devSkills = ['React', 'TypeScript', 'Node.js', 'Docker', 'AWS'];
        const commonSkills = ['Agile Methodologies', 'Data Analysis', 'Project Management'];
        const pool = (jobTitle.includes('developer') || jobTitle.includes('engineer')) ? devSkills : commonSkills;
        const low = data.skills.map(s => s.toLowerCase());
        const missing = pool.find(s => !low.includes(s.toLowerCase()));
        if (missing) {
            suggestions.push({
                id: `sugg-skill-${missing.toLowerCase().replace(/\s+/g, '-')}`,
                category: 'Skills', title: `Add "${missing}" to your skills`,
                description: `Your skills section has ${data.skills.length}/8 recommended skills. Adding industry keywords improves ATS ranking.`,
                reason: 'Missing core industry keyword', impact: '+10 Points',
                actionType: 'ADD_SKILL', actionData: missing
            });
        }
    }

    if (!data.summary || data.summary.trim().length < 100) {
        suggestions.push({
            id: 'sugg-summary-1', category: 'Content', title: 'Strengthen Professional Summary',
            description: 'Expand your summary to 3–4 sentences with your top skills and a defining achievement.',
            reason: 'First impression for recruiters', impact: '+10 Points'
        });
    }

    if (data.experience.length > 0) {
        const text = data.experience.map(e => e.description).join(' ');
        if (!/\d+%|\$\d+|\d+x/i.test(text)) {
            suggestions.push({
                id: 'sugg-metrics-1', category: 'Content', title: 'Quantify Experience Impact',
                description: 'Add numbers, percentages, or dollar amounts to your experience bullet points.',
                reason: 'Lack of quantified achievements', impact: '+15 Points'
            });
        }
    }

    if (suggestions.length === 0) {
        suggestions.push({
            id: 'sugg-perfect-1', category: 'Content', title: 'Tailor for specific job',
            description: 'Your resume is strong. Tailor it to match the exact keywords of your target job description.',
            reason: 'General resume is fully optimized', impact: '+Optimization'
        });
    }

    return suggestions;
}
