import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

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
                className="flex min-h-screen flex-col bg-[#F6F4EE] text-[#12231B]"
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
                <main className="mx-auto flex max-w-6xl flex-1 items-center px-6 lg:px-10">
                    <div className="max-w-xl">
                        <p
                            className="mb-4 text-[12px] tracking-[0.14em] text-[#2F7A4F] uppercase"
                            style={{
                                fontFamily: "'IBM Plex Mono', monospace",
                            }}
                        >
                            University of the Visayas
                        </p>
                        <h1
                            className="text-[2.5rem] leading-[1.08] font-medium text-[#0E3B27] lg:text-[3.1rem]"
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            Strategic Plan
                            <br />
                            Monitoring System
                        </h1>
                        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#3c4a43]">
                            Sign in to view and manage your unit's progress
                            against the university's strategic plan.
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
                        </div>
                    </div>
                </main>

                <footer className="border-t border-[#DAD6C8] px-6 py-6 text-center text-[12px] text-[#8a948d] lg:px-10">
                    University of the Visayas
                </footer>
            </div>
        </>
    );
}
