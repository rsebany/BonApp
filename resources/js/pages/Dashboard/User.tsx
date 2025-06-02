
import { UserMain } from '@/components/Navigation/UserNavigation/user-main';
import UserLayout from '@/layouts/User/UserLayout';
import { AppRouter } from '@/Router';
import { Head } from '@inertiajs/react';

export default function UserDashboard() {
    return (
        <UserLayout title="Dashboard">
            <Head title="Dashboard" />
            
            <main className="flex flex-1 flex-col gap-4 p-4 bg-gray-50">
                <AppRouter>
                    <UserMain />
                </AppRouter>
            </main>
        </UserLayout>
    );
}