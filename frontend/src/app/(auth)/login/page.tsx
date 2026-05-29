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
        <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-8">
            <div className="w-full max-w-[400px] flex flex-col items-center">
                {/* Logo */}
                <div className="mb-10 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                        <span className="text-white font-medium text-sm">S</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-text-primary">SmartMatch</span>
                </div>

                <Card className="w-full p-8 sm:p-10 shadow-card border border-border">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-semibold text-text-primary mb-2">Welcome back</h1>
                        <p className="text-sm text-text-secondary">Sign in to your account to continue</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-error/5 border border-error/10 text-error text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <div className="space-y-1">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-semibold text-text-secondary ml-1">Password</label>
                                <a href="#" className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm text-text-secondary">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-medium text-text-primary hover:underline underline-offset-4">
                            Sign up
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
