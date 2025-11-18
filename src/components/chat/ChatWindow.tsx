"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Phone, Video } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  type: "text" | "system";
}

interface ChatWindowProps {
  recipientName: string;
  recipientId: string;
  currentUserId: string;
  currentUserName: string;
  onClose?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  recipientName,
  recipientId,
  currentUserId,
  currentUserName,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: recipientId,
      senderName: recipientName,
      text: "Hello! Your order is being prepared.",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: "text",
    },
    {
      id: "2",
      senderId: currentUserId,
      senderName: currentUserName,
      text: "Thanks! Can you add extra cheese?",
      timestamp: new Date(Date.now() - 180000).toISOString(),
      type: "text",
    },
    {
      id: "3",
      senderId: recipientId,
      senderName: recipientName,
      text: "Sure, I'll add that for you!",
      timestamp: new Date(Date.now() - 60000).toISOString(),
      type: "text",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserName,
      text: inputValue,
      timestamp: new Date().toISOString(),
      type: "text",
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate response after 2 seconds
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: recipientId,
        senderName: recipientName,
        text: "Got it! I'll let you know when it's ready.",
        timestamp: new Date().toISOString(),
        type: "text",
      };
      setMessages((prev) => [...prev, response]);
    }, 2000);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString();
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="flex-shrink-0 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{recipientName}</CardTitle>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4" />
            </Button>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.senderId === currentUserId;
          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-[70%]`}>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{formatTime(message.timestamp)}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </CardContent>
      <div className="flex-shrink-0 border-t p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

