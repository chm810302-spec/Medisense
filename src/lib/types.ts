import type { Timestamp } from "firebase/firestore";

export type Feedback = {
  id: string;
  name: string;
  satisfaction: number;
  improvement: string;
  message: string;
  timestamp: Timestamp;
  isUrgent?: boolean;
  urgencyCategory?: string;
  summaryOfConcern?: string;
};
