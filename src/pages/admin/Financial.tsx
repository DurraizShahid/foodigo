"use client";

import React from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, Users, Building } from "lucide-react";
import { adminInsights } from "@/data/dummyData";

const Financial: React.FC = () => {
  const financialData = {
    totalRevenue: 1250000,
    monthlyRevenue: 125000,
    growth: 12.5,
    totalOrders: 45000,
    averageOrderValue: 27.78,
    commission: 15,
    platformFees: 3.5,
    payouts: {
      restaurants: 950000,
      drivers: 200000,
      total: 1150000,
    },
    netProfit: 100000,
    profitMargin: 8,
    revenueByCity: [
      { city: "Cityville", revenue: 500000, orders: 18000, growth: 15 },
      { city: "Townsville", revenue: 450000, orders: 16000, growth: 10 },
      { city: "Villageton", revenue: 300000, orders: 11000, growth: 8 },
    ],
    monthlyBreakdown: [
      { month: "Jan", revenue: 100000, profit: 8000 },
      { month: "Feb", revenue: 110000, profit: 8800 },
      { month: "Mar", revenue: 115000, profit: 9200 },
      { month: "Apr", revenue: 120000, profit: 9600 },
      { month: "May", revenue: 125000, profit: 10000 },
    ],
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Financial Oversight</h1>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(financialData.totalRevenue / 1000).toFixed(0)}K</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +{financialData.growth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(financialData.netProfit / 1000).toFixed(0)}K</div>
              <p className="text-xs text-muted-foreground">{financialData.profitMargin}% margin</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(financialData.payouts.total / 1000).toFixed(0)}K</div>
              <p className="text-xs text-muted-foreground">Restaurants & Drivers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${financialData.averageOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Per order</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="cities">By City</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {financialData.monthlyBreakdown.map((item) => (
                      <div key={item.month}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.month}</span>
                          <span className="text-sm text-muted-foreground">
                            ${(item.revenue / 1000).toFixed(0)}K
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(item.revenue / 125000) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profit Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {financialData.monthlyBreakdown.map((item) => (
                      <div key={item.month}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.month}</span>
                          <span className="text-sm text-muted-foreground">
                            ${(item.profit / 1000).toFixed(1)}K
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(item.profit / 10000) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
                <CardDescription>Breakdown of revenue streams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Commission ({financialData.commission}%)</span>
                      <span className="text-sm text-muted-foreground">
                        ${((financialData.totalRevenue * financialData.commission) / 100 / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${financialData.commission}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Platform Fees ({financialData.platformFees}%)</span>
                      <span className="text-sm text-muted-foreground">
                        ${((financialData.totalRevenue * financialData.platformFees) / 100 / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${financialData.platformFees}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>Payout Breakdown</CardTitle>
                <CardDescription>Distribution to restaurants and drivers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Restaurants</span>
                      <span className="text-sm text-muted-foreground">
                        ${(financialData.payouts.restaurants / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(financialData.payouts.restaurants / financialData.payouts.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Drivers</span>
                      <span className="text-sm text-muted-foreground">
                        ${(financialData.payouts.drivers / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(financialData.payouts.drivers / financialData.payouts.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cities">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by City</CardTitle>
                <CardDescription>Performance across different locations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>City</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financialData.revenueByCity.map((city) => (
                      <TableRow key={city.city}>
                        <TableCell className="font-medium">{city.city}</TableCell>
                        <TableCell>${(city.revenue / 1000).toFixed(0)}K</TableCell>
                        <TableCell>{city.orders.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={city.growth > 10 ? "default" : "secondary"}>
                            <TrendingUp className="mr-1 h-3 w-3" />
                            +{city.growth}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Financial;

