/*
  Warnings:

  - You are about to alter the column `metadata` on the `UsageEvent` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UsageEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT,
    "eventType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UsageEvent_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_UsageEvent" ("createdAt", "eventType", "id", "metadata", "reportId") SELECT "createdAt", "eventType", "id", "metadata", "reportId" FROM "UsageEvent";
DROP TABLE "UsageEvent";
ALTER TABLE "new_UsageEvent" RENAME TO "UsageEvent";
CREATE INDEX "UsageEvent_reportId_idx" ON "UsageEvent"("reportId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
