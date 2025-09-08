'use server';

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const AddCertificateInputSchema = z.object({
  studentName: z.string()
    .min(2, "Student name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Student name must contain only letters and spaces"),
  rollNumber: z.string()
    .min(1, "Roll number is required")
    .regex(/^\d+$/, "Roll number must contain only numbers"),
  certificateId: z.string()
    .min(6, "Certificate ID must be at least 6 digits")
    .regex(/^\d+$/, "Certificate ID must contain only numbers"),
  course: z.string().min(1, "Course is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  institution: z.string().min(1, "Institution is required")
});

export type AddCertificateInput = z.infer<typeof AddCertificateInputSchema>;
export type AddCertificateOutput = {
  success: boolean;
  message?: string;
  certificate?: {
    id: string;
    certificateId: string;
    studentName: string;
    rollNumber: string;
    issueDate: string;
    certificateHash: string;
    course: string;
    institution: string;
  };
};

function generateCertificateHash(data: AddCertificateInput): string {
  const stringToHash = `${data.studentName}-${data.rollNumber}-${data.certificateId}-${data.course}-${data.issueDate}-${data.institution}`;
  return crypto.createHash('sha256').update(stringToHash).digest('hex');
}

export async function addCertificate(input: AddCertificateInput): Promise<AddCertificateOutput> {
  try {
    // Validate input
    const validatedData = AddCertificateInputSchema.parse(input);

    // Sanitize data
    const sanitizedData = {
      ...validatedData,
      studentName: validatedData.studentName.trim(),
      rollNumber: validatedData.rollNumber.trim().toUpperCase(),
      certificateId: validatedData.certificateId.trim()
    };

    // Generate certificate hash
    const certificateHash = generateCertificateHash(sanitizedData);

    // Check if certificate already exists
    const existingCertificate = await prisma.certificate.findFirst({
      where: {
        OR: [
          { certificateId: sanitizedData.certificateId },
          { certificateHash }
        ]
      }
    });

    if (existingCertificate) {
      return {
        success: false,
        message: "Certificate with this ID or details already exists"
      };
    }

    // Create new certificate
    const certificate = await prisma.certificate.create({
      data: {
        ...sanitizedData,
        certificateHash,
        issueDate: new Date(sanitizedData.issueDate)
      }
    });

    // Format the date for response
    const formattedCertificate = {
      ...certificate,
      issueDate: certificate.issueDate.toISOString().split('T')[0]
    };

    return {
      success: true,
      certificate: formattedCertificate
    };

  } catch (error) {
    console.error("Error creating certificate:", error);
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: `Validation error: ${error.errors.map(e => e.message).join(', ')}`
      };
    }

    // Handle Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Connection refused')) {
        return {
          success: false,
          message: "Database connection failed. Please ensure the database is running."
        };
      }
      if (error.message.includes('Unique constraint')) {
        return {
          success: false,
          message: "A certificate with this ID already exists."
        };
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create certificate"
    };
  }
}
