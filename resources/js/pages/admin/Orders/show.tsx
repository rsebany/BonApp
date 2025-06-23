import React, { useState} from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { ArrowLeft, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge, Button } from '@/components/ui';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { route } from "ziggy-js";

interface Order {
  id: number;
  customer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  restaurant: {
    id: number;
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
        country_name: string;
      };
    };
  };
  orderStatus: {
    id: number;
    name: string;
  };
  assignedDriver?: {
    id: number;
    first_name: string;
    last_name: string;
    phone?: string;
  };
  customerAddress: {
    id: number;
    address_line1: string;
    address_line2?: string;
    city: string;
    region: string;
    postal_code: string;
    country?: {
      id: number;
      country_name: string;
    };
  };
  orderItems?: Array<{
    id: number;
    quantity: number;
    menuItem: {
      id: number;
      item_name: string;
      price: string;
    };
  }>;
  total_amount: string;
  delivery_fee: string;
  created_at: string;
  updated_at: string;
  formatted_total?: string;
  formatted_delivery_fee?: string;
  formatted_subtotal?: string;
  customer_driver_rating?: number;
  customer_restaurant_rating?: number;
}

interface Driver {
  id: number;
  first_name: string;
  last_name: string;
}

interface OrderStatus {
  name: string;
  id: number;
}

interface PageProps {
  order: Order;
  availableDrivers: Driver[];
  orderStatuses: OrderStatus[];
}

export default function OrderShow({ order, availableDrivers, orderStatuses }: PageProps) {
  const [selectedDriver, setSelectedDriver] = useState<string>(
    order.assignedDriver?.id?.toString() || ''
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(
    order.orderStatus?.id?.toString() || ''
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
      onSuccess: () => {
        router.visit(route('admin.orders.index'));
      },
      onFinish: () => setIsUpdating(false),
    });
  };

  const formatAddress = (address?: {
    address_line1?: string;
    address_line2?: string;
    city?: string;
    region?: string;
    postal_code?: string;
    country?: {
      country_name?: string;
    };
  }) => {
    if (!address) return 'No address available';
    
    const parts = [
      address.address_line1,
      address.address_line2,
      address.city,
      address.region,
      address.postal_code,
      address.country?.country_name
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : 'Address not specified';
  };

  const calculateSubtotal = () => {
    if (!order.orderItems) return 0;
    return order.orderItems.reduce((sum, item) => {
      return sum + (parseFloat(item.menuItem.price) * item.quantity);
    }, 0);
  };

  const formatCurrency = (amount: string | number) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = parseFloat(order.delivery_fee || '0');
  const total = subtotal + deliveryFee;

  return (
    <AdminLayout title="Order Details">
      <Head title={`Order #${order.id}`} />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 py-2">Order #{order.id}</h1>
            <p className="text-gray-600">
              Placed on {new Date(order.created_at).toLocaleDateString()} at{' '}
              {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={route('admin.orders.index')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status & Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Status & Assignment</span>
                  <Badge className={getStatusColor(order.orderStatus?.name || 'pending')}>
                    {order.orderStatus?.name || 'Unknown'}
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
                          {orderStatuses.find(s => s.id.toString() === selectedStatus)?.name || 'Select Status'}
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
                              onClick={() => setSelectedStatus(status.id.toString())}
                            >
                              {status.name}
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
                            ? availableDrivers.find(d => d.id.toString() === selectedDriver)?.first_name + ' ' + 
                              availableDrivers.find(d => d.id.toString() === selectedDriver)?.last_name
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
                            onClick={() => setSelectedDriver('')}
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
                              onClick={() => setSelectedDriver(driver.id.toString())}
                            >
                              {driver.first_name} {driver.last_name}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleQuickUpdate} disabled={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Quick Update'}
                  </Button>
                </div>
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
                {order.orderItems && order.orderItems.length > 0 ? (
                  <div className="space-y-3">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.menuItem.item_name}</h4>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x {formatCurrency(item.menuItem.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(parseFloat(item.menuItem.price) * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No items found for this order.</p>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-end space-y-2">
                <div className="w-full flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="w-full flex justify-between">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-semibold">{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="w-full flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </CardFooter>
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
                      <span className="font-medium">
                        {order.customer?.first_name} {order.customer?.last_name}
                      </span>
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
                          {order.customerAddress ? formatAddress(order.customerAddress) : 'No address available'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Restaurant Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">{order.restaurant?.restaurant_name || 'Unknown Restaurant'}</h4>
                  </div>
                  
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with Customer/Restaurant/Driver Info */}
          <div className="space-y-6">
            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={route('admin.users.show', order.customer.id)} className="font-semibold text-blue-600 hover:underline">
                  {order.customer.first_name} {order.customer.last_name}
                </Link>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{order.customer.email}</span>
                </div>
                {order.customer.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{order.customer.phone}</span>
                  </div>
                )}
                <div className="pt-2">
                  <h4 className="font-medium">Delivery Address</h4>
                  <p className="text-sm text-gray-600">{formatAddress(order.customerAddress)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Details */}
            <Card>
              <CardHeader>
                <CardTitle>Restaurant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={route('admin.restaurants.show', order.restaurant.id)} className="font-semibold text-blue-600 hover:underline">
                  {order.restaurant.restaurant_name}
                </Link>
                <div className="pt-2">
                  <h4 className="font-medium">Address</h4>
                  <p className="text-sm text-gray-600">{formatAddress(order.restaurant.address)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Driver Details */}
            {order.assignedDriver && (
              <Card>
                <CardHeader>
                  <CardTitle>Driver</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href={route('admin.users.show', order.assignedDriver.id)} className="font-semibold text-blue-600 hover:underline">
                    {order.assignedDriver.first_name} {order.assignedDriver.last_name}
                  </Link>
                  {order.assignedDriver.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{order.assignedDriver.phone}</span>
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