import { type SharedData } from '@/types/index';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Utensils, Star, Clock, MapPin, ChevronRight, Heart, Award, Bike, ShieldCheck } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  usePage<SharedData>();
  
  // Mock data - replace with actual data from your backend
  const featuredRestaurants = [
    {
      id: 1,
      name: "Burger Palace",
      cuisine: "American",
      rating: 4.8,
      deliveryTime: "15-25 min",
      distance: "0.5 miles",
      isSuperhost: true,
      image: "/images/burger.jpg",
      tags: ["Gourmet", "Local Favorite", "Comfort Food"],
      featuredDish: "Truffle Burger",
      priceRange: "$$"
    },
    {
      id: 2,
      name: "Pizza Heaven",
      cuisine: "Italian",
      rating: 4.9,
      deliveryTime: "20-30 min",
      distance: "1.2 miles",
      isSuperhost: true,
      image: "/images/pizza.jpg",
      tags: ["Wood Fired", "Authentic", "Family Style"],
      featuredDish: "Truffle Mushroom Pizza",
      priceRange: "$$"
    },
    {
      id: 3,
      name: "Sushi World",
      cuisine: "Japanese",
      rating: 4.7,
      deliveryTime: "25-35 min",
      distance: "0.8 miles",
      isSuperhost: false,
      image: "/images/sushi.jpg",
      tags: ["Omakase", "Fresh", "Healthy"],
      featuredDish: "Chef's Special Roll",
      priceRange: "$$$"
    },
    {
      id: 4,
      name: "Green Leaf",
      cuisine: "Healthy",
      rating: 4.6,
      deliveryTime: "20-30 min",
      distance: "1.5 miles",
      isSuperhost: true,
      image: "/images/salad.jpg",
      tags: ["Organic", "Farm-to-Table", "Vegan"],
      featuredDish: "Kale Caesar Salad",
      priceRange: "$$"
    },
  ];

  const popularCategories = [
    { id: 1, name: "Burgers", icon: "🍔", count: 24, image: "/images/burger-cat.jpg" },
    { id: 2, name: "Pizza", icon: "🍕", count: 18, image: "/images/pizza-cat.jpg" },
    { id: 3, name: "Sushi", icon: "🍣", count: 12, image: "/images/sushi-cat.jpg" },
    { id: 4, name: "Salads", icon: "🥗", count: 15, image: "/images/salad-cat.jpg" },
    { id: 5, name: "Desserts", icon: "🍰", count: 8, image: "/images/dessert-cat.jpg" },
  ];

  const localFavorites = [
    {
      id: 5,
      name: "Taco Fiesta",
      cuisine: "Mexican",
      rating: 4.7,
      deliveryTime: "15-25 min",
      distance: "0.3 miles",
      isLocalFavorite: true,
      image: "/images/tacos.jpg",
      tags: ["Street Food", "Authentic", "Spicy"],
      featuredDish: "Al Pastor Tacos",
      priceRange: "$"
    },
    {
      id: 6,
      name: "Pasta Palace",
      cuisine: "Italian",
      rating: 4.6,
      deliveryTime: "25-35 min",
      distance: "1.1 miles",
      isLocalFavorite: true,
      image: "/images/pasta.jpg",
      tags: ["Homemade", "Comfort Food", "Family Style"],
      featuredDish: "Truffle Pasta",
      priceRange: "$$"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Discover Local Restaurants | TasteVoyage" />
      
      {/* Hero Section */}
      <div className="relative bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Discover and order from the best local restaurants
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
              TasteVoyage connects you with top-rated eateries in your neighborhood. 
              Explore unique dishes and have them delivered to your door.
            </p>
          </div>
          
          {/* Search with Map Button */}
          <div className="max-w-3xl mx-auto">
            <div className="relative shadow-lg rounded-xl overflow-hidden">
              <div className="flex">
                <div className="relative flex-grow">
                  <Input 
                    type="text" 
                    placeholder="Search by restaurant, cuisine, or dish..." 
                    className="pl-12 pr-4 py-6 rounded-none border-none text-gray-900 focus-visible:ring-0"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
                <Button className="rounded-none bg-amber-500 hover:bg-amber-600 px-8 py-6 text-white">
                  <MapPin className="mr-2 h-5 w-5" /> Show map
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="text-sm text-gray-600">Trending now: </span>
              {['Pizza', 'Burgers', 'Sushi', 'Tacos', 'Pasta'].map((item) => (
                <Button 
                  key={item} 
                  variant="ghost" 
                  className="text-gray-700 hover:bg-amber-50 hover:text-amber-600 text-sm h-8 px-3 rounded-full"
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Categories Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Explore by category</h2>
            <Link href="/categories" className="flex items-center text-amber-600 hover:underline">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {popularCategories.map((category) => (
              <Link 
                key={category.id} 
                href={`/category/${category.id}`}
                className="group"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300" 
                    style={{ backgroundImage: `url(${category.image})` }}
                  ></div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <span className="text-4xl mb-2">{category.icon}</span>
                    <h3 className="text-lg font-semibold text-white text-center">{category.name}</h3>
                    <p className="text-sm text-white/90 mt-1">{category.count} spots</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        
        {/* Featured Restaurants */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Top-rated restaurants near you</h2>
            <Link href="/restaurants" className="flex items-center text-amber-600 hover:underline">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="group">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col border-0">
                  <div className="relative">
                    <div 
                      className="aspect-video bg-cover bg-center group-hover:scale-105 transition-transform duration-300" 
                      style={{ backgroundImage: `url(${restaurant.image})` }}
                    ></div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="absolute top-2 right-2 rounded-full bg-white/90 hover:bg-white"
                    >
                      <Heart className="w-5 h-5 text-gray-700" />
                    </Button>
                    {restaurant.isSuperhost && (
                      <div className="absolute bottom-2 left-2">
                        <Badge className="flex items-center bg-white text-gray-900 hover:bg-white">
                          <Award className="w-4 h-4 mr-1 text-amber-500" />
                          Top Rated
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="group-hover:text-amber-600 transition-colors text-lg">
                        {restaurant.name}
                      </CardTitle>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" />
                        <span className="text-sm">{restaurant.rating}</span>
                      </div>
                    </div>
                    <CardDescription className="flex justify-between">
                      <span>{restaurant.cuisine}</span>
                      <span>•</span>
                      <span>{restaurant.distance}</span>
                      <span>•</span>
                      <span>{restaurant.priceRange}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4 pt-0">
                    <p className="text-sm text-gray-600">{restaurant.featuredDish}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {restaurant.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="text-xs bg-gray-50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto pt-0 flex items-center justify-between border-t px-6 py-4">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{restaurant.deliveryTime}</span>
                    </div>
                    <Button variant="outline" size="sm" className="border-amber-300 text-amber-600 hover:bg-amber-50">
                      Order now
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </section>
        
        {/* Local Favorites */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Local favorites</h2>
              <p className="text-gray-600">Highly rated by people in your area</p>
            </div>
            <Link href="/local-favorites" className="flex items-center text-amber-600 hover:underline">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {localFavorites.map((restaurant) => (
                <CarouselItem key={restaurant.id} className="sm:basis-1/2">
                  <Card className="h-full flex flex-col sm:flex-row border-0 overflow-hidden group">
                    <div className="sm:w-1/3 relative">
                      <div 
                        className="h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300" 
                        style={{ backgroundImage: `url(${restaurant.image})` }}
                      ></div>
                    </div>
                    <div className="sm:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl group-hover:text-amber-600 transition-colors">
                          {restaurant.name}
                        </CardTitle>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" />
                          <span>{restaurant.rating}</span>
                        </div>
                      </div>
                      <CardDescription className="mb-4">
                        {restaurant.cuisine} • {restaurant.distance} • {restaurant.priceRange}
                      </CardDescription>
                      <p className="text-gray-700 mb-4">{restaurant.featuredDish}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {restaurant.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="text-xs bg-gray-50"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm">{restaurant.deliveryTime}</span>
                        </div>
                        <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                          View menu
                        </Button>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </section>
        
        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">How TasteVoyage works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Find restaurants nearby</h3>
              <p className="text-gray-600">
                Use our map or search to discover top-rated eateries in your neighborhood.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Explore unique dishes</h3>
              <p className="text-gray-600">
                Browse menus featuring chef specialties and local favorites.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bike className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Fast, reliable delivery</h3>
              <p className="text-gray-600">
                Track your order in real-time from kitchen to your door.
              </p>
            </div>
          </div>
        </section>
        
        {/* Trust & Safety */}
        <section className="bg-amber-50 rounded-2xl p-8 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Dine with confidence</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Every restaurant on TasteVoyage meets our high standards for food quality, 
              safety, and service. Our review system helps you choose the best options.
            </p>
            <Button variant="outline" className="border-amber-300 text-amber-600 hover:bg-amber-100">
              Learn about our standards
            </Button>
          </div>
        </section>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to explore local flavors?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Join thousands enjoying the best food their neighborhoods have to offer.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-gray-900 hover:bg-gray-100 h-12 px-6 rounded-lg">
              Sign up to order
            </Button>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 h-12 px-6 rounded-lg">
              Learn how it works
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}