"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Layout from "@/components/Layout";
import { Plus, Edit, Trash2, Calendar, Percent, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Promotion {
  id: string;
  title: string;
  description: string;
  type: "percentage" | "fixed" | "free_delivery";
  value: number;
  minOrder?: number;
  startDate: string;
  endDate: string;
  active: boolean;
  usageCount: number;
  maxUsage?: number;
}

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: "1",
      title: "20% Off First Order",
      description: "New customers get 20% off their first order",
      type: "percentage",
      value: 20,
      minOrder: 15,
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      active: true,
      usageCount: 45,
      maxUsage: 1000,
    },
    {
      id: "2",
      title: "Free Delivery Weekend",
      description: "Free delivery on all orders this weekend",
      type: "free_delivery",
      value: 0,
      startDate: "2025-01-25",
      endDate: "2025-01-26",
      active: true,
      usageCount: 120,
    },
    {
      id: "3",
      title: "$5 Off Orders Over $30",
      description: "Save $5 on orders over $30",
      type: "fixed",
      value: 5,
      minOrder: 30,
      startDate: "2025-01-20",
      endDate: "2025-02-20",
      active: false,
      usageCount: 78,
      maxUsage: 500,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState<Omit<Promotion, "id" | "usageCount">>({
    title: "",
    description: "",
    type: "percentage",
    value: 0,
    minOrder: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    active: true,
    maxUsage: undefined,
  });

  const handleCreate = () => {
    const newPromo: Promotion = {
      ...formData,
      id: Date.now().toString(),
      usageCount: 0,
    };
    setPromotions([...promotions, newPromo]);
    setIsDialogOpen(false);
    resetForm();
    toast.success("Promotion created successfully!");
  };

  const handleUpdate = () => {
    if (!editingPromo) return;
    setPromotions(
      promotions.map((p) => (p.id === editingPromo.id ? { ...editingPromo, ...formData } : p))
    );
    setIsDialogOpen(false);
    setEditingPromo(null);
    resetForm();
    toast.success("Promotion updated!");
  };

  const handleDelete = (id: string) => {
    setPromotions(promotions.filter((p) => p.id !== id));
    toast.success("Promotion deleted");
  };

  const handleToggle = (id: string) => {
    setPromotions(promotions.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
    toast.success("Promotion status updated");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "percentage",
      value: 0,
      minOrder: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      active: true,
      maxUsage: undefined,
    });
  };

  const openEditDialog = (promo: Promotion) => {
    setEditingPromo(promo);
    setFormData({
      title: promo.title,
      description: promo.description,
      type: promo.type,
      value: promo.value,
      minOrder: promo.minOrder,
      startDate: promo.startDate,
      endDate: promo.endDate,
      active: promo.active,
      maxUsage: promo.maxUsage,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingPromo(null);
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Promotions Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Create Promotion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPromo ? "Edit Promotion" : "Create New Promotion"}</DialogTitle>
                <DialogDescription>
                  {editingPromo ? "Update promotion details" : "Create a new promotional offer"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., 20% Off First Order"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Describe the promotion..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Promotion Type</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value as Promotion["type"] })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="percentage">Percentage Off</option>
                      <option value="fixed">Fixed Amount Off</option>
                      <option value="free_delivery">Free Delivery</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value">
                      {formData.type === "percentage" ? "Discount %" : "Discount Amount ($)"}
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                      disabled={formData.type === "free_delivery"}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minOrder">Minimum Order ($)</Label>
                    <Input
                      id="minOrder"
                      type="number"
                      value={formData.minOrder}
                      onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxUsage">Max Usage (optional)</Label>
                    <Input
                      id="maxUsage"
                      type="number"
                      value={formData.maxUsage || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, maxUsage: e.target.value ? Number(e.target.value) : undefined })
                      }
                    />
                  </div>
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
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="active">Active</Label>
                    <p className="text-sm text-muted-foreground">Enable this promotion</p>
                  </div>
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={editingPromo ? handleUpdate : handleCreate} className="flex-1">
                    {editingPromo ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {promotions.map((promo) => (
            <Card key={promo.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{promo.title}</h3>
                      <Badge variant={promo.active ? "default" : "secondary"}>
                        {promo.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{promo.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Type</p>
                        <p className="font-medium capitalize">{promo.type.replace("_", " ")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Discount</p>
                        <p className="font-medium">
                          {promo.type === "percentage" ? (
                            <span className="flex items-center gap-1">
                              <Percent className="h-4 w-4" />
                              {promo.value}%
                            </span>
                          ) : promo.type === "fixed" ? (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {promo.value}
                            </span>
                          ) : (
                            "Free Delivery"
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Usage</p>
                        <p className="font-medium">
                          {promo.usageCount}
                          {promo.maxUsage && ` / ${promo.maxUsage}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Valid Until</p>
                        <p className="font-medium">{new Date(promo.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Switch checked={promo.active} onCheckedChange={() => handleToggle(promo.id)} />
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(promo)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(promo.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Promotions;

