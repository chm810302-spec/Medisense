'use server';
/**
 * @fileOverview This file implements a Genkit flow for identifying recurring themes
 * and topics from a collection of patient feedback messages.
 *
 * - identifyFeedbackThemes - A function that takes patient feedback and returns identified themes.
 * - IdentifyFeedbackThemesInput - The input type for the identifyFeedbackThemes function.
 * - IdentifyFeedbackThemesOutput - The return type for the identifyFeedbackThemes function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IdentifyFeedbackThemesInputSchema = z.object({
  feedbackMessages: z.array(z.string()).describe('An array of patient feedback messages.'),
});
export type IdentifyFeedbackThemesInput = z.infer<typeof IdentifyFeedbackThemesInputSchema>;

const IdentifyFeedbackThemesOutputSchema = z.object({
  themes: z.array(z.string()).describe('A list of recurring themes identified from the feedback messages.'),
});
export type IdentifyFeedbackThemesOutput = z.infer<typeof IdentifyFeedbackThemesOutputSchema>;

export async function identifyFeedbackThemes(input: IdentifyFeedbackThemesInput): Promise<IdentifyFeedbackThemesOutput> {
  return identifyFeedbackThemesFlow(input);
}

const identifyFeedbackThemesPrompt = ai.definePrompt({
  name: 'identifyFeedbackThemesPrompt',
  input: { schema: IdentifyFeedbackThemesInputSchema },
  output: { schema: IdentifyFeedbackThemesOutputSchema },
  prompt: `You are a clinic administrator assistant. Analyze the following patient feedback messages and identify the main recurring themes or topics. List each theme concisely. The output should be a JSON object with a single key 'themes' which contains an array of strings, where each string is an identified theme. Do not include any other text besides the JSON object.

Patient Feedback:
{{#each feedbackMessages}}
- {{{this}}}
{{/each}}`,
});

const identifyFeedbackThemesFlow = ai.defineFlow(
  {
    name: 'identifyFeedbackThemesFlow',
    inputSchema: IdentifyFeedbackThemesInputSchema,
    outputSchema: IdentifyFeedbackThemesOutputSchema,
  },
  async (input) => {
    const { output } = await identifyFeedbackThemesPrompt(input);
    return output!;
  }
);
