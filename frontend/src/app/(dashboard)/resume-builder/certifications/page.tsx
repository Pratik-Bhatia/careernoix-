'use client';

import { useState } from 'react';
import { useResumeStore, type CertificationEntry } from '@/store/useResumeStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Plus, Award, Edit3, Trash2, CalendarDays, Save, X } from 'lucide-react';

type CertificationForm = Omit<CertificationEntry, 'id'>;

const emptyForm: CertificationForm = {
    name: '',
    issuer: '',
    date: '',
    link: ''
};

export default function CertificationsPage() {
    const router = useRouter();
    const { resumeData, setCertifications } = useResumeStore();
    const entries = resumeData.certifications;

    const [form, setForm] = useState<CertificationForm>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isEditorOpen, setEditorOpen] = useState(false);

    const handleBack = () => {
        router.push('/resume-builder/projects');
    };

    const handleNext = () => {
        router.push('/resume-builder/achievements');
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

    const editEntry = (entry: CertificationEntry) => {
        const { id, ...entryForm } = entry;
        setForm(entryForm);
        setEditingId(id);
        setEditorOpen(true);
    };

    const saveEntry = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setCertifications(entries.map((entry) => entry.id === editingId ? { ...form, id: editingId } : entry));
        } else {
            setCertifications([{ ...form, id: `cert-${Date.now()}` }, ...entries]);
        }
        resetEditor();
    };

    const deleteEntry = (id: string) => {
        setCertifications(entries.filter((entry) => entry.id !== id));
        if (editingId === id) resetEditor();
    };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary">
                            <Award size={14} />
                            Section 7
                        </div>
                        <h2 className="text-xl font-bold text-text-primary">Certifications</h2>
                        <p className="text-sm text-text-secondary mt-1">
                            List professional credentials, online course certificates, or licenses.
                        </p>
                    </div>
                    {!isEditorOpen && (
                        <Button onClick={openNewEditor} size="sm" className="gap-2 self-start sm:self-auto">
                            <Plus size={16} />
                            Add Certification
                        </Button>
                    )}
                </div>

                {isEditorOpen && (
                    <form onSubmit={saveEntry} className="rounded-xl border border-primary/15 bg-gray-50/50 p-4 sm:p-5 space-y-4">
                        <div className="font-bold text-text-primary text-sm">
                            {editingId ? 'Edit Certification' : 'New Certification'}
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input
                                id="cert-name"
                                label="Certification Name"
                                placeholder="e.g. AWS Solutions Architect"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                            <Input
                                id="cert-issuer"
                                label="Issuing Organization"
                                placeholder="e.g. Amazon Web Services"
                                value={form.issuer}
                                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                                required
                            />
                            <Input
                                id="cert-date"
                                label="Issue Date"
                                type="month"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                required
                            />
                            <Input
                                id="cert-link"
                                label="Credential URL / Link"
                                placeholder="e.g. https://aws.amazon.com/..."
                                value={form.link}
                                onChange={(e) => setForm({ ...form, link: e.target.value })}
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
                        No certifications added yet. Click &quot;Add Certification&quot; to list your credentials.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {entries.map((entry) => (
                            <div key={entry.id} className="flex justify-between items-start p-4 rounded-xl border border-border bg-surface hover:border-primary/20 transition-all">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-text-primary text-base">
                                        {entry.name}
                                    </h3>
                                    <p className="text-sm text-text-secondary">{entry.issuer}</p>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-placeholder pt-1">
                                        <span className="flex items-center gap-1">
                                            <CalendarDays size={14} />
                                            Issued: {entry.date}
                                        </span>
                                        {entry.link && (
                                            <a href={entry.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                                                View Credential
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => editEntry(entry)}
                                        className="p-2 text-text-placeholder hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                                        aria-label="Edit certification"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => deleteEntry(entry.id)}
                                        className="p-2 text-text-placeholder hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                                        aria-label="Delete certification"
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
