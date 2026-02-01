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
import { useData } from "@/context/DataContext";

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
  const { supportTickets } = useData();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (!tickets.length && supportTickets.length) {
      setTickets(supportTickets as Ticket[]);
    }
  }, [tickets.length, supportTickets]);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (ticketId: string, newStatus: Ticket["status"]) => {
    setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t)));
    toast.success("Ticket status updated");
  };

  const handleAssign = (ticketId: string, agent: string) => {
    setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, assignedTo: agent, updatedAt: new Date().toISOString() } : t)));
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
    toast.success("Message sent");
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
          <Dialog>
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
                  <Input id="subject" placeholder="Ticket subject" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer Email</Label>
                  <Input id="customer" type="email" placeholder="customer@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" rows={4} placeholder="Ticket description" />
                </div>
                <Button className="w-full">Create Ticket</Button>
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

