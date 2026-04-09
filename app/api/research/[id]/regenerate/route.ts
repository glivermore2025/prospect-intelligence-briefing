import { NextResponse } from "next/server";
import { processReportGeneration } from "@/services/report-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const report = await processReportGeneration(id);

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ id: report.id, status: report.status });
  } catch {
    return NextResponse.json({ error: "Unable to regenerate report" }, { status: 500 });
  }
}
