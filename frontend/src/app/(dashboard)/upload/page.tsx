'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { apiClient } from '@/lib/api';
import Dropzone from '@/components/upload/Dropzone';
import { FileText, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useResumeStore } from '@/store/useResumeStore';

export default function UploadPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const { token, setResumeUploaded } = useStore();
    const { hydrateFromBackend } = useResumeStore();
    const router = useRouter();

    const handleFileSelect = async (file: File) => {
        if (!token) {
            router.push('/login');
            return;
        }

        setIsUploading(true);
        setError(null);
        setUploadSuccess(false);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('file', file);

        // Simulate progress interval
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 10;
            });
        }, 200);

        try {
            const response = await apiClient.post('/resume/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const parsedData = response.data?.parsed_data;

            clearInterval(progressInterval);
            setUploadProgress(100);
            setResumeUploaded(true);

            if (parsedData) {
                hydrateFromBackend(parsedData);
            }

            // Short delay to show 100%
            setTimeout(() => {
                setUploadSuccess(true);
                // Redirect to resume score after success animation
                setTimeout(() => {
                    router.push('/analyze-improve/resume-score');
                }, 2000);
            }, 500);

        } catch (err: any) {
            clearInterval(progressInterval);
            console.error('Upload failed:', err);
            setError(err.response?.data?.detail || 'Failed to upload resume. Please try again.');
            setIsUploading(false); // Only set uploading false on error so success state persists
        }
    };

    if (uploadSuccess) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-md w-full border border-blue-100"
                >
                    <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50/50">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis Complete!</h2>
                    <p className="text-gray-500 mb-8 text-lg">
                        Redirecting to your resume score analysis...
                    </p>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: '100%' }}></div>
                    </div>
                </motion.div>
            </div>
        );
    }

    const features = [
        {
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-50",
            title: "Smart Parsing",
            desc: "AI extracts skills, experience, and education instantly."
        },
        {
            icon: TrendingUp,
            color: "text-purple-600",
            bg: "bg-purple-50",
            title: "Market Analysis",
            desc: "Compare your profile against thousands of live job roles."
        },
        {
            icon: ShieldCheck,
            color: "text-green-600",
            bg: "bg-green-50",
            title: "Secure & Private",
            desc: "Your data is encrypted and never shared without permission."
        }
    ];

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Layered Background Highlight */}
            <div className="absolute top-0 left-0 w-full h-[55vh] bg-background/80 rounded-b-[40px] -z-10" />

            <div className="p-4 lg:p-8 flex flex-col items-center">
                <div className="w-full max-w-4xl mx-auto pt-6 lg:pt-10 pb-20">
                    <div className="text-center mb-8 space-y-3">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                            Optimize Your Resume with AI
                        </h1>
                        <p className="text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
                            Upload your PDF to get instant feedback, job matches, and a detailed gap analysis.
                        </p>
                    </div>

                    <div className="bg-white p-6 lg:p-10 rounded-3xl shadow-lg shadow-blue-900/5 border border-white/50 mb-10 max-w-3xl mx-auto">
                        <Dropzone
                            onFileSelect={handleFileSelect}
                            isUploading={isUploading}
                            progress={Math.round(uploadProgress)}
                            error={error}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100/50 hover:shadow-md hover:border-blue-100 transition-all duration-300 group"
                            >
                                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300", feature.bg, "group-hover:scale-105")}>
                                    <feature.icon className={cn("w-6 h-6", feature.color)} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
