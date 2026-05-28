'use client';

import React, { useMemo, useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { 
    generateDeterministicSuggestions, 
    getRecommendedProjects,
    filterProjects,
    FilterCategory
} from '@/lib/ai-suggestions';
import { calculateResumeScore } from '@/lib/scoring';
import { SuggestionCard } from '@/components/ai-suggestions/SuggestionCard';
import { ProjectRecommendationCard } from '@/components/ai-suggestions/ProjectRecommendationCard';
import { ProjectDetailsModal } from '@/components/ai-suggestions/ProjectDetailsModal';
import { FeaturePlaceholder } from '@/components/ui/FeaturePlaceholder';
import { ResumePreview } from '@/components/resume-builder/ResumePreview';
import { PreviewPanel } from '@/components/resume-builder/PreviewPanel';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CircularScore } from '@/components/resume-score/CircularScore';
import { 
    RefreshCcw, 
    Sparkles, 
    ShieldAlert, 
    Lightbulb,
    ChevronRight,
    Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AISuggestionsPage() {
    const { resumeData, getOverallProgress, savedProjectRecommendations } = useResumeStore();
    const progress = getOverallProgress();
    
    // UI State
    const [activeTab, setActiveTab] = useState<FilterCategory | 'Saved'>('All');
    const [isRegenerating, setIsRegenerating] = useState(false);
    
    // Modal State
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Memoized core logic
    const scoreResult = useMemo(() => calculateResumeScore(resumeData), [resumeData]);
    
    // We now have two engines: The new Project Recommendation Engine and the Legacy ATS Engine
    const recommendedProjects = useMemo(() => getRecommendedProjects(resumeData), [resumeData]);
    const atsSuggestions = useMemo(() => generateDeterministicSuggestions(resumeData), [resumeData]);

    const handleRegenerate = () => {
        setIsRegenerating(true);
        // Simulate a slight delay to feel like "thinking"
        setTimeout(() => setIsRegenerating(false), 800);
    };

    // Filter logic for projects
    const filteredProjects = useMemo(() => {
        if (activeTab === 'Saved') {
            return recommendedProjects.filter(p => savedProjectRecommendations.includes(p.id));
        }
        return filterProjects(recommendedProjects, activeTab, resumeData.skills);
    }, [recommendedProjects, activeTab, resumeData.skills, savedProjectRecommendations]);

    // Empty state for brand new resumes
    if (progress < 15 && resumeData.experience.length === 0) {
        return (
            <div className="h-full flex items-center justify-center pt-10">
                <FeaturePlaceholder 
                    title="Not Enough Data"
                    description="Complete more of your resume sections to generate personalized project recommendations."
                    icon={<ShieldAlert className="w-8 h-8 text-yellow-500" />}
                    isBeta={false}
                    showResumeBuilderButton={true}
                />
            </div>
        );
    }

    const tabs: Array<FilterCategory | 'Saved'> = [
        'All', 
        'Saved',
        'Based On Your Skills', 
        'High Impact', 
        'Beginner Friendly', 
        'ATS Boosters',
        'Trending',
        'Data Analysis',
        'Machine Learning',
        'Frontend',
        'Backend'
    ];

    return (
        <div className="pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-bold text-text-primary tracking-tight">AI Project Recommendations</h1>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-primary-light text-primary border border-primary/20">
                            Beta
                        </span>
                    </div>
                    <p className="text-text-secondary">Personalized project ideas based on your skills and target role to boost your ATS ranking.</p>
                </div>
                <Button 
                    variant="outline" 
                    className="gap-2 bg-white hidden sm:flex" 
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                >
                    <RefreshCcw size={16} className={cn(isRegenerating && "animate-spin")} />
                    {isRegenerating ? 'Analyzing...' : 'Refresh'}
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
                    <div className={cn("space-y-6 transition-opacity duration-300", isRegenerating ? "opacity-50" : "opacity-100")}>
                        
                        {/* New Rich Project Cards */}
                        {filteredProjects.length > 0 ? (
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Briefcase size={16} /> Recommended Projects
                                </h3>
                                {filteredProjects.map(project => (
                                    <ProjectRecommendationCard 
                                        key={project.id} 
                                        project={project} 
                                        onViewDetails={(p) => {
                                            setSelectedProject(p);
                                            setIsModalOpen(true);
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                    <Sparkles className="w-8 h-8 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-2">No projects found</h3>
                                <p className="text-text-secondary max-w-sm">
                                    We couldn't find any specific project recommendations for the "{activeTab}" category.
                                </p>
                            </Card>
                        )}

                        {/* Legacy ATS Tips */}
                        {activeTab === 'All' && atsSuggestions.length > 0 && (
                             <div className="space-y-4 pt-6 border-t border-border">
                                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Lightbulb size={16} /> General ATS Tips
                                </h3>
                                {atsSuggestions.map(suggestion => (
                                    <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                                ))}
                            </div>
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

                    {/* Live Preview Panel */}
                    <Card className="overflow-hidden border-border bg-white shadow-sm hidden md:block">
                        <div className="px-4 py-3 border-b border-border bg-gray-50 flex items-center justify-between">
                            <span className="font-bold text-xs text-text-secondary uppercase tracking-wider">Live Preview</span>
                        </div>
                        <PreviewPanel className="max-h-[500px] overflow-y-auto">
                            <ResumePreview />
                        </PreviewPanel>
                    </Card>

                </div>

            </div>

            {/* Project Details Modal */}
            <ProjectDetailsModal 
                project={selectedProject} 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />

        </div>
    );
}
