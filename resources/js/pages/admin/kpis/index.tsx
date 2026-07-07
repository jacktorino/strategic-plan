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
} from 'lucide-react';

type Props = {
    kras: any[];
    selectedAY: string;
};

// 🌟 Configured list of University of the Visayas offices/departments
const UNIVERSITY_UNITS = [
    'College of Information Technology',
    'College of Engineering & Architecture',
    'College of Management, Business & Accountancy',
    'College of Arts & Sciences',
    'College of Criminal Justice',
    'College of Education',
    'College of Nursing',
    'Graduate School',
    'Human Resource Department',
    "Registrar's Office",
    'Finance and Accounting Office',
    'Research and Development Unit',
    'Quality Assurance & Accreditation Office',
    'Student Affairs Office',
    'Community Extension Services Office',
];

export default function AdminKpis({ kras, selectedAY }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedKras, setExpandedKras] = useState<Record<number, boolean>>({
        1: true,
    });
    const [selectedKra, setSelectedKra] = useState<any>(null);

    // Custom Select Dropdown UI state variables
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

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
            responsible_unit: '',
            target_2027: '100%',
            target_2028: '100%',
            target_2029: '100%',
        });

    // Close custom selector on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsSelectOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAYChange = (year: string) => {
        router.get('/admin/kpis', { ay: year }, { preserveState: true });
    };

    const openCreateModal = (kra: any) => {
        setSelectedKra(kra);
        setData((prev) => ({ ...prev, kra_id: kra.id.toString() }));
        setIsOpen(true);
    };

    const closeCreateModal = () => {
        setIsOpen(false);
        setSelectedKra(null);
        setIsSelectOpen(false);
        setSearchQuery('');
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/kpis', {
            onSuccess: () => closeCreateModal(),
        });
    };

    // Filter units based on search input
    const filteredUnits = UNIVERSITY_UNITS.filter((unit) =>
        unit.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <>
            <Head title={`Admin | KPI Management (${selectedAY})`} />
            <div className="mx-auto max-w-7xl space-y-6 p-6">
                {/* Dashboard Action Header layout */}
                <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
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

                    {/* Academic Calendar Target Filter */}
                    <div className="flex items-center gap-2 self-start rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 shadow-inner sm:self-center">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <label
                            htmlFor="ay-select"
                            className="text-xs font-bold tracking-wide whitespace-nowrap text-gray-500 uppercase"
                        >
                            Academic Year:
                        </label>
                        <select
                            id="ay-select"
                            value={selectedAY}
                            onChange={(e) => handleAYChange(e.target.value)}
                            className="cursor-pointer border-none bg-transparent text-sm font-bold text-gray-800 focus:outline-none"
                        >
                            {academicYears.map((ay) => (
                                <option key={ay} value={ay}>
                                    AY {ay}{' '}
                                    {ay === '2026-2027'
                                        ? '(Active)'
                                        : ay < '2026-2027'
                                          ? '(Completed)'
                                          : '(Future)'}
                                </option>
                            ))}
                        </select>
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
                                                        Performance Measurement
                                                        Target Requirement
                                                    </th>
                                                    <th className="w-48 p-3">
                                                        Responsible Unit
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
                                                                <span className="inline-flex max-w-[180px] items-center gap-1 truncate rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                                                                    <Building2 className="h-3 w-3 shrink-0 text-gray-400" />
                                                                    {kpi.responsible_unit || (
                                                                        <span className="font-normal text-gray-400 italic">
                                                                            Unassigned
                                                                        </span>
                                                                    )}
                                                                </span>
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

                                {/* 🌟 SEARCHABLE SEARCH ENGINE SELECT COMPONENT */}
                                <div
                                    className="relative space-y-1"
                                    ref={dropdownRef}
                                >
                                    <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                                        Responsible Unit / Department
                                    </label>

                                    {/* Trigger Display Area box */}
                                    <div
                                        onClick={() =>
                                            setIsSelectOpen(!isSelectOpen)
                                        }
                                        className={`flex w-full cursor-pointer items-center justify-between rounded-lg border bg-white px-3 py-2.5 text-sm shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-500/20 ${
                                            errors.responsible_unit
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 text-gray-800">
                                            <Building2 className="h-4 w-4 text-gray-400" />
                                            <span
                                                className={
                                                    data.responsible_unit
                                                        ? 'font-medium'
                                                        : 'text-gray-400'
                                                }
                                            >
                                                {data.responsible_unit ||
                                                    'Select internal department area...'}
                                            </span>
                                        </div>
                                        <ChevronDown
                                            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isSelectOpen ? 'rotate-180 transform' : ''}`}
                                        />
                                    </div>

                                    {/* Animated Option Selector Dropdown Panel list item overlay */}
                                    {isSelectOpen && (
                                        <div className="absolute z-50 mt-1 flex max-h-60 w-full animate-in flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl duration-100 fade-in slide-in-from-top-1">
                                            {/* Nested Filter Searchbar */}
                                            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-3 py-2">
                                                <Search className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Filter departments..."
                                                    value={searchQuery}
                                                    onChange={(e) =>
                                                        setSearchQuery(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full border-none bg-transparent p-0 text-xs font-medium text-gray-700 focus:ring-0 focus:outline-none"
                                                />
                                                {searchQuery && (
                                                    <X
                                                        onClick={() =>
                                                            setSearchQuery('')
                                                        }
                                                        className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600"
                                                    />
                                                )}
                                            </div>

                                            {/* Listed elements stack */}
                                            <div className="flex-1 divide-y divide-gray-50 overflow-y-auto">
                                                {filteredUnits.length > 0 ? (
                                                    filteredUnits.map(
                                                        (unit) => {
                                                            const isSelected =
                                                                data.responsible_unit ===
                                                                unit;
                                                            return (
                                                                <div
                                                                    key={unit}
                                                                    onClick={() => {
                                                                        setData(
                                                                            'responsible_unit',
                                                                            unit,
                                                                        );
                                                                        setIsSelectOpen(
                                                                            false,
                                                                        );
                                                                        setSearchQuery(
                                                                            '',
                                                                        );
                                                                    }}
                                                                    className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-xs font-semibold transition-colors ${
                                                                        isSelected
                                                                            ? 'bg-green-50 text-green-700'
                                                                            : 'text-gray-700 hover:bg-gray-50'
                                                                    }`}
                                                                >
                                                                    <span>
                                                                        {unit}
                                                                    </span>
                                                                    {isSelected && (
                                                                        <Check className="h-3.5 w-3.5 stroke-[3] text-green-600" />
                                                                    )}
                                                                </div>
                                                            );
                                                        },
                                                    )
                                                ) : (
                                                    <div className="p-4 text-center text-xs font-medium text-gray-400 italic">
                                                        No units match search
                                                        filter terms.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {errors.responsible_unit && (
                                        <p className="mt-1 text-xs font-medium text-red-500">
                                            {errors.responsible_unit}
                                        </p>
                                    )}
                                </div>

                                {/* Target Year Horizons Row */}
                                <div className="grid grid-cols-3 gap-3 pt-2">
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="target_2027"
                                            className="text-[10px] font-bold tracking-wider text-gray-400 uppercase"
                                        >
                                            AY 2026-27
                                        </label>
                                        <input
                                            id="target_2027"
                                            type="text"
                                            value={data.target_2027}
                                            onChange={(e) =>
                                                setData(
                                                    'target_2027',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-center font-mono text-xs font-semibold focus:border-green-600 focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="target_2028"
                                            className="text-[10px] font-bold tracking-wider text-gray-400 uppercase"
                                        >
                                            AY 2027-28
                                        </label>
                                        <input
                                            id="target_2028"
                                            type="text"
                                            value={data.target_2028}
                                            onChange={(e) =>
                                                setData(
                                                    'target_2028',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-center font-mono text-xs font-semibold focus:border-green-600 focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="target_2029"
                                            className="text-[10px] font-bold tracking-wider text-gray-400 uppercase"
                                        >
                                            AY 2028-29
                                        </label>
                                        <input
                                            id="target_2029"
                                            type="text"
                                            value={data.target_2029}
                                            onChange={(e) =>
                                                setData(
                                                    'target_2029',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-center font-mono text-xs font-semibold focus:border-green-600 focus:outline-none"
                                        />
                                    </div>
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
