import { Notifications, RetailerProducts } from "@prisma/client";
import EventEmitter from "events";
import NotificationsModel from "../../models/Notifications";
import { TProductInclude } from "../../models/Products";
import trycatchHelper from "../functions/trycatch";
import RetailProductsModel from "../../models/RetailProducts";
import DatabaseError from "../../helpers/databaseError";
import { PrismaErrorTypes } from "../../helpers/prismaErrHandler";
import logger from "../functions/logger";

class MadrigalEventEmitter extends EventEmitter {}

//New Order Event Emitter
const mardigalEventEmitter = new MadrigalEventEmitter();
mardigalEventEmitter.on("newOrder", async () => {
  logger("orders").info("Creating notification for new order");
  await NotificationsModel.createNotification({
    message: "New Order has been placed",
    title: "New Order",
    type: "orders",
    level: "info",
  });
});

mardigalEventEmitter.on("cancelOrder", async (id: string) => {
  logger("orders").info("Creating notification for cancel order");
  await NotificationsModel.createNotification({
    message: `Order ${id} has been canceled`,
    title: "Order canceled",
    type: "orders",
    level: "important",
  });
});

mardigalEventEmitter.on("getProducts", async (products: TProductInclude[]) => {
  const productsPromises = products.map(async (product) => {
    if (product.inventory.quantity <= product.lowLevelAlert) {
      logger("orders").info("Creating notification for  low level alert");
      return await NotificationsModel.createNotification({
        message: `Product ${product.productName} quantity is low`,
        title: "Product low level alert",
        type: "products",
        level: "crucial",
      });
    }
    return product;
  });

  await Promise.all(productsPromises);
});

mardigalEventEmitter.on(
  "completeOrder",
  async (productDto: TProductInclude) => {
    logger("products").info("Creating retailer product");
    const { data: productInfo, error: createErr } =
      await trycatchHelper<RetailerProducts>(() =>
        RetailProductsModel.createProduct(productDto)
      );
    if (createErr)
      throw new DatabaseError({
        message: [
          "Error while creating retailer product",
          createErr as PrismaErrorTypes,
        ],
        code: "500",
      });

    if (productInfo) {
      logger("orders").info("Creating notification for complete order");
      const { data: notificationInfo, error: createErr } =
        await trycatchHelper<Notifications>(() =>
          NotificationsModel.createNotification({
            message: "Retailer product created successfully",
            title: "Retailer product created successfully",
            type: "products",
            level: "info",
          })
        );
      if (createErr)
        throw new DatabaseError({
          message: [
            "Error while creating notification",
            createErr as PrismaErrorTypes,
          ],
          code: "500",
        });
      if (notificationInfo) {
        console.log(notificationInfo);
      }
    }
  }
);

export default mardigalEventEmitter;
