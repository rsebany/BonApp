import { type SharedData } from '@/types/index';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Utensils, Star, Clock, MapPin, ChevronRight, Heart, Award, Bike, ShieldCheck, ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  usePage<SharedData>();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [savedRestaurants, setSavedRestaurants] = useState<number[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1500);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const toggleSaved = (id: number) => {
    setSavedRestaurants(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Mock data
  const featuredRestaurants = [
    {
      id: 1,
      name: "Burger Palace",
      isSuperhost: true,
      cuisine: "American",
      rating: 4.8,
      deliveryTime: "15-25 min",
      distance: "0.5 miles",
      image: "/images/burger.jpg",
      tags: ["Gourmet", "Local Favorite", "Comfort Food"],
      featuredDish: "Truffle Burger",
      priceRange: "$$",
      category: "Burgers"
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
      priceRange: "$$",
      category: "Pizza"
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
      priceRange: "$$$",
      category: "Sushi"
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
      priceRange: "$$",
      category: "Salads"
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
      priceRange: "$",
      category: "Mexican"
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
      priceRange: "$$",
      category: "Italian"
    }
  ];

  const allRestaurants = [...featuredRestaurants, ...localFavorites];
  const filteredRestaurants = activeCategory === 'All' 
    ? allRestaurants 
    : allRestaurants.filter(restaurant => restaurant.category === activeCategory);

  const categories = ['All', ...Array.from(new Set(allRestaurants.map(r => r.category)))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Discover Local Restaurants | TasteVoyage" />
      
      {/* Sticky Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                TasteVoyage
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" className="font-medium">Become a Partner</Button>
              <Button variant="ghost" className="font-medium">Sign In</Button>
              <Button className="bg-amber-500 hover:bg-amber-600">Sign Up</Button>
            </div>
            
            <Button className="md:hidden" size="icon" variant="ghost">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-amber-50 to-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Savor the flavors of your city
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
              Discover hidden culinary gems and have them delivered to your door in minutes.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="flex">
                <div className="relative flex-grow">
                  <Input 
                    type="text" 
                    placeholder="Search by restaurant, cuisine, or dish..." 
                    className="pl-12 pr-4 py-6 rounded-none border-none text-gray-900 focus-visible:ring-0 text-lg"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
                <Button className="rounded-none bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-8 py-6 text-white font-medium">
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
                  className="text-gray-700 hover:bg-amber-50 hover:text-amber-600 text-sm h-8 px-3 rounded-full border"
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
        {/* Categories Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
                className={`whitespace-nowrap rounded-full ${activeCategory === category ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Restaurants Grid */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Dining experiences nearby</h2>
            <Link href="/restaurants" className="flex items-center text-amber-600 hover:underline font-medium">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="group">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col border border-gray-200">
                    <div className="relative">
                      <div 
                        className="aspect-video bg-cover bg-center group-hover:scale-105 transition-transform duration-300" 
                        style={{ backgroundImage: `url(${restaurant.image})` }}
                      ></div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className={`absolute top-2 right-2 rounded-full ${savedRestaurants.includes(restaurant.id) ? 'bg-rose-100 hover:bg-rose-200' : 'bg-white/90 hover:bg-white'}`}
                        onClick={() => toggleSaved(restaurant.id)}
                      >
                        <Heart 
                          className={`w-5 h-5 ${savedRestaurants.includes(restaurant.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-700'}`} 
                        />
                      </Button>
                      {restaurant.name && (
                        <div className="absolute bottom-2 left-2">
                          <Badge className="flex items-center bg-white text-gray-900 hover:bg-white shadow-sm">
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
                        <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                          <Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" />
                          <span className="text-sm font-medium">{restaurant.rating}</span>
                        </div>
                      </div>
                      <CardDescription className="flex justify-between text-gray-600">
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
                            className="text-xs bg-gray-50 border-gray-200"
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-amber-300 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                      >
                        Order now
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </section>
        
        {/* Categories Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Explore by category</h2>
            <Link href="/categories" className="flex items-center text-amber-600 hover:underline font-medium">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {popularCategories.map((category) => (
              <Link 
                key={category.id} 
                href={`/category/${category.id}`}
                className="group relative overflow-hidden rounded-xl"
              >
                <div className="aspect-square overflow-hidden rounded-xl">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" 
                    style={{ backgroundImage: `url(${category.image})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                    <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                    <p className="text-sm text-white/90 mt-1">{category.count} spots</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        
        {/* Local Favorites Carousel */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Local favorites</h2>
              <p className="text-gray-600">Highly rated by people in your area</p>
            </div>
            <Link href="/local-favorites" className="flex items-center text-amber-600 hover:underline font-medium">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {localFavorites.map((restaurant) => (
                <CarouselItem key={restaurant.id} className="sm:basis-1/2">
                  <Card className="h-full flex flex-col sm:flex-row border border-gray-200 overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="sm:w-1/3 relative min-h-[200px] sm:min-h-0">
                      <div 
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" 
                        style={{ backgroundImage: `url(${restaurant.image})` }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-transparent sm:bg-gradient-to-r sm:from-black/10 sm:via-black/5 sm:to-transparent"></div>
                    </div>
                    <div className="sm:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl group-hover:text-amber-600 transition-colors">
                          {restaurant.name}
                        </CardTitle>
                        <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
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
                            className="text-xs bg-gray-50 border-gray-200"
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
                          View menu <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-white border-gray-300 hover:bg-gray-50" />
            <CarouselNext className="right-2 bg-white border-gray-300 hover:bg-gray-50" />
          </Carousel>
        </section>
        
        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">How TasteVoyage works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 hover:bg-amber-50 rounded-xl transition-colors">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Find restaurants nearby</h3>
              <p className="text-gray-600">
                Use our map or search to discover top-rated eateries in your neighborhood.
              </p>
            </div>
            
            <div className="text-center p-6 hover:bg-amber-50 rounded-xl transition-colors">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Explore unique dishes</h3>
              <p className="text-gray-600">
                Browse menus featuring chef specialties and local favorites.
              </p>
            </div>
            
            <div className="text-center p-6 hover:bg-amber-50 rounded-xl transition-colors">
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
        <section className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-8 mb-16 overflow-hidden relative">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-amber-200 opacity-20"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-amber-300 opacity-20"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Dine with confidence</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Every restaurant on TasteVoyage meets our high standards for food quality, 
              safety, and service. Our review system helps you choose the best options.
            </p>
            <Button variant="outline" className="border-amber-300 text-amber-600 hover:bg-amber-100 bg-white">
              Learn about our standards
            </Button>
          </div>
        </section>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to explore local flavors?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Join thousands enjoying the best food their neighborhoods have to offer.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-gray-900 hover:bg-gray-100 h-12 px-6 rounded-lg font-medium">
              Sign up to order
            </Button>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 h-12 px-6 rounded-lg font-medium">
              Learn how it works
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">TasteVoyage</h3>
            <p className="text-gray-600">
              Connecting food lovers with the best local restaurants and culinary experiences.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">For Diners</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-amber-600">How it works</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-amber-600">Gift cards</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-amber-600">Help center</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">For Restaurants</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-amber-600">Partner with us</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-amber-600">Delivery services</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-amber-600">Business tools</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-amber-600">About us</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-amber-600">Careers</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-amber-600">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} TasteVoyage, Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}