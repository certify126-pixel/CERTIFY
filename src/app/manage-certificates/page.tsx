
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, FilePenLine, PlusCircle, Trash2, Eye } from "lucide-react";
import Link from "next/link";

const initialCertificates = [
  { id: "1", certificateId: "JHU-84321-2023", studentName: "Rohan Kumar", course: "B.Tech in Computer Science", issueDate: "2023-05-20", status: "Issued" },
  { id: "2", certificateId: "JHU-55432-2022", studentName: "Priya Sharma", course: "MBA", issueDate: "2022-06-15", status: "Issued" },
  { id: "3", certificateId: "JHU-19876-2023", studentName: "Amit Singh", course: "B.A. in History", issueDate: "2023-05-20", status: "Issued" },
  { id: "4", certificateId: "JHU-34567-2021", studentName: "Anjali Devi", course: "M.Sc in Physics", issueDate: "2021-07-22", status: "Revoked" },
  { id: "5", certificateId: "JHU-67890-2023", studentName: "Suresh Gupta", course: "B.Com", issueDate: "2023-05-20", status: "Issued" },
];

export default function ManageCertificatesPage() {
  return (
    <main className="flex-1 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline text-4xl flex items-center gap-3"><Database/> Manage Certificates</CardTitle>
                <CardDescription>
                    View, edit, or revoke certificates issued by your institution.
                </CardDescription>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4"/>
                Issue New Certificate
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {initialCertificates.map((cert) => (
                    <TableRow key={cert.id}>
                    <TableCell className="font-medium">{cert.certificateId}</TableCell>
                    <TableCell>{cert.studentName}</TableCell>
                    <TableCell>{cert.course}</TableCell>
                    <TableCell>{cert.issueDate}</TableCell>
                    <TableCell>
                        <Badge variant={cert.status === 'Issued' ? 'default' : 'destructive'} className={cert.status === 'Issued' ? 'bg-green-500/20 text-green-500' : ''}>
                        {cert.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                        <Link href={`/certificate/${cert.certificateId}`} passHref>
                           <Button variant="outline" size="icon" asChild>
                                <a>
                                    <Eye className="h-4 w-4"/>
                                    <span className="sr-only">View Certificate</span>
                                </a>
                            </Button>
                        </Link>
                        <Button variant="outline" size="icon">
                            <FilePenLine className="h-4 w-4"/>
                            <span className="sr-only">Edit</span>
                        </Button>
                         <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4"/>
                            <span className="sr-only">Revoke</span>
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </main>
  );
}
