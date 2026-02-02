"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Plus, Search, User, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

interface Ticket {
  id: string;
  subject: string;
  type: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  customer: string;
  description: string;
  messages: Array<{ sender: string; message: string; timestamp: string }>;
}

const Ticketing: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    customerEmail: "",
    description: "",
  });

  useEffect(() => {
    let active = true;
    const loadTickets = async () => {
      const [{ data: ticketRows }, { data: messageRows }] = await Promise.all([
        supabase
          .from("support_tickets")
          .select("id, subject, type, priority, status, assigned_to, customer_email, description, created_at, updated_at")
          .order("updated_at", { ascending: false }),
        supabase.from("support_ticket_messages").select("ticket_id, sender, message, timestamp").order("timestamp"),
      ]);

      if (!active) return;

      const messageMap = (messageRows || []).reduce<Record<string, Ticket["messages"]>>((acc, message) => {
        if (!acc[message.ticket_id]) acc[message.ticket_id] = [];
        acc[message.ticket_id].push({
          sender: message.sender,
          message: message.message,
          timestamp: message.timestamp,
        });
        return acc;
      }, {});

      setTickets(
        (ticketRows || []).map((ticket) => ({
          id: ticket.id,
          subject: ticket.subject,
          type: ticket.type || "General",
          priority: (ticket.priority || "low") as Ticket["priority"],
          status: (ticket.status || "open") as Ticket["status"],
          assignedTo: ticket.assigned_to || "Unassigned",
          createdAt: ticket.created_at,
          updatedAt: ticket.updated_at,
          customer: ticket.customer_email || "",
          description: ticket.description || "",
          messages: messageMap[ticket.id] || [],
        }))
      );
    };
    loadTickets();
    return () => {
      active = false;
    };
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (ticketId: string, newStatus: Ticket["status"]) => {
    setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t)));
    supabase.from("support_tickets").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", ticketId);
    toast.success("Ticket status updated");
  };

  const handleAssign = (ticketId: string, agent: string) => {
    setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, assignedTo: agent, updatedAt: new Date().toISOString() } : t)));
    supabase.from("support_tickets").update({ assigned_to: agent, updated_at: new Date().toISOString() }).eq("id", ticketId);
    toast.success("Ticket assigned");
  };

  const handleSendMessage = (ticketId: string) => {
    if (!newMessage.trim()) return;
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    const updatedTicket = {
      ...ticket,
      messages: [
        ...ticket.messages,
        { sender: "Agent", message: newMessage, timestamp: new Date().toISOString() },
      ],
      updatedAt: new Date().toISOString(),
    };
    setTickets(tickets.map((t) => (t.id === ticketId ? updatedTicket : t)));
    setNewMessage("");
    supabase.from("support_ticket_messages").insert({
      ticket_id: ticketId,
      sender: "Agent",
      message: newMessage,
      timestamp: new Date().toISOString(),
    });
    supabase.from("support_tickets").update({ updated_at: new Date().toISOString() }).eq("id", ticketId);
    toast.success("Message sent");
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.customerEmail.trim()) {
      toast.error("Subject and customer email are required");
      return;
    }
    const timestamp = new Date().toISOString();
    const { data, error } = await supabase
      .from("support_tickets")
      .insert({
        subject: newTicket.subject.trim(),
        type: "General",
        priority: "medium",
        status: "open",
        assigned_to: "Unassigned",
        customer_email: newTicket.customerEmail.trim(),
        description: newTicket.description.trim(),
        created_at: timestamp,
        updated_at: timestamp,
      })
      .select()
      .maybeSingle();
    if (error) {
      toast.error("Failed to create ticket");
      return;
    }
    if (data) {
      setTickets((prev) => [
        {
          id: data.id,
          subject: data.subject,
          type: data.type || "General",
          priority: (data.priority || "medium") as Ticket["priority"],
          status: (data.status || "open") as Ticket["status"],
          assignedTo: data.assigned_to || "Unassigned",
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          customer: data.customer_email || "",
          description: data.description || "",
          messages: [],
        },
        ...prev,
      ]);
    }
    setNewTicket({ subject: "", customerEmail: "", description: "" });
    setIsCreateOpen(false);
    toast.success("Ticket created");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-500";
      case "in_progress":
        return "bg-blue-500";
      case "resolved":
        return "bg-green-500";
      case "closed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Support & Ticketing</h1>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Ticket</DialogTitle>
                <DialogDescription>Manually create a support ticket</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Ticket subject"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer Email</Label>
                  <Input
                    id="customer"
                    type="email"
                    placeholder="customer@example.com"
                    value={newTicket.customerEmail}
                    onChange={(e) => setNewTicket({ ...newTicket, customerEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Ticket description"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  />
                </div>
                <Button className="w-full" onClick={handleCreateTicket}>
                  Create Ticket
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
            <CardDescription>{filteredTickets.length} tickets found</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="p-0 h-auto" onClick={() => setSelectedTicket(ticket)}>
                            {ticket.subject}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{ticket.subject}</DialogTitle>
                            <DialogDescription>
                              <div className="flex gap-2 mt-2">
                                <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                                <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium mb-1">Description</p>
                              <p className="text-sm text-muted-foreground">{ticket.description}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2">Conversation</p>
                              <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-4">
                                {ticket.messages.map((msg, idx) => (
                                  <div key={idx} className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-medium">{msg.sender}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(msg.timestamp).toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-sm">{msg.message}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Reply</Label>
                              <Textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                rows={3}
                              />
                              <Button onClick={() => handleSendMessage(ticket.id)} className="w-full">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Send Message
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                              <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                  value={ticket.status}
                                  onValueChange={(value) => handleUpdateStatus(ticket.id, value as Ticket["status"])}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Assign To</Label>
                                <Select
                                  value={ticket.assignedTo}
                                  onValueChange={(value) => handleAssign(ticket.id, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Agent A">Agent A</SelectItem>
                                    <SelectItem value="Agent B">Agent B</SelectItem>
                                    <SelectItem value="Agent C">Agent C</SelectItem>
                                    <SelectItem value="Unassigned">Unassigned</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>{ticket.type}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                    </TableCell>
                    <TableCell>{ticket.assignedTo}</TableCell>
                    <TableCell className="text-sm">{ticket.customer}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Ticketing;

