"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Image as ImageIcon, Star } from "lucide-react";
import { supabase, resolveImageUrl } from "@/lib/supabaseClient";
import { showError, showSuccess } from "@/utils/toast";

type BannerRow = {
  id: string;
  title: string;
  description: string | null;
  image_path: string | null;
  image_url: string | null;
  active: boolean | null;
  display_order: number | null;
};

type BannerState = {
  id: string;
  title: string;
  image: string;
  image_path: string;
  image_url: string;
  description: string;
  active: boolean;
  order: number | null;
};

type BannerFormState = {
  id?: string;
  title: string;
  description: string;
  image_path: string;
  image_url: string;
  active: boolean;
  display_order: string;
};

const emptyBannerForm: BannerFormState = {
  title: "",
  description: "",
  image_path: "",
  image_url: "",
  active: true,
  display_order: "",
};

const ContentManagement: React.FC = () => {
  const [banners, setBanners] = useState<BannerState[]>([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<
    Array<{ id: string; name: string; cuisine: string; rating: number; address: string; image: string; featured: boolean; order: number | null }>
  >([]);
  const [bannerFormOpen, setBannerFormOpen] = useState(false);
  const [bannerFormMode, setBannerFormMode] = useState<"create" | "edit">("create");
  const [bannerFormValues, setBannerFormValues] = useState<BannerFormState>(emptyBannerForm);
  const [bannerFormError, setBannerFormError] = useState<string | null>(null);
  const [bannerSaving, setBannerSaving] = useState(false);
  const [bannerDeleteTarget, setBannerDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const normalizeNumber = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const loadContent = async () => {
    const [{ data: offers, error: offersError }, { data: restaurants, error: restaurantsError }] = await Promise.all([
      supabase
        .from("offers")
        .select("id, title, description, image_path, image_url, active, display_order")
        .order("display_order"),
      supabase
        .from("restaurants")
        .select("id, name, cuisine, rating, address, image_path, image_url, is_featured, featured_order")
        .order("featured_order", { ascending: true }),
    ]);

    if (offersError || restaurantsError) {
      showError("Failed to load content.");
      return;
    }

    setBanners(
      (offers as BannerRow[] | null | undefined || []).map((offer) => ({
        id: offer.id,
        title: offer.title,
        description: offer.description || "",
        image_path: offer.image_path || "",
        image_url: offer.image_url || "",
        image: resolveImageUrl("restaurants", offer.image_path, offer.image_url),
        active: offer.active ?? true,
        order: offer.display_order ?? null,
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

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      await loadContent();
    };
    loadData();
    return () => {
      active = false;
    };
  }, []);

  const handleToggleBanner = (id: string) => {
    const banner = banners.find((b) => b.id === id);
    if (!banner) return;

    const nextActive = !banner.active;
    setBanners(banners.map((b) => (b.id === id ? { ...b, active: nextActive } : b)));
    supabase
      .from("offers")
      .update({ active: nextActive })
      .eq("id", id)
      .then(({ error }) => {
        if (error) {
          showError("Unable to update banner.");
          setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, active: banner.active } : b)));
          return;
        }
        showSuccess("Banner status updated.");
      });
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
    showSuccess("Featured status updated");
  };

  const openCreateBannerForm = () => {
    setBannerFormMode("create");
    setBannerFormValues(emptyBannerForm);
    setBannerFormError(null);
    setBannerFormOpen(true);
  };

  const openEditBannerForm = (banner: BannerState) => {
    setBannerFormMode("edit");
    setBannerFormError(null);
    setBannerFormValues({
      id: banner.id,
      title: banner.title,
      description: banner.description,
      image_path: banner.image_path,
      image_url: banner.image_url,
      active: banner.active,
      display_order: banner.order !== null ? String(banner.order) : "",
    });
    setBannerFormOpen(true);
  };

  const handleSaveBanner = async () => {
    setBannerFormError(null);
    if (!bannerFormValues.title.trim()) {
      setBannerFormError("Title is required.");
      return;
    }

    setBannerSaving(true);
    const payload = {
      title: bannerFormValues.title.trim(),
      description: bannerFormValues.description.trim() || null,
      image_path: bannerFormValues.image_path.trim() || null,
      image_url: bannerFormValues.image_url.trim() || null,
      active: bannerFormValues.active,
      display_order: normalizeNumber(bannerFormValues.display_order),
    };

    if (bannerFormMode === "create") {
      const { error } = await supabase.from("offers").insert(payload);
      if (error) {
        setBannerFormError(error.message);
        showError("Unable to create banner.");
        setBannerSaving(false);
        return;
      }
      showSuccess("Banner created.");
    } else {
      const { error } = await supabase.from("offers").update(payload).eq("id", bannerFormValues.id);
      if (error) {
        setBannerFormError(error.message);
        showError("Unable to update banner.");
        setBannerSaving(false);
        return;
      }
      showSuccess("Banner updated.");
    }

    setBannerSaving(false);
    setBannerFormOpen(false);
    await loadContent();
  };

  const handleDeleteBanner = async () => {
    if (!bannerDeleteTarget) return;
    const { error } = await supabase.from("offers").delete().eq("id", bannerDeleteTarget.id);
    if (error) {
      showError("Unable to delete banner.");
      return;
    }
    showSuccess("Banner deleted.");
    setBannerDeleteTarget(null);
    await loadContent();
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
                  <Button onClick={openCreateBannerForm}>
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
                            <Button variant="ghost" size="icon" onClick={() => openEditBannerForm(banner)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setBannerDeleteTarget({ id: banner.id, title: banner.title })}
                            >
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

      <Dialog open={bannerFormOpen} onOpenChange={setBannerFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{bannerFormMode === "create" ? "Add Banner" : "Edit Banner"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Title</Label>
              <Input
                value={bannerFormValues.title}
                onChange={(event) => setBannerFormValues((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Banner title"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={bannerFormValues.description}
                onChange={(event) => setBannerFormValues((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Short banner description"
              />
            </div>
            <div className="space-y-2">
              <Label>Image path</Label>
              <Input
                value={bannerFormValues.image_path}
                onChange={(event) => setBannerFormValues((prev) => ({ ...prev, image_path: event.target.value }))}
                placeholder="placeholders/default.svg"
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={bannerFormValues.image_url}
                onChange={(event) => setBannerFormValues((prev) => ({ ...prev, image_url: event.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Display order</Label>
              <Input
                value={bannerFormValues.display_order}
                onChange={(event) => setBannerFormValues((prev) => ({ ...prev, display_order: event.target.value }))}
                type="number"
                min="0"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={bannerFormValues.active}
                onCheckedChange={(checked) => setBannerFormValues((prev) => ({ ...prev, active: checked }))}
              />
              <span className="text-sm">Active</span>
            </div>
          </div>
          {bannerFormError && <p className="text-sm text-destructive">{bannerFormError}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBannerFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBanner} disabled={bannerSaving}>
              {bannerSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(bannerDeleteTarget)} onOpenChange={(open) => !open && setBannerDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete banner?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {bannerDeleteTarget?.title || "this banner"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBanner}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ContentManagement;

