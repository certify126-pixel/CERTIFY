
'use server';

/**
 * @fileOverview A flow for deleting a certificate from the in-memory database.
 *
 * - deleteCertificate - A function that handles deleting a certificate by its ID.
 * - DeleteCertificateInput - The input type for the deleteCertificate function.
 * - DeleteCertificateOutput - The return type for the deleteCertificate function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/in-memory-db';

const DeleteCertificateInputSchema = z.object({
  firestoreId: z.string().describe("The document ID of the certificate to delete."),
});
export type DeleteCertificateInput = z.infer<typeof DeleteCertificateInputSchema>;

const DeleteCertificateOutputSchema = z.object({
  success: z.boolean().describe("Whether the certificate was deleted successfully."),
  message: z.string().describe("A message indicating the result of the operation."),
});
export type DeleteCertificateOutput = z.infer<typeof DeleteCertificateOutputSchema>;

export async function deleteCertificate(input: DeleteCertificateInput): Promise<DeleteCertificateOutput> {
  return deleteCertificateFlow(input);
}

const deleteCertificateFlow = ai.defineFlow(
  {
    name: 'deleteCertificateFlow',
    inputSchema: DeleteCertificateInputSchema,
    outputSchema: DeleteCertificateOutputSchema,
  },
  async ({ firestoreId }) => {
    try {
      const initialLength = db.certificates.length;
      db.certificates = db.certificates.filter(c => c._id !== firestoreId);

      if (db.certificates.length < initialLength) {
        console.log(`Successfully deleted certificate with ID: ${firestoreId}`);
        return {
          success: true,
          message: 'Certificate has been successfully deleted.',
        };
      } else {
        throw new Error("Certificate not found.");
      }
    } catch (error: any) {
      console.error("Error deleting certificate:", error);
      return {
        success: false,
        message: "Failed to delete certificate. Please try again.",
      }
    }
  }
);
