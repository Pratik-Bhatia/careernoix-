'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useResumeStore } from '@/store/useResumeStore';
import { calculateResumeScore } from '@/lib/scoring';
import { CircularScore } from '@/components/resume-score/CircularScore';
import { RadarScoreChart } from '@/components/resume-score/RadarScoreChart';
import { ScoreHistoryChart } from '@/components/resume-score/ScoreHistoryChart';
import { ResumePreview } from '@/components/resume-builder/ResumePreview';
import { PreviewPanel } from '@/components/resume-builder/PreviewPanel';
import { FeaturePlaceholder } from '@/components/ui/FeaturePlaceholder';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
    RefreshCcw, 
    AlertCircle, 
    ChevronRight, 
    FileText, 
    Award, 
    Layout, 
    Search, 
    TrendingUp,
    Sparkles,
    ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImprovementActionButton } from '@/components/resume-score/ImprovementActionButton';

export default function ResumeScorePage() {
    const { resumeData, getOverallProgress } = useResumeStore();
    const progress = getOverallProgress();

    // Memoize the score calculation to prevent expensive re-renders on every minor state change
    // This satisfies the requirement to avoid recomputing the dashboard unnecessarily.
    const scoreResult = useMemo(() => calculateResumeScore(resumeData), [resumeData]);

    // If resume is completely empty, show empty state
    if (progress < 15 && resumeData.experience.length === 0) {
        return (
            <div className="h-full flex items-center justify-center pt-10">
                <FeaturePlaceholder 
                    title="Not Enough Data"
                    description="Complete more of your resume sections (at least Personal Info and Experience) to generate an accurate ATS score."
                    icon={<ShieldAlert className="w-8 h-8 text-yellow-500" />}
                    isBeta={false}
                    showResumeBuilderButton={true}
                />
            </div>
        );
    }

    const { overall, categories, suggestions, isCapped, capReason } = scoreResult;

    // Helper to map category to icon
    const getCategoryIcon = (name: string) => {
        switch(name.toLowerCase()) {
            case 'content': return <FileText size={18} />;
            case 'skills': return <Award size={18} />;
            case 'format': return <Layout size={18} />;
            case 'keywords': return <Search size={18} />;
            case 'achievements': return <TrendingUp size={18} />;
            default: return <FileText size={18} />;
        }
    };

    return (
        <div className="pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary tracking-tight">Resume Score</h1>
                    <p className="text-text-secondary mt-1">Analyze your ATS compatibility and discover areas for improvement.</p>
                </div>
                <Button variant="outline" className="gap-2 bg-white hidden sm:flex" onClick={() => window.location.reload()}>
                    <RefreshCcw size={16} />
                    Rescan Resume
                </Button>
            </div>

            {/* Dashboard Grid (3-Column Layout on Desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
                
                {/* Center Content Area (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Hero Card */}
                    <Card className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-white to-gray-50/50">
                        <div className="flex-shrink-0">
                            <CircularScore score={overall} size={140} strokeWidth={12} label="Overall Score" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-text-primary mb-2">
                                {overall >= 80 ? 'Excellent' : overall >= 60 ? 'Good Job' : 'Needs Improvement'}
                            </h2>
                            <p className="text-text-secondary mb-4 max-w-md">
                                {overall >= 80 
                                    ? "Your resume is highly optimized for ATS. Review minor suggestions to perfect it." 
                                    : "Improve the areas below to get closer to an ATS-perfect score and increase your callback rate."}
                            </p>
                            {isCapped && (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 text-sm font-medium border border-yellow-200">
                                    <AlertCircle size={16} />
                                    Score Capped: {capReason}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Breakdown & Radar Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Summary Section */}
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-text-primary mb-5">Score Summary</h3>
                            <div className="space-y-4">
                                {Object.values(categories).map((cat) => (
                                    <div key={cat.name} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
                                                <span className="text-primary/70">{getCategoryIcon(cat.name)}</span>
                                                {cat.name}
                                            </div>
                                            <span className="text-sm font-bold text-text-primary">{cat.score} / 100</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-1000 ease-out",
                                                    cat.score >= 80 ? "bg-green-500" : cat.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                                                )}
                                                style={{ width: `${cat.score}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Radar Chart */}
                        <Card className="p-6 flex flex-col">
                            <h3 className="text-lg font-bold text-text-primary mb-2">Category Balance</h3>
                            <p className="text-xs text-text-secondary mb-4">Visualize your resume's strengths and weaknesses.</p>
                            <div className="flex-1 flex items-center justify-center">
                                <RadarScoreChart categories={categories} />
                            </div>
                        </Card>
                    </div>

                    {/* Suggestions Section */}
                    <div>
                        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                            <Sparkles size={20} className="text-primary" />
                            Improvement Suggestions
                        </h3>
                        <div className="space-y-3">
                            {suggestions.map((suggestion, idx) => (
                                <Card key={idx} className="p-4 hover:shadow-md transition-shadow group border-l-4 border-l-primary">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h4 className="text-base font-bold text-text-primary mb-1">{suggestion.title}</h4>
                                            <p className="text-sm text-text-secondary leading-relaxed">{suggestion.description}</p>
                                            <ImprovementActionButton title={suggestion.title} />
                                        </div>
                                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                                                {suggestion.impact}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Panel (4 cols) */}
                <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">
                    
                    {/* Live Preview Panel */}
                    <Card className="overflow-hidden border-border bg-white shadow-sm">
                        <div className="px-5 py-4 border-b border-border bg-gray-50 flex items-center justify-between">
                            <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider">Live Preview</h3>
                            <Link href="/resume-builder/personal-info" className="text-xs text-primary font-medium hover:underline flex items-center">
                                Edit <ChevronRight size={12} className="ml-0.5" />
                            </Link>
                        </div>
                        <PreviewPanel className="max-h-[700px] overflow-y-auto">
                            <ResumePreview />
                        </PreviewPanel>
                    </Card>

                    {/* Benchmark Comparison */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4 text-center">
                            <span className="block text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">Industry Avg</span>
                            <span className="text-2xl font-bold text-gray-700">58</span>
                        </Card>
                        <Card className="p-4 text-center">
                            <span className="block text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">Top Performers</span>
                            <span className="text-2xl font-bold text-green-600">85</span>
                        </Card>
                    </div>

                    {/* Score History Chart */}
                    <Card className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-sm text-text-primary">Score History</h3>
                            <span className="text-xs text-primary font-medium bg-primary-light px-2 py-0.5 rounded border border-primary/20">Beta</span>
                        </div>
                        <ScoreHistoryChart currentScore={overall} />
                    </Card>

                    {/* AI Feedback Promo (Static for V1) */}
                    <Card className="p-5 bg-primary/5 border border-primary/20">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-primary-dark mb-1">AI Optimizer Coming Soon</h4>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    Soon you'll be able to instantly rewrite your bullet points and match keywords to specific job descriptions with one click.
                                </p>
                            </div>
                        </div>
                    </Card>

                </div>

            </div>
        </div>
    );
}
