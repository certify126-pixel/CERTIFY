'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Input validation schema
const GetCertificateByIdInputSchema = z.object({
  certificateId: z.string()
    .min(1, "Certificate ID is required")
    .regex(/^\d+$/, "Certificate ID must contain only numbers"),
  rollNumber: z.string()
    .regex(/^[A-Z]{2,3}-\d+$/, "Invalid roll number format"),
  issueDate: z.string()
    .min(1, "Issue date is required")
});

// Output schema for better type safety
const GetCertificateByIdOutputSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  certificate: z.object({
    id: z.string(),
    certificateId: z.string(),
    studentName: z.string(),
    rollNumber: z.string(),
    issueDate: z.string(),
    certificateHash: z.string(),
    course: z.string(),
    institution: z.string()
  }).optional()
});

export type GetCertificateByIdInput = z.infer<typeof GetCertificateByIdInputSchema>;
export type GetCertificateByIdOutput = z.infer<typeof GetCertificateByIdOutputSchema>;

export async function getCertificateById(input: GetCertificateByIdInput): Promise<GetCertificateByIdOutput> {
  try {
    // Validate input
    const validatedInput = GetCertificateByIdInputSchema.parse(input);

    // Search for certificate
    const certificate = await prisma.certificate.findFirst({
      where: {
        AND: [
          { certificateId: validatedInput.certificateId },
          { rollNumber: validatedInput.rollNumber },
          { issueDate: new Date(validatedInput.issueDate) }
        ]
      }
    });

    if (!certificate) {
      return {
        success: false,
        message: `Certificate not found with ID: ${validatedInput.certificateId}`
      };
    }

    // Format dates for output
    const formattedCertificate = {
      ...certificate,
      issueDate: certificate.issueDate.toISOString().split('T')[0]
    };

    return {
      success: true,
      certificate: formattedCertificate
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: `Validation error: ${error.errors.map(e => e.message).join(', ')}`
      };
    }

    console.error('Error fetching certificate:', error);
    return {
      success: false,
      message: 'An error occurred while fetching the certificate'
    };
  }
}