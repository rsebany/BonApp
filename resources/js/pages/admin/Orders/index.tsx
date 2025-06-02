import AdminLayout from "@/layouts/Admin/AdminLayout";


export default function OrdersPage() {
    return (
        <AdminLayout title="Restaurant Management">
            <div className="space-y-6">
                {/* Page content */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium mb-4">Orders Overview</h2>
                    {/* Your orders data/tables/charts here */}
                </div>
            </div>
        </AdminLayout>
    );
}
