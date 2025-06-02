import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Head } from '@inertiajs/react';

export default function AdminDashboard() {
    return (
        <AdminLayout title="Admin Dashboard">
            <Head title="Admin Dashboard" />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Your admin dashboard content */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="text-lg font-semibold">Total Orders</h3>
                    <p className="text-2xl font-bold">1,234</p>
                </div>
                {/* Add more dashboard cards */}
            </div>
        </AdminLayout>
    );
}