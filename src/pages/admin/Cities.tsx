"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Plus, Edit, Globe, Activity } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";

interface City {
  id: string;
  name: string;
  country: string;
  status: "online" | "offline" | "maintenance";
  surge: "low" | "medium" | "high" | "N/A";
  restaurants: number;
  drivers: number;
  orders: number;
  revenue: number;
}

const Cities: React.FC = () => {
  const { cityOperations } = useData();
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    if (!cities.length && cityOperations.length) {
      setCities(cityOperations as City[]);
    }
  }, [cities.length, cityOperations]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
  });

  const handleToggleStatus = (cityId: string) => {
    setCities(
      cities.map((city) => {
        if (city.id === cityId) {
          const newStatus =
            city.status === "online" ? "offline" : city.status === "offline" ? "maintenance" : "online";
          return { ...city, status: newStatus };
        }
        return city;
      })
    );
    toast.success("City status updated");
  };

  const handleAddCity = () => {
    if (!formData.name || !formData.country) {
      toast.error("Please fill in all fields");
      return;
    }
    const newCity: City = {
      id: `city${Date.now()}`,
      ...formData,
      status: "offline",
      surge: "N/A",
      restaurants: 0,
      drivers: 0,
      orders: 0,
      revenue: 0,
    };
    setCities([...cities, newCity]);
    setFormData({ name: "", country: "" });
    setIsDialogOpen(false);
    toast.success("City added successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
      case "maintenance":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSurgeColor = (surge: string) => {
    switch (surge) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Multi-City Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add City
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New City</DialogTitle>
                <DialogDescription>Add a new city to the platform</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">City Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g., USA"
                  />
                </div>
                <Button onClick={handleAddCity} className="w-full">
                  Add City
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cities</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cities.length}</div>
              <p className="text-xs text-muted-foreground">Active locations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Online Cities</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cities.filter((c) => c.status === "online").length}
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cities.reduce((sum, c) => sum + c.restaurants, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Across all cities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cities.reduce((sum, c) => sum + c.drivers, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Across all cities</p>
            </CardContent>
          </Card>
        </div>

        {/* Cities Table */}
        <Card>
          <CardHeader>
            <CardTitle>City Operations</CardTitle>
            <CardDescription>Manage cities and their operational status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>City</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Surge</TableHead>
                  <TableHead>Restaurants</TableHead>
                  <TableHead>Drivers</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cities.map((city) => (
                  <TableRow key={city.id}>
                    <TableCell className="font-medium">{city.name}</TableCell>
                    <TableCell>{city.country}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(city.status)}>{city.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSurgeColor(city.surge)}>{city.surge}</Badge>
                    </TableCell>
                    <TableCell>{city.restaurants}</TableCell>
                    <TableCell>{city.drivers}</TableCell>
                    <TableCell>{city.orders.toLocaleString()}</TableCell>
                    <TableCell>${city.revenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={city.status === "online"}
                          onCheckedChange={() => handleToggleStatus(city.id)}
                        />
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Cities;

