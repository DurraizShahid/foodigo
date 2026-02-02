"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock, MapPin } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { MenuItemCustomization, CustomizedMenuItem } from "@/components/MenuItemCustomization";
import { RatingsAndReviews } from "@/components/RatingsAndReviews";
import SocialShareButtons from "@/components/SocialShareButtons";
import { supabase, resolveImageUrl } from "@/lib/supabaseClient";

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [restaurant, setRestaurant] = useState<{
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    deliveryTime: string;
    address: string;
    description: string;
    image: string;
    menu: Array<{ id: string; name: string; price: number; description: string; image: string; imagePath?: string | null; imageUrl?: string | null }>;
  } | null>(null);

  useEffect(() => {
    let active = true;
    const loadRestaurant = async () => {
      if (!id) return;
      const { data } = await supabase
        .from("restaurants")
        .select("id, name, cuisine, rating, delivery_time, address, description, image_path, image_url, menu_items(id, name, price, description, image_path, image_url)")
        .eq("id", id)
        .maybeSingle();
      if (!active) return;
      if (!data) {
        setRestaurant(null);
        return;
      }
      setRestaurant({
        id: data.id,
        name: data.name,
        cuisine: data.cuisine || "",
        rating: Number(data.rating || 0),
        deliveryTime: data.delivery_time || "",
        address: data.address || "",
        description: data.description || "",
        image: resolveImageUrl("restaurants", data.image_path, data.image_url),
        menu: (data.menu_items || []).map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          description: item.description || "",
          image: resolveImageUrl("menu-items", item.image_path, item.image_url),
          imagePath: item.image_path,
          imageUrl: item.image_url,
        })),
      });
    };
    loadRestaurant();
    return () => {
      active = false;
    };
  }, [id]);

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
            <div className="md:col-span-full flex flex-col gap-2">
              <p className="text-muted-foreground">{restaurant.description}</p>
              <SocialShareButtons restaurantName={restaurant.name} />
            </div>
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
                      <Button
                        className="rounded-lg bg-primary hover:bg-primary/90"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsCustomizationOpen(true);
                        }}
                      >
                        Customize & Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Ratings & Reviews */}
        <section>
          <RatingsAndReviews restaurantId={restaurant.id} type="restaurant" />
        </section>
      </div>

      {selectedItem && (
        <MenuItemCustomization
          item={selectedItem}
          isOpen={isCustomizationOpen}
          onClose={() => {
            setIsCustomizationOpen(false);
            setSelectedItem(null);
          }}
          onAddToCart={(customizedItem: CustomizedMenuItem) => {
            // Add base item with quantity
            for (let i = 0; i < customizedItem.quantity; i++) {
              addToCart({
                id: selectedItem.id,
                name: selectedItem.name,
                price: customizedItem.price,
                image: selectedItem.image,
                description: selectedItem.description,
                imagePath: selectedItem.imagePath,
                imageUrl: selectedItem.imageUrl,
              });
            }
          }}
        />
      )}
    </Layout>
  );
};

export default RestaurantDetail;