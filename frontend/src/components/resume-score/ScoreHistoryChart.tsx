'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ScoreHistoryChartProps {
    currentScore: number;
}

export function ScoreHistoryChart({ currentScore }: ScoreHistoryChartProps) {
    // Generate mock history ending with the real current score
    // In the future, this data will be fetched from a backend `/resume-score/history` endpoint
    const data = [
        { date: 'Initial', score: Math.max(0, currentScore - 25) },
        { date: 'Draft 2', score: Math.max(0, currentScore - 15) },
        { date: 'Draft 3', score: Math.max(0, currentScore - 5) },
        { date: 'Latest', score: currentScore },
    ];

    return (
        <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 11 }} 
                        dy={10}
                    />
                    <YAxis 
                        domain={[0, 100]} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        itemStyle={{ color: '#2563eb', fontWeight: 600 }}
                        formatter={(value) => [`${value} / 100`, 'Score']}
                        labelStyle={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: '#2563eb', stroke: '#eff6ff', strokeWidth: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
