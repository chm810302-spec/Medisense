"use server";

import { z } from "zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { flagUrgentFeedbackConcerns } from "@/ai/flows/flag-urgent-feedback-concerns-flow";

const FormSchema = z.object({
  satisfaction: z.coerce.number().min(1, "Please select a rating.").max(5),
  improvement: z.string().optional(),
  message: z.string().optional(),
  name: z.string().optional(),
});

export type FormState = {
  message: string;
  success: boolean;
};

export async function submitFeedback(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    satisfaction: formData.get("satisfaction"),
    improvement: formData.get("improvement"),
    message: formData.get("message"),
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      success: false,
    };
  }

  const { satisfaction, improvement, message, name } = validatedFields.data;

  try {
    // 1. Analyze feedback for urgency with Genkit AI
    const urgencyAnalysis = await flagUrgentFeedbackConcerns({
      satisfactionRating: satisfaction,
      improvementSuggestion: improvement,
      messageForStaff: message,
    });

    // 2. Prepare data for Firestore
    const feedbackData = {
      name: name?.trim() === "" ? "Anonymous" : name,
      satisfaction,
      improvement: improvement || "",
      message: message || "",
      isUrgent: urgencyAnalysis.isUrgent,
      urgencyCategory: urgencyAnalysis.urgencyCategory,
      summaryOfConcern: urgencyAnalysis.summaryOfConcern,
      timestamp: serverTimestamp(),
    };

    // 3. Save to Firestore
    await addDoc(collection(db, "patient_feedback"), feedbackData);

    return { message: "Feedback submitted successfully!", success: true };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
}
