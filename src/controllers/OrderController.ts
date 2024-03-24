import { Request, Response } from "express";
import { TOrderDto, TOrderIncludeDto } from "../models/Orders";
import trycatchHelper from "../util/functions/trycatch";
import {
  Inventory,
  OrderDetails,
  OrderItems,
  OrderStatus,
  Product,
  ProductRefunds,
  ProductSales,
} from "@prisma/client";
import OrderItemsModel from "../models/OrderItems";
import { checkErrProperties } from "../helpers/customError";
import ResponseHandler from "../util/classes/modelResponseHandlers";
import logger from "../util/functions/logger";
import { IUser } from "../models/Interfaces/IModels";
import { TReqUser } from "../middlewares/verifyJWT";
import ProductRefundsModel from "../models/ProductRefund";
import ProductRefundsController from "./ProductRefundsController";
import ProductSalesModel from "../models/ProductSales";
import DatabaseError from "../helpers/databaseError";
import { PrismaErrorTypes } from "../helpers/prismaErrHandler";
import StockController from "./StockController";
import Orders from "../models/Orders";
import mardigalEventEmitter from "../util/events/eventEmitter";
import ProductModel, { TProductInclude } from "../models/Products";

type TUpdateBodyDto = {
  status: OrderStatus;
};

class OrderController {
  private model = Orders;
  private itemsModel = OrderItemsModel;
  private refundsController: ProductRefundsController;
  private stockController: StockController;
  private salesModel = ProductSalesModel;

  constructor(private req: Request, private res: Response) {
    this.refundsController = new ProductRefundsController(req, res);
    this.stockController = new StockController(req, res);
  }

  public async createOrder() {
    logger("orders").info("Creating new order");
    let orderDto: TOrderDto = this.req.body;
    const userInfo = this.req.user as TReqUser;

    orderDto.userId = userInfo.userId;
    // //Create the order itself
    const { data: orderInfo, error: createOrderErr } =
      await trycatchHelper<OrderDetails>(() =>
        this.model.createOrder(orderDto)
      );

    if (createOrderErr) return checkErrProperties(this.res, createOrderErr);
    if (orderInfo) {
      //Create the order items first
      const { data: orderItems, error: createErr } = await trycatchHelper<
        OrderItems[]
      >(() => this.itemsModel.createOrderItem(orderDto.items, orderInfo.id));
      if (createErr) return checkErrProperties(this.res, createErr);
      if (!orderItems)
        return this.res.status(500).json({ err: "Internal server error" });

      //Creates a notification for the newly created order
      mardigalEventEmitter.emit("newOrder");

      new ResponseHandler<OrderItems[] | null>(
        this.res,
        orderItems
      ).postResponse();
    } else {
      this.res.status(500).json({ err: "Error while creating order" });
    }
  }

  public async getAllOrders() {
    logger("orders").info("Fetching orders");
    const { data: ordersInfo, error: fetchErr } = await trycatchHelper<
      OrderDetails[]
    >(() => this.model.getAllOrders());

    if (fetchErr) return checkErrProperties(this.res, fetchErr);

    new ResponseHandler<OrderDetails[] | null>(
      this.res,
      ordersInfo
    ).getResponse();
  }

  public async getOrderById() {
    logger("orders").info("Fetching order");
    const { orderId } = this.req.params;
    const { data: orderInfo, error: fetchErr } =
      await trycatchHelper<OrderDetails>(() =>
        this.model.getOrderById(orderId)
      );
    if (fetchErr) return checkErrProperties(this.res, fetchErr);

    new ResponseHandler<OrderDetails | null>(this.res, orderInfo).getResponse();
  }

  public async updateOrderStatus() {
    logger("orders").info("Updating order");
    const { orderId } = this.req.params;
    const updateDto: TUpdateBodyDto = this.req.body;

    if (updateDto.status === "canceled") {
      const { data: refundedInfo, error: refundedErr } = await trycatchHelper<
        ProductRefunds[]
      >(() => this.refundsController.createRefund(orderId));

      //Create a new notification on cancelation of order
      mardigalEventEmitter.emit("cancelOrder", orderId);

      if (refundedErr) return checkErrProperties(this.res, refundedErr);
    }

    if (updateDto.status == "completed") {
      const { data: orderInfo, error: fetchErr } =
        await trycatchHelper<TOrderIncludeDto>(() =>
          this.model.getOrderById(orderId)
        );

      if (fetchErr) return checkErrProperties(this.res, fetchErr);

      //Create sales info for each item
      //@TODO: Shift to a product sale controller
      const salesPromises = orderInfo?.items.map(async (dto) => {
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

        logger("products").info("Fetching product");
         const {data:productInfo, error:fetchErr} = await trycatchHelper<TProductInclude>(
          () => ProductModel.getProduct(dto.productId)
         )
         if(fetchErr){
          console.log(fetchErr)
         }
         if(productInfo){
            mardigalEventEmitter.emit("completeOrder", productInfo);
         } 

        logger("inventory").info("Updating the inventory");
        const { data: inventoryInfo, error: updateErr } =
          await trycatchHelper<Inventory>(() =>
            this.stockController.reduceProductQtyByProductId(
              dto.productId,
              dto.quantity
            )
          );

        if (updateErr) return checkErrProperties(this.res, updateErr);
        return {
          inventoryInfo,
          saleInfo,
        };
      });

      if (!salesPromises)
        return this.res.status(400).json({ err: "Order does not exist" });

      await Promise.all(salesPromises);
    }

    const { data: updatedInfo, error: updateErr } =
      await trycatchHelper<TOrderIncludeDto>(() =>
        this.model.updateOrderStatus(orderId, updateDto.status)
      );

    if (updateErr) return checkErrProperties(this.res, updateErr);

    //Creates a new notification and creates a q  retailer product
    new ResponseHandler<OrderDetails | null>(
      this.res,
      updatedInfo
    ).updateResponse();
  }

  public async deleteAllOrders() {
    logger("orders").info("Deleting order");
    const { data: deletedInfos, error: deleteErr } = await trycatchHelper<
      OrderDetails[]
    >(() => this.model.deleteAllOrders());

    if (deleteErr) return checkErrProperties(this.res, deleteErr);

    new ResponseHandler<OrderDetails[] | null>(
      this.res,
      deletedInfos
    ).deleteResponse();
  }

  public async deleteOrderById() {
    logger("orders").info("Deleting order");
    const { orderId } = this.req.params;

    const { data: deletedInfo, error: deleteErr } =
      await trycatchHelper<OrderDetails>(() =>
        this.model.deleteOrderById(orderId)
      );

    if (deleteErr) return checkErrProperties(this.res, deleteErr);

    new ResponseHandler<OrderDetails | null>(
      this.res,
      deletedInfo
    ).deleteResponse();
  }
}

export default OrderController;
