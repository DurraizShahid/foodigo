import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import RestaurantDetail from "./pages/RestaurantDetail";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import OrderTracking from "./pages/OrderTracking";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import RestaurantDashboard from "./pages/restaurant/Dashboard";
import DriverDashboard from "./pages/driver/Dashboard";
import Restaurants from "./pages/admin/Restaurants";
import Drivers from "./pages/admin/Drivers";
import Customers from "./pages/admin/Customers";
import AdminOperations from "./pages/admin/Operations";
import ContentManagement from "./pages/admin/ContentManagement";
import AdminFinancial from "./pages/admin/Financial";
import AdminTicketing from "./pages/admin/Ticketing";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminFraud from "./pages/admin/Fraud";
import AdminCities from "./pages/admin/Cities";
import AdminMarketing from "./pages/admin/Marketing";
import AdminABTesting from "./pages/admin/ABTesting";
import AdminFleetManagement from "./pages/admin/FleetManagement";
import RestaurantProfile from "./pages/restaurant/Profile";
import RestaurantPromotions from "./pages/restaurant/Promotions";
import RestaurantPayouts from "./pages/restaurant/Payouts";
import RestaurantInventory from "./pages/restaurant/Inventory";
import RestaurantInsights from "./pages/restaurant/CustomerInsights";
import RestaurantDynamicPricing from "./pages/restaurant/DynamicPricing";
import RestaurantHeatmaps from "./pages/restaurant/Heatmaps";
import DriverProfile from "./pages/driver/Profile";
import DriverNavigation from "./pages/driver/Navigation";
import DriverRouteOptimization from "./pages/driver/RouteOptimization";
import DriverPayouts from "./pages/driver/Payouts";
import DriverAnalytics from "./pages/driver/Analytics";
import DriverVehicleSelection from "./pages/driver/VehicleSelection";
import DriverEarningsBoost from "./pages/driver/EarningsBoost";
import ScheduledOrders from "./pages/ScheduledOrders";
import GroupOrdering from "./pages/GroupOrdering";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { OrdersProvider } from "./context/OrdersContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <OrdersProvider>
            <BrowserRouter>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/orders/:id/track" element={<OrderTracking />} />
              <Route path="/orders/scheduled" element={<ScheduledOrders />} />
              <Route path="/group-order" element={<GroupOrdering />} />
              <Route path="/profile" element={<Profile />} />
              {/* Auth Routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<SignUp />} />
                  {/* Restaurant Routes */}
                  <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
                  <Route path="/restaurant/profile" element={<RestaurantProfile />} />
                  <Route path="/restaurant/promotions" element={<RestaurantPromotions />} />
                  <Route path="/restaurant/payouts" element={<RestaurantPayouts />} />
                  <Route path="/restaurant/inventory" element={<RestaurantInventory />} />
                  <Route path="/restaurant/insights" element={<RestaurantInsights />} />
                  <Route path="/restaurant/pricing" element={<RestaurantDynamicPricing />} />
                  <Route path="/restaurant/heatmaps" element={<RestaurantHeatmaps />} />
              {/* Driver Routes */}
              <Route path="/driver/dashboard" element={<DriverDashboard />} />
              <Route path="/driver/profile" element={<DriverProfile />} />
              <Route path="/driver/navigation" element={<DriverNavigation />} />
              <Route path="/driver/route-optimization" element={<DriverRouteOptimization />} />
              <Route path="/driver/payouts" element={<DriverPayouts />} />
              <Route path="/driver/analytics" element={<DriverAnalytics />} />
              <Route path="/driver/vehicle" element={<DriverVehicleSelection />} />
              <Route path="/driver/earnings-boost" element={<DriverEarningsBoost />} />
              {/* Admin Routes */}
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/restaurants" element={<Restaurants />} />
              <Route path="/admin/drivers" element={<Drivers />} />
              <Route path="/admin/users" element={<Customers />} />
              <Route path="/admin/content" element={<ContentManagement />} />
              <Route path="/admin/operations" element={<AdminOperations />} />
              <Route path="/admin/financial" element={<AdminFinancial />} />
              <Route path="/admin/ticketing" element={<AdminTicketing />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/fraud" element={<AdminFraud />} />
              <Route path="/admin/cities" element={<AdminCities />} />
              <Route path="/admin/marketing" element={<AdminMarketing />} />
              <Route path="/admin/ab-testing" element={<AdminABTesting />} />
              <Route path="/admin/fleet" element={<AdminFleetManagement />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </OrdersProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;