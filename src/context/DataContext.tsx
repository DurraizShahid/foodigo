import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

type Category = { id: string; name: string; image: string };
type MenuItem = { id: string; name: string; price: number; calories: number; description: string; image: string };
type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  priceRange: string;
  distanceKm: number;
  tags: string[];
  image: string;
  description: string;
  address: string;
  menu: MenuItem[];
};
type OrderItem = { menuItemId: string; name: string; quantity: number; price: number };
type Order = { id: string; userId: string; restaurantId: string; items: OrderItem[]; total: number; status: string; createdAt: string };
type UserProfile = { id: string; name: string; email: string; avatar?: string };
type Offer = { id: string; image: string; title: string; description: string };
type ScheduledOrder = {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  deliveryTime: string;
  address: string;
  items: OrderItem[];
  status: "Scheduled" | "Preparing" | "Canceled";
  notes?: string;
};
type GroupOrderParticipant = { userId: string; name: string; items: OrderItem[]; total: number };
type GroupOrder = {
  id: string;
  hostId: string;
  restaurantId: string;
  restaurantName: string;
  inviteCode: string;
  status: "Collecting" | "Submitted" | "Closed";
  closesAt: string;
  participants: GroupOrderParticipant[];
  fees: { delivery: number; service: number };
};
type Subscription = { userId: string; tier: string; perks: string[]; renewalDate: string | null; monthlyFee: number; active: boolean };
type LoyaltyActivity = { id: string; label: string; points: number; date: string };
type LoyaltyReward = { userId: string; points: number; nextRewardAt: number; badges: string[]; recentActivity: LoyaltyActivity[] };
type RecommendationSeed = { id: string; title: string; description: string; restaurantIds: string[] };
type SmartCollectionItem = { restaurantId: string; menuItemId: string; name: string; eta: string };
type SmartCollection = { id: string; title: string; subtitle: string; items: SmartCollectionItem[] };
type PaymentMethod = { id: string; brand: string; last4: string; exp: string; primary: boolean };
type PaymentProvider = { id: string; name: string; status: string; lastSync: string };
type PushEventTemplate = { id: string; channel: string; title: string; body: string };
type RestaurantAnalytics = {
  salesTrend: Array<{ label: string; value: number }>;
  topItems: Array<{ name: string; orders: number; revenue: number }>;
  payoutHistory: Array<{ id: string; amount: number; status: string; date: string }>;
  inventory: Array<{ id: string; name: string; level: number; status: string }>;
  profile: { restaurantName: string; phone: string; email: string; hours: string; prepTime: string };
  promotions: Array<{ id: string; name: string; type: string; status: string; run: string }>;
};
type DriverStats = {
  earnings: { week: Array<{ label: string; value: number }>; total: number; completedDeliveries: number; avgRating: number };
  hotspots: Array<{ name: string; eta: string; distance: string }>;
  incentives: Array<{ id: string; title: string; requirement: string; reward: string; progress: number; target: number }>;
  chats: Array<{ id: string; name: string; snippet: string; time: string }>;
};
type AdminInsights = {
  revenue: Array<{ label: string; value: number }>;
  cityBreakdown: Array<{ city: string; restaurants: number; orders: number }>;
  supportTickets: Array<{ id: string; type: string; status: string; priority: string }>;
};
type AdminAnalyticsData = {
  userGrowth: Array<{ month: string; users: number; growth: number }>;
  orderTrends: Array<{ day: string; orders: number; revenue: number }>;
  topRestaurants: Array<{ name: string; orders: number; revenue: number; rating: number }>;
  customerSegments: Array<{ segment: string; count: number; percentage: number }>;
  retentionRate: number;
  churnRate: number;
  ltv: number;
};
type AdminFinancialData = {
  totalRevenue: number;
  monthlyRevenue: number;
  growth: number;
  totalOrders: number;
  averageOrderValue: number;
  commission: number;
  platformFees: number;
  payouts: { restaurants: number; drivers: number; total: number };
  netProfit: number;
  profitMargin: number;
  revenueByCity: Array<{ city: string; revenue: number; orders: number; growth: number }>;
  monthlyBreakdown: Array<{ month: string; revenue: number; profit: number }>;
};
type Experiment = {
  id: string;
  name: string;
  description: string;
  feature: string;
  variantA: string;
  variantB: string;
  status: string;
  trafficSplit: number;
  participants: number;
  variantAUsers: number;
  variantBUsers: number;
  variantAConversion: number;
  variantBConversion: number;
  startDate?: string | null;
  endDate?: string | null;
  segment: string;
};
type FraudAlert = {
  id: string;
  type: string;
  risk: string;
  action: string;
  city: string;
  orderId?: string;
  userId?: string;
  description: string;
  detectedAt: string;
  status: string;
  score: number;
};
type CityOperation = {
  id: string;
  name: string;
  country: string;
  status: string;
  surge: string;
  restaurants: number;
  drivers: number;
  orders: number;
  revenue: number;
};
type SupportTicket = {
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
};
type InventoryItem = {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  autoOutOfStock: boolean;
  lastUpdated: string;
};

interface DataContextType {
  categories: Category[];
  restaurants: Restaurant[];
  orders: Order[];
  users: UserProfile[];
  offers: Offer[];
  scheduledOrders: ScheduledOrder[];
  groupOrders: GroupOrder[];
  subscriptions: Subscription[];
  loyaltyRewards: LoyaltyReward[];
  recommendationSeeds: RecommendationSeed[];
  smartCollections: SmartCollection[];
  paymentVault: PaymentMethod[];
  paymentProviders: PaymentProvider[];
  pushEventTemplates: PushEventTemplate[];
  restaurantAnalytics: RestaurantAnalytics;
  driverStats: DriverStats;
  adminInsights: AdminInsights;
  adminAnalytics: AdminAnalyticsData;
  adminFinancial: AdminFinancialData;
  experiments: Experiment[];
  fraudAlerts: FraudAlert[];
  cityOperations: CityOperation[];
  supportTickets: SupportTicket[];
  inventoryItems: InventoryItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const emptyAnalytics: RestaurantAnalytics = {
  salesTrend: [],
  topItems: [],
  payoutHistory: [],
  inventory: [],
  profile: { restaurantName: "", phone: "", email: "", hours: "", prepTime: "" },
  promotions: [],
};

const emptyDriverStats: DriverStats = {
  earnings: { week: [], total: 0, completedDeliveries: 0, avgRating: 0 },
  hotspots: [],
  incentives: [],
  chats: [],
};

const emptyAdminInsights: AdminInsights = { revenue: [], cityBreakdown: [], supportTickets: [] };
const emptyAdminAnalytics: AdminAnalyticsData = {
  userGrowth: [],
  orderTrends: [],
  topRestaurants: [],
  customerSegments: [],
  retentionRate: 0,
  churnRate: 0,
  ltv: 0,
};
const emptyAdminFinancial: AdminFinancialData = {
  totalRevenue: 0,
  monthlyRevenue: 0,
  growth: 0,
  totalOrders: 0,
  averageOrderValue: 0,
  commission: 0,
  platformFees: 0,
  payouts: { restaurants: 0, drivers: 0, total: 0 },
  netProfit: 0,
  profitMargin: 0,
  revenueByCity: [],
  monthlyBreakdown: [],
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [scheduledOrders, setScheduledOrders] = useState<ScheduledOrder[]>([]);
  const [groupOrders, setGroupOrders] = useState<GroupOrder[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loyaltyRewards, setLoyaltyRewards] = useState<LoyaltyReward[]>([]);
  const [recommendationSeeds, setRecommendationSeeds] = useState<RecommendationSeed[]>([]);
  const [smartCollections, setSmartCollections] = useState<SmartCollection[]>([]);
  const [paymentVault, setPaymentVault] = useState<PaymentMethod[]>([]);
  const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>([]);
  const [pushEventTemplates, setPushEventTemplates] = useState<PushEventTemplate[]>([]);
  const [restaurantAnalytics, setRestaurantAnalytics] = useState<RestaurantAnalytics>(emptyAnalytics);
  const [driverStats, setDriverStats] = useState<DriverStats>(emptyDriverStats);
  const [adminInsights, setAdminInsights] = useState<AdminInsights>(emptyAdminInsights);
  const [adminAnalytics, setAdminAnalytics] = useState<AdminAnalyticsData>(emptyAdminAnalytics);
  const [adminFinancial, setAdminFinancial] = useState<AdminFinancialData>(emptyAdminFinancial);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [cityOperations, setCityOperations] = useState<CityOperation[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [
      categoriesRes,
      restaurantsRes,
      ordersRes,
      profilesRes,
      offersRes,
      scheduledRes,
      scheduledItemsRes,
      groupRes,
      groupParticipantsRes,
      groupItemsRes,
      subscriptionsRes,
      loyaltyRes,
      loyaltyActivityRes,
      recommendationsRes,
      recommendationRestaurantsRes,
      collectionsRes,
      collectionItemsRes,
      paymentMethodsRes,
      paymentProvidersRes,
      pushTemplatesRes,
      salesTrendRes,
      topItemsRes,
      payoutsRes,
      inventoryRes,
      profileStatsRes,
      promotionsRes,
      driverStatsRes,
      driverWeekRes,
      driverHotspotsRes,
      driverIncentivesRes,
      driverChatsRes,
      adminRevenueRes,
      adminCityRes,
      adminTicketsRes,
      adminAnalyticsSummaryRes,
      adminAnalyticsUserGrowthRes,
      adminAnalyticsOrderTrendsRes,
      adminAnalyticsTopRestaurantsRes,
      adminAnalyticsCustomerSegmentsRes,
      adminFinancialSummaryRes,
      adminFinancialByCityRes,
      adminFinancialMonthlyRes,
      supportTicketsRes,
      experimentsRes,
      fraudRes,
      cityOpsRes,
    ] = await Promise.all([
      supabase.from("categories").select("*"),
      supabase.from("restaurants").select("*, menu_items(*)"),
      supabase.from("orders").select("*, order_items(*)"),
      supabase.from("profiles").select("*"),
      supabase.from("offers").select("*"),
      supabase.from("scheduled_orders").select("*"),
      supabase.from("scheduled_order_items").select("*"),
      supabase.from("group_orders").select("*"),
      supabase.from("group_order_participants").select("*"),
      supabase.from("group_order_participant_items").select("*"),
      supabase.from("subscriptions").select("*"),
      supabase.from("loyalty_rewards").select("*"),
      supabase.from("loyalty_activity").select("*"),
      supabase.from("recommendation_seeds").select("*"),
      supabase.from("recommendation_seed_restaurants").select("*"),
      supabase.from("smart_collections").select("*"),
      supabase.from("smart_collection_items").select("*"),
      supabase.from("payment_methods").select("*"),
      supabase.from("payment_providers").select("*"),
      supabase.from("push_event_templates").select("*"),
      supabase.from("restaurant_sales_trend").select("*"),
      supabase.from("restaurant_top_items").select("*"),
      supabase.from("restaurant_payouts").select("*"),
      supabase.from("restaurant_inventory").select("*"),
      supabase.from("restaurant_profile_stats").select("*"),
      supabase.from("restaurant_promotions").select("*"),
      supabase.from("driver_stats").select("*"),
      supabase.from("driver_earnings_week").select("*"),
      supabase.from("driver_hotspots").select("*"),
      supabase.from("driver_incentives").select("*"),
      supabase.from("driver_chats").select("*"),
      supabase.from("admin_revenue").select("*"),
      supabase.from("admin_city_breakdown").select("*"),
      supabase.from("admin_support_tickets").select("*"),
      supabase.from("admin_analytics_summary").select("*"),
      supabase.from("admin_analytics_user_growth").select("*"),
      supabase.from("admin_analytics_order_trends").select("*"),
      supabase.from("admin_analytics_top_restaurants").select("*"),
      supabase.from("admin_analytics_customer_segments").select("*"),
      supabase.from("admin_financial_summary").select("*"),
      supabase.from("admin_financial_revenue_by_city").select("*"),
      supabase.from("admin_financial_monthly_breakdown").select("*"),
      supabase.from("support_tickets").select("*"),
      supabase.from("experiments").select("*"),
      supabase.from("fraud_alerts").select("*"),
      supabase.from("city_operations").select("*"),
    ]);

    const firstError = [
      categoriesRes.error,
      restaurantsRes.error,
      ordersRes.error,
      profilesRes.error,
      offersRes.error,
      scheduledRes.error,
      scheduledItemsRes.error,
      groupRes.error,
      groupParticipantsRes.error,
      groupItemsRes.error,
      subscriptionsRes.error,
      loyaltyRes.error,
      loyaltyActivityRes.error,
      recommendationsRes.error,
      recommendationRestaurantsRes.error,
      collectionsRes.error,
      collectionItemsRes.error,
      paymentMethodsRes.error,
      paymentProvidersRes.error,
      pushTemplatesRes.error,
      salesTrendRes.error,
      topItemsRes.error,
      payoutsRes.error,
      inventoryRes.error,
      profileStatsRes.error,
      promotionsRes.error,
      driverStatsRes.error,
      driverWeekRes.error,
      driverHotspotsRes.error,
      driverIncentivesRes.error,
      driverChatsRes.error,
      adminRevenueRes.error,
      adminCityRes.error,
      adminTicketsRes.error,
      adminAnalyticsSummaryRes.error,
      adminAnalyticsUserGrowthRes.error,
      adminAnalyticsOrderTrendsRes.error,
      adminAnalyticsTopRestaurantsRes.error,
      adminAnalyticsCustomerSegmentsRes.error,
      adminFinancialSummaryRes.error,
      adminFinancialByCityRes.error,
      adminFinancialMonthlyRes.error,
      supportTicketsRes.error,
      experimentsRes.error,
      fraudRes.error,
      cityOpsRes.error,
    ].find(Boolean);

    if (firstError) {
      setError(firstError.message);
      setLoading(false);
      return;
    }

    const categoryData = (categoriesRes.data ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image_url,
    }));

    const restaurantData: Restaurant[] = (restaurantsRes.data ?? []).map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      rating: Number(restaurant.rating),
      deliveryTime: restaurant.delivery_time,
      priceRange: restaurant.price_range,
      distanceKm: Number(restaurant.distance_km),
      tags: restaurant.tags ?? [],
      image: restaurant.image_url,
      description: restaurant.description,
      address: restaurant.address,
      menu: (restaurant.menu_items ?? []).map((item: any) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        calories: item.calories,
        description: item.description,
        image: item.image_url,
      })),
    }));

    const orderData: Order[] = (ordersRes.data ?? []).map((order: any) => ({
      id: order.id,
      userId: order.user_id,
      restaurantId: order.restaurant_id,
      items: (order.order_items ?? []).map((item: any) => ({
        menuItemId: item.menu_item_id,
        name: item.name,
        quantity: item.quantity,
        price: Number(item.price),
      })),
      total: Number(order.total),
      status: order.status,
      createdAt: order.created_at,
    }));

    const userData: UserProfile[] = (profilesRes.data ?? []).map((profile) => ({
      id: profile.id,
      name: profile.name ?? profile.email?.split("@")[0],
      email: profile.email,
      avatar: profile.avatar_url ?? undefined,
    }));

    const scheduledItemsByOrder = new Map<string, OrderItem[]>();
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

    const groupItemsByParticipant = new Map<number, OrderItem[]>();
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
      const participantData = {
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

    const subscriptionsData: Subscription[] = (subscriptionsRes.data ?? []).map((sub: any) => ({
      userId: sub.user_id,
      tier: sub.tier,
      perks: sub.perks ?? [],
      renewalDate: sub.renewal_date,
      monthlyFee: Number(sub.monthly_fee),
      active: sub.active,
    }));

    const loyaltyActivityByReward = new Map<number, LoyaltyActivity[]>();
    (loyaltyActivityRes.data ?? []).forEach((activity: any) => {
      const existing = loyaltyActivityByReward.get(activity.loyalty_reward_id) ?? [];
      existing.push({
        id: activity.id,
        label: activity.label,
        points: activity.points,
        date: activity.activity_date,
      });
      loyaltyActivityByReward.set(activity.loyalty_reward_id, existing);
    });

    const loyaltyData: LoyaltyReward[] = (loyaltyRes.data ?? []).map((reward: any) => ({
      userId: reward.user_id,
      points: reward.points,
      nextRewardAt: reward.next_reward_at,
      badges: reward.badges ?? [],
      recentActivity: loyaltyActivityByReward.get(reward.id) ?? [],
    }));

    const recommendationRestaurants = new Map<string, string[]>();
    (recommendationRestaurantsRes.data ?? []).forEach((row: any) => {
      const existing = recommendationRestaurants.get(row.recommendation_id) ?? [];
      existing.push(row.restaurant_id);
      recommendationRestaurants.set(row.recommendation_id, existing);
    });

    const recommendationData: RecommendationSeed[] = (recommendationsRes.data ?? []).map((seed: any) => ({
      id: seed.id,
      title: seed.title,
      description: seed.description,
      restaurantIds: recommendationRestaurants.get(seed.id) ?? [],
    }));

    const collectionItemsByCollection = new Map<string, SmartCollectionItem[]>();
    (collectionItemsRes.data ?? []).forEach((item: any) => {
      const existing = collectionItemsByCollection.get(item.collection_id) ?? [];
      existing.push({
        restaurantId: item.restaurant_id,
        menuItemId: item.menu_item_id,
        name: item.name,
        eta: item.eta,
      });
      collectionItemsByCollection.set(item.collection_id, existing);
    });

    const collectionData: SmartCollection[] = (collectionsRes.data ?? []).map((collection: any) => ({
      id: collection.id,
      title: collection.title,
      subtitle: collection.subtitle,
      items: collectionItemsByCollection.get(collection.id) ?? [],
    }));

    const paymentMethodsData: PaymentMethod[] = (paymentMethodsRes.data ?? []).map((method: any) => ({
      id: method.id,
      brand: method.brand,
      last4: method.last4,
      exp: method.exp,
      primary: method.is_primary,
    }));

    const paymentProvidersData: PaymentProvider[] = (paymentProvidersRes.data ?? []).map((provider: any) => ({
      id: provider.id,
      name: provider.name,
      status: provider.status,
      lastSync: provider.last_sync,
    }));

    const pushTemplatesData: PushEventTemplate[] = (pushTemplatesRes.data ?? []).map((template: any) => ({
      id: template.id,
      channel: template.channel,
      title: template.title,
      body: template.body,
    }));

    const analyticsRestaurantId = restaurantData[0]?.id ?? "res1";
    const restaurantAnalyticsData: RestaurantAnalytics = {
      salesTrend: (salesTrendRes.data ?? [])
        .filter((row: any) => row.restaurant_id === analyticsRestaurantId)
        .map((row: any) => ({ label: row.label, value: row.value })),
      topItems: (topItemsRes.data ?? [])
        .filter((row: any) => row.restaurant_id === analyticsRestaurantId)
        .map((row: any) => ({ name: row.name, orders: row.orders, revenue: Number(row.revenue) })),
      payoutHistory: (payoutsRes.data ?? [])
        .filter((row: any) => row.restaurant_id === analyticsRestaurantId)
        .map((row: any) => ({ id: row.id, amount: Number(row.amount), status: row.status, date: row.payout_date })),
      inventory: (inventoryRes.data ?? [])
        .filter((row: any) => row.restaurant_id === analyticsRestaurantId)
        .map((row: any) => ({ id: row.id, name: row.name, level: row.level, status: row.status })),
      profile:
        (profileStatsRes.data ?? [])
          .filter((row: any) => row.restaurant_id === analyticsRestaurantId)
          .map((row: any) => ({
            restaurantName: row.restaurant_name,
            phone: row.phone,
            email: row.email,
            hours: row.hours,
            prepTime: row.prep_time,
          }))[0] ?? emptyAnalytics.profile,
      promotions: (promotionsRes.data ?? [])
        .filter((row: any) => row.restaurant_id === analyticsRestaurantId)
        .map((row: any) => ({ id: row.id, name: row.name, type: row.type, status: row.status, run: row.run })),
    };

    const driverBase = driverStatsRes.data?.[0];
    const driverId = driverBase?.user_id;
    const driverStatsData: DriverStats = driverBase
      ? {
          earnings: {
            week: (driverWeekRes.data ?? [])
              .filter((row: any) => row.user_id === driverId)
              .map((row: any) => ({ label: row.label, value: Number(row.value) })),
            total: Number(driverBase.total),
            completedDeliveries: driverBase.completed_deliveries,
            avgRating: Number(driverBase.avg_rating),
          },
          hotspots: (driverHotspotsRes.data ?? [])
            .filter((row: any) => row.user_id === driverId)
            .map((row: any) => ({ name: row.name, eta: row.eta, distance: row.distance })),
          incentives: (driverIncentivesRes.data ?? [])
            .filter((row: any) => row.user_id === driverId)
            .map((row: any) => ({
              id: row.id,
              title: row.title,
              requirement: row.requirement,
              reward: row.reward,
              progress: Number(row.progress),
              target: Number(row.target),
            })),
          chats: (driverChatsRes.data ?? [])
            .filter((row: any) => row.user_id === driverId)
            .map((row: any) => ({ id: row.id, name: row.name, snippet: row.snippet, time: row.time })),
        }
      : emptyDriverStats;

    const adminInsightsData: AdminInsights = {
      revenue: (adminRevenueRes.data ?? []).map((row: any) => ({ label: row.label, value: row.value })),
      cityBreakdown: (adminCityRes.data ?? []).map((row: any) => ({
        city: row.city,
        restaurants: row.restaurants,
        orders: row.orders,
      })),
      supportTickets: (adminTicketsRes.data ?? []).map((row: any) => ({
        id: row.id,
        type: row.type,
        status: row.status,
        priority: row.priority,
      })),
    };

    const analyticsSummary = adminAnalyticsSummaryRes.data?.[0];
    const adminAnalyticsData: AdminAnalyticsData = {
      userGrowth: (adminAnalyticsUserGrowthRes.data ?? []).map((row: any) => ({
        month: row.month,
        users: row.users,
        growth: row.growth,
      })),
      orderTrends: (adminAnalyticsOrderTrendsRes.data ?? []).map((row: any) => ({
        day: row.day,
        orders: row.orders,
        revenue: row.revenue,
      })),
      topRestaurants: (adminAnalyticsTopRestaurantsRes.data ?? []).map((row: any) => ({
        name: row.name,
        orders: row.orders,
        revenue: row.revenue,
        rating: Number(row.rating),
      })),
      customerSegments: (adminAnalyticsCustomerSegmentsRes.data ?? []).map((row: any) => ({
        segment: row.segment,
        count: row.count,
        percentage: row.percentage,
      })),
      retentionRate: Number(analyticsSummary?.retention_rate ?? 0),
      churnRate: Number(analyticsSummary?.churn_rate ?? 0),
      ltv: Number(analyticsSummary?.ltv ?? 0),
    };

    const financialSummary = adminFinancialSummaryRes.data?.[0];
    const adminFinancialData: AdminFinancialData = {
      totalRevenue: Number(financialSummary?.total_revenue ?? 0),
      monthlyRevenue: Number(financialSummary?.monthly_revenue ?? 0),
      growth: Number(financialSummary?.growth ?? 0),
      totalOrders: Number(financialSummary?.total_orders ?? 0),
      averageOrderValue: Number(financialSummary?.average_order_value ?? 0),
      commission: Number(financialSummary?.commission ?? 0),
      platformFees: Number(financialSummary?.platform_fees ?? 0),
      payouts: {
        restaurants: Number(financialSummary?.payout_restaurants ?? 0),
        drivers: Number(financialSummary?.payout_drivers ?? 0),
        total: Number(financialSummary?.payout_total ?? 0),
      },
      netProfit: Number(financialSummary?.net_profit ?? 0),
      profitMargin: Number(financialSummary?.profit_margin ?? 0),
      revenueByCity: (adminFinancialByCityRes.data ?? []).map((row: any) => ({
        city: row.city,
        revenue: row.revenue,
        orders: row.orders,
        growth: row.growth,
      })),
      monthlyBreakdown: (adminFinancialMonthlyRes.data ?? []).map((row: any) => ({
        month: row.month,
        revenue: row.revenue,
        profit: row.profit,
      })),
    };

    setCategories(categoryData);
    setRestaurants(restaurantData);
    setOrders(orderData);
    setUsers(userData);
    setOffers((offersRes.data ?? []).map((offer: any) => ({
      id: offer.id,
      image: offer.image_url,
      title: offer.title,
      description: offer.description,
    })));
    setScheduledOrders(scheduledData);
    setGroupOrders(groupData);
    setSubscriptions(subscriptionsData);
    setLoyaltyRewards(loyaltyData);
    setRecommendationSeeds(recommendationData);
    setSmartCollections(collectionData);
    setPaymentVault(paymentMethodsData);
    setPaymentProviders(paymentProvidersData);
    setPushEventTemplates(pushTemplatesData);
    setRestaurantAnalytics(restaurantAnalyticsData);
    setDriverStats(driverStatsData);
    setAdminInsights(adminInsightsData);
    setAdminAnalytics(adminAnalyticsData);
    setAdminFinancial(adminFinancialData);
    setExperiments((experimentsRes.data ?? []).map((exp: any) => ({
      id: exp.id,
      name: exp.name,
      description: exp.description,
      feature: exp.feature,
      variantA: exp.variant_a,
      variantB: exp.variant_b,
      trafficSplit: Number(exp.traffic_split),
      participants: exp.participants,
      variantAUsers: exp.variant_a_users,
      variantBUsers: exp.variant_b_users,
      variantAConversion: Number(exp.variant_a_conversion),
      variantBConversion: Number(exp.variant_b_conversion),
      startDate: exp.start_date,
      endDate: exp.end_date ?? undefined,
      segment: exp.segment,
      status: exp.status,
    })));
    setFraudAlerts((fraudRes.data ?? []).map((alert: any) => ({
      id: alert.id,
      type: alert.type,
      risk: alert.risk,
      action: alert.action,
      city: alert.city,
      orderId: alert.order_id ?? undefined,
      userId: alert.user_id ?? undefined,
      description: alert.description,
      detectedAt: alert.detected_at,
      status: alert.status,
      score: alert.score,
    })));
    setCityOperations((cityOpsRes.data ?? []).map((city: any) => ({
      id: city.id,
      name: city.name,
      country: city.country,
      status: city.status,
      surge: city.surge,
      restaurants: city.restaurants,
      drivers: city.drivers,
      orders: city.orders,
      revenue: Number(city.revenue),
    })));
    setSupportTickets((supportTicketsRes.data ?? []).map((ticket: any) => ({
      id: ticket.id,
      subject: ticket.subject,
      type: ticket.type,
      priority: ticket.priority,
      status: ticket.status,
      assignedTo: ticket.assigned_to,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at,
      customer: ticket.customer,
      description: ticket.description,
      messages: ticket.messages ?? [],
    })));
    setInventoryItems(
      (inventoryRes.data ?? []).map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        currentStock: item.current_stock,
        minStock: item.min_stock,
        unit: item.unit,
        autoOutOfStock: item.auto_out_of_stock,
        lastUpdated: item.last_updated,
      }))
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      categories,
      restaurants,
      orders,
      users,
      offers,
      scheduledOrders,
      groupOrders,
      subscriptions,
      loyaltyRewards,
      recommendationSeeds,
      smartCollections,
      paymentVault,
      paymentProviders,
      pushEventTemplates,
      restaurantAnalytics,
      driverStats,
      adminInsights,
      adminAnalytics,
      adminFinancial,
      experiments,
      fraudAlerts,
      cityOperations,
      supportTickets,
      inventoryItems,
      loading,
      error,
      refresh,
    }),
    [
      categories,
      restaurants,
      orders,
      users,
      offers,
      scheduledOrders,
      groupOrders,
      subscriptions,
      loyaltyRewards,
      recommendationSeeds,
      smartCollections,
      paymentVault,
      paymentProviders,
      pushEventTemplates,
      restaurantAnalytics,
      driverStats,
      adminInsights,
      adminAnalytics,
      adminFinancial,
      experiments,
      fraudAlerts,
      cityOperations,
      supportTickets,
      inventoryItems,
      loading,
      error,
      refresh,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
