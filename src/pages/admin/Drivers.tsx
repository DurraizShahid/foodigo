"use client";

import React from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";

const Drivers: React.FC = () => {
  const drivers = [
    {
      id: "1",
      name: "John Driver",
      email: "john@example.com",
      phone: "+1234567890",
      vehicle: "Bike",
      status: "Online",
      rating: 4.8,
      totalDeliveries: 125,
      totalEarnings: 2500,
    },
    {
      id: "2",
      name: "Jane Rider",
      email: "jane@example.com",
      phone: "+1234567891",
      vehicle: "Car",
      status: "Offline",
      rating: 4.9,
      totalDeliveries: 200,
      totalEarnings: 4000,
    },
  ];

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
                  <Input placeholder="Search drivers..." className="pl-9 w-64" />
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
                {drivers.map((driver) => (
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

