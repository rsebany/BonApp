import { NavMain } from '@/components/Navigation/UserNavigation/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
     LayoutGrid,
     ShoppingBag,
     Store,
     MapPin,
     User,
    Heart,
    Clock,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';
import AppLogo from '../SideBar/app-logo';

const userMainNavItems: NavItem[] = [
    {
        title: 'Home',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Restaurants',
        href: '/restaurants',
        icon: Store,
    },
    {
        title: 'My Orders',
        href: '/orders',
        icon: ShoppingBag,
    },
    {
        title: 'Order History',
        href: '/orders?status=completed',
        icon: Clock,
    },
    {
        title: 'Favorites',
        href: '/restaurants?favorites=true',
        icon: Heart,
    },
    {
        title: 'Addresses',
        href: '/addresses',
        icon: MapPin,
    },
    {
        title: 'Profile',
        href: '/profile',
        icon: User,
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

export function UserSidebar() {
    const { open } = useSidebar();
    
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="relative">
                {/* When sidebar is open - show logo and toggle side by side */}
                {open && (
                    <div className="flex items-center justify-between w-full">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton size="lg" asChild>
                                    <Link href="/dashboard" prefetch>
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
                                    <Link href="/dashboard" prefetch>
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
                <NavMain items={userMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* Footer content if needed */}
            </SidebarFooter>
        </Sidebar>
    );
}