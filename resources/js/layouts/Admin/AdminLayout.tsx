import { AdminSidebar } from '@/components/Navigation/AdminNavigation/admin-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

interface AdminLayoutProps extends PropsWithChildren {
    header?: React.ReactNode;
    title?: string;
}

export default function AdminLayout({ children, header }: AdminLayoutProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { auth } = usePage().props as any;

    // Redirect if not admin
    if (auth?.user?.role !== 'admin') {
        window.location.href = '/dashboard';
        return null;
    }

    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                {header && (
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        {header}
                    </header>
                )}
                <main className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
