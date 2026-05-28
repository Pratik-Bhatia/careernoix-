import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ImprovementActionButtonProps {
    title: string;
}

export function ImprovementActionButton({ title }: ImprovementActionButtonProps) {
    const titleLower = title.toLowerCase();
    
    let href = '';
    let label = '';
    
    if (titleLower.includes('skill')) {
        href = '/resume-builder/skills';
        label = 'Improve Skills';
    } else if (titleLower.includes('summary')) {
        href = '/resume-builder/summary';
        label = 'Improve Summary';
    } else if (titleLower.includes('experience') || titleLower.includes('impact') || titleLower.includes('quantify') || titleLower.includes('work')) {
        href = '/resume-builder/experience';
        label = 'Improve Experience';
    } else if (titleLower.includes('link') || titleLower.includes('personal') || titleLower.includes('contact')) {
        href = '/resume-builder/personal-info';
        label = 'Improve Info';
    } else if (titleLower.includes('tailor') || titleLower.includes('optimizer') || titleLower.includes('role')) {
        href = '/analyze-improve/ai-resume-optimizer';
        label = 'Tailor Resume';
    }
    
    if (!href) return null;
    
    return (
        <Link href={href} passHref>
            <Button 
                size="sm" 
                variant="outline" 
                className="mt-3 text-xs font-semibold gap-1 group/btn border-primary/30 text-primary hover:bg-primary/5 hover:border-primary cursor-pointer"
            >
                {label}
                <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
        </Link>
    );
}
