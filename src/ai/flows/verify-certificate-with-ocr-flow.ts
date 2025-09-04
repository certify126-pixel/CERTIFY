'use server';
/**
 * @fileOverview A flow for verifying an academic certificate by extracting details from an image using OCR.
 *
 * - verifyCertificateWithOcr - A function that handles the OCR and verification process.
 * - VerifyCertificateWithOcrInput - The input type for the verifyCertificateWithOcr function.
 * - VerifyCertificateWithOcrOutput - The return type for the verifyCertificateWithOcr function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { createHash } from 'crypto';
import { verifyCertificate, VerifyCertificateInput } from './verify-certificate-flow';

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

const VerifyCertificateWithOcrInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a certificate, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  allCertificates: z.array(CertificateRecordSchema).describe("The current list of all issued certificates to check against."),
});
export type VerifyCertificateWithOcrInput = z.infer<typeof VerifyCertificateWithOcrInputSchema>;

const ExtractedCertificateDetailsSchema = z.object({
    rollNumber: z.string().describe("The student's roll number or ID extracted from the document."),
    certificateId: z.string().describe("The unique ID of the certificate extracted from the document."),
    issueDate: z.string().describe("The date the certificate was issued (YYYY-MM-DD) extracted from the document."),
});

export type VerifyCertificateWithOcrOutput = z.infer<typeof CertificateRecordSchema>;

export async function verifyCertificateWithOcr(input: VerifyCertificateWithOcrInput) {
  return verifyCertificateWithOcrFlow(input);
}


const ocrPrompt = ai.definePrompt({
    name: 'ocrCertificatePrompt',
    input: { schema: z.object({ photoDataUri: z.string() }) },
    output: { schema: ExtractedCertificateDetailsSchema },
    prompt: `You are an expert at extracting information from academic certificates. 
    
    Analyze the following certificate image and extract the following fields:
    - Roll Number (look for labels like "Roll No.", "Student ID", "Roll Number")
    - Certificate ID (look for a unique identifier, often labeled "Certificate No.", "Serial No.", or "ID")
    - Issue Date (find the date of issuance and format it as YYYY-MM-DD)

    Here is the certificate image:
    {{media url=photoDataUri}}
    `,
});


const verifyCertificateWithOcrFlow = ai.defineFlow(
  {
    name: 'verifyCertificateWithOcrFlow',
    inputSchema: VerifyCertificateWithOcrInputSchema,
    outputSchema: z.any(),
  },
  async (input) => {
    const { photoDataUri, allCertificates } = input;

    // Step 1: Extract details from the image using the OCR prompt
    const { output: extractedDetails } = await ocrPrompt({ photoDataUri });

    if (!extractedDetails) {
        throw new Error('Failed to extract details from the certificate image.');
    }
    
    const { rollNumber, certificateId, issueDate } = extractedDetails;

    // Step 2: Calculate the hash from the extracted details
    const hash = createHash('sha256');
    hash.update(rollNumber + certificateId + issueDate);
    const certificateHash = hash.digest('hex');

    // Step 3: Call the original verification flow with the extracted details
    const verificationInput: VerifyCertificateInput = {
        rollNumber,
        certificateId,
        issueDate,
        certificateHash,
        allCertificates,
    };
    
    return await verifyCertificate(verificationInput);
  }
);
