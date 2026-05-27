'use client';

import React, { useState } from 'react';
import { useResumeStore, ResumeData } from '@/store/useResumeStore';
import { PreviewPanel } from '@/components/resume-builder/PreviewPanel';
import { ResumePreview } from '@/components/resume-builder/ResumePreview';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CircularScore } from '@/components/resume-score/CircularScore';
import { 
    optimizeResume, 
    OptimizationResult 
} from '@/lib/ats-optimizer';
import { 
    UploadCloud, 
    FileText, 
    Wand2, 
    CheckCircle2,
    XCircle,
    AlertCircle,
    Download,
    Check,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AIResumeOptimizerPage() {
    const { resumeData, hydrateFromBackend } = useResumeStore();
    
    // Inputs
    const [jdText, setJdText] = useState('');
    
    // State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<OptimizationResult | null>(null);
    const [previewTab, setPreviewTab] = useState<'original' | 'optimized'>('optimized');
    const [hasApplied, setHasApplied] = useState(false);

    const handleAnalyze = () => {
        if (!jdText.trim()) return;
        setIsAnalyzing(true);
        setHasApplied(false);
        setPreviewTab('optimized');
        
        // Simulate a slight thinking delay for UX
        setTimeout(() => {
            const analysisResult = optimizeResume(resumeData, jdText);
            setResult(analysisResult);
            setIsAnalyzing(false);
        }, 1200);
    };

    const handleApplyOptimization = () => {
        if (!result) return;
        // This overwrites global state with the enhanced resume data
        hydrateFromBackend(result.optimizedResume);
        setHasApplied(true);
    };

    return (
        <div className="pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold text-text-primary tracking-tight">AI Resume Optimizer</h1>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                        V1
                    </span>
                </div>
                <p className="text-text-secondary">Compare your resume against a target job description to identify missing keywords and boost ATS compatibility.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
                
                {/* ─── LEFT PANEL: Input (3 cols) ─── */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Active Resume Indicator */}
                    <Card className="p-4 border-border bg-gray-50/50">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Resume</span>
                            <span className="flex items-center text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                                <Check size={10} className="mr-1" /> Synced
                            </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white border border-border rounded-lg shadow-sm">
                            <div className="p-2 bg-blue-50 text-primary rounded border border-blue-100">
                                <FileText size={20} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold text-text-primary truncate">{resumeData.personalInfo.fullName || 'My Resume'}</p>
                                <p className="text-xs text-text-secondary truncate">{resumeData.personalInfo.jobTitle || 'Profile Data'}</p>
                            </div>
                        </div>
                        <Link href="/resume-builder/personal-info" className="text-xs text-primary mt-3 block text-center hover:underline">
                            Edit Profile Data
                        </Link>
                    </Card>

                    {/* JD Input */}
                    <Card className="p-4 border-border shadow-sm flex flex-col h-[400px]">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Job Description</label>
                            <span className={cn("text-[10px]", jdText.length > 3000 ? "text-red-500" : "text-gray-400")}>
                                {jdText.length} / 3000
                            </span>
                        </div>
                        <textarea
                            className="flex-1 w-full p-3 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none custom-scrollbar bg-gray-50/50"
                            placeholder="Paste the target job description here to extract keywords..."
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                        />
                    </Card>

                    <Button 
                        onClick={handleAnalyze} 
                        disabled={jdText.trim().length < 50 || isAnalyzing}
                        className="w-full gap-2 shadow-md"
                    >
                        {isAnalyzing ? (
                            <><Wand2 size={16} className="animate-spin" /> Analyzing...</>
                        ) : (
                            <><Wand2 size={16} /> Analyze & Optimize</>
                        )}
                    </Button>
                </div>

                {/* ─── CENTER PANEL: Analysis Results (4 cols) ─── */}
                <div className="lg:col-span-4 space-y-6">
                    {!result && !isAnalyzing ? (
                        <Card className="p-10 flex flex-col items-center justify-center text-center border-dashed bg-gray-50/50 h-[600px]">
                            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                                <Wand2 className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-2">Ready to Optimize</h3>
                            <p className="text-sm text-text-secondary max-w-xs">
                                Paste a job description and click analyze to see how well your resume matches and what keywords you're missing.
                            </p>
                        </Card>
                    ) : isAnalyzing ? (
                        <Card className="p-10 flex flex-col items-center justify-center text-center border-border h-[600px]">
                            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                            <h3 className="text-lg font-bold text-text-primary mb-1">Scanning Keywords...</h3>
                            <p className="text-sm text-text-secondary">Comparing your experience against the JD.</p>
                        </Card>
                    ) : result ? (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            {/* Score Card */}
                            <Card className="p-6 border-border shadow-sm flex items-center gap-6">
                                <CircularScore score={result.matchScore} size={90} strokeWidth={8} />
                                <div>
                                    <h3 className="text-xl font-bold text-text-primary mb-1">{result.matchQuality}</h3>
                                    <p className="text-sm text-text-secondary">
                                        Your resume matches <strong className="text-gray-900">{result.matchedSkills.length}</strong> core keywords from the job description.
                                    </p>
                                </div>
                            </Card>

                            {/* Optimization Impact */}
                            {result.improvements.scoreBoost > 0 && (
                                <Card className="p-5 border-green-200 bg-green-50/50">
                                    <h4 className="text-xs font-bold text-green-800 uppercase tracking-wider mb-3">Optimization Impact</h4>
                                    <div className="flex gap-4">
                                        <div className="bg-white px-3 py-2 rounded border border-green-100 flex-1 text-center">
                                            <span className="block text-2xl font-bold text-green-600">+{result.improvements.scoreBoost}</span>
                                            <span className="text-[10px] text-green-700 font-medium">Score Boost</span>
                                        </div>
                                        <div className="bg-white px-3 py-2 rounded border border-green-100 flex-1 text-center">
                                            <span className="block text-2xl font-bold text-green-600">+{result.improvements.addedKeywords}</span>
                                            <span className="text-[10px] text-green-700 font-medium">Keywords Added</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        {result.improvements.explanations.map((exp, i) => (
                                            <p key={i} className="text-xs text-green-800 flex items-start gap-1.5">
                                                <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5 text-green-500" />
                                                <span className="leading-relaxed">{exp}</span>
                                            </p>
                                        ))}
                                    </div>
                                    {!hasApplied && (
                                        <Button 
                                            onClick={handleApplyOptimization}
                                            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white shadow-sm"
                                        >
                                            Apply Optimization to Resume
                                        </Button>
                                    )}
                                    {hasApplied && (
                                        <div className="w-full mt-4 bg-green-100 text-green-800 text-sm font-medium text-center py-2 rounded-lg border border-green-200">
                                            ✓ Applied Successfully
                                        </div>
                                    )}
                                </Card>
                            )}

                            {/* Missing Keywords by Group */}
                            <Card className="p-5 border-border shadow-sm">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Missing Keywords</h4>
                                {result.missingKeywordGroups.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">No major missing keywords detected.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {result.missingKeywordGroups.map(group => (
                                            <div key={group.category}>
                                                <h5 className="text-[11px] font-semibold text-gray-700 mb-2">{group.category}</h5>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {group.keywords.map(kw => (
                                                        <span key={kw} className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-xs">
                                                            {kw}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                            
                            {/* Strengths */}
                            <Card className="p-5 border-border shadow-sm">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Resume Strengths</h4>
                                <ul className="space-y-2">
                                    {result.strengths.map((str, i) => (
                                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                            <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                            {str}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>
                    ) : null}
                </div>

                {/* ─── RIGHT PANEL: Live Preview (5 cols) ─── */}
                <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
                    <div className="flex items-center justify-between">
                        <div className="flex p-1 bg-gray-100 rounded-lg border border-border">
                            <button
                                onClick={() => setPreviewTab('original')}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                    previewTab === 'original' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                Original
                            </button>
                            <button
                                onClick={() => setPreviewTab('optimized')}
                                disabled={!result}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5",
                                    previewTab === 'optimized' ? "bg-purple-100 text-purple-800 shadow-sm border border-purple-200" : "text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                )}
                            >
                                <Wand2 size={12} /> Optimized {result && !hasApplied && <span className="w-2 h-2 bg-purple-500 rounded-full ml-1" />}
                            </button>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2 text-xs">
                            <Download size={14} /> Download PDF
                        </Button>
                    </div>

                    <Card className="overflow-hidden border-border bg-white shadow-sm">
                        <PreviewPanel className="max-h-[750px] overflow-y-auto">
                            <ResumePreview 
                                dataOverride={
                                    previewTab === 'optimized' && result 
                                        ? result.optimizedResume 
                                        : resumeData
                                }
                                highlightMode={previewTab === 'optimized' && !hasApplied}
                            />
                        </PreviewPanel>
                    </Card>
                </div>

            </div>
        </div>
    );
}
