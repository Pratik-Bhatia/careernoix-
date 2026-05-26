import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowLeft, PenTool } from 'lucide-react';

interface FeaturePlaceholderProps {
    title?: string;
    description?: string;
    isBeta?: boolean;
    showResumeBuilderButton?: boolean;
    icon?: React.ReactNode;
}

export function FeaturePlaceholder({
    title = 'Feature Coming Soon',
    description = "We're building advanced AI-powered resume analysis and optimization tools.",
    isBeta = true,
    showResumeBuilderButton = true,
    icon = <Sparkles className="w-8 h-8 text-primary" />,
}: FeaturePlaceholderProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white border border-border p-8 md:p-12 rounded-3xl shadow-sm max-w-lg w-full flex flex-col items-center relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    {icon}
                </div>

                {isBeta && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary mb-4 border border-primary/20">
                        Beta
                    </span>
                )}

                <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight mb-3">
                    {title}
                </h2>

                <p className="text-text-secondary text-base leading-relaxed mb-8 max-w-sm">
                    {description}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {showResumeBuilderButton ? (
                        <Link href="/resume-builder/personal-info" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto gap-2">
                                <PenTool size={18} />
                                Continue Building Resume
                            </Button>
                        </Link>
                    ) : null}
                    
                    <Link href="/dashboard" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto gap-2">
                            <ArrowLeft size={18} />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
