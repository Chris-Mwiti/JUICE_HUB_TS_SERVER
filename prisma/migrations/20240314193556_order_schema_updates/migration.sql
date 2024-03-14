/*
  Warnings:

  - You are about to drop the column `user_id` on the `orderdetails` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `orderdetails` DROP FOREIGN KEY `OrderDetails_user_id_fkey`;

-- AlterTable
ALTER TABLE `orderdetails` DROP COLUMN `user_id`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `orderId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `OrderDetails`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;
