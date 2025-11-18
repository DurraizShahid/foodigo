"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { MapPin, TrendingUp } from "lucide-react";

const Heatmaps: React.FC = () => {
  const orderDensity = [
    { area: "Downtown", orders: 245, percentage: 35, lat: 37.7749, lng: -122.4194 },
    { area: "University District", orders: 180, percentage: 26, lat: 37.7849, lng: -122.4094 },
    { area: "Residential North", orders: 150, percentage: 21, lat: 37.7649, lng: -122.4294 },
    { area: "Business Park", orders: 125, percentage: 18, lat: 37.7949, lng: -122.3994 },
  ];

  const peakTimes = [
    { time: "12:00 PM", intensity: 85 },
    { time: "1:00 PM", intensity: 92 },
    { time: "6:00 PM", intensity: 78 },
    { time: "7:00 PM", intensity: 95 },
    { time: "8:00 PM", intensity: 88 },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Order Heatmaps</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Order Density by Location
            </CardTitle>
            <CardDescription>
              See where most orders are coming from to understand customer density
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Map Placeholder */}
            <div className="bg-muted rounded-lg h-96 flex items-center justify-center mb-6 relative">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold mb-2">Interactive Heatmap</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Google Maps integration ready for heatmap visualization
                </p>
              </div>
              {/* Heatmap overlay indicators */}
              {orderDensity.map((area, idx) => (
                <div
                  key={area.area}
                  className="absolute rounded-full bg-red-500 opacity-60 animate-pulse"
                  style={{
                    width: `${area.percentage * 4}px`,
                    height: `${area.percentage * 4}px`,
                    left: `${20 + idx * 25}%`,
                    top: `${30 + idx * 15}%`,
                  }}
                />
              ))}
            </div>

            {/* Order Density List */}
            <div className="space-y-3">
              {orderDensity.map((area) => (
                <div key={area.area} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{area.area}</p>
                      <p className="text-sm text-muted-foreground">
                        {area.orders} orders ({area.percentage}%)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${area.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{area.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Peak Order Times
            </CardTitle>
            <CardDescription>Order intensity throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {peakTimes.map((time) => (
                <div key={time.time}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{time.time}</span>
                    <span className="text-sm text-muted-foreground">{time.intensity}% intensity</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${time.intensity}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Heatmaps;

