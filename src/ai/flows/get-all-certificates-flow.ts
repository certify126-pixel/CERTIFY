
'use server';

/**
 * @fileOverview A flow for fetching all certificates.
 *
 * - getAllCertificates - Fetches all certificates from the in-memory store.
 * - GetAllCertificatesOutput - The return type for the getAllCertificates function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { certificates, type CertificateDocument } from './in-memory-db';

const GetAllCertificatesOutputSchema = z.array(z.custom<CertificateDocument>());
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
    // Return a serializable copy of the certificates array
    return certificates.map(cert => ({
        ...cert,
        _id: cert._id.toString(),
        // Convert Date object to a string to prevent serialization errors
        createdAt: cert.createdAt.toISOString() as any, 
    }));
  }
);
