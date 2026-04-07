import { NextResponse } from "next/server";
import { createResearchRequest } from "@/services/report-service";
import { researchRequestSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const validation = researchRequestSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ errors: validation.error.flatten() }, { status: 400 });
  }

  const report = await createResearchRequest(validation.data);

  return NextResponse.json({ id: report.id, status: report.status }, { status: 201 });
}
