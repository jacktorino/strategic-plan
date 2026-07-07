import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
    Plus,
    Target,
    ChevronDown,
    ChevronUp,
    FolderPlus,
    X,
    HelpCircle,
} from 'lucide-react';

type Kpi = {
    id: number;
    kra_id: number;
    code: string;
    name: string;
    target_2024: string;
    target_2025: string;
    target_2026: string;
};

type Kra = {
    id: number;
    code: string;
    title: string;
    description: string | null;
    kpis: Kpi[];
};

type Props = {
    kras: Kra[];
};

export default function AdminKpis({ kras }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedKras, setExpandedKras] = useState<Record<number, boolean>>({
        1: true,
    });
    const [selectedKra, setSelectedKra] = useState<Kra | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            kra_id: '',
            code: '',
            name: '',
            target_2024: '100%',
            target_2025: '100%',
            target_2026: '100%',
        });

    const toggleKraAccordion = (id: number) => {
        setExpandedKras((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const openCreateModal = (kra: Kra) => {
        setSelectedKra(kra);
        setData((prev) => ({ ...prev, kra_id: kra.id.toString() }));
        setIsOpen(true);
    };

    const closeCreateModal = () => {
        setIsOpen(false);
        setSelectedKra(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/kpis', {
            onSuccess: () => closeCreateModal(),
        });
    };

    return (
        <>
            <Head title="Admin | KPI Management" />
            <div className="mx-auto max-w-7xl space-y-6 p-6">
                <div>
                    <h1 className="mb-2 flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900">
                        <Target className="h-6 w-6 text-green-600" />
                        KPI Management Dashboard
                    </h1>
                    <p className="text-sm text-gray-500">
                        Create, modify, and assign target operational metrics
                        nested beneath institutional strategic pillars.
                    </p>
                </div>

                <hr className="border-gray-200" />

                {/* Main Accordion List */}
                <div className="space-y-4">
                    {kras && kras.length > 0 ? (
                        kras.map((kra) => {
                            const isExpanded = !!expandedKras[kra.id];
                            return (
                                <div
                                    key={kra.id}
                                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all"
                                >
                                    {/* Accordion Header row */}
                                    <div
                                        onClick={() =>
                                            toggleKraAccordion(kra.id)
                                        }
                                        className="flex cursor-pointer items-center justify-between border-b border-gray-200 bg-gray-50/70 p-4 select-none hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3 pr-4">
                                            <span className="min-w-[70px] rounded-md bg-green-50 px-2.5 py-1 text-center font-mono text-sm font-black text-green-600">
                                                {kra.code}
                                            </span>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 md:text-base">
                                                    {kra.title}
                                                </h3>
                                                {kra.description && (
                                                    <p className="line-clamp-1 text-xs font-normal text-gray-400">
                                                        {kra.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div
                                            className="ml-auto flex items-center gap-4"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={() =>
                                                    openCreateModal(kra)
                                                }
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm transition-colors hover:border-green-600 hover:text-green-600"
                                            >
                                                <Plus className="h-3.5 w-3.5 stroke-[3]" />
                                                Add KPI
                                            </button>
                                            <div
                                                onClick={() =>
                                                    toggleKraAccordion(kra.id)
                                                }
                                                className="cursor-pointer p-1 text-gray-400 hover:text-gray-600"
                                            >
                                                {isExpanded ? (
                                                    <ChevronUp className="h-5 w-5" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Accordion Content Table */}
                                    {isExpanded && (
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse text-left">
                                                <thead>
                                                    <tr className="border-b border-gray-200 bg-gray-100/50 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                                                        <th className="w-20 p-3 pl-6">
                                                            Code
                                                        </th>
                                                        <th className="p-3">
                                                            Performance
                                                            Measurement Target
                                                            Requirement
                                                        </th>
                                                        <th className="w-24 p-3 text-center">
                                                            AY 2023-24
                                                        </th>
                                                        <th className="w-24 p-3 text-center">
                                                            AY 2024-25
                                                        </th>
                                                        <th className="w-24 p-3 text-center">
                                                            AY 2025-26
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 text-xs">
                                                    {kra.kpis &&
                                                    kra.kpis.length > 0 ? (
                                                        kra.kpis.map((kpi) => (
                                                            <tr
                                                                key={kpi.id}
                                                                className="transition-colors hover:bg-gray-50/40"
                                                            >
                                                                <td className="p-3 pl-6 font-mono font-bold whitespace-nowrap text-gray-600">
                                                                    {kpi.code}
                                                                </td>
                                                                <td className="p-3 leading-relaxed font-medium text-gray-800">
                                                                    {kpi.name}
                                                                </td>
                                                                <td className="p-3 text-center whitespace-nowrap">
                                                                    <span className="rounded bg-gray-100 px-2 py-0.5 font-semibold text-gray-700">
                                                                        {
                                                                            kpi.target_2024
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td className="p-3 text-center whitespace-nowrap">
                                                                    <span className="rounded bg-gray-100 px-2 py-0.5 font-semibold text-gray-700">
                                                                        {
                                                                            kpi.target_2025
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td className="p-3 text-center whitespace-nowrap">
                                                                    <span className="rounded bg-green-50 px-2 py-0.5 font-bold text-green-700">
                                                                        {
                                                                            kpi.target_2026
                                                                        }
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan={5}
                                                                className="p-6 text-center font-normal text-gray-400 italic"
                                                            >
                                                                No Key
                                                                Performance
                                                                Indicators
                                                                assigned to this
                                                                pillar yet.
                                                                Click "Add KPI"
                                                                to set
                                                                objectives.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
                            No strategic KRAs configured. Please build out core
                            performance pillars before assigning targets.
                        </div>
                    )}
                </div>
            </div>

            {/* Slide-over Right Sheet Modal Container */}
            {isOpen && selectedKra && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
                    <div className="relative flex h-full w-full max-w-md animate-in flex-col border-l border-gray-200 bg-white p-6 shadow-2xl duration-200 slide-in-from-right">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                            <h2 className="flex items-center gap-1.5 text-base font-bold text-gray-900">
                                <FolderPlus className="h-5 w-5 text-green-600" />
                                Add KPI Target to {selectedKra.code}
                            </h2>
                            <button
                                onClick={closeCreateModal}
                                className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-1 flex-col justify-between space-y-4 pt-6"
                        >
                            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                                {/* Auto-Selected Context Summary Callout */}
                                <div className="rounded-lg border border-green-100 bg-green-50/50 p-3 text-xs text-green-900">
                                    <strong className="mb-0.5 block font-bold">
                                        Objective Pillar:
                                    </strong>
                                    {selectedKra.title}
                                </div>

                                {/* KPI Code Input */}
                                <div className="space-y-1">
                                    <label
                                        htmlFor="code"
                                        className="text-xs font-bold tracking-wider text-gray-500 uppercase"
                                    >
                                        KPI Target Code
                                    </label>
                                    <input
                                        id="code"
                                        type="text"
                                        placeholder="e.g., 1.1.1 or 2.1.4"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData('code', e.target.value)
                                        }
                                        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-500/20 focus:outline-none ${
                                            errors.code
                                                ? 'border-red-500 focus:ring-red-500/20'
                                                : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.code && (
                                        <p className="text-xs font-medium text-red-500">
                                            {errors.code}
                                        </p>
                                    )}
                                </div>

                                {/* KPI Core Objective Statement */}
                                <div className="space-y-1">
                                    <label
                                        htmlFor="name"
                                        className="text-xs font-bold tracking-wider text-gray-500 uppercase"
                                    >
                                        Indicator Requirement Description
                                    </label>
                                    <textarea
                                        id="name"
                                        rows={3}
                                        placeholder="Outline specific measurement parameters..."
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className={`w-full resize-none rounded-lg border bg-white px-3 py-2 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-500/20 focus:outline-none ${
                                            errors.name
                                                ? 'border-red-500 focus:ring-red-500/20'
                                                : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.name && (
                                        <p className="text-xs font-medium text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Target Projections Row Grid Split */}
                                <div className="grid grid-cols-3 gap-3 pt-2">
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="target_2024"
                                            className="text-[10px] font-bold tracking-wider text-gray-400 uppercase"
                                        >
                                            AY 2023-24
                                        </label>
                                        <input
                                            id="target_2024"
                                            type="text"
                                            value={data.target_2024}
                                            onChange={(e) =>
                                                setData(
                                                    'target_2024',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-center font-mono text-xs font-semibold focus:border-green-600 focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="target_2025"
                                            className="text-[10px] font-bold tracking-wider text-gray-400 uppercase"
                                        >
                                            AY 2024-25
                                        </label>
                                        <input
                                            id="target_2025"
                                            type="text"
                                            value={data.target_2025}
                                            onChange={(e) =>
                                                setData(
                                                    'target_2025',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-center font-mono text-xs font-semibold focus:border-green-600 focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="target_2026"
                                            className="text-[10px] font-bold tracking-wider text-gray-400 uppercase"
                                        >
                                            AY 2025-26
                                        </label>
                                        <input
                                            id="target_2026"
                                            type="text"
                                            value={data.target_2026}
                                            onChange={(e) =>
                                                setData(
                                                    'target_2026',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-center font-mono text-xs font-semibold focus:border-green-600 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
                                <button
                                    type="button"
                                    onClick={closeCreateModal}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Saving Indicators...'
                                        : 'Save KPI Metric'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
