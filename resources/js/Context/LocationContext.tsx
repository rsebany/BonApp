import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface LocationState {
  selectedAddress: Address | null;
  addresses: Address[];
  isLoading: boolean;
}

interface LocationContextType {
  state: LocationState;
  setSelectedAddress: (address: Address | null) => void;
  addAddress: (address: Address) => void;
  removeAddress: (id: number) => void;
  updateAddress: (id: number, address: Address) => void;
  getDisplayAddress: () => string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LocationState>({
    selectedAddress: null,
    addresses: [],
    isLoading: false,
  });

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      try {
        const locationData = JSON.parse(savedLocation);
        setState(prev => ({
          ...prev,
          selectedAddress: locationData,
        }));
      } catch (error) {
        console.error('Error loading location from localStorage:', error);
      }
    }
  }, []);

  // Save selected location to localStorage whenever it changes
  useEffect(() => {
    if (state.selectedAddress) {
      localStorage.setItem('selectedLocation', JSON.stringify(state.selectedAddress));
    }
  }, [state.selectedAddress]);

  const setSelectedAddress = (address: Address | null) => {
    setState(prev => ({
      ...prev,
      selectedAddress: address,
    }));
  };

  const addAddress = (address: Address) => {
    setState(prev => ({
      ...prev,
      addresses: [...prev.addresses, address],
    }));
  };

  const removeAddress = (id: number) => {
    setState(prev => ({
      ...prev,
      addresses: prev.addresses.filter(addr => addr.id !== id),
    }));
  };

  const updateAddress = (id: number, address: Address) => {
    setState(prev => ({
      ...prev,
      addresses: prev.addresses.map(addr => 
        addr.id === id ? address : addr
      ),
    }));
  };

  const getDisplayAddress = (): string => {
    if (!state.selectedAddress) {
      return 'Select location';
    }
    
    const { city, region } = state.selectedAddress;
    return `${city}, ${region}`;
  };

  return (
    <LocationContext.Provider
      value={{
        state,
        setSelectedAddress,
        addAddress,
        removeAddress,
        updateAddress,
        getDisplayAddress,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}; 