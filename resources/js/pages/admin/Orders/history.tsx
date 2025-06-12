import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, User, MapPin, Truck } from 'lucide-react';

interface OrderHistoryProps {
  order: {
    id: number;
    customer: {
      name: string;
      email: string;
    };
    restaurant: {
      name: string;
    };
    history: {
      status: string;
      description: string;
      created_at: string;
      updated_by: {
        name: string;
        role: string;
      };
    }[];
  };
}

export default function OrderHistory({ order }: OrderHistoryProps) {
  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'preparing': 'bg-orange-100 text-orange-800',
      'ready': 'bg-purple-100 text-purple-800',
      'dispatched': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout title="Orders Management">
      <Head title={`Order #${order.id} History`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Order History</h1>
            <p className="text-gray-600">View history for order #{order.id}</p>
          </div>
          <Button asChild variant="outline">
            <Link href={route('admin.orders.index')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
        </div>

        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Customer</p>
                  <p className="text-sm text-gray-500">{order.customer.name}</p>
                  <p className="text-sm text-gray-500">{order.customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Restaurant</p>
                  <p className="text-sm text-gray-500">{order.restaurant.name}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Status History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

              {/* Timeline items */}
              <div className="space-y-8">
                {order.history.map((item, index) => (
                  <div key={index} className="relative pl-12">
                    {/* Timeline dot */}
                    <div className="absolute left-0 w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-gray-500" />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 