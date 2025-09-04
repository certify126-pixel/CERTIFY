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
import { Loader2, CheckCircle, XCircle, FileCheck } from "lucide-react";
import React from "react";
import { verifyCertificate, VerifyCertificateOutput, VerifyCertificateInput } from "@/ai/flows/verify-certificate-flow";

type CertificateRecord = Omit<VerifyCertificateInput, 'certificateHash' | 'allCertificates'> & {id: string; status: string};

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
  const [certificateHash, setCertificateHash] = React.useState("");


  const resetForm = () => {
    setRollNumber("");
    setCertificateId("");
    setIssueDate("");
    setCertificateHash("");
    setVerificationResult(null);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationResult(null);

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
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl flex items-center gap-2"><FileCheck /> Verify Certificate</DialogTitle>
            <DialogDescription>
              Enter the certificate details and its unique hash to verify its authenticity.
            </DialogDescription>
          </DialogHeader>
          
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
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="certificateHash" className="text-right">
                Certificate Hash
              </Label>
              <Input id="certificateHash" value={certificateHash} onChange={(e) => setCertificateHash(e.target.value)} placeholder="SHA-256 Hash" className="col-span-3" required/>
            </div>
          </div>

          {verificationResult && (
            <Alert variant={verificationResult.verified ? "default" : "destructive"} className={`mb-4 ${verificationResult.verified ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
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


          <DialogFooter>
            <Button type="submit" disabled={isVerifying}>
              {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isVerifying ? "Verifying..." : "Submit for Verification"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
