
'use server';

/**
 * @fileOverview A flow for verifying an academic certificate using its cryptographic hash against the in-memory database.
 *
 * - verifyCertificate - A function that handles the certificate verification process.
 * - VerifyCertificateInput - The input type for the verifyCertificate function.
 * - VerifyCertificateOutput - The return type for the verifyCertificate function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { createHash } from 'crypto';
import { db } from '@/lib/in-memory-db';


const VerifyCertificateInputSchema = z.object({
  rollNumber: z.string().describe("The student's roll number or ID."),
  certificateId: z.string().describe("The unique ID of the certificate."),
  issueDate: z.string().describe("The date the certificate was issued (YYYY-MM-DD)."),
});
export type VerifyCertificateInput = z.infer<typeof VerifyCertificateInputSchema>;

const VerifyCertificateOutputSchema = z.object({
  verified: z.boolean().describe("Whether the certificate hash is valid."),
  message: z.string().describe("A message indicating the result of the verification."),
  certificateDetails: z.object({
      studentName: z.string(),
      course: z.string(),
      institution: z.string(),
  }).optional(),
});
export type VerifyCertificateOutput = z.infer<typeof VerifyCertificateOutputSchema>;


export async function verifyCertificate(input: VerifyCertificateInput): Promise<VerifyCertificateOutput> {
  return verifyCertificateFlow(input);
}

const verifyCertificateFlow = ai.defineFlow(
  {
    name: 'verifyCertificateFlow',
    inputSchema: VerifyCertificateInputSchema,
    outputSchema: VerifyCertificateOutputSchema,
  },
  async (input) => {
    const { rollNumber, certificateId, issueDate } = input;
    
    const hash = createHash('sha256');
    hash.update(rollNumber + certificateId + issueDate);
    const certificateHash = hash.digest('hex');

    const certificateRecord = db.certificates.find(c => c.certificateHash === certificateHash);

    if (certificateRecord) {
      if (
        certificateRecord.rollNumber === rollNumber &&
        certificateRecord.certificateId === certificateId &&
        certificateRecord.issueDate === issueDate
      ) {
        return {
          verified: true,
          message: 'Certificate has been successfully verified.',
          certificateDetails: {
            studentName: certificateRecord.studentName,
            course: certificateRecord.course,
            institution: certificateRecord.institution,
          }
        };
      } else {
        return {
          verified: false,
          message: 'Verification failed. The hash is valid, but the certificate details (roll number, ID, or issue date) do not match our records.',
        };
      }
    } else {
      return {
        verified: false,
        message: 'Verification failed. The certificate hash is invalid or does not exist in our records.',
      };
    }
  }
);
