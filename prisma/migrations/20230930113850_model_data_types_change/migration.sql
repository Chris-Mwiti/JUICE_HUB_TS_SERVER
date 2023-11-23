/*
  Warnings:

  - The primary key for the `cartitems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `status` on the `discount` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - The primary key for the `shippingdetails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `createdAt` to the `CartItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CartItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `OrderItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrderItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `RefreshTokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `RefreshTokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orderdetails` DROP FOREIGN KEY `OrderDetails_shipping_id_fkey`;

-- AlterTable
ALTER TABLE `cartitems` DROP PRIMARY KEY,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `discount` MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'inactive';

-- AlterTable
ALTER TABLE `orderdetails` MODIFY `shipping_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `orderitems` ADD COLUMN `createdAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `refreshtokens` ADD COLUMN `createdAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `shippingdetails` DROP PRIMARY KEY,
    MODIFY `shipping_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`shipping_id`);

-- AddForeignKey
ALTER TABLE `OrderDetails` ADD CONSTRAINT `OrderDetails_shipping_id_fkey` FOREIGN KEY (`shipping_id`) REFERENCES `ShippingDetails`(`shipping_id`) ON DELETE CASCADE ON UPDATE CASCADE;
