import AdminLayout from "@/layouts/Admin/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, DollarSign, Edit, Info, MapPin, Utensils } from "lucide-react";

interface Address {
    id: number;
    unit_number: string;
    street_number: string;
    address_line1: string;
    address_line2: string;
    city: string;
    region: string;
    postal_code: string;
    country: {
        country_name: string;
    };
}

interface Restaurant {
    id: number;
    restaurant_name: string;
    email: string;
    phone: string;
    description: string;
    cuisine_type: string;
    opening_hours: string;
    delivery_time: string;
    minimum_order: string;
    delivery_fee: string;
    is_active: boolean;
    address?: Address;
    created_at: string;
    updated_at: string;
}

interface Props {
    restaurant: Restaurant;
}

export default function RestaurantShow({ restaurant }: Props) {
    if (!restaurant || !restaurant.id) {
        return (
            <AdminLayout title="Loading...">
                <div className="p-6">Loading restaurant details...</div>
            </AdminLayout>
        );
    }

    const formatAddress = (address?: Address) => {
        if (!address) return 'No address available';
        const parts = [
            address.unit_number,
            address.street_number,
            address.address_line1,
            address.address_line2,
            address.city,
            address.region,
            address.postal_code,
            address.country?.country_name
        ].filter(Boolean);
        return parts.join(', ');
    };

    const formatCurrency = (amount: string | number) => {
        const value = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    }

    return (
        <AdminLayout title={restaurant.restaurant_name}>
            <Head title={restaurant.restaurant_name} />
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{restaurant.restaurant_name}</h2>
                        <Badge variant={restaurant.is_active ? "default" : "destructive"}>
                            {restaurant.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={route('admin.restaurants.edit', restaurant.id)}><Edit className="h-4 w-4 mr-2" />Edit</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={route('admin.restaurants.index')}><ArrowLeft className="h-4 w-4 mr-2" />Back to list</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center"><Info className="h-5 w-5 mr-2" />Basic Information</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold">Description</h3>
                                    <p className="text-gray-600">{restaurant.description || 'No description provided.'}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><span className="font-semibold">Email:</span> {restaurant.email}</div>
                                    <div><span className="font-semibold">Phone:</span> {restaurant.phone}</div>
                                    <div><span className="font-semibold">Cuisine Type:</span> {restaurant.cuisine_type}</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center"><MapPin className="h-5 w-5 mr-2" />Address</CardTitle></CardHeader>
                            <CardContent>
                                <p>{formatAddress(restaurant.address)}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center"><Utensils className="h-5 w-5 mr-2" />Operations</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                <div><span className="font-semibold">Opening Hours:</span> {restaurant.opening_hours}</div>
                                <div><span className="font-semibold">Avg. Delivery Time:</span> {restaurant.delivery_time} mins</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center"><DollarSign className="h-5 w-5 mr-2" />Pricing</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                <div><span className="font-semibold">Minimum Order:</span> {formatCurrency(restaurant.minimum_order)}</div>
                                <div><span className="font-semibold">Delivery Fee:</span> {formatCurrency(restaurant.delivery_fee)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center"><Clock className="h-5 w-5 mr-2" />Timestamps</CardTitle></CardHeader>
                            <CardContent className="space-y-2 text-sm text-gray-600">
                                <div><span className="font-semibold">Created:</span> {new Date(restaurant.created_at).toLocaleString()}</div>
                                <div><span className="font-semibold">Last Updated:</span> {new Date(restaurant.updated_at).toLocaleString()}</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 