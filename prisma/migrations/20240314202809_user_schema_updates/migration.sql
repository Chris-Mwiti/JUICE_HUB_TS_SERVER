/*
  Warnings:

  - You are about to drop the column `user_id` on the `shippingdetails` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `shippingdetails` DROP FOREIGN KEY `ShippingDetails_user_id_fkey`;

-- AlterTable
ALTER TABLE `shippingdetails` DROP COLUMN `user_id`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `shippingId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_shippingId_fkey` FOREIGN KEY (`shippingId`) REFERENCES `ShippingDetails`(`shipping_id`) ON DELETE CASCADE ON UPDATE CASCADE;
