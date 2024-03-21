-- AlterTable
ALTER TABLE `user` ADD COLUMN `status` ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active';
