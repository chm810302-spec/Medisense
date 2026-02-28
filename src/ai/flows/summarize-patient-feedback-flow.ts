'use server';
/**
 * @fileOverview A Genkit flow for summarizing patient feedback.
 *
 * - summarizePatientFeedback - A function that handles the patient feedback summarization process.
 * - SummarizePatientFeedbackInput - The input type for the summarizePatientFeedback function.
 * - SummarizePatientFeedbackOutput - The return type for the summarizePatientFeedback function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PatientFeedbackSchema = z.object({
  satisfaction: z.number().int().min(1).max(5).describe('The patient\'s satisfaction rating (1-5 stars).'),
  improvement: z.string().optional().describe('Suggestions for improvement provided by the patient.'),
  message: z.string().optional().describe('General message or comments from the patient.'),
  name: z.string().optional().describe('The name of the patient, if provided. Defaults to "Anonymous".'),
  timestamp: z.string().describe('The timestamp of when the feedback was submitted.'),
});

const SummarizePatientFeedbackInputSchema = z.object({
  feedback: z.array(PatientFeedbackSchema).describe('An array of recent patient feedback submissions.'),
});
export type SummarizePatientFeedbackInput = z.infer<typeof SummarizePatientFeedbackInputSchema>;

const SummarizePatientFeedbackOutputSchema = z.string().describe('A summary of all patient feedback, including overall sentiment, common issues, and urgent concerns.');
export type SummarizePatientFeedbackOutput = z.infer<typeof SummarizePatientFeedbackOutputSchema>;

export async function summarizePatientFeedback(input: SummarizePatientFeedbackInput): Promise<SummarizePatientFeedbackOutput> {
  return summarizePatientFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePatientFeedbackPrompt',
  input: { schema: SummarizePatientFeedbackInputSchema },
  output: { schema: SummarizePatientFeedbackOutputSchema },
  prompt: `You are an AI assistant tasked with summarizing patient feedback for clinic administrators.\n\nAnalyze the following patient feedback submissions and provide a concise summary that includes:\n1. Overall patient sentiment (e.g., positive, mixed, negative).\n2. Common themes or issues mentioned across multiple feedback entries.\n3. Any urgent concerns or critical feedback that requires immediate attention.\n\nPresent the summary in a clear, easy-to-read format.\n\nPatient Feedback:\n{{#each feedback}}\n  --- Feedback Entry ---\n  Rating: {{{satisfaction}}} stars\n  {{#if improvement}}Improvement: {{{improvement}}}{{/if}}\n  {{#if message}}Message: {{{message}}}{{/if}}\n  {{#if name}}Name: {{{name}}}{{else}}Name: Anonymous{{/if}}\n  Timestamp: {{{timestamp}}}\n{{/each}}`,
});

const summarizePatientFeedbackFlow = ai.defineFlow(
  {
    name: 'summarizePatientFeedbackFlow',
    inputSchema: SummarizePatientFeedbackInputSchema,
    outputSchema: SummarizePatientFeedbackOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
