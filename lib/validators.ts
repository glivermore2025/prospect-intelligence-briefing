import { ReportStatus } from "@prisma/client";
import { z } from "zod";

export const researchRequestSchema = z.object({
  agencyName: z.string().trim().min(2, "Agency name is required"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().length(2, "Use a 2-letter state code").toUpperCase(),
});

export const reportStatusUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.nativeEnum(ReportStatus),
});

export type ResearchRequest = z.infer<typeof researchRequestSchema>;
