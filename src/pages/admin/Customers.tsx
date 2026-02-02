"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, Eye, Mail } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [orders, setOrders] = useState<Array<{ id: string; user_id: string | null; total: number; created_at: string }>>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      const [{ data: profileRows }, { data: orderRows }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email").order("created_at", { ascending: false }),
        supabase.from("orders").select("id, user_id, total, created_at").order("created_at", { ascending: false }),
      ]);
      if (!active) return;
      setCustomers(
        (profileRows || []).map((profile) => ({
          id: profile.id,
          name: profile.full_name || "Customer",
          email: profile.email || "",
        }))
      );
      setOrders(
        (orderRows || []).map((order) => ({
          id: order.id,
          user_id: order.user_id,
          total: Number(order.total),
          created_at: order.created_at,
        }))
      );
    };
    loadData();
    return () => {
      active = false;
    };
  }, []);

  const customersWithStats = useMemo(() => {
    return customers.map((user) => {
      const userOrders = orders.filter((order) => order.user_id === user.id);
      const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
      return {
        ...user,
        totalOrders: userOrders.length,
        totalSpent,
        lastOrder: userOrders.length > 0 ? userOrders[0].created_at : null,
      };
    });
  }, [customers, orders]);

  const filteredCustomers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return customersWithStats;
    return customersWithStats.filter(
      (customer) =>
        customer.name.toLowerCase().includes(normalized) ||
        customer.email.toLowerCase().includes(normalized) ||
        customer.id.toLowerCase().includes(normalized)
    );
  }, [customersWithStats, query]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Customer Management</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Customers</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {customer.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {customer.email}
                      </div>
                    </TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                    <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                    <TableCell>
                      {customer.lastOrder
                        ? new Date(customer.lastOrder).toLocaleDateString()
                        : "No orders"}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Active</Badge>
                    </TableCell>
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

export default Customers;

