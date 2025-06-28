import UserLayout from '@/layouts/User/UserLayout';
import { Head } from '@inertiajs/react';
import FoodDeliveryApp from '@/components/Navigation/UserNavigation/nav-main';
import { AppRouter } from '@/Router';

export default function UserHome() {
    return (
        <UserLayout>
            <Head title="Home" />
            <main className="flex flex-1 flex-col gap-4 p-0 bg-gradient-to-b from-orange-50 via-yellow-50 to-orange-50 min-h-screen">
                <AppRouter>
                    <FoodDeliveryApp />
                </AppRouter>
            </main>
        </UserLayout>
    );
}