import { ReportStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: ReportStatus;
};

const statusLabel: Record<ReportStatus, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = status.toLowerCase() as "pending" | "completed" | "failed";
  return <Badge variant={variant}>{statusLabel[status]}</Badge>;
}
