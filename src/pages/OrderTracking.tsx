"use client";

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { MapPin, Clock, CheckCircle2, Package, Truck, Home } from "lucide-react";
import { orders, restaurants } from "@/data/dummyData";
import { toast } from "sonner";

const OrderTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const order = orders.find((o) => o.id === id);
  const restaurant = order ? restaurants.find((r) => r.id === order.restaurantId) : null;

  const [currentStatus, setCurrentStatus] = useState(order?.status || "Pending");
  const [driverLocation, setDriverLocation] = useState({ lat: 37.7749, lng: -122.4194 });

  const statusSteps = [
    { key: "Pending", label: "Order Placed", icon: Package },
    { key: "Preparing", label: "Preparing", icon: Clock },
    { key: "On the way", label: "On the way", icon: Truck },
    { key: "Delivered", label: "Delivered", icon: Home },
  ];

  const currentStepIndex = statusSteps.findIndex((step) => step.key === currentStatus);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatus((prev) => {
        const currentIndex = statusSteps.findIndex((step) => step.key === prev);
        if (currentIndex < statusSteps.length - 1) {
          const nextStatus = statusSteps[currentIndex + 1].key;
          toast(`Order update: ${nextStatus}`, {
            description: `Your driver is now at the ${nextStatus.toLowerCase()} stage.`,
          });
          return nextStatus;
        }
        return prev;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!order || !restaurant) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Order not found</h1>
          <Button asChild>
            <Link to="/orders">Back to Orders</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Track Your Order</h1>
          <Button variant="outline" asChild>
            <Link to="/orders">Back to Orders</Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
              <p className="text-sm text-muted-foreground">Order #{order.id.slice(-6).toUpperCase()}</p>
            </div>

            {/* Order Status Timeline */}
            <div className="space-y-4 mb-6">
              {statusSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.key} className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-medium ${isCurrent ? "text-primary" : ""}`}>{step.label}</p>
                        {isCurrent && <Badge variant="outline">Current</Badge>}
                      </div>
                      {isCurrent && step.key === "Preparing" && (
                        <p className="text-sm text-muted-foreground">Your order is being prepared</p>
                      )}
                      {isCurrent && step.key === "On the way" && (
                        <p className="text-sm text-muted-foreground">Driver is on the way to you</p>
                      )}
                      {isCurrent && step.key === "Delivered" && (
                        <p className="text-sm text-muted-foreground">Order has been delivered</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Estimated Time */}
            <div className="bg-muted p-4 rounded-lg mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-semibold">Estimated Delivery Time</span>
              </div>
              <p className="text-2xl font-bold">15-20 minutes</p>
            </div>

            {/* Map Placeholder */}
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center mb-4">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Live map tracking coming soon</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Driver location: {driverLocation.lat.toFixed(4)}, {driverLocation.lng.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Order Items</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold mt-4 pt-4 border-t">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OrderTracking;

