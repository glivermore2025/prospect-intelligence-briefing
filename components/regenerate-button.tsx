"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type RegenerateButtonProps = {
  reportId: string;
};

export function RegenerateButton({ reportId }: RegenerateButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleRegenerate() {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/research/${reportId}/regenerate`, { method: "POST" });
      if (!response.ok) {
        setMessage("Regeneration failed. Please try again.");
        return;
      }
      setMessage("Regeneration complete. Refreshing report...");
      router.refresh();
    } catch {
      setMessage("Network error while regenerating.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" size="sm" disabled={isLoading} onClick={handleRegenerate}>
        {isLoading ? "Regenerating..." : "Regenerate Briefing"}
      </Button>
      {message ? <p className="text-xs text-slate-600">{message}</p> : null}
    </div>
  );
}
