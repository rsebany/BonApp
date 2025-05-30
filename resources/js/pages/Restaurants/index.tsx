import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types/index';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Restaurants',
        href: '/restaurant',
        label: undefined
    },
];

export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                </div>
        </AppLayout>
    );
}