'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OldExperiencePage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/resume-builder/experience');
    }, [router]);

    return (
        <div className="flex h-64 items-center justify-center text-text-secondary text-sm">
            Redirecting to Resume Builder...
        </div>
    );
}
