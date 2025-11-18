"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useOrders } from "@/context/OrdersContext";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { CalendarDays, Clock, MapPin, Package, Repeat } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ScheduledOrders: React.FC = () => {
  const { scheduledOrders, cancelScheduledOrder, rescheduleOrder } = useOrders();
  const { user } = useAuth();
  const [rescheduleTarget, setRescheduleTarget] = useState<string | null>(null);
  const [rescheduleTime, setRescheduleTime] = useState("");

  const ordersForUser = scheduledOrders.filter((order) => (user ? order.userId === user.id : true));

  const handleReschedule = (orderId: string) => {
    if (!rescheduleTime) return;
    rescheduleOrder(orderId, rescheduleTime);
    setRescheduleTarget(null);
    setRescheduleTime("");
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase text-muted-foreground tracking-wide">Smart Scheduling</p>
            <h1 className="text-4xl font-bold text-foreground">Upcoming Deliveries</h1>
            <p className="text-muted-foreground">
              Manage future orders, make tweaks, or start a brand-new scheduled delivery.
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/checkout">Schedule Something New</Link>
          </Button>
        </div>

        {ordersForUser.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No upcoming orders</h2>
              <p className="text-muted-foreground mb-6">Plan ahead and schedule dinner for later this week.</p>
              <Button asChild>
                <Link to="/">Browse Restaurants</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {ordersForUser.map((order) => {
              const formattedDelivery = new Date(order.deliveryTime).toLocaleString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <Card key={order.id} className="border-primary/20">
                  <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        {order.restaurantName}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={order.status === "Canceled" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}
                    >
                      {order.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="flex items-center gap-3 rounded-lg border p-3">
                        <CalendarDays className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Delivery time</p>
                          <p className="font-semibold">{formattedDelivery}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg border p-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Address</p>
                          <p className="font-semibold">{order.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg border p-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Reminder</p>
                          <p className="font-semibold">30 min before</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-2">Items</p>
                      <div className="space-y-2 rounded-lg border p-3 bg-muted/40">
                        {order.items.map((item) => (
                          <div key={item.menuItemId} className="flex justify-between text-sm">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.notes && (
                      <div className="rounded-lg border p-3 text-sm bg-muted/50">
                        <span className="font-semibold">Notes:</span> {order.notes}
                      </div>
                    )}

                    <Separator />

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      {rescheduleTarget === order.id ? (
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3 flex-1">
                          <Input
                            type="datetime-local"
                            value={rescheduleTime}
                            onChange={(e) => setRescheduleTime(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button onClick={() => handleReschedule(order.id)} disabled={!rescheduleTime}>
                              Save
                            </Button>
                            <Button variant="ghost" onClick={() => setRescheduleTarget(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground flex-1">
                          Auto-reminders will notify you before this order starts prepping.
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setRescheduleTarget(order.id);
                            setRescheduleTime(order.deliveryTime.slice(0, 16));
                          }}
                          disabled={order.status === "Canceled"}
                        >
                          <Repeat className="h-4 w-4 mr-2" />
                          Reschedule
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => cancelScheduledOrder(order.id)}
                          disabled={order.status === "Canceled"}
                        >
                          Cancel Order
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ScheduledOrders;

