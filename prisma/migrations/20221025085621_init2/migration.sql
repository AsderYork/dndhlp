/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Character_Race" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Character_Class" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Character" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "raceId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "public" BOOLEAN NOT NULL,
    CONSTRAINT "Character_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Character_Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Character_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Character_Class" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
