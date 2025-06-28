import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import TopNavBar from '@/components/Navigation/UserNavigation/user-header';
import LeftSidebar from '@/components/Navigation/UserNavigation/user-leftsidebar';
import RightSidebar from '@/components/Navigation/UserNavigation/user-rightsidebar';
import { AddressForm } from '@/components/Forms/AddressForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin } from 'lucide-react';
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
}

interface CustomerAddress {
  id: number;
  customer_id: number;
  address_id: number;
  address: Address;
  created_at: string;
  updated_at: string;
}

interface EditAddressProps {
  address: CustomerAddress;
  countries: Country[];
}

export default function EditAddress({ address, countries }: EditAddressProps) {
  const [activeItem, setActiveItem] = useState('Addresses');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <Head title="Edit Address" />
      
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
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MapPin className="w-8 h-8 text-emerald-600" />
                    <h1 className="text-3xl font-bold text-gray-900">
                      Edit Delivery Address
                    </h1>
                  </div>
                  <p className="text-gray-600">
                    Update your delivery address information
                  </p>
                </div>
              </div>

              {/* Address Form */}
              <AddressForm 
                address={address.address} 
                countries={countries} 
              />

              {/* Help Section */}
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">Address Tips:</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• <strong>Accuracy matters:</strong> Ensure your address is correct for timely delivery</li>
                  <li>• <strong>Include details:</strong> Add unit numbers or apartment details if applicable</li>
                  <li>• <strong>Postal code:</strong> Double-check your postal code for accurate delivery</li>
                  <li>• <strong>Contact info:</strong> Make sure your phone number is up to date</li>
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