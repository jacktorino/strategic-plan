import { Head } from '@inertiajs/react';
import {
    BarChart3,
    CheckSquare,
    FilePlus2,
    Gauge,
    ShieldAlert,
    Target,
    Users,
    TrendingUp,
    Layers,
    CalendarDays,
    ClipboardCheck,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from 'recharts';

type Props = {
    role: 'admin' | 'staff' | 'president';
    unit: string | null;
    metrics: any;
};

export default function Dashboard({ role, unit, metrics }: Props) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6 p-6">
                {/* Global Welcome Banner */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard Workspace
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Logged in as{' '}
                        <span className="font-semibold text-foreground capitalize">
                            {role}
                        </span>
                        {unit && ` • Department: ${unit}`}
                    </p>
                </div>

                {/* Switch Workspace View Based on Guarded Session Role */}
                {role === 'admin' && <AdminDashboardView metrics={metrics} />}
                {role === 'staff' && <StaffDashboardView metrics={metrics} />}
                {role === 'president' && (
                    <PresidentDashboardView metrics={metrics} />
                )}
            </div>
        </>
    );
}

// =========================================================================
// 1. SYSTEM ADMINISTRATOR DASHBOARD
// =========================================================================
function AdminDashboardView({ metrics }: { metrics: any }) {
    // Admin Chart: Overview of Submissions over recent periods
    const systemActivityData = metrics.activity ?? [];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2 rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                            Functional Units
                        </span>
                        <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold tracking-tight">
                        {metrics.total_units ?? 0}
                    </p>
                </div>
                <div className="space-y-2 rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                            Pending Action Proposals
                        </span>
                        <FilePlus2 className="h-5 w-5 text-amber-500" />
                    </div>
                    <p className="text-3xl font-bold tracking-tight text-amber-600">
                        {metrics.pending_proposals ?? 0}
                    </p>
                </div>
                <div className="space-y-2 rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                            System Configured KPIs
                        </span>
                        <Gauge className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="text-3xl font-bold tracking-tight">
                        {metrics.active_kpis ?? 0}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm md:col-span-2">
                    <div>
                        <h3 className="text-lg leading-none font-semibold">
                            System Transaction Flow
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Tactical metric evaluation changes captured
                            system-wide.
                        </p>
                    </div>
                    <div className="h-[240px] w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={systemActivityData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -20,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    className="stroke-muted"
                                />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    className="fill-muted-foreground text-xs"
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    className="fill-muted-foreground text-xs"
                                />
                                <Tooltip
                                    formatter={(value) => [value, 'Logs']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="submissions"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    dot={{ fill: '#2563eb' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex flex-col justify-between space-y-4 rounded-xl border bg-card p-6 shadow-sm">
                    <div className="space-y-1">
                        <h3 className="text-md flex items-center gap-2 font-semibold">
                            <Layers className="h-4 w-4 text-blue-600" />{' '}
                            Configuration Actions
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Quick management workflows for database structural
                            nodes.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <a
                            href="/admin/kras"
                            className="w-full rounded-lg bg-primary px-3 py-2 text-center text-xs font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                        >
                            Manage Global KRAs
                        </a>
                        <a
                            href="/admin/units"
                            className="w-full rounded-lg border bg-secondary px-3 py-2 text-center text-xs font-medium transition-colors hover:bg-muted"
                        >
                            Directory Assignments
                        </a>
                        <a
                            href="/admin/kpi-submissions"
                            className="w-full rounded-lg bg-amber-500/10 px-3 py-2 text-center text-xs font-medium text-amber-700 transition-colors hover:bg-amber-500/20"
                        >
                            Review Pending Requests (
                            {metrics.pending_proposals ?? 0})
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

// =========================================================================
// 2. STAFF / DEPARTMENT HEAD DASHBOARD
// =========================================================================
function StaffDashboardView({ metrics }: { metrics: any }) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2 rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                            My Tracked Targets
                        </span>
                        <Gauge className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold tracking-tight">
                        {metrics.my_assigned_kpis ?? 0}
                    </p>
                </div>
                <div className="space-y-2 rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                            Action Tasks Completed
                        </span>
                        <CheckSquare className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="text-3xl font-bold tracking-tight text-emerald-600">
                        {metrics.completed_tasks ?? 0}
                    </p>
                </div>
                <div className="space-y-2 rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                            Awaiting Milestones
                        </span>
                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-3xl font-bold tracking-tight">
                        {metrics.pending_tasks ?? 0}
                    </p>
                </div>
            </div>

            <div className="grid items-center gap-6 rounded-xl border bg-muted/30 p-6 md:grid-cols-3">
                <div className="space-y-2 md:col-span-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <ClipboardCheck className="h-5 w-5 text-emerald-600" />{' '}
                        Strategic Alignment Required
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Your functional unit is assigned to update progress
                        records according to institutional evaluation phases.
                        Propose structural changes directly to the admin console
                        if tracking adjustments are needed.
                    </p>
                </div>
                <div className="flex w-full flex-col gap-2">
                    <a
                        href="/my/kpis"
                        className="w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                    >
                        Log Metric Entries
                    </a>
                    <a
                        href="/my/kpi-submissions/create"
                        className="w-full rounded-lg border bg-secondary px-4 py-2.5 text-center text-sm font-medium transition-colors hover:bg-muted"
                    >
                        Propose New Metric Target
                    </a>
                </div>
            </div>
        </div>
    );
}

// =========================================================================
// 3. EXECUTIVE / PRESIDENT DASHBOARD
// =========================================================================
function PresidentDashboardView({ metrics }: { metrics: any }) {
    const kraPerformanceData = metrics.kra_performance ?? [];

    const unitComplianceData = metrics.unit_compliance ?? [];
    const totalUnitsTracked = metrics.total_units_tracked ?? 0;
    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2 rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                            Institutional Completion
                        </span>
                        <Target className="h-5 w-5 text-indigo-600" />
                    </div>
                    <p className="text-3xl font-bold tracking-tight text-indigo-600">
                        {metrics.overall_completion ?? '0%'}
                    </p>
                </div>
                <div className="space-y-2 rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                            Strategic Overview KRAs
                        </span>
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold tracking-tight">
                        {metrics.total_kras ?? 0}
                    </p>
                </div>
                <div className="space-y-2 rounded-xl border border-red-100 bg-card bg-red-50/50 p-6 shadow-sm dark:border-red-900 dark:bg-red-950/20">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-red-800 dark:text-red-400">
                            Escalated Attention
                        </span>
                        <ShieldAlert className="h-5 w-5 text-red-600" />
                    </div>
                    <p className="text-3xl font-bold tracking-tight text-red-600">
                        {metrics.critical_alerts ?? 0} Workflow Delays
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm md:col-span-2">
                    <div>
                        <h3 className="text-lg leading-none font-semibold tracking-tight">
                            KRA Strategic Target Tracking
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Current completion percentage across institutional
                            Key Result Areas.
                        </p>
                    </div>
                    <div className="h-[300px] w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={kraPerformanceData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -20,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    className="stroke-muted"
                                />
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={false}
                                    className="fill-muted-foreground text-xs"
                                    tickFormatter={(value) =>
                                        value.split(':')[0]
                                    }
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    tickLine={false}
                                    axisLine={false}
                                    className="fill-muted-foreground text-xs"
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }}
                                    formatter={(value) => [
                                        `${value}%`,
                                        'Progress',
                                    ]}
                                />
                                <Bar
                                    dataKey="progress"
                                    fill="#4f46e5"
                                    radius={[4, 4, 0, 0]}
                                    barSize={45}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm">
                    <div>
                        <h3 className="text-lg leading-none font-semibold tracking-tight">
                            Unit Submission Status
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Status of tactical compliance workflows.
                        </p>
                    </div>

                    <div className="relative flex h-[200px] w-full items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={unitComplianceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {unitComplianceData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [value, 'Units']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute text-center">
                            <span className="text-3xl font-bold">14</span>
                            <p className="text-xs text-muted-foreground">
                                Total Units
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {unitComplianceData.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-3 w-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-muted-foreground">
                                        {item.name}
                                    </span>
                                </div>
                                <span className="font-semibold">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-muted/30 p-6">
                <div className="space-y-1">
                    <h3 className="flex items-center gap-2 font-semibold">
                        <TrendingUp className="h-4 w-4 text-indigo-600" />{' '}
                        Executive Oversight Engine
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Data logs refresh dynamically upon operational group
                        updates.
                    </p>
                </div>
                <a
                    href="/reports"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                >
                    Open Advanced Analytics
                </a>
            </div>
        </div>
    );
}
