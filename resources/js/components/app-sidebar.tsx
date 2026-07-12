// resources/js/components/app-sidebar.tsx
import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    CalendarRange,
    CheckSquare,
    ChevronRight,
    ClipboardList,
    FilePlus2,
    Gauge,
    GraduationCap,
    LayoutGrid,
    LifeBuoy,
    Target,
    UserCheck,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { dashboard } from '@/routes';
import type { NavItem, SharedData } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Help & Support',
        href: '/support',
        icon: LifeBuoy,
    },
    {
        title: 'UV Website',
        href: 'https://www.uv.edu.ph',
        icon: GraduationCap,
    },
];

// ---------------------------------------------------------------------------
// Key Result Areas — used to build the president's "Key Result Areas" menu.
// Each sub-area links to a report page for that responsible area, e.g.
// /reports/kras/1.1, which is expected to show the KRA's progress reports /
// exported spreadsheet and the people/units involved.
// ---------------------------------------------------------------------------
type KraSubArea = {
    code: string;
    title: string;
};

type Kra = {
    number: number;
    title: string;
    reference: string;
    subAreas: KraSubArea[];
};

const keyResultAreas: Kra[] = [
    {
        number: 1,
        title: 'Efficient and Effective Governance, Management and Leadership',
        reference: 'Mission #4 and QO #4',
        subAreas: [
            { code: '1.1', title: 'Governance' },
            { code: '1.2', title: 'Leadership' },
            { code: '1.3', title: 'Human Resources Learning and Development' },
            { code: '1.4', title: 'Communication' },
            { code: '1.5', title: 'Physical Plant and Facilities' },
            { code: '1.6', title: 'ICT' },
            { code: '1.7', title: 'Finance' },
            { code: '1.8', title: 'Accreditation & Certification' },
        ],
    },
    {
        number: 2,
        title: 'Quality Research and Knowledge Management',
        reference: 'Mission #1 and QO #3',
        subAreas: [
            {
                code: '2.1',
                title: 'Research Production, Dissemination, Utilization',
            },
            { code: '2.2', title: 'Knowledge Management' },
            { code: '2.3', title: 'Library' },
        ],
    },
    {
        number: 3,
        title: 'Innovative and Excellent Teaching and Learning',
        reference: 'Mission #2 and QO #2',
        subAreas: [
            { code: '3.1', title: 'Faculty' },
            { code: '3.2', title: 'Instruction' },
            { code: '3.3', title: 'Innovative Education' },
            { code: '3.4', title: 'Employability' },
        ],
    },
    {
        number: 4,
        title: 'Sustained Social Responsibility, Community Involvement and Industry Linkages',
        reference: 'Mission #3 and QO #1',
        subAreas: [
            { code: '4.1', title: 'Community Extension' },
            { code: '4.2', title: 'Philippine Linkages' },
            { code: '4.3', title: 'International Linkages' },
        ],
    },
    {
        number: 5,
        title: 'Holistic Engagement with Students and Other Stakeholders',
        reference: 'Mission #4 and QO #5',
        subAreas: [
            { code: '5.1', title: 'PR and Marketing' },
            { code: '5.2', title: 'Customer Feedback' },
            { code: '5.3', title: 'Guidance & Counseling' },
            { code: '5.4', title: 'Student Development & Discipline' },
            { code: '5.5', title: 'Gender and Development Program' },
            { code: '5.6', title: 'Sports Development' },
            { code: '5.7', title: 'Arts & Culture Development' },
            { code: '5.8', title: 'Alumni Relations' },
        ],
    },
];

// President — read-only, institution-wide oversight
const presidentNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    // { title: 'KPI Tracker', href: '/kpis', icon: Gauge },
    // { title: 'Action Plans', href: '/action-plans', icon: ClipboardList },
    // { title: 'Responsible Units', href: '/units', icon: Users },
    // { title: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
    // { title: 'Academic Years', href: '/academic-years', icon: CalendarRange },
];

// Admin — creates/assigns KPIs and action plans, manages units, approves proposals
const adminNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: 'Key Result Areas', href: '/admin/kras', icon: Target },
    { title: 'KPI Management', href: '/admin/kpis', icon: Gauge },
    {
        title: 'Assign Action Plans',
        href: '/admin/action-plans',
        icon: ClipboardList,
    },
    { title: 'Units', href: '/admin/units', icon: Users },
    { title: 'KPI Proposals', href: '/admin/kpi-submissions', icon: FilePlus2 },
    { title: 'Approve Accounts', href: '/admin/accounts', icon: UserCheck },
    { title: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3 },
    {
        title: 'Academic Years',
        href: '/admin/academic-years',
        icon: CalendarRange,
    },
];

// Unit / Staff — sees only their own assigned work, reports progress, proposes new KPIs
const unitNavItems: NavItem[] = [
    { title: 'My Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: 'My KPIs', href: '/my/kpis', icon: Gauge },
    // { title: 'My Action Plans', href: '/my/action-plans', icon: CheckSquare },
    {
        title: 'Propose a KPI',
        href: '/my/kpi-submissions/create',
        icon: FilePlus2,
    },
    { title: 'My Reports', href: '/my/reports', icon: BarChart3 },
];

function getNavItemsForRole(role: string | undefined): NavItem[] {
    switch (role) {
        case 'admin':
            return adminNavItems;
        case 'staff': // Updated from 'unit' to match backend UserRole enum
            return unitNavItems;
        case 'president':
        default:
            return presidentNavItems;
    }
}

// Displays each KRA and its responsible areas; each area links to that
// area's reports / exported spreadsheet and the people/units involved.
// Titles can be long and get truncated by the sidebar layout, so every
// truncated label is wrapped in a shadcn Tooltip — hovering (or
// focusing via keyboard) reveals the full text in a styled popover
// that matches the rest of the app, rather than the plain OS tooltip.
function NavKeyResultAreas() {
    return (
        <TooltipProvider delayDuration={200}>
            <SidebarGroup>
                <SidebarGroupLabel>Key Result Areas</SidebarGroupLabel>
                <SidebarMenu>
                    {keyResultAreas.map((kra) => {
                        const kraLabel = `KRA ${kra.number}: ${kra.title}`;
                        const kraTooltip = `${kraLabel} (${kra.reference})`;

                        return (
                            <Collapsible
                                key={kra.number}
                                defaultOpen={false}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    {/*
                                  SidebarMenuButton's `tooltip` prop already
                                  renders a shadcn Tooltip internally, but it
                                  only shows while the sidebar is collapsed
                                  to icons. We wrap it in our own Tooltip too
                                  so the full title is also reachable on
                                  hover while the sidebar is expanded and
                                  the label is truncated.
                                */}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton
                                                    tooltip={kraTooltip}
                                                >
                                                    <Target />
                                                    <span className="truncate">
                                                        {kraLabel}
                                                    </span>
                                                    <ChevronRight className="ml-auto shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="right"
                                            align="start"
                                        >
                                            {kraTooltip}
                                        </TooltipContent>
                                    </Tooltip>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {kra.subAreas.map((area) => {
                                                const areaLabel = `${area.code} ${area.title}`;

                                                return (
                                                    <SidebarMenuSubItem
                                                        key={area.code}
                                                    >
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <SidebarMenuSubButton
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={`/reports/kras/${area.code}`}
                                                                    >
                                                                        <span className="truncate">
                                                                            {
                                                                                areaLabel
                                                                            }
                                                                        </span>
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </TooltipTrigger>
                                                            <TooltipContent
                                                                side="right"
                                                                align="start"
                                                            >
                                                                {areaLabel}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </SidebarMenuSubItem>
                                                );
                                            })}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroup>
        </TooltipProvider>
    );
}

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const role = auth.user?.role;
    const mainNavItems = getNavItemsForRole(role);
    const isPresident = role === 'president' || role === undefined;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {isPresident && <NavKeyResultAreas />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
