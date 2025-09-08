"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, FileCheck, Upload, File as FileIcon } from "lucide-react";
import { verifyCertificate, VerifyCertificateOutput } from "@/ai/flows/verify-certificate-flow";
import { verifyCertificateWithOcr } from "@/ai/flows/verify-certificate-with-ocr-flow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getCertificateById } from "@/ai/flows/get-certificate-by-id-flow";


export type VerificationHistoryItem = VerifyCertificateOutput & {
    id: string;
    certificateId: string;
    timestamp: string;
};

type VerifyCertificateDialogProps = {
  children: React.ReactNode;
  onVerificationComplete?: (result: VerificationHistoryItem, details: Record<string, string>) => void;
};


export function VerifyCertificateDialog({ children, onVerificationComplete }: VerifyCertificateDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = React.useState<VerifyCertificateOutput | null>(null);

  const [rollNumber, setRollNumber] = React.useState("");
  const [certificateId, setCertificateId] = React.useState("");
  const [issueDate, setIssueDate] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [fileDataUri, setFileDataUri] = React.useState<string | null>(null);


  const resetForm = () => {
    setRollNumber("");
    setCertificateId("");
    setIssueDate("");
    setVerificationResult(null);
    setFile(null);
    setFileDataUri(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setFileDataUri(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    }
  }

  const handleVerificationResult = (result: VerifyCertificateOutput, submittedDetails: Record<string, string>) => {
     setVerificationResult(result);
        if (onVerificationComplete) {
            const historyItem: VerificationHistoryItem = {
                ...result,
                id: crypto.randomUUID(),
                certificateId: submittedDetails.certificateId || "N/A",
                timestamp: new Date().toISOString(),
            };
            onVerificationComplete(historyItem, submittedDetails);
        }
  }


  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!validateCertificateId(certificateId)) {
      toast.error("Invalid Certificate ID", {
        description: "Certificate ID must contain only numbers"
      });
      return;
    }

    if (!validateRollNumber(rollNumber)) {
      toast.error("Invalid Roll Number", {
        description: "Roll number format should be XX-12345 or XXX-12345"
      });
      return;
    }

    if (!issueDate) {
      toast.error("Issue Date Required", {
        description: "Please select the certificate issue date"
      });
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    const submittedDetails = { rollNumber, certificateId, issueDate };

    try {
      const result = await verifyCertificate(submittedDetails);
      handleVerificationResult(result, submittedDetails);
    } catch(error) {
      toast.error("Verification Error", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmitOcr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileDataUri) {
        toast({
            variant: "destructive",
            title: "No File Selected",
            description: "Please upload a certificate document to verify.",
        });
        return;
    }
    setIsVerifying(true);
    setVerificationResult(null);

    try {
        const result = await verifyCertificateWithOcr({
            photoDataUri: fileDataUri,
        });
        
        let submittedDetails = {
            certificateId: "From Document",
            rollNumber: "From Document",
            issueDate: "From Document",
        };
        
        handleVerificationResult(result, submittedDetails);

    } catch(error: any) {
        toast({
            variant: "destructive",
            title: "Verification Error",
            description: error.message || "An unexpected error occurred during OCR verification.",
        });
    } finally {
        setIsVerifying(false);
    }
  }

  const handleVerify = async () => {
    if (!certificateId) {
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "Please enter a certificate ID",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const certificate = await getCertificateById(certificateId);
      if (certificate) {
        toast.success("Certificate verified", {
          description: `Certificate for ${certificate.studentName} is valid.`
        });
      }
    } catch (error) {
      // Error is already handled in getCertificateById
    } finally {
      setIsVerifying(false);
    }
  };

  // Add input validation
  const validateCertificateId = (id: string) => /^\d+$/.test(id);
  const validateRollNumber = (roll: string) => /^[A-Z]{2,3}-\d+$/.test(roll);

  // Update the issue date input
  const issueDateInput = (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="issueDate" className="text-right">
        Issue Date
      </Label>
      <Input 
        id="issueDate" 
        type="date" 
        value={issueDate} 
        onChange={(e) => setIssueDate(e.target.value)}
        max={new Date().toISOString().split('T')[0]}
        className="col-span-3" 
        required
      />
    </div>
  );

  // Update the certificate ID input with validation
  const certificateIdInput = (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="certificateId" className="text-right">
        Certificate ID
      </Label>
      <Input 
        id="certificateId" 
        value={certificateId} 
        onChange={(e) => {
          const value = e.target.value;
          if (value === '' || /^\d+$/.test(value)) {
            setCertificateId(value);
          }
        }}
        placeholder="e.g., 123456789" 
        className="col-span-3" 
        required
      />
    </div>
  );

  // Update the roll number input with validation
  const rollNumberInput = (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="rollNumber" className="text-right">
        Roll Number
      </Label>
      <Input 
        id="rollNumber" 
        value={rollNumber} 
        onChange={(e) => {
          const value = e.target.value.toUpperCase();
          if (value === '' || /^[A-Z-\d]*$/.test(value)) {
            setRollNumber(value);
          }
        }}
        placeholder="e.g., JNU-12345" 
        className="col-span-3" 
        required
      />
    </div>
  );

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2"><FileCheck /> Verify Certificate</DialogTitle>
          <DialogDescription>
            Enter the certificate details manually or upload a document to verify its authenticity.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manual">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="ocr">Verify with Document</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
                <form onSubmit={handleSubmitManual}>
                    <div className="grid gap-4 py-6">
                        {rollNumberInput}
                        {certificateIdInput}
                        {issueDateInput}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isVerifying}>
                        {isVerifying ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Submit for Verification"
                        )}
                        </Button>
                    </DialogFooter>
                </form>
            </TabsContent>
            <TabsContent value="ocr">
                <form onSubmit={handleSubmitOcr}>
                    <div className="grid gap-4 py-6">
                        <Label htmlFor="certificate-file">Upload Document</Label>
                        <Input id="certificate-file" type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="file:text-primary file:font-semibold"/>
                        {file && (
                           <div className="flex items-center gap-3 p-2 border rounded-md text-sm text-muted-foreground">
                               <FileIcon className="h-5 w-5" />
                               <span className="truncate">{file.name}</span>
                           </div>
                        )}
                    </div>
                     <DialogFooter>
                        <Button type="submit" disabled={isVerifying || !file}>
                        {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isVerifying ? "Verifying..." : (<><Upload className="mr-2 h-4 w-4" /> Verify Document</>)}
                        </Button>
                    </DialogFooter>
                </form>
            </TabsContent>
        </Tabs>
        
        {verificationResult && (
            <Alert variant={verificationResult.verified ? "default" : "destructive"} className={`mt-4 ${verificationResult.verified ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              {verificationResult.verified ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle className={verificationResult.verified ? 'text-green-400' : 'text-red-400'}>
                {verificationResult.verified ? "Verification Successful" : "Verification Failed"}
              </AlertTitle>
              <AlertDescription className={verificationResult.verified ? 'text-green-400/80' : 'text-red-400/80'}>
                <p>{verificationResult.message}</p>
                {verificationResult.certificateDetails && (
                    <div className="mt-2 text-xs space-y-1 border-t border-current pt-2">
                        <p><strong>Student:</strong> {verificationResult.certificateDetails.studentName}</p>
                        <p><strong>Course:</strong> {verificationResult.certificateDetails.course}</p>
                        <p><strong>Institution:</strong> {verificationResult.certificateDetails.institution}</p>
                    </div>
                )}
              </AlertDescription>
            </Alert>
          )}
      </DialogContent>
    </Dialog>
  );
}
