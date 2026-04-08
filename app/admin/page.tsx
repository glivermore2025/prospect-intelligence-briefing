import Link from "next/link";
import { ReportStatus } from "@prisma/client";
import { AdminChart } from "@/components/admin-chart";
import { ReportHistoryRow } from "@/components/report-history-row";
import { SectionCard } from "@/components/section-card";
import { getAdminSummary, getWeeklyVolumeData, listAdminReports, type ReportFilters } from "@/services/report-service";

type AdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(value: string | string[] | undefined) {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function buildFilters(params: Record<string, string | string[] | undefined>): ReportFilters {
  const status = getSingleParam(params.status);
  const city = getSingleParam(params.city);
  const state = getSingleParam(params.state);
  const dateFrom = getSingleParam(params.dateFrom);
  const dateTo = getSingleParam(params.dateTo);

  return {
    status: status && status in ReportStatus ? (status as ReportStatus) : undefined,
    city,
    state,
    dateFrom,
    dateTo,
  };
}

function buildQuery(params: Record<string, string>) {
  const query = new URLSearchParams(params);
  return query.toString();
}

function statusHref(status?: ReportStatus) {
  return status ? `/admin?status=${status}` : "/admin";
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const filters = buildFilters(params);

  const [summary, weeklyData, filteredReports] = await Promise.all([
    getAdminSummary(filters),
    getWeeklyVolumeData(10, filters),
    listAdminReports(filters),
  ]);

  const metrics = [
    { label: "Briefings Requested", value: String(summary.totalRequested), href: statusHref() },
    { label: "Queued", value: String(summary.queued), href: statusHref(ReportStatus.QUEUED) },
    { label: "Researching", value: String(summary.researching), href: statusHref(ReportStatus.RESEARCHING) },
    { label: "Drafted", value: String(summary.drafted), href: statusHref(ReportStatus.DRAFTED) },
    { label: "Completed", value: String(summary.completed), href: statusHref(ReportStatus.COMPLETED) },
    { label: "Failed", value: String(summary.failed), href: statusHref(ReportStatus.FAILED) },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-slate-600">Filter performance and click KPI cards to drill into matching reports.</p>
      </div>

      <SectionCard title="Filters">
        <form className="grid gap-3 md:grid-cols-5" method="GET">
          <input name="city" defaultValue={filters.city} placeholder="City" className="h-10 rounded-md border border-slate-300 px-3 text-sm" />
          <input name="state" defaultValue={filters.state} placeholder="State" className="h-10 rounded-md border border-slate-300 px-3 text-sm" />
          <input name="dateFrom" defaultValue={filters.dateFrom} type="date" className="h-10 rounded-md border border-slate-300 px-3 text-sm" />
          <input name="dateTo" defaultValue={filters.dateTo} type="date" className="h-10 rounded-md border border-slate-300 px-3 text-sm" />
          <select name="status" defaultValue={filters.status} className="h-10 rounded-md border border-slate-300 px-3 text-sm">
            <option value="">All statuses</option>
            {Object.values(ReportStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <div className="md:col-span-5 flex gap-3">
            <button type="submit" className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white">
              Apply Filters
            </button>
            <Link href="/admin" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
              Clear
            </Link>
          </div>
        </form>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {metrics.map((metric) => (
          <a key={metric.label} href={metric.href} className="block">
            <SectionCard title={metric.label}>
              <p className="text-3xl font-semibold text-brand">{metric.value}</p>
            </SectionCard>
          </a>
        ))}
      </div>

      <SectionCard title="Recent Briefing Volume" description="Report requests created over the last 10 days.">
        <AdminChart data={weeklyData} />
        <div className="mt-4 flex flex-wrap gap-2">
          {weeklyData.map((point) => {
            const query = buildQuery({
              dateFrom: point.date,
              dateTo: point.date,
              ...(filters.status ? { status: filters.status } : {}),
              ...(filters.city ? { city: filters.city } : {}),
              ...(filters.state ? { state: filters.state } : {}),
            });

            return (
              <a
                key={point.date}
                href={`/admin?${query}`}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:border-brand hover:text-brand"
              >
                {point.date}: {point.reports}
              </a>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Filtered Reports" description={`${filteredReports.length} result(s) with current filters.`}>
        <div className="space-y-3">
          {filteredReports.length ? (
            filteredReports.map((report) => <ReportHistoryRow key={report.id} report={report} />)
          ) : (
            <p className="text-sm text-slate-600">No reports match the selected filters.</p>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
