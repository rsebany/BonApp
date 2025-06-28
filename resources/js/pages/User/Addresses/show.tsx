import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import TopNavBar from '@/components/Navigation/UserNavigation/user-header';
import LeftSidebar from '@/components/Navigation/UserNavigation/user-leftsidebar';
import RightSidebar from '@/components/Navigation/UserNavigation/user-rightsidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MapPin, ArrowLeft, Edit, Trash2, Home, Building, Globe, Check } from 'lucide-react';
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

interface ShowAddressProps {
  address: CustomerAddress;
  canUpdate: boolean;
  canDelete: boolean;
}

export default function ShowAddress({ address, canUpdate, canDelete }: ShowAddressProps) {
  const { state, setSelectedAddress } = useLocation();
  const isDefault = state.selectedAddress?.id === address.address.id;
  const [activeItem, setActiveItem] = useState('Addresses');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSetDefault = () => {
    setSelectedAddress(address.address);
  };

  const handleDelete = () => {
    router.delete(route('addresses.destroy', address.id));
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Head title="Address Details" />
      
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
            <div className="max-w-2xl mx-auto px-4 py-8">
              {/* Header */}
              <div className="mb-8">
                <Button variant="ghost" asChild className="mb-4">
                  <Link href={route('addresses.index')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Addresses
                  </Link>
                </Button>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-8 h-8 text-emerald-600" />
                      Address Details
                    </h1>
                    <p className="text-gray-600 mt-2">
                      View and manage your delivery address
                    </p>
                  </div>
                  
                  {isDefault && (
                    <Badge variant="default" className="bg-emerald-100 text-emerald-800">
                      <Check className="w-3 h-3 mr-1" />
                      Default Address
                    </Badge>
                  )}
                </div>
              </div>

              {/* Address Card */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-emerald-600" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Full Address */}
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                    <div className="text-gray-700">
                      {formatAddress(address.address)}
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-3">
                      {address.address.unit_number && (
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Unit Number</p>
                            <p className="text-sm text-gray-600">{address.address.unit_number}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Street</p>
                          <p className="text-sm text-gray-600">
                            {address.address.street_number} {address.address.address_line1}
                          </p>
                          {address.address.address_line2 && (
                            <p className="text-sm text-gray-600">{address.address.address_line2}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">City</p>
                        <p className="text-sm text-gray-600">{address.address.city}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-900">State/Region</p>
                        <p className="text-sm text-gray-600">{address.address.region}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-900">Postal Code</p>
                        <p className="text-sm text-gray-600">{address.address.postal_code}</p>
                      </div>
                      
                      {address.address.country && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Country</p>
                            <p className="text-sm text-gray-600">{address.address.country.country_name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="pt-4 border-t text-xs text-gray-500">
                    <p>Created: {formatDate(address.created_at)}</p>
                    <p>Last updated: {formatDate(address.updated_at)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {!isDefault && (
                  <Button 
                    onClick={handleSetDefault}
                    className="flex-1"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Set as Default
                  </Button>
                )}
                
                {canUpdate && (
                  <Button 
                    variant="outline" 
                    asChild
                    className="flex-1"
                  >
                    <Link href={route('addresses.edit', address.id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Address
                    </Link>
                  </Button>
                )}
                
                {canDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
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
                          onClick={handleDelete}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>

              {/* Help Section */}
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">Address Information:</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• <strong>Default address:</strong> This will be used for quick checkout</li>
                  <li>• <strong>Order history:</strong> All orders to this address are tracked</li>
                  <li>• <strong>Delivery accuracy:</strong> Ensure your address is correct for timely delivery</li>
                  <li>• <strong>Multiple addresses:</strong> You can have addresses for different locations</li>
                </ul>
              </div>
            </div>
          </main>
          <RightSidebar />
        </div>
      </div>
    </>
  );
} 