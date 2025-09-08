
'use server';

/**
 * @fileOverview A flow for deleting a certificate from Firestore.
 *
 * - deleteCertificate - A function that handles deleting a certificate by its Firestore document ID.
 * - DeleteCertificateInput - The input type for the deleteCertificate function.
 * - DeleteCertificateOutput - The return type for the deleteCertificate function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

const DeleteCertificateInputSchema = z.object({
  firestoreId: z.string().describe("The Firestore document ID of the certificate to delete."),
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
      const certificateRef = doc(db, "certificates", firestoreId);
      await deleteDoc(certificateRef);

      console.log(`Successfully deleted certificate with Firestore ID: ${firestoreId}`);
      return {
        success: true,
        message: 'Certificate has been successfully deleted.',
      };
    } catch (error: any) {
      console.error("Error deleting certificate from Firestore:", error);
      return {
        success: false,
        message: "Failed to delete certificate. Please try again.",
      }
    }
  }
);
