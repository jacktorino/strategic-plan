import { useEffect, useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Building2,
    Check,
    Loader2,
    Send,
    Target,
    CalendarDays,
} from 'lucide-react';
import axios from 'axios';

import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// ---------------------------------------------------------------------------
// Types — mirror UnitKpiController::index()'s Inertia props exactly.
// ---------------------------------------------------------------------------
type Submission = {
    id: number;
    action_plan_id: number | null;
    submission_month: string;
    compliance_percentage: number;
    unit_code: string | null;
};

type ActionPlan = {
    id: number;
    description: string;
    responsible_units: string[];
};

type Kpi = {
    id: number;
    code: string;
    name: string;
    action_plans: ActionPlan[];
    submissions: Submission[];
    average_compliance: number;
    active_target: string;
};

interface Kra {
    id: number;
    code: string;
    title: string; // Will now hold "Governance and Leadership" (KRA 1 Title)
    sub_area_code: string; // Will hold "1.1"
    sub_area_title: string; // Will hold "Governance"
    kpis: any[];
}

interface Props {
    kras: Kra[];
    selectedAY: string;
    unitCode: string;
}

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

function generateAcademicYearOptions(selectedAY: string): string[] {
    const currentStart =
        Number(selectedAY.split('-')[0]) || new Date().getFullYear();
    const years: string[] = [];
    for (let y = currentStart + 1; y >= currentStart - 3; y--) {
        years.push(`${y}-${y + 1}`);
    }
    return years;
}

// Each editable row (one per action plan, or one per KPI when it has no
// action plans) gets its own cell — a KPI is no longer a single rowSpan
// input, since different action plans under the same KPI can report
// different percentages.
type RowKey = string;

// The month is no longer per-row — every entry is submitted for whichever
// month is selected in the header ("Month" select), so a row only needs to
// track its own percentage.
type MonthlyEntry = {
    kpiId: number;
    planId: number | null;
    compliance_percentage: number | '';
};

function rowKeyFor(kpiId: number, planId: number | null): RowKey {
    return planId === null ? `kpi-${kpiId}` : `plan-${planId}`;
}

// The submission already in the database for this row + the currently
// selected month, if any — this is what lets the input show what was
// already submitted instead of always starting blank.
function existingSubmissionFor(
    kpi: Kpi,
    planId: number | null,
    month: string,
): Submission | undefined {
    return kpi.submissions.find(
        (s) => s.action_plan_id === planId && s.submission_month === month,
    );
}

function UnitBadges({ units }: { units: string[] }) {
    if (units.length === 0) {
        return <span className="text-sm text-muted-foreground">—</span>;
    }
    return (
        <div className="flex flex-wrap items-center gap-1">
            <Building2 className="h-3 w-3 text-muted-foreground" />
            {units.map((code) => (
                <Badge key={code} variant="outline" className="text-[10px]">
                    {code}
                </Badge>
            ))}
        </div>
    );
}

function KpiHeaderCell({ kpi }: { kpi: Kpi }) {
    return (
        <div className="space-y-1.5">
            <p className="font-mono text-xs text-muted-foreground">
                {kpi.code}
            </p>
            <p className="text-sm leading-relaxed font-medium">{kpi.name}</p>
        </div>
    );
}

function postSubmission(
    kpiId: number,
    body: {
        academic_year: string;
        submission_month: string;
        compliance_percentage: number;
        action_plan_id: number | null;
    },
): Promise<void> {
    return new Promise((resolve, reject) => {
        router.post(`/my/kpis/${kpiId}`, body, {
            preserveScroll: true,
            onSuccess: () => resolve(),
            onError: (errors) => reject(errors as Record<string, string>),
        });
    });
}

export default function UnitKpis({
    kras,
    selectedAY,
    unitCode,
    academicYears,
}: Props) {
    const [entries, setEntries] = useState<Record<RowKey, MonthlyEntry>>({});
    const [errorsByRow, setErrorsByRow] = useState<
        Record<RowKey, string | undefined>
    >({});
    const [submittingAll, setSubmittingAll] = useState(false);

    // The single month every row in the table submits for — set in the
    // header. Rows no longer carry their own month, so this is the only
    // source of truth at submit time.
    const [selectedMonth, setSelectedMonth] = useState(
        MONTHS[new Date().getMonth()],
    );

    // Entries track *unsaved edits* for whichever month is selected. If we
    // didn't clear them on month change, a value typed for July would still
    // be sitting in state (and would get submitted!) after switching to
    // August, since entries aren't keyed by month.
    useEffect(() => {
        setEntries({});
        setErrorsByRow({});
    }, [selectedMonth]);

    const ayOptions = useMemo(
        () => academicYears ?? generateAcademicYearOptions(selectedAY),
        [academicYears, selectedAY],
    );

    const changeAcademicYear = (value: string) => {
        if (value === selectedAY) return;
        router.get(
            window.location.pathname,
            {
                ...Object.fromEntries(
                    new URLSearchParams(window.location.search),
                ),
                academic_year: value,
            },
            { preserveScroll: true, preserveState: false },
        );
    };

    const entryFor = (kpiId: number, planId: number | null): MonthlyEntry => {
        const key = rowKeyFor(kpiId, planId);
        return (
            entries[key] ?? {
                kpiId,
                planId,
                compliance_percentage: '',
            }
        );
    };

    // What the input should actually show: an in-progress edit takes
    // priority, otherwise fall back to whatever's already saved in the
    // database for this row + selected month.
    const displayValueFor = (kpi: Kpi, planId: number | null): number | '' => {
        const entry = entryFor(kpi.id, planId);
        if (entry.compliance_percentage !== '') {
            return entry.compliance_percentage;
        }
        return (
            existingSubmissionFor(kpi, planId, selectedMonth)
                ?.compliance_percentage ?? ''
        );
    };

    const updateEntry = (
        kpiId: number,
        planId: number | null,
        patch: Partial<MonthlyEntry>,
    ) => {
        const key = rowKeyFor(kpiId, planId);
        setEntries((prev) => ({
            ...prev,
            [key]: { ...entryFor(kpiId, planId), ...patch, kpiId, planId },
        }));
    };

    const dirtyCount = useMemo(
        () =>
            Object.values(entries).filter((e) => e.compliance_percentage !== '')
                .length,
        [entries],
    );

    const submitAll = async () => {
        const rows = Object.entries(entries).filter(
            ([, entry]) => entry.compliance_percentage !== '',
        );
        if (rows.length === 0) return;

        setSubmittingAll(true);
        const nextErrors: Record<RowKey, string | undefined> = {};
        const succeededKeys: RowKey[] = [];

        for (const [rowKey, entry] of rows) {
            try {
                await postSubmission(entry.kpiId, {
                    academic_year: selectedAY,
                    submission_month: selectedMonth,
                    compliance_percentage:
                        entry.compliance_percentage as number,
                    action_plan_id: entry.planId,
                });
                succeededKeys.push(rowKey);
            } catch (errors) {
                nextErrors[rowKey] = (
                    errors as Record<string, string>
                ).compliance_percentage;
            }
        }

        setEntries((prev) => {
            const next = { ...prev };
            succeededKeys.forEach((key) => delete next[key]);
            return next;
        });
        setErrorsByRow(nextErrors);
        setSubmittingAll(false);
    };

    const totalKpis = kras.reduce((sum, k) => sum + k.kpis.length, 0);

    type Row =
        | {
              kpi: Kpi;
              plan: ActionPlan;
              isFirstInKpi: boolean;
              kpiRowSpan: number;
          }
        | { kpi: Kpi; plan: null; isFirstInKpi: true; kpiRowSpan: number };

    const rowsFor = (kpis: Kpi[]): Row[] =>
        kpis.flatMap((kpi): Row[] => {
            if (kpi.action_plans.length === 0) {
                return [{ kpi, plan: null, isFirstInKpi: true, kpiRowSpan: 1 }];
            }
            return kpi.action_plans.map((plan, index) => ({
                kpi,
                plan,
                isFirstInKpi: index === 0,
                kpiRowSpan: kpi.action_plans.length,
            }));
        });

    return (
        <>
            <Head
                title={
                    kras.length > 0
                        ? `${kras[0].code} ${kras[0].title}`
                        : `My KPIs — ${unitCode}`
                }
            />
            <div className="mx-auto w-full space-y-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm">
                    {kras.length > 0 ? (
                        <div className="flex items-start gap-3">
                            <Target className="mt-1 h-6 w-6 shrink-0 text-emerald-600" />
                            <div>
                                <h1 className="text-2xl leading-none font-bold tracking-tight uppercase">
                                    KRA {kras[0].code} : {kras[0].title}
                                </h1>
                                {/* Small sub-area details without labels */}
                                <p className="mt-1 text-sm font-medium text-muted-foreground normal-case">
                                    {kras[0].sub_area_code} —{' '}
                                    {kras[0].sub_area_title}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Target className="h-6 w-6 text-emerald-600" />
                            <h1 className="text-2xl font-bold tracking-tight">
                                My KPIs
                            </h1>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">
                                Academic year
                            </span>
                            <Select
                                value={selectedAY}
                                onValueChange={changeAcademicYear}
                            >
                                <SelectTrigger className="h-9 w-[130px] text-sm focus:ring-1 focus:ring-emerald-500">
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {!ayOptions.includes(selectedAY) && (
                                        <SelectItem value={selectedAY}>
                                            {selectedAY}
                                        </SelectItem>
                                    )}
                                    {ayOptions.map((ay) => (
                                        <SelectItem key={ay} value={ay}>
                                            {ay}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Month</span>
                            <Select
                                value={selectedMonth}
                                onValueChange={setSelectedMonth}
                            >
                                <SelectTrigger
                                    className="h-9 w-[130px] text-sm focus:ring-1 focus:ring-emerald-500"
                                    title="Every entry below will be submitted for this month"
                                >
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MONTHS.map((m) => (
                                        <SelectItem key={m} value={m}>
                                            {m}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </label>
                    </div>
                </div>

                {/* Prominent Month Header Section */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-emerald-600 p-2 text-white">
                            <CalendarDays className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight text-emerald-950">
                                Submitting Achievements for {selectedMonth}
                            </h2>
                            <p className="text-sm text-emerald-700/80">
                                Update and submit your unit's compliance
                                percentages for the month of {selectedMonth}.
                            </p>
                        </div>
                    </div>
                </div>

                {totalKpis === 0 ? (
                    <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                        No KPIs are currently assigned to your unit for AY{' '}
                        {selectedAY}.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {kras.map((kra) => (
                            <div
                                key={kra.id}
                                className="overflow-hidden border bg-card shadow-sm"
                            >
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    Key Performance Indicator
                                                </TableHead>
                                                <TableHead className="min-w-[110px]">
                                                    {selectedMonth} %
                                                </TableHead>
                                                <TableHead>
                                                    Action plan
                                                </TableHead>
                                                <TableHead>
                                                    Responsible units
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {rowsFor(kra.kpis).map(
                                                ({
                                                    kpi,
                                                    plan,
                                                    isFirstInKpi,
                                                    kpiRowSpan,
                                                }) => {
                                                    const planId =
                                                        plan?.id ?? null;
                                                    const rowKey = rowKeyFor(
                                                        kpi.id,
                                                        planId,
                                                    );
                                                    const fieldError =
                                                        errorsByRow[rowKey];
                                                    const displayValue =
                                                        displayValueFor(
                                                            kpi,
                                                            planId,
                                                        );
                                                    // Saved = this value came
                                                    // from the database and
                                                    // the user hasn't typed
                                                    // anything to override it
                                                    // yet.
                                                    const isSaved =
                                                        entryFor(kpi.id, planId)
                                                            .compliance_percentage ===
                                                            '' &&
                                                        displayValue !== '';

                                                    return (
                                                        <TableRow
                                                            key={rowKey}
                                                            className="align-top"
                                                        >
                                                            {isFirstInKpi && (
                                                                <TableCell
                                                                    rowSpan={
                                                                        kpiRowSpan
                                                                    }
                                                                    className="min-w-[220px] border-r bg-muted/20 align-top"
                                                                >
                                                                    <KpiHeaderCell
                                                                        kpi={
                                                                            kpi
                                                                        }
                                                                    />
                                                                </TableCell>
                                                            )}

                                                            <TableCell className="border-r p-1 align-top">
                                                                <div className="flex items-center gap-1">
                                                                    <input
                                                                        type="number"
                                                                        min={0}
                                                                        max={
                                                                            100
                                                                        }
                                                                        placeholder="—"
                                                                        value={
                                                                            displayValue
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateEntry(
                                                                                kpi.id,
                                                                                planId,
                                                                                {
                                                                                    compliance_percentage:
                                                                                        e
                                                                                            .target
                                                                                            .value ===
                                                                                        ''
                                                                                            ? ''
                                                                                            : Number(
                                                                                                  e
                                                                                                      .target
                                                                                                      .value,
                                                                                              ),
                                                                                },
                                                                            )
                                                                        }
                                                                        className={`w-16 rounded border px-1.5 py-1 text-right text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none ${
                                                                            isSaved
                                                                                ? 'border-emerald-200 bg-emerald-50'
                                                                                : 'border-input bg-background'
                                                                        }`}
                                                                    />
                                                                    <span className="text-xs text-muted-foreground">
                                                                        %
                                                                    </span>
                                                                    {isSaved && (
                                                                        <Check
                                                                            className="h-3 w-3 shrink-0 text-emerald-600"
                                                                            aria-label="Already submitted"
                                                                        />
                                                                    )}
                                                                </div>
                                                                {fieldError && (
                                                                    <p className="mt-1 text-[10px] text-destructive">
                                                                        {
                                                                            fieldError
                                                                        }
                                                                    </p>
                                                                )}
                                                            </TableCell>

                                                            {plan ? (
                                                                <>
                                                                    <TableCell className="min-w-[220px]">
                                                                        <p className="text-sm leading-relaxed">
                                                                            {
                                                                                plan.description
                                                                            }
                                                                        </p>
                                                                    </TableCell>
                                                                    <TableCell className="min-w-[140px]">
                                                                        <UnitBadges
                                                                            units={
                                                                                plan.responsible_units
                                                                            }
                                                                        />
                                                                    </TableCell>
                                                                </>
                                                            ) : (
                                                                <TableCell
                                                                    colSpan={2}
                                                                >
                                                                    <span className="text-sm text-muted-foreground">
                                                                        No
                                                                        action
                                                                        plans
                                                                        defined
                                                                        for this
                                                                        KPI yet.
                                                                    </span>
                                                                </TableCell>
                                                            )}
                                                        </TableRow>
                                                    );
                                                },
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center justify-end gap-3 border-t pt-4">
                            {dirtyCount > 0 && (
                                <span className="text-xs text-muted-foreground">
                                    {dirtyCount} entr
                                    {dirtyCount === 1 ? 'y' : 'ies'} to submit
                                    for {selectedMonth}
                                </span>
                            )}
                            <Button
                                type="button"
                                disabled={dirtyCount === 0 || submittingAll}
                                onClick={submitAll}
                                className="inline-flex items-center gap-2 px-6 disabled:opacity-50"
                            >
                                {submittingAll ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                                {submittingAll ? 'Submitting…' : 'Submit all'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
