import { ResumeData, ProjectEntry } from '@/store/useResumeStore';

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

    // 1. Missing Projects (Highest Priority)
    if (data.projects.length < 2) {
        // Provide a contextual project based on title or fallback
        const isDeveloper = jobTitle.includes('developer') || jobTitle.includes('engineer');
        
        const contextualProject: Omit<ProjectEntry, 'id'> = isDeveloper ? {
            name: 'API Microservice Migration',
            role: 'Backend Developer (Draft)',
            startDate: '2023-01',
            endDate: '2023-06',
            current: false,
            description: 'Refactored legacy monolith into Node.js microservices.\nImproved API response time by 40%.\nImplemented JWT authentication and Redis caching.',
            link: ''
        } : {
            name: 'Process Optimization Initiative',
            role: 'Project Lead (Draft)',
            startDate: '2023-01',
            endDate: '2023-06',
            current: false,
            description: 'Analyzed existing workflows to identify bottlenecks.\nImplemented automated reporting reducing manual work by 10 hours/week.\nLed cross-functional team training on new tools.',
            link: ''
        };

        suggestions.push({
            id: 'sugg-proj-1',
            category: 'Projects',
            title: 'Add a high-impact project',
            description: `You have ${data.projects.length} project(s). ATS systems favor candidates with at least 2 detailed projects demonstrating practical application of skills.`,
            reason: 'Demonstrates hands-on experience',
            impact: '+15 Points',
            actionType: 'ADD_PROJECT',
            actionData: contextualProject
        });
    }

    // 2. Missing Skills (High Priority)
    if (data.skills.length < 8) {
        const commonSkills = ['Agile Methodologies', 'Data Analysis', 'Project Management', 'Communication', 'Problem Solving'];
        const devSkills = ['React', 'TypeScript', 'Node.js', 'Docker', 'AWS', 'Git', 'SQL'];
        
        const targetPool = (jobTitle.includes('developer') || jobTitle.includes('engineer')) ? devSkills : commonSkills;
        
        // Find a skill the user doesn't have yet
        const missingSkill = targetPool.find(s => !data.skills.some(userSkill => userSkill.toLowerCase() === s.toLowerCase()));

        if (missingSkill) {
            suggestions.push({
                id: `sugg-skill-${missingSkill.toLowerCase().replace(/\s+/g, '-')}`,
                category: 'Skills',
                title: `Add "${missingSkill}" to your skills`,
                description: `Your skills section is sparse (${data.skills.length}/8 recommended). Adding highly searched industry keywords improves your ranking.`,
                reason: 'Missing core industry keyword',
                impact: '+10 Points',
                actionType: 'ADD_SKILL',
                actionData: missingSkill
            });
        }
    }

    // 3. Weak Summary (Medium Priority)
    if (!data.summary || data.summary.trim().length < 100) {
        suggestions.push({
            id: 'sugg-summary-1',
            category: 'Content',
            title: 'Strengthen Professional Summary',
            description: 'Your summary is too brief. Expand it to 3-4 sentences outlining your years of experience, top 2 hard skills, and a defining career achievement.',
            reason: 'First impression for recruiters',
            impact: '+10 Points'
        });
    }

    // 4. Weak Experience Metrics (Medium Priority)
    if (data.experience.length > 0) {
        const allDescriptions = data.experience.map(e => e.description).join(' ');
        if (!/\d+%|\$\d+|\d+x/i.test(allDescriptions)) {
            suggestions.push({
                id: 'sugg-metrics-1',
                category: 'Content',
                title: 'Quantify Experience Impact',
                description: 'We detected a lack of numbers (percentages, dollars, multipliers) in your work experience. Recruiters look for measurable results.',
                reason: 'Lack of quantified achievements',
                impact: '+15 Points'
            });
        }
    }

    // 5. Keyword Improvements (Lower Priority)
    if (data.skills.length >= 5 && data.experience.length > 0) {
        // Suggest taking skills and putting them into experience descriptions
        suggestions.push({
            id: 'sugg-kw-1',
            category: 'Keywords',
            title: 'Contextualize your skills',
            description: `You listed skills like "${data.skills[0]}". Make sure to also weave these exact keywords naturally into your Work Experience bullet points.`,
            reason: 'Improves ATS context mapping',
            impact: '+5 Points'
        });
    }

    // Fallback if everything is perfect
    if (suggestions.length === 0) {
        suggestions.push({
            id: 'sugg-perfect-1',
            category: 'Content',
            title: 'Tailor for specific job',
            description: 'Your base resume is exceptionally strong. To improve further, start tailoring your summary and bullet points to match the exact keywords of your target job description.',
            reason: 'General resume is fully optimized',
            impact: '+Optimization'
        });
    }

    return suggestions;
}
