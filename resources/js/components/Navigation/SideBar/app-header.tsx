import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  MapPin,
  ChevronDown,
  Navigation,
  Clock} from 'lucide-react';

interface AppHeaderProps {
  title: string;
  showSearch?: boolean;
  showCart?: boolean;
}

interface LocationOption {
  id: string;
  name: string;
  address: string;
  distance?: string;
  isRecent?: boolean;
  isCurrent?: boolean;
}

const mockLocations: LocationOption[] = [
  {
    id: '1',
    name: 'Current Location',
    address: 'Algiers, Algeria',
    isCurrent: true
  },
  {
    id: '2',
    name: 'Home',
    address: '123 Main St, Algiers',
    isRecent: true
  },
  {
    id: '3',
    name: 'Work',
    address: '456 Business Ave, Algiers',
    isRecent: true
  },
  {
    id: '4',
    name: 'Downtown Algiers',
    address: 'Rue Didouche Mourad, Algiers',
    distance: '2.1 km'
  },
  {
    id: '5',
    name: 'Hydra',
    address: 'Hydra, Algiers',
    distance: '5.3 km'
  },
  {
    id: '6',
    name: 'Bab Ezzouar',
    address: 'Bab Ezzouar, Algiers',
    distance: '8.7 km'
  }
];

export function AppHeader({ title, showSearch, showCart }: AppHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount] = useState(3);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(mockLocations[0]);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLocations = mockLocations.filter(location =>
    location.name.toLowerCase().includes(locationSearchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(locationSearchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: LocationOption) => {
    setSelectedLocation(location);
    setShowLocationDropdown(false);
    setLocationSearchQuery('');
  };

  return (
    <header className="bg-gradient-to-r from-orange-50 via-yellow-50 to-orange-50 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        {/* Increased height container */}
        <div className="flex flex-col py-4">
          {/* Top row with logo and actions */}
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                {title}
              </span>
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-6">
              {showCart && (
                <button className="relative flex items-center space-x-1 p-2 rounded-lg hover:bg-white/50 transition-all duration-200 hover:shadow-md">
                  <ShoppingCart className="h-5 w-5 text-gray-700" />
                  {cartCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                      {cartCount}
                    </div>
                  )}
                  <span className="hidden md:inline text-sm font-medium text-gray-700">Cart</span>
                </button>
              )}
              
              <button className="hidden md:flex items-center space-x-1 p-2 rounded-lg hover:bg-white/50 transition-all duration-200 hover:shadow-md">
                <Heart className="h-5 w-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">Wishlist</span>
              </button>
              
              {/* User Profile */}
              <button className="flex items-center space-x-2 border border-orange-200 rounded-full p-2 hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format"
                  alt="User"
                  className="h-6 w-6 rounded-full object-cover"
                />
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Bottom row with search and location */}
          <div className="flex items-center justify-between mt-4">
            {/* Location Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center space-x-1 text-sm font-medium text-gray-800 px-3 py-2 rounded-lg hover:bg-white/50 transition-all duration-200 cursor-pointer border border-orange-200 bg-white/80 backdrop-blur-sm hover:shadow-md"
              >
                <MapPin className="h-4 w-4 text-orange-500" />
                <span className="max-w-40 truncate">{selectedLocation.name}</span>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Location Dropdown Menu */}
              {showLocationDropdown && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-orange-100 z-50">
                  {/* Search Input */}
                  <div className="p-4 border-b border-orange-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search locations..."
                        value={locationSearchQuery}
                        onChange={(e) => setLocationSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white/80"
                      />
                    </div>
                  </div>

                  {/* Current Location */}
                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors text-left">
                      <div className="flex-shrink-0 p-2 bg-orange-100 rounded-full">
                        <Navigation className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Use current location</div>
                        <div className="text-xs text-gray-500">Enable location services</div>
                      </div>
                    </button>
                  </div>

                  {/* Recent Locations */}
                  {filteredLocations.some(loc => loc.isRecent) && (
                    <div className="border-t border-orange-100">
                      <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Recent
                      </div>
                      <div className="p-2">
                        {filteredLocations
                          .filter(location => location.isRecent)
                          .map((location) => (
                            <button
                              key={location.id}
                              onClick={() => handleLocationSelect(location)}
                              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors text-left"
                            >
                              <div className="flex-shrink-0 p-2 bg-yellow-100 rounded-full">
                                <Clock className="h-4 w-4 text-yellow-600" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">{location.name}</div>
                                <div className="text-xs text-gray-500">{location.address}</div>
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Other Locations */}
                  <div className="border-t border-orange-100">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Nearby Areas
                    </div>
                    <div className="p-2">
                      {filteredLocations
                        .filter(location => !location.isRecent && !location.isCurrent)
                        .map((location) => (
                          <button
                            key={location.id}
                            onClick={() => handleLocationSelect(location)}
                            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors text-left"
                          >
                            <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full">
                              <MapPin className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{location.name}</div>
                              <div className="text-xs text-gray-500">{location.address}</div>
                            </div>
                            {location.distance && (
                              <div className="text-xs text-gray-400">{location.distance}</div>
                            )}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            {showSearch && (
              <div className="flex-1 max-w-2xl mx-8">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search food or restaurants..."
                    className="block w-full pl-10 pr-4 py-3 border border-orange-200 rounded-full bg-white/80 backdrop-blur-sm focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Beautiful Mountain Border */}
      <div className="absolute bottom-0 left-0 right-0 h-0 overflow-hidden">
        <svg 
          className="absolute bottom-0 w-full h-8" 
          viewBox="0 0 1200 40" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="25%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="75%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <linearGradient id="mountainShadow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fdba74" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {/* Mountain Silhouette */}
          <path 
            d="M0,40 L0,25 L80,8 L160,20 L240,5 L320,18 L400,12 L480,22 L560,7 L640,19 L720,14 L800,25 L880,10 L960,20 L1040,6 L1120,16 L1200,12 L1200,40 Z" 
            fill="url(#mountainGradient)"
          />
          
          {/* Mountain Highlights */}
          <path 
            d="M0,40 L0,28 L80,11 L160,23 L240,8 L320,21 L400,15 L480,25 L560,10 L640,22 L720,17 L800,28 L880,13 L960,23 L1040,9 L1120,19 L1200,15 L1200,40 Z" 
            fill="url(#mountainShadow)"
          />
          
          {/* Subtle animated clouds */}
          <g opacity="0.3">
            <circle cx="200" cy="15" r="8" fill="white">
              <animate attributeName="cx" values="200;220;200" dur="8s" repeatCount="indefinite" />
            </circle>
            <circle cx="205" cy="12" r="6" fill="white">
              <animate attributeName="cx" values="205;225;205" dur="8s" repeatCount="indefinite" />
            </circle>
            <circle cx="800" cy="18" r="10" fill="white">
              <animate attributeName="cx" values="800;780;800" dur="10s" repeatCount="indefinite" />
            </circle>
            <circle cx="805" cy="15" r="7" fill="white">
              <animate attributeName="cx" values="805;785;805" dur="10s" repeatCount="indefinite" />
            </circle>
          </g>
          
          {/* Mountain peaks details */}
          <path 
            d="M240,5 L245,8 L250,5 M560,7 L565,10 L570,7 M1040,6 L1045,9 L1050,6" 
            stroke="white" 
            strokeWidth="1" 
            opacity="0.6"
          />
        </svg>
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-300 via-red-300 to-orange-300 opacity-50 blur-sm"></div>
    </header>
  );
}

export const FoodDeliveryHeader = () => {
  return (
    <AppHeader 
      title="QuickBite" 
      showSearch={true}
      showCart={true}
    />
  );
};