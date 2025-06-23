import { NavFooter } from '@/components/Navigation/UserNavigation/nav-footer';
import { NavMain } from '@/components/Navigation/UserNavigation/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Store, 
    Users, 
    BarChart3, 
    Settings,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
    TrendingUp,
    List,
    Bell
} from 'lucide-react';
import AppLogo from '../SideBar/app-logo';

const adminMainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
        icon: LayoutDashboard,
    },
    {
        title: 'Orders',
        href: route('admin.orders.index'),
        icon: ShoppingBag,
        children: [
            {
                title: 'All Orders',
                href: route('admin.orders.index'),
                icon: List,
            },
            {
                title: 'Statistics',
                href: route('admin.orders.statistics'),
                icon: TrendingUp,
            },
        ],
    },
    {
        title: 'Restaurants',
        href: route('admin.restaurants.index'),
        icon: Store,
        children: [
            {
                title: 'All Restaurants',
                href: route('admin.restaurants.index'),
                icon: List,
            },
            {
                title: 'Statistics',
                href: route('admin.restaurants.statistics'),
                icon: TrendingUp,
            },
        ],
    },
    {
        title: 'Users',
        href: route('admin.users.index'),
        icon: Users,
        children: [
            {
                title: 'All Users',
                href: route('admin.users.index'),
                icon: List,
            },
            {
                title: 'Statistics',
                href: route('admin.users.statistics'),
                icon: TrendingUp,
            },
        ],
    },
    {
        title: 'Reports',
        href: route('admin.reports.index'),
        icon: BarChart3,
        children: [
            {
                title: 'Analytics',
                href: route('admin.reports.index'),
                icon: TrendingUp,
            },
            {
                title: 'Sales',
                href: route('admin.reports.sales'),
                icon: TrendingUp,
            },
        ],
    },
    {
        title: 'Notifications',
        href: route('admin.notifications.all'),
        icon: Bell,
    },
];

const adminFooterNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: route('admin.settings'),
        icon: Settings,
    },
    {
        title: 'Logout',
        href: route('logout'),
        icon: LogOut,
        method: 'post',
        as: 'button'
    },
];

// Custom trigger component that uses sidebar state
function CustomSidebarTrigger() {
    const { open, toggleSidebar } = useSidebar();
    
    return (
        <button
            onClick={toggleSidebar}
            className="inline-flex items-center justify-center h-9 w-9 p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label={open ? "Close sidebar" : "Open sidebar"}
        >
            {open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </button>
    );
}

export function AdminSidebar() {
    const { open } = useSidebar();
    
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                {/* When sidebar is open - show logo and toggle side by side */}
                {open && (
                    <div className="flex items-center justify-between w-full">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton size="lg" asChild>
                                    <Link href={route('admin.dashboard')} prefetch>
                                        <AppLogo />
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                        <CustomSidebarTrigger />
                    </div>
                )}
                
                {/* When sidebar is closed - show logo and toggle stacked */}
                {!open && (
                    <div className="flex flex-col items-center space-y-2 w-full">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton size="lg" asChild>
                                    <Link href={route('admin.dashboard')} prefetch>
                                        <AppLogo />
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                        <CustomSidebarTrigger />
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={adminMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={adminFooterNavItems} className="mt-auto" />
            </SidebarFooter>
        </Sidebar>
    );
}