import React from 'react';
import { Bell, ShoppingCart, Heart, MapPin, Star, ShoppingBag, Flame, Package, Gift, Settings, Plus, Home } from 'lucide-react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useUserSidebar } from '@/hooks/useUserSidebar';
import { useLocation } from '@/Context/LocationContext';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon?: string;
}

interface Address {
  id: number;
  address_line1: string;
  city: string;
  region: string;
  postal_code: string;
  country?: {
    country_name: string;
  };
}

const RightSidebar = () => {
  const { notifications, orders, unreadCount, loading, markNotificationAsRead } = useUserSidebar();
  const { state, setSelectedAddress } = useLocation();
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = React.useState(false);

  // Load user addresses
  React.useEffect(() => {
    const loadAddresses = async () => {
      setAddressesLoading(true);
      try {
        const response = await fetch('/api/user/addresses', {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.addresses) {
            setAddresses(data.addresses);
          }
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
        setAddresses([]);
      } finally {
        setAddressesLoading(false);
      }
    };

    loadAddresses();
  }, []);

  const handleViewFavorites = () => {
    router.visit(route('restaurants.index', { favorites_only: 1 }));
  };

  const handleTrackOrder = () => {
    router.visit(route('orders.index'));
  };

  const handleContactSupport = () => {
    router.visit(route('support'));
  };

  const handleManageAddresses = () => {
    router.visit(route('addresses.index'));
  };

  const handleAddAddress = () => {
    router.visit(route('addresses.create'));
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-green-500" />;
      case 'promotion':
        return <Gift className="w-4 h-4 text-purple-500" />;
      case 'system':
        return <Settings className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'out_for_delivery':
        return 'On the way';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready';
      case 'delivered':
        return 'Delivered';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getShortAddress = (address: Address): string => {
    return `${address.city}, ${address.region}`;
  };

  if (loading) {
    return (
      <div className="hidden xl:block w-80 bg-white border-l border-gray-200 h-[calc(100vh-4rem)]">
        <div className="h-full overflow-y-auto scrollbar-hide">
          <div className="p-6 space-y-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden xl:block w-80 bg-white border-l border-gray-200 h-[calc(100vh-4rem)]">
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="p-6 space-y-8">
          {/* Notifications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-400" />
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      notification.read 
                        ? 'border-gray-200 bg-gray-50' 
                        : 'border-emerald-200 bg-emerald-50'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Current Orders */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Current Orders</h3>
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map(order => (
                  <div key={order.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src={order.image_url || '/images/default-restaurant.jpg'} 
                        alt={order.restaurant_name}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/default-restaurant.jpg';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {order.restaurant_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                      {order.estimated_time && ` • ${order.estimated_time}`}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No active orders</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-emerald-500 text-white p-3 rounded-xl font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Reorder Favorite
              </button>
              <button 
                className="w-full bg-gray-100 text-gray-700 p-3 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                onClick={handleViewFavorites}
              >
                <Heart className="w-4 h-4" />
                View Favorites
              </button>
              <button 
                className="w-full bg-gray-100 text-gray-700 p-3 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                onClick={handleTrackOrder}
              >
                <MapPin className="w-4 h-4" />
                Track Order
              </button>
            </div>
          </div>

          {/* Delivery Addresses */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Delivery Addresses</h3>
              <button 
                onClick={handleAddAddress}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                title="Add new address"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="space-y-3">
              {addressesLoading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : addresses.length > 0 ? (
                addresses.map((address) => {
                  const isDefault = state.selectedAddress?.id === address.id;
                  
                  return (
                    <div 
                      key={address.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isDefault 
                          ? 'border-emerald-200 bg-emerald-50' 
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleSelectAddress(address)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <Home className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            isDefault ? 'text-emerald-600' : 'text-gray-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${
                              isDefault ? 'text-emerald-800' : 'text-gray-900'
                            }`}>
                              {getShortAddress(address)}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {address.address_line1}
                            </p>
                            {isDefault && (
                              <span className="inline-block mt-1 text-xs text-emerald-700 font-medium">
                                Default address
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm mb-3">No addresses saved</p>
                  <button 
                    onClick={handleAddAddress}
                    className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg hover:bg-emerald-200 transition-colors"
                  >
                    Add Address
                  </button>
                </div>
              )}
              
              {addresses.length > 0 && (
                <button 
                  onClick={handleManageAddresses}
                  className="w-full text-center text-sm text-gray-600 hover:text-gray-800 transition-colors py-2"
                >
                  Manage all addresses
                </button>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Rated Bella Vista</p>
                  <p className="text-xs text-gray-600">5 stars • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Added to favorites</p>
                  <p className="text-xs text-gray-600">Dragon Palace • 1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Order completed</p>
                  <p className="text-xs text-gray-600">Sakura Sushi • 2 days ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Promotional Banner */}
          <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Flame className="w-5 h-5" />
              <h4 className="font-bold">Special Offer!</h4>
            </div>
            <p className="text-sm text-orange-100 mb-3">
              Get 30% off your next 3 orders with code SAVE30
            </p>
            <button className="w-full bg-white text-gray-800 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              Use Code
            </button>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
            <div className="space-y-2">
              <button 
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                onClick={handleContactSupport}
              >
                <Bell className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Contact Support</span>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3">
                <Star className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">FAQ</span>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3">
                <Heart className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">Feedback</span>
              </button>
            </div>
          </div>

          {/* Extra spacing for scroll testing */}
          <div className="pb-8">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">End of sidebar content</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
