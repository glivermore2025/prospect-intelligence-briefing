import { ReportStatus } from "@prisma/client";
import { ReportHistoryRow } from "@/components/report-history-row";
import { SearchForm } from "@/components/search-form";
import { SectionCard } from "@/components/section-card";
import { appConfig } from "@/lib/constants";
import { listRecentReports } from "@/services/report-service";

export default async function HomePage() {
  const recentReports = await listRecentReports();

  const fallbackReports = [
    {
      id: "placeholder-1",
      agencyName: "Northstar Commercial",
      city: "Denver",
      state: "CO",
      status: ReportStatus.QUEUED,
      summary: null,
      generatedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const reportsToRender = recentReports.length > 0 ? recentReports : fallbackReports;

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{appConfig.name}</h1>
        <p className="text-slate-600">{appConfig.subtitle}</p>
      </section>

      <SectionCard title="Create a New Briefing" description="Start by entering basic prospect details.">
        <SearchForm />
      </SectionCard>

      <SectionCard title="Recent Reports" description="Latest generated or queued briefings.">
        <div className="space-y-3">
          {reportsToRender.map((report) => (
            <ReportHistoryRow key={report.id} report={report} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
