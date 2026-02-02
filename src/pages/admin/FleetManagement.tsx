"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, Plus, Edit, MapPin, DollarSign, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

interface FleetVehicle {
  id: string;
  vehicleType: "bike" | "car" | "truck";
  licensePlate: string;
  driverId?: string;
  driverName?: string;
  status: "available" | "in_use" | "maintenance" | "offline";
  location: { lat: number; lng: number; address: string };
  lastMaintenance: string;
  nextMaintenance: string;
  totalDeliveries: number;
  totalEarnings: number;
}

interface FleetDriver {
  id: string;
  name: string;
  vehicleId?: string;
  vehicleType?: string;
  status: "active" | "inactive";
  totalDeliveries: number;
  rating: number;
}

const FleetManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [drivers, setDrivers] = useState<FleetDriver[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleType: "car" as FleetVehicle["vehicleType"],
    licensePlate: "",
    driverId: "",
  });

  useEffect(() => {
    let active = true;
    const loadFleet = async () => {
      const [{ data: vehicleRows }, { data: driverRows }] = await Promise.all([
        supabase
          .from("fleet_vehicles")
          .select(
            "id, vehicle_type, license_plate, driver_id, status, location_lat, location_lng, location_address, last_maintenance, next_maintenance, total_deliveries, total_earnings"
          )
          .order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, full_name").eq("role", "driver").order("full_name"),
      ]);
      if (!active) return;
      const driverMap = new Map((driverRows || []).map((driver) => [driver.id, driver.full_name || "Driver"]));
      setDrivers(
        (driverRows || []).map((driver) => ({
          id: driver.id,
          name: driver.full_name || "Driver",
          status: "active",
          totalDeliveries: 0,
          rating: 0,
        }))
      );
      setVehicles(
        (vehicleRows || []).map((vehicle) => ({
          id: vehicle.id,
          vehicleType: vehicle.vehicle_type as FleetVehicle["vehicleType"],
          licensePlate: vehicle.license_plate,
          driverId: vehicle.driver_id || undefined,
          driverName: vehicle.driver_id ? driverMap.get(vehicle.driver_id) : undefined,
          status: vehicle.status as FleetVehicle["status"],
          location: {
            lat: Number(vehicle.location_lat || 0),
            lng: Number(vehicle.location_lng || 0),
            address: vehicle.location_address || "Fleet Depot",
          },
          lastMaintenance: vehicle.last_maintenance || "",
          nextMaintenance: vehicle.next_maintenance || "",
          totalDeliveries: vehicle.total_deliveries || 0,
          totalEarnings: Number(vehicle.total_earnings || 0),
        }))
      );
    };
    loadFleet();
    return () => {
      active = false;
    };
  }, []);

  const handleAddVehicle = async () => {
    if (!formData.licensePlate) {
      toast.error("Please enter license plate");
      return;
    }
    const newVehicle: FleetVehicle = {
      id: `VH-${Date.now()}`,
      vehicleType: formData.vehicleType,
      licensePlate: formData.licensePlate,
      driverId: formData.driverId || undefined,
      driverName: formData.driverId
        ? drivers.find((d) => d.id === formData.driverId)?.name
        : undefined,
      status: "available",
      location: { lat: 37.7749, lng: -122.4194, address: "Fleet Depot" },
      lastMaintenance: new Date().toISOString().split("T")[0],
      nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      totalDeliveries: 0,
      totalEarnings: 0,
    };
    const { error } = await supabase.from("fleet_vehicles").insert({
      id: newVehicle.id,
      vehicle_type: newVehicle.vehicleType,
      license_plate: newVehicle.licensePlate,
      driver_id: newVehicle.driverId || null,
      status: newVehicle.status,
      location_lat: newVehicle.location.lat,
      location_lng: newVehicle.location.lng,
      location_address: newVehicle.location.address,
      last_maintenance: newVehicle.lastMaintenance,
      next_maintenance: newVehicle.nextMaintenance,
      total_deliveries: newVehicle.totalDeliveries,
      total_earnings: newVehicle.totalEarnings,
    });
    if (error) {
      toast.error("Failed to add vehicle");
      return;
    }
    setVehicles((prev) => [newVehicle, ...prev]);
    setFormData({ vehicleType: "car", licensePlate: "", driverId: "" });
    setIsDialogOpen(false);
    toast.success("Vehicle added to fleet!");
  };

  const handleAssignDriver = async (vehicleId: string, driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, driverId, driverName: driver?.name } : v))
    );
    const { error } = await supabase.from("fleet_vehicles").update({ driver_id: driverId || null }).eq("id", vehicleId);
    if (error) {
      toast.error("Failed to assign driver");
      return;
    }
    toast.success("Driver assigned to vehicle");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "in_use":
        return "bg-blue-500";
      case "maintenance":
        return "bg-yellow-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const fleetStats = useMemo(() => {
    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter((v) => v.status === "available").length;
    const inUseVehicles = vehicles.filter((v) => v.status === "in_use").length;
    const totalFleetEarnings = vehicles.reduce((sum, v) => sum + v.totalEarnings, 0);
    return { totalVehicles, availableVehicles, inUseVehicles, totalFleetEarnings };
  }, [vehicles]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Fleet Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Vehicle to Fleet</DialogTitle>
                <DialogDescription>Register a new vehicle in the fleet</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select
                    value={formData.vehicleType}
                    onValueChange={(value) => setFormData({ ...formData, vehicleType: value as FleetVehicle["vehicleType"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bike">Bike/Motorcycle</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="truck">Truck/Van</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input
                    id="licensePlate"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                    placeholder="ABC-1234"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverId">Assign Driver (Optional)</Label>
                  <Select
                    value={formData.driverId}
                    onValueChange={(value) => setFormData({ ...formData, driverId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No driver</SelectItem>
                      {drivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddVehicle} className="w-full">
                  Add Vehicle
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fleetStats.totalVehicles}</div>
              <p className="text-xs text-muted-foreground">In fleet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fleetStats.availableVehicles}</div>
              <p className="text-xs text-muted-foreground">Ready for use</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Use</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fleetStats.inUseVehicles}</div>
              <p className="text-xs text-muted-foreground">Active deliveries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fleet Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(fleetStats.totalFleetEarnings / 1000).toFixed(1)}K</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Vehicles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Vehicles</CardTitle>
            <CardDescription>Manage and track all vehicles in the fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>License Plate</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Deliveries</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.id}</TableCell>
                    <TableCell className="capitalize">{vehicle.vehicleType}</TableCell>
                    <TableCell>{vehicle.licensePlate}</TableCell>
                    <TableCell>
                      {vehicle.driverName ? (
                        <span>{vehicle.driverName}</span>
                      ) : (
                        <Select
                          value=""
                          onValueChange={(value) => handleAssignDriver(vehicle.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Assign" />
                          </SelectTrigger>
                          <SelectContent>
                            {drivers.map((driver) => (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(vehicle.status)}>
                        {vehicle.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {vehicle.location.address}
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.totalDeliveries}</TableCell>
                    <TableCell>${vehicle.totalEarnings.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Maintenance Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Schedule</CardTitle>
            <CardDescription>Upcoming maintenance for fleet vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Last Maintenance</TableHead>
                  <TableHead>Next Maintenance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => {
                  const nextMaintenanceDate = new Date(vehicle.nextMaintenance);
                  const daysUntil = Math.ceil(
                    (nextMaintenanceDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );
                  const isDue = daysUntil <= 7;
                  return (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">
                        {vehicle.licensePlate} ({vehicle.vehicleType})
                      </TableCell>
                      <TableCell>{new Date(vehicle.lastMaintenance).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(vehicle.nextMaintenance).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={isDue ? "destructive" : "default"}>
                          {isDue ? `${daysUntil} days left` : "Scheduled"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default FleetManagement;

