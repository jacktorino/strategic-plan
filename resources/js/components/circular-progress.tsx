import { cn } from '@/lib/utils';

interface CircularProgressProps {
    value: number; // 0-100
    size?: number;
    strokeWidth?: number;
    className?: string;
    trackClassName?: string;
    indicatorClassName?: string;
    children?: React.ReactNode;
}

export function CircularProgress({
    value,
    size = 88,
    strokeWidth = 8,
    className,
    trackClassName,
    indicatorClassName,
    children,
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset =
        circumference -
        (Math.min(Math.max(value, 0), 100) / 100) * circumference;

    return (
        <div
            className={cn(
                'relative inline-flex items-center justify-center',
                className,
            )}
            style={{ width: size, height: size }}
        >
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="none"
                    className={cn('stroke-muted', trackClassName)}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={cn(
                        'stroke-primary transition-all duration-700 ease-out',
                        indicatorClassName,
                    )}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
}
