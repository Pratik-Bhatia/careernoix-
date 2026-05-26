'use client';

import { FeaturePlaceholder } from '@/components/ui/FeaturePlaceholder';
import { Lightbulb } from 'lucide-react';

export default function AISuggestionsPage() {
    return (
        <FeaturePlaceholder 
            title="AI Resume Suggestions"
            description="Our upcoming AI engine will analyze your bullet points and suggest powerful action verbs, industry keywords, and impact metrics to make your resume stand out."
            icon={<Lightbulb className="w-8 h-8 text-primary" />}
            isBeta={true}
        />
    );
}
