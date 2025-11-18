"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout";
import { Zap, Flame, Target, Gift, TrendingUp, Clock, DollarSign, MapPin } from "lucide-react";
import { toast } from "sonner";

interface Quest {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  expiresAt: string;
  type: "delivery_count" | "earnings" | "rating" | "streak";
}

interface SurgeArea {
  id: string;
  area: string;
  multiplier: number;
  demand: "high" | "medium" | "low";
  estimatedOrders: number;
  lat: number;
  lng: number;
}

const EarningsBoost: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: "1",
      name: "Weekend Warrior",
      description: "Complete 10 deliveries this weekend",
      target: 10,
      current: 7,
      reward: 50,
      expiresAt: "2025-02-02T23:59:59Z",
      type: "delivery_count",
    },
    {
      id: "2",
      name: "Earnings Goal",
      description: "Earn $200 in the next 3 days",
      target: 200,
      current: 145,
      reward: 25,
      expiresAt: "2025-01-31T23:59:59Z",
      type: "earnings",
    },
    {
      id: "3",
      name: "Perfect Rating",
      description: "Maintain 5.0 rating for 20 deliveries",
      target: 20,
      current: 15,
      reward: 30,
      expiresAt: "2025-02-05T23:59:59Z",
      type: "rating",
    },
    {
      id: "4",
      name: "Daily Streak",
      description: "Complete deliveries for 7 consecutive days",
      target: 7,
      current: 4,
      reward: 40,
      expiresAt: "2025-02-03T23:59:59Z",
      type: "streak",
    },
  ]);

  const [surgeAreas, setSurgeAreas] = useState<SurgeArea[]>([
    {
      id: "1",
      area: "Downtown",
      multiplier: 2.5,
      demand: "high",
      estimatedOrders: 25,
      lat: 37.7749,
      lng: -122.4194,
    },
    {
      id: "2",
      area: "University District",
      multiplier: 2.0,
      demand: "high",
      estimatedOrders: 18,
      lat: 37.7849,
      lng: -122.4094,
    },
    {
      id: "3",
      area: "Business Park",
      multiplier: 1.8,
      demand: "medium",
      estimatedOrders: 12,
      lat: 37.7949,
      lng: -122.3994,
    },
  ]);

  const handleJoinQuest = (questId: string) => {
    toast.success("Quest joined! Start completing deliveries to earn rewards.");
  };

  const handleNavigateToSurge = (areaId: string) => {
    const area = surgeAreas.find((a) => a.id === areaId);
    toast.success(`Navigating to ${area?.area} - ${area?.multiplier}x surge active!`);
  };

  const getQuestIcon = (type: Quest["type"]) => {
    switch (type) {
      case "delivery_count":
        return Target;
      case "earnings":
        return DollarSign;
      case "rating":
        return TrendingUp;
      case "streak":
        return Flame;
      default:
        return Gift;
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Earnings Boost & Incentives</h1>

        {/* Surge Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Surge Pricing Areas
            </CardTitle>
            <CardDescription>
              High-demand areas with bonus earnings multipliers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {surgeAreas.map((area) => (
                <Card key={area.id} className="border-2 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{area.area}</h3>
                        <Badge className={getDemandColor(area.demand)}>{area.demand} demand</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-500">{area.multiplier}x</p>
                        <p className="text-xs text-muted-foreground">Earnings</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Estimated Orders</span>
                        <span className="font-medium">{area.estimatedOrders}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Bonus</span>
                        <span className="font-medium text-green-500">
                          +{((area.multiplier - 1) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleNavigateToSurge(area.id)}
                      variant="outline"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Go to Area
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Quests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Active Quests
            </CardTitle>
            <CardDescription>
              Complete quests to earn bonus rewards and boost your earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quests.map((quest) => {
                const QuestIcon = getQuestIcon(quest.type);
                const progress = (quest.current / quest.target) * 100;
                const timeLeft = new Date(quest.expiresAt).getTime() - Date.now();
                const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
                const isCompleted = quest.current >= quest.target;

                return (
                  <Card key={quest.id} className={isCompleted ? "border-green-500" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <QuestIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{quest.name}</h3>
                              {isCompleted && (
                                <Badge className="bg-green-500">Completed!</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{quest.description}</p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">
                                  {quest.current} / {quest.target}
                                </span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {hoursLeft > 0 ? `${hoursLeft}h left` : "Expired"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Gift className="h-3 w-3" />
                                ${quest.reward} reward
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold text-primary">${quest.reward}</p>
                          <p className="text-xs text-muted-foreground">Reward</p>
                        </div>
                      </div>
                      {!isCompleted && (
                        <Button
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => handleJoinQuest(quest.id)}
                        >
                          <Zap className="mr-2 h-4 w-4" />
                          Continue Quest
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Earnings Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quest Rewards</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$145</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Surge Earnings</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$320</div>
              <p className="text-xs text-muted-foreground">Bonus from surges</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Boost</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$465</div>
              <p className="text-xs text-muted-foreground">Extra earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Quests</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quests.filter((q) => q.current < q.target).length}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default EarningsBoost;

