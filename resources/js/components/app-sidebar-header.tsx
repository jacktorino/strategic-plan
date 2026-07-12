import { useState } from 'react';
import { Search } from 'lucide-react';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

const MONTHS = [
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

export type AcademicYearOption = {
    id: number | string;
    label: string; // e.g. "AY 2024-2025"
};

export function AppSidebarHeader({
    breadcrumbs = [],
    academicYears = [],
    selectedAcademicYearId,
    onAcademicYearChange,
    selectedMonth,
    onMonthChange,
    searchValue,
    onSearchChange,
}: {
    breadcrumbs?: BreadcrumbItemType[];
    academicYears?: AcademicYearOption[];
    selectedAcademicYearId?: number | string;
    onAcademicYearChange?: (id: string) => void;
    selectedMonth?: number; // 1-12
    onMonthChange?: (month: number) => void;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
}) {
    // Uncontrolled fallbacks so this still works if a parent doesn't wire
    // props in yet.
    const [internalMonth, setInternalMonth] = useState<number>(
        selectedMonth ?? new Date().getMonth() + 1,
    );
    const [internalSearch, setInternalSearch] = useState(searchValue ?? '');

    const activeMonth = selectedMonth ?? internalMonth;
    const searchText = searchValue ?? internalSearch;

    function handleMonthClick(month: number) {
        if (onMonthChange) {
            onMonthChange(month);
        } else {
            setInternalMonth(month);
        }
    }

    function handleSearchChange(value: string) {
        if (onSearchChange) {
            onSearchChange(value);
        } else {
            setInternalSearch(value);
        }
    }

    return (
        <header className="flex h-16 shrink-0 flex-wrap items-center gap-3 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-3">
                <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search KPIs, units..."
                        value={searchText}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="h-9 w-48 pl-8 lg:w-64"
                    />
                </div>

                <div className="flex items-center overflow-x-auto rounded-md border p-0.5">
                    {MONTHS.map((label, index) => {
                        const month = index + 1;
                        const isActive = month === activeMonth;
                        return (
                            <button
                                key={label}
                                type="button"
                                onClick={() => handleMonthClick(month)}
                                aria-pressed={isActive}
                                className={`rounded px-2 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                <Select
                    value={selectedAcademicYearId?.toString()}
                    onValueChange={onAcademicYearChange}
                >
                    <SelectTrigger className="h-9 w-40">
                        <SelectValue placeholder="Academic Year" />
                    </SelectTrigger>
                    <SelectContent>
                        {academicYears.map((year) => (
                            <SelectItem
                                key={year.id}
                                value={year.id.toString()}
                            >
                                {year.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </header>
    );
}
