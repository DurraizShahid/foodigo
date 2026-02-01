"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { DollarSign, MapPin, Clock, Package, Navigation, Phone, Flame, MessageCircle, User, Route, Zap, TrendingUp, Bike } from "lucide-react";
import { useData } from "@/context/DataContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const DriverDashboard: React.FC = () => {
  const { orders, driverStats } = useData();
  const [isOnline, setIsOnline] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);

  const availableOrders = orders.filter((o) => o.status === "Pending");
  const completedOrders = orders.filter((o) => o.status === "Delivered");
  const totalEarnings = completedOrders.reduce((sum, order) => sum + order.total * 0.2, 0); // 20% commission

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    toast.success(isOnline ? "You're now offline" : "You're now online and ready to receive orders!");
  };

  const handleAcceptOrder = (order: any) => {
    setCurrentOrder(order);
    toast.success("Order accepted! Navigate to the restaurant to pick up.");
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Driver Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/driver/navigation">
                <Navigation className="mr-2 h-4 w-4" />
                Navigation
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/driver/route-optimization">
                <Route className="mr-2 h-4 w-4" />
                Routes
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/driver/payouts">
                <Zap className="mr-2 h-4 w-4" />
                Payouts
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/driver/analytics">
                <TrendingUp className="mr-2 h-4 w-4" />
                Analytics
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/driver/vehicle">
                <Bike className="mr-2 h-4 w-4" />
                Vehicle
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/driver/earnings-boost">
                <Zap className="mr-2 h-4 w-4" />
                Boost
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/driver/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Switch id="online-status" checked={isOnline} onCheckedChange={handleToggleOnline} />
              <Label htmlFor="online-status" className="cursor-pointer">
                {isOnline ? "Online" : "Offline"}
              </Label>
            </div>
            {isOnline && (
              <Badge className="bg-green-500">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                Available
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Deliveries</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders.length}</div>
              <p className="text-xs text-muted-foreground">Total deliveries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28 min</div>
              <p className="text-xs text-muted-foreground">Per delivery</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <span className="text-2xl">⭐</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">Based on reviews</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Earnings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-3xl font-bold">${driverStats.earnings.total.toFixed(0)}</p>
              <p className="text-sm text-muted-foreground">{driverStats.earnings.completedDeliveries} deliveries completed</p>
              <p className="text-sm">Rating: {driverStats.earnings.avgRating}</p>
            </div>
            <div className="flex items-end gap-2">
              {driverStats.earnings.week.map((point) => (
                <div key={point.label} className="flex-1 text-center">
                  <div className="mx-auto w-6 rounded-full bg-primary/40" style={{ height: `${(point.value / 200) * 100}%` }} />
                  <p className="text-xs text-muted-foreground mt-1">{point.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                Hotspots
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {driverStats.hotspots.map((hotspot) => (
                <div key={hotspot.name} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-semibold">{hotspot.name}</p>
                    <p className="text-xs text-muted-foreground">{hotspot.eta}</p>
                  </div>
                  <Badge>{hotspot.distance}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Incentives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {driverStats.incentives.map((incentive) => (
                <div key={incentive.id} className="rounded-lg border p-3 space-y-1">
                  <p className="font-semibold">{incentive.title}</p>
                  <p className="text-sm text-muted-foreground">{incentive.requirement}</p>
                  <p className="text-sm">Reward: {incentive.reward}</p>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(100, (incentive.progress / incentive.target) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Current Order */}
        {currentOrder && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Current Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                <p className="font-semibold">#{currentOrder.id.slice(-6).toUpperCase()}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Restaurant</p>
                  <p className="font-semibold">Pizza Palace</p>
                  <p className="text-sm text-muted-foreground">123 Main St</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Delivery To</p>
                  <p className="font-semibold">John Doe</p>
                  <p className="text-sm text-muted-foreground">456 Oak Ave</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Navigation className="mr-2 h-4 w-4" />
                  Start Navigation
                </Button>
                <Button variant="outline">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" className="w-full">
                Mark as Delivered
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Available Orders */}
        {isOnline && (
          <Card>
            <CardHeader>
              <CardTitle>Available Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {availableOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No orders available at the moment. Stay online to receive new orders!
                </p>
              ) : (
                <div className="space-y-4">
                  {availableOrders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-semibold">Order #{order.id.slice(-6).toUpperCase()}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.items.length} items • ${order.total.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">2.5 km away</span>
                            </div>
                          </div>
                          <Badge>${(order.total * 0.2).toFixed(2)}</Badge>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => handleAcceptOrder(order)}
                          disabled={!!currentOrder}
                        >
                          Accept Order
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Recent Chats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {driverStats.chats.map((chat) => (
                <div key={chat.id} className="rounded-lg border p-3">
                  <p className="font-semibold">{chat.name}</p>
                  <p className="text-sm text-muted-foreground">{chat.snippet}</p>
                  <p className="text-xs text-muted-foreground">{chat.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          {/* Delivery History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              {completedOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No completed deliveries yet</p>
              ) : (
                <div className="space-y-4">
                  {completedOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">Order #{order.id.slice(-6).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(order.total * 0.2).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Earnings</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </Layout>
  );
};

export default DriverDashboard;

