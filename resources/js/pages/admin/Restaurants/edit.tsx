import AdminLayout from "@/layouts/Admin/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Country {
  id: number;
  country_name: string;
}

interface Address {
  id: number;
  unit_number: string;
  street_number: string;
  address_line1: string;
  address_line2: string;
  city: string;
  region: string;
  postal_code: string;
  country_id: string;
}

interface Restaurant {
  id: number;
  restaurant_name: string;
  email: string;
  phone: string;
  description: string;
  cuisine_type: string;
  opening_hours: string;
  delivery_time: string;
  minimum_order: string;
  delivery_fee: string;
  is_active: boolean;
  address: Address | null;
}

interface AddressErrors {
  unit_number?: string;
  street_number?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country_id?: string;
}

interface Props {
  restaurant: Restaurant;
  countries: Country[];
}

export default function EditRestaurantPage({ restaurant, countries }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    restaurant_name: restaurant.restaurant_name || '',
    email: restaurant.email || '',
    phone: restaurant.phone || '',
    description: restaurant.description || '',
    cuisine_type: restaurant.cuisine_type || '',
    opening_hours: restaurant.opening_hours || '',
    delivery_time: restaurant.delivery_time || '',
    minimum_order: restaurant.minimum_order || '',
    delivery_fee: restaurant.delivery_fee || '',
    is_active: restaurant.is_active ?? true,
    address: {
      unit_number: restaurant.address?.unit_number || '',
      street_number: restaurant.address?.street_number || '',
      address_line1: restaurant.address?.address_line1 || '',
      address_line2: restaurant.address?.address_line2 || '',
      city: restaurant.address?.city || '',
      region: restaurant.address?.region || '',
      postal_code: restaurant.address?.postal_code || '',
      country_id: restaurant.address?.country_id || '',
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('admin.restaurants.update', restaurant.id));
  };

  const handleAddressChange = (field: keyof typeof data.address, value: string) => {
    setData('address', { ...data.address, [field]: value });
  };

  return (
    <AdminLayout title="Edit Restaurant">
      <Head title={`Edit Restaurant: ${restaurant.restaurant_name}`} />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Edit Restaurant</h2>
          {restaurant && restaurant.id && (
            <Button asChild variant="outline">
              <Link href={route('admin.restaurants.show', restaurant.id)}><ArrowLeft className="h-4 w-4 mr-2" /> Back to Restaurant</Link>
            </Button>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="restaurant_name">Restaurant Name</Label>
                <Input id="restaurant_name" value={data.restaurant_name} onChange={e => setData('restaurant_name', e.target.value)} required />
                {errors.restaurant_name && <div className="text-red-500 text-xs mt-1">{errors.restaurant_name}</div>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required />
                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={data.phone} onChange={e => setData('phone', e.target.value)} required />
                {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
              </div>
              <div>
                <Label htmlFor="cuisine_type">Cuisine Type</Label>
                <Input id="cuisine_type" value={data.cuisine_type} onChange={e => setData('cuisine_type', e.target.value)} required />
                {errors.cuisine_type && <div className="text-red-500 text-xs mt-1">{errors.cuisine_type}</div>}
              </div>
              <div>
                <Label htmlFor="opening_hours">Opening Hours</Label>
                <Input id="opening_hours" value={data.opening_hours} onChange={e => setData('opening_hours', e.target.value)} required placeholder="e.g. Mon-Fri 9:00-18:00" />
                {errors.opening_hours && <div className="text-red-500 text-xs mt-1">{errors.opening_hours}</div>}
              </div>
              <div>
                <Label htmlFor="delivery_time">Delivery Time (minutes)</Label>
                <Input id="delivery_time" type="number" value={data.delivery_time} onChange={e => setData('delivery_time', e.target.value)} required />
                {errors.delivery_time && <div className="text-red-500 text-xs mt-1">{errors.delivery_time}</div>}
              </div>
              <div>
                <Label htmlFor="minimum_order">Minimum Order</Label>
                <Input id="minimum_order" type="number" value={data.minimum_order} onChange={e => setData('minimum_order', e.target.value)} required />
                {errors.minimum_order && <div className="text-red-500 text-xs mt-1">{errors.minimum_order}</div>}
              </div>
              <div>
                <Label htmlFor="delivery_fee">Delivery Fee</Label>
                <Input id="delivery_fee" type="number" value={data.delivery_fee} onChange={e => setData('delivery_fee', e.target.value)} required />
                {errors.delivery_fee && <div className="text-red-500 text-xs mt-1">{errors.delivery_fee}</div>}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} />
                {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
              </div>
            </div>
            <div className="pt-4 border-t mt-4">
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="unit_number">Unit Number</Label>
                  <Input id="unit_number" value={data.address.unit_number} onChange={e => handleAddressChange('unit_number', e.target.value)} />
                  {(errors.address as AddressErrors)?.unit_number && <div className="text-red-500 text-xs mt-1">{(errors.address as AddressErrors).unit_number}</div>}
                </div>
                <div>
                  <Label htmlFor="street_number">Street Number</Label>
                  <Input id="street_number" value={data.address.street_number} onChange={e => handleAddressChange('street_number', e.target.value)} />
                  {(errors.address as AddressErrors)?.street_number && <div className="text-red-500 text-xs mt-1">{(errors.address as AddressErrors).street_number}</div>}
                </div>
                <div>
                  <Label htmlFor="address_line1">Address Line 1</Label>
                  <Input id="address_line1" value={data.address.address_line1} onChange={e => handleAddressChange('address_line1', e.target.value)} required />
                  {(errors.address as AddressErrors)?.address_line1 && <div className="text-red-500 text-xs mt-1">{(errors.address as AddressErrors).address_line1}</div>}
                </div>
                <div>
                  <Label htmlFor="address_line2">Address Line 2</Label>
                  <Input id="address_line2" value={data.address.address_line2} onChange={e => handleAddressChange('address_line2', e.target.value)} />
                  {(errors.address as AddressErrors)?.address_line2 && <div className="text-red-500 text-xs mt-1">{(errors.address as AddressErrors).address_line2}</div>}
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={data.address.city} onChange={e => handleAddressChange('city', e.target.value)} required />
                  {(errors.address as AddressErrors)?.city && <div className="text-red-500 text-xs mt-1">{(errors.address as AddressErrors).city}</div>}
                </div>
                <div>
                  <Label htmlFor="region">Region/State</Label>
                  <Input id="region" value={data.address.region} onChange={e => handleAddressChange('region', e.target.value)} required />
                  {(errors.address as AddressErrors)?.region && <div className="text-red-500 text-xs mt-1">{(errors.address as AddressErrors).region}</div>}
                </div>
                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input id="postal_code" value={data.address.postal_code} onChange={e => handleAddressChange('postal_code', e.target.value)} required />
                  {(errors.address as AddressErrors)?.postal_code && <div className="text-red-500 text-xs mt-1">{(errors.address as AddressErrors).postal_code}</div>}
                </div>
                <div>
                  <Label htmlFor="country_id">Country</Label>
                  <select id="country_id" className="border rounded px-2 py-1 w-full" value={data.address.country_id} onChange={e => handleAddressChange('country_id', e.target.value)} required>
                    <option value="">Select Country</option>
                    {countries.map(c => <option key={c.id} value={c.id}>{c.country_name}</option>)}
                  </select>
                  {(errors.address as AddressErrors)?.country_id && <div className="text-red-500 text-xs mt-1">{(errors.address as AddressErrors).country_id}</div>}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href={route('admin.restaurants.index')}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
} 