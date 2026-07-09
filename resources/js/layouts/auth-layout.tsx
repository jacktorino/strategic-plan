// resources/js/layouts/auth-layout.tsx
import { createContext, useContext } from 'react';
import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
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
    Sun,
    Moon,
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

const THEME_KEY = 'auth-layout-theme';

type Props = {
    children: React.ReactNode;
    title?: string;
    description?: string;
};

// Theme context — scoped to auth pages only, not the global app theme.
type AuthThemeContextType = {
    isDark: boolean;
    toggleTheme: () => void;
};

const AuthThemeContext = createContext<AuthThemeContextType | null>(null);

export function useAuthTheme() {
    const ctx = useContext(AuthThemeContext);
    if (!ctx) {
        throw new Error('useAuthTheme must be used within AuthLayout');
    }
    return ctx;
}

export default function AuthLayout({ children, title, description }: Props) {
    // Local, page-scoped theme state — does not touch any app-wide theme provider.
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') return false; // default: light
        const saved = window.localStorage.getItem(THEME_KEY);
        return saved === 'dark'; // only dark if explicitly saved as dark
    });

    const toggleTheme = () => {
        setIsDark((prev) => {
            const next = !prev;
            window.localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
            return next;
        });
    };

    return (
        <AuthThemeContext.Provider value={{ isDark, toggleTheme }}>
            <div
                className={
                    'relative grid min-h-dvh w-full flex-col items-stretch px-4 transition-colors duration-300 sm:px-6 lg:max-w-none lg:grid-cols-2 lg:px-0 ' +
                    (isDark
                        ? 'bg-[#262624] text-zinc-100'
                        : 'bg-zinc-50 text-zinc-900')
                }
            >
                {/* ===== FULL-PAGE BACKGROUND LAYER (spans both panels) ===== */}

                {/* grid backdrop, full page */}
                <div
                    className={
                        'pointer-events-none absolute inset-0 z-0 ' +
                        (isDark ? 'opacity-[0.4]' : 'opacity-[0.4]')
                    }
                    style={{
                        backgroundImage: isDark
                            ? 'linear-gradient(to right, rgba(34,197,94,.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,197,94,.18) 1px, transparent 1px)'
                            : 'linear-gradient(to right, rgba(0,0,0,.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,.18) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* top accent line, full page width */}
                <div className="absolute top-0 left-0 z-10 h-1 w-full bg-gradient-to-r from-green-500 via-emerald-400 to-lime-400" />

                {/* theme toggle button */}
                <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={
                        isDark ? 'Switch to light mode' : 'Switch to dark mode'
                    }
                    className={
                        'absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-colors ' +
                        (isDark
                            ? 'border-green-500/25 bg-zinc-800/80 text-green-300 hover:bg-zinc-700/80'
                            : 'border-green-600/20 bg-white text-green-700 hover:bg-zinc-100')
                    }
                >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>

                {/* typewriter header, full page width */}
                <div className="absolute top-8 left-0 z-10 hidden w-full justify-center px-6 lg:flex">
                    <div className="typewriter-wrapper">
                        <span
                            className={
                                'typewriter-text text-lg font-semibold tracking-wide ' +
                                (isDark ? 'text-green-300' : 'text-green-700')
                            }
                        >
                            Welcome to University of the Visayas......
                        </span>
                    </div>
                </div>

                {/* orbit field: centered on mobile (single column), pinned to the left half on desktop to orbit around the logo */}
                <div className="pointer-events-none absolute inset-y-0 left-0 z-0 flex w-full scale-[0.5] items-center justify-center opacity-60 sm:scale-75 sm:opacity-80 lg:w-1/2 lg:scale-100 lg:opacity-100">
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
                                    <div
                                        className={
                                            'orbit-counter flex items-center justify-center rounded-full border p-2 shadow-lg backdrop-blur ' +
                                            (isDark
                                                ? 'border-green-500/25 bg-zinc-800/80'
                                                : 'border-green-600/20 bg-white/90')
                                        }
                                    >
                                        <Icon
                                            style={{
                                                width: size,
                                                height: size,
                                            }}
                                            className={
                                                isDark
                                                    ? 'text-green-400'
                                                    : 'text-green-600'
                                            }
                                        />
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>

                {/* logo + wordmark: centered on mobile (single column), pinned to the left half on desktop */}
                <Link
                    href={home()}
                    className="pointer-events-none absolute inset-y-0 left-0 z-0 flex w-full flex-col items-center justify-center lg:pointer-events-auto lg:w-1/2"
                >
                    <AppLogoIcon
                        className={
                            'h-40 w-40 fill-current drop-shadow-[0_0_35px_rgba(34,197,94,.5)] ' +
                            (isDark ? 'text-green-400' : 'text-green-600')
                        }
                    />
                    <span
                        className={
                            'mt-6 text-xl font-bold ' +
                            (isDark ? 'text-green-300' : 'text-green-700')
                        }
                    >
                        STRATEGIC PLAN
                    </span>
                </Link>

                {/* PAGE-WIDE abstract SVG footer, spans both panels */}
                <svg
                    className="pointer-events-none absolute bottom-0 left-0 z-0 h-16 w-full sm:h-24 lg:h-auto"
                    viewBox="0 0 2880 320"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill="#22c55e"
                        fillOpacity={isDark ? '0.06' : '0.08'}
                        d="M0,224 C 360,272 720,160 1080,176 C 1440,192 1800,288 2160,272 C 2520,256 2700,208 2880,192 L2880,320 L0,320 Z"
                    />
                    <path
                        fill="#22c55e"
                        fillOpacity={isDark ? '0.1' : '0.13'}
                        d="M0,256 C 400,300 760,208 1120,224 C 1480,240 1840,304 2200,288 C 2560,272 2720,240 2880,224 L2880,320 L0,320 Z"
                    />
                    <path
                        fill="#22c55e"
                        fillOpacity={isDark ? '0.16' : '0.18'}
                        d="M0,288 C 440,320 800,256 1200,264 C 1600,272 1960,320 2320,304 C 2600,292 2760,272 2880,264 L2880,320 L0,320 Z"
                    />
                </svg>

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
                    border-right: 2px solid rgba(74,222,128,.9);
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
                    50% { border-color: rgba(74,222,128,.9); }
                }
            `}</style>

                {/* ===== LEFT COLUMN (empty spacer on desktop, lets the full-page bg show through) ===== */}
                <div className="relative hidden min-h-[100dvh] lg:block" />

                {/* ===== RIGHT COLUMN (the actual card content) ===== */}
                <div className="relative z-20 flex min-h-[100dvh] w-full flex-col">
                    <div className="relative z-20 mx-auto flex w-full flex-1 flex-col items-center justify-center px-2 py-10 sm:px-4 lg:py-8">
                        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                            <Link
                                href={home()}
                                className="relative z-20 flex items-center justify-center lg:hidden"
                            >
                                <AppLogoIcon
                                    className={
                                        'h-10 fill-current sm:h-12 ' +
                                        (isDark
                                            ? 'text-green-400'
                                            : 'text-green-600')
                                    }
                                />
                            </Link>
                            {(title || description) && (
                                <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                                    {title && (
                                        <h1
                                            className={
                                                'text-xl font-medium ' +
                                                (isDark
                                                    ? 'text-zinc-100'
                                                    : 'text-zinc-900')
                                            }
                                        >
                                            {title}
                                        </h1>
                                    )}
                                    {description && (
                                        <p
                                            className={
                                                'text-sm text-balance ' +
                                                (isDark
                                                    ? 'text-zinc-400'
                                                    : 'text-zinc-500')
                                            }
                                        >
                                            {description}
                                        </p>
                                    )}
                                </div>
                            )}
                            {children}
                        </div>
                    </div>

                    <p
                        className={
                            'relative z-20 pt-2 pb-4 text-center text-xs ' +
                            (isDark ? 'text-zinc-500' : 'text-zinc-400')
                        }
                    >
                        &copy; {new Date().getFullYear()} University of the
                        Visayas. All rights reserved.
                    </p>
                </div>
            </div>
        </AuthThemeContext.Provider>
    );
}
