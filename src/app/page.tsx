
"use client";

import { AdminDashboard } from "@/components/admin-dashboard";
import { InstitutionDashboard } from "@/components/institution-dashboard";
import { UserDashboard } from "@/components/user-dashboard";
import { useAuth } from "@/context/AuthContext";
import { VerifyCertificateDialog } from "@/components/verify-certificate-dialog";

export default function Home() {
  const { role } = useAuth();
  
  if (role === "Super Admin") {
    return <AdminDashboard />;
  }
  
  if (role === "Institution") {
    return <InstitutionDashboard />;
  }

  return <UserDashboard />;
}
