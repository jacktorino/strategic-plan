// resources/js/components/app-sidebar.tsx
import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    CalendarRange,
    CheckSquare,
    ClipboardList,
    FilePlus2,
    Gauge,
    GraduationCap,
    LayoutGrid,
    LifeBuoy,
    Target,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
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

// President — read-only, institution-wide oversight
const presidentNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: 'Key Result Areas', href: '/kras', icon: Target },
    { title: 'KPI Tracker', href: '/kpis', icon: Gauge },
    { title: 'Action Plans', href: '/action-plans', icon: ClipboardList },
    { title: 'Responsible Units', href: '/units', icon: Users },
    { title: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
    { title: 'Academic Years', href: '/academic-years', icon: CalendarRange },
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
    { title: 'My Action Plans', href: '/my/action-plans', icon: CheckSquare },
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

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const mainNavItems = getNavItemsForRole(auth.user?.role);

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
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
