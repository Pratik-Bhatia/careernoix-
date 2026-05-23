'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowDown,
    ArrowUp,
    BriefcaseBusiness,
    CalendarDays,
    Check,
    Clock3,
    Edit3,
    MapPin,
    Plus,
    Save,
    Sparkles,
    Trash2,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

type ExperienceEntry = {
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
};

type ExperienceForm = Omit<ExperienceEntry, 'id'>;

const STORAGE_KEY = 'careeronix_experience_entries';

const emptyForm: ExperienceForm = {
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
};

const starterEntries: ExperienceEntry[] = [
    {
        id: 'exp-1',
        title: 'Data Analyst Intern',
        company: 'BrightPath Analytics',
        location: 'Bengaluru, India',
        startDate: '2025-01',
        endDate: '2025-06',
        current: false,
        description:
            'Built weekly reporting dashboards for marketing and sales teams.\nCleaned customer datasets and reduced duplicate records.\nPresented funnel insights that helped improve campaign targeting.'
    },
    {
        id: 'exp-2',
        title: 'Student Project Lead',
        company: 'Campus Innovation Lab',
        location: 'Remote',
        startDate: '2024-07',
        endDate: '',
        current: true,
        description:
            'Led a 4-member team building a resume analysis tool.\nCoordinated sprint planning, UI reviews, and project demos.\nImproved project delivery speed by creating reusable task templates.'
    }
];

function readStoredEntries() {
    if (typeof window === 'undefined') {
        return starterEntries;
    }

    try {
        const storedEntries = window.localStorage.getItem(STORAGE_KEY);
        return storedEntries ? JSON.parse(storedEntries) as ExperienceEntry[] : starterEntries;
    } catch {
        return starterEntries;
    }
}

function formatDateRange(entry: ExperienceEntry) {
    const start = entry.startDate || 'Start date';
    const end = entry.current ? 'Present' : entry.endDate || 'End date';
    return `${start} - ${end}`;
}

function descriptionToBullets(description: string) {
    return description
        .split('\n')
        .map((line) => line.replace(/^[-•]\s*/, '').trim())
        .filter(Boolean);
}

export default function ExperiencePage() {
    const router = useRouter();
    const token = useStore((state) => state.token);
    const [entries, setEntries] = useState<ExperienceEntry[]>(readStoredEntries);
    const [form, setForm] = useState<ExperienceForm>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isEditorOpen, setEditorOpen] = useState(false);
    const [isImproving, setImproving] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }
    }, [router, token]);

    const persistEntries = (nextEntries: ExperienceEntry[]) => {
        setEntries(nextEntries);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEntries));
        setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    const completedFields = useMemo(() => {
        const fields = [form.title, form.company, form.location, form.startDate, form.description];
        return fields.filter((field) => field.trim().length > 0).length;
    }, [form]);

    const completion = Math.round((completedFields / 5) * 100);
    const activeEntry = entries.find((entry) => entry.id === editingId);

    const resetEditor = () => {
        setForm(emptyForm);
        setEditingId(null);
        setEditorOpen(false);
        setImproving(false);
    };

    const openNewEditor = () => {
        setForm(emptyForm);
        setEditingId(null);
        setEditorOpen(true);
    };

    const editEntry = (entry: ExperienceEntry) => {
        const { id, ...entryForm } = entry;
        setForm(entryForm);
        setEditingId(id);
        setEditorOpen(true);
    };

    const saveEntry = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (editingId) {
            persistEntries(entries.map((entry) => entry.id === editingId ? { ...form, id: editingId } : entry));
        } else {
            persistEntries([{ ...form, id: `exp-${Date.now()}` }, ...entries]);
        }

        resetEditor();
    };

    const deleteEntry = (id: string) => {
        persistEntries(entries.filter((entry) => entry.id !== id));
        if (editingId === id) {
            resetEditor();
        }
    };

    const moveEntry = (id: string, direction: 'up' | 'down') => {
        const index = entries.findIndex((entry) => entry.id === id);
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (index < 0 || targetIndex < 0 || targetIndex >= entries.length) {
            return;
        }

        const reorderedEntries = [...entries];
        const [movedEntry] = reorderedEntries.splice(index, 1);
        reorderedEntries.splice(targetIndex, 0, movedEntry);
        persistEntries(reorderedEntries);
    };

    const improveDescription = () => {
        if (!form.description.trim()) {
            return;
        }

        setImproving(true);
        window.setTimeout(() => {
            const improved = descriptionToBullets(form.description)
                .map((line) => {
                    const trimmed = line.replace(/\.$/, '');
                    return trimmed.match(/^(Led|Built|Created|Improved|Reduced|Analyzed|Presented|Coordinated)/i)
                        ? `${trimmed}.`
                        : `Delivered ${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}.`;
                })
                .join('\n');

            setForm((currentForm) => ({ ...currentForm, description: improved }));
            setImproving(false);
        }, 650);
    };

    return (
        <div className="space-y-6 pb-10">
            <section className="overflow-hidden rounded-2xl border border-white/70 bg-white shadow-sm">
                <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-3xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary-light px-3 py-1 text-sm font-semibold text-primary">
                            <BriefcaseBusiness className="h-4 w-4" />
                            Resume Builder
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                            Experience
                        </h1>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-text-secondary">
                            Shape your work history into focused, outcome-driven entries that are easy for recruiters and ATS systems to scan.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                        <div className="rounded-xl border border-border bg-gray-50 px-4 py-3 text-sm text-text-secondary">
                            <div className="flex items-center gap-2 font-medium text-text-primary">
                                <Clock3 className="h-4 w-4 text-primary" />
                                {lastSaved ? `Saved ${lastSaved}` : 'Ready to edit'}
                            </div>
                        </div>
                        <Button onClick={openNewEditor} size="md" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Experience
                        </Button>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
                <section className="space-y-5">
                    {isEditorOpen && (
                        <form onSubmit={saveEntry} className="rounded-2xl border border-primary/15 bg-white p-5 shadow-lg shadow-primary/5 sm:p-6">
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                                        {editingId ? 'Editing entry' : 'New entry'}
                                    </p>
                                    <h2 className="mt-1 text-xl font-bold text-text-primary">
                                        {activeEntry?.title || 'Add work experience'}
                                    </h2>
                                </div>
                                <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                                    <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${completion}%` }} />
                                    </div>
                                    <span className="text-sm font-semibold text-text-secondary">{completion}%</span>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Input
                                    id="experience-title"
                                    label="Job title"
                                    placeholder="Data Analyst"
                                    value={form.title}
                                    onChange={(event) => setForm({ ...form, title: event.target.value })}
                                    required
                                />
                                <Input
                                    id="experience-company"
                                    label="Company"
                                    placeholder="Company name"
                                    value={form.company}
                                    onChange={(event) => setForm({ ...form, company: event.target.value })}
                                    required
                                />
                                <Input
                                    id="experience-location"
                                    label="Location"
                                    placeholder="City, Country or Remote"
                                    value={form.location}
                                    onChange={(event) => setForm({ ...form, location: event.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        id="experience-start"
                                        label="Start"
                                        type="month"
                                        value={form.startDate}
                                        onChange={(event) => setForm({ ...form, startDate: event.target.value })}
                                        required
                                    />
                                    <Input
                                        id="experience-end"
                                        label="End"
                                        type="month"
                                        value={form.endDate}
                                        onChange={(event) => setForm({ ...form, endDate: event.target.value })}
                                        disabled={form.current}
                                    />
                                </div>
                            </div>

                            <label className="mt-4 flex w-fit items-center gap-3 rounded-xl border border-border bg-gray-50 px-4 py-3 text-sm font-medium text-text-secondary">
                                <input
                                    type="checkbox"
                                    checked={form.current}
                                    onChange={(event) => setForm({ ...form, current: event.target.checked, endDate: event.target.checked ? '' : form.endDate })}
                                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                />
                                I currently work here
                            </label>

                            <div className="mt-5 space-y-2">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <label htmlFor="experience-description" className="text-sm font-semibold text-text-secondary">
                                        Description
                                    </label>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={improveDescription}
                                        disabled={!form.description.trim()}
                                        isLoading={isImproving}
                                        className="gap-2"
                                    >
                                        <Sparkles className="h-4 w-4" />
                                        Improve wording
                                    </Button>
                                </div>
                                <textarea
                                    id="experience-description"
                                    value={form.description}
                                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                                    placeholder="Add one achievement per line. Start with action verbs and include numbers where possible."
                                    className="min-h-40 w-full resize-y rounded-xl border border-border bg-white px-4 py-3 text-sm leading-6 text-text-primary outline-none transition-all placeholder:text-text-placeholder hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary-light"
                                    required
                                />
                            </div>

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <Button type="button" variant="secondary" onClick={resetEditor} className="gap-2">
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button type="submit" className="gap-2">
                                    <Save className="h-4 w-4" />
                                    Save Experience
                                </Button>
                            </div>
                        </form>
                    )}

                    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-text-primary">Saved experiences</h2>
                                <p className="mt-1 text-sm text-text-secondary">
                                    {entries.length ? `${entries.length} entries in resume order` : 'Add your first role to start building this section'}
                                </p>
                            </div>
                            {!isEditorOpen && entries.length > 0 && (
                                <Button variant="secondary" size="sm" onClick={openNewEditor} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    New entry
                                </Button>
                            )}
                        </div>

                        {entries.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-border bg-gray-50 px-6 py-12 text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                                    <BriefcaseBusiness className="h-7 w-7" />
                                </div>
                                <h3 className="text-lg font-bold text-text-primary">No experience added yet</h3>
                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
                                    Add internships, freelance work, academic projects, or full-time roles. You can refine bullets after saving.
                                </p>
                                <Button onClick={openNewEditor} className="mt-6 gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Experience
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {entries.map((entry, index) => (
                                    <article
                                        key={entry.id}
                                        className="group rounded-xl border border-border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md sm:p-5"
                                    >
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-lg font-bold text-text-primary">{entry.title}</h3>
                                                    {entry.current && (
                                                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                                            Current
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 font-medium text-text-secondary">{entry.company}</p>
                                                <div className="mt-3 flex flex-wrap gap-3 text-sm text-text-secondary">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <CalendarDays className="h-4 w-4 text-primary" />
                                                        {formatDateRange(entry)}
                                                    </span>
                                                    {entry.location && (
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <MapPin className="h-4 w-4 text-primary" />
                                                            {entry.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 self-start rounded-xl border border-border bg-gray-50 p-1">
                                                <button
                                                    type="button"
                                                    onClick={() => moveEntry(entry.id, 'up')}
                                                    disabled={index === 0}
                                                    aria-label="Move experience up"
                                                    className="rounded-lg p-2 text-text-secondary transition hover:bg-white hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    <ArrowUp className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveEntry(entry.id, 'down')}
                                                    disabled={index === entries.length - 1}
                                                    aria-label="Move experience down"
                                                    className="rounded-lg p-2 text-text-secondary transition hover:bg-white hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    <ArrowDown className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => editEntry(entry)}
                                                    aria-label="Edit experience"
                                                    className="rounded-lg p-2 text-text-secondary transition hover:bg-white hover:text-primary"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteEntry(entry.id)}
                                                    aria-label="Delete experience"
                                                    className="rounded-lg p-2 text-text-secondary transition hover:bg-white hover:text-error"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <ul className="mt-4 space-y-2 border-t border-border/70 pt-4">
                                            {descriptionToBullets(entry.description).slice(0, 3).map((bullet) => (
                                                <li key={bullet} className="flex gap-2 text-sm leading-6 text-text-secondary">
                                                    <Check className="mt-1 h-4 w-4 shrink-0 text-green-600" />
                                                    <span>{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <aside className="space-y-5">
                    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-text-primary">Section quality</h2>
                                <p className="mt-1 text-sm text-text-secondary">Live guidance for stronger entries</p>
                            </div>
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-light text-lg font-bold text-primary">
                                {entries.length ? Math.min(98, 68 + entries.length * 8) : 0}
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            {[
                                ['Use action verbs', entries.length > 0],
                                ['Add measurable impact', entries.some((entry) => /\d/.test(entry.description))],
                                ['Keep bullets scannable', entries.every((entry) => descriptionToBullets(entry.description).length > 0)],
                                ['List newest roles first', entries.length > 1]
                            ].map(([label, done]) => (
                                <div key={label as string} className="flex items-center gap-3">
                                    <span className={cn(
                                        'flex h-7 w-7 items-center justify-center rounded-full',
                                        done ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-text-placeholder'
                                    )}>
                                        <Check className="h-4 w-4" />
                                    </span>
                                    <span className="text-sm font-medium text-text-secondary">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
                        <h2 className="text-lg font-bold text-text-primary">Resume preview</h2>
                        <p className="mt-1 text-sm text-text-secondary">A compact view of how this section reads.</p>

                        <div className="mt-5 rounded-xl border border-border bg-gray-50 p-5">
                            <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-primary">Experience</h3>
                                <span className="text-xs font-medium text-text-placeholder">{entries.length} roles</span>
                            </div>

                            {entries.length === 0 ? (
                                <div className="py-8 text-center text-sm text-text-secondary">
                                    Saved entries will appear here.
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {entries.slice(0, 3).map((entry) => (
                                        <div key={entry.id}>
                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <p className="text-sm font-bold text-text-primary">{entry.title}</p>
                                                    <p className="text-xs text-text-secondary">{entry.company}</p>
                                                </div>
                                                <p className="text-xs font-medium text-text-secondary">{formatDateRange(entry)}</p>
                                            </div>
                                            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-5 text-text-secondary">
                                                {descriptionToBullets(entry.description).slice(0, 2).map((bullet) => (
                                                    <li key={bullet}>{bullet}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-primary/10 bg-primary-light p-5 text-primary shadow-sm sm:p-6">
                        <div className="flex items-start gap-3">
                            <Sparkles className="mt-1 h-5 w-5 shrink-0" />
                            <div>
                                <h2 className="font-bold">Premium tip</h2>
                                <p className="mt-2 text-sm leading-6 text-primary/80">
                                    Recruiters skim this section first. Lead with measurable outcomes, then add tools and context only when they support the result.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
