import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { NavFooter } from '@/components/nav-footer';

const MANILA_TZ = 'Asia/Manila';

/** Philippine AY runs roughly Aug–May/June, so anything from August onward belongs to the year that starts that August. */
function getCurrentAcademicYear(timeZone: string) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: 'numeric',
    }).formatToParts(new Date());
    const year = Number(parts.find((p) => p.type === 'year')?.value);
    const month = Number(parts.find((p) => p.type === 'month')?.value);
    const startYear = month >= 8 ? year : year - 1;
    return { startYear, label: `${startYear}–${startYear + 1}` };
}

const kras = [
    {
        number: '01',
        title: 'Governance, Management & Leadership',
        sections: 8,
        kpis: 22,
    },
    {
        number: '02',
        title: 'Research & Knowledge Management',
        sections: 3,
        kpis: 15,
    },
    {
        number: '03',
        title: 'Teaching & Learning',
        sections: 4,
        kpis: 19,
    },
    {
        number: '04',
        title: 'Community & Industry Linkages',
        sections: 3,
        kpis: 11,
    },
    {
        number: '05',
        title: 'Student & Stakeholder Engagement',
        sections: 8,
        kpis: 19,
    },
];

const ayCycle = ['2023–24', '2024–25', '2025–26'];

const roles = [
    {
        label: 'President',
        does: 'Reviews progress across every KRA at a glance — no data entry, just the standing of the plan.',
    },
    {
        label: 'Admin',
        does: 'Assigns KPIs and action items to units, reviews proposed additions, keeps the master plan current.',
    },
    {
        label: 'Responsible unit',
        does: 'Reports status on assigned action items and can propose new KPIs for its own area.',
    },
];

export default function Welcome() {
    const { auth } = usePage().props;
    const ay = getCurrentAcademicYear(MANILA_TZ);
    const currentIndex = ayCycle.findIndex((c) =>
        c.startsWith(String(ay.startYear).slice(2)),
    );
    const yearIndex = currentIndex === -1 ? ayCycle.length - 1 : currentIndex;

    return (
        <>
            <Head title="Strategic Plan Monitor">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,560;9..144,650&family=Public+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div
                className="min-h-screen bg-[#F6F4EE] text-[#12231B]"
                style={{
                    fontFamily:
                        "'Public Sans', ui-sans-serif, system-ui, sans-serif",
                }}
            >
                {/* Header */}
                <header className="border-b border-[#DAD6C8]">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-10">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0E3B27] text-[13px] font-semibold text-[#F6F4EE]"
                                style={{
                                    fontFamily: "'IBM Plex Mono', monospace",
                                }}
                            >
                                UV
                            </div>
                            <div className="leading-tight">
                                <p className="text-[13px] font-medium">
                                    University of the Visayas
                                </p>
                                <p
                                    className="text-[11px] tracking-wide text-[#4b5a52] uppercase"
                                    style={{
                                        fontFamily:
                                            "'IBM Plex Mono', monospace",
                                    }}
                                >
                                    Strategic Plan Monitor
                                </p>
                            </div>
                        </div>

                        <nav className="flex items-center gap-3 text-sm">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-full bg-[#0E3B27] px-5 py-2 font-medium text-[#F6F4EE] transition-colors hover:bg-[#2F7A4F]"
                                >
                                    Go to dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-full border border-[#0E3B27]/25 px-5 py-2 font-medium transition-colors hover:border-[#0E3B27]/60"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="rounded-full bg-[#0E3B27] px-5 py-2 font-medium text-[#F6F4EE] transition-colors hover:bg-[#2F7A4F]"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero */}
                <main className="mx-auto max-w-6xl px-6 pt-14 pb-20 lg:px-10 lg:pt-20">
                    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                        {/* Left: thesis */}
                        <div className="opacity-100 transition-opacity duration-700 lg:col-span-6 starting:opacity-0">
                            <p
                                className="mb-4 text-[12px] tracking-[0.14em] text-[#2F7A4F] uppercase"
                                style={{
                                    fontFamily: "'IBM Plex Mono', monospace",
                                }}
                            >
                                AY {ay.label} · Year {yearIndex + 1} of{' '}
                                {ayCycle.length}
                            </p>
                            <h1
                                className="text-[2.5rem] leading-[1.08] font-medium text-[#0E3B27] lg:text-[3.1rem]"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                Five key result areas.
                                <br />
                                One institutional scorecard.
                            </h1>
                            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#3c4a43]">
                                Every commitment in UV's{' '}
                                {ay.label.split('–')[0] ? 'AY 2023–2026' : ''}{' '}
                                strategic plan — governance to student
                                engagement — tracked in one place, reported by
                                the units responsible for it.
                            </p>

                            <div className="mt-8 flex items-center gap-4">
                                {!auth.user && (
                                    <Link
                                        href={login()}
                                        className="rounded-full bg-[#0E3B27] px-6 py-3 text-sm font-medium text-[#F6F4EE] transition-colors hover:bg-[#2F7A4F]"
                                    >
                                        Log in to your dashboard
                                    </Link>
                                )}
                                <span
                                    className="text-[13px] text-[#4b5a52]"
                                    style={{
                                        fontFamily:
                                            "'IBM Plex Mono', monospace",
                                    }}
                                >
                                    86 KPIs · 118 action commitments
                                </span>
                            </div>
                        </div>

                        {/* Right: signature ledger card */}
                        <div className="opacity-100 transition-opacity delay-150 duration-700 lg:col-span-6 starting:opacity-0">
                            <div className="rounded-lg border border-[#DAD6C8] bg-white/60 p-6 shadow-[0_1px_0_0_rgba(14,59,39,0.06)] lg:p-8">
                                <div className="flex items-baseline justify-between border-b border-[#DAD6C8] pb-4">
                                    <p
                                        className="text-[13px] font-medium tracking-wide text-[#0E3B27] uppercase"
                                        style={{
                                            fontFamily:
                                                "'IBM Plex Mono', monospace",
                                        }}
                                    >
                                        Strategic Plan
                                    </p>
                                    <p
                                        className="text-[13px] text-[#4b5a52]"
                                        style={{
                                            fontFamily:
                                                "'IBM Plex Mono', monospace",
                                        }}
                                    >
                                        AY 2023–2026
                                    </p>
                                </div>

                                <ul className="divide-y divide-[#DAD6C8]">
                                    {kras.map((kra) => (
                                        <li
                                            key={kra.number}
                                            className="flex items-center gap-4 py-3"
                                        >
                                            <span
                                                className="text-[13px] text-[#B9902E]"
                                                style={{
                                                    fontFamily:
                                                        "'IBM Plex Mono', monospace",
                                                }}
                                            >
                                                {kra.number}
                                            </span>
                                            <span className="flex-1 text-[13.5px] leading-snug">
                                                {kra.title}
                                            </span>
                                            <span
                                                className="shrink-0 text-[11.5px] text-[#4b5a52]"
                                                style={{
                                                    fontFamily:
                                                        "'IBM Plex Mono', monospace",
                                                }}
                                            >
                                                {kra.sections} areas ·{' '}
                                                {kra.kpis} KPIs
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-5 border-t border-[#DAD6C8] pt-4">
                                    <div className="flex items-center gap-1.5">
                                        {ayCycle.map((label, i) => (
                                            <div key={label} className="flex-1">
                                                <div
                                                    className={`h-1.5 rounded-full ${
                                                        i <= yearIndex
                                                            ? 'bg-[#2F7A4F]'
                                                            : 'bg-[#DAD6C8]'
                                                    }`}
                                                />
                                                <p
                                                    className={`mt-1.5 text-[10.5px] ${
                                                        i === yearIndex
                                                            ? 'font-medium text-[#0E3B27]'
                                                            : 'text-[#8a948d]'
                                                    }`}
                                                    style={{
                                                        fontFamily:
                                                            "'IBM Plex Mono', monospace",
                                                    }}
                                                >
                                                    {label}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Roles */}
                    <div className="mt-20 border-t border-[#DAD6C8] pt-10">
                        <p
                            className="mb-6 text-[12px] tracking-[0.14em] text-[#4b5a52] uppercase"
                            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                        >
                            Three ways to work inside the plan
                        </p>
                        <div className="grid gap-8 sm:grid-cols-3">
                            {roles.map((role) => (
                                <div key={role.label}>
                                    <h3
                                        className="mb-2 text-[17px] font-medium text-[#0E3B27]"
                                        style={{
                                            fontFamily: "'Fraunces', serif",
                                        }}
                                    >
                                        {role.label}
                                    </h3>
                                    <p className="text-[13.5px] leading-relaxed text-[#3c4a43]">
                                        {role.does}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
