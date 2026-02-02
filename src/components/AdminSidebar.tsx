import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Utensils, BookOpen, Users, Package, FileText, DollarSign, MessageSquare, BarChart3, Shield, Globe, Megaphone, FlaskConical, Truck, Tags } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  className?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ className }) => {
  const location = useLocation();
  const navItems = [
    { name: "Dashboard", icon: Home, path: "/admin" },
    { name: "Restaurants", icon: Utensils, path: "/admin/restaurants" },
    { name: "Categories", icon: Tags, path: "/admin/categories" },
    { name: "Menu Items", icon: BookOpen, path: "/admin/menu-items" },
    { name: "Orders", icon: Package, path: "/admin/orders" },
    { name: "Users", icon: Users, path: "/admin/users" },
    { name: "Content", icon: FileText, path: "/admin/content" },
    { name: "Operations", icon: Package, path: "/admin/operations" },
    { name: "Financial", icon: DollarSign, path: "/admin/financial" },
    { name: "Ticketing", icon: MessageSquare, path: "/admin/ticketing" },
    { name: "Analytics", icon: BarChart3, path: "/admin/analytics" },
    { name: "Fraud", icon: Shield, path: "/admin/fraud" },
    { name: "Cities", icon: Globe, path: "/admin/cities" },
    { name: "Marketing", icon: Megaphone, path: "/admin/marketing" },
    { name: "A/B Testing", icon: FlaskConical, path: "/admin/ab-testing" },
    { name: "Fleet Management", icon: Truck, path: "/admin/fleet" },
  ];

  return (
    <aside
      className={cn(
        "w-72 bg-sidebar text-sidebar-foreground border-r border-border/60 flex flex-col p-5",
        className
      )}
    >
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm">
        <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center text-lg font-bold">
          F
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Foodigo</p>
          <p className="text-lg font-semibold text-foreground">Admin Console</p>
        </div>
      </div>

      <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Workspace
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/admin" && location.pathname.startsWith(item.path));
          return (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 rounded-xl px-3 py-2 text-sm font-medium text-sidebar-foreground transition",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              asChild
            >
              <Link to={item.path} className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            </Button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 space-y-3">
        <div className="rounded-2xl border border-border/60 bg-card p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Need help?</p>
          <p className="mt-1">Reach the ops team for urgent issues.</p>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start rounded-xl"
          asChild
        >
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;