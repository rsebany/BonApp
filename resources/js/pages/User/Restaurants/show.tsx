import React from 'react';
import { router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import TopNavBar from '@/components/Navigation/UserNavigation/user-header';
import LeftSidebar from '@/components/Navigation/UserNavigation/user-leftsidebar';
import RightSidebar from '@/components/Navigation/UserNavigation/user-rightsidebar';
import '../../../../css/user-navigation-sidebar.css';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
}

interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
}

interface Restaurant {
  id: number;
  restaurant_name: string;
  cuisine_type: string;
  rating: number;
  review_count?: number;
  delivery_time?: string;
  delivery_fee?: string;
  min_order?: string;
  distance_km?: number;
  image_url?: string;
  tags?: string[];
  special_offer?: string;
  is_open?: boolean;
  is_favorite?: boolean;
  price_range?: string;
  description?: string;
  menu_items?: MenuItem[];
  reviews?: Review[];
}

export default function RestaurantShow() {
  const { restaurant } = (usePage().props as unknown) as { restaurant: Restaurant };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState('Restaurants');

  const handleToggleFavorite = () => {
    router.post(route('restaurants.favorite', { restaurant: restaurant.id }), {}, {
      onSuccess: () => router.reload({ only: ['restaurant'] })
    });
  };

  return (
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
            <button className="mb-4 text-emerald-600 hover:underline" onClick={() => window.history.back()}>&larr; Back</button>
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={restaurant.image_url || ''}
                  alt={restaurant.restaurant_name}
                  className="w-full md:w-64 h-48 object-cover rounded-2xl"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold mb-2">{restaurant.restaurant_name}</h1>
                    <button
                      className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                        restaurant.is_favorite
                          ? 'bg-white/95 text-red-500 shadow-lg'
                          : 'bg-white/80 text-gray-600 hover:bg-white/95 hover:text-red-500'
                      }`}
                      onClick={handleToggleFavorite}
                    >
                      ♥
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-500 font-bold">{restaurant.rating}</span>
                    <span className="text-gray-400">({restaurant.review_count} reviews)</span>
                    <span className="text-gray-500 ml-2">{restaurant.cuisine_type}</span>
                    <span className="text-gray-500 ml-2">{restaurant.price_range}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {restaurant.is_open ? (
                      <span className="text-emerald-600 font-semibold">Open</span>
                    ) : (
                      <span className="text-gray-400 font-semibold">Closed</span>
                    )}
                    {restaurant.tags && restaurant.tags.map(tag => (
                      <span key={tag} className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium mr-1">{tag}</span>
                    ))}
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-600">Delivery: {restaurant.delivery_time} | Fee: {restaurant.delivery_fee}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-600">Min Order: {restaurant.min_order}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-600">Distance: {restaurant.distance_km} km</span>
                  </div>
                  {restaurant.special_offer && (
                    <div className="mb-2 text-emerald-700 font-semibold">Special: {restaurant.special_offer}</div>
                  )}
                  {restaurant.description && (
                    <div className="mt-4 text-gray-700">{restaurant.description}</div>
                  )}
                </div>
              </div>
              {/* Menu Items */}
              {restaurant.menu_items && restaurant.menu_items.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-2">Menu</h2>
                  <ul className="divide-y divide-gray-100">
                    {restaurant.menu_items.map(item => (
                      <li key={item.id} className="py-3 flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{item.name}</div>
                          {item.description && <div className="text-gray-500 text-sm">{item.description}</div>}
                        </div>
                        <div className="text-emerald-600 font-bold">${typeof item.price === 'number' ? item.price.toFixed(2) : Number(item.price ?? 0).toFixed(2)}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Reviews */}
              {restaurant.reviews && restaurant.reviews.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-2">Reviews</h2>
                  <ul className="divide-y divide-gray-100">
                    {restaurant.reviews.map(review => (
                      <li key={review.id} className="py-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800">{review.user_name}</span>
                          <span className="text-yellow-500 font-bold">{review.rating}</span>
                        </div>
                        <div className="text-gray-700">{review.comment}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}
