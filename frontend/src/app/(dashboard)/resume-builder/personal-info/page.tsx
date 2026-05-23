'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { ArrowRight, User } from 'lucide-react';

export default function PersonalInfoPage() {
    const router = useRouter();
    const { resumeData, updatePersonalInfo } = useResumeStore();
    const { personalInfo } = resumeData;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/resume-builder/summary');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6 space-y-6">
                <div className="border-b border-gray-100 pb-4">
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary">
                        <User size={14} />
                        Section 1
                    </div>
                    <h2 className="text-xl font-bold text-text-primary">Personal Details</h2>
                    <p className="text-sm text-text-secondary mt-1">
                        Provide your primary contact info so hiring managers can reach out.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Input
                        id="fullName"
                        label="Full name"
                        placeholder="e.g. Alex Morgan"
                        value={personalInfo.fullName}
                        onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                        required
                    />
                    <Input
                        id="jobTitle"
                        label="Professional title"
                        placeholder="e.g. Full Stack Engineer"
                        value={personalInfo.jobTitle}
                        onChange={(e) => updatePersonalInfo({ jobTitle: e.target.value })}
                        required
                    />
                    <Input
                        id="email"
                        label="Email address"
                        type="email"
                        placeholder="e.g. alex@example.com"
                        value={personalInfo.email}
                        onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                        required
                    />
                    <Input
                        id="phone"
                        label="Phone number"
                        placeholder="e.g. +1 (555) 019-2834"
                        value={personalInfo.phone}
                        onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                    />
                    <Input
                        id="location"
                        label="Location (City, State/Country)"
                        placeholder="e.g. San Francisco, CA"
                        value={personalInfo.location}
                        onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                    />
                    <Input
                        id="website"
                        label="Personal Website / Portfolio"
                        placeholder="e.g. https://myportfolio.dev"
                        value={personalInfo.website}
                        onChange={(e) => updatePersonalInfo({ website: e.target.value })}
                    />
                    <Input
                        id="linkedin"
                        label="LinkedIn URL"
                        placeholder="e.g. https://linkedin.com/in/username"
                        value={personalInfo.linkedin}
                        onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                    />
                    <Input
                        id="github"
                        label="GitHub URL"
                        placeholder="e.g. https://github.com/username"
                        value={personalInfo.github}
                        onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" className="gap-2">
                    Save & Next
                    <ArrowRight size={16} />
                </Button>
            </div>
        </form>
    );
}
