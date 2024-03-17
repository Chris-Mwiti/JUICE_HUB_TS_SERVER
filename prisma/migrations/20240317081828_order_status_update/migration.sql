-- AlterTable
ALTER TABLE `orderdetails` MODIFY `status` ENUM('canceled', 'pending', 'completed', 'refunded') NOT NULL DEFAULT 'pending';
