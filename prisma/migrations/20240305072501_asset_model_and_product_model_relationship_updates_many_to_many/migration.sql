/*
  Warnings:

  - You are about to drop the column `asset_id` on the `product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_asset_id_fkey`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `asset_id`;

-- CreateTable
CREATE TABLE `_ProductToProductAsset` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProductToProductAsset_AB_unique`(`A`, `B`),
    INDEX `_ProductToProductAsset_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ProductToProductAsset` ADD CONSTRAINT `_ProductToProductAsset_A_fkey` FOREIGN KEY (`A`) REFERENCES `Product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductToProductAsset` ADD CONSTRAINT `_ProductToProductAsset_B_fkey` FOREIGN KEY (`B`) REFERENCES `ProductAsset`(`asset_id`) ON DELETE CASCADE ON UPDATE CASCADE;
