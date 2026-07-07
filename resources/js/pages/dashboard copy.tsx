import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularProgress } from '@/components/circular-progress';
import { CheckCircle2, Clock, Plus, Sparkles } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

// --- Sample data — swap for real data from your Inertia page props ---

const productivity = [
    { day: 'Mon', tasks: 32 },
    { day: 'Tue', tasks: 48 },
    { day: 'Wed', tasks: 40 },
    { day: 'Thu', tasks: 61 },
    { day: 'Fri', tasks: 75 },
    { day: 'Sat', tasks: 54 },
    { day: 'Sun', tasks: 44 },
];

const upcomingTasks = [
    { title: 'Complete quarterly review', time: '10:00 AM', done: false },
    { title: 'Team sync with stakeholders', time: '12:00 PM', done: false },
    { title: 'Finalize roadmap draft', time: '2:30 PM', done: true },
    { title: 'Send client proposal', time: '4:15 PM', done: false },
];

const team = [
    { name: 'Jack Torino', fallback: 'JT' },
    { name: 'Ravena Cruz', fallback: 'RC' },
    { name: 'Milo Santos', fallback: 'MS' },
    { name: 'Ana Reyes', fallback: 'AR' },
];

const MANILA_TZ = 'Asia/Manila';

/** Returns the Mon–Sun week (as YYYY-MM-DD parts) containing "today" in the given IANA time zone. */
function getWeekInTimeZone(timeZone: string) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
    });

    const parts = formatter.formatToParts(new Date());
    const get = (type: string) =>
        parts.find((p) => p.type === type)?.value ?? '';
    const todayY = Number(get('year'));
    const todayM = Number(get('month'));
    const todayD = Number(get('day'));
    const todayWeekday = get('weekday'); // e.g. "Tue"

    const weekdayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayIndex = weekdayOrder.indexOf(todayWeekday);

    // Build a UTC-noon anchor for "today" so date math doesn't get pulled across a day by local DST/offsets.
    const anchor = Date.UTC(todayY, todayM - 1, todayD, 12);

    return weekdayOrder.map((label, i) => {
        const dayMs = anchor + (i - todayIndex) * 24 * 60 * 60 * 1000;
        const d = new Date(dayMs);
        return {
            label: label[0],
            date: d.getUTCDate(),
            active: i === todayIndex,
        };
    });
}

const week = getWeekInTimeZone(MANILA_TZ);

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Row 1 — Welcome + stat cards */}
                <div className="grid gap-4 md:grid-cols-12">
                    {/* Welcome banner */}
                    <Card className="relative overflow-hidden border-none bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 text-white md:col-span-6">
                        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
                        <div className="pointer-events-none absolute right-16 -bottom-16 h-32 w-32 rounded-full bg-white/5" />
                        <CardContent className="relative flex h-full flex-col justify-between gap-6 p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-emerald-100">
                                        Welcome back, Jack
                                    </p>
                                    <h2 className="mt-1 text-xl font-semibold">
                                        Here's your plan for today
                                    </h2>
                                    <p className="mt-2 max-w-xs text-sm text-emerald-100/80">
                                        You have{' '}
                                        {
                                            upcomingTasks.filter((t) => !t.done)
                                                .length
                                        }{' '}
                                        tasks left and 2 meetings scheduled.
                                    </p>
                                    <p className="mt-1 text-xs text-emerald-100/60">
                                        {new Intl.DateTimeFormat('en-PH', {
                                            timeZone: MANILA_TZ,
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                        }).format(new Date())}{' '}
                                        · Manila time
                                    </p>
                                </div>
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                {week.map((d) => (
                                    <div
                                        key={d.label + d.date}
                                        className={`flex w-10 flex-col items-center gap-1 rounded-lg py-2 text-xs ${
                                            d.active
                                                ? 'bg-white font-semibold text-emerald-700'
                                                : 'text-emerald-100'
                                        }`}
                                    >
                                        <span>{d.label}</span>
                                        <span>{d.date}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                size="sm"
                                variant="secondary"
                                className="w-fit gap-1.5 bg-white text-emerald-700 hover:bg-emerald-50"
                            >
                                <Plus className="h-4 w-4" />
                                New task
                            </Button>
                        </CardContent>
                    </Card>

                    {/* In progress */}
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                In progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <CircularProgress
                                value={50}
                                indicatorClassName="stroke-emerald-500"
                            >
                                <span className="text-sm font-semibold">
                                    50%
                                </span>
                            </CircularProgress>
                            <div>
                                <p className="text-2xl font-semibold">6/12</p>
                                <p className="text-sm text-muted-foreground">
                                    initiatives
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Completed */}
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Completed
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <CircularProgress
                                value={58}
                                indicatorClassName="stroke-teal-500"
                            >
                                <span className="text-sm font-semibold">
                                    58%
                                </span>
                            </CircularProgress>
                            <div>
                                <p className="text-2xl font-semibold">15/26</p>
                                <p className="text-sm text-muted-foreground">
                                    objectives
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Row 2 — Productivity chart + tasks/team */}
                <div className="grid flex-1 gap-4 md:grid-cols-12">
                    <Card className="md:col-span-8">
                        <CardHeader>
                            <CardTitle>Productivity metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={productivity}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="tasksGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="hsl(160 84% 39%)"
                                                stopOpacity={0.35}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="hsl(160 84% 39%)"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="day"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 8,
                                            border: '1px solid hsl(var(--border))',
                                            background: 'hsl(var(--card))',
                                            fontSize: 12,
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="tasks"
                                        stroke="hsl(160 84% 39%)"
                                        strokeWidth={2}
                                        fill="url(#tasksGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-4 md:col-span-4">
                        {/* Upcoming tasks */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming tasks</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {upcomingTasks.map((task) => (
                                    <div
                                        key={task.title}
                                        className="flex items-center gap-3"
                                    >
                                        {task.done ? (
                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                                        ) : (
                                            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`truncate text-sm ${task.done ? 'text-muted-foreground line-through' : ''}`}
                                            >
                                                {task.title}
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-xs text-muted-foreground">
                                            {task.time}
                                        </span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Team */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Team</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    {team.map((member) => (
                                        <Avatar
                                            key={member.name}
                                            className="h-8 w-8 border-2 border-background"
                                        >
                                            <AvatarImage
                                                src=""
                                                alt={member.name}
                                            />
                                            <AvatarFallback className="text-xs">
                                                {member.fallback}
                                            </AvatarFallback>
                                        </Avatar>
                                    ))}
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                                        +3
                                    </div>
                                </div>
                                <Badge variant="secondary">
                                    32h working time
                                </Badge>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
