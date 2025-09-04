// SummarizeVerificationResults.ts
'use server';

/**
 * @fileOverview Summarizes verification results using AI to identify trends and potential fraud.
 *
 * - summarizeVerificationResults - A function that summarizes verification results.
 * - SummarizeVerificationResultsInput - The input type for the summarizeVerificationResults function.
 * - SummarizeVerificationResultsOutput - The return type for the summarizeVerificationResults function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeVerificationResultsInputSchema = z.object({
  verificationLogs: z
    .string()
    .describe('A list of verification logs in JSON format.'),
});
export type SummarizeVerificationResultsInput = z.infer<
  typeof SummarizeVerificationResultsInputSchema
>;

const SummarizeVerificationResultsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summarized report of verification results, identifying trends and potential fraud patterns.'
    ),
});
export type SummarizeVerificationResultsOutput = z.infer<
  typeof SummarizeVerificationResultsOutputSchema
>;

export async function summarizeVerificationResults(
  input: SummarizeVerificationResultsInput
): Promise<SummarizeVerificationResultsOutput> {
  return summarizeVerificationResultsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeVerificationResultsPrompt',
  input: {schema: SummarizeVerificationResultsInputSchema},
  output: {schema: SummarizeVerificationResultsOutputSchema},
  prompt: `You are an AI assistant helping a Super Admin analyze certificate verification logs to identify trends and potential fraud.

  Please provide a concise summary of the following verification logs, highlighting any notable patterns, anomalies, or potential fraudulent activities:

  Verification Logs: {{{verificationLogs}}}
  `,
});

const summarizeVerificationResultsFlow = ai.defineFlow(
  {
    name: 'summarizeVerificationResultsFlow',
    inputSchema: SummarizeVerificationResultsInputSchema,
    outputSchema: SummarizeVerificationResultsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
