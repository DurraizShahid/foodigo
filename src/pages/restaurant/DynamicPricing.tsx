"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { TrendingUp, TrendingDown, Zap, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface PricingSuggestion {
  id: string;
  itemName: string;
  currentPrice: number;
  suggestedPrice: number;
  reason: string;
  confidence: number;
  expectedImpact: {
    orders: number;
    revenue: number;
  };
}

const DynamicPricing: React.FC = () => {
  const [suggestions, setSuggestions] = useState<PricingSuggestion[]>([
    {
      id: "1",
      itemName: "Margherita Pizza",
      currentPrice: 12.99,
      suggestedPrice: 13.99,
      reason: "High demand, low competition",
      confidence: 85,
      expectedImpact: {
        orders: -5,
        revenue: 45,
      },
    },
    {
      id: "2",
      itemName: "Pepperoni Pizza",
      currentPrice: 14.99,
      suggestedPrice: 13.99,
      reason: "Lower demand, price reduction recommended",
      confidence: 72,
      expectedImpact: {
        orders: 12,
        revenue: 28,
      },
    },
    {
      id: "3",
      itemName: "Caesar Salad",
      currentPrice: 9.99,
      suggestedPrice: 10.49,
      reason: "Competitor pricing analysis",
      confidence: 68,
      expectedImpact: {
        orders: -2,
        revenue: 8,
      },
    },
  ]);

  const [autoPricing, setAutoPricing] = useState(false);

  const handleApplySuggestion = (id: string) => {
    const suggestion = suggestions.find((s) => s.id === id);
    if (suggestion) {
      toast.success(
        `${suggestion.itemName} price updated to $${suggestion.suggestedPrice.toFixed(2)}`
      );
      setSuggestions(suggestions.filter((s) => s.id !== id));
    }
  };

  const handleDismissSuggestion = (id: string) => {
    setSuggestions(suggestions.filter((s) => s.id !== id));
    toast.success("Suggestion dismissed");
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Dynamic Pricing</h1>
          <div className="flex items-center gap-2">
            <Switch id="auto-pricing" checked={autoPricing} onCheckedChange={setAutoPricing} />
            <Label htmlFor="auto-pricing" className="cursor-pointer">
              Auto-apply pricing suggestions
            </Label>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AI-Powered Pricing Suggestions
            </CardTitle>
            <CardDescription>
              Get intelligent pricing recommendations based on demand, competition, and market trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map((suggestion) => {
                const priceChange = suggestion.suggestedPrice - suggestion.currentPrice;
                const isIncrease = priceChange > 0;
                return (
                  <Card key={suggestion.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{suggestion.itemName}</h3>
                            <Badge variant={suggestion.confidence > 75 ? "default" : "secondary"}>
                              {suggestion.confidence}% confidence
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Current:</span>
                              <span className="font-semibold">${suggestion.currentPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {isIncrease ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-blue-500" />
                              )}
                              <span className="text-sm text-muted-foreground">Suggested:</span>
                              <span className="font-semibold text-primary">
                                ${suggestion.suggestedPrice.toFixed(2)}
                              </span>
                              <Badge variant={isIncrease ? "default" : "secondary"}>
                                {isIncrease ? "+" : ""}
                                {priceChange.toFixed(2)}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{suggestion.reason}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Expected orders:</span>
                              <span
                                className={`font-medium ${suggestion.expectedImpact.orders > 0 ? "text-green-500" : "text-red-500"}`}
                              >
                                {suggestion.expectedImpact.orders > 0 ? "+" : ""}
                                {suggestion.expectedImpact.orders}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Expected revenue:</span>
                              <span className="font-medium text-green-500">
                                +${suggestion.expectedImpact.revenue}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => handleApplySuggestion(suggestion.id)}
                          >
                            Apply
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDismissSuggestion(suggestion.id)}
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {suggestions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No pricing suggestions at the moment</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DynamicPricing;

