import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface SalesReportData {
    total_sales: number;
    average_order_value: number;
    total_transactions: number;
    sales_over_time: Array<{ date: string; sales: number }>;
    sales_by_restaurant: Array<{ name: string; sales: number }>;
    top_selling_menu_items: Array<{ name: string; sales: number }>;
}

export default function SalesReport() {
    const { reports, filters } = usePage<{ reports: SalesReportData; filters: { date_from: string; date_to: string } }>().props;

    return (
        <AdminLayout>
            <Head title="Sales Reports" />

            <div className="container py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Sales Reports</h1>
                    <div className="flex items-center space-x-4">
                        <DateRangePicker
                             defaultValue={[
                                filters.date_from,
                                filters.date_to
                            ]}
                        />
                        <a href={route('admin.reports.export', { type: 'sales', date_from: filters.date_from, date_to: filters.date_to })} download>
                            <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">${reports.total_sales.toFixed(2)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">${reports.average_order_value.toFixed(2)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{reports.total_transactions}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Sales Over Time Line Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales Over Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={reports.sales_over_time}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                                    <Legend />
                                    <Line type="monotone" dataKey="sales" stroke="#3b82f6" name="Sales" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Sales by Restaurant Bar Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sales by Restaurant</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={reports.sales_by_restaurant}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                                        <Legend />
                                        <Bar dataKey="sales" fill="#10b981" name="Sales" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Top Selling Menu Items Bar Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Selling Menu Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={reports.top_selling_menu_items}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                                        <Legend />
                                        <Bar dataKey="sales" fill="#f59e0b" name="Sales" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
