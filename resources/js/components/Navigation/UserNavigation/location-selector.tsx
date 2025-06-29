import React, { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MapPin, ChevronDown, Plus, Check, Home } from 'lucide-react';
import { useLocation } from '@/Context/LocationContext';
import { Link } from '@inertiajs/react';

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

export const LocationSelector = () => {
  const { state, setSelectedAddress, getDisplayAddress } = useLocation();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user addresses from backend
  useEffect(() => {
    const loadAddresses = async () => {
      setIsLoading(true);
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
        // Fallback: use empty array if loading fails
        setAddresses([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAddresses();
  }, []);

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
  };

  const getShortAddress = (address: Address): string => {
    return `${address.city}, ${address.region}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="hidden sm:flex items-center space-x-1 text-gray-600 hover:bg-gray-100">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{getDisplayAddress()}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 mt-2 z-[60]" sideOffset={8}>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="font-semibold">Delivery Address</span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
            <Link href={route('addresses.create')}>
              <Plus className="w-4 h-4" />
            </Link>
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="py-4 text-center text-gray-500">
            <p>Loading addresses...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No addresses found</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href={route('addresses.create')}>
                Add Address
              </Link>
            </Button>
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto">
            {addresses.map((address) => {
              const isDefault = state.selectedAddress?.id === address.id;
              
              return (
                <DropdownMenuItem
                  key={address.id}
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleAddressSelect(address)}
                >
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <Home className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      isDefault ? 'text-emerald-600' : 'text-gray-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium truncate ${
                          isDefault ? 'text-emerald-800' : 'text-gray-900'
                        }`}>
                          {getShortAddress(address)}
                        </p>
                        {isDefault && (
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {address.address_line1}
                      </p>
                      {isDefault && (
                        <span className="inline-block mt-1 text-xs text-emerald-700 font-medium">
                          Default address
                        </span>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </div>
        )}
        
        <DropdownMenuSeparator />
        
        <div className="p-2">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href={route('addresses.index')}>
              Manage Addresses
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 