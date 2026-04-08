import { AdminChart } from "@/components/admin-chart";
import { SectionCard } from "@/components/section-card";

const metrics = [
  { label: "Briefings Requested", value: "38" },
  { label: "Completed", value: "24" },
  { label: "Avg. Time", value: "3m 12s" },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <SectionCard key={metric.label} title={metric.label}>
            <p className="text-3xl font-semibold text-brand">{metric.value}</p>
          </SectionCard>
        ))}
      </div>

      <SectionCard title="Weekly Briefing Volume" description="Placeholder analytics chart for the MVP foundation.">
        <AdminChart />
      </SectionCard>
    </div>
  );
}
