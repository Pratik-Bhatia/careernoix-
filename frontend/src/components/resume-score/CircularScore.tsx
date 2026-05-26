import React from 'react';
import { cn } from '@/lib/utils';

export interface CircularScoreProps {
    score: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
    label?: string;
}

export function CircularScore({
    score,
    size = 120,
    strokeWidth = 10,
    className,
    label
}: CircularScoreProps) {
    const safeScore = Math.max(0, Math.min(100, score));
    
    // SVG calculations
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (safeScore / 100) * circumference;

    // Determine color based on score (matching ATS conventions)
    const getColor = (s: number) => {
        if (s >= 80) return 'text-green-500'; // Excellent
        if (s >= 60) return 'text-yellow-500'; // Good/Average
        return 'text-red-500'; // Needs Improvement
    };

    return (
        <div className={cn("relative flex flex-col items-center justify-center", className)} style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                className="transform -rotate-90 transition-all duration-500 ease-in-out"
            >
                {/* Background Track */}
                <circle
                    className="text-gray-100"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                
                {/* Progress Circle */}
                <circle
                    className={cn("transition-all duration-1000 ease-out", getColor(safeScore))}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            
            {/* Center Content */}
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-text-primary tracking-tighter">
                    {safeScore}
                </span>
                {label && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-text-secondary mt-1">
                        {label}
                    </span>
                )}
            </div>
        </div>
    );
}
