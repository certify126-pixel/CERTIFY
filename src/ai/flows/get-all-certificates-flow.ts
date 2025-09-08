
'use server';

/**
 * @fileOverview A flow for fetching all certificates from Firestore.
 *
 * - getAllCertificates - Fetches all certificates from the Firestore collection.
 * - GetAllCertificatesOutput - The return type for the getAllCertificates function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp, limit, startAfter, DocumentData } from 'firebase/firestore';

const GetAllCertificatesInputSchema = z.object({
    limitNum: z.number().optional().describe("The number of certificates to fetch."),
    startAfterDoc: z.any().optional().describe("The last document snapshot to start after for pagination.")
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
  async ({ limitNum = 10, startAfterDoc }) => {
    try {
      const certificatesRef = collection(db, 'certificates');
      let q;

      if(startAfterDoc) {
          q = query(certificatesRef, orderBy('createdAt', 'desc'), startAfter(startAfterDoc), limit(limitNum));
      } else {
          q = query(certificatesRef, orderBy('createdAt', 'desc'), limit(limitNum));
      }
      
      const querySnapshot = await getDocs(q);

      const certificates = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          _id: doc.id,
          studentName: data.studentName,
          rollNumber: data.rollNumber,
          certificateId: data.certificateId,
          issueDate: data.issueDate,
          course: data.course,
          institution: data.institution,
          certificateHash: data.certificateHash,
          status: data.status,
          // Convert Firestore Timestamp to ISO string for serializability
          createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
        };
      });
      
      return certificates;

    } catch (error) {
      console.error("Error fetching all certificates:", error);
      // Return an empty array or throw an error, depending on desired error handling
      return [];
    }
  }
);
