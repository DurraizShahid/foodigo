"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FlaskConical, Plus, Play, Pause, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { experiments } from "@/data/dummyData";

interface Experiment {
  id: string;
  name: string;
  description: string;
  feature: string;
  variantA: string;
  variantB: string;
  status: "draft" | "running" | "paused" | "completed";
  trafficSplit: number;
  participants: number;
  variantAUsers: number;
  variantBUsers: number;
  variantAConversion: number;
  variantBConversion: number;
  startDate: string;
  endDate?: string;
}

const ABTesting: React.FC = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([
    {
      id: "EXP-001",
      name: "New Homepage Layout",
      description: "Testing new homepage design vs current",
      feature: "Homepage",
      variantA: "Control (Current)",
      variantB: "New Design",
      status: "running",
      trafficSplit: 50,
      participants: 5000,
      variantAUsers: 2500,
      variantBUsers: 2500,
      variantAConversion: 12.5,
      variantBConversion: 15.8,
      startDate: "2025-01-15",
    },
    {
      id: "EXP-002",
      name: "Checkout Button Color",
      description: "Testing green vs orange checkout button",
      feature: "Checkout",
      variantA: "Green Button",
      variantB: "Orange Button",
      status: "paused",
      trafficSplit: 50,
      participants: 3000,
      variantAUsers: 1500,
      variantBUsers: 1500,
      variantAConversion: 18.2,
      variantBConversion: 16.5,
      startDate: "2025-01-10",
    },
    {
      id: "EXP-003",
      name: "Restaurant Card Layout",
      description: "Testing card vs list view for restaurants",
      feature: "Restaurant Listings",
      status: "draft",
      trafficSplit: 50,
      participants: 0,
      variantAUsers: 0,
      variantBUsers: 0,
      variantAConversion: 0,
      variantBConversion: 0,
      startDate: "",
      variantA: "Card View",
      variantB: "List View",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    feature: "",
    variantA: "",
    variantB: "",
    trafficSplit: 50,
  });

  const handleCreateExperiment = () => {
    if (!formData.name || !formData.variantA || !formData.variantB) {
      toast.error("Please fill in all required fields");
      return;
    }
    const newExperiment: Experiment = {
      ...formData,
      id: `EXP-${Date.now()}`,
      status: "draft",
      participants: 0,
      variantAUsers: 0,
      variantBUsers: 0,
      variantAConversion: 0,
      variantBConversion: 0,
      startDate: "",
    };
    setExperiments([...experiments, newExperiment]);
    setFormData({
      name: "",
      description: "",
      feature: "",
      variantA: "",
      variantB: "",
      trafficSplit: 50,
    });
    setIsDialogOpen(false);
    toast.success("Experiment created!");
  };

  const handleToggleStatus = (expId: string) => {
    setExperiments(
      experiments.map((exp) => {
        if (exp.id === expId) {
          const newStatus =
            exp.status === "running" ? "paused" : exp.status === "paused" ? "running" : exp.status;
          return { ...exp, status: newStatus };
        }
        return exp;
      })
    );
    toast.success("Experiment status updated");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      case "draft":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getWinner = (exp: Experiment) => {
    if (exp.variantAConversion > exp.variantBConversion) return "A";
    if (exp.variantBConversion > exp.variantAConversion) return "B";
    return "Tie";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">A/B Testing Framework</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Experiment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create A/B Test</DialogTitle>
                <DialogDescription>Set up a new A/B testing experiment</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Experiment Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., New Homepage Layout"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What are you testing?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feature">Feature</Label>
                  <Input
                    id="feature"
                    value={formData.feature}
                    onChange={(e) => setFormData({ ...formData, feature: e.target.value })}
                    placeholder="e.g., Homepage, Checkout"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="variantA">Variant A (Control)</Label>
                    <Input
                      id="variantA"
                      value={formData.variantA}
                      onChange={(e) => setFormData({ ...formData, variantA: e.target.value })}
                      placeholder="Control version"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variantB">Variant B (Test)</Label>
                    <Input
                      id="variantB"
                      value={formData.variantB}
                      onChange={(e) => setFormData({ ...formData, variantB: e.target.value })}
                      placeholder="Test version"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trafficSplit">Traffic Split (%)</Label>
                  <Input
                    id="trafficSplit"
                    type="number"
                    min={0}
                    max={100}
                    value={formData.trafficSplit}
                    onChange={(e) => setFormData({ ...formData, trafficSplit: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.trafficSplit}% to Variant A, {100 - formData.trafficSplit}% to Variant B
                  </p>
                </div>
                <Button onClick={handleCreateExperiment} className="w-full">
                  Create Experiment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Experiments</CardTitle>
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {experiments.filter((e) => e.status === "running").length}
              </div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {experiments.reduce((sum, e) => sum + e.participants, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Across all experiments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {experiments.filter((e) => e.status === "completed").length}
              </div>
              <p className="text-xs text-muted-foreground">Finished tests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft</CardTitle>
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {experiments.filter((e) => e.status === "draft").length}
              </div>
              <p className="text-xs text-muted-foreground">Not started</p>
            </CardContent>
          </Card>
        </div>

        {/* Experiments Table */}
        <Card>
          <CardHeader>
            <CardTitle>A/B Test Experiments</CardTitle>
            <CardDescription>Manage and track A/B testing experiments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Experiment</TableHead>
                  <TableHead>Feature</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Variant A</TableHead>
                  <TableHead>Variant B</TableHead>
                  <TableHead>Winner</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experiments.map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{exp.name}</p>
                        <p className="text-xs text-muted-foreground">{exp.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{exp.feature}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(exp.status)}>{exp.status}</Badge>
                    </TableCell>
                    <TableCell>{exp.participants.toLocaleString()}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{exp.variantA}</p>
                        {exp.participants > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {exp.variantAUsers} users ({exp.variantAConversion}% conv.)
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{exp.variantB}</p>
                        {exp.participants > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {exp.variantBUsers} users ({exp.variantBConversion}% conv.)
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {exp.participants > 0 ? (
                        <Badge variant={getWinner(exp) === "A" ? "default" : getWinner(exp) === "B" ? "default" : "secondary"}>
                          Variant {getWinner(exp)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {exp.status === "draft" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(exp.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        ) : exp.status === "running" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(exp.id)}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(exp.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
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

export default ABTesting;

