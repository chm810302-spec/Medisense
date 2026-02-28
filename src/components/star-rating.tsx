"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center space-x-2 py-4">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <button
            type="button"
            key={starValue}
            className={cn(
              "p-2 transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full",
              (hoverValue || value) >= starValue
                ? "text-yellow-400"
                : "text-slate-300"
            )}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(0)}
            aria-label={`Rate ${starValue} out of 5 stars`}
            suppressHydrationWarning
          >
            <Star
              className="h-9 w-9"
              fill="currentColor"
            />
          </button>
        ))}
      </div>
      <div className="w-full max-w-xs flex justify-between text-xs text-muted-foreground px-2">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
    </div>
  );
}
