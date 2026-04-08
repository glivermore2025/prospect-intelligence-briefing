import { ReportStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ResearchRequest } from "@/lib/validators";

export async function createResearchRequest(input: ResearchRequest) {
  return prisma.report.create({
    data: {
      agencyName: input.agencyName,
      city: input.city,
      state: input.state,
      status: ReportStatus.PENDING,
    },
  });
}

export async function listRecentReports(limit = 5) {
  return prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getReportById(id: string) {
  return prisma.report.findUnique({
    where: { id },
    include: { sources: true },
  });
}
