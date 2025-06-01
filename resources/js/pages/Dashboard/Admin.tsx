import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Users, 
    ShoppingBag, 
    DollarSign, 
    Package,
    Clock,
    CheckCircle,
    Eye,
    Edit
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/Admin/admin-app-layout';
import { BreadcrumbItem } from '@/types';


interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: 'admin' | 'customer';
}

interface Order {
    id: number;
    customer_name: string;
    restaurant_name: string;
    total_amount: number;
    status: string;
    order_datetime: string;
    delivery_fee: number;
}

interface Restaurant {
    id: number;
    restaurant_name: string;
    address: string;
    total_orders: number;
    rating: number;
    status: 'active' | 'inactive';
}

interface Props {
    auth: {
        user: User;
    };
    stats?: {
        totalOrders: number;
        totalRevenue: number;
        totalCustomers: number;
        pendingOrders: number;
        totalRestaurants: number;
        activeDeliveries: number;
    };
    recentOrders?: Order[];
    topRestaurants?: Restaurant[];
}

export default function AdminDashboard({ stats, recentOrders, topRestaurants }: Props) {
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data - remplacez par les vraies données depuis Laravel
    const mockStats = stats || {
        totalOrders: 1247,
        totalRevenue: 45231.89,
        totalCustomers: 892,
        pendingOrders: 23,
        totalRestaurants: 156,
        activeDeliveries: 12
    };

    const mockRecentOrders = recentOrders || [
        { 
            id: 1, 
            customer_name: 'John Doe', 
            restaurant_name: 'Pizza Palace',
            total_amount: 45.99, 
            status: 'pending', 
            order_datetime: '2024-01-15 10:30:00',
            delivery_fee: 5.99
        },
        { 
            id: 2, 
            customer_name: 'Jane Smith', 
            restaurant_name: 'Burger House',
            total_amount: 32.50, 
            status: 'completed', 
            order_datetime: '2024-01-15 09:15:00',
            delivery_fee: 4.50
        },
        { 
            id: 3, 
            customer_name: 'Mike Johnson', 
            restaurant_name: 'Sushi Zen',
            total_amount: 67.25, 
            status: 'in_progress', 
            order_datetime: '2024-01-15 11:45:00',
            delivery_fee: 6.99
        },
    ];

    const mockTopRestaurants = topRestaurants || [
        {
            id: 1,
            restaurant_name: 'Pizza Palace',
            address: '123 Main St, City',
            total_orders: 145,
            rating: 4.8,
            status: 'active' as const
        },
        {
            id: 2,
            restaurant_name: 'Burger House',
            address: '456 Oak Ave, City',
            total_orders: 123,
            rating: 4.6,
            status: 'active' as const
        }
    ];

    const getStatusBadge = (status: string) => {
        const statusMap = {
            pending: { label: 'En attente', variant: 'secondary' as const },
            confirmed: { label: 'Confirmée', variant: 'default' as const },
            in_progress: { label: 'En cours', variant: 'default' as const },
            ready: { label: 'Prête', variant: 'default' as const },
            out_for_delivery: { label: 'En livraison', variant: 'default' as const },
            completed: { label: 'Terminée', variant: 'default' as const },
            cancelled: { label: 'Annulée', variant: 'destructive' as const }
        };
        
        const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
        return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tableau de bord',
            href: '/dashboard/admin',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="py-6">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                        {<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Admin</h2>}
                        
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Commandes Total</CardTitle>
                                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{mockStats.totalOrders.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="text-green-600">+12%</span> par rapport au mois dernier
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">${mockStats.totalRevenue.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="text-green-600">+8.3%</span> par rapport au mois dernier
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Clients</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{mockStats.totalCustomers.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="text-green-600">+15</span> nouveaux cette semaine
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Commandes en Attente</CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-orange-600">{mockStats.pendingOrders}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Nécessitent une attention
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tabs Section */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                                <TabsTrigger value="orders">Commandes Récentes</TabsTrigger>
                                <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-4">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Activité Récente</CardTitle>
                                            <CardDescription>Dernières actions sur la plateforme</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Nouvelle commande #1247</p>
                                                    <p className="text-xs text-muted-foreground">Pizza Palace - $45.99</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <Package className="h-5 w-5 text-blue-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Restaurant ajouté</p>
                                                    <p className="text-xs text-muted-foreground">Sushi Zen approuvé</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Statistiques Rapides</CardTitle>
                                            <CardDescription>Métriques importantes</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">Restaurants Actifs</span>
                                                <span className="font-bold">{mockStats.totalRestaurants}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">Livraisons en Cours</span>
                                                <span className="font-bold text-blue-600">{mockStats.activeDeliveries}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">Taux de Satisfaction</span>
                                                <span className="font-bold text-green-600">98.5%</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="orders" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Commandes Récentes</CardTitle>
                                        <CardDescription>Dernières commandes passées sur la plateforme</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>ID</TableHead>
                                                    <TableHead>Client</TableHead>
                                                    <TableHead>Restaurant</TableHead>
                                                    <TableHead>Montant</TableHead>
                                                    <TableHead>Statut</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {mockRecentOrders.map((order) => (
                                                    <TableRow key={order.id}>
                                                        <TableCell>#{order.id}</TableCell>
                                                        <TableCell>{order.customer_name}</TableCell>
                                                        <TableCell>{order.restaurant_name}</TableCell>
                                                        <TableCell>${order.total_amount}</TableCell>
                                                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                                                        <TableCell>{new Date(order.order_datetime).toLocaleDateString()}</TableCell>
                                                        <TableCell>
                                                            <div className="flex space-x-2">
                                                                <Button variant="outline" size="sm">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="outline" size="sm">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="restaurants" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Top Restaurants</CardTitle>
                                        <CardDescription>Restaurants les plus performants</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Restaurant</TableHead>
                                                    <TableHead>Adresse</TableHead>
                                                    <TableHead>Commandes</TableHead>
                                                    <TableHead>Note</TableHead>
                                                    <TableHead>Statut</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {mockTopRestaurants.map((restaurant) => (
                                                    <TableRow key={restaurant.id}>
                                                        <TableCell className="font-medium">{restaurant.restaurant_name}</TableCell>
                                                        <TableCell>{restaurant.address}</TableCell>
                                                        <TableCell>{restaurant.total_orders}</TableCell>
                                                        <TableCell>⭐ {restaurant.rating}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={restaurant.status === 'active' ? 'default' : 'secondary'}>
                                                                {restaurant.status === 'active' ? 'Actif' : 'Inactif'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex space-x-2">
                                                                <Button variant="outline" size="sm">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="outline" size="sm">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
         </AppLayout>
    );
}