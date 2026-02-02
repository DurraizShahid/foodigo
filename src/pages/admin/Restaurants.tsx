"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { supabase, resolveImageUrl } from "@/lib/supabaseClient";
import { showError, showSuccess } from "@/utils/toast";

type RestaurantRow = {
  id: string;
  name: string;
  cuisine: string | null;
  rating: number | null;
  image_path: string | null;
  image_url: string | null;
  address: string | null;
  owner_id: string | null;
  is_featured: boolean | null;
  featured_order: number | null;
  delivery_time: string | null;
  price_range: string | null;
  distance_km: number | null;
  tags: string[] | null;
  description: string | null;
};

type RestaurantFormState = {
  id?: string;
  name: string;
  cuisine: string;
  rating: string;
  address: string;
  owner_id: string;
  image_path: string;
  image_url: string;
  is_featured: boolean;
  featured_order: string;
  delivery_time: string;
  price_range: string;
  distance_km: string;
  tags: string;
  description: string;
  category_ids: string[];
};

const emptyForm: RestaurantFormState = {
  name: "",
  cuisine: "",
  rating: "0",
  address: "",
  owner_id: "",
  image_path: "",
  image_url: "",
  is_featured: false,
  featured_order: "",
  delivery_time: "",
  price_range: "",
  distance_km: "",
  tags: "",
  description: "",
  category_ids: [],
};

const Restaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<
    Array<{ id: string; name: string; cuisine: string; rating: number; image: string; address: string }>
  >([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formValues, setFormValues] = useState<RestaurantFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  const normalizeNumber = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const buildPayload = () => ({
    name: formValues.name.trim(),
    cuisine: formValues.cuisine.trim() || null,
    rating: normalizeNumber(formValues.rating),
    address: formValues.address.trim() || null,
    owner_id: formValues.owner_id.trim() || null,
    image_path: formValues.image_path.trim() || null,
    image_url: formValues.image_url.trim() || null,
    is_featured: formValues.is_featured,
    featured_order: normalizeNumber(formValues.featured_order),
    delivery_time: formValues.delivery_time.trim() || null,
    price_range: formValues.price_range.trim() || null,
    distance_km: normalizeNumber(formValues.distance_km),
    tags: formValues.tags.trim()
      ? formValues.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : null,
    description: formValues.description.trim() || null,
  });

  const fetchRestaurants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("restaurants")
      .select(
        "id, name, cuisine, rating, image_path, image_url, address, owner_id, is_featured, featured_order, delivery_time, price_range, distance_km, tags, description"
      )
      .order("name");

    if (error) {
      showError("Failed to load restaurants.");
      setLoading(false);
      return;
    }

    setRestaurants(
      (data as RestaurantRow[]).map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        cuisine: restaurant.cuisine || "",
        rating: Number(restaurant.rating || 0),
        address: restaurant.address || "",
        image: resolveImageUrl("restaurants", restaurant.image_path, restaurant.image_url),
      }))
    );
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("id, name").order("name");
    if (error) {
      showError("Failed to load categories.");
      return;
    }
    setCategories((data || []) as Array<{ id: string; name: string }>);
  };

  useEffect(() => {
    let active = true;
    const loadRestaurants = async () => {
      await fetchRestaurants();
    };
    if (active) {
      loadRestaurants();
      fetchCategories();
    }
    return () => {
      active = false;
    };
  }, []);

  const filteredRestaurants = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return restaurants;
    return restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(normalized) ||
        restaurant.cuisine.toLowerCase().includes(normalized) ||
        restaurant.address.toLowerCase().includes(normalized)
    );
  }, [restaurants, query]);

  const openCreateForm = () => {
    setFormMode("create");
    setFormValues(emptyForm);
    setFormError(null);
    setFormOpen(true);
  };

  const openEditForm = async (restaurantId: string) => {
    setFormMode("edit");
    setFormError(null);
    const { data, error } = await supabase
      .from("restaurants")
      .select(
        "id, name, cuisine, rating, image_path, image_url, address, owner_id, is_featured, featured_order, delivery_time, price_range, distance_km, tags, description"
      )
      .eq("id", restaurantId)
      .single();

    if (error || !data) {
      showError("Unable to load restaurant details.");
      return;
    }

    const restaurant = data as RestaurantRow;
    const { data: categoryRows } = await supabase
      .from("restaurant_categories")
      .select("category_id")
      .eq("restaurant_id", restaurantId);

    setFormValues({
      id: restaurant.id,
      name: restaurant.name || "",
      cuisine: restaurant.cuisine || "",
      rating: restaurant.rating !== null ? String(restaurant.rating) : "",
      address: restaurant.address || "",
      owner_id: restaurant.owner_id || "",
      image_path: restaurant.image_path || "",
      image_url: restaurant.image_url || "",
      is_featured: Boolean(restaurant.is_featured),
      featured_order: restaurant.featured_order !== null ? String(restaurant.featured_order) : "",
      delivery_time: restaurant.delivery_time || "",
      price_range: restaurant.price_range || "",
      distance_km: restaurant.distance_km !== null ? String(restaurant.distance_km) : "",
      tags: restaurant.tags?.join(", ") || "",
      description: restaurant.description || "",
      category_ids: (categoryRows || []).map((row) => row.category_id),
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    setFormError(null);
    if (!formValues.name.trim()) {
      setFormError("Name is required.");
      return;
    }

    setSaving(true);
    const payload = buildPayload();

    if (formMode === "create") {
      const { data, error } = await supabase.from("restaurants").insert(payload).select("id").single();
      if (error) {
        setFormError(error.message);
        showError("Unable to create restaurant.");
        setSaving(false);
        return;
      }
      const newRestaurantId = data?.id;
      if (newRestaurantId) {
        const categoryInsert = formValues.category_ids.map((categoryId) => ({
          restaurant_id: newRestaurantId,
          category_id: categoryId,
        }));
        if (categoryInsert.length > 0) {
          const { error: categoryError } = await supabase.from("restaurant_categories").insert(categoryInsert);
          if (categoryError) {
            showError("Restaurant created, but categories failed to save.");
          }
        }
      }
      showSuccess("Restaurant created.");
    } else {
      const { error } = await supabase
        .from("restaurants")
        .update(payload)
        .eq("id", formValues.id);
      if (error) {
        setFormError(error.message);
        showError("Unable to update restaurant.");
        setSaving(false);
        return;
      }
      const restaurantId = formValues.id;
      if (restaurantId) {
        const { error: deleteError } = await supabase
          .from("restaurant_categories")
          .delete()
          .eq("restaurant_id", restaurantId);
        if (!deleteError && formValues.category_ids.length > 0) {
          const categoryInsert = formValues.category_ids.map((categoryId) => ({
            restaurant_id: restaurantId,
            category_id: categoryId,
          }));
          const { error: categoryError } = await supabase.from("restaurant_categories").insert(categoryInsert);
          if (categoryError) {
            showError("Restaurant updated, but categories failed to save.");
          }
        }
      }
      showSuccess("Restaurant updated.");
    }

    setSaving(false);
    setFormOpen(false);
    await fetchRestaurants();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("restaurants").delete().eq("id", deleteTarget.id);
    if (error) {
      showError("Unable to delete restaurant.");
      return;
    }
    showSuccess("Restaurant deleted.");
    setDeleteTarget(null);
    await fetchRestaurants();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Restaurant Management</h1>
          <Button onClick={openCreateForm}>
            <Plus className="mr-2 h-4 w-4" />
            Add Restaurant
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Restaurants</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search restaurants..."
                    className="pl-9 w-64"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
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
                  <TableHead>Commission</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground">
                      Loading restaurants...
                    </TableCell>
                  </TableRow>
                )}
                {!loading && filteredRestaurants.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground">
                      No restaurants found.
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  filteredRestaurants.map((restaurant) => (
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
                        <span>⭐</span>
                        <span>{restaurant.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Active</Badge>
                    </TableCell>
                    <TableCell>15%</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEditForm(restaurant.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget({ id: restaurant.id, name: restaurant.name })}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{formMode === "create" ? "Add Restaurant" : "Edit Restaurant"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formValues.name}
                onChange={(event) => setFormValues((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Restaurant name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cuisine</label>
              <Input
                value={formValues.cuisine}
                onChange={(event) => setFormValues((prev) => ({ ...prev, cuisine: event.target.value }))}
                placeholder="Cuisine type"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <Input
                value={formValues.rating}
                onChange={(event) => setFormValues((prev) => ({ ...prev, rating: event.target.value }))}
                type="number"
                step="0.1"
                min="0"
                max="5"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery time</label>
              <Input
                value={formValues.delivery_time}
                onChange={(event) => setFormValues((prev) => ({ ...prev, delivery_time: event.target.value }))}
                placeholder="25-35 min"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price range</label>
              <Input
                value={formValues.price_range}
                onChange={(event) => setFormValues((prev) => ({ ...prev, price_range: event.target.value }))}
                placeholder="$$"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Distance (km)</label>
              <Input
                value={formValues.distance_km}
                onChange={(event) => setFormValues((prev) => ({ ...prev, distance_km: event.target.value }))}
                type="number"
                step="0.1"
                min="0"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={formValues.address}
                onChange={(event) => setFormValues((prev) => ({ ...prev, address: event.target.value }))}
                placeholder="Street, city, country"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <Input
                value={formValues.tags}
                onChange={(event) => setFormValues((prev) => ({ ...prev, tags: event.target.value }))}
                placeholder="Family friendly, Vegan, Fast delivery"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Categories</label>
              <div className="grid gap-2 rounded-lg border border-border/60 p-3 md:grid-cols-2">
                {categories.length === 0 && (
                  <p className="text-sm text-muted-foreground">No categories available.</p>
                )}
                {categories.map((category) => {
                  const checked = formValues.category_ids.includes(category.id);
                  return (
                    <label key={category.id} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(value) =>
                          setFormValues((prev) => ({
                            ...prev,
                            category_ids: value
                              ? prev.category_ids.includes(category.id)
                                ? prev.category_ids
                                : [...prev.category_ids, category.id]
                              : prev.category_ids.filter((id) => id !== category.id),
                          }))
                        }
                      />
                      <span>{category.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formValues.description}
                onChange={(event) => setFormValues((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Short description"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image path</label>
              <Input
                value={formValues.image_path}
                onChange={(event) => setFormValues((prev) => ({ ...prev, image_path: event.target.value }))}
                placeholder="placeholders/default.svg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={formValues.image_url}
                onChange={(event) => setFormValues((prev) => ({ ...prev, image_url: event.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Owner ID</label>
              <Input
                value={formValues.owner_id}
                onChange={(event) => setFormValues((prev) => ({ ...prev, owner_id: event.target.value }))}
                placeholder="UUID of restaurant owner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Featured order</label>
              <Input
                value={formValues.featured_order}
                onChange={(event) => setFormValues((prev) => ({ ...prev, featured_order: event.target.value }))}
                type="number"
                min="0"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formValues.is_featured}
                onCheckedChange={(checked) => setFormValues((prev) => ({ ...prev, is_featured: checked }))}
              />
              <span className="text-sm">Featured</span>
            </div>
          </div>
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete restaurant?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {deleteTarget?.name || "this restaurant"} and its related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Restaurants;

