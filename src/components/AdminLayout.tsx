import React from "react";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-col flex-grow">
        <main className="flex-grow p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;