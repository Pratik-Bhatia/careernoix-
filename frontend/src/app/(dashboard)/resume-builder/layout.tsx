'use client';

import { ResumePreview } from '@/components/resume-builder/ResumePreview';
import { PreviewPanel } from '@/components/resume-builder/PreviewPanel';
import { ResumeScore } from '@/components/resume-builder/ResumeScore';
import { useResumeSync } from '@/store/useResumeSync';
import { useResumeStore } from '@/store/useResumeStore';
import { CheckCircle, Loader2, WifiOff } from 'lucide-react';

function SyncStatusBadge() {
    const syncStatus = useResumeStore((s) => s.syncStatus);

    if (syncStatus === 'idle') return null;

    const config = {
        saving: {
            icon: <Loader2 className="h-3 w-3 animate-spin" />,
            text: 'Saving…',
            className: 'text-text-secondary',
        },
        saved: {
            icon: <CheckCircle className="h-3 w-3 text-green-500" />,
            text: 'Saved',
            className: 'text-green-600',
        },
        error: {
            icon: <WifiOff className="h-3 w-3 text-red-400" />,
            text: 'Save failed',
            className: 'text-red-500',
        },
    }[syncStatus];

    return (
        <div className={`flex items-center gap-1 text-xs font-medium ${config.className}`}>
            {config.icon}
            {config.text}
        </div>
    );
}

export default function ResumeBuilderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Activate backend sync — fetches on mount, auto-saves on changes
    useResumeSync();

    return (
        <div className="pb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Sync status indicator — top-right, only visible when syncing */}
            <div className="flex justify-end mb-3 min-h-[20px]">
                <SyncStatusBadge />
            </div>

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
                        <PreviewPanel className="max-h-[600px] overflow-y-auto">
                            <ResumePreview />
                        </PreviewPanel>
                    </div>
                </div>
            </div>
        </div>
    );
}
