"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { supabase, resolveImageUrl } from "@/lib/supabaseClient";

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

  useEffect(() => {
    let active = true;
    const loadMenuItems = async () => {
      const [{ data: items }, { data: restaurants }] = await Promise.all([
        supabase
          .from("menu_items")
          .select("id, name, price, active, restaurant_id, image_path, image_url")
          .order("name"),
        supabase.from("restaurants").select("id, name"),
      ]);
      if (!active) return;
      const restaurantMap = new Map((restaurants || []).map((row) => [row.id, row.name]));
      setMenuItems(
        (items || []).map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price || 0),
          active: item.active ?? true,
          restaurantId: item.restaurant_id || null,
          restaurantName: restaurantMap.get(item.restaurant_id) || "Unknown",
          image: resolveImageUrl("menu-items", item.image_path, item.image_url),
        }))
      );
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Menu Items</h1>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
            />
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default MenuItems;
