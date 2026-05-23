'use client';

import { useState } from 'react';
import { useResumeStore, type LanguageEntry } from '@/store/useResumeStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Globe, Trash2, Edit3, Save, X } from 'lucide-react';

type LanguageForm = Omit<LanguageEntry, 'id'>;

const emptyForm: LanguageForm = {
    name: '',
    proficiency: 'Native'
};

const proficiencies = ['Native', 'Fluent', 'Professional', 'Conversational', 'Basic'] as const;

export default function LanguagesPage() {
    const router = useRouter();
    const { resumeData, setLanguages } = useResumeStore();
    const entries = resumeData.languages;

    const [form, setForm] = useState<LanguageForm>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isEditorOpen, setEditorOpen] = useState(false);

    const handleBack = () => {
        router.push('/resume-builder/achievements');
    };

    const handleFinish = () => {
        router.push('/dashboard');
    };

    const resetEditor = () => {
        setForm(emptyForm);
        setEditingId(null);
        setEditorOpen(false);
    };

    const openNewEditor = () => {
        setForm(emptyForm);
        setEditingId(null);
        setEditorOpen(true);
    };

    const editEntry = (entry: LanguageEntry) => {
        const { id, ...entryForm } = entry;
        setForm(entryForm);
        setEditingId(id);
        setEditorOpen(true);
    };

    const saveEntry = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setLanguages(entries.map((entry) => entry.id === editingId ? { ...form, id: editingId } : entry));
        } else {
            setLanguages([{ ...form, id: `lang-${Date.now()}` }, ...entries]);
        }
        resetEditor();
    };

    const deleteEntry = (id: string) => {
        setLanguages(entries.filter((entry) => entry.id !== id));
        if (editingId === id) resetEditor();
    };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary">
                            <Globe size={14} />
                            Section 9
                        </div>
                        <h2 className="text-xl font-bold text-text-primary">Languages</h2>
                        <p className="text-sm text-text-secondary mt-1">
                            List the languages you speak and select your proficiency level.
                        </p>
                    </div>
                    {!isEditorOpen && (
                        <Button onClick={openNewEditor} size="sm" className="gap-2 self-start sm:self-auto">
                            <Plus size={16} />
                            Add Language
                        </Button>
                    )}
                </div>

                {isEditorOpen && (
                    <form onSubmit={saveEntry} className="rounded-xl border border-primary/15 bg-gray-50/50 p-4 sm:p-5 space-y-4">
                        <div className="font-bold text-text-primary text-sm">
                            {editingId ? 'Edit Language' : 'New Language'}
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input
                                id="lang-name"
                                label="Language Name"
                                placeholder="e.g. English, French, Mandarin"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                            <div className="space-y-2">
                                <label htmlFor="lang-proficiency" className="text-sm font-semibold text-text-secondary">
                                    Proficiency Level
                                </label>
                                <select
                                    id="lang-proficiency"
                                    value={form.proficiency}
                                    onChange={(e) => setForm({ ...form, proficiency: e.target.value })}
                                    className="flex h-12 w-full rounded-xl border border-border bg-white px-4 py-2 text-text-primary outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary-light"
                                >
                                    {proficiencies.map((prof) => (
                                        <option key={prof} value={prof}>
                                            {prof}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="secondary" onClick={resetEditor} size="sm" className="gap-1.5">
                                <X size={16} />
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" className="gap-1.5">
                                <Save size={16} />
                                Save
                            </Button>
                        </div>
                    </form>
                )}

                {entries.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-8 text-center text-text-secondary">
                        No languages added yet. Click &quot;Add Language&quot; to list your language skills.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {entries.map((entry) => (
                            <div key={entry.id} className="flex justify-between items-start p-4 rounded-xl border border-border bg-surface hover:border-primary/20 transition-all">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-text-primary text-base">
                                        {entry.name}
                                    </h3>
                                    <span className="inline-flex items-center bg-primary-light text-primary border border-primary/10 px-2 py-0.5 rounded text-xs font-semibold">
                                        {entry.proficiency}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => editEntry(entry)}
                                        className="p-2 text-text-placeholder hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                                        aria-label="Edit language"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => deleteEntry(entry.id)}
                                        className="p-2 text-text-placeholder hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                                        aria-label="Delete language"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-between mt-6">
                <Button type="button" variant="secondary" onClick={handleBack} className="gap-2">
                    <ArrowLeft size={16} />
                    Back
                </Button>
                <Button type="button" onClick={handleFinish} className="gap-2">
                    Finish & View Dashboard
                </Button>
            </div>
        </div>
    );
}
