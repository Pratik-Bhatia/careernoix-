'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useResumeStore } from '@/store/useResumeStore';
import { cn } from '@/lib/utils';
import {
    User,
    FileText,
    BriefcaseBusiness,
    GraduationCap,
    Wrench,
    FolderGit,
    Award,
    Trophy,
    Globe,
    CheckCircle2
} from 'lucide-react';

const steps = [
    { name: 'Personal Info', href: '/resume-builder/personal-info', icon: User, section: 'personalInfo' },
    { name: 'Summary', href: '/resume-builder/summary', icon: FileText, section: 'summary' },
    { name: 'Experience', href: '/resume-builder/experience', icon: BriefcaseBusiness, section: 'experience' },
    { name: 'Education', href: '/resume-builder/education', icon: GraduationCap, section: 'education' },
    { name: 'Skills', href: '/resume-builder/skills', icon: Wrench, section: 'skills' },
    { name: 'Projects', href: '/resume-builder/projects', icon: FolderGit, section: 'projects' },
    { name: 'Certifications', href: '/resume-builder/certifications', icon: Award, section: 'certifications' },
    { name: 'Achievements', href: '/resume-builder/achievements', icon: Trophy, section: 'achievements' },
    { name: 'Languages', href: '/resume-builder/languages', icon: Globe, section: 'languages' },
] as const;

export function ResumeBuilderSidebar() {
    const pathname = usePathname();
    const { getSectionCompletion } = useResumeStore();

    return (
        <nav className="flex flex-row overflow-x-auto pb-4 gap-2 lg:flex-col lg:overflow-x-visible lg:pb-0 lg:space-y-1 scrollbar-none flex-shrink-0">
            {steps.map((step) => {
                const Icon = step.icon;
                const isActive = pathname === step.href;
                const completion = getSectionCompletion(step.section);
                const isCompleted = completion === 100;

                return (
                    <Link
                        key={step.href}
                        href={step.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 border whitespace-nowrap min-w-max lg:min-w-0 lg:w-full",
                            isActive
                                ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10'
                                : 'bg-surface text-text-secondary border-border hover:bg-gray-50 hover:text-text-primary'
                        )}
                    >
                        <div className="relative flex items-center justify-center">
                            <Icon size={18} className={cn(isActive ? 'text-white' : 'text-text-placeholder')} />
                            {isCompleted && !isActive && (
                                <span className="absolute -top-1.5 -right-1.5 bg-green-600 text-white rounded-full p-0.5 border border-white">
                                    <CheckCircle2 size={8} strokeWidth={3} />
                                </span>
                            )}
                        </div>
                        <span className="flex-1 text-left">{step.name}</span>
                        {completion > 0 && !isCompleted && (
                            <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full font-medium",
                                isActive ? 'bg-white/20 text-white' : 'bg-primary-light text-primary'
                            )}>
                                {completion}%
                            </span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
