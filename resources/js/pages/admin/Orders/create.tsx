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

interface Restaurant {
  id: number;
  restaurant_name: string;
  menu_items: Array<{
    id: number;
    item_name: string;
    price: string;
  }>;
}

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  addresses: Array<{
    id: number;
    street_number?: string;
    address_line1?: string;
    city?: string;
    region?: string;
    postal_code?: string;
  }>;
}

interface OrderCreateProps {
  customers: Customer[];
  restaurants: Restaurant[];
  orderStatuses: Array<{ id: number; status: string }>;
  drivers: Array<{ id: number; first_name: string; last_name: string }>;
}

export default function OrderCreate({ 
  customers, 
  restaurants, 
  orderStatuses,
  drivers 
}: OrderCreateProps) {
  const [formData, setFormData] = useState<OrderPayload>({
    customer_id: '',
    restaurant_id: '',
    customer_address_id: '',
    order_status_id: '',
    assigned_driver_id: null,
    order_date_time: new Date().toISOString(),
    requested_delivery_date_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    delivery_fee: '5.00',
    total_amount: '0.00',
    items: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuItems, setMenuItems] = useState<Restaurant['menu_items']>([]);
  const [customerAddresses, setCustomerAddresses] = useState<Customer['addresses']>([]);
  const [manualAddress, setManualAddress] = useState({
    street_number: '',
    address_line1: '',
    city: '',
    region: '',
    postal_code: '',
  });

  useEffect(() => {
    if (formData.restaurant_id) {
      const selectedRestaurant = restaurants.find(r => r.id === Number(formData.restaurant_id));
      setMenuItems(selectedRestaurant?.menu_items || []);
    } else {
      setMenuItems([]);
    }
  }, [formData.restaurant_id, restaurants]);

  useEffect(() => {
    if (formData.customer_id) {
      const customer = customers.find(c => c.id === Number(formData.customer_id));
      setCustomerAddresses(customer?.addresses || []);
      setFormData(prev => ({ 
        ...prev, 
        customer_address_id: customer?.addresses?.[0]?.id.toString() || '' 
      }));
    } else {
      setCustomerAddresses([]);
      setFormData(prev => ({ ...prev, customer_address_id: '' }));
    }
  }, [formData.customer_id, customers]);

  const handleSelectChange = (field: keyof OrderPayload, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'restaurant_id' && { items: [] })
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
    setFormData(prev => {
      const newItems = prev.items.filter((_, i) => i !== index);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
  
    // Validate required fields
    if (!formData.customer_id) {
      setErrors(prev => ({ ...prev, customer_id: 'Customer is required' }));
      setIsSubmitting(false);
      toast.error('Customer is required');
      return;
    }
  
    if (!formData.restaurant_id) {
      setErrors(prev => ({ ...prev, restaurant_id: 'Restaurant is required' }));
      setIsSubmitting(false);
      toast.error('Restaurant is required');
      return;
    }
  
    if (!formData.order_status_id) {
      setErrors(prev => ({ ...prev, order_status_id: 'Order status is required' }));
      setIsSubmitting(false);
      toast.error('Order status is required');
      return;
    }
  
    // Validate items
    if (formData.items.length === 0) {
      setErrors(prev => ({ ...prev, items: 'At least one order item is required' }));
      setIsSubmitting(false);
      toast.error('At least one order item is required');
      return;
    }
  
    const invalidItem = formData.items.some(
      item =>
        !item.menu_item_id ||
        isNaN(Number(item.quantity)) ||
        Number(item.quantity) <= 0 ||
        isNaN(Number(item.price)) ||
        Number(item.price) <= 0 ||
        isNaN(Number(item.subtotal))
    );
    if (invalidItem) {
      setErrors(prev => ({ ...prev, items: 'All order items must be valid and complete' }));
      setIsSubmitting(false);
      toast.error('Please fix the order items');
      return;
    }
  
    // Validate address
    if (customerAddresses.length === 0) {
      const missingFields = Object.entries(manualAddress).filter(([, v]) => !v);
      if (missingFields.length > 0) {
        setErrors(prev => ({ ...prev, customer_address_id: 'Please fill in all delivery address fields' }));
        setIsSubmitting(false);
        toast.error('Please fill in all delivery address fields');
        return;
      }
    } else if (!formData.customer_address_id) {
      setErrors(prev => ({ ...prev, customer_address_id: 'Please select a delivery address' }));
      setIsSubmitting(false);
      toast.error('Please select a delivery address');
      return;
    }
  
    try {
      const payload = {
        customer_id: Number(formData.customer_id),
        restaurant_id: Number(formData.restaurant_id),
        order_status_id: Number(formData.order_status_id),
        assigned_driver_id: formData.assigned_driver_id ? Number(formData.assigned_driver_id) : null,
        order_date_time: formData.order_date_time,
        requested_delivery_date_time: formData.requested_delivery_date_time,
        delivery_fee: Number(formData.delivery_fee),
        total_amount: Number(formData.total_amount),
        items: formData.items.map(item => ({
          menu_item_id: Number(item.menu_item_id),
          quantity: Number(item.quantity),
          price: Number(item.price),
          subtotal: Number(item.subtotal),
        })),
        ...(customerAddresses.length === 0
          ? { 
              address_line1: manualAddress.address_line1,
              street_number: manualAddress.street_number,
              city: manualAddress.city,
              region: manualAddress.region,
              postal_code: manualAddress.postal_code
            }
          : { customer_address_id: Number(formData.customer_address_id) })
      };
  
      await router.post(route('admin.orders.store'), payload, {
        onSuccess: () => {
          toast.success('Order created successfully');
        },
        onError: (errors) => {
          setErrors(errors);
          if (errors.message) {
            toast.error(errors.message);
          } else {
            toast.error('Failed to create order. Please check the form for errors.');
          }
        },
        preserveScroll: true
      });
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value.toString() };

      if (field === 'quantity' || field === 'price') {
        const quantity = field === 'quantity' ? Number(value) : Number(newItems[index].quantity);
        const price = field === 'price' ? Number(value) : Number(newItems[index].price);
        newItems[index].subtotal = (quantity * price).toFixed(2);
      }

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Selection */}
              <div className="space-y-2">
                <Label htmlFor="customer_id">Customer *</Label>
                <select
                  id="customer_id"
                  value={formData.customer_id}
                  onChange={(e) => handleSelectChange('customer_id', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select a customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.first_name} {customer.last_name} ({customer.email})
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
                  <Label htmlFor="customer_address_id">Delivery Address *</Label>
                  <select
                    id="customer_address_id"
                    value={formData.customer_address_id}
                    onChange={(e) => handleSelectChange('customer_address_id', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    required
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

              {/* Manual Address Entry */}
              {customerAddresses.length === 0 && formData.customer_id && (
                <div className="space-y-2">
                  <Label>Delivery Address (Manual Entry) *</Label>
                  <Input
                    placeholder="Street Number"
                    value={manualAddress.street_number}
                    onChange={e => setManualAddress({ ...manualAddress, street_number: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Address Line 1"
                    value={manualAddress.address_line1}
                    onChange={e => setManualAddress({ ...manualAddress, address_line1: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="City"
                    value={manualAddress.city}
                    onChange={e => setManualAddress({ ...manualAddress, city: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Region"
                    value={manualAddress.region}
                    onChange={e => setManualAddress({ ...manualAddress, region: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Postal Code"
                    value={manualAddress.postal_code}
                    onChange={e => setManualAddress({ ...manualAddress, postal_code: e.target.value })}
                    required
                  />
                  {errors.customer_address_id && (
                    <p className="text-sm text-red-500">{errors.customer_address_id}</p>
                  )}
                </div>
              )}

              {/* Restaurant Selection */}
              <div className="space-y-2">
                <Label htmlFor="restaurant_id">Restaurant *</Label>
                <select
                  id="restaurant_id"
                  value={formData.restaurant_id}
                  onChange={(e) => handleSelectChange('restaurant_id', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select a restaurant</option>
                  {restaurants.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.restaurant_name}
                    </option>
                  ))}
                </select>
                {errors.restaurant_id && (
                  <p className="text-sm text-red-500">{errors.restaurant_id}</p>
                )}
              </div>

              {/* Order Status */}
              <div className="space-y-2">
                <Label htmlFor="order_status_id">Order Status *</Label>
                <select
                  id="order_status_id"
                  value={formData.order_status_id}
                  onChange={(e) => handleSelectChange('order_status_id', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select an order status</option>
                  {orderStatuses.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.status}
                    </option>
                  ))}
                </select>
                {errors.order_status_id && (
                  <p className="text-sm text-red-500">{errors.order_status_id}</p>
                )}
              </div>

              {/* Assigned Driver */}
              <div className="space-y-2">
                <Label htmlFor="assigned_driver_id">Assigned Driver</Label>
                <select
                  id="assigned_driver_id"
                  value={formData.assigned_driver_id || ''}
                  onChange={(e) => handleSelectChange('assigned_driver_id', e.target.value || '')}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">No driver assigned</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.first_name} {driver.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Date/Time */}
              <div className="space-y-2">
                <Label htmlFor="requested_delivery_date_time">Requested Delivery Date/Time</Label>
                <Input
                  id="requested_delivery_date_time"
                  type="datetime-local"
                  value={formData.requested_delivery_date_time.substring(0, 16)}
                  onChange={(e) => handleSelectChange('requested_delivery_date_time', e.target.value)}
                />
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Order Items *</Label>
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

                {formData.items.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    {formData.restaurant_id 
                      ? 'Add items to this order' 
                      : 'Select a restaurant to add items'}
                  </div>
                )}

                {formData.items.map((item, index) => (
                  <div key={index} className="flex items-end gap-4 p-4 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Label>Menu Item *</Label>
                      <select
                        value={item.menu_item_id}
                        onChange={(e) => {
                          const selectedItem = menuItems.find(mi => mi.id === Number(e.target.value));
                          handleItemChange(index, 'menu_item_id', e.target.value);
                          if (selectedItem) {
                            handleItemChange(index, 'price', selectedItem.price);
                          }
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                        required
                      >
                        <option value="">Select an item</option>
                        {menuItems.map(menuItem => (
                          <option key={menuItem.id} value={menuItem.id}>
                            {menuItem.item_name} - ${Number(menuItem.price).toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-24 space-y-2">
                      <Label>Quantity *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="w-32 space-y-2">
                      <Label>Price *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="w-32 space-y-2">
                      <Label>Subtotal</Label>
                      <Input
                        type="text"
                        value={`$${item.subtotal}`}
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
                <Label htmlFor="delivery_fee">Delivery Fee *</Label>
                <Input
                  id="delivery_fee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.delivery_fee}
                  onChange={(e) => {
                    handleSelectChange('delivery_fee', e.target.value);
                    const subtotal = formData.items.reduce((sum, item) => sum + Number(item.subtotal), 0);
                    const deliveryFee = Number(e.target.value) || 0;
                    handleSelectChange('total_amount', (subtotal + deliveryFee).toFixed(2));
                  }}
                  required
                />
              </div>

              {/* Total Amount */}
              <div className="space-y-2">
                <Label htmlFor="total_amount">Total Amount</Label>
                <Input
                  id="total_amount"
                  type="text"
                  value={`$${formData.total_amount}`}
                  readOnly
                  className="bg-gray-50 font-bold"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}