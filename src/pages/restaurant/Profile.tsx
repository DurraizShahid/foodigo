"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { Building, Clock, MapPin, Phone, Mail, Globe, Save } from "lucide-react";
import { toast } from "sonner";
import { restaurants } from "@/data/dummyData";

const RestaurantProfile: React.FC = () => {
  const restaurant = restaurants[0]; // In real app, get from auth context
  const [profile, setProfile] = useState({
    name: restaurant.name,
    description: restaurant.description,
    address: restaurant.address,
    phone: "+1 (555) 123-4567",
    email: "contact@pizzapalace.com",
    website: "https://pizzapalace.com",
    cuisine: restaurant.cuisine,
    isOpen: true,
  });

  const [hours, setHours] = useState({
    monday: { open: "09:00", close: "22:00", isOpen: true },
    tuesday: { open: "09:00", close: "22:00", isOpen: true },
    wednesday: { open: "09:00", close: "22:00", isOpen: true },
    thursday: { open: "09:00", close: "22:00", isOpen: true },
    friday: { open: "09:00", close: "23:00", isOpen: true },
    saturday: { open: "10:00", close: "23:00", isOpen: true },
    sunday: { open: "11:00", close: "21:00", isOpen: true },
  });

  const [deliveryZones, setDeliveryZones] = useState([
    { id: "1", name: "Downtown", radius: 5, fee: 2.99 },
    { id: "2", name: "Suburbs", radius: 10, fee: 4.99 },
  ]);

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const handleSaveHours = () => {
    toast.success("Operating hours updated!");
  };

  const handleAddZone = () => {
    setDeliveryZones([
      ...deliveryZones,
      { id: Date.now().toString(), name: "", radius: 5, fee: 2.99 },
    ]);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Restaurant Profile</h1>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="hours">Operating Hours</TabsTrigger>
            <TabsTrigger value="delivery">Delivery Zones</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>Update your restaurant details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuisine">Cuisine Type</Label>
                  <Input
                    id="cuisine"
                    value={profile.cuisine}
                    onChange={(e) => setProfile({ ...profile, cuisine: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={profile.description}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <Label htmlFor="isOpen">Restaurant Status</Label>
                    <p className="text-sm text-muted-foreground">Currently accepting orders</p>
                  </div>
                  <Switch
                    id="isOpen"
                    checked={profile.isOpen}
                    onCheckedChange={(checked) => setProfile({ ...profile, isOpen: checked })}
                  />
                </div>
                <Button onClick={handleSaveProfile} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Operating Hours
                </CardTitle>
                <CardDescription>Set your restaurant's operating schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(hours).map(([day, schedule]) => (
                  <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-24">
                      <Label className="capitalize font-semibold">{day}</Label>
                    </div>
                    <Switch
                      checked={schedule.isOpen}
                      onCheckedChange={(checked) =>
                        setHours({ ...hours, [day]: { ...schedule, isOpen: checked } })
                      }
                    />
                    {schedule.isOpen ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="time"
                          value={schedule.open}
                          onChange={(e) =>
                            setHours({ ...hours, [day]: { ...schedule, open: e.target.value } })
                          }
                          className="w-32"
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          value={schedule.close}
                          onChange={(e) =>
                            setHours({ ...hours, [day]: { ...schedule, close: e.target.value } })
                          }
                          className="w-32"
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Closed</span>
                    )}
                  </div>
                ))}
                <Button onClick={handleSaveHours} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Hours
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivery">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Zones
                </CardTitle>
                <CardDescription>Configure delivery areas and fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {deliveryZones.map((zone) => (
                  <div key={zone.id} className="p-4 border rounded-lg space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Zone Name</Label>
                        <Input
                          value={zone.name}
                          onChange={(e) =>
                            setDeliveryZones(
                              deliveryZones.map((z) => (z.id === zone.id ? { ...z, name: e.target.value } : z))
                            )
                          }
                          placeholder="e.g., Downtown"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Radius (km)</Label>
                        <Input
                          type="number"
                          value={zone.radius}
                          onChange={(e) =>
                            setDeliveryZones(
                              deliveryZones.map((z) =>
                                z.id === zone.id ? { ...z, radius: Number(e.target.value) } : z
                              )
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Delivery Fee ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={zone.fee}
                          onChange={(e) =>
                            setDeliveryZones(
                              deliveryZones.map((z) =>
                                z.id === zone.id ? { ...z, fee: Number(e.target.value) } : z
                              )
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={handleAddZone} className="w-full">
                  Add Delivery Zone
                </Button>
                <Button className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Zones
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RestaurantProfile;

