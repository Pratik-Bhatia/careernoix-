'use client';

import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, FileText } from 'lucide-react'; // Changed CheckCircle to CheckCircle2 for consistency
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils'; // Use our new utility

interface DropzoneProps {
    onFileSelect: (file: File) => void;
    isUploading: boolean;
    progress?: number;
    error?: string | null;
}

export default function Dropzone({ onFileSelect, isUploading, progress, error }: DropzoneProps) {
    const [isDragActive, setIsDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragActive(true);
        } else if (e.type === 'dragleave') {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            // Check file type
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/pdf') {
                if (file.size > 10 * 1024 * 1024) { // 10MB check
                    alert('File size exceeds 10MB limit.');
                    return;
                }
                onFileSelect(file);
            } else {
                alert('Please upload a PDF file.');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 10 * 1024 * 1024) {
                alert('File size exceeds 10MB limit.');
                return;
            }
            onFileSelect(file);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto"> {/* Reduced width from 2xl to xl */}
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center w-full min-h-[280px] rounded-xl border-[3px] border-dashed transition-all duration-300 cursor-pointer group", // Increased border to 3px, reduced height slightly
                    isDragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-blue-200 bg-blue-50/30 hover:border-primary hover:bg-blue-50", // Added blue-50/30 tint
                    error && "border-red-500 bg-red-50 hover:bg-red-50 hover:border-red-500",
                    isUploading && "pointer-events-none opacity-90"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !isUploading && inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleChange}
                    disabled={isUploading}
                />

                <AnimatePresence mode='wait'>
                    {isUploading ? (
                        <motion.div
                            key="uploading"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center w-full max-w-xs px-4"
                        >
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                                <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Resume...</h3>
                            <p className="text-gray-500 text-sm mb-6 text-center">Extracting skills and experience</p>

                            {/* Progress Bar */}
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2 font-medium">{progress}% Complete</p>
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center text-center p-6"
                        >
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <AlertCircle className="w-10 h-10 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-red-700 mb-2">Upload Failed</h3>
                            <p className="text-gray-600 mb-6 max-w-sm">{error}</p>
                            <button
                                className="px-6 py-2.5 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors shadow-sm"
                                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                            >
                                Try Again
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center text-center p-6 w-full"
                        >
                            <motion.div
                                className="p-6 bg-blue-50 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300"
                                whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                            >
                                <UploadCloud className="w-10 h-10 text-primary" />
                            </motion.div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Drop your resume here
                            </h3>
                            <p className="text-gray-500 mb-6 text-base">
                                or click to browse files
                            </p>

                            <div className="flex items-center gap-3 text-sm text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                                <span className="flex items-center gap-1.5">
                                    <FileText className="w-4 h-4" /> PDF only
                                </span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span>Max 10MB</span>
                            </div>

                            <div className="mt-8 flex items-center gap-2 text-xs text-gray-400 font-medium">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                Your data is encrypted and secure
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
