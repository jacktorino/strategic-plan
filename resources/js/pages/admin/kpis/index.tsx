import { useState, useRef, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Plus,
    Target,
    ChevronDown,
    ChevronUp,
    FolderPlus,
    X,
    Calendar,
    Building2,
    Check,
    Search,
    Lightbulb,
} from 'lucide-react';

type Props = {
    kras: any[];
    selectedAY: string;
};

// 🌟 Responsible units grouped by category, mirroring the University's
// organizational structure. Each Innovative Action Plan can be assigned to
// specific units within a group, OR to an entire group at once (e.g. "All
// Academic Units").
const RESPONSIBLE_UNIT_GROUPS: Record<string, string[]> = {
    'Academic Units': [
        'CAHS',
        'CAS',
        'CBA',
        'CCJE',
        'COED',
        'CETA',
        'COME',
        'GLS',
    ],
    'Academic Support': [
        'CPAD',
        'QMSO',
        'FMD',
        'ICTD',
        'FAD',
        'HRD',
        'CRI',
        'COMEX',
        'IAD',
        'SASC',
        'ARC',
        'ACD',
        'CIE',
        'DPIA',
        'IQA',
        'CPARC',
        'SRMD',
        'SSD',
        'CTESD',
    ],
    'Satellite Campuses': ['PARDO', 'MINGLANILLA', 'TOLEDO', 'DALAGUETE'],
};

const groupAllLabel = (group: string) => `All ${group}`;

type ActionPlanForm = {
    description: string;
    responsible_units: string[];
};

export default function AdminKpis({ kras, selectedAY }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedKras, setExpandedKras] = useState<Record<number, boolean>>({
        1: true,
    });
    const [selectedKra, setSelectedKra] = useState<any>(null);

    // 🌟 Custom "Select with Options" state for the Academic Year filter
    const [isAYSelectOpen, setIsAYSelectOpen] = useState(false);
    const ayDropdownRef = useRef<HTMLDivElement>(null);

    // 🌟 Per-action-plan Responsible Unit(s) multi-select dropdown state.
    // Only one row's dropdown is open at a time, tracked by its index.
    const [openUnitDropdownIndex, setOpenUnitDropdownIndex] = useState<
        number | null
    >(null);
    const [unitSearchQuery, setUnitSearchQuery] = useState('');
    const unitDropdownRefs = useRef<Record<number, HTMLDivElement | null>>({});

    const academicYears = [
        '2023-2024',
        '2024-2025',
        '2025-2026',
        '2026-2027',
        '2027-2028',
        '2028-2029',
    ];

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            kra_id: '',
            code: '',
            name: '',
            // 🌟 Each Innovative Action Plan carries its own responsible
            // unit(s) — a KPI can have multiple action plans, and each one
            // can be assigned to specific units or to an entire group.
            action_plans: [
                { description: '', responsible_units: [] },
            ] as ActionPlanForm[],
        });

    // Close custom selectors on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                ayDropdownRef.current &&
                !ayDropdownRef.current.contains(event.target as Node)
            ) {
                setIsAYSelectOpen(false);
            }
            if (
                openUnitDropdownIndex !== null &&
                unitDropdownRefs.current[openUnitDropdownIndex] &&
                !unitDropdownRefs.current[openUnitDropdownIndex]!.contains(
                    event.target as Node,
                )
            ) {
                setOpenUnitDropdownIndex(null);
                setUnitSearchQuery('');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [openUnitDropdownIndex]);

    const handleAYChange = (year: string) => {
        router.get('/admin/kpis', { ay: year }, { preserveState: true });
        setIsAYSelectOpen(false);
    };

    const getAYStatusLabel = (ay: string) => {
        if (ay === '2026-2027') return '(Active)';
        return ay < '2026-2027' ? '(Completed)' : '(Future)';
    };

    const openCreateModal = (kra: any) => {
        setSelectedKra(kra);
        setData((prev) => ({ ...prev, kra_id: kra.id.toString() }));
        setIsOpen(true);
    };

    const closeCreateModal = () => {
        setIsOpen(false);
        setSelectedKra(null);
        setOpenUnitDropdownIndex(null);
        setUnitSearchQuery('');
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/kpis', {
            onSuccess: () => closeCreateModal(),
        });
    };

    // 🌟 Innovative Action Plan list helpers (add / update / remove rows)
    const addActionPlan = () => {
        setData('action_plans', [
            ...data.action_plans,
            { description: '', responsible_units: [] },
        ]);
    };

    const updateActionPlanDescription = (index: number, value: string) => {
        const updated = [...data.action_plans];
        updated[index] = { ...updated[index], description: value };
        setData('action_plans', updated);
    };

    const removeActionPlan = (index: number) => {
        if (data.action_plans.length === 1) {
            // Always keep at least one row visible
            setData('action_plans', [
                { description: '', responsible_units: [] },
            ]);
            return;
        }
        setData(
            'action_plans',
            data.action_plans.filter((_, i) => i !== index),
        );
        setOpenUnitDropdownIndex(null);
    };

    // Toggle a single specific unit for a given action plan. Selecting a
    // specific unit clears that group's "All {Group}" marker, since the
    // assignment is no longer "the whole group".
    const toggleActionPlanUnit = (
        index: number,
        group: string,
        unit: string,
    ) => {
        const allLabel = groupAllLabel(group);
        const updated = [...data.action_plans];
        const current = updated[index].responsible_units;
        const next = current.includes(unit)
            ? current.filter((u) => u !== unit)
            : [...current.filter((u) => u !== allLabel), unit];
        updated[index] = { ...updated[index], responsible_units: next };
        setData('action_plans', updated);
    };

    // Toggle assigning an entire group ("All Academic Units", etc.) to a
    // given action plan. Selecting the whole group clears any individually
    // selected units from that same group.
    const toggleActionPlanGroup = (index: number, group: string) => {
        const allLabel = groupAllLabel(group);
        const groupUnits = RESPONSIBLE_UNIT_GROUPS[group];
        const updated = [...data.action_plans];
        const current = updated[index].responsible_units;
        const isAllSelected = current.includes(allLabel);
        const next = isAllSelected
            ? current.filter((u) => u !== allLabel)
            : [...current.filter((u) => !groupUnits.includes(u)), allLabel];
        updated[index] = { ...updated[index], responsible_units: next };
        setData('action_plans', updated);
    };

    // Filter the grouped unit list per the active search query
    const getFilteredGroups = () => {
        const query = unitSearchQuery.toLowerCase();
        if (!query) return RESPONSIBLE_UNIT_GROUPS;
        const filtered: Record<string, string[]> = {};
        Object.entries(RESPONSIBLE_UNIT_GROUPS).forEach(([group, units]) => {
            const groupMatches = group.toLowerCase().includes(query);
            const matchingUnits = units.filter((u) =>
                u.toLowerCase().includes(query),
            );
            if (groupMatches || matchingUnits.length > 0) {
                filtered[group] = groupMatches ? units : matchingUnits;
            }
        });
        return filtered;
    };

    return (
        <>
            <Head title={`Admin | KPI Management (${selectedAY})`} />
            <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
                {/* Dashboard Action Header layout */}
                <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900">
                            <Target className="h-6 w-6 text-green-600" />
                            KPI Management Dashboard
                        </h1>
                        <p className="text-sm text-gray-500">
                            Create strategic milestones and assign responsible
                            units across compliance cycles.
                        </p>
                    </div>

                    {/* Academic Calendar Target Filter — custom Select w/ Options */}
                    <div
                        className="relative self-start sm:self-center"
                        ref={ayDropdownRef}
                    >
                        <div
                            onClick={() => setIsAYSelectOpen(!isAYSelectOpen)}
                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 shadow-inner transition-colors hover:border-green-600/40"
                        >
                            <Calendar className="h-4 w-4 shrink-0 text-green-600" />
                            <span className="text-xs font-bold tracking-wide whitespace-nowrap text-gray-500 uppercase">
                                Academic Year:
                            </span>
                            <span className="text-sm font-bold whitespace-nowrap text-gray-800">
                                AY {selectedAY} {getAYStatusLabel(selectedAY)}
                            </span>
                            <ChevronDown
                                className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${isAYSelectOpen ? 'rotate-180 transform' : ''}`}
                            />
                        </div>

                        {/* Options panel */}
                        {isAYSelectOpen && (
                            <div className="absolute right-0 z-50 mt-1 flex w-56 animate-in flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl duration-100 fade-in slide-in-from-top-1">
                                {academicYears.map((ay) => {
                                    const isSelected = selectedAY === ay;
                                    return (
                                        <div
                                            key={ay}
                                            onClick={() => handleAYChange(ay)}
                                            className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-xs font-semibold transition-colors ${
                                                isSelected
                                                    ? 'bg-green-50 text-green-700'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span>
                                                AY {ay}{' '}
                                                <span className="font-normal text-gray-400">
                                                    {getAYStatusLabel(ay)}
                                                </span>
                                            </span>
                                            {isSelected && (
                                                <Check className="h-3.5 w-3.5 shrink-0 stroke-[3] text-green-600" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Collapsible Accordion Matrix List */}
                <div className="space-y-4">
                    {kras.map((kra) => {
                        const isExpanded = !!expandedKras[kra.id];
                        return (
                            <div
                                key={kra.id}
                                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200"
                            >
                                <div
                                    onClick={() =>
                                        setExpandedKras((prev) => ({
                                            ...prev,
                                            [kra.id]: !prev[kra.id],
                                        }))
                                    }
                                    className="flex cursor-pointer items-center justify-between bg-gray-50/70 p-4 select-none hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-3 pr-4">
                                        <span className="min-w-[65px] rounded-md bg-green-50 px-2.5 py-1 text-center font-mono text-sm font-black text-green-600 shadow-sm">
                                            {kra.code}
                                        </span>
                                        <h3 className="text-sm leading-snug font-bold text-gray-900 md:text-base">
                                            {kra.title}
                                        </h3>
                                    </div>
                                    <div
                                        className="ml-auto flex items-center gap-4"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={() => openCreateModal(kra)}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm transition-all hover:border-green-600 hover:text-green-600"
                                        >
                                            <Plus className="h-3.5 w-3.5 stroke-[3]" />
                                            Add KPI
                                        </button>
                                        <div
                                            onClick={() =>
                                                setExpandedKras((p) => ({
                                                    ...p,
                                                    [kra.id]: !p[kra.id],
                                                }))
                                            }
                                            className="p-1 text-gray-400"
                                        >
                                            {isExpanded ? (
                                                <ChevronUp className="h-5 w-5" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="overflow-x-auto border-t border-gray-200">
                                        <table className="w-full border-collapse text-left">
                                            <thead>
                                                <tr className="border-b border-gray-200 bg-gray-100/50 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                                                    <th className="w-20 p-3 pl-6">
                                                        Code
                                                    </th>
                                                    <th className="p-3">
                                                        KEY PERFORMANCE
                                                        INDICATOR
                                                    </th>
                                                    <th className="w-80 p-3">
                                                        Innovative Action Plan
                                                        &amp; Responsible
                                                        Unit(s)
                                                    </th>
                                                    <th className="w-36 p-3 text-center">
                                                        Monthly Progress (
                                                        {selectedAY})
                                                    </th>
                                                    <th className="w-32 p-3 text-center">
                                                        Annual Target
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 text-xs">
                                                {kra.kpis &&
                                                kra.kpis.length > 0 ? (
                                                    kra.kpis.map((kpi: any) => (
                                                        <tr
                                                            key={kpi.id}
                                                            className="transition-colors hover:bg-gray-50/40"
                                                        >
                                                            <td className="p-3 pl-6 font-mono font-bold whitespace-nowrap text-gray-600">
                                                                {kpi.code}
                                                            </td>
                                                            <td className="p-3">
                                                                <div className="mb-1 leading-relaxed font-medium text-gray-800">
                                                                    {kpi.name}
                                                                </div>
                                                                <div className="flex flex-wrap gap-1 text-[10px] font-normal text-gray-400">
                                                                    {kpi.submissions.map(
                                                                        (
                                                                            sub: any,
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    sub.id
                                                                                }
                                                                                className="py-0.2 rounded border bg-gray-50 px-1.5 font-mono text-gray-600 shadow-sm"
                                                                            >
                                                                                {sub.submission_month.substring(
                                                                                    0,
                                                                                    3,
                                                                                )}

                                                                                :{' '}
                                                                                <strong className="text-gray-900">
                                                                                    {
                                                                                        sub.compliance_percentage
                                                                                    }

                                                                                    %
                                                                                </strong>
                                                                            </span>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="p-3 align-middle">
                                                                {kpi.action_plans &&
                                                                kpi.action_plans
                                                                    .length >
                                                                    0 ? (
                                                                    <div className="space-y-2.5">
                                                                        {kpi.action_plans.map(
                                                                            (
                                                                                plan: any,
                                                                                idx: number,
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        plan.id ??
                                                                                        idx
                                                                                    }
                                                                                    className="space-y-1"
                                                                                >
                                                                                    <p className="text-[11px] leading-relaxed text-gray-700">
                                                                                        <span className="font-bold text-gray-400">
                                                                                            {idx +
                                                                                                1}

                                                                                            .
                                                                                        </span>{' '}
                                                                                        {
                                                                                            plan.description
                                                                                        }
                                                                                    </p>
                                                                                    <div className="flex flex-wrap gap-1 pl-3.5">
                                                                                        {plan.responsible_units &&
                                                                                        plan
                                                                                            .responsible_units
                                                                                            .length >
                                                                                            0 ? (
                                                                                            plan.responsible_units.map(
                                                                                                (
                                                                                                    unit: string,
                                                                                                ) => (
                                                                                                    <span
                                                                                                        key={
                                                                                                            unit
                                                                                                        }
                                                                                                        className="inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600"
                                                                                                    >
                                                                                                        <Building2 className="h-2.5 w-2.5 shrink-0 text-gray-400" />
                                                                                                        {
                                                                                                            unit
                                                                                                        }
                                                                                                    </span>
                                                                                                ),
                                                                                            )
                                                                                        ) : (
                                                                                            <span className="text-[10px] font-normal text-gray-400 italic">
                                                                                                Unassigned
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-[11px] font-normal text-gray-400 italic">
                                                                        No
                                                                        action
                                                                        plan
                                                                        submitted.
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="p-3 text-center align-middle">
                                                                <div className="flex flex-col items-center justify-center">
                                                                    <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-200 shadow-inner">
                                                                        <div
                                                                            className={`h-full rounded-full transition-all duration-300 ${kpi.average_compliance >= 90 ? 'bg-emerald-500' : kpi.average_compliance >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                                            style={{
                                                                                width: `${kpi.average_compliance}%`,
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <span className="mt-1 text-[10px] font-bold text-gray-600">
                                                                        {
                                                                            kpi.average_compliance
                                                                        }
                                                                        %
                                                                        Complied
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="bg-green-50/20 p-3 text-center align-middle font-mono font-bold text-green-600">
                                                                {
                                                                    kpi.active_target
                                                                }
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={5}
                                                            className="p-8 text-center text-gray-400 italic"
                                                        >
                                                            No operational
                                                            metrics assigned to
                                                            this specific
                                                            tracking timeframe.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Slide-over Creation Sheet Panel Layout */}
            {isOpen && selectedKra && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
                    <div className="relative flex h-full w-full max-w-md animate-in flex-col border-l border-gray-200 bg-white p-6 shadow-2xl duration-200 slide-in-from-right">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                            <h2 className="flex items-center gap-1.5 text-base font-bold text-gray-900">
                                <FolderPlus className="h-5 w-5 text-green-600" />
                                New KPI Target Strategy ({selectedKra.code})
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
                            className="flex flex-1 flex-col justify-between space-y-4 overflow-hidden pt-6"
                        >
                            <div className="flex-1 space-y-4 overflow-y-auto pr-1 pb-4">
                                <div className="rounded-lg border border-green-100 bg-green-50/50 p-3 text-xs leading-relaxed text-green-900">
                                    <strong className="mb-0.5 block font-bold">
                                        Objective Core Pillar Block:
                                    </strong>
                                    {selectedKra.title}
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="code"
                                        className="text-xs font-bold tracking-wider text-gray-500 uppercase"
                                    >
                                        KPI Code Reference
                                    </label>
                                    <input
                                        id="code"
                                        type="text"
                                        placeholder="e.g., 1.1.1"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData('code', e.target.value)
                                        }
                                        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-500/20 focus:outline-none ${
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

                                <div className="space-y-1">
                                    <label
                                        htmlFor="name"
                                        className="text-xs font-bold tracking-wider text-gray-500 uppercase"
                                    >
                                        Indicator Target Description
                                    </label>
                                    <textarea
                                        id="name"
                                        rows={3}
                                        placeholder="Outline structural performance evaluation requirements..."
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className={`w-full resize-none rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-500/20 focus:outline-none ${
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

                                {/* 🌟 Repeatable Innovative Action Plan rows.
                                     Each row has its own description AND its
                                     own Responsible Unit(s) multi-select —
                                     assignable to specific units, or to an
                                     entire group ("All Academic Units", "All
                                     Academic Support", "All Satellite
                                     Campuses"). Manual per-year (100%)
                                     targets are no longer entered here —
                                     compliance is computed from each
                                     responsible unit's submissions. */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-gray-500 uppercase">
                                            <Lightbulb className="h-3.5 w-3.5 text-green-600" />
                                            Innovative Action Plan
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addActionPlan}
                                            className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-[10px] font-bold text-gray-600 transition-colors hover:border-green-600 hover:text-green-600"
                                        >
                                            <Plus className="h-3 w-3 stroke-[3]" />
                                            Add Plan
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {data.action_plans.map(
                                            (plan, index) => {
                                                const isUnitDropdownOpen =
                                                    openUnitDropdownIndex ===
                                                    index;
                                                const filteredGroups =
                                                    isUnitDropdownOpen
                                                        ? getFilteredGroups()
                                                        : {};

                                                return (
                                                    <div
                                                        key={index}
                                                        className="space-y-2 rounded-lg border border-gray-200 bg-gray-50/40 p-3"
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <span className="mt-1.5 text-[10px] font-black text-gray-400">
                                                                #{index + 1}
                                                            </span>
                                                            <textarea
                                                                rows={2}
                                                                placeholder={`Action plan #${index + 1}...`}
                                                                value={
                                                                    plan.description
                                                                }
                                                                onChange={(e) =>
                                                                    updateActionPlanDescription(
                                                                        index,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className={`w-full resize-none rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-500/20 focus:outline-none ${
                                                                    (
                                                                        errors as any
                                                                    )[
                                                                        `action_plans.${index}.description`
                                                                    ]
                                                                        ? 'border-red-500 focus:ring-red-500/20'
                                                                        : 'border-gray-300'
                                                                }`}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeActionPlan(
                                                                        index,
                                                                    )
                                                                }
                                                                className="mt-1 shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                                                title="Remove this action plan"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </div>

                                                        {/* 🌟 Per-plan Responsible Unit(s) multi-select */}
                                                        <div
                                                            className="relative"
                                                            ref={(el) => {
                                                                unitDropdownRefs.current[
                                                                    index
                                                                ] = el;
                                                            }}
                                                        >
                                                            <div
                                                                onClick={() => {
                                                                    setOpenUnitDropdownIndex(
                                                                        isUnitDropdownOpen
                                                                            ? null
                                                                            : index,
                                                                    );
                                                                    setUnitSearchQuery(
                                                                        '',
                                                                    );
                                                                }}
                                                                className={`flex min-h-[38px] w-full cursor-pointer flex-wrap items-center gap-1 rounded-lg border bg-white px-2.5 py-1.5 text-xs shadow-sm ${
                                                                    (
                                                                        errors as any
                                                                    )[
                                                                        `action_plans.${index}.responsible_units`
                                                                    ]
                                                                        ? 'border-red-500'
                                                                        : 'border-gray-300'
                                                                }`}
                                                            >
                                                                <Building2 className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                                                                {plan
                                                                    .responsible_units
                                                                    .length ===
                                                                0 ? (
                                                                    <span className="text-gray-400">
                                                                        Assign
                                                                        responsible
                                                                        unit(s)...
                                                                    </span>
                                                                ) : (
                                                                    plan.responsible_units.map(
                                                                        (
                                                                            unit,
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    unit
                                                                                }
                                                                                className="inline-flex items-center gap-1 rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-bold text-green-700"
                                                                            >
                                                                                {
                                                                                    unit
                                                                                }
                                                                            </span>
                                                                        ),
                                                                    )
                                                                )}
                                                                <ChevronDown
                                                                    className={`ml-auto h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform duration-200 ${isUnitDropdownOpen ? 'rotate-180 transform' : ''}`}
                                                                />
                                                            </div>

                                                            {isUnitDropdownOpen && (
                                                                <div className="absolute z-50 mt-1 flex max-h-72 w-full animate-in flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl duration-100 fade-in slide-in-from-top-1">
                                                                    <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-3 py-2">
                                                                        <Search className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Filter units or groups..."
                                                                            value={
                                                                                unitSearchQuery
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setUnitSearchQuery(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                            className="w-full border-none bg-transparent p-0 text-xs font-medium text-gray-700 focus:ring-0 focus:outline-none"
                                                                        />
                                                                        {unitSearchQuery && (
                                                                            <X
                                                                                onClick={() =>
                                                                                    setUnitSearchQuery(
                                                                                        '',
                                                                                    )
                                                                                }
                                                                                className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600"
                                                                            />
                                                                        )}
                                                                    </div>

                                                                    <div className="flex-1 divide-y divide-gray-50 overflow-y-auto">
                                                                        {Object.keys(
                                                                            filteredGroups,
                                                                        )
                                                                            .length ===
                                                                        0 ? (
                                                                            <div className="p-4 text-center text-xs font-medium text-gray-400 italic">
                                                                                No
                                                                                units
                                                                                match
                                                                                search
                                                                                filter
                                                                                terms.
                                                                            </div>
                                                                        ) : (
                                                                            Object.entries(
                                                                                filteredGroups,
                                                                            ).map(
                                                                                ([
                                                                                    group,
                                                                                    units,
                                                                                ]) => {
                                                                                    const allLabel =
                                                                                        groupAllLabel(
                                                                                            group,
                                                                                        );
                                                                                    const isGroupSelected =
                                                                                        plan.responsible_units.includes(
                                                                                            allLabel,
                                                                                        );
                                                                                    return (
                                                                                        <div
                                                                                            key={
                                                                                                group
                                                                                            }
                                                                                        >
                                                                                            <div
                                                                                                onClick={() =>
                                                                                                    toggleActionPlanGroup(
                                                                                                        index,
                                                                                                        group,
                                                                                                    )
                                                                                                }
                                                                                                className={`flex cursor-pointer items-center justify-between px-4 py-2 text-[11px] font-black tracking-wide uppercase transition-colors ${
                                                                                                    isGroupSelected
                                                                                                        ? 'bg-green-50 text-green-700'
                                                                                                        : 'bg-gray-50/70 text-gray-500 hover:bg-gray-100'
                                                                                                }`}
                                                                                            >
                                                                                                <span>
                                                                                                    {
                                                                                                        allLabel
                                                                                                    }
                                                                                                </span>
                                                                                                {isGroupSelected && (
                                                                                                    <Check className="h-3.5 w-3.5 stroke-[3] text-green-600" />
                                                                                                )}
                                                                                            </div>
                                                                                            {units.map(
                                                                                                (
                                                                                                    unit,
                                                                                                ) => {
                                                                                                    const isSelected =
                                                                                                        plan.responsible_units.includes(
                                                                                                            unit,
                                                                                                        );
                                                                                                    return (
                                                                                                        <div
                                                                                                            key={
                                                                                                                unit
                                                                                                            }
                                                                                                            onClick={() =>
                                                                                                                toggleActionPlanUnit(
                                                                                                                    index,
                                                                                                                    group,
                                                                                                                    unit,
                                                                                                                )
                                                                                                            }
                                                                                                            className={`flex cursor-pointer items-center justify-between py-2 pr-4 pl-6 text-xs font-semibold transition-colors ${
                                                                                                                isSelected
                                                                                                                    ? 'bg-green-50/60 text-green-700'
                                                                                                                    : 'text-gray-700 hover:bg-gray-50'
                                                                                                            }`}
                                                                                                        >
                                                                                                            <span>
                                                                                                                {
                                                                                                                    unit
                                                                                                                }
                                                                                                            </span>
                                                                                                            {isSelected && (
                                                                                                                <Check className="h-3.5 w-3.5 stroke-[3] text-green-600" />
                                                                                                            )}
                                                                                                        </div>
                                                                                                    );
                                                                                                },
                                                                                            )}
                                                                                        </div>
                                                                                    );
                                                                                },
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {(errors as any)[
                                                            `action_plans.${index}.responsible_units`
                                                        ] && (
                                                            <p className="text-xs font-medium text-red-500">
                                                                {
                                                                    (
                                                                        errors as any
                                                                    )[
                                                                        `action_plans.${index}.responsible_units`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                    {(errors as any).action_plans && (
                                        <p className="text-xs font-medium text-red-500">
                                            {(errors as any).action_plans}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-white pt-4">
                                <button
                                    type="button"
                                    onClick={closeCreateModal}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-green-700 disabled:opacity-50"
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
