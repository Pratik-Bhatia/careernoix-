import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Briefcase, Bookmark } from 'lucide-react';

interface JobCardProps {
    title: string;
    company?: string;
    location?: string;
    type?: string;
    matchScore: number;
    skills?: string[];
    missingSkills?: string[];
}

export const JobCard: React.FC<JobCardProps> = ({
    title,
    company,
    location,
    type,
    matchScore,
    skills = [],
    missingSkills = [],
}) => {
    return (
        <Card className="p-6 flex flex-col gap-4 hover:-translate-y-1 transition-all duration-200 hover:shadow-card-hover group relative">
            <div className="absolute top-6 right-6 text-text-placeholder hover:text-primary cursor-pointer transition-colors">
                <Bookmark size={20} />
            </div>

            <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-border flex items-center justify-center text-xl font-bold text-gray-400 shrink-0">
                    {title.charAt(0)}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1 pr-4">{title}</h3>
                    {company && <p className="text-sm text-text-secondary">{company}</p>}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-1">
                {location && (
                    <div className="flex items-center gap-1 text-xs font-medium text-text-secondary bg-gray-100 px-2 py-1 rounded-md">
                        <MapPin size={12} /> {location}
                    </div>
                )}
                {type && (
                    <div className="flex items-center gap-1 text-xs font-medium text-text-secondary bg-gray-100 px-2 py-1 rounded-md">
                        <Briefcase size={12} /> {type}
                    </div>
                )}
            </div>

            {/* Skills tags */}
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {skills.slice(0, 5).map((skill, i) => (
                        <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                            {skill}
                        </span>
                    ))}
                    {missingSkills.slice(0, 3).map((skill, i) => (
                        <span key={`m-${i}`} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                            {skill}
                        </span>
                    ))}
                </div>
            )}

            <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-text-secondary/80 tracking-wider">Match</span>
                    <span className="text-lg font-bold text-success">{matchScore}%</span>
                </div>
                <Button size="sm" className="px-6 rounded-lg">View Details</Button>
            </div>
        </Card>
    );
};
