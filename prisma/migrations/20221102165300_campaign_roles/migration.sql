-- CreateTable
CREATE TABLE "CampaignRoles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CampaignPlayers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "CampaignId" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,
    "RoleId" INTEGER NOT NULL,
    CONSTRAINT "CampaignPlayers_CampaignId_fkey" FOREIGN KEY ("CampaignId") REFERENCES "Campaign" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CampaignPlayers_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CampaignPlayers_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES "CampaignRoles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
