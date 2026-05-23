'use client';

import { ResumeBuilderSidebar } from '@/components/resume-builder/Sidebar';
import { ResumePreview } from '@/components/resume-builder/ResumePreview';
import { ResumeScore } from '@/components/resume-builder/ResumeScore';
import { useResumeStore } from '@/store/useResumeStore';
import { FileText } from 'lucide-react';

export default function ResumeBuilderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { getOverallProgress } = useResumeStore();
    const progress = getOverallProgress();

    return (
        <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header section */}
            <header className="overflow-hidden rounded-2xl border border-white/70 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
                            <FileText className="h-3.5 w-3.5" />
                            Resume Builder
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                            Guided Resume Creation
                        </h1>
                        <p className="mt-1.5 text-sm text-text-secondary">
                            Complete all sections to optimize your profile strength and match with top opportunities.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-gray-50 border border-border px-4 py-3.5 rounded-xl self-start sm:self-auto min-w-[200px]">
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between text-xs font-bold text-text-secondary">
                                <span>Overall Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary transition-all duration-300" 
                                    style={{ width: `${progress}%` }} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
                {/* Left: Section Navigation steps */}
                <div className="lg:col-span-3">
                    <ResumeBuilderSidebar />
                </div>

                {/* Center: Form content */}
                <div className="lg:col-span-5 space-y-6">
                    {children}
                </div>

                {/* Right: Live Preview Panel */}
                <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">
                    <ResumeScore />
                    <div>
                        <div className="mb-2 font-bold text-xs text-text-secondary uppercase tracking-wider pl-1">Live Preview</div>
                        <ResumePreview />
                    </div>
                </div>
            </div>
        </div>
    );
}
