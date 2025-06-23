import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { StatsCard } from '@/components/Cards/StatsCard';
import { Building2, MapPin, TrendingUp, UtensilsCrossed, ArrowLeft, Download } from 'lucide-react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Button } from '@/components/ui/button';

interface RestaurantStatistics {
    total_restaurants: number;
    active_restaurants: number;
    inactive_restaurants: number;
    restaurants_by_city: Array<{ city: string; count: number }>;
    restaurants_by_country: Array<{ country_name: string; count: number }>;
    top_restaurants_by_orders: Array<{ restaurant_name: string; order_count: number; total_revenue: number }>;
    restaurants_by_month: Array<{ month: number; count: number }>;
    recent_restaurants: Array<{
        id: number;
        restaurant_name: string;
        created_at: string;
        address: { city: string; country: { country_name: string } };
    }>;
    average_menu_items: number;
}

interface Props {
    statistics: RestaurantStatistics;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function RestaurantStatistics({ statistics }: Props) {
    const statsCards = [
        {
            title: 'Total Restaurants',
            value: statistics.total_restaurants,
            icon: Building2,
            description: 'All registered restaurants',
            color: 'text-blue-600',
        },
        {
            title: 'Active Restaurants',
            value: statistics.active_restaurants,
            icon: TrendingUp,
            description: 'Currently active restaurants',
            color: 'text-green-600',
        },
        {
            title: 'Inactive Restaurants',
            value: statistics.inactive_restaurants,
            icon: Building2,
            description: 'Currently inactive restaurants',
            color: 'text-red-600',
        },
        {
            title: 'Avg Menu Items',
            value: statistics.average_menu_items,
            icon: UtensilsCrossed,
            description: 'Average menu items per restaurant',
            color: 'text-purple-600',
        },
    ];

    const cityData = statistics.restaurants_by_city.map(item => ({
        name: item.city,
        value: item.count,
    }));

    const countryData = statistics.restaurants_by_country.map(item => ({
        name: item.country_name,
        value: item.count,
    }));

    const monthlyData = statistics.restaurants_by_month.map(item => ({
        name: monthNames[item.month - 1],
        restaurants: item.count,
    }));

    const topRestaurantsData = statistics.top_restaurants_by_orders.map(item => ({
        name: item.restaurant_name,
        orders: item.order_count,
        revenue: item.total_revenue,
    }));

    return (
        <AdminLayout title="Restaurant Management">
            <Head title="Restaurant Statistics" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Restaurant Statistics</h1>
                        <p className="text-muted-foreground">
                            Comprehensive analytics and insights about restaurants in the system.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button asChild variant="outline">
                            <a href={route('admin.restaurants.export', { type: 'statistics' })} download>
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </a>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={route('admin.restaurants.index')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Restaurants
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsCards.map((stat, index) => (
                        <StatsCard
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            description={stat.description}
                            className={stat.color}
                        />
                    ))}
                </div>

                {/* Charts Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Restaurants by City */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Restaurants by City</CardTitle>
                            <CardDescription>
                                Distribution of restaurants across different cities
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={cityData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {cityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Restaurants by Country */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Restaurants by Country</CardTitle>
                            <CardDescription>
                                Distribution of restaurants across different countries
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={countryData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Restaurants by Month */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Restaurants Created by Month</CardTitle>
                            <CardDescription>
                                Number of restaurants created each month
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="restaurants" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Top Restaurants by Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Restaurants by Orders</CardTitle>
                            <CardDescription>
                                Restaurants with the highest number of orders
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={topRestaurantsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="orders" fill="#ffc658" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Restaurants */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Restaurants</CardTitle>
                        <CardDescription>
                            Latest restaurants added to the system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {statistics.recent_restaurants.map((restaurant) => (
                                <div key={restaurant.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <Building2 className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">{restaurant.restaurant_name}</h4>
                                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                <MapPin className="h-3 w-3" />
                                                <span>
                                                    {restaurant.address.city}, {restaurant.address.country.country_name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(restaurant.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
} 