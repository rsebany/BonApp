import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, User, Phone, Clock, Navigation, Truck, Package } from 'lucide-react';
import OrderMap from '@/components/Common/OrderMap';

interface OrderTrackingProps {
  order: {
    id: number;
    customer: {
      name: string;
      email: string;
      phone: string;
    };
    restaurant: {
      name: string;
      address: string;
      location?: {
        latitude: number;
        longitude: number;
      };
    };
    delivery_address: {
      address: string;
      city: string;
      state: string;
      zip_code: string;
      location?: {
        latitude: number;
        longitude: number;
      };
    };
    order_status: {
      status: string;
      updated_at: string;
    };
    assigned_driver: {
      name: string;
      phone: string;
      current_location: {
        latitude: number;
        longitude: number;
      } | null;
    } | null;
    estimated_delivery_time: string;
    created_at: string;
    tracking_updates?: {
      id: number;
      status: string;
      description: string;
      latitude: number;
      longitude: number;
      created_at: string;
      driver: {
        name: string;
      };
    }[];
  };
}

export default function OrderTracking({ order }: OrderTrackingProps) {
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

  const formatAddress = (address: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
  }) => {
    return `${address.address}, ${address.city}, ${address.state} ${address.zip_code}`;
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  // Default coordinates for demo purposes (you should get these from your database)
  const defaultRestaurantLocation = { latitude: 40.7128, longitude: -74.0060 }; // New York
  const defaultDeliveryLocation = { latitude: 40.7589, longitude: -73.9851 }; // Times Square

  const restaurantLocation = order.restaurant.location || defaultRestaurantLocation;
  const deliveryLocation = order.delivery_address.location || defaultDeliveryLocation;

  return (
    <AdminLayout title="Order Tracking">
      <Head title={`Order #${order.id} Tracking`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Order Tracking</h1>
            <p className="text-gray-600">Track order #{order.id}</p>
          </div>
          <Button asChild variant="outline">
            <Link href={route('admin.orders.index')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
        </div>

        {/* Order Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(order.order_status.status)}>
                  {order.order_status.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  Last updated: {formatDateTime(order.order_status.updated_at)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Estimated Delivery</p>
                <p className="font-medium">
                  {order.estimated_delivery_time ? formatDateTime(order.estimated_delivery_time) : 'Not set'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Customer</h4>
                <div className="space-y-1">
                  <p className="text-sm">{order.customer.name}</p>
                  <p className="text-sm text-gray-500">{order.customer.email}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {order.customer.phone}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Restaurant</h4>
                <div className="space-y-1">
                  <p className="text-sm">{order.restaurant.name}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {order.restaurant.address}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Delivery Address</h4>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {formatAddress(order.delivery_address)}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Order Details</h4>
                <div className="space-y-1">
                  <p className="text-sm">Order ID: #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    Created: {formatDateTime(order.created_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Driver Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.assigned_driver ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Assigned Driver</h4>
                    <div className="space-y-1">
                      <p className="text-sm">{order.assigned_driver.name}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {order.assigned_driver.phone}
                      </p>
                    </div>
                  </div>

                  {order.assigned_driver.current_location && (
                    <div>
                      <h4 className="font-medium mb-2">Current Location</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          Latitude: {order.assigned_driver.current_location.latitude}
                        </p>
                        <p className="text-sm text-gray-500">
                          Longitude: {order.assigned_driver.current_location.longitude}
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <Navigation className="h-3 w-3 mr-1" />
                          View on Map
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Truck className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No driver assigned yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tracking Updates */}
        {order.tracking_updates && order.tracking_updates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Tracking Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

                {/* Timeline items */}
                <div className="space-y-6">
                  {order.tracking_updates.map((update) => (
                    <div key={update.id} className="relative pl-12">
                      {/* Timeline dot */}
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                        <Navigation className="h-4 w-4 text-gray-500" />
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(update.status)}>
                            {update.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatDateTime(update.created_at)}
                          </span>
                        </div>
                        <p className="text-sm">{update.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Truck className="h-4 w-4" />
                          <span>Updated by {update.driver.name}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Location: {update.latitude}, {update.longitude}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interactive Map */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Route</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderMap
              restaurantLocation={restaurantLocation}
              deliveryLocation={deliveryLocation}
              driverLocation={order.assigned_driver?.current_location || null}
              restaurantName={order.restaurant.name}
              deliveryAddress={formatAddress(order.delivery_address)}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 