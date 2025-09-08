
"use client";

import React from "react";
import { addCertificate } from "@/ai/flows/add-certificate-flow";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, FileCheck, CheckCircle2, Copy, Download, PartyPopper } from "lucide-react";
import Link from "next/link";
import { DialogFooter, DialogClose } from "./ui/dialog";

type IssueCertificateFormProps = {
    onFinished: () => void;
};

export function IssueCertificateForm({ onFinished }: IssueCertificateFormProps) {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = React.useState(false);
  const [studentName, setStudentName] = React.useState("");
  const [rollNumber, setRollNumber] = React.useState("");
  const [certificateId, setCertificateId] = React.useState("");
  const [issueDate, setIssueDate] = React.useState("");
  const [course, setCourse] = React.useState("");
  const [institution, setInstitution] = React.useState("Jawaharlal Nehru University"); // Hardcoded for now
  const [creationResult, setCreationResult] = React.useState<{ hash: string; name: string, certificateId: string } | null>(null);

  const resetForm = () => {
    setStudentName("");
    setRollNumber("");
    setCertificateId("");
    setIssueDate("");
    setCourse("");
    setCreationResult(null);
  }

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
            toast({
                title: "Certificate Created",
                description: `Certificate for ${studentName} has been successfully created and stored.`,
            });
            setCreationResult({ hash: result.certificateHash, name: studentName, certificateId });
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
  
  const handleDone = () => {
    resetForm();
    onFinished();
  }

  if (creationResult) {
    return (
        <Alert className="mt-4 bg-primary/5 border-primary/20">
            <PartyPopper className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-headline">Certificate Created for {creationResult.name}</AlertTitle>
            <AlertDescription className="mt-2 text-primary/80 space-y-3">
                <div>
                <p className="font-semibold text-xs">Generated Hash:</p>
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
                </div>
                <Button asChild className="w-full">
                    <Link href={`/certificate/${creationResult.certificateId}`} target="_blank">
                        <Download className="mr-2 h-4 w-4" />
                        View & Download Certificate
                    </Link>
                </Button>
            </AlertDescription>
            <DialogFooter className="pt-4">
                <Button onClick={handleDone}>Done</Button>
            </DialogFooter>
        </Alert>
    )
  }


  return (
    <>
      <form onSubmit={handleCreateCertificate} className="space-y-4 pt-4">
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
        <DialogFooter>
          <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCheck className="mr-2 h-4 w-4" />}
              {isCreating ? "Creating..." : "Create & Issue Certificate"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
