"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Image as ImageIcon, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase, resolveImageUrl } from "@/lib/supabaseClient";

const ContentManagement: React.FC = () => {
  const [banners, setBanners] = useState<Array<{ id: string; title: string; image: string; active: boolean; order: number }>>([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<
    Array<{ id: string; name: string; cuisine: string; rating: number; address: string; image: string; featured: boolean; order: number | null }>
  >([]);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      const [{ data: offers }, { data: restaurants }] = await Promise.all([
        supabase.from("offers").select("id, title, image_path, image_url, active, display_order").order("display_order"),
        supabase
          .from("restaurants")
          .select("id, name, cuisine, rating, address, image_path, image_url, is_featured, featured_order")
          .order("featured_order", { ascending: true }),
      ]);
      if (!active) return;
      setBanners(
        (offers || []).map((offer) => ({
          id: offer.id,
          title: offer.title,
          image: resolveImageUrl("restaurants", offer.image_path, offer.image_url),
          active: offer.active,
          order: offer.display_order,
        }))
      );
      setFeaturedRestaurants(
        (restaurants || []).map((restaurant) => ({
          id: restaurant.id,
          name: restaurant.name,
          cuisine: restaurant.cuisine || "",
          rating: Number(restaurant.rating || 0),
          address: restaurant.address || "",
          image: resolveImageUrl("restaurants", restaurant.image_path, restaurant.image_url),
          featured: restaurant.is_featured,
          order: restaurant.featured_order,
        }))
      );
    };
    loadData();
    return () => {
      active = false;
    };
  }, []);

  const handleToggleBanner = (id: string) => {
    setBanners(banners.map((b) => (b.id === id ? { ...b, active: !b.active } : b)));
    const banner = banners.find((b) => b.id === id);
    if (banner) {
      supabase.from("offers").update({ active: !banner.active }).eq("id", id);
    }
    toast.success("Banner status updated");
  };

  const handleToggleFeatured = (id: string) => {
    setFeaturedRestaurants(
      featuredRestaurants.map((r) => (r.id === id ? { ...r, featured: !r.featured } : r))
    );
    const restaurant = featuredRestaurants.find((r) => r.id === id);
    if (restaurant) {
      supabase
        .from("restaurants")
        .update({ is_featured: !restaurant.featured, featured_order: restaurant.featured ? null : restaurant.order || 1 })
        .eq("id", id);
    }
    toast.success("Featured status updated");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Content Management</h1>
        </div>

        <Tabs defaultValue="banners" className="w-full">
          <TabsList>
            <TabsTrigger value="banners">Promotional Banners</TabsTrigger>
            <TabsTrigger value="featured">Featured Restaurants</TabsTrigger>
          </TabsList>

          <TabsContent value="banners" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Homepage Banners</CardTitle>
                    <CardDescription>Manage promotional banners displayed on the homepage</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Banner
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {banners.map((banner) => (
                    <Card key={banner.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={banner.image}
                              alt={banner.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{banner.title}</h3>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={banner.active}
                                  onCheckedChange={() => handleToggleBanner(banner.id)}
                                />
                                <Badge variant={banner.active ? "default" : "secondary"}>
                                  {banner.active ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">Order: {banner.order}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="featured" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Featured Restaurants</CardTitle>
                    <CardDescription>
                      Select restaurants to feature prominently on the homepage
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Cuisine</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {featuredRestaurants.map((restaurant) => (
                      <TableRow key={restaurant.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={restaurant.image}
                              alt={restaurant.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-semibold">{restaurant.name}</p>
                              <p className="text-sm text-muted-foreground">{restaurant.address}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{restaurant.cuisine}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span>{restaurant.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={restaurant.featured}
                            onCheckedChange={() => handleToggleFeatured(restaurant.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ContentManagement;

