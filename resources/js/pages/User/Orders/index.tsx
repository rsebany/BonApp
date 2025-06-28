import React, { useState } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import TopNavBar from '@/components/Navigation/UserNavigation/user-header';
import LeftSidebar from '@/components/Navigation/UserNavigation/user-leftsidebar';
import RightSidebar from '@/components/Navigation/UserNavigation/user-rightsidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Star, Package, CheckCircle, XCircle } from 'lucide-react';

interface OrderItem {
  id: number;
  restaurant_name: string;
  total: number;
  status: string;
  order_date: string;
  delivery_address?: string;
  rating?: number;
}

export default function OrdersIndex() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { orders } = usePage().props as any;
  const orderList: OrderItem[] = Array.isArray(orders) ? orders : Array.isArray(orders?.data) ? orders.data : [];
  const [activeItem, setActiveItem] = useState('Orders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'out_for_delivery':
        return <Package className="w-4 h-4" />;
      case 'preparing':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head title="My Orders" />
      <TopNavBar onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                  <p className="text-gray-600">Track your food delivery orders</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Link href={route('orders.history.index')}>
                    <Button variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                      View Order History
                    </Button>
                  </Link>
                  <Link href={route('orders.create')}>
                    <Button className="bg-emerald-500 hover:bg-emerald-600">
                      Create New Order
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {orderList.length > 0 ? (
              <div className="grid gap-4">
                {orderList.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{order.restaurant_name}</CardTitle>
                            <p className="text-sm text-gray-500">Order #{order.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">{order.order_date}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Badge className={getStatusColor(order.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(order.status)}
                              <span>{order.status}</span>
                            </div>
                          </Badge>
                          {order.delivery_address && (
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{order.delivery_address}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {order.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{order.rating}</span>
                            </div>
                          )}
                          <Link href={route('orders.history', order.id)}>
                            <Button variant="outline" size="sm">
                              View History
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-6">Start exploring restaurants and place your first order!</p>
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  Browse Restaurants
                </Button>
              </div>
            )}
          </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}
