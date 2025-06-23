import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign,
  MapPin,
  Star,
  ChevronRight,
  MoreHorizontal,
  BarChart3
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
  ResponsiveContainer
} from 'recharts';
import { Link } from '@inertiajs/react';

// Type Definitions
type StatCardProps = {
  stat: {
    label: string;
    value: string | number;
    icon: React.ElementType;
    change?: string;
    trend?: 'up' | 'down';
  };
};

type OrderStatusType = 'Delivered' | 'Out for Delivery' | 'Preparing' | 'Ready' | 'Confirmed' | 'Pending' | 'Cancelled';

type GrowthMetrics = {
  orders_growth: number;
  revenue_growth: number;
};

type StatProps = {
  total_orders: number;
  total_customers: number;
  total_revenue: number;
  total_restaurants: number;
};

type TodayStatsProps = {
  orders: number;
  revenue: number;
  new_customers: number;
};

type OrderStatusDistribution = {
  status: string;
  count: number;
}[];

type RecentOrder = {
  id: number;
  status: string;
  customer_name: string;
  restaurant_name: string;
  created_at: string;
  total_amount: number;
}[];

type TopRestaurant = {
  id: number;
  name: string;
  avg_rating: number;
  total_orders: number;
  total_revenue: number;
}[];

type WeeklyRevenue = {
  date: string;
  revenue: number;
}[];

type MonthlyOrders = {
  date: string;
  orders: number;
}[];

type AdminPageProps = {
  stats: StatProps;
  todayStats: TodayStatsProps;
  weeklyRevenue: WeeklyRevenue;
  orderStatusDistribution: OrderStatusDistribution;
  monthlyOrders: MonthlyOrders;
  recentOrders: RecentOrder;
  topRestaurants: TopRestaurant;
  growthMetrics: GrowthMetrics;
};

// Default Data
const DEFAULT_STATS: StatProps = {
  total_orders: 0,
  total_customers: 0,
  total_revenue: 0,
  total_restaurants: 0
};

const DEFAULT_TODAY_STATS: TodayStatsProps = {
  orders: 0,
  revenue: 0,
  new_customers: 0
};

const DEFAULT_GROWTH_METRICS: GrowthMetrics = {
  orders_growth: 0,
  revenue_growth: 0
};

// Components
const StatCard: React.FC<StatCardProps> = ({ stat }) => {
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
        {stat.change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
            isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <TrendingUp className={`w-4 h-4 ${!isPositive && 'rotate-180'}`} />
            <span>{stat.change}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const OrderStatusBadge = ({ status }: { status: string }) => {
  const colors: Record<OrderStatusType, string> = {
    'Delivered': 'bg-green-100 text-green-700',
    'Out for Delivery': 'bg-yellow-100 text-yellow-700',
    'Preparing': 'bg-blue-100 text-blue-700',
    'Ready': 'bg-purple-100 text-purple-700',
    'Confirmed': 'bg-cyan-100 text-cyan-700',
    'Pending': 'bg-orange-100 text-orange-700',
    'Cancelled': 'bg-red-100 text-red-700'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as OrderStatusType] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

// Helper function to get color based on status
const getStatusColor = (status: string): string => {
  switch(status) {
    case 'Delivered':
      return '#10B981';
    case 'Out for Delivery':
      return '#F59E0B';
    case 'Preparing':
      return '#3B82F6';
    case 'Ready':
      return '#8B5CF6';
    case 'Confirmed':
      return '#2563EB';
    case 'Pending':
      return '#FB7185';
    case 'Cancelled':
      return '#EF4444';
    default:
      return '#9CA3AF';
  }
};

// Main Component
export const AdminMain: React.FC = () => {
  const { props } = usePage<AdminPageProps>();
  const [timeRange, setTimeRange] = useState('7d');
  
  // Safely access props with fallbacks
  const stats = props.stats || DEFAULT_STATS;
  const todayStats = props.todayStats || DEFAULT_TODAY_STATS;
  const weeklyRevenue = props.weeklyRevenue || [];
  const monthlyOrders = props.monthlyOrders || [];
  const orderStatusDistribution = props.orderStatusDistribution || [];
  const topRestaurants = props.topRestaurants || [];
  const recentOrders = props.recentOrders || [];
  const growthMetrics = props.growthMetrics || DEFAULT_GROWTH_METRICS;

  // Handle time range change
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    // Reload the page with new time range
    window.location.href = `${route('admin.dashboard')}?timeRange=${range}`;
  };

  // Format stats data
  const statCards = [
    { 
      label: 'Total Orders', 
      value: stats.total_orders.toLocaleString(), 
      icon: ShoppingBag 
    },
    { 
      label: 'Active Customers', 
      value: stats.total_customers.toLocaleString(), 
      icon: Users 
    },
    { 
      label: 'Total Revenue', 
      value: `$${stats.total_revenue.toLocaleString(undefined, {maximumFractionDigits: 2})}`, 
      icon: DollarSign 
    },
    { 
      label: 'Restaurants', 
      value: stats.total_restaurants.toLocaleString(), 
      icon: MapPin 
    }
  ];

  // Format today's stats with growth indicators
  const todayStatCards = [
    { 
      label: "Today's Orders", 
      value: todayStats.orders.toLocaleString(), 
      change: growthMetrics.orders_growth >= 0 ? `+${growthMetrics.orders_growth}%` : `${growthMetrics.orders_growth}%`, 
      trend: growthMetrics.orders_growth >= 0 ? 'up' as const : 'down' as const, 
      icon: ShoppingBag 
    },
    { 
      label: "Today's Revenue", 
      value: `$${todayStats.revenue.toLocaleString(undefined, {maximumFractionDigits: 2})}`, 
      change: growthMetrics.revenue_growth >= 0 ? `+${growthMetrics.revenue_growth}%` : `${growthMetrics.revenue_growth}%`, 
      trend: growthMetrics.revenue_growth >= 0 ? 'up' as const : 'down' as const, 
      icon: DollarSign 
    },
    { 
      label: "New Customers", 
      value: todayStats.new_customers.toLocaleString(), 
      change: '', 
      trend: 'up' as const, 
      icon: Users 
    }
  ];

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
              onClick={() => handleTimeRangeChange(range)}
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
        {statCards.map((stat, index) => (
          <StatCard key={`stat-${index}`} stat={stat} />
        ))}
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {todayStatCards.map((stat, index) => (
          <StatCard key={`today-stat-${index}`} stat={stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Revenue</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value) => [`$${value}`, 'Revenue']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={orderStatusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                nameKey="status"
              >
                {orderStatusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Orders']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {orderStatusDistribution.map((item, index) => (
              <div key={`status-${index}`} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getStatusColor(item.status) }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.status}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Orders Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Orders</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyOrders}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              formatter={(value) => [value, 'Orders']}
            />
            <Area 
              type="monotone" 
              dataKey="orders" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <div className="flex items-center space-x-3">
                <Link 
                  href={route('admin.orders.statistics')} 
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Statistics</span>
                </Link>
                <Link 
                  href={route('admin.orders.index')} 
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">#{order.id}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{order.customer_name} • {order.restaurant_name}</p>
                    <p className="text-xs text-gray-500 mt-1">{order.created_at}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-gray-900">${order.total_amount}</span>
                    <Link 
                      href={route('admin.orders.show', order.id)} 
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </Link>
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
              <Link 
                href={route('admin.restaurants.index')} 
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {topRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{restaurant.name}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{restaurant.avg_rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{restaurant.total_orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${restaurant.total_revenue.toFixed(2)}</p>
                    <Link 
                      href={route('admin.restaurants.show', restaurant.id)} 
                      className="text-blue-600 hover:text-blue-700 text-sm mt-1"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Growth</h3>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {growthMetrics.orders_growth >= 0 ? '+' : ''}{growthMetrics.orders_growth}%
            </span>
            <span className="text-sm text-gray-500 mb-1">vs previous {timeRange}</span>
          </div>
          <div className={`mt-2 flex items-center ${
            growthMetrics.orders_growth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`w-5 h-5 ${
              growthMetrics.orders_growth < 0 && 'rotate-180'
            }`} />
            <span className="ml-1 text-sm font-medium">
              {growthMetrics.orders_growth >= 0 ? 'Increase' : 'Decrease'}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Growth</h3>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {growthMetrics.revenue_growth >= 0 ? '+' : ''}{growthMetrics.revenue_growth}%
            </span>
            <span className="text-sm text-gray-500 mb-1">vs previous {timeRange}</span>
          </div>
          <div className={`mt-2 flex items-center ${
            growthMetrics.revenue_growth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`w-5 h-5 ${
              growthMetrics.revenue_growth < 0 && 'rotate-180'
            }`} />
            <span className="ml-1 text-sm font-medium">
              {growthMetrics.revenue_growth >= 0 ? 'Increase' : 'Decrease'}
            </span>
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
};