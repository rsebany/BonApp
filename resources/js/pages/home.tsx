import { type SharedData } from '@/types/index';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Utensils, Star, Clock, MapPin, ChevronRight, Salad, Pizza, Sandwich, Donut } from 'lucide-react';
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
      rating: 4.5,
      deliveryTime: "20-30 min",
      deliveryFee: "$2.99",
      minOrder: "$10.00",
      image: "/images/burger.jpg",
      tags: ["Burgers", "Fast Food", "Comfort Food"]
    },
    {
      id: 2,
      name: "Pizza Heaven",
      cuisine: "Italian",
      rating: 4.7,
      deliveryTime: "25-35 min",
      deliveryFee: "Free",
      minOrder: "$15.00",
      image: "/images/pizza.jpg",
      tags: ["Wood Fired", "Authentic", "Family Style"]
    },
    {
      id: 3,
      name: "Sushi World",
      cuisine: "Japanese",
      rating: 4.8,
      deliveryTime: "30-40 min",
      deliveryFee: "$3.49",
      minOrder: "$20.00",
      image: "/images/sushi.jpg",
      tags: ["Fresh", "Authentic", "Healthy"]
    },
    {
      id: 4,
      name: "Green Leaf",
      cuisine: "Healthy",
      rating: 4.6,
      deliveryTime: "25-35 min",
      deliveryFee: "$2.49",
      minOrder: "$12.00",
      image: "/images/salad.jpg",
      tags: ["Organic", "Vegan", "Gluten Free"]
    },
  ];

  const popularCategories = [
    { id: 1, name: "Burgers", icon: <Sandwich className="w-6 h-6" />, count: 24 },
    { id: 2, name: "Pizza", icon: <Pizza className="w-6 h-6" />, count: 18 },
    { id: 3, name: "Sushi", icon: <Pizza className="w-6 h-6" />, count: 12 },
    { id: 4, name: "Salads", icon: <Salad className="w-6 h-6" />, count: 15 },
    { id: 5, name: "Desserts", icon: <Donut className="w-6 h-6" />, count: 8 },
  ];

  const deals = [
    {
      id: 1,
      title: "Family Feast Deal",
      description: "Get 20% off on orders over $50",
      code: "FAMILY20",
      restaurant: "Pizza Heaven"
    },
    {
      id: 2,
      title: "First Order Special",
      description: "15% off your first order",
      code: "NEW15",
      restaurant: "Any restaurant"
    },
    {
      id: 3,
      title: "Lunch Combo",
      description: "Burger + Fries + Drink for $9.99",
      code: "LUNCHCOMBO",
      restaurant: "Burger Palace"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Delicious Food Delivered Fast | FoodExpress" />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Delicious food delivered to your door</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Order from your favorite restaurants with just a few clicks. Fast, easy, and delicious!</p>
          
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search for restaurants or cuisines..." 
                className="pl-12 pr-32 py-6 rounded-full border-none shadow-lg text-gray-900"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 hover:bg-amber-700 px-6">
                Search
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="text-sm">Popular: </span>
              {['Pizza', 'Burgers', 'Sushi', 'Pasta', 'Salads'].map((item) => (
                <Button 
                  key={item} 
                  variant="ghost" 
                  className="text-white hover:bg-orange-400/20 text-sm h-8 px-3"
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
        {/* Deals Carousel */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Today's Special Deals</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {deals.map((deal) => (
                <CarouselItem key={deal.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-orange-200 bg-orange-50">
                    <CardHeader>
                      <Badge variant="outline" className="w-fit bg-orange-100 text-orange-600 border-orange-200">
                        Limited Time
                      </Badge>
                      <CardTitle className="mt-2">{deal.title}</CardTitle>
                      <CardDescription>{deal.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        <span className="font-medium">Code:</span> {deal.code}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">At:</span> {deal.restaurant}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="border-orange-300 text-orange-600">
                        Claim Deal
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
        
        {/* Categories Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Popular Categories</h2>
            <Link href="/categories" className="flex items-center text-orange-500 hover:underline">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {popularCategories.map((category) => (
              <Link 
                key={category.id} 
                href={`/category/${category.id}`}
                className="group hover:scale-105 transition-transform"
              >
                <Card className="h-full flex flex-col items-center justify-center p-6 hover:shadow-md border-gray-200">
                  <div className="mb-3 text-orange-500 group-hover:text-orange-600 transition-colors">
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription className="mt-1 text-sm text-gray-500">
                    {category.count} restaurants
                  </CardDescription>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        
        {/* Featured Restaurants */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Restaurants</h2>
            <Link href="/restaurants" className="flex items-center text-orange-500 hover:underline">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`} className="group">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div 
                    className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300" 
                    style={{ backgroundImage: `url(${restaurant.image})` }}
                  ></div>
                  <CardHeader>
                    <CardTitle className="group-hover:text-orange-500 transition-colors">
                      {restaurant.name}
                    </CardTitle>
                    <CardDescription>{restaurant.cuisine}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {restaurant.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="text-xs bg-gray-100"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <span>{restaurant.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        
        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <MapPin className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Choose your location</h3>
              <p className="text-gray-600">Enter your address to find restaurants near you.</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <Utensils className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Order favorite food</h3>
              <p className="text-gray-600">Browse menus and add items to your cart.</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Fast delivery</h3>
              <p className="text-gray-600">Track your order in real-time until delivery.</p>
            </Card>
          </div>
        </section>
      </div>
      
      {/* CTA Section */}
      <div className="bg-orange-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to order?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Download our app for faster ordering, exclusive deals, and real-time tracking.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-black text-white hover:bg-gray-800 h-12 px-6">
              <img src="/images/app-store.svg" alt="App Store" className="h-8" />
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800 h-12 px-6">
              <img src="/images/google-play.svg" alt="Google Play" className="h-8" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}