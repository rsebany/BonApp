import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import TopNavBar from '@/components/Navigation/UserNavigation/user-header';
import LeftSidebar from '@/components/Navigation/UserNavigation/user-leftsidebar';
import RightSidebar from '@/components/Navigation/UserNavigation/user-rightsidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MapPin, Plus, Edit, Trash2, Home, Globe, Check } from 'lucide-react';
import { useLocation } from '@/Context/LocationContext';
import '../../../../css/user-navigation-sidebar.css';

interface Country {
  id: number;
  country_name: string;
  country_code: string;
}

interface Address {
  id: number;
  unit_number?: string;
  street_number: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  region: string;
  postal_code: string;
  country_id: number;
  country?: Country;
  created_at: string;
  updated_at: string;
}

interface CustomerAddress {
  id: number;
  customer_id: number;
  address_id: number;
  address: Address;
  created_at: string;
  updated_at: string;
}

interface AddressesIndexProps {
  addresses: CustomerAddress[];
  canCreate: boolean;
}

export default function AddressesIndex({ addresses, canCreate }: AddressesIndexProps) {
  const { state, setSelectedAddress } = useLocation();
  const [deletingAddress, setDeletingAddress] = useState<CustomerAddress | null>(null);
  const [activeItem, setActiveItem] = useState('Addresses');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDelete = (address: CustomerAddress) => {
    setDeletingAddress(address);
  };

  const confirmDelete = () => {
    if (deletingAddress) {
      router.delete(route('addresses.destroy', deletingAddress.id), {
        onSuccess: () => {
          setDeletingAddress(null);
        },
      });
    }
  };

  const handleSetDefault = (address: CustomerAddress) => {
    setSelectedAddress(address.address);
  };

  const formatAddress = (address: Address): string => {
    const parts = [
      address.unit_number && `Unit ${address.unit_number}`,
      address.street_number,
      address.address_line1,
      address.address_line2,
      address.city,
      address.region,
      address.postal_code,
      address.country?.country_name,
    ].filter(Boolean);

    return parts.join(', ');
  };

  const getShortAddress = (address: Address): string => {
    return `${address.city}, ${address.region}`;
  };

  return (
    <>
      <Head title="My Addresses" />
      
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <TopNavBar onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar 
            activeItem={activeItem} 
            setActiveItem={setActiveItem} 
            isMobileMenuOpen={isMobileMenuOpen} 
            onCloseMobileMenu={() => setIsMobileMenuOpen(false)} 
          />
          <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
            <div className="max-w-4xl mx-auto px-4 py-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-8 h-8 text-emerald-600" />
                    My Delivery Addresses
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Manage your delivery addresses for quick and easy ordering
                  </p>
                </div>
                {canCreate && (
                  <Button asChild>
                    <Link href={route('addresses.create')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Address
                    </Link>
                  </Button>
                )}
              </div>

              {/* Addresses Grid */}
              {addresses.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No addresses found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Add your first delivery address to get started with ordering
                    </p>
                    {canCreate && (
                      <Button asChild>
                        <Link href={route('addresses.create')}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Address
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((customerAddress) => {
                    const address = customerAddress.address;
                    const isDefault = state.selectedAddress?.id === address.id;
                    
                    return (
                      <Card key={customerAddress.id} className="relative">
                        {isDefault && (
                          <div className="absolute top-4 right-4">
                            <Badge variant="default" className="bg-emerald-100 text-emerald-800">
                              <Check className="w-3 h-3 mr-1" />
                              Default
                            </Badge>
                          </div>
                        )}
                        
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Home className="w-5 h-5 text-emerald-600" />
                            {getShortAddress(address)}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          {/* Address Details */}
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                              <div className="text-sm text-gray-700">
                                {formatAddress(address)}
                              </div>
                            </div>
                            
                            {address.country && (
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {address.country.country_name}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-4 border-t">
                            {!isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetDefault(customerAddress)}
                                className="flex-1"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Set as Default
                              </Button>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <Link href={route('addresses.edit', customerAddress.id)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(customerAddress)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Address</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this address? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={confirmDelete}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Help Text */}
              {addresses.length > 0 && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Tips for managing addresses:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Set a default address for faster checkout</li>
                    <li>• Keep your addresses up to date for accurate delivery</li>
                    <li>• You can have multiple addresses for different locations</li>
                  </ul>
                </div>
              )}
            </div>
          </main>
          <RightSidebar />
        </div>
      </div>
    </>
  );
}
