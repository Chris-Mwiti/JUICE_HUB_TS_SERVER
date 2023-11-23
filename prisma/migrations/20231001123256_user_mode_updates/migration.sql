-- AlterTable
ALTER TABLE `user` ADD COLUMN `google_id` VARCHAR(191) NULL,
    ADD COLUMN `profileUrl` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(255) NULL,
    MODIFY `password` VARCHAR(255) NULL;
