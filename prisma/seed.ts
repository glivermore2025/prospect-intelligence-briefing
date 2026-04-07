import { PrismaClient, ReportStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.report.count();

  if (count > 0) {
    return;
  }

  await prisma.report.createMany({
    data: [
      {
        agencyName: "Pinecrest Insurance Group",
        city: "Raleigh",
        state: "NC",
        status: ReportStatus.COMPLETED,
        summary: "Initial placeholder report for onboarding demos.",
        generatedAt: new Date(),
      },
      {
        agencyName: "Harborline Benefits",
        city: "Tampa",
        state: "FL",
        status: ReportStatus.PENDING,
      },
    ],
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
