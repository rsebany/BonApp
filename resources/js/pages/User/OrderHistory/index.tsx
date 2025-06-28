import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import TopNavBar from '@/components/Navigation/UserNavigation/user-header';
import LeftSidebar from '@/components/Navigation/UserNavigation/user-leftsidebar';
import RightSidebar from '@/components/Navigation/UserNavigation/user-rightsidebar';
import { Clock, ArrowLeft, Truck } from 'lucide-react';
import '../../../../css/user-navigation-sidebar.css';

const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'preparing': 'bg-orange-100 text-orange-800',
    'ready': 'bg-purple-100 text-purple-800',
    'out_for_delivery': 'bg-indigo-100 text-indigo-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
  };
  return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

export default function OrderHistoryPage() {
  const { order } = usePage().props as unknown as { order: any };
  const [activeItem, setActiveItem] = React.useState('Orders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head title={`Order #${order.id} History`} />
      <TopNavBar onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
          <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Order History</h1>
                <p className="text-gray-600">Order #{order.id} at <span className="font-semibold">{order.restaurant.name}</span></p>
              </div>
              <Link href={route('orders.index')} className="text-emerald-600 hover:underline font-medium flex items-center gap-1">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Orders
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Status Timeline</h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                {/* Timeline items */}
                <div className="space-y-8">
                  {order.history.length === 0 && (
                    <div className="text-gray-500 text-center py-8">No status history found for this order.</div>
                  )}
                  {order.history.map((item: Record<string, any>, index: number) => (
                    <div key={index} className="relative pl-12">
                      {/* Timeline dot */}
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-gray-500" />
                      </div>
                      {/* Content */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(item.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{item.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Truck className="h-4 w-4" />
                          <span>
                            Updated by {item.updated_by.name} ({item.updated_by.role})
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}
