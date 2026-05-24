'use client';

import { useEffect, useRef } from 'react';
import { useResumeStore, ResumeData } from './useResumeStore';
import { fetchResumeBuilderData, saveResumeBuilderData } from '@/lib/api';

const DEBOUNCE_MS = 1500;
/**
 * BroadcastChannel name — shared across all tabs of the same origin.
 * When one tab saves, it broadcasts the new data so other tabs update instantly.
 */
const CHANNEL_NAME = 'careeronix_resume_sync';

/**
 * useResumeSync
 *
 * Synchronizes the Zustand resume store with the backend (source of truth).
 *
 * ── On mount:
 *   • Fetches user's resume from backend → hydrates Zustand store
 *   • Opens a BroadcastChannel to receive instant updates from sibling tabs
 *   • Listens for `visibilitychange` to re-fetch when the tab regains focus
 *     (handles cross-browser / cross-device refresh)
 *
 * ── On user edits:
 *   • Debounces auto-save to backend (1500ms)
 *   • After a successful save, broadcasts new data to all other same-origin tabs
 *
 * ── Cross-device sync:
 *   • Covered by the `visibilitychange` listener — when user switches to this
 *     tab, latest data is fetched from the backend DB
 *
 * suppressNextSaveRef:
 *   Prevents a hydration from another tab/device triggering a redundant PUT.
 *
 * Call this hook ONCE — in the Resume Builder layout.tsx.
 */
export function useResumeSync() {
    const { resumeData, hydrateFromBackend, setSyncStatus } = useResumeStore();
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    /** Set to true after first backend fetch so the save watcher activates */
    const isHydratedRef = useRef(false);
    /** Suppresses the auto-save triggered by an external hydration */
    const suppressNextSaveRef = useRef(false);

    // ── Effect 1: Mount — load from backend, open channel, watch visibility ──
    useEffect(() => {
        let cancelled = false;

        const token =
            typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        // Not logged in — skip network sync, use localStorage cache only
        if (!token) {
            isHydratedRef.current = true;
            return;
        }

        // 1a. Fetch from backend and hydrate
        async function loadFromBackend() {
            const backendData = await fetchResumeBuilderData();
            if (!cancelled && backendData) {
                suppressNextSaveRef.current = true; // hydration must not trigger save
                hydrateFromBackend(backendData as ResumeData);
            }
            if (!cancelled) {
                isHydratedRef.current = true;
            }
        }

        loadFromBackend();

        // 1b. BroadcastChannel — instant same-browser tab-to-tab sync
        let channel: BroadcastChannel | null = null;
        if (typeof BroadcastChannel !== 'undefined') {
            channel = new BroadcastChannel(CHANNEL_NAME);
            channel.onmessage = (event: MessageEvent) => {
                if (event.data?.type === 'RESUME_UPDATED' && event.data?.data) {
                    suppressNextSaveRef.current = true;
                    hydrateFromBackend(event.data.data as ResumeData);
                }
            };
        }

        // 1c. Visibility change — cross-browser / cross-device sync
        //     When this tab becomes active again, pull the latest from DB.
        function handleVisibilityChange() {
            if (document.visibilityState !== 'visible') return;
            const t =
                typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!t) return;

            fetchResumeBuilderData().then((backendData) => {
                if (!cancelled && backendData) {
                    suppressNextSaveRef.current = true;
                    hydrateFromBackend(backendData as ResumeData);
                }
            });
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            cancelled = true;
            channel?.close();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once on mount

    // ── Effect 2: Auto-save on resumeData change + broadcast to sibling tabs ──
    useEffect(() => {
        // Not ready yet — wait for the initial backend fetch to complete
        if (!isHydratedRef.current) return;

        // This change came from another tab / visibilitychange re-fetch.
        // Don't write it back — it was already saved by whichever tab wrote it.
        if (suppressNextSaveRef.current) {
            suppressNextSaveRef.current = false;
            return;
        }

        const token =
            typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;

        // Clear pending debounce
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

        setSyncStatus('saving');

        saveTimerRef.current = setTimeout(async () => {
            const success = await saveResumeBuilderData(
                resumeData as Record<string, any>
            );
            setSyncStatus(success ? 'saved' : 'error');

            // Broadcast to all other tabs on same origin (instant multi-tab sync)
            if (success && typeof BroadcastChannel !== 'undefined') {
                try {
                    const bc = new BroadcastChannel(CHANNEL_NAME);
                    bc.postMessage({ type: 'RESUME_UPDATED', data: resumeData });
                    bc.close();
                } catch {
                    // BroadcastChannel not critical — ignore errors
                }
            }

            setTimeout(() => setSyncStatus('idle'), 2500);
        }, DEBOUNCE_MS);

        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resumeData]); // only resumeData triggers save
}
