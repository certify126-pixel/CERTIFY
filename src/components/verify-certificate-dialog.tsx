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
import { Loader2 } from "lucide-react";
import React from "react";

export function VerifyCertificateDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
        setIsVerifying(false);
        setOpen(false);
        toast({
            title: "Verification Submitted",
            description: "The certificate is being processed. You will be notified of the result.",
        });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-headline">Verify Certificate</DialogTitle>
            <DialogDescription>
              Upload a certificate or manually enter the details below. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
                <Label htmlFor="file">Certificate File (PDF, JPG, PNG)</Label>
                <Input id="file" type="file" className="file:text-primary file:font-semibold" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="studentName" className="text-right">
                Student Name
              </Label>
              <Input id="studentName" placeholder="e.g., Rohan Kumar" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rollNumber" className="text-right">
                Roll Number
              </Label>
              <Input id="rollNumber" placeholder="e.g., RNC-12345" className="col-span-3" required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="certificateId" className="text-right">
                Certificate ID
              </Label>
              <Input id="certificateId" placeholder="e.g., JHU-84321-2023" className="col-span-3" required/>
            </div>
          </div>
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
