"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, CreditCard } from "lucide-react";

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "wallet";
  label: string;
  last4?: string;
  isDefault: boolean;
}

export const PaymentMethodForm: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      label: "Visa •••• 1234",
      last4: "1234",
      isDefault: true,
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    isDefault: false,
  });

  const handleAddCard = () => {
    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
      toast.error("Please fill in all fields");
      return;
    }

    const last4 = formData.cardNumber.slice(-4);
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: "card",
      label: `Card •••• ${last4}`,
      last4,
      isDefault: formData.isDefault,
    };

    if (formData.isDefault) {
      setPaymentMethods((prev) => prev.map((method) => ({ ...method, isDefault: false })));
    }

    setPaymentMethods((prev) => [...prev, newMethod]);
    setFormData({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
      isDefault: false,
    });
    setShowForm(false);
    toast.success("Payment method added successfully");
  };

  const handleDeleteMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
    toast.success("Payment method deleted");
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    toast.success("Default payment method updated");
  };

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <Card key={method.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{method.label}</span>
                  {method.isDefault && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Default</span>
                  )}
                </div>
                {!method.isDefault && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto mt-2"
                    onClick={() => handleSetDefault(method.id)}
                  >
                    Set as default
                  </Button>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteMethod(method.id)}>
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
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                maxLength={19}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={formData.cardholderName}
                onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                  maxLength={4}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefaultPayment"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isDefaultPayment" className="cursor-pointer">
                Set as default payment method
              </Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCard} className="flex-1">
                Add Card
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
          Add Payment Method
        </Button>
      )}
    </div>
  );
};

