/*
  Warnings:

  - A unique constraint covering the columns `[assetId]` on the table `Images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Images_assetId_key` ON `Images`(`assetId`);
