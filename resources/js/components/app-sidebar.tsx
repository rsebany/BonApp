import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types/index';
import { Link } from '@inertiajs/react';
import { 
  LayoutGrid,
  Utensils,
  ShoppingCart,
  Users,
  Truck,
  ClipboardList,
  Settings,
  PieChart,
  DollarSign,
  MessageSquare,
  Shield,
  FileText,
  MapPin,
  Tag,
  HelpCircle
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
  // Core Modules
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
    exact: true
  },
  {
    title: 'Restaurants',
    href: '/restaurants',
    icon: Utensils,
    children: [
      {
        title: 'All Restaurants',
        href: '/restaurants'
      },
      {
        title: 'Add New',
        href: '/restaurants/create'
      },
      {
        title: 'Categories',
        href: '/restaurants/categories'
      }
    ]
  },
  {
    title: 'Orders',
    href: '/orders',
    icon: ShoppingCart,
    badge: '5', // Example dynamic count
    children: [
      {
        title: 'All Orders',
        href: '/orders'
      },
      {
        title: 'Pending',
        href: '/orders?status=pending'
      },
      {
        title: 'Completed',
        href: '/orders?status=completed'
      }
    ]
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: Users
  },
  {
    title: 'Drivers',
    href: '/drivers',
    icon: Truck,
    children: [
      {
        title: 'All Drivers',
        href: '/drivers'
      },
      {
        title: 'Driver Applications',
        href: '/drivers/applications'
      },
      {
        title: 'Availability',
        href: '/drivers/availability'
      }
    ]
  },

  // Menu Management
  {
    title: 'Menu Manager',
    href: '/menu',
    icon: ClipboardList,
    children: [
      {
        title: 'All Items',
        href: '/menu'
      },
      {
        title: 'Categories',
        href: '/menu/categories'
      },
      {
        title: 'Special Offers',
        href: '/menu/offers'
      }
    ]
  },

  // Business Tools
  {
    title: 'Analytics',
    href: '/analytics',
    icon: PieChart
  },
  {
    title: 'Payments',
    href: '/payments',
    icon: DollarSign,
    children: [
      {
        title: 'Transactions',
        href: '/payments'
      },
      {
        title: 'Payouts',
        href: '/payments/payouts'
      },
      {
        title: 'Refunds',
        href: '/payments/refunds'
      }
    ]
  },
  {
    title: 'Promotions',
    href: '/promotions',
    icon: Tag
  },

  // Support
  {
    title: 'Support',
    href: '/support',
    icon: HelpCircle,
    children: [
      {
        title: 'Tickets',
        href: '/support'
      },
      {
        title: 'FAQs',
        href: '/support/faqs'
      }
    ]
  },
  {
    title: 'Feedback',
    href: '/feedback',
    icon: MessageSquare
  },

  // Administration
  {
    title: 'Locations',
    href: '/locations',
    icon: MapPin
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: FileText
  },
  {
    title: 'Administration',
    href: '/admin',
    icon: Shield,
    permission: 'admin', // Example permission guard
    children: [
      {
        title: 'Users',
        href: '/admin/users'
      },
      {
        title: 'Roles',
        href: '/admin/roles'
      },
      {
        title: 'System Logs',
        href: '/admin/logs'
      }
    ]
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    children: [
      {
        title: 'General',
        href: '/settings/general'
      },
      {
        title: 'Notifications',
        href: '/settings/notifications'
      },
      {
        title: 'Integrations',
        href: '/settings/integrations'
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
                            <Link href="/dashboard" prefetch>
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
