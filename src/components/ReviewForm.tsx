"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  notes: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;

export function ReviewForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { toast } = useToast();

  async function onSubmit(values: FormData) {
    console.log(values);
    setLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/airflow", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(values),
        headers: {
          "content-type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to submit the form");
      }

      const data = await res.json();
      console.log("Form submitted successfully:", data);
      toast({
        title: "Scheduled: Catch up",
        description: "Friday, February 10, 2023 at 5:57 PM",
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Error submitting form:", error);
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-2 rounded-md p-8">
      {serverError && <div className="text-red-500 mb-4">{serverError}</div>}
      <div>
        <div className="mb-4">
          <Card>
            <CardHeader>
              <CardTitle>[Dataset ID]</CardTitle>
              <CardDescription>[Project ID]</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Submitter: [...]</p>
              <p>Recipient: [...] </p>
              <p>Collaborators: [...,...,...] </p>
              <p>Dataset size: [X]</p>
              <p>Remaining project quota: [Y]</p>
            </CardContent>
          </Card>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post-processing notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-2">
              <Button
                type="submit"
                disabled={loading}
                className={loading ? "opacity-50 cursor-not-allowed" : ""}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
              <Button
                type="reset"
                variant="secondary"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
