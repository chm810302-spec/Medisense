import { config } from 'dotenv';
config();

import '@/ai/flows/flag-urgent-feedback-concerns-flow.ts';
import '@/ai/flows/identify-feedback-themes-flow.ts';
import '@/ai/flows/summarize-patient-feedback-flow.ts';