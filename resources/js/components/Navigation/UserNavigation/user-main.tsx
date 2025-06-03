import React, { useState } from 'react';
import { 
  Clock,
  CheckCircle,
  Truck,
  Utensils,
  Star,
  Heart,
  MapPin,
  History,
  Home,
  Clock4,
  Award,
  Flame
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define types (same as before)
type OrderStatus = 'Preparing' | 'On the way' | 'Delivered' | 'Cancelled';

interface RecentOrder {
  id: string;
  restaurant: string;
  items: string[];
  status: OrderStatus;
  time: string;
  deliveryEstimate: string;
  total: string;
  image: string;
}

interface Restaurant {
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  minOrder?: string;
  image: string;
  isFavorite?: boolean;
  isTrending?: boolean;
  isTopRated?: boolean;
}

// Enhanced mock data with more images and properties
const mockData = {
  recentOrders: [
    {
      id: '#12847',
      restaurant: 'Pizza Palace',
      items: ['Margherita Pizza', 'Garlic Bread', 'Coke'],
      status: 'On the way',
      time: '2 min ago',
      deliveryEstimate: '10:45 AM',
      total: '$24.50',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=300&auto=format&fit=crop'
    },
    {
      id: '#12846',
      restaurant: 'Sushi Zen',
      items: ['California Roll', 'Miso Soup'],
      status: 'Preparing',
      time: '15 min ago',
      deliveryEstimate: '11:15 AM',
      total: '$18.75',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&h=300&auto=format&fit=crop'
    },
    {
      id: '#12845',
      restaurant: 'Burger King',
      items: ['Whopper Meal', 'Onion Rings'],
      status: 'Delivered',
      time: 'Yesterday, 7:30 PM',
      deliveryEstimate: 'Delivered',
      total: '$14.20',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&auto=format&fit=crop'
    }
  ] as RecentOrder[],
  
  favorites: [
    {
      name: 'Pizza Palace',
      cuisine: 'Italian',
      rating: 4.8,
      deliveryTime: '20-30 min',
      deliveryFee: '$1.99',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=300&auto=format&fit=crop',
      isFavorite: true
    },
    {
      name: 'Sushi Zen',
      cuisine: 'Japanese',
      rating: 4.9,
      deliveryTime: '25-35 min',
      deliveryFee: '$2.49',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&h=300&auto=format&fit=crop',
      isFavorite: true
    }
  ] as Restaurant[],
  
  recommendations: [
    {
      name: 'Burger King',
      cuisine: 'American',
      deliveryFee: '$2.99',
      minOrder: '$10.00',
      rating: 4.5,
      deliveryTime: '15-25 min',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&auto=format&fit=crop',
      isTrending: true
    },
    {
      name: 'Taco Bell',
      cuisine: 'Mexican',
      deliveryFee: '$1.99',
      minOrder: '$8.00',
      rating: 4.3,
      deliveryTime: '20-30 min',
      image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&h=300&auto=format&fit=crop',
      isTrending: true
    },
    {
      name: 'Mediterranean Grill',
      cuisine: 'Mediterranean',
      deliveryFee: '$3.49',
      minOrder: '$12.00',
      rating: 4.6,
      deliveryTime: '25-35 min',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&auto=format&fit=crop',
      isTopRated: true
    },
    {
      name: 'Thai Orchid',
      cuisine: 'Thai',
      deliveryFee: '$2.99',
      minOrder: '$15.00',
      rating: 4.7,
      deliveryTime: '30-40 min',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&auto=format&fit=crop',
      isTopRated: true
    }
  ] as Restaurant[],
  
  categories: [
    { name: 'Fast Food', icon: <Flame className="w-5 h-5" /> },
    { name: 'Italian', icon: <Utensils className="w-5 h-5" /> },
    { name: 'Asian', icon: <Award className="w-5 h-5" /> },
    { name: 'Home Style', icon: <Home className="w-5 h-5" /> },
    { name: '24/7', icon: <Clock4 className="w-5 h-5" /> }
  ]
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

const RestaurantCard = ({ restaurant, onClick }: { restaurant: Restaurant, onClick: () => void }) => (
  <div 
    className="bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col"
    onClick={onClick}
  >
    <div className="relative aspect-square">
      <img 
        src={restaurant.image} 
        alt={restaurant.name}
        className="w-full h-full object-cover"
      />
      <button 
        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
        onClick={(e) => {
          e.stopPropagation();
          // Handle favorite toggle
        }}
      >
        <Heart 
          className={`w-4 h-4 ${restaurant.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
        />
      </button>
      {restaurant.isTrending && (
        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
          Trending
        </div>
      )}
      {restaurant.isTopRated && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          Top Rated
        </div>
      )}
    </div>
    <div className="p-3 flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-medium text-gray-900 truncate">{restaurant.name}</h3>
        <div className="flex items-center bg-gray-100 px-1.5 py-0.5 rounded ml-2">
          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
          <span className="text-xs font-medium">{restaurant.rating}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-3">{restaurant.cuisine}</p>
      <div className="mt-auto flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-500">
          <Truck className="w-3 h-3 mr-1" />
          <span>{restaurant.deliveryTime}</span>
        </div>
        <span className="text-gray-900">{restaurant.deliveryFee}</span>
      </div>
    </div>
  </div>
);

export function UserMain() {
  const navigate = useNavigate();
   {/*const [searchQuery, setSearchQuery] = useState('');*/}
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites'>('orders');

  return (
    <div className="flex flex-col gap-4">
      {/* Header with greeting and search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Good afternoon, User!</h1>
        <p className="text-gray-600 mb-4">What delicious meal are you craving today?</p>
        
        {/*<div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for restaurants or dishes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>*/}
      </div>

      {/* Delivery address */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <MapPin className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Deliver to</p>
            <p className="font-medium text-gray-900">Home • 123 Main St, Apt 4B</p>
          </div>
        </div>
        <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
          Change
        </button>
      </div>

      {/* Food categories */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Categories</h2>
        <div className="grid grid-cols-5 gap-2">
          {mockData.categories.map((category, index) => (
            <button 
              key={index}
              className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50 hover:bg-orange-50 transition-colors"
              onClick={() => navigate(`/search?category=${category.name}`)}
            >
              <div className="bg-orange-100 p-2 rounded-full mb-2 text-orange-500">
                {category.icon}
              </div>
              <span className="text-xs font-medium text-gray-700">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current order status (if any) */}
      {mockData.recentOrders[0].status !== 'Delivered' && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Current Order</h2>
            <span className="text-sm text-gray-500">{mockData.recentOrders[0].time}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={mockData.recentOrders[0].image}
                alt={mockData.recentOrders[0].restaurant}
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {mockData.recentOrders[0].items.length}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{mockData.recentOrders[0].restaurant}</h3>
              <p className="text-sm text-gray-600 truncate">
                {mockData.recentOrders[0].items.join(', ')}
              </p>
            </div>
            <OrderStatusBadge status={mockData.recentOrders[0].status} />
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Estimated delivery</p>
              <p className="font-medium text-sm">{mockData.recentOrders[0].deliveryEstimate}</p>
            </div>
            <button 
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              onClick={() => navigate(`/order/${mockData.recentOrders[0].id}`)}
            >
              Track order
            </button>
          </div>
        </div>
      )}

      {/* Tabs for orders/favorites */}
      <div className="bg-white p-1 rounded-lg shadow-sm">
        <div className="flex">
          <button
            className={`flex-1 py-2 px-4 text-center font-medium rounded-md text-sm ${activeTab === 'orders' ? 'bg-orange-50 text-orange-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('orders')}
          >
            My Orders
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center font-medium rounded-md text-sm ${activeTab === 'favorites' ? 'bg-orange-50 text-orange-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'orders' ? (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-900 px-1">Recent Orders</h2>
          
          {mockData.recentOrders.map((order, index) => (
            <div 
              key={index} 
              className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/order/${order.id}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 text-sm">{order.restaurant}</h3>
                <span className="text-xs text-gray-500">{order.time}</span>
              </div>
              
              <div className="flex items-start gap-3">
                <img 
                  src={order.image}
                  alt={order.restaurant}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {order.items.join(', ')}
                  </p>
                  <div className="mt-2">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{order.total}</p>
                  {order.status === 'Delivered' && (
                    <button 
                      className="mt-1 text-xs text-orange-600 hover:text-orange-700"
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
          
          <button className="w-full flex items-center justify-center gap-2 py-2 text-orange-600 hover:text-orange-700 font-medium text-sm bg-white rounded-lg shadow-sm">
            <History className="w-4 h-4" />
            <span>View all order history</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-900 px-1">Your Favorites</h2>
          
          {mockData.favorites.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {mockData.favorites.map((restaurant, index) => (
                <RestaurantCard 
                  key={index}
                  restaurant={restaurant}
                  onClick={() => navigate(`/restaurant/${restaurant.name.toLowerCase().replace(' ', '-')}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-white rounded-lg shadow-sm">
              <Heart className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">No favorites yet</h3>
              <p className="text-gray-500 text-sm mt-1">Save your favorite restaurants for quick access</p>
              <button 
                className="mt-3 text-orange-600 hover:text-orange-700 font-medium text-sm"
                onClick={() => navigate('/search')}
              >
                Browse restaurants
              </button>
            </div>
          )}
        </div>
      )}

      {/* Restaurant recommendations */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-semibold text-gray-900">Recommended for you</h2>
          <button 
            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            onClick={() => navigate('/search')}
          >
            See all
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {mockData.recommendations.slice(0, 4).map((restaurant, index) => (
            <RestaurantCard 
              key={index}
              restaurant={restaurant}
              onClick={() => navigate(`/restaurant/${restaurant.name.toLowerCase().replace(' ', '-')}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}