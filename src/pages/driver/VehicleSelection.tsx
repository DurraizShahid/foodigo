"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { Bike, Car, Truck, CheckCircle2, MapPin, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  type: "bike" | "car" | "truck";
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  avgSpeed: string;
  capacity: string;
  earningsMultiplier: number;
  available: boolean;
}

const VehicleSelection: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("bike");
  const [vehicles] = useState<Vehicle[]>([
    {
      id: "bike",
      type: "bike",
      name: "Motorcycle/Bike",
      icon: Bike,
      description: "Fast and efficient for short distances",
      avgSpeed: "15-20 min",
      capacity: "1-2 orders",
      earningsMultiplier: 1.0,
      available: true,
    },
    {
      id: "car",
      type: "car",
      name: "Car",
      icon: Car,
      description: "Comfortable for longer distances and larger orders",
      avgSpeed: "20-30 min",
      capacity: "2-4 orders",
      earningsMultiplier: 1.2,
      available: true,
    },
    {
      id: "truck",
      type: "truck",
      name: "Truck/Van",
      icon: Truck,
      description: "Best for bulk orders and catering",
      avgSpeed: "25-35 min",
      capacity: "5+ orders",
      earningsMultiplier: 1.5,
      available: true,
    },
  ]);

  const currentVehicle = vehicles.find((v) => v.id === selectedVehicle);

  const handleSaveSelection = () => {
    toast.success(`Vehicle type set to: ${currentVehicle?.name}`);
    // In real app, this would update the driver's profile
  };

  const availableOrders = [
    {
      id: "1",
      restaurant: "Pizza Palace",
      distance: "2.5 km",
      estimatedEarnings: 8.50,
      vehicleType: "bike",
    },
    {
      id: "2",
      restaurant: "Burger Joint",
      distance: "5.0 km",
      estimatedEarnings: 12.00,
      vehicleType: "car",
    },
    {
      id: "3",
      restaurant: "Sushi House",
      distance: "8.0 km",
      estimatedEarnings: 18.00,
      vehicleType: "truck",
    },
  ];

  const filteredOrders = availableOrders.filter(
    (order) => order.vehicleType === selectedVehicle || selectedVehicle === "all"
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Vehicle Selection</h1>

        <Card>
          <CardHeader>
            <CardTitle>Select Your Vehicle Type</CardTitle>
            <CardDescription>
              Choose your vehicle to receive appropriate delivery orders. Your selection affects which orders you'll see.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedVehicle} onValueChange={setSelectedVehicle} className="space-y-4">
              {vehicles.map((vehicle) => {
                const VehicleIcon = vehicle.icon;
                const isSelected = selectedVehicle === vehicle.id;
                return (
                  <div key={vehicle.id}>
                    <RadioGroupItem value={vehicle.id} id={vehicle.id} className="peer sr-only" />
                    <Label
                      htmlFor={vehicle.id}
                      className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <VehicleIcon className={`h-8 w-8 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                          {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{vehicle.description}</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Avg Speed</p>
                            <p className="font-medium flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {vehicle.avgSpeed}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Capacity</p>
                            <p className="font-medium">{vehicle.capacity}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Earnings</p>
                            <p className="font-medium flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {vehicle.earningsMultiplier}x multiplier
                            </p>
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
            <Button onClick={handleSaveSelection} className="w-full mt-6" size="lg">
              Save Vehicle Selection
            </Button>
          </CardContent>
        </Card>

        {/* Available Orders Based on Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Available Orders for {currentVehicle?.name}</CardTitle>
            <CardDescription>
              Orders matching your selected vehicle type
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No orders available for this vehicle type at the moment</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{order.restaurant}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {order.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${order.estimatedEarnings.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Button size="sm">Accept</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">With {currentVehicle?.name}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentVehicle?.avgSpeed}</div>
              <p className="text-xs text-muted-foreground">Per delivery</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Earnings Multiplier</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentVehicle?.earningsMultiplier}x</div>
              <p className="text-xs text-muted-foreground">Bonus earnings</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default VehicleSelection;

