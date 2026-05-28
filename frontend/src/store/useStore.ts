import { create } from 'zustand';
import type { DashboardData } from '@/lib/api';

export interface User {
    id: number;
    email: string;
    full_name?: string;
    phone?: string;
    profile_image_url?: string;
}

interface AppState {
    user: User | null;
    token: string | null;
    isLoading: boolean;

    // Dashboard state
    resumeUploaded: boolean;
    dashboardData: DashboardData | null;

    // Actions
    setAuth: (token: string, user: User) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    setResumeUploaded: (val: boolean) => void;
    setDashboardData: (data: DashboardData | null) => void;
    refreshUser: () => Promise<void>;

    // Async
    checkAuth: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isLoading: false,
    resumeUploaded: false,
    dashboardData: null,

    setAuth: (token, user) => {
        localStorage.setItem('token', token);
        set({ token, user });
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, dashboardData: null, resumeUploaded: false });
    },

    setLoading: (loading) => set({ isLoading: loading }),

    setResumeUploaded: (val) => set({ resumeUploaded: val }),

    setDashboardData: (data) => set({ dashboardData: data }),

    refreshUser: async () => {
        const token = get().token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
        if (!token) return;
        try {
            // Dynamic import avoids circular dependency issues
            const { fetchCurrentUser } = await import('@/lib/api');
            const userData = await fetchCurrentUser();
            set({ user: userData });
        } catch {
            // Silently fail — user data just won't update in memory
        }
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (token) {
            set({ token });
        }
    }
}));
