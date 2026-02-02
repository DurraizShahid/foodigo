"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, Users, Building } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const Financial: React.FC = () => {
  const [financialData, setFinancialData] = useState<{
    totalRevenue: number;
    monthlyRevenue: number;
    growth: number;
    totalOrders: number;
    averageOrderValue: number;
    commission: number;
    platformFees: number;
    payouts: { restaurants: number; drivers: number; total: number };
    netProfit: number;
    profitMargin: number;
    revenueByCity: Array<{ city: string; revenue: number; orders: number; growth: number }>;
    monthlyBreakdown: Array<{ month: string; revenue: number; profit: number }>;
  }>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    growth: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    commission: 0,
    platformFees: 0,
    payouts: { restaurants: 0, drivers: 0, total: 0 },
    netProfit: 0,
    profitMargin: 0,
    revenueByCity: [],
    monthlyBreakdown: [],
  });

  useEffect(() => {
    let active = true;
    const loadFinancial = async () => {
      const [{ data: orderRows }, { data: cityRows }] = await Promise.all([
        supabase.from("orders").select("total, created_at"),
        supabase.from("city_operations").select("name, revenue, orders").order("name"),
      ]);
      if (!active) return;
      const now = new Date();
      const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const prev30 = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      const totalRevenue = (orderRows || []).reduce((sum, order) => sum + Number(order.total || 0), 0);
      const totalOrders = orderRows?.length || 0;
      const monthlyRevenue = (orderRows || []).reduce((sum, order) => {
        const date = new Date(order.created_at);
        return date >= last30 ? sum + Number(order.total || 0) : sum;
      }, 0);
      const previousRevenue = (orderRows || []).reduce((sum, order) => {
        const date = new Date(order.created_at);
        return date >= prev30 && date < last30 ? sum + Number(order.total || 0) : sum;
      }, 0);
      const growth = previousRevenue > 0 ? Math.round(((monthlyRevenue - previousRevenue) / previousRevenue) * 100) : 0;
      const commission = 15;
      const platformFees = 5;
      const payoutBase = totalRevenue * (1 - (commission + platformFees) / 100);
      const payouts = {
        restaurants: payoutBase * 0.8,
        drivers: payoutBase * 0.2,
        total: payoutBase,
      };
      const netProfit = totalRevenue * ((commission + platformFees) / 100);
      const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

      const monthlyMap = (orderRows || []).reduce<Record<string, { revenue: number }>>((acc, order) => {
        const date = new Date(order.created_at);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        acc[key] = acc[key] || { revenue: 0 };
        acc[key].revenue += Number(order.total || 0);
        return acc;
      }, {});
      const monthlyBreakdown = Object.keys(monthlyMap)
        .map((key) => {
          const [year, month] = key.split("-").map(Number);
          return { key, year, month };
        })
        .sort((a, b) => (a.year - b.year) || (a.month - b.month))
        .slice(-6)
        .map(({ key, year, month }) => {
          const revenue = monthlyMap[key].revenue;
          return {
            month: new Date(year, month, 1).toLocaleString(undefined, { month: "short" }),
            revenue,
            profit: revenue * (profitMargin / 100),
          };
        });

      setFinancialData({
        totalRevenue,
        monthlyRevenue,
        growth,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        commission,
        platformFees,
        payouts,
        netProfit,
        profitMargin,
        revenueByCity: (cityRows || []).map((city) => ({
          city: city.name,
          revenue: Number(city.revenue || 0),
          orders: city.orders || 0,
          growth: 0,
        })),
        monthlyBreakdown,
      });
    };
    loadFinancial();
    return () => {
      active = false;
    };
  }, []);

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
                        style={{
                          width: `${financialData.payouts.total > 0 ? (financialData.payouts.restaurants / financialData.payouts.total) * 100 : 0}%`,
                        }}
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
                        style={{
                          width: `${financialData.payouts.total > 0 ? (financialData.payouts.drivers / financialData.payouts.total) * 100 : 0}%`,
                        }}
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

