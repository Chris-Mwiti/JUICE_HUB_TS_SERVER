/*
  Warnings:

  - You are about to alter the column `status` on the `discount` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - You are about to alter the column `status` on the `orderdetails` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(5))`.
  - You are about to alter the column `provider` on the `paymentdetails` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(6))`.
  - You are about to alter the column `status` on the `paymentdetails` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(7))`.
  - The values [approved] on the enum `ProductRefil_status` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `productrefunds` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customerId` on the `productrefunds` table. All the data in the column will be lost.
  - You are about to drop the column `return_id` on the `productrefunds` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `productrefunds` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `status` on the `shoppingsession` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.
  - A unique constraint covering the columns `[orderId,productId]` on the table `ProductRefunds` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `ProductRefil` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `ProductRefunds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refund_id` to the `ProductRefunds` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `productrefunds` DROP FOREIGN KEY `ProductRefunds_customerId_fkey`;

-- AlterTable
ALTER TABLE `discount` MODIFY `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'inactive';

-- AlterTable
ALTER TABLE `orderdetails` MODIFY `status` ENUM('pending', 'completed', 'refunded') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `paymentdetails` MODIFY `provider` ENUM('mpesa', 'paypal') NOT NULL DEFAULT 'mpesa',
    MODIFY `status` ENUM('pending', 'completed', 'refunded') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `productrefil` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('pending', 'completed') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `productrefunds` DROP PRIMARY KEY,
    DROP COLUMN `customerId`,
    DROP COLUMN `return_id`,
    ADD COLUMN `orderId` VARCHAR(191) NOT NULL,
    ADD COLUMN `refund_id` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('pending', 'approved') NOT NULL DEFAULT 'pending',
    ADD PRIMARY KEY (`refund_id`);

-- AlterTable
ALTER TABLE `shippingdetails` ADD COLUMN `status` ENUM('pending', 'completed', 'incomplete') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `shoppingsession` MODIFY `status` ENUM('pending', 'completed') NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE UNIQUE INDEX `ProductRefunds_orderId_productId_key` ON `ProductRefunds`(`orderId`, `productId`);

-- AddForeignKey
ALTER TABLE `ProductRefunds` ADD CONSTRAINT `ProductRefunds_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `OrderDetails`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
