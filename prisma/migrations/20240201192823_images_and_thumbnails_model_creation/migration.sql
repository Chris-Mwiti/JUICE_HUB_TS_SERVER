/*
  Warnings:

  - You are about to drop the column `image` on the `productasset` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `productrefunds` DROP FOREIGN KEY `ProductRefunds_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `productrefunds` DROP FOREIGN KEY `ProductRefunds_productId_fkey`;

-- DropForeignKey
ALTER TABLE `productsales` DROP FOREIGN KEY `ProductSales_productId_fkey`;

-- AlterTable
ALTER TABLE `productasset` DROP COLUMN `image`;

-- CreateTable
CREATE TABLE `Images` (
    `image_id` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `assetId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThumbnailImages` (
    `thumbnail_id` VARCHAR(191) NOT NULL,
    `thumbnailUrl` VARCHAR(191) NOT NULL,
    `imageId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`thumbnail_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductRefunds` ADD CONSTRAINT `ProductRefunds_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductRefunds` ADD CONSTRAINT `ProductRefunds_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `OrderDetails`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSales` ADD CONSTRAINT `ProductSales_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Images` ADD CONSTRAINT `Images_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `ProductAsset`(`asset_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThumbnailImages` ADD CONSTRAINT `ThumbnailImages_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Images`(`image_id`) ON DELETE CASCADE ON UPDATE CASCADE;
