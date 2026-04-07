import { AdminChart } from "@/components/admin-chart";
import { SectionCard } from "@/components/section-card";
import { getAdminSummary, getWeeklyVolumeData } from "@/services/report-service";

export default async function AdminPage() {
  const [summary, weeklyData] = await Promise.all([getAdminSummary(), getWeeklyVolumeData(10)]);

  const metrics = [
    { label: "Briefings Requested", value: String(summary.totalRequested) },
    { label: "Completed", value: String(summary.completed) },
    { label: "Pending", value: String(summary.pending) },
    { label: "Failed", value: String(summary.failed) },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <SectionCard key={metric.label} title={metric.label}>
            <p className="text-3xl font-semibold text-brand">{metric.value}</p>
          </SectionCard>
        ))}
      </div>

      <SectionCard title="Recent Briefing Volume" description="Report requests created over the last 10 days.">
        <AdminChart data={weeklyData} />
      </SectionCard>
    </div>
  );
}
