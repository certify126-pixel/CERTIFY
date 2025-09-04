
'use server';

/**
 * @fileOverview A flow for verifying an academic certificate using its cryptographic hash.
 *
 * - verifyCertificate - A function that handles the certificate verification process.
 * - VerifyCertificateInput - The input type for the verifyCertificate function.
 * - VerifyCertificateOutput - The return type for the verifyCertificate function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { createHash } from 'crypto';

const CertificateRecordSchema = z.object({
  id: z.string(),
  studentName: z.string(),
  course: z.string(),
  institution: z.string(),
  rollNumber: z.string(),
  certificateId: z.string(),
  issueDate: z.string(),
  status: z.string(),
});

const VerifyCertificateInputSchema = z.object({
  rollNumber: z.string().describe("The student's roll number or ID."),
  certificateId: z.string().describe("The unique ID of the certificate."),
  issueDate: z.string().describe("The date the certificate was issued (YYYY-MM-DD)."),
  certificateHash: z.string().describe("The SHA-256 hash of the certificate to verify."),
  allCertificates: z.array(CertificateRecordSchema).describe("The current list of all issued certificates to check against."),
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
    const { certificateHash, rollNumber, certificateId, issueDate, allCertificates } = input;
    
    // In a real app, `allCertificates` would be a database query.
    // Here, we're using the list passed from the client.
    const allCertificatesMap = allCertificates.reduce((acc, cert) => {
        const hash = createHash('sha256');
        hash.update(cert.rollNumber + cert.certificateId + cert.issueDate);
        acc[hash.digest('hex')] = cert;
        return acc;
    }, {} as Record<string, z.infer<typeof CertificateRecordSchema>>);
    
    const certificateRecord = allCertificatesMap[certificateHash];

    if (certificateRecord) {
      // The hash matches. Now, let's double-check the other details for an exact match.
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
      // The hash does not match any record.
      return {
        verified: false,
        message: 'Verification failed. The certificate hash is invalid or does not exist in our records.',
      };
    }
  }
);
