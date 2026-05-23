'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, FileText, Sparkles } from 'lucide-react';

export default function SummaryPage() {
    const router = useRouter();
    const { resumeData, updateSummary } = useResumeStore();
    const { summary } = resumeData;
    const [isImproving, setImproving] = useState(false);

    const handleBack = () => {
        router.push('/resume-builder/personal-info');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/resume-builder/experience');
    };

    const improveSummary = () => {
        if (!summary.trim()) return;

        setImproving(true);
        window.setTimeout(() => {
            // Simulated AI enhancement to make the summary sound more professional
            const improvedText = summary
                .replace(/(I am a|I'm a)/gi, 'Results-oriented')
                .replace(/(good at|skilled in|expert in)/gi, 'proficient in')
                .replace(/(looking for|seeking a)/gi, 'aiming to leverage expertise in')
                .replace(/\b(develop|make|build)\b/gi, 'architect')
                .replace(/\b(work|run)\b/gi, 'execute')
                .trim();
            
            const suffix = improvedText.endsWith('.') ? '' : '.';
            updateSummary(`${improvedText}${suffix} Dedicated to driving efficiency and delivering high-quality software solutions.`);
            setImproving(false);
        }, 600);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6 space-y-6">
                <div className="border-b border-gray-100 pb-4">
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary">
                        <FileText size={14} />
                        Section 2
                    </div>
                    <h2 className="text-xl font-bold text-text-primary">Professional Summary</h2>
                    <p className="text-sm text-text-secondary mt-1">
                        Briefly introduce yourself, your core strengths, and what you aim to achieve in your next role.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label htmlFor="summary-textarea" className="text-sm font-semibold text-text-secondary">
                            Write your summary
                        </label>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={improveSummary}
                            disabled={!summary.trim()}
                            isLoading={isImproving}
                            className="gap-2"
                        >
                            <Sparkles className="h-4 w-4" />
                            Polish wording
                        </Button>
                    </div>

                    <textarea
                        id="summary-textarea"
                        value={summary}
                        onChange={(e) => updateSummary(e.target.value)}
                        placeholder="e.g. Experienced software developer specializing in scalable cloud applications and interactive user interfaces..."
                        className="min-h-40 w-full resize-y rounded-xl border border-border bg-white px-4 py-3 text-sm leading-6 text-text-primary outline-none transition-all placeholder:text-text-placeholder hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary-light"
                        required
                    />
                </div>
            </div>

            <div className="flex justify-between">
                <Button type="button" variant="secondary" onClick={handleBack} className="gap-2">
                    <ArrowLeft size={16} />
                    Back
                </Button>
                <Button type="submit" className="gap-2">
                    Save & Next
                    <ArrowRight size={16} />
                </Button>
            </div>
        </form>
    );
}
