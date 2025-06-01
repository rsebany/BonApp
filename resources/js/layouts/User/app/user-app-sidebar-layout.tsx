import { AppContent } from '@/components/Navigation/SideBar/app-content';
import { AppShell } from '@/components/Navigation/SideBar/app-shell';
import { AppSidebar } from '@/components/Navigation/SideBar/app-sidebar';
import { AppSidebarHeader } from '@/components/Navigation/SideBar/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
