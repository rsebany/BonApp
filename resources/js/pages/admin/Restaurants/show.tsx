import React from 'react';
import AdminLayout from "@/layouts/Admin/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Clock, DollarSign, ShoppingBag, Star, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MenuItem {
    id: number;
    item_name: string;
    price: number;
    is_available: boolean;
}

interface Order {
    id: number;
    total_amount: number;
    created_at: string;
    cust_restaurant_rating: number | null;
    first_name: string;
    last_name: string;
    status_value: string;
}

interface Restaurant {
    id: number;
    restaurant_name: string;
    email: string;
    phone: string;
    description: string;
    cuisine_type: string;
    opening_hours: string;
    delivery_time: number;
    minimum_order: number;
    delivery_fee: number;
    is_active: boolean;
    image_path: string | null;
    address: {
        address_line1: string;
        city: string;
        region: string;
        country: {
            country_name: string;
        };
    };
    menuItems: MenuItem[];
}

interface Stats {
    total_orders: number;
    completed_orders: number;
    total_revenue: number;
    average_rating: number;
    menu_items_count: number;
}

interface ShowRestaurantProps {
    restaurant: Restaurant;
    stats: Stats;
    recentOrders: Order[];
}

export default function ShowRestaurant({ restaurant, stats, recentOrders }: ShowRestaurantProps) {
    return (
        <AdminLayout title="Restaurant Details">
            <Head title="Restaurant Details" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.restaurants.index')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Restaurants
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">{restaurant.restaurant_name}</h1>
                            <p className="text-gray-600">{restaurant.cuisine_type} cuisine</p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.restaurants.edit', { restaurant: restaurant.id })}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Restaurant
                        </Link>
                    </Button>
                </div>

                {/* Restaurant Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image and Basic Info */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-1/3">
                                        {restaurant.image_path ? (
                                            <img 
                                                src={`/storage/${restaurant.image_path}`}
                                                alt={restaurant.restaurant_name}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <span className="text-gray-400">No image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-full md:w-2/3 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold">{restaurant.restaurant_name}</h2>
                                            <Badge variant={restaurant.is_active ? 'default' : 'secondary'}>
                                                {restaurant.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <p className="text-gray-600">{restaurant.description}</p>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                <span>{restaurant.opening_hours}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <DollarSign className="h-4 w-4 text-gray-500" />
                                                <span>Delivery fee: ${restaurant.delivery_fee.toFixed(2)} | Min order: ${restaurant.minimum_order.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p>{restaurant.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p>{restaurant.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Delivery Time</p>
                                                <p>{restaurant.delivery_time} minutes</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p>{restaurant.address.address_line1}</p>
                                    <p>{restaurant.address.city}, {restaurant.address.region}</p>
                                    <p>{restaurant.address.country.country_name}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Menu Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Menu Items ({stats.menu_items_count})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item Name</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {restaurant.menuItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.item_name}</TableCell>
                                                <TableCell>${item.price.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={item.is_available ? 'default' : 'secondary'}>
                                                        {item.is_available ? 'Available' : 'Unavailable'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Stats and Recent Orders */}
                    <div className="space-y-6">
                        {/* Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <ShoppingBag className="h-6 w-6 text-blue-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">Total Orders</p>
                                            <p className="text-lg font-semibold">{stats.total_orders}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-6 w-6 text-green-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">Completed</p>
                                            <p className="text-lg font-semibold">{stats.completed_orders}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <DollarSign className="h-6 w-6 text-purple-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">Total Revenue</p>
                                            <p className="text-lg font-semibold">${stats.total_revenue.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Star className="h-6 w-6 text-yellow-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">Avg Rating</p>
                                            <p className="text-lg font-semibold">
                                                {stats.average_rating ? stats.average_rating.toFixed(1) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Orders */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Orders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order #</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell>#{order.id}</TableCell>
                                                <TableCell>{order.first_name} {order.last_name}</TableCell>
                                                <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        order.status_value === 'Completed' ? 'default' : 
                                                        order.status_value === 'Cancelled' ? 'destructive' : 'secondary'
                                                    }>
                                                        {order.status_value}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}