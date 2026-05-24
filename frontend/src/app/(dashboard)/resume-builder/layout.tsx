'use client';

import { ResumePreview } from '@/components/resume-builder/ResumePreview';
import { ResumeScore } from '@/components/resume-builder/ResumeScore';

export default function ResumeBuilderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="pb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
                {/* Center: Form content */}
                <div className="lg:col-span-8 space-y-6">
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
