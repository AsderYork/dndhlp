/*
  Warnings:

  - A unique constraint covering the columns `[characterId]` on the table `Character_Attributes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Character_Attributes_characterId_key" ON "Character_Attributes"("characterId");
