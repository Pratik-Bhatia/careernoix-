'use client';

import { FeaturePlaceholder } from '@/components/ui/FeaturePlaceholder';
import { BarChart2 } from 'lucide-react';

export default function ResumeScorePage() {
    return (
        <FeaturePlaceholder 
            title="Advanced Resume Score"
            description="We're building an advanced ATS scoring system to give you deep insights into how your resume performs against top job descriptions."
            icon={<BarChart2 className="w-8 h-8 text-primary" />}
            isBeta={true}
        />
    );
}
