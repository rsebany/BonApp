import React, { useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  DollarSign,
  MapPin,
  Star,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line
} from 'recharts';
import { Link } from '@inertiajs/react';

// Define types for your data
type StatCardProps = {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
};

type OrderStatusData = {
  name: string;
  value: number;
  color: string;
};

type RecentOrder = {
  id: string;
  customer: string;
  restaurant: string;
  amount: string;
  status: 'Delivered' | 'In Transit' | 'Preparing' | 'Cancelled';
  time: string;
};

type TopRestaurant = {
  name: string;
  orders: number;
  rating: number;
  revenue: string;
};

// Mock data - replace with real data from your API
const mockData = {
  stats: [
    { label: 'Total Orders', value: '2,847', change: '+12.5%', trend: 'up', icon: ShoppingBag },
    { label: 'Active Customers', value: '1,234', change: '+8.2%', trend: 'up', icon: Users },
    { label: 'Revenue Today', value: '$15,847', change: '+23.1%', trend: 'up', icon: DollarSign },
    { label: 'Avg Delivery Time', value: '28 min', change: '-2.3%', trend: 'down', icon: Clock }
  ] as StatCardProps[],
  revenueData: [
    { date: 'Mon', revenue: 2400, orders: 45 },
    { date: 'Tue', revenue: 1398, orders: 32 },
    { date: 'Wed', revenue: 9800, orders: 89 },
    { date: 'Thu', revenue: 3908, orders: 67 },
    { date: 'Fri', revenue: 4800, orders: 92 },
    { date: 'Sat', revenue: 3800, orders: 78 },
    { date: 'Sun', revenue: 4300, orders: 85 }
  ],
  orderStatusData: [
    { name: 'Delivered', value: 1847, color: '#10B981' },
    { name: 'In Transit', value: 423, color: '#F59E0B' },
    { name: 'Preparing', value: 298, color: '#3B82F6' },
    { name: 'Cancelled', value: 89, color: '#EF4444' }
  ] as OrderStatusData[],
  recentOrders: [
    { id: '#12847', customer: 'John Doe', restaurant: 'Pizza Palace', amount: '$45.50', status: 'Delivered', time: '2 min ago' },
    { id: '#12846', customer: 'Sarah Wilson', restaurant: 'Burger King', amount: '$23.75', status: 'In Transit', time: '5 min ago' },
    { id: '#12845', customer: 'Mike Johnson', restaurant: 'Sushi Zen', amount: '$67.20', status: 'Preparing', time: '8 min ago' },
    { id: '#12844', customer: 'Emily Brown', restaurant: 'Taco Bell', amount: '$31.90', status: 'Delivered', time: '12 min ago' },
    { id: '#12843', customer: 'David Lee', restaurant: 'Thai Garden', amount: '$52.40', status: 'Cancelled', time: '15 min ago' }
  ] as RecentOrder[],
  topRestaurants: [
    { name: 'Pizza Palace', orders: 245, rating: 4.8, revenue: '$12,450' },
    { name: 'Burger King', orders: 198, rating: 4.6, revenue: '$9,870' },
    { name: 'Sushi Zen', orders: 156, rating: 4.9, revenue: '$15,680' },
    { name: 'Taco Bell', orders: 134, rating: 4.4, revenue: '$6,720' },
    { name: 'Thai Garden', orders: 112, rating: 4.7, revenue: '$8,960' }
  ] as TopRestaurant[]
};

const StatCard = ({ stat }: { stat: StatCardProps }) => {
  const Icon = stat.icon;
  const isPositive = stat.trend === 'up';
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${isPositive ? 'bg-green-100' : 'bg-blue-100'}`}>
            <Icon className={`w-6 h-6 ${isPositive ? 'text-green-600' : 'text-blue-600'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
          isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          <TrendingUp className={`w-4 h-4 ${!isPositive && 'rotate-180'}`} />
          <span>{stat.change}</span>
        </div>
      </div>
    </div>
  );
};

const OrderStatusBadge = ({ status }: { status: RecentOrder['status'] }) => {
  const colors = {
    'Delivered': 'bg-green-100 text-green-700',
    'In Transit': 'bg-yellow-100 text-yellow-700',
    'Preparing': 'bg-blue-100 text-blue-700',
    'Cancelled': 'bg-red-100 text-red-700'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {status}
    </span>
  );
};

export function AdminMain() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="space-y-6 from-orange-50 via-yellow-50 to-orange-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-600 py-2">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex space-x-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockData.stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue & Orders</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Orders</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockData.revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#10b981" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={mockData.orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {mockData.orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {mockData.orderStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {mockData.recentOrders.map((order, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">{order.id}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{order.customer} • {order.restaurant}</p>
                    <p className="text-xs text-gray-500 mt-1">{order.time}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-gray-900">{order.amount}</span>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Restaurants */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Top Restaurants</h3>
              <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {mockData.topRestaurants.map((restaurant, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{restaurant.name}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{restaurant.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{restaurant.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{restaurant.revenue}</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm mt-1">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { 
              label: 'Add Restaurant', 
              icon: MapPin, 
              color: 'bg-blue-500',
              href: route('admin.restaurants.create')
            },
            { 
              label: 'Manage Orders', 
              icon: ShoppingBag, 
              color: 'bg-green-500',
              href: route('admin.orders.index')
            },
            { 
              label: 'View Reports', 
              icon: TrendingUp, 
              color: 'bg-purple-500',
              href: route('admin.reports.index')
            },
            { 
              label: 'User Management', 
              icon: Users, 
              color: 'bg-orange-500',
              href: route('admin.users.index')
            }
          ].map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
            >
              <div className={`p-2 rounded-lg ${action.color}`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-gray-900">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}