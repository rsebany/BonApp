import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from '@/components/ui/sidebar';
import { type NavItem } from '@/types/index';
import { Link } from '@inertiajs/react';
import { 
  LayoutGrid,
  Utensils,
  ShoppingCart,
  Users,
  Truck,
  Settings,
  PieChart,
  LogOut
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
  // Core Modules
  {
    title: 'Dashboard',
    href: route('dashboard'),
    icon: LayoutGrid,
    exact: true,
    isActive: route().current('dashboard')
  },
  {
    title: 'Restaurants',
    href: route('restaurants.index'),
    icon: Utensils,
    isActive: route().current('restaurants.*'),
    children: [
      {
        title: 'All Restaurants',
        href: route('restaurants.index'),
        isActive: route().current('restaurants.index')
      },
      {
        title: 'Add New',
        href: route('restaurants.create'),
        isActive: route().current('restaurants.create')
      }
    ]
  },
  {
    title: 'Orders',
    href: route('orders.index'),
    icon: ShoppingCart,
    badge: '5',
    isActive: route().current('orders.*'),
    children: [
      {
        title: 'All Orders',
        href: route('orders.index'),
        isActive: route().current('orders.index')
      }
    ]
  },
  {
    title: 'Customers',
    href: route('customers.index'),
    icon: Users,
    isActive: route().current('customers.*'),
    exact:false
  },
  {
    title: 'Drivers',
    href: route('drivers.index'),
    icon: Truck,
    isActive: route().current('drivers.*'),
    children: [
      {
        title: 'All Drivers',
        href: '#',
        isActive: false
      }
    ]
  },
  
  // Business Tools (grouped)
  {
    title: 'Business Tools',
    href: '#',
    icon: PieChart,
    isActive: route().current('analytics.*') || route().current('payments.*') || route().current('promotions.*'),
    children: [
      {
        title: 'Analytics',
        href: route('analytics.index'),
        isActive: route().current('analytics.*')
      },
      {
        title: 'Payments',
        href: route('payments.index'),
        isActive: route().current('payments.*'),
        children: [
          {
            title: 'Transactions',
            href: route('payments.transactions'),
            isActive: route().current('payments.transactions')
          }
        ]
      },
      {
        title: 'Promotions',
        href: route('promotions.index'),
        isActive: route().current('promotions.*')
      }
    ]
  }
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')} prefetch>
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
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            asChild 
                            isActive={route().current('settings.*')}
                        >
                            <Link 
                                href="#"
                                className="w-full"
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link 
                                href={route('logout')} 
                                method="post" 
                                as="button"
                                className="w-full"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}