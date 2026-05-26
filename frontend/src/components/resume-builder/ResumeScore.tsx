'use client';

import { useMemo } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { calculateResumeScore } from '@/lib/scoring';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function ResumeScore() {
    const { resumeData, getOverallProgress } = useResumeStore();
    
    // Primary score from unified engine
    const scoreResult = useMemo(() => calculateResumeScore(resumeData), [resumeData]);
    const score = scoreResult.overall;
    
    // Internal metadata for secondary display
    const completionPercentage = getOverallProgress();

    let feedback = 'Complete your profile sections to improve your ATS score.';
    let rating = 'Needs Improvement';
    let colorClass = 'text-red-600 bg-red-50 border-red-100';
    let icon = AlertCircle;
    let progressBarClass = 'bg-red-500';

    if (score >= 80) {
        feedback = 'Excellent! Your resume is highly detailed and ATS optimized.';
        rating = 'Excellent';
        colorClass = 'text-green-700 bg-green-50 border-green-200';
        icon = CheckCircle2;
        progressBarClass = 'bg-green-500';
    } else if (score >= 60) {
        feedback = 'Good job! Review AI suggestions to reach a perfect score.';
        rating = 'Good';
        colorClass = 'text-yellow-700 bg-yellow-50 border-yellow-200';
        icon = Sparkles;
        progressBarClass = 'bg-yellow-500';
    }

    const Icon = icon;

    return (
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h3 className="font-bold text-text-primary text-base">Resume Score</h3>
                    <p className="text-xs text-text-secondary">{completionPercentage}% profile completed</p>
                </div>
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl font-bold text-lg shadow-sm border", colorClass)}>
                    {score}
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className={cn("h-full transition-all duration-500 ease-out", progressBarClass)} 
                    style={{ width: `${score}%` }}
                />
            </div>

            {/* Feedback box */}
            <div className={cn("p-3.5 rounded-xl border flex gap-3 text-xs leading-normal items-start", colorClass)}>
                <Icon size={16} className="shrink-0 mt-0.5" />
                <div className="flex-1">
                    <span className="font-bold">Rating: {rating}</span>
                    <p className="mt-0.5 opacity-90">{feedback}</p>
                </div>
            </div>
            
            <Link 
                href="/analyze-improve/resume-score" 
                className="block text-center text-xs font-semibold text-primary hover:text-primary-dark hover:underline transition-colors mt-2"
            >
                View Detailed Analysis &rarr;
            </Link>
        </div>
    );
}
