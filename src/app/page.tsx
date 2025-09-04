
"use client";

import { AdminDashboard } from "@/components/admin-dashboard";
import { UserDashboard } from "@/components/user-dashboard";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { role } = useAuth();
  
  if (role === "Super Admin") {
    return <AdminDashboard />;
  }
  
  return <UserDashboard />;
}
