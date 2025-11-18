"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { smartCollections, restaurants } from "@/data/dummyData";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SmartRecommendations: React.FC = () => {
  if (!smartCollections.length) return null;

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm uppercase text-muted-foreground tracking-wide">AI Playlists</p>
        <h2 className="text-3xl font-bold text-foreground">Smart Collections</h2>
        <p className="text-muted-foreground">Curated combos based on your ordering pattern.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {smartCollections.map((collection) => (
          <Card key={collection.id}>
            <CardHeader>
              <CardTitle>{collection.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{collection.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {collection.items.map((item) => {
                const restaurant = restaurants.find((r) => r.id === item.restaurantId);
                if (!restaurant) return null;
                return (
                  <Link
                    key={item.menuItemId}
                    to={`/restaurant/${restaurant.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {restaurant.name} · {restaurant.deliveryTime}
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

