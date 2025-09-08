"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { addCertificate } from "@/ai/flows/add-certificate-flow";

const formSchema = z.object({
  studentName: z.string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed"),
  rollNumber: z.string()
    .min(1, "Roll number is required")
    .regex(/^\d+$/, "Roll number must contain only numbers"),
  certificateId: z.string()
    .min(6, "Certificate ID must be at least 6 digits")
    .regex(/^\d+$/, "Only numbers allowed"),
  course: z.string().min(1, "Course is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  institution: z.string().min(1, "Institution is required")
});

type FormValues = z.infer<typeof formSchema>;

type IssueCertificateDialogProps = {
    onCertificateCreated: () => void;
};

export function IssueCertificateDialog({ onCertificateCreated }: IssueCertificateDialogProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        studentName: "",
        rollNumber: "",
        certificateId: "",
        course: "",
        issueDate: new Date().toISOString().split('T')[0],
        institution: "Jawaharlal Nehru University"
      }
    });

    const onSubmit = async (data: FormValues) => {
      setIsSubmitting(true);
      try {
        const result = await addCertificate({
          studentName: data.studentName,
          rollNumber: data.rollNumber,
          certificateId: data.certificateId,
          course: data.course,
          issueDate: data.issueDate,
          institution: data.institution || "Jawaharlal Nehru University"
        });

        if (result.success && result.certificate) {
          toast.success("Certificate Created", {
            description: `Certificate for ${result.certificate.studentName} has been created with hash: ${result.certificate.certificateHash}`
          });
          setOpen(false);
          form.reset();
          if (onCertificateCreated) {
            onCertificateCreated();
          }
        } else {
          throw new Error(result.message || "Failed to create certificate");
        }
      } catch (error) {
        toast.error("Creation Failed", {
          description: error instanceof Error ? error.message : "An unexpected error occurred"
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleClose = () => {
        onCertificateCreated();
        setOpen(false);
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
                    <DialogTitle className="font-headline text-2xl flex items-center gap-2">
                      Issue New Certificate
                    </DialogTitle>
                    <DialogDescription>
                        Manually create and issue a single new certificate record. The record will be permanently stored on the blockchain.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="studentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isSubmitting}
                              placeholder="Enter student name"
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
                              type="text"
                              placeholder="Enter roll number (numbers only)"
                              disabled={isSubmitting}
                              onKeyPress={(e) => {
                                // Allow only numbers
                                if (!/\d/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Only update if the value contains only numbers or is empty
                                if (value === '' || /^\d+$/.test(value)) {
                                  field.onChange(value);
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
                      name="certificateId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certificate ID</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isSubmitting}
                              placeholder="Enter certificate ID"
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
                          <FormLabel>Course</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isSubmitting}
                              placeholder="Enter course name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="issueDate"
                      render={({ field: { onChange, value, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Issue Date</FormLabel>
                          <FormControl>
                            <Input
                              {...fieldProps}
                              type="date"
                              value={value || ''}
                              onChange={onChange}
                              max={new Date().toISOString().split('T')[0]}
                              disabled={isSubmitting}
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
                              disabled={isSubmitting}
                              placeholder="Enter institution name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Issuing...
                        </>
                      ) : (
                        'Submit'
                      )}
                    </Button>
                  </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
