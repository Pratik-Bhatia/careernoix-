'use client';

import React, { useState } from 'react';
import { ProjectRecommendation } from '@/lib/ai-suggestions';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useResumeStore } from '@/store/useResumeStore';
import { 
    FolderPlus, 
    CheckCircle2, 
    Plus,
    Target,
    Zap,
    BookOpen,
    Bookmark
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectRecommendationCardProps {
    project: ProjectRecommendation;
    onViewDetails: (project: ProjectRecommendation) => void;
}

export function ProjectRecommendationCard({ project, onViewDetails }: ProjectRecommendationCardProps) {
    const { addDraftProject, toggleSaveProjectRecommendation, savedProjectRecommendations } = useResumeStore();
    const [actionState, setActionState] = useState<'idle' | 'success' | 'duplicate'>('idle');
    const isSaved = savedProjectRecommendations.includes(project.id);

    const handleAddProject = () => {
        const success = addDraftProject(project.draftProject);
        setActionState(success ? 'success' : 'duplicate');
        
        // Reset state after a few seconds
        setTimeout(() => {
            setActionState('idle');
        }, 3000);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch(difficulty) {
            case 'Beginner': return 'bg-green-50 text-green-700 border-green-200';
            case 'Intermediate': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Advanced': return 'bg-purple-50 text-purple-700 border-purple-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getImpactColor = (impact: string) => {
         switch(impact) {
            case 'High': return 'text-red-600 bg-red-50 border-red-100';
            case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-100';
            case 'Low': return 'text-gray-600 bg-gray-50 border-gray-100';
            default: return 'text-primary bg-primary-light border-primary/20';
        }
    }

    return (
        <Card className="p-6 flex flex-col gap-4 hover:shadow-md transition-all border-l-4" style={{ borderLeftColor: 'var(--primary)' }}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1">
                    <div className="p-3 bg-gray-50 rounded-xl flex-shrink-0 border border-border mt-1">
                        <FolderPlus className="text-primary" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-text-primary text-lg">{project.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                             <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border", getDifficultyColor(project.difficulty))}>
                                {project.difficulty}
                            </span>
                             <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border", getImpactColor(project.atsImpact))}>
                                <Zap size={12} className="mr-1" /> ATS Impact: {project.atsImpact}
                            </span>
                        </div>
                    </div>
                </div>
                
                <button
                    onClick={() => toggleSaveProjectRecommendation(project.id)}
                    className={cn(
                        "p-2 rounded-lg border transition-all cursor-pointer flex-shrink-0",
                        isSaved 
                            ? "bg-blue-50 text-blue-600 border-blue-200" 
                            : "bg-white text-gray-400 border-border hover:bg-gray-50 hover:text-gray-600"
                    )}
                    title={isSaved ? "Saved" : "Save for later"}
                >
                    <Bookmark size={16} className={cn(isSaved && "fill-current")} />
                </button>
            </div>
            
            <p className="text-sm text-text-secondary leading-relaxed">
                {project.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                 <div className="bg-gray-50 p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                        <Target size={14} className="text-gray-500" />
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Matching Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {project.matchingSkills.map(skill => (
                            <span key={skill} className="px-2 py-0.5 bg-white border border-border rounded text-[11px] text-text-secondary">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen size={14} className="text-gray-500" />
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Skills Gained</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {project.skillsGained.map(skill => (
                            <span key={skill} className="px-2 py-0.5 bg-white border border-border rounded text-[11px] text-text-secondary">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                 <div className="flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Why this is recommended</p>
                    <p className="text-xs text-gray-600 font-medium">{project.reason}</p>
                 </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                 <Button 
                    variant={actionState === 'idle' ? 'primary' : 'outline'}
                    onClick={handleAddProject}
                    disabled={actionState !== 'idle'}
                    className={cn(
                        "w-full sm:w-auto text-sm transition-all flex-1 sm:flex-none",
                        actionState === 'success' && "bg-green-500 hover:bg-green-600 text-white border-transparent",
                        actionState === 'duplicate' && "bg-gray-100 text-gray-500 border-gray-200"
                    )}
                >
                    {actionState === 'idle' && (
                        <>
                            <Plus size={16} className="mr-2" />
                            Add Draft Project
                        </>
                    )}
                    {actionState === 'success' && (
                        <>
                            <CheckCircle2 size={16} className="mr-2" />
                            Added!
                        </>
                    )}
                    {actionState === 'duplicate' && 'Already Added'}
                </Button>
                <Button 
                    variant="secondary" 
                    className="w-full sm:w-auto flex-1 sm:flex-none"
                    onClick={() => onViewDetails(project)}
                >
                    View Details
                </Button>
            </div>
        </Card>
    );
}
