"use client";

import * as React from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Database,
  ScanEye,
  CheckCircle2,
  FileClock,
  FileCheck,
  Loader2,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { getAllCertificates, GetAllCertificatesOutput } from "@/ai/flows/get-all-certificates-flow";
import { VerifyCertificateDialog } from "./verify-certificate-dialog";
import { IssueCertificateDialog } from "./issue-certificate-dialog";
import { Toaster } from "sonner";
import { toast } from "sonner";

export function InstitutionDashboard() {
  const [issuedCertificates, setIssuedCertificates] = React.useState<GetAllCertificatesOutput>([]);
  const [isLoadingCerts, setIsLoadingCerts] = React.useState(true);

  const fetchCertificates = React.useCallback(async () => {
    setIsLoadingCerts(true);
    try {
      const certs = await getAllCertificates();
      setIssuedCertificates(certs);
    } catch (error) {
      toast.error("Failed to load certificates", {
        description: "Could not fetch the list of issued certificates.",
      });
    } finally {
      setIsLoadingCerts(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  return (
    <div>
      <main className="flex-1 p-6 space-y-6">
       <div className="flex items-center justify-end gap-4">
            <IssueCertificateDialog onCertificateCreated={fetchCertificates} />
            <VerifyCertificateDialog>
              <Button variant="outline">
                <FileCheck className="mr-2 h-4 w-4" />
                Verify Certificate
              </Button>
            </VerifyCertificateDialog>
        </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Certificates Issued</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{issuedCertificates.length}</div>
            <p className="text-xs text-muted-foreground">+{issuedCertificates.filter(c => new Date(c.createdAt).getFullYear() === new Date().getFullYear()).length} this year</p>
          </CardContent>
        </Card>
        <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
            <ScanEye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,310</div>
            <p className="text-xs text-muted-foreground">+180 in last 30 days</p>
          </CardContent>
        </Card>
        <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Verifications</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,295</div>
            <p className="text-xs text-muted-foreground">99.3% success rate</p>
          </CardContent>
        </Card>
        <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verification Failures</CardTitle>
            <FileClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Investigate potential issues</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recently Issued Certificates</CardTitle>
          <CardDescription>An overview of the latest certificates issued by your institution.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certificate ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingCerts ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></TableCell></TableRow>
              ) : issuedCertificates.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No certificates issued yet.</TableCell></TableRow>
              ) : (
                  issuedCertificates.slice(0, 5).map((cert) => (
                  <TableRow key={cert._id}>
                      <TableCell className="font-medium">{cert.certificateId}</TableCell>
                      <TableCell>{cert.studentName}</TableCell>
                      <TableCell>{cert.issueDate}</TableCell>
                      <TableCell>
                      <Badge variant={cert.status === 'Issued' ? 'default' : 'destructive'} className={cert.status === 'Issued' ? 'bg-green-500/20 text-green-500' : ''}>
                          {cert.status}
                      </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                         <Button asChild variant="outline" size="icon">
                          <Link href={`/certificate/${cert.certificateId}`} target="_blank">
                              <Eye className="h-4 w-4"/>
                              <span className="sr-only">View Certificate</span>
                          </Link>
                      </Button>
                      </TableCell>
                  </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Toaster />
    </main>
    </div>
  );
}
