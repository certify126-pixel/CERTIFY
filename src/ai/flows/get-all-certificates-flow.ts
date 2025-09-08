
'use server';

/**
 * @fileOverview A flow for fetching all certificates from the in-memory database.
 *
 * - getAllCertificates - Fetches all certificates.
 * - GetAllCertificatesOutput - The return type for the getAllCertificates function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/in-memory-db';

const GetAllCertificatesInputSchema = z.object({
    limitNum: z.number().optional().describe("The number of certificates to fetch."),
});
export type GetAllCertificatesInput = z.infer<typeof GetAllCertificatesInputSchema>;

// Base schema for a certificate, used for array output
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

const GetAllCertificatesOutputSchema = z.array(CertificateSchema);
export type GetAllCertificatesOutput = z.infer<typeof GetAllCertificatesOutputSchema>;

export async function getAllCertificates(input?: GetAllCertificatesInput): Promise<GetAllCertificatesOutput> {
    return getAllCertificatesFlow(input || {});
}

const getAllCertificatesFlow = ai.defineFlow(
  {
    name: 'getAllCertificatesFlow',
    inputSchema: GetAllCertificatesInputSchema,
    outputSchema: GetAllCertificatesOutputSchema,
  },
  async ({ limitNum = 10 }) => {
    try {
      const sortedCerts = [...db.certificates].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const certificates = sortedCerts.slice(0, limitNum);
      return certificates;

    } catch (error) {
      console.error("Error fetching all certificates:", error);
      return [];
    }
  }
);
