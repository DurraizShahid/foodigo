"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { Clock, TrendingUp, Star, CheckCircle2, XCircle } from "lucide-react";

const Analytics: React.FC = () => {
  const performanceMetrics = {
    totalDeliveries: 342,
    averageDeliveryTime: 28,
    onTimeRate: 94,
    acceptanceRate: 87,
    customerRating: 4.8,
    totalEarnings: 8542.50,
    weeklyStats: [
      { day: "Mon", deliveries: 12, earnings: 240 },
      { day: "Tue", deliveries: 15, earnings: 300 },
      { day: "Wed", deliveries: 18, earnings: 360 },
      { day: "Thu", deliveries: 14, earnings: 280 },
      { day: "Fri", deliveries: 22, earnings: 440 },
      { day: "Sat", deliveries: 20, earnings: 400 },
      { day: "Sun", deliveries: 16, earnings: 320 },
    ],
    timeOfDay: [
      { period: "Morning (6-12)", deliveries: 45, percentage: 13 },
      { period: "Afternoon (12-18)", deliveries: 125, percentage: 37 },
      { period: "Evening (18-24)", deliveries: 172, percentage: 50 },
    ],
    topAreas: [
      { area: "Downtown", deliveries: 98, avgTime: 25 },
      { area: "University District", deliveries: 76, avgTime: 22 },
      { area: "Residential North", deliveries: 65, avgTime: 30 },
      { area: "Business Park", deliveries: 52, avgTime: 28 },
    ],
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Performance Analytics</h1>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.totalDeliveries}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.averageDeliveryTime} min</div>
              <p className="text-xs text-muted-foreground">Per delivery</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.onTimeRate}%</div>
              <p className="text-xs text-muted-foreground">Excellent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.customerRating}</div>
              <p className="text-xs text-muted-foreground">Based on reviews</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="weekly" className="w-full">
          <TabsList>
            <TabsTrigger value="weekly">Weekly Performance</TabsTrigger>
            <TabsTrigger value="time">Time Analysis</TabsTrigger>
            <TabsTrigger value="areas">Delivery Areas</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Delivery Stats</CardTitle>
                <CardDescription>Deliveries and earnings by day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.weeklyStats.map((stat) => (
                    <div key={stat.day}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{stat.day}</span>
                        <span className="text-sm text-muted-foreground">
                          {stat.deliveries} deliveries • ${stat.earnings}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(stat.deliveries / 22) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time">
            <Card>
              <CardHeader>
                <CardTitle>Deliveries by Time of Day</CardTitle>
                <CardDescription>When you're most active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.timeOfDay.map((item) => (
                    <div key={item.period}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{item.period}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.deliveries} deliveries ({item.percentage}%)
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
          </TabsContent>

          <TabsContent value="areas">
            <Card>
              <CardHeader>
                <CardTitle>Top Delivery Areas</CardTitle>
                <CardDescription>Performance by location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.topAreas.map((area) => (
                    <div key={area.area} className="p-4 border rounded-lg">
                      <div className="flex justify-between mb-2">
                        <p className="font-semibold">{area.area}</p>
                        <span className="text-sm text-muted-foreground">
                          {area.deliveries} deliveries
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Avg time: {area.avgTime} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Acceptance Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Acceptance Rate</CardTitle>
            <CardDescription>Orders accepted vs declined</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Accepted</span>
                  <span className="text-sm text-muted-foreground">
                    {performanceMetrics.acceptanceRate}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${performanceMetrics.acceptanceRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Declined</span>
                  <span className="text-sm text-muted-foreground">
                    {100 - performanceMetrics.acceptanceRate}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${100 - performanceMetrics.acceptanceRate}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;

