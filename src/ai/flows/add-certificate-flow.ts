
'use server';

/**
 * @fileOverview A flow for adding new certificate data to the in-memory database.
 *
 * - addCertificate - A function that handles adding a new certificate.
 * - AddCertificateInput - The input type for the addCertificate function.
 * - AddCertificateOutput - The return type for the addCertificate function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
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
  firestoreId: z.string().describe("The ID of the document in the database."),
});
export type AddCertificateOutput = z.infer<typeof AddCertificateOutputSchema>;

export async function addCertificate(input: AddCertificateInput): Promise<AddCertificateOutput> {
  return addCertificateFlow(input);
}

const addCertificateFlow = ai.defineFlow(
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
          certificateHash,
          message: 'Certificate data has been successfully stored.',
          firestoreId: newCertificate._id,
        };
    } catch (error: any) {
        console.error("Error adding certificate:", error);
        throw new Error("Failed to store certificate data.");
    }
  }
);
