/*
  Warnings:

  - Added the required column `orderId` to the `ProductSales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `productsales` ADD COLUMN `orderId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ProductSales` ADD CONSTRAINT `ProductSales_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `OrderDetails`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;
