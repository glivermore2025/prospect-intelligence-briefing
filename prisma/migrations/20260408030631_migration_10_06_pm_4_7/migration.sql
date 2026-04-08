/*
  Warnings:

  - You are about to drop the column `companySnapshot` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `growthSignals` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `riskSignals` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `talkingPoints` on the `Report` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agencyName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'QUEUED',
    "summary" TEXT,
    "companySnapshot" TEXT,
    "riskSignals" TEXT,
    "growthSignals" TEXT,
    "talkingPoints" TEXT,
    "generatedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Report" ("id", "agencyName", "city", "state", "status", "summary", "companySnapshot", "riskSignals", "growthSignals", "talkingPoints", "generatedAt", "createdAt", "updatedAt") SELECT "id", "agencyName", "city", "state", "status", "summary", "companySnapshot", "riskSignals", "growthSignals", "talkingPoints", "generatedAt", "createdAt", "updatedAt" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
CREATE INDEX "Report_createdAt_idx" ON "Report"("createdAt");
CREATE INDEX "Report_status_idx" ON "Report"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
