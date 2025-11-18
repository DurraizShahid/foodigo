import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/context/CartContext"; // Import useCart

const Header = () => {
  const { totalItems } = useCart(); // Use totalItems from cart context

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary">
          <img src="/logo.svg" alt="Foodigo Logo" className="h-8 w-8" />
          <span>Foodigo</span>
        </Link>

        <div className="relative flex-1 max-w-md mx-4 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for restaurants or dishes..."
            className="pl-9 pr-4 py-2 rounded-full border-input focus-visible:ring-primary"
          />
        </div>

        <nav className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && ( // Only show badge if there are items
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button asChild className="rounded-full bg-primary hover:bg-primary/90">
            <Link to="/admin">Admin Panel</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;