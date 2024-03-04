/*
  Warnings:

  - You are about to drop the `thumbnailimages` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `invoice_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receipientId` to the `invoice_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `invoice_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `invoice_reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `thumbnailimages` DROP FOREIGN KEY `ThumbnailImages_imageId_fkey`;

-- AlterTable
ALTER TABLE `invoice_reports` ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `receipientId` VARCHAR(191) NOT NULL,
    ADD COLUMN `senderId` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `supplierId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `avatarUrl` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `thumbnailimages`;

-- AddForeignKey
ALTER TABLE `invoice_reports` ADD CONSTRAINT `invoice_reports_receipientId_fkey` FOREIGN KEY (`receipientId`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice_reports` ADD CONSTRAINT `invoice_reports_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
