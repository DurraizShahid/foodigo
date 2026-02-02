"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { supabase, resolveImageUrl } from "@/lib/supabaseClient";

const RecommendedSection: React.FC = () => {
  const [seeds, setSeeds] = React.useState<Array<{ id: string; title: string; description: string | null }>>([]);
  const [restaurants, setRestaurants] = React.useState<
    Array<{ id: string; name: string; cuisine: string | null; rating: number | null; delivery_time: string | null; image_path: string | null; image_url: string | null }>
  >([]);
  const [seedRestaurants, setSeedRestaurants] = React.useState<Array<{ seed_id: string; restaurant_id: string }>>([]);

  React.useEffect(() => {
    let active = true;
    const loadData = async () => {
      const [{ data: seedData }, { data: restaurantData }, { data: linkData }] = await Promise.all([
        supabase.from("recommendation_seeds").select("id, title, description"),
        supabase.from("restaurants").select("id, name, cuisine, rating, delivery_time, image_path, image_url"),
        supabase.from("recommendation_seed_restaurants").select("seed_id, restaurant_id"),
      ]);
      if (!active) return;
      setSeeds(seedData || []);
      setRestaurants(restaurantData || []);
      setSeedRestaurants(linkData || []);
    };
    loadData();
    return () => {
      active = false;
    };
  }, []);

  if (!seeds.length) return null;

  const restaurantMap = restaurants.reduce<Record<string, (typeof restaurants)[number]>>((acc, restaurant) => {
    acc[restaurant.id] = restaurant;
    return acc;
  }, {});

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase text-muted-foreground tracking-wide">Personalized Picks</p>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Recommended For You
          </h2>
        </div>
        <Button variant="ghost" className="hidden md:inline-flex">
          Refresh
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {seeds.map((seed) => {
          const matchedRestaurantIds = seedRestaurants.filter((link) => link.seed_id === seed.id).map((link) => link.restaurant_id);
          const matchedRestaurants = matchedRestaurantIds.map((id) => restaurantMap[id]).filter(Boolean);
          return (
            <Card key={seed.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground tracking-wide">{seed.title}</p>
                    <p className="text-lg font-semibold">{seed.description}</p>
                  </div>
                  <div className="space-y-3">
                    {matchedRestaurants.map((restaurant) => (
                      <Link
                        to={`/restaurant/${restaurant.id}`}
                        key={restaurant.id}
                        className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <img
                          src={resolveImageUrl("restaurants", restaurant.image_path, restaurant.image_url)}
                          alt={restaurant.name}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{restaurant.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {restaurant.cuisine} · {restaurant.rating} ⭐ · {restaurant.delivery_time}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default RecommendedSection;

