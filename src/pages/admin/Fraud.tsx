"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Shield, CheckCircle2, XCircle, Eye } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";

interface FraudAlert {
  id: string;
  type: string;
  risk: "low" | "medium" | "high" | "critical";
  orderId?: string;
  userId?: string;
  description: string;
  detectedAt: string;
  status: "new" | "investigating" | "resolved" | "false_positive";
  score: number;
}

const Fraud: React.FC = () => {
  const { fraudAlerts } = useData();
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);

  useEffect(() => {
    if (!alerts.length && fraudAlerts.length) {
      setAlerts(fraudAlerts as FraudAlert[]);
    }
  }, [alerts.length, fraudAlerts]);

  const handleUpdateStatus = (alertId: string, newStatus: FraudAlert["status"]) => {
    setAlerts(alerts.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a)));
    toast.success("Alert status updated");
  };

  const handleResolve = (alertId: string, isFalsePositive: boolean) => {
    handleUpdateStatus(alertId, isFalsePositive ? "false_positive" : "resolved");
    toast.success(isFalsePositive ? "Marked as false positive" : "Alert resolved");
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "bg-red-600";
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-red-500";
      case "investigating":
        return "bg-blue-500";
      case "resolved":
        return "bg-green-500";
      case "false_positive":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const criticalAlerts = alerts.filter((a) => a.risk === "critical" || a.risk === "high");
  const newAlerts = alerts.filter((a) => a.status === "new");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Fraud Detection System</h1>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500">
              <AlertTriangle className="mr-1 h-3 w-3" />
              {newAlerts.length} New
            </Badge>
            <Badge className="bg-orange-500">
              {criticalAlerts.length} Critical
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts.length}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newAlerts.length}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {alerts.filter((a) => a.status === "resolved").length}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">False Positives</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {alerts.filter((a) => a.status === "false_positive").length}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Fraud Alerts</CardTitle>
            <CardDescription>AI-powered fraud detection alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Detected</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.id}</TableCell>
                    <TableCell>{alert.type}</TableCell>
                    <TableCell>
                      <Badge className={getRiskColor(alert.risk)}>{alert.risk}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${alert.score > 80 ? "bg-red-500" : alert.score > 60 ? "bg-yellow-500" : "bg-blue-500"}`}
                            style={{ width: `${alert.score}%` }}
                          />
                        </div>
                        <span className="text-sm">{alert.score}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{alert.orderId || "N/A"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(alert.detectedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{alert.type}</DialogTitle>
                            <DialogDescription>
                              <Badge className={getRiskColor(alert.risk)}>{alert.risk}</Badge>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium mb-1">Description</p>
                              <p className="text-sm text-muted-foreground">{alert.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Order ID</p>
                                <p className="font-medium">{alert.orderId || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">User ID</p>
                                <p className="font-medium">{alert.userId || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Risk Score</p>
                                <p className="font-medium">{alert.score}/100</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Detected</p>
                                <p className="font-medium">
                                  {new Date(alert.detectedAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-4 border-t">
                              <Button
                                variant="outline"
                                onClick={() => handleUpdateStatus(alert.id, "investigating")}
                                disabled={alert.status === "investigating"}
                              >
                                Start Investigation
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleResolve(alert.id, false)}
                                disabled={alert.status === "resolved"}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Resolve
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleResolve(alert.id, true)}
                                disabled={alert.status === "false_positive"}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                False Positive
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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

export default Fraud;

