import React from 'react';
import { Utensils, Search, Menu } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/Navigation/UserNavigation/user-menu-content';
import { UserInfo } from '@/components/Navigation/UserNavigation/user-info';
import { CartDropdown } from '@/components/Navigation/UserNavigation/cart-dropdown';
import { LocationSelector } from '@/components/Navigation/UserNavigation/location-selector';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

const TopNavBar = ({ onToggleMobileMenu }: { onToggleMobileMenu: () => void }) => {
  const { auth } = usePage<SharedData>().props;
  const user = auth.user;
  
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side - Logo and mobile menu */}
        <div className="flex items-center gap-2">
          <button 
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={onToggleMobileMenu}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">BonApp</span>
          </div>
        </div>

        {/* Center - Search Bar (Hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for restaurants or dishes..."
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Right side - Location, Cart, Profile */}
        <div className="flex items-center space-x-4">
          <LocationSelector />
          <CartDropdown />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 focus:outline-none hover:bg-gray-100 rounded-lg p-1 transition-colors">
                <UserInfo user={user} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="min-w-56 mt-2 z-[60]" 
              sideOffset={8}
              alignOffset={-4}
              side="bottom"
            >
              <UserMenuContent user={user} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TopNavBar;
