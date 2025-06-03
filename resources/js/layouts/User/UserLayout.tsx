import { AppHeader } from '@/components/Navigation/SideBar/app-header';
import { UserSidebar } from '@/components/Navigation/UserNavigation/user-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';

interface UserLayoutProps extends PropsWithChildren {
    title?: string;
}

export default function UserLayout({ children, title}: UserLayoutProps) {
    return (
        <SidebarProvider>
            <UserSidebar />
            <SidebarInset>
                <AppHeader 
                    title={title || 'Dashboard'}
                    showSearch={true}
                    /*showNotifications={true}*/
                    showCart={true}
                />
                <main className="flex flex-1 flex-col gap-4  p-4 pt-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}