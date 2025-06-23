import AdminLayout from "@/layouts/Admin/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";


interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: "admin" | "customer" | "driver";
    is_available: boolean;
    created_at: string;
    updated_at: string;
    email_verified_at: string | null;
}

interface Address {
    id: number;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country_name: string;
    is_default: boolean;
}

interface Order {
    id: number;
    total_amount: number;
    created_at: string;
    restaurant_name: string;
    status: string;
}

interface UserStats {
    total_orders?: number;
    completed_orders?: number;
    total_spent?: number;
    average_order_value?: number;
    favorite_restaurants?: Array<{
        restaurant_name: string;
        order_count: number;
    }>;
    recent_orders?: Order[];
}

export default function ShowUser({ 
    user, 
    userStats = {}, 
    addresses = [] 
}: { 
    user: User;
    userStats?: UserStats;
    addresses?: Address[];
}) {
    const getRoleBadge = (role: string) => {
        const roleMap = {
            admin: 'purple',
            manager: 'blue',
            customer: 'green',
            driver: 'blue'
        } as const;
        return <Badge color={roleMap[role as keyof typeof roleMap] || 'gray'}>{role}</Badge>;
    };

    const formatCurrency = (amount?: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount || 0);
    };

    return (
        <AdminLayout title="User Details">
            <Head title={`User: ${user.first_name} ${user.last_name}`} />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tight">User Details</h2>
                    <div className="flex space-x-2">
                        <Button asChild variant="outline">
                            <Link href={route('admin.users.index')}><ArrowLeft className="h-4 w-4 mr-2" /> Back to Users</Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('admin.users.edit', { user: user.id })}>
                                Edit User
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Profile Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                                    <p>{user.first_name} {user.last_name}</p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p>{user.email}</p>
                                </div>

                                {user.phone && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                        <p>{user.phone}</p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Role</p>
                                    {getRoleBadge(user.role)}
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <div className="flex items-center gap-2">
                                        <Badge color={user.email_verified_at ? 'green' : 'yellow'}>
                                            {user.email_verified_at ? 'Verified' : 'Pending Verification'}
                                        </Badge>
                                        <Badge color={user.is_available ? "green" : "red"}>
                                            {user.is_available
                                                ? "Available"
                                                : "Unavailable"}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                                    <p>{new Date(user.created_at).toLocaleDateString()}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Statistics */}
                        {user.role === 'customer' && userStats && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Customer Statistics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-2 text-center">
                                            <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                                            <p className="text-2xl font-bold">{userStats.total_orders || 0}</p>
                                        </div>
                                        <div className="space-y-2 text-center">
                                            <p className="text-sm font-medium text-muted-foreground">Completed Orders</p>
                                            <p className="text-2xl font-bold">{userStats.completed_orders || 0}</p>
                                        </div>
                                        <div className="space-y-2 text-center">
                                            <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                                            <p className="text-2xl font-bold">
                                                {formatCurrency(userStats.total_spent)}
                                            </p>
                                        </div>
                                        <div className="space-y-2 text-center">
                                            <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
                                            <p className="text-2xl font-bold">
                                                {formatCurrency(userStats.average_order_value)}
                                            </p>
                                        </div>
                                    </div>

                                    {userStats.favorite_restaurants && userStats.favorite_restaurants.length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="font-medium mb-2">Favorite Restaurants</h3>
                                            <div className="space-y-2">
                                                {userStats.favorite_restaurants.map((restaurant, index) => (
                                                    <div key={index} className="flex justify-between">
                                                        <span>{restaurant.restaurant_name}</span>
                                                        <span className="text-muted-foreground">
                                                            {restaurant.order_count} order{restaurant.order_count !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Addresses Section */}
                        {addresses && addresses.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Addresses</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {addresses.map((address) => (
                                            <div key={address.id} className="border rounded-lg p-4">
                                                {address.is_default && (
                                                    <Badge color="green" className="mb-2">Default</Badge>
                                                )}
                                                <p>{address.address_line_1}</p>
                                                {address.address_line_2 && <p>{address.address_line_2}</p>}
                                                <p>
                                                    {address.city}, {address.state} {address.postal_code}
                                                </p>
                                                <p>{address.country_name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Recent Orders */}
                        {user.role === 'customer' && userStats?.recent_orders && userStats.recent_orders.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Orders</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Order #</TableHead>
                                                <TableHead>Restaurant</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {userStats.recent_orders.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell>{order.id}</TableCell>
                                                    <TableCell>{order.restaurant_name}</TableCell>
                                                    <TableCell>
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatCurrency(order.total_amount)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge color={
                                                            order.status.toLowerCase() === 'completed' 
                                                            ? 'green' 
                                                            : order.status.toLowerCase() === 'cancelled' 
                                                            ? 'red' 
                                                            : 'blue'
                                                        }>
                                                            {order.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}