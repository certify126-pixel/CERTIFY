
"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { IssueCertificateForm } from './issue-certificate-form';

type IssueCertificateDialogProps = {
    onCertificateCreated: () => void;
};

export function IssueCertificateDialog({ onCertificateCreated }: IssueCertificateDialogProps) {
    const [open, setOpen] = React.useState(false);
    
    // This function will be called by the form when the process is fully complete.
    const handleClose = () => {
        onCertificateCreated(); // Refresh the list in the parent
        setOpen(false); // Close the dialog
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Issue New Certificate
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl flex items-center gap-2">Issue New Certificate</DialogTitle>
                    <DialogDescription>
                        Manually create and issue a single new certificate record. The record will be permanently stored on the blockchain.
                    </DialogDescription>
                </DialogHeader>
                <IssueCertificateForm onFinished={handleClose} />
            </DialogContent>
        </Dialog>
    );
}
