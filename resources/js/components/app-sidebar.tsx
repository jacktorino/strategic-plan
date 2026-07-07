import { Link } from '@inertiajs/react';
import {
    BarChart3,
    CalendarRange,
    ClipboardList,
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
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Key Result Areas',
        href: '/kras',
        icon: Target,
    },
    {
        title: 'KPI Tracker',
        href: '/kpis',
        icon: Gauge,
    },
    {
        title: 'Action Plans',
        href: '/action-plans',
        icon: ClipboardList,
    },
    {
        title: 'Responsible Units',
        href: '/units',
        icon: Users,
    },
    {
        title: 'Reports & Analytics',
        href: '/reports',
        icon: BarChart3,
    },
    {
        title: 'Academic Years',
        href: '/academic-years',
        icon: CalendarRange,
    },
];

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

export function AppSidebar() {
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
