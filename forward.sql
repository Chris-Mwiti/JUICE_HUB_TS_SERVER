-- RedefineIndex
CREATE UNIQUE INDEX `Orderitems_product_id_order_id_key` ON `Orderitems`(`product_id`, `order_id`);
DROP INDEX `OrderItems_product_id_order_id_key` ON `orderitems`;

-- RedefineIndex
CREATE UNIQUE INDEX `Shoppingsession_user_id_key` ON `Shoppingsession`(`user_id`);
DROP INDEX `ShoppingSession_user_id_key` ON `shoppingsession`;

