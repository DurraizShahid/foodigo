"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { DollarSign, Download, CreditCard, Zap, Wallet } from "lucide-react";
import { toast } from "sonner";

interface Payout {
  id: string;
  amount: number;
  date: string;
  status: "pending" | "processing" | "completed" | "failed";
  method: "instant" | "weekly";
}

const Payouts: React.FC = () => {
  const [availableBalance, setAvailableBalance] = useState(245.50);
  const [payouts, setPayouts] = useState<Payout[]>([
    {
      id: "1",
      amount: 180.25,
      date: "2025-01-20",
      status: "completed",
      method: "instant",
    },
    {
      id: "2",
      amount: 150.00,
      date: "2025-01-13",
      status: "completed",
      method: "weekly",
    },
    {
      id: "3",
      amount: 95.75,
      date: "2025-01-27",
      status: "processing",
      method: "instant",
    },
  ]);

  const [cashOutAmount, setCashOutAmount] = useState("");

  const handleInstantPayout = () => {
    const amount = parseFloat(cashOutAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }
    if (amount < 10) {
      toast.error("Minimum payout is $10");
      return;
    }

    const newPayout: Payout = {
      id: Date.now().toString(),
      amount,
      date: new Date().toISOString().split("T")[0],
      status: "processing",
      method: "instant",
    };
    setPayouts([newPayout, ...payouts]);
    setAvailableBalance(availableBalance - amount);
    setCashOutAmount("");
    toast.success(`$${amount.toFixed(2)} payout initiated! Processing...`);
  };

  const totalEarnings = payouts
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Earnings & Payouts</h1>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${availableBalance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Ready to cash out</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {payouts
                  .filter((p) => p.status === "processing")
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="cashout" className="w-full">
          <TabsList>
            <TabsTrigger value="cashout">Instant Cash Out</TabsTrigger>
            <TabsTrigger value="history">Payout History</TabsTrigger>
          </TabsList>

          <TabsContent value="cashout">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Instant Payout
                </CardTitle>
                <CardDescription>
                  Cash out your earnings instantly (minimum $10, 2.5% fee)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount to Cash Out</Label>
                  <div className="flex gap-2">
                    <Input
                      id="amount"
                      type="number"
                      value={cashOutAmount}
                      onChange={(e) => setCashOutAmount(e.target.value)}
                      placeholder="Enter amount"
                      min={10}
                      max={availableBalance}
                    />
                    <Button
                      variant="outline"
                      onClick={() => setCashOutAmount(availableBalance.toFixed(2))}
                    >
                      Max
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Available: ${availableBalance.toFixed(2)} • Fee: 2.5%
                  </p>
                </div>
                {cashOutAmount && parseFloat(cashOutAmount) > 0 && (
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Amount:</span>
                      <span className="font-semibold">${parseFloat(cashOutAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Fee (2.5%):</span>
                      <span className="font-semibold">
                        -${(parseFloat(cashOutAmount) * 0.025).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-semibold">You'll receive:</span>
                      <span className="font-bold text-lg">
                        ${(parseFloat(cashOutAmount) * 0.975).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
                <Button
                  className="w-full"
                  onClick={handleInstantPayout}
                  disabled={!cashOutAmount || parseFloat(cashOutAmount) < 10}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Cash Out Now
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Funds typically arrive within 5-10 minutes
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payout History</CardTitle>
                    <CardDescription>View all your payout transactions</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-semibold">${payout.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={payout.method === "instant" ? "default" : "secondary"}>
                            {payout.method === "instant" ? (
                              <>
                                <Zap className="mr-1 h-3 w-3" />
                                Instant
                              </>
                            ) : (
                              "Weekly"
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              payout.status === "completed"
                                ? "bg-green-500"
                                : payout.status === "processing"
                                ? "bg-blue-500"
                                : payout.status === "failed"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }
                          >
                            {payout.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Payouts;

