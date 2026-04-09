"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchFormState = {
  agencyName: string;
  city: string;
  state: string;
};

type CreateResearchResponse = {
  id: string;
  status: "QUEUED" | "RESEARCHING" | "DRAFTED" | "COMPLETED" | "FAILED";
};

const initialState: SearchFormState = {
  agencyName: "",
  city: "",
  state: "",
};

export function SearchForm() {
  const router = useRouter();
  const [form, setForm] = useState<SearchFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        setFeedback("Could not create the report. Please check your inputs and try again.");
        return;
      }

      const data = (await response.json()) as CreateResearchResponse;
      setFeedback("Briefing request created. Redirecting to report detail...");
      setForm(initialState);
      router.push(`/report/${data.id}`);
      router.refresh();
    } catch {
      setFeedback("Network error while creating report request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-4 md:grid-cols-4" onSubmit={handleSubmit}>
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium">Agency Name</label>
        <Input
          value={form.agencyName}
          onChange={(event) => setForm((prev) => ({ ...prev, agencyName: event.target.value }))}
          placeholder="Acme Risk Advisors"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">City</label>
        <Input value={form.city} onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))} placeholder="Austin" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">State</label>
        <Input
          value={form.state}
          onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value.toUpperCase().slice(0, 2) }))}
          placeholder="TX"
          required
          minLength={2}
          maxLength={2}
        />
      </div>
      <div className="md:col-span-4 space-y-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Generating briefing…" : "Generate Briefing"}
        </Button>
        {feedback ? <p className="text-sm text-slate-600">{feedback}</p> : null}
      </div>
    </form>
  );
}
