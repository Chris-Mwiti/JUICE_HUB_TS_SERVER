import { Request, Response } from "express";
import Orders, { TOrderDto } from "../models/Orders";
import trycatchHelper from "../util/functions/trycatch";
import { OrderItems, OrderStatus } from "@prisma/client";
import OrderItemsModel from "../models/OrderItems";
import { checkErrProperties } from "../helpers/customError";
import ResponseHandler from "../util/classes/modelResponseHandlers";
import logger from "../util/functions/logger";
import { IUser } from "../models/Interfaces/IModels";
import { TReqUser } from "../middlewares/verifyJWT";

class OrderController {
    private model = Orders;
    private itemsModel = OrderItemsModel;

    constructor(private req:Request, private res: Response){}

    public async createOrder(){

        logger("orders").info("Creating new order");

        let orderDto:TOrderDto = this.req.body;
        const userInfo = this.req.user as TReqUser;

        //Create the order items first
        const {data: orderItems, error: createErr} = await trycatchHelper<OrderItems[]>(
            () => this.itemsModel.createOrderItem(orderDto.items)
        );
        if(createErr) return checkErrProperties(this.res, createErr);

        if(!orderItems) return this.res.status(500).json({err: "Internal server error"});

        orderDto.items = orderItems;
        orderDto.userId = userInfo.userId;

        //Create the order itself
        const {data: orderInfo, error:createOrderErr} = await trycatchHelper<Orders>(
            () => this.model.createOrder(orderDto)
        )

        if(createOrderErr) return checkErrProperties(this.res, checkErrProperties);

        new ResponseHandler<Orders | null>(this.res, orderInfo).postResponse();
    }

    public async getAllOrders(){
        const {data: ordersInfo, error: fetchErr} = await trycatchHelper<Orders[]>(
            () => this.model.getAllOrders()
        )

        if(fetchErr) return checkErrProperties(this.res,fetchErr);

        new ResponseHandler<Orders[] | null>(this.res,ordersInfo).getResponse();
    }

    public async getOrderById(){
        const { orderId } = this.req.params;
        const {data: orderInfo, error:fetchErr } = await trycatchHelper<Orders>(
            () => this.model.getOrderById(orderId)
        )
        if(fetchErr) return checkErrProperties(this.res, fetchErr);

        new ResponseHandler<Orders | null>(this.res, orderInfo).getResponse();
    }

    public async updateOrderStatus(){
        const { orderId } = this.req.params;
        const status:OrderStatus = this.req.body
        const {data: updatedInfo, error:updateErr } = await trycatchHelper<Orders>(
            () => this.model.updateOrderStatus(orderId, status)
        )

        if(updateErr) return checkErrProperties(this.res, updateErr);

        new ResponseHandler<Orders | null>(this.res, updatedInfo).updateResponse();
    }

    public async deleteAllOrders() {
        const {data: deletedInfos, error: deleteErr} = await trycatchHelper<Orders[]>(
            () => this.model.deleteAllOrders()
        )

        if(deleteErr) return checkErrProperties(this.res, deleteErr);

        new ResponseHandler<Orders[] | null>(this.res, deletedInfos).deleteResponse();
    }

    public async deleteOrderById(){
        const {orderId} = this.req.params;

        const {data: deletedInfo, error:deleteErr} = await trycatchHelper<Orders>(
            () => this.model.deleteOrderById(orderId)
        )

        if(deleteErr) return checkErrProperties(this.res, deleteErr)

        new ResponseHandler<Orders | null>(this.res,deletedInfo).deleteResponse();
    }


}


export default OrderController
