import { Head, Link, router } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// ---------------------------------------------------------------------------
// Types — mirror ReportController::kra()'s Inertia props exactly.
// ---------------------------------------------------------------------------
type Unit = {
    id: number;
    code: string;
    name: string;
};

type MonthlySubmission = {
    id: number;
    year: number;
    month: number;
    percentage_achieved: string; // decimal cast comes over the wire as a string
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
    remarks: string | null;
    action_plan_id: number | null;
    unit: Unit | null;
};

// A monthly submission enriched with the running cumulative-average
// percentage achieved from the start of the academic year through this
// month (inclusive). Computed client-side in withCumulative() below.
type MonthlySubmissionWithCumulative = MonthlySubmission & {
    cumulativePercentage: number;
};

type KpiTarget = {
    id: number;
    academic_year_id: number;
    target_percentage: string;
};

type ActionPlan = {
    id: number;
    description: string;
    units: Unit[];
};

type Kpi = {
    id: number;
    code: string;
    description: string;
    units: Unit[];
    targets: KpiTarget[];
    action_plans: ActionPlan[];
    monthly_submissions: MonthlySubmission[];
};

type AcademicYear = {
    id: number;
    label: string;
    is_current: boolean;
};

type MonthOption = {
    key: string;
    year: number;
    month: number;
    label: string;
};

type SelectedMonth = { year: number; month: number } | null;

type Props = {
    subArea: {
        code: string;
        title: string;
        kra: {
            number: number;
            title: string;
            reference: string | null;
        };
    };
    academicYears: AcademicYear[];
    selectedAcademicYear: AcademicYear | null;
    kpis: Kpi[];
};

const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

function formatPercentage(value: string | number | undefined): string {
    if (value === undefined) return '—';
    const n = Number(value);
    return Number.isFinite(n) ? `${n.toFixed(1)}%` : '—';
}

// A KPI's monthly submissions are keyed by (kpi_id, action_plan_id, year,
// month). Pass an action plan's id to get that plan's submissions, or null
// to get the KPI-level submissions recorded for a KPI with no action plans.
// Returned in chronological (ascending) order so callers can compute a
// running cumulative total.
function submissionsFor(
    kpi: Kpi,
    actionPlanId: number | null,
): MonthlySubmission[] {
    return kpi.monthly_submissions
        .filter((s) => s.action_plan_id === actionPlanId)
        .sort((a, b) => a.year - b.year || a.month - b.month);
}

// Walks a chronologically-ordered submission series and attaches, to each
// entry, the running average of percentage_achieved from the first month
// in the series through that month — how the unit is trending so far, not
// just that one month in isolation.
function withCumulative(
    submissions: MonthlySubmission[],
): MonthlySubmissionWithCumulative[] {
    let sum = 0;
    let count = 0;

    return submissions.map((submission) => {
        const value = Number(submission.percentage_achieved);
        if (Number.isFinite(value)) {
            sum += value;
            count += 1;
        }

        return {
            ...submission,
            cumulativePercentage: count > 0 ? sum / count : 0,
        };
    });
}

// Finds the target percentage for this KPI in the currently-selected
// academic year, if one has been set.
function targetFor(kpi: Kpi, academicYear: AcademicYear | null): number | null {
    if (!academicYear) return null;
    const target = kpi.targets.find(
        (t) => t.academic_year_id === academicYear.id,
    );
    if (!target) return null;
    const n = Number(target.target_percentage);
    return Number.isFinite(n) ? n : null;
}

// Colors the cumulative figure relative to target: on/above target reads
// as good, within 75% of target as a caution, further behind as at-risk.
// Neutral (no color) when there's no target to compare against.
function cumulativeColorClass(
    cumulative: number,
    target: number | null,
): string {
    if (target === null || target <= 0) return '';
    if (cumulative >= target) return 'text-emerald-600';
    if (cumulative >= target * 0.75) return 'text-amber-600';
    return 'text-red-600';
}

// Every distinct (year, month) that appears anywhere across this sub-area's
// KPIs, for the currently-loaded academic year — this powers the Month
// select. Sorted most-recent first.
function collectMonthOptions(kpis: Kpi[]): MonthOption[] {
    const seen = new Map<string, MonthOption>();

    for (const kpi of kpis) {
        for (const submission of kpi.monthly_submissions) {
            const key = `${submission.year}-${submission.month}`;
            if (!seen.has(key)) {
                seen.set(key, {
                    key,
                    year: submission.year,
                    month: submission.month,
                    label: `${monthNames[submission.month - 1]} ${submission.year}`,
                });
            }
        }
    }

    return Array.from(seen.values()).sort(
        (a, b) => b.year - a.year || b.month - a.month,
    );
}

function UnitBadges({ units }: { units: Unit[] }) {
    if (units.length === 0) {
        return <span className="text-sm text-muted-foreground">—</span>;
    }
    return (
        <div className="flex flex-wrap gap-1">
            {units.map((unit) => (
                <span
                    key={unit.id}
                    className="rounded-md border px-1.5 py-0.5 text-[10px] font-medium"
                >
                    {unit.code}
                </span>
            ))}
        </div>
    );
}

// Simple breadcrumb trail — rendered locally instead of via AppLayout.
function Breadcrumbs({ items }: { items: { title: string; href?: string }[] }) {
    return (
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Home className="h-3.5 w-3.5" />
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <Fragment key={item.href ?? item.title}>
                        {index > 0 && (
                            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                        )}
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="transition-colors hover:text-foreground"
                            >
                                {item.title}
                            </Link>
                        ) : (
                            <span
                                className={
                                    isLast ? 'font-medium text-foreground' : ''
                                }
                            >
                                {item.title}
                            </span>
                        )}
                    </Fragment>
                );
            })}
        </nav>
    );
}

function KpiHeaderCell({ kpi, target }: { kpi: Kpi; target: number | null }) {
    return (
        <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">{kpi.code}</p>
            <p className="text-sm leading-relaxed font-medium">
                {kpi.description}
            </p>
            {target !== null && (
                <p className="text-[11px] text-muted-foreground">
                    Target:{' '}
                    <span className="font-medium">
                        {formatPercentage(target)}
                    </span>
                </p>
            )}
        </div>
    );
}

// Renders just the selected month's figures for one series of submissions:
// that month's own percentage ("Achieved"), and the running cumulative
// average up to and including that month ("Cumulative"). Shows "Not Yet
// Submitted" if this particular action plan/KPI has no submission for the
// selected month.
function MonthSubmissionCell({
    submissions,
    selectedMonth,
    target,
}: {
    submissions: MonthlySubmission[];
    selectedMonth: SelectedMonth;
    target: number | null;
}) {
    const withRunningTotal = withCumulative(submissions);

    const current = selectedMonth
        ? withRunningTotal.find(
              (s) =>
                  s.year === selectedMonth.year &&
                  s.month === selectedMonth.month,
          )
        : undefined;

    if (!current) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                    Not Yet Submitted
                </span>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="h-7 py-1 text-[11px]">
                        Achieved
                    </TableHead>
                    <TableHead className="h-7 py-1 text-[11px]">
                        Cumulative
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="py-1 text-xs">
                        {formatPercentage(current.percentage_achieved)}
                    </TableCell>
                    <TableCell
                        className={`py-1 text-xs font-medium ${cumulativeColorClass(
                            current.cumulativePercentage,
                            target,
                        )}`}
                    >
                        {formatPercentage(current.cumulativePercentage)}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}

// One row per action plan. Column order: KPI (merged) | Selected month |
// Action plan | Responsible units
function ActionPlanRow({
    kpi,
    plan,
    isFirstInKpi,
    kpiRowSpan,
    target,
    selectedMonth,
}: {
    kpi: Kpi;
    plan: ActionPlan;
    isFirstInKpi: boolean;
    kpiRowSpan: number;
    target: number | null;
    selectedMonth: SelectedMonth;
}) {
    const submissions = submissionsFor(kpi, plan.id);

    return (
        <TableRow className="align-top">
            {isFirstInKpi && (
                <TableCell
                    rowSpan={kpiRowSpan}
                    className="min-w-[200px] border-r bg-muted/30 align-top"
                >
                    <KpiHeaderCell kpi={kpi} target={target} />
                </TableCell>
            )}

            <TableCell className="min-w-[220px]">
                <MonthSubmissionCell
                    submissions={submissions}
                    selectedMonth={selectedMonth}
                    target={target}
                />
            </TableCell>

            <TableCell className="min-w-[220px]">
                <p className="text-sm leading-relaxed">{plan.description}</p>
            </TableCell>

            <TableCell className="min-w-[140px] text-center">
                <UnitBadges units={plan.units} />
            </TableCell>
        </TableRow>
    );
}

// A KPI with no action plans still gets one editable row on the staff
// submission page (action_plan_id = null), so its submissions need to be
// shown here too rather than replaced by a static placeholder.
function KpiOnlyRow({
    kpi,
    target,
    selectedMonth,
}: {
    kpi: Kpi;
    target: number | null;
    selectedMonth: SelectedMonth;
}) {
    const submissions = submissionsFor(kpi, null);

    return (
        <TableRow className="align-top">
            <TableCell className="min-w-[200px] border-r bg-muted/30 align-top">
                <KpiHeaderCell kpi={kpi} target={target} />
            </TableCell>

            <TableCell className="min-w-[220px]">
                <MonthSubmissionCell
                    submissions={submissions}
                    selectedMonth={selectedMonth}
                    target={target}
                />
            </TableCell>

            <TableCell colSpan={2}>
                <span className="text-sm text-muted-foreground">
                    No action plans defined for this KPI yet.
                </span>
            </TableCell>
        </TableRow>
    );
}

export default function Show({
    subArea,
    academicYears,
    selectedAcademicYear,
    kpis,
}: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Key result areas', href: '/kras' },
        { title: `${subArea.code} ${subArea.title}` },
    ];

    const monthOptions = useMemo(() => collectMonthOptions(kpis), [kpis]);

    const [selectedMonthKey, setSelectedMonthKey] = useState<string | null>(
        monthOptions[0]?.key ?? null,
    );

    const selectedMonth: SelectedMonth =
        monthOptions.find((m) => m.key === selectedMonthKey) ?? null;

    function handleAcademicYearChange(value: string) {
        router.get(
            window.location.pathname,
            { academic_year_id: value },
            { preserveScroll: true },
        );
    }

    // Flatten to (kpi, actionPlan) pairs so each action plan is its own row,
    // while still knowing which rows belong to the same KPI for the
    // row-spanning KPI column.
    type Row =
        | {
              kpi: Kpi;
              plan: ActionPlan;
              isFirstInKpi: boolean;
              kpiRowSpan: number;
          }
        | { kpi: Kpi; plan: null; isFirstInKpi: true; kpiRowSpan: number };

    const rows: Row[] = kpis.flatMap((kpi): Row[] => {
        const plans = kpi.action_plans.length > 0 ? kpi.action_plans : null;

        if (!plans) {
            return [{ kpi, plan: null, isFirstInKpi: true, kpiRowSpan: 1 }];
        }

        return plans.map((plan, index) => ({
            kpi,
            plan,
            isFirstInKpi: index === 0,
            kpiRowSpan: plans.length,
        }));
    });

    return (
        <>
            <Head title={`${subArea.code} ${subArea.title}`} />

            <div className="flex flex-col gap-6 p-4">
                <Breadcrumbs items={breadcrumbs} />
                <div className="flex flex-wrap items-center justify-end gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Academic year
                        </span>
                        <Select
                            value={
                                selectedAcademicYear
                                    ? String(selectedAcademicYear.id)
                                    : undefined
                            }
                            onValueChange={handleAcademicYearChange}
                        >
                            <SelectTrigger className="w-[170px]">
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                {academicYears.map((ay) => (
                                    <SelectItem
                                        key={ay.id}
                                        value={String(ay.id)}
                                    >
                                        {ay.label}
                                        {ay.is_current ? ' (current)' : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Month
                        </span>
                        <Select
                            value={selectedMonthKey ?? undefined}
                            onValueChange={setSelectedMonthKey}
                            disabled={monthOptions.length === 0}
                        >
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="No submissions" />
                            </SelectTrigger>
                            <SelectContent>
                                {monthOptions.map((m) => (
                                    <SelectItem key={m.key} value={m.key}>
                                        {m.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        KRA {subArea.kra.number}: {subArea.kra.title}
                        {subArea.kra.reference && ` · ${subArea.kra.reference}`}
                    </p>
                    <h1 className="text-2xl font-medium">
                        {subArea.code} {subArea.title}
                    </h1>
                </div>

                <Separator />

                {kpis.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No KPIs have been defined under this sub-area yet.
                    </p>
                ) : (
                    <div className="overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        Key Performance Indicator
                                    </TableHead>
                                    <TableHead>
                                        {selectedMonth
                                            ? `${monthNames[selectedMonth.month - 1]} ${selectedMonth.year}`
                                            : 'Submission'}
                                    </TableHead>
                                    <TableHead>Action plan</TableHead>
                                    <TableHead>Responsible units</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map(
                                    ({
                                        kpi,
                                        plan,
                                        isFirstInKpi,
                                        kpiRowSpan,
                                    }) => {
                                        const target = targetFor(
                                            kpi,
                                            selectedAcademicYear,
                                        );

                                        return plan ? (
                                            <ActionPlanRow
                                                key={plan.id}
                                                kpi={kpi}
                                                plan={plan}
                                                isFirstInKpi={isFirstInKpi}
                                                kpiRowSpan={kpiRowSpan}
                                                target={target}
                                                selectedMonth={selectedMonth}
                                            />
                                        ) : (
                                            <KpiOnlyRow
                                                key={kpi.id}
                                                kpi={kpi}
                                                target={target}
                                                selectedMonth={selectedMonth}
                                            />
                                        );
                                    },
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </>
    );
}
