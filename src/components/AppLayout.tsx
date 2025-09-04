
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
  Twitter,
  Linkedin,
  Github,
  Upload,
  Users,
  School,
  FileUp,
  Database,
} from "lucide-react";
import { CertiCheckLogo } from "@/components/icons";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, role, setRole } = useAuth();
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
    
    const handleRoleSwitch = () => {
        let newRole: 'User' | 'Super Admin' | 'Institution';
        if (role === 'User') {
          newRole = 'Super Admin';
        } else if (role === 'Super Admin') {
          newRole = 'Institution';
        } else {
          newRole = 'User';
        }
        setRole(newRole);
        toast({
            title: "Switched Role",
            description: `You are now viewing the dashboard as a ${newRole}.`,
        });
    };

    const isAdmin = role === 'Super Admin';
    const isInstitution = role === 'Institution';

    const getNextRole = () => {
      if (role === 'User') return 'Admin';
      if (role === 'Super Admin') return 'Institution';
      return 'User';
    }

    const getDashboardTitle = () => {
      if (isAdmin) return 'Admin Dashboard';
      if (isInstitution) return 'Institution Dashboard';
      return 'User Dashboard';
    }

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r border-sidebar-border/50">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <CertiCheckLogo className="w-8 h-8 text-primary" />
            <h1 className="font-headline text-lg font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              Q Certify
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
            {isAdmin && (
                <>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Institutions">
                            <Building />
                            <span>Institutions</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Upload Data">
                            <Upload />
                            <span>Upload Data</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Verifications">
                            <ScanEye />
                            <span>Verifications</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <Link href="/blacklist" passHref>
                            <SidebarMenuButton tooltip="Blacklist" isActive={pathname === '/blacklist'}>
                                <ShieldX />
                                <span>Blacklist</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                </>
            )}
            {isInstitution && (
                <>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Upload Data">
                            <FileUp />
                            <span>Upload Data</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Manage Certificates">
                            <Database />
                            <span>Manage Certificates</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Verification History">
                            <ScanEye />
                            <span>Verification History</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </>
            )}
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
              <AvatarImage src="https://picsum.photos/100/100" data-ai-hint="person" alt={role} />
              <AvatarFallback>{role === 'Super Admin' ? 'SA' : role === 'Institution' ? 'IN' : 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-semibold text-sidebar-foreground truncate">{user?.email}</span>
              <span className="text-xs text-sidebar-foreground/70">{role}</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <h1 className="font-headline text-2xl font-bold text-foreground">
              {getDashboardTitle()}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="outline" onClick={handleRoleSwitch}>
                <Users className="mr-2 h-4 w-4" />
                Switch to {getNextRole()}
            </Button>
          </div>
        </header>
        {children}
         <footer className="p-6 mt-auto bg-card border-t">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Q Certify. All Rights Reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link href="#" passHref>
                <Button variant="ghost" size="icon" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#" passHref>
                <Button variant="ghost" size="icon" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#" passHref>
                <Button variant="ghost" size="icon" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
