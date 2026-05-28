import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchUserSettings, updateUserSettings, updateUserProfile } from '@/lib/api';

export interface UserSettings {
    profile_headline: string;
    preferred_job_role: string;
    preferred_industry: string;
    experience_level: string;
    preferred_work_type: string;
    default_resume_template: string;
    auto_save_enabled: boolean;
    ai_suggestions_enabled: boolean;
    ats_optimization_enabled: boolean;
}

export interface UserProfile {
    full_name: string;
    phone: string;
    profile_headline: string;
}

const defaultSettings: UserSettings = {
    profile_headline: '',
    preferred_job_role: '',
    preferred_industry: '',
    experience_level: '',
    preferred_work_type: '',
    default_resume_template: 'modern',
    auto_save_enabled: true,
    ai_suggestions_enabled: true,
    ats_optimization_enabled: true,
};

interface SettingsStore {
    settings: UserSettings;
    isLoading: boolean;
    hasLoaded: boolean;
    
    // Actions
    fetchSettings: () => Promise<void>;
    updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
    updateProfile: (profile: UserProfile) => Promise<void>;
    clearSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set, get) => ({
            settings: defaultSettings,
            isLoading: false,
            hasLoaded: false,

            fetchSettings: async () => {
                set({ isLoading: true });
                try {
                    const data = await fetchUserSettings();
                    set({ 
                        settings: { ...get().settings, ...data }, 
                        hasLoaded: true 
                    });
                } catch (error) {
                    console.error('Failed to fetch settings:', error);
                } finally {
                    set({ isLoading: false });
                }
            },

            updateSettings: async (newSettings) => {
                const currentSettings = get().settings;
                const updated = { ...currentSettings, ...newSettings };
                
                // Optimistic update
                set({ settings: updated });
                
                try {
                    await updateUserSettings(updated);
                } catch (error) {
                    console.error('Failed to update settings:', error);
                    // Revert on failure
                    set({ settings: currentSettings });
                    throw error;
                }
            },

            updateProfile: async (profile) => {
                try {
                    await updateUserProfile(profile);
                    // Also optimistically update local headline setting
                    set({
                        settings: { ...get().settings, profile_headline: profile.profile_headline }
                    });
                } catch (error) {
                    console.error('Failed to update profile:', error);
                    throw error;
                }
            },

            clearSettings: () => set({ settings: defaultSettings, hasLoaded: false })
        }),
        {
            name: 'careeronix_settings',
            partialize: (state) => ({ settings: state.settings }), // only persist settings
        }
    )
);
