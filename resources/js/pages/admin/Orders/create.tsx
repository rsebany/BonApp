import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface OrderPayload {
  [key: string]: string | number | null | Array<{
    menu_item_id: string;
    quantity: number;
    price: string;
    subtotal: string;
  }>;
  customer_id: string;
  restaurant_id: string;
  customer_address_id: string;
  order_status_id: string;
  assigned_driver_id: string | null;
  order_date_time: string;
  requested_delivery_date_time: string;
  delivery_fee: string;
  total_amount: string;
  items: Array<{
    menu_item_id: string;
    quantity: number;
    price: string;
    subtotal: string;
  }>;
}

interface RestaurantAddress {
  street_number?: string;
  address_line1?: string;
  city?: string;
  region?: string;
  postal_code?: string;
}

interface MenuItem {
  id: number;
  item_name: string;
  price: string;
  restaurant_id: number;
}

interface Customer {
  id: number;
  name: string;
  last_name: string;
  first_name: string;
  email: string;
  addresses: Address[];
}

interface Address {
  id: number;
  street_number?: string;
  address_line1?: string;
  city?: string;
  region?: string;
  postal_code?: string;
}

interface Restaurant {
  id: number;
  name: string;
  address_id: string;
  restaurant_name: string;
  address: RestaurantAddress | null;
  menu_items: MenuItem[];
}

interface OrderCreateProps {
  customers: Customer[];
  restaurants: Restaurant[];
  menu_items: MenuItem[];
}

export default function OrderCreate({ customers, restaurants, menu_items: initialMenuItems }: OrderCreateProps) {
  const [formData, setFormData] = useState<OrderPayload>({
    customer_id: '',
    restaurant_id: '',
    customer_address_id: '',
    order_status_id: '',
    assigned_driver_id: null,
    order_date_time: new Date().toISOString(),
    requested_delivery_date_time: '',
    delivery_fee: '',
    total_amount: '',
    items: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [customerAddresses, setCustomerAddresses] = useState<Address[]>([]);

  // Filter menu items based on selected restaurant
  const filteredMenuItems = formData.restaurant_id 
    ? menuItems.filter(item => item.restaurant_id === Number(formData.restaurant_id))
    : [];

  // Fetch menu items when restaurant changes
  useEffect(() => {
    if (formData.restaurant_id) {
      // In a real app, you might want to fetch menu items from the server here
      // For now, we're using the initial props data
      const restaurantMenuItems = restaurants.find(r => r.id === Number(formData.restaurant_id))?.menu_items || [];
      setMenuItems(restaurantMenuItems);
    } else {
      setMenuItems([]);
    }
  }, [formData.restaurant_id, restaurants]);

  // Update customer addresses when customer changes
  useEffect(() => {
    if (formData.customer_id) {
      const customer = customers.find(c => c.id === Number(formData.customer_id));
      setCustomerAddresses(customer?.addresses || []);
      // Reset address selection when customer changes
      setFormData(prev => ({ ...prev, customer_address_id: '' }));
    } else {
      setCustomerAddresses([]);
    }
  }, [formData.customer_id, customers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await router.post(route('admin.orders.store'), formData, {
        onSuccess: () => {
          toast.success('Order created successfully');
          router.visit(route('admin.orders.index'));
        },
        onError: (errors) => {
          setErrors(errors as Record<string, string>);
          toast.error('Failed to create order');
        },
        onFinish: () => setIsSubmitting(false),
      });
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  const handleSelectChange = (field: keyof OrderPayload, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { menu_item_id: '', quantity: 1, price: '0.00', subtotal: '0.00' }
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };

      // Calculate subtotal if quantity or price changes
      if (field === 'quantity' || field === 'price') {
        const quantity = field === 'quantity' ? Number(value) : Number(newItems[index].quantity);
        const price = field === 'price' ? Number(value) : Number(newItems[index].price);
        newItems[index].subtotal = (quantity * price).toFixed(2);
      }

      // Calculate total amount
      const subtotal = newItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
      const deliveryFee = Number(prev.delivery_fee) || 0;
      const totalAmount = (subtotal + deliveryFee).toFixed(2);

      return {
        ...prev,
        items: newItems,
        total_amount: totalAmount,
      };
    });
  };

  return (
    <AdminLayout title="Orders Management">
      <Head title="Create Order" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold py-2">Create Order</h1>
            <p className="text-gray-600">Create a new food delivery order</p>
          </div>
          <Button asChild variant="outline">
            <Link href={route('admin.orders.index')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Selection */}
              <div className="space-y-2">
                <Label htmlFor="customer_id">Customer</Label>
                <select
                  id="customer_id"
                  value={formData.customer_id}
                  onChange={(e) => handleSelectChange('customer_id', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Select a customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.first_name} {customer.last_name} - ({customer.email})
                    </option>
                  ))}
                </select>
                {errors.customer_id && (
                  <p className="text-sm text-red-500">{errors.customer_id}</p>
                )}
              </div>

              {/* Customer Address Selection */}
              {customerAddresses.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="customer_address_id">Delivery Address</Label>
                  <select
                    id="customer_address_id"
                    value={formData.customer_address_id}
                    onChange={(e) => handleSelectChange('customer_address_id', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="">Select a delivery address</option>
                    {customerAddresses.map(address => (
                      <option key={address.id} value={address.id}>
                        {[
                          address.street_number,
                          address.address_line1,
                          address.city,
                          address.region,
                          address.postal_code
                        ].filter(Boolean).join(', ')}
                      </option>
                    ))}
                  </select>
                  {errors.customer_address_id && (
                    <p className="text-sm text-red-500">{errors.customer_address_id}</p>
                  )}
                </div>
              )}

              {/* Restaurant Selection */}
              <div className="space-y-2">
                <Label htmlFor="restaurant_id">Restaurant</Label>
                <select
                  id="restaurant_id"
                  value={formData.restaurant_id}
                  onChange={(e) => handleSelectChange('restaurant_id', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Select a restaurant</option>
                  {restaurants.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.restaurant_name} -{" "}
                      {restaurant.address ? (
                        [
                          restaurant.address.street_number,
                          restaurant.address.address_line1,
                          restaurant.address.city,
                          restaurant.address.region,
                          restaurant.address.postal_code
                        ]
                          .filter(Boolean)
                          .join(", ")
                      ) : (
                        "Address not available"
                      )}
                    </option>
                  ))}
                </select>
                {errors.restaurant_id && (
                  <p className="text-sm text-red-500">{errors.restaurant_id}</p>
                )}
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Order Items</Label>
                  <Button 
                    type="button" 
                    onClick={handleAddItem} 
                    variant="outline" 
                    size="sm"
                    disabled={!formData.restaurant_id}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                {formData.items.map((item, index) => (
                  <div key={index} className="flex items-end gap-4 p-4 border rounded-lg">
                    <div className="flex-1 space-y-3">
                      <Label>Menu Item</Label>
                      <select
                        value={item.menu_item_id}
                        onChange={(e) => {
                          const menuItem = filteredMenuItems.find(
                            mi => mi.id === Number(e.target.value)
                          );
                          handleItemChange(index, 'menu_item_id', e.target.value);
                          if (menuItem) {
                            handleItemChange(index, 'price', menuItem.price);
                          }
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                        disabled={!formData.restaurant_id}
                      >
                        <option value="">Select an item</option>
                        {filteredMenuItems.map(menuItem => (
                          <option key={menuItem.id} value={menuItem.id}>
                            {menuItem.item_name} - ${menuItem.price}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-24 space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="w-32 space-y-2">
                      <Label>Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="w-32 space-y-2">
                      <Label>Subtotal</Label>
                      <Input
                        type="text"
                        value={item.subtotal}
                        readOnly
                        className="w-full bg-gray-50"
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {errors.items && (
                  <p className="text-sm text-red-500">{errors.items}</p>
                )}
              </div>

              {/* Delivery Fee */}
              <div className="space-y-2">
                <Label htmlFor="delivery_fee">Delivery Fee</Label>
                <Input
                  id="delivery_fee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.delivery_fee}
                  onChange={(e) => {
                    handleSelectChange('delivery_fee', e.target.value);
                    // Recalculate total amount
                    const subtotal = formData.items.reduce((sum, item) => sum + Number(item.subtotal), 0);
                    const deliveryFee = Number(e.target.value) || 0;
                    handleSelectChange('total_amount', (subtotal + deliveryFee).toFixed(2));
                  }}
                />
                {errors.delivery_fee && (
                  <p className="text-sm text-red-500">{errors.delivery_fee}</p>
                )}
              </div>

              {/* Total Amount */}
              <div className="space-y-2">
                <Label htmlFor="total_amount">Total Amount</Label>
                <Input
                  id="total_amount"
                  type="text"
                  value={formData.total_amount}
                  readOnly
                  className="bg-gray-50"
                />
                {errors.total_amount && (
                  <p className="text-sm text-red-500">{errors.total_amount}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Order'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}