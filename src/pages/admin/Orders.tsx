"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<
    Array<{
      id: string;
      userId: string | null;
      restaurantId: string | null;
      restaurantName: string;
      customerName: string;
      customerEmail: string;
      status: string;
      total: number;
      createdAt: string;
      itemsCount: number;
    }>
  >([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    const loadOrders = async () => {
      const [{ data: orderRows }, { data: restaurants }, { data: profiles }] = await Promise.all([
        supabase
          .from("orders")
          .select("id, user_id, restaurant_id, status, total, created_at, order_items(quantity)")
          .order("created_at", { ascending: false }),
        supabase.from("restaurants").select("id, name"),
        supabase.from("profiles").select("id, full_name, email"),
      ]);
      if (!active) return;
      const restaurantMap = new Map((restaurants || []).map((row) => [row.id, row.name]));
      const profileMap = new Map(
        (profiles || []).map((row) => [row.id, { name: row.full_name || "Customer", email: row.email || "" }])
      );

      setOrders(
        (orderRows || []).map((order) => {
          const customer = order.user_id ? profileMap.get(order.user_id) : null;
          const itemsCount = (order.order_items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
          return {
            id: order.id,
            userId: order.user_id,
            restaurantId: order.restaurant_id,
            restaurantName: restaurantMap.get(order.restaurant_id) || "Unknown",
            customerName: customer?.name || "Guest",
            customerEmail: customer?.email || "",
            status: order.status || "Pending",
            total: Number(order.total || 0),
            createdAt: order.created_at,
            itemsCount,
          };
        })
      );
    };
    loadOrders();
    return () => {
      active = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return orders;
    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(normalized) ||
        order.customerName.toLowerCase().includes(normalized) ||
        order.customerEmail.toLowerCase().includes(normalized) ||
        order.restaurantName.toLowerCase().includes(normalized)
    );
  }, [orders, query]);

  const statusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500";
      case "On the way":
        return "bg-blue-500";
      case "Preparing":
        return "bg-yellow-500";
      case "Canceled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Orders</h1>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Placed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id.slice(-6).toUpperCase()}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{order.restaurantName}</TableCell>
                    <TableCell>{order.itemsCount}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={statusColor(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
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

export default Orders;
