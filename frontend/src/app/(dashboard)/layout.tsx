'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Upload,
    LogOut,
    Menu,
    X,
    User,
    Settings,
    Folder,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Compass
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user } = useStore();

    const [isResumeBuilderExpanded, setResumeBuilderExpanded] = useState(pathname.startsWith('/resume-builder'));
    const [isAnalyzeExpanded, setAnalyzeExpanded] = useState(pathname.startsWith('/analyze-improve'));

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Upload Resume', href: '/upload', icon: Upload },
        { name: 'Career Guidance', href: '/career-guidance', icon: Compass },
    ];

    const resumeBuilderChildren = [
        { name: 'Personal Info', href: '/resume-builder/personal-info' },
        { name: 'Summary', href: '/resume-builder/summary' },
        { name: 'Experience', href: '/resume-builder/experience' },
        { name: 'Education', href: '/resume-builder/education' },
        { name: 'Skills', href: '/resume-builder/skills' },
        { name: 'Projects', href: '/resume-builder/projects' },
        { name: 'Certifications', href: '/resume-builder/certifications' },
        { name: 'Achievements', href: '/resume-builder/achievements' },
        { name: 'Languages', href: '/resume-builder/languages' },
    ];

    const analyzeImproveChildren = [
        { name: 'Resume Score', href: '/analyze-improve/resume-score' },
        { name: 'AI Project Recommendations', href: '/analyze-improve/ai-suggestions' },
        { name: 'AI Resume Optimizer', href: '/analyze-improve/ai-resume-optimizer' },
    ];

    const bottomNavItems = [
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <div className="h-screen bg-background flex overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col h-full",
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Header */}
                <div className="h-20 flex-shrink-0 flex items-center px-6 border-b border-border/50">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-white font-medium">S</span>
                        </div>
                        <span className="text-xl font-bold text-text-primary tracking-tight">SmartMatch</span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto lg:hidden p-2 text-text-secondary hover:bg-gray-100 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden flex-shrink-0",
                                    isActive
                                        ? 'bg-surface-secondary text-text-primary'
                                        : 'text-text-secondary hover:bg-surface-secondary/50 hover:text-text-primary'
                                )}
                            >
                                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 bg-primary rounded-full transition-all" />}
                                <Icon size={18} className={cn("mr-3 transition-colors", isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-secondary')} />
                                {item.name}
                            </Link>
                        );
                    })}

                    {/* Resume Builder Collapsible Group */}
                    <div>
                        <button
                            onClick={() => setResumeBuilderExpanded(!isResumeBuilderExpanded)}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden cursor-pointer",
                                pathname.startsWith('/resume-builder')
                                    ? 'bg-surface-secondary text-text-primary'
                                    : 'text-text-secondary hover:bg-surface-secondary/50 hover:text-text-primary'
                            )}
                        >
                            {pathname.startsWith('/resume-builder') && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 bg-primary rounded-full" />}
                            <div className="flex items-center">
                                <Folder size={18} className={cn("mr-3 transition-colors", pathname.startsWith('/resume-builder') ? 'text-primary' : 'text-text-muted group-hover:text-text-secondary')} />
                                Resume Builder
                            </div>
                            {isResumeBuilderExpanded ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />}
                        </button>
                        
                        {isResumeBuilderExpanded && (
                            <div className="mt-1 ml-3 pl-4 border-l border-border space-y-1 py-1">
                                {resumeBuilderChildren.map((child) => {
                                    const isChildActive = pathname === child.href;
                                    return (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={cn(
                                                "flex items-center px-3 py-1.5 text-sm rounded-md transition-colors",
                                                isChildActive
                                                    ? 'text-text-primary font-medium bg-surface-secondary/50'
                                                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary/30'
                                            )}
                                        >
                                            {child.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Analyze & Improve Collapsible Group */}
                    <div>
                        <button
                            onClick={() => setAnalyzeExpanded(!isAnalyzeExpanded)}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden cursor-pointer",
                                pathname.startsWith('/analyze-improve')
                                    ? 'bg-surface-secondary text-text-primary'
                                    : 'text-text-secondary hover:bg-surface-secondary/50 hover:text-text-primary'
                            )}
                        >
                            {pathname.startsWith('/analyze-improve') && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 bg-primary rounded-full" />}
                            <div className="flex items-center">
                                <Sparkles size={18} className={cn("mr-3 transition-colors", pathname.startsWith('/analyze-improve') ? 'text-primary' : 'text-text-muted group-hover:text-text-secondary')} />
                                Analyze & Improve
                            </div>
                            {isAnalyzeExpanded ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />}
                        </button>
                        
                        {isAnalyzeExpanded && (
                            <div className="mt-1 ml-3 pl-4 border-l border-border space-y-1 py-1">
                                {analyzeImproveChildren.map((child) => {
                                    const isChildActive = pathname === child.href;
                                    return (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={cn(
                                                "flex items-center px-3 py-1.5 text-sm rounded-md transition-colors",
                                                isChildActive
                                                    ? 'text-text-primary font-medium bg-surface-secondary/50'
                                                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary/30'
                                            )}
                                        >
                                            {child.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {bottomNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden flex-shrink-0",
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                                )}
                            >
                                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full transition-all" />}
                                <Icon size={20} className={cn("mr-3 transition-colors", isActive ? 'text-primary' : 'text-text-placeholder group-hover:text-text-secondary')} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-border flex-shrink-0 bg-surface">
                    <div className="flex items-center mb-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-surface-secondary border border-border flex items-center justify-center text-text-secondary">
                            <User size={16} />
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium text-text-primary truncate">
                                {user?.full_name || 'User'}
                            </p>
                            <p className="text-xs text-text-muted truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full justify-start text-error hover:text-error hover:bg-error/5"
                    >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Mobile Header */}
                <header className="h-16 lg:hidden flex-shrink-0 flex items-center px-4 bg-surface border-b border-border sticky top-0 z-30 gap-2">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -ml-2 text-text-primary rounded-lg hover:bg-gray-100"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="text-lg font-bold text-text-primary">SmartMatch</span>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
