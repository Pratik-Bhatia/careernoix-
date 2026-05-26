import React from 'react';
import { FeaturePlaceholder } from '@/components/ui/FeaturePlaceholder';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="h-screen w-full bg-background flex items-center justify-center">
            <FeaturePlaceholder 
                title="Page Not Found"
                description="The page you're looking for doesn't exist or may have been moved."
                icon={<FileQuestion className="w-8 h-8 text-primary" />}
                isBeta={false}
                showResumeBuilderButton={true}
            />
        </div>
    );
}
