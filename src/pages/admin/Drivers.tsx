"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<
    Array<{
      id: string;
      name: string;
      email: string;
      phone: string;
      vehicle: string;
      status: "Online" | "Offline";
      rating: number;
      totalDeliveries: number;
      totalEarnings: number;
    }>
  >([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    const loadDrivers = async () => {
      const [{ data: profileRows }, { data: vehicleRows }, { data: statsRows }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email, phone").eq("role", "driver").order("created_at", { ascending: false }),
        supabase.from("fleet_vehicles").select("id, driver_id, vehicle_type, status, total_deliveries, total_earnings"),
        supabase.from("driver_stats").select("driver_id, earnings"),
      ]);
      if (!active) return;
      const vehicleByDriver = new Map(
        (vehicleRows || [])
          .filter((vehicle) => vehicle.driver_id)
          .map((vehicle) => [
            vehicle.driver_id,
            {
              vehicleType: vehicle.vehicle_type,
              status: vehicle.status,
              totalDeliveries: vehicle.total_deliveries || 0,
              totalEarnings: Number(vehicle.total_earnings || 0),
            },
          ])
      );
      const statsByDriver = new Map(
        (statsRows || []).map((stat) => [
          stat.driver_id,
          (stat.earnings || { total: 0, completedDeliveries: 0, avgRating: 0 }) as {
            total?: number;
            completedDeliveries?: number;
            avgRating?: number;
          },
        ])
      );
      setDrivers(
        (profileRows || []).map((profile) => {
          const vehicle = vehicleByDriver.get(profile.id);
          const stats = statsByDriver.get(profile.id);
          const status = vehicle && (vehicle.status === "in_use" || vehicle.status === "available") ? "Online" : "Offline";
          return {
            id: profile.id,
            name: profile.full_name || "Driver",
            email: profile.email || "",
            phone: profile.phone || "",
            vehicle: vehicle?.vehicleType
              ? `${vehicle.vehicleType.charAt(0).toUpperCase()}${vehicle.vehicleType.slice(1)}`
              : "Unassigned",
            status,
            rating: Number(stats?.avgRating || 0),
            totalDeliveries: Number(stats?.completedDeliveries || vehicle?.totalDeliveries || 0),
            totalEarnings: Number(stats?.total || vehicle?.totalEarnings || 0),
          };
        })
      );
    };
    loadDrivers();
    return () => {
      active = false;
    };
  }, []);

  const filteredDrivers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return drivers;
    return drivers.filter(
      (driver) =>
        driver.name.toLowerCase().includes(normalized) ||
        driver.email.toLowerCase().includes(normalized) ||
        driver.phone.toLowerCase().includes(normalized)
    );
  }, [drivers, query]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Driver Management</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Driver
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Drivers</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search drivers..."
                    className="pl-9 w-64"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Deliveries</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{driver.name}</p>
                        <p className="text-sm text-muted-foreground">{driver.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{driver.phone}</TableCell>
                    <TableCell>{driver.vehicle}</TableCell>
                    <TableCell>
                      <Badge className={driver.status === "Online" ? "bg-green-500" : "bg-gray-500"}>
                        {driver.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span>{driver.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>{driver.totalDeliveries}</TableCell>
                    <TableCell>${driver.totalEarnings.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
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

export default Drivers;

