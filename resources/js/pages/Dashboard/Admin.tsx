import { AdminMain } from '@/components/Navigation/AdminNavigation/admin-main';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Head } from '@inertiajs/react';

export default function AdminDashboard() {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin - Dashboard" />
            
            <main className="flex flex-1 flex-col gap-4 p-4 bg-gray-50">
                < AdminMain />
            </main>
        </AdminLayout>
    );
}