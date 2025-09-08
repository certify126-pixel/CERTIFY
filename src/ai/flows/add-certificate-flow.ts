'use server';

/**
 * @fileOverview A flow for adding new certificate data to the in-memory database.
 *
 * - addCertificate - A function that handles adding a new certificate.
 * - AddCertificateInput - The input type for the addCertificate function.
 * - AddCertificateOutput - The return type for the addCertificate function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { createHash } from 'crypto';
import { db } from '@/lib/in-memory-db';

const AddCertificateInputSchema = z.object({
  studentName: z.string().describe("The full name of the student."),
  rollNumber: z.string().describe("The student's roll number or ID."),
  certificateId: z.string().describe("The unique ID of the certificate."),
  issueDate: z.string().describe("The date the certificate was issued (YYYY-MM-DD)."),
  course: z.string().describe("The course or degree obtained."),
  institution: z.string().describe("The name of the issuing institution."),
});
export type AddCertificateInput = z.infer<typeof AddCertificateInputSchema>;

const AddCertificateOutputSchema = z.object({
  success: z.boolean().describe("Whether the certificate was added successfully."),
  certificateHash: z.string().describe("The SHA-256 hash of the certificate data."),
  message: z.string().describe("A message indicating the result of the operation."),
  certificate: z.object({
    _id: z.string(),
    studentName: z.string(),
    rollNumber: z.string(),
    certificateId: z.string(),
    issueDate: z.string(),
    course: z.string(),
    institution: z.string(),
    certificateHash: z.string(),
    status: z.string(),
    createdAt: z.string(),
  })
});
export type AddCertificateOutput = z.infer<typeof AddCertificateOutputSchema>;

const certificateSchema = z.object({
  recipientName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
    
  certificateId: z.string()
    .regex(/^[A-Z0-9-]{8,}$/, 'Invalid certificate ID format'),
    
  issuerName: z.string()
    .min(2, 'Issuer name must be at least 2 characters')
    .max(50, 'Issuer name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Issuer name must contain only letters and spaces'),
    
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters')
    .regex(/^[a-zA-Z0-9\s.,!?-]+$/, 'Description contains invalid characters'),
    
  issueDate: z.date(),
  expiryDate: z.date().optional(),
  certificateType: z.enum(['academic', 'professional', 'achievement'])
});

export async function addCertificate(input: AddCertificateInput): Promise<AddCertificateOutput> {
  return addCertificateAiFlow(input);
}

const addCertificateAiFlow = ai.defineFlow(
  {
    name: 'addCertificateFlow',
    inputSchema: AddCertificateInputSchema,
    outputSchema: AddCertificateOutputSchema,
  },
  async (input) => {
    const { studentName, rollNumber, certificateId, issueDate, course, institution } = input;

    // Create a unique cryptographic hash for the certificate data.
    const hash = createHash('sha256');
    hash.update(rollNumber + certificateId + issueDate);
    const certificateHash = hash.digest('hex');

    const newCertificate = {
        _id: `cert_${Date.now()}`,
        studentName,
        rollNumber,
        certificateId,
        issueDate,
        course,
        institution,
        certificateHash,
        status: 'Issued',
        createdAt: new Date().toISOString(),
    };

    try {
        db.certificates.push(newCertificate);
        console.log(`Stored certificate for ${input.studentName}. ID: ${newCertificate._id}`);

        return {
          success: true,
          certificateHash: newCertificate.certificateHash,
          message: 'Certificate data has been successfully stored.',
          certificate: newCertificate,
        };
    } catch (error: any) {
        console.error("Error adding certificate:", error);
        throw new Error("Failed to store certificate data.");
    }
  }
);

export async function addCertificateFlow(data: unknown) {
  try {
    const validatedData = certificateSchema.parse(data);
    // Sanitize the data
    const sanitizedData = {
      ...validatedData,
      recipientName: validatedData.recipientName.trim(),
      issuerName: validatedData.issuerName.trim(),
      description: validatedData.description.trim()
    };
    
    return sanitizedData;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}
