import { NextResponse } from "next/server";
import { createResearchRequest, listRecentReports, updateReportStatus } from "@/services/report-service";
import { reportStatusUpdateSchema, researchRequestSchema } from "@/lib/validators";

export async function GET() {
  const recentReports = await listRecentReports(10);
  return NextResponse.json({ reports: recentReports });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = researchRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten() }, { status: 400 });
    }

    const report = await createResearchRequest(validation.data);

    return NextResponse.json({ id: report.id, status: report.status }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create report request" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const validation = reportStatusUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten() }, { status: 400 });
    }

    const report = await updateReportStatus(validation.data.id, validation.data.status);
    return NextResponse.json({ id: report.id, status: report.status });
  } catch {
    return NextResponse.json({ error: "Unable to update report status" }, { status: 500 });
  }
}
