-- CreateTable
CREATE TABLE "Character_Attributes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "characterId" INTEGER NOT NULL,
    "Strength" INTEGER NOT NULL,
    "Dexterity" INTEGER NOT NULL,
    "Constitution" INTEGER NOT NULL,
    "Intelligence" INTEGER NOT NULL,
    "Wisdom" INTEGER NOT NULL,
    "Charisma" INTEGER NOT NULL,
    CONSTRAINT "Character_Attributes_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Character" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "raceId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "public" BOOLEAN NOT NULL,
    "maxHealth" INTEGER NOT NULL DEFAULT 1,
    "health" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Character_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Character_Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Character_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Character_Class" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Character" ("classId", "id", "name", "public", "raceId") SELECT "classId", "id", "name", "public", "raceId" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
