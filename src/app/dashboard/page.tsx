import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Feedback } from "@/lib/types";
import { FeedbackDisplay } from "./components/feedback-display";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

async function getFeedback(): Promise<Feedback[]> {
  try {
    const feedbackCol = collection(db, "patient_feedback");
    const q = query(feedbackCol, orderBy("timestamp", "desc"));
    const feedbackSnapshot = await getDocs(q);
    return feedbackSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Feedback[];
  } catch (error) {
    console.error("Error fetching feedback from Firestore:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const feedbackData = await getFeedback();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">MediSense Dashboard</h1>
          <p className="text-muted-foreground">
            Review and analyze recent patient feedback.
          </p>
        </header>

        {feedbackData.length > 0 ? (
          <FeedbackDisplay initialFeedback={feedbackData} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Feedback Yet</CardTitle>
              <CardDescription>
                Once patients start submitting feedback, it will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>You can share the feedback form link with your patients to start collecting responses.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

// Ensure dynamic rendering for fresh data on each visit
export const dynamic = "force-dynamic";
