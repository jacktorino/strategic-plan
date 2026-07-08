import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import {
    Landmark,
    Users,
    GraduationCap,
    Cpu,
    Wallet,
    FlaskConical,
    BookOpen,
    Megaphone,
    HeartHandshake,
    Globe,
    Trophy,
    Palette,
} from 'lucide-react';

const orbitIcons = [
    { Icon: Landmark, radius: 210, duration: 22, delay: 0, size: 28 },
    { Icon: Users, radius: 210, duration: 22, delay: -3.7, size: 26 },
    { Icon: GraduationCap, radius: 210, duration: 22, delay: -7.3, size: 30 },
    { Icon: Cpu, radius: 210, duration: 22, delay: -11, size: 26 },
    { Icon: Wallet, radius: 210, duration: 22, delay: -14.7, size: 26 },
    { Icon: FlaskConical, radius: 210, duration: 22, delay: -18.3, size: 28 },
    { Icon: BookOpen, radius: 280, duration: 30, delay: -2, size: 28 },
    { Icon: Megaphone, radius: 280, duration: 30, delay: -7, size: 26 },
    { Icon: HeartHandshake, radius: 280, duration: 30, delay: -12, size: 28 },
    { Icon: Globe, radius: 280, duration: 30, delay: -17, size: 26 },
    { Icon: Trophy, radius: 280, duration: 30, delay: -22, size: 26 },
    { Icon: Palette, radius: 280, duration: 30, delay: -27, size: 26 },
];

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid min-h-dvh w-full flex-col items-stretch px-4 sm:px-6 lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* LEFT PANEL */}
            <div className="relative hidden min-h-[100dvh] items-center justify-center overflow-hidden bg-white text-green-900 lg:flex dark:border-r">
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, #14532d 1px, transparent 1px), linear-gradient(to bottom, #14532d 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />

                <div className="absolute top-12 left-0 z-20 flex w-full justify-center px-6">
                    <div className="typewriter-wrapper">
                        <span className="typewriter-text text-lg font-semibold tracking-wide text-green-900">
                            Welcome to University of the Visayas......
                        </span>
                    </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-0 w-0">
                        {orbitIcons.map(
                            ({ Icon, radius, duration, delay, size }, i) => (
                                <div
                                    key={i}
                                    className="orbit-wrapper absolute top-0 left-0"
                                    style={
                                        {
                                            '--radius': `${radius}px`,
                                            '--duration': `${duration}s`,
                                            '--delay': `${delay}s`,
                                        } as React.CSSProperties
                                    }
                                >
                                    <div className="orbit-counter flex items-center justify-center rounded-full border border-green-900/10 bg-green-50 p-2 shadow-sm">
                                        <Icon
                                            style={{
                                                width: size,
                                                height: size,
                                            }}
                                            className="text-green-800/70"
                                        />
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>

                <Link
                    href={home()}
                    className="relative z-20 flex flex-col items-center justify-center"
                >
                    <AppLogoIcon className="h-40 w-40 fill-current text-green-900" />
                    <span className="mt-6 text-xl font-bold text-green-900">
                        STRATEGIC PLAN
                    </span>
                </Link>

                <style>{`
                    .orbit-wrapper {
                        animation: orbit-spin var(--duration) linear infinite;
                        animation-delay: var(--delay);
                    }
                    .orbit-counter {
                        animation: orbit-counter-spin var(--duration) linear infinite;
                        animation-delay: var(--delay);
                    }
                    @keyframes orbit-spin {
                        from { transform: rotate(0deg) translateX(var(--radius)) rotate(0deg); }
                        to { transform: rotate(360deg) translateX(var(--radius)) rotate(360deg); }
                    }
                    @keyframes orbit-counter-spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(-360deg); }
                    }
                    .typewriter-wrapper {
                        display: inline-block;
                        max-width: 100%;
                    }
                    .typewriter-text {
                        display: inline-block;
                        overflow: hidden;
                        white-space: nowrap;
                        border-right: 2px solid rgba(20, 83, 45, 0.75);
                        width: 0;
                        animation:
                            typing 3.5s steps(34, end) infinite,
                            blink-caret 0.75s step-end infinite;
                        animation-fill-mode: forwards;
                    }
                    @keyframes typing {
                        0% { width: 0; }
                        60% { width: 34ch; }
                        85% { width: 34ch; }
                        100% { width: 0; }
                    }
                    @keyframes blink-caret {
                        from, to { border-color: transparent; }
                        50% { border-color: rgba(20, 83, 45, 0.75); }
                    }
                `}</style>
            </div>

            {/* RIGHT PANEL */}
            <div className="relative flex min-h-[100dvh] w-full flex-col lg:p-8">
                {/* faint grid to echo the left panel, kept very subtle */}
                <div
                    className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, #14532d 1px, transparent 1px), linear-gradient(to bottom, #14532d 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />

                <div className="relative z-20 mx-auto flex w-full flex-1 flex-col items-center justify-center px-2 py-10 sm:px-4 lg:py-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <Link
                            href={home()}
                            className="relative z-20 flex items-center justify-center lg:hidden"
                        >
                            <AppLogoIcon className="h-10 fill-current text-black sm:h-12" />
                        </Link>
                        <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-sm text-balance text-muted-foreground">
                                {description}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>

                {/* small footer note to balance the panel */}
                <p className="relative z-20 pt-2 pb-4 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} University of the Visayas.
                    All rights reserved.
                </p>
            </div>

            {/* PAGE-WIDE abstract SVG footer, spans both panels */}
            <svg
                className="pointer-events-none absolute bottom-0 left-0 z-0 h-16 w-full sm:h-24 lg:h-auto"
                viewBox="0 0 2880 320"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill="#14532d"
                    fillOpacity="0.08"
                    d="M0,224 C 360,272 720,160 1080,176 C 1440,192 1800,288 2160,272 C 2520,256 2700,208 2880,192 L2880,320 L0,320 Z"
                />
                <path
                    fill="#166534"
                    fillOpacity="0.14"
                    d="M0,256 C 400,300 760,208 1120,224 C 1480,240 1840,304 2200,288 C 2560,272 2720,240 2880,224 L2880,320 L0,320 Z"
                />
                <path
                    fill="#14532d"
                    fillOpacity="0.22"
                    d="M0,288 C 440,320 800,256 1200,264 C 1600,272 1960,320 2320,304 C 2600,292 2760,272 2880,264 L2880,320 L0,320 Z"
                />
            </svg>
        </div>
    );
}
