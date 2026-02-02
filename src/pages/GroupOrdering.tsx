"use client";

import React, { useMemo, useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrders } from "@/context/OrdersContext";
import { useAuth } from "@/context/AuthContext";
import { Copy, Users, Pizza, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

const GroupOrdering: React.FC = () => {
  const { groupOrders, createGroupOrder, addParticipantToGroup } = useOrders();
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Array<{ id: string; name: string; cuisine: string }>>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [participantName, setParticipantName] = useState(user?.name ?? "");
  const [participantItem, setParticipantItem] = useState("");
  const [participantQty, setParticipantQty] = useState(1);
  const [participantPrice, setParticipantPrice] = useState(10);

  const activeOrder = groupOrders[0];
  useEffect(() => {
    setParticipantName(user?.name ?? "");
  }, [user]);

  useEffect(() => {
    let active = true;
    const loadRestaurants = async () => {
      const { data } = await supabase.from("restaurants").select("id, name, cuisine").order("name");
      if (!active) return;
      setRestaurants(data || []);
      if (!selectedRestaurantId && data?.length) {
        setSelectedRestaurantId(data[0].id);
      }
    };
    loadRestaurants();
    return () => {
      active = false;
    };
  }, [selectedRestaurantId]);
  const restaurantOptions = useMemo(
    () =>
      restaurants.map((restaurant) => (
        <option key={restaurant.id} value={restaurant.id}>
          {restaurant.name} · {restaurant.cuisine}
        </option>
      )),
    [restaurants]
  );

  const handleCreateGroup = () => {
    const restaurant = restaurants.find((r) => r.id === selectedRestaurantId);
    if (!restaurant) return;
    const group = createGroupOrder({
      hostId: user?.id ?? "guest",
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      closesAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      fees: { delivery: 4.99, service: 2.0 },
    });
    toast.success(`Group order opened for ${group.restaurantName}`);
  };

  const handleCopyInvite = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Invite code copied!");
  };

  const handleJoinOrder = () => {
    if (!activeOrder) {
      toast.error("No active group order to join.");
      return;
    }
    if (joinCode !== activeOrder.inviteCode) {
      toast.error("Invite code mismatch.");
      return;
    }
    addParticipantToGroup(activeOrder.id, {
      userId: user?.id ?? `guest-${Date.now()}`,
      name: participantName || "Guest",
      items: [
        {
          menuItemId: `custom-${Date.now()}`,
          name: participantItem || "Custom item",
          quantity: participantQty,
          price: participantPrice,
        },
      ],
      total: participantQty * participantPrice,
    });
    toast.success("Added to group order!");
    setParticipantItem("");
    setParticipantQty(1);
    setParticipantPrice(10);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase text-muted-foreground tracking-wide">Group Ordering</p>
            <h1 className="text-4xl font-bold text-foreground">Eat Together, Pay Separately</h1>
            <p className="text-muted-foreground">
              Host a shared cart or jump into an existing session. Everyone adds their favorites, we handle the math.
            </p>
          </div>
          <Button size="lg" onClick={handleCreateGroup}>
            <Users className="h-4 w-4 mr-2" />
            Start New Group
          </Button>
        </div>

        {activeOrder ? (
          <Card className="border-primary/20">
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="flex items-center gap-3">
                  <Pizza className="h-5 w-5 text-primary" />
                  {activeOrder.restaurantName}
                </CardTitle>
                <p className="text-sm text-muted-foreground">Invite code: {activeOrder.inviteCode}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Closes {new Date(activeOrder.closesAt).toLocaleTimeString()}</Badge>
                <Button variant="outline" size="sm" onClick={() => handleCopyInvite(activeOrder.inviteCode)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeOrder.participants.map((participant) => (
                  <div key={participant.userId} className="rounded-xl border p-4 bg-muted/40">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">{participant.name}</p>
                      <Badge variant="outline">${participant.total.toFixed(2)}</Badge>
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {participant.items.map((item) => (
                        <li key={item.menuItemId}>
                          {item.quantity}x {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Join this order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="join-code">Invite code</Label>
                      <Input id="join-code" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder="FOOD-1234" />
                    </div>
                    <div>
                      <Label htmlFor="participant-name">Your name</Label>
                      <Input id="participant-name" value={participantName} onChange={(e) => setParticipantName(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="participant-item">What are you craving?</Label>
                      <Input
                        id="participant-item"
                        value={participantItem}
                        onChange={(e) => setParticipantItem(e.target.value)}
                        placeholder="Smoky BBQ Burger"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Qty</Label>
                        <Input
                          type="number"
                          min={1}
                          value={participantQty}
                          onChange={(e) => setParticipantQty(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Price</Label>
                        <Input
                          type="number"
                          min={1}
                          step="0.5"
                          value={participantPrice}
                          onChange={(e) => setParticipantPrice(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <Button onClick={handleJoinOrder} disabled={!joinCode}>
                      Join Order
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Host new session</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="restaurant">Restaurant</Label>
                      <select
                        id="restaurant"
                        className="w-full rounded-md border border-input bg-background p-2 text-sm"
                        value={selectedRestaurantId}
                        onChange={(e) => setSelectedRestaurantId(e.target.value)}
                      >
                        {restaurantOptions}
                      </select>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We'll keep this order open for 45 minutes so your friends can add their dishes.
                    </p>
                    <Button onClick={handleCreateGroup}>
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Generate Invite
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No active group orders</h2>
              <p className="text-muted-foreground mb-6">Kick off a shared cart and invite your friends.</p>
              <Button onClick={handleCreateGroup}>Start Group</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default GroupOrdering;

