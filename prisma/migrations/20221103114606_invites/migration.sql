-- CreateTable
CREATE TABLE "CampaignInvites" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "newUsername" TEXT,
    "UserId" INTEGER,
    "AuthorId" INTEGER NOT NULL,
    "CampaignId" INTEGER NOT NULL,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deactivated" BOOLEAN NOT NULL DEFAULT false,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CampaignInvites_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CampaignInvites_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CampaignInvites_CampaignId_fkey" FOREIGN KEY ("CampaignId") REFERENCES "Campaign" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
