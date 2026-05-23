'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Plus, Trophy, Trash2, X } from 'lucide-react';

export default function AchievementsPage() {
    const router = useRouter();
    const { resumeData, setAchievements } = useResumeStore();
    const achievements = resumeData.achievements;
    const [inputValue, setInputValue] = useState('');

    const handleBack = () => {
        router.push('/resume-builder/certifications');
    };

    const handleNext = () => {
        router.push('/resume-builder/languages');
    };

    const addAchievement = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !achievements.includes(trimmed)) {
            setAchievements([...achievements, trimmed]);
        }
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addAchievement();
        }
    };

    const removeAchievement = (indexToRemove: number) => {
        setAchievements(achievements.filter((_, idx) => idx !== indexToRemove));
    };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6 space-y-6">
                <div className="border-b border-gray-100 pb-4">
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary">
                        <Trophy size={14} />
                        Section 8
                    </div>
                    <h2 className="text-xl font-bold text-text-primary">Achievements</h2>
                    <p className="text-sm text-text-secondary mt-1">
                        List awards, contest wins, open source contributions, or key benchmarks you hit.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                id="achievement-input"
                                placeholder="e.g. Won 1st place in HackFest 2024 out of 50+ competing teams"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <Button type="button" onClick={addAchievement} className="shrink-0 h-[46px] self-end gap-1">
                            <Plus size={16} />
                            Add
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-secondary block">
                            Your Achievements ({achievements.length})
                        </label>
                        {achievements.length === 0 ? (
                            <p className="text-xs text-text-placeholder">No achievements listed yet. Add one above.</p>
                        ) : (
                            <div className="space-y-2">
                                {achievements.map((ach, idx) => (
                                    <div key={idx} className="flex justify-between items-start gap-4 p-3 rounded-xl border border-border bg-surface hover:border-primary/20 transition-all">
                                        <p className="text-xs text-text-secondary leading-relaxed pt-0.5">{ach}</p>
                                        <button
                                            onClick={() => removeAchievement(idx)}
                                            className="p-1 text-text-placeholder hover:text-error hover:bg-error/5 rounded-lg transition-colors shrink-0"
                                            aria-label="Delete achievement"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-6">
                <Button type="button" variant="secondary" onClick={handleBack} className="gap-2">
                    <ArrowLeft size={16} />
                    Back
                </Button>
                <Button type="button" onClick={handleNext} className="gap-2">
                    Next
                    <ArrowRight size={16} />
                </Button>
            </div>
        </div>
    );
}
