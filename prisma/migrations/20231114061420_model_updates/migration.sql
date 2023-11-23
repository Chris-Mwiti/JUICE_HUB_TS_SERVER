/*
  Warnings:

  - You are about to alter the column `status` on the `productrefil` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - Added the required column `productId` to the `ProductRefil` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `productrefil` ADD COLUMN `productId` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('pending', 'approved') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user';

-- AddForeignKey
ALTER TABLE `ProductRefil` ADD CONSTRAINT `ProductRefil_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
