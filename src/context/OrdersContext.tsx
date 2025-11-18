"use client";

import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { groupOrders as groupOrdersSeed, scheduledOrders as scheduledOrdersSeed } from "@/data/dummyData";

export interface ScheduledOrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface ScheduledOrder {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  deliveryTime: string;
  address: string;
  items: ScheduledOrderItem[];
  status: "Scheduled" | "Preparing" | "Canceled";
  notes?: string;
}

export interface GroupOrderParticipant {
  userId: string;
  name: string;
  items: ScheduledOrderItem[];
  total: number;
}

export interface GroupOrder {
  id: string;
  hostId: string;
  restaurantId: string;
  restaurantName: string;
  inviteCode: string;
  status: "Collecting" | "Submitted" | "Closed";
  closesAt: string;
  participants: GroupOrderParticipant[];
  fees: {
    delivery: number;
    service: number;
  };
}

interface OrdersContextType {
  scheduledOrders: ScheduledOrder[];
  groupOrders: GroupOrder[];
  addScheduledOrder: (payload: Omit<ScheduledOrder, "id" | "status">) => ScheduledOrder;
  cancelScheduledOrder: (id: string) => void;
  rescheduleOrder: (id: string, deliveryTime: string) => void;
  createGroupOrder: (payload: Omit<GroupOrder, "id" | "inviteCode" | "participants" | "status">) => GroupOrder;
  addParticipantToGroup: (groupId: string, participant: GroupOrderParticipant) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scheduledOrders, setScheduledOrders] = useState<ScheduledOrder[]>(scheduledOrdersSeed);
  const [groupOrders, setGroupOrders] = useState<GroupOrder[]>(groupOrdersSeed);

  const addScheduledOrder: OrdersContextType["addScheduledOrder"] = (payload) => {
    const newOrder: ScheduledOrder = {
      ...payload,
      id: `sched-${Date.now()}`,
      status: "Scheduled",
    };
    setScheduledOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const cancelScheduledOrder = (id: string) => {
    setScheduledOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status: "Canceled" } : order)));
  };

  const rescheduleOrder = (id: string, deliveryTime: string) => {
    setScheduledOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, deliveryTime, status: "Scheduled" } : order))
    );
  };

  const createGroupOrder: OrdersContextType["createGroupOrder"] = (payload) => {
    const newGroup: GroupOrder = {
      ...payload,
      id: `group-${Date.now()}`,
      inviteCode: `FOOD-${Math.floor(Math.random() * 9000 + 1000)}`,
      status: "Collecting",
      participants: [],
    };
    setGroupOrders((prev) => [newGroup, ...prev]);
    return newGroup;
  };

  const addParticipantToGroup: OrdersContextType["addParticipantToGroup"] = (groupId, participant) => {
    setGroupOrders((prev) =>
      prev.map((group) => (group.id === groupId ? { ...group, participants: [...group.participants, participant] } : group))
    );
  };

  const value = useMemo(
    () => ({
      scheduledOrders,
      groupOrders,
      addScheduledOrder,
      cancelScheduledOrder,
      rescheduleOrder,
      createGroupOrder,
      addParticipantToGroup,
    }),
    [scheduledOrders, groupOrders]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
};

