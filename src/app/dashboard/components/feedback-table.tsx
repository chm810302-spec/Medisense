"use client";

import type { Feedback } from "@/lib/types";
import { format } from "date-fns";
import { Star, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Rating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="font-medium">{value}</span>
      <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
    </div>
  );
}

const UrgencyBadge = ({ feedback }: { feedback: Feedback }) => {
  if (!feedback.isUrgent) {
    return <Badge variant="secondary">Not Urgent</Badge>;
  }

  let variant: "default" | "destructive" | "secondary" = "default";
  if (["Medical Emergency", "Safety Concern"].includes(feedback.urgencyCategory || "")) {
    variant = "destructive";
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant={variant} className="flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3" />
            {feedback.urgencyCategory || "Urgent"}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{feedback.summaryOfConcern || "This feedback was flagged as urgent."}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function FeedbackTable({ feedback }: { feedback: Feedback[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Date</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead className="text-center">Rating</TableHead>
            <TableHead>Urgency</TableHead>
            <TableHead>Message / Improvement</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedback.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-muted-foreground">
                {item.timestamp ? format(item.timestamp.toDate(), "dd MMM, yyyy") : "N/A"}
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-center">
                <Rating value={item.satisfaction} />
              </TableCell>
              <TableCell>
                <UrgencyBadge feedback={item} />
              </TableCell>
              <TableCell>
                 <div className="max-w-md truncate text-sm text-muted-foreground">
                   {item.message || item.improvement || "No comment"}
                 </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
