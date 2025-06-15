import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  MapPin,
  ChevronDown,
  Navigation,
  Clock } from 'lucide-react';

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
    <header className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 sticky top-0 z-50 shadow-sm">
      {/* Petite vague au-dessus du header */}
      <div className="relative h-6 -mt-1 overflow-hidden">
        <svg 
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox="0 0 1200 30" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="topWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ecfdf5" />
              <stop offset="100%" stopColor="#d1fae5" />
            </linearGradient>
          </defs>
          
          <path 
            d="M0,15 C150,5 300,20 450,15 S750,5 900,15 S1150,20 1200,15 L1200,30 L0,30 Z"
            fill="url(#topWaveGradient)"
            opacity="0.9"
          >
            <animate 
              attributeName="d" 
              values="
                M0,15 C150,5 300,20 450,15 S750,5 900,15 S1150,20 1200,15 L1200,30 L0,30 Z;
                M0,12 C150,8 300,18 450,12 S750,8 900,12 S1150,18 1200,12 L1200,30 L0,30 Z;
                M0,15 C150,5 300,20 450,15 S750,5 900,15 S1150,20 1200,15 L1200,30 L0,30 Z
              " 
              dur="8s" 
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col py-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                {title}
              </span>
            </div>

            <div className="flex items-center space-x-6">
              {showCart && (
                <button className="relative flex items-center space-x-1 p-2 rounded-lg hover:bg-white/50 transition-all duration-200 hover:shadow-md">
                  <ShoppingCart className="h-5 w-5 text-gray-700" />
                  {cartCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
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
              
              <button className="flex items-center space-x-2 border border-emerald-200 rounded-full p-2 hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format"
                  alt="User"
                  className="h-6 w-6 rounded-full object-cover"
                />
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center space-x-1 text-sm font-medium text-gray-800 px-3 py-2 rounded-lg hover:bg-white/50 transition-all duration-200 cursor-pointer border border-emerald-200 bg-white/80 backdrop-blur-sm hover:shadow-md"
              >
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span className="max-w-40 truncate">{selectedLocation.name}</span>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showLocationDropdown && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-emerald-100 z-50">
                  <div className="p-4 border-b border-emerald-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search locations..."
                        value={locationSearchQuery}
                        onChange={(e) => setLocationSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white/80"
                      />
                    </div>
                  </div>

                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-emerald-50 transition-colors text-left">
                      <div className="flex-shrink-0 p-2 bg-emerald-100 rounded-full">
                        <Navigation className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Use current location</div>
                        <div className="text-xs text-gray-500">Enable location services</div>
                      </div>
                    </button>
                  </div>

                  {filteredLocations.some(loc => loc.isRecent) && (
                    <div className="border-t border-emerald-100">
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
                              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-emerald-50 transition-colors text-left"
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

                  <div className="border-t border-emerald-100">
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
                            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-emerald-50 transition-colors text-left"
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
                    className="block w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-full bg-white/80 backdrop-blur-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export const FoodDeliveryHeader = () => {
  return (
    <AppHeader 
      title="BonApp" 
      showSearch={true}
      showCart={true}
    />
  );
};