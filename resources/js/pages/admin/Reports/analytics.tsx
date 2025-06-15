import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Cell, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart } from '@/components/charts/BarChart';
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface ReportData {
    orders_by_status: Array<{ name: string; count: number }>;
    monthly_revenue: Array<{ month: string; revenue: number }>;
    top_restaurants: Array<{ name: string; orders: number }>;
    total_metrics: {
        orders: number;
        completed_orders: number;
        revenue: number;
        active_restaurants: number;
    };
}

export default function ReportsIndex() {
    const { reports, filters } = usePage<{ reports: ReportData; filters: { date_from: string; date_to: string } }>().props;

    return (
        <AdminLayout>
            <Head title="Reports Dashboard" />

            <div className="container py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Reports Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <DateRangePicker 
                            defaultValue={[
                                filters.date_from,
                                filters.date_to
                            ]}
                        />
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{reports.total_metrics.orders}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{reports.total_metrics.completed_orders}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">${reports.total_metrics.revenue.toFixed(2)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Active Restaurants</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{reports.total_metrics.active_restaurants}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Orders by Status Pie Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Orders by Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PieChart width={300} height={300}>
                                <Tooltip />
                                <Pie
                                    data={reports.orders_by_status}
                                    dataKey="count"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#3b82f6"
                                    label
                                >
                                    {reports.orders_by_status.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                [
                                                    '#3b82f6', // blue
                                                    '#f59e0b', // amber
                                                    '#10b981', // emerald
                                                    '#ef4444', // red
                                                    '#8b5cf6', // violet
                                                ][index % 5]
                                            }
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </CardContent>
                    </Card>

                    {/* Monthly Revenue Line Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LineChart
                                width={500}
                                height={300}
                                data={reports.monthly_revenue}
                            >
                                {/* X Axis */}
                                <XAxis dataKey="month" />
                                {/* Y Axis */}
                                <YAxis />
                                {/* Tooltip */}
                                <Tooltip />
                                {/* Line */}
                                <Line type="monotone" dataKey="revenue" stroke="#10b981" />
                            </LineChart>
                        </CardContent>
                    </Card>

                    {/* Top Restaurants Bar Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Top Restaurants by Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BarChart
                                data={{
                                    data: reports.top_restaurants.map(item => item.orders),
                                    labels: reports.top_restaurants.map(item => item.name),
                                    datasets: [
                                        {
                                            label: 'Number of Orders',
                                            data: reports.top_restaurants.map(item => item.orders),
                                            backgroundColor: '#3b82f6',
                                        },
                                    ],
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}