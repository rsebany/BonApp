import { SidebarProvider } from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';

export default function UserLayout({ children }: PropsWithChildren) {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden">
                {/* Center Main Content */}
                <div className="flex-1 flex flex-col h-full">
                    {/* <AppHeader pageTitle={title || 'Dashboard'} showSearch={true} showCart={true} /> */}
                    <main className="flex-1 overflow-y-auto bg-gray-50">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}