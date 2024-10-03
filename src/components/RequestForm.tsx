"use client";

import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  instrumentId: z.string().min(1, {
    message: "Must select an instrument",
  }),
  projectId: z.string().min(1),
  submitter: z.string().regex(/^[a-z]+\.[a-z]+$/, {
    message: "Invalid WEHI username",
  }),
  recipient: z.string().regex(/^[a-z]+\.[a-z]+$/, {
    message: "Invalid WEHI username",
  }),
  srcFolder: z.string().min(1),
  sessionId: z.string().min(1),
  notes: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;

export type Instrument = {
  id: string;
  instrumentId: string;
  displayName: string;
};

export function RequestForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instrumentId: "",
      projectId: "",
      submitter: "",
      recipient: "",
      srcFolder: "",
      sessionId: "",
      notes: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const { toast } = useToast();

  const abortController = new AbortController();

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
        title: "Form submitted",
        description: `${new Date().toLocaleString()}`,
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

  useEffect(() => {
    async function fetchInstruments() {
      try {
        const res = await fetch("/api/instruments", {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error();
        }

        const data = await res.json();
        setInstruments(data);
      } catch (error) {
        setServerError("Failed to fetch instruments.");
      }
    }

    fetchInstruments();

    return () => {
      // Cancel request if the component is unmounted
      abortController.abort();
    };
  }, []);

  return (
    <div className="border-2 rounded-md p-8">
      {serverError && <div className="text-red-500 mb-4">{serverError}</div>}
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="instrumentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instrument ID</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={instruments.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an instrument" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {instruments.map((instrument) => (
                        <SelectItem
                          key={instrument.id}
                          value={instrument.instrumentId}
                        >
                          {instrument.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="submitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Submitter</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="srcFolder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source folder</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sessionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
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
                disabled={loading || instruments.length === 0}
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
