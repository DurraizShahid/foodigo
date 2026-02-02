"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

interface PaymentSimulatorProps {
  amount: number;
}

const PaymentSimulator: React.FC<PaymentSimulatorProps> = ({ amount }) => {
  const { user } = useAuth();
  const [cards, setCards] = useState<Array<{ id: string; brand: string; last4: string; exp: string }>>([]);
  const [providers, setProviders] = useState<Array<{ id: string; name: string; status: string; last_sync: string | null }>>([]);
  const [selectedCard, setSelectedCard] = useState("");

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      if (user) {
        const { data: cardData } = await supabase
          .from("payment_methods")
          .select("id, brand, last4, exp")
          .eq("user_id", user.id);
        if (active) {
          setCards(cardData || []);
          setSelectedCard(cardData?.[0]?.id ?? "");
        }
      }
      const { data: providerData } = await supabase.from("payment_providers").select("id, name, status, last_sync");
      if (active) {
        setProviders(providerData || []);
      }
    };
    loadData();
    return () => {
      active = false;
    };
  }, [user]);

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
            {cards.map((card) => (
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
            {providers.map((provider) => (
              <div key={provider.id} className="rounded-lg border p-3">
                <p className="font-semibold">{provider.name}</p>
                <p className="text-xs text-muted-foreground">Last sync {provider.last_sync}</p>
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

