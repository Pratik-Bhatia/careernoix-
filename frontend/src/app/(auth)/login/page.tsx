'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { apiClient, decodeJwtPayload } from '@/lib/api';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

type LoginResponse = {
    access_token: string;
    token_type: string;
};

type ApiErrorResponse = {
    detail?: string;
};

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();
    const setAuth = useStore((state) => state.setAuth);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const normalizedEmail = email.trim().toLowerCase();
            const formData = new URLSearchParams();
            formData.append('username', normalizedEmail);
            formData.append('password', password);

            const response = await apiClient.post<LoginResponse>('/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const { access_token } = response.data;
            // Decode the JWT to get the real user ID
            const payload = decodeJwtPayload(access_token);
            const userId = payload?.sub ? parseInt(payload.sub, 10) : 0;
            setAuth(access_token, { id: userId, email: normalizedEmail });
            router.push('/dashboard');
        } catch (error: unknown) {
            const message = isAxiosError<ApiErrorResponse>(error)
                ? error.response?.data?.detail || error.message
                : error instanceof Error
                    ? error.message
                    : 'Login failed. Please check your credentials.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            {/* Left Side - Illustration & Branding */}
            <div className="hidden lg:flex w-[40%] bg-white flex-col justify-between p-12 relative overflow-hidden border-r border-border">
                <div className="z-10">
                    <div className="flex items-center gap-3 mb-8">
                        {/* Brand Logo */}
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="text-2xl font-bold text-text-primary tracking-tight">SmartMatch</span>
                    </div>
                </div>

                <div className="z-10 mb-20 relative">
                    {/* Abstract Illustration Elements */}
                    <div className="absolute -top-32 -left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl mix-blend-multiply animate-pulse"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-background rounded-full blur-3xl mix-blend-multiply opacity-70"></div>

                    <h1 className="text-4xl font-bold text-text-primary leading-[1.15] mb-6">
                        Build Your Career with <span className="text-primary relative inline-block">
                            Confidence
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                            </svg>
                        </span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-sm leading-relaxed">
                        Connect with top employers and find opportunities that match your true potential.
                    </p>
                </div>

                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(#1F3FC3 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-[60%] flex items-center justify-center p-6 bg-background relative">
                {/* Mobile Brand Header */}
                <div className="lg:hidden absolute top-0 left-0 w-full p-6 flex justify-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">S</span>
                        </div>
                        <span className="text-xl font-bold text-text-primary">SmartMatch</span>
                    </div>
                </div>

                <Card className="w-full max-w-[420px] bg-white/80 backdrop-blur-sm shadow-card border-white/50">
                    <div className="mb-8 text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome back</h2>
                        <p className="text-text-secondary">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-error/5 border border-error/10 text-error text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <span className="w-2 h-2 bg-error rounded-full shrink-0"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-text-secondary">Password</label>
                                <a href="#" className="text-sm font-medium text-primary hover:text-primary-hover hover:underline decoration-2 underline-offset-2 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="flex h-12 w-full rounded-xl border border-border bg-surface px-4 py-2 text-text-primary placeholder:text-text-placeholder transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary-light group-hover:border-primary/50 pr-12"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-placeholder hover:text-text-secondary transition-colors p-1"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            isLoading={isLoading}
                        >
                            Sign in
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border/50 text-center">
                        <span className="text-text-secondary text-sm">Don&apos;t have an account? </span>
                        <Link href="/register" className="text-primary font-semibold hover:text-primary-hover hover:underline decoration-2 underline-offset-2 transition-colors ml-1">
                            Create free account
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
