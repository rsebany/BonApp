import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import TopNavBar from '@/components/Navigation/UserNavigation/user-header';
import LeftSidebar from '@/components/Navigation/UserNavigation/user-leftsidebar';
import RightSidebar from '@/components/Navigation/UserNavigation/user-rightsidebar';
import '../../../../css/user-navigation-sidebar.css';

interface OrderSummary {
  id: number;
  restaurant: { name: string };
  status: string;
  order_date: string;
  total: number;
}

export default function OrderHistoryList() {
  const { orders } = usePage().props as unknown as { orders: OrderSummary[] };
  const [activeItem, setActiveItem] = React.useState('Orders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head title="Order History" />
      <TopNavBar onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
              <Link href={route('orders.index')} className="text-emerald-600 hover:underline font-medium">Back to Orders</Link>
            </div>
            {orders.length === 0 ? (
              <div className="text-center text-gray-500 py-12">You have not placed any orders yet.</div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3" />
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.restaurant?.name || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.order_date}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-emerald-600">${order.total?.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Link href={route('orders.history', order.id)} className="text-emerald-600 hover:underline font-medium text-sm">
                            View History
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
} 