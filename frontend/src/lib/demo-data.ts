import { ResumeData, PersonalInfo, ExperienceEntry, EducationEntry, ProjectEntry, CertificationEntry, LanguageEntry } from '@/store/useResumeStore';

export const initialPersonalInfo: PersonalInfo = {
    fullName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    jobTitle: 'Full Stack Engineer',
    website: 'https://alexmorgan.dev',
    linkedin: 'https://linkedin.com/in/alexmorgan',
    github: 'https://github.com/alexmorgan'
};

export const initialSummary = 'Results-driven Full Stack Engineer with 2+ years of experience designing, building, and deploying web applications. Passionate about writing clean, maintainable code and solving complex technical challenges.';

export const initialExperience: ExperienceEntry[] = [
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

export const initialEducation: EducationEntry[] = [
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

export const initialSkills = ['React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'FastAPI', 'Next.js', 'Docker', 'Git'];

export const initialProjects: ProjectEntry[] = [
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

export const initialCertifications: CertificationEntry[] = [
    {
        id: 'cert-1',
        name: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        date: '2024-11',
        link: 'https://aws.amazon.com'
    }
];

export const initialAchievements = [
    'Won 1st place in HackFest 2024 out of 50+ competing teams.',
    'Contributed 15+ pull requests to open-source developer tool projects.'
];

export const initialLanguages: LanguageEntry[] = [
    { id: 'lang-1', name: 'English', proficiency: 'Native' },
    { id: 'lang-2', name: 'Spanish', proficiency: 'Conversational' }
];

export const initialData: ResumeData = {
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
