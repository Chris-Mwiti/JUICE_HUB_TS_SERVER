-- AlterTable
ALTER TABLE `user` ADD COLUMN `company` VARCHAR(191) NULL DEFAULT 'Madrigal',
    MODIFY `avatarUrl` VARCHAR(191) NULL DEFAULT '/avatar.jpg';
