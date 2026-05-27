'use client';

import React, { useMemo, useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { generateDeterministicSuggestions, SuggestionCategory } from '@/lib/ai-suggestions';
import { calculateResumeScore } from '@/lib/scoring';
import { SuggestionCard } from '@/components/ai-suggestions/SuggestionCard';
import { FeaturePlaceholder } from '@/components/ui/FeaturePlaceholder';
import { ResumePreview } from '@/components/resume-builder/ResumePreview';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CircularScore } from '@/components/resume-score/CircularScore';
import { 
    RefreshCcw, 
    Sparkles, 
    ShieldAlert, 
    Lightbulb,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AISuggestionsPage() {
    const { resumeData, getOverallProgress } = useResumeStore();
    const progress = getOverallProgress();
    
    // UI State
    const [activeTab, setActiveTab] = useState<SuggestionCategory | 'All'>('All');
    const [isRegenerating, setIsRegenerating] = useState(false);

    // Memoized core logic
    const scoreResult = useMemo(() => calculateResumeScore(resumeData), [resumeData]);
    const allSuggestions = useMemo(() => generateDeterministicSuggestions(resumeData), [resumeData]);

    const handleRegenerate = () => {
        setIsRegenerating(true);
        // Simulate a slight delay to feel like "thinking"
        setTimeout(() => setIsRegenerating(false), 800);
    };

    // Filter logic
    const filteredSuggestions = allSuggestions.filter(s => activeTab === 'All' || s.category === activeTab);

    // Empty state for brand new resumes
    if (progress < 15 && resumeData.experience.length === 0) {
        return (
            <div className="h-full flex items-center justify-center pt-10">
                <FeaturePlaceholder 
                    title="Not Enough Data"
                    description="Complete more of your resume sections to generate accurate AI suggestions."
                    icon={<ShieldAlert className="w-8 h-8 text-yellow-500" />}
                    isBeta={false}
                    showResumeBuilderButton={true}
                />
            </div>
        );
    }

    const tabs: Array<SuggestionCategory | 'All'> = ['All', 'Projects', 'Skills', 'Content', 'Keywords'];

    return (
        <div className="pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-bold text-text-primary tracking-tight">AI Suggestions</h1>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-primary-light text-primary border border-primary/20">
                            Beta
                        </span>
                    </div>
                    <p className="text-text-secondary">Actionable, data-driven recommendations to improve your ATS score.</p>
                </div>
                <Button 
                    variant="outline" 
                    className="gap-2 bg-white hidden sm:flex" 
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                >
                    <RefreshCcw size={16} className={cn(isRegenerating && "animate-spin")} />
                    {isRegenerating ? 'Analyzing...' : 'Regenerate'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
                
                {/* Center Feed Area (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Category Filter Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
                                    activeTab === tab 
                                        ? "bg-text-primary text-white border-text-primary shadow-sm" 
                                        : "bg-white text-text-secondary border-border hover:bg-gray-50 hover:text-text-primary"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Suggestions Feed */}
                    <div className={cn("space-y-4 transition-opacity duration-300", isRegenerating ? "opacity-50" : "opacity-100")}>
                        {filteredSuggestions.length > 0 ? (
                            filteredSuggestions.map(suggestion => (
                                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                            ))
                        ) : (
                            <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                                    <Sparkles className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-2">You're fully optimized!</h3>
                                <p className="text-text-secondary max-w-sm">
                                    We couldn't find any actionable suggestions for the "{activeTab}" category. Great job keeping your resume sharp.
                                </p>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Right Panel (4 cols) */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
                    
                    {/* Mini Resume Score Widget */}
                    <Card className="p-5 border-border bg-white shadow-sm flex flex-col items-center">
                        <div className="w-full flex items-center justify-between mb-4">
                            <span className="font-bold text-text-primary text-sm">Current ATS Score</span>
                            <Link href="/analyze-improve/resume-score" className="text-xs text-primary font-medium hover:underline flex items-center">
                                View Details <ChevronRight size={12} className="ml-0.5" />
                            </Link>
                        </div>
                        
                        <CircularScore score={scoreResult.overall} size={110} strokeWidth={10} />
                        
                        <div className="w-full mt-6 space-y-3">
                            {Object.values(scoreResult.categories).map(cat => (
                                <div key={cat.name} className="flex items-center justify-between text-xs">
                                    <span className="text-text-secondary font-medium">{cat.name}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={cn(
                                                    "h-full rounded-full",
                                                    cat.score >= 80 ? "bg-green-500" : cat.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                                                )}
                                                style={{ width: `${cat.score}%` }}
                                            />
                                        </div>
                                        <span className="font-bold text-text-primary w-6 text-right">{cat.score}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* AI Tip Card */}
                    <Card className="p-4 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                        <div className="flex gap-3">
                            <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm text-text-primary mb-1">AI Tip of the Day</h4>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    Tailoring your "Skills" section to exactly match a job description can increase your ATS ranking by up to 40%.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Live Preview Panel */}
                    <Card className="overflow-hidden border-border bg-white shadow-sm hidden md:block">
                        <div className="px-4 py-3 border-b border-border bg-gray-50 flex items-center justify-between">
                            <span className="font-bold text-xs text-text-secondary uppercase tracking-wider">Live Preview</span>
                        </div>
                        <div className="p-0 bg-gray-100 max-h-[300px] overflow-y-auto custom-scrollbar">
                            <div className="transform scale-[0.6] origin-top">
                                <ResumePreview />
                            </div>
                        </div>
                    </Card>

                </div>

            </div>
        </div>
    );
}
