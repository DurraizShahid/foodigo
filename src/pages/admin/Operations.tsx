"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";

const AdminOperations: React.FC = () => {
  const [supportTickets, setSupportTickets] = useState<Array<{ id: string; type: string; status: string; priority: string }>>([]);
  const [fraudAlerts, setFraudAlerts] = useState<Array<{ id: string; type: string; risk: string; action?: string; city?: string }>>([]);
  const [experiments, setExperiments] = useState<Array<{ id: string; name: string; segment?: string; status?: string }>>([]);
  const [cityOperations, setCityOperations] = useState<Array<{ id: string; name: string; status: string; surge: string }>>([]);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      const [{ data: ticketRows }, { data: fraudRows }, { data: experimentRows }, { data: cityRows }] = await Promise.all([
        supabase.from("support_tickets").select("id, type, status, priority").order("updated_at", { ascending: false }).limit(6),
        supabase.from("fraud_alerts").select("id, type, risk, action, city").order("detected_at", { ascending: false }),
        supabase.from("experiments").select("id, name, segment, status").order("start_date", { ascending: false }),
        supabase.from("city_operations").select("id, name, status, surge").order("name"),
      ]);

      if (!active) return;
      setSupportTickets(
        (ticketRows || []).map((ticket) => ({
          id: ticket.id,
          type: ticket.type || "General",
          status: ticket.status || "Open",
          priority: ticket.priority || "low",
        }))
      );
      setFraudAlerts((fraudRows || []) as Array<{ id: string; type: string; risk: string; action?: string; city?: string }>);
      setExperiments((experimentRows || []) as Array<{ id: string; name: string; segment?: string; status?: string }>);
      setCityOperations((cityRows || []) as Array<{ id: string; name: string; status: string; surge: string }>);
    };
    loadData();
    return () => {
      active = false;
    };
  }, []);
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Operations Command Center</h1>
        <Card>
          <CardHeader>
            <CardTitle>Support Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {supportTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-semibold">{ticket.type}</p>
                  <p className="text-xs text-muted-foreground">Priority: {ticket.priority}</p>
                </div>
                <Badge variant={ticket.status === "Open" ? "destructive" : ticket.status === "Pending" ? "secondary" : "outline"}>
                  {ticket.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {fraudAlerts.map((alert) => (
                <div key={alert.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{alert.type}</p>
                    <Badge variant={alert.risk === "High" ? "destructive" : "secondary"}>{alert.risk}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.city}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    {alert.action}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>A/B Experiments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {experiments.map((exp) => (
                <div key={exp.id} className="rounded-lg border p-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{exp.name}</p>
                    <p className="text-xs text-muted-foreground">{exp.segment}</p>
                  </div>
                  <Badge variant={exp.status === "running" ? "outline" : "secondary"}>{exp.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>City Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cityOperations.map((city) => (
              <div key={city.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
                <div>
                  <p className="font-semibold">{city.name}</p>
                  <p className="text-xs text-muted-foreground">Surge status: {city.surge}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`toggle-${city.id}`} className="text-sm">
                    {city.status}
                  </Label>
                  <Switch id={`toggle-${city.id}`} defaultChecked={city.status === "online"} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminOperations;

