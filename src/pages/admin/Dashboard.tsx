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

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold mb-8 text-foreground">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card text-card-foreground shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRestaurants}</div>
            <p className="text-xs text-muted-foreground">+5 new this month</p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue}</div>
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="bg-card text-card-foreground shadow-md">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Revenue Trend
              </CardTitle>
              <p className="text-xs text-muted-foreground">Month-to-date performance</p>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-4">
            {adminInsights.revenue.map((point) => (
              <div key={point.label} className="text-center">
                <p className="text-sm text-muted-foreground">{point.label}</p>
                <p className="text-xl font-semibold">${(point.value / 1000).toFixed(1)}k</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground shadow-md">
          <CardHeader>
            <CardTitle>City Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {adminInsights.cityBreakdown.map((city) => (
              <div key={city.city} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-semibold">{city.city}</p>
                  <p className="text-xs text-muted-foreground">{city.restaurants} restaurants</p>
                </div>
                <p className="text-sm font-medium">{city.orders} orders</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Support Tickets</h2>
        <Card className="bg-card text-card-foreground shadow-md">
          <CardContent className="p-6 space-y-3">
            {adminInsights.supportTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-semibold">{ticket.type}</p>
                  <p className="text-xs text-muted-foreground">Priority: {ticket.priority}</p>
                </div>
                <CardTitle className="text-sm flex items-center gap-2">
                  <LifeBuoy className="h-4 w-4 text-primary" />
                  {ticket.status}
                </CardTitle>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;