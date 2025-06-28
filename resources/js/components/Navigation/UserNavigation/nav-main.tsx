import React, { useState } from 'react';
import {
  Utensils, Flame, Award, Star, Heart, Clock, Truck, ArrowRight, 
  TrendingUp, Zap
} from 'lucide-react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import TopNavBar from './user-header';
import LeftSidebar from './user-leftsidebar';
import RightSidebar from './user-rightsidebar';
import '../../../../css/user-navigation-sidebar.css';

// Types matching backend models
interface Restaurant {
  id: number;
  restaurant_name: string;
  cuisine_type: string;
  rating: number;
  review_count?: number;
  delivery_time: string;
  delivery_fee: number;
  minimum_order: number;
  distance_km?: number;
  image_url?: string;
  tags?: string[];
  special_offer?: string;
  is_open?: boolean;
  is_favorite?: boolean;
  price_range?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: {
    address_line1: string;
    city: string;
    region: string;
    country?: {
      country_name: string;
    };
  };
}

// Mock Data with external image URLs
const mockRestaurants: Restaurant[] = [
  {
    id: 1,
    restaurant_name: "Bella Vista Italian",
    cuisine_type: "Italian",
    rating: 4.8,
    review_count: 142,
    delivery_time: "25-35 min",
    delivery_fee: 0,
    minimum_order: 15.00,
    distance_km: 1.2,
    image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    tags: ["Popular", "New"],
    special_offer: "20% off",
    is_open: true,
    is_favorite: false,
    price_range: "$$",
    description: "Authentic Italian cuisine with fresh ingredients and traditional recipes.",
    phone: "+1-555-0123",
    email: "info@bellavista.com"
  },
  {
    id: 2,
    restaurant_name: "Dragon Palace",
    cuisine_type: "Chinese",
    rating: 4.7,
    review_count: 98,
    delivery_time: "30-40 min",
    delivery_fee: 2.99,
    minimum_order: 12.00,
    distance_km: 2.1,
    image_url: "https://images.unsplash.com/photo-1552566687-70135def300a?w=400&h=300&fit=crop",
    tags: ["Trending"],
    is_open: true,
    is_favorite: true,
    price_range: "$",
    description: "Traditional Chinese dishes with modern twists and authentic flavors.",
    phone: "+1-555-0124",
    email: "info@dragonpalace.com"
  },
  {
    id: 3,
    restaurant_name: "Burger Spot",
    cuisine_type: "Fast Food",
    rating: 4.5,
    review_count: 203,
    delivery_time: "15-25 min",
    delivery_fee: 1.99,
    minimum_order: 8.00,
    distance_km: 0.8,
    image_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
    tags: ["Fast delivery"],
    special_offer: "Buy 1 Get 1",
    is_open: true,
    is_favorite: false,
    price_range: "$",
    description: "Juicy burgers and crispy fries made with premium beef and fresh ingredients.",
    phone: "+1-555-0125",
    email: "info@burgerspot.com"
  },
  {
    id: 4,
    restaurant_name: "Green Bowl",
    cuisine_type: "Healthy",
    rating: 4.6,
    review_count: 87,
    delivery_time: "20-30 min",
    delivery_fee: 0,
    minimum_order: 18.00,
    distance_km: 1.5,
    image_url: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    tags: ["Healthy", "Vegan"],
    is_open: true,
    is_favorite: false,
    price_range: "$$",
    description: "Fresh, organic ingredients in every bowl. Healthy eating made delicious.",
    phone: "+1-555-0126",
    email: "info@greenbowl.com"
  },
  {
    id: 5,
    restaurant_name: "Sakura Sushi",
    cuisine_type: "Japanese",
    rating: 4.9,
    review_count: 156,
    delivery_time: "35-45 min",
    delivery_fee: 3.99,
    minimum_order: 25.00,
    distance_km: 2.8,
    image_url: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
    tags: ["Premium", "Fresh"],
    is_open: false,
    is_favorite: true,
    price_range: "$$$",
    description: "Premium sushi and sashimi made with the freshest fish and authentic Japanese techniques.",
    phone: "+1-555-0127",
    email: "info@sakurasushi.com"
  },
  {
    id: 6,
    restaurant_name: "Taco Fiesta",
    cuisine_type: "Mexican",
    rating: 4.4,
    review_count: 76,
    delivery_time: "20-30 min",
    delivery_fee: 1.99,
    minimum_order: 10.00,
    distance_km: 1.8,
    image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    tags: ["Spicy", "Popular"],
    special_offer: "15% off",
    is_open: true,
    is_favorite: false,
    price_range: "$",
    description: "Authentic Mexican tacos, burritos, and quesadillas with homemade salsa and guacamole.",
    phone: "+1-555-0128",
    email: "info@tacofiesta.com"
  },
  {
    id: 7,
    restaurant_name: "Mediterranean Delight",
    cuisine_type: "Mediterranean",
    rating: 4.7,
    review_count: 134,
    delivery_time: "25-35 min",
    delivery_fee: 0,
    minimum_order: 20.00,
    distance_km: 2.2,
    image_url: "https://images.unsplash.com/photo-1544510808-44835ad16c77?w=400&h=300&fit=crop",
    tags: ["Healthy", "Fresh"],
    is_open: true,
    is_favorite: true,
    price_range: "$$",
    description: "Fresh Mediterranean cuisine featuring olive oil, herbs, and wholesome ingredients.",
    phone: "+1-555-0129",
    email: "info@mediterraneandelight.com"
  },
  {
    id: 8,
    restaurant_name: "Pizza Corner",
    cuisine_type: "Italian",
    rating: 4.3,
    review_count: 189,
    delivery_time: "20-30 min",
    delivery_fee: 2.49,
    minimum_order: 12.00,
    distance_km: 1.1,
    image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    tags: ["Fast delivery"],
    special_offer: "2 for 1",
    is_open: true,
    is_favorite: false,
    price_range: "$",
    description: "Hand-tossed pizzas with fresh toppings and our signature tomato sauce.",
    phone: "+1-555-0130",
    email: "info@pizzacorner.com"
  }
];

const categories = [
  { name: "All", icon: <Utensils className="w-5 h-5" />, color: "emerald" },
  { name: "Fast Food", icon: <Zap className="w-5 h-5" />, color: "orange" },
  { name: "Italian", icon: <Award className="w-5 h-5" />, color: "green" },
  { name: "Asian", icon: <Star className="w-5 h-5" />, color: "yellow" },
  { name: "Healthy", icon: <Heart className="w-5 h-5" />, color: "pink" },
  { name: "Mexican", icon: <Flame className="w-5 h-5" />, color: "red" }
];

// Components
const RestaurantCard = ({ restaurant, onToggleFavorite }: {
  restaurant: Restaurant;
  onToggleFavorite: (id: number) => void;
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.visit(route('restaurants.show', { restaurant: restaurant.id }));
  };

  const formatDeliveryFee = (fee: number) => {
    return fee === 0 ? 'Free' : `$${fee.toFixed(2)}`;
  };

  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-100"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img 
          src={restaurant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'} 
          alt={restaurant.restaurant_name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop';
          }}
        />
        <button 
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
            restaurant.is_favorite 
              ? 'bg-white/95 text-red-500 shadow-lg' 
              : 'bg-white/80 text-gray-600 hover:bg-white/95 hover:text-red-500'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(restaurant.id);
          }}
        >
          <Heart className={`w-5 h-5 ${restaurant.is_favorite ? 'fill-current' : ''}`} />
        </button>
        
        {restaurant.special_offer && restaurant.is_open && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
            {restaurant.special_offer}
          </div>
        )}

        {restaurant.tags?.includes('Trending') && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Trending
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg group-hover:text-emerald-600 transition-colors truncate">
              {restaurant.restaurant_name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-600 text-sm">{restaurant.cuisine_type}</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm font-medium text-gray-700">{restaurant.price_range}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-lg ml-3 flex-shrink-0">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold">{restaurant.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{restaurant.delivery_time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              <span className={`font-medium ${restaurant.delivery_fee === 0 ? 'text-emerald-600' : ''}`}>
                {formatDeliveryFee(restaurant.delivery_fee)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CenterFeed = ({ restaurants, onToggleFavorite }: {
  restaurants: Restaurant[];
  onToggleFavorite: (id: number) => void;
}) => {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const trendingRestaurants = restaurants.filter(r => r.tags?.includes('Trending'));
  const featuredRestaurants = restaurants.filter(r => r.rating >= 4.7);

  const handleViewAllRestaurants = () => {
    router.visit(route('restaurants.index'));
  };

  const handleViewAllTrending = () => {
    router.visit(route('restaurants.index', { tags: ['Trending'] }));
  };

  return (
    <div 
      className="flex-1 center-feed-scroll center-feed-container scrollbar-hide"
      style={{
        height: 'calc(100vh - 4rem)',
        maxHeight: 'calc(100vh - 4rem)',
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Browse by category</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.name}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl whitespace-nowrap transition-all min-w-fit ${
                  activeCategory === category.name
                    ? 'bg-emerald-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-100'
                }`}
                onClick={() => {
                  setActiveCategory(category.name);
                  if (category.name !== 'All') {
                    router.visit(route('restaurants.index', { category: category.name }));
                  } else {
                    router.visit(route('restaurants.index'));
                  }
                }}
              >
                {category.icon}
                <span className="font-semibold">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trending Section */}
        {trendingRestaurants.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-bold text-gray-900">Trending now</h2>
              </div>
              <button 
                className="text-emerald-600 font-semibold flex items-center gap-2 hover:text-emerald-700"
                onClick={handleViewAllTrending}
              >
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trendingRestaurants.slice(0, 4).map(restaurant => (
                <RestaurantCard 
                  key={restaurant.id}
                  restaurant={restaurant}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </div>
        )}

        {/* Featured Restaurants */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured restaurants</h2>
            <button 
              className="text-emerald-600 font-semibold flex items-center gap-2 hover:text-emerald-700"
              onClick={handleViewAllRestaurants}
            >
              See all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredRestaurants.map(restaurant => (
              <RestaurantCard 
                key={restaurant.id}
                restaurant={restaurant}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>

        {/* All Restaurants */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All restaurants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {restaurants.map(restaurant => (
              <RestaurantCard 
                key={restaurant.id}
                restaurant={restaurant}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>

        {/* Extra content for testing scroll */}
        <div className="pb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">Download our mobile app</h3>
            <p className="text-emerald-100 mb-4">Get exclusive offers and faster ordering</p>
            <button className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Download Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function FoodDeliveryApp() {
  const [activeMenuItem, setActiveMenuItem] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [restaurants, setRestaurants] = useState(mockRestaurants);

  const handleToggleFavorite = (restaurantId: number) => {
    setRestaurants(prev => 
      prev.map(restaurant => 
        restaurant.id === restaurantId 
          ? { ...restaurant, is_favorite: !restaurant.is_favorite }
          : restaurant
      )
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <TopNavBar 
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar 
          activeItem={activeMenuItem}
          setActiveItem={setActiveMenuItem}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />
        
        <CenterFeed 
          restaurants={restaurants}
          onToggleFavorite={handleToggleFavorite}
        />
        
        <RightSidebar />
      </div>
    </div>
  );
}