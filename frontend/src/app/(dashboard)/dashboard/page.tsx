'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { JobCard } from '@/components/dashboard/JobCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Briefcase, Star, CheckCircle, AlertTriangle, Upload } from 'lucide-react';
import { fetchDashboardData } from '@/lib/api';
import type { DashboardData } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useResumeStore } from '@/store/useResumeStore';
import { getCareerPathSuggestions } from '@/lib/career-guidance';
import { Card } from '@/components/ui/Card';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
    const { token, user, setDashboardData, dashboardData } = useStore();
    const { resumeData, resetResume } = useResumeStore();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const careerSuggestions = getCareerPathSuggestions(resumeData);

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }

        const loadDashboard = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchDashboardData();
                console.log('[Dashboard] fetchDashboardData result:', JSON.stringify(data, null, 2));
                setDashboardData(data);
            } catch (err: any) {
                console.error('Failed to fetch dashboard data', err);
                // 401 is handled by the interceptor (auto-redirect to /login)
                // Only show error for non-auth failures
                if (err.response?.status !== 401) {
                    setError(err.response?.data?.detail || 'Failed to load dashboard data.');
                }
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [token, router, setDashboardData]);

    const matches = dashboardData?.matches ?? [];
    const hasMatches = matches.length > 0;

    // Derive stats from real data
    const bestMatch = hasMatches
        ? matches.reduce((best, m) => (m.score > best.score ? m : best), matches[0])
        : null;

    const totalMatchedSkills = bestMatch?.details?.matched_skills?.length ?? 0;
    const totalMissingSkills = bestMatch?.details?.missing_skills?.length ?? 0;

    const stats = [
        {
            label: 'Total Job Matches',
            value: hasMatches ? matches.length.toString() : '0',
            icon: Briefcase,
            trend: hasMatches ? `${matches.length} role${matches.length > 1 ? 's' : ''} analyzed` : undefined,
            trendUp: true,
        },
        {
            label: 'Best Match Score',
            value: bestMatch ? `${bestMatch.score}%` : '—',
            icon: Star,
            trend: bestMatch ? `${bestMatch.job_role?.title || 'Top role'}` : undefined,
            trendUp: true,
        },
        {
            label: 'Skills Matched',
            value: hasMatches ? totalMatchedSkills.toString() : '—',
            icon: CheckCircle,
            trend: hasMatches ? 'from best match' : undefined,
            trendUp: true,
        },
        {
            label: 'Skills to Improve',
            value: hasMatches ? totalMissingSkills.toString() : '—',
            icon: AlertTriangle,
            trend: hasMatches ? 'gap analysis' : undefined,
            trendUp: false,
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        Welcome back, {user?.full_name?.split(' ')[0] || 'Candidate'}!
                    </h1>
                    <p className="text-text-secondary text-lg">
                        {hasMatches
                            ? "Here's your latest job activity and recommendations."
                            : "Upload your resume to get started with job matching."}
                    </p>
                </div>
                <div className="px-4 py-2 bg-white border border-border rounded-xl text-sm font-medium text-text-secondary shadow-sm">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm">
                    {error}
                </div>
            )}

            {/* Metrics Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <StatsCard key={i} {...stat} loading={loading} />
                ))}
            </section>

            {/* Content Section — Three States */}
            {loading ? (
                /* State C: Loading Skeletons */
                <section className="space-y-6">
                    <div className="h-6 w-48 bg-gray-200 rounded-md animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-border p-6 space-y-4 animate-pulse">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gray-200" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                                        <div className="h-4 bg-gray-100 rounded w-1/2" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-6 bg-gray-100 rounded-md w-20" />
                                    <div className="h-6 bg-gray-100 rounded-md w-16" />
                                </div>
                                <div className="border-t border-border/50 pt-4 flex justify-between items-center">
                                    <div className="h-8 bg-gray-200 rounded w-14" />
                                    <div className="h-9 bg-gray-200 rounded-lg w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ) : !hasMatches ? (
                /* State A: No Resume / No Matches — Onboarding CTA */
                <section className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-border">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                        <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                        No matches found yet
                    </h3>
                    <p className="text-text-secondary mb-6 max-w-md mx-auto text-sm leading-relaxed">
                        Upload your resume or build one from scratch to get started with job matching, score calculations, and smart optimization.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/upload">
                            <Button size="lg" className="px-8 w-full sm:w-auto cursor-pointer">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Resume
                            </Button>
                        </Link>
                        <Link href="/resume-builder/personal-info" onClick={() => resetResume()}>
                            <Button size="lg" variant="outline" className="px-8 w-full sm:w-auto bg-white cursor-pointer border-primary/20 text-primary hover:bg-primary/5">
                                Build Resume From Scratch
                            </Button>
                        </Link>
                    </div>
                </section>
            ) : (
                /* State B: Data Ready — Real Matches */
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Your Job Matches</h2>
                        <span className="text-sm text-text-secondary font-medium">
                            {matches.length} match{matches.length !== 1 ? 'es' : ''} found
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.map((match) => (
                            <JobCard
                                key={match.id}
                                title={match.job_role?.title || `Job Role #${match.job_role_id}`}
                                company={match.job_role?.description || undefined}
                                matchScore={match.score}
                                skills={match.details?.matched_skills}
                                missingSkills={match.details?.missing_skills}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Career Paths You Can Pursue */}
            {!loading && (
                <section className="space-y-6 pt-6 border-t border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Career Paths You Can Pursue</h2>
                            <p className="text-sm text-text-secondary mt-0.5">Personalized recommendations based on your resume profile and skills.</p>
                        </div>
                        <Link href="/career-guidance" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1 group">
                            Explore Career Guidance
                            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {careerSuggestions.map((path, idx) => (
                            <Card key={idx} className="p-5 flex flex-col justify-between hover:shadow-md transition-all border-t-4 border-t-primary/70">
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <h3 className="font-bold text-text-primary text-base">{path.title}</h3>
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                            path.type === 'Core Path' 
                                                ? "bg-green-50 text-green-700 border border-green-100"
                                                : path.type === 'Eligible Path'
                                                    ? "bg-blue-50 text-blue-700 border border-blue-100"
                                                    : "bg-purple-50 text-purple-700 border border-purple-100"
                                        )}>
                                            {path.type}
                                        </span>
                                    </div>
                                    <p className="text-xs text-text-secondary mb-4 leading-relaxed">{path.reason}</p>
                                    
                                    <div className="flex items-center justify-between text-xs mb-3 bg-gray-50 p-2 rounded-lg border border-border/50">
                                        <span className="text-text-placeholder">Est. Salary:</span>
                                        <span className="font-bold text-text-primary">{path.averageSalary}</span>
                                    </div>
                                    
                                    {path.matchingSkills.length > 0 && (
                                        <div className="mb-3">
                                            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Your Matching Skills</span>
                                            <div className="flex flex-wrap gap-1">
                                                {path.matchingSkills.slice(0, 4).map(skill => (
                                                    <span key={skill} className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-[10px] font-medium">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="pt-4 border-t border-border/50 mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-12 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={cn(
                                                    "h-full rounded-full",
                                                    path.matchPercentage >= 70 ? "bg-green-500" : path.matchPercentage >= 40 ? "bg-blue-500" : "bg-purple-500"
                                                )}
                                                style={{ width: `${path.matchPercentage}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-text-secondary">{path.matchPercentage}% match</span>
                                    </div>
                                    
                                    <Link href={`/career-guidance?role=${encodeURIComponent(path.title)}`}>
                                        <Button size="sm" variant="ghost" className="text-xs font-semibold gap-1 text-primary hover:text-primary-hover hover:bg-primary-light">
                                            Roadmap
                                            <ChevronRight size={12} />
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
