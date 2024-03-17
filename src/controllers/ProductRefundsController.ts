import { Request, Response } from "express";
import trycatchHelper from "../util/functions/trycatch";
import { OrderDetails, ProductRefunds } from "@prisma/client";
import prismaClient from "../config/prismaConfig";
import Orders, { TOrderIncludeDto } from "../models/Orders";
import CustomError, { checkErrProperties } from "../helpers/customError";
import ProductRefundsModel from "../models/ProductRefund";

class ProductRefundsController {
    private orderModel = Orders;
    private model = ProductRefundsModel;

    constructor(private req:Request, private res:Response){}

    public async createRefund(orderId:string){
        const {data: orderInfo, error:fetchErr} = await trycatchHelper<TOrderIncludeDto>(
            () => this.orderModel.getOrderById(orderId)
        )

        if(fetchErr) return checkErrProperties(this.res, fetchErr);

        if(!orderInfo) return this.res.status(400).json({err: "No such order exists"});

        //Create a refund request for each product in the order items

        const refundPromises = orderInfo.items.map(async item => {
            const {data: refundedInfo, error:createErr} = await trycatchHelper<ProductRefunds>(
                () => this.model.createRefund({
                    orderId: orderInfo.id,
                    productId: item.id,
                    refundAmount: (item.quantity * item.price),
                    refundQuantity: item.quantity
                })
            );

            if(createErr) throw new CustomError({
                message: `Error while creating refunds for order: ${orderInfo.id}`,
                code: "500"
            });

            return refundedInfo
        })

        const settledPromises = await Promise.all(refundPromises);

        return settledPromises;
    }

}

export default ProductRefundsController