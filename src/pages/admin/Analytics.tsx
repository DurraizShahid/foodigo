"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Package, BarChart3, Activity } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<{
    userGrowth: Array<{ month: string; users: number; growth: number }>;
    orderTrends: Array<{ day: string; orders: number; revenue: number }>;
    topRestaurants: Array<{ name: string; orders: number; revenue: number; rating: number }>;
    customerSegments: Array<{ segment: string; count: number; percentage: number }>;
    retentionRate: number;
    churnRate: number;
    ltv: number;
    totalUsers: number;
  }>({
    userGrowth: [],
    orderTrends: [],
    topRestaurants: [],
    customerSegments: [],
    retentionRate: 0,
    churnRate: 0,
    ltv: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    let active = true;
    const loadAnalytics = async () => {
      const [{ data: profileRows }, { data: orderRows }, { data: restaurants }] = await Promise.all([
        supabase.from("profiles").select("id, created_at"),
        supabase.from("orders").select("id, user_id, restaurant_id, total, created_at"),
        supabase.from("restaurants").select("id, name, rating"),
      ]);
      if (!active) return;

      const restaurantMap = new Map((restaurants || []).map((row) => [row.id, row]));
      const now = new Date();
      const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const prev30 = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const userGrowthMap = (profileRows || []).reduce<Record<string, number>>((acc, profile) => {
        const date = new Date(profile.created_at);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
      const userGrowthKeys = Object.keys(userGrowthMap)
        .map((key) => {
          const [year, month] = key.split("-").map(Number);
          return { key, year, month };
        })
        .sort((a, b) => (a.year - b.year) || (a.month - b.month))
        .slice(-6);
      const userGrowth = userGrowthKeys.map((entry, index) => {
        const { key, year, month } = entry;
        const users = userGrowthMap[key];
        const previousKey = index > 0 ? userGrowthKeys[index - 1].key : null;
        const previousUsers = previousKey ? userGrowthMap[previousKey] : 0;
        const growth = previousUsers > 0 ? Math.round(((users - previousUsers) / previousUsers) * 100) : 0;
        return {
          month: new Date(year, month, 1).toLocaleString(undefined, { month: "short" }),
          users,
          growth,
        };
      });

      const orderTrendsMap = (orderRows || []).reduce<Record<string, { orders: number; revenue: number }>>((acc, order) => {
        const date = new Date(order.created_at);
        if (date < last30) return acc;
        const day = date.toLocaleString(undefined, { weekday: "short" });
        if (!acc[day]) acc[day] = { orders: 0, revenue: 0 };
        acc[day].orders += 1;
        acc[day].revenue += Number(order.total || 0);
        return acc;
      }, {});
      const weekdayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const orderTrends = Object.entries(orderTrendsMap)
        .sort((a, b) => weekdayOrder.indexOf(a[0]) - weekdayOrder.indexOf(b[0]))
        .map(([day, values]) => ({
          day,
          orders: values.orders,
          revenue: values.revenue,
        }));

      const restaurantStats = (orderRows || []).reduce<Record<string, { orders: number; revenue: number }>>((acc, order) => {
        if (!order.restaurant_id) return acc;
        if (!acc[order.restaurant_id]) acc[order.restaurant_id] = { orders: 0, revenue: 0 };
        acc[order.restaurant_id].orders += 1;
        acc[order.restaurant_id].revenue += Number(order.total || 0);
        return acc;
      }, {});
      const topRestaurants = Object.entries(restaurantStats)
        .map(([id, stats]) => {
          const restaurant = restaurantMap.get(id);
          return {
            name: restaurant?.name || "Unknown",
            orders: stats.orders,
            revenue: stats.revenue,
            rating: Number(restaurant?.rating || 0),
          };
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      const ordersByUser = (orderRows || []).reduce<Record<string, number>>((acc, order) => {
        if (!order.user_id) return acc;
        acc[order.user_id] = (acc[order.user_id] || 0) + 1;
        return acc;
      }, {});
      const segmentCounts = {
        New: 0,
        Active: 0,
        Loyal: 0,
      };
      Object.values(ordersByUser).forEach((count) => {
        if (count <= 1) segmentCounts.New += 1;
        else if (count <= 5) segmentCounts.Active += 1;
        else segmentCounts.Loyal += 1;
      });
      const totalSegmentUsers = Object.values(segmentCounts).reduce((sum, value) => sum + value, 0) || 1;
      const customerSegments = Object.entries(segmentCounts).map(([segment, count]) => ({
        segment,
        count,
        percentage: Math.round((count / totalSegmentUsers) * 100),
      }));

      const usersLast30 = new Set((orderRows || []).filter((o) => new Date(o.created_at) >= last30).map((o) => o.user_id).filter(Boolean) as string[]);
      const usersPrev30 = new Set(
        (orderRows || [])
          .filter((o) => {
            const date = new Date(o.created_at);
            return date >= prev30 && date < last30;
          })
          .map((o) => o.user_id)
          .filter(Boolean) as string[]
      );
      const retained = [...usersPrev30].filter((id) => usersLast30.has(id)).length;
      const retentionRate = usersPrev30.size > 0 ? Math.round((retained / usersPrev30.size) * 100) : 0;
      const churnRate = usersPrev30.size > 0 ? Math.round(((usersPrev30.size - retained) / usersPrev30.size) * 100) : 0;

      const totalRevenue = (orderRows || []).reduce((sum, order) => sum + Number(order.total || 0), 0);
      const uniqueCustomers = new Set((orderRows || []).map((order) => order.user_id).filter(Boolean) as string[]);
      const ltv = uniqueCustomers.size > 0 ? Math.round(totalRevenue / uniqueCustomers.size) : 0;

      setAnalyticsData({
        userGrowth,
        orderTrends,
        topRestaurants,
        customerSegments,
        retentionRate,
        churnRate,
        ltv,
        totalUsers: profileRows?.length || 0,
      });
    };
    loadAnalytics();
    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Advanced Analytics & BI</h1>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.retentionRate}%</div>
              <p className="text-xs text-muted-foreground">Customer retention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.churnRate}%</div>
              <p className="text-xs text-muted-foreground">Monthly churn</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">LTV</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analyticsData.ltv}</div>
              <p className="text-xs text-muted-foreground">Lifetime value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total users</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="growth" className="w-full">
          <TabsList>
            <TabsTrigger value="growth">User Growth</TabsTrigger>
            <TabsTrigger value="orders">Order Trends</TabsTrigger>
            <TabsTrigger value="restaurants">Top Restaurants</TabsTrigger>
            <TabsTrigger value="segments">Customer Segments</TabsTrigger>
          </TabsList>

          <TabsContent value="growth">
            <Card>
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
                <CardDescription>Monthly user acquisition and growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.userGrowth.map((item) => (
                    <div key={item.month}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{item.month}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.users.toLocaleString()} users
                          {item.growth > 0 && (
                            <Badge variant="default" className="ml-2">
                              +{item.growth}%
                            </Badge>
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(item.users / 12500) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Daily Order Trends</CardTitle>
                <CardDescription>Orders and revenue by day of week</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Avg Order Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.orderTrends.map((item) => (
                      <TableRow key={item.day}>
                        <TableCell className="font-medium">{item.day}</TableCell>
                        <TableCell>{item.orders.toLocaleString()}</TableCell>
                        <TableCell>${item.revenue.toLocaleString()}</TableCell>
                        <TableCell>${(item.revenue / item.orders).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="restaurants">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Restaurants</CardTitle>
                <CardDescription>Restaurants ranked by orders and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.topRestaurants.map((restaurant) => (
                      <TableRow key={restaurant.name}>
                        <TableCell className="font-medium">{restaurant.name}</TableCell>
                        <TableCell>{restaurant.orders.toLocaleString()}</TableCell>
                        <TableCell>${restaurant.revenue.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{restaurant.rating} ⭐</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="segments">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segmentation</CardTitle>
                <CardDescription>Distribution of customers by engagement level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.customerSegments.map((segment) => (
                    <div key={segment.segment}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{segment.segment}</span>
                        <span className="text-sm text-muted-foreground">
                          {segment.count.toLocaleString()} ({segment.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${segment.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Analytics;

