import React, { useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.name || user?.email?.split("@")[0] || "Admin";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth/login");
      return;
    }
    if (user.role !== "admin") {
      navigate("/");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading admin console...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-col flex-grow">
        <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin Console</p>
              <h1 className="text-2xl font-semibold text-foreground">Operations Overview</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-border/60 bg-card px-4 py-2 text-xs text-muted-foreground">
                Live data · Secure access
              </div>
              <div className="flex items-center gap-3 rounded-full border border-border/60 bg-card px-3 py-2">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={displayName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-semibold">
                    {initials || "A"}
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-foreground leading-none">{displayName}</p>
                  <p className="text-xs text-muted-foreground leading-none">{user?.email || "admin@foodigo"}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-grow p-8 space-y-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;