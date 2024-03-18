/*
  Warnings:

  - You are about to drop the column `orderId` on the `productsales` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `productsales` DROP FOREIGN KEY `ProductSales_orderId_fkey`;

-- AlterTable
ALTER TABLE `productsales` DROP COLUMN `orderId`;
