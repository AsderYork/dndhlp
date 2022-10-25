/*
  Warnings:

  - Added the required column `sourceId` to the `Character_Race` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceId` to the `Character_Class` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Source" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "shortname" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Character_Race" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL,
    "sourceId" INTEGER NOT NULL,
    CONSTRAINT "Character_Race_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Character_Race" ("id", "name", "public") SELECT "id", "name", "public" FROM "Character_Race";
DROP TABLE "Character_Race";
ALTER TABLE "new_Character_Race" RENAME TO "Character_Race";
CREATE TABLE "new_Character_Class" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL,
    "sourceId" INTEGER NOT NULL,
    CONSTRAINT "Character_Class_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Character_Class" ("id", "name", "public") SELECT "id", "name", "public" FROM "Character_Class";
DROP TABLE "Character_Class";
ALTER TABLE "new_Character_Class" RENAME TO "Character_Class";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
