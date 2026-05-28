import { ResumeData } from '@/store/useResumeStore';

// ─── Types ──────────────────────────────────────────────────────────────────

export type KeywordCategory = 'Technical Skills' | 'Tools & Frameworks' | 'Business & Soft Skills';

export interface JDKeyword {
    term: string;
    category: KeywordCategory;
}

export interface MissingKeywordGroup {
    category: KeywordCategory;
    keywords: string[];
}

export interface OptimizationResult {
    matchScore: number;
    matchQuality: 'Weak Match' | 'Moderate Match' | 'Good Match' | 'Strong Match';
    matchedSkills: string[];
    missingKeywordGroups: MissingKeywordGroup[];
    strengths: string[];
    weaknesses: string[];
    optimizedResume: ResumeData;
    improvements: {
        scoreBoost: number;
        addedKeywords: number;
        explanations: string[];
    };
}

// ─── Dummy Keyword Database (V1 Deterministic Logic) ────────────────────────

const KEYWORD_DB: JDKeyword[] = [
    // Tech
    { term: 'Python', category: 'Technical Skills' },
    { term: 'JavaScript', category: 'Technical Skills' },
    { term: 'TypeScript', category: 'Technical Skills' },
    { term: 'SQL', category: 'Technical Skills' },
    { term: 'Machine Learning', category: 'Technical Skills' },
    { term: 'Data Analysis', category: 'Technical Skills' },
    { term: 'ETL', category: 'Technical Skills' },
    { term: 'REST API', category: 'Technical Skills' },
    { term: 'System Design', category: 'Technical Skills' },
    
    // Tools
    { term: 'React', category: 'Tools & Frameworks' },
    { term: 'Node.js', category: 'Tools & Frameworks' },
    { term: 'Docker', category: 'Tools & Frameworks' },
    { term: 'AWS', category: 'Tools & Frameworks' },
    { term: 'Kubernetes', category: 'Tools & Frameworks' },
    { term: 'Power BI', category: 'Tools & Frameworks' },
    { term: 'Tableau', category: 'Tools & Frameworks' },
    { term: 'Git', category: 'Tools & Frameworks' },
    { term: 'Figma', category: 'Tools & Frameworks' },
    
    // Business / Soft
    { term: 'Agile', category: 'Business & Soft Skills' },
    { term: 'Project Management', category: 'Business & Soft Skills' },
    { term: 'Cross-functional', category: 'Business & Soft Skills' },
    { term: 'Stakeholder Management', category: 'Business & Soft Skills' },
    { term: 'KPI Reporting', category: 'Business & Soft Skills' },
    { term: 'Leadership', category: 'Business & Soft Skills' }
];

// ─── Engine ─────────────────────────────────────────────────────────────────

export function analyzeJD(jdText: string): JDKeyword[] {
    const text = jdText.toLowerCase();
    // Return all keywords from our DB that appear in the JD
    return KEYWORD_DB.filter(kw => text.includes(kw.term.toLowerCase()));
}

export function getRoleKeywords(role: string): JDKeyword[] {
    const roleLower = role.toLowerCase();
    const keywords: JDKeyword[] = [];
    
    if (roleLower.includes('data') || roleLower.includes('analyst') || roleLower.includes('analytics')) {
        keywords.push(
            { term: 'Python', category: 'Technical Skills' },
            { term: 'SQL', category: 'Technical Skills' },
            { term: 'Data Analysis', category: 'Technical Skills' },
            { term: 'ETL', category: 'Technical Skills' },
            { term: 'Power BI', category: 'Tools & Frameworks' },
            { term: 'Tableau', category: 'Tools & Frameworks' },
            { term: 'KPI Reporting', category: 'Business & Soft Skills' }
        );
    }
    if (roleLower.includes('front') || roleLower.includes('ui') || roleLower.includes('web') || roleLower.includes('designer')) {
        keywords.push(
            { term: 'JavaScript', category: 'Technical Skills' },
            { term: 'TypeScript', category: 'Technical Skills' },
            { term: 'React', category: 'Tools & Frameworks' },
            { term: 'Git', category: 'Tools & Frameworks' },
            { term: 'Figma', category: 'Tools & Frameworks' },
            { term: 'Agile', category: 'Business & Soft Skills' }
        );
    }
    if (roleLower.includes('back') || roleLower.includes('server') || roleLower.includes('api') || roleLower.includes('cloud')) {
        keywords.push(
            { term: 'Python', category: 'Technical Skills' },
            { term: 'REST API', category: 'Technical Skills' },
            { term: 'System Design', category: 'Technical Skills' },
            { term: 'Node.js', category: 'Tools & Frameworks' },
            { term: 'Docker', category: 'Tools & Frameworks' },
            { term: 'AWS', category: 'Tools & Frameworks' },
            { term: 'Git', category: 'Tools & Frameworks' }
        );
    }
    if (roleLower.includes('full stack') || roleLower.includes('engineer') || roleLower.includes('developer') || roleLower.includes('software')) {
        keywords.push(
            { term: 'JavaScript', category: 'Technical Skills' },
            { term: 'TypeScript', category: 'Technical Skills' },
            { term: 'SQL', category: 'Technical Skills' },
            { term: 'REST API', category: 'Technical Skills' },
            { term: 'React', category: 'Tools & Frameworks' },
            { term: 'Node.js', category: 'Tools & Frameworks' },
            { term: 'Docker', category: 'Tools & Frameworks' },
            { term: 'Git', category: 'Tools & Frameworks' },
            { term: 'Agile', category: 'Business & Soft Skills' }
        );
    }
    if (roleLower.includes('manager') || roleLower.includes('lead') || roleLower.includes('pm')) {
        keywords.push(
            { term: 'Agile', category: 'Business & Soft Skills' },
            { term: 'Project Management', category: 'Business & Soft Skills' },
            { term: 'Leadership', category: 'Business & Soft Skills' },
            { term: 'Cross-functional', category: 'Business & Soft Skills' },
            { term: 'Stakeholder Management', category: 'Business & Soft Skills' }
        );
    }
    
    return keywords;
}

export function optimizeResume(resume: ResumeData, jdText: string, targetRole?: string): OptimizationResult {
    // 1. Analyze JD & Role Keywords
    const jdKeywords = analyzeJD(jdText);
    const roleKeywords = getRoleKeywords(targetRole || resume.personalInfo.jobTitle || '');
    
    // Combine unique keywords by term
    const combinedKeywords = [...new Map([...jdKeywords, ...roleKeywords].map(item => [item.term.toLowerCase(), item])).values()];
    
    if (combinedKeywords.length === 0) {
        // Fallback if no keywords matched
        return {
            matchScore: 30,
            matchQuality: 'Weak Match',
            matchedSkills: [],
            missingKeywordGroups: [],
            strengths: ['Resume is formatted correctly.'],
            weaknesses: ['Job description is too short or lacks standard keywords.'],
            optimizedResume: resume,
            improvements: { scoreBoost: 0, addedKeywords: 0, explanations: [] }
        };
    }

    // 2. Extract full text from resume for matching
    const resumeText = [
        resume.summary,
        ...resume.skills,
        ...resume.experience.map(e => `${e.title} ${e.description}`),
        ...resume.projects.map(p => `${p.name} ${p.description}`)
    ].join(' ').toLowerCase();

    // 3. Find matched vs missing
    const matched: string[] = [];
    const missing: JDKeyword[] = [];
    
    combinedKeywords.forEach(kw => {
        if (resumeText.includes(kw.term.toLowerCase())) {
            matched.push(kw.term);
        } else {
            missing.push(kw);
        }
    });

    // 4. Calculate Match Score (Conservative weighting)
    // Base score from general completeness (max 40)
    let baseScore = 0;
    if (resume.summary?.length > 50) baseScore += 10;
    if (resume.experience?.length > 0) baseScore += 20;
    if (resume.skills?.length > 4) baseScore += 10;
    
    // Keyword match score (max 60)
    const keywordMatchPercent = combinedKeywords.length > 0 ? (matched.length / combinedKeywords.length) : 0;
    const keywordScore = Math.round(keywordMatchPercent * 60);
    
    let matchScore = baseScore + keywordScore;
    if (matchScore > 100) matchScore = 100;

    let matchQuality: OptimizationResult['matchQuality'] = 'Weak Match';
    if (matchScore >= 80) matchQuality = 'Strong Match';
    else if (matchScore >= 60) matchQuality = 'Good Match';
    else if (matchScore >= 40) matchQuality = 'Moderate Match';

    // 5. Group missing keywords
    const missingGroupsMap: Record<string, string[]> = {
        'Technical Skills': [],
        'Tools & Frameworks': [],
        'Business & Soft Skills': []
    };
    
    missing.forEach(kw => {
        missingGroupsMap[kw.category].push(kw.term);
    });
    
    const missingKeywordGroups: MissingKeywordGroup[] = Object.entries(missingGroupsMap)
        .filter(([_, words]) => words.length > 0)
        .map(([cat, words]) => ({ category: cat as KeywordCategory, keywords: words }));

    // 6. Strengths and Weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const explanations: string[] = [];
    
    if (resume.experience.length > 0) strengths.push('Strong experience section with clear roles.');
    if (matched.length > 3) strengths.push(`Good baseline coverage of ${matched.length} key requirements.`);
    if (baseScore >= 40) strengths.push('Resume structure and section completeness is solid.');

    if (missingGroupsMap['Technical Skills'].length > 2) weaknesses.push('Significant gaps in core technical requirements.');
    if (!resume.summary || resume.summary.length < 50) weaknesses.push('Professional summary is weak or missing, reducing keyword density.');

    // 7. Generate Optimized Resume (Deep clone to avoid mutating state)
    const optimizedResume: ResumeData = JSON.parse(JSON.stringify(resume));
    
    // Deterministic Enhancement Logic:
    // A. Add top missing skills to the skills array (limit to 3 to avoid stuffing)
    let addedKeywords = 0;
    const topMissingSkills = missing
        .filter(m => m.category === 'Technical Skills' || m.category === 'Tools & Frameworks')
        .slice(0, 3)
        .map(m => m.term);
    
    if (topMissingSkills.length > 0) {
        optimizedResume.skills = [...new Set([...optimizedResume.skills, ...topMissingSkills])];
        // Count only skills not already present
        addedKeywords += topMissingSkills.filter(s => !resume.skills.includes(s)).length;
        const skillsList = topMissingSkills.slice(0, 3).join(', ');
        explanations.push(`Added ${topMissingSkills.length} in-demand skills from the JD to your skills section: ${skillsList}.`);
    }

    // B. Enhance Summary with business keywords if missing
    const missingBiz = missingGroupsMap['Business & Soft Skills'].slice(0, 2);
    if (missingBiz.length > 0) {
        const addition = ` Proven ability in ${missingBiz.join(' and ')} to drive business outcomes.`;
        if (optimizedResume.summary) {
            optimizedResume.summary += addition;
        } else {
            optimizedResume.summary = `Dedicated professional with expertise in relevant industry technologies.${addition}`;
        }
        addedKeywords += missingBiz.length;
        explanations.push(`Contextually wove soft skills (${missingBiz.join(', ')}) into the professional summary.`);
    }

    // C. Enhance the latest experience bullet point slightly
    const missingTools = missingGroupsMap['Tools & Frameworks'].slice(0, 1);
    if (missingTools.length > 0 && optimizedResume.experience.length > 0) {
        const latestExp = optimizedResume.experience[0];
        if (latestExp.description) {
            latestExp.description += `\nLeveraged ${missingTools[0]} to optimize workflows and improve delivery times.`;
            addedKeywords += 1;
            explanations.push(`Added a quantifiable bullet point demonstrating ${missingTools[0]} usage in your most recent role.`);
        }
    }

    // Calculate score boost — conservative, capped at +18 to maintain credibility
    // Each keyword added contributes ~1.5 pts, summary improvement ~3 pts, tool bullet ~2 pts
    const RAW_BOOST_PER_SKILL = 1.5;
    const SUMMARY_BOOST = missingBiz.length > 0 ? 3 : 0;
    const TOOL_BOOST = missingTools.length > 0 && optimizedResume.experience.length > 0 ? 2 : 0;
    const rawBoost = (addedKeywords * RAW_BOOST_PER_SKILL) + SUMMARY_BOOST + TOOL_BOOST;
    const scoreBoost = Math.min(18, Math.max(0, Math.round(rawBoost)));

    return {
        matchScore,
        matchQuality,
        matchedSkills: matched,
        missingKeywordGroups,
        strengths,
        weaknesses,
        optimizedResume,
        improvements: {
            scoreBoost,
            addedKeywords,
            explanations
        }
    };
}
