import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { ArrowLeft, MapPin, Phone, Mail, Clock, Truck, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, Button } from '@/components/ui';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { route } from "ziggy-js";

interface Order {
  id: number;
  customer: {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  restaurant: {
    id: number;
    name: string;
    restaurant_name: string;
    address?: {
      id: number;
      address_line1: string;
      address_line2?: string;
      city: string;
      region: string;
      postal_code: string;
      country?: {
        id: number;
        name: string;
      };
    };
  };
  order_status: {
    id: number;
    status: string;
    name: string;
  };
  assigned_driver?: {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    phone?: string;
  };
  customer_address: {
    id: number;
    address_line1: string;
    address_line2?: string;
    city: string;
    region: string;
    postal_code: string;
    country?: {
      id: number;
      name: string;
    };
  };
  order_items?: Array<{
    id: number;
    quantity: number;
    menu_item: {
      id: number;
      name: string;
      price: string;
    };
  }>;
  total_amount: string;
  delivery_fee: string;
  order_datetime: string;
  requested_delivery_datetime?: string;
  created_at: string;
  updated_at: string;
  formatted_total: string;
  formatted_delivery_fee: string;
  formatted_subtotal: string;
  customer_driver_rating?: number;
  customer_restaurant_rating?: number;
}

interface Driver {
  id: number;
  first_name: string;
  last_name: string;
}

interface OrderStatus {
  id: number;
  status: string;
}

interface PageProps {
  order: Order;
  availableDrivers: Driver[];
  orderStatuses: OrderStatus[];
}

export default function OrderShow({ order, availableDrivers, orderStatuses }: PageProps) {
  const [selectedDriver, setSelectedDriver] = useState<string>(
    order.assigned_driver?.id?.toString() || ''
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(
    order.order_status?.id?.toString() || ''
  );
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleQuickUpdate = () => {
    setIsUpdating(true);
    router.patch(route('admin.orders.update', order.id), {
      assigned_driver_id: selectedDriver || null,
      order_status_id: selectedStatus,
    }, {
      onFinish: () => setIsUpdating(false),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatAddress = (address: any) => {
    if (!address) return 'No address available';
    
    const parts = [
      address.address_line1,
      address.address_line2,
      address.city,
      address.region,
      address.postal_code,
      address.country?.name
    ].filter(Boolean);
    return parts.join(', ');
  };
  
  return (
    <AdminLayout title="Orders Management">
      <Head title={`Order #${order.id}`} />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={route('admin.orders.index')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 py-2">Order #{order.id}</h1>
              <p className="text-gray-600">
                Placed on {new Date(order.created_at).toLocaleDateString()} at{' '}
                {new Date(order.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
           {/*
          <div className="flex gap-3">
            <Button variant="outline" asChild>
             <Link href={route('admin.orders.tracking', { order: order.id })}>
                <MapPin className="h-4 w-4 mr-2" />
                Track Order
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={route('admin.orders.history', { order: order.id })}>
                <Clock className="h-4 w-4 mr-2" />
                View History
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={route('admin.orders.edit', { order: order.id })}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Order
              </Link>
            </Button>
          </div>*/}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status & Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Status & Assignment</span>
                  <Badge className={getStatusColor(order.order_status?.status || 'pending')}>
                    {order.order_status?.status || 'Unknown'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Status
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          {orderStatuses.find(s => s.id.toString() === selectedStatus)?.status || 'Select Status'}
                          <ChevronsUpDown className="ml-auto h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="z-50 w-full p-0">
                        <div className="space-y-1 p-3">
                          {orderStatuses.map((status) => (
                            <Button
                              key={status.id}
                              variant="ghost"
                              size="sm"
                              className={cn(
                                selectedStatus === status.id.toString() && 'bg-gray-100',
                                'justify-start text-left text-sm w-full'
                              )}
                              onClick={() => {
                                setSelectedStatus(status.id.toString());
                              }}
                            >
                              {status.status}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned Driver
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          {selectedDriver 
                            ? availableDrivers.find(d => d.id.toString() === selectedDriver)?.first_name + ' ' + availableDrivers.find(d => d.id.toString() === selectedDriver)?.last_name
                            : 'Unassigned'
                          }
                          <ChevronsUpDown className="ml-auto h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="z-50 w-full p-0">
                        <div className="space-y-1 p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              selectedDriver === '' && 'bg-gray-100',
                              'justify-start text-left text-sm w-full'
                            )}
                            onClick={() => {
                              setSelectedDriver('');
                            }}
                          >
                            Unassigned
                          </Button>
                          {availableDrivers.map((driver) => (
                            <Button
                              key={driver.id}
                              variant="ghost"
                              size="sm"
                              className={cn(
                                selectedDriver === driver.id.toString() && 'bg-gray-100',
                                'justify-start text-left text-sm w-full'
                              )}
                              onClick={() => {
                                setSelectedDriver(driver.id.toString());
                              }}
                            >
                              {driver.first_name} {driver.last_name}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <Button 
                  onClick={handleQuickUpdate}
                  disabled={isUpdating}
                  className="w-full md:w-auto"
                >
                  {isUpdating ? 'Updating...' : 'Update Order'}
                </Button>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.order_items && order.order_items.length > 0 ? (
                  <div className="space-y-3">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.menu_item.name}</h4>
                          <p className="text-sm text-gray-600">
                            ${item.menu_item.price} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${(parseFloat(item.menu_item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No items found for this order.</p>
                )}
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{order.customer?.name || 'Unknown Customer'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{order.customer?.email || 'No email'}</span>
                    </div>
                    {order.customer?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{order.customer.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium text-sm mb-1">Delivery Address</p>
                        <p className="text-gray-600 text-sm">
                          {order.customer_address ? formatAddress(order.customer_address) : 'No address available'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Information 
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">{order.restaurant?.restaurant_name || 'Unknown Restaurant'}</h4>
                  </div>
                  
                  {order.restaurant.address && (
                    <div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                        <div>
                          <p className="font-medium text-sm mb-1">Restaurant Address</p>
                          <p className="text-gray-600 text-sm">
                            {order.restaurant?.address ? formatAddress(order.restaurant.address) : 'No address available'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>*/}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{order.formatted_subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{order.formatted_delivery_fee}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{order.formatted_total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver Information */}
            {order.assigned_driver && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Assigned Driver
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{order.assigned_driver.name}</span>
                  </div>
                  {order.assigned_driver.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{order.assigned_driver.phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Placed</span>
                    <span>{new Date(order.created_at).toLocaleString()}</span>
                  </div>
                  {order.order_datetime !== order.created_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date</span>
                      <span>{new Date(order.order_datetime).toLocaleString()}</span>
                    </div>
                  )}
                  {order.requested_delivery_datetime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Requested Delivery</span>
                      <span>{new Date(order.requested_delivery_datetime).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated</span>
                    <span>{new Date(order.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ratings */}
            {(order.customer_driver_rating || order.customer_restaurant_rating) && (
              <Card>
                <CardHeader>
                  <CardTitle>Customer Ratings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {order.customer_restaurant_rating && (
                    <div className="flex justify-between">
                      <span>Restaurant Rating</span>
                      <span>{order.customer_restaurant_rating}/5 ⭐</span>
                    </div>
                  )}
                  {order.customer_driver_rating && (
                    <div className="flex justify-between">
                      <span>Driver Rating</span>
                      <span>{order.customer_driver_rating}/5 ⭐</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}