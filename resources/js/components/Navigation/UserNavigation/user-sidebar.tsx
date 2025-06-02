import { NavMain } from '@/components/Navigation/UserNavigation/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
     LayoutGrid,
     ShoppingBag,
     Store,
     MapPin,
     User,
    Heart,
    Clock
} from 'lucide-react';
import AppLogo from '../SideBar/app-logo';

const userMainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
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

export function UserSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={userMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
            </SidebarFooter>
        </Sidebar>
    );
}