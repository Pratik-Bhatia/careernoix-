'use client';

import React, { useState } from 'react';
import { AISuggestion } from '@/lib/ai-suggestions';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useResumeStore } from '@/store/useResumeStore';
import { 
    FolderPlus, 
    Lightbulb, 
    CheckCircle2, 
    Plus,
    FileText,
    TrendingUp,
    Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuggestionCardProps {
    suggestion: AISuggestion;
}

export function SuggestionCard({ suggestion }: SuggestionCardProps) {
    const { addDraftProject, addDraftSkill } = useResumeStore();
    const [actionState, setActionState] = useState<'idle' | 'success' | 'duplicate'>('idle');

    const handleAction = () => {
        if (!suggestion.actionType || !suggestion.actionData) return;

        let success = false;
        
        if (suggestion.actionType === 'ADD_PROJECT') {
            success = addDraftProject(suggestion.actionData);
        } else if (suggestion.actionType === 'ADD_SKILL') {
            success = addDraftSkill(suggestion.actionData as string);
        }

        setActionState(success ? 'success' : 'duplicate');
        
        // Reset state after a few seconds
        setTimeout(() => {
            setActionState('idle');
        }, 3000);
    };

    const getIcon = () => {
        switch (suggestion.category) {
            case 'Projects': return <FolderPlus className="text-blue-500" size={20} />;
            case 'Skills': return <Lightbulb className="text-yellow-500" size={20} />;
            case 'Content': return <FileText className="text-purple-500" size={20} />;
            case 'Keywords': return <Search className="text-green-500" size={20} />;
            default: return <TrendingUp className="text-primary" size={20} />;
        }
    };

    return (
        <Card className="p-6 flex flex-col md:flex-row gap-5 items-start hover:shadow-md transition-shadow">
            <div className="p-2.5 bg-surface-secondary rounded-xl flex-shrink-0 border border-border">
                {getIcon()}
            </div>
            
            <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-text-primary text-base">{suggestion.title}</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-200 whitespace-nowrap">
                        {suggestion.impact}
                    </span>
                </div>
                
                <p className="text-sm text-text-secondary leading-relaxed">
                    {suggestion.description}
                </p>
                
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Reason:</span>
                    <span className="text-xs text-gray-600 font-medium">{suggestion.reason}</span>
                </div>
            </div>

            {suggestion.actionType && (
                <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0 flex items-center">
                    <Button 
                        variant={actionState === 'idle' ? 'outline' : 'primary'}
                        onClick={handleAction}
                        disabled={actionState !== 'idle'}
                        className={cn(
                            "w-full md:w-auto text-sm transition-all",
                            actionState === 'success' && "bg-green-500 hover:bg-green-600 text-white border-transparent",
                            actionState === 'duplicate' && "bg-gray-100 text-gray-500 border-gray-200"
                        )}
                    >
                        {actionState === 'idle' && (
                            <>
                                <Plus size={16} className="mr-2" />
                                {suggestion.actionType === 'ADD_PROJECT' ? 'Add to Projects' : 'Add Skill'}
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
                </div>
            )}
        </Card>
    );
}
