"use client";

import React from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { experiments, fraudAlerts, cityOperations, adminInsights } from "@/data/dummyData";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const AdminOperations: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Operations Command Center</h1>
        <Card>
          <CardHeader>
            <CardTitle>Support Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {adminInsights.supportTickets.map((ticket) => (
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
                  <Badge variant={exp.status === "Running" ? "outline" : "secondary"}>{exp.status}</Badge>
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
                  <Switch id={`toggle-${city.id}`} defaultChecked={city.status === "Online"} />
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

