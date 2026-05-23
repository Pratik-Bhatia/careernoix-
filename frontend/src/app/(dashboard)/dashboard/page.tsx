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

export default function Dashboard() {
    const { token, user, setDashboardData, dashboardData } = useStore();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                    <p className="text-text-secondary mb-6 max-w-md mx-auto">
                        Upload your resume and run a job match analysis to see your personalized dashboard with real scores and recommendations.
                    </p>
                    <Link href="/upload">
                        <Button size="lg" className="px-8">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Resume
                        </Button>
                    </Link>
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
        </div>
    );
}
