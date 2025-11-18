"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { loyaltyRewards } from "@/data/dummyData";
import { Badge } from "@/components/ui/badge";

interface LoyaltyProgressProps {
  userId?: string;
}

const LoyaltyProgress: React.FC<LoyaltyProgressProps> = ({ userId }) => {
  const reward = loyaltyRewards.find((entry) => entry.userId === userId);

  if (!reward) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loyalty</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Place your first order to start earning points.</p>
        </CardContent>
      </Card>
    );
  }

  const progressPercent = (reward.points / reward.nextRewardAt) * 100;

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Loyalty</CardTitle>
          <p className="text-sm text-muted-foreground">
            {reward.points} / {reward.nextRewardAt} pts until your next reward
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {reward.badges.map((badge) => (
            <Badge key={badge} variant="outline">
              {badge}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progressPercent} />
        <div>
          <p className="text-sm font-semibold mb-2">Recent activity</p>
          <div className="space-y-2">
            {reward.recentActivity.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between text-sm rounded-lg border p-2 bg-muted/40">
                <div>
                  <p className="font-medium">{entry.label}</p>
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
                </div>
                <span className="font-semibold">+{entry.points}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoyaltyProgress;

