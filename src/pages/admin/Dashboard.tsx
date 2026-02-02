import AdminLayout from "@/components/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package, Utensils, Users, DollarSign, Activity, LifeBuoy } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const Dashboard = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState("0.00");
  const [adminInsights, setAdminInsights] = useState<{
    revenue: Array<{ label: string; value: number }>;
    cityBreakdown: Array<{ city: string; restaurants: number; orders: number }>;
    supportTickets: Array<{ id: string; type: string; status: string; priority: string }>;
  }>({ revenue: [], cityBreakdown: [], supportTickets: [] });

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      const [{ data: orderRows }, { data: restaurantRows }, { data: profileRows }, { data: cityRows }, { data: ticketRows }] =
        await Promise.all([
          supabase.from("orders").select("id, total, created_at"),
          supabase.from("restaurants").select("id"),
          supabase.from("profiles").select("id"),
          supabase.from("city_operations").select("name, restaurants, orders").order("name"),
          supabase.from("support_tickets").select("id, type, status, priority").order("updated_at", { ascending: false }).limit(6),
        ]);

      if (!active) return;

      const orderTotal = (orderRows || []).reduce((sum, order) => sum + Number(order.total), 0);
      const revenueByMonth = (orderRows || []).reduce<Record<string, number>>((acc, order) => {
        const date = new Date(order.created_at);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        acc[key] = (acc[key] || 0) + Number(order.total || 0);
        return acc;
      }, {});
      const monthLabels = Object.keys(revenueByMonth)
        .map((key) => {
          const [year, month] = key.split("-").map(Number);
          return { key, year, month };
        })
        .sort((a, b) => (a.year - b.year) || (a.month - b.month))
        .slice(-4)
        .map(({ key, year, month }) => ({
          label: new Date(year, month, 1).toLocaleString(undefined, { month: "short" }),
          value: revenueByMonth[key] || 0,
        }));
      setTotalOrders(orderRows?.length || 0);
      setTotalRestaurants(restaurantRows?.length || 0);
      setTotalUsers(profileRows?.length || 0);
      setTotalRevenue(orderTotal.toFixed(2));

      setAdminInsights({
        revenue: monthLabels,
        cityBreakdown: (cityRows || []).map((city) => ({
          city: city.name,
          restaurants: city.restaurants || 0,
          orders: city.orders || 0,
        })),
        supportTickets: (ticketRows || []).map((ticket) => ({
          id: ticket.id,
          type: ticket.type || "General",
          status: ticket.status || "Open",
          priority: ticket.priority || "low",
        })),
      });
    };
    loadData();
    return () => {
      active = false;
    };
  }, []);

  const priorityStyles: Record<string, string> = {
    high: "bg-rose-100 text-rose-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-emerald-100 text-emerald-700",
  };
  const defaultPriorityStyle = "bg-slate-100 text-slate-700";

  return (
    <AdminLayout>
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Performance snapshot</p>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor revenue, city operations, and support health in real time.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Orders", value: totalOrders, meta: "+20.1% from last month", icon: Package },
          { label: "Total Restaurants", value: totalRestaurants, meta: "+5 new this month", icon: Utensils },
          { label: "Total Users", value: totalUsers, meta: "+15% from last month", icon: Users },
          { label: "Total Revenue", value: `$${totalRevenue}`, meta: "+10% from last month", icon: DollarSign },
        ].map((stat) => (
          <Card key={stat.label} className="rounded-2xl border border-border/60 bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.meta}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <Card className="rounded-2xl border border-border/60 bg-card shadow-sm">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Revenue Trend
              </CardTitle>
              <p className="text-xs text-muted-foreground">Month-to-date performance</p>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {adminInsights.revenue.map((point) => (
              <div key={point.label} className="rounded-xl border border-border/60 p-4 text-center">
                <p className="text-sm text-muted-foreground">{point.label}</p>
                <p className="text-xl font-semibold">${(point.value / 1000).toFixed(1)}k</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>City Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {adminInsights.cityBreakdown.map((city) => (
              <div key={city.city} className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                <div>
                  <p className="font-semibold">{city.city}</p>
                  <p className="text-xs text-muted-foreground">{city.restaurants} restaurants</p>
                </div>
                <p className="text-sm font-medium">{city.orders} orders</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Support Tickets</h2>
        </div>
        <Card className="rounded-2xl border border-border/60 bg-card shadow-sm">
          <CardContent className="p-6 space-y-3">
            {adminInsights.supportTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                <div className="space-y-1">
                  <p className="font-semibold">{ticket.type}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-muted px-3 py-1">{ticket.status}</span>
                    <span
                      className={[
                        "rounded-full px-3 py-1",
                        priorityStyles[ticket.priority] || defaultPriorityStyle,
                      ].join(" ")}
                    >
                      {ticket.priority.toUpperCase()} priority
                    </span>
                  </div>
                </div>
                <CardTitle className="text-sm flex items-center gap-2">
                  <LifeBuoy className="h-4 w-4 text-primary" />
                  View
                </CardTitle>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </AdminLayout>
  );
};

export default Dashboard;