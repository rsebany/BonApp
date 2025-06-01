import { AppContent } from '@/components/Navigation/SideBar/app-content';
import { AppHeader } from '@/components/Navigation/SideBar/app-header';
import { AppShell } from '@/components/Navigation/SideBar/app-shell';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}
