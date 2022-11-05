/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,password]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "password" TEXT;
ALTER TABLE "User" ADD COLUMN "token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_token_key" ON "User"("token");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_password_key" ON "User"("name", "password");
