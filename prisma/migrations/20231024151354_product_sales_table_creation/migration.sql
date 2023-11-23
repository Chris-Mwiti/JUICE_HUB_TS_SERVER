/*
  Warnings:

  - Made the column `tokens` on table `discount` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `buying_price` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SupplierDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `discount` MODIFY `tokens` INTEGER NOT NULL DEFAULT 15;

-- AlterTable
ALTER TABLE `inventory` ADD COLUMN `lastRefilDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `product` ADD COLUMN `buying_price` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `supplierdetails` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `ProductSales` (
    `sales_id` VARCHAR(191) NOT NULL,
    `sales_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sales` INTEGER NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`sales_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductSales` ADD CONSTRAINT `ProductSales_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
