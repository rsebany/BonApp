import { NavFooter } from '@/components/Navigation/UserNavigation/nav-footer';
import { NavMain } from '@/components/Navigation/UserNavigation/nav-main';
import { NavUser } from '@/components/Navigation/UserNavigation/nav-user';
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
    Clock,
    Folder,
    BookOpen
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

const userFooterNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
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
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Food Delivery</span>
                                    <span className="text-xs text-muted-foreground">Customer</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={userMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={userFooterNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}