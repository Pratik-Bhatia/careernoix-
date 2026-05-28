'use client';

import { useState } from 'react';
import { useResumeStore, type ProjectEntry } from '@/store/useResumeStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Plus, FolderGit, Edit3, Trash2, CalendarDays, Globe, Save, X, Check } from 'lucide-react';

type ProjectForm = Omit<ProjectEntry, 'id'>;

const emptyForm: ProjectForm = {
    name: '',
    role: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    link: ''
};

export default function ProjectsPage() {
    const router = useRouter();
    const { resumeData, setProjects } = useResumeStore();
    const entries = resumeData.projects;

    const [form, setForm] = useState<ProjectForm>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isEditorOpen, setEditorOpen] = useState(false);

    const handleBack = () => {
        router.push('/resume-builder/skills');
    };

    const handleNext = () => {
        router.push('/resume-builder/certifications');
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

    const editEntry = (entry: ProjectEntry) => {
        const { id, ...entryForm } = entry;
        setForm(entryForm);
        setEditingId(id);
        setEditorOpen(true);
    };

    const saveEntry = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setProjects(entries.map((entry) => entry.id === editingId ? { ...form, id: editingId } : entry));
        } else {
            setProjects([{ ...form, id: `proj-${Date.now()}` }, ...entries]);
        }
        resetEditor();
    };

    const deleteEntry = (id: string) => {
        setProjects(entries.filter((entry) => entry.id !== id));
        if (editingId === id) resetEditor();
    };

    const markAsComplete = (id: string) => {
        setProjects(entries.map((entry) => entry.id === id ? { ...entry, isDraft: false } : entry));
    };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary">
                            <FolderGit size={14} />
                            Section 6
                        </div>
                        <h2 className="text-xl font-bold text-text-primary">Projects</h2>
                        <p className="text-sm text-text-secondary mt-1">
                            Showcase your best engineering projects, GitHub repos, or side projects.
                        </p>
                    </div>
                    {!isEditorOpen && (
                        <Button onClick={openNewEditor} size="sm" className="gap-2 self-start sm:self-auto">
                            <Plus size={16} />
                            Add Project
                        </Button>
                    )}
                </div>

                {isEditorOpen && (
                    <form onSubmit={saveEntry} className="rounded-xl border border-primary/15 bg-gray-50/50 p-4 sm:p-5 space-y-4">
                        <div className="font-bold text-text-primary text-sm">
                            {editingId ? 'Edit Project Entry' : 'New Project Entry'}
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input
                                id="proj-name"
                                label="Project Name"
                                placeholder="e.g. CareerNoix Resume Builder"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                            <Input
                                id="proj-role"
                                label="Role / Contribution"
                                placeholder="e.g. Sole Developer, Lead Architect"
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                            />
                            <Input
                                id="proj-link"
                                label="Project Link / GitHub URL"
                                placeholder="e.g. https://github.com/..."
                                value={form.link}
                                onChange={(e) => setForm({ ...form, link: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    id="proj-start"
                                    label="Start date"
                                    type="month"
                                    value={form.startDate}
                                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                    required
                                />
                                <Input
                                    id="proj-end"
                                    label="End date"
                                    type="month"
                                    value={form.endDate}
                                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                    disabled={form.current}
                                />
                            </div>
                        </div>

                        <label className="flex w-fit items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-text-secondary">
                            <input
                                type="checkbox"
                                checked={form.current}
                                onChange={(e) => setForm({ ...form, current: e.target.checked, endDate: e.target.checked ? '' : form.endDate })}
                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            Ongoing Project
                        </label>

                        <div className="space-y-2">
                            <label htmlFor="proj-desc" className="text-sm font-semibold text-text-secondary">
                                Description (One point per line recommended)
                            </label>
                            <textarea
                                id="proj-desc"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Built standard responsive frontend layouts with Next.js...&#10;Integrated REST API services for live data matching..."
                                className="min-h-24 w-full resize-y rounded-xl border border-border bg-white px-4 py-3 text-sm leading-6 text-text-primary outline-none transition-all placeholder:text-text-placeholder hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary-light"
                                required
                            />
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
                        No projects listed yet. Click &quot;Add Project&quot; to showcase your work.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {entries.map((entry) => (
                            <div key={entry.id} className="flex justify-between items-start p-4 rounded-xl border border-border bg-surface hover:border-primary/20 transition-all">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                                        {entry.name}
                                        {entry.role && <span className="font-normal text-text-secondary text-sm"> - {entry.role}</span>}
                                        {entry.isDraft && (
                                            <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
                                                AI Draft
                                            </span>
                                        )}
                                    </h3>
                                    {entry.link && (
                                        <a href={entry.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                                            <Globe size={12} />
                                            View project
                                        </a>
                                    )}
                                    <div className="flex items-center gap-1.5 text-xs text-text-placeholder pt-1">
                                        <CalendarDays size={14} />
                                        {entry.startDate} - {entry.current ? 'Present' : entry.endDate}
                                    </div>
                                    {entry.description && (
                                        <ul className="list-disc pl-4 space-y-1 text-xs text-text-secondary leading-relaxed pt-2">
                                            {entry.description.split('\n').filter(Boolean).map((bullet, idx) => (
                                                <li key={idx}>{bullet.replace(/^[-•]\s*/, '').trim()}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    {entry.isDraft && (
                                        <button
                                            onClick={() => markAsComplete(entry.id)}
                                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                                            aria-label="Mark as complete"
                                            title="Mark as complete"
                                        >
                                            <Check size={16} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => editEntry(entry)}
                                        className="p-2 text-text-placeholder hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                                        aria-label="Edit project"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => deleteEntry(entry.id)}
                                        className="p-2 text-text-placeholder hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                                        aria-label="Delete project"
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
                <Button type="button" onClick={handleNext} className="gap-2">
                    Next
                    <ArrowRight size={16} />
                </Button>
            </div>
        </div>
    );
}
