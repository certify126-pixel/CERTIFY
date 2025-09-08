'use server';

/**
 * @fileOverview A flow for fetching a single certificate by its unique ID.
 *
 * - getCertificateById - A function that fetches a certificate by its ID.
 * - GetCertificateByIdInput - The input type for the getCertificateById function.
 * - GetCertificateByIdOutput - The return type for the getCertificateById function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// In-memory store for certificates - assuming it's populated elsewhere for this example.
const certificates: CertificateDocument[] = [
    {
        _id: '1',
        studentName: 'Rohan Kumar',
        rollNumber: 'CS-123',
        certificateId: 'JHU-84321-2023',
        issueDate: '2023-05-20',
        course: 'B.Tech in Computer Science',
        institution: 'Jawaharlal Nehru University',
        certificateHash: 'hash123',
        status: 'Issued',
        createdAt: new Date().toISOString(),
    }
];


const GetCertificateByIdInputSchema = z.object({
  certificateId: z.string().describe("The unique ID of the certificate to fetch."),
});
export type GetCertificateByIdInput = z.infer<typeof GetCertificateByIdInputSchema>;

export interface CertificateDocument {
    _id: string;
    studentName: string;
    rollNumber: string;
    certificateId: string;
    issueDate: string;
    course: string;
    institution: string;
    certificateHash: string;
    status: string;
    createdAt: string;
}


const GetCertificateByIdOutputSchema = z.object({
  success: z.boolean().describe("Whether the certificate was found successfully."),
  message: z.string().describe("A message indicating the result of the operation."),
  certificate: z.any().optional().describe("The certificate data if found."),
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
      const certificateRecord = certificates.find(c => c.certificateId === certificateId);

      if (certificateRecord) {
        return {
          success: true,
          message: 'Certificate found.',
          certificate: certificateRecord,
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
