
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
import clientPromise from '@/lib/mongodb';
import { WithId } from 'mongodb';


const GetCertificateByIdInputSchema = z.object({
  certificateId: z.string().describe("The unique ID of the certificate to fetch."),
});
export type GetCertificateByIdInput = z.infer<typeof GetCertificateByIdInputSchema>;


// We can't easily send a Zod schema with a MongoDB `WithId<>` type over the wire,
// so we define it as a plain object for the output.
const CertificateSchema = z.object({
    _id: z.any(), // Will be ObjectId
    studentName: z.string(),
    rollNumber: z.string(),
    certificateId: z.string(),
    issueDate: z.string(),
    course: z.string(),
    institution: z.string(),
    certificateHash: z.string(),
    status: z.string(),
    createdAt: z.any(), // Will be Date
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
      const client = await clientPromise;
      const db = client.db();
      const certificatesCollection = db.collection('certificates');
      
      const certificateRecord = await certificatesCollection.findOne({ certificateId });

      if (certificateRecord) {
        // The _id is an ObjectId, which can't be directly serialized in Next.js server actions
        // by default. We convert it to a string.
        const serializableRecord = {
          ...certificateRecord,
          _id: certificateRecord._id.toString(),
          createdAt: certificateRecord.createdAt.toISOString(),
        };

        return {
          success: true,
          message: 'Certificate found.',
          certificate: serializableRecord,
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
