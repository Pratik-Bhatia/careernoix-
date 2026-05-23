'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Wrench, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const popularSkills = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Python', 
    'FastAPI', 'Node.js', 'SQL', 'PostgreSQL', 'Docker', 
    'Git', 'AWS', 'Tailwind CSS', 'Project Management', 'Data Analysis'
];

export default function SkillsPage() {
    const router = useRouter();
    const { resumeData, setSkills } = useResumeStore();
    const skills = resumeData.skills;
    const [inputValue, setInputValue] = useState('');

    const handleBack = () => {
        router.push('/resume-builder/education');
    };

    const handleNext = () => {
        router.push('/resume-builder/projects');
    };

    const addSkill = (skill: string) => {
        const trimmed = skill.trim();
        if (trimmed && !skills.includes(trimmed)) {
            setSkills([...skills, trimmed]);
        }
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill(inputValue);
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter((s) => s !== skillToRemove));
    };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6 space-y-6">
                <div className="border-b border-gray-100 pb-4">
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary">
                        <Wrench size={14} />
                        Section 5
                    </div>
                    <h2 className="text-xl font-bold text-text-primary">Skills</h2>
                    <p className="text-sm text-text-secondary mt-1">
                        Add key professional skills, libraries, and frameworks you are proficient in.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                id="skill-input"
                                placeholder="e.g. C++, Kubernetes, Machine Learning"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <Button type="button" onClick={() => addSkill(inputValue)} className="shrink-0 h-[46px] self-end gap-1">
                            <Plus size={16} />
                            Add
                        </Button>
                    </div>

                    {/* Active skill tags */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-secondary block">
                            Your Skills ({skills.length})
                        </label>
                        {skills.length === 0 ? (
                            <p className="text-xs text-text-placeholder">No skills added yet. Type above or choose from recommendations.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2 p-3 bg-gray-50/50 border border-border rounded-xl">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="inline-flex items-center gap-1 bg-white border border-border text-text-secondary px-3 py-1 rounded-xl text-xs font-medium hover:border-primary/20 hover:text-primary transition-all group"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="text-text-placeholder hover:text-error transition-colors p-0.5 rounded-md"
                                            aria-label={`Remove ${skill}`}
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Popular skills suggestions */}
                    <div className="space-y-2 pt-2">
                        <label className="text-xs font-bold text-text-placeholder uppercase tracking-wider block">
                            Recommended / Quick Adds
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {popularSkills.map((skill) => {
                                const isAdded = skills.includes(skill);
                                return (
                                    <button
                                        key={skill}
                                        type="button"
                                        disabled={isAdded}
                                        onClick={() => addSkill(skill)}
                                        className={cn(
                                            "px-2.5 py-1.5 text-xs rounded-lg border transition-all cursor-pointer",
                                            isAdded
                                                ? "bg-gray-50 border-gray-200 text-text-placeholder cursor-not-allowed"
                                                : "bg-surface border-border text-text-secondary hover:border-primary/30 hover:text-primary hover:bg-primary-light/30"
                                        )}
                                    >
                                        {skill}
                                    </button>
                                );
                            })}
                        </div>
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
