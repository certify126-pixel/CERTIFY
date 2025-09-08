
'use server';

/**
 * @fileOverview A flow for fetching all certificates.
 *
 * - getAllCertificates - Fetches all certificates from the in-memory store.
 * - GetAllCertificatesOutput - The return type for the getAllCertificates function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { certificates, CertificateDocumentSchema } from './in-memory-db';

const GetAllCertificatesOutputSchema = z.array(CertificateDocumentSchema);
export type GetAllCertificatesOutput = z.infer<typeof GetAllCertificatesOutputSchema>;

export async function getAllCertificates(): Promise<GetAllCertificatesOutput> {
    return getAllCertificatesFlow();
}

const getAllCertificatesFlow = ai.defineFlow(
  {
    name: 'getAllCertificatesFlow',
    inputSchema: z.undefined(),
    outputSchema: GetAllCertificatesOutputSchema,
  },
  async () => {
    // Return a serializable copy of the certificates array by converting Date objects to strings.
    return certificates.map(cert => ({
        ...cert,
        createdAt: cert.createdAt.toISOString(),
    }));
  }
);
