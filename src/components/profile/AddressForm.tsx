"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, MapPin } from "lucide-react";

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export const AddressForm: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      label: "Home",
      street: "123 Main St",
      city: "Cityville",
      state: "CA",
      zipCode: "12345",
      isDefault: true,
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Address, "id">>({
    label: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false,
  });

  const handleAddAddress = () => {
    if (!formData.label || !formData.street || !formData.city || !formData.state || !formData.zipCode) {
      toast.error("Please fill in all fields");
      return;
    }

    const newAddress: Address = {
      ...formData,
      id: Date.now().toString(),
    };

    if (formData.isDefault) {
      setAddresses((prev) => prev.map((addr) => ({ ...addr, isDefault: false })));
    }

    setAddresses((prev) => [...prev, newAddress]);
    setFormData({
      label: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      isDefault: false,
    });
    setShowForm(false);
    toast.success("Address added successfully");
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    toast.success("Address deleted");
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    toast.success("Default address updated");
  };

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <Card key={address.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{address.label}</span>
                  {address.isDefault && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Default</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {address.street}, {address.city}, {address.state} {address.zipCode}
                </p>
                {!address.isDefault && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto mt-2"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Set as default
                  </Button>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(address.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {showForm ? (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Address Label</Label>
              <Input
                id="label"
                placeholder="Home, Work, etc."
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                placeholder="123 Main St"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Cityville"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="CA"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="12345"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isDefault" className="cursor-pointer">
                Set as default address
              </Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddAddress} className="flex-1">
                Save Address
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" className="w-full" onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      )}
    </div>
  );
};

