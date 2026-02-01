"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useData } from "@/context/DataContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PaymentSimulatorProps {
  amount: number;
}

const PaymentSimulator: React.FC<PaymentSimulatorProps> = ({ amount }) => {
  const { paymentVault, paymentProviders } = useData();
  const [selectedCard, setSelectedCard] = useState("");

  useEffect(() => {
    if (!selectedCard && paymentVault.length) {
      setSelectedCard(paymentVault[0].id);
    }
  }, [paymentVault, selectedCard]);

  const handleSimulate = () => {
    toast.success(`Simulated payment of $${amount.toFixed(2)} using ${selectedCard}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Providers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Saved cards</p>
          <div className="space-y-2">
            {paymentVault.map((card) => (
              <label
                key={card.id}
                className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer ${
                  selectedCard === card.id ? "border-primary" : ""
                }`}
              >
                <div>
                  <p className="font-semibold">
                    {card.brand} •••• {card.last4}
                  </p>
                  <p className="text-xs text-muted-foreground">Expires {card.exp}</p>
                </div>
                <input
                  type="radio"
                  name="saved-card"
                  value={card.id}
                  checked={selectedCard === card.id}
                  onChange={() => setSelectedCard(card.id)}
                />
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Gateway status</p>
          <div className="grid gap-2 md:grid-cols-3">
            {paymentProviders.map((provider) => (
              <div key={provider.id} className="rounded-lg border p-3">
                <p className="font-semibold">{provider.name}</p>
                <p className="text-xs text-muted-foreground">Last sync {provider.lastSync}</p>
                <Badge className="mt-2" variant={provider.status === "Connected" ? "outline" : "secondary"}>
                  {provider.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
        <Button className="w-full" onClick={handleSimulate}>
          Simulate Payment
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentSimulator;

