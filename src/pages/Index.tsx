import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Layout from "@/components/Layout";
import OfferCarousel from "@/components/OfferCarousel";
import { RestaurantFilters, FilterState } from "@/components/RestaurantFilters";
import RecommendedSection from "@/components/RecommendedSection";
import SmartRecommendations from "@/components/SmartRecommendations";
import VoiceOrderingCard from "@/components/VoiceOrderingCard";
import { useState, useMemo, useEffect } from "react";
import { supabase, resolveImageUrl } from "@/lib/supabaseClient";

const Index = () => {
  const [categories, setCategories] = useState<Array<{ id: string; name: string; image: string }>>([]);
  const [restaurants, setRestaurants] = useState<
    Array<{
      id: string;
      name: string;
      cuisine: string;
      rating: number;
      deliveryTime: string;
      priceRange: string;
      distanceKm: number;
      tags: string[];
      image: string;
      description: string;
      address: string;
      menu: Array<{ id: string; name: string; price: number; calories: number | null; description: string; image: string }>;
    }>
  >([]);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      const [{ data: categoryRows }, { data: restaurantRows }] = await Promise.all([
        supabase.from("categories").select("id, name, image_path, image_url").order("name"),
        supabase
          .from("restaurants")
          .select("id, name, cuisine, rating, delivery_time, price_range, distance_km, tags, image_path, image_url, description, address, menu_items(id, name, price, calories, description, image_path, image_url)")
          .order("rating", { ascending: false }),
      ]);

      if (!active) return;

      setCategories(
        (categoryRows || []).map((category) => ({
          id: category.id,
          name: category.name,
          image: resolveImageUrl("restaurants", category.image_path, category.image_url),
        }))
      );

      setRestaurants(
        (restaurantRows || []).map((restaurant) => ({
          id: restaurant.id,
          name: restaurant.name,
          cuisine: restaurant.cuisine || "",
          rating: Number(restaurant.rating || 0),
          deliveryTime: restaurant.delivery_time || "",
          priceRange: restaurant.price_range || "",
          distanceKm: Number(restaurant.distance_km || 0),
          tags: restaurant.tags || [],
          image: resolveImageUrl("restaurants", restaurant.image_path, restaurant.image_url),
          description: restaurant.description || "",
          address: restaurant.address || "",
          menu: (restaurant.menu_items || []).map((item) => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            calories: item.calories,
            description: item.description || "",
            image: resolveImageUrl("menu-items", item.image_path, item.image_url),
          })),
        }))
      );
    };
    loadData();
    return () => {
      active = false;
    };
  }, []);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    cuisine: "all",
    minRating: 0,
    maxPrice: 100,
    maxDistance: 10,
    dietary: [],
    sortBy: "rating",
  });

  const filteredRestaurants = useMemo(() => {
    let filtered = [...restaurants];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          r.cuisine.toLowerCase().includes(searchLower) ||
          r.menu.some((m) => m.name.toLowerCase().includes(searchLower))
      );
    }

    // Cuisine filter
    if (filters.cuisine !== "all") {
      filtered = filtered.filter((r) => r.cuisine.toLowerCase() === filters.cuisine);
    }

    // Rating filter
    filtered = filtered.filter((r) => r.rating >= filters.minRating);

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price":
          return (
            a.menu.reduce((sum, m) => sum + m.price, 0) / a.menu.length -
            b.menu.reduce((sum, m) => sum + m.price, 0) / b.menu.length
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [filters, restaurants]);

  return (
    <Layout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl bg-slate-950 text-white shadow-xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwzfHxmYXN0JTIwZm9vZHxlbnwwfDF8fHwxNzE5OTQ1NjE0fDA&ixlib=rb-4.0.3&q=80&w=1400')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/30" />
          <div className="absolute -top-20 right-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 left-12 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl" />
          <div className="relative z-10 grid gap-10 px-6 py-14 md:grid-cols-[1.15fr_0.85fr] md:px-12 md:py-20">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Live delivery tracking in your city
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Crave-worthy meals, delivered in a flash.
              </h1>
              <p className="text-lg md:text-xl text-white/85">
                Discover curated restaurants, real-time ETAs, and personalized picks made just for you.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg" className="rounded-full px-8 text-base font-semibold shadow-lg">
                  Explore Restaurants
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10"
                >
                  Browse Categories
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "4.9 average rating", value: "2K+ reviews" },
                  { label: "30-40 min delivery", value: "Across the city" },
                  { label: "700+ partner kitchens", value: "Fresh daily menus" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <p className="text-sm text-white/70">{stat.label}</p>
                    <p className="text-lg font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.2em] text-white/60">Today’s Pick</p>
                <p className="mt-2 text-2xl font-semibold">Nori & Ember Ramen Bar</p>
                <p className="mt-2 text-sm text-white/70">Smoky tonkotsu, handmade noodles, 18 min delivery</p>
                <div className="mt-4 flex items-center gap-3 text-sm text-white/80">
                  <span className="rounded-full bg-white/15 px-3 py-1">4.8 ★</span>
                  <span className="rounded-full bg-white/15 px-3 py-1">Free delivery</span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.2em] text-white/60">Fastest Route</p>
                <p className="mt-2 text-2xl font-semibold">15 min to your door</p>
                <p className="mt-2 text-sm text-white/70">AI-optimized routing keeps your food hot and fresh.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Offer Banners Section */}
        <section className="text-center">
          <div className="mx-auto mb-6 max-w-2xl space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Special Offers</h2>
            <p className="text-muted-foreground">Limited-time deals from your favorite spots, updated daily.</p>
          </div>
          <OfferCarousel />
        </section>

        <RecommendedSection />
        <SmartRecommendations />

        {/* Categories Section */}
        <section className="text-center">
          <div className="mx-auto mb-8 max-w-2xl space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Popular Categories</h2>
            <p className="text-muted-foreground">A quick shortcut to your cravings. Tap any category to dive in.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories.map((category) => (
              <Link to={`/category/${category.name.toLowerCase()}`} key={category.id}>
                <Card className="group overflow-hidden rounded-2xl border border-border/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
                        {category.name}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Restaurant Filters */}
        <section>
          <RestaurantFilters onFilterChange={setFilters} />
        </section>

        {/* Featured Restaurants Section */}
        <section>
          <div className="mx-auto mb-8 max-w-2xl text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              {filters.search ? "Search Results" : "Featured Restaurants"}
            </h2>
            <p className="text-muted-foreground">
              Chef-driven menus, trending picks, and local legends curated for you.
            </p>
          </div>
          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No restaurants found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRestaurants.map((restaurant) => (
                <Link to={`/restaurant/${restaurant.id}`} key={restaurant.id}>
                  <Card className="group overflow-hidden rounded-2xl border border-border/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
                          {restaurant.priceRange || "Popular"}
                        </div>
                      </div>
                      <div className="space-y-3 p-5 bg-card text-card-foreground">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-bold">{restaurant.name}</h3>
                            <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                          </div>
                          <div className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            <span>{restaurant.rating}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                            {restaurant.deliveryTime || "Fast delivery"}
                          </span>
                          <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                            {restaurant.distanceKm ? `${restaurant.distanceKm.toFixed(1)} km` : "Nearby"}
                          </span>
                          <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                            {restaurant.tags?.[0] || "Chef's choice"}
                          </span>
                        </div>
                        <Button className="w-full rounded-lg bg-primary hover:bg-primary/90">
                          View Menu
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Map Integration Placeholder */}
        <section className="grid gap-6 md:grid-cols-2 items-start">
          <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm">
            <h2 className="text-3xl font-bold text-foreground">Find Restaurants Near You</h2>
            <p className="text-muted-foreground">Pinpoint cravings with smart distance sorting and live ETAs.</p>
            <div className="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-lg text-muted-foreground dark:from-slate-900 dark:to-slate-800">
              <p>Map integration coming soon! (Placeholder)</p>
            </div>
          </div>
          <VoiceOrderingCard />
        </section>
      </div>
    </Layout>
  );
};

export default Index;