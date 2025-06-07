import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import AdminLayout from "@/layouts/Admin/AdminLayout";
import { Head } from "@inertiajs/react";

interface AnalyticsPageProps {
  stats?: {
    orders_by_status?: {
      labels: string[];
      values: number[];
    };
    monthly_revenue?: {
      labels: string[];
      data: number[];
    };
    total_orders?: number;
    total_revenue?: number;
    active_restaurants?: number;
  };
}

export default function AnalyticsPage({ stats }: AnalyticsPageProps) {
  if (!stats) {
    return (
      <AdminLayout title="Analytics Dashboard">
        <Head title="Analytics Dashboard" />
        <div className="p-6 text-red-500">No data available.</div>
      </AdminLayout>
    );
  }

  const pieChartData = stats.orders_by_status
    ? {
        labels: stats.orders_by_status.labels,
        values: stats.orders_by_status.values,
      }
    : { labels: [], values: [] };

  return (
    <AdminLayout title="Analytics Dashboard">
      <Head title="Analytics Dashboard" />
      <div className="space-y-6">
        <h2 className="text-lg font-medium">Analytics Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium mb-4">Orders by Status</h3>
            <PieChart
              data={pieChartData}
              colors={['#3b82f6', '#f59e0b', '#10b981', '#ef4444']}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium mb-4">Monthly Revenue</h3>
            <BarChart
                          /*data={barChartData}*/
                          color="#10b981"
                          label="Revenue ($)" data={{
                              data: undefined,
                              labels: [],
                              datasets: []
                          }}            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium mb-2">Total Orders</h3>
            <p className="text-3xl font-bold">{stats.total_orders ?? 0}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold">${(stats.total_revenue ?? 0).toFixed(2)}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium mb-2">Active Restaurants</h3>
            <p className="text-3xl font-bold">{stats.active_restaurants ?? 0}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}