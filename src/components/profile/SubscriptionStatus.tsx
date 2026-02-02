"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

interface SubscriptionStatusProps {
  userId?: string;
}

const tierBenefits: Record<string, string[]> = {
  Gold: ["Free delivery", "Priority support", "Exclusive weekly offers", "2x loyalty points on weekends"],
  Silver: ["50% delivery fees", "Priority support", "Exclusive offers"],
  Free: ["Standard delivery", "Earn loyalty points"],
};

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ userId }) => {
  const [subscription, setSubscription] = React.useState<{
    tier: string;
    renewalDate: string | null;
    monthlyFee: number;
    active: boolean;
  } | null>(null);

  React.useEffect(() => {
    let active = true;
    const loadSubscription = async () => {
      if (!userId) {
        setSubscription(null);
        return;
      }
      const { data } = await supabase
        .from("subscriptions")
        .select("tier, renewal_date, monthly_fee, active")
        .eq("user_id", userId)
        .maybeSingle();
      if (!active) return;
      if (!data) {
        setSubscription(null);
        return;
      }
      setSubscription({
        tier: data.tier,
        renewalDate: data.renewal_date,
        monthlyFee: Number(data.monthly_fee),
        active: data.active,
      });
    };
    loadSubscription();
    return () => {
      active = false;
    };
  }, [userId]);
  const tier = subscription?.tier ?? "Free";
  const renewalText = subscription?.renewalDate ? `Renews on ${subscription.renewalDate}` : "Upgrade to unlock perks";
  const tierPerks = tierBenefits[tier] ?? tierBenefits.Free;

  const handleManage = () => {
    toast.success("Subscription portal coming soon!");
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            Membership
            <Badge variant="secondary">{tier}</Badge>
          </CardTitle>
          <CardDescription>{renewalText}</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleManage}>
            Manage Plan
          </Button>
          <Button onClick={handleManage}>Upgrade</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-semibold mb-1">Month-to-date savings</p>
          <Progress value={tier === "Gold" ? 80 : 20} />
          <p className="text-xs text-muted-foreground mt-1">
            {
              {
                Gold: "You saved $18.40 in delivery and fees this month.",
                Silver: "You saved $5.20 in delivery fees this month.",
                Free: "Upgrade to start saving on deliveries.",
              }[tier]
            }
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold mb-2">Your perks</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {tierPerks.map((perk) => (
              <li key={perk} className="rounded-lg border px-3 py-2 text-sm bg-muted/40">
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;

