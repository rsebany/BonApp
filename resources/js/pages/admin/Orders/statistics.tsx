import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface OrderStatisticsProps {
  statistics: {
    total_orders: number;
    total_revenue: number;
    average_order_value: number;
    orders_by_status: {
      status: string;
      count: number;
    }[];
    orders_by_restaurant: {
      restaurant_name: string;
      count: number;
      revenue: number;
    }[];
    orders_by_hour: {
      hour: number;
      count: number;
    }[];
    orders_by_day: {
      day: string;
      count: number;
      revenue: number;
    }[];
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function OrderStatistics({ statistics }: OrderStatisticsProps) {
  return (
    <AdminLayout title="Orders Management">
      <Head title="Order Statistics" />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Order Statistics</h1>
          <p className="text-gray-600">Overview of order performance and trends</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statistics.total_orders}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${statistics.total_revenue.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${statistics.average_order_value.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statistics.orders_by_status}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {statistics.orders_by_status.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders by Restaurant */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Restaurant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statistics.orders_by_restaurant}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="restaurant_name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="count" name="Orders" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders by Hour */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={statistics.orders_by_hour}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" name="Orders" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders by Day */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={statistics.orders_by_day}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="count" name="Orders" stroke="#8884d8" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 