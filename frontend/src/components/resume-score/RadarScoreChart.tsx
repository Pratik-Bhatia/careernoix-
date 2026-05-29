'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { ScoreCategory } from '@/lib/scoring';

interface RadarScoreChartProps {
    categories: {
        content: ScoreCategory;
        skills: ScoreCategory;
        format: ScoreCategory;
        keywords: ScoreCategory;
        achievements: ScoreCategory;
    };
}

export function RadarScoreChart({ categories }: RadarScoreChartProps) {
    // Transform categories object into array for Recharts
    const data = [
        { subject: 'Content', A: categories.content.score, fullMark: 100 },
        { subject: 'Skills', A: categories.skills.score, fullMark: 100 },
        { subject: 'Format', A: categories.format.score, fullMark: 100 },
        { subject: 'Keywords', A: categories.keywords.score, fullMark: 100 },
        { subject: 'Impact', A: categories.achievements.score, fullMark: 100 },
    ];

    return (
        <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={false} 
                        axisLine={false} 
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#2563eb', fontWeight: 600 }}
                        formatter={(value) => [`${value} / 100`, 'Score']}
                    />
                    <Radar
                        name="Your Resume"
                        dataKey="A"
                        stroke="#111111"
                        fill="#111111"
                        fillOpacity={0.1}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
