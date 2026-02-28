"use client";

import { useEffect, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Send, Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { submitFeedback, type FormState } from "@/lib/actions";
import { StarRating } from "./star-rating";
import { Separator } from "@/components/ui/separator";

const FormSchema = z.object({
  satisfaction: z.coerce.number().min(1, "Please select a rating.").max(5),
  improvement: z.string().optional(),
  message: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal("")),
  phone: z.string().optional(),
});

const initialState: FormState = {
  message: "",
  success: false,
};

export function FeedbackForm() {
  const [formState, formAction] = useActionState(submitFeedback, initialState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      satisfaction: 0,
      improvement: "",
      message: "",
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (formState.message) {
      if (formState.success) {
        setIsSubmitted(true);
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: formState.message,
        });
      }
    }
  }, [formState, toast]);

  const handleReset = () => {
    form.reset();
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <Card className="p-8 md:p-12 text-center shadow-lg animate-in fade-in-50">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-primary mb-6" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Your feedback is incredibly valuable to us. It helps us continue to
          provide the best possible care for our patients.
        </p>
        <Button onClick={handleReset} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Submit Another Response
        </Button>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6 md:p-8">
        <Form {...form}>
          <form action={formAction} className="space-y-8">
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="satisfaction"
                render={({ field }) => (
                  <FormItem className="text-center">
                    <FormLabel className="text-base font-semibold">
                      How satisfied were you with your visit today?
                      <span className="text-destructive font-bold ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <StarRating
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />
            </div>

            <div className="space-y-6">
               <FormField
                control={form.control}
                name="improvement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What could we improve?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please let us know how we can do better..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Any message for our medical staff?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your thoughts, compliments, or concerns..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Your Name{" "}
                      <span className="text-muted-foreground font-normal">
                        (Optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} suppressHydrationWarning />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Separator />

              <div className="space-y-2">
                <p className="text-base font-medium">Contact Information</p>
                <p className="text-sm text-muted-foreground">
                  Provide your details if you'd like us to follow up on your feedback (optional).
                </p>
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} suppressHydrationWarning />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="0412 345 678" {...field} suppressHydrationWarning />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full text-lg py-6" disabled={pending} suppressHydrationWarning>
      {pending ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <Send className="mr-2 h-5 w-5" />
      )}
      {pending ? "Submitting..." : "Submit Feedback"}
    </Button>
  );
}
