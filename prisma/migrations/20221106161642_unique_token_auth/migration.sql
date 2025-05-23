/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `CampaignInvites` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `CampaignRoles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CampaignInvites_token_key" ON "CampaignInvites"("token");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignRoles_name_key" ON "CampaignRoles"("name");
