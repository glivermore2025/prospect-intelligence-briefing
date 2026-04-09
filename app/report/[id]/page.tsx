import { ReportStatus, type Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { RegenerateButton } from "@/components/regenerate-button";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { formatLocation, getReportById } from "@/services/report-service";

const fallbackReport = {
  id: "sample-report",
  agencyName: "Sample Report",
  city: "Seattle",
  state: "WA",
  status: ReportStatus.QUEUED,
  createdAt: new Date(),
  summary: "Prospect briefing is queued for enrichment.",
  companySnapshot: ["Core profile currently being collected."],
  riskSignals: ["No risk signals captured yet."],
  growthSignals: ["No growth signals captured yet."],
  talkingPoints: ["Open with agency priorities for the next 12 months."],
};

type ReportDetailPageProps = {
  params: Promise<{ id: string }>;
};

function asStringList(value: Prisma.JsonValue | string[] | null | undefined, fallback: string[]): string[] {
  if (Array.isArray(value)) {
    const items: string[] = [];
    for (const item of value) {
      if (typeof item === "string") {
        items.push(item);
      }
    }
    return items;
  }
  return fallback;
}

function generationModeLabel(value: unknown) {
  if (typeof value !== "string") return "Fallback (local template)";
  if (value === "openai") return "OpenAI";
  if (value === "fallback") return "Fallback (local template)";
  return value;
}

function generationModel(value: unknown) {
  return typeof value === "string" ? value : "Not recorded";
}

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { id } = await params;
  const report = await getReportById(id);

  if (!report && !id.startsWith("placeholder")) {
    notFound();
  }

  const reportToRender = report ?? fallbackReport;

  const companySnapshot = asStringList(report?.companySnapshot, fallbackReport.companySnapshot);
  const riskSignals = asStringList(report?.riskSignals, fallbackReport.riskSignals);
  const growthSignals = asStringList(report?.growthSignals, fallbackReport.growthSignals);
  const talkingPoints = asStringList(report?.talkingPoints, fallbackReport.talkingPoints);
  const usageMetadata = report?.usageEvents[0]?.metadata as { mode?: string; model?: string } | null | undefined;
  const generationMode = generationModeLabel(usageMetadata?.mode);
  const generationModelLabel = generationModel(usageMetadata?.model);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Report Detail</h1>

      <SectionCard title={reportToRender.agencyName} description="Briefing lifecycle and account context.">
        <div className="space-y-3 text-sm text-slate-700">
          <p>Location: {formatLocation(reportToRender)}</p>
          <div className="flex items-center gap-2">
            <span>Status:</span> <StatusBadge status={reportToRender.status} />
          </div>
          <p>Requested: {reportToRender.createdAt.toLocaleString()}</p>
          <p>Generated: {reportToRender.generatedAt ? reportToRender.generatedAt.toLocaleString() : "Not generated yet"}</p>
          <p>Generation Mode: {generationMode}</p>
          <p>Model: {generationModelLabel}</p>
          <p>{reportToRender.summary ?? "No summary yet. The report is queued for enrichment."}</p>
          <RegenerateButton reportId={reportToRender.id} />
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Company Snapshot">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            {companySnapshot.map((item, index) => (
              <li key={`${index}-${item}`}>{item}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Risk Signals">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            {riskSignals.map((item, index) => (
              <li key={`${index}-${item}`}>{item}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Growth Signals">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            {growthSignals.map((item, index) => (
              <li key={`${index}-${item}`}>{item}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Suggested Talking Points">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            {talkingPoints.map((item, index) => (
              <li key={`${index}-${item}`}>{item}</li>
            ))}
          </ul>
        </SectionCard>
      </div>

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
