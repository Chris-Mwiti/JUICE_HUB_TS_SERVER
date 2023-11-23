-- AlterTable
ALTER TABLE `inventory` MODIFY `lastRefilDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `isPerishable` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `lowLevelAlert` INTEGER NOT NULL DEFAULT 15;

-- CreateTable
CREATE TABLE `ProductRefunds` (
    `return_id` VARCHAR(191) NOT NULL,
    `returnDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `refundQuantity` INTEGER NOT NULL,
    `refundAmount` INTEGER NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`return_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductRefil` (
    `refill_id` VARCHAR(191) NOT NULL,
    `refilDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `refilAmount` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`refill_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductRefunds` ADD CONSTRAINT `ProductRefunds_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductRefunds` ADD CONSTRAINT `ProductRefunds_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
