import { Request, Response } from "express";
import Orders, { TOrderDto, TOrderIncludeDto } from "../models/Orders";
import trycatchHelper from "../util/functions/trycatch";
import {
  Inventory,
  OrderDetails,
  OrderItems,
  OrderStatus,
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
    this.stockController = new StockController(req,res);
  }

  public async createOrder() {
    logger("orders").info("Creating new order");

    let orderDto: TOrderDto = this.req.body;
    const userInfo = this.req.user as TReqUser;

    console.log(userInfo);
    //Create the order items first
    const { data: orderItems, error: createErr } = await trycatchHelper<
      OrderItems[]
    >(() => this.itemsModel.createOrderItem(orderDto.items));
    if (createErr) return checkErrProperties(this.res, createErr);
    if (!orderItems)
      return this.res.status(500).json({ err: "Internal server error" });

    orderDto.items = orderItems;
    orderDto.userId = userInfo.userId;

    //Create the order itself
    const { data: orderInfo, error: createOrderErr } =
      await trycatchHelper<Orders>(() => this.model.createOrder(orderDto));

    if (createOrderErr) return checkErrProperties(this.res, checkErrProperties);

    new ResponseHandler<Orders | null>(this.res, orderInfo).postResponse();
  }

  public async getAllOrders() {
    logger("orders").info("Fetching orders");
    const { data: ordersInfo, error: fetchErr } = await trycatchHelper<
      Orders[]
    >(() => this.model.getAllOrders());

    if (fetchErr) return checkErrProperties(this.res, fetchErr);

    new ResponseHandler<Orders[] | null>(this.res, ordersInfo).getResponse();
  }

  public async getOrderById() {
    logger("orders").info("Fetching order");
    const { orderId } = this.req.params;
    const { data: orderInfo, error: fetchErr } = await trycatchHelper<Orders>(
      () => this.model.getOrderById(orderId)
    );
    if (fetchErr) return checkErrProperties(this.res, fetchErr);

    new ResponseHandler<Orders | null>(this.res, orderInfo).getResponse();
  }

  public async updateOrderStatus() {
    logger("orders").info("Updating order");
    const { orderId } = this.req.params;
    const updateDto: TUpdateBodyDto = this.req.body;

    if (updateDto.status === "canceled") {
      const { data: refundedInfo, error: refundedErr } = await trycatchHelper<
        ProductRefunds[]
      >(() => this.refundsController.createRefund(orderId));
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

        logger("inventory").info("Updating the inventory");
        const {data: inventoryInfo, error:updateErr} = await trycatchHelper<Inventory>(
          () => this.stockController.reduceProductQtyByProductId(dto.productId,dto.quantity)
        )

        if(updateErr) return checkErrProperties(this.res,updateErr);

        return {
          inventoryInfo,
          saleInfo
        }
      });

      if (!salesPromises)
        return this.res.status(400).json({ err: "Order does not exist" });

      await Promise.all(salesPromises);


    }

    const { data: updatedInfo, error: updateErr } =
      await trycatchHelper<Orders>(() =>
        this.model.updateOrderStatus(orderId, updateDto.status)
      );

    if (updateErr) return checkErrProperties(this.res, updateErr);

    new ResponseHandler<Orders | null>(this.res, updatedInfo).updateResponse();
  }

  public async deleteAllOrders() {
    logger("orders").info("Deleting order");
    const { data: deletedInfos, error: deleteErr } = await trycatchHelper<
      Orders[]
    >(() => this.model.deleteAllOrders());

    if (deleteErr) return checkErrProperties(this.res, deleteErr);

    new ResponseHandler<Orders[] | null>(
      this.res,
      deletedInfos
    ).deleteResponse();
  }

  public async deleteOrderById() {
    logger("orders").info("Deleting order");
    const { orderId } = this.req.params;

    const { data: deletedInfo, error: deleteErr } =
      await trycatchHelper<Orders>(() => this.model.deleteOrderById(orderId));

    if (deleteErr) return checkErrProperties(this.res, deleteErr);

    new ResponseHandler<Orders | null>(this.res, deletedInfo).deleteResponse();
  }
}

export default OrderController;
