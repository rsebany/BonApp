import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { StatsCard } from '@/components/Cards/StatsCard';
import { Users, UserCheck, UserX, TrendingUp, ShoppingBag, DollarSign, Calendar, ArrowLeft, Download } from 'lucide-react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Button } from '@/components/ui/button';

interface UserStatistics {
    total_users: number;
    total_customers: number;
    total_drivers: number;
    total_admins: number;
    active_users: number;
    inactive_users: number;
    users_by_month: Array<{ month: number; count: number }>;
    top_customers_by_orders: Array<{
        first_name: string;
        last_name: string;
        email: string;
        order_count: number;
        total_spent: number;
    }>;
    top_customers_by_spending: Array<{
        first_name: string;
        last_name: string;
        email: string;
        total_spent: number;
        order_count: number;
    }>;
    verified_users: number;
    unverified_users: number;
    recent_users: Array<{
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        role: string;
        created_at: string;
    }>;
    average_orders_per_customer: number;
    average_spending_per_customer: number;
}

interface Props {
    statistics: UserStatistics;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function UserStatistics({ statistics }: Props) {
    const statsCards = [
        {
            title: 'Total Users',
            value: statistics.total_users,
            icon: Users,
            description: 'All registered users',
            color: 'text-blue-600',
        },
        {
            title: 'Total Customers',
            value: statistics.total_customers,
            icon: ShoppingBag,
            description: 'Registered customers',
            color: 'text-green-600',
        },
        {
            title: 'Total Drivers',
            value: statistics.total_drivers,
            icon: TrendingUp,
            description: 'Registered drivers',
            color: 'text-purple-600',
        },
        {
            title: 'Active Users',
            value: statistics.active_users,
            icon: UserCheck,
            description: 'Currently active users',
            color: 'text-emerald-600',
        },
    ];

    const userRoleData = [
        { name: 'Customers', value: statistics.total_customers },
        { name: 'Drivers', value: statistics.total_drivers },
        { name: 'Admins', value: statistics.total_admins },
    ];

    const userStatusData = [
        { name: 'Active', value: statistics.active_users },
        { name: 'Inactive', value: statistics.inactive_users },
    ];

    const monthlyData = statistics.users_by_month.map(item => ({
        name: monthNames[item.month - 1],
        users: item.count,
    }));

    const topCustomersByOrdersData = statistics.top_customers_by_orders.map(item => ({
        name: `${item.first_name} ${item.last_name}`,
        orders: item.order_count,
        spent: item.total_spent,
    }));

    const topCustomersBySpendingData = statistics.top_customers_by_spending.map(item => ({
        name: `${item.first_name} ${item.last_name}`,
        spent: item.total_spent,
        orders: item.order_count,
    }));

    return (
        <AdminLayout title="User Management">
            <Head title="User Statistics" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">User Statistics</h1>
                        <p className="text-muted-foreground">
                            Comprehensive analytics and insights about users in the system.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button asChild variant="outline">
                            <a href={route('admin.users.export', { type: 'statistics' })} download>
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </a>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={route('admin.users.index')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Users
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

                {/* Additional Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Avg Orders/Customer"
                        value={statistics.average_orders_per_customer}
                        icon={ShoppingBag}
                        description="Average orders per customer"
                        className="text-orange-600"
                    />
                    <StatsCard
                        title="Avg Spending/Customer"
                        value={`$${statistics.average_spending_per_customer.toFixed(2)}`}
                        icon={DollarSign}
                        description="Average spending per customer"
                        className="text-green-600"
                    />
                    <StatsCard
                        title="Inactive Users"
                        value={statistics.inactive_users}
                        icon={UserX}
                        description="Currently inactive users"
                        className="text-red-600"
                    />
                    <StatsCard
                        title="Verified Users"
                        value={statistics.verified_users}
                        icon={UserCheck}
                        description="Email verified users"
                        className="text-blue-600"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Users by Role */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Users by Role</CardTitle>
                            <CardDescription>
                                Distribution of users across different roles
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={userRoleData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {userRoleData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Users by Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Users by Status</CardTitle>
                            <CardDescription>
                                Distribution of users by active/inactive status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={userStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {userStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#00C49F' : '#FF8042'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Users by Month */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Users Registered by Month</CardTitle>
                            <CardDescription>
                                Number of users registered each month
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
                                    <Bar dataKey="users" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Top Customers by Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Customers by Orders</CardTitle>
                            <CardDescription>
                                Customers with the highest number of orders
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={topCustomersByOrdersData}>
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

                {/* Top Customers by Spending */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Customers by Spending</CardTitle>
                        <CardDescription>
                            Customers with the highest total spending
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topCustomersBySpendingData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="spent" fill="#FF8042" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent Users */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Users</CardTitle>
                        <CardDescription>
                            Latest users registered in the system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {statistics.recent_users.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-gray-100 rounded-full">
                                            <Users className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">{user.first_name} {user.last_name}</h4>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{user.role}</p>
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            <span>
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
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