import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import AdminLayout from "@/layouts/Admin/AdminLayout";
import { Order } from "@/TypesGlobaux/order";
import { Link } from "@inertiajs/react";
import { Head } from "@inertiajs/react";

interface OrdersPageProps {
  data?: {
    orders?: Order[];
  };
}

export default function OrdersPage({ data = { orders: [] } }: OrdersPageProps) {
  // Safely extract orders with fallback to empty array
  const orders = data?.orders || [];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'yellow',
      processing: 'blue',
      completed: 'green',
      cancelled: 'red'
    };
    return <Badge color={statusMap[status] || 'gray'}>{status}</Badge>;
  };

  return (
    <AdminLayout title="Order Management">
      <Head title="Order Management" />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Orders Overview</h2>
          <div className="flex space-x-2">
            <Button asChild>
              <Link href={route('orders.index')}>Export Orders</Link>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.restaurant?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.total?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={route('admin.orders.show', order.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}