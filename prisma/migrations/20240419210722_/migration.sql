/*
  Warnings:

  - You are about to drop the `Assets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Assets";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "currentPrice" REAL NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boughtFor" REAL NOT NULL,
    "profi" REAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "closedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
