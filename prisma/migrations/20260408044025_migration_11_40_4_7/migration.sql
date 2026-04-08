/*
  Warnings:

  - You are about to alter the column `companySnapshot` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `growthSignals` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `riskSignals` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `talkingPoints` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

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
    "companySnapshot" JSONB,
    "riskSignals" JSONB,
    "growthSignals" JSONB,
    "talkingPoints" JSONB,
    "generatedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Report" ("agencyName", "city", "companySnapshot", "createdAt", "generatedAt", "growthSignals", "id", "riskSignals", "state", "status", "summary", "talkingPoints", "updatedAt") SELECT "agencyName", "city", "companySnapshot", "createdAt", "generatedAt", "growthSignals", "id", "riskSignals", "state", "status", "summary", "talkingPoints", "updatedAt" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
CREATE INDEX "Report_createdAt_idx" ON "Report"("createdAt");
CREATE INDEX "Report_status_idx" ON "Report"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
