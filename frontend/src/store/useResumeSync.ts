'use client';

import { useEffect, useRef } from 'react';
import { useResumeStore, ResumeData } from './useResumeStore';
import { fetchResumeBuilderData, saveResumeBuilderData } from '@/lib/api';

const DEBOUNCE_MS = 1500;

/**
 * useResumeSync
 *
 * Activates account-based resume synchronization:
 * 1. On mount: fetches resume data from backend → hydrates Zustand store
 * 2. Watches resumeData changes → debounced auto-save to backend (1500ms)
 * 3. Updates syncStatus throughout ('idle' | 'saving' | 'saved' | 'error')
 *
 * localStorage remains as a fallback cache via Zustand persist middleware.
 * Call this hook ONCE in the Resume Builder layout — not in individual pages.
 */
export function useResumeSync() {
    const { resumeData, hydrateFromBackend, setSyncStatus } = useResumeStore();
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isHydratedRef = useRef(false);

    // ── 1. Load from backend on mount ──────────────────────────────
    useEffect(() => {
        let cancelled = false;

        async function loadFromBackend() {
            const token =
                typeof window !== 'undefined' ? localStorage.getItem('token') : null;

            // Not logged in — skip fetch, use whatever is in localStorage
            if (!token) return;

            const backendData = await fetchResumeBuilderData();

            if (!cancelled && backendData) {
                hydrateFromBackend(backendData as ResumeData);
            }

            // Mark hydration done so the change-watcher below doesn't fire
            // immediately for the hydration itself
            if (!cancelled) {
                isHydratedRef.current = true;
            }
        }

        loadFromBackend();

        return () => {
            cancelled = true;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once on mount

    // ── 2. Auto-save on change (debounced) ────────────────────────
    useEffect(() => {
        // Skip the very first render and the hydration update to avoid
        // immediately writing the local-cache back to the backend before
        // the backend fetch even resolves
        if (!isHydratedRef.current) return;

        const token =
            typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;

        // Clear any pending save
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

        setSyncStatus('saving');

        saveTimerRef.current = setTimeout(async () => {
            const success = await saveResumeBuilderData(resumeData as Record<string, any>);
            setSyncStatus(success ? 'saved' : 'error');

            // Reset to 'idle' after showing status for 2.5s
            setTimeout(() => setSyncStatus('idle'), 2500);
        }, DEBOUNCE_MS);

        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
    // resumeData is the only real dependency — changes trigger the debounced save
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resumeData]);
}
