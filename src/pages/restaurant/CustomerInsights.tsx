"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { Users, TrendingUp, MapPin, Clock, Repeat } from "lucide-react";

const CustomerInsights: React.FC = () => {
  const demographics = {
    ageGroups: [
      { range: "18-24", percentage: 15, count: 45 },
      { range: "25-34", percentage: 35, count: 105 },
      { range: "35-44", percentage: 28, count: 84 },
      { range: "45-54", percentage: 15, count: 45 },
      { range: "55+", percentage: 7, count: 21 },
    ],
    gender: [
      { label: "Male", percentage: 52, count: 156 },
      { label: "Female", percentage: 45, count: 135 },
      { label: "Other", percentage: 3, count: 9 },
    ],
  };

  const orderingPatterns = {
    peakHours: [
      { hour: "12:00 PM", orders: 45 },
      { hour: "1:00 PM", orders: 52 },
      { hour: "6:00 PM", orders: 68 },
      { hour: "7:00 PM", orders: 72 },
      { hour: "8:00 PM", orders: 58 },
    ],
    popularDays: [
      { day: "Monday", orders: 120 },
      { day: "Tuesday", orders: 135 },
      { day: "Wednesday", orders: 142 },
      { day: "Thursday", orders: 148 },
      { day: "Friday", orders: 185 },
      { day: "Saturday", orders: 165 },
      { day: "Sunday", orders: 140 },
    ],
  };

  const customerMetrics = {
    totalCustomers: 300,
    repeatCustomers: 180,
    repeatRate: 60,
    averageOrderValue: 28.50,
    averageOrdersPerCustomer: 4.2,
    topDeliveryAreas: [
      { area: "Downtown", orders: 245, percentage: 35 },
      { area: "University District", orders: 180, percentage: 26 },
      { area: "Residential North", orders: 150, percentage: 21 },
      { area: "Business Park", orders: 125, percentage: 18 },
    ],
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Customer Insights</h1>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerMetrics.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Repeat Rate</CardTitle>
              <Repeat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerMetrics.repeatRate}%</div>
              <p className="text-xs text-muted-foreground">{customerMetrics.repeatCustomers} repeat customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${customerMetrics.averageOrderValue}</div>
              <p className="text-xs text-muted-foreground">Per order</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders/Customer</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerMetrics.averageOrdersPerCustomer}</div>
              <p className="text-xs text-muted-foreground">Average</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="demographics" className="w-full">
          <TabsList>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="patterns">Ordering Patterns</TabsTrigger>
            <TabsTrigger value="locations">Delivery Areas</TabsTrigger>
          </TabsList>

          <TabsContent value="demographics">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {demographics.ageGroups.map((group) => (
                      <div key={group.range}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{group.range}</span>
                          <span className="text-sm text-muted-foreground">
                            {group.count} ({group.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${group.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {demographics.gender.map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.label}</span>
                          <span className="text-sm text-muted-foreground">
                            {item.count} ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patterns">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Peak Ordering Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orderingPatterns.peakHours.map((item) => (
                      <div key={item.hour}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.hour}</span>
                          <span className="text-sm text-muted-foreground">{item.orders} orders</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(item.orders / 72) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Orders by Day of Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orderingPatterns.popularDays.map((item) => (
                      <div key={item.day}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.day}</span>
                          <span className="text-sm text-muted-foreground">{item.orders} orders</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(item.orders / 185) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="locations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Top Delivery Areas
                </CardTitle>
                <CardDescription>Orders by delivery location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerMetrics.topDeliveryAreas.map((area) => (
                    <div key={area.area}>
                      <div className="flex justify-between mb-2">
                        <div>
                          <p className="font-semibold">{area.area}</p>
                          <p className="text-sm text-muted-foreground">{area.orders} orders</p>
                        </div>
                        <span className="text-sm font-medium">{area.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${area.percentage}%` }}
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
    </Layout>
  );
};

export default CustomerInsights;

