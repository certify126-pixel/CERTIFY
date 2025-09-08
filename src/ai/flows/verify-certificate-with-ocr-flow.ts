
'use server';
/**
 * @fileOverview A flow for verifying an academic certificate by extracting its hash from an image using OCR.
 *
 * - verifyCertificateWithOcr - A function that handles the OCR and verification process.
 * - VerifyCertificateWithOcrInput - The input type for the verifyCertificateWithOcr function.
 * - VerifyCertificateOutput - The return type for the verifyCertificateWithOcr function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/in-memory-db';
import { type VerifyCertificateOutput } from './verify-certificate-flow';


const VerifyCertificateWithOcrInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a certificate, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type VerifyCertificateWithOcrInput = z.infer<typeof VerifyCertificateWithOcrInputSchema>;

const ExtractedCertificateHashSchema = z.object({
    certificateHash: z.string().describe("The SHA-256 hash extracted from the document."),
});


export async function verifyCertificateWithOcr(input: VerifyCertificateWithOcrInput): Promise<VerifyCertificateOutput> {
  return verifyCertificateWithOcrFlow(input);
}


const ocrPrompt = ai.definePrompt({
    name: 'ocrCertificateHashPrompt',
    input: { schema: z.object({ photoDataUri: z.string() }) },
    output: { schema: ExtractedCertificateHashSchema },
    prompt: `You are an expert at extracting information from academic certificates. 
    
    Analyze the following certificate image and extract only the Blockchain Hash (SHA-256) value. 
    It is a long alphanumeric string.

    Here is the certificate image:
    {{media url=photoDataUri}}
    `,
});


const verifyCertificateWithOcrFlow = ai.defineFlow(
  {
    name: 'verifyCertificateWithOcrFlow',
    inputSchema: VerifyCertificateWithOcrInputSchema,
    outputSchema: z.custom<VerifyCertificateOutput>(),
  },
  async (input) => {
    const { photoDataUri } = input;

    // Step 1: Extract hash from the image using the OCR prompt
    const { output: extractedData } = await ocrPrompt({ photoDataUri });

    if (!extractedData?.certificateHash) {
        throw new Error('Failed to extract certificate hash from the image.');
    }
    
    const { certificateHash } = extractedData;

    // Step 2: Look up the certificate in the database using the extracted hash
    const certificateRecord = db.certificates.find(c => c.certificateHash === certificateHash);

    if (certificateRecord) {
      return {
        verified: true,
        message: 'Certificate has been successfully verified via direct hash lookup.',
        certificateDetails: {
          studentName: certificateRecord.studentName,
          course: certificateRecord.course,
          institution: certificateRecord.institution,
        }
      };
    } else {
      return {
        verified: false,
        message: 'Verification failed. The hash extracted from the document does not match any record in our database.',
      };
    }
  }
);

