// resources/js/pages/reports/kras/show.tsx
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
// Types — mirror ReportController::kra()'s Inertia props exactly.
//
// IMPORTANT: monthly_submissions and targets belong to the KPI, not to
// individual action plans — the database keys a submission by
// (kpi_id, unit_id, year, month). Action plans are distinguished by which
// unit is responsible for them (see action_plan_unit), so "this action
// plan's percentage" is derived below by matching the action plan's
// responsible unit(s) against the KPI's monthly submissions, not by a
// direct relationship.
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
    currentAcademicYear: AcademicYear;
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

// A KPI's monthly submissions are keyed by (kpi_id, action_plan_id, year,
// month) — see UnitKpiController::storeSubmission(). Pass an action plan's
// id to get that plan's submissions, or null to get the KPI-level
// submissions recorded for a KPI with no action plans.
function submissionsFor(
    kpi: Kpi,
    actionPlanId: number | null,
): MonthlySubmission[] {
    return kpi.monthly_submissions.filter(
        (s) => s.action_plan_id === actionPlanId,
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
            {/* <UnitBadges units={kpi.units} /> */}
        </div>
    );
}

// One row per action plan. Monthly submissions are looked up by matching
// the submission's action_plan_id against this action plan's id.
// Column order: KPI (merged) | Monthly submissions | Action plan | Responsible units
function ActionPlanRow({
    kpi,
    plan,
    isFirstInKpi,
    kpiRowSpan,
}: {
    kpi: Kpi;
    plan: ActionPlan;
    isFirstInKpi: boolean;
    kpiRowSpan: number;
}) {
    const latestSubmissions = submissionsFor(kpi, plan.id).slice(0, 6);

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
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">0%</span>
                        <span className="text-sm text-muted-foreground">
                            Not Yet Submitted
                        </span>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="h-7 py-1 text-[11px]">
                                    Month
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

            <TableCell className="min-w-[220px]">
                <p className="text-sm leading-relaxed">{plan.description}</p>
            </TableCell>

            <TableCell className="min-w-[140px]">
                <UnitBadges units={plan.units} />
            </TableCell>
        </TableRow>
    );
}

// A KPI with no action plans still gets one editable row on the staff
// submission page (action_plan_id = null), so its submissions need to be
// shown here too rather than replaced by a static placeholder.
function KpiOnlyRow({ kpi }: { kpi: Kpi }) {
    const latestSubmissions = submissionsFor(kpi, null).slice(0, 6);

    return (
        <TableRow className="align-top">
            <TableCell className="min-w-[200px] border-r bg-muted/30 align-top">
                <KpiHeaderCell kpi={kpi} />
            </TableCell>

            <TableCell className="min-w-[280px]">
                {latestSubmissions.length === 0 ? (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">0%</span>
                        <span className="text-sm text-muted-foreground">
                            Not Yet Submitted
                        </span>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="h-7 py-1 text-[11px]">
                                    Month
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

            <TableCell colSpan={2}>
                <span className="text-sm text-muted-foreground">
                    No action plans defined for this KPI yet.
                </span>
            </TableCell>
        </TableRow>
    );
}

export default function Show({ subArea, currentAcademicYear, kpis }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Key result areas', href: '/kras' },
        { title: `${subArea.code} ${subArea.title}` },
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
                                                isFirstInKpi={isFirstInKpi}
                                                kpiRowSpan={kpiRowSpan}
                                            />
                                        ) : (
                                            <KpiOnlyRow
                                                key={kpi.id}
                                                kpi={kpi}
                                            />
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
