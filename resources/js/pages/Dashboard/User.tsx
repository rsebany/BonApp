import UserLayout from '@/layouts/User/UserLayout';
import { Head } from '@inertiajs/react';

export default function UserDashboard() {
    return (
        <UserLayout title="My Dashboard">
            <Head title="Dashboard" />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Your user dashboard content */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="text-lg font-semibold">Recent Orders</h3>
                    <p className="text-sm text-muted-foreground">Your latest food orders</p>
                </div>
                {/* Add more dashboard cards */}
            </div>
        </UserLayout>
    );
}