"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { DollarSign, Package, TrendingUp, Users, Plus, Edit, Trash2, Building, ClipboardList, Wallet, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase, resolveImageUrl } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

const RestaurantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<{
    id: string;
    name: string;
    rating: number;
    image: string;
  } | null>(null);
  const [restaurantOrders, setRestaurantOrders] = useState<
    Array<{
      id: string;
      total: number;
      status: string;
      createdAt: string;
      items: Array<{ name: string; quantity: number }>;
    }>
  >([]);
  const [menuItems, setMenuItems] = useState<Array<{ id: string; name: string; description: string; price: number; image: string }>>([]);
  const [restaurantAnalytics, setRestaurantAnalytics] = useState<{
    salesTrend: Array<{ label: string; value: number }>;
    topItems: Array<{ name: string; orders: number; revenue: number }>;
    payoutHistory: Array<{ id: string; amount: number; status: string; date: string }>;
    inventory: Array<{ id: string; name: string; level: number; status: string }>;
    profile: { restaurantName: string; phone: string; email: string; hours: string; prepTime: string };
    promotions: Array<{ id: string; name: string; type: string; status: string; run: string }>;
    customerInsights: { repeatCustomers: number; averageOrderValue: number };
  }>({
    salesTrend: [],
    topItems: [],
    payoutHistory: [],
    inventory: [],
    profile: { restaurantName: "", phone: "", email: "", hours: "", prepTime: "" },
    promotions: [],
    customerInsights: { repeatCustomers: 0, averageOrderValue: 0 },
  });

  useEffect(() => {
    let active = true;
    const loadRestaurant = async () => {
      const { data: restaurants } = await supabase
        .from("restaurants")
        .select("id, name, rating, image_path, image_url")
        .eq("owner_id", user?.id || "")
        .limit(1);

      const fallback = !restaurants?.length
        ? await supabase.from("restaurants").select("id, name, rating, image_path, image_url").limit(1)
        : { data: restaurants };

      const restaurantRow = (fallback.data || [])[0];
      if (!active) return;
      if (!restaurantRow) {
        setRestaurant(null);
        return;
      }
      setRestaurant({
        id: restaurantRow.id,
        name: restaurantRow.name,
        rating: Number(restaurantRow.rating || 0),
        image: resolveImageUrl("restaurants", restaurantRow.image_path, restaurantRow.image_url),
      });
    };
    loadRestaurant();
    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    let active = true;
    const loadDetails = async () => {
      if (!restaurant) return;
      const [{ data: orderRows }, { data: menuRows }, { data: analyticsRows }] = await Promise.all([
        supabase
          .from("orders")
          .select("id, total, status, created_at, order_items(name, quantity)")
          .eq("restaurant_id", restaurant.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("menu_items")
          .select("id, name, description, price, image_path, image_url")
          .eq("restaurant_id", restaurant.id),
        supabase
          .from("restaurant_analytics")
          .select("sales_trend, top_items, payout_history, inventory, profile, promotions, customer_insights")
          .eq("restaurant_id", restaurant.id)
          .maybeSingle(),
      ]);
      if (!active) return;
      setRestaurantOrders(
        (orderRows || []).map((order) => ({
          id: order.id,
          total: Number(order.total),
          status: order.status,
          createdAt: order.created_at,
          items: (order.order_items || []).map((item) => ({
            name: item.name,
            quantity: item.quantity,
          })),
        }))
      );
      setMenuItems(
        (menuRows || []).map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          price: Number(item.price),
          image: resolveImageUrl("menu-items", item.image_path, item.image_url),
        }))
      );
      setRestaurantAnalytics({
        salesTrend: (analyticsRows?.sales_trend || []) as Array<{ label: string; value: number }>,
        topItems: (analyticsRows?.top_items || []) as Array<{ name: string; orders: number; revenue: number }>,
        payoutHistory: (analyticsRows?.payout_history || []) as Array<{ id: string; amount: number; status: string; date: string }>,
        inventory: (analyticsRows?.inventory || []) as Array<{ id: string; name: string; level: number; status: string }>,
        profile: (analyticsRows?.profile || { restaurantName: restaurant.name, phone: "", email: "", hours: "", prepTime: "" }) as {
          restaurantName: string;
          phone: string;
          email: string;
          hours: string;
          prepTime: string;
        },
        promotions: (analyticsRows?.promotions || []) as Array<{ id: string; name: string; type: string; status: string; run: string }>,
        customerInsights: (analyticsRows?.customer_insights || { repeatCustomers: 0, averageOrderValue: 0 }) as {
          repeatCustomers: number;
          averageOrderValue: number;
        },
      });
    };
    loadDetails();
    return () => {
      active = false;
    };
  }, [restaurant]);

  const totalEarnings = useMemo(
    () => restaurantOrders.reduce((sum, order) => sum + order.total, 0),
    [restaurantOrders]
  );
  const todayEarnings = useMemo(() => {
    const today = new Date().toDateString();
    return restaurantOrders
      .filter((order) => new Date(order.createdAt).toDateString() === today)
      .reduce((sum, order) => sum + order.total, 0);
  }, [restaurantOrders]);

  if (!restaurant) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto text-center py-16">
          <h1 className="text-3xl font-bold text-foreground mb-2">Restaurant not found</h1>
          <p className="text-muted-foreground">Link a restaurant profile to continue.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Restaurant Dashboard</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Menu Item
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${todayEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+12.5% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{restaurantOrders.length}</div>
              <p className="text-xs text-muted-foreground">+5 new today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{restaurant.rating}</div>
              <p className="text-xs text-muted-foreground">Based on reviews</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {restaurantOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id.slice(-6).toUpperCase()}</TableCell>
                        <TableCell>
                          {order.items.map((item, idx) => (
                            <span key={idx} className="text-sm">
                              {item.quantity}x {item.name}
                              {idx < order.items.length - 1 && ", "}
                            </span>
                          ))}
                        </TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              order.status === "Delivered"
                                ? "bg-green-500"
                                : order.status === "Pending"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                            {order.status === "Pending" && (
                              <Button variant="outline" size="sm">
                                Accept
                              </Button>
                            )}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Chat with Customer</DialogTitle>
                                </DialogHeader>
                                <ChatWindow
                                  messages={[]}
                                  onSendMessage={(msg) => {
                                    console.log("Message sent:", msg);
                                    toast.success("Message sent to customer");
                                  }}
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Menu Items</CardTitle>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {menuItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-0">
                        <img src={item.image} alt={item.name} className="w-full h-32 object-cover" />
                        <div className="p-4">
                          <h3 className="font-semibold mb-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold">${item.price.toFixed(2)}</span>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Sales Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {restaurantAnalytics.topItems.map((item) => (
                    <Card key={item.name}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{item.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{item.orders} orders</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">${item.revenue.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="rounded-xl border p-4 bg-muted/40">
                  <p className="text-sm font-semibold mb-3">Weekly trend</p>
                  <div className="grid gap-2 md:grid-cols-7 text-center text-sm">
                    {restaurantAnalytics.salesTrend.map((point) => (
                      <div key={point.label} className="space-y-1">
                        <div className="h-24 flex items-end justify-center">
                          <div className="w-6 rounded-full bg-primary/30" style={{ height: `${(point.value / 1600) * 100}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground">{point.label}</p>
                        <p className="font-medium">${point.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promotions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Promotions & Offers</CardTitle>
                  <Button asChild>
                    <Link to="/restaurant/promotions">
                      <Plus className="mr-2 h-4 w-4" />
                      Manage Promotions
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {restaurantAnalytics.promotions.map((promo) => (
                  <div key={promo.id} className="rounded-lg border p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold">{promo.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {promo.type} · {promo.run}
                      </p>
                    </div>
                    <Badge variant={promo.status === "Active" ? "outline" : "secondary"}>{promo.status}</Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/restaurant/promotions">View All Promotions</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Payout History
                  </CardTitle>
                  <Button variant="outline" asChild>
                    <Link to="/restaurant/payouts">View Full History</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {restaurantAnalytics.payoutHistory.slice(0, 5).map((payout) => (
                  <div key={payout.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
                    <div>
                      <p className="font-semibold">${payout.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{payout.date}</p>
                    </div>
                    <Badge variant={payout.status === "Completed" ? "outline" : "secondary"}>{payout.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Inventory Monitor
                  </CardTitle>
                  <Button variant="outline" asChild>
                    <Link to="/restaurant/inventory">Manage Inventory</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {restaurantAnalytics.inventory.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.level}% remaining</p>
                    </div>
                    <Badge variant={item.status === "low" ? "destructive" : item.status === "medium" ? "secondary" : "outline"}>
                      {item.status === "low" ? "Restock" : item.status === "medium" ? "Watch" : "Healthy"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
                <CardDescription>Analytics and customer behavior patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Repeat Customers</p>
                      <p className="text-2xl font-bold">{restaurantAnalytics.customerInsights.repeatCustomers}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Order Value</p>
                      <p className="text-2xl font-bold">${restaurantAnalytics.customerInsights.averageOrderValue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Top Age Group</p>
                      <p className="text-2xl font-bold">25-34</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/restaurant/insights">View Detailed Insights</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Restaurant Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Restaurant Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Restaurant name</p>
                <p className="font-semibold">{restaurantAnalytics.profile.restaurantName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prep time</p>
                <p className="font-semibold">{restaurantAnalytics.profile.prepTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold">{restaurantAnalytics.profile.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{restaurantAnalytics.profile.email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hours</p>
              <p className="font-semibold">{restaurantAnalytics.profile.hours}</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/restaurant/profile">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RestaurantDashboard;

