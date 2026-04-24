'use server';
/**
 * @fileOverview An AI agent that provides concise explanations for fraud alerts.
 *
 * - explainFraudAlert - A function that generates an explanation for a fraud alert.
 * - FraudAlertExplanationInput - The input type for the explainFraudAlert function.
 * - FraudAlertExplanationOutput - The return type for the explainFraudAlert function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FraudAlertExplanationInputSchema = z.object({
  verificationId: z.string().describe('Unique identifier for the verification record.'),
  ocrData: z
    .string()
    .describe(
      'JSON string of OCR extracted data (e.g., {"name": "John Doe", "dob": "1990-01-01"})'
    ),
  faceMatchScore: z.number().describe('Face match confidence score (0-100).'),
  livenessScore: z.number().describe('Liveness detection score (0-100).'),
  fraudFlags:
    z.array(z.string()).describe('List of specific fraud flags detected (e.g., "ID Tampering", "Spoofing Attempt").'),
  riskScore: z.number().describe('Overall fraud risk score (0-100).'),
  timestamp: z.string().datetime().describe('Timestamp of the fraud alert.'),
});
export type FraudAlertExplanationInput = z.infer<typeof FraudAlertExplanationInputSchema>;

const FraudAlertExplanationOutputSchema = z.object({
  explanation: z.string().describe('A concise, AI-generated explanation of the fraud alert reasons and contributing factors.'),
  actionableInsights:
    z.array(z.string()).describe('List of actionable insights or recommended next steps to address the alert.'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).describe('Severity of the fraud alert.'),
});
export type FraudAlertExplanationOutput = z.infer<typeof FraudAlertExplanationOutputSchema>;

export async function explainFraudAlert(
  input: FraudAlertExplanationInput
): Promise<FraudAlertExplanationOutput> {
  return fraudAlertExplanationFlow(input);
}

const fraudAlertExplanationPrompt = ai.definePrompt({
  name: 'fraudAlertExplanationPrompt',
  input: { schema: FraudAlertExplanationInputSchema },
  output: { schema: FraudAlertExplanationOutputSchema },
  prompt: `You are an AI-powered fraud analyst for AfriVerify. Your task is to provide a concise, clear, and actionable explanation for a fraud alert, based on the provided verification details. Focus on the specific reasons and contributing factors.

The alert details are as follows:
Verification ID: {{{verificationId}}}
Timestamp: {{{timestamp}}}
OCR Data: {{{ocrData}}}
Face Match Score: {{{faceMatchScore}}}
Liveness Score: {{{livenessScore}}}
Fraud Flags: {{#each fraudFlags}}- {{{this}}}
{{/each}}
Risk Score: {{{riskScore}}}

Based on this information, provide:
1. A concise explanation of why this record was flagged for fraud, detailing the specific reasons and contributing factors.
2. Actionable insights or recommended next steps to address this alert.
3. An overall severity rating (LOW, MEDIUM, HIGH, CRITICAL).`,
});

const fraudAlertExplanationFlow = ai.defineFlow(
  {
    name: 'fraudAlertExplanationFlow',
    inputSchema: FraudAlertExplanationInputSchema,
    outputSchema: FraudAlertExplanationOutputSchema,
  },
  async (input) => {
    const { output } = await fraudAlertExplanationPrompt(input);
    return output!;
  }
);
