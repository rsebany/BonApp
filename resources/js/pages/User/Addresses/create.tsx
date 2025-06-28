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

interface CreateAddressProps {
  countries: Country[];
}

export default function CreateAddress({ countries }: CreateAddressProps) {
  const [activeItem, setActiveItem] = useState('Addresses');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <Head title="Add New Address" />
      
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
                      Add New Delivery Address
                    </h1>
                  </div>
                  <p className="text-gray-600">
                    Add a new address to your account for quick and easy delivery
                  </p>
                </div>
              </div>

              {/* Address Form */}
              <AddressForm countries={countries} />

              {/* Help Section */}
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">Why add delivery addresses?</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• <strong>Faster checkout:</strong> Save time by selecting from your saved addresses</li>
                  <li>• <strong>Accurate delivery:</strong> Ensure your food arrives at the right location</li>
                  <li>• <strong>Multiple locations:</strong> Order to different addresses (home, work, etc.)</li>
                  <li>• <strong>Order history:</strong> Track deliveries to specific addresses</li>
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
