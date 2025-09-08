
"use client";

import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, FileCheck, Copy, Download, PartyPopper } from "lucide-react";
import Link from "next/link";
import { DialogFooter } from "./ui/dialog";
import { addCertificate, AddCertificateInput, AddCertificateOutput } from "@/ai/flows/add-certificate-flow";

type IssueCertificateFormProps = {
    onFinished: () => void;
};

export function IssueCertificateForm({ onFinished }: IssueCertificateFormProps) {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = React.useState(false);
  const [creationResult, setCreationResult] = React.useState<{ hash: string; name: string, certificateId: string } | null>(null);

  const resetForm = () => {
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

  const handleCreateCertificate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const certificateData: AddCertificateInput = {
        studentName: formData.get('studentName') as string,
        rollNumber: formData.get('rollNumber') as string,
        certificateId: formData.get('certificateId') as string,
        issueDate: formData.get('issueDate') as string,
        course: formData.get('course') as string,
        institution: formData.get('institution') as string,
    };
    
    setCreationResult(null);
    setIsCreating(true);
    
    try {
        const result: AddCertificateOutput = await addCertificate(certificateData);

        if (result.success && result.certificateHash) {
            toast({
                title: "Certificate Created",
                description: `Certificate for ${certificateData.studentName} has been successfully created and stored.`,
            });
            setCreationResult({ 
                hash: result.certificateHash, 
                name: result.certificate.studentName,
                certificateId: result.certificate.certificateId,
            });
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
    const form = document.getElementById('issue-certificate-form') as HTMLFormElement;
    if(form) form.reset();
    resetForm();
    onFinished();
  }

  if (creationResult) {
    return (
        <div className="pt-4">
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
            </Alert>
             <DialogFooter className="pt-4">
                <Button onClick={handleDone}>Done</Button>
            </DialogFooter>
        </div>
    )
  }


  return (
    <>
      <form onSubmit={handleCreateCertificate} id="issue-certificate-form" className="space-y-4 pt-4">
        <div className="space-y-2">
            <Label htmlFor="student-name">Student Name</Label>
            <Input id="student-name" name="studentName" placeholder="e.g., Jane Doe" required />
        </div>
         <div className="space-y-2">
            <Label htmlFor="roll-number">Roll Number</Label>
            <Input id="roll-number" name="rollNumber" placeholder="e.g., CS-12345" required />
        </div>
         <div className="space-y-2">
            <Label htmlFor="course-name">Course Name</Label>
            <Input id="course-name" name="course" placeholder="e.g., B.Tech in Computer Science" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="certificate-id">Certificate ID</Label>
            <Input id="certificate-id" name="certificateId" placeholder="e.g., JHU-12345-2024" required />
        </div>
         <div className="space-y-2">
            <Label htmlFor="issue-date">Issue Date</Label>
            <Input id="issue-date" name="issueDate" type="date" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input id="institution" name="institution" defaultValue="Jawaharlal Nehru University" required />
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
