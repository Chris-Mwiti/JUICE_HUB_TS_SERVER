/*
  Warnings:

  - You are about to drop the column `payment_id` on the `orderdetails` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_id` on the `orderdetails` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `PaymentDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `ShippingDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orderdetails` DROP FOREIGN KEY `OrderDetails_payment_id_fkey`;

-- DropForeignKey
ALTER TABLE `orderdetails` DROP FOREIGN KEY `OrderDetails_shipping_id_fkey`;

-- AlterTable
ALTER TABLE `orderdetails` DROP COLUMN `payment_id`,
    DROP COLUMN `shipping_id`;

-- AlterTable
ALTER TABLE `paymentdetails` ADD COLUMN `orderId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `shippingdetails` ADD COLUMN `orderId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `PaymentDetails` ADD CONSTRAINT `PaymentDetails_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `OrderDetails`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingDetails` ADD CONSTRAINT `ShippingDetails_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `OrderDetails`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
