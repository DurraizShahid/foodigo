"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Layout from "@/components/Layout";
import { Package, AlertTriangle, CheckCircle2, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  autoOutOfStock: boolean;
  lastUpdated: string;
}

const Inventory: React.FC = () => {
  const { user } = useAuth();
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Menu Items",
    currentStock: 0,
    minStock: 0,
    unit: "servings",
    autoOutOfStock: true,
  });

  useEffect(() => {
    let active = true;
    const loadRestaurant = async () => {
      const { data } = await supabase.from("restaurants").select("id").eq("owner_id", user?.id || "").limit(1);
      const fallback = !data?.length ? await supabase.from("restaurants").select("id").limit(1) : { data };
      if (!active) return;
      setRestaurantId(fallback.data?.[0]?.id || null);
    };
    loadRestaurant();
    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    let active = true;
    const loadInventory = async () => {
      if (!restaurantId) {
        setInventory([]);
        return;
      }
      const { data } = await supabase
        .from("inventory_items")
        .select("id, name, category, current_stock, min_stock, unit, auto_out_of_stock, last_updated")
        .eq("restaurant_id", restaurantId)
        .order("name");
      if (!active) return;
      setInventory(
        (data || []).map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category || "",
          currentStock: item.current_stock,
          minStock: item.min_stock,
          unit: item.unit || "",
          autoOutOfStock: item.auto_out_of_stock,
          lastUpdated: item.last_updated,
        }))
      );
    };
    loadInventory();
    return () => {
      active = false;
    };
  }, [restaurantId]);

  const handleUpdateStock = (id: string, newStock: number) => {
    setInventory(
      inventory.map((item) =>
        item.id === id
          ? { ...item, currentStock: newStock, lastUpdated: new Date().toISOString() }
          : item
      )
    );
    supabase.from("inventory_items").update({ current_stock: newStock, last_updated: new Date().toISOString() }).eq("id", id);
    toast.success("Stock updated!");
  };

  const handleToggleAutoOut = (id: string) => {
    setInventory(
      inventory.map((item) => (item.id === id ? { ...item, autoOutOfStock: !item.autoOutOfStock } : item))
    );
    const item = inventory.find((entry) => entry.id === id);
    if (item) {
      supabase.from("inventory_items").update({ auto_out_of_stock: !item.autoOutOfStock }).eq("id", id);
    }
    toast.success("Auto out-of-stock setting updated");
  };

  const handleAddItem = () => {
    if (!formData.name) {
      toast.error("Please enter item name");
      return;
    }
    const newItem: InventoryItem = {
      ...formData,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
    };
    setInventory([...inventory, newItem]);
    if (restaurantId) {
      supabase.from("inventory_items").insert({
        id: newItem.id,
        restaurant_id: restaurantId,
        name: newItem.name,
        category: newItem.category,
        current_stock: newItem.currentStock,
        min_stock: newItem.minStock,
        unit: newItem.unit,
        auto_out_of_stock: newItem.autoOutOfStock,
        last_updated: newItem.lastUpdated,
      });
    }
    setFormData({
      name: "",
      category: "Menu Items",
      currentStock: 0,
      minStock: 0,
      unit: "servings",
      autoOutOfStock: true,
    });
    setShowAddForm(false);
    toast.success("Item added to inventory!");
  };

  const lowStockItems = inventory.filter((item) => item.currentStock <= item.minStock);
  const outOfStockItems = inventory.filter((item) => item.currentStock === 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Inventory Management</h1>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        {/* Alerts */}
        {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
          <div className="space-y-2">
            {outOfStockItems.length > 0 && (
              <Card className="border-red-500 bg-red-50 dark:bg-red-950">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <p className="font-semibold text-red-700 dark:text-red-400">
                      {outOfStockItems.length} item(s) out of stock
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            {lowStockItems.length > 0 && (
              <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <p className="font-semibold text-yellow-700 dark:text-yellow-400">
                      {lowStockItems.length} item(s) running low
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Add Item Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add Inventory Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Margherita Pizza"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="Menu Items">Menu Items</option>
                    <option value="Ingredients">Ingredients</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Supplies">Supplies</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentStock">Current Stock</Label>
                  <Input
                    id="currentStock"
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Min Stock</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g., servings, kg"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoOut">Auto Mark Out of Stock</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically mark item unavailable when stock reaches 0
                  </p>
                </div>
                <Switch
                  id="autoOut"
                  checked={formData.autoOutOfStock}
                  onCheckedChange={(checked) => setFormData({ ...formData, autoOutOfStock: checked })}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddItem} className="flex-1">
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Current Inventory</CardTitle>
            <CardDescription>Manage stock levels and track inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Auto Out</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => {
                  const isLow = item.currentStock <= item.minStock;
                  const isOut = item.currentStock === 0;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={item.currentStock}
                            onChange={(e) => handleUpdateStock(item.id, Number(e.target.value))}
                            className="w-20"
                          />
                          <span className="text-muted-foreground">{item.unit}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.minStock} {item.unit}
                      </TableCell>
                      <TableCell>
                        {isOut ? (
                          <Badge className="bg-red-500">Out of Stock</Badge>
                        ) : isLow ? (
                          <Badge className="bg-yellow-500">Low Stock</Badge>
                        ) : (
                          <Badge className="bg-green-500">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            In Stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={item.autoOutOfStock}
                          onCheckedChange={() => handleToggleAutoOut(item.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View History
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Inventory;

