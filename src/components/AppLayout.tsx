
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
  History,
  LogIn,
  Eye,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CertiCheckLogo } from "@/components/icons";
import { useAuth, UserRole } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, role, logout, viewAsRole, setViewAsRole } = useAuth();
    const { toast } = useToast();
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        });
        router.push('/login');
    };
    
    // Hide sidebar for login/register pages
    if (pathname === '/login' || pathname === '/register') {
      return <>{children}</>;
    }

    const isAdmin = viewAsRole === 'Super Admin';
    const isInstitution = viewAsRole === 'Institution';

    const getDashboardTitle = () => {
      if (viewAsRole === 'Super Admin') return 'Admin Dashboard';
      if (viewAsRole === 'Institution') return 'Institution Dashboard';
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
                        <Link href="/institutions" passHref>
                            <SidebarMenuButton tooltip="Institutions" isActive={pathname === '/institutions'}>
                                <Building />
                                <span>Institutions</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                         <Link href="/upload-data" passHref>
                            <SidebarMenuButton tooltip="Upload Data" isActive={pathname === '/upload-data'}>
                                <Upload />
                                <span>Upload Data</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <Link href="/verifications" passHref>
                            <SidebarMenuButton tooltip="Verifications" isActive={pathname === '/verifications'}>
                                <ScanEye />
                                <span>Verifications</span>
                            </SidebarMenuButton>
                        </Link>
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
                        <Link href="/upload-data" passHref>
                            <SidebarMenuButton tooltip="Upload Data" isActive={pathname === '/upload-data'}>
                                <FileUp />
                                <span>Upload Data</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <Link href="/manage-certificates" passHref>
                            <SidebarMenuButton tooltip="Manage Certificates" isActive={pathname === '/manage-certificates'}>
                                <Database />
                                <span>Manage Certificates</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <Link href="/verification-history" passHref>
                            <SidebarMenuButton tooltip="Verification History" isActive={pathname === '/verification-history'}>
                                <History />
                                <span>Verification History</span>
                            </SidebarMenuButton>
                        </Link>
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
              {user ? (
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                        <LogOut />
                        <span>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                 <SidebarMenuItem>
                    <Link href="/login" passHref>
                      <SidebarMenuButton tooltip="Login">
                          <LogIn />
                          <span>Login</span>
                      </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          {user && (
            <div className="flex items-center gap-3 p-3 border-t border-sidebar-border/50">
               <Avatar className="h-10 w-10 border-2 border-primary-foreground/50">
                <AvatarImage src="https://picsum.photos/100/100" data-ai-hint="person" alt={role || ''} />
                <AvatarFallback>{role === 'Super Admin' ? 'SA' : role === 'Institution' ? 'IN' : 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-sidebar-foreground truncate">{user.email}</span>
                <span className="text-xs text-sidebar-foreground/70">{role}</span>
              </div>
            </div>
          )}
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
            {role === 'Super Admin' && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Eye className="mr-2"/>
                            View as: {viewAsRole}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Switch Dashboard View</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                         <DropdownMenuRadioGroup value={viewAsRole || ''} onValueChange={(val) => setViewAsRole(val as UserRole)}>
                            <DropdownMenuRadioItem value="Super Admin">Super Admin</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Institution">Institution</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="User">User</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
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
