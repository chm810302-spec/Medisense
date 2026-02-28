import { HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-primary p-3 text-primary-foreground",
        className
      )}
    >
      <HeartPulse className="h-6 w-6" />
    </div>
  );
}
