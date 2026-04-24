'use server';
/**
 * @fileOverview This flow extracts key personal information from uploaded ID documents.
 *
 * - kycIdDataExtraction - A function that orchestrates the ID data extraction process.
 * - KycIdDataExtractionInput - The input type for the kycIdDataExtraction function.
 * - KycIdDataExtractionOutput - The return type for the kycIdDataExtraction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const KycIdDataExtractionInputSchema = z.object({
  idFrontPhotoDataUri: z
    .string()
    .describe(
      "A photo of the front of an identity document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  idBackPhotoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo of the back of an identity document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type KycIdDataExtractionInput = z.infer<
  typeof KycIdDataExtractionInputSchema
>;

const KycIdDataExtractionOutputSchema = z.object({
  name: z.string().describe("The full name extracted from the ID."),
  dateOfBirth: z.string().describe("The date of birth extracted from the ID (e.g., 'YYYY-MM-DD')."),
  idNumber: z.string().describe("The ID document number."),
  expiryDate: z.string().describe("The expiry date of the ID (e.g., 'YYYY-MM-DD')."),
  documentType: z.string().describe("The type of the ID document (e.g., 'Passport', 'Driver\'s License', 'National ID Card')."),
  issuingCountry: z.string().describe("The country that issued the ID document."),
});
export type KycIdDataExtractionOutput = z.infer<
  typeof KycIdDataExtractionOutputSchema
>;

const kycIdDataExtractionPrompt = ai.definePrompt({
  name: 'kycIdDataExtractionPrompt',
  input: {schema: KycIdDataExtractionInputSchema},
  output: {schema: KycIdDataExtractionOutputSchema},
  prompt: `You are an expert identity document data extractor.
Your task is to accurately extract key personal information from the provided identity document images.
Categorize and summarize all relevant details into the specified JSON format.

Extract the following fields:
- Full Name
- Date of Birth (format as YYYY-MM-DD)
- ID Document Number
- Expiry Date (format as YYYY-MM-DD)
- Document Type (e.g., Passport, Driver's License, National ID Card)
- Issuing Country

Front of ID: {{media url=idFrontPhotoDataUri}}
{{#if idBackPhotoDataUri}}
Back of ID: {{media url=idBackPhotoDataUri}}
{{/if}}
`,
});

const kycIdDataExtractionFlow = ai.defineFlow(
  {
    name: 'kycIdDataExtractionFlow',
    inputSchema: KycIdDataExtractionInputSchema,
    outputSchema: KycIdDataExtractionOutputSchema,
  },
  async input => {
    const {output} = await kycIdDataExtractionPrompt(input);
    if (!output) {
      throw new Error('Failed to extract ID data from the document.');
    }
    return output;
  }
);

export async function kycIdDataExtraction(
  input: KycIdDataExtractionInput
): Promise<KycIdDataExtractionOutput> {
  return kycIdDataExtractionFlow(input);
}
