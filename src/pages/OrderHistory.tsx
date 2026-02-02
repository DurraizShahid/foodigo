"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { Package, Clock, MapPin, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<
    Array<{
      id: string;
      restaurantId: string | null;
      restaurantName: string;
      items: Array<{ menuItemId: string | null; name: string; quantity: number; price: number }>;
      total: number;
      status: string;
      createdAt: string;
    }>
  >([]);

  useEffect(() => {
    let active = true;
    const loadOrders = async () => {
      if (!user) {
        setOrders([]);
        return;
      }
      const { data } = await supabase
        .from("orders")
        .select("id, restaurant_id, total, status, created_at, order_items(menu_item_id, name, quantity, price)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const restaurantIds = Array.from(new Set((data || []).map((order) => order.restaurant_id).filter(Boolean))) as string[];
      const { data: restaurants } = restaurantIds.length
        ? await supabase.from("restaurants").select("id, name").in("id", restaurantIds)
        : { data: [] as Array<{ id: string; name: string }> };

      const restaurantMap = (restaurants || []).reduce<Record<string, string>>((acc, restaurant) => {
        acc[restaurant.id] = restaurant.name;
        return acc;
      }, {});

      if (!active) return;

      setOrders(
        (data || []).map((order) => ({
          id: order.id,
          restaurantId: order.restaurant_id,
          restaurantName: order.restaurant_id ? restaurantMap[order.restaurant_id] || "Unknown Restaurant" : "Unknown Restaurant",
          items: (order.order_items || []).map((item) => ({
            menuItemId: item.menu_item_id,
            name: item.name,
            quantity: item.quantity,
            price: Number(item.price),
          })),
          total: Number(order.total),
          status: order.status,
          createdAt: order.created_at,
        }))
      );
    };
    loadOrders();
    return () => {
      active = false;
    };
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "preparing":
        return "bg-blue-500";
      case "on the way":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Order History</h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">Start ordering to see your history here</p>
              <Button asChild>
                <Link to="/">Browse Restaurants</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                <h3 className="text-lg font-semibold mb-1">{order.restaurantName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Order #{order.id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      {order.status === "Pending" || order.status === "Preparing" || order.status === "On the way" ? (
                        <Button variant="outline" asChild>
                          <Link to={`/orders/${order.id}/track`}>
                            <MapPin className="mr-2 h-4 w-4" />
                            Track Order
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="outline" asChild>
                          <Link to={`/restaurant/${order.restaurantId}`}>
                            Re-order
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderHistory;

