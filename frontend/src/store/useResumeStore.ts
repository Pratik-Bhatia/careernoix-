import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Interfaces ──────────────────────────────────────────

export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    jobTitle: string;
    website: string;
    linkedin: string;
    github: string;
}

export interface ExperienceEntry {
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

export interface EducationEntry {
    id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

export interface ProjectEntry {
    id: string;
    name: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    link: string;
}

export interface CertificationEntry {
    id: string;
    name: string;
    issuer: string;
    date: string;
    link: string;
}

export interface LanguageEntry {
    id: string;
    name: string;
    proficiency: string;
}

export interface ResumeData {
    personalInfo: PersonalInfo;
    summary: string;
    experience: ExperienceEntry[];
    education: EducationEntry[];
    skills: string[];
    projects: ProjectEntry[];
    certifications: CertificationEntry[];
    achievements: string[];
    languages: LanguageEntry[];
}

interface ResumeStore {
    resumeData: ResumeData;
    
    // Actions
    updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
    updateSummary: (summary: string) => void;
    
    // Lists Actions (Experience, Education, Projects, Certifications, Languages)
    setExperience: (entries: ExperienceEntry[]) => void;
    setEducation: (entries: EducationEntry[]) => void;
    setProjects: (entries: ProjectEntry[]) => void;
    setCertifications: (entries: CertificationEntry[]) => void;
    setLanguages: (entries: LanguageEntry[]) => void;
    
    // Simple Array lists (Skills, Achievements)
    setSkills: (skills: string[]) => void;
    setAchievements: (achievements: string[]) => void;

    // Helpers
    getSectionCompletion: (section: keyof ResumeData) => number;
    getOverallProgress: () => number; // 0-100 score
}

// ─── Default Starter Values ──────────────────────────────

const initialPersonalInfo: PersonalInfo = {
    fullName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    jobTitle: 'Full Stack Engineer',
    website: 'https://alexmorgan.dev',
    linkedin: 'https://linkedin.com/in/alexmorgan',
    github: 'https://github.com/alexmorgan'
};

const initialSummary = 'Results-driven Full Stack Engineer with 2+ years of experience designing, building, and deploying web applications. Passionate about writing clean, maintainable code and solving complex technical challenges.';

const initialExperience: ExperienceEntry[] = [
    {
        id: 'exp-1',
        title: 'Data Analyst Intern',
        company: 'BrightPath Analytics',
        location: 'Bengaluru, India',
        startDate: '2025-01',
        endDate: '2025-06',
        current: false,
        description: 'Built weekly reporting dashboards for marketing and sales teams.\nCleaned customer datasets and reduced duplicate records.\nPresented funnel insights that helped improve campaign targeting.'
    },
    {
        id: 'exp-2',
        title: 'Student Project Lead',
        company: 'Campus Innovation Lab',
        location: 'Remote',
        startDate: '2024-07',
        endDate: '',
        current: true,
        description: 'Led a 4-member team building a resume analysis tool.\nCoordinated sprint planning, UI reviews, and project demos.\nImproved project delivery speed by creating reusable task templates.'
    }
];

const initialEducation: EducationEntry[] = [
    {
        id: 'edu-1',
        school: 'Tech State University',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        startDate: '2021-09',
        endDate: '2025-05',
        current: false,
        description: 'Graduated with Honors. Specialized in Software Engineering and Database Systems.'
    }
];

const initialSkills = ['React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'FastAPI', 'Next.js', 'Docker', 'Git'];

const initialProjects: ProjectEntry[] = [
    {
        id: 'proj-1',
        name: 'TaskSphere',
        role: 'Creator / Developer',
        startDate: '2024-03',
        endDate: '2024-06',
        current: false,
        description: 'Developed a collaborative task management application with real-time updates.\nIntegrated user authentication and dynamic workspaces.\nDeployed on Vercel with an automated CI/CD pipeline.',
        link: 'https://github.com/alexmorgan/tasksphere'
    }
];

const initialCertifications: CertificationEntry[] = [
    {
        id: 'cert-1',
        name: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        date: '2024-11',
        link: 'https://aws.amazon.com'
    }
];

const initialAchievements = [
    'Won 1st place in HackFest 2024 out of 50+ competing teams.',
    'Contributed 15+ pull requests to open-source developer tool projects.'
];

const initialLanguages: LanguageEntry[] = [
    { id: 'lang-1', name: 'English', proficiency: 'Native' },
    { id: 'lang-2', name: 'Spanish', proficiency: 'Conversational' }
];

const initialData: ResumeData = {
    personalInfo: initialPersonalInfo,
    summary: initialSummary,
    experience: initialExperience,
    education: initialEducation,
    skills: initialSkills,
    projects: initialProjects,
    certifications: initialCertifications,
    achievements: initialAchievements,
    languages: initialLanguages
};

// Helper function to safely read from localStorage
const getLocalStorageItem = (key: string): any | null => {
    if (typeof window === 'undefined') return null;
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch {
        return null;
    }
};

export const useResumeStore = create<ResumeStore>()(
    persist(
        (set, get) => ({
            resumeData: {
                ...initialData,
                // On initial load, try to migrate data if it exists in standalone localStorage
                experience: (() => {
                    const legacyExperience = getLocalStorageItem('careeronix_experience_entries');
                    return legacyExperience || initialExperience;
                })()
            },

            updatePersonalInfo: (info) => set((state) => ({
                resumeData: {
                    ...state.resumeData,
                    personalInfo: { ...state.resumeData.personalInfo, ...info }
                }
            })),

            updateSummary: (summary) => set((state) => ({
                resumeData: { ...state.resumeData, summary }
            })),

            setExperience: (entries) => set((state) => ({
                resumeData: { ...state.resumeData, experience: entries }
            })),

            setEducation: (entries) => set((state) => ({
                resumeData: { ...state.resumeData, education: entries }
            })),

            setProjects: (entries) => set((state) => ({
                resumeData: { ...state.resumeData, projects: entries }
            })),

            setCertifications: (entries) => set((state) => ({
                resumeData: { ...state.resumeData, certifications: entries }
            })),

            setLanguages: (entries) => set((state) => ({
                resumeData: { ...state.resumeData, languages: entries }
            })),

            setSkills: (skills) => set((state) => ({
                resumeData: { ...state.resumeData, skills }
            })),

            setAchievements: (achievements) => set((state) => ({
                resumeData: { ...state.resumeData, achievements }
            })),

            getSectionCompletion: (section) => {
                const data = get().resumeData[section];
                if (!data) return 0;
                
                switch (section) {
                    case 'personalInfo': {
                        const pi = data as PersonalInfo;
                        const fields = [pi.fullName, pi.email, pi.phone, pi.location];
                        const filled = fields.filter((f) => f.trim().length > 0).length;
                        return Math.round((filled / 4) * 100);
                    }
                    case 'summary':
                        return (data as string).trim().length > 0 ? 100 : 0;
                    case 'experience':
                    case 'education':
                    case 'skills':
                    case 'projects':
                    case 'certifications':
                    case 'achievements':
                    case 'languages':
                        return (data as Array<any>).length > 0 ? 100 : 0;
                    default:
                        return 0;
                }
            },

            getOverallProgress: () => {
                const store = get();
                const sections: Array<keyof ResumeData> = [
                    'personalInfo',
                    'summary',
                    'experience',
                    'education',
                    'skills',
                    'projects',
                    'certifications',
                    'achievements',
                    'languages'
                ];
                
                const totalScore = sections.reduce((acc, sec) => {
                    return acc + store.getSectionCompletion(sec);
                }, 0);
                
                return Math.round(totalScore / sections.length);
            }
        }),
        {
            name: 'careeronix_resume_builder_data',
            partialize: (state) => ({ resumeData: state.resumeData })
        }
    )
);
