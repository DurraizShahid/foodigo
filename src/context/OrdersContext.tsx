"use client";

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

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
  const [scheduledOrders, setScheduledOrders] = useState<ScheduledOrder[]>([]);
  const [groupOrders, setGroupOrders] = useState<GroupOrder[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      const [scheduledRes, scheduledItemsRes, groupRes, groupParticipantsRes, groupItemsRes] = await Promise.all([
        supabase.from("scheduled_orders").select("*"),
        supabase.from("scheduled_order_items").select("*"),
        supabase.from("group_orders").select("*"),
        supabase.from("group_order_participants").select("*"),
        supabase.from("group_order_participant_items").select("*"),
      ]);

      if (scheduledRes.error || scheduledItemsRes.error || groupRes.error || groupParticipantsRes.error || groupItemsRes.error) {
        return;
      }

      const scheduledItemsByOrder = new Map<string, ScheduledOrderItem[]>();
      (scheduledItemsRes.data ?? []).forEach((item: any) => {
        const existing = scheduledItemsByOrder.get(item.scheduled_order_id) ?? [];
        existing.push({
          menuItemId: item.menu_item_id,
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price),
        });
        scheduledItemsByOrder.set(item.scheduled_order_id, existing);
      });

      const scheduledData: ScheduledOrder[] = (scheduledRes.data ?? []).map((order: any) => ({
        id: order.id,
        userId: order.user_id,
        restaurantId: order.restaurant_id,
        restaurantName: order.restaurant_name,
        deliveryTime: order.delivery_time,
        address: order.address,
        items: scheduledItemsByOrder.get(order.id) ?? [],
        status: order.status,
        notes: order.notes ?? undefined,
      }));

      const groupItemsByParticipant = new Map<number, GroupOrderParticipant["items"]>();
      (groupItemsRes.data ?? []).forEach((item: any) => {
        const existing = groupItemsByParticipant.get(item.participant_id) ?? [];
        existing.push({
          menuItemId: item.menu_item_id,
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price),
        });
        groupItemsByParticipant.set(item.participant_id, existing);
      });

      const participantsByGroup = new Map<string, GroupOrderParticipant[]>();
      (groupParticipantsRes.data ?? []).forEach((participant: any) => {
        const participantData: GroupOrderParticipant = {
          userId: participant.user_id,
          name: participant.name,
          items: groupItemsByParticipant.get(participant.id) ?? [],
          total: Number(participant.total),
        };
        const existing = participantsByGroup.get(participant.group_order_id) ?? [];
        existing.push(participantData);
        participantsByGroup.set(participant.group_order_id, existing);
      });

      const groupData: GroupOrder[] = (groupRes.data ?? []).map((group: any) => ({
        id: group.id,
        hostId: group.host_id,
        restaurantId: group.restaurant_id,
        restaurantName: group.restaurant_name,
        inviteCode: group.invite_code,
        status: group.status,
        closesAt: group.closes_at,
        participants: participantsByGroup.get(group.id) ?? [],
        fees: { delivery: Number(group.delivery_fee), service: Number(group.service_fee) },
      }));

      setScheduledOrders(scheduledData);
      setGroupOrders(groupData);
    };

    loadOrders();
  }, []);

  const addScheduledOrder: OrdersContextType["addScheduledOrder"] = (payload) => {
    const newOrder: ScheduledOrder = {
      ...payload,
      id: `sched-${Date.now()}`,
      status: "Scheduled",
    };

    const persist = async () => {
      await supabase.from("scheduled_orders").insert({
        id: newOrder.id,
        user_id: newOrder.userId,
        restaurant_id: newOrder.restaurantId,
        restaurant_name: newOrder.restaurantName,
        delivery_time: newOrder.deliveryTime,
        address: newOrder.address,
        status: newOrder.status,
        notes: newOrder.notes ?? null,
      });
      const itemsPayload = newOrder.items.map((item) => ({
        scheduled_order_id: newOrder.id,
        menu_item_id: item.menuItemId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));
      if (itemsPayload.length) {
        await supabase.from("scheduled_order_items").insert(itemsPayload);
      }
    };

    persist();
    setScheduledOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const cancelScheduledOrder = (id: string) => {
    supabase.from("scheduled_orders").update({ status: "Canceled" }).eq("id", id);
    setScheduledOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status: "Canceled" } : order)));
  };

  const rescheduleOrder = (id: string, deliveryTime: string) => {
    supabase.from("scheduled_orders").update({ delivery_time: deliveryTime, status: "Scheduled" }).eq("id", id);
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
    const persist = async () => {
      await supabase.from("group_orders").insert({
        id: newGroup.id,
        host_id: newGroup.hostId,
        restaurant_id: newGroup.restaurantId,
        restaurant_name: newGroup.restaurantName,
        invite_code: newGroup.inviteCode,
        status: newGroup.status,
        closes_at: newGroup.closesAt,
        delivery_fee: newGroup.fees.delivery,
        service_fee: newGroup.fees.service,
      });
    };

    persist();
    setGroupOrders((prev) => [newGroup, ...prev]);
    return newGroup;
  };

  const addParticipantToGroup: OrdersContextType["addParticipantToGroup"] = (groupId, participant) => {
    const persist = async () => {
      const { data } = await supabase
        .from("group_order_participants")
        .insert({
          group_order_id: groupId,
          user_id: participant.userId,
          name: participant.name,
          total: participant.total,
        })
        .select("id")
        .single();

      if (data?.id) {
        const itemsPayload = participant.items.map((item) => ({
          participant_id: data.id,
          menu_item_id: item.menuItemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }));
        if (itemsPayload.length) {
          await supabase.from("group_order_participant_items").insert(itemsPayload);
        }
      }
    };

    persist();
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

