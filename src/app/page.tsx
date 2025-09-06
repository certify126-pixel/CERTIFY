
"use client";

import { AdminDashboard } from "@/components/admin-dashboard";
import { InstitutionDashboard } from "@/components/institution-dashboard";
import { UserDashboard } from "@/components/user-dashboard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (role === "Super Admin") {
    return <AdminDashboard />;
  }
  
  if (role === "Institution") {
    return <InstitutionDashboard />;
  }

  return <UserDashboard />;
}
