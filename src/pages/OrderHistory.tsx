"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { Package, Clock, MapPin, ArrowRight } from "lucide-react";
import { orders, restaurants } from "@/data/dummyData";

const OrderHistory: React.FC = () => {
  const getRestaurantName = (restaurantId: string) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    return restaurant?.name || "Unknown Restaurant";
  };

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
                      <h3 className="text-lg font-semibold mb-1">{getRestaurantName(order.restaurantId)}</h3>
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

