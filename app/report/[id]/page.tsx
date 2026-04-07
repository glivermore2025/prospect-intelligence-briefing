import { ReportStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { getReportById } from "@/services/report-service";

type ReportDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { id } = await params;
  const report = await getReportById(id);

  if (!report && !id.startsWith("placeholder")) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Report Detail</h1>

      <SectionCard title={report?.agencyName ?? "Sample Report"} description="Detailed briefing view coming next.">
        <div className="space-y-3 text-sm text-slate-700">
          <p>
            Location: {report?.city ?? "Seattle"}, {report?.state ?? "WA"}
          </p>
          <p className="flex items-center gap-2">
            Status: <StatusBadge status={report?.status ?? ReportStatus.PENDING} />
          </p>
          <p>This placeholder will evolve into a full intelligence briefing with key findings and citations.</p>
        </div>
      </SectionCard>
    </div>
  );
}
