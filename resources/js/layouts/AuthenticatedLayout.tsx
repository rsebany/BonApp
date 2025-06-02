import { usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import AdminLayout from './Admin/AdminLayout';
import UserLayout from './User/UserLayout';

interface AuthenticatedLayoutProps extends PropsWithChildren {
    header?: React.ReactNode;
}

export default function AuthenticatedLayout({ children, header }: AuthenticatedLayoutProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { auth } = usePage().props as any;
    
    const isAdmin = auth?.user?.role === 'admin';

    if (isAdmin) {
        return (
            <AdminLayout header={header}>
                {children}
            </AdminLayout>
        );
    }

    return (
        <UserLayout>
            {children}
        </UserLayout>
    );
}