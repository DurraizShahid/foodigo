"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { supabase, resolveImageUrl } from "@/lib/supabaseClient";
import { showError, showSuccess } from "@/utils/toast";

type MenuItemRow = {
  id: string;
  name: string;
  price: number | null;
  active: boolean | null;
  restaurant_id: string | null;
  image_path: string | null;
  image_url: string | null;
  calories: number | null;
  description: string | null;
};

type RestaurantOption = { id: string; name: string };

type MenuItemFormState = {
  id?: string;
  name: string;
  price: string;
  active: boolean;
  restaurant_id: string;
  image_path: string;
  image_url: string;
  calories: string;
  description: string;
};

const emptyForm: MenuItemFormState = {
  name: "",
  price: "0",
  active: true,
  restaurant_id: "",
  image_path: "",
  image_url: "",
  calories: "",
  description: "",
};

const MenuItems: React.FC = () => {
  const [menuItems, setMenuItems] = useState<
    Array<{
      id: string;
      name: string;
      price: number;
      active: boolean;
      restaurantId: string | null;
      restaurantName: string;
      image: string;
    }>
  >([]);
  const [query, setQuery] = useState("");
  const [restaurants, setRestaurants] = useState<RestaurantOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formValues, setFormValues] = useState<MenuItemFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const normalizeNumber = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const fetchMenuItems = async () => {
    setLoading(true);
    const [{ data: items, error: itemsError }, { data: restaurantsData, error: restaurantsError }] = await Promise.all([
      supabase
        .from("menu_items")
        .select("id, name, price, active, restaurant_id, image_path, image_url, calories, description")
        .order("name"),
      supabase.from("restaurants").select("id, name").order("name"),
    ]);

    if (itemsError || restaurantsError) {
      showError("Failed to load menu items.");
      setLoading(false);
      return;
    }

    const restaurantList = (restaurantsData || []) as RestaurantOption[];
    const restaurantMap = new Map(restaurantList.map((row) => [row.id, row.name]));
    setRestaurants(restaurantList);
    setMenuItems(
      (items as MenuItemRow[] | null | undefined || []).map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price || 0),
        active: item.active ?? true,
        restaurantId: item.restaurant_id || null,
        restaurantName: restaurantMap.get(item.restaurant_id || "") || "Unknown",
        image: resolveImageUrl("menu-items", item.image_path, item.image_url),
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    const loadMenuItems = async () => {
      await fetchMenuItems();
    };
    loadMenuItems();
    return () => {
      active = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return menuItems;
    return menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(normalized) ||
        item.restaurantName.toLowerCase().includes(normalized)
    );
  }, [menuItems, query]);

  const openCreateForm = () => {
    setFormMode("create");
    setFormValues(emptyForm);
    setFormError(null);
    setFormOpen(true);
  };

  const openEditForm = async (itemId: string) => {
    setFormMode("edit");
    setFormError(null);
    const { data, error } = await supabase
      .from("menu_items")
      .select("id, name, price, active, restaurant_id, image_path, image_url, calories, description")
      .eq("id", itemId)
      .single();

    if (error || !data) {
      showError("Unable to load menu item details.");
      return;
    }

    const item = data as MenuItemRow;
    setFormValues({
      id: item.id,
      name: item.name || "",
      price: item.price !== null ? String(item.price) : "0",
      active: item.active ?? true,
      restaurant_id: item.restaurant_id || "",
      image_path: item.image_path || "",
      image_url: item.image_url || "",
      calories: item.calories !== null ? String(item.calories) : "",
      description: item.description || "",
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    setFormError(null);
    if (!formValues.name.trim()) {
      setFormError("Name is required.");
      return;
    }
    if (!formValues.restaurant_id.trim()) {
      setFormError("Restaurant is required.");
      return;
    }

    setSaving(true);
    const payload = {
      name: formValues.name.trim(),
      price: normalizeNumber(formValues.price) ?? 0,
      active: formValues.active,
      restaurant_id: formValues.restaurant_id,
      image_path: formValues.image_path.trim() || null,
      image_url: formValues.image_url.trim() || null,
      calories: normalizeNumber(formValues.calories),
      description: formValues.description.trim() || null,
    };

    if (formMode === "create") {
      const { error } = await supabase.from("menu_items").insert(payload);
      if (error) {
        setFormError(error.message);
        showError("Unable to create menu item.");
        setSaving(false);
        return;
      }
      showSuccess("Menu item created.");
    } else {
      const { error } = await supabase.from("menu_items").update(payload).eq("id", formValues.id);
      if (error) {
        setFormError(error.message);
        showError("Unable to update menu item.");
        setSaving(false);
        return;
      }
      showSuccess("Menu item updated.");
    }

    setSaving(false);
    setFormOpen(false);
    await fetchMenuItems();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", deleteTarget.id);
    if (error) {
      showError("Unable to delete menu item.");
      return;
    }
    showSuccess("Menu item deleted.");
    setDeleteTarget(null);
    await fetchMenuItems();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Menu Items</h1>
          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={openCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground">
                      Loading menu items...
                    </TableCell>
                  </TableRow>
                )}
                {!loading && filteredItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground">
                      No menu items found.
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {item.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.restaurantName}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={item.active ? "bg-green-500" : "bg-gray-500"}>
                          {item.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditForm(item.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTarget({ id: item.id, name: item.name })}
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
            <DialogTitle>{formMode === "create" ? "Add Menu Item" : "Edit Menu Item"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Restaurant</label>
              <Select
                value={formValues.restaurant_id}
                onValueChange={(value) => setFormValues((prev) => ({ ...prev, restaurant_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a restaurant" />
                </SelectTrigger>
                <SelectContent>
                  {restaurants.map((restaurant) => (
                    <SelectItem key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formValues.name}
                onChange={(event) => setFormValues((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Menu item name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input
                value={formValues.price}
                onChange={(event) => setFormValues((prev) => ({ ...prev, price: event.target.value }))}
                type="number"
                step="0.01"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Calories</label>
              <Input
                value={formValues.calories}
                onChange={(event) => setFormValues((prev) => ({ ...prev, calories: event.target.value }))}
                type="number"
                min="0"
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
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={formValues.image_url}
                onChange={(event) => setFormValues((prev) => ({ ...prev, image_url: event.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formValues.description}
                onChange={(event) => setFormValues((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Short description"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formValues.active}
                onCheckedChange={(checked) => setFormValues((prev) => ({ ...prev, active: checked }))}
              />
              <span className="text-sm">Active</span>
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
            <AlertDialogTitle>Delete menu item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {deleteTarget?.name || "this item"}.
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

export default MenuItems;
