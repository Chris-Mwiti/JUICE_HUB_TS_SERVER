/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `discount` ADD COLUMN `type` ENUM('BOGO', 'MNP', 'STANDARD') NOT NULL DEFAULT 'STANDARD';

-- CreateIndex
CREATE UNIQUE INDEX `User_phone_key` ON `User`(`phone`);
