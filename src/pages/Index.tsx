import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Layout from "@/components/Layout";
import { categories, restaurants } from "@/data/dummyData";
import OfferCarousel from "@/components/OfferCarousel"; // Import the new component

const Index = () => {
  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-orange-500 text-white rounded-xl p-8 md:p-16 overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-087700f9cc28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnl8ZW58MHwwfHx8MTcxOTk0NTYxNHww&ixlib=rb-4.0.3&q=80&w=1080')" }}></div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
              Your City's Best Food, Delivered Fast!
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Order from your favorite local restaurants with just a few taps.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 rounded-full px-8 py-3 text-lg font-semibold shadow-md">
              Explore Restaurants
            </Button>
          </div>
        </section>

        {/* Offer Banners Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Special Offers</h2>
          <OfferCarousel />
        </section>

        {/* Categories Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Popular Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link to={`/category/${category.name.toLowerCase()}`} key={category.id}>
                <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-0">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3 bg-card text-card-foreground">
                      <h3 className="text-md font-semibold">{category.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Restaurants Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-foreground text-center">Featured Restaurants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Link to={`/restaurant/${restaurant.id}`} key={restaurant.id}>
                <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-0">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 space-y-2 bg-card text-card-foreground">
                      <h3 className="text-xl font-bold">{restaurant.name}</h3>
                      <p className="text-muted-foreground text-sm">{restaurant.cuisine}</p>
                      <div className="flex items-center gap-1 text-sm text-yellow-500">
                        <Star className="h-4 w-4 fill-yellow-500" />
                        <span>{restaurant.rating}</span>
                        <span className="text-muted-foreground ml-2">({restaurant.deliveryTime})</span>
                      </div>
                      <Button className="w-full mt-2 rounded-lg bg-primary hover:bg-primary/90">
                        View Menu
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Map Integration Placeholder */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Find Restaurants Near You</h2>
          <div className="bg-gray-200 dark:bg-gray-800 rounded-xl h-64 flex items-center justify-center text-muted-foreground text-lg">
            <p>Map integration coming soon! (Placeholder)</p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;