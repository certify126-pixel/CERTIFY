"use client";

import * as React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bot,
  Building,
  CheckCircle2,
  FileCheck,
  FileClock,
  FileX2,
  LayoutDashboard,
  Loader2,
  ScanEye,
  ShieldX,
  User,
  XCircle,
} from "lucide-react";
import { CertiCheckLogo } from "@/components/icons";
import { VerifyCertificateDialog } from "@/components/verify-certificate-dialog";
import { summarizeVerificationResults } from "@/ai/flows/summarize-verification-results";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type VerificationLog = {
  id: string;
  certificateId: string;
  studentName: string;
  status: "Verified" | "Potential Forgery" | "Record Not Found";
  date: string;
  verifier: string;
};

const verificationLogs: VerificationLog[] = [
  { id: "1", certificateId: "JHU-84321-2023", studentName: "Rohan Kumar", status: "Verified", date: "2024-07-20", verifier: "Tata Steel" },
  { id: "2", certificateId: "BIT-55432-2022", studentName: "Priya Sharma", status: "Verified", date: "2024-07-19", verifier: "Infosys" },
  { id: "3", certificateId: "RNC-19876-2023", studentName: "Amit Singh", status: "Potential Forgery", date: "2024-07-19", verifier: "Wipro" },
  { id: "4", certificateId: "XIS-34567-2021", studentName: "Anjali Devi", status: "Verified", date: "2024-07-18", verifier: "Deloitte" },
  { id: "5", certificateId: "CJU-67890-2023", studentName: "Suresh Gupta", status: "Record Not Found", date: "2024-07-17", verifier: "TCS" },
  { id: "6", certificateId: "JHU-98765-2022", studentName: "Meena Kumari", status: "Verified", date: "2024-07-16", verifier: "HCL" },
  { id: "7", certificateId: "BIT-12345-2023", studentName: "Fake Name", status: "Potential Forgery", date: "2024-07-15", verifier: "Cognizant" },
];

const StatusBadge = ({ status }: { status: VerificationLog["status"] }) => {
  const variants = {
    "Verified": {
      variant: "default",
      className: "bg-green-500/20 text-green-500 border-green-500/30",
      icon: <CheckCircle2 className="mr-1 h-3 w-3" />,
    },
    "Potential Forgery": {
      variant: "destructive",
      className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      icon: <FileClock className="mr-1 h-3 w-3" />,
    },
    "Record Not Found": {
      variant: "secondary",
      className: "bg-red-500/20 text-red-500 border-red-500/30",
      icon: <XCircle className="mr-1 h-3 w-3" />,
    },
  };
  const { variant, className, icon } = variants[status];
  return (
    <Badge variant={variant as any} className={cn("capitalize flex items-center w-fit", className)}>
      {icon}
      {status}
    </Badge>
  );
};


export function Dashboard() {
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isGenerating, startTransition] = React.useTransition();

  const handleGenerateSummary = async () => {
    startTransition(async () => {
      setSummary(null);
      const result = await summarizeVerificationResults({ verificationLogs: JSON.stringify(verificationLogs) });
      if (result) {
        setSummary(result.summary);
      }
    });
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
              <SidebarMenuButton isActive tooltip="Dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
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
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-3">
             <Avatar className="h-10 w-10 border-2 border-primary-foreground/50">
              <AvatarImage src="https://picsum.photos/100/100" data-ai-hint="person" alt="Admin" />
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-semibold text-sidebar-foreground">Super Admin</span>
              <span className="text-xs text-sidebar-foreground/70">admin@jh.gov.in</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <h1 className="font-headline text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
          </div>
          <VerifyCertificateDialog>
            <Button>
              <FileCheck className="mr-2 h-4 w-4" />
              Verify Certificate
            </Button>
          </VerifyCertificateDialog>
        </header>

        <main className="flex-1 p-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
                <ScanEye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+5.2% from last month</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Forgeries Detected</CardTitle>
                <FileX2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+12.1% from last month</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Institutions Onboard</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">27</div>
                <p className="text-xs text-muted-foreground">+2 since last month</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Verifiers</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">152</div>
                <p className="text-xs text-muted-foreground">Active this week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Verification Logs</CardTitle>
                <CardDescription>An overview of the latest certificate verification attempts.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Certificate ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Verifier</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verificationLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.certificateId}</TableCell>
                        <TableCell>{log.studentName}</TableCell>
                        <TableCell><StatusBadge status={log.status} /></TableCell>
                        <TableCell>{log.date}</TableCell>
                        <TableCell>{log.verifier}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fraud Analysis</CardTitle>
                <CardDescription>AI-powered summary of verification logs to identify trends and potential fraud.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleGenerateSummary} disabled={isGenerating} className="w-full">
                  {isGenerating ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</>
                  ) : (
                    <><Bot className="mr-2 h-4 w-4" /> Generate Fraud Report</>
                  )}
                </Button>

                {isGenerating && (
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                )}
                
                {summary && (
                  <Alert className="bg-primary/5 border-primary/20">
                    <Bot className="h-4 w-4 text-primary" />
                    <AlertTitle className="text-primary font-headline">AI Summary</AlertTitle>
                    <AlertDescription className="text-primary/80 whitespace-pre-wrap">
                      {summary}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

// cn function for combining classnames
function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("animate-pulse rounded-md bg-muted/50", className)} {...props} />
);
