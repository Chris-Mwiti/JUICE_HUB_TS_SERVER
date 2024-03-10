/*
  Warnings:

  - You are about to drop the column `price` on the `product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productCode]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productSku` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selling_price` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `price`,
    ADD COLUMN `productCode` VARCHAR(191) NULL,
    ADD COLUMN `productLabel` VARCHAR(191) NOT NULL DEFAULT 'NEW',
    ADD COLUMN `productSku` VARCHAR(191) NOT NULL,
    ADD COLUMN `productTag` VARCHAR(191) NULL,
    ADD COLUMN `selling_price` INTEGER NOT NULL,
    ADD COLUMN `stockStatus` ENUM('IN_STOCK', 'OUT_STOCK') NOT NULL DEFAULT 'IN_STOCK';

-- CreateIndex
CREATE UNIQUE INDEX `Product_productCode_key` ON `Product`(`productCode`);
