import React from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    loading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, trend, trendUp, loading }) => {
    return (
        <Card className="p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-200">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <div className="min-w-0">
                <p className="text-sm font-medium text-text-secondary">{label}</p>
                {loading ? (
                    <div className="flex items-baseline gap-2 mt-1">
                        <div className="h-7 w-16 bg-gray-200 rounded-md animate-pulse" />
                    </div>
                ) : (
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
                        {trend && (
                            <span className={cn("text-xs font-medium", trendUp ? "text-success" : "text-error")}>
                                {trend}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};
