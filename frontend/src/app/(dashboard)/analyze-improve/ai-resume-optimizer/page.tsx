'use client';

import { FeaturePlaceholder } from '@/components/ui/FeaturePlaceholder';
import { Wand2 } from 'lucide-react';

export default function AIResumeOptimizerPage() {
    return (
        <FeaturePlaceholder 
            title="AI Resume Optimizer"
            description="Get ready for one-click optimization. We're building a tool that automatically tailors your entire resume for specific job descriptions."
            icon={<Wand2 className="w-8 h-8 text-primary" />}
            isBeta={true}
        />
    );
}
