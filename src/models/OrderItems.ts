import { OrderItems, ProductSales } from "@prisma/client";
import prismaClient from "../config/prismaConfig";
import trycatchHelper from "../util/functions/trycatch";
import RecordIdGenerator from "./generators/RecordIdGenerator";
import DatabaseError from "../helpers/databaseError";
import { PrismaErrorTypes } from "../helpers/prismaErrHandler";
import ProductSalesModel from "./ProductSales";
import logger from "../util/functions/logger";
import { ObjectId } from "bson";

// @TODO: Recheck on this
type TOrderItem = Omit<OrderItems, "id">;
class OrderItemsModel {
  private static model = prismaClient.orderItems;
  private static salesModel = ProductSalesModel;

  public static async createOrderItem(itemDtos: TOrderItem[],orderId:string) {
    //Create Product sales for each item
    const orderItemsPromises = itemDtos.map(async (dto) => {
    
      logger("orderItem").info("Creating order item");
      const { data: itemInfo, error: createErr } =
        await trycatchHelper<OrderItems>(() =>
          this.model.create({
            data: {
              id: new ObjectId().toHexString(),
              productId: dto.productId,
              quantity: dto.quantity,
              price: dto.price,
              orderId: orderId
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

  public static async deleteAllRecords() {
    const {data:deleteInfo,error:deleteErr} = await trycatchHelper<OrderItems>(
      () => this.model.deleteMany()
    )
    if(deleteErr) throw new DatabaseError({
      message: ["Error while deleting the records", deleteErr as PrismaErrorTypes],
      code: "500"
    })
    return deleteInfo
  }
}

export default OrderItemsModel;
