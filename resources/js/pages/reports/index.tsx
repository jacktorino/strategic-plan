// resources/js/pages/my/reports/index.tsx
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment } from 'react';

import { Badge } from '@/components/ui/badge';
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
// Types — mirror UnitReportController::index()'s Inertia props exactly.
//
// Same shape as reports/kras/show.tsx: monthly_submissions and targets
// belong to the KPI, not to individual action plans — the database keys a
// submission by (kpi_id, unit_id, year, month). Action plans are
// distinguished by their responsible unit(s), so "this action plan's
// percentage" is derived below by matching the action plan's responsible
// unit(s) against the KPI's monthly submissions.
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
    unit: Unit;
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
} | null;

type SubArea = {
    code: string;
    title: string;
    kra: {
        number: number;
        title: string;
        reference: string | null;
    };
} | null;

type Props = {
    subArea: SubArea;
    currentAcademicYear?: AcademicYear;
    kpis: Kpi[];
    message?: string;
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

const statusVariant: Record<
    MonthlySubmission['status'],
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    approved: 'default',
    submitted: 'secondary',
    rejected: 'destructive',
    draft: 'outline',
};

function formatPercentage(value: string | undefined): string {
    if (value === undefined) return '—';
    const n = Number(value);
    return Number.isFinite(n) ? `${n}%` : '—';
}

// An action plan's own submissions are whichever of the KPI's monthly
// submissions were made by one of the action plan's responsible units.
// If the action plan has no units of its own, fall back to the KPI's units
// (i.e. the whole KPI's submissions apply to it).
function submissionsForActionPlan(
    kpi: Kpi,
    plan: ActionPlan,
): MonthlySubmission[] {
    const unitIds = new Set(
        (plan.units.length > 0 ? plan.units : kpi.units).map((u) => u.id),
    );

    return kpi.monthly_submissions.filter(
        (s) => s.unit?.id && unitIds.has(s.unit.id),
    );
}

function UnitBadges({ units }: { units: Unit[] }) {
    if (units.length === 0) {
        return <span className="text-sm text-muted-foreground">—</span>;
    }
    return (
        <div className="flex flex-wrap gap-1">
            {units.map((unit) => (
                <Badge key={unit.id} variant="outline" className="text-[10px]">
                    {unit.code}
                </Badge>
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

function KpiHeaderCell({ kpi }: { kpi: Kpi }) {
    return (
        <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">{kpi.code}</p>
            <p className="text-sm leading-relaxed font-medium">
                {kpi.description}
            </p>
        </div>
    );
}

// One row per action plan. Target is the KPI's (shown on every row, since
// it doesn't vary by action plan). Monthly submissions are derived by
// matching the action plan's responsible unit(s) against the KPI's
// submissions, and rendered as a small nested table inside the cell.
// Column order: KPI (merged) | Monthly submissions | Target | Action plan | Responsible units
function ActionPlanRow({
    kpi,
    plan,
    currentAcademicYear,
    isFirstInKpi,
    kpiRowSpan,
}: {
    kpi: Kpi;
    plan: ActionPlan;
    currentAcademicYear: AcademicYear;
    isFirstInKpi: boolean;
    kpiRowSpan: number;
}) {
    const target = kpi.targets[0]; // controller already scopes this to the current AY
    const latestSubmissions = submissionsForActionPlan(kpi, plan).slice(0, 6);

    return (
        <TableRow className="align-top">
            {isFirstInKpi && (
                <TableCell
                    rowSpan={kpiRowSpan}
                    className="min-w-[200px] border-r bg-muted/30 align-top"
                >
                    <KpiHeaderCell kpi={kpi} />
                </TableCell>
            )}

            <TableCell className="min-w-[280px]">
                {latestSubmissions.length === 0 ? (
                    <span className="text-sm text-muted-foreground">
                        Not Yet Submitted
                    </span>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="h-7 py-1 text-[11px]">
                                    Month
                                </TableHead>
                                <TableHead className="h-7 py-1 text-[11px]">
                                    Unit
                                </TableHead>
                                <TableHead className="h-7 py-1 text-[11px]">
                                    Achieved
                                </TableHead>
                                <TableHead className="h-7 py-1 text-[11px]">
                                    Status
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {latestSubmissions.map((submission) => (
                                <TableRow key={submission.id}>
                                    <TableCell className="py-1 text-xs whitespace-nowrap">
                                        {monthNames[submission.month - 1]}{' '}
                                        {submission.year}
                                    </TableCell>
                                    <TableCell className="py-1 text-xs">
                                        {submission.unit.code}
                                    </TableCell>
                                    <TableCell className="py-1 text-xs">
                                        {formatPercentage(
                                            submission.percentage_achieved,
                                        )}
                                    </TableCell>
                                    <TableCell className="py-1">
                                        <Badge
                                            variant={
                                                statusVariant[submission.status]
                                            }
                                            className="text-[10px]"
                                        >
                                            {submission.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableCell>

            <TableCell className="whitespace-nowrap">
                {target ? (
                    <div>
                        <p className="text-sm font-medium">
                            {formatPercentage(target.target_percentage)}
                        </p>
                        {currentAcademicYear && (
                            <p className="text-xs text-muted-foreground">
                                {currentAcademicYear.label}
                            </p>
                        )}
                    </div>
                ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                )}
            </TableCell>

            <TableCell className="min-w-[220px]">
                <p className="text-sm leading-relaxed">{plan.description}</p>
            </TableCell>

            <TableCell className="min-w-[140px]">
                <UnitBadges units={plan.units} />
            </TableCell>
        </TableRow>
    );
}

export default function MyReportsIndex({
    subArea,
    currentAcademicYear = null,
    kpis,
    message,
}: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        subArea
            ? { title: `${subArea.code} ${subArea.title}` }
            : { title: 'My reports' },
    ];

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

    if (!subArea) {
        return (
            <>
                <Head title="My reports" />
                <div className="flex flex-col gap-6 p-4">
                    <Breadcrumbs items={breadcrumbs} />
                    <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                        {message ??
                            'Your account is not yet assigned to a KRA sub-area. Contact an admin.'}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={`${subArea.code} ${subArea.title}`} />

            <div className="flex flex-col gap-6 p-4">
                <Breadcrumbs items={breadcrumbs} />

                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        KRA {subArea.kra.number}: {subArea.kra.title}
                        {subArea.kra.reference && ` · ${subArea.kra.reference}`}
                    </p>
                    <h1 className="text-2xl font-medium">
                        {subArea.code} {subArea.title}
                    </h1>
                </div>

                {currentAcademicYear && (
                    <p className="text-sm text-muted-foreground">
                        Showing targets and submissions for{' '}
                        <span className="font-medium text-foreground">
                            {currentAcademicYear.label}
                        </span>
                    </p>
                )}

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
                                    <TableHead>Monthly submissions</TableHead>
                                    <TableHead>Target</TableHead>
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
                                    }) =>
                                        plan ? (
                                            <ActionPlanRow
                                                key={plan.id}
                                                kpi={kpi}
                                                plan={plan}
                                                currentAcademicYear={
                                                    currentAcademicYear
                                                }
                                                isFirstInKpi={isFirstInKpi}
                                                kpiRowSpan={kpiRowSpan}
                                            />
                                        ) : (
                                            <TableRow key={kpi.id}>
                                                <TableCell className="min-w-[200px] border-r bg-muted/30 align-top">
                                                    <KpiHeaderCell kpi={kpi} />
                                                </TableCell>
                                                <TableCell colSpan={4}>
                                                    <span className="text-sm text-muted-foreground">
                                                        No action plans defined
                                                        for this KPI yet.
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ),
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </>
    );
}
