import { ResumeData } from '@/store/useResumeStore';

export interface ScoreCategory {
    name: string;
    score: number;
    description: string;
}

export interface ScoringResult {
    overall: number;
    categories: {
        content: ScoreCategory;
        skills: ScoreCategory;
        format: ScoreCategory;
        keywords: ScoreCategory;
        achievements: ScoreCategory;
    };
    suggestions: Array<{ title: string; description: string; impact: string; }>;
    isCapped: boolean;
    capReason?: string;
}

export function calculateResumeScore(data: ResumeData): ScoringResult {
    const suggestions: ScoringResult['suggestions'] = [];

    // 1. Content Score
    let contentScore = 0;
    if (data.summary && data.summary.trim().length > 100) contentScore += 40;
    else if (data.summary) contentScore += 20;

    if (data.experience.length > 0) {
        contentScore += 30;
        const descriptions = data.experience.map(e => e.description).join('');
        if (descriptions.length > 200) contentScore += 30;
        else if (descriptions.length > 50) contentScore += 15;
    }
    contentScore = Math.min(contentScore, 100);

    // 2. Skills Score
    let skillsScore = 0;
    if (data.skills.length >= 8) skillsScore = 100;
    else if (data.skills.length > 0) skillsScore = Math.round((data.skills.length / 8) * 100);
    
    // 3. Format Score (Completeness of profile)
    let formatScore = 20; // baseline
    if (data.personalInfo.fullName) formatScore += 20;
    if (data.personalInfo.email) formatScore += 20;
    if (data.personalInfo.phone) formatScore += 20;
    if (data.personalInfo.linkedin || data.personalInfo.github) formatScore += 20;
    formatScore = Math.min(formatScore, 100);

    // 4. Keywords Score (Mocked for V1)
    // Scale loosely based on skills and job title existence
    let keywordsScore = 40; // baseline
    if (data.personalInfo.jobTitle) keywordsScore += 20;
    keywordsScore += Math.min((data.skills.length * 5), 40);
    keywordsScore = Math.min(keywordsScore, 100);

    // 5. Achievements Score (Low weighting for regex)
    let achievementsScore = 0;
    if (data.achievements.length > 0) achievementsScore += 60; // Just having entries gives most points
    if (data.projects.length > 0) achievementsScore += 20;
    
    // Low weighting check for numbers in experience
    const expText = data.experience.map(e => e.description).join(' ');
    if (/\d+%|\$\d+|\d+x/i.test(expText)) {
        achievementsScore += 20; // Only max 20 points for regex matches
    }
    achievementsScore = Math.min(achievementsScore, 100);

    // Overall Calculation (Weighted Average)
    let overall = Math.round(
        (contentScore * 0.30) +
        (skillsScore * 0.20) +
        (formatScore * 0.15) +
        (keywordsScore * 0.20) +
        (achievementsScore * 0.15)
    );

    // CAPS AND THRESHOLDS
    let isCapped = false;
    let capReason = '';

    if (data.experience.length === 0) {
        overall = Math.min(overall, 45);
        isCapped = true;
        capReason = 'Missing Experience Section';
        suggestions.push({
            title: 'Add Work Experience',
            description: 'Resumes without experience sections score significantly lower in ATS parsers.',
            impact: '+30 Points'
        });
    } else if (!data.summary || data.summary.trim().length < 50) {
        overall = Math.min(overall, 75);
        isCapped = true;
        capReason = 'Incomplete Summary';
        suggestions.push({
            title: 'Expand Professional Summary',
            description: 'Write a compelling 3-4 line summary highlighting your core value proposition.',
            impact: '+10 Points'
        });
    }

    if (data.skills.length < 5) {
        suggestions.push({
            title: 'Add More Core Skills',
            description: 'Aim for 8-12 highly relevant hard skills to match job descriptions.',
            impact: '+15 Points'
        });
    }

    if (!data.personalInfo.linkedin && !data.personalInfo.github) {
        suggestions.push({
            title: 'Add Professional Links',
            description: 'Including a LinkedIn or GitHub profile increases recruiter trust and response rates.',
            impact: '+5 Points'
        });
    }

    if (achievementsScore < 60) {
        suggestions.push({
            title: 'Quantify Your Impact',
            description: 'Add numbers, percentages, or dollar amounts to your experience bullet points.',
            impact: '+10 Points'
        });
    }

    // Fallback positive suggestion if everything is perfect
    if (suggestions.length === 0) {
        suggestions.push({
            title: 'Tailor for Specific Role',
            description: 'Your resume is very strong. Next step is to tailor it to a specific job description.',
            impact: '+Optimization'
        });
    }

    return {
        overall,
        isCapped,
        capReason,
        suggestions,
        categories: {
            content: { name: 'Content', score: contentScore, description: 'Relevance and depth' },
            skills: { name: 'Skills', score: skillsScore, description: 'Keyword coverage' },
            format: { name: 'Format', score: formatScore, description: 'Completeness' },
            keywords: { name: 'Keywords', score: keywordsScore, description: 'ATS density' },
            achievements: { name: 'Achievements', score: achievementsScore, description: 'Measurable impact' }
        }
    };
}
