"use client";

import { useState, useTransition } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import type { Feedback } from "@/lib/types";
import { FeedbackTable } from "./feedback-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateSummary, identifyThemes } from "../actions";

export function FeedbackDisplay({ initialFeedback }: { initialFeedback: Feedback[] }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [themes, setThemes] = useState<string[] | null>(null);
  const [isSummaryPending, startSummaryTransition] = useTransition();
  const [isThemesPending, startThemesTransition] = useTransition();

  const handleGenerateSummary = () => {
    startSummaryTransition(async () => {
      const result = await generateSummary();
      setSummary(result);
    });
  };

  const handleIdentifyThemes = () => {
    startThemesTransition(async () => {
      const result = await identifyThemes();
      setThemes(result);
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-primary" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>
            Use AI to analyze all patient feedback and uncover key trends.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Button onClick={handleGenerateSummary} disabled={isSummaryPending}>
              {isSummaryPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Generate Summary
            </Button>
            <Button onClick={handleIdentifyThemes} disabled={isThemesPending} variant="secondary">
              {isThemesPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Identify Key Themes
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {summary && (
              <Card className="bg-background/50">
                <CardHeader>
                  <CardTitle>Feedback Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm">{summary}</p>
                </CardContent>
              </Card>
            )}
            {themes && themes.length > 0 && (
              <Card className="bg-background/50">
                <CardHeader>
                  <CardTitle>Identified Themes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1">
                    {themes.map((theme, index) => (
                      <li key={index} className="text-sm">{theme}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>All Feedback Submissions</CardTitle>
          <CardDescription>
            A complete log of all patient feedback received.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeedbackTable feedback={initialFeedback} />
        </CardContent>
      </Card>
    </div>
  );
}
