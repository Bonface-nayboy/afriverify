
'use server';
/**
 * @fileOverview AI Risk Engine for AfriVerify.
 * Calculates an overall risk score based on biometric, document, and behavioral signals.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RiskAssessmentInputSchema = z.object({
  livenessScore: z.number().describe('Biometric liveness score (0-100).'),
  faceMatchScore: z.number().describe('Face matching confidence (0-100).'),
  documentType: z.string().describe('Type of document analyzed.'),
  country: z.string().describe('Issuing country.'),
  deviceFingerprint: z.string().optional().describe('Unique ID of the capture device.'),
  behavioralSignals: z.array(z.string()).describe('Events like "low blink rate" or "multiple faces detected".'),
});

const RiskAssessmentOutputSchema = z.object({
  riskScore: z.number().describe('Overall risk score (0-100), where 100 is highest risk.'),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  flags: z.array(z.string()).describe('Specific risk indicators found.'),
  explanation: z.string().describe('Detailed AI explanation of the risk profile.'),
});

export type RiskAssessmentInput = z.infer<typeof RiskAssessmentInputSchema>;
export type RiskAssessmentOutput = z.infer<typeof RiskAssessmentOutputSchema>;

export async function assessRisk(input: RiskAssessmentInput): Promise<RiskAssessmentOutput> {
  const { output } = await riskAssessmentPrompt(input);
  if (!output) throw new Error('Risk assessment failed.');
  return output;
}

const riskAssessmentPrompt = ai.definePrompt({
  name: 'riskAssessmentPrompt',
  input: { schema: RiskAssessmentInputSchema },
  output: { schema: RiskAssessmentOutputSchema },
  prompt: `You are the AfriVerify AI Risk Engine. Your task is to analyze biometric and behavioral data to determine the fraud risk of a verification attempt.

Input Data:
Liveness: {{{livenessScore}}}%
Face Match: {{{faceMatchScore}}}%
Document: {{{documentType}}} from {{{country}}}
Behavioral Signals: {{#each behavioralSignals}}- {{{this}}}
{{/each}}

Calculate a risk score from 0 to 100.
Assign a risk level:
- LOW (0-20)
- MEDIUM (21-50)
- HIGH (51-80)
- CRITICAL (81-100)

Provide clear flags and a concise explanation.`,
});
