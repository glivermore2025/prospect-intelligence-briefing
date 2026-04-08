import { ReportStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: ReportStatus;
};

const statusLabel: Record<ReportStatus, string> = {
  QUEUED: "Queued",
  RESEARCHING: "Researching",
  DRAFTED: "Drafted",
  COMPLETED: "Completed",
  FAILED: "Failed",
  PENDING: "Pending",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = status.toLowerCase() as "queued" | "researching" | "drafted" | "completed" | "failed" | "pending";
  return <Badge variant={variant}>{statusLabel[status]}</Badge>;
}
