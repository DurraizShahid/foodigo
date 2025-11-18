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
import { DollarSign, Download, CreditCard, Building } from "lucide-react";
import { toast } from "sonner";

interface Payout {
  id: string;
  amount: number;
  date: string;
  status: "pending" | "processing" | "completed" | "failed";
  method: "bank_transfer" | "paypal" | "stripe";
  transactionId?: string;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: "checking" | "savings";
  isDefault: boolean;
}

const Payouts: React.FC = () => {
  const [payouts, setPayouts] = useState<Payout[]>([
    {
      id: "1",
      amount: 1250.50,
      date: "2025-01-20",
      status: "completed",
      method: "bank_transfer",
      transactionId: "TXN-20250120-001",
    },
    {
      id: "2",
      amount: 980.25,
      date: "2025-01-13",
      status: "completed",
      method: "bank_transfer",
      transactionId: "TXN-20250113-001",
    },
    {
      id: "3",
      amount: 1450.75,
      date: "2025-01-27",
      status: "processing",
      method: "bank_transfer",
    },
    {
      id: "4",
      amount: 750.00,
      date: "2025-01-28",
      status: "pending",
      method: "bank_transfer",
    },
  ]);

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      bankName: "Chase Bank",
      accountNumber: "****1234",
      routingNumber: "****5678",
      accountType: "checking",
      isDefault: true,
    },
  ]);

  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "checking" as "checking" | "savings",
  });

  const totalEarnings = payouts.reduce((sum, p) => sum + (p.status === "completed" ? p.amount : 0), 0);
  const pendingAmount = payouts
    .filter((p) => p.status === "pending" || p.status === "processing")
    .reduce((sum, p) => sum + p.amount, 0);

  const handleAddBankAccount = () => {
    if (!bankForm.bankName || !bankForm.accountNumber || !bankForm.routingNumber) {
      toast.error("Please fill in all fields");
      return;
    }
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      ...bankForm,
      accountNumber: `****${bankForm.accountNumber.slice(-4)}`,
      routingNumber: `****${bankForm.routingNumber.slice(-4)}`,
      isDefault: bankAccounts.length === 0,
    };
    setBankAccounts([...bankAccounts, newAccount]);
    setBankForm({ bankName: "", accountNumber: "", routingNumber: "", accountType: "checking" });
    toast.success("Bank account added successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "processing":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Payouts & Transactions</h1>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
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
              <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Payout</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Jan 31, 2025</div>
              <p className="text-xs text-muted-foreground">Weekly schedule</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="history" className="w-full">
          <TabsList>
            <TabsTrigger value="history">Payout History</TabsTrigger>
            <TabsTrigger value="banking">Bank Accounts</TabsTrigger>
          </TabsList>

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
                      <TableHead>Transaction ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-semibold">${payout.amount.toFixed(2)}</TableCell>
                        <TableCell className="capitalize">{payout.method.replace("_", " ")}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(payout.status)}>
                            {payout.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {payout.transactionId || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banking">
            <Card>
              <CardHeader>
                <CardTitle>Bank Accounts</CardTitle>
                <CardDescription>Manage your payout bank accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {bankAccounts.map((account) => (
                    <Card key={account.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <p className="font-semibold">{account.bankName}</p>
                              {account.isDefault && (
                                <Badge variant="outline">Default</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {account.accountType} • {account.accountNumber} • Routing: {account.routingNumber}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Add Bank Account</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={bankForm.bankName}
                        onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                        placeholder="e.g., Chase Bank"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={bankForm.accountNumber}
                          onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                          placeholder="1234567890"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="routingNumber">Routing Number</Label>
                        <Input
                          id="routingNumber"
                          value={bankForm.routingNumber}
                          onChange={(e) => setBankForm({ ...bankForm, routingNumber: e.target.value })}
                          placeholder="123456789"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountType">Account Type</Label>
                      <select
                        id="accountType"
                        value={bankForm.accountType}
                        onChange={(e) =>
                          setBankForm({ ...bankForm, accountType: e.target.value as "checking" | "savings" })
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="checking">Checking</option>
                        <option value="savings">Savings</option>
                      </select>
                    </div>
                    <Button onClick={handleAddBankAccount} className="w-full">
                      Add Bank Account
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Payouts;

