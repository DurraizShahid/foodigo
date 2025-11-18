"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const NotificationPreferences: React.FC = () => {
  const [settings, setSettings] = useState({
    push: true,
    sms: false,
    email: true,
    marketing: false,
  });
  const [testMessage, setTestMessage] = useState("Your driver is 5 minutes away.");

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendTest = () => {
    toast.success("Test notification sent!");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Channels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Push notifications", key: "push", helper: "Real-time updates about active deliveries." },
            { label: "SMS alerts", key: "sms", helper: "Text messages for time-sensitive updates." },
            { label: "Email summaries", key: "email", helper: "Receipts, promos, and weekly digest." },
            { label: "Marketing updates", key: "marketing", helper: "Exclusive offers and loyalty reminders." },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <div>
                <Label className="text-base">{item.label}</Label>
                <p className="text-sm text-muted-foreground">{item.helper}</p>
              </div>
              <Switch checked={settings[item.key as keyof typeof settings]} onCheckedChange={() => toggleSetting(item.key as keyof typeof settings)} />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Send a test notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea value={testMessage} onChange={(e) => setTestMessage(e.target.value)} />
          <Button onClick={handleSendTest}>Send Test</Button>
          <p className="text-xs text-muted-foreground">
            This simulates the push notification experience using your current settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPreferences;

