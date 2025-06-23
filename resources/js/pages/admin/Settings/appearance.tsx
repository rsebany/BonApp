import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/Navigation/SideBar/appearance-tabs';
import HeadingSmall from '@/components/Navigation/SideBar/heading-small';
import SettingsLayout from '@/layouts/settings/layout';
import AdminLayout from '@/layouts/Admin/AdminLayout';

export default function AdminAppearance() {
    return (
        <AdminLayout>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AdminLayout>
    );
} 