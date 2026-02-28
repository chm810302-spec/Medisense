'use server';
/**
 * @fileOverview This file defines a Genkit flow to identify and categorize urgent patient concerns from feedback.
 *
 * - flagUrgentFeedbackConcerns - A function that flags and categorizes urgent patient concerns.
 * - FlagUrgentFeedbackConcernsInput - The input type for the flagUrgentFeedbackConcerns function.
 * - FlagUrgentFeedbackConcernsOutput - The return type for the flagUrgentFeedbackConcerns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlagUrgentFeedbackConcernsInputSchema = z.object({
  satisfactionRating: z.number().int().min(1).max(5).describe('The patient\u0027s satisfaction rating (1-5 stars).'),
  improvementSuggestion: z.string().optional().describe('Suggestions from the patient for improvement.'),
  messageForStaff: z.string().optional().describe('Any message provided by the patient for the medical staff.'),
});
export type FlagUrgentFeedbackConcernsInput = z.infer<typeof FlagUrgentFeedbackConcernsInputSchema>;

const FlagUrgentFeedbackConcernsOutputSchema = z.object({
  isUrgent: z.boolean().describe('True if the feedback contains an urgent or critical concern.'),
  urgencyCategory: z.enum([
    'Medical Emergency',
    'Safety Concern',
    'Billing Issue',
    'Staff Conduct',
    'Facility Issue',
    'Appointment/Scheduling Issue',
    'General Complaint',
    'Compliment',
    'None',
  ]).describe('The category of the urgent concern, or \u0027None\u0027 if not urgent.').default('None'),
  summaryOfConcern: z.string().describe('A concise summary of the urgent concern, or an empty string if no urgent concern is found.'),
});
export type FlagUrgentFeedbackConcernsOutput = z.infer<typeof FlagUrgentFeedbackConcernsOutputSchema>;

export async function flagUrgentFeedbackConcerns(input: FlagUrgentFeedbackConcernsInput): Promise<FlagUrgentFeedbackConcernsOutput> {
  return flagUrgentFeedbackConcernsFlow(input);
}

const flagUrgentFeedbackConcernsPrompt = ai.definePrompt({
  name: 'flagUrgentFeedbackConcernsPrompt',
  input: {schema: FlagUrgentFeedbackConcernsInputSchema},
  output: {schema: FlagUrgentFeedbackConcernsOutputSchema},
  prompt: `You are an AI assistant for a clinic administrator. Your task is to analyze patient feedback and identify any urgent or critical concerns that require immediate attention.\n\nAn urgent concern is anything that poses an immediate health risk, a safety hazard, severe patient discomfort, a critical administrative error, or a significant complaint about staff conduct or facility conditions.\n\nCategorize the urgency as one of the following:\n- 'Medical Emergency': Concerns related to patient health that require immediate medical intervention.\n- 'Safety Concern': Concerns about patient or staff safety, cleanliness, or hazardous conditions.\n- 'Billing Issue': Critical issues related to incorrect or fraudulent billing.\n- 'Staff Conduct': Serious complaints about staff behavior, professionalism, or ethics.\n- 'Facility Issue': Significant problems with the clinic environment, equipment, or accessibility.\n- 'Appointment/Scheduling Issue': Critical problems with appointments leading to significant inconvenience or missed care.\n- 'General Complaint': Non-urgent complaints that require attention but not immediate action.\n- 'Compliment': Positive feedback.\n- 'None': No urgent concerns identified.\n\nIf an urgent concern is identified, set 'isUrgent' to true, provide the most appropriate 'urgencyCategory', and a brief 'summaryOfConcern'. If no urgent concern is found, set 'isUrgent' to false, 'urgencyCategory' to 'None', and 'summaryOfConcern' to an empty string.\n\nPatient Satisfaction Rating: {{{satisfactionRating}}} stars\nImprovement Suggestion: {{{improvementSuggestion}}}\nMessage for Staff: {{{messageForStaff}}}\n`,
});

const flagUrgentFeedbackConcernsFlow = ai.defineFlow(
  {
    name: 'flagUrgentFeedbackConcernsFlow',
    inputSchema: FlagUrgentFeedbackConcernsInputSchema,
    outputSchema: FlagUrgentFeedbackConcernsOutputSchema,
  },
  async (input) => {
    const {output} = await flagUrgentFeedbackConcernsPrompt(input);
    return output!;
  },
);
