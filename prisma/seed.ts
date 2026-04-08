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
      summary: "Established regional agency with strong commercial lines footprint.",
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
        status: ReportStatus.PENDING,
      },
      {
        agencyName: "Summit Shield Partners",
        city: "Boise",
        state: "ID",
        status: ReportStatus.FAILED,
        summary: "Previous run failed due to missing source validation.",
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
