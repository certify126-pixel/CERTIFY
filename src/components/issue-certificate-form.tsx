"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, FileCheck, Copy, Download, PartyPopper } from "lucide-react";
import Link from "next/link";
import { DialogFooter } from "./ui/dialog";
import { addCertificate } from "@/ai/flows/add-certificate-flow";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const certificateFormSchema = z.object({
  studentName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  rollNumber: z.string()
    .min(3, 'Roll number must be at least 3 digits')
    .max(10, 'Roll number cannot exceed 10 digits')
    .regex(/^\d+$/, 'Roll number must contain only numbers'),
  certificateId: z.string()
    .min(6, 'Certificate ID must be at least 6 digits')
    .regex(/^\d+$/, 'Certificate ID must contain only numbers'),
  course: z.string().min(1, 'Course is required'),
  issueDate: z.string()
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      return selectedDate <= today;
    }, "Issue date cannot be in the future"),
  institution: z.string().min(1, 'Institution is required')
});

type FormData = z.infer<typeof certificateFormSchema>;

type IssueCertificateFormProps = {
    onFinished: () => void;
};

export function IssueCertificateForm({ onFinished }: IssueCertificateFormProps) {
  const [isCreating, setIsCreating] = React.useState(false);
  const [creationResult, setCreationResult] = React.useState<{ hash: string; name: string, certificateId: string } | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: {
      studentName: '',
      rollNumber: '',
      certificateId: '',
      course: '',
      issueDate: new Date().toISOString().split('T')[0],
      institution: 'Jawaharlal Nehru University'
    }
  });

  const resetForm = () => {
    form.reset();
    setCreationResult(null);
  };

  const handleCopyHash = async () => {
    if (creationResult?.hash) {
      try {
        await navigator.clipboard.writeText(creationResult.hash);
        toast.success("Hash copied to clipboard");
      } catch (err) {
        toast.error("Failed to copy hash");
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    setCreationResult(null);
    setIsCreating(true);
    
    try {
      const result = await addCertificate(data);

      if (result.success && result.certificate) {
        toast.success("Certificate created", {
          description: `Certificate for ${result.certificate.studentName} has been successfully created and stored.`
        });
        setCreationResult({ 
          hash: result.certificate.certificateHash, 
          name: result.certificate.studentName,
          certificateId: result.certificate.certificateId
        });
      } else {
        throw new Error(result.message || 'Failed to create certificate');
      }
    } catch (error) {
      toast.error("Creation failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDone = () => {
    resetForm();
    onFinished();
  };

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
                        value={creationResult?.hash || ''} 
                        className="text-xs h-8 flex-1 font-mono"
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={handleCopyHash}
                          title="Copy hash to clipboard"
                        >
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="studentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Name</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  placeholder="e.g., Jane Doe"
                  onKeyPress={(e) => {
                    if (!/[a-zA-Z\s]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rollNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roll Number</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  placeholder="e.g., 12345"
                  onKeyPress={(e) => {
                    if (!/\d/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="course"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Name</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  placeholder="e.g., B.Tech in Computer Science"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="certificateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certificate ID</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  placeholder="e.g., JHU-12345-2024"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="issueDate"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Issue Date</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  type="date"
                  value={value || ''}
                  onChange={(e) => onChange(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  defaultValue="Jawaharlal Nehru University"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit" className="w-full" disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <FileCheck className="mr-2 h-4 w-4" />
                Create & Issue Certificate
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
