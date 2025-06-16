import React, { useState } from 'react';
import AdminLayout from "@/layouts/Admin/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Button, Input, Textarea, Select } from "@/components/ui";
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload } from "lucide-react";

interface Country {
    id: number;
    country_name: string;
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
        id: number;
        unit_number: string | null;
        street_number: string | null;
        address_line1: string;
        address_line2: string | null;
        city: string;
        region: string;
        postal_code: string;
        country_id: number;
    };
}

interface EditRestaurantProps {
    restaurant: Restaurant;
    countries: Country[];
}

interface RestaurantFormData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
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
    image: File | null;
    address: {
        unit_number: string;
        street_number: string;
        address_line1: string;
        address_line2: string;
        city: string;
        region: string;
        postal_code: string;
        country_id: number;
    };
}

export default function EditRestaurant({ restaurant, countries }: EditRestaurantProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(restaurant.image_path);
    
    const { data, setData, put, processing, errors } = useForm<RestaurantFormData>({
        restaurant_name: restaurant.restaurant_name,
        email: restaurant.email,
        phone: restaurant.phone,
        description: restaurant.description,
        cuisine_type: restaurant.cuisine_type,
        opening_hours: restaurant.opening_hours,
        delivery_time: restaurant.delivery_time,
        minimum_order: restaurant.minimum_order,
        delivery_fee: restaurant.delivery_fee,
        is_active: restaurant.is_active,
        image: null,
        address: {
            unit_number: restaurant.address.unit_number || '',
            street_number: restaurant.address.street_number || '',
            address_line1: restaurant.address.address_line1,
            address_line2: restaurant.address.address_line2 || '',
            city: restaurant.address.city,
            region: restaurant.address.region,
            postal_code: restaurant.address.postal_code,
            country_id: restaurant.address.country_id,
        }
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddressChange = (field: keyof typeof data.address, value: string | number) => {
        setData('address', {
            ...data.address,
            [field]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.restaurants.update', { restaurant: restaurant.id } ));
    };

    return (
        <AdminLayout title="Edit Restaurant">
            <Head title="Edit Restaurant" />
            
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
                            <h1 className="text-2xl font-bold">Edit Restaurant</h1>
                            <p className="text-gray-600">Update restaurant details</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="restaurant_name">Restaurant Name *</Label>
                                    <Input
                                        id="restaurant_name"
                                        value={data.restaurant_name}
                                        onChange={(e) => setData('restaurant_name', e.target.value)}
                                        placeholder="Enter restaurant name"
                                    />
                                    {errors.restaurant_name && (
                                        <p className="text-sm text-red-600">{errors.restaurant_name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cuisine_type">Cuisine Type *</Label>
                                    <Input
                                        id="cuisine_type"
                                        value={data.cuisine_type}
                                        onChange={(e) => setData('cuisine_type', e.target.value)}
                                        placeholder="e.g., Italian, Chinese, Fast Food"
                                    />
                                    {errors.cuisine_type && (
                                        <p className="text-sm text-red-600">{errors.cuisine_type}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief description of the restaurant"
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="restaurant@example.com"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+1234567890"
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-600">{errors.phone}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Address Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="unit_number">Unit Number</Label>
                                    <Input
                                        id="unit_number"
                                        value={data.address.unit_number}
                                        onChange={(e) => handleAddressChange('unit_number', e.target.value)}
                                        placeholder="Unit #"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="street_number">Street Number</Label>
                                    <Input
                                        id="street_number"
                                        value={data.address.street_number}
                                        onChange={(e) => handleAddressChange('street_number', e.target.value)}
                                        placeholder="123"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="address_line1">Address Line 1 *</Label>
                                    <Input
                                        id="address_line1"
                                        value={data.address.address_line1}
                                        onChange={(e) => handleAddressChange('address_line1', e.target.value)}
                                        placeholder="Street address"
                                    />
                                    {errors['address.address_line1'] && (
                                        <p className="text-sm text-red-600">{errors['address.address_line1']}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address_line2">Address Line 2</Label>
                                <Input
                                    id="address_line2"
                                    value={data.address.address_line2}
                                    onChange={(e) => handleAddressChange('address_line2', e.target.value)}
                                    placeholder="Apartment, suite, etc. (optional)"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City *</Label>
                                    <Input
                                        id="city"
                                        value={data.address.city}
                                        onChange={(e) => handleAddressChange('city', e.target.value)}
                                        placeholder="City"
                                    />
                                    {errors['address.city'] && (
                                        <p className="text-sm text-red-600">{errors['address.city']}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="region">Region/State *</Label>
                                    <Input
                                        id="region"
                                        value={data.address.region}
                                        onChange={(e) => handleAddressChange('region', e.target.value)}
                                        placeholder="State/Province"
                                    />
                                    {errors['address.region'] && (
                                        <p className="text-sm text-red-600">{errors['address.region']}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="postal_code">Postal Code *</Label>
                                    <Input
                                        id="postal_code"
                                        value={data.address.postal_code}
                                        onChange={(e) => handleAddressChange('postal_code', e.target.value)}
                                        placeholder="12345"
                                    />
                                    {errors['address.postal_code'] && (
                                        <p className="text-sm text-red-600">{errors['address.postal_code']}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country">Country *</Label>
                                <Select
                                    value={data.address.country_id.toString()}
                                    onValueChange={(value) => handleAddressChange('country_id', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem key={country.id} value={country.id.toString()}>
                                                {country.country_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {(errors.country_id || errors['country_id']) && (
                                    <p className="text-sm text-red-600">{errors.country_id || errors['country_id']}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Business Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Business Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="opening_hours">Opening Hours *</Label>
                                <Input
                                    id="opening_hours"
                                    value={data.opening_hours}
                                    onChange={(e) => setData('opening_hours', e.target.value)}
                                    placeholder="Mon-Sun: 9:00 AM - 10:00 PM"
                                />
                                {errors.opening_hours && (
                                    <p className="text-sm text-red-600">{errors.opening_hours}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="delivery_time">Delivery Time (minutes) *</Label>
                                    <Input
                                        id="delivery_time"
                                        type="number"
                                        min="1"
                                        max="120"
                                        value={data.delivery_time}
                                        onChange={(e) => setData('delivery_time', parseInt(e.target.value) || 0)}
                                        placeholder="30"
                                    />
                                    {errors.delivery_time && (
                                        <p className="text-sm text-red-600">{errors.delivery_time}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="minimum_order">Minimum Order ($) *</Label>
                                    <Input
                                        id="minimum_order"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.minimum_order}
                                        onChange={(e) => setData('minimum_order', parseFloat(e.target.value) || 0)}
                                        placeholder="0.00"
                                    />
                                    {errors.minimum_order && (
                                        <p className="text-sm text-red-600">{errors.minimum_order}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="delivery_fee">Delivery Fee ($) *</Label>
                                    <Input
                                        id="delivery_fee"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.delivery_fee}
                                        onChange={(e) => setData('delivery_fee', parseFloat(e.target.value) || 0)}
                                        placeholder="0.00"
                                    />
                                    {errors.delivery_fee && (
                                        <p className="text-sm text-red-600">{errors.delivery_fee}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Image Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Restaurant Image</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="image">Upload Image</Label>
                                <div className="flex items-center justify-center w-full">
                                    <label
                                        htmlFor="image"
                                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                    >
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview.startsWith('data:') ? imagePreview : `/storage/${imagePreview}`}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                                            </div>
                                        )}
                                        <input
                                            id="image"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                                {errors.image && (
                                    <p className="text-sm text-red-600">{errors.image}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked: boolean) => setData('is_active', checked)}
                                />
                                <Label htmlFor="is_active">Restaurant is active</Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end space-x-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href={route('admin.restaurants.index')}>
                                Cancel
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Restaurant'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}