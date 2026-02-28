"use server";

import { summarizePatientFeedback } from "@/ai/flows/summarize-patient-feedback-flow";
import { identifyFeedbackThemes } from "@/ai/flows/identify-feedback-themes-flow";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Feedback } from "@/lib/types";
import { format } from 'date-fns';

async function getFeedback(): Promise<Feedback[]> {
  const feedbackCol = collection(db, "patient_feedback");
  const q = query(feedbackCol, orderBy("timestamp", "desc"));
  const feedbackSnapshot = await getDocs(q);
  return feedbackSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Feedback[];
}

export async function generateSummary(): Promise<string> {
  try {
    const feedback = await getFeedback();
    if (feedback.length === 0) {
      return "No feedback available to summarize.";
    }

    const formattedFeedback = feedback.map(f => ({
      satisfaction: f.satisfaction,
      improvement: f.improvement,
      message: f.message,
      name: f.name,
      timestamp: f.timestamp ? format(f.timestamp.toDate(), 'yyyy-MM-dd HH:mm:ss') : "N/A",
      email: f.email,
      phone: f.phone,
    }));

    const summary = await summarizePatientFeedback({ feedback: formattedFeedback });
    return summary;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Failed to generate summary. Please try again.";
  }
}

export async function identifyThemes(): Promise<string[]> {
  try {
    const feedback = await getFeedback();
    if (feedback.length === 0) {
      return [];
    }

    const messages = feedback.map(f => f.message || f.improvement).filter(Boolean) as string[];

    if (messages.length === 0) {
      return ["No text feedback available to identify themes."];
    }
    
    const { themes } = await identifyFeedbackThemes({ feedbackMessages: messages });
    return themes;
  } catch (error) {
    console.error("Error identifying themes:", error);
    return ["Failed to identify themes. Please try again."];
  }
}
