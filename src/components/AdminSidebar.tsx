import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Utensils, BookOpen, Users, Package, FileText, DollarSign, MessageSquare, BarChart3, Shield, Globe, Megaphone, FlaskConical, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  className?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ className }) => {
  const navItems = [
    { name: "Dashboard", icon: Home, path: "/admin" },
    { name: "Restaurants", icon: Utensils, path: "/admin/restaurants" },
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
    <aside className={cn("w-64 bg-sidebar text-sidebar-foreground p-4 border-r", className)}>
      <div className="mb-8 text-2xl font-bold text-sidebar-primary">Admin Panel</div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            asChild
          >
            <Link to={item.path} className="flex items-center gap-3">
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          </Button>
        ))}
      </nav>
      <div className="mt-auto pt-8">
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;