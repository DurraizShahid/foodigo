import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase, resolveImageUrl } from "@/lib/supabaseClient";

type CategoryRow = {
  id: string;
  name: string;
  image_path: string | null;
  image_url: string | null;
};

type RestaurantRow = {
  id: string;
  name: string;
  cuisine: string | null;
  rating: number | null;
  delivery_time: string | null;
  price_range: string | null;
  distance_km: number | null;
  tags: string[] | null;
  image_path: string | null;
  image_url: string | null;
  description: string | null;
  address: string | null;
};

const Category = () => {
  const { name = "" } = useParams();
  const [category, setCategory] = useState<{ id: string; name: string; image: string } | null>(null);
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
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadCategory = async () => {
      setLoading(true);
      const decoded = decodeURIComponent(name);
      const { data: categoryRow, error: categoryError } = await supabase
        .from("categories")
        .select("id, name, image_path, image_url")
        .ilike("name", decoded)
        .maybeSingle();

      if (!active) return;
      if (categoryError || !categoryRow) {
        setCategory(null);
        setRestaurants([]);
        setLoading(false);
        return;
      }

      const categoryData = categoryRow as CategoryRow;
      setCategory({
        id: categoryData.id,
        name: categoryData.name,
        image: resolveImageUrl("restaurants", categoryData.image_path, categoryData.image_url),
      });

      const { data: categoryRestaurants, error: restaurantsError } = await supabase
        .from("restaurant_categories")
        .select(
          "restaurant:restaurants (id, name, cuisine, rating, delivery_time, price_range, distance_km, tags, image_path, image_url, description, address)"
        )
        .eq("category_id", categoryData.id);

      if (!active) return;
      if (restaurantsError) {
        setRestaurants([]);
        setLoading(false);
        return;
      }

      const mappedRestaurants =
        (categoryRestaurants || [])
          .map((row) => row.restaurant as RestaurantRow | null)
          .filter((restaurant): restaurant is RestaurantRow => Boolean(restaurant))
          .map((restaurant) => ({
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
          })) || [];

      setRestaurants(mappedRestaurants);
      setLoading(false);
    };

    loadCategory();
    return () => {
      active = false;
    };
  }, [name]);

  const header = useMemo(() => {
    if (!category) return null;
    return (
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <img
          src={category.image}
          alt={category.name}
          className="h-32 w-full rounded-2xl object-cover md:h-24 md:w-40"
        />
        <div>
          <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
          <p className="text-muted-foreground">Explore restaurants curated for this category.</p>
        </div>
      </div>
    );
  }, [category]);

  return (
    <Layout>
      <div className="space-y-8">
        {header}
        {loading && <p className="text-muted-foreground">Loading category...</p>}
        {!loading && !category && <p className="text-muted-foreground">Category not found.</p>}
        {!loading && category && restaurants.length === 0 && (
          <p className="text-muted-foreground">No restaurants are assigned to this category yet.</p>
        )}
        {!loading && restaurants.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <Link to={`/restaurant/${restaurant.id}`} key={restaurant.id}>
                <Card className="group overflow-hidden rounded-2xl border border-border/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
                        {restaurant.cuisine || "Cuisine"}
                      </div>
                    </div>
                    <div className="space-y-3 p-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{restaurant.name}</h3>
                        <p className="text-sm text-muted-foreground">{restaurant.address}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary">⭐ {restaurant.rating.toFixed(1)}</Badge>
                        <Badge variant="secondary">{restaurant.deliveryTime || "Delivery"}</Badge>
                        <Badge variant="secondary">{restaurant.priceRange || "$$"}</Badge>
                      </div>
                      {restaurant.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{restaurant.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Category;
