import AdminLayout from "@/layouts/Admin/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";

interface Country {
  id: number;
  country_name: string;
}

interface AddressData {
  unit_number: string;
  street_number: string;
  address_line1: string;
  address_line2: string;
  city: string;
  region: string;
  postal_code: string;
  country_id: string;
  [key: string]: string;
}

interface RestaurantData {
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
  address: AddressData;
  [key: string]: string | boolean | AddressData;
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
  countries: Country[];
  restaurant?: { id: number };
}

export default function CreateRestaurantPage({ countries = [], restaurant }: Props) {
  const { data, setData, post, processing, errors, clearErrors } = useForm<RestaurantData>({
    restaurant_name: '',
    email: '',
    phone: '',
    description: '',
    cuisine_type: '',
    opening_hours: '',
    delivery_time: '',
    minimum_order: '',
    delivery_fee: '',
    is_active: true,
    address: {
      unit_number: '',
      street_number: '',
      address_line1: '',
      address_line2: '',
      city: '',
      region: '',
      postal_code: '',
      country_id: '',
    }
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    clearErrors();
    
    // Prepare the data properly before submission
    const submitData = {
      ...data,
      delivery_time: data.delivery_time ? parseInt(data.delivery_time) : 30, // default 30 minutes
      minimum_order: data.minimum_order ? parseFloat(data.minimum_order) : 0,
      delivery_fee: data.delivery_fee ? parseFloat(data.delivery_fee) : 0,
      address: {
        unit_number: data.address.unit_number || null,
        street_number: data.address.street_number || null,
        address_line1: data.address.address_line1,
        address_line2: data.address.address_line2 || null,
        city: data.address.city,
        region: data.address.region,
        postal_code: data.address.postal_code,
        country_id: data.address.country_id ? parseInt(data.address.country_id) : null,
      }
    };
    
    // Submit with the prepared data
    post(route('admin.restaurants.store'), {
      data: submitData,
      onError: (errors) => {
        console.log('Validation errors:', errors);
      },
      onSuccess: () => {
        console.log('Restaurant created successfully');
      }
    });
  };

  const handleAddressChange = (field: keyof AddressData, value: string) => {
    setData('address', { ...data.address, [field]: value });
  };

  const handleInputChange = (field: keyof RestaurantData, value: string | number | boolean) => {
    if (field === 'is_active') {
      setData(field, value as boolean);
    } else {
      setData(field, value.toString());
    }
  };

  return (
    <AdminLayout title="Add Restaurant">
      <Head title="Add Restaurant" />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Add Restaurant</h2>
          {restaurant && restaurant.id && (
            <Button asChild variant="outline">
              <Link href={route('admin.restaurants.show', restaurant.id)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Restaurant
              </Link>
            </Button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="restaurant_name">Restaurant Name *</Label>
                <Input 
                  id="restaurant_name" 
                  value={data.restaurant_name} 
                  onChange={e => handleInputChange('restaurant_name', e.target.value)} 
                  required 
                  className={errors.restaurant_name ? 'border-red-500' : ''}
                />
                {errors.restaurant_name && <div className="text-red-500 text-xs mt-1">{errors.restaurant_name}</div>}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={data.email} 
                  onChange={e => handleInputChange('email', e.target.value)} 
                  required 
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input 
                  id="phone" 
                  value={data.phone} 
                  onChange={e => handleInputChange('phone', e.target.value)} 
                  required 
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
              </div>

              <div>
                <Label htmlFor="cuisine_type">Cuisine Type *</Label>
                <Input 
                  id="cuisine_type" 
                  value={data.cuisine_type} 
                  onChange={e => handleInputChange('cuisine_type', e.target.value)} 
                  required 
                  className={errors.cuisine_type ? 'border-red-500' : ''}
                />
                {errors.cuisine_type && <div className="text-red-500 text-xs mt-1">{errors.cuisine_type}</div>}
              </div>

              <div>
                <Label htmlFor="opening_hours">Opening Hours *</Label>
                <Input 
                  id="opening_hours" 
                  value={data.opening_hours} 
                  onChange={e => handleInputChange('opening_hours', e.target.value)} 
                  required 
                  placeholder="e.g. Mon-Fri 9:00-18:00" 
                  className={errors.opening_hours ? 'border-red-500' : ''}
                />
                {errors.opening_hours && <div className="text-red-500 text-xs mt-1">{errors.opening_hours}</div>}
              </div>

              <div>
                <Label htmlFor="delivery_time">Delivery Time (minutes) *</Label>
                <Input 
                  id="delivery_time" 
                  type="number" 
                  min="1"
                  value={data.delivery_time} 
                  onChange={e => handleInputChange('delivery_time', e.target.value)} 
                  required 
                  className={errors.delivery_time ? 'border-red-500' : ''}
                />
                {errors.delivery_time && <div className="text-red-500 text-xs mt-1">{errors.delivery_time}</div>}
              </div>

              <div>
                <Label htmlFor="minimum_order">Minimum Order *</Label>
                <Input 
                  id="minimum_order" 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={data.minimum_order} 
                  onChange={e => handleInputChange('minimum_order', e.target.value)} 
                  required 
                  className={errors.minimum_order ? 'border-red-500' : ''}
                />
                {errors.minimum_order && <div className="text-red-500 text-xs mt-1">{errors.minimum_order}</div>}
              </div>

              <div>
                <Label htmlFor="delivery_fee">Delivery Fee *</Label>
                <Input 
                  id="delivery_fee" 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={data.delivery_fee} 
                  onChange={e => handleInputChange('delivery_fee', e.target.value)} 
                  required 
                  className={errors.delivery_fee ? 'border-red-500' : ''}
                />
                {errors.delivery_fee && <div className="text-red-500 text-xs mt-1">{errors.delivery_fee}</div>}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={data.description} 
                  onChange={e => handleInputChange('description', e.target.value)} 
                  rows={3}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
              </div>
            </div>

            {/* Address Section */}
            <div className="pt-4 border-t mt-6">
              <h3 className="text-lg font-semibold mb-4">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="unit_number">Unit Number</Label>
                  <Input 
                    id="unit_number" 
                    value={data.address.unit_number} 
                    onChange={e => handleAddressChange('unit_number', e.target.value)} 
                    className={(errors.address as AddressErrors)?.unit_number ? 'border-red-500' : ''}
                  />
                  {(errors.address as AddressErrors)?.unit_number && 
                    <div className="text-red-500 text-xs mt-1">{(errors.address as AddressErrors).unit_number}</div>
                  }
                </div>

                <div>
                  <Label htmlFor="street_number">Street Number</Label>
                  <Input 
                    id="street_number" 
                    value={data.address.street_number} 
                    onChange={e => handleAddressChange('street_number', e.target.value)} 
                    className={(errors.address as AddressErrors)?.street_number ? 'border-red-500' : ''}
                  />
                  {(errors.address as AddressErrors)?.street_number && 
                    <div className="text-red-500 text-xs mt-1">{(errors.address as AddressErrors).street_number}</div>
                  }
                </div>

                <div>
                  <Label htmlFor="address_line1">Address Line 1 *</Label>
                  <Input 
                    id="address_line1" 
                    value={data.address.address_line1} 
                    onChange={e => handleAddressChange('address_line1', e.target.value)} 
                    required 
                    className={(errors.address as AddressErrors)?.address_line1 ? 'border-red-500' : ''}
                  />
                  {(errors.address as AddressErrors)?.address_line1 && 
                    <div className="text-red-500 text-xs mt-1">{(errors.address as AddressErrors).address_line1}</div>
                  }
                </div>

                <div>
                  <Label htmlFor="address_line2">Address Line 2</Label>
                  <Input 
                    id="address_line2" 
                    value={data.address.address_line2} 
                    onChange={e => handleAddressChange('address_line2', e.target.value)} 
                    className={(errors.address as AddressErrors)?.address_line2 ? 'border-red-500' : ''}
                  />
                  {(errors.address as AddressErrors)?.address_line2 && 
                    <div className="text-red-500 text-xs mt-1">{(errors.address as AddressErrors).address_line2}</div>
                  }
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input 
                    id="city" 
                    value={data.address.city} 
                    onChange={e => handleAddressChange('city', e.target.value)} 
                    required 
                    className={(errors.address as AddressErrors)?.city ? 'border-red-500' : ''}
                  />
                  {(errors.address as AddressErrors)?.city && 
                    <div className="text-red-500 text-xs mt-1">{(errors.address as AddressErrors).city}</div>
                  }
                </div>

                <div>
                  <Label htmlFor="region">Region/State *</Label>
                  <Input 
                    id="region" 
                    value={data.address.region} 
                    onChange={e => handleAddressChange('region', e.target.value)} 
                    required 
                    className={(errors.address as AddressErrors)?.region ? 'border-red-500' : ''}
                  />
                  {(errors.address as AddressErrors)?.region && 
                    <div className="text-red-500 text-xs mt-1">{(errors.address as AddressErrors).region}</div>
                  }
                </div>

                <div>
                  <Label htmlFor="postal_code">Postal Code *</Label>
                  <Input 
                    id="postal_code" 
                    value={data.address.postal_code} 
                    onChange={e => handleAddressChange('postal_code', e.target.value)} 
                    required 
                    className={(errors.address as AddressErrors)?.postal_code ? 'border-red-500' : ''}
                  />
                  {(errors.address as AddressErrors)?.postal_code && 
                    <div className="text-red-500 text-xs mt-1">{(errors.address as AddressErrors).postal_code}</div>
                  }
                </div>

                <div>
                  <Label htmlFor="country_id">Country *</Label>
                  <select 
                    id="country_id" 
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${(errors.address as AddressErrors)?.country_id ? 'border-red-500' : ''}`}
                    value={data.address.country_id} 
                    onChange={e => handleAddressChange('country_id', e.target.value)} 
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>
                        {country.country_name}
                      </option>
                    ))}
                  </select>
                  {(errors.address as AddressErrors)?.country_id && 
                    <div className="text-red-500 text-xs mt-1">{(errors.address as AddressErrors).country_id}</div>
                  }
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="outline" asChild>
                <Link href={route('admin.restaurants.index')}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? 'Creating...' : 'Create Restaurant'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}