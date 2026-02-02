"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const SmartRecommendations: React.FC = () => {
  const [collections, setCollections] = React.useState<Array<{ id: string; title: string; subtitle: string | null }>>([]);
  const [items, setItems] = React.useState<
    Array<{ id: string; collection_id: string; restaurant_id: string; menu_item_id: string | null; name: string | null; eta: string | null }>
  >([]);
  const [restaurants, setRestaurants] = React.useState<Array<{ id: string; name: string; delivery_time: string | null }>>([]);

  React.useEffect(() => {
    let active = true;
    const loadData = async () => {
      const [{ data: collectionsData }, { data: itemsData }, { data: restaurantData }] = await Promise.all([
        supabase.from("smart_collections").select("id, title, subtitle"),
        supabase.from("smart_collection_items").select("id, collection_id, restaurant_id, menu_item_id, name, eta"),
        supabase.from("restaurants").select("id, name, delivery_time"),
      ]);
      if (!active) return;
      setCollections(collectionsData || []);
      setItems(itemsData || []);
      setRestaurants(restaurantData || []);
    };
    loadData();
    return () => {
      active = false;
    };
  }, []);

  if (!collections.length) return null;

  const restaurantMap = restaurants.reduce<Record<string, (typeof restaurants)[number]>>((acc, restaurant) => {
    acc[restaurant.id] = restaurant;
    return acc;
  }, {});

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm uppercase text-muted-foreground tracking-wide">AI Playlists</p>
        <h2 className="text-3xl font-bold text-foreground">Smart Collections</h2>
        <p className="text-muted-foreground">Curated combos based on your ordering pattern.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {collections.map((collection) => (
          <Card key={collection.id}>
            <CardHeader>
              <CardTitle>{collection.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{collection.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {items
                .filter((item) => item.collection_id === collection.id)
                .map((item) => {
                const restaurant = restaurantMap[item.restaurant_id];
                if (!restaurant) return null;
                return (
                  <Link
                    key={item.id}
                    to={`/restaurant/${restaurant.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {restaurant.name} · {restaurant.delivery_time}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SmartRecommendations;

