'use client';

import React, { useState, useEffect } from 'react';
import { ProjectRecommendation } from '@/lib/ai-suggestions';
import { Button } from '@/components/ui/Button';
import { useResumeStore } from '@/store/useResumeStore';
import { 
    X, 
    FolderPlus, 
    CheckCircle2, 
    Plus,
    Target,
    BookOpen,
    Clock,
    TrendingUp,
    Code2,
    ListChecks,
    Bookmark
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectDetailsModalProps {
    project: ProjectRecommendation | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProjectDetailsModal({ project, isOpen, onClose }: ProjectDetailsModalProps) {
    const { addDraftProject } = useResumeStore();
    const [actionState, setActionState] = useState<'idle' | 'success' | 'duplicate'>('idle');

    // Reset action state when a new project is selected or modal is closed
    useEffect(() => {
        if (!isOpen) {
            setActionState('idle');
        }
    }, [isOpen, project]);

    if (!project || !isOpen) return null;

    const handleAddProject = () => {
        const success = addDraftProject(project.draftProject);
        setActionState(success ? 'success' : 'duplicate');
        
        // Reset state and close modal after a short delay
        setTimeout(() => {
            setActionState('idle');
            if (success) onClose();
        }, 2000);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-light/30 rounded-xl border border-primary/20">
                            <FolderPlus className="text-primary" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-text-primary">{project.title}</h2>
                            <p className="text-sm text-text-secondary">{project.roleAlignment}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    
                    {/* Top Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl border border-border bg-gray-50">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <Clock size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Est. Time</span>
                            </div>
                            <span className="font-semibold text-text-primary">{project.estimatedTime}</span>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-gray-50">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <Target size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Difficulty</span>
                            </div>
                            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border mt-0.5", getDifficultyColor(project.difficulty))}>
                                {project.difficulty}
                            </span>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-gray-50">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <TrendingUp size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">ATS Impact</span>
                            </div>
                            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border mt-0.5", getImpactColor(project.atsImpact))}>
                                {project.atsImpact}
                            </span>
                        </div>
                    </div>

                    {/* Overview & Recruiter Value */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Project Overview</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
                        </div>
                        
                        <div className="p-4 bg-primary-light/20 rounded-xl border border-primary/20 flex gap-3">
                            <TrendingUp className="text-primary flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="text-sm font-bold text-primary-dark mb-1">How This Improves Your Resume</h4>
                                <p className="text-sm text-primary-dark/80 leading-relaxed">{project.recruiterValue}</p>
                            </div>
                        </div>
                    </div>

                    {/* Skills & Tech Stack */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <BookOpen size={16} className="text-gray-500" /> Skills Demonstrated
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.matchingSkills.map(skill => (
                                    <span key={skill} className="px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-md text-xs font-medium text-gray-700">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Code2 size={16} className="text-gray-500" /> Suggested Tech Stack
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.suggestedTechStack.map(tech => (
                                    <span key={tech} className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-md text-xs font-medium text-blue-700">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Suggested Resume Bullets */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <ListChecks size={16} className="text-gray-500" /> Suggested Resume Bullet Points
                        </h3>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 font-serif">
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-800">
                                {project.suggestedBullets.map((bullet, idx) => (
                                    <li key={idx} className="pl-1 leading-relaxed">{bullet}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-border bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Button variant="ghost" className="text-gray-500 hover:text-gray-900 w-full sm:w-auto order-3 sm:order-1" onClick={onClose}>
                        Close
                    </Button>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
                        <Button variant="outline" className="w-full sm:w-auto gap-2">
                            <Bookmark size={16} /> Save For Later
                        </Button>
                        <Button 
                            variant={actionState === 'idle' ? 'primary' : 'outline'}
                            onClick={handleAddProject}
                            disabled={actionState !== 'idle'}
                            className={cn(
                                "w-full sm:w-auto transition-all",
                                actionState === 'success' && "bg-green-500 hover:bg-green-600 text-white border-transparent",
                                actionState === 'duplicate' && "bg-gray-100 text-gray-500 border-gray-200"
                            )}
                        >
                            {actionState === 'idle' && (
                                <>
                                    <Plus size={16} className="mr-2" /> Add Draft Project
                                </>
                            )}
                            {actionState === 'success' && (
                                <>
                                    <CheckCircle2 size={16} className="mr-2" /> Added!
                                </>
                            )}
                            {actionState === 'duplicate' && 'Already Added'}
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
