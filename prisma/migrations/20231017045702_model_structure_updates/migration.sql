/*
  Warnings:

  - You are about to drop the column `discount_id` on the `product` table. All the data in the column will be lost.
  - Added the required column `expirationDate` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Made the column `coupon` on table `discount` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `PaymentDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_discount_id_fkey`;

-- AlterTable
ALTER TABLE `discount` ADD COLUMN `expirationDate` DATETIME(3) NOT NULL,
    ADD COLUMN `tokens` INTEGER NULL,
    MODIFY `coupon` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `paymentdetails` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `discount_id`,
    ADD COLUMN `supplierId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `phone` VARCHAR(10) NULL;

-- CreateTable
CREATE TABLE `SupplierDetails` (
    `supplier_id` VARCHAR(191) NOT NULL,
    `company_name` VARCHAR(25) NOT NULL,
    `company_address` VARCHAR(25) NOT NULL,
    `company_phone` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`supplier_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoice_reports` (
    `invoice_id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `invoice_reports_orderId_key`(`orderId`),
    PRIMARY KEY (`invoice_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DiscountToProduct` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_DiscountToProduct_AB_unique`(`A`, `B`),
    INDEX `_DiscountToProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `SupplierDetails`(`supplier_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentDetails` ADD CONSTRAINT `PaymentDetails_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice_reports` ADD CONSTRAINT `invoice_reports_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `OrderDetails`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiscountToProduct` ADD CONSTRAINT `_DiscountToProduct_A_fkey` FOREIGN KEY (`A`) REFERENCES `Discount`(`discount_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiscountToProduct` ADD CONSTRAINT `_DiscountToProduct_B_fkey` FOREIGN KEY (`B`) REFERENCES `Product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
