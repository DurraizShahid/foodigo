"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

interface LogEntry {
  id: string;
  channel: string;
  title: string;
  body: string;
  timestamp: string;
}

const PushDebugPanel: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [templates, setTemplates] = useState<Array<{ id: string; channel: string; title: string; body: string }>>([]);

  useEffect(() => {
    let active = true;
    const loadTemplates = async () => {
      const { data } = await supabase.from("push_event_templates").select("id, channel, title, body");
      if (!active) return;
      setTemplates(data || []);
    };
    loadTemplates();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (templates.length === 0) return;
    const interval = setInterval(() => {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const entry: LogEntry = {
        ...template,
        timestamp: new Date().toLocaleTimeString(),
      };
      setLogs((prev) => [entry, ...prev].slice(0, 5));
      toast(`${template.title}`, {
        description: template.body,
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [templates]);

  const handleTrigger = () => {
    const template = templates[0];
    if (!template) return;
    setLogs((prev) => [
      { ...template, timestamp: new Date().toLocaleTimeString() },
      ...prev,
    ]);
    toast(`${template.title}`, {
      description: template.body,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <CardTitle>Push & SMS Feed</CardTitle>
        <Button variant="outline" size="sm" onClick={handleTrigger}>
          Send test event
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Events will appear here in real-time.</p>
        ) : (
          logs.map((log, index) => (
            <div key={`${log.id}-${index}`} className="rounded-lg border p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{log.channel.toUpperCase()}</span>
                <span>{log.timestamp}</span>
              </div>
              <p className="font-semibold">{log.title}</p>
              <p className="text-sm text-muted-foreground">{log.body}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default PushDebugPanel;

