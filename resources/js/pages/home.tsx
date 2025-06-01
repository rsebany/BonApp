import { type SharedData } from '@/types/index';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Utensils, Star, Clock, MapPin } from 'lucide-react';

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
      image: "/images/burger.jpg"
    },
    {
      id: 2,
      name: "Pizza Heaven",
      cuisine: "Italian",
      rating: 4.7,
      deliveryTime: "25-35 min",
      image: "/images/pizza.jpg"
    },
    {
      id: 3,
      name: "Sushi World",
      cuisine: "Japanese",
      rating: 4.8,
      deliveryTime: "30-40 min",
      image: "/images/sushi.jpg"
    },
  ];

  const popularCategories = [
    { id: 1, name: "Burgers", icon: <Utensils className="w-6 h-6" /> },
    { id: 2, name: "Pizza", icon: <Utensils className="w-6 h-6" /> },
    { id: 3, name: "Sushi", icon: <Utensils className="w-6 h-6" /> },
    { id: 4, name: "Pasta", icon: <Utensils className="w-6 h-6" /> },
    { id: 5, name: "Salads", icon: <Utensils className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Food Delivery App" />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Delicious food delivered to your door</h1>
          <p className="text-xl mb-8">Order from your favorite restaurants with just a few clicks</p>
          
          <div className="max-w-2xl mx-auto relative">
            <Input 
              type="text" 
              placeholder="Search for restaurants or cuisines..." 
              className="pl-12 pr-4 py-6 rounded-full border-none shadow-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 hover:bg-amber-700">
              Search
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {popularCategories.map((category) => (
              <Link 
                key={category.id} 
                href={`/category/${category.id}`}
                className="hover:scale-105 transition-transform"
              >
                <Card className="h-full flex flex-col items-center justify-center p-6 hover:shadow-md">
                  <div className="mb-3 text-orange-500">
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        
        {/* Featured Restaurants */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Restaurants</h2>
            <Link href="/restaurants" className="text-orange-500 hover:underline">
              View all
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${restaurant.image})` }}></div>
                  <CardHeader>
                    <CardTitle>{restaurant.name}</CardTitle>
                    <CardDescription>{restaurant.cuisine}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-4 h-4 fill-current mr-1" />
                        <span>{restaurant.rating}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        
        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Choose your location</h3>
              <p className="text-gray-600">Enter your address to find restaurants near you.</p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Order favorite food</h3>
              <p className="text-gray-600">Browse menus and add items to your cart.</p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Fast delivery</h3>
              <p className="text-gray-600">Track your order in real-time until delivery.</p>
            </Card>
          </div>
        </section>
      </div>
      
      {/* CTA Section */}
      <div className="bg-orange-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to order?</h2>
          <p className="text-xl mb-8">Download our app for faster ordering and exclusive deals.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-black text-white hover:bg-gray-800">
              Download on the App Store
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800">
              Get it on Google Play
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}