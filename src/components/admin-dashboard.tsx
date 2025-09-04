
"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  FileClock,
  FileText,
  FileX2,
  ScanEye,
  Upload,
  User,
  XCircle,
  Loader2,
} from "lucide-react";
import { summarizeVerificationResults } from "@/ai/flows/summarize-verification-results";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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


export function AdminDashboard() {
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
    <main className="flex-1 p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
            <ScanEye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
         <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forgeries Detected</CardTitle>
            <FileX2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+12.1% from last month</p>
          </CardContent>
        </Card>
         <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Institutions Onboard</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">27</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>
         <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2">
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

        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Upload Data</CardTitle>
                    <CardDescription>Upload new or previous certificate data in bulk.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="data-upload">Upload CSV or Excel File</Label>
                        <Input id="data-upload" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="file:text-primary file:font-semibold" />
                    </div>
                     <Button className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload and Process File
                    </Button>
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
      </div>

    </main>
  );
}
