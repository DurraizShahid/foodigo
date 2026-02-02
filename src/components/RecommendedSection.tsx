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
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Personalized Picks
          </span>
          <h2 className="text-3xl font-bold text-foreground">Recommended For You</h2>
          <p className="text-sm text-muted-foreground">
            Hand-picked lineups based on your cravings and recent activity.
          </p>
        </div>
        <Button variant="outline" className="hidden md:inline-flex rounded-full">
          Refresh
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {seeds.map((seed) => {
          const matchedRestaurantIds = seedRestaurants.filter((link) => link.seed_id === seed.id).map((link) => link.restaurant_id);
          const matchedRestaurants = matchedRestaurantIds.map((id) => restaurantMap[id]).filter(Boolean);
          return (
            <Card key={seed.id} className="overflow-hidden rounded-2xl border border-border/60 shadow-sm">
              <CardContent className="p-0">
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase text-muted-foreground tracking-wide">{seed.title}</p>
                      <p className="text-lg font-semibold">{seed.description}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      Curated
                    </span>
                  </div>
                  <div className="space-y-3">
                    {matchedRestaurants.map((restaurant) => (
                      <Link
                        to={`/restaurant/${restaurant.id}`}
                        key={restaurant.id}
                        className="group flex items-center gap-3 rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/50"
                      >
                        <img
                          src={resolveImageUrl("restaurants", restaurant.image_path, restaurant.image_url)}
                          alt={restaurant.name}
                          className="h-14 w-14 rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{restaurant.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {restaurant.cuisine} · {restaurant.rating} ⭐ · {restaurant.delivery_time}
                          </p>
                        </div>
                        <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                          View
                        </span>
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

