import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, Check, X } from 'lucide-react';

interface Unit {
    id: number;
    name: string;
}

interface ActionPlanInput {
    description: string;
    unit_ids: string[]; // Changed to an array for multiple units
}

interface Props {
    units: Unit[];
    next_kpi_code: string;
    user_governance: string;
}

export default function UnitProposeKpi({
    units = [],
    next_kpi_code,
    user_governance,
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        kpi: '',
        innovative_action_plans: [
            { description: '', unit_ids: [] },
        ] as ActionPlanInput[],
    });

    const [openDropdownIdx, setOpenDropdownIdx] = useState<number | null>(null);

    const addActionPlan = () => {
        setData('innovative_action_plans', [
            ...data.innovative_action_plans,
            { description: '', unit_ids: [] },
        ]);
    };

    const removeActionPlan = (index: number) => {
        const updatedPlans = data.innovative_action_plans.filter(
            (_, i) => i !== index,
        );
        setData(
            'innovative_action_plans',
            updatedPlans.length > 0
                ? updatedPlans
                : [{ description: '', unit_ids: [] }],
        );
    };

    const handleActionPlanChange = (
        index: number,
        field: keyof ActionPlanInput,
        value: any,
    ) => {
        const updatedPlans = [...data.innovative_action_plans];
        updatedPlans[index][field] = value;
        setData('innovative_action_plans', updatedPlans);
    };

    // Toggle unit selection (adds or removes from array)
    const toggleUnitSelection = (planIdx: number, unitId: string) => {
        const currentSelected = data.innovative_action_plans[planIdx].unit_ids;
        let updatedSelected: string[];

        if (currentSelected.includes(unitId)) {
            updatedSelected = currentSelected.filter((id) => id !== unitId);
        } else {
            updatedSelected = [...currentSelected, unitId];
        }

        handleActionPlanChange(planIdx, 'unit_ids', updatedSelected);
    };

    const removeUnitTag = (
        planIdx: number,
        unitId: string,
        e: React.MouseEvent,
    ) => {
        e.stopPropagation(); // Prevents opening the dropdown when clicking the close tag
        const currentSelected = data.innovative_action_plans[planIdx].unit_ids;
        const updatedSelected = currentSelected.filter((id) => id !== unitId);
        handleActionPlanChange(planIdx, 'unit_ids', updatedSelected);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/my/propose-kpi', {
            onSuccess: () => {
                reset();
                alert('KPI Proposal submitted successfully!');
            },
        });
    };

    return (
        <>
            <Head title="Staff | Propose KPI" />
            <div className="mx-auto max-w-5xl p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Propose a New KPI
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Draft and submit a new Key Performance Indicator. System
                        details are handled automatically.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-lg border border-border bg-background shadow-sm">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="w-1/4 rounded-tl-lg border-b border-border p-4 font-semibold">
                                        KPI Metrics
                                    </th>
                                    <th className="rounded-tr-lg border-b border-border p-4 font-semibold">
                                        Proposed Input Specifications
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {/* Auto-Incremented KPI Code */}
                                <tr>
                                    <td className="bg-muted/10 p-4 align-middle font-medium">
                                        <label className="block">
                                            KPI Code
                                        </label>
                                        <span className="text-xs font-normal text-muted-foreground">
                                            System generated identifier
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <input
                                            type="text"
                                            disabled
                                            className="flex h-9 w-full cursor-not-allowed rounded-md border border-input bg-muted/30 px-3 py-1 text-sm font-semibold text-muted-foreground shadow-sm"
                                            value={next_kpi_code}
                                        />
                                    </td>
                                </tr>

                                {/* KPI Description */}
                                <tr>
                                    <td className="bg-muted/10 p-4 align-top font-medium">
                                        <label
                                            htmlFor="kpi"
                                            className="block pt-1"
                                        >
                                            Key Performance Indicator (KPI)
                                        </label>
                                        <span className="text-xs font-normal text-muted-foreground">
                                            Description of target metric
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <textarea
                                            id="kpi"
                                            rows={3}
                                            placeholder="Describe the performance metric..."
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                            value={data.kpi}
                                            onChange={(e) =>
                                                setData('kpi', e.target.value)
                                            }
                                        />
                                        {errors.kpi && (
                                            <p className="mt-1 text-xs font-medium text-destructive">
                                                {errors.kpi}
                                            </p>
                                        )}
                                    </td>
                                </tr>

                                {/* Dynamic Action Plans with Multi-Select Tags */}
                                <tr>
                                    <td className="bg-muted/10 p-4 align-top font-medium">
                                        <div>
                                            <label className="block">
                                                Innovative Action Plans
                                            </label>
                                            <span className="text-xs font-normal text-muted-foreground">
                                                Action items & their delegated
                                                units
                                            </span>
                                        </div>
                                    </td>
                                    <td className="relative space-y-4 overflow-visible p-4">
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={addActionPlan}
                                                className="inline-flex h-8 items-center justify-center gap-1 rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                                Add Action Plan
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {data.innovative_action_plans.map(
                                                (plan, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="relative flex items-start gap-4 overflow-visible rounded-lg border bg-muted/20 p-4"
                                                        >
                                                            <div className="grid flex-1 grid-cols-1 gap-3 overflow-visible md:grid-cols-2">
                                                                {/* Description */}
                                                                <div className="space-y-1">
                                                                    <label className="text-xs font-semibold text-muted-foreground">
                                                                        Action
                                                                        Plan
                                                                        Item #
                                                                        {index +
                                                                            1}
                                                                    </label>
                                                                    <textarea
                                                                        rows={2}
                                                                        placeholder="What innovative strategy will be used?"
                                                                        className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                                                        value={
                                                                            plan.description
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            handleActionPlanChange(
                                                                                index,
                                                                                'description',
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                    />
                                                                    {errors[
                                                                        `innovative_action_plans.${index}.description` as keyof typeof errors
                                                                    ] && (
                                                                        <p className="text-xs font-medium text-destructive">
                                                                            {
                                                                                errors[
                                                                                    `innovative_action_plans.${index}.description` as keyof typeof errors
                                                                                ]
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                {/* Multi-Select Combobox */}
                                                                <div className="relative space-y-1 overflow-visible">
                                                                    <label className="block text-xs font-semibold text-muted-foreground">
                                                                        Responsible
                                                                        Units
                                                                    </label>

                                                                    {/* Shadcn Select Display Trigger */}
                                                                    <div
                                                                        onClick={() =>
                                                                            setOpenDropdownIdx(
                                                                                openDropdownIdx ===
                                                                                    index
                                                                                    ? null
                                                                                    : index,
                                                                            )
                                                                        }
                                                                        className="flex min-h-[36px] w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-within:ring-1 focus-within:ring-ring hover:bg-accent/10"
                                                                    >
                                                                        {plan
                                                                            .unit_ids
                                                                            .length ===
                                                                        0 ? (
                                                                            <span className="text-sm text-muted-foreground">
                                                                                Select
                                                                                units...
                                                                            </span>
                                                                        ) : (
                                                                            /* Render Selected Units as Badges/Tags */
                                                                            <div className="flex max-w-[90%] flex-wrap gap-1">
                                                                                {plan.unit_ids.map(
                                                                                    (
                                                                                        id,
                                                                                    ) => {
                                                                                        const unitName =
                                                                                            units.find(
                                                                                                (
                                                                                                    u,
                                                                                                ) =>
                                                                                                    u.id.toString() ===
                                                                                                    id,
                                                                                            )
                                                                                                ?.name ||
                                                                                            id;
                                                                                        return (
                                                                                            <span
                                                                                                key={
                                                                                                    id
                                                                                                }
                                                                                                className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                                                                                            >
                                                                                                {
                                                                                                    unitName
                                                                                                }
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={(
                                                                                                        e,
                                                                                                    ) =>
                                                                                                        removeUnitTag(
                                                                                                            index,
                                                                                                            id,
                                                                                                            e,
                                                                                                        )
                                                                                                    }
                                                                                                    className="rounded-full p-0.5 outline-none hover:bg-muted"
                                                                                                >
                                                                                                    <X className="h-2.5 w-2.5" />
                                                                                                </button>
                                                                                            </span>
                                                                                        );
                                                                                    },
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                    </div>

                                                                    {/* Dropdown Menu Overlay & Option List */}
                                                                    {openDropdownIdx ===
                                                                        index && (
                                                                        <>
                                                                            <div
                                                                                className="fixed inset-0 z-40"
                                                                                onClick={() =>
                                                                                    setOpenDropdownIdx(
                                                                                        null,
                                                                                    )
                                                                                }
                                                                            />
                                                                            <div className="absolute left-0 z-50 mt-1 max-h-60 w-full animate-in overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md duration-100 fade-in-50">
                                                                                {units.map(
                                                                                    (
                                                                                        unit,
                                                                                    ) => {
                                                                                        const isSelected =
                                                                                            plan.unit_ids.includes(
                                                                                                unit.id.toString(),
                                                                                            );
                                                                                        return (
                                                                                            <button
                                                                                                key={
                                                                                                    unit.id
                                                                                                }
                                                                                                type="button"
                                                                                                onClick={() =>
                                                                                                    toggleUnitSelection(
                                                                                                        index,
                                                                                                        unit.id.toString(),
                                                                                                    )
                                                                                                }
                                                                                                className="relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-left text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground"
                                                                                            >
                                                                                                {isSelected && (
                                                                                                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                                                                                        <Check className="h-4 w-4" />
                                                                                                    </span>
                                                                                                )}
                                                                                                {
                                                                                                    unit.name
                                                                                                }
                                                                                            </button>
                                                                                        );
                                                                                    },
                                                                                )}
                                                                            </div>
                                                                        </>
                                                                    )}

                                                                    {errors[
                                                                        `innovative_action_plans.${index}.unit_ids` as keyof typeof errors
                                                                    ] && (
                                                                        <p className="text-xs font-medium text-destructive">
                                                                            {
                                                                                errors[
                                                                                    `innovative_action_plans.${index}.unit_ids` as keyof typeof errors
                                                                                ]
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeActionPlan(
                                                                        index,
                                                                    )
                                                                }
                                                                className="mt-6 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-destructive/20 bg-background text-destructive shadow-sm hover:bg-destructive hover:text-destructive-foreground"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </td>
                                </tr>

                                {/* Automatic Lead Unit Read-Out Row */}
                                <tr>
                                    <td className="rounded-bl-lg bg-muted/10 p-4 align-middle font-medium">
                                        <label className="block">
                                            Lead Responsible Unit
                                        </label>
                                        <span className="text-xs font-normal text-muted-foreground">
                                            Automatically bound parent entity
                                        </span>
                                    </td>
                                    <td className="rounded-br-lg p-4">
                                        <input
                                            type="text"
                                            disabled
                                            className="flex h-9 w-full cursor-not-allowed rounded-md border border-input bg-muted/30 px-3 py-1 text-sm font-semibold text-muted-foreground shadow-sm"
                                            value={user_governance}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Form actions */}
                    <div className="flex items-center justify-end gap-x-2">
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none"
                        >
                            {processing ? 'Submitting...' : 'Submit Proposal'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
