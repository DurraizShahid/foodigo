"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Megaphone, Plus, Edit, Trash2, Search, TrendingUp, Eye } from "lucide-react";
import { toast } from "sonner";

interface Campaign {
  id: string;
  name: string;
  type: "email" | "push" | "banner" | "promo";
  status: "draft" | "active" | "paused" | "completed";
  targetAudience: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

const Marketing: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "CAMP-001",
      name: "Summer Food Festival",
      type: "banner",
      status: "active",
      targetAudience: "All Users",
      startDate: "2025-06-01",
      endDate: "2025-08-31",
      budget: 10000,
      spent: 3500,
      impressions: 125000,
      clicks: 8500,
      conversions: 1200,
    },
    {
      id: "CAMP-002",
      name: "New User Welcome",
      type: "email",
      status: "active",
      targetAudience: "New Users",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      budget: 5000,
      spent: 1200,
      impressions: 45000,
      clicks: 3200,
      conversions: 850,
    },
    {
      id: "CAMP-003",
      name: "Weekend Special Push",
      type: "push",
      status: "paused",
      targetAudience: "Active Users",
      startDate: "2025-01-20",
      endDate: "2025-02-20",
      budget: 3000,
      spent: 1800,
      impressions: 65000,
      clicks: 4200,
      conversions: 650,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "email" as Campaign["type"],
    targetAudience: "",
    startDate: "",
    endDate: "",
    budget: 0,
  });

  const handleCreateCampaign = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    const newCampaign: Campaign = {
      ...formData,
      id: `CAMP-${Date.now()}`,
      status: "draft",
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
    };
    setCampaigns([...campaigns, newCampaign]);
    setFormData({
      name: "",
      type: "email",
      targetAudience: "",
      startDate: "",
      endDate: "",
      budget: 0,
    });
    setIsDialogOpen(false);
    toast.success("Campaign created!");
  };

  const handleToggleStatus = (campaignId: string) => {
    setCampaigns(
      campaigns.map((c) => {
        if (c.id === campaignId) {
          const newStatus =
            c.status === "active" ? "paused" : c.status === "paused" ? "active" : c.status;
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
    toast.success("Campaign status updated");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
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

  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Marketing & SEO Tools</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Marketing Campaign</DialogTitle>
                <DialogDescription>Set up a new marketing campaign</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Summer Sale"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Campaign Type</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as Campaign["type"] })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="email">Email</option>
                      <option value="push">Push Notification</option>
                      <option value="banner">Banner</option>
                      <option value="promo">Promotion</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget ($)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input
                    id="audience"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    placeholder="e.g., All Users, New Users"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateCampaign} className="w-full">
                  Create Campaign
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Impressions</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(totalImpressions / 1000).toFixed(0)}K</div>
              <p className="text-xs text-muted-foreground">Total views</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {totalImpressions > 0
                  ? ((totalConversions / totalImpressions) * 100).toFixed(2)
                  : 0}
                % conversion rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Table */}
        <Card>
          <CardHeader>
            <CardTitle>Marketing Campaigns</CardTitle>
            <CardDescription>Manage all marketing campaigns and track performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{campaign.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                    </TableCell>
                    <TableCell>${campaign.budget.toLocaleString()}</TableCell>
                    <TableCell>${campaign.spent.toLocaleString()}</TableCell>
                    <TableCell>{campaign.impressions.toLocaleString()}</TableCell>
                    <TableCell>{campaign.clicks.toLocaleString()}</TableCell>
                    <TableCell>{campaign.conversions.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Switch
                          checked={campaign.status === "active"}
                          onCheckedChange={() => handleToggleStatus(campaign.id)}
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

        {/* SEO Tools */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Optimization</CardTitle>
            <CardDescription>Search engine optimization tools and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Search Rankings</p>
                  <p className="text-2xl font-bold">#3</p>
                  <p className="text-xs text-muted-foreground">"food delivery"</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Organic Traffic</p>
                  <p className="text-2xl font-bold">+15%</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Backlinks</p>
                  <p className="text-2xl font-bold">1,245</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Run SEO Audit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Marketing;

