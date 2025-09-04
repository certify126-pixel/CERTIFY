
"use client";

import * as React from "react";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Bot,
  Building,
  FileCheck,
  FileText,
  Home,
  Info,
  LayoutDashboard,
  LogOut,
  Mail,
  ScanEye,
  ShieldX,
} from "lucide-react";
import { CertiCheckLogo } from "@/components/icons";
import { VerifyCertificateDialog } from "@/components/verify-certificate-dialog";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
        await signOut(auth);
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        });
        } catch (error) {
        toast({
            variant: "destructive",
            title: "Logout Failed",
            description: "An error occurred while logging out.",
        });
        }
    };

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r border-sidebar-border/50">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <CertiCheckLogo className="w-8 h-8 text-primary" />
            <h1 className="font-headline text-lg font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              CertiCheck
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/" passHref>
                  <SidebarMenuButton tooltip="Dashboard" isActive={pathname === '/'}>
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Institutions">
                <Building />
                <span>Institutions</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Verifications">
                <ScanEye />
                <span>Verifications</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Blacklist">
                <ShieldX />
                <span>Blacklist</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/about" passHref>
                  <SidebarMenuButton tooltip="About Us" isActive={pathname === '/about'}>
                    <Info />
                    <span>About Us</span>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/privacy" passHref>
                  <SidebarMenuButton tooltip="Privacy Policy" isActive={pathname === '/privacy'}>
                    <FileText />
                    <span>Privacy Policy</span>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/contact" passHref>
                  <SidebarMenuButton tooltip="Contact Us" isActive={pathname === '/contact'}>
                    <Mail />
                    <span>Contact Us</span>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                        <LogOut />
                        <span>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          <div className="flex items-center gap-3 p-3 border-t border-sidebar-border/50">
             <Avatar className="h-10 w-10 border-2 border-primary-foreground/50">
              <AvatarImage src="https://picsum.photos/100/100" data-ai-hint="person" alt="Admin" />
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-semibold text-sidebar-foreground truncate">{user?.email}</span>
              <span className="text-xs text-sidebar-foreground/70">Super Admin</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <h1 className="font-headline text-2xl font-bold text-foreground">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <VerifyCertificateDialog>
              <Button>
                <FileCheck className="mr-2 h-4 w-4" />
                Verify Certificate
              </Button>
            </VerifyCertificateDialog>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
