"use client";

import React from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { restaurants } from "@/data/dummyData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock, MapPin } from "lucide-react";

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const restaurant = restaurants.find((r) => r.id === id);

  if (!restaurant) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">Restaurant Not Found</h1>
          <p className="text-muted-foreground">The restaurant you are looking for does not exist.</p>
          <Button asChild className="mt-6">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Restaurant Header */}
        <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-lg">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex items-end">
            <h1 className="text-4xl font-bold text-white">{restaurant.name}</h1>
          </div>
        </div>

        {/* Restaurant Info */}
        <Card className="bg-card text-card-foreground shadow-md">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              <span className="text-lg font-semibold">{restaurant.rating}</span>
              <span className="text-muted-foreground">({restaurant.cuisine})</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-semibold">{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-semibold">{restaurant.address}</span>
            </div>
            <p className="col-span-full text-muted-foreground mt-2">{restaurant.description}</p>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-foreground">Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurant.menu.map((item) => (
              <Card key={item.id} className="overflow-hidden rounded-xl shadow-md">
                <CardContent className="p-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 space-y-2 bg-card text-card-foreground">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-semibold">${item.price.toFixed(2)}</span>
                      <Button className="rounded-lg bg-primary hover:bg-primary/90">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default RestaurantDetail;