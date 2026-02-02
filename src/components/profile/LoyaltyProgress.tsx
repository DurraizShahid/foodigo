"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";

interface LoyaltyProgressProps {
  userId?: string;
}

const LoyaltyProgress: React.FC<LoyaltyProgressProps> = ({ userId }) => {
  const [reward, setReward] = React.useState<{
    id: string;
    points: number;
    nextRewardAt: number;
    badges: string[];
    recentActivity: Array<{ id: string; label: string; points: number; date: string }>;
  } | null>(null);

  React.useEffect(() => {
    let active = true;
    const loadReward = async () => {
      if (!userId) {
        setReward(null);
        return;
      }
      const { data: rewardRow } = await supabase
        .from("loyalty_rewards")
        .select("id, points, next_reward_at, badges")
        .eq("user_id", userId)
        .maybeSingle();

      if (!rewardRow) {
        if (active) setReward(null);
        return;
      }

      const { data: activityRows } = await supabase
        .from("loyalty_activity")
        .select("id, label, points, activity_date")
        .eq("loyalty_reward_id", rewardRow.id)
        .order("activity_date", { ascending: false });

      if (!active) return;

      setReward({
        id: rewardRow.id,
        points: rewardRow.points,
        nextRewardAt: rewardRow.next_reward_at,
        badges: rewardRow.badges || [],
        recentActivity: (activityRows || []).map((entry) => ({
          id: entry.id,
          label: entry.label,
          points: entry.points,
          date: entry.activity_date,
        })),
      });
    };

    loadReward();
    return () => {
      active = false;
    };
  }, [userId]);

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

  const progressPercent = reward.nextRewardAt ? (reward.points / reward.nextRewardAt) * 100 : 0;

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

