'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getCareerGuidance, CareerGuide } from '@/lib/career-guidance';
import { useResumeStore } from '@/store/useResumeStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
    Compass, 
    Search, 
    TrendingUp, 
    Award, 
    Code2, 
    BookOpen, 
    CheckCircle2, 
    ListChecks, 
    ChevronRight,
    Map,
    HelpCircle,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FeaturePlaceholder } from '@/components/ui/FeaturePlaceholder';

function CareerGuidanceInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const roleParam = searchParams.get('role');
    const { getOverallProgress, resumeData } = useResumeStore();
    const progress = getOverallProgress();

    const [query, setQuery] = useState('');
    const [guide, setGuide] = useState<CareerGuide | null>(null);
    const [error, setError] = useState<string | null>(null);

    const popularQueries = [
        'Data Analyst',
        'Frontend Developer',
        'Backend Developer',
        'Machine Learning Engineer',
        'Computer Science'
    ];

    useEffect(() => {
        // If the user hasn't started their resume at all, do not auto-generate guidance
        if (progress === 0 && resumeData.experience.length === 0 && !roleParam) {
            return;
        }

        // Default to 'Data Analyst' or job title if no param is provided, to ensure a rich immediate display
        const defaultRole = resumeData.personalInfo?.jobTitle || 'Data Analyst';
        const target = roleParam || defaultRole;
        try {
            setError(null);
            setQuery(target);
            setGuide(getCareerGuidance(target));
        } catch (err) {
            console.error(err);
            setError("Unable to generate guidance.");
        }
    }, [roleParam, progress, resumeData]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            try {
                setError(null);
                setGuide(getCareerGuidance(query));
                // Update URL search param without reloading, to support shareable links
                router.push(`/career-guidance?role=${encodeURIComponent(query.trim())}`, { scroll: false });
            } catch (err) {
                console.error(err);
                setError("Unable to generate guidance.");
            }
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        try {
            setError(null);
            setQuery(suggestion);
            setGuide(getCareerGuidance(suggestion));
            router.push(`/career-guidance?role=${encodeURIComponent(suggestion)}`, { scroll: false });
        } catch (err) {
            console.error(err);
            setError("Unable to generate guidance.");
        }
    };

    return (
        <div className="pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
                        <Compass className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary tracking-tight">Career Guidance</h1>
                </div>
                <p className="text-text-secondary">Discover career opportunities, salary insights, skills roadmaps, and certifications based on your profile or queries.</p>
            </div>

            {error ? (
                <div className="pt-10">
                    <FeaturePlaceholder 
                        title="Guidance Error"
                        description={error}
                        icon={<AlertCircle className="w-8 h-8 text-red-500" />}
                        isBeta={false}
                        showResumeBuilderButton={false}
                    />
                </div>
            ) : progress === 0 && resumeData.experience.length === 0 && !guide && !query ? (
                <div className="pt-10">
                    <FeaturePlaceholder 
                        title="Complete Your Profile"
                        description="Complete your profile or start building your resume to receive personalized career guidance."
                        icon={<Compass className="w-8 h-8 text-primary" />}
                        isBeta={false}
                        showResumeBuilderButton={true}
                    />
                </div>
            ) : (
                <>
                    {/* Search and Suggestion Section */}
            <Card className="p-6 mb-8 bg-gradient-to-br from-white to-gray-50/50 shadow-sm border-border">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Enter a qualification (e.g., Computer Science) or target job role..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-sm border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                        />
                    </div>
                    <Button type="submit" size="lg" className="px-8 cursor-pointer">
                        Generate Guide
                    </Button>
                </form>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">Popular Searches:</span>
                    {popularQueries.map((item) => (
                        <button
                            key={item}
                            onClick={() => handleSuggestionClick(item)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer",
                                query.toLowerCase() === item.toLowerCase()
                                    ? "bg-primary text-white border-primary shadow-sm"
                                    : "bg-white text-text-secondary border-border hover:bg-gray-50 hover:text-text-primary"
                            )}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Guidance Content */}
            {guide ? (
                <div className="space-y-8">
                    
                    {/* Hero Info Card */}
                    <Card className="p-6 md:p-8 border-l-4 border-l-primary/90 bg-white">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="space-y-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-light text-primary border border-primary/20">
                                    Career Guide
                                </span>
                                <h2 className="text-2xl font-bold text-text-primary">{guide.title}</h2>
                                <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
                                    {guide.description}
                                </p>
                            </div>
                            
                            <div className="bg-gray-50 p-5 rounded-2xl border border-border text-center md:text-right min-w-[200px] flex-shrink-0">
                                <span className="text-xs text-text-placeholder uppercase font-bold tracking-wider block mb-1">Average Salary</span>
                                <span className="text-xl font-extrabold text-green-600 tracking-tight">{guide.salaryEstimate}</span>
                                <span className="text-[10px] text-text-secondary block mt-1">Estimates for USA/Global market</span>
                            </div>
                        </div>
                    </Card>

                    {/* Breakdown Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Left Column (7 cols) - Opportunities, Certs, Tools, Projects */}
                        <div className="lg:col-span-7 space-y-6">
                            
                            {/* Opportunities */}
                            <Card className="p-6">
                                <h3 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
                                    <TrendingUp size={18} className="text-primary" />
                                    Career Opportunities & Job Roles
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {guide.careerOpportunities.map((opp) => (
                                        <span key={opp} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-semibold">
                                            {opp}
                                        </span>
                                    ))}
                                </div>
                            </Card>

                            {/* Recommended Certifications */}
                            <Card className="p-6">
                                <h3 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
                                    <Award size={18} className="text-primary" />
                                    Recommended Industry Certifications
                                </h3>
                                <ul className="space-y-2.5">
                                    {guide.recommendedCertifications.map((cert) => (
                                        <li key={cert} className="text-xs font-medium text-gray-700 flex items-center gap-2">
                                            <CheckCircle2 size={14} className="text-green-500" />
                                            {cert}
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            {/* Suggested Tools & Software */}
                            <Card className="p-6">
                                <h3 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
                                    <Code2 size={18} className="text-primary" />
                                    Standard Tools & Software
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {guide.suggestedTools.map((tool) => (
                                        <span key={tool} className="px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-xs font-semibold">
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            </Card>

                            {/* Suggested Projects */}
                            <Card className="p-6">
                                <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                                    <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                                        <ListChecks size={18} className="text-primary" />
                                        Suggested Portfolio Projects
                                    </h3>
                                    <Link href="/analyze-improve/ai-suggestions">
                                        <Button variant="ghost" size="sm" className="text-xs gap-1 text-primary hover:text-primary-hover hover:bg-primary-light">
                                            Build Project Recommendations
                                            <ChevronRight size={12} />
                                        </Button>
                                    </Link>
                                </div>
                                <div className="space-y-3">
                                    {guide.suggestedProjects.map((proj, idx) => (
                                        <div key={idx} className="p-3 bg-gray-50 border border-border/80 rounded-xl text-xs font-semibold text-text-primary flex items-center justify-between">
                                            <span>{proj}</span>
                                            <span className="text-[10px] text-primary bg-primary-light px-2 py-0.5 rounded font-bold uppercase border border-primary/10">Project Pool</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                        </div>

                        {/* Right Column (5 cols) - Skills Roadmap, Learning Path, Progression */}
                        <div className="lg:col-span-5 space-y-6">
                            
                            {/* Skills Roadmap */}
                            <Card className="p-6">
                                <h3 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
                                    <Map size={18} className="text-primary" />
                                    Skills Roadmap & Focus Areas
                                </h3>
                                <div className="space-y-3">
                                    {guide.skillsRoadmap.map((skill, idx) => (
                                        <div key={idx} className="flex gap-3">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                                                {idx + 1}
                                            </div>
                                            <p className="text-xs font-medium text-text-secondary leading-relaxed">
                                                {skill}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Learning Path Step-by-Step */}
                            <Card className="p-6">
                                <h3 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
                                    <BookOpen size={18} className="text-primary" />
                                    Step-by-Step Learning Path
                                </h3>
                                <div className="space-y-5 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
                                    {guide.learningPath.map((step, idx) => (
                                        <div key={idx} className="relative space-y-1">
                                            <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white" />
                                            <h4 className="text-xs font-bold text-text-primary">{step.step}</h4>
                                            <p className="text-xs text-text-secondary leading-relaxed">{step.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Career Progression Guidance */}
                            <Card className="p-6 bg-gradient-to-br from-primary-light/10 to-primary-light/30 border border-primary/20">
                                <h3 className="text-base font-bold text-primary-dark mb-3 flex items-center gap-2">
                                    <TrendingUp size={18} className="text-primary" />
                                    Career Progression Roadmap
                                </h3>
                                <p className="text-xs text-primary-dark/80 leading-relaxed font-semibold">
                                    {guide.careerProgression}
                                </p>
                            </Card>

                        </div>

                    </div>

                </div>
            ) : (
                <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <HelpCircle className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">Generate a career guide</h3>
                    <p className="text-text-secondary max-w-sm">
                        Enter your qualifications or target role above to generate a customized career progression roadmap.
                    </p>
                </Card>
            )}
            </>
            )}
        </div>
    );
}

export default function CareerGuidancePage() {
    return (
        <Suspense fallback={
            <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-sm text-text-secondary">Loading Career Guidance...</p>
            </div>
        }>
            <CareerGuidanceInner />
        </Suspense>
    );
}
