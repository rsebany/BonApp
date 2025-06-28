import React, { useState } from 'react'; 
import { LayoutGrid, Store, ShoppingBag, Heart, MapPin, Utensils, Bell, Star, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';

const LeftSidebar = ({ activeItem, setActiveItem, isMobileMenuOpen, onCloseMobileMenu }: {
  activeItem: string;
  setActiveItem: (item: string) => void;
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}) => {
  const [showMore, setShowMore] = useState(false);

  const mainMenuItems = [
    { name: 'Home', icon: <LayoutGrid className="w-5 h-5" />, href: route('user.home') },
    { name: 'Restaurants', icon: <Store className="w-5 h-5" />, href: route('restaurants.index') },
    { name: 'My Orders', icon: <ShoppingBag className="w-5 h-5" />, href: route('orders.index') },
    { name: 'Favorites', icon: <Heart className="w-5 h-5" />, href: route('restaurants.favorites') },
    { name: 'Addresses', icon: <MapPin className="w-5 h-5" />, href: route('addresses.index') }
  ];

  const additionalMenuItems = [
    { name: 'Settings', icon: <Utensils className="w-5 h-5" />, href: route('profile.edit') },
    { name: 'Help & Support', icon: <Bell className="w-5 h-5" />, href: route('support') },
    { name: 'About Us', icon: <Star className="w-5 h-5" />, href: route('about') },
    { name: 'Terms & Conditions', icon: <Award className="w-5 h-5" />, href: route('terms') }
  ];

  const handleItemClick = (itemName: string) => {
    const item = [...mainMenuItems, ...additionalMenuItems].find(i => i.name === itemName);
    setActiveItem(itemName);
    onCloseMobileMenu();
    if (item && item.href) {
      console.log('Navigating to:', item.href);
      router.visit(item.href);
    }
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onCloseMobileMenu}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 lg:z-0
        w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:h-[calc(100vh-4rem)] h-screen
      `}>
        <div className="h-full overflow-y-auto scrollbar-hide">
          <div className="p-6">
            <nav className="space-y-2">
              {/* Main menu items */}
              {mainMenuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleItemClick(item.name)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeItem === item.name
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}

              {/* See More button */}
              <button
                onClick={toggleShowMore}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <span className="font-medium">See more</span>
                {showMore ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {/* Additional menu items (collapsible) */}
              {showMore && (
                <div className="space-y-2 mt-2">
                  {additionalMenuItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleItemClick(item.name)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeItem === item.name
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;