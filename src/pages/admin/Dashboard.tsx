import AdminLayout from "@/components/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package, Utensils, Users, DollarSign, Activity, LifeBuoy } from "lucide-react";
import { useData } from "@/context/DataContext";

const Dashboard = () => {
  const { orders, restaurants, users, adminInsights } = useData();
  const totalOrders = orders.length;
  const totalRestaurants = restaurants.length;
  const totalUsers = users.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0).toFixed(2);

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