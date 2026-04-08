import Link from "next/link";
import type { Report } from "@prisma/client";
import { StatusBadge } from "@/components/status-badge";

type ReportHistoryRowProps = {
  report: Report;
};

export function ReportHistoryRow({ report }: ReportHistoryRowProps) {
  return (
    <div className="flex items-center justify-between rounded-md border border-slate-200 p-3">
      <div>
        <p className="font-medium text-slate-900">{report.agencyName}</p>
        <p className="text-sm text-slate-500">
          {report.city}, {report.state}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={report.status} />
        <Link href={`/report/${report.id}`} className="text-sm font-medium text-brand hover:underline">
          View
        </Link>
      </div>
    </div>
  );
}
