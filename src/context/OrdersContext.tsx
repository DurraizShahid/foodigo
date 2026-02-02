"use client";

import React, { createContext, useContext, useMemo, useState, ReactNode, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth();
  const [scheduledOrders, setScheduledOrders] = useState<ScheduledOrder[]>([]);
  const [groupOrders, setGroupOrders] = useState<GroupOrder[]>([]);

  const loadScheduledOrders = useCallback(async () => {
    if (!user) {
      setScheduledOrders([]);
      return;
    }
    const { data, error } = await supabase
      .from("scheduled_orders")
      .select(
        "id, user_id, restaurant_id, delivery_time, address, status, notes, restaurants(name), scheduled_order_items(id, menu_item_id, name, quantity, price)"
      )
      .order("delivery_time", { ascending: true });

    if (error) return;

    const mapped = (data || []).map((order) => ({
      id: order.id,
      userId: order.user_id,
      restaurantId: order.restaurant_id,
      restaurantName: order.restaurants?.name || "Unknown Restaurant",
      deliveryTime: order.delivery_time,
      address: order.address || "",
      status: order.status as ScheduledOrder["status"],
      notes: order.notes || undefined,
      items: (order.scheduled_order_items || []).map((item) => ({
        menuItemId: item.menu_item_id,
        name: item.name,
        quantity: item.quantity,
        price: Number(item.price),
      })),
    }));
    setScheduledOrders(mapped);
  }, [user]);

  const loadGroupOrders = useCallback(async () => {
    if (!user) {
      setGroupOrders([]);
      return;
    }
    const { data, error } = await supabase
      .from("group_orders")
      .select(
        "id, host_id, restaurant_id, invite_code, status, closes_at, delivery_fee, service_fee, restaurants(name), group_order_participants(id, user_id, name, total, group_order_items(id, menu_item_id, name, quantity, price))"
      )
      .order("closes_at", { ascending: true });

    if (error) return;

    const mapped = (data || []).map((group) => ({
      id: group.id,
      hostId: group.host_id,
      restaurantId: group.restaurant_id,
      restaurantName: group.restaurants?.name || "Unknown Restaurant",
      inviteCode: group.invite_code,
      status: group.status as GroupOrder["status"],
      closesAt: group.closes_at,
      participants: (group.group_order_participants || []).map((participant) => ({
        userId: participant.user_id,
        name: participant.name,
        total: Number(participant.total),
        items: (participant.group_order_items || []).map((item) => ({
          menuItemId: item.menu_item_id,
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price),
        })),
      })),
      fees: {
        delivery: Number(group.delivery_fee),
        service: Number(group.service_fee),
      },
    }));
    setGroupOrders(mapped);
  }, [user]);

  useEffect(() => {
    loadScheduledOrders();
    loadGroupOrders();
  }, [loadScheduledOrders, loadGroupOrders]);

  const addScheduledOrder: OrdersContextType["addScheduledOrder"] = (payload) => {
    const newOrder: ScheduledOrder = {
      ...payload,
      id: `sched-${Date.now()}`,
      status: "Scheduled",
    };
    if (!user) {
      setScheduledOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    }
    (async () => {
      const { data, error } = await supabase
        .from("scheduled_orders")
        .insert({
          user_id: user.id,
          restaurant_id: payload.restaurantId,
          delivery_time: payload.deliveryTime,
          address: payload.address,
          status: "Scheduled",
          notes: payload.notes,
        })
        .select("id")
        .single();

      if (error || !data) return;

      if (payload.items.length) {
        await supabase.from("scheduled_order_items").insert(
          payload.items.map((item) => ({
            scheduled_order_id: data.id,
            menu_item_id: item.menuItemId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          }))
        );
      }
      loadScheduledOrders();
    })();
    return newOrder;
  };

  const cancelScheduledOrder = (id: string) => {
    setScheduledOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status: "Canceled" } : order)));
    if (!user) return;
    supabase.from("scheduled_orders").update({ status: "Canceled" }).eq("id", id).then(() => {
      loadScheduledOrders();
    });
  };

  const rescheduleOrder = (id: string, deliveryTime: string) => {
    setScheduledOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, deliveryTime, status: "Scheduled" } : order))
    );
    if (!user) return;
    supabase
      .from("scheduled_orders")
      .update({ delivery_time: deliveryTime, status: "Scheduled" })
      .eq("id", id)
      .then(() => {
        loadScheduledOrders();
      });
  };

  const createGroupOrder: OrdersContextType["createGroupOrder"] = (payload) => {
    const inviteCode = `FOOD-${Math.floor(Math.random() * 9000 + 1000)}`;
    const newGroup: GroupOrder = {
      ...payload,
      id: `group-${Date.now()}`,
      inviteCode,
      status: "Collecting",
      participants: [],
    };
    setGroupOrders((prev) => [newGroup, ...prev]);
    if (!user) return newGroup;
    (async () => {
      await supabase.from("group_orders").insert({
        host_id: user.id,
        restaurant_id: payload.restaurantId,
        invite_code: inviteCode,
        status: "Collecting",
        closes_at: payload.closesAt,
        delivery_fee: payload.fees.delivery,
        service_fee: payload.fees.service,
      });
      loadGroupOrders();
    })();
    return newGroup;
  };

  const addParticipantToGroup: OrdersContextType["addParticipantToGroup"] = (groupId, participant) => {
    setGroupOrders((prev) =>
      prev.map((group) => (group.id === groupId ? { ...group, participants: [...group.participants, participant] } : group))
    );
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("group_order_participants")
        .insert({
          group_order_id: groupId,
          user_id: participant.userId,
          name: participant.name,
          total: participant.total,
        })
        .select("id")
        .single();

      if (error || !data) return;

      if (participant.items.length) {
        await supabase.from("group_order_items").insert(
          participant.items.map((item) => ({
            participant_id: data.id,
            menu_item_id: item.menuItemId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          }))
        );
      }
      loadGroupOrders();
    })();
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

