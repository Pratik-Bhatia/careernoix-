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
    isDraft?: boolean;
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

export type SyncStatus = 'idle' | 'saving' | 'saved' | 'error';

interface ResumeStore {
    resumeData: ResumeData;
    syncStatus: SyncStatus;
    savedProjectRecommendations: string[];

    // Actions
    updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
    updateSummary: (summary: string) => void;

    // Lists Actions (Experience, Education, Projects, Certifications, Languages)
    setExperience: (entries: ExperienceEntry[]) => void;
    setEducation: (entries: EducationEntry[]) => void;
    setProjects: (entries: ProjectEntry[]) => void;
    setCertifications: (entries: CertificationEntry[]) => void;
    setLanguages: (entries: LanguageEntry[]) => void;

    // AI Suggestions Helpers
    addDraftProject: (project: Omit<ProjectEntry, 'id'>) => boolean;
    addDraftSkill: (skill: string) => boolean;

    // Saved Project Recommendations Actions
    toggleSaveProjectRecommendation: (id: string) => void;
    isProjectRecommendationSaved: (id: string) => boolean;

    // Simple Array lists (Skills, Achievements)
    setSkills: (skills: string[]) => void;
    setAchievements: (achievements: string[]) => void;

    // Sync actions
    hydrateFromBackend: (data: ResumeData) => void;
    setSyncStatus: (status: SyncStatus) => void;
    resetResume: () => void;

    // Helpers
    getSectionCompletion: (section: keyof ResumeData) => number;
    getOverallProgress: () => number; // 0-100 score
}

// ─── Default Starter Values ──────────────────────────────

const emptyPersonalInfo: PersonalInfo = {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    jobTitle: '',
    website: '',
    linkedin: '',
    github: ''
};

const emptyData: ResumeData = {
    personalInfo: emptyPersonalInfo,
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: []
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
                ...emptyData,
                // On initial load, try to migrate data if it exists in standalone localStorage
                experience: (() => {
                    const legacyExperience = getLocalStorageItem('careeronix_experience_entries');
                    // ONLY migrate if it is NOT the dummy data. We check a known dummy title.
                    const isDummy = legacyExperience && legacyExperience.some((e: any) => e.title === 'Data Analyst Intern' && e.company === 'BrightPath Analytics');
                    return (legacyExperience && !isDummy) ? legacyExperience : [];
                })()
            },
            syncStatus: 'idle' as SyncStatus,
            savedProjectRecommendations: [],

            toggleSaveProjectRecommendation: (id) => set((state) => {
                const saved = state.savedProjectRecommendations.includes(id)
                    ? state.savedProjectRecommendations.filter(x => x !== id)
                    : [...state.savedProjectRecommendations, id];
                return { savedProjectRecommendations: saved };
            }),

            isProjectRecommendationSaved: (id) => {
                return get().savedProjectRecommendations.includes(id);
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

            addDraftProject: (project) => {
                const state = get();
                // Prevent duplicate by checking name
                if (state.resumeData.projects.some(p => p.name.toLowerCase() === project.name.toLowerCase())) {
                    return false;
                }
                const newProject: ProjectEntry = {
                    ...project,
                    id: `proj-${Date.now()}`,
                    isDraft: true
                };
                set((state) => ({
                    resumeData: {
                        ...state.resumeData,
                        projects: [...state.resumeData.projects, newProject]
                    }
                }));
                return true;
            },

            addDraftSkill: (skill) => {
                const state = get();
                // Prevent duplicate skill (case insensitive)
                if (state.resumeData.skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
                    return false;
                }
                set((state) => ({
                    resumeData: {
                        ...state.resumeData,
                        skills: [...state.resumeData.skills, skill]
                    }
                }));
                return true;
            },

            setAchievements: (achievements) => set((state) => ({
                resumeData: { ...state.resumeData, achievements }
            })),

            hydrateFromBackend: (data: ResumeData) => set({ resumeData: data }),

            setSyncStatus: (status: SyncStatus) => set({ syncStatus: status }),

            resetResume: () => set({ resumeData: emptyData, savedProjectRecommendations: [] }),

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
            partialize: (state) => ({ 
                resumeData: state.resumeData,
                savedProjectRecommendations: state.savedProjectRecommendations
            }),
            onRehydrateStorage: () => (state) => {
                // Sanitize legacy "Alex Morgan" data from persisted storage for existing users
                if (state && state.resumeData?.personalInfo?.email === 'alex.morgan@example.com') {
                    state.resetResume();
                }
            }
        }
    )
);
