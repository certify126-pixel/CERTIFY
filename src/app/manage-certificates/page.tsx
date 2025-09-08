
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, FilePenLine, PlusCircle, Trash2, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { getAllCertificates, GetAllCertificatesOutput } from "@/ai/flows/get-all-certificates-flow";
import { deleteCertificate } from "@/ai/flows/delete-certificate-flow";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ManageCertificatesPage() {
  const [certificates, setCertificates] = useState<GetAllCertificatesOutput>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCertificates = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedCertificates = await getAllCertificates();
      setCertificates(fetchedCertificates);
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch certificates.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleDelete = async (firestoreId: string) => {
    setIsDeleting(firestoreId);
    try {
      const result = await deleteCertificate({ firestoreId });
      if (result.success) {
        toast({
          title: "Success",
          description: "Certificate has been revoked.",
        });
        // Refresh the list after deletion
        setCertificates(certs => certs.filter(c => c._id !== firestoreId));
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not revoke certificate.",
      });
    } finally {
      setIsDeleting(null);
    }
  };

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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : certificates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No certificates have been issued yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  certificates.map((cert) => (
                    <TableRow key={cert._id}>
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
                        <Button asChild variant="outline" size="icon">
                            <Link href={`/certificate/${cert.certificateId}`}>
                                <Eye className="h-4 w-4"/>
                                <span className="sr-only">View Certificate</span>
                            </Link>
                        </Button>
                        <Button variant="outline" size="icon" disabled>
                            <FilePenLine className="h-4 w-4"/>
                            <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" disabled={isDeleting === cert._id}>
                              {isDeleting === cert._id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4"/>}
                              <span className="sr-only">Revoke</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure you want to revoke this certificate?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the certificate
                                record from the database.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(cert._id)} className="bg-destructive hover:bg-destructive/90">
                                Yes, Revoke Certificate
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                    </TableCell>
                    </TableRow>
                  ))
                )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </main>
  );
}
