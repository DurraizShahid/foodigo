"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { Route, MapPin, Clock, Package, Zap } from "lucide-react";
import { toast } from "sonner";

interface Delivery {
  id: string;
  orderId: string;
  restaurant: { name: string; address: string; lat: number; lng: number };
  customer: { name: string; address: string; lat: number; lng: number };
  estimatedTime: string;
  priority: "high" | "medium" | "low";
}

const RouteOptimization: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      id: "1",
      orderId: "ORD-123",
      restaurant: { name: "Pizza Palace", address: "123 Main St", lat: 37.7749, lng: -122.4194 },
      customer: { name: "John Doe", address: "456 Oak Ave", lat: 37.7849, lng: -122.4094 },
      estimatedTime: "15 min",
      priority: "high",
    },
    {
      id: "2",
      orderId: "ORD-124",
      restaurant: { name: "Burger Joint", address: "789 Elm St", lat: 37.7649, lng: -122.4294 },
      customer: { name: "Jane Smith", address: "321 Pine St", lat: 37.7549, lng: -122.4394 },
      estimatedTime: "20 min",
      priority: "medium",
    },
    {
      id: "3",
      orderId: "ORD-125",
      restaurant: { name: "Sushi House", address: "555 Market St", lat: 37.7949, lng: -122.3994 },
      customer: { name: "Bob Johnson", address: "888 Broadway", lat: 37.8049, lng: -122.3894 },
      estimatedTime: "25 min",
      priority: "low",
    },
  ]);

  const [optimizedRoute, setOptimizedRoute] = useState<Delivery[] | null>(null);
  const [totalTime, setTotalTime] = useState<string>("");
  const [totalDistance, setTotalDistance] = useState<string>("");

  const handleOptimize = () => {
    // Simulate AI-powered route optimization
    const optimized = [...deliveries].sort((a, b) => {
      // Priority first, then distance
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return a.restaurant.lat - b.restaurant.lat; // Simple distance approximation
    });
    setOptimizedRoute(optimized);
    setTotalTime("60 min");
    setTotalDistance("12.5 km");
    toast.success("Route optimized! Estimated savings: 15 minutes");
  };

  const handleStartRoute = () => {
    toast.success("Starting optimized route navigation!");
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Route Optimization</h1>
          <Button onClick={handleOptimize} disabled={!!optimizedRoute}>
            <Zap className="mr-2 h-4 w-4" />
            Optimize Route
          </Button>
        </div>

        {/* Stats */}
        {optimizedRoute && (
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTime}</div>
                <p className="text-xs text-muted-foreground">Estimated</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
                <Route className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDistance}</div>
                <p className="text-xs text-muted-foreground">Optimized</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Deliveries</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{optimizedRoute.length}</div>
                <p className="text-xs text-muted-foreground">In route</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Route List */}
        <Card>
          <CardHeader>
            <CardTitle>Optimized Delivery Route</CardTitle>
            <CardDescription>
              {optimizedRoute
                ? "AI-optimized route for maximum efficiency"
                : "Click 'Optimize Route' to generate the best delivery sequence"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(optimizedRoute || deliveries).map((delivery, index) => (
                <div key={delivery.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">Order {delivery.orderId}</p>
                      <Badge
                        variant={
                          delivery.priority === "high"
                            ? "destructive"
                            : delivery.priority === "medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {delivery.priority}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Pickup</p>
                        <p className="font-medium">{delivery.restaurant.name}</p>
                        <p className="text-xs text-muted-foreground">{delivery.restaurant.address}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Delivery</p>
                        <p className="font-medium">{delivery.customer.name}</p>
                        <p className="text-xs text-muted-foreground">{delivery.customer.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {delivery.estimatedTime}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {optimizedRoute && (
              <Button className="w-full mt-4" onClick={handleStartRoute} size="lg">
                <Route className="mr-2 h-5 w-5" />
                Start Optimized Route
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card>
          <CardContent className="p-0">
            <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold mb-2">Multi-Stop Route Map</p>
                <p className="text-sm text-muted-foreground">
                  Google Maps integration ready for route visualization
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RouteOptimization;

