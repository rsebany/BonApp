import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  ShoppingCart, 
  Heart, 
  Bell,  
  MapPin, 
  Clock,
  Star,
  Gift,
  Zap
} from 'lucide-react';

interface AppHeaderProps {
  title: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showCart?: boolean;
}

export function AppHeader({ title, showSearch, showNotifications, showCart }: AppHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(7);
  const [notificationCount] = useState(2);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Menu Toggle & Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-2">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                {title}
              </span>
            </div>
          </div>

          {/* Center Section - Search Bar */}
          {showSearch && (
            <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for restaurants, cuisines, or dishes..."
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                {searchQuery && (
                  <button className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="bg-orange-500 hover:bg-orange-600 rounded-full p-2 transition-colors duration-200">
                      <Search className="h-4 w-4 text-white" />
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right Section - Action Icons & Profile */}
          <div className="flex items-center space-x-2">
            {/* Location Indicator */}
            <div className="hidden md:flex items-center space-x-1 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span className="font-medium">Downtown</span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-1">
              {/* Delivery Time */}
              <div className="hidden lg:flex items-center space-x-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <Clock className="h-3 w-3" />
                <span className="font-medium">25-30 min</span>
              </div>

              {/* Offers/Promotions */}
              <button className="relative p-2 rounded-lg hover:bg-orange-50 transition-colors duration-200 group">
                <Gift className="h-5 w-5 text-orange-500 group-hover:text-orange-600" />
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  !
                </div>
              </button>

              {/* Wishlist/Favorites */}
              <button className="relative p-2 rounded-lg hover:bg-red-50 transition-colors duration-200 group">
                <Heart className="h-5 w-5 text-gray-600 group-hover:text-red-500" />
                {wishlistCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </div>
                )}
              </button>

              {/* Notifications */}
              {showNotifications && (
                <button className="relative p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 group">
                  <Bell className="h-5 w-5 text-gray-600 group-hover:text-blue-500" />
                  {notificationCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {notificationCount}
                    </div>
                  )}
                </button>
              )}

              {/* Shopping Cart */}
              {showCart && (
                <button className="relative p-2 rounded-lg hover:bg-orange-50 transition-colors duration-200 group">
                  <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-orange-500" />
                  {cartCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {cartCount}
                    </div>
                  )}
                </button>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3 ml-2">
              <div className="relative">
                <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format"
                      alt="User avatar"
                      className="h-8 w-8 rounded-full object-cover border-2 border-orange-200"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full h-3 w-3 border-2 border-white"></div>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">John Doe</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500">4.8</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (appears below header on small screens) */}
      {showSearch && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search food, restaurants..."
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      )}

    
      {/* Promotional Banner 
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gift className="h-4 w-4" />
            <span className="text-sm font-medium">
              🎉 Free delivery on orders over $25 • Use code: FREEBITE
            </span>
          </div>
          <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">
            Claim Now
          </button>
        </div>
    </div>*/}
    
    </header>
  );
}

export const FoodDeliveryHeader = () => {
  return (
    <AppHeader 
      title="QuickBite" 
      showSearch={true} 
      showNotifications={true} 
      showCart={true} 
    />
  );
}