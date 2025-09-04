
"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileUp,
  Database,
  ScanEye,
  CheckCircle2,
  FileClock,
  FileCheck,
  User,
} from "lucide-react";

const issuedCertificates = [
  { id: "1", certificateId: "JHU-84321-2023", studentName: "Rohan Kumar", issueDate: "2023-05-20", status: "Issued" },
  { id: "2", certificateId: "JHU-55432-2022", studentName: "Priya Sharma", issueDate: "2022-06-15", status: "Issued" },
  { id: "3", certificateId: "JHU-19876-2023", studentName: "Amit Singh", issueDate: "2023-05-20", status: "Issued" },
  { id: "4", certificateId: "JHU-34567-2021", studentName: "Anjali Devi", issueDate: "2021-07-22", status: "Revoked" },
  { id: "5", certificateId: "JHU-67890-2023", studentName: "Suresh Gupta", issueDate: "2023-05-20", status: "Issued" },
];

export function InstitutionDashboard() {
  return (
    <main className="flex-1 p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Certificates Issued</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,480</div>
            <p className="text-xs text-muted-foreground">+201 since last year</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
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
                {issuedCertificates.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-medium">{cert.certificateId}</TableCell>
                    <TableCell>{cert.studentName}</TableCell>
                    <TableCell>{cert.issueDate}</TableCell>
                    <TableCell>
                      <Badge variant={cert.status === 'Issued' ? 'default' : 'destructive'} className={cert.status === 'Issued' ? 'bg-green-500/20 text-green-500' : ''}>
                        {cert.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Certificate Data</CardTitle>
              <CardDescription>Upload new or past certificate data in bulk using a CSV or Excel file.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data-upload">Select File</Label>
                <Input id="data-upload" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="file:text-primary file:font-semibold" />
              </div>
              <Button className="w-full">
                <FileUp className="mr-2 h-4 w-4" />
                Upload and Process
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Single Certificate</CardTitle>
              <CardDescription>Manually create a single new certificate record.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="student-name">Student Name</Label>
                    <Input id="student-name" placeholder="e.g., Jane Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="certificate-id">Certificate ID</Label>
                    <Input id="certificate-id" placeholder="e.g., JHU-12345-2024" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="issue-date">Issue Date</Label>
                    <Input id="issue-date" type="date" />
                </div>
              <Button className="w-full">
                <FileCheck className="mr-2 h-4 w-4" />
                Create Certificate
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
