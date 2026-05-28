import axios from 'axios';
import { config } from '@/config';

// ─── Types ──────────────────────────────────────────────
export interface MatchDetail {
    score: number;
    matched_skills: string[];
    missing_skills: string[];
}

export interface MatchResult {
    id: number;
    user_id: number;
    job_role_id: number;
    score: number;
    details: MatchDetail;
    job_role?: JobRole;
}

export interface JobRole {
    id: number;
    title: string;
    description: string | null;
    required_skills: string[];
}

export interface DashboardData {
    matches: MatchResult[];
    jobRoles: JobRole[];
}

// ─── Centralized Axios Instance ─────────────────────────
export const apiClient = axios.create({
    baseURL: config.API_URL,
});

// Request interceptor — auto-inject Bearer token
apiClient.interceptors.request.use((reqConfig) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            reqConfig.headers = reqConfig.headers || {};
            reqConfig.headers.Authorization = `Bearer ${token}`;
        }
    }
    return reqConfig;
});

// Response interceptor — handle 401 (expired/invalid token)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            // Clear auth state and redirect
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ─── User / Settings API ─────────────────────────────────
export const fetchUserSettings = async () => {
    const response = await apiClient.get('/users/me/settings');
    return response.data;
};

export const updateUserSettings = async (data: any) => {
    const response = await apiClient.put('/users/me/settings', data);
    return response.data;
};

export const updateUserProfile = async (data: any) => {
    const response = await apiClient.put('/users/me/profile', data);
    return response.data;
};

export const changePassword = async (data: any) => {
    const response = await apiClient.post('/users/me/password', data);
    return response.data;
};

export const deleteAccount = async () => {
    const response = await apiClient.delete('/users/me');
    return response.data;
};

export const fetchCurrentUser = async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
};

// ─── Dashboard Data Fetching ────────────────────────────
/**
 * Fetches all data needed for the dashboard.
 * Uses Promise.allSettled so one failure doesn't crash the other.
 */
export async function fetchDashboardData(): Promise<DashboardData> {
    const [matchesResult, jobRolesResult] = await Promise.allSettled([
        apiClient.get<MatchResult[]>('/matches/latest?limit=10'),
        apiClient.get<JobRole[]>('/job-roles/'),
    ]);

    const matches = matchesResult.status === 'fulfilled' ? matchesResult.value.data : [];
    const jobRoles = jobRolesResult.status === 'fulfilled' ? jobRolesResult.value.data : [];

    // Log for debugging (temporary)
    console.log('[API] matches status:', matchesResult.status,
        matchesResult.status === 'fulfilled' ? `(${matches.length} items)` : (matchesResult as PromiseRejectedResult).reason?.message);
    console.log('[API] jobRoles status:', jobRolesResult.status,
        jobRolesResult.status === 'fulfilled' ? `(${jobRoles.length} items)` : (jobRolesResult as PromiseRejectedResult).reason?.message);

    // Enrich matches with job role info if relationship not included
    const jobRolesMap = new Map(jobRoles.map((jr: JobRole) => [jr.id, jr]));
    const enrichedMatches = matches.map((match: MatchResult) => ({
        ...match,
        job_role: match.job_role || jobRolesMap.get(match.job_role_id) || undefined,
    }));

    return {
        matches: enrichedMatches,
        jobRoles,
    };
}

// ─── JWT Decode Helper ──────────────────────────────────
/**
 * Lightweight decode of JWT payload (no verification — client-side only).
 * Returns the parsed payload or null if decoding fails.
 */
export function decodeJwtPayload(token: string): Record<string, any> | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

// ─── Resume Builder Sync ─────────────────────────────────

/**
 * Fetch the logged-in user's resume builder data from the backend.
 * Returns null if unauthenticated or no data saved yet.
 */
export async function fetchResumeBuilderData(): Promise<Record<string, any> | null> {
    try {
        const response = await apiClient.get<Record<string, any>>('/resume-builder/');
        // Backend returns {} when no record exists yet — treat as null
        if (!response.data || Object.keys(response.data).length === 0) return null;
        return response.data;
    } catch {
        return null;
    }
}

/**
 * Persist the full resume builder data for the logged-in user.
 * Fire-and-forget safe — errors are caught and returned as false.
 */
export async function saveResumeBuilderData(data: Record<string, any>): Promise<boolean> {
    try {
        await apiClient.put('/resume-builder/', { data });
        return true;
    } catch {
        return false;
    }
}
