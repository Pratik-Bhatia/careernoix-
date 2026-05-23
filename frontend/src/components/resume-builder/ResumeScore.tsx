'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { Star, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ResumeScore() {
    const { getOverallProgress } = useResumeStore();
    const score = getOverallProgress();

    let feedback = 'Get started by filling out your Personal Info and adding your Work Experience!';
    let rating = 'Poor';
    let colorClass = 'text-error bg-error/5 border-error/10';
    let icon = AlertCircle;

    if (score >= 80) {
        feedback = 'Excellent! Your resume is highly detailed and ready for job matching applications.';
        rating = 'Strong';
        colorClass = 'text-success bg-green-50 border-green-100';
        icon = CheckCircle2;
    } else if (score >= 40) {
        feedback = 'Looking good! Add projects, skills, or certifications to boost your recruiter matching chances.';
        rating = 'Good';
        colorClass = 'text-primary bg-primary-light border-primary/10';
        icon = Sparkles;
    }

    const Icon = icon;

    return (
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h3 className="font-bold text-text-primary text-base">Resume Strength</h3>
                    <p className="text-xs text-text-secondary">Overall profile completion status</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary font-bold text-lg shadow-sm border border-primary/5">
                    {score}
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-primary transition-all duration-500 ease-out" 
                    style={{ width: `${score}%` }}
                />
            </div>

            {/* Feedback box */}
            <div className={cn("p-3.5 rounded-xl border flex gap-3 text-xs leading-normal items-start", colorClass)}>
                <Icon size={16} className="shrink-0 mt-0.5" />
                <div>
                    <span className="font-bold">Rating: {rating}</span>
                    <p className="mt-0.5 opacity-90">{feedback}</p>
                </div>
            </div>
        </div>
    );
}
