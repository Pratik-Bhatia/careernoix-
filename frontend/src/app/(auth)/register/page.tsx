'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAxiosError } from 'axios';
import { apiClient } from '@/lib/api';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

type ApiErrorResponse = {
    detail?: string;
};

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const normalizedEmail = email.trim().toLowerCase();
            await apiClient.post('/auth/register', {
                email: normalizedEmail,
                password
            });
            router.push('/login');
        } catch (error: unknown) {
            const message = isAxiosError<ApiErrorResponse>(error)
                ? error.response?.data?.detail || error.message
                : error instanceof Error
                    ? error.message
                    : 'Registration failed. Please try again.';
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
                        <h1 className="text-2xl font-semibold text-text-primary mb-2">Create account</h1>
                        <p className="text-sm text-text-secondary">Enter your details to get started</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-error/5 border border-error/10 text-error text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-text-secondary ml-1">Password</label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
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

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-text-secondary ml-1">Confirm Password</label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" fullWidth isLoading={isLoading} className="mt-4">
                            Sign Up
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm text-text-secondary">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-text-primary hover:underline underline-offset-4">
                            Sign in
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
