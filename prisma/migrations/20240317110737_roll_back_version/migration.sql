-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_shippingId_fkey`;

-- DropForeignKey
ALTER TABLE `RefreshTokens` DROP FOREIGN KEY `RefreshTokens_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_inventory_id_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_supplierId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductRefunds` DROP FOREIGN KEY `ProductRefunds_productId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductRefunds` DROP FOREIGN KEY `ProductRefunds_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductRefil` DROP FOREIGN KEY `ProductRefil_productId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductSales` DROP FOREIGN KEY `ProductSales_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Images` DROP FOREIGN KEY `Images_assetId_fkey`;

-- DropForeignKey
ALTER TABLE `ShoppingSession` DROP FOREIGN KEY `ShoppingSession_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `CartItems` DROP FOREIGN KEY `CartItems_productId_fkey`;

-- DropForeignKey
ALTER TABLE `CartItems` DROP FOREIGN KEY `CartItems_sessionId_fkey`;

-- DropForeignKey
ALTER TABLE `OrderItems` DROP FOREIGN KEY `OrderItems_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `OrderItems` DROP FOREIGN KEY `OrderItems_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `PaymentDetails` DROP FOREIGN KEY `PaymentDetails_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `PaymentDetails` DROP FOREIGN KEY `PaymentDetails_userId_fkey`;

-- DropForeignKey
ALTER TABLE `ShippingDetails` DROP FOREIGN KEY `ShippingDetails_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `invoice_reports` DROP FOREIGN KEY `invoice_reports_receipientId_fkey`;

-- DropForeignKey
ALTER TABLE `invoice_reports` DROP FOREIGN KEY `invoice_reports_senderId_fkey`;

-- DropForeignKey
ALTER TABLE `invoice_reports` DROP FOREIGN KEY `invoice_reports_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `_ProductToProductAsset` DROP FOREIGN KEY `_ProductToProductAsset_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ProductToProductAsset` DROP FOREIGN KEY `_ProductToProductAsset_B_fkey`;

-- DropForeignKey
ALTER TABLE `_DiscountToProduct` DROP FOREIGN KEY `_DiscountToProduct_A_fkey`;

-- DropForeignKey
ALTER TABLE `_DiscountToProduct` DROP FOREIGN KEY `_DiscountToProduct_B_fkey`;

-- DropTable
DROP TABLE `User`;

-- DropTable
DROP TABLE `RefreshTokens`;

-- DropTable
DROP TABLE `Product`;

-- DropTable
DROP TABLE `ProductRefunds`;

-- DropTable
DROP TABLE `ProductRefil`;

-- DropTable
DROP TABLE `ProductSales`;

-- DropTable
DROP TABLE `Images`;

-- DropTable
DROP TABLE `ProductAsset`;

-- DropTable
DROP TABLE `SupplierDetails`;

-- DropTable
DROP TABLE `Category`;

-- DropTable
DROP TABLE `Inventory`;

-- DropTable
DROP TABLE `Discount`;

-- DropTable
DROP TABLE `ShoppingSession`;

-- DropTable
DROP TABLE `CartItems`;

-- DropTable
DROP TABLE `OrderDetails`;

-- DropTable
DROP TABLE `OrderItems`;

-- DropTable
DROP TABLE `PaymentDetails`;

-- DropTable
DROP TABLE `ShippingDetails`;

-- DropTable
DROP TABLE `_ProductToProductAsset`;

-- DropTable
DROP TABLE `_DiscountToProduct`;

-- CreateTable
CREATE TABLE `_discounttoproduct` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_DiscountToProduct_AB_unique`(`A` ASC, `B` ASC),
    INDEX `_DiscountToProduct_B_index`(`B` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_producttoproductasset` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProductToProductAsset_AB_unique`(`A` ASC, `B` ASC),
    INDEX `_ProductToProductAsset_B_index`(`B` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cartitems` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CartItems_productId_sessionId_key`(`productId` ASC, `sessionId` ASC),
    INDEX `CartItems_sessionId_fkey`(`sessionId` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `category_id` VARCHAR(191) NOT NULL,
    `category_name` VARCHAR(255) NOT NULL,
    `category_description` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Category_category_name_key`(`category_name` ASC),
    PRIMARY KEY (`category_id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `discount` (
    `discount_id` VARCHAR(191) NOT NULL,
    `coupon` VARCHAR(191) NOT NULL,
    `percentage` INTEGER NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'inactive',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `expirationDate` DATETIME(3) NOT NULL,
    `tokens` INTEGER NOT NULL DEFAULT 15,
    `type` ENUM('BOGO', 'MNP', 'STANDARD') NOT NULL DEFAULT 'STANDARD',

    UNIQUE INDEX `Discount_coupon_key`(`coupon` ASC),
    PRIMARY KEY (`discount_id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `images` (
    `image_id` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `assetId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Images_assetId_key`(`assetId` ASC),
    PRIMARY KEY (`image_id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory` (
    `inventory_id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `product_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `lastRefilDate` DATETIME(3) NULL,

    UNIQUE INDEX `Inventory_product_name_key`(`product_name` ASC),
    PRIMARY KEY (`inventory_id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orderdetails` (
    `order_id` VARCHAR(191) NOT NULL,
    `total` INTEGER NOT NULL,
    `status` ENUM('canceled', 'pending', 'completed', 'refunded') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`order_id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orderitems` (
    `order_item_id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `price` INTEGER NOT NULL,

    INDEX `OrderItems_order_id_fkey`(`order_id` ASC),
    UNIQUE INDEX `OrderItems_product_id_order_id_key`(`product_id` ASC, `order_id` ASC),
    PRIMARY KEY (`order_item_id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paymentdetails` (
    `payment_id` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `provider` ENUM('mpesa', 'paypal') NOT NULL DEFAULT 'mpesa',
    `status` ENUM('pending', 'completed', 'refunded') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,

    INDEX `PaymentDetails_orderId_fkey`(`orderId` ASC),
    INDEX `PaymentDetails_userId_fkey`(`userId` ASC),
    PRIMARY KEY (`payment_id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `product_id` VARCHAR(191) NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `product_description` VARCHAR(255) NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `inventory_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `supplierId` VARCHAR(191) NULL,
    `buying_price` INTEGER NOT NULL,
    `isPerishable` BOOLEAN NOT NULL DEFAULT false,
    `lowLevelAlert` INTEGER NOT NULL DEFAULT 15,
    `productCode` VARCHAR(191) NULL,
    `productLabel` VARCHAR(191) NOT NULL DEFAULT 'NEW',
    `productSku` VARCHAR(191) NOT NULL,
    `productTag` VARCHAR(191) NULL,
    `selling_price` INTEGER NOT NULL,
    `stockStatus` ENUM('IN_STOCK', 'OUT_STOCK') NOT NULL DEFAULT 'IN_STOCK',
    `published` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Product_category_id_fkey`(`category_id` ASC),
    UNIQUE INDEX `Product_inventory_id_key`(`inventory_id` ASC),
    UNIQUE INDEX `Product_productCode_key`(`productCode` ASC),
    INDEX `Product_supplierId_fkey`(`supplierId` ASC),
    PRIMARY KEY (`product_id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productasset` (
    `asset_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`asset_id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productrefil` (
    `refill_id` VARCHAR(191) NOT NULL,
    `refilDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `refilAmount` INTEGER NOT NULL,
    `status` ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProductRefil_productId_fkey`(`productId` ASC),
    PRIMARY KEY (`refill_id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productrefunds` (
    `returnDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('pending', 'approved') NOT NULL DEFAULT 'pending',
    `refundQuantity` INTEGER NOT NULL,
    `refundAmount` INTEGER NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `refund_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ProductRefunds_orderId_productId_key`(`orderId` ASC, `productId` ASC),
    INDEX `ProductRefunds_productId_fkey`(`productId` ASC),
    PRIMARY KEY (`refund_id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productsales` (
    `sales_id` VARCHAR(191) NOT NULL,
    `sales_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sales` INTEGER NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProductSales_productId_fkey`(`productId` ASC),
    PRIMARY KEY (`sales_id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refreshtokens` (
    `id` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RefreshTokens_refresh_token_key`(`refresh_token` ASC),
    INDEX `RefreshTokens_userId_fkey`(`userId` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shippingdetails` (
    `shipping_id` VARCHAR(191) NOT NULL,
    `county` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `town` VARCHAR(191) NOT NULL,
    `location_desc` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modified_at` DATETIME(3) NOT NULL,
    `status` ENUM('pending', 'completed', 'incomplete') NOT NULL DEFAULT 'pending',
    `orderId` VARCHAR(191) NOT NULL,

    INDEX `ShippingDetails_orderId_fkey`(`orderId` ASC),
    PRIMARY KEY (`shipping_id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shoppingsession` (
    `session_id` VARCHAR(191) NOT NULL,
    `total` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `status` ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ShoppingSession_user_id_key`(`user_id` ASC),
    PRIMARY KEY (`session_id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supplierdetails` (
    `supplier_id` VARCHAR(191) NOT NULL,
    `company_name` VARCHAR(25) NOT NULL,
    `company_address` VARCHAR(25) NOT NULL,
    `company_phone` VARCHAR(10) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`supplier_id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `user_id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NULL,
    `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `google_id` VARCHAR(191) NULL,
    `profileUrl` VARCHAR(191) NULL,
    `phone` VARCHAR(10) NULL,
    `avatarUrl` VARCHAR(191) NULL,
    `orderId` VARCHAR(191) NULL,
    `shippingId` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email` ASC),
    UNIQUE INDEX `User_google_id_key`(`google_id` ASC),
    INDEX `User_orderId_fkey`(`orderId` ASC),
    UNIQUE INDEX `User_phone_key`(`phone` ASC),
    INDEX `User_shippingId_fkey`(`shippingId` ASC),
    PRIMARY KEY (`user_id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `invoice_reports_receipientId_fkey` ON `invoice_reports`(`receipientId` ASC);

-- CreateIndex
CREATE INDEX `invoice_reports_senderId_fkey` ON `invoice_reports`(`senderId` ASC);

-- AddForeignKey
ALTER TABLE `_discounttoproduct` ADD CONSTRAINT `_DiscountToProduct_A_fkey` FOREIGN KEY (`A`) REFERENCES `discount`(`discount_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_discounttoproduct` ADD CONSTRAINT `_DiscountToProduct_B_fkey` FOREIGN KEY (`B`) REFERENCES `product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_producttoproductasset` ADD CONSTRAINT `_ProductToProductAsset_A_fkey` FOREIGN KEY (`A`) REFERENCES `product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_producttoproductasset` ADD CONSTRAINT `_ProductToProductAsset_B_fkey` FOREIGN KEY (`B`) REFERENCES `productasset`(`asset_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cartitems` ADD CONSTRAINT `CartItems_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cartitems` ADD CONSTRAINT `CartItems_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `shoppingsession`(`session_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `images` ADD CONSTRAINT `Images_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `productasset`(`asset_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice_reports` ADD CONSTRAINT `invoice_reports_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orderdetails`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice_reports` ADD CONSTRAINT `invoice_reports_receipientId_fkey` FOREIGN KEY (`receipientId`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice_reports` ADD CONSTRAINT `invoice_reports_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderitems` ADD CONSTRAINT `OrderItems_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orderdetails`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderitems` ADD CONSTRAINT `OrderItems_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paymentdetails` ADD CONSTRAINT `PaymentDetails_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orderdetails`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paymentdetails` ADD CONSTRAINT `PaymentDetails_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `Product_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `Product_inventory_id_fkey` FOREIGN KEY (`inventory_id`) REFERENCES `inventory`(`inventory_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `Product_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplierdetails`(`supplier_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productrefil` ADD CONSTRAINT `ProductRefil_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productrefunds` ADD CONSTRAINT `ProductRefunds_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orderdetails`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productrefunds` ADD CONSTRAINT `ProductRefunds_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productsales` ADD CONSTRAINT `ProductSales_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refreshtokens` ADD CONSTRAINT `RefreshTokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shippingdetails` ADD CONSTRAINT `ShippingDetails_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orderdetails`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shoppingsession` ADD CONSTRAINT `ShoppingSession_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `User_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orderdetails`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `User_shippingId_fkey` FOREIGN KEY (`shippingId`) REFERENCES `shippingdetails`(`shipping_id`) ON DELETE CASCADE ON UPDATE CASCADE;

