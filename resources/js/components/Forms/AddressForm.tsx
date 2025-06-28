import React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Home, Building, Globe } from 'lucide-react';

interface Country {
  id: number;
  country_name: string;
  country_code: string;
}

interface AddressFormData {
  unit_number?: string;
  street_number: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  region: string;
  postal_code: string;
  country_id: number;
  [key: string]: string | number | undefined; // Add index signature for Inertia compatibility
}

interface AddressFormProps {
  address?: {
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
  };
  countries: Country[];
  onSubmit?: (data: AddressFormData) => void;
  isSubmitting?: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  address,
  countries,
  onSubmit,
  isSubmitting = false
}) => {
  const { data, setData, post, put, processing, errors, reset } = useForm<AddressFormData>({
    unit_number: address?.unit_number || '',
    street_number: address?.street_number || '',
    address_line1: address?.address_line1 || '',
    address_line2: address?.address_line2 || '',
    city: address?.city || '',
    region: address?.region || '',
    postal_code: address?.postal_code || '',
    country_id: address?.country_id || countries[0]?.id || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSubmit) {
      onSubmit(data);
    } else {
      if (address) {
        put(route('addresses.update', address.id));
      } else {
        post(route('addresses.store'));
      }
    }
  };

  const handleInputChange = (field: keyof AddressFormData, value: string | number) => {
    setData(field, value);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {address ? 'Edit Delivery Address' : 'Add New Delivery Address'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Country Selection */}
          <div className="space-y-2">
            <Label htmlFor="country_id" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Country *
            </Label>
            <Select
              value={data.country_id.toString()}
              onValueChange={(value) => handleInputChange('country_id', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id.toString()}>
                    {country.country_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country_id && (
              <p className="text-sm text-red-500">{errors.country_id}</p>
            )}
          </div>

          {/* Street Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit_number" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Unit/Apt
              </Label>
              <Input
                id="unit_number"
                type="text"
                placeholder="Unit 123"
                value={data.unit_number}
                onChange={(e) => handleInputChange('unit_number', e.target.value)}
              />
              {errors.unit_number && (
                <p className="text-sm text-red-500">{errors.unit_number}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="street_number" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Street Number *
              </Label>
              <Input
                id="street_number"
                type="text"
                placeholder="123"
                value={data.street_number}
                onChange={(e) => handleInputChange('street_number', e.target.value)}
                required
              />
              {errors.street_number && (
                <p className="text-sm text-red-500">{errors.street_number}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line1" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Street Name *
              </Label>
              <Input
                id="address_line1"
                type="text"
                placeholder="Main Street"
                value={data.address_line1}
                onChange={(e) => handleInputChange('address_line1', e.target.value)}
                required
              />
              {errors.address_line1 && (
                <p className="text-sm text-red-500">{errors.address_line1}</p>
              )}
            </div>
          </div>

          {/* Address Line 2 */}
          <div className="space-y-2">
            <Label htmlFor="address_line2">Address Line 2</Label>
            <Input
              id="address_line2"
              type="text"
              placeholder="Apartment, suite, etc. (optional)"
              value={data.address_line2}
              onChange={(e) => handleInputChange('address_line2', e.target.value)}
            />
            {errors.address_line2 && (
              <p className="text-sm text-red-500">{errors.address_line2}</p>
            )}
          </div>

          {/* City, Region, Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                placeholder="City"
                value={data.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">State/Region *</Label>
              <Input
                id="region"
                type="text"
                placeholder="State/Province"
                value={data.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                required
              />
              {errors.region && (
                <p className="text-sm text-red-500">{errors.region}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code *</Label>
              <Input
                id="postal_code"
                type="text"
                placeholder="12345"
                value={data.postal_code}
                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                required
              />
              {errors.postal_code && (
                <p className="text-sm text-red-500">{errors.postal_code}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={processing || isSubmitting}
            >
              {processing || isSubmitting ? 'Saving...' : (address ? 'Update Address' : 'Save Address')}
            </Button>
            {address && (
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={processing || isSubmitting}
              >
                Reset
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
