"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Navigation as NavIcon, MapPin, Clock, Package } from "lucide-react";

const Navigation: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<{
    from: { name: string; address: string; lat: number; lng: number };
    to: { name: string; address: string; lat: number; lng: number };
    distance: string;
    duration: string;
  } | null>({
    from: {
      name: "Pizza Palace",
      address: "123 Main St, Cityville",
      lat: 37.7749,
      lng: -122.4194,
    },
    to: {
      name: "Customer Location",
      address: "456 Oak Ave, Cityville",
      lat: 37.7849,
      lng: -122.4094,
    },
    distance: "2.5 km",
    duration: "8 min",
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-foreground">GPS Navigation</h1>

        {currentRoute ? (
          <>
            {/* Route Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <NavIcon className="h-5 w-5" />
                  Active Route
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Pickup</span>
                    </div>
                    <p className="font-semibold">{currentRoute.from.name}</p>
                    <p className="text-sm text-muted-foreground">{currentRoute.from.address}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Delivery</span>
                    </div>
                    <p className="font-semibold">{currentRoute.to.name}</p>
                    <p className="text-sm text-muted-foreground">{currentRoute.to.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{currentRoute.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{currentRoute.distance}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardContent className="p-0">
                <div className="bg-muted rounded-lg h-96 flex items-center justify-center relative">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-semibold mb-2">Live Navigation Map</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Google Maps integration ready
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>📍 Pickup: {currentRoute.from.lat.toFixed(4)}, {currentRoute.from.lng.toFixed(4)}</p>
                      <p>📍 Delivery: {currentRoute.to.lat.toFixed(4)}, {currentRoute.to.lng.toFixed(4)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Controls */}
            <div className="flex gap-4">
              <Button className="flex-1" size="lg">
                <NavIcon className="mr-2 h-5 w-5" />
                Start Navigation
              </Button>
              <Button variant="outline" size="lg">
                View Route Details
              </Button>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-semibold mb-2">No Active Route</p>
              <p className="text-sm text-muted-foreground">
                Accept an order to start navigation
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Navigation;

