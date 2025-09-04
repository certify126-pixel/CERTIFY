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

const VerifyCertificateInputSchema = z.object({
  rollNumber: z.string().describe("The student's roll number or ID."),
  certificateId: z.string().describe("The unique ID of the certificate."),
  issueDate: z.string().describe("The date the certificate was issued (YYYY-MM-DD)."),
  certificateHash: z.string().describe("The SHA-256 hash of the certificate to verify."),
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

// This is a mock database of valid certificate hashes and their details.
// In a real application, this would be a query to a secure database like Firestore.
const MOCK_VALID_CERTIFICATES: Record<string, { studentName: string; course: string; institution: string; rollNumber: string; certificateId: string; issueDate: string }> = {
    "17a7615568875323425e407b48e2439b1a45e53003c9657c9636d36a8581691a": {
        studentName: "Rohan Kumar",
        course: "B.Tech in Computer Science",
        institution: "Jawaharlal Nehru University",
        rollNumber: "RNC-12345",
        certificateId: "JHU-84321-2023",
        issueDate: "2023-05-20"
    },
     "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855": { // Hash for empty strings
        studentName: "Test User",
        course: "Test Course",
        institution: "Test University",
        rollNumber: "",
        certificateId: "",
        issueDate: ""
    }
};


const verifyCertificateFlow = ai.defineFlow(
  {
    name: 'verifyCertificateFlow',
    inputSchema: VerifyCertificateInputSchema,
    outputSchema: VerifyCertificateOutputSchema,
  },
  async (input) => {
    const { certificateHash, rollNumber, certificateId, issueDate } = input;
    
    const certificateRecord = MOCK_VALID_CERTIFICATES[certificateHash];

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
