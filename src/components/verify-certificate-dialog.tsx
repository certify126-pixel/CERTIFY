
"use client";

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
import { Loader2, CheckCircle, XCircle, FileCheck, Upload } from "lucide-react";
import React from "react";
import { verifyCertificate, VerifyCertificateOutput, VerifyCertificateInput } from "@/ai/flows/verify-certificate-flow";
import { verifyCertificateWithOcr } from "@/ai/flows/verify-certificate-with-ocr-flow";
import { createHash } from 'crypto';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";


type CertificateRecord = Omit<VerifyCertificateInput, 'certificateHash' | 'allCertificates'> & {id: string; status: string; studentName: string; course: string; institution: string;};


export type VerificationHistoryItem = VerifyCertificateOutput & {
    id: string;
    certificateId: string;
    timestamp: string;
};

type VerifyCertificateDialogProps = {
  children: React.ReactNode;
  onVerificationComplete?: (result: VerificationHistoryItem) => void;
  allCertificates?: CertificateRecord[];
};


export function VerifyCertificateDialog({ children, onVerificationComplete, allCertificates = [] }: VerifyCertificateDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [verificationResult, setVerificationResult] = React.useState<VerifyCertificateOutput | null>(null);

  const [rollNumber, setRollNumber] = React.useState("");
  const [certificateId, setCertificateId] = React.useState("");
  const [issueDate, setIssueDate] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [filePreview, setFilePreview] = React.useState<string | null>(null);


  const resetForm = () => {
    setRollNumber("");
    setCertificateId("");
    setIssueDate("");
    setVerificationResult(null);
    setFile(null);
    setFilePreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    }
  }


  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationResult(null);

    // Calculate hash from inputs
    const hash = createHash('sha256');
    hash.update(rollNumber + certificateId + issueDate);
    const certificateHash = hash.digest('hex');

    try {
        const result = await verifyCertificate({
            rollNumber,
            certificateId,
            issueDate,
            certificateHash,
            allCertificates,
        });
        setVerificationResult(result);
        if (onVerificationComplete) {
            onVerificationComplete({
                ...result,
                id: crypto.randomUUID(),
                certificateId: certificateId,
                timestamp: new Date().toISOString(),
            });
        }
    } catch(error) {
        toast({
            variant: "destructive",
            title: "Verification Error",
            description: "An unexpected error occurred while verifying the certificate.",
        });
    } finally {
        setIsVerifying(false);
    }
  };

  const handleSubmitOcr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filePreview) {
        toast({
            variant: "destructive",
            title: "No File Selected",
            description: "Please upload a certificate image to verify.",
        });
        return;
    }
    setIsVerifying(true);
    setVerificationResult(null);

    try {
        const result = await verifyCertificateWithOcr({
            photoDataUri: filePreview,
            allCertificates,
        });
        setVerificationResult(result);
        if (onVerificationComplete) {
            onVerificationComplete({
                ...result,
                id: crypto.randomUUID(),
                certificateId: result.certificateDetails?.studentName || "N/A", // Not ideal, but OCR doesn't give us one
                timestamp: new Date().toISOString(),
            });
        }
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

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            resetForm();
        }
    }}>
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
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="rollNumber" className="text-right">
                            Roll Number
                        </Label>
                        <Input id="rollNumber" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} placeholder="e.g., RNC-12345" className="col-span-3" required/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="certificateId" className="text-right">
                            Certificate ID
                        </Label>
                        <Input id="certificateId" value={certificateId} onChange={(e) => setCertificateId(e.target.value)} placeholder="e.g., JHU-84321-2023" className="col-span-3" required/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="issueDate" className="text-right">
                            Issue Date
                        </Label>
                        <Input id="issueDate" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="col-span-3" required/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isVerifying}>
                        {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isVerifying ? "Verifying..." : "Submit for Verification"}
                        </Button>
                    </DialogFooter>
                </form>
            </TabsContent>
            <TabsContent value="ocr">
                <form onSubmit={handleSubmitOcr}>
                    <div className="grid gap-4 py-6">
                        <Label htmlFor="certificate-file">Upload Certificate Image</Label>
                        <Input id="certificate-file" type="file" accept="image/*" onChange={handleFileChange} className="file:text-primary file:font-semibold"/>
                        {filePreview && (
                            <div className="p-2 border rounded-md">
                                <img src={filePreview} alt="Certificate Preview" className="max-h-48 w-full object-contain"/>
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
                {verificationResult.message}
                {verificationResult.certificateDetails && (
                    <div className="mt-2 text-xs space-y-1">
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
