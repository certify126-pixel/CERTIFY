
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
  Loader2,
  Copy,
} from "lucide-react";
import { addCertificate } from "@/ai/flows/add-certificate-flow";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { VerifyCertificateDialog } from "./verify-certificate-dialog";

const initialCertificates = [
  { id: "1", certificateId: "JHU-84321-2023", studentName: "Rohan Kumar", course: "B.Tech in Computer Science", institution: "Jawaharlal Nehru University", rollNumber: "RNC-12345", issueDate: "2023-05-20", status: "Issued" },
  { id: "2", certificateId: "JHU-55432-2022", studentName: "Priya Sharma", course: "MBA", institution: "Jawaharlal Nehru University", rollNumber: "RNC-54321", issueDate: "2022-06-15", status: "Issued" },
  { id: "3", certificateId: "JHU-19876-2023", studentName: "Amit Singh", course: "B.A. in History", institution: "Jawaharlal Nehru University", rollNumber: "RNC-19876", issueDate: "2023-05-20", status: "Issued" },
  { id: "4", certificateId: "JHU-34567-2021", studentName: "Anjali Devi", course: "M.Sc in Physics", institution: "Jawaharlal Nehru University", rollNumber: "RNC-34567", issueDate: "2021-07-22", status: "Revoked" },
  { id: "5", certificateId: "JHU-67890-2023", studentName: "Suresh Gupta", course: "B.Com", institution: "Jawaharlal Nehru University", rollNumber: "RNC-67890", issueDate: "2023-05-20", status: "Issued" },
];


export function InstitutionDashboard() {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = React.useState(false);
  const [studentName, setStudentName] = React.useState("");
  const [rollNumber, setRollNumber] = React.useState("");
  const [certificateId, setCertificateId] = React.useState("");
  const [issueDate, setIssueDate] = React.useState("");
  const [course, setCourse] = React.useState("");
  const [institution, setInstitution] = React.useState("Jawaharlal Nehru University"); // Hardcoded for now
  const [creationResult, setCreationResult] = React.useState<{ hash: string; name: string } | null>(null);
  const [issuedCertificates, setIssuedCertificates] = React.useState(initialCertificates);

  const handleCopyHash = () => {
    if (creationResult) {
      navigator.clipboard.writeText(creationResult.hash);
      toast({
        title: "Copied to Clipboard",
        description: "The certificate hash has been copied.",
      });
    }
  };

  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreationResult(null);
    if (!studentName || !rollNumber || !certificateId || !issueDate || !course) {
        toast({
            variant: "destructive",
            title: "Missing Fields",
            description: "Please fill out all the fields to create a certificate.",
        });
        return;
    }
    setIsCreating(true);
    try {
        const result = await addCertificate({
            studentName,
            rollNumber,
            certificateId,
            issueDate,
            course,
            institution,
        });

        if (result.success) {
            const newCertificate = {
                id: (issuedCertificates.length + 1).toString(),
                studentName,
                rollNumber,
                certificateId,
                issueDate,
                course,
                institution,
                status: 'Issued'
            };
            setIssuedCertificates(prevCerts => [newCertificate, ...prevCerts]);

            toast({
                title: "Certificate Created",
                description: `Certificate for ${studentName} has been successfully created.`,
            });
            setCreationResult({ hash: result.certificateHash, name: studentName });
            // Clear form
            setStudentName("");
            setRollNumber("");
            setCertificateId("");
            setIssueDate("");
            setCourse("");

        } else {
            throw new Error(result.message);
        }
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Creation Failed",
            description: error.message || "An unexpected error occurred.",
        });
    } finally {
        setIsCreating(false);
    }
  };


  return (
    <main className="flex-1 p-6 space-y-6">
       <div className="flex items-center justify-end gap-4">
            <VerifyCertificateDialog allCertificates={issuedCertificates}>
              <Button>
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
            <CardContent>
                <form onSubmit={handleCreateCertificate} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="student-name">Student Name</Label>
                        <Input id="student-name" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="e.g., Jane Doe" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="roll-number">Roll Number</Label>
                        <Input id="roll-number" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} placeholder="e.g., CS-12345" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="course-name">Course Name</Label>
                        <Input id="course-name" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g., B.Tech in Computer Science" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="certificate-id">Certificate ID</Label>
                        <Input id="certificate-id" value={certificateId} onChange={(e) => setCertificateId(e.target.value)} placeholder="e.g., JHU-12345-2024" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="issue-date">Issue Date</Label>
                        <Input id="issue-date" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required />
                    </div>
                  <Button type="submit" className="w-full" disabled={isCreating}>
                    {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCheck className="mr-2 h-4 w-4" />}
                    {isCreating ? "Creating..." : "Create Certificate"}
                  </Button>
                </form>
                {creationResult && (
                  <Alert className="mt-4 bg-primary/5 border-primary/20">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <AlertTitle className="text-primary font-headline">Certificate Created for {creationResult.name}</AlertTitle>
                    <AlertDescription className="mt-2 text-primary/80">
                      <p className="font-semibold">Generated Hash:</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Input 
                          readOnly 
                          value={creationResult.hash} 
                          className="text-xs h-8 flex-1 truncate"
                        />
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleCopyHash}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
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
