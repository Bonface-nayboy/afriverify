'use server';
/**
 * @fileOverview AI Support Chatbot for AfriVerify Hub.
 * Provides answers about KYC, Liveness, Pricing, and Developer tools.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SupportChatInputSchema = z.object({
  message: z.string().describe('The user message.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })).optional().describe('Previous message history.'),
});

const SupportChatOutputSchema = z.object({
  response: z.string().describe('The AI generated response.'),
});

export type SupportChatInput = z.infer<typeof SupportChatInputSchema>;
export type SupportChatOutput = z.infer<typeof SupportChatOutputSchema>;

const supportChatPrompt = ai.definePrompt({
  name: 'supportChatPrompt',
  input: { schema: SupportChatInputSchema },
  output: { schema: SupportChatOutputSchema },
  prompt: `You are the AfriVerify Support Assistant, a helpful and professional AI dedicated to assisting users of the AfriVerify Identity Trust Platform.

Knowledge Base:
- Features: Identity OCR (150+ countries), Biometric Liveness (iBeta Level 2), Face Recognition Attendance.
- Pricing: Starter (Free, 100 verifications), Pro ($499/mo, 5k verifications), Enterprise (Custom, unlimited).
- Developer: REST API, Webhooks, SDKs.
- Compliance: GDPR, POPIA, NDPR compliant.
- Location: Headquartered in Lagos, Nigeria with regional data centers in SA and Kenya.

Guidelines:
- Be concise and professional.
- Use a helpful, enterprise-focused tone.
- If you don't know something, offer to connect them with a human account manager.

User History:
{{#each history}}
- {{role}}: {{content}}
{{/each}}

User Message: {{{message}}}
`,
});

export async function supportChat(input: SupportChatInput): Promise<SupportChatOutput> {
  const { output } = await supportChatPrompt(input);
  if (!output) throw new Error('Failed to generate chat response.');
  return output;
}
