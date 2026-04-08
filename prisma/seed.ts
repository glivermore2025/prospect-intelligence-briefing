import "dotenv/config";
import { PrismaClient, ReportStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.report.count();

  if (count > 0) {
    return;
  }

  const completed = await prisma.report.create({
    data: {
      agencyName: "Pinecrest Insurance Group",
      city: "Raleigh",
      state: "NC",
      status: ReportStatus.COMPLETED,
      summary: "Established regional agency with strong commercial lines footprint and expansion activity.",
      companySnapshot: ["Independent agency founded in 2008.", "Focuses on middle-market commercial clients in the Southeast."],
      riskSignals: ["Carrier concentration appears high in commercial property.", "Recent leadership transitions may impact renewal cycle decisions."],
      growthSignals: ["Opened a second office in Charlotte.", "Hiring producers with transportation and manufacturing specialization."],
      talkingPoints: [
        "Ask how they are diversifying property capacity ahead of CAT season.",
        "Explore producer enablement support for newly hired specialists.",
      ],
      generatedAt: new Date(),
      sources: {
        create: [
          {
            title: "Company About Page",
            url: "https://example.com/pinecrest/about",
            sourceType: "WEBSITE",
          },
        ],
      },
    },
  });

  await prisma.report.createMany({
    data: [
      {
        agencyName: "Harborline Benefits",
        city: "Tampa",
        state: "FL",
        status: ReportStatus.QUEUED,
      },
      {
        agencyName: "Summit Shield Partners",
        city: "Boise",
        state: "ID",
        status: ReportStatus.RESEARCHING,
        summary: "Research phase in progress with source collection underway.",
      },
      {
        agencyName: "Berg Hospitality",
        city: "Houston",
        state: "TX",
        status: ReportStatus.DRAFTED,
        summary: "Draft assembled; pending review for sales readiness.",
      },
    ],
  });

  await prisma.usageEvent.create({
    data: {
      reportId: completed.id,
      eventType: "REPORT_VIEWED",
      metadata: {
        actor: "seed-script",
      },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
