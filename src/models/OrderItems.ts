import { OrderItems, ProductSales } from "@prisma/client";
import prismaClient from "../config/prismaConfig";
import trycatchHelper from "../util/functions/trycatch";
import RecordIdGenerator from "./generators/RecordIdGenerator";
import DatabaseError from "../helpers/databaseError";
import { PrismaErrorTypes } from "../helpers/prismaErrHandler";
import ProductSalesModel from "./ProductSales";
import logger from "../util/functions/logger";

// @TODO: Recheck on this
type TOrderItem = Omit<OrderItems, "id">;
class OrderItemsModel {
  private static model = prismaClient.orderItems;
  private static salesModel = ProductSalesModel;

  public static async createOrderItem(itemDtos: TOrderItem[]) {
    //Create Product sales for each item
    const orderItemsPromises = itemDtos.map(async (dto) => {
      logger("sale").info("Creating sale");
      const { data: saleInfo, error: saleErr } =
        await trycatchHelper<ProductSales>(() =>
          this.salesModel.createProductSale(dto.quantity, dto.productId)
        );

      if (saleErr)
        throw new DatabaseError({
          message: [
            "Error while creating product sale",
            saleErr as PrismaErrorTypes,
          ],
          code: "500",
        });

      console.log(saleInfo);

      logger("orderItem").info("Creating order item");
      const { data: itemInfo, error: createErr } =
        await trycatchHelper<OrderItems>(() =>
          this.model.create({
            data: {
              id: new RecordIdGenerator("ORDER_ITEM").generate(),
              productId: dto.productId,
              quantity: dto.quantity,
              price: dto.price
            },
          })
        );

      if (createErr)
        throw new DatabaseError({
          message: [
            "Error while creating order item",
            createErr as PrismaErrorTypes,
          ],
          code: "500",
        });

      return itemInfo;
    });

    return await Promise.all(orderItemsPromises);
  }
}

export default OrderItemsModel;
