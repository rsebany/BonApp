import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import TopNavBar from '@/components/Navigation/UserNavigation/user-header';
import LeftSidebar from '@/components/Navigation/UserNavigation/user-leftsidebar';
import RightSidebar from '@/components/Navigation/UserNavigation/user-rightsidebar';
import '../../../../css/user-navigation-sidebar.css';

interface Restaurant {
  id: number;
  restaurant_name: string;
  cuisine_type: string;
  rating: number;
  review_count?: number;
  delivery_time?: number;
  delivery_fee?: number | string;
  min_order?: number | string;
  minimum_order?: number | string;
  distance_km?: number;
  image_url?: string;
  image?: string;
  tags?: string[];
  special_offer?: string;
  is_open?: boolean;
  is_favorite?: boolean;
  price_range?: string;
  description?: string;
  address?: {
    address_line1?: string;
    city?: string;
    region?: string;
  };
}

interface Filters {
  category: string;
  search: string;
  sort: string;
  price_range: string;
}

export default function RestaurantsFavorites() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { restaurants, filters: initialFilters } = usePage().props as any;
  const [activeItem, setActiveItem] = useState('Favorites');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const categories = ['All', 'Italian', 'Chinese', 'Japanese', 'Mexican', 'American', 'Healthy', 'Fast Food', 'Desserts'];
  const allPriceRanges = ['$', '$$', '$$$', '$$$$'];
  const sortOptions = [
    { value: 'rating', label: 'Rating' },
    { value: 'distance', label: 'Distance' },
    { value: 'delivery_time', label: 'Delivery Time' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' }
  ];

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
      </div>
    </div>
  );

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setLoading(true);
    router.get(route('restaurants.favorites'), updatedFilters, {
      onFinish: () => setLoading(false),
      preserveScroll: true,
    });
  };

  const handlePageChange = (url: string | null) => {
    if (!url) return;
    setLoading(true);
    router.get(url, {}, {
      onFinish: () => setLoading(false),
      preserveScroll: true,
    });
  };

  const handleCardClick = (id: number) => {
    router.visit(`/restaurants/${id}`);
  };

  const handleRemoveFavorite = (restaurantId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    router.post(route('restaurants.favorite', { restaurant: restaurantId }), {}, {
      onSuccess: () => router.reload({ only: ['restaurants'], onFinish: () => setLoading(false) }),
      onFinish: () => setLoading(false),
    });
  };

  const getRestaurantImage = (restaurant: Restaurant) => {
    // Use image_url if available, otherwise use image, otherwise use a default food image
    return restaurant.image_url || restaurant.image || `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=640&h=480&fit=crop&crop=center&auto=format&q=80`;
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${numPrice.toFixed(2)}`;
  };

  const formatDeliveryTime = (time: number) => {
    return `${time}-${time + 10} min`;
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
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorite Restaurants</h1>
              <p className="text-gray-600">
                {restaurants.total > 0 
                  ? `You have ${restaurants.total} favorite restaurant${restaurants.total > 1 ? 's' : ''}`
                  : "You haven't added any restaurants to your favorites yet."
                }
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 items-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded ${filters.category === cat ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 border'}`}
                  onClick={() => handleFilterChange({ category: cat })}
                >
                  {cat}
                </button>
              ))}
              <input
                type="text"
                placeholder="Search favorites..."
                className="ml-auto px-3 py-2 border rounded"
                value={filters.search}
                onChange={e => handleFilterChange({ search: e.target.value })}
              />
              <select
                className="px-3 py-2 border rounded"
                value={filters.sort}
                onChange={e => handleFilterChange({ sort: e.target.value })}
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                className="px-3 py-2 border rounded"
                value={filters.price_range}
                onChange={e => handleFilterChange({ price_range: e.target.value })}
              >
                <option value="All">All Prices</option>
                {allPriceRanges.map((pr: string) => (
                  <option key={pr} value={pr}>{pr}</option>
                ))}
              </select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Empty State */}
            {!loading && restaurants.data.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">♥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
                <p className="text-gray-600 mb-6">
                  {filters.search || filters.category !== 'All' || filters.price_range !== 'All'
                    ? "No restaurants match your current filters. Try adjusting your search criteria."
                    : "Start exploring restaurants and add them to your favorites to see them here!"
                  }
                </p>
                {!filters.search && filters.category === 'All' && filters.price_range === 'All' && (
                  <button
                    onClick={() => router.visit(route('restaurants.index'))}
                    className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Browse Restaurants
                  </button>
                )}
              </div>
            )}

            {/* Restaurant Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${loading ? 'opacity-50 pointer-events-none' : ''}`}> 
              {restaurants.data.map((restaurant: Restaurant) => (
                <div
                  key={restaurant.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100"
                  onClick={() => handleCardClick(restaurant.id)}
                >
                  <div className="relative">
                    <img 
                      src={getRestaurantImage(restaurant)}
                      alt={restaurant.restaurant_name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=640&h=480&fit=crop&crop=center&auto=format&q=80';
                      }}
                    />
                    <button 
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/95 text-red-500 shadow-lg hover:bg-red-50 transition-all"
                      onClick={(e) => handleRemoveFavorite(restaurant.id, e)}
                      title="Remove from favorites"
                    >
                      ♥
                    </button>
                    {restaurant.special_offer && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {restaurant.special_offer}
                        </span>
                      </div>
                    )}
                    {restaurant.tags && (
                      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                        {restaurant.tags.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">{tag}</span>
                        ))}
                      </div>
                    )}
                    {!restaurant.is_open && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">Closed</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {restaurant.restaurant_name}
                      </h3>
                      <span className="text-gray-500 text-sm font-medium">{restaurant.price_range}</span>
                    </div>
                    <div className="text-gray-600 text-sm mb-2">{restaurant.cuisine_type}</div>
                    {restaurant.description && (
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{restaurant.description}</p>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-500 font-bold">★ {restaurant.rating}</span>
                      <span className="text-gray-400 text-sm">({restaurant.review_count || 0} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        {restaurant.delivery_time && (
                          <span>🕒 {formatDeliveryTime(restaurant.delivery_time)}</span>
                        )}
                        {restaurant.delivery_fee && (
                          <span>🚚 {formatPrice(restaurant.delivery_fee)}</span>
                        )}
                      </div>
                      {restaurant.min_order && (
                        <span>Min {formatPrice(restaurant.min_order)}</span>
                      )}
                    </div>
                    {restaurant.address && (
                      <div className="text-gray-400 text-xs mt-2">
                        📍 {restaurant.address.city}, {restaurant.address.region}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {!loading && restaurants.last_page > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                  disabled={!restaurants.prev_page_url}
                  onClick={() => handlePageChange(restaurants.prev_page_url)}
                >
                  Previous
                </button>
                <span className="px-3 py-1">Page {restaurants.current_page} of {restaurants.last_page}</span>
                <button
                  className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                  disabled={!restaurants.next_page_url}
                  onClick={() => handlePageChange(restaurants.next_page_url)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
} 