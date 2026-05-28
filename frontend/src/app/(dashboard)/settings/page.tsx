'use client';

import { useEffect, useState } from 'react';
import { useSettingsStore, UserSettings, UserProfile } from '@/store/useSettingsStore';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { changePassword, deleteAccount } from '@/lib/api';
import { Settings as SettingsIcon, Save, AlertTriangle, LogOut, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const { settings, fetchSettings, updateSettings, updateProfile, isLoading, hasLoaded, clearSettings } = useSettingsStore();
    const { user, logout, refreshUser } = useStore();
    const router = useRouter();

    const [profileForm, setProfileForm] = useState<UserProfile>({
        full_name: '',
        phone: '',
        profile_headline: ''
    });

    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (!hasLoaded) {
            fetchSettings();
        }
    }, [hasLoaded, fetchSettings]);

    useEffect(() => {
        if (hasLoaded && user) {
            setProfileForm({
                full_name: user.full_name || '',
                phone: (user as any).phone || '',
                profile_headline: settings.profile_headline || ''
            });
        }
    }, [hasLoaded, user, settings.profile_headline]);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await updateProfile(profileForm);
            // Sync updated name/phone back into the global auth store
            // so the sidebar user card reflects the changes immediately
            await refreshUser();
            showToast('Account information saved');
        } catch (error) {
            showToast('Failed to save account information', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePreferenceChange = async (key: keyof UserSettings, value: any) => {
        try {
            await updateSettings({ [key]: value });
            showToast('Preference updated');
        } catch (error) {
            showToast('Failed to update preference', 'error');
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.new_password !== passwordForm.confirm_password) {
            return showToast('Passwords do not match', 'error');
        }
        if (passwordForm.new_password.length < 6) {
            return showToast('Password must be at least 6 characters', 'error');
        }

        setIsSaving(true);
        try {
            await changePassword({
                current_password: passwordForm.current_password,
                new_password: passwordForm.new_password
            });
            showToast('Password changed successfully. Please log in again.');
            setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
            setTimeout(() => {
                handleLogout();
            }, 1500);
        } catch (error) {
            showToast('Failed to change password', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        clearSettings();
        logout();
        router.push('/login');
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount();
            handleLogout();
        } catch (error) {
            showToast('Failed to delete account', 'error');
            setShowDeleteModal(false);
        }
    };

    if (!hasLoaded || isLoading) {
        return <div className="flex items-center justify-center p-12"><div className="animate-pulse">Loading settings...</div></div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in pb-10 max-w-4xl">
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg font-medium text-white transition-opacity ${toast.type === 'error' ? 'bg-error' : 'bg-green-600'}`}>
                    {toast.message}
                </div>
            )}

            <header className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <SettingsIcon className="text-primary w-6 h-6" />
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                </div>
                <p className="text-text-secondary text-lg">Manage your account preferences and profile details.</p>
            </header>

            {/* Section 1: Account Information */}
            <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Account Information</h2>
                <div className="space-y-4 max-w-2xl">
                    <Input
                        label="Email Address"
                        value={user?.email || ''}
                        disabled
                        className="bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Full Name"
                            value={profileForm.full_name}
                            onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                        />
                        <Input
                            label="Phone Number"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        />
                    </div>
                    <Input
                        label="Profile Headline / Role"
                        placeholder="e.g. Senior Frontend Developer"
                        value={profileForm.profile_headline}
                        onChange={(e) => setProfileForm({ ...profileForm, profile_headline: e.target.value })}
                    />
                    <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2 mt-2">
                        <Save size={16} /> Save Account Info
                    </Button>
                </div>
            </Card>

            {/* Section 2: Profile Preferences */}
            <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Profile Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-secondary">Preferred Job Role</label>
                        <select 
                            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm"
                            value={settings.preferred_job_role || ''}
                            onChange={(e) => handlePreferenceChange('preferred_job_role', e.target.value)}
                        >
                            <option value="">Any Role</option>
                            <option value="Frontend Developer">Frontend Developer</option>
                            <option value="Backend Developer">Backend Developer</option>
                            <option value="Full Stack Developer">Full Stack Developer</option>
                            <option value="Data Scientist">Data Scientist</option>
                            <option value="Product Manager">Product Manager</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-secondary">Preferred Industry</label>
                        <select 
                            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm"
                            value={settings.preferred_industry || ''}
                            onChange={(e) => handlePreferenceChange('preferred_industry', e.target.value)}
                        >
                            <option value="">Any Industry</option>
                            <option value="Technology">Technology</option>
                            <option value="Finance">Finance</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="E-commerce">E-commerce</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-secondary">Experience Level</label>
                        <select 
                            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm"
                            value={settings.experience_level || ''}
                            onChange={(e) => handlePreferenceChange('experience_level', e.target.value)}
                        >
                            <option value="">Not Specified</option>
                            <option value="Entry Level">Entry Level (0-2 years)</option>
                            <option value="Mid Level">Mid Level (3-5 years)</option>
                            <option value="Senior">Senior (5+ years)</option>
                            <option value="Executive">Executive</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-secondary">Preferred Work Type</label>
                        <select 
                            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm"
                            value={settings.preferred_work_type || ''}
                            onChange={(e) => handlePreferenceChange('preferred_work_type', e.target.value)}
                        >
                            <option value="">Any</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="On-site">On-site</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Section 3: Resume Settings */}
            <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Resume Settings</h2>
                <div className="space-y-6 max-w-2xl">
                    <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
                        <div>
                            <h3 className="font-semibold text-text-primary">Auto-save Resume</h3>
                            <p className="text-sm text-text-secondary">Automatically save changes while editing your resume.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={settings.auto_save_enabled} onChange={(e) => handlePreferenceChange('auto_save_enabled', e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
                        <div>
                            <h3 className="font-semibold text-text-primary">AI Suggestions</h3>
                            <p className="text-sm text-text-secondary">Enable AI-powered recommendations for projects and skills.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={settings.ai_suggestions_enabled} onChange={(e) => handlePreferenceChange('ai_suggestions_enabled', e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
                        <div>
                            <h3 className="font-semibold text-text-primary">ATS Optimization</h3>
                            <p className="text-sm text-text-secondary">Provide continuous ATS keyword tracking and suggestions.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={settings.ats_optimization_enabled} onChange={(e) => handlePreferenceChange('ats_optimization_enabled', e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="space-y-2 pt-2">
                        <label className="text-sm font-semibold text-text-secondary">Default Resume Template</label>
                        <select 
                            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm"
                            value={settings.default_resume_template}
                            onChange={(e) => handlePreferenceChange('default_resume_template', e.target.value)}
                        >
                            <option value="modern">Modern (Recommended)</option>
                            <option value="classic">Classic / ATS Standard</option>
                            <option value="creative">Creative</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Section 4: Security Settings */}
            <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Security Settings</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-2xl">
                    <Input
                        type="password"
                        label="Current Password"
                        value={passwordForm.current_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            type="password"
                            label="New Password"
                            value={passwordForm.new_password}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                            required
                        />
                        <Input
                            type="password"
                            label="Confirm New Password"
                            value={passwordForm.confirm_password}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                            required
                        />
                    </div>
                    <Button type="submit" disabled={isSaving} className="mt-2">
                        Change Password
                    </Button>
                </form>
            </Card>

            {/* Section 5: Account Actions */}
            <Card className="p-6 border-error/20 bg-error/5">
                <h2 className="text-xl font-bold text-error mb-4 border-b border-error/10 pb-2">Account Actions</h2>
                <div className="space-y-4 max-w-2xl">
                    <p className="text-sm text-text-secondary">Manage your session or permanently deactivate your account.</p>
                    <div className="flex gap-4">
                        <Button variant="secondary" onClick={handleLogout} className="gap-2">
                            <LogOut size={16} /> Sign Out
                        </Button>
                        <Button 
                            variant="secondary" 
                            className="bg-error text-white hover:bg-error/90 gap-2"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            <Trash2 size={16} /> Delete Account
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center gap-3 mb-4 text-error">
                            <AlertTriangle size={24} />
                            <h3 className="text-xl font-bold">Delete Account?</h3>
                        </div>
                        <p className="text-text-secondary mb-6 leading-relaxed">
                            Are you sure you want to delete your account? This action will deactivate your profile and remove access to your data. This cannot be undone automatically.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </Button>
                            <Button 
                                variant="secondary" 
                                className="bg-error text-white hover:bg-error/90"
                                onClick={handleDeleteAccount}
                            >
                                Yes, Delete My Account
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
