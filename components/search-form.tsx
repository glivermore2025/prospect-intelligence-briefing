"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchFormState = {
  agencyName: string;
  city: string;
  state: string;
};

const initialState: SearchFormState = {
  agencyName: "",
  city: "",
  state: "",
};

export function SearchForm() {
  const [form, setForm] = useState<SearchFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm(initialState);
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
      <div className="md:col-span-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Generate Briefing"}
        </Button>
      </div>
    </form>
  );
}
