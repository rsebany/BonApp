import React, { useState, useEffect, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Plus, ArrowLeft, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface MenuItem {
  id: number;
  name: string;
  price: string;
  description?: string;
}

interface Restaurant {
  id: number;
  restaurant_name: string;
  phone?: string;
  email?: string;
  address?: {
    id: number;
    address_line1: string;
    address_line2?: string;
    city: string;
    region: string;
    postal_code: string;
    country?: {
      id: number;
      name: string;
    };
  };
}

interface OrderStatus {
  id: number;
  status: string;
  name: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

interface Order {
  id: number;
  customer: User;
  restaurant: Restaurant;
  order_status: OrderStatus;
  assigned_driver?: User;
  customer_address: {
    id: number;
    address_line1: string;
    address_line2?: string;
    city: string;
    region: string;
    postal_code: string;
    country?: {
      id: number;
      name: string;
    };
  };
  order_items: Array<{
    id: number;
    menu_item_id: string;
    quantity: number;
    price: string;
  }>;
  total_amount: string;
  delivery_fee: string;
  order_datetime: string;
  requested_delivery_datetime?: string;
  created_at: string;
  updated_at: string;
}

interface OrderEditProps {
  order: Order;
  customers: User[];
  restaurants: Restaurant[];
  orderStatuses: OrderStatus[];
  drivers: User[];
}

export default function OrderEdit({ order, customers, restaurants, orderStatuses, drivers }: OrderEditProps) {
  const [formData, setFormData] = useState({
    customer_id: order.customer.id.toString(),
    restaurant_id: order.restaurant.id.toString(),
    customer_address_id: order.customer_address.id.toString(),
    order_status_id: order.order_status.id.toString(),
    assigned_driver_id: order.assigned_driver?.id.toString() || '',
    order_datetime: order.order_datetime.slice(0, 16),
    requested_delivery_datetime: order.requested_delivery_datetime?.slice(0, 16) || '',
    delivery_fee: order.delivery_fee,
    total_amount: order.total_amount,
    order_items: order.order_items.map(item => ({
      id: item.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price: item.price,
    })),
  });

  const [selectedCustomer, setSelectedCustomer] = useState<User>(order.customer);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>(order.restaurant);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMenuItems, setIsLoadingMenuItems] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleRestaurantSelect = useCallback(async (restaurantId: string) => {
    const restaurant = restaurants.find(r => r.id.toString() === restaurantId);
    if (restaurant) {
      setSelectedRestaurant(restaurant);
      handleSelectChange('restaurant_id', restaurantId);
      
      setIsLoadingMenuItems(true);
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}/menu-items`);
        if (!response.ok) throw new Error('Failed to fetch menu items');
        const data = await response.json();
        setMenuItems(data);
      } catch {
        console.error('Failed to load menu items');
      } finally {
        setIsLoadingMenuItems(false);
      }
    }
  }, [restaurants, handleSelectChange]);

  // Load menu items when component mounts
  useEffect(() => {
    handleRestaurantSelect(order.restaurant.id.toString());
  }, [handleRestaurantSelect, order.restaurant.id]);

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find(c => c.id.toString() === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      handleSelectChange('customer_id', customerId);
    }
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      order_items: [
        ...prev.order_items,
        { id: 0, menu_item_id: '', quantity: 1, price: '0.00' }
      ],
    }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const updatedItems = [...prev.order_items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };

      // If menu item is selected, update its price
      if (field === 'menu_item_id' && typeof value === 'string') {
        const selectedItem = menuItems.find(item => item.id.toString() === value);
        if (selectedItem) {
          updatedItems[index].price = selectedItem.price;
        }
      }

      return {
        ...prev,
        order_items: updatedItems,
      };
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      order_items: prev.order_items.filter((_, i) => i !== index),
    }));
  };

  const calculateTotal = () => {
    const itemsTotal = formData.order_items.reduce(
      (sum, item) => sum + (parseFloat(item.price) * item.quantity),
      0
    );
    const deliveryFee = parseFloat(formData.delivery_fee) || 0;
    return (itemsTotal + deliveryFee).toFixed(2);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customer_id) newErrors.customer_id = 'Customer is required';
    if (!formData.restaurant_id) newErrors.restaurant_id = 'Restaurant is required';
    if (!formData.order_status_id) newErrors.order_status_id = 'Order status is required';
    if (!formData.order_datetime) newErrors.order_datetime = 'Order date and time is required';
    if (!formData.requested_delivery_datetime) newErrors.requested_delivery_datetime = 'Delivery date and time is required';
    if (formData.order_items.length === 0) newErrors.order_items = 'At least one item is required';
    
    // Validate order items
    formData.order_items.forEach((item, index) => {
      if (!item.menu_item_id) {
        newErrors[`order_items.${index}.menu_item_id`] = 'Menu item is required';
      }
      if (item.quantity < 1) {
        newErrors[`order_items.${index}.quantity`] = 'Quantity must be at least 1';
      }
    });

    // Validate delivery fee
    const deliveryFee = parseFloat(formData.delivery_fee);
    if (isNaN(deliveryFee) || deliveryFee < 0) {
      newErrors.delivery_fee = 'Delivery fee must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.error('Validation failed');
      return;
    }

    setIsLoading(true);
    formData.total_amount = calculateTotal();
    
    try {
      await router.put(route('admin.orders.update', order.id), formData);
      console.log('Order updated successfully');
    } catch {
      console.error('Failed to update order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (statusId: string) => {
    setIsLoading(true);
    try {
      await router.put(route('admin.orders.update', order.id), {
        ...formData,
        order_status_id: statusId,
      });
      console.log('Order status updated successfully');
    } catch {
      console.error('Failed to update order status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignDriver = async (driverId: string) => {
    setIsLoading(true);
    try {
      await router.put(route('admin.orders.update', order.id), {
        ...formData,
        assigned_driver_id: driverId,
      });
      console.log('Driver assigned successfully');
    } catch {
      console.error('Failed to assign driver');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setIsLoading(true);
    try {
      await router.put(route('admin.orders.update', order.id), {
        ...formData,
        order_status_id: orderStatuses.find(s => s.status === 'cancelled')?.id.toString(),
      });
      console.log('Order cancelled successfully');
    } catch {
      console.error('Failed to cancel order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title="Orders Management">
      <Head title={`Edit Order #${order.id}`} />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold py-2">Edit Order #{order.id}</h1>
            <p className="text-gray-600">Update order details</p>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  Actions
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[120px] p-0">
                {orderStatuses.map(status => (
                  <Button
                    key={status.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left text-sm"
                    onClick={() => handleStatusChange(status.id.toString())}
                    disabled={isLoading || status.id.toString() === formData.order_status_id}
                  >
                    {status.name}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left text-sm text-red-600"
                  onClick={() => handleCancelOrder()}
                  disabled={isLoading || formData.order_status_id === orderStatuses.find(s => s.status === 'cancelled')?.id.toString()}
                >
                  Cancel Order
                </Button>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  Assign Driver
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[120px] p-0">
                {drivers.map(driver => (
                  <Button
                    key={driver.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left text-sm"
                    onClick={() => handleAssignDriver(driver.id.toString())}
                    disabled={isLoading || driver.id.toString() === formData.assigned_driver_id}
                  >
                    {driver.first_name} {driver.last_name}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>

            <Button asChild variant="outline">
              <Link href={route('admin.orders.index')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer and Restaurant Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_id">Customer</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            errors.customer_id && "border-red-500"
                          )}
                        >
                          {formData.customer_id ? (
                            <span>{customers.find(c => c.id.toString() === formData.customer_id)?.first_name} {customers.find(c => c.id.toString() === formData.customer_id)?.last_name} ({customers.find(c => c.id.toString() === formData.customer_id)?.email})</span>
                          ) : (
                            <span className="text-gray-500">Select customer</span>
                          )}
                          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        {customers.map(customer => (
                          <Button
                            key={customer.id}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-left text-sm"
                            onClick={() => {
                              handleCustomerSelect(customer.id.toString());
                            }}
                          >
                            {customer.first_name} {customer.last_name} ({customer.email})
                          </Button>
                        ))}
                      </PopoverContent>
                    </Popover>
                    {errors.customer_id && (
                      <p className="text-sm text-red-500">{errors.customer_id}</p>
                    )}
                  </div>

                  {selectedCustomer && (
                    <div className="space-y-2">
                      <Label>Customer Details</Label>
                      <div className="text-sm">
                        <p>Email: {selectedCustomer.email}</p>
                        {selectedCustomer.phone && <p>Phone: {selectedCustomer.phone}</p>}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Restaurant Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="restaurant_id">Restaurant</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            errors.restaurant_id && "border-red-500"
                          )}
                        >
                          {formData.restaurant_id ? (
                            <span>{restaurants.find(r => r.id.toString() === formData.restaurant_id)?.restaurant_name}</span>
                          ) : (
                            <span className="text-gray-500">Select restaurant</span>
                          )}
                          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        {restaurants.map(restaurant => (
                          <Button
                            key={restaurant.id}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-left text-sm"
                            onClick={() => handleRestaurantSelect(restaurant.id.toString())}
                          >
                            {restaurant.restaurant_name}
                          </Button>
                        ))}
                      </PopoverContent>
                    </Popover>
                    {errors.restaurant_id && (
                      <p className="text-sm text-red-500">{errors.restaurant_id}</p>
                    )}
                  </div>

                  {selectedRestaurant && (
                    <div className="space-y-2">
                      <Label>Restaurant Details</Label>
                      <div className="text-sm">
                        {selectedRestaurant.address && (
                          <p>Address: {selectedRestaurant.address.address_line1}</p>
                        )}
                        {selectedRestaurant.phone && <p>Phone: {selectedRestaurant.phone}</p>}
                        {selectedRestaurant.email && <p>Email: {selectedRestaurant.email}</p>}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingMenuItems ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading menu items...</span>
                    </div>
                  ) : (
                    <>
                      {formData.order_items.map((item, index) => (
                        <div key={index} className="flex items-end gap-4 p-4 border rounded-lg">
                          <div className="flex-1 space-y-2">
                            <Label>Menu Item</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between",
                                    errors[`order_items.${index}.menu_item_id`] && "border-red-500"
                                  )}
                                >
                                  {item.menu_item_id ? (
                                    <span>{menuItems.find(i => i.id.toString() === item.menu_item_id)?.name} - ${menuItems.find(i => i.id.toString() === item.menu_item_id)?.price}</span>
                                  ) : (
                                    <span className="text-gray-500">Select item</span>
                                  )}
                                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[200px] p-0">
                                {menuItems.map(menuItem => (
                                  <Button
                                    key={menuItem.id}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-left text-sm"
                                    onClick={() => handleItemChange(index, 'menu_item_id', menuItem.id.toString())}
                                  >
                                    {menuItem.name} - ${menuItem.price}
                                  </Button>
                                ))}
                              </PopoverContent>
                            </Popover>
                            {errors[`order_items.${index}.menu_item_id`] && (
                              <p className="text-sm text-red-500">
                                {errors[`order_items.${index}.menu_item_id`]}
                              </p>
                            )}
                          </div>

                          <div className="w-24 space-y-2">
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                            />
                            {errors[`order_items.${index}.quantity`] && (
                              <p className="text-sm text-red-500">
                                {errors[`order_items.${index}.quantity`]}
                              </p>
                            )}
                          </div>

                          <div className="w-32 space-y-2">
                            <Label>Price</Label>
                            <Input
                              type="text"
                              value={`$${item.price}`}
                              disabled
                            />
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddItem}
                        disabled={!formData.restaurant_id}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>

                      {errors.order_items && (
                        <p className="text-sm text-red-500">{errors.order_items}</p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Order Details */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="order_datetime">Order Date & Time</Label>
                      <Input
                        type="datetime-local"
                        id="order_datetime"
                        name="order_datetime"
                        value={formData.order_datetime}
                        onChange={handleChange}
                        required
                      />
                      {errors.order_datetime && (
                        <p className="text-sm text-red-500">{errors.order_datetime}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requested_delivery_datetime">Delivery Date & Time</Label>
                      <Input
                        type="datetime-local"
                        id="requested_delivery_datetime"
                        name="requested_delivery_datetime"
                        value={formData.requested_delivery_datetime}
                        onChange={handleChange}
                        required
                      />
                      {errors.requested_delivery_datetime && (
                        <p className="text-sm text-red-500">{errors.requested_delivery_datetime}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="order_status_id">Order Status</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              errors.order_status_id && "border-red-500"
                            )}
                          >
                            {formData.order_status_id ? (
                              <span>{orderStatuses.find(s => s.id.toString() === formData.order_status_id)?.name}</span>
                            ) : (
                              <span className="text-gray-500">Select status</span>
                            )}
                            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          {orderStatuses.map(status => (
                            <Button
                              key={status.id}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-left text-sm"
                              onClick={() => handleSelectChange('order_status_id', status.id.toString())}
                            >
                              {status.name}
                            </Button>
                          ))}
                        </PopoverContent>
                      </Popover>
                      {errors.order_status_id && (
                        <p className="text-sm text-red-500">{errors.order_status_id}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assigned_driver_id">Assigned Driver</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              errors.assigned_driver_id && "border-red-500"
                            )}
                          >
                            {formData.assigned_driver_id ? (
                              <span>{drivers.find(d => d.id.toString() === formData.assigned_driver_id)?.first_name} {drivers.find(d => d.id.toString() === formData.assigned_driver_id)?.last_name}</span>
                            ) : (
                              <span className="text-gray-500">Select driver</span>
                            )}
                            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          {drivers.map(driver => (
                            <Button
                              key={driver.id}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-left text-sm"
                              onClick={() => handleSelectChange('assigned_driver_id', driver.id.toString())}
                            >
                              {driver.first_name} {driver.last_name}
                            </Button>
                          ))}
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="delivery_fee">Delivery Fee</Label>
                      <Input
                        type="number"
                        id="delivery_fee"
                        name="delivery_fee"
                        value={formData.delivery_fee}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                      />
                      {errors.delivery_fee && (
                        <p className="text-sm text-red-500">{errors.delivery_fee}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Total Amount</Label>
                      <Input
                        type="text"
                        value={`$${calculateTotal()}`}
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              asChild
            >
              <Link href={route('admin.orders.index')}>Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating Order...
                </>
              ) : (
                'Update Order'
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}