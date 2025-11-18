"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { recommendationSeeds, restaurants } from "@/data/dummyData";
import { Sparkles } from "lucide-react";

const RecommendedSection: React.FC = () => {
  if (!recommendationSeeds.length) return null;

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
        {recommendationSeeds.map((seed) => {
          const matchedRestaurants = restaurants.filter((restaurant) => seed.restaurantIds.includes(restaurant.id));
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
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{restaurant.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {restaurant.cuisine} · {restaurant.rating} ⭐ · {restaurant.deliveryTime}
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

