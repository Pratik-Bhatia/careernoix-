'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PreviewPanelProps {
    children: React.ReactNode;
    className?: string;
    /** Standard A4 dimensions at 96 DPI */
    baseWidth?: number; 
}

export function PreviewPanel({ children, className, baseWidth = 794 }: PreviewPanelProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // Calculate scale based on container width vs base A4 width
                const containerWidth = entry.contentRect.width;
                const newScale = containerWidth / baseWidth;
                setScale(newScale);
            }
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, [baseWidth]);

    return (
        <div 
            className={cn(
                "relative w-full rounded-xl overflow-hidden bg-gray-100 border border-border shadow-inner custom-scrollbar",
                className
            )}
            // Enforce A4 Aspect Ratio for the container scroll area (optional, we can let it scroll vertically)
        >
            <div 
                ref={containerRef} 
                className="w-full relative"
                style={{ 
                    // Set a minimum height to roughly match an A4 page initially
                    minHeight: `${baseWidth * 1.414}px` 
                }}
            >
                {/* The scaling wrapper */}
                <div 
                    className="absolute top-0 left-0 origin-top-left transition-transform duration-200 ease-out"
                    style={{ 
                        width: `${baseWidth}px`, 
                        transform: `scale(${scale})` 
                    }}
                >
                    {/* The Paper Document */}
                    <div 
                        id="resume-print-area" 
                        className="w-full min-h-[1122px] bg-white shadow-md p-10 antialiased subpixel-antialiased print:p-0 print:shadow-none print:min-h-0 print:w-full"
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
