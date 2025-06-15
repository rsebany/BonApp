import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

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

interface OrderStatus {
  id: number;
  status: string;
}

interface Driver {
  id: number;
  first_name: string;
  last_name: string;
  is_available: boolean;
}

interface OrderItem {
  id?: number;
  menu_item_id: string;
  quantity: number;
  price: string;
  subtotal: string;
  item_name?: string;
}

interface Order {
  id: number;
  customer_id: number;
  restaurant_id: number;
  customer_address_id: number;
  order_status_id: number;
  assigned_driver_id: number | null;
  order_date_time: string;
  requested_delivery_date_time: string;
  delivery_fee: string;
  total_amount: string;
  items: OrderItem[];
  customer: Customer;
  restaurant: Restaurant;
  orderStatus: OrderStatus;
  assignedDriver: Driver | null;
  customerAddress: Address;
}

interface OrderEditProps {
  order: Order;
  customers?: Customer[];
  restaurants?: Restaurant[];
  orderStatuses?: OrderStatus[];
  drivers?: Driver[];
}

export default function OrderEdit({ 
  order: initialOrder, 
  customers = [], 
  restaurants = [], 
  orderStatuses = [],
  drivers = [] 
}: OrderEditProps) {
  const [formData, setFormData] = useState<OrderPayload>({
    customer_id: initialOrder.customer_id.toString(),
    restaurant_id: initialOrder.restaurant_id.toString(),
    customer_address_id: initialOrder.customer_address_id.toString(),
    order_status_id: initialOrder.order_status_id.toString(),
    assigned_driver_id: initialOrder.assigned_driver_id?.toString() || null,
    order_date_time: new Date(initialOrder.order_date_time).toISOString(),
    requested_delivery_date_time: initialOrder.requested_delivery_date_time 
      ? new Date(initialOrder.requested_delivery_date_time).toISOString()
      : new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    delivery_fee: initialOrder.delivery_fee,
    total_amount: initialOrder.total_amount,
    items: initialOrder.items.map(item => ({
      menu_item_id: item.menu_item_id.toString(),
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal
    })),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenuItems, setLoadingMenuItems] = useState(false);
  const [customerAddresses, setCustomerAddresses] = useState<Address[]>(initialOrder.customer.addresses || []);

  // Fetch menu items when restaurant changes
  useEffect(() => {
    if (formData.restaurant_id) {
      setLoadingMenuItems(true);
      axios.get(`/admin/restaurants/${formData.restaurant_id}/menu-items`)
        .then(response => {
          setMenuItems(response.data);
          setLoadingMenuItems(false);
        })
        .catch(error => {
          console.error('Error fetching menu items:', error);
          setMenuItems([]);
          setLoadingMenuItems(false);
        });
    } else {
      setMenuItems([]);
    }
  }, [formData.restaurant_id]);

  // Update customer addresses when customer changes
  useEffect(() => {
    if (formData.customer_id) {
      const customer = customers.find(c => c.id === Number(formData.customer_id));
      setCustomerAddresses(customer?.addresses || []);
    }
  }, [formData.customer_id, customers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        ...formData,
        items: JSON.stringify(formData.items),
      };
      
      router.put(route('admin.orders.update', initialOrder.id), payload, {
        onSuccess: () => {
          toast.success('Order updated successfully');
        },
        onError: (errors) => {
          setErrors(errors as Record<string, string>);
          toast.error('Failed to update order');
        },
        onFinish: () => setIsSubmitting(false),
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  const handleSelectChange = (field: keyof OrderPayload, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'restaurant_id' && { items: [] }) // Clear items when restaurant changes
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
      <Head title={`Edit Order #${initialOrder.id}`} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold py-2">Edit Order #{initialOrder.id}</h1>
            <p className="text-gray-600">Update food delivery order details</p>
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
                  {customers?.map(customer => (
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
                    {customerAddresses?.map(address => (
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
                <Label htmlFor="restaurant_id">Restaurant *</Label>
                <select
                  id="restaurant_id"
                  value={formData.restaurant_id}
                  onChange={(e) => handleSelectChange('restaurant_id', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select a restaurant</option>
                  {restaurants?.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.restaurant_name} - {restaurant.address?.city || 'No address'}
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
                  {orderStatuses?.map(status => (
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
                  {drivers?.map(driver => (
                    <option 
                      key={driver.id} 
                      value={driver.id}
                      disabled={!driver.is_available && driver.id !== initialOrder.assigned_driver_id}
                    >
                      {driver.first_name} {driver.last_name}
                      {!driver.is_available && driver.id !== initialOrder.assigned_driver_id && ' (Unavailable)'}
                    </option>
                  ))}
                </select>
                {errors.assigned_driver_id && (
                  <p className="text-sm text-red-500">{errors.assigned_driver_id}</p>
                )}
              </div>

              {/* Order Date/Time */}
              <div className="space-y-2">
                <Label htmlFor="order_date_time">Order Date/Time</Label>
                <Input
                  id="order_date_time"
                  type="datetime-local"
                  value={formData.order_date_time.substring(0, 16)}
                  onChange={(e) => handleSelectChange('order_date_time', e.target.value)}
                />
                {errors.order_date_time && (
                  <p className="text-sm text-red-500">{errors.order_date_time}</p>
                )}
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
                {errors.requested_delivery_date_time && (
                  <p className="text-sm text-red-500">{errors.requested_delivery_date_time}</p>
                )}
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
                    disabled={!formData.restaurant_id || loadingMenuItems}
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
                        {menuItems?.map(menuItem => (
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
                    // Recalculate total amount
                    const subtotal = formData.items.reduce((sum, item) => sum + Number(item.subtotal), 0);
                    const deliveryFee = Number(e.target.value) || 0;
                    handleSelectChange('total_amount', (subtotal + deliveryFee).toFixed(2));
                  }}
                  required
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
                  value={`$${formData.total_amount}`}
                  readOnly
                  className="bg-gray-50 font-bold"
                />
                {errors.total_amount && (
                  <p className="text-sm text-red-500">{errors.total_amount}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" disabled={isSubmitting || formData.items.length === 0}>
                  {isSubmitting ? 'Updating...' : 'Update Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}