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

// Brand palette (see AuthSplitLayout): forest green primary, brass gold
// accent, warm paper background. Kept as literals here rather than Tailwind
// tokens so this file doesn't depend on tailwind.config naming — swap in
// your theme tokens (e.g. `bg-forest`) if you've already wired those up.
const BRAND = {
    forest: '#0E3B27',
    gold: '#B9902E',
    paper: '#F6F4EE',
};

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
                <div className="flex flex-col gap-1">
                    <h1 className="font-serif text-3xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Logged in as{' '}
                        <span className="font-semibold text-foreground capitalize">
                            {role}
                        </span>
                        {unit && ` • Department: ${unit}`}
                    </p>
                </div>

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
// 1. ADMIN DASHBOARD
// =========================================================================
function AdminDashboardView({ metrics }: { metrics: any }) {
    const systemActivityData = metrics.activity ?? [];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    label="Units"
                    value={metrics.total_units ?? 0}
                    icon={
                        <Users
                            className="h-5 w-5"
                            style={{ color: BRAND.forest }}
                        />
                    }
                />
                <StatCard
                    label="Proposals Awaiting Review"
                    value={metrics.pending_proposals ?? 0}
                    valueClassName="text-amber-600"
                    icon={
                        <FilePlus2
                            className="h-5 w-5"
                            style={{ color: BRAND.gold }}
                        />
                    }
                />
                <StatCard
                    label="KPIs Being Tracked"
                    value={metrics.active_kpis ?? 0}
                    icon={
                        <Gauge
                            className="h-5 w-5"
                            style={{ color: BRAND.forest }}
                        />
                    }
                />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm md:col-span-2">
                    <div>
                        <h3 className="font-serif text-lg leading-none font-semibold">
                            Submission Activity
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Monthly submission volume across all units.
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
                                    formatter={(value) => [
                                        value,
                                        'Submissions',
                                    ]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="submissions"
                                    stroke={BRAND.forest}
                                    strokeWidth={2}
                                    dot={{ fill: BRAND.forest }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex flex-col justify-between space-y-4 rounded-xl border bg-card p-6 shadow-sm">
                    <div className="space-y-1">
                        <h3 className="text-md flex items-center gap-2 font-serif font-semibold">
                            <Layers
                                className="h-4 w-4"
                                style={{ color: BRAND.forest }}
                            />
                            Manage
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Set up KRAs, units, and KPI assignments.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <a
                            href="/admin/kras"
                            className="w-full rounded-lg px-3 py-2 text-center text-xs font-medium text-white shadow-sm transition-opacity hover:opacity-90"
                            style={{ backgroundColor: BRAND.forest }}
                        >
                            Manage Key Result Areas
                        </a>
                        <a
                            href="/admin/units"
                            className="w-full rounded-lg border bg-secondary px-3 py-2 text-center text-xs font-medium transition-colors hover:bg-muted"
                        >
                            Manage Units
                        </a>
                        <a
                            href="/admin/kpi-submissions"
                            className="w-full rounded-lg px-3 py-2 text-center text-xs font-medium transition-colors"
                            style={{
                                backgroundColor: `${BRAND.gold}1A`,
                                color: BRAND.gold,
                            }}
                        >
                            Review Pending Submissions (
                            {metrics.pending_proposals ?? 0})
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

// =========================================================================
// 2. STAFF / UNIT DASHBOARD
// =========================================================================
function StaffDashboardView({ metrics }: { metrics: any }) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    label="KPIs Assigned to My Unit"
                    value={metrics.my_assigned_kpis ?? 0}
                    icon={
                        <Gauge
                            className="h-5 w-5"
                            style={{ color: BRAND.forest }}
                        />
                    }
                />
                <StatCard
                    label="Action Plans Completed"
                    value={metrics.completed_tasks ?? 0}
                    valueClassName="text-emerald-700"
                    icon={<CheckSquare className="h-5 w-5 text-emerald-600" />}
                />
                <StatCard
                    label="Still Due This Period"
                    value={metrics.pending_tasks ?? 0}
                    icon={
                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                    }
                />
            </div>

            <div
                className="grid items-center gap-6 rounded-xl border p-6 md:grid-cols-3"
                style={{ backgroundColor: `${BRAND.paper}` }}
            >
                <div className="space-y-2 md:col-span-2">
                    <h3 className="flex items-center gap-2 font-serif text-lg font-semibold">
                        <ClipboardCheck
                            className="h-5 w-5"
                            style={{ color: BRAND.forest }}
                        />
                        Report Your Progress
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Update your unit's monthly submissions for its assigned
                        KPIs. If a KPI or target doesn't fit your unit's work,
                        propose a change and an admin will review it.
                    </p>
                </div>
                <div className="flex w-full flex-col gap-2">
                    <a
                        href="/my/kpis"
                        className="w-full rounded-lg px-4 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
                        style={{ backgroundColor: BRAND.forest }}
                    >
                        Update This Month's Progress
                    </a>
                    <a
                        href="/my/kpi-submissions/create"
                        className="w-full rounded-lg border bg-secondary px-4 py-2.5 text-center text-sm font-medium transition-colors hover:bg-muted"
                    >
                        Propose a New KPI
                    </a>
                </div>
            </div>
        </div>
    );
}

// =========================================================================
// 3. PRESIDENT DASHBOARD (read-only oversight)
// =========================================================================
function PresidentDashboardView({ metrics }: { metrics: any }) {
    const kraPerformanceData = metrics.kra_performance ?? [];
    const unitComplianceData = metrics.unit_compliance ?? [];
    const totalUnitsTracked = metrics.total_units_tracked ?? 0;

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    label="Overall Completion"
                    value={metrics.overall_completion ?? '0%'}
                    valueClassName="font-mono"
                    style={{ color: BRAND.forest }}
                    icon={
                        <Target
                            className="h-5 w-5"
                            style={{ color: BRAND.forest }}
                        />
                    }
                />
                <StatCard
                    label="Key Result Areas"
                    value={metrics.total_kras ?? 0}
                    icon={
                        <BarChart3
                            className="h-5 w-5"
                            style={{ color: BRAND.gold }}
                        />
                    }
                />
                <div className="space-y-2 rounded-xl border border-red-100 bg-red-50/50 p-6 shadow-sm dark:border-red-900 dark:bg-red-950/20">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-red-800 dark:text-red-400">
                            Needs Attention
                        </span>
                        <ShieldAlert className="h-5 w-5 text-red-600" />
                    </div>
                    <p className="font-mono text-3xl font-bold tracking-tight text-red-600">
                        {metrics.critical_alerts ?? 0}
                    </p>
                    <p className="text-xs text-red-800/70 dark:text-red-400/70">
                        Overdue or rejected submissions
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm md:col-span-2">
                    <div>
                        <h3 className="font-serif text-lg leading-none font-semibold tracking-tight">
                            Progress by Key Result Area
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Completion percentage for the current academic year,
                            by KRA.
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
                                    cursor={{ fill: 'rgba(14, 59, 39, 0.05)' }}
                                    formatter={(value) => [
                                        `${value}%`,
                                        'Progress',
                                    ]}
                                />
                                <Bar
                                    dataKey="progress"
                                    fill={BRAND.forest}
                                    radius={[4, 4, 0, 0]}
                                    barSize={45}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm">
                    <div>
                        <h3 className="font-serif text-lg leading-none font-semibold tracking-tight">
                            Submission Status
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            How units' monthly reports are trending this period.
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
                                    {unitComplianceData.map(
                                        (entry: any, index: number) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ),
                                    )}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [value, 'Units']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute text-center">
                            <span className="font-mono text-3xl font-bold">
                                {totalUnitsTracked}
                            </span>
                            <p className="text-xs text-muted-foreground">
                                Total Units
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {unitComplianceData.map((item: any, index: number) => (
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
                                <span className="font-mono font-semibold">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-6"
                style={{ backgroundColor: BRAND.paper }}
            >
                <div className="space-y-1">
                    <h3 className="flex items-center gap-2 font-serif font-semibold">
                        <TrendingUp
                            className="h-4 w-4"
                            style={{ color: BRAND.forest }}
                        />
                        Full Report
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        See KPI-level detail across every unit and academic
                        year.
                    </p>
                </div>
                <a
                    href="/reports"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:opacity-90"
                    style={{ backgroundColor: BRAND.gold }}
                >
                    View Full Report
                </a>
            </div>
        </div>
    );
}

// =========================================================================
// Shared
// =========================================================================
function StatCard({
    label,
    value,
    icon,
    valueClassName = '',
    style,
}: {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    valueClassName?: string;
    style?: React.CSSProperties;
}) {
    return (
        <div className="space-y-2 rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                    {label}
                </span>
                {icon}
            </div>
            <p
                className={`text-3xl font-bold tracking-tight ${valueClassName}`}
                style={style}
            >
                {value}
            </p>
        </div>
    );
}
