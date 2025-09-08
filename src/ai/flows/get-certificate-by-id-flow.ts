
'use server';

/**
 * @fileOverview A flow for fetching a single certificate by its unique ID from the in-memory database.
 *
 * - getCertificateById - A function that fetches a certificate by its ID.
 * - GetCertificateByIdInput - The input type for the getCertificateById function.
 * - GetCertificateByIdOutput - The return type for the getCertificateById function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/in-memory-db';

const GetCertificateByIdInputSchema = z.object({
  certificateId: z.string().describe("The unique ID of the certificate to fetch."),
});
export type GetCertificateByIdInput = z.infer<typeof GetCertificateByIdInputSchema>;

const CertificateSchema = z.object({
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
});

const GetCertificateByIdOutputSchema = z.object({
  success: z.boolean().describe("Whether the certificate was found successfully."),
  message: z.string().describe("A message indicating the result of the operation."),
  certificate: CertificateSchema.optional().describe("The certificate data if found."),
});
export type GetCertificateByIdOutput = z.infer<typeof GetCertificateByIdOutputSchema>;

export async function getCertificateById(input: GetCertificateByIdInput): Promise<GetCertificateByIdOutput> {
  return getCertificateByIdFlow(input);
}

const getCertificateByIdFlow = ai.defineFlow(
  {
    name: 'getCertificateByIdFlow',
    inputSchema: GetCertificateByIdInputSchema,
    outputSchema: GetCertificateByIdOutputSchema,
  },
  async ({ certificateId }) => {
    try {
      const certificate = db.certificates.find(c => c.certificateId === certificateId);

      if (certificate) {
        return {
          success: true,
          message: 'Certificate found.',
          certificate: certificate,
        };
      } else {
        return {
          success: false,
          message: 'Certificate with the specified ID was not found.',
        };
      }
    } catch (error: any) {
        console.error("Error fetching certificate by ID:", error);
        return {
            success: false,
            message: "An internal error occurred while fetching the certificate."
        }
    }
  }
);
