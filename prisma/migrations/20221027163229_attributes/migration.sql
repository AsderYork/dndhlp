-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Character_Attributes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "characterId" INTEGER NOT NULL DEFAULT 1,
    "Strength" INTEGER NOT NULL DEFAULT 1,
    "Dexterity" INTEGER NOT NULL DEFAULT 1,
    "Constitution" INTEGER NOT NULL DEFAULT 1,
    "Intelligence" INTEGER NOT NULL DEFAULT 1,
    "Wisdom" INTEGER NOT NULL DEFAULT 1,
    "Charisma" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Character_Attributes_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Character_Attributes" ("Charisma", "Constitution", "Dexterity", "Intelligence", "Strength", "Wisdom", "characterId", "id") SELECT "Charisma", "Constitution", "Dexterity", "Intelligence", "Strength", "Wisdom", "characterId", "id" FROM "Character_Attributes";
DROP TABLE "Character_Attributes";
ALTER TABLE "new_Character_Attributes" RENAME TO "Character_Attributes";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
