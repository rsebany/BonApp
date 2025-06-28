import { AppContent } from '@/components/Navigation/SideBar/app-content';
import { AppShell } from '@/components/Navigation/SideBar/app-shell';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({ children }: PropsWithChildren<object>) {
    return (
        <AppShell>
                <div style={{ width: '50%', minWidth: 0, height: '100%' }}>
                    <AppContent>{children}</AppContent>
                </div>
        </AppShell>
    );
}
