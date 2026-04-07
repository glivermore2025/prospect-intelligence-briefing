import { ReportStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { formatLocation, getReportById } from "@/services/report-service";

const fallbackReport = {
  agencyName: "Sample Report",
  city: "Seattle",
  state: "WA",
  status: ReportStatus.PENDING,
  createdAt: new Date(),
  summary: "This is placeholder content until AI-assisted briefing generation is added.",
};

type ReportDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { id } = await params;
  const report = await getReportById(id);

  if (!report && !id.startsWith("placeholder")) {
    notFound();
  }

  const reportToRender = report ?? fallbackReport;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Report Detail</h1>

      <SectionCard title={reportToRender.agencyName} description="Detailed briefing view (MVP placeholder).">
        <div className="space-y-3 text-sm text-slate-700">
          <p>Location: {formatLocation(reportToRender)}</p>
          <p className="flex items-center gap-2">
            Status: <StatusBadge status={reportToRender.status} />
          </p>
          <p>Requested: {reportToRender.createdAt.toLocaleString()}</p>
          <p>{reportToRender.summary ?? "No summary yet. The report is queued for enrichment."}</p>
        </div>
      </SectionCard>

      <SectionCard title="Sources" description="Source list placeholder for future enrichment pipeline.">
        {report?.sources.length ? (
          <ul className="space-y-2 text-sm text-slate-700">
            {report.sources.map((source) => (
              <li key={source.id} className="rounded-md border border-slate-200 p-3">
                <p className="font-medium">{source.title}</p>
                <a href={source.url} target="_blank" rel="noreferrer" className="text-brand hover:underline">
                  {source.url}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-600">No sources attached yet.</p>
        )}
      </SectionCard>
    </div>
  );
}
