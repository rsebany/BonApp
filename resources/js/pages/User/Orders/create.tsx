import React, { useState } from 'react';
import { useForm, Head, Link, usePage } from '@inertiajs/react';
import TopNavBar from '@/components/Navigation/UserNavigation/user-header';
import LeftSidebar from '@/components/Navigation/UserNavigation/user-leftsidebar';
import RightSidebar from '@/components/Navigation/UserNavigation/user-rightsidebar';
import '../../../../css/user-navigation-sidebar.css';

// Dummy types for now; replace with your actual types
interface Restaurant {
  id: number;
  restaurant_name: string;
}
interface MenuItem {
  id: number;
  item_name: string;
  price: number;
  restaurant_id: number;
}
interface Address {
  id: number;
  address_line1: string;
  city: string;
  region?: string;
  postal_code?: string;
}

export default function CreateOrder() {
  // These would come from the backend in a real app
  const restaurants = (usePage().props.restaurants as Restaurant[]) || [];
  const menuItems = (usePage().props.menuItems as MenuItem[]) || [];
  const addresses = (usePage().props.addresses as Address[]) || [];
  const deliveryTimes = (usePage().props.deliveryTimes as string[]) || [];

  const [activeItem, setActiveItem] = useState('Orders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<{ menu_item_id: number; quantity: number }[]>([]);

  const { data, setData, post, processing, errors } = useForm({
    restaurant_id: '',
    items: [] as { menu_item_id: number; quantity: number }[],
    customer_address_id: '',
    delivery_time: '',
    notes: '',
  });

  // When restaurant changes, reset menu items
  const handleRestaurantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedRestaurant(id);
    setData('restaurant_id', String(id));
    setSelectedItems([]);
    setData('items', []);
  };

  // Add or update menu item selection
  const handleMenuItemChange = (menu_item_id: number, quantity: number) => {
    setSelectedItems(prev => {
      const existing = prev.find(i => i.menu_item_id === menu_item_id);
      let updated;
      if (existing) {
        updated = prev.map(i =>
          i.menu_item_id === menu_item_id ? { ...i, quantity } : i
        );
      } else {
        updated = [...prev, { menu_item_id, quantity }];
      }
      setData('items', updated);
      return updated;
    });
  };

  // Address selection
  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setData('customer_address_id', String(id));
  };

  const handleDeliveryTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setData('delivery_time', e.target.value);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData('notes', e.target.value);
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('orders.store'));
  };

  // Filter menu items by selected restaurant
  const filteredMenuItems = selectedRestaurant
    ? menuItems.filter(item => item.restaurant_id === selectedRestaurant)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head title="Place New Order" />
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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Place New Order</h1>
              <Link href={route('orders.index')} className="text-emerald-600 hover:underline font-medium">Back to Orders</Link>
            </div>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-6 border border-gray-100">
              <div>
                <label className="block font-semibold mb-1">Restaurant</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={data.restaurant_id}
                  onChange={handleRestaurantChange}
                  required
                >
                  <option value="">Select a restaurant</option>
                  {restaurants.map(r => (
                    <option key={r.id} value={r.id}>{r.restaurant_name}</option>
                  ))}
                </select>
                {errors.restaurant_id && <div className="text-red-500 text-sm mt-1">{errors.restaurant_id}</div>}
              </div>
              {selectedRestaurant && (
                <div>
                  <label className="block font-semibold mb-1">Menu Items</label>
                  <div className="space-y-2">
                    {filteredMenuItems.length === 0 && <div className="text-gray-500">No menu items available.</div>}
                    {filteredMenuItems.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <span className="flex-1">{item.item_name} <span className="text-gray-400">${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}</span></span>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          className="w-20 border rounded px-2 py-1"
                          value={selectedItems.find(i => i.menu_item_id === item.id)?.quantity || 0}
                          onChange={e => handleMenuItemChange(item.id, Number(e.target.value))}
                        />
                      </div>
                    ))}
                  </div>
                  {errors.items && <div className="text-red-500 text-sm mt-1">{errors.items}</div>}
                </div>
              )}
              <div>
                <label className="block font-semibold mb-1">Delivery Time</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={data.delivery_time}
                  onChange={handleDeliveryTimeChange}
                  required
                >
                  <option value="">Select a delivery time</option>
                  {deliveryTimes.map((slot, idx) => (
                    <option key={idx} value={slot}>{slot}</option>
                  ))}
                </select>
                {errors.delivery_time && <div className="text-red-500 text-sm mt-1">{errors.delivery_time}</div>}
              </div>
              <div>
                <label className="block font-semibold mb-1">Delivery Address</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={data.customer_address_id}
                  onChange={handleAddressChange}
                  required
                >
                  <option value="">Select an address</option>
                  {addresses.map(a => (
                    <option key={a.id} value={a.id}>{a.address_line1}, {a.city}{a.region ? ', ' + a.region : ''}{a.postal_code ? ', ' + a.postal_code : ''}</option>
                  ))}
                </select>
                {errors.customer_address_id && <div className="text-red-500 text-sm mt-1">{errors.customer_address_id}</div>}
              </div>
              <div>
                <label className="block font-semibold mb-1">Order Notes (optional)</label>
                <textarea
                  className="w-full border rounded px-3 py-2 min-h-[60px]"
                  value={data.notes}
                  onChange={handleNotesChange}
                  placeholder="Add any special instructions here..."
                />
                {errors.notes && <div className="text-red-500 text-sm mt-1">{errors.notes}</div>}
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow transition-colors disabled:opacity-50"
                  disabled={processing}
                >
                  {processing ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
} 