import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Plus, FolderPlus, Layers, FileText, X } from 'lucide-react';

type Kra = {
    id: number;
    code: string;
    title: string; // 🌟 Changed from name
    description: string | null;
};

type Props = {
    kras: Kra[];
};

export default function KraIndex({ kras }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    // Inertia Form Hook handles state, validation, and submission context natively
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            code: '',
            title: '',
            description: '',
        });

    const toggleModal = () => {
        if (isOpen) {
            reset();
            clearErrors();
        }
        setIsOpen(!isOpen);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/kras', {
            onSuccess: () => {
                toggleModal();
            },
        });
    };

    return (
        <>
            <Head title="Manage KRAs" />

            <div className="mx-auto max-w-7xl space-y-6 p-6">
                {/* Header Action Row */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <Layers className="h-6 w-6 text-green-600" />
                            Strategic Key Result Areas
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Configure macro institutional pillars for the
                            academic assessment lifecycle.
                        </p>
                    </div>
                    <button
                        onClick={toggleModal}
                        className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 sm:self-auto"
                    >
                        <Plus className="h-4 w-4" />
                        Create KRA
                    </button>
                </div>

                <hr className="border-border" />

                {/* Data Grid / Table Display */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-border bg-muted/40 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    <th className="w-24 p-4">Code</th>
                                    <th className="p-4">
                                        KRA Core Pillar Dimension
                                    </th>
                                    <th className="hidden p-4 md:table-cell">
                                        Scope Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border text-sm">
                                {kras.length > 0 ? (
                                    kras.map((kra) => (
                                        <tr
                                            key={kra.id}
                                            className="transition-colors hover:bg-muted/20"
                                        >
                                            <td className="p-4 font-mono font-bold whitespace-nowrap text-green-600">
                                                {kra.code}
                                            </td>
                                            <td className="p-4 font-medium text-foreground">
                                                {kra.title}{' '}
                                                {/* 🌟 Changed from kra.name */}
                                            </td>
                                            <td className="hidden max-w-sm truncate p-4 text-muted-foreground md:table-cell">
                                                {kra.description || (
                                                    <span className="text-muted-foreground/50 italic">
                                                        No operational context
                                                        configured.
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="p-8 text-center text-muted-foreground"
                                        >
                                            No Key Result Areas found. Click
                                            "Create KRA" to add your first
                                            pillar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Slide-over Sheet / Modal Overlay Component */}
            {isOpen && (
                <div className="animate-fade-in fixed inset-0 z-50 flex justify-end overflow-hidden bg-black/40 backdrop-blur-sm">
                    <div className="animate-slide-in relative flex h-full w-full max-w-md flex-col border-l border-border bg-background p-6 shadow-xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <h2 className="flex items-center gap-2 text-lg font-semibold">
                                <FolderPlus className="h-5 w-5 text-green-600" />
                                Add New KRA Target
                            </h2>
                            <button
                                onClick={toggleModal}
                                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Entry Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-1 flex-col justify-between space-y-4 pt-6"
                        >
                            <div className="space-y-4">
                                {/* KRA Code Field */}
                                <div className="space-y-1">
                                    <label
                                        htmlFor="code"
                                        className="text-xs font-semibold text-muted-foreground uppercase"
                                    >
                                        Identifier Code
                                    </label>
                                    <input
                                        id="code"
                                        type="text"
                                        placeholder="e.g., KRA 6"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData('code', e.target.value)
                                        }
                                        className={`w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-500/20 focus:outline-none ${
                                            errors.code
                                                ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                                                : 'border-input'
                                        }`}
                                    />
                                    {errors.code && (
                                        <p className="text-xs font-medium text-destructive">
                                            {errors.code}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="title"
                                        className="text-xs font-semibold text-muted-foreground uppercase"
                                    >
                                        Title Pillar Name
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        placeholder="e.g., Community Engagement Pillar"
                                        value={data.title} // 🌟 Changed from data.name
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        } // 🌟 Changed from 'name'
                                        className={`w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-500/20 focus:outline-none ${
                                            errors.title
                                                ? 'border-destructive'
                                                : 'border-input'
                                        }`}
                                    />
                                    {errors.title && (
                                        <p className="text-xs font-medium text-destructive">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* KRA Description Field */}
                                <div className="space-y-1">
                                    <label
                                        htmlFor="description"
                                        className="text-xs font-semibold text-muted-foreground uppercase"
                                    >
                                        Scope Description
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={4}
                                        placeholder="Outline structural objective parameters here..."
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Sticky Action Footer Panel */}
                            <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                                <button
                                    type="button"
                                    onClick={toggleModal}
                                    className="rounded-lg border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save KRA'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
