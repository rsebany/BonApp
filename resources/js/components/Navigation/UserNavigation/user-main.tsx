import React, { useState } from 'react';
import { 
  Clock,
  CheckCircle,
  Truck,
  Utensils,
  Star,
  Heart,
  Search,
  MapPin,
  ChevronRight,
  History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define types
type OrderStatus = 'Preparing' | 'On the way' | 'Delivered' | 'Cancelled';

type RecentOrder = {
  id: string;
  restaurant: string;
  items: string[];
  status: OrderStatus;
  time: string;
  deliveryEstimate: string;
  total: string;
};

type FavoriteRestaurant = {
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
};

type RecommendedRestaurant = {
  name: string;
  cuisine: string;
  deliveryFee: string;
  minOrder: string;
  rating: number;
  deliveryTime: string;
  image: string;
};

// Mock data
const mockData = {
  recentOrders: [
    {
      id: '#12847',
      restaurant: 'Pizza Palace',
      items: ['Margherita Pizza', 'Garlic Bread', 'Coke'],
      status: 'On the way',
      time: '2 min ago',
      deliveryEstimate: '10:45 AM',
      total: '$24.50'
    },
    {
      id: '#12846',
      restaurant: 'Sushi Zen',
      items: ['California Roll', 'Miso Soup'],
      status: 'Preparing',
      time: '15 min ago',
      deliveryEstimate: '11:15 AM',
      total: '$18.75'
    },
    {
      id: '#12845',
      restaurant: 'Burger King',
      items: ['Whopper Meal', 'Onion Rings'],
      status: 'Delivered',
      time: 'Yesterday, 7:30 PM',
      deliveryEstimate: 'Delivered',
      total: '$14.20'
    }
  ] as RecentOrder[],
  favorites: [
    {
      name: 'Pizza Palace',
      cuisine: 'Italian',
      rating: 4.8,
      deliveryTime: '20-30 min',
      image: '/pizza.jpg'
    },
    {
      name: 'Sushi Zen',
      cuisine: 'Japanese',
      rating: 4.9,
      deliveryTime: '25-35 min',
      image: '/sushi.jpg'
    },
    {
      name: 'Thai Garden',
      cuisine: 'Thai',
      rating: 4.7,
      deliveryTime: '30-40 min',
      image: '/thai.jpg'
    }
  ] as FavoriteRestaurant[],
  recommendations: [
    {
      name: 'Burger King',
      cuisine: 'American',
      deliveryFee: '$2.99',
      minOrder: '$10.00',
      rating: 4.5,
      deliveryTime: '15-25 min',
      image: '/burger.jpg'
    },
    {
      name: 'Taco Bell',
      cuisine: 'Mexican',
      deliveryFee: '$1.99',
      minOrder: '$8.00',
      rating: 4.3,
      deliveryTime: '20-30 min',
      image: '/taco.jpg'
    },
    {
      name: 'Mediterranean Grill',
      cuisine: 'Mediterranean',
      deliveryFee: '$3.49',
      minOrder: '$12.00',
      rating: 4.6,
      deliveryTime: '25-35 min',
      image: '/mediterranean.jpg'
    }
  ] as RecommendedRestaurant[]
};

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const statusConfig = {
    'Preparing': { icon: Utensils, color: 'bg-blue-100 text-blue-600' },
    'On the way': { icon: Truck, color: 'bg-yellow-100 text-yellow-600' },
    'Delivered': { icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    'Cancelled': { icon: Clock, color: 'bg-red-100 text-red-600' }
  };

  const { icon: Icon, color } = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status}
    </span>
  );
};

export function UserMain() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites'>('orders');

  return (
    <div className="space-y-6 pb-20">
      {/* Header with search */}
      <div className="bg-white p-4 rounded-xl shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Hello, User!</h1>
        <p className="text-gray-600 mb-4">What would you like to order today?</p>
        
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for restaurants or dishes..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            className="absolute right-3 top-3.5 text-blue-600 hover:text-blue-700"
            onClick={() => navigate('/search')}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Current order status (if any) */}
      {mockData.recentOrders[0].status !== 'Delivered' && (
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Current Order</h2>
            <span className="text-sm text-gray-500">{mockData.recentOrders[0].time}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <img 
                src={`${mockData.recentOrders[0].restaurant.toLowerCase().replace(' ', '-')}.jpg`} 
                alt={mockData.recentOrders[0].restaurant}
                className="w-12 h-12 rounded-md object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{mockData.recentOrders[0].restaurant}</h3>
              <p className="text-sm text-gray-600 truncate">
                {mockData.recentOrders[0].items.join(', ')}
              </p>
            </div>
            <OrderStatusBadge status={mockData.recentOrders[0].status} />
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Estimated delivery</p>
              <p className="font-medium">{mockData.recentOrders[0].deliveryEstimate}</p>
            </div>
            <button 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              onClick={() => navigate(`/order/${mockData.recentOrders[0].id}`)}
            >
              Track order
            </button>
          </div>
        </div>
      )}

      {/* Tabs for orders/favorites */}
      <div className="bg-white p-1 rounded-xl shadow-sm">
        <div className="flex">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium rounded-lg ${activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('orders')}
          >
            My Orders
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium rounded-lg ${activeTab === 'favorites' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'orders' ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 px-2">Recent Orders</h2>
          
          {mockData.recentOrders.map((order, index) => (
            <div 
              key={index} 
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/order/${order.id}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">{order.restaurant}</h3>
                <span className="text-sm text-gray-500">{order.time}</span>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <img 
                    src={`${order.restaurant.toLowerCase().replace(' ', '-')}.jpg`} 
                    alt={order.restaurant}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {order.items.join(', ')}
                  </p>
                  <div className="mt-2">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.total}</p>
                  {order.status === 'Delivered' && (
                    <button 
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/restaurant/${order.restaurant.toLowerCase().replace(' ', '-')}`);
                      }}
                    >
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <button className="w-full flex items-center justify-center space-x-2 py-3 text-blue-600 hover:text-blue-700 font-medium">
            <History className="w-5 h-5" />
            <span>View all order history</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 px-2">Your Favorites</h2>
          
          {mockData.favorites.map((restaurant, index) => (
            <div 
              key={index} 
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/restaurant/${restaurant.name.toLowerCase().replace(' ', '-')}`)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <button 
                    className="absolute -top-1 -right-1 bg-white p-1 rounded-full shadow-md hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle unfavorite
                    }}
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  </button>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs font-medium">{restaurant.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{restaurant.deliveryTime}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
          
          {mockData.favorites.length === 0 && (
            <div className="text-center py-8">
              <Heart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900">No favorites yet</h3>
              <p className="text-gray-500 mt-1">Save your favorite restaurants for quick access</p>
              <button 
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => navigate('/search')}
              >
                Browse restaurants
              </button>
            </div>
          )}
        </div>
      )}

      {/* Restaurant recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-semibold text-gray-900">Recommended for you</h2>
          <button 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            onClick={() => navigate('/search')}
          >
            See all
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {mockData.recommendations.map((restaurant, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/restaurant/${restaurant.name.toLowerCase().replace(' ', '-')}`)}
            >
              <img 
                src={restaurant.image} 
                alt={restaurant.name}
                className="w-full h-24 object-cover"
              />
              <div className="p-3">
                <h3 className="font-medium text-gray-900 text-sm truncate">{restaurant.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{restaurant.cuisine}</p>
                <div className="flex items-center mt-2 space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-medium">{restaurant.rating}</span>
                  <span className="text-xs text-gray-500 mx-1">•</span>
                  <span className="text-xs text-gray-500">{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{restaurant.deliveryFee} delivery</span>
                  <span className="text-xs text-gray-500">Min {restaurant.minOrder}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery address */}
      <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Deliver to</p>
            <p className="font-medium text-gray-900">Home • 123 Main St, Apt 4B</p>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Change
        </button>
      </div>
    </div>
  );
}