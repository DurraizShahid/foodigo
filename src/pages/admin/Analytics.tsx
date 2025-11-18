"use client";

import React from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Package, BarChart3, Activity } from "lucide-react";
import { adminInsights } from "@/data/dummyData";

const Analytics: React.FC = () => {
  const analyticsData = {
    userGrowth: [
      { month: "Jan", users: 5000, growth: 0 },
      { month: "Feb", users: 6500, growth: 30 },
      { month: "Mar", users: 8200, growth: 26 },
      { month: "Apr", users: 10000, growth: 22 },
      { month: "May", users: 12500, growth: 25 },
    ],
    orderTrends: [
      { day: "Mon", orders: 1200, revenue: 33000 },
      { day: "Tue", orders: 1350, revenue: 37500 },
      { day: "Wed", orders: 1420, revenue: 39500 },
      { day: "Thu", orders: 1480, revenue: 41000 },
      { day: "Fri", orders: 1850, revenue: 51500 },
      { day: "Sat", orders: 1650, revenue: 45800 },
      { day: "Sun", orders: 1400, revenue: 38900 },
    ],
    topRestaurants: [
      { name: "Pizza Palace", orders: 2450, revenue: 68000, rating: 4.8 },
      { name: "Burger Joint", orders: 1890, revenue: 47250, rating: 4.6 },
      { name: "Sushi House", orders: 1650, revenue: 49500, rating: 4.9 },
      { name: "Taco Fiesta", orders: 1420, revenue: 28400, rating: 4.5 },
    ],
    customerSegments: [
      { segment: "New Customers", count: 2500, percentage: 20 },
      { segment: "Regular (1-5 orders)", count: 5000, percentage: 40 },
      { segment: "Frequent (6-15 orders)", count: 3500, percentage: 28 },
      { segment: "VIP (15+ orders)", count: 1500, percentage: 12 },
    ],
    retentionRate: 68,
    churnRate: 12,
    ltv: 125.50,
  };

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
              <div className="text-2xl font-bold">12.5K</div>
              <p className="text-xs text-muted-foreground">Active users</p>
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

